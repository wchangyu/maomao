$(function(){
	//开始&结束时间；
	_startTimes = moment().format("YYYY-MM-DD");
	_startTime = moment().format("YYYY/MM/DD");
	_endTimes = moment().format("YYYY-MM-DD");
	_endTime = moment().add(1,'d').format("YYYY/MM/DD");
	_curDef = JSON.parse(sessionStorage.historyData_ProcDef);
	$('.L-content-header').html(_curDef.prDefNM + "(" + _startTimes + ")");
	//时间插件
	$('#datepicker').datepicker(
		{
			language:  'zh-CN',
			todayBtn: 1,
			todayHighlight: 1,
			format: 'yyyy-mm-dd',
			autoclose: true
		}
	).on('changeDate',function(e){
		$('.L-leftArrow').removeAttr('disable');
		$('.L-leftArrow').css({
			'background':'url(./work_parts/img/leftArrowa.png)no-repeat',
			'background-size':'20px',
			'background-position':'center'
		});
		$('.L-rightArrow').removeAttr('disable');
		$('.L-rightArrow').css({
			'background':'url(./work_parts/img/rightArrowa.png)no-repeat',
			'background-size':'20px',
			'background-position':'center'
		});
	});

	$('.L-content-tip').click(function(){
		$('.L-content-tip').css({
			borderBottom:'1px solid #a7adad'
		})
		$(this).css({
			borderBottom:'none'
		})
		$('.L-content-block-main').removeClass('shows').addClass('hiddens');
		$('.L-content-block-main').eq($(this).index()).removeClass('hiddens').addClass('shows');
	});

	//echarts
	myChart = echarts.init(document.getElementById('echartImg'));
	option = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:['温度']
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
		dataZoom: [
		    {
		        type: 'inside'
		    }
		],
		series: [
			{
				name:'温度',
				type:'line',
				data:[],
				markPoint : {
					data : [
						{type : 'max', name: '最大值'},
						{type : 'min', name: '最小值'}
					],
					itemStyle : {
						normal:{
							color:'#019cdf'
						}
					},
					label:{
						normal:{
							textStyle:{
								color:'#d02268'
							}
						}
					}
				},
				markLine : {
					data : [
						{type : 'average', name: '平均值'}


					]
				}
			}
		]
	};
	//时间处理
	getDatas();
	tableImg();
	$('#datepicker').val(_startTimes);
	$('.btn').eq(0).click(function(){
		var dataValue = $('#datepicker').val();
		var dataValues = moment(dataValue).add(1,'d').format('YYYY-MM-DD');
		$('.L-content-header').html(_curDef.prDefNM + "(" + dataValue + ")");
		var dataSplit = dataValue.split('-');
		var dataSplits = dataValues.split('-');
		var startTimes = dataSplit[0] + '/' + dataSplit[1] + '/' + dataSplit[2];
		var endTimes = dataSplits[0] + '/' + dataSplits[1] + '/' + dataSplits[2];
		//开始&结束时间赋值；
		_startTime  = startTimes;
		_endTime = endTimes;
		getDatas();
		tableImg();
	});
	$('body').mouseover(function(){
		if(myChart){
			myChart.resize();
		}
	});
	//表格
	$('#datatables').DataTable({
		"autoWidth": false,  //用来启用或禁用自动列的宽度计算
		"paging": true,   //是否分页
		"destroy": true,//还原初始化了的datatable
		"searching": false,
		"ordering": false,
		'language': {
			'emptyTable': '没有数据',
			'loadingRecords': '加载中...',
			'processing': '查询中...',
			'lengthMenu': '每页 _MENU_ 条',
			'zeroRecords': '没有数据',
			'info': '第 1 页 / 总 1 页',
			'infoEmpty': '没有数据'
		},
		"dom":'B<"clear">lfrtip',
		'buttons': [
			{
				extend:'csvHtml5',
				text:'保存csv格式'
			},
			{
				extend: 'excelHtml5',
				text: '保存为excel格式'
			},
			{
				extend: 'pdfHtml5',
				text: '保存为pdf格式'
			}
		],
		"columns": [
			{
				"title": "时间",
				"data":'date'
			},
			{
				"title": "数量" ,
				"data":"cdData"
			}
		]
	});
	//echart
	//左箭头点击效果
	$('.L-leftArrow').click(function(){
		LeftEchartsFun();
	});

	//右箭头点击效果
	$('.L-rightArrow').click(function(){
		RightEchartsFun();
	});

	var zoomSize = 6;
	myChart.on('click', function (params) {
	    //console.log(allDataX[Math.max(params.dataIndex - zoomSize / 2, 0)]);
	    myChart.dispatchAction({
	        type: 'dataZoom',
	        startValue: allDataX[Math.max(params.dataIndex - zoomSize / 2, 0)],
	        endValue: allDataX[Math.min(params.dataIndex + zoomSize / 2, allDataY.length - 1)]
	    });
	});

});
var myChart;
window.onresize = function () {
	if(myChart){
		myChart.resize();
	}
};

