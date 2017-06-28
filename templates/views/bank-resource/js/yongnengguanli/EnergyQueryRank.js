/**
 * Created by admin on 2017/6/2.
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
//获取能耗查询页面初始数据
function getStartData(){
    //获取查询类别
    $.ajax({
        type: 'get',
        url: IP + "/EnergyManage/GetShowEnergyRankingItem",
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
                html +=   '<option value="'+data[i].energyItemID+'">'+data[i].energyItemName+'</option>'
            }

            $('#energy-type').html(html);

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
            boundaryGap : true,
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
            //data:[11, 11, 15, 13, 12, 13, 10],
            itemStyle: {
                normal: {
                    color: '#9dc541'
                },
                emphasis: {
                    barBorderColor: 'rgba(0,0,0,0.5)',
                    color: '#afc8de'
                }
            },

            barMaxWidth:40,

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

    var postObj = {};

    var dateSign = '';

    var startDate = '';

    var endDate = '';

    var unit;

    var unitName;

    var index = $('#energy-type').find("option:selected").index();

    //console.log(typeArr);

    postObj = typeArr[index];

    unit =  postObj.energyUnit;


    var title2 = $('#energy-type').find('option:selected').text();



    var postDate = $('#post-date').val();

    var dateArr = getPostDate(postDate);


    startDate = dateArr[1];

    endDate = dateArr[2];

    dateSign = dateArr[3];

    showTime = dateArr[4];

    //console.log(endDate);

    var selectType = dateArr[5];

    $.ajax({
        type: 'post',
        url: IP + "/EnergyManage/GetYearMonthCompareData",
        timeout: theTimes,
        data:{
            "energyNorm":postObj,
            "dateType": dateSign,
            "startTime": startDate,
            "endTime": endDate,
            "selectDateType": selectType,
            'userID':_userIdName
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

            if(data.length == 0){
                myChart.hideLoading();
                myAlter('无数据!');
                return false;
            };

            $('.show-title1').html(title2);
            $('.show-title2').html(showTime);

            var dataArr = data;

            //console.log(dataArr);

            var xArr = [];
            var sArr = [];
            //存放同比
            var tArr = [];
            //存放环比
            var hArr = [];
            var maxVal = dataArr[0].currentEnergyData;
            var minVal = dataArr[0].currentEnergyData;

            //console.log(title2);

            $(dataArr).each(function(i,o){

                xArr.push(o.enterpriseName.substring(0,3));
                sArr.push(o.currentEnergyData.toFixed(2));

                tArr.push(o.currentLastYearRanking);
                hArr.push(o.currentLastMonthRanking);

                if(o.currentEnergyData > maxVal){
                    maxVal =o.currentEnergyData;
                }else if(o.currentEnergyData < minVal){
                    minVal =o.currentEnergyData;
                }
            });

            option.series[0].data = sArr;

            option.legend.data[0] = title2;
            option.series[0].name = title2;
            option.xAxis[0].data = xArr;
            option.yAxis[0].axisLabel.formatter = '{value}' + unit + '';


            //console.log(option.legend.data[0]);


            //重绘chart图
            myChart.hideLoading();
            myChart.setOption(option);

            //右侧显示数据的改变
            $('.header-right-lists span').html(unit);


            if(minVal == 0){

                $('.proportion1').html('= 0');
            }else{
                $('.proportion1').html('=' + (maxVal / minVal).toFixed(1));
            }



            //表格中的数据
            var html1 = '<th></th>';
            $(xArr).each(function(i,o){

                html1 += '<th>'+ o+'</th>'
            });

            $('.table thead tr').html(html1);

            var html2 = '<td>同比</td>';
            $(tArr).each(function(i,o){

                if(o < 0){
                    html2 += '<td class="down">'+ Math.abs(o)+'位</td>'
                }else if(o == 0){
                    html2 += '<td class="equal">'+ o+'位</td>'
                }else{
                    html2 += '<td class="up">'+ o+'位</td>'
                }
            });
            $('.table tbody tr').eq(0).html(html2);

            //console.log(selectType);

            if(selectType != '年'){

                $('.table tbody tr').eq(0).css({
                    display:'table-row'
                })

            }else{
                $('.table tbody tr').eq(0).css({
                    display:'none'
                })
            }

            var html3 = '<td>环比</td>';
            $(hArr).each(function(i,o){

                if(o < 0){
                    html3 += '<td class="down">'+  Math.abs(o)+'位</td>'
                }else if(o == 0){
                    html3 += '<td class="equal">'+ o+'位</td>'
                }else{
                    html3 += '<td class="up">'+ o+'位</td>'
                }

            });

            $('.table tbody tr').eq(1).html(html3);

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