/**
 * Created by admin on 2017/8/22.
 */
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
    //供应商浏览表格
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
                title:'供应商编号',
                data:'supNum'
            },
            {
                title:'供应商ID',
                data:'id',
                class:'hidden'
            },
            {
                title:'供应商名称',
                data:'supName'
            },
            {
                title:'联系人',
                data:'linkPerson'
            },
            {
                title:'电话',
                data:'phone'
            },
            {
                title:'传真',
                data:'fax'
            },
            {
                title:'电子邮件',
                data:'email'
            },
            {
                title:'发票名称',
                data:'invoiceName'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-edit btn default btn-xs purple'><i class='fa fa-edit'></i>编辑</span><span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>删除</span>"
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

    //新增供应商
    $('.btn22').click(function(){
        $('#myModal').modal('show');

        //清空输入框
        $('#myModal input').val('');
        $('#myModal textarea').val('');

        $('#myModal .btn-primary').off('click');

        $('#myModal .btn-primary').on('click',function(){

            if(!ifAllShouldWrite('#myModal')){
                return false;
            };


            //获取编号
            var supNum = $('#myModal input').eq(0).val();
            //获取名称
            var supName  = $('#myModal input').eq(1).val();

            //获取联系人
            var linkPerson = $('#myModal input').eq(2).val();
            //获取电话
            var phone  = $('#myModal input').eq(3).val();

            //获取传真
            var fax = $('#myModal input').eq(4).val();
            //获取电子邮件
            var email = $('#myModal input').eq(5).val();

            //获取发票名称
            var invoiceName = $('#myModal input').eq(6).val();
            //获取纳税人识别号
            var invoicetNum = $('#myModal input').eq(7).val();

            //获取供货商地址
            var address = $('#myModal input').eq(8).val();
            //获取备注
            var description = $('#myModal textarea').eq(0).val();


            //数据传递给后台
            $.ajax({
                type: 'post',
                url: _urls + "YWCK/AddYWCKSupplier",
                timeout: theTimes,
                data:{
                    "id": 0,
                    "supNum": supNum,
                    "supName": supName,
                    "linkPerson": linkPerson,
                    "phone": phone,
                    "fax": fax,
                    "email": email,
                    "invoiceName": invoiceName,
                    "invoicetNum": invoicetNum,
                    "address": address,
                    "description": description,
                    "userName": _userName,
                    "userID": _userIdName
                },
                beforeSend: function () {

                },

                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success: function (data) {
                    $('#theLoading').modal('hide');
                    console.log(data);
                    if(data == 2){
                        myAlter('编号已存在');
                    }else if(data == 3){
                        myAlter('执行失败')
                    }else if(data == 99){
                        myAlter('添加成功');
                        $('#myModal').modal('hide');

                        //重新获取后台数据
                        getShowKnowledgeData('');

                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    //console.log(textStatus);

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        myAlter("超时");
                    }else{
                        myAlter("请求失败！");
                    }

                }
            });
        });

    });

    //修改供应商
    $('#browse-datatables tbody').on('click','.option-edit',function(){

        //获取当前id
        var _postID = $(this).parents('tr').find('td').eq(1).html();

        console.log(_postID)

        //根据ID获取后台数据
        $.ajax({
            type: 'get',
            url: _urls + "YWCK/GetOneYWCKSupplier",
            timeout: theTimes,
            data:{
                'ID': _postID
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success: function (data) {
                $('#theLoading').modal('hide');
                $('#myModal1').modal('show');

                $('#myModal1 input').eq(0).val(data.supNum);

                $('#myModal1 input').eq(1).val(data.supName);

                $('#myModal1 input').eq(2).val(data.linkPerson);
                $('#myModal1 input').eq(3).val(data.phone);

                $('#myModal1 input').eq(4).val(data.fax);
                $('#myModal1 input').eq(5).val(data.email);

                $('#myModal1 input').eq(6).val(data.invoiceName);
                $('#myModal1 input').eq(7).val(data.invoicetNum);

                $('#myModal1 input').eq(8).val(data.address);

                $('#myModal1 textarea').eq(0).val(data.description);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                //console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }
        });

        //把修改后的数据返回给后台
        $('#myModal1 .btn-primary').off('click');

        $('#myModal1 .btn-primary').on('click',function(){

            if(!ifAllShouldWrite('#myModal1')){
                return false;
            };

            //获取编号
            var supNum = $('#myModal1 input').eq(0).val();
            //获取名称
            var supName  = $('#myModal1 input').eq(1).val();

            //获取联系人
            var linkPerson = $('#myModal1 input').eq(2).val();
            //获取电话
            var phone  = $('#myModal1 input').eq(3).val();

            //获取传真
            var fax = $('#myModal1 input').eq(4).val();
            //获取电子邮件
            var email = $('#myModal1 input').eq(5).val();

            //获取发票名称
            var invoiceName = $('#myModal1 input').eq(6).val();
            //获取纳税人识别号
            var invoicetNum = $('#myModal1 input').eq(7).val();

            //获取供货商地址
            var address = $('#myModal1 input').eq(8).val();
            //获取备注
            var description = $('#myModal1 textarea').eq(0).val();


            //数据传递给后台
            $.ajax({
                type: 'post',
                url: _urls + "YWCK/UpdateYWCKSupplier",
                timeout: theTimes,
                data:{
                    "id": _postID,
                    "supNum": supNum,
                    "supName": supName,
                    "linkPerson": linkPerson,
                    "phone": phone,
                    "fax": fax,
                    "email": email,
                    "invoiceName": invoiceName,
                    "invoicetNum": invoicetNum,
                    "address": address,
                    "description": description,
                    "userName": _userName,
                    "userID": _userIdName
                },
                beforeSend: function () {

                },

                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success: function (data) {
                    $('#theLoading').modal('hide');
                    console.log(data);
                    if(data == 2){
                        myAlter('编号已存在');
                    }else if(data == 3){
                        myAlter('执行失败')
                    }else if(data == 99){
                        myAlter('修改成功');
                        $('#myModal1').modal('hide');

                        //重新获取后台数据
                        getShowKnowledgeData('',true);

                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    //console.log(textStatus);

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        myAlter("超时");
                    }else{
                        myAlter("请求失败！");
                    }

                }
            });
        });

    });

    //删除供应商
    $('#browse-datatables tbody').on('click','.option-delete',function(){

        //获取当前id
        var _postID = $(this).parents('tr').find('td').eq(1).html();

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
                url: _urls + "YWCK/DelYWCKSupplier",
                timeout: theTimes,
                data: JSON.stringify({ 'ID': _postID,UserID:_userIdName }),
                contentType:'application/json',
                beforeSend: function () {

                },

                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success: function (data) {
                    $('#theLoading').modal('hide');
                    if(data == 3){
                        myAlter('删除失败');
                        return false;
                    }

                    //重新获取后台数据
                    getShowKnowledgeData('',true);
                    ////对表格进行重绘
                    //ajaxSuccess1(_msgDataArr);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    //console.log(textStatus);

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
var _userName = sessionStorage.getItem('userAuto');

//当前上传路径
var _currentPath = '';

//传递给后台的文件信息集合
var _postKnowLedgeFileArr = [];

//页面展示数据
var _msgDataArr = [];

//获取后台初始数据

getShowKnowledgeData('');

function getShowKnowledgeData(supName,flag){

    $.ajax({
        type: 'get',
        url: _urls + "YWCK/GetAllYWCKSupplier",
        timeout: theTimes,
        data:{
            "supName" : supName
        },
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);
            _msgDataArr = data;

            ////对表格进行重绘
            //ajaxSuccess1(_msgDataArr)

            //判断是否需要停留在当前页
            if(flag){
                jumpNow($('#browse-datatables'), _msgDataArr)
            }else{
                //对表格进行重绘
                ajaxSuccess1(_msgDataArr)
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

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


//判断必填项是否填写
function ifAllShouldWrite(dom){

    var checkNum = $(dom).find('.colorTip').length;

    for(var i=0; i<checkNum; i++){

        if($(dom).find('.colorTip').eq(i).parent('li').find('input').val() == ''){

            var txt = $(dom).find('.colorTip').eq(i).html().split('*')[0];
            myAlter(txt + " 不能为空")
            getFocus1($(dom).find('.colorTip').eq(i).parent('li').find('input'));
            return false;
        }
    }

    return true;
}

//提交更改后跳转到当前页
function jumpNow(tableID,arr){
    var dom = '#' + tableID[0].id + '_paginate';
    var txt = $(dom).children('span').children('.current').html();

    ajaxSuccess1(arr);
    var num = txt - 1;
    var dom = $(dom).children('span').children().eq(num);
    dom.click();
}