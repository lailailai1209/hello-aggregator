/*
 * Copyright © 2016 Yoyodyne, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.webexwan.impl;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webex.wan.rev150105.WebexWanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebexWanProvider implements BindingAwareProvider, AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(WebexWanProvider.class);
    private BindingAwareBroker.RpcRegistration<WebexWanService> webexWanService;
    private WanLinkUsageManager manager;
    private WebexWanTopoMgr webexWanTopoMgr;
    private DataBroker dataBroker;


    @Override
    public void onSessionInitiated(ProviderContext session) {
        LOG.info("WebexWanProvider Session Initiated");
        dataBroker = session.getSALService(DataBroker.class);
        webexWanTopoMgr = new WebexWanTopoMgr(dataBroker);
        this.manager = WanLinkUsageManager.getInstance();
        webexWanService = session.addRpcImplementation(WebexWanService.class,new WebexWanServiceImpl(manager, webexWanTopoMgr));
    }

    @Override
    public void close() throws Exception {
        LOG.info("WebexWanProvider Closed");
        webexWanService.close();
    }
}
