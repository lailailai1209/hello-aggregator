/**
 * Created by roye on 2016/6/4.
 */
var topologyData ={
    nodes: [{
        "id": 1,
        "x": 200,
        "y": 100,
        "webex-topo:site": "100,200",
        "data": "192.168.10.2",
        "device_type": "site"
    }, {
        "id": 2,
        "x": 350,
        "y": 250,
        "webex-topo:site": "100,200",
        "data": "192.168.20.2",
        "device_type": "site"
    }, {
        "id": 3,
        "x": 500,
        "y": 100,
        "webex-topo:site": "100,200",
        "data": "192.168.30.2",
        "device_type": "site"
    }, {
        "id": 11,
        "x": 100,
        "y": 25,
        "webex-topo:site": "100",
        "data": "10.2.0.51",
        "device_type": "site"
    }, {
        "id": 12,
        "x": 100,
        "y": 175,
        "webex-topo:site": 200,
        "data": "10.2.0.52",
        "device_type": "site"
    }, {
        "id": 21,
        "x": 275,
        "y": 350,
        "webex-topo:site": "100",
        "data": "10.2.0.53",
        "device_type": "site"
    }, {
        "id": 22,
        "x": 425,
        "y": 350,
        "webex-topo:site": "200",
        "data": "10.2.0.54",
        "device_type": "site"
    }, {
        "id": 31,
        "x": 600,
        "y": 25,
        "webex-topo:site": "100",
        "data": "10.2.0.55",
        "device_type": "site"
    }, {
        "id": 32,
        "x": 600,
        "y": 175,
        "webex-topo:site": "200",
        "data": "10.0.20.3",
        "device_type": "site"
    }],
    links: [{
        "name": '',
        "source": '',
        "target": '',
        "source-tp": '',
        "dest-tp": ''
    },{}, {}, {}, {}, {}, {}, {}, {}, {},{},{},{},{}]
};

