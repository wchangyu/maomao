$(function(){

    //从配置中读取是否显示流程图
    var userMonitorClass = getDataByConfig();

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
                    "class":userMonitorClass,
                    "data": "isHavingProc",
                    "render":function(data,type,row,meta){

                        if(data == 0){

                            return  "<span style='width:80px;display: inline-block'>无</span>"

                        }else{

                            return  "<button class='btn btn-success examine-monitor' data-pointer="+row.pointerID+"  data-cdataID="+row.cdataID+">点击查看</button>";

                        }
                    }
                },
                {

                    "title": "创建工单",
                    "data":'dNum',
                    "render":function(data,type,row,meta){

                        if(data == null || data == ''){

                            return '无法创建'

                        }else{

                            return  "<button class='btn btn-success creatGD' data-devNum = '" + data + "' data-pointer='" + row.pointerID + "' data-cdata='" + row.cdataID + "'>创建工单</button>";

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
                    "class":userMonitorClass,
                    "data": "isHavingProc",
                    "render":function(data,type,row,meta){

                        if(data == 0){

                            return  "<span style='width:80px;display: inline-block'>无</span>"

                        }else{

                            return  "<button class='btn btn-success examine-monitor' data-pointer="+row.pointerID+"  data-cdataID="+row.cdataID+">点击查看</button>";

                        }
                    }

                },
                {

                    "title": "创建工单",
                    "data":'dNum',
                    "render":function(data,type,row,meta){

                        if(data == null || data == ''){

                            return '无法创建'

                        }else{

                            return  "<button class='btn btn-success creatGD' data-devNum = '" + data + "' data-pointer='" + row.pointerID + "' data-cdata='" + row.cdataID + "'>创建工单</button>";

                        }
                    }

                }
            ],
            createdRow: function(row,data,index){

                if(data.prDefId == 0){

                    $('td', row).eq(2).addClass('equal');
                }
            }

        });

        $('.hiddenButton').hide();
        $('#datatables_length').hide();
    }

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

    //获取登陆用户信息
    var userInfo = JSON.parse(sessionStorage.userInfo);

    //点击创建工单
    $('#datatables').on('click','.creatGD',function(){

        //loadding
        $('#theLoading').modal('show');

        //模态框显示
        _moTaiKuang($('#Creat-myModa'), '创建工单', false, '' ,'','创建');

        //初始化
        $('.gongdanList').find('input').val('');

        $('.gongdanList').find('textarea').val('');

        $('#GdNum').html('0');

        $('.gdListInfo').html('<li>无</li>')

        var prm = {

            //pointer
            pointerid:$(this).attr('data-pointer'),

            //cdataId
            cdataid:$(this).attr('data-cdata')
        }

        var _this = $(this);

        //获取设备信息
        $.ajax({

            type:'post',

            url:_urls + 'NJNDeviceShow/ywDevGetDevInfo',

            data:JSON.stringify(prm),

            contentType:'application/json',

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result != null){

                    //赋值
                    //设备名称
                    $('#devMC').val(result.devname);

                    //设备编码(非必填)
                    $('#devBM').val(result.dnum);

                    //报修人信息
                    $('#bxRen').val(userInfo.userName);

                    //报修部门
                    $('#bxSec').val(userInfo.departName);

                    //设备系统
                    $('#devSys').val(result.dsname);

                    //设备分类
                    $('#devMatter').val(result.dcname);

                    //维修地点
                    $('#wxAdd').val(result.devlocal);

                    var thisTr = _this.parents('tr');

                    //报修备注
                    var str = '时间：' + thisTr.children().eq(0).html() + '\n'

                            //+ '支路：' +  thisTr.children().eq(1).html() + '\n'

                            //+ '楼宇名称：' +  thisTr.children().eq(2).html() + '\n'

                            + '报警事件：' +  thisTr.children().eq(3).html() + '\n'

                            //+ '报警类型：' +  thisTr.children().eq(4).html() + '\n'

                            + '此时数据：' +  thisTr.children().eq(6).html() + '\n'

                            + '报警等级：' +  thisTr.children().eq(7).html() + '\n'

                    //报修备注
                    $('#bxRem').val(str);

                }

            },

            error:_errorFun

        })

        //查看未完成工单
        var prmGD = {

            //状态
            gdZhts:[1,2,3,4,5,6],

            //设备编码
            wxShebei: _this.attr('data-devnum'),

            //用户id
            userID:_userIdNum,

            //用户名
            userName:_userIdName

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDGetZh2',

            data:prmGD,

            timeout:_theTimes,

            success:function(result){

                if(result.length != 0){

                    var str = '';

                    for(var i=0;i<result.length;i++){

                        var bxStr = result[i].bxBeizhu;

                        var newBxStr = bxStr.replace(/\n/g, '<br>');

                        str += '<li>'

                        str += '<label for="">工单号：</label>' +
                            '<a href="../gongdangunali/productionOrder_see.html?gdCode=' + result[i].gdCode + '&gdCircle=1" target="_blank">' + result[i].gdCode  + '</a>' +
                            '<div></div>' +
                            '<label for="">详情：</label>' +
                            '<div class="detailGD">' + newBxStr + '</div>'

                        str += '</li>'

                    }

                    $('.gdListInfo').empty().append(str);

                }else{

                    var str = '<li>无</li>'

                    $('.gdListInfo').empty().append(str);

                }

                $('#GdNum').html(result.length);

            },

            error:_errorFun1

        })

    })

    //创建工单确定按钮
    $('#Creat-myModa').on('click','.dengji',function(){

        //模态框显示
        $('#theLoading').modal('show');

        var wxShix = "null";

        //如果设备分类由值，那么就传设备分类的值，如果没有就传null，维修事项也一样
        var dcname = $('#devMatter').val();

        if(dcname!=''){

            wxShix = dcname;

        }

        var prm = {

            //是否紧急
            'gdJJ':0,
            //设备名称
            'dName':$('#devMC').val(),
            //设备编码
            'dNum':$('#devBM').val(),
            //报修电话
            'bxDianhua':$('#bxTel').val() == ''?'123456':$('#bxTel').val(),
            //报修人信息
            'bxRen':$('#bxRen').val(),
            //维修地点
            'wxDidian':$('#wxAdd').val(),
            //报修部门
            'bxKeshi':$('#bxSec').val(),
            //报修部门编码
            'wxKeshiNum':userInfo.departNum,
            //设备分类
            'dcName':dcname,
            //设备分类编码***
            'dcNum':'',
            //报修备注
            'bxBeizhu':$('#bxRem').val(),
            //设备系统
            'wxShiX':wxShix,
            //设备系统编码***
            'wxShiXNum':'',
            //当前用户id
            'userID':_userIdNum,
            //工单来源*
            'gdSrc':3,
            //巡检任务编码
            'itkNum':'',
            //维修设备
            'wxShebei':$('#devBM').val()

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDCreDJDI',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result == 3){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单创建失败！', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单创建成功！', '');

                    $('#Creat-myModa').modal('hide');

                    //刷新数据
                    alarmHistory();

                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'超时！', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求失败！', '');

                }

            }

        })

    })

});

//从配置项中获取页面中所展示信息
function getDataByConfig(){

    //获取当前的url
    var curUrl = window.location.href;

    var thisClass = '';

    //获取当前页面的配置信息
    $(__systemConfigArr).each(function(i,o){

        //获取当前配置项中的url
        var thisUrl = o.pageUrl;

        //找到了当前页面对应的配置项
        if(curUrl.indexOf(thisUrl) > -1){

            //获取到具体的能耗排名配置信息
            var ifShow = o.ifShowMonitor;

            if(ifShow == 0){

                thisClass = 'theHidden';
            }

            return false;

        }
    });

    return thisClass;
};


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
        "userID" :  _userIdNum,
        hasDev:1//为了判断是否显示创建工单按钮
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

            if($('.modal-backdrop').length > 0){

                $('div').remove('.modal-backdrop');

                $('#theLoading').hide();
            }
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