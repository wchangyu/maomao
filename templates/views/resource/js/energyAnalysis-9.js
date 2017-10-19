$(function(){
	var _timeArr = [];
	/*------------------------------------能耗类型------------------------------------*/

	//记录能耗种类
	var _ajaxEcType = '';

	//记录能耗种类名称
	var _ajaxEcTypeWord = '';

	//楼宇能耗种类
	_getEcType('initPointers');

	//默认能耗种类（楼宇）
	_ajaxEcType =_getEcTypeValue();

	/*--------------------------------------ztree树-----------------------------------*/

	//楼宇ztree树
	var _pointerZtree = _getPointerZtree($('#allPointer'),1);

	//科室ztree树
	var _officeZtree = _getOfficeZtree($("#allOffices"),1);

	//楼宇搜索功能
	_searchPO($(".tipess"),"allPointer",$(".tipes"),"allOffices");

	/*--------------------------------------echarts图--------------------------------*/

	myChart = echarts.init(document.getElementById('rheader-content-14'));

	option = {
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

	/*--------------------------------------时间-------------------------------------*/

	//时间维度；
	var _ajaxDataType_1 = '小时';

	//实际时间
	var timeDemo = moment().format('YYYY-MM-DD');

	var str = '<div class="timeSelect">' + timeDemo + ' 到 ' + timeDemo + '</div>';

	$('.time-block').empty().append(str);

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

		var inputValue = $('#datetimepicker').val();

		var now,st,et,str,str1;

		var isExist = false;

		if(_ajaxDataType == '日'){
			//显示时间
			now = moment(inputValue).startOf('day');

			st = now.format('YYYY-MM-DD');

			et = now.format('YYYY-MM-DD');

			_ajaxDataType_1 = '小时';

		}else if(_ajaxDataType == '周'){
			now = moment(inputValue).startOf('week').format('YYYY-MM-DD');

			var sunday = moment(inputValue).format('YYYY-MM-DD');

			st = '';

			et = '';

			//周日归上一周
			if( now == sunday ){

				st = moment(inputValue).subtract(1,'d').startOf('week').add(1,'d').format('YYYY-MM-DD');

				et = moment(inputValue).subtract(1,'d').startOf('week').add(7,'d').format('YYYY-MM-DD');

			}else{
				st = moment(inputValue).startOf('week').add(1,'d').format('YYYY-MM-DD');

				et = moment(inputValue).startOf('week').add(7,'d').format('YYYY-MM-DD');
			}

			_ajaxDataType_1 = '日';

		}else if(_ajaxDataType == '月'){

			now = moment(inputValue).startOf('month');

			st = now.format('YYYY-MM-DD');

			et = moment(inputValue).endOf('month').format('YYYY-MM-DD');

			_ajaxDataType_1 = '日';

		}else if(_ajaxDataType == '年'){

			now = moment(inputValue).startOf('year');

			st = now.format('YYYY-MM-DD');

			et = moment(inputValue).endOf('year').format('YYYY-MM-DD');

			_ajaxDataType_1 = '日';
		}

		str = '<div class="timeSelect">' + st + ' 到 ' + et + '</div>';

		str1 = st + ' 到 ' + et;

		var chs = $('.time-block').children();

		var arr = [];

		for(var i=0;i<chs.length;i++){
			arr.push(chs.eq(i).html());
		}

		for(var i=0;i<arr.length;i++){

			if(arr[i] == str1){
				isExist = true;
				break
			}
		}

		if(!isExist){
			$('.time-block').append(str);
		}

	});

	//页面加载默认时间
	var showSt = moment().subtract(1,'d').format("YYYY-MM-DD");

	var showEt = moment().subtract(1,'d').format("YYYY-MM-DD");

	$('.datetimeStart').html(showSt);

	$('.datetimeEnd').html(showEt);

	getPointerData();

	setEnergyInfos();

	/*-----------------------------------------按钮方法-------------------------------*/

	//查询
	$('#selected').click(function() {

		//确定时间
		var chs = $('.time-block').children();

		_timeArr.length = 0;

		for(var i=0;i<chs.length;i++){
			_timeArr.push(chs.eq(i).html());
		}

		//清空表格，初始化echarts
		$('#tbody').empty();
		myChart = echarts.init(document.getElementById('rheader-content-14'));

		//配置信息
		setEnergyInfos()

		//确定加载哪个数据
		var p = $('.tree-3').css('display');

		if (p == 'none') {
			_ajaxEcTypeWord = _getEcTypeWord();

			getOfficeData();
		} else {
			_ajaxEcType =_getEcTypeValue();

			getPointerData();
		}

	})

	//去掉已选中的时间
	$('.time-block').on('click','.timeSelect',function(){
		$(this).remove();
	})

	//select选择
	$('.types').change(function(){
		$('.time-block').empty();
	})

	/*------------------------------------------其他方法-------------------------------*/
	//楼宇数据
	function getPointerData(){
		//定义变量
		var allBranch=[];
		var dataX=[];
		var dataXx=[];
		var dataY=[];
		var maxArr_1=0;
		var minArr_1=0;
		var maxTime;
		var minTime;
		var _totalY=0;
		var average=0;
		var nowTime = '';

		//获取选中的id
		var pts = _pointerZtree.getSelectedPointers(),pointerID = [],pointerNames = [];

		if(pts.length>0) {
			for(var i=0;i<pts.length;i++){
				pointerID.push(pts[i].pointerID);
			}
		}

		pointerNames.push(pts[0].pointerName);

		for(var i=0;i<_timeArr.length;i++){

			var st = _timeArr[i].split(' 到 ')[0].replace(/-/g, "/");

			var endTime = moment(_timeArr[i].split(' 到 ')[1]).add(1,'d').format('YYYY-MM-DD');

			var et = endTime.replace(/-/g, "/");

			var prm = {
				ecTypeId:_ajaxEcType,
				pointerIds:pointerID,
				startTime:st,
				endTime:et,
				dateType:_ajaxDataType_1
			}

			var lengths = null;
			$.ajax({
				type:'post',
				url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
				data:prm,
				beforeSend:function(){
					myChart.showLoading({
						text:'获取数据中',
						effect:'whirling'
					})
				},
				success:function(result){
					myChart.hideLoading();
					allBranch = [];
					allBranch.push(result);
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
							//确定时间
							var legendName = result[0].dataDate.split('T')[0];
							for(var i=0;i<_timeArr.length;i++){
								if(_timeArr[i].indexOf(legendName)>=0){
									nowTime = _timeArr[i];
								}
							}
							//y轴数据
							object = {};
							object.name = nowTime;
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
							//确定时间
							var legendName = result[0].dataDate.split('T')[0];
							for(var i=0;i<_timeArr.length;i++){
								if(_timeArr[i].indexOf(legendName)>=0){
									nowTime = _timeArr[i];
								}
							}
							//y轴数据
							object = {};
							object.name=nowTime;
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
							//确定时间
							var legendName = result[0].dataDate.split('T')[0];
							for(var i=0;i<_timeArr.length;i++){
								if(_timeArr[i].indexOf(legendName)>=0){
									nowTime = _timeArr[i];
								}
							}
							//y周数据
							object = {};
							object.name = nowTime;
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
						$('#tbody').append('<tr><td>'+nowTime+'</td><td>'+unitConversion(_totalY)
							+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
							+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
							+'</td><td>'+unitConversion(average)+'</td></tr>');
						option.legend.data = _timeArr;
						option.xAxis.data = dataX;
						option.series = dataY;
						myChart.setOption(option);
						myChart.hideLoading();
					}
				},
				error:function(jqXHR, textStatus, errorThrown){
					console.log(JSON.parse(jqXHR.responseText).message);
					if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
						console.log('没有数据');
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
		//定义变量
		var allBranch=[];
		var dataX=[];
		var dataXx=[];
		var dataY=[];
		var maxArr_1=0;
		var minArr_1=0;
		var maxTime;
		var minTime;
		var _totalY=0;
		var average=0;
		var nowTime = '';

		//获取选中的id
		var ofs = _officeZtree.getSelectedOffices(),officeID = [],officeNames = [];

		if(ofs.length>0) {
			for(var i=0;i<ofs.length;i++){
				officeID.push(ofs[i].f_OfficeID);
			}
		}

		officeNames.push(ofs[0].f_OfficeID);

		for(var i=0;i<_timeArr.length;i++){

			var st = _timeArr[i].split(' 到 ')[0].replace(/-/g, "/");

			var endTime = moment(_timeArr[i].split(' 到 ')[1]).add(1,'d').format('YYYY-MM-DD');

			var et = endTime.replace(/-/g, "/");

			var prm = {
				ecTypeId:_ajaxEcTypeWord,
				officeId:officeID,
				startTime:st,
				endTime:et,
				dateType:_ajaxDataType_1
			}

			var lengths = null;
			$.ajax({
				type:'post',
				url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
				data:prm,
				beforeSend:function(){
					myChart.showLoading({
						text:'获取数据中',
						effect:'whirling'
					})
				},
				success:function(result){
					myChart.hideLoading();
					allBranch = [];
					allBranch.push(result);
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
							//确定时间
							var legendName = result[0].dataDate.split('T')[0];
							for(var i=0;i<_timeArr.length;i++){
								if(_timeArr[i].indexOf(legendName)>=0){
									nowTime = _timeArr[i];
								}
							}
							//y轴数据
							object = {};
							object.name = nowTime;
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
							//确定时间
							var legendName = result[0].dataDate.split('T')[0];
							for(var i=0;i<_timeArr.length;i++){
								if(_timeArr[i].indexOf(legendName)>=0){
									nowTime = _timeArr[i];
								}
							}
							//y轴数据
							object = {};
							object.name=nowTime;
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
							//确定时间
							var legendName = result[0].dataDate.split('T')[0];
							for(var i=0;i<_timeArr.length;i++){
								if(_timeArr[i].indexOf(legendName)>=0){
									nowTime = _timeArr[i];
								}
							}
							//y周数据
							object = {};
							object.name = nowTime;
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
						$('#tbody').append('<tr><td>'+nowTime+'</td><td>'+unitConversion(_totalY)
							+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)
							+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,maxTime.length -3)
							+'</td><td>'+unitConversion(average)+'</td></tr>');
						option.legend.data = _timeArr;
						option.xAxis.data = dataX;
						option.series = dataY;
						myChart.setOption(option);
						myChart.hideLoading();
					}
				},
				error:function(jqXHR, textStatus, errorThrown){
					console.log(JSON.parse(jqXHR.responseText).message);
					if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
						console.log('没有数据');
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
		if(jsonText){
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

	}
})
