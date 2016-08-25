$(function(){
	//读取本地存储数据
	$.fn.zTree.init($("#pointer"), setting, jsonText2);
	$.fn.zTree.init($("#allOffices"), setting1, jsonText1);
	getPointerName();
	getOfficeName();
	//默认选中楼宇样式
	$('#pointer li .chk').eq(0).addClass('checkbox_true_full');
	$('#pointer li .chk').eq(1).addClass('checkbox_true_full');
	//设置楼宇默认ID
	defaultCheckPointer();
	getPointerIndex();
	//默认选中科室样式
	$('#allOffices li .chk').eq(0).addClass('checkbox_true_full');
	$('#allOffices li .chk').eq(1).addClass('checkbox_true_full');
	//设置科室默认ID
	defaultCheckOffice();
	//页面加载时获得的数据
	//选择的能耗种类
	getEcType();
	//获取选择的pointer的名称；
	hasCheckboxTrue();
	//获取选择的office的名称；
	hasCheckboxTrue1();
	//选择的id;
	if(($('.main-left-middle .tree-2:eq(0):visible').length != 0)){
		//选择楼宇ID
		treeObject1();
	}else if(($('.main-left-middle .tree-2:eq(0):visible').length == 0)){
		//选择科室ID
		treeObject2();
	}
	//获取开始时间
	startTime();
	//结束时间
	endTime();
	//按小时，周，月，年
	dataType();
	//页面加载运行ajax
	getPointerData();
	//水电选择
	$(".electricity_aa_4").click(function(){
        $(this).css({
            "background":"url(./work_parts/img/electricity_hover.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
        $(".water_aa_4").css({
            "background":"url(./work_parts/img/water.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
		$(".gas_aa_4").css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
    })
    $(".water_aa_4").click(function(){
        $(this).css({
            "background":"url(./work_parts/img/water_hover.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
        $(".electricity_aa_4").css({
             "background":"url(./work_parts/img/electricity.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
		$(".gas_aa_4").css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
    })
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
	})
    //对象选择
    $('.left-middle-tab').eq(0).click(function(){
		$('.left-middle-tab').css(
		 {
		 'background':'#f1f3fa',
		 'color':'#333'
		 }
		 )
		$(this).css({
			'background':'#7f7f7f',
			'color':'#fff'
		})
        $('.tree-1').hide();
        $('.tree-2').show();

    })
	$('.left-middle-tab').eq(1).click(function(){
		$('.left-middle-tab').css(
			{
				'background':'#f1f3fa',
				'color':'#333'
			}
		)
		$(this).css({
			'background':'#7f7f7f',
			'color':'#fff'
		})
		$('.tree-1').hide();
		$('.tree-3').show();
	})
	//默认的选中复选框前两个
	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	})
	//复选框
	$('.checkBtn').click(function(){
		if($(this).parents('.pointer').length !=0){
			officeChecked();
		}else if($(this).parents('.pointer').length ==0){
			pointerChecked();
		}
	})

	//点击按钮
	$('.btns').click(function(){
		hasCheckboxTrue();
		hasCheckboxTrue1();
		//选择的能耗种类(数值)
		getEcType();
		//选择的能耗种类(名称)
		getEcTypeWord();
		//选择的id;
		if(($('.main-left-middle .tree-2:eq(0):visible').length != 0)){
			//选择楼宇ID
			treeObject1();
			//echarts
		}else if(($('.main-left-middle .tree-2:eq(0):visible').length == 0)){
			//选择科室ID
			treeObject2();
		}
		//获取开始时间
		startTime();
		//结束时间
		endTime();
		dataType();
		if(($('.main-left-middle .tree-1:eq(0):visible').length != 0)){
			$('#tbody').empty();
			getPointerData();
		}else if(($('.main-left-middle .tree-1:eq(0):visible').length == 0)){
			$('#tbody').empty();
			getOfficeData();
		}
	})

})
var myChart11;
//让echarts自适应
window.onresize = function () {
    myChart11.resize();
}
//从缓存中读取数据
//ajax的参数（ecType，pointerId，startTime，endTime，dateType）
//确定ecType
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
//zTree配置项(楼宇)
	var setting = {
		check: {
			enable: true,
			chkStyle: "checkbox",
			chkboxType: { "Y": "ps", "N": "ps" }
		},
		data: {
			key: {
				name: "pointerName"
			},
			simpleData: {
				enable: true
			}
		},
		view:{
			showIcon: false
		}
	};
	var jsonText2=JSON.parse(sessionStorage.getItem('pointers'));
var _ajaxPointerId=['8909180101','8909180102'];
//获取当前被选中的楼宇节点数据集合
function treeObject1(){
	var treeObject1=$.fn.zTree.getZTreeObj('pointer');
	var nodes1 = treeObject1.getCheckedNodes();
	var select_ID=[];
	var select_Name=[];
	for(var i=0;i<nodes1.length;i++){
		select_ID.push(nodes1[i].pointerID);
		select_Name.push(nodes1[i].pointerName);
	}
	//console.log(select_ID + select_Name)
	$('.header-two').html(select_Name.join(" "));
	_ajaxPointerId=select_ID;
}
//页面加载时楼宇默认勾选项ID
function defaultCheckPointer(){
	var treeObject3=$.fn.zTree.getZTreeObj('pointer');
	var nodes3=treeObject3.getNodes();
	//console.log(nodes3)
	//console.log(treeObject3)
	for(var i=0;i<2;i++){
		nodes3[i].checked = true;
	}
}
//获取选中的楼宇的index值
function getPointerIndex(){
	var treeObj = $.fn.zTree.getZTreeObj("pointer");
	var nodes = treeObj.getSelectedNodes();
	//console.log(nodes)
}
//页面加载时科室默认勾选ID
function defaultCheckOffice(){
	var treeObject3=$.fn.zTree.getZTreeObj('allOffices');
	var nodes3=treeObject3.getNodes();
	//console.log(nodes3)
	//console.log(treeObject3)
	for(var i=0;i<2;i++){
		nodes3[i].checked = true;
	}
}
//zTree配置项(科室单位)
	var setting1 = {
	check: {
		enable: true,
		chkStyle: "checkbox",
		chkboxType: { "Y": "ps", "N": "ps" }
	},
	data: {
		key: {
			name: "f_OfficeName"
		},
		simpleData: {
			enable: true
		}
	},
	view:{
		showIcon: false
	}
};
	var jsonText1=JSON.parse(sessionStorage.getItem('offices'));
	//console.log(jsonText1)
//获取当前被选中的科室的节点的集合
var _ajaOfficeId=["8909180140001", "8909180140003"];
function treeObject2(){
	var treeObject2= $.fn.zTree.getZTreeObj('allOffices');
	var nodes2 = treeObject2.getCheckedNodes();
	var select_ID=[];
	var select_Name=[];
	for(var i=0;i<nodes2.length;i++){
		select_ID.push(nodes2[i].f_OfficeID);
		select_Name.push(nodes2[i].f_OfficeName);
	}
	//console.log(select_ID);
	$('.header-two').html(select_Name);
	_ajaOfficeId = select_ID;
}
//获取开始时间
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
//获取dataType
var _ajaxDataType='小时';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	//console.log(dataType)
	_ajaxDataType=dataType;
}
//存放pointer名称的数组；
var pointerName=[];
function getPointerName(){
	var jsonText2=JSON.parse(sessionStorage.getItem('pointers'));
	//console.log(jsonText2)
	for(var i=0;i<jsonText2.length;i++){
		pointerName.push(jsonText2[i].pointerName)
	}
	//console.log(pointerName)
}
//存放office名称的数量
var officeName=[];
function getOfficeName(){
	var jsonText2=JSON.parse(sessionStorage.getItem('offices'));
	//console.log(jsonText2)
	for(var i=0;i<jsonText2.length;i++){
		officeName.push(jsonText2[i].f_OfficeName)
	}
	//console.log(officeName)
}
//获得pointer数据
function getPointerData(){
	//console.log("开始日期为："+_ajaxStartTime);
	//console.log("结束日期为："+_ajaxEndTime);
	dataType();
	//console.log(_ajaxDataType)
	//用来存放x轴的数组
	var dataX=[];
	var DataX=[];
	var _allData=[];
	var _totalY=0;
	var maxY=[];
	var maxY1=0;
	var minY=[];
	var minY1=0;
	var maxDate1=0;
	var minDate1=0;
	var average=0;
	var pointerNameSelect=[];
	for(var i=0;i<_ajaxPointerId.length;i++){
		//console.log(_ajaOfficeId)
		//pointerNameSelect.push(pointerName[i]);
		pointerIds = _ajaxPointerId[i];   //id=8909180101,
		var ecParams={
			'ecTypeId':_ajaxEcType,
			'pointerId': pointerIds,
			'startTime':_ajaxStartTime,
			'endTime':_ajaxEndTime,
			'dateType':_ajaxDataType
		}
		$.ajax({
			type:'post',
			url:'http://211.100.28.180/BEEWebAPI/api/ecDatas/GetECByTypeAndPointer',
			data:ecParams,
			async:false,
			success:function(result){
				//console.log(result);
				_allData.push(result);
			}
		})
	}
	//console.log(pointerNameSelect)
	//遍历每个结果，将结果写入x轴的数组中
	//console.log(_allData)       //[[object],[object]]一次时间循环两回，  //现在的问题是如果再发送一次ajax获取数据，_allData会有四个数据，也就是发送的两次请求都存进去了；

	for(var i=0;i<_allData.length;i++){
		//创建变量，临时存放
		var datas = _allData[i];
		//console.log(datas)
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
		//console.log(DataX)
	}else{
		for(var i=0;i<dataX.length;i++){
			if(DataX.indexOf(dataX[i].split('T')[0])<0){
				DataX.push(dataX[i].split("T")[0])
			}

		}
		//console.log(DataX);
	}
	//console.log(DataX)
	var dataY=[];  //y轴数据
	for(var i=0;i<_allData.length;i++){  //遍历所有数据
		//console.log(pointerName[i])
		//循环创建series数组；
		minY=[];
		maxY=[];
		var object={};
		object.name=checkedPointerName[i];
		object.type='line';
		object.data=[];
		var currentArr=_allData[i];  //暂存两次循环的值
		//console.log(currentArr)    //第一/二次循环得到的值[object]
		for(var j=0;j<dataX.length;j++){  //循环遍历x轴中取出来的dataDate值和y轴取出的dataDate值比较是否相等，
			for(var z=0;z<currentArr.length;z++){
				if(currentArr[z].dataDate == dataX[j]){
					object.data.push(currentArr[z].data);
					maxY.push(currentArr[z].data);
					minY.push(currentArr[z].data);
				}
			}
			if(j === currentArr.length){
				object.data.push(0);
			}
		}
        //console.log(maxY);
        //console.log(minY);
		dataY.push(object);
		minY1=minY.sort(function compare(a,b){return a-b})[0];
		//console.log(minY.sort(function compare(a,b){return a-b}))
		//console.log(minY1);
		maxY1=maxY.sort(function compare(a,b){return b-a})[0];
		//console.log(maxY1)
		for(var x=0;x<object.data.length;x++){
		 _totalY+=object.data[x];
		}
        //console.log(_totalY)
		//用电平均值
		average=_totalY/object.data.length;
		//console.log(average)
		//确定时间
        if(_ajaxDataType=='小时'){
            for(var k=0;k<_allData.length;k++){
                var aas=_allData[i];
                for(var e=0;e<aas.length;e++){
                    //console.log(min)
                    if(maxY1==aas[e].data){
                        maxDate1=aas[e].dataDate.split('T')[0]+' '+aas[e].dataDate.split('T')[1];
                    }
                    if(minY1==aas[e].data){
                        minDate1=aas[e].dataDate.split('T')[0]+' '+aas[e].dataDate.split('T')[1];
                    }
                    //console.log(minY1)
                }
            }
        }else{
            for(var k=0;k<_allData.length;k++){
                var aas=_allData[i];
                for(var e=0;e<aas.length;e++){
                    //console.log(min)
                    //console.log(maxY1)
                    if(maxY1==aas[e].data){
                        maxDate1=aas[e].dataDate.split('T')[0];
                        //console.log(maxDate1)
                    }
                    if(minY1==aas[e].data){
                        minDate1=aas[e].dataDate.split('T')[0];
                    }
                    //console.log(minY1)
                }
            }
        }

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
		//console.log("能耗名称"+checkedPointerName[i]);
		//console.log("累计用电量"+_totalY);
		//console.log("用电峰值"+maxY1);
		//console.log("用电谷值"+minY1);
		//console.log("用电峰值发生时刻"+maxDate1);
		//console.log("用电谷值发生时刻"+minDate1);
		$('#tbody').append('<tr><td>'+checkedPointerName[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxY1)+'</td><td>'+maxDate1+'</td><td>'+unitConversion(minY1)+'</td><td>'+minDate1+'</td><td>'+unitConversion(average)+'</td></tr>')
        //$('#tbody').append('<tr><td>'+checkedPointerName[i]+'</td><td>'+_totalY+'</td><td>'+maxY1+'</td><td>'+maxDate1+'</td><td>'+minY1+'</td><td>'+minDate1+'</td><td>'+average+'</td></tr>')
    }
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		tooltip: {
			trigger: 'axis'
		},
		legend:{
			data:checkedPointerName
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
	for(var i=0;i<_ajaOfficeId.length;i++){
		var officeIds=_ajaOfficeId[i]
		var ecParams={
			'ecTypeId':_ajaxEcTypeWord,
			'officeId': officeIds,
			'startTime':_ajaxStartTime,
			'endTime':_ajaxEndTime,
			'dateType':_ajaxDataType
		}
		//console.log(ecParams);
		$.ajax({
			type:'post',
			url:'http://211.100.28.180/BEEWebAPI/api/ecDatas/GetECByTypeAndOffice',
			//http://211.100.28.180/BEEWebAPI/api/ecDatas/GetECByTypeAndPointer
			data:ecParams,
			async:false,
			success:function(result){
				//console.log(result);
				_allData.push(result);
			}
		})
	}
	//console.log(_allData)   [[object],[object]]
	//遍历每个结果，将结果写入x轴的数组中
	for(var i=0;i<_allData.length;i++){
		var datas=_allData[i];
		for(var j=0;j<datas.length;j++){
			//console.log(datas[i])
			if(dataX.indexOf(datas[j].dataDate)<0){
				dataX.push(datas[j].dataDate);
			}
		}
	}
	dataX.sort();
	//console.log(dataX);
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
	//console.log(DataX);
	//遍历y轴数据
	for(var i=0;i<_allData.length;i++){
		//循环创建对象
		minY=[];
		maxY=[];
		var object={};
		object.name=checkedOfficeName[i];
		object.type='line';
		object.data=[];
		var currentArr=_allData[i];
		for(var j=0;j<currentArr.length;j++){
			//console.log(currentArr[j].data)
			//虽然数据已写入，但是要留意缺数据的情况，所以还要和DataX比较
			for(var z=0;z<dataX.length;z++){

				if(currentArr[j].dataDate==dataX[z]){
					object.data.push(currentArr[j].data);
                    minY.push(currentArr[j].data);
                    maxY.push(currentArr[j].data);
				}
				if(currentArr.length===z){
					object.data.push(0);
				}
			}
		}
		//console.log(object.data)
		dataY.push(object);
        //console.log(minY);
       //console.log(maxY);
        minY1=minY.sort(function compare(a,b){return a-b})[0];
        maxY1=maxY.sort(function compare(a,b){return b-a})[0];
        for(var x=0;x<object.data.length;x++){
            _totalY+=object.data[x];
        }
        //用电平均值
        average=_totalY/object.data.length;
        //确定时间
        if(_ajaxDataType=='小时'){
            for(var k=0;k<_allData.length;k++){
                var aas=_allData[i];
                for(var e=0;e<aas.length;e++){
                    //console.log(min)
                    if(maxY1==aas[e].data){
                        //console.log(maxY1)
                        maxDate1=aas[e].dataDate.split('T')[0]+' '+aas[e].dataDate.split('T')[1];
                    }
                    if(minY1==aas[e].data){
                        minDate1=aas[e].dataDate.split('T')[0]+' '+aas[e].dataDate.split('T')[1];
                    }
                    //console.log(minY1)
                }
            }
        }else{
            for(var k=0;k<_allData.length;k++){
                var aas=_allData[i];
                for(var e=0;e<aas.length;e++){
                    //console.log(min)
                    if(maxY1==aas[e].data){
                        maxDate1=aas[e].dataDate.split('T')[0];
                    }
                    if(minY1==aas[e].data){
                        minDate1=aas[e].dataDate.split('T')[0];
                    }
                    //console.log(minY1)
                }
            }
        }
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
        $('#tbody').append('<tr><td>'+checkedOfficeName[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxY1)+'</td><td>'+maxDate1+'</td><td>'+unitConversion(minY1)+'</td><td>'+minDate1+'</td><td>'+unitConversion(average)+'</td></tr>')

    }
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		tooltip: {
			trigger: 'axis'
		},
		legend:{
			data:checkedOfficeName
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
//遍历所有.chk确认包含某个类的index值；确定当前选中的id名称；
var checkedPointerName=[];
function hasCheckboxTrue(){
	checkedPointerName=[];
	var aaa=[];
	var aa = $("#pointer").children().find(".chk");
	$.each(aa,function(i,item){
		if($(this).hasClass("checkbox_true_full")){
			aaa.push(i)
		}
	})
	//console.log(aaa);
	//console.log(pointerName)
	for(var z=0;z<aaa.length;z++){
		checkedPointerName.push(pointerName[aaa[z]])
	}
	//console.log(checkedPointerName)
}
var checkedOfficeName=[];
function hasCheckboxTrue1(){
	checkedOfficeName=[];
	var aaa=[];
	var aa = $("#allOffices").children().find(".chk");
	$.each(aa,function(i,item){
		if($(this).hasClass("checkbox_true_full")){
			aaa.push(i)
		}
	})
	//console.log(aaa);
	//console.log(pointerName)
	for(var z=0;z<aaa.length;z++){
		checkedOfficeName.push(officeName[aaa[z]])
	}
	//console.log(checkedOfficeName)
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