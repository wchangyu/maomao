$(function(){
	$('.datetimepickereType').html(_ajaxStartTime +'-'+_ajaxStartTime);
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
	});
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
	});
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
			_ajaxStartTime_1 = startDay.split('-')[0]+'/'+startDay.split('-')[1]+'/'+startDay.split('-')[2];
			_ajaxEndTime_1 = endDay.split('-')[0]+'/'+endDay.split('-')[1]+'/'+endDay.split('-')[2];
			$('.header-three-1').eq(0).html(startDay);
		}else if(_ajaxDataType=="周"){
			inputValue = $('#datetimepicker').val();
			var now = moment(inputValue).startOf('week');
			var startWeek=now.format("YYYY-MM-DD");
			startWeek = now.add(1,'d').format("YYYY-MM-DD");
			var endWeek = now.add(7,'d').format("YYYY-MM-DD");
			end =startWeek + "-" +endWeek;
			_ajaxDataType_1='日';
			var startsWeek = now.subtract(14,'d').format("YYYY-MM-DD");
			var endsWeek = now.add(7,'d').format("YYYY-MM-DD");
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startWeek;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			_ajaxStartTime_1 = startWeek.split('-')[0]+'/'+startWeek.split('-')[1]+'/'+startWeek.split('-')[2];
			_ajaxEndTime_1 = endWeek.split('-')[0]+'/'+endWeek.split('-')[1]+'/'+endWeek.split('-')[2];
		}else if(_ajaxDataType=="月"){
			var startMonth=moment(inputValue).startOf('month').format("YYYY-MM-DD");
			var endMonth=moment(inputValue).endOf('month').format("YYYY-MM-DD");
			end =startMonth+"-"+endMonth;
			var startsMonth = moment(inputValue).subtract(1,'month').startOf('month').format("YYYY-MM-DD");
			var endsMonth = moment(inputValue).subtract(1,'month').endOf('month').format("YYYY-MM-DD");
			_ajaxDataType_1='日';
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startMonth;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			_ajaxStartTime_1 = startMonth.split('-')[0]+'/'+startMonth.split('-')[1]+'/'+startMonth.split('-')[2];
			_ajaxEndTime_1 = endMonth.split('-')[0]+'/'+endMonth.split('-')[1]+'/'+endMonth.split('-')[2];
		}else if(_ajaxDataType=="年"){
			var startYear=moment(inputValue).startOf('year').format("YYYY-MM-DD");
			var endYear=moment(inputValue).endOf('year').format("YYYY-MM-DD");
			end = startYear+"-"+endYear;
			var startsYear = moment(inputValue).subtract(1,'year').startOf('year').format("YYYY-MM-DD");
			var endsYear = moment(inputValue).subtract(1,'year').endOf('year').format("YYYY-MM-DD");
			console.log(startYear.split('-'))
			_ajaxDataType_1='月'
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startYear;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			_ajaxStartTime_1 = startYear.split('-')[0]+'/'+startYear.split('-')[1]+'/'+startYear.split('-')[2];
			_ajaxEndTime_1 = endYear.split('-')[0]+'/'+endYear.split('-')[1]+'/'+endYear.split('-')[2];
			_ajaxLastStartTime_1 = startsYear.split('-')[0]+'/'+startsYear.split('-')[1]+'/'+startsYear.split('-')[2];
			_ajaxLastEndTime_1 = endsYear.split('-')[0]+'/'+endsYear.split('-')[1]+'/'+endsYear.split('-')[2];
		}
	})
	$('.types').change(function(){
		$('.datetimepickereType').empty();
	})
	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	})
	//获取能耗种类；
	getEcType();
	//获取时间段
	dataType();
	getPointerData();
	$('.btns').click(function(){
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
	})
})
var myChart11;
//让echarts自适应
window.onresize = function () {
	myChart11.resize();
}
//确定能耗种类
var _ajaxEcType;
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
		pointerIds = pointerID[i];
		console.log(pointerIds)
		var ecParams={
			'ecTypeId':_ajaxEcType,
			'pointerId': pointerIds,
			'startTime':_ajaxStartTime_1,
			'endTime':_ajaxEndTime_1,
			'dateType':_ajaxDataType_1
		};
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
			data:ecParams,
			async:false,
			success:function(result){
				allBranch.push(result);
			}
		})
	}
		if(_ajaxDataType=='日'){
			//x轴数据
			for(var i=0;i<allBranch.length;i++){
				var datas=allBranch[i];
				for(var j=0;j<datas.length;j++){
					if(dataX.indexOf(datas[j].dataDate.split('T')[1].slice(0,5))<0){
						dataX.push(datas[j].dataDate.split('T')[1].slice(0,5));
					}
				}
			}
			dataX.sort();
			//console.log(dataX)
			//遍历y轴数据
			for(var i=0;i<allBranch.length;i++){
				var object={};
				object.name=pointerNames[i];
				object.type='line';
				object.data=[];
				var datas=allBranch[i];
				for(var z=0;z<dataX.length;z++){
					for(var j=0;j<datas.length;j++){
						if(datas[j].dataDate.split('T')[1].slice(0,5)==dataX[z]){
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
				$('#tbody').append('<tr><td>'+pointerNames[i]+'</td><td>'+unitConversion(_totalY)
					+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
					+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
					+'</td><td>'+unitConversion(average)+'</td></tr>')
			}
		}else if(_ajaxDataType=='周'){
			var dataX=['周一','周二','周三','周四','周五','周六','周日'];
			//x轴数据
			for(var i=0;i<allBranch.length;i++){
				var datas=allBranch[i];
				for(var j=0;j<datas.length;j++){
					if(dataXx.indexOf(datas[j].dataDate.split('T')[0])<0){
						dataXx.push(datas[j].dataDate.split('T')[0]);
					}
				}
			}
			dataXx.sort();

			//遍历y轴数据
			for(var i=0;i<allBranch.length;i++){
				var object={};
				object.name=pointerNames[i];
				object.type='line';
				object.data=[];
				var datas=allBranch[i];
				for(var z=0;z<dataXx.length;z++){
					for(var j=0;j<datas.length;j++){
						if(datas[j].dataDate.split('T')[0]==dataXx[z]){
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
				$('#tbody').append('<tr><td>'+pointerNames[i]+'</td><td>'+unitConversion(_totalY)
					+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
					+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
					+'</td><td>'+unitConversion(average)+'</td></tr>')
			}
		}else if(_ajaxDataType=='月'){
			//x轴数据
			for(var i=0;i<allBranch.length;i++){
				var datas=allBranch[i];
				for(var j=0;j<datas.length;j++){
					//console.log(datas[j])
					if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
						dataX.push(datas[j].dataDate.split('T')[0]);
					}
				}
			}
			dataX.sort();

			//遍历y轴数据
			for(var i=0;i<allBranch.length;i++){
				var object={};
				object.name=pointerNames[i];
				object.type='line';
				object.data=[];
				var datas=allBranch[i];
				for(var z=0;z<dataX.length;z++){
					for(var j=0;j<datas.length;j++){
						if(datas[j].dataDate.split('T')[0]==dataX[z]){
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
				$('#tbody').append('<tr><td>'+pointerNames[i]+'</td><td>'+unitConversion(_totalY)
					+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
					+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
					+'</td><td>'+unitConversion(average)+'</td></tr>')
			}
		}else if(_ajaxDataType=='年'){
			//x轴数据
			for(var i=0;i<allBranch.length;i++){
				var datas=allBranch[i];
				for(var j=0;j<datas.length;j++){
					//console.log(datas[j])
					if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
						dataX.push(datas[j].dataDate.split('T')[0]);
					}
				}
			}
			dataX.sort();
			//遍历y轴数据
			for(var i=0;i<allBranch.length;i++){
				var object={};
				object.name=pointerNames[i];
				object.type='line';
				object.data=[];
				var datas=allBranch[i];
				for(var z=0;z<dataX.length;z++){
					for(var j=0;j<datas.length;j++){
						if(datas[j].dataDate.split('T')[0]==dataX[z]){
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
				$('#tbody').append('<tr><td>'+pointerNames[i]+'</td><td>'+unitConversion(_totalY)
					+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
					+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
					+'</td><td>'+unitConversion(average)+'</td></tr>')
			}
		}
		myChart11 = echarts.init(document.getElementById('rheader-content-14'));
		option11 = {
			tooltip: {
				trigger: 'axis'
			},
			legend:{
				data:pointerNames
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
			async:false,
			success:function(result){
				allBranch.push(result);
			}
		})
	}
	if(_ajaxDataType=='日'){
		//x轴数据
		for(var i=0;i<allBranch.length;i++){
			var datas=allBranch[i];
			for(var j=0;j<datas.length;j++){
				if(dataX.indexOf(datas[j].dataDate.split('T')[1].slice(0,5))<0){
					dataX.push(datas[j].dataDate.split('T')[1].slice(0,5));
				}
			}
		}
		dataX.sort();
		//console.log(dataX)
		//遍历y轴数据
		for(var i=0;i<allBranch.length;i++){
			var object={};
			object.name=officeNames[i];
			object.type='line';
			object.data=[];
			var datas=allBranch[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[1].slice(0,5)==dataX[z]){
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
			$('#tbody').append('<tr><td>'+officeNames[i]+'</td><td>'+unitConversion(_totalY)
				+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
				+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
				+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=='周'){
		var dataX=['周一','周二','周三','周四','周五','周六','周日'];
		//x轴数据
		for(var i=0;i<allBranch.length;i++){
			var datas=allBranch[i];
			for(var j=0;j<datas.length;j++){
				if(dataXx.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataXx.push(datas[j].dataDate.split('T')[0]);
				}
			}
		}
		dataXx.sort();

		//遍历y轴数据
		for(var i=0;i<allBranch.length;i++){
			var object={};
			object.name=officeNames[i];
			object.type='line';
			object.data=[];
			var datas=allBranch[i];
			for(var z=0;z<dataXx.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[0]==dataXx[z]){
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
			$('#tbody').append('<tr><td>'+officeNames[i]+'</td><td>'+unitConversion(_totalY)
				+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
				+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
				+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=='月'){
		//x轴数据
		for(var i=0;i<allBranch.length;i++){
			var datas=allBranch[i];
			for(var j=0;j<datas.length;j++){
				//console.log(datas[j])
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0]);
				}
			}
		}
		dataX.sort();

		//遍历y轴数据
		for(var i=0;i<allBranch.length;i++){
			var object={};
			object.name=pointerNames[i];
			object.type='line';
			object.data=[];
			var datas=allBranch[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[0]==dataX[z]){
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
			$('#tbody').append('<tr><td>'+officeNames[i]+'</td><td>'+unitConversion(_totalY)
				+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
				+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
				+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=='年'){
		//x轴数据
		for(var i=0;i<allBranch.length;i++){
			var datas=allBranch[i];
			for(var j=0;j<datas.length;j++){
				//console.log(datas[j])
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0]);
				}
			}
		}
		dataX.sort();
		//遍历y轴数据
		for(var i=0;i<allBranch.length;i++){
			var object={};
			object.name=officeNames[i];
			object.type='line';
			object.data=[];
			var datas=allBranch[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[0]==dataX[z]){
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
			$('#tbody').append('<tr><td>'+officeNames[i]+'</td><td>'+unitConversion(_totalY)
				+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
				+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
				+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		tooltip: {
			trigger: 'axis'
		},
		legend:{
			data:officeNames
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