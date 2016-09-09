$(function(){
	//楼宇
	getSessionStoragePointer();
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
	});
	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
		getEcType();
		getBranches();
	});
	//搜索功能
	var key;
	key = $("#key");
	key.bind("focus",focusKey)
		.bind("blur", blurKey)
		.bind("propertychange", searchNode)
		.bind("input", searchNode);
	//楼宇改变响应的之路改变
	$('#selectPointer').change(function(){
		//$('#tbody').empty();
		getPointerId();
		$('#energyConsumption').empty();
		getBranches();
	});
	//时间选择
	$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(_ajaxStartTime +'-'+_ajaxStartTime));
	$('#datetimepicker').datepicker(
		{
			language:  'zh-CN',
			//autoclose: 1,
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
					//$('.datetimepickereType').html(end);
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
			end =startWeek + "-" +endWeek;
			_ajaxDataType_1='日';
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startWeek;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
					//$('.datetimepickereType').html(end);
				}
			}

			_ajaxStartTime_1=startWeek.split('-')[0]+'/'+startWeek.split('-')[1]+'/'+startWeek.split('-')[2];
			_ajaxEndTime_1=endWeek.split('-')[0]+'/'+endWeek.split('-')[1]+'/'+endWeek.split('-')[2];
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
					//$('.datetimepickereType').html(end);
				}
			}

			_ajaxStartTime_1=startMonth.split('-')[0]+'/'+startMonth.split('-')[1]+'/'+startMonth.split('-')[2];
			_ajaxEndTime_1=endMonth.split('-')[0]+'/'+endMonth.split('-')[1]+'/'+endMonth.split('-')[2];
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
					//$('.datetimepickereType').html(end);
				}
			}
			_ajaxStartTime_1=startYear.split('-')[0]+'/'+split('-')[1]+'/'+split('-')[2];
			_ajaxEndTime_1=endYear.split('-')[0]+'/'+endYear.split('-')[1]+'/'+endYear.split('-')[2];
		}
		$('.datetimepickereType').delegate('.selectTime','click',function(){
			$(this).remove();
		})
	});
	//监测每次的select值，将选项清零
	$('.types').change(function(){
		$('.datetimepickereType').empty();
	});
	getPointerId();
	getEcType();
	getSelectedTime();
	timeDisposal();
	getBranches();
	treeObject();
	getBranchData();
	$('.btns').click(function(){
		$('#tbody').empty();
		getPointerId();
		getEcType();
		getSelectedTime();
		timeDisposal();
		getBranches();
		treeObject();
		getBranchData();
	})

})
//首先将sessionStorage的内容写入html中
var _allPointerId=[0];
function getSessionStoragePointer(){
	var jsonText1=sessionStorage.getItem('pointers');
	var htmlTxet1 = JSON.parse(jsonText1);
	var _allSter1 ='<option value="'+htmlTxet1[0].pointerID+'">'+htmlTxet1[0].pointerName+'</option>';
	for(var i=1;i<htmlTxet1.length;i++){
		_allSter1 +='<option value="'+htmlTxet1[i].pointerID+'">'+htmlTxet1[i].pointerName+'</option>';
	}
	for(var i=0;i<htmlTxet1.length;i++){
		_allPointerId.push(htmlTxet1[i].pointerID)
	}
	$('#selectPointer').append(_allSter1);
}
//选择的楼宇
var  sessionPointer=JSON.parse(sessionStorage.getItem('pointers'));
var _ajaxPointerId=sessionPointer[0].pointerID;
var _ajaxgetPointerName=sessionPointer[0].pointerName;
function getPointerId(){
	_ajaxPointerId=$('#selectPointer').find('option:selected').val();
	_ajaxgetPointerName=$('#selectPointer').find('option:selected').text();
}
var _ajaxEcType='100';
function getEcType(){
	_ajaxEcType=$('.selectedEnergy').attr('value');
}
//支路配置项
var ztreeSettings = {
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
	}

};
//存放支路的数组
var branchArr=[];
//获得支路数据
var select_ID;
var zNodes=[];
function getBranches() {
	zNodes=[];
	getEcType();
	var bmParams = {
		"pointerId":_ajaxPointerId,
		"serviceType":_ajaxEcType
	};
	$.ajax(
		{
			url:sessionStorage.apiUrlPrefix+'Branch/GetAllBranches',
			type: "post",
			data: bmParams,
			async:false,
			success: function (data) {
				branchArr=[];
				for(var i=0;i<data.length;i++){
					branchArr.push(data[i])
				}
				for (var i =0; i<branchArr.length; i++) {
					if (i==0) {
						var isChecked = true;
					}else{
						var isChecked = false;
					}
					zNodes.push({id:branchArr[i].f_ServiceId, pId:branchArr[i].f_ParentId, name:branchArr[i].f_ServiceName,open:true,checked:isChecked});
				}
				select_ID=branchArr[0].f_ServiceId;
				$.fn.zTree.init($("#energyConsumption"), ztreeSettings, zNodes);  //ul的id

			},
			error: function (xhr, text, err) {
				alert(text);
			}
		}
	);
}
//获得选中的支路id;
var  sessionItems=JSON.parse(sessionStorage.getItem('energyItems'));
var select_Name = sessionItems[0].f_EnergyItemName;
function treeObject(){
	var treeObject=$.fn.zTree.getZTreeObj('energyConsumption');
	var nodes = treeObject.getCheckedNodes();
	for(var i=0;i<nodes.length;i++){
		select_ID = nodes[i].id;
		select_Name = nodes[i].name;
	}
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
	//.isParent记录 treeNode 节点是否为父节点。
	//.isFirstNode 记录 treeNode 节点是否为同级节点中的第一个节点。
	return !node.isParent && node.isFirstNode;
}
//获取dataType(小时，日，月，年)
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
var _ajaxDataType_1='小时';
//时间
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
		var iSelectTime = $('.selectTime').eq(i).html();
		_ajaxStartA.push(iSelectTime.split('-')[0] + '/' + iSelectTime.split('-')[1] + '/' + iSelectTime.split('-')[2]);
		var endDate = moment(iSelectTime.split('-')[3] + '/' + iSelectTime.split('-')[4] + '/' + iSelectTime.split('-')[5]);
		endDate = endDate.add(1,'d');
		_ajaxEndA.push(endDate.format("YYYY/MM/DD"));
	}
}
//获得支路数据
function getBranchData(){
	var _allData=[];
	var dataX=[];
	var dataXx=[];
	var dataY=[];
	//存放最大/最小值的数组
	var maxArr_1=0;
	var minArr_1=0;
	var maxTime;
	var minTime;
	var _totalY=0;
	var average=0;
	for(var i=0;i<_ajaxStartA.length;i++){
		var startsTimess = _ajaxStartA[i];
		var endsTimess=_ajaxEndA[i];
		var ecParams={
			'startTime':startsTimess,
			'endTime':endsTimess,
			'dateType':_ajaxDataType_1,
			'f_ServiceId':select_ID
		}
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'Branch/GetECByBranches',
			data:ecParams,
			async:false,
			success:function(result){
				_allData.push(result)
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
		//console.log(dataY)

	}else if(_ajaxDataType=="周"){
		dataX=['周一','周二','周三','周四','周五','周六','周日'];
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
	}
	//用电量折线图
	myChart3 = echarts.init(document.getElementById('rheader-content-14'));
	// 指定图表的配置项和数据
	option3 = {
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
	// 使用刚指定的配置项和数据显示图表。
	myChart3.setOption(option3);
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