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
}

//系统实时日期时间
var sysrealdt = function () {
    var nowDt = new Date();
    var year = nowDt.getFullYear();
    var month = parseInt(nowDt.getMonth())+1;
    var day = nowDt.getDate();
    var dt = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
    return dt;
}

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
}

$(function(){

    //切换能耗曲线的选项卡
    $('.consumption-container span').on('click',function(){
        $(this).parent().children().removeClass('onClick');
        $(this).addClass('onClick');

        //获取当前索引
        var index = $(this).index();

        //获取当前的区域ID
        var areaID = $(this).attr('data-district');

        //获取当前是东冷站还是西冷站
        var ew = '';

        if(areaID == 60){
            ew = 'E'
        }else if(areaID == 62){
            ew = 'W'
        }

        //电耗曲线
        if(index == 0){

            getTDayEs(ew);

        //汽耗曲线
        }else if(index == 1){

            //获取[汽耗曲线]历史数据
            getTDayQs(ew);

        //冷量曲线
        }else if(index == 2){

            //获取[冷量曲线]历史数据
            getTDayCs(ew);

        //冷冻温度曲线
        }else if(index == 3){

            //获取[供冷温度曲线]历史数据
            getTDayGLWs(ew);

        }
    });

    //切换冷热站
    $('.right-bottom-container1 .right-bottom-tab-container span').on('click',function(){
        //获取当前点击的元素的index
        var index = $(this).index();
        //冷站
        if(index < 2){
            $('.right-bottom-container1 .right-bottom-content').eq(0).show();
            $('.right-bottom-container1 .right-bottom-content').eq(1).hide();
        }else{
            $('.right-bottom-container1 .right-bottom-content').eq(0).hide();
            $('.right-bottom-container1 .right-bottom-content').eq(1).show();
        }
    });

    var pos = JSON.parse(sessionStorage.pointers);
    var po = pos[0];
    sessionStorage.PointerID = po.pointerID;
    sessionStorage.PointerName = po.pointerName;

    ////获取[离心机组系统]实时数据
    //getLXJAE('E');
    //
    ////获取[溴锂机组系统]实时数据
    //getXLJAE('E');
    //
    ////获取[热泵机组系统]实时数据
    //getRBJAE('E');
    //
    ////获取[冷却侧系统]实时数据
    //getLQCAE('E');
    //
    ////获取[冷冻侧系统]实时数据
    //getLDCAE('E');
    //
    ////获取[电耗曲线]历史数据
    //getTDayEs('E');



});

//获取[供冷温度曲线]历史数据
function getTDayGLWs(ew) {
    var url = sessionStorage.apiUrlPrefix + "LRYC/GetTDayGLWDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        EW:ew
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
                    type: 'value'
                },
                series: serary
            };
            _consumotionChart.setOption( option,true);
        }else if(res.code === -1){

        }else{

        }
    })
}

//获取[冷量曲线]历史数据
function getTDayCs(ew){
    var url = sessionStorage.apiUrlPrefix + "LRYC/GetTDayCDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        EW:ew
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
                    type: 'value'
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
    var url = sessionStorage.apiUrlPrefix + "LRYC/GetTDayQDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        EW:ew
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
                    type: 'value'
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
    var url = sessionStorage.apiUrlPrefix + "LRYC/GetTDayEDs";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        EW:ew
    }
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
                    type: 'value'
                },
                series: serary
            };
            _consumotionChart.setOption( option,true);
        }else if(res.code === -1){

        }else{

        }
    })
}


var cc = [[0.23, '#2170F4'], [0.28, '#14E398'], [0.33, '#EAD01E'], [1, '#F8276C']];

//获取[冷冻侧系统]数据
var chartViewLDCMain =  echarts.init(document.getElementById('bottom-childwater-chart4'));
function getLDCAE(ew) {
    var url = sessionStorage.apiUrlPrefix + "LRYC/GetLQCMonitorData";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        EW:ew
    }
    chartViewLDCMain.showLoading();
    $.post(url,par,function (res) {
        chartViewLDCMain.hideLoading();
        if(res.code === 0){
            $('#span_LDC_rVa_text').html(res.cVa);
            $('#span_LDC_eVa_text').html(res.eVa);
            $('#span_LDC_nxVa_text').html(res.nxVa);
            var option = initareaoption(cc,res.minVa,res.maxVa,res.nxVa);
            chartViewLDCMain.setOption( option,true);
        }else if(res.code === -1){
            $('#span_LDC_rVa_text').html('0');
            $('#span_LDC_eVa_text').html('0');
            $('#span_LDC_nxVa_text').html('0');
            alert('异常错误(冷冻侧):' + res.msg);
        }else{
            $('#span_LDC_rVa_text').html('0');
            $('#span_LDC_eVa_text').html('0');
            $('#span_LDC_nxVa_text').html('0');
        }
    })
}

