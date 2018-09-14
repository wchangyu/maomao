/**
 * Created by admin on 2018/9/13.
 */

$(function(){

    //日期初始化
    _timeYMDComponentsFun($('.min'));

    //楼宇ztree树
    _pointerZtree = _getPointerZtree($("#allPointer"),1);

    //科室ztree树
    _officeZtree = _getOfficeZtree($("#allOffices"),1);

    //楼宇搜索功能
    _searchPO($(".tipess"),"allPointer",$(".tipes"),"allOffices");


    //默认勾选第一个楼宇
    var zTree = $.fn.zTree.getZTreeObj("allPointer");
    var nodes = zTree.getNodes();

    zTree.checkNode(nodes[0], false, false);  //父节点不被选中

    zTree.checkNode(nodes[0].children[0].children[0], true, true);

    //获取支路
    GetAllBranches();

    //页面初始化
    $('.choose-object-windows .sure').click();

    //点击页面查询按钮
    $('.demand').on('click',function(){

        //获取页面中具体数据
        var flag = onChooseObjectType + 1;

        getContentData(flag);

    });

    ////默认加载数据
    GetShowEnergyNormItem(100,true);

    //改变右上角单位时
    $('#unit').on('change',function() {

        $('.demand').click();

    });

    //切换选择的对象时
    $('.choose-object-windows .sure').on('click',function(){

        setTimeout(function(){

            //获取当前能耗
            var energyType = $('.left-choose-energy-container .time-radio:checked').attr('data-type');

            //改变指标类型
            GetShowEnergyNormItem(energyType);

        },10);

    });

    //点击改变能耗种类
    $('.left-choose-energy-container .time-radio').on('change',function(){

        //获取当前能耗
        var energyType = $('.left-choose-energy-container .time-radio:checked').attr('data-type');

        //改变指标类型
        GetShowEnergyNormItem(energyType);

    });

    //改变指标类型 右上角单位跟着改变
    $('.choose-target-select ul').on('click','.the-target-message',function(){

        //改变右上角单位名称
        $('.unit').val($(this).attr('data-unit'));

    });

    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
        }
    };

});

//存放获取到的指标类型
var energyNormItemArr = [];

var _pointerZtree;
var _officeZtree;

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

/*---------------------------------echart-----------------------------------*/
//定义存放返回数据的数组（本期 X Y）
var allData = [];
var allDataX = [];
var allDataY = [];

//echart图颜色
var echartColorArr = ['#F2285C','#7DC79B'];

var echartObj =  {name:'数据',
    type:'line',
    smooth:true,

    //markPoint : {
    //    data : [
    //        {type : 'max', name: '最大值'},
    //        {type : 'min', name: '最小值'}
    //    ],
    //    itemStyle : {
    //        normal:{
    //            color:'#019cdf'
    //        }
    //    },
    //    label:{
    //        normal:{
    //            textStyle:{
    //                color:'#d02268'
    //            }
    //        }
    //    }
    //},
    //markLine : {
    //    data : [
    //        {type : 'average', name: '平均值'}
    //
    //
    //    ]
    //},
    data:[]
};

//同比柱状图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

//环比柱状图
var myChartTopLeft1 = echarts.init(document.getElementById('rheader-content-17'));

//柱状图配置项
var optionBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['本期用电','上期用电'],
        top:'20'
    },
    toolbox: {
        show : true,
        feature : {
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
            data : ['本期','上期'],
            axisLine:{
                lineStyle:{
                    color:'#666',
                    width:1//这里是为了突出显示加上的
                }
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLine:{
                lineStyle:{
                    color:'#666',
                    width:1//这里是为了突出显示加上的
                }
            }
        }
    ],
    grid: {
        left: '1%',
        right: '8%',
        bottom:'2%',
        containLabel: true,
        borderColor:'#DCDCDC'
    },
    series : [
        {
            name:'本期用电',
            type:'bar',
            data:[],
            color:['#5B69D2'],
            barMaxWidth: '60'
        },
        {
            name:'上期用电',
            type:'bar',
            data:[],
            color:['#7DC79B'],
            barMaxWidth: '60'
        }
    ]
};