var topologyData_response = {
    "network-topology": {
        "topology": [
            {
                "topology-id": "webexwan:1",
                "node": [
                    {
                        "node-id": "SP1",
                        "webex-topo:site": "SP",
                        "termination-point": [
                            {
                                "tp-id": "GigabitEthernet0/1",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            },
                            {
                                "tp-id": "GigabitEthernet0/2",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            }
                        ]
                    },
                    {
                        "node-id": "CRT02",
                        "webex-topo:site": "site2",
                        "webex-topo:ip": "172.16.1.122",
                        "termination-point": [
                            {
                                "tp-id": "GigabitEthernet0/0/0/3",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            },
                            {
                                "tp-id": "GigabitEthernet0",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            },
                            {
                                "tp-id": "GigabitEthernet0/0/0/2",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            }
                        ]
                    },
                    {
                        "node-id": "SP2",
                        "webex-topo:site": "SP",
                        "termination-point": [
                            {
                                "tp-id": "GigabitEthernet0/1",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            },
                            {
                                "tp-id": "GigabitEthernet0/2",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            }
                        ]
                    },
                    {
                        "node-id": "CRT03",
                        "webex-topo:site": "site3",
                        "webex-topo:ip": "172.16.1.123",
                        "termination-point": [
                            {
                                "tp-id": "GigabitEthernet0/0/0/3",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            },
                            {
                                "tp-id": "GigabitEthernet0",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            },
                            {
                                "tp-id": "GigabitEthernet0/0/0/2",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            }
                        ]
                    },
                    {
                        "node-id": "DNS1",
                        "webex-topo:site": "site1",
                        "webex-topo:ip": "172.16.1.124",
                        "termination-point": [
                            {
                                "tp-id": "eth0",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            }
                        ]
                    },
                    {
                        "node-id": "CRT01b",
                        "webex-topo:site": "site1",
                        "webex-topo:ip": "172.16.1.117",
                        "termination-point": [
                            {
                                "tp-id": "GigabitEthernet0/0/0/3",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            },
                            {
                                "tp-id": "GigabitEthernet0",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            },
                            {
                                "tp-id": "GigabitEthernet0/0/0/2",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            }
                        ]
                    },
                    {
                        "node-id": "DNS2",
                        "webex-topo:site": "site2",
                        "webex-topo:ip": "172.16.1.127",
                        "termination-point": [
                            {
                                "tp-id": "eth0",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            }
                        ]
                    },
                    {
                        "node-id": "CRT01a",
                        "webex-topo:site": "site1",
                        "webex-topo:ip": "172.16.1.116",
                        "termination-point": [
                            {
                                "tp-id": "GigabitEthernet0/0/0/3",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            },
                            {
                                "tp-id": "GigabitEthernet0",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            },
                            {
                                "tp-id": "GigabitEthernet0/0/0/2",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            }
                        ]
                    },
                    {
                        "node-id": "DNS3",
                        "webex-topo:site": "site3",
                        "webex-topo:ip": "172.16.1.128",
                        "termination-point": [
                            {
                                "tp-id": "eth0",
                                "webex-topo:out-pps": 100000,
                                "webex-topo:in-bps": 12800000,
                                "webex-topo:out-bps": 12800000,
                                "webex-topo:in-pps": 100000
                            }
                        ]
                    }
                ],
                "link": [
                    {
                        "link-id": "DNS2:eth0-CRT02:GigabitEthernet0",
                        "source": {
                            "source-node": "DNS2",
                            "source-tp": "eth0"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0",
                            "dest-node": "CRT02"
                        }
                    },
                    {
                        "link-id": "DNS3:eth0-CRT03:GigabitEthernet0",
                        "source": {
                            "source-node": "DNS3",
                            "source-tp": "eth0"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0",
                            "dest-node": "CRT03"
                        }
                    },
                    {
                        "link-id": "CRT01a:GigabitEthernet0/0/0/2-SP1:GigabitEthernet0/1",
                        "source": {
                            "source-node": "CRT01a",
                            "source-tp": "GigabitEthernet0/0/0/2"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0/1",
                            "dest-node": "SP1"
                        }
                    },
                    {
                        "link-id": "DNS1:eth0-CRT01a:GigabitEthernet0",
                        "source": {
                            "source-node": "DNS1",
                            "source-tp": "eth0"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0",
                            "dest-node": "CRT01a"
                        }
                    },
                    {
                        "link-id": "CRT03:GigabitEthernet0/0/0/2-SP1:GigabitEthernet0/1",
                        "source": {
                            "source-node": "CRT03",
                            "source-tp": "GigabitEthernet0/0/0/2"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0/1",
                            "dest-node": "SP1"
                        }
                    },
                    {
                        "link-id": "CRT01b:GigabitEthernet0/0/0/3-SP2:GigabitEthernet0/1",
                        "source": {
                            "source-node": "CRT01b",
                            "source-tp": "GigabitEthernet0/0/0/3"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0/1",
                            "dest-node": "SP2"
                        }
                    },
                    {
                        "link-id": "CRT01b:GigabitEthernet0/0/0/2-SP1:GigabitEthernet0/1",
                        "source": {
                            "source-node": "CRT01b",
                            "source-tp": "GigabitEthernet0/0/0/2"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0/1",
                            "dest-node": "SP1"
                        }
                    },
                    {
                        "link-id": "DNS1:eth0-CRT01b:GigabitEthernet0",
                        "source": {
                            "source-node": "DNS1",
                            "source-tp": "eth0"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0",
                            "dest-node": "CRT01b"
                        }
                    },
                    {
                        "link-id": "CRT03:GigabitEthernet0/0/0/3-SP2:GigabitEthernet0/1",
                        "source": {
                            "source-node": "CRT03",
                            "source-tp": "GigabitEthernet0/0/0/3"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0/1",
                            "dest-node": "SP2"
                        }
                    },
                    {
                        "link-id": "CRT01a:GigabitEthernet0/0/0/3-SP2:GigabitEthernet0/1",
                        "source": {
                            "source-node": "CRT01a",
                            "source-tp": "GigabitEthernet0/0/0/3"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0/1",
                            "dest-node": "SP2"
                        }
                    },
                    {
                        "link-id": "CRT02:GigabitEthernet0/0/0/2-SP1:GigabitEthernet0/1",
                        "source": {
                            "source-node": "CRT02",
                            "source-tp": "GigabitEthernet0/0/0/2"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0/1",
                            "dest-node": "SP1"
                        }
                    },
                    {
                        "link-id": "CRT02:GigabitEthernet0/0/0/3-SP2:GigabitEthernet0/1",
                        "source": {
                            "source-node": "CRT02",
                            "source-tp": "GigabitEthernet0/0/0/3"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0/1",
                            "dest-node": "SP2"
                        }
                    },
                    {
                        "link-id": "SP1:GigabitEthernet0/2-SP2:GigabitEthernet0/2",
                        "source": {
                            "source-node": "SP1",
                            "source-tp": "GigabitEthernet0/2"
                        },
                        "destination": {
                            "dest-tp": "GigabitEthernet0/2",
                            "dest-node": "SP2"
                        }
                    }
                ]
            }
        ]
    }
}

