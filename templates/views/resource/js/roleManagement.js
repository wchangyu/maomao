$(function(){
    /*-----------------------------------------全局变量------------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //验证必填项（非空）
    Vue.validator('notempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //新增用户登记对象
    var role = new Vue({
        el:'#role',
        data:{
            num:'',
            name:'',
            remarks:'',
            order:''
        },
        methods:{
            keyUp:function(){
                var existFlag = false;
                for(var i=0;i<_allRoleArr.length;i++){
                    if(_allRoleArr[i].roleNum == role.num){
                        existFlag = true;
                    }
                }
                if(existFlag){
                    $('.roleNum1').show();
                }else{
                    $('.roleNum1').hide();
                }
            }
        }
    })


    //存放所有角色列表
    var _allRoleArr = [];
    /*----------------------------------------表格初始化-----------------------------------------*/
    var table = $('#role-table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        "bStateSave":true,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
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
                title:'角色编码',
                data:'roleNum',
                className:'roleNum'
            },
            {
                title:'角色名',
                data:'roleName'
            },
            {
                title:'备注',
                data:'remark'
            },
            {
                title:'排序',
                data:'sort'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

            }
        ]
    });

    table.buttons().container().appendTo($('.excelButton'),table.table().container());

    //表格数据
    conditionSelect();
    /*----------------------------------------按钮事件-------------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    })

    //重置
    $('.resites').click(function(){
        $('.filterInput').val('');
    })

    //新增按钮
    $('.creatButton').click(function(){
        //添加类名
        $('#myModal').find('.btn-primary').addClass('dengji').removeClass('bianji').removeClass('shanchu');
        //登记模态框出现
        moTaiKuang($('#myModal'),'新增');
        //初始化登记表
        role.num='';
        role.name='';
        role.remark='';
        role.order='';
        $('#myModal').find('.input-blockeds').children('input').attr('disabled',false).removeClass('disabled-block');
        $('#myModal').find('.input-blockeds').children('textarea').attr('disabled',false).removeClass('disabled-block');
    });

    //操作确定按钮
    $('#myModal')
    //登记确定按钮功能
        .on('click','.dengji',function(){
            //发送请求
            editOrView('RBAC/rbacAddRole','登记成功!','登记失败!');
        })
        //编辑确定按钮功能
        .on('click','.bianji',function(){
            //发送请求(编码不许修改);
            editOrView('RBAC/rbacUptRole','编辑成功!','编辑失败!');
        })
        //删除确定按钮功能
        .on('click','.shanchu',function(){
            //发送请求
            editOrView('RBAC/rbacDelRole','删除成功!','删除失败!','false');
        });

    //表格操作
    $('#role-table tbody')
    //查看
        .on('click','.option-see',function(){
            //详情框
            moTaiKuang($('#myModal'),'查看','flag');
            $('#myModal').find('.btn-primary').addClass('bianji').removeClass('dengji').removeClass('shanchu');
            //绑定数据
            bindingData($(this),'flag');
        })
        //编辑
        .on('click','.option-edit',function(){
            //详情框
            moTaiKuang($('#myModal'),'编辑');
            $('#myModal').find('.btn-primary').addClass('bianji').removeClass('dengji').removeClass('shanchu');
            //绑定数据
            bindingData($(this));
            $('.xtbm').attr('disabled',true).addClass('disabled-block');
        })
        //删除
        .on('click','.option-delete',function(){
            //详情框
            moTaiKuang($('#myModal'),'确定要删除吗？');
            $('#myModal').find('.btn-primary').addClass('shanchu').removeClass('dengji').removeClass(('bianji'));
            //绑定数据
            bindingData($(this),'flag');
        })
        //分配权限
        .on('click','.option-assigned',function(){

        })

    /*---------------------------------------其他方法--------------------------------------------*/
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

    //获取条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').eq(0).find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            "roleName":filterInput[0],
            "userID":_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetRoles',
            data:prm,
            success:function(result){
                _allRoleArr = [];
                for(var i=0;i<result.length;i++){
                    _allRoleArr.push(result[i]);
                }
                datasTable($('#role-table'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
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

    //编辑、登记方法
    function editOrView(url,successMeg,errorMeg,flag){
        //首先判断必填项是否为空
        if( role.name == '' ){
            tipInfo($('#myModal1'),'提示','请填写红色必填项！','flag');
        }else{
            if($('.roleNum1')[0].style.display == 'none'){
                //判断是编辑、登记、还是删除
                if(flag){
                    var prm = {
                        "roleNum":role.num,
                        "roleName":role.name,
                        "userID":_userIdName
                    };
                }else{
                    var prm = {
                        "roleNum":role.num,
                        "roleName":role.name,
                        "remark":role.remarks,
                        "sort":role.order,
                        "userID":_userIdName
                    };
                }
                //发送数据
                $.ajax({
                    type:'post',
                    url:_urls + url,
                    data:prm,
                    success:function(result){
                        if(result == 99){
                            //提示登记成功
                            tipInfo($('#myModal1'),'提示',successMeg,'flag');
                            $('#myModal').modal('hide');
                        }else if(result == 3){
                            //提示登记失败
                            tipInfo($('#myModal1'),'提示',errorMeg,'flag');
                        }
                        conditionSelect();
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })
            }else{
                tipInfo($('#myModal1'),'提示','角色编码已存在！','flag');
            }
        }
    }

    //查看、删除绑定数据
    function bindingData(el,flag){
        var thisBM = el.parents('tr').children('.roleNum').html();
        console.log(thisBM);
        for(var i=0;i<_allRoleArr.length;i++){
            if( _allRoleArr[i].roleNum == thisBM ){
                role.num = _allRoleArr[i].roleNum;
                role.name = _allRoleArr[i].roleName;
                role.remark = _allRoleArr[i].remark;
                role.order = _allRoleArr[i].sort
            }
        }
        //查看不可操作
        var disableArea = $('#role').find('.input-blockeds');
        if(flag){
            disableArea.children('input').attr('disabled',true).addClass('disabled-block');
            disableArea.children('select').attr('disabled',true).addClass('disabled-block');
            disableArea.children('textarea').attr('disabled',true).addClass('disabled-block');
        }else{
            disableArea.children('input').attr('disabled',false).removeClass('disabled-block');
            disableArea.children('select').attr('disabled',false).removeClass('disabled-block');
            disableArea.children('textarea').attr('disabled',false).removeClass('disabled-block');
        }
    }
})