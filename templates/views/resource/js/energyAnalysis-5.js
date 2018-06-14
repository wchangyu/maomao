$(function() {

	/*-------------------------------------------------日期插件-----------------------------------------------------*/
	//选择日期
	//_dataComponentsFun($('#datetimepicker1'));
	_timeYMDComponentsFun($('#datetimepicker1'));

	//选择具体时间
	_timeComponentsFun($('.datepicker1'));

	$('#st').val('05:00');

	$('#et').val(moment().format('23:59'));

	$('.switch').css({
		'color':'white'
	});

	/*-------------------------------------------------能耗种类-----------------------------------------------------*/

	//选中的能耗种类id
	var _energyTypeValue = '';

	//选中能耗种类名称
	var _energyTypeWord = '';

	//能耗种类
	var _energyTypeSel = new ETSelection();

	_energyTypeSel.initPointers($(".energy-types"), undefined, function () {

		_energyTypeValue = _getEcTypeValue();

		_energyTypeWord = _getEcTypeWord();

	});

	//确定能耗种类
	_energyTypeValue = _getEcTypeValue();

	_energyTypeWord = _getEcTypeWord();

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
	key.bind("focus", focusKey($('#key')));
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

	var lastValue = '', nodeList = [];

	function searchNode(e) {

		//获取树
		var zTree = $.fn.zTree.getZTreeObj("energyConsumption");

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
			zTree.showNodes(zTree.transformToArray(zTree.getNodes()));

			return;
		}
		//getNodesByParamFuzzy:根据节点数据的属性搜索，获取条件模糊匹配
		// 的节点数据 JSON 对象集合
		nodeList = zTree.getNodesByParamFuzzy(keyType, value);

		nodeList = zTree.transformToArray(nodeList);

		if (nodeList == '') {

			$('.tipes').html('抱歉，没有您想要的结果').show();

		} else {

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

		for (var n in nodeList) {

			findParent(zTree, nodeList[n]);

		}

		zTree.showNodes(nodeList);
	}

	//确定父子关系
	function findParent(zTree, node) {

		//展开符合搜索条件的节点
		//展开 / 折叠 指定的节点
		zTree.expandNode(node, true, false, false);

		if (typeof node == 'object') {

			//pNode父节点
			var pNode = node.getParentNode();

		}

		if (pNode != null) {

			nodeList.push(pNode);

			findParent(zTree, pNode);
		}
	}

	//楼宇搜索功能
	var objSearchs = new ObjectSearch();

	objSearchs.initPointerSearch($("#keys"), $(".tipess"), "allPointer");

	/*----------------------------------------------------echart------------------------------------------------------*/
	//用电分布
	var electricCharts = echarts.init(document.getElementById('rheader-content-41'));

	var electricOption = {

		tooltip:{
			trigger:'axis',
			axisPointer:{
					type:'shadow'
			},
			formatter:function (params) {
				var tar = params[1];
				var tars = params[0];
				return tar.name + '<br/>' + tar.seriesName + '  ' + tar.value + '<br/>' + tars.seriesName + '  ' + tars.value;
			}
		},
		toolbox:{
			show:true,
			feature:{
				mark:{show:true},
				dataView:{show:true, readOnly:false},
				restore:{show:true},
				saveAsImage:{show:true}
			}
		},
		grid:{
			left:'3%',
			right:'4%',
			bottom:'3%',
			containLabel:true
		},
		xAxis:{
			type:'category',
			splitLine:{show:false},
			data:[]
		},
		yAxis:{
			type:'value'
		},
		series:[
			{
				name:'空闲',
				type:'bar',
				stack:'总量',
				label:{
					normal:{
						show:true,
						position:'inside'
					}
				},
				itemStyle:{
					normal:{
						color:'#afc8de'
					},
					emphasis:{
						barBorderColor:'rgba(0,0,0,0.5)',
						color:'#afc8de'
					}
				},
				data:[],
				barMaxWidth:'60',
			},
			{
				name:'工作',
				type:'bar',
				stack:'总量',
				label:{
					normal:{
						show:true,
						position:'inside'
					}
				},
				itemStyle:{
					normal:{
						color:'#9dc541'
					},
					emphasis:{
						barBorderColor:'rgba(0,0,0,0.5)',
						color:'#9dc541'
					}
				},
				data:[],
				barMaxWidth:'100',
			}
		]
	}

	//昼夜分析
	var dayNightCharts = echarts.init(document.getElementById('rheader-content-42'));

	var dayNightOption = {
		tooltip : {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend:{
			orient:'vertical',
			left:'left',
			data:['开站时段','闭站时段']
		},
		toolbox:{
			show:true,
			feature:{
				mark:{show:true},
				dataView:{show:true, readOnly:false},
				magicType:{
					show:true,
					type:['pie', 'funnel']
				},
				restore:{show:true},
				saveAsImage:{show:true}
			}
		},
		series:[
			{
				name:'',
				type:'pie',
				radius:'55%',
				center:['50%', '60%'],
				data:[
					{value:'', name:'开站时段'},
					{value:'', name:'闭站时段'}
				],
				itemStyle:{
					normal:{
						color:function(params) {

							var colorList = [
								'#9dc541','#afc8de'
							];
							return colorList[params.dataIndex]
						}
					},
					emphasis:{
						shadowBlur:10,
						shadowOffsetX:0,
						shadowColor:'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	};

	//默认加载
	setEnergyInfos();

	conditionalSearch();

	/*-----------------------------------------------------按钮事件----------------------------------------------------*/

	//查询
	$('.buttons').find('.btn-success').click(function () {

		//echarts初始化
		echarts.init(document.getElementById('rheader-content-41'));

		echarts.init(document.getElementById('rheader-content-42'));

		//单位配置
		setEnergyInfos()

		conditionalSearch();

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

	/*-----------------------------------------------------其他方法-----------------------------------------------------*/

	//ztree树设置
	function getBranchZtree() {

		//json数据
		var EnItdata = JSON.parse(sessionStorage.getItem('energyItems'));

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
				showTitle: true
			},
			callback: {
				onClick: function (event, treeId, treeNode) {
					treeObj.checkNode(treeNode, !treeNode.checked, true)
				}
			}
		};

		var zNodes = [];

		//根据能耗种类过滤数据
		var energyTypeArr = [];

		for (var i = 0; i < EnItdata.length; i++) {

			if (EnItdata[i].energyItemType == _energyTypeWord) {

				energyTypeArr.push(EnItdata[i]);

			}

		}

		for (var i = 0; i < energyTypeArr.length; i++) {
			if (i == 0) {
				var isChecked = true;
			} else {
				var isChecked = false;
			}
			zNodes.push({
				id: energyTypeArr[i].f_EnergyItemID,
				pId: energyTypeArr[i].f_ParentItemID,
				title: energyTypeArr[i].f_EnergyItemName,
				name: energyTypeArr[i].f_EnergyItemName,
				open: true,
				checked: isChecked
			})
		}

		treeObj = $.fn.zTree.init($("#energyConsumption"), setting, zNodes);

	}

	//首先将sessionStorage的内容写入html中
	function getSessionStoragePointer() {

		var jsonText1 = sessionStorage.getItem('pointers');

		var htmlTxet1 = JSON.parse(jsonText1);

		if (htmlTxet1) {
			//楼宇树
			pointerObj = _getPointerZtree($("#allPointer"), 1);

		}


	}

	//条件查询
	function conditionalSearch() {

		//获取楼宇
		var pts = pointerObj.getSelectedPointers();

		//分项
		var ecTypeId = '';

		if(treeObj.getCheckedNodes()[0]){

			ecTypeId = treeObj.getCheckedNodes()[0].id;

		}else{

			ecTypeId = '';

		}

		//获取开始结束时间

		//获取时间维度
		var Ttype = $('.time-options-1').html();

		var st = '';

		var et = '';

		if(Ttype == '日'){

			st = $('#datetimepicker').val();

			et = moment($('#datetimepicker').val()).add(1,'d').format('YYYY-MM-DD');


		}else if(Ttype == '周'){

			st = $('#datetimepicker').val();

			et = moment($('#datetimepicker1').val()).add(1,'d').format('YYYY-MM-DD');

		}else if(Ttype == '月'){

			st = moment($('#datetimepicker').val()).startOf('month').format('YYYY-MM-DD');

			et = moment($('#datetimepicker').val()).endOf('month').add(1,'d').format('YYYY-MM-DD');

		}else if(Ttype == '年'){

			st = moment($('#datetimepicker').val()).startOf('year').format('YYYY-MM-DD');

			et = moment($('#datetimepicker').val()).endOf('year').add(1,'d').format('YYYY-MM-DD');

		}else if(Ttype == '自定义'){

			st = $('#datetimepicker').val();

			et = moment($('#datetimepicker1').val()).add(1,'d').format('YYYY-MM-DD');

		}

		var prm = {

			//楼宇Id
			pointerId: pts[0].pointerID,
			//开始时间
			startTime: st,
			//结束时间
			endTime: et,
			//工作开始时间
			wsTime: $('#st').val(),
			//工作结束时间
			weTime: $('#et').val(),
			//能耗类型
			energyItemType: ecTypeId

		}

		$.ajax({

			type:'post',

			url:_urls + 'EcDatas/GetWRData',

			data:prm,

			beforeSend:function(){

				dayNightCharts.showLoading({

					text:'获取数据中',

					effect:'whirling'

				});

				electricCharts.showLoading({

					text:'获取数据中',

					effect:'whirling'

				});

			},

			complete:function(){

				dayNightCharts.hideLoading();

				electricCharts.hideLoading();

			},

			success:function(result){

				//横坐标
				var dataX = [];

				//纵坐标
				//工作用电
				var workDataY = [];
				//休息用电
				var restDataY = [];
				//工作总用电
				var workDataTotal = 0;
				//休息总用电
				var restDataTotal = 0;
				//将工作日和休息日分开
				var workArr = [];
				//休息日
				var restArr = [];

				for(var i=0;i<result.length;i++){

					dataX.push(result[i].dataDate.split('T')[0]);

					workDataY.push(result[i].workTimeData.toFixed(2));

					restDataY.push(result[i].restTimeData.toFixed(2));

					workDataTotal += Number(result[i].workTimeData);

					restDataTotal += Number(result[i].restTimeData);

					var date = result[i].dataDate.split('T')[0];

					if(moment(date).format('d') == 6 || moment(date).format('d') == 0 ){

						restArr.push(result[i]);

					}else{

						workArr.push(result[i]);

					}

				}

				electricOption.xAxis.data = dataX;

				electricOption.series[0].data = restDataY;

				electricOption.series[1].data = workDataY;

				electricCharts.setOption(electricOption);

				dayNightOption.series[0].data[0].value = workDataTotal.toFixed(2);

				dayNightOption.series[0].data[1].value = restDataTotal.toFixed(2);

				dayNightCharts.setOption(dayNightOption);

				//工作日百天用电
				var workDayWork = 0;
				//工作日夜间用电
				var workDayRest = 0;
				//休息日百天用电
				var restDayWork = 0;
				//休息日夜间用电
				var restDayRest = 0;

				for(var i=0;i<workArr.length;i++){

					workDayWork += Number(workArr[i].workTimeData);

					workDayRest += Number(workArr[i].restTimeData);

				}

				for(var i=0;i<restArr.length;i++){

					restDayWork += Number(restArr[i].workTimeData);

					restDayRest += Number(restArr[i].restTimeData);

				}

				var workRatio = 0;

				if( workDayWork == 0 ){

					workRatio = '-'

					$('.proportion1').html('=' + workRatio);

				}else{

					workRatio = Number(workDayRest) / Number(workDayWork);

					$('.proportion1').html('=' + workRatio.toFixed(2));

				}

				var restRatio = 0;

				if( restDayWork == 0 ){

					restRatio = '-';

					$('.proportion2').html('=' + restRatio);

				}else{

					restRatio = Number(restDayRest) / Number(restDayWork);

					$('.proportion2').html('=' + restRatio.toFixed(2));

				}

				//判断工作日和休息日是否有值
				console.log(workArr);

				console.log(restArr);

				$('.content-rightss-one-11').hide();

				if(workArr.length>0){

					$('.content-rightss-one-11').eq(0).show();

				}

				if(restArr.length>0){

					$('.content-rightss-one-11').eq(1).show();

				}


			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {


				if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

					_moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'超时', '');

				}else{

					var errorTip = JSON.parse(XMLHttpRequest.responseText).message;

					_moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,errorTip, '');

					if(errorTip == '没有数据' || errorTip == '没有查询到数据'){

						electricOption.xAxis.data = [];

						electricOption.series[0].data = [];

						electricOption.series[1].data = [];

						electricCharts.setOption(electricOption);

						dayNightOption.series[0].data[0].value = 0;

						dayNightOption.series[0].data[1].value = 0;

						dayNightCharts.setOption(dayNightOption);

						$('.proportion1').html('=' + '-');

						$('.proportion2').html('=' + '-');
					}
				}

			}

		})
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

						objStr = '时间：' + $('#datetimepicker').val() + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

					}else if(Ttype == '周'|| Ttype == '自定义'){

						objStr = '时间：' + $('#datetimepicker').val() + '到' + $('#datetimepicker1').val() + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

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

					//时间段
					var stStr = '时间段：' + $('#st').val() + '&nbsp;到&nbsp;' + $('#et').val();

					var htmlStr = energyStr + pointerStr + branchStr + objStr + stStr;

					$('.header-one').html(htmlStr);
				}
			}
		}
	}
})