/**
 * Created by admin on 2018/1/27.
 */

$(function(){

    //绘制页面右侧的table
    drawDataTable(titleArr,areaArr);

    var rightTableChart = echarts.init(document.getElementById('right-bottom-echart1'));

    //给table中echart循环赋值
    echartAssignment();

    function echartAssignment(){

        //获取需要赋值的数量
        var length = $('.right-bottom-table .right-bottom-echart').length;

        for(var i=0; i<length; i++){

            ////获取当前ID
            //var id = $('.right-bottom-table .right-bottom-echart').eq(i).attr('id');

            var dom = document.getElementsByClassName('right-bottom-echart')[i];

            var rightTableChart = echarts.init(dom);

            rightTableChart.setOption(option1);
        }
    }


});


//页面右侧Table的表头集合
var titleArr = ['','设备数','暂停占比','自动运行占比','回风平均温度','回风CO2浓度','故障占比','报警'];

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

            ' <!--回风平均温度-->' +
            '<td>' +
            ' <span class="table-small-patch table-small-patch-red">29</span>' +
            '</td>' +

            '<!--回风co2平均浓度-->' +
            '<td>' +
            '<span class="table-small-patch table-small-patch-green">1000</span>' +
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

    //定义当前的设备类型 站房照明为6
    var devTypeID = 6;

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
            title:'支路位置',
            data:'areaName',
            className:'位置'
        },
        {
            title:'所属系统',
            data:'typeName'
        },
        {
            title:'支路名称',
            data:'devName'
        },
        {
            title:'支路编号',
            data:'devNum'
        },
        {
            title:'服务区域',
            data:'serviceArea'
        },
        {
            title:'开关状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                $(data).each(function(i,o){

                    if(o.cTypeID == '4626'){

                        if(o.cDataValue == 1){

                            return "ON"
                        }else{
                            return "OFF";
                        }


                    }
                });

                return '';

            }
        },
        {
            title:'开关控制',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                $(data).each(function(i,o){

                    if(o.cTypeID == '4625'){

                        if(o.cDataValue == 1){

                            return "ON"
                        }else{
                            return "OFF";
                        }


                    }
                });

                return '';

            }
        },
        {
            title:'照度',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){


                return '';

            }
        }
    ]
});





