/**
 * Created by admin on 2018/1/17.
 */


//配置流程图页面中的区域位置
//var monitorAreaArr = [
//    {
//        "areaName":"东冷站",
//        "areaId":"123"
//    },
//    {
//        "areaName":"西冷站",
//        "areaId":"62"
//    }
//];
//把区域信息放入到流程图页面中
//sessionStorage.monitorArea = JSON.stringify(monitorAreaArr);

//在小于2位数的值前面添加0
var addZeroToSingleNumber=function (num) {
    var curnum = "";
    if (num < 10) {
        curnum = "0" + num;
    }
    else {
        curnum += num;
    }
    return curnum;
};

//系统实时日期时间
var sysrealdt = function () {
    var nowDt = new Date();
    var year = nowDt.getFullYear();
    var month = parseInt(nowDt.getMonth())+1;
    var day = nowDt.getDate();
    var dt = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
    return dt;
};

window.onresize = function (ev) {
    if(chartViewLDCMain){
        chartViewLDCMain.resize();
    }
    if(chartViewLQCMain){
        chartViewLQCMain.resize();
    }
    if(chartViewRBJMain){
        chartViewRBJMain.resize();
    }
    if(chartViewXLJMain){
        chartViewXLJMain.resize();
    }
    if(chartViewLXJMain){
        chartViewLXJMain.resize();
    }
};

$(function(){

    //切换冷站能耗曲线的选项卡
    $('.right-bottom-content1 .consumption-container span').on('click',function(){
        $(this).parent().children().removeClass('onClick');
        $(this).addClass('onClick');

        //获取当前索引
        var index = $(this).index();

        //获取当前的区域ID
        var areaID = $('#monitor-menu-container .right-bottom-tab-choose').attr('data-district');

        //获取当前是东冷站还是西冷站
        var ew = '';

        if(areaID == 60){
            ew = 'EC'
        }else if(areaID == 62){
            ew = 'WC'
        }

        if($('#glwd-container').length > 0){

            $('#glwd-container').remove();

        }

        //电耗曲线
        if(index == 1){

            getTDayEs(ew);

        //汽耗曲线
        }else if(index == 2){

            //获取[汽耗曲线]历史数据
            getTDayQs(ew);

        //冷量曲线
        }else if(index == 0){

            //获取[冷量曲线]历史数据
            getTDayCs(ew);

        //冷冻温度曲线
        }else if(index == 3){

            //获取[供冷温度曲线]历史数据
            getTDayGLWs(ew,'C');

        }
    });

    //切换热站能耗曲线的选项卡
    $('.consumption-container1 span').on('click',function(){

        $(this).parent().children().removeClass('onClick');
        $(this).addClass('onClick');

        //获取当前索引
        var index = $(this).index();

        //获取当前的区域ID
        var areaID = $('#monitor-menu-container .right-bottom-tab-choose').attr('data-district');

        //获取当前是东冷站还是西冷站
        var ew = '';

        if(areaID == 61){
            ew = 'EH'
        }else if(areaID == 63){
            ew = 'WH'
        }

        //总供热量曲线
        if(index == 0){

            getTotalHeatData(ew);

            //总蒸汽曲线
        }else if(index == 1){

            //获取[汽耗曲线]历史数据
            getTotalSteamData(ew);

            //总能耗量曲线
        }else if(index == 2){

            getTotalEnergyData(ew);

        }

        //总供热温度
        getTotalZGWD(ew);
    });

    //切换冷热站
    $('.right-bottom-container1 .right-bottom-tab-container').on('click','span',function(){

        //获取当前点击的元素的index
        var index = $(this).index();

        if($('#glwd-container').length > 0){

            $('#glwd-container').remove();

        }

        //冷站
        if(index < 2){
            $('.right-bottom-container1 .right-bottom-content').eq(0).show();
            $('.right-bottom-container1 .right-bottom-content').eq(1).hide();
        }else{
            $('.right-bottom-container1 .right-bottom-content').eq(0).hide();
            $('.right-bottom-container1 .right-bottom-content').eq(1).show();
        }

        //获取当前是东冷站还是西冷站
        var ew = '';

        //东冷站
        if(index == 0){

            ew = "EC";
            //西冷站
        }else if(index == 1){

            ew = "WC";
            //东换热站
        }else if(index == 2){

            ew = "EH";
            //西换热站
        }else if(index == 3){

            ew = "EH";
        }

        //获取当前报警信息
        getAlarmData(ew);

        //获取负荷率
        getLRADs(ew);

    });

    //获取[离心机组系统]实时数据
    getLXJAE('EC');

    //获取[溴锂机组系统]实时数据
    getXLJAE('EC');
    //
    //获取[热泵机组系统]实时数据
    getRBJAE('EC');

    //获取[冷却侧系统]实时数据
    getLQCAE('EC');

    ////获取[冷冻侧系统]实时数据
    getLDCAE('EC');

    //获取[冷量曲线]历史数据
    getTDayCs('EC');

    //设备运行数据
    getRunData('EC',"C");

    //获取页面中的上面要展示的区域及对应的ID
    getDevTypeAreas(devTypeID);

    //获取负荷率
    getLRADs('EC');

    //点击报警查看报警详细信息
    $('.alarm-content-container').on('click','.alarm-content',function(i,o){

        //获取当前要显示的报警信息id
        var id = $(this).attr('data-id');

        //获取当前报警名称
        var alarmName = $(this).text().split(' ')[0];

        $('#alarm-message .systematic-name').html(alarmName);

        //找到当前报警列表
        $(alarmArr).each(function(i,o){

            if(o.innerID == id){

                //显示模态框
                $('#alarm-message').modal('show');
                console.log(o.alarm_List)

                //展示数据
                showAlarmDataMessage(o.alarm_List);
            }

        });

    });

});

