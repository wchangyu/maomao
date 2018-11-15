/**
 * Created by admin on 2018/7/29.
 */


 //根据能耗分项ID获取能耗单位
function _getEcUnit(etid){

    var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));

    if(jsonText){
        for(var i=0;i<jsonText.alltypes.length;i++){
            if(etid == jsonText.alltypes[i].etid){

                return jsonText.alltypes[i].etunit;
            }
        }
    }
    return 'kgce'
};


$(function(){

    //获取全部能耗类型
    getEnergyTypes();

    //能耗监测数据汇总
    getAllEnergyData();

    //获取能耗统计数据
    getProvincialTPRealEnergy();

    //月度对比
    getProvincialYearCompare();

    //获取能耗饼图
    getOrganizationData();

    //单位面积 人均指标饼图
    getaaaaEnergyData()

    //获取二级分项能耗占比饼图
    ProvincialFirstEnergyItemData();

    //点击左下角时间选择
    $('.rowcon .myclear div').on('click',function(){

        $(this).addClass('onClick').siblings().removeClass('onClick');

        //获取四个能耗监测数据汇总
        // getAllEnergyData();
         //单位面积 人均指标饼图
        getaaaaEnergyData()

        //获取能耗饼图
        getOrganizationData();
        //获取二级分项能耗占比饼图
        ProvincialFirstEnergyItemData(thisDistrictID);

    });

    //点击右侧上方切换能耗种类
    $('ul .right-choose-energy span').on('click',function(){

        $('ul .right-choose-energy span').removeClass('onClick');

        $(this).addClass('onClick');

        //获取能耗统计数据
        getProvincialTPRealEnergy();

        //月度对比
        getProvincialYearCompare();

        //获取能耗饼图
        getOrganizationData();

         //单位面积 人均指标饼图
        getaaaaEnergyData()

        //获取二级分项能耗占比饼图
        ProvincialFirstEnergyItemData(thisDistrictID);

    });

    //chart图自适应
    window.onresize = function () {
        if(bottomCharts){
            bottomCharts.resize();
            bottomChartsPie.resize();
        }
    };

    //setMapAreas("8397ff"); //设置每个楼宇的轮廓显示

    //选择全省或者省直
    $('.top-choose-province span').on('click',function(){

        $('.top-choose-province span').removeClass('left-img1');

        $('.top-choose-province span').removeClass('right-img1');

        $(this).addClass($(this).attr('data-id'));

        //改变上方区域名称
        $('.top-img-title').html($(this).attr('title'));

        //改变当前区域id
        thisDistrictID = $(this).attr('data-ptid');

        //能耗监测数据汇总
        getAllEnergyData();

        //获取能耗统计数据
        getProvincialTPRealEnergy();

        //月度对比
        getProvincialYearCompare();

        //获取能耗饼图
        getOrganizationData();
         //单位面积 人均指标饼图
        getaaaaEnergyData()

        //获取二级分项能耗占比饼图
        ProvincialFirstEnergyItemData();

        $('#provinceMap_image').attr("src","img/maps.jpg");

    });

});

//初始区域id
var thisDistrictID = -1;

//柱状图配置项
var optionBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['今年','去年'],
        top:'0',
    },
    grid: {
        left: '1%',
        right: '4%',
        bottom:'2%',
        top:'12%',
        containLabel: true
    },
    toolbox: {
        show : false,
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
            name:'今年',
            type:'bar',
            data:[],
            itemStyle : {
                normal:{
                    color:'#019cdf'
                }
            },
            barMaxWidth: '60'
        },
        {
            name:'去年',
            type:'bar',
            data:[],
            itemStyle : {
                normal:{
                    color:'#f8276c'
                }
            },
            barMaxWidth: '60'
        }

    ]
};

//echart初始化
var bottomCharts = echarts.init(document.getElementById('monthCompareEchart'));

