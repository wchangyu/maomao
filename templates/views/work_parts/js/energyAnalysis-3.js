$(function(){
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
		getEcType();
	});
    //对象选择
     $(".left-middle-tab").click(function(){
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
        $(".tree-1").css({
            display:"none"
        }),
        $(".tree-1")[$(this).index()].style.display="block"
    });
	_objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),true);
	_objectSel.initOffices($("#allOffices"));
	//楼宇搜索框功能
	var objSearchs = new ObjectSearch();
	objSearchs.initPointerSearch($("#keys"),$(".tipess"),"allPointer");
	//初始化模糊查找框，参数(输入框，提示框，ztree对应ul的id)
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
	//时间选择
	$('.time-options').click(function(){
		$('.time-options').removeClass('time-options-1');
		$(this).addClass('time-options-1');
		var sss = $('.time-options-1').index('.time-options');
		if(sss == 0){
			timeYesterday();
		}else if(sss == 1){
			timeLastWeek();
		}else if(sss == 2){
			timeLastMonth();
		}else if(sss == 3){
			timeLastYear();
		}
	});
	//默认时间；
	timeYesterday();
	//能耗选择
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	});
	//echarts
	//环比折线图
	myChart13 = echarts.init(document.getElementById('rheader-content-16'));
	option13 = {
		tooltip : {
			trigger: 'axis'
		},
		legend: {
			data:['本期用电','上期用电'],
			top:'30',
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
				show:'true',
				type : 'category',
				data:[]
			}
		],
		yAxis : [
			{
				type : 'value'
			}
		],
		series : [
			{
				name:'本期用电',
				type:'bar',
				data:[],
				barMaxWidth: '60',
			},
			{
				name:'上期用电',
				type:'bar',
				data:[],
				barMaxWidth: '60',
			}
		]
	};
	//环比柱折图
	myChart14 = echarts.init(document.getElementById('rheader-content-17'));
	option14 = {
		tooltip : {
			trigger: 'axis'
		},
		legend: {
			data:['累计值', '比较斜率'],
			top:'30'
		},
		toolbox: {
			show : true,
			feature : {
				dataView : {show: true, readOnly: false},
				magicType : {show: true, type: ['bar', 'line']},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		calculable : true,
		xAxis : [
			{
				type : 'category',
				data : ['本期','上期']
			}
		],
		yAxis : [
			{
				type : 'value'
			}
		],
		series : [
			{
				name:'累计值',
				type:'bar',
				barMaxWidth: '60',
				data:[],
				itemStyle:{
					normal:{
						color: function(params) {
							// build a color map as your need.
							var colorList = [
								'#d53a35','#2f4554','#FCCE10','#E87C25','#27727B',
								'#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
								'#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
							];
							return colorList[params.dataIndex]
						},
					}
				}
			},
			{
				name:'比较斜率',
				type:'line',
				data:[],
			}
		]
	};
	//同比折线图
	myChart15 = echarts.init(document.getElementById('rheader-content-18'));
	//电-同比分析-柱折图
	myChart16 = echarts.init(document.getElementById('rheader-content-19'));
	getEcType();
	getPointerData();
	setEnergyInfos();
	//页面加载时表头small内容
	var smalls = $('<small>');
	smalls.html(pointerNames);
	$('.page-title').append(smalls);
	$('.btn').click(function (){
		myChart13 = echarts.init(document.getElementById('rheader-content-16'));
		myChart14 = echarts.init(document.getElementById('rheader-content-17'));
		myChart15 = echarts.init(document.getElementById('rheader-content-18'));
		myChart16 = echarts.init(document.getElementById('rheader-content-19'));
		var o=$('.tree-3')[0].style.display;
		if(o == 'none'){
			getEcTypeWord();
			getOfficeData();
			if($('.page-title').children('small').length){
				$('.page-title').children('small').remove();
			}
			var smalls = $('<small>');
			smalls.html(officeNames);
			$('.page-title').append(smalls);
		}else{
			getEcType();
			getPointerData();
			if($('.page-title').children('small').length){
				$('.page-title').children('small').remove();
			}
			var smalls = $('<small>');
			smalls.html(pointerNames);
			$('.page-title').append(smalls);
		}
		setEnergyInfos();
	});
	$('body').mouseover(function(){
		if(myChart13 && myChart14 && myChart15 && myChart16){
			myChart13.resize();
			myChart14.resize();
			myChart15.resize();
			myChart16.resize();
		}
	})
})
var myChart13;
var myChart14;
var myChart15;
var myChart16;
window.onresize = function () {
	if(myChart13 && myChart14 && myChart15 && myChart16){
		myChart13.resize();
		myChart14.resize();
		myChart15.resize();
		myChart16.resize();
	}
}
//选取的能耗种类；
var _ajaxEcType;
function getEcType(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		aaa.push(jsonText.alltypes[i].etid)
	}
	_ajaxEcType = aaa[$('.selectedEnergy').index()];
}
//设置getECType的初始值(文字，office时用);
var _ajaxEcTypeWord = "电";
function getEcTypeWord(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		aaa.push(jsonText.alltypes[i].etname);
	}
	_ajaxEcTypeWord = aaa[$('.selectedEnergy').index()];
}
//根据当前选择的能耗类型设置页面信息
function setEnergyInfos(){
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	for(var i=0;i<jsonText.alltypes.length;i++){
		if(jsonText.alltypes[i].etid == _ajaxEcType){
			$('.header-right-lists').html('单位：' + jsonText.alltypes[i].etunit);
			$('.L-unit').html(jsonText.alltypes[i].etunit);
			$('.header-one').html(jsonText.alltypes[i].etname)
		}
	}
}
//开始时间
var newStr;
//结束时间
var newStr1;
//环比开始时间
var huanNewStr;
//环比结束时间
var huanNewStr1;
//同比开始时间
var tongNewStr;
//同比结束时间
var tongNewStr1;
//dataType值
var _ajaxDateType;
var _ajaxDateType_1;
//上日时间
function timeYesterday(){
	var mDate = moment().subtract(1,'d').format('YYYY/MM/DD');
	var mDates = moment().format('YYYY/MM/DD');
	newStr = mDate;
	newStr1 = mDates;
	var huanmDate = moment().subtract(2,'d').format('YYYY/MM/DD');
	var huanmDates = moment().subtract(1,'d').format('YYYY/MM/DD');
	huanNewStr = huanmDate;
	huanNewStr1 = huanmDates;
	var tongmDate = moment().subtract(1,'year').subtract(1,'d').format('YYYY/MM/DD');
	var tongmDates = moment().subtract(1,'year').format('YYYY/MM/DD');
	tongNewStr = tongmDate;
	tongNewStr1 = tongmDates;
	_ajaxDateType = '小时';
	_ajaxDateType_1 = '日';
}
//上周时间(无环比)
function timeLastWeek(){
	var mDate = moment().subtract(7,'d').startOf('week').add(1,'d').format('YYYY/MM/DD');
	var mDates = moment().subtract(7,'d').endOf('week').add(2,'d').format('YYYY/MM/DD');
	newStr = mDate;
	newStr1 = mDates;
	var huanmDate = moment().subtract(14,'d').startOf('week').add(1,'d').format('YYYY/MM/DD');
	var huanmDates = moment().subtract(14,'d').endOf('week').add(2,'d').format('YYYY/MM/DD');
	huanNewStr = huanmDate;
	huanNewStr1 = huanmDates;
	_ajaxDateType = '日';
	_ajaxDateType_1 = '周';
}
//上月时间
function timeLastMonth(){
	var mDate = moment().subtract(1,'month').startOf('month').format('YYYY/MM/DD');
	var mDates = moment().subtract(1,'month').endOf('month').add(1,'d').format('YYYY/MM/DD');
	newStr = mDate;
	newStr1 = mDates;
	var huanmDate = moment().subtract(2,'month').startOf('month').format('YYYY/MM/DD');
	var huanmDates = moment().subtract(2,'month').endOf('month').add(1,'d').format('YYYY/MM/DD');
	huanNewStr = huanmDate;
	huanNewStr1 = huanmDates;
	var tongmDate = moment().subtract(1,'year').subtract(1,'month').startOf('month').format('YYYY/MM/DD');
	var tongmDates = moment().subtract(1,'year').subtract(1,'month').endOf('month').add(1,'d').format('YYYY/MM/DD');
	tongNewStr = tongmDate;
	tongNewStr1 = tongmDates;
	_ajaxDateType = '日';
	_ajaxDateType_1 = '月';
}
//上年时间
function timeLastYear(){
	var mDate = moment().subtract(1,'year').startOf('year').format('YYYY/MM/DD');
	var mDates = moment().subtract(1,'year').endOf('year').add(1,'d').format('YYYY/MM/DD');
	newStr = mDate;
	newStr1 = mDates;
	var huanmDate = moment().subtract(2,'year').startOf('year').format('YYYY/MM/DD');
	var huanmDates = moment().subtract(2,'year').endOf('year').add(1,'d').format('YYYY/MM/DD');
	huanNewStr = huanmDate;
	huanNewStr1 = huanmDates;
	var tongmDate = moment().subtract(2,'year').startOf('year').format('YYYY/MM/DD');
	var tongmDates = moment().subtract(2,'year').endOf('year').add(1,'d').format('YYYY/MM/DD');
	tongNewStr = tongmDate;
	tongNewStr1 = tongmDates;
	_ajaxDateType = '月';
	_ajaxDateType_1 = '年';
}
//楼宇数据
var pointerNames;
function getPointerData(){
	//定义存放返回数据的数组（本期 X Y）
	var allData = [];
	var allDataX = [];
	var allDataY = [];
	var totalAllData;
	//(环比)
	var allDatas = [];
	var allDatasY = [];
	var totalAllDatas;
	//(同比)
	var allDatass = [];
	var allDatassY = [];
	var totalAllDatass;
	//确定楼宇id
	var pts = _objectSel.getSelectedPointers(),pointerID;
	if(pts.length > 0){
		pointerID = pts[0].pointerID;
		pointerNames = pts[0].pointerName;
	}
	if(!pointerID) { return; }
	//定义获得本期数据的参数
	var ecParams = {
		'ecTypeId':_ajaxEcType,
		'pointerID':pointerID,
		'startTime':newStr,
		'endTime':newStr1,
		'dateType':_ajaxDateType
	}
	//环比(前一天，前一周，前一个月，前一年)
	var ecParamss = {
		'ecTypeId':_ajaxEcType,
		'pointerID':pointerID,
		'startTime':huanNewStr,
		'endTime':huanNewStr1,
		'dateType':_ajaxDateType
	}
	//同比(去年的同一时期，没有周，环比和同比的年一样)
	var ecParamsss = {
		'ecTypeId':_ajaxEcType,
		'pointerID':pointerID,
		'startTime':tongNewStr,
		'endTime':tongNewStr1,
		'dateType':_ajaxDateType
	}
	//发送本期请求
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
		data:ecParams,
		async:false,
		success:function(result){
			allData.push(result);

		}
	})
	//发送环比请求
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
		data:ecParamss,
		async:false,
		success:function(result){
			allDatas.push(result)
		}
	})
	//发送同比请求
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
		data:ecParamsss,
		async:false,
		success:function(result){
			allDatass.push(result)
		}
	})
	//分别将本期和环比组合，本期和同比组合绘制echarts
	if(_ajaxDateType_1 == '日'){
		$('.right-top').eq(1).css({'opacity':1});
		$('.right-top').eq(0).css({'opacity':1});
		//确定本期的x轴；
		for(var i=0;i<allData.length;i++){
			var datas = allData[i];
			for(var j=0;j<datas.length;j++){
				var dataSplit = datas[j].dataDate.split('T')[1].split(':');
				var dataJoin = dataSplit[0] + ':' + dataSplit[1];
				if(allData.indexOf(dataJoin)<0){
					allDataX.push(dataJoin);
				}
			}
		}
		//确定本期的y轴
		for(var i=0;i<allData.length;i++){
			var datas = allData[i];
			for(var j=0;j<allDataX.length;j++){
				for(var z=0;z<datas.length;z++){
					var dataSplit = datas[z].dataDate.split('T')[1].split(':');
					var dataJoin = dataSplit[0] + ':' + dataSplit[1];
					if(dataJoin == allDataX[j]){
						allDataY.push(datas[z].data)
					}
				}
			}
		}
		//确定环比的y轴；
		for(var i=0;i<allDatas.length;i++){
			var datas = allDatas[i];
			for(var j=0;j<allDataX.length;j++){
				for(var z=0;z<datas.length;z++){
					var dataSplit = datas[z].dataDate.split('T')[1].split(':');
					var dataJoin = dataSplit[0] + ':' + dataSplit[1];
					if(dataJoin == allDataX[j]){
						allDatasY.push(datas[z].data)
					}
				}
			}
		}
		//确定同比的y轴；
		for(var i=0;i<allDatass.length;i++){
			var datas = allDatass[i];
			for(var j=0;j<allDataX.length;j++){
				for(var z=0;z<datas.length;z++){
					var dataSplit = datas[z].dataDate.split('T')[1].split(':');
					var dataJoin = dataSplit[0] + ':' + dataSplit[1];
					if(dataJoin == allDataX[j]){
						allDatassY.push(datas[z].data)
					}
				}
			}
		}
		//以上确定了x轴，并确定了不同的y轴，下面要通过确定最大值来确定y轴的最大边界
		//分别判断本期与同比，与环比的最大值
	}else{
		if(_ajaxDateType_1 == '周'){
			$('.right-top').eq(1).css({'opacity':0});
		}else{
			$('.right-top').eq(1).css({'opacity':1});
		}
		//确定本期的x轴
		for(var i=0;i<allData.length;i++){
			var datas = allData[i]
			for(var j=0;j<datas.length;j++){
				var dataSplit = datas[j].dataDate.split('T')[0];
				if(allDataX.indexOf(dataSplit)<0){
					allDataX.push(dataSplit);
				}
			}
		}
		//确定本期的y轴数据
		for(var i=0;i<allData.length;i++){
			var datas = allData[i];
			for(var j=0;j<allDataX.length;j++){
				for(var z=0;z<datas.length;z++){
					var dataSplit = datas[z].dataDate.split('T')[0];
					if(dataSplit == allDataX[j]){
						allDataY.push(datas[z].data);
					}
				}
			}
		}
		//确定环比y轴数据
		for(var i=0;i<allDatas.length;i++){
			var datas = allDatas[i];
			for(var j=0;j<datas.length;j++){
				allDatasY.push(datas[j].data);
			}
		}
		//确定同比y轴数据
		for(var i=0;i<allDatass.length;i++){
			var datas = allDatass[i];
			for(var j=0;j<datas.length;j++){
				allDatassY.push(datas[j].data);
			}
		}
	}
	//计算所有的纵坐标的总和
	totalAllData = 0;
	for(var i=0;i<allDataY.length;i++){
		totalAllData += parseInt(allDataY[i]);
	}
	totalAllDatas = 0;
	for(var i=0;i<allDatasY.length;i++){
		totalAllDatas += parseInt(allDatasY[i]);
	}
	totalAllDatass = 0;
	for(var i=0;i<allDatassY.length;i++){
		totalAllDatass += parseInt(allDatassY[i]);
	}
	//总电div
	$('.right-top').find(".content-left-top-tips span:eq(0)").html(totalAllData);
	$('.huanbizhi').html(totalAllDatas);
	$('.tongbizhi').html(totalAllDatass);
	//计算本期与环比相比（本期-环比）/环比
	if(totalAllDatas != 0){
		var compareH = (totalAllData - totalAllDatas)/totalAllDatas * 100;
		if(compareH > 0){
			$('.content-left-top-arrow:eq(0)').css({
				'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
				'background-size':'90%'
			})
			$('.span-1').css({
				'color':'#ffc000'
			})
		}else if(compareH < 0){
			$('.content-left-top-arrow:eq(0)').css({
				'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
				'background-size':'90%'
			})
			$('.span-1').css({
				'color':'#019cdf'
			})
		}else if(compareH = 0){
			$('.content-left-top-arrow:eq(0)').css({
				'background':'#ffffff'
			})
			$('.span-1').css({
				'color':'#019cdf'
			})
		}
		$('.span-1').html(compareH.toFixed(2) + '%')
	}else{
		$('.span-1').html('出错了!');
		$('.content-left-top-arrow:eq(0)').css({
			'background':'#ffffff'
		})
		$('.span-1').css({
			'color':'red'
		})
	}
	//计算本期与同比相比（本期-同比）/同比
	if(totalAllDatass != 0){
		var compareT = (totalAllData - totalAllDatass)/totalAllDatass * 100;
		if(compareT > 0){
			$('.content-left-top-arrow:eq(1)').css({
				'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
				'background-size':'90%'
			})
			$('.span-2').css({
				'color':'#ffc000'
			})
		}else if(compareT < 0){
			$('.content-left-top-arrow:eq(1)').css({
				'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
				'background-size':'90%'
			})
			$('.span-2').css({
				'color':'#019cdf'
			})
		}else if(compareH = 0){
			$('.content-left-top-arrow:eq(1)').css({
				'background':'#ffffff'
			})
			$('.span-2').css({
				'color':'#019cdf'
			})
		}
		$('.span-2').html(compareT.toFixed(2) + '%')
	}else{
		$('.span-2').html('出错了!');
		$('.content-left-top-arrow:eq(1)').css({
			'background':'#ffffff'
		})
		$('.span-2').css({
			'color':'red'
		})
	}
	//环比柱状图
	option13.xAxis[0].data = allDataX;
	option13.series[0].data = allDataY;
	option13.series[1].data = allDatasY;
	myChart13.setOption(option13);
	//电-环比分析-柱状图
	option14.series[0].data[0] = totalAllData;
	option14.series[0].data[1] = totalAllDatas;
	option14.series[1].data[0] = totalAllData;
	option14.series[1].data[1] = totalAllDatas;
	myChart14.setOption(option14);
	//电-同比分析-柱折图
	option13.xAxis[0].data = allDataX;
	option13.series[0].data = allDataY;
	option13.series[1].data = allDatassY;
	myChart15.setOption(option13);
	//电-同比分析-柱状图
	option14.series[0].data[0] = totalAllData;
	option14.series[0].data[1] = totalAllDatass;
	option14.series[1].data[0] = totalAllData;
	option14.series[1].data[1] = totalAllDatass;
	myChart16.setOption(option14);
	//
}
//科室数据
var officeNames=[];
function getOfficeData(){
	officeNames=[];
	//定义存放返回数据的数组（本期 X Y）
	var allData = [];
	var allDataX = [];
	var allDataY = [];
	var maxDataBorder = 0;
	var totalAllData;
	//(环比)
	var allDatas = [];
	var allDatasY = [];
	var maxDatasBorder = 0;
	var totalAllDatas;
	//(同比)
	var allDatass = [];
	var allDatassY = [];
	var maxDatassBorder = 0;
	var totalAllDatass;
	//存放最大值
	var maxMax = 0;
	var maxMaxs = 0;
	//存放柱折图的最大值
	var maxMaxLine = 0;
	//确定楼宇id
	var ofs = _objectSel.getSelectedOffices(),officeID = [];
	for(var i=0;i<ofs.length;i++){
		officeID.push(ofs[i].f_OfficeID);
		officeNames.push(ofs[i].f_OfficeName);
	}
	//console.log(officeNames);
	//定义获得本期数据的参数
	var ecParams = {
		'ecTypeId':_ajaxEcTypeWord,
		'officeId':officeID,
		'startTime':newStr,
		'endTime':newStr1,
		'dateType':_ajaxDateType
	}
	//环比(前一天，前一周，前一个月，前一年)
	var ecParamss = {
		'ecTypeId':_ajaxEcTypeWord,
		'officeId':officeID,
		'startTime':huanNewStr,
		'endTime':huanNewStr1,
		'dateType':_ajaxDateType
	}
	//同比(去年的同一时期，没有周，环比和同比的年一样)
	var ecParamsss = {
		'ecTypeId':_ajaxEcTypeWord,
		'officeId':officeID,
		'startTime':tongNewStr,
		'endTime':tongNewStr1,
		'dateType':_ajaxDateType
	}
	//发送本期请求
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
		data:ecParams,
		async:false,
		success:function(result){
			allData.push(result);
		}
	})
	//发送环比请求
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
		data:ecParamss,
		async:false,
		success:function(result){
			allDatas.push(result)
		}
	})
	//发送同比请求
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
		data:ecParamsss,
		async:false,
		success:function(result){
			allDatass.push(result)
		}
	})
	//分别将本期和环比组合，本期和同比组合绘制echarts
	if(_ajaxDateType_1 == '日'){
		//确定本期的x轴；
		for(var i=0;i<allData.length;i++){
			var datas = allData[i];
			for(var j=0;j<datas.length;j++){
				var dataSplit = datas[j].dataDate.split('T')[1].split(':');
				var dataJoin = dataSplit[0] + ':' + dataSplit[1];
				if(allData.indexOf(dataJoin)<0){
					allDataX.push(dataJoin);
				}
			}
		}
		//确定本期的y轴
		for(var i=0;i<allData.length;i++){
			var datas = allData[i];
			for(var j=0;j<allDataX.length;j++){
				for(var z=0;z<datas.length;z++){
					var dataSplit = datas[z].dataDate.split('T')[1].split(':');
					var dataJoin = dataSplit[0] + ':' + dataSplit[1];
					if(dataJoin == allDataX[j]){
						allDataY.push(datas[z].data)
					}
					maxDataBorder = _.max(datas,function(d){return d.data});
				}
			}
		}
		//确定环比的y轴；
		for(var i=0;i<allDatas.length;i++){
			var datas = allDatas[i];
			for(var j=0;j<allDataX.length;j++){
				for(var z=0;z<datas.length;z++){
					var dataSplit = datas[z].dataDate.split('T')[1].split(':');
					var dataJoin = dataSplit[0] + ':' + dataSplit[1];
					if(dataJoin == allDataX[j]){
						allDatasY.push(datas[z].data)
					}
					maxDatasBorder = _.max(datas,function(d){return d.data});
				}
			}
		}
		//确定同比的y轴；
		for(var i=0;i<allDatass.length;i++){
			var datas = allDatass[i];
			for(var j=0;j<allDataX.length;j++){
				for(var z=0;z<datas.length;z++){
					var dataSplit = datas[z].dataDate.split('T')[1].split(':');
					var dataJoin = dataSplit[0] + ':' + dataSplit[1];
					if(dataJoin == allDataX[j]){
						allDatassY.push(datas[z].data)
					}
					maxDatassBorder = _.max(datas,function(d){return d.data});
				}
			}
		}
		//以上确定了x轴，并确定了不同的y轴，下面要通过确定最大值来确定y轴的最大边界
		//分别判断本期与同比，与环比的最大值
	}else{
		if(_ajaxDateType_1 == '周'){
			$('.right-top').eq(1).hide();
		}else{
			$('.right-top').eq(1).show();
		}
		//确定本期的x轴
		for(var i=0;i<allData.length;i++){
			var datas = allData[i]
			for(var j=0;j<datas.length;j++){
				var dataSplit = datas[j].dataDate.split('T')[0];
				if(allDataX.indexOf(dataSplit)<0){
					allDataX.push(dataSplit);
				}
			}
		}
		//确定本期的y轴数据
		for(var i=0;i<allData.length;i++){
			var datas = allData[i];
			for(var j=0;j<allDataX.length;j++){
				for(var z=0;z<datas.length;z++){
					var dataSplit = datas[z].dataDate.split('T')[0];
					if(dataSplit == allDataX[j]){
						allDataY.push(datas[z].data);
					}
					maxDataBorder = _.max(datas,function(d){return d.data});
				}
			}
		}
		//确定环比y轴数据
		for(var i=0;i<allDatas.length;i++){
			var datas = allDatas[i];
			for(var j=0;j<datas.length;j++){
				allDatasY.push(datas[j].data);
			}
			maxDatasBorder = _.max(datas,function(d){return d.data});
		}
		//确定同比y轴数据
		for(var i=0;i<allDatass.length;i++){
			var datas = allDatass[i];
			for(var j=0;j<datas.length;j++){
				allDatassY.push(datas[j].data);
			}
			maxDatassBorder = _.max(datas,function(d){return d.data});
		}
	}
	if(maxDataBorder.data >= maxDatasBorder.data){
		maxMax = maxDataBorder.data;
	}else{
		maxMax = maxDatasBorder.data;
	}
	//计算所有的纵坐标的总和
	totalAllData = 0;
	for(var i=0;i<allDataY.length;i++){
		totalAllData += parseInt(allDataY[i]);
	}
	totalAllDatas = 0;
	for(var i=0;i<allDatasY.length;i++){
		totalAllDatas += parseInt(allDatasY[i]);
	}
	totalAllDatass = 0;
	for(var i=0;i<allDatassY.length;i++){
		totalAllDatass += parseInt(allDatassY[i]);
	}
	//总电div
	$('.right-top').find(".content-left-top-tips span:eq(0)").html(totalAllData);
	$('.huanbizhi').html(totalAllDatas);
	$('.tongbizhi').html(totalAllDatass);
	//计算本期与环比相比（本期-环比）/环比
	if(totalAllDatas != 0){
		var compareH = (totalAllData - totalAllDatas)/totalAllDatas * 100;
		if(compareH > 0){
			$('.content-left-top-arrow:eq(0)').css({
				'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
				'background-size':'90%'
			})
			$('.span-1').css({
				'color':'#ffc000'
			})
		}else if(compareH < 0){
			$('.content-left-top-arrow:eq(0)').css({
				'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
				'background-size':'90%'
			})
			$('.span-1').css({
				'color':'#019cdf'
			})
		}else if(compareH = 0){
			$('.content-left-top-arrow:eq(0)').css({
				'background':'#ffffff'
			})
			$('.span-1').css({
				'color':'#019cdf'
			})
		}
		$('.span-1').html(compareH.toFixed(2) + '%')
	}else{
		$('.span-1').html('出错了!');
		$('.content-left-top-arrow:eq(0)').css({
			'background':'#ffffff'
		})
		$('.span-1').css({
			'color':'red'
		})
	}
	//计算本期与同比相比（本期-同比）/同比
	if(totalAllDatass != 0){
		var compareT = (totalAllData - totalAllDatass)/totalAllDatass * 100;
		if(compareT > 0){
			$('.content-left-top-arrow:eq(1)').css({
				'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
				'background-size':'90%'
			})
			$('.span-2').css({
				'color':'#ffc000'
			})
		}else if(compareT < 0){
			$('.content-left-top-arrow:eq(1)').css({
				'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
				'background-size':'90%'
			})
			$('.span-2').css({
				'color':'#019cdf'
			})
		}else if(compareH = 0){
			$('.content-left-top-arrow:eq(1)').css({
				'background':'#ffffff'
			})
			$('.span-2').css({
				'color':'#019cdf'
			})
		}
		$('.span-2').html(compareT.toFixed(2) + '%')
	}else{
		$('.span-2').html('出错了!');
		$('.content-left-top-arrow:eq(1)').css({
			'background':'#ffffff'
		})
		$('.span-2').css({
			'color':'red'
		})
	}
	//环比柱状图
	option13.xAxis.data = allDataX;
	option13.series[0].data = allDataY;
	option13.series[1].data = allDatasY;
	myChart13.setOption(option13);
	//电-环比分析-柱状图
	option14.series[0].data[0] = totalAllData;
	option14.series[0].data[1] = totalAllDatas;
	option14.series[1].data[0] = totalAllData;
	option14.series[1].data[1] = totalAllDatas;
	myChart14.setOption(option14);
	//电-同比分析-柱折图
	option13.xAxis.data = allDataX;
	option13.series[0].data = allDataY;
	option13.series[1].data = allDatassY;
	myChart15.setOption(option13);
	//电-同比分析-柱状图
	option14.series[0].data[0] = totalAllData;
	option14.series[0].data[1] = totalAllDatass;
	option14.series[1].data[0] = totalAllData;
	option14.series[1].data[1] = totalAllDatass;
	myChart16.setOption(option14);

}
