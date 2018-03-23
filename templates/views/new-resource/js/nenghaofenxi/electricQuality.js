/**
 * Created by admin on 2017/11/29.
 */
$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //时间初始化
    $('.time-options-1').click();

    ////默认加载数据
    getEmphasisBranches();

    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){

        getPointerData();

    });

    //改变重点用能支路时触发
    $('#allBranch').on('click','.level0 a',function(){

        //获取到其父元素的ID
        var id = $(this).parent('li').attr('id');

        var node = branchTreeObj.getNodeByTId(id);

        //获取支路ID
        var branchID = node.id;

        //改变下方显示的参数
        getParameterById(branchID);


    });


    //改变指标类型 右上角单位跟着改变
    $('.left-middle-main1').on('click','p',function(){

        $('.left-middle-main1 p').removeClass('curChoose');

        $(this).addClass('curChoose');

        var unit = $(this).attr('data-unit')

        //改变右上角单位名称
        $('.unit').val(unit);
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

//存放获取到的重点用能支路
var energyNormItemArr = [];

//存放获取到的参数列表
var qualityItemArr = [];

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
    dataZoom: [
        {
            type: 'inside'
        }
    ],
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
            type : 'value',
            axisLabel : {
                formatter: '{value} '
            }
        }
    ],
    grid: {
        left: '10%',
        right: '8%'
    },
    series : [
        {
            name:'累计能耗',
            type:'line',
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

            }
        }
    ]
};

/*---------------------------------otherFunction------------------------------*/


//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPointerData(){

    //存放要传递的参数类型
    var energyNormItemObj = {};

    //获取支路ID
    //获取到其父元素的ID
    var id = $('.curSelectedNode').parent('li').attr('id');

    var node = branchTreeObj.getNodeByTId(id);

    //获取支路ID
    var branchID = node.id;

    //获取参数ID
    var normItemID = $('.left-middle-main1 .curChoose').attr('data-num');

    if(normItemID){
        //在参数类型中寻找对应项
        $(qualityItemArr).each(function(i,o){

            if(o.elecQualityIndex == normItemID){

                energyNormItemObj = o
            }
        });
    }

    //获取名称
    var areaName = $('#allBranch .curSelectedNode').attr('title');

    //获取开始时间
    var startTime = getPostTime()[0];

    //获取开始时间
    var endTime = getPostTime()[1];

    //定义获得数据的参数
    var ecParams = {
        "f_ServiceId": branchID,
        "qualityCDataItem":energyNormItemObj ,
        "startTime": startTime,
        "endTime": endTime
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyAnalyzeV2/GetElecQualityData',
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

            $('.right-header-title').eq(0).html(areaName  + ' &nbsp;' + energyName + ' &nbsp;' + date);

            //上方表计数据
            //表计种类
            $('.meter-type span').html(result.f_MeterType);

            //表计型号
            $('.meter-name span').html(result.f_MeterName);

            //安装地址
            $('.meter-name span').html(result.f_MeterLocation);

            //测量范围
            $('.meter-scope span').html(result.f_ServiceName);

            //互感倍数
            $('.meter-rate span').html(result.f_Rate );

            //能耗数据
            $('.energy-data span').html(result.energyData.toFixed(2));

            //加载echarts中数据
            showDataByNum(result.ecMetaDatas);

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


//获取页面左上角重点用能支路
//flag 是否默认加载数据
function getEmphasisBranches(flag){

    $.ajax({
        type: 'get',
        url: sessionStorage.apiUrlPrefix + 'BranchV2/GetEmphasisBranches',
        timeout:_theTimes,
        success: function (result) {

            //console.log(result);

            //保存重点用能支路数据
            energyNormItemArr = result;

            //生成树状图
            getBranchZtree(0,0,getBranchTreeData);

            //加载第一项数据
            $('#allBranch .level0').eq(0).find('a').click();

            //加载右侧主体数据
            getPointerData();
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })
}

//根据用户选择展示项数进行展示
function showDataByNum(data){

    //首先处理实时数据
    var allDataX = [];
    var allDataY = [];

    $(data).each(function(i,o){
        //X轴数据
        allDataX.push(o.dataDate.split('T')[1].split(":")[0] +" : " + o.dataDate.split('T')[1].split(":")[1]);

        //Y轴数据
        allDataY.push(o.data);
    });
    //单位
    var unit = $('.unit').val();

    optionLine.yAxis[0].axisLabel.formatter = '{value}' + unit + '';

    //echart柱状图
    optionLine.xAxis[0].data = allDataX;

    optionLine.series[0].data = allDataY;

    //获取图例名称
    var legendName = $('.left-middle-main1 .curChoose').html();

    optionLine.series[0].name = legendName;

    optionLine.legend.data = [legendName];

    myChartTopLeft.setOption(optionLine,true);


};

//根据支路ID生成不同的参数选择
function getParameterById(id){

    //循环返回的用能支路列表，判断是哪个支路
    $(energyNormItemArr).each(function(i,o){
        //如果传入的ID与支路ID相等
        if(o.f_ServiceId == id){
            //获取对应支路下参数列表
            qualityItemArr = o.elecQualityCDatas;

            var html = '';

            $(qualityItemArr).each(function(i,o){
                //对参数数据拼接字符串
                if(i == 0){

                    html += '<p class="curChoose" data-num="'+ o.elecQualityIndex+'" data-unit="'+ o.qualityItem.qualityItemUnit+'">'+ o.qualityItem.qualityItemName+'</p>';
                    //右上角单位
                    $('.unit').val(o.qualityItem.qualityItemUnit);

                }else{

                    html += '<p data-num="'+ o.elecQualityIndex+'" data-unit="'+ o.qualityItem.qualityItemUnit+'">'+ o.qualityItem.qualityItemName+'</p>';

                }

            });
            //清除浮动
            html += '<div class="clearfix"></div>';

            //给页面添加元素
            $('.left-middle-main1').html(html);

        }
    });
};

//调用生成树状图的方法
function getBranchTreeData(){

    //定义树状图数组
    var zTreeArr = [];
    //根节点
    //var obj1 = {id : -1, pId : -2, name : '重点用能支路', title: '重点用能支路',open : true , nocheck:true}
    //zTreeArr.push(obj1);

    //将用能支路数据转化为树状图结构
    $(energyNormItemArr).each(function(i,o){
        //定义树状图需要的数组
        var obj = {};
        //id
        obj.id = o.f_ServiceId;
        //父节点ID
        obj.pId = -1;
        //title
        obj.title = o.f_ServiceName;
        //自定义属性
        obj.curnum = o.f_ServiceId;
        //名称
        obj.name = o.f_ServiceName;
        //是否选中
        obj.checked = false;
        //无选择框
        obj.nocheck = true;
        //添加到zTree数组中
        zTreeArr.push(obj);
    });

    return zTreeArr;
};



