$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //获得用户id
    var _userIdNum = sessionStorage.getItem('userName');
    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //新增vue对象数据绑定
    var wharehouse = new Vue({
        el:'#myApp33',
        data:{
            'num':'',
            'name':'',
            'barnum':'',
            'beizhu':'',
            'location':''
        },
        methods:{
            keyUpJob:function(){
                var existFlag = false;
                var allArr = [];
                var values = wharehouse.num;
                for(var i=0;i<_allData.length;i++){
                    if( values !=  _allData[i].storageNum){
                        existFlag = true;
                    }else{
                        existFlag = false;
                    }
                    allArr.push(existFlag);
                }
                if(allArr.indexOf(false)<0){
                    $('.quchong').hide();
                }else{
                    $('.quchong').show();
                }
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
    var _allData = [];
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
                title:'仓库编号',
                data:'storageNum',
                className:'bianma'
            },
            {
                title:'仓库名称',
                data:'storageName'
            },
            {
                title:'排序',
                data:'sort'
            },
            {
                title:'仓库所在地',
                data:'address'
            },
            {
                title:'备注',
                data:'remark'
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
    //仓库select
    conditionSelect('flag');
    //页面加载数据
    conditionSelect();
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
        //都可以编辑
        $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');
        $('#myApp33').find('textarea').attr('disabled',false);
        //清空所有内容
        wharehouse.name = '';
        wharehouse.num = '';
        wharehouse.beizhu = '';
        wharehouse.barnum = '';
        wharehouse.location = '';
        $('#myModal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');
        _moTaiKuang($('#myModal'), '新增仓库', '', '' ,'', '新增');
    });
    //编辑按钮
    $('#scrap-datatables')
        .on('click','.option-edit',function(){
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');
            _moTaiKuang($('#myModal'), '编辑仓库','', '' ,'', '保存');
            //绑定数据
            bindData($(this));
            //编码不可编辑
            $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');
            $('#myApp33').find('input').eq(0).attr('disabled',true).addClass('disabled-block');
        })
        .on('click','.option-delete',function(){
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');
            _moTaiKuang($('#myModal'), '确定要删除吗？', '', '' ,'', '删除')
            //绑定数据
            bindData($(this));
            //都不可编辑
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true);
        })
    //确定按钮
    $('#myModal')
        //登记确定按钮
        .on('click','.dengji',function(){
            sendMessage('YWCK/ywCKAddStorage','新增成功！','新增失败',$('#myModal'),'1');
        })
        //编辑确定按钮
        .on('click','.bianji',function(){
            sendMessage('YWCK/ywCKUptStorage','编辑成功！','编辑失败',$('#myModal'),'1');
        })
        //删除确定按钮
        .on('click','.shanchu', function () {
            sendMessage('YWCK/ywCKDelStorage','删除成功！','删除失败',$('#myModal'),'2');
        })
    /*-------------------------------------方法---------------------------------*/
    //查询仓库，无参数的时候，查询仓库列表，有参数的时候，是条件查询select
    function conditionSelect(flag){
        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            storageNum:$('#ck-select').val()
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWCK/ywCKGetStorages',
            data:prm,
            async:false,
            success:function(result){
                _allData = [];
                for(var i=0;i<result.length;i++){
                    _allData.push(result[i]);
                }
                datasTable($("#scrap-datatables"),result)
                if(flag){
                    var str = '<option value="">全部</option>';
                    for(var i=0;i<result.length;i++){
                        str += '<option value="' + result[i].storageNum +
                            '">' + result[i].storageName + '</option>'
                    }
                    $('#ck-select').append(str);
                }
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
    //绑定数据
    function bindData(el){
        var $this = el.parents('tr');
        var $thisBM = $this.children('.bianma').html();
        var prm = {
            storageNum:$thisBM,
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:prm,
            success:function(result){
                if(result.length>0){
                    //赋值
                    wharehouse.num = result[0].storageNum;
                    wharehouse.name = result[0].storageName;
                    wharehouse.barnum = result[0]['sort'];
                    wharehouse.beizhu = result[0].remark;
                    wharehouse.location = result[0].address;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //登记/编辑/删除
    function sendMessage(url,succcessMeg,errorMeg,tipBlock,flag){
        //判断非空
        if( wharehouse.name == '' ){
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');
        }else{
            //用flag来区分哪个是编辑，哪个是登记，登记不需要发送编码，编辑需要,flag=1代表登记flag=2代表编辑flag=3代表删除,
            var prm = {};
            if(flag == 1){
                //登记
                prm.storageNum = wharehouse.num;
                prm.storageName = wharehouse.name;
                prm.sort  = wharehouse.barnum;
                prm.remark = wharehouse.beizhu;
                prm.address = wharehouse.location;
            }else if(flag == 2){
                prm.storageNum = wharehouse.num;
            }
            prm.userID = _userIdNum;
            prm.userName = _userIdName;
            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                success:function(result){
                    if(result == 99){
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,succcessMeg, '');
                        $('#myModal').modal('hide');
                        conditionSelect();
                    }else{
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,errorMeg, '');
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