$(function(){

    //是否创建过目标值和告警值
    var _isCreate = false;

    //将获取到的设备目标值对象保存
    var _devObj = {};

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

    //设备能效能耗
    devEEEC();

    //报警
    alarmData();

    //自动刷新
    setInterval(function(){

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
        //设备能效能耗
        devEEEC();

    },1000*60*10)

    /*-----------------------------------------------表格初始化-------------------------------------------*/

    var col = [

        {
            title:'状态',
            data:'state',
            render:function(data, type, full, meta){

                if(data == 0){

                    return '<span style="display: inline-block;width: 10px;height: 10px;border-radius: 10px !important;background: #ff4500;margin-right: 10px;"></span>' + '未开启'

                }else if(data == 1){

                    return '<span style="display:inline-block;width: 10px;height: 10px;border-radius: 10px !important;background: #1cc19f;margin-right: 10px;"></span>' + '开启'

                }
            }

        },
        {
            title:'设备',
            data:'name'
        }

    ]

    _tableInit($('#table'),col,2,true,'','',true,'','',false,'','暂时没有开机的设备');


    /*-----------------------------------------------表单验证--------------------------------------------*/

    $('#equipnew-form').validate({

        rules:{

            //冷机目标值
            'chTarVModal':{

                required: true,

                number:true,

                range:[0,9]

            },
            //冷水机组告警值
            'chAlrVModal':{

                required: true,

                number:true,

                range:[0,9]

            },
            //冷冻水泵目标值
            'chwTarVModal':{

                required: true,

                number:true,

                range:[0,70]

            },
            //冷冻水泵告警值
            'chwAlrVModal':{

                required: true,

                number:true,

                range:[0,70]

            },
            //冷却水泵目标值
            'cwTarVModal':{

                required: true,

                number:true,

                range:[0,70]

            },
            //冷却水泵告警值
            'cwAlrVModal':{

                required: true,

                number:true,

                range:[0,70]

            },
            //冷却塔目标值
            'ctTarVModal':{

                required: true,

                number:true,

                range:[0,250]

            },
            //冷却塔告警值
            'ctAlrVModal':{

                required: true,

                number:true,

                range:[0,250]

            }

        },
        messages:{

            //冷机目标值
            'chTarVModal':{

                required: '冷水机组目标值是必填字段',

                range:'请输入0~9之间的数字'

            },
            //冷水机组告警值
            'chAlrVModal':{

                required: '冷水机组告警值是必填字段',

                range:'请输入0~9之间的数字'

            },
            //冷冻水泵目标值
            'chwTarVModal':{

                required: '冷冻水泵目标值是必填字段',

                range:'请输入0~70之间的数字'

            },
            //冷冻水泵告警值
            'chwAlrVModal':{

                required: '冷冻水泵告警值是必填字段',

                range:'请输入0~70之间的数字'

            },
            //冷却水泵目标值
            'cwTarVModal':{

                required: '冷却水泵目标值是必填字段',

                range:'请输入0~70之间的数字'

            },
            //冷却水泵告警值
            'cwAlrVModal':{

                required: '冷却水泵告警值是必填字段',

                range:'请输入0~70之间的数字'

            },
            //冷却塔目标值
            'ctTarVModal':{

                required: '冷却塔目标值是必填字段',

                range:'请输入0~250之间的数字'

            },
            //冷却塔告警值
            'ctAlrVModal':{

                required: '冷却塔告警值是必填字段',

                range:'请输入0~250之间的数字'

            }

        }

    })

    /*-------------------------------------点击事件---------------------------------------------*/

    //数据曲线tab切换
    $('.main-tab').on('click','span',function(){

        $('.main-tab').find('span').removeClass('main-tab-active');

        $(this).addClass('main-tab-active');

        $('.chart-line').css('z-index','1');

        $('.chart-line').eq($(this).parent().index()).css('z-index','2');

    })

    //chart图自适应
    window.onresize = function () {

        if (_chartG && _chartEnergy && _chartEfficiency) {

            _chartG.resize();

            _chartEnergy.resize();

            _chartEfficiency.resize();
        }
    }

    //设备目标、告警值
    $('#devOption').click(function(){

        //根据目标值和告警值是否创建过了

        if(_isCreate){

            //需要创建
            _moTaiKuang($('#devModal'),'创建设备目标/告警值',false,false,false,'保存');

            $('#devModal').find('.btn-primary').removeClass('bianji').addClass('dengji');

        }else{

            //修改
            _moTaiKuang($('#devModal'),'编辑设备目标/告警值',false,false,false,'保存');

            $('#devModal').find('.btn-primary').removeClass('dengji').addClass('bianji');

            //赋值
            //冷水机组-目标值
            $('#chTarVModal').val(_devObj.chTarV);
            //冷水机组-告警值
            $('#chAlrVModal').val(_devObj.chAlrV);
            //冷冻水泵-目标值
            $('#chwTarVModal').val(_devObj.chwTarV);
            //冷冻水泵-告警值
            $('#chwAlrVModal').val(_devObj.chwAlrV);
            //冷却水泵-目标值
            $('#cwTarVModal').val(_devObj.cwTarV);
            //冷却水泵-告警值
            $('#cwAlrVModal').val(_devObj.cwAlrV);
            //冷却塔-目标值
            $('#ctTarVModal').val(_devObj.ctTarV);
            //冷却塔-告警值
            $('#ctAlrVModal').val(_devObj.ctAlrV);

        }

    })

    //登记
    $('#devModal').on('click','.dengji',function(){

        formatValidateUser(function(){

            sendOption('ZKMain/CreateChillSystemEQTargetAndAlarmValue');

        })

    })

    //编辑
    $('#devModal').on('click','.bianji',function(){

        formatValidateUser(function(){

            sendOption('ZKMain/ModifyChillSystemEQTargetAndAlarmValue');

        })

    })

    //查看设备状态
    $('#EEEC').on('click','.machine-on',function(){

        _moTaiKuang($('#machineModal'),'开机状态',true,false,false,false);

        var index = $(this).parent('tr').index();

        var arr = [];

        if(index == 0){

            //冷水机组

            if(_devObj.chRs){

                for(var i=0;i<_devObj.chRs.length;i++){

                    var obj = {};

                    obj.state = _devObj.chRs[i].f_RunState;

                    obj.name = _devObj.chRs[i].chillerName;

                    arr.push(obj);

                }

            }

        }else if(index == 1){

            //冷冻水泵

            if(_devObj.chwRs){

                for(var i=0;i<_devObj.chwRs.length;i++){

                    var obj = {};

                    obj.state = _devObj.chwRs[i].f_RunState;

                    obj.name = _devObj.chwRs[i].pumpName;

                    arr.push(obj);

                }

            }

        }else if(index == 2){

            //冷却水泵

            if(_devObj.cwRs){

                for(var i=0;i<_devObj.cwRs.length;i++){

                    var obj = {};

                    obj.state = _devObj.cwRs[i].f_RunState;

                    obj.name = _devObj.cwRs[i].pumpName;

                    arr.push(obj);

                }

            }


        }else if(index == 3){

            //冷却塔

            if(_devObj.ctRs){

                for(var i=0;i<_devObj.ctRs.length;i++){

                    var obj = {};

                    obj.state = _devObj.ctRs[i].f_RunState;

                    obj.name = _devObj.ctRs[i].ctName;

                    arr.push(obj);

                }

            }
        }


        _datasTable($('#table'),arr);

    })

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

                var data = '-';

                if(result.code == 0){

                    data = result.ePrCoVa;

                }

                if(data == '-'){

                    $('#spanEPrice').html('-');

                }else{

                    $('#spanEPrice').html(parseFloat(data).toFixed(4));

                }

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
                var lznowlv = '-';

                //冷站散热量
                var lzsrlv = '-';

                //冷站输入功率
                var lznowp = '-';

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

            beforeSend:function(){

                $('.main-time').showLoading();

            },

            complete:function(){

                $('.main-time').hideLoading();

            },

            success:function(result){

                if(result.code == 0){

                    //温度
                    if(result.tsw == true){

                        $('#ist').html(Number(result.ist).toFixed(1));

                    }

                    //湿度
                    if(result.hsw == true){

                        $('#ish').html(Number(result.ish).toFixed(1));

                    }

                    //湿球
                    if(result.wbw == true){

                        $('#iswbw').html(Number(result.iswbw).toFixed(1));

                    }


                }else{

                    //温度
                    $('#ist').html('-');

                    //湿度
                    $('#ish').html('-');

                    //湿球
                    $('#iswbw').html('-');

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

            async:false,

            url:sessionStorage.apiUrlPrefix + 'Global/GetRealDt',

            beforeSend:function(){

                $('.main-date').showLoading();

            },

            complete:function(){

                $('.main-date').hideLoading();

            },

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

                    sessionStorage.sysDt = result.dt;


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

        $('.noDataTipNX').remove();

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

                    var str = '<div class="noDataTipNX" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">暂时没有获取到能效数据</div>'

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

                optionL.legend.data = ['实时能效(KW/KW)'];

                optionL.series[0] = obj;

                _chartEfficiency.setOption(optionL,true);

            },

            error:_errorFun1

        })

    }

    //能源曲线
    function NYQX(){

        $('.noDataTipNY').remove();

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

                    //tip = result.legend;

                    tip = ['冷量(KW)','冷机功率(KW)','散热量(KW)','热不平衡率(%)'];

                    for(var i=0;i<result.xs.length;i++){

                        dataX.push(result.xs[i]);

                    }

                    for(var i=0;i<result.ys.length;i++){

                        var obj = {};

                        obj.name = tip[i];

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

                    var str = '<div class="noDataTipNY" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">暂时没有获取到能效数据</div>'

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

    //设备能效能耗
    function devEEEC(){

        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,
            //系统实时时间
            sysrealDt:sessionStorage.sysDt
        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'ZKMain/GetEPTAsByEQ',

            timeout:_theTimes,

            data:prm,

            beforeSend:function(){

                $('#EEEC').showLoading();

            },

            complete:function(){

                $('#EEEC').hideLoading();

            },

            success:function(result){

                if(result.code == 0){

                    if(result.chTarV == null || result.chTarV == ''){

                        _isCreate = true;

                    }

                    _devObj = result;

                    //冷水机组
                    //开机台数
                    var chRunNum = 0;

                    if(result.chRs != null){

                        for(var i=0;i<result.chRs.length;i++){

                            if(result.chRs[i].f_RunState == 1){

                                chRunNum ++;

                            }

                        }

                    }

                    $('#chRs').html(chRunNum);

                    //实际值（能效）
                    $('#cheVa').html(result.cheVa);

                    //实际值（能耗）
                    $('#chpVa').html(result.chpVa);

                    //目标值
                    $('#chTarV').html(result.chTarV==''?'-':result.chTarV);

                    //告警值
                    $('#chAlrV').html(result.chAlrV==''?'-':result.chAlrV);

                    //冷冻水泵
                    //开机台数
                    var chwRunNum = 0;

                    if(result.chwRs != null){

                        for(var i=0;i<result.chwRs.length;i++){

                            if(result.chwRs[i].f_RunState == 1){

                                chwRunNum ++;

                            }

                        }

                    }

                    $('#chwRs').html(chwRunNum);

                    //实际值（能效）
                    $('#chweVa').html(result.chweVa);

                    //实际值（能耗）
                    $('#chwpVa').html(result.chwpVa);

                    //目标值
                    $('#chwTarV').html(result.chwTarV==''?'-':result.chwTarV);

                    //告警值
                    $('#chwAlrV').html(result.chwAlrV==''?'-':result.chwAlrV);

                    //冷却水泵
                    //开机台数
                    var cwRunNum = 0;

                    if(result.cwRs != null){

                        for(var i=0;i<result.cwRs.length;i++){

                            if(result.cwRs[i].f_RunState == 1){

                                cwRunNum ++;

                            }

                        }

                    }

                    $('#cwRs').html(cwRunNum);

                    //实际值（能效）
                    $('#cweVa').html(result.cweVa);

                    //实际值（能耗）
                    $('#cwpVa').html(result.cwpVa);

                    //目标值
                    $('#cwTarV').html(result.cwTarV==''?'-':result.cwTarV);

                    //告警值
                    $('#cwAlrV').html(result.cwAlrV==''?'-':result.cwAlrV);

                    //冷却塔
                    //开机台数
                    var ctRunNum = 0;

                    if(result.ctRs != null){

                        for(var i=0;i<result.ctRs.length;i++){

                            if(result.ctRs[i].f_RunState == 1){

                                ctRunNum ++;

                            }

                        }

                    }

                    $('#ctRs').html(ctRunNum);

                    //实际值（能效）
                    $('#cteVa').html(result.cteVa);

                    //实际值（能耗）
                    $('#ctpVa').html(result.ctpVa);

                    //目标值
                    $('#ctTarV').html(result.ctTarV==''?'-':result.ctTarV);

                    //告警值
                    $('#ctAlrV').html(result.ctAlrV==''?'-':result.ctAlrV);

                }else{

                    //冷水机组
                    $('#chwRs').html('-');

                    //实际值（能效）
                    $('#chweVa').html('-');

                    //实际值（能耗）
                    $('#chwpVa').html('-');

                    //目标值
                    $('#chwTarV').html('-');

                    //告警值
                    $('#chwAlrV').html('-');

                    //冷冻水泵
                    $('#chwRs').html('-');

                    //实际值（能效）
                    $('#chweVa').html('-');

                    //实际值（能耗）
                    $('#chwpVa').html('-');

                    //目标值
                    $('#chwTarV').html('-');

                    //告警值
                    $('#chwAlrV').html('-');

                    //冷却水泵
                    $('#cwRs').html('-');

                    //实际值（能效）
                    $('#cweVa').html('-');

                    //实际值（能耗）
                    $('#cwpVa').html('-');

                    //目标值
                    $('#cwTarV').html('-');

                    //告警值
                    $('#cwAlrV').html('-');

                    //冷却塔
                    $('#ctRs').html('-');

                    //实际值（能效）
                    $('#cteVa').html('-');

                    //实际值（能耗）
                    $('#ctpVa').html('-');

                    //目标值
                    $('#ctTarV').html('-');

                    //告警值
                    $('#ctAlrV').html('-');

                }

            },

            error:_errorFun1

        })


    }

    //登记/编辑
    function sendOption(url){

        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,
            //冷机目标值
            chTarV:$('#chTarVModal').val(),
            //冷机告警值
            chAlrV:$('#chAlrVModal').val(),
            //冷冻泵目标值
            chwTarV:$('#chwTarVModal').val(),
            //冷冻泵告警值
            chwAlrV:$('#chwAlrVModal').val(),
            //冷却泵目标值
            cwTarV:$('#cwTarVModal').val(),
            //冷却泵告警值
            cwAlrV:$('#cwAlrVModal').val(),
            //冷却塔目标值
            ctTarV:$('#ctTarVModal').val(),
            //冷却塔告警值
            ctAlrV:$('#ctAlrVModal').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + url,

            timeout:_theTimes,

            data:prm,

            beforeSend:function(){

                var str = '<i class="fa fa-save"></i>正在保存...'

                $('#saveBtn').html(str).attr('disabled',true);

            },

            complete:function(){

                var str = '<i class="fa fa-save"></i>保存设备数据'

                $('#saveBtn').html(str).attr('disabled',false);

            },

            success:function(result){

                if(result.code == 0){

                    $('#devModal').modal('hide');

                    devEEEC();

                }

            },

            error:_errorFun1

        })


    }

    //格式验证
    function formatValidateUser(fun){

        $('#tip').hide();

        //非空验证
        if($('#chTarVModal').val() == '' || $('#chAlrVModal').val() == '' || $('#chwTarVModal').val() == '' || $('#chwAlrVModal').val() == '' || $('#cwTarVModal').val() == '' || $('#cwAlrVModal').val() == '' || $('#ctTarVModal').val() == '' || $('#ctAlrVModal').val() == '' ){

            _topTipBar('请填写必填项')

        }else{

            //验证错误
            var error = $('#equipnew-form').find('.error');

            if(error.length != 0){

                var flag = true;

                for(var i=0;i<error.length;i++){

                    if(error.eq(i).css('display') != 'none'){

                        flag = false;

                        break;

                    }

                }

                if(flag){

                    fun();

                }else{

                    _topTipBar('请填写正确格式')

                }

            }else{

                //验证通过
                fun();

            }


        }

    }

    //报警
    function alarmData(){

        var prm = {

            //报警界面分类
            alarmType:[[2],[2],[2]],

            //楼宇ID集合
            pointerIDs:[sessionStorage.PointerID],

            //时间
            startTime:sessionStorage.sysDt

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'ZKMain/GetAlarmCount',

            data:prm,

            timeout:_theTimes,

            beforeSend:function(){

                $('.alarm-block').showLoading();

            },

            complete:function(){

                $('.alarm-block').hideLoading();

            },

            success:function(result){

                //设备故障报警
                var devNum = '-';
                //运行参数报警
                var runNum = '-';
                //仪表故障报警
                var meterNum = '-';

                if(result.code == 0){

                    //设备故障报警
                    devNum = result.devideEERCount;
                    //运行参数报警
                    runNum = result.runEERCount;
                    //仪表故障报警
                    meterNum = result.meterEERCount;

                }

                //设备故障报警
                $('#devideEERCount').html(devNum);
                //运行参数报警
                $('#runEERCount').html(runNum);
                //仪表故障报警
                $('#meterEERCount').html(meterNum);


            },

            error:_errorFun1

        })


    }

})