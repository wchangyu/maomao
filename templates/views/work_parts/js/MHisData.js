$(function(){
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
	$('#datepicker').val(startTime);
	$('.btn').eq(0).click(function(){
		var dataValue = $('#datepicker').val();
		var dataValues = moment(dataValue).add(1,'d').format('YYYY-MM-DD');
		var dataSplit = dataValue.split('-');
		var dataSplits = dataValues.split('-');
		var startTimes = dataSplit[0] + '/' + dataSplit[1] + '/' + dataSplit[2];
		var endTimes = dataSplits[0] + '/' + dataSplits[1] + '/' + dataSplits[2];
		//开始&结束时间赋值；
		startTime  = startTimes;
		endTime = endTimes;
		getDatas();
	})
})
//开始&结束时间；
var startTime = moment().subtract(1,'d').format("YYYY-MM-DD");
var endTime = moment().format("YYYY-MM-DD");
//选取的id
var jsonText=JSON.parse(sessionStorage.getItem('historyData_ProcDef'));
var dataId = jsonText.dType + "+" + jsonText.dKId;
//获取数据；
function getDatas(){
	var prm = {
		dkid : dataId,
		st : startTime,
		et : endTime,
	}
	$.ajax({
		type:'post',
			url:'',
			data:prm,
			async:false,
			beforeSend:function(){
            	$('.L-loadding').show();
        	},
			success:function(result){
				$('.L-loadding').hide();
			}
	})
}