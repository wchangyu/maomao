$(function(){
    var _url = sessionStorage.getItem('apiUrlPrefix');
    /*------------------------------------获取新闻栏目------------------------------------*/
    conditionSelect();
    //获取所有新闻条目
    function conditionSelect(){
        $.ajax({
            type:'get',
            url:_url + 'News/GetAllNewsType',
            async:false,
            success:function(result){
                //console.log(result);
                var str = '';
                for(var i=0;i<result.length;i++){
                    str += '<option value="'+ result[i].pK_NewsType+ '" >' + result[i].f_NewsTypeName +'</option>'
                }
                $('#column').append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                moTaiKuang($('#myModal'),info);
            }
        })
    }
    /*-----------------------------------首先判断content的值，然后加载--------------------*/
    //记录发布日期
    var _publishDate = '';
    //记录发布用户
    var _publishUser = '';
    //记录上传图片的路径
    var _uploadImg = '';
    var _prm = window.location.search;
    if(_prm){
        var _flag = _prm.split('&')[1].split('=')[0];
    }
    if(_flag){
        //遮罩去掉
        $('.big-mark').hide();
        var splitId  = _prm.split('=')[1];
        var _id = splitId.split('&')[0];
        //获取内容
        $.ajax({
            type:'get',
            url:_url + 'News/GetNewsContentByID?'+ 'PK_NewsID=' + _id,
            async:false,
            success: function (result) {
                _publishDate = result.f_PublishDate;
                _publishUser = result.f_PublishUser;
                _uploadImg = result.f_RecommImgName.split('\\')[1] + '\\' + result.f_RecommImgName.split('\\')[2];
                //选择栏目
                //console.log(result.fK_Type_Content);
                for(var i=0;i<$('#column').children('option').length;i++){
                    ////console.log($('#column').children('option').eq(i).val())
                    if($('#column').children('option').eq(i).val() == result.fK_Type_Content){
                        $('#column').children('option').eq(i).attr('selected',true);
                    }
                }
                //新闻标题
                $('#newsTitle').val(result.f_NewsTitle);
                //内容描述
                $('#newsDesc').val(result.f_NewsDesc);
                //内容
                var ue = UE.getEditor('editor');
                //写入内容
                ue.ready(function() {
                    ue.setContent(result.f_NewsContent, true);
                });
                //作者
                $('#author').val(result.f_Author);
                //是否推荐(上传图片)
                $('.inpus').attr('checked',false);
                if(result.f_IsRecommend == 0){
                    $('.inpus').eq(1).attr('checked',true);
                    $('.uploadImg').css({'opacity':0});
                }else{
                    $('.inpus').eq(0).attr('checked',true);
                    $('.uploadImg').css({'opacity':1});
                    //图片显示 f_RecommImgName
                    var $list=$("#thelist");//上传区域
                    var $li = $(
                            '<div id="" class="file-item thumbnail">' +
                            '<img src="' + result.f_RecommImgName +'" style="width: 100px;">' +
                            '<div class="info">' + result.f_RecommImgName.split('\\')[2] + '</div>' +
                            '<p class="state">已上传</p>' +
                            '</div>'
                        ),
                        $img = $li.find('img');

                    // $list为容器jQuery实例
                    $list.append( $li );
                    //将选择文件和开始上传置为不可操作
                    $('.mark-float').css({'height':'45px'});
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                moTaiKuang($('#myModal'),info);
            }
        })
    }
    /*-----------------------------------全局变量----------------------------------------*/
    //保存上传之后返回的路径
    var _uploaderPath = '';
    _uploaderPath = _uploadImg;
    //编辑新闻的内容
    var _newsContent = '';
    //登陆者
    var _userID = sessionStorage.getItem('userName');
    /*------------------------------------编辑器------------------------------------------*/
    //实例化编辑器
    //建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
    var ue = UE.getEditor('editor');
    //获得内容
    function getContent() {
        var arr = [];
        _newsContent = UE.getEditor('editor').getContent();
    }
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
        server:_url + 'News/ImageFileUploadProgress',
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
            ),
            $img = $li.find('img');

        // $list为容器jQuery实例
        $list.append( $li );
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
    });
    //文件成功，失败处理
    uploader.on( 'uploadSuccess', function( file,response ) {
        _uploaderPath = response;
        $( '#'+file.id ).find('p.state').text('已上传').css({'color':'green'});
    });
    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错').css({'color':'red'});
    });
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').fadeOut();
    });
    $('#ctlBtn').click(function(){
        if($('#thelist').children().length > 1){
            moTaiKuang($('#myModal'),'只能上传一张图片！')
        }else{
            uploader.upload();
        }
    });
    $('#thelist').on('click','.file-item',function(){
        //页面删掉
        $(this).remove();
        //队列删除
        uploader.removeFile($(this)[0].id,true);
    });
    $('#deleted').click(function(){
        var fileNamePath = {
            '':_uploaderPath
        }
        $('#thelist').find('.file-item').remove();
        $.ajax({
            type:'post',
            url:_url + 'News/DelUploadImageFile',
            data:fileNamePath,
            success:function(result){
                if(result == 99){
                    //成功；
                    moTaiKuang($('#myModal'),'删除成功！','flag');
                    //清除队列中的文件(路径为空)
                    _uploaderPath = ''
                    //队列文件清空
                    $('#thelist').find('.file-item').remove();
                    $('.mark-float').css({'height':0});
                }else if( result == 3 ){
                    moTaiKuang($('#myModal'),'删除失败！','flag');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                moTaiKuang($('#myModal'),info,'flag');
            }
        })
    })
    //单选框选择
    $('.inpus').click(function(){
        $(this).parents('.input-blockeds').children('.radio').children('span').removeClass('checked');
        $(this).parent('span').addClass('checked');
        if($(this).val() == 1){
            $('.uploadImg').css({'opacity':1});
            _uploaderPath = _uploadImg;
            $('.big-mark').hide();
        }else{
            $('.uploadImg').css({'opacity':0});
            _uploaderPath = '';
            $('.big-mark').show();
        }
    })
    //点击保存，发送数据
    $('#saveNews').click(function(){
        getContent();
        //先判断内容是否写了
        if(_newsContent){
            //首先判断是编辑还是新增
            if(_id){
                var newsContent = {
                    pK_NewsID:_id,
                    fK_Type_Content:$('#column').val(),
                    f_NewsTypeName:$.trim($('#column').children('option:selected').html()),
                    f_NewsTitle:$('#newsTitle').val(),
                    f_NewsDesc:$('#newsDesc').val(),
                    f_NewsContent:_newsContent,
                    f_PublishDate:_publishDate,
                    f_Author:$('#author').val(),
                    f_IsRecommend:$('.radio').children('.checked').children('input').val(),
                    f_RecommImgName:_uploaderPath,
                    f_PublishUser:_publishUser,
                    userID:_userID
                }
                $.ajax({
                    type:'post',
                    url:_url + 'News/EditNewsContent',
                    data:newsContent,
                    success:function(result){
                        if(result == 99){
                            //添加成功
                            moTaiKuang($('#myModal1'),'新闻编辑成功！','flag')
                        }else if(result == 2){
                            moTaiKuang($('#myModal'),'新闻标题不能重复！','flag')
                        }else if(result == 3){
                            moTaiKuang($('#myModal'),'执行失败！','flag')
                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        //console.log(JSON.parse(jqXHR.responseText).message);
                        if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                        }
                    }
                })
            }else{
                var newsContent = {
                    fK_Type_Content:$('#column').val(),
                    f_NewsTypeName: $.trim($('#column').children('option:selected').html()),
                    f_NewsTitle:$('#newsTitle').val(),
                    f_NewsDesc:$('#newsDesc').val(),
                    f_NewsContent:_newsContent,
                    f_Author:$('#author').val(),
                    f_IsRecommend:$('.radio').children('.checked').children('input').val(),
                    f_RecommImgName:_uploaderPath,
                    userID:_userID
                }
                $.ajax({
                    type:'post',
                    url: _url + 'News/AddNewsContent',
                    data:newsContent,
                    success:function(result){
                        if(result == 99){
                            //添加成功
                            moTaiKuang($('#myModal1'),'新闻添加成功！','flag');
                            //跳转
                            window.location.href="./news-3.html";
                        }else if(result == 2){
                            moTaiKuang($('#myModal'),'新闻标题不能重复！','flag')
                        }else if(result == 3){
                            moTaiKuang($('#myModal'),'执行失败！','flag')
                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        var info = JSON.parse(jqXHR.responseText).message;
                        moTaiKuang($('#myModal'),info,'flag')
                    }
                })
            }
        }else{
            moTaiKuang($('#myModal'),'请填写新闻内容');
        }

    })
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
    /*----------------------------------------------其他方法------------------------------------------*/
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