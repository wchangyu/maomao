$(function(){
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
		$('.tree-1').eq($(this).index()-1).show();

	})
	_objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),true);
	_objectSel.initOffices($("#allOffices"));
	//初始化模糊查找框，参数(输入框，提示框，ztree对应ul的id)
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
	//能耗选择
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
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
	//开始时间
	startTime();
	//结束时间
	endTime();
	getPointerData();
	$('small').html(pointerNames);
	$('.header-one').html(_ajaxStartTime.split('/')[0] + '-' + _ajaxStartTime.split('/')[1] + '-' + _ajaxStartTime.split('/')[2]);
	$('.header-two').html('到');
	$('.header-three').html(_ajaxEndTime.split('/')[0] + '-' + _ajaxEndTime.split('/')[1] + '-' + _ajaxEndTime.split('/')[2]);
	$('.btns').click(function (){
		//能耗种类
		getEcType();
		//开始时间
		startTime();
		//结束时间
		endTime();
		$('.header-one').html(_ajaxStartTime);
		$('.header-two').html('到');
		$('.header-three').html(_ajaxEndTime);
		var o=$('.tree-3')[0].style.display;
		if(o == 'none'){
			getOfficeData();
			$('small').html(officeNames);
		}else{
			getPointerData();
			$('small').html(pointerNames);
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
//选取的能耗种类；
var _ajaxEcType;
function getEcType(){
	_ajaxEcType=$('.selectedEnergy').attr('value');
}
//获取开始结束时间
var _ajaxStartTime;
function startTime(){
	//存放拆分的数组；
	var startArr=[];
	var startTime = $('.drp-calendar-date').eq(0).html();
	startArr=startTime.split('/');
	//处理时间格式（月 日）
	switch (startArr[1]){
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			startArr[1] = '0'+startArr[1];
			break;
		default:
			break;
	}
	switch(startArr[0]){
		case '10':
		case '11':
		case '12':
			break;
		default:
			startArr[0] = '0'+startArr[0];
	}
	_ajaxStartTime=startArr[2]+'/'+startArr[0]+'/'+startArr[1];
	$('.header-three-1').eq(0).html(_ajaxStartTime);
}
//结束时间
var _ajaxEndTime;
function endTime(){
	//存放拆分的数组；

	var endArr=[];
	var endTime = $('.drp-calendar-date').eq(1).html();
	endArr=endTime.split('/');
	//处理时间格式（月 日）
	switch (endArr[1]){
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			endArr[1] = '0'+endArr[1];
			break;
		default:
			break;
	}
	switch(endArr[0]){
		case '10':
		case '11':
		case '12':
			break;
		default:
			endArr[0] = '0'+endArr[0];
	}
	_ajaxEndTime=endArr[2]+'/'+endArr[0]+'/'+endArr[1];
	$('.header-three-1').eq(2).html(_ajaxEndTime);
}
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
	var pts = _objectSel.getSelectedPointers(),pointerID;
	if(pts.length > 0){
		pointerID = pts[0].pointerID;
		pointerNames = pts[0].pointerName;
	}
	if(!pointerID) { return; }
	var energyItemIds=['01','40','02','41','42'];
	for(var i=0;i<energyItemIds.length;i++){
		resultArr=[];
		valueArr=[];
		nameArr=[];
		data=[];
		energyItemIdss=energyItemIds[i];
		var ecParams={
			'pointerID':pointerID,
			'energyItemIDs':energyItemIdss,
			'startTime':_ajaxStartTime,
			'endTime':_ajaxEndTime
		}
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getChildrenEnergyItemEcData',
			data:ecParams,
			async:false,
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
			//console.log(option36.series[0].data)
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
			"startTime": _ajaxStartTime,
			"endTime": _ajaxEndTime
		};
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getOfficeChildrenEnergyItemEcData',
			data:ecParams,
			async:false,
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
			//console.log(option36.series[0].data)
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