$(function(){
	$('.datetimepickereType').html(_ajaxStartTime +'到'+_ajaxStartTime);
	//日历格式初始化
	initDate();
	$('#datetimepicker').on('changeDate',function(e){
		var inputValue;
		dataType();
		inputValue = $('#datetimepicker').val();
		if(_ajaxDataType=="日"){
			inputValue = $('#datetimepicker').val();
			var now = moment(inputValue).startOf('day');
			//当前开始结束时间
			var startDay = now.format("YYYY-MM-DD");
			var endDay = now.add(1,'d').format("YYYY-MM-DD");
			//上一阶段开始结束时间
			var startsDay = now.subtract(2,'d').format("YYYY-MM-DD");
			var endsDay = now.add(1,'d').format("YYYY-MM-DD");
			_ajaxStartTime=startDay;
			_ajaxDataType_1='小时';
			var end=startDay + "到" +startDay;
			var aa = $('.datetimepickereType').text();
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			//当前开始、结束时间
			var startSplit = startDay.split('-');
			var endSplit = endDay.split('-');
			_ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
			_ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
			//上一阶段的开始、结束时间
			var startsSplit = startsDay.split('-');
			var endsSplit = endsDay.split('-');
			_ajaxLastStartTime_1 = startsSplit[0] + '/' + startsSplit[1] + '/' + startsSplit[2];
			_ajaxLastEndTime_1 = endsSplit[0] + '/' + endsSplit[1] + '/' + endsSplit[2];
		}else if(_ajaxDataType=="周"){
			inputValue = $('#datetimepicker').val();
			var now = moment(inputValue).startOf('week');
			//页面显示时间
			var nowStart = now.add(1,'d').format("YYYY-MM-DD");
			var nowEnd = now.add(6,'d').format("YYYY-MM-DD");
			//当前开始结束时间
			var startWeek = now.subtract(6,'d').format("YYYY-MM-DD");
			var endWeek = now.add(7,'d').format("YYYY-MM-DD");
			end =nowStart + "到" +nowEnd;
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
			//当前开始结束时间
			var startSplit = startWeek.split('-');
			var endSplit = endWeek.split('-');
			_ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
			_ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
			//上一时段开始结束时间
			var startSplits = startsWeek.split('-');
			var endSplits = endsWeek.split('-');
			_ajaxLastStartTime_1 = startSplits[0] + '/' + startSplits[1] + '/' + startSplits[2];
			_ajaxLastEndTime_1 = endSplits[0] + '/' + endSplits[1] + '/' + endSplits[2];
		}else if(_ajaxDataType=="月"){
			var now = moment(inputValue).startOf('month');
			var nows = moment(inputValue).endOf('month');
			//页面显示时间
			var nowStart = now.format("YYYY-MM-DD");
			var nowEnd = nows.format("YYYY-MM-DD");
			//当前开始结束时间
			var startMonth=now.format("YYYY-MM-DD");
			var endMonth=nows.add(1,'d').format("YYYY-MM-DD");
			end = nowStart + "到" + nowEnd;
			//上一时段的开始结束时间
			var startsMonth = now.subtract(1,'month').format("YYYY-MM-DD");
			var endsMonth = nows.subtract(1,'month').format("YYYY-MM-DD");
			_ajaxDataType_1='日';
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startMonth;
			if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').html(end);
				}
			}
			var startSplit = startMonth.split('-');
			var endSplit = endMonth.split('-');
			_ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
			_ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
			var startSplits = startsMonth.split('-');
			var endSplits = endsMonth.split('-');
			_ajaxLastStartTime_1 = startSplits[0] + '/' + startSplits[1] + '/' + startSplits[2];
			_ajaxLastEndTime_1 = endSplits[0] + '/' + endSplits[1] + '/' + endSplits[2];
		}else if(_ajaxDataType=="年"){
			//页面显示时间
			var now = moment(inputValue).startOf('year');
			var nows = moment(inputValue).endOf('year');
			var nowStart = now.format("YYYY-MM-DD");
			var nowEnd = nows.format("YYYY-MM-DD");
			var startYear=now.format("YYYY-MM-DD");
			var endYear=nows.add(1,'d').format("YYYY-MM-DD");
			end = nowStart+"到"+nowEnd;
			var startsYear = now.subtract(1,'year').format("YYYY-MM-DD");
			var endsYear = nows.subtract(1,'year').format("YYYY-MM-DD");
			_ajaxDataType_1='月';
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
			var startSplits = startsYear.split('-');
			var endSplits = endsYear.split('-');
			_ajaxLastStartTime_1 = startSplits[0] + '/' + startSplits[1] + '/' + startSplits[2];
			_ajaxLastEndTime_1 = endSplits[0] + '/' + endSplits[1] + '/' + endSplits[2];
		}
	});
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
		getEcType();
		//获得支路
		getBranches();
	});
	//用电量折线图
	myChart3 = echarts.init(document.getElementById('rheader-content'));
	// 指定图表的配置项和数据
	option3 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:select_Name,
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
	//获取选取的能耗种类
	getEcType();
	//获取楼宇
	getSessionStoragePointer();
	//获取支路数据
	getPointerId();
	getBranches();
	getBranchData();
	$('#selectPointer').change(function(){
		$('#tbody').empty();
		getPointerId();
		$('#energyConsumption').empty();
		getBranches();
	});
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
	//搜索功能
	var key;
	key = $("#key");
	key.bind("focus",focusKey)
		.bind("blur", blurKey)
		.bind("propertychange", searchNode)
		.bind("input", searchNode);
	setEnergyInfo();
	$('.btn').click(function(){
		myChart3 = echarts.init(document.getElementById('rheader-content'));
		getEcType();
		getPointerId();
		getSelectedBranches();
		getBranchData();
		setEnergyInfo();
	})
	$('body').mouseover(function(){
		if(myChart3){
			myChart3.resize();
		}
	})
})
 var myChart3;
 window.onresize = function () {
	 if(myChart3){
		 myChart3.resize();
	 }
 }
