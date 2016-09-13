$(function(){
	$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(_ajaxStartTime_1 +'-'+_ajaxStartTime_1));

	_objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),true);
	_objectSel.initOffices($("#allOffices"));
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");

	$('#datetimepicker').datepicker(
		{
			language:  'zh-CN',
			todayBtn: 1,
			todayHighlight: 1,
			format: 'yyyy-mm-dd'
		}
	).on('changeDate',function(e){

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
			var end=startDay + "-" +startDay;
			var aa = $('.datetimepickereType').text();
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
		}else if(_ajaxDataType=="周"){
			var now = moment(inputValue).startOf('week');
			var startWeek=now.format("YYYY-MM-DD");
			startWeek = now.add(1,'d').format("YYYY-MM-DD");
			var endWeek = now.add(7,'d').format("YYYY-MM-DD");
			end =startWeek + "-" +endWeek;
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
			var startMonth=moment(inputValue).startOf('month').format("YYYY-MM-DD");
			var endMonth=moment(inputValue).endOf('month').format("YYYY-MM-DD");
			end =startMonth+"-"+endMonth;
			_ajaxDataType_1='日';

			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startMonth;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
		}else if(_ajaxDataType=="年"){
			var startYear=moment(inputValue).startOf('year').format("YYYY-MM-DD");
			var endYear=moment(inputValue).endOf('year').format("YYYY-MM-DD");
			end = startYear+"-"+endYear;
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

	//能耗种类
	$('.electricity').click(function(){
		$(this).css({
			"background":"url(./work_parts/img/electricity_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.water').css({
			"background":"url(./work_parts/img/water.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.gas').css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
	$('.water').click(function(){
		$(this).css({
			"background":"url(./work_parts/img/water_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.electricity').css({
			"background":"url(./work_parts/img/electricity.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.gas').css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
	$('.gas').click(function(){
		$(this).css({
			"background":"url(./work_parts/img/gas_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.electricity').css({
			"background":"url(./work_parts/img/electricity.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.water').css({
			"background":"url(./work_parts/img/water.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
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
		$('.tree-1').eq($(this).index()-1).show();
	})
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	})
	timeDisposal();
	getSelectedTime();
	getEcType();
	dataType();
	_ajaxGetPointers();
	$('.types').change(function(){
		$('.datetimepickereType').empty();
		startsTime.length=0;
		endsTime.length=0;
		startsTimes.length=0;
		endsTimes.length=0;
		arr.length=0;
	})
	$('.btns').click(function(){
		getEcType();
		$('#tbody').empty();
		getSelectedTime();
		getEcType();
		dataType();
		if(_ajaxEcType==01){
			$('#th1').text("累计用电量");
			$('#th2').text("用电峰值 kWh");
			$('#th3').text("用电谷值 kWh");
			$('#th4').text("用电平均值 kWh");
		}else if(_ajaxEcType==211){
			$('#th1').text("累计用水量");
			$('#th2').text("用水峰值 t");
			$('#th3').text("用水谷值 t");
			$('#th4').text("用水平均值 t");
		}else if(_ajaxEcType==311){
			$('#th1').text("累计用气量");
			$('#th2').text("用气峰值 m³");
			$('#th3').text("用气谷值 m³");
			$('#th4').text("用气平均值 m³");
		}
		getEcTypeWord();
		timeDisposal();
		var o=$('.tree-3')[0].style.display;
		if(o == "none"){
			_ajaxGetOffices();
			$('small').html(officeNames);
		}else{
			_ajaxGetPointers();
			$('small').html(pointerNames);
		}
	})
})

var _objectSel;
var myChart11;
//让echarts自适应
window.onresize = function () {
	myChart11.resize();
}

//选中的能耗种类
var _ajaxDataType_1='小时';
var _ajaxEcType="01";
function getEcType(){
	//首先判断哪个含有selectedEnergy类
	$('.selectedEnergy').attr('value');
	if($('.selectedEnergy').attr('value')==01){
		$('.header-one').html('电');
		$('.right-header span').html('用电曲线');
	}else if($('.selectedEnergy').attr('value')==211){
		$('.header-one').html('水');
		$('.right-header span').html('用水曲线');
	}else if($('.selectedEnergy').attr('value')==311){
		$('.header-one').html('气');
		$('.right-header span').html('用气曲线');
	}
	_ajaxEcType=$('.selectedEnergy').attr('value');
}
//设置getECType的初始值(文字，office时用);
var _ajaxEcTypeWord="电";
function getEcTypeWord(){
	_ajaxEcTypeWord=$('.selectedEnergy').children().html();
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
var _ajaxStartTime_1=moment().format("YYYY-MM-DD");
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
		var iSelectTime = $('.selectTime').eq(i).html();
		aaaa.push(iSelectTime.split('-')[0] + '/' + iSelectTime.split('-')[1] + '/' + iSelectTime.split('-')[2]);
		var endDate = moment(iSelectTime.split('-')[3] + '/' + iSelectTime.split('-')[4] + '/' + iSelectTime.split('-')[5]);
		endDate = endDate.add(1,'d');
		bbbb.push(endDate.format("YYYY-MM-DD"));
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
	if(!pointerID) { return; }
	timeDisposal();
	var _allData=[];
	var dataX=[];
	var dataY=[];
	var maxArr_1=0;
	var minArr_1=0;
	var maxTime;
	var minTime;
	var _totalY=0;
	var average=0;
	for(var i=0;i<_ajaxStartA.length;i++){
		startsTimess = _ajaxStartA[i];
		endsTimess=_ajaxEndA[i];
		var ecParams={
			'ecTypeId':_ajaxEcType,
			'pointerId':pointerID,
			'startTime':startsTimess,
			'endTime':endsTimess,
			'dateType':_ajaxDataType_1
		}
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
			data:ecParams,
			async:false,
			success:function(result){
				_allData.push(result);
			},
			error:function(xhr,res,err){
				console.log("GetECByTypeAndPointer:" + err);
			}
		})
	}
	if(_ajaxDataType=="日"){
		for(var i=0;i<_allData.length;i++){
			var datas=_allData[i];
			for(var j=0;j<datas.length;j++){
				if(dataX.indexOf(datas[j].dataDate.split('T')[1].slice(0,5))<0){
					dataX.push(datas[j].dataDate.split('T')[1].slice(0,5));
				}
			}
		}
		dataX.sort();
		//遍历y轴
		for(var i=0;i<_allData.length;i++){
			//循环创建对象
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[1].slice(0,5) == dataX[z]){
						object.data.push(datas[j].data);
					}
				}
			}
			dataY.push(object);
			var maxData = _.max(datas,function(data){return data.data});
			var minData = _.min(datas,function(data){return data.data});
			maxArr_1 = maxData.data;
			maxTime = maxData.dataDate;
			minArr_1 = minData.data;
			minTime = minData.dataDate;
			//总能耗
			_totalY = 0;
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+
				unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)+'</td><td>'+
				unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,minTime.length -3)+'</td><td>'+unitConversion(average)+'</td></tr>')
		}

	}else if(_ajaxDataType=="周"){
		dataX=['周日','周一','周二','周三','周四','周五','周六'];

		for(var i=0;i<_allData.length;i++){
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<datas.length;z++){
				object.data.push(datas[z].data);
			}
			dataY.push(object);
			var maxData = _.max(datas,function(data){return data.data});
			var minData = _.min(datas,function(data){return data.data});
			maxArr_1 = maxData.data;
			maxTime = maxData.dataDate;
			minArr_1 = minData.data;
			minTime = minData.dataDate;
			//总能耗
			_totalY = 0;
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'
				+unitConversion(maxArr_1)+'</td><td>'+maxTime.substr(0,10)+'</td><td>'+unitConversion(minArr_1)+'</td><td>'
				+minTime.substr(0,10)+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=="月"){
		for(var i=0;i<_allData.length;i++){
			var datas=_allData[i];
			for(var j=0;j<datas.length;j++){
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0])
				}
			}
		}
		for(var i=0;i<_allData.length;i++){
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[0] == dataX[z]){
						object.data.push(datas[j].data);
					}
				}
			}
			dataY.push(object);
			var maxData = _.max(datas,function(data){return data.data});
			var minData = _.min(datas,function(data){return data.data});
			maxArr_1 = maxData.data;
			maxTime = maxData.dataDate;
			minArr_1 = minData.data;
			minTime = minData.dataDate;
			//总能耗
			_totalY = 0;
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)
				+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.substr(0,10)+'</td><td>'+unitConversion(minArr_1)
				+'</td><td>'+minTime.substr(0,10)+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=="年"){
		for(var i=0;i<_allData.length;i++){
			var datas = _allData[i];
			for(var j=0;j<datas.length;j++){
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0]);
				}
			}
		}
		for(var i=0;i<_allData.length;i++){
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[0] == dataX[z]){
						object.data.push(datas[j].data);
					}
				}
			}
			dataY.push(object);
			var maxData = _.max(datas,function(data){return data.data});
			var minData = _.min(datas,function(data){return data.data});
			maxArr_1 = maxData.data;
			maxTime = maxData.dataDate;
			minArr_1 = minData.data;
			minTime = minData.dataDate;
			//总能耗
			_totalY = 0;
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'
				+unitConversion(maxArr_1)+'</td><td>'+maxTime.substr(0,7)+'</td><td>'+unitConversion(minArr_1)
				+'</td><td>'+minTime.substr(0,7)+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}
	getSelectedTime();
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:selectTime
		},
		xAxis:  {
			type: 'category',
			boundaryGap: false,
			data: dataX
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: dataY
	};
	myChart11.setOption(option11);
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
	var _allData=[];
	var dataX=[];
	var dataY=[];
	var maxArr_1=0;
	var minArr_1=0;
	var maxTime;
	var minTime;
	var _totalY=0;
	var average=0;
	for(var i=0;i<_ajaxStartA.length;i++){
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
			async:false,
			success:function(result){
				_allData.push(result);
			},
			error:function(xhr,res,err){
				console.log("GetECByTypeAndOffice:" + err);
			}
		})
	}
	if(_ajaxDataType=="日"){
		for(var i=0;i<_allData.length;i++){
			var datas = _allData[i];
			for(var j=0;j<datas.length;j++){
				if(dataX.indexOf(datas[j].dataDate.split('T')[1].slice(0,5))<0){
					dataX.push(datas[j].dataDate.split('T')[1].slice(0,5));
				}
			}
		}
		dataX.sort();
		//遍历y轴
		for(var i=0;i<_allData.length;i++){

			//循环创建对象
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[1].slice(0,5) == dataX[z]){
						object.data.push(datas[j].data);
					}
				}
			}
			dataY.push(object);
			var maxData = _.max(datas,function(d){return d.data});
			var minData = _.min(datas,function(d){return d.data});
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
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)
				+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
				+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
				+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=="周"){
		dataX=['周日','周一','周二','周三','周四','周五','周六'];
		for(var i=0;i<_allData.length;i++){
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<datas.length;z++){
				object.data.push(datas[z].data);
			}
			dataY.push(object);
			var maxData = _.max(datas,function(data){return data.data});
			var minData = _.min(datas,function(data){return data.data});
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
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)
				+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.substr(0,10)
				+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.substr(0,10)
				+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=="月"){
		for(var i=0;i<_allData.length;i++){
			var datas=_allData[i];
			for(var j=0;j<datas.length;j++){
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0])
				}
			}
		}
		for(var i=0;i<_allData.length;i++){
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[0] == dataX[z]){
						object.data.push(datas[j].data);
					}
				}
			}
			dataY.push(object);
			var maxData = _.max(datas,function(data){return data.data});
			var minData = _.min(datas,function(data){return data.data});
			maxArr_1 = maxData.data;
			maxTime = maxData.dataDate;
			minArr_1 = minData.data;
			minTime = minData.dataDate;
			//总能耗
			_totalY = 0;
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)
				+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.substr(0,10)
				+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.substr(0,10)
				+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=="年"){
		for(var i=0;i<_allData.length;i++){
			var datas = _allData[i];
			for(var j=0;j<datas.length;j++){
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0]);
				}
			}
		}
		for(var i=0;i<_allData.length;i++){

			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[0] == dataX[z]){
						object.data.push(datas[j].data);
					}
				}
			}
			dataY.push(object);
			var maxData = _.max(datas,function(data){return data.data});
			var minData = _.min(datas,function(data){return data.data});
			maxArr_1 = maxData.data;
			maxTime = maxData.dataDate;
			minArr_1 = minData.data;
			minTime = minData.dataDate;
			//总能耗
			_totalY = 0;
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)
				+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.substr(0,10)
				+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.substr(0,10)
				+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}
	getSelectedTime();
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:selectTime
		},
		xAxis:  {
			type: 'category',
			boundaryGap: false,
			data: dataX
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: dataY
	};
	myChart11.setOption(option11);
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