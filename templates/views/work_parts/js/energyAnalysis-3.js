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
        $(".tree-1")[$(this).index()-1].style.display="block"
    });
	_objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),true);
	_objectSel.initOffices($("#allOffices"));
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
	})
	//默认时间；
	timeYesterday();
	//能耗选择
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	});
	getEcType();
	getPointerData();
	$('small').html(pointerNames);
	$('.btns1').click(function (){
		var o=$('.tree-3')[0].style.display;
		if(o == 'none'){
			getEcTypeWord();
			getOfficeData();
			$('small').html(officeNames);
		}else{
			getEcType();
			getPointerData();
			$('small').html(pointerNames);
		}
		setEnergyInfos();
	})

})
var myChart13;
var myChart14;
var myChart15;
var myChart16;
window.onresize = function () {
    myChart13.resize(); 
    myChart14.resize();
    myChart15.resize();
    myChart16.resize();
}
//选取的能耗种类；
var _ajaxEcType;
function getEcType(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	//console.log(jsonText.alltypes);
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
	var allBranch = [];
	var allBranchs = [];
	var allBranchss = [];
	var allDataX = [];
	var allDateX1 = [];
	var dataX = [];
	var dataX1 = [];
	var dataY1 = [];
	var dataY2 = [];
	var dataY3 = [];
	//存放累计值
	var totalNum = 0;
	var totalNums = 0;
	var totalNumss = 0;
	//存放增长率
	var growthRate = 0;
	var pts = _objectSel.getSelectedPointers(),pointerID;
	if(pts.length > 0){
		pointerID = pts[0].pointerID;
		pointerNames = pts[0].pointerName;
	}
	if(!pointerID) { return; }
	//本期
	var ecParams = {
		'ecTypeId':_ajaxEcType,
		'pointerID':pointerID,
		'startTime':newStr,
		'endTime':newStr1,
		'dateType':_ajaxDateType
	}
	//环比
	var ecParamss = {
		'ecTypeId':_ajaxEcType,
		'pointerID':pointerID,
		'startTime':huanNewStr,
		'endTime':huanNewStr1,
		'dateType':_ajaxDateType
	}
	//同比
	var ecParamsss = {
		'ecTypeId':_ajaxEcType,
		'pointerID':pointerID,
		'startTime':tongNewStr,
		'endTime':tongNewStr1,
		'dateType':_ajaxDateType
	}
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
		data:ecParams,
		async:false,
		success:function(result){
			allBranch.push(result);
		}
	})
	allDataX.push(allBranch);
	allDateX1.push(allBranch);
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
		data:ecParamss,
		async:false,
		success:function(result){
			allBranchs.push(result);
		}
	})
	allDataX.push(allBranchs);
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
		data:ecParamsss,
		async:false,
		success:function(result){
			allBranchss.push(result);
		}
	})
	allDateX1.push(allBranchss);
	//获得横坐标的数据  dataX
	if(_ajaxDateType_1 == '日'){
		$('.right-top').eq(1).show();
		//环比（横坐标）
		for(var i=0;i<allDataX.length;i++){
			var datas = allDataX[i];
			for(var j=0;j<datas.length;j++){
				var currentArr = datas[j];
				for(var z=0;z<currentArr.length;z++){
					if(dataX.indexOf(currentArr[z].dataDate.split('T')[1].split(':')[0]+':'+currentArr[z].dataDate.split('T')[1].split(':')[1])<0){
						dataX.push(currentArr[z].dataDate.split('T')[1].split(':')[0]+':'+currentArr[z].dataDate.split('T')[1].split(':')[1])
					}
				}
			}
		}
		//环比（确定y周数据）
		for(var i=0;i<allBranch.length;i++){
			var datas = allBranch[i];
			for(var j=0;j<datas.length;j++){
				for(var z =0;z<dataX.length;z++){
					if(datas[j].dataDate.split('T')[1].split(':')[0]+':'+datas[j].dataDate.split('T')[1].split(':')[1] == dataX[z]){
						dataY1.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		totalNum = 0;
		for(var i=0;i<dataY1.length;i++){
			totalNum += parseInt(dataY1[i]);
		}
		$('.content-left-top-tips span').html(totalNum);
		var maxDataa = _.max(datas,function(d){return d.data}).data;
		var maxDiss = parseInt(maxDataa).toString().length-1;
		var maxDis = Math.pow(10,maxDiss);
		var maxData = Math.pow(10,maxDiss) * (parseInt(maxDataa).toString().length + 2);
		for(var i=0;i<allBranchs.length;i++){
			var datas = allBranchs[i];
			for(var j=0;j<datas.length;j++){
				for(var z =0;z<dataX.length;z++){
					if(datas[j].dataDate.split('T')[1].split(':')[0]+':'+datas[j].dataDate.split('T')[1].split(':')[1] == dataX[z]){
						dataY2.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		totalNums = 0;
		for(var i=0;i<dataY2.length;i++){
			totalNums += parseInt(dataY2[i]);
		}
		$('.huanbizhi').html(totalNums);
		if(totalNums != 0 ){
			growthRate = ((totalNum-totalNums)/totalNums * 100).toFixed(2);
			$('.span-1').html(growthRate + '%');
			if(growthRate >= 0){
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}else{
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}
		}else if(totalNums == 0){
			$('.span-1').html('出错了!');
		}
		//同比(横坐标)
		for(var i=0;i<allDateX1.length;i++){
			var datas = allDateX1[i];
			for(var j=0;j<datas.length;j++){
				var currentArr = datas[j];
				for(var z=0;z<currentArr.length;z++){
					if(dataX1.indexOf(currentArr[z].dataDate.split('T')[1].split(':')[0]+':'+currentArr[z].dataDate.split('T')[1].split(':')[1])<0){
						dataX1.push(currentArr[z].dataDate.split('T')[1].split(':')[0]+':'+currentArr[z].dataDate.split('T')[1].split(':')[1])
					}
				}
			}
		}
		//同比（纵坐标）
		for(var i=0;i<allBranchss.length;i++){
			var datas = allBranchss[i]
			for(var j=0;j<datas.length;j++){
				for(var z =0;z<dataX1.length;z++){
					if(datas[j].dataDate.split('T')[1].split(':')[0]+':'+datas[j].dataDate.split('T')[1].split(':')[1] == dataX1[z]){
						dataY3.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		totalNumss = 0;
		for(var i=0;i<dataY3.length;i++){
			totalNumss += parseInt(dataY3[i]);
		}
		$('.tongbizhi').html(totalNumss);
		if(totalNumss != 0 ){
			growthRate = ((totalNum-totalNumss)/totalNumss * 100).toFixed(2);
			$('.span-2').html(growthRate + '%');
			if(growthRate >= 0){
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}else{
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}
		}else if(totalNumss == 0){
			$('.span-2').html('出错了!');
		}
		//首先定义一个变量，确定最大值（环比）
		var compare = totalNum - totalNums;
		if(compare >= 0){
			maxDissa1 = totalNum;
		}else{
			maxDissa1 = totalNums;
		}
		//首先定义一个变量，确定最大值（同比）；
		var compares = totalNum - totalNumss;
		if(compares >= 0){
			maxDissa2 = totalNum;
		}else{
			maxDissa2 = totalNumss;
		}
	}else{
		//环比（横坐标）
		for(var i=0;i<allDataX.length;i++){
			var datas = allDataX[i];
			for(var j=0;j<datas.length;j++){
				var currentArr = datas[j];
				for(var z=0;z<currentArr.length;z++){
					if(dataX.indexOf(currentArr[z].dataDate.split('T')[0])<0){
						dataX.push(currentArr[z].dataDate.split('T')[0]);
					}
				}
			}
		}
		//环比（确定y周数据）
		for(var i=0;i<allBranch.length;i++){
			var datas = allBranch[i];
			for(var j=0;j<datas.length;j++){
				for(var z=0;z<dataX.length;z++){
					if( datas[j].dataDate.split('T')[0] == dataX[z]){
						dataY1.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		totalNum = 0;
		for(var i=0;i<dataY1.length;i++){
			totalNum += parseInt(dataY1[i]);
		}
		$('.content-left-top-tips span').html(totalNum);
		for(var i=0;i<allBranchs.length;i++){
			var datas = allBranchs[i];
			for(var j=0;j<datas.length;j++){
				for(var z=0;z<dataX.length;z++){
					if( datas[j].dataDate.split('T')[0] == dataX[z]){
						dataY2.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		var maxDataa = _.max(datas,function(d){return d.data}).data;
		var maxDiss = parseInt(maxDataa/2).toString().length-1;
		var  maxDis = 1;
		for(var i=0;i<maxDiss;i++){
			maxDis = maxDis * 10;
		}
		totalNums = 0;
		for(var i=0;i<dataY2.length;i++){
			totalNums += parseInt(dataY2[i]);
		}
		$('.huanbizhi').html(totalNums);
		if(totalNums != 0 ){
			growthRate = ((totalNum-totalNums)/totalNums * 100).toFixed(2);
			$('.span-1').html(growthRate + '%');
			if(growthRate >= 0){
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}else{
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}
		}else if(totalNums == 0){
			$('.span-1').html('出错了!');
		};
		if(_ajaxDateType_1 == '周'){
			$('.right-top').eq(1).hide();
		}else{
			$('.right-top').eq(1).show();
			//同比（横坐标）
			for(var i=0;i<allDateX1.length;i++){
				var datas = allDateX1[i];
				for(var j=0;j<datas.length;j++){
					var currentArr = datas[j];
					for(var z=0;z<currentArr.length;z++){
						if(dataX1.indexOf(currentArr[z].dataDate.split('T')[0])<0){
							dataX1.push(currentArr[z].dataDate.split('T')[0]);
						}
					}
				}
			}
			//同比（纵坐标）；
			for(var i=0;i<allBranchss.length;i++){
				var datas = allBranch[i];
				for(var j=0;j<datas.length;j++){
					for(var z=0;z<dataX1.length;z++){
						if( datas[j].dataDate.split('T')[0] == dataX[z]){
							dataY3.push(datas[j].data.toFixed(2));
						}
					}
				}
			}
			totalNumss = 0;
			for(var i=0;i<dataY3.length;i++){
				totalNumss += parseInt(dataY3[i]);
			}
			$('.tongbizhi').html(totalNumss);
			if(totalNumss != 0 ){
				growthRate = ((totalNum-totalNumss)/totalNumss * 100).toFixed(2);
				$('.span-2').html(growthRate + '%');
				if(growthRate >= 0){
					$('.content-left-top-arrow').css({
						'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
						'background-size':'90%'
					})
				}else{
					$('.content-left-top-arrow').css({
						'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
						'background-size':'90%'
					})
				}
			}else if(totalNumss == 0){
				$('.span-2').html('出错了!');
			}
		}
		//首先定义一个变量，确定最大值（环比）
		var compare = totalNum - totalNums;
		if(compare >= 0){
			maxDissa1 = totalNum;
		}else{
			maxDissa1 = totalNums;
		}
		//首先定义一个变量，确定最大值（同比）；
		var compares = totalNum - totalNumss;
		if(compares >= 0){
			maxDissa2 = totalNum;
		}else{
			maxDissa2 = totalNumss;
		}
	}
	//电-环比分析-柱折图
	myChart13 = echarts.init(document.getElementById('rheader-content-16'));
	option13 = {
		tooltip: {
			trigger: 'axis'
		},
		toolbox: {
			feature: {
				dataView: {show: true, readOnly: false},
				magicType: {show: true, type: ['line', 'bar']},
				restore: {show: true},
				saveAsImage: {show: true}
			}
		},
		legend: {
			data:['本期用电','上期用电']
		},
		xAxis: [
			{
				type: 'category',
				data:dataX
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '用电量',
				min: 0,
				max: maxData,
				interval: maxDis,
				axisLabel: {
					formatter: '{value}'
				}
			}
		],
		series: [
			{
				name:'本期用电',
				type:'bar',
				data:dataY1
			},
			{
				name:'上期用电',
				type:'bar',
				data:dataY2
			}
		]
	};
	myChart13.setOption(option13);
	//电-环比分析-柱状图
	myChart14 = echarts.init(document.getElementById('rheader-content-17'));
	option14 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:['比较斜率', '累计值']
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {readOnly: false},
				restore: {},
				saveAsImage: {}
			}
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: true,
				data:['本期','上期']
			},
			{
				type: 'category',
				boundaryGap: true,
				data: ['本期','上期']
			}
		],
		yAxis: [
			{
				type: 'value',
				scale: true,
				name: '用量',
				max: maxDissa1,
				min: 0
			},
			{
				type: 'value',
				scale: true,
				name: '用量',
				max: maxDissa1,
				min: 0
			}
		],
		series: [
			{
				name:'累计值',
				type:'bar',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data:[totalNum,totalNums]
			},
			{
				name:'比较斜率',
				type:'line',
				data:[totalNum,totalNums]
			}
		]
	};
	myChart14.setOption(option14);
	//电-同比分析-柱折图
	myChart15 = echarts.init(document.getElementById('rheader-content-18'));
	option15 = {
		tooltip: {
			trigger: 'axis'
		},
		toolbox: {
			feature: {
				dataView: {show: true, readOnly: false},
				magicType: {show: true, type: ['line', 'bar']},
				restore: {show: true},
				saveAsImage: {show: true}
			}
		},
		legend: {
			data:['本期用电','上期用电']
		},
		xAxis: [
			{
				type: 'category',
				data:dataX1
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '用电量',
				min: 0,
				max: maxData,
				interval: maxDis,
				axisLabel: {
					formatter: '{value}'
				}
			}
		],
		series: [
			{
				name:'本期用电',
				type:'bar',
				data:dataY1
			},
			{
				name:'上期用电',
				type:'bar',
				data:dataY3
			}
		]
	};
	myChart15.setOption(option15);
	//电-同比分析-柱状图
	myChart16 = echarts.init(document.getElementById('rheader-content-19'));
	option16 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:['比较斜率', '累计值']
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {readOnly: false},
				restore: {},
				saveAsImage: {}
			}
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: true,
				data:['本期','上期']
			},
			{
				type: 'category',
				boundaryGap: true,
				data: ['本期','上期']
			}
		],
		yAxis: [
			{
				type: 'value',
				scale: true,
				name: '用量',
				max: maxDissa2,
				min: 0
			},
			{
				type: 'value',
				scale: true,
				name: '用量',
				max: maxDissa2,
				min: 0
			}
		],
		series: [
			{
				name:'累计值',
				type:'bar',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data:[totalNum,totalNumss]
			},
			{
				name:'比较斜率',
				type:'line',
				data:[totalNum,totalNumss]
			}
		]
	};
	myChart16.setOption(option16);

}
//科室数据
var officeNames;
function getOfficeData(){
	var allBranch = [];
	var allBranchs = [];
	var allBranchss = [];
	var allDataX = [];
	var allDateX1 = [];
	var dataX = [];
	var dataX1 = [];
	var dataY1 = [];
	var dataY2 = [];
	var dataY3 = [];
	//存放累计值
	var totalNum = 0;
	var totalNums = 0;
	var totalNumss = 0;
	//存放增长率
	var growthRate = 0;
	var ofs = _objectSel.getSelectedOffices(),officeID;
	if(ofs.length>0) {
		officeID = ofs[0].f_OfficeID;
		officeNames = ofs[0].f_OfficeName;
	};
	if(!officeID){ return; }
	var ecParams = {
		'ecTypeId': _ajaxEcTypeWord,
		'officeId': officeID,
		'dateType': _ajaxDateType,
		'startTime': newStr,
		'endTime' : newStr1
	}
	//环比
	var ecParamss = {
		'ecTypeId': _ajaxEcTypeWord,
		'officeId': officeID,
		'dateType': _ajaxDateType,
		'startTime': huanNewStr,
		'endTime' : huanNewStr1
	}
	//同比
	var ecParamsss = {
		'ecTypeId': _ajaxEcTypeWord,
		'officeId': officeID,
		'dateType': _ajaxDateType,
		'startTime': tongNewStr,
		'endTime' : tongNewStr1
	}
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
		data:ecParams,
		async:false,
		success:function(result){
			allBranch.push(result);
		}
	})
	allDataX.push(allBranch);
	allDateX1.push(allBranch);
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
		data:ecParamss,
		async:false,
		success:function(result){
			allBranchs.push(result);
		}
	})
	allDataX.push(allBranchs);
	$.ajax({
		type:'post',
		url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
		data:ecParamsss,
		async:false,
		success:function(result){
			allBranchss.push(result);
		}
	})
	allDateX1.push(allBranchss);
	//获得横坐标的数据  dataX
	if(_ajaxDateType_1 == '日'){
		$('.right-top').eq(1).show();
		//环比（横坐标）
		for(var i=0;i<allDataX.length;i++){
			var datas = allDataX[i];
			for(var j=0;j<datas.length;j++){
				var currentArr = datas[j];
				for(var z=0;z<currentArr.length;z++){
					if(dataX.indexOf(currentArr[z].dataDate.split('T')[1].split(':')[0]+':'+currentArr[z].dataDate.split('T')[1].split(':')[1])<0){
						dataX.push(currentArr[z].dataDate.split('T')[1].split(':')[0]+':'+currentArr[z].dataDate.split('T')[1].split(':')[1])
					}
				}
			}
		}
		//环比（确定y周数据）
		for(var i=0;i<allBranch.length;i++){
			var datas = allBranch[i];
			for(var j=0;j<datas.length;j++){
				for(var z =0;z<dataX.length;z++){
					if(datas[j].dataDate.split('T')[1].split(':')[0]+':'+datas[j].dataDate.split('T')[1].split(':')[1] == dataX[z]){
						dataY1.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		totalNum = 0;
		for(var i=0;i<dataY1.length;i++){
			totalNum += parseInt(dataY1[i]);
		}
		$('.content-left-top-tips span').html(totalNum);
		var maxDataa = _.max(datas,function(d){return d.data}).data;
		var maxDiss = parseInt(maxDataa).toString().length-1;
		var maxDis = Math.pow(10,maxDiss);
		var maxData = Math.pow(10,maxDiss) * (parseInt(maxDataa).toString().length + 2);
		for(var i=0;i<allBranchs.length;i++){
			var datas = allBranchs[i];
			for(var j=0;j<datas.length;j++){
				for(var z =0;z<dataX.length;z++){
					if(datas[j].dataDate.split('T')[1].split(':')[0]+':'+datas[j].dataDate.split('T')[1].split(':')[1] == dataX[z]){
						dataY2.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		totalNums = 0;
		for(var i=0;i<dataY2.length;i++){
			totalNums += parseInt(dataY2[i]);
		}
		$('.huanbizhi').html(totalNums);
		if(totalNums != 0 ){
			growthRate = ((totalNum-totalNums)/totalNums * 100).toFixed(2);
			$('.span-1').html(growthRate + '%');
			if(growthRate >= 0){
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}else{
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}
		}else if(totalNums == 0){
			$('.span-1').html('出错了!');
		}
		//同比(横坐标)
		for(var i=0;i<allDateX1.length;i++){
			var datas = allDateX1[i];
			for(var j=0;j<datas.length;j++){
				var currentArr = datas[j];
				for(var z=0;z<currentArr.length;z++){
					if(dataX1.indexOf(currentArr[z].dataDate.split('T')[1].split(':')[0]+':'+currentArr[z].dataDate.split('T')[1].split(':')[1])<0){
						dataX1.push(currentArr[z].dataDate.split('T')[1].split(':')[0]+':'+currentArr[z].dataDate.split('T')[1].split(':')[1])
					}
				}
			}
		}
		//同比（纵坐标）
		for(var i=0;i<allBranchss.length;i++){
			var datas = allBranchss[i]
			for(var j=0;j<datas.length;j++){
				for(var z =0;z<dataX1.length;z++){
					if(datas[j].dataDate.split('T')[1].split(':')[0]+':'+datas[j].dataDate.split('T')[1].split(':')[1] == dataX1[z]){
						dataY3.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		totalNumss = 0;
		for(var i=0;i<dataY3.length;i++){
			totalNumss += parseInt(dataY3[i]);
		}
		$('.tongbizhi').html(totalNumss);
		if(totalNumss != 0 ){
			growthRate = ((totalNum-totalNumss)/totalNumss * 100).toFixed(2);
			$('.span-2').html(growthRate + '%');
			if(growthRate >= 0){
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}else{
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}
		}else if(totalNumss == 0){
			$('.span-2').html('出错了!');
		}
	}else{
		//环比（横坐标）
		for(var i=0;i<allDataX.length;i++){
			var datas = allDataX[i];
			for(var j=0;j<datas.length;j++){
				var currentArr = datas[j];
				for(var z=0;z<currentArr.length;z++){
					if(dataX.indexOf(currentArr[z].dataDate.split('T')[0])<0){
						dataX.push(currentArr[z].dataDate.split('T')[0]);
					}
				}
			}
		}
		//环比（确定y周数据）
		for(var i=0;i<allBranch.length;i++){
			var datas = allBranch[i];
			for(var j=0;j<datas.length;j++){
				for(var z=0;z<dataX.length;z++){
					if( datas[j].dataDate.split('T')[0] == dataX[z]){
						dataY1.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		totalNum = 0;
		for(var i=0;i<dataY1.length;i++){
			totalNum += parseInt(dataY1[i]);
		}
		$('.content-left-top-tips span').html(totalNum);
		for(var i=0;i<allBranchs.length;i++){
			var datas = allBranchs[i];
			for(var j=0;j<datas.length;j++){
				for(var z=0;z<dataX.length;z++){
					if( datas[j].dataDate.split('T')[0] == dataX[z]){
						dataY2.push(datas[j].data.toFixed(2));
					}
				}
			}
		}
		var maxDataa = _.max(datas,function(d){return d.data}).data;
		var maxDiss = parseInt(maxDataa/2).toString().length-1;
		var  maxDis = 1;
		for(var i=0;i<maxDiss;i++){
			maxDis = maxDis * 10;
		}
		totalNums = 0;
		for(var i=0;i<dataY2.length;i++){
			totalNums += parseInt(dataY2[i]);
		}
		$('.huanbizhi').html(totalNums);
		if(totalNums != 0 ){
			growthRate = ((totalNum-totalNums)/totalNums * 100).toFixed(2);
			$('.span-1').html(growthRate + '%');
			if(growthRate >= 0){
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}else{
				$('.content-left-top-arrow').css({
					'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
					'background-size':'90%'
				})
			}
		}else if(totalNums == 0){
			$('.span-1').html('出错了!');
		};
		if(_ajaxDateType_1 == '周'){
			$('.right-top').eq(1).hide();
		}else{
			$('.right-top').eq(1).show();
			//同比（横坐标）
			for(var i=0;i<allDateX1.length;i++){
				var datas = allDateX1[i];
				for(var j=0;j<datas.length;j++){
					var currentArr = datas[j];
					for(var z=0;z<currentArr.length;z++){
						if(dataX1.indexOf(currentArr[z].dataDate.split('T')[0])<0){
							dataX1.push(currentArr[z].dataDate.split('T')[0]);
						}
					}
				}
			}
			//同比（纵坐标）；
			for(var i=0;i<allBranchss.length;i++){
				var datas = allBranch[i];
				for(var j=0;j<datas.length;j++){
					for(var z=0;z<dataX1.length;z++){
						if( datas[j].dataDate.split('T')[0] == dataX[z]){
							dataY3.push(datas[j].data.toFixed(2));
						}
					}
				}
			}
			totalNumss = 0;
			for(var i=0;i<dataY3.length;i++){
				totalNumss += parseInt(dataY3[i]);
			}
			$('.tongbizhi').html(totalNumss);
			if(totalNumss != 0 ){
				growthRate = ((totalNum-totalNumss)/totalNumss * 100).toFixed(2);
				$('.span-2').html(growthRate + '%');
				if(growthRate >= 0){
					$('.content-left-top-arrow').css({
						'background':'url(./work_parts/img/prompt-arrow1.png)no-repeat -3px -5px',
						'background-size':'90%'
					})
				}else{
					$('.content-left-top-arrow').css({
						'background':'url(./work_parts/img/prompt-arrow2.png)no-repeat -3px -5px',
						'background-size':'90%'
					})
				}
			}else if(totalNumss == 0){
				$('.span-2').html('出错了!');
			}
		}


	}
	//电-环比分析-柱折图
	myChart13 = echarts.init(document.getElementById('rheader-content-16'));
	option13 = {
		tooltip: {
			trigger: 'axis'
		},
		toolbox: {
			feature: {
				dataView: {show: true, readOnly: false},
				magicType: {show: true, type: ['line', 'bar']},
				restore: {show: true},
				saveAsImage: {show: true}
			}
		},
		legend: {
			data:['本期用电','上期用电']
		},
		xAxis: [
			{
				type: 'category',
				data:dataX
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '用电量',
				min: 0,
				max: maxData,
				interval: maxDis,
				axisLabel: {
					formatter: '{value}'
				}
			}
		],
		series: [
			{
				name:'本期用电',
				type:'bar',
				data:dataY1
			},
			{
				name:'上期用电',
				type:'bar',
				data:dataY2
			}
		]
	};
	myChart13.setOption(option13);
	//电-环比分析-柱状图
	myChart14 = echarts.init(document.getElementById('rheader-content-17'));
	option14 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:['比较斜率', '累计值']
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {readOnly: false},
				restore: {},
				saveAsImage: {}
			}
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: true,
				data:['本期','上期']
			},
			{
				type: 'category',
				boundaryGap: true,
				data: ['本期','上期']
			}
		],
		yAxis: [
			{
				type: 'value',
				scale: true,
				name: '价格',
				max: 10000000,
				min: 0
			},
			{
				type: 'value',
				scale: true,
				name: '预购量',
				max: 10000000,
				min: 0
			}
		],
		series: [
			{
				name:'累计值',
				type:'bar',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data:[totalNum,totalNums]
			},
			{
				name:'比较斜率',
				type:'line',
				data:[totalNum,totalNums]
			}
		]
	};
	myChart14.setOption(option14);
	//电-同比分析-柱折图
	myChart15 = echarts.init(document.getElementById('rheader-content-18'));
	option15 = {
		tooltip: {
			trigger: 'axis'
		},
		toolbox: {
			feature: {
				dataView: {show: true, readOnly: false},
				magicType: {show: true, type: ['line', 'bar']},
				restore: {show: true},
				saveAsImage: {show: true}
			}
		},
		legend: {
			data:['本期用电','上期用电']
		},
		xAxis: [
			{
				type: 'category',
				data:dataX1
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '用电量',
				min: 0,
				max: maxData,
				interval: maxDis,
				axisLabel: {
					formatter: '{value}'
				}
			}
		],
		series: [
			{
				name:'本期用电',
				type:'bar',
				data:dataY1
			},
			{
				name:'上期用电',
				type:'bar',
				data:dataY3
			}
		]
	};
	myChart15.setOption(option15);
	//电-同比分析-柱状图
	myChart16 = echarts.init(document.getElementById('rheader-content-19'));
	option16 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:['比较斜率', '累计值']
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {readOnly: false},
				restore: {},
				saveAsImage: {}
			}
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: true,
				data:['本期','上期']
			},
			{
				type: 'category',
				boundaryGap: true,
				data: ['本期','上期']
			}
		],
		yAxis: [
			{
				type: 'value',
				scale: true,
				name: '价格',
				max: 10000000,
				min: 0
			},
			{
				type: 'value',
				scale: true,
				name: '预购量',
				max: 10000000,
				min: 0
			}
		],
		series: [
			{
				name:'累计值',
				type:'bar',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data:[totalNum,totalNumss]
			},
			{
				name:'比较斜率',
				type:'line',
				data:[totalNum,totalNumss]
			}
		]
	};
	myChart16.setOption(option16);

}
