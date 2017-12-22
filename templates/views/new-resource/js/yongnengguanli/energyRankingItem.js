/**
 * Created by admin on 2017/11/23.
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

    ////默认加载数据
    GetShowEnergyNormItem(100,true);

    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){
        //获得选择的能耗类型
        _ajaxEcType =_getEcTypeValue(_ajaxEcType);

        var o = $('.left-middle-main .curChoose').index();

        if(o == 0){
            //楼宇数据
            getPointerData('EnergyManageV2/GetPointerRankData',1);

        }else if(o == 1){
            //分户数据
            getPointerData('EnergyManageV2/GetOfficeRankData',2);

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

        var unit = $(this).attr('data-unit')

        //改变右上角单位名称
        $('.unit').val(unit);
    });

    //改变展示数据的数量
    $('.header-right-btn span').on('click',function(){

        var index = $(this).index();

        $('.header-right-btn span').removeClass('cur-on-choose');

        $('.header-right-btn span').eq(index).addClass('cur-on-choose');

        //要展示的数据
        var postData = [];
        //前20项
        if(index == 0){

            postData =  allData1;
        //后20项
        }else if(index == 1){

            postData =  allData2;
         //全部
        }else if(index == 2){

            postData =  allData;
        }

        //判断是否是楼宇数据
        var index = $('.left-middle-main .curChoose').index();

        //楼宇数据
        if(index == 0){

            //传1为需要给头部添加链接
            showDataByNum(postData,1);

        }else{

            showDataByNum(postData);

        }



    });

    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
        }
    };

    //var zoomSize = 6;
    //myChartTopLeft.on('click', function (params) {
    //    console.log(allDataX[Math.max(params.dataIndex - zoomSize / 2, 0)]);
    //    myChartTopLeft.dispatchAction({
    //        type: 'dataZoom',
    //        startValue: allDataX[Math.max(params.dataIndex - zoomSize / 2, 0)],
    //        endValue: allDataX[Math.min(params.dataIndex + zoomSize / 2, allDataY.length - 1)]
    //    });
    //});

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
//前20项数据
var allData1 = [];
//后20项数据
var allData2 = [];

var allDataX = [];
var allDataY = [];

//定义最高值名称
var maxName = '';
var maxData = 0;
//定义最低值名称
var minName = '';
var minData = 0;

//折线图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

var theNum = 0;

//柱状图配置项
var optionBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['累计能耗'],
        top:'30'
    },
    grid: {
        bottom: '5%'
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
            type : 'value',
            axisLabel : {
                formatter: '{value} '
            }
        }
    ],
    //dataZoom: [
    //    {
    //        type: 'inside'
    //    }
    //],
    series : [
        {
            name:'累计能耗',
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
                        },
                        formatter: function(params) {

                            var arr = [maxName,minName];

                            var index = params.dataIndex;

                            return arr[index] + '\n'+params.value;
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

    if(normItemID){
        //在指标类型中寻找对应项
        $(energyNormItemArr).each(function(i,o){

            if(o.normIndex == normItemID){

                energyNormItemObj = o
            }
        });
    }

    //获取名称
    var areaName = $('.left-middle-main .curChoose').eq(0).html();

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
        "pointerIDs": postPointerID,
        "officeIDs": officeID,
        "selectDateType": selectDateType,
        "startTime": startTime,
        "endTime": endTime
    };

    //楼宇数据
    if(flag == 1){

        var obj = {
            "energyNorm":energyNormItemObj ,
            "selectDateType": selectDateType,
            "startTime": startTime,
            "endTime": endTime
        };

        //给session中存放楼宇信息 用于跳转
        sessionStorage.pointerMessage = JSON.stringify(obj);
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
            if(result == null || result.length == 0){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }
            //改变头部显示信息
            var energyName = '';

            if($('.left-middle-main1 .curChoose').length > 0){
                energyName = $('.left-middle-main1 .curChoose').html();
            }


            //改变头部日期
            var date = startTime +" — " + moment(endTime).subtract('1','days').format('YYYY-MM-DD');

            $('.right-header-title').eq(0).html(energyName + ' &nbsp;' + areaName + ' &nbsp;' + date);

            //首先处理本期的数据
            allData.length = 0;
            allData1.length = 0;
            allData2.length = 0;
            //默认展示前20项的数据
            $('.header-right-btn span').removeClass('cur-on-choose');

            $('.header-right-btn span').eq(0).addClass('cur-on-choose');

            $(result).each(function(i,o){
                allData.push(o);
                //前20项
                if(i < 20){
                    allData1.push(o)
                }
                //后20项
                var length = result.length;
                if(i > length - 21){
                    allData2.push(o)
                }
            });


            showDataByNum(allData1,flag);

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
        url: sessionStorage.apiUrlPrefix + 'EnergyManageV2/GetShowEnergyRankingItem',
        data: ecParams,
        success: function (result) {

            //console.log(result);

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
                    html += '<p data-num ="'+ o.normIndex+'" class="curChoose" data-unit="'+ o.energyUnit+'">'+ o.energyItemName+'</p>';
                    //右上角单位
                    $('.unit').val(o.energyUnit);
                }else{
                    html += '<p data-num ="'+ o.normIndex+' " data-unit="'+ o.energyUnit+'">'+ o.energyItemName+'</p>'
                }


            });
            html += '<div class="clearfix"></div>';
            //将指标类型嵌入页面
            $('.left-middle-main1').html(html);

            //改变单位

            if(flag){
                getPointerData('EnergyManageV2/GetPointerRankData',1);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })

};

//根据用户选择展示项数进行展示
function showDataByNum(data,flag){

    //首先处理实时数据
    var allDataX = [];
    var allDataY = [];

    $(data).each(function(i,o){

        //X轴数据
        allDataX.push(o.returnOBJName);

        //Y轴数据
        allDataY.push(o.currentEnergyData.toFixed(1));

        if(i==0){

            maxName = o.returnOBJName;

            maxData = o.currentEnergyData;

            minName = o.returnOBJName;

            minData = o.currentEnergyData;
        }else{

            if(o.currentEnergyData > maxData){

                maxName = o.returnOBJName;

            }else if(o.currentEnergyData < minData){

                minName = o.returnOBJName;
            }

        }
    });
    //单位
    var unit = $('.unit').val();
    optionBar.yAxis[0].axisLabel.formatter = '{value}' + unit + '';

    //echart柱状图
    optionBar.xAxis[0].data = allDataX;

    optionBar.series[0].data = allDataY;

    myChartTopLeft.setOption(optionBar,true);

    //表格中的数据
    var html1 = '<th></th>';

    //头部数据
    if(flag == 1){
        $(data).each(function(i,o){

            html1 += '<th><span title="'+o.returnOBJName+'"><a target="_blank" href="energyOfficePanking.html?id='+ o.returnOBJID+'" >'+ o.returnOBJName.substring(0,4)+'</a></span></th>'

        });

    }else{

        $(allDataX).each(function(i,o){

            html1 += '<th><span title="'+o+'">'+ o.substring(0,4)+'</span></th>'
        });
    }



    $('.table thead tr').html(html1);

    //同比数据
    var html2 = '<td>同比</td>';
    //环比数据
    var html3 = '<td>环比</td>';

    $(data).each(function(i,o){
        //同比数据
        if(o.currentLastYearRanking < 0){
            html2 += '<td class="down">'+ Math.abs(o.currentLastYearRanking)+'位</td>'
        }else if(o.currentLastYearRanking == 0){
            html2 += '<td class="equal">'+ o.currentLastYearRanking+'位</td>'
        }else{
            html2 += '<td class="up">'+ o.currentLastYearRanking+'位</td>'
        }

        //环比数据
        if(o.currentLastMonthRanking < 0){
            html3 += '<td class="down">'+ Math.abs(o.currentLastMonthRanking)+'位</td>'
        }else if(o.currentLastMonthRanking == 0){
            html3 += '<td class="equal">'+ o.currentLastMonthRanking+'位</td>'
        }else{
            html3 += '<td class="up">'+ o.currentLastMonthRanking+'位</td>'
        }

    });

    $('.table tbody tr').eq(0).html(html2);
    $('.table tbody tr').eq(1).html(html3);

}


