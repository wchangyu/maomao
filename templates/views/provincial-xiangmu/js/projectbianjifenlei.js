var allxiangmuleixing = null;

var oTable = null;

var zixianginfoid = null;


var tianjiazixiang_validate = null;

//编辑分类
var bianjifenlei_validate = null;
//添加按钮
var tianjia_validate = null

var xiangmu_urls = sessionStorage.getItem("apiprovincialproject");
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
function getallxiangmuleixing( callback ){
	// GET /api/ProvincialProject/GetAllProjRemouldMode
	var callback = callback;
	var url = xiangmu_urls + "ProvincialProject/GetAllProjRemouldMode";
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function(res) {
            if (res.code == 99) {
                if(res.data == ""){
                	// allxiangmuleixing = null;
                }else{
                	allxiangmuleixing = res.data;
                	if(callback){
                		callback();
                	}
                }
            }
            if (res.code == 3) {
                myAlter(res.message)
            }
            if (res.code == 1) {
                myAlter(res.message || "参数填写错误，请检查！")
            }

        }.bind(this),
        error: function(xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}

function shuaxintable(){
    getallxiangmuleixing(function(){
        if(allxiangmuleixing){
            creatDatatable(allxiangmuleixing)
        }
    });
}



$(function() {
	shuaxintable()

    // 添加项目分类按钮
    $('#btnAddRemouldMode').on('click', function(data, index){
        createModeInit('see-xiangmu')
        tianjia_validate.resetForm()
        $('#see-xiangmu .xiangmuleixingmingcheng').val("")
        $('#see-xiangmu .shunxuhao').val("")

        $('.L-container').showLoading();
        //初始化
        $(".error").removeClass("error");
        //模态框
        _moTaiKuang($('#see-Modal'),'添加项目分分类','','','','确认');

        $('.L-container').hideLoading();
    });
    // 添加项目分类提交
     $('#see-Modal').on('click','.dengji',function(){
        var flag= $("#see-xiangmu").valid();
        if(!flag){
           return false;
        }
        $('.L-container').showLoading();
        var url = xiangmu_urls + "ProvincialProject/AddProjRemouldMode";
        var f_RemouldName = $("#xiangmuleixingmingcheng").val()
        var f_Order = $('#see-xiangmu .shunxuhao').val()||'';
        var data = {
            f_RemouldName: f_RemouldName,
            f_ParentRemould:'',
            fK_CollaborateWay: '0',
            f_Order: f_Order,
            //当前用户
            userID:_userIdNum,
            //当前用户名
            userName:_userIdName,
            //当前角色
            b_UserRole:_userRole,
            //当前用户所属部门
            b_DepartNum:_maintenanceTeam,
        }
        $.ajax({
            type: 'post',
            cache: false,
            url: url,
            data: data,
            success: function(res) {
                $('.L-container').hideLoading();
                if(res.code == 99){
                    myAlter(res.data)
                    $("#see-Modal").modal('hide');
                    $("#see-xiangmu").validate().resetForm();
                    $('.xiangmuleixingmingcheng').val('')
                    $('.shunxuhao').val('')
                    shuaxintable()
                }else{
                    myAlter(res.message)
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('.L-container').hideLoading();
                var info = JSON.parse(jqXHR.responseText).message;
                if (textStatus == 'timeout') { //超时,status还有success,error等值的情况
                    myAlter("超时");
                } else {
                    myAlter(info);
                }

            }
        })
    });
    // 添加按钮的验证规则
    tianjia_validate = $('#see-xiangmu').validate({
            onfocusout: function(element) { 
                setTimeout(function(){
                    $(element).valid()
                }.bind(this),200)
            },
            rules:{
                //分类名称
                'xiangmuleixingmingcheng':{
                    required: true,
                },
                //顺序号
                'shunxuhao':{
                    required: true,
                    isNumberUser: true
                }
            },
            messages:{
                'xiangmuleixingmingcheng':{
                    required: '请输入分类名称'
                },
                'shunxuhao':{
                    required: '请输入顺序号'
                }
            }
    });


    // 查看子项
    $('#shengjipingtai tbody').on('click', '.clickme', function () {
        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;
        var row = oTable.row( tr );
        var id = $(this).parent().prev().html();
        var datalist = getshengshilistitem(id)
        if ( row.child.isShown() ) {
            row.child.hide();
            tr.removeClass('shown');
        }else {
            // Open this row
            row.child( format( id ) ).show();
            tr.addClass('shown');
            $('.shown').next('tr').addClass('on-show');
        }
        creatIdTable(id, datalist)
    } );


    // 编辑分类
    $('#bianjifenlei tbody').on('click', '.option-edite', function () {
        createModeInit('bianjifenleimingcheng')
        bianjifenlei_validate.resetForm()
        $('#bianjifenleimingcheng .xiugai_shunxuhao').val("")
        $('#bianjifenleimingcheng .xiugai_xiangmuleixing').val("")

        var id = $(this).parent().parent().children().eq(0).html();
        var name = $(this).parents('tr').find('td').eq(1).html();
        var xuhao = $(this).parents('tr').find('td').eq(3).html();
        $('.L-container').showLoading();
        //初始化
        $(".error").removeClass("error");
        var list = allxiangmuleixing;
        $('.L-container').showLoading();
        var url = xiangmu_urls + "ProvincialProject/GetProjRemouldModeByID/"+ id;
        $.ajax({
            type: "GET",
            cache: false,
            url: url,
            success: function (res) {
                $('.L-container').hideLoading();
                if(res.code == 3){
                    myAlter(res.message)
                }
                if(res.code == 1){
                    myAlter(res.message||"参数填写错误，请检查！")
                }
                if(res.code == 99){
                   _moTaiKuang($('#xiugaifenlei'),'编辑分类','','','','确认');

                    $('.L-container').hideLoading();
                    $('.xiugai_xiangmuleixing').val(name);
                    $('.xiugai_shunxuhao').val(res.data.f_Order);
                    $('.xiugai_leixingid').val(res.data.pK_ProjRemouldMode);
                }

            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                $('.L-container').hideLoading();
                Metronic.stopPageLoading();
                pageContentBody.html('<h4>Could not load the requested content.</h4>');
            }
        });
    });
    //编辑分类的提交
    $('#xiugai_sub').click(function(event) {
        var flag = $('#bianjifenleimingcheng').valid();
        if(!flag){
            return false;
        }

        var f_ParentRemould = $('#bianjifenleimingcheng .xiugai_leixingid').val();
        var fK_CollaborateWay = getWay( f_ParentRemould );
        var f_RemouldName = $('#bianjifenleimingcheng .xiugai_xiangmuleixing').val();
        var f_Order = $('#bianjifenleimingcheng .xiugai_shunxuhao').val()

        var url = xiangmu_urls + "ProvincialProject/EditProjRemouldMode";


        var data = {
            pK_ProjRemouldMode: f_ParentRemould,
            f_RemouldName: f_RemouldName,
            pK_ProjRemouldMode: f_ParentRemould,
            fK_CollaborateWay: fK_CollaborateWay,
            f_Order: f_Order,
            //当前用户
            userID:_userIdNum,
            //当前用户名
            userName:_userIdName,
            //当前角色
            b_UserRole:_userRole,
            //当前用户所属部门
            b_DepartNum:_maintenanceTeam,
        }
        $('.L-container').showLoading();
        $.ajax({
            type:"post",
            url:url,
            data:data,
            success: function (result) {
                
                $('.L-container').hideLoading();
                if(result.code == 99){
                     myAlter(result.message)
                     $("#xiugaifenlei").modal('hide');
                    getallxiangmuleixing(function(){
                        if(allxiangmuleixing){
                            creatDatatable(allxiangmuleixing)
                        }
                    });
                }else{
                    myAlter(result.message)
                }
            },
            error: function() {
                $('.L-container').hideLoading();
                /* Act on the event */
            }
        });
    });
    //编辑分类的规则配置
    bianjifenlei_validate = $('#bianjifenleimingcheng').validate({
            onfocusout: function(element) { 
                setTimeout(function(){
                    $(element).valid()
                }.bind(this),200)
            },
            rules:{
                //分类名称
                'xiugai_xiangmuleixing':{
                    required: true,
                },
                //顺序号
                'xiugai_shunxuhao':{
                    required: true,
                    isNumberUser:true,
                }
            },
            messages:{
                'xiugai_xiangmuleixing':{
                    required: '项目类型不能为空'
                },
                'xiugai_shunxuhao':{
                    required: '请输入数字'
                }
            }
    });

    // 给分类 添加子项
    $('#bianjifenlei tbody').on('click', '.option-add', function () {
        createModeInit('fenlei_tianjiazixiang')
        tianjiazixiang_validate.resetForm()
        $('#fenlei_tianjiazixiang .zixiangxuhao').val("")
        $('#fenlei_tianjiazixiang .zixiangxiangmuleixing').val("")
        
        var id = $(this).parent().parent().children().eq(0).html()
        $('.L-container').showLoading();
        //初始化
        $(".error").removeClass("error");
        getallxiangmuleixing(function(){
            var list = allxiangmuleixing;
            //模态框
            _moTaiKuang($('#tianjiazixiang'),'添加项目类型','','','','确认');

            $('.L-container').hideLoading();

            if(!hezuofangshilist){
                myAlter("获取合作方式失败，请刷新后重试")
                // return
            }else{
                // myAlter
                var optionstring = "";
                $.each(hezuofangshilist,function(key,value){  //循环遍历后台传过来的json数据
                    optionstring += "<option cstFlag=\"" + value.cstFlag + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
                });
                $('#hezuofangshilist').html("")
                $('#hezuofangshilist').html(optionstring)

                var fenleimingchengliststring = "";
                $.each( allxiangmuleixing ,function(key,value){  //循环遍历后台传过来的json数据
                    fenleimingchengliststring += "<option value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
                });
                $('#fenleimingchenglist').html("");
                $('#fenleimingchenglist').html(fenleimingchengliststring);
                $('#fenleimingchenglist').val(id)

            }
        }.bind(this))
    });
    // 添加子项的验证
    $('#dengjisub').click(function(event) {

        var  flag = $('#fenlei_tianjiazixiang').valid();
        if(!flag){
            return 
        }
        var url = xiangmu_urls + "ProvincialProject/AddProjRemouldMode";

        var f_Order = $('#fenlei_tianjiazixiang .zixiangxuhao').val();
        var fK_CollaborateWay = $('#fenlei_tianjiazixiang .hezuofangshilist').val();
        var f_ParentRemould = $('#fenlei_tianjiazixiang .fenleimingchenglist').val();
        var f_RemouldName = $('#fenlei_tianjiazixiang .zixiangxiangmuleixing').val();
        var data = {
            f_RemouldName: f_RemouldName,
            f_ParentRemould: f_ParentRemould,
            fK_CollaborateWay: fK_CollaborateWay,
            f_Order: f_Order,
            //当前用户
            userID:_userIdNum,
            //当前用户名
            userName:_userIdName,
            //当前角色
            b_UserRole:_userRole,
            //当前用户所属部门
            b_DepartNum:_maintenanceTeam,
        }
        $('.L-container').showLoading();
        $.ajax({
            type:"post",
            url:url,
            data:data,
            success: function (result) {
                $('.L-container').hideLoading();
                if(result.code == 99){
                     myAlter(result.message)
                     $("#tianjiazixiang").modal('hide');
                    getallxiangmuleixing(function(){
                        if(allxiangmuleixing){
                            creatDatatable(allxiangmuleixing)
                        }
                    });
                }else{
                    myAlter(result.message)
                }
            },
            error: function() {
                $('.L-container').hideLoading();
                /* Act on the event */
            }
        });
    });
    //添加子项的规则配置
    tianjiazixiang_validate = $('#fenlei_tianjiazixiang').validate({
            onfocusout: function(element) { 
                setTimeout(function(){
                    $(element).valid()
                }.bind(this),200)
            },
            rules:{
                //分类名称
                'zixiangxiangmuleixing':{
                    required: true,
                },
                //顺序号
                'zixiangxuhao':{
                    required: true,
                    isNumberUser:true,
                }
            },
            messages:{
                'zixiangxiangmuleixing':{
                    required: '项目类型不能为空'
                },
                'zixiangxuhao':{
                    required: '请输入数字'
                }
            }
    });

    // 子项的编辑
     // 编辑分类


     function getparenttid( id ){
        if(allxiangmuleixing){
            for (var i = 0; i < allxiangmuleixing.length; i++) {
                var item = allxiangmuleixing[i];
                if(item.projRemouldModes){
                    for (var k = 0; k < item.projRemouldModes.length; k++) {
                        var ditem = item.projRemouldModes[k];
                        if(ditem.pK_ProjRemouldMode == id){
                            return item.pK_ProjRemouldMode
                        }
                    }
                }
            }
        }
        return id
     }

     function getparenttidzixiang( id ){
        if(allxiangmuleixing){
            for (var i = 0; i < allxiangmuleixing.length; i++) {
                var item = allxiangmuleixing[i];
                if(item.projRemouldModes){
                    for (var k = 0; k < item.projRemouldModes.length; k++) {
                        var ditem = item.projRemouldModes[k];
                        if(ditem.pK_ProjRemouldMode == id){
                            return ditem
                        }
                    }
                }
            }
        }
        return null
     }
    function createModeInit( id ){
        //将所有label .error验证隐藏
        if(!id){
            return
        }
        var label = $('#'+id).find('label');

        for(var i=0;i<label.length;i++){

            var attr = $(label).eq(i).attr('class')

            if(attr){

                if(attr.indexOf('error')>-1){

                    label.eq(i).hide();

                }
            }

        }
    }
     // 子项里的编辑
     //$('#bianji_hezuofangshilist_ziji option:selected').val()
    $('#bianjifenlei tbody').on('click', '.child-edit', function () {
        createModeInit('bianjizixiang')
        var id = $(this).parent().parent().children().eq(0).html()
        var parentid = getparenttid( id )
        $('.L-container').showLoading();
        //初始化
        $(".error").removeClass("error");
        getallxiangmuleixing(function(){
            var list = allxiangmuleixing;
            var parentid = getparenttid( id )
            //模态框
            _moTaiKuang($('#bianjizixiang'),'编辑子项类型','','','','确认');

            $('.L-container').hideLoading();

            if(!hezuofangshilist){
                myAlter("获取合作方式失败，请刷新后重试")
                // return
            }else{
                // myAlter
                var zixianginfo = getparenttidzixiang(id)
                var optionstring = "";
                $.each(hezuofangshilist,function(key,value){  //循环遍历后台传过来的json数据
                    optionstring += "<option cstFlag=\"" + value.cstFlag + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
                });
                $('#bianji_hezuofangshilist_ziji').html("")
                $('#bianji_hezuofangshilist_ziji').html(optionstring)

                var fenleimingchengliststring = "";
                $.each( allxiangmuleixing ,function(key,value){  //循环遍历后台传过来的json数据
                    fenleimingchengliststring += "<option value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
                });
                $('#bianji_fenleimingchenglist_ziji').html("");
                $('#bianji_fenleimingchenglist_ziji').html(fenleimingchengliststring);
                $('#bianji_fenleimingchenglist_ziji').val(parentid)

                if(zixianginfo){
                    zixianginfoid = zixianginfo;
                    $('.bianji_zixiangxiangmuleixing_ziji').val(zixianginfo.f_RemouldName)
                    $('.bianji_zixiangxuhao_ziji').val(zixianginfo.f_Order)
                }else{
                    $('.bianji_zixiangxiangmuleixing_ziji').val('')
                    $('.bianji_zixiangxuhao_ziji').val('0')
                }
            }
        }.bind(this))
    });
    // 子项确认修改
    $('#bianji_dengjisub').click(function(){


        var flag= $("#xiangmuzixiang_ziji").valid();
        if(!flag){
           return false;
        }


        var editUrl= xiangmu_urls + "ProvincialProject/EditProjRemouldMode";
        //合作方式
        var fK_CollaborateWay = $('#bianji_hezuofangshilist_ziji option:selected').val()
        // 项目类型
        var f_RemouldName = $(".bianji_zixiangxiangmuleixing_ziji").val()
        
        //分类名称
        var f_ParentRemould = $(".bianji_fenleimingchenglist_ziji").val(); 

        // 顺序号
        var f_Order = $(".bianji_zixiangxuhao_ziji").val();
        

        var data = {
                "pK_ProjRemouldMode": zixianginfoid.pK_ProjRemouldMode,
                "f_ParentRemould": f_ParentRemould,
                "fK_CollaborateWay":fK_CollaborateWay,
                "f_RemouldName": f_RemouldName,
                "f_Order": f_Order,
                //当前用户
                userID:_userIdNum,
                //当前用户名
                userName:_userIdName,
                //当前角色
                b_UserRole:_userRole,
                //当前用户所属部门
                b_DepartNum:_maintenanceTeam,
        }

        SaveModalData(editUrl,data);
    })
    // 子项的form配置
    $('#xiangmuzixiang_ziji').validate({
            onfocusout: function(element) { 
                setTimeout(function(){
                    $(element).valid()
                }.bind(this),200)
            },
            rules:{
                //分类名称
                'bianji_zixiangxiangmuleixing_ziji':{
                    required: true,
                },
                //顺序号
                'bianji_zixiangxuhao_ziji':{
                    required: true,
                    isNumberUser:true,
                }
            },
            messages:{
                'bianji_zixiangxiangmuleixing_ziji':{
                    required: '项目类型不能为空'
                },
                'shunxuhao':{
                    required: '请输入数字'
                }
            }
    });

    //新增和修改调用保存数据
    function SaveModalData( url,paramData) {
        $('.L-container').showLoading();
        $.ajax({
            type: "post",
            url: url,
            data: paramData,
            success: function (result) {
                $('.L-container').hideLoading();
                if(result.code == 99){
                     myAlter(result.message)
                     getallxiangmuleixing(function(){
                        if(allxiangmuleixing){
                            creatDatatable(allxiangmuleixing)
                        }
                    });
                }else{
                    myAlter(result.message)
                }
                $("#bianjizixiang").modal('hide');
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('.L-container').hideLoading();
                modalShowSetting($('#modalToolTip'), "提示", false, '', true, '数据保存失败，请联系管理员!');
            }
        });
    }

    //删除分类名称
    $('#bianjifenlei tbody').on('click', '.option-delete', function () {
        var _postID = $(this).parents('tr').find('td').eq(0).html();
        var title = $(this).parents('tr').find('td').eq(1).html();
        var name = $(this).parents('tr').find('td').eq(2).html();
        var innht = $(this).parent().parent().children().eq(1).html()
        var delid = $(this).parent().parent().children().eq(0).html()
        $('#sure-remove').modal('show');
        $('#sure-remove p b').html(innht);
        //点击确定后
        $('#sure-remove .btn-primary').off('click');
        $('#sure-remove .btn-primary').on('click',function(){
            $('#sure-remove').modal('hide');
            //根据ID获取后台数据
            removeChildType( delid, function(result){
                if(result.code == 99){
                     myAlter(result.message)
                }else{
                    myAlter(result.data)
                }

            })
        }.bind(this))
    } );

    //删除项目类型
    $('#bianjifenlei tbody').on('click','.child-delete',function(data, index){
        var _postID = $(this).parents('tr').find('td').eq(0).html();
        var title = $(this).parents('tr').find('td').eq(1).html();
        var name = $(this).parents('tr').find('td').eq(2).html();
        var innht = $(this).parent().parent().children().eq(1).html()
        var delid = $(this).parent().parent().children().eq(0).html()
        $('#sure-remove').modal('show');
        $('#sure-remove p b').html(innht);
        //点击确定后
        $('#sure-remove .btn-primary').off('click');
        $('#sure-remove .btn-primary').on('click',function(){
            $('#sure-remove').modal('hide');
            //根据ID获取后台数据
            removeChildType( delid, function(result){
                if(result.code == 99){
                     myAlter(result.message)
                }else{
                    myAlter(result.data)
                }
            })
        }.bind(this))
    });

    // 展开子项
    $('#bianjifenlei tbody').on('click', '.seezixiang', function () {
        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;
        var row = oTable.row( tr );
        var id = $(this).parent().parent().children('td:first-child').html()
        var child = getchildByID(id)
        if ( row.child.isShown() ) {
            row.child.hide();
            tr.removeClass('shown');
            $(this).html('查看子项')
        }else {
            // Open this row
            row.child( format( id ) ).show();
            tr.addClass('shown');
            $('.shown').next('tr').addClass('on-show');
            $(this).html('收起列表')
        }
        creatIdTable(id, child)
    } );







})


function creatDatatable( arr ){
	oTable = $('#bianjifenlei').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false, //是否分页
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
        'buttons': [],
        //'ajax':'./work_parts/data/assetsbrow.json',
        "columns": [
            {
                title:'id',
                data: 'pK_ProjRemouldMode',
                sWidth:"0%",
                class: "hidden",
                render:function(data, index, row, meta){
                    return data;
                }
            },
            {
                title:'分类名称',
                data: 'f_RemouldName',
                sWidth:"20%",
                render:function(data, index, row, meta){
                    return data;
                }
            },
            
            {
                title:'顺序',
                data: 'f_Order',
                render: function(data, index, row, meta){
                    return data++;
                },
                sWidth:"10%",
            },
            {
                title:'子项个数',
                data: 'projRemouldModes',
                render: function(data, index, row, meta){
                    return data.length;
                },
                sWidth:"20%",
            },
            {
                title:'查看子项',
                data: null,
                render: function(data, index, row, meta){
                    return ' <button type="button" class="btn btn-primary btn-sm seezixiang">查看子项</button>'
                },
                sWidth:"10%",
            },
            {
            title: '操作',
                "targets": -1,
                "data": null,
                sWidth:"40%",
                "className": 'noprint',
                // "defaultContent":"<span class='data-option option-add btn default btn-xs green-stripe'>添加子项</span>" +
                // "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                // "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>",
                render: function(){
                    return  '<span class="data-option option-add btn default btn-xs green-stripe">添加子项</span>'+
                            '<span class="data-option option-edite btn default btn-xs green-stripe">编辑</span>'+
                            '<span class="data-option option-delete btn default btn-xs green-stripe">删除</span>';
                }
            }
    
        ],
        data: arr
    });
}

