/**
 * Created by admin on 2017/12/5.
 */
$(function(){

    //点击选中某个报表时
    $('.statement').on('click','.statement-contain',function(){

        $(".statement-contain").removeClass('curClick');

        $(this).addClass('curClick');

        //获取路径
        var url = $(this).find('a').attr('href');

        //打开对应的报表导出页面
        window.open(url);

    });

    getDataByConfig();

});

//从配置项中获取页面中所展示信息
function getDataByConfig(){

    //获取当前的url
    var curUrl = window.location.href;

    //获取当前页面的配置信息
    $(__systemConfigArr).each(function(i,o){

        //获取当前配置项中的url
        var thisUrl = o.pageUrl;

        //找到了当前页面对应的配置项
        if(curUrl.indexOf(thisUrl) > -1){

            //获取到具体的能耗排名配置信息
            var dataArr = o.showStatement;

            var html = "";

            $(dataArr).each(function(i,o){

                if(o.isShow == 1){

                    html += '<div class="statement col-lg-4 col-md-4 col-sm-12 col-xs-12">' +
                                '<div class="'+ o.addClass+'">' +
                                    '<div class="top-img">' +
                                    '</div>' +
                                    '<p>' +
                                        '<a target="_blank" href="'+ o.jumpUrl+'">' +
                        o.statementName +'</a>' +

                                    '</p>' +
                                '</div>' +
                            '</div>';
                }
            });

            //赋值到页面中
            $('.showStatement').html(html);

        }
    });
};