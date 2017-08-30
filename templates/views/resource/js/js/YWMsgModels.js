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
                title:'公告编号',
                data:'',
                class:'hidden',
                render:function(data, index, row, meta){
                    return '00' + meta.row;
                }
            },
            {
                title:'公告ID',
                data:'msgId',
                class:'hidden'
            },
            {
                title:'公告标题',
                data:'msgTitle'
            },
            {
                title:'发布日期',
                data:'msgDate'
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

    //新增公告
    $('.btn22').click(function(){
        $('#myModal').modal('show');

        //清空输入框
        $('#myModal input').val('');
        $('#myModal textarea').val('');
        $('#myModal .radio').eq(0).find('span').addClass('checked');

        //获取当前时间
        var now = moment().format('YYYY-MM-DD');

        $('#myModal .startsTime').val(now);


        $('#myModal .btn-primary').off('click');

        $('#myModal .btn-primary').on('click',function(){

            if(!ifAllShouldWrite('#myModal')){
                return false;
            };

            //获取标题
            var f_KnowleTitle = $('#knowledge-title0').val();
            //获取内容
            var f_KnowleContent = $('#myModal .textarea3').val();

            //获取时间
            var msgDate = $('#myModal .startsTime').val();

            //获取是否发布
            var msgHidden = $('#myModal .checked input').attr('values');


            console.log(msgHidden);

            //数据传递给后台
            $.ajax({
                type: 'post',
                url: _urls + "YWMsg/AddYWMsg",
                timeout: theTimes,
                data:{
                    "msgId": 0,
                    "msgTitle": f_KnowleTitle,
                    "msgContent": f_KnowleContent,
                    "msgDate": msgDate,
                    "msgType": 0,
                    "msgHidden": msgHidden,
                    "userName": _userIdName,
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
                        myAlter('名称重复');
                    }else if(data == 3){
                        myAlter('执行失败')
                    }else if(data == 99){
                        myAlter('添加成功');
                        $('#myModal').modal('hide');

                        //重新获取后台数据
                        getShowKnowledgeData('');
                        //对表格进行重绘
                        ajaxSuccess1(_msgDataArr);
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

    //查看公告
    $('#browse-datatables_wrapper tbody').on('click','.option-see',function(){


        //获取当前id
        var _postID = $(this).parents('tr').find('td').eq(1).html();

        //根据ID获取后台数据
        $.ajax({
            type: 'get',
            url: _urls + "YWMsg/GetOneYWMsgModel",
            timeout: theTimes,
            data:{
                'msgId': _postID
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
                console.log(data);
                //标题
                $('#see-myModal .knowledge-title').val(data.msgTitle);

                //内容
                $('#see-myModal .textarea3').val(data.msgContent);
                //时间
                $('#see-myModal .startsTime').val(data.msgDate);

                if(data.msgHidden == 0){
                    $('#see-myModal .radio').eq(0).find('span').addClass('checked');
                }else{
                    $('#see-myModal .radio').eq(1).find('span').addClass('checked');
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

    //修改公告
    $('#browse-datatables_wrapper tbody').on('click','.option-edite',function(){


        //获取当前id
        var _postID = $(this).parents('tr').find('td').eq(1).html();

        //根据ID获取后台数据
        $.ajax({
            type: 'get',
            url: _urls + "YWMsg/GetOneYWMsgModel",
            timeout: theTimes,
            data:{
                'msgId': _postID
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

                //标题
                $('#myModal .knowledge-title').val(data.msgTitle);

                //内容
                $('#myModal .textarea3').val(data.msgContent);
                //时间
                $('#myModal .startsTime').val(data.msgDate);

                if(data.msgHidden == 0){
                    $('#myModal .radio').eq(0).find('span').addClass('checked');
                }else{
                    $('#myModal .radio').eq(1).find('span').addClass('checked');
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

        //把修改后的数据返回给后台
        $('#myModal .btn-primary').off('click');

        $('#myModal .btn-primary').on('click',function(){

            if(!ifAllShouldWrite('#myModal')){
                return false;
            };

            //获取标题
            var f_KnowleTitle = $('#knowledge-title0').val();
            //获取内容
            var f_KnowleContent = $('#myModal .textarea3').val();

            //获取时间
            var msgDate = $('#myModal .startsTime').val();

            //获取是否发布
            var msgHidden = $('#myModal .checked input').attr('values');

            //数据传递给后台
            $.ajax({
                type: 'post',
                url: _urls + "YWMsg/UpdateYWMsg",
                timeout: theTimes,
                data:{
                    "msgId": _postID,
                    "msgTitle": f_KnowleTitle,
                    "msgContent": f_KnowleContent,
                    "msgDate": msgDate,
                    "msgType": 0,
                    "msgHidden": msgHidden,
                    "userName": _userIdName,
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
                        myAlter('名称重复');
                    }else if(data == 3){
                        myAlter('执行失败')
                    }else if(data == 99){
                        myAlter('修改成功');
                        $('#myModal').modal('hide');

                        //重新获取后台数据
                        getShowKnowledgeData('',true);
                        ////对表格进行重绘
                        //ajaxSuccess1(_msgDataArr);
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

    //删除公告
    $('#browse-datatables_wrapper tbody').on('click','.option-delete ',function(){

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
                url: _urls + "YWMsg/DelYWMsg",
                timeout: theTimes,
                data: JSON.stringify({ 'msgId': _postID,UserID:_userIdName }),
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
var _userIdName = sessionStorage.getItem('userName');

//当前上传路径
var _currentPath = '';

//传递给后台的文件信息集合
var _postKnowLedgeFileArr = [];

//页面展示数据
var _msgDataArr = [];

//获取后台初始数据

getShowKnowledgeData('');

function getShowKnowledgeData(msgTitle,flag){

    $.ajax({
        type: 'get',
        url: _urls + "YWMsg/GetAllYWMsgModels",
        timeout: theTimes,
        data:{
            "msgTitle" : msgTitle
        },
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');
            //console.log(data);
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

        if($(dom).find('.colorTip').eq(i).parent('tr').find('.writes').val() == ''){

            var txt = $(dom).find('.colorTip').eq(i).html().split('*')[0];
            myAlter(txt + " 不能为空")
            getFocus1($(dom).find('.input-label').eq(i).next().find('.writes'));
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