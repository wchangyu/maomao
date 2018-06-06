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


    //加载默认能耗类型单位
    var html = '';
    $(unitArr3).each(function(i,o){
        html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'
    });

    $('#unit').html(html);

    //默认加载数据

    GetShowEnergyNormItem(100,true);

    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){
        //获得选择的能耗类型
        _ajaxEcType =_getEcTypeValue(_ajaxEcType);

        var o = $('.left-middle-main .curChoose').index();

        if(o == 0){
            //楼宇数据
            getPointerData('EnergyQueryV2/GetPointerEnergyNormData',1);

        }else if(o == 1){
            //分户数据
            getPointerData('EnergyQueryV2/GetOfficeEnergyNormData',2);

        }
    });

    //能耗选择
    $('.typee').click(function(){
        $('.typee').removeClass('selectedEnergy');
        $(this).addClass('selectedEnergy');

    });

    //点击切换楼宇或单位时，改变上方能耗类型
    $('.left-middle-main p').on('click',function(){

        $('.left-middle-main p').removeClass('curChoose');

        $(this).addClass('curChoose');
        //判断页面中是否存在能耗类型选项
        if(typeof _energyTypeSel!="undefined" ){
            if($(this).index() == 0){

                _energyTypeSel.initPointers($(".energy-types"),undefined,function(){
                    getEcType();
                });

            }else if($(this).index() == 1){

                _energyTypeSel.initOffices($(".energy-types"),undefined,function(){
                    getEcType();
                });
            }
            //改变右上角单位
            var html = '';
            $(unitArr3).each(function(i,o){
                html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'
            });

            $('#unit').html(html);

            //如果当前页面存在支路
            if($('#allBranch').length > 0){
                //获取当前楼宇下的支路
                GetAllBranches();
            }
            //默认选中第一个能耗
            $('.selectedEnergy').addClass('blueImg0');
        }else{

        };

        //获取指标类型
        var energyType = $('.selectedEnergy').attr('value');

        GetShowEnergyNormItem(energyType);

    });

    //改变右上角单位时
    $('#unit').on('change',function() {

        $('.buttons').children('.btn-success').click();
    });

    //改变能耗类型 改变对应的指标
    $('.energy-types').on('click','div',function(){

        //获取当前能耗类型
        var energyType = $('.selectedEnergy').attr('value');

        GetShowEnergyNormItem(energyType);

    });

    //改变指标类型 右上角单位跟着改变
    $('.left-middle-main1').on('click','p',function(){

        $('.left-middle-main1 p').removeClass('curChoose');

        $(this).addClass('curChoose');

        //改变右上角单位名称
        changeUnit();
    });

    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
        }
    };

    var zoomSize = 6;
    myChartTopLeft.on('click', function (params) {
        console.log(allDataX[Math.max(params.dataIndex - zoomSize / 2, 0)]);
        myChartTopLeft.dispatchAction({
            type: 'dataZoom',
            startValue: allDataX[Math.max(params.dataIndex - zoomSize / 2, 0)],
            endValue: allDataX[Math.min(params.dataIndex + zoomSize / 2, allDataY.length - 1)]
        });
    });

});

//存放获取到的指标类型
var energyNormItemArr = [];

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

/*---------------------------------echart-----------------------------------*/
//定义存放返回数据的数组（本期 X Y）
var allData = [];
var allDataX = [];
var allDataY = [];

//折线图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

//柱状图配置项
var optionBar = {

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
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            show:'true',
            type : 'category',
            data:[]
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    dataZoom: [
        {
            type: 'inside'
        }
    ],
    series : [
        {
            name:'数据',
            type:'bar',
            data:[],
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

            },
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
            data:[],
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
            data : ['本期','上期']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    grid: {
        left: '10%',
        right: '8%'
    },
    series : [
        {
            name:'数据',
            type:'line',
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

            },
            data:[]
        }
    ]
};

/*---------------------------------otherFunction------------------------------*/

