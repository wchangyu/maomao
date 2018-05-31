$(function(){
    var _prm = window.location.search;
    if(_prm == ''){
        //表格初始化
        table = $('#datatables').DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "destroy": true,//还原初始化了的datatable
            "searching": true,
            "ordering": true,
            //"scrollY": 200,
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页',
                'infoEmpty': '没有数据',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                },
                'search':'搜索'

            },
            "order": [7,'desc'],
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
                    "title":"时间",
                    "orderable": false,
                    "data":"dataDate",
                    "render":function(data,type,row,meta){

                        if(data){
                            return data.split('T')[0] + ' ' + data.split('T')[1];
                        }
                    }
                },
                {
                    "title": "支路",
                    "orderable": false,
                    "class":"cname",
                    "data":"cName"
                },
                {
                    "title": "楼宇名称",
                    "orderable": false,
                    "data":"pointerName"
                },
                {
                    "title": "报警事件",
                    "orderable": false,
                    "data":"alarmSetName"
                },
                {
                    "title": "报警类型",
                    "orderable": false,
                    "data":"cDtnName"
                },
                {
                    "title": "报警条件",
                    "orderable": false,
                    "data":"expression"
                },
                {
                    "title": "此时数据",
                    "orderable": false,
                    "data":"data",
                    "render":function(data,type,row,meta){

                      return data.toFixed(2);
                    }
                },
                //{
                //    "title": "楼宇名称房间",
                //    "orderable": false,
                //    "data":"rowDetailsExcDatas"
                //},
                {
                    "title": "报警等级",
                    "class":'hidden',
                    "data":"priorityID"
                },
                {
                    "title": "报警等级",
                    "orderable": false,
                    "data":"priority"
                },

                {
                    "title": "处理状态",
                    "orderable": false,
                    "class":'L-checkbox',
                    "targets": -1,
                    "data": "flag",
                    "render":function(data,type,row,meta){
                        if(data==1){
                            return "<div class='checker'><span class='checked'><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div><span class='yuedu'>已阅读</span>";
                        }else if(data==3){
                            return "已处理";
                        }else{
                            return "<div class='checker'><span><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div><span class='yuedu'>未处理</span>";
                        }
                    }
                },
                {
                    "title":'id',
                    "class":"alaLogID alaLogIDs theHidden",
                    "orderable": false,
                    "data":"alaLogID",
                    //"visible":false,
                    "render":function(data,type,row,meta){

                        return '<span data-pointerID="' + row.pointerID +
                            '"data-cdataID = "' + row.cdataID +
                            '"  +>' + data +
                            '</span>'

                    }
                },
                {
                    "class":"alaLogID pointerID",
                    "orderable": false,
                    "data":"pointerID",
                    "visible":"false"
                },
                {
                    "title": "查看",
                    "orderable": false,
                    "class":'L-button',
                    "targets": -1,
                    "data": null,
                    "render":function(data,type,row,meta){

                        if(row.rowDetailsExcDatas.length == 0){

                            return  "无"

                        }else{

                            return  "<button class='btn btn-success details-control' data-alaLogID=''>显示/隐藏历史</button>";

                        }
                    }
                },
                {
                    "title": "处理备注",
                    "orderable": false,
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='btn btn-success clickButtons' data-toggle='modal' data-target='#myModal'>点击处理</button>"
                },
                {
                    "title": "查看流程图",
                    "orderable": false,
                    "targets": -1,
                    "data": "isHavingProc",
                    "render":function(data,type,row,meta){

                        if(data == 0){

                            return  "<span style='width:80px;display: inline-block'>无</span>"

                        }else{

                            return  "<button class='btn btn-success examine-monitor' data-pointer="+row.pointerID+"  data-cdataID="+row.cdataID+">点击查看</button>";

                        }
                    }
                }
            ],
            createdRow: function(row,data,index){

                //普通报警
                if(data.priorityID == 1){

                    $(row).addClass('general-alarm');

                //较急报警
                }else if(data.priorityID == 2){

                    $(row).addClass('ordinary-alarm');

                //紧急报警
                }else if(data.priorityID == 3){

                    $(row).addClass('urgency-alarm');

                //特别紧急报警
                }else if(data.priorityID == 4){

                    $(row).addClass('particularly-urgency-alarm');
                }

            }

        });
    }else{
        //表格初始化
        table = $('#datatables').DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "destroy": true,//还原初始化了的datatable
            "searching": false,
            "ordering": true,
            "paging":true,
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页',
                'infoEmpty': '没有数据',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                },
                'search':'搜索'

            },
            "order": [7,'desc'],
            "dom":'B<"clear">lfrtip',
            'buttons': [
                {
                    extend:'csvHtml5',
                    text:'保存csv格式',
                    className:'hiddenButton'
                },
                {
                    extend: 'excelHtml5',
                    text: '保存为excel格式',
                    className:'hiddenButton'
                },
                {
                    extend: 'pdfHtml5',
                    text: '保存为pdf格式',
                    className:'hiddenButton'
                }
            ],
            "columns": [
                {
                    "title":"时间",
                    "orderable": false,
                    "data":"dataDate",
                    "render":function(data,type,row,meta){

                        if(data){
                            return data.split('T')[0] + ' ' + data.split('T')[1];
                        }
                    }
                },
                {
                    "title": "支路",
                    "orderable": false,
                    "class":"cname",
                    "data":"cName"
                },
                {
                    "title": "楼宇名称",
                    "orderable": false,
                    "data":"pointerName"
                },
                {
                    "title": "报警类型",
                    "orderable": false,
                    "data":"cDtnName"
                },
                {
                    "title": "报警条件",
                    "orderable": false,
                    "data":"expression"
                },
                {
                    "title": "此时数据",
                    "orderable": false,
                    "data":"data"
                },
                //{
                //    "title": "楼宇名称房间",
                //    "orderable": false,
                //    "data":"rowDetailsExcDatas"
                //},
                {
                    "title": "报警等级",
                    "class":'hidden',
                    "data":"priorityID"
                },
                {
                    "title": "报警等级",
                    "orderable": false,
                    "data":"priority"
                },

                {
                    "title": "处理状态",
                    "orderable": false,
                    "class":'L-checkbox',
                    "targets": -1,
                    "data": "flag",
                    "render":function(data,type,row,meta){
                        if(data==1){
                            return "<div class='checker'><span class='checked'><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div><span class='yuedu'>已阅读</span>";

                        }else if(data==3){

                            return "已处理";

                        }else{

                            return "<div class='checker'><span><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div><span class='yuedu'>未处理</span>";

                        }
                    }
                },
                {
                    "title":'id',
                    "class":"alaLogID alaLogIDs theHidden",
                    "orderable": false,
                    "data":"alaLogID",
                    //"visible":false,
                    "render":function(data,type,row,meta){

                        return '<span data-pointerID="' + row.pointerID +
                            '"data-cdataID = "' + row.cdataID +
                            '"  +>' + data +
                            '</span>'

                    }
                },
                {
                    "class":"alaLogID pointerID",
                    "orderable": false,
                    "data":"pointerID",
                    "visible":"false"
                },
                {
                    "title": "查看",
                    "orderable": false,
                    "class":'L-button',
                    "targets": -1,
                    "data": null,
                    "render":function(data,type,row,meta){

                        if(row.rowDetailsExcDatas.length == 0){

                            return  "无"

                        }else{

                            return  "<button class='btn btn-success details-control' data-alaLogID=''>显示/隐藏历史</button>";

                        }
                    }
                },
                {
                    "title": "处理备注",
                    "orderable": false,
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='btn btn-success clickButtons' data-toggle='modal' data-target='#myModal'>点击处理</button>"
                },
                {
                    "title": "查看流程图",
                    "orderable": false,
                    "targets": -1,
                    "data": "isHavingProc",
                    "render":function(data,type,row,meta){

                        if(data == 0){

                            return  "<span style='width:80px;display: inline-block'>无</span>"

                        }else{

                            return  "<button class='btn btn-success examine-monitor' data-pointer="+row.pointerID+"  data-cdataID="+row.cdataID+">点击查看</button>";

                        }
                    }

                }
            ],
            createdRow: function(row,data,index){
                //console.log(33);

                if(data.prDefId == 0){

                    $('td', row).eq(2).addClass('equal');
                }
            }

        });

        $('.hiddenButton').hide();
        $('#datatables_length').hide();
    }

    //显示时间；
    //$('.real-time').html(showStartRealTime + '到' + showStartRealTime);

    //指定楼宇为全部；
    getPointerID();

    //获取报警类型
    typeOfAlarm();

    //获取历史警报
    alarmHistory();

    //setData();
    $('#datatables tbody').on( 'click', 'input', function () {
        var $this = $(this);
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
        }else{
            $(this).parent($('span')).removeClass('checked');
        }
    } );
    $('.logoToRead').click(function(){
        logoToRead();
    });

    $('#datatables tbody').on('click', 'td .details-control', function () {
        var $this = $(this);
        var cnames = $this.parents('tr').children('.cname').html();
        var pointerIDs = $this.parents('tr').children('.pointerID').html();
        var historyArr = [];

        for(var i=0;i<totalArr.length;i++){
            if(totalArr[i].cName == cnames && totalArr[i].pointerID == pointerIDs){
                historyArr = totalArr[i].rowDetailsExcDatas;
            }
        }

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;
        var row = table.row( tr );
        if ( row.child.isShown() ) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(historyArr) ).show();
            tr.addClass('shown');
        }
    } );

    $('#datatables').on('click','.clickButtons',function(){

        var $this = $(this);

        //遍历所有数据，通过pointerID和cdataID来确定数组

        var pointerID = $this.parents('tr').children('.alaLogIDs').children().attr('data-pointerid');

        var cdataID = $this.parents('tr').children('.alaLogIDs').children().attr('data-cdataid');

        _alaLogId = $this.parents('tr').children('.alaLogIDs').children().html();

        _currentStr = '';

        _currentArr = [];

        for(var i=0;i<_history.length;i++){

            if(_history[i].pointerID == pointerID && _history[i].cdataID == cdataID){

                _currentArr.push(_history[i].alaLogID);

            }

        }

        for(var i=0;i<_currentArr.length;i++){

            if(i == _currentArr.length-1){

                _currentStr += _currentArr[i];

            }else{

                _currentStr += _currentArr[i] + ',';
            }

        }

    });

    //获得备注内容
    $('#myModal').on('click','.submitNote',function(){

        _texts = $(this).parents('.modal-content').children('.modal-body').children().val();

        processingNote();

    });

    //按报警类型查询
    $('.btn-success').on('click',function(){

        //改变报警类型
        excTypeInnderId = $('#alarm-type').val();

        //重新获取数据
        alarmHistory();

    });

    //点击打开流程图
    $('#datatables').on('click','.examine-monitor',function(){

        //打开模态框
        $('#my-userMonitor').modal('show');

        //获取当前传递的参数
        var config1 = 5;

        var config2 = $(this).attr('data-pointer');

        var config3 = $(this).attr('data-cdataid');

        //拼接打开的url地址
        var postUrl = "../yongnengjiance/jumpEnergyMonitor1.html?configArg1=" + config1 + "configArg2=" + config2 + "configArg3=" + config3 + "";

        $('#my-userMonitor iframe').attr('src',postUrl);

    });
});

