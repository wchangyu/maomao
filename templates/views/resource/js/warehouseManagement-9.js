$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //新增vue对象数据绑定
    var myApp33 = new Vue({
        el:'#myApp33',
        data:{
            'num':'',
            'name':'',
            'beizhu':''
        }
    });
    //修改vue对象数据绑定
    var myApp44 = new Vue({
        el:'#myApp44',
        data:{
            'num':'',
            'name':'',
            'beizhu':''
        }
    });
    //存放当前列表的数据
    var allData = [];
    //存放选中的类别编号
    var _thisBianhao;
    /*-------------------------------------表格初始化------------------------------*/
    $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            //"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'saveAs'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'类别编号',
                data:'cateNum',
                className:'cateNum'
            },
            {
                title:'类别名称',
                data:'cateName'
            },
            {
                title:'创建人',
                data:'createUser'
            },
            {
                title:'创建时间',
                data:'createTime'
            },
            {
                title:'备注',
                data:'cateRemark'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-edit'>编辑</span><span class='data-option option-delete'>删除</span>"

            }
        ]
    });
    //页面加载数据
    conditionSelect()
    /*-------------------------------------按钮功能-------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    })
    //重置
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
    })
    //新增
    $('.creatButton').click(function(){
        //清空所有内容
        myApp33.name = '';
        myApp33.num = '';
        myApp33.beizhu = '';
        moTaiKuang($('#myModal'));
    })
    //登记按钮
    $('.dengji').click(function(){
        var prm = {
            'cateName':myApp33.name,
            'cateRemark':myApp33.beizhu,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKAddItemCate',
            data:prm,
            success:function(result){
                if(result == '执行成功'){
                    $('#myModal2').find('.modal-body').html('添加成功！');
                    moTaiKuang($('#myModal2'))
                    //刷新列表
                    conditionSelect();
                    $(this).parents('.modal').modal('hide');
                }
            }
        })
    })
    //修改按钮
    $('.xiugai').click(function(){
        var prm = {
            'cateNum':myApp44.num,
            'cateName':myApp44.name,
            'cateRemark':myApp44.beizhu,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKEditItemCate',
            data:prm,
            success:function(result){
                if(result == 99){
                    $('#myModal2').find('.modal-body').html('修改成功！');
                    moTaiKuang($('#myModal2'))
                    //刷新列表
                    conditionSelect();
                    $('#myModal1').modal('hide');
                }
            }
        })
    })
    //删除按钮
    $('.shanchu').bind('click',function(){
        var prm = {
            'cateNum':_thisBianhao,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKDelItemCate',
            data:prm,
            success:function(result){
                if(result == 99){
                    $('#myModal2').find('.modal-body').html('删除成功！');
                    moTaiKuang($('#myModal2'))
                    conditionSelect();
                }
            }
        })
    });
    //确定按钮
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide')
    })
    //编辑
    $('.option-edit').bind('click',function(){
        //首先绑定原有的信息
        var cpBianHao = $(this).parents('tr').children('.cateNum').html();
        for(var i = 0;i<allData.length;i++){
            if(allData[i].cateNum == cpBianHao){
                console.log(allData[i]);
                //绑定信息
                myApp44.num = allData[i].cateNum;
                myApp44.name = allData[i].cateName;
                myApp44.beizhu = allData[i].cateRemark;
                moTaiKuang($('#myModal1'));
            }
        }
    })
    //删除
    $('.option-delete').bind('click',function(){
        var cpBianHao = $(this).parents('tr').children('.cateNum').html();
        _thisBianhao = cpBianHao;
        $('#myModal3').find('.modal-body').html('确定要删除吗？');
        moTaiKuang($('#myModal3'));
    })
    /*-------------------------------------方法---------------------------------*/
    function conditionSelect(){
        var filterInput = [];
        arr = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            "cateNum":filterInput[0],
            "cateName":filterInput[1],
            "userID":_userIdName
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWCK/ywCKGetItemCate',
            data:prm,
            async:false,
            success:function(result){
                allData = result;
                datasTable($("#scrap-datatables"),result)
            }
        })
    }
    //模态框自适应
    function moTaiKuang(who){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
    }
    //dataTables表格填数据
    function datasTable(tableId,arr){
        if(arr.length == 0){
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnDraw();
        }else{
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
})