//获取数据；
function getDatas(){
	//存放原始数据的数组
	var allDatas = [];
	var dataX = [];
	var dataY =[];
	var dataId = _curDef.dType + "+" + _curDef.dkId;
	var prm = {
		dkid : dataId,
		st : _startTime,
		et : _endTime
	};
	var url = sessionStorage.apiUrlPrefix;
	$.ajax({
		type:'post',
			url:url + 'pr/pr_GetPRInstHistoryData',
			data:prm,

			beforeSend:function(){

            	$('.L-loadding').show();
				//需求：button禁止操作，设置超时。
        	},
			success:function(data){

				for(var i=0;i<data.length;i++){
					allDatas.push(data[i]);
				}
				$('.L-loadding').hide();

				for(var i=0;i<allDatas.length;i++){

					if(allDatas[i].date == ''){
						continue;
					}
					var aa = allDatas[i].date.split(' ')[0].split('/');
					var bb = aa[1] + '-' + aa[2];
					var cc = allDatas[i].date.split(' ')[1].split(':');
					var Xdatas = bb + ' ' + cc[0] + ':' + cc[1];
					dataX.push(Xdatas);
					dataY.push(allDatas[i].cdData.toFixed(2))
				}
				option.xAxis.data = dataX;
				option.series[0].data = dataY;
				//获取到显示名称
				var curDef = JSON.parse(sessionStorage.historyData_ProcDef);
				var legend = curDef.prDefNM;
				option.legend.data = [];
				option.legend.data.push(legend);
				option.series[0].name = legend;
				myChart.setOption(option);
			}
	})

};

function tableImg(){
	var dataId = _curDef.dType + "+" + _curDef.dkId;
	var prm = {
		dkid : dataId,
		st : _startTime,
		et : _endTime
	};
	var url = sessionStorage.apiUrlPrefix;
	var allDatas = [];
	var allDates = [];
	var allArr = [];
	$.ajax({
		type:'post',
		url:url + 'pr/pr_GetPRInstHistoryData',
		data:prm,
		success:function(result){
			console.log(result);
			for(var i=0;i<result.length;i++){
				allDatas.push(result[i].cdData);
				var dateSplit = '';
				if(result[i].date != ''){
					var aa = result[i].date.split(' ')[0].split('/');
					var bb = aa[1] + '-' + aa[2];//11-06
					var cc = result[i].date.split(' ')[1].split(':');
					var dd = cc[0] + ':' + cc[1];
					dateSplit = bb + ' ' + dd;
				}

				allDates.push(dateSplit);
			}
			for(var i=0;i<allDatas.length;i++){
				var allArrs = {};
				allArrs.date = allDates[i];
				allArrs.cdData = allDatas[i]
				allArr.push(allArrs);
			};
			var dt = $("#datatables").dataTable();
			if(allArr.length == 0){
				return false;
			}
			//清空一下table
			dt.fnClearTable();
			//想表格中添加东西数据o
			console.log(allArr);
			dt.fnAddData(allArr);
			//重绘表格
			dt.fnDraw();
		}
	})
};

//左箭头功能图表
function LeftEchartsFun(){
	//获取当前时间的开始时间
	//先判断现在的开始时间和结束时间
	var dateValue = _startTime;
	_startTime = moment(dateValue).subtract(1,'d').format("YYYY/MM/DD");
	DateDiff(_startTime,_endTime);
	if(iDays <8){
		getDatas();
		tableImg();
		var times = _startTime.split('/');
		var startTimee = times[0] + '-' + times[1] + '-' + times[2];
		var timesa = moment(_endTime).subtract(1,'d').format('YYYY/MM/DD').split('/');
		var endTimee = timesa[0] + '-' + timesa[1] + '-' + timesa[2];
		$('.L-content-header').html(_curDef.prDefNM + '(' + startTimee + '到' + endTimee + ')');
		if(iDays == 7){
			$('.L-leftArrow').attr('disable');
			$('.L-leftArrow').css({
				'background':'url(./work_parts/img/LeftArrowb.png)no-repeat',
				'background-size':'20px',
				'background-position':'center'
			});
			$('.L-rightArrow').attr('disable');
			$('.L-rightArrow').css({
				'background':'url(./work_parts/img/RightArrowb.png)no-repeat',
				'background-size':'20px',
				'background-position':'center'
			});
		}}
}
//右箭头功能图表
function RightEchartsFun(){
	var dateValue = _endTime;
	_endTime = moment(dateValue).add(1,'d').format("YYYY/MM/DD");
	DateDiff(_startTime,_endTime);
	if(iDays <8){
		getDatas();
		tableImg();
		var times = _startTime.split('/');
		var startTimee = times[0] + '-' + times[1] + '-' + times[2];
		var timesa = moment(_endTime).subtract(1,'d').format('YYYY/MM/DD').split('/');
		var endTimee = timesa[0] + '-' + timesa[1] + '-' + timesa[2];
		$('.L-content-header').html(_curDef.prDefNM + '(' + startTimee + '到' + endTimee + ')');
		if(iDays == 7){
			$('.L-rightArrow').attr('disable');
			$('.L-rightArrow').css({
				'background':'url(./work_parts/img/RightArrowb.png)no-repeat',
				'background-size':'20px',
				'background-position':'center'
			});
			$('.L-leftArrow').attr('disable');
			$('.L-leftArrow').css({
				'background':'url(./work_parts/img/LeftArrowb.png)no-repeat',
				'background-size':'20px',
				'background-position':'center'
			})
		}
	}
}
//判断时间的天数
var iDays;
function DateDiff(sDate1, sDate2)
	{
		var aDate, oDate1, oDate2;
		aDate = sDate1.split("/")
		oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]) //转换为12-18-2002格式
		aDate = sDate2.split("/")
		oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])
		iDays = parseInt((oDate2 - oDate1) / 1000 / 60 / 60 /24) //把相差的毫秒数转换为天数
		return iDays
	}