//柱折图配置项
var optionLineBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['数据', '比较斜率'],
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
            type : 'value'
        }
    ],
    grid: {
        left: '20%',
        right: '10%'
    },
    series : [
        {
            name:'数据',
            type:'bar',
            barMaxWidth: '50',
            data:[],
            itemStyle:{
                normal:{
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                            '#d53a35','#2f4554','#FCCE10','#E87C25','#27727B',
                            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                        ];
                        return colorList[params.dataIndex]
                    },
                }
            }
        },
        {
            name:'比较斜率',
            type:'line',
            data:[]
        }
    ]
};

//折线图配置项
var optionLine = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['数据'],
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
            data : ['本期','上期'],
            axisLine:{
                lineStyle:{
                    color:'#666',
                    width:1//这里是为了突出显示加上的
                }
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLine:{
                lineStyle:{
                    color:'#666',
                    width:1//这里是为了突出显示加上的
                }
            }
        }
    ],
    grid: {
        left: '1%',
        right: '8%',
        containLabel: true,
        borderColor:'#DCDCDC'
    },
    series : [
        {
            name:'数据',
            type:'line',
            smooth:true,
            itemStyle : {
                normal : {
                    lineStyle:{
                        color:'#F2285C'
                    }
                }
            },
            color:['#F2285C'],
            markPoint : {
                data : [
                    {
                        type : 'max',
                        name: '最大值',
                        itemStyle:{
                            color:'#F35651'
                        },
                        label:{
                            normal:{
                                textStyle:{
                                    color:'#333'
                                }
                            }
                        }

                    },
                    {
                        type : 'min',
                        name: '最小值',
                        itemStyle:{
                            color:'#5B69D2'
                        }
                    }
                ],
                label:{
                    normal:{
                        textStyle:{
                            color:'#333'
                        }
                    }
                }
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}


                ]
            },
            data:[]
        }
    ]
};


