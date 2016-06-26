//第一种POST API：
//http://127.0.0.1:8181/restconf/operations/webex-wan:config-site-setting
var api1 = {
    "input": {
    "site": "site1",
        "wan-router": [
        {
            "wan-router-name": "CRT01a",
            "wan-router-ip": "172.16.1.116",
            "interface": [
                {
                    "interface-id": "GigabitEthernet0/0/0/2"
                },
                {
                    "interface-id": "GigabitEthernet0/0/0/3"
                }
            ]
        },
        {
            "wan-router-name": "CRT01b",
            "wan-router-ip": "172.16.1.117",
            "interface": [
                {
                    "interface-id": "GigabitEthernet0/0/0/3"
                },
                {
                    "interface-id": "GigabitEthernet0/0/0/2"
                }
            ]
        }
    ],
        "dns-server": [
        {
            "dns-server-name": "DNS1",
            "dns-server-ip": "172.16.1.124"
        }
    ]
}
}

//http://127.0.0.1:8181/restconf/operations/webex-wan:config-site-setting
var api2 = {
    "input": {
    "site": "site2",
        "wan-router": [
        {
            "wan-router-name": "CRT02",
            "wan-router-ip": "172.16.1.122",
            "interface": [
                {
                    "interface-id": "GigabitEthernet0/0/0/2"
                },
                {
                    "interface-id": "GigabitEthernet0/0/0/3"
                }
            ]
        }
    ],
        "dns-server": [
        {
            "dns-server-name": "DNS2",
            "dns-server-ip": "172.16.1.127"
        }
    ]
}
}

//http://127.0.0.1:8181/restconf/operations/webex-wan:config-site-setting
var api3 = {
    "input": {
    "site": "site3",
        "wan-router": [
        {
            "wan-router-name": "CRT03",
            "wan-router-ip": "172.16.1.123",
            "interface": [
                {
                    "interface-id": "GigabitEthernet0/0/0/3"
                },
                {
                    "interface-id": "GigabitEthernet0/0/0/2"
                }
            ]
        }
    ],
        "dns-server": [
        {
            "dns-server-name": "DNS3",
            "dns-server-ip": "172.16.1.128"
        }
    ]
}
}

//第二种 POST API：
//http://127.0.0.1:8181/restconf/operations/webex-wan:config-dns-setting
var api4 = {
    "input": {
    "zone": "cisco.webex.com",
        "dns-record": [
        {
            "domain-name": "www.cisco.webex.com",
            "dns-ip": [
                {
                    "ip": "1.1.1.1",
                    "site": "site1"
                },
                {
                    "ip": "1.1.1.2",
                    "site": "site1"
                },
                {
                    "ip": "2.2.2.1",
                    "site": "site2"
                },
                {
                    "ip": "3.3.3.1",
                    "site": "site3"
                }
            ]
        },
        {
            "domain-name": "meeting.cisco.webex.com",
            "dns-ip": [
                {
                    "ip": "10.1.1.1",
                    "site": "site1"
                },
                {
                    "ip": "20.1.1.1",
                    "site": "site2"
                },
                {
                    "ip": "30.1.1.1",
                    "site": "site3"
                }
            ]
        }
    ]
}
}

//第三种GET API：
//GET http://127.0.0.1:8181/restconf/operational/network-topology:network-topology/

    //GET API的Reply：
var response = {
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


