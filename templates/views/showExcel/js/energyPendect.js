/**
 * Created by admin on 2017/7/17.
 */


$(document).ready(function(){


    //点击实时能耗上方切换能耗类型按钮时
    $('.real-time-energy .top-cut li a').on('click',function(){

        getRealTimeData();
    });

    //点击能耗构成上方切换展示时间按钮时
    $('.energy-constitute .top-cut li a').on('click',function(){

        getEnergyConstitute();
    });

    //点击面积指标上方切换展示时间按钮时
    $('.area-energy-data .top-cut li a').on('click',function(){

        getAreaEnergyData();
    });

    //点击面积指标上方切换展示时间按钮时
    $('.energy-ranking .top-cut li a').on('click',function(){

        getEnergyPanking();
    });

    $('.energy-ranking .top-choose-energy a').on('click',function(){

        getEnergyPanking();
    });

});

//打开本地文件
function jsRunExeFile() {
    var activeObj = new ActiveXObject('WScript.shell');
    //var para = "C:\\Program Files\\Tencent\\TT\\bin\\TTraveler.exe";

    var para = "C:\\Users\\admin\\AppData\\Local\\youdao\\dict\\Application\\YodaoDict.exe";

    //D:\软件\ps\绿化版ps5\绿化版ps5\Adobe Photoshop CS5 Extended 12.0.3.0\Adobe Photoshop CS5
    //C:\Users\admin\AppData\Local\youdao\dict\Application
    activeObj.exec(para);
}

//报警中的表格
var table = $('#dateTables').DataTable({
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
        'info': '',
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
            "data":"data",
            "render":function(data,type,row,meta){

                return data.toFixed(2);
            }
        }
    ]
});


//实时能耗
var myChart = echarts.init(document.getElementById('energy-demand'));

// 指定图表的配置项和数据
option = {

    tooltip : {
        trigger: 'axis'
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            axisLabel :{
                interval:0
            },
            data : ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value} '
            }
        }
    ],
    series : [
        {
            name:'当前能耗',
            type:'line',
            data:[11, 11, 15, 13, 12, 13, 10],
            //itemStyle : {
            //    normal : {
            //        color:'#53f4db',
            //        lineStyle:{
            //            color:'#53f4db',
            //            width:3
            //        }
            //    }
            //},
            smooth:true
            //markLine : {
            //    data : [
            //        {type : 'average', name: '平均值'}
            //
            //    ]
            //}
        }
    ]
};

//能耗构成
var myChart1 = echarts.init(document.getElementById('energy-demand1'));

