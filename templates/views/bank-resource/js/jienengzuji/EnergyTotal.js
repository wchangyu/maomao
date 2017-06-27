/**
 * Created by admin on 2017/6/21.
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


        //$('.show-title1').html(theArea);
        //$('.show-title2').html(type);
        //$('.show-title3').html(time);

        getMainData();

    });



});

//存放列表中的数据
dataArrs = [];
dataArrs1 = [];
//存放查询对象
var pointArr = [];

//存放查询类型
var typeArr = [];
//获取能耗查询页面初始数据
function getStartData(){


    //获取查询对象

    $.ajax({
        type: 'get',
        url: IP + "/EnergySavingTrack/GetShowEneryItemByQuery",
        timeout: theTimes,
        data:{
            isShowStandardCoal : 1
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
            typeArr = data;

            var html= '';
            for(var i=0; i<data.length;i++){

                var txt = getUnitNameByID(data[i].f_EnergyItemID);
                if(!txt){
                    txt = data[i].f_EnergyItemName;
                }
                html +=   '<option equrate="'+data[i].equRate+'" value="'+data[i].f_EnergyItemID+'">'+txt+'</option>';
            }

            $('#energy-type').html(html);

            var date1 = moment().subtract(1,'month').startOf('month').format('YYYY-MM-DD');

            var date2 = moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD');

            $('.condition-query li').eq(1).find('input').eq(0).val(date1);

            $('.condition-query li').eq(1).find('input').eq(1).val(date2);

            $('.condition-query li').eq(2).find('input').eq(0).val(moment(date1).subtract(1,'year').format('YYYY-MM-DD'));

            $('.condition-query li').eq(2).find('input').eq(1).val(moment(date2).subtract(1,'year').format('YYYY-MM-DD'));

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



};
getStartData();

var myChart = echarts.init(document.getElementById('energy-demand'));
option = {
    title : {
        text: '四川分行总'
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
            radius: ['38%', '70%'],
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

var myChart1 = echarts.init(document.getElementById('energy-demand1'));
// 指定图表的配置项和数据
option1 = {
    title : {
        text: '各支行'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        show:true,
        data:['统计能耗','基期能耗','变化率']
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
            name:'统计能耗',
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
            name:'基期能耗',
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
            name:'变化率',
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
        myChart1.resize();
    }
};
//获取页面初始数据
function getMainData(){


    var energyID = $('#energy-type').val();

    var equrate =  $('.condition-query li').eq(0).find('option:selected').attr('equrate')

    var baseStartDate = $('.condition-query li').eq(2).find('input').eq(0).val();

    var baseEndDate = $('.condition-query li').eq(2).find('input').eq(1).val();

    baseEndDate = moment(baseEndDate).add(1,'day').format('YYYY-MM-DD');

    var qiQiStartDate = $('.condition-query li').eq(1).find('input').eq(0).val();

    var qiQiEndDate = $('.condition-query li').eq(1).find('input').eq(1).val();

    qiQiEndDate = moment(qiQiEndDate).add(1,'day').format('YYYY-MM-DD');

    var unit = 'kWh';

   if(!CompareDate(qiQiEndDate,qiQiStartDate)){

       myAlter('统计时段中结束日期必须大于开始日期');

       getFocus1($('.condition-query li').eq(1).find('input').eq(1));

       return false;
   };

    if(!CompareDate(baseEndDate,baseStartDate)){

        myAlter('基期时段中结束日期必须大于开始日期');

        getFocus1($('.condition-query li').eq(2).find('input').eq(1));

        return false;
    };

    unit = getUnitByID(energyID);

    if(!unit){
        unit = 'kWh'
    }

    var title1 = $('.condition-query li').eq(0).find('option:selected').text();

    $.ajax({
        type: 'post',
        url: IP + "/EnergySavingTrack/GetEnergyStatisticsBaseData",
        timeout: theTimes,
        data:{
            "energyItemID": energyID,
            "equRate": equrate,
            "baseStartDate": baseStartDate,
            "baseEndDate": baseEndDate,
            "qiQiStartDate": qiQiStartDate,
            "qiQiEndDate": qiQiEndDate,
            "userID": _userIdName
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
            $('.show-title1').html(title1);

            $('.show-title2').html('统计时段: ' + qiQiStartDate + '——' + qiQiEndDate + '');

            $('.show-title3').html('基期时段: ' + baseStartDate + '——' + baseEndDate + '' );

            //上方环形图
            option.series[0].data = [
                {value:data.baseSumEnergyData.toFixed(2), name:'基期能耗'},
                {value:data.qiQiSumEnergyData.toFixed(2), name:'统计能耗'}
            ];

            //下方柱状图
            var dataArr = getArr(data.energyStatisticsDatas);
            //存放X轴
            var xArr = [];
            //存放起讫数据
            var sArr1 = [];
            //存放基期数据数据
            var sArr2 = [];
            //存放变化率数据
            var sArr3 = [];

            $(dataArr).each(function(i,o){

                xArr.push(o.enterpriseName);

                sArr1.push(o.qiQiEnergyData.toFixed(1));

                sArr2.push(o.baseEnergyData.toFixed(1));

                sArr3.push((o.chanagePercent * 100).toFixed(1));

            });

            option1.series[0].data = sArr1;

            option1.series[1].data = sArr2;

            option1.series[2].data = sArr3;

            option1.xAxis[0].data = xArr;

            option1.yAxis[0].axisLabel.formatter = '{value}' + unit;

            console.log(unit);

            //重绘chart图
            myChart.hideLoading();
            myChart.setOption(option);

            myChart1.hideLoading();
            myChart1.setOption(option1);

            //右侧数据分析

            if(equrate == 0){
                $('.equalTree').css({
                    display:'none'
                });

                $('.rheader-content-rights').css({
                    width:'280px'
                })
            }else{
                $('.equalTree').css({
                    display:'block'
                });

                $('.rheader-content-rights').css({
                    width:'466px'
                })
            }

            $('#consumption-value-number').html(data.savingData.toFixed(1));

            $('.equalTree p').eq(1).find('b').html(data.cO2Data.toFixed(1));

            $('.equalTree p').eq(2).find('b').html(data.sO2Data.toFixed(1));

            $('.equalTree p').eq(3).find('b').html(data.nOxData.toFixed(1));

            $('.treeCount b').html(data.treePlanting);

            $('.the-cumulative-power-unit').html(unit);

            $('.header-right-lists span').html(unit);

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

//统计时段变化时，基期时段默认变化
function changeDate(){

    for(var i=0; i<$('.condition-query li').eq(1).find('input').length; i++){
        (function (i){
            $('.condition-query li').eq(1).find('input').eq(i).on('change',function(){
                var val = $(this).val();
                console.log(val);

               var date =  moment(val).subtract(1,'years').format('YYYY-MM-DD');
                console.log(date);

                $('.condition-query li').eq(2).find('input').eq(i).val(date);
            });
        })(i)
    }
};
changeDate();

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