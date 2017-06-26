/**
 * Created by admin on 2017/5/27.
 */
/**
 * Created by admin on 2017/5/24.
 */
/**
 * Created by admin on 2017/5/22.
 */

$(document).ready(function() {

    // 基于准备好的dom，初始化echarts实例
    console.log('ok');


    //点击查询按钮时，获取后台数据
    $('.condition-query .top-refer').on('click',function(){
        //获取查询条件
        var type = $('.condition-query li').eq(0).find('select').val();
        var time = $('.condition-query li').eq(1).find('select').val();
        var theArea = $('.condition-query li').eq(2).find('select').val();

        //$('.show-title1').html(theArea);
        //$('.show-title2').html(type);
        //$('.show-title3').html(time);
        var num = $('#energy-type').val();
        if(num == 1){
            getMainData();
        }else if(num == 2){
            getMainData1();
        }



    });

    //点击右上角注释图标
    $('.show-header-right .right-text').on('click',function(){

        $('.text-content').slideToggle('fast');
    });

});
//存放选项卡中的数据
var theDataArr = [];

//存放获取到的显示信息

var getObj = {};
//存放查询对象
var pointArr = [];

//存放查询指标
var typeArr = [];
//获取支行楼宇列表
function getBuild(){
    $.ajax({
        type: 'get',
        url: IP + "/EnergyQuery/GetPointerByEnterpriseID",
        timeout: theTimes,
        data:{
            userID : _userIdName,
            enterpriseID : EnterpriseID
        },
        beforeSend: function () {

        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);
            $(data).each(function(i,o){
                pointArr.push(o.pointerID);
            });
            console.log(pointArr);
            getMainData();

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
getBuild();

var myChart = echarts.init(document.getElementById('energy-demand'));

// 指定图表的配置项和数据
option = {

    tooltip : {
        trigger: 'axis'
    },
    legend: {
        show:true,
        data:['最高气温']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value} °C'
            }
        }
    ],
    series : [
        {
            name:'最高气温',
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
            smooth:true,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ],
                itemStyle : {
                    normal:{
                        color:'#019cdf'
                    }
                },
                label:{
                    normal:{
                        textStyle:{
                            color:'#d02268'
                        }
                    }
                }
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}


                ]

            }
        }
    ]
};