//指定能耗种类的类型为全部；
var _ajaxEcType = " ";
//指定全部报警类型为全部；
var excTypeInnderId = " ";
var pointerID = [];
function getPointerID(){
    var getPointers = JSON.parse(sessionStorage.getItem('pointers'));
    if(getPointers){
        for(var i=0;i<getPointers.length;i++){
            pointerID.push(getPointers[i].pointerID)
        }
    }
}

//实时数据（开始）；
var startRealTime = moment().subtract('24','hours').format('YYYY-MM-DD HH:mm:ss');
var endRealTime = moment().format('YYYY-MM-DD HH:mm:ss');
var showStartRealTime = moment().format('YYYY-MM-DD');
//获取历史数据
var dataArr = [];
var totalArr = [];
//获取所有数据
var _history = [];
function alarmHistory(){

    var prm = {
        'st' : startRealTime,
        'et' : endRealTime,
        'pointerIds' : pointerID,
        'excTypeInnderId' : excTypeInnderId,
        'energyType' : _ajaxEcType,
        "dealFlag": 0, //0为未处理 -1为全部
        "userID" :  _userIdNum
    };
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcData',
        data:prm,
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success:function(result){
            _history.length = 0;
            totalArr.length = 0;

            var dataArr = [];
            var pcids = [];
            var showArr = [];

            for(var i=0;i<result.length;i++){

                _history.push(result[i]);

                totalArr.push(result[i]);

            }

            datasTable($("#datatables"),_history);
            //console.log(dataArr);
        }
    });
}

