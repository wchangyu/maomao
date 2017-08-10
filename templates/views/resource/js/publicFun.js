//获得用户名
var _userIdName = sessionStorage.getItem('realUserName');

//获得用户id
var _userIdNum = sessionStorage.getItem('userName');

//获取本地url
var _urls = sessionStorage.getItem("apiUrlPrefixYW");

//时间插件初始化
function _timeComponentsFun(el){
    el.datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
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

//导出


