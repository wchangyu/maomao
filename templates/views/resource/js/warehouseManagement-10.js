$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //新增vue对象数据绑定
    var wharehouse = new Vue({
        el:'#myApp33',
        data:{
            'num':'',
            'name':'',
            'barnum':'',
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
    var _allData = [];
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
                title:'仓库编号',
                data:'cateNum',
                className:'bianma'
            },
            {
                title:'仓库名称',
                data:'cateName'
            },
            {
                title:'仓库条码',
                data:'cateName'
            },
            {
                title:'备注',
                data:'createUser'
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
        wharehouse.name = '';
        wharehouse.num = '';
        wharehouse.beizhu = '';
        $('#myModal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');
        moTaiKuang($('#myModal'),'新增仓库');
    });
    //编辑按钮
    $('#scrap-datatables')
        .on('click','.option-edit',function(){
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');
            moTaiKuang($('#myModal'),'编辑仓库');
            //绑定数据
            bindData($(this));
        })
        .on('click','.option-delete',function(){
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');
            moTaiKuang($('#myModal'),'确定要删除吗？');
            //绑定数据
            bindData($(this));
        })
    //确定按钮
    $('#myModal')
        //登记确定按钮
        .on('click','.dengji',function(){
            sendMessage('','新增成功！','新增失败','1');
        })
        //编辑确定按钮
        .on('click','.bianji',function(){
            sendMessage('','编辑成功！','编辑失败','2');
        })
        //删除确定按钮
        .on('click','.shanchu', function () {
            sendMessage('','删除成功！','删除失败','3');
        })
    /*-------------------------------------方法---------------------------------*/
    function conditionSelect(){
        var filterInput = [];
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
                console.log(result);
                _allData = [];
                for(var i=0;i<_allData.length;i++){
                    _allData.push(result[i]);
                }
                //datasTable($("#scrap-datatables"),result)
            }
        })
    }
    //模态框自适应
    function moTaiKuang(who,title,flag){
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
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
    };
    //修改提示信息
    function tipInfo(who,title,meg,flag){
        moTaiKuang(who,title,flag);
        who.find('.modal-body').html(meg);
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
    //绑定数据
    function bindData(el){
        var $this = el.parents('tr');
        var $thisBM = $this.children('.bianma').html();
        for(var i=0;i<_allData.length;i++){
            if(_allData[i].num == $thisBM){
                //赋值
                wharehouse.num = _allData[i].num;
                wharehouse.name = _allData[i].name;
                wharehouse.barnum = _allData[i].barnum;
                wharehouse.beizhu = _allData[i].beizhu;
            }
        }
    }
    //登记/编辑/删除
    function sendMessage(url,succcessMeg,errorMeg,flag){
        //判断非空
        if( wharehouse.name == '' ){
            tipInfo($('#myModal2'),'提示','请填写红色必填项！','flag');
        }else{
            //用flag来区分哪个是编辑，哪个是登记，登记不需要发送编码，编辑需要,flag=1代表登记flag=2代表编辑flag=3代表删除,
            var prm = {};
            if(flag == 1){
                //登记
                prm.name = wharehouse.name;
                prm.barnum = wharehouse.barnum;
                prm.beizhu = wharehouse.beizhu;
                prm.userID = _userIdName;
            }else if(flag == 2){
                prm.num = wharehouse.num;
                prm.name = wharehouse.name;
                prm.barnum = wharehouse.barnum;
                prm.beizhu = wharehouse.beizhu;
                prm.userID = _userIdName;
            }else if(flag == 3){
                prm.num = wharehouse.num;
                prm.userID = _userIdName;
            }
            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                success:function(result){
                    if(result == 99){
                        tipInfo($('#myModal2'),'提示',succcessMeg,'flag');
                    }else{
                        tipInfo($('#myModal2'),'提示',errorMeg,'flag');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
    }
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
})