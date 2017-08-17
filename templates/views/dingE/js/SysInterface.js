/**
 * Created by admin on 2017/8/15.
 */
$(document).ready(function(){
    //调用获取后台数据方法，进行数据获取
    alarmHistory();
    //初始化table表单
    table = $('#dateTables').DataTable({
        "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": true,//还原初始化了的datatable
        "paging":true,
        "bPaginate": false,
        "ordering": false,
        'searching':true,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'paginate': {
                'first':      '第一页',
                'last':       '最后一页',
                'next':       '下一页',
                'previous':   '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [

        ],
        "dom":'B<"clear">lfrtip',
        //数据源
        'columns':[
            {
                title:'项目名称',
                data:"sysInterfaceTypeModel.f_InterfaceTypeName"
            },
            {
                title:'接口ID',
                data:"pK_SysInterfaceDescID",
                class:'theHidden'
            },
            {
                title:'页面路径',
                data:"f_PagePath"
            },
            {
                title:'主菜单',
                data:"f_MainMenu"
            },
            {
                title:'子菜单',
                data:"f_ChildMenu"
            },
            {
                title:'接口地址',
                data:"f_InterfaceAddress"

            },
            {
                title:'设计人',
                data:"f_PageDesigner"
            },
            {
                title:'版本号',
                data:"f_InterfaceVision"
            },
            {
                title:'功能描述',
                data:"f_InterfaceDesc"

            },
            {
                title:'编辑操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn alter' data-toggle='modal' data-target='#alter-people'>修改</button>"
            },
            {
                title:'删除操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn remove' data-toggle='modal' data-target='#remove-people'>删除</button>"
            }
        ]
    });
    _table = $('#dateTables').dataTable();
    //给表格添加后台获取到的数据



    //添加操作
    $("#add-people").on('click',function(){
        $('#add-people .marks').css({
            display:'none'
        });
        $('#add-people .hint-text').css({
            display:'none'
        });
        $('#add-people .hooks').css({
            display:'none'
        });
    });
    $('#add-people .btn-primary').on('click',function(){

        //获取接口分类ID
        var  pK_SysInterfaceTypeID= $("#add-people .add-input").eq(0).val();

        //获取接口分类名称
        var  f_InterfaceTypeName = $("#add-people .add-input").eq(0).find("option:selected").text();

        //页面路径
        var f_PagePath = $("#add-people .add-input").eq(1).val();

        //主菜单
        var f_MainMenu = $("#add-people .add-input").eq(2).val();

        //子菜单
        var f_ChildMenu = $("#add-people .add-input").eq(3).val();

        //页面设计人
        var f_PageDesigner = $("#add-people .add-input").eq(4).val();

        //版本号
        var f_InterfaceVision = $("#add-people .add-input").eq(5).val();

        //调用接口地址
        var f_InterfaceAddress = $("#add-people .add-input").eq(6).val();

        //功能描述
        var f_InterfaceDesc = $("#add-people textarea").val();

        $.ajax({
            type: "post",
            url: IP + "/SysInterface/AddSysInterfaceDesc",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
            timeout:theTimes,
            data:{
                "pK_SysInterfaceDescID": 0,
                "sysInterfaceTypeModel": {
                    "pK_SysInterfaceTypeID": pK_SysInterfaceTypeID,
                    "f_InterfaceTypeName": f_InterfaceTypeName
                },
                "f_MainMenu": f_MainMenu,
                "f_ChildMenu": f_ChildMenu,
                "f_PagePath": f_PagePath,
                "f_PageDesigner": f_PageDesigner,
                "f_InterfaceAddress": f_InterfaceAddress,
                "f_InterfaceVision": f_InterfaceVision,
                "f_InterfaceDesc": f_InterfaceDesc,
                "f_CreateDT": "string"
            },
            cache: false,
            async : false,
            dataType: "json",
            beforeSend:function(){
                $('#theLoading').modal('show');
            },
            complete:function(){
                $('#theLoading').modal('hide');
            },

            success: function (data)
            {
                console.log(data);

                $('#add-people').modal('hide');
                ajaxSuccess();

            },

            error:function (data, textStatus, errorThrown) {
                var num = data.responseText.split('"')[3];

                if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                    myAlter("超时");
                }

                $('#add-people').modal('hide');
                myAlter(num);
            }


        });
        //完成后清空input框
        $(this).parent().parent().parent().find('input').val('');
    });


    //修改操作
    $('#dateTables').on('click','.alter',function(e){
        //获取要传的ID;
        e = e || window.event;
        var tar = e.target || e.srcElement;
        var id = $(tar).parent().parent().children().eq(1).html();
        console.log(id);

        var messageArr = [];

        $(dataArr).each(function(i,o){
            if(id == o.pK_SysInterfaceDescID){
                messageArr = o;
            }
        });

        // 接口类型
        $("#alter-people .add-input").eq(0).val(messageArr.sysInterfaceTypeModel.pK_SysInterfaceTypeID);

        //页面路径
        $("#alter-people .add-input").eq(1).val(messageArr.f_PagePath);

        //主菜单
         $("#alter-people .add-input").eq(2).val(messageArr.f_MainMenu);

        //子菜单
        $("#alter-people .add-input").eq(3).val(messageArr.f_ChildMenu);

        //页面设计人
        $("#alter-people .add-input").eq(4).val(messageArr.f_PageDesigner);

        //版本号
        $("#alter-people .add-input").eq(5).val(messageArr.f_InterfaceVision);

        //调用接口地址
        $("#alter-people .add-input").eq(6).val(messageArr.f_InterfaceAddress);

        //功能描述
        $("#alter-people textarea").val(messageArr.f_InterfaceDesc);

        //点击提交按钮
        $('#alter-people .btn-primary').off('click');
        $('#alter-people .btn-primary').on('click',function(){
            //获取接口分类ID
            var  pK_SysInterfaceTypeID= $("#alter-people .add-input").eq(0).val();

            //获取接口分类名称
            var  f_InterfaceTypeName = $("#alter-people .add-input").eq(0).find("option:selected").text();

            //页面路径
            var f_PagePath = $("#alter-people .add-input").eq(1).val();

            //主菜单
            var f_MainMenu = $("#alter-people .add-input").eq(2).val();

            //子菜单
            var f_ChildMenu = $("#alter-people .add-input").eq(3).val();

            //页面设计人
            var f_PageDesigner = $("#alter-people .add-input").eq(4).val();

            //版本号
            var f_InterfaceVision = $("#alter-people .add-input").eq(5).val();

            //调用接口地址
            var f_InterfaceAddress = $("#alter-people .add-input").eq(6).val();

            //功能描述
            var f_InterfaceDesc = $("#alter-people textarea").val();

            console.log(f_InterfaceDesc);

            console.log(id);
            $('#theLoading').modal('show');

            $.ajax({
                type: "post",
                timeout:theTimes,
                url: IP + "/SysInterface/EditSysInterfaceDesc",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                data: {
                    "pK_SysInterfaceDescID": id,
                    "sysInterfaceTypeModel": {
                        "pK_SysInterfaceTypeID": pK_SysInterfaceTypeID,
                        "f_InterfaceTypeName": f_InterfaceTypeName
                    },
                    "f_MainMenu": f_MainMenu,
                    "f_ChildMenu": f_ChildMenu,
                    "f_PagePath": f_PagePath,
                    "f_PageDesigner": f_PageDesigner,
                    "f_InterfaceAddress": f_InterfaceAddress,
                    "f_InterfaceVision": f_InterfaceVision,
                    "f_InterfaceDesc": f_InterfaceDesc,
                    "f_CreateDT": "string"
                },
                beforeSend:function(){
                    $('#theLoading').modal('show');
                },
                complete:function(){
                    $('#theLoading').modal('hide');
                },
                success: function (data)

                {
                    console.log(data);
                    if(data == 2){
                        myAlter('名称重复')
                        return false;
                    }
                    if(data == 3){
                        myAlter('修改失败')
                        return false;
                    }
                    $('#alter-people').modal('hide');
                    ajaxSuccess();

                },
                error:function (data, textStatus, errorThrown) {
                    console.log(textStatus);
                    if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }else{
                        myAlter(data.responseText.split('"')[3]);
                    }

                    $('#alter-people').modal('hide');
                },

            });
        })

    });

    //删除操作

    $('#dateTables').on('click','.remove',function(){
        //获取要传的ID;

        var id = parseInt($(this).parent().parent().children().eq(1).html());

        console.log(id);
        //点击提交按钮
        $('#remove-people .btn-primary').off('click');
        $('#remove-people .btn-primary').on('click',function(){

            $('#theLoading').modal('show');
            $.ajax({
                type: "post",
                timeout:theTimes,
                url:IP + "/SysInterface/DelNewsContent",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                data:{"": id},
                beforeSend:function(){
                    $('#theLoading').modal('show');
                },
                complete:function(){
                    $('#theLoading').modal('hide');
                },
                success: function (data)

                {
                    $('#remove-people').modal('hide');
                    $('#theLoading').modal('hide');
                    ajaxSuccess();
                    if(data == 3){
                        myAlter('删除失败')
                    };
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#remove-people').modal('hide');
                    $('#theLoading').modal('hide');
                    if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                        myAlter("超时");
                    }else{
                        myAlter(XMLHttpRequest.responseText.split('"')[3]);
                    }

                }
            });
        })

    });

    //表格大小随窗口变化而改变
    window.onresize = function () {

        //changeTable();
    };
});
var table;
//存放系统接口分类
var _faceType = [];

