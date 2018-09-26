/**
 * Created by admin on 2018/9/13.
 */
$(function(){

    //日期初始化
    _timeYMDComponentsFun($('.min'));

    $('.choose-time-select ul li').eq(0).click();

    //默认加载数据
    GetShowEnergyNormItem(100,true);

    //点击页面查询按钮
    $('.demand').on('click',function(){

        //获取页面中具体数据
        var flag = $('.choose-object-select').find('.onChoose').attr('data-id');

        getContentData(flag);

    });


    //切换选择的对象时
    $('.choose-object-select .the-select-message').on('click',function(){

        //获取当前能耗
        var energyType = $('.left-choose-energy-container .time-radio:checked').attr('data-type');

        setTimeout(function(){

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

    //改变指标类型 右上角单位跟着改变
    $('.choose-target-select').on('click','.the-target-message',function(){

        var unit = $(this).attr('data-unit');

        //改变右上角单位名称
        $('.the-unit').val(unit);

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
    grid: {
        left: '3%',
        right: '8%',
        containLabel: true,
        borderColor:'#DCDCDC'
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
            axisLabel : {
                formatter: '{value} '
            },
            axisLine:{
                lineStyle:{
                    color:'#666',
                    width:1//这里是为了突出显示加上的
                }
            }
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
            itemStyle : {
                normal : {
                    lineStyle:{
                        color:'#5B69D2'
                    }
                }
            },
            color:['#5B69D2'],
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

    // console.log(energyNormItemArr);
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

    //在指标类型中寻找对应项
    $(energyNormItemArr).each(function(i,o){

        if(o.normIndex == normItemID){

            energyNormItemObj = o
        }
    });


    //获取名称
    var areaName = $('.choose-object1  .onChoose').html();

    //当前选中的能耗类型
    if(flag != 2){

        _ajaxEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id');

    }else{

        _ajaxEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id1');

    }

    var commonEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id');


    _ajaxEcTypeWord = getEtName(commonEcType);


    //楼宇数据
    if(flag == 1){

        url = 'EnergyManageV2/GetPointerRankData';

        //获取session中存放的楼宇ID
        var pointerArr = JSON.parse(sessionStorage.getItem('pointers'));

        $(pointerArr).each(function(i,o){

            postPointerID.push(o.pointerID);
        });

        //分户数据
    }else if(flag == 2){

        url = 'EnergyManageV2/GetOfficeRankData';

        //获取session中存放的楼宇ID
        var officeArr = JSON.parse(sessionStorage.getItem('offices'));

        $(officeArr).each(function(i,o){

            officeID.push(o.f_OfficeID);
        });

    }

    //判断是否标煤
    if($('.left-choose-energy-container .time-radio:checked').parents('.choose-energy').find('label').html() == '标煤'){
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
            }
            _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
        }
    })
}

//获取指标类型
//flag 是否默认加载数据
function GetShowEnergyNormItem(energyType,flag){

    //判断当前对象类型
    var index = $('.choose-object-select .onChoose').attr('data-id')-1;

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

                    $('.choose-target font').html( o.energyItemName);

                    $('.the-unit').val(o.energyUnit);

                }else{
                    html += '<li data-num ="'+ o.normIndex+'" class="the-select-message the-target-message " data-unit="'+ o.energyUnit+'">'+ o.energyItemName+'</li>'
                }

            });


            //将指标类型嵌入页面
            $('.choose-target-select ul').html(html);


            if(flag){

                //获取页面中具体数据
                var postFlag = $('.choose-object-select').find('.onChoose').attr('data-id');

                getContentData(postFlag);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })

}

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
    var unit = $('.the-unit').val();
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

            html1 += '<th><span title="'+o.returnOBJName+'"><a target="_blank" href="../new-frame-nenghaoshuju/energyOfficePanking.html?id='+ o.returnOBJID+'" >'+ o.returnOBJName.substring(0,4)+'</a></span></th>'

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