// 指定图表的配置项和数据
option1 = {
    title: {
        text: '总能耗 单位：吨标煤',
        textStyle: {
            fontSize: '14'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'总能耗',
            type:'pie',
            radius: ['20%', '80%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'inside',
                    textStyle: {
                        fontSize: '12'
                    }
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};

//面积指标
var myChart2 = echarts.init(document.getElementById('energy-demand2'));

// 指定图表的配置项和数据
option2 = {
    title: {
        text: '电 单位：kWh',
        textStyle: {
            fontSize: '14'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
        {
            name:'电耗分项',
            type:'pie',
            radius: ['20%', '80%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'inside',
                    textStyle: {
                        fontSize: '12'
                    }
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};

var myChart3 = echarts.init(document.getElementById('energy-demand3'));

// 指定图表的配置项和数据
option3 = {
    title: {
        text: '单\n位\n面\n积\n电\n耗',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前电耗',
            type: 'gauge',
            radius: '100%',
            min: 0,
            max:1,
            splitNumber: 5,
            data: [{value:5, name: 'kWh/㎡'}]
        }
    ]
};

var myChart31 = echarts.init(document.getElementById('energy-demand31'));

// 指定图表的配置项和数据
option31 = {
    title: {
        text: '单\n位\n面\n积\n水\n耗',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前水耗',
            type: 'gauge',
            radius: '100%',
            min: 0,
            max: 30,
            splitNumber: 5,
            data: [{value: 18, name: 'L/㎡'}]
        }
    ]
};

var myChart32 = echarts.init(document.getElementById('energy-demand32'));

// 指定图表的配置项和数据
option32 = {
    title: {
        text: '单\n位\n面\n积\n冷\n耗',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前冷耗',
            type: 'gauge',
            radius: '100%',
            min: 0,
            max: 30,
            splitNumber: 5,
            data: [{value: 0, name: 'MJ/㎡'}]
        }
    ]
};

var myChart33 = echarts.init(document.getElementById('energy-demand33'));

// 指定图表的配置项和数据
option33 = {
    title: {
        text: '单\n位\n面\n积\n热\n耗',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前耗冷',
            type: 'gauge',
            radius: '100%',
            min: 0,
            max: 30,
            splitNumber: 5,
            data: [{value: 0, name: 'MJ/㎡'}]
        }
    ]
};

//用能排名部分
var myChart4 = echarts.init(document.getElementById('energy-demand4'));

// 指定图表的配置项和数据
option4 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        top: 0,
        bottom: 20,
        right:20,
        left:100
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['灼伤大楼','转化医学研究院','儿童住院部','门诊和急诊','外科楼','内科楼']
    },
    series: [
        {
            name: '2011年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
        }
    ]
};

var myChart41 = echarts.init(document.getElementById('energy-demand41'));

// 指定图表的配置项和数据
option41 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        top: 10,
        bottom: 20,
        right:20,
        left:100
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['灼伤大楼','转化医学研究院','儿童住院部','门诊和急诊','外科楼','内科楼']
    },
    series: [
        {
            name: '2011年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
        }
    ]
};


//当窗口大小变化时，使图表大小跟着改变

window.onresize = function () {

    if(myChart ){
        myChart.resize();
        myChart1.resize();
        myChart2.resize();
        myChart3.resize();
        myChart31.resize();
        myChart32.resize();
        myChart33.resize();
        myChart4.resize();
        myChart41.resize();
    }
};

//初始化配置
myChart.setOption(option);
myChart1.setOption(option1);
myChart2.setOption(option2);
myChart3.setOption(option3);
myChart31.setOption(option31);
myChart32.setOption(option32);
myChart33.setOption(option33);
myChart33.setOption(option33);
myChart4.setOption(option4);
myChart41.setOption(option41);

$('.top-cut li a').on('click',function(){

    $(this).parents('ul').find('a').removeClass('onClicks');
    $(this).addClass('onClicks');
});

$('.top-choose-energy a').on('click',function(){

    $(this).parent('.top-choose-energy').find('a').removeClass('onClicks');
    $(this).addClass('onClicks');
});

//获取全部楼宇ID列表
var pointerIdArr = getPointersId();

//获取全部分户ID列表
var officeIdArr = getOfficesId();

getEnergyPanking();

//获取后台能耗排名数据

