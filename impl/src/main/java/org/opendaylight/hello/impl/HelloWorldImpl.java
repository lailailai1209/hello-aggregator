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
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.util.concurrent.Future;

public class HelloWorldImpl implements HelloService {
    private static final Logger LOG = LoggerFactory.getLogger(HelloWorldImpl.class);
    private WanLinkUsageManager manager;

    public HelloWorldImpl(WanLinkUsageManager manager) {
        this.manager = manager;
    }

    @Override
    public Future<RpcResult<EnableDynamicDNSAdjustmentOutput>> enableDynamicDNSAdjustment(EnableDynamicDNSAdjustmentInput input) {
        checkWanUsage();

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
            // r.exec("nsupdate -v ns3.txt",null,new File("/home/cisco/projects/ns-tool/"));
            r.exec("nsupdate -v ns3.txt",null,new File("/home/lailailai/"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        CongfigDnsSettingOutput output = new CongfigDnsSettingOutputBuilder()
                .setResult("success")
                .build();

        return RpcResultBuilder.success(output).buildFuture();
    }



    public void checkWanUsage(){




            int usage1 = manager.execute("10.0.0.1");
            int usage2 = manager.execute("10.0.0.2");
            int usage3 = manager.execute("10.0.0.3");

        try {
            Thread.sleep(100000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }



            LOG.info("link usage 10.0.0.1 ={}",usage1);
            LOG.info("link usage 10.0.0.2 ={}",usage2);
            LOG.info("link usage 10.0.0.3 ={}",usage3);


        Map<Integer,String> linkUsageMap =new TreeMap<>();
            linkUsageMap.put(usage1,"10.0.0.1");
            linkUsageMap.put(usage2,"10.0.0.2");
            linkUsageMap.put(usage3,"10.0.0.3");



        System.out.println(linkUsageMap);

        Iterator<String> iterator = linkUsageMap.values().iterator();

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
