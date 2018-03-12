/**
 * Created by admin on 2018/1/17.
 */
$(function(){

    //获取页面中的上面要展示的区域及对应的ID
    getDevTypeAreas(devTypeID,getSeAreaSendExhaust);
});


//页面右侧Table的表头集合
var titleArr = ['','设备数','暂停占比','自动运行占比','故障占比','报警'];

//页面右侧Table的统计位置集合
var areaArr = ['-9.6m','0.0m','12.4m','17.1m','19.1m','22.4m','29.4m','东北角配楼','西南角配楼'];

//绘制页面右侧的table
function drawDataTable(titleArr,areaArr){
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

    //绘制table中主体数据
    $(areaArr).each(function(i,o){

        bodyHtml +=
            '<tr>' +
            '<td>' +
            '<span class="green-patch">'+ o+'</span>' +
            '</td>' +

            '<td>13</td>' +
            ' <td>' +

            '<div class="right-bottom-echart" id="right-bottom-echart1">' +

            '</div>' +

            '</td>' +

            '<td>' +

            '<div class="right-bottom-echart" id="right-bottom-echart2">' +

            '</div>' +

            '</td>' +

            '<td>' +

            '<div class="right-bottom-echart" id="right-bottom-echart3">' +

            '</div>' +

            '</td>' +

            '<td>' +
            '<p class="right-bottom-alarm">东出站厅回路1-1 故障</p>' +
            '<p class="right-bottom-alarm">东出站厅回路1-2 故障</p>' +
            '<p class="right-bottom-alarm">东出站厅回路1-3 故障</p>' +
            '</td>' +
            '</tr>';
    });

    //把body放入到table中

    $('.right-bottom-table tbody').html( bodyHtml);
};


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

    //定义当前的设备类型 送排风为3
    var devTypeID = 3;

    //获取当前的设备列表
    getSecondColdHotSour('NJNDeviceShow/GetSecondLightWait', devTypeID, areaID);

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
            title:'设备位置',
            data:'areaName',
            className:'位置'
        },
        {
            title:'所属系统',
            data:'typeName'
        },
        {
            title:'设备名称',
            data:'devName'
        },
        {
            title:'设备编号',
            data:'devNum'
        },
        {
            title:'服务区域',
            data:'serviceArea'
        },
        {
            title:'运行状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){


                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4125'){

                        if(o.cDataValue == 1){

                            result =  "ON"
                        }else{
                            result =  "OFF";
                        }


                    }
                });

                return result;

            }
        },
        {
            title:'手自动状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4124'){

                        if(o.cDataValue == 1){

                            result =  "自动"
                        }else{
                            result =  "手动";
                        }


                    }
                });

                return result;

            }
        },
        {
            title:'故障状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '16' ||　o.cTypeID　== '19'){

                        if(o.cDataValue == 1){

                            result =  "故障"
                        }else{
                            result =  "正常";
                        }


                    }
                });

                return result;

            }
        },
        {
            title:'压差开关',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4121'){

                        if(o.cDataValue == 1){

                            result =  "ON"
                        }else{

                            result =  "OFF";
                        }


                    }
                });

                return result;

            }
        },
        {
            title:'启停控制',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4123'){

                        if(o.cDataValue == 1){

                            result =  "ON"
                        }else{
                            result =  "OFF";
                        }


                    }
                });

                return result;

            }
        },
        {
            title:'安全联动',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                return '';

            }
        }
    ]
});


//-------------------------------------获取流程图右侧展示数据--------------------------//
//定义当前的设备类型 送排风为3
var devTypeID = 3;

function getSeAreaSendExhaust(){

    //传递给后台的数据
    var ecParams = {
        "devTypeID": devTypeID,
        "pointerID": curPointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'NJNDeviceShow/GetSeAreaSendExhaust',
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

            '<td>'+o.devNum+'</td>' +
            ' <td>' +

            '<div class="right-bottom-echart" id="">' +

            '</div>' +

            '</td>' +

            '<td>' +

            '<div class="right-bottom-echart" id="">' +

            '</div>' +

            '</td>' +
            '<td>' +

            '<div class="right-bottom-echart" id="">' +

            '</div>' +

            '</td>';

        if(o.excData2s != null && o.excData2s.length > 0){

            bodyHtml += '<td><div class="carousel-container carousel slide"><div class="carousel-inner">';

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

    //给echart图赋值
    echartReDraw(realShowArr);

};

//给右侧流程图循环赋值
function echartReDraw(realDataArr){

    //根据页面中展示的数据给echarts循环赋值
    $(realDataArr).each(function(i,o){

        //暂停占比
        var openStopProp = o.openStopProp;

        //手自动运行占比
        var handAutoProp = o.handAutoProp;

        //故障占比
        var alarmProp = o.alarmProp;

        var dataArr = [openStopProp,handAutoProp,alarmProp];

        var tableDom = document.getElementsByClassName('right-bottom-table')[0];

        var tbodyDom = tableDom.getElementsByTagName('tbody')[0];

        var trDom = tbodyDom.getElementsByTagName('tr')[i];

        $(dataArr).each(function(k,o){

            var echartDom = trDom.getElementsByClassName('right-bottom-echart')[k];

            var data1 = (o * 100).toFixed(0);

            var data2 = 100 - data1;

            option1.series[0].data = [data1,data2];

            option1.title.text = data1+ '%';

            var rightTableChart = echarts.init(echartDom);

            rightTableChart.setOption(option1);

        });

    });

};