//echart图配置项
var optionPie = {
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
            radius: ['0%', '75%'],
            data:[

            ],
            center:['70%','50%'],
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

var optiondanwei = {
    title: {
        text: '单位面积占比',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle',
        subtext:'kgce/m2',
        subtextStyle:{
           color:'#333'
        },
        x:'center',
        bottom:'10'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '单位面积占比',
            type: 'gauge',
            radius: '83%',
            min: 0,
            max:1,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#62A8DB'], [0.8, '#33E3B6'], [1, '#ffa90b']],
                    width: 10
                }
            },
            splitLine:{
                length:14
            },
            axisLabel: {
                show:true,
                padding: [0, 0, 0, -5],
                formatter: function (value) {
                    return value.toFixed(2);
                    //return value;
                }
            },
            splitNumber: 5,
            data: [{value:5}]
        }
    ]
};

var optiondanwei3 = {
    title: {
        text: '人均指标占比',
        textStyle:{
            fontSize:'16',
            fontWeight:'normal'
        },
        textBaseline:'middle',
        subtext:'kgce/m2',
        subtextStyle:{
           color:'#333'
        },
        x:'center',
        bottom:'10'
    },
    tooltip : {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [
        {
            name: '人均指标占比',
            type: 'gauge',
            radius: '83%',
            min: 0,
            max:1,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#62A8DB'], [0.8, '#33E3B6'], [1, '#ffa90b']],
                    width: 10
                }
            },
            splitLine:{
                length:14
            },
            axisLabel: {
                show:true,
                padding: [0, 0, 0, -5],
                formatter: function (value) {
                    return value.toFixed(2);
                    //return value;
                }
            },
            splitNumber: 5,
            data: [{value:5}]
        }
    ]
};

var optiondanwei11 = {
    tooltip : {
        formatter: "{a} <br/>{b} : {c}%"
    },
    toolbox: {
        feature: {
            restore: {},
            saveAsImage: {}
        }
    },
    series: [
    	{
            name: '单位面积',
            type: 'gauge',
            z: 3,
            radius: '100%',
            pointer : { //指针样式
                length: '85%'
            },
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 5,
                    // color: [
                    // 	[ 0.25, "#c23531" ],
                    // 	[ 0.5, "#ffa90b" ],
                    // 	[ 0.75, "#91c7ae" ],
                    // 	[ 1,"#63869e" ]
                    // ]
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 10,        // 属性length控制线长
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
            axisLabel: {
            	show: false,
                backgroundColor: 'auto',
                borderRadius: 0,
                color: '#eee',
                padding: 0,
                textShadowBlur: 2,
                textShadowOffsetX: 1,
                textShadowOffsetY: 1,
                textShadowColor: '#222',
                distance : 0, //文字离表盘的距离
            },
            title : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic'
            },
            detail : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                formatter: function (value) {
                    value = (value + '').split('.');
                    value.length < 2 && (value.push('00'));
                    return ('00' + value[0]).slice(-2)
                        + '.' + (value[1] + '00').slice(0, 2);
                },
                fontWeight: 'bolder',
                borderRadius: 3,
                backgroundColor: '#444',
                borderColor: '#aaa',
                shadowBlur: 5,
                shadowColor: '#333',
                shadowOffsetX: 0,
                shadowOffsetY: 3,
                borderWidth: 2,
                textBorderColor: '#000',
                textBorderWidth: 2,
                textShadowBlur: 2,
                textShadowColor: '#fff',
                textShadowOffsetX: 0,
                textShadowOffsetY: 0,
                fontFamily: 'Arial',
                width: 60,
                color: '#eee',
                rich: {}
            },
            data:[{value: 0.2, name: '指标'}]
        }
    ]
};
//echart初始化
var bottomChartsPie = echarts.init(document.getElementById('pie-energy'));

//echart初始化
var bottomChartsPie1 = echarts.init(document.getElementById('pie-energy1'));

//echart初始化
var bottomChartsPie2 = echarts.init(document.getElementById('aaaa1'));

