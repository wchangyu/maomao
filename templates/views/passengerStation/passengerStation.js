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

    ringChartL.setOption(optionRing);

    ringChartR.setOption(optionRing);

    //时间
    setInterval(function(){

        var momentTime = moment().format('YYYY-MM-DD hh:mm:ss');

        $('.data-header').html(momentTime);

    },1000);

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

                index ++;

                if(index == 0){

                    str += '<li class="selectedMenu"><img src="' + 'img/' + result[i]['icon-hover'] + '"><p>' + result[i].content + '</p></li>'

                    for(var j in result[i].submenu){

                        secIndex ++;

                        if(secIndex == 0){

                            var src = result[i].submenu[j].uri + '';

                            $('iframe').attr('src',src);

                            secStr += '<li class="sec-hover" data-attr="' + result[i].submenu[j].uri + '">' + result[i].submenu[j].content + '</li>'

                        }else{

                            secStr += '<li data-attr="' + result[i].submenu[j].uri + '">' + result[i].submenu[j].content + '</li>'

                        }

                    }

                }else{

                    str += '<li><img src="' + 'img/' + result[i]['icon-img'] + '"><p>' + result[i].content + '</p></li>'

                }



            }

        }

        $('.first-menu ul').empty().append(str);

        $('.second-menu ul').empty().append(secStr);

    }

    /*----------------------------------------菜单点击事件---------------------------------------*/

    $('.second-menu ul').on('click','li',function(){

        $(this).parent('ul').children().removeClass('sec-hover');

        $(this).addClass('sec-hover');

        var srcPath = $(this).attr('data-attr');

        $('iframe').attr('src',srcPath);

    })

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

            secMenu += '<li data-attr="' + menuObj[thisAttr]['submenu'][i].uri + '">' + menuObj[thisAttr]['submenu'][i].content + '</li>'

        }

        $('.second-menu ul').empty().append(secMenu);

    })

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



})
