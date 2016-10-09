$(function(){
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
	});
	//对象选择
	$('.left-middle-tab').eq(0).click(function(){
		$('.left-middle-tab').css(
			{
				'background':'#fff',
				'color':'#333'
			}
		)
		$(this).css({
			'background':'#7f7f7f',
			'color':'#fff'
		})
		$('.tree-1').hide();
		$('.tree-3').show();

	});
	$('.left-middle-tab').eq(1).click(function(){
		$('.left-middle-tab').css(
			{
				'background':'#fff',
				'color':'#333'
			}
		)
		$(this).css({
			'background':'#7f7f7f',
			'color':'#fff'
		})
		$('.tree-1').hide();
		$('.tree-2').show();
	});
	//读取楼宇和科室的zTree；
	_objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),false,true);
	_objectSel.initOffices($("#allOffices"),true);
	//搜索框功能
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
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
		    xAxis: [
		        {
		            type: 'category',
		            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '用电量',
		            min: 0,
		            max: 250,
		            interval: 50,
		            axisLabel: {
		                formatter: '{value}'
		            }
		        }
		    ],
		    series: [
		       
		        {
		            name:'用电量',
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
		            name:'用电峰值',
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
		            name:'平均用电量',
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
		            name:'用电谷值',
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
	myChart68 = echarts.init(document.getElementById('rheader-content-67'));
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
		    xAxis: [
		        {
		            type: 'category',
		            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '用电量',
		            min: 0,
		            max: 250,
		            interval: 50,
		            axisLabel: {
		                formatter: '{value}'
		            }
		        }
		    ],
		    series: [
		       
		        {
		            name:'用电量',
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
		            name:'用电峰值',
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
		            name:'平均用电量',
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
		            name:'用电谷值',
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
	myChart70 = echarts.init(document.getElementById('rheader-content-68'));
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
		    xAxis: [
		        {
		            type: 'category',
		            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '用电量',
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
		            name:'用电量',
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
		            name:'用电峰值',
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
		            name:'平均用电量',
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
		            name:'用电谷值',
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
	myChart72 = echarts.init(document.getElementById('rheader-content-69'));
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
		    xAxis: [
		        {
		            type: 'category',
		            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '用电量',
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
		            name:'用电量',
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
		            name:'用电峰值',
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
		            name:'平均用电量',
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
		            name:'用电谷值',
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
var myChart66;
var myChart68;
var myChart70;
var myChart72;
window.onresize = function () {
    myChart66.resize(); 
    myChart68.resize();
    myChart70.resize();
    myChart72.resize();
}
