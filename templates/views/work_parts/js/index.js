$(function(){
    //上日上年标题部分
    titleChange();
    //读取楼宇和科室的zTree；
    _objectSel = new ObjectSelection();
    _objectSel.initPointers($("#allPointer"),true);
    _objectSel.initOffices($("#allOffices"));
    //搜索框功能
    var objSearch = new ObjectSearch();
    objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
    //对象选择
    $('.left-middle-tab').click(function(){
        $(".left-middle-tab").css({
            "border":"2px solid #7f7f7f",
            "background":"#fff",
            "color":"#333"
        })
        $(this).css({
            "background":"#7f7f7f",
            "border":"2px solid #7f7f7f",
            "color":"#ffffff"
        })
        $('.tree-1').hide();
        $('.tree-1').eq($(this).index()).show();

    });
    //数据交互部分
    //默认开始时间为上日；
    timeYesterday();
    //时间选取
    $('.time-options').click(function(){
        $('.time-options').removeClass('time-options-1');
        $(this).addClass('time-options-1');
        if($(this).html() == '上日'){
            timeYesterday();
        }else if($(this).html() == '上周'){
            timeLastWeek();
        }else if($(this).html() == '上月'){
            timeLastMonth();
        }else if($(this).html() == '上年'){
            timeLastYear();
        }
        _changeTitle = $(this).html();
    })
    //echart配置项
    //仪表盘
    _myChart1 = echarts.init(document.getElementById('main-right-four'));
    option = {
        tooltip : {
            formatter: "{a} <br/>{c} {b}"
        },
        series : [
            {
                name: '电耗',
                type: 'gauge',
                center: ['53%', '55%'],
                z: 3,
                min: 0,
                max: 220,
                splitNumber: 11,
                radius: '65%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 10
                    }
                },
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
                title : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 14,
                        fontStyle: 'italic'
                    }
                },
                detail : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: '', name: 'kWh/㎡'}]
            },
            {
                name: '水耗',
                type: 'gauge',
                center: ['23%', '55%'],    // 默认全局居中
                radius: '65%',
                min:0,
                max:7,
                endAngle:45,
                splitNumber:7,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length:12,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length:20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer: {
                    width:5
                },
                title: {
                    offsetCenter: [0, '-30%']    // x, y，单位px
                },
                detail: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: '', name: 'L/㎡'}]
            },
            {
                name: '耗冷',
                type: 'gauge',
                center: ['83%', '55%'],    // 默认全局居中
                radius: '50%',
                min: 0,
                max: 2,
                startAngle: 135,
                endAngle: 45,
                splitNumber: 2,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    splitNumber: 5,
                    length: 10,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                axisLabel: {
                    formatter:function(v){
                        switch (v + '') {
                            case '1' : return 'cold';
                        }
                    }
                },
                splitLine: {           // 分隔线
                    length: 15,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer: {
                    width:2
                },
                title : {
                    show: false
                },
                detail : {
                    show: false
                },
                data:[{value: '', name: 'MJ/㎡'}]
            },
            {
                name: '耗热',
                type: 'gauge',
                center : ['83%', '55%'],    // 默认全局居中
                radius : '50%',
                min: 0,
                max: 2,
                startAngle: 315,
                endAngle: 225,
                splitNumber: 2,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    show: false
                },
                axisLabel: {
                    formatter:function(v){
                        switch (v + '') {
                            case '1' : return 'heat';
                        }
                    }
                },
                splitLine: {           // 分隔线
                    length: 15,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer: {
                    width:2
                },
                title: {
                    show: false
                },
                detail: {
                    show: false
                },
                data:[{value: '', name: 'MJ/㎡'}]
            }
        ]
    };
    //分项电耗
    _myChart = echarts.init(document.getElementById('main-right-two'));
    // 指定图表的配置项和数据
    option1 = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:arr_3
        },
        series: [
            {
                name:'',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[]
            }
        ]
    };
    //费用
    _myChart2 = echarts.init(document.getElementById('main-right-three'));
    option2 = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type : 'category',
            splitLine: {show:false},
            data : []   //[arr_6[0],arr_6[1],arr_6[2],arr_6[3]]
        },
        yAxis: {
            type : 'value'
        },
        series: [
            {
                name: '费用',
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                data:[],   //[arr_7[0],arr_7[1],arr_7[2],arr_7[3]],
                itemStyle: {
                    normal: {
                        color: '#91bbaf'
                    }
                }
            }
        ]

    };
    //页面加载时获取楼宇总能耗、分项电耗、能耗费用、用能指标
    getClassEcData();
    PointerPowerConsumption();
    theDashboard();
    PointerCharge();
    $('.btn').click(function(){
        var o=$('.tree-3')[0].style.display;
        titleChange();
        if(o == "none"){
            getOfficeClassEcData();
            OfficePowerConsumption();
            OfficeCharge();
            $('small').html(officeNames);
        }else{
            getClassEcData();
            PointerPowerConsumption();
            PointerCharge();
            $('small').html(pointerNames);
        }
        theDashboard();
    });
    $('body').mouseover(function(){
        if(_myChart && _myChart1 && _myChart2){
            _myChart.resize();
            _myChart1.resize();
            _myChart2.resize();
        }
    });
})
  //对于用户来说的区域位置 