//echart初始化
var bottomChartsPie3 = echarts.init(document.getElementById('aaaa2'));

//能耗监测数据汇总
function getAllEnergyData(){

    //定义区域id集合
    var districtIDArr = getDistrictIDArr();

    //获取当前选择的时间类型
    var dateType = $('.rowcon .myclear div.onClick').html();

    //获取开始结束时间
    var startTime = getPostTime11(dateType)[0];

    //获取结束时间
    var endTime = getPostTime11(dateType)[1];

    //传递给后台的参数
    var prm = {
        "startTime": startTime,
        "endTime": endTime,
        "districtIDs":districtIDArr,
        "userID": _userIdNum
    };

    var url = 'Provincial/GetProvincialClassAllEnergyData';

    //定义传递给后台的回调函数
    var successFun = function (result){

        //console.log(result);

        //table中数据
        var tableHtml = "";

        var tableHeadHtml = "<tr><th>单位类型</th><th>建筑数量</th><th>建筑面积(㎡)</th>";

        $(result).each(function(i,o){


            tableHtml += "<tr>" +
                "<td class='blues'>"+ o.returnOBJName+"</td>"+
                "<td>"+ o.pointerNum+"</td>"+
                "<td>"+ o.coefficient.toFixed(2)+"</td>";

            $(o.energyItemDataV2s).each(function(j,k){

                tableHtml += "<td>"+ k.energyData.toFixed(1)+"</td>";

                if(i == 0){

                    var etid = k.energyItemId;

                    //获取当前能耗名称
                    var ecName = _getEcName(etid);

                    //获取能耗单位
                    var unit = _getEcUnit(etid);
                    if(ecName == "综"){
                    	tableHeadHtml += '<th>'+ "标煤" + '(' + unit + ')' +'</th>';
                    }else{
                    	tableHeadHtml += '<th>'+ecName + '(' + unit + ')' +'</th>';
                    }

                    
                }
            });

            tableHtml += "</tr>";

            tableHeadHtml += "</tr>";

        });

        //页面赋值

        $('#scrap-datatables thead').html(tableHeadHtml);

        $('#scrap-datatables tbody').html(tableHtml);

        // $('.left-bottom-table-container').hideLoading();

    };

    var beforeSendFun = function(){

        // $('.left-bottom-table-container').showLoading();

    };

    var errorFun = function(XMLHttpRequest, textStatus, errorThrown){

        // $('.left-bottom-table-container').hideLoading();

        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

        }else{

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

        }
    };

    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);

};