//定义存放当前报警信息的集合
var alarmArr = [];

//定义当前的设备类型 冷热源为1
var devTypeID = 1;

//负荷率
// 指定图表的配置项和数据
var option01 = {
    title:{
        text: '0%',
        textStyle:{
            fontSize:'20',
            fontWeight:'bold',
            color:'#2170F4'
        },
        textBaseline:'middle',
        x:'center',
        bottom:'30%'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        show:false
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'10px',
        data:[]
    },
    series: [
        {
            name:'负荷率',
            type:'pie',
            radius: ['70%', '80%'],
            center:['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle : {
                normal : {
                    color:function(params){
                        var colorList = [
                            '#e2e2e2','#2170F4'
                        ];
                        return colorList[params.dataIndex]

                    },
                    label : {
                        show : true
                    },
                    labelLine : {
                        show : false
                    }
                },
                emphasis : {
                    label : {
                        show : false,
                        position : 'center',
                        textStyle : {
                            fontSize : '30',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[0,100]
        }
    ]
};

var _myChart101 =  echarts.init(document.getElementById('bottom-content-chart'));

var _myChart202=  echarts.init(document.getElementById('bottom-content-chart1'));

_myChart101.setOption( option01,true);

_myChart202.setOption( option01,true);

//获取设备运行数据
function getRunData(ew,ch){

    var ecParams = {

        pId:sessionStorage.PointerID,
        AREA:ew,
        CH:ch
    };
    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+"EWCH/GetEQRS",
        data:ecParams,
        //timeout:_theTimes * 2,
        beforeSend:function(){


        },
        success:function(result){

            //console.log(result);

            //调用成功
            if(result.code == 0){

                //如果是东冷站或西冷站
                if(ew == "EC" || ew == "WC"){

                    //获取离心机运行状态
                    var lxState = result.lxjzRs;

                    changeEquipState(lxState ,0 ,'.right-bottom-content1',result.mode);

                    //获取溴锂机组运行状态

                    var xlState = result.xljzRs;

                    changeEquipState(xlState ,1 ,'.right-bottom-content1',result.mode);

                    //获取热泵运行状态

                    var rbState = result.rbjzRs;

                    changeEquipState(rbState ,2 ,'.right-bottom-content1',result.mode);


                }else{

                    //获取换热罐运行状态
                    var hrbState = result.hrbRs;

                    changeEquipState(hrbState ,0 ,'.right-bottom-content2',result.mode);

                    //获取采暖泵运行状态

                    var cnbState = result.cnbRs;

                    changeEquipState(cnbState ,1 ,'.right-bottom-content2',result.mode);
                }

            }

        },
        error:function(jqXHR, textStatus, errorThrown){


            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};

//改变设备状态
function changeEquipState(stateObj,index,dom,mode){

    var lxStateArr = [];

    for(var val in stateObj){

        lxStateArr.push(stateObj[val]);
    }

    $(lxStateArr).each(function(i,o){

        if(o == 3){

            $(dom).find('.top-control-content .right-span').eq(index).find("font").eq(i).addClass('onClick');

        }else{

            $(dom).find('.top-control-content .right-span').eq(index).find("font").eq(i).removeClass('onClick');

        }

    });

    //获取当前季节
    if(mode == "S"){

        $(dom).find('.top-control .top-control-span').eq(0).html('供冷季');

    }else if(mode == "W"){

        $(dom).find('.top-control .top-control-span').eq(0).html('供冷季');

    }else{

        $(dom).find('.top-control .top-control-span').eq(0).html('过渡季');
    }

};

//获取冷站负荷率
function getLRADs(area){

    //获取当前时间
    var curDt = moment().format('YYYY-MM-DD HH:mm');

    //传递给后台的参数
    var  ecParams = {
        "pId":curPointerIDArr[0],
        "dt": curDt, //当前时间
        "area": area
    };

    $.ajax({

        type:'post',

        url:_urls + 'EWCH/GetLRADs',

        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){
            _myChart101.showLoading();
            _myChart202.showLoading();

        },
        success:function(result){

            _myChart101.hideLoading();
            _myChart202.hideLoading();

            //console.log(result);

            var loadRate = parseFloat(result.lrtV);


            if(result.lrtV == null){

                loadRate = 0;
            }

            //console.log(option01);

            //页面赋值
            option01.title.text = loadRate + "%";

            option01.series[0].data = [100-loadRate,loadRate];

            if(area == "EC" || area == "WC"){

                _myChart202.setOption( option01,true);

            }else{

                _myChart101.setOption( option01,true);
            }


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            _myChart101.hideLoading();
            _myChart202.hideLoading();


            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })

}

//获取[供冷温度曲线]历史数据
function getTDayGLWs(ew,ch) {

    var url = sessionStorage.apiUrlPrefix + "EWCH/GetTDayWDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()),
        AREA:ew,
        CH:ch
    };
    _consumotionChart.showLoading();

    $.post(url,par,function (result) {
        console.log(result);
        _consumotionChart.hideLoading();
        if(result.code ===0){

            if(result.master.length > 0){

                var dataArr = result.master;

                var html = "<div id='glwd-container' style=''>";

                $(dataArr).each(function(i,o){

                    if(i == 0){

                        html += "<span class='onClick' data-id='"+ o.typeId+"'>"+ o.typeNt+"</span>";

                    }else{

                        html += "<span data-id='"+ o.typeId+"'>"+ o.typeNt+"</span>";

                    }
                });

                html += "</div>";

                if($('#glwd-container').length < 1){

                    $('#consumotion-echart0').append(html);

                }

                var res = result.master[0];

                $('#glwd-container span').off('click');

                $('#glwd-container span').on('click',function(){

                    //清除选中
                    $('#glwd-container span').removeClass('onClick');

                    $(this).addClass('onClick');

                    var index = $(this).index();

                    res = result.master[index];

                    drawTDayGLWs(res);

                });

                drawTDayGLWs(res);


            }else{

                var res = {
                    dayWs:[],
                    lgs:[],
                    xs:[],
                    typeNt:''
                };

                drawTDayGLWs(res);
            };

        }else if(res.code === -1){

        }else{

        }

    })
}

function drawTDayGLWs(res){

    var serary = [];
    for (var i = 0; i< res.dayWs.length; i++){
        var objser = {};
        objser.name = res.lgs[i];
        objser.type = 'line';
        objser.data = [];
        for (var j =0; j< res.dayWs[i].length; j++){
            objser.data.push(res.dayWs[i][j]);
        }
        serary.push(objser);
    }
    option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: res.lgs
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: res.xs
        },
        yAxis: {
            type: 'value',
            name:'单位:(℃)'
        },
        series: serary
    };
    _consumotionChart.setOption( option,true);

}

//获取[冷量曲线]历史数据
function getTDayCs(ew){
    var url = sessionStorage.apiUrlPrefix + "EWCH/GetTDayCDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        AREA:ew
    }
    _consumotionChart.showLoading();
    $.post(url,par,function (res) {
        _consumotionChart.hideLoading();
        if(res.code ===0){
            var serary = [];
            for (var i = 0; i< res.ys.length; i++){
                var objser = {};
                objser.name = res.lgs[i];
                objser.type = 'line';
                objser.data = [];
                for (var j =0; j< res.ys[i].length; j++){
                    objser.data.push(res.ys[i][j]);
                }
                serary.push(objser);
            }
            option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: res.lgs
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: res.xs
                },
                yAxis: {
                    type: 'value',
                    name:'单位:(kw)'
                },
                series: serary
            };
            _consumotionChart.setOption( option,true);
        }else if(res.code === -1){

        }else{

        }
    })
}

