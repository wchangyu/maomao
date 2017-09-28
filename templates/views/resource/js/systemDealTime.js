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
    format: 'yyyy/mm/dd',     forceParse: 0
});
//延迟时间
var theTimes = 30000;
$(document).ready(function(){
    //初始化
    var myChart = echarts.init(document.getElementById('energy-demand'));
    // 指定图表的配置项和数据
    option = {
        title: {
            text: '故障处理平均时间',
            x: 'center'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            show:true,
            data:[],
            x: 'left'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            show : true,
            x:100,
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
                    formatter: '{value} 小时'
                }
            }
        ],
        series : [
            {
                name:'处理时间(h)',
                type:'bar',
                data:[11, 11, 15, 13, 12, 13, 10]
            }
        ]
    };

    window.onresize = function () {
        if(myChart ){
            myChart.resize();

        }
    };

    var st = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
    var et = moment().startOf('month').format('YYYY-MM-DD');

    //页面显示的时间
    var showET = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

    $('.min').val(st);
    $('.max').val(showET);
    //获取后台数据放入页面
    $('.btn-success').on('click',function(){
        //获取开始结束时间
        var startTime = $('.min').val();
        var endTime = moment($('.max').val()).add(1,'day').format('YYYY-MM-DD');

        if(startTime == '' || endTime == ''){
            myAlter('请输入时间进行查询');
            return false;
        }

        //获取要传递的值
        var postArr = [];
        //获取要传递的地址
        var postUrl = '';
        //获取要传递的参数名称
        var postName = '';

        var postVal = $('#refer-spot').val();

        var typeVal = $('#refer-type').val();


        if(typeVal ==3){

            postUrl = 'YWGDAnalysis/GetGDDepartDealTime';
            postName = 'departNums';
            postArr.length = 0;
            if($('#refer-spot').val() == 0){
                $(DPartArr).each(function(i,o){
                    var arr = o.wxBanzus;
                    $(arr).each(function(i,o){
                        postArr.push(o.departNum);
                    });
                });
            }else{

                $(DPartArr).each(function(i,o){
                    if(o.departNum == $('#refer-spot').val()){
                        var arr = o.wxBanzus;
                        $(arr).each(function(i,o){
                            postArr.push(o.departNum);
                        });
                    }

                });
            }

        }else if(postVal == null){
            postArr = DStationArr;
            postUrl = 'YWGDAnalysis/GetGDDealTime';
            postName = 'ddNums';
        }else if(postVal == 0){
            console.log(11);
            postArr = DLineArr;
            postUrl = 'YWGDAnalysis/GetGDDLineDealTime';
            postName = 'dlNums';
        }else if(postVal == 1){

            postArr = DStationArr;
            postUrl = 'YWGDAnalysis/GetGDDealTime';
            postName = 'ddNums';
        }else {
            postArr.length = 0;
            if(typeVal == 1){

                postUrl = 'YWGDAnalysis/GetGDDLineDealTime';
                postName = 'dlNums';
                postArr.push(postVal);

            }else if(typeVal == 2){

                postUrl = 'YWGDAnalysis/GetGDDealTime';
                postName = 'ddNums';
                postArr.push(postVal);

            }

        }

        var prm = {
            'st':startTime,
            'et':endTime
        };

            prm[postName] = postArr;
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

                var xArr = [];
                var sArr = [];
                if(data.length == 0){
                    myAlter('无数据');
                    option.xAxis[0].data = xArr;
                    option.series[0].data = sArr;
                    //重绘chart图
                    myChart.hideLoading();
                    myChart.setOption(option);
                    return false;
                }

                $(data).each(function(i,o){

                    //横坐标
                    xArr.push(o.dsName);
                    //数据
                    sArr.push(o.avgDealTime);

                });
                option.xAxis[0].data = xArr;

                option.series[0].data = sArr;

                //重绘chart图
                myChart.hideLoading();
                myChart.setOption(option);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //console.log(textStatus);
                myChart.hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter('超时')
                }else{
                    myAlter('请求失败')
                }

            }
        });
    });


});

$('#refer-type').on('change',function(){

    var theVal = $(this).val();

    if(theVal == 0){
        $('#refer-spot').html('');
    }else if(theVal == 1){
        $('#refer-spot').html(DLinesSelect);
    }else if(theVal == 2){
        $('#refer-spot').html(DStationSelect);
    }else if(theVal == 3){
        $('#refer-spot').html(DPartSelect);
    }

});
//存放线点
var DLinesSelect = '';
var DLineArr = [];
 //存放车站
var DStationSelect = '';
var DStationArr = [];

//存放维修班组
var DPartSelect = '';
var DPartArr = [];

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
            DLinesSelect += '';
            console.log(data)
            $(data).each(function(i,o){
                DLinesSelect += '<option value="'+ o.dlNum+'">'+ o.dlName+'</option>';
                DLineArr.push(o.dlNum);
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
            DStationSelect += '<option value="1">全部</option>';

            $(data).each(function(i,o){
                DStationSelect += '<option value="'+ o.ddNum+'">'+ o.ddName+'</option>';
                DStationArr.push(o.ddNum);
            })
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

getAllDPart();
//获取全部车间（维修班组）
function getAllDPart(){

    $.ajax({
        type: 'post',
        url: _urls + '/YWGD/ywGDGetWxBanzuStation',
        timeout: theTimes,
        data:{
            'userID':_userIdName,
            'ddNum':''
        },
        success: function (data) {
            console.log(data);
            DPartSelect += '<option value="0">全部</option>'
            $(data.stations).each(function(i,o){

                DPartSelect += '<option value="'+ o.departNum+'">'+ o.departName+'</option>';
                DPartArr.push(o);
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
}