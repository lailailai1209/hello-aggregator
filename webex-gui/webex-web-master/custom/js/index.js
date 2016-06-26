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

    function processTopologyData(response) {
        for(var i=0;i<response.data['network-topology'].topology[0].node.length;i++)
        {
            topologyData.nodes[i].id = response.data['network-topology'].topology[0].node[i]['node-id'];
            topologyData.nodes[i]['webex-topo:site'] = response.data['network-topology'].topology[0].node[i]['webex-topo:site'];
            topologyData.nodes[i]['data'] = response.data['network-topology'].topology[0].node[i]['termination-point'];
            if(response.data['network-topology'].topology[0].node[i]['node-id'].match('DNS'))
            {
                topologyData.nodes[i].device_type='server';
            }else if(response.data['network-topology'].topology[0].node[i]['node-id'].match('CRT'))
            {
                topologyData.nodes[i].device_type='router';
            }else if(response.data['network-topology'].topology[0].node[i]['node-id'].match('SP'))
            {
                topologyData.nodes[i].device_type='site';
            }
        }

        for(var i=0;i<response.data['network-topology'].topology[0].link.length;i++)
        {
            topologyData.links[i].name = response.data['network-topology'].topology[0].link[i]['link-id'];
            topologyData.links[i]['source'] = response.data['network-topology'].topology[0].link[i].source['source-node'];
            topologyData.links[i]['target'] = response.data['network-topology'].topology[0].link[i].destination['dest-node'];
            topologyData.links[i]['source-tp'] = response.data['network-topology'].topology[0].link[i].source['source-tp'];
            topologyData.links[i]['dest-tp'] = response.data['network-topology'].topology[0].link[i].destination['dest-tp'];
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
        var ip_list =  $("#config-dns-ip").val(),
            site_list = $("#config-dns-site").val();
        ip_list=ip_list.split(";");
        site_list=site_list.split(";");
        var DNSSettingsData = {};
    if (ip_list.length == 1) {
        DNSSettingsData = {
            "input": {
                "zone": $("#config-dns-zone").val(),
                "dns-record": [
                    {
                        "domain-name": $("#config-domain-name").val(),
                        "dns-ip": [
                            {
                                "ip": ip_list[0],
                                "site": site_list[0]
                            }
                            /*
                            ,
                            {
                                "ip": ip_list[1],
                                "site": site_list[1]
                            },
                            {
                                "ip": ip_list[2],
                                "site": site_list[2]
                            },
                            {
                                "ip": ip_list[3],
                                "site": site_list[3]
                            }
                            */
                        ]
                    },
                ]
            }
        };
    }


    if (ip_list.length == 2) {
        DNSSettingsData = {
            "input": {
                "zone": $("#config-dns-zone").val(),
                "dns-record": [
                    {
                        "domain-name": $("#config-domain-name").val(),
                        "dns-ip": [
                            {
                                "ip": ip_list[0],
                                "site": site_list[0]
                            }
                            ,
                            {
                                "ip": ip_list[1],
                                "site": site_list[1]
                            }
                            /* ,
                            {
                                "ip": ip_list[2],
                                "site": site_list[2]
                            },
                            {
                                "ip": ip_list[3],
                                "site": site_list[3]
                            }
                            */
                        ]
                    },
                ]
            }
        };
    }

    if (ip_list.length == 3) {
        DNSSettingsData = {
            "input": {
                "zone": $("#config-dns-zone").val(),
                "dns-record": [
                    {
                        "domain-name": $("#config-domain-name").val(),
                        "dns-ip": [
                            {
                                "ip": ip_list[0],
                                "site": site_list[0]
                            }
                            ,
                            {
                                "ip": ip_list[1],
                                "site": site_list[1]
                            }
                            ,
                            {
                                "ip": ip_list[2],
                                "site": site_list[2]
                            }
                            /* ,
                            {
                                "ip": ip_list[3],
                                "site": site_list[3]
                            }
                            */
                        ]
                    },
                ]
            }
        };
    }

    if (ip_list.length == 4) {
        DNSSettingsData = {
            "input": {
                "zone": $("#config-dns-zone").val(),
                "dns-record": [
                    {
                        "domain-name": $("#config-domain-name").val(),
                        "dns-ip": [
                            {
                                "ip": ip_list[0],
                                "site": site_list[0]
                            }
                            ,
                            {
                                "ip": ip_list[1],
                                "site": site_list[1]
                            }
                            ,
                            {
                                "ip": ip_list[2],
                                "site": site_list[2]
                            },
                            {
                                "ip": ip_list[3],
                                "site": site_list[3]
                            }
                        ]
                    },
                ]
            }
        };
    }

    /*    if (ip_list.length>1) {
            for(var i=1;i<ip_list.length;i++) {
                DNSSettingsData.input['dns-record']['dns-ip'][i].ip = ip_list[i];
                DNSSettingsData.input['dns-record']['dns-ip'][i].site = site_list[i];
            }
        }
        */


        /*for(var i=0;i<ip_list.length;i++){
            DNSSettingsData.input['dns-record']['dns-ip'][i].ip = ip_list[i];
        }
        for(var i=0;i<site_list.length;i++){
            DNSSettingsData.input['dns-record']['dns-ip'][i].site = site_list[i];
        }*/

        /*if($("#config-dns-ip1").val())
        {var ip_list =  $("#config-dns-ip1").val(),
            site_list = $("#config-dns-site1").val();
            ip_list.split(';');
            site_list.split(';');
            for(var i=0;i<ip_list.length;i++){
                DNSSettingsData.input['dns-record'][1]['dns-ip'][i].ip = ip_list[i];
            }
            for(var i=0;i<site_list.length;i++){
                DNSSettingsData.input['dns-record'][1]['dns-ip'][i].site = site_list[i];
            }}

        if($("#config-dns-ip2").val())
        {var ip_list =  $("#config-dns-ip2").val(),
            site_list = $("#config-dns-site2").val();
            ip_list.split(';');
            site_list.split(';');
            for(var i=0;i<ip_list.length;i++){
                DNSSettingsData.input['dns-record'][2]['dns-ip'][i].ip = ip_list[i];
            }
            for(var i=0;i<site_list.length;i++){
                DNSSettingsData.input['dns-record'][2]['dns-ip'][i].site = site_list[i];
            }}
*/
        var userUrl = DNS_SETTINGS_URL;
        callServerPost(userUrl, '', DNSSettingsData, function (response) {
            toastr["info"]("已发送请求 !");
        }, function () {
            console.log("发送失败, 请重试 !");
        });
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
        var siteSettingsData = {};
        if (interface_list.length == 1) {
            siteSettingsData = {
            "input": {
                "site": "site2",
                "wan-router": [
                    {
                        "wan-router-name": wan_router_name,
                        "wan-router-ip": wan_router_ip,
                        "interface": [
                            {
                                "interface-id": interface_list[0]
                            }
                        ]
                    }
                ],
                "dns-server": [
                    {
                        "dns-server-name": dns_server_name,
                        "dns-server-ip": dns_server_ip
                    }
                ]
            }
        };
    }

        if (interface_list.length == 2) {
            siteSettingsData = {
            "input": {
                "site": "site2",
                "wan-router": [
                    {
                        "wan-router-name": wan_router_name,
                        "wan-router-ip": wan_router_ip,
                        "interface": [
                            {
                                "interface-id": interface_list[0]
                            },
                            {
                                "interface-id": interface_list[1]
                            }
                        ]
                    }
                ],
                "dns-server": [
                    {
                        "dns-server-name": dns_server_name,
                        "dns-server-ip": dns_server_ip
                    }
                ]
            }
        };
    }

        if (interface_list.length == 3) {
            siteSettingsData = {
            "input": {
                "site": "site2",
                "wan-router": [
                    {
                        "wan-router-name": wan_router_name,
                        "wan-router-ip": wan_router_ip,
                        "interface": [
                            {
                                "interface-id": interface_list[0]
                            },
                            {
                                "interface-id": interface_list[1]
                            },
                            {
                                "interface-id": interface_list[2]
                            }
                        ]
                    }
                ],
                "dns-server": [
                    {
                        "dns-server-name": dns_server_name,
                        "dns-server-ip": dns_server_ip
                    }
                ]
            }
        };
    }

            if (interface_list.length == 4) {
            siteSettingsData = {
            "input": {
                "site": "site2",
                "wan-router": [
                    {
                        "wan-router-name": wan_router_name,
                        "wan-router-ip": wan_router_ip,
                        "interface": [
                            {
                                "interface-id": interface_list[0]
                            },
                            {
                                "interface-id": interface_list[1]
                            },
                            {
                                "interface-id": interface_list[2]
                            },
                            {
                                "interface-id": interface_list[3]
                            }
                        ]
                    }
                ],
                "dns-server": [
                    {
                        "dns-server-name": dns_server_name,
                        "dns-server-ip": dns_server_ip
                    }
                ]
            }
        };
    }


        var userUrl = CONFIG_SITE_SETTINGS_URL;
        callServerPost(userUrl, '', siteSettingsData, function (response) {
            toastr["info"]("已发送请求 !");
        }, function () {
            console.log("发送失败, 请重试 !");
        });
    }
}