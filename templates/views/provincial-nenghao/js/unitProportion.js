
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

        //获取当前数据
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

//echart图配置项
var optionBar = {

    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        type: 'scroll',
        top: 10,
        bottom: 10,
        data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
    },
    grid:{
        left:'right'
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    series: [
        {
            name:'能耗占比',
            type:'pie',
            radius: ['0%', '80%'],
            data:[

            ],
            center:['60%','50%'],
            itemStyle:{
                normal:{
                    label:{
                        show: false,
                        formatter: '{b} : {c} ({d}%)'
                    },
                    color:function(params){
                        var colorList = [
                            '#2ec8ab','#2f4554','#0BA3C3','#fad797', '#f8276c', '#61a0a8','#ffa90b', '#0353F7', '#3C27D5','#6512D7', '#283DDA', '#901AD3','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    labelLine :{show:true}
                }
            }
        }
    ]
};

//echart初始化
var bottomCharts = echarts.init(document.getElementById('chart-containers'));


//获取当前数据
function getOrganizationData(){

    //能耗ID
    var energyItemID = $('.onClick').attr('data-id');

    //日期类型
    var dateType = $('.chooses').html();

    //获取开始时间
    var startTime = getPostTime1(dateType)[0];

    //获取结束时间
     var endTime = getPostTime1(dateType)[1];

    if(!startTime || !endTime || startTime == '' || endTime == ''){
        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择时间后查询', '');
    }

    //单位
    var unit =  _getEcUnit(energyItemID);

    //传递给后台的数据
    var prm = {

        "energyItemID": energyItemID,
        "startTime": startTime,
        "endTime": endTime,
        "userID": _userIdNum
    };

    var url = 'Provincial/ProvEnergyPropByClass';

    //定义传递给后台的回调函数
    var successFun = function (result){

        var allData = result;

        //存放echart中数据

        var legendArr = [];

        var sArr = [];

        //table中数据
        var tableHtml = "";

        var tableHeadHtml = "<tr><th>单位类型</th><th>建筑数量</th><th>建筑面积(㎡)</th>";

        //当前能耗名称
        var energyName = $('.onClick').html();

        //当前标题
        var energyNormFlagName = "";

        energyNormFlagName = "总用" + energyName + "量";

        tableHeadHtml += "<th>"+energyNormFlagName+ "(" + unit+")</th>";


        tableHeadHtml += "<th>能耗占比</th></tr>";

        //单位
        $('.right-unit b').html(unit);

        $(allData).each(function(i,o){

            if(o.returnOBJID != -1){

                var obj = {value : o.sumEnergyData.toFixed(2),name:o.returnOBJName};

                sArr.push(obj);

                legendArr.push(o.returnOBJName);

                tableHtml += "<tr>" +
                    "<td class='blues'>"+ o.returnOBJName+"</td>"+
                    "<td>"+ o.pointerNum+"</td>"+
                    "<td>"+ o.coefficient.toFixed(2)+"</td>"+
                    "<td>"+ o.sumEnergyData.toFixed(2)+"</td>"+
                    "<td>"+ (o.energyDataProp*100).toFixed(2)+"%</td>"+
                    "</tr>";
            }else{

                tableHtml += "<tr>" +
                    "<td class='blues'>"+ o.returnOBJName+"</td>"+
                    "<td>"+ o.pointerNum+"</td>"+
                    "<td>"+ o.coefficient.toFixed(2)+"</td>"+
                    "<td>"+ o.sumEnergyData.toFixed(2)+"</td>"+
                    "<td>--</td>"+
                    "</tr>";
            }



        });

        optionBar.series[0].data = sArr;

        optionBar.legend.data = legendArr;

        //页面赋值
        bottomCharts.setOption(optionBar,true);

        $('#scrap-datatables thead').html(tableHeadHtml);

        $('#scrap-datatables tbody').html(tableHtml);

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

