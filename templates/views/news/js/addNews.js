/**
 * Created by admin on 2018/7/17.
 */
$(function(){

    /*-----------------------------------首先判断content的值，然后加载--------------------*/
    //记录发布日期
    var _publishDate = '';
    //记录发布用户
    var _publishUser = '';

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
            url:_url + 'HBYYG/GetNewsContentByID?'+ 'ID=' + _id,
            async:false,
            success: function (result) {

                _publishDate = result.date;
                _publishUser = result.users;
                _uploadImg = result.imgUrl.split('\\')[1] + '\\' + result.imgUrl.split('\\')[2];

                if(_uploadImg){

                    _uploaderPath = _uploadImg;
                }

                //选择栏目
                //console.log(result.fkid);
                for(var i=0;i<$('#column').children('option').length;i++){
                    ////console.log($('#column').children('option').eq(i).val())
                    if($('#column').children('option').eq(i).val() == result.fkid){
                        $('#column').children('option').eq(i).attr('selected',true);
                    }
                }
                //新闻标题
                $('#newsTitle').val(result.title);
                //内容描述
                $('#newsDesc').val(result.descs);
                //内容
                var ue = UE.getEditor('editor');
                //写入内容
                var str = result.contents;
                str = str.replace(/&nbsp./g, "&nbsp;");

                ue.ready(function() {
                    ue.setContent(str, true);
                });

                //作者
                $('#author').val(result.author);
                //是否推荐(上传图片)
                $('.inpus').attr('checked',false);

                //if(result.ishp == 0){
                //    $('.inpus').eq(1).attr('checked',true);
                //    $('.uploadImg').css({'opacity':0});
                //}else{
                    $('.inpus').eq(0).attr('checked',true);
                    $('.uploadImg').css({'opacity':1});
                    //图片显示 imgUrl
                    var $list=$("#thelist");//上传区域
                    var $li = $(
                            '<div id="" class="file-item thumbnail">' +
                            '<img src="' + result.imgUrl +'" style="width: 100px;">' +
                            '<div class="info">' + result.imgUrl.split('\\')[2] + '</div>' +
                            '<p class="state">已上传</p>' +
                            '</div>'
                        ),
                        $img = $li.find('img');

                    // $list为容器jQuery实例
                    if(result.imgUrl != ''){

                        $list.append( $li );

                    }else{

                        var $li = $('无');

                        $list.append( $li );
                     }

                    //将选择文件和开始上传置为不可操作
                    $('.mark-float').css({'height':'45px'});
                    $('.mark-float').hide();
                //}
            },
            error:function(jqXHR, textStatus, errorThrown){

            }
        })
    }


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

        //获取文件宽高
        console.log(file._info);

        //获取当前图片的宽，高
        var  imgWidth = file._info.width;

        var imgHeight = file._info.height;

        console.log(imgWidth / imgHeight)

        //if( imgWidth / imgHeight > 1.6 ||  imgWidth / imgHeight < 1.2){
        //
        //    $li.find('p.state').text('请选择长宽比合适的图片上传(推荐比例1.4:1)');
        //
        //    uploader.stop(true);
        //
        //}else{
        //
        //    $li.find('p.state').text('上传中');
        //
        //    $percent.css( 'width', percentage * 100 + '%' );
        //
        //}

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

                $('.big-mark').hide();

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

        //格式验证

        //首先判断选中的是否推荐

        var isRecommend = true;

        if( $('.checked').children().attr('value') == 1 ){

            if(_uploaderPath == ''){

                //提示消息

                isRecommend = false;

            }else{

                isRecommend = true;

            }

        }else{

            //可以上传
            isRecommend = true;

        }

        //可以上传
        isRecommend = true;

        if(isRecommend){

            //判断栏目是否填写了
            //console.log($('#column').val());

            var fkid =  $('#column').val();

            if(userRole == 'admin' ||  $('#column').val() != '' && userRole != 'admin' ){

                if(userRole == 'admin'){

                    type = $('#column').val();

                    fkid = 0 ;
                }

                if($('#newsTitle').val()){

                    //先判断内容是否写了
                    if(_newsContent){

                        //首先判断是编辑还是新增
                        if(_id){

                            var newsContent = {
                                id:_id,
                                fkid:fkid,
                                fkName:$.trim($('#column').children('option:selected').html()),
                                title:$('#newsTitle').val(),
                                descs:$('#newsDesc').val(),
                                contents:_newsContent,
                                date:_publishDate,
                                author:$('#author').val(),
                                type:type,
                                imgUrl:_uploaderPath,
                                users:_publishUser,
                                userID:_userIdNum
                            }
                            $.ajax({
                                type:'post',
                                url:_url + 'HBYYG/EditNewsContent',
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
                                fkid:fkid,
                                fkName: $.trim($('#column').children('option:selected').html()),
                                title:$('#newsTitle').val(),
                                descs:$('#newsDesc').val(),
                                contents:_newsContent,
                                author:$('#author').val(),
                                type:type,
                                imgUrl:_uploaderPath,
                                userID:_userIdNum
                            };

                            $.ajax({
                                type:'post',
                                url: _url + 'HBYYG/AddNewsContent',
                                data:newsContent,
                                success:function(result){
                                    if(result == 99){
                                        //添加成功
                                        moTaiKuang($('#myModal1'),'新闻添加成功！','flag');
                                        //跳转
                                        window.location.href="./manageNews.html";
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

                }else{

                    moTaiKuang($('#myModal'),'请添加新闻标题');

                }

            }else{

                moTaiKuang($('#myModal'),'请添加游泳馆');

            }


        }else{

            //提示上传图片
            moTaiKuang($('#myModal'),'推荐选项下，必须上传图片！',true );

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
});

/*------------------------------------获取新闻栏目------------------------------------*/

//获取所有游泳馆
function conditionSelect(){
    $.ajax({
        type:'post',
        url:_url + 'HBYYG/GetUserPubenvDatas',
        data:{
            'userID':_userIdName
        },
        async:false,
        success:function(result){

            //if(result.length == 0){
            //    moTaiKuang($('#myModal'),'请先添加栏目！');
            //}

            var str = '';
            for(var i=0;i<result.length;i++){
                str += '<option value="'+ result[i].enterpriseID+ '" >' + result[i].eprName +'</option>'
            }

            $('#column').append(str);

        },
        error:function(jqXHR, textStatus, errorThrown){

        }
    })
}


/*-----------------------------------全局变量----------------------------------------*/

var _url = sessionStorage.getItem('apiUrlPrefix');

//保存上传之后返回的路径
var _uploaderPath = '';
_uploaderPath = _uploadImg;

//记录上传图片的路径
var _uploadImg = '';

//编辑新闻的内容
var _newsContent = '';

//登陆者
var _userID = sessionStorage.getItem('userName');

var userRole = sessionStorage.userRole;

//是否推荐字段
var ishp = 0;

//新闻类型
var type = 9;

//判断是普通用户 还是管理员
//console.log(userRole);
if(userRole == 'admin'){

    //管理员 隐藏游泳馆
    $('.choose-natatorium').show();

    var str = "<option value='1'>政策法规</option><option value='2'>卫监动态及科普</option><option value='3'>热线新闻</option>";

    $('#column').append(str);

    ishp = 1;

    $('.choose-natatorium .right-names').html('选择栏目');

}else{

    //普通用户 显示游泳馆
    $('.choose-natatorium').show();

    conditionSelect();

    ishp = 0;

    $('.choose-natatorium .right-names').html('选择游泳馆');

}

//选择图片初始化
$('.uploadImg').css({'opacity':1});

_uploaderPath = _uploadImg;

$('.big-mark').hide();
