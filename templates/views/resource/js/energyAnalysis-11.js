$(function(){
	//日期插件
	$('.datetimeStart').html(_ajaxStartTime);
	$('.datetimeEnd').html(_ajaxEndTime);
	//楼宇
	getSessionStoragePointer();
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
		getPointerId();
		$('#energyConsumption').empty();
		getBranches();
	});
	//时间选择
	$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(_ajaxStartTime +'到'+_ajaxStartTime));
	//日历格式初始化
	_initDate();
	$('#datetimepicker').on('changeDate',function(e){
		dataType();
		_selectTime(_ajaxDataType);
	});
	//echarts
	myChart3 = echarts.init(document.getElementById('rheader-content-14'));
	// 指定图表的配置项和数据
	option3 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:[]
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
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
		getEcType();
		//获得支路
		getBranches();
	});
	getPointerId();
	getEcType();
	getSelectedTime();
	timeDisposal();
	getBranches();
	getBranchData();
	setEnergyInfos();
	//页面加载时表头small内容
	var smalls = $('<small>');
	smalls.html(select_Name);
	$('.page-title').append(smalls);
	$('.btn').click(function(){
		myChart3 = echarts.init(document.getElementById('rheader-content-14'));
		$('#tbody').empty();
		//选中的楼宇
		getPointerId();
		//选中的能耗种类
		getEcType();
		//选中的时间
		getSelectedTime();
		//处理时间
		timeDisposal();
		treeObject();
		getBranchData();
		setEnergyInfos();
		if($('.page-title').children('small').length){
			$('.page-title').children('small').remove();
		}
		var smalls = $('<small>');
		smalls.html(select_Name);
		$('.page-title').append(smalls);
	})
	$('body').mouseover(function(){
		if(myChart3){
			myChart3.resize();
		}
	})
})
var myChart3;
//让echarts自适应
window.onresize = function () {
	if(myChart3){
		myChart3.resize();
	}
}
//首先将sessionStorage的内容写入html中
var _allPointerId=[0];
function getSessionStoragePointer(){
	var jsonText1=sessionStorage.getItem('pointers');
	var htmlTxet1 = JSON.parse(jsonText1);
	if(htmlTxet1){
		var _allSter1 ='<option value="'+htmlTxet1[0].pointerID+'">'+htmlTxet1[0].pointerName+'</option>';
		for(var i=1;i<htmlTxet1.length;i++){
			_allSter1 +='<option value="'+htmlTxet1[i].pointerID+'">'+htmlTxet1[i].pointerName+'</option>';
		}
		for(var i=0;i<htmlTxet1.length;i++){
			_allPointerId.push(htmlTxet1[i].pointerID)
		}
		$('#selectPointer').append(_allSter1);
	}

}
//选择的楼宇
var  sessionPointer=JSON.parse(sessionStorage.getItem('pointers'));
if(sessionPointer){
	var _ajaxPointerId=sessionPointer[0].pointerID;
	var _ajaxgetPointerName=sessionPointer[0].pointerName;
}
function getPointerId(){
	_ajaxPointerId=$('#selectPointer').find('option:selected').val();
	_ajaxgetPointerName=$('#selectPointer').find('option:selected').text();
}
var _ajaxEcType='100';
function getEcType(){
	_ajaxEcType=$('.selectedEnergy').attr('value');
}
//根据当前选择的能耗类型设置页面信息
function setEnergyInfos(){
	if(_energyTypeSel){
		var selectedEV = $(".selectedEnergy").attr('value');
		if(_energyTypeSel._allEnergyTypes){
			for(var i=0;i<_energyTypeSel._allEnergyTypes.length;i++){
				if(_energyTypeSel._allEnergyTypes[i].ettype==selectedEV){
					var curET = _energyTypeSel._allEnergyTypes[i];
					$('#th0').html('对比对象');
					$('.ths').html('出现时刻');
					$('#th1').html('累计用' + curET.etname + '量' + curET.etunit);
					$('#th2').html('用' + curET.etname + '峰值' + curET.etunit);
					$('#th3').html('用' + curET.etname + '谷值' + curET.etunit);
					$('#th4').html('用' + curET.etname + '平均值' + curET.etunit);
					$('.header-one').html(curET.etname);
					$('.right-header span').html('用' + curET.etname + '曲线');
					$('.total-power-consumption').html('累计用' + curET.etname);
					$('.the-cumulative-power-unit').html(curET.etunit);
					$('.header-right-lists').html('单位：' + curET.etunit);
					return;
				}
			}
		}

	}
}
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
			beforeSend:function(){
				myChart3.showLoading({
					text:'获取数据中',
					effect:'whirling'
				});
			},
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
				//支路配置项
				var treeObj;
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
					},
					callback: {
						onClick:function (event,treeId,treeNode){
							treeObj.checkNode(treeNode,!treeNode.checked,true)
						}
					}
				};
				treeObj = $.fn.zTree.init($("#energyConsumption"), ztreeSettings, zNodes);
				treeObject();
				myChart3.hideLoading();
			},
			error:function(jqXHR, textStatus, errorThrown){
				console.log(jqXHR.responseText)
			}
		}
	);
}
//获得选中的支路id;
var  sessionItems=JSON.parse(sessionStorage.getItem('energyItems'));
if(sessionItems){
	var select_Name = sessionItems[0].f_EnergyItemName;
}
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
var _ajaxEndTime = moment().subtract(1,'d').format("YYYY-MM-DD");
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
//获得支路数据
function getBranchData(){
	var allBranch=[];
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
	var nums = -1;
	for(var i=0;i<_ajaxStartA.length;i++){
		var lengths = null;
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
			beforeSend:function(){
				myChart3.showLoading({
					text:'获取数据中',
					effect:'whirling'
				});
			},
			success:function(result){
				allBranch = [];
				allBranch.push(result);
				nums ++;
				var datas,dataSplits,object,maxData,minData;
				lengths = allBranch[0];
				if(lengths != null){
					if(_ajaxDataType=='日'){
						//x轴数据
						for(var j=0;j<lengths.length;j++){
							datas = lengths[j];
							dataSplits = datas.dataDate.split('T')[1].slice(0,5);
							if(dataX.indexOf(dataSplits)<0){
								dataX.push(dataSplits);
							}
						}
						dataX.sort();
						//y轴数据
						object = {};
						object.name = $('.selectTime').eq(nums).html();
						object.type = 'line';
						object.data = [];
						for(var j=0;j<lengths.length;j++){
							for(var z=0;z<dataX.length;z++){
								if(lengths[j].dataDate.split('T')[1].slice(0,5) == dataX[z]){
									object.data.push(lengths[j].data)
								}
							}
						}
						dataY.push(object);
					}else if(_ajaxDataType=='周'){
						dataX=['周一','周二','周三','周四','周五','周六','周日'];
						//x轴数据
						for(var j=0;j<lengths.length;j++){
							datas = lengths[j];
							dataSplits = datas.dataDate.split('T')[0];
							if(dataXx.indexOf(dataSplits)<0){
								dataXx.push(dataSplits);
							}
						}
						//y轴数据
						object = {};
						object.name=$('.selectTime').eq(nums).html();
						object.type = 'line';
						object.data=[];
						for(var j=0;j<lengths.length;j++){
							for(var z=0;z<dataXx.length;z++){
								if(lengths[j].dataDate.split('T')[0] == dataXx[z]){
									object.data.push(lengths[j].data);
								}
							}
						}
						dataY.push(object);
					}else if(_ajaxDataType=='月' || _ajaxDataType=='年'){
						//x轴数据
						for(var j=0;j<lengths.length;j++){
							datas = lengths[j];
							dataSplits = datas.dataDate.split('T')[0];
							if(dataX.indexOf(dataSplits)<0){
								dataX.push(dataSplits);
							}
						}
						//y周数据
						object = {};
						object.name = $('.selectTime').eq(nums).html();
						object.type = 'line';
						object.data = [];
						for(var j=0;j<lengths.length;j++){
							for(var z=0;z<dataX.length;z++){
								if(lengths[j].dataDate.split('T')[0] == dataX[z]){
									object.data.push(lengths[j].data);
								}
							}
						}
						dataY.push(object);
					}
					maxData = _.max(lengths,function(d){return d.data});
					minData = _.min(lengths,function(d){return d.data});
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
					$('#tbody').append('<tr><td>'+selectTime[nums]+'</td><td>'+unitConversion(_totalY)
						+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
						+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
						+'</td><td>'+unitConversion(average)+'</td></tr>')
					option3.legend.data = selectTime;
					option3.xAxis.data = dataX;
					option3.series = dataY;
					myChart3.setOption(option3);
				};
				myChart3.hideLoading();
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR.responseText);
			}
		})
	}
}
var selectTime=[];
function getSelectedTime(){
	selectTime=[];
	for(var i=0;i<$('.selectTime').length;i++){
		selectTime.push($('.selectTime').eq(i).html())
	}
}

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