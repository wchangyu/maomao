/**
 * Created by admin on 2018/1/27.
 */

$(function(){

    //获取页面中的上面要展示的区域及对应的ID
    getDevTypeAreas(devTypeID,getSeAreaRotarySys);

    //获取报警类型
    typeOfAlarm();

    //点击页面右侧的报警信息弹出报警信息弹窗
    $('.right-bottom-table').on('click','.carousel-container',function(){

        $('#alarm-message').modal('show');

        //获取当前的区域id
        var devAreaID = $(this).attr('area-id');

        $('#alarm-message .systematic-name').attr('area-id',devAreaID);

        //获取后台数据
        getDevMonitAlarmPopup(devAreaID);


    });

    //报警信息弹窗中的查询功能
    $('#alarm-message .demand-button').on('click',function(){

        //获取当前区域id
        var devAreaID = $('#alarm-message .systematic-name').attr('area-id');

        //获取报警类型
        var alarmType = $('#alarm-message .alarm-select').val();

        //获取设备名称
        var devName = $('#alarm-message .dev-type').val();

        //获取报警名称
        var alarmName = $('#alarm-message .alarm-type').val();

        var condition =   {
            "devTypeID": devTypeID,
            "devAreaID": devAreaID,
            "alarmType": alarmType,
            "devName": devName,
            "alarmName": alarmName
        };

        //获取报警数据
        getDevMonitAlarmPopup(devTypeID,condition);

    });

});
//页面右侧Table的表头集合
var titleArr = ['','机房数','空开平均温度(℃)','机房平均温度(℃)','机房平均湿度(％)','UPS平均温度(％)','报警'];

//页面右侧Table的统计位置集合
var areaArr = ['-9.6m','0.0m','-9.6m','12.4m','17.1m','19.1m','22.4m','29.4m','东北角配楼','西南角配楼'];

//配置流程图页面中的区域位置
var monitorAreaArr = [
    {
        "areaName":"-9.6m",
        "areaId":"2"
    },
    {
        "areaName":"0.0m",
        "areaId":"3"
    },
    {
        "areaName":"12.4m",
        "areaId":"4"
    },
    {
        "areaName":"17.1m",
        "areaId":"15"
    },
    {
        "areaName":"19.1m",
        "areaId":"6"
    },
    {
        "areaName":"22.4m",
        "areaId":"7"
    },
    {
        "areaName":"28.4m",
        "areaId":"8"
    },
    {
        "areaName":"东北角配楼1层",
        "areaId":"9"
    },
    {
        "areaName":"东北角配楼2层",
        "areaId":"10"
    },
    {
        "areaName":"西南角配楼1层",
        "areaId":"11"
    },
    {
        "areaName":"西南角配楼2层",
        "areaId":"12"
    }
];
//把区域信息放入到流程图页面中
sessionStorage.monitorArea = JSON.stringify(monitorAreaArr);

//点击不同区域获取不同的设备列表
$('#monitor-menu-container').on('click','span',function(){

    //获取当前的区域ID
    var areaID = $(this).attr('data-district');

    //定义当前的设备类型 动环系统为7
    var devTypeID = 7;

    //获取当前的设备列表
    getSecondColdHotSour('NJNDeviceShow/GetSecondAirUnit', devTypeID,areaID);

});

/*-------------------------------------------表格初始化--------------------------------------------*/

