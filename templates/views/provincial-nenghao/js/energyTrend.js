/**
 * Created by admin on 2018/7/25.
 */
$(function(){

    //获取当前时间
    $('.min').val(moment().format('YYYY/MM/DD'));

    //时间格式的初始化
    _timeYMDComponentsFun($('.chooseDate'));

    //获取区域位置选框中信息
    getPositionSelect();

    //获取建筑类型选框中信息
    getBuildingSelect();

    //获取全部能耗类型
    getEnergyTypes();

    //改变区域位置
    $('#regional-position').on('change',function(){

        //获取公共机构分类统计表数据
        getOrganizationData();

    });


    //改变能耗类型
    $('.right-choose-energy').on('click','span',function(){

        $('.right-choose-energy span').removeClass('onClick');

        $(this).addClass('onClick');

        //获取当前能耗id
        var id = $(this).attr('data-id');

        var unit =  _getEcUnit(id);

        $('.right-unit b').html(unit);

        //获取同比数据
        getOrganizationData();
    });



    //点击查询按钮
    $('.btn-success').on('click',function(){

        //获取同比数据
        getOrganizationData();

    });

    //chart图自适应
    window.onresize = function () {
        if(bottomCharts){
            bottomCharts.resize();
        }
    };

    //获取同比数据
    $('.right-choose-energy span').eq(0).click();

});

//柱状图配置项
var optionBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['本期数据','比较数据'],
        top:'2',
    },
    grid: {
        left: '1%',
        right: '4%',
        bottom:'1%',
        containLabel: true
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
            name:'本期数据',
            type:'bar',
            data:[],
            itemStyle : {
                normal:{
                    color:'#019cdf'
                }
            },
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
            barMaxWidth: '60'
        },
        {
            name:'比较数据',
            type:'bar',
            data:[],
            itemStyle : {
                normal:{
                    color:'#f8276c'
                }
            },
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
            //markLine : {
            //    data : [
            //        {type : 'average', name: '平均值'}
            //
            //
            //    ]
            //
            //},
            barMaxWidth: '60'
        }

    ]
};

//echart初始化
var bottomCharts = echarts.init(document.getElementById('chart-containers'));

//获取区域位置选框中信息
function getPositionSelect(){

    var positionArr = getAllPositionType();

    var html = "<option value='-1'>全部</option>" ;

    $(positionArr).each(function(i,o){

        html += '<option value="'+ o.districtID+'">'+ o.districtName+'</option>';
    });

    $('#regional-position').html(html);

}

//获取建筑类型选框中信息
function getBuildingSelect(){

    var allUnitTypeArr = JSON.parse(sessionStorage.allUnitType);

    var html = "<option value='-1'>全部</option>" ;

    $(allUnitTypeArr).each(function(i,o){

        html += '<option value="'+ o.pointerClass+'">'+ o.className+'</option>';
    });

    $('#building-type').html(html);

}



//获取同比数据
function getOrganizationData(){

    //获取当前对比内容
    var compareName = $('#compare-type').find("option:selected").text();

    var districtID = $('#regional-position').val();

    var districtIDArr = [];

    //能耗ID
    var energyItemID = $('.onClick').attr('data-id');

    //指标类型
    var energyNormFlag = $('#compare-type').val();

    //建筑分类
    var pointerClass = $('#building-type').val();

    //日期类型
    var dateType = $('.chooses').html();

    //展示类型
    var showDateType = getShowDateType(dateType)[0];

    //时间类型
    var selectDateType = getShowDateType(dateType)[1];

    //获取开始时间
    var startTime = getPostTime1(dateType)[0];

    //获取结束时间
        var endTime = getPostTime1(dateType)[1];          if(!startTime || !endTime || startTime == '' || endTime == ''){                   _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择时间后查询', '');         return false;     }

    if(!startTime || !endTime || startTime == '' || endTime == ''){


        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择时间后查询', '');

    }

    //公共机构id集合
    if( districtID == -1){

        var positionArr = getAllPositionType();

        $(positionArr).each(function(i,o){

            districtIDArr.push(o.districtID)
        })
    }else{

        districtIDArr = [districtID];
    }

    //传递给后台的数据
    var prm = {

        "energyItemID": energyItemID,
        "startTime": startTime,
        "endTime": endTime,
        "showDateType": showDateType,
        "selectDateType": selectDateType,
        "energyNormFlag": energyNormFlag,
        "districtIDs": districtIDArr,
        "pointerClass": pointerClass,
        "userID": _userIdNum
    };

    var url = 'Provincial/GetProvincialYearCompare';

    //定义传递给后台的回调函数
    var successFun = function (result){


        $('.has-patch .right-name').html(compareName);

        var allData = result.compareDatas;

        //存放echart中数据
        var allDataX = [];

        //同比数据
        var allDataY = [];

        var allDataY1 = [];

        $(allData).each(function(i,o){

            var dataSplit;

            if(showDateType == 'Hour' ){

                 dataSplit = o.currentDataDate.split(' ')[1];

                 dataSplit = dataSplit.split(':')[0] + ":" +dataSplit.split(':')[1];

            }else {

                dataSplit = o.currentDataDate.split(' ')[0];
            }

            allDataX.push(dataSplit);

            allDataY.push(o.currentData.toFixed(2));

            allDataY1.push(o.lastYearData.toFixed(2));

        });

        optionBar.xAxis[0].data = allDataX;
        optionBar.series[0].data = allDataY;
        optionBar.series[1].data = allDataY1;

        //页面赋值
        bottomCharts.setOption(optionBar,true);

        //右侧能耗统计

        //总能耗
        $('#consumption-value-number').html(result.sumCurrentData.toFixed(1));

        //console.log(result.sumCurrentData.toFixed(1));

        //上年同期
        $('.the-show-data').html(result.sumLastYearData.toFixed(1));

        //百分比
        $('.rights-up-value').html(Math.abs(result.lastYearEnergyPercent * 100).toFixed(1) + "%");

        $('.rights-up').removeClass('data-up');

        $('.rights-up').removeClass('data-down');

        //判断箭头方向
        if(result.lastYearEnergyPercent > 0){

            $('.rights-up').addClass('data-up');

        }else  if(result.lastYearEnergyPercent < 0){

            $('.rights-up').addClass('data-down');
        }

        $('.top-select-container').hideLoading();

    };

    var beforeSendFun = function(){

        $('.top-select-container').showLoading();

    };

    var errorFun = function(XMLHttpRequest, textStatus, errorThrown){

        $('.top-select-container').hideLoading();

        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

        }else{

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

        }
    };

    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);

}