//获取[冷却侧系统]数据
var chartViewLQCMain =  echarts.init(document.getElementById('bottom-coolwater-chart3'));
function getLQCAE(ew) {
    var url = sessionStorage.apiUrlPrefix + "LRYC/GetLQCMonitorData";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        EW:ew
    }
    chartViewLQCMain.showLoading();
    $.post(url,par,function (res) {
        chartViewLQCMain.hideLoading();
        if(res.code === 0){

            $('#span_LQC_rVa_text').html(res.cVa);
            $('#span_LQC_eVa_text').html(res.eVa);
            $('#span_LQC_nxVa_text').html(res.nxVa);
            var option = initareaoption(cc,res.minVa,res.maxVa,res.nxVa);
            chartViewLQCMain.setOption( option,true);
        }else if(res.code === -1){
            $('#span_LQC_rVa_text').html('0');
            $('#span_LQC_eVa_text').html('0');
            $('#span_LQC_nxVa_text').html('0');
            alert('异常错误(冷却侧):' + res.msg);
        }else{
            $('#span_LQC_rVa_text').html('0');
            $('#span_LQC_eVa_text').html('0');
            $('#span_LQC_nxVa_text').html('0');
        }
    })
}

//获取[热泵机组系统]数据
var chartViewRBJMain =  echarts.init(document.getElementById('bottom-refrigerator-chart2'));
function getRBJAE(ew) {
    var url = sessionStorage.apiUrlPrefix + "LRYC/GetRBMonitorData";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        EW:ew
    }
    chartViewRBJMain.showLoading();
    $.post(url,par,function (res) {
        chartViewRBJMain.hideLoading();
        if(res.code === 0){

            $('#span_RBJ_cVa_text').html(res.cVa);
            $('#span_RBJ_eVa_text').html(res.eVa);
            $('#span_RBJ_nxVa_text').html(res.nxVa);
            var option = initareaoption(cc,res.minVa,res.maxVa,res.nxVa);
            chartViewRBJMain.setOption( option,true);
        }else if(res.code === -1){
            $('#span_RBJ_cVa_text').html('0');
            $('#span_RBJ_eVa_text').html('0');
            $('#span_RBJ_nxVa_text').html('0');
            alert('异常错误(热泵机组):' + res.msg);
        }else{
            $('#span_RBJ_cVa_text').html('0');
            $('#span_RBJ_eVa_text').html('0');
            $('#span_RBJ_nxVa_text').html('0');
        }
    })
}

//获取[溴锂机组系统]数据
var chartViewXLJMain =  echarts.init(document.getElementById('bottom-refrigerator-chart1'));
function getXLJAE(ew) {
    var url = sessionStorage.apiUrlPrefix + "LRYC/GetXLHMonitorData";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        EW:ew
    }
    chartViewXLJMain.showLoading();
    $.post(url,par,function (res) {
        chartViewXLJMain.hideLoading();
        if(res.code === 0){

            $('#span_XLJ_cVa_text').html(res.cVa);
            $('#span_XLJ_qVa_text').html(res.eVa);
            $('#span_XLJ_nxVa_text').html(res.nxVa);
            var option = initareaoption(cc,res.minVa,res.maxVa,res.nxVa);
            chartViewXLJMain.setOption( option,true);
        }else if(res.code === -1){
            $('#span_XLJ_cVa_text').html('0');
            $('#span_XLJ_qVa_text').html('0');
            $('#span_XLJ_nxVa_text').html('0');
            alert('异常错误(溴锂机组):' + res.msg);
        }else{
            $('#span_XLJ_cVa_text').html('0');
            $('#span_XLJ_qVa_text').html('0');
            $('#span_XLJ_nxVa_text').html('0');
        }
    })
}

