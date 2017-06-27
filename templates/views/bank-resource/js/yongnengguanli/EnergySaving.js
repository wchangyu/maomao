/**
 * Created by admin on 2017/6/7.
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
        url: IP + "/EnergyQuery/GetEnergyNormItemQuery",
        timeout: theTimes,
        data:{
            isShowStandardCoal : 0
        },
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {

        },
        success: function (data) {

            console.log(data);
            typeArr = data;
            var html= '';
            for(var i=0; i<data.length;i++){
                html +=   '<option ids="'+data[i].energyTypeUnit+'" value="'+getUnitID(data[i].energyTypeID)+'" ids="'+data[i].energyTypeUnit+'">'+data[i].energyTypeName+'</option>'
            }

            $('#energy-type').html(html);

            //获取当前时间
            var year = parseInt(moment().year());

            var html1 = '';
            for(var i=-5; i<6; i++){
                var num = year + i;
                if(num == year){
                    html1 +=   '<option selected = "">'+num+'</option>'
                }else{
                    html1 +=   '<option >'+num+'</option>'
                }

            }

            $('#post-date').html(html1);
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
                    var theValue = '';
                    for(var i=0; i<data.length;i++){
                        html +=   '<option value="'+data[i].enterpriseID+'">'+data[i].eprName+'</option>'
                        if(data[i].defaultShowFlag == 1){

                            theValue = data[i].enterpriseID;
                        }
                    }

                    $('#obj-type').html(html);
                    $('#obj-type').val(theValue);
                    //获取chart图中的数据

                    getMainData();

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
        data:['定额量','使用量','偏差']
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
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value} °C'
            }
        },
        {   type: 'value',
            show: true,
            axisLabel : {
                formatter: '{value} %'
            }
        }
    ],
    series : [
        {
            name:'定额量',
            type:'bar',
            data:[11, 11, 15, 13, 12, 13, 10],
            itemStyle : {
                normal : {
                    color:'#52d0ef',
                    lineStyle:{
                        color:'#53f4db',
                        width:3
                    }
                }
            },

        },
        {
            name:'使用量',
            type:'bar',
            itemStyle : {
                normal : {
                    color:'darkOrange',
                    lineStyle:{
                        color:'white' +
                        '',
                        width:1
                    }
                }
            },
            data:[11, 11, 15, 13, 12, 13, 10]

        },
        {
            name:'偏差',
            type:'line',
            showAllSymbol: true,
            yAxisIndex: 1,
            itemStyle : {
                normal : {
                    color:'darkOrange',
                    lineStyle:{
                        color:'red' +
                        '',
                        width:1
                    }
                }
            },
            data:[11, 11, 15, 13, 12, 13, 10]


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

    var unit;

    unit = $('#energy-type').find('option:selected').attr('ids');

    $(typeArr).each(function(i,o){

        if(energyItemID == o.energyTypeID){
            unit = o.energyTypeUnit;

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

    var showTime = postDate;

    $.ajax({
        type: 'post',
        url: IP + "/EnergyManage/GetBankDingEAssess",
        timeout: theTimes,
        data:{
            "f_EnergyItemId": energyItemID,
            "f_Year": postDate,
            "enterpriseID": objID,
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
            $('.show-title3').html(showTime);


            var dataArr = data.bankDingEDatas;


            var xArr = [];
            //定额量
            var sArr = [];
            //使用量
            var tArr = [];
            //偏差
            var pArr = [];

            $(dataArr).each(function(i,o){

                xArr.push(o.f_Month + '月');
                sArr.push((o.dingEData).toFixed(2));
                tArr.push((o.energyData).toFixed(2));
                pArr.push(((o.deviationData) * 100).toFixed(2))
            });

            option.series[0].data = sArr;
            option.series[1].data = tArr;
            option.series[2].data = pArr;

            option.xAxis[0].data = xArr;

            option.yAxis[0].axisLabel.formatter = '{value}' + unit + '';

            ////添加参考值

            console.log(option.legend.data[0]);


            //重绘chart图
            myChart.hideLoading();
            myChart.setOption(option);

            //右侧显示数据的改变

            $('.header-right-lists span').html(unit);


            $('#consumption-value-number').html(data.sumEnergyData.toFixed(2));
            $('.the-cumulative-power-unit').html(unit);

            $('.compared-with-last-time label').html(data.sumDingEData.toFixed(2));

            var percent = (data.energyDingeScale.toFixed(4)) * 100;
            $('.rights-up-value').html(Math.abs(percent).toFixed(2) + '%');

            $('.quota-year b').html(data.yearDingE.toFixed(2) + unit);

            $('.quota-year1 b').html(data.yearEnergyData.toFixed(2) + unit);

            if(data.energyDingeScale < 0 ){
                $('.rights-up').css({
                    "background-image": 'url(../bank-resource/img/up.png)'
                })
            }else{
                $('.rights-up').css({
                    "background-image": 'url(../bank-resource/img/up2.png)'
                })
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

    //if(CompareDate(txt2,nowDate) == true){
    //    myAlter('结束日期不能大于当前日期');
    //    getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));
    //
    //    return false;
    //};


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