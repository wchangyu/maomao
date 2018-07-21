var Main = function () {

    //新闻
    newsInfo();

    /*------------------------------------------其他方法--------------------------------------*/

    function newsInfo(){

        //获取推荐轮播图块
        $.ajax({
            type:'get',

            url:sessionStorage.apiUrlPrefix + 'News/GetRecommendNews',

            success:function(result){

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

            }
        })
    };


    return {
        init: function () {

        }
    }

}()