var _userIdNum = sessionStorage.getItem('userName');
var nowDays = moment().format('YYYY/MM/DD') + ' 00:00:00';
var _alaLogId = '';
var _texts = '';
var _startTime = moment().format('YYYY/MM/DD') + ' 00:00:00';
var _endTime = moment().add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
function addInfo(el){
    _alaLogId = el.parents('tr').children('.alaLogIDs').html()
}
function addClick(){
    //获取当前用户名
    _texts = $('##myModal02').find('input').val();
     var prm = {
         'userId':_userIdNum,
         'msgTime':nowDays,
         'alaLogId':_alaLogId,
         'alaMessage':_texts
     }
     $.ajax(
         {
             'type':'post',
             'url':sessionStorage.apiUrlPrefix + 'Alarm/SetAlarmMessage',
             'async':false,
             'data':prm,
             success:function(result){
                 refreshData();
                $("#myModal02").modal('hide');
                $('.choice[data-alaLogID="' + _alaLogId  + '"]').parent().addClass('checked');
             }
         }
     )
}
function closes(){
    $('#myModal02').modal('hide');
}
//刷新数据
function refreshData(){
    var pointers = JSON.parse(sessionStorage.pointers);
    var ptIds = [];
    for(var i= 0,len=pointers.length;i<len;i++){
        ptIds.push(pointers[i].pointerID);
    }
    var prmData = {
        "st" : _startTime,
        "et" : _endTime,
        "excTypeInnerId":"",
        "energyType":"",
        "pointerIds":ptIds
    };
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcData',
        data:prmData,
        dataType:'json',
        success:function(data){
            datasTable($('#alarmTable'),data);
        }
    })
}
function datasTable(tableId,arr){
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