function getEnergyPanking(){

    //获取要展示的能耗类型
    var energyType = $('.energy-ranking .top-choose-energy .onClicks').attr('type');

    //获取需要展示的时间
     var date = $('.energy-ranking .top-cut .onClicks').html();

    //根据能耗类型获取分项ID
    var energyItemCode = getUnitID(energyType);

    //获取要传递的日期数组
    var dateArr = getPostDate(date);

    //开始日期
    var startDate = dateArr[0];

    //结束日期

    var endDate = dateArr[1];

    $.ajax({
        type: 'post',
        url: IP + "/EnergyItemDatas/GetTopPointerEcs",
        timeout: theTimes,
        data:{
            "startTime": startDate,
            "endTime": endDate,
            "itemCount": 6,
            "energyItemCode": energyItemCode,
            "pointerIDs": pointerIdArr
        },
        beforeSend: function () {
            myChart4.showLoading();
        },

        complete: function () {

        },
        success: function (data) {
            $('#theLoading').modal('hide');

            var dataArr0 = data[0].reverse();

            //重新给echarts图中添加数据

            var yArr = [];

            var sArr = [];

            $(dataArr0).each(function(i,o){

                yArr.push(o.itemName);

                sArr.push(o.ecData.toFixed(2));
            });

            option4.yAxis.data = yArr;

            option4.series[0].data = sArr;

            myChart4.setOption(option4);
            myChart4.hideLoading();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            myChart4.hideLoading();
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });

    $.ajax({
        type: 'post',
        url: IP + "/EnergyItemDatas/GetTopOfficeEcs",
        timeout: theTimes,
        data:{
            "startTime": startDate,
            "endTime": endDate,
            "itemCount": 6,
            "energyItemCode": energyItemCode,
            "officeIDs": officeIdArr
        },
        beforeSend: function () {
            myChart41.showLoading();
        },

        complete: function () {

        },
        success: function (data) {
            $('#theLoading').modal('hide');

            var dataArr0 = data[0].reverse();

            //重新给echarts图中添加数据

            var yArr = [];

            var sArr = [];

            $(dataArr0).each(function(i,o){

                yArr.push(o.itemName);

                sArr.push(o.ecData.toFixed(2));
            });

            option4.yAxis.data = yArr;

            option4.series[0].data = sArr;

            myChart41.setOption(option41);
            myChart41.hideLoading();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            myChart41.hideLoading();
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

getRealTimeData();

//获取后台实时能耗数据

function getRealTimeData(){

    //获取要展示的能耗类型
    var energyType = $('.real-time-energy .top-cut .onClicks').attr('type');

    //根据能耗类型获取分项ID
    var energyItemCode = getUnitID(energyType);

    //获取单位名称

    var unit = getUnitByType(energyType);

    $.ajax({
        type: 'post',
        url: IP + "/EnergyItemDatas/GetInsEnergyItemData",
        timeout: theTimes,
        data:{
            "energyItemCode": energyItemCode,
            "pointerIDs": pointerIdArr
        },
        beforeSend: function () {
            myChart.showLoading();
        },

        complete: function () {
            myChart.hideLoading();
        },
        success: function (data) {
            myChart.hideLoading();
            console.log(data);


            //改变单位
            $('.real-time-energy h3 span b').html(unit);

            $('.real-time-energy h4 span').html('('+unit+')');

            //清除之前数据
            option.series[0].data = [];

            //重新加入数据

            //数据
            var sArr = [];
            $(data.insMetaDatas).each(function(i,o){


                sArr.push(o.data);
            });

            for(var i=0; i< 24; i++){
                if(sArr.length < 24){
                    sArr.push('null')
                }
            }

            option.series[0].data = sArr;


            //重绘chart图
            myChart.setOption(option);

            //右侧统计数据进行刷新

            //日数据
            //左侧总能耗
            $('.real-time-energy .right-total-data .single-data').eq(0).find('.left-data p').html(data.dayEnergyItemData.currentEnergyData.toFixed(2));

            //右侧同比
            $('.real-time-energy .right-total-data .single-data').eq(0).find('.right-ratio p').eq(0).html((Math.abs(data.dayEnergyItemData.yearEnergyPercent) * 100).toFixed(1) + '%');

            if(data.dayEnergyItemData.yearEnergyPercent < 0){

                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(0).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(0).removeClass('fall-down')
            }

            //右侧环比
            $('.real-time-energy .right-total-data .single-data').eq(0).find('.right-ratio p').eq(2).html((Math.abs(data.dayEnergyItemData.chainEnergyPercent) * 100).toFixed(1) + '%');

            if(data.dayEnergyItemData.chainEnergyPercent < 0) {

                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(1).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(0).find('.top-percent').eq(0).removeClass('fall-down')
            }

            //月数据
            //左侧总能耗
            $('.real-time-energy .right-total-data .single-data').eq(1).find('.left-data p').html(data.monthEnergyItemData.currentEnergyData.toFixed(2));

            //右侧同比
            $('.real-time-energy .right-total-data .single-data').eq(1).find('.right-ratio p').eq(0).html((Math.abs(data.monthEnergyItemData.yearEnergyPercent) * 100).toFixed(1) + '%');

            if(data.monthEnergyItemData.yearEnergyPercent < 0){

                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(0).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(0).removeClass('fall-down')
            }

            //右侧环比
            $('.real-time-energy .right-total-data .single-data').eq(1).find('.right-ratio p').eq(2).html((Math.abs(data.monthEnergyItemData.chainEnergyPercent) * 100).toFixed(1) + '%');

            if(data.monthEnergyItemData.chainEnergyPercent < 0) {

                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(1).addClass('fall-down')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(1).find('.top-percent').eq(0).removeClass('fall-down')
            }

            //年数据
            //左侧总能耗
            $('.real-time-energy .right-total-data .single-data').eq(2).find('.left-data p').html(data.yearEnergyItemData.currentEnergyData.toFixed(2));

            //右侧环比
            $('.real-time-energy .right-total-data .single-data').eq(2).find('.right-ratio p').eq(0).html((Math.abs(data.yearEnergyItemData.chainEnergyPercent) * 100).toFixed(1) + '%');

            if(data.yearEnergyItemData.chainEnergyPercent < 0){

                $('.real-time-energy .right-total-data .single-data').eq(2).find('.top-percent').eq(0).addClass('fall-down1')
            }else{
                $('.real-time-energy .right-total-data .single-data').eq(2).find('.top-percent').eq(0).removeClass('fall-down1')
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            myChart.hideLoading();
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

//获取能耗构成数据
getEnergyConstitute();

function getEnergyConstitute(){

    //获取需要展示的时间
    var date = $('.energy-constitute .top-cut .onClicks').html();

    //获取要传递的日期数组
    var dateArr = getPostDate(date);

    //开始日期
    var startDate = dateArr[0];

    //结束日期

    var endDate = dateArr[1];

    //获取要传递的分项ID
    var postUnitID = getShownUnitID();


    $.ajax({
        type: 'post',
        url: IP + "/EnergyItemDatas/GetEnergyConstituteDatas",
        timeout: theTimes,
        data:{
            "energyItemCodes":postUnitID,
            "startTime": startDate,
            "endTime": endDate,
            "pointerIDs":pointerIdArr
        },
        beforeSend: function () {
            //$('#theLoading').modal('show');
            myChart1.showLoading();
        },
        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);


            //删除之前的数据
            for(var i=0; i<option.series.length; i++){

                option1.series[i].data = [];
            }
            
            //来源
            var sArr1 = [];

            $(data).each(function(i,o){
                //给表格获取数据

                var obj = {value : o.energyItemCoalValue.toFixed(2),name:o.energyItemName};

                sArr1.push(obj);

                //显示数据
                option1.series[0].data = sArr1;

            });

            //console.log(option.legend.data[0]);

            //重绘chart图
            myChart1.hideLoading();
            myChart1.setOption(option1);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            myChart1.hideLoading();
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });

    $.ajax({
        type: 'post',
        url: IP + "/EnergyItemDatas/getChildrenEnergyItemEcData",
        timeout: theTimes,
        data:{
            "energyItemIDs":'01',
            "startTime": startDate,
            "endTime": endDate,
            "pointerIDs":pointerIdArr
        },
        beforeSend: function () {
            //$('#theLoading').modal('show');
            myChart2.showLoading();
        },

        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');

            myChart2.hideLoading();
            console.log(data);


            //表格中的数据

            dataArrs = [];


            //删除之前的数据
            for(var i=0; i<option.series.length; i++){

                option2.series[i].data = [];
            }

            //来源
            var sArr1 = [];

            $(data).each(function(i,o){
                //给表格获取数据


                var obj = {value : o.ecData.toFixed(2),name:o.energyItemName};

                sArr1.push(obj);

                //显示数据

                option2.series[0].data = sArr1;


            });
            //console.log(option.legend.data[0]);

            //重绘chart图
            myChart2.hideLoading();
            myChart2.setOption(option2);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            myChart2.hideLoading();
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};


//获取面积指标数据

getAreaEnergyData();

function getAreaEnergyData(){

    //获取需要展示的时间
    var date = $('.area-energy-data .top-cut .onClicks').html();

    //获取要传递的日期数组
    var dateArr = getPostDate(date);

    //开始日期
    var startDate = dateArr[0];

    //结束日期

    var endDate = dateArr[1];

    //获取要传递的分项ID
    var postUnitID = getAllShownUnitID();

    $.ajax({
        type: 'post',
        url: IP + "/EnergyItemDatas/GetEneryAreaNormDatas",
        timeout: theTimes,
        data:{
            "energyItemCodes":postUnitID,
            "startTime": startDate,
            "endTime": endDate,
            "pointerIDs":pointerIdArr
        },
        beforeSend: function (xhr) {

            var access_token = sessionStorage.getItem('access_token');


            //    //发送ajax请求之前向http的head里面加入验证信息
            xhr.setRequestHeader('Authorization', 'Bearer ' + access_token + ''); // 请求发起前在头部附加token
            myChart3.showLoading();
            myChart31.showLoading();
            myChart32.showLoading();
            myChart33.showLoading();
        },
        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);

            ////删除之前的数据
            //option3.series[0].data = [];
            //option31.series[0].data = [];
            //option32.series[0].data = [];
            //option33.series[0].data = [];

            var sArr1 = [];

            $(data).each(function(i,o){

                //给表格获取数据
                if(o.energyItemCode == '01'){

                    option3.series[0].data[0].value = o.energyAreaValue.toFixed(3);

                    option3.series[0].max = getMaxEnergyData(date,o.energyItemCode);

                }else if(o.energyItemCode == '211'){

                    option31.series[0].data[0].value = o.energyAreaValue.toFixed(3);

                    option31.series[0].max = getMaxEnergyData(date,o.energyItemCode);


                }else if(o.energyItemCode == '511'){

                    option32.series[0].data[0].value = o.energyAreaValue.toFixed(3);

                    option32.series[0].max = getMaxEnergyData(date,o.energyItemCode);


                }else if(o.energyItemCode == '412'){

                    option33.series[0].data[0].value = o.energyAreaValue.toFixed(3);

                    option33.series[0].max = getMaxEnergyData(date,o.energyItemCode);


                }

            });

            //console.log(option.legend.data[0]);

            //重绘chart图
            myChart3.hideLoading();
            myChart3.setOption(option3);

            myChart31.hideLoading();
            myChart31.setOption(option31);

            myChart32.hideLoading();
            myChart32.setOption(option32);

            myChart33.hideLoading();
            myChart33.setOption(option33);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            myChart3.hideLoading();
            myChart31.hideLoading();
            myChart32.hideLoading();
            myChart33.hideLoading();

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

//报警信息
getAlarmMessage();

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
            "pointerIds": pointerIdArr,
            "excTypeInnderId": "",
            "energyType": ""
        },
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {



            _table = $("#dateTables").dataTable();

            var alermArr = [];

            for(var i=0;i<data.length;i++){
                alermArr.push(data[i]);
            };

            ajaxSuccess1(alermArr);


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

$('.ceshi').on('click',function(){

    // 将 id 为 content 的 div 渲染成 canvas
    html2canvas(document.getElementById("content"), {

        // 渲染完成时调用，获得 canvas
        onrendered: function(canvas) {

            // 从 canvas 提取图片数据
            var imgData = canvas.toDataURL('image/jpeg',1.0);

            var doc = new jsPDF("p", "mm", "a2");
            //                               |
            // |—————————————————————————————|
            // A0 841×1189
            // A1 594×841
            // A2 420×594
            // A3 297×420
            // A4 210×297
            // A5 148×210
            // A6 105×148
            // A7 74×105
            // A8 52×74
            // A9 37×52
            // A10 26×37
            //     |——|———————————————————————————|
            //                                 |——|——|
            //                                 |     |
            doc.addImage(imgData, 'JPEG', 0, 0,420,230);

            doc.save('content.pdf');
        }
    });
});
