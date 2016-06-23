package org.opendaylight.webexwan.impl;


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

    public Integer execute(String ipAddr,String wanInterface) {


        Integer usage = null;
        try {
            usage = (Integer) INSTANCE.threadpool.submit(new WorkerThread(ipAddr,wanInterface)).get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return usage;

    }

    class WorkerThread implements Callable {

        private final String ipaddr;
        private final String wanInterface;


        public WorkerThread(String ipaddr,String wanInterface) {

            this.ipaddr = ipaddr;
            this.wanInterface = wanInterface;


        }


        @Override
        public Integer call() throws IOException {
            //check the wan link usage
            //check(ipaddr);
            /*
            ProcessBuilder pb = new ProcessBuilder("/home/cisco/projects/TestWan/src/./test.exp",ipaddr,wanInterface);

            Process p1 = pb.start();
            BufferedReader br = new BufferedReader(new InputStreamReader(p1.getInputStream()));
            String  output;
            if ((output = br.readLine())!= null){
                System.out.println(output);
                return Integer.parseInt(output);
            }else{
                return 10000000;
            }*/
            Random r = new Random();
            return  r.nextInt(100);



        }
    }



}
