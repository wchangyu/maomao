$(function(){

    /*-------------------------------------整体能效仪表盘--------------------------------------*/

    //整体能效仪表盘

    var _chartG = echarts.init(document.getElementById('chart-gug'));

    var cc = [[0.38, '#ff4500'], [0.46, 'orange'], [0.55, 'skyblue'], [1, 'lightgreen']];

    var _optionG = {

        tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
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
                min: 0,
                max: 0,
                splitNumber: 10,
                radius: '90%',
                axisTick: {            // 坐标轴小标记
                    length: 10,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 15,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                title: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 16,
                        fontStyle: 'normal'
                    }
                },
                detail: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize:22
                    }
                },
                pointer:{

                    length:'50%',
                    width:6

                },
                data: [{ value: 0.5, name: 'KW/KW' }]
            }
        ]

    }

    //数据曲线折线图

    //能源曲线
    var _chartEnergy = echarts.init(document.getElementById('chart-line-energy'));

    //能效曲线
    var _chartEfficiency = echarts.init(document.getElementById('chart-line-efficiency'));

    var colorArr = ['#5793f3', '#d14a61', '#675bba', '#ffa500'];

    var optionL = {

        //color:['#5793f3', '#d14a61', '#675bba', '#ffa500'],

        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        //toolbox: {
        //    feature: {
        //        saveAsImage: {}
        //    }
        //},
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{
                interval:2,
                rotate:45,//倾斜度 -90 至 90 默认为0
                margin:12
            },
        },
        yAxis: [

            {
                name:'能效',
                type:'value'
            },
            //{
            //    name:'平衡率',
            //    type:'value'
            //}

        ],
        series: [
            //{
            //    name:'邮件营销',
            //    type:'line',
            //    stack: '总量',
            //    data:['']
            //}
        ]
    };

    //左上角室外温湿度
    WSD();

    //获取实时时间
    SSSJ();

    //获取单位冷价
    LJDJ();

    //冷站输入功率
    LZSRGL();

    //热不平衡率
    RBPHL();

    //能效曲线
    NXQX();

    //能源曲线
    NYQX();

    //自动刷新
    setInterval(function(){

        //能效曲线
        NXQX();

        //能源曲线
        NYQX();

    },1000*30)

    /*-------------------------------------点击事件---------------------------------------------*/

    //数据曲线tab切换
    $('.main-tab').on('click','span',function(){

        $('.main-tab').find('span').removeClass('main-tab-active');

        $(this).addClass('main-tab-active');

        $('.chart-line').css('z-index','1');

        $('.chart-line').eq($(this).index()).css('z-index','2');

    })

    //chart图自适应
    window.onresize = function () {

        if (_chartG && _chartEnergy && _chartEfficiency) {

            _chartG.resize();

            _chartEnergy.resize();

            _chartEfficiency.resize();
        }
    }

    /*------------------------------------其他方法----------------------------------------------*/

    //冷量单价
    function LJDJ(){

        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,
            //日期
            sysrealDt:sessionStorage.sysDt,
            //换算单位
            misc:sessionStorage.misc
        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'Main/GetElePriceColdNowDs',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                var data = 0.0000;

                if(result.code == 0){

                    data = result.ePrCoVa;

                }

                $('#spanEPrice').html(parseFloat(data).toFixed(4));

            },

            error:_errorFun1

        })


    }

    //冷站输入功率
    function LZSRGL(){

        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,
            //日期
            sysrealDt:sessionStorage.sysDt,
            //换算单位
            misc:sessionStorage.misc
        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'Main/GetECPItemizeNowDs',

            timeout:_theTimes,

            data:prm,

            beforeSend:function(){

                $('.ZTNX').showLoading();

            },

            complete:function(){

                $('.ZTNX').hideLoading();

            },

            success:function(res){

                //冷站输出冷量
                var lznowlv = 0;

                //冷站散热量
                var lzsrlv = 0;

                //冷站输入功率
                var lznowp = 0;

                //热不平衡率（另外一个接口）
                //var lzbphlv = 0;

                if(res.code == 0){

                    //冷站散热量
                    lzsrlv = res.srlVa;

                    //冷站实时功率
                    var lzpV = (parseFloat((res.cpVa == null)?0:res.cpVa) + parseFloat((res.chwpVa == null)?0:res.chwpVa) + parseFloat((res.cwpVa == null)?0:res.cwpVa) + parseFloat((res.ctpVa == null)?0:res.ctpVa));

                    //冷站输入功率
                    lznowp = lzpV.toFixed(1);

                    //仪表盘数值
                    var eerV = 0;

                    //仪表盘最大值
                    var eerMinV = 0;

                    //仪表盘最小值
                    var eerMaxV = 0;

                    //冷站实时冷量
                    var lzlV = parseFloat(res.lVa);

                    //冷战输出冷量
                    lznowlv = lzlV;

                    if (lzlV === 0) {

                        eerV = 0;
                    }

                    if(lzpV===0){



                    }else{

                        //KW/KW

                        eerMinV=0;

                        eerMaxV=9;

                        eerV = parseFloat(lzlV / lzpV).toFixed(3);

                        if (eerV > 15) {

                            eerV = 15;
                        }

                    }

                    //最大值
                    _optionG.series[0].max = eerMaxV;

                    //最小值
                    _optionG.series[0].min = eerMinV;

                    //能效
                    _optionG.series[0].data[0].value = eerV;

                    _chartG.setOption(_optionG,true);


                }else{

                    //最大值
                    _optionG.series[0].max = 0;

                    //最小值
                    _optionG.series[0].min = 9;

                    //能效
                    _optionG.series[0].data[0].value = 0;

                    _chartG.setOption(_optionG,true);

                }

                //冷站输出冷量
                $('#lznowlv').html(lznowlv);

                //冷站散热量
                $('#lzsrlv').html(lzsrlv);

                //冷站输入功率
                $('#lznowp').html(lznowp);

                //热不平衡率
                //$('#lzbphlv').html(lzbphlv);

            },

            error:_errorFun1

        })

    }

    //热不平衡率
    function RBPHL(){

        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,
            //日期
            sysrealDt:sessionStorage.sysDt,
            //换算单位
            misc:sessionStorage.misc
        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'Main/GetUBRVNowData',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                var data = 0.0000;

                if(result.code == 0){

                    data = result.ubrVa;

                }

                $('#lzbphlv').html(data);

            },

            error:_errorFun1

        })

    }

    //获取楼宇的室外温湿度
    function WSD(){

        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,

        }

        $.ajax({

            type:'get',

            url:sessionStorage.apiUrlPrefix + 'Global/GetTHW',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                if(result.code == 0){

                    //温度
                    if(result.tsw == true){

                        $('#ist').html(result.ist);

                    }

                    //湿度
                    if(result.hsw == true){

                        $('#ish').html(result.ish);

                    }

                    //湿球
                    if(result.wbw == true){

                        $('#iswbw').html(result.iswbw);

                    }


                }

            },

            error:_errorFun1

        })

    }

    //获取实时时间
    function SSSJ(){

        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,

        }

        $.ajax({

            type:'get',

            url:sessionStorage.apiUrlPrefix + 'Global/GetRealDt',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                //显示
                if(result.code == 0){

                    var date = result.dt;

                    //日期
                    var realDate = date.split(' ')[0].replace(/-/g,'.')

                    $('#real-date').html(realDate);

                    //时间
                    var realTime = date.split(' ')[1].slice(0,5);

                    var realWeeks = moment(date.split(' ')[0]).format('d');

                    if(realWeeks == 0){

                        realWeeks = '星期日';

                    }else if(realWeeks == 1){

                        realWeeks = '星期一';

                    }else if(realWeeks == 2){

                        realWeeks = '星期二';

                    }else if(realWeeks == 3){

                        realWeeks = '星期三';

                    }else if(realWeeks == 4){

                        realWeeks = '星期四';

                    }else if(realWeeks == 5){

                        realWeeks = '星期五';

                    }else if(realWeeks == 6){

                        realWeeks = '星期六';

                    }

                    $('#real-time').html( realTime + ' ' + realWeeks );

                }else{

                    $('#real-date').html('-');

                    $('#real-time').html('-');

                }

            },

            error:_errorFun1

        })

    }

    //能效曲线
    function NXQX(){

        $('.noDataTip').remove();

        prm = {

            //楼宇
            pId:sessionStorage.PointerID,
            // 实时数据
            sysrealDt:sessionStorage.sysDt,
            //换算单位
            misc:sessionStorage.misc,
            //是否折标 0=不显示;1=显示
            stp:0

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'Main/GetEERNowChartViewDs',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                //横坐标
                var dataX = [];

                //纵坐标
                var dataY = [];

                if(result.code == 0){

                    for(var i=0;i<result.xs.length;i++){

                        dataX.push(result.xs[i]);

                    }

                    for(var i=0;i<result.ys[0].length;i++){

                        dataY.push(result.ys[0][i]);

                    }

                    //颜色
                    optionL.color = ['#c43c38'];

                    //图例
                    //optionL.legend.data[0] = '实时能效(KW/KW)';

                }else{

                    var str = '<div class="noDataTip" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">暂时没有获取到能效数据</div>'

                    $('#chart-line-efficiency').append(str);

                }

                //横坐标
                optionL.xAxis.data = dataX;

                //纵坐标
                var obj = {

                    name:'实时能效(KW/KW)',

                    data:dataY,

                    type:'line'

                }

                optionL.series[0] = obj;

                _chartEfficiency.setOption(optionL,true);

            },

            error:_errorFun1

        })

    }

    //能源曲线
    function NYQX(){

        $('.noDataTip').remove();

        prm = {

            //楼宇
            pId:sessionStorage.PointerID,
            // 实时数据
            sysrealDt:sessionStorage.sysDt,
            //换算单位
            misc:sessionStorage.misc

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'Main/GetUBRVNowChartViewDs',

            timeout:_theTimes,

            data:prm,

            beforeSend:function(){

                $('#chart-line-energy').showLoading();

            },

            complete:function(){

                $('#chart-line-energy').hideLoading();

            },

            success:function(result){

                //横坐标
                var dataX = [];

                //纵坐标

                var dataY = [];

                //图例
                var tip = [];

                //最大值
                var aroMax = 0 //能耗最大值

                if(result.code == 0){

                    aroMax = parseFloat(result.aroMaxVa);//能耗最大值

                    for(var i=0;i<result.xs.length;i++){

                        dataX.push(result.xs[i]);

                    }

                    for(var i=0;i<result.ys.length;i++){

                        var obj = {};

                        obj.name = result.lgs[i];

                        obj.type = 'line';

                        obj.itemStyle = {

                            normal:{

                                color:colorArr[i]

                            }

                        };

                        obj.data = result.ys[i];

                        obj.yAxisIndex = 0;

                        if(i==result.ys.length){

                            obj.yAxisIndex = 1;

                        }

                        dataY.push(obj);

                    }

                    tip = result.legend;

                    //两个坐标
                    optionL.yAxis = [

                        {
                            name:'能耗',
                            type:'value',
                            min:0,
                            max:aroMax,
                            interval:((parseInt(aroMax) + 1) / 5)
                        },
                        {
                            name:'平衡率',
                            type:'value',
                            min:0,
                            max:100,
                            interval:20
                        }

                    ]

                }else{

                    optionL.yAxis = [

                        {
                            name:'能耗',
                            type:'value'
                        },
                        {
                            name:'平衡率',
                            type:'value'
                        }

                    ]

                    var str = '<div class="noDataTip" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">暂时没有获取到能效数据</div>'

                    $('#chart-line-energy').append(str);

                }

                //图例
                optionL.legend.data = tip;

                //横坐标
                optionL.xAxis.data = dataX;

                optionL.series = dataY;

                _chartEnergy.setOption(optionL,true);

            },

            error:_errorFun1

        })

    }

})