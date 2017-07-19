$(function(){
	$('.datetimepickereType').html(_ajaxStartTime +'-'+_ajaxStartTime);
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
	_objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),true);
	_objectSel.initOffices($("#allOffices"));
	//楼宇搜索框功能
	var objSearchs = new ObjectSearch();
	objSearchs.initPointerSearch($("#keys"),$(".tipess"),"allPointer");
	//初始化模糊查找框，参数(输入框，提示框，ztree对应ul的id)
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
	//能耗选择
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	});
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
	//echarts
	myChart36 = echarts.init(document.getElementById('energy-parts-total'));
	option36 = {
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			x: 'left',
			data:[]
		},
		series: [
			{
				name:'',
				type:'pie',
				radius: ['50%', '70%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '30',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data:[],
				itemStyle: {
					normal: {
						color: function(params) {

							var colorList = [
								'#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
								'#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
								'#D7504B','#C6E579','#F4E001','red','#26C0C0'
							];
							return colorList[params.dataIndex]
						}
					}
				}
			}
		]
	};
	myChart37 = echarts.init(document.getElementById('energy-parts-one'));
	option37 = {
		tooltip : {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		series : [
			{
				name: '',
				type: 'pie',
				radius : '55%',
				center: ['50%', '50%'],
				data:[],
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					},
					normal: {
						color: function(params) {

							var colorList = [
								'#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
								'#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
								'#D7504B','#C6E579','#F4E001','red','#26C0C0'
							];
							return colorList[params.dataIndex]
						}
					}
				}
			}
		]
	};
	myChart38 = echarts.init(document.getElementById('energy-parts-two'));
	myChart39 = echarts.init(document.getElementById('energy-parts-three'));
	myChart40 = echarts.init(document.getElementById('energy-parts-four'));
	//初始能耗
	getEcType();
	getPointerData();
	//$('small').html(pointerNames);
	//页面加载时表头small内容
	var smalls = $('<small>');
	smalls.html(pointerNames);
	$('.page-title').append(smalls);
	$('.header-one').html(_ajaxStartTime);
	$('.header-two').html('到');
	$('.header-three').html(_ajaxStartTime);
	$('.btn').click(function (){
		myChart36 = echarts.init(document.getElementById('energy-parts-total'));
		myChart37 = echarts.init(document.getElementById('energy-parts-one'));
		myChart38 = echarts.init(document.getElementById('energy-parts-two'));
		myChart39 = echarts.init(document.getElementById('energy-parts-three'));
		myChart40 = echarts.init(document.getElementById('energy-parts-four'));
		//能耗种类
		getEcType();
		var starts = _ajaxStartTime_1.split('/');
		$('.header-one').html(starts[0] + '-' + starts[1] + '-' + starts[2]);
		$('.header-two').html('到');
		var ends = _ajaxEndTime_1.split('/');
		$('.header-three').html(ends[0] + '-' +ends[1] + '-' + ends[2]);
		var o=$('.tree-3')[0].style.display;
		if(o == 'none'){
			getOfficeData();
			if($('.page-title').children('small').length){
				$('.page-title').children('small').remove();
			}
			var smalls = $('<small>');
			smalls.html(officeNames);
			$('.page-title').append(smalls);
		}else{
			getPointerData();
			if($('.page-title').children('small').length){
				$('.page-title').children('small').remove();
			}
			var smalls = $('<small>');
			smalls.html(pointerNames);
			$('.page-title').append(smalls);
		}

	});
	$('body').mouseover(function(){
		if(myChart36 && myChart37 && myChart38 && myChart39 && myChart40){
			myChart36.resize();
			myChart37.resize();
			myChart38.resize();
			myChart39.resize();
			myChart40.resize();
		}
	})
})
var myChart36;
var myChart37;
var myChart38;
var myChart39;
var myChart40;
window.onresize = function () {
	if(myChart36 && myChart37 && myChart38 && myChart39 && myChart40){
		myChart36.resize();
		myChart37.resize();
		myChart38.resize();
		myChart39.resize();
		myChart40.resize();
	}
}
//获取dataType(小时，日，月，年)
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
//选取的能耗种类；
var _ajaxEcType;
function getEcType(){
	_ajaxEcType=$('.selectedEnergy').attr('value');
}
//设置开始和结束初始值
var _ajaxStartTime = moment().subtract(1,'d').format("YYYY-MM-DD");
var	_ajaxStartTime_1=moment().subtract(1,'d').format("YYYY/MM/DD");
var _ajaxEndTime_1=moment().format("YYYY/MM/DD");
//获取楼宇分项数据
var pointerNames;
function getPointerData(){
	//存放结果的数组
	var resultArr=[];
	//存放数值的数组
	var valueArr=[];
	//存放名称的数组
	var nameArr=[];
	var data=[];
	var pts = _objectSel.getSelectedPointers()
	var pointerID = [];

	//存放要传的楼宇集合
	var postPointerID = [];

	var treeObj = $.fn.zTree.getZTreeObj(_objectSel._$ulPointers.attr('id'));

	var nodes1 = treeObj.getCheckedNodes(false).concat(treeObj.getCheckedNodes(true));

	if(pts.length > 0){
		pointerID = pts[0].pointerID;
		pointerNames = pts[0].pointerName;
	}
	if(pointerID.length == 0) { return; }

	if(pointerID[0] == 0){

		$(nodes1).each(function(i,o){

			postPointerID.push(o.pointerID);
		})

		postPointerID.pop();
	}else{
		postPointerID = pointerID;
	}

	var energyItemIds=['01','40','02','41','42'];
	var waterArr =['211'];
	for(var i=0;i<energyItemIds.length;i++){
		resultArr=[];
		valueArr=[];
		nameArr=[];
		data=[];
		energyItemIdss=energyItemIds[i];
		var ecParams={
			'pointerIDs':postPointerID,
			'energyItemIDs':energyItemIdss,
			'startTime':_ajaxStartTime_1,
			'endTime':_ajaxEndTime_1
		}
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getChildrenEnergyItemEcData',
			data:ecParams,
			async:false,
			beforeSend:function(){
				myChart36.showLoading({
					text:'获取数据中',
					effect:'whirling'
				});
				myChart37.showLoading({
					text:'获取数据中',
					effect:'whirling'
				});
				myChart38.showLoading({
					text:'获取数据中',
					effect:'whirling'
				});
				myChart39.showLoading({
					text:'获取数据中',
					effect:'whirling'
				});
				myChart40.showLoading({
					text:'获取数据中',
					effect:'whirling'
				})
			},
			success:function(result){
				for(var j=0;j<result.length;j++){
					resultArr.push(result[j]);
					for(var r=0;r<resultArr.length;r++){
						if(valueArr.indexOf(resultArr[r].ecData)<0){
							valueArr.push(resultArr[r].ecData);
						}
						if(nameArr.indexOf(resultArr[r].energyItemName)<0){
							nameArr.push(resultArr[r].energyItemName);
						}

					}
				}
				myChart36.hideLoading();
				myChart37.hideLoading();
				myChart38.hideLoading();
				myChart39.hideLoading();
				myChart40.hideLoading();
			},
			error:function(jqXHR, textStatus, errorThrown){
				console.log(JSON.parse(jqXHR.responseText).message);
				if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
					myChart36.hideLoading();
					myChart37.hideLoading();
					myChart38.hideLoading();
					myChart39.hideLoading();
					myChart40.hideLoading();
				}
			}
		})
		for(z=0;z<nameArr.length;z++){
			var obj={};
			obj.value=valueArr[z];
			obj.name=nameArr[z];
			data.push(obj)
		}
		if(energyItemIdss == '01'){
			//饼状图-center-电
			option36.legend.data = nameArr;
			option36.series[0].data = data;
			myChart36.setOption(option36);
		}else if(energyItemIdss == '40'){
			//饼状图-top-left-电
			option37.series[0].data = data;
			myChart37.setOption(option37);
		}else if(energyItemIdss == '02'){
			//饼状图-top-left-电
			option37.series[0].data = data;
			myChart38.setOption(option37);
		}else if(energyItemIdss == '41'){
			//饼状图-top-left-电
			option37.series[0].data = data;
			myChart39.setOption(option37);
		}else if(energyItemIdss == '42'){
			//饼状图-top-left-电
			option37.series[0].data = data;
			myChart40.setOption(option37);
		}
	}
}
//获取科室分项数据
var officeNames;
function getOfficeData(){
	//存放结果的数组
	var resultArr=[];
	//存放数值的数组
	var valueArr=[];
	//存放名称的数组
	var nameArr=[];
	var data=[];
	var ofs = _objectSel.getSelectedOffices(),officeID;
	if(ofs.length>0) {
		officeID = ofs[0].f_OfficeID;
		officeNames = ofs[0].f_OfficeName;
	};
	if(!officeID){ return; }
	var energyItemIds=['01','40','02','41','42'];
	for(var i=0;i<energyItemIds.length;i++){
		resultArr=[];
		valueArr=[];
		nameArr=[];
		data=[];
		energyItemIdss=energyItemIds[i];
		var ecParams = {
			"officeID": officeID,
			"energyItemIDs": energyItemIdss,
			"startTime": _ajaxStartTime_1,
			"endTime": _ajaxEndTime_1
		};
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getOfficeChildrenEnergyItemEcData',
			data:ecParams,
			async:false,
			beforeSend:function(){
				myChart36.showLoading({
					text:'获取数据中',
					effect:'whirling'
				});
				myChart37.showLoading({
					text:'获取数据中',
					effect:'whirling'
				});
				myChart38.showLoading({
					text:'获取数据中',
					effect:'whirling'
				});
				myChart39.showLoading({
					text:'获取数据中',
					effect:'whirling'
				});
				myChart40.showLoading({
					text:'获取数据中',
					effect:'whirling'
				})
			},
			success:function(result){
				for(var j=0;j<result.length;j++){
					resultArr.push(result[j]);
					for(var r=0;r<resultArr.length;r++){
						if(valueArr.indexOf(resultArr[r].ecData)<0){
							valueArr.push(resultArr[r].ecData);
						}
						if(nameArr.indexOf(resultArr[r].energyItemName)<0){
							nameArr.push(resultArr[r].energyItemName);
						}

					}
				}
				myChart36.hideLoading();
				myChart37.hideLoading();
				myChart38.hideLoading();
				myChart39.hideLoading();
				myChart40.hideLoading();
			},
			error:function(jqXHR, textStatus, errorThrown){
				console.log(JSON.parse(jqXHR.responseText).message);
				if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
					myChart36.hideLoading();
					myChart37.hideLoading();
					myChart38.hideLoading();
					myChart39.hideLoading();
					myChart40.hideLoading();
				}
			}
		})
		for(z=0;z<nameArr.length;z++){
			var obj={};
			obj.value=valueArr[z];
			obj.name=nameArr[z];
			data.push(obj)
		}

		if(energyItemIdss == '01'){
			//饼状图-center-电
			option36.legend.data = nameArr;
			option36.series[0].data = data;
			myChart36.setOption(option36);
		}else if(energyItemIdss == '40'){
			//饼状图-top-left-电
			option37.series[0].data = data;
			myChart37.setOption(option37);
		}else if(energyItemIdss == '02'){
			//饼状图-top-left-电
			option37.series[0].data = data;
			myChart38.setOption(option37);
		}else if(energyItemIdss == '41'){
			//饼状图-top-left-电
			option37.series[0].data = data;
			myChart39.setOption(option37);
		}else if(energyItemIdss == '42'){
			//饼状图-top-left-电
			option37.series[0].data = data;
			myChart40.setOption(option37);
		}
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