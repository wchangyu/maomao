$(function(){
	$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(_ajaxStartTime_1 +'到'+_ajaxStartTime_1));

	_objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),true);
	_objectSel.initOffices($("#allOffices"));
	//搜索功能科室
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
	//搜索功能（楼宇）
	var objSearchs = new ObjectSearch();
	objSearchs.initPointerSearch($("#keys"),$(".tipess"),"allPointer");
	//日历格式初始化
	initDate();
	$('#datetimepicker').on('changeDate',function(e){
		var inputValue;
		dataType();
		inputValue = $('#datetimepicker').val();

		if(_ajaxDataType=="日"){
			inputValue = $('#datetimepicker').val();
			var now = moment(inputValue).startOf('day');
			var startDay= now.format("YYYY-MM-DD");
			var endDay= now.add(1,'d').format("YYYY-MM-DD");
			_ajaxStartTime=startDay;
			_ajaxDataType_1='小时';
			var end=startDay + "到" +startDay;
			var aa = $('.datetimepickereType').text();
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
		}else if(_ajaxDataType=="周"){
			var now = moment(inputValue).startOf('week');
			var nowStart = now.add(1,'d').format("YYYY-MM-DD");
			var nowEnd = now.add(6,'d').format("YYYY-MM-DD");
			var startWeek = now.add(1,'d').format("YYYY-MM-DD");
			var endWeek = now.add(7,'d').format("YYYY-MM-DD");
			end =nowStart + "到" + nowEnd;
			_ajaxDataType_1='日'
			//通过查找arr，判断目前选的与数组里的是不是重复
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startWeek;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
		}else if(_ajaxDataType=="月"){
			var now = moment(inputValue).startOf('month');
			var nows = moment(inputValue).endOf('month');
			var nowStart = now.format("YYYY-MM-DD");
			var nowEnd = nows.format("YYYY-MM-DD");
			var startMonth = now.format("YYYY-MM-DD");
			var endMonth = nows.add(1,'d').format("YYYY-MM-DD");
			end =nowStart + "到" + nowEnd;
			_ajaxDataType_1='日';

			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startMonth;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
		}else if(_ajaxDataType=="年"){
			var now = moment(inputValue).startOf('year');
			var nows = moment(inputValue).endOf('year');
			var nowStart = now.format("YYYY-MM-DD");
			var nowEnd = nows.format("YYYY-MM-DD");
			var startYear = now.format("YYYY-MM-DD");
			var endYear = nows.add(1,'d').format("YYYY-MM-DD");
			end = nowStart + "到" + nowEnd;
			_ajaxDataType_1='月'
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startYear;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
		}
		$('.datetimepickereType').delegate('.selectTime','click',function(){
			//点击删除选中的时间，相应的数组也要删除；
			$(this).remove();
		})
	});
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
		getEcType();
	});
	//对象选择
	$('.left-middle-tab').click(function(){
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
		$('.tree-1').hide();
		$('.tree-1').eq($(this).index()).show();
	})
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	});
	//echarts
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:[]
		},
		toolbox: {
			show: true,
			feature: {
				dataZoom: {
					yAxisIndex: 'none'
				},
				dataView: {readOnly: false},
				magicType: {type: ['line', 'bar']},
				restore: {},
				saveAsImage: {}
			}
		},
		xAxis:  {
			type: 'category',
			boundaryGap: false,
			data: []
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: []
	};
	timeDisposal();
	getSelectedTime();
	getEcType();
	dataType();
	_ajaxGetPointers();
	//页面加载时表头small内容
	var smalls = $('<small>');
	smalls.html(pointerNames);
	$('.page-title').append(smalls);
	setEnergyInfos();
	$('small').html(pointerNames);
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
	$('.btn').click(function(){
		myChart11 = echarts.init(document.getElementById('rheader-content-14'));
		getEcType();
		$('#tbody').empty();
		getSelectedTime();
		getEcType();
		dataType();
		getEcTypeWord();
		timeDisposal();
		var o=$('.tree-3')[0].style.display;
		if(o == "none"){
			_ajaxGetOffices();
			if($('.page-title').children('small').length){
				$('.page-title').children('small').remove();
			}
			var smalls = $('<small>');
			smalls.html(officeNames);
			$('.page-title').append(smalls);
		}else{
			_ajaxGetPointers();
			if($('.page-title').children('small').length){
				$('.page-title').children('small').remove();
			}
			var smalls = $('<small>');
			smalls.html(pointerNames);
			$('.page-title').append(smalls);
		}
		setEnergyInfos();
	})
	$('body').mouseover(function(){
		if(myChart11){
			myChart11.resize();
		}
	})
})
var _objectSel;
var myChart11;
//让echarts自适应
window.onresize = function () {
	if(myChart11){
		myChart11.resize();
	}
}
//选中的能耗种类
var _ajaxDataType_1='小时';
var _ajaxEcType="01";
function getEcType(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		aaa.push(jsonText.alltypes[i].etid)
	}
	_ajaxEcType = aaa[$('.selectedEnergy').index()];
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
//根据当前选择的能耗类型设置页面信息
function setEnergyInfos(){
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		if(jsonText.alltypes[i].etid == _ajaxEcType){
			$('#th0').html('对比对象');
			$('.ths').html('出现时刻');
			$('#th1').html('累计用' + jsonText.alltypes[i].etname + '量' + jsonText.alltypes[i].etunit);
			$('#th2').html('用' + jsonText.alltypes[i].etname + '峰值' + jsonText.alltypes[i].etunit);
			$('#th3').html('用' + jsonText.alltypes[i].etname + '谷值' + jsonText.alltypes[i].etunit);
			$('#th4').html('用' + jsonText.alltypes[i].etname + '平均值' + jsonText.alltypes[i].etunit);
			$('.header-right-lists').html('单位：' + jsonText.alltypes[i].etunit);
			$('.right-header span').html('用' + jsonText.alltypes[i].etname + '曲线');
			$('.header-one').html(jsonText.alltypes[i].etname);
		}
	}
}
//获取dataType
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
//设置开始和结束初始值
var _ajaxStartTime=moment().format("YYYY/MM/DD");
var _ajaxStartTime_1=moment().subtract(1,'d').format("YYYY-MM-DD");
var _ajaxEndTime_1=moment().add(1,'d').format("YYYY-MM-DD");
//选中时间处理
var startsTime=[];
var endsTime=[];
//存放开始，结束的时间
var aaaa=[];
var bbbb=[];
var _ajaxStartA=[];
var _ajaxEndA=[];
var startsTimes=[_ajaxStartTime_1];
var endsTimes=[_ajaxEndTime_1];
var arr=[];
function timeDisposal(){
	aaaa=[];
	bbbb=[];
	startsTime=[_ajaxStartTime_1];
	endsTime=[_ajaxEndTime_1];
	var $selectTime = $('.selectTime');
	for(var i=0;i< $selectTime.length;i++){
		var iSelectTime = $('.selectTime').eq(i).html().split('到')[0].split('-');
		aaaa.push(iSelectTime[0] + '/' + iSelectTime[1] + '/' + iSelectTime[2]);
		var iSelectTimes = $('.selectTime').eq(i).html().split('到')[1].split('-');
		var endDate = moment(iSelectTimes[0] + '/' + iSelectTimes[1] + '/' + iSelectTimes[2]);
		endDate = endDate.add(1,'d');
		bbbb.push(endDate.format("YYYY/MM/DD"));
	}
	_ajaxStartA = aaaa;
	_ajaxEndA = bbbb;
}
//获得pointer数据
var pointerID,pointerNames;
function _ajaxGetPointers(){
	var pts = _objectSel.getSelectedPointers();
	if(pts.length>0) {
		pointerID = pts[0].pointerID;
		pointerNames = pts[0].pointerName
	};
	if(!pointerID) { return; };
	timeDisposal();
	var allBranch=[];
	var dataX=[];
	var dataXx=[];
	var dataY=[];
	var maxArr_1=0;
	var minArr_1=0;
	var maxTime;
	var minTime;
	var _totalY=0;
	var average=0;
	for(var i=0;i<_ajaxStartA.length;i++){
		var nums = -1;
		startsTimess = _ajaxStartA[i];
		endsTimess=_ajaxEndA[i];
		var ecParams={
			'ecTypeId':_ajaxEcType,
			'pointerId':pointerID,
			'startTime':startsTimess,
			'endTime':endsTimess,
			'dateType':_ajaxDataType_1
		}
		var lengths = null;
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
			data:ecParams,
			async:true,
			success:function(result){
				allBranch = [];
				allBranch.push(result);
				nums ++;
				var datas,dataSplits,object,maxData,minData;
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
						dataX.sort();
						//y轴数据
						object = {};
						object.name = $('.selectTime').eq(nums).html();
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
						object.name=$('.selectTime').eq(nums).html();
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
						object.name = $('.selectTime').eq(nums).html();
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
					maxTime = maxData.dataDate;
					minArr_1 = minData.data;
					minTime = minData.dataDate;
					_totalY = 0;
					//总能耗
					for(var x=0;x<object.data.length;x++){
						_totalY+=object.data[x];
					}
					//平均值
					average=_totalY/object.data.length;
					$('#tbody').append('<tr><td>'+selectTime[nums]+'</td><td>'+unitConversion(_totalY)
						+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
						+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
						+'</td><td>'+unitConversion(average)+'</td></tr>')
					option11.legend.data = selectTime;
					option11.xAxis.data = dataX;
					option11.series = dataY;
					myChart11.setOption(option11);
				}
			},
			error:function(xhr,res,err){
				console.log("GetECByTypeAndPointer:" + err);
			}
		})
	}
}
//获得office数据
var officeID,officeNames;
function _ajaxGetOffices(){
	var ofs = _objectSel.getSelectedOffices();
	if(ofs.length>0) {
		officeID = ofs[0].f_OfficeID;
		officeNames = ofs[0].f_OfficeName;
	};
	if(!officeID){ return; }
	timeDisposal();
	var allBranch=[];
	var dataX=[];
	var dataXx=[];
	var dataY=[];
	var maxArr_1=0;
	var minArr_1=0;
	var maxTime;
	var minTime;
	var _totalY=0;
	var average=0;
	for(var i=0;i<_ajaxStartA.length;i++){
		var nums = -1;
		startsTimess = _ajaxStartA[i];
		endsTimess=_ajaxEndA[i];
		var ecParams={
			'ecTypeId':_ajaxEcTypeWord,
			'officeId':officeID,
			'startTime':startsTimess,
			'endTime':endsTimess,
			'dateType':_ajaxDataType_1
		}
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
			data:ecParams,
			async:true,
			success:function(result){
				allBranch = [];
				allBranch.push(result);
				nums ++;
				var datas,dataSplits,object,maxData,minData;
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
						dataX.sort();
						//y轴数据
						object = {};
						object.name = $('.selectTime').eq(nums).html();
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
						object.name=$('.selectTime').eq(nums).html();
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
						object.name = $('.selectTime').eq(nums).html();
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
					maxTime = maxData.dataDate;
					minArr_1 = minData.data;
					minTime = minData.dataDate;
					_totalY = 0;
					//总能耗
					for(var x=0;x<object.data.length;x++){
						_totalY+=object.data[x];
					}
					//平均值
					average=_totalY/object.data.length;
					$('#tbody').append('<tr><td>'+selectTime[nums]+'</td><td>'+unitConversion(_totalY)
						+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
						+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
						+'</td><td>'+unitConversion(average)+'</td></tr>')
					option11.legend.data = selectTime;
					option11.xAxis.data = dataX;
					option11.series = dataY;
					myChart11.setOption(option11);
				}
			},
			error:function(xhr,res,err){
				console.log("GetECByTypeAndOffice:" + err);
			}
		})
	}
}
var selectTime=[];
function getSelectedTime(){
	selectTime=[];
	for(var i=0;i<$('.selectTime').length;i++){
		selectTime.push($('.selectTime').eq(i).html())
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