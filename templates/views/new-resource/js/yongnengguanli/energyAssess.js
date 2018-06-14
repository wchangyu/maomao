/**
 * Created by admin on 2017/11/24.
 */
$(function(){

    //从配置项中获取页面中所展示信息
    getDataByConfig();

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

    //获取当前选中的是楼宇还是科室

    var thisID = $('.left-middle-main .curChoose').attr('data-id');

    //如果是楼宇
    if(thisID == 1){

        //楼宇ztree树
        getBranchZtree(0,0,getPointerTree1,$("#allOffices"));
        //_officeZtree = _getPointerZtree($("#allOffices"),1);

        //默认加载数据
        getPointerData('EnergyManageV2/GetPointerDingEAssess',thisID);

    }else if(thisID == 2){

        //科室ztree树
        _officeZtree = _getOfficeZtree($("#allOffices"),1);

        //默认加载数据
        getPointerData('EnergyManageV2/GetOfficeDingEAssess',thisID);

    }


    //科室或楼宇搜索功能
    _searchPO1($(".tipes"),"allOffices");

    //加载KPI中数据
    getKPIInfos();

    //默认时间
    $('.min').val(moment().format('YYYY'));



    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){
        //获得选择的能耗类型
        _ajaxEcType =_getEcTypeValue(_ajaxEcType);

        var o = $('.left-middle-main .curChoose').attr('data-id');

        if(o == 2){

            //分户数据
            getPointerData('EnergyManageV2/GetOfficeDingEAssess',o);

        }else if(o == 1){

            //楼宇数据
            getPointerData('EnergyManageV2/GetPointerDingEAssess',o);

        }else if(o == 5){

            //KPI数据
            getPointerData('EnergyManageV2/GetKPIDingEAssess',o);

        }
    });

    //能耗选择
    $('.energy-types').on('click','div',function(){

        //右上角单位
        var unit = $('#unit').find("option").eq(0).text();

        $('.unit').val(unit);

    });

    //点击切换楼宇或单位时，改变上方能耗类型
    $('.left-middle-main p').on('click',function(){

        $('.left-middle-main p').removeClass('curChoose');

        $(this).addClass('curChoose');

        //判断页面中是否存在能耗类型选项
        if(typeof _energyTypeSel!="undefined" ){
            if($(this).attr('data-id') == 5){

                //清空上方能耗种类
                $('.energy-types').html('');

                $('.energy-types').addClass('hasHeight');

                //右上角单位
                $('.unit').val($('.left-middle-main1 .curChoose').attr('data-unit'));

                //下方对象
                $('.left-middle-main1').show();
                $('.tree-2').hide();

                return false;

            }else{

                //楼宇
                if($(this).attr('data-id') == 1){

                    _energyTypeSel.initPointers($(".energy-types"),undefined,function(){
                        getEcType();
                    });

                    //楼宇ztree树
                    getBranchZtree(0,0,getPointerTree1,$("#allOffices"));

                    //科室
                }else if($(this).attr('data-id') == 2){

                    _energyTypeSel.initOffices($(".energy-types"),undefined,function(){
                        getEcType();
                    });


                    //科室ztree树
                    _officeZtree = _getOfficeZtree($("#allOffices"),1);

                }



                $('.energy-types').removeClass('hasHeight');

                //右上角单位
                var unit = $('#unit').find("option").eq(0).text();

                $('.unit').val(unit);

                //下方对象
                $('.left-middle-main1').hide();
                $('.tree-2').show();

            }

            //默认选中第一个能耗
            $('.selectedEnergy').addClass('blueImg0');
        }else{


        };
    });

    //加载默认能耗种类
    $('.left-middle-main .curChoose').click();

    //改变指标类型 右上角单位跟着改变
    $('.left-middle-main1').on('click','p',function(){

        $('.left-middle-main1 p').removeClass('curChoose');

        $(this).addClass('curChoose');

        var unit = $(this).attr('data-unit');

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

//从配置项中获取页面中所展示信息
function getDataByConfig(){

    //获取当前的url
    var curUrl = "new-yongnengguanli/OfficeDingEData.html";

    //获取当前页面的配置信息
    $(__systemConfigArr).each(function(i,o){

        //获取当前配置项中的url
        var thisUrl = o.pageUrl;

        //找到了当前页面对应的配置项
        if(curUrl.indexOf(thisUrl) > -1){

            //获取到具体的能耗排名配置信息
            var dataArr = o.quotaKind;

            var html = "";

            var thisNum = -1;

            $(dataArr).each(function(i,o){

                if(o.isShow == 1){

                    thisNum ++;

                    if(thisNum == 0){

                        html += '<p class="curChoose" data-id='+ o.quotaTypeID+'>'+ o.quotaName+'</p>';

                    }else{

                        html += '<p data-id='+ o.quotaTypeID+'>'+ o.quotaName+'</p>';
                    }
                }

            });

            //赋值到页面中
            $('.left-middle-main').html(html);

        }
    });
};


//存放获取到的指标类型
var energyNormItemArr = [];

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

/*---------------------------------echart-----------------------------------*/
//定义存放返回数据的数组（本期 X Y）
var allData = [];

//折线图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

//柱状图配置项
// 指定图表的配置项和数据
option = {

    tooltip : {
        trigger: 'axis'
    },
    legend: {
        show:true,
        data:['定额量','使用量','偏差']
    },
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
    grid: {
        left:'0%',
        right:'0%',
        containLabel: true
        //show:true
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value} °C'
            }
        },
        {   type: 'value',
            show: true,
            axisLabel : {
                formatter: '{value} %'
            }
        }
    ],
    series : [
        {
            name:'定额量',
            type:'bar',
            data:[],
            //itemStyle : {
            //    normal : {
            //        color:'#52d0ef',
            //        lineStyle:{
            //            color:'#53f4db',
            //            width:3
            //        }
            //    }
            //},

        },
        {
            name:'使用量',
            type:'bar',
            //itemStyle : {
            //    normal : {
            //        color:'darkOrange',
            //        lineStyle:{
            //            color:'white' +
            //            '',
            //            width:1
            //        }
            //    }
            //},
            data:[]

        },
        {
            name:'偏差',
            type:'line',
            showAllSymbol: true,
            yAxisIndex: 1,
            //itemStyle : {
            //    normal : {
            //        color:'darkOrange',
            //        lineStyle:{
            //            color:'red' +
            //            '',
            //            width:1
            //        }
            //    }
            //},
            data:[]


        }
    ]
};

