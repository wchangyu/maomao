/**
 * Created by admin on 2018/7/27.
 */
$(function(){

    //获取当前时间
    $('.min').val(moment().format('YYYY/MM/DD'));

    //时间格式的初始化
    _timeYMDComponentsFun($('.chooseDate'));

    //获取全部能耗类型
    getEnergyTypes();

    //获取区域位置选框中信息
    getPositionSelect();


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

    //导出按钮
    $('.excelButton').on('click',function(){

        _FFExcel($('#scrap-datatables')[0]);
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
        top:'20',
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
            name:'当前数据',
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

//获取同比数据
function getOrganizationData(){

    var districtID = $('#regional-position').val();

    var districtIDArr = [];

    //公共机构id集合
    if( districtID == -1){

        var positionArr = getAllPositionType();

        $(positionArr).each(function(i,o){

            districtIDArr.push(o.districtID)
        })
    }else{

        districtIDArr = [districtID]
    }


    //获取当前对比内容
    var compareName = $('#compare-type').find("option:selected").text();

    //能耗ID
    var energyItemID = $('.onClick').attr('data-id');

    //指标类型
    var energyNormFlag = $('#compare-type').val();

    //日期类型
    var dateType = $('.chooses').html();

    //获取开始时间
    var startTime = getPostTime1(dateType)[0];

    //获取结束时间
      var endTime = getPostTime1(dateType)[1];      if(!startTime || !endTime || startTime == '' || endTime == ''){           _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择时间后查询', '');      return false; }

    //单位
    var unit =  _getEcUnit(energyItemID);

    //传递给后台的数据
    var prm = {

        "energyItemID": energyItemID,
        "startTime": startTime,
        "endTime": endTime,
        "districtIDs":districtIDArr,
        "energyNormFlag": energyNormFlag,
        "userID": _userIdNum
    };

    var url = 'Provincial/GetProvincialClassEnergyRank';

    //定义传递给后台的回调函数
    var successFun = function (result){

        $('.top-select-container').hideLoading();

        $('.has-patch .right-name').html(compareName);

        $('.has-patch .right-name1').html(compareName + "占比");

        var allData = result;

        //存放echart中数据
        var allDataX = [];

        //同比数据
        var allDataY = [];

        //table中数据
        var tableHtml = "";

        var tableHeadHtml = "<tr><th>单位分类</th><th>建筑数量</th><th class='building-area'>建筑面积(㎡)</th><th class='people-num'>"+tablePeopleTitle+"</th>";

        //当前能耗名称
        var energyName = $('.onClick').html();

        //当前指标
        var energyNormFlagName = "";

        var energyNormFlagUnit = "能耗排名";

        if(energyNormFlag == 3){

            energyNormFlagName = "单位面积" + energyName + "耗";

            energyNormFlagUnit =  unit + "/㎡";

        }else  if(energyNormFlag == 5){

            energyNormFlagName = "人均" + energyName + "耗";

            energyNormFlagUnit =  unit + "/人";

        }else  if(energyNormFlag == 1){

            energyNormFlagName = "分项" + energyName + "耗";

            energyNormFlagUnit =  unit + "";
        }


        tableHeadHtml += "<th>"+energyNormFlagName+ "(" + energyNormFlagUnit+")</th>";

        tableHeadHtml += "<th>能耗排名</th></tr>";

        //单位
        $('.right-unit b').html(energyNormFlagUnit);


        $(allData).each(function(i,o){

            if(o.returnOBJID != -1){

                var dataSplit;

                dataSplit = o.returnOBJName;

                allDataX.push(dataSplit);

                allDataY.push(o.currentEnergyData.toFixed(2));
            }

            tableHtml += "<tr>" +
                            "<td class='blues'>"+ o.returnOBJName+"</td>"+
                            "<td>"+ o.pointerNum+"</td>"+
                            "<td class='building-area'>"+ o.coefficient.toFixed(2)+"</td>"+
                            "<td class='people-num'>"+ o.peopleNum+"</td>"+
                            "<td>"+ o.currentEnergyData.toFixed(2)+"</td>"+
                            "<td>"+ o.currentRanking+"</td>"+
                        "</tr>";

        });

        optionBar.xAxis[0].data = allDataX;
        optionBar.series[0].data = allDataY;

        //页面赋值
        bottomCharts.setOption(optionBar,true);



        $('#scrap-datatables thead').html(tableHeadHtml);

        $('#scrap-datatables tbody').html(tableHtml);

        //人均能耗
        if(energyNormFlag == 5){

            $('.building-area').hide();

            $('.people-num').show();


        }else{

            $('.building-area').show();

            $('.people-num').hide();

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

