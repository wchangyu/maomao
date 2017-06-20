$(function(){
    var _url = sessionStorage.getItem('apiUrlPrefix');
    var _prm = window.location.search;
    if(_prm){
        var splitId  = _prm.split('&')[0];
        var _id = splitId.split('=')[1];
        var splitCome = _prm.split('&')[1];

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
            var info = JSON.parse(jqXHR.responseText).message;
            moTaiKuang($('#myModal'),info,'flag');
        }
    })
    /*--------------------------------------模态框方法--------------------------------------*/
    function moTaiKuang(who,meg,flag){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        who.find('.modal-body').html(meg);
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
    }
})