/*---------------------------------otherFunction------------------------------*/

//获取数据
function getPointerData(url,flag){


    //存放要传递的分户集合
    var officeID = [];

    //存放要传递的楼宇集合
    var pointerID = [];

    //存放要传递的指标类型
    var energyNormItemObj = {};

    //定义获得数据的参数
    var ecParams = {};

    //获取名称
    var areaName = '';

    //获取能耗名称
    var energyName='';

    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){
        _ajaxEcType = -2;
    }

    //获取年份
    var f_Year = $('.min').val();

    //楼宇数据
    if(flag == 1){

        var treeObj = $.fn.zTree.getZTreeObj('allOffices');

        //确定楼宇id
        var pts = treeObj.getCheckedNodes(true)[0];

        console.log(pts);

        pointerID = pts.id;

        areaName = pts.name;

        ecParams = {
            "f_EnergyItemId": _ajaxEcType,
            "f_Year": f_Year,
            "pointerID": pointerID
        };

        energyName = $('.selectedEnergy p').html();

        //分户数据
    }else if(flag == 2){

        //确定分户id
        var ofs = _officeZtree.getSelectedOffices();

        officeID = ofs[0].f_OfficeID;

        areaName = ofs[0].f_OfficeName;

        ecParams = {
            "f_EnergyItemId": _ajaxEcType,
            "f_Year": f_Year,
            "officeID": officeID
        };


        energyName = $('.selectedEnergy p').html();

       //KPI数据
    }else if(flag == 5){

        //获取指标ID
        var normItemID = $('.left-middle-main1 .curChoose').attr('data-num');

        //console.log(energyNormItemArr);

        if(normItemID){
            //在指标类型中寻找对应项
            $(energyNormItemArr).each(function(i,o){

                if(o.pK_KPIInfo == normItemID){

                    energyNormItemObj = o
                }
            });
        }

        ecParams = {
            "f_Year": f_Year,
            "kpiInfo": energyNormItemObj
        };

        energyName = $('.left-middle-main1 .curChoose').eq(0).html();

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

            console.log(result);

            //return false;

            //判断是否返回数据
            if(result == null || result.length == 0){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }

            //改变头部日期
            var date = f_Year;

            $('.right-header-title').eq(0).html(energyName + ' &nbsp;' + areaName + ' &nbsp;' + date);

            //首先处理本期的数据
            allData.length = 0;

            //默认展示前20项的数据
            $('.header-right-btn span').removeClass('cur-on-choose');

            $('.header-right-btn span').eq(0).addClass('cur-on-choose');

            $(result.energyDingEDatas).each(function(i,o){
                allData.push(o);

            });
            //右侧数据统计

            //总量
            var sumEnergyData = result.sumEnergyData.toFixed(1);

            //累计定额
            var sumDingEData = result.sumDingEData.toFixed(1);

            //年定额
            var yearDingE = result.yearDingE.toFixed(1);

            //预计年使用量
            var yearEnergyData = result.yearEnergyData.toFixed(1);

            //单位
            var unit = $('.unit').val();

            //判断当前数据是否过大
            if(result.sumEnergyData > 10000 && _ajaxEcType == '01'){

                unit = 'MWh';

                 sumEnergyData = (sumEnergyData / 1000).toFixed(1);

                //累计定额
                 sumDingEData = (sumDingEData / 1000).toFixed(1);

                //年定额
                 yearDingE = (yearDingE / 1000).toFixed(1);

                //预计年使用量
                 yearEnergyData = (yearEnergyData / 1000).toFixed(1);

                $('.unit').val(unit);

                //给右侧展示eCharts数据赋值
                showDataByNum(allData,1);

            }else{

                $('.unit').val(unit);

                //给右侧展示eCharts数据赋值
                showDataByNum(allData);

            }


            $('.the-cumulative-power-unit').html(unit);

            //总量
            $('.total-power-consumption-value #consumption-value-number').html(sumEnergyData);

            //累计定额
            $('.compared-with-last-time label').html(sumDingEData);

            //比例
            var precent = Math.abs((result.energyDingeScale* 100).toFixed(1));

            $('.right-up-precent').html(precent + '%');

            //中间上升箭头
            if(result.energyDingeScale > 0){

                $('.rights-up').addClass('rights-up1');
            }

            //年定额
            $('.quota-year b').html(yearDingE + unit);

            //预计年使用量
            $('.quota-year1 b').html(yearEnergyData + unit);

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

//获取KPI列表 根据用户选择展示项数进行展示
function getKPIInfos(){

    $.ajax({
        type: 'get',
        url: sessionStorage.apiUrlPrefix + 'EnergyManageV2/GetKPIInfos',
        success: function (result) {

            var html = '';

            var unitHtml = '';
            //指标类型清空
            energyNormItemArr.length = 0;

            var dataArr = [];

            $(result).each(function(i,o){
                //指标类型重新赋值
                energyNormItemArr.push(o);
                dataArr.push(o);

            });

            $(dataArr).each(function(i,o){

                //如果是第一个默认选中
                if(i == 0){
                    html += '<p data-num ="'+ o.pK_KPIInfo+'" class="curChoose" data-unit="'+ o.f_kpiUnit+'">'+ o.f_kpiName+'</p>';

                }else{
                    html += '<p data-num ="'+ o.pK_KPIInfo+' " data-unit="'+ o.f_kpiUnit+'">'+ o.f_kpiName+'</p>'
                }


            });
            html += '<div class="clearfix"></div>';
            //将指标类型嵌入页面
            $('.left-middle-main1').html(html);

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })
};

//根据用户选择展示项数进行展示 flag = 1 kWh单位变为MWh
function showDataByNum(data,flag){

    //首先处理实时数据
    var allDataX = [];
    //定额数据
    var allDataY1 = [];
    //使用数据
    var allDataY2 = [];
    //偏差值
    var allDataY3 = [];

    $(data).each(function(i,o){

        if(flag == 1){

            o.dingEData =  o.dingEData / 1000;

            o.energyData =  o.energyData / 1000;

        }

        //X轴数据
        allDataX.push(o.f_Month + '月');

        //Y轴数据
        allDataY1.push(o.dingEData.toFixed(1));

        allDataY2.push(o.energyData.toFixed(1));

        allDataY3.push((o.deviationData*100).toFixed(1));
    });

    //单位
    var unit = $('.unit').val();
    option.yAxis[0].axisLabel.formatter = '{value}' + unit + '';

    //echart柱状图
    option.xAxis[0].data = allDataX;

    option.series[0].data = allDataY1;

    option.series[1].data = allDataY2;

    option.series[2].data = allDataY3;

    myChartTopLeft.setOption(option,true);

};