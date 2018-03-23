$(function(){

    /*-----------------------------------------echarts----------------------------------------*/

    var ringChartL = echarts.init(document.getElementById('responseGD'));

    var ringChartR = echarts.init(document.getElementById('distributionGD'));

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
                                fontSize: 14,
                                lineHeight: 33,
                                color: '#ffffff',
                            },
                            c:{
                                fontSize: 18,
                                color: '#ffffff',
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
                                fontSize: 14,
                                lineHeight: 33,
                                color: '#ffffff',
                            },
                            c:{
                                fontSize: 18,
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

    ringChartL.setOption(optionRing);

    ringChartR.setOption(optionRing1);

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

            //?sendUrl=EPMA/main.html

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

                                            var srcPath = '../' + srcParhs;

                                            //跳转到指定页面
                                            $('iframe').attr('src',srcPath);


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

                                            var srcPath = configureUrl;

                                            //跳转到指定页面
                                            $('iframe').attr('src',srcPath);


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

                                    var secPath = result[i]['submenu'][x]['uri'];

                                    $('iframe').attr('src',secPath);

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

        type:'get',
        url:_urls + 'EnergyTopPageV2/GetWeatherByPointer',
        data:{
            'pointerID':pointerID[0].pointerID
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

    })



});