//获取[汽耗曲线]历史数据
function getTDayQs(ew) {
    var url = sessionStorage.apiUrlPrefix + "EWCH/GetTDayQDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        AREA:ew
    };
    _consumotionChart.showLoading();
    $.post(url,par,function (res) {
        _consumotionChart.hideLoading();
        if(res.code ===0){
            var serary = [];
            for (var i = 0; i< res.ys.length; i++){
                var objser = {};
                objser.name = res.lgs[i];
                objser.type = 'line';
                objser.data = [];
                for (var j =0; j< res.ys[i].length; j++){
                    objser.data.push(res.ys[i][j]);
                }
                serary.push(objser);
            }
            option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: res.lgs
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: res.xs
                },
                yAxis: {
                    type: 'value',
                    name:'单位:(kg)'
                },
                series: serary
            };
            _consumotionChart.setOption( option,true);
        }else if(res.code === -1){

        }else{

        }
    })
}

//获取电耗曲线监测数据
var _consumotionChart = echarts.init(document.getElementById('consumotion-echart0'));
function getTDayEs(ew) {
    var url = sessionStorage.apiUrlPrefix + "EWCH/GetTDayEDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        AREA:ew
    };
    _consumotionChart.showLoading();
    $.post(url,par,function (res) {
        _consumotionChart.hideLoading();
        if(res.code === 0){
            var serary = [];
            for (var i = 0; i< res.ys.length; i++){
                var objser = {};
                objser.name = res.lgs[i];
                objser.type = 'line';
                objser.data = [];
                for (var j =0; j< res.ys[i].length; j++){
                    objser.data.push(res.ys[i][j]);
                }
                serary.push(objser);
            }
            option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: res.lgs
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: res.xs
                },
                yAxis: {
                    type: 'value',
                    name:'单位:(kw)'
                },
                series: serary
            };
            _consumotionChart.setOption( option,true);
        }else if(res.code === -1){

        }else{

        }
    })
};


//获取总供热量数据
var _heatDataChart = echarts.init(document.getElementById('consumotion-echart'));
function getTotalHeatData(ew){

    var url = sessionStorage.apiUrlPrefix + "EWCH/GetTDayZGRDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        AREA:ew
    };
    _heatDataChart.showLoading();
    $.post(url,par,function (res) {
        _heatDataChart.hideLoading();
        if(res.code === 0){
            var serary = [];
            for (var i = 0; i< res.ys.length; i++){
                var objser = {};
                objser.name = res.lgs[i];
                objser.type = 'line';
                objser.data = [];
                for (var j =0; j< res.ys[i].length; j++){
                    objser.data.push(res.ys[i][j]);
                }
                serary.push(objser);
            }
            option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: res.lgs
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: res.xs
                },
                yAxis: {
                    type: 'value',
                    name:'单位:(kw)'
                },
                series: serary
            };
            _heatDataChart.setOption( option,true);
        }else if(res.code === -1){

        }else{

        }
    })
};

//获取总蒸汽曲线
function getTotalSteamData(ew){

    var url = sessionStorage.apiUrlPrefix + "EWCH/GetTDayZZQDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        AREA:ew
    };

    _heatDataChart.showLoading();
    $.post(url,par,function (res) {
        _heatDataChart.hideLoading();
        if(res.code === 0){
            var serary = [];
            for (var i = 0; i< res.ys.length; i++){
                var objser = {};
                objser.name = res.lgs[i];
                objser.type = 'line';
                objser.data = [];
                for (var j =0; j< res.ys[i].length; j++){
                    objser.data.push(res.ys[i][j]);
                }
                serary.push(objser);
            }
            option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: res.lgs
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: res.xs
                },
                yAxis: {
                    type: 'value',
                    name:'单位:(m³)'
                },
                series: serary
            };
            _heatDataChart.setOption( option,true);
        }else if(res.code === -1){

        }else{

        }
    })
};

