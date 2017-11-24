$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

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

    //楼宇ztree树
    _pointerZtree = _getPointerZtree($("#allPointer"),1);

    //科室ztree树
    _officeZtree = _getOfficeZtree($("#allOffices"),1);

    //楼宇搜索功能
    _searchPO($(".tipess"),"allPointer",$(".tipes"),"allOffices");

    //获取支路
    GetAllBranches();

    //默认加载数据
    getPointerData('EnergyAnalyzeV2/GetPointerEnergyTendData',1);

    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){
        //获得选择的能耗类型
        _ajaxEcType =_getEcTypeValue(_ajaxEcType);

        //先判断获取的是楼宇还是科室
        var o = $('.tree-0')[0].style.display;
        //科室状态
        var a = $('.tree-2')[0].style.display;
        //分户状态
        var s = $('.tree-3')[0].style.display;


        if(o != 'none'){
            //楼宇数据
            getPointerData('EnergyAnalyzeV2/GetPointerEnergyTendData',1);

        }else if(a == 'block'){
            //分户数据
            getPointerData('EnergyAnalyzeV2/GetOfficeEnergyTendData',2);

        }else if(s == 'block'){
            //支路数据
            getPointerData('EnergyAnalyzeV2/GetBranchEnergyTendData',3);

        }
    });

    //能耗选择
    $('.energy-types').on('click','div',function(){

        //获取能耗选择名称
        var energyName = $(this).find('p').html();

        //给右侧上方用能趋势切换按钮赋值
        $('.header-right-btn font').html(energyName);
    });

    //对象选择
    $('.left-middle-tab').on('click',function(){

        //获取能耗选择名称
        var energyName = $('.selectedEnergy').find('p').html();

        //给右侧上方用能趋势切换按钮赋值
        $('.header-right-btn font').html(energyName);
    });


    //右上角注释图标
    $('.right-text').on('click',function(){

        $('.text-content').toggle('fast');

        //获取用能趋势标识
        var index = $('.header-right-btn .cur-on-choose').index();

    });

    //右上角用能趋势的切换
    $('.header-right-btn span').on('click',function(){

        $('.header-right-btn span').removeClass('cur-on-choose');

        $(this).addClass('cur-on-choose');

        //获取用能趋势标识
        var index = $('.header-right-btn .cur-on-choose').index();
        //动态改变右上角注释
        if(index == 0){
            $('.text-content').html(tendencyHelpInfo.tendencyHelpInfo12);
        }else{
            $('.text-content').html(tendencyHelpInfo.tendencyHelpInfo52);
        }

        $('.buttons').children('.btn-success').click();
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

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

//记录右上角提示信息
var tendencyHelpInfo = {};

var allData = [];
var allDataX = [];
var allDataY = [];

/*---------------------------------echart-----------------------------------*/
//折线图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

//柱折图配置项
// 指定图表的配置项和数据
option = {

    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        show:true,
        data:['用能趋势','折线']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    dataZoom: [
        {
            type: 'inside'
        }
    ],
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
            data : []
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
            name:'用能趋势',
            type:'bar',
            data:[],
            smooth:true,
            stack:  '总量',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            itemStyle: {
                normal: {
                    color: '#9dc541'
                },
                emphasis: {
                    barBorderColor: 'rgba(0,0,0,0.5)',
                    color: '#9dc541'
                }
            },
            data: [],
            barMaxWidth: '60'

        },
        {
            name:'折线',
            type:'line',
            itemStyle : {  /*设置折线颜色*/
                normal : {
                    color:'#9dc541'
                }
            },
            smooth:true,
            data:[]
        }
    ]
};

/*---------------------------------otherFunction------------------------------*/

//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPointerData(url,flag){
    //定义存放返回数据的数组（本期 X Y）

    var totalAllData = 0;

    //存放要传的楼宇集合
    var postPointerID = [];

    //存放要传的分户ID
    var officeID = '';

    //存放要传的支路ID
    var serviceID = '';

    //获取名称
    var areaName = '';

    //楼宇数据
    if(flag == 1){
        //确定楼宇id
        var pts = _pointerZtree.getSelectedPointers(),pointerID;

        $(pts).each(function(i,o){

            postPointerID.push(o.pointerID)
        });
        areaName = $('.radio_true_full').next().attr('title');

        //分户数据
    }else if(flag == 2){
        //确定分户id
        var ofs = _officeZtree.getSelectedOffices();

        officeID = ofs[0].f_OfficeID;

        areaName = ofs[0].f_OfficeName;
        //支路数据
    }else if(flag == 3){
        //确定支路id
        var nodes = branchTreeObj.getCheckedNodes(true);

        //确定支路id
        serviceID = nodes[0].id;

        areaName = nodes[0].name;
    }

    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){
        _ajaxEcType = -2;
        //标煤
        isBiaoMeiEnergy = 1;
    }


    //获取开始时间
    var startTime = getPostTime()[0];

    //获取用能趋势标识
    var tendencyFlag = $('.header-right-btn .cur-on-choose').index();

    //定义获得数据的参数
    var ecParams = {
        "energyItemID": _ajaxEcType,
        "selectDate": startTime,
        "pointerIDs": postPointerID,
        "officeID": officeID,
        "serviceID": serviceID,
        "tendencyFlag": tendencyFlag
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


            //判断是否返回数据
            if(result == null){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }
            //改变头部显示信息
            var energyName = $('.selectedEnergy p').html() + '耗';

            //头部用能趋势信息
            var energyFlag = $('.header-right-btn .cur-on-choose').html();

            //改变头部日期
            var date = startTime;

            $('.right-header-title').html(energyName + ' &nbsp;' + areaName + ' &nbsp;' + energyFlag+ ' &nbsp;'+ date);

            //首先处理本期的数据
            allData.length = 0;

            if(tendencyFlag == 0){

                $(result.monthMetaDataExtends).each(function(i,o){
                    allData.push(o);
                });

            }else{

                $(result.weekEcMetaDataExtends).each(function(i,o){
                    allData.push(o);
                });
            }


            //首先处理实时数据
            allDataX.length = 0;
            allDataY.length = 0;

            //绘制echarts

            //确定x轴
            for(var i=0;i<allData.length;i++){
                var dataSplit = allData[i].dataRange;
                allDataX.push(dataSplit);

            }

            //确定本期y轴
            for(var i=0;i<allData.length;i++){
                allDataY.push(allData[i].data.toFixed(2));
            }

            //echart柱状图
            option.xAxis[0].data = allDataX;
            option.series[0].data = allDataY;
            option.series[1].data = allDataY;
            //单位
            var unit = $('#unit').find("option:selected").text();

            option.yAxis[0].axisLabel.formatter = '{value}' + unit + '';


            myChartTopLeft.setOption(option);

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

//获取右上角提示信息
getEnergyTendConfig();

function getEnergyTendConfig(){

    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'EnergyAnalyzeV2/GetEnergyTendConfig',
        timeout:_theTimes,
        beforeSend:function(){

        },
        success:function(result) {

            tendencyHelpInfo = result;

            $('.text-content').html(tendencyHelpInfo.tendencyHelpInfo12);
        },
        error:function(jqXHR, textStatus, errorThrown){

        }
    })

};

