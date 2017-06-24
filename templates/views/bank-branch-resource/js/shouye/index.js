/**
 * Created by admin on 2017/6/19.
 */
/**
 * Created by admin on 2017/6/12.
 */
$(document).ready(function(){

    var table = $('#dateTables').DataTable({
        "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "bPaginate": false,
        "ordering": false,
        'searching':false,
        "sScrollY": '200px',
        "scrollCollapse": true,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            "sProcessing" : "加载中...",
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
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
                title:'能耗类型',
                data:"energyItemName",
                render:function(data, type, row, meta) {
                    if(data.length > 6){
                        return '<span title="'+data+'" class="long">'+data.substring(0,5)+'</span>'
                    }else{
                        return '<span title="'+data+'" class="short">'+data.substring(0,5)+'</span>'
                    }

                }

            },
            {
                title:'用量',
                data:"energyItemValue",
                render:function(data, type, row, meta) {

                    return data.toFixed(2);


                }
            },
            {
                title:'折合标煤',
                data:"energyItemCoalValue",
                render:function(data, type, row, meta) {

                    return data.toFixed(2);
                }
            },
            {
                title:'占比(%)',
                data:"energyItemPercent",
                render:function(data, type, row, meta) {

                    return (data*100).toFixed(2);
                }
            }

        ]
    });
    _table = $('#dateTables').dataTable();

    var table1 = $('#dateTables1').DataTable({
        "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "bPaginate": false,
        "ordering": false,
        'searching':false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
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
                title:'支行名称',
                data:"enterpriseName",
                render:function(data, type, row, meta) {
                    if(data.length > 6){
                        return '<span title="'+data+'" class="long">'+data.substring(0,5)+'</span>'
                    }else{
                        return '<span title="'+data+'" class="short">'+data.substring(0,5)+'</span>'
                    }

                }
            },
            {
                title:'对比',
                data:null,
                render:function(data, type, row, meta) {
                    var txt = $('#energy-analyze .energy-rank .onClicks').html();
                    if(txt == '本月'){
                        return '较上月'
                    }else{
                        return '较上年'
                    }

                }
            },
            {
                title:'变化',
                data:null,
                render:function(data, type, row, meta) {

                    var txt = $('#energy-analyze .energy-rank .onClicks').html();

                    if(txt == '本月'){

                        return Math.abs(row.currentLastMonthRanking) + ' 位';
                    }else if(txt  == '本年'){
                        return Math.abs(row.currentLastYearRanking) + ' 位';
                    }
                }
            }

        ],
        createdRow: function(row,data,index){
            var txt = $('#energy-analyze .target-rank .onClicks').html();
            if(txt == '上月'){
                if(data.currentLastMonthRanking == 0){

                    $('td', row).eq(2).addClass('equal');
                }else if(data.currentLastMonthRanking > 0){

                    $('td', row).eq(2).addClass('up');
                }else if(data.currentLastMonthRanking < 0){

                    $('td', row).eq(2).addClass('down');
                }

            }else if(txt == '上年'){
                if(data.currentLastYearRanking == 0){

                    $('td', row).eq(2).addClass('equal');
                }else if(data.currentLastYearRanking > 0){

                    $('td', row).eq(2).addClass('up');
                }else if(data.currentLastYearRanking < 0){

                    $('td', row).eq(2).addClass('down');
                }
            }

        }
    });

    var table2 = $('#dateTables2').DataTable({
        "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "bPaginate": false,
        "ordering": false,
        'searching':false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
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
                title:'支行名称',
                data:"enterpriseName",
                render:function(data, type, row, meta) {
                    if(data.length > 6){
                        return '<span title="'+data+'" class="long">'+data.substring(0,5)+'</span>'
                    }else{
                        return '<span title="'+data+'" class="short">'+data.substring(0,5)+'</span>'
                    }

                }
            },
            {
                title:'对比',
                data:null,
                render:function(data, type, row, meta) {
                    var txt = $('#energy-analyze .target-rank .onClicks').html();

                    return '较' + txt + '';
                }
            },
            {
                title:'变化',
                data:null,
                render:function(data, type, row, meta) {

                    var txt = $('#energy-analyze .target-rank .onClicks').html();

                    if(txt == '上月'){

                        return Math.abs(row.currentLastMonthRanking) + ' 位';
                    }else if(txt  == '上年'){
                        return Math.abs(row.currentLastYearRanking) + ' 位';
                    }
                }
            }

        ],
        createdRow: function(row,data,index){
            var txt = $('#energy-analyze .target-rank .onClicks').html();
            if(txt == '上月'){
                if(data.currentLastMonthRanking == 0){

                    $('td', row).eq(2).addClass('equal');
                }else if(data.currentLastMonthRanking > 0){

                    $('td', row).eq(2).addClass('up');
                }else if(data.currentLastMonthRanking < 0){

                    $('td', row).eq(2).addClass('down');
                }

            }else if(txt == '上年'){
                if(data.currentLastYearRanking == 0){

                    $('td', row).eq(2).addClass('equal');
                }else if(data.currentLastYearRanking > 0){

                    $('td', row).eq(2).addClass('up');
                }else if(data.currentLastYearRanking < 0){

                    $('td', row).eq(2).addClass('down');
                }
            }

        }
    });

    var table3 = $('#dateTables3').DataTable({
        "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "bPaginate": false,
        "ordering": false,
        'searching':false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
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
                title:'',
                data:"energyItemName"

            },
            {
                title:'总量',
                data:"energyItemValue",
                render:function(data, type, full, meta){

                    return data.toFixed(2);
                }
            },
            {
                title:'占比（%）',
                data:"energyItemPercent",
                render:function(data, type, full, meta){

                    return (data * 100).toFixed(2) + '%';
                }
            }



        ]
    });

    var table4 = $('#dateTables4').DataTable({
        "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "bPaginate": false,
        "ordering": false,
        'searching':false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
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
                title:'',
                data:"energyItemName"

            },
            {
                title:'总量',
                data:"energyItemValue",
                render:function(data, type, full, meta){

                    return data.toFixed(2);
                }
            },
            {
                title:'占比（%）',
                data:"energyItemPercent",
                render:function(data, type, full, meta){

                    return (data * 100).toFixed(2) + '%';
                }
            }



        ]
    });

    var table5 = $('#dateTables5').DataTable({
        "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "bPaginate": false,
        "ordering": false,
        'searching':false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
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
        "columns": [
            {
                "title":"时间",
                "data":"dataDate",
                "render":function(data,type,row,meta){
                    if(data && data.length >0){
                        return data.split('T')[0] + ' ' + data.split('T')[1];
                    }
                }
            },
            {
                "title": "支路",
                "class":"L-checkbox",
                "data":"cName"
            },
            {
                "title": "报警类型",
                "data":"cDtnName"
            },
            {
                "title": "报警条件",
                "data":"expression"
            },
            {
                "title": "此时数据",
                "data":"data"
            }
        ]
    });

    //点击能耗统计中切换按钮时
    $('.content-main-top0 .left-cut li a').on('click',function(){
        $('#theLoading').modal('show');
        getEnergyStatistics();
    });

    //点击能耗分析中切换按钮时
    $('#energy-analyze .left-cut li a').on('click',function(){
        var txt = $(this).html();
        $('#energy-analyze .specific-data').css({
            display:'none'
        });
        if(txt == '能耗分项'){
            $('#energy-analyze .unit-form').css({
                display:'block'
            });
            getUnitFormData();

        }else  if(txt == '能效指标'){
            $('#energy-analyze .target-rank').css({
                display:'block'
            });
            getTargetRank();

        }else  if(txt == '电耗分项'){
            $('#energy-analyze .current-drain').css({
                display:'block'
            });

            getCurrentData();
        }else  if(txt == '数据质量'){
            $('#energy-analyze .data-quality').css({
                display:'block'
            });

            getDataQuality();
        }
    });


    //点击能耗分析中单位构成下的切换按钮
    $('.unit-form .top-cut li a').on('click',function(){

        getUnitFormData();
    });

    $('.unit-form .top-cut li select').on('change',function(){

        getUnitFormData();
    });

    //点击能耗排名的切换按钮
    $('.energy-rank .top-cut li a').on('click',function(){

        getEnergyRank();
    });

    $('.energy-rank .top-cut li select').on('change',function(){

        getEnergyRank();
    });


    //点击指标排名的切换按钮
    $('.target-rank .top-cut li a').on('click',function(){

        getTargetRank();
    });

    $('.target-rank .top-cut li select').on('change',function(){

        getTargetRank();
    });

    //点击电耗分项的切换按钮
    $('.current-drain .top-cut li a').on('click',function(){

        getCurrentData();
    });
});

