$(function(){
    var _url = sessionStorage.getItem('apiUrlPrefix');
    //登陆者
    var _userID = sessionStorage.getItem('userName');
    //存放当前列表的所有数据
    var _allDataArr = [];
    //存放当前操作的id值
    var _thisRowID = '';
    /*---------------------------------------表格初始化----------------------------------------*/
    var _tables = $('#browse-datatables').DataTable({
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
        "dom":'t<"F"lip>',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs btn btn-success hiddenButton'
            }
        ],
        "columns": [
            {
                title:'编号',
                data:'pK_NewsType',
                className:'ids'
            },
            {
                title:'栏目名称',
                data:'f_NewsTypeName'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent":
                "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    conditionSelect();
    /*-----------------------------------------按钮方法-----------------------------------------*/
    //新增按钮
    $('.creatButton').click(function(){
        //初始化
        $('#newsColum').val('');
        moTaiKuang($('#myModal1'),'新增栏目');
        $('#myModal1').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');
    })
    //新增确定按钮
    $('#myModal1')
        .on('click','.dengji',function(){
            var newsType = {
                f_NewsTypeName:$('#newsColum').val(),
                userID:_userID
            }
            dataDBS('News/AddNewsType',newsType,'提示','新增成功！');
        })
        .on('click','.bianji',function(){
            var pK_NewsType = {
                pK_NewsType:_thisRowID,
                f_NewsTypeName:$('#newsColum').val(),
                userID:_userID
            }
            dataDBS('News/EditNewsType',pK_NewsType,'提示','编辑成功！');
        })
        .on('click','.shanchu',function(){
            var newsType = {
                pK_NewsType:_thisRowID,
                f_NewsTypeName:$('#newsColum').val(),
                userID:_userID
            }
            dataDBS('News/DelNewsType',newsType,'提示','删除成功！');
        })
    //表格中编辑按钮
    $('#browse-datatables')
        .on('click','.option-edite',function(){
            //移除登记类，添加编辑类
            $('#myModal1').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');
            kuangBS($(this),'编辑栏目');
            trCss($(this));
        })
        .on('click','.option-delete',function(){
            //移除登记类，添加编辑类
            $('#myModal1').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');
            kuangBS($(this),'确定要删除吗？');
            trCss($(this));
        })
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
    /*----------------------------------------------其他方法------------------------------------------*/
    //模态框
    function moTaiKuang(who,title,meg){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        who.find('.modal-title').html(title);
        if(meg){
            who.find('.modal-body').html(meg);
        }
    }
    //获取所有新闻条目
    function conditionSelect(){
        $.ajax({
            type:'get',
            url:_url + 'News/GetAllNewsType',
            success:function(result){
                console.log(result);
                _allDataArr = [];
                for(var i=0;i<result.length;i++){
                    _allDataArr.push(result[i]);
                    datasTable($('#browse-datatables'),result);
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    }
    //表格赋值
    function datasTable(tableId,arr){
        var table = tableId.dataTable();
        if(arr.length == 0){
            table.fnClearTable();
            table.fnDraw();
        }else{
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }
    //登记，编辑，删除确定按钮弹出框
    function dataDBS(url,prm,title,meg){
        if($('#newsColum').val()){
            $('.colorTip').hide();
            $.ajax({
                type:'post',
                url:_url + url,
                data:prm,
                success:function(result){
                    if(result == 99){
                        conditionSelect();
                        moTaiKuang($('#myModal'),title,meg)
                        $('#myModal1').modal('hide');
                    }else{
                        //提示执行失败
                        moTaiKuang($('#myModal'),'提示','执行失败！')
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(JSON.parse(jqXHR.responseText).message);
                    if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    }
                }
            })
        }else{
            $('.colorTip').show();
        }

    }
    //编辑，删除弹出框
    function kuangBS($this,meg){
        _thisRowID = $this.parents('tr').children('.ids').html();
        moTaiKuang($('#myModal1'),meg);
        for(var i=0;i<_allDataArr.length;i++){
            if(_allDataArr[i].pK_NewsType == _thisRowID){
                //赋值
                $('#newsColum').val(_allDataArr[i].f_NewsTypeName);
            }
        }
    }
    //click tr css change
    function trCss(el){
        var $this = el.parents('tr');
        $('#browse-datatables tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
    }
})