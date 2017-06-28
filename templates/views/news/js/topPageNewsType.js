/**
 * Created by admin on 2017/6/22.
 */


$(function(){

    id = window.location.search.split('=')[1];

    //存放要展示的栏目
    var showArr = [];

    var topTitle = '';

    getTitleByID();

});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-28718218-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var id;

var newsArr = [];

//获取所有新闻栏目
function getTitleByID(){

    $.ajax({
        type: 'get',
        url: IP + "/News/GetAllNewsTypeContent",
        timeout: theTimes,
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {

        },
        success: function (data) {
            $('#theLoading').modal('hide');
            //console.log(data);
            newsArr = data;

            var showArr = [];

            $(newsArr).each(function(i,o){

                if(o.pK_NewsType == id){

                    showArr = o.newsContents;

                    topTitle = o.f_NewsTypeName;

                }
            });

            var html = '';
            //console.log(showArr);

            $(showArr).each(function(i,o){

                html += '<li>'+
                    '<div class="header">' +
                    '    <h3><a href="news-4.html?id=' + o.pK_NewsID+ '&come=1' +
                    '">'+ o.f_NewsTitle+'</a></h3>' +
                    '    <div class="date">' +
                    '        <span class="publishDate">发布日期：'+o.f_PublishDate+'</span>' +
                    '        <span class="column"></span>' +
                    '        <span class="write">作者：'+o.f_Author+'</span>' +
                    '    </div>' +
                    '</div></li>';

            });

            $('.box-block ul').html(html);
            $('.box-block h1').html(showArr[0].f_NewsTypeName);


            $("div.holder").jPages({
                containerID : "itemContainer",
                perPage     : 10,
                first       : "首页",
                previous    : "上一页",
                next        : "下一页",
                last        : "尾页"
            });

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
}
