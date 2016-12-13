$(function(){
	$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(_ajaxStartTime +'到'+_ajaxStartTime));
	//楼宇
	getSessionStoragePointer();
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
		getEcType();
	});
	//分项zTree
	$('.energy-types').delegate('div','click',function(){
		getBranchZtree();
		treeObject();
	})
	getBranchZtree();
	treeObject();
	//确定时间
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
			_ajaxStartTime_1=startDay.split('-')[0]+'/'+startDay.split('-')[1]+'/'+startDay.split('-')[2];
			_ajaxEndTime_1=endDay.split('-')[0]+'/'+endDay.split('-')[1]+'/'+endDay.split('-')[2];
		}else if(_ajaxDataType=="周"){
			inputValue = $('#datetimepicker').val();
			var now = moment(inputValue).startOf('week');
			var startWeek=now.format("YYYY-MM-DD");
			startWeek = now.add(1,'d').format("YYYY-MM-DD");
			var endWeek = now.add(7,'d').format("YYYY-MM-DD");
			end =startWeek + "到" +endWeek;
			_ajaxDataType_1='日';
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startWeek;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}

			_ajaxStartTime_1=startWeek.split('-')[0]+'/'+startWeek.split('-')[1]+'/'+startWeek.split('-')[2];
			_ajaxEndTime_1=endWeek.split('-')[0]+'/'+endWeek.split('-')[1]+'/'+endWeek.split('-')[2];
		}else if(_ajaxDataType=="月"){
			var startMonth=moment(inputValue).startOf('month').format("YYYY-MM-DD");
			var endMonth=moment(inputValue).endOf('month').format("YYYY-MM-DD");
			end =startMonth+"到"+endMonth;
			_ajaxDataType_1='日';

			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startMonth;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}

			_ajaxStartTime_1=startMonth.split('-')[0]+'/'+startMonth.split('-')[1]+'/'+startMonth.split('-')[2];
			_ajaxEndTime_1=endMonth.split('-')[0]+'/'+endMonth.split('-')[1]+'/'+endMonth.split('-')[2];
		}else if(_ajaxDataType=="年"){
			var startYear=moment(inputValue).startOf('year').format("YYYY-MM-DD");
			var endYear=moment(inputValue).endOf('year').format("YYYY-MM-DD");
			end = startYear+"到"+endYear;
			_ajaxDataType_1='月'
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startYear;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
			_ajaxStartTime_1=startYear.split('-')[0]+'/'+split('-')[1]+'/'+split('-')[2];
			_ajaxEndTime_1=endYear.split('-')[0]+'/'+endYear.split('-')[1]+'/'+endYear.split('-')[2];
		}
		$('.datetimepickereType').delegate('.selectTime','click',function(){
			$(this).remove();
		})
	})
	//监测每次的select值，将选项清零
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
	//echarts
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:[],
			top:'30',
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
	//确定能耗种类类型
	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	})
	//搜索框
	var key;
	key = $("#key");
	key.bind("focus",focusKey)
		.bind("blur", blurKey)
		.bind("propertychange", searchNode)
		.bind("input", searchNode);
	getEcType();
	timeDisposal();
	getPointerId();
	getSelectedTime();
	getItemizedData();
	setEnergyInfos();
	$('.btn').click(function(){
		myChart11 = echarts.init(document.getElementById('rheader-content-14'));
		$('#tbody').empty();
		getEcType();
		timeDisposal();
		treeObject();
		getPointerId();
		getSelectedTime();
		getItemizedData();
		$('small').html(_ajaxgetPointerName);
		$('.header-two').html(select_Name);
		setEnergyInfos();
	})
	$('body').mouseover(function(){
		if(myChart11){
			myChart11.resize();
		}
	})
});
var myChart11;
//让echarts自适应
window.onresize = function () {
	if(myChart11){
		myChart11.resize();
	}
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
//初始化能耗种类
var _ajaxEcType = '01';
var _itemName = '电';
//选中的能耗种类
function getEcType(){
	var aaa =[];
	var bbb = [];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		aaa.push(jsonText.alltypes[i].etid);
		bbb.push(jsonText.alltypes[i].etname);
	}
	_ajaxEcType = aaa[$('.selectedEnergy').index()];
	_itemName = bbb[$('.selectedEnergy').index()];
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
//获取dataType(小时，日，月，年)
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
var _ajaxDataType_1='小时';
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
//时间处理
var _ajaxStartTime = moment().subtract(1,'d').format("YYYY-MM-DD");
var	_ajaxStartTime_1=moment().subtract(1,'d').format("YYYY/MM/DD");
var _ajaxEndTime_1=moment().subtract(1,'d').format("YYYY/MM/DD");
var _ajaxStartA=[];
var _ajaxEndA=[];
function timeDisposal(){
	_ajaxStartA=[];
	_ajaxEndA=[];
	var $selectTime = $('.selectTime');
	for(var i=0;i< $selectTime.length;i++){
		var iSelectTime = $('.selectTime').eq(i).html().split('到')[0].split('-');
		_ajaxStartA.push(iSelectTime[0] + '/' + iSelectTime[1] + '/' + iSelectTime[2]);
		var iSelectTimes = $('.selectTime').eq(i).html().split('到')[1].split('-');
		var endDate = moment(iSelectTimes[0] + '/' + iSelectTimes[1] + '/' + iSelectTimes[2]);
		endDate = endDate.add(1,'d');
		_ajaxEndA.push(endDate.format("YYYY/MM/DD"));
	}
}
//选择的楼宇
var  sessionPointer=JSON.parse(sessionStorage.getItem('pointers'));
var _ajaxPointerId=sessionPointer[0].pointerID;
var _ajaxgetPointerName=sessionPointer[0].pointerName;
function getPointerId(){
	_ajaxPointerId=$('#selectPointer').find('option:selected').val();
	_ajaxgetPointerName=$('#selectPointer').find('option:selected').text();
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
//zTree树
var treeObj;
function getBranchZtree(){
	var EnItdata=JSON.parse(sessionStorage.getItem('energyItems'));
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
	var aaa = [];
	for (var i =0; i<EnItdata.length; i++) {
		if(EnItdata[i].energyItemType ==  _itemName){
			aaa.push(EnItdata[i]);
		}
	}
	for(var i=0;i<aaa.length;i++){
		if (i==0) {
			var isChecked = true;
		}else{
			var isChecked = false;
		}
		zNodes.push({ id:aaa[i].f_EnergyItemID, pId:aaa[i].f_ParentItemID, name:aaa[i].f_EnergyItemName,open:true,checked:isChecked})
	}
	treeObj = $.fn.zTree.init($("#energyConsumption"), setting, zNodes);
}
//获得zTree已选中的id
//获得分项数据
function getItemizedData(){
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
		var _ajaxStarts = _ajaxStartA[i];
		var _ajaxEnds = _ajaxEndA[i];
		var ecParams={
			'ecTypeId':select_ID,
			'pointerId':_ajaxPointerId,
			'startTime':_ajaxStarts,
			'endTime':_ajaxEnds,
			'dateType':_ajaxDataType_1
		};
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
	option11.legend.data = selectTime;
	option11.xAxis.data = dataX;
	option11.series = dataY;
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
//月的时间初始化
function monthDate(){
	$('#datetimepicker').datepicker('destroy');
	$('#datetimepicker').datepicker({
		startView: 1,
		maxViewMode: 1,
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