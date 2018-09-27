/**
 * Created by admin on 2018/9/27.
 */
$(function(){


    ////日期初始化
    //_timeYMDComponentsFun($('.min'));

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



});

var _pointerZtree;

//实时数据（开始）；
var startRealTime = moment().subtract('24','hours').format('YYYY-MM-DD HH:mm:ss');
var endRealTime = moment().format('YYYY-MM-DD HH:mm:ss');
var showStartRealTime = moment().format('YYYY-MM-DD');

//获取历史数据
var dataArr = [];
var totalArr = [];
//获取所有数据
var _history = [];

//指定能耗种类的类型为全部；
var _ajaxEcType = " ";

//指定报警类型为全部；
var excTypeInnderId = " ";

function alarmHistory(){

    var url = 'Alarm/GetAllExcData';

    //获取报警类型
    excTypeInnderId = $('.choose-exc .onChoose').attr('data-id');

    //获取能耗种类
    _ajaxEcType = $('.choose-energy .onChoose').attr('data-id');

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
        "dealFlag": 0, //0为未处理 -1为全部
        "userID" :  _userIdNum,
        hasDev:1//为了判断是否显示创建工单按钮
    };

    var successFun = function(result){

        $('#theLoading').modal('hide');

        console.log(result);

        totalArr.length = 0;

        for(var i=0;i<result.length;i++){


            totalArr.push(result[i]);

        }

    };

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

    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);


}

//报警类型
function typeOfAlarm(){

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcType',
        success:function(result){

             //console.log(result);

            var html = ' <li class="the-select-message the-exc-type onChoose" data-id="">全部</li>';

            $(result).each(function(i,o){

                html += ' <li class="the-select-message the-exc-type " data-id="'+o.innerID+'">'+ o.cDtnName+'</li>';

            });

            $('.choose-exc ul').html(html);

            //获取能耗种类
            energyTypes();

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });
}

//能耗种类
function energyTypes(){

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllEnergyTypes',
        success:function(result){

            // console.log(result);

            var html = ' <li class="the-select-message the-energy-type onChoose" data-id="">全部</li>';

            $(result).each(function(i,o){

                html += ' <li class="the-select-message the-energy-type " data-id="'+o.energyTypeID+'">'+ o.energyTypeName+'</li>';

            });

            $('.choose-energy ul').html(html);

            //获取报警数据
            alarmHistory();

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });
}
