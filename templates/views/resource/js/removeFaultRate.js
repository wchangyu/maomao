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
    format: 'yyyy/mm/dd'
});
//延迟时间
var theTimes = 30000;
$(document).ready(function(){



    //初始化
    var myChart = echarts.init(document.getElementById('energy-demand'));
    // 指定图表的配置项和数据
    // 指定图表的配置项和数据
    option = {
        title: {
            text: '销障率',
            x: 'center'
        },
        tooltip : {
            trigger: 'axis',
            formatter: '{b} : {c} % '
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
                    formatter: '{value}% '
                }
            }
        ],
        series : [
            {
                name:'销障率',
                type:'bar',
                data:[11, 11, 15, 13, 12, 13, 10],
                barMaxWidth:90//最大宽度
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

    $('.min').val(st);
    $('.max').val(et);
    //获取后台数据放入页面
    $('.btn-success').on('click',function(){
        //获取开始结束时间
        var startTime = $('.min').val();
        var endTime = $('.max').val();

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

        var typeVal = $('#refer-type').val();

        //选择按线点查看
        if(typeVal == 1){
            postArr.length = 0;
            if($('#refer-point').val() == 1){
                postUrl = '/YWGDAnalysis/GDDSysXiaoRate';
                postName = 'dSyss';
                postArr.push($('#refer-station').val());
            }else if($('#refer-point').val() == 2){
                postUrl = '/YWGDAnalysis/GDDClassXiaoRate';
                postName = 'dClasss';
                postArr.push($('#refer-station').val());
            }else if($('#refer-point').val() == 0){
                postUrl = '/YWGDAnalysis/GDDSysXiaoRate';
                postName = 'dSyss';
                postArr = DSystemArr;
            }
            //选择按车站查看
        }else if(typeVal == 2){
            postUrl = '/YWGDAnalysis/GDDDepXiaoRate';
            postName = 'ddNums';
            postArr = DStationArr;
            //选择按车间查看
        }else if(typeVal ==3){
            postArr.length = 0;
            postUrl = '/YWGDAnalysis/GDDepartXiaoRate';
            postName = 'departNums';
            if($('#refer-point').val() == 0){
               $(DPartArr).each(function(i,o){
                    var arr = o.wxBanzus;
                    $(arr).each(function(i,o){
                       postArr.push(o.departNum);
                    });
               });
            }else{
                $(DPartArr).each(function(i,o){
                    if(o.departNum == $('#refer-point').val()){
                        var arr = o.wxBanzus;
                        $(arr).each(function(i,o){
                            postArr.push(o.departNum);
                        });
                    }

                });

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
                console.log(data);

                var xArr = [];
                var sArr = [];

                if(data.length == 0){
                    myAlter('无数据');
                    myChart.hideLoading();
                    option.xAxis[0].data = xArr;
                    option.series[0].data = sArr;
                    myChart.setOption(option);
                    return false;
                }

                $(data).each(function(i,o){

                    //横坐标
                    xArr.push(o.returnName);
                    //数据
                    sArr.push(o.gdRate.toFixed(2));

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
//存放类型为线点时，第二个select框中内容
var pointSelect = '<option value="0">全部</option><option value="1">设备系统</option><option value="2">设备类型</option>';
//改变类型时
$('#refer-type').on('change',function(){


    var theVal = $(this).val();
    if(theVal == 3){
        $('#refer-point').parents('li').removeClass('hidden');
        $('#refer-station').parents('li').addClass('hidden');
        $('#refer-point').html(DPartSelect);
    }else if(theVal == 2){

        $('#refer-point').parents('li').addClass('hidden');
        $('#refer-station').parents('li').addClass('hidden');
    }else{
        $('#refer-point').parents('li').removeClass('hidden');
        $('#refer-station').parents('li').removeClass('hidden');
        $('#refer-point').html(pointSelect);
    }

});

//改变所属类型时，给具体添加联动
$('#refer-point').on('change',function(){
    console.log(33);
    var theVal = $(this).val();
    if($('#refer-type').val() == 1){
        if(theVal == 0){
            $('#refer-station').html('');
        }else if(theVal == 1){
            $('#refer-station').html(DSystemSelect);
        }else{
            $('#refer-station').html(DTypeSelect);
        }
    }else{
        $('#refer-station').html('');
    }

});
//存放设备系统
var DSystemSelect = '';
var DSystemArr = [];
//存放设备类型
var DTypeSelect = '';
var DTypeArr = [];
//存放车站
var DStationSelect = '';
var DStationArr = [];
//存放维修班组
var DPartSelect = '';
var DPartArr = [];

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
                DStationSelect += '<option value="0">全部</option>';
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

getAllDSystem();

//获取全部设备系统
function getAllDSystem(){

    $.ajax({
        type: 'post',
        url: _urls + '/YWDev/ywDMGetDSs',
        timeout: theTimes,
        data:{
            'userID':_userIdName,
            'dsNum':''
        },
        success: function (data) {


            $(data).each(function(i,o){

                DSystemSelect += '<option value="'+ o.dsNum+'">'+ o.dsName+'</option>';
                DSystemArr.push(o.dsNum);
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

getAllDType();

//获取全部设备类型
function getAllDType(){

    $.ajax({
        type: 'post',
        url: _urls + '/YWDev/ywDMGetDCs',
        timeout: theTimes,
        data:{
            'userID':_userIdName,
            'dcNum':''
        },
        success: function (data) {

            $(data).each(function(i,o){

                DTypeSelect += '<option value="'+ o.dcNum+'">'+ o.dcName+'</option>';
                DTypeArr.push(o.dcNum);
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