var table = $('#equipment-datatables').DataTable({
    "bProcessing" : true,
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": true,//还原初始化了的datatable
    "paging":true,
    "ordering": false,
    'searching':false,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        //这里很重要，如果你的加载中是文字，则直接写上文字即可，如果是gif的图片，使用img标签就可以加载
        "sProcessing" : "<span style='color:#ff0000;'>正在加载</span>",
        'lengthMenu': '每页 _MENU_ 条',
        'zeroRecords': '没有数据',
        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页  总记录数为 _TOTAL_ 条',
        "sInfoEmpty" : "记录数为0",
        "sInfoFiltered" : "(全部记录数 _MAX_ 条)",
        'paginate': {
            'first':      '第一页',
            'last':       '最后一页',
            'next':       '下一页',
            'previous':   '上一页'
        },
        'infoEmpty': ''
    },
    'buttons': [

    ],
    "dom":'B<"clear">lfrtip',
    //数据源
    'columns':[
        {
            title:'序号',
            data:'areaName',
            render:function(data, type, row, meta){


                return meta.row + 1;

            }
        },
        {
            title:'机房名称',
            data:'devName',
            className:''
        },
        {
            title:'机房位置',
            data:'areaName'
        },
        {
            title:'所属系统',
            data:'typeName'
        },
        {
            title:'服务区域',
            data:'serviceArea'
        },
        {
            title:'机房温度1（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4321'){

                        result = o.cDataValue;

                    }
                });

                return result;

            }
        },
        {
            title:'机房温度2（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4321'){

                        result = o.cDataValue;

                    }
                });

                return result;

            }
        },
        {
            title:'机房湿度1（%）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4322'){

                        result = o.cDataValue;

                    }
                });

                return result;

            }
        },
        {
            title:'机房湿度2（%）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4322'){

                        result = o.cDataValue;

                    }
                });

                return result;
            }
        },
        {
            title:'机房水浸1',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4323'){

                        result = o.cDataValue;

                    }
                });

                return result;
            }
        },
        {
            title:'机房水浸2',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4323'){

                        result = o.cDataValue;

                    }
                });

                return result;
            }
        },
        {
            title:'空开温度1（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4324'){

                        result = o.cDataValue;

                    }
                });

                return result;

            }
        },
        {
            title:'空开温度2（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4324'){

                        result = o.cDataValue;

                    }
                });

                return result;

            }
        },
        {
            title:'分电柜A相（V）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4325'){

                        result = o.cDataValue;

                    }
                });

                return result;

            }
        },
        {
            title:'分电柜B相（V）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4325'){

                        result = o.cDataValue;

                    }
                });

                return result;

            }
        },
        {
            title:'分电柜C相（V）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4325'){

                        result = o.cDataValue;

                    }
                });

                return result;

            }
        }
    ]
});

//-------------------------------------获取流程图右侧展示数据--------------------------//

//定义当前的设备类型 动环系统为7
var devTypeID = 7;

