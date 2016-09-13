$(function (){
	//水电选择
	$(".electricity").click(function(){
		$(this).css({
			"background":"url(./work_parts/img/electricity_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".water").css({
			"background":"url(./work_parts/img/water.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".gas").css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	});
	$(".water").click(function(){
		$(this).css({
			"background":"url(./work_parts/img/water_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".electricity").css({
			"background":"url(./work_parts/img/electricity.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".gas").css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	});
	$(".gas_aa_4").click(function(){
		$(this).css({
			"background":"url(./work_parts/img/gas_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".electricity_aa_4").css({
			"background":"url(./work_parts/img/electricity.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".water_aa_4").css({
			"background":"url(./work_parts/img/water.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	});
	//对象选择
	$('.left-middle-tab').eq(0).click(function(){
		$('.left-middle-tab').css(
			{
				'background':'#fff',
				'color':'#333'
			}
		)
		$(this).css({
			'background':'#7f7f7f',
			'color':'#fff'
		})
		$('.tree-1').hide();
		$('.tree-3').show();

	});
	$('.left-middle-tab').eq(1).click(function(){
		$('.left-middle-tab').css(
			{
				'background':'#fff',
				'color':'#333'
			}
		)
		$(this).css({
			'background':'#7f7f7f',
			'color':'#fff'
		})
		$('.tree-1').hide();
		$('.tree-2').show();
	});
	//读取楼宇和科室的zTree；
	_objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),false,true);
	_objectSel.initOffices($("#allOffices"),true);
	//搜索框功能
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");

	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	})
	//获取能耗种类；
	getEcType();
	//开始结束时间
	startTime();
	endTime();
	getPointerData();
	$('.btns').click(function(){
		$('#tbody').empty();
		//开始结束时间
		startTime();
		endTime;
		var o=$('.tree-3')[0].style.display;
		if( o == 'none'){
			getEcTypeWord();
			getOfficeData();
		}else{
			getEcType();
			getPointerData();
		}
	})
})
var myChart11;
//让echarts自适应
window.onresize = function () {
    myChart11.resize();
}
//设置getEcType的初始值(数值，pointer时用)
var _ajaxEcType;
function getEcType(){
	//首先判断哪个含有selectedEnergy类
	$('.selectedEnergy').attr('value');
	if($('.selectedEnergy').attr('value')==01){
		$('.header-one').html('电');
		$('.right-header span').html('用电曲线');
	}else if($('.selectedEnergy').attr('value')==211){
		$('.header-one').html('水');
		$('.right-header span').html('用水曲线');
	}else if($('.selectedEnergy').attr('value')==311){
		$('.header-one').html('气');
		$('.right-header span').html('用气曲线');
	}
	_ajaxEcType=$('.selectedEnergy').attr('value');
}
//设置getECType的初始值(文字，office时用);
var _ajaxEcTypeWord="电";
function getEcTypeWord(){
	_ajaxEcTypeWord=$('.selectedEnergy').children().html();
}
//获取开始时间
var _ajaxStartTime;
function startTime(){
	//存放拆分的数组；
	var startArr=[];
	var startTime = $('.drp-calendar-date').eq(0).html();
	startArr=startTime.split('/');
	//处理时间格式（月 日）
	switch (startArr[1]){
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			startArr[1] = '0'+startArr[1];
			break;
		default:
			break;
	}
	switch(startArr[0]){
		case '10':
		case '11':
		case '12':
			break;
		default:
			startArr[0] = '0'+startArr[0];
	}
	_ajaxStartTime=startArr[2]+'/'+startArr[0]+'/'+startArr[1];
	$('.header-three-1').eq(0).html(_ajaxStartTime);
}
var _ajaxEndTime;
function endTime(){
	//存放拆分的数组；
	var endArr=[];
	var endTime = $('.drp-calendar-date').eq(1).html();
	endArr=endTime.split('/');
	//处理时间格式（月 日）
	switch (endArr[1]){
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			endArr[1] = '0'+endArr[1];
			break;
		default:
			break;
	}
	switch(endArr[0]){
		case '10':
		case '11':
		case '12':
			break;
		default:
			endArr[0] = '0'+endArr[0];
	}
	_ajaxEndTime=endArr[2]+'/'+endArr[0]+'/'+endArr[1];
	$('.header-three-1').eq(2).html(_ajaxEndTime);
}
//获取dataType
var _ajaxDataType='小时';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
//获得pointer数据
function getPointerData(){
	dataType();
	//用来存放x轴的数组
	var dataX=[];
	var DataX=[];
	var _allData=[];
	var _totalY=0;
	var maxY=[];
	var minY=[];
	var average=0;
	var pts = _objectSel.getSelectedPointers(),pointerID = [],pointerNames = [];
	if(pts.length>0){
		for(var i=0;i<pts.length;i++){
			pointerID.push(pts[i].pointerID);
			pointerNames.push(pts[i].pointerName);
		}
	}
	for(var i=0;i<pointerID.length;i++){
		pointerIds = pointerID[i];   //id=8909180101,
		var ecParams={
			'ecTypeId':_ajaxEcType,
			'pointerId': pointerIds,
			'startTime':_ajaxStartTime,
			'endTime':_ajaxEndTime,
			'dateType':_ajaxDataType
		};
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
			data:ecParams,
			async:false,
			success:function(result){
				_allData.push(result);
			}
		})
	}
	//遍历每个结果，将结果写入x轴的数组中
	for(var i=0;i<_allData.length;i++){
		//创建变量，临时存放
		var datas = _allData[i];
		for(var j=0;j<datas.length;j++){
			if(dataX.indexOf(datas[j].dataDate)<0){
				dataX.push(datas[j].dataDate);
			}
		}
	}
	dataX.sort();
	if(_ajaxDataType == "小时"){
		for(var i=0;i<dataX.length;i++){
			DataX.push(dataX[i].split("T")[0]+' '+dataX[i].split("T")[1])
		}
	}else{
		for(var i=0;i<dataX.length;i++){
			if(DataX.indexOf(dataX[i].split('T')[0])<0){
				DataX.push(dataX[i].split("T")[0])
			}

		}
	}
	var dataY=[];  //y轴数据
	for(var i=0;i<_allData.length;i++){  //遍历所有数据
		//循环创建series数组；
		minY=[];
		maxY=[];
		var object={};
		object.name=pointerNames[i];
		object.type='line';
		object.data=[];
		var datas=_allData[i];  //暂存两次循环的值
		for(var j=0;j<dataX.length;j++){  //循环遍历x轴中取出来的dataDate值和y轴取出的dataDate值比较是否相等，
			for(var z=0;z<datas.length;z++){
				if(datas[z].dataDate == dataX[j]){
					object.data.push(datas[z].data);
				}
			}
			if(j === datas.length){
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

		if(_ajaxEcType==01){
			$('#th1').text("累计用电量");
			$('#th2').text("用电峰值 kWh");
			$('#th3').text("用电谷值 kWh");
			$('#th4').text("用电平均值 kWh");
		}else if(_ajaxEcType==211){
			$('#th1').text("累计用水量");
			$('#th2').text("用水峰值 t");
			$('#th3').text("用水谷值 t");
			$('#th4').text("用水平均值 t");
		}else if(_ajaxEcType==311){
			$('#th1').text("累计用气量");
			$('#th2').text("用气峰值 m³");
			$('#th3').text("用气谷值 m³");
			$('#th4').text("用气平均值 m³");
		}
		$('#tbody').append('<tr><td>'+pointerNames[i]+'</td><td>'+
			unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)+'</td><td>'+
			unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,minTime.length -3)+'</td><td>'+unitConversion(average)+'</td></tr>')
    }
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		tooltip: {
			trigger: 'axis'
		},
		legend:{
			data:pointerNames
		},
		xAxis:  {
			type: 'category',
			boundaryGap: false,
			data: DataX
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: dataY
	};
	myChart11.setOption(option11);
}
//获得office数据
function getOfficeData(){
	dataType();
	var _allData=[];
	var dataX=[];
	var dataY=[];
	var DataX=[];
    var _totalY=0;
    var maxY=[];
    var maxY1=0;
    var minY=[];
    var minY1=0;
    var maxDate1=0;
    var minDate1=0;
    var average=0;
	var ofs = _objectSel.getSelectedOffices(),officeID = [],officeNames=[];
	for(var i=0;i<ofs.length;i++){
		officeID.push(ofs[i].f_OfficeID);
		officeNames.push(ofs[i].f_OfficeName);
	}
	for(var i=0;i<officeID.length;i++){
		var officeIds=officeID[i]
		var ecParams={
			'ecTypeId':_ajaxEcTypeWord,
			'officeId': officeIds,
			'startTime':_ajaxStartTime,
			'endTime':_ajaxEndTime,
			'dateType':_ajaxDataType
		}
		$.ajax({
			type:'post',
			url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
			data:ecParams,
			async:false,
			success:function(result){
				_allData.push(result);
			}
		})
	}
	//遍历每个结果，将结果写入x轴的数组中
	for(var i=0;i<_allData.length;i++){
		var datas=_allData[i];
		for(var j=0;j<datas.length;j++){
			if(dataX.indexOf(datas[j].dataDate)<0){
				dataX.push(datas[j].dataDate);
			}
		}
	}
	dataX.sort();
	if(_ajaxDataType=="小时"){
		for(var i=0;i<dataX.length;i++){
			DataX.push(dataX[i].split("T")[0]+" "+dataX[i].split("T")[1])
		}
	}else{
		for(var i=0;i<dataX.length;i++){
			if(DataX.indexOf(dataX[i].split("T")[0])<0){
				DataX.push(dataX[i].split("T")[0]);
			}
		}
	}
	//遍历y轴数据
	for(var i=0;i<_allData.length;i++){
		//循环创建对象
		var object={};
		object.name=officeNames[i];
		object.type='line';
		object.data=[];
		var datas=_allData[i];
		for(var j=0;j<datas.length;j++){
			//虽然数据已写入，但是要留意缺数据的情况，所以还要和DataX比较
			for(var z=0;z<dataX.length;z++){

				if(datas[j].dataDate==dataX[z]){
					object.data.push(datas[j].data);
                    minY.push(datas[j].data);
                    maxY.push(datas[j].data);
				}
				if(datas.length===z){
					object.data.push(0);
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
        if(_ajaxEcTypeWord=='电'){
            $('#th1').text("累计用电量");
            $('#th2').text("用电峰值 kWh");
            $('#th3').text("用电谷值 kWh");
            $('#th4').text("用电平均值 kWh");
        }else if(_ajaxEcTypeWord=='水'){
            $('#th1').text("累计用水量");
            $('#th2').text("用水峰值 t");
            $('#th3').text("用水谷值 t");
            $('#th4').text("用水平均值 t");
        }else if(_ajaxEcType=='气'){
            $('#th1').text("累计用气量");
            $('#th2').text("用气峰值 m³");
            $('#th3').text("用气谷值 m³");
            $('#th4').text("用气平均值 m³");
        }
		$('#tbody').append('<tr><td>'+officeNames[i]+'</td><td>'+
			unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime.replace("T"," ").substr(0,maxTime.length -3)+'</td><td>'+
			unitConversion(minArr_1)+'</td><td>'+minTime.replace("T"," ").substr(0,minTime.length -3)+'</td><td>'+unitConversion(average)+'</td></tr>')

    }
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		tooltip: {
			trigger: 'axis'
		},
		legend:{
			data:officeNames
		},
		xAxis:  {
			type: 'category',
			boundaryGap: false,
			data: DataX
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: dataY
	};
	myChart11.setOption(option11);
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