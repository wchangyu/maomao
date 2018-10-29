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

//存放所有数据
var _allData = [];

//当前的餐厅id
var _thisId = '';

var _isExist = '';
var pageContentBody = $('.page-content .page-content-body');
var quyuid = window.sessionStorage.enterpriseID;
var resetObj = resetData(quyuid);
if(resetObj == null){
    myAlter("请求数据错误-----------")
}

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




//获取单位类型
var danweileixinglist = null;
    getdanweileixinglist()
    function getdanweileixinglist(){
        $.ajax({
            type: "GET",
            cache: false,
            url:_urls + 'ProvincialProject/GetAllProjRemouldMode',
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
        var url = _urls + "ProvincialProject/GetALLProvincProjCollaborate";
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
            url:_urls + 'ProvincialProject/GetAllProjSchedule',
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
        var url = _urls + "ProvincialProject/GetALLProvincProjEPCType";
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


//新增
    $('#createBtn').click(function(){
        unlockDisabled()
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
        },500) 

        //单位名称
        $('#danweimingcheng').val(resetObj.eprName)
        //所属区域
        $('#suoshuquyu').val(resetObj.districtName)
        
        //单位类型
        var danweileixing = danweileixinglist;
        if(danweileixing == null){
            myAlter("获取单位类型失败")
            return 
        }
        var optionstring = "";
        $.each(danweileixing,function(key,value){  //循环遍历后台传过来的json数据
            optionstring += "<option value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
        });
        $("#danweileixing").html(optionstring); //获得要赋值的select的id，进行赋值

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
    },500)
    $(".fujianshangchuan").css("display",'hidden')
    var _postID = $(this).parents('tr').find('td').eq(0).html();
    var itemdata = getXiangmuInfoByID( _postID );
    hh.ui.xiangmu.data.addOrEditFlag = true;
    getProItemData(_postID, function(data){

        var datainfo = data[0];

        hh.ui.xiangmu.data.itemdata = itemdata;
        // $("#myModal-xiugai").modal('show');
                //loadding
        $('.L-container').showLoading();

        //初始化
        // createModeInit();
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
        $('#suoshuquyu').val(datainfo.f_DistrictID)
        //单位类型
        var danweileixing = danweileixinglist;
        if(danweileixing == null){
            myAlter("获取单位类型失败")
            return 
        }
        var optionstring = "";
        $.each(danweileixing,function(key,value){  //循环遍历后台传过来的json数据
            optionstring += "<option value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
        });
        $("#danweileixing").html(optionstring); //获得要赋值的select的id，进行赋值

        // //合作方式
        // var hezuofangshi = hezuofangshilist;
        // if(hezuofangshi == null){
        //     myAlter("获取合作方式失败")
        //     return 
        // }
        // var optionstring = "";
        // $.each(hezuofangshi,function(key,value){  //循环遍历后台传过来的json数据
        //     optionstring += "<option cstFlag=\"" + value.cstFlag + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
        // });
        // $("#hezuofangshi").html( optionstring);
        // //TODO
        // // hezuofangshievt()
        // getxiangmuleixingbyhezuofangshiid( $("#hezuofangshi").val() )

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

        // startSetItemData()
        // hh.ui.xiangmu.data.itemdata
        $('.danweimingcheng').val(datainfo.f_UnitName||"")
        $('.suoshuquyu').val(datainfo.f_DistrictID||"")
        //当前单位类型
        $('.danweileixing').val(datainfo.f_PointerClass||"")
        //当前项目名称
        $('.xiangmumingcheng').val(datainfo.f_ProjName||"")

        //当前合作方式
        $('.hezuofangshi').val(datainfo.f_ProjCollaborate||"")
        
        //当前项目类型
        var hezuofangshitype = datainfo.fK_ProjRemouldMode;
        //当前epc类型
        var epctype = datainfo.f_ProjEPCType
        // f_ProjEPCType: epcleixing,
        // hezuofangshievt_xiugai( hezuofangshitype, epctype)

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
        //TODO
        // hezuofangshievt()
        // getxiangmuleixingbyhezuofangshiid( $("#hezuofangshi").val() )


        setEditXiangmuleixing( datainfo.f_ProjCollaborate, datainfo.fK_ProjRemouldMode )

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
                    '<img>' +
                    '<div class="info">' + name + '</div>' +
                    '<div><p class="remove-img-bianji"><a href="javascript:;">删除</a></p></div>'+
                    '</div>'
                );

            var $img = $li.find('img');
            if(type == "JPG" || type == "JPEG" || type == "PNG" || type == "jpg" || type == "jpeg" || type == "png"){
                $img.attr( 'src', lujing );
            }else{
                $img.replaceWith('<span>不能预览</span>');
            }
            // $list为容器jQuery实例
            $list.append( $li );
        }
    })
});

