$(function(){
    /*--------------------------------全局变量---------------------------------*/
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
    var col = [
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
    ];
    _tableInit($('#scrap-datatables'),col,'1','flag','','');

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
                userID:_userIdNum,
                userName:_userIdName,
                b_UserRole:_userRole,
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
                userID:_userIdNum,
                userName:_userIdName,
                b_UserRole:_userRole,
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
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
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
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWCK/ywCKGetItemCate',
            data:prm,
            async:false,
            success:function(result){
                allData = result;
                _datasTable($("#scrap-datatables"),result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
})