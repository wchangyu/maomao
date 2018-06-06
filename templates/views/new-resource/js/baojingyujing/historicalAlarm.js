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

    //获取报警设备类型
    getAlarmDeviceType();

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

        //获取报警日志id
        var alaLogID = $(this).attr('data-alaLogID');

        for(var i=0;i<totalArr.length;i++){
            if(totalArr[i].alaLogID ==alaLogID){
                historyArr = totalArr[i].childDevAlarmNumPopupReturns;
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

//存放所有报警数据
var totalArr = [];

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
                if(data){
                    return data.split(' ')[0];
                }
            }
        },
        {
            "title":"时间",
            "data":"dataDate",
            "render":function(data,type,row,meta){
                if(data){
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
        },
        {
            "title": "查看",
            "class":'L-button',
            "targets": -1,
            "data": 'alaLogID',
            "render":function(data,type,row,meta){

                if(row.childDevAlarmNumPopupReturns.length > 0){

                    return  "<button class='btn details-control' data-alaLogID="+data+" >显示/隐藏历史</button>"
                }else{

                    return  "无"
                }

            }
            //"defaultContent": "<button class='btn details-control' data-alaLogID=''>显示/隐藏历史</button>"
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
                {value:0, name:'已维修'},
                {value:0, name:'未维修'}
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

//获取报警设备类型
function getAlarmDeviceType(){

    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix + 'NJNDeviceShow/GetFirstDevTypes',
        success:function(result){

            var html = "<option value='0'>全部</option>";

            //把设备类型放入页面中
            $(result).each(function(i,o){

                html += "<option value='"+ o.pK_DevType+"'>"+ o.devTypeName+"</option>"
            });

            $('#alarm-device-type').html(html);

            //获取报警数据
            alarmHistory();
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });

};

//获取报警数据
function alarmHistory(){

    //获取开始结束时间
    var startTime = $('.min').val();

    var endTime = moment($('.max').val()).add('1','days').format('YYYY/MM/DD');

    //获取车站
    var pointerID = $('#alarm-station').val();

    //获取报警级别
    var priorityID = $('#alarm-level').val();

    //获取报警设备类型
    var devType = $('#alarm-device-type').val();

    //获取报警名称
    var alarmName = $('.alarm-incident').val();

    //定义传递给后台的数据
    var ecParams = {
        "startTime": startTime,
        "endTime": endTime,
        "alarmName": alarmName,
        "pointerIDs": pointerID,
        "priorityID": priorityID,
        "devType": devType,
        "alarmType": -1,
        "isBaoDan": -1

    };

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetDevAlarmHistoryData',
        data:ecParams,
        beforeSend:function(){

            _maintainEchart.showLoading();

        },
        success:function(result){

            console.log(result);

            _maintainEchart.hideLoading();

            if(result == null || result.length == 0){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求无数据', '');

                return false;
            }

            //获取普通报警
            $('.survey-data-container3 .data').html(result.u3dAlarmNums[0].alarmNum);

            //获取严重报警
            $('.survey-data-container2 .data').html(result.u3dAlarmNums[1].alarmNum);

            //获取紧急报警
            $('.survey-data-container1 .data').html(result.u3dAlarmNums[2].alarmNum + result.u3dAlarmNums[3].alarmNum);

            //绘制维修概况的数据
            //获取已维修数据
            var endRepairNum = result.u3dAlarmGondDanNum.endRepairNum;

            //获取未维修数据
            var noRepairNum = result.u3dAlarmGondDanNum.noRepairNum;

            var dataArr = [
                {value:endRepairNum, name:'已维修',label:{padding:[20,0,0,0]}},
                {value:noRepairNum, name:'未维修'}
            ];

            _maintainoption.series[0].data = dataArr;

            _maintainEchart.setOption( _maintainoption,true);

            //绘制下方报警列表
            totalArr.length = 0;
            totalArr = result.devAlarmNumDatas;
            _datasTable($('#alarm-datatables'),result.devAlarmNumDatas);
        },
        error:function(jqXHR, textStatus, errorThrown){
            _maintainEchart.hideLoading();
            console.log(jqXHR.responseText);
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求失败', '');

            }
        }
    });
};

//显示隐藏
function format ( d ) {

    var theader = '<table class="table">' +
        '<thead><tr><td>日期</td><td>时间</td><td>报警级别</td><td>报警名称</td><td>设备类型</td><td>设备</td><td>区域</td><td>位置</td></tr></thead>';
    var theaders = '</table>';
    var tbodyer = '<tbody>';
    var tbodyers = '</tbody>';
    var str = '';
    for(var i=0;i< d.length;i++){

        str += '<tr>' +
            '<td>' + d[i].dataDate.split(' ')[0] +
            '</td><td>' + d[i].dataDate.split(' ')[1] +
            '</td><td>' + d[i].priorityName +
            '</td><td>' + d[i].alarmName +
            '</td><td>' + d[i].devType +
            '</td><td>' + d[i].devName  +
            '</td><td>' + d[i].areaName +
            '</td><td>' + d[i].devLocal +
            '</td></tr>';
    }
    return theader + tbodyer + str + tbodyers + theaders;
};

