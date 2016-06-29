package org.opendaylight.webexwan.impl;

/*
 * Copyright (c) Yoyodyne, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

import com.google.common.base.Optional;
import com.google.common.base.Preconditions;
import com.google.common.util.concurrent.CheckedFuture;
import com.google.common.util.concurrent.Futures;

import org.opendaylight.webexwan.impl.util.WanIntfStats;
import org.opendaylight.webexwan.impl.util.SiteWanIntfStats;

import javassist.bytecode.analysis.Executor;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webex.wan.rev150105.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webex.wan.rev150105.config.dns.setting.input.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webex.wan.rev150105.config.dns.setting.input.dns.record.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webex.wan.rev150105.config.global.setting.input.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webex.wan.rev150105.config.site.setting.input.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webex.wan.rev150105.config.site.setting.input.wan.router.Interface;

import org.opendaylight.yangtools.concepts.ListenerRegistration;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.binding.KeyedInstanceIdentifier;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.opendaylight.yangtools.yang.common.RpcError;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Future;

public class WebexWanServiceImpl implements WebexWanService {
    private static final Logger LOG = LoggerFactory.getLogger(WebexWanServiceImpl.class);
    private WanLinkUsageManager manager;
    private WebexWanTopoMgr topoMgr;
    private String wanLIinkresult;
    private volatile long pollingInterval = 40000L;
    private volatile int minThreshold = 0;
    private Map<String,List<Interface>> wanMap = new ConcurrentHashMap<>();
    private List<DnsServer> dnsServerList = new CopyOnWriteArrayList<DnsServer>();
    private List<WanRouter> wanRouterList = new CopyOnWriteArrayList<WanRouter>();
    private Map<String, List<WanRouter>> siteRouterMap = new ConcurrentHashMap<String, List<WanRouter>>();
    private Map<String, List<DnsServer>> siteDnsServerMap = new ConcurrentHashMap<String, List<DnsServer>>();
    private Map<String, WanIntfStats>siteWanUsageMap = new ConcurrentHashMap<String, WanIntfStats>(); 
   
    private SortedSet<SiteWanIntfStats> siteUsageSortedSet = new TreeSet<SiteWanIntfStats>();

    private Map<String, List<DnsNameIpContainer>> siteDnsNameIpMap = new ConcurrentHashMap<String, List<DnsNameIpContainer>>();

    // key is site+zone, value is domain list
    private Map<String, DnsNameIpContainer> siteZoneContainer = new ConcurrentHashMap<String, DnsNameIpContainer>();
    // key is site, value is zone list
    private Map<String, Set<String>> siteZoneMap = new ConcurrentHashMap<String, Set<String>>();
    private PollingTask task;
    private Thread newTaskThread;

    public WebexWanServiceImpl(WanLinkUsageManager manager, WebexWanTopoMgr topoMgr) {
        this.manager = manager;
        this.topoMgr = topoMgr;

        task = new PollingTask(wanMap);
        newTaskThread = new Thread(task);
        newTaskThread.start();
    }

    @Override
    public Future<RpcResult<ConfigSiteSettingOutput>> configSiteSetting(ConfigSiteSettingInput input) {
        for (int i=0;i<input.getWanRouter().size();i++) {
            wanMap.put(input.getWanRouter().get(i).getWanRouterIp(),input.getWanRouter().get(i).getInterface());
        }
        task.setWanMap(wanMap);
        System.out.println(wanMap);
      
        dnsServerList.addAll(input.getDnsServer());
        wanRouterList.addAll(input.getWanRouter());
        List<WanRouter> wanRtrList = siteRouterMap.get(input.getSite());
        if (wanRtrList != null) {
            wanRtrList.addAll(input.getWanRouter());
        } else {
            wanRtrList = input.getWanRouter();
        }
        // siteRouterMap.put(input.getSite(), input.getWanRouter());
        siteRouterMap.put(input.getSite(), wanRtrList);
        siteDnsServerMap.put(input.getSite(), input.getDnsServer());
        topoMgr.updateTopology(input);

        ConfigSiteSettingOutput output = new ConfigSiteSettingOutputBuilder()
                .setResult("success")
                .build();

        return RpcResultBuilder.success(output).buildFuture();
    }

    @Override
    public Future<RpcResult<ConfigDnsSettingOutput>> configDnsSetting(ConfigDnsSettingInput input) {
        LOG.info("test dns rpc input {}", input);
        if (dnsServerList.isEmpty()) {
            return Futures.immediateFuture(RpcResultBuilder.<ConfigDnsSettingOutput>failed()
                .withError(RpcError.ErrorType.APPLICATION, "no DNS servers configured")
                .build());
        }

        for (DnsRecord rec : input.getDnsRecord()) {
            for (DnsIp ip : rec.getDnsIp()) {
                String key = ip.getSite().concat(input.getZone());
                DnsNameIpContainer dnsRecordContainer = siteZoneContainer.get(key);
                if (dnsRecordContainer == null) {
                    dnsRecordContainer = new DnsNameIpContainer(input.getZone());
                }
                dnsRecordContainer.addDnsRecord(rec.getDomainName(), ip.getIp());
                siteZoneContainer.put(key, dnsRecordContainer);

                Set<String> zoneSet = siteZoneMap.get(ip.getSite());
                if (zoneSet == null) {
                    zoneSet = new HashSet<String>();
                }
                zoneSet.add(input.getZone());
                siteZoneMap.put(ip.getSite(), zoneSet);
            }
        }

        for (DnsServer dnsServer : dnsServerList) {
            try {
                File file = new File("/tmp/ns1.txt");
                PrintWriter output = new PrintWriter(file);
                output.println("server " + dnsServer.getDnsServerIp());
                // output.println("debug yes");
                output.println("zone " + input.getZone());
                for (DnsRecord rec : input.getDnsRecord()) {
                    for (DnsIp ip : rec.getDnsIp()) {
                        StringBuilder sb = new StringBuilder();
                        sb.append("update ");
                        sb.append(rec.getOperation());
                        sb.append(" ");
                        sb.append(rec.getDomainName());
                        sb.append(" 86400 A ");
                        sb.append(ip.getIp());
                        output.println(sb.toString());
                    }
                }
                // output.println("show");
                output.println("send");
                output.close();
                Runtime r = Runtime.getRuntime();
                r.exec("nsupdate -v ns1.txt", null, new File("/tmp"));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        ConfigDnsSettingOutput output = new ConfigDnsSettingOutputBuilder()
                .setResult("success")
                .build();

        return RpcResultBuilder.success(output).buildFuture();
    }

    @Override
    public Future<RpcResult<WanLinkUsageInspectionOutput>> wanLinkUsageInspection(WanLinkUsageInspectionInput input) {

        try {
            ProcessBuilder pb = new ProcessBuilder("/home/cisco/projects/TestWan/src/./test.exp",input.getRouterIP(),input.getInterface());

            Process p1 = pb.start();
            BufferedReader br = new BufferedReader(new InputStreamReader(p1.getInputStream()));
            String  output;
            while ((output = br.readLine())!= null){
                wanLIinkresult = output;
                System.out.println(output);
            }

            br.close();
            p1.getInputStream().close();
            p1.destroy();

        }catch (Exception e){
            e.printStackTrace();
        }

         WanLinkUsageInspectionOutput output = new WanLinkUsageInspectionOutputBuilder()
                 .setResult(wanLIinkresult)
                 .build();

        return RpcResultBuilder.success(output).buildFuture();
    }


    class PollingTask implements Runnable{

        Map<String,List<Interface>> wanMap;


        @Override
        public void run() {
            while(true) {
                if (!wanMap.isEmpty()) {
                    checkWanUsage(wanMap);
                }
                try {
                    Thread.sleep(pollingInterval);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }

        public PollingTask(Map<String, List<Interface>> wanMap) {
            this.wanMap = wanMap;
        }

        protected void setWanMap(Map<String, List<Interface>> wanMap) {
            this.wanMap = wanMap;
        }
    }


    public void checkWanUsage(Map<String,List<Interface>> wanMap){
        boolean skip = true;
        SortedSet<SiteWanIntfStats> siteUsage = new TreeSet<SiteWanIntfStats>();
        for (Map.Entry<String, List<WanRouter>> entry : siteRouterMap.entrySet()) {
            Long bps = 0L;
            Long pps = 0L;
            String site = entry.getKey();
            List<WanRouter> wanRouterList = entry.getValue(); 
            for (WanRouter router : wanRouterList) { 
                List<Interface> intfList = router.getInterface();
                for (Interface intf : intfList) {
                    WanIntfStats usage = manager.execute(router.getWanRouterIp(), intf.getInterfaceId());
                    topoMgr.updateInterfaceStats(router.getWanRouterName(), intf.getInterfaceId(), usage.getOutPps(), usage.getOutBps()); 
                    System.out.println("interface stats: "+ intf.getInterfaceId() + " of router: " + router.getWanRouterName() + " is " + usage.toString());
                    // TODO: only compare bps and assume every interface is 1Gbps
                    Float minUsage = (minThreshold * 1000000000.0f) / 100.0f;
                    if (usage.getOutBps() > minUsage.longValue()) {
                        skip = false;
                    } 
                    bps += usage.getOutBps();
                    pps += usage.getOutPps();
                }
            }
            WanIntfStats stats = new WanIntfStats(pps, bps);
            siteWanUsageMap.put(site, stats);
            SiteWanIntfStats siteStats = new SiteWanIntfStats(stats, site);
            siteUsage.add(siteStats);
        }

        if (skip) {
            LOG.info("skip updating DNS servers, all wan interface usage percentage is less than {}", minThreshold);
            return;
        }

        LOG.error("site usage: {}", siteUsage);

        for (DnsServer dnsServer : dnsServerList) {
            try {
                for (SiteWanIntfStats stats : siteUsage) {
                    Set<String> zoneSet = siteZoneMap.get(stats.getSite());
                    if (zoneSet == null) {
                        continue;
                    }
                    for (String zone : zoneSet) {
                        File file = new File("/tmp/ns1.txt");
                        PrintWriter output = new PrintWriter(file);
                        output.println("server " + dnsServer.getDnsServerIp());
                        // output.println("debug yes");
                        output.println("zone " + zone);
                        String key = stats.getSite().concat(zone);
                        DnsNameIpContainer dnsRecordContainer = siteZoneContainer.get(key);
                        if (dnsRecordContainer == null) {
                            output.close();
                            continue;
                        }
                        for (DnsRecord dns : dnsRecordContainer.getDnsRecord()) {
                            StringBuilder sb = new StringBuilder();
                            sb.append("update delete ");
                            sb.append(dns.getDomainName());
                            sb.append(" 86400 A ");
                            sb.append(dns.getDnsIp().get(0).getIp());
                            output.println(sb.toString());

                            StringBuilder sb2 = new StringBuilder();
                            sb2.append("update add ");
                            sb2.append(dns.getDomainName());
                            sb2.append(" 86400 A ");
                            sb2.append(dns.getDnsIp().get(0).getIp());
                            output.println(sb2.toString());
                        }
                        // output.println("show");
                        output.println("send");
                        output.close();
                        Runtime r = Runtime.getRuntime();
                        r.exec("nsupdate -v ns1.txt", null, new File("/tmp"));
                        
                        LOG.error("dumping ns1.txt for {}", stats); 
                        BufferedReader br = new BufferedReader(new FileReader("/tmp/ns1.txt"));
                        String line = null;
                        while ((line = br.readLine()) != null) {
                            LOG.error(line);
                        }
                    }
                }
            } catch (Exception e) {
                    e.printStackTrace();
            }
        }
    }

    public Future<RpcResult<ConfigGlobalSettingOutput>> configGlobalSetting(ConfigGlobalSettingInput input) {
        if (input.getPollingInterval() != null) {
            pollingInterval = input.getPollingInterval().longValue() * 1000L;
        }

        // TODO: currently only minimal threshold is defined
        DnsPollingPolicy policy = input.getDnsPollingPolicy();
        if (policy != null) {
            minThreshold = policy.getMinimalThreshold().intValue();
        }

        ConfigGlobalSettingOutputBuilder cgsob = new ConfigGlobalSettingOutputBuilder();
        return RpcResultBuilder.success(cgsob.build()).buildFuture();
    }

    private class DnsNameIpContainer {
        private String zone;
        private List<DnsRecord> dnsRecords = new ArrayList<DnsRecord>();

        public DnsNameIpContainer(String zone) {
            this.zone = zone;
        }
        
        public String getZone() {
            return zone;
        }

        public void setZone(String zone) {
            this.zone = zone;
        }

        public void addDnsRecord(String domainName, String ip) {
            DnsRecordBuilder drb = new DnsRecordBuilder();
            DnsIpBuilder dib = new DnsIpBuilder();
            dib.setIp(ip);
            List<DnsIp> dnsIpList = new ArrayList<DnsIp>();
            dnsIpList.add(dib.build());
            drb.setDnsIp(dnsIpList);
            drb.setDomainName(domainName);
            dnsRecords.add(drb.build());
        }

        public List<DnsRecord> getDnsRecord() {
            return dnsRecords;
        }
    }
}
