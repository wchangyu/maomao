/**
 * Created by admin on 2018/10/25.
 */

//改变时间
$('.user-search .choose-time').on('click',function(){

    $('.user-search .choose-time').removeClass('chooses');

    $(this).addClass('chooses');

    //获取当前日期类型
    var dataType = $(this).html();

    _selectTime(dataType);
});
_timeYMDComponentsFun($('.datatimeblock'));

/*---------------------------------------变量-----------------------------------------*/

var xiangmu_urls = sessionStorage.getItem("apiprovincialproject");

var hh = {};
    hh['ui'] = {};
    hh.ui['xiangmu'] = {
        data: {
            cache:[],
            xiangmujindulist: [],
            xiangmujindulistflag: false,
            hezuofangshilist: [],
            hezuofangshilistflag: false,
            epcleixinglist: [],
            epcleixinglistflag: false,
            resetNum: 0,
            addOrEditFlag: false
        }
    }
var uploader = null;
var _postKnowLedgeFileArr = [];
/*----------------------------上传文件-------------------------------*/
var $list=$("#thelist");//上传区域
var $btn =$("#ctlBtn");//上传按钮
var thumbnailWidth = 100;
var thumbnailHeight = 100;

    //获取单位类型
    var danweileixinglist = null;
        getdanweileixinglist()
        function getdanweileixinglist(){
            $.ajax({
                type: "GET",
                cache: false,
                url:xiangmu_urls + 'ProvincialProject/GetAllProjRemouldMode',
                success: function (res) {
                    if(res.code == 99){
                        danweileixinglist = res.data;
                    }
                    if(res.code == 3){
                        myAlter(res.message)
                    }
                    if(res.code == 1){
                        myAlter(res.message||"参数填写错误，请检查！")
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    Metronic.stopPageLoading();
                    pageContentBody.html('<h4>Could not load the requested content.</h4>');
                }
            });
        }

    //获取合作方式
    var hezuofangshilist = null;
        gethezuofangshilist();
        function gethezuofangshilist(){
            var url = xiangmu_urls + "ProvincialProject/GetALLProvincProjCollaborate";
            $.ajax({
                type: "GET",
                cache: false,
                url: url,
                success: function (res) {
                    if(res.code == 99){
                        hezuofangshilist = res.data;
                    }
                    if(res.code == 3){
                        myAlter(res.message)
                    }
                    if(res.code == 1){
                        myAlter(res.message||"参数填写错误，请检查！")
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    Metronic.stopPageLoading();
                    pageContentBody.html('<h4>Could not load the requested content.</h4>');
                }
            });
        }

    //获取项目实施进度
    var xiangmushishijindulist = null;
        getxiangmushishijindu();
        function getxiangmushishijindu(){
            $.ajax({
                type: "GET",
                cache: false,
                url:xiangmu_urls + 'ProvincialProject/GetAllProjSchedule',
                success: function (res) {

                    if(res.code == 99){
                        xiangmushishijindulist = res.data;
                    }
                    if(res.code == 3){
                        myAlter(res.message)
                    }
                    if(res.code == 1){
                        myAlter(res.message||"参数填写错误，请检查！")
                    }


                    var data = res.data;
                    var optionstring = "";
                    $.each(data,function(key,value){  //循环遍历后台传过来的json数据
                        optionstring += "<option value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
                    });
                    $("#xiangmushishijindu").html("<option value=''>请选择项目实施进度</option> "+optionstring); //获得要赋值的select的id，进行赋值

                    $("#xiangmushishijindu").change(function(data){
                        var text = $("#xiangmushishijindu").find("option:selected").text();
                        var val = $("#xiangmushishijindu").val();
                        if(val == "" || val == undefined){
                            return
                        }
                    });

                }.bind(this),
                error: function (xhr, ajaxOptions, thrownError) {
                    Metronic.stopPageLoading();
                    pageContentBody.html('<h4>Could not load the requested content.</h4>');
                }
            });
        }

    //获取epc类型
    var epcleixinglist = null;
        getALLProvincProjEPCType();
        function getALLProvincProjEPCType() {
            var url = xiangmu_urls + "ProvincialProject/GetALLProvincProjEPCType";
            $.ajax({
                type: "GET",
                cache: false,
                url: url,
                success: function (res) {
                    if(res.code == 99){
                        var data = res.data;
                        if(data == ""){

                        }else{
                            hh.ui.xiangmu.data.epcleixinglistflag = true;
                            hh.ui.xiangmu.data.epcleixinglist = data;
                            epcleixinglist = data;
                        }
                        
                    }
                    if(res.code == 3){
                        myAlter(res.message)
                    }
                    if(res.code == 1){
                        myAlter(res.message||"参数填写错误，请检查！")
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    Metronic.stopPageLoading();
                    pageContentBody.html('<h4>Could not load the requested content.</h4>');
                }
            });
        }
    


function unlockDisabled(){
    $("#xiangmu input").attr("disabled",false);
    $("#xiangmu select").attr("disabled",false);
    $("#xiangmu textarea").attr("disabled",false);
    $('.danweimingcheng').attr("disabled",true);
    $('.suoshuquyu').attr("disabled",true);
    $('.danweileixing').attr("disabled",true);
}

function lockDisabled(){
    $("#xiangmu input").attr("disabled",true);
    $("#xiangmu select").attr("disabled",true);
    $("#xiangmu textarea").attr("disabled",true);
    $('.danweimingcheng').attr("disabled",true);
    $('.suoshuquyu').attr("disabled",true);
    $('.danweileixing').attr("disabled",true);

    $("#see-Modal input").attr("disabled",true);
    $("#see-Modal select").attr("disabled",true);
    $("#see-Modal textarea").attr("disabled",true);
    $('.danweimingcheng').attr("disabled",true);
    $('.suoshuquyu').attr("disabled",true);
}


//合作方式触发的事件
$("#hezuofangshi").change(hezuofangshievt);
function hezuofangshievt(){
    var attr = $("#hezuofangshi").find("option:selected").attr('cstFlag');
    var val = $("#hezuofangshi").val();

    getxiangmuleixingbyhezuofangshiid( val )
    if(attr == 1){
        getEpcBycstflag( attr )
        //清除项目类型的所有值包括星星
        $('#epcleixing').attr("disabled",false);
        $('#epcleixing').prev().children(".redxing").html('*')
    }else{
        $("#epcleixing").html("");
        $('#epcleixing').attr("disabled",true);
        $('#epcleixing').prev().children(".redxing").html('')
    }
}

function getEpcBycstflag(cstflag) {
    var url = xiangmu_urls + "ProvincialProject/GetALLProvincProjEPCType";
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 99){
                var data = res.data;
                var optionstring = "";
                $.each(data,function(key,value){  //循环遍历后台传过来的json数据
                    optionstring += "<option itemKey=\"" + value.itemKey + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
                });
                $("#epcleixing").html(optionstring); //获得要赋值的select的id，进行赋值
            }
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}

function  getxiangmuleixingbyhezuofangshiid ( id ){
    var url = xiangmu_urls + "ProvincialProject/GetOneProjRemouldMode?collaborateWay="+id;
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }
            if(res.code == 99){
                var data = res.data;
                var optionstring = "";
                if(data == ""){
                     myAlter("此合作方式项目类型为空,请更换合作方式")
                }
                $.each(data,function(key,value){
                    optionstring += "<option suoshuid=\"" + value.fK_CollaborateWay  + "\" value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
                });
                $("#xiangmuleixing").html(optionstring);
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}

//点击按钮验证
function validform(){
    return $('#xiangmu').validate({
        onfocusout: function(element) { $(element).valid()},
        rules:{
            //单位名称
            'danweimingcheng':{
                required: true,
            },
            //所属区域
            'suoshuquyu':{
                required: true
            },
            'danweileixing':{
                required: true
            },
            'xiangmumingcheng':{
                required: true
            },
            'gaizaomianji': {
                required: true,
                numberFormat1:true
            },
            'touzie':{
                numberFormat1:true,
                required: true
            },
            'shishidanwei':{
                required: true,
            },
            'qianyuejienenglv':{
                required: true,
                numberFormat1:true,
            },
            'caigoujihuaxiadashijian': {
                required: true,
                isDate: true
            },
            'zhaobiaoshijian': {
                required: true,
                isDate: true
            },
            'hetongshijian': {
                required: true,
                isDate: true
            },
            'yanshoushijian': {
                required: true,
                isDate: true
            },
            'guanlianjianzhu': {
                required: false
            },
            'xiangmushishijindu': {
                required: true,
            },
            'xiangmuleixing': {
                required: true,
            }

        },
        messages:{
            'danweimingcheng':{
                required: '请输入单位名称'
            },
            'suoshuquyu':{
                required: '请输入所属区域'
            },
            'danweileixing':{
                required: '请选择单位类型'
            },
            'xiangmumingcheng':{
                required: "请输入项目名称"
            },
            'gaizaomianji': {
                required: "请输入改造面积"
            },
            'touzie':{
                required: "请输入投资额"
            },
            'shishidanwei':{
                required: "请输入实施单位",
            },
            'qianyuejienenglv':{
                required: "请输入签约节能率",
            },
            'caigoujihuaxiadashijian': {
                required: "请输入采购计划下达时间",
            },
            'zhaobiaoshijian': {
                required: "请输入招标时间",
            },
            'hetongshijian': {
                required: "请输入合同时间",
            },
            'yanshoushijian': {
                required: "请输入验收时间",
            },
            'xiangmushishijindu': {
                required: "请选择项目实施进度",
            },
            'xiangmuleixing': {
                required: "项目类型不能为空",
            }
        }
    });
}


function getEpcTextByItemkey( key ){
        if(epcleixinglist){
            for (var i = 0; i < epcleixinglist.length; i++) {
                var item = epcleixinglist[i];
                if(item.itemKey == key){
                    return item.cstName;
                }
            }
        }
        return key
}

//初始化alert
function myAlter(string){
    $('#my-alert').modal('show');
    $('#my-alert p b').html(string);
}

//初始化
function createModeInit(){
    //将所有label .error验证隐藏
    var label = $('#create-Modal').find('label');

    for(var i=0;i<label.length;i++){

        var attr = $(label).eq(i).attr('class')

        if(attr){

            if(attr.indexOf('error')>-1){

                label.eq(i).hide();

            }
        }

    }

    _isExist = '';
}

//初始化updateloader
function creatUpdateLoader(){
        //初始化设置
        if(uploader !=null){
            return
        }
        uploader = WebUploader.create({
            //选完文件是否上传
            /*auto:true,*/
            //swf的路径
            swf:'webuploader/Uploader.swf',
            //文件接收服务端
            // POST /api/ProvincialProject/ProjRemouldInfoFileUpload
            server: xiangmu_urls + 'ProvincialProject/ProjRemouldInfoFileUpload',
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

        uploader.on("error",function (type){
            if (type=="Q_TYPE_DENIED"){
                myAlter("上传文件格式不支持");
            }else if(type=="F_EXCEED_SIZE"){
                myAlter("文件大小不能超过20M");
            }
        });

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
        //添加东西之后判断是否能预览，如果是图片能预览，否则反之，
        uploader.on( 'fileQueued', function( file ) {
            //我现在就是想要实现单文件上传
            var $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail col-md-4">' +
                    '<img class="yulan">' +
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
                    // $img.replaceWith('<span>不能预览</span>');
                    $img.attr( 'src', './img/weizhi.jpg' );
                    return;
                }

                $img.attr( 'src', src );
            }, thumbnailWidth, thumbnailHeight );
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
            obj.f_FileName = file.name;
            //文件扩展名
            obj.f_FileExtension = file.ext;
            //文件路径
            obj.f_FilePath = response.data.f_FilePath;
            //文件上传标识
            obj.fileUploadFlag = 0;
            obj.f_UploadDT = response.data.f_UploadDT;
            // obj.filedata = JSON.stringify(file);
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
}

//删除指定img
function removeImg(_uploaderPath){
        var fileNamePath = {
            '': _uploaderPath
        }
        $.ajax({
            type:'post',
            url:xiangmu_urls + 'News/DelUploadImageFile',
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


function selectAllData(){
    var xiangmumingchengselect = $("#xiangmumingchengselect").val();
    // POST /api/ProvincialProject/GetProjRemouldInfoByName
    var url = xiangmu_urls + "ProvincialProject/GetProjRemouldInfoByName";
    $.ajax({
        type: "post",
        cache: false,
        url: url,
        data: {
            f_ProjName: xiangmumingchengselect
        },
        success: function (res) {
            if(res.code == 99){
                if(res.data == ""){
                    res.data = [];
                    myAlter(res.message)
                }
                setTableData(res.data)
            }
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}


function setTableData( arr ) {
    hh.ui.xiangmu.data.cache = arr;
    _my_creatTableData( arr )
}

//根据itemkey获取合作方式对应名称
function getHezuofangshiByItemKey(itemkey){
    if(hezuofangshilist){
        for (var i = 0; i < hezuofangshilist.length; i++) {
            var item = hezuofangshilist[i];
            if(item.itemKey == itemkey){
                return item.cstName
            }
        }
    }
    return itemkey
}

//根据 itemkey 获取项目进度的对应名称
function getXiangmujinduByItemKey( itemkey ){
    if(xiangmushishijindulist){
        for (var i = 0; i < xiangmushishijindulist.length; i++) {
            var item = xiangmushishijindulist[i];
            if(item.itemKey == itemkey){
                return item.cstName
            }
        }
    }
    return itemkey
}


function getXiangmuInfoByID( id ) {
    if(hh.ui.xiangmu.data.cache){
        for (var i = 0; i < hh.ui.xiangmu.data.cache.length; i++) {
            var item = hh.ui.xiangmu.data.cache[i];
            if(item.pK_ProjRemouldInfo == id){
                return item;
            }
        }
    }
    return null;
}


//合作方式触发的事件
function hezuofangshievt_xiugai( hezuofangshitype, epctype){
    var attr = $("#hezuofangshi").find("option:selected").attr('cstFlag');
    var val = $("#hezuofangshi").val();
    console.log(hezuofangshitype,'合作方式type')
    getxiangmuleixingbyhezuofangshiid_xiugai( val, hezuofangshitype )
    if(attr == 1){
        getEpcBycstflag_xiugai( attr )
        //清除项目类型的所有值包括星星
        $('#epcleixing').attr("disabled",false);
        $('#epcleixing').prev().children(".redxing").html('*')
    }else{
        $("#epcleixing").html("");
        $('#epcleixing').attr("disabled",true);
        $('#epcleixing').prev().children(".redxing").html("")
    }
}

function getEpcBycstflag_xiugai(cstflag) {
    var url = xiangmu_urls + "ProvincialProject/GetALLProvincProjEPCType";
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 99){
                var data = res.data;
                var optionstring = "";
                $.each(data,function(key,value){  //循环遍历后台传过来的json数据
                    optionstring += "<option itemKey=\"" + value.itemKey + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
                });
                $("#epcleixing").html(optionstring); //获得要赋值的select的id，进行赋值
            }
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}

function  getxiangmuleixingbyhezuofangshiid_xiugai ( id, hezuofangshitype ){
    var url = xiangmu_urls + "ProvincialProject/GetOneProjRemouldMode?collaborateWay="+id;
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }
            if(res.code == 99){
                var data = res.data;
                var optionstring = "";
                if(data == ""){
                    myAlter("此合作方式项目类型为空,请更换合作方式")
                }
                $.each(data,function(key,value){
                    optionstring += "<option suoshuid=\"" + value.fK_CollaborateWay  + "\" value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
                });
                $("#xiangmuleixing").html(optionstring);
                console.log(optionstring)
                setTimeout(function(){
                    console.log($("#xiangmuleixing").html())
                    $('#xiangmuleixing').val(hezuofangshitype||"")
                }.bind(this),200)

            }

        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}



function startSetItemData(){
    // hh.ui.xiangmu.data.itemdata
    var data = hh.ui.xiangmu.data.itemdata;
    $('.danweimingcheng').val(data.f_UnitName||"")
    $('.suoshuquyu').val(data.f_DistrictID||"")
    //当前单位类型
    $('.danweileixing').val(data.f_PointerClass||"")
    //当前项目名称
    $('.xiangmumingcheng').val(data.f_ProjName||"")

    //当前合作方式
    $('.hezuofangshi').val(data.f_ProjCollaborate||"")

    //当前项目类型
    var hezuofangshitype = data.fK_ProjRemouldMode;
    //当前epc类型
    var epctype = data.f_ProjEPCType
    // f_ProjEPCType: epcleixing,
    hezuofangshievt_xiugai( hezuofangshitype, epctype)

    //当前改造面积
    $('.gaizaomianji').val(data.f_RemouldArea||"")
    //当前投资额
    $('.touzie').val(data.f_Investment||"")
    //当前实施单位
    $('.shishidanwei').val(data.f_ImplementUnit||"")
    //当前签约节能率
    $('.qianyuejienenglv').val(data.f_EnergySaving||"")
    //当前采购计划下达时间
    $('.caigoujihuaxiadashijian').val(data.f_ProcurementDT.split(" ")[0]||"")
    //当前招标时间
    $('.zhaobiaoshijian').val(data.f_TenderDT.split(" ")[0]||"")
    //当前合同时间
    $('.hetongshijian').val(data.f_ContractDT.split(" ")[0]||"")
    //当前验收时间
    $('.yanshoushijian').val(data.f_CheckAcceptDT.split(" ")[0]||"")
    //关联建筑
    $('.guanlianjianzhu').val(data.f_RelatePointer||"")
    //当前项目实施进度
    $('.xiangmushishijindu').val(data.f_ProjSchedule||"")
    //当前备注
    $('.beizhu').val(data.f_Mark||"")
    // 当前上传附件集合
    // projRemouldFiles: fujian
}

// 生成表格
function _my_creatTableData( arr ){
    $('#xiangmubiaoge').DataTable({
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
                title:'项目ID',
                data:'pK_ProjRemouldInfo',
                class:'hidden',
                render:function(data, index, row, meta){
                    return data;
                }
            },
            {
                title:'项目名称',
                data:'f_ProjName'
            },
            {
                title:'单位名称',
                data:'f_UnitName',
                // class:'hidden'
            },
            {
                title:'合作方式',
                data:'f_ProjCollaborate',
                render:function(data, index, row, meta){
                    return getHezuofangshiByItemKey( data )
                }
            },
            {
                title:'改造面积(平方米)',
                data:'f_RemouldArea'
            },
            {
                title:'合同时间',
                data:'f_ContractDT',
                render: function(data, index, row, meta){
                    return data.split(" ")[0]
                }
            },
            {
                title:'投资额(万元)',
                data:'f_Investment'
            },
            {
                title:'实施单位',
                data:'f_ImplementUnit'
            },
            {
                title:'项目进度',
                data:'f_ProjSchedule',
                render: function(data, index, row, meta){
                    return getXiangmujinduByItemKey( data )
                }
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
            }
        ],
        data: arr
    });
}

//存放所有数据
var _allData = [];

var _thisId = '';

var _isExist = '';
var pageContentBody = null;
var quyuid = null;
var resetObj = null;

$(function(){

    
    pageContentBody = $('.page-content .page-content-body');
    quyuid = window.sessionStorage.enterpriseID;
    resetObj = resetData(quyuid);
    if(resetObj == null){
        myAlter("请求数据错误,请刷新后重试")
    }

    


    //新增
    $('#createBtn').click(function(){
        unlockDisabled()
        _postKnowLedgeFileArr = [];
        $(".fujianshangchuan").css("display",'block')
        //loadding
        $('.L-container').showLoading();

        //初始化
        // createModeInit();
        $("#xiangmu").validate().resetForm();
        $(".error").removeClass("error");
        document.getElementById("xiangmu").reset();
        hh.ui.xiangmu.data.addOrEditFlag = false;
        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        $('.L-container').hideLoading();
        $('#thelist').html("")
        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        setTimeout(function(){
            creatUpdateLoader()
            uploader.reset();
        },500) 

        //单位名称
        $('#danweimingcheng').val(resetObj.eprName)
        //所属区域
        $('#suoshuquyu').val(resetObj.subDisName)
        
        //单位类型
        $("#danweileixing").val(resetObj.className)

        //合作方式
        var hezuofangshi = hezuofangshilist;
        if(hezuofangshi == null){
            myAlter("获取合作方式失败")
            return 
        }
        var optionstring = "";
        $.each(hezuofangshi,function(key,value){  //循环遍历后台传过来的json数据
            optionstring += "<option cstFlag=\"" + value.cstFlag + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
        });
        $("#hezuofangshi").html( optionstring);
        hezuofangshievt()

        //项目实施进度
        var xiangmushishijindu = xiangmushishijindulist;
        if(xiangmushishijindu == null){
            myAlter("获取项目实施进度列表失败")
            return 
        }
        var optionstring = "";
        $.each(xiangmushishijindu,function(key,value){  //循环遍历后台传过来的json数据
            optionstring += "<option value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
        });
        $("#xiangmushishijindu").html(optionstring); 
    })
    //编辑项目
    $('#xiangmubiaoge tbody').on('click','.option-edite',function(data, index){
        unlockDisabled()
        _postKnowLedgeFileArr = [];
        //获取当前项目在后台id
        setTimeout(function(){
            creatUpdateLoader()
            uploader.reset();
        },500)
        $(".fujianshangchuan").css("display",'hidden')
        var _postID = $(this).parents('tr').find('td').eq(0).html();
        var itemdata = getXiangmuInfoByID( _postID );
        hh.ui.xiangmu.data.addOrEditFlag = true;
        getProItemData(_postID, function(data){

            var datainfo = data[0];
            hh.ui.xiangmu.data.itemdata = itemdata;
            $('.L-container').showLoading();
            //初始化
            $("#xiangmu").validate().resetForm();
            $(".error").removeClass("error");
            //模态框
            _moTaiKuang($('#create-Modal'),'修改','','','','修改');
            $('.L-container').hideLoading();
            //类
            $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');
            //单位名称
            $('#danweimingcheng').val(datainfo.f_UnitName)
            //所属区域
            // $('#suoshuquyu').val(datainfo.f_DistrictID)
            $('#suoshuquyu').val(datainfo.districtName)
            //项目实施进度
            var xiangmushishijindu = xiangmushishijindulist;
            if(xiangmushishijindu == null){
                myAlter("获取项目实施进度列表失败")
                return 
            }
            var optionstring = "";
            $.each(xiangmushishijindu,function(key,value){  //循环遍历后台传过来的json数据
                optionstring += "<option value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
            });
            $("#xiangmushishijindu").html(optionstring);
            //当前项目名称
            $('.xiangmumingcheng').val(datainfo.f_ProjName||"")

            //当前合作方式
            $('.hezuofangshi').val(datainfo.f_ProjCollaborate||"")
            //根据合作方式id取项目类型

            //当前项目类型
            var hezuofangshitype = datainfo.fK_ProjRemouldMode;
            //当前epc类型
            var epctype = datainfo.f_ProjEPCType

            //当前改造面积
            $('.gaizaomianji').val(datainfo.f_RemouldArea||"")
            //当前投资额
            $('.touzie').val(datainfo.f_Investment||"")
            //当前实施单位
            $('.shishidanwei').val(datainfo.f_ImplementUnit||"")
            //当前签约节能率
            $('.qianyuejienenglv').val(datainfo.f_EnergySaving||"")
            //当前采购计划下达时间
            $('.caigoujihuaxiadashijian').val(datainfo.f_ProcurementDT.split(" ")[0]||"")
            //当前招标时间
            $('.zhaobiaoshijian').val(datainfo.f_TenderDT.split(" ")[0]||"")
            //当前合同时间
            $('.hetongshijian').val(datainfo.f_ContractDT.split(" ")[0]||"")
            //当前验收时间
            $('.yanshoushijian').val(datainfo.f_CheckAcceptDT.split(" ")[0]||"")
            //关联建筑
            $('.guanlianjianzhu').val(datainfo.f_RelatePointer||"")
            //当前项目实施进度
            $('.xiangmushishijindu').val(datainfo.f_ProjSchedule||"")
            //当前备注
            $('.beizhu').val(datainfo.f_Mark||"")

            //单位名称
            $('.danweimingcheng').val(datainfo.f_UnitName)
            $('.suoshuquyu').val(datainfo.districtName)

             //合作方式
            var hezuofangshi = hezuofangshilist;
            if(hezuofangshi == null){
                myAlter("获取合作方式失败")
                return 
            }
            var optionstring = "";
            $.each(hezuofangshi,function(key,value){  //循环遍历后台传过来的json数据
                optionstring += "<option cstFlag=\"" + value.cstFlag + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
            });
            $("#hezuofangshi").html( optionstring);
            //把合作方式设置为返回值
            $("#hezuofangshi").val(datainfo.f_ProjCollaborate)
            //开始回调地狱
            callbackHell(datainfo)

            setEditXiangmuleixing( datainfo.f_ProjCollaborate, datainfo.fK_ProjRemouldMode )


             //单位名称
            $('.danweimingcheng').val(datainfo.f_UnitName)
            $('.suoshuquyu').val(datainfo.districtName)
            $('.danweileixing').val(datainfo.pointerClass||"")
            //此处是请求项目的回调 取出里面的附件内容再进行展示 TODO
            //添加东西之后判断是否能预览，如果是图片能预览，否则反之，
            _postKnowLedgeFileArr = []
            _postKnowLedgeFileArr = data[0].projRemouldFiles;
            var imgaarr = data[0].projRemouldFiles;
            var $list = $("#thelist");
                $list.html("")
            for (var i = 0; i < imgaarr.length; i++) {
                var item = imgaarr[i];
                //类型
                var type = item.f_FileExtension;
                //路径
                var lujing = item.f_FileAllPath;
                //上传时间
                var time = item.f_UploadDT;
                //文件大小
                var size  = item.f_FileSize;
                //文件名字
                var name = item.f_FileName;
                var $li = $(
                        '<div id="' + item.pK_ProjRemouldFile + '" class="file-item thumbnail col-md-4">' +
                        '<img class="yulan">' +
                        '<div class="info">' + name + '</div>' +
                        '<div><p class="remove-img-bianji"><a href="javascript:;">删除</a></p></div>'+
                        '</div>'
                    );

                var $img = $li.find('img');
                if(type == "JPG" || type == "JPEG" || type == "PNG" || type == "jpg" || type == "jpeg" || type == "png"){
                    $img.attr( 'src', lujing );
                }else{
                    // $img.replaceWith('<span>不能预览</span>');
                    $img.attr( 'src', './img/weizhi.jpg' );
                }
                // $list为容器jQuery实例
                $list.append( $li );
            }
        })
    });

    // 查看项目
    $('#xiangmubiaoge tbody').on('click','.option-see',function(data, index){
        lockDisabled()
        _postKnowLedgeFileArr = []
        //获取当前项目在后台id
        var _postID = $(this).parents('tr').find('td').eq(0).html();
        var itemdata = getXiangmuInfoByID( _postID );
        hh.ui.xiangmu.data.addOrEditFlag = true;
        if(itemdata){
            getProItemData(_postID, function(data){
                //此处是请求项目的回调 取出里面的附件内容再进行展示 TODO
                //添加东西之后判断是否能预览，如果是图片能预览，否则反之，
                // 单位类型 
                $("#see-danweileixing").val(data[0].pointerClass); 
                var imgaarr = data[0].projRemouldFiles;
                var $list = $("#fujianlist");
                    $list.html("")
                for (var i = 0; i < imgaarr.length; i++) {
                    var item = imgaarr[i];
                    //类型
                    var type = item.f_FileExtension;
                    //路径
                    var lujing = item.f_FileAllPath;
                    //上传时间
                    var time = item.f_UploadDT;
                    //文件大小
                    var size  = item.f_FileSize;
                    //文件名字
                    var name = item.f_FileName;
                    var $li = $(
                            '<div id="' + '' + '" class="file-item thumbnail col-md-4">' +
                                '<img class="yulan ">' +
                                '<div class="info">' + name + '</div>' +
                                '<div><img class="tupiandiv  downloadwenjian img-responsive center-block" src="./img/xiazai.png" title="点击可以下载" data-myurl="'+ item.f_FileAllPath +'"/></div></div>'+
                            '</div>'
                        );

                    var $img = $li.find('img.yulan');
                    if(type == "JPG" || type == "JPEG" || type == "PNG" || type == "jpg" || type == "jpeg" || type == "png"){
                        $img.attr( 'src', lujing );
                    }else{
                        // $img.replaceWith('<span>不能预览</span>');
                        $img.attr( 'src', './img/weizhi.jpg' );
                        $img.attr( 'class', 'yulan' );
                    }
                    // $list为容器jQuery实例
                    $list.append( $li );
                }            


            })

            hh.ui.xiangmu.data.itemdata = itemdata;
            // $("#myModal-xiugai").modal('show');
                    //loadding
            $('.L-container').showLoading();

            //初始化
            // createModeInit();
            $("#xiangmu").validate().resetForm();
            $(".error").removeClass("error");
            //模态框
            _moTaiKuang($('#see-Modal'),'查看','','','','确认');

            $('.L-container').hideLoading();
            //类
            $('#see-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');
            //单位名称
            $('#see-danweimingcheng').val(resetObj.eprName)
            //所属区域
            $('#see-suoshuquyu').val(resetObj.subDisName)
            
            //项目名称
            $("#see-xiangmumingcheng").val(itemdata.f_ProjName)
            //合作方式
            $("#see-hezuofangshi").val(itemdata.projCollaborateName);
            //项目类型
            $('#see-xiangmuleixing').val(itemdata.pointerClass)

            //当前改造面积
            $('.gaizaomianji').val(itemdata.f_RemouldArea||"")
            //当前投资额
            $('.touzie').val(itemdata.f_Investment||"")
            //当前实施单位
            $('.shishidanwei').val(itemdata.f_ImplementUnit||"")
            //当前签约节能率
            $('.qianyuejienenglv').val(itemdata.f_EnergySaving||"")
            //当前采购计划下达时间
            $('.caigoujihuaxiadashijian').val(itemdata.f_ProcurementDT.split(" ")[0]||"")
            //当前招标时间
            $('.zhaobiaoshijian').val(itemdata.f_TenderDT.split(" ")[0]||"")
            //当前合同时间
            $('.hetongshijian').val(itemdata.f_ContractDT.split(" ")[0]||"")
            //当前验收时间
            $('.yanshoushijian').val(itemdata.f_CheckAcceptDT.split(" ")[0]||"")
            //关联建筑
            $('.guanlianjianzhu').val(itemdata.f_RelatePointer||"")
            //当前项目实施进度
            var xiangmushishijindutext = getXiangmujinduByItemKey(itemdata.f_ProjSchedule);
            $('.xiangmushishijindu').val( xiangmushishijindutext )
            //当前备注
            $('.beizhu').val(itemdata.f_Mark||"")

            //epc类型
            var epctext = getEpcTextByItemkey( itemdata.f_ProjEPCType );
            $('.see-epcleixing').val(epctext||"");
            if(epctext == ""){
                //如果epc类型是空的就把星星去掉
                $('.see-epcleixing').prev().children(".redxing").html('')
            }else{
                $('.see-epcleixing').prev().children(".redxing").html('*')
            }
            // 项目类型
            setSeeXiangmuleixing( itemdata.f_ProjCollaborate, itemdata.fK_ProjRemouldMode )

            //单位名称
            $('.danweimingcheng').val(itemdata.f_UnitName)
            $('.suoshuquyu').val(itemdata.districtName)

        }else{
            myAlter("没有找到该条数据,请刷新后重试")
        }
    });

    //删除项目
    $('#xiangmubiaoge tbody').on('click','.option-delete',function(data, index){
        //获取当前项目在后台id
        // $(".fujianshangchuan").css("display",'none')
        var _postID = $(this).parents('tr').find('td').eq(0).html();
        var itemdata = getXiangmuInfoByID( _postID );
        hh.ui.xiangmu.data.addOrEditFlag = true;
        _postKnowLedgeFileArr = []
        if(itemdata){
            hh.ui.xiangmu.data.itemdata = itemdata;
            // POST /api/ProvincialProject/DelProjRemouldInfo
            var title = $(this).parents('tr').find('td').eq(1).html();
            $('#sure-remove').modal('show');
            $('#sure-remove p b').html(title);
            //点击确定后
            $('#sure-remove .btn-primary').off('click');
            $('#sure-remove .btn-primary').on('click',function(){
                $('#sure-remove').modal('hide');
                //根据ID获取后台数据
                $.ajax({
                    type:'post',
                    url:xiangmu_urls + 'ProvincialProject/DelProjRemouldInfo',
                    data:JSON.stringify({
                        //修改时要传的id
                        PK_ProjRemouldInfo: _postID,
                        //当前用户
                        UserID:_userIdNum
                    }),
                    contentType: "application/json",
                    timeout:_theTimes,
                    success:function(res){
                        // 99表示成功，3表示失败,1表示参数不正确，2名称重复
                        if(res.code == 99){
                            myAlter(res.data)
                            selectAllData()
                        }else if(res.code == 3){
                            myAlter("删除失败")
                        }else if(res.code == 1){
                            myAlter("参数填写错误，请检查！")
                        }else if(res.code == 2){
                            myAlter("项目名称重复,请修改后重试")
                        }else{
                            myAlter("网络错误...")
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
            }.bind(this)) 
        }
    });


    $('#myModal-xiugai').on('shown.bs.modal', function () {
        xiugaireset()
    })

    $('#xiangmu').validate({
            onfocusout: function(element) { 
                var obj = {1:1}
                setTimeout(function(){
                    $(element).valid()
                }.bind(this),200)
            },
            rules:{
                //单位名称
                'danweimingcheng':{
                    required: true,
                },
                //所属区域
                'suoshuquyu':{
                    required: true
                },
                'danweileixing':{
                    required: true
                },
                'xiangmumingcheng':{
                    required: true
                },
                'gaizaomianji': {
                    required: true,
                    numberFormat1:true
                },
                'touzie':{
                    numberFormat1:true,
                    required: true
                },
                'shishidanwei':{
                    required: true,
                },
                'qianyuejienenglv':{
                    required: true,
                    numberFormat1:true,
                },
                'caigoujihuaxiadashijian': {
                    required: true,
                    isDate: true
                },
                'zhaobiaoshijian': {
                    required: true,
                    isDate: true
                },
                'hetongshijian': {
                    required: true,
                    isDate: true
                },
                'yanshoushijian': {
                    required: true,
                    isDate: true
                },
                'guanlianjianzhu': {
                    required: false
                },
                'xiangmushishijindu': {
                    required: true,
                },
                'xiangmuleixing': {
                    required: true,
                }

            },
            messages:{
                'danweimingcheng':{
                    required: '请输入单位名称'
                },
                'suoshuquyu':{
                    required: '请输入所属区域'
                },
                'danweileixing':{
                    required: '请输入单位类型'
                },
                'xiangmumingcheng':{
                    required: "请输入项目名称"
                },
                'gaizaomianji': {
                    required: "请输入改造面积"
                },
                'touzie':{
                    required: "请输入投资额"
                },
                'shishidanwei':{
                    required: "请输入实施单位",
                },
                'qianyuejienenglv':{
                    required: "请输入签约节能率",
                },
                'caigoujihuaxiadashijian': {
                    required: "请输入采购计划下达时间",
                },
                'zhaobiaoshijian': {
                    required: "请输入招标时间",
                },
                'hetongshijian': {
                    required: "请输入合同时间",
                },
                'yanshoushijian': {
                    required: "请输入验收时间",
                },
                'xiangmushishijindu': {
                    required: "请选择项目实施进度",
                },
                'xiangmuleixing': {
                    required: "项目类型不能为空",
                }
            }
    });


    /*----------------------------上传文件-------------------------------*/

    $("#ctlBtn").click(function(){
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

    $('#thelist').on('click','.remove-img-bianji',function(){

        var id = $(this).parents('.file-item').attr('id');
        var path ;

        $(_postKnowLedgeFileArr).each(function(i,o){

            if(o.pK_ProjRemouldFile  == id){
                o.fileUploadFlag = 1;
            }
        });
        //页面删掉
        $(this).parents('.file-item').remove();
        //队列删除
        //uploader.removeFile($(this)[0].id,true);
        // removeImg(path);
    });

    //查询事件
    $("#selectBtn").click(selectAllData);

    function addFujian(arr, el){
        //附件预览
        var $list = $("#fujianlist");
        var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
            '<img>' +
            '<div class="info">' + file.name + '</div>' +
            '</div>'
        );
        var $img = $li.find('img');
        // $list为容器jQuery实例
        $list.append( $li );

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                // $img.replaceWith('<span>不能预览</span>');
                $img.attr( 'src', './img/weizhi.jpg' );
                return;
            }
            $img.attr( 'src', src );

        }, 100, 100 );
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

    //下载文件
    $('#fujianlist').on('click','.downloadwenjian',function(){
        var url = $(this).attr('data-myurl')
        var $eleForm = $("<form method='get'  target='_blank'></form>");
        $eleForm.attr("action",url);
        $(document.body).append($eleForm);
        $eleForm.submit();
    });

    function reset (){}
    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){
        var flag= $("#xiangmu").valid();
        if(!flag){
           return false;
        }
        var formdata = {};
        var t = $('#xiangmu').serializeArray();
        $.each(t, function() {
            formdata[this.name] = this.value;
        });
        var fujian = _postKnowLedgeFileArr;
        var epcleixing = $("#epcleixing").find("option:selected").attr('itemKey')||"";
        var addOrEditFlag = hh.ui.xiangmu.data.addOrEditFlag;
        if(addOrEditFlag){
            // 修改接口
            startEditFlag()
            return
        }
       // POST /api/ProvincialProject/AddProjRemouldInfo
        $.ajax({
            type:'post',
            url:xiangmu_urls + 'ProvincialProject/AddProjRemouldInfo',
            data:{
                //当前用户
                userID:_userIdNum,
                //当前用户名
                userName:_userIdName,
                //当前角色
                b_UserRole:_userRole,
                //当前用户所属部门
                b_DepartNum:_maintenanceTeam,
                //当前单位名称
                f_UnitName: resetObj.enterpriseID,
                f_UnitID : resetObj.enterpriseID,
                //当前所属区域
                f_DistrictID: resetObj.subDisID,
                //当前单位类型id
                f_PointerClass: resetObj.pointerClass,
                //当前项目名称
                f_ProjName: formdata.xiangmumingcheng,
                //当前合作方式
                f_ProjCollaborate: formdata.hezuofangshi,
                //当前项目类型
                fK_ProjRemouldMode: formdata.xiangmuleixing,
                //当前epc类型
                f_ProjEPCType: epcleixing,
                //当前改造面积
                f_RemouldArea: formdata.gaizaomianji,
                //当前投资额
                f_Investment: formdata.touzie,
                //当前实施单位
                f_ImplementUnit: formdata.shishidanwei,
                //当前签约节能率
                f_EnergySaving: formdata.qianyuejienenglv,
                //当前采购计划下达时间
                f_ProcurementDT: formdata.caigoujihuaxiadashijian,
                //当前招标时间
                f_TenderDT: formdata.zhaobiaoshijian,
                //当前合同时间
                f_ContractDT: formdata.hetongshijian,
                //当前验收时间
                f_CheckAcceptDT: formdata.yanshoushijian,
                //关联建筑
                f_RelatePointer: formdata.guanlianjianzhu,
                //当前项目实施进度
                f_ProjSchedule: formdata.xiangmushishijindu,
                //当前备注
                f_Mark: formdata.beizhu,
                //当前上传附件集合
                projRemouldFiles: fujian
            },
            timeout:_theTimes,
            success:function(res){
                // 99表示成功，3表示失败,1表示参数不正确，2名称重复
                if(res.code == 99){
                    myAlter(res.data)
                    $("#create-Modal").modal('hide');
                    selectAllData()
                }else if(res.code == 3){
                    myAlter("创建失败")
                }else if(res.code == 1){
                    myAlter("参数填写错误，请检查！")
                }else if(res.code == 2){
                    myAlter("项目名称重复,请修改后重试")
                }else{
                    myAlter("网络错误...")
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log('error')
                var info = JSON.parse(jqXHR.responseText).message;
                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter(info);
                }

            }
        })
    })


    setTimeout(function(){
        selectAllData()
    },1000)
})

//修改项目内容
function startEditFlag(){
    var formdata = {};
    var t = $('#xiangmu').serializeArray();
    $.each(t, function() {
        formdata[this.name] = this.value;
    });
    var fujian = _postKnowLedgeFileArr;
    var epcleixing = $("#epcleixing").find("option:selected").attr('itemKey')||"";
    var addOrEditFlag = hh.ui.xiangmu.data.addOrEditFlag;
    var pK_ProjRemouldInfo = hh.ui.xiangmu.data.itemdata.pK_ProjRemouldInfo;
    //单位id
    var submitdanweiid = hh.ui.xiangmu.data.itemdata.f_UnitID
    // 单位名称 f_UnitName
    var submitdanweimingcheng = hh.ui.xiangmu.data.itemdata.f_UnitName

    //所属区域
    var submitsuoshuquyu = hh.ui.xiangmu.data.itemdata.districtName;
    // 所属区域id
    var submitsuoshuquyuid = hh.ui.xiangmu.data.itemdata.f_DistrictID;
    //单位类型id
    var dwlxid = hh.ui.xiangmu.data.itemdata.f_PointerClass;
    
    // POST /api/编辑项目

    $.ajax({
        type:'post',
        url:xiangmu_urls + 'ProvincialProject/EditProjRemouldInfo',
        data:{
            //修改时要传的id
            pK_ProjRemouldInfo:pK_ProjRemouldInfo,
            //当前用户
            userID:_userIdNum,
            //当前用户名
            userName:_userIdName,
            //当前角色
            b_UserRole:_userRole,
            //当前用户所属部门
            b_DepartNum:_maintenanceTeam,

            f_PointerClass: dwlxid,

            f_UnitID : submitdanweiid,
            // districtName: submitsuoshuquyu,
            f_DistrictID: submitsuoshuquyuid,

            //当前项目名称
            f_ProjName: formdata.xiangmumingcheng,
            //当前合作方式
            f_ProjCollaborate: formdata.hezuofangshi,
            //当前项目类型
            fK_ProjRemouldMode: formdata.xiangmuleixing,
            //当前epc类型
            f_ProjEPCType: epcleixing,
            //当前改造面积
            f_RemouldArea: formdata.gaizaomianji,
            //当前投资额
            f_Investment: formdata.touzie,
            //当前实施单位
            f_ImplementUnit: formdata.shishidanwei,
            //当前签约节能率
            f_EnergySaving: formdata.qianyuejienenglv,
            //当前采购计划下达时间
            f_ProcurementDT: formdata.caigoujihuaxiadashijian,
            //当前招标时间
            f_TenderDT: formdata.zhaobiaoshijian,
            //当前合同时间
            f_ContractDT: formdata.hetongshijian,
            //当前验收时间
            f_CheckAcceptDT: formdata.yanshoushijian,
            //关联建筑
            f_RelatePointer: formdata.guanlianjianzhu,
            //当前项目实施进度
            f_ProjSchedule: formdata.xiangmushishijindu,
            //当前备注
            f_Mark: formdata.beizhu,
            //当前上传附件集合
            projRemouldFiles: fujian
        },
        timeout:_theTimes,
        success:function(res){
            // 99表示成功，3表示失败,1表示参数不正确，2名称重复
            if(res.code == 99){
                myAlter(res.data)
                $("#create-Modal").modal('hide');
                selectAllData()
            }else if(res.code == 3){
                myAlter("修改失败")
            }else if(res.code == 1){
                myAlter("参数填写错误，请检查！")
            }else if(res.code == 2){
                myAlter("项目名称重复,请修改后重试")
            }else{
                myAlter("网络错误...")
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log('error')
            var info = JSON.parse(jqXHR.responseText).message;
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter(info);
            }

        }
    })
}

function resetData ( id ){
    var alldata = JSON.parse(window.sessionStorage.pointers);
    var len = alldata.length;
    for (var i = 0; i < len; i++) {
        var item = alldata[i];
        if(item.enterpriseID == id){
            return item;
        }
    }
    return null;
}

function getdanweileixingtextByid( id ){
    if(danweileixinglist){
        for (var i = 0; i < danweileixinglist.length; i++) {
            var item = danweileixinglist[i];
            if(item.pK_ProjRemouldMode == id){
                return item.f_RemouldName;
            }
        }
    }
    return id
}

function getxiangmuleixingByid( id ){

}

function setSeeXiangmuleixing( id, type){
    var url = xiangmu_urls + "ProvincialProject/GetOneProjRemouldMode?collaborateWay="+id;
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }
            if(res.code == 99){
                var data = res.data;
                var optionstring = "";
                if(data == ""){
                     myAlter("此合作方式项目类型为空,请更换合作方式")
                     $("#see-xiangmuleixing").html('');
                }else{
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        if (item.pK_ProjRemouldMode == type) {
                            $("#see-xiangmuleixing").val(item.f_RemouldName);
                        }
                    }
                }
            }

        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}

//getiteminfo
function getProItemData( id, callback){
    var url = xiangmu_urls + "ProvincialProject/GetProjRemouldInfoByID/" + id;
     $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 99){
                if(res.data == ""){
                    myAlter(res.message)
                }else{
                    callback(res.data)
                }
            }
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}

function setEditXiangmuleixing( id, type){
    var url = xiangmu_urls + "ProvincialProject/GetOneProjRemouldMode?collaborateWay="+id;
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }
            if(res.code == 99){
                var data = res.data;
                var optionstring = "";
                if(data == ""){
                     myAlter("此合作方式项目类型为空,请更换合作方式")
                }else{
                    var data = res.data;
                    var optionstring = "";
                    $.each(data,function(key,value){
                        optionstring += "<option suoshuid=\"" + value.fK_CollaborateWay  + "\" value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
                    });
                    $("#xiangmuleixing").html(optionstring);
                    $("#xiangmuleixing").val(type)
                }
                var attr = $("#hezuofangshi").find("option:selected").attr('cstFlag');
                var val = $("#hezuofangshi").val();
                if(attr == 1){
                    //清除项目类型的所有值包括星星
                    $('#epcleixing').attr("disabled",false);
                    $('#epcleixing').prev().children(".redxing").html('*')
                }else{
                    $("#epcleixing").html("");
                    $('#epcleixing').attr("disabled",true);
                    $('#epcleixing').prev().children(".redxing").html('')
                }
            }

        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}



function callbackHell(info){
    // GET /api/ProvincialProject/GetProjRemouldModeByID/
    var attr = $("#hezuofangshi").find("option:selected").attr('cstFlag');
    var val = $("#hezuofangshi").val();
    var infodata = info;
    //attr == 1 代表选中了epc类型是
    var url = xiangmu_urls + "ProvincialProject/GetOneProjRemouldMode?collaborateWay="+val;
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }
            if(res.code == 99){
                var data = res.data;
                var optionstring = "";
                if(data == ""){
                     myAlter("此合作方式项目类型为空,请更换合作方式")
                }
                $.each(data,function(key,value){
                    optionstring += "<option suoshuid=\"" + value.fK_CollaborateWay  + "\" value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
                });
                $("#xiangmuleixing").html(optionstring);
                $('#xiangmuleixing').val(infodata.fK_ProjRemouldMode)
            }

        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
    if(attr == 1){
        //清除项目类型的所有值包括星星
        $('#epcleixing').attr("disabled",false);
        $('#epcleixing').prev().children(".redxing").html('*')
    }else{
        $("#epcleixing").html("");
        $('#epcleixing').attr("disabled",true);
        $('#epcleixing').prev().children(".redxing").html('')
    }
    if(infodata.f_ProjEPCType == ""){

    }else{
        var url = xiangmu_urls + "ProvincialProject/GetALLProvincProjEPCType";
        $.ajax({
            type: "GET",
            cache: false,
            url: url,
            success: function (res) {
                if(res.code == 99){
                    var data = res.data;
                    var optionstring = "";
                    $.each(data,function(key,value){  //循环遍历后台传过来的json数据
                        optionstring += "<option itemKey=\"" + value.itemKey + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
                    });
                    $("#epcleixing").html(optionstring); //获得要赋值的select的id，进行赋值
                    $('#epcleixing').val(infodata.f_ProjEPCType)
                }
                if(res.code == 3){
                    myAlter(res.message)
                }
                if(res.code == 1){
                    myAlter(res.message||"参数填写错误，请检查！")
                }
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                Metronic.stopPageLoading();
                pageContentBody.html('<h4>Could not load the requested content.</h4>');
            }
        });
    }
}

