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
	//用电考核
	myChart74 = echarts.init(document.getElementById('rheader-content-74'));
		option74 = {
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
		        data:['定额量','使用量','偏差']
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
		        },
		        {
		            type: 'value',
		            name: '偏差',
		            min: 0,
		            max: 25,
		            interval: 5,
		            axisLabel: {
		                formatter: '{value}'
		            }
		        }
		    ],
		    series: [
		        {
		            name:'定额量',
		            type:'bar',
		            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
		            itemStyle: {
		                normal: {
		                    color: function(params2) {
		                        
		                        var colorList = [
		                          '#9ac339','#9ac339','#9ac339','#9ac339','#9ac339','#9ac339','#9ac339','#9ac339','#9ac339','#9ac339',
		                        ];
		                        return colorList[params2.dataIndex]
		                    }
		                }
		            }
		        },

		        {
		            name:'使用量',
		            type:'bar',
		            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
		             itemStyle: {
		                normal: {
		                    color: function(params2) {
		                        
		                        var colorList = [
		                          '#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da'
		                        ];
		                        return colorList[params2.dataIndex]
		                    }
		                }
		            }
		        },
		        {
		            name:'偏差',
		            type:'line',
		            yAxisIndex: 1,
		            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
		        }
		    ]
		};
		myChart74.setOption(option74);
	//用电量考核
	myChart75 = echarts.init(document.getElementById('rheader-content-75'));
	option75 = {
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
			data:['定额量','使用量','偏差']
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
			},
			{
				type: 'value',
				name: '偏差',
				min: 0,
				max: 25,
				interval: 5,
				axisLabel: {
					formatter: '{value}'
				}
			}
		],
		series: [
			{
				name:'定额量',
				type:'bar',
				data:[2.0, 3.9, 17.0, 23.2, 25.6, 36.7, 135.6, 152.2, 36.6, 20.0,2.4, 9.3],
				itemStyle: {
					normal: {
						color: function(params2) {

							var colorList = [
								'#9ac339','#9ac339','#9ac339','#9ac339','#9ac339','#9ac339','#9ac339','#9ac339','#9ac339','#9ac339',
							];
							return colorList[params2.dataIndex]
						}
					}
				}
			},

			{
				name:'使用量',
				type:'bar',
				data:[2.6, 15.9, 9.0, 26.4, 28.7, 170.7, 175.6, 182.2, 48.7, 18.8, 16.0, 2.3],
				itemStyle: {
					normal: {
						color: function(params2) {

							var colorList = [
								'#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da','#b2c7da'
							];
							return colorList[params2.dataIndex]
						}
					}
				}
			},
			{
				name:'偏差',
				type:'line',
				yAxisIndex: 1,
				data:[2.0, 5.2, 3.3, 20.5, 6.3, 1.2, 20.3, 20.4, 23.0, 12.5, 12.0, 16.2]
			}
		]
	};
		myChart75.setOption(option75);
	$('body').mouseover(function(){
		if(myChart74 && myChart75){
			myChart74.resize();
			myChart75.resize();
		}
	})
})
var myChart74;
var myChart75;
window.onresize = function () {
	if(myChart74 && myChart75){
		myChart74.resize();
		myChart75.resize();
	}
}