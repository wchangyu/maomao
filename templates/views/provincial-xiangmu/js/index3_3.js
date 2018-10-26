/*----------------------------上传文件-------------------------------*/
var $list=$("#thelist");//上传区域
var $btn =$("#ctlBtn");//上传按钮
var thumbnailWidth = 100;
var thumbnailHeight = 100;
var uploader = null;
var _postKnowLedgeFileArr = [];
// creatUpdateLoader()
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
}

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




function selectAllData(){
    var xiangmumingchengselect = $("#xiangmumingchengselect").val();
    // POST /api/ProvincialProject/GetProjRemouldInfoByName
    var url = _urls + "ProvincialProject/GetProjRemouldInfoByName";
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

$("#selectBtn").click(selectAllData);


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
function hezuofangshievt_xiugai( hezuofangshitype, ){
    var attr = $("#hezuofangshi").find("option:selected").attr('cstFlag');
    var val = $("#hezuofangshi").val();

    getxiangmuleixingbyhezuofangshiid_xiugai( val, hezuofangshitype )
    if(attr == 1){  
        getEpcBycstflag_xiugai( attr )
        //清除项目类型的所有值包括星星
        // $("#xiangmuleixing").html("")
        // $('#xiangmuleixing').attr("disabled",true);
        $('#epcleixing').attr("disabled",false);
    }else{
        $("#epcleixing").html("");
        $('#epcleixing').attr("disabled",true);
        // $('#xiangmuleixing').attr("disabled",false);

    }
}

function getEpcBycstflag_xiugai(cstflag) {
    var url = _urls + "ProvincialProject/GetALLProvincProjEPCType";
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
    var url = _urls + "ProvincialProject/GetOneProjRemouldMode?collaborateWay="+id;
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
                setTimeout(function(){
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
                data:'f_ContractDT'
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



