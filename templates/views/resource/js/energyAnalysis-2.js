$(function(){
	/*-----------------------------------------能耗类型---------------------------------------*/
	//记录能耗种类
	var _ajaxEcType = '';

	//记录能耗种类名称
	var _ajaxEcTypeWord = '';

	//楼宇能耗种类
	_getEcType('initPointers');

	//默认能耗种类（楼宇）
	_ajaxEcType =_getEcTypeValue();

	/*-------------------------------------------ztree树------------------------------------*/
	//楼宇ztree树
	var _objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),false,true,false,true);

	//科室ztree树
	var _officeZtree = _getOfficeZtree($("#allOffices"),2);

	//楼宇搜索功能
	_searchPO($(".tipess"),"allPointer",$(".tipes"),"allOffices");

	/*----------------------------------------时间插件--------------------------------------*/
	//日历格式初始化
	_initDate();

	var _ajaxDataType;

	function dataType(){
		var dataType;
		dataType = $('.types').val();
		_ajaxDataType = dataType;
	}

	dataType();

	//时间选择
	$('#datetimepicker').on('changeDate',function(e){
		dataType();
		_selectTime(_ajaxDataType);
	});

	//页面加载默认时间
	var showSt = moment().subtract(1,'d').format("YYYY-MM-DD");

	var showEt = moment().subtract(1,'d').format("YYYY-MM-DD");

	$('.datetimeStart').html(showSt);

	$('.datetimeEnd').html(showEt);

	/*-------------------------------------------echarts-----------------------------------------*/
	myChart = echarts.init(document.getElementById('rheader-content-14'));

	option = {
		tooltip: {
			trigger: 'axis'
		},
		legend:{
			data:[]
		},
		xAxis:  {
			type: 'category',
			boundaryGap: false,
			data:[]                   //dataX
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: []                      //dataY
	};

	//配置信息
	setEnergyInfos();

	//页面加载数据
	getPointerData();

	/*--------------------------------------------按钮事件-----------------------------------------*/
	$('#selected').click(function(){
		//表格数据清空
		$('#tbody').empty();

		//echarts图初始化
		myChart = echarts.init(document.getElementById('rheader-content-14'));
		option.xAxis.data = [];
		option.series = [];
		myChart.setOption(option);

		var p = $('#tree-2').css('display');
		if(p != 'none'){
			_ajaxEcType =_getEcTypeValue();
			getPointerData();
		}else{
			_ajaxEcTypeWord = _getEcTypeWord();

			getOfficeData();
		}
		//页面配置信息
		setEnergyInfos();
	})

	//楼宇科室选择
	$('.left-middle-tab').click(function(){
		$('.tree-1').hide();
		$('.tree-1').eq($(this).index()).show();
		if($(this).index() == 0){
			_getEcType('initPointers');
		}else if ($(this).index() == 1){
			_getEcType('initOffices');
		}
	})

	//能耗选择
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	});

	//让echarts自适应
	window.onresize = function () {
		if(myChart){
			myChart.resize();
		}
	}

	/*--------------------------------------------其他方法-----------------------------------------*/
	//楼宇数据
	function getPointerData(){
		//用来存放x轴的数组
		var dataX=[];
		var dataY=[];
		var allBranch=[];
		var _totalY=0;
		var average=0;
		var dataXx=[];
		var pts = _objectSel.getSelectedPointers(),pointerID = [],pointerNames = [];
		if(pts.length>0) {
			for(var i=0;i<pts.length;i++){
				pointerID.push(pts[i].pointerID);
				pointerNames.push(pts[i].pointerName);
			}
		};
		for(var i=0;i<pointerID.length;i++){
			var nums = -1;
			pointerIds = pointerID[i];
			var ecParams={
				'ecTypeId':_ajaxEcType,
				'pointerIds': pointerIds,
				'startTime':_ajaxStartTime_1,
				'endTime':_ajaxEndTime_1,
				'dateType':_ajaxDataType_1
			};
			var lengths = null;
			$.ajax({
				type:'post',
				url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
				data:ecParams,
				async:true,
				beforeSend:function(){
					myChart.showLoading({
						text:'获取数据中',
						effect:'whirling'
					})
				},
				success:function(result){
					myChart.hideLoading();
					allBranch = [];
					nums ++;
					var datas,dataSplits,object,maxData,minData;
					allBranch.push(result);
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
							//y轴数据
							object = {};
							object.name = pointerNames[nums];
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
							object.name=pointerNames[nums];
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
							object.name = pointerNames[nums];
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
						maxTime = maxData.dataDate
						minArr_1 = minData.data;
						minTime = minData.dataDate
						_totalY = 0;
						//总能耗
						for(var x=0;x<object.data.length;x++){
							_totalY+=object.data[x];
						}
						//平均值
						average=_totalY/object.data.length;
						$('#tbody').append('<tr><td>'+pointerNames[nums]+'</td><td>'+unitConversion(_totalY)
							+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
							+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
							+'</td><td>'+unitConversion(average)+'</td></tr>')
						option.legend.data = pointerNames;
						option.xAxis.data = dataX;
						option.series = dataY;
						myChart.setOption(option);
					}
				},
				error:function(jqXHR, textStatus, errorThrown){
					console.log(JSON.parse(jqXHR.responseText).message);
					if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
						option.xAxis.data = [];
						option.series = [];
						myChart.hideLoading();
						myChart.setOption(option);
					}
				}
			})
		}

	}

	//科室数据
	function getOfficeData(){
		//用来存放x轴的数组
		var dataX=[];
		var dataY=[];
		var allBranch=[];
		var _totalY=0;
		var average=0;
		var dataXx=[];
		var ofs = _officeZtree.getSelectedOffices(),officeID = [],officeNames = [];
		for(var i=0;i<ofs.length;i++){
			officeID.push(ofs[i].f_OfficeID);
			officeNames.push(ofs[i].f_OfficeName);
		}
		for(var i=0;i<officeID.length;i++){
			var nums = -1;
			var officeIds=officeID[i];
			var ecParams={
				'ecTypeId':_ajaxEcTypeWord,
				'officeId': officeIds,
				'startTime':_ajaxStartTime_1,
				'endTime':_ajaxEndTime_1,
				'dateType':_ajaxDataType_1
			}
			$.ajax({
				type:'post',
				url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
				data:ecParams,
				async:true,
				success:function(result){
					allBranch = [];
					nums ++;
					var datas,dataSplits,object,maxData,minData;
					allBranch.push(result);
					var lengths = allBranch[0];
					if(lengths.length != null){
						if(_ajaxDataType=='日'){
							//x轴数据
							for(var j=0;j<lengths.length;j++){
								datas = lengths[j];
								dataSplits = datas.dataDate.split('T')[1].slice(0,5);
								if(dataX.indexOf(dataSplits)<0){
									dataX.push(dataSplits);
								}
							}
							//y轴数据
							object = {};
							object.name = officeNames[nums];
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
							object.name=officeNames[nums];
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
							object.name = officeNames[nums];
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
						var maxArr_1 = maxData.data;
						var maxTime = maxData.dataDate
						var minArr_1 = minData.data;
						var minTime = minData.dataDate
						_totalY = 0;
						//总能耗
						for(var x=0;x<object.data.length;x++){
							_totalY+=object.data[x];
						}
						//平均值
						average=_totalY/object.data.length;
						$('#tbody').append('<tr><td>'+officeNames[nums]+'</td><td>'+unitConversion(_totalY)
							+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
							+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
							+'</td><td>'+unitConversion(average)+'</td></tr>')
						option.legend.data = officeNames;
						option.xAxis.data = dataX;
						option.series = dataY;
						myChart.setOption(option);
					}
				},
				error:function(jqXHR, textStatus, errorThrown){
					console.log(JSON.parse(jqXHR.responseText).message);
					if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
						option.xAxis.data = [];
						option.series = [];
						myChart.hideLoading();
						myChart.setOption(option);
					}
				}
			})
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

	//根据当前选择的能耗类型设置页面信息
	function setEnergyInfos(){
		var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
		for(var i=0;i<jsonText.alltypes.length;i++){
			if(jsonText.alltypes[i].etid == _ajaxEcType){
				$('#th0').html('对比对象');
				$('.ths').html('出现时刻');
				$('#th1').html('累计用' + jsonText.alltypes[i].etname + '量' + ' ' + jsonText.alltypes[i].etunit);
				$('#th2').html('用' + jsonText.alltypes[i].etname + '峰值' + ' ' + jsonText.alltypes[i].etunit);
				$('#th3').html('用' + jsonText.alltypes[i].etname + '谷值' + ' ' + jsonText.alltypes[i].etunit);
				$('#th4').html('用' + jsonText.alltypes[i].etname + '平均值' + jsonText.alltypes[i].etunit);
				$('.header-right-lists').html('单位：' + jsonText.alltypes[i].etunit);
				$('.right-header span').html('用' + jsonText.alltypes[i].etname + '曲线');
				$('.header-one').html($('.datetimepickereType').html());
			}
		}
	}

})
//时间维度；
var _ajaxDataType_1 = '小时';
//实际时间
var _ajaxStartTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");;

var _ajaxEndTime_1 = moment().format("YYYY/MM/DD");