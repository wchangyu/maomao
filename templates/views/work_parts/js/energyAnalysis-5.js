$(function(){
	//楼宇
	getSessionStoragePointer();
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
		getEcType();
	});
	//分项zTree
	var EnItdata=JSON.parse(sessionStorage.getItem('energyItems'));
	var treeObj;
	var setting = {
		check: {
			enable: true,
			chkStyle: "radio",
			radioType: "all"
		},
		data: {
			key: {
				title: "title"
			},
			simpleData: {
				enable: true
			}
		},
		view: {
			showIcon: false
		},
		callback: {
			onClick:function (event,treeId,treeNode){
				treeObj.checkNode(treeNode,!treeNode.checked,true)
			}
		}
	};
	var zNodes = new Array();
	for (var i =0; i<EnItdata.length; i++) {
		if (i==0) {
			var isChecked = true;
		}else{
			var isChecked = false;
		}
		if(EnItdata[i].f_EnergyItemID < 100){
			zNodes.push({ id:EnItdata[i].f_EnergyItemID, pId:EnItdata[i].f_ParentItemID, name:EnItdata[i].f_EnergyItemName,open:true,checked:isChecked});
		}
	}
	var treeObj = $.fn.zTree.init($("#energyConsumption"), setting, zNodes);
	treeObject();
	//搜索框
	var key;
	key = $("#key");
	key.bind("focus",focusKey)
		.bind("blur", blurKey)
		.bind("propertychange", searchNode)
		.bind("input", searchNode);
	//日历插件
	$('.datetimepickereType').html(_ajaxStartTime +'-'+_ajaxEndTime);
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
		if(_ajaxDataType=="周"){
			inputValue = $('#datetimepicker').val();
			var now = moment(inputValue).startOf('week');
			startWeek = now.add(1,'d').format("YYYY-MM-DD");
			var endWeek = now.add(7,'d').format("YYYY-MM-DD");
			end =startWeek + "-" +endWeek;
			_ajaxDataType_1='日';
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startWeek;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			var startstime = startWeek.split('-');
			var endstime = endWeek.split('-');
			_ajaxStartTime_1 = startstime[0] + '/' + startstime[1] + '/' +startstime[2];
			_ajaxEndTime_1 = endstime[0] + '/' + endstime[1] + '/' + endstime[2]
		}else if(_ajaxDataType=="月"){
			var startMonth=moment(inputValue).startOf('month').format("YYYY-MM-DD");
			var endMonth=moment(inputValue).endOf('month').add(1,'d').format("YYYY-MM-DD");
			end =startMonth+"-"+endMonth;
			_ajaxDataType_1='日';
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startMonth;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			var startstime = startMonth.split('-');
			var endsTime = endMonth.split('-');
			_ajaxStartTime_1 = startstime[0] + '/' +startstime[1] + '/' + startstime[2];
			_ajaxEndTime_1 = endsTime[0] + '/' + endsTime[1] + '/' + endsTime[2];
		}else if(_ajaxDataType=="年"){
			var startYear=moment(inputValue).startOf('year').format("YYYY-MM-DD");
			var endYear=moment(inputValue).endOf('year').add(1,'d').format("YYYY-MM-DD");
			end = startYear+"-"+endYear;
			_ajaxDataType_1='月'
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startYear;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			var startstime = startYear.split('-');
			var endstime = endYear.split('-');
			_ajaxStartTime_1 = startstime[0] + '/' + startstime[1] + '/' + startstime[2];
			_ajaxEndTime_1 = endstime[0] + '/' + endstime[1] + '/' + endstime[2];
		}
	});
	//监测每次的select值，将选项清零
	$('.types').change(function(){
		$('.datetimepickereType').empty();
	})
	getEcType();
	getPointerId();
	treeObject();
	specificTime();
	getItemizedData();
	$('.btns').click(function(){
		getEcType();
		getPointerId();
		treeObject();
		specificTime();
		getItemizedData();
		setEnergyInfos();
	})
})
var myChart41;
var myChart42;
window.onresize = function () {
    myChart41.resize(); 
    myChart42.resize();
}
//根据当前选择的能耗类型设置页面信息
function setEnergyInfos(){
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		//console.log(jsonText.alltypes[i])
		if(jsonText.alltypes[i].etid == _ajaxEcType){
			$('.header-one').html(jsonText.alltypes[i].etname);
			$('.right-header span').html('用' + jsonText.alltypes[i].etname + '分布');
			$('.header-right-lists').html('单位：' + jsonText.alltypes[i].etunit);
		}
	}
}
//选取的能耗种类；
var _ajaxEcType;
function getEcType(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	//console.log(jsonText.alltypes);
	for(var i=0;i<jsonText.alltypes.length;i++){
		aaa.push(jsonText.alltypes[i].etid)
	}
	_ajaxEcType = aaa[$('.selectedEnergy').index()];
}
//首先将sessionStorage的内容写入html中
function getSessionStoragePointer(){
	var jsonText1=sessionStorage.getItem('pointers');
	var htmlTxet1 = JSON.parse(jsonText1);
	var _allSter1 ='<option value="'+htmlTxet1[0].pointerID+'">'+htmlTxet1[0].pointerName+'</option>';
	for(var i=1;i<htmlTxet1.length;i++){
		_allSter1 +='<option value="'+htmlTxet1[i].pointerID+'">'+htmlTxet1[i].pointerName+'</option>';
	}
	$('#selectPointer').append(_allSter1);
}
//搜索框功能
function focusKey(e) {
	if ($('#key').hasClass("empty")) {
		$('#key').removeClass("empty");
	}
}
function blurKey(e) {
	//内容置为空，并且加empty类
	if ($('#key').get(0).value === "") {
		$('#key').addClass("empty");
	}
}
var lastValue='',nodeList=[],fontCss={};
function searchNode(e) {
	var zTree = $.fn.zTree.getZTreeObj("energyConsumption");
	//去掉input中的空格（首尾）
	var value = $.trim($('#key').get(0).value);
	keyType = "name";
	if (lastValue === value)
		return;
	lastValue = value;
	if (value === "") {
		$('.tipes').hide();
		//将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。
		//获取 zTree 的全部节点数据
		//如果input是空的则显示全部；
		zTree.showNodes(zTree.transformToArray(zTree.getNodes())) ;
		return;
	}
	//getNodesByParamFuzzy:根据节点数据的属性搜索，获取条件模糊匹配
	// 的节点数据 JSON 对象集合
	nodeList = zTree.getNodesByParamFuzzy(keyType,value);
	nodeList = zTree.transformToArray(nodeList);
	if(nodeList==''){
		$('.tipes').show();
		$('.tipes').html('抱歉，没有您想要的结果')
	}else{
		$('.tipes').hide();
	}
	updateNodes(true);

}
//选中之后更新节点
function updateNodes(highlight) {
	var zTree = $.fn.zTree.getZTreeObj("energyConsumption");
	var allNode = zTree.transformToArray(zTree.getNodes());
	//指定被隐藏的节点 JSON 数据集合
	zTree.hideNodes(allNode);
	//遍历nodeList第n个nodeList
	for(var n in nodeList){
		findParent(zTree,nodeList[n]);
	}
	zTree.showNodes(nodeList);
}
//确定父子关系
function findParent(zTree,node){
	//展开 / 折叠 指定的节点
	zTree.expandNode(node,true,false,false);
	//pNode父节点
	var pNode = node.getParentNode();
	if(pNode != null){
		nodeList.push(pNode);
		findParent(zTree,pNode);
	}
}
function filter(node) {
	return !node.isParent && node.isFirstNode;
}
//获取dataType(小时，日，月，年)
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
//设置开始和结束初始值
var _ajaxStartTime = moment().subtract(7,'d').startOf('week').add(1,'day').format("YYYY-MM-DD");
var _ajaxEndTime = moment().subtract(7,'d').endOf('week').add(2,'day').format("YYYY-MM-DD");
var	_ajaxStartTime_1=moment().subtract(7,'d').startOf('week').add(1,'day').format("YYYY/MM/DD");
var _ajaxEndTime_1=moment().subtract(7,'d').endOf('week').add(2,'day').format("YYYY/MM/DD");
var _ajaxDataType_1='日';
//获得数据的时候 能耗选择的id(_ajaxEcType) 楼宇id(_ajaxPointerId) 开始时间(_ajaxStartTime_1) 结束时间(_ajaxEndTime_1) 时间颗粒度(_ajaxDataType_1)
//选择的楼宇
var  sessionPointer=JSON.parse(sessionStorage.getItem('pointers'));
var _ajaxPointerId=sessionPointer[0].pointerID;
var _ajaxgetPointerName=sessionPointer[0].pointerName;
function getPointerId(){
	_ajaxPointerId=$('#selectPointer').find('option:selected').val();
	_ajaxgetPointerName=$('#selectPointer').find('option:selected').text();
}
//选中的分项的id
var select_ID=[];
var select_Name=[];
function treeObject(){
	var treeObject=$.fn.zTree.getZTreeObj('energyConsumption');
	var nodes = treeObject.getCheckedNodes(true);
	for(var i=0;i<nodes.length;i++){
		select_ID=nodes[i].id;
		select_Name=nodes[i].name;
	}
}
//获取时间点
var _ajaxStartSpecificTime;
var _ajaxEndSpecificTime;
function specificTime(){
	var hour = $('#hour').find('option:selected').val();
	var minutes = $('#minutes').find('option:selected').val();
	_ajaxStartSpecificTime = hour + ':' + minutes;
	var hours = $('#hours').find('option:selected').val();
	var minutess = $('#minutess').find('option:selected').val();
	_ajaxEndSpecificTime = hours + ':' + minutess;
}
//获得分项数据
function getItemizedData(){
	var _allData = [];
	var dataX = [];
	var dataYworkTimeData = [];
	var dataYrestTimeData = [];
	var workDayWorkTime = [];
	var workDayRestTime = [];
	var restDayWorkTime = [];
	var restDayRestTime = [];
	//累加用电
	//工作日工作时间
	var workDayWorks = 0;
	//工作日休息时间
	var workDayRests = 0;
	//休息日工作时间
	var restDayWorks = 0;
	//休息日休息时间
	var restDayRests = 0;
	//工作日比例
	var workProportion = 0;
	//休息日比例
	var restProportion = 0;
	var obj={
		//'ecTypeId':select_ID,
		'pointerId':_ajaxPointerId,
		'startTime':_ajaxStartTime_1,
		'endTime':_ajaxEndTime_1,
		'energyItemType':_ajaxEcType,
		'wsTime':_ajaxStartSpecificTime,
		'weTime':_ajaxEndSpecificTime
	};
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'EcDatas/GetWRData',
		data:obj,
		async:false,
		success:function(result){
			_allData.push(result);
		},
		error:function(xhr,res,err){
			console.log("GetECByTypeAndPointer:" + err);
		}
	})
	//确定xy轴
	for(var i=0;i<_allData.length;i++){
		var datas = _allData[i];
		for(var j=0;j<datas.length;j++){
			dataX.push(datas[j].dataDate.split('T')[0]);
			dataYworkTimeData.push(datas[j].workTimeData.toFixed(2));
			dataYrestTimeData.push(datas[j].restTimeData.toFixed(2));
		}
	}
	var totalWorkTimeData = 0;
	for(var i=0;i<dataYworkTimeData.length;i++){
		totalWorkTimeData += parseInt(dataYworkTimeData[i]);
	}
	var totalYrestTimeData = 0;
	for(var i=0;i<dataYrestTimeData.length;i++){
		totalYrestTimeData += parseInt(dataYrestTimeData[i]);
	}
	//将工作日和休息日分开
	console.log(_allData);
	for(var i=0;i<_allData.length;i++){
		var datas = _allData[i];
		for(var j=0;j<datas.length;j++){
			var momentsTime = datas[j].dataDate.split('T')[0];
			console.log(momentsTime)
			var momentWorkTime = datas[j].workTimeData;
			var momentRestTime = datas[j].restTimeData;
			var moments = moment(momentsTime).format('d')
			if(moments == 6 || moments == 0){
				//休息日
				//休息日夜间耗电
				restDayRestTime.push(momentRestTime);
				//休息日白天耗电
				restDayWorkTime.push(momentWorkTime);
			}else{
				//工作日
				//工作日白天用电
				workDayWorkTime.push(momentWorkTime);
				//工作日夜间用电
				workDayRestTime.push(momentRestTime);
			}
		}
	}
	for(var i=0;i<restDayRestTime.length;i++){
		restDayRests += parseInt(restDayRestTime[i]);
	}
	//休息日工作总量
	for(var i=0;i<restDayWorkTime.length;i++){
		restDayWorks += parseInt(restDayWorkTime[i]);
	}
	//工作日休息总量
	for(var i=0;i<workDayRestTime.length;i++){
		workDayRests += parseInt(workDayRestTime[i]);
	}
	//工作日工作总量
	for(var i=0;i<workDayWorkTime.length;i++){
		workDayWorks += parseInt(workDayWorkTime[i]);
	}
	//工作日比例
	workProportion = (workDayRests/workDayWorks).toFixed(2);
	//休息日比例
	restProportion = (restDayRests/restDayWorks).toFixed(2);
	$('.proportion1').html('=' + workProportion);
	$('.proportion2').html('=' + restProportion);
	//用电分布
	myChart41 = echarts.init(document.getElementById('rheader-content-41'));
	option41 = {
		tooltip : {
			trigger: 'axis',
			axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function (params) {
				var tar = params[1];
				return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
			}
		},
		toolbox: {
			show : true,
			feature : {
				mark : {show: true},
				dataView : {show: true, readOnly: false},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type : 'category',
			splitLine: {show:false},
			data : dataX
		},
		yAxis: {
			type : 'value'
		},
		series: [
			{
				name: '空闲',
				type: 'bar',
				stack:  '总量',
				itemStyle: {
					normal: {
						barBorderWidth:2,
						barBorderColor: '#cbe6c5',
						color: 'rgba(0,0,0,0)'
					},
					emphasis: {
						barBorderColor: 'rgba(0,0,0,0.5)',
						color: 'rgba(0,0,0,0)'
					}
				},
				data: dataYrestTimeData
			},
			{
				name: '工作',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'inside'
					}
				},
				itemStyle: {
					normal: {
						color: '#cbe6c5'
					},
					emphasis: {
						barBorderColor: 'rgba(0,0,0,0.5)',
						color: 'rgba(0,0,0,0.5)'
					}
				},
				data:dataYworkTimeData
			}
		]
	};
	myChart41.setOption(option41);
	//电-饼状图
	myChart42 = echarts.init(document.getElementById('rheader-content-42'));
	option42 = {
		tooltip : {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data: ['工作时段用电量','休息时段用电量']
		},
		toolbox: {
			show : true,
			feature : {
				mark : {show: true},
				dataView : {show: true, readOnly: false},
				magicType : {
					show: true,
					type: ['pie', 'funnel']
				},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		series : [
			{
				name: '',
				type: 'pie',
				radius : '55%',
				center: ['50%', '60%'],
				data:[
					{value:totalWorkTimeData, name:'工作时段用电量'},
					{value:totalYrestTimeData, name:'休息时段用电量'}
				],
				itemStyle: {
					normal: {

						color: function(params) {

							var colorList = [
								'#9dc541','#afc8de'
							];
							return colorList[params.dataIndex]
						}
					},
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	};
	myChart42.setOption(option42);
}
