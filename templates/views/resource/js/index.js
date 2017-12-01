//电水冷暖的参考值
const _ElecYC = 300;  //电的年耗,200kWh/m2
const _WaterYC = 300;  //水的年耗,300L/m2
const _ColdYC = 300;  //冷量的年耗,100MJ/m2
const _HeatYC = 300;  //热量的年耗,100MJ/m2

$(function(){
    //上日上年标题部分
    titleChange();
    //读取楼宇和科室的zTree；
    _objectSel = new ObjectSelection();
    _objectSel.initPointers($("#allPointer"),true);
    _objectSel.initOffices($("#allOffices"));
    //科室搜索框功能
    var objSearch = new ObjectSearch();
    objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
    //楼宇搜索框功能
    var objSearchs = new ObjectSearch();
    objSearchs.initPointerSearch($("#keys"),$(".tipess"),"allPointer");
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
        //alert($(this).index());
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
            _dataRanges = '日'
        }else if($(this).html() == '上周'){
            timeLastWeek();
            _dataRanges = '周'
        }else if($(this).html() == '上月'){
            timeLastMonth();
            _dataRanges = '月'
        }else if($(this).html() == '上年'){
            timeLastYear();
            _dataRanges = '年'
        }
        _changeTitle = $(this).html();
    })
    //echart配置项
    //为了使总能耗也有loading等待效果，覆盖一个echarts
    _myChart3 = echarts.init(document.getElementById('loaddings'));
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
                max: Math.ceil(_ElecYC / 365),
                splitNumber: 10,
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
                max:Math.ceil(_WaterYC / 365),
                endAngle:45,
                splitNumber:5,
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
                max: Math.ceil(_ColdYC / 365),
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
                    formatter:'{value}'
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
                    show: true
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
                max: Math.ceil(_HeatYC / 365),
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
                    formatter:'{value}'
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
                    show: true
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
    //页面加载时表头
    var smalls = $('<small>');
    smalls.html(pointerNames);
    $('.page-title').append(smalls);
    PointerCharge();
    $('.btn').click(function(){
        var o=$('.tree-1')[0].style.display;
        titleChange();
        if(_changeTitle == '上日'){
            option.series[0].max = Math.ceil(_ElecYC / 365);
            option.series[1].max = Math.ceil(_WaterYC / 365);
            option.series[2].max = Math.ceil(_ColdYC / 365);
            option.series[3].max = Math.ceil(_HeatYC / 365);
            _myChart1.setOption(option);
        }else if(_changeTitle == '上周'){
            option.series[0].max = Math.ceil(_ElecYC / 50);
            option.series[1].max = Math.ceil(_WaterYC / 50);
            option.series[2].max = Math.ceil(_ColdYC / 50);
            option.series[3].max = Math.ceil(_HeatYC / 50);
            _myChart1.setOption(option);
        }else if(_changeTitle == '上月'){
            option.series[0].max = Math.ceil(_ElecYC / 10);
            option.series[1].max = Math.ceil(_WaterYC / 10);
            option.series[2].max = Math.ceil(_ColdYC / 10);
            option.series[3].max = Math.ceil(_HeatYC / 10);
            _myChart1.setOption(option);
        }else{
            option.series[0].max = _ElecYC ;
            option.series[1].max = _WaterYC;
            option.series[2].max = _ColdYC;
            option.series[3].max = _HeatYC;
            _myChart1.setOption(option);
        }
        if(o == "none"){
            getOfficeClassEcData();
            OfficePowerConsumption();
            OfficeCharge();
            if($('.page-title').children('small').length){
                $('.page-title').children('small').remove();
            }
            var smalls = $('<small>');
            smalls.html(officeNames);
            $('.page-title').append(smalls);
        }else{
            getClassEcData();
            PointerPowerConsumption();
            PointerCharge();
            if($('.page-title').children('small').length){
                $('.page-title').children('small').remove();
            }
            var smalls = $('<small>');
            smalls.html(pointerNames);
            $('.page-title').append(smalls);
        }
    });
    $('body').mouseover(function(){
        if(_myChart && _myChart1 && _myChart2 && _myChart3){
            _myChart.resize();
            _myChart1.resize();
            _myChart2.resize();
            _myChart3.resize();
        }
    });
})
  //对于用户来说的区域位置 
var _changeTitle = '上日';
var _myChart;
var _myChart1;
var _myChart2;
var _myChart3;
var _dataRanges = '日';
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

