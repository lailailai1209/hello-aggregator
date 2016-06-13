package org.opendaylight.hello.impl;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    public Integer execute(String ipAddr) {


        Integer usage = null;
        try {
            usage = (Integer) INSTANCE.threadpool.submit(new WorkerThread(ipAddr)).get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return usage;

    }

    class WorkerThread implements Callable {

        private final String ipaddr;


        public WorkerThread(String ipaddr) {

            this.ipaddr = ipaddr;

        }


        @Override
        public Integer call() {
            //check the wan link usage
            //check(ipaddr);
            Random random = new Random();

            Integer usage =random.nextInt(101);
            return usage;
        }
    }



}
