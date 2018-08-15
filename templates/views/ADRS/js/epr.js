var Epr = function () {

    //记录当前选中的userId
    var _thisID = '';

    //创建大用户的时候，记录聚合商id
    var _JHID = '';

    //存放账户所有数据
    var YHArr = [];

    //存放户号所有数据
    var HHArr = [];

    //获取户号数据
    //HHData(true);

    //记录当前选中的账户id
    var _thisYHID = '';

    //记录当前选中的户号
    var _thisHHArr = [];

    //当前选中的企业类型
    var _thisType = '';

    //存放当前所有数据的列表
    var _allMainArr = [];

    //当前选中聚合商下的用户列表数组
    var _currentJHArr = [];

    //记录当前选中的行
    var thisRow = '';

    //选择账户的时候，绑定当前企业的企业类型
    var _thisEprType = '';

    /*-----------------------------------表格初始化-------------------------------------*/

    //主表格
    var col=[
        {
            title:'类型',
            data:'eprTypeName',
            className:'eprType',
            render:function(data, type, full, meta){

                if(full.eprType == 1){

                    return '<span data-id="' + full.eprId + '" style="color:#2170f4;text-decoration: underline " data-type="' + full.eprType +'">' + data + '</span>'

                }else{

                    return '<span style="color: #333333">' + data + '</span>'

                }

            }
        },
        {
            title:'名称',
            data:'eprName'
        },
        {
            title:'编码',
            data:'eprCode'
        },
        {
            title:'行业机构',
            data:'agencyTypeName'
        },
        {
            title:'产业类型',
            data:'industryTypeName'
        },
        {
            title: '登录账户',
            data: 'userName'
        },
        {
            title:'管理户号数',
            data:'takeInPlanAcctNumber',
            className:'details-HH',
            render:function(data, type, full, meta){

                if(full.eprType == 1){



                }else{

                    return '（<span style="text-decoration: underline;" data-id="' + full.eprId +'" data-type="' + full.eprType +'">' + data + '</span>）'

                }

            }
        },
        {
            title:'其他',
            "targets": -1,
            "data": null,
            "className":'table-detail',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.eprId + '" style="color:#2170f4;text-decoration: underline ">详情</span>'

            }
        },
        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            "className":"hiddenButton",
            render:function(data, type, full, meta){

                if(full.eprType == 1){

                    return  "" //"<span class='option-button option-yonghu' data-userId='" + full.eprId + "' data-type='" + full.eprType + "'>设置账户</span>"

                }else{

                     //"<span class='option-button option-yonghu' data-userId='" + full.eprId + "' data-type='" + full.eprType + "'>设置账户</span>" +

                    return  "<span class='option-button option-huhao' data-userId='" + full.eprId + "' data-type='" + full.eprType +"'>管理户号</span>"

                }

            }
        },
    ]

    var colT=[
        {
            title:'类型',
            data:'eprTypeName',
            className:'eprType',
            render:function(data, type, full, meta){

                if(full.eprType == 1){

                    return '<span data-id="' + full.eprId + '" style="color:#2170f4;text-decoration: underline " data-type="' + full.eprType +'">' + data + '</span>'

                }else{

                    return '<span style="color: #333333">' + data + '</span>'

                }

            }
        },
        {
            title:'名称',
            data:'eprName'
        },
        {
            title:'编码',
            data:'eprCode'
        },
        {
            title:'行业机构',
            data:'agencyTypeName'
        },
        {
            title:'产业类型',
            data:'industryTypeName'
        },
        {
            title:'管理户号数',
            data:'takeInPlanAcctNumber',
            className:'details-HHT',
            render:function(data, type, full, meta){

                if(full.eprType == 1){



                }else{

                    return '（<span style="text-decoration: underline;" data-id="' + full.eprId +'" data-type="' + full.eprType +'">' + data + '</span>）'

                }

            }
        },
        {
            title:'其他',
            "targets": -1,
            "data": null,
            "className":'table-detailT',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.eprId + '" style="color:#2170f4;text-decoration: underline ">详情</span>'

            }
        },
        //{
        //    title:'编辑操作',
        //    "targets": -1,
        //    "data": null,
        //    render:function(data, type, full, meta){
        //
        //        if(full.eprType == 1){
        //
        //            return  ""
        //
        //        }else{
        //
        //            //return  "<span class='option-edit option-button' data-userId='" + full.eprId + "'>编辑</span>" +
        //
        //             return   "<span class='option-button option-huhao' data-userId='" + full.eprId + "' data-type='" + full.eprType +"'>管理户号</span>"
        //
        //        }
        //
        //    }
        //},
    ]

    var _table = $('#table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
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
        "columns": col
    });

    //选择聚合商表格
    var JHCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.eprId + '"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'企业类型',
            data:'eprTypeName'
        },
        {
            title:'编码',
            data:'eprCode'
        },
        {
            title:'名称',
            data:'eprName'
        },
        {
            title:'行业机构',
            data:'agencyTypeName'
        }

    ]

    _tableInit($('#JH-table'),JHCol,2,true,'','','','',10);

    //账户表格
    var YHCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.userId +'"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'账户',
            data:'sysuserId',
            className:'sysuserId'
        },
        {
            title:'登录账户名',
            data:'userName'
        },
        {
            title:'账户角色',
            data:'roleName'
        }

    ]

    _tableInit($('#YH-table'),YHCol,2,true,'','','','',10);

    //户号表格
    var HHCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.accountId +'"><span><input type="checkbox" value=""></span></div>'

            }
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
            title:'所属区域',
            data:'districtName'
        }

    ]

    _tableInit($('#HH-table'),HHCol,2,true,'','','','',10);

    //户号初始化
    var HHDatetableCol = [

        {
            title:'所属区域',
            data:'districtName',
            name:'district'
        },
        {
            title:'户号',
            data:'accountCode'
        },
        {
            title:'户号名称',
            data:'accountName'
        }

    ]

    /*-----------------------------------创建表单验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //编码
            'encoded-J':'required',
            //名称
            'name-J':'required',
            //地址
            'address-J':'required',
            //联系人名称
            'contact-name-J':'required',
            //联系人方式
            'contact-mode-J':{

                required:true,

                phoneNumFormat:true

            },
            //邮箱
            'mailbox-J':{

                required:true,

                emailFormat:true

            }

        },
        messages:{

            //编码
            'encoded-J':{

                required:'请输入编码'

            },
            //名称
            'name-J':{

                required:'请输入名称'

            },
            //地址
            'address-J':{

                required:'请输入地址'

            },
            //联系人名称
            'contact-name-J':{

                required:'请输入联系人名称'

            },
            //联系人方式
            'contact-mode-J':{

                required:'请输入联系人方式'

            },
            //邮箱
            'mailbox-J':{

                required:'请输入邮箱'

            }

        }

    })

    //正则表达式（补贴价格只能是数字）
    $.validator.addMethod("numberFormat",function(value,element,params){

        var doubles= /^\d+(\.\d+)?$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入数字格式");

    //正则表达式（邮箱）
    $.validator.addMethod("emailFormat",function(value,element,params){

        var doubles= /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入邮箱格式");

    //正则表达式（大于0的数字）
    $.validator.addMethod("numberFormat1",function(value,element,params){

        var doubles= /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入大于0的数字");

    //联系方式验证（手机和座机）
    $.validator.addMethod("phoneNumFormat",function(value,element,params){

        //手机号
        var mobile = /^1[3|5|8]\d{9}$/ ;
        //带区号的座机
        //var phone = /^0\d{2,3}-?\d{7,8}$/;

        var phone = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7}$/;

        //不带区号的座机
        //var phone1 = /[0-9]?\d{7}$/;

        var flag = false;

        if( mobile.test(value) || phone.test(value)){

            flag = true;

        }

        //return mobile.test(tel) || phone.test(tel);

        return this.optional(element)||flag;

    },"请输入合法的联系方式");

    /*-----------------------------------按钮事件---------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //创建聚合商【确定按钮】
    $('#create-Modal-J').on('click','.dengjiJ',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DREpr/CreateDREprInfoByAggregator','创建聚合商成功');

        })
    })

    //创建大用户【确定按钮】
    $('#create-Modal-J').on('click','.dengjiD',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DREpr/CreateDREprInfoByConsumer','创建大用户成功',false,true);

        })
    })

    //【设置账户】
    $('#table tbody').on('click','.option-yonghu',function(){

        //初始化
        $('#keyWord-YH').val('');

        //赋值
        _thisID = $(this).attr('data-userid');

        var eprType = $(this).attr('data-type');

        _thisEprType = eprType;

        //获取用户数据
        YHData(eprType);

        //模态框
        _moTaiKuang($('#select-YH-Modal'),'设置账户','','','','选择');

    })

    //账户选择【tr】
    $('#YH-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#YH-table tbody').find('tr').removeClass('tables-hover');

            $('#YH-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#YH-table tbody').find('tr').removeClass('tables-hover');

            $('#YH-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //确定选中的账户id
    $('#select-YH-Modal').on('click','.btn-primary',function(){

        $('#theLoading').modal('show');

        var selectedTr = $('#YH-table tbody').find('.tables-hover');

        if(selectedTr.length == 0){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择账户','');

        }else{

            //给id赋值
            _thisYHID = selectedTr.find('.checker').attr('data-id');

            //发送请求
            var prm = {

                //企业及居民id
                eprId:_thisID,
                //账户登录账户Id
                userId:_thisYHID

            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DREpr/CreateEprBindUserBySelect',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result.code == -2){

                        //_moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                    }else if(result.code == -1){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                    }else if(result.code == -3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                    }else if(result.code == -4){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                    }else if(result.code == 0){

                        //模态框
                        $('#select-YH-Modal').modal('hide');

                        $('#select-YH-Modal').one('hidden.bs.modal',function(){

                            conditionSelect();

                        })


                    }

                },

                error:_errorFun

            })

        }


    })

    //条件选择-账户【查询】
    $('#selected-user-modal').click(function(){

        //数据
        YHData(_thisEprType);

    })

    //【管理户号】
    $('#table tbody').on('click','.option-huhao',function(){

        //初始化
        $('#keyWord-HH').val('');

        //赋值
        _thisID = $(this).attr('data-userid');

        //企业类型
        _thisType = $(this).attr('data-type');

        //模态框
        _moTaiKuang($('#select-HH-Modal'),'账户','','','','选择');

        //获取户号
        HHData();

    })

    //户号选择【tr】
    $('#HH-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //确定选中的户号id
    $('#select-HH-Modal').on('click','.btn-primary',function(){

        var selectedTr = $('#HH-table tbody').find('.tables-hover');

        _thisHHArr.length = 0;

        if(selectedTr.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择户号','');

        }else{

            $('#theLoading').modal('show');

            //给id赋值

            for(var i=0;i<selectedTr.length;i++){

                _thisHHArr.push(selectedTr.eq(i).find('.checker').attr('data-id'))

            }

            //发送请求
            var prm = {

                //企业及居民id
                eprId:_thisID,
                //账户登录账户Id
                acctIds:_thisHHArr,
                //企业及居民类型
                eprType:_thisType

            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DREpr/CreateEprBindAcctsBySelect',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result.code == -2){

                        //_moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                    }else if(result.code == -1){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                    }else if(result.code == -3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                    }else if(result.code == -4){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                    }else if(result.code == 0){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'设置账户成功', '');

                        //模态框
                        $('#select-HH-Modal').modal('hide');

                        $('#select-HH-Modal').one('hidden.bs.modal',function(){

                            conditionSelect();

                        })


                    }

                },

                error:_errorFun

            })

        }



    })

    //选择聚合商按钮
    $('.modal-button').click(function(){

        //初始化
        //行业选择
        $('#industry-type-modal').val(0);
        //是否有效
        $('#valuation-method-modal').val(2);

        //模态框
        _moTaiKuang($('#select-JH-Modal'),'聚合商列表',false,false,false,'选择')

        //获取数据
        JHlist();

    })

    //模态框-条件查询选择
    $('#selected-modal').click(function(){

        JHlist();

    })

    //模态框-选择聚合商
    $('#JH-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#JH-table tbody').find('tr').removeClass('tables-hover');

            $('#JH-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#JH-table tbody').find('tr').removeClass('tables-hover');

            $('#JH-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //确定选择的聚合商id
    $('#select-JH-Modal').on('click','.btn-primary',function(){

        _JHID = $('#JH-table').find('.tables-hover').find('.checker').attr('data-id');

        //获取聚合商名字
        var name = $('#JH-table').find('.tables-hover').children().eq(3).html();

        $('#JHS-J').val(name);

        //模态框消失
        $('#select-JH-Modal').modal('hide');

    })

    //管理户号
    $('#table tbody').on('click', '.details-HH', function () {

        //存放当前企业所管理户号的数组
        var thisEprHHArr = [];

        var length = $(this).children('span').html();

        if(length == 0){

            return

        }

        thisRow = $(this);

        //首先判断是否需要获取数据

        var tr = thisRow.closest('tr');  //找到距离按钮最近的行tr;

        var row = _table.row( tr );

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            $('#theLoading').modal('show');

            //获取绑定的户号信息

            var eprId = $(this).children('span').attr('data-id');

            var eprType = $(this).children('span').attr('data-type');

            var prm = {

                // 企业及居民Id
                eprId:eprId,
                //企业类型
                eprType:eprType
            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DREpr/GetDRAcctsByKAEpr',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result.code == -2){

                        //_moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                    }else if(result.code == -1){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                    }else if(result.code == -3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                    }else if(result.code == -4){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                    }else if(result.code == 0){

                        for(var i=0;i<result.accts.length;i++){

                            thisEprHHArr.push(result.accts[i]);

                        }

                    }

                    //row.child( formatHH(thisEprHHArr) ).show();

                    //插入表格
                    row.child( formatHH() ).show();

                    //当前表格
                    var innerTable = thisRow.parent().next().find('.table');

                    //表格初始化
                    innerTable.DataTable({
                        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
                        "paging": false,   //是否分页
                        "destroy": true,//还原初始化了的datatable
                        "searching": false,
                        "ordering": false,
                        "bProcessing":true,
                        "iDisplayLength":50,//默认每页显示的条数
                        'language': {
                            'emptyTable': '没有数据',
                            'loadingRecords': '加载中...',
                            'processing': '查询中...',
                            'lengthMenu': '每页 _MENU_ 条',
                            'zeroRecords': '没有数据',
                            'info': '',
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
                        "columns": HHDatetableCol,

                        "rowsGroup": [
                            'district:name',
                            0
                        ]
                    });

                    _datasTable(innerTable,thisEprHHArr);

                    tr.addClass('shown');

                    //初始化变量
                    thisRow = '';

                },

                error:_errorFun

            })
        }

    } );

    //查看表格其他详情
    $('#table tbody').on('click','.table-detail',function(){

        //存放当前企业信息的数组
        var thisEprArr = [];

        var thisEprId = $(this).children().attr('data-id');

        for(var i=0;i<_allMainArr.length;i++){

            if(_allMainArr[i].eprId == thisEprId){

                thisEprArr.push(_allMainArr[i]);

            }

        }

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;

        var row = _table.row( tr );

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            //要判断是哪一层的详情展示
            row.child( formatDetail(thisEprArr) ).show();

            tr.addClass('shown');
        }

    });

    //点击类型，查看下边子账户
    $('#table tbody').on('click','.eprType',function(){

        thisRow = $(this);

        //存放当前企业信息的数组
        var thisEprArr = [];

        var tr = thisRow.closest('tr');  //找到距离按钮最近的行tr;

        var row = _table.row( tr );

        //首先判断是不是聚合商
        var eprId = $(this).children('span').attr('data-id');

        var eprType = $(this).children('span').attr('data-type');

        if(eprType != 1){

            return

        }

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            $('#theLoading').modal('show');

            _currentJHArr.length = 0;

            //获取数据
            var prm = {

                //聚合商
                eprId:eprId,
                //类型
                eprType:eprType

            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DREpr/GetDRSMAEprsByAgr',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result.code == -2){

                        //_moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                    }else if(result.code == -1){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                    }else if(result.code == -3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                    }else if(result.code == -4){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                    }else if(result.code == 0){

                        for(var i=0;i<result.smaeprs.length;i++){

                            thisEprArr.push(result.smaeprs[i]);

                            _currentJHArr.push(result.smaeprs[i]);

                        }

                    }

                    row.child( JHdownDYH() ).show();

                    var innerTable = thisRow.parents('tr').next('tr').find('.tableDlist');

                    //初始化表格
                    _tableInit(innerTable,colT,2,true,'','',true,'',10);

                    _datasTable(innerTable,thisEprArr);

                    tr.addClass('shown');

                },

                error:_errorFun

            })
        }




    })

    //子账户查看管理户号
    $('#table').on('click','.tableDlist .details-HHT',function(e){

        //存放当前企业所管理户号的数组
        var thisEprHHArr = [];

        var length = $(this).children('span').length;

        if(length == 0){

            return

        }

        thisRow = $(this);

        //首先判断是否需要获取数据

        var tr = thisRow.closest('tr');  //找到距离按钮最近的行tr;

        var table = $(this).parents('.tableDlist').DataTable();

        var row = table.row( tr );


        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            $('#theLoading').modal('show');

            //获取绑定的户号信息

            var eprId = $(this).children('span').attr('data-id');

            var eprType = $(this).children('span').attr('data-type');

            var prm = {

                // 企业及居民Id
                eprId:eprId,
                //企业类型
                eprType:eprType
            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DREpr/GetDRAcctsByKAEpr',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result.code == -2){

                        //_moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                    }else if(result.code == -1){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                    }else if(result.code == -3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                    }else if(result.code == -4){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                    }else if(result.code == 0){

                        for(var i=0;i<result.accts.length;i++){

                            thisEprHHArr.push(result.accts[i]);

                        }

                    }

                    //插入表格
                    row.child( formatHH() ).show();

                    //当前表格
                    var innerTable = thisRow.parent().next().find('.table');

                    //表格初始化
                    innerTable.DataTable({
                        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
                        "paging": false,   //是否分页
                        "destroy": true,//还原初始化了的datatable
                        "searching": false,
                        "ordering": false,
                        "bProcessing":true,
                        "iDisplayLength":50,//默认每页显示的条数
                        'language': {
                            'emptyTable': '没有数据',
                            'loadingRecords': '加载中...',
                            'processing': '查询中...',
                            'lengthMenu': '每页 _MENU_ 条',
                            'zeroRecords': '没有数据',
                            'info': '',
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
                        "columns": HHDatetableCol,

                        "rowsGroup": [
                            'district:name',
                            0
                        ]
                    });

                    _datasTable(innerTable,thisEprHHArr);

                    tr.addClass('shown');

                    //初始化变量
                    thisRow = '';

                },

                error:_errorFun

            })
        }

    })

    //自账户查看详情
    $('#table').on('click','.tableDlist .table-detailT',function(e){

        //存放当前企业信息的数组
        var thisEprArr = [];

        var thisId = $(this).children('span').attr('data-id');

        for(var i=0;i<_currentJHArr.length;i++){

            if(_currentJHArr[i].eprId == thisId){

                thisEprArr.push(_currentJHArr[i]);

            }

        }

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;

        var table = $(this).parents('.tableDlist').DataTable();

        var row = table.row( tr );

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            row.child( formatDetail1(thisEprArr) ).show();

            tr.addClass('shown');
        }

    })

    //户号条件查询
    $('#selected-num-modal').on('click',function(){

        HHData();

    })

    /*-------------------------------------其他方法-----------------------------------------*/

    //获取所有产品
    function conditionSelect(){

        $('#theLoading').modal('show');

        var prm = {

            //行业选择
            agency:$('#industry-type').val(),
            //企业及居民类型
            eprtype:$('#people-type').val(),
            //是否有效
            //isdel:$('#valuation-method').val()
            isdel:2,
            //登录者
            loginSysuserRole:sessionStorage.ADRS_UserRole

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DREpr/GetDRAgrAndKAEprs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

                var arr = [];

                if(result.code == -2){

                    _topTipBar('暂时没有企业及居民数据');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('参数错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == -6){

                    _topTipBar('抱歉，您没有获取企业及居民数据的权限');

                }else if(result.code == 0){

                    $('#tip').hide();

                    _allMainArr.length = 0;

                    for(var i=0;i<result.eprs.length;i++){

                        _allMainArr.push(result.eprs[i]);

                    }

                    arr = result.eprs

                }

                _jumpNow($('#table'),arr);

            },

            error:_errorBar

        })


    }

    //聚合商初始化
    function createInitJ(){

        //清空
        $('#create-Modal-J').find('input').val('');

        $('#create-Modal-J').find('select').val(1);

        $('#create-Modal-J').find('textarea').val('');

        //复选框
        $('.JH-button').find('input').parent('span').removeClass('checked');

        _thisID = '';

        _JHID = '';

        //选中的账户id
        _thisYHID = '';

        //选中的户号数组
        _thisHHArr = [];

        //验证消息要隐藏
        var error = $('#create-Modal-J').find('.error');

        for(var i=0;i<error.length;i++){

            if(error[i].nodeName == 'LABEL'){

                error.eq(i).hide();

            }else{

                error.eq(i).removeClass('error');

            }

        }


    }

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#encoded-J').val() == '' || $('#name-J').val() == '' || $('#address-J').val() == ''|| $('#contact-name-J').val() == ''|| $('#contact-mode-J').val() == '' || $('#mailbox-J').val() == '' ){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项!','');

        }else{

            //验证错误
            var error = $('#create-Modal-J').find('.error');

            if(error.length != 0){

                if(error.css('display') != 'none'){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写正确格式!','');

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

    //创建账户(flag代表是否传id,JD代表当前是创建的大用户还是聚合商，true的时候是创建的大用户)
    function sendOption(url,seccessMeg,flag,JD){

        var prm = {

            //行业机构
            agencyType:$('#industry-body-J').val(),
            //编码
            eprCode:$('#encoded-J').val(),
            //名称
            eprName:$('#name-J').val(),
            //地址
            address:$('#address-J').val(),
            //联系人名称
            linkMan:$('#contact-name-J').val(),
            //联系方式
            phone:$('#contact-mode-J').val(),
            //邮箱
            eMail:$('#mailbox-J').val(),
            //描述
            memo:$('#create-remark').val(),
            //默认创建聚合商
            eprType:1

        };

        if(flag){

            prm.id = _thisID;

        }else{


        }

        if(JD){

            //是否派生于聚合商

            if($('.JH-button').find('input').parent('span').hasClass('checked')){

                prm.isFromAggregator = true;

            }else{

                prm.isFromAggregator = false;

            }

            prm.aggregatorId = _JHID;

            //创建大用户,如果行业机构是居民用户的话，eprType = 2，否则是3

            if($('#industry-body-J').val() == 3){

                prm.eprType = 2;

            }else{

                prm.eprType = 3;

            }




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
                    $('#create-Modal-J').modal('hide');

                    $('#create-Modal-J').one('hidden.bs.modal',function(){

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

    //获取所有聚合商列表
    function JHlist(){

        $('#theLoading').modal('show');

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DREpr/GetDREprByAggregatorDs',

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = [];

                if(result.code == 0){

                    for(var i=0;i<result.eprs.length;i++){

                        arr.push(result.eprs[i]);

                    }


                }else if(result.code == -2){

                    //_moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }

                _datasTable($('#JH-table'),arr);

            },

            error:_errorFun1

        })

    }

    //获取账户数据
    function YHData(eprType){

        $('#theLoading').modal('show');

        var prm = {

            keyword:$('#keyWord-YH').val(),

            eprType:eprType

        }

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'DREpr/GetEprBindUserSelectDs',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = [];

                if(result.code == -2){

                    //_moTaiKuang($('#tip-Modal'),'提示',true,true,'暂无数据','');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'异常错误','');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'参数错误','');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'内容已存在','');

                }else if(result.code == 0){

                    arr = result.users;

                }

                _datasTable($('#YH-table'),arr);

            },

            error:_errorFun1

        })

    }

    //获取户号数据
    function HHData(){

        var prm = {

            keyword:$('#keyWord-HH').val()

        }

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'DREpr/GetEprBindAcctSelectDs',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                var arr = [];

                if(result.code == -2){

                    console.log('获取户号数据结果：暂无数据');

                }else if(result.code == -1){

                    console.log('获取户号数据结果：异常错误');

                }else if(result.code == -3){

                    console.log('获取户号数据结果：参数错误');

                }else if(result.code == -4){

                    console.log('获取户号数据结果：内容已存在');

                }else if(result.code == 0){

                    arr = result.accts;

                    HHArr.length = 0;

                    for(var i=0;i<arr.length;i++){

                        HHArr.push(arr[i]);

                    }

                }

                _datasTable($('#HH-table'),arr);

            },

            error:_errorFun1

        })

    }

    //显示隐藏
    function formatHH ( ) {

        var table = '<div style="width: 50%"><table class="table HHtable table-advance table-hover"></table></div>'

        return table;
    }

    //显示详情(第一层详情显示)
    function formatDetail(d){

        var theader = '<table class="table tableDetail table-advance table-hover">' + '<thead><tr style="background: #c5d7f1"><td>地址</td><td>联系人</td><td>联系方式</td><td>邮箱</td><td>描述</td></tr></thead>';

        var theaders = '</table>';

        var tbodyer = '<tbody>'

        var tbodyers = '</tbody>';

        var str = '';

        for(var i=0;i< d.length;i++){

            str += '<tr>';
            //地址
            str += '<td>'+ d[i].address +'</td>' +
                    //联系人
                '<td>'+ d[i].linkMan +'</td>' +
                    //联系方式
                '<td>'+ d[i].phone +'</td>' +
                    //邮箱
                '<td>'+ d[i].eMail +'</td>' +
                    //备注
                '<td>'+ d[i].memo +'</td>'

            str += '</tr>';
        }

        return theader + tbodyer + str + tbodyers + theaders;

    }

    //显示详情(第二层详情显示)
    function formatDetail1(d){

        var theader = '<table class="table tableDetail1 table-advance table-hover">' + '<thead><tr style="background: #c5d7f1"><td>地址</td><td>联系人</td><td>联系方式</td><td>邮箱</td><td>描述</td></tr></thead>';

        var theaders = '</table>';

        var tbodyer = '<tbody>'

        var tbodyers = '</tbody>';

        var str = '';

        for(var i=0;i< d.length;i++){

            str += '<tr>';
            //地址
            str += '<td>'+ d[i].address +'</td>' +
                    //联系人
                '<td>'+ d[i].linkMan +'</td>' +
                    //联系方式
                '<td>'+ d[i].phone +'</td>' +
                    //邮箱
                '<td>'+ d[i].eMail +'</td>' +
                    //描述
                '<td>'+ d[i].memo +'</td>'
            str += '</tr>';
        }

        return theader + tbodyer + str + tbodyers + theaders;

    }

    //聚合商下的大用户列表显示
    function JHdownDYH(){

        var table = '<table class="table tableDlist table-advance table-hover"><thead></thead><tbody></tbody></table>'

        return  table

    }

    return {

        init: function(){

            conditionSelect();

        }

    }

}()