//总能耗量曲线
function getTotalEnergyData(ew){

    var url = sessionStorage.apiUrlPrefix + "EWCH/GetTDayZEDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        AREA:ew
    };
    _heatDataChart.showLoading();
    $.post(url,par,function (res) {
        _heatDataChart.hideLoading();
        if(res.code === 0){
            var serary = [];
            for (var i = 0; i< res.ys.length; i++){
                var objser = {};
                objser.name = res.lgs[i];
                objser.type = 'line';
                objser.data = [];
                for (var j =0; j< res.ys[i].length; j++){
                    objser.data.push(res.ys[i][j]);
                }
                serary.push(objser);
            }
            option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: res.lgs
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: res.xs
                },
                yAxis: {
                    type: 'value',
                    name:'单位:(kw)'
                },
                series: serary
            };
            _heatDataChart.setOption( option,true);

        }else if(res.code === -1){

        }else{

        }
    });
};

//总供热温度
function getTotalZGWD(ew){

    var url = sessionStorage.apiUrlPrefix + "EWCH/GetTDayZGWDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        AREA:ew,
        CH:'H'
    };
    _myChart5.showLoading();
    $.post(url,par,function (res) {

        _myChart5.hideLoading();
        if(res.code === 0){
            var serary = [];
            for (var i = 0; i< res.ys.length; i++){
                var objser = {};
                objser.name = res.lgs[i];
                objser.type = 'line';
                objser.data = [];
                for (var j =0; j< res.ys[i].length; j++){
                    objser.data.push(res.ys[i][j]);
                }
                serary.push(objser);
            }
            option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: res.lgs
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: res.xs
                },
                yAxis: {
                    type: 'value',
                    name:'单位:(℃)'
                },
                series: serary
            };
            _myChart5.setOption( option,true);

        }else if(res.code === -1){

        }else{

        }
    });
};

//获取换热效率
var chartViewHRXL = echarts.init(document.getElementById('bottom-efficiency-chart'));
function getHRXL(ew) {
    var url = sessionStorage.apiUrlPrefix + "EWCH/GetHRXLMos";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        AREA:ew
    };
    chartViewHRXL.showLoading();
    $.post(url,par,function (res) {
        chartViewHRXL.hideLoading();
        if(res.code === 0){
            $('#span_HRXL_rVa_text').html(res.cVa);
            $('#span_HRXL_eVa_text').html(res.eVa);
            $('#span_HRXL_nxVa_text').html(res.nxVa);
            var option = initareaoption1(cc,res.minVa,res.maxVa,res.nxVa);
            chartViewHRXL.setOption( option,true);
        }else if(res.code === -1){
            $('#span_HRXL_rVa_text').html('0');
            $('#span_HRXL_eVa_text').html('0');
            $('#span_HRXL_nxVa_text').html('0');
            console.log('异常错误(冷冻侧):' + res.msg);
        }else{
            $('#span_HRXL_rVa_text').html('0');
            $('#span_HRXL_eVa_text').html('0');
            $('#span_HRXL_nxVa_text').html('0');
        }
    })
};

//获取热水输送系数
var chartViewSSXS = echarts.init(document.getElementById('bottom-efficiency-chart1'));
function getSSXS(ew) {

    var url = sessionStorage.apiUrlPrefix + "EWCH/GetRWXMos";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        AREA:ew
    };

    chartViewSSXS.showLoading();
    $.post(url,par,function (res) {
        chartViewSSXS.hideLoading();
        if(res.code === 0){
            $('#span_SSXS_rVa_text').html(res.cVa);
            $('#span_SSXS_eVa_text').html(res.eVa);
            $('#span_SSXS_nxVa_text').html(res.nxVa);
            var option = initareaoption1(cc,res.minVa,res.maxVa,res.nxVa);
            chartViewSSXS.setOption( option,true);
        }else if(res.code === -1){
            $('#span_SSXS_rVa_text').html('0');
            $('#span_SSXS_eVa_text').html('0');
            $('#span_SSXS_nxVa_text').html('0');
            console.log('异常错误(冷冻侧):' + res.msg);
        }else{
            $('#span_SSXS_rVa_text').html('0');
            $('#span_SSXS_eVa_text').html('0');
            $('#span_SSXS_nxVa_text').html('0');
        }
    })
};


var cc = [[0.23, '#2170F4'], [0.28, '#14E398'], [0.33, '#EAD01E'], [1, '#F8276C']];

var cc1 = [[0.23, '#F8276C'], [0.28, '#EAD01E'], [0.33, '#14E398'], [1, '#2170F4']];

//获取[冷冻侧系统]数据
var chartViewLDCMain =  echarts.init(document.getElementById('bottom-childwater-chart4'));
function getLDCAE(ew) {

    var url = sessionStorage.apiUrlPrefix + "EWCH/GetLDCMos";
    var st = moment().format('YYYY-MM-DD HH:mm');
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(st),
        AREA:ew
    };
    chartViewLDCMain.showLoading();
    $.post(url,par,function (res) {
        chartViewLDCMain.hideLoading();
        //console.log(res);
        if(res.code === 0){
            $('#span_LDC_cVa_text').html(res.cVa);
            $('#span_LDC_eVa_text').html(res.eVa);
            $('#span_LDC_nxVa_text').html(res.nxVa);
            var minVa = 0;
            var maxVa = 50;

            var cc = [[0.44, '#F8276C'], [0.60, '#EAD01E'], [0.76, '#14E398'], [1, '#2170F4']];

            var cc = [[0.44, '#F8276C'], [0.60, '#EAD01E'], [0.76, '#14E398'], [1, '#2170F4']];

            var option = initareaoption(cc,minVa,maxVa,res.nxVa);

            chartViewLDCMain.setOption( option,true);
        }else if(res.code === -1){
            $('#span_LDC_cVa_text').html('0');
            $('#span_LDC_eVa_text').html('0');
            $('#span_LDC_nxVa_text').html('0');
            console.log('异常错误(冷冻侧):' + res.msg);
        }else{
            $('#span_LDC_cVa_text').html('0');
            $('#span_LDC_eVa_text').html('0');
            $('#span_LDC_nxVa_text').html('0');
        }
    })
};