//获取页面具体数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getContentData(flag){

    //存放访问后台的地址
    var url = '';

    var totalAllData = 0;

    //存放要传的楼宇集合
    var postPointerID = [];

    //存放要传递的分户集合
    var officeID = [];

    //存放要传的支路ID
    var serviceID = [];

    //存放要传递的指标类型
    var energyNormItemObj = {};

    //获取指标ID
    var normItemID = $('.choose-target-select .onChoose').attr('data-num');

    //支路是否瞬时值标识
    var f_AddSamAvg = 0;

    var branchUnit = '';

    if(normItemID){
        //在指标类型中寻找对应项
        $(energyNormItemArr).each(function(i,o){

            if(o.normIndex == normItemID){

                energyNormItemObj = o
            }
        });
    }

    //获取名称
    var areaName = '';

    //楼宇数据
    if(flag == 1){

        url = 'EnergyQueryV2/GetPointerCompareData';

        //确定楼宇id
        var pts = _pointerZtree.getSelectedPointers();

        $(pts).each(function(i,o){

            postPointerID.push(o.pointerID);


        });

        //页面上方展示信息
        areaName = $('#allPointer .radio_true_full').next().html();


        //分户数据
    }else if(flag == 2){

        url = 'EnergyQueryV2/GetOfficeCompareData';

        //确定分户id
        var ofs = _officeZtree.getSelectedOffices();


        $( ofs).each(function(i,o){

            officeID.push(o.f_OfficeID);

            //页面上方展示信息
            areaName += o.f_OfficeName;
        });

    }else if(flag == 3){

        url = 'EnergyQueryV2/GetBranchCompareData';

        //确定支路id
        var nodes = branchTreeObj.getCheckedNodes(true);

        if(nodes.length < 1){
            _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择支路查询', '');

            return false;
        }

        $( nodes).each(function(i,o){

            serviceID.push(o.id);

            //页面上方展示信息
            areaName += o.name;
        });

        //本地构建energyNormItemObj对象
        energyNormItemObj.energyItemID = _ajaxEcType;

        energyNormItemObj.energyNormFlag = 1;

        f_AddSamAvg = nodes[0].f_AddSamAvg;

        branchUnit = nodes[0].unit;
    }

    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){
        _ajaxEcType = -2;
    }

    //获取当前时间类型
    var dateType = $('.choose-time-select .onChoose').html();

    //获取展示日期类型
    var showDateType =   getCurShowDateType(dateType)[0];

    //获取用户选择日期类型
    var selectDateType =   getCurShowDateType(dateType)[1];

    //获取开始时间
    var startTime = getCurPostTime(dateType)[0];

    //获取开始时间
    var endTime = getCurPostTime(dateType)[1];

    //定义获得数据的参数
    var ecParams = {
        "energyNorm":energyNormItemObj ,
        "energyItemID": _ajaxEcType,
        "pointerIDs": postPointerID,
        "officeIDs": officeID,
        "serviceIDs": serviceID,
        "f_AddSamAvg": f_AddSamAvg,
        "unityType": 0,
        "showDateType": showDateType,
        "selectDateType": selectDateType,
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
            myChartTopLeft1.showLoading();
        },
        success:function(result){
            myChartTopLeft.hideLoading();
            myChartTopLeft1.hideLoading();

            //console.log(result);

            //判断是否返回数据
            if(result == null || result.length == 0){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }


            //console.log(selectDateType);

            $('.rheader-content-rights').eq(1).show();

            //年没有环比数据
            if(selectDateType == 'Year'){

                //console.log(33);

                $('.right-header').eq(1).hide();

                $('.comparisonOfHistograms').eq(1).hide();

                $('#rheader-content-17').hide();

            }else{

                $('.right-header').eq(1).show();

                $('.comparisonOfHistograms').eq(1).show();

                $('#rheader-content-17').show();

            }

            //如果选择支路 且为瞬时值
            if(flag == 3 && f_AddSamAvg != 0){

                $('.comparisonOfHistograms').hide();

                $('.unit').hide();

                $('#rheader-content-16').css({

                    'marginRight': '0px'
                });

                $('#rheader-content-17').css({

                    'marginRight': '0px'
                });

                //单位
                $('.header-right-lists label').html("单位："+branchUnit);

            }else{

                $('.comparisonOfHistograms').show();

                $('.unit').show();

                $('#rheader-content-16').css({

                    'marginRight': '300px '
                });

                $('#rheader-content-17').css({

                    'marginRight': '300px '
                });

                //单位
                $('.header-right-lists label').html("单位：");
            }

            window.onresize();

            //改变头部显示信息
            var energyName = '';

            if($('.choose-target-select .onChoose').length > 0){
                energyName = $('.choose-target-select .onChoose').html();
            }

            //改变头部日期
            var date = startTime +" — " + moment(endTime).subtract('1','days').format('YYYY/MM/DD');

            $('.right-header-title').html('同比分析 &nbsp;' + energyName + ' &nbsp;' + areaName + ' &nbsp;' + date);

            $('.right-header-title1').html('环比分析 &nbsp;' + energyName + ' &nbsp;' + areaName + ' &nbsp;' + date);

            //首先处理本期的数据
            allData.length = 0;

            allData = result.currentCompardData.ecMetaDatas;

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

                    dataSplit = dataSplit.split('-')[1] + "-"+dataSplit.split('-')[2];

                    allDataX.push(dataSplit);

                }
            };

            //确定本期y轴
            for(var i=0;i<allData.length;i++){

                allDataY.push(allData[i].data.toFixed(2));

            };

            //同比数据
            var yearAllDataY = [];
            $(result.lastYearCompardData.ecMetaDatas).each(function(i,o){

                yearAllDataY.push(o.data.toFixed(2));

            });

            //echart柱状图
            optionBar.xAxis[0].data = allDataX;
            optionBar.series[0].data = allDataY;
            optionBar.series[1].data = yearAllDataY;

            myChartTopLeft.setOption(optionBar,true);

            //右侧数据统计
            //本期累计
            $('.rheader-content-rights').eq(0).find('.count1 span').html(result.currentCompardData.sumMetaData.toFixed(2));

            //上年同期累计
            $('.rheader-content-rights').eq(0).find('.count2 span').html(result.lastYearCompardData.sumMetaData.toFixed(2));

            //上方百分比
            $('.rheader-content-rights').eq(0).find('.top-percent').html((Math.abs(result.lastYearEnergyPercent*100)).toFixed(2) + "%");

            //箭头朝向
            $('.rheader-content-rights').removeClass('data-equal1');

            $('.rheader-content-rights').removeClass('data-up1');

            $('.rheader-content-rights').removeClass('data-down1');

            if(result.lastYearEnergyPercent < 0){

                $('.rheader-content-rights').eq(0).addClass('data-down1');

            }else if(result.lastYearEnergyPercent == 0){

                $('.rheader-content-rights').eq(0).addClass('data-equal1');

            }else if(result.lastYearEnergyPercent > 0){

                $('.rheader-content-rights').eq(0).addClass('data-up1');

            }

            //环比数据
            var chainAllDataY = [];

            if(selectDateType != 'Year'){

                $(result.chainCompardData.ecMetaDatas).each(function(i,o){

                    chainAllDataY.push(o.data.toFixed(2));

                });
            }else{

                $('.rheader-content-rights').eq(1).hide();

            }


            //右侧数据统计
            //本期累计
            $('.rheader-content-rights').eq(1).find('.count1 span').html(result.currentCompardData.sumMetaData.toFixed(2));

            //上年同期累计
            $('.rheader-content-rights').eq(1).find('.count2 span').html(result.chainCompardData.sumMetaData.toFixed(2));

            //上方百分比
            $('.rheader-content-rights').eq(1).find('.top-percent').html((Math.abs(result.chainEnergyPercent*100)).toFixed(2) + "%");

            //箭头朝向
            if(result.chainEnergyPercent < 0){

                $('.rheader-content-rights').eq(1).addClass('data-down1');

            }else if(result.chainEnergyPercent == 0){

                $('.rheader-content-rights').eq(1).addClass('data-equal1');

            }else{

                $('.rheader-content-rights').eq(1).addClass('data-up1');


            }

            //如果没有数据 改变展示方式
            if(result.lastYearCompardData.sumMetaData == 0){

                //上年同期累计
                $('.rheader-content-rights').eq(0).find('.count2 span').html('--');

                //上方百分比
                $('.rheader-content-rights').eq(0).find('.top-percent').html('--');

            }

            if(result.currentCompardData.sumMetaData == 0){

                //上年同期累计
                $('.rheader-content-rights').eq(1).find('.count2 span').html('--');

                //上方百分比
                $('.rheader-content-rights').eq(1).find('.top-percent').html('--');

            }

            //echart柱状图
            optionBar.xAxis[0].data = allDataX;
            optionBar.series[0].data = allDataY;
            optionBar.series[1].data = chainAllDataY;

            myChartTopLeft1.setOption(optionBar,true);


        },
        error:function(jqXHR, textStatus, errorThrown){
            myChartTopLeft.hideLoading();
            myChartTopLeft1.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
            }

        }
    })
}