var _changeTitle = '上日';
var _myChart;
var _myChart1;
var _myChart2;
//获取楼宇ID
//存放id
var  arr=[];
arr[0]=0;
//右边图表每块儿标题的修改；
function titleChange(){
    $('.right-one-headers').eq(0).html(_changeTitle + '分类能耗');
    $('.right-one-headers').eq(1).html(_changeTitle + '分项电耗'+'&nbsp;&nbsp;&nbsp; 单位：kWh');
    $('.right-one-headers').eq(2).html(_changeTitle + '用能指标');
    $('.right-one-headers').eq(3).html(_changeTitle + '能耗费用'+'&nbsp;&nbsp;&nbsp; 单位：元');
}
//上月分项电耗（楼宇）
var arr_3 =['特殊用电', '照明插座用电', '动力用电', '空调用电'];
var arr_33=['42', '40', '41', '02'];
var arr_4 =[];
var newStr;
var newStr1;
//用能指标(仪表盘)
function theDashboard(){
    var pts = _objectSel.getSelectedPointers(),pointerID;
    if(pts.length>0) { pointerID = pts[0].pointerID};
    if(!pointerID) { return; }
    var ecParams={'pointerId':pointerID,'startTime':newStr,'endTime':newStr1,'dateType':'日'};
    $.ajax({
         type: "post",
         url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getClassEcData',
         data: ecParams,
        beforeSend:function(){
            $('#loading2').show();
        },
         success:function(result){
             $('#loading2').hide();
                var dian = 0;
                for(var i=0;i<result.length;i++){
                    if(result[i].energyItemID == "01" ){
                        dian = result[i].ecDataByArea.toFixed(2);
                    }else if(result[i].energyItemID == "211"){
                        dian = result[i].ecDataByArea.toFixed(2);
                    }else if(result[i].energyItemID == "412"){
                        dian = result[i].ecDataByArea.toFixed(2);
                    }else if(result[i].energyItemID == "511"){
                        dian = result[i].ecDataByArea.toFixed(2);
                    }
                    option.series[i].data[0].value = dian;
                }
             _myChart1.setOption(option,true);
         }
    })
}
//上月能耗费用
var arr_6=[];
var arr_7=[];
//楼宇总能耗
function getClassEcData(){
    var pts = _objectSel.getSelectedPointers(),pointerID;
    if(pts.length>0) {
        pointerID = pts[0].pointerID;
        pointerNames = pts[0].pointerName;
    };
    $('small').html(pointerNames);
    if(!pointerID) { return; }
    var ecParams={'pointerId':pointerID,'startTime':newStr,'endTime':newStr1,'dateType':'日'};
    $.ajax({
        type: "post",
        url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getClassEcData',
        data: ecParams,
        beforeSend:function(){
            $('#loading').show();

        },
        success: function (result) {
            $('#loading').hide();
            setEnergyType(sessionStorage.allEnergyType,result);
        }
    });
}
//科室总能耗
function getOfficeClassEcData(){
    var ofs = _objectSel.getSelectedOffices(),officeID;
    if(ofs.length>0) {
        officeID = ofs[0].f_OfficeID;
        officeNames = ofs[0].f_OfficeName;
    };
    if(!officeID){ return; }
    var ecParams={'officeId':officeID,'startTime':newStr,'endTime':newStr1,'dateType':'日'};
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getOfficeClassEcData',
        data:ecParams,
        beforeSend:function(){
            $('#loading').show();
        },
        success:function(result){
            $('#loading').hide();
            setEnergyType(sessionStorage.officeEnergyType,result)
        }
    })
}
//楼宇分项电耗
function PointerPowerConsumption(){
    var pts = _objectSel.getSelectedPointers(),pointerID;
    if(pts.length>0) { pointerID = pts[0].pointerID};
    if(!pointerID) { return; }
    var ecParams={'pointerID':pointerID,'startTime':newStr,'endTime':newStr1,'energyItemIDs':arr_33};
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getEnergyItemEcData',
        data: ecParams,
        beforeSend:function(){
            $('#loading1').show();
        },
        success:function(result){
            $('#loading1').hide();
            for(var i=0;i<result.length;i++){
                arr_4[i] = result[i].ecData.toFixed(0);
            }
            for(var i=0;i<arr_4.length;i++){
                var obj = {};
                obj.value = arr_4[i];
                obj.name = arr_3[i];
                option1.series[0].data.push(obj);
            }
            // 使用刚指定的配置项和数据显示图表。
            _myChart.setOption(option1);
        }
    })
}
//科室分项电耗
function OfficePowerConsumption(){
    var ofs = _objectSel.getSelectedOffices(),officeID;
    if(ofs.length>0) {
        officeID = ofs[0].f_OfficeID;
        officeNames = ofs[0].f_OfficeName;
    };
    if(!officeID){ return; }
    var ecParams={'officeId':officeID,'startTime':newStr,'endTime':newStr1,'ecTypeId':'电'};
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'ecDatas/GetOfficeEIEC',
        data:ecParams,
        beforeSend:function(){
            $('#loading1').show();
        },
        success:function(result){
            $('#loading1').hide();
            var arr_10=[];
            for(var i=0;i<result.length;i++){
                arr_10[i] = result[i].ecData;
            }
            for(var i=0;i<arr_10.length;i++){
                var obj = {};
                obj.value = arr_10[i];
                obj.name = arr_3[i];
                option1.series[0].data.push(obj);
            }
            _myChart.setOption(option1);
        }
    })
}
//楼宇能耗费用
function PointerCharge(){
    var pts = _objectSel.getSelectedPointers(),pointerID;
    if(pts.length>0) { pointerID = pts[0].pointerID};
    if(!pointerID) { return; }
    var ecParams={'pointerOrOfficeId':pointerID,'startTime':newStr,'endTime':newStr1,'pointerOfficeType':'2'};
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getEnergyMoneyCost',
        data:ecParams,
        beforeSend:function(){
            $('#loading3').show();
        },
        success:function(result){
            $('#loading3').hide();
            for(var i=0;i<result.length;i++){
                arr_6[i] = result[i].itemName;
                arr_7[i] = parseInt(result[i].itemMoneyCost);
            }
            option2.xAxis.data = arr_6;
            option2.series[0].data = arr_7;
            _myChart2.setOption(option2);
        }
    })
}
//科室能耗费用
function OfficeCharge(){
    var ofs = _objectSel.getSelectedOffices(),officeID;
    if(ofs.length>0) {
        officeID = ofs[0].f_OfficeID;
        officeNames = ofs[0].f_OfficeName;
    };
    if(!officeID){ return; }
    var ecParams={'pointerOrOfficeId':officeID,'startTime':newStr,'endTime':newStr1,'pointerOfficeType':'1'};
    $.ajax({
        type:'post',
        url: sessionStorage.apiUrlPrefix + "EnergyItemDatas/getEnergyMoneyCost",
        data:ecParams,
        beforeSend:function(){
            $('#loading3').show();
        },
        success:function(result){
            $('#loading3').hide();
            for(var i=0;i<result.length;i++){
                arr_6[i] = result[i].itemName;
                arr_7[i] = parseInt(result[i].itemMoneyCost);
            }
            option2.xAxis.data = arr_6;
            option2.series[0].data = arr_7;
            _myChart2.setOption(option2);
        }
    })
}
//浏览器echarts自适应
window.onresize = function () {
    if(_myChart && _myChart1 && _myChart2){
        _myChart.resize();
        _myChart1.resize();
        _myChart2.resize();
    }
}
//上日时间
function timeYesterday(){
    mDate = moment().subtract(1,'d').format('YYYY/MM/DD');
    mDates = moment().format('YYYY/MM/DD');
    newStr = mDate;
    newStr1 = mDates;
}
//上周时间
function timeLastWeek(){
    mDate = moment().subtract(7,'d').startOf('week').add(1,'d').format('YYYY/MM/DD');
    mDates = moment().subtract(7,'d').endOf('week').add(2,'d').format('YYYY/MM/DD');
    newStr = mDate;
    newStr1 = mDates;
}
//上月时间
function timeLastMonth(){
    mDate = moment().subtract(1,'month').startOf('month').format('YYYY/MM/DD');
    mDates = moment().subtract(1,'month').endOf('month').add(1,'d').format('YYYY/MM/DD');
    newStr = mDate;
    newStr1 = mDates;
}
//上年时间
function timeLastYear(){
    mDate = moment().subtract(1,'year').startOf('year').format('YYYY/MM/DD');
    mDates = moment().subtract(1,'year').endOf('year').add(1,'d').format('YYYY/MM/DD');
    newStr = mDate;
    newStr1 = mDates;
}
//根据配置文件设置左上角的电水气暖
//ets:sessionStorage中存储的配置文件中的能耗分类
//ecs：从数据接口中获取的能耗数据
function setEnergyType(ets,ecs){
    var types;
    if(ets){
        types = JSON.parse(ets);       //获取缓存的配置的显示能耗分类
    }else{
        return;
    }
    var div = $(".energy-types");
    div.empty();
    for(var i=0;i<ecs.length;i++){
        var ei = _.findWhere(types.alltypes,{"etid" : ecs[i].energyItemID});        //找到和结果对应的能耗分类
        var curDiv = setEnergyBlock(ei,ecs[i]);         //对每个分类已经对应的结果生成一个显示div
        div.append(curDiv);
    }
}
//设置每个能耗的块信息,div
//et:能耗分类,ec:能耗数据
function setEnergyBlock(et,ec)  {
    if(!et){  //没有能耗定义信息，表示是总能耗
        et = {};
        et.etname = ec.ecClassName;
        et.img = "totalEneragery.png";
        et.color = "#fee8af";
        et.etunit = "kgce";
    }else{
        et.etname = "总用" + et.etname + "量";
    }
    var $div = $("<div class='main-one-1'></div>");     //总div
    $div.css("background","url(./work_parts/img/"+ et.img + ")no-repeat " + et.color);      //背景图设置
    $div.css("background-size","50px");
    $div.css("background-position","center");
    var $spanTitle = $("<span class='main-one-title'></span>");       //标题
    $spanTitle.html(et.etname);
    $div.append($spanTitle);
    var $spanEC = $("<span class='main-one-total'></span>");        //能耗和单位
    $spanEC.html(parseInt(ec.ecData) + "&nbsp;&nbsp;" + ec.ecUnit);
    $div.append($spanEC);
    var $divComp = $("<div class='main-mark'></div>");          //同比和环比
    var $pT = $("<p class='tongbi1'>同比:</p>");
    var $spanT = $("<span class='huanbizhi'></span>");
    $spanT.html(ec.dataYoY);
    if(ec.dataYoY.length > 1){
        if(ec.dataYoY.startWith("-")){
            $pT.css("background","url(./work_parts/img/declineArrow.png)no-repeat 40px 0px");
            $pT.css("background-size","16px");
        }else {
            $pT.css("background","url(./work_parts/img/riseArrow.png)no-repeat 40px 0px");
            $pT.css("background-size","16px");
        }
    }
    $pT.append($spanT);
    $divComp.append($pT);
    var $pH = $("<p class='huanbi'>环比:</p>");
    var $spanH = $("<span class='huanbizhi'></span>");
    $spanH.html(ec.dataDoD);
    if(ec.dataDoD.length > 1){
        if(ec.dataDoD.startWith("-")) {
            $pH.css("background","url(./work_parts/img/declineArrow.png)no-repeat 40px 0px");
            $pH.css("background-size","16px");
        }else{
            $pH.css("background","url(./work_parts/img/riseArrow.png)no-repeat 40px 0px");
            $pH.css("background-size","16px");
        }
    }
    $pH.append($spanH);
    $divComp.append($pH);
    $div.append($divComp);
    return $div;
}