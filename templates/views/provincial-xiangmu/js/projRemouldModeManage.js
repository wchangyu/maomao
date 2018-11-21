var xiangmu_urls = sessionStorage.getItem("apiprovincialproject");

$(function () {
    //初始化日期选择控件天
    initDayCalendar($("#datetimeStart"));

    //表单验证初始化
    $("#commentForm").validate({
            errorPlacement: function(error, element) {//标签进行提示判断
                // Append error within linked label
                $( element )
                    .closest( "form" )
                    .find( "label[for='" + element.attr( "id" ) + "']" )
                    .append( error );
            },
            errorElement: "span",
        onfocusout: function(element)
        {
            //$(element).valid()
            setTimeout(function(){//加这个定时器是为了让带图标的日期控件也响应焦点离开时的验证
                console.log(num);
                $(element).valid()
            },500)
        },//焦点离开时进行验证

            rules: {
                txtRemouldName: "required",
                selectCollaborateWay: "required",
                selectParentRemould: "required",
                txtOrder: {
                    required: true,
                    regex: positiveInt,
                },
                datetimeStart: {
                    required:true,
                    date:true,
                },
            },
            messages: {
                txtRemouldName: "请输入分类名称",
                selectCollaborateWay: "请选择合作方式",
                selectParentRemould: "请选择父级分类",
                txtOrder: {
                    required: "请输入顺序号",
                    regex: "必须是正整数,包含0",
                },
                datetimeStart: {
                    required: "请输入日期",
                    date:"日期格式不正确",
                },
            }
        });

    //定义编辑项ID
    var selectID='';

    //Modal是否处于编辑操作，True为编辑操作，False为添加操作
    var isEditModal=false;

    //所有父级的项目类型
    var allParentRemould = [];

    //合作方式
    var _allProjCollaborate=[];

    /*-------------------------初始化----------------------------*/
    //表格初始化
  var tableOBJ=  $('#tableRemouldMode').DataTable({
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
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "columns":[
            {
                "title":"项目类型",
                "data":"f_RemouldName",
            },
            {
                "title":"顺序",
                "data":"f_Order",
            },
            {
                "title":"子项个数",
                "data":"projRemouldModes",
                "render": function ( data, type, full, meta ) {
                    return data.length;
                }
            },
            {
                "title":"查看子项",
                "data":"projRemouldModes",
                "render":function(data,type,full,meta){
                        if(data.length==0){
                            return "无";
                        }else{
                          return  "<input type='button' class='tables_button tables_button_right' value='单击查看' id='btnLookChild' rowid="+data+">"
                        }
                }
            },
            {
                "title":"操作",
                "data":"pK_ProjRemouldMode",
                "render": function ( data, type, full, meta ) {
                    return   "<input type='button' class='tables_button tables_button_right' value='添加子项' id='btnAddChild' rowid="+data+">"+
                        "<input type='button' class='tables_button tables_button_right' value='编辑' id='btnEdit' rowid="+data+">"+
                      "<input type='button' class='tables_button' value='删除' id='btnDel' rowid="+data+">"
                }
            },
        ]
    });

    //添加父级
    $("#btnAddRemouldMode").on("click",function(){
        isEditModal=false;
        InitModalData(false,false);
        $("#selectCollaborateWay").append("<option value='0'>无</option>");
        $("#selectParentRemould").append("<option value='0'>无</option>");
        modalShowSetting($("#modalRemouldMode"),"添加项目类型",true,"添加",false,'');
    });

    //添加子级
    $("#tableRemouldMode").on("click","#btnAddChild",function(){
        var id=$(this).attr("rowid");
        isEditModal=false;
        InitModalData(true,true);
        $("#selectParentRemould").val(id);

        $("#commentForm").validate().resetForm();//这只会清空错误的信息,但是样式不会清除
        $(".error").removeClass("error");//清除验证样式

        modalShowSetting($("#modalRemouldMode"),"添加项目类型",true,"添加",false,'');
    });

    ///父级编辑事件
    $("#tableRemouldMode").on("click","#btnEdit",function(){
        isEditModal=true;
        InitModalData(false,false);
        $("#selectCollaborateWay").append("<option value='0'>无</option>");
        $("#selectParentRemould").append("<option value='0'>无</option>");
        selectID= $(this).attr("rowid");


        $("#commentForm").validate().resetForm();//这只会清空错误的信息,但是样式不会清除
        $(".error").removeClass("error");//清除验证样式
        modalShowSetting($("#modalRemouldMode"),"修改项目类型",true,"修改",false,'');
        EditModelGetData(selectID);
    });

    //删除事件
    $("#tableRemouldMode").on("click","#btnDel",function(){
        selectID=$(this).attr("rowid") ;
        modalShowSetting($("#modalToolTip"),"提示",true,'确定',true,"确认要删除吗？");
    });

    //模态框单击删除操作
    $("#modalToolTip .btn-primary").on("click",function(){
        $("#modalToolTip").modal("hide");

        //$('.modal-backdrop').remove();
        //$('body').removeClass('modal-open');
        var url = xiangmu_urls + "ProvincialProject/DelProjRemouldMode";
        var data=JSON.stringify({
            "PK_ProjRemouldMode":selectID,
            "UserID":"mch",
        });

        setTimeout(function(){//在此之所以把Ajax调用放在SetTimeOut中，是因为前面的删除提示框关闭，还没有时间清除，会影响第二次弹窗关闭产生黑屏问题。
            $.ajax({
                type:"post",
                url:url,
                contentType: 'application/json',
                data:data,
                success: function (result) {
                    if (result.code == 1) {
                        modalShowSetting($('#modalToolTip'), "提示", false, '', true, '传参不对，请检查!');
                        return false;
                    }
                    else if (result.code == 3) {
                        modalShowSetting($('#modalToolTip'), "提示", false, '', true, '数据删除失败，请联系管理员!');
                        return false;
                    }
                    else if (result.code == 4) {
                        modalShowSetting($('#modalToolTip'), "提示", false, '', true, result.data);
                        return false;
                    }
                    getAllProjRemouldMode();
                },
            });
        },500)
    });

    //模态框单击确定提交
    $("#btnSubmit").on("click",function(){

        var flag=formValidate($("#commentForm"));
       if(!flag){
           return false;
       }
        var addUrl = xiangmu_urls + "ProvincialProject/AddProjRemouldMode";
        var editUrl= xiangmu_urls + "ProvincialProject/EditProjRemouldMode";
        var selectItem= $("#selectCollaborateWay option:selected");
        console.log("合作方式："+selectItem.val());
        console.log( $("#selectParentRemould").val());
       var data="";
        if(isEditModal){
            data={
                "pK_ProjRemouldMode": selectID,
                "f_RemouldName": $("#txtRemouldName").val(),
                "f_ParentRemould": $("#selectParentRemould").val(),
                "fK_CollaborateWay": selectItem.val(),
                "f_Order": $("#txtOrder").val(),
                "userID": "mch",
            }
            SaveModalData(editUrl,data);
        }else{
            data={
                "pK_ProjRemouldMode": '',
                "f_RemouldName": $("#txtRemouldName").val(),
                "f_ParentRemould": $("#selectParentRemould").val(),
                "fK_CollaborateWay": selectItem.val(),
                "f_Order": $("#txtOrder").val(),
                "userID": "mch",
            }
            SaveModalData(addUrl,data);
        }
    });

    //查看隐藏子项数据
    $("#tableRemouldMode").on("click","#btnLookChild",function(){
        var tr = $(this).closest('tr');//closest() 方法获得匹配选择器的第一个祖先元素，从当前元素开始沿 DOM 树向上。
        var row = tableOBJ.row( tr );
        if ( row.child.isShown() ) {//检测子行是否显示
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
            $(this).val("单击查看");
        }
        else {
            // Open this row
          //  console.log(row.data().projRemouldModes);
            row.child( CreateChildTable(row.data().projRemouldModes) ).show();
            tr.addClass('shown');
            $(this).val("单击隐藏");
            //子项数据编辑
            $(".btnChildEdit").on("click",function(){
                isEditModal=true;
                InitModalData(true,true);
                selectID= $(this).attr("rowid");
                modalShowSetting($("#modalRemouldMode"),"修改项目类型",true,"修改",false,'');
                EditModelGetData(selectID);
            });
            //子项数据删除
            $(".btnChildDel").on("click",function(){
                selectID=$(this).attr("rowid") ;
                modalShowSetting($("#modalToolTip"),"提示",true,'确定',true,"确认要删除吗？");
            });
        }
    });


    var num = 0;
    function Obj (){
        this.num = 1,
            this.getNum = function(){
                console.log(this.num);
            },
            this.getNumLater = function(){
                setTimeout(function(){
                    console.log(this.num);
                }.bind(this), 1000)
            }
    }


    var firstName = "zhengxiang";
    var name = {
        firstName: "xiong",
        showName: function () {
            alert(this.firstName);
        },
        waitShowName: function () {
            setTimeout(function(){
                alert(this.firstName);
            }.bind(this), 1000);
        }
    };

    //timeout测试
    $("#btnSetTimeOut").on("click",function(){
        var obj = new Obj;
        obj.getNum();//1　　打印的是obj.num，值为1
        obj.getNumLater()//0　　打印的是window.num，值为0,setTimeout加上bind(this)，即为1

        name.waitShowName();
    });

    /*--------------------------调用方法-------------------------------*/

    //调用所有的项目类型
    getAllProjRemouldMode();
    //获取所有的合作方式
    getAllProvincProjCollaborate();

    /*--------------------------------方法定义------------------------*/
    //获取所有项目类型
    function getAllProjRemouldMode() {
        var url = xiangmu_urls + "ProvincialProject/GetAllProjRemouldMode";
        //var url = 'http://localhost/BEEWebAPI/api/ProvincialProject/GetAllProjRemouldMode';
        $.ajax({
            type: 'get',
            url: url,
            data: '',
            success: function (result) {
                var _allRemouldMode=[];
                allParentRemould.length=0;
                if (result.code == 99) {

                    for (var i = 0; i < result.data.length; i++) {
                        _allRemouldMode.push(result.data[i]);
                        var parentRemould=[];
                        parentRemould["pK_ProjRemouldMode"] = result.data[i].pK_ProjRemouldMode;
                        parentRemould["f_RemouldName"] = result.data[i].f_RemouldName;
                        allParentRemould.push(parentRemould);
                    }
                    createTablesData($('#tableRemouldMode'), _allRemouldMode);
                }
            }
        })
    }

    //获取所有的合作方式
    function  getAllProvincProjCollaborate(){
        var url = xiangmu_urls + "ProvincialProject/GetALLProvincProjCollaborate";
        $.ajax({
           type:"get",
            url:url,
            data:"",
            success:function(result){
                if(result.code==99){
                    for(var i=0;i<result.data.length;i++){
                        _allProjCollaborate.push((result.data[i]));
                    }
                }
            }
        });
    }

    //初始化添加和编辑窗体打开时缓存数据
    //isShowCollaborateWay是否显示合作方式，True需要初始化
    //isShowParentSelectData是否显示父级数据,True需要初始化
    function  InitModalData(isShowCollaborateWay,isShowParentSelectData) {
        selectID = '';
        $("#txtRemouldName").val("");
        $("#selectCollaborateWay").empty();
        if(isShowCollaborateWay){
            var selectOBJ=$("#selectCollaborateWay");
            for (var i=0;i<_allProjCollaborate.length;i++){
                selectOBJ.append("<option value='"+_allProjCollaborate[i].itemKey+"' cstFlag='"+_allProjCollaborate[i].cstFlag+"'>"+_allProjCollaborate[i].cstName+"</option>");
            }
           // $("#selectCollaborateWay").get(0).selectedIndex = 0;
        }

        $("#txtOrder").val("");
        $("#selectParentRemould").empty();
        if (isShowParentSelectData) {
            for (var i = 0; i < allParentRemould.length; i++) {
                $("#selectParentRemould").append("<option value='" + allParentRemould[i].pK_ProjRemouldMode + "'>" + allParentRemould[i].f_RemouldName + "</option>");
            }
        }
    }

    //进入编辑模态窗时，从数据库读取Data数据并赋值模态框
    function EditModelGetData(id){
        var url = xiangmu_urls + "ProvincialProject/GetProjRemouldModeByID";
        $.ajax({
            type:"get",
            url:url,
            data:{"id":selectID},
            success:function(result){
                if(result.code=99){
                    if(result.data!=null){
                        selectID=result.data.pK_ProjRemouldMode;
                        $("#txtRemouldName").val(result.data.f_RemouldName);
                        $("#selectCollaborateWay").val(result.data.fK_CollaborateWay);
                        $("#txtOrder").val(result.data.f_Order);
                        $("#selectParentRemould").val(result.data.f_ParentRemould);
                    }
                }
            }
        });
    }

    //新增和修改调用保存数据
    function SaveModalData( url,paramData) {
        $.ajax({
            type: "post",
            url: url,
            data: paramData,
            success: function (result) {
                if (result.code == 1) {
                    modalShowSetting($('#modalToolTip'), "提示", false, '', true, '传参不对，请检查!');
                    return false;
                } else if (result.code == 2) {
                    modalShowSetting($('#modalToolTip'), "提示", false, '', true, '项目类型名称已生存!');
                    return false;
                }
                else if (result.code == 3) {
                    modalShowSetting($('#modalToolTip'), "提示", false, '', true, '数据保存失败，请联系管理员!');
                    return false;
                }
                $("#modalRemouldMode").modal("hide");
                getAllProjRemouldMode();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                modalShowSetting($('#modalToolTip'), "提示", false, '', true, '数据保存失败，请联系管理员!');
            }
        });
    }

    //Datatables生成子Table数据
    function CreateChildTable(childData){
        var theadData='<table class="tableStyle"><thead><tr><th>项目类型</th><th>合作方式</th><th>顺序</th><th>操作</th></tr></thead>';
        var tbodyStar='<tbody>';
        var tbodyEnd='</tbody>';
        var tableEnd='</table>';
        var str='';
        for(var i=0;i<childData.length;i++){
           str+='<tr><td>'+childData[i].f_RemouldName+'</td><td>'+childData[i].collaborateWayName+'</td><td>'+childData[i].f_Order+'</td><td>'+
               '<input type="button" class="tables_child_button tables_button_right btnChildEdit" value="编辑"  rowid='+childData[i].pK_ProjRemouldMode+'>'+
                '<input type="button" class="tables_child_button btnChildDel" value="删除"  rowid='+childData[i].pK_ProjRemouldMode+'></td></tr>';
        }
        return theadData+tbodyStar+str+tbodyEnd+tableEnd;
    }
} );