/**
 * Created by roye on 2016/6/13.
 */
"use strict";
/*初始化全局变量*/
var Topo_URL = "http://127.0.0.1:5555/restconf/operational/network-topology:network-topology/",
    DNS_SETTINGS_URL = "http://127.0.0.1:5555/restconf/operations/webex-wan:config-dns-setting",
    CONFIG_SITE_SETTINGS_URL = "http://127.0.0.1:5555/restconf/operations/webex-wan:config-site-setting",
    History_URL = '';

$(document).ready(function () {

    /*初始化插件*/
    $(window).load(function () {
        setTimeout(function () {
            $("body").addClass("loaded")
        }, 200)
    });

    $('#dns-select').cxSelect({
        selects: ['DNSname', 'ip','site'],
        jsonName: 'name',
        jsonValue: 'value',
        jsonSub: 'sub',
        emptyStyle: 'hidden',
        data:dns_data
    });


    $('#site-select').cxSelect({
        selects: ['site'],
        jsonName: 'name',
        jsonValue: 'value',
        jsonSub: 'sub',
        emptyStyle: 'hidden',
        data:site_data
    });

    $('#nest-clone').cloneya();
    //$('.inner-wrap').cloneya({
    //    cloneThis: '.clone-inner',
    //    cloneButton: '.phclone',
    //    deleteButton: '.phdelete',
    //});

    /*Toaster配置*/
    toastr.options = {
        closeButton: !1,
        debug: !1,
        newestOnTop: !1,
        progressBar: !0,
        positionClass: "toast-top-right",
        preventDuplicates: !1,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

    /*初始化拓扑图*/
    requestTopoInfo();

    /*初始化历史纪录*/
    //requestHistoryInfo();

    /* Next UI Topology initialize */
    (function (nx, global) {
        nx.define('MyNodeTooltip', nx.ui.Component, {
            properties: {
                node: {},
                topology: {}
            },
            view: {
                props: {
                    'class': "topology-tooltip"
                },
                content: [
                    {
                        tag: 'h5',
                        content: '{#node.model.id}'
                    },
                    {
                        tag: 'p',
                        content: [{
                            tag: 'label',
                            content: 'webex-topo:site: '
                        },
                            {
                                tag: 'span',
                                content: '{#node.model.webex-topo:site}'
                            }]
                    },
                    {
                        tag: "table",
                        props: {
                            class: "col-md-12",
                            border: "1"
                        },
                        content: [{
                            tag: "thead",
                            content: {
                                tag: "tr",
                                content: [{
                                    tag: "td",
                                    content: "tp-id"
                                }, {
                                    tag: "td",
                                    content: "in-pps"
                                }, {
                                    tag: "td",
                                    content: "in-bps"
                                }, {
                                    tag: "td",
                                    content: "out-pps"
                                }, {
                                    tag: "td",
                                    content: "out-bps"
                                }]
                            }
                        }]
                    },
                    {
                        tag: "tbody",
                        props: {
                            items: "{#node.model.data}",
                            template: {
                                tag: "tr",
                                content: [{
                                    tag: "td",
                                    content: "{tp-id}"
                                }, {
                                    tag: "td",
                                    content: "{webex-topo:in-pps}"
                                }, {
                                    tag: "td",
                                    content: "{webex-topo:in-bps}"
                                }, {
                                    tag: "td",
                                    content: "{webex-topo:out-pps}"
                                }, {
                                    tag: "td",
                                    content: "{webex-topo:out-bps}"
                                }]
                            }
                        }
                    }]
            },
        });
        nx.define('MyLinkTooltip', nx.ui.Component, {
            properties: {
                link: {},
                topology: {}
            },
            view: {
                content: [{
                    tag: 'p',
                    content: [{
                        tag: 'h5',
                        content: '{#link.model.name}'
                    }, {
                        tag: 'p',
                        content: [{
                            tag: 'label',
                            content: 'source-tp: '
                        }, {
                            tag: 'span',
                            content: '{#link.model.source-tp}'
                        }]
                    }, {
                        tag: 'p',
                        content: [{
                            tag: 'label',
                            content: 'dest-tp: '
                        }, {
                            tag: 'span',
                            content: '{#link.model.dest-tp}'
                        }]
                    }]
                }]
            }
        });
        nx.define('TopologyConfig', nx.ui.Component, {
            properties: {},
            view: {
                props: {
                    'class': "topology-next"
                },
                content: {
                    name: 'topo',
                    type: 'nx.graphic.Topology',
                    props: {
                        style: 'border:1px solid #ccc;',
                        adaptive: true,
                        nodeConfig: {
                            label: 'model.name',
                            iconType: 'model.device_type'
                        },
                        nodeSetConfig: {
                            iconType: 'model.device_type'
                        },
                        tooltipManagerConfig: {
                            nodeTooltipContentClass: 'MyNodeTooltip',
                            linkTooltipContentClass: 'MyLinkTooltip'
                        },
                        showIcon: true,
                        identityKey: 'id',
                        data: topologyData
                    }
                }
            }
        });

        //Start Function
        var Shell = nx.define(nx.ui.Application, {
            methods: {
                start: function () {
                    var view = new TopologyConfig();
                    view.attach(this);
                }
            }
        });

        //Global val exposed to window
        global.shell = new Shell();
        global.shell.container(document.getElementById('topology-graph'));
        // global.shell.start();

    })(nx, nx.global);
    function getTopology() {
        $.ajax({
            beforeSend: function (request)
            {
                request.withCredentials = true;
                request.setRequestHeader("Authorization", "Basic YWRtaW46YWRtaW4=");
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic YWRtaW46YWRtaW4='
            },
            type: 'GET',
            url: Topo_URL,
            // username: 'admin',
            // password: 'admin',
            // dataType: 'jsonp',
            crossDomain: true,
            // async: false,
            cache:false,
            // data: '{"username": "' + username + '", "password" : "' + password + '"}',
            success: function (response) {
                // topologyData = response;
                // topologyData = {};
                processTopologyData(response);
                updateGraph();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // alert('Thanks for your comment!'); 
                updateGraph();

            },
            dataType: 'json',
            timeout: 2000
        });
    }

    function gen_random(min, max){
        return Math.floor(Math.random() * (max- min) + min);
    }

    function processTopologyData(response) {   
        topologyData = {
            nodes: [],
            links: []
        };
        for(var i=0;i<response.data['network-topology'].topology[0].node.length;i++)
        {
            var node = {};
            node.name = response.data['network-topology'].topology[0].node[i]['node-id'];
            node.id = response.data['network-topology'].topology[0].node[i]['node-id'];
            node['webex-topo:site'] = response.data['network-topology'].topology[0].node[i]['webex-topo:site'];
            node['data'] = response.data['network-topology'].topology[0].node[i]['termination-point'];
            if(response.data['network-topology'].topology[0].node[i]['node-id'].match('DNS'))
            {
                node.device_type='server';
            }else if(response.data['network-topology'].topology[0].node[i]['node-id'].match('CRT'))
            {
                node.device_type='router';
            }else if(response.data['network-topology'].topology[0].node[i]['node-id'].match('SP'))
            {
                node.device_type='site';
            }
            node.x=gen_random(10,500);
            node.y=gen_random(10,500);
            topologyData.nodes.push(node);
        }

        for(var i=0;i<response.data['network-topology'].topology[0].link.length;i++)
        {
            var link = {};
            link.name = response.data['network-topology'].topology[0].link[i]['link-id'];
            link['source'] = response.data['network-topology'].topology[0].link[i].source['source-node'];
            link['target'] = response.data['network-topology'].topology[0].link[i].destination['dest-node'];
            link['source-tp'] = response.data['network-topology'].topology[0].link[i].source['source-tp'];
            link['dest-tp'] = response.data['network-topology'].topology[0].link[i].destination['dest-tp'];
            topologyData.links.push(link);
        }
    }

    /* Update topology when got notification */
    function updateGraph() {
        $(".topology-next").remove();
        nx.define('TopologyConfig', nx.ui.Component, {
            properties: {},
            view: {
                props: {
                    'class': "topology-next"
                },
                content: {
                    name: 'topo',
                    type: 'nx.graphic.Topology',
                    props: {
                        style: 'border:1px solid #ccc;',
                        adaptive: true,
                        nodeConfig: {
                            label: 'model.name',
                            iconType: 'model.device_type'
                        },
                        nodeSetConfig: {
                            iconType: 'model.device_type'
                        },
                        tooltipManagerConfig: {
                            nodeTooltipContentClass: 'MyNodeTooltip',
                            linkTooltipContentClass: 'MyLinkTooltip'
                        },
                        showIcon: true,
                        identityKey: 'id',
                        data: topologyData
                    }
                }
            }
        });
        nx.global.shell.start();
    }

    $(window).resize(function () {
        updateGraph()
    });
    getTopology();
    // setInterval(function(){getTopology();}, 60000)
});

function getTopoInfo(filter, callback) {
    var params = '';
    callServerGet(Topo_URL, params, callback)
}

function requestTopoInfo() {
    var filter = {};
    getTopoInfo(filter, function (response) {
        if (response) {
            topologyData_response = response;
        }
    })
}

function getHistoryInfo(filter, callback) {
    var params = '';
    callServerGet(History_URL, params, callback)
}

function requestHistoryInfo() {
    var filter = {};
    getHistoryInfo(filter, function (response) {
        if (response) {

        }
    })
}

function sendDNSSettings(value) {
    if (value) {
        var ip_list = $("#config-dns-ip").val();
        var site_list = $("#config-dns-site").val();
        var domain_name = $("#config-domain-name").val();
      if (ip_list.length > 0 && site_list.length > 0) {
        ip_list=ip_list.split(";");
        site_list=site_list.split(";");
        var DNSSettingsData = {
            "input": {
                "zone": $("#config-dns-zone").val()
            /*
                "dns-record": [
                    {
                        "domain-name": $("#config-domain-name").val()
                    }
                ]
            */
            }
        };

    var dns_ip_list = [];
    if (ip_list.length>0) {
        for(var i=0;i<ip_list.length;i++) {
            var dns_ip_site = {};
            dns_ip_site['ip'] = ip_list[i];
            dns_ip_site['site'] = site_list[i];
            dns_ip_list.push(dns_ip_site);
        }
    }

    var dns_records = [];
    var dns_record = {};
    dns_record['domain-name'] = domain_name;
    dns_record['dns-ip'] = dns_ip_list;
    dns_records.push(dns_record);


     DNSSettingsData['input']['dns-record'] = dns_records;

        var userUrl = DNS_SETTINGS_URL;
        callServerPost(userUrl, '', DNSSettingsData, function (response) {
            toastr["info"]("已发送请求 !");
        }, function () {
            console.log("发送失败, 请重试 !");
        });
    }
  }
}

function sendConfigSiteSettings(value) {
    if (value) {
        var site = $("#site-select-value").val(),
            interface_list =  $("#interface-id").val(),
            wan_router_name = $("#wan-router-name").val(),
            wan_router_ip = $("#wan-router-ip").val(),
            dns_server_name = $("#dns-server-name").val(),
            dns_server_ip = $("#dns-server-ip").val();
        interface_list=interface_list.split(";");
        var siteSettingsData = {
            "input": {
                "site": site
              /*
                "dns-server": [
                    {
                        "dns-server-name": dns_server_name,
                        "dns-server-ip": dns_server_ip
                    }
                ]
              */
            }
        };

        var interfaces = [];
        for (var i=0; i<interface_list.length; i++) {
            var interfac_id = {};
            interfac_id['interface-id'] = interface_list[i];
            interfaces.push(interfac_id);
        }


        var wan_router = [];
        var wan_router_param = {};
        wan_router_param['wan-router-name'] = wan_router_name;
        wan_router_param['wan-router-ip'] = wan_router_ip;
        wan_router_param['interface'] = interfaces;
        wan_router.push(wan_router_param);
        siteSettingsData['input']['wan-router'] = wan_router;
    
        var dns_servers = [];
        var dns_server = {};
        if (dns_server_name && dns_server_ip) {
            dns_server['dns-server-name'] = dns_server_name;
            dns_server['dns-server-ip'] = dns_server_ip; 
            dns_servers.push(dns_server);
            siteSettingsData['input']['dns-server'] = dns_servers;
        }

        var userUrl = CONFIG_SITE_SETTINGS_URL;
        callServerPost(userUrl, '', siteSettingsData, function (response) {
            toastr["info"]("已发送请求 !");
        }, function () {
            console.log("发送失败, 请重试 !");
        });
    }
}
