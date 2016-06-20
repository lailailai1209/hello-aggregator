package org.opendaylight.hello.impl;

/*
 * Copyright (c) Yoyodyne, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

import javassist.bytecode.analysis.Executor;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.hello.rev150105.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.hello.rev150105.enable.dynamic.dns.adjustment.input.wan.router.Interface;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.*;
import java.util.concurrent.Future;

public class HelloWorldImpl implements HelloService {
    private static final Logger LOG = LoggerFactory.getLogger(HelloWorldImpl.class);
    private WanLinkUsageManager manager;
    private HashMap<String,List<Interface>> wanMap;
    private String wanLIinkresult;
    private Integer wanLinkUsagePerRouter;
    private Integer getWanLinkUsagePerRouterAssessment;
    private Map<Integer,String> finalResult =new TreeMap<>();

    public HelloWorldImpl(WanLinkUsageManager manager) {
        this.manager = manager;
    }

    @Override
    public Future<RpcResult<EnableDynamicDNSAdjustmentOutput>> enableDynamicDNSAdjustment(EnableDynamicDNSAdjustmentInput input) {

        for (int i=0;i<input.getWanRouter().size();i++) {
           wanMap.put(input.getWanRouter().get(i).getWanRouterIp(),input.getWanRouter().get(i).getInterface());
        }



        checkWanUsage(wanMap);

        EnableDynamicDNSAdjustmentOutput output = new EnableDynamicDNSAdjustmentOutputBuilder()
                .setResult("success")
                .build();


        return RpcResultBuilder.success(output).buildFuture();
    }

    @Override
    public Future<RpcResult<CongfigDnsSettingOutput>> congfigDnsSetting(CongfigDnsSettingInput input) {
        LOG.info("test dns rpc input {}",input);

        String server = "server "+input.getDnsServerIp();
        String debug = "debug yes";
        String zone = "zone "+input.getZone();
        try {
        File file = new File("/home/lailailai/ns3.txt");
        PrintWriter output = new PrintWriter(file);
        output.println(server);
        output.println(debug);
        output.println(zone);

        for (int i=0;i<input.getDnsRecord().size();i++){
            String update = "update "+input.getDnsRecord().get(i).getOperation()+" "+input.getDnsRecord().get(i) .getDomainName()+" 86400 "+" A "+input.getDnsRecord().get(i).getDnsIp();
            output.println(update);
        }
            output.println("show");
            output.println("send");
            output.close();
        }catch (Exception e){
            e.printStackTrace();
        }


        Runtime r = Runtime.getRuntime();
        try {

            r.exec("nsupdate -v ns3.txt",null,new File("/home/lailailai/"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        CongfigDnsSettingOutput output = new CongfigDnsSettingOutputBuilder()
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


    public void checkWanUsage(HashMap<String,List<Interface>> wanMap){


     for (String routerIp: wanMap.keySet()) {
         for (int i=0;i<wanMap.get(routerIp).size();i++) {
             int usage = manager.execute(routerIp, wanMap.get(routerIp).get(i).getInterfaceId());
             wanLinkUsagePerRouter =   wanLinkUsagePerRouter+usage;
         }
         getWanLinkUsagePerRouterAssessment = wanLinkUsagePerRouter/wanMap.get(routerIp).size();
         finalResult.put(getWanLinkUsagePerRouterAssessment,routerIp);
     }


        try {
            Thread.sleep(100000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }









        System.out.println(finalResult);

        Iterator<String> iterator = finalResult.values().iterator();

        String server = "server 10.123.43.5";
        String debug = "debug yes";
        String zone = "zone webex1.com.cm";

     try {
         File file = new File("/home/lailailai/ns3.txt");
         PrintWriter output = new PrintWriter(file);
         output.println(server);
         output.println(debug);
         output.println(zone);


         while (iterator.hasNext()) {
             String ip = iterator.next();
             System.out.println(ip);
             String update = "update add zone webex1.com.cm  86400 A " + ip;
             System.out.println(update);
             output.println(update);
         }


         output.close();
     }catch (Exception e){
         e.printStackTrace();
     }


     // execute shell script








    }






}
