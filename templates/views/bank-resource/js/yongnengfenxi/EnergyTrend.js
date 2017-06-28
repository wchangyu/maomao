/**
 * Created by admin on 2017/6/12.
 */
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

    //点击右上角注释图标
    $('.show-header-right .right-text').on('click',function(){

        $('.text-content').slideToggle('fast');
    });


});
//存放查询对象
var pointArr = [];

//存放查询类型
var typeArr = [];

var content1 = '';
var content2 = '';
//获取能耗查询页面初始数据
function getStartData(){
    //获取查询类别
    $.ajax({
        type: 'get',
        url: IP + "/EnergyQuery/GetBankEnergyTendencyConfig",
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
            for(var i=0; i<data.energyItemModels.length;i++){
                html +=   '<option  value="'+data.energyItemModels[i].f_EnergyItemID+'">'+data.energyItemModels[i].f_EnergyItemName+'</option>'
            }

            $('#energy-type').html(html);

            content1 = data.tendencyHelpInfo12;

            content2 = data.tendencyHelpInfo52;

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
                    //console.log(data);
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
                    //console.log(textStatus);

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
            //console.log(textStatus);

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
            barMaxWidth: '60'

        },
        {
            name:'折线',
            type:'line',
            itemStyle : {  /*设置折线颜色*/
                normal : {
                    color:'#9dc541'
                }
            },
            smooth:true,
            data:[50, 75, 100, 150, 200, 250, 150, 100, 95, 160, 50, 45]
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

    var unit= '';


    $(typeArr).each(function(i,o){

        if(energyItemID == o.f_EnergyItemID){
            unit = getUnit(o.f_EnergyItemType);

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

    var showTime = $('#post-date').find('option:selected').text();

    var selectDate = moment().format('YYYY-MM-DD');

    //console.log(selectDate);


    $.ajax({
        type: 'post',
        url: IP + "/EnergyQuery/GetBankEnergyTendencyData",
        timeout: theTimes,
        data:{
            "energyItemID": energyItemID,
            "selectDate": selectDate,
            "tendencyFlag": postDate,
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
            //console.log(data);


            if(data == null){
                myChart.hideLoading();
                myAlter('无数据!');
                return false;
            }
            $('.show-title1').html(title1);
            $('.show-title2').html(title2);
            $('.show-title3').html(showTime);



            //图例
            var legendArr = [title2,'折线'];

            //上方柱状图
            var sArr1 = [];
            var xArr = [];


            $(data.ecMetaDataExtends).each(function(i,o){

                //上方柱状图数据
                sArr1.push(o.data.toFixed(2));

                xArr.push(o.dataDate.split('T')[0]);

            });

            option.xAxis[0].data = xArr;
            option.legend.data = legendArr;
            option.series[0].data = sArr1;
            option.series[1].data = sArr1;
            option.series[0].name = title2;
            option.yAxis[0].axisLabel.formatter = '{value}' + unit + '';
            //重绘chart图
            myChart.hideLoading();
            myChart.setOption(option);

            //改变左上方注释内容
            if(postDate == 0){
                $('.text-content').html(content1);

            }else if(postDate == 1){

                $('.text-content').html(content2);
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