/**
 * Created by admin on 2017/11/27.
 */
$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));


    //默认时间
    $('.min').val(moment().format('YYYY'));

    //默认加载数据
    getPointerData();

    //改变改造前开始时间
    $('.min').on('change',function(){

       //获取当前时间
       var date = $(this).val();

       //改造后时间
        var date1 = moment(date).add(1,'years').format('YYYY-MM-DD');

        $('.min1').val(date1);
    });

    //改变改造前结束时间
    $('.max').on('change',function(){

        //获取当前时间
        var date = $(this).val();

        //改造后时间
        var date1 = moment(date).add(1,'years').format('YYYY-MM-DD');

        $('.max1').val(date1);
    });

    //点击查询按钮
    $('.btn-success').on('click',function(){

        //获取改造前结束时间
        var stDate = $('.max').val();

        //获取改造后开始时间
        var etDate = $('.min1').val();

        //改造前结束时间大于改造开始时间
        if(moment(stDate) > moment(startDate)){

            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'改造前时间不能大于改造时间', '');
            return false;
        }

        //改造前结束时间大于改造开始时间
        if(moment(etDate) < moment(endDate)){

            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'改造后时间不能小于改造时间', '');
            return false;
        }

    });

    /*---------------------------------buttonEvent------------------------------*/

    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
        }
    };

});
//定义开始结束时间
var startDate = '';

var endDate = '';
//定义单位
var unit = '';

//定义获取到的改造项目数据
var projManage = {};
/*---------------------------------echart-----------------------------------*/
//定义存放返回数据的数组（本期 X Y）
var allData = [];

//折线图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

//柱状图配置项
// 指定图表的配置项和数据
var optionLine= {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['改造前','改造后'],
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
            type : 'value',
            axisLabel : {
                formatter: '{value} °C'
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
            name:'改造前',
            type:'line',
            data:[],
            smooth:true,  //这句就是让曲线变平滑的
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
        },
        {
            name:'改造后',
            type:'line',
            data:[],
            smooth:true,  //这句就是让曲线变平滑的
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

    //从url中获取ID
    var idMessage = window.location.search;
    //改造项目ID
    var id = 0;

    //如果存在
    if(idMessage && idMessage != ''){

        id = idMessage.split('=')[1];
    }
    var ecParams = {
        PK_EnergyProj : id
    };

    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'EnergySavTrackV2/GetProjManageByID',
        data:ecParams,
        timeout:_theTimes,
        beforeSend: function () {
            myChartTopLeft.showLoading();
        },
        success:function(result){

            console.log(result);

            projManage = result;
            //return false;

            //判断是否返回数据
            if(result == null || result.length == 0){
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'无数据', '');
                return false;
            }

            //改造名称
            $('.improve-name span').html(result.f_ProjectName);
            //改造内容
            $('.improve-content span').html(result.f_ProjectContent);
            //改造开始时间
            $('.start-date span').html(result.f_StartDate.split(' ')[0]);
            startDate = result.f_StartDate.split(' ')[0];

            //改造结束时间
            $('.end-date span').html(result.f_EndDate.split(' ')[0]);
            endDate = result.f_EndDate.split(' ')[0];
            //改造所属楼宇
            $('.belong-building span').html(result.energyProjPointers[0].f_PointerName);
            //改造涉及支路
            $('.belong-branch span').html(result.energyProjPointers[0].energyProjBranchs[0].f_BranchName);

            //根据能耗类型获取单位
            var energyType = result.f_EnergyType;

            unit = getUnit(energyType);

            //给页面上方改造时间赋值
            var startTime1 = moment(startDate).subtract('2','months').format('YYYY-MM-DD');
            //改造前开始时间
            $('.min').val(startTime1);
            //改造前结束时间
            $('.max').val(startDate);

            var startTime2 = moment(startTime1).add('1','years').format('YYYY-MM-DD');

            var endTime2 = moment(startTime2).add('2','months').format('YYYY-MM-DD');

            //改造后结束时间
            $('.min1').val(startTime2);
            //改造后开始时间
            $('.max1').val(endTime2);

            //获取eCharts图数据
            getEchartsData();

        },
        error:function(jqXHR, textStatus, errorThrown){

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
            }

        }
    })
};

//获取eCharts展示数据
function getEchartsData(){

    var ecParams = {

        "projManage" : projManage,
        "beforeST": $('.min').val(),
        "beforeET": $('.max').val(),

        "laterST": $('.min1').val(),
        "laterET": $('.max1').val()
    }

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergySavTrackV2/GetEnergyVerifyData',
        data:ecParams,
        timeout:_theTimes,
        success:function(result){

            //console.log(result);

            //节能量
            $('#consumption-value-number').html(result.savingEnergyData.toFixed(1));
            //单位
            $('.the-cumulative-power-unit').html(unit);

            //co2排放量
            $('.compared-with-last-time0 b font').html(result.cO2Data.toFixed(1));
            //相当于植树
            $('.compared-with-last-time1 b font').html(result.treePlanting.toFixed(1));

            //改造前数据
            $('.quota-year b').html((result.beforeEnergyVerify.avgMetaData).toFixed(1) + unit);

            //改造后数据
            if(result.laterEnergyVerify){
                $('.quota-year1 b').html((result.laterEnergyVerify.avgMetaData).toFixed(1) + unit);
            }else{
                $('.quota-year1 b').html('');
            }

            //百分比数据
            $('.right-up-precent').html((Math.abs(result.savingEnergyPercent)*100).toFixed(1) + '%');

            //根据百分比数据判断箭头是上升还是下降
            if(result.savingEnergyPercent > 0){
                //大于0时使用向上的箭头
                $('.rights-up').addClass('right-ups');
                //小于0时使用向下的箭头
                $('.rights-up').removeClass('right-ups');
            }
            //改造前数据
            var dataArr1 = [];
            //改造后数据
            var dataArr2 = [];
            //横坐标
            var xArr = [];
            //改造前数据赋值
            if(result.beforeEnergyVerify){

                $(result.beforeEnergyVerify.ecMetaDatas).each(function(i,o){
                    //横坐标赋值
                    xArr.push(o.dataDate.split('T')[0]);
                    //数据赋值
                    dataArr1.push(o.data.toFixed(1));

                });
            }

            //改造后数据赋值
            if(result.laterEnergyVerify){

                $(result.laterEnergyVerify.ecMetaDatas).each(function(i,o){
                    //数据赋值
                    dataArr2.push(o.data.toFixed(1));

                    if(xArr.length == 0){
                        //横坐标赋值
                        xArr.push(o.dataDate.split('T')[0]);
                    }
                });
            }

            //echart图重构
            optionLine.xAxis[0].data = xArr;

            optionLine.series[0].data = dataArr1;

            optionLine.series[1].data = dataArr2;

            //单位修改
            optionLine.yAxis[0].axisLabel.formatter = '{value}' + unit + '';


            myChartTopLeft.setOption(optionLine,true);

            myChartTopLeft.hideLoading();

        },
        error:function(jqXHR, textStatus, errorThrown){
            myChartTopLeft.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })

}

