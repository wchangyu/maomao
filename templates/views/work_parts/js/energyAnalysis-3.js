$(function(){
	//水电选择
	$(".electricity").click(function(){
		$(this).css({
			"background":"url(./work_parts/img/electricity_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".water").css({
			"background":"url(./work_parts/img/water.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".gas").css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
	$(".water").click(function(){
		$(this).css({
			"background":"url(./work_parts/img/water_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".electricity").css({
			"background":"url(./work_parts/img/electricity.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".gas").css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
	$(".gas").click(function(){
		$(this).css({
			"background":"url(./work_parts/img/gas_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".electricity").css({
			"background":"url(./work_parts/img/electricity.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".water").css({
			"background":"url(./work_parts/img/water.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
    //对象选择
     $(".left-middle-tab").click(function(){
        $(".left-middle-tab").css({
            "border":"2px solid #7f7f7f",
            "background":"#fff",
            "color":"#333"
        })
        $(this).css({
            "background":"#7f7f7f",
            "border":"2px solid #7f7f7f",
            "color":"#ffffff"
        })
        $(".tree-1").css({
            display:"none"
        }),
        $(".tree-1")[$(this).index()-1].style.display="block"
    });
	_objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),true);
	_objectSel.initOffices($("#allOffices"));
	//初始化模糊查找框，参数(输入框，提示框，ztree对应ul的id)
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
	//时间选择

	$('.time-options').click(function(){
		$('.time-options').removeClass('time-options-1');
		$(this).addClass('time-options-1');
		var sss = $('.time-options-1').index('.time-options');
		if(sss == 0){
			timeYesterday();
		}else if(sss == 1){
			timeLastWeek();
		}else if(sss == 2){
			timeLastMonth();
		}else if(sss == 3){
			timeLastYear();
		}
	})
	//默认时间；
	timeYesterday();
	//能耗选择
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	});
	$('.btns1').click(function (){
		getEcType();
		var o=$('.tree-3')[0].style.display;
		if(o == 'none'){
			//getOfficeData();
			//$('small').html(officeNames);
		}else{
			getPointerData();
			$('small').html(pointerNames);
		}
		console.log('能耗类型为：' + _ajaxEcType);
		console.log('开始时间为：' + newStr);
		console.log('结束时间为：' + newStr1);
		//console.log(_ajaxDateType_1);
		//console.log('同比开始时间为：' + tongNewStr);
		//console.log('同比结束时间为：' + tongNewStr1);
		//console.log(_ajaxDateType);
	})
	//电-同比分析-柱状图
	myChart14 = echarts.init(document.getElementById('rheader-content-17'));
		option14 = {
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        },
		        formatter: function (params) {
		            var tar = params[1];
		            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
		        }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: {
		        type : 'category',
		        splitLine: {show:false},
		        data : ['总费用','房租','水电费','交通费','伙食费','日用品数']
		    },
		    yAxis: {
		        type : 'value'
		    },
		    series: [
		        {
		            name: '辅助',
		            type: 'bar',
		            stack:  '总量',
		            itemStyle: {
		                normal: {
		                    barBorderColor: 'rgba(0,0,0,0)',
		                    color: 'rgba(0,0,0,0)'
		                },
		                emphasis: {
		                    barBorderColor: 'rgba(0,0,0,0)',
		                    color: 'rgba(0,0,0,0)'
		                }
		            },
		            data: [0, 1700, 1400, 1200, 300, 0]
		        },
		        {
		            name: '生活费',
		            type: 'bar',
		            stack: '总量',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'inside'
		                }
		            },
		            data:[2900, 1200, 300, 200, 900, 300]
		        }
		    ]
		};
		myChart14.setOption(option14);
	//电-环比分析-柱折图
	myChart15 = echarts.init(document.getElementById('rheader-content-18'));
		option15 = {
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
		        data:['蒸发量','降水量','平均温度']
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
		        },
		        {
		            type: 'value',
		            name: '温度',
		            min: 0,
		            max: 25,
		            interval: 5,
		            axisLabel: {
		                formatter: '{value} °C'
		            }
		        }
		    ],
		    series: [
		        {
		            name:'蒸发量',
		            type:'bar',
		            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
		        },
		        {
		            name:'降水量',
		            type:'bar',
		            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
		        },
		        {
		            name:'平均温度',
		            type:'line',
		            yAxisIndex: 1,
		            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
		        }
		    ]
		};
		 myChart15.setOption(option15);
	//电-环比分析-柱状图
	myChart16 = echarts.init(document.getElementById('rheader-content-19'));
		option16 = {
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        },
		        formatter: function (params) {
		            var tar = params[1];
		            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
		        }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: {
		        type : 'category',
		        splitLine: {show:false},
		        data : ['总费用','房租','水电费','交通费','伙食费','日用品数']
		    },
		    yAxis: {
		        type : 'value'
		    },
		    series: [
		        {
		            name: '辅助',
		            type: 'bar',
		            stack:  '总量',
		            itemStyle: {
		                normal: {
		                    barBorderColor: 'rgba(0,0,0,0)',
		                    color: 'rgba(0,0,0,0)'
		                },
		                emphasis: {
		                    barBorderColor: 'rgba(0,0,0,0)',
		                    color: 'rgba(0,0,0,0)'
		                }
		            },
		            data: [0, 1700, 1400, 1200, 300, 0]
		        },
		        {
		            name: '生活费',
		            type: 'bar',
		            stack: '总量',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'inside'
		                }
		            },
		            data:[2900, 1200, 300, 200, 900, 300]
		        }
		    ]
		};
		myChart16.setOption(option16);
})
var myChart13;
var myChart14;
var myChart15;
var myChart16;
window.onresize = function () {
    myChart13.resize(); 
    myChart14.resize();
    myChart15.resize();
    myChart16.resize();
}
//选取的能耗种类；
var _ajaxEcType;
function getEcType(){
	_ajaxEcType=$('.selectedEnergy').attr('value');
	console.log(_ajaxEcType);
}
//开始时间
var newStr;
//结束时间
var newStr1;
//环比开始时间
var huanNewStr;
//环比结束时间
var huanNewStr1;
//同比开始时间
var tongNewStr;
//同比结束时间
var tongNewStr1;
//dataType值
var _ajaxDateType;
var _ajaxDateType_1;
//上日时间
function timeYesterday(){
	var mDate = moment().subtract(1,'d').format('YYYY/MM/DD');
	var mDates = moment().format('YYYY/MM/DD');
	newStr = mDate;
	newStr1 = mDates;
	var huanmDate = moment().subtract(2,'d').format('YYYY/MM/DD');
	var huanmDates = moment().subtract(1,'d').format('YYYY/MM/DD');
	huanNewStr = huanmDate;
	huanNewStr1 = huanmDates;
	var tongmDate = moment().subtract(1,'year').subtract(1,'d').format('YYYY/MM/DD');
	var tongmDates = moment().subtract(1,'year').format('YYYY/MM/DD');
	tongNewStr = tongmDate;
	tongNewStr1 = tongmDates;
	_ajaxDateType = '小时';
	_ajaxDateType_1 = '日';
}
//上周时间(无环比)
function timeLastWeek(){
	var mDate = moment().subtract(7,'d').startOf('week').add(1,'d').format('YYYY/MM/DD');
	var mDates = moment().subtract(7,'d').endOf('week').add(2,'d').format('YYYY/MM/DD');
	newStr = mDate;
	newStr1 = mDates;
	var huanmDate = moment().subtract(14,'d').startOf('week').add(1,'d').format('YYYY/MM/DD');
	var huanmDates = moment().subtract(14,'d').endOf('week').add(2,'d').format('YYYY/MM/DD');
	huanNewStr = huanmDate;
	huanNewStr1 = huanmDates;
	_ajaxDateType = '日';
	_ajaxDateType_1 = '周';
}
//上月时间
function timeLastMonth(){
	var mDate = moment().subtract(1,'month').startOf('month').format('YYYY/MM/DD');
	var mDates = moment().subtract(1,'month').endOf('month').add(1,'d').format('YYYY/MM/DD');
	newStr = mDate;
	newStr1 = mDates;
	var huanmDate = moment().subtract(2,'month').startOf('month').format('YYYY/MM/DD');
	var huanmDates = moment().subtract(2,'month').endOf('month').add(1,'d').format('YYYY/MM/DD');
	huanNewStr = huanmDate;
	huanNewStr1 = huanmDates;
	var tongmDate = moment().subtract(1,'year').subtract(1,'month').startOf('month').format('YYYY/MM/DD');
	var tongmDates = moment().subtract(1,'year').subtract(1,'month').endOf('month').add(1,'d').format('YYYY/MM/DD');
	tongNewStr = tongmDate;
	tongNewStr1 = tongmDates;
	_ajaxDateType = '日';
	_ajaxDateType_1 = '月';
}
//上年时间
function timeLastYear(){
	var mDate = moment().subtract(1,'year').startOf('year').format('YYYY/MM/DD');
	var mDates = moment().subtract(1,'year').endOf('year').add(1,'d').format('YYYY/MM/DD');
	newStr = mDate;
	newStr1 = mDates;
	var huanmDate = moment().subtract(2,'year').startOf('year').format('YYYY/MM/DD');
	var huanmDates = moment().subtract(2,'year').endOf('year').add(1,'d').format('YYYY/MM/DD');
	huanNewStr = huanmDate;
	huanNewStr1 = huanmDates;
	var tongmDate = moment().subtract(2,'year').startOf('year').format('YYYY/MM/DD');
	var tongmDates = moment().subtract(2,'year').endOf('year').add(1,'d').format('YYYY/MM/DD');
	tongNewStr = tongmDate;
	tongNewStr1 = tongmDates;
	_ajaxDateType = '月';
	_ajaxDateType_1 = '年';
}
//楼宇数据
var pointerNames;
function getPointerData(){
	var allBranch = [];
	var allBranchs = [];
	var allDataX = [];
	var dataX = [];
	var dataY1 = [];
	var dataY2 = [];
	var pts = _objectSel.getSelectedPointers(),pointerID;
	if(pts.length > 0){
		pointerID = pts[0].pointerID;
		pointerNames = pts[0].pointerName;
	}
	if(!pointerID) { return; }
	var ecParams = {
		'ecTypeId':_ajaxEcType,
		'pointerID':pointerID,
		'startTime':newStr,
		'endTime':newStr1,
		'dateType':_ajaxDateType
	}
	var ecParamss = {
		'ecTypeId':_ajaxEcType,
		'pointerID':pointerID,
		'startTime':huanNewStr,
		'endTime':huanNewStr1,
		'dateType':_ajaxDateType
	}
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
		data:ecParams,
		async:false,
		success:function(result){
			allBranch.push(result);
		}
	})
	allDataX.push(allBranch);
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
		data:ecParamss,
		async:false,
		success:function(result){
			allBranchs.push(result);
		}
	})
	//console.log(ecParamss)
	allDataX.push(allBranchs);
	//获得横坐标的数据  dataX
	if(_ajaxDateType_1 == '日'){
		for(var i=0;i<allDataX.length;i++){
			var datas = allDataX[i];
			for(var j=0;j<datas.length;j++){
				var currentArr = datas[j];
				for(var z=0;z<currentArr.length;z++){
					if(dataX.indexOf(currentArr[z].dataDate.split('T')[1].split(':')[0]+':'+currentArr[z].dataDate.split('T')[1].split(':')[1])<0){
						dataX.push(currentArr[z].dataDate.split('T')[1].split(':')[0]+':'+currentArr[z].dataDate.split('T')[1].split(':')[1])
					}
				}
			}
		}
		//确定y周数据
		for(var i=0;i<allBranch.length;i++){
			var datas = allBranch[i];
			for(var j=0;j<datas.length;j++){
				for(var z =0;z<dataX.length;z++){
					if(datas[j].dataDate.split('T')[1].split(':')[0]+':'+datas[j].dataDate.split('T')[1].split(':')[1] == dataX[z]){
						dataY1.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		var maxData = _.max(datas,function(d){return d.data}).data;
		var maxDis = parseInt(maxData/5);
		console.log(maxDis)
		for(var i=0;i<allBranchs.length;i++){
			var datas = allBranchs[i];
			for(var j=0;j<datas.length;j++){
				for(var z =0;z<dataX.length;z++){
					if(datas[j].dataDate.split('T')[1].split(':')[0]+':'+datas[j].dataDate.split('T')[1].split(':')[1] == dataX[z]){
						dataY2.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
	}else{
		for(var i=0;i<allDataX.length;i++){
			var datas = allDataX[i];
			for(var j=0;j<datas.length;j++){
				var currentArr = datas[j];
				for(var z=0;z<currentArr.length;z++){
					if(dataX.indexOf(currentArr[z].dataDate.split('T')[0])<0){
						dataX.push(currentArr[z].dataDate.split('T')[0]);
					}
				}
			}
		}
		//确定y周数据
		for(var i=0;i<allBranch.length;i++){
			var datas = allBranch[i];
			for(var j=0;j<datas.length;j++){
				for(var z=0;z<dataX.length;z++){
					if( datas[j].dataDate.split('T')[0] == dataX[z]){
						dataY1.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		for(var i=0;i<allBranchs.length;i++){
			var datas = allBranchs[i];
			for(var j=0;j<datas.length;j++){
				for(var z=0;z<dataX.length;z++){
					if( datas[j].dataDate.split('T')[0] == dataX[z]){
						dataY2.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		var maxData = _.max(datas,function(d){return d.data}).data;
		var maxDis = maxData/5;
	}
	//电-同比分析-柱折图
	myChart13 = echarts.init(document.getElementById('rheader-content-16'));
	option13 = {
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
			data:['蒸发量','降水量','平均温度']
		},
		xAxis: [
			{
				type: 'category',
				data:dataX
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '用电量',
				min: 0,
				max: maxData,
				interval: maxDis,
				axisLabel: {
					formatter: '{value} kWh'
				}
			},
			{
				type: 'value',
				name: '温度',
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
				name:'蒸发量',
				type:'bar',
				data:dataY1
			},
			{
				name:'降水量',
				type:'bar',
				data:dataY2
			}
		]
	};
	myChart13.setOption(option13);
}
