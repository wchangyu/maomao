$(function(){
	$('.datetimepickereType').html(_ajaxStartTime +'-'+_ajaxStartTime);
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
		getEcType();
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
	//搜索框功能(科室)
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
	//搜索功能（楼宇）
	var objSearchs = new ObjectSearch();
	objSearchs.initPointerSearch($("#keys"),$(".tipess"),"allPointer");
	//日历格式初始化
	initDate();
	$('.types').change(function(){
		var bbaa = $('.types').find('option:selected').val();
		if(bbaa == '月'){
			monthDate();
		}else if(bbaa == '年'){
			yearDate();
		}else{
			initDate();
		}
		$('.datetimepickereType').empty();
	})
	$('#datetimepicker').on('changeDate',function(e){
		dataType();
		inputValue = $('#datetimepicker').val();
		if(_ajaxDataType=="日"){
			inputValue = $('#datetimepicker').val();
			var now = moment(inputValue).startOf('day');
			var startDay = now.format("YYYY-MM-DD");
			var endDay = now.add(1,'d').format("YYYY-MM-DD");
			_ajaxStartTime=startDay;
			_ajaxDataType_1='小时';
			var end=startDay + "-" +startDay;
			var aa = $('.datetimepickereType').text();
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			var startSplit = startDay.split('-');
			var endSplit = endDay.split('-');
			_ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
			_ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
		}else if(_ajaxDataType=="周"){
			inputValue = $('#datetimepicker').val();
			var now = moment(inputValue).startOf('week');
			//页面显示时间
			var nowStart = now.add(1,'d').format("YYYY-MM-DD");
			var endStart = now.add(6,'d').format("YYYY-MM-DD");
			//实际计算开始结束时间
			var startWeek = now.subtract(6,'d').format("YYYY-MM-DD");
			var endWeek = now.add(7,'d').format("YYYY-MM-DD");
			end =nowStart + "-" + endStart;
			_ajaxDataType_1='日';
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startWeek;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			var startSplit = startWeek.split('-');
			var endSplit = endWeek.split('-');
			_ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
			_ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
		}else if(_ajaxDataType=="月"){
			var now = moment(inputValue).startOf('month');
			var nows = moment(inputValue).endOf('month');
			var nowStart = now.format("YYYY-MM-DD");
			var nowEnd = nows.format("YYYY-MM-DD");
			var startMonth = now.format("YYYY-MM-DD");
			var endMonth = nows.add(1,'d').format("YYYY-MM-DD");
			end = nowStart + "-" + nowEnd;
			_ajaxDataType_1 = '日';
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime = startMonth;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			var startSplit = startMonth.split('-');
			var endSplit = endMonth.split('-');
			_ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
			_ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
		}else if(_ajaxDataType=="年"){
			var now = moment(inputValue).startOf('year');
			var nows = moment(inputValue).endOf('year');
			var nowStart = now.format("YYYY-MM-DD");
			var nowEnd = nows.format("YYYY-MM-DD");
			var startYear = now.format("YYYY-MM-DD");
			var endYear = nows.add(1,'d').format("YYYY-MM-DD");
			end = nowStart + "-" + nowEnd;
			_ajaxDataType_1='月'
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
	});
	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	})
	//获取能耗种类；
	getEcType();
	//页面加载时的配置信息；
	setEnergyInfos();
	//获取时间段
	dataType();
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		tooltip: {
			trigger: 'axis'
		},
		legend:{
			data:[]
		},
		xAxis:  {
			type: 'category',
			boundaryGap: false,
			data:[]                   //dataX
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: []                      //dataY
	};
	getPointerData();
	//设置页面选择的时间
	$('.header-one').html($('.datetimepickereType').html());
	$('.btn').click(function(){
		myChart11 = echarts.init(document.getElementById('rheader-content-14'));
		$('#tbody').empty();
		//获取能耗种类；
		getEcType();
		//获取时间段
		dataType();
		var o=$('.tree-3')[0].style.display;
		if(o == "none"){
			getEcTypeWord();
			getOfficeData();
		}else{
			getPointerData();
		}
		setEnergyInfos();
	});
	$('body').mouseover(function(){
		if(myChart11){
			myChart11.resize();
		}
	})
})
var myChart11;
//让echarts自适应
window.onresize = function () {
	if(myChart11){
		myChart11.resize();
	}
}
//确定能耗种类
var _ajaxEcType;
function getEcType(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		aaa.push(jsonText.alltypes[i].etid)
	}
	_ajaxEcType = aaa[$('.selectedEnergy').index()];
}
//根据当前选择的能耗类型设置页面信息
function setEnergyInfos(){
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		if(jsonText.alltypes[i].etid == _ajaxEcType){
			$('#th0').html('对比对象');
			$('.ths').html('出现时刻');
			$('#th1').html('累计用' + jsonText.alltypes[i].etname + '量' + ' ' + jsonText.alltypes[i].etunit);
			$('#th2').html('用' + jsonText.alltypes[i].etname + '峰值' + ' ' + jsonText.alltypes[i].etunit);
			$('#th3').html('用' + jsonText.alltypes[i].etname + '谷值' + ' ' + jsonText.alltypes[i].etunit);
			$('#th4').html('用' + jsonText.alltypes[i].etname + '平均值' + jsonText.alltypes[i].etunit);
			$('.header-right-lists').html('单位：' + jsonText.alltypes[i].etunit);
			$('.right-header span').html('用' + jsonText.alltypes[i].etname + '曲线');
			$('.header-one').html($('.datetimepickereType').html());
		}
	}
}
//设置getECType的初始值(文字，office时用);
var _ajaxEcTypeWord = "电";
function getEcTypeWord(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		aaa.push(jsonText.alltypes[i].etname);
	}
	_ajaxEcTypeWord = aaa[$('.selectedEnergy').index()];
}
//获取dataType
var _ajaxDataType_1='小时';
var _ajaxDataType;
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
//设置开始和结束初始值
var _ajaxStartTime = moment().subtract(1,'d').format("YYYY-MM-DD");
var	_ajaxStartTime_1=moment().subtract(1,'d').format("YYYY/MM/DD");
var _ajaxEndTime_1=moment().format("YYYY/MM/DD");
//获得pointer数据
function getPointerData(){
	//用来存放x轴的数组
	var dataX=[];
	var dataY=[];
	var allBranch=[];
	var _totalY=0;
	var average=0;
	var dataXx=[];
	var pts = _objectSel.getSelectedPointers(),pointerID = [],pointerNames = [];
	if(pts.length>0) {
		for(var i=0;i<pts.length;i++){
			pointerID.push(pts[i].pointerID);
			pointerNames.push(pts[i].pointerName);
		}
	};
	for(var i=0;i<pointerID.length;i++){
		var nums = -1;
		pointerIds = pointerID[i];
		var ecParams={
			'ecTypeId':_ajaxEcType,
			'pointerId': pointerIds,
			'startTime':_ajaxStartTime_1,
			'endTime':_ajaxEndTime_1,
			'dateType':_ajaxDataType_1
		};
		var lengths = null;
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
			data:ecParams,
			async:true,
			success:function(result){
				allBranch = [];
				nums ++;
				var datas,dataSplits,object,maxData,minData;
				allBranch.push(result);
				lengths = allBranch[0];
				if(lengths != null){
					if(_ajaxDataType=='日'){
						//x轴数据
						for(var j=0;j<lengths.length;j++){
							datas = lengths[j];
							dataSplits = datas.dataDate.split('T')[1].slice(0,5);
							if(dataX.indexOf(dataSplits)<0){
								dataX.push(dataSplits);
							}
						}
						//y轴数据
						object = {};
						object.name = pointerNames[nums];
						object.type = 'line';
						object.data = [];
						for(var j=0;j<lengths.length;j++){
							for(var z=0;z<dataX.length;z++){
								if(lengths[j].dataDate.split('T')[1].slice(0,5) == dataX[z]){
									object.data.push(lengths[j].data)
								}
							}
						}
						dataY.push(object);
					}else if(_ajaxDataType=='周'){
						dataX=['周一','周二','周三','周四','周五','周六','周日'];
						//x轴数据
						for(var j=0;j<lengths.length;j++){
							datas = lengths[j];
							dataSplits = datas.dataDate.split('T')[0];
							if(dataXx.indexOf(dataSplits)<0){
								dataXx.push(dataSplits);
							}
						}
						//y轴数据
						object = {};
						object.name=pointerNames[nums];
						object.type = 'line';
						object.data=[];
						for(var j=0;j<lengths.length;j++){
							for(var z=0;z<dataXx.length;z++){
								if(lengths[j].dataDate.split('T')[0] == dataXx[z]){
									object.data.push(lengths[j].data);
								}
							}
						}
						dataY.push(object);
					}else if(_ajaxDataType=='月' || _ajaxDataType=='年'){
						//x轴数据
						for(var j=0;j<lengths.length;j++){
							datas = lengths[j];
							dataSplits = datas.dataDate.split('T')[0];
							if(dataX.indexOf(dataSplits)<0){
								dataX.push(dataSplits);
							}
						}
						//y周数据
						object = {};
						object.name = pointerNames[nums];
						object.type = 'line';
						object.data = [];
						for(var j=0;j<lengths.length;j++){
							for(var z=0;z<dataX.length;z++){
								if(lengths[j].dataDate.split('T')[0] == dataX[z]){
									object.data.push(lengths[j].data);
								}
							}
						}
						dataY.push(object);
					}
					maxData = _.max(lengths,function(d){return d.data});
					minData = _.min(lengths,function(d){return d.data});
					maxArr_1 = maxData.data;
					maxTime = maxData.dataDate
					minArr_1 = minData.data;
					minTime = minData.dataDate
					_totalY = 0;
					//总能耗
					for(var x=0;x<object.data.length;x++){
						_totalY+=object.data[x];
					}
					//平均值
					average=_totalY/object.data.length;
					$('#tbody').append('<tr><td>'+pointerNames[nums]+'</td><td>'+unitConversion(_totalY)
						+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
						+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
						+'</td><td>'+unitConversion(average)+'</td></tr>')
					option11.legend.data = pointerNames;
					option11.xAxis.data = dataX;
					option11.series = dataY;
					myChart11.setOption(option11);
				}
			},
			error: function (xhr, text, err) {
				console.log(JSON.parse(xhr.responseText).message);
			}
		})
	}

}
//表格单位转换
function unitConversion(num){
	if(num>10000){
		num= num/10000;
		num=num.toFixed(2);
		var num_=num + '万';
		return num_;
	}else{
		return num.toFixed(2);
	}
}
//获得office数据
function getOfficeData(){
	//用来存放x轴的数组
	var dataX=[];
	var dataY=[];
	var allBranch=[];
	var _totalY=0;
	var average=0;
	var dataXx=[];
	var ofs = _objectSel.getSelectedOffices(),officeID = [],officeNames = [];
	for(var i=0;i<ofs.length;i++){
		officeID.push(ofs[i].f_OfficeID);
		officeNames.push(ofs[i].f_OfficeName);
	}
	for(var i=0;i<officeID.length;i++){
		var nums = -1;
		var officeIds=officeID[i];
		var ecParams={
			'ecTypeId':_ajaxEcTypeWord,
			'officeId': officeIds,
			'startTime':_ajaxStartTime_1,
			'endTime':_ajaxEndTime_1,
			'dateType':_ajaxDataType_1
		}
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
			data:ecParams,
			async:true,
			success:function(result){
				allBranch = [];
				nums ++;
				var datas,dataSplits,object,maxData,minData;
				allBranch.push(result);
				lengths = allBranch[0];
				if(lengths.length != null){
					if(_ajaxDataType=='日'){
						//x轴数据
						for(var j=0;j<lengths.length;j++){
							datas = lengths[j];
							dataSplits = datas.dataDate.split('T')[1].slice(0,5);
							if(dataX.indexOf(dataSplits)<0){
								dataX.push(dataSplits);
							}
						}
						//y轴数据
						object = {};
						object.name = officeNames[nums];
						object.type = 'line';
						object.data = [];
						for(var j=0;j<lengths.length;j++){
							for(var z=0;z<dataX.length;z++){
								if(lengths[j].dataDate.split('T')[1].slice(0,5) == dataX[z]){
									object.data.push(lengths[j].data)
								}
							}
						}
						dataY.push(object);
					}else if(_ajaxDataType=='周'){
						dataX=['周一','周二','周三','周四','周五','周六','周日'];
						//x轴数据
						for(var j=0;j<lengths.length;j++){
							datas = lengths[j];
							dataSplits = datas.dataDate.split('T')[0];
							if(dataXx.indexOf(dataSplits)<0){
								dataXx.push(dataSplits);
							}
						}
						//y轴数据
						object = {};
						object.name=officeNames[nums];
						object.type = 'line';
						object.data=[];
						for(var j=0;j<lengths.length;j++){
							for(var z=0;z<dataXx.length;z++){
								if(lengths[j].dataDate.split('T')[0] == dataXx[z]){
									object.data.push(lengths[j].data);
								}
							}
						}
						dataY.push(object);
					}else if(_ajaxDataType=='月' || _ajaxDataType=='年'){
						//x轴数据
						for(var j=0;j<lengths.length;j++){
							datas = lengths[j];
							dataSplits = datas.dataDate.split('T')[0];
							if(dataX.indexOf(dataSplits)<0){
								dataX.push(dataSplits);
							}
						}
						//y周数据
						object = {};
						object.name = officeNames[nums];
						object.type = 'line';
						object.data = [];
						for(var j=0;j<lengths.length;j++){
							for(var z=0;z<dataX.length;z++){
								if(lengths[j].dataDate.split('T')[0] == dataX[z]){
									object.data.push(lengths[j].data);
								}
							}
						}
						dataY.push(object);
					}
					maxData = _.max(lengths,function(d){return d.data});
					minData = _.min(lengths,function(d){return d.data});
					maxArr_1 = maxData.data;
					maxTime = maxData.dataDate
					minArr_1 = minData.data;
					minTime = minData.dataDate
					_totalY = 0;
					//总能耗
					for(var x=0;x<object.data.length;x++){
						_totalY+=object.data[x];
					}
					//平均值
					average=_totalY/object.data.length;
					$('#tbody').append('<tr><td>'+officeNames[nums]+'</td><td>'+unitConversion(_totalY)
						+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
						+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
						+'</td><td>'+unitConversion(average)+'</td></tr>')
					option11.legend.data = officeNames;
					option11.xAxis.data = dataX;
					option11.series = dataY;
					myChart11.setOption(option11);
				}
			},
			error: function (xhr, text, err) {
				console.log(JSON.parse(xhr.responseText).message);
			}
		})
	}



}
//月的时间初始化
function monthDate(){
	$('#datetimepicker').datepicker('destroy');
	$('#datetimepicker').datepicker({
		startView: 1,
		maxViewMode: 2,
		minViewMode:1,
		format: "yyyy-mm-dd",//选择日期后，文本框显示的日期格式
		language: "zh-CN" //汉化
	})
}
//年的时间初始化
function yearDate(){
	$('#datetimepicker').datepicker('destroy');
	$('#datetimepicker').datepicker({
		startView: 2,
		maxViewMode: 2,
		minViewMode:2,
		format: "yyyy-mm-dd",//选择日期后，文本框显示的日期格式
		language: "zh-CN" //汉化
	})
}
//一般时间初始化
function initDate(){
	$('#datetimepicker').datepicker('destroy');
	$('#datetimepicker').datepicker(
		{
			language:  'zh-CN',
			todayBtn: 1,
			todayHighlight: 1,
			format: 'yyyy-mm-dd'
		}
	)
}