//根据当前选择的能耗类型设置页面信息
function setEnergyInfo(){
	if(_energyTypeSel){
		var selectedEV = $(".selectedEnergy").attr('value');
		for(var i=0;i<_energyTypeSel._allEnergyTypes.length;i++){
			if(_energyTypeSel._allEnergyTypes[i].ettype==selectedEV){
				var curET = _energyTypeSel._allEnergyTypes[i];
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
//楼宇的读取
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
//选中的能耗种类
var _ajaxEcType;
function getEcType(){
	//首先判断哪个含有selectedEnergy类
	_ajaxEcType=$('.selectedEnergy').attr('value');
}
//获取dataType(小时，日，月，年)
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
//选择日期对应的时间
var _ajaxDataType_1='小时';
//新建数组存放楼宇id
function getPointerId(){
	_ajaxPointerId=$('#selectPointer').find('option:selected').val();
	_ajaxgetPointerName=$('#selectPointer').find('option:selected').text();
}
//存放支路的数组
var branchArr=[];
//获得支路数据
var select_ID=[];
var zNodes=[];
var treeObj;
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
				if(data.length == 0){	//没有数据时候跳出,清除树
					var lastTree = $.fn.zTree.getZTreeObj("energyConsumption");
					if(lastTree) { lastTree.destroy(); }
					return;
				}
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
				select_ID.push(branchArr[0].f_ServiceId);
				//获取支路用电环比ajax
				var ztreeSettings = {
					check: {
						enable: true,
						chkStyle: "checkbox",
						chkboxType: { "Y": "", "N": "" }

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
				treeObj = $.fn.zTree.init($("#energyConsumption"), ztreeSettings, zNodes);  //ul的id
				getSelectedBranches();
			},
			error: function (xhr, text, err) {
				$('#energyConsumption').html(JSON.parse(xhr.responseText).message);
			}
		}
	);
}
//获得选中的支路id;
var select_Name=[];
function getSelectedBranches(){
	treeObj=$.fn.zTree.getZTreeObj('energyConsumption');
	if(treeObj){
		var nodes = treeObj.getCheckedNodes();
		select_ID=[];
		select_Name=[];
		for(var i=0;i<nodes.length;i++){
			select_ID.push(nodes[i].id);
			select_Name.push(nodes[i].name);
		}
	}
}
//获得开始时间
var _ajaxStartTime = moment().subtract(1,'d').format("YYYY-MM-DD");
var _ajaxStartTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");
var _ajaxEndTime_1 = moment().format("YYYY/MM/DD");
var _ajaxLastStartTime_1 = moment().subtract(2,'d').format("YYYY/MM/DD");
var _ajaxLastEndTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");
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
	//展开 / 折叠 指定的节点（需要 展开 / 折叠 的节点数据，expandFlag = true表示展开节点，操作是否影响子节点，focus = true 表示 展开 / 折叠 操作后，通过设置焦点保证此焦点进入可视区域内）
	zTree.expandNode(node,true,false,false);
	//pNode父节点getParentNode（）获取 treeNode 节点的父节点。
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
//获得楼宇支路数据
function getBranchData(){
	var allBranch=[];
	var allBranchs=[];
	var dataX=[];
	var dataY=[];
	var dataXx=[];
	var lastAdd=0;
	var lastAdds=0;
	var growthRate=0;
	for(var i=0;i<select_ID.length;i++){
		var nums = -1;
		//每次清空数组
		if(select_ID.length != 1){
			$('.L-right').hide();
			$('.L-left').addClass('col-lg-12');
			$('.L-left').removeClass('col-lg-8');
		}else if(select_ID.length == 1){
			$('.L-right').show();
			$('.L-left').addClass('col-lg-8');
			$('.L-left').removeClass('col-lg-12');
		}
		var selects_ID=select_ID[i];
		var ecParams={
			'startTime':_ajaxStartTime_1,
			'endTime':_ajaxEndTime_1,
			'dateType':_ajaxDataType_1,
			'f_ServiceId':selects_ID
		};
		lastAdd = null;
		lastAdds = null;
		var lengths = null;
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'Branch/GetECByBranches',
			data:ecParams,
			async:true,
			success:function(result){
				nums ++;
				allBranch = [];
				var datas,dataSplits,object;
				allBranch.push(result);
				for(var j=0;j<allBranch.length;j++){
					datas = allBranch[j];
					for(var z=0;z<datas.length;z++){
						lastAdd += datas[z].data;
					}
				}
				$('.total-power-consumption-value label').html(parseInt(lastAdd));
				if(lastAdd != null && lastAdds != null){
					if(lastAdds != 0){
						growthRate = (lastAdd - lastAdds) / lastAdds * 100;
						$('.rights-up-value').html(growthRate.toFixed(1) + '%');
					}else if(lastAdds == 0){
						$('.rights-up-value').html('-');
					}
					if(growthRate > 0){
						$('.rights-up').css({
							'background':'url(./work_parts/img/up2.png)no-repeat',
							'background-size':'23px'
						})
					}else if(growthRate < 0){
						$('.rights-up').css({
							'background':'url(./work_parts/img/up.png)no-repeat',
							'background-size':'23px'
						})
					}
				};
				lengths = allBranch[0];
				if(lengths.length != null){
					if(_ajaxDataType == '日'){
						//x轴数据
						for(var j=0;j<lengths.length;j++){
							datas = lengths[j];
							dataSplits = datas.dataDate.split('T')[1].slice(0,5);
							if(dataX.indexOf(dataSplits)<0){
								dataX.push(dataSplits);
							}
						}
						dataX.sort();
						//遍历出y轴数据
						object={};
						object.name=select_Name[nums];
						object.type='line';
						object.data=[];
						for(var j=0;j<lengths.length;j++){
							for(var z=0;z<dataX.length;z++){
								if(lengths[j].dataDate.split('T')[1].slice(0,5) == dataX[z]){
									object.data.push(lengths[j].data);
								}
							}
						}
						dataY.push(object);
					}else if( _ajaxDataType == '周'){
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
						object.name=select_Name[nums];
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
					}else if( _ajaxDataType == '月'  || _ajaxDataType == '年'){
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
						object.name = select_Name[nums];
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
					// 使用刚指定的配置项和数据显示图表。
					option3.xAxis.data = dataX;
					option3.legend.data = select_Name;
					option3.series = dataY;
					myChart3.setOption(option3);
				}
			},
			error: function (xhr, text, err) {
				console.log(JSON.parse(xhr.responseText).message);
			}
		})
	}
	//上一阶段的数据
	for(var i=0;i<select_ID.length;i++){
		var selects_ID=select_ID[i]
		var ecParams={
			'startTime':_ajaxLastStartTime_1,
			'endTime':_ajaxLastEndTime_1,
			'dateType':_ajaxDataType_1,
			'f_ServiceId':selects_ID
		};
		lastAdd = null;
		lastAdds = null;
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'Branch/GetECByBranches',
			data:ecParams,
			async:false,
			success:function(result){
				allBranchs.push(result);
				for(var i=0;i<allBranchs.length;i++){
					var datas = allBranchs[i];
					for(var j=0;j<datas.length;j++){
						lastAdds += datas[j].data;
					}
				};
				$('.compared-with-last-time label').html(parseInt(lastAdds));
				if(lastAdd != null && lastAdds != null){
					if(lastAdds != 0){
						growthRate = (lastAdd - lastAdds) / lastAdds * 100;
						$('.rights-up-value').html(growthRate.toFixed(1) + '%');
					}else if(lastAdds == 0){
						$('.rights-up-value').html('-');
					}
					if(growthRate > 0){
						$('.rights-up').css({
							'background':'url(./work_parts/img/up2.png)no-repeat',
							'background-size':'23px'
						})
					}else if(growthRate < 0){
						$('.rights-up').css({
							'background':'url(./work_parts/img/up.png)no-repeat',
							'background-size':'23px'
						})
					}
				}
			}
		})
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