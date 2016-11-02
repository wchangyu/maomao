$(function(){
	$('.datetimepickereType').html(_ajaxStartTime + '到' + _ajaxEndTime);
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
	});
	//时间插件
	$('#datetimepicker').datepicker(
		{
			language:  'zh-CN',
			todayBtn: 1,
			todayHighlight: 1,
			format: 'yyyy-mm-dd'
		}
	).on('changeDate',function(e){
		dataType();
		inputValue = $('#datetimepicker').val();
		if(_ajaxDataType == '月'){
			var now = moment(inputValue).startOf('month');
			var nows = moment(inputValue).endOf('month');
			var nowStart = now.format("YYYY-MM-DD");
			var nowEnd = nows.format("YYYY-MM-DD");
			var startMonth = now.format("YYYY-MM-DD");
			var endMonth = nows.add(1,'d').format("YYYY-MM-DD");
			end = nowStart + "到" + nowEnd;
			//console.log(end);   显示时间
			//startMonth endMonth是实际时间
			_ajaxStartTime = startMonth;
			var aa = $('.datetimepickereType').text();
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			var startSplit = startMonth.split('-');
			var endSplit = endMonth.split('-');
			_ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
			_ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
		}else if(_ajaxDataType == '年'){
			var now = moment(inputValue).startOf('year');
			var nows = moment(inputValue).endOf('year');
			var nowStart = now.format("YYYY-MM-DD");
			var nowEnd = nows.format("YYYY-MM-DD");
			var startYear = now.format("YYYY-MM-DD");
			var endYear = nows.add(1,'d').format("YYYY-MM-DD");
			end = nowStart + "到" + nowEnd;
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startYear;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			var startSplit = startYear.split('-');
			var endSplit = endYear.split('-');
			_ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
			_ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
		}
	})
	//对象选择
	//tip选项卡
	$('.left-middle-tab').click(function(){
		$('.left-middle-tab').removeClass('left-middle-tab-active');
		$(this).addClass('left-middle-tab-active');
	})
	//搜索框功能
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
	//总能耗
	myChart62 = echarts.init(document.getElementById('rheader-content-62'));
		option62 = {
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
		            name: '用电量（kWh）',
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
		            name:'平均用电',
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
		myChart62.setOption(option62);
	//排名
	myChart63 = echarts.init(document.getElementById('rheader-content-63'));
		option63 = {
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
		            name: '用电量（kWh）',
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
		            data:[2.3, 5.3, 9.3, 29.3, 24.7, 55.7, 125.6, 202.2, 48.7, 18.3, 6.4, 2.3],
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
		            data:[175],
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
		            data:[83],
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
		            data:[47],
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
		myChart63.setOption(option63);
	$('body').mouseover(function(){
		if(myChart62 && myChart63){
			myChart62.resize();
			myChart63.resize();
		}
	})
})
var myChart62;
var myChart63;
window.onresize = function () {
	if(myChart62 && myChart63){
		myChart62.resize();
		myChart63.resize();
	}
}
var _ajaxDataType;
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
//设置初始时间
//设置开始和结束初始值
var _ajaxStartTime = moment().startOf('month').format("YYYY-MM-DD");
var _ajaxEndTime = moment().endOf('month').format("YYYY-MM-DD");
var	_ajaxStartTime_1=moment().subtract(1,'d').format("YYYY/MM/DD");
var _ajaxEndTime_1=moment().format("YYYY/MM/DD");
//获取数据