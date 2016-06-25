package org.opendaylight.webexwan.impl;

import com.google.common.base.Optional;
import com.google.common.base.Preconditions;
import com.google.common.util.concurrent.CheckedFuture;
import com.google.common.util.concurrent.Futures;

import java.io.IOException;
import java.util.ArrayList;
import java.util.BitSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.DataChangeListener;
import org.opendaylight.controller.md.sal.binding.api.ReadWriteTransaction;
import org.opendaylight.controller.md.sal.binding.api.WriteTransaction;
import org.opendaylight.controller.md.sal.common.api.data.AsyncDataBroker.DataChangeScope;
import org.opendaylight.controller.md.sal.common.api.data.AsyncDataChangeEvent;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;

import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.controller.md.sal.common.api.data.TransactionCommitFailedException;

import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webex.topo.rev150105.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webex.wan.rev150105.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webex.wan.rev150105.config.site.setting.input.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.webex.wan.rev150105.config.site.setting.input.wan.router.*;

import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.inet.types.rev100924.Uri;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.LinkId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NetworkTopology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NetworkTopologyBuilder;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NodeId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.TopologyId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.TpId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.link.attributes.DestinationBuilder;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.link.attributes.SourceBuilder;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.TopologyBuilder;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.TopologyKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Link;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.LinkBuilder;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.LinkKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.NodeBuilder;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.NodeKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.node.TerminationPoint;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.node.TerminationPointBuilder;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.node.TerminationPointKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.node.attributes.SupportingNode;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.node.attributes.SupportingNodeBuilder;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.node.attributes.SupportingNodeKey;

