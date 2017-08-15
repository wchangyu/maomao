$(function(){
	//日期插件
	$('.datetimeStart').html(_ajaxStartTime);
	$('.datetimeEnd').html(_ajaxEndTime);
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
	_initDate();
	$('#datetimepicker').on('changeDate',function(e){
		dataType();
		_selectTime();
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
var _ajaxEndTime = moment().subtract(1,'d').format("YYYY-MM-DD");
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
	if(pts.length > 0){
		pointerID = pts[0].pointerID;
		pointerNames = pts[0].pointerName;
	}
	if(pointerID.length == 0) { return; }

	var postPointerID = [];

	$(pts).each(function(i,o){

		postPointerID.push(o.pointerID)
	});

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
				console.log(jqXHR.responseText);
				//if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
				//	myChart36.hideLoading();
				//	myChart37.hideLoading();
				//	myChart38.hideLoading();
				//	myChart39.hideLoading();
				//	myChart40.hideLoading();
				//}
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