//初始化alert
function myAlter(string){
    $('#my-alert').modal('show');
    $('#my-alert p b').html(string);
}


function creatIdTable(id, datalist){
    // allMyclod;
    var columns = [
        {
            title: '',
            data: 'pK_ProjRemouldMode',
            class: 'hidden',
            render: function(data, index, row, meta) {
                return data
            }
        },{
            title: '项目类型',
            data: 'f_RemouldName',
            render: function(data, index, row, meta) {
                return data
            }
        },{
            title: '合作方式',
            data: 'collaborateWayName',
            render: function(data, index, row, meta) {
                return data
            }
        },{
            title: '顺序',
            data: 'f_Order',
            render: function(data, index, row, meta) {
                return data
            }
        },
        {
            title: '操作',
            "targets": -1,
            "data": null,
            sWidth:"40%",
            "className": 'noprint',
            // "defaultContent":,
            render: function( data, index, row, meta ){

                return '<span class="data-option child-edit btn default btn-xs green-stripe">编辑</span>'+
                        '<span class="data-option child-delete btn default btn-xs green-stripe">删除</span>';

                // "<span class='data-option child-edit btn default btn-xs green-stripe'>编辑</span>" +
                //         "<span class='data-option child-delete btn default btn-xs green-stripe'>删除</span>"
            }
        }
    ];
    $('#test'+id).DataTable({
        "autoWidth": false, //用来启用或禁用自动列的宽度计算
        "paging": false, //是否分页
        "destroy": true, //还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '',
            'infoEmpty': '没有数据',
            'paginate': {
                "previous": "上一页",
                "next": "下一页",
                "first": "首页",
                "last": "尾页"
            }
        },
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        'buttons': [],
        "columns": columns,
        data: datalist
    });
}
		
