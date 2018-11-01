$(function(){

    /*-----------------------------------------------上传图片----------------------------------------*/
    var $list=$("#thelist");//上传区域

    var $btn =$("#ctlBtn");//上传按钮

    var thumbnailWidth = 100;

    var thumbnailHeight = 100;

    //初始化设置
    var uploader = WebUploader.create({
        //选完文件是否上传
        //swf的路径
        swf:'webuploader/Uploader.swf',

        //文件接收服务端
        server:_urls + _webPatch,

        pick: '#picker',

        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false
    });

    //添加东西之后判断是否能预览，如果是图片能预览，否则反之，
    uploader.on( 'fileQueued', function( file ) {

        //我现在就是想要实现单文件上传
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
                '<p class="state">等待上传...</p>' +
                '</div>'
            );

            $img = $li.find('img');

        // $list为容器jQuery实例
        $list.html( $li );

        //缩略图
        uploader.makeThumb( file, function( error, src ) {   //webuploader方法
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );
    });

    //文件上传进度
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {

        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo( $li ).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css( 'width', percentage * 100 + '%' );

        ////获取当前图片的宽，高
        //var  imgWidth = file._info.width;
        //
        //var imgHeight = file._info.height;
        //
        //if( imgWidth / imgHeight > 1.6 ||  imgWidth / imgHeight < 1.2){
        //
        //    $li.find('p.state').text('请选择长宽比合适的图片上传(推荐比例1.4:1)');
        //
        //    uploader.stop(true);
        //
        //}else{
        //
        //
        //
        //}

    });

    //文件成功，失败处理
    uploader.on( 'uploadSuccess', function( file,response ) {

        _imgpath = response;

        $( '#'+file.id ).find('p.state').text('已上传').css({'color':'green'});

        //删除按钮显示
        $('#deleted').show();
    });

    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错').css({'color':'red'});
    });

    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').fadeOut();
    });

    //删除已上传的图片
    $('#deleted').click(function(){

        //首先提示是否要删除当前图片
        _moTaiKuang($('#del-img-Modal'),'提示','',true,'确定要删除当前图片吗？','删除');

    })

    //确定要删除当前图片
    $('#del-img-Modal').on('click','.btn-primary',function(){

        var prm = {

            path:_imgpath.replace(/\\/,'\\\\')

        }

        _mainAjaxFunCompleteNew('post',_webDelPatch,prm,$('#del-img-Modal').children(),function(result){

            if(result == 99){

                $('#del-img-Modal').modal('hide');

                $('#thelist').empty();

                $('#deleted').hide();

                $('#thelist').val('');

                _imgpath = '';

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'文件删除成功','');

        })


    })

    //上传图片
    $('#ctlBtn').click(function(){

        if($('#thelist').children().length > 1){

            console.log('只能上传一张图片');

        }else{

            uploader.upload();
        }
    });

})