//去重
function existItem(arr,item){ //遍历数组中的所有数，如果有相同的pointerID&&cdataID，返回true，如果没有的话返回false；
    for(var i= 0,len=arr.length;i<len;i++){
        if(arr[i].pointerID==item.pointerID && arr[i].cdataID==item.cdataID){
            return true;
        }
    }
    return false;
}
function datasTable(tableId,arr){
    if(arr.length == 0){
        var table = tableId.dataTable();
        table.fnClearTable();
        table.fnDraw();
    }else{
        var table = tableId.dataTable();
        table.fnClearTable();
        table.fnAddData(arr);
        table.fnDraw();
    }
}
//标识阅读功能
var logoToReadID = [];
function logoToRead (){
    logoToReadID = [];
    var pitchOn = $('.choice').parent('.checked'); //包含结果的数组的object
    for(var i=0;i<$('.choice').length;i++){
        //if($('.choice').eq(i).parent('.checked'))
        if($('.choice').eq(i).parent('.checked').length != 0){
            logoToReadID.push($('.choice').eq(i).attr('data-alalogid'));
        }
    }
    console.log(logoToReadID);
    var alaLogIDs = {
        '':logoToReadID
    };

    $.ajax(
        {
            'type':'post',
            'url':sessionStorage.apiUrlPrefix + 'Alarm/UpdateAlarmReaded',
            'async':false,
            'data':alaLogIDs,
            'success':function(result){
                //重新获取页面数据
                alarmHistory();
            }
        }
    )
}

