/**
 * Created by admin on 2017/8/29.
 */
/**
 * Created by admin on 2017/8/28.
 */
/*--------------------------------全局变量---------------------------------*/
//获得用户名
var _userIdName = sessionStorage.getItem('userName');
//获取本地url
var _urls = sessionStorage.getItem("apiUrlPrefixYW");
//开始/结束时间插件
$('.datatimeblock').datepicker({
    language:  'zh-CN',
    todayBtn: 1,
    todayHighlight: 1,
    startView: 2,
    maxViewMode: 2,
    minViewMode:2,
    format: 'yyyy'
});
//延迟时间
var theTimes = 30000;
$(document).ready(function(){

    //初始化
    var myChart = echarts.init(document.getElementById('energy-demand'));
    // 指定图表的配置项和数据
    option = {
        title: {
            text: '故障月统计',
            x: 'center'
        },
        tooltip : {
            trigger: 'item'
        },
        legend: {
            show:true,
            data:['故障平均处理时间'],
            y:'bottom'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
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
            },
            x:100

        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value}个'

                }
            }
        ],
        series : [
            {
                name:'处理时间(h)',
                type:'line',
                data:[11, 11, 15, 13, 12, 13, 10]
            }
        ]
    };
    //图表大小随窗口变化
    window.onresize = function () {
        if(myChart ){
            myChart.resize();

        }
    };
    //初始日期设置为本年
    var st = moment().format('YYYY');
    $('.min').val(st);

    //获取后台数据放入页面
    $('.btn-success').on('click',function(){
        //获取查询年份
        var startTime = $('.min').val();

        if(startTime == ''){
            myAlter('请输入时间进行查询');
            return false;
        }

        var entTime = parseInt(startTime) + 1;

        var st = startTime + '-1-1';

        var et = entTime + '-1-1';

        //获取要传递的值
        var postArr = [];
        //获取要传递的地址
        var postUrl = '';
        //获取要传递的参数名称
        var postName = '';

        var postVal = $('#refer-spot').val();

        var typeVal = $('#refer-type').val();

       if(typeVal == 3){
           postUrl = '/YWGDAnalysis/GetGDDAreaMonthCount';
           postName = 'dAreas';
           if(postVal == 2){
               postArr = DAreaArr;
           }else{
               postArr.length = 0;
               postArr.push(postVal)
           }
       }else if(typeVal == 2){
           postUrl = '/YWGDAnalysis/GetGDDDepMonthCount';
           postName = 'ddNums';
           if(postVal == 1){
               postArr = DStationArr;
           }else{
               postArr.length = 0;
               postArr.push(postVal)
           }
       }else if(typeVal == 1){
           postArr = DLineArr;
           postUrl = '/YWGDAnalysis/GetGDMonthCount';
           postName = 'dlNums';
           if(postVal == 0){
               postArr =  DLineArr;
           }else{
               postArr.length = 0;
               postArr.push(postVal)
           }
       }

        var prm = {
            'st':st,
            'et':et
        };
        console.log(postVal);
        prm[postName] = postArr;

        console.log(prm);

        //向后台发送请求
        $.ajax({
            type: 'post',
            url: _urls + postUrl,
            timeout: theTimes,
            beforeSend: function () {
                //$('#theLoading').modal('show');
                myChart.showLoading();
            },

            complete: function () {
                //$('#theLoading').modal('hide');
            },
            data:prm,
            success: function (data) {
                console.log(data);

                //图标数据初始化
                option.legend.data.length =0;
                option.series.length = 0;

                if(data.length == 0){
                    myAlter('无数据');
                    //重绘chart图
                    myChart.hideLoading();
                    myChart.setOption(option,true);
                    return false;
                }


                $(data).each(function(i,o){
                    var obj = {};
                    obj.name = o.returnName;
                    obj.type = 'line';
                    var pushArr = [];
                    var dataArr0 = o.gdMonthCounts;

                    //数据
                    $(dataArr0).each(function(i,o){
                        pushArr.push(o.valueLong)
                    });

                    obj.data = pushArr;
                    option.series.push(obj);
                    //图例
                    option.legend.data.push(o.returnName);

                });


                //重绘chart图
                myChart.hideLoading();
                myChart.setOption(option,true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter('超时')
                }else{
                    myAlter('请求失败')
                }

            }
        });
    });
});

//当类型选框中内容改变时
$('#refer-type').on('change',function(){

    var theVal = $(this).val();

    if(theVal == 3){
        $(this).parents('li').next().find('label').html('影响单位 :');
        $('#refer-spot').html(DAreaSelect);
    }else if(theVal == 1){
        $(this).parents('li').next().find('label').html('线点 :');
        $('#refer-spot').html(DLinesSelect);
    }else if(theVal == 2){
        $(this).parents('li').next().find('label').html('车站 :');
        $('#refer-spot').html(DStationSelect);
    }

});
//存放线点
var DLinesSelect = '';
var DLineArr = [];
//存放车站
var DStationSelect = '';
var DStationArr = [];
//存放车务段
var DAreaSelect = '';
var DAreaArr = [];

getAllDLines();

//获取全部线点
function getAllDLines(){

    $.ajax({
        type: 'post',
        url: _urls + '/YWGD/ywGetDLines',
        timeout: theTimes,
        data:{
            'userID':_userIdName
        },
        success: function (data) {
            DLinesSelect += '<option value="0">全部</option>';
            console.log(data)
            $(data).each(function(i,o){
                DLinesSelect += '<option value="'+ o.dlNum+'">'+ o.dlName+'</option>';
                DLineArr.push(o.dlNum);
            });
            $('#refer-spot').html(DLinesSelect);
            $('.btn-success').click();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter('超时')
            }else{
                myAlter('请求失败')
            }

        }
    });
};

getAllDStations();

//获取全部车站
function getAllDStations(){

    $.ajax({
        type: 'post',
        url: _urls + '/YWDev/ywDMGetDDs',
        timeout: theTimes,
        data:{
            'userID':_userIdName,
            'ddNum':''
        },
        success: function (data) {
            DStationSelect += '';

            $(data).each(function(i,o){
                DStationSelect += '<option value="'+ o.ddNum+'">'+ o.ddName+'</option>';
                DStationArr.push(o.ddNum);
            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter('超时')
            }else{
                myAlter('请求失败')
            }

        }
    });
};

getAllDArea();

//获取全部车务段
function getAllDArea(){
    $.ajax({
        type: 'post',
        url: _urls + '/YWDev/ywDMGetDAs',
        timeout: theTimes,
        data:{
            'userID':_userIdName,
            'daNum':''
        },
        success: function (data) {
            console.log(data);
            DAreaSelect += '<option value="2">全部</option>';

            $(data).each(function(i,o){
                DAreaSelect += '<option value="'+ o.daNum+'">'+ o.daName+'</option>';
                DAreaArr.push(o.daNum);
            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter('超时')
            }else{
                myAlter('请求失败')
            }

        }
    });
};