//获取[冷却侧系统]数据
var chartViewLQCMain =  echarts.init(document.getElementById('bottom-coolwater-chart3'));
function getLQCAE(ew) {
    var url = sessionStorage.apiUrlPrefix + "EWCH/GetLQCMos";
    var st = moment().format('YYYY-MM-DD HH:mm');
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(st) ,
        AREA:ew
    };
    chartViewLQCMain.showLoading();
    $.post(url,par,function (res) {
        chartViewLQCMain.hideLoading();
        if(res.code === 0){

            $('#span_LQC_rVa_text').html(res.cVa);
            $('#span_LQC_eVa_text').html(res.eVa);
            $('#span_LQC_nxVa_text').html(res.nxVa);
            var minVa = 0;
            var maxVa = 50;

            var cc = [[0.44, '#F8276C'], [0.60, '#EAD01E'], [0.76, '#14E398'], [1, '#2170F4']];

            var option = initareaoption(cc,minVa,maxVa,res.nxVa);
            chartViewLQCMain.setOption( option,true);
        }else if(res.code === -1){
            $('#span_LQC_rVa_text').html('0');
            $('#span_LQC_eVa_text').html('0');
            $('#span_LQC_nxVa_text').html('0');
            console.log('异常错误(冷却侧):' + res.msg);
        }else{
            $('#span_LQC_rVa_text').html('0');
            $('#span_LQC_eVa_text').html('0');
            $('#span_LQC_nxVa_text').html('0');
        }
    })

};

//获取[热泵机组系统]数据
var chartViewRBJMain =  echarts.init(document.getElementById('bottom-refrigerator-chart2'));
function getRBJAE(ew) {
    var url = sessionStorage.apiUrlPrefix + "EWCH/GetRBJMos";
    var st = moment().format('YYYY-MM-DD HH:mm');
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(st) ,
        AREA:ew
    };
    chartViewRBJMain.showLoading();
    $.post(url,par,function (res) {
        chartViewRBJMain.hideLoading();
        if(res.code === 0){

            $('#span_RBJ_cVa_text').html(res.cVa);
            $('#span_RBJ_eVa_text').html(res.eVa);
            $('#span_RBJ_nxVa_text').html(res.nxVa);
            var minVa = 0;
            var maxVa = 7.0;

            var cc1 = [[0.55, '#F8276C'], [0.67, '#EAD01E'], [0.80, '#14E398'], [1, '#2170F4']];

            var option = initareaoption(cc1,minVa,maxVa,res.nxVa);

            chartViewRBJMain.setOption( option,true);
        }else if(res.code === -1){
            $('#span_RBJ_cVa_text').html('0');
            $('#span_RBJ_eVa_text').html('0');
            $('#span_RBJ_nxVa_text').html('0');
            console.log('异常错误(热泵机组):' + res.msg);
        }else{
            $('#span_RBJ_cVa_text').html('0');
            $('#span_RBJ_eVa_text').html('0');
            $('#span_RBJ_nxVa_text').html('0');
        }
    })
};

//获取[溴锂机组系统]数据
var chartViewXLJMain =  echarts.init(document.getElementById('bottom-refrigerator-chart1'));
function getXLJAE(ew) {
    var url = sessionStorage.apiUrlPrefix + "EWCH/GetXLJMos";
    var st = moment().format('YYYY-MM-DD HH:mm');
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(st) ,
        AREA:ew
    };
    chartViewXLJMain.showLoading();
    $.post(url,par,function (res) {
        chartViewXLJMain.hideLoading();
        if(res.code === 0){

            $('#span_XLJ_cVa_text').html(res.cVa);
            $('#span_XLJ_qVa_text').html(res.eVa);
            $('#span_XLJ_nxVa_text').html(res.nxVa);
            var minVa = 0;
            var maxVa = 1.35;

            var cc1 = [[0.74, '#F8276C'], [0.81, '#EAD01E'], [0.90, '#14E398'], [1, '#2170F4']];

            var option = initareaoption(cc1,minVa,maxVa,res.nxVa);
            chartViewXLJMain.setOption( option,true);
        }else if(res.code === -1){
            $('#span_XLJ_cVa_text').html('0');
            $('#span_XLJ_qVa_text').html('0');
            $('#span_XLJ_nxVa_text').html('0');
            console.log('异常错误(溴锂机组):' + res.msg);
        }else{
            $('#span_XLJ_cVa_text').html('0');
            $('#span_XLJ_qVa_text').html('0');
            $('#span_XLJ_nxVa_text').html('0');
        }
    })
};

