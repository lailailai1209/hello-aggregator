package org.opendaylight.webexwan.impl;


import org.opendaylight.webexwan.impl.util.WanIntfStats;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Random;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;

/**
 * Created by lailailai on 6/9/16.
 */
public class WanLinkUsageManager {

    private static WanLinkUsageManager INSTANCE = new WanLinkUsageManager();
    private static final Logger LOG = LoggerFactory.getLogger(WanLinkUsageManager.class);
    private final ExecutorService threadpool;



    private WanLinkUsageManager(){
        this.threadpool = java.util.concurrent.Executors.newCachedThreadPool();

    }

    public static WanLinkUsageManager getInstance() {
        return INSTANCE;
    }

    public WanIntfStats execute(String ipAddr,String wanInterface) {


        WanIntfStats usage = null;
        try {
            usage = (WanIntfStats) INSTANCE.threadpool.submit(new WorkerThread(ipAddr,wanInterface)).get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return usage;

    }

    class WorkerThread implements Callable<WanIntfStats> {

        private final String ipaddr;
        private final String wanInterface;
        String linkUsagebps ="100";
        String linkUsagepps ="100";


        public WorkerThread(String ipaddr,String wanInterface) {

            this.ipaddr = ipaddr;
            this.wanInterface = wanInterface;

        }


        @Override
        public WanIntfStats call() throws IOException {
            //check the wan link usage


             try {
            ProcessBuilder pb = new ProcessBuilder("/home/cisco/projects/TestWan/src/./test.exp",ipaddr,wanInterface);

            Process p1 = pb.start();
                 Thread.sleep(1000);
            BufferedReader br = new BufferedReader(new InputStreamReader(p1.getInputStream()));
                 Thread.sleep(3000);

          if(((linkUsagebps = br.readLine())!=null)&&((linkUsagepps = br.readLine())!=null)){

                     System.out.println("bps: " + linkUsagebps);
                     System.out.println("pps: " + linkUsagepps);
                 }else{
                     System.out.println("somthings wrong");
                     linkUsagebps = "100";
                     linkUsagepps = "100";
                 }


            br.close();
            p1.getInputStream().close();
            p1.destroy();

        }catch (Exception e){
            e.printStackTrace();
        }
/*
          Random r = new Random();
            int pps = r.nextInt(100);
            int bps = pps * 128;
             WanIntfStats stats = new WanIntfStats(Integer.valueOf(pps).longValue(), Integer.valueOf(bps).longValue());
              return stats;
              */



                WanIntfStats stats = new WanIntfStats(Integer.valueOf(linkUsagepps).longValue(), Integer.valueOf(linkUsagebps).longValue());
                return stats;

            //return stats;
        }
    }
}