//获取能耗统计数据
function getProvincialTPRealEnergy(){

    //获取能耗分项id
    var energyItemID = $('ul .right-choose-energy .onClick').attr('data-id');

    //获取当前单位
    var unit = _getEcUnit(energyItemID);

    //定义区域id集合
    var districtIDArr = getDistrictIDArr();

    //传递给后台的参数
    // var prm = {
    //     "energyItemID": energyItemID,
    //     "districtIDs":districtIDArr,
    //     "userID": _userIdNum
    // };
    
	var url = 'Provincial/GetProvincialTPRealEnergy';
	//传递给后台的参数
    var prm = {
        "energyItemID": energyItemID,
        "districtIDs":districtIDArr,
        "userID": _userIdNum
    };


    //定义传递给后台的回调函数
    var successFun = function (result){

        //console.log(result);

        //获取当前能耗名称
        var ecName = $('ul .right-choose-energy  .onClick').html();
         //页面标题
        if(ecName == "综"){
	        $('.fenleinenghao .title .energy-names').html('标煤');
        }else{
        	$('.fenleinenghao .title .energy-names').html(ecName);
        }
       

        $('.fenleinenghao .title .energy-units').html('('+unit+")");

        var nameArr = ['dayEnergyData','monthEnergyData','yearEnergyData'];

        $(nameArr).each(function(i,o){
            var dataObj = result[o];
            if(dataObj.energyData > 10000 ){

                //获取当前总量
                $('.fenleinenghao').eq(i).find('.data').html((dataObj.energyData / 10000).toFixed(1));

                $('.fenleinenghao').eq(i).find('.energy-units').html('(万'+unit+")");



            }else{
                //获取当前总量
                $('.fenleinenghao').eq(i).find('.data').html(dataObj.energyData.toFixed(1));
            }



            //获取同比
            $('.fenleinenghao').eq(i).find('.child1 p span').html((Math.abs(dataObj.lastYearEnergyPercent) * 100).toFixed(1)+ "%");

            //箭头方向
            $('.fenleinenghao').eq(i).find('.child').removeClass('up');

            $('.fenleinenghao').eq(i).find('.child').removeClass('down');

            if(dataObj.lastYearEnergyPercent > 0){

                $('.fenleinenghao').eq(i).find('.child1').addClass('up');

            }else if(dataObj.lastYearEnergyPercent < 0){

                $('.fenleinenghao').eq(i).find('.child1').addClass('down');

            }else {

                $('.fenleinenghao').eq(i).find('.child1').removeClass('down');

                $('.fenleinenghao').eq(i).find('.child1').removeClass('up');
            }

            //获取环比
            $('.fenleinenghao').eq(i).find('.child2 p span').html((Math.abs(dataObj.chainEnergyPercent) * 100).toFixed(1)+ "%");

            //箭头方向
            if(dataObj.chainEnergyPercent > 0){

                $('.fenleinenghao').eq(i).find('.child2').addClass('up');

            }else if(dataObj.chainEnergyPercent < 0){

                $('.fenleinenghao').eq(i).find('.child2').addClass('down');

            }else {

                $('.fenleinenghao').eq(i).find('.child2').removeClass('down');

                $('.fenleinenghao').eq(i).find('.child2').removeClass('up');
            }

            $('.shadowEffect').hideLoading();

        });

    };

    var beforeSendFun = function(){

        $('.shadowEffect').showLoading();

    };

    var errorFun = function(XMLHttpRequest, textStatus, errorThrown){

        $('.shadowEffect').hideLoading();

        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

        }else{

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

        }
    };

    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);
};

//月度对比
function getProvincialYearCompare(){

    //获取能耗分项id
    var energyItemID = $('ul .right-choose-energy .onClick').attr('data-id');

    //获取当前单位
    var unit = _getEcUnit(energyItemID);

    //指标类型
    var energyNormFlag = '1';

    //建筑分类
    var pointerClass = '-1';

    //日期类型
    var dateType = '年';

    //展示类型
    var showDateType = getShowDateType(dateType)[0];

    //时间类型
    var selectDateType = getShowDateType(dateType)[1];

    //获取开始时间
    var startTime = getPostTime11(dateType)[0];

    //获取结束时间
    var endTime = getPostTime11(dateType)[1];

    //定义区域id集合
    var districtIDArr = getDistrictIDArr();

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

        var allData = result.compareDatas;

        //存放echart中数据
        var allDataX = [];

        //同比数据
        var allDataY = [];

        var allDataY1 = [];

        $(allData).each(function(i,o){

            var dataSplit;

            dataSplit = i + 1 + '月';

            allDataX.push(dataSplit);

            allDataY.push(o.currentData.toFixed(2));

            allDataY1.push(o.lastYearData.toFixed(2));

        });

        //optionBar.yAxis[0].name = '单位:(' + unit + ')';

        optionBar.xAxis[0].data = allDataX;
        optionBar.series[0].data = allDataY;
        optionBar.series[1].data = allDataY1;


        //页面赋值
        bottomCharts.setOption(optionBar,true);

        //右侧能耗统计
        bottomCharts.hideLoading();

    };

    var beforeSendFun = function(){

        bottomCharts.showLoading();

    };

    var errorFun = function(XMLHttpRequest, textStatus, errorThrown){

        bottomCharts.hideLoading();

        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

        }else{

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

        }
    };

    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);

};

