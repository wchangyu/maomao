$(function(){

    //当前楼宇ID
    var curPointerIDArr = ['3101800201'];

    /*-----------------------------------------echarts----------------------------------------*/

    var ringChartL = echarts.init(document.getElementById('responseGD'));

    var ringChartR = echarts.init(document.getElementById('distributionGD'));

    //定义开始结束时间
    var startDate = moment().format('YYYY-MM-DD');

    var endDate = moment().add('1','days').format('YYYY-MM-DD');

    //右侧运维联动
    var optionRing = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
            show:false
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : ['30%', '50%'],
                center: ['50%', '50%'],
                label: {
                    normal: {
                        formatter: '{c|{c}}\n{hr|}\n{b|{b}}',
                        rich: {
                            hr: {
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                fontSize: 10,
                                lineHeight: 20,
                                color: '#ffffff'
                            },
                            c:{
                                fontSize: 10,
                                color: '#ffffff'
                            }
                        }
                    }
                },
                data:[
                    {value:225, name:'已完成',label:{padding:[10,0,0,-20]}},
                    {value:236, name:'派单中',label:{padding:[0,0,0,-20]}},
                    {value:220, name:'进行中',label:{padding:[0,-10,0,-10]}},
                ],
                itemStyle: {
                    normal: {
                        color: function(params) {

                            var colorList = [
                                '#14e398','#ead01e','#f8276c'
                            ];
                            return colorList[params.dataIndex]
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    var optionRing1 = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
            show:false
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : ['30%', '50%'],
                center: ['50%', '50%'],
                label: {
                    normal: {
                        formatter: '{c|{c}}\n{hr|}\n{b|{b}}',
                        rich: {
                            hr: {
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                fontSize: 10,
                                lineHeight: 20,
                                color: '#ffffff',
                            },
                            c:{
                                fontSize: 10,
                                color: '#ffffff',
                            }

                        }
                    }
                },
                data:[
                    {value:225, name:'设备设施',label:{padding:[10,0,0,-20]}},
                    {value:236, name:'照明',label:{padding:[0,0,0,-20]}},
                    {value:220, name:'暖通空调',label:{padding:[0,-10,0,-10]}},
                ],
                itemStyle: {
                    normal: {
                        color: function(params) {

                            var colorList = [
                                '#0d9dcb', '#0cd34c','#cfcf14', '#d36e12', '#dc2612','#b70723', '#7c05cb', '#1c39d9','#f8276c'
                            ];
                            return colorList[params.dataIndex]
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    //ringChartL.setOption(optionRing);

    //ringChartR.setOption(optionRing1);

    //定义计算安全运行天数的开始日期
    var startSafeDate = new Date('2017/01/01 12:00');

    var date2 = new Date();

    var s1 = startSafeDate.getTime(),s2 = date2.getTime();

    var total = (s2 - s1)/1000;

    var safeDays = parseInt(total / (24*60*60));//计算整数天数

    //给页面中赋值
    $('.two-bottom-block  p span').html(safeDays);

    //时间
    setInterval(function(){

        var momentTime = moment().format('YYYY-MM-DD hh:mm:ss');

        $('.data-header').html(momentTime);

    },1000);

    //是否传过来地址
    var postUrl = '';

    postUrl = window.location.search; //??sendUrl=EPMA/main.html


    //配置项是否配置
    var configureUrl = "../" + sessionStorage.getItem("indexUrl");


    /*-----------------------------------------获取菜单-----------------------------------------*/

    //读菜单
    var menuObj = JSON.parse(sessionStorage.getItem('curMenuStr'));

    getMenu(menuObj);

    function getMenu(result){

        //父目录字符串
        var str = '';

        //子目录字符串
        var secStr = '';

        //记录父目录的index
        var index = -1;

        //记录子目录的index

        var secIndex = -1;

        //路径赋值
        var srcPath = '';

        for(var i in result ){

            if(typeof result[i]  == 'object'){

                //首先生成第一层目录
                str += '<li><img src="' + 'img/' + result[i]['icon-img'] + '"><p>' + result[i].content + '</p></li>';


            }

        }

        $('.first-menu ul').empty().append(str);

        //根据生成的第一层目录确定第二层目录

        //判断跳转项？配置项？默认项？
        //跳转项
        if(postUrl){

            var srcParhs = postUrl.split('=')[1];

            for(var i in result){

                var currentFirst = $('.first-menu ul').children('li');

                for(var j in result[i]['submenu']){

                    if( typeof result[i]['submenu'][j]['uri'] == 'string'){

                        if( result[i]['submenu'][j].uri.indexOf(srcParhs) >= 0 ){

                            for(var k= 0;k<currentFirst.length;k++){

                                if( i == currentFirst.eq(k).children('p').html() ){

                                    //添加类
                                    currentFirst.eq(k).addClass('selectedMenu');

                                    var imgSrc = 'img/' + result[i]['icon-hover'];

                                    //图片
                                    currentFirst.eq(k).children('img').attr('src',imgSrc);

                                    //生成第二菜单

                                    var secMenu = '';

                                    for(var x in result[i]['submenu']){

                                        if(result[i]['submenu'][x].type == 2){

                                            secMenu += '<li class="sec-hover">' + result[i]['submenu'][x].content + '</li>'

                                        }else{

                                            if(result[i]['submenu'][x].uri.indexOf(srcParhs)>=0 ){

                                                secMenu += '<li class="ordinary-menu current-hover" data-attr="' + result[i]['submenu'][x].uri + '">' + result[i]['submenu'][x].content + '</li>'

                                            }else{

                                                secMenu += '<li class="ordinary-menu" data-attr="' + result[i]['submenu'][x].uri + '">' + result[i]['submenu'][x].content + '</li>'
                                            }

                                            srcPath = '../' + srcParhs;

                                            //跳转到指定页面
                                            //$('iframe').attr('src',srcPath);


                                        }

                                    }

                                    $('.second-menu ul').empty().append(secMenu);


                                }

                            }


                        }

                    }


                }

            }

        //配置项
        }else if(configureUrl){

           if(configureUrl.indexOf("njn-dapingzhanshi") > -1){

               window.location.href = configureUrl;

           }

            for(var i in result){

                var currentFirst = $('.first-menu ul').children('li');

                for(var j in result[i]['submenu']){

                    if( typeof result[i]['submenu'][j]['uri'] == 'string'){

                        if( result[i]['submenu'][j].uri.indexOf(configureUrl) >= 0 ){

                            for(var k= 0;k<currentFirst.length;k++){

                                if( i == currentFirst.eq(k).children('p').html() ){

                                    //添加类
                                    currentFirst.eq(k).addClass('selectedMenu');

                                    var imgSrc = 'img/' + result[i]['icon-hover'];

                                    //图片
                                    currentFirst.eq(k).children('img').attr('src',imgSrc);

                                    //生成第二菜单

                                    var secMenu = '';

                                    for(var x in result[i]['submenu']){

                                        if(result[i]['submenu'][x].type == 2){

                                            secMenu += '<li class="sec-hover">' + result[i]['submenu'][x].content + '</li>'

                                        }else{

                                            if(result[i]['submenu'][x].uri.indexOf(configureUrl)>=0 ){

                                                secMenu += '<li class="ordinary-menu current-hover" data-attr="' + result[i]['submenu'][x].uri + '">' + result[i]['submenu'][x].content + '</li>'

                                            }else{

                                                secMenu += '<li class="ordinary-menu" data-attr="' + result[i]['submenu'][x].uri + '">' + result[i]['submenu'][x].content + '</li>'
                                            }

                                            srcPath = configureUrl;

                                            //跳转到指定页面
                                            //$('iframe').attr('src',srcPath);


                                        }

                                    }

                                    $('.second-menu ul').empty().append(secMenu);


                                }

                            }


                        }

                    }


                }

            }

        //默认项
        }else{

            for(var i in result){

                if(typeof result[i]  == 'object'){

                    //第一层样式修改
                    $('.first-menu ul').children('li').eq(0).addClass('selectedMenu');

                    //图片修改
                    if(i == $('.first-menu ul').children('li').eq(0).children('p').html()){

                        var imgPath = 'img/' + result[i]['icon-hover'];

                        $('.first-menu ul').children('li').eq(0).children('img').attr('src',imgPath);

                        //加载第二层目录
                        var secMenu = '';

                        for(var x in result[i]['submenu']){

                            if(result[i]['submenu'][x].type == 2){

                                secMenu += '<li class="sec-hover">' + result[i]['submenu'][x].content + '</li>'

                            }else{

                                secIndex ++;

                                if(secIndex == 0){

                                    secMenu += '<li class="ordinary-menu current-hover" data-attr="' + result[i]['submenu'][x].uri + '">' + result[i]['submenu'][x].content + '</li>'

                                    srcPath = result[i]['submenu'][x]['uri'];

                                    //$('iframe').attr('src',secPath);

                                }else{

                                    secMenu += '<li class="ordinary-menu" data-attr="' + result[i]['submenu'][x].uri + '">' + result[i]['submenu'][x].content + '</li>'

                                }

                            }

                        }

                        $('.second-menu ul').empty().append(secMenu);

                    }


                }

            }

        }

        $('iframe').attr('src',srcPath);

    }

    /*----------------------------------------菜单点击事件---------------------------------------*/

    $('.second-menu ul').on('click','.ordinary-menu',function(){

        $('.ordinary-menu').removeClass('current-hover');

        $(this).addClass('current-hover');

        var srcPath = $(this).attr('data-attr');

        //如果是大屏页面 则直接跳转
        if(srcPath.indexOf('njn-dapingzhanshi') > -1){

            window.location.href = srcPath;
        }

        $('iframe').attr('src',srcPath);

    });

    $('.first-menu ul').on('click','li',function(){

        $(this).parent('ul').children().removeClass('selectedMenu');

        $(this).addClass('selectedMenu');

        var thisAttr = $(this).children('p').html();

        var index = -1;

        for(var i in menuObj){

            if(typeof menuObj[i] == 'object'){

                index ++ ;

                $('.first-menu ul').children('li').children('img').eq(index).attr('src','img/' + menuObj[i]['icon-img']);

            }

        }

        $(this).children('img').attr('src','img/' + menuObj[thisAttr]['icon-hover']);

        //二级菜单联动

        var secMenu = '';

        for(var i in menuObj[thisAttr]['submenu']){

            if(menuObj[thisAttr]['submenu'][i].type == 2){

                secMenu += '<li class="sec-hover">' + menuObj[thisAttr]['submenu'][i].content + '</li>'

            }else{

                secMenu += '<li class="ordinary-menu" data-attr="' + menuObj[thisAttr]['submenu'][i].uri + '">' + menuObj[thisAttr]['submenu'][i].content + '</li>'

            }

        }

        $('.second-menu ul').empty().append(secMenu);

    });

    //点击页面右侧下方图标切换不同系统
    $('.three-block').on('click','div',function(){

        //获取要跳转的地址
        var jumpUrl = $(this).attr('data-url');

        window.location.href = jumpUrl;
    });

    /*--------------------------------------温度湿度--------------------------------------------*/

    var pointerID = JSON.parse(sessionStorage.getItem('pointers'));

    $.ajax({

        type:'post',
        url:_urls + 'EnergyTopPageV2/GetWeatherByPointer',
        data:{
            '':pointerID[0].pointerID
        },
        success:function(result){

            var temperatureData = (result.temperatureData == '')?'':result.temperatureData + '℃';

            var humidityData = (result.humidityData == '')?'':result.humidityData + '%';

            //温度
            $('.temperature-header').children('span').html(temperatureData);

            //湿度
            $('.humidity-header').children('span').html(humidityData);

        },
        error:function(){

            //温度
            $('.temperature-header').children('span').html('');

            //湿度
            $('.humidity-header').children('span').html('');

        }

    });

    getDeployByUser();

    //获取运维工单中的工单响应数据
    function getGDRespondInfo(){

        return false;


        //传递给后台的参数
        var  ecParams = {
            "gdSt": startDate,
            "gdEt": endDate,
            "gdSrc": 0, //dSrc=10为江苏运联工单
            "userID": _userIdNum,
            "userName": _userIdName,
            "b_UserRole": _userRole,
            "b_DepartNum": _userBM
        };

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDGetGDRespondInfo',

            data:ecParams,
            timeout:_theTimes,
            beforeSend:function(){

               ringChartL.showLoading({
                    maskColor: 'rgba(33,43,55,0.8)'
                });
            },
            success:function(result){

               ringChartL.hideLoading();

                if(!result.gdStat){

                    //给echart重新赋值

                    optionRing.series[0].data = [];

                    //重绘chart图
                   ringChartL.setOption(optionRing);

                    $('.total-order').html(0);

                    return false;

                }

                //工单响应数据
                //进行中
                var runningNum = result.gdStat.gdInProgress;

                //派单中
                var dispatchNum = result.gdStat.gdAssign;

                //已完成
                var completeNum = result.gdStat.gdFinished;

                //总数
                var totalNum = runningNum + dispatchNum + completeNum;

                var dataArr = [
                    {
                        name:'已完成',
                        value:completeNum,
                        label:{padding:[10,0,0,-20]}
                    },
                    {
                        name:'派单中',
                        value:dispatchNum,
                        label:{padding:[0,0,0,-20]}
                    },
                    {
                        name:'进行中',
                        value:runningNum,
                        label:{padding:[0,-10,0,-10]}
                    }
                ];

                ringChartL.setOption(optionRing);

                //给echart重新赋值

                optionRing.series[0].data = dataArr;

                $('.total-order').html(totalNum);

                //重绘chart图
                ringChartL.setOption(optionRing,true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

               ringChartL.hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

                }

            }

        })
    };

    //获取运维工单中的工单分布
    function getGDRespondInfo1(){

        //传递给后台的参数
        var  ecParams = {
            "gdSt": startDate,
            "gdEt": endDate,
            "gdSrc": 0, //dSrc=10为江苏运联工单
            "userID": _userIdNum,
            "userName": _userIdName,
            "b_UserRole": _userRole,
            "b_DepartNum": _userBM
        };

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDGetGDRespondInfo',

            data:ecParams,
            timeout:_theTimes,
            beforeSend:function(){

                ringChartR.showLoading({
                    maskColor: 'rgba(33,43,55,0.8)'
                });

            },
            success:function(result){

                ringChartR.hideLoading();

                //console.log(result);

                if(!result.gdDevInfos || result.gdDevInfos.length == 0){

                    //给echart重新赋值
                    $('.total-order1').html(0);

                    optionRing1.series[0].data = [];

                    //重绘chart图
                    ringChartR.setOption(optionRing1);

                    return false;
                }

                var dataArr = [];

                var totalNum = 0;

                $(result.gdDevInfos).each(function(i,o){

                    var obj = {

                        name: o.dsName,
                        value: o.gdCnt

                    };

                    totalNum += o.gdCnt;

                    dataArr.push(obj);

                });

                //给echart重新赋值
                $('.total-order1').html(totalNum);

                optionRing1.series[0].data = dataArr;

                //重绘chart图
                ringChartR.setOption(optionRing1);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                ringChartR.hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

                }

            }

        })
    };

    //从后台获取用户配置的数据
    function getDeployByUser(){

        //curPointerIDArr= ['5190180101'];

        $.ajax({

            type:'get',

            url:_urls + 'NJNDeviceShow/GetNJNConfigToFile',

            data:{

                pointerID:curPointerIDArr[0]
            },
            timeout:_theTimes,
            beforeSend:function(){


            },
            success:function(result){

                var result1;

                var mainSwitch =0;

                if(result != ''){

                    result1 = JSON.parse(result);

                    //首先判断整体控制开关是否开启
                    mainSwitch  = result1.switch;

                }


                //获取本地配置
                var bigScreenSet = sessionStorage.getItem('bigScreenSet');

                //整体控制开关关闭
                if(mainSwitch == 0 || bigScreenSet == 0){

                    //获取工单数据
                    getGDRespondInfo();

                    getGDRespondInfo1();

                }else{

                    //-----------------安全运行天数数据------------------//

                    //判断是否启用
                    if(result1.safeRunningDays.switch == 1){

                        //页面赋值
                        $('.safe-days').html(result1.safeRunningDays.dayNum);

                    }

                    //-----------------节能减排数据------------------//
                    //判断是否启用
                    if(result1.energyConservation.switch == 1){

                        //页面赋值

                        //电
                        $('.right-bottom-centent-data0 .bottom-data font').html(result1.energyConservation.electricSave);

                        //水
                        $('.right-bottom-centent-data1 .bottom-data font').html(result1.energyConservation.waterSave);

                        //汽
                        $('.right-bottom-centent-data2 .bottom-data font').html(result1.energyConservation.steamSave);

                        //减排
                        $('.right-bottom-centent-data3 .bottom-data font').html(result1.energyConservation.emissionReduction);

                    }

                    //-----------------工单响应数据------------------//

                    //判断是否启用
                    if(result1.perationMaintenance.switch == 1){

                        //进行中
                        var runningNum = result1.perationMaintenance.responseGD.running;

                        //派单中
                        var dispatchNum = result1.perationMaintenance.responseGD.dispatch;

                        //已完成
                        var completeNum = result1.perationMaintenance.responseGD.complete;

                        //总数
                        var totalNum = runningNum + dispatchNum + completeNum;

                        var dataArr = [
                            {
                                name:'已完成',
                                value:completeNum
                            },
                            {
                                name:'派单中',
                                value:dispatchNum
                            },
                            {
                                name:'进行中',
                                value:runningNum
                            }
                        ];

                        //给echart重新赋值
                        ringChartL.setOption(optionRing);

                        //给echart重新赋值

                        optionRing.series[0].data = dataArr;

                        $('.total-order').html(totalNum);

                        //重绘chart图
                        ringChartL.setOption(optionRing,true);

                    }else{

                        //从后台获取数据
                        getGDRespondInfo();

                        //从后台获取数据
                        getGDRespondInfo1();
                    }

                    //-----------------工单分布数据------------------//

                    //判断是否启用
                    if(result1.perationMaintenance.switch == 1){

                        //暖通系统
                        var hvacAirsOBJNum = result1.perationMaintenance.distributionGD.hvacAirsOBJ;

                        //照明系统
                        var lightSysOBJNum = result1.perationMaintenance.distributionGD.lightSysOBJ;

                        //电梯系统
                        var elevatorSysOBJ = result1.perationMaintenance.distributionGD.elevatorSysOBJ;

                        //动环系统
                        var rotaryFaceSysOBJNum = result1.perationMaintenance.distributionGD.rotaryFaceSysOBJ;

                        //给排水
                        var sendDrainWaterOBJNum = result1.perationMaintenance.distributionGD.sendDrainWaterOBJ;

                        //消防系统
                        var fireControlSysOBJ = result1.perationMaintenance.distributionGD.fireControlSysOBJ;

                        //自动售检票
                        var sellCheckTicketOBJNum = result1.perationMaintenance.distributionGD.sellCheckTicketOBJ;

                        //能源管理
                        var energyManagerOBJOBJ = result1.perationMaintenance.distributionGD.energyManagerOBJ;

                        //总数
                        var totalNum = hvacAirsOBJNum + lightSysOBJNum + elevatorSysOBJ + rotaryFaceSysOBJNum + sendDrainWaterOBJNum + fireControlSysOBJ + sellCheckTicketOBJNum +energyManagerOBJOBJ;

                        var dataArr = [
                            {
                                name:'暖通系统',
                                value:hvacAirsOBJNum
                            },
                            {
                                name:'照明系统',
                                value:lightSysOBJNum
                            },
                            {
                                name:'电梯系统',
                                value:elevatorSysOBJ
                            },
                            {
                                name:'动环系统',
                                value:rotaryFaceSysOBJNum
                            },
                            {
                                name:'给排水',
                                value:sendDrainWaterOBJNum
                            },
                            {
                                name:'消防系统',
                                value:fireControlSysOBJ
                            },
                            {
                                name:'自动售检票',
                                value:sellCheckTicketOBJNum
                            },
                            {
                                name:'能源管理',
                                value:energyManagerOBJOBJ
                            }
                        ];

                        //给echart重新赋值
                        $('.total-order1').html(totalNum);

                        optionRing1.series[0].data = dataArr;

                        //重绘chart图
                        ringChartR.setOption(optionRing1);
                    }

                };
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

                }

            }

        })
    };


    // 指定图表的配置项和数据 用于本日用能分项
    var option8 = {
        title: {
            text: '225',
            subtext: '工单量',
            //sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
            left: '242',
            top: '88',
            itemGap: -5,
            textBaseline:'middle',
            textStyle : {
                color : 'white',
                fontFamily : '微软雅黑',
                fontSize : 26,
                fontWeight : 'bolder',
                lineHeight:26
            },
            subtextStyle:{
                color:'white',
                fontSize : 16
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            y:'10px',
            data:['暖通空调','照明系统','电梯系统','动环系统','给排水','消防系统','售检票','能源管理'],
            textStyle:{
                color:'white'
            }

        },
        series: [
            {
                name:'',
                type:'pie',
                radius: ['50%', '65%'],
                center:['65%', '56%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
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
                                '#0d9dcb', '#0cd34c','#cfcf14', '#d36e12', '#dc2612','#b70723', '#7c05cb', '#1c39d9','#f8276c'
                            ];
                            return colorList[params.dataIndex]

                        },
                        label : {
                            show : false
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
                data:[
                    {
                        name:'暖通系统',
                        value:50
                    },
                    {
                        name:'照明系统',
                        value:45
                    },
                    {
                        name:'电梯系统',
                        value:35
                    },
                    {
                        name:'动环系统',
                        value:30
                    },
                    {
                        name:'给排水',
                        value:25
                    },
                    {
                        name:'消防系统',
                        value:20
                    },
                    {
                        name:'自动售检票',
                        value:10
                    },
                    {
                        name:'能源管理',
                        value:10
                    }
                ]
            }
        ]
    };

    getDevFaultAlarmPropData();

    //设备故障信息
    function getDevFaultAlarmPropData(){

        //传递给后台的参数
        var  ecParams = {
            "pointerID":curPointerIDArr[0],
            "startTime": startDate,
            "endTime": endDate
        };

        $.ajax({

            type:'post',
            url:_urls + 'NJNDeviceShow/GetDevFaultAlarmPropData',
            data:ecParams,
            timeout:_theTimes,
            beforeSend:function(){

                ringChartL.showLoading({
                    maskColor: 'rgba(33,43,55,0.8)'
                });
            },
            success:function(result){

                ringChartL.hideLoading();

                //console.log(result);

                var totalAlarmNum = 0;

                var alarmNumArr = [];

                //给页面赋值
                $(result).each(function(i,o){

                    if(o.faultNum == -1){

                        o.faultNum = 0;
                    }

                    var obj = {

                        name: o.devName,
                        value: o.faultNum

                    };

                    alarmNumArr.push(obj);

                    totalAlarmNum += o.faultNum;

                });

                //页面赋值
                option8.title.text = totalAlarmNum;
                option8.title.subtext = "报警数";
                option8.series[0].data = alarmNumArr;


                ringChartL.setOption(option8,true);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                setTimeout(function(){

                    $('#trouble-message .bottom-table-data-container ').hideLoading();

                },500);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

                }

            }

        })
    };

});
