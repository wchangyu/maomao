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
    var department = new Vue({
        el:'#department',
        data:{
            num:'',
            name:'',
            higherdepartment:'',
            option:[],
            order:''
        },
        methods:{
            keyUp:function(){
                var existFlag = false;
                for(var i=0;i<_allDepartmentArr.length;i++){
                    if(_allDepartmentArr[i].departNum == department.num){
                        existFlag = true;
                    }
                }
                if(existFlag){
                    $('.isExist').show();
                }else{
                    $('.isExist').hide();
                }
            }
        }
    })

    //存放所有部门列表
    var _allDepartmentArr = [];

    /*----------------------------------------表格初始化-----------------------------------------*/
    var table = $('#personal-table').DataTable({
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
                title:'部门名',
                data:'departName'
            },
            {
                title:'部门编码',
                data:'departNum',
                className:'departNum'
            },
            {
                title:'上级部门',
                data:'parentNum'
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
        $('#bmmc').val('');
    })

    //新增按钮
    $('.creatButton').click(function(){
        //添加类名
        $('#myModal').find('.btn-primary').addClass('dengji').removeClass('bianji').removeClass('shanchu');
        //登记模态框出现
        moTaiKuang($('#myModal'),'新增');
        //初始化登记表
        department.num = '';
        department.name = '';
        department.higherdepartment = department.option[0].value;
        department.order = '';
        var disableArea = $('#department').find('.input-blockeds');
        disableArea.children('input').attr('disabled',false).removeClass('disabled-block');
        disableArea.children('select').attr('disabled',false).removeClass('disabled-block');
        disableArea.children('textarea').attr('disabled',false).removeClass('disabled-block');
    });

    //操作确定按钮
    $('#myModal')
        //登记确定按钮功能
        .on('click','.dengji',function(){
            //发送请求
            editOrView('RBAC/rbacAddDepart','登记成功!','登记失败!');
        })
        //编辑确定按钮功能
        .on('click','.bianji',function(){
            //发送请求
            editOrView('RBAC/rbacUptDepart','编辑成功!','编辑失败!');
        })
        //删除确定按钮功能
        .on('click','.shanchu',function(){
            //发送请求
            editOrView('RBAC/rbacDelDepart','删除成功!','删除失败!','flag');
        });

    //表格操作
    $('#personal-table tbody')
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
            $('.bmbm').attr('disabled',true).addClass('disabled-block');
        })
        //删除
        .on('click','.option-delete',function(){
            //详情框
            moTaiKuang($('#myModal'),'确定要删除吗？');
            $('#myModal').find('.btn-primary').addClass('shanchu').removeClass('dengji').removeClass(('bianji'));
            //绑定数据
            bindingData($(this),'flag');
        });


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

    //获取条件查询flagy用来标识是所有列表还是下拉框
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').eq(0).find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            "departName":$('#bmmc').val(),
            "userID":_userIdName
        }
        $.ajax({
            type:'post',
            url: _urls + 'RBAC/rbacGetDeparts',
            data:prm,
            success:function(result){
                _allDepartmentArr = [];
                for(var i=0;i<result.length;i++){
                    _allDepartmentArr.push(result[i]);
                }
                datasTable($('#personal-table'),result);
                department.option = [];
                var obj = {
                    text:'请选择',
                    value:''
                }
                department.option.push(obj);
                for(var i=0;i<result.length;i++){
                    if(result[i].parentNum == ''){
                        var obj = {};
                        obj.text = result[i].departName;
                        obj.value = result[i].departNum;
                        department.option.push(obj);
                    }
                }
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
        //判断必填项是否为空
        if( department.name == '' ){
            tipInfo($('#myModal1'),'提示','请填写红色必填项！','flag');
        }else{
            if( $('.isExist')[0].style.display == 'none' ){
                //判断是编辑、登记、还是删除
                if(flag){
                    var prm = {
                        "departNum":department.num,
                        "departName":department.name,
                        "userID":_userIdName
                    };
                }else{
                    var prm = {
                        "departNum":department.num,
                        "departName":department.name,
                        "parentNum":department.higherdepartment,
                        "sort":department.order,
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
                tipInfo($('#myModal1'),'提示','部门编码已存在！','flag');
            }
        }

    }

    //查看、删除绑定数据
    function bindingData(el,flag){
        var thisBM = el.parents('tr').children('.departNum').html();
        for(var i=0;i<_allDepartmentArr.length;i++){
            if( _allDepartmentArr[i].departNum == thisBM ){
                department.num = _allDepartmentArr[i].departNum;
                department.name = _allDepartmentArr[i].departName;
                department.higherdepartment = _allDepartmentArr[i].parentNum;
                department.order = _allDepartmentArr[i].sort
            }
        }
        //查看不可操作
        var disableArea = $('#department').find('.input-blockeds');
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