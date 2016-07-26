$(function(){
	//水电选择
	$(".electricity_aa_2").click(function(){
        $(this).css({
            "background":"url(./img/electricity_hover.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
        $(".water_aa_2").css({
            "background":"url(./img/water.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
    })
    $(".water_aa_2").click(function(){
        $(this).css({
            "background":"url(./img/water_hover.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
        $(".electricity_aa_2").css({
             "background":"url(./img/electricity.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
    })
    //对象选择
    $(".left-middle-tab_aa_2").click(function(){
        $(".left-middle-tab").css({
            "border":"2px solid #7f7f7f",
            "background":"#f1f3fa",
            "color":"#333"
        })
        $(this).css({
            "background":"#7f7f7f",
            "border":"2px solid #7f7f7f",
            "color":"#ffffff"
        })
        $(".tree-2").css({
            display:"none"
        }),
        $(".tree-2")[$(this).index()-1].style.display="block"
    })
    //用电量折线图
    myChart3 = echarts.init(document.getElementById('rheader-content'));

        // 指定图表的配置项和数据
        option3 = {
		    title: {
		        text: '未来一周气温变化',
		        subtext: '纯属虚构'
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['最高气温','最低气温']
		    },
		    toolbox: {
		        show: true,
		        feature: {
		            dataZoom: {},
		            dataView: {readOnly: false},
		            magicType: {type: ['line', 'bar']},
		            restore: {},
		            saveAsImage: {}
		        }
		    },
		    xAxis:  {
		        type: 'category',
		        boundaryGap: false,
		        data: ['周一','周二','周三','周四','周五','周六','周日']
		    },
		    yAxis: {
		        type: 'value',
		        axisLabel: {
		            formatter: '{value} °C'
		        }
		    },
		    series: [
		        {
		            name:'最高气温',
		            type:'line',
		            data:[11, 11, 15, 13, 12, 13, 10],
		             
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
		            data:[1, -2, 2, 5, 3, 2, 0],
		            markPoint: {
		                data: [
		                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'},
		                    [{
		                        symbol: 'arrow',
		                        label: {
		                            normal: {
		                                formatter: '最大值'
		                            }
		                        },
		                        type: 'max',
		                        name: '最大值'
		                    }, {
		                        symbol: 'circle',
		                        x: '60%',
		                        y: '50%'
		                    }]
		                ],
		                 itemStyle: {
		                normal: {
		                    color: function(params) {
		                        
		                        var colorList = [
		                          '#2ec8ca','#b6a2df','#5bb0f0','red','#f1d9c1',
		                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
		                           '#D7504B','#C6E579','#F4E001','red','#26C0C0'
		                        ];
		                        return colorList[params.dataIndex]
		                    }
		                }
		            }

		            }
		            
		        }

		    ]
		};
        // 使用刚指定的配置项和数据显示图表。
    	myChart3.setOption(option3);
    //用电率折线图
    myChart4 = echarts.init(document.getElementById('rheader-content1'));
        // 指定图表的配置项和数据
        option4 = {
		    title: {
		        text: '未来一周气温变化',
		        subtext: '纯属虚构'
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['最高气温','最低气温']
		    },
		    toolbox: {
		        show: true,
		        feature: {
		            dataZoom: {},
		            dataView: {readOnly: false},
		            magicType: {type: ['line', 'bar']},
		            restore: {},
		            saveAsImage: {}
		        }
		    },
		    xAxis:  {
		        type: 'category',
		        boundaryGap: false,
		        data: ['周一','周二','周三','周四','周五','周六','周日']
		    },
		    yAxis: {
		        type: 'value',
		        axisLabel: {
		            formatter: '{value} °C'
		        }
		    },
		    series: [
		        {
		            name:'最高气温',
		            type:'line',
		            data:[11, 11, 15, 13, 12, 13, 10],
		             
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
		            data:[1, -2, 2, 5, 3, 2, 0],
		            markPoint: {
		                data: [
		                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'},
		                    [{
		                        symbol: 'arrow',
		                        label: {
		                            normal: {
		                                formatter: '最大值'
		                            }
		                        },
		                        type: 'max',
		                        name: '最大值'
		                    }, {
		                        symbol: 'circle',
		                        x: '60%',
		                        y: '50%'
		                    }]
		                ],
		                 itemStyle: {
		                normal: {
		                    color: function(params) {
		                        
		                        var colorList = [
		                          '#2ec8ca','#b6a2df','#5bb0f0','red','#f1d9c1',
		                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
		                           '#D7504B','#C6E579','#F4E001','red','#26C0C0'
		                        ];
		                        return colorList[params.dataIndex]
		                    }
		                }
		            }

		            }
		            
		        }
		    ]
		};
        // 使用刚指定的配置项和数据显示图表。
        myChart4.setOption(option4);
})
 var myChart3;
 var myChart4;
 window.onresize = function () {
        myChart3.resize(); 
        myChart4.resize(); 
    }