//获取[离心机组系统]数据
var chartViewLXJMain =  echarts.init(document.getElementById('bottom-refrigerator-chart'));
function getLXJAE(ew) {
    var url = sessionStorage.apiUrlPrefix + "EWCH/GetLXJMos";
    var st = moment().format('YYYY-MM-DD HH:mm');
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(st),
        AREA:ew
    };
    chartViewLXJMain.showLoading();
    $.post(url,par,function (res) {

        chartViewLXJMain.hideLoading();
        if(res.code === 0) {

            $('#span_LXJ_cVa_text').html(res.cVa);
            $('#span_LXJ_eVa_text').html(res.eVa);
            $('#span_LXJ_nxVa_text').html(res.nxVa);
            var minVa = 0;
            var maxVa = 7.0;

            var cc1 = [[0.55, '#F8276C'], [0.67, '#EAD01E'], [0.80, '#14E398'], [1, '#2170F4']];

            var option = initareaoption(cc1,minVa,maxVa,res.nxVa);
            chartViewLXJMain.setOption( option,true);

        }else if(res.code === -1) {

            $('#span_LXJ_cVa_text').html('0');
            $('#span_LXJ_eVa_text').html('0');
            $('#span_LXJ_nxVa_text').html('0');
            console.log('异常错误(离心机组):' + res.msg);

        }else {

            $('#span_LXJ_cVa_text').html('0');
            $('#span_LXJ_eVa_text').html('0');
            $('#span_LXJ_nxVa_text').html('0');

        }
    })
};

//初始化系统能效表盘OPTION
var initareaoption = function (cc,minVa,maxVa,nxVa){
    return option = {
        title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 14,
                fontStyle: 'normal'
            }
        },
        tooltip: {
            formatter: "{a} <br/>{c} {b}"
        },
        series: [
            {
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: cc,
                        width: 5
                    }
                },
                name: '实时能效',
                type: 'gauge',
                z: 3,
                min: parseFloat(minVa),
                max: parseFloat(maxVa),
                splitNumber: 5,
                radius: '80%',
                axisTick: {            // 坐标轴小标记
                    length: 15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 18,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                title: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'normal'
                    }
                },
                axisLabel: {
                    //show:true,
                    padding: [0, 0, 0, -5],
                    formatter: function (value) {
                        if(value > 9){

                            return value;
                        }else{
                            return value.toFixed(1);
                        }
                        //return value;
                    }
                },
                detail: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'normal',
                        padding: [20, 0, 0,0]
                    }
                },
                data: [{ value: parseFloat(nxVa)}]//, name: 'kW/kW'
            }
        ]
    };
};


//初始化系统能效表盘OPTION
var initareaoption1 = function (cc,minVa,maxVa,nxVa){
    return option = {
        title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 14,
                fontStyle: 'normal'
            }
        },
        tooltip: {
            formatter: "{a} <br/>{c} {b}"
        },
        series: [
            {
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: cc,
                        width: 5
                    }
                },
                name: '实时能效',
                type: 'gauge',
                z: 3,
                center:['22%', '60%'],
                min: parseFloat(minVa),
                max: parseFloat(maxVa),
                splitNumber: 9,
                radius: '80%',
                axisTick: {            // 坐标轴小标记
                    length: 15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                title: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'normal'
                    }
                },
                detail: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'normal'
                    }
                },
                data: [{ value: parseFloat(nxVa)}]//, name: 'kW/kW'
            },
        ]
    };
};


//换热效率
// 指定图表的配置项和数据
var option1 = {
    title: {

        textStyle:{
            fontSize:'15',
            fontWeight:'normal'
        },
        textBaseline:'middle',

        subtextStyle:{
            color:'#333'
        },
        x:'center',
        bottom:'8'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '当前能耗',
            type: 'gauge',
            radius: '90%',
            center:['22%', '60%'],
            min: 0,
            max:3,
            splitNumber: 15,
            splitLine: {           // 分隔线
                length: 9,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width:5,
                z: 10
            },
            axisTick: {            // 坐标轴小标记
                splitNumber: 5,
                length: 7,        // 属性length控制线长
                lineStyle: {        // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
              fontSize:8
            },
            title : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 12,
                fontStyle: 'italic',
                color:'#666',
                z: 1,
                offsetCenter:[0, '75%']
            },
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#2170F4'], [0.26, '#14E398'], [0.32, '#EAD01E'],[1, '#F8276C']],
                    width: 5
                }
            },
            data: [{value:1.2,name:'kW/RT'}]
        }
    ]
};

var _myChart2 =  echarts.init(document.getElementById('bottom-efficiency-chart'));

var _myChart3 =  echarts.init(document.getElementById('bottom-efficiency-chart1'));

_myChart2.setOption( option1,true);

_myChart3.setOption( option1,true);


//能耗曲线
var option2 = {

    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['总供水温度(℃)']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        },
        show:false
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine:{
            lineStyle:{
                color:'#999'
            }
        },
        data: []
    },
    yAxis: {
        type: 'value',
        axisLine:{
            lineStyle:{
                color:'#999'
            }
        }
    },
    series: [
        {
            name:'总供水温度(℃)',
            type:'line',
            stack: '总量',
            itemStyle:{
                normal:{
                    color:'#2170F4'

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#2170F4'
                    }, {
                        offset: 1,
                        color: '#fff'
                    }])
                }
            },
            data:[]
        },
        {
            name:'冷机',
            type:'line',
            stack: '总量',
            itemStyle:{
                normal:{
                    color:'#F8276C'

                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#F8276C'
                    }, {
                        offset: 1,
                        color: '#fff'
                    }])
                }
            },
            data:[]
        }
    ]
};

var _myChart4 = echarts.init(document.getElementById('consumotion-echart'));

_myChart4.setOption( option2,true);

//_heatDataChart.setOption( option2,true);

//供热温度曲线
var _myChart5 = echarts.init(document.getElementById('temperature-echart'));

_myChart5.setOption( option2,true);


//配置流程图页面中的区域位置
var monitorAreaArr = [
    {
        "areaName":"东冷站",
        "areaId":"60"
    },
    {
        "areaName":"西冷站",
        "areaId":"62"
    }
];
//把区域信息放入到流程图页面中
sessionStorage.monitorArea = JSON.stringify(monitorAreaArr);

