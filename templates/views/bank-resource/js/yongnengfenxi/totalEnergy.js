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

//存放查询类型
var typeArr = [];
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
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
    },
    series: [
        {
            name:'访问来源',
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
            ]
        },
        {
            name:'访问来源',
            type:'pie',
            radius: ['40%', '55%'],

            data:[
                {value:335, name:'直达'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1048, name:'百度'},
                {value:251, name:'谷歌'},
                {value:147, name:'必应'},
                {value:102, name:'其他'}
            ]
        }
    ]
};
myChart.setOption(option);

window.onresize = function () {
    if(myChart ){
        myChart.resize();

    }
};
//获取页面初始数据
function getMainData(){


    var objID = $('#obj-type').val();

    var postArr = [];

    var dateSign = '';

    var startDate;

    var endDate;

    var unit = 'kWh';

    var unitName;



    $(pointArr).each(function(i,o){

        if(objID == o.enterpriseID){
            postArr = o.pointerIDs;

            return false;
        }

    });

    var title1 = $('.condition-query li').eq(0).find('option:selected').text();

    var title2 = $('.condition-query li').eq(1).find('option:selected').text();


    var postDate = $('#post-date').val();

    var showTime = postDate;

    if(postDate == '本月'){

        dateSign = '日';

        endDate = moment().add(1, 'day').format('YYYY-MM-DD');

        startDate = moment().startOf('month').format('YYYY-MM-DD');

        console.log(startDate);
    }else if(postDate == '上月'){

        dateSign = '日';

        startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        endDate = moment().startOf('month').format('YYYY-MM-DD');

        console.log(startDate,endDate);
    }else if(postDate == '本年'){
        dateSign = '月';

        endDate = moment().add(1, 'day').format('YYYY-MM-DD');



        startDate = moment().startOf('year').format('YYYY-MM-DD');

        console.log(startDate,endDate);
    }else if(postDate == '上年'){
        dateSign = '月';


        startDate = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD');

        endDate =  moment().startOf('year').format('YYYY-MM-DD');


    }else if(postDate == '自定义'){

        dateSign = '月';

        startDate = $('.show-date').val().split('——')[0] + '-1';

        var string =  $('.show-date').val().split('——')[1] + '-1';

        endDate =  moment(string).add(1, 'month').startOf('month').format('YYYY-MM-DD');


        console.log(startDate,endDate);
    }

    console.log(postArr);
    $.ajax({
        type: 'post',
        url: IP + "/EnergyQuery/GetTotalEnergyReturnData",
        timeout: theTimes,
        data:{
            "energyItemType":'01',
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

            return false;
            if(data == null){
                myChart.hideLoading();
                myAlter('无数据!');
                return false;
            }
            $('.show-title1').html(title1);

            $('.show-title2').html('用电分项');

            $('.show-title3').html(showTime );

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