function getSeAreaRotarySys(){

    //传递给后台的数据
    var ecParams = {
        "devTypeID": devTypeID,
        "pointerID": curPointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'NJNDeviceShow/GetSeAreaRotarySys',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            //leftBottomChart.showLoading();

        },
        success:function(result){

            //console.log(result);

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //绘制数据
            drawDataTableByResult(titleArr,result);

        },
        error:function(jqXHR, textStatus, errorThrown){
            //leftBottomChart.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};


//绘制页面右侧的table
function drawDataTableByResult(titleArr,areaDataArr){
    //定义title
    var titleHtml = '';

    $(titleArr).each(function(i,o){

        //拼接title的字符串
        titleHtml += '<th>'+o+'</th>';

    });

    //把title放入到table中

    $('.right-bottom-table thead tr').html(titleHtml);

    //定义tbody中内容
    var bodyHtml = '';

    //存放要放到页面中展示的内容
    var realShowArr = [];

    //绘制table中主体数据
    $(areaDataArr).each(function(i,o){

        //获取当前区域ID
        var areaID = o.areaInfo.areaID;

        //是否在页面中绘制的标识
        var isDraw = false;

        $(monitorAreaArr).each(function(k,o){
            //如果存在此区域ID 则允许重绘
            if(o.areaId == areaID){

                isDraw = true;
                return false;
            }
        });

        //如果不需要重绘 退出本次循环
        if(!isDraw){
            return true;
        }

        //将本项添加到页面要显示的内容中
        realShowArr.push(o);

        //拼接页面中的字符串
        bodyHtml +=
            '<tr>' +
                '<td>' +
                    '<span class="green-patch">'+ o.areaInfo.areaName+'</span>' +
                '</td>' +

                '<td>'+o.devNum+'</td>';

                <!--空开平均温度-->

                if( o.airOpenTemp == -1){
                    bodyHtml +=  '<td>' +
                        ' <span class="table-small-patch table-small-patch-green">'+ '--'+'</span>' +
                        '</td>';
                }else{

                    bodyHtml += '<td>' +
                        ' <span class="table-small-patch table-small-patch-green">'+ o.airOpenTemp.toFixed(1)+'</span>' +
                        '</td>';
                }

                <!--机房平均温度-->
                if( o.computerTemp == -1){
                    bodyHtml +=  '<td>' +
                        ' <span class="table-small-patch table-small-patch-green">'+ '--'+'</span>' +
                        '</td>';
                }else{

                    bodyHtml += '<td>' +
                        '<span class="table-small-patch table-small-patch-green">'+ o.computerTemp.toFixed(1)+'</span>' +
                        '</td>';
                }

                //机房平均湿度
                if( o.computerHum == -1){
                    bodyHtml +=  '<td>' +
                        ' <span class="table-small-patch table-small-patch-green">'+ '--'+'</span>' +
                        '</td>';
                }else{

                    bodyHtml += '<td>' +
                        '<span class="table-small-patch table-small-patch-green">'+ o.computerHum.toFixed(1)+'</span>' +
                        '</td>';
                }

                //USP平均温度
                if( o.upsTemp == -1){
                    bodyHtml +=  '<td>' +
                        ' <span class="table-small-patch table-small-patch-green">'+ '--'+'</span>' +
                        '</td>';
                }else{

                    bodyHtml += '<td>' +
                        '<span class="table-small-patch table-small-patch-green">'+ o.upsTemp.toFixed(1)+'</span>' +
                        '</td>';
                }

        if(o.excData2s != null && o.excData2s.length > 0){

            bodyHtml += '<td><div class="carousel-container carousel slide" area-id="'+ areaID +'"><div class="carousel-inner">';

            $(o.excData2s).each(function(i,o){

                if(i == 0){

                    bodyHtml += getRightAlarmString(o,true)


                }else{

                    bodyHtml += getRightAlarmString(o);

                }

            });

            bodyHtml += '</div></div></td>';

        }else{

            bodyHtml +=   '<td><div>' +
                '<p class="right-bottom-alarm"></p>' +
                '<p class="right-bottom-alarm"></p>' +
                '<p class="right-bottom-alarm"></p>' +
                '</div></td>';
        }

        bodyHtml +=   '</tr>';
    });

    //把body放入到table中
    $('.right-bottom-table tbody').html( bodyHtml);


    //设置轮播时间
    $('.carousel-container').carousel({
        interval: carouselTime * 1000
    });

};

//大屏幕报警弹窗
function getDevMonitAlarmPopup(devAreaID,condition){

    //传递给后台的参数
    var  ecParams = {
        "devTypeID": devTypeID,
        "devAreaID": devAreaID,
        "alarmType": -1,
        "devName": "",
        "alarmName": ""
    };

    if(condition){

        ecParams = condition;

    }

    $.ajax({
        type:'post',
        url:_urls + 'NJNDeviceShow/GetSeAreaDevMonitAlarmPopup',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            setTimeout(function(){

                $('#alarm-message .bottom-table-data-container').showLoading();

            },450);

        },
        success:function(result){

            //给页面赋值
            var tableHtml = "";

            $(result).each(function(i,o){

                tableHtml += "<tr>";

                //设备名称
                tableHtml += "<td>"+ o.devName+"</td>";

                //报警名称
                tableHtml += "<td>"+ o.alarmName+"</td>";

                //位置
                tableHtml += "<td>"+ o.areaName+"</td>";

                //服务区域
                tableHtml += "<td>"+ o.serviceArea+"</td>";

                //类型
                tableHtml += "<td>"+ o.cDtnName+"</td>";

                //级别
                tableHtml += "<td>"+ o.priorityName+"</td>";

                //报警时间
                tableHtml += "<td>"+ o.dataDate+"</td>";

                //是否报单

                var isBaoDan = '未报单';

                if(o.isBaoDan == 1){

                    isBaoDan = '已报单';
                }

                tableHtml += "<td>"+ isBaoDan +"</td>";

                tableHtml += "</tr>"
            });

            setTimeout(function(){

                $('#alarm-message .bottom-table-data-container').hideLoading();

                //页面赋值
                $('#dateTables tbody').html(tableHtml);

            },450);


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//报警类型
function typeOfAlarm(){

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcType',
        success:function(result){

            var html = "<option value='-1'>全部</option>";

            //把设备类型放入页面中
            $(result).each(function(i,o){

                html += "<option value='"+ o.innerID+"'>"+ o.cDtnName+"</option>"
            });

            $('.alarm-select').html(html);
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });
};





