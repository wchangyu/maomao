/**
 * Created by admin on 2018/9/28.
 */

$(function(){

    //日期初始化
    _timeYMDComponentsFun($('.min'));

    //获取上周
    var date1 = moment().subtract('6','days').format('YYYY/MM/DD');

    //获取昨天2
    var date2 = moment().format('YYYY/MM/DD');

    $('.choose-time-select ul li').eq(4).click();

    $('.min').val(date1);

    $('.max').val(date2);


    //获取报警类型
    typeOfAlarm();

    //楼宇ztree树
    _pointerZtree = _getPointerZtree($("#allPointer"),1);

    //楼宇搜索功能
    _searchPO($(".tipess"),"allPointer");

    //默认勾选第一个楼宇
    var zTree = $.fn.zTree.getZTreeObj("allPointer");
    var nodes = zTree.getNodes();

    zTree.checkNode(nodes[0], false, false);  //父节点不被选中

    zTree.checkNode(nodes[0].children[0], true, true);

    //页面初始化
    $('.choose-object-windows .sure').click();

    //点击页面查询按钮
    $('.demand').on('click',function(){

        alarmHistory();

    });

    //点击查看全部按钮
    $('.warning-data-container').on('click','.all-data-btn',function(){

        //查看全部数据
        jointHtml(totalArr,true);

    });

    //生成工单弹窗
    $('.warning-data-container').on('click','.can-creat',function(){


        $('#Creat-myModa').modal('show');

        //初始化
        $('.gongdanList').find('input').val('');

        $('.gongdanList').find('textarea').val('');

        //获取工单信息
        getOrderMessage($(this));

    });

    //点击工单弹窗中确定按钮
    $('#Creat-myModa .btn-primary').on('click',function(){

        //给后台提交数据
        postOrder();

    });

    //点击打开流程图
    $('.warning-data-container').on('click','.examine-monitor',function(){

        //打开模态框
        $('#my-userMonitor').modal('show');

        //获取当前传递的参数
        var config1 = 5;

        var config2 = $(this).attr('data-pointer');

        var config3 = $(this).attr('data-cdataid');

        //拼接打开的url地址
        var postUrl = "../yongnengjiance/jumpEnergyMonitor1.html?configArg1=" + config1 + "configArg2=" + config2 + "configArg3=" + config3 + "";

        $('#my-userMonitor iframe').attr('src',postUrl);

    });

    //获取历史报警数据并展示
    $('.warning-data-container').on('click','.history-alarm-num',function(){

        //显示历史报警信息弹窗
        $('#historyWarn').modal('show');

        var cnames = $(this).parents('.warning-data').find('.cName').html();
        var pointerName = $(this).parents('.warning-data').find('.pointerName').html();

        $('#historyWarn .modal-title').html(pointerName +'--'+ cnames+'--支路历史报警');

        var historyArr = [];

        $(totalArr).each(function(i,o){

            if(o.cName == cnames && o.pointerName == pointerName){

                historyArr = totalArr[i].rowDetailsExcDatas;

                //绘制页面
                drawHistoryTable(historyArr);

            }

        });

    });

});

//从配置中读取是否显示流程图
var userMonitorClass = getDataByConfig();

//从配置项中获取页面中所展示信息
function getDataByConfig(){

    //获取当前的url
    var curUrl = 'baojingyujing/warningAlarm-3.html';

    var thisClass = '';

    //获取当前页面的配置信息
    $(__systemConfigArr).each(function(i,o){

        //获取当前配置项中的url
        var thisUrl = o.pageUrl;

        //找到了当前页面对应的配置项
        if(curUrl.indexOf(thisUrl) > -1){

            //获取到具体的能耗排名配置信息
            var ifShow = o.ifShowMonitor;

            if(ifShow == 0){

                thisClass = 'theHidden';
            }

            return false;

        }
    });

    return thisClass;
};

var _pointerZtree;

//获取登陆用户信息
var userInfo = JSON.parse(sessionStorage.userInfo);


//获取历史数据
var dataArr = [];
var totalArr = [];
//获取所有数据
var _history = [];

//指定能耗种类的类型为全部；
var _ajaxEcType = " ";

//指定报警类型为全部；
var excTypeInnderId = " ";

var beforeSendFun = function(){


    $('#theLoading').modal('show');

};

var errorFun = function(XMLHttpRequest, textStatus, errorThrown){

    $('#theLoading').modal('hide');

    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

        _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

    }else{

        _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

    }
};

//获取报警数据
function alarmHistory(){

    var url = 'Alarm/GetAllExcData';

    //获取报警类型
    excTypeInnderId = $('.choose-exc .onChoose').attr('data-id');

    //获取能耗种类
    _ajaxEcType = $('.choose-energy .onChoose').attr('data-id');

    //获取是否处理
    var dealFlag = $('.left-choose-energy-container .time-radio:checked').attr('data-id');

    //开始结束时间
    var startRealTime = $('.min').val();

    var endRealTime = $('.max').val();

    //确定楼宇id
    var pts = _pointerZtree.getSelectedPointers();

    var postPinterId = [];

    $(pts).each(function(i,o){

        postPinterId.push(o.pointerID);


    });

    var prm = {
        'st' : startRealTime,
        'et' : endRealTime,
        'pointerIds' : postPinterId,
        'excTypeInnderId' : excTypeInnderId,
        'energyType' : _ajaxEcType,
        "dealFlag": dealFlag, //0为未处理 -1为全部
        "userID" :  _userIdNum,
        hasDev:1//为了判断是否显示创建工单按钮
    };

    var successFun = function(result){

        $('#theLoading').modal('hide');

        if($('.modal-backdrop').length > 0){

            $('div').remove('.modal-backdrop');
            $('#theLoading').hide();
        }

        //console.log(result);

        totalArr.length = 0;

        $(result).each(function(i,o){

            totalArr.push(o);
        });

        //页面赋值
        jointHtml(totalArr);

    };

    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);

}


