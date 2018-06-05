/**
 * Created by admin on 2018/4/23.
 */
$(function(){

    //获取报警等级
    getAlarmLevel();

    //获取全部车站
    getAlarmStation();

    //默认获取设备报警
    getAlarmData(0);

    //点击切换选项卡
    $('.top-tab-control').on('click','.top-tab-container',function(){

        $('.top-tab-container').removeClass('top-tab-container-choose');

        $(this).addClass('top-tab-container-choose');

        //获取当前传递给后台的参数 用于识别是哪种报警
        var flag = $(this).index();

        getAlarmData(flag);

    });

    //点击切换是否处理的选项卡
    $('.bottom-main-table').on('click','.dispose',function(){

        $('.dispose').removeClass('choose-dispose');

        $(this).addClass('choose-dispose');

        //获取当前传递给后台的参数 用于识别是哪种报警
        var flag = $('.top-tab-control .top-tab-container-choose').index();

        getAlarmData(flag);
    });

    //点击查询按钮
    $('.btn-success').on('click',function(){

        //获取当前传递给后台的参数 用于识别是哪种报警
        var flag = $('.top-tab-control .top-tab-container-choose').index();

        getAlarmData(flag);

    });


});

//初始化表格
table = $('#alarm-datatables').DataTable({
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    "paging": true,   //是否分页
    "destroy": true,//还原初始化了的datatable
    "searching": false,
    "ordering": false,
    // "scrollY": "300px",
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
        }
    },
    "dom":'B<"clear">lfrtip',
    'buttons': [
        //{
        //    extend:'csvHtml5',
        //    text:'保存csv格式'
        //},
        //{
        //    extend: 'excelHtml5',
        //    text: '保存为excel格式'
        //},
        //{
        //    extend: 'pdfHtml5',
        //    text: '保存为pdf格式'
        //}
    ],
    "columns": [
        {
            "title":"日期",
            "data":"dataDate",
            "render":function(data,type,row,meta){
                if(data && data.length >0){
                    return data.split(' ')[0];
                }
            }
        },
        {
            "title":"时间",
            "data":"dataDate",
            "render":function(data,type,row,meta){
                if(data && data.length >0){
                    return data.split(' ')[1];
                }
            }
        },
        {
            "title": "报警级别",
            "class":"",
            "data":"priorityName"
        },
        {
            "title": "报警名称",
            "data":"alarmName"
        },
        {
            "title": "设备类型",
            "data":"devType"
        },
        {
            "title": "设备",
            "data":"devName"
        },
        {
            "title": "区域",
            "data":"areaName"
        },
        {
            "title": "位置",
            "data":"devLocal"
        }
    ]
});

table1 = $('#alarm-datatables1').DataTable({

    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    "paging": true,   //是否分页
    "destroy": true,//还原初始化了的datatable
    "searching": false,
    "ordering": false,
    // "scrollY": "300px",
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
        }
    },
    "dom":'B<"clear">lfrtip',
    'buttons': [
        //{
        //    extend:'csvHtml5',
        //    text:'保存csv格式'
        //},
        //{
        //    extend: 'excelHtml5',
        //    text: '保存为excel格式'
        //},
        //{
        //    extend: 'pdfHtml5',
        //    text: '保存为pdf格式'
        //}
    ],
    "columns": [
        {
            "title":"日期",
            "data":"dataDate",
            "render":function(data,type,row,meta){
                if(data && data.length >0){
                    return data.split('T')[0];
                }
            }
        },
        {
            "title":"时间",
            "data":"dataDate",
            "render":function(data,type,row,meta){
                if(data && data.length >0){
                    return data.split('T')[1];
                }
            }
        },
        {
            "title": "报警级别",
            "class":"",
            "data":"priority"
        },
        {
            "title": "报警名称",
            "data":"alarmSetName"
        },
        {
            "title": "当前数据",
            "data":"data"
        },
        {
            "title": "报警表达式",
            "data":"expression"
        }
    ]
});

$('.dataTables_wrapper').eq(1).hide();

