$(function(){
	//日期插件
	$('.datetimeStart').html(_ajaxStartTime);
	$('.datetimeEnd').html(_ajaxEndTime);
	$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(_ajaxStartTime_1 +'到'+_ajaxStartTime_1));

	_objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),true);
	_objectSel.initOffices($("#allOffices"));
	//搜索功能科室
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
	//搜索功能（楼宇）
	var objSearchs = new ObjectSearch();
	objSearchs.initPointerSearch($("#keys"),$(".tipess"),"allPointer");
	//日历格式初始化
	_initDate();
	$('#datetimepicker').on('changeDate',function(e){
		dataType();
		_selectTime();
	});
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
		getEcType();
	});
	//对象选择
	$('.left-middle-tab').click(function(){
		$(".left-middle-tab").css({
			"border":"2px solid #7f7f7f",
			"background":"#fff",
			"color":"#333"
		})
		$(this).css({
			"background":"#7f7f7f",
			"border":"2px solid #7f7f7f",
			"color":"#ffffff"
		})
		$('.tree-1').hide();
		$('.tree-1').eq($(this).index()).show();
	})
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	});
	//echarts
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
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
	timeDisposal();
	getSelectedTime();
	getEcType();
	dataType();
	_ajaxGetPointers();
	//页面加载时表头small内容
	var smalls = $('<small>');
	smalls.html(pointerNames);
	$('.page-title').append(smalls);
	setEnergyInfos();
	$('small').html(pointerNames);
	$('.btn').click(function(){
		myChart11 = echarts.init(document.getElementById('rheader-content-14'));
		getEcType();
		$('#tbody').empty();
		getSelectedTime();
		getEcType();
		dataType();
		getEcTypeWord();
		timeDisposal();
		var o=$('.tree-3')[0].style.display;
		if(o == "none"){
			_ajaxGetOffices();
			if($('.page-title').children('small').length){
				$('.page-title').children('small').remove();
			}
			var smalls = $('<small>');
			smalls.html(officeNames);
			$('.page-title').append(smalls);
		}else{
			_ajaxGetPointers();
			if($('.page-title').children('small').length){
				$('.page-title').children('small').remove();
			}
			var smalls = $('<small>');
			smalls.html(pointerNames);
			$('.page-title').append(smalls);
		}
		setEnergyInfos();
	})
	$('body').mouseover(function(){
		if(myChart11){
			myChart11.resize();
		}
	})
})
var _objectSel;
var myChart11;
//让echarts自适应
window.onresize = function () {
	if(myChart11){
		myChart11.resize();
	}
}
//选中的能耗种类
var _ajaxDataType_1='小时';
var _ajaxEcType="01";
function getEcType(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	if(jsonText){
		for(var i=0;i<jsonText.alltypes.length;i++){
			aaa.push(jsonText.alltypes[i].etid)
		}
		_ajaxEcType = aaa[$('.selectedEnergy').index()];
	}

}
//设置getECType的初始值(文字，office时用);
var _ajaxEcTypeWord="电";
function getEcTypeWord(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	if(jsonText){
		for(var i=0;i<jsonText.alltypes.length;i++){
			aaa.push(jsonText.alltypes[i].etname);
		}
		_ajaxEcTypeWord = aaa[$('.selectedEnergy').index()];
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
//获取dataType
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
//设置开始和结束初始值
var _ajaxStartTime=moment().format("YYYY-MM-DD");
var _ajaxEndTime = moment().format("YYYY-MM-DD");
var _ajaxStartTime_1=moment().subtract(1,'d').format("YYYY-MM-DD");
var _ajaxEndTime_1=moment().add(1,'d').format("YYYY-MM-DD");
//选中时间处理
var startsTime=[];
var endsTime=[];
//存放开始，结束的时间
var aaaa=[];
var bbbb=[];
var _ajaxStartA=[];
var _ajaxEndA=[];
var startsTimes=[_ajaxStartTime_1];
var endsTimes=[_ajaxEndTime_1];
var arr=[];
function timeDisposal(){
	aaaa=[];
	bbbb=[];
	startsTime=[_ajaxStartTime_1];
	endsTime=[_ajaxEndTime_1];
	var $selectTime = $('.selectTime');
	for(var i=0;i< $selectTime.length;i++){
		var iSelectTime = $('.selectTime').eq(i).html().split('到')[0].split('-');
		aaaa.push(iSelectTime[0] + '/' + iSelectTime[1] + '/' + iSelectTime[2]);
		var iSelectTimes = $('.selectTime').eq(i).html().split('到')[1].split('-');
		var endDate = moment(iSelectTimes[0] + '/' + iSelectTimes[1] + '/' + iSelectTimes[2]);
		endDate = endDate.add(1,'d');
		bbbb.push(endDate.format("YYYY/MM/DD"));
	}
	_ajaxStartA = aaaa;
	_ajaxEndA = bbbb;
}
//获得pointer数据
var pointerID,pointerNames;
function _ajaxGetPointers(){
	var pts = _objectSel.getSelectedPointers();
	if(pts.length>0) {
		pointerID = pts[0].pointerID;
		pointerNames = pts[0].pointerName
	};
	if(!pointerID) { return; };

	//存放要传的楼宇集合
	var postPointerID = [];

	var treeObj = $.fn.zTree.getZTreeObj(_objectSel._$ulPointers.attr('id'));

	var nodes1 = treeObj.getCheckedNodes(false).concat(treeObj.getCheckedNodes(true));

	if(pointerID == 0){
		$(nodes1).each(function(i,o){

			postPointerID.push(o.pointerID);
		})

		postPointerID.pop();
	}else{
		postPointerID.push(pointerID)
	}

	timeDisposal();
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
	for(var i=0;i<_ajaxStartA.length;i++){
		var nums = -1;
		startsTimess = _ajaxStartA[i];
		endsTimess=_ajaxEndA[i];
		var ecParams={
			'ecTypeId':_ajaxEcType,
			'pointerId':pointerID,
			'pointerIds':postPointerID,
			'startTime':startsTimess,
			'endTime':endsTimess,
			'dateType':_ajaxDataType_1
		}
		var lengths = null;
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
			data:ecParams,
			async:true,
			beforeSend:function(){
				myChart11.showLoading({
					text:'获取数据中',
					effect:'whirling'
				})
			},
			success:function(result){
				myChart11.hideLoading();
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
					option11.legend.data = selectTime;
					option11.xAxis.data = dataX;
					option11.series = dataY;
					myChart11.setOption(option11);

					myChart11.hideLoading();
				}
			},
			error:function(jqXHR, textStatus, errorThrown){
				console.log(JSON.parse(jqXHR.responseText).message);
				if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
					var obj = {};
					obj.data = [];
					dataY.push(obj);
					option11.series = dataY;
					myChart11.hideLoading();
					myChart11.setOption(option11);
				}
			}
		})
	}
}
//获得office数据
var officeID,officeNames;
function _ajaxGetOffices(){
	var ofs = _objectSel.getSelectedOffices();
	if(ofs.length>0) {
		officeID = ofs[0].f_OfficeID;
		officeNames = ofs[0].f_OfficeName;
	};
	if(!officeID){ return; }
	timeDisposal();
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
	for(var i=0;i<_ajaxStartA.length;i++){
		var nums = -1;
		startsTimess = _ajaxStartA[i];
		endsTimess=_ajaxEndA[i];
		var ecParams={
			'ecTypeId':_ajaxEcTypeWord,
			'officeId':officeID,
			'startTime':startsTimess,
			'endTime':endsTimess,
			'dateType':_ajaxDataType_1
		}
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
			data:ecParams,
			async:true,
			beforeSend:function(){
				myChart11.showLoading({
					text:'获取数据中',
					effect:'whirling'
				})
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
					option11.legend.data = selectTime;
					option11.xAxis.data = dataX;
					option11.series = dataY;
					myChart11.setOption(option11);
				}
			},
			error:function(jqXHR, textStatus, errorThrown){
				console.log(JSON.parse(jqXHR.responseText).message);
				if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
					var obj = {};
					obj.data = [];
					dataY.push(obj);
					option11.series = dataY;
					myChart11.hideLoading();
					myChart11.setOption(option11);
				}
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