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


    //新闻
    newsInfo();

    //历史曲线
    historyLine();

    window.onresize = function(){

        if(_echartHistory){

            _echartHistory.resize();

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

            url:sessionStorage.apiUrlPrefix + 'DRMain/GetHistoryEFhDs',

            timeout:_theTimes,

            success:function(result){

                $('#powerHistoryChart').hideLoading();

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


    return {
        init: function () {

        }
    }

}()