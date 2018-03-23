$(function(){

    //时间插件
    //_timeYMDComponentsFun($('.datatimeblock'));

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
    getPointerData('EnergyQueryV2/GetPointerEnergyQuery',1);

    //屏蔽右上角的元的数据
    var html = '';
    $(unitArr1).each(function(i,o){
        if(o.unitNum != 3){
            html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'
        }

    });

    $('#unit').html(html);

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
            getPointerData('EnergyQueryV2/GetPointerEnergyQuery',1);

        }else if(a == 'block'){
            //分户数据
            getPointerData('EnergyQueryV2/GetOfficeEnergyQuery',2);

        }else if(s == 'block'){
            //支路数据
            getPointerData('EnergyQueryV2/GetBranchEnergyQuery',3);

        }
    });

    //能耗选择
    $('.typee').click(function(){

        $('.typee').removeClass('selectedEnergy');

        $(this).addClass('selectedEnergy');
    });

    //改变右上角单位时
    $('#unit').on('change',function() {

        $('.buttons').children('.btn-success').click();
    });

    //点击切换楼宇或单位时，改变页面右上角单位
    $('.left-middle-tab').on('click',function(){

        //屏蔽右上角的元的数据
        var html = '';
        setTimeout(function(){
            $(unitArr1).each(function(i,o){
                if(o.unitNum != 3){
                    html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'
                }

            });
            $('#unit').html(html);
        },10)

    });

    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
        }
    };


});

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
        top:'30',
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
            barMaxWidth: '60',
        },
        {
            name:'上期用电',
            type:'bar',
            data:[],
            barMaxWidth: '60',
        }
    ]
};

//柱折图配置项
var optionLineBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['累计值', '比较斜率'],
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
            name:'累计值',
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
        data:['累计值'],
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
            name:'累计值',
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

    //获取展示日期类型
    var showDateType = getShowDateType()[0];

    //获取用户选择日期类型
    var selectDateType = getShowDateType()[1];

    //获取开始时间
    var startTime = getPostTime()[0];

    //获取开始时间
    var endTime = getPostTime()[1];

    //如果当前选择的是自定义
    var dateType = $('.time-options-1').html();

    if(dateType == '自定义'){

        //获取当前展示类型
        var showType = $('.chooseShowType').val();

        endTime = $('#datetimepicker1').val();

        //按日展示
        if(showType == 0){

            showDateType = 'Day';

         //按小时展示
        }else if(showType == 1){

            showDateType = 'Hour';

            endTime = moment(endTime).add('1','h').format("YYYY-MM-DD hh:00");

        //按分钟展示
        }else if(showType == 2){

            showDateType = 'Minute';

            endTime = moment(endTime).add('1','mm').format("YYYY-MM-DD hh:mm");
        }
    }

    //定义获得数据的参数
    var ecParams = {
        "energyItemID": _ajaxEcType,
        "isBiaoMeiEnergy": isBiaoMeiEnergy,
        "pointerIDs": postPointerID,
        "officeID": officeID,
        "serviceID": serviceID,
        "unityType": unitType,
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

            //改变头部日期
            var date = startTime +" — " + moment(endTime).subtract('1','days').format('YYYY-MM-DD');

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

                }

            } else if(showDateType == 'Hour' ){

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
            $('.compared-with-last-time').eq(0).find('label').html((result.lastYearEnergyData).toFixed(2))
            //同比百分比
            var percentYear = (result.lastYearEnergyPercent *100).toFixed(1);

            $('.rights-up-value').eq(0).html(Math.abs(percentYear) +'%');

            //同比小于0
            if(result.lastYearEnergyPercent  < 0){

                $('.rights-up').eq(0).addClass('decline');
            }else{
                $('.rights-up').eq(0).removeClass('decline');
            }

            //环比数据
            $('.compared-with-last-time').eq(1).find('label').html((result.chainEnergyData).toFixed(2))
            //环比百分比
            var percentChain = (result.chainEnergyPercent *100).toFixed(1);

            $('.rights-up-value').eq(1).html(Math.abs(percentChain) +'%');

            //环比小于0
            if(result.chainEnergyPercent  < 0){

                $('.rights-up').eq(1).addClass('decline');
            }else{
                $('.rights-up').eq(1).removeClass('decline');
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