var myChart1 = echarts.init(document.getElementById('energy-demand1'));
option1 = {
    title : {
        text: '冷站能耗分项'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
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


//页面大小改变时，chart图自适应
window.onresize = function () {
    if(myChart ){
        myChart.resize();

    }
};
//获取页面初始数据
function getMainData(){



    var postEnergy = {};

    var dateSign = '';

    var startDate;

    var endDate;

    var unit = 'kW/kW';



    var postDate = $('#post-date').val();

    var showTime = postDate;

    var selectDate;

    var dateArr = getPostDate(postDate);

    startDate = dateArr[1];

    endDate = dateArr[2];

    dateSign = dateArr[3];

    showTime = dateArr[4];

    selectDate = dateArr[5];

    console.log(dateArr);

    $.ajax({
        type: 'post',
        url: IP + "/EnergyQuery/GetAirColdCOPBranchData",
        timeout: theTimes,
        data:{
            "dateType": dateSign,
            "startTime": startDate,
            "endTime": endDate,
            "selectDateType": selectDate,
            "pointerIDs":pointArr,
            "enterpriseID": EnterpriseID
        },
        beforeSend: function () {
            //$('#theLoading').modal('show');
            myChart.showLoading();
            myChart1.showLoading();
        },

        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);


            if(data == null){
                myChart.hideLoading();
                myChart1.hideLoading();
                myAlter('无数据!');
                return false;
            }
            getObj = data;

            $('.show-title1').html('');
            $('.show-title2').html('中央空调能效');
            $('.show-title3').html(showTime);
            $('#energy-demand2 .the-title').html('冷站节能潜力分析图');

            //上方折线图

            var dataArr = data.ecMetaDatas;


            var xArr = [];
            var sArr = [];


            $(dataArr).each(function(i,o){

                xArr.push(o.dataDate.split('T')[0]);
                sArr.push((o.data).toFixed(2));

            });



            option.series[0].data = sArr;

            option.legend.data[0] = '中央空调能效';
            option.series[0].name = '中央空调能效';
            option.xAxis[0].data = xArr;

            option.yAxis[0].axisLabel.formatter = '{value}' + unit + '';



            console.log(option.legend.data[0]);

            //下方环形图

            var sArr1 = [];

            var obj1 = {value:data.refrigeratorData.toFixed(2), name:'冷机'};
            var obj2 =  {value:data.refrigeratorPumpData.toFixed(2), name:'冷冻泵'};
            var obj3 =  {value:data.coolingPumpData.toFixed(2), name:'冷却泵'};
            var obj4 =  {value:data.coolingTowerData.toFixed(2), name:'冷却塔'};

            sArr1 = [obj1,obj2,obj3,obj4];

            option1.series[0].data = sArr1;
            option1.title.text = '冷站能耗分项图';

            //重绘chart图
            myChart.hideLoading();
            myChart.setOption(option);

            myChart1.hideLoading();
            myChart1.setOption(option1);

            //右侧注释不可见
            $('.text-content').css({
                display:'none'
            });
            $('.right-text').css({
                display:'none'
            });

            //右侧显示数据的改变
            $('.header-right-lists span').html(unit);


            $('#consumption-value-number').html(data.avgCOPData.toFixed(2));
            $('.the-cumulative-power-unit').html(unit);

            $('.compared-with-last-time label').html(data.chainCOPData.toFixed(2));

            var percent = (data.chainCOPPercent.toFixed(4)) * 100;
            $('.rights-up-value').html(Math.abs(percent).toFixed(2) + '%');

            $('.province-rank b').html(data.coldCOPRanking);

            if(data.chainCOPPercent < 0 ){
                $('.rights-up').css({
                    "background-image": 'url(../bank-branch-resource/img/up.png)'
                })
            }else{
                $('.rights-up').css({
                    "background-image": 'url(../bank-branch-resource/img/up2.png)'
                })
            }

            //下方潜力分析图
            $('#energy-demand2 .ruler-box h3 b').html((data.savingPotential.toFixed(4)) * 100 + '%');

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

            if(data.avgCOPData> 7 || data.avgCOPData < 0){
                myAlter('本数据错误');
            }else{
                var num1 =700 -(data.avgCOPData * 100)-78;
                //var num1 =700 -(5 * 100)-78;
                console.log(num1);
                $('#energy-demand2 .sign0').css({
                    left:num1+ 'px'
                });
            }

            //上方数据切换
            var html ="  <li>" +
                "     <a href=\"javascript:;\" class=\"onClick\">能耗曲线</a>" +
                " </li>" +
                " <li>" +
                "     <a href=\"javascript:;\">冷机电耗曲线</a>" +
                " </li>" +
                " <li>" +
                "     <a href=\"javascript:;\">冷冻泵电耗曲线</a>" +
                " </li>" +
                " <li>" +
                "     <a href=\"javascript:;\">冷却泵电耗曲线</a>" +
                " </li>" +
                " <li>" +
                "     <a href=\"javascript:;\">冷却塔电耗曲线</a>" +
                "</li>";

            $('.left-cut').html(html);

            changeData();

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
};

//信息机房数据展示
function getMainData1(){

    var postEnergy = {};

    var dateSign = '';

    var startDate;

    var endDate;

    var unit = 'kW/kW';



    var postDate = $('#post-date').val();

    var showTime = postDate;

    var selectDate;

    var dateArr = getPostDate(postDate);

    startDate = dateArr[1];

    endDate = dateArr[2];

    dateSign = dateArr[3];

    showTime = dateArr[4];

    selectDate = dateArr[5];

    console.log(dateArr);

    $.ajax({
        type: 'post',
        url: IP + "/EnergyQuery/GetComputerRoomPUEBranchData",
        timeout: theTimes,
        data:{
            "dateType": dateSign,
            "startTime": startDate,
            "endTime": endDate,
            "selectDateType": selectDate,
            "pointerIDs":pointArr,
            "enterpriseID": EnterpriseID
        },
        beforeSend: function () {
            //$('#theLoading').modal('show');
            myChart.showLoading();
            myChart1.showLoading();
        },

        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);


            if(data == null){
                myChart.hideLoading();
                myChart1.hideLoading();
                myAlter('无数据!');
                return false;
            }
            getObj = data;

            $('.show-title1').html('');
            $('.show-title2').html('信息机房能效');
            $('.show-title3').html(showTime);
            $('#energy-demand2 .the-title').html('数据中心节能潜力分析图');

            //上方折线图

            var dataArr = data.ecMetaDatas;


            var xArr = [];
            var sArr = [];


            $(dataArr).each(function(i,o){

                xArr.push(o.dataDate.split('T')[0]);
                sArr.push((o.data).toFixed(2));

            });



            option.series[0].data = sArr;

            option.legend.data[0] = '信息机房能效';
            option.series[0].name = '信息机房能效';
            option.xAxis[0].data = xArr;

            option.yAxis[0].axisLabel.formatter = '{value}' + unit + '';



            console.log(option.legend.data[0]);

            //下方环形图

            var sArr1 = [];

            var obj1 = {value:data.precisionAirData.toFixed(2), name:'精密空调'};
            var obj2 =  {value:data.itDeviceData.toFixed(2), name:'IT设备'};


            sArr1 = [obj1,obj2];

            option1.series[0].data = sArr1;
            option1.title.text = '数据中心电能耗分项图';

            //重绘chart图
            myChart.hideLoading();
            myChart.setOption(option);

            myChart1.hideLoading();
            myChart1.setOption(option1);

            //注释说明
            $('.text-content').html(data.pueHelpInfo);

            $('.right-text').css({
                display:'block'
            });

            //右侧显示数据的改变
            $('.header-right-lists span').html(unit);


            $('#consumption-value-number').html(data.avgPUEData.toFixed(2));
            $('.the-cumulative-power-unit').html(unit);

            $('.compared-with-last-time label').html(data.chainPUEData.toFixed(2));

            var percent = (data.chainPUEPercent.toFixed(4)) * 100;
            $('.rights-up-value').html(Math.abs(percent).toFixed(2) + '%');

            $('.province-rank b').html(data.coldPUERanking);

            if(data.chainPUEPercent < 0 ){
                $('.rights-up').css({
                    "background-image": 'url(../bank-branch-resource/img/up.png)'
                })
            }else{
                $('.rights-up').css({
                    "background-image": 'url(../bank-branch-resource/img/up2.png)'
                })
            }

            //下方潜力分析图
            $('#energy-demand2 .ruler-box h3 b').html((data.savingPotential.toFixed(4)) * 100 + '%');

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

            //上方数据切换
            var html ="  <li>" +
                "     <a href=\"javascript:;\" class=\"onClick\">能效曲线</a>" +
                " </li>" +
                " <li>" +
                "     <a href=\"javascript:;\">精密空调电耗曲线</a>" +
                " </li>" +
                " <li>" +
                "     <a href=\"javascript:;\">IT设备电耗曲线</a>" +
                " </li>";

            $('.left-cut').html(html);

            changeData();

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
};

//点击上方按钮 切换显示内容
function changeShowData(string){

    theDataArr = [];

    var unit = 'kW/kW';

    if(string == '能耗曲线'){
        theDataArr = getObj.ecMetaDatas;
    }else if(string == '冷机电耗曲线'){
        theDataArr = getObj.refrigeratorMetaDatas;
    }else if(string == '冷冻泵电耗曲线'){
        theDataArr = getObj.refrigeratorPumpMetaDatas;
    }else if(string == '冷却泵电耗曲线'){
        theDataArr = getObj.coolingPumpMetaDatas;
    }else if(string == '冷却塔电耗曲线'){
        theDataArr = getObj.coolingTowerMetaDatas;
    }else if(string == '精密空调电耗曲线'){
        theDataArr = getObj.precisionAirMetaDatas;
    }else if(string == 'IT设备电耗曲线'){
        theDataArr = getObj.itDeviceMetaDatas;
    }

    if(theDataArr.length == 0){
        myAlter('无数据');
        return false;
    }

    var xArr = [];
    var sArr = [];


    $(theDataArr).each(function(i,o){

        xArr.push(o.dataDate.split('T')[0]);
        sArr.push((o.data).toFixed(2));

    });



    option.series[0].data = sArr;

    option.legend.data[0] = string;
    option.series[0].name = string;
    option.xAxis[0].data = xArr;

    option.yAxis[0].axisLabel.formatter = '{value}' + unit + '';


    //重绘chart图
    myChart.hideLoading();
    myChart.setOption(option);

    return true;

}

//给上方切换按钮绑定事件
function changeData(){
    $('.left-cut li a').off('click');

    $('.left-cut li a').on('click',function(){




        var string = $(this).html();

        changeShowData(string);

        if(changeShowData(string) != false){
            $('.left-cut li a').removeClass('onClick');

            $(this).addClass('onClick');
        }


    });
}


//自定义时间时
$('.datatimeblock').on('change',function(){

    $('.show-date').css({
        display:'none'
    });


    if($(this).val() == '自定义'){
        $('#choose-date').modal('show');
        $('#choose-date input').val('');
    }


});
//关闭时间弹窗时
$('#choose-date .btn-default').on('click',function(){

    $('.datatimeblock').val('本月');

});
$('#choose-date .close').on('click',function(){

    $('.datatimeblock').val('本月');

});
//选定时间后
$('#choose-date .btn-primary').on('click',function(){

    if(!checkedNull('#choose-date')){
        return false;
    }
    var txt1 = $('#choose-date .add-input').eq(0).val();
    var txt2 = $('#choose-date .add-input').eq(1).val();

    var nowDate = getNewDate();

    if(CompareDate(txt2,nowDate) == true){
        myAlter('结束日期不能大于当前日期');
        getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));

        return false;
    };


    if(CompareDate(txt1,txt2) == true){
        myAlter('结束日期不能小于开始日期');
        getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));

        return false;
    };

    var date = txt1 + '——' + txt2;

    console.log(date);

    $('.show-date').css({
        display:'inline-block'
    });

    $('.show-date').val(date);

    $('#choose-date').modal('hide');

});

$('.show-date').on('focus',function(){

    $('#choose-date').modal('show');
    $('#choose-date input').val('');
});