$(function(){
	//读目录
	getSessionStoragePointer();
	getSessionStorageOffice();
	//datetimepicker
	$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(_ajaxStartTime_1 +'-'+_ajaxEndTime_1))
	//确定选中的楼宇id
	$('.tree-1:eq(0)').delegate('span','click',function(){
		//确保只有当前点击的span是黄色
		$('.tree-1:eq(0) span').removeClass('active');
		$('.tree-1:eq(1) span').removeClass('active');
		$(this).addClass('active');
		//console.log($('.tree-1:eq(0) span').index(this))
		_ajaxPointerId=_allPointerId[$('.tree-1:eq(0) span').index($(this))-1];
		//console.log(_ajaxPointerId)
	})
	//确定选中的科室id
	$('.allOffices').delegate('span','click',function(){
		$('.tree-1:eq(0) span').removeClass('active');
		$('.tree-1:eq(1) span').removeClass('active');
		$(this).addClass('active');
		_ajaxPointerId=_allOfficeId[$('.tree-1:eq(1) span').index($(this))];
		//console.log(_ajaxPointerId)
	})
	//datetimepicker
	timeDisposal();
	//监测每次的select值，将选项清零
	$('.types').change(function(){
		$('.datetimepickereType').empty();
		startsTime.length=0;
		endsTime.length=0;
		startsTimes.length=0;
		endsTimes.length=0;
		arr.length=0;
	})
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
		$('.left-middle-tab').css({
			"background":'#fff',
			"color":'#333'
		})
		$(this).css({
			"background":'#7f7f7f',
			"color":'#fff'
		})
		$('.tree-1').css({
			'display':'none'
		})
		$(".tree-1")[$(this).index()-1].style.display="block";
	});
	//默认的ajax
	_ajaxGetPointer();
	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	})
	getEcType();
	dataType();
	selectTime.push($('.selectTime').eq(0).html());
	_ajaxGetPointer();
	$('.btns').click(function(){
		if($('#floor').hasClass('active')){
			_ajaxPointerId=0;
			//console.log(_ajaxPointerId)
		}
		$('#tbody').empty();
		getPointerName();
		getEcType();
		dataType();
		getEcTypeWord();
		//确定选中的是楼宇还是id
		if(($('.main-left-middle .tree-1:eq(0):visible').length != 0)){
			//alert(1)
			_ajaxGetPointer();
		}else if(($('.main-left-middle .tree-1:eq(0):visible').length == 0)){
			//alert(2)
			_ajaxGetOffice();
		}
		$('.header-one').html(($('.tree').find('.active').text()));
	})
})
var myChart11;
//让echarts自适应
window.onresize = function () {
	myChart11.resize();
}
//_ajax数据传参  dataType，id，按日月年，时间
//新建数组存放楼宇和科室的id
var _allPointerId=[];
var _allOfficeId=[];
//发送请求时的pointerId
var _ajaxPointerId=[0];
//首先将sessionStorage的内容写入html中
function getSessionStoragePointer(){
	var jsonText1=sessionStorage.getItem('pointers');
	var htmlTxet1 = JSON.parse(jsonText1);
	var _allSter1='<li><span class="choice">'+htmlTxet1[0].pointerName+'</span></li>';
	_allSter1+='<li><span class="choice">'+htmlTxet1[1].pointerName+'</span></li>'
	for(var i=2;i<htmlTxet1.length;i++){
		_allSter1 +='<li><span class="choice">'+htmlTxet1[i].pointerName+'</span></li>'
	}
	for(var i=0;i<htmlTxet1.length;i++){
		_allPointerId.push(htmlTxet1[i].pointerID)
	}
	//console.log(_allPointerId)
	$('.allPointer').append(_allSter1);
}
function getSessionStorageOffice(){
	var jsonText2=sessionStorage.getItem('offices');
	var htmlText2 = JSON.parse(jsonText2);
	var _allSter2 ='<li><span class="choice">'+htmlText2[0].f_OfficeName+'</span></li>'
	for(var i=1;i<htmlText2.length;i++){
		_allSter2 += '<li><span class="choice">'+htmlText2[i].f_OfficeName+'</span></li>'
	}
	for(var i=0;i<htmlText2.length;i++){
		_allOfficeId.push(htmlText2[i].f_OfficeID)
	}
	//console.log(_allOfficeId)
	$('.allOffices').append(_allSter2);
}
//选中的能耗种类
var _ajaxDataType_1='小时';
var _ajaxEcType=01;
function getEcType(){
	_ajaxEcType=$('.selectedEnergy').attr('value');
}
//设置getECType的初始值(文字，office时用);
var _ajaxEcTypeWord="电";
function getEcTypeWord(){
	_ajaxEcTypeWord=$('.selectedEnergy').children().html();
	//console.log(_ajaxEcTypeWord)
}
//获取dataType
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	//console.log(dataType)
	_ajaxDataType=dataType;
	//console.log(_ajaxDataType);
}
//设置开始和结束初始值
var _ajaxStartTime=moment().format("YYYY/MM/DD");
var _ajaxEndTime=moment().add(1,'d').format("YYYY/MM/DD");
var _ajaxStartTime_1=moment().format("YYYY-MM-DD");
var _ajaxEndTime_1=moment().add(1,'d').format("YYYY-MM-DD");
//console.log(_ajaxStartTime_1);
//选中时间处理
var startsTime=[];   //2016-08-01
var endsTime=[];
//存放开始，结束的时间
var aaaa=[];  //2016/08/01格式 开始日期
var bbbb=[];  //结束日期
//暂存每次的结束时间和开始时间；
var startA=_ajaxStartTime;
var endA=_ajaxEndTime;
var _ajaxStartA=[];
var _ajaxEndA=[];
var startsTimes=[_ajaxStartTime_1];  //2016/08/01
var endsTimes=[_ajaxEndTime_1];
var arr=[];
function timeDisposal(){
	aaaa=[];
	bbbb=[];
	var end;
	var inputValue;
	startsTime=[_ajaxStartTime_1];
	endsTime=[_ajaxEndTime_1];
	$('#datetimepicker').on('focus',function(){
		dataType();
		inputValue = $('#datetimepicker').val();
		for(var i=0;i<arr.length;i++){
			if(arr[i] == inputValue){
				return
			}
		}
		arr.push(inputValue);
		if(_ajaxDataType=="日"){
			inputValue = $('#datetimepicker').val();
			var startDay=moment(inputValue).startOf('day').format("YYYY-MM-DD");
			//var endDay=moment(inputValue).startOf('day').format("YYYY-MM-DD");
			var endDay=moment(inputValue).add(1,'d').format("YYYY-MM-DD");
			_ajaxStartTime=startDay;
			_ajaxEndTime=endDay;
			_ajaxDataType_1='小时';
			var end=startDay + "-" +endDay;
			if(_ajaxStartTime.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
			}
			//console.log(_ajaxStartTime)    //少一个
		}else if(_ajaxDataType=="周"){
			var startWeek=moment(inputValue).startOf('week').format("YYYY-MM-DD");
			var endWeek=moment(inputValue).endOf('week').add(1,'d').format("YYYY-MM-DD");
			end =startWeek + "-" +endWeek;
			_ajaxDataType_1='日'
			//通过查找arr，判断目前选的与数组里的是不是重复
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startWeek;
			_ajaxEndTime=endWeek;
			if(_ajaxStartTime.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
		}else if(_ajaxDataType=="月"){
			var startMonth=moment(inputValue).startOf('month').format("YYYY-MM-DD");
			var endMonth=moment(inputValue).endOf('month').format("YYYY-MM-DD");
			end =startMonth+"-"+endMonth;
			_ajaxDataType_1='日';
			//console.log(end)
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startMonth;
			_ajaxEndTime=endMonth;
			//console.log(aa);
			//console.log(end);
			if(_ajaxStartTime.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
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
			_ajaxEndTime=endYear;
			if(_ajaxStartTime.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
		}
		$('.datetimepickereType').delegate('.selectTime','click',function(){
			//点击删除选中的时间，相应的数组也要删除；
			$(this).remove();
		})
	})
	for(var i=0;i<$('.selectTime').length;i++){
		aaaa.push($('.selectTime').eq(i).html().split('-')[0]+'/'+$('.selectTime').eq(i).html().split('-')[1]+'/'+$('.selectTime').eq(i).html().split('-')[2])
		bbbb.push($('.selectTime').eq(i).html().split('-')[3]+'/'+$('.selectTime').eq(i).html().split('-')[4]+'/'+$('.selectTime').eq(i).html().split('-')[5])
	}
	_ajaxStartA = aaaa;
	_ajaxEndA = bbbb;
}
//获得pointer数据
function _ajaxGetPointer(){
	timeDisposal()
	var _allData=[];
	var dataX=[];
	var dataY=[];
	//存放最大/最小值的数组
	var maxArr=[];
	var minArr=[];
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
			'pointerId':_ajaxPointerId,
			'startTime':startsTimess,
			'endTime':endsTimess,
			'dateType':_ajaxDataType_1
		}
		$.ajax({
			type:'post',
			url:'http://211.100.28.180/BEEWebAPI/api/ecDatas/GetECByTypeAndPointer',
			data:ecParams,
			async:false,
			success:function(result){
				//console.log(result);
				_allData.push(result);
			},
			error:function(){
				alert('未获取到数据')
			}
		})
	}
	//console.log(_allData)
	if(_ajaxDataType=="日"){
		for(var i=0;i<_allData.length;i++){
			var datas=_allData[i];
			//console.log(datas);
			for(var j=0;j<datas.length;j++){
				if(dataX.indexOf(datas[j].dataDate.split('T')[1].slice(0,5))<0){
					dataX.push(datas[j].dataDate.split('T')[1].slice(0,5));
				}
			}
		}
		dataX.sort();
		//console.log(dataX);
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
						maxArr.push(datas[j].data);
						minArr.push(datas[j].data);
					}
				}
				if(z === datas.length){
					object.data.push(0)
				}
			}
			dataY.push(object);
			//console.log(dataY)
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//console.log(maxArr_1);
			//console.log(minArr_1);
			//确定最大最小值出现的时间；
				for(var x=0;x<_allData.length;x++){
					var datas=_allData[x];
					for(var j=0;j<datas.length;j++){
						if(maxArr_1==datas[j].data){
							maxTime=datas[j].dataDate.split('T')[1].slice(0,5);
						}
						if(minArr_1==datas[j].data){
							minTime=datas[j].dataDate.split('T')[1].slice(0,5);
						}
					}
				}
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//console.log(_totalY)
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}

	}else if(_ajaxDataType=="周"){
		dataX=['周日','周一','周二','周三','周四','周五','周六'];
		//console.log(_allData);
		for(var i=0;i<_allData.length;i++){
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<datas.length;z++){
				object.data.push(datas[z].data);
				maxArr.push(datas[z].data);
				minArr.push(datas[z].data);
			}
			if(dataX.length === datas.length){
				object.data.push(0);

			}
			dataY.push(object);
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//确定最大最小值出现的时间；
			for(var x=0;x<_allData.length;x++){
				var datas=_allData[x];
				for(var j=0;j<datas.length;j++){
					if(maxArr_1==datas[j].data){
						maxTime=datas[j].dataDate.split('T')[0];
					}
					if(minArr_1==datas[j].data){
						minTime=datas[j].dataDate.split('T')[0];
					}
				}
			}
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			//console.log(selectTime);
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
		//console.log(dataY)
	}else if(_ajaxDataType=="月"){
		//console.log(_allData)
		for(var i=0;i<_allData.length;i++){
			var datas=_allData[i];
			for(var j=0;j<datas.length;j++){
				//console.log(datas[j]);
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0])
				}
				//console.log(dataX);
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
						maxArr.push(datas[j].data);
						minArr.push(datas[j].data);
					}
				}
				if(z === datas.length){
					object.data.push(0);
				}
			}
			dataY.push(object);
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//确定最大最小值出现的时间；
			for(var x=0;x<_allData.length;x++){
				var datas=_allData[x];
				for(var j=0;j<datas.length;j++){
					if(maxArr_1==datas[j].data){
						maxTime=datas[j].dataDate.split('T')[0];
					}
					if(minArr_1==datas[j].data){
						minTime=datas[j].dataDate.split('T')[0];
					}
				}
			}
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=="年"){
		//console.log(_allData)
		for(var i=0;i<_allData.length;i++){
			var datas = _allData[i];
			for(var j=0;j<datas.length;j++){
				//console.log(datas[j])
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0]);
				}
			}
			//console.log(dataX)
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
						maxArr.push(datas[j].data);
						minArr.push(datas[j].data);
					}
				}
				if(z === datas.length){
					object.data.push(0)
				}
			}
			dataY.push(object);
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//确定最大最小值出现的时间；
			for(var x=0;x<_allData.length;x++){
				var datas=_allData[x];
				for(var j=0;j<datas.length;j++){
					if(maxArr_1==datas[j].data){
						maxTime=datas[j].dataDate.split('T')[0];
					}
					if(minArr_1==datas[j].data){
						minTime=datas[j].dataDate.split('T')[0];
					}
				}
			}
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}
	getPointerName();
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
function _ajaxGetOffice(){
	timeDisposal();
	var _allData=[];
	var dataX=[];
	var dataY=[];
	//存放最大/最小值的数组
	var maxArr=[];
	var minArr=[];
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
			'officeId': _allOfficeId,
			'startTime':startsTimess,
			'endTime':endsTimess,
			'dateType':_ajaxDataType_1
		}
		$.ajax({
			type:'post',
			url:'http://211.100.28.180/BEEWebAPI/api/ecDatas/GetECByTypeAndOffice',
			data:ecParams,
			async:false,
			success:function(result){
				//console.log(result);
				_allData.push(result);
				//console.log(_allData);
			},
			error:function(){
				alert('未获取到数据')
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
			maxArr=[];
			minArr=[];
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
						maxArr.push(datas[j].data);
						minArr.push(datas[j].data);
					}
				}
				if(z === datas.length){
					object.data.push(0)
				}
			}
			dataY.push(object);
			//console.log(dataY)
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//console.log(maxArr_1);
			//console.log(minArr);
			//确定最大最小值出现的时间；
			for(var x=0;x<_allData.length;x++){
				var datas=_allData[x];
				for(var j=0;j<datas.length;j++){
					if(maxArr_1==datas[j].data){
						maxTime=datas[j].dataDate.split('T')[1].slice(0,5);
					}
					if(minArr_1==datas[j].data){
						minTime=datas[j].dataDate.split('T')[1].slice(0,5);
					}
				}
			}
			//console.log(maxTime);
			//console.log(minTime);
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//console.log(_totalY)
			//平均值
			average=_totalY/object.data.length;
			//console.log(average)
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=="周"){
		dataX=['周日','周一','周二','周三','周四','周五','周六'];
		//console.log(_allData);
		for(var i=0;i<_allData.length;i++){
			maxArr=[];
			minArr=[];
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<datas.length;z++){
				object.data.push(datas[z].data);
				maxArr.push(datas[z].data);
				minArr.push(datas[z].data);
			}
			if(dataX.length === datas.length){
				object.data.push(0);

			}
			dataY.push(object);
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//确定最大最小值出现的时间；
			for(var x=0;x<_allData.length;x++){
				var datas=_allData[x];
				for(var j=0;j<datas.length;j++){
					if(maxArr_1==datas[j].data){
						maxTime=datas[j].dataDate.split('T')[0];
					}
					if(minArr_1==datas[j].data){
						minTime=datas[j].dataDate.split('T')[0];
					}
				}
			}
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			//console.log(selectTime);
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
		//console.log(dataY)
	}else if(_ajaxDataType=="月"){
		//console.log(_allData)
		for(var i=0;i<_allData.length;i++){
			var datas=_allData[i];
			for(var j=0;j<datas.length;j++){
				//console.log(datas[j]);
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0])
				}
				//console.log(dataX);
			}
		}
		for(var i=0;i<_allData.length;i++){
			maxArr=[];
			minArr=[];
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[0] == dataX[z]){
						object.data.push(datas[j].data);
						maxArr.push(datas[j].data);
						minArr.push(datas[j].data);
					}
				}
				if(z === datas.length){
					object.data.push(0);
				}
			}
			dataY.push(object);
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//确定最大最小值出现的时间；
			for(var x=0;x<_allData.length;x++){
				var datas=_allData[x];
				for(var j=0;j<datas.length;j++){
					if(maxArr_1==datas[j].data){
						maxTime=datas[j].dataDate.split('T')[0];
					}
					if(minArr_1==datas[j].data){
						minTime=datas[j].dataDate.split('T')[0];
					}
				}
			}
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=="年"){
		//console.log(_allData)
		for(var i=0;i<_allData.length;i++){
			var datas = _allData[i];
			for(var j=0;j<datas.length;j++){
				//console.log(datas[j])
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0]);
				}
			}
			//console.log(dataX)
		}
		for(var i=0;i<_allData.length;i++){
			maxArr=[];
			minArr=[];
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[0] == dataX[z]){
						object.data.push(datas[j].data);
						maxArr.push(datas[j].data);
						minArr.push(datas[j].data);
					}
				}
				if(z === datas.length){
					object.data.push(0)
				}
			}
			dataY.push(object);
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//确定最大最小值出现的时间；
			for(var x=0;x<_allData.length;x++){
				var datas=_allData[x];
				for(var j=0;j<datas.length;j++){
					if(maxArr_1==datas[j].data){
						maxTime=datas[j].dataDate.split('T')[0];
					}
					if(minArr_1==datas[j].data){
						minTime=datas[j].dataDate.split('T')[0];
					}
				}
			}
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}
	getPointerName();
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
function getPointerName(){
	for(var i=1;i<$('.selectTime').length;i++){
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