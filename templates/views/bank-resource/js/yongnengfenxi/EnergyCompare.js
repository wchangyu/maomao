/**
 * Created by admin on 2017/5/25.
 */


$(document).ready(function() {

    // 基于准备好的dom，初始化echarts实例
    console.log('ok');

    //初始化table表单


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
                data:"enterpriseName"
            },
            {
                title:'建筑面积（㎡）',
                data:"buildingArea"
            },
            {
                title:'能耗累计',
                data:"sumMetaData",
                render:function(data, type, row, meta) {
                    return data.toFixed(2);

                }
            },
            {
                title:'最大值',
                data:"maxMetaData",
                render:function(data, type, row, meta) {
                    return data.toFixed(2);

                }
            },
            {
                title:'最小值',
                data:"minMetaData",
                render:function(data, type, row, meta) {
                    return data.toFixed(2);

                }
            },
            {
                title:'平均值',
                data:"avgMetaData",
                render:function(data, type, row, meta) {
                    return data.toFixed(2);

                }
            }


        ]
    });
    _table = $('#dateTables').dataTable();

    var ddd = _table.language;
    console.log(ddd);

    //点击查询按钮时，获取后台数据
    $('.condition-query .top-refer').on('click',function(){
        //获取查询条件
        var type = $('.condition-query li').eq(0).find('select').val();
        var time = $('.condition-query li').eq(1).find('select').val();
        var theArea = $('.condition-query li').eq(2).find('select').val();

        getMainData();

    })



});
//存放列表中的数据
dataArrs = [];
//存放查询对象
var pointArr = [];

//存放查询指标
var typeArr = [];
// 存放单位
var unit = 't/㎡';

//获取能耗查询页面初始数据
function getStartData(){
    //获取查询指标
    $.ajax({
        type: 'get',
        url: IP + "/EnergyQuery/GetShowHorCompareItem",
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
                    isShowTotalItem : 0
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
                    var theValue1 = '';
                    var theValue2 = '';
                    var html= '';
                    for(var i=0; i<data.length;i++){

                        html +=   '<option value="'+data[i].enterpriseID+'">'+data[i].eprName+'</option>'

                        if(data[i].defaultShowFlag == 1){

                            theValue1 = data[i].enterpriseID;
                        }else if(data[i].defaultShowFlag == 2){

                            theValue2 = data[i].enterpriseID;
                        }
                    }

                    $('#obj-type').html(html);
                    $('#obj-type2').html(html);


                    $('#obj-type').val(theValue1);
                    $('#obj-type2').val(theValue2);
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
        data:['最高气温',{name:'参考值'}]
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
        },
        {
            name:'最低气温',
            type:'line',
            data:[11, 11, 15, 13, 12, 13, 10],
            itemStyle : {
                normal : {
                    color:'#53f4db',
                    lineStyle:{
                        color:'#53f4db',
                        width:3
                    }
                }
            },
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

    var objID1 = $('#obj-type').val();

    var objID2 = $('#obj-type2').val();

    var postObjID = [objID1,objID2];

    var postArr = [];

    var postEnergy = {};

    var dateSign = '';

    var startDate;

    var endDate;


    var unit1;

    var index = $('#energy-type').find("option:selected").index();

    console.log(typeArr);

    postEnergy = typeArr[index];

    unit1 = postEnergy.energyUnit;


    var title1 = $('#obj-type').find('option:selected').text();

    var title2 = $('#energy-type').find('option:selected').text();

    var title3 = $('#obj-type2').find('option:selected').text();

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

        showTime = startDate + '——' + endDate;
        console.log(startDate,endDate);
    }

    console.log(postObjID);
    $.ajax({
        type: 'post',
        url: IP + "/EnergyQuery/GetHorCompareData",
        timeout: theTimes,
        data:{
            "energyNorm":postEnergy,
            "dateType": dateSign,
            "startTime": startDate,
            "endTime": endDate,
            "pointerIDs":postArr,
            "userID": _userIdName,
            "enterpriseIDs":postObjID
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


            if(data.length == 0){
                myChart.hideLoading();
                myAlter('无数据!');
                return false;
            };


            $('.show-title1').html(title2);
            $('.show-title2').html(showTime);
            $('.show-title3').html(title1 + '&nbsp; ' + title3);

            dataArrs = [];
            var xArr = [];
            $(data).each(function(i,o){
                //给表格获取数据

                dataArrs.push(o);

                var dataArr = o.ecMetaDatas;

                var dataLength = o.enterpriseName;

                var sArr = [];

                //var k=0;
                if(i == 0 && dateSign != '小时'){
                    $(dataArr).each(function(i,o) {

                        xArr.push(o.dataDate.split('T')[0]);
                    })
                }else if(i == 0 && dateSign == '小时'){
                    $(dataArr).each(function(i,o) {

                        xArr.push(o.dataDate.split('T')[1]);
                    })
                }

                $(dataArr).each(function(i,o){


                    sArr.push((o.data).toFixed(2));

                });
                //显示数据
                option.series[i].data = sArr;


                option.legend.data[i] = dataLength;
                option.series[i].name = dataLength;
                //跟新X轴
                option.xAxis[0].data = xArr;

                unit = unit1;

                option.yAxis[0].axisLabel.formatter = '{value}' + unit + '';
            });





            console.log(option.legend.data[0]);


            //重绘chart图
            myChart.hideLoading();
            myChart.setOption(option);



            ajaxSuccess();

            console.log(unit1);

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