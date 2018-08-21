$(function(){

    //打开图片链接
    $('.manage-content').click(function(){

        $('#theLoading').modal('show');

        //初始化
        $('#img-myModal').find('img').attr('src','');

        var src = $(this).attr('data-img');

        var title = $(this).html();

        $('#img-myModal').find('img').attr('src',src);

        _moTaiKuang($('#img-myModal'),title,true,'','','');

        $('#theLoading').modal('hide');

    })

})