function getchildByID( id ){
    if(allxiangmuleixing){
        for (var i = 0; i < allxiangmuleixing.length; i++) {
            var item = allxiangmuleixing[i]
            if(item.pK_ProjRemouldMode == id){
                return item.projRemouldModes;
            }
        }
    }
    return [];
}		


function format ( id ) {
    // var list = getshengshilistitem(id)
    var table = '<table class="table childtable" id="'+'test'+id+'">' +
                    '<thead></thead>'+
                    '<tbody></tbody>'+
                '</table>';
    return table;
}


function removeChildType( id, callback ){
    var url = xiangmu_urls + 'ProvincialProject/DelProjRemouldMode';
    var callback = callback;
    var data=JSON.stringify({
        "PK_ProjRemouldMode": id,
        "UserID":_userIdNum,
    });
    $('.L-container').showLoading();
    $.ajax({
        type:"post",
        url:url,
        contentType: 'application/json',
        data:data,
        success: function (result) {
           
            $('.L-container').hideLoading();
            if(callback){
                callback(result)
            }else{
                if(result.code == 99){
                     myAlter(res.message)
                }else{
                    myAlter(res.message)
                }
            }
            getallxiangmuleixing(function(){
                if(allxiangmuleixing){
                    creatDatatable(allxiangmuleixing)
                }
            });

            // getAllProjRemouldMode();
        },
        error: function() {
            $('.L-container').hideLoading();
            /* Act on the event */
        }
    });

}


function getWay( id ){
    if(allxiangmuleixing){
        for (var i = 0; i < allxiangmuleixing.length; i++) {
            var item = allxiangmuleixing[i];
            if(item.pK_ProjRemouldMode == id){
                return item.fK_CollaborateWay||'0'
            }
        }
    }
    return "0";
}

