$(function(){
	getHeight();
	//1
	myChart66 = echarts.init(document.getElementById('rheader-content-66'));
		option66 = {
		    tooltip: {
		        trigger: 'axis'
		    },
		    toolbox: {
		        feature: {
		            dataView: {show: true, readOnly: false},
		            magicType: {show: true, type: ['line', 'bar']},
		            restore: {show: true},
		            saveAsImage: {show: true}
		        }
		    },
		    legend: {
		        data:['降水量','平均温度']
		    },
		    xAxis: [
		        {
		            type: 'category',
		            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '水量',
		            min: 0,
		            max: 250,
		            interval: 50,
		            axisLabel: {
		                formatter: '{value} ml'
		            }
		        }
		    ],
		    series: [
		       
		        {
		            name:'降水量',
		            type:'bar',
		            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
		            itemStyle: {
		                normal: {
		                    color: function(params2) {
		                        
		                        var colorList = [
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6'
		                        ];
		                        return colorList[params2.dataIndex]
		                    }
		                }
		            }
		        },
		        {
		            name:'最高气温',
		            type:'line',
		            data:[200],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'平均气温',
		            type:'line',
		            data:[100],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'最低气温',
		            type:'line',
		            data:[50],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        }
		    ]
		};
		myChart66.setOption(option66);
	//2
	myChart68 = echarts.init(document.getElementById('rheader-content-68'));
		option68 = {
		    tooltip: {
		        trigger: 'axis'
		    },
		    toolbox: {
		        feature: {
		            dataView: {show: true, readOnly: false},
		            magicType: {show: true, type: ['line', 'bar']},
		            restore: {show: true},
		            saveAsImage: {show: true}
		        }
		    },
		    legend: {
		        data:['降水量','平均温度']
		    },
		    xAxis: [
		        {
		            type: 'category',
		            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '水量',
		            min: 0,
		            max: 250,
		            interval: 50,
		            axisLabel: {
		                formatter: '{value} ml'
		            }
		        }
		    ],
		    series: [
		       
		        {
		            name:'降水量',
		            type:'bar',
		            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
		            itemStyle: {
		                normal: {
		                    color: function(params2) {
		                        
		                        var colorList = [
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6'
		                        ];
		                        return colorList[params2.dataIndex]
		                    }
		                }
		            }
		        },
		        {
		            name:'最高气温',
		            type:'line',
		            data:[200],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'平均气温',
		            type:'line',
		            data:[100],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'最低气温',
		            type:'line',
		            data:[50],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        }
		    ]
		};
		myChart68.setOption(option68);
	//3
	myChart70 = echarts.init(document.getElementById('rheader-content-70'));
		option70 = {
		    tooltip: {
		        trigger: 'axis'
		    },
		    toolbox: {
		        feature: {
		            dataView: {show: true, readOnly: false},
		            magicType: {show: true, type: ['line', 'bar']},
		            restore: {show: true},
		            saveAsImage: {show: true}
		        }
		    },
		    legend: {
		        data:['降水量','平均温度']
		    },
		    xAxis: [
		        {
		            type: 'category',
		            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '水量',
		            min: 0,
		            max: 250,
		            interval: 50,
		            axisLabel: {
		                formatter: '{value} ml'
		            }
		        }
		    ],
		    series: [
		       
		        {
		            name:'降水量',
		            type:'bar',
		            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
		            itemStyle: {
		                normal: {
		                    color: function(params2) {
		                        
		                        var colorList = [
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6'
		                        ];
		                        return colorList[params2.dataIndex]
		                    }
		                }
		            }
		        },
		        {
		            name:'最高气温',
		            type:'line',
		            data:[200],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'平均气温',
		            type:'line',
		            data:[100],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'最低气温',
		            type:'line',
		            data:[50],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        }
		    ]
		};
		myChart70.setOption(option70);
	//4
	myChart72 = echarts.init(document.getElementById('rheader-content-72'));
		option72 = {
		    tooltip: {
		        trigger: 'axis'
		    },
		    toolbox: {
		        feature: {
		            dataView: {show: true, readOnly: false},
		            magicType: {show: true, type: ['line', 'bar']},
		            restore: {show: true},
		            saveAsImage: {show: true}
		        }
		    },
		    legend: {
		        data:['降水量','平均温度']
		    },
		    xAxis: [
		        {
		            type: 'category',
		            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '水量',
		            min: 0,
		            max: 250,
		            interval: 50,
		            axisLabel: {
		                formatter: '{value} ml'
		            }
		        }
		    ],
		    series: [
		       
		        {
		            name:'降水量',
		            type:'bar',
		            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
		            itemStyle: {
		                normal: {
		                    color: function(params2) {
		                        
		                        var colorList = [
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6',
		                          '#6bb1a6','#6bb1a6','#6bb1a6'
		                        ];
		                        return colorList[params2.dataIndex]
		                    }
		                }
		            }
		        },
		        {
		            name:'最高气温',
		            type:'line',
		            data:[200],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'平均气温',
		            type:'line',
		            data:[100],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'最低气温',
		            type:'line',
		            data:[50],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        }
		    ]
		};
		myChart72.setOption(option72);
})
getHeight();
var myChart66;
var myChart68;
var myChart70;
var myChart72;
window.onresize = function () {
    myChart66.resize(); 
    myChart68.resize();
    myChart70.resize();
    myChart72.resize();
	getHeight();
}
function getHeight(){
	//获取浏览器的高度；
	var h = window.innerHeight ||document.documentElement.clientHeight || document.body.clientHeight;
	// console.log(h);
	var heights = h * 0.70;
	$('.total-warp').css({
		height:heights
	})
}