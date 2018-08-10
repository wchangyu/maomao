var Main = function () {

    /*-------------------------------------echart-------------------------------------------*/
    var optionLine = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[]
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: []
    };

    //历史曲线初始化
    var _echartHistory = echarts.init(document.getElementById('powerHistoryChart'));

    //区域响应饼图
    var _echartPie = echarts.init(document.getElementById('district-answer'));

    var optionPie = {

        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            left: 'center',
            top:'bottom',
            data: []
        },
        series : [
            {
                name: '',
                type: 'pie',
                radius : '65%',
                center: ['45%', '40%'],
                data:[],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    //新闻
    newsInfo();

    //历史曲线
    historyLine();

    //历史曲线十分钟刷新一下
    setInterval(function(){

        historyLine();

    },1000*10*60)

    //角色响应统计
    RoleAnswer();

    //行业响应统计
    industryAnswer();

    //区域响应统计
    districtAnswer();

    //产品响应统计
    productAnswer();

    window.onresize = function(){

        if(_echartHistory && _echartPie){

            _echartHistory.resize();

            _echartPie.resize();

        }

    }

    /*------------------------------------------其他方法--------------------------------------*/

    //新闻轮播
    function newsInfo(){

        $('#myCarousel').showLoading();

        //获取推荐轮播图块
        $.ajax({
            type:'get',

            url:sessionStorage.apiUrlPrefix + 'News/GetRecommendNews',

            success:function(result){

                $('#myCarousel').hideLoading();

                if(result.length > 0){

                    //创建轮播图
                    var showArr = result.splice(0,4);

                    var html = '';

                    var html1 = '';

                    for(var i=0;i<showArr.length;i++){

                        if(i == 0){

                            html += '<a class="item active" style="height: 100%">' +

                                ' <img class="img">' +

                                ' <div class="carousel-caption" style="color: #2B2B2B;font-size: 16px;"></div>' +

                                '</a>';

                            html1 += '<li data-target="#myCarousel" data-slide-to="'+i+'" class="active"></li>'

                        }else{
                            html += '<a class="item" style="height: 100%">' +

                                ' <img class="img">' +

                                ' <div class="carousel-caption" style="color: #2B2B2B;font-size: 16px;"></div>' +

                                '</a>';

                            html1 += '<li data-target="#myCarousel" data-slide-to="'+i+'" class=""></li>'
                        }



                    }

                    $('.carousel-inner').html(html);

                    $('.carousel-indicators').html(html1);


                    for(var i=0;i<showArr.length;i++){

                        if( showArr[i].f_RecommImgName){

                            var imgurl = showArr[i].f_RecommImgName.split('\\');

                            $('.carousel-inner').find('.item').eq(i).children('.img');

                            $('.carousel-inner').find('.item').eq(i).children('.img').attr('src','' + imgurl[0] + '/' + imgurl[1] + '/' + imgurl[2] + '');

                            $('.carousel-inner').find('.item').children('.carousel-caption').eq(i).html(showArr[i].f_NewsTitle);

                            $('.carousel-inner').find('.item').eq(i).attr('href','../news/news-4.html?id=' + showArr[i].pK_NewsID + '&come=1');
                        }else{

                            $('.carousel-inner').find('.item').children('.carousel-caption').eq(i).html(showArr[i].f_NewsTitle);

                            $('.carousel-inner').find('.item').eq(i).attr('href','../news/news-4.html?id=' + showArr[i].pK_NewsID + '&come=1');
                        }
                    }

                    $('#myCarousel').carousel({

                        interval: 3000

                    })


                }else{

                    var str = '<div style="position: absolute;top: 45%;text-align: center;width: 100%;">暂时没有获取到新闻数据</div>'

                    $('.carousel-inner').empty().append(str);

                }

            },

            error:function(jqXHR, textStatus, errorThrown){

                $('#myCarousel').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时')

                }else{

                    console.log('请求失败')

                }

            }
        })
    };

    //历史曲线
    function historyLine(){

        //loadding显示
        $('#powerHistoryChart').showLoading();

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRMain/GetDRHistoryEFhDs',

            timeout:_theTimes,

            success:function(result){

                $('#powerHistoryChart').hideLoading();

                if(result.code == 0){

                    //横坐标
                    optionLine.xAxis.data = result.xs;

                    //标识
                    optionLine.legend.data = result.lgs;

                    //纵坐标
                    var yArr = [];

                    //纵坐标
                    for(var i=0;i<result.ys.length;i++){

                        var obj = {};

                        obj.name = result.lgs[i];

                        obj.type = 'line';

                        obj.data = result.ys[i];

                        yArr.push(obj);

                    }

                    //处理数据，三个数据选最长的，如果

                    optionLine.series = yArr;

                }else if(result.code == -1){

                        console.log('获取历史用电负荷曲线数据时出现异常');

                    }else if(result.code == -2){

                        var str = '<div style="position: absolute;top: 45%;text-align: center;width: 100%;">暂时没有历史用电负荷曲线</div>'

                        $('#powerHistoryChart').append(str);

                    }else if(result.code == -3){

                        console.log('参数错误');

                    }else if(result.code == -4){

                        console.log('内容已存在')

                    }else if(result.code == -6){

                        console.log('抱歉，您没有获取历史用电负荷曲线数据的权限');

                    }

                _echartHistory.setOption(optionLine,true);


            },

            error:function(jqXHR, textStatus, errorThrown){

                $('#powerHistoryChart').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时')

                }else{

                    console.log('请求失败')

                }

            }

        })

    }

    //角色响应
    function RoleAnswer(){

        $('.role-answer').showLoading();

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRMain/GetDRSGVByURole',

            timeout:_theTimes,

            success:function(result){

                $('.role-answer').hideLoading();

                var str = '';

                if(result.code == 0){

                    for(var i in result.uRoleSGVs){

                        str += '<p>' + i + '<span>' + result.uRoleSGVs[i] + '</span>' + '</p>'

                    }

                }else if(result.code == -1){

                    console.log('获取角色响应数据时出现异常');

                }else if(result.code == -2){

                    str = '<div style="position: relative;top: 45%;text-align: center;">暂时没有角色响应数据</div>';

                }else if(result.code == -3){

                    console.log('参数错误');

                }else if(result.code == -4){

                    console.log('内容已存在')

                }else if(result.code == -6){

                    console.log('抱歉，您没有获取角色响应统计的权限');

                }

                $('.role-answer').empty().append(str);

            },

            error:function(jqXHR, textStatus, errorThrown){

                $('.role-answer').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时')

                }else{

                    console.log('请求失败')

                }

            }

        })

    }

    //行业响应
    function industryAnswer(){

        $('.industry-answer').showLoading();

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRMain/GetDRSGVByAgency',

            timeout:_theTimes,

            success:function(result){

                $('.industry-answer').hideLoading();

                var str = '';

                if(result.code == 0){

                    for(var i in result.agencySGVs){

                        str += '<p>' + i + '<span>' + result.agencySGVs[i] + '</span>' + '</p>'

                    }

                }else if(result.code == -1){

                    console.log('获取行业响应数据时出现异常');

                }else if(result.code == -2){

                    str = '<div style="position: relative;top: 45%;text-align: center;">暂时没有行业响应数据</div>';

                }else if(result.code == -3){

                    console.log('参数错误');

                }else if(result.code == -4){

                    console.log('内容已存在')

                }else if(result.code == -6){

                    console.log('抱歉，您没有获取行业响应统计的权限');

                }

                $('.industry-answer').empty().append(str);

            },

            error:function(jqXHR, textStatus, errorThrown){

                $('.industry-answer').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时')

                }else{

                    console.log('请求失败')

                }

            }

        })

    }

    //产品响应
    function productAnswer(){

        $('.product-answer').showLoading();

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRMain/GetDRSGVByIndustry',

            timeout:_theTimes,

            success:function(result){

                $('.product-answer').hideLoading();

                var str = '';

                if(result.code == 0){

                    for(var i in result.industrySGVs){

                        str += '<p>' + i + '<span>' + result.industrySGVs[i] + '</span>' + '</p>'

                    }

                }else if(result.code == -1){

                    console.log('获取行业响应数据时出现异常');

                }else if(result.code == -2){

                    str = '<div style="position: relative;top: 45%;text-align: center;">暂时没有行业响应数据</div>';


                }else if(result.code == -3){

                    console.log('参数错误');

                }else if(result.code == -4){

                    console.log('内容已存在')

                }else if(result.code == -6){

                    console.log('抱歉，您没有获取行业响应统计的权限');

                }

                $('.product-answer').empty().append(str);

            },

            error:function(jqXHR, textStatus, errorThrown){

                $('.product-answer').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时')

                }else{

                    console.log('请求失败')

                }

            }

        })

    }

    //响应能力
    function districtAnswer(){

        $('.district-answer').showLoading();

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRMain/GetDRSGVByDIST',

            timeout:_theTimes,

            success:function(result){

                $('.district-answer').hideLoading();

                if(result.code == 0){

                    optionPie.legend.data = result.lgs;

                    var yArr = [];

                    for(var i=0;i<result.lgs.length;i++){

                        var obj = {};

                        obj.value = result.ys[i];

                        obj.name = result.lgs[i];

                        yArr.push(obj);

                    }

                    optionPie.series[0].data = yArr;


                }else if(result.code == -1){

                    console.log('获取行业响应数据时出现异常');

                }else if(result.code == -2){

                    var str = '<div style="position: absolute;top: 45%;text-align: center;width: 100%;">暂时没有行业响应数据</div>'

                    $('#district-answer').append(str);

                }else if(result.code == -3){

                    console.log('参数错误');

                }else if(result.code == -4){

                    console.log('内容已存在')

                }else if(result.code == -6){

                    console.log('抱歉，您没有获取行业响应统计的权限');

                }

                _echartPie.setOption(optionPie);

            },

            error:function(jqXHR, textStatus, errorThrown){

                $('.district-answer').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时')

                }else{

                    console.log('请求失败')

                }

            }

        })

    }

    return {
        init: function () {

        }
    }

}()