$(function(){

	//开始&结束时间；
	_startTime = moment().subtract(1,'d').format("YYYY-MM-DD");
	_endTime = moment().format("YYYY-MM-DD");
	_curDef = JSON.parse(sessionStorage.historyData_ProcDef);
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
		$('.L-content-block-main').css({
			display:'none'
		})
		$('.L-content-block-main').eq($(this).index()).css({
			display:'block'
		})
	})
	//时间处理
	$('#datepicker').val(_startTime);
	$('.btn').eq(0).click(function(){
		var dataValue = $('#datepicker').val();
		var dataValues = moment(dataValue).add(1,'d').format('YYYY-MM-DD');
		var dataSplit = dataValue.split('-');
		var dataSplits = dataValues.split('-');
		var startTimes = dataSplit[0] + '/' + dataSplit[1] + '/' + dataSplit[2];
		var endTimes = dataSplits[0] + '/' + dataSplits[1] + '/' + dataSplits[2];
		//开始&结束时间赋值；
		_startTime  = startTimes;
		_endTime = endTimes;
		getDatas();
	})
	getDatas();
})


//获取数据；
function getDatas(){
	$('.L-content-header').html(_curDef.prDefNM + "(" + _startTime + "到" + _endTime + ")");
	var dataId = _curDef.dType + "+" + _curDef.dkId;
	var prm = {
		dkid : dataId,
		st : _startTime,
		et : _endTime,
	};
	var url = sessionStorage.apiUrlPrefix;
	//url = 'http://localhost/BEEWebApi/api/';		//临时
	$.ajax({
		type:'post',
			url:url + 'pr/pr_GetPRInstHistoryData',
			data:prm,
			beforeSend:function(){
            	$('.L-loadding').show();
        	},
			success:function(data){
				console.log(data);
				$('.L-loadding').hide();
			}
	})
}