for(var i=0;i<topologyData_response['network-topology'].topology[0].node.length;i++)
{
    topologyData.nodes[i].id = topologyData_response['network-topology'].topology[0].node[i]['node-id'];
    topologyData.nodes[i]['webex-topo:site'] = topologyData_response['network-topology'].topology[0].node[i]['webex-topo:site'];
    topologyData.nodes[i]['data'] = topologyData_response['network-topology'].topology[0].node[i]['termination-point'];
    if(topologyData_response['network-topology'].topology[0].node[i]['node-id'].match('DNS'))
    {
        topologyData.nodes[i].device_type='server';
    }else if(topologyData_response['network-topology'].topology[0].node[i]['node-id'].match('CRT'))
    {
        topologyData.nodes[i].device_type='router';
    }else if(topologyData_response['network-topology'].topology[0].node[i]['node-id'].match('SP'))
    {
        topologyData.nodes[i].device_type='site';
    }
}

for(var i=0;i<topologyData_response['network-topology'].topology[0].link.length;i++)
{
    topologyData.links[i].name = topologyData_response['network-topology'].topology[0].link[i]['link-id'];
    topologyData.links[i]['source'] = topologyData_response['network-topology'].topology[0].link[i].source['source-node'];
    topologyData.links[i]['target'] = topologyData_response['network-topology'].topology[0].link[i].destination['dest-node'];
    topologyData.links[i]['source-tp'] = topologyData_response['network-topology'].topology[0].link[i].source['source-tp'];
    topologyData.links[i]['dest-tp'] = topologyData_response['network-topology'].topology[0].link[i].destination['dest-tp'];
}


var dns_data =[
    {name:'server1.cisco.webex.com', value: 'server1.cisco.webex.com', sub: [
        {name: '10.2.0.51', value: '10.2.0.51' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.52', value: '10.2.0.52' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.53', value: '10.2.0.53' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
    ]},
    {name:'server2.cisco.webex.com', value: 'server2.cisco.webex.com', sub: [
        {name: '10.2.0.51', value: '10.2.0.51' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.52', value: '10.2.0.52' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.53', value: '10.2.0.53' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
    ]},
    {name:'server3.cisco.webex.com', value: 'server3.cisco.webex.com', sub: [
        {name: '10.2.0.51', value: '10.2.0.51' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.52', value: '10.2.0.52' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.53', value: '10.2.0.53' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
    ]},
    {name:'server4.cisco.webex.com', value: 'server4.cisco.webex.com', sub: [
        {name: '10.2.0.51', value: '10.2.0.51' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.52', value: '10.2.0.52' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.53', value: '10.2.0.53' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
    ]},
    {name:'server5.cisco.webex.com', value: 'server5.cisco.webex.com', sub: [
        {name: '10.2.0.51', value: '10.2.0.51' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.52', value: '10.2.0.52' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.53', value: '10.2.0.53' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
    ]},
    {name:'server6.cisco.webex.com', value: 'server6.cisco.webex.com', sub: [
        {name: '10.2.0.51', value: '10.2.0.51' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.52', value: '10.2.0.52' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
        {name: '10.2.0.53', value: '10.2.0.53' ,sub: [
            {name: 'site 1', value: 'site1'},
            {name: 'site 2', value: 'site2'},
            {name: 'site 3', value: 'site3'}
        ]},
    ]},
];

var site_data =[
    {name: 'site 1', value: 'site1'},
    {name: 'site 2', value: 'site2'},
    {name: 'site 3', value: 'site3'}
];


