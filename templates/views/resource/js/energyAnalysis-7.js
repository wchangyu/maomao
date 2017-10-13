$(function(){
	//选中的能耗种类（楼宇传的id）
	var  _ajaxEcType = '';

	//选中科室种类（科室传的文本）
	var _ajaxEcTypeWord = '';

	//日期选择维度
	_ajaxDataType = '年';

	//读取能耗种类
	_getEcType('initPointers');

	//读取能耗种类
	//_getEcType('initOffices');

	//默认选中能耗种类(id)
	_ajaxEcType = _getEcTypeValue();

	//默认选中能耗种类(文本)
	_ajaxEcTypeWord = _getEcTypeWord();

	//楼宇ztree树
	var _pointerZtree = _getPointerZtree($("#allPointer"));

	//科室ztree树
	var _officeZtree = _getOfficeZtree($("#allOffices"));

	//楼宇搜索功能
	_searchPO($(".tipess"),"allPointer",$(".tipes"),"allOffices");

	//开始时间

	//日历
	_initDate();

	$('#datetimepicker').on('changeDate',function(e){
		var values = $('#datetimepicker').val();
		$('.datetimepickereType').html(values);
	});

	//开始时间
	var startTime = moment().startOf('year').format('YYYY-MM-DD');

	//var endTime = moment().endOf('year').format('YYYY-MM-DD');

	$('.datetimepickereType').html(startTime);

	//初始化echarts
	var monthChart = echarts.init(document.getElementById('rheader-content-45'));

	var weekChart = echarts.init(document.getElementById('rheader-content-46'));

	option = {
		tooltip : {
			trigger: 'axis'
		},
		legend: {
			data:['用电量']
		},
		toolbox: {
			show : true,
			feature : {
				dataView : {show: true, readOnly: false},
				magicType : {show: true, type: ['line', 'bar']},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		calculable : true,
		xAxis : [
			{
				type : 'category',
				data : []
			}
		],
		yAxis : [
			{
				type : 'value',
			}
		],
		series : [
			{
				name:'用电量',
				type:'bar',
				data:[],
				barMaxWidth: '60',
				itemStyle: {
					normal: {

						color:'#ed7f7e'
					},
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			},
			{
				name:'用电趋势',
				type:'line',
				data:[]
			}
		]
	};

	//每次选中的能耗种类(id)
	_ajaxEcType =_getEcTypeValue();

	getPointerData();

	/*---------------------------------------------------buttonFun--------------------------------------*/
	//查询按钮
	$('.buttons').children('.btn-success').click(function(){

		//每次选中的能耗种类(id)
		_ajaxEcType =_getEcTypeValue();

		//每次选中的能耗种类（文本）
		_ajaxEcTypeWord = _getEcTypeWord();

		//getPointerData();
		var o = $('.tree-2').css('display');
		if(o == 'none'){
			//console.log('楼宇');
			getPointerData();
		}else{
			//console.log('科室');
			getOfficeData();
		}
	})

	//tab切换
	$('.left-middle-tab').click(function(){
		$('.tree-1').hide();
		$('.tree-1').eq($(this).index()).show();
		if($(this).index() == 0){
			_getEcType('initPointers');
		}else if ($(this).index() == 1){
			_getEcType('initOffices');
		}
	})

	//逐12月逐52周
	$('.top-header-lists').click(function(){
		$('.top-header-lists').removeClass('top-header-listss');
		$(this).addClass('top-header-listss');
		$('.rheader-contents').css({'z-index':1,'background':'#ffffff'});
		$('.rheader-contents').eq($(this).index()).css({'z-index':2,'background':'#ffffff'});
	})

	//楼宇数据
	function getPointerData(){
		//获取楼宇id
		var pts = _pointerZtree.getSelectedPointers(),pointerNames;
		var pointerIDs = [];
		if(pts.length>0) {
			for(var i=0;i<pts.length;i++){
				pointerIDs.push(pts[i].pointerID);
			}
		};
		if(!pointerIDs) { return; };
		//获取选中节点
		pointerNames = checkNode1('allPointer')[0].name;
		var prm = {
			ecTypeId:_ajaxEcType,
			pointerIds:pointerIDs,
			startTime:$('.datetimepickereType').html()
		}
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'EcDatas/GetEnergyTrendencyData',
			data:prm,
			timeout:30000,
			success:function(result){
				//console.log(result);
				//修改标题
				$('.header-one').html(_ajaxEcTypeWord);
				$('.header-two').html(pointerNames);
				//处理数据
				var dataMX = [];
				var dataMY = [];
				for(var i=0;i<result.monthDatas.length;i++){
					dataMX.push(result.monthDatas[i].dataDate.split('T')[0]);
					var data = result.monthDatas[i].data;
					dataMY.push(data.toFixed(2));
				}
				var dataWX = [];
				var dataWY = [];
				for(var i=0;i<result.weekDatas.length;i++){
					dataWX.push(result.weekDatas[i].dataDate.split('T')[0]);
					var data = result.weekDatas[i].data;
					dataWY.push(data.toFixed(2));
				}
				//echart12个月
				option.xAxis[0].data = dataMX;
				option.series[0].data = dataMY;
				option.series[1].data = dataMY;
				console.log(option.series[0].data);
				monthChart.setOption(option);
				//echart52周
				option.xAxis[0].data = dataWX;
				option.series[0].data = dataWY;
				option.series[1].data = dataWY;
				console.log(option.series[0].data);
				weekChart.setOption(option);

			},
			error:function(jqXHR, textStatus, errorThrown){
				console.log(JSON.parse(jqXHR.responseText).message);
			}
		})
	}

	//获取选中的节点
	function checkNode1(id){
		var treeObj=$.fn.zTree.getZTreeObj(id);
		var nodes=treeObj.getCheckedNodes(true);
		return nodes
	}

	//科室数据
	function getOfficeData(){
		//获取科室id
		var ofs = _officeZtree.getSelectedOffices(),officeNames;
		var officeIDs = [];
		if(ofs.length>0) {
			for(var i=0;i<ofs.length;i++){
				officeIDs.push(ofs[i].f_OfficeID);
			}
		};
		officeNames = checkNode1('allOffices')[0].f_OfficeName;
		if(!officeIDs){ return; }
		var ecParams = {
			ecTypeId:_ajaxEcTypeWord,
			officeId:officeIDs,
			startTime:$('.datetimepickereType').html(),
			pointerId:-1
		}
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'EcDatas/GetEnergyTrendencyData',
			data:ecParams,
			timeout:30000,
			success:function(result){
				//修改标题
				$('.header-one').html(_ajaxEcTypeWord);
				$('.header-two').html(officeNames);
				//处理数据
				var dataMX = [];
				var dataMY = [];
				for(var i=0;i<result.monthDatas.length;i++){
					dataMX.push(result.monthDatas[i].dataDate.split('T')[0]);
					var data = result.monthDatas[i].data;
					dataMY.push(data.toFixed(2));
				}
				var dataWX = [];
				var dataWY = [];
				for(var i=0;i<result.weekDatas.length;i++){
					dataWX.push(result.weekDatas[i].dataDate.split('T')[0]);
					var data = result.weekDatas[i].data;
					dataWY.push(data.toFixed(2));
				}
				//echart12个月
				option.xAxis[0].data = dataMX;
				option.series[0].data = dataMY;
				option.series[1].data = dataMY;
				monthChart.setOption(option);
				//echart52周
				option.xAxis[0].data = dataWX;
				option.series[0].data = dataWY;
				option.series[1].data = dataWY;
				weekChart.setOption(option);

			},
			error:function(jqXHR, textStatus, errorThrown){
				console.log(JSON.parse(jqXHR.responseText).message);
			}
		})
	}

})