$(function(){
	$('.datetimepickereType').html(currentDates);
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
	_objectSel.initPointers($("#allPointer"),true);
	_objectSel.initOffices($("#allOffices"));
	//搜索框功能
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
	//时间选择
	$('#datetimepicker').datepicker(
		{
			language:  'zh-CN',
			todayBtn: 1,
			todayHighlight: 1,
			format: 'yyyy-mm-dd'
		}
	).on('changeDate',function(e){
		inputValue = $('#datetimepicker').val();
		var now = moment(inputValue).startOf('day');
		var startDay = now.format("YYYY-MM-DD");
		var startSplit = startDay.split('-');
		currentDate = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
		$('.datetimepickereType').html(startDay)
	});
	//echarts
	myChart46 = echarts.init(document.getElementById('rheader-content-46'));
	option46 = {
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
				type : 'category',
				data : []
			}
		],
		yAxis : [
			{
				type : 'value'
			}
		],
		series : [
			{
				name:'用电量',
				type:'bar',
				data:[],
				barMaxWidth: '60',
				itemStyle: {
					normal: {

						color:'#ed7f7e'
					},
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			},
			{
				name:'用电趋势',
				type:'line',
				data:[]
			}
		]
	};
	myChart45 = echarts.init(document.getElementById('rheader-content-45'));
	getEcType();
	getEcTypeWord();
	getPointerDatas();
	setEnergyInfos();
	$('.btn').click(function(){
		getEcType();
		getEcTypeWord();
		setEnergyInfos();
		var o=$('.tree-3')[0].style.display;
		if(o == "none"){
			getOfficeDatas();
			//$('small').html(officeNames);
		}else{
			getPointerDatas();
			$('small').html(pointerNames);
		}
	});
	//逐月逐周选择
	$('.top-header-lists').click(function(){
		myChart46 = echarts.init(document.getElementById('rheader-content-46'));
		myChart45 = echarts.init(document.getElementById('rheader-content-45'));
		$('.top-header-lists').removeClass('top-header-listss');
		$(this).addClass('top-header-listss');
		$(".rheader-contents").css({
			'z-index':5,
			'opacity':1
		})
		$(".rheader-contents").eq($(this).index()).css({
			'z-index':2,
			'opacity':0
		})
	});
	$('body').mouseover(function(){
		if(myChart45 && myChart46){
			myChart45.resize();
			myChart46.resize();
		}
	})
})
var myChart45;
var myChart46;
window.onresize = function () {
	if(myChart45 && myChart46){
		myChart45.resize();
		myChart46.resize();
	}
}
//时间（当前时间12个月）
var currentDate = moment().format('YYYY/MM/DD');
var currentDates = moment().format('YYYY-MM-DD');
//根据当前选择的能耗类型设置页面信息
function setEnergyInfos(){
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		console.log(_ajaxEcType)
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
	//console.log(jsonText.alltypes);
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
//楼宇数据
function getPointerDatas(){
	var dataMothData = [];
	var dataWeekData = [];
	var dataMonthX = [];
	var dataWeekX = [];
	var dataMonthY = [];
	var dataWeekY = [];
	var pts = _objectSel.getSelectedPointers();
	if(pts.length>0) {
		pointerID = pts[0].pointerID;
		pointerNames = pts[0].pointerName
	};
	if(!pointerID) { return; }
	var ecParams = {
		ecTypeId : _ajaxEcType,
		pointerId : pointerID,
		startTime: currentDate
	}
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'EcDatas/GetEnergyTrendencyData',
		data:ecParams,
		async:false,
		success:function(result){
			dataMothData.push(result.monthDatas);
			dataWeekData.push(result.weekDatas);
		}
	})
	for(var i=0;i<dataMothData.length;i++){
		var datas = dataMothData[i];
		for(var j=0;j<datas.length;j++){
			dataMonthX.push(datas[j].dataRange);
			dataMonthY.push(datas[j].data);
		}
	}
	for(var i=0;i<dataWeekData.length;i++){
		var datas = dataWeekData[i];
		for(var j=0;j<datas.length;j++){
			dataWeekX.push(datas[j].dataRange);
			dataWeekY.push(datas[j].data);
		}
	}
	option46.xAxis.data = dataMonthX;
	option46.series[0].data = dataMonthY;
	option46.series[1].data = dataMonthY;
	myChart46.setOption(option46);
	option46.xAxis.data = dataWeekX;
	option46.series[0].data = dataWeekY;
	option46.series[1].data = dataWeekY;
	myChart45.setOption(option46);
}
//科室数据
function getOfficeDatas(){
	var ofs = _objectSel.getSelectedOffices();
	if(ofs.length>0) {
		officeID = ofs[0].f_OfficeID;
		officeNames = ofs[0].f_OfficeName;
	};
	if(!officeID){ return; }
	var ecParams = {
		ecTypeId : _ajaxEcTypeWord,
		pointerId : officeID,
		startTime: currentDate
	}
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
		data:ecParams,
		async:false,
		success:function(result){
			console.log(result)
		}
	})
}