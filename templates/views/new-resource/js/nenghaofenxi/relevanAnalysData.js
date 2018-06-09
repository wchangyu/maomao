/**
 * Created by admin on 2017/11/22.
 */
$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //时间初始化
    $('.time-options-1').click();

    //记录页面
    _energyTypeSel = new ETSelection();

    //读取能耗种类
    _getEcType('initPointers');

    //默认选中第一个能耗
    $('.selectedEnergy').addClass('blueImg0');

    _getEcTypeWord();

    //默认能耗种类
    _ajaxEcType =_getEcTypeValue();

    _ajaxEcTypeWord = _getEcTypeWord();

    //根据配置获取左侧展示树状图
    if(getDataByConfig() == 1){

        getBranchZtree(0,0,getPointerTree);

    }else{

        //楼宇ztree树
        _pointerZtree = _getPointerZtree($("#allBranch"),1);

        //楼宇搜索功能
        _searchPO($(".tipes"),"allBranch");

    }

    //显示隐藏左侧时
    $('.showOrHidden').click(function(){

        window.onresize();
    });


    //加载初始数据

    if(getDataByConfig() == 1){

        getPointerData('EnergyAnalyzeV2/GetRelevanAnalysData',1);

    }else{

        getPointerData('EnergyAnalyzeV2/GetPointerRAnalysData',2);

    }

    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){

        //获得选择的能耗类型
        _ajaxEcType =_getEcTypeValue(_ajaxEcType);

        //获取能耗类型名称
        var ecTypeName = $('.selectedEnergy').attr('value');

        if(getDataByConfig() == 1){

            getPointerData('EnergyAnalyzeV2/GetRelevanAnalysData',1);

        }else{

            getPointerData('EnergyAnalyzeV2/GetPointerRAnalysData',2);

        }



    });

    //能耗选择
    $('.typee').click(function(){

        $('.typee').removeClass('selectedEnergy');
        $(this).addClass('selectedEnergy');

    });

    //chart图自适应
    window.onresize = function () {

        if(myChartTopLeft){
            myChartTopLeft.resize();
        }

    };

});

//从配置项中获取页面中所展示信息
function getDataByConfig(){

    //获取当前的url
    var curUrl = window.location.href;

    var  showDataType = 0;

    //获取当前页面的配置信息
    $(__systemConfigArr).each(function(i,o){

        //获取当前配置项中的url
        var thisUrl = o.pageUrl;

        //找到了当前页面对应的配置项
        if(curUrl.indexOf(thisUrl) > -1){

            //获取到具体的关联分析配置
            showDataType = o.showDataType;

            return false
        }
    });

    return showDataType;
};

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

/*---------------------------------echart-----------------------------------*/
//定义存放返回数据的数组（本期 X Y）
var allData = [];
var allDataX = [];
var allDataY = [];

//同比柱状图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));


//柱折图配置项
var optionLineBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['数据', '平均气温','就诊人数'],
        top:'30'
    },
    toolbox: {
        show : true,
        feature : {
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['bar', 'line']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['本期','上期']
        }
    ],
    yAxis : [
        {
            type : 'value',
            name:'能耗'
        },
        {
            //type: 'value',
            //name:'平均温度',
            //position: 'right'
        },
        {
            //type: 'value',
            //name:'就诊人数',
            //position: 'right',
            //offset:50
        }
    ],
    grid: {
        left: '6%',
        right: '18%'
    },
    series : [
        {
            name:'数据',
            type:'bar',
            yAxisIndex:0,
            barMaxWidth: '50',
            data:[]
        },
        {
            name:'平均气温',
            axisLabel: {
                formatter: '{value} C'
            },
            type:'line',
            yAxisIndex:1,
            data:[]
        },
        {
            name:'就诊人数',
            type:'line',
            yAxisIndex:2,
            data:[]
        }
    ]
};

/*---------------------------------otherFunction------------------------------*/

