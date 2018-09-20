/**
 * Created by admin on 2018/9/15.
 */

$(function(){

    //日期初始化
    _timeYMDComponentsFun($('.min'));

    //获取当前能耗种类
    var _ajaxEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id');

    //获取当前单位
    var unit = getEtUnit(_ajaxEcType);

    $('.the-unit').val(unit);

    //楼宇ztree树
    _pointerZtree = _getPointerZtree($("#allPointer"),1);

    //科室ztree树
    _officeZtree = _getOfficeZtree($("#allOffices"),1);

    //楼宇搜索功能
    _searchPO($(".tipess"),"allPointer",$(".tipes"),"allOffices");

    //获取支路
    GetAllBranches();

    //默认勾选第一个楼宇
    var zTree = $.fn.zTree.getZTreeObj("allPointer");
    var nodes = zTree.getNodes();

    zTree.checkNode(nodes[0], false, false);  //父节点不被选中

    zTree.checkNode(nodes[0].children[0].children[0], true, true);

    //页面初始化
    $('.choose-object-windows .sure').click();

    //点击页面查询按钮
    $('.demand').on('click',function(){

        //获取页面中具体数据
        var flag = onChooseObjectType + 1;

        getContentData(flag);

    });

    $('.demand').click();


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

        $('.demand').click();

    });

    //点击改变能耗种类
    $('.left-choose-energy-container .time-radio').on('change',function(){

        //获取当前能耗名称
        var energyName = $('.left-choose-energy-container .time-radio:checked').parents('.choose-energy').find('label').html();

        //给右侧上方用能趋势切换按钮赋值
        $('.header-right-btn font').html(energyName);

    });

    //右上角注释图标
    $('.right-text').on('click',function(){

        $('.text-content').toggle('fast');

        //获取用能趋势标识
        var index = $('.header-right-btn .cur-on-choose').index();

    });

    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
        }
    };

});

var _pointerZtree;
var _officeZtree;
//记录右上角提示信息
var tendencyHelpInfo = {};

var allData = [];
var allDataX = [];
var allDataY = [];


//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

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
        left: '2%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        borderColor:'#DCDCDC'
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
            axisLine:{
                lineStyle:{
                    color:'#666',
                    width:1//这里是为了突出显示加上的
                }
            },
            data : []
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
            },
            axisLabel : {
                formatter: '{value} °C'
            }
        }
    ],
    series : [
        {
            name:'用能趋势',
            type:'bar',
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
                    color: '#5B69D2'
                },
                emphasis: {
                    barBorderColor: 'rgba(0,0,0,0.5)',
                    color: '#9dc541'
                }
            },
            color:['#5B69D2'],
            data: [],
            barMaxWidth: '60'

        },
        {
            name:'折线',
            type:'line',
            itemStyle : {  /*设置折线颜色*/
                normal : {
                    color:'#7dc79b'
                }
            },
            color:['#7dc79b'],
            smooth:true,
            data:[]
        }
    ]
};


//获取页面具体数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getContentData(flag){

    //存放访问后台的地址
    var url = '';

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

        url = 'EnergyAnalyzeV2/GetPointerEnergyTendData';

        //确定楼宇id
        var pts = _pointerZtree.getSelectedPointers(),pointerID;

        $(pts).each(function(i,o){

            postPointerID.push(o.pointerID)
        });
        areaName = $('.radio_true_full').next().attr('title');

        //分户数据
    }else if(flag == 2){

        url = 'EnergyAnalyzeV2/GetOfficeEnergyTendData';

        //确定分户id
        var ofs = _officeZtree.getSelectedOffices();

        officeID = ofs[0].f_OfficeID;

        areaName = ofs[0].f_OfficeName;
        //支路数据
    }else if(flag == 3){

        url = 'EnergyAnalyzeV2/GetBranchEnergyTendData';

        //确定支路id
        var nodes = branchTreeObj.getCheckedNodes(true);

        //确定支路id
        serviceID = nodes[0].id;

        areaName = nodes[0].name;
    }

    //当前选中的能耗类型
    if(flag != 2){

        _ajaxEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id');

    }else{

        _ajaxEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id1');

    }

    var commonEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id');


    _ajaxEcTypeWord = getEtName(commonEcType);


    //判断是否标煤
    if($('.left-choose-energy-container .time-radio:checked').parents('.choose-energy').find('label').html() == '标煤'){

        _ajaxEcType = -2;
        //标煤
        isBiaoMeiEnergy = 1;
    }

    //获取当前时间类型
    var dateType = $('.choose-time-select .onChoose').html();

    //获取开始时间
    var startTime = getCurPostTime(dateType)[0];

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
            var energyName = $('.left-choose-energy-container .time-radio:checked').parents('.choose-energy').find('label').html() + '耗';

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