//点击不同区域获取不同的设备列表
$('#monitor-menu-container').on('click','span',function(){

    //获取当前的区域ID
    var areaID = $(this).attr('data-district');

    //定义当前的设备类型
    var devTypeID = 1;

    //获取当前是东冷站还是西冷站
    var ew = '';

    $('.equipment-table').hide();

    $('.right-bottom-show-type-table .dataTables_info').hide();

    $('.right-bottom-show-type-table .paging_simple_numbers').hide();

    //如果是冷站数据
    if(areaID == 60 || areaID == 62){

        //东冷站
        if(areaID == 60){
            ew = 'EC';

            $('.right-bottom-content1 .control-area-span').html("东");
            //西冷站
        }else if(areaID == 62){

            ew = 'WC';

            $('.right-bottom-content1 .control-area-span').html("西");
        }

        $(".right-bottom-content1 .right-bottom-content-bottom .consumption-container").find('span').removeClass('onClick');

        $(".right-bottom-content1 .right-bottom-content-bottom .consumption-container").find('span').eq(0).addClass('onClick');

        //获取[离心机组系统]实时数据
        getLXJAE(ew);

        //获取[溴锂机组系统]实时数据
        getXLJAE(ew);
        //
        //获取[热泵机组系统]实时数据
        getRBJAE(ew);

        //获取[冷却侧系统]实时数据
        getLQCAE(ew);

        //获取[冷冻侧系统]实时数据
        getLDCAE(ew);

        //获取[冷量曲线]历史数据
        getTDayCs(ew);

        //设备运行数据
        getRunData(ew,"C");

        //获取当前的设备列表
        $('#equipment-datatables').show();

        $('.right-bottom-show-type-table .dataTables_info').eq(0).show();

        $('.right-bottom-show-type-table .paging_simple_numbers').eq(0).show();

        getSecondColdHotSour('NJNDeviceShow/GetSecondColdHotSour', devTypeID, areaID);

    //如果是热站数据
    }else{

        //东热站
        if(areaID == 61){
            ew = 'EH';

            $('.right-bottom-content1 .control-area-span').html("东");

            //西热站
        }else if(areaID == 63){

            ew = 'WH';

            $('.right-bottom-content1 .control-area-span').html("西");
        }

        //获取总供热量
        getTotalHeatData(ew);

        //总供热温度
        getTotalZGWD(ew);

        //换热效率
        getHRXL(ew);

        //获取热水输送系统
        getSSXS(ew);

        //设备运行数据
        getRunData(ew,"H");

        //获取当前的设备列表
        $('#equipment-datatables1').show();

        $('.right-bottom-show-type-table .dataTables_info').eq(1).show();

        $('.right-bottom-show-type-table .paging_simple_numbers').eq(1).show();

        getSecondColdHotSour('NJNDeviceShow/GetSecondColdHotSour', devTypeID, areaID,$('#equipment-datatables1'));

    }
});

//获取后台报警数据
function getAlarmData(area){

    //获取当前时间
    var curDt = moment().format('YYYY-MM-DD HH:mm');

    //传递给后台的参数
    var  ecParams = {
        "pId":curPointerIDArr[0],
        "dt": curDt, //当前时间
        "area": area
    };

    $.ajax({

        type:'post',

        url:_urls + 'EWCH/GetAlarmNowDs',

        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){


        },
        success:function(result){


            console.log(result);

            //页面赋值
            alarmArr = result.master;

            //遍历报警数组给页面赋值
            var html = "";

            $(alarmArr).each(function(i,o){

                //获取当前报警条数
                var alarmLength = o.alarm_List.length;

                html += '<p class="alarm-content" data-id="'+ o.innerID+'">'+ o.cDtnName+'<font></font> <span>X'+alarmLength+'</span></p>';


            });

            if(area == 'EC' || area == 'WC'){

                $('.alarm-content-container').eq(0).html(html);

            }else{

                $('.alarm-content-container').eq(1).html(html);
            }


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            setTimeout(function(){
                $('' + containerName + ' .bottom-table-data-container' +tableName+ '').hideLoading();
            },500);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

            }

        }

    })
};

function showAlarmDataMessage(messageArr){

   // console.log(messageArr);

    var tableHtml = "";

    $(messageArr).each(function(i,o){

        tableHtml += "<tr>";

        //设备名称
        tableHtml += "<td>"+ o.devName+"</td>";

        //报警名称
        tableHtml += "<td>"+ o.alarmName+"</td>";

        //位置
        tableHtml += "<td>"+ o.areaName+"</td>";

        //服务区域
        tableHtml += "<td>"+ o.serviceArea+"</td>";

        //类型
        tableHtml += "<td>"+ o.cDtnName+"</td>";

        //级别
        tableHtml += "<td>"+ o.priorityName+"</td>";

        //报警时间
        tableHtml += "<td>"+ o.dataDate+"</td>";

        tableHtml += "</tr>";

    });

    //页面赋值
    $('#alarm-message tbody').html(tableHtml);
};

