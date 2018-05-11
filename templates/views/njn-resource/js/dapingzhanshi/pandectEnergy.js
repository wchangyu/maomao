/**
 * Created by admin on 2018/1/22.
 */
$(function(){

    //从后台获取用户配置的数据
    getDeployByUser();

    //获取报警类型
    typeOfAlarm();

    //获取页面主题部分数据
   // getTPDevMonitor();

    ////获取电耗分项数据
    //getFirstEnergyItemData();

    //设备报警
    //getStationAlarmData(1);

    //时间插件初始化
    _timeYMDComponentsFun($('.datatimeblock'));

    //点击能源管理上方切换时间按钮
    $('.right-bottom-container .right-tab').on('click',function(){

        //删除之前选中的类
        $(this).parents('.left-tab-container').find('.right-tab').removeClass('right-tab-choose');

        //给当前选中元素添加选中类名
        $(this).addClass('right-tab-choose');

        if(userEquipObj != {}){

            //获取当前的索引
            var index = $(this).index();

            //获取当前要取出的设备报警数据索引
            var thisIndex = 2 - ((index - 1) / 2) ;

            //数据赋值
            leftBottomOption.series[0].data = userEquipAlarmArr[thisIndex].value;
            leftBottomOption.xAxis[0].data = userEquipAlarmArr[thisIndex].xData;

            //页面重绘数据
            leftBottomChart.setOption(leftBottomOption,true);

            return false;
        }

        //设备报警
        getStationAlarmData(1);

        getStationAlarmNum();

    });

    //默认刷新时间
    var _refresh = sessionStorage.getItem("dapinInterval");

    if(_refresh!=0){

        //定时刷新
        setInterval(function(){

            //从后台获取用户配置的数据
            getDeployByUser();


        },_refresh * 1000 * 60)
    };

    //-----------------------------主设备 副设备信息弹窗-----------------------------//

    //初始化表格
    table = $('#dev-grade-dateTables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
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
                "title": "设备名称",
                "data":"devName"
            },
            {
                "title": "设备类型",
                "data":"typeName"
            },
            {
                "title": "设备区域",
                "data":"areaName"
            },
            {
                "title": "服务区域",
                "data":"serviceArea"
            },
            {
                "title": "子设备信息",
                "class":'L-button',
                "targets": -1,
                "data": 'id',
                "render":function(data,type,row,meta){

                    if(row.childDevgradeTypeInfos.length == -1){

                        return  "无子设备"

                    }else{

                        return  "<button class='btn-success details-control' data-id="+data+" >查看子设备</button>"
                    }



                }
                //"defaultContent": "<button class='btn details-control' data-alaLogID=''>显示/隐藏历史</button>"
            }
        ]
    });

    //点击主设备 副设备弹出运行弹窗 并展示数据
    $(".right-picture-data").on('click','.access-device',function(){

        //console.log(33);

        //显示悬浮窗
        $('#dev-grade-message').modal('show');

        //获取当前的设备类型
        var devTypeArr = [1,2,3,4,7,18,19,20,21];

        //获取后台数据并页面赋值
        getDevgradeTypeInfo(devTypeArr);

    });

    //主设备 副设备弹窗中的查询功能
    $('#dev-grade-message .demand-button').on('click',function(){

        //获取当前的设备类型
        var devTypeArr = [];

        $("#dev-grade-message .equip-types option").each(function(i,o){

            var thisValue = $(o).attr('value');

            if(thisValue != ""){

                devTypeArr.push(thisValue);
            }

        });

        //获取用户选中的设备类型
        var selectDevType = $('#dev-grade-message .equip-types').val();

        if(selectDevType != ''){

            devTypeArr = [selectDevType];
        };


        //获取设备名称
        var devName = $('#dev-grade-message .dev-type').val();

        console.log($('#dev-grade-message .dev-type').val());

        var condition =   {
            "pointerID":curPointerIDArr[0],
            "devTypeIDs": devTypeArr,
            "devName": devName
        };

        //获取设备运行数据
        getDevgradeTypeInfo('',condition);

    });

    $('#dev-grade-dateTables tbody').on('click', 'td .details-control', function () {

        //获取报警日志id
        var alaLogID = $(this).attr('data-id');

        for(var i=0;i<devGradeArr.length;i++){
            if(devGradeArr[i].id ==alaLogID){
                historyArr = devGradeArr[i].childDevgradeTypeInfos;
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

    //点击运行参数信息中的查看主副设备按钮
    $('#run-number-message .right-dev-grade').on('click',function(){

        //显示悬浮窗
        $('#dev-grade-message').modal('show');

        //获取当前的设备类型
        var devTypeArr = $(this).parent().find('.systematic-name').attr('data-devtype').split(",");

        //获取后台数据并页面赋值
        getDevgradeTypeInfo(devTypeArr);

    });

    //-----------------------------报警信息弹窗-----------------------------//

    //点击报警信息弹出报警弹窗 并展示数据
    $(".alarm-data-container").on('click',function(){

        //select框默认选中第一个
        $('#alarm-message .alarm-select option:first').prop("selected", 'selected');

        //显示悬浮窗
        $('#alarm-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //放入到弹窗标题中
        $('#alarm-message .systematic-name').html(title);

        //获取当前的设备类型
        var devTypeArr = $(this).attr('data-devtype').split(',');

        $('#alarm-message .systematic-name').attr('data-devtype',$(this).attr('data-devtype'));

        //获取报警数据
        getDevMonitAlarmPopup(devTypeArr);

    });

    //报警信息弹窗中的查询功能
    $('#alarm-message .demand-button').on('click',function(){

        //获取当前的设备类型
        var devTypeArr = $('#alarm-message .systematic-name').attr('data-devtype').split(',');

        //获取报警类型
        var alarmType = $('#alarm-message .alarm-select').val();

        //获取设备名称
        var devName = $('#alarm-message .dev-type').val();

        //获取报警名称
        var alarmName = $('#alarm-message .alarm-type').val();

        var condition =   {
            "pointerID":curPointerIDArr[0],
            "devTypeIDs": devTypeArr,
            "alarmType": alarmType,
            "devName": devName,
            "alarmName": alarmName,
            "startTime": startDate,
            "endTime": endDate
        };

        //获取报警数据
        getDevMonitAlarmPopup(devTypeArr,condition);

    });



    //-----------------------------消防报警信息弹窗-----------------------------//

    //点击报警信息弹出报警弹窗 并展示数据
    $(".alarm-data-container1").on('click',function(){

        //select框默认选中第一个
        $('#alarm-fire-message .alarm-select option:first').prop("selected", 'selected');

        //显示悬浮窗
        $('#alarm-fire-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //放入到弹窗标题中
        $('#alarm-fire-message .systematic-name').html(title);


        //获取报警数据
        GetFireDetailsForNjDatas();

    });

    //报警信息弹窗中的查询功能
    $('#alarm-fire-message .demand-button').on('click',function(){

        //获取报警内容
        var alarmContent = $('#alarm-fire-message .alarm-content').val();

        var condition =   {
            "pointerID":curPointerIDArr[0],
            "alarmName": alarmContent
        };

        //获取报警数据
        GetFireDetailsForNjDatas(condition);

    });

    //-----------------------------消防运行信息弹窗-----------------------------//

    //点击报警信息弹出报警弹窗 并展示数据
    $(".bottom-equipment-chart-show1").on('click',function(){

        //select框默认选中第一个
        $('#run-fire-message .alarm-select option:first').prop("selected", 'selected');

        //显示悬浮窗
        $('#run-fire-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //放入到弹窗标题中
        $('#run-fire-message .systematic-name').html(title);


        var condition =   {
            "pointerID":curPointerIDArr[0],
            "alarmName": '',
            "fireTTypes": 20
        };

        //获取报警数据
        GetFireDetailsForNjDatas(condition,true);

    });

    //报警信息弹窗中的查询功能
    $('#run-fire-message .demand-button').on('click',function(){

        //获取报警内容
        var alarmContent = $('#run-fire-message .alarm-content').val();

        var condition =   {
            "pointerID":curPointerIDArr[0],
            "alarmName": alarmContent,
            "fireTTypes": 20
        };

        //获取报警数据
        GetFireDetailsForNjDatas(condition,true);

    });

    //-----------------------------能源管理报警信息弹窗-----------------------------//

    //点击报警信息弹出报警弹窗 并展示数据
    $(".alarm-data-container2").on('click',function(){

        //显示悬浮窗
        $('#alarm-energy-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //放入到弹窗标题中
        $('#alarm-energy-message .systematic-name').html(title);


        //获取报警数据
        getEnergyAlarmPopupData();

    });

    //报警信息弹窗中的查询功能
    $('#alarm-energy-message .demand-button').on('click',function(){

        //获取报警名称
        var alarmName = $('#alarm-energy-message .alarm-name').val();

        var condition =   {
            "pointerID":curPointerIDArr[0],
            "startTime": startDate,
            "alarmName": alarmName,
            "endTime": endDate
        };

        //获取报警数据
        getEnergyAlarmPopupData(condition);

    });

    //-----------------------------运行信息弹窗-----------------------------//

    //点击运行信息弹出运行弹窗 并展示数据
    $(".bottom-equipment-chart-show").on('click',function(){

        //显示悬浮窗
        $('#run-number-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //放入到弹窗标题中
        $('#run-number-message .systematic-name').html(title);

        //获取当前的设备类型
        var devTypeArr = $(this).parents('.right-bottom-equipment-content').find('.alarm-data-container').attr('data-devtype').split(',');


        $('#run-number-message .systematic-name').attr('data-devtype',$(this).parents('.right-bottom-equipment-content').find('.alarm-data-container').attr('data-devtype'));

        if($(this).attr('data-devtype')){

            devTypeArr = $(this).attr('data-devtype').split(',');

            $('#run-number-message .systematic-name').attr('data-devtype',$(this).attr('data-devtype'));
        }

        //获取后台数据并页面赋值
        getDevRunParaPopupData(devTypeArr);

    });

    //运行信息弹窗中的查询功能
    $('#run-number-message .demand-button').on('click',function(){

        //获取当前的设备类型
        var devTypeArr = $('#run-number-message .systematic-name').attr('data-devtype').split(',');

        //获取用户选中的设备类型
        var selectDevType = $('#run-number-message .equip-types').val();

        if(selectDevType != ''){

            devTypeArr = [selectDevType];
        };

        //获取设备状态
        var devStateID = $('#run-number-message .equip-states').val();

        //获取设备名称
        var devName = $('#run-number-message .dev-type').val();

        var condition =   {
            "pointerID":curPointerIDArr[0],
            "devTypeIDs": devTypeArr,
            "devName": devName,
            "devStateID": devStateID,
            "startTime": startDate,
            "endTime": endDate
        };

        //获取设备运行数据
        getDevRunParaPopupData('',condition);

    });

    //-----------------------------温度信息弹窗-----------------------------//

    //点击运行温度弹出运行弹窗 并展示数据
    $(".bottom-equipment-chart-humiture").on('click',function(){

        //显示悬浮窗
        $('#humiture-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //console.log(title);

        //放入到弹窗标题中
        $('#humiture-message .systematic-name').html(title);

        var condition = {
            "reportID": "1",
            "requesparameters": [
                {
                    "name": "dh_name",
                    "value": ""
                },
                {
                    "name": "dh_weizhi",
                    "value": ""
                },
                {
                    "name": "dh_ctypeid",
                    "value": "4321"
                },
                {
                    "name": "dh_devtype",
                    "value": "7"
                },
                {
                    "name": "dh_pointerid",
                    "value": curPointerIDArr[0]
                }
            ]
        };

        //获取后台数据
        getTableData(condition,'#dateTables-humiture');

    });

    //温度弹窗中的查询功能
    $('#humiture-message .demand-button').on('click',function(){

        //获取当前的设备名称
        var equipmentName = $('#humiture-message .demand-condition-container li').eq(0).find('input').val();

        var condition = {
            "reportID": "1",
            "requesparameters": [
                {
                    "name": "dh_name",
                    "value": equipmentName
                },
                {
                    "name": "dh_weizhi",
                    "value": ""
                },
                {
                    "name": "dh_ctypeid",
                    "value": "4321"
                },
                {
                    "name": "dh_devtype",
                    "value": "7"
                },
                {
                    "name": "dh_pointerid",
                    "value": curPointerIDArr[0]
                }
            ]
        };

        //获取后台数据
        getTableData(condition,'#dateTables-humiture');
    });

    //-----------------------------电功率弹窗-----------------------------//

    //点击电功率信息弹出电功率弹窗 并展示数据
    $(".bottom-equipment-chart-electric").on('click',function(){

        //显示悬浮窗
        $('#electric-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //获取当前的设备类型
        var devTypeArr = $(this).parents('.right-bottom-equipment-content').find('.alarm-data-container').attr('data-devtype').split(',');

        $('#electric-message .systematic-name').attr('data-devtype',$(this).parents('.right-bottom-equipment-content').find('.alarm-data-container').attr('data-devtype'));

        //放入到弹窗标题中
        $('#electric-message .systematic-name').html(title);

        //获取后台数据
        getDevMonitPowerData(devTypeArr);

    });

    //电功率信息弹窗中的查询功能
    $('#electric-message .demand-button').on('click',function(){

        //获取当前的设备类型
        var devTypeArr = $('#electric-message .systematic-name').attr('data-devtype').split(',');

        //获取支路名称
        var serviceName = $('#electric-message .serv-name').val();

        var condition =   {
            "pointerID":curPointerIDArr[0],
            "devTypeIDs": devTypeArr,
            "serviceName": serviceName
        };

        //获取报警数据
        getDevMonitPowerData(devTypeArr,condition);
    });

    //-----------------------------故障率弹窗-----------------------------//

    //点击故障率信息弹出故障率弹窗 并展示数据
    $(".bottom-equipment-chart-fault").on('click',function(){

        //显示悬浮窗
        $('#failure-message').modal('show');

        //获取当前系统名称
        var title = $(this).parents(".right-bottom-equipment-container").find(".equipment-title a").html();

        //console.log(title);

        //放入到弹窗标题中
        $('#failure-message .systematic-name').html(title);

    });

    //点击能耗信息弹出能耗弹窗 并展示数据
    $(".bottom-equipment-chart-energy").on('click',function(){

        //显示悬浮窗
        $('#energy-message').modal('show');

        var condition = {
            "reportID": "50000",
            "requesparameters": [
                {
                    "name": "pointerid",
                    "value": curPointerIDArr[0]
                },
                {
                    "name": "startdate",
                    "value": startDate
                },
                {
                    "name": "enddate",
                    "value": endDate
                }
            ]
        };

        //获取后台数据
        getTableData(condition,'#dateTables-energy');

    });

    //能耗信息弹窗中的查询功能
    $('#energy-message .demand-button').on('click',function(){

        //获取当前的开始结束时间
        var startDate = $('#energy-message .demand-condition-container li').eq(0).find('input').val();

        var endDate = $('#energy-message .demand-condition-container li').eq(1).find('input').val();
        endDate = moment(endDate).add('1','days').format('YYYY-MM-DD');

        var condition = {
            "reportID": "50000",
            "requesparameters": [
                {
                    "name": "pointerid",
                    "value": curPointerIDArr[0]
                },
                {
                    "name": "startdate",
                    "value": startDate
                },
                {
                    "name": "enddate",
                    "value": endDate
                }
            ]
        };

        //获取后台数据
        getTableData(condition,'#dateTables-energy');
    });

    //点击能耗费用信息弹出能耗费用弹窗 并展示数据
    $(".bottom-equipment-chart-cost").on('click',function(){

        //显示悬浮窗
        $('#cost-message').modal('show');

        getEnergyCostData();

    });

    //能耗信息弹窗中的查询功能
    $('#cost-message .demand-button').on('click',function(){

        //获取当前的开始结束时间
        var startDate = $('#cost-message .demand-condition-container li').eq(0).find('input').val();

        var endDate = $('#cost-message .demand-condition-container li').eq(1).find('input').val();
        endDate = moment(endDate).add('1','days').format('YYYY-MM-DD');

        //传递给后台的参数
        var condition = {
            "pointerID":curPointerIDArr[0],
            "startTime": startDate,
            "endTime": endDate
        };

        //获取后台数据
        getEnergyCostData(condition);
    });

    //点击节能减排信息弹出能耗费用弹窗 并展示数据
    $(".right-bottom-centent-conservation").on('click',function(){

        //获取当前能耗类型
        var title = $(this).find('.top-title').html();

        //放入到弹窗标题中
        $('#conservation-message h4').html(title);

        //显示悬浮窗
        $('#conservation-message').modal('show');

    });

    //-----------------------------右下角故障设备信息弹窗-----------------------------//

    //点击故障设备信息弹出故障设备弹窗 并展示数据
    $(".right-bottom-content-trouble").on('click',function(){

        //显示悬浮窗
        $('#trouble-message').modal('show');

        //获取后台数据
        getDevFaultAlarmPropData()

    });

    //故障设备信息弹窗中的查询功能
    $('#trouble-message .demand-button').on('click',function(){

        //获取当前的开始时间
        var startDate = $('#electric-message .min-date').val();

        //获取结束时间
        var endDate = $('#electric-message .max-date').val();

        var condition =   {
            "pointerID":curPointerIDArr[0],
            "startTime": startDate,
            "endTime": endDate
        };

        //获取报警数据
        getDevFaultAlarmPropData(condition);

    });

    //-----------------------------右下角所有设备报警信息弹窗-----------------------------//

    //点击报警信息弹出报警弹窗 并展示数据
    $(".total-equip-alarm").on('click',function(){

        //select框默认选中第一个
        $('#alarm-message1 .alarm-select option:first').prop("selected", 'selected');

        //显示悬浮窗
        $('#alarm-message1').modal('show');

        //获取报警数据
        getDevAlarmNumPopupData();

    });

    //报警信息弹窗中的查询功能
    $('#alarm-message1 .demand-button').on('click',function(){


        //获取报警类型
        var alarmType = $('#alarm-message1 .alarm-select').val();

        //获取设备名称
        var devName = $('#alarm-message1 .dev-type').val();

        //获取报警名称
        var alarmName = $('#alarm-message1 .alarm-type').val();

        var condition =   {
            "pointerID":curPointerIDArr[0],
            "alarmType": alarmType,
            "devName": devName,
            "alarmName": alarmName,
            "startTime": startDate,
            "endTime": endDate
        };

        //获取报警数据
        getDevAlarmNumPopupData(condition);

    });

    //点击打开消防系统
    $('.platform-title').on('click',function(){

        window.open ="rdsp-bs-js:{'fcfid':'2','type':'2'}"
    });

    $('.close').on('click',function(){

         $(this).parents('.modal').find('input').val('');

        $('.loading-indicator-overlay').hide();

        $('.loading-indicator').hide();

    });

});

//定义存放所有主副设备信息的数组
var devGradeArr = [];

//定义开始结束时间
var startDate = moment().format('YYYY-MM-DD');

var endDate = moment().add('1','days').format('YYYY-MM-DD');

//左侧下方柱状图
var leftBottomChart = echarts.init(document.getElementById('echarts-left-bottom'));

var leftBottomOption = {
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top:'7%',
        containLabel: true,
        borderColor:'#A8A8A8',
        borderWidth:2
    },
    xAxis : [
        {
            type : 'category',
            data : [],
            axisTick: {
                alignWithLabel: true
            },
            boundaryGap: false,//从起点开始
            nameTextStyle:{
                color:'#DCF1FF'
            },
            nameGap:1,
            axisLine:{
                lineStyle:{
                    color:'#DCF1FF'
                }
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            nameTextStyle:{
                color:'#DCF1FF'
            },
            //name:'单位：次',
            nameLocation:'end',
            axisLine:{
                lineStyle:{
                    color:'#DCF1FF'
                }
            }
        }
    ],
    series : [
        {
            name:'设备报警',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            smooth:true,
            itemStyle:{
                normal:{
                    color:'#fff',
                    borderColor: "#2170F4",
                    lineStyle:{
                        width:2,
                        color:'#fff'
                    }

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#2170F4'
                    }, {
                        offset: 1,
                        color: '#61854f'
                    }])
                }
            },
            data:[]
        },
        {
            name:'能耗报警',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            smooth:true,
            itemStyle:{
                normal:{
                    color:'#fff',
                    borderColor: "#14E398",
                    lineStyle:{
                        width:2,
                        color:'#fff'
                    }

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#14E398'
                    }, {
                        offset: 1,
                        color: '#61854f'
                    }])
                }
            },
            data:[]
        },
        {
            name:'能耗报警',
            type:'line',
            symbol: "circle",//拐点样式
            symbolSize: 8,//拐点大小
            smooth:true,
            itemStyle:{
                normal:{
                    color:'#fff',
                    borderColor: "#EAD01E",
                    lineStyle:{
                        width:2,
                        color:'#fff'
                    }

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#EAD01E'
                    }, {
                        offset: 1,
                        color: '#61854f'
                    }])
                }
            },
            data:[]
        }
    ]
};

