$(function(){
    var _url = sessionStorage.getItem('apiUrlPrefix');
    var _prm = window.location.search;
    if(_prm){
        var splitId  = _prm.split('=')[1];
        var _id = splitId.split('&')[0];
        var splitCome = _prm.split('&')[2];
        if(splitCome == 'come=1'){
            $('.returns').attr('href','./news.html')
        }else if(splitCome == 'come=2'){
            $('.returns').attr('href','./news-3.html')
        }
    }

    $.ajax({
        type:'get',
        url:_url + 'News/GetNewsContentByID?'+ 'PK_NewsID=' + _id,
        async:false,
        success:function(result){
            if(result){
                //标题
                $('.header').children('h1').html(result.f_NewsTitle);
                //时间
                $('.publishDate').html("发布日期："  + result.f_PublishDate);
                //栏目名称
                $('.column').html("栏目:" + result.f_NewsTypeName);
                //作者
                $('.write').html("作者:" + result.f_Author);
                //描述
                $('.desc').html(result.f_NewsDesc);
                //内容
                $('.content').append(result.f_NewsContent);
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(JSON.parse(jqXHR.responseText).message);
            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
            }
        }
    })
})