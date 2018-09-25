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


    //改变右上角单位时
    $('#unit').on('change',function() {

        $('.demand').click();

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

    //单位类型
    var unitType = $('#unit').val();

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

        url = 'EnergyQueryV2/GetPointerEnergyNormData';

        //获取session中存放的楼宇ID
        var pointerArr = JSON.parse(sessionStorage.getItem('pointers'));

        $(pointerArr).each(function(i,o){

            postPointerID.push(o.pointerID);
        });

        //分户数据
    }else if(flag == 2){

        url = 'EnergyQueryV2/GetOfficeEnergyNormData';

        //获取session中存放的楼宇ID
        var officeArr = JSON.parse(sessionStorage.getItem('offices'));

        $(officeArr).each(function(i,o){

            officeID.push(o.f_OfficeID);
        });

    }

    //判断是否标煤
    if( $('.left-choose-energy-container .time-radio:checked').parents('.choose-energy').find('label').html() == '标煤'){
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
            var energyName = $('.choose-target-select .onChoose').html();

            //改变头部日期
            var date = startTime +" — " + moment(endTime).subtract('1','days').format('YYYY/MM/DD');

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
    var index = $('.choose-object-select .onChoose').attr('data-id')-1;

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
                    html += '<li data-num ="'+ o.normIndex+'" class="the-select-message the-target-message onChoose">'+ o.energyItemName+'</li>';

                    $('.choose-target font').html( o.energyItemName);

                }else{
                    html += '<li data-num ="'+ o.normIndex+'" class="the-select-message the-target-message ">'+ o.energyItemName+'</li>'
                }

            });


            //将指标类型嵌入页面
            $('.choose-target-select ul').html(html);

            //改变右上角单位名称
            changeUnit();

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

//改变单位
function changeUnit(){

    var dataArr = unitArr3;
    var attr = 'unitName';

    //获取当前能耗类型
    var energyType = $('.left-choose-energy-container .time-radio:checked').attr('data-type');

    if(energyType == 200){
        dataArr = unitArr4;
    }

    //获取当前指标类型
    var normType = $('.choose-target-select .onChoose').html();

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
