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

        getMainData();

    })



});
//存放查询对象
var pointArr = [];

//存放查询指标
var typeArr = [];
//获取能耗查询页面初始数据
function getStartData(){
    //获取查询指标
    $.ajax({
        type: 'get',
        url: IP + "/EnergyQuery/GetShowEneryNormItem",
        timeout: theTimes,
        beforeSend: function () {

        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);
            typeArr = data;
            var html= '';
            for(var i=0; i<data.length;i++){
                html +=   '<option value="'+data[i].energyItemID+'">'+data[i].energyItemName+'</option>'
            }

            $('#energy-type').html(html);

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
                    var html= '';
                    for(var i=0; i<data.length;i++){
                        html +=   '<option value="'+data[i].enterpriseID+'">'+data[i].eprName+'</option>'
                    }

                    $('#obj-type').html(html);
                    //获取chart图中的数据

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

window.onresize = function () {
    if(myChart ){
        myChart.resize();

    }
};
//获取页面初始数据
function getMainData(){


    var energyItemID = $('#energy-type').val();

    var objID = $('#obj-type').val();

    var postArr = [];

    var dateSign = '';

    var startDate;

    var endDate;

    var unit;

    var unitName;

    $(typeArr).each(function(i,o){

        if(energyItemID == o.f_EnergyItemID){
            unit = getUnit(o.f_EnergyItemType);

            unitName = getUnitName(o.f_EnergyItemType);
            return false;
        }

    });



    $(pointArr).each(function(i,o){

        if(objID == o.enterpriseID){
            postArr = o.pointerIDs;

            return false;
        }

    });

    var title1 = $('#obj-type').find('option:selected').text();

    var title2 = $('#energy-type').find('option:selected').text();



    var postDate = $('#post-date').val();

    if(postDate == '今天'){

        dateSign = '小时';

        startDate = getNewDate();

        console.log(startDate);

        var now = new Date();

        var tomorrow = new Date(now.setDate(now.getDate()+1));

        endDate = getDate(tomorrow);

    }else if(postDate == '昨天'){

        dateSign = '小时';

        endDate = getNewDate();


        var now = new Date();

        var yesterday = new Date(now.setDate(now.getDate()-1));

        startDate = getDate(yesterday);

        console.log(startDate);

    }else if(postDate == '过去7天'){

        dateSign = '日';

        endDate = getNewDate();


        var now = new Date();

        var yesterday = new Date(now.setDate(now.getDate()-7));

        startDate = getDate(yesterday);

        console.log(startDate);
    }else if(postDate == '过去30天'){

        dateSign = '日';

        endDate = getNewDate();


        var now = new Date();

        var yesterday = new Date(now.setDate(now.getDate()-30));

        startDate = getDate(yesterday);

        console.log(startDate);
    }else if(postDate == '本月'){

        dateSign = '日';

        endDate = getNewDate();


        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;

        startDate = year + '-' + month + '-' + '1';

        console.log(startDate);
    }else if(postDate == '上月'){

        dateSign = '日';

        startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

        console.log(startDate,endDate);
    }else if(postDate == '自定义'){

        dateSign = '日';

        startDate = $('.show-date').val().split('——')[0];
        endDate = $('.show-date').val().split('——')[1];

        console.log(startDate,endDate);
    }

    console.log(postArr);
    $.ajax({
        type: 'post',
        url: IP + "/EnergyQuery/GetEnergyQueryTotalData",
        timeout: theTimes,
        data:{
            "energyItemID":energyItemID,
            "dateType": '日',
            "startTime": '2015-5-1',
            "endTime": '2015-6-1',
            "pointerIDs":postArr
        },
        beforeSend: function () {
            //$('#theLoading').modal('show');
            myChart.showLoading();
        },

        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);

            if(data == null){
                myChart.hideLoading();
                myAlter('无数据!');
                return false;
            }
            $('.show-title1').html(title1);
            $('.show-title2').html(title2);
            $('.show-title3').html(startDate + '——' + endDate);

            var dataArr = data.ecMetaDatas;

            var xArr = [];
            var sArr = [];
            var tArr = [];

            console.log(title2);
            tArr.push(title2);
            $(dataArr).each(function(i,o){

                xArr.push(o.dataDate.split('T')[0]);
                sArr.push(o.data.toFixed(2));
            });

            option.series[0].data = sArr;

            option.legend.data[0] = title2;
            option.series[0].name = title2;
            option.xAxis[0].data = xArr;
            option.yAxis[0].axisLabel.formatter = '{value}' + unit + '';

            console.log(option.legend.data[0]);


            //重绘chart图
            myChart.hideLoading();
            myChart.setOption(option);

            //右侧显示数据的改变
            $('.header-right-lists span').html(unit);
            $('.total-power-consumption').html('累计用' + unitName + '');

            $('#consumption-value-number').html(data.sumMetaData.toFixed(2));
            $('.the-cumulative-power-unit').html(unit);

            $('.compared-with-last-time label').html(data.chainEnergyData.toFixed(2));

            var percent = (data.chainEnergyPercent.toFixed(4)) * 100;
            $('.rights-up-value').html(Math.abs(percent) + '%');

            if(data.chainEnergyPercent < 0 ){
                $('.rights-up').css({
                    "background-image": 'url(../resource/img/up.png)'
                })
            }else{
                $('.rights-up').css({
                    "background-image": 'url(../resource/img/up2.png)'
                })
            }

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

    $('.datatimeblock').val('今天');

});
$('#choose-date .close').on('click',function(){

    $('.datatimeblock').val('今天');

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


    if(CompareDate(txt2,txt1) == false){
        myAlter('结束日期必须大于开始日期');
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