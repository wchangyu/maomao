$(function(){

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
                if(!result.fkName ||result.fkName == '' ){
                    if(result.type == 0){

                        //栏目名称
                        $('.column').html("栏目:" + '政策法规');

                    }else if(result.type == 1){

                        //栏目名称
                        $('.column').html("栏目:" + '卫监动态及科普');
                    }
                }
                //作者
                $('.write').html("作者:" + result.author);
                //描述
                $('.desc').html(result.descs);

                //内容
                var str = result.contents;
                str = str.replace(/&nbsp./g, "&nbsp;");
                $('.content').append(str);

                var name = result.imgUrl.split('\\')[2];

                if(!name){

                    name = '暂无预览图';
                }

                //推荐图片
                var $li = $(
                    '<div id="" class="file-item thumbnail">' +
                    '<img src="' + result.imgUrl +'" style="width: 100px;">' +
                    '<div class="info">' + name + '</div>' +
                    '<p class="state">已上传</p>' +
                    '</div><div class="clearfix"></div>'
                );

                if(result.imgUrl !=""){

                    $('#thelist').html($li);

                }else{

                    $('#thelist').html('<div class="clearfix"></div>');
                }


                //审批状态
                 isApl = result.isApl;

                //已审批
                if(isApl == 1 || isApl == 2){

                    $('#isApl').attr('disabled','disabled');

                    $('#approval-message').attr('disabled','disabled');

                    $('#selected').hide();

                    $('#isApl').val(result.isApl);

                    $('#approval-message').val(result.aplRmk);

                }else{


                    if( _prm.split('come=')[1] == 2){


                        $('.approve-container').show();

                    }else{

                        // 不显示审批信息
                        $('.approve-container').hide();

                    }
                }

            }
        },
        error:function(jqXHR, textStatus, errorThrown){

        }
    });

    //审批确定按钮
    $('#selected').on('click',function(){

        //是否审批通过
        var isApl = $('#f_IsApproval').val();

        //审批意见
        var aplRmk = $('#approval-message').val();

        //传递给后台的数据
        var prm = {

            "id": _id,
            "isApl": isApl,
            "aplRmk": aplRmk

        };

        $.ajax({
            type:'post',
            url:_url + 'HBYYG/NewsApproval',
            data:prm,
            success:function(result){

                console.log(result);

                if(result.status == 99){

                    //审批成功
                    moTaiKuang($('#myModal1'),'审批成功','flag','审批成功！');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

            }
        });

    });

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
});

var _url = sessionStorage.getItem('apiUrlPrefix');
var _prm = window.location.search;

if(_prm){

    var splitId  = _prm.split('&')[0];
    var _id = splitId.split('=')[1];
}


//审批状态
var isApl = 0;

var userRole = sessionStorage.userRole;

//判断是普通用户1 还是管理员2
if( _prm.split('come=')[1] == 2) {

    //显示审批信息
    $('.approve-container').show();

    $('.footer').show();

}else if( _prm.split('come=')[1] == 1){

    // 显示审批信息 但不能修改 提交
    $('.approve-container').show();

    $('#isApl').attr('disabled','disabled');

    $('#approval-message').attr('disabled','disabled');

    $('#selected').hide();

    $('.footer').show();

}else if( _prm.split('come=')[1] == 0){

    // 不显示审批信息 但不能修改 提交
    $('.approve-container').hide();

    $('#isApl').attr('disabled','disabled');

    $('#approval-message').attr('disabled','disabled');

    $('#selected').hide();

    $('.footer').hide();

}

