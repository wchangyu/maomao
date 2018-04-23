/**
 * Created by admin on 2018/4/23.
 */

$(function(){

    //时间插件初始化
    _timeYMDComponentsFun($('.datatimeblock'));

    //获取报警等级
    getAlarmLevel();

    //获取全部车站
    getAlarmStation();

    var _ajaxEndTime = moment().format("YYYY/MM/DD");

    var _ajaxStartTime = moment().subtract(1,'d').format("YYYY/MM/DD");

    //日期插件
    $('.min').val(_ajaxStartTime);
    $('.max').val(_ajaxEndTime);

    /*-----------------------按钮事件------------------------*/
    $('.btn-success').click(function(){

        //获取报警数据
        alarmHistory();
    });

    $('#alarm-datatables tbody').on('click', 'td .details-control', function () {
        var $this = $(this);
        var cnames = $this.parents('tr').children('.cname').html();
        var pointerIDs = $this.parents('tr').children('.pointerID').html();
        var historyArr = [];

        for(var i=0;i<totalArr.length;i++){
            if(totalArr[i].cName == cnames && totalArr[i].pointerID == pointerIDs){
                historyArr.push(totalArr[i])
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
});

/*--------------------------表格-------------------------*/

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
                    return data.split('T')[0];
                }
            }
        },
        {
            "title":"时间",
            "data":"dataDate",
            "render":function(data,type,row,meta){
                if(data && data.length >0){
                    return [1];
                }
            }
        },
        {
            "title": "报警级别",
            "class":"",
            "data":"cName"
        },
        {
            "title": "报警事件",
            "data":"pointerName"
        },
        {
            "title": "系统类型",
            "data":"cDtnName"
        },
        {
            "title": "设备类型",
            "data":"cDtnName"
        },
        {
            "title": "设备",
            "data":"expression"
        },
        {
            "title": "区域",
            "data":"data"
        },
        {
            "title": "位置",
            "data":"expression"
        },
        {
            "title": "查看",
            "class":'L-button',
            "targets": -1,
            "data": null,
            "defaultContent": "<button class='btn details-control' data-alaLogID=''>显示/隐藏历史</button>"
        }
    ]
});


//维修概况中的echart
var _maintainoption = {
    //title : {
    //    text: '某站点用户访问来源',
    //    subtext: '纯属虚构',
    //    x:'center'
    //},
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    //legend: {
    //    orient: 'vertical',
    //    left: 'left',
    //    data: ['直接访问','邮件营销']
    //},
    series : [
        {
            name: '维修概况',
            type: 'pie',
            radius : '85%',
            center: ['50%', '50%'],
            data:[
                {value:335, name:'已维修'},
                {value:310, name:'未维修'}
            ],
            itemStyle: {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#14E398', '#0d9dcb'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        formatter: '{b}: {c}({d}%)',
                        fontSize:16
                    },
                    labelLine : {

                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

//初始化echart
var _maintainEchart = echarts.init(document.getElementById('maintain-echart'));

 _maintainEchart.setOption( _maintainoption,true);

//获取报警等级
function getAlarmLevel(){

    var levelHtml = "<option value='0'>全部</option>";

    $(alarmLevel).each(function(i,o){

        levelHtml += "<option value='"+ o.id+"'>"+ o.name+"</option>"
    });

    $('#alarm-level').html(levelHtml);
}

//获取全部车站
function getAlarmStation(){

    //存放楼宇ID列表
    var levelHtml = "";

    var pointerArr = $.parseJSON(sessionStorage.getItem('pointers'));

    $(pointerArr).each(function(i,o){

        levelHtml += "<option value='"+ o.pointerID+"'>"+ o.pointerName+"</option>"
    });

    $('#alarm-station').html(levelHtml);
}

//获取报警设备类型
function getAlarmDeviceType(){

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

//获取报警数据
function alarmHistory(){

    //定义传递给后台的数据
    var ecParams = {


    };

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcType',
        success:function(result){

            //绘制报警概况的数据
            var html = "";

            //把设备类型放入页面中
            $(result).each(function(i,o){

                html += "<option value='"+ o.innerID+"'>"+ o.cDtnName+"</option>"
            });

            $('.alarm-incident').html(html);

            //绘制维修概况的数据

            //绘制下方报警列表
            _datasTable($('#alarm-datatables'),result);
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });
};

//显示隐藏
function format ( d ) {

    var theader = '<table class="table">' +
        '<thead><tr><td>日期</td><td>时间</td><td>报警级别</td><td>报警事件</td><td>系统类型</td><td>设备类型</td><td>设备</td><td>区域</td><td>位置</td></tr></thead>';
    var theaders = '</table>';
    var tbodyer = '<tbody>'
    var tbodyers = '</tbody>';
    var str = '<tr><td>' + d[1].dataDate.split('T')[0] + ' ' + d[1].dataDate.split('T')[1] +
        '</td><td>' + d[1].cName +
        '</td><td>' + d[1].pointerName +
        '</td><td>' + d[1].cDtnName +
        '</td><td>' + d[1].expression +
        '</td><td>' + d[1].data.toFixed(2) +
        '</td><td>' + d[1].priority +
        '</td></tr>';
    for(var i=2;i< d.length;i++){
        var atime = d[i].dataDate.split('T')[0] + ' ' + d[i].dataDate.split('T')[1];
        str += '<tr><td>' + atime +
            '</td><td>' + d[i].cName +
            '</td><td>' + d[i].pointerName +
            '</td><td>' + d[i].cDtnName +
            '</td><td>' + d[i].expression +
            '</td><td>' + d[i].data.toFixed(2) +
            '</td><td>' + d[i].priority +
            '</td></tr>'
    }
    return theader + tbodyer + str + tbodyers + theaders;
};

