//获取dataType(小时，日，月，年)

var _ajaxDataType='日';

//时间颗粒度
var _ajaxDataType_1 = '小时';

$(function(){

	timeYMDComponentsFun($('.datatimeblock'));

	/*-------------------------------------------------能耗种类-----------------------------------------------------*/

	//选中的能耗种类id
	var _energyTypeValue = '';

	//当前选中的能耗种类value

	var _energyTypeNum = '';

	//选中能耗种类名称
	var _energyTypeWord = '';

	//能耗种类
	var _energyTypeSel = new ETSelection();

	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){

		_energyTypeValue = _getEcTypeValue();

		_energyTypeWord = _getEcTypeWord();

		_energyTypeNum = _getEcTypeNum();

	});

	//确定能耗种类
	_energyTypeValue = _getEcTypeValue();

	_energyTypeWord = _getEcTypeWord();

	_energyTypeNum = _getEcTypeNum();

	/*--------------------------------------------------区域位置----------------------------------------------------*/

	//楼宇树
	var pointerObj;

	//分项树
	var treeObj;

	//分项树
	getBranchZtree();

	//楼宇列表
	getSessionStoragePointer();

	//分支的搜索功能
	var key = $("#key");
	//聚焦事件
	key.bind("focus",focusKey($('#key')));
	//失去焦点事件
	key.bind("blur", blurKey);
	//输入事件
	//key.bind("propertychange", searchNode);
	//输入事件
	key.bind("input", searchNode);

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

	var lastValue='',nodeList=[];

	function searchNode(e) {

		//获取树
		var zTree = $.fn.zTree.getZTreeObj("dev");

		//去掉input中的空格（首尾）
		var value = $.trim($('#key').get(0).value);

		//设置搜索的属性
		var keyType = "name";

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

			$('.tipes').html('抱歉，没有您想要的结果').show();

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

		//展开符合搜索条件的节点
		//展开 / 折叠 指定的节点
		zTree.expandNode(node,true,false,false);

		if(typeof node == 'object'){

			//pNode父节点
			var pNode = node.getParentNode();

		}

		if(pNode != null){

			nodeList.push(pNode);

			findParent(zTree,pNode);
		}
	}

	//楼宇搜索功能
	var objSearchs = new ObjectSearch();

	objSearchs.initPointerSearch($("#keys"),$(".tipess"),"allPointer");

	/*-------------------------------------------------时间选择----------------------------------------------------*/

	//日历初始化(默认日)
	_initDate1();

	/*---------------------------------------------------echarts图-------------------------------------------------*/

	var myChart = echarts.init(document.getElementById('rheader-content-14'));

	option = {
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

	/*-----------------------------------------------默认加载------------------------------------------------------*/

	//默认加载数据
	conditionalSearch();

	//配置信息
	setEnergyInfos();

	/*---------------------------------------------------按钮------------------------------------------------------*/
	//查询
	$('.btn-success').click(function(){

		//初始化
		echarts.init(document.getElementById('rheader-content-14'));

		//初始化表格
		$('#tbody').empty();

		//判断当前选中的是什么能耗类型
		_energyTypeValue = _getEcTypeValue();

		//条件查询
		conditionalSearch();

		//配置页面信息
		setEnergyInfos();

	})

	//分项、能耗联动
	$('.energy-types').delegate('div','click',function(){

		//样式修改
		//获取当前的能耗类型
		var ettype = $(this).attr('value');

		//获取当前是楼宇还是分户
		var flag = $(this).parent().attr('type');

		//从本地配置中获取当前的能耗信息集合
		var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));

		//需要获取分户的能耗类型
		if(flag == '02'){

			jsonText=JSON.parse(sessionStorage.getItem('officeEnergyType'));
		}

		//获取能耗信息的配置
		var alltypes = jsonText.alltypes;

		//获取当前选中的能耗的值
		_energyTypeNum = $('.energy-types').find('.selectedEnergy').attr('value');

		$(alltypes).each(function(i,o){

			var imgUrl;

			//如果当前是当前点击的能耗类型
			if(ettype == o.ettype){

				//获取当前的选中图片
				imgUrl = '../new-resource/img/' + o.selectImg;

			}else{

				//获取当前的未选中图片
				imgUrl = '../new-resource/img/' + o.unSelectImg;
			}

			$('.energy-types .specific-energy').eq(i).css({

				"background":"url("+imgUrl+") center 6px no-repeat",

				"backgroundSize": "22px 28px"
			});

		});

		getBranchZtree();

	})

	window.onresize = function () {

		if(myChart){

			myChart.resize();

		}

	}

	$('body').mouseover(function(){

		if(myChart){

			myChart.resize();

		}

	})

	/*------------------------------------------------其他方法------------------------------------------------------*/

	//ztree树设置
	function getBranchZtree(){


		//json数据
		var EnItdata=JSON.parse(sessionStorage.getItem('energyItems'));

		//_energyTypeValue

		var setting = {
			check: {
				enable: true,
				chkStyle: "radio",
				radioType: "all"
			},
			data: {
				key: {
					title: 'title'
				},
				simpleData: {
					enable: true
				}
			},
			view: {
				showIcon: false,
				showTitle:true
			},
			callback: {
				onClick:function (event,treeId,treeNode){
					treeObj.checkNode(treeNode,!treeNode.checked,true)
				}
			}
		};

		var zNodes = [];

		//根据能耗种类过滤数据
		var energyTypeArr = [];

		//获取能耗类型的分项

		var rootParent = '';

		for(var i=0;i<EnItdata.length;i++){

			if(EnItdata[i].f_EnergyItemID == _energyTypeValue){

				rootParent = EnItdata[i].f_EnergyItemID;

				energyTypeArr.push(EnItdata[i]);


			}

		}

		//存放新生成的数组

		ztreeDataFilter(EnItdata,rootParent);


		function  ztreeDataFilter(arr,value){

			//第一层的时候

			for(var i=0;i<arr.length;i++){

				if(arr[i].f_ParentItemID == value){

					energyTypeArr.push(arr[i]);

					ztreeDataFilter(arr,energyTypeArr[energyTypeArr.length-1].f_EnergyItemID);

				}

			}

		}

		for(var i=0;i<energyTypeArr.length;i++){
			if (i==0) {
				var isChecked = true;
			}else{
				var isChecked = false;
			}
			zNodes.push({ id:energyTypeArr[i].f_EnergyItemID, pId:energyTypeArr[i].f_ParentItemID, title:energyTypeArr[i].f_EnergyItemName,name:energyTypeArr[i].f_EnergyItemName,open:true,checked:isChecked})
		}

		treeObj = $.fn.zTree.init($("#energyConsumption"), setting, zNodes);

	}


	//首先将sessionStorage的内容写入html中
	function getSessionStoragePointer(){

		var jsonText1=sessionStorage.getItem('pointers');

		var htmlTxet1 = JSON.parse(jsonText1);

		if(htmlTxet1){

			//楼宇树
			pointerObj = _getPointerZtree($("#allPointer"),1);

		}


	}

	//获取当前选中的时间维度（日、周、月、年）
	function dataType(){

		var dataType = $('.types').val();

		_ajaxDataType = dataType;

	}

	//条件查询
	function conditionalSearch(){

		//获取楼宇id
		var pts = pointerObj.getSelectedPointers();

		var arr = [];

		for(var i=0;i<pts.length;i++){

			arr.push(pts[i].pointerID);

		}

		//获取时间维度
		var Ttype = $('.time-options-1').html();

		//获取开始结束时间

		var st = '';

		var et = '';

		if(Ttype == '日'){

			_ajaxDataType_1 = '小时';

			st = $('#datetimepicker').val();

			et = moment($('#datetimepicker').val()).add(1,'d').format('YYYY-MM-DD');


		}else if(Ttype == '周'){

			_ajaxDataType_1 = '日';

			st = $('#datetimepicker').val();

			et = moment($('#datetimepicker1').val()).add(1,'d').format('YYYY-MM-DD');

		}else if(Ttype == '月'){

			_ajaxDataType_1 = '日';

			st = moment($('#datetimepicker').val()).startOf('month').format('YYYY-MM-DD');

			et = moment($('#datetimepicker').val()).endOf('month').add(1,'d').format('YYYY-MM-DD');

		}else if(Ttype == '年'){

			_ajaxDataType_1 = '月';

			st = moment($('#datetimepicker').val()).startOf('year').format('YYYY-MM-DD');

			et = moment($('#datetimepicker').val()).endOf('year').add(1,'d').format('YYYY-MM-DD');

		}else if(Ttype == '自定义'){

			_ajaxDataType_1 = '自定义';

			st = $('#datetimepicker').val();

			et = moment($('#datetimepicker1').val()).add(1,'d').format('YYYY-MM-DD');

		}

		var ecTypeId = '';

		if(treeObj.getCheckedNodes()[0]){

			ecTypeId = treeObj.getCheckedNodes()[0].id;

		}else{

			ecTypeId = '';

		}

		var prm = {

			//取分项Id
			ecTypeId:ecTypeId,

			//楼宇id
			//pointerIds:pts[0].pointerID,

			pointerIds:arr,

			//开始时间
			startTime:st,

			//结束时间
			endTime:et,

			//时间颗粒度
			dateType:_ajaxDataType_1

		}

		$.ajax({

			type:'post',
			url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
			data:prm,
			beforeSend:function(){

				myChart.showLoading({

					text:'获取数据中',

					effect:'whirling'

				});
			},
			complete:function(){

				myChart.hideLoading();

			},
			timeout:30000,
			success:function(result){

				if(result.length>0){

					//横坐标、纵坐标
					var dataX = [],dataY = [];

					if(Ttype == '周'){

						for(var i=0;i<result.length;i++){

							var dates = result[i].dataDate.split('T')[0];

							//dataX.push(NumTransformCh(moment(dates).day()));

							dataX.push(dates);

						}

					}else if(Ttype == '日'){

						for(var i=0;i<result.length;i++){

							var dates = result[i].dataDate;

							dataX.push(dates.split('T')[1].slice(0,5));

						}


					}else{

						for(var i=0;i<result.length;i++){

							var dates = result[i].dataDate;

							dataX.push(dates.split('T')[0]);

						}


					}


					for(var i=0;i<result.length;i++){

						var　datas = result[i].data;

						dataY.push(datas.toFixed(2));

					}

					//赋值
					option.xAxis.data = dataX;

					option.series[0] = {

						data:dataY,

						type: 'line'

					}

					myChart.setOption(option,true);

					//表格

					//最大
					var maxData = _.max(result,function(d){return d.data});

					//最小
					var minData = _.min(result,function(d){return d.data});

					//峰值
					var maxVal = maxData.data.toFixed(2);

					//峰值时间
					var maxTime = maxData.dataDate;

					//谷值
					var minVal = minData.data.toFixed(2);

					//谷值时间
					var minTime = minData.dataDate;

					//累加
					var totalNum = 0;

					for(var i=0;i<result.length;i++){

						totalNum += Number(result[i].data);

					}

					//平均值
					var averageVal = totalNum/result.length;

					//显示时间

					var objStr = '';

					if(Ttype == '日' || Ttype == '月' || Ttype == '年' ){

						objStr = $('#datetimepicker').val();

					}else if(Ttype == '周'|| Ttype == '自定义'){

						objStr = $('#datetimepicker').val() + '到' + $('#datetimepicker1').val();

					}

					//插入值
					$('#tbody').append('<tr><td>'+ objStr +'</td><td>'+unitConversion(totalNum)
						+'</td><td>'+unitConversion(maxVal)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
						+'</td><td>'+unitConversion(minVal)+'</td><td>'+minTime.replace("T"," ").substr(0,minTime.length -3)
						+'</td><td>'+unitConversion(averageVal)+'</td></tr>')



				}

			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {


				if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

					_moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'超时', '');

				}else{

					var errorTip = JSON.parse(XMLHttpRequest.responseText).message;

					_moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,errorTip, '');

					if(errorTip == '没有数据'){

						//赋值
						option.xAxis.data = [];

						option.series[0] = {

							data:[],

							type: 'line'

						}


						myChart.setOption(option);

					}
				}

			}

		})

	}

	//根据日期转换为周几
	function NumTransformCh(num){

		if(num == 1){

			return '周一'

		}else if( num == 2 ){

			return '周二'

		}else if( num == 3 ){

			return '周三'

		}else if( num == 4 ){

			return '周四'

		}else if( num == 5 ){

			return '周五'

		}else if( num == 6 ){

			return '周六'

		}else if( num == 0 ){

			return '周日'

		}

	}

	//表格单位转换
	function unitConversion(num){

		num = Number(num);

		if(num>10000){
			num= num/10000;
			num=num.toFixed(2);
			var num_=num + '万';

			return num_;
		}else{
			return num.toFixed(2);
		}
	}

	//根据当前选择的能耗类型设置页面信息
	function setEnergyInfos(){

		var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));

		if(jsonText){

			for(var i=0;i<jsonText.alltypes.length;i++){

				if(jsonText.alltypes[i].etid == _energyTypeValue){

					$('#th0').html('对比对象');

					$('.ths').html('出现时刻');

					$('#th1').html('累计用' + jsonText.alltypes[i].etname + '量' + jsonText.alltypes[i].etunit);

					$('#th2').html('用' + jsonText.alltypes[i].etname + '峰值' + jsonText.alltypes[i].etunit);

					$('#th3').html('用' + jsonText.alltypes[i].etname + '谷值' + jsonText.alltypes[i].etunit);

					$('#th4').html('用' + jsonText.alltypes[i].etname + '平均值' + jsonText.alltypes[i].etunit);

					$('.header-right-lists').html('单位：' + jsonText.alltypes[i].etunit);

					$('.right-header span').html('用' + jsonText.alltypes[i].etname + '曲线');

					//获取对象选择
					//getCheckedNodes
					//楼宇树
					var treeObj = $.fn.zTree.getZTreeObj('allPointer');

					var pts = treeObj.getCheckedNodes(true);

					//分项树
					var treeBranch = $.fn.zTree.getZTreeObj('energyConsumption');

					var branchs = treeBranch.getCheckedNodes(true);

					//显示时间

					var objStr = '';

					var Ttype = $('.time-options-1').html();

					if(Ttype == '日' || Ttype == '月' || Ttype == '年' ){

						objStr = $('#datetimepicker').val();

					}else if(Ttype == '周'|| Ttype == '自定义'){

						objStr = $('#datetimepicker').val() + '到' + $('#datetimepicker1').val();

					}

					var pointerStr = '';

					if(pts.length == 0){

						pointerStr = '';

					}else{

						pointerStr = pts[0].name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

					}

					var branchStr = '';

					if(branchs.length == 0){

						branchStr = '';

					}else{

						branchStr = branchs[0].name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

					}

					var energyStr = jsonText.alltypes[i].etname + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

					var htmlStr = energyStr + pointerStr + branchStr + objStr;

					$('.header-one').html(htmlStr);
				}
			}
		}
	}

	//时间插件初始化
	function timeYMDComponentsFun(el){

		el.datepicker({
			language:  'zh-CN',
			todayBtn: 1,
			todayHighlight: 1,
			format: 'yyyy-mm-dd',
			forceParse: 0,
			autoclose: 1
		});
	}

	//获取能耗值
	function _getEcTypeNum(){
		var aaa =[];
		var jsonText = JSON.parse(sessionStorage.getItem('allEnergyType'));
		if(jsonText){
			for(var i=0;i<jsonText.alltypes.length;i++){
				aaa.push(jsonText.alltypes[i].ettype);
			}
			var el = aaa[$('.selectedEnergy').index()];
			return el;
		}
	}



})