//获取[离心机组系统]数据
var chartViewLXJMain =  echarts.init(document.getElementById('bottom-refrigerator-chart'));
function getLXJAE(ew) {
    var url = sessionStorage.apiUrlPrefix + "LRYC/GetLXJMonitorData";
    var par = {
        pId:sessionStorage.PointerID,
        dt:encodeURIComponent(sysrealdt()) ,
        EW:ew
    };
    chartViewLXJMain.showLoading();
    $.post(url,par,function (res) {
        chartViewLXJMain.hideLoading();
        if(res.code === 0) {
            $('#span_LXJ_cVa_text').html(res.cVa);
            $('#span_LXJ_eVa_text').html(res.eVa);
            $('#span_LXJ_nxVa_text').html(res.nxVa);
            var option = initareaoption(cc,res.minVa,res.maxVa,res.nxVa);
            chartViewLXJMain.setOption( option,true);
        }else if(res.code === -1) {
            $('#span_LXJ_cVa_text').html('0');
            $('#span_LXJ_eVa_text').html('0');
            $('#span_LXJ_nxVa_text').html('0');
            alert('异常错误(离心机组):' + res.msg);
        }else {
            $('#span_LXJ_cVa_text').html('0');
            $('#span_LXJ_eVa_text').html('0');
            $('#span_LXJ_nxVa_text').html('0');
        }
    })
}

//初始化系统能效表盘OPTION
var initareaoption = function (cc,minVa,maxVa,nxVa){
    return option = {
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
                        fontWeight: 'bolder'
                    }
                },
                data: [{ value: parseFloat(nxVa)}]//, name: 'KW/KW'
            },
        ]
    };
}

//负荷率
// 指定图表的配置项和数据
var option = {
    title:{
        text: '30%',
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
        formatter: "{a} <br/>{b}: {c} ({d}%)"
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
                    show: true,
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
                            '#2170F4','#e2e2e2'
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
                        show : true,
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
            data:[30,70]
        }
    ]
};

var _myChart1 =  echarts.init(document.getElementById('bottom-content-chart'));

var _myChart2=  echarts.init(document.getElementById('bottom-content-chart1'));

_myChart1.setOption( option,true);

_myChart2.setOption( option,true);

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
            data: [{value:1.2,name:'KW/RT'}]
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
        data:['冷量','冷机']
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
        data: ['周一','周二','周三','周四','周五','周六','周日']
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
            name:'冷量',
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
            data:[120, 132, 101, 134, 90, 230, 210]
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
            data:[220, 182, 191, 234, 290, 330, 310]
        }
    ]
};

var _myChart4 = echarts.init(document.getElementById('consumotion-echart'));

_myChart4.setOption( option2,true);


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

    //获取当前的设备列表
    getSecondColdHotSour('NJNDeviceShow/GetSecondColdHotSour', devTypeID, areaID);

    //获取当前是东冷站还是西冷站
    var ew = '';

    if(areaID == 60){
        ew = 'E'
    }else if(areaID == 62){
        ew = 'W'
    }

    //获取[离心机组系统]实时数据
    getLXJAE(ew);

    //获取[溴锂机组系统]实时数据
    getXLJAE(ew);

    //获取[热泵机组系统]实时数据
    getRBJAE(ew);

    //获取[冷却侧系统]实时数据
    getLQCAE(ew);

    //获取[冷冻侧系统]实时数据
    getLDCAE(ew);

    //获取[电耗曲线]历史数据
    getTDayEs(ew);

});


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


                return '';

            }
        },
        {
            title:'控制模式',
            data:'',
            render:function(data, type, row, meta){


                return '';

            }
        },
        {
            title:'手自动状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                $(data).each(function(i,o){

                });

                return '';

            }
        },
        {
            title:'运行状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                $(data).each(function(i,o){

                    if(o.cTypeID == '4521'){

                        if(o.cDataValue == 1){

                            return "ON"
                        }else{
                            return "OFF";
                        }


                    }
                });

                return '';

            }
        },
        {
            title:'故障状态',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                $(data).each(function(i,o){

                    if(o.cTypeID == '16'){

                        if(o.cDataValue == 1){

                            return "ON"

                        }else{
                            return "OFF";
                        }


                    }
                });

                return '';

            }
        },
        {
            title:'冷冻进水温度（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                $(data).each(function(i,o){

                    if(o.cTypeID == '4521'){

                        return o.cTypeID

                    }
                });

                return '';

            }
        },
        {
            title:'冷冻出水温度（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                $(data).each(function(i,o){

                    if(o.cTypeID == '4523'){

                        return o.cTypeID

                    }
                });

                return '';

            }
        },
        {
            title:'冷却进水温度（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                $(data).each(function(i,o){

                    if(o.cTypeID == '4524'){

                        return o.cTypeID

                    }
                });

                return '';

            }
        },
        {
            title:'冷却出水温度（℃）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){

                $(data).each(function(i,o){

                    if(o.cTypeID == '4525'){

                        return o.cTypeID

                    }
                });

                return '';

            }
        },
        {
            title:'累计运行时间（h）',
            data:'devCtypeDatas',
            render:function(data, type, row, meta){



                return '';

            }
        },
        {
            title:'功率（kW）',
            data:'powerValue'
        }
    ]
});