import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.binding.KeyedInstanceIdentifier;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.opendaylight.yangtools.yang.common.RpcError;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebexWanTopoMgr {
    private static final Logger LOG = LoggerFactory.getLogger(WebexWanTopoMgr.class);

    private DataBroker dataBroker;

    public static final TopologyId WEBEXWAN_TOPOLOGY_ID = new TopologyId(new Uri("webexwan:1"));

    public WebexWanTopoMgr(DataBroker dataBroker) {
        this.dataBroker = dataBroker;
        initializeWebexwanTopology(LogicalDatastoreType.OPERATIONAL);
        List<String> intfList = new ArrayList<String>();
        intfList.add("GigabitEthernet0/1");
        intfList.add("GigabitEthernet0/2");
        createNode("SP1", intfList, "SP", null);
        createNode("SP2", intfList, "SP", null);
        createLink("SP1", "GigabitEthernet0/2", "SP2", "GigabitEthernet0/2");
        //createLink("SP2", "GigabitEthernet0/2", "SP1", "GigabitEthernet0/2");
    }

    private void initializeWebexwanTopology(LogicalDatastoreType type) {
        InstanceIdentifier<Topology> path = InstanceIdentifier
                .create(NetworkTopology.class)
                .child(Topology.class, new TopologyKey(WEBEXWAN_TOPOLOGY_ID));
        initializeTopology(type);
        ReadWriteTransaction transaction = dataBroker.newReadWriteTransaction();
        CheckedFuture<Optional<Topology>, ReadFailedException> webexwanTp = transaction.read(type, path);
        try {
            if (!webexwanTp.get().isPresent()) {
                TopologyBuilder tpb = new TopologyBuilder();
                tpb.setTopologyId(WEBEXWAN_TOPOLOGY_ID);
                transaction.put(type, path, tpb.build());
                transaction.submit();
            } else {
                transaction.cancel();
            }
        } catch (Exception e) {
            LOG.error("Error initializing webex wan topology", e);
        }
    }

    private void initializeTopology(LogicalDatastoreType type) {
        ReadWriteTransaction transaction = dataBroker.newReadWriteTransaction();
        InstanceIdentifier<NetworkTopology> path = InstanceIdentifier.create(NetworkTopology.class);
        CheckedFuture<Optional<NetworkTopology>, ReadFailedException> topology = transaction.read(type,path);
        try {
            if (!topology.get().isPresent()) {
                NetworkTopologyBuilder ntb = new NetworkTopologyBuilder();
                transaction.put(type,path,ntb.build());
                transaction.submit();
            } else {
                transaction.cancel();
            }
        } catch (Exception e) {
            LOG.error("Error initializing webex wan topology", e);
        }
    }

    private void createNode(String nodeName, List<String> interfaces, String site, String ip) {
        NodeId nid = new NodeId(nodeName); 
        InstanceIdentifier<Node> path = InstanceIdentifier
                .create(NetworkTopology.class)
                .child(Topology.class, new TopologyKey(WEBEXWAN_TOPOLOGY_ID))
                .child(Node.class, new NodeKey(nid));
        NodeBuilder nb = new NodeBuilder();
        nb.setNodeId(nid);
        nb.setKey(new NodeKey(nid));
        List<TerminationPoint> tpList = new ArrayList<TerminationPoint>();
        for (String intf : interfaces) {
            TerminationPointBuilder tpb = new TerminationPointBuilder();
            TpId tpId = new TpId(intf);
            tpb.setTpId(tpId);
            tpb.setKey(new TerminationPointKey(tpId));
            WebexTpAugmentationBuilder wtab = new WebexTpAugmentationBuilder();
            wtab.setOutPps(100000L);
            wtab.setOutBps(12800000L);
            wtab.setInPps(100000L);
            wtab.setInBps(12800000L);
            tpb.addAugmentation(WebexTpAugmentation.class, wtab.build());
            tpList.add(tpb.build());
        }
        nb.setTerminationPoint(tpList);

        if (site != null) {
            WebexNodeAugmentationBuilder wnab = new WebexNodeAugmentationBuilder();
            wnab.setSite(site);
            wnab.setIp(ip);
            nb.addAugmentation(WebexNodeAugmentation.class, wnab.build());
        } 
         
        final WriteTransaction transaction = dataBroker.newWriteOnlyTransaction();
        transaction.put(LogicalDatastoreType.OPERATIONAL, path, nb.build(), true);
        CheckedFuture<Void, TransactionCommitFailedException> future = transaction.submit();
        try {
            future.checkedGet();
            LOG.info("write node {} successfully", nodeName);
        } catch (TransactionCommitFailedException e) {
            LOG.error("Failed to write node {}, {}", nodeName, e);
        }
    }
    
    private void createLink(String srcNode, String srcTp, String dstNode, String dstTp) {
        StringBuilder sb = new StringBuilder();
        sb.append(srcNode);
        sb.append(":");
        sb.append(srcTp);
        sb.append("-");
        sb.append(dstNode);
        sb.append(":");
        sb.append(dstTp);
        LinkId lid = new LinkId(sb.toString());
        InstanceIdentifier<Link> path = InstanceIdentifier
                .create(NetworkTopology.class)
                .child(Topology.class, new TopologyKey(WEBEXWAN_TOPOLOGY_ID))
                .child(Link.class, new LinkKey(lid));
        LinkBuilder lb = new LinkBuilder();
        lb.setLinkId(lid);
        lb.setKey(new LinkKey(lid));
        DestinationBuilder dstb = new DestinationBuilder();
        dstb.setDestNode(new NodeId(dstNode));
        dstb.setDestTp(new TpId(dstTp));
        SourceBuilder srcb = new SourceBuilder();
        srcb.setSourceNode(new NodeId(srcNode));
        srcb.setSourceTp(new TpId(srcTp));
        lb.setDestination(dstb.build());
        lb.setSource(srcb.build());
        final WriteTransaction transaction = dataBroker.newWriteOnlyTransaction();
        transaction.put(LogicalDatastoreType.OPERATIONAL, path, lb.build(), true);
        CheckedFuture<Void, TransactionCommitFailedException> future = transaction.submit();
        try {
            future.checkedGet();
            LOG.info("write link {} successfully", lid);
        } catch (TransactionCommitFailedException e) {
            LOG.error("Failed to write link {}, {}", lid, e);
        }
    }

    public void updateTopology(ConfigSiteSettingInput input) {
        for (WanRouter r : input.getWanRouter()) {
            List<String> intfList = new ArrayList<String>();
            intfList.add("GigabitEthernet0");
            for (Interface i : r.getInterface()) {
                intfList.add(i.getInterfaceId());
            } 
            createNode(r.getWanRouterName(), intfList, input.getSite(), r.getWanRouterIp());
            createLink(r.getWanRouterName(), r.getInterface().get(0).getInterfaceId(), "SP1", "GigabitEthernet0/1");
            // createLink("SP1", "GigabitEthernet0/1", r.getWanRouterName(), r.getInterface().get(0).getInterfaceId());
            createLink(r.getWanRouterName(), r.getInterface().get(1).getInterfaceId(), "SP2", "GigabitEthernet0/1");
            // createLink("SP2", "GigabitEthernet0/1", r.getWanRouterName(), r.getInterface().get(1).getInterfaceId());
        }
        for (DnsServer dnsServer : input.getDnsServer()) {
            List<String> intfList = new ArrayList<String>();
            intfList.add("eth0");
            createNode(dnsServer.getDnsServerName(), intfList, input.getSite(), dnsServer.getDnsServerIp());
            for (WanRouter r : input.getWanRouter()) {
                createLink(dnsServer.getDnsServerName(), "eth0", r.getWanRouterName(), "GigabitEthernet0");
                // createLink(r.getWanRouterName(), "GigabitEthernet0", dnsServer.getDnsServerName(), "eth0");
            }
        }
    }

    public void updateInterfaceStats(String nodeName, String intfName, Long pps, Long bps) {
        NodeId nid = new NodeId(nodeName);
        InstanceIdentifier<Node> path = InstanceIdentifier
                .create(NetworkTopology.class)
                .child(Topology.class, new TopologyKey(WEBEXWAN_TOPOLOGY_ID))
                .child(Node.class, new NodeKey(nid));
        NodeBuilder nb = new NodeBuilder();
        nb.setNodeId(nid);
        nb.setKey(new NodeKey(nid));
        List<TerminationPoint> tpList = new ArrayList<TerminationPoint>();
        TerminationPointBuilder tpb = new TerminationPointBuilder();
        TpId tpId = new TpId(intfName);
        tpb.setTpId(tpId);
        tpb.setKey(new TerminationPointKey(tpId));
        WebexTpAugmentationBuilder wtab = new WebexTpAugmentationBuilder();
        wtab.setOutPps(pps);
        wtab.setOutBps(bps);
        tpb.addAugmentation(WebexTpAugmentation.class, wtab.build());
        tpList.add(tpb.build());
        nb.setTerminationPoint(tpList);

        final WriteTransaction transaction = dataBroker.newWriteOnlyTransaction();
        transaction.put(LogicalDatastoreType.OPERATIONAL, path, nb.build(), true);
        CheckedFuture<Void, TransactionCommitFailedException> future = transaction.submit();
        try {
            future.checkedGet();
            LOG.info("update stats {}:{} successfully", nodeName, intfName);
        } catch (TransactionCommitFailedException e) {
            LOG.error("Failed to update stats {}:{}, {}", nodeName, intfName, e);
        }
    }
}