//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPointerData(url,flag){

    var totalAllData = 0;

    //存放要传的企业集合
    var enterpriseIDs = [];

    //存放要传的楼宇集合
    var postPointerIDs = [];

    //获取名称
    var areaName = '';

    //楼宇数据
    if(flag == 2){

        //var treeObj = $.fn.zTree.getZTreeObj('allBranch');

        //确定楼宇id
        var pts = _pointerZtree.getSelectedPointers();

        $(pts).each(function(i,o){

            postPointerIDs.push(o.pointerID)
        });

        areaName = $('.radio_true_full').next().attr('title');

    }else{

        //确定支路id
        var nodes = branchTreeObj.getCheckedNodes(true);

        $( nodes).each(function(i,o){

            //如果勾选的是父节点
            if(o.level == 0){

                $(o.children).each(function(i,o){
                    enterpriseIDs.push(o.id);
                })

            }else{
                enterpriseIDs.push(o.id);
            }

            //页面上方展示信息
            areaName += o.name;
        });

    }

    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){
        _ajaxEcType = -2;
    }

    //获取开始时间
    var startTime = getPostTime()[0];

    //获取开始时间
    var endTime = getPostTime()[1];

    //获取展示日期类型
    var showDateType = getShowDateType()[0];

    //获取用户选择日期类型
    var selectDateType = getShowDateType()[1];

    //定义获得数据的参数
    var ecParams = {
        "showDateType": showDateType,
        "selectDateType": selectDateType,
        "energyItemID": _ajaxEcType,
        "enterpriseIDs": enterpriseIDs,
        "pointerIDs": postPointerIDs,
        "startTime": startTime,
        "endTime": endTime
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+url,
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){
            myChartTopLeft.showLoading();
        },
        success:function(result){

            myChartTopLeft.hideLoading();

            //console.log(result);

            //判断是否返回数据
            if(result == null || result.length < 1){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }

            //改变头部显示信息
            var energyName = '';

            energyName = $('.selectedEnergy p span').html();

            //改变头部日期
            var date = startTime +" — " + moment(endTime).subtract('1','days').format('YYYY-MM-DD');

            $('.right-header-title').html('' + energyName + ' &nbsp;' + areaName + ' &nbsp;' + date);

            //绘制echarts

            //图例
            var legendArr = [energyName];

            //首先处理本期的数据
            allData.length = 0;

            allData = result[0].metaDatas;

            //首先处理实时数据
            allDataX.length = 0;
            allDataY.length = 0;

            //绘制echarts
            if(showDateType == 'Hour' ){
                //确定x轴
                for(var i=0;i<allData.length;i++){
                    var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                    var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                    if(allDataX.indexOf(dataJoin)<0){
                        allDataX.push(dataJoin);
                    }
                }
            }else{
                //确定x轴
                for(var i=0;i<allData.length;i++){
                    var dataSplit = allData[i].dataDate.split('T')[0];

                    if(allDataX.indexOf(dataJoin)<0){
                        allDataX.push(dataSplit);
                    }
                }
            };
            //console.log(allData);

            //温度数据
            var allDataY1 = [];

            if(result.length > 1){

                //获取当前曲线名称
                var showName = getDataName(result[1].showNameFlag);

                legendArr.push(showName);

                optionLineBar.series[1].name = showName;


                $(result[1].metaDataStrs).each(function(i,o){

                    allDataY1.push(o.data);
                });

                optionLineBar.yAxis[1] = {

                    type: 'value',
                    name:showName,
                    position: 'right',
                    //offset:50,
                    show:true
                };

                //温度
                optionLineBar.series[1].data = allDataY1;

            }

            //就诊人数
            var allDataY2 = [];

            if(result.length > 2){

                //获取当前曲线名称
                var showName = getDataName(result[2].showNameFlag);

                legendArr.push(showName);

                optionLineBar.series[2].name = showName;

                $(result[2].metaDatas).each(function(i,o){

                    //获取当前天数
                    var length = allDataX.length;

                    if( i < length){
                        allDataY2.push(o.data);
                    }

                });

                //就诊人数 月和年的时候显示
                if(showDateType != 'Hour'){

                    optionLineBar.yAxis[3] = {

                        type: 'value',
                        name:showName,
                        position: 'right',
                        offset:50,
                        show:true

                    };

                    optionLineBar.series[2].data = allDataY2;

                }else{

                    optionLineBar.yAxis[3]=  {

                        type: 'value',
                        name:showName,
                        position: 'right',
                        offset:50,
                        show:false
                    };

                    optionLineBar.series[2].data = [];
                }

            }

            $(allData).each(function(i,o){

                allDataY.push(o.data.toFixed(2));
            });

            //console.log(allDataY);

            //echart柱状图
            optionLineBar.xAxis[0].data = allDataX;
            optionLineBar.series[0].data = allDataY;
            optionLineBar.series[0].name = energyName;


            optionLineBar.legend.data = legendArr;

            myChartTopLeft.setOption(optionLineBar,true);


        },
        error:function(jqXHR, textStatus, errorThrown){
            myChartTopLeft.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
            }

        }
    })
};


//获取当前数据曲线名称
function getDataName(showNameFlag){

    if(showNameFlag == 1){

        return '平均温度';

    }else if(showNameFlag == 2){

        return '平均温度';

    }else if(showNameFlag == 2){

        return '客流量';
    }

};