//获取各地区能耗饼图
function getOrganizationData(){


    //获取能耗分项id
    var energyItemID = $('ul .right-choose-energy .onClick').attr('data-id');

    //获取当前单位
    var unit = _getEcUnit(energyItemID);

    //日期类型
    var dateType = '年';

    //获取开始时间
    var startTime = getPostTime11(dateType)[0];

    //获取结束时间
    var endTime = getPostTime11(dateType)[1];

    //传递给后台的数据
    var prm = {

        "energyItemID": energyItemID,
        "startTime": startTime,
        "endTime": endTime,
        "userID": _userIdNum
    };

    var url = 'Provincial/ProvEnergyPropByArea';

    //定义传递给后台的回调函数
    var successFun = function (result){


        var allData = result;

        //存放echart中数据

        var legendArr = [];

        var sArr = [];

        //单位
        $('.right-unit b').html(unit);

        $(allData).each(function(i,o){

            if(o.returnOBJID != -1){

                var obj = {value : o.sumEnergyData.toFixed(1),name:o.returnOBJName};

                sArr.push(obj);

                legendArr.push(o.returnOBJName);
            }

        });

        optionPie.series[0].data = sArr;

        optionPie.legend.data = legendArr;

        //页面赋值
        bottomChartsPie.setOption(optionPie,true);


        bottomChartsPie.hideLoading();

    };

    var beforeSendFun = function(){

        bottomChartsPie.showLoading();

    };

    var errorFun = function(XMLHttpRequest, textStatus, errorThrown){

        bottomChartsPie.hideLoading();

        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

        }else{

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

        }
    };

    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);

};

//获取二级分项能耗占比饼图
function ProvincialFirstEnergyItemData(){

    //获取能耗分项id
    var energyItemID = $('ul .right-choose-energy .onClick').attr('data-id');

    //获取当前单位
    var unit = _getEcUnit(energyItemID);

    //日期类型
    var dateType = '年';

    //获取开始时间
    var startTime = getPostTime11(dateType)[0];

    //获取结束时间
    var endTime = getPostTime11(dateType)[1];

    //定义区域id集合
    var districtIDArr = getDistrictIDArr();


    //传递给后台的数据
    var prm = {
        "districtIDs": districtIDArr,
        "energyItemID": energyItemID,
        "startTime": startTime,
        "endTime": endTime,
        "userID": _userIdNum
    };

    var url = 'Provincial/ProvincialFirstEnergyItemData';
    if( energyItemID == -2){
    	url = "Provincial/GetProvincialEnergyItemData"
    	prm = {
	        "districtIDs": districtIDArr,
	        "energyItemID": energyItemID,
	        "startTime": startTime,
	        "endTime": endTime,
	        "userID": _userIdNum,
	        energyFlag: 1,
	        userName:_userIdName,
	        b_UserRole:_userRole,
	        b_DepartNum:_maintenanceTeam,
	    };
    }

    //定义传递给后台的回调函数
    var successFun = function (result){

        bottomChartsPie1.hideLoading();

        var allData = result;

        //存放echart中数据

        var legendArr = [];

        var sArr = [];

        //单位
        $('.right-unit b').html(unit);

        $(allData).each(function(i,o){

            if(o.returnOBJID != -1){

                var obj = {value : o.energyItemValue.toFixed(1),name:o.energyItemName};

                sArr.push(obj);

                legendArr.push(o.energyItemName);
            }


        });

        optionPie.series[0].data = sArr;

        optionPie.legend.data = legendArr;

        //页面赋值
        
        bottomChartsPie1.setOption(optionPie,true);

    };

    var beforeSendFun = function(){

        bottomChartsPie1.showLoading();

    };

    var errorFun = function(XMLHttpRequest, textStatus, errorThrown){

        bottomChartsPie1.hideLoading();

        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

        }else{

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

        }
    };

    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);

};

