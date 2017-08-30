$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //存放选中的物品编码
    var _thisBianhao,_thisMingcheng;
    //登记列表vue信息
    var myApp33 = new Vue({
        el:'#myApp33',
        data:{
            'bianhao':'',
            'mingcheng':'',
            'xiaxian':'',
            'shangxian':'',
            'danwei':'',
            'flbianma':'',
            'flmingcheng':'',
            'guige':'',
            'yanse':'',
            'miaoshu':'',
            'gonghuoshang':'',
            'beizhu':'',
            'picked':0
        },
        methods:{
            'flbianmaFun':function(){
                setTimeout(function(){
                    $('#wuPinListTable').DataTable({
                        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
                        "paging": false,   //是否分页
                        "destroy": true,//还原初始化了的datatable
                        "searching": true,
                        "ordering": false,
                        "scrollY": 200,
                        "scrollX": true,
                        "pagingType":"full_numbers",
                        'language': {
                            'emptyTable': '没有数据',
                            'loadingRecords': '加载中...',
                            'processing': '查询中...',
                            'lengthMenu': '每页 _MENU_ 条',
                            'zeroRecords': '没有数据',
                            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                            'sSearch':'搜索',
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
                                className:'saveAs hidding'
                            }
                        ],
                        "dom":'B<"clear">lfrtip',
                        "columns": [
                            {
                                title:'分类编码',
                                data:'cateNum',
                                className:'cateNum'
                            },
                            {
                                title:'分类名称',
                                data:'cateName'
                            }
                        ],
                    });
                },200)
                setTimeout(function(){
                    var prm = {
                        "cateNum":'',
                        "cateName":'',
                        "userID":_userIdName
                    }
                    $.ajax({
                        type:'post',
                        url: _urls + 'YWCK/ywCKGetItemCate',
                        data:prm,
                        async:false,
                        success:function(result){
                            _elArr = result;
                            datasTable($('#wuPinListTable'),result);
                        },
                        error:function(jqXHR, textStatus, errorThrown){
                            console.log(jqXHR.responseText);
                        }
                    })
                },300);
                moTaiKuang($('#myModal4'),'分类编码选择');
            },
            'radios':function(){
                $('.inpus').click(function(){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            }
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
    //存放选中当前选中的物品分类
    var _$thisFL = '';
    //存放所有物品分类的数组
    var _elArr = [];
    /*-------------------------------------表格初始化------------------------------*/
    var _tables = $('#scrap-datatables').DataTable({
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
            'search':'搜索',
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
                className:'saveAs btn btn-success'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'物品编码',
                className:'bianma',
                data:'itemNum'
            },
            {
                title:'物品名称',
                className:'mingcheng',
                data:'itemName'
            },
            {
                title:'预警下限',
                data:'minNum'
            },
            {
                title:'预警上限',
                data:'maxNum'
            },
            {
                title:'单位',
                data:'unitName'
            },
            {
                title:'是否耐用',
                data:'isSpare',
                render:function(data, type, full, meta){
                    if(data == 0){
                        return '否'
                    }if(data == 1){
                        return '是'
                    }
                }
            },
            {
                title:'分类名称',
                data:'cateName'
            },
            {
                title:'规格',
                data:'size'
            },
            {
                title:'主要供货商',
                data:'cusName'
            },
            {
                title:'备注',
                data:'remark'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-edit btn default btn-xs purple'><i class='fa fa-edit'></i>编辑</span><span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>删除</span>"
            }
        ],
    });
    //自定义按钮位置
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    /*-------------------------------------页面加载调用----------------------------*/
    conditionSelect();
    /*-------------------------------------按钮事件-------------------------------*/
    //登记按钮
    $('.creatButton').on('click',function(){
        //确定按钮去掉修改类，添加登记类
        $('#myModal').find('.btn-primary').removeClass('xiugai').addClass('dengji');
        //初始化登记框
        myApp33.bianhao = '';
        myApp33.mingcheng = '';
        myApp33.xiaxian = '';
        myApp33.shangxian = '';
        myApp33.danwei = '';
        myApp33.flbianma = '';
        myApp33.flmingcheng = '';
        myApp33.guige = '';
        myApp33.yanse = '';
        myApp33.miaoshu = '';
        myApp33.gonghuoshang = '';
        myApp33.beizhu = '';
        myApp33.picked = 0;
        moTaiKuang($('#myModal'),'添加');
        //编码不能修改
        $('.shishi').attr('disabled',false).removeClass('disabled-block');
    })
    //登记按钮；
    $('#myModal').on('click','.dengji',function(){
        if(myApp33.mingcheng == '' || myApp33.flbianma == '' || myApp33.flmingcheng == ''){
            $('#myModal2').find('.modal-body').html('请填写红色必填项');
            moTaiKuang($('#myModal2'),'提示','flag');
        }else{
            //获取填写数据
            var prm ={
                'ItemName':myApp33.mingcheng,
                'MinNum':myApp33.xiaxian,
                'MaxNum':myApp33.shangxian,
                'UnitName':myApp33.danwei,
                'CateNum':myApp33.flbianma,
                'CateName':myApp33.flmingcheng,
                'Size':myApp33.guige,
                'Color':myApp33.yanse,
                'Description':myApp33.miaoshu,
                'CusName':myApp33.gonghuoshang,
                'remark':myApp33.beizhu,
                'userID':_userIdName,
                'isSpare':myApp33.picked,
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKAddItem',
                data:prm,
                success:function(result){
                    if(result == 99){
                        //成功后刷新列表，并且提示添加成功；
                        $('#myModal2').find('.modal-body').html('添加成功!');
                        moTaiKuang($('#myModal2'),'提示','flag');
                        conditionSelect();
                        $('#myModal').modal('hide');
                    }else{
                        $('#myModal2').find('.modal-body').html('添加失败!');
                        moTaiKuang($('#myModal2'),'提示','flag');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }

    })
    //重置按钮
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
    });
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    });
    //修改弹窗确认按钮
    $('#myModal').on('click','.xiugai',function(){
        if(myApp33.mingcheng == '' || myApp33.flbianma == '' || myApp33.flmingcheng == ''){
            $('#myModal2').find('.modal-body').html('请填写红色必填项!');
            moTaiKuang($('#myModal2'),'提示','flag');
        }else{
            var prm = {
                'ItemNum':myApp33.bianhao,
                'ItemName':myApp33.mingcheng,
                'MinNum':myApp33.xiaxian,
                'MaxNum':myApp33.shangxian,
                'UnitName':myApp33.danwei,
                'CateNum':myApp33.flbianma,
                'CateName':myApp33.flmingcheng,
                'Size':myApp33.guige,
                'Color':myApp33.yanse,
                'Description':myApp33.miaoshu,
                'CusName':myApp33.gonghuoshang,
                'remark':myApp33.beizhu,
                'userID':_userIdName,
                'isSpare':myApp33.picked
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKEditItem',
                data:prm,
                success:function(result){
                    if(result == 99){
                        $('#myModal2').find('.modal-body').html('修改成功！');
                        moTaiKuang($('#myModal2'),'提示','flag');
                        //刷新列表
                        conditionSelect();
                        $('#myModal').modal('hide');
                    }else{
                        $('#myModal2').find('.modal-body').html('修改失败！');
                        moTaiKuang($('#myModal2'),'提示','flag');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
    })
    //修改td操作按钮
    $('#scrap-datatables tbody')
        .on('click','.option-edit',function(){
        $('#myModal').find('.btn-primary').removeClass('dengji').addClass('xiugai');
        var $this = $(this).parents('tr');
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        //首先绑定原有的信息
        var wlBianMa = $(this).parents('tr').find('.bianma').html();
        var wlMingCheng = $(this).parents('tr').find('.mingcheng').html();
        for(var i = 0;i<allData.length;i++){
            if(allData[i].itemNum == wlBianMa && allData[i].itemName == wlMingCheng){
                //绑定信息
                myApp33.bianhao = allData[i].itemNum;
                myApp33.mingcheng = allData[i].itemName;
                myApp33.xiaxian = allData[i].minNum;
                myApp33.shangxian = allData[i].maxNum;
                myApp33.danwei = allData[i].unitName;
                myApp33.flbianma = allData[i].cateNum;
                myApp33.flmingcheng = allData[i].cateName;
                myApp33.guige = allData[i].size;
                myApp33.yanse = allData[i].color;
                myApp33.gonghuoshang = allData[i].cusName;
                myApp33.miaoshu = allData[i].description;
                myApp33.beizhu = allData[i].remark;
                myApp33.picked = allData[i].isSpare;
                if(myApp33.picked == 0){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').eq(1).parent('span').addClass('checked');
                }else if(myApp33.picked == 1){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').eq(0).parent('span').addClass('checked');
                }
                moTaiKuang($('#myModal'),'编辑');
            }
        }
        //编码不能修改
        $('.shishi').attr('disabled',true).addClass('disabled-block');
    });
    //删除弹窗确认按钮
    $('#scrap-datatables tbody')
        //删除td操作按钮
        .on('click','.option-delete',function(){
            var $this = $(this).parents('tr');
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var wlBianMa = $(this).parents('tr').find('.bianma').html();
            var wlMingCheng = $(this).parents('tr').find('.mingcheng').html();
            _thisBianhao = wlBianMa;
            _thisMingcheng = wlMingCheng;
            for(var i = 0;i<allData.length;i++){
                if(allData[i].itemNum == wlBianMa && allData[i].itemName == wlMingCheng){
                    //绑定信息
                    $('#wpbm').val(allData[i].itemNum);
                    $('#wpmc').val(allData[i].itemName);
                    $('#flbm').val(allData[i].cateNum);
                    $('#flmc').val(allData[i].cateName)
                    moTaiKuang($('#myModal3'),'确定要删除吗？')
                }
            }
            //删除按钮
        })
    $('#myModal3').on('click','.shanchu',function(){
        var prm = {
            'ItemNum':_thisBianhao,
            'ItemName':_thisMingcheng,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKDelItem',
            data:prm,
            success:function(result){
                if(result == 99){
                    $('#myModal2').find('.modal-body').html('删除成功！');
                    moTaiKuang($('#myModal2'),'提示','flag');
                    conditionSelect();
                }else{
                    $('#myModal2').find('.modal-body').html('删除失败！');
                    moTaiKuang($('#myModal2'),'提示','flag');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });
    //选择物品编码和名称
    $('#wuPinListTable tbody').on('click','tr',function(){
        var $this = $(this);
        $('#wuPinListTable tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        _$thisFL = $this.children('.cateNum').html();
    })
    //选择物品编码确定按钮
    $('#myModal4').find('.btn-primary').click(function(){
        for(var i=0;i<_elArr.length;i++){
            if(_elArr[i].cateNum == _$thisFL){
                myApp33.flbianma = _elArr[i].cateNum;
                myApp33.flmingcheng = _elArr[i].cateName;
            }
        }
    })
    /*------------------------------------其他方法-------------------------------*/
    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            'ItemNum':filterInput[0],
            'itemName':filterInput[1],
            'cateName':filterInput[2],
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            async:false,
            data:prm,
            success:function(result){
                allData = [];
                for(var i=0;i<result.length;i++){
                    allData.push(result[i])
                }
                datasTable($("#scrap-datatables"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //模态框自适应
    function moTaiKuang(who, title, flag) {
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