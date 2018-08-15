$(function(){
    var _url = sessionStorage.getItem('apiUrlPrefix');
    var _prm = window.location.search;
    if(_prm){

        var _id = _prm.split('=')[1];
    }
    $.ajax({
        type:'get',
        url:_url + 'HBYYG/GetNewsContentByID?'+ 'ID=' + _id,
        async:false,
        success:function(result){
            if(result){
                //标题
                $('.header').children('h1').html(result.title);
                //时间
                $('.publishDate').html("发布日期："  + result.date);
                //栏目名称
                $('.column').html("栏目:" + result.fkName);
                //作者
                $('.write').html("作者:" + result.author);
                //描述
                $('.desc').html(result.descs);
                //内容
                var str = result.contents;
                str = str.replace(/&nbsp./g, "&nbsp;");
                $('.content').append(str);

                if(result.type == 1){


                    document.title = '政策法规';

                }else if(result.type == 2){

                    document.title = '卫监动态及科普';


                }else if(result.type == 3){

                    document.title = '热线新闻';


                }else{

                    document.title = '新闻内容';
                }
            }
        },
        error:function(jqXHR, textStatus, errorThrown){

        }

    });
    /*--------------------------------------模态框方法--------------------------------------*/
    function moTaiKuang(who,meg,flag){

        who.modal({
            show:false,
            backdrop:'static'
        });

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