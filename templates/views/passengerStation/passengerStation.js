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

    //温湿度
    //$.ajax({
    //
    //    type:'get',
    //    url:_urls + 'EnergyTopPageV2/GetWeatherByPointer',
    //    success:function(result){
    //
    //        console.log(result);
    //
    //    }
    //
    //})

    /*-----------------------------------------获取菜单-----------------------------------------*/

    var menuObj = {};

    $.ajax({

        type:'get',
        url:'json/menu.json',
        success:function(result){

            if(result){

                menuObj = result;

                if(result.firstMenu){

                    var str = '';

                    var secStr = '';

                    //记录第一层目录的index
                    var index = -1;

                    //记录第二层目录的index

                    var secIndex = -1;

                    for(var i in result.firstMenu ){

                        index ++;

                        if(index == 0){

                            str += '<li class="selectedMenu"><img src="img/' + result.firstMenu[i]['icon-hover'] + '" alt=""><p>' + result.firstMenu[i]['content'] + '</p></li>';

                            for( var j in result.firstMenu[i]['submenu'] ){

                                secIndex ++ ;

                                if(secIndex == 0){

                                    var src = result.firstMenu[i]['submenu'][j]['uri'] + '?nest'

                                    $('iframe').attr('src',src);

                                    secStr += '<li class="sec-hover" data-attr="' + result.firstMenu[i]['submenu'][j]['uri'] + '?nest">' + result.firstMenu[i]['submenu'][j]['content'] + '</li>'

                                }else{

                                    secStr += '<li data-attr="' + result.firstMenu[i]['submenu'][j]['uri'] + '?nest">' + result.firstMenu[i]['submenu'][j]['content'] + '</li>'

                                }

                            }

                        }else{

                            str += '<li><img src="img/' + result.firstMenu[i]['icon-img'] + '" alt=""><p>' + result.firstMenu[i]['content'] + '</p></li>';

                        }

                    }

                    $('.first-menu ul').empty().append(str);

                    $('.second-menu ul').empty().append(secStr);

                }

            }

        },
        error:function(){}
    })

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

        for(var i in menuObj.firstMenu){

            index ++ ;

            $('.first-menu ul').children('li').children('img').eq(index).attr('src','img/' + menuObj.firstMenu[i]['icon-img']);

        }

        $(this).children('img').attr('src','img/' + menuObj.firstMenu[thisAttr]['icon-hover']);

        //二级菜单联动

        var secMenu = '';

        for(var i in menuObj.firstMenu[thisAttr]['submenu']){

            secMenu += '<li data-attr="' + menuObj.firstMenu[thisAttr]['submenu'][i].uri + '?nest">' + menuObj.firstMenu[thisAttr]['submenu'][i].content +
                '</li>'

        }

        $('.second-menu ul').empty().append(secMenu);

    })

    /*--------------------------------------温度湿度--------------------------------------------*/



})
