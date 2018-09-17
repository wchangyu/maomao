$(function(){
    //时间插件
    $('.startsTime').datepicker(
        {
            language:  'zh-CN',
            todayBtn: 1,
            todayHighlight: 1,
            format: 'yyyy-mm-dd'
        }
    )

    classFun();

    //知识浏览表格
    $('#browse-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页  共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'B<"clear">lfrtip',
        'buttons': [

        ],
        //'ajax':'./work_parts/data/assetsbrow.json',
        "columns": [
            {
                title:'知识编号',
                data:'',
                class:'hidden',
                render:function(data, index, row, meta){
                    return '00' + meta.row;
                }
            },
            {
                title:'知识ID',
                data:'pK_KnowledgeID',
                class:'hidden'
            },
            {
                title:'知识标题',
                data:'f_KnowleTitle'
            },
            {
                title:'分类',
                data:'dsName'
            },
            {
                title:'摘要',
                data:'f_KnowleDigest'
            },
            {
                title:'关键词',
                data:'f_KnowleKeyword'
            },
            {
                title:'附件个数',
                data:'knowLedgeFiles',
                render:function(data, type, row, meta){

                    var length = data.length;

                    return length;
                }

            },
            {
                title:'录入时间',
                data:'f_KnowleCreateDT'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
            }
        ]
    });
    _table =$('#browse-datatables').dataTable();

    //查询功能
    $('.condition-query .btn1').on('click',function(){
        //获取查询标题
        var _knowTitle = $('.file-title').val();

        getShowKnowledgeData(_knowTitle);
    });

    //新增知识库
    $('.btn22').click(function(){

        $('#myModal').modal('show');
        $('#thelist').html('');
        _postKnowLedgeFileArr = [];
        //清空输入框
        $('#myModal input').val('');
        $('#myModal textarea').val('');

        $('#myModal #delBtn').addClass('hidden');
        $('#myModal #thelist0').html('');

        //分类初始化
        $('.classify').val('');

        $('#myModal .btn-primary').off('click');

        $('#myModal .btn-primary').on('click',function(){

            if(!ifAllShouldWrite('#myModal')){
                return false;
            };

            //获取标题
            var f_KnowleTitle = $('#knowledge-title').val();
            //获取摘要
            var f_KnowleDigest = $('#myModal .textarea1').val();
            //获取关键词
            var f_KnowleKeyword = $('#myModal .textarea2').val();
            //获取内容
            var f_KnowleContent = $('#myModal .textarea3').val();

            //设备分类
            var name = '';

            if($('#classify').val() == ''){

                name = '';

            }else{

                name = $('#classify').children('option:selected').html();

            }

            //数据传递给后台
            $.ajax({
                type: 'post',
                url: _urls + "YWKnowledge/AddNewKnowledge",
                timeout: theTimes,
                data:{
                    "pK_KnowledgeID": 0,
                    "fK_Type_Knowledge": 0,
                    "f_KnowleTitle": f_KnowleTitle,
                    "f_KnowleDigest": f_KnowleDigest,
                    "f_KnowleKeyword": f_KnowleKeyword,
                    "f_KnowleContent": f_KnowleContent,
                    "f_KnowleCreateDT": "",
                    "knowLedgeFiles": _postKnowLedgeFileArr,
                    "userID": _userIdName,
                    //分类
                    "dsNum":$('#classify').val(),
                    "dsName":name
                },
                beforeSend: function () {

                },

                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success: function (data) {
                    $('#theLoading').modal('hide');

                    if(data == 2){
                        myAlter('名称重复');
                    }else if(data == 3){
                        myAlter('执行失败')
                    }else if(data == 18){
                        myAlter('上传文件个数最多为18个')
                    }else if(data == 99){
                        myAlter('添加成功');
                        $('#myModal').modal('hide');

                        //重新获取后台数据
                        getShowKnowledgeData('');

                        //对表格进行重绘
                        ajaxSuccess1(_knowledgeDataArr);
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');


                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        myAlter("超时");
                    }else{
                        myAlter("请求失败！");
                    }

                }
            });
        });

    });

    //查看知识库
    $('#browse-datatables_wrapper tbody').on('click','.option-see',function(){


        //获取当前id
        var _postID = $(this).parents('tr').find('td').eq(1).html();

        //根据ID获取后台数据
        $.ajax({
            type: 'get',
            url: _urls + "YWKnowledge/GetOneKnowledge",
            timeout: theTimes,
            data:{
                'knowledgeID': _postID
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success: function (data) {
                $('#theLoading').modal('hide');
                $('#see-myModal').modal('show');
                $('#see-myModal .btn-primary').removeClass('hidden');

                //标题
                $('#see-myModal .knowledge-title').val(data.f_KnowleTitle);
                //摘要
                $('#see-myModal .textarea1').val(data.f_KnowleDigest);
                //关键字
                $('#see-myModal .textarea2').val(data.f_KnowleKeyword);
                //内容
                $('#see-myModal .textarea3').val(data.f_KnowleContent);
                //分类
                $('#classify1').val(data.dsNum);
                //附件
                var fileHtml = '';
                if(data.knowLedgeFiles.length == 0){
                    $('#see-myModal .btn-primary').addClass('hidden');
                }
                $(data.knowLedgeFiles).each(function(i,o){

                    var fileName = o.f_FileAllPath.split("/").pop();

                    var string1 = "bmp,jpg, png ,tiff,gif,pcx,tga,exif,fpx,svg,psd";

                    if(string1.indexOf(o.f_FileExtension) != -1){
                        fileHtml += '<div id="' + o.pK_KnowledgeFileID + '" class="file-item thumbnail">' +
                            '<img src="'+ o.f_FileAllPath+'">' +
                            '<div class="info" title="'+fileName+'">' + fileName + '</div>' +
                            '<div><a href="'+o.f_FileAllPath+'" title="右击文件另存为">下载</a></div>'+
                            '</div>'

                    }else{
                        fileHtml += '<div id="' + o.pK_KnowledgeFileID  + '" class="file-item thumbnail">' +
                            '<span>不能预览</span>' +
                            '<div class="info" title="'+fileName+'">' + fileName + '</div>' +
                            '<div><a href="'+o.f_FileAllPath+'" title="右击文件另存为">下载</a></div>'+
                            '</div>'
                    }


                });
                //把附件放到页面中
                $('#see-myModal .uploader-list-show').html(fileHtml);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }
        });

    });

    //修改知识库
    $('#browse-datatables_wrapper tbody').on('click','.option-edite',function(){

        //获取当前id
        var _postID = $(this).parents('tr').find('td').eq(1).html();

        //根据ID获取后台数据
        $.ajax({
            type: 'get',
            url: _urls + "YWKnowledge/GetOneKnowledge",
            timeout: theTimes,
            data:{
                'knowledgeID': _postID
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success: function (data) {

                $('#theLoading').modal('hide');
                $('#myModal').modal('show');
                $('#myModal .modal-title').html('知识信息');
                $('#myModal #delBtn').removeClass('hidden');
                $('#myModal #thelist0').html('');
                $('#thelist').html('');
                _postKnowLedgeFileArr = [];
                //标题
                $('#myModal .knowledge-title').val(data.f_KnowleTitle);
                //摘要
                $('#myModal .textarea1').val(data.f_KnowleDigest);
                //关键字
                $('#myModal .textarea2').val(data.f_KnowleKeyword);
                //内容
                $('#myModal .textarea3').val(data.f_KnowleContent);
                //设备分类
                $('#classify').val(data.dsNum);
                //附件
                var fileHtml = '';

                $(data.knowLedgeFiles).each(function(i,o){

                    var fileName = o.f_FileAllPath.split("/").pop();

                    var string1 = "bmp,jpg, png ,tiff,gif,pcx,tga,exif,fpx,svg,psd";

                    if(string1.indexOf(o.f_FileExtension) != -1){
                        fileHtml += '<div id="' + o.pK_KnowledgeFileID + '" class="file-item thumbnail"' +
                            'path = "'+o.f_FilePath+'" ext="'+o.f_FileExtension+'" size="'+ o.f_FileSize+'">' +
                            '<img src="'+ o.f_FileAllPath+'">' +
                            '<div class="info" title="'+fileName+'">' + fileName + '</div>' +
                            '<p class="state">已上传...</p>' +
                            '<div class="del-files"><a href="javascript:;" >删除</a></div>'+
                            '</div>'

                    }else{
                        fileHtml += '<div id="' + o.pK_KnowledgeFileID + '" class="file-item thumbnail"' +
                            'path = "'+o.f_FilePath+'" ext="'+o.f_FileExtension+'" size="'+ o.f_FileSize+'">' +
                            '<span>不能预览</span>' +
                            '<div class="info" title="'+fileName+'">' + fileName + '</div>' +
                            '<p class="state">已上传...</p>' +
                            '<div class="del-files"><a href="javascript:;" >删除</a></div>'+
                            '</div>'
                    }


                });
                ////把附件放到页面中
                $('#myModal #thelist0').html(fileHtml);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }
        });

        //把修改后的数据返回给后台
        $('#myModal .btn-primary').off('click');

        $('#myModal .btn-primary').on('click',function(){

            if(!ifAllShouldWrite('#myModal')){
                return false;
            };

            //获取标题
            var f_KnowleTitle = $('#knowledge-title').val();
            //获取摘要
            var f_KnowleDigest = $('#myModal .textarea1').val();
            //获取关键词
            var f_KnowleKeyword = $('#myModal .textarea2').val();
            //获取内容
            var f_KnowleContent = $('#myModal .textarea3').val();


            //获取附件
            var fileNum = $('#thelist0 .thumbnail').length;
            for(var i=0; i<fileNum; i++){

                //创建文件信息对象
                var obj = {};
                //文件大小
                obj.f_FileSize = $('#thelist0 .thumbnail').eq(i).attr('size');
                //文件id
                obj.pK_KnowledgeFileID = $('#thelist0 .thumbnail').eq(i).attr('id');

                //文件扩展名
                obj.f_FileExtension = $('#thelist0 .thumbnail').eq(i).attr('ext');
                //文件路径
                obj.f_FilePath = $('#thelist0 .thumbnail').eq(i).attr('path');

                //是否需要删除
                if($('#thelist0 .thumbnail').eq(i).hasClass('hasChecked')){

                    obj.fileUploadFlag = 1;
                }else{
                    obj.fileUploadFlag = 0;
                }

                //把信息对象加入集合中
                _postKnowLedgeFileArr.push(obj);
            }

            //获取知识库分类
            //设备分类
            var name = '';

            if($('#classify').val() == ''){

                name = '';

            }else{

                name = $('#classify').children('option:selected').html();

            }

            //数据传递给后台
            $.ajax({
                type: 'post',
                url: _urls + "YWKnowledge/EditKnowledge",
                timeout: theTimes,
                data:{
                    "pK_KnowledgeID": _postID,
                    "fK_Type_Knowledge": 0,
                    "f_KnowleTitle": f_KnowleTitle,
                    "f_KnowleDigest": f_KnowleDigest,
                    "f_KnowleKeyword": f_KnowleKeyword,
                    "f_KnowleContent": f_KnowleContent,
                    "f_KnowleCreateDT": "",
                    "knowLedgeFiles": _postKnowLedgeFileArr,
                    "userID": _userIdName,
                    //分类
                    "dsNum":$('#classify').val(),
                    "dsName":name
                },
                beforeSend: function () {

                },

                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success: function (data) {
                    $('#theLoading').modal('hide');
                    if(data == 2){
                        myAlter('名称重复');
                    }else if(data == 3){
                        myAlter('执行失败')
                    }else if(data == 18){
                        myAlter('上传文件个数最多为18个')
                    }else if(data == 99){
                        myAlter('修改成功');
                        $('#myModal').modal('hide');

                        //重新获取后台数据
                        getShowKnowledgeData('',true);
                        ////对表格进行重绘
                        //ajaxSuccess1(_knowledgeDataArr);
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        myAlter("超时");
                    }else{
                        myAlter("请求失败！");
                    }

                }
            });
        });

    });

    //删除知识库
    $('#browse-datatables_wrapper tbody').on('click','.option-delete ',function(){

        //获取当前id
        var _postID = $(this).parents('tr').find('td').eq(1).html();
        //获取标题
        var title = $(this).parents('tr').find('td').eq(2).html();
        $('#sure-remove').modal('show');

        $('#sure-remove p b').html(title);
        //点击确定后
        $('#sure-remove .btn-primary').off('click');
        $('#sure-remove .btn-primary').on('click',function(){

            $('#sure-remove').modal('hide');
            //根据ID获取后台数据
            $.ajax({
                type: 'post',
                url: _urls + "YWKnowledge/DelKnowledge",
                timeout: theTimes,
                data: JSON.stringify({ 'PK_KnowledgeID': _postID,UserID:_userIdName }),
                contentType:'application/json',
                beforeSend: function () {

                },
                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success: function (data) {
                    $('#theLoading').modal('hide');

                    //重新获取后台数据
                    getShowKnowledgeData('',true);
                    ////对表格进行重绘
                    //ajaxSuccess1(_knowledgeDataArr);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        myAlter("超时");
                    }else{
                        myAlter("请求失败！");
                    }

                }
            });

        });

    });


});
var zNodes = [];
//获取本地url
var _urls = sessionStorage.getItem("apiUrlPrefixYW");

