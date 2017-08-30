//获得用户名
var _userIdName = sessionStorage.getItem('realUserName');

//获得用户id
var _userIdNum = sessionStorage.getItem('userName');

//获取本地url
var _urls = sessionStorage.getItem("apiUrlPrefixYW");

//datapicker时间插件初始化(日月年)
function _timeYMDComponentsFun(el){
    el.datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
}

//datatimepicker事件插件初始化（日月年时分秒）
function _timeHMSComponentsFun(el,startView){
    el.datetimepicker({
        language:  'zh-CN',//此处修改
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: startView,  //1时间  2日期  3月份 4年份
        forceParse: 0,
    });
}

//datatimepicker只显示日期
function _dataComponentsFun(el){
    el.datetimepicker({
        language:  'zh-CN',//此处修改
        weekStart: 1,
        todayHighlight: 1,
        forceParse: 0,
        minView: "month",//设置只显示到月份
        format : "yyyy-mm-dd",//日期格式
        autoclose:true,//选中关闭
        todayBtn: true//今日按钮
    });
}

//datatimepicker只显示时间
function _timeComponentsFun(el){
    el.datetimepicker({
        language:  'zh-CN',//此处修改
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        format : "hh:mm:ss",//日期格式
        startView: 1,  //1时间  2日期  3月份 4年份
        forceParse: 0,
        maxView : 'hour'
    });
}

//表格赋值
function _datasTable(tableId,arr){
    var table = tableId.dataTable();
    if(arr.length == 0){
        table.fnClearTable();
        table.fnDraw();
    }else{
        table.fnClearTable();
        table.fnAddData(arr);
        table.fnDraw();
    }
}




