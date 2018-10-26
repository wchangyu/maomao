console.log(11111111)
var zNodes = [];
//获取本地url
var _urls = sessionStorage.getItem("apiUrlPrefixYW");

//获取用户名
var _userIdName = sessionStorage.getItem('userName');

//当前上传路径
var _currentPath = '';

//传递给后台的文件信息集合
var _my_postKnowLedgeFileArr = [];

//页面展示数据
var _knowledgeDataArr = [];


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

console.log(uploader)
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

var myyulanlen = 0;
//添加东西之后判断是否能预览，如果是图片能预览，否则反之，
uploader.on( 'fileQueued', function( file ) {
    myyulanlen++
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
    //文件名字
    obj.f_FileName = file.name;
    //文件在服务器的完整路径
    obj.f_FileAllPath = response;
    //文件上传日期
    obj.f_UploadDT = _my_getNowFormatDate()

    //把信息对象加入集合中
    _my_postKnowLedgeFileArr.push(obj);

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

    $(_my_postKnowLedgeFileArr).each(function(i,o){

        if(o.pK_KnowledgeFileID == id){
            _my_postKnowLedgeFileArr.splice(i,1);
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
                // dom.remove();
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


function _my_getNowFormatDate() {
    var date = new Date();
    var seperator1 = "/";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + "/" + month + "/" + strDate;
    return currentdate;
}