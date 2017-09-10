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
    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    })
    //存放当前列表的数据
    var allData = [];
    //存放选中的类别编号
    var _thisBianhao;
    /*-------------------------------------表格初始化------------------------------*/
    var _tables = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "iDisplayLength":50,//默认每页显示的条数
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
                text: '导出',
                className:'saveAs'
            }
        ],
        "dom":'t<"F"lip>',
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
                "defaultContent": "<span class='data-option option-edit btn default btn-xs purple'><i class=''></i>编辑</span><span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>删除</span>"

            }
        ]
    });
    //自定义按钮位置
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
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
        _moTaiKuang($('#myModal'), '添加', '', '' ,'', '添加')
        $('.lbbm').removeClass('disabled-block');
        $('#myModal').find('.btn-primary').removeClass('xiugai').addClass('dengji');
    })
    //登记按钮
    $('#myModal').on('click','.dengji',function(){
        if(myApp33.name == ''){
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项!', '')
        }else{
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
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'添加成功！', '');
                        //刷新列表
                        conditionSelect();
                        $(this).parents('.modal').modal('hide');
                    }else{
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'添加失败！', '');
                    }
                    $('#myModal').modal('hide');
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
    })
    //修改按钮
    $('#myModal').on('click','.xiugai',function(){
        if(myApp33.name == ''){
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'类别名称不能为空！', '');
        }else {
            var prm = {
                'cateNum':myApp33.num,
                'cateName':myApp33.name,
                'cateRemark':myApp33.beizhu,
                'userID':_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKEditItemCate',
                data:prm,
                success:function(result){
                    if(result == 99){
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'修改成功！', '');
                        //刷新列表
                        conditionSelect();
                        $('#myModal').modal('hide');
                    }else{
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'修改失败！', '');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
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
                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'删除成功！', '');
                    conditionSelect();
                }else{
                    $('#myModal2').find('.modal-body').html('删除失败！');
                    moTaiKuang($('#myModal2'),'提示','flag');
                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'删除成功！', '');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    });
    //确定按钮
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
    //编辑
    $('#scrap-datatables tbody')
    .on('click','.option-edit',function(){
        //添加编辑确定按钮类
        $('#myModal').find('.btn-primary').removeClass('dengji').addClass('xiugai');
        //修改背景颜色标识
        var $this = $(this).parents('tr');
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        //首先绑定原有的信息
        var cpBianHao = $(this).parents('tr').children('.cateNum').html();
        for(var i = 0;i<allData.length;i++){
            if(allData[i].cateNum == cpBianHao){
                //绑定信息
                myApp33.num = allData[i].cateNum;
                myApp33.name = allData[i].cateName;
                myApp33.beizhu = allData[i].cateRemark;
                _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');
            }
        };
        //编码不能编辑
        $('.lbbm').addClass('disabled-block');
    })
    //删除
    $('#scrap-datatables tbody')
    .on('click','.option-delete',function(){
        var $this = $(this).parents('tr');
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        var cpBianHao = $(this).parents('tr').children('.cateNum').html();
        _thisBianhao = cpBianHao;
        for(var i = 0;i<allData.length;i++){
            if(allData[i].cateNum == cpBianHao){
                //绑定信息
                $('#lbxx').val(allData[i].cateNum);
                $('#lbmc').val(allData[i].cateName);
                _moTaiKuang($('#myModal3'), '确定要删除吗？', '', '' ,'', '删除');
            }
        }
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
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //控制模态框的设置，出现确定按钮的话，第三个参数传''，第四个才有效,用不到的参数一定要传''；istap,如果有值的话，内容改变，否则内容不变。
    function _moTaiKuang(who, title, flag, istap ,meg, buttonName) {
        who.modal({
            show: false,
            backdrop: 'static'
        })
        who.find('.modal-title').html(title);
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight) / 2;
        who.find('.modal-dialog').css({'margin-top': markBlockTop});
        if (flag) {
            who.find('.btn-primary').hide();
        } else {
            who.find('.btn-primary').show();
            who.find('.modal-footer').children('.btn-primary').html(buttonName);
        }
        if(istap){
            who.find('.modal-body').html(meg);
        }
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