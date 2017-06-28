/**
 * Created by admin on 2017/5/26.
 */
/**
 * Created by admin on 2017/5/22.
 */

$(document).ready(function() {

    // 基于准备好的dom，初始化echarts实例
    //console.log('ok');


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
            //console.log(data);
            $(data).each(function(i,o){
                pointArr.push(o.pointerID);
            });
            //console.log(pointArr);
            getStartData();

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
getBuild();

//获取能耗查询页面初始数据
function getStartData(){
    //获取查询类别
    $.ajax({
        type: 'get',
        url: IP + "/EnergyQuery/GetDayNightEnergyTypeQuery",
        timeout: theTimes,
        beforeSend: function () {

        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            //console.log(data);
            typeArr = data;
            var html= '';
            for(var i=0; i<data.length;i++){
                html +=   '<option value="'+data[i].f_EnergyItemID+'">'+data[i].f_EnergyItemName+'</option>'
            }

            $('#energy-type').html(html);

            getMainData();

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

var myChart = echarts.init(document.getElementById('energy-demand'));

// 指定图表的配置项和数据
option = {

    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        show:true,
        data:['最高气温',{name:'参考值'}]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
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

var myChart1 = echarts.init(document.getElementById('energy-demand1'));

option1 = {
    title : {
        text: '工作日',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['昼','夜']
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'昼'},
                {value:310, name:'夜'}
            ],
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            itemStyle: {
                normal: {
                    color: function(params) {

                        var colorList = [
                            '#9dc541','#afc8de'
                        ];
                        return colorList[params.dataIndex]
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

var myChart2 = echarts.init(document.getElementById('energy-demand2'));

option2 = {
    title : {
        text: '休息日',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['昼','夜']
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'昼'},
                {value:310, name:'夜'}
            ],
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            itemStyle: {
                normal: {
                    color: function(params) {

                        var colorList = [
                            '#9dc541','#afc8de'
                        ];
                        return colorList[params.dataIndex]
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

window.onresize = function () {
    if(myChart ){
        myChart.resize();

    }
};
//获取页面初始数据
function getMainData(){


    var energyItemID = $('#energy-type').val();

    var objID = $('#obj-type').val();

    var postArr = pointArr;

    var dateSign = '';

    var startDate;

    var endDate;

    var unit;

    var unitName;

    var startWork;

    var endWork;



    unit = getUnit(energyItemID);


    unitName = getUnitName(energyItemID);



    var title1 = $('#obj-type').find('option:selected').text();

    var title2 = $('#energy-type').find('option:selected').text();



    var postDate = $('#post-date').val();

    var showTime = postDate;

    startWork = $('#hour').val() + ':' + $('#minute').val();

    endWork = $('#hours').val() + ':' + $('#minutes').val();

    if(postDate == '上周'){

        dateSign = '日';


        startDate = moment().subtract(1,'week').startOf('week').add(1,'day').format('YYYY-MM-DD');

        endDate = moment().subtract(1,'week').endOf('week').add(2,'day').format('YYYY-MM-DD');

        //console.log(startDate,endDate);

    }else   if(postDate == '本月'){

        dateSign = '日';

        endDate = moment().add(1, 'day').format('YYYY-MM-DD');

        startDate = moment().startOf('month').format('YYYY-MM-DD');

        //console.log(startDate);
    }else if(postDate == '上月'){

        dateSign = '日';

        startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        endDate = moment().startOf('month').format('YYYY-MM-DD');

        //console.log(startDate,endDate);
    }else if(postDate == '本年'){
        dateSign = '月';

        endDate = moment().add(1, 'day').format('YYYY-MM-DD');



        startDate = moment().startOf('year').format('YYYY-MM-DD');

        //console.log(startDate,endDate);
    }else if(postDate == '上年'){
        dateSign = '月';


        startDate = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD');

        endDate =  moment().startOf('year').format('YYYY-MM-DD');


    }else if(postDate == '自定义'){

        dateSign = '日';

        startDate = $('.show-date').val().split('——')[0];

        var string =  $('.show-date').val().split('——')[1];

        endDate =  moment(string).add(1, 'day').format('YYYY-MM-DD');

        showTime = startDate + '——' + 'endDate';
        //console.log(startDate,endDate);
    }

    //console.log(postArr);
    $.ajax({
        type: 'post',
        url: IP + "/EnergyQuery/GetDayNightReturnData",
        timeout: theTimes,
        data:{
            "energyItemID":energyItemID,
            "dateType": dateSign,
            "startTime": startDate,
            "endTime": endDate,
            "startWorkTime": startWork,
            "endWorkTime": endWork,
            "pointerIDs":postArr
        },
        beforeSend: function () {
            //$('#theLoading').modal('show');
            myChart.showLoading();
            myChart1.showLoading();
            myChart2.showLoading();
        },

        complete: function () {
            //$('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            //console.log(data);


            if(data == null){
                myChart.hideLoading();
                myAlter('无数据!');
                return false;
            }
            $('.show-title1').html(title1);
            $('.show-title2').html(title2);
            $('.show-title3').html(showTime);


            //删除之前的数据
            for(var i=0; i<option.series.length; i++){

                option.series[i].data = [];
            }

            //图例
            var legendArr = ['昼','夜'];

            //上方柱状图
            var sArr1 = [];
            var sArr2 = [];
            var xArr = [];


            $(data.dcwrDatas).each(function(i,o){

                //上方柱状图数据
                sArr1.push(o.workTimeData.toFixed(2));

                sArr2.push(o.restTimeData.toFixed(2));

                xArr.push(o.dataDate.split('T')[0]);

            });

            //左侧饼图数据
            var sArr3 = [];
            sArr3 = [{value:data.sumWorkDayData.toFixed(2), name:'昼'},
                {value:data.sumWorkNightData.toFixed(2), name:'夜'}];

            //右侧饼图数据
            var sArr4 = [];
            sArr4 = [{value:data.sumRestDayData.toFixed(2), name:'昼'},
                {value:data.sumRestNightData.toFixed(2), name:'夜'}];

            option.xAxis[0].data = xArr;
            option.legend.data = legendArr;
            option.series[0].data = sArr1;
            option.series[0].name = '昼';
            option.series[1].data = sArr2;
            option.series[1].name = '夜';
            option.yAxis[0].axisLabel.formatter = '{value}' + unit + '';
            //重绘chart图
            myChart.hideLoading();
            myChart.setOption(option);

            option1.series[0].data = sArr3;
            //重绘chart图
            myChart1.hideLoading();
            myChart1.setOption(option1);

            option2.series[0].data = sArr4;
            //重绘chart图
            myChart2.hideLoading();
            myChart2.setOption(option2);

            var d1 = (data.workNightDayCompare  * 100).toFixed(2) + '%' ;

            $('.proportion1').html('='+d1);
            if(data.workNightDayCompare > data.workDayReferenceValue / 100){

                $('.content-rightss-tip1').css({
                    display:'block'
                })

            }else{

                $('.content-rightss-tip1').css({
                    display:'none'
                })
            }


            var d2 = (data.restNightDayCompare* 100).toFixed(2) + '%' ;

            $('.proportion2').html('='+d2);
            if(data.restNightDayCompare > data.restDayReferenceValue / 100){

                $('.content-rightss-tip2').css({
                    display:'block'
                })
            }else{

                $('.content-rightss-tip2').css({
                    display:'none'
                })
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

    //if(CompareDate(txt2,nowDate) == true){
    //    myAlter('结束日期不能大于当前日期');
    //    getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));
    //
    //    return false;
    //};


    if(CompareDate(txt2,txt1) == false){
        myAlter('结束日期必须大于开始日期');
        getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));

        return false;
    };

    var date = txt1 + '——' + txt2;

    //console.log(date);

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