// 查看项目
$('#xiangmubiaoge tbody').on('click','.option-see',function(data, index){
    lockDisabled()
    //获取当前项目在后台id
    var _postID = $(this).parents('tr').find('td').eq(0).html();
    var itemdata = getXiangmuInfoByID( _postID );
    hh.ui.xiangmu.data.addOrEditFlag = true;
    if(itemdata){
        getProItemData(_postID, function(data){
            //此处是请求项目的回调 取出里面的附件内容再进行展示 TODO
            //添加东西之后判断是否能预览，如果是图片能预览，否则反之，
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
                            '<img>' +
                            '<div class="info">' + name + '</div>' +
                            '<div><button type="button" class="downloadwenjian" data-myurl="'+ item.f_FileAllPath +'">下载此文件</button></div>'+
                        '</div>'
                    );

                var $img = $li.find('img');
                if(type == "JPG" || type == "JPEG" || type == "PNG" || type == "jpg" || type == "jpeg" || type == "png"){
                    $img.attr( 'src', lujing );
                }else{
                    $img.replaceWith('<span>不能预览</span>');
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
        $('#see-suoshuquyu').val(resetObj.districtName)
        // 单位类型
        var danweitext = getdanweileixingtextByid(itemdata.f_PointerClass)
        $("#see-danweileixing").val(danweitext); 
        //项目名称
        $("#see-xiangmumingcheng").val(itemdata.f_ProjName)
        //合作方式
        $("#see-hezuofangshi").val(itemdata.projCollaborateName);
        //项目类型
        // fK_ProjRemouldMode
        var xiangmuleixingText = getxiangmuleixingByid( itemdata.fK_ProjRemouldMode )
        $('#see-xiangmuleixing').val('')

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

        }
        // 项目类型
        setSeeXiangmuleixing( itemdata.f_ProjCollaborate, itemdata.fK_ProjRemouldMode )

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
                url:_urls + 'ProvincialProject/DelProjRemouldInfo',
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

 function unlockDisabled(){
    $("#xiangmu input").attr("disabled",false);
    $("#xiangmu select").attr("disabled",false);
    $("#xiangmu textarea").attr("disabled",false);
    $('.danweimingcheng').attr("disabled",true);
    $('.suoshuquyu').attr("disabled",true);
 }

 function lockDisabled(){
    $("#xiangmu input").attr("disabled",true);
    $("#xiangmu select").attr("disabled",true);
    $("#xiangmu textarea").attr("disabled",true);
    $('.danweimingcheng').attr("disabled",true);
    $('.suoshuquyu').attr("disabled",true);


    $("#see-Modal input").attr("disabled",true);
    $("#see-Modal select").attr("disabled",true);
    $("#see-Modal textarea").attr("disabled",true);
    $('.danweimingcheng').attr("disabled",true);
    $('.suoshuquyu').attr("disabled",true);
 }


//合作方式触发的事件
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
$("#hezuofangshi").change(hezuofangshievt);
function getEpcBycstflag(cstflag) {
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
function  getxiangmuleixingbyhezuofangshiid ( id ){
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
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}




$(function(){
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

    

    /*----------------------------------------验证-----------------------------------------*/
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
    /*------------------------------------------表格初始化---------------------------------*/

    function reset (){}

    /*----------------------------------------按钮事件-------------------------------------*/

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
        // POST /api/
        $.ajax({
            type:'post',
            url:_urls + 'ProvincialProject/EditProjRemouldInfo',
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
                //当前单位名称
                f_UnitName: danweimingcheng.value,
                //当前所属区域
                f_DistrictID: suoshuquyu.value,
                //当前单位类型
                f_PointerClass: formdata.danweileixing,
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
            url:_urls + 'ProvincialProject/AddProjRemouldInfo',
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
                f_UnitName: danweimingcheng.value,
                //当前所属区域
                f_DistrictID: suoshuquyu.value,
                //当前单位类型
                f_PointerClass: formdata.danweileixing,
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
})

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
    var url = _urls + "ProvincialProject/GetProjRemouldInfoByID/" + id;
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



