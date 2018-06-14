var Main = function () {

    //多时间段ChartView图
    var myeAnhsCV = null;

    //单时间段ChartView图
    var myAnhsCV = null;

    window.onresize=function (ev) {
        if(myeAnhsCV){
            myeAnhsCV.resize();
        }
        if(myAnhsCV){
            myAnhsCV.resize();
        }
    }

    //改变窗体大小时改变ChartView大小
    window.onresize = function (ev) {
        if(myEERLineMain){
            myEERLineMain.resize();
        }
        if(myPowerLineMain){
            myPowerLineMain.resize();
        }
        if(myTIRLineMain){
            myTIRLineMain.resize();
        }
        var tabW = 0;
        if ($('.tab-pane').hasClass('active')) {
            var tabW = $('.tab-pane').width();
        }
        $('#eerLineMain').width(tabW);
        $('#powerLineMain').width(tabW);
        $('#therequiLineMain').width(tabW);
    }

    //判断日期或者月份是否小于10，如果小于10，补零
    function addZeroToSingleNumber(num) {
        var curnum = "";
        if (num < 10) {
            curnum = "0" + num;
        }
        else {
            curnum += num;
        }
        return curnum;
    }

    //系统实时时间
    var sysrealdatetime = function () {
        var now = new Date();
        var year = now.getFullYear();
        var month = "";
        if (parseInt(now.getMonth()) == 0) {
            month = "12";
        } else {
            month = addZeroToSingleNumber(now.getMonth());
        }
        var day = addZeroToSingleNumber(now.getDate());
        var hour = addZeroToSingleNumber(now.getHours());
        var min = addZeroToSingleNumber(now.getMinutes());
        var realdatetime = year + "-" + month + "-" + day + " " + hour + ":" + min;
        return realdatetime;
    }

    //能效区间表盘
    var myEERAreaMain = null;
    var initEERArea=function (eerVa,minVa,maxVa) {
        myEERAreaMain = echarts.init(document.getElementById('eerAreaMain'));
        //var cc = [[0.38, '#ff4500'], [0.46, 'orange'], [0.55, 'skyblue'], [1, 'lightgreen']];

        var cc = [[0.23, 'lightgreen'], [0.28, 'skyblue'], [0.33, 'orange'], [1, '#ff4500']];
        //KW/RT
        if ( sessionStorage.misc === "2") {

            cc = [[0.23, 'lightgreen'], [0.28, 'skyblue'], [0.33, 'orange'], [1, '#ff4500']];

        }else {

            cc = [[0.38, '#ff4500'], [0.46, 'orange'], [0.55, 'skyblue'], [1, 'lightgreen']];
        }

        option = {
            tooltip: {
                formatter: "{a} <br/>{c} {b}"
            },
            series: [
                {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: cc,
                            width: 10
                        }
                    },
                    name: '实时能效',
                    type: 'gauge',
                    z: 3,
                    min: minVa,
                    max: maxVa,
                    splitNumber: 15,
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
                    data: [{ value: eerVa, name: 'KW/KW' }]
                },
            ]
        };

        if(sessionStorage.misc == 1){

            option.series[0].data[0].name = 'KW/KW';

        }else if(sessionStorage.misc == 2){

            option.series[0].data[0].name = 'KW/RT';

        }

        myEERAreaMain.setOption(option, true);
    }

    //实时ECP能效冷量功率数据
    var initNOWECP=function () {
        jQuery('#itemizeBusy').showLoading();
        var url = sessionStorage.apiUrlPrefix+ "Main/GetECPItemizeNowDs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            SysrealDt:encodeURIComponent(sessionStorage.sysDt),
            misc:sessionStorage.misc
        },function (res) {
            if(res.code === 0){
                /*单位:冷站输出冷量*/
                //$('#lznowlvMisc').html('KW');
                /*单位:冷站散热量*/
                //$('#lzsrlvMisc').html('KW');
                /*单位:分项实时能效描述*/
                //$('#itemizeMisc').html('KW/KW');
                /*冷站散热量*/
                $('#lzsrlv').html(res.srlVa);
                /*冷机功率(小数位数为1位)*/
                var cpv_fx = parseFloat(res.cpVa).toFixed(1)
                $("#cpv").html(cpv_fx);
                /*冷冻泵功率(小数位数为1位)*/
                var chwpv_fx = parseFloat(res.chwpVa).toFixed(1);
                $("#chwpv").html(chwpv_fx);
                /*冷却泵功率(小数位数为1位)*/
                var cwpv_fx = parseFloat(res.cwpVa).toFixed(1);
                $("#cwpv").html(cwpv_fx);
                /*冷却塔功率(小数位数为1位)*/
                var ctpv_fx = parseFloat(res.ctpVa).toFixed(1);
                $("#ctpv").html(ctpv_fx);
                /*冷机能效(小数位数为2位)*/
                var ce_fx = parseFloat(res.ceVa).toFixed(2);
                $('#cev').html(ce_fx);
                /*冷冻泵能效(小数位数为2位)*/
                var chwe_fx = parseFloat(res.chweVa).toFixed(2);
                $('#chwev').html(chwe_fx);
                /*冷却泵能效(小数位数为2位)*/
                var cwe_fx = parseFloat(res.cweVa).toFixed(2);
                $('#cwev').html(cwe_fx);
                /*冷却塔能效(小数位数为2位)*/
                var cte_fx = parseFloat(res.cteVa).toFixed(2);
                $('#ctev').html(cte_fx);
                /*冷站实时功率*/
                var lzpV = (parseFloat((res.cpVa == null)?0:res.cpVa) + parseFloat((res.chwpVa == null)?0:res.chwpVa) + parseFloat((res.cwpVa == null)?0:res.cwpVa) + parseFloat((res.ctpVa == null)?0:res.ctpVa));

                $('#lznowp').html(lzpV.toFixed(1));
                /*冷站实时冷量*/
                var lzlV = parseFloat(res.lVa)
                $('#lznowlv').html(lzlV);
                /*冷站实时能效*/
                var eerV = 0;
                var eerMinV = 0;
                var eerMaxV = 0;
                if (lzlV === 0) {
                    eerV = 0;
                }
                //能效=冷量/电量

                ////KW/KW
                //if( sessionStorage.misc == 1 ){
                //
                //    eerMinV=0;
                //    eerMaxV=9;
                //
                //    //KW/RT
                //}else if( sessionStorage.misc == 2 ){
                //
                //}


                if(lzpV===0){
                    initEERArea(0.0,eerMinV,eerMaxV);

                    $('.GBEE').html('(0.00)');

                    $('#cevBK').html('(0.00)');


                }else{

                    if(sessionStorage.misc == 1){

                        //KW/KW

                        eerMinV=0;

                        eerMaxV=9;

                        eerV = parseFloat(lzlV / lzpV).toFixed(3);

                        if (eerV > 15) {
                            eerV = 15;
                        }

                    }else if(sessionStorage.misc == 2){

                        //KW/RT

                        eerMinV=0;

                        eerMaxV=3;

                        eerV = parseFloat(lzpV / lzlV).toFixed(3);

                        if (eerV > 3) {
                            eerV = 3.000;
                        }

                    }

                    initEERArea(eerV,eerMinV,eerMaxV);

                    //实时折标能效、COP 标况 = COP实测 /(1+(冷冻出水温度-7）×2%）/（1+（30-冷却回水温度）×3%））

                    //COP实测eerV

                    //冷冻出水温度
                    var chwOutWt = parseFloat(res.chwOutWt);//冷冻出水温度

                    var cwInWt = parseFloat(res.cwInWt);//冷却回水温度

                    //能效国际标况
                    var nx_stp = parseFloat(eerV / (1 + (chwOutWt - 7) * 0.02) / (1 + (30 - cwInWt) * 0.03)).toFixed(2);

                    //折标能效
                    var zb_stp = parseFloat(res.copstp);

                    $('.GBEE').html('(' + zb_stp + ')');

                    /*冷机能效标况*/
                    $('#cevBK').html('(' + nx_stp + ')');

                }
                jQuery('#itemizeBusy').hideLoading();
            }else if(res.code === -1){

            }else{
                console.log('异常错误(分项实时能效):' + res.msg);
            }
        });
    }

    //实时能效曲线(显示折标能效)
    var myEERLineMain = null;
    var initNOWEERCharView=function () {
        jQuery('#lineBusy').showLoading();
        myEERLineMain = echarts.init(document.getElementById('eerLineMain'));
        var url = sessionStorage.apiUrlPrefix+"Main/GetEERNowChartViewDs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            SysrealDt:encodeURIComponent(sessionStorage.sysDt),
            misc:sessionStorage.misc,
            stp:sessionStorage.showstep
        },function (res) {
            if(res.code===0){

                //返回的数据中，第一个是实时能效曲线值，第二个是折标能效值；
                if(sessionStorage.misc == 1){

                    var name = ["实时能效(KW/KW)","折标能效"];

                }else if(sessionStorage.misc == 2){

                    var name = ["实时能效(KW/RT)","折标能效"];

                }

                //两条线的颜色数组
                var dvs = [];

                for (var i = 0; i < res.ys.length; i++) {

                    var object = {};

                    object.name = name[i];

                    object.type = "line";

                    object.data = [];

                    for (var j = 0; j < res.ys[i].length; j++) {

                        var v = res.ys[i][j];

                        object.data.push(v);

                    }

                    dvs.push(object);

                }

                var colorArr = ['#c23531','#294bd7'];

                //设置颜色
                for(var j=0;j<dvs.length;j++){

                    dvs[j].itemStyle = {};

                    dvs[j].itemStyle.color = colorArr[j];

                }

                option = {
                    title: {
                        //subtext: 'KW/RT'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: name
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            magicType: { type: ['line', 'bar'] },
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            rotate: 45,
                            margin: 20,
                            textStyle: {
                                color: "#222"
                            }
                        },
                        data: res.xs
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    series: dvs
                };
                myEERLineMain.setOption(option, true);
                jQuery('#lineBusy').hideLoading();
            }else if(res.code===-1){//异常错误
                console.log('异常错误(能效曲线):' + res.msg);
                jQuery('#lineBusy').hideLoading();
            }else{//暂无数据
                jQuery('#lineBusy').hideLoading();
            }
        })
    }

    //实时能效曲线(不显示折标能效)
    var initNOWEERCharView1=function () {
        jQuery('#lineBusy').showLoading();
        myEERLineMain = echarts.init(document.getElementById('eerLineMain'));
        var url = sessionStorage.apiUrlPrefix+"Main/GetEERNowChartViewDs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            SysrealDt:encodeURIComponent(sessionStorage.sysDt),
            misc:sessionStorage.misc,
            stp:sessionStorage.showstep
        },function (res) {
            if(res.code===0){

                console.log(res);

                //返回的数据中，第一个是实时能效曲线值，第二个是折标能效值；

                var name = '';

                if(sessionStorage.misc == 1){

                    name = ["实时能效(KW/KW)"];

                }else if(sessionStorage.misc == 2){

                    name = ["实时能效(KW/RT)"];

                }

                //两条线的颜色数组
                var dvs = [];

                for (var i = 0; i < 1; i++) {

                    var object = {};

                    object.name = name[i];

                    object.type = "line";

                    object.data = [];

                    for (var j = 0; j < res.ys[0].length; j++) {

                        var v = res.ys[0][j];

                        object.data.push(v);

                    }

                    dvs.push(object);

                }

                option = {
                    title: {
                        //subtext: 'KW/RT'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: name
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            magicType: { type: ['line', 'bar'] },
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            rotate: 45,
                            margin: 20,
                            textStyle: {
                                color: "#222"
                            }
                        },
                        data: res.xs
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    series: dvs
                };


                myEERLineMain.setOption(option, true);
                jQuery('#lineBusy').hideLoading();
            }else if(res.code===-1){//异常错误
                console.log('异常错误(能效曲线):' + res.msg);
                jQuery('#lineBusy').hideLoading();
            }else{//暂无数据
                jQuery('#lineBusy').hideLoading();
            }
        })
    }

    //实时功率曲线
    var myPowerLineMain = null;
    var initNOEWPowerChartView = function () {
        myPowerLineMain = echarts.init(document.getElementById('powerLineMain'));
        var url= sessionStorage.apiUrlPrefix + "Main/GetPowerNowChartViewDs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            //SysrealDt:encodeURIComponent(sysrealdatetime())
            SysrealDt:encodeURIComponent(sessionStorage.sysDt),

        },function (res) {
            if(res.code===0){
                var dvs = [];
                for (var i = 0; i < res.ys.length; i++) {
                    var object = {};
                    object.name = "冷站实时功率(KW)";
                    object.type = "line";
                    object.data = [];
                    for (var j = 0; j < res.ys[i].length; j++) {
                        var v = res.ys[i][j];
                        object.data.push(v);
                    }
                    dvs.push(object);
                }
                option = {
                    title: {
                        //subtext: '冷站实时功率'
                        //subtext: 'KW'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['冷站实时功率(KW)']
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            magicType: { type: ['line', 'bar'] },
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            rotate: 45,
                            margin: 20,
                            textStyle: {
                                color: "#222"
                            }
                        },
                        data: res.xs
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    series: dvs
                };

                option.legend.data[0] = '冷站实时功率(KW)';

                myPowerLineMain.setOption(option, true);
            }else if(res.code===-1){
                console.log('异常错误(实时功率曲线):' + res.msg);
            }else if(res.code===-2){

            }
        })
    }

    //实时热不平衡曲线
    var myTIRLineMain = null;
    var initTIRChartView = function () {
        myTIRLineMain = echarts.init(document.getElementById('therequiLineMain'));
        var colors = ['#5793f3', '#d14a61', '#675bba', '#ffa500'];
        var url = sessionStorage.apiUrlPrefix + "Main/GetUBRVNowChartViewDs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            SysrealDt:encodeURIComponent(sessionStorage.sysDt),
            misc:sessionStorage.misc
        },function (res) {
            if(res.code===0){
                var aroMax = parseFloat(res.aroMaxVa);//能耗最大值
                var xs = [];
                for (var i = 0; i < 1; i++) {
                    var object = {};
                    object.type = "category";
                    object.axisTick = {};
                    object.axisTick.alignWithLabel = true;
                    object.axisLabel = {};
                    object.axisLabel.rotate = 45;
                    object.axisLabel.margin = 20;
                    object.data = [];
                    for (var j = 0; j < res.xs.length; j++) {
                        object.data.push(res.xs[j]);
                    }
                    xs.push(object);
                }
                var yAxis = [];
                for (var i = 0; i < 2; i++) {
                    var object = {};
                    object.type = "value";
                    if (i == 0) {
                        object.name = "能耗";
                        object.min = 0;
                        object.max = aroMax;
                        object.interval = ((parseInt(aroMax) + 1) / 5);
                    }
                    else {
                        object.name = "热不平衡率";
                        if (res.ys[3] === undefined) {
                            object.min = 0;
                            object.max = 100;
                            object.interval = 20;
                        }
                        else {
                            if (res.ys[3].length === 0) {
                                object.min = 0;
                                object.max = 100;
                                object.interval = 20;
                            }
                            else {
                                var ds = [];//热平衡率数据
                                for (var j = 0; j < res.ys[3].length; j++) {
                                    ds.push(parseFloat(res.ys[3][j]));
                                };
                                var minV = _.min(ds);
                                var maxV = _.max(ds);
                                if (res.TIRLIMITTAG === "MAX") {
                                    if (minV >= 0) {
                                        object.min = 0;
                                    } else {
                                        object.min = -100;
                                    }
                                    if (maxV <= 0) {
                                        object.max = 0;
                                    }
                                    else {
                                        object.max = 100;
                                    }
                                    object.interval = 20;
                                } else {
                                    if (minV >= 0) {
                                        object.min = 0;
                                    } else {
                                        object.min = -20;
                                    }
                                    if (maxV <= 0) {
                                        object.max = 0;
                                    }
                                    else {
                                        object.max = 20;
                                    }
                                    object.interval = 4;
                                }
                            }
                        }
                    }
                    yAxis.push(object);
                }
                var ys = [];

                var resLgs = [];


                if(sessionStorage.misc == 1){

                    resLgs = ["冷量(KW)", "冷机功率(KW)", "散热量(KW)", "热不平衡率(%)"]

                }else if(sessionStorage.misc == 2){

                    resLgs = ["冷量(RT)", "冷机功率(KW)", "散热量(RT)", "热不平衡率(%)"]

                }

                for (var i = 0; i < res.ys.length; i++) {
                    var object = {};
                    object.name = resLgs[i];
                    object.type = "line";
                    if (i == res.ys.length - 1) {
                        object.yAxisIndex = 1;
                    }
                    object.data = [];
                    for (var j = 0; j < res.ys[i].length ; j++) {
                        object.data.push(res.ys[i][j]);
                    }
                    ys.push(object);
                }
                option = {
                    color: colors,
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: resLgs
                    },
                    xAxis: xs,
                    yAxis: yAxis,
                    series: ys
                };
                myTIRLineMain.setOption(option, true);
            }else if(res.code===-1){
                console.log('异常错误(实时热不平衡曲线):' + res.msg);



            }else {

            }
        })
    }

    //切换实时数据曲线
    var changeTab=function () {
        $('.mytab').click(function () {
            var tabW = 0;
            if ($('.tab-pane').hasClass('active')) {
                var tabW = $('.tab-pane').width();
            }
            $('#eerLineMain').width(tabW);
            $('#powerLineMain').width(tabW);
            $('#therequiLineMain').width(tabW);
            if (myEERLineMain || myPowerLineMain || myTIRLineMain) {
                myEERLineMain.resize();
                myPowerLineMain.resize();
                myTIRLineMain.resize();
            }
        });
    }

    //实时热不平衡率数据
    var initTIRData= function () {
        jQuery('#ubrvBusy').showLoading();
        var url = sessionStorage.apiUrlPrefix + "Main/GetUBRVNowData";
        $.post(url,{
            pId:sessionStorage.PointerID,
            SysrealDt:encodeURIComponent(sessionStorage.sysDt),
            misc:sessionStorage.misc
        },function (res) {
            if(res.code === 0){
                var ubrv = parseFloat(res.ubrVa);
                if (ubrv === 0) {
                    $('#lzbphlv').html(ubrv);
                }
                else if (ubrv >= 30 || ubrv <= -30) {
                    $('#lzbphlv').html('--');
                }
                else {
                    //热平衡率小数位数是2位
                    $('#lzbphlv').html(ubrv.toFixed(2));
                }
                if (ubrv === 0) {
                    $("#nbrvSp")[0].style.color = "#000000";//默认黑色
                }
                if (ubrv <= 5 && ubrv > 0) {
                    $("#nbrvSp")[0].style.color = "#1af253";//绿色
                }
                else if (ubrv > 5 && ubrv < 30) {
                    $("#nbrvSp")[0].style.color = "#f59c10";//黄色
                }
                else {
                    $("#nbrvSp")[0].style.color = "#000000";//默认黑色
                }
                jQuery('#ubrvBusy').hideLoading();
            }else if(res.code === -1){
                console.log('异常错误(实时热不平衡率数据):' + res.msg );
                jQuery('#ubrvBusy').hideLoading();
            }else{
                jQuery('#ubrvBusy').hideLoading();
            }
        })
    }

    //实时电价冷量数据
    var initElePriceColdData= function () {
        var url = sessionStorage.apiUrlPrefix + "Main/GetElePriceColdNowDs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            SysrealDt:encodeURIComponent(sessionStorage.sysDt),
            misc:sessionStorage.misc
        },function (res) {
            if(res.code === 0){
                //$('#spanEPrice_Misc').html('KWH');
                var epv = parseFloat(res.ePrCoVa).toFixed(4);
                $('#spanEPrice').html(epv);
            }else if(res.code === -1){
                console.log('异常错误(实时冷量单价数据):' + res.msg);
            }else{

            }
        })
    }

    //日周月年能效对比
    var initEAnMoDs = function () {
        jQuery('#eAnMonBusy').showLoading();
        var url = sessionStorage.apiUrlPrefix + "Main/GetEAnMonNowDs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            SysrealDt:encodeURIComponent(sessionStorage.sysDt),
            misc:sessionStorage.misc
        },function (res) {
            if(res.code === 0){
                var dm = res.dm;//日
                $('#spanAnM_day').attr('tag_dt', dm.ysDT + "," + dm.tyDT);
                $('#spanAnM_day').attr('tag_dtx', "上日能效,本日能效");
                $('#spanAnM_day').attr('tag_dty', dm.eiType);
                init_eAnMoNow_DM(dm);
                var wm = res.wm;//周
                $('#spanAnM_week').attr('tag_dt', wm.ysDT + "," + wm.tyDT);
                $('#spanAnM_week').attr('tag_dtx', "上周能效,本周能效");
                $('#spanAnM_week').attr('tag_dty', wm.eiType);
                init_eAnMoNow_WM(wm);
                var mm = res.mm;//月
                $('#spanAnM_month').attr('tag_dt', mm.ysDT + "," + mm.tyDT);
                $('#spanAnM_month').attr('tag_dtx', "上月能效,本月能效");
                $('#spanAnM_month').attr('tag_dty', mm.eiType);
                init_eAnMoNow_MM(mm);
                var ym = res.ym;//年
                $('#spanAnM_year').attr('tag_dt', ym.ysDT + "," + ym.tyDT);
                $('#spanAnM_year').attr('tag_dtx', "去年能效,本年能效");
                $('#spanAnM_year').attr('tag_dty', ym.eiType);
                init_eAnMoNow_YM(ym);
                jQuery('#eAnMonBusy').hideLoading();
            }else if(res.code === -1){
                console.log('异常错误(能效对比):' + res.msg);
                jQuery('#eAnMonBusy').hideLoading();
            }else{
                jQuery('#eAnMonBusy').hideLoading();
            }
        })
    }

    function init_eAnMoNow_DM(dm) {
        var obj_rtd = {};/*今日*/
        obj_rtd.dts = dm.tyDT;
        obj_rtd.eiType = dm.eiType;
        $('#jrdt').data(obj_rtd);
        var obj_ryd = {};/*昨日*/
        obj_ryd.dts = dm.ysDT;
        obj_ryd.eiType = dm.eiType;
        $('#zrdt').data(obj_ryd);
        $('#yseV').html(dm.ysV);
        $('#tyeV').html(dm.tyV);
        $('#daymV').html(dm.monV);

        if (dm.momE === 0)//N
        {
            $("#day-circle").attr('src', 'img/arrowNormal.png');
        }
        else if (dm.momE === 1)//T
        {
            $("#day-circle").attr('src', 'img/arrowTop.png');
        }
        else if (dm.momE === 2)//B
        {
            $("#day-circle").attr('src', 'img/arrowDown.png');
        }
    }

    function init_eAnMoNow_WM(wm) {
        var obj_wtd = {};/*本周*/
        obj_wtd.dts = wm.tyDT;
        obj_wtd.eiType = wm.eiType;
        $('#bwdt').data(obj_wtd);
        var obj_wyd = {};/*上周*/
        obj_wyd.dts = wm.ysDT;
        obj_wyd.eiType = wm.eiType;
        $('#swdt').data(obj_wyd);
        /*上周能效值*/
        $('#yweV').html(wm.ysV);
        /*本周能效值*/
        $('#tweV').html(wm.tyV);
        $('#weekmV').html(wm.monV);
        if (wm.momE === 0)//N
        {
            $("#week-circle").attr('src', 'img/arrowNormal.png');
        }
        else if (wm.momE === 1)//T
        {
            $("#week-circle").attr('src', 'img/arrowTop.png');
        }
        else if (wm.momE === 2)//B
        {
            $("#week-circle").attr('src', 'img/arrowDown.png');
        }
    }

    function init_eAnMoNow_MM(mm) {
        var obj_mtd = {};/*本月*/
        obj_mtd.dts = mm.tyDT;
        obj_mtd.eiType = mm.eiType;
        $('#bmdt').data(obj_mtd);
        var obj_myd = {};/*上月*/
        obj_myd.dts = mm.ysDT;
        obj_myd.eiType = mm.eiType;
        $('#smdt').data(obj_myd);
        /*上月能效值*/
        $('#ymeV').html(mm.ysV);
        /*本月能效值*/
        $('#tmeV').html(mm.tyV);
        $('#monthmV').html(mm.monV);
        if (mm.momE === 0)//N
        {
            $("#month-circle").attr('src', 'img/arrowNormal.png');
        }
        else if (mm.momE === 1)//T
        {
            $("#month-circle").attr('src', 'img/arrowTop.png');
        }
        else if (mm.momE === 2)//B
        {
            $("#month-circle").attr('src', 'img/arrowDown.png');
        }
    }

    function init_eAnMoNow_YM(ym) {
        var obj_ytd = {};/*本年*/
        obj_ytd.dts = ym.tyDT;
        obj_ytd.eiType = ym.eiType;
        $('#bydt').data(obj_ytd);
        var obj_yyd = {};/*去年*/
        obj_yyd.dts = ym.ysDT;
        obj_yyd.eiType = ym.eiType;
        $('#sydt').data(obj_yyd);
        /*去年能效值*/
        $('#yyeV').html(ym.ysV);
        /*本年能效值*/
        $('#lyeV').html(ym.tyV);
        $('#yearmV').html(ym.monV);
        if (ym.momE === 0)//N
        {
            $("#year-circle").attr('src', 'img/arrowNormal.png');
        }
        else if (ym.momE === 1)//T
        {
            $("#year-circle").attr('src', 'img/arrowTop.png');
        }
        else if (ym.momE === 2)//B
        {
            $("#year-circle").attr('src', 'img/arrowDown.png');
        }
    }

    //查看日周月年能效对比(多时间)历史数据
    var initEAnMoHistorypreDs = function () {
        $('.spanAnM').on('click', function () {
            var sAn = $(this);
            var dts = sAn.attr('tag_dt');/*时间段。用逗号隔开*/
            var title = "[" + sAn.html() + "]" + "能效对比历史曲线";
            var lgs = sAn.attr('tag_dtx');/*时间段对应的图例*/
            var eiType = sAn.attr('tag_dty');/*查看类型：日、周、月、年*/
            $('#myModalLabel_eAn').html(title);
            $('#MYEANHISTORYMODAL').modal('show');
            myeAnhsCV = echarts.init(document.getElementById('eAnhistoryMain'));
            myeAnhsCV.showLoading({
                text: '获取数据获取中',
                effect: 'whirling'
            });
            var url = sessionStorage.apiUrlPrefix + "Main/GetEAnMonHistorypreDs";
            $.post(url,{
                pId:sessionStorage.PointerID,
                preDTs:dts,
                eiType:eiType,
                prelgs:lgs,
                misc:sessionStorage.misc
            },function (res) {
                if (res.xs === null) {
                    myeAnhsCV.hideLoading();
                }
                else {
                    var o_lgs = res.prelgsList;
                    var o_xs = res.xs;
                    var o_ys = res.dvs;
                    var lgs = [];
                    for (var i = 0; i < o_lgs.length; i++) {
                        lgs.push(o_lgs[i]);
                    }
                    var xAs = [];
                    for (var i = 0; i < o_xs.length; i++) {
                        xAs.push(o_xs[i]);
                    }
                    var dys = [];
                    for (var i = 0; i < o_ys.length; i++) {
                        var obj = {};
                        obj.name = lgs[i];
                        obj.type = "line";
                        obj.data = [];
                        for (var j = 0; j < o_ys[i].length; j++) {
                            obj.data.push(o_ys[i][j]);
                        }
                        dys.push(obj);
                    }
                    option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: lgs
                        },
                        toolbox: {
                            show: true,
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            axisLabel: {
                                rotate: 0,
                                margin: 20,
                                textStyle: {
                                    color: "#222"
                                }
                            },
                            data: xAs
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: dys
                    };
                    myeAnhsCV.setOption(option, true);
                    myeAnhsCV.hideLoading();
                }
            });
        });
    }

    //查看日周月年能效对比(单时间)历史数据
    var initEAnMoNistorysglDs = function () {
        /*能效对比历史数据查看*/
        $('.mopenhistoryds').on('click', function () {
            var op = $(this);
            var perDTs = op.data('dts');
            var eiType = op.data('eiType');
            var title = op.find('span').html();
            $('#myModalLabel').html(title + '历史曲线');
            $('#MYHISTORYMODAL').modal('show');
            eAnMoHistorysglDs(perDTs, eiType);
        });
    }

    /*能效对比历史数据*/
    function eAnMoHistorysglDs(perDTs, eiType) {
        myAnhsCV = echarts.init(document.getElementById('AnhistoryMain'));
        myAnhsCV.showLoading({
            text: '获取数据获取中',
            effect: 'whirling'
        });
        var url = sessionStorage.apiUrlPrefix + "Main/GetEAnMonHistorysglDs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            perDTs:perDTs,
            eiType:eiType,
            misc:sessionStorage.misc
        },function (res) {
            if(res.code === 0){
                if(res.xs.length === 0){
                    myAnhsCV.hideLoading();
                }else{
                    var xAs = [];
                    for (var i = 0; i < res.xs.length; i++) {
                        xAs.push(res.xs[i]);
                    }
                    var ys = [];
                    for (var i = 0; i < 1; i++) {
                        var object = {};
                        object.name = "能效";
                        object.type = "line";
                        object.data = [];
                        for (var j = 0; j < res.ys[i].length; j++) {
                            var ysV = res.ys[i][j];
                            object.data.push(ysV);
                        }
                        ys.push(object);
                    }
                    option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            //data: ['能效']
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            axisLabel: {
                                rotate: 0,
                                margin: 20,
                                textStyle: {
                                    color: "#222"
                                }
                            },
                            data: xAs
                        },
                        yAxis: {
                            type: 'value',
                        },
                        series: ys
                    };
                    myAnhsCV.setOption(option, true);
                    myAnhsCV.hideLoading();
                }
            }else if(res.code === -1){
                console.log('异常错误(能效对比单时间段历史数据):' + res.msg);
                myAnhsCV.hideLoading();
            }else{
                myAnhsCV.hideLoading();
            }
        })
    }

    //标况表格
    var COPBK = function(){

        //列
        var col = [

            {
                title:'时间',
                data:'dt'

            },
            {
                title:'机房总功率（KW）',
                data:'jfzgl'
            },
            {
                title:'冷冻供水温度(℃)',
                data:'ldgswd'
            },
            {
                title:'冷冻回水温度(℃)',
                data:'ldhswd'
            },
            {
                title:'瞬时流量/(m³/h)',
                data:'ssll'
            },
            {
                title:'冷却供水温度(℃)',
                data:'lqgswd'
            },
            {
                title:'冷却回水温度(℃)',
                data:'lqhswd'
            },
            {
                title:'主机平均负载',
                data:'zjpjfz'
            },
            {
                title:'制冷量',
                data:'zll'
            },
            {
                title:'实测COP（KW/RT）',
                data:'sccop'
            },
            {
                title:'标况COP',
                data:'bkcop'
            }

        ]

        if(sessionStorage.misc == 1){

            col[9].title = '实测COP（KW/KW）'

        }else if(sessionStorage.misc == 2){

            col[9].title = '实测COP（KW/RT）'

        }

        //表格初始化
        _tableInit($('#table'),col,2,false,'','',true,'','','');

        //发送数据
        $.ajax({

            type:'post',

            url:_urls + 'Main/GetNowCTypeIDs',

            timeout:_theTimes,

            data:{

                //楼宇id
                pId:sessionStorage.PointerID,
                //实时时间
                SysrealDt:encodeURIComponent(sessionStorage.sysDt),
                //单位
                misc:sessionStorage.misc
            },

            beforeSend:function(){

                $('#tableBK').showLoading();

            },

            complete:function(){

                $('#tableBK').hideLoading();

            },

            success:function(res){

                if(res.code == 0){

                    _jumpNow($('#table'),res);

                }else if(res.code == -1){

                    console.log('异常错误(折标能效):' + res.msg);

                }


            },

            error:function(XMLHttpRequest, textStatus, errorThrown){

                console.log('异常错误(折标能效):' + textStatus  );

            }


        })

    }

    //显示折标
    function showBK(){

        //标况表格
        COPBK();
        //整体能效中的显示
        $('.GBEE').show();
        //分项实时能效的显示
        //样式
        $('.cold-dev').children().eq(1).children().show().css({'height':'23px'})

        //实时能效曲线
        initNOWEERCharView();

        //能效对比隐藏
        $('#eAnMonBusy').hide();

        //折标能效显示
        $('#tableBK').show();

    }

    //不显示折标
    function hideBK(){

        //不显示折标能效
        //日周月年能效对比
        initEAnMoDs();

        //查看日周月年能效对比(多时间)历史数据
        initEAnMoHistorypreDs();

        //查看日周月年能效对比(单时间)历史数据
        initEAnMoNistorysglDs();

        //整体能效中的不显示
        $('.GBEE').hide();

        //分项实时能效的不现实
        $('.cold-dev').children().eq(1).children().show().css({'height':'40px'})

        $('.cold-dev').children().eq(1).children().eq(1).hide();

        //能效曲线
        initNOWEERCharView1();

        //能效对比显示
        $('#eAnMonBusy').show();

        //折标能效隐藏
        $('#tableBK').hide();

    }

    //整体刷新
    //function

    return {
        init: function () {

            var eerVa=0.0;
            //切换实时数据曲线
            changeTab();
            //能效区间表盘
            initEERArea(eerVa,0,3);
            //实时ECP能效冷量功率数据
            initNOWECP();

            //实时功率曲线
            initNOEWPowerChartView();
            //实时热不平衡曲线
            initTIRChartView();
            //实时热不平衡率数据
            initTIRData();
            //实时电价冷量数据
            initElePriceColdData();

            //显示折标能效

            var flagZB = false;

            //判断session中的PointerID是否在steps数组中
            if(sessionStorage.steps.indexOf(sessionStorage.PointerID)>0){

                flagZB = true;

            }else{

                flagZB = false;

            }


            if(flagZB){

                //显示折标

                sessionStorage.showstep = 1;

                showBK();

            }else if(!flagZB ){

                sessionStorage.showstep = 0;

                hideBK();

            }

            //十分钟自动刷新
            setInterval(function(){

                var eerVa=0.0;
                //切换实时数据曲线
                changeTab();
                //能效区间表盘
                initEERArea(eerVa,0,3);
                //实时ECP能效冷量功率数据
                initNOWECP();

                //实时功率曲线
                initNOEWPowerChartView();
                //实时热不平衡曲线
                initTIRChartView();
                //实时热不平衡率数据
                initTIRData();
                //实时电价冷量数据
                initElePriceColdData();

                //显示折标能效
                if(flagZB){

                    showBK();


                }else if(!flagZB){


                    hideBK();

                }

            },1000*60*10);


        }
    }

}();