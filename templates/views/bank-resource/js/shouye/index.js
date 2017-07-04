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
        "sScrollY": '215px',
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
                title:'对比对象',
                data:"enterpriseName",
                render:function(data, type, row, meta) {
                    if(data.length > 6){
                        return '<span title="'+data+'" class="long">'+data.substring(0,7)+'</span>'
                    }else{
                        return '<span title="'+data+'" class="short">'+data.substring(0,7)+'</span>'
                    }

                }
            },
            {
                title:'总量',
                data:"currentEnergyData",
                render:function(data, type, row, meta) {

                    return data.toFixed(2);
                }
            },
            {
                title:'占比(%)',
                data:"currentEnergyPercent",
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
                        return '<span title="'+data+'" class="long">'+data.substring(0,7)+'</span>'
                    }else{
                        return '<span title="'+data+'" class="short">'+data.substring(0,7)+'</span>'
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
                        return Math.abs(row.currentLastMonthRanking) + ' 位';
                    }
                }
            }

        ],
        createdRow: function(row,data,index){
            var txt = $('#energy-analyze .energy-rank .onClicks').html();
            if(txt == '本月'){
                if(data.currentLastMonthRanking == 0){

                    $('td', row).eq(2).addClass('equal');
                }else if(data.currentLastMonthRanking > 0){

                    $('td', row).eq(2).addClass('up');
                }else if(data.currentLastMonthRanking < 0){

                    $('td', row).eq(2).addClass('down');
                }

            }else if(txt == '本年'){
                if(data.currentLastMonthRanking == 0){

                    $('td', row).eq(2).addClass('equal');
                }else if(data.currentLastMonthRanking > 0){

                    $('td', row).eq(2).addClass('up');
                }else if(data.currentLastMonthRanking < 0){

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
                        return '<span title="'+data+'" class="long">'+data.substring(0,7)+'</span>'
                    }else{
                        return '<span title="'+data+'" class="short">'+data.substring(0,7)+'</span>'
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
        if(txt == '单位构成'){
            $('#energy-analyze .unit-form').css({
                display:'block'
            });
            getUnitType();

        }else  if(txt == '指标排名'){
            $('#energy-analyze .target-rank').css({
                display:'block'
            });
            getTargetRank();

        }else  if(txt == '能耗排名'){
            $('#energy-analyze .energy-rank').css({
                display:'block'
            });

            getEnergyRank();
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
        }else  if(txt == '分行查询'){
            $('#energy-analyze .branch-refer').css({
                display:'block'
            });

        }
    });


    //点击能耗分析中单位构成下的切换按钮
    $('.unit-form .top-cut li a').on('click',function(){

        if($(this).parent().prop('class') != 'showData')

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
            $('#theLoading').modal('show');
        },

        complete: function () {

        },
        success: function (data) {

            //console.log(data);
            newsArr = data;
            getNewsTitle();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
}
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

            //console.log(data);
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

            $('.openNews0 a').attr('href','../news/topPageNewsType.html?id='+data.firstNewsTypeID + '');
            $('.openNews1 a').attr('href','../news/topPageNewsType.html?id='+data.secondNewsTypeID + '');

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
            //console.log(textStatus);

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
    var txt = $('.content-main-top0 .onClick').html();
    if(txt == '本年累计'){
        dataArr = getPostDate('本年');
    }else if(txt == '本月累计'){
        dataArr = getPostDate('本月');
    }
    selectDateType = dataArr[5];
    startTime = dataArr[1];
    endTime = dataArr[2];

    //console.log(selectDateType,startTime,endTime);

    $.ajax({
        type: 'get',
        url: IP + "/EnergyTopPage/GetTopPageEnergyStatData",
        timeout: theTimes,
        data:{
            'energyInput.selectDateType': selectDateType,
            'energyInput.startTime':startTime,
            'energyInput.endTime':endTime,
            'energyInput.userID' :_userIdName
        },
        beforeSend: function () {

        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {

            //console.log(data);
            //获取到能耗统计的数据进行展示

            //右侧统计数据
            $('#energyStatistics  .main-data-top .main-data-top-center font').html(data.baseInfoStandardCoal.toFixed(1));

            $('#energyStatistics  .main-data-bottom .main-data-top-center font').html(data.cpvStandardCoal.toFixed(1));

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

                    html += '<div class="small-part col-lg-4 col-md-4 col-sm-6 col-xs-6">' +
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

                        html1 +='<div class="small-part col-lg-4 col-md-4 col-sm-6 col-xs-6">' +
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
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

getEnergyStatistics();

var myChart = echarts.init(document.getElementById('energy-demand'));

option = {
    tooltip : {'trigger':'axis'},
    legend: {
        orient : 'vertical',
        x : 'left',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius : '95%',
            center: ['72%', '50%'],
            data:[
                {value:335, name:'昼'},
                {value:310, name:'夜'}
            ],
            label: {
                normal: {
                    show: false,
                    position: 'outside',
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

//获取能耗类型
function getUnitType(){

    $.ajax({
        type: 'get',
        url: IP + "/EnergyQuery/GetEnergyNormItemQuery",
        timeout: theTimes,
        data:{
            'isShowStandardCoal':1
        },
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {

            //console.log(data);
            var html = '';
            $(data).each(function(i,o){

                html += '<option value="'+ o.energyTypeID+'">'+ o.energyTypeName+'</option>'
            });

            $('#energy-analyze .unit-form select').html(html);
            getUnitFormData();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};
//获取能耗分析中的单位构成数据
function getUnitFormData(){

    //获取要传递的数据
    var date = $('.unit-form .top-cut .onClicks').html();
    var dateArr = [];
    dataArr =  getPostDate(date);
    var startDate = dataArr[1];
    var endDate = dataArr[2];

    var typeID = $('.unit-form .top-cut select').val();

    var energyID = '';
    if(typeID == -2){

        energyID =-2;
    }else{
         energyID = getUnitID(typeID);
    }

    $.ajax({
        type: 'post',
        url: IP + "/EnergyTopPage/GetEnterpriseCompositionData",
        timeout: theTimes,
        data:{
            "energyItemID": energyID,
            "startTime": startDate,
            "endTime": endDate,
            "userID": _userIdName
        },
        beforeSend: function () {
            myChart.showLoading();
        },

        complete: function () {

        },
        success: function (data) {

            //console.log(data);

            var dataArr = getArr(data);

            //console.log(dataArr);

            var sArr = [];

            var lArr = [];

            $(dataArr).each(function(i,o){
                var obj = {
                    value : o.currentEnergyData.toFixed(2),
                    name: o.enterpriseName
                };
                sArr.push(obj);
                lArr.push( o.enterpriseName);

            });

            //console.log(sArr);

            //重绘chart图

            option.legend.data = lArr;
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
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

getUnitType();

//获取能耗排名
//获取能耗排名中能耗类型
var myChart1 ;

option1 = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}"
    },
    calculable : true,
    xAxis : [
        {
            type : 'value',
            boundaryGap : [0, 0.01]
        }
    ],
    yAxis : [
        {
            type : 'category',
            data : ['巴西','印尼','美国','印度','中国','世界人口(万)']
        },
        {
            type : 'category',
            data : ['巴西','印尼','美国','印度','中国','世界人口(万)'],
            label: {
                show: true
            }
        }
    ],
    series : [
        {
            name: '',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230],
            itemStyle: {
                normal: {
                    color: function (params) {
                        //首先定义一个数组
                        var colorList = [
                            '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                        ];
                        return colorList[params.dataIndex]
                        //return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
                    },
                    //以下为是否显示
                    label: {
                        show: true
                    }
                }
            }
        }
    ]
};

var energyRankArr = [];

function getUnitTypes(){

    $.ajax({
        type: 'get',
        url: IP + "/EnergyTopPage/GetTopPageEnergyRanking",
        timeout: theTimes,
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {

            //console.log(data);
            energyRankArr = data;
            var html = '';
            $(data).each(function(i,o){

                html += '<option value="'+ o.energyNormFlag+'">'+ o.energyItemName+'</option>'
            });

            $('#energy-analyze .energy-rank select').html(html);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

//获取能耗排名中具体数据

function getEnergyRank(){

    //获取要传递的数据
    myChart1 = echarts.init(document.getElementById('energy-demand1'));

    var index = $('.energy-rank .top-cut select').find("option:selected").index();

    var obj = energyRankArr[index];

    //console.log(obj);

    var date = $('.energy-rank .top-cut .onClicks').html();

    //console.log(date);

    var dateArr = [];
    dateArr =  getPostDate(date);
    var startDate = dateArr[1];
    var endDate = dateArr[2];
    var dateType = dateArr[3];
    var selectType = dateArr[5];

    //console.log(dateArr);

    $.ajax({
        type: 'post',
        url: IP + '/EnergyManage/GetYearMonthCompareData',
        timeout: theTimes,
        data:{
            "energyNorm":obj,
            "dateType": dateType,
            "selectDateType": selectType,
            "startTime": startDate,
            "endTime": endDate,
            "userID": _userIdName
        },
        beforeSend: function () {
            myChart1.showLoading();
        },

        complete: function () {

        },
        success: function (data) {

            //console.log(data);

            var dataArr = getArr(data);

            //重绘右侧表格

            _table = $('#dateTables1').dataTable();
            ajaxSuccess1(dataArr);


            dataArr.reverse();

            //console.log(dataArr);

            var xArr = [];
            var yArr1 = [];
            var yArr2 = [];

            $(dataArr).each(function(i,o){

                xArr.push(o.currentEnergyData.toFixed(2));
                yArr1.push(o.currentRanking);
                yArr2.push(o.enterpriseName.substring(0,3));

            });
            option1.series[0].data = xArr;
            option1.yAxis[0].data = yArr1;
            option1.yAxis[1].data = yArr2;


            //重绘chart图
            myChart1.hideLoading();
            myChart1.setOption(option1);



        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });

};

getUnitTypes();


//获取指标排名中的能耗类型
var myChart2 ;

option2 = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}"
    },
    calculable : true,
    xAxis : [
        {
            type : 'value',
            boundaryGap : [0, 0.01]
        }
    ],
    yAxis : [
        {
            type : 'category',
            data : ['巴西','印尼','美国','印度','中国','世界人口(万)']
        },
        {
            type : 'category',
            data : ['巴西','印尼','美国','印度','中国','世界人口(万)']
        }
    ],
    series : [
        {
            name: '666',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230],
            markLine: {
                data: [{
                    name: '参考值',
                    xAxis: 0.5
                }],
                lineStyle: {
                    normal: {
                        color:'red',
                        width:3

                    }
                },
                label:{
                    normal:{
                        show: true,
                        formatter: '{b}:{c}',
                        textStyle:{
                            fontSize:16
                        }
                    }
                }

            },
            itemStyle: {
                normal: {
                    color: function (params) {
                        //首先定义一个数组
                        var colorList = [
                            '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                        ];
                        return colorList[params.dataIndex]
                        //return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
                    },
                    //以下为是否显示
                    label: {
                        show: false
                    }
                }
            }
        }
    ]
};

var targetRankArr = [];
 function getUnitType1(){

    $.ajax({
        type: 'get',
        url: IP + "/EnergyTopPage/GetTopPageEneryNormItem",
        timeout: theTimes,
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {

            //console.log(data);
            targetRankArr = data;
            var html = '';
            $(data).each(function(i,o){

                html += '<option value="'+ o.referenceValue+'" consolt1 ="'+ o.referenceMonthValue+'" consolt2 ="'+ o.referenceYearValue+'">'+ o.energyItemName+'</option>'
            });

            $('#energy-analyze .target-rank select').html(html);


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

getUnitType1();

//获取指标排名中的具体数据
function  getTargetRank(){

    myChart2 = echarts.init(document.getElementById('energy-demand2'));

    var index = $('.target-rank .top-cut select').find("option:selected").index();

    var obj = targetRankArr[index];

    //console.log(obj);

    var showData = [];

    var string1 = "/EnergyManage/GetAirColdCOPCompareData";

    var string2 = '/EnergyManage/GetComputerRoomPUECompareData'

    if(obj.energyNormFlag == 6){
        getTargetRankData1(string1);
    }else if(obj.energyNormFlag == 7){
        getTargetRankData1(string2);
    }else{
        getTargetRankData2(obj);
    }

};

function getTargetRankData1(url){

    var date = $('.target-rank .top-cut .onClicks').html();
    var dateArr = [];
    dataArr =  getPostDate(date);
    var startDate = dataArr[1];
    var endDate = dataArr[2];
    var dateType = dataArr[3];
    var selectType = dataArr[5];

    var refValue = 0;

    if(date == '上月'){

        refValue = $('.target-rank .top-cut select').find("option:selected").attr('consolt1');
    }else if(date == '上年'){

        refValue = $('.target-rank .top-cut select').find("option:selected").attr('consolt2');
    }



    $.ajax({
        type: 'post',
        url: IP + url,
        timeout: theTimes,
        data:{
            "dateType": dateType,
            "selectDateType": selectType,
            "startTime": startDate,
            "endTime": endDate,
            "userID": _userIdName
        },
        beforeSend: function () {
            myChart2.showLoading();
        },

        complete: function () {

        },
        success: function (data) {
            $('#theLoading').modal('hide');
            //console.log(data);

            var dataArr = getArr(data);

            //重绘右侧表格

            _table = $('#dateTables2').dataTable();
            ajaxSuccess1(dataArr);

            dataArr.reverse();



            //console.log(dataArr);

            var xArr = [];
            var yArr1 = [];
            var yArr2 = [];

            $(dataArr).each(function(i,o){

                xArr.push(o.currentEnergyData);
                yArr1.push(o.currentRanking);
                yArr2.push(o.enterpriseName.substring(0,3));

            });
            option2.series[0].data = xArr;
            option2.yAxis[0].data = yArr1;
            option2.yAxis[1].data = yArr2;

            option2.series[0].markLine.data = [{
                    name: '参考值',
                    xAxis:  refValue
                }];
            //console.log(option2.series[0]);

            //重绘chart图
            myChart2.hideLoading();
            myChart2.setOption(option2);



        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

function getTargetRankData2(obj){

    var date = $('.target-rank .top-cut .onClicks').html();
    var dateArr = [];
    dataArr =  getPostDate(date);
    var startDate = dataArr[1];
    var endDate = dataArr[2];
    var dateType = dataArr[3];
    var selectType = dataArr[5];

    var refValue = 0;

    if(date == '上月'){

        refValue = $('.target-rank .top-cut select').find("option:selected").attr('consolt1');
    }else if(date == '上年'){

        refValue = $('.target-rank .top-cut select').find("option:selected").attr('consolt2');
    }

    $.ajax({
        type: 'post',
        url: IP + '/EnergyManage/GetYearMonthCompareData',
        timeout: theTimes,
        data:{
            "energyNorm":obj,
            "dateType": dateType,
            "selectDateType": selectType,
            "startTime": startDate,
            "endTime": endDate,
            "userID": _userIdName
        },
        beforeSend: function () {
            myChart2.showLoading();
        },

        complete: function () {

        },
        success: function (data) {

            //console.log(data);

            var dataArr = getArr(data);

            //重绘右侧表格

            _table = $('#dateTables2').dataTable();
            ajaxSuccess1(dataArr);

            dataArr.reverse();

            //console.log(dataArr);

            var xArr = [];
            var yArr1 = [];
            var yArr2 = [];

            $(dataArr).each(function(i,o){

                xArr.push(o.currentEnergyData);
                yArr1.push(o.currentRanking);
                yArr2.push(o.enterpriseName.substring(0,3));

            });
            option2.series[0].data = xArr;
            option2.yAxis[0].data = yArr1;
            option2.yAxis[1].data = yArr2;

            option2.series[0].markLine.data = [{
                name: '参考值',
                xAxis: refValue
            }];
            //console.log(option2.series[0]);

            //重绘chart图
            myChart2.hideLoading();
            myChart2.setOption(option2);



        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

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

        },

        complete: function () {

        },
        success: function (data) {

            //console.log(data);
            pointArr = data;
            //获取chart图中的数据



        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        }
    });



}
getBulidingData();

//获取页面初始数据
function getCurrentData(){

    myChart3 = echarts.init(document.getElementById('energy-demand3'));

    var date = $('.current-drain .top-cut .onClicks').html();
    var dateArr = [];
    dataArr =  getPostDate(date);
    var startDate = dataArr[1];
    var endDate = dataArr[2];

    $(pointArr).each(function(i,o){

        if(-1 == o.enterpriseID){
            postArr = o.pointerIDs;

            return false;
        }

    });

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

            //console.log(data);

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
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        }
    });
};


//获取数据质量中的数据
var myChart4;

// 指定图表的配置项和数据
option4 = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        show:true,
        data:['在线支路','故障支路','未知支路']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value}'
            }
        }
    ],
    series : [
        {
            name:'最高气温',
            type:'bar',
            data:[11, 11, 15, 13, 12, 13, 10],
            smooth:true,
            stack:  '总量',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            itemStyle: {
                normal: {
                    color: '#9dc541'
                },
                emphasis: {
                    barBorderColor: 'rgba(0,0,0,0.5)',
                    color: '#9dc541'
                }
            },
            data: [],
            barMaxWidth: '60',

        },
        {
            name:'最低气温',
            type:'bar',
            data:[11, 11, 15, 13, 12, 13, 10],

            smooth:true,
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            itemStyle: {
                normal: {
                    color: '#afc8de'
                },
                emphasis: {
                    barBorderColor: 'rgba(0,0,0,0.5)',
                    color: '#afc8de'
                }
            },
            data:[],
            barMaxWidth: '100',
        }
    ]
};

//获取全部支行列表

//存放所有支行ID
var allBankArr = [];

var allBankNameArr = [];

function getAllBank(){

    $.ajax({
        type: 'get',
        url: IP + "/EnergyQuery/GetEnterpriseItem",
        timeout: theTimes,
        data:{
            userID : _userIdName,
            isShowTotalItem : 0
        },
        beforeSend: function () {
            //$('#theLoading').modal('show');

        },

        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {

            //console.log(data);

            $(data).each(function(i,o){

                allBankArr.push(o.enterpriseID);
                allBankNameArr.push(o.eprName);
            });
            //console.log(allBankArr);



            getAllBankName();


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

getAllBank();
//获取数据质量中具体数据进行展示

function getDataQuality(){

    myChart4 = echarts.init(document.getElementById('energy-demand4'));

    var date = moment().format('YYYY-MM-DD');
    //console.log(date);
    $.ajax({
        type: 'post',
        url: IP + "/ServiceDataQuality/GetServiceDataQualityDs",
        timeout: theTimes,
        data:{
            'eprIds' :allBankArr,
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
            //console.log(data);

            //删除之前的数据
            for(var i=0; i<option.series.length; i++){

                option4.series[i].data = [];

            }


            var yArr = data.ys;

            $(yArr).each(function(i,o){

                option4.series[i].data = getArr(o);
                option4.series[i].name = data.lgs[i];
            });

            option4.xAxis[0].data = getArr(data.xs);

            //重绘chart图
            myChart4.hideLoading();
            myChart4.setOption(option4);

            //右侧数据汇总
            $('#energy-analyze .data-quality .total-data li').eq(0).find('b').html(data.serviceOnCountPer + '%');

            $('#energy-analyze .data-quality .total-data li').eq(1).find('b').html(data.serviceFaultCountPer + '%');

            $('#energy-analyze .data-quality .total-data li').eq(2).find('b').html(data.serviceUnCountPer + '%');


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

//能耗分析中分行查询功能
function getAllBankName(){

    var showArr = getArr(allBankNameArr);

    var html = '';


    $(showArr).each(function(i,o){

        html += '<li> <button>'+ o.substring(2,5)+'</button> </li>'
    });

    html += '<li> <button>全部</button> </li>'

    $('#energy-analyze .branch-refer .right-btn').html(html);

}

//单位构成中显示数据按钮
$('.top-cut .showData').on('click',function(){

    $(this).parents('.specific-data').find('.show-main').children().eq(0).css({
        display:'none'
    });

    $(this).parents('.specific-data').find('.show-main').children().eq(1).css({
        display:'none'
    });

    var txt = $(this).html();
    if(txt == '显示数据'){

        $(this).parent().find('.onClicks').click();

        $(this).parents('.specific-data').find('.show-main').children().eq(1).css({
            display:'block'
        });

        $(this).html('显示图表');
    }else if(txt == '显示图表'){
        $(this).parents('.specific-data').find('.show-main').children().eq(0).css({
            display:'block'
        });

        $(this).parent().find('.onClicks').click();

        $(this).html('显示数据');

    }



});


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
    if(myChart1 ){
        myChart1.resize();
    }
    if(myChart2 ){
        myChart2.resize();
    }
    if(myChart3 ){
        myChart3.resize();
    }
    if(myChart4 ){
        myChart4.resize();
    }

};