//存放所有新闻栏目
var newsArr = [];

//获取所有新闻栏目
function getTitleByID(){

    $.ajax({
        type: 'get',
        url: IP + "/News/GetAllNewsTypeContent",
        timeout: theTimes,
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {

            console.log(data);
            newsArr = data;
            getNewsTitle();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};
getTitleByID();

//获取要展示的新闻栏目
function getNewsTitle(){

    $.ajax({
        type: 'get',
        url: IP + "/EnergyTopPage/GetTopPageNewsConfig",
        timeout: theTimes,
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {

            console.log(data);
            //根据ID判断展示的新闻栏目

            var firstArr = [];

            var topTitle = '';

            var secondArr = [];

            var bottomTitle = '';

            $(newsArr).each(function(i,o){

                if(o.pK_NewsType == data.firstNewsTypeID){

                    firstArr = o.newsContents.slice(0,5);

                    topTitle = o.f_NewsTypeName;

                }else if(o.pK_NewsType == data.secondNewsTypeID){

                    secondArr = o.newsContents.slice(0,5);

                    bottomTitle = o.f_NewsTypeName;
                }
            });
            //上方标题与内容
            $('.top-title b').html(topTitle);

            var html1 = '';
            $(firstArr).each(function(i,o){

                html1 +=  '<li><a href="../news/news-4.html?id=' + o.pK_NewsID+ '&come=1' +
                    '">'+o.f_NewsTitle +'</a></li>';;
            });

            $('.main-news1').html(html1);

            //下方标题与内容


            $('.bottom-title b').html(bottomTitle);

            var html2 = '';
            $(secondArr).each(function(i,o){

                html2 += '<li><a href="../news/news-4.html?id=' + o.pK_NewsID+ '&come=1' +
                    '">'+o.f_NewsTitle +'</a></li>';
            });

            $('.main-news2').html(html2);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

//获取报警信息
function getAlarmMessage(){

    var startDate = moment().format('YYYY-MM-DD');

    var endDate = moment().add(1,'day').format('YYYY-MM-DD');

    $.ajax({
        type: 'post',
        url: IP + "/Alarm/GetAllExcData",
        timeout: theTimes,
        data:{
            "st": startDate,
            "et": endDate,
            "pointerIds": postArr,
            "excTypeInnderId": "",
            "energyType": ""
        },
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {

            console.log(data);

            _table = $("#datatables5").dataTable();

            var alermArr = [];

            for(var i=0;i<data.length;i++){
                alermArr.push(data[i]);
            };

            ajaxSuccess1(alermArr);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};


//获取能耗统计信息
function getEnergyStatistics(){
    var selectDateType = '';
    var startTime = '';
    var endTime = '';
    var dataArr = [];
    var txt = $('#energyStatistics .content-main-top0 .onClick').html();
    if(txt == '本年累计'){
        dataArr = getPostDate('本年');
    }else if(txt == '本月累计'){
        dataArr = getPostDate('本月');
    }


    selectDateType = dataArr[5];
    startTime = dataArr[1];
    endTime = dataArr[2];

    console.log(selectDateType,startTime,endTime);


    $.ajax({
        type: 'get',
        url: IP + "/EnergyTopPage/GetTopPageEnergyStatBranchData",
        timeout: theTimes,
        data:{
            'energyInput.enterpriseID':EnterpriseID,
            'energyInput.selectDateType': selectDateType,
            'energyInput.startTime':startTime,
            'energyInput.endTime':endTime,
            'energyInput.userID' :_userIdName
        },
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);
            //获取到能耗统计的数据进行展示

            //右侧统计数据
            $('#energyStatistics  .main-data-top .main-data-top-center font').html(data.baseInfoStandardCoal.toFixed(1));

            $('#energyStatistics  .main-data-bottom .main-data-top-center font').html(data.cpvStandardCoal.toFixed(1));

            console.log($('#energyStatistics  .main-data-bottom .main-data-top-center').html());

            $('#energyStatistics  .main-data-bottom .main-data-top-center p .rank').html(data.energyRanking);

            $('#energyStatistics  .main-data-top .main-data-top-right p b').eq(0).html(data.cO2Data.toFixed(1));

            $('#energyStatistics  .main-data-top .main-data-top-right p b').eq(1).html(data.sO2Data.toFixed(1));

            $('#energyStatistics  .main-data-top .main-data-top-right p b').eq(2).html(data.nOxData.toFixed(1));
            $('#energyStatistics  .main-data-bottom .main-data-top-right b').html(data.treePlanting);
            //左侧展示的具体数据
            if(data.topPageBaseInfos.length == 0){

                $('#energyStatistics .main-data-top').css({
                    display:'none'
                })
            }else {
                $('#energyStatistics .main-data-top').css({
                    display: 'block'
                });
                var html = '';
                $(data.topPageBaseInfos).each(function (i, o) {

                    var unit = getUnitByID(o.f_EnergyItemID);
                    var percentage = Math.abs(o.chainEnergyPercent.toFixed(3)) * 100;

                    var arrows = '';
                    if (o.chainEnergyPercent < 0) {
                        arrows = '<p class="percentage1">' + percentage.toFixed(1) + '%</p>'
                    } else {
                        arrows = '<p class="percentage">' + percentage.toFixed(1) + '%</p>'
                    }

                    html += '<div class="small-part col-lg-6 col-md-12 col-sm-12 col-xs-12">' +
                        '	<div class="small-part-content">' +
                        '		<p class="amout">' +
                        '			<b>' + o.currentEnergyData.toFixed(1) + '</b>' +
                        '			<span>'+unit+'</span>' +
                        '		</p>' +
                        '		<p class="the-type">' + o.f_EnergyItemName + '</p>' +

                        '</div>	<div class="compare-data">' + arrows +
                        '		<p>较上' + selectDateType + '同期</p>' +
                        '</div></div>';


                });

                $('#energyStatistics .important-data0').html(html);
            }

            if(data.topPageCPVs.length == 0){

                $('#energyStatistics .main-data-bottom').css({
                    display:'none'
                })
            }else{
                $('#energyStatistics .main-data-bottom').css({
                    display:'block'
                });
                var html1 = '';
                $(data.topPageCPVs).each(function(i,o){

                    var unit = getUnitByID(o.f_EnergyItemID);
                    var percentage = Math.abs(o.chainEnergyPercent.toFixed(3)) * 100;

                    var arrows = '';
                    if(o.chainEnergyPercent < 0){
                        arrows = '<p class="percentage1">'+ percentage.toFixed(1)+'%</p>'
                    }else{
                        arrows = '<p class="percentage">'+ percentage.toFixed(1)+'%</p>'
                    }

                    html1 +='<div class="small-part col-lg-6 col-md-12 col-sm-12 col-xs-12">' +
                        '	<div class="small-part-content">' +
                        '		<p class="amout">' +
                        '			<b>'+ o.currentEnergyData.toFixed(1)+'</b>' +
                        '			<span>'+unit+'</span>' +
                        '		</p>' +
                        '		<p class="the-type">'+ o.f_EnergyItemName+'</p>' +

                        '</div>	<div class="compare-data">' + arrows +
                        '		<p>较上'+selectDateType+'同期</p>' +
                        '</div></div>';


                });

                $('#energyStatistics .important-data1').html(html1);
            }


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

//getEnergyStatistics();

var myChart = echarts.init(document.getElementById('energy-demand'));

option = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius : '95%',
            center: ['40%', '50%'],
            data:[
                {value:335, name:'昼'},
                {value:310, name:'夜'}
            ],
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    formatter: '{b} :({d}%)'
                }
            },
            itemStyle: {
                //normal: {
                //    color: function(params) {
                //
                //        var colorList = [
                //            '#9dc541','#afc8de'
                //        ];
                //        return colorList[params.dataIndex]
                //    }
                //},
                //emphasis: {
                //    shadowBlur: 10,
                //    shadowOffsetX: 0,
                //    shadowColor: 'rgba(0, 0, 0, 0.5)'
                //}
            }
        }
    ]
};

//存放要传的楼宇ID
var pointArr = [];

var postArr = [];

//获取能耗查询页面初始数据
function getStartData(){


    //获取查询对象
    $.ajax({
        type: 'get',
        url: IP + "/EnergyQuery/GetEnterpriseItem",
        timeout: theTimes,
        data:{
            userID :_userIdName,
            isShowTotalItem : 1
        },
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {

            console.log(data);

            pointArr = data;

            $(pointArr).each(function(i,o){

                if(EnterpriseID == o.enterpriseID){
                    postArr = o.pointerIDs;

                    return false;
                }

            });

            //获取chart图中的数据

            getUnitFormData();

            //获取报警数据
            getAlarmMessage();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        }
    });



}
getStartData();

//获取能耗分析中的能耗分项数据
function getUnitFormData(){

    //获取要传递的数据
    var date = $('.unit-form .top-cut .onClicks').html();
    var dateArr = [];
    dataArr =  getPostDate(date);
    var startDate = dataArr[1];
    var endDate = dataArr[2];

    console.log(date);


    console.log(postArr);

    $.ajax({
        type: 'post',
        url: IP + "/EnergyQuery/GetBranchEnergyReturnData",
        timeout: theTimes,
        data:{
            "startTime": startDate,
            "endTime": endDate,
            "pointerIDs":postArr ,
            "energyItemType": -2
        },
        beforeSend: function () {
            myChart.showLoading();
        },

        complete: function () {

        },
        success: function (data) {

            console.log(data);


            var dataArr = data.sourceEnergys;

            console.log(dataArr);

            var sArr = [];

            $(dataArr).each(function(i,o){
                var obj = {
                    value : o.energyItemValue.toFixed(2),
                    name: o.energyItemName
                };
                sArr.push(obj);

            });

            console.log(sArr);

            //重绘chart图


            option.series[0].data = sArr;
            myChart.hideLoading();
            myChart.setOption(option);

            //给表格添加数据
            dataArrs = dataArr;
            _table = $('#dateTables').dataTable();
            ajaxSuccess();


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};


//获取能效指标中的数据

function  getTargetRank(){


    var index = $('.target-rank .top-cut select').val();


    var showData = [];

    var string1 = "/EnergyQuery/GetAirColdCOPBranchData";

    var string2 = '/EnergyQuery/GetComputerRoomPUEBranchData';

    if(index == 1){
        getTargetRankData(string1,index);
    }else if(index == 2){
        getTargetRankData(string2,index);
    }
};

function getTargetRankData(url,index){

    var date = $('.target-rank .top-cut .onClicks').html();
    var dateArr = [];
    dataArr =  getPostDate(date);
    var startDate = dataArr[1];
    var endDate = dataArr[2];
    var dateType = dataArr[3];
    var selectType = dataArr[5];


    $.ajax({
        type: 'post',
        url: IP + url,
        timeout: theTimes,
        data:{
            "dateType": dateType,
            "startTime": startDate,
            "endTime": endDate,
            "selectDateType": selectType,
            "pointerIDs":postArr,
            "enterpriseID": EnterpriseID
        },
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);

            $('.ruler-box').css({
                display:'none'
            });

            if(index == 1){

                $('.ruler-box1').css({
                    display:'block'
                });
                //下方潜力分析图
                $('#energy-demand2 .ruler-box1 h3 b').html((data.savingPotential.toFixed(4)) * 100 + '%');

                //标杆数据位置
                if(data.picketBuildData> 7 || data.picketBuildData < 0){
                    myAlter('标杆信息错误');
                }else{
                    var num1 =700 -(data.picketBuildData * 100)-78;
                    //var num1 =700 -(5 * 100)-78;
                    console.log(num1);
                    $('#energy-demand2 .sign1').css({
                        left:num1+ 'px'
                    });
                }

                if(data.avgPUEData> 7 || data.avgPUEData < 0){
                    myAlter('本数据错误');
                }else{
                    var num1 =700 -(data.avgPUEData * 100)-78;
                    //var num1 =700 -(5 * 100)-78;
                    console.log(num1);
                    $('#energy-demand2 .sign0').css({
                        left:num1+ 'px'
                    });
                }
            }else if(index == 2){
                $('.ruler-box2').css({
                    display:'block'
                });
                //下方潜力分析图
                $('#energy-demand2 .ruler-box2 h3 b').html((data.savingPotential.toFixed(4)) * 100 + '%');

                //标杆数据位置
                if(data.picketBuildData> 3.2 || data.picketBuildData < 0){
                    myAlter('标杆信息错误');
                }else if(data.picketBuildData< 3.2 && data.picketBuildData > 1.1){
                    var num1 =630 -((3.2-data.picketBuildData) * 300)-77;
                    //var num1 =700 -(5 * 100)-78;
                    console.log(num1);
                    $('#energy-demand2 .sign11').css({
                        left:num1+ 'px'
                    });
                }

                if(data.avgPUEData> 3.2 || data.avgPUEData < 0){
                    myAlter('本数据错误');
                }else if(data.avgPUEData< 3.2 && data.avgPUEData > 1.1){
                    var num1 =630 -((3.2-data.avgPUEData) * 300)-77;
                    //var num1 =700 -(5 * 100)-78;
                    console.log(num1);
                    $('#energy-demand2 .sign00').css({
                        left:num1+ 'px'
                    });
                }
            }



        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};


//获取电耗分项中的数据
var myChart3;
// 指定图表的配置项和数据
option3 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'来源',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直达', selected:true},
                {value:679, name:'营销广告'},
                {value:1548, name:'搜索引擎'}
            ],
            itemStyle:{
                normal:{
                    label:{
                        show: true,
                        formatter: '{b} : {d}%',
                        textStyle:{
                            color:'darkOrange'
                        }
                    },
                    labelLine :{show:true},
                }
            }
        },
        {
            name:'去向',
            type:'pie',
            radius: ['50%', '85%'],
            data:[
                {value:335, name:'直达'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1048, name:'百度'},
                {value:251, name:'谷歌'},
                {value:147, name:'必应'},
                {value:102, name:'其他'}
            ],
            itemStyle:{
                normal:{
                    label:{
                        show: true,
                        formatter: '{b}:{d}%'
                    },
                    labelLine :{show:true}
                }
            }
        }
    ]
};

//获取楼宇列表
function getBulidingData(){


    //获取查询对象

    $.ajax({
        type: 'get',
        url: IP + "/EnergyQuery/GetEnterpriseItem",
        timeout: theTimes,
        data:{
            userID :_userIdName,
            isShowTotalItem : 1
        },
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);
            pointArr = data;
            //获取chart图中的数据



        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        }
    });



}
//getBulidingData();

//获取页面初始数据
function getCurrentData(){

    myChart3 = echarts.init(document.getElementById('energy-demand3'));

    var date = $('.current-drain .top-cut .onClicks').html();
    var dateArr = [];
    dataArr =  getPostDate(date);
    var startDate = dataArr[1];
    var endDate = dataArr[2];

    $.ajax({
        type: 'post',
        url: IP + "/EnergyQuery/GetTotalEnergyReturnData",
        timeout: theTimes,
        data:{
            "energyItemType":'01',
            "startTime": startDate,
            "endTime": endDate,
            "pointerIDs":postArr
        },
        beforeSend: function () {
            //$('#theLoading').modal('show');
            myChart3.showLoading();
        },

        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);

            if(data.sourceEnergys.length == 0){
                myChart3.hideLoading();
                myAlter('无数据!');
                return false;
            }

            //表格中的数据

            var theDataArr = [];

            theDataArr1 = [];

            //删除之前的数据
            for(var i=0; i<option.series.length; i++){

                option3.series[i].data = [];
            }

            //图例
            var legendArr = [];

            //来源
            var sArr1 = [];
            var sArr2 = [];
            $(data.sourceEnergys).each(function(i,o){
                //给表格获取数据

                theDataArr.push(o);

                var obj = {value : o.energyItemValue.toFixed(2),name:o.energyItemName};

                sArr1.push(obj);

                //显示数据

                option3.series[0].data = sArr1;

            });

            //去向
            $(data.leaveEnergys).each(function(i,o){
                //给表格获取数据

                theDataArr1.push(o);


                var obj = {value : o.energyItemValue.toFixed(2),name:o.energyItemName};

                sArr2.push(obj);

                //显示数据

                option3.series[1].data = sArr2;


            });


            //重绘chart图
            myChart3.hideLoading();
            myChart3.setOption(option3);

            _table = $('#dateTables3').dataTable();

            ajaxSuccess1(theDataArr);

            _table = $('#dateTables4').dataTable();

            ajaxSuccess1(theDataArr1);



        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};


//获取数据质量中的数据
var myChart4;

// 指定图表的配置项和数据
option4 = {

    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['40%', '80%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'outer'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ],
            itemStyle:{
                normal:{
                    label:{
                        show: true,
                        formatter: '{b} : {c} ({d}%)'
                    },
                    labelLine :{show:true}
                }
            }
        }
    ]
};

//获取全部支行列表

//存放所有支行ID
var allBankArr = [];

var allBankNameArr = [];


//获取数据质量中具体数据进行展示

function getDataQuality(){

    myChart4 = echarts.init(document.getElementById('energy-demand4'));

    var date = moment().format('YYYY-MM-DD');
    console.log(date);
    $.ajax({
        type: 'post',
        url: IP + "/ServiceDataQuality/GetServiceDataQualityDs",
        timeout: theTimes,
        data:{
            'eprIds' :postArr,
            'now' : date
        },
        beforeSend: function () {
            //$('#theLoading').modal('show');
            myChart4.showLoading();

        },

        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);

            var yArr = data.serviceDataQualityDs;

            var sArr = [];

            $(yArr).each(function(i,o){

                var obj = {
                    name:'',
                    data:'',
                }
                sArr.push(obj);

            });

            //option4.series[0].data = sArr;

            //重绘chart图
            myChart4.hideLoading();
            myChart4.setOption(option4);

            //右侧数据汇总
            $('#energy-analyze .data-quality .total-data li').eq(0).find('b').html(data.serviceTotalCount);

            $('#energy-analyze .data-quality .total-data li').eq(1).find('b').html(data.serviceOnCountPer + '%');

            $('#energy-analyze .data-quality .total-data li').eq(2).find('b').html(data.serviceFaultCountPer + '%');

            $('#energy-analyze .data-quality .total-data li').eq(3).find('b').html(data.serviceUnCountPer + '%');



        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};


//点击切换按钮时
$('.left-cut li a').on('click',function(){

    $(this).parents('ul').find('a').removeClass('onClick');
    $(this).addClass('onClick');
});

$('.top-cut li a').on('click',function(){

    $(this).parents('ul').find('a').removeClass('onClicks');
    $(this).addClass('onClicks');
});

window.onresize = function () {
    if(myChart ){
        myChart.resize();

    }
};