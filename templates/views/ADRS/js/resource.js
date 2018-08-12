var Resource = function () {

    //记录当前选中的userId
    var _thisID = '';

    //记录当前选中的户号
    var _thisHH = '';

    //记录当前单元格
    var _currentCell = '';

    //选择的设备
    var _selectedDevArr = [];

    //当前是直接绑定还是创建
    var _isBind = false;

    //记录当前已选中的楼宇
    var _currentPointer = '';

    //条件查询资源
    eprCondition();

    /*-----------------------------------表格初始化-------------------------------------*/

    var col=[
        {
            title:'所属区域',
            data:'districtName',
            name:'name'
        },
        {
            title:'所属户号',
            data:'acctNt',
            name:'name'
        },
        {
            title:'资源名称',
            data:'name'
        },
        {
            title:'额定功率（kW）',
            data:'ratedpower'
        },
        {
            title:'消减功率（kW）',
            data:'reducepower'
        },
        {
            title:'最大响应次数',
            data:'maxtimes'
        },
        {
            title:'响应次序',
            data:'respondSort'
        },
        {
            title:'是否自动',
            data:'iscomm',
            render:function(data, type, full, meta){

                if(data == 'True'){

                    return '是'

                }else if(data == 'False'){

                    return '否'

                }

            }
        },
        {
            title:'提前通知小时',
            data:'noticehour'
        },
        {
            title:'绑定设备组数',
            data:'meterNbrs',
            className:'details-dev',
            render:function(data, type, full, meta){

                return '（<span style="text-decoration: underline;font-weight: bold" data-id="' + full.id + '">' + data + '</span>）'

            }
        },
        {
            title:'资源类型',
            data:'resourceTypeName'
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

                //return  //"<span class='option-button option-edit' data-userId='" + full.id + "'>编辑</span>" +

                return   "<span class='option-button option-dev' data-userId='" + full.id + "'>绑定设备</span>"

            }
        }


    ]

    var _table = $('#table').DataTable({
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
            'name:name',
            0,
            1
        ],
        "aoColumnDefs": [ { "orderable": false, "targets": [ 1,2,3,4,5,6,7,8,9,10,11,12] }]
    });

    //户号
    var huCol = [
        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<div class="checker"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'户号',
            data:'accountCode',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.accountId + '">' + data+'</span>'

            }
        },
        {
            title:'户号名称',
            data:'accountName'
        },
        {
            title:'所属企业',
            data:'eprName'
        },
        {
            title:'所属区域',
            data:'districtName'
        }

    ];

    _tableInit($('#huNum-table'),huCol,2,true,'','','','');

    //设备
    var devCol = [

        //{
        //    title:'选择',
        //    "targets": -1,
        //    "data": null,
        //    render:function(data, type, full, meta){
        //
        //        return '<div class="checker" data-id="' + full.f_ServiceId + '" data-pointer="' + full.f_BuildingId + '"><span><input type="checkbox" value=""></span></div>'
        //
        //    }
        //},
        {
            title:'设备编码',
            data:'f_ServiceId'
        },
        {
            title:'设备',
            data:'f_ServiceName'
        }

    ];

    //_tableInit($('#dev-table'),devCol,2,true,'','','','',10,'');

    //添加设备（表格编辑）
    var editCol = [

        {
            title:'功率设备',
            render:function(data, type, full, meta){

                return '<div type="text" class="select-dev-cell select-dev-GL table-group-action-input form-control" placeholder="点击选择" style="cursor: pointer">点击选择</div>'

            }


        },
        {
            title:'电量设备',
            render:function(data, type, full, meta){

                return '<div type="text" class="select-dev-cell select-dev-DL table-group-action-input form-control" placeholder="点击选择" style="cursor: pointer">点击选择</div>'

            }


        },
        {
            title:'控制设备',
            render:function(data, type, full, meta){

                return '<div type="text" class="select-dev-cell select-dev-KZ table-group-action-input form-control" placeholder="点击选择" style="cursor: pointer">点击选择</div>'

            }


        },
        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='option-button option-del'>删除</span>"

            }
        }

    ];

    _tableInit($('#dev-manage'),editCol,2,true,'','','','','',true);


    /*-----------------------------------创建表单验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //资源名称
            'resource-name-modal':{

                required: true

            },

            //额定功率
            'resource-rated':{

                required: true,

                numberFormat1:true

            },

            //消减功率
            'resource-subtracting':{

                required: true,

                numberFormat1:true

            },

            //最大响应次数
            'resource-max':{

                required: true,

                numberFormat1:true

            },

            //提前通知小时
            'resource-notice':{

                required: true,

                numberFormat1:true

            },

            //响应次序
            'resource-order':{

                required: true,

                numberFormat1:true

            }

        },
        messages:{

            //资源名称
            'resource-name-modal':{

                required: '请输入资源名称'

            },

            //额定功率
            'resource-rated':{

                required: '请输入额定功率'

            },

            //消减功率
            'resource-subtracting':{

                required: '请输入消减功率'

            },

            //最大响应次数
            'resource-max':{

                required: '请输入最大响应次数'

            },

            //提前通知小时
            'resource-notice':{

                required: '请输入提前通知小时'

            },

            //响应次序
            'resource-order':{

                required: '请输入响应次序'

            }

        }

    })

    //验证数字
    //正则表达式（补贴价格只能是数字）
    $.validator.addMethod("numberFormat",function(value,element,params){

        var doubles= /^\d+(\.\d+)?$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入数字格式");

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

            sendOption('DRResource/CreateDRResourceInfo','创建成功');

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

            sendOption('','编辑成功',true);

        })

    })

    //选择户号
    $('.select-HH').click(function(){

        //初始化
        $('#keyWord-modal').val('');

        $('#district-con').val(0);

        //模态框
        _moTaiKuang($('#huNum-Modal'),'户号','','','','选择');

        //数据
        huNumData();

    })

    //户号条件选择
    $('#selected-modal').click(function(){

        huNumData();

    })

    //户号表格点击选择
    $('#huNum-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#huNum-table tbody').find('tr').removeClass('tables-hover');

            $('#huNum-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#huNum-table tbody').find('tr').removeClass('tables-hover');

            $('#huNum-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //户号选择确定按钮
    $('#huNum-Modal').on('click','.btn-primary',function(){

        _thisHH = $('#huNum-table tbody').find('.tables-hover').children().eq(1).children().attr('data-id');

        //户号名称
        var name = $('#huNum-table tbody').find('.tables-hover').children().eq(2).html();

        $('#resource-HH').val(name);

        //模态框消失
        $('#huNum-Modal').modal('hide');

    })

    //【绑定设备】
    $('#table tbody').on('click','.option-dev',function(){

        //样式
        changeCss($(this));

        //loadding
        //$('#theLoading').modal('show');

        //初始化
        _datasTable($('#dev-manage'),[]);

        createInit();

        _thisID = $(this).attr('data-userid');

        _isBind = true;

        //根据id获取设备列表
        devDataById(_thisID);

        //模态框
        _moTaiKuang($('#bind-table-Modal'),'绑定设备','','','','确定');

    })

    //【点击设备选择按钮选择】
    $('.select-dev-button').click(function(){

        //首先判断是选择哪些设备的列表
        var buttonGL = $(this).attr('class').indexOf('select-dev-GL');

        var buttonDL = $(this).attr('class').indexOf('select-dev-DL');

        var buttonKZ = $(this).attr('class').indexOf('select-dev-KZ');

        var str = '';

        if(buttonGL > -1){

            str = '功率设备列表';

            //功率设备
            devData();

            //改变类名
            $('#dev-Modal').find('.btn-primary').addClass('dev-GL-B').removeClass('dev-DL-B').removeClass('dev-KZ-B');

            //读取已选中的功率设备



        }else if(buttonDL > -1){

            str = '电量设备列表';

            //电量设备
            devData();

            //改变类名
            $('#dev-Modal').find('.btn-primary').addClass('dev-DL-B').removeClass('dev-GL-B').removeClass('dev-KZ-B');



        }else if(buttonKZ > -1){

            str = '控制设备列表';

            //控制设备
            devData();

            //改变类名
            $('#dev-Modal').find('.btn-primary').addClass('dev-KZ-B').removeClass('dev-DL-B').removeClass('dev-GL-B');



        }

        //模态框
        _moTaiKuang($('#dev-Modal'),str,'','','','选择');

    })

    //【选择设备】
    $('#create-Modal').on('click','.select-SB',function(){

        //初始化
        $('#bin-dev-Modal').find('input').val('');

        _datasTable($('#dev-manage'),[]);

        _selectedDevArr = [];

        //模态框
        _moTaiKuang($('#bind-table-Modal'),'设备','','','','确定');

    })

    //添加一行设备
    $('#bind-table-Modal').on('click','.add-row-dev',function(){

        var T = $('#dev-manage').DataTable();

        T.row.add(['','','','']).draw();

        //获取已选中的设备
        //getAlreadyDev();

    })

    //选择功率设备
    $('#dev-manage tbody').on('click','.select-dev-GL',function(){

        //获取当前选中的楼宇
        var pointerId = $(this).attr('data-pid');

        //初始化;
        devInit();

        //表格
        _moTaiKuang($('#dev-Modal'),'设备','','','','选择');

        //获取楼宇
        getPointer(pointerId);

        //类
        $('#dev-Modal').find('.btn-primary').removeClass('dev-DL-B').removeClass('dev-KZ-B').addClass('dev-GL-B');

        _currentCell = $(this);

    })

    //选择电量设备
    $('#dev-manage tbody').on('click','.select-dev-DL',function(){

        //获取当前选中的楼宇
        var pointerId = $(this).attr('data-pid');

        //初始化;
        devInit();

        //表格
        _moTaiKuang($('#dev-Modal'),'设备','','','','选择');

        //获取楼宇
        getPointer(pointerId);

        //类
        $('#dev-Modal').find('.btn-primary').removeClass('dev-GL-B').removeClass('dev-KZ-B').addClass('dev-DL-B');

        _currentCell = $(this);

    })

    //选择控制设备
    $('#dev-manage tbody').on('click','.select-dev-KZ',function(){

        //获取当前选中的楼宇
        var pointerId = $(this).attr('data-pid');

        //初始化;
        devInit();

        //表格
        _moTaiKuang($('#dev-Modal'),'设备','','','','选择');

        //获取楼宇
        getPointer(pointerId);

        //获取楼宇
        getPointer();

        //类
        $('#dev-Modal').find('.btn-primary').removeClass('dev-GL-B').removeClass('dev-DL-B').addClass('dev-KZ-B');

        _currentCell = $(this);

    })

    //选择设备按钮
    $('#dev-Modal').on('click','.btn-primary',function(){

        //ztree选择
        //获取树
        var treeObj =  $.fn.zTree.getZTreeObj("ztreeObj");

        //获取已选中的节点
        var nodes = treeObj.getCheckedNodes(true);

        if(nodes.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'未选择设备','');

        }else{


            var num = nodes[0].id;

            var name = nodes[0].name;

            var pid = nodes[0].pointer;

            _currentCell.attr('data-num',num);

            _currentCell.attr('data-pid',pid);

            _currentCell.html(name);

            $('#dev-Modal').modal('hide');

        }

    })

    //删除
    $('#dev-manage').on('click','.option-del',function(){

        var T = $('#dev-manage').DataTable();

        T.row($(this).parents('tr')).remove().draw( false );

    })

    //获取绑定的n组数据
    $('#bind-table-Modal').on('click','.btn-primary',function(){

        var tr = $('#dev-manage tbody').children('tr');

        _selectedDevArr.length = 0;

        //要考虑到只选择了一个的情况，比如说只选择了一个功率

        for(var i=0;i<tr.length;i++ ){

            var currentTr = $(tr).eq(i);

            var pointer = '';

            if(currentTr.find('.select-dev-GL').attr('data-pid')){

                pointer = currentTr.find('.select-dev-GL').attr('data-pid');

            }else if(currentTr.find('.select-dev-DL').attr('data-pid')){

                pointer = currentTr.find('.select-dev-DL').attr('data-pid');

            }else if(currentTr.find('.select-dev-KZ').attr('data-pid')){

                pointer = currentTr.find('.select-dev-KZ').attr('data-pid');

            }

            var obj = {};
            //用户资源Id
            obj.resourceId = _thisID;
            //楼宇Id ,
            obj.pointerId = pointer;
            //功率Id
            obj.powerId = currentTr.find('.select-dev-GL').attr('data-num')==undefined?'':currentTr.find('.select-dev-GL').attr('data-num');
            //电量Id
            obj.electricityId = currentTr.find('.select-dev-DL').attr('data-num')==undefined?'':currentTr.find('.select-dev-DL').attr('data-num');
            //输出控制设备Id
            obj.contrlId = currentTr.find('.select-dev-KZ').attr('data-num')==undefined?'':currentTr.find('.select-dev-KZ').attr('data-num');

            //如果功率id、电量id、控制id都是''，不放进去
            if( obj.powerId == '' && obj.electricityId == '' && obj.contrlId == '' ){



            }else{

                _selectedDevArr.push(obj);

            }



        }

        $('#bind-table-Modal').modal('hide');

        //直接绑定数据
        if(_isBind){

            $('#theLoading').modal('show');

            var prm = {

                //用户资源Id
                resourceId:_thisID,
                //用户资源对应设备表
                rbms:_selectedDevArr

            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DRResource/CreateDRResourceBindMetersInfo',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if($('.modal-backdrop').length > 0){

                        $('div').remove('.modal-backdrop');

                        $('#theLoading').hide();
                    }

                    if(result.code == -2){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                    }else if(result.code == -1){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                    }else if(result.code == -3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                    }else if(result.code == -4){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                    }else if(result.code == 0){

                        conditionSelect();

                    }


                },

                error:_errorFun

            })

        }else{

            var showCon = '选中[ ' + _selectedDevArr.length + ' ]组设备'

            $('#resource-SB').val(showCon);

        }


    })

    $('#bind-table-Modal').on('hidden.bs.modal',function(){

        _isBind = false;

    })

    //表格树的点击事件
    $('#dev-Modal').on('click','#dev-table1 tbody tr',function(){

        $('#dev-table1 tbody').children('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

    })

    //点击绑定设备数，获取设备列表
    $('#table tbody').on('click','.details-dev',function(){

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

            var id = $(this).children('span').attr('data-id');

            var prm = {

                // 资源Id
                resId:id
            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DRResource/GetDRResourceBindMetersByResourceId',

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

                        for(var i=0;i<result.rbms.length;i++){

                            thisEprHHArr.push(result.rbms[i]);

                        }

                    }

                    row.child( formatDev(thisEprHHArr) ).show();

                    tr.addClass('shown');

                    //初始化变量
                    thisRow = '';

                },

                error:_errorFun

            })
        }

    })

    /*----------------------------------其他方法-----------------------------------------*/

    //获取列表
    function conditionSelect(){

        $('#theLoading').modal('show');

        var  prm = {

            //资源类别
            type:$('#resource-type').val(),
            //关键字
            keyword:$('#resource-name').val(),
            //区域
            districtId:$('#epr1').val()== null?0:$('#epr1').val(),
            //登录者
            loginSysuserRole:sessionStorage.ADRS_UserRole

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResource/GetDRResourceDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

                $('#tip').hide();

                var arr = [];

                if(result.code == -2){

                    _topTipBar('暂时没有资源数据');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('参数错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == -6){

                    _topTipBar('抱歉，您没有获取资源数据的权限');

                }else if(result.code == 0){

                    arr = result.rces

                }

                _jumpNow($('#table'),arr);

            },

            error:_errorBar

        })


    }

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#resource-name-modal').val() == '' || $('#resource-rated').val() == '' || $('#resource-subtracting').val() == '' || $('#resource-max').val() == '' || $('#resource-notice').val() == '' || $('#resource-order').val() == '' ){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项!','');



        }else{

            //验证错误
            var error = $('#create-Modal').find('.error');

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

    //初始化
    function createInit(){

        //清空
        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val(1);

        $('#create-Modal').find('textarea').val('');

        //当前id
        _thisID = '';

        //当前选中的户号
        _thisHH = '';

        //清空设备数组
        _selectedDevArr = [];

        //input框
        $('#isNo').parent('span').removeClass('checked');

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

    //创建账户(flag代表是否传id)
    function sendOption(url,seccessMeg,flag){

        var iscomm = ''

        //设备是否具有信息交互接口
        if($('#isNo').parent('span').hasClass('checked')){

            iscomm = true;

        }else{

            iscomm = false;

        }

        var prm = {

            //资源名称
            name:$('#resource-name-modal').val(),
            //额定功率
            ratedpower:$('#resource-rated').val(),
            //消减功率
            reducepower:$('#resource-subtracting').val(),
            //最大响应次数
            maxtimes:$('#resource-max').val(),
            //提前通知小时
            noticetime:$('#resource-notice').val(),
            //响应次序
            resSort:$('#resource-order').val(),
            //资源类型
            resType:$('#resource-type-modal').val(),
            //设备是否具有信息交互接口
            iscomm:iscomm,
            //备注
            memo:$('#create-remark').val(),
            //户号
            acctId:_thisHH,
            //设备
            rbms:_selectedDevArr

        };

        if(flag){



        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + url,

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //创建成功
                    _moTaiKuang($('#tip-Modal'),'提示',true,true,seccessMeg,'');

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

    //获取户号
    function huNumData(){

        $('#theLoading').modal('show');

        var  prm = {

            //关键字
            keyword:$('#keyWord-modal').val(),

            //区域
            districtId:$('#district-con').val(),

            //登录者
            loginSysuserRole:sessionStorage.ADRS_UserRole

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRAccount/GetDRAcctDs',

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

                    _jumpNow($('#huNum-table'),result.accts);

                }

            },

            error:_errorFun

        })

    }

    //绑定数据
    function bind(id){

        var prm = {

            resId:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResource/GetDRResourceById',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //绑定数据

                    //资源名称
                    $('#resource-name-modal').val(result.resource.name);
                    //额定功率
                    $('#resource-rated').val(result.resource.ratedpower);
                    //消减功率
                    $('#resource-subtracting').val(result.resource.reducepower);
                    //最大响应次数
                    $('#resource-max').val(result.resource.maxtimes);
                    //提前通知小时
                    $('#resource-notice').val(result.resource.noticehour);
                    //响应次序
                    $('#resource-order').val(result.resource.respondSort);
                    //资源类型
                    $('#resource-type-modal').val(result.resource.resourceType);
                    //设备是否具有信息交互接口
                    if(result.resource.iscomm == 'True'){

                        $('#isNo').parent('span').addClass('checked');

                    }else{

                        $('#isNo').parent('span').removeClass('checked');

                    }
                    //户号
                    $('#resource-HH').val(result.resource.acctNt);
                    //户号
                    _thisHH = result.resource.acctId;
                    //描述
                    $('#create-remark').val(result.resource.memo);


                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }

            }

        })

    }

    //样式
    function changeCss(el){

        $('.table tbody').find('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

    }

    //获取设备列表
    function devData(arr){

        $('#theLoading').modal('show');

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResource/GetResourceBindMeterSelectDs',

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                //格式化数据
                var ztreeArr = [];

                //首先根据楼宇去重

                //获取当前选中的楼宇
                var pointerObj = $.fn.zTree.getZTreeObj("ztreePointerObj");

                var currentPointerArr = [];

                if(pointerObj){

                    //获取选中的楼宇
                    var currentPointer = pointerObj.getCheckedNodes(true);

                    //根据选中的楼宇，获取该楼宇下的设备
                    if(currentPointer.length>0){

                        var pointer = currentPointer[0].id;

                        for(var i=0;i<result.serviceObjs.length;i++){

                            if(result.serviceObjs[i].f_BuildingId == pointer){

                                currentPointerArr.push(result.serviceObjs[i]);

                            }

                        }

                    }

                }else{

                    for(var i=0;i<result.serviceObjs.length;i++){

                        currentPointerArr.push(result.serviceObjs[i]);

                    }

                }

                //将获取到的数组和已选择的数组去重

                if(arr.length != 0){

                    for(var i=0;i<currentPointerArr.length;i++){

                        for(var j=0;j<arr.length;j++){

                            if(currentPointerArr[i].f_ServiceId == arr[j]){

                                currentPointerArr.remove(currentPointerArr[i]);

                            }

                        }

                    }

                }

                for(var i=0;i<currentPointerArr.length;i++){

                    var obj = {};

                    obj.name = currentPointerArr[i].f_ServiceName;

                    obj.id = currentPointerArr[i].f_ServiceId;

                    obj.pId = currentPointerArr[i].f_ParentId;

                    obj.pointer = currentPointerArr[i].f_BuildingId;

                    obj.open = true;

                    ztreeArr.push(obj);

                }

                setZtree($('#ztreeObj'),ztreeArr);

                var treeObj = $.fn.zTree.getZTreeObj("ztreeObj");

                var nodes = treeObj.getCheckedNodes(false);

                //用递归，将所有父节点的checked隐藏
                for(var i=0;i<nodes.length;i++){

                    if(nodes[i].isParent){

                        nodes[i].nocheck = true;

                    }

                }

                //自动刷新ztree树
                treeObj.refresh();

                //ztree搜索功能
                var key = $("#keyWord-dev-modal");

                searchKey(key);
            },

            error:_errorFun

        })
    }

    //设备表格
    function formatDev(d){

        var theader = '<table class="table devTable  table-advance table-hover">' + '<thead><tr><th>功率设备</th><th>电量设备</th><th>控制设备</th></tr></thead>';

        var theaders = '</table>';

        var tbodyer = '<tbody>'

        var tbodyers = '</tbody>';

        var str = '';

        for(var i=0;i< d.length;i++){

            str += '<tr>';
            //功率设备
            str += '<td>'+ d[i].powerName +'</td>' +
                    //电量设备
                '<td>'+ d[i].electricityName +'</td>' +
                    //控制设备
                '<td>'+ d[i].controName +'</td>'

            str += '</tr>';
        }

        return theader + tbodyer + str + tbodyers + theaders;

    }

    //根据id获取设备列表
    function devDataById(id){

        var prm = {

            resId:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResource/GetDRResourceBindMetersByResourceId',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                var arr = [];

                if(result.code == 0){

                    //获取已绑定的设备，然后
                    for(var i=0;i<result.rbms.length;i++){

                        //功率设备
                        if(result.rbms[i].electricityId != 0){

                            arr.push(result.rbms[i].electricityId);

                        }

                        //电量设备
                        if(result.rbms[i].powerId != 0){

                            arr.push(result.rbms[i].electricityId);

                        }

                        //控制设备
                        if(result.rbms[i].controId == 0){

                            arr.push(result.rbms[i].controId);

                        }

                    }


                }

                getAlreadyDev();

            },

            error:_errorFun

        })


    }

    //设备树
    //ztree树
    function setZtree(treeId,treeData){

        var setting = {

            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "s", "N": "ps" },
                radioType:'all',
                nocheckInherit: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{
                showIcon:false,
            },
            callback: {

                onClick: function(e,treeId,treeNode){

                    var treeObj = $.fn.zTree.getZTreeObj(treeId);

                    //取消全部打钩的节点
                    treeObj.checkNode(treeNode,!treeNode.checked,true);

                },
                beforeClick:function(){

                    $('#ztreeObj').find('.curSelectedNode').removeClass('curSelectedNode');

                },
                onCheck:function(e,treeId,treeNode){

                    var treeObj = $.fn.zTree.getZTreeObj(treeId);

                    $('#ztreeObj').find('.curSelectedNode').removeClass('curSelectedNode');

                    $('#ztreeObj').find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                    //取消全部打钩的节点
                    treeObj.checkNode(treeNode,true,true);

                }

            }
        };

        pointerObj = $.fn.zTree.init(treeId, setting, treeData);


    }

    //ztree树搜索功能(设备)
    function searchKey(key){

        //首先解绑所有事件
        key.off();

        //聚焦事件
        key.bind("focus",focusKey($('#keyWord-dev-modal')));
        //失去焦点事件
        key.bind("blur", blurKey);
        //输入事件
        //key.bind("propertychange", searchNode);
        //输入事件
        key.bind("input", searchNode);

        function focusKey(e) {

            if ($('#keyWord-dev-modal').hasClass("empty")) {

                $('#keyWord-dev-modal').removeClass("empty");

            }
        }

        function blurKey(e) {

            //内容置为空，并且加empty类
            if ($('#keyWord-dev-modal').get(0).value === "") {

                $('#keyWord-dev-modal').addClass("empty");
            }
        }

        var lastValue='',nodeList=[];

        function searchNode(e) {

            //获取树
            var zTree = $.fn.zTree.getZTreeObj("ztreeObj");

            //去掉input中的空格（首尾）
            var value = $.trim($('#keyWord-dev-modal').get(0).value);

            //设置搜索的属性
            var keyType = "name";

            if (lastValue === value)

                return;

            lastValue = value;

            if (value === "") {

                $('.tipe').html('');
                //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。
                //获取 zTree 的全部节点数据
                //如果input是空的则显示全部；
                zTree.showNodes(zTree.transformToArray(zTree.getNodes())) ;

                return;
            }
            //getNodesByParamFuzzy:根据节点数据的属性搜索，获取条件模糊匹配
            // 的节点数据 JSON 对象集合
            nodeList = zTree.getNodesByParamFuzzy(keyType,value);

            nodeList = zTree.transformToArray(nodeList);

            if(nodeList==''){

                $('.tipe').html('抱歉，没有您想要的结果');

            }else{

                $('.tipe').html('');

            }

            updateNodes(true);

        }

        //选中之后更新节点
        function updateNodes(highlight) {

            var zTree = $.fn.zTree.getZTreeObj("ztreeObj");

            var allNode = zTree.transformToArray(zTree.getNodes());

            //指定被隐藏的节点 JSON 数据集合
            zTree.hideNodes(allNode);

            //遍历nodeList第n个nodeList

            for(var n in nodeList){

                findParent(zTree,nodeList[n]);

            }

            zTree.showNodes(nodeList);
        }

        //确定父子关系
        function findParent(zTree,node){

            //展开符合搜索条件的节点
            //展开 / 折叠 指定的节点
            zTree.expandNode(node,true,false,false);

            if(typeof node == 'object'){

                //pNode父节点
                var pNode = node.getParentNode();

            }

            if(pNode != null){

                nodeList.push(pNode);

                findParent(zTree,pNode);
            }
        }

    }

    //ztree树搜索功能(楼宇)
    function searchPointerKey(key){

        //首先解绑所有事件
        key.off();

        //聚焦事件
        key.bind("focus",focusKey($('#keyWord-pointer-modal')));
        //失去焦点事件
        key.bind("blur", blurKey);
        //输入事件
        //key.bind("propertychange", searchNode);
        //输入事件
        key.bind("input", searchNode);

        function focusKey(e) {

            if ($('#keyWord-pointer-modal').hasClass("empty")) {

                $('#keyWord-pointer-modal').removeClass("empty");

            }
        }

        function blurKey(e) {

            //内容置为空，并且加empty类
            if ($('#keyWord-pointer-modal').get(0).value === "") {

                $('#keyWord-pointer-modal').addClass("empty");
            }
        }

        var lastValue='',nodeList=[];

        function searchNode(e) {

            //获取树
            var zTree = $.fn.zTree.getZTreeObj("ztreePointerObj");

            //去掉input中的空格（首尾）
            var value = $.trim($('#keyWord-pointer-modal').get(0).value);

            //设置搜索的属性
            var keyType = "name";

            if (lastValue === value)

                return;

            lastValue = value;

            if (value === "") {

                $('.tipe-pointer').html('');
                //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。
                //获取 zTree 的全部节点数据
                //如果input是空的则显示全部；
                zTree.showNodes(zTree.transformToArray(zTree.getNodes())) ;

                return;
            }
            //getNodesByParamFuzzy:根据节点数据的属性搜索，获取条件模糊匹配
            // 的节点数据 JSON 对象集合
            nodeList = zTree.getNodesByParamFuzzy(keyType,value);

            nodeList = zTree.transformToArray(nodeList);

            if(nodeList==''){

                $('.tipe-pointer').html('抱歉，没有您想要的结果');

            }else{

                $('.tipe-pointer').html('');

            }

            updateNodes(true);

        }

        //选中之后更新节点
        function updateNodes(highlight) {

            var zTree = $.fn.zTree.getZTreeObj("ztreePointerObj");

            var allNode = zTree.transformToArray(zTree.getNodes());

            //指定被隐藏的节点 JSON 数据集合
            zTree.hideNodes(allNode);

            //遍历nodeList第n个nodeList

            for(var n in nodeList){

                findParent(zTree,nodeList[n]);

            }

            zTree.showNodes(nodeList);
        }

        //确定父子关系
        function findParent(zTree,node){

            //展开符合搜索条件的节点
            //展开 / 折叠 指定的节点
            zTree.expandNode(node,true,false,false);

            if(typeof node == 'object'){

                //pNode父节点
                var pNode = node.getParentNode();

            }

            if(pNode != null){

                nodeList.push(pNode);

                findParent(zTree,pNode);
            }
        }

    }

    //条件查询获取区域
    function eprCondition(){

        var prm = {

            isAll:true

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRAccount/GetIncludeDistrictDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                var arr = [];

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

                    var arr = result.districtIdnts;

                }

                var str = '';

                for(var i=0;i<arr.length;i++){

                    str += '<option value="' + arr[i].id + '">' + arr[i].name + '</option>'

                }

                $('#epr1').empty().append(str);

                $('#district-con').empty().append(str);

                //获取账户列表
                conditionSelect();

            },

            error:_errorFun1

        })

    }

    //每次获取已添加的设备
    function getAlreadyDev(){

        //遍历添加的设备，
        var devDom = $('#dev-manage tbody').find('.select-dev-cell');

        //当前已选中的数组
        existArr = [];

        for(var i=0;i<devDom.length;i++){

            var num = devDom.eq(i).attr('data-num') == undefined?'':devDom.eq(i).attr('data-num');

            if(num != ''){

                existArr.push(num);

            }

        }

        //获取所有设备数组
        devData(existArr);


    }

    //获取楼宇
    function getPointer(pointerId){

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResource/GetDRPointerDs',

            timeout:_theTimes,

            success:function(result){

                var arr1 = [];

                $('#theLoading').modal('hide');

                if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }else if(result.code == -6){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'抱歉，您没有获取楼宇的权限', '');

                }else if(result.code == 0){

                    for(var i=0;i<result.pos.length;i++){

                        var obj = {};

                        obj.id = result.pos[i].pointerID;

                        obj.name = result.pos[i].pointerName;

                        if(pointerId){

                            if( obj.id == pointerId ){

                                obj.checked = true;

                            }

                        }else{

                            if(i==0){

                                obj.checked = true;

                            }

                        }

                        arr1.push(obj);

                    }

                }



                if(arr1.length == 0){

                    $('#ztreePointerObj').html('暂时没有获取到楼宇数据');

                }else{

                    var setting = {

                        check: {
                            enable: true,
                            chkStyle: "radio",
                            chkboxType: { "Y": "s", "N": "ps" },
                            radioType:'all',
                            nocheckInherit: false
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        view:{
                            showIcon:false,
                        },
                        callback: {

                            onClick: function(e,treeId,treeNode){

                                var treeObj = $.fn.zTree.getZTreeObj(treeId);

                                //取消全部打钩的节点
                                treeObj.checkNode(treeNode,!treeNode.checked,true);

                                //获取所有设备
                                getAlreadyDev();

                            },
                            beforeClick:function(){

                                $('#ztreeObj').find('.curSelectedNode').removeClass('curSelectedNode');

                            },
                            onCheck:function(e,treeId,treeNode){

                                var treeObj = $.fn.zTree.getZTreeObj(treeId);

                                $('#ztreeObj').find('.curSelectedNode').removeClass('curSelectedNode');

                                $('#ztreeObj').find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                                //取消全部打钩的节点
                                treeObj.checkNode(treeNode,true,true);

                                //获取所有设备
                                getAlreadyDev();

                            }

                        }
                    };

                    $.fn.zTree.init($('#ztreePointerObj'), setting, arr1);

                    //ztree搜索功能
                    var key = $("#keyWord-pointer-modal");

                    searchPointerKey(key);

                    getAlreadyDev();

                }

            },

            error:_errorFun1

        })

    }

    //设备模态框初始化
    function devInit(){

        //楼宇关键字
        $('#keyWord-pointer-modal').val('');

        //楼宇提示
        $('.tipe-pointer').html('');

        //楼宇树
        $('#ztreePointerObj').empty();

        //设备关键字
        $('#keyWord-dev-modal').val('');

        //楼宇提示
        $('.tipe').html('');

        //楼宇树
        $('#ztreeObj').empty();

    }

    return {
        init: function(){

            //条件查询
            //conditionSelect();

        }
    }

}()