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

            var data = 0.0000;

            if(result.code == 0){

                data = result.ubrVa;

            }

            $('#lzbphlv').html(Number(data).toFixed(2));

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



    }

})