/*-------------------------------------------表格初始化--------------------------------------------*/
var table = $('#equipment-datatables').DataTable({
    "bProcessing" : true,
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": true,//还原初始化了的datatable
    "paging":true,
    "ordering": false,
    'searching':false,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        //这里很重要，如果你的加载中是文字，则直接写上文字即可，如果是gif的图片，使用img标签就可以加载
        "sProcessing" : "<span style='color:#ff0000;'>正在加载</span>",
        'lengthMenu': '每页 _MENU_ 条',
        'zeroRecords': '没有数据',
        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页  总记录数为 _TOTAL_ 条',
        "sInfoEmpty" : "记录数为0",
        "sInfoFiltered" : "(全部记录数 _MAX_ 条)",
        'paginate': {
            'first':      '第一页',
            'last':       '最后一页',
            'next':       '下一页',
            'previous':   '上一页'
        },
        'infoEmpty': ''
    },
    'buttons': [

    ],
    "dom":'B<"clear">lfrtip',
    //数据源
    'columns':[
        {
            title:'序号',
            data:'areaName',
            render:function(data, type, row, meta){


                return meta.row + 1;

            }
        },
        {
            title:'设备位置',
            data:'areaName',
            className:'位置'
        },
        {
            title:'所属系统',
            data:'typeName'
        },
        {
            title:'设备名称',
            data:'devName'
        },
        {
            title:'设备编号',
            data:'devNum'
        },
        {
            title:'服务区域',
            data:'serviceArea'
        },
        {
            title:'季节模式',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                return '夏季';
            }

        },
        {
            title:'控制模式',
            data:'',
            render:function(data, type, row, meta){


                return 'BKS';

            }
        },
        {
            title:'手自动状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                $(data).each(function(i,o){

                });

                return '自动';

            }
        },
        {
            title:'运行状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '--';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4521'){

                        if(o.cDataValue == 3){

                            result =  "ON"
                        }else{
                             result =  "OFF";
                        }


                    }
                });

                return result;

            }
        },
        {
            title:'故障状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '正常';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4531'){

                        if(o.cDataValue == 1){

                            result =  "故障"
                        }else{
                            result =  "正常";
                        }


                    }
                });

                return result;

            }
        },
        {
            title:'冷冻进水温度（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '--';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4522'){

                        result =  o.cDataValue.toFixed(1);

                    }
                });

                return result;


            }
        },
        {
            title:'冷冻出水温度（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '--';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4523'){

                        result =  o.cDataValue.toFixed(1)

                    }
                });

                return result;

            }
        },
        {
            title:'冷却进水温度（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '--';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4524'){

                        result =  o.cDataValue.toFixed(1)

                    }
                });

                return result;

            }
        },
        {
            title:'冷却出水温度（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '--';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4525'){

                        result =  o.cDataValue.toFixed(1)

                    }
                });

                return result;

            }
        },
        {
            title:'累计运行时间（h）',
            data:'runTime',
            render:function(data, type, row, meta){

                if(data == '0.00'){

                    return "--"
                }

                return data;

            }
        },
        {
            title:'功率（kW）',
            data:'powerValue',
            //render:function(data, type, row, meta){
            //
            //
            //    return data.toFixed(2);
            //
            //}
        }
    ]
});

/*-------------------------------------------表格初始化--------------------------------------------*/
var table1 = $('#equipment-datatables1').DataTable({
    "bProcessing" : true,
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": true,//还原初始化了的datatable
    "paging":true,
    "ordering": false,
    'searching':false,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        //这里很重要，如果你的加载中是文字，则直接写上文字即可，如果是gif的图片，使用img标签就可以加载
        "sProcessing" : "<span style='color:#ff0000;'>正在加载</span>",
        'lengthMenu': '每页 _MENU_ 条',
        'zeroRecords': '没有数据',
        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页  总记录数为 _TOTAL_ 条',
        "sInfoEmpty" : "记录数为0",
        "sInfoFiltered" : "(全部记录数 _MAX_ 条)",
        'paginate': {
            'first':      '第一页',
            'last':       '最后一页',
            'next':       '下一页',
            'previous':   '上一页'
        },
        'infoEmpty': ''
    },
    'buttons': [

    ],
    "dom":'B<"clear">lfrtip',
    //数据源
    'columns':[
        {
            title:'序号',
            data:'areaName',
            render:function(data, type, row, meta){


                return meta.row + 1;

            }
        },
        {
            title:'设备位置',
            data:'areaName',
            className:'位置'
        },
        {
            title:'所属系统',
            data:'typeName'
        },
        {
            title:'设备名称',
            data:'devName'
        },
        {
            title:'设备编号',
            data:'devNum'
        },
        {
            title:'服务区域',
            data:'serviceArea'
        },
        {
            title:'季节模式',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){


                return '夏季';

            }
        },
        {
            title:'控制模式',
            data:'',
            render:function(data, type, row, meta){


                return '停止';

            }
        },
        {
            title:'手自动状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                $(data).each(function(i,o){

                });

                return '--';

            }
        },
        {
            title:'运行状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '--';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4521'){

                        if(o.cDataValue == 3){

                            result =  "ON"
                        }else{
                            result =  "OFF";
                        }


                    }
                });

                return result;

            }
        },
        {
            title:'故障状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '';

                $(data).each(function(i,o){

                    if(o.cTypeID == '16'){

                        if(o.cDataValue == 1){

                            result =  "故障"
                        }else{

                            result =  "正常";
                        }


                    }
                });

                if(result == ''){

                    result = '正常';
                }

                return result;

            }
        },
        {
            title:'采暖供水温度（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '--';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4535'){

                        result =  o.cDataValue.toFixed(1)

                    }
                });

                return result;


            }
        },
        {
            title:'采暖回水温度（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                var result = '--';

                $(data).each(function(i,o){

                    if(o.cTypeID == '4535'){

                        result =  o.cDataValue.toFixed(1)

                    }
                });

                return result;

            }
        },
        {
            title:'累计运行时间（h）',
            data:'runTime',
            render:function(data, type, row, meta){

                if(data == '0.00'){

                    return "--"
                }

                return data;

            }
        },
        {
            title:'功率（kW）',
            data:'powerValue',
            //render:function(data, type, row, meta){
            //
            //
            //    return data.toFixed(2);
            //
            //}
        }
    ]
});