//重绘chart图
leftBottomChart.setOption(option0);

//定义是否出现加载遮罩的标识
var ifShowLoading = true;

var ifShowLoading2 = true;

//定义计算安全运行天数的开始日期
var startSafeDate = new Date('2017/01/01 12:00');

var date2 = new Date();

var s1 = startSafeDate.getTime(),s2 = date2.getTime();

var total = (s2 - s1)/1000;

var safeDays = parseInt(total / (24*60*60));//计算整数天数

//给页面中赋值
$('.right-bottom-safe .safe-days').html(safeDays);

//console.log(safeDays);

//冷热源echart
var _electricityEcharts = echarts.init(document.getElementById('equipment-chart-electricity'));

var _electricityEcharts1 = echarts.init(document.getElementById('equipment-chart-electricity1'));

var dataStyle = {
    normal: {
        label: {show:false},
        labelLine: {show:false}
    }
};
var placeHolderStyle = {
    normal : {
        color: 'rgba(0,0,0,0)',
        label: {show:false},
        labelLine: {show:false}
    },
    emphasis : {
        color: 'rgba(0,0,0,0)'
    }
};

var _electricityoption = {

    title: {
        text: '3.5',
        subtext: '电冷能效',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '115',
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 24,
            fontWeight : 'normal',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 12
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right : 85,
        y : 10,
        itemGap:2,
        data:['输入电量','输出冷量'],
        show:true,
        itemWidth:22,
        itemHeight:10,
        textStyle:{
            color:'white',
            fontSize:10
        }
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    series : [
        {
            name:'1',
            type:'pie',
            radius : [50, 60],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:68,
                    name:'输入电量',
                    itemStyle: {
                        normal : {
                            color: '#14e398'
                        }
                    }

                },
                {
                    value:32,
                    name:'68kw',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [40, 50],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:29,
                    name:'输出冷量',
                    itemStyle: {
                        normal : {
                            color: '#2170f4'

                        }
                    }
                },
                {
                    value:71,
                    name:'29kw',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

//_electricityEcharts.setOption(_electricityoption,true);
//
//_electricityEcharts1.setOption(_electricityoption,true);

//组合空调echart
var _conditionerEcharts = echarts.init(document.getElementById('equipment-chart-conditioner'));

var _conditionerEcharts1 = echarts.init(document.getElementById('equipment-chart-conditioner1'));

var _conditioneroption = {

    title: {
        text: '228',
        subtext: '总台数',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '115',
        itemGap: -2,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 24,
            fontWeight : 'normal',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 12
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right : 85,
        y : 10,
        itemGap:2,
        data:['运行中','故障中','维修中'],
        show:true,
        itemWidth:20,
        itemHeight:10,
        textStyle:{
            color:'white',
            fontSize:10
        }
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    series : [
        {
            name:'1',
            type:'pie',
            radius : [50, 60],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:68,
                    name:'运行中',
                    itemStyle: {
                        normal : {
                            color: '#14e398'
                        }
                    }

                },
                {
                    value:32,
                    name:'68kw',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [40, 50],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:29,
                    name:'故障中',
                    itemStyle: {
                        normal : {
                            color: '#f8276c'

                        }
                    }
                },
                {
                    value:71,
                    name:'29kw',
                    itemStyle : placeHolderStyle
                }


            ]
        },
        {
            name:'3',
            type:'pie',
            radius : [30, 40],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:19,
                    name:'维修中',
                    itemStyle: {
                        normal : {
                            color: '#ead01e'

                        }
                    }
                },
                {
                    value:81,
                    name:'29kw',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

//_conditionerEcharts.setOption(_conditioneroption,true);
//
//_conditionerEcharts1.setOption(_electricityoption,true);

//电梯系统echart
var _elevatorEcharts = echarts.init(document.getElementById('equipment-chart-elevator'));

var _elevatorEcharts1 = echarts.init(document.getElementById('equipment-chart-elevator1'));


//_elevatorEcharts.setOption(_conditioneroption,true);
//
//_elevatorEcharts1.setOption(_conditioneroption,true);

//动环系统echart
var _rotatingEcharts = echarts.init(document.getElementById('equipment-chart-rotating'));

var _rotatingEcharts1 = echarts.init(document.getElementById('equipment-chart-rotating1'));


//_rotatingEcharts.setOption(_conditioneroption,true);
//
//_rotatingEcharts1.setOption(_electricityoption,true);

//站房照明echart
var _stationEcharts = echarts.init(document.getElementById('equipment-chart-station'));

var _stationoption = {

    title: {
        text: '228',
        subtext: '总台数',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '115',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
    tooltip : {
        show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right : 85,
        y : 10,
        itemGap:2,
        data:['运行中','故障中'],
        show:true,
        itemWidth:20,
        itemHeight:10,
        textStyle:{
            color:'white',
            fontSize:10
        }
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    series : [
        {
            name:'1',
            type:'pie',
            radius : [50, 60],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:68,
                    name:'运行中',
                    itemStyle: {
                        normal : {
                            color: '#14e398'
                        }
                    }

                },
                {
                    value:32,
                    name:'68kw',
                    itemStyle : placeHolderStyle
                }

            ]
        },
        {
            name:'2',
            type:'pie',
            radius : [40, 50],
            center:['50%', '60%'],
            itemStyle : dataStyle,
            data:[
                {
                    value:29,
                    name:'故障中',
                    itemStyle: {
                        normal : {
                            color: '#f8276c'

                        }
                    }
                },
                {
                    value:71,
                    name:'29kw',
                    itemStyle : placeHolderStyle
                }


            ]
        }
    ]
};

//_stationEcharts.setOption( _stationoption,true);


//站台照明echart
var _platformEcharts = echarts.init(document.getElementById('equipment-chart-platform'));

//_platformEcharts.setOption( _stationoption,true);

//送排风echart
var _windEcharts = echarts.init(document.getElementById('equipment-chart-wind'));

//_windEcharts.setOption( _stationoption,true);

//给排水echart
var _waterEcharts = echarts.init(document.getElementById('equipment-chart-water'));

//_waterEcharts.setOption( _stationoption,true);

//能源管理echart配置

var _energyOption = {
    title: {
        text: '2255',
        subtext: '总能耗',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '116',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        right : 85,
        y : 10,
        itemGap:2,
        data:[],
        show:true,
        itemWidth:20,
        itemHeight:10,
        textStyle:{
            color:'white',
            fontSize:10
        }
    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['58%', '72%'],
            center:['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'outside'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#14E398', '#2170F4','#EAD01E', '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : false,
                        formatter:'{d}'+'%'+ '\n{b}',
                        color:'white'
                    },
                    labelLine : {
                        show : false,
                        color:'white'

                    }
                },
                emphasis : {
                    label : {
                        show : false,
                        position : 'center',
                        textStyle : {
                            fontSize : '18',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {
                    name:'已完成',
                    value:100
                },
                {
                    name:'派单中',
                    value:80
                },
                {
                    name:'进行中',
                    value:45
                }
            ]
        }
    ]
};

//能管重绘数据

//设备故障echart图
var _useelectricityChart = echarts.init(document.getElementById('echarts-left-bottom2'));

var _useelectricityoption = {
    title: {
        text: '225',
        subtext: '工单量',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '102',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:[]
    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['45%', '60%'],
            center:['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'outside'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : true,
                        formatter:'{d}'+'%'+ '\n{b}',
                        color:'white'
                    },
                    labelLine : {
                        show : true,
                        color:'white'

                    }
                },
                emphasis : {
                    label : {
                        show : true,
                        position : 'center',
                        textStyle : {
                            fontSize : '18',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data:[
                    {
                        name:'已完成',
                        value:100
                    },
                    {
                        name:'派单中',
                        value:80
                    },
                    {
                        name:'进行中',
                        value:45
                    }
            ]
        }
    ]
};


// 指定图表的配置项和数据 用于本日用能分项
var option8 = {
    title: {
        text: '225',
        subtext: '工单量',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: '160',
        top: '115',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:['暖通系统','照明系统','电梯系统','动环系统','给排水','消防系统','自动售检票','能源管理'],
        textStyle:{
            color:'white'
        }

    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['50%', '65%'],
            center:['65%', '56%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#0d9dcb', '#0cd34c','#cfcf14', '#d36e12', '#dc2612','#b70723', '#7c05cb', '#1c39d9','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : false
                    },
                    labelLine : {
                        show : false
                    }
                },
                emphasis : {
                    label : {
                        show : false,
                        position : 'center',
                        textStyle : {
                            fontSize : '30',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {
                    name:'暖通系统',
                    value:50
                },
                {
                    name:'照明系统',
                    value:45
                },
                {
                    name:'电梯系统',
                    value:35
                },
                {
                    name:'动环系统',
                    value:30
                },
                {
                    name:'给排水',
                    value:25
                },
                {
                    name:'消防系统',
                    value:20
                },
                {
                    name:'自动售检票',
                    value:10
                },
                {
                    name:'能源管理',
                    value:10
                }
            ]
        }
    ]
};

//设备故障页面重绘数据
//_useelectricityChart.setOption(option8,true);


//重绘chart图
//_useelectricityChart.setOption(_useelectricityoption);


var _useelectricityoption1 = {
    title: {
        text: '225',
        subtext: '工单量',
        //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        left: 'center',
        top: '102',
        itemGap: -5,
        textBaseline:'middle',
        textStyle : {
            color : 'white',
            fontFamily : '微软雅黑',
            fontSize : 26,
            fontWeight : 'bolder',
            lineHeight:26
        },
        subtextStyle:{
            color:'white',
            fontSize : 16
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:[]
    },
    series: [
        {
            name:'',
            type:'pie',
            radius: ['45%', '60%'],
            center:['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'outside'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c', '#33E3B6', '#ead01e','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : true,
                        formatter:'{d}'+'%'+ '\n{b}',
                        color:'white'
                    },
                    labelLine : {
                        show : true,
                        color:'white'

                    }
                },
                emphasis : {
                    label : {
                        show : true,
                        position : 'center',
                        textStyle : {
                            fontSize : '18',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data:[
                {
                    name:'照明',
                    value:100
                },
                {
                    name:'暖通空调',
                    value:80
                },
                {
                    name:'设备设施',
                    value:45
                }
            ]
        }
    ]
};

//运维联动
var _operationresponseChart = echarts.init(document.getElementById('operation-chart-response'));

var _operationresponseChart1 = echarts.init(document.getElementById('operation-chart-response1'));

//重绘chart图
_operationresponseChart.setOption(_useelectricityoption);

_operationresponseChart1.setOption(option8);

//清空数据
$('.bottom-content-data span').html('');

//存放用户定义的设备监控数据
var userEquipObj = {};

//存放设备报警数据
var userEquipAlarmArr = [];

//-----------------------------------获取页面主体部分数据----------------------------//

//定义环形图颜色集合
var colorArr1 = ['#14e398','#2170f4'];

var colorArr2 = ['#14e398','#f8276c','#ead01e'];

//定义echart集合
var echartNameArr = [_electricityEcharts,_electricityEcharts1,_conditionerEcharts,_conditionerEcharts1,_elevatorEcharts,_elevatorEcharts1, _rotatingEcharts, _rotatingEcharts1,
    _stationEcharts,_platformEcharts,_windEcharts,_waterEcharts,  _useelectricityChart];

//插入背景圆形图
var cicleHtml = '<div class="bottom-equipment-chart-background"></div>';

$('.right-bottom-equipment-container .bottom-equipment-chart-container .bottom-content-data').before(cicleHtml);

//获取当前是冬季还是夏季 冬季返回 0 夏季返回1
function getSeason(){

    //获取当前年份
    var year = moment().format('YYYY');

    var curDate = moment().format('YYYY-MM-DD');

    //夏季时间
    var summerDate1 = year + '-03-15';

    var summerDate2 = year + '-09-15';

    //如果在夏季
    if(curDate > summerDate1 && curDate < summerDate2){

        return 1

    }else{

        return 0
    }
};

//获取数据
function getTPDevMonitor(){

    //开始结束时间
    var startTime = moment().format('YYYY-MM-DD');

    var endTime = moment().add(1,'days').format('YYYY-MM-DD');

    //传递给后台的数据
    var ecParams = {
        "startTime": startTime,
        "endTime":  endTime,
        "pointerIDs": curPointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'NJNDeviceShow/GetTPDevMonitorNew',
        data:ecParams,
        //timeout:_theTimes * 2,
        beforeSend:function(){

            if(ifShowLoading){
                $( echartNameArr).each(function(i,o){

                    o.showLoading({
                        maskColor: 'rgba(33,43,55,0.8)'
                    });
                });

                ifShowLoading = false;
            }

        },
        success:function(result){

            $( echartNameArr).each(function(i,o){

                o.hideLoading();
            });

            //如果用户定义的设备监控数据不为空
            if(userEquipObj != {}){

                if(result != null){

                    for(var item in userEquipObj){

                        result[item] = userEquipObj[item];
                    }

                }else{

                    result = userEquipObj;

                }
            }

            if(result == null || result.length == 0 || result == {}){

                return false;
            }

            //console.log(result);

            //定义设备故障的数组
            var alarmNumArr = [];

            //暖通系统
            alarmNumArr.push({name:"暖通系统",value:result.hvacAirsOBJ.alarmNum});

            //照明系统
            alarmNumArr.push({name:"照明系统",value:result.lightSysOBJ.alarmNum});

            //电梯系统
            alarmNumArr.push({name:"电梯系统",value:result.elevatorSysOBJ.alarmNum});

            //动环系统
            alarmNumArr.push({name:"动环系统",value:result.rotaryFaceSysOBJ.alarmNum});

            //给排水系统
            alarmNumArr.push({name:"给排水",value:result.sendDrainWaterOBJ.alarmNum});

            //消防系统
            alarmNumArr.push({name:"消防系统",value:result.fireControlSysOBJ.alarmNum});

            //售检票系统
            alarmNumArr.push({name:"自动售检票",value:result.sellCheckTicketOBJ.alarmNum});

            //能管系统
            alarmNumArr.push({name:"能源管理",value:result.energyManagerOBJ.alarmNum});

            option8.series[0].data = alarmNumArr;

            var totalAlarmNum = 0;

            $(alarmNumArr).each(function(i,o){

                totalAlarmNum += o.value;
            });

            option8.title.text = totalAlarmNum;
            option8.title.subtext = "故障数";

            _useelectricityChart.setOption(option8,true);

            //-----------------------------暖通系统---------------------------//

            //电冷能效
           var elecColdEffic = result.hvacAirsOBJ.hvacAirData.nxVa + '%';

            //elecColdEffic = "80.8%";

            //输入电量
            var inputElecData = parseFloat(result.hvacAirsOBJ.hvacAirData.qeVa);

            //输出电冷量
            var elecColdData = parseFloat(result.hvacAirsOBJ.hvacAirData.rcVa);

            //获取当前是冬季夏季 夏季为1 冬季为2 非冬夏0

            var elecColdDataArr = [];

            var elecColdCenterData = {};

            var eleUnit = '';

            //如果是夏天
            if(result.hvacAirsOBJ.hvacAirData.ty == 1){

                elecColdDataArr = [
                    {name:'输入电量',data:inputElecData},
                    {name:'输出冷量',data:elecColdData}
                ];

                elecColdCenterData = {name:'电冷能效',data:elecColdEffic};

                //$('.right-bottom-container .right-bottom-equipment .right-bottom-equipment-container ').eq(0).find('.equipment-title a').html('冷冻机房');

                eleUnit = "KW";

            }else{

                elecColdDataArr = [
                    {name:'输入蒸汽',data:inputElecData},
                    {name:'输出热量',data:elecColdData}
                ];

                elecColdCenterData = {name:'换热能效',data:elecColdEffic};

                //$('.right-bottom-container .right-bottom-equipment .right-bottom-equipment-container ').eq(0).find('.equipment-title a').html('换热站');

                eleUnit = "KW";
            }


            //给echarts赋值
            drawEcharts(elecColdDataArr,'equipment-chart-electricity',colorArr1,elecColdCenterData, _electricityoption, eleUnit);

            //运行故障数

            //总台数
            var hvacallNum = result.hvacAirsOBJ.allNum;

            //运行中
            var hvacrunNum = result.hvacAirsOBJ.runNum;

            //故障中
            var hvacfaultNum = result.hvacAirsOBJ.faultNum;

            //维修中
            var hvacrepairNum = result.hvacAirsOBJ.repairNum;

            var hvacairDataArr = [
                {name:'运行中',data:hvacrunNum},
                {name:'故障中',data:hvacfaultNum},
                {name:'维修中',data:hvacrepairNum}
            ];

            var hvacairCenterData = {name:'总台数',data:hvacallNum};

            //给echarts赋值
            drawEcharts(hvacairDataArr,'equipment-chart-electricity1',colorArr2,hvacairCenterData, _conditioneroption,'');

            //电功率
            $('#equipment-chart-electricity').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.hvacAirsOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-electricity1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.hvacAirsOBJ.alarmNum);

            $('#equipment-chart-electricity1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.hvacAirsOBJ.cDataIDNum);

            //-----------------------------照明系统---------------------------//
            //总台数
            var allNum = result.lightSysOBJ.houseLightAllNum;

            //运行中
            var runNum = result.lightSysOBJ.houseLightRunNum;

            //故障中
            var faultNum = result.lightSysOBJ.houseLightFaultNum;

            //维修中
            var repairNum = result.lightSysOBJ.houseLightRepairNum;

            var airDataArr = [
                {name:'运行中',data:runNum},
                {name:'故障中',data:faultNum},
                {name:'维修中',data:repairNum}
            ];

            var airCenterData = {name:'站房回数',data:allNum};

            //给echarts赋值
            drawEcharts(airDataArr,'equipment-chart-conditioner',colorArr2,airCenterData, _conditioneroption,'');


            //-----------------------------站台照明---------------------------//
            //总回路
            var platformAllTimesNum = result.lightSysOBJ.platformLightAllNum;

            //var platformAllTimesNum = 268;

            //运行中
            var platformrunNum = result.lightSysOBJ.platformLightRunNum;

            //var platformrunNum = 107;

            //故障中
            var platformfaultNum = result.lightSysOBJ.platformLightFaultNum;

            //维修中
            var platformrepairNum = result.lightSysOBJ.platformLightRepairNum;

            var platformArr = [
                {name:'运行中',data:platformrunNum},
                {name:'故障中',data:platformfaultNum},
                {name:'维修中',data:platformrepairNum}
            ];

            var platformData = {name:'站台回路',data:platformAllTimesNum};

            //给echarts赋值
            drawEcharts(platformArr,'equipment-chart-conditioner1',colorArr2,platformData, _conditioneroption,'');

            //电功率
            $('#equipment-chart-conditioner').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.lightSysOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-conditioner1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.lightSysOBJ.alarmNum);

            $('#equipment-chart-conditioner1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.lightSysOBJ.cDataIDNum);


            //-----------------------------电梯系统---------------------------//
            //直梯数
            var allNum1 = result.elevatorSysOBJ.verticalLadder.allNum;

            //运行中
            var runNum1 = result.elevatorSysOBJ.verticalLadder.allNum;

            //故障中
            var faultNum1 = result.elevatorSysOBJ.verticalLadder.faultNum;

            //维修中
            var repairNum1 = result.elevatorSysOBJ.verticalLadder.repairNum;

            var elevatorDataArr = [
                {name:'运行中',data:runNum1 },
                {name:'故障中',data:faultNum1 },
                {name:'维修中',data:repairNum1 }
            ];

            var elevatorCenterData = {name:'直梯数',data:allNum1};

            //给echarts赋值
            drawEcharts(elevatorDataArr,'equipment-chart-elevator',colorArr2,elevatorCenterData, _conditioneroption,'');

            //扶梯数
            var allNum2 = result.elevatorSysOBJ.escalator.allNum;

            //运行中
            var runNum2 = result.elevatorSysOBJ.escalator.allNum;

            //故障中
            var faultNum2 = result.elevatorSysOBJ.escalator.faultNum;

            //维修中
            var repairNum2 = result.elevatorSysOBJ.escalator.repairNum;

            var elevatorDataArr1 = [
                {name:'运行中',data:runNum2 },
                {name:'故障中',data:faultNum2 },
                {name:'维修中',data:repairNum2 }
            ];

            var elevatorCenterData1 = {name:'扶梯数',data:allNum2};

            //给echarts赋值
            drawEcharts(elevatorDataArr1,'equipment-chart-elevator1',colorArr2,elevatorCenterData1, _conditioneroption,'');


            //电功率
            $('#equipment-chart-elevator').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.elevatorSysOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-elevator1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.elevatorSysOBJ.alarmNum);

            $('#equipment-chart-elevator1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.elevatorSysOBJ.cDataIDNum);


            //-----------------------------动环系统---------------------------//
            //机房数
            var rotaryFaceallNum = result.rotaryFaceSysOBJ.machineRoomNum;

            //运行中
            var rotaryFacerunNum = result.rotaryFaceSysOBJ.runNum;

            //故障中
            var rotaryFacefaultNum = result.rotaryFaceSysOBJ.faultNum;

            //维修中
            var rotaryFacerepairNum = result.rotaryFaceSysOBJ.repairNum;

            var rotaryFaceArr = [
                {name:'运行中',data:rotaryFacerunNum},
                {name:'故障中',data:rotaryFacefaultNum},
                {name:'维修中',data:rotaryFacerepairNum}
            ];

            var rotaryFaceData = {name:'机房数',data:rotaryFaceallNum};

            //给echarts赋值
            drawEcharts(rotaryFaceArr,'equipment-chart-rotating',colorArr2,rotaryFaceData, _conditioneroption,'');

            //送风温度
            var indoorTemp1 = result.rotaryFaceSysOBJ.indoorTemp;

            //室内温度
            var steamData1 = result.rotaryFaceSysOBJ.indoorTemp;

            //室内湿度
            var indoorHumidity = result.rotaryFaceSysOBJ.indoorHumidity;

            var TempArr = [
                {name:'室内温度',data:steamData1},
                {name:'室内湿度',data:indoorHumidity}
            ];

            var indoorTempData = {name:'室内温度',data:indoorTemp1};

            //给echarts赋值
            drawEcharts(TempArr,'equipment-chart-rotating1',colorArr1,indoorTempData, _electricityoption,'℃');

            //电功率
            $('#equipment-chart-rotating').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data').html(result.rotaryFaceSysOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-rotating1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.rotaryFaceSysOBJ.alarmNum);

            $('#equipment-chart-rotating1').parents('.bottom-equipment-chart-container').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.rotaryFaceSysOBJ.cDataIDNum);


            //-----------------------------给排水---------------------------//
            //总回路
            var allTimesNum = result.sendDrainWaterOBJ.allSetNumber;

            //运行中
            var statHouserunNum = result.sendDrainWaterOBJ.runNum;

            //故障中
            var statHousefaultNum = result.sendDrainWaterOBJ.faultNum;

            //维修中
            var statHouseRepairNum = result.sendDrainWaterOBJ.repairNum;

            var statHouseArr = [
                {name:'运行中',data:statHouserunNum},
                {name:'故障中',data:statHousefaultNum},
                {name:'维修中',data:statHouseRepairNum}
            ];

            var statHouseData = {name:'总台数',data:allTimesNum};

            //给echarts赋值
            drawEcharts(statHouseArr,'equipment-chart-station',colorArr2,statHouseData, _conditioneroption,'');

            //电功率
            $('#equipment-chart-station').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.sendDrainWaterOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-station').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.sendDrainWaterOBJ.alarmNum);

            $('#equipment-chart-station').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.sendDrainWaterOBJ.cDataIDNum);


            //-----------------------------消防系统---------------------------//
            //总台数
            var fireControlAllTimesNum = result.fireControlSysOBJ.allSetNumber;

            //运行中
            var fireControlrunNum = result.fireControlSysOBJ.runNum;


            //故障中
            var fireControlfaultNum = result.fireControlSysOBJ.faultNum;

            //维修中
            var fireControlrepairNum = result.fireControlSysOBJ.repairNum;

            var fireControlArr = [
                {name:'运行中',data:fireControlrunNum},
                {name:'故障中',data:fireControlfaultNum},
                {name:'维修中',data:fireControlrepairNum}
            ];

            var fireControlData = {name:'总台数',data:fireControlAllTimesNum};

            //给echarts赋值
            drawEcharts(fireControlArr,'equipment-chart-platform',colorArr2,fireControlData, _conditioneroption,'');

            //电功率
            $('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.fireControlSysOBJ.elecPower.toFixed(1) + '<span>kw</span>');

            //检测点
            $('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.fireControlSysOBJ.alarmNum);

            //$('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.fireControlSysOBJ.cDataIDNum)

            $('#equipment-chart-platform').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.fireControlSysOBJ.cDataIDNum);


            //-----------------------------自动售检票---------------------------//
            //总台数
            var sendExhaustAllTimesNum = result.sellCheckTicketOBJ.allSetNumber;

            //运行中
            var sendExhaustrunNum = result.sellCheckTicketOBJ.runNum;

            //故障中
            var sendExhaustfaultNum = result.sellCheckTicketOBJ.faultNum;

            //维修中
            var sendExhaustrepairNum = result.sellCheckTicketOBJ.repairNum;


            var sendExhaustArr = [
                {name:'运行中',data:sendExhaustrunNum},
                {name:'故障中',data:sendExhaustfaultNum},
                {name:'维修中',data:sendExhaustrepairNum}
            ];

            var sendExhaustData = {name:'总台数',data:sendExhaustAllTimesNum};

            //给echarts赋值
            drawEcharts(sendExhaustArr,'equipment-chart-wind',colorArr2,sendExhaustData, _conditioneroption,'');

            //故障率
            $('#equipment-chart-wind').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.sellCheckTicketOBJ.faultPower.toFixed(1) + '<span>%</span>');

            //检测点
            $('#equipment-chart-wind').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.sellCheckTicketOBJ.alarmNum);

            $('#equipment-chart-wind').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.sellCheckTicketOBJ.cDataIDNum);


            //-----------------------------能源管理---------------------------//

            //获取存放能耗的数组
            var energyArr = result.energyManagerOBJ.energyKeyValues;

            //存放页面中显示的数据
            var dataArr = [];

            //存放图例
            var legendArr = [];

            $(energyArr).each(function(i,o){

                //排除气的能耗
                if(o.energyItemID != "311"){

                    var obj = {};

                    //获取当前的能耗名称
                    obj.name = _getEcName(o.energyItemID);

                    legendArr.push(_getEcName(o.energyItemID));

                    //获取当前的能耗数值
                    obj.value = o.energyData.toFixed(2);

                    dataArr.push(obj);
                }
            });


            //总能耗
            _energyOption.title.text = result.energyManagerOBJ.allEnergyData.toFixed(0);

            _energyOption.series[0].data = dataArr;

            _energyOption.legend.data = legendArr;

            //能管重绘数据
            _waterEcharts.setOption(_energyOption,true);

            //总费用
            $('#equipment-chart-water').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data').eq(0).html(result.energyManagerOBJ.allEnergyCostData.toFixed(1) + '<span>元</span>');

            //检测点
            $('#equipment-chart-water').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .cur-data').html(result.energyManagerOBJ.alarmNum);

            $('#equipment-chart-water').parents('.right-bottom-equipment-content').find('.bottom-equipment-chart-data .chart-data .total-data').html('/'+result.energyManagerOBJ.cDataIDNum);



            //-----------------设备报警数据------------------//

            //判断是否启用
            if(userEquipObj != {}){

                //页面赋值
                $('.right-bottom-energyment0 .left-tab-data1 font').html(totalAlarmNum);

                //货值下方折线图
                drawLineChart(totalAlarmNum,0);
                drawLineChart(totalAlarmNum,1);
                drawLineChart(totalAlarmNum,2);

                //数据赋值
                leftBottomOption.series[0].data = userEquipAlarmArr[0].value;
                leftBottomOption.xAxis[0].data = userEquipAlarmArr[0].xData;

                //页面重绘数据
                leftBottomChart.setOption(leftBottomOption,true);

            }else{

                //获取页面左侧下方统计数据
                getStationAlarmNum();

                //设备报警
                getStationAlarmData(1);

            }

        },
        error:function(jqXHR, textStatus, errorThrown){

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};

//获取下方能源管理数据
function getPointerData(){
    //定义存放返回数据的数组（本期 X Y）
    var allData = [];
    var allDataX = [];
    var allDataY = [];
    var totalAllData = 0;

    //存放要传的楼宇集合
    var postPointerID = [];

    //存放要传的分户ID
    var officeID = '';

    //存放要传的支路ID
    var serviceID = '';

    //是否标煤
    var isBiaoMeiEnergy = 0;

    //单位类型 0为kwh t
    var unitType = '0';

    //确定楼宇id

    postPointerID.push(curPointerIDArr);

    //能耗类型
    _ajaxEcType = $('.right-bottom-energyment-control .left-tab-choose').attr('unit-type');

    //获取展示日期类型
    var showDateType = getShowDateType1()[0];

    //获取用户选择日期类型
    var selectDateType = getShowDateType1()[1];

    //获取开始时间
    var startTime = getPostTime11()[0];

    //获取开始时间
    var endTime = getPostTime11()[1];

    //定义获得数据的参数
    var ecParams = {
        "energyItemID": _ajaxEcType,
        "isBiaoMeiEnergy": isBiaoMeiEnergy,
        "pointerIDs": postPointerID,
        "officeID": officeID,
        "serviceID": serviceID,
        "unityType": unitType,
        "showDateType": showDateType,
        "selectDateType": selectDateType,
        "startTime": startTime,
        "endTime": endTime
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyQueryV2/GetPointerEnergyQuery',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){
            if(ifShowLoading1){

                leftBottomChart1.showLoading({
                    maskColor: 'rgba(33,43,55,0.8)'
                });

                ifShowLoading1 = false;
            }

        },
        success:function(result){
            leftBottomChart1.hideLoading();
            //console.log(result);

            //判断是否返回数据
            if(result == null){

                option00.xAxis[0].data = [];
                option00.series[0].data = [];

                leftBottomChart1.setOption(option00);

                return false;
            }


            //首先处理本期的数据
            allData.length = 0;

            $(result.ecMetaDatas).each(function(i,o){
                allData.push(o);
            });

            //首先处理实时数据
            allDataX.length = 0;
            allDataY.length = 0;

            //绘制echarts
            if(showDateType == 'Hour' ){
                //确定x轴
                for(var i=0;i<allData.length;i++){
                    var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                    var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                    if(allDataX.indexOf(dataJoin)<0){
                        allDataX.push(dataJoin);
                    }
                }
            }else{
                //确定x轴
                for(var i=0;i<allData.length;i++){
                    var dataSplit = allData[i].dataDate.split('T')[0];

                    if(allDataX.indexOf(dataJoin)<0){
                        allDataX.push(dataSplit);
                    }
                }
            };

            //确定本期y轴
            for(var i=0;i<allData.length;i++){
                allDataY.push(allData[i].data.toFixed(1));
            }

            //echart柱状图
            option00.xAxis[0].data = allDataX;
            option00.series[0].data = allDataY;

            leftBottomChart1.setOption(option00);


        },
        error:function(jqXHR, textStatus, errorThrown){
            leftBottomChart1.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }
            _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
        }
    })
};

//获取后台table表格中的数据
function getTableData(condition,dom){

    //传递给后台的参数
    var  ecParams = condition;

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'YWFZ/GetFroms',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){


        },
        success:function(result){

            var dataArr = packagingTableData(result[1]);

            //console.log(dataArr);

            //获取到table中数据
            var tableData = result[1].data;

            //拼接table中要展示的字符串
            var tableHtml = "";

            //遍历table中数据进行拼接
            $(tableData).each(function(i,o){

                tableHtml += "<tr>";

                 var lineArr = o;

                $(lineArr).each(function(i,o){

                    tableHtml += "<td>"+ o +"</td>";
                });

                tableHtml += "</tr>";
            });

            $(dom).find('tbody').html(tableHtml);
        },
        error:function(jqXHR, textStatus, errorThrown){
            leftBottomChart1.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }
            _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
        }
    })
};

//获取电耗分项数据
function getFirstEnergyItemData(){

    //获取开始时间
    var startTime = getPostTime11()[0];

    //获取结束时间
    var endTime = getPostTime11()[1];


    //传递给后台的数据
    var ecParams = {
        "startTime": startTime,
        "endTime": endTime,
        "energyItemType": '01',
        "pointerIDs":  curPointerIDArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetFirstEnergyItemData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            if(ifShowLoading2){

                _useelectricityChart.showLoading({
                    maskColor: 'rgba(33,43,55,0.8)'
                });

                ifShowLoading2 = false;
            }

        },
        success:function(result){

            //console.log(result);

            _useelectricityChart.hideLoading();

            //无数据
            if(result == null || result.length == 0){

                return false;
            }

            //存放能耗数据
            var dataArr = [];

            //存放图例中数据
            var legendArr = [];

            var allData = 0;

            $(result).each(function(i,o){

                //if(i > 2){
                //    return false;
                //}
                var obj = {};
                //获取能耗数据
                obj.value = o.energyItemValue.toFixed(1);

                allData += parseFloat(o.energyItemValue.toFixed(1));
                //获取能耗名称
                obj.name = o.energyItemName;

                dataArr.push(obj);

                //给图例中存储数据
                legendArr.push(o.energyItemName);
            });

            //数据赋值
            option8.series[0].data = dataArr;

            //图例赋值
            option8.legend.data = legendArr;

            option8.title.text = allData.toFixed(1);

            option8.title.subtext = '总电量';
            //页面重绘数据
            _useelectricityChart.setOption(option8,true);

        },
        error:function(jqXHR, textStatus, errorThrown){
            _useelectricityChart.hideLoading();

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    });
};