//上月能耗费用
var arr_6=[];
var arr_7=[];
//楼宇总能耗
function getClassEcData(){

    var pts = _objectSel.getSelectedPointers();

    var pointerID = [];

    //存放要传的楼宇集合
    var postPointerID = [];

    var treeObj = $.fn.zTree.getZTreeObj(_objectSel._$ulPointers.attr('id'));

    var nodes1 = treeObj.getCheckedNodes(false).concat(treeObj.getCheckedNodes(true));


    if(pts.length>0) {

        pointerID.push(pts[0].pointerID);
        pointerNames = pts[0].pointerName;
    };
    pointerNames = 11;

    if(!pointerID) { return ;}

   $(pts).each(function(i,o){

       postPointerID.push(o.pointerID)
   })


    var ecParams={'pointerIds':postPointerID,'startTime':newStr,'endTime':newStr1,'dateType':_dataRanges};
    $.ajax({
        type: "post",
        url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getClassEcData',
        data: ecParams,
        async:true,
        timeout:30000,
        beforeSend:function(){
            _myChart1.showLoading({
                text:'获取数据中',
                effect:'whirling'
            })
            _myChart3.showLoading({
                text:'获取数据中',
                effect:'whirling'
            })
        },
        success: function (result) {
            _myChart1.hideLoading();
            _myChart3.hideLoading();
            setEnergyType(sessionStorage.allEnergyType,result);
            console.log(result);

            var dian = 0;
            for(var i=1;i<result.length && i<=option.series.length;i++){
                if(result[i].energyItemID == "01" ){
                    dian = result[i].ecDataByArea.toFixed(2);
                }else if(result[i].energyItemID == "211"){
                    dian = (result[i].ecDataByArea * 1000).toFixed(2);//水单位t到L
                }else if(result[i].energyItemID == "412"){
                    dian = result[i].ecDataByArea.toFixed(2);
                }else if(result[i].energyItemID == "511"){
                    dian = result[i].ecDataByArea.toFixed(2);
                }else{
                    dian = 0.00;
                }
                option.series[i-1].data[0].value = dian;
            }
            _myChart1.setOption(option,true);
        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart1.hideLoading();
            _myChart3.hideLoading();
            console.log(JSON.parse(jqXHR.responseText).message);
            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                option.series[0].data = [];
                _myChart1.setOption(option);
            }
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                alert("超时");
            }else{
                alert("请求失败！");
            }
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
        async:true,
        timeout:30000,
        beforeSend:function(){
            _myChart1.showLoading({
                text:'获取数据中',
                effect:'whirling'
            })
        },
        success:function(result){
            _myChart1.hideLoading();
            _myChart3.hideLoading();
            var dian = 0;
            for(var i=0;i<option.series.length;i++){
                if(result[i]){
                    if(result[i].energyItemID == "4" ){
                        dian = result[i].ecDataByArea.toFixed(2);
                    }else if(result[i].energyItemID == "5"){
                        dian = (result[i].ecDataByArea * 1000).toFixed(2);//水单位t到L
                    }
                }
                else{
                    dian = 0.00;
                }
                option.series[i].data[0].value = dian;
            }
            _myChart1.setOption(option,true);
            setEnergyType(sessionStorage.officeEnergyType,result)
        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart3.hideLoading();
            _myChart1.hideLoading();
            console.log(JSON.parse(jqXHR.responseText).message);
            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                option.series[0].data = [];
                _myChart1.setOption(option);
            }
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                alert("超时");
            }else{
                alert("请求失败！");
            }
        }
    })
}
//楼宇分项电耗
function PointerPowerConsumption(){
    var pts = _objectSel.getSelectedPointers();
    var pointerID = [];

    //存放要传的楼宇集合
    var postPointerID = [];

    if(pts.length>0) {

        pointerID.push(pts[0].pointerID);
        pointerNames = pts[0].pointerName;
    };

    if(!pointerID) { return ;}

    $(pts).each(function(i,o){

        postPointerID.push(o.pointerID)
    })

    var ecParams={'pointerIDs':postPointerID,'startTime':newStr,'endTime':newStr1,'energyItemIDs':arr_33};
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getEnergyItemEcData',
        data: ecParams,
        async:true,
        timeout:30000,
        beforeSend:function(){
            _myChart.showLoading({
                text:'获取数据中',
                effect:'whirling'
            })
        },
        success:function(result){
            option1.series[0].data = [];
            _myChart.hideLoading();
            for(var i=0;i<result.length;i++){
                arr_4[i] = result[i].ecData.toFixed(0);
            }
            for(var i=0;i<arr_4.length;i++){
                var obj = {};
                obj.value = arr_4[i];
                obj.name = arr_3[i];
                option1.series[0].data.push(obj);
            }

            console.log(option1);
            // 使用刚指定的配置项和数据显示图表。
            _myChart.setOption(option1);
        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart.hideLoading();
            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                option1.series[0].data = [];
                _myChart.setOption(option1);
            }else if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                alert("超时");
            }else{
                alert("请求失败！");
            }
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
        async:true,
        timeout:30000,
        beforeSend:function(){
            _myChart.showLoading({
                text:'获取数据中',
                effect:'whirling'
            })
        },
        success:function(result){
            option1.series[0].data.length = 0;
            _myChart.hideLoading()
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
        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart.hideLoading();
            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                option1.series[0].data = [];
                _myChart.setOption(option1);
            }else if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                alert("超时");
            }else{
                alert("请求失败！");
            }
        }
    })
}
//楼宇能耗费用
function PointerCharge(){
    var pts = _objectSel.getSelectedPointers(),pointerID;
    var pointerID = [];

    //存放要传的楼宇集合

    var postPointerID = [];

    if(pts.length>0) {

        pointerID.push(pts[0].pointerID);
        pointerNames = pts[0].pointerName;
    };

    if(!pointerID) { return ;}

    $(pts).each(function(i,o){

        postPointerID.push(o.pointerID)
    });



        ecParams={'pointerIds':postPointerID,'startTime':newStr,'endTime':newStr1,'pointerOfficeType':'2'};


    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyItemDatas/getEnergyMoneyCost',
        data:ecParams,
        async:true,
        timeout:30000,
        beforeSend:function(){
            _myChart2.showLoading({
                text:'获取数据中',
                effect:'whirling'
            })
        },
        success:function(result){
            _myChart2.hideLoading();
            for(var i=0;i<result.length;i++){
                arr_6[i] = result[i].itemName;
                arr_7[i] = parseInt(result[i].itemMoneyCost);
            }
            option2.xAxis.data = arr_6;
            option2.series[0].data = arr_7;
            _myChart2.setOption(option2);
        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart2.hideLoading();
            console.log(JSON.parse(jqXHR.responseText).message);
            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                option2.series[0].data = [];
                _myChart2.setOption(option2);
            }else if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                alert("超时");
            }else{
                alert("请求失败！");
            }
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
        async:true,
        timeout:30000,
        beforeSend:function(){
            _myChart2.showLoading({
                text:'获取数据中',
                effect:'whirling'
            })
        },
        success:function(result){
            _myChart2.hideLoading();

            for(var i=0;i<result.length;i++){
                arr_6[i] = result[i].itemName;
                arr_7[i] = parseInt(result[i].itemMoneyCost);
            }
            option2.xAxis.data = arr_6;
            option2.series[0].data = arr_7;
            _myChart2.setOption(option2);
        },
        error:function(jqXHR, textStatus, errorThrown){
            _myChart2.hideLoading();
            //console.log(JSON.parse(jqXHR.responseText).message);
            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                option2.series[0].data = [];
                _myChart2.setOption(option2);
            }else if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                alert("超时");
            }else{
                alert("请求失败！");
            }
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
function setEnergyBlock(et,ec){
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
    $div.css("background","url(../resource/img/"+ et.img + ")no-repeat " + et.color);      //背景图设置
    $div.css("background-size","50px");
    $div.css("background-position","center");
    var $spanTitle = $("<span class='main-one-title'></span>");       //标题
    $spanTitle.html(et.etname);
    $div.append($spanTitle);
    var $spanEC = $("<span class='main-one-total'></span>");        //能耗和单位
    $spanEC.html(parseInt(ec.ecData) + "&nbsp;&nbsp;" + ec.ecUnit);
    $div.append($spanEC);
    var $divComp = $("<div class='main-mark'></div>");          //同比和环比
    var $pT = $("<p class='tongbi1'><span>同比:</span><br></p>");
    var $spanT = $("<span class='huanbizhi'></span>");
    $spanT.html(ec.dataYoY);
    if(ec.dataYoY.length > 1){
        if(ec.dataYoY.startWith("-")){
            $pT.css("background","url(../resource/img/declineArrow.png)no-repeat 9px 17px");
            $pT.css("background-size","16px");
        }else {
            $pT.css("background","url(../resource/img/riseArrow.png)no-repeat 9px 17px");
            $pT.css("background-size","16px");
        }
    }
    $pT.append($spanT);
    $divComp.append($pT);
    var $pH = $("<p class='huanbi'><span>环比:</span><br></p>");
    var $spanH = $("<span class='huanbizhi'></span>");
    $spanH.html(ec.dataDoD);
    if(ec.dataDoD.length > 1){
        if(ec.dataDoD.startWith("-")) {
            $pH.css("background","url(../resource/img/declineArrow.png)no-repeat 9px 17px");
            $pH.css("background-size","16px");
        }else{
            $pH.css("background","url(../resource/img/riseArrow.png)no-repeat 40px 0px");
            $pH.css("background-size","16px");
        }
    }
    $pH.append($spanH);
    $divComp.append($pH);
    $div.append($divComp);
    return $div;
}