//获取后台数据
function alarmHistory(){
    dataArr=[];
    $.ajax({
        type:'get',
        url:IP + "/SysInterface/GetAllNewsTypeContent",
        timeout:theTimes,
        beforeSend:function(){

        },
        complete:function(){
            $('#theLoading').modal('hide');
        },
        success:function(result){
            console.log(result);
            for(var i=0;i<result.length;i++){
                dataArr.push(result[i]);
            }
            setData();
            hiddrenId();

        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(XMLHttpRequest);
            if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        },

    });
};

//获取所有系统接口分类
function GetAllSysInterfaceType(){

    $.ajax({
        type:'get',
        url:IP + "/SysInterface/GetAllSysInterfaceType",
        timeout:theTimes,
        beforeSend:function(){

        },
        complete:function(){
            $('#theLoading').modal('hide');
        },
        success:function(result){
            console.log(result);
            for(var i=0;i<result.length;i++){
                _faceType.push(result[i]);
            }

            var html = '';
            $(_faceType).each(function(i,o){

                html +='<option value="'+ o.pK_SysInterfaceTypeID+'">'+ o.f_InterfaceTypeName+'</option>'

            });

            $('.face-type').html(html);

        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(XMLHttpRequest);
            if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        },

    });
}
GetAllSysInterfaceType();