//获取用户名
var _userIdName = sessionStorage.getItem('userName');

//当前上传路径
var _currentPath = '';

//传递给后台的文件信息集合
var _postKnowLedgeFileArr = [];

//页面展示数据
var _knowledgeDataArr = [];

//获取后台初始数据

getShowKnowledgeData('');

function getShowKnowledgeData(knowTitle,flag){

    $.ajax({
        type: 'get',
        url: _urls + "YWKnowledge/GetAllKnowledges",
        timeout: theTimes,
        data:{
            "knowleTitle" : knowTitle,
            "dsNum":$('#classSelect').val()

        },
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            _knowledgeDataArr = data;
            if(data.length > 0){
                _knowledgeDataArr.reverse();
            }
            //判断是否需要停留在当前页
            if(flag){
                jumpNow($('#browse-datatables'), _knowledgeDataArr)
            }else{
                //对表格进行重绘
                ajaxSuccess1(_knowledgeDataArr)
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

//点击回车键时触发
$(document).on('keydown',function(e){
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which;

    if(code == 13 && $('#myModal').hasClass('in') == false){

        $('.btn1').click();
        return false;
    }
});

//给选中的行加高亮属性
$('#browse-datatables tbody').on('click','tr',function(){

    $('#browse-datatables tbody tr').removeClass('tables-hover');

    $(this).addClass('tables-hover');
});


/*----------------------------上传文件-------------------------------*/
var $list=$("#thelist");//上传区域
var $btn =$("#ctlBtn");//上传按钮
var thumbnailWidth = 100;
var thumbnailHeight = 100;

//初始化设置
var uploader = WebUploader.create({
    //选完文件是否上传
    /*auto:true,*/
    //swf的路径
    swf:'webuploader/Uploader.swf',
    //文件接收服务端
    server: _urls + 'YWKnowledge/KnowledgeFileUploadProgress',
    pick: {
        id:'#picker',
        //multiple:false
    },
    fileSingleSizeLimit:20*1000*1000,   //设定单个文件大小

    //允许传入的类型
    accept: {
        title: '',
        extensions: 'pdf,gif,jpg,jpeg,png,bmp,doc,docx,ppt,pptx,pps,xls,xlsx,pot,pps,vsd,rtf,wps,et,dps,txt,rar,zip,7Z,dwg',
        mimeTypes: ''
    },
    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
    resize: false,

    //添加多个
    fileNumLimit:18,
    //thumb
    //thumb:false,
    //是否可选择同一文件
    duplicate:true
});
//uploader.on( 'beforeFileQueued',function(file){
//    if( uploader.getFiles().length >0){
//        //就不要再往队列里添加了
//        uploader.reset();
//        uploader.addFiles( file );
//    }
//} );
uploader.on("error",function (type){

    console.log(type);

    if (type=="Q_TYPE_DENIED"){
        myAlter("上传文件格式不支持");
    }else if(type=="F_EXCEED_SIZE"){
        myAlter("文件大小不能超过20M");
    }
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

    _currentPath = response;
    //创建文件信息对象
    var obj = {};
    //文件大小
    obj.f_FileSize = file.size;
    //文件id
    obj.pK_KnowledgeFileID = file.id;

    //文件扩展名
    obj.f_FileExtension = file.ext;
    //文件路径
    obj.f_FilePath = _currentPath;
    //文件上传标识
    obj.fileUploadFlag = 0;
    //把信息对象加入集合中
    _postKnowLedgeFileArr.push(obj);

    $( '#'+file.id ).find('p.state').text('已上传');
    $( '#'+file.id).append('<p class="remove-img"><a href="javascript:;">删除</a></p>');
});

uploader.on( 'uploadError', function( file ) {

    $( '#'+file.id ).find('p.state').text('上传出错');
    myAlter('上传错误');
    $( '#'+file.id ).remove();

});

uploader.on( 'uploadComplete', function( file ) {
    $( '#'+file.id ).find('.progress').fadeOut();
});

$btn.click(function(){
    uploader.upload();
});

$('#thelist').on('click','.remove-img',function(){

    var id = $(this).parents('.file-item').attr('id');
    var path ;

    $(_postKnowLedgeFileArr).each(function(i,o){

        if(o.pK_KnowledgeFileID == id){
            _postKnowLedgeFileArr.splice(i,1);
            path = o.f_FilePath;
        }
    });
    //页面删掉
    $(this).parents('.file-item').remove();
    //队列删除
    //uploader.removeFile($(this)[0].id,true);
    removeImg(path);
});

//点击已上传的文件时


    $('#thelist0').on('click','.del-files',function(){

        if($(this).parents('.file-item').hasClass('hasChecked')){

            $(this).parents('.file-item').removeClass('hasChecked');
            $(this).find('a').html('删除');
        }else{
            $(this).parents('.file-item').addClass('hasChecked');
            $(this).find('a').html('取消');
        }
    });

//删除已经上传的文件

//$('#thelist0').on('click','.del-files',function(){
//
//
//        var _uploaderPath = $(this).parents('.thumbnail').attr('path');
//        var dom = $(this).parents('.thumbnail');
//
//        console.log(_uploaderPath);
//        var fileNamePath = {
//            '': _uploaderPath
//        }
//        $.ajax({
//            type:'post',
//            url:_urls + 'News/DelUploadImageFile',
//            data:fileNamePath,
//            success:function(result){
//                if(result == 99){
//                    //成功；
//                    myAlter('删除成功');
//                    //清除队列中的文件(路径为空)
//                    //队列文件清空
//                  dom.remove();
//                }else if( result == 3 ){
//                    myAlter('删除失败！') ;
//                }
//            },
//            error:function(jqXHR, textStatus, errorThrown){
//                var info = JSON.parse(jqXHR.responseText).message;
//                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
//                    myAlter("超时");
//                }else{
//                    myAlter(info);
//                }
//
//            }
//        })
//
//
//});

function removeImg(_uploaderPath){
    var fileNamePath = {
        '': _uploaderPath
    }
    $.ajax({
        type:'post',
        url:_urls + 'News/DelUploadImageFile',
        data:fileNamePath,
        success:function(result){
            if(result == 99){
                //成功；
                myAlter('删除成功');
                //清除队列中的文件(路径为空)
                //队列文件清空
                dom.remove();
            }else if( result == 3 ){
                myAlter('删除失败！') ;
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            var info = JSON.parse(jqXHR.responseText).message;
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter(info);
            }

        }
    })
}



function download(){
    downloadFile('http://192.168.1.104/BEEWebAPI\YWFile//KnowledgesFile\fdjj.png');
}
// 直接下载，用户体验好
window.downloadFile = function (sUrl) {

    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.');
        return false;
    }

    //If in Chrome or Safari - download via virtual link click
    if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;

        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
        sUrl += '?download';
    }

    window.open(sUrl, '_self');
    return true;
}

function downloadFile(url) {
    try{
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    }catch(e){

    }
}


window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

//判断必填项是否填写
function ifAllShouldWrite(dom){

    var checkNum = $(dom).find('.colorTip').length;

    for(var i=0; i<checkNum; i++){

        if($(dom).find('.colorTip').eq(i).parent('tr').find('input').val() == ''){

            var txt = $(dom).find('.colorTip').eq(i).html().split('*')[0];
            myAlter(txt + " 不能为空")
            getFocus1($(dom).find('.input-label').eq(i).next().find('input'));
            return false;
        }
    }

    return true;
};

//提交更改后跳转到当前页
function jumpNow(tableID,arr){
    var dom = '#' + tableID[0].id + '_paginate';
    var txt = $(dom).children('span').children('.current').html();

    ajaxSuccess1(arr);
    var num = txt - 1;
    var dom = $(dom).children('span').children().eq(num);
    dom.click();
}

//分类接口
function classFun(){

    $.ajax({

        type:'post',
        url:_urls + 'YWDev/ywDMGetDSs',
        data:{

            "userID": sessionStorage.getItem('userName'),
            "userName": sessionStorage.getItem('realUserName'),

        },
        timeout:_theTimes,
        success:function(result){

            if(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].dsNum +
                        '">' + result[i].dsName +
                        '</option>'

                }

                $('.classify').empty().append(str);

            }

        },
        error:function(jqXHR, textStatus, errorThrown){
            var info = JSON.parse(jqXHR.responseText).message;
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter(info);
            }

        }

    })

}