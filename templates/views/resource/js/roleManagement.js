$(function(){

    /*------------------------------------------变量----------------------------------------*/

    var _thisBM = '';

    //所有角色的数组
    var _allRoleArr = [];

    //新增用户登记对象
    var role = new Vue({
        el:'#role',
        data:{
            //角色编码
            num:'',
            //角色名称
            name:'',
            //备注
            remarks:'',
            //排序
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

    //验证必填项（非空）
    Vue.validator('notempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });
    /*-----------------------------------------表格初始化-----------------------------------*/

    var mainCol = [

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

    ];

    var excelButton = [0,1,2,3];

    _tableInit($('#role-table'),mainCol,1,true,'','','',excelButton,'','');

    conditionSelect(true,successFun1,true);

    /*-----------------------------------------按钮----------------------------------------*/

    //【查询】
    $('#selected').click(function(){

        conditionSelect(true);

    })

    //【重置】
    $('.resites').click(function(){

        $('.condition-query').eq(0).find('input').val('');

    })

    //【新增】
    $('.creatButton').click(function(){

        //初始化
        detailInit()

        //模态框
        _moTaiKuang($('#myModal'), '新增', '', '' ,'', '新增');

        //是否可操作
        abledOption();

        //类
        $('#myModal').find('.modal-footer').find('.btn-primary').removeClass('shanchu').removeClass('bianji').addClass('dengji');

    })

    //表格【查看】
    $('#role-table tbody').on('click','.option-see',function(){

        //初始化
        detailInit();

        //数据绑定
        bindDate($(this));

        //模态框
        _moTaiKuang($('#myModal'), '查看', true, '' ,'', '');

        //是否可操作
        disAbledOption();

    })

    //表格【编辑】
    $('#role-table tbody').on('click','.option-edit',function(){

        //初始化
        detailInit();

        //数据绑定
        bindDate($(this));

        //模态框
        _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');

        //是否可操作
        abledOption();

        //类
        $('#myModal').find('.modal-footer').find('.btn-primary').removeClass('shanchu').removeClass('dengji').addClass('bianji');

        //角色编码不能修改
        $('#role').find('.xtbm').attr('disabled',true).addClass('disabled-block');

    })

    //表格【删除】
    $('#role-table tbody').on('click','.option-delete',function(){

        //初始化
        detailInit();

        //数据绑定
        bindDate($(this));

        //模态框
        _moTaiKuang($('#myModal'), '确定要删除吗？', '', '' ,'', '删除');

        //是否可操作
        disAbledOption();

        //类
        $('#myModal').find('.modal-footer').find('.btn-primary').removeClass('bianji').removeClass('dengji').addClass('shanchu');

    })

    //【登记确定按钮】
    $('#myModal').on('click','.dengji',function(){

        editOrView('RBAC/rbacAddRole','新增成功！','新增失败！',true);

    })

    //【编辑确定按钮】
    $('#myModal').on('click','.bianji',function(){

        editOrView('RBAC/rbacUptRole','编辑成功！','编辑失败！',true);

    })

    //【删除确定按钮】
    $('#myModal').on('click','.shanchu',function(){

        editOrView('RBAC/rbacDelRole','删除成功！','删除失败！',false);

    })
    /*-----------------------------------------其他方法------------------------------------*/

    //flag为真，条件查询，为假，单个查询
    function conditionSelect(flag,fun,arrFlag){

        var prm = {

            //用户id
            userID:_userIdNum

        }
        if(flag){
            //角色名称
            prm.roleName = $('.condition-query').eq(0).find('input').val();

        }else{

            //角色编码
            prm.roleNum = _thisBM

        }

        $.ajax({

            type:'post',
            url:_urls + 'RBAC/rbacGetRoles',
            data:prm,
            beforeSend: function () {

                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');

            },
            timeout:_theTimes,
            success:function(result){

                if(arrFlag){

                    _allRoleArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _allRoleArr.push(result[i]);

                    }
                }

                fun(result);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //清除loadding
                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

                }

            }
        })


    }

    //刷新数据
    function successFun1(result){

        _jumpNow($('#role-table'),result)

    }

    //初始化
    function detailInit(){

        //角色编码
        role.num = '';
        //角色名称
        role.name = '';
        //备注
        role.remarks = '';
        //排序
        role.order = '';

    }

    //不可以编辑
    function disAbledOption(){

        $('#role').find('input').attr('disabled',true).addClass('disabled-block');

        $('#role').find('textarea').attr('disabled',true).addClass('disabled-block');

    }

    //可以编辑
    function abledOption(){

        $('#role').find('input').attr('disabled',false).removeClass('disabled-block');

        $('#role').find('textarea').attr('disabled',false).removeClass('disabled-block');

    }

    //数据绑定
    function bindDate(el){

        //样式
        $('#role-table tbody').children('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

        _thisBM = el.parents('tr').find('.roleNum').html();

        //获得详情
        conditionSelect(false,successFun);

    }

    //绑定数据
    function successFun(result){

        //暂时通过roleNum过滤
        for(var i=0;i<result.length;i++){

            if(_thisBM == result[i].roleNum){

                //绑定
                //角色编码
                role.num = result[i].roleNum;
                //角色名称
                role.name = result[i].roleName;
                //备注
                role.remarks = result[i].remark;
                //排序
                role.order = result[i].sort;

            }

        }


    }

    //登记、编辑、删除(flag为真表示登记、编辑、为假表示删除)
    function editOrView(url,successMeg,errorMeg,flag){

        //首先判断必填项是否为空
        if( role.name == '' ){

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请填写红色必填项！', '');

        }else{

            if($('.roleNum1')[0].style.display == 'none'){

                //判断是编辑、登记、还是删除

                if(flag){

                    var prm = {
                        //角色编码
                        "roleNum":role.num,
                        //角色名称
                        "roleName":role.name,
                        //备注
                        "remark":role.remarks,
                        //排序
                        "sort":role.order,
                        //用户id
                        "userID":_userIdNum
                    };

                }else{

                    var prm = {
                        //角色编码
                        "roleNum":role.num,
                        //角色名称
                        "roleName":role.name,
                        //用户id
                        "userID":_userIdNum
                    };

                }
                //发送数据
                $.ajax({
                    type:'post',
                    url:_urls + url,
                    data:prm,
                    timeout:_theTimes,
                    beforeSend: function () {

                        $('#theLoading').modal('show');
                    },
                    complete: function () {

                        $('#theLoading').modal('hide');

                    },
                    success:function(result){

                        if(result == 99){

                            //提示消息
                            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,successMeg, '');

                            //模态框消失
                            $('#myModal').modal('hide');

                            //条件刷新
                            conditionSelect(true,successFun1,true);

                        }else{

                            //提示消息
                            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,errorMeg, '');

                        }

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
})