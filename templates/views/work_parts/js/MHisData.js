$(function(){
	//开始&结束时间；
	_startTime = moment().subtract(1,'d').format("YYYY-MM-DD");
	_endTime = moment().format("YYYY-MM-DD");
	_curDef = JSON.parse(sessionStorage.historyData_ProcDef);
	$('.L-content-header').html(_curDef.prDefNM + "(" + _startTime + ")");
	//时间插件
	$('#datepicker').datepicker(
		{
			language:  'zh-CN',
			todayBtn: 1,
			todayHighlight: 1,
			format: 'yyyy-mm-dd'
		}
	);

	$('.L-content-tip').click(function(){
		$('.L-content-tip').css({
			borderBottom:'1px solid #a7adad'
		})
		$(this).css({
			borderBottom:'none'
		})
		$('.L-content-block-main').removeClass('shows').addClass('hiddens');
		$('.L-content-block-main').eq($(this).index()).removeClass('hiddens').addClass('shows');
	})
	//时间处理
	getDatas();
	tableImg();
	$('#datepicker').val(_startTime);
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
	})
	$('body').mouseover(function(){
		if(myChart){
			myChart.resize();
		}
	})
	//表格
	$('#datatables').DataTable({
		"autoWidth": false,  //用来启用或禁用自动列的宽度计算
		"paging": false,   //是否分页
		"destroy": true,//还原初始化了的datatable
		"searching": false,
		"paging": false,
		"searching": false,
		"ordering": false,
		'language': {
			'emptyTable': '没有数据',
			'loadingRecords': '加载中...',
			'processing': '查询中...',
			'lengthMenu': '每页 _MENU_ 件',
			'zeroRecords': '没有数据',
			'info': '第 1 页 / 总 1 页',
			'infoEmpty': '没有数据'
		},
		"dom":'B<"clear">lfrtip',
		'buttons': [
			{
				extend: 'copyHtml5',
				text: '复制'
			},
			{
				extend:'csvHtml5',
				text:'保存csv格式'
			},
			{
				extend: 'excelHtml5',
				text: '保存为excel格式',
			},
			{
				extend: 'pdfHtml5',
				text: '保存为pdf格式',
			}
		],
		"columns": [
			{ "title": "时间"},
			{ "title": "用量" }
		]
	});
	//echart

})
var myChart;
window.onresize = function () {
	if(myChart){
		myChart.resize();
	}
}
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
		et : _endTime,
	};
	var url = sessionStorage.apiUrlPrefix;
	$.ajax({
		type:'post',
			url:url + 'pr/pr_GetPRInstHistoryData',
			data:prm,
			async:false,
			beforeSend:function(){
            	$('.L-loadding').show();
				//需求：button禁止操作，设置超时。
        	},
			success:function(data){
				//allDatas.push(data);
				for(var i=0;i<data.length;i++){
					allDatas.push(data[i]);
				}
				$('.L-loadding').hide();
			}
	})
	for(var i=0;i<allDatas.length;i++){
		var Xdatas = allDatas[i].date.split('T')[1];
		dataX.push(Xdatas);
		dataY.push(allDatas[i].cdData)
	}
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
			data: dataX
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value} °C'
			}
		},
		series: [
			{
				name:'温度',
				type:'line',
				data:dataY
			}
		]
	};
	myChart.setOption(option);
}
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
		async:false,
		success:function(result){
			for(var i=0;i<result.length;i++){
				allDatas.push(result[i].cdData);
				var dateSplit = result[i].date.split('T')[1];
				allDates.push(dateSplit);
			}
		}
	})
	for(var i=0;i<allDatas.length;i++){
		var allArrs = [];
		allArrs.push(allDates[i]);
		allArrs.push(allDatas[i]);
		allArr.push(allArrs);
	}
	var dt = $("#datatables").dataTable();
	//清空一下table
	dt.fnClearTable();
	//想表格中添加东西数据
	dt.fnAddData(allArr);
	//重绘表格
	dt.fnDraw();
}