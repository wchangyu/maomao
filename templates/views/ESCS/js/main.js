$(function(){

    /*------------------------------变量--------------------------------------*/

    //是否创建过目标值和告警值
    var _isCreate = false;

    //将获取到的设备目标值对象保存
    var _devObj = {};

    //左上角室外温湿度
    WSD();

    //获取实时时间
    SSSJ();

    //设备能效能耗
    devEEEC();

    //冷站
    LZData();

    //热不平衡率
    RBPHL();

    //仪器状态
    instrumentStatus();

    //能效标尺
    NXBC();

    //能效曲线
    NXQX();

    //能源曲线
    NYQX();

    //报警
    alarmData();

    //运行参数
    YXCS();

    //十分钟刷新一次
    setInterval(function(){

        //左上角室外温湿度
        WSD();

        //获取实时时间
        SSSJ();

        //设备能效能耗
        devEEEC();

        //冷站
        LZData();

        //热不平衡率
        RBPHL();

        //仪器状态
        instrumentStatus();

        //能效标尺
        NXBC();

        //能效曲线
        NXQX();

        //能源曲线
        NYQX();

        //报警
        alarmData();

        //运行参数
        YXCS();

    },1000*30)

    /*-----------------------------------------------chart---------------------------------------------*/

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

    /*-----------------------------------------------表单验证--------------------------------------------*/

    $('#equipnew-form').validate({

        rules:{

            //冷机目标值
            'chTarVModal':{

                required: true,

                number:true,

                range:[0,9],

                numberFormatTarget:true

            },
            //冷水机组告警值
            'chAlrVModal':{

                required: true,

                number:true,

                range:[0,9],

                numberFormatAlarm:true

            },
            //冷冻水泵目标值
            'chwTarVModal':{

                required: true,

                number:true,

                range:[0,70],

                numberFormatTarget:true

            },
            //冷冻水泵告警值
            'chwAlrVModal':{

                required: true,

                number:true,

                range:[0,70],

                numberFormatAlarm:true

            },
            //冷却水泵目标值
            'cwTarVModal':{

                required: true,

                number:true,

                range:[0,70],

                numberFormatTarget:true

            },
            //冷却水泵告警值
            'cwAlrVModal':{

                required: true,

                number:true,

                range:[0,70],

                numberFormatAlarm:true

            },
            //冷却塔目标值
            'ctTarVModal':{

                required: true,

                number:true,

                range:[0,250],

                numberFormatTarget:true

            },
            //冷却塔告警值
            'ctAlrVModal':{

                required: true,

                number:true,

                range:[0,250],

                numberFormatAlarm:true

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

    //自定义验证KW/KW中，目标值要大于告警值
    $.validator.addMethod("numberFormatTarget",function(value,element,params){

        var BJValue = $(element).parent().next().next().children('input').val();

        if(!Number(BJValue)){

            return true

        }else{

            if(Number(value)>Number(BJValue)){

                return true

            }else {

                return false;

            }

        }



    },"目标值需大于告警值");

    //自定义验证KW/KW中，目标值要大于告警值
    $.validator.addMethod("numberFormatAlarm",function(value,element,params){

        var BJValue = $(element).parent().prev().prev().children('input').val();

        if(!Number(BJValue)){

            return true

        }else{

            if(Number(value)<Number(BJValue)){

                return true

            }else {

                return false;

            }

        }



    },"告警值要小于目标值");

    /*---------------------------------按钮事件----------------------------------*/

    //设备目标、告警值
    $('#devOption').click(function(){

        //首先要初始化
        $('#equipnew-form').find('input').val('');

        var label = $('#equipnew-form').find('label');

        for(var i=0;i<label.length;i++){

            if(label.eq(i).attr('class') == 'error'){

                label.eq(i).hide();

            }

        }


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

    //数据曲线tab切换
    $('.main-tab').on('click','span',function(){

        $('.main-tab').find('span').removeClass('main-tab-active');

        $(this).addClass('main-tab-active');

        $('.chart-line').css('z-index','1');

        $('.chart-line').eq($(this).parent().index()).css('z-index','2');

    })

    //chart图自适应
    window.onresize = function () {

        if (_chartEnergy && _chartEfficiency) {

            _chartEnergy.resize();

            _chartEfficiency.resize();
        }
    }

    /*---------------------------------其他方法----------------------------------*/

    //获取楼宇的室外温湿度
    function WSD(){

        //初始化
        WSDInit();

        //参数
        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,

        }

        _mainAjaxFunCompleteNew('get','Global/GetTHW',prm,false,function(result){

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

        })

    }

    //温度初始化
    function WSDInit(){

        //室外温度
        $('#ist').val('-');
        //相对湿度
        $('#ish').val('-');
        //湿球温度
        $('#iswbw').val('-');

    }

    //获取实时时间
    function SSSJ(){

        //初始化时间
        SSSJInit();

        //参数
        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,

        }

        _mainAjaxFunCompleteNew('get','Global/GetRealDt',prm,$('.GSKJ'),function(result){

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

        })

    }

    //实时时间初始化
    function SSSJInit(){

        //日期
        $('#real-date').html('-');

        //时间
        $('#real-time').html('-');

    }

    //设备能效能耗
    function devEEEC(){

        //初始化
        devEEECInit();

        //参数
        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,
            //系统实时时间
            sysrealDt:sessionStorage.sysDt
        }

        _mainAjaxFunCompleteNew('post','ZKMain/GetEPTAsByEQ',prm,$('#EEEC'),function(result){

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

                //目标值
                $('#chTarV').html(result.chTarV==''?'-':result.chTarV);

                //告警值
                $('#chAlrV').html(result.chAlrV==''?'-':result.chAlrV);

                //实际值（能效）
                $('#cheVa').html(result.cheVa);

                //实际值（能耗）
                $('#chpVa').html(result.chpVa);

                //确定颜色
                returnColor($('#chTarV').html(),$('#chAlrV').html(),$('#cheVa').html(),$('#cheVa'));

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

                //确定颜色
                returnColor($('#chwTarV').html(),$('#chwAlrV').html(),$('#chweVa').html(),$('#chweVa'));


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

                //实际值（能耗）
                $('#cwpVa').html(result.cwpVa);

                //目标值
                $('#cwTarV').html(result.cwTarV==''?'-':result.cwTarV);

                //告警值
                $('#cwAlrV').html(result.cwAlrV==''?'-':result.cwAlrV);

                //实际值（能效）
                $('#cweVa').html(result.cweVa);

                //确定颜色
                returnColor($('#cwTarV').html(),$('#cwAlrV').html(),$('#cweVa').html(),$('#cweVa'));

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

                //确定颜色
                returnColor($('#ctTarV').html(),$('#ctAlrV').html(),$('#cteVa').html(),$('#cteVa'));

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

        })

    }

    //设备能效能耗初始化
    function devEEECInit(){

        //实际值
        $('#EEEC').find('.actual-value-top').html('-');

        //目标值
        $('#EEEC').find('.target-value').html('-');

        //告警值
        $('#EEEC').find('.alarm-value').html('-');

        //设备电耗值
        $('#EEEC').find('.actual-value-top-DH').html('-');
    }

    //冷站效率
    function LZData(){

        //初始化
        LZDataInit();

        //参数
        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,
            //日期
            sysrealDt:sessionStorage.sysDt,
            //换算单位
            misc:sessionStorage.misc
        }

        _mainAjaxFunCompleteNew('post','Main/GetECPItemizeNowDs',prm,$('.XTLL'),function(res){

            //冷站输出冷量
            var lznowlv = '-';

            //冷站散热量
            var lzsrlv = '-';

            //冷站输入功率
            var lznowp = '-';

            //冷站效率
            var eerV = '-';

            if(res.code == 0){

                //冷站散热量
                lzsrlv = res.srlVa;

                //冷站实时功率
                var lzpV = (parseFloat((res.cpVa == null)?0:res.cpVa) + parseFloat((res.chwpVa == null)?0:res.chwpVa) + parseFloat((res.cwpVa == null)?0:res.cwpVa) + parseFloat((res.ctpVa == null)?0:res.ctpVa));

                //冷站输入功率
                lznowp = lzpV.toFixed(1);

                //冷站实时冷量
                var lzlV = parseFloat(res.lVa);

                //冷战输出冷量
                lznowlv = lzlV;

                //冷站效率
                eerV = parseFloat(lzlV / lzpV).toFixed(3);

            }

            //冷站输出冷量(系统冷量)
            $('#lznowlv').html(lznowlv);

            //冷站散热量
            $('#lzsrlv').html(lzsrlv);

            //冷站输入功率
            $('#lznowp').html(lznowp);

            //冷站效率
            $('#LZXLNum').html(eerV);

        })

    }

    //冷站初始化
    function LZDataInit(){

        //冷站效率
        $('#LZXLNum').html('-');

        //冷站输出冷量(系统冷量)
        $('#lznowlv').html('-');

        //冷站散热量
        $('#lzsrlv').html('-');

        //冷站输入功率(电量)
        $('#lznowp').html('-');

    }

    //热不平衡率
    function RBPHL(){

        //初始化
        RBPHLInit();

        //标尺初始化
        RPHBC();

        //参数
        var prm = {

            //楼宇ID
            pId:sessionStorage.PointerID,
            //日期
            sysrealDt:sessionStorage.sysDt,
            //换算单位
            misc:sessionStorage.misc
        }

        _mainAjaxFunCompleteNew('post','Main/GetUBRVNowData',prm,false,function(result){

            //整体能效的值
            var data = '-';

            if(result.code == 0){

                data = result.ubrVa;

                $('#lzbphlv').html(Number(data).toFixed(2));

                //热不平衡标尺
                RBPHBC(Number(data).toFixed(2));

            }

        })

    }

    //热不平衡率初始化
    function RBPHLInit(){

        $('#lzbphlv').html('-')

    }

    //显示颜色
    function returnColor(targetNum,alarmNum,actualNum,el){

        var target = Number(targetNum);

        var alarm = Number(alarmNum);

        var actual = Number(actualNum);

        //高于目标值显示绿色，低于告警值显示红色，在两者之间显示蓝色

        if(actual>target){

            el.css({color:'rgba(28,193,90,1)'});

        }else if(actual<alarm){

            el.css({color:'rgba(255,69,0,1)'});

        }else{

            el.css({color:'rgba(116,167,246,1)'});

        }


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

    //获取数据采集仪状态
    function instrumentStatus(){

        //初始化
        instrumentStatusInit();

        //参数
        var prm = {

            //分类标记
            pubClass:sessionStorage.pubClassID,
            //企业ID
            eprId:sessionStorage.enterpriseID,
            //楼宇ID
            pId:sessionStorage.PointerID

        }

        _mainAjaxFunCompleteNew('post','ZKMain/GetChannlesType',prm,false,function(result){

            if(result.code == 0){

                $('#instrumentStatus').html(result.onoff);

                if(result.onoff == 'OFF'){

                    $('#instrumentStatus').css({'color':'red'})

                }else if(result.onoff == 'ON'){

                    $('#instrumentStatus').css({'color':'#3DD7C1'})

                }


            }


        })


    }

    //采集仪状态初始化
    function instrumentStatusInit(){

        $('#instrumentStatus').html('-');

    }

    //能效标尺
    function NXBC(){

        //初始化
        NXBCInit();

        //参数
        var prm = {

            //楼宇
            pId:sessionStorage.PointerID,
            //日期
            sp:moment(sessionStorage.sysDt).format('YYYY-MM-DD'),
            //日数据
            dType:'D',
            //单位
            misc:sessionStorage.misc

        }

        _mainAjaxFunCompleteNew('post','CalendarEER/GetCalendarEERAnalysisExpDs',prm,$('#tableMark'),function(res){

            //能效值
            var lzeerV = 0;

            if (typeof (res.lzeerVa) == "undefined") {

                lzeerV = 0;

            }
            else {

                lzeerV = parseFloat(res.lzeerVa).toFixed(2);

                tableIcon(lzeerV)


            }

        })


    }

    //能效标尺初始化
    function NXBCInit(){

        //$('#tableMark tbody').children('tr').eq(1).children('td').addClass('noBG');

        $('#tableMark tbody').children('tr').eq(0).children('td').addClass('color');

        $('#aa').remove();

    }

    //热平衡标尺
    function RPHBC(){

        $('#RBPHL-tip').hide();

    }

    //能效标尺确定图标
    function tableIcon(data){

        var classN = '';

        var indexN = '';

        if(data<2.9){

            classN =  'badRRight';

            indexN = 8;

        }else if(data == 2.9){

            classN =  'badR';

            indexN = 8;

        }else if(data>2.9 && data<=3.05){

            classN =  'badRLeft';

            indexN = 7

        }else if(data>3.05&& data<3.2){

            classN =  'badRRight';

            indexN = 7

        }else if(data == 3.2){

            classN =  'badR';

            indexN = 7

        }else if(data>3.2 && data<=3.35){

            classN =  'badRLeft';

            indexN = 7


        }else if(data>3.35 && data<3.5){

            classN = 'badRRight'

            indexN = 6

        }else if(data == 3.5){

            classN = 'commonR';

            indexN = 6

        }else if(data>3.5 && data<=3.7){

            classN = 'commonRLeft';

            indexN = 6

        }else if(data>3.7 && data<3.9){

            classN = 'commonRRight';

            indexN = 5

        }else if(data == 3.9){

            classN = 'commonR';

            indexN = 5

        }else if(data>3.9 && data<=4.15){

            classN = 'commonRLeft';

            indexN = 5;


        }else if(data>4.15&&data<4.4){

            classN = 'greatRRight';

            indexN = 4;

        }else if(data == 4.4){

            classN = 'greatR';

            indexN = 4

        }else if(data >4.4 && data<=4.7){

            classN = 'greatRLeft';

            indexN = 4;

        }else if(data>4.7 && data<5.0){

            classN = 'greatRRight'

            indexN = 3

        }else if(data == 5.0){

            classN = 'excellentRRight'

            indexN = 3

        }else if(data>5.0&&data<=5.45){

            classN = 'excellentRLeft'

            indexN = 3

        }else if(data>5.45&&data<5.9){

            classN = 'excellentRRight'

            indexN = 3

        }else if(data == 5.9){

            classN = 'excellentR'

            indexN = 2

        }else if(data>5.9&&data<=6.45){

            classN =  'excellentRLeft'

            indexN = 2

        }else if(data>6.45&&data<7.0){

            classN =  'excellentRRight'

            indexN = 1

        }else if(data == 7){

            classN = 'excellentR'

            indexN = 1

        }else if(data>7){

            classN = 'excellentRLeft';

            indexN = 1

        }

        $('#tableMark').children('tbody').children('tr').eq(1).children('td').eq(indexN).removeClass('noBG').addClass(classN).addClass('showTip');

        //$('#tableMark').children('tbody').children('tr').eq(0).children('td').eq(indexN).removeClass('color').html('当前楼(' + data + ')');

        //判断在左还是在右

        var valueA = '当前楼(' + data + ')';

        var locationL = $('.showTip').attr('class').indexOf('Left');

        var locationR = $('.showTip').attr('class').indexOf('Right');

        var str = '<span id="aa" style="position: absolute;top: -20px;font-size: 14px;width: 123px;left: -20px;font-weight: bold">' + valueA +'</span>';

        //说明在左边
        if(locationL>-1){

            str = '<span id="aa" style="position: absolute;top: -20px;font-size: 14px;width: 123px;left:-49px;font-weight: bold">' + valueA +'</span>';

        }

        //说明在右边
        if(locationR>-1){

            str = '<span id="aa" style="position: absolute;top: -20px;font-size: 14px;width: 123px;left:0px;font-weight: bold">' + valueA +'</span>';

        }

        $('.showTip').append(str);

        //颜色
        if(data<3.5){

            $('#aa').css('color','#ef5286');

        }else if(data>=3.5 && data<4.15){

            $('#aa').css('color','#e5bb3c');

        }else if(data>=4.15 && data<5){

            $('#aa').css('color','#3dd7c1');

        }else if(data>=5){

            $('#aa').css('color','#528ced');

        }
    }

    //热不平衡标尺的位置
    function RBPHBC(data){

        var classN = '';

        var left = 0;

        var color = '';

        if(data == 0){

            left = $('.RBPHL-tip').width() * 0.5 - 20;

        }else if(data == 5){

            left = $('.RBPHL-tip').width() * 0.675 - 20;

        }else if(data == 10){

            left = $('.RBPHL-tip').width() * 0.85 - 20;

        }else if(data == -5){

            left = $('.RBPHL-tip').width() * 0.34 - 20;

        }else if(data == -10){

            left = $('.RBPHL-tip').width() * 0.18 - 20;

        }else if(data>0&&data<=2.5){

            left = $('.RBPHL-tip').width() * 0.58 - 20;

        }else if(data>2.5&&data<5){

            left = $('.RBPHL-tip').width() * 0.6 - 20;

        }else if(data>5&&data<=7.5){

            left = $('.RBPHL-tip').width() * 0.75 - 20;

        }else if(data>7.5&&data<10){

            left = $('.RBPHL-tip').width() * 0.8 - 20;

        }else if(data<-2.5&&data>-5){

            left = $('.RBPHL-tip').width() * 0.4 - 20;

        }else if(data<-5&&data>-7.5){

            left = $('.RBPHL-tip').width() * 0.24 - 20;

        }else if(data<-7.5&&data>-10){

            left = $('.RBPHL-tip').width() * 0.18 - 20;

        }else if(data<-10&&data>-12.5){

            left = $('.RBPHL-tip').width() * 0.1 - 20;

        }else if(data<-12.5&&data>-15){

            left = $('.RBPHL-tip').width() * 0.05 - 20;

        }

        $('#RBPHL-tip').css('left',left);

        if(data>-5 && data<5){

            classN = 'greatR'

            color = '#3dd7c1'

        }else if(data>=5&&data<10){

            classN = 'commonR'

            color = '#e5bb3c'

        }else if(data>=10){

            classN = 'badR'

            color = '#ef5286'

        }else if(data<=-5 && data>-10){

            classN = 'commonR'

            color = '#e5bb3c'

        }else if(data<=-10){

            classN = 'badR'

            color = '#ef5286'
        }

        $('#RBPHL-tip').addClass(classN).show();

        $('#RBPHL-word').css({'left':left-40,'color':color}).html('当前楼（'+ data + '%' + ')');


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

    //报警
    function alarmData(){

        var prm = {

            //报警界面分类
            alarmType:[[2],[3],[1]],

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

    //系统运行参数
    function YXCS(){

        //初始化
        YXCSInit();

        var prm = {

            //楼宇
            pId:sessionStorage.PointerID,
            //系统实时时间
            sysrealDt:sessionStorage.sysDt

        }

        _mainAjaxFunCompleteNew('post','ZKMain/GetSysRparWts',prm,$('.YXCS'),function(result){

            if(result.code == 0){

                //冷冻水温差
                $('#chwOutWt').html(Number(result.chwOutWt).toFixed(1));
                //冷却水温差
                $('#cwInWt').html(Number(result.cwInWt).toFixed(1));
                //冷冻供水温度
                $('#chwInWt').html(Number(result.chwInWt).toFixed(1));
                //冷却回水温度
                $('#cwOutWt').html(Number(result.cwOutWt).toFixed(1));
            }

        })

    }

    //运行参数初始化
    function YXCSInit(){

        //冷冻水温差
        $('#chwOutWt').html('-');
        //冷却水温差
        $('#cwInWt').html('-');
        //冷冻供水温度
        $('#chwInWt').html('-');
        //冷却回水温度
        $('#cwOutWt').html('-');

    }


})