//获取当前区域id集合
function getDistrictIDArr(){

    var districtIDArr = [];

    if(thisDistrictID != -1){

        districtIDArr = [thisDistrictID];

    }else{

        var positionArr = getAllPositionType();

        $(positionArr).each(function(i,o){

            districtIDArr.push(o.districtID)
        });

    }

    return districtIDArr;
};

//地图事件
function setMapAreas(color){

    var $areas = $("area");
    if(!$areas){ return ;}
    for(var i= 0,len = $areas.length;i<len;i++){

        var $area = $($areas[i]);
        $area.attr("shape","poly");
        $area.addClass("noborder");         //mapperjs的用法
        $area.addClass("iopcacity80");      //mapperjs的用法，热点区域80%透明度
        $area.addClass("icolor" + 'ffffff');    //mapperjs的用法，热点区域颜色
        $area.attr("nohref","nohref");
        var pointerid = $area.attr("data-ptid");
        var pointername = $area.attr("data-ptname");
        $area.attr("onclick","showCurPtData('" + pointerid +"','" + pointername +"');");

    }

};

//地图某区域点击事件
function showCurPtData(ptId,ptName){

    $('.top-choose-province span').removeClass('left-img1');

    $('.top-choose-province span').removeClass('right-img1');

    //改变当前区域id
    thisDistrictID = ptId;

    //改变上方区域名称
    $('.top-img-title').html(ptName);

    //能耗监测数据汇总
    getAllEnergyData();

    //获取能耗统计数据
    getProvincialTPRealEnergy();

    //月度对比
    getProvincialYearCompare();

    //获取能耗饼图
    getOrganizationData();

     //单位面积 人均指标饼图
    getaaaaEnergyData()

    //获取二级分项能耗占比饼图
    ProvincialFirstEnergyItemData();
};



function gettype( text ) {
	switch(text){
		case '日':
			return "Day"
		case '月':
			return "Month"
		case '年':
			return "Year"
		default:
			return 'Day'
	}
}


function getaaaaEnergyData() {
	//定义区域id集合
    var districtIDArr = getDistrictIDArr();

    //获取当前选择的时间类型
    var dateType = $('.rowcon .myclear div.onClick').html();

    //获取开始结束时间
    var startTime = getPostTime11(dateType)[0];

    //获取结束时间
    var endTime = getPostTime11(dateType)[1];

    var selectDateType = gettype( dateType )

    var energyItemID = $('ul .right-choose-energy .onClick').attr('data-id');
    //传递给后台的参数
    var prm = {
        startTime: startTime,
        endTime: endTime,
        districtIDs:districtIDArr,
        userID: _userIdNum,
        selectDateType: selectDateType,
        energyItemID: energyItemID,
        userName:_userIdName,
        b_UserRole:_userRole,
        b_DepartNum:_maintenanceTeam,
    };

    var url = 'Provincial/GetProvincialTopPageKPIData';

    //定义传递给后台的回调函数
    var successFun = function (result){
    	//单位面积
        //console.log(result.areaKPIData);
        //人均指标
        //result.peopleKPIData
		//单位面积
		bottomChartsPie2.hideLoading()
		bottomChartsPie3.hideLoading()
        var allData = result.areaKPIData
        optiondanwei.series[0].max = result.areaKPIData.energyNormData*2;
        optiondanwei.series[0].data[0] = {value:result.areaKPIData.energyNormData.toFixed(2)}
        //页面重绘数据
        bottomChartsPie2.setOption(optiondanwei,true);



        optiondanwei3.series[0].max = result.peopleKPIData.energyNormData*2;
        optiondanwei3.series[0].data[0] = {value:result.peopleKPIData.energyNormData.toFixed(2)}
        //页面重绘数据
        bottomChartsPie3.setOption(optiondanwei3,true);

    };

    var beforeSendFun = function(){


    };

    var errorFun = function(XMLHttpRequest, textStatus, errorThrown){

        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

        }else{

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

        }
    };
    bottomChartsPie2.showLoading()
    bottomChartsPie3.showLoading()
    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);

}




