$(function(){
	//读取目录
	getSessionStoragePointer();
	getSessionStorageOffice();
	//能耗种类
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
	})
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
	})
	$(".gas").click(function(){
		$(this).css({
			"background":"url(./work_parts/img/gas_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".electricity").css({
			"background":"url(./work_parts/img/electricity.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$(".water").css({
			"background":"url(./work_parts/img/water.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
	//对象选择
	$(".left-middle-tab").click(function(){
		//alert($(this).index())
		//alert($(".left-middle-list").width())
		$(".left-middle-tab").css({
			"border":"2px solid #7f7f7f",
			"background":"#f1f3fa",
			"color":"#333"
		})
		$(this).css({
			"background":"#7f7f7f",
			"border":"2px solid #7f7f7f",
			"color":"#ffffff"
		})
		$(".tree").hide();
		//alert($(this).index()-1)
		$('.tree')[$(this).index()-1].style.display="block";
	})
	//确定选中的楼宇id
	$('.tree:eq(0)').delegate('span','click',function(){
		//确保只有当前点击的span是黄色
		$('.tree:eq(0) span').removeClass('active');
		$('.tree:eq(1) span').removeClass('active');
		$(this).addClass('active');
		//console.log($('.tree-1:eq(0) span').index(this))
		_ajaxPointerId=_allPointerId[$('.tree:eq(0) span').index($(this))];
		//console.log(_ajaxPointerId)
	})
	//确定选中的科室id
	$('.allOffices').delegate('span','click',function(){
		$('.tree:eq(0) span').removeClass('active');
		$('.tree:eq(1) span').removeClass('active');
		$(this).addClass('active');
		_ajaxPointerId=_allOfficeId[$('.tree:eq(1) span').index($(this))];
		//console.log(_ajaxPointerId)
	})
	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	})
	//时间选择
	//时间选取
	$('.time-options').eq(0).click(function(){
		$('.time-options').removeClass('time-options-1');
		$(this).addClass('time-options-1');
	})
	$('.time-options').eq(1).click(function(){
		$('.time-options').removeClass('time-options-1');
		$(this).addClass('time-options-1');
	})
	$('.time-options').eq(2).click(function(){
		$('.time-options').removeClass('time-options-1');
		$(this).addClass('time-options-1');
	})
	$('.time-options').eq(3).click(function(){
		$('.time-options').removeClass('time-options-1');
		$(this).addClass('time-options-1');
	})
	//电-12/52选项卡
	$(".top-header-lists").click(function(){
		$(".top-header-lists").css({
			"border":"1px solid #808080",
			"color":"#333",
			"background":"#fff"
		}),
		$(this).css({
			"background":"#808080",
			"color":"#fff"
		})
	})
	//逐12个月用电趋势
	$('.btns1').click(function(){
		//确定选中的是楼宇还是科室
		if(($('.main-left-middle .tree:eq(0):visible').length != 0)){
			//alert("楼宇")
			getEcType();
			dateType();
			startTimes();
			getData();
			console.log("选中的能耗种类为："+_ajaxEcType);
			console.log("选中的楼宇id为："+_ajaxPointerId);
		}else if(($('.main-left-middle .tree:eq(0):visible').length == 0)){
			//alert("科室")
			getEcTypeWord();
			console.log("选中的科室的id为："+_ajaxPointerId);
			console.log("选中的能耗种类名称为："+_ajaxEcTypeWord);
		}
	})
})
var myChart45;
window.onresize = function () {
    myChart45.resize();
}
//楼宇目录
//创建存放区域的id
var _allPointerId=[0];
//创建存放楼宇的id
var _allOfficeId=[];
//请求数据时选择的楼宇id
var _ajaxPointerId=0;
//首先将sessionStorage的内容写入html中
function getSessionStoragePointer(){
	var jsonText1=sessionStorage.getItem('pointers');
	var htmlTxet1 = JSON.parse(jsonText1);
	var _allSter1='<li><span class="choice">'+htmlTxet1[0].pointerName+'</span></li>';
	_allSter1+='<li><span class="choice">'+htmlTxet1[1].pointerName+'</span></li>'
	for(var i=2;i<htmlTxet1.length;i++){
		_allSter1 +='<li><span class="choice">'+htmlTxet1[i].pointerName+'</span></li>'
	}
	for(var i=0;i<htmlTxet1.length;i++){
		_allPointerId.push(htmlTxet1[i].pointerID)
	}
	//console.log(_allPointerId)
	$('.allPointer').append(_allSter1);
}
function getSessionStorageOffice(){
	var jsonText2=sessionStorage.getItem('offices');
	var htmlText2 = JSON.parse(jsonText2);
	var _allSter2 ='<li><span class="choice">'+htmlText2[0].f_OfficeName+'</span></li>'
	for(var i=1;i<htmlText2.length;i++){
		_allSter2 += '<li><span class="choice">'+htmlText2[i].f_OfficeName+'</span></li>'
	}
	for(var i=0;i<htmlText2.length;i++){
		_allOfficeId.push(htmlText2[i].f_OfficeID)
	}
	//console.log(_allOfficeId)
	$('.allOffices').append(_allSter2);
}
//设置getEcType的初始值(数值，pointer时用)
var _ajaxEcType=01;
function getEcType(){
	//首先判断哪个含有selectedEnergy类
	$('.selectedEnergy').attr('value');
	if($('.selectedEnergy').attr('value')==01){
		$('.header-one').html('电');
	}else if($('.selectedEnergy').attr('value')==211){
		$('.header-one').html('水');
	}else if($('.selectedEnergy').attr('value')==311){
		$('.header-one').html('气');
	}
	//console.log($('.selectedEnergy').attr('value'));
	_ajaxEcType=$('.selectedEnergy').attr('value');
	//console.log(_ajaxEcType)
}
//设置getECType的初始值(文字，office时用);
var _ajaxEcTypeWord="电";
function getEcTypeWord(){
	_ajaxEcTypeWord=$('.selectedEnergy').children().html();
	//console.log(_ajaxEcTypeWord)
}
//确定时间是按日周月年
var _ajaxDataType='日'
function dateType(){
	_ajaxDataType=$('.time-options .time-options-1').text();
	//console.log(_ajaxDataType);
}
//时间确定
var startTime
function startTimes(){
	startTime=moment().format("YYYY/MM/DD");
	//console.log(startTime)
}
//获取数据
function getData(){
	var _allData=[];
	//存放x轴数据
	var dataX=[];
	var dataY=[];
	var maxY=[];
	var maxY_1=0;
	//变化趋势
	var aa=[0];
	var aaa=0;
	var ecParams={
		'ecTypeId':_ajaxEcType,
		'pointerId':_ajaxPointerId,
		'startTime':startTime,
		'dateType':'日'
	}
	$.ajax({
		type:'post',
		url:'http://211.100.28.180/BEEWebAPI/api/EcDatas/GetEnergyTrendency',
		data:ecParams,
		async:false,
		success:function(result){
			for(var i=0;i<result.length;i++){
				_allData.push(result[i])
			}
		}
	})
	//console.log(_allData)
	for(var i=0;i<_allData.length;i++){
		if(dataX.indexOf(_allData[i].dataDate.split('T')[0])<0){
			dataX.push(_allData[i].dataDate.split('T')[0]);
		}
		if(dataY.indexOf(_allData[i].data)<0){
			dataY.push(_allData[i].data);
			maxY.push(_allData[i].data);
		}
	}
	dataX.sort();
	maxY_1=maxY.sort(function compare(a,b){return b-a})[0];
	//console.log(maxY_1)      128103.3368   [30000,60000,90000,100000,130000,150000]
	for(var x=1;x<dataY.length;x++){
		var aaa = (dataY[x]-dataY[x-1])/dataY[x-1]*100%
		aa.push(aaa.toFixed(1));
	}
	console.log(aa)
	//console.log(dataX)
	//console.log(dataY)
	myChart45 = echarts.init(document.getElementById('rheader-content-45'));
	option45 = {
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
			data:['用电量']
		},
		xAxis: [
			{
				type: 'category',
				data: dataX
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '用电量 kWh',
				min: 0,
				max: 150000,
				interval: 30000,
				axisLabel: {
					formatter: '{value} ml'
				}
			},
			{
				type: 'value',
				name: '变化趋势',
				min: -9,
				max: 12,
				interval: 3,
				axisLabel: {
					formatter: '{value} °C'
				}
			}
		],
		series: [
			{
				name:'用电量 kWh',
				type:'bar',
				data:dataY,
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
				yAxisIndex: 1,
				data:aa
			}
		]
	};
	myChart45.setOption(option45);
}