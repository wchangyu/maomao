/**
 * Created by admin on 2018/9/10.
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

    //改变右上角单位时
    $('#unit').on('change',function() {

        $('.demand').click();

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

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

/*---------------------------------echart-----------------------------------*/
//折线图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

//柱状图配置项
var optionBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['本期用电','上期用电'],
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
    series : [
        {
            name:'本期用电',
            type:'bar',
            data:[],
            barMaxWidth: '60'
        },
        {
            name:'上期用电',
            type:'bar',
            data:[],
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

    //定义存放返回数据的数组（本期 X Y）
    var allData = [];
    var allDataX = [];
    var allDataY = [];
    var totalAllData = 0;

    //存放要传的楼宇集合
    var postPointerID = [];

    //存放要传的分户ID
    var officeID = '';

    //存放要传的支路ID
    var serviceID = '';

    //是否标煤
    var isBiaoMeiEnergy = 0;

    //单位类型
    var unitType = $('#unit').val();

    //获取名称
    var areaName = '';

    var treeObj = $.fn.zTree.getZTreeObj('allPointer');

    //定义查询标识
    var isPointerFlag = 0;

    //获取企业id
    var enterpriseID = '';

    //获取区域id
    var districtID = '';

    //支路是否瞬时值标识
    var f_AddSamAvg = 0;

    var branchUnit = '';

    //当前选中的能耗类型
    if(flag != 2){

        _ajaxEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id');

    }else{

        _ajaxEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id1');

    }

    var commonEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id');


    _ajaxEcTypeWord = getEtName(commonEcType);

    //console.log(_ajaxEcTypeWord )

    //楼宇数据
    if(flag == 1){

        url = 'EnergyQueryV2/GetPointerEnergyQuery';

        //确定楼宇id
        var pts = _pointerZtree.getSelectedPointers(),pointerID;

        //确定支路id
        var nodes = treeObj.getCheckedNodes(true)[0];

        //当前勾选企业
        if(nodes.nodeType == 1){

            isPointerFlag = 1;

            enterpriseID = nodes.id;

            //当前勾选区域
        }else if(nodes.nodeType == 0){

            isPointerFlag = 2;

            districtID = nodes.id;

        }else{

            $(pts).each(function(i,o){

                postPointerID.push(o.pointerID)
            });

        }

        areaName = $('.radio_true_full').next().attr('title');

        //分户数据
    }else if(flag == 2){

        url = 'EnergyQueryV2/GetOfficeEnergyQuery';

        //确定分户id
        var ofs = _officeZtree.getSelectedOffices();

        officeID = ofs[0].f_OfficeID;

        areaName = ofs[0].f_OfficeName;

        //支路数据
    }else if(flag == 3){

        url = 'EnergyQueryV2/GetBranchEnergyQuery';

        //确定支路id
        var nodes = branchTreeObj.getCheckedNodes(true);

        //确定支路id
        serviceID = nodes[0].id;

        areaName = nodes[0].name;

        f_AddSamAvg = nodes[0].f_AddSamAvg;

        branchUnit = nodes[0].unit;

        //console.log(nodes[0]);
    }

    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){

        _ajaxEcType = -2;

        //标煤
        isBiaoMeiEnergy = 1;
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

    ////如果当前选择的是自定义
    //var dateType = $('.time-options-1').html();

    //if(dateType == '自定义'){
    //
    //    //获取当前展示类型
    //    var showType = $('.chooseShowType').val();
    //
    //    endTime = $('#datetimepicker1').val();
    //
    //    //按日展示
    //    if(showType == 0){
    //
    //        showDateType = 'Day';
    //
    //        endTime = moment(endTime).add('1','days').format("YYYY-MM-DD");
    //
    //        //按小时展示
    //    }else if(showType == 1){
    //
    //        showDateType = 'Hour';
    //
    //        endTime = moment(endTime).add('1','h').format("YYYY-MM-DD HH:00");
    //
    //        //按分钟展示
    //    }else if(showType == 2){
    //
    //        showDateType = 'Minute';
    //
    //        endTime = moment(endTime).add('1','mm').format("YYYY-MM-DD HH:mm");
    //    }
    //}

    //定义获得数据的参数
    var ecParams = {
        "energyItemID": _ajaxEcType,
        "isBiaoMeiEnergy": isBiaoMeiEnergy,
        "pointerIDs": postPointerID,
        "officeID": officeID,
        "serviceID": serviceID,
        "unityType": unitType,
        "f_AddSamAvg": f_AddSamAvg,
        "showDateType": showDateType,
        "selectDateType": selectDateType,
        "startTime": startTime,
        "isPointerFlag": isPointerFlag,
        "enterpriseID": enterpriseID,
        "districtID": districtID,
        "endTime": endTime
    };

    if(startTime == "" || endTime == ""){

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请输入时间', '');
        return false;
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

            //判断是否返回数据
            if(result == null){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }

            //如果选择支路 且为瞬时值
            if(flag == 3 && f_AddSamAvg != 0){

                $('.comparisonOfHistograms').hide();

                $('#unit').hide();

                $('#rheader-content-16').css({

                    'marginRight': '0px'
                });

                //单位
                $('.header-right-lists label').html("单位："+branchUnit);

            }else{

                $('.comparisonOfHistograms').show();

                $('#unit').show();

                $('#rheader-content-16').css({

                    'marginRight': '300px '
                });

                //单位
                $('.header-right-lists label').html("单位：");
            }

            window.onresize();

            //改变头部显示信息
            var energyName = _ajaxEcTypeWord + '耗';

            //改变头部日期
            var date = startTime +" — " + moment(endTime).subtract('1','days').format('YYYY/MM/DD');

            if(dateType == '自定义'){

                date = startTime +" — " + $('#datetimepicker1').val();

            }

            $('.right-header-title').html(energyName + ' &nbsp;' + areaName + ' &nbsp;' + date);

            //首先处理本期的数据
            allData.length = 0;

            $(result.ecMetaDatas).each(function(i,o){
                allData.push(o);
            });

            //首先处理实时数据
            allDataX.length = 0;
            allDataY.length = 0;

            //绘制echarts
            if(dateType == '自定义'){
                if (showDateType == "Minute" || showDateType == "Hour"){

                    //确定x轴
                    for(var i=0;i<allData.length;i++){

                        allDataX.push(allData[i].dataDate.split('T')[0] + " " + allData[i].dataDate.split('T')[1]);
                    }

                }else{

                    for(var i=0;i<allData.length;i++){

                        allDataX.push(allData[i].dataDate.split('T')[0]);
                    }

                }

            }else if(showDateType == 'Hour' ){

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

            //确定本期y轴
            for(var i=0;i<allData.length;i++){
                allDataY.push(allData[i].data.toFixed(2));
            }

            //echart柱状图
            optionLine.xAxis[0].data = allDataX;
            optionLine.series[0].data = allDataY;

            myChartTopLeft.setOption(optionLine);

            //右侧展示信息
            //获取单位
            var unit = $('#unit').find("option:selected").text();

            //累计能耗
            $('#consumption-value-number').html((result.sumMetaData).toFixed(2));
            //单位
            $('.the-cumulative-power-unit').html(unit);

            //同比数据
            $('.compared-with-last-time').eq(0).find('label').html((result.lastYearEnergyData).toFixed(2));

            //同比百分比
            var percentYear = (result.lastYearEnergyPercent *100).toFixed(1);

            $('.rights-up-value').eq(0).html(Math.abs(percentYear) +'%');

            $('.rights-up').removeClass('data-down');

            $('.rights-up').removeClass('data-up');


            //同比小于0
            if(result.lastYearEnergyPercent  < 0){

                $('.rights-up').eq(0).addClass('data-down');

            }else if(result.lastYearEnergyPercent  > 0){

                $('.rights-up').eq(0).addClass('data-up');

            }

            //环比数据
            $('.compared-with-last-time').eq(1).find('label').html((result.chainEnergyData).toFixed(2));
            //环比百分比
            var percentChain = (result.chainEnergyPercent *100).toFixed(1);

            $('.rights-up-value').eq(1).html(Math.abs(percentChain) +'%');

            //环比小于0
            if(result.chainEnergyPercent  < 0){

                $('.rights-up').eq(1).addClass('data-down');

            }else if(result.chainEnergyPercent  > 0){

                $('.rights-up').eq(1).addClass('data-up');

            }

            //未获取到的数据 改变展示方式
            if(result.lastYearEnergyData == 0){

                $('.compared-with-last-time').eq(0).find('label').html('--');

                $('.rights-up-value').eq(0).html('--');

            }

            if(result.chainEnergyData == 0){

                $('.compared-with-last-time').eq(1).find('label').html('--');

                $('.rights-up-value').eq(1).html('--');

            }
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
