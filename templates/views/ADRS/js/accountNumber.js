var Account = function(){

    //记录当前选中的userId
    var _thisID = '';

    //记录当前选择的区域id
    var _thisDistrict = '';

    /*-----------------------------------表格初始化-------------------------------------*/

    var col=[
        {
            title:'所属区域',
            data:'districtName',
            name:'districtName'
        },
        {
            title:'所属企业',
            data:'eprName'
        },
        {
            title:'户号',
            data:'accountCode'
        },
        {
            title:'户号名称',
            data:'accountName'
        },
        {
            title:'签署容量（kW）',
            data:'signatureVolume'
        },
        {
            title:'创建时间',
            data:'createDate'
        },
        {
            title:'备注',
            data:'memo'
        },
        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='option-button option-edit' data-userId='" + full.accountId + "'>编辑</span>" +

                    "<span class='option-button option-qiye' data-userId='" + full.accountId + "'>绑定企业</span>"

            }
        },

    ]

    $('#table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": true,
        "bProcessing":true,
        "iDisplayLength":50,//默认每页显示的条数
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
        'buttons':{
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs hiddenButton'
        },
        "columns": col,

        "rowsGroup": [
            'districtName:name',
            0,
            1
        ],
        "aoColumnDefs": [ { "orderable": false, "targets": [ 1,2,3,4,5] }]
    });

    var districtCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<div class="checker"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'区域id',
            data:'id'
        },
        {
            title:'区域名称',
            data:'name'
        },
        {
            title:'父级id',
            data:'pId'
        },
        {
            title:'区域等级',
            data:'level',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '省级'

                }else if(data == 2){

                    return '市级'

                }

            }
        },
        //{
        //    title:'是否有效',
        //    data:'isDelName'
        //}

    ]

    _tableInit($('#district-table'),districtCol,2,true,'','','','',10);

    /*-----------------------------------创建表单验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //编码
            'account-num':{

                required: true

            },

            //名称
            'account-name':{

                required: true

            },

            //区域
            'account-district':{

                required: true

            },

            //签署容量
            'account-capacity':{

                required: true,

                numberFormat1:true

            }

        },
        messages:{

            //编码
            'account-num':{

                required: '请输入编码'

            },

            //名称
            'account-name':{

                required: '请输入名称'

            },

            //区域
            'account-district':{

                required: '请选择区域'

            }

        }

    })

    //正则表达式（大于0的数字）
    $.validator.addMethod("numberFormat1",function(value,element,params){

        var doubles= /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入大于0的数字");

    /*-----------------------------------按钮事件----------------------------------------*/

    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //【创建账户】
    $('#creatUser').click(function(){

        //loadding
        $('#theLoading').modal('show');

        //初始化
        createInit();

        //模态框
        _moTaiKuang($('#create-Modal'), '提示', false, '' ,'', '创建');

        //loadding
        $('#theLoading').modal('hide');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可编辑（都可编辑）
        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        //选择区域显示
        $('.select-district').show();


    })

    //创建账户【确定按钮】
    $('#create-Modal').on('click','.dengji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRAccount/CreateDRAcctInfo','创建成功');

        })
    })

    //【编辑】
    $('#table tbody').on('click','.option-edit',function(){

        $('#theLoading').modal('show');

        //样式
        changeCss($(this));

        //初始化
        createInit();

        //获取当前的账户id
        _thisID = $(this).attr('data-userid');

        //模态框
        _moTaiKuang($('#create-Modal'), '提示', false, '' ,'', '保存');

        //绑定数据
        bind(_thisID);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //是否可操作
        //账户登录名不能操作
        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        //选择区域显示
        $('.select-district').show();

    })

    //编辑【确定】
    $('#create-Modal').on('click','.bianji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRAccount/ModifyDRAcctInfo','编辑成功',true);

        })

    })

    //【删除】
    $('#table tbody').on('click','.option-shanchu',function(){

        $('#theLoading').modal('show');

        //样式
        changeCss($(this));

        //初始化
        createInit();

        //获取当前的账户id
        _thisID = $(this).attr('data-userid');

        //模态框
        _moTaiKuang($('#create-Modal'), '确定要删除吗？', false, '' ,'', '删除');

        //绑定数据
        bind(_thisID);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //是否可操作
        //账户登录名不能操作
        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

        //选择区域消失
        $('.select-district').hide();

    })

    //删除【确定】
    $('#create-Modal').on('click','.shanchu',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            var prm = {

                acctId:_thisID

            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DRAccount/LogicDelDRAcct',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result.code == 0){

                        //创建成功
                        _moTaiKuang($('#tip-Modal'),'提示',true,true,'删除成功','');

                        //模态框消失
                        $('#create-Modal').modal('hide');


                    }else if(result.code == -2){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                    }else if(result.code == -1){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                    }else if(result.code == -3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                    }else if(result.code == -4){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                    }

                },

                error:_errorFun

            })


        })

    })
    //【选择区域】
    $('.select-district').click(function(){

        $('#theLoading').modal('show');

        //模态框
        _moTaiKuang($('#district-Modal'),'区域',false,'','','选择');

        //数据
        getDistrict();

    })

    //区域条件【查询】
    $('#selected-modal').click(function(){

        getDistrict();

    })

    //区域表格【选择】
    $('#district-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#district-table tbody').find('tr').removeClass('tables-hover');

            $('#district-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#district-table tbody').find('tr').removeClass('tables-hover');

            $('#district-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //选择区域的id
    $('#district-Modal').on('click','.btn-primary',function(){

        _thisDistrict = $('#district-table').find('.tables-hover').children().eq(1).html();

        var name = $('#district-table').find('.tables-hover').children().eq(2).html();

        $('#district-Modal').modal('hide');

        $('#account-district').val(name);

    })

    /*----------------------------------其他方法-----------------------------------------*/

    //获取账户列表
    function conditionSelect(){

        $('#theLoading').modal('show');

        var  prm = {

            //关键字
            keyword:$('#keyWord').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRAccount/GetDRAcctDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

                var arr = []

                if(result.code == -2){

                    _topTipBar('暂时没有户号数据');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('参数错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == 0){

                    arr = result.accts;

                    $('#tip').hide();

                }


                _jumpNow($('#table'),arr);

            },

            error:_errorBar

        })


    }

    //初始化
    function createInit(){

        //清空
        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val(1);

        $('#create-Modal').find('textarea').val('');

        //初始化选中的区域id
        _thisDistrict = '';

        _thisID = '';

        //验证消息要隐藏
        var error = $('#create-Modal').find('.error');

        for(var i=0;i<error.length;i++){

            if(error[i].nodeName == 'LABEL'){

                error.eq(i).hide();

            }else{

                error.eq(i).removeClass('error');

            }

        }


    }

    //获取区域
    function getDistrict(){

        var prm = {

            keyword:$('#keyWord-modal').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRDistrict/GetDRDistrictDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }else if(result.code == 0){

                    var arr = result.dists.reverse();

                    //表格
                    _jumpNow($('#district-table'),arr);
                }

            },

            error:_errorFun

        })

    }

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#account-num').val() == '' || $('#caccount-name').val() == '' || $('#account-district').val() == '' ){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项','');

        }else{

            //验证错误
            var error = $('#create-Modal').find('.error');

            if(error.length != 0){

                if(error.css('display') != 'none'){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写正确格式','');

                }else{

                    //验证通过
                    fun();

                }

            }else{

                //验证通过
                fun();

            }


        }

    }

    //创建账户(flag代表是否传id)
    function sendOption(url,seccessMeg,flag){

        var prm = {

            //所属区域
            districtId:_thisDistrict,
            //备注
            memo:$('#create-remark').val(),
            //签署容量
            signatureVolume:$('#account-capacity').val()

        };

        if(flag){

            prm.acctId = _thisID;
            //户号编码
            prm.acctCode = $('#account-num').val();
            //账户名称
            prm.acctName = $('#account-name').val();

        }else{

            //户号编码
            prm.accountCode = $('#account-num').val();
            //账户名称
                prm.accountName = $('#account-name').val();

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + url,

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //模态框消失
                    $('#create-Modal').modal('hide');

                    $('#create-Modal').one('hidden.bs.modal',function(){

                        conditionSelect();

                    })

                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }

            },

            error:_errorFun


        })

    }

    //绑定数据
    function bind(id){

        var prm = {

            acctId:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRAccount/GetDRAcctById',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //绑定数据
                    //编码
                    $('#account-num').val(result.acct.accountCode);
                    //名称
                    $('#account-name').val(result.acct.accountName);
                    //区域
                    $('#account-district').val(result.acct.districtName);
                    //签署容量
                    $('#account-capacity').val(result.acct.signatureVolume);
                    //区域id
                    _thisDistrict = result.acct.districtId;
                    //描述
                    $('#create-remark').val(result.acct.memo);

                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }

            },
            error:_errorFun

        })

    }

    function changeCss(el){

        $('.table tbody').find('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

    }

    return {
        init: function () {

            //获取账户列表
            conditionSelect();

        }
    }

}()