//修改表格控件
//function changeTable(){
//    /*清空原表控件*/
//    if (table) {
//        table.destroy();
//    }
//
//    var W = $('.main-content-table').width();
//    /*重新绘制Table*/
//    table = $('#dateTables').DataTable({
//        "bFilter": false,
//        "bLengthChange": false,
//        "autoWidth": true,  //用来启用或禁用自动列的宽度计算
//        "searching": false,
//        "ordering": false,
//        "bPaginate": false, //翻页功能
//        "bSort": false,
//        "bProcessing": false,
//        "scrollY": "700px",
//        "sScrollX": W,
//        "scrollCollapse": true,
//        "sScrollXInner": "100%",
//        "paging": false,
//        "destroy": false,
//        'language': {
//            'emptyTable': '没有数据',
//            'loadingRecords': '加载中...',
//            'processing': '查询中...',
//            'lengthMenu': '每页 _MENU_ 件',
//            'zeroRecords': '没有数据',
//            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
//            'paginate': {
//                'first':      '第一页',
//                'last':       '最后一页',
//                'next':       '下一页',
//                'previous':   '上一页'
//            },
//            'infoEmpty': ''
//        },
//        'buttons': [
//
//        ],
//        "dom":'B<"clear">lfrtip',
//        //数据源
//        'columns':[
//            {
//                title:'单位性质',
//                data:"f_UnitNatureName"
//            },
//            {
//                title:'单位ID',
//                data:"pK_Nature",
//                class:'theHidden'
//            },
//            {
//                title:'编辑操作',
//                "targets": -1,
//                "data": null,
//                "defaultContent": "<button class='top-btn alter' data-toggle='modal' data-target='#alter-people'>修改</button>"
//            },
//            {
//                title:'删除操作',
//                "targets": -1,
//                "data": null,
//                "defaultContent": "<button class='top-btn remove' data-toggle='modal' data-target='#remove-people'>删除</button>"
//            }
//        ]
//    });
//    _table = $('#dateTables').dataTable();
//    _table.fnClearTable();
//    //给表格添加后台获取到的数据
//    setData();
//    hiddrenId();
//};

