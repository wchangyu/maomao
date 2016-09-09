$(function(){
	$('.datetimepickereType').html(_ajaxStartTime +'-'+_ajaxStartTime);
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
					//$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
					$('.datetimepickereType').html(end);
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
					//$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
					$('.datetimepickereType').html(end);
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
					//$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
					$('.datetimepickereType').html(end);
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
					//$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
					$('.datetimepickereType').html(end);
				}
			}
			//startDay.split('-')[0]+'/'+startDay.split('-')[1]+'/'+startDay.split('-')[2];
			_ajaxStartTime_1=startYear.split('-')[0]+'/'+split('-')[1]+'/'+split('-')[2];
			_ajaxEndTime_1=endYear.split('-')[0]+'/'+endYear.split('-')[1]+'/'+endYear.split('-')[2];
		}
	})
	//换内容时，清空时间
	$('.types').change(function(){
		$('.datetimepickereType').html('');
	})
	//获取楼宇
	getSessionStoragePointer();
	//获取支路数据
	getPointerId();
	getBranches();
	$('#selectPointer').change(function(){
		//$('#tbody').empty();
		getPointerId();
		$('#energyConsumption').empty();
		getBranches();
	});
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
	})
	//搜索功能
	var key;
	key = $("#key");
	key.bind("focus",focusKey)
		.bind("blur", blurKey)
		.bind("propertychange", searchNode)
		.bind("input", searchNode);
    //用电率折线图
    myChart4 = echarts.init(document.getElementById('rheader-content1'));
        // 指定图表的配置项和数据
        option4 = {
		    title: {
		        text: '未来一周气温变化',
		        subtext: '纯属虚构'
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['最高气温','最低气温']
		    },
		    toolbox: {
		        show: true,
		        feature: {
		            dataZoom: {},
		            dataView: {readOnly: false},
		            magicType: {type: ['line', 'bar']},
		            restore: {},
		            saveAsImage: {}
		        }
		    },
		    xAxis:  {
		        type: 'category',
		        boundaryGap: false,
		        data: ['周一','周二','周三','周四','周五','周六','周日']
		    },
		    yAxis: {
		        type: 'value',
		        axisLabel: {
		            formatter: '{value} °C'
		        }
		    },
		    series: [
		        {
		            name:'最高气温',
		            type:'line',
		            data:[11, 11, 15, 13, 12, 13, 10],
		             
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		                
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'最低气温',
		            type:'line',
		            data:[1, -2, 2, 5, 3, 2, 0],
		            markPoint: {
		                data: [
		                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'},
		                    [{
		                        symbol: 'arrow',
		                        label: {
		                            normal: {
		                                formatter: '最大值'
		                            }
		                        },
		                        type: 'max',
		                        name: '最大值'
		                    }, {
		                        symbol: 'circle',
		                        x: '60%',
		                        y: '50%'
		                    }]
		                ],
		                 itemStyle: {
		                normal: {
		                    color: function(params) {
		                        
		                        var colorList = [
		                          '#2ec8ca','#b6a2df','#5bb0f0','red','#f1d9c1',
		                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
		                           '#D7504B','#C6E579','#F4E001','red','#26C0C0'
		                        ];
		                        return colorList[params.dataIndex]
		                    }
		                }
		            }

		            }
		            
		        }
		    ]
		};
        // 使用刚指定的配置项和数据显示图表。
        myChart4.setOption(option4);
	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	})
	$('.btns').click(function(){
		getEcType();
		getPointerId();
		treeObject();
		getBranchData();
	})
})
 var myChart3;
 var myChart4;
 window.onresize = function () {
        myChart3.resize(); 
        myChart4.resize(); 
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
		//console.log(_ajaxEcType)
}
//获取dataType(小时，日，月，年)
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
	console.log(_ajaxDataType)
}
//选择日期对应的时间
var _ajaxDataType_1='小时';
//新建数组存放楼宇id
//var _ajaxgetPointerName=sessionPointer[0].pointerName;
function getPointerId(){
	_ajaxPointerId=$('#selectPointer').find('option:selected').val();
	_ajaxgetPointerName=$('#selectPointer').find('option:selected').text();
}
//获取支路用电环比ajax
var ztreeSettings = {
	check: {
		enable: true,
		chkStyle: "check",
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
	}

};
//存放支路的数组
var branchArr=[];
//获得支路数据
var zNodes=[];
function getBranches() {
	zNodes=[];
	getEcType();
	var bmParams = {
		"pointerId":_ajaxPointerId,
		"serviceType":_ajaxEcType
	};
	//console.log(bmParams)
	$.ajax(
		{
			url: "http://211.100.28.180/BEEWebAPI/api/Branch/GetAllBranches",
			type: "post",
			data: bmParams,
			success: function (data) {
				branchArr=[];
				for(var i=0;i<data.length;i++){
					branchArr.push(data[i])
				}
				//console.log(branchArr)
				for (var i =0; i<branchArr.length; i++) {
					if (i==0) {
						var isChecked = true;
					}else{
						var isChecked = false;
					}
					zNodes.push({id:branchArr[i].f_ServiceId, pId:branchArr[i].f_ParentId, name:branchArr[i].f_ServiceName,open:true,checked:isChecked});
					//console.log(branchArr[i].f_ServiceId)
				}
				//console.log(zNodes)
				//console.log(branchArr)
				$.fn.zTree.init($("#energyConsumption"), ztreeSettings, zNodes);  //ul的id
				treeObject();
				getBranchData();
			},
			error: function (xhr, text, err) {
				alert(text);
			}
		}
	);
}
//获得选中的支路id;
var select_ID=[];
var select_Name=[];
function treeObject(){
	var treeObject=$.fn.zTree.getZTreeObj('energyConsumption');
	//console.log(treeObject)
	var nodes = treeObject.getCheckedNodes();
	//console.log(nodes)
	select_ID=[];
	select_Name=[];
	for(var i=0;i<nodes.length;i++){
		select_ID.push(nodes[i].id);
		select_Name.push(nodes[i].name);
	}
}
//获得开始时间
var _ajaxStartTime = moment().subtract(1,'d').format("YYYY-MM-DD");
var _ajaxStartTime_1 = moment().subtract(1,'d').format("YYYY-MM-DD");
var _ajaxEndTime_1 = moment().format("YYYY/MM/DD");
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
	console.log(nodeList)
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
//获得楼宇支路数据
function getBranchData(){
	//console.log(_ajaxDataType);
	var allBranch=[];
	var dataX=[];
	var dataY=[];
	var dataXx=[];
	for(var i=0;i<select_ID.length;i++){
		var selects_ID=select_ID[i]
		//console.log(selects_ID)
		var ecParams={
			'startTime':_ajaxStartTime_1,
			'endTime':_ajaxEndTime_1,
			'dateType':_ajaxDataType_1,
			'f_ServiceId':selects_ID
		}
		//console.log(ecParams)
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'Branch/GetECByBranches',
			data:ecParams,
			async:false,
			success:function(result){
			allBranch.push(result)
		}
		})
	}
	//console.log(allBranch)
	if(_ajaxDataType=='日'){
		//x轴数据
		for(var i=0;i<allBranch.length;i++){
			var datas=allBranch[i];
			for(var j=0;j<datas.length;j++){
				//console.log(datas[j])
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
			object.name=select_Name[i];
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
		}
		//console.log(dataY);
	}else if(_ajaxDataType=='周'){
		var dataX=['周一','周二','周三','周四','周五','周六','周日'];
		//x轴数据
		for(var i=0;i<allBranch.length;i++){
			var datas=allBranch[i];
			for(var j=0;j<datas.length;j++){
				//console.log(datas[j])
				if(dataXx.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataXx.push(datas[j].dataDate.split('T')[0]);
				}
			}
		}
		dataX.sort();
		//console.log(dataX)

		//遍历y轴数据
		for(var i=0;i<allBranch.length;i++){
			var object={};
			object.name=select_Name[i];
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
		}
		//console.log(dataY)
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
			object.name=select_Name[i];
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
			object.name=select_Name[i];
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
		}
	}

	//用电量折线图
	myChart3 = echarts.init(document.getElementById('rheader-content'));
	// 指定图表的配置项和数据
	option3 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:select_Name
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