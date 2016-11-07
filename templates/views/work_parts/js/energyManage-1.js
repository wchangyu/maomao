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
	$('.left-middle-tabs').click(function(){
		$('.left-middle-tabs').removeClass('left-middle-tab-active');
		$(this).addClass('left-middle-tab-active');
	});
	//前几个月tip
	$('.right-header-li').click(function(){
		var aa = $(this).parents('.right-top').find('.rheader-content-lefts');
		var bb = $(this).parents('.right-top').find('.rheader-content-leff');
		$(this).siblings().removeClass('right-header-li_after_52-1');
		$(this).addClass('right-header-li_after_52-1');
		aa.removeClass('shows').addClass('hiddens');
		aa.eq($(this).index()).removeClass('hiddens').addClass('shows');
		bb.removeClass('shows').addClass('hiddens');
		bb.eq($(this).index()).removeClass('hiddens').addClass('shows');
	})
	//默认加载时
	orderTypes();
	getPointerData();
	getOfficesData();
	getEcType();
	setEnergyInfos();
	$('.btns').click(function(){
		orderTypes();
		getPointerData();
		getOfficesData();
		getEcType();
		setEnergyInfos();
	})
	$('body').mouseover(function(){
		if(myChart70 && myChart71 && myChart72 && myChart73 && myChart80 && myChart81 && myChart82 && myChart83){
			myChart73.resize();
			myChart70.resize();
			myChart71.resize();
			myChart72.resize();
			myChart80.resize();
			myChart81.resize();
			myChart82.resize();
			myChart83.resize();
		}
	})
})
var myChart73,myChart70,myChart71,myChart72,myChart80,myChart81,myChart82,myChart83;
window.onresize = function () {
	if(myChart70 && myChart71 && myChart72 && myChart73 && myChart80 && myChart81 && myChart82 && myChart83){
		myChart73.resize();
		myChart70.resize();
		myChart71.resize();
		myChart72.resize();
		myChart80.resize();
		myChart81.resize();
		myChart82.resize();
		myChart83.resize();
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
//根据当前选择的能耗类型设置页面信息
function setEnergyInfos(){
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		if(jsonText.alltypes[i].etid == _ajaxEcType){
			$('.header-right-lists').html('单位：' + jsonText.alltypes[i].etunit);
		}
	}
}
//选中的能耗种类
var _ajaxEcType="01";
function getEcType(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		aaa.push(jsonText.alltypes[i].etid);
	}
	_ajaxEcType = aaa[$('.selectedEnergy').index()];
	console.log(_ajaxEcType);
}
//设置getECType的初始值(文字，office时用);
var _ajaxEcTypeWord="电";
function getEcTypeWord(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		aaa.push(jsonText.alltypes[i].etname);
	}
	_ajaxEcTypeWord = aaa[$('.selectedEnergy').index()];
}
//判断选择的排序（总能耗，单位面积or总人数）
var orderType
function orderTypes(){
	orderType = $('.left-middle-tab-active').html();
}
//获取楼宇数据
function getPointerData(){
	var allDatas = [];
	//存放前五的xy轴
	var theFirstFiveArrX = [];
	var theFirstFiveArrY = [];
	//存放前十的xy轴
	var theFirstTenArrX = [];
	var theFirstTenArrY = [];
	//存放后五的xy轴
	var theAfterFiveArrX = [];
	var theAfterFiveArrY = [];
	//存放全部的xy轴
	var theTotleArrX = [];
	var theTotleArrY = [];
	var paramPEC={
		'startTime':_ajaxStartTime_1,
		'endTime':_ajaxEndTime_1,
		'itemCount':'0'
	}
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix + 'EnergyItemDatas/GetTopPointerECs',
		data:paramPEC,
		async:false,
		success:function(result){
			allDatas.push(result)
		}
	})
	for(var i=0;i<allDatas.length;i++){
		var datas = allDatas[i];
		if(orderType == '总能耗'){
			var  totalEnergyConsumption = datas[0];
			//前五
			for(var j=0;j<5;j++){
				theFirstFiveArrX.push(totalEnergyConsumption[j].itemName);
				theFirstFiveArrY.push(totalEnergyConsumption[j].ecData);
			}
			//前十-----------------------------------------------------------------------------------------
			var theFirstTenArrLength;
			if(totalEnergyConsumption.length >= 10){
				theFirstTenArrLength = 10;
			}else{
				theFirstTenArrLength = totalEnergyConsumption.length;
			}
			for(var j=0;j<theFirstTenArrLength;j++){
				theFirstTenArrX.push(totalEnergyConsumption[j].itemName);
				theFirstTenArrY.push(totalEnergyConsumption[j].ecData);
			}
			//后五----------------------------------------------------------------------------------------
			var theAfterFive = totalEnergyConsumption.length-5;
			//var d =totalEnergyConsumption.length-1;d >=theAfterFive;d--
			for(var d =theAfterFive;d <= totalEnergyConsumption.length-1;d++){
				theAfterFiveArrX.push(totalEnergyConsumption[d].itemName);
				theAfterFiveArrY.push(totalEnergyConsumption[d].ecData);
			}
			//全部-----------------------------------------------------------------------------------------
			for(var d=0;d<totalEnergyConsumption.length;d++){
				theTotleArrX.push(totalEnergyConsumption[d].itemName);
				theTotleArrY.push(totalEnergyConsumption[d].ecData);
			}
		}else if(orderType == '单位面积'){
			var  totalEnergyConsumption = datas[1];
			//前五
			for(var j=0;j<5;j++){
				theFirstFiveArrX.push(totalEnergyConsumption[j].itemName);
				theFirstFiveArrY.push(totalEnergyConsumption[j].ecDataByArea);
			}
			//前十-----------------------------------------------------------------------------------------
			var theFirstTenArrLength;
			if(totalEnergyConsumption.length >= 10){
				theFirstTenArrLength = 10;
			}else{
				theFirstTenArrLength = totalEnergyConsumption.length;
			}
			for(var j=0;j<theFirstTenArrLength;j++){
				theFirstTenArrX.push(totalEnergyConsumption[j].itemName);
				theFirstTenArrY.push(totalEnergyConsumption[j].ecDataByArea);
			}
			//后五----------------------------------------------------------------------------------------
			var theAfterFive = totalEnergyConsumption.length-5;
			//var d =totalEnergyConsumption.length-1;d >=theAfterFive;d--
			for(var d =theAfterFive;d <= totalEnergyConsumption.length-1;d++){
				theAfterFiveArrX.push(totalEnergyConsumption[d].itemName);
				theAfterFiveArrY.push(totalEnergyConsumption[d].ecDataByArea);
			}
			//全部-----------------------------------------------------------------------------------------
			for(var d=0;d<totalEnergyConsumption.length;d++){
				theTotleArrX.push(totalEnergyConsumption[d].itemName);
				theTotleArrY.push(totalEnergyConsumption[d].ecDataByArea);
			}
		}else if(orderType == '总人数'){
			var  totalEnergyConsumption = datas[2];
			//前五
			for(var j=0;j<5;j++){
				theFirstFiveArrX.push(totalEnergyConsumption[j].itemName);
				theFirstFiveArrY.push(totalEnergyConsumption[j].ecDataByStaffCount);
			}
			//前十-----------------------------------------------------------------------------------------
			var theFirstTenArrLength;
			if(totalEnergyConsumption.length >= 10){
				theFirstTenArrLength = 10;
			}else{
				theFirstTenArrLength = totalEnergyConsumption.length;
			}
			for(var j=0;j<theFirstTenArrLength;j++){
				theFirstTenArrX.push(totalEnergyConsumption[j].itemName);
				theFirstTenArrY.push(totalEnergyConsumption[j].ecDataByStaffCount);
			}
			//后五----------------------------------------------------------------------------------------
			var theAfterFive = totalEnergyConsumption.length-5;
			//var d =totalEnergyConsumption.length-1;d >=theAfterFive;d--
			for(var d =theAfterFive;d <= totalEnergyConsumption.length-1;d++){
				theAfterFiveArrX.push(totalEnergyConsumption[d].itemName);
				theAfterFiveArrY.push(totalEnergyConsumption[d].ecDataByStaffCount);
			}
			//全部-----------------------------------------------------------------------------------------
			for(var d=0;d<totalEnergyConsumption.length;d++){
				theTotleArrX.push(totalEnergyConsumption[d].itemName);
				theTotleArrY.push(totalEnergyConsumption[d].ecDataByStaffCount);
			}
		}
		//前五
		myChart70 = echarts.init(document.getElementById('rheader-content-70'));
		option70 = {
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:['用电量']
			},
			toolbox: {
				show : true,
				feature : {
					dataView : {show: true, readOnly: false},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
				{
					axisLabel:{
						interval:0
					},
					type : 'category',
					data : theFirstFiveArrX
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name:'平均用电量',
					type:'bar',
					data:theFirstFiveArrY,
					itemStyle: {
						normal: {
							color: '#6bb1a6'
						}
					},
					markPoint : {
						data : [
							{type : 'max', name: '最大值'},
							{type : 'min', name: '最小值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					},
					markLine : {
						data : [
							{type : 'average', name: '平均值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					}
				}
			]
		};
		myChart70.setOption(option70);
		var theFirstFiveProportion = theFirstFiveArrY[0] / theFirstFiveArrY[theFirstFiveArrY.length-1];
		if(theFirstFiveArrY[theFirstFiveArrY.length-1] == 0){
			$('.L-rheader-content-right-1 .rheader-content-leff').eq(0).children('.theFirstFiveProportion').html('-')
		}else{
			$('.L-rheader-content-right-1 .rheader-content-leff').eq(0).children('.theFirstFiveProportion').html(theFirstFiveProportion.toFixed(2));
		}
		//前十
		myChart71 = echarts.init(document.getElementById('rheader-content-71'));
		option71 = {
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:['用电量']
			},
			toolbox: {
				show : true,
				feature : {
					dataView : {show: true, readOnly: false},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
				{
					axisLabel:{
						interval:0
					},
					type : 'category',
					data : theFirstTenArrX
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name:'平均用电量',
					type:'bar',
					data:theFirstTenArrY,
					itemStyle: {
						normal: {
							color: '#6bb1a6'
						}
					},
					markPoint : {
						data : [
							{type : 'max', name: '最大值'},
							{type : 'min', name: '最小值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					},
					markLine : {
						data : [
							{type : 'average', name: '平均值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					}
				}
			]
		};
		myChart71.setOption(option71);
		var theFirstTenProportion = theFirstTenArrY[0] / theFirstTenArrY[theFirstTenArrY.length-1];
		if(theFirstTenArrY[theFirstTenArrY.length-1] == 0){
			$('.L-rheader-content-right-1 .rheader-content-leff').eq(1).children('.theFirstFiveProportion').html('-')
		}else{
			$('.L-rheader-content-right-1 .rheader-content-leff').eq(1).children('.theFirstFiveProportion').html(theFirstTenProportion.toFixed(2));
		}
		//后五
		myChart72 = echarts.init(document.getElementById('rheader-content-72'));
		option72 = {
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:['用电量']
			},
			toolbox: {
				show : true,
				feature : {
					dataView : {show: true, readOnly: false},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
				{
					axisLabel:{
						interval:0
					},
					type : 'category',
					data : theAfterFiveArrX
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name:'平均用电量',
					type:'bar',
					data:theAfterFiveArrY,
					itemStyle: {
						normal: {
							color: '#6bb1a6'
						}
					},
					markPoint : {
						data : [
							{type : 'max', name: '最大值'},
							{type : 'min', name: '最小值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					},
					markLine : {
						data : [
							{type : 'average', name: '平均值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					}
				}
			]
		};
		myChart72.setOption(option72);
		var theAfterFiveProportion = theAfterFiveArrY[0] / theAfterFiveArrY[theAfterFiveArrY.length-1];
		if(theAfterFiveArrY[theAfterFiveArrY.length-1] == 0){
			$('.L-rheader-content-right-1 .rheader-content-leff').eq(2).children('.theFirstFiveProportion').html('-')
		}else{
			$('.L-rheader-content-right-1 .rheader-content-leff').eq(2).children('.theFirstFiveProportion').html(theAfterFiveProportion.toFixed(2));
		}
		//全部
		myChart73 = echarts.init(document.getElementById('rheader-content-73'));
		option73 = {
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:['用电量']
			},
			toolbox: {
				show : true,
				feature : {
					dataView : {show: true, readOnly: false},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
				{
					axisLabel:{
						interval:0
					},
					type : 'category',
					data : theTotleArrX
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name:'平均用电量',
					type:'bar',
					data:theTotleArrY,
					itemStyle: {
						normal: {
							color: '#6bb1a6'
						}
					},
					markPoint : {
						data : [
							{type : 'max', name: '最大值'},
							{type : 'min', name: '最小值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					},
					markLine : {
						data : [
							{type : 'average', name: '平均值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					}
				}
			]
		};
		myChart73.setOption(option73);
		var theTotleProportion = theTotleArrY[0] / theTotleArrY[theTotleArrY.length-1];
		if(theTotleArrY[theTotleArrY.length-1] == 0){
			$('.L-rheader-content-right-1 .rheader-content-leff').eq(3).children('.theFirstFiveProportion').html('-')
		}else{
			$('.L-rheader-content-right-1 .rheader-content-leff').eq(3).children('.theFirstFiveProportion').html(theTotleProportion.toFixed(2));
		}
	}
}
//获取科室数据
function getOfficesData(){
	var allDatas = [];
	//存放前五的xy轴
	var theFirstFiveArrX = [];
	var theFirstFiveArrY = [];
	//存放前十的xy轴
	var theFirstTenArrX = [];
	var theFirstTenArrY = [];
	//存放后五的xy轴
	var theAfterFiveArrX = [];
	var theAfterFiveArrY = [];
	//存放全部的xy轴
	var theTotleArrX = [];
	var theTotleArrY = [];
	var paramPEC={
		'startTime':_ajaxStartTime_1,
		'endTime':_ajaxEndTime_1,
		'itemCount':'0'
	}
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix + 'EnergyItemDatas/GetTopOfficeEcs',
		data:paramPEC,
		async:false,
		success:function(result){
			allDatas.push(result);
			return allDatas;
		}
	})
	for(var i=0;i<allDatas.length;i++){
		var datas = allDatas[i];
		if(orderType == '总能耗'){
			var  totalEnergyConsumption = datas[0];
			//前五
			for(var j=0;j<5;j++){
				theFirstFiveArrX.push(totalEnergyConsumption[j].itemName);
				theFirstFiveArrY.push(totalEnergyConsumption[j].ecData);
			}
			//前十-----------------------------------------------------------------------------------------
			var theFirstTenArrLength;
			if(totalEnergyConsumption.length >= 10){
				theFirstTenArrLength = 10;
			}else{
				theFirstTenArrLength = totalEnergyConsumption.length;
			}
			for(var j=0;j<theFirstTenArrLength;j++){
				theFirstTenArrX.push(totalEnergyConsumption[j].itemName);
				theFirstTenArrY.push(totalEnergyConsumption[j].ecData);
			}
			//后五----------------------------------------------------------------------------------------
			var theAfterFive = totalEnergyConsumption.length-5;
			for(var d =theAfterFive;d <= totalEnergyConsumption.length-1;d++){
				theAfterFiveArrX.push(totalEnergyConsumption[d].itemName);
				theAfterFiveArrY.push(totalEnergyConsumption[d].ecData);
			}
			//全部-----------------------------------------------------------------------------------------
			for(var d=0;d<totalEnergyConsumption.length;d++){
				theTotleArrX.push(totalEnergyConsumption[d].itemName);
				theTotleArrY.push(totalEnergyConsumption[d].ecData);
			}
		}else if(orderType == '单位面积'){
			var  totalEnergyConsumption = datas[1];
			//前五
			for(var j=0;j<5;j++){
				theFirstFiveArrX.push(totalEnergyConsumption[j].itemName);
				theFirstFiveArrY.push(totalEnergyConsumption[j].ecDataByArea);
			}
			//前十-----------------------------------------------------------------------------------------
			var theFirstTenArrLength;
			if(totalEnergyConsumption.length >= 10){
				theFirstTenArrLength = 10;
			}else{
				theFirstTenArrLength = totalEnergyConsumption.length;
			}
			for(var j=0;j<theFirstTenArrLength;j++){
				theFirstTenArrX.push(totalEnergyConsumption[j].itemName);
				theFirstTenArrY.push(totalEnergyConsumption[j].ecDataByArea);
			}
			//后五----------------------------------------------------------------------------------------
			var theAfterFive = totalEnergyConsumption.length-5;
			//var d =totalEnergyConsumption.length-1;d >=theAfterFive;d--
			for(var d =theAfterFive;d <= totalEnergyConsumption.length-1;d++){
				theAfterFiveArrX.push(totalEnergyConsumption[d].itemName);
				theAfterFiveArrY.push(totalEnergyConsumption[d].ecDataByArea);
			}
			//全部-----------------------------------------------------------------------------------------
			for(var d=0;d<totalEnergyConsumption.length;d++){
				theTotleArrX.push(totalEnergyConsumption[d].itemName);
				theTotleArrY.push(totalEnergyConsumption[d].ecDataByArea);
			}
		}else if(orderType == '总人数'){
			var  totalEnergyConsumption = datas[2];
			//前五
			for(var j=0;j<5;j++){
				theFirstFiveArrX.push(totalEnergyConsumption[j].itemName);
				theFirstFiveArrY.push(totalEnergyConsumption[j].ecDataByStaffCount);
			}
			//前十-----------------------------------------------------------------------------------------
			var theFirstTenArrLength;
			if(totalEnergyConsumption.length >= 10){
				theFirstTenArrLength = 10;
			}else{
				theFirstTenArrLength = totalEnergyConsumption.length;
			}
			for(var j=0;j<theFirstTenArrLength;j++){
				theFirstTenArrX.push(totalEnergyConsumption[j].itemName);
				theFirstTenArrY.push(totalEnergyConsumption[j].ecDataByStaffCount);
			}
			//后五----------------------------------------------------------------------------------------
			var theAfterFive = totalEnergyConsumption.length-5;
			//var d =totalEnergyConsumption.length-1;d >=theAfterFive;d--
			for(var d =theAfterFive;d <= totalEnergyConsumption.length-1;d++){
				theAfterFiveArrX.push(totalEnergyConsumption[d].itemName);
				theAfterFiveArrY.push(totalEnergyConsumption[d].ecDataByStaffCount);
			}
			//全部-----------------------------------------------------------------------------------------
			for(var d=0;d<totalEnergyConsumption.length;d++){
				theTotleArrX.push(totalEnergyConsumption[d].itemName);
				theTotleArrY.push(totalEnergyConsumption[d].ecDataByStaffCount);
			}
		}
		//前五
		myChart80 = echarts.init(document.getElementById('rheader-content-80'));
		option80 = {
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:['用电量']
			},
			toolbox: {
				show : true,
				feature : {
					dataView : {show: true, readOnly: false},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
				{
					axisLabel:{
						interval:0
					},
					type : 'category',
					data : theFirstFiveArrX
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name:'平均用电量',
					type:'bar',
					data:theFirstFiveArrY,
					itemStyle: {
						normal: {
							color: '#6bb1a6'
						}
					},
					markPoint : {
						data : [
							{type : 'max', name: '最大值'},
							{type : 'min', name: '最小值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					},
					markLine : {
						data : [
							{type : 'average', name: '平均值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					}
				}
			]
		};
		myChart80.setOption(option80);
		var theFirstFiveProportion = theFirstFiveArrY[0] / theFirstFiveArrY[theFirstFiveArrY.length-1];
		if(theFirstFiveArrY[theFirstFiveArrY.length-1] == 0){
			$('.L-rheader-content-right-2 .rheader-content-leff').eq(0).children('.theFirstFiveProportion').html('-')
		}else{
			$('.L-rheader-content-right-2 .rheader-content-leff').eq(0).children('.theFirstFiveProportion').html(theFirstFiveProportion.toFixed(2));
		}
		//前十
		myChart81 = echarts.init(document.getElementById('rheader-content-81'));
		option81 = {
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:['用电量']
			},
			toolbox: {
				show : true,
				feature : {
					dataView : {show: true, readOnly: false},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
				{
					axisLabel:{
						interval:0
					},
					type : 'category',
					data : theFirstTenArrX
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name:'平均用电量',
					type:'bar',
					data:theFirstTenArrY,
					itemStyle: {
						normal: {
							color: '#6bb1a6'
						}
					},
					markPoint : {
						data : [
							{type : 'max', name: '最大值'},
							{type : 'min', name: '最小值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					},
					markLine : {
						data : [
							{type : 'average', name: '平均值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					}
				}
			]
		};
		myChart81.setOption(option81);
		var theFirstTenProportion = theFirstTenArrY[0] / theFirstTenArrY[theFirstTenArrY.length-1];
		if(theFirstTenArrY[theFirstTenArrY.length-1] == 0){
			$('.L-rheader-content-right-2 .rheader-content-leff').eq(1).children('.theFirstFiveProportion').html('-')
		}else{
			$('.L-rheader-content-right-2 .rheader-content-leff').eq(1).children('.theFirstFiveProportion').html(theFirstTenProportion.toFixed(2));
		}
		//后五
		myChart82 = echarts.init(document.getElementById('rheader-content-82'));
		option82 = {
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:['用电量']
			},
			toolbox: {
				show : true,
				feature : {
					dataView : {show: true, readOnly: false},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
				{
					axisLabel:{
						interval:0
					},
					type : 'category',
					data : theAfterFiveArrX
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name:'平均用电量',
					type:'bar',
					data:theAfterFiveArrY,
					itemStyle: {
						normal: {
							color: '#6bb1a6'
						}
					},
					markPoint : {
						data : [
							{type : 'max', name: '最大值'},
							{type : 'min', name: '最小值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					},
					markLine : {
						data : [
							{type : 'average', name: '平均值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					}
				}
			]
		};
		myChart82.setOption(option82);
		var theAfterFiveProportion = theAfterFiveArrY[0] / theAfterFiveArrY[theAfterFiveArrY.length-1];
		if(theAfterFiveArrY[theAfterFiveArrY.length-1] == 0){
			$('.L-rheader-content-right-2 .rheader-content-leff').eq(2).children('.theFirstFiveProportion').html('-')
		}else{
			$('.L-rheader-content-right-2 .rheader-content-leff').eq(2).children('.theFirstFiveProportion').html(theAfterFiveProportion.toFixed(2));
		}
		//全部
		myChart83 = echarts.init(document.getElementById('rheader-content-83'));
		option83 = {
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:['用电量']
			},
			toolbox: {
				show : true,
				feature : {
					dataView : {show: true, readOnly: false},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			dataZoom:{
				orient:"horizontal", //水平显示
				show:true, //显示滚动条
				start:0, //起始值为20%
				end:10  //结束值为60%
			},
			xAxis : [
				{
					axisLabel:{
						interval:0
					},
					type : 'category',
					data : theTotleArrX
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name:'平均用电量',
					type:'bar',
					data:theTotleArrY,
					itemStyle: {
						normal: {
							color: '#6bb1a6'
						}
					},
					markPoint : {
						data : [
							{type : 'max', name: '最大值'},
							{type : 'min', name: '最小值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					},
					markLine : {
						data : [
							{type : 'average', name: '平均值'}
						],
						itemStyle: {
							normal: {
								color: '#d48265'
							}
						}
					}
				}
			]
		};
		myChart83.setOption(option83);
		var theTotleProportion = theTotleArrY[0] / theTotleArrY[theTotleArrY.length-1];
		if(theTotleArrY[theTotleArrY.length-1] == 0){
			$('.L-rheader-content-right-2 .rheader-content-leff').eq(3).children('.theFirstFiveProportion').html('-')
		}else{
			$('.L-rheader-content-right-2 .rheader-content-leff').eq(3).children('.theFirstFiveProportion').html(theTotleProportion.toFixed(2));
		}
	}
}