//获取指标类型
//flag 是否默认加载数据
function GetShowEnergyNormItem(energyType,flag){

    //判断当前对象类型
    var index = onChooseObjectType;

    //支路无对比内容
    if(index > 2){

        $('.choose-target-select ul').html('');

        $('.choose-target-select font').html('');

        return false;
    }

    //要传递的数据
    var ecParams = {
        OBJFlag : index
    };

    $.ajax({
        type: 'get',
        url: sessionStorage.apiUrlPrefix + 'EnergyQueryV2/GetShowHorCompareItem',
        data: ecParams,
        success: function (result) {

            var html = '';

            var unitHtml = '';
            //指标类型清空
            energyNormItemArr.length = 0;

            var dataArr = [];

            $(result).each(function(i,o){
                //指标类型重新赋值
                energyNormItemArr.push(o);
                //获取对应能耗类型下的指标
                if(o.energyType == energyType){
                    dataArr.push(o);
                }
            });

            $(dataArr).each(function(i,o){

                //如果是第一个默认选中
                if(i == 0){
                    html += '<li data-num ="'+ o.normIndex+'" class="the-select-message the-target-message onChoose" data-unit="'+ o.energyUnit+'">'+ o.energyItemName+'</li>';
                    //右上角单位
                    $('.unit').val(o.energyUnit);

                    $('.choose-target font').html( o.energyItemName);

                }else{

                    html += '<li data-num ="'+ o.normIndex+' " data-unit="'+ o.energyUnit+'" class="the-select-message the-target-message">'+ o.energyItemName+'</li>'

                }

            });

            html += '<div class="clearfix"></div>';

            //将指标类型嵌入页面
            $('.choose-target-select ul').html(html);

            //改变单位

            if(flag){

                //获取页面中具体数据
                var flag1 = onChooseObjectType + 1;

                getContentData(flag1);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })

}