//重新绘制echarts方法
function drawEcharts(dataArr,echartsID,colorArr,centerData,option,unit){

    //定义总数
    var allData = 0;

    //如果是温度和湿度
    if(echartsID == 'equipment-chart-rotating1'){

        allData = 70;

     //如果是冷热源 电数据
    }else if(echartsID == 'equipment-chart-electricity'){

        //如果是夏季
        if(getSeason() == 1){

            allData = 5752;

        }else{

            allData =13630 * 2;
        }

    }else{

        if(colorArr == colorArr1){

            allData = dataArr[0].data * 1.5;

        }else{
            allData = centerData.data;
        }
    }


    //定义图例集合
    var legendArr = [];

    $(dataArr).each(function(i,o){

        var value1;

        var value2;

        if(unit != ''){

            if(dataArr[i].data){
                value1 = dataArr[i].data.toFixed(2);
                value2 = (allData - dataArr[i].data).toFixed(2);
            }

        }else{
            value1 = dataArr[i].data;
            value2 = allData - dataArr[i].data;
        }

        var data = [
            {
                value:value1,
                name:dataArr[i].name,
                itemStyle: {
                    normal : {
                        color: colorArr[i]
                    }
                }

            },
            {
                value: value2,
                name:'',
                itemStyle : placeHolderStyle
            }
        ];

        //图例赋值
        legendArr.push(dataArr[i].name);

        //数据赋值
        option.series[i].data = data;

        //echart图开始处的展示数据
        if(allData != 0){

            var thisData = 0;

            if(colorArr == colorArr1){

                thisData = dataArr[i].data.toFixed(1);

            }else{

                thisData = dataArr[i].data;
            }

            if(echartsID == 'equipment-chart-rotating1' && i == 1){

                    $('#'+ echartsID).prev('.bottom-content-data').find('span').eq(i).html(thisData+'%');

            }else{
                $('#'+ echartsID).prev('.bottom-content-data').find('span').eq(i).html(thisData+unit);
            }


        }else{

            $('#'+ echartsID).prev('.bottom-content-data').find('span').eq(i).html('0');

        }


    });
    //改变中间显示的文字
    if(unit != ''){

        if(typeof centerData.data == 'number'){

            option.title.text = (centerData.data).toFixed(1);

        }else{
            option.title.text = centerData.data;
        }


    }else{
        option.title.text = centerData.data;
    }


    option.title.subtext = centerData.name;

    option.legend.data = legendArr;

    //运维中有关运行 故障的数据
    if(colorArr != colorArr1){

        //当前总台数
        var totalNum = centerData.data;

        //运行台数
        var runNum = dataArr[0].data;

        option.title.text = (runNum/totalNum * 100).toFixed(1) + "%";

        if(totalNum == 0){
            option.title.text =  "0.0%";
        }

        option.title.subtext = centerData.name +" "+ totalNum;
    }

    //重绘echarts
    var thisCharts = echarts.init(document.getElementById(echartsID));

    thisCharts.setOption(option,true);

};

