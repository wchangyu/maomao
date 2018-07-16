var UserAnswer = function () {

    //存放所有列表的数据
    var _allDataArr = [

        {
            id:'1',
            ZT:'已发布',
            SJMC:'事件A',
            KSSJ:'事件B',
            JSSJ:'2018-07-14',
            XJFU:'2018-07-31',
            JX:'基线A',
            QY:'区域A',
            TC:'套餐A',
            DJSJ:'2017-07-15',
            CJR:'mch'
        },
        {
            id:'2',
            ZT:'已审核',
            SJMC:'事件A',
            KSSJ:'事件B',
            JSSJ:'2018-07-14',
            XJFU:'2018-07-31',
            JX:'基线A',
            QY:'区域A',
            TC:'套餐A',
            DJSJ:'2017-07-15',
            CJR:'mch'
        }

    ];

    //大用户响应数据
    var _DYHArr = [

        {

            CYSC:'0.6',
            CCXJFHL:'300',
            SDXYL:'0',
            ZDXYL:'300'

        },
        {

            CYSC:'0.5',
            CCXJFHL:'200',
            SDXYL:'0',
            ZDXYL:'200'

        }

    ]

    //聚合商响应数据
    var _JHSArr = [

        {

            HH:'0.6',
            CCXJFHL:'300',
            SDXYL:'0',
            ZDXYL:'300'

        },
        {

            HH:'0.5',
            CCXJFHL:'200',
            SDXYL:'0',
            ZDXYL:'200'

        }

    ]

    /*--------------------------------------表格初始化-------------------------------------*/

    var col = [

        {
            title:'状态',
            data:'ZT'
        },
        {
            title:'事件名称',
            data:'SJMC'
        },
        {
            title:'开始时间',
            data:'KSSJ'
        },
        {
            title:'结束时间',
            data:'JSSJ'
        },
        {
            title:'消减负荷（kWh）',
            data:'XJFU'
        },
        {
            title:'基线',
            data:'JX'
        },
        {
            title:'区域',
            data:'QY'
        },
        {
            title:'套餐（多个）',
            data:'TC'
        },
        {
            title:'登记时间',
            data:'DJSJ'
        },
        {
            title:'创建人',
            data:'CJR'
        },
        {
            title:'操作',
            data:'',
            className:'detail-button',
            render:function(){

                return '<span data-id="6" style="color:#2170f4;text-decoration: underline ">详情</span>'

            }
        }

    ]

    var _table  = $('#table').DataTable({
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

    //大用户响应表格
    var DCol = [

        {
            title:'参与资源',
            data:'',
            render:function(data, type, full, meta){

                return '<span class="select-dev" style="cursor: pointer;display: inline-block;padding: 3px 5px;border:1px solid #cccccc;border-radius: 3px !important;">选择设备</span>'

            }
        },
        {
            title:'参与时长（小时）',
            data:'CYSC',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-required table-group-action-input form-control" placeholder="必填字段"><span class="error-tip"></span>'

            }
        },
        {
            title:'此次消减负荷量',
            data:'CCXJFHL',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-required table-group-action-input form-control" placeholder="必填字段"><span class="error-tip"></span>'

            }
        },
        {
            title:'手动响应量',
            data:'SDXYL',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-required table-group-action-input form-control" placeholder="必填字段"><span class="error-tip"></span>'

            }
        },
        {
            title:'自动响应量',
            data:'ZDXYL',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-required table-group-action-input form-control" placeholder="必填字段"><span class="error-tip"></span>'

            }
        },
        {
            title:'操作',
            data:'',
            render:function(data, type, full, meta){

                return '<span class="data-option option-save btn default btn-xs green-stripe">保存</span>' +

                        '<span class="data-option option-del btn default btn-xs green-stripe">删除</span>'

            }
        }

    ];

    _tableInit($('#table-D'),DCol,2,true,'','',true,'',10);

    //聚合商响应表格
    var JCol = [

        {
            title:'用户',
            data:'',
            render:function(data, type, full, meta){

                return '<span class="select-user" style="cursor: pointer;display: inline-block;padding: 3px 5px;border:1px solid #cccccc;border-radius: 3px !important;">选择用户</span>'

            }
        },
        {
            title:'户号',
            data:'HH',
            render:function(data, type, full, meta){

                return '<input type="text" class="table-group-action-input form-control">'

            }
        },
        {
            title:'此次消减负荷量',
            data:'CCXJFHL',
            render:function(data, type, full, meta){

                return '<input type="text" class="table-group-action-input form-control">'

            }
        },
        {
            title:'手动响应量',
            data:'SDXYL',
            render:function(data, type, full, meta){

                return '<input type="text" class="table-group-action-input form-control">'

            }
        },
        {
            title:'自动响应量',
            data:'ZDXYL',
            render:function(data, type, full, meta){

                return '<input type="text" class="table-group-action-input form-control">'

            }
        }

    ];

    _tableInit($('#table-J'),JCol,2,true,'','',true,'',10);

    //登陆者获取事件
    conditionSelect();

    /*-------------------------------------按钮事件-----------------------------------------*/

    //点击【详情】
    $('#table tbody').on('click', '.detail-button', function () {

        //存放当前企业所绑定户号的数组
        var thisEprHHArr = [];

        //var thisEprId = $(this).children().attr('data-id');
        //
        //for(var i=0;i<_allMainArr.length;i++){
        //
        //    if(_allMainArr[i].eprId == thisEprId){
        //
        //        for(var j=0;j<_allMainArr[i].accts.length;j++){
        //
        //            thisEprHHArr.push(_allMainArr[i].accts[j]);
        //
        //        }
        //
        //    }
        //
        //}

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;

        var row = _table.row( tr );

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            row.child( formatDetail(thisEprHHArr) ).show();

            tr.addClass('shown');
        }
    } );

    //大用户增加一行
    var D = $('#table-D').DataTable();

    $('#add-D').on('click',function(){

        //获取表格对象
        D.row.add(['','','','']).draw();

    })

    //聚合商增加一行
    var J = $('#table-J').DataTable();

    $('#add-J').on('click',function(){

        //获取表格对象
        J.row.add(['','','','']).draw();


    })

    //选择设备
    $('#table-D').on('click','.select-dev',function(){

        //选择设备
        _moTaiKuang($('#select-SB-Modal'),'设备','','','选择');

    })

    //选择用户
    $('#table-J').on('click','.select-user',function(){

        //选择设备
        _moTaiKuang($('#select-YH-Modal'),'用户','','','选择');

    })

    //【保存】
    $('#table-D tbody').on('click','.option-save',function(){

        //暂时先不考虑
        var inputs = $(this).parents('tr').find('input');

        //格式验证
        //首先验证非空
        for(var i=0;i<inputs.length;i++){

            if(inputs.eq(i).val() == ''){

                //指出哪个是不符合的
                inputs.eq(i).addClass('table-error');

                inputs.eq(i).next('.error-tip').html('该项为必填字段').show();

            }else{

                //非空验证通过之后，验证正则
                var reg = /^\d+(\.\d+)?$/;

                if(reg.test(inputs.eq(i).val())){

                    inputs.eq(i).next('.error-tip').html('').hide();



                }else{

                    $(this).next('.error-tip').html('请输入大于0的数字').show();

                }

            }

        }


        return false;

        //暂存当前的值
        var valueArr = [];

        for(var i = 0;i<inputs.length;i++){

            valueArr.push(inputs.eq(i).val());

        }

        var tds = $(this).parents('tr').find('input').parent('td');

        for(var i=0;i<tds.length;i++){

            var str = '<span class="input-value">' + valueArr[i] +'</span>'

            tds.eq(i).empty().append(str);

        }

        $(this).html('编辑').removeClass('option-save').addClass('option-edit');

    })

    //【编辑】
    $('#table-D tbody').on('click','.option-edit',function(){

        var tds = $(this).parents('tr').find('.input-value').parent('td');

        var valueArr = [];

        //插入input中
        for(var i=0;i<tds.length;i++){

            valueArr.push(tds.eq(i).children('.input-value').html());

            var str = '<input class="input-required table-group-action-input form-control" value="' + tds.eq(i).children('.input-value').html() +'">';

            $(tds).eq(i).empty().append(str);

        }

        $(this).html('保存').removeClass('option-edit').addClass('option-save');

    })

    //【删除】
    $('#table-D tbody').on('click','.option-del',function(){

        $(this).parents('tr').remove();
    })

    //【大用户回应验证】
    $('#table-D tbody').on('keyup','.input-required',function(){

        //验证非空
        if($(this).val() == ''){

            $(this).next('.error-tip').html('该项为必填字段').show();

        }else{

            $(this).next('.error-tip').html('').hide();

            //验证格式
            var reg = /^\d+(\.\d+)?$/;

            if(reg.test($(this).val())){

                $(this).next('.error-tip').html('').hide();

            }else{

                $(this).next('.error-tip').html('请输入大于0的数字').show();

            }

        }

    })

    /*-------------------------------------其他方法-----------------------------------------*/

    //获取所有产品
    function conditionSelect(){

        $('#theLoading').modal('show');

        _datasTable($('#table'),_allDataArr);

        //var prm = {
        //
        //    //登录用户
        //    sysuserId:sessionStorage.ADRS_SysuserId,
        //    //用户角色
        //    userRole:sessionStorage.ADRS_UserRole
        //
        //}
        //
        //$.ajax({
        //
        //    type:'post',
        //
        //    url:sessionStorage.apiUrlPrefix + 'DRUserAnswer/ReceiveAnswerDRPlan',
        //
        //    data:prm,
        //
        //    timeout:_theTimes,
        //
        //    success:function(result){
        //
        //        $('#theLoading').modal('hide');
        //
        //        var arr = [];
        //
        //        if(result.code == -2){
        //
        //            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');
        //
        //        }else if(result.code == -1){
        //
        //            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');
        //
        //        }else if(result.code == -3){
        //
        //            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');
        //
        //        }else if(result.code == -4){
        //
        //            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');
        //
        //        }else if(result.code == 0){
        //
        //            _allMainArr.length = 0;
        //
        //            for(var i=0;i<result.eprs.length;i++){
        //
        //                _allMainArr.push(result.eprs[i]);
        //
        //            }
        //
        //            arr = result.eprs
        //
        //        }
        //
        //        //_jumpNow($('#table'),arr);
        //
        //    },
        //
        //    error:_errorFun
        //
        //})


    }

    //显示详情
    function formatDetail(d){

        var theader = '<table class="table table-bordered table-advance table-hover subTable">';

        var theaders = '</table>';

        var tbodyer = '<tbody>'

        var tbodyers = '</tbody>';

        var str = '';

        //计划名称、区域、开始时间、结束时间
        str += '<tr>' + '<td class="subTableTitle" ">计划名称</td>' + '<td>计划名称Con</td>' + '<td class="subTableTitle">区域</td>' + '<td>区域Con</td>' + '<td class="subTableTitle">开始时间</td>' + '<td>2018-07-01</td>'  + '<td class="subTableTitle">结束时间</td>' + '<td>2018-07-30</td>'  + '</tr>';
        //计划消减负荷量、计划消减差额、备用消减负荷量、备用消减差额量
        str += '<tr>' + '<td class="subTableTitle" ">计划消减负荷量</td>' + '<td>2100</td>' + '<td class="subTableTitle">计划消减差额</td>' + '<td>548</td>' + '<td class="subTableTitle">备用消减负荷量</td>' + '<td>3578</td>'  + '<td class="subTableTitle">备用消减差额量</td>' + '<td>8974</td>'  + '</tr>';
        //参与户数、可消减负荷、基线
        str += '<tr>' + '<td class="subTableTitle" ">参与户数</td>' + '<td>3</td>' + '<td class="subTableTitle">可消减负荷</td>' + '<td>548</td>' + '<td class="subTableTitle">基线</td>' + '<td></td>'  + '<td class="subTableTitle"></td>' + '<td></td>'  + '</tr>';
        //产品名称、产品（1、2）类型、响应时间比、响应量占比
        str += '<tr>' + '<td class="subTableTitle" ">产品名称</td>' + '<td>产品名称Con</td>' + '<td class="subTableTitle">产品（1、2）类型</td>' + '<td>548</td>' + '<td class="subTableTitle">响应时间比</td>' + '<td></td>'  + '<td class="subTableTitle">响应量占比</td>' + '<td></td>'  + '</tr>';
        //补贴方式、补贴价格、提前通知时间、产品描述
        str += '<tr>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>产品名称Con</td>' + '<td class="subTableTitle">补贴价格</td>' + '<td>548</td>' + '<td class="subTableTitle">提前通知时间</td>' + '<td></td>'  + '<td class="subTableTitle">产品描述</td>' + '<td></td>'  + '</tr>';

        return theader + tbodyer + str + tbodyers + theaders;

    }

    //用户响应

    return {
        init: function(){

        }
    }

}()