//报警类型
function typeOfAlarm(){

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcType',
        success:function(result){

           // console.log(result);

            var html = '<option value="-1">全部</option>';

            $(result).each(function(i,o){

                html += '<option value="'+ o.innerID+'">'+ o.cDtnName+'</option>'
            });

            $('#alarm-type').html(html);

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });
}


//显示隐藏
function format ( d ) {

    var theader = '<table class="table">' +
        '<thead><tr><td>时间</td><td>支路</td><td>楼宇名称</td><td>报警事件</td><td>报警类型</td><td>报警条件</td><td>此时数据</td><td>报警等级</td></tr></thead>';
    var theaders = '</table>';
    var tbodyer = '<tbody>'
    var tbodyers = '</tbody>';
    var str = '';
    for(var i=0;i< d.length;i++){
        var atime = d[i].dataDate.split('T')[0] + ' ' + d[i].dataDate.split('T')[1];
        str += '<tr><td>' + atime +
            '</td><td>' + d[i].cName +
            '</td><td>' + d[i].pointerName +
            '</td><td>' + d[i].alarmSetName+
            '</td><td>' + d[i].cDtnName +
            '</td><td>' + d[i].expression +
            '</td><td>' + d[i].data +
            '</td><td>' + d[i].priority +
            '</td></tr>';
    }
    return theader + tbodyer + str + tbodyers + theaders;
}
//userId msgTime alaLogId alaMessage
//用户名  当前时间（获取） alaLogId  input.val()
var userId,_alaLogId,_texts,_currentArr = [],_currentStr='';
var nowDays = moment().format('YYYY/MM/DD') + ' 00:00:00';
function processingNote (){

    //获取当前用户名
    var prm = {
        'userId':_userIdNum,
        'msgTime':nowDays,
        'alaLogId':_currentStr,
        'alaMessage':_texts
    };

    $.ajax(
        {
            'type':'post',
            'url':sessionStorage.apiUrlPrefix + 'Alarm/SetAlarmMessage',
            'async':false,
            'data':prm,
            success:function(result){
                if(result == true){

                    _moTaiKuang($('#myModal2'),'提示','false','istap','操作成功!','');

                    $("#myModal").modal('hide');

                    $('.choice[data-alaLogID="' + _alaLogId  + '"]').parent().addClass('checked');

                    $('.choice[data-alaLogID="' + _alaLogId  + '"]').parents('.L-checkbox').children('.yuedu').html('已阅读');

                    //重新获取页面数据
                    alarmHistory();


                }else{

                    _moTaiKuang($('#myModal2'),'提示','false','istap','操作失败!','');

                }


            }
        }
    )
}