//从后台获取用户配置的数据
function getDeployByUser(){

    //curPointerIDArr= ['5190180101'];

    $.ajax({

        type:'get',

        url:_urls + 'NJNDeviceShow/GetNJNConfigToFile',

        data:{

            pointerID:curPointerIDArr[0]
        },
        timeout:_theTimes,
        beforeSend:function(){

            leftBottomChart.showLoading({
                maskColor: 'rgba(33,43,55,0.8)'
            });

        },
        success:function(result){

            var result1 = JSON.parse(result);

            //console.log(result1);

            //首先判断整体控制开关是否开启
            var mainSwitch = result1.switch;

            //获取本地配置
            var bigScreenSet = sessionStorage.getItem('bigScreenSet');

            //整体控制开关关闭
            if(mainSwitch == 0 || bigScreenSet == 0){

                //获取页面主题部分数据
                getTPDevMonitor();

                //设备报警
                getStationAlarmData(1);

                //获取页面左侧下方统计数据
                getStationAlarmNum();

                //获取工单数据
                getGDRespondInfo();

                getGDRespondInfo1();

            }else{

                //-----------------设备监控数据------------------//

                //获取设备监控数据对象
                var equipmentObj = result1.TPDevMonitorReturnNew;

                for(var item in equipmentObj){

                    //获取对象当前是否启用的标识
                    var singleSwitch = equipmentObj[item].switch;

                    //如果启用的话
                    if(singleSwitch == 1){

                        userEquipObj[item] = equipmentObj[item]
                    }
                }

                //获取页面主题部分数据
                getTPDevMonitor();

                //-----------------安全运行天数数据------------------//

                //判断是否启用
                if(result1.safeRunningDays.switch == 1){

                    //页面赋值
                    $('.safe-days').html(result1.safeRunningDays.dayNum);

                }

                //-----------------节能减排数据------------------//
                //判断是否启用
                if(result1.energyConservation.switch == 1){

                    //页面赋值

                    //电
                    $('.right-bottom-centent-data0 .bottom-data font').html(result1.energyConservation.electricSave);

                    //水
                    $('.right-bottom-centent-data1 .bottom-data font').html(result1.energyConservation.waterSave);

                    //汽
                    $('.right-bottom-centent-data2 .bottom-data font').html(result1.energyConservation.steamSave);

                    //减排
                    $('.right-bottom-centent-data3 .bottom-data font').html(result1.energyConservation.emissionReduction);

                }

                //-----------------工单响应数据------------------//

                //判断是否启用
                if(result1.perationMaintenance.switch == 1){

                    //进行中
                    var runningNum = result1.perationMaintenance.responseGD.running;

                    //派单中
                    var dispatchNum = result1.perationMaintenance.responseGD.dispatch;

                    //已完成
                    var completeNum = result1.perationMaintenance.responseGD.complete;

                    //总数
                    var totalNum = runningNum + dispatchNum + completeNum;

                    var dataArr = [
                        {
                            name:'已完成',
                            value:completeNum
                        },
                        {
                            name:'派单中',
                            value:dispatchNum
                        },
                        {
                            name:'进行中',
                            value:runningNum
                        }
                    ];

                    //给echart重新赋值
                    _useelectricityoption.title.text = totalNum;

                    _useelectricityoption.series[0].data = dataArr;

                    //重绘chart图
                    _operationresponseChart.setOption(_useelectricityoption);

                }else{

                    //从后台获取数据
                    getGDRespondInfo();

                    //从后台获取数据
                    getGDRespondInfo1();
                }

                //-----------------工单分布数据------------------//

                //判断是否启用
                if(result1.perationMaintenance.switch == 1){

                    //暖通系统
                    var hvacAirsOBJNum = result1.perationMaintenance.distributionGD.hvacAirsOBJ;

                    //照明系统
                    var lightSysOBJNum = result1.perationMaintenance.distributionGD.lightSysOBJ;

                    //电梯系统
                    var elevatorSysOBJ = result1.perationMaintenance.distributionGD.elevatorSysOBJ;

                    //动环系统
                    var rotaryFaceSysOBJNum = result1.perationMaintenance.distributionGD.rotaryFaceSysOBJ;

                    //给排水
                    var sendDrainWaterOBJNum = result1.perationMaintenance.distributionGD.sendDrainWaterOBJ;

                    //消防系统
                    var fireControlSysOBJ = result1.perationMaintenance.distributionGD.fireControlSysOBJ;

                    //自动售检票
                    var sellCheckTicketOBJNum = result1.perationMaintenance.distributionGD.sellCheckTicketOBJ;

                    //能源管理
                    var energyManagerOBJOBJ = result1.perationMaintenance.distributionGD.energyManagerOBJ;

                    //总数
                    var totalNum = hvacAirsOBJNum + lightSysOBJNum + elevatorSysOBJ + rotaryFaceSysOBJNum + sendDrainWaterOBJNum + fireControlSysOBJ + sellCheckTicketOBJNum +energyManagerOBJOBJ;

                    var dataArr = [
                        {
                            name:'暖通系统',
                            value:hvacAirsOBJNum
                        },
                        {
                            name:'照明系统',
                            value:lightSysOBJNum
                        },
                        {
                            name:'电梯系统',
                            value:elevatorSysOBJ
                        },
                        {
                            name:'动环系统',
                            value:rotaryFaceSysOBJNum
                        },
                        {
                            name:'给排水',
                            value:sendDrainWaterOBJNum
                        },
                        {
                            name:'消防系统',
                            value:fireControlSysOBJ
                        },
                        {
                            name:'自动售检票',
                            value:sellCheckTicketOBJNum
                        },
                        {
                            name:'能源管理',
                            value:energyManagerOBJOBJ
                        }
                    ];

                    //给echart重新赋值
                    option8.title.text = totalNum;

                    option8.series[0].data = dataArr;

                    //重绘chart图
                    _operationresponseChart1.setOption(option8);
                }

            };
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            $('#theLoading').modal('hide');

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//根据传入数据绘制echart图 用于设备报警
function drawLineChart(totalNum,flag){

    var hourNum;

    //日数据
    if(flag == 0){

        //获取当前小时数
        hourNum = parseInt(moment().format('HH')) - 1;

    //月数据
    }else if(flag == 1){

        //获取当前天数
        hourNum = parseInt(moment().format('DD')) - 1;

        //年数据
    }else if(flag == 2){

        //获取当前月份数
        hourNum = parseInt(moment().format('MM')) - 1;

        totalNum = totalNum * 30;
    }

    //确定数据浮动范围
    var bigFloatNum = parseInt(totalNum / 4);

    //存放生成的虚拟数据
    var hourDataArr = [];

    //生成虚拟数据
    for(var i=0; i<hourNum; i++){

        //随机生成浮动数
        var floatNum = parseInt(Math.random() * bigFloatNum);

        //随机判断本次取加还是减的操作
        var randomNum = Math.random() * 2;

        var thisNum = totalNum;

        if(randomNum > 1){

            thisNum = totalNum + floatNum;

        }else{

            thisNum = totalNum - floatNum;
        }

        hourDataArr.push(thisNum)
    }

    hourDataArr.push(totalNum);

    //页面赋值
    leftBottomChart.hideLoading();

    //存放数据
    var dataArr = [];

    //存放x轴
    var xArr = [];

    for(var i=0; i<hourDataArr.length; i++){

        //x轴数据
        var xData;

        var date;

        if(flag == 0){

            if(i < 10){
                date = "0" + i;
            }else{
                date = i
            }
            //x轴数据
            xData = date + ":00";

        }else if(flag == 1){

            date = i + 1;

            if(date < 10){
                date = "0" + date;

            }

            //x轴数据
            xData = moment().format("YYYY-MM") + "-"+date;

        }else if(flag == 2){

            date = i + 1;

            if(date < 10){
                date = "0" + date;
            }

            //x轴数据
            xData = moment().format("YYYY") + "-"+ date;
        }

        xArr.push(xData);

        //页面显示数据
        dataArr.push(hourDataArr[i]);

    }

    var obj = {
        xData : xArr,
        value : dataArr
    };

    userEquipAlarmArr.push(obj);
};

//大屏幕报警
function getDevMonitAlarmPopup(devTypeArr,condition){

    //传递给后台的参数
    var  ecParams = {
        "pointerID":curPointerIDArr[0],
        "devTypeIDs": devTypeArr,
        "alarmType": -1,
        "devName": "",
        "alarmName": "",
        "startTime": startDate,
        "endTime": endDate
    };

    if(condition){

        ecParams = condition;

    }

    $.ajax({

        type:'post',

        url:_urls + 'NJNDeviceShow/GetDevMonitAlarmPopup',

        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){
            //页面赋值
            $('#dateTables tbody').html("");

            setTimeout(function(){
                $('#alarm-message .bottom-table-data-container #dateTables').showLoading();
            },500)

        },
        success:function(result){

            setTimeout(function(){
                $('#alarm-message .bottom-table-data-container #dateTables').hideLoading();
            },500);

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

            //页面赋值
            $('#dateTables tbody').html(tableHtml);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            setTimeout(function(){
                $('#alarm-message .bottom-table-data-container #dateTables').hideLoading();
            },500);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//大屏幕电功率
function getDevMonitPowerData(devTypeArr,condition){

    //传递给后台的参数
    var  ecParams = {
        "pointerID":curPointerIDArr[0],
        "devTypeIDs": devTypeArr,
        "serviceName": ""
    };

    if(condition){

        ecParams = condition;

    }

    $.ajax({

        type:'post',
        url:_urls + 'NJNDeviceShow/GetDevMonitPowerData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            setTimeout(function(){
                $('#electric-message .bottom-table-data-container ').showLoading();
            },500);
        },
        success:function(result){

            setTimeout(function(){

                $('#electric-message .bottom-table-data-container ').hideLoading();

            },500);

            //给页面赋值
            var tableHtml = "";

            $(result).each(function(i,o){

                tableHtml += "<tr>";

                //支路名称
                tableHtml += "<td>"+ o.serverName+"</td>";

                //电功率
                tableHtml += "<td>"+ o.powerValue.toFixed(1) +"</td>";

                tableHtml += "</tr>"
            });

            //页面赋值
            $('#dateTables-electric tbody').html(tableHtml);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            setTimeout(function(){

                $('#electric-message .bottom-table-data-container ').hideLoading();

            },500);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//大屏幕右下角设备故障
function getDevFaultAlarmPropData(condition){

    //传递给后台的参数
    var  ecParams = {
        "pointerID":curPointerIDArr[0],
        "startTime": startDate,
        "endTime": endDate
    };

    if(condition){

        ecParams = condition;

    }

    $.ajax({

        type:'post',
        url:_urls + 'NJNDeviceShow/GetDevFaultAlarmPropData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            $('#dateTables-trouble tbody').html('');

            setTimeout(function(){
                $('#trouble-message .bottom-table-data-container ').showLoading();
            },500);
        },
        success:function(result){

            setTimeout(function(){

                $('#trouble-message .bottom-table-data-container ').hideLoading();

            },500);

            //给页面赋值
            var tableHtml = "";

            $(result).each(function(i,o){

                tableHtml += "<tr>";

                //设备名称
                tableHtml += "<td>"+ o.devName+"</td>";

                //故障数据
                tableHtml += "<td>"+ o.faultNum +"</td>";

                //故障百分比
                tableHtml += "<td>"+ (o.faultPerce*100).toFixed(1) +"%</td>";

                tableHtml += "</tr>"
            });

            //页面赋值
            $('#dateTables-trouble tbody').html(tableHtml);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            setTimeout(function(){

                $('#trouble-message .bottom-table-data-container ').hideLoading();

            },500);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//大屏幕能耗总费用
function getEnergyCostData(condition){

    //传递给后台的参数
    var  ecParams = {
        "pointerID":curPointerIDArr[0],
        "startTime": startDate,
        "endTime": endDate
    };

    if(condition){

        ecParams = condition;

    }
    $.ajax({

        type:'post',
        url:_urls + 'NJNDeviceShow/GetEnergyCostData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            $('#dateTables-cost tbody').html('');

            setTimeout(function(){
                $('#cost-message .bottom-table-data-container ').showLoading();
            },500);
        },
        success:function(result){

            console.log(result);

            setTimeout(function(){

                $('#cost-message .bottom-table-data-container ').hideLoading();

            },500);

            //给页面赋值
            var tableHtml = "";

            $(result).each(function(i,o){

                tableHtml += "<tr>";

                //时间段
                tableHtml += "<td>"+ o.energyDTStr+"</td>";

                //遍历返回的数据数组，进行页面赋值
                $(o.energyDatas).each(function(k,j){

                    tableHtml += "<td>"+ j.toFixed(2) +"</td>";
                });

            });

            //页面赋值
            $('#dateTables-cost tbody').html(tableHtml);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            setTimeout(function(){

                $('#cost-message .bottom-table-data-container ').hideLoading();

            },500);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//大屏幕下方所有设备报警
function getDevAlarmNumPopupData(condition){

    //传递给后台的参数
    var  ecParams = {
        "pointerID":curPointerIDArr[0],
        "alarmType": -1,
        "devName": "",
        "alarmName": "",
        "startTime": startDate,
        "endTime": endDate
    };

    if(condition){

        ecParams = condition;

    }

    $.ajax({

        type:'post',

        url:_urls + 'NJNDeviceShow/GetDevAlarmNumPopupData',

        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            //页面赋值
            $('#dateTables-alarm tbody').html("");

            setTimeout(function(){
                $('#alarm-message1 .bottom-table-data-container #dateTables-alarm').showLoading();
            },500);

        },
        success:function(result){

            setTimeout(function(){
                $('#alarm-message1 .bottom-table-data-container #dateTables-alarm').hideLoading();
            },500);

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

            //页面赋值
            $('#dateTables-alarm tbody').html(tableHtml);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            setTimeout(function(){
                $('#alarm-message1 .bottom-table-data-container #dateTables-alarm').hideLoading();
            },500)

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//大屏幕运行参数信息
function getDevRunParaPopupData(devTypeArr,condition){

    //传递给后台的参数
    var  ecParams = {
        "pointerID":curPointerIDArr[0],
        "devTypeIDs": devTypeArr,
        "devName": "",
        "devStateID": 0,
        "startTime": startDate,
        "endTime": endDate
    };

    if(condition){

        ecParams = condition;

    }

    $.ajax({

        type:'post',

        url:_urls + 'NJNDeviceShow/GetDevRunParaPopupData',

        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            //页面赋值
            $('#dateTables1 tbody').html("");

            setTimeout(function(){

                $('#run-number-message .bottom-table-data-container #dateTables1').showLoading();

            },500);

        },
        success:function(result){

            setTimeout(function(){

                $('#run-number-message .bottom-table-data-container #dateTables1').hideLoading();

            },500);

            //console.log(result);
            //给设备类型搜索框赋值

            if(devTypeArr && devTypeArr != ''){

                var selectHtml = "<option value=''>全部</option>";

                $(devTypeArr).each(function(i,o){

                    //获取当前设备名称
                    var devTypeName = getEquipNameByID(o);

                    selectHtml += "<option value='"+o+"'>"+devTypeName+"</option>";
                });

                $('#run-number-message .equip-types').html(selectHtml);

            }
            //给页面赋值
            var tableHtml = "";

            $(result).each(function(i,o){

                tableHtml += "<tr>";

                //设备名称
                tableHtml += "<td>"+ o.devName+"</td>";

                //类型
                tableHtml += "<td>"+ o.devTypeName+"</td>";

                //位置
                tableHtml += "<td>"+ o.devAreaName+"</td>";

                //服务区域
                tableHtml += "<td>"+ o.serviceArea+"</td>";

                //运行状态
                tableHtml += "<td>"+ o.devStateName+"</td>";

                //累计运行时间
                tableHtml += "<td>"+ o.devRunHour+"</td>";

                tableHtml += "</tr>"
            });

            //页面赋值
            $('#dateTables1 tbody').html(tableHtml);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            setTimeout(function(){
                $('#run-number-message .bottom-table-data-container #dateTables1').hideLoading();
            },500);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//大屏幕主副设备信息
function getDevgradeTypeInfo(devTypeArr,condition){

    //传递给后台的参数
    var  ecParams = {

        "pointerID":curPointerIDArr[0],
        "devTypeIDs": devTypeArr,
        "devName": ""

    };

    if(condition){
        ecParams = condition;
    }

    $.ajax({
        type:'post',
        url:_urls + 'NJNDeviceShow/GetDevgradeTypeInfo',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            if(!condition){

                $('#dev-grade-message .equip-types').html("");

            }

            //页面赋值
            $('#dev-grade-dateTables tbody').html("");

            setTimeout(function(){

                $('#dev-grade-message .bottom-table-data-container #dev-grade-dateTables').showLoading();

            },500);

        },
        success:function(result){

            setTimeout(function(){

                $('#dev-grade-message .bottom-table-data-container #dev-grade-dateTables').hideLoading();

            },500);

            //console.log(result);
            //给设备类型搜索框赋值

            devGradeArr = result;

            if(devTypeArr && devTypeArr != ''){

                var selectHtml = "<option value=''>全部</option>";

                $(devTypeArr).each(function(i,o){

                    //获取当前设备名称
                    var devTypeName = getEquipNameByID(o);

                    selectHtml += "<option value='"+o+"'>"+devTypeName+"</option>";
                });

                $('#dev-grade-message .equip-types').html(selectHtml);

            }
            //给页面赋值

            _datasTable($('#dev-grade-dateTables'),devGradeArr);

            //var tableHtml = "";
            //
            //$(result).each(function(i,o){
            //
            //    tableHtml += "<tr>";
            //
            //    //设备名称
            //    tableHtml += "<td>"+ o.devName+"</td>";
            //
            //    //类型
            //    tableHtml += "<td>"+ o.typeName+"</td>";
            //
            //    //位置
            //    tableHtml += "<td>"+ o.areaName+"</td>";
            //
            //    //服务区域
            //    tableHtml += "<td>"+ o.serviceArea+"</td>";
            //
            //    //查看子设备
            //    tableHtml += "<td><button class='btn-success details-control' style='background: #2a6796 !important;' data-id='"+ o.id+"'>查看子设备</button></td>";
            //
            //    tableHtml += "</tr>"
            //});
            //
            ////页面赋值
            //$('#dev-grade-dateTables tbody').html(tableHtml);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            setTimeout(function(){

                $('#dev-grade-message .bottom-table-data-container #dev-grade-dateTables').hideLoading();

            },500);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//获取运维工单中的工单响应数据
function getGDRespondInfo(){

    //传递给后台的参数
    var  ecParams = {
        "gdSt": startDate,
        "gdEt": endDate,
        "gdSrc": 0, //dSrc=10为江苏运联工单
        "userID": _userIdNum,
        "userName": _userIdName,
        "b_UserRole": _userRole,
        "b_DepartNum": _userBM
    };

    $.ajax({

        type:'post',

        url:_urls + 'YWGD/ywGDGetGDRespondInfo',

        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            _operationresponseChart.showLoading({
                maskColor: 'rgba(33,43,55,0.8)'
            });
        },
        success:function(result){

            _operationresponseChart.hideLoading();

            if(!result.gdStat){

                //给echart重新赋值
                _useelectricityoption.title.text = 0;

                _useelectricityoption.series[0].data = [];

                //重绘chart图
                _operationresponseChart.setOption(_useelectricityoption);

                return false;

            }

            //工单响应数据
            //进行中
            var runningNum = result.gdStat.gdInProgress;

            //派单中
            var dispatchNum = result.gdStat.gdAssign;

            //已完成
            var completeNum = result.gdStat.gdFinished;

            //总数
            var totalNum = runningNum + dispatchNum + completeNum;

            var dataArr = [
                {
                    name:'已完成',
                    value:completeNum
                },
                {
                    name:'派单中',
                    value:dispatchNum
                },
                {
                    name:'进行中',
                    value:runningNum
                }
            ];

            //给echart重新赋值
            _useelectricityoption.title.text = totalNum;

            _useelectricityoption.series[0].data = dataArr;

            //重绘chart图
            _operationresponseChart.setOption(_useelectricityoption);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            _operationresponseChart.hideLoading();

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//获取运维工单中的工单分布
function getGDRespondInfo1(){

    //传递给后台的参数
    var  ecParams = {
        "gdSt": startDate,
        "gdEt": endDate,
        "gdSrc": 0, //dSrc=10为江苏运联工单
        "userID": _userIdNum,
        "userName": _userIdName,
        "b_UserRole": _userRole,
        "b_DepartNum": _userBM
    };

    $.ajax({

        type:'post',

        url:_urls + 'YWGD/ywGDGetGDRespondInfo',

        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            _operationresponseChart1.showLoading({
                maskColor: 'rgba(33,43,55,0.8)'
            });

        },
        success:function(result){

            _operationresponseChart1.hideLoading();

            //console.log(result);

            if(!result.gdDevInfos || result.gdDevInfos.length == 0){

                //给echart重新赋值
                option8.title.text = 0;

                option8.series[0].data = [];

                //重绘chart图
                _operationresponseChart1.setOption(option8);

                return false;
            }

            var dataArr = [];

            var totalNum = 0;

            $(result.gdDevInfos).each(function(i,o){

                var obj = {

                    name: o.dsName,
                    value: o.gdCnt

                };

                totalNum += o.gdCnt;

                dataArr.push(obj);

            });

            //给echart重新赋值
            option8.title.text = totalNum;

            option8.series[0].data = dataArr;

            //重绘chart图
            _operationresponseChart1.setOption(option8);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {


            _operationresponseChart1.hideLoading();

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//获取消防系统的报警点弹窗信息
function GetFireDetailsForNjDatas(condition,flag){

    //传递给后台的参数
    var  ecParams = {
        "pointerID":curPointerIDArr[0]
    };

    if(condition){

        ecParams = condition;
    }

    var tableName = '#fire-dateTables';

    var containerName = '#alarm-fire-message';

    if(flag){

        tableName = '#run-dateTables';

        containerName = '#run-fire-message';
    }

    $.ajax({

        type:'post',

        url:_urls + 'NJNDeviceShow/GetFireDetailsForNjDatas',

        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            //页面赋值
            $('' + tableName+ 'tbody').html("");

            setTimeout(function(){
                $('' + containerName + ' .bottom-table-data-container ' + tableName+ '').showLoading();
            },500);

        },
        success:function(result){

            setTimeout(function(){

                $('' + containerName + ' .bottom-table-data-container ' + tableName+ '').hideLoading();
            },500);

            //给页面赋值
            var tableHtml = "";

            $(result).each(function(i,o){

                tableHtml += "<tr>";

                //消防设施编码
                tableHtml += "<td>"+ o.fcfId+"</td>";

                //报警内容
                tableHtml += "<td>"+ o.desc+"</td>";

                //报警总分类
                tableHtml += "<td>"+ getAlarmFireType(o.fireTTypes)+"</td>";

                //报警时间
                tableHtml += "<td>"+ o.createTime+"</td>";

                tableHtml += "</tr>";

            });

            //页面赋值
            $('' + tableName+ ' tbody').html(tableHtml);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            setTimeout(function(){
                $('' + containerName + ' .bottom-table-data-container' +tableName+ '').hideLoading();
            },500);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

//获取能源管理系统的报警点弹窗信息
function  getEnergyAlarmPopupData(condition){


    //传递给后台的参数
    var  ecParams = {
        "pointerID":curPointerIDArr[0],
        "startTime": startDate,
        "alarmName": "",
        "endTime": endDate
    };

    if(condition){

        ecParams = condition;

    }

    $.ajax({

        type:'post',

        url:_urls + 'NJNDeviceShow/GetEnergyAlarmPopupData',

        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

            //页面赋值
            $('#energy-dateTables tbody').html("");

            setTimeout(function(){
                $('#alarm-energy-message .bottom-table-data-container #energy-dateTables').showLoading();
            },500)

        },
        success:function(result){

            setTimeout(function(){
                $('#alarm-energy-message .bottom-table-data-container #energy-dateTables').hideLoading();
            },500);

            //给页面赋值
            var tableHtml = "";

            $(result).each(function(i,o){

                tableHtml += "<tr>";

                //报警名称
                tableHtml += "<td>"+ o.alarmSetName+"</td>";

                //类型
                tableHtml += "<td>"+ o.cDtnName+"</td>";

                //级别
                tableHtml += "<td>"+ o.priority+"</td>";

                //当前数据
                tableHtml += "<td>"+ o.data+"</td>";

                //报警表达式
                tableHtml += "<td>"+ o.expression+"</td>";

                //报警时间
                tableHtml += "<td>"+ o.dataDate+"</td>";

                tableHtml += "</tr>"
            });

            //页面赋值
            $('#energy-dateTables tbody').html(tableHtml);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            setTimeout(function(){
                $('#alarm-energy-message .bottom-table-data-container #energy-dateTables').hideLoading();
            },500);

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

//获取消防系统中报警分类
function getAlarmFireType(num){

    if(num == 10){
        return '报警'
    }else if(num == 20){
        return '故障'
    }else if(num == 30){
        return '屏蔽'
    }
};

//显示隐藏
function format ( d ) {

    var theader = '<table class="table">' +
        '<thead><tr><td>设备名称</td><td>设备类型</td><td>设备位置</td><td>服务区域</td></tr></thead>';
    var theaders = '</table>';
    var tbodyer = '<tbody>';
    var tbodyers = '</tbody>';
    var str = "";
    for(var i=0;i< d.length;i++){

        str +='<tr>' +
            '<td>' + d[i].devName +
            '</td><td>' + d[i].typeName +
            '</td><td>' + d[i].areaName +
            '</td><td>' + d[i].serviceArea +
            '</td></tr>';
    }
    return theader + tbodyer + str + tbodyers + theaders;
};




