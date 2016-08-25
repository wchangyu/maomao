$(function(){
	//读取目录
	getSessionStoragePointer();
	getSessionStorageOffice();
	//获取时间
	startTime();
	endTime();
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
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
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
	//加载时的echarts
	getEcType();
	startTime();
	endTime();
	BreakdownEnergyConsumption();
	$('.btns').click(function(){
		getEcType();
		startTime();
		endTime();
		BreakdownEnergyConsumption();
		console.log("能耗种类是："+_ajaxEcType);
		console.log("选择的id是："+_ajaxPointerId);
		console.log("开始时间是："+_ajaxStartTime);
		console.log("结束时间是："+_ajaxEndTime);
	})
})
var myChart36;
var myChart37;
var myChart38;
var myChart39;
var myChart40;
window.onresize = function () {
    myChart36.resize(); 
    myChart37.resize();
    myChart38.resize();
    myChart39.resize();
	myChart40.resize();
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
//选中的能耗种类
var _ajaxEcType=01;
function getEcType(){
	_ajaxEcType=$('.selectedEnergy').attr('value');
	//console.log(_ajaxEcType)
}
//获取开始结束时间
var _ajaxStartTime;
function startTime(){
	//存放拆分的数组；
	var startArr=[];
	var startTime = $('.drp-calendar-date').eq(0).html();
	//console.log(startTime);
	startArr=startTime.split('/');
	//console.log(startArr);
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
	//console.log(_ajaxStartTime);
	$('.header-three-1').eq(0).html(_ajaxStartTime);
}
var _ajaxEndTime;
function endTime(){
	//存放拆分的数组；

	var endArr=[];
	var endTime = $('.drp-calendar-date').eq(1).html();
	//console.log(startTime);
	endArr=endTime.split('/');
	//console.log(endArr);
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
	//console.log(_ajaxEndTime);
	$('.header-three-1').eq(2).html(_ajaxEndTime);
}
//获取楼宇分项数据
function BreakdownEnergyConsumption(){
	var energyItemIds=['01','40','02','41','42'];
	//存放结果的数组
	var resultArr=[];
	//存放数值的数组
	var valueArr=[];
	//存放名称的数组
	var nameArr=[];
	var  data=[];
	for(var i=0;i<energyItemIds.length;i++){
		resultArr=[];
		valueArr=[];
		nameArr=[];
		data=[];
		energyItemIdss=energyItemIds[i];
		var ecParams={
			'pointerID':_ajaxPointerId,
			'energyItemIDs':energyItemIdss,
			'startTime':_ajaxStartTime,
			'endTime':_ajaxEndTime
		}
		$.ajax({
			type:'post',
			url:'http://211.100.28.180/BEEWebAPI/api/EnergyItemDatas/getChildrenEnergyItemEcData',
			data:ecParams,
			async:false,
			success:function(result){
				//console.log(result);
				for(var j=0;j<result.length;j++){
					resultArr.push(result[j]);
					for(var r=0;r<resultArr.length;r++){
						if(valueArr.indexOf(resultArr[r].ecData)<0){
							valueArr.push(resultArr[r].ecData);
						}
						if(nameArr.indexOf(resultArr[r].energyItemName)<0){
							nameArr.push(resultArr[r].energyItemName);
						}

					}
				}
			}
		})
		//console.log(valueArr)
		//console.log(resultArr)
		for(z=0;z<nameArr.length;z++){
			var obj={};
			obj.value=valueArr[z];
			obj.name=nameArr[z];
			data.push(obj)
		}
		//console.log(data)
		if(energyItemIdss == '01'){
			//饼状图-center-电
			myChart36 = echarts.init(document.getElementById('energy-parts-total'));
			option36 = {
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				series: [
					{
						name:'访问来源',
						type:'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data:data,
						itemStyle: {
							normal: {
								color: function(params) {

									var colorList = [
										'#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
										'#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
										'#D7504B','#C6E579','#F4E001','red','#26C0C0'
									];
									return colorList[params.dataIndex]
								}
							}
						}
					}
				]
			};
			myChart36.setOption(option36);
		}else if(energyItemIdss == '40'){
			//饼状图-top-left-电
			myChart37 = echarts.init(document.getElementById('energy-parts-one'));
			option37 = {
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				series : [
					{
						name: '访问来源',
						type: 'pie',
						radius : '55%',
						center: ['50%', '50%'],
						data:data,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							},
							normal: {
								color: function(params) {

									var colorList = [
										'#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
										'#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
										'#D7504B','#C6E579','#F4E001','red','#26C0C0'
									];
									return colorList[params.dataIndex]
								}
							}
						}
					}
				]
			};
			myChart37.setOption(option37);
		}else if(energyItemIdss == '02'){
			//饼状图-top-left-电
			myChart37 = echarts.init(document.getElementById('energy-parts-two'));
			option37 = {
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				series : [
					{
						name: '访问来源',
						type: 'pie',
						radius : '55%',
						center: ['50%', '50%'],
						data:data,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							},
							normal: {
								color: function(params) {

									var colorList = [
										'#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
										'#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
										'#D7504B','#C6E579','#F4E001','red','#26C0C0'
									];
									return colorList[params.dataIndex]
								}
							}
						}
					}
				]
			};
			myChart37.setOption(option37);
		}else if(energyItemIdss == '41'){
			//饼状图-top-left-电
			myChart37 = echarts.init(document.getElementById('energy-parts-three'));
			option37 = {
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				series : [
					{
						name: '访问来源',
						type: 'pie',
						radius : '55%',
						center: ['50%', '50%'],
						data:data,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							},
							normal: {
								color: function(params) {

									var colorList = [
										'#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
										'#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
										'#D7504B','#C6E579','#F4E001','red','#26C0C0'
									];
									return colorList[params.dataIndex]
								}
							}
						}
					}
				]
			};
			myChart37.setOption(option37);
		}else if(energyItemIdss == '42'){
			//饼状图-top-left-电
			myChart37 = echarts.init(document.getElementById('energy-parts-four'));
			option37 = {
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				series : [
					{
						name: '访问来源',
						type: 'pie',
						radius : '55%',
						center: ['50%', '50%'],
						data:data,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							},
							normal: {
								color: function(params) {

									var colorList = [
										'#6bb1a6','#f4cd6e','#ccefc5','#69b4b9','#e5f1e3',
										'#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
										'#D7504B','#C6E579','#F4E001','red','#26C0C0'
									];
									return colorList[params.dataIndex]
								}
							}
						}
					}
				]
			};
			myChart37.setOption(option37);
		}
	}

}