//定义开始结束时间
var startTime = moment().format('YYYY-MM-DD');

var endTime = moment().add(1,'d').format('YYYY-MM-DD');

//获取报警等级
function getAlarmLevel(){

    var levelHtml = "<option value='0'>全部</option>";

    $(alarmLevel).each(function(i,o){

        levelHtml += "<option value='"+ o.id+"'>"+ o.name+"</option>"
    });

    $('#alarm-level').html(levelHtml);
};

//获取全部车站
function getAlarmStation(){

    //存放楼宇ID列表
    var levelHtml = "";

    var pointerArr = $.parseJSON(sessionStorage.getItem('pointers'));

    $(pointerArr).each(function(i,o){

        levelHtml += "<option value='"+ o.pointerID+"'>"+ o.pointerName+"</option>"
    });

    $('#alarm-station').html(levelHtml);

};

//获取后台报警数据 flag 0为设备报警 1为运行报警 2为能耗报警
function getAlarmData(flag){

    //定义传递给后台的参数
    var ecParams = {};

    //获取车站
    var pointerID = $('#alarm-station').val();

    //获取报警级别
    var priorityID = $('#alarm-level').val();

    var postUrl = 'Alarm/GetDevAlarmInsData';

    //如果是设备或运行报警
    if(flag == 0 || flag ==  1){

        ecParams = {
            "alarmDevgrade": flag,
            "startTime": startTime,
            "endTime": endTime,
            "pointerIDs": [pointerID],
            "priorityID": priorityID,
            "devType": 0

        };
    }else{

        postUrl = 'Alarm/GetEnergyAlarmInsData';

        ecParams = {
            "startTime": startTime,
            "endTime": endTime,
            "alarmName": "",
            "priorityID": priorityID,
            "pointerIDs": [pointerID]
        };

    }

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + postUrl,
        data:ecParams,
        beforeSend:function(){


            $('#alarm-datatables').showLoading();

            $('#alarm-datatables1').showLoading();

        },
        success:function(result){

            $('#alarm-datatables').hideLoading();

            $('#alarm-datatables1').hideLoading();

            //获取一般报警
            $('.left-top-alarm .alarm-data2').html(result.u3dAlarmNums[0].alarmNum);

            //获取普通报警
            $('.left-top-alarm .alarm-data1').html(result.u3dAlarmNums[1].alarmNum);

            //获取严重报警
            $('.left-top-alarm .alarm-data0').html(result.u3dAlarmNums[2].alarmNum + result.u3dAlarmNums[3].alarmNum);

            //获取已处理报警
            var dealDevAlarmDatas = result.dealAlarmDatas;

            //获取未处理报警
            var noDealDevAlarmDatas = result.noDealAlarmDatas;

            //页面赋值
            $('.bottom-main-table .dispose0 font').html(dealDevAlarmDatas.length);

            $('.bottom-main-table .dispose1 font').html(noDealDevAlarmDatas.length);

            //获取当前是显示已处理数据还是未处理数据
            var showDataArr = [];

            if($('.choose-dispose').index() == 0){

                showDataArr = dealDevAlarmDatas;
            }else{

                showDataArr = noDealDevAlarmDatas;
            }

            //获取当前展示的table
            if(flag == 2){

                $('.dataTables_wrapper').eq(0).hide();

                $('.dataTables_wrapper').eq(1).show();

                $('#alarm-datatables1').show();

                $('#alarm-datatables').hide();

                _datasTable($('#alarm-datatables1'), showDataArr);



            }else{

                $('.dataTables_wrapper').eq(1).hide();

                $('.dataTables_wrapper').eq(0).show();

                $('#alarm-datatables1').hide();

                $('#alarm-datatables').show();

                _datasTable($('#alarm-datatables'), showDataArr);
            }


        },
        error:function(jqXHR, textStatus, errorThrown){
            $('#alarm-datatables').hideLoading();
            $('#alarm-datatables1').hideLoading();

            console.log(jqXHR.responseText);
        }
    });
}