//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPointerData(url,flag){

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
    var normItemID = $('.left-middle-main1 .curChoose').attr('data-num');

    //在指标类型中寻找对应项
    $(energyNormItemArr).each(function(i,o){

        if(o.normIndex == normItemID){

            energyNormItemObj = o
        }
    });

    //单位类型
    var unitType = $('#unit').val();

    //获取名称
    var areaName = $('.left-middle-main .curChoose').html();

    //楼宇数据
    if(flag == 1){
        //获取session中存放的楼宇ID
        var pointerArr = JSON.parse(sessionStorage.getItem('pointers'));

        $(pointerArr).each(function(i,o){

            postPointerID.push(o.pointerID);
        });

    //分户数据
    }else if(flag == 2){
        //获取session中存放的楼宇ID
        var officeArr = JSON.parse(sessionStorage.getItem('offices'));

        $(officeArr).each(function(i,o){

            officeID.push(o.f_OfficeID);
        });

    }

    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){
        _ajaxEcType = -2;
    }

    //获取展示日期类型
    var showDateType = getShowDateType()[0];

    //获取用户选择日期类型
    var selectDateType = getShowDateType()[1];

    //获取开始时间
    var startTime = getPostTime()[0];

    //获取开始时间
    var endTime = getPostTime()[1];

    //定义获得数据的参数
    var ecParams = {
        "energyNorm":energyNormItemObj ,
        "energyItemID": _ajaxEcType,
        "pointerIDs": postPointerID,
        "officeIDs": officeID,
        "serviceIDs": serviceID,
        "unityType": unitType,
        "showDateType": showDateType,
        "selectDateType": selectDateType,
        "startTime": startTime,
        "endTime": endTime
    }

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
            if(result == null){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }
            //改变头部显示信息
            var energyName = $('.left-middle-main1 .curChoose').html();

            //改变头部日期
            var date = startTime +" — " + moment(endTime).subtract('1','days').format('YYYY-MM-DD');

            $('.right-header-title').html(energyName + ' &nbsp;' + areaName + ' &nbsp;' + date);

            //首先处理本期的数据
            allData.length = 0;

            $(result).each(function(i,o){
                allData.push(o);
            });

            //首先处理实时数据
            allDataX.length = 0;
            allDataY.length = 0;

            //绘制echarts

                //确定x轴
            for(var i=0;i<allData.length;i++){

                allDataX.push(allData[i].returnOBJName);

            }

            //确定本期y轴
            for(var i=0;i<allData.length;i++){
                allDataY.push(allData[i].energyNormData.toFixed(2));
            }

            //echart柱状图
             optionBar.xAxis[0].data = allDataX;
             optionBar.series[0].data = allDataY;

            myChartTopLeft.setOption( optionBar);

        },
        error:function(jqXHR, textStatus, errorThrown){
            myChartTopLeft.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }
            _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
        }
    })
}

//获取指标类型
//flag 是否默认加载数据
function GetShowEnergyNormItem(energyType,flag){

    //判断当前对象类型
    var index = $('.left-middle-main .curChoose').index();

    //要传递的数据
    var ecParams = {
        OBJFlag : index
    };
    $.ajax({
        type: 'get',
        url: sessionStorage.apiUrlPrefix + 'EnergyQueryV2/GetShowEnergyNormItem',
        data: ecParams,
        success: function (result) {
           //console.log(result);
            var html = '';
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
                        html += '<p data-num ="'+ o.normIndex+'" class="curChoose">'+ o.energyItemName+'</p>'
                    }else{
                        html += '<p data-num ="'+ o.normIndex+'">'+ o.energyItemName+'</p>'
                    }

            });

            html += '<div class="clearfix"></div>';

            //将指标类型嵌入页面
            $('.left-middle-main1').html(html);

            //改变右上角单位名称
            changeUnit();

            if(flag){
                getPointerData('EnergyQueryV2/GetPointerEnergyNormData',1);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })

}

//改变单位
function changeUnit(){

    var dataArr = unitArr3;
    var attr = 'unitName';
    //获取当前能耗类型
    var energyType = $('.selectedEnergy').attr('value');

    if(energyType == 200){
        dataArr = unitArr4;
    }
    //获取当前指标类型
    var normType = $('.left-middle-main1 .curChoose').html();

    //console.log(normType);

    if(!normType){

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'当前能耗无指标类型', '');

        return false

    }

    if(normType.indexOf('床位') > 0){
        attr = 'unitName1';
    }

    var html = '';

    $(dataArr).each(function(i,o){

            html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'

    });

    $('#unit').html(html);
}

