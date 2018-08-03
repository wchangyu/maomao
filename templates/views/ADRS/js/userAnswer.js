var UserAnswer = function () {

    //当前是聚合商还是大用户
    var _eprType = sessionStorage.ADRS_UserRole;

    //存放当前所有值
    var _allData = [];

    //当前选中的户号
    var _thisHH = '';

    //当前选中的户号名称
    var _thisHHM = '';

    //点击选择户号，记录当前选中的是哪一行
    var _thisRowButton = '';

    //操作当前事件的id
    var _thisPlanId = '';

    //标签接口arr[待投标、已投标、已中标]
    var _urlArr = ['DRUserAnswer/GetWaitBidDRPlanDs','DRUserAnswer/GetAlreadyBidDRPlanDs','DRUserAnswer/GetWinBidDRPlanDs']

    //获取详情接口arr[]
    var _detailsArr = ['','DRUserAnswer/GetAlreadyReplyDRPlanDsByPlanId','DRUserAnswer/GetConfirmAcctsDRPlanDsByPlanId','','']

    //返回接口属性名称
    var _attrArr = ['waitBidplans','alreadyBidplans','winBidplans','',''];

    //详情返回的属性名称
    var _detailAttrArr = ['','replyPBAs','chooseAccts','',''];

    //记录总的消减负荷
    var _thisLoad = 0;

    //当前选中的ids
    var _acctIdsArr = [];

    var _table = '';

    /*--------------------------------------表格初始化-------------------------------------*/

    var col = [

        {
            title:'状态',
            data:'planStateName',
            render:function(data, type, full, meta){

                return stateFlag(full.planState,data)

            }
        },
        {
            title:'事件名称',
            data:'planName'
        },
        {
            title:'开始时间',
            data:'startDate'
        },
        {
            title:'结束时间',
            data:'closeDate'
        },
        {
            title:'需消减负荷（kW）',
            data:'reduceLoad'
        },
        {
            title:'基线',
            data:'baselineName'
        },
        {
            title:'区域',
            data:'districtName'
        },
        {
            title:'套餐（多个）',
            data:'librarys',
            render:function(data, type, full, meta){

                var str = '';

                for(var i=0;i<data.length;i++){

                    if(i == data.length-1){

                        str += data[i].name

                    }else{

                        str += data[i].name + '、'

                    }

                }

                return str

            }
        },
        {
            title:'发布时间',
            data:'publishDate'
        },
        {
            title:'创建人',
            data:'createPlanUserName'
        },
        {
            title:'操作',
            data:'',
            className:'detail-button',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.planId + '" style="color:#2170f4;text-decoration: underline ">响应</span>'

            }
        }

    ]

    var col1 = [

        {
            title:'状态',
            data:'planStateName',
            render:function(data, type, full, meta){

                return stateFlag(full.planState,data)

            }
        },
        {
            title:'事件名称',
            data:'planName'
        },
        {
            title:'开始时间',
            data:'startDate'
        },
        {
            title:'结束时间',
            data:'closeDate'
        },
        {
            title:'需消减负荷（kW）',
            data:'reduceLoad'
        },
        {
            title:'基线',
            data:'baselineName'
        },
        {
            title:'区域',
            data:'districtName'
        },
        {
            title:'套餐（多个）',
            data:'librarys',
            render:function(data, type, full, meta){

                var str = '';

                for(var i=0;i<data.length;i++){

                    if(i == data.length-1){

                        str += data[i].name

                    }else{

                        str += data[i].name + '、'

                    }

                }

                return str

            }
        },
        {
            title:'发布时间',
            data:'publishDate'
        },
        {
            title:'创建人',
            data:'createPlanUserName'
        },
        {
            title:'操作',
            data:'',
            className:'detail-button1',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.planId + '" style="color:#2170f4;text-decoration: underline ">详情</span>'

            }
        }

    ]

    _table  = $('#table').DataTable({
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
            title:'选择户号',
            data:'',
            className:'hiddenButton',
            render:function(data, type, full, meta){

                return '<span class="select-dev" style="cursor: pointer;display: inline-block;padding: 3px 5px;border:1px solid #cccccc;border-radius: 3px !important;">选择户号</span>'

            }
        },
        {
            title:'户号',
            data:'HH',
            className:'inputValue hiddenButton',
            render:function(data, type, full, meta){

                return '<input type="text" readonly style="background: #ffffff" class="input-value input-required table-group-action-input form-control" placeholder="必填字段"><span class="error-tip"></span>'

            }
        },
        {
            title:'户号名称',
            data:'HHMC',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" readonly style="background: #ffffff" class="input-chinese input-value input-required table-group-action-input form-control" placeholder="必填字段"><span class="error-tip"></span>'

            }
        },
        {
            title:'套餐',
            data:'',
            className:'TC',
            render:function(data, type, full, meta){

                return '<select class="setmeal table-group-action-input form-control"></select>'

            }

        },
        {
            title:'此次消减负荷量',
            data:'CCXJFHL',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-required input-value table-group-action-input form-control" placeholder="必填字段"><span class="error-tip"></span>'

            }
        },
        {
            title:'参与时长（小时）',
            data:'CYSC',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-required input-value table-group-action-input form-control" placeholder="必填字段"><span class="error-tip"></span>'

            }
        },
        {
            title:'是否自动响应',
            render:function(data, type, full, meta){

                return '<div class="switch">' + '<input class="switchButton" type="checkbox" value="0" />' + '</div>';

            }
        },
        {
            title:'描述',
            data:'MS',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value table-group-action-input form-control">'

            }
        },
        {
            title:'操作',
            data:'',
            render:function(data, type, full, meta){

                return '<span class="data-option option-save-1 btn default btn-xs green-stripe">保存</span>' +

                        '<span class="data-option option-del-1 btn default btn-xs green-stripe">删除</span>'

            }
        }

    ];

    _tableInit($('#table-D'),DCol,2,true,'','',true,'',10);

    //聚合商响应表格
    var JCol = [

        {
            title:'选择户号',
            data:'',
            render:function(data, type, full, meta){

                return '<span class="select-user" style="cursor: pointer;display: inline-block;padding: 3px 5px;border:1px solid #cccccc;border-radius: 3px !important;">选择户号</span>'

            }
        },
        {
            title:'户号',
            data:'HH',
            className:'inputValue hiddenButton',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value input-required table-group-action-input form-control" placeholder="必填字段" readonly style="background: #ffffff"><span class="error-tip"></span>'

            }
        },
        {
            title:'户号',
            data:'HHMC',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" readonly style="background: #ffffff" class="input-chinese input-value input-required table-group-action-input form-control" placeholder="必填字段"><span class="error-tip"></span>'

            }
        },
        {
            title:'套餐',
            data:'',
            className:'TC',
            render:function(data, type, full, meta){

                return '<select class="setmeal table-group-action-input form-control"></select>'

            }

        },
        {
            title:'此次消减负荷量',
            data:'CCXJFHL',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-required input-value table-group-action-input form-control" placeholder="必填字段"><span class="error-tip"></span>'

            }
        },
        {
            title:'是否自动响应',
            render:function(data, type, full, meta){

                return '<div class="switch">' + '<input class="switchButton" type="checkbox" value="0" />' + '</div>';

            }
        },
        {
            title:'描述',
            data:'MS',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value table-group-action-input form-control">'

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

    _tableInit($('#table-J'),JCol,2,true,'','',true,'',10);

    //户号表格
    var HHCol = [

        {
            title:'选择户号',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.accountId +'" data-capacity="' + full.signatureVolume + '"><span><input type="checkbox" value=""></span></div>'

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
            title:'签署容量（kW）',
            data:'signatureVolume'
        },
        {
            title:'备注',
            data:'memo'
        }

    ]

    _tableInit($('#HH-table'),HHCol,2,true,'','','','',10);

    _tableInit($('#SB-table'),HHCol,2,true,'','','','',10);

    //只读表格
    var ReadColD = [

        {
            title:'用户角色',
            data:'eprTyNt',
            class:'type',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.eprTy + '">'+ data +'</span>'

            }
        },
        {
            title:'企业名称',
            data:'eprName',
            class:'epr',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.eprId + '">'+ data +'</span>'

            }
        },
        {
            title:'户号',
            render:function(data, type, full, meta){

                if(full.eprTy == 1){

                    //聚合商
                    return full.acctNbers


                }else if(full.eprTy == 2){

                    //大用户
                    return '<span data-acctId="' + full.acctId + '">' + full.acctName + '</span>'

                }else{

                    return '';

                }

            }
        },
        {
            title:'此次消减负荷量(kW)',
            data:'reduceLoad'
        }

    ]

    var ReadColJ = [

        {
            title:'用户角色',
            data:'eprTyNt',
            class:'type',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.eprTy + '">'+ data +'</span>'

            }
        },
        {
            title:'企业名称',
            data:'eprName',
            class:'epr',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.eprId + '">'+ data +'</span>'

            }
        },
        {
            title:'户数',
            render:function(data, type, full, meta){

                if(full.eprTy == 1){

                    //聚合商
                    return full.acctNbers


                }else if(full.eprTy == 2){

                    //大用户
                    return '<span data-acctId="' + full.acctId + '">' + full.acctName + '</span>'

                }else{

                    return '';

                }

            }
        },
        {
            title:'此次消减负荷量(kW)',
            data:'reduceLoad'
        }

    ]

    //待投标列表(默认)
    tenderData(_urlArr[0],0);

    /*-------------------------------------按钮事件-----------------------------------------*/

    //点击标签，加载数据
    $('.nav-tabs').on('click','li',function(){

        var indexUrl = $(this).index();

        var tableStr =
            '<table id="table" class="table table-striped table-advance table-hover" cellspacing="0" width="100%">' +
            '    <thead>' +
            '    </thead>' +
            '    <tbody>' +
            '    </tbody>' +
            '</table>';

        $('#table-block').empty().append(tableStr);

        if(indexUrl == 0){

            _table =  $('#table').DataTable({
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

        }else{

            _table =  $('#table').DataTable({
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
                "columns": col1
            });

        }

        tenderData(_urlArr[indexUrl],indexUrl);

    })

    //点击【详情】
    $('#table tbody').on('click', '.detail-button', function (){

        //存放当前企业所绑定户号的数组
        var thisOBJ = {};

        var thisEprId = $(this).children().attr('data-id');

        _thisPlanId = thisEprId;

        _thisLoad = $(this).parent('tr').children('td').eq(4).html()

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].planId == thisEprId){

                thisOBJ = _allData[i];

                _acctIdsArr = _allData[i].acctIDs;

            }

        }

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;

        var row = _table.row( tr );

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            //首先判断当前的标签是否是可操作的，只有待投标的是可操作的，其他的只读

            var index = $('.nav-tabs').children('.active').index();

            if(index == 0){

                //row.child( formatDetail(thisOBJ) ).show();
                //
                ////初始化表格(搞清楚当前是聚合商0还是大用户1);
                //var innerTable = $(this).parents('tr').next('tr').find('.innerTable')

                if(_eprType == 4){

                    //大用户
                    row.child( formatDetailD(thisOBJ) ).show();

                    //初始化表格(搞清楚当前是聚合商0还是大用户1);
                    var innerTable = $(this).parents('tr').next('tr').find('.innerTable')

                    //获取到的套餐数组
                    DCol[3] = {

                        title:'套餐',
                        className:'TC',
                        render:function(data, type, full, meta){

                            var str = '<select class="table-setmeal table-group-action-input form-control">';

                            for(var i=0;i<thisOBJ.librarys.length;i++){

                                str += '<option value="' + thisOBJ.librarys[i].id + '">' + thisOBJ.librarys[i].name + '</option>>';

                            }

                            str += '</select>';

                            return str

                        }

                    }

                    _tableInit(innerTable,DCol,2,true,'','',true,'',10);

                    //默认选中第一个账户
                    var account = JSON.parse(sessionStorage.account);

                    //跟现在选择的户号对比
                    for(var i=0;i<account.length;i++){

                        if(sessionStorage.currentAcct == account[i].accountId){

                            _datasTable(innerTable,[account[i].accountId]);

                            //自动填写户号和名称

                            innerTable.find('tbody').children().children().eq(1).children().val(account[i].accountId);

                            innerTable.find('tbody').children().children().eq(2).children().val(account[i].accountName);

                            //绑定签署容量
                            innerTable.find('tbody').children().children().eq(0).children().attr('data-capacity',account[i].signatureVolume); //account[i].signatureVolume

                        }

                    }

                    $('.switch input').bootstrapSwitch({

                        size : "small",
                        state:false,
                        onSwitchChange:function(event,state){

                            if(state==true){

                                $(this).val("1");

                            }else{

                                $(this).val("0");
                            }
                        }

                    });

                }else if(_eprType == 3){

                    //大用户
                    row.child( formatDetailJ(thisOBJ) ).show();

                    //初始化表格(搞清楚当前是聚合商0还是大用户1);
                    var innerTable = $(this).parents('tr').next('tr').find('.innerTable')

                    //获取到的套餐数组
                    JCol[3] = {

                        title:'套餐',
                        className:'TC',
                        render:function(data, type, full, meta){

                            var str = '<select class="table-setmeal table-group-action-input form-control">';

                            for(var i=0;i<thisOBJ.librarys.length;i++){

                                str += '<option value="' + thisOBJ.librarys[i].id + '">' + thisOBJ.librarys[i].name + '</option>>';

                            }

                            str += '</select>';


                            return str

                        }

                    }

                    _tableInit(innerTable,JCol,2,true,'','',true,'',10);


                }

            }else{

                //插入操作模块
                row.child( getFormatDetail(thisOBJ) ).show();

                //表格初始化

                var innerTable = $(this).parents('tr').next('tr').find('.getInnerTable');

                if(_eprType == 3){

                    _tableInit(innerTable,ReadColJ,2,true,'','',true,'','',true);

                }else if(_eprType == 4){

                    _tableInit(innerTable,ReadColD,2,true,'','',true,'','',true);

                }

                //获取url
                var index = $('.nav-tabs').children('.active').index();

                var url = _detailsArr[index];

                //给表格赋值
                getDetail(url,index,innerTable);

            }


            tr.addClass('shown');
        }
    } );

    //增加一行数据
    $('#table tbody').on('click','.add-button',function(){

        //获取表格对象
        var T = $(this).parents('td').find('.innerTable').DataTable();

        T.row.add(['','','','']).draw();

        $('.switch input').bootstrapSwitch({

            size : "small",
            state:false,
            onSwitchChange:function(event,state){

                if(state==true){

                    $(this).val("1");

                }else{

                    $(this).val("0");
                }
            }

        });

    })

    //【保存】聚合商
    $('#table tbody').on('click','.option-save',function(){

        //暂时先不考虑
        var inputs = $(this).parent().parent('tr').find('.input-required');

        //所有input的值
        var inputValue = $(this).parent().parent('tr').find('.input-value');

        //是否符合验证
        var isAccord = true;

        //格式验证
        //首先验证非空
        for(var i=0;i<inputs.length;i++){

            if(inputs.eq(i).val() == ''){

                //指出哪个是不符合的
                inputs.eq(i).addClass('table-error');

                inputs.eq(i).next('.error-tip').html('该项为必填字段').show();

            }else{

                if(inputs.eq(i).attr('class').indexOf('input-chinese')<0){

                    //非空验证通过之后，验证正则
                    var reg = /^\d+(\.\d+)?$/;

                    if(reg.test(inputs.eq(i).val())){

                        //验证消减负荷
                        if(i==2){

                            //判断提示消息是否还在
                            var o = inputs.eq(i).next().css('display');

                            if(o != 'none'){

                                break;

                            }

                        }else{

                            inputs.eq(i).next('.error-tip').html('').hide();

                            inputs.eq(i).removeClass('table-error');

                        }

                    }else{

                        inputs.eq(i).addClass('table-error');

                        inputs.eq(i).next('.error-tip').html('请输入大于0的数字').show();


                    }

                }else{

                    $('.input-chinese').next('.error-tip').hide();

                }

            }

        }

        //查看是否都是非空
        for(var i=0;i<inputs.length;i++){

            var o = inputs.eq(i).next('.error-tip').css('display');

            if( o != 'none'){

                isAccord = false

                break;

            }else{

                isAccord = true;

            }

        }

        if(isAccord){

            //暂存当前的值
            var valueArr = [];

            for(var i = 0;i<inputValue.length;i++){

                valueArr.push(inputValue.eq(i).val());

            }

            var tds = $(this).parent().parent('tr').find('.inputValue');

            for(var i=0;i<tds.length;i++){

                var str = '<span class="input-value">' + valueArr[i] +'</span>';

                tds.eq(i).empty().append(str);

            }

            //switch不可操作
            var switchButton = $(this).parent().parent('tr').find('.switchButton');

            switchButton.bootstrapSwitch('disabled',true);

            //select也不可操作
            var select = $(this).parent().parent('tr').find('.table-setmeal');

            select.attr('disabled',true);

            $(this).html('编辑').removeClass('option-save').addClass('option-edit');

        }

    })

    //【编辑】聚合商
    $('#table tbody').on('click','.option-edit',function(){

        var tds = $(this).parent().parent('tr').find('.input-value').parent('td');

        var valueArr = [];

        //插入input中
        for(var i=0;i<tds.length;i++){

            valueArr.push(tds.eq(i).children('.input-value').html());

            if(i == tds.length-1){

                var str = '<input class="input-value table-group-action-input form-control" value="' + tds.eq(i).children('.input-value').html() +'"><span class="error-tip" style="display: none">';

            }else if( i == 1 ){

                var str = '<input class="input-required input-chinese input-value table-group-action-input form-control" value="' + tds.eq(i).children('.input-value').html() +'"><span class="error-tip" style="display: none">';

            }else{

                var str = '<input class="input-required input-value table-group-action-input form-control" value="' + tds.eq(i).children('.input-value').html() +'"><span class="error-tip" style="display: none">';

            }

            $(tds).eq(i).empty().append(str);

        }

        $(this).html('保存').removeClass('option-edit').addClass('option-save');

        //switch可操作
        var switchButton = $(this).parent().parent('tr').find('.switchButton');

        switchButton.bootstrapSwitch('disabled',false);

        //select可操作
        var select = $(this).parent().parent('tr').find('.table-setmeal');

        select.attr('disabled',false);

    })

    //【删除】聚合商
    $('#table tbody').on('click','.option-del',function(){

        //获取表格对象
        var T = $(this).parents('td').find('.innerTable').DataTable();

        T.row($(this).parents('tr')).remove().draw( false );

    })

    //【回应验证】聚合商
    $('#table tbody').on('keyup','.input-required',function(){

        //验证非空
        if($(this).val() == ''){

            $(this).next('.error-tip').html('该项为必填字段').show();

        }else{

            //区分数字和文本的必填项

            $(this).next('.error-tip').html('').hide();

            //验证格式

            if($(this).attr('class').indexOf('input-chinese')<0){

                var reg = /^\d+(\.\d+)?$/;

                if(reg.test($(this).val())){

                    $(this).next('.error-tip').html('').hide();

                    //再判断消减负荷的数量

                    if( $(this).parent('td').index() == 4 ){

                        //首先判断是否在自己的签署容量之内
                        var maxCapacity = $(this).parent().parent().children().eq(0).children().attr('data-capacity');

                        if(Number($(this).val())>Number(maxCapacity)){

                            $(this).addClass('table-error');

                            var str = '不能超过自身签署容量:' + maxCapacity + '(kW)';

                            $(this).next('.error-tip').html(str).show();

                        }else{

                            //将该表格的所有第三列数字加起来，必须小于等于thisLoad
                            var table = $(this).parents('.innerTable');

                            var loadTr = table.children('tbody').children('tr');

                            var totle = 0;

                            for(var i=0;i<loadTr.length;i++){

                                var typeFlag = loadTr.eq(i).children('td').eq(4).children('input').length;

                                var num = 0;

                                if(typeFlag == 0){

                                    num = Number(loadTr.eq(i).children('td').eq(4).children().html());

                                }else{

                                    num = Number(loadTr.eq(i).children('td').eq(4).children().val());

                                }

                                totle += num;

                            }

                            //如果总量大于thisLoad，要提示
                            if(totle>_thisLoad){

                                $(this).addClass('table-error');

                                $(this).next('.error-tip').html('消减负荷累计不能超过总负荷量').show();

                            }else{

                                $(this).removeClass('table-error');

                                $(this).next('.error-tip').html('').hide();

                            }

                        }

                    }

                }else{

                    $(this).next('.error-tip').html('请输入大于0的数字').show();

                }

            }

        }

    })

    //【选择户号】聚合商
    $('#table').on('click','.select-user',function(){

        _thisRowButton = $(this);

        //首先判断当前是编辑状态还是保存状态

        var state = $(this).parent().parent('tr').find('.option-edit').length

        //state == 1表示当前是不可操作状态,==0表示可操作
        if(state == 0){

            //初始化

            //模态框
            _moTaiKuang($('#select-HH-Modal'),'账户','','','','选择');

            //获取数据
            HHData();

        }else{

            return false;

        }

    })

    //户号选择【tr】聚合商
    $('#HH-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#HH-table tbody').find('tr').removeClass('tables-hover');

            $('#HH-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#HH-table tbody').find('tr').removeClass('tables-hover');

            $('#HH-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //确定选中的户号id聚合商
    $('#select-HH-Modal').on('click','.btn-primary',function(){

        var selectedTr = $('#HH-table tbody').find('.tables-hover');

        if(selectedTr.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择户号','');

        }else{

            $('#theLoading').modal('show');

            //给id赋值
            _thisHH = selectedTr.find('.checker').attr('data-id');

            _thisHHM = selectedTr.children().eq(2).html();

            $('#theLoading').modal('hide');

            //模态框
            $('#select-HH-Modal').modal('hide');

            _thisRowButton.parent().next().children('input').val(_thisHH);

            _thisRowButton.parent().next().next().children('input').val(_thisHHM);

            //隐藏验证消息
            _thisRowButton.parent().next().children('.error-tip').html('').hide();

            _thisRowButton.parent().next().next().children('.error-tip').html('').hide();

            //将签署容量写入【选择户号上】
            var capacity = selectedTr.find('.checker').attr('data-capacity');

            _thisRowButton.attr('data-capacity',capacity);

            //模态框
            $('#select-HH-Modal').modal('hide');

        }



    })

    //【聚合商确定回应】聚合商
    $('#table').on('click','.answer-button',function(){

        //判断当前日期和反馈截止日期的大小，超过的话，提示不能通过
        var EndTime = $(this).parents('#table').find('.endTime').html();

        var NowTime = moment().format('YYYY/MM/DD HH:mm:ss');

        if(NowTime>EndTime){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'已超过反馈截止日期','');

        }else{

            //判断当前选择的户号是否保存了
            var button = $(this).parent().prev().find('.data-option');

            //标记是否表格中有未保存的户号
            var isCom = true;

            for(var i=0;i<button.length;i++){

                if(button.eq(i).attr('class').indexOf('option-save')>-1){

                    isCom = false;

                    break;

                }

            }

            if(!isCom){

                _moTaiKuang($('#tip-Modal'),'提示',true,true,'存在未保存的户号，请先保存','');

                return false;

            }

            //户号、消减负荷、是否手动、描述
            var trs = $(this).parent().prev().find('table').children('tbody').children('tr');

            var arr = [];

            var url = '';

            if(_eprType == 3){

                for(var i=0;i<trs.length;i++){

                    var p = trs[i];

                    if(trs.eq(i).children('.dataTables_empty').length == 0){

                        var obj = {};

                        //户号
                        obj.acctId = $(p).children().eq(1).find('.input-value').html();
                        //此次消减负荷量,
                        obj.reduceLoad = $(p).children().eq(4).find('.input-value').html();
                        //套餐
                        obj.libraryId = $(p).children().eq(3).find('select').val();
                        //isAuto
                        obj.isAuto = $(p).children().eq(5).find('input').val();
                        //memo
                        obj.memo = $(p).children().eq(6).find('.input-value').html();

                        arr.push(obj);


                    }


                }

                //发送数据
                var prm = {
                    //角色
                    userRole:_eprType,
                    //响应事件Id
                    planId:_thisPlanId,
                    //聚合商响应数据
                    aggres:arr
                }

                //聚合商
                url = 'DRUserAnswer/AggrUserRespondDRPlan'

            }else if(_eprType == 4){

                //大用户
                for(var i=0;i<trs.length;i++){

                    var p = trs[i];

                    var obj = {};

                    //户号
                    obj.acctId = $(p).children().eq(1).find('.input-value').html();
                    //此次消减负荷量 ,
                    obj.reduceLoad = $(p).children().eq(4).find('.input-value').html();
                    //参与时长
                    obj.partakeHourlength = $(p).children().eq(5).find('.input-value').html();
                    //套餐
                    obj.libraryId = $(p).children().eq(3).find('select').val();
                    //isAuto
                    obj.isAuto = $(p).children().eq(6).find('input').val()
                    //memo
                    obj.memo = $(p).children().eq(7).find('.input-value').html();
                    //设备
                    obj.respbabms = [];

                    arr.push(obj);

                }

                //发送数据
                var prm = {

                    //用户角色
                    userRole:_eprType,
                    //响应事件Id
                    planId:_thisPlanId,
                    //聚合商响应数据
                    kares:arr
                }

                //大用户
                url = 'DRUserAnswer/KAUserRespondDRPlan'

            }

            if(arr.length == 0){

                _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择户号','');

            }else{

                $('#theLoading').modal('show');

                $.ajax({

                    type:'post',

                    url:sessionStorage.apiUrlPrefix + url,

                    data:prm,

                    timeout:_theTimes,

                    success:function(result){

                        $('#theLoading').modal('hide');

                        if(result.code == -2){

                            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                        }else if(result.code == -1){

                            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                        }else if(result.code == -3){

                            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'请选择户号，添加响应数据', '');

                        }else if(result.code == -4){

                            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                        }else if(result.code == -6){

                            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'没有权限', '');

                        }else if(result.code == 0){

                            //直接跳到一tab
                            $('.nav-tabs').children().removeClass('active');

                            $('.nav-tabs').children().eq(1).addClass('active');

                            //获取当前的index值（）
                            var index = $('.nav-tabs').children('.active').index();

                            tenderData(_urlArr[index],index);

                        }

                    },

                    error:_errorFun

                })

            }

        }


    })

    //【保存】大用户
    $('#table tbody').on('click','.option-save-1',function(){

        //暂时先不考虑
        var inputs = $(this).parent().parent('tr').find('.input-required');

        //所有input的值
        var inputValue = $(this).parent().parent('tr').find('.input-value');

        //是否符合验证
        var isAccord = true;

        //格式验证
        //首先验证非空
        for(var i=0;i<inputs.length;i++){

            if(inputs.eq(i).val() == ''){

                //指出哪个是不符合的
                inputs.eq(i).addClass('table-error');

                inputs.eq(i).next('.error-tip').html('该项为必填字段').show();

            }else{

                if(inputs.eq(i).attr('class').indexOf('input-chinese')<0){

                    //非空验证通过之后，验证正则
                    var reg = /^\d+(\.\d+)?$/;

                    if(reg.test(inputs.eq(i).val())){

                        //验证消减负荷
                        if(i==2){

                            //判断提示消息是否还在
                            var o = inputs.eq(i).next().css('display')

                            if(o != 'none'){

                                break;

                            }

                        }else{

                            inputs.eq(i).next('.error-tip').html('').hide();

                            inputs.eq(i).removeClass('table-error');

                        }

                        inputs.eq(i).next('.error-tip').html('').hide();

                        inputs.eq(i).removeClass('table-error');

                    }else{

                        inputs.eq(i).addClass('table-error');

                        inputs.eq(i).next('.error-tip').html('请输入大于0的数字').show();


                    }

                }else{

                    $('.input-chinese').removeClass('table-error');

                    $('.input-chinese').next('.error-tip').hide();

                }

            }

        }

        //查看是否都是非空
        for(var i=0;i<inputs.length;i++){

            var o = inputs.eq(i).next('.error-tip').css('display');

            if( o != 'none'){

                isAccord = false

                break;

            }else{

                isAccord = true;

            }

        }

        if(isAccord){

            //暂存当前的值
            var valueArr = [];

            for(var i = 0;i<inputValue.length;i++){

                valueArr.push(inputValue.eq(i).val());

            }

            var tds = $(this).parent().parent('tr').find('.inputValue');

            for(var i=0;i<tds.length;i++){

                var str = '<span class="input-value">' + valueArr[i] +'</span>';

                tds.eq(i).empty().append(str);

            }

            var switchButton = $(this).parent().parent('tr').find('.switchButton');

            switchButton.bootstrapSwitch('disabled',true);

            //select也不可操作
            var select = $(this).parent().parent('tr').find('.table-setmeal');

            select.attr('disabled',true);

            $(this).html('编辑').removeClass('option-save-1').addClass('option-edit-1');

        }

    })

    //【编辑】大用户
    $('#table tbody').on('click','.option-edit-1',function(){

        var tds = $(this).parent().parent('tr').find('.input-value').parent('td');

        var valueArr = [];

        //插入input中
        for(var i=0;i<tds.length;i++){

            valueArr.push(tds.eq(i).children('.input-value').html());

            if(i == tds.length-1){

                var str = '<input class="input-value table-group-action-input form-control" value="' + tds.eq(i).children('.input-value').html() +'"><span class="error-tip" style="display: none;">';

            }else if( i == 1 ){

                var str = '<input class="input-required input-chinese input-value table-group-action-input form-control" value="' + tds.eq(i).children('.input-value').html() +'"><span class="error-tip" style="display: none;">';

            }else{

                var str = '<input class="input-required input-value table-group-action-input form-control" value="' + tds.eq(i).children('.input-value').html() +'"><span class="error-tip" style="display: none;">';

            }

            $(tds).eq(i).empty().append(str);

        }

        $(this).html('保存').removeClass('option-edit-1').addClass('option-save-1');

        var switchButton = $(this).parent().parent('tr').find('.switchButton');

        switchButton.bootstrapSwitch('disabled',false);

        //select也不可操作
        var select = $(this).parent().parent('tr').find('.table-setmeal');

        select.attr('disabled',false);

    })

    //【回应验证】大用户
    $('#table tbody').on('click','.input-required',function(){



    })

    //【选择户号】大用户
    $('#table').on('click','.select-dev',function(){

        _thisRowButton = $(this);

        //首先判断当前是编辑状态还是保存状态

        var state = $(this).parent().parent('tr').find('.option-edit-1').length

        //state == 1表示当前是不可操作状态,==0表示可操作
        if(state == 0){

            //初始化

            //模态框
            _moTaiKuang($('#select-SB-Modal'),'账户','','','','选择');

            //获取数据
            DHHData()

        }else{

            return false;

        }

    })

    //【删除】大用户
    $('#table tbody').on('click','.option-del-1',function(){

        //获取表格对象
        var T = $(this).parents('td').find('.innerTable').DataTable();

        T.row($(this).parents('tr')).remove().draw( false );

    })

    //户号选择【tr】大用户
    $('#SB-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#SB-table tbody').find('tr').removeClass('tables-hover');

            $('#SB-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#SB-table tbody').find('tr').removeClass('tables-hover');

            $('#SB-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //确定选中的户号id聚合商
    $('#select-SB-Modal').on('click','.btn-primary',function(){

        var selectedTr = $('#SB-table tbody').find('.tables-hover');

        if(selectedTr.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择户号','');

        }else{

            $('#theLoading').modal('show');

            //给id赋值
            _thisHH = selectedTr.find('.checker').attr('data-id');

            _thisHHM = selectedTr.children().eq(2).html();

            $('#theLoading').modal('hide');

            _thisRowButton.parent().next().children('input').val(_thisHH);

            _thisRowButton.parent().next().next().children('input').val(_thisHHM);

            //隐藏验证消息
            _thisRowButton.parent().next().children('.error-tip').html('').hide();

            _thisRowButton.parent().next().next().children('.error-tip').html('').hide();

            //将签署容量写入【选择户号上】
            var capacity = selectedTr.find('.checker').attr('data-capacity');

            _thisRowButton.attr('data-capacity',capacity);

            //模态框
            $('#select-SB-Modal').modal('hide');


        }



    })

    /*-------------------------------------其他方法-----------------------------------------*/

    //显示详情(可操作的详情)聚合商的时候
    function formatDetailJ(d){

        var theader = '<table class="table  table-advance table-hover subTable">';

        var theaders = '</table>';

        var tbodyer = '<tbody>'

        var tbodyers = '</tbody>';

        var str = '';

        //计划名称、区域、开始时间、结束时间、计划消减负荷量
        str += '<tr>' + '<td class="subTableTitle" ">计划名称</td>' + '<td>'+ d.planName +'</td>' + '<td class="subTableTitle">区域</td>' + '<td>' + d.districtName + '</td>' + '<td class="subTableTitle">开始时间</td>' + '<td>' + d.startDate + '</td>'  + '<td class="subTableTitle">结束时间</td>' + '<td>' + d.closeDate + '</td>' + '<td class="subTableTitle" ">消减负荷（kW）</td>'+ '<td>' + d.reduceLoad + '</td>' + '</tr>';

        //基线、发布时间、反馈截止时间、

        str += '<tr>' + '<td class="subTableTitle">基线</td>' + '<td>'+ d.baselineName +'</td>' + '<td class="subTableTitle">发布时间</td>' + '<td>'+ d.publishDate +'</td>' + '<td class="subTableTitle" style="font-weight: bold">反馈截止时间</td>' + '<td style="font-weight: bold" class="endTime">'+ d.abortDate +'</td>' + '<td class="subTableTitle"></td>' + '<td>' + '</td>' +'<td class="subTableTitle"></td>' + '<td>' + '</td>'  + '</tr>'

        if(d.librarys){

            for(var i=0;i< d.librarys.length;i++){

                var lengths = d.librarys.length;

                var tc = d.librarys[i];

                if(lengths == 1){

                    //产品名称、产品类型、补贴方式、补贴价格、提前通知时间、产品描述
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>'  + '</tr>';

                }else{

                    //产品名称、产品类型、补贴方式、补贴价格、提前通知时间、产品描述
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称' + (i+1) + '</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>' + '</tr>';

                }


            }

        }

        //备注
        str += '<tr><td class="subTableTitle">描述</td><td colspan="9" style="text-align: left;text-indent: 25px;">' + d.memo + '</td></tr>'

        //账户响应的table

        //button【增加一行】
        var button = '<div style="text-align: left !important;">' + '<button class="btn green add-button" style="margin:5px 0 0 5px;">' + '增加行 <i class="fa fa-plus"></i>' + '</button>' + '</div>';

        //首先判断是大用户还是聚合商
        var answerTable = '<table class="table innerTable  table-advance table-hover"><thead></thead><tbody></tbody></table>';

        //button【保存】
        var answerButton = '<div style="text-align: left !important;">' + '<button class="btn green answer-button" style="margin: 0 0 5px 5px;">' + '确定回应' + '</button>' + '</div>';

        //最外边的框
        var block = '<div style="border: 1px solid #68a1fd;">';

        var blocks = '</div>';

        return block + theader + tbodyer + str + tbodyers + theaders + blocks + '<div style="margin-top: 20px;"></div>' + block + button + answerTable + answerButton + blocks;

    }

    function formatDetailD(d){

        var theader = '<table class="table  table-advance table-hover subTable">';

        var theaders = '</table>';

        var tbodyer = '<tbody>'

        var tbodyers = '</tbody>';

        var str = '';

        //计划名称、区域、开始时间、结束时间、计划消减负荷量
        str += '<tr>' + '<td class="subTableTitle" ">计划名称</td>' + '<td>'+ d.planName +'</td>' + '<td class="subTableTitle">区域</td>' + '<td>' + d.districtName + '</td>' + '<td class="subTableTitle">开始时间</td>' + '<td>' + d.startDate + '</td>'  + '<td class="subTableTitle">结束时间</td>' + '<td>' + d.closeDate + '</td>' + '<td class="subTableTitle" ">消减负荷（kW）</td>'+ '<td>' + d.reduceLoad + '</td>' + '</tr>';

        //基线、发布时间、反馈截止时间、

        str += '<tr>' + '<td class="subTableTitle">基线</td>' + '<td>'+ d.baselineName +'</td>' + '<td class="subTableTitle">发布时间</td>' + '<td>'+ d.publishDate +'</td>' + '<td class="subTableTitle" style="font-weight: bold">反馈截止时间</td>' + '<td style="font-weight: bold" class="endTime">'+ d.abortDate +'</td>' + '<td class="subTableTitle"></td>' + '<td>' + '</td>' +'<td class="subTableTitle"></td>' + '<td>' + '</td>'  + '</tr>'

        if(d.librarys){

            for(var i=0;i< d.librarys.length;i++){

                var lengths = d.librarys.length;

                var tc = d.librarys[i];

                if(lengths == 1){

                    //产品名称、产品类型、补贴方式、补贴价格、提前通知时间、产品描述
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>'  + '</tr>';

                }else{

                    //产品名称、产品类型、补贴方式、补贴价格、提前通知时间、产品描述
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称' + (i+1) + '</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>' + '</tr>';

                }


            }

        }

        //备注
        str += '<tr><td class="subTableTitle">描述</td><td colspan="9" style="text-align: left;text-indent: 25px;">' + d.memo + '</td></tr>'

        //账户响应的table

        //button【增加一行】
        var button = '<div style="text-align: left !important;">' + '<button class="btn green add-button" style="margin:5px 0 0 5px;">' + '增加行 <i class="fa fa-plus"></i>' + '</button>' + '</div>';

        //首先判断是大用户还是聚合商
        var answerTable = '<table class="table innerTable  table-advance table-hover"><thead></thead><tbody></tbody></table>';

        //button【保存】
        var answerButton = '<div style="text-align: left !important;">' + '<button class="btn green answer-button" style="margin: 0 0 5px 5px;">' + '确定回应' + '</button>' + '</div>';

        //最外边的框
        var block = '<div style="border: 1px solid #68a1fd;">';

        var blocks = '</div>';

        return block + theader + tbodyer + str + tbodyers + theaders + blocks + '<div style="margin-top: 20px;"></div>' + block + answerTable + answerButton + blocks;

    }

    //大用户的时候

    //显示详情（不可操作的详情）
    function getFormatDetail(d){

        var theader = '<table class="table  table-advance table-hover subTable">';

        var theaders = '</table>';

        var tbodyer = '<tbody>'

        var tbodyers = '</tbody>';

        var str = '';

        //计划名称、区域、开始时间、结束时间、计划消减负荷量
        str += '<tr>' + '<td class="subTableTitle" ">计划名称</td>' + '<td>'+ d.planName +'</td>' + '<td class="subTableTitle">区域</td>' + '<td>' + d.districtName + '</td>' + '<td class="subTableTitle">开始时间</td>' + '<td>' + d.startDate + '</td>'  + '<td class="subTableTitle">结束时间</td>' + '<td>' + d.closeDate + '</td>' + '<td class="subTableTitle" ">消减负荷（kW）</td>'+ '<td>' + d.reduceLoad + '</td>' + '</tr>';

        //基线、发布时间、反馈截止时间、

        str += '<tr>' + '<td class="subTableTitle">基线</td>' + '<td>'+ d.baselineName +'</td>' + '<td class="subTableTitle">发布时间</td>' + '<td>'+ d.publishDate +'</td>' + '<td class="subTableTitle" style="font-weight: bold">反馈截止时间</td>' + '<td style="font-weight: bold" class="endTime">'+ d.abortDate +'</td>' + '<td class="subTableTitle"></td>' + '<td>' + '</td>' +'<td class="subTableTitle"></td>' + '<td>' + '</td>'  + '</tr>'

        if(d.librarys){

            for(var i=0;i< d.librarys.length;i++){

                var lengths = d.librarys.length;

                var tc = d.librarys[i];

                if(lengths == 1){

                    //产品名称、产品类型、补贴方式、补贴价格、提前通知时间、产品描述
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>'  + '</tr>';

                }else{

                    //产品名称、产品类型、补贴方式、补贴价格、提前通知时间、产品描述
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称' + (i+1) + '</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>' + '</tr>';

                }


            }

        }

        //备注
        str += '<tr><td class="subTableTitle">描述</td><td colspan="9">' + d.memo + '</td></tr>'

        //获取详情的接口
        var table = '<table class="table getInnerTable  table-advance table-hover" style="margin: 0;"><thead></thead><tbody></tbody></table>'

        //最外边的框
        var block = '<div style="border: 1px solid #68a1fd;">';

        var blocks = '</div>';

        return block + theader + tbodyer + str + tbodyers + theaders + blocks + '<div style="margin-top: 8px;"></div>' + block + table + blocks;

    }

    //套餐类型对应
    function libType(num){

        if(num == 1){

            return '价格型';

        }else if(num == 2){

            return '鼓励型';

        }

    }

    //补贴方式对应
    function priceMode(data){

        if(data == 1){

            return '电费抵扣'

        }else if(data == 2){

            return '现金支付'

        }else if(data == 3){

            return '预付补贴'

        }

    }

    //获取用户
    //获取户号数据
    function HHData(){

        $('#theLoading').modal('show');

        //首先获取当前选中的tr的
        var trs = _thisRowButton.parent().parent('tr').parent('tbody').children();
        //存放已选中的id
        var arr = [];

        for(var i=0;i<trs.length;i++){

            if(trs.eq(i).children().eq(1).children('input').length ==1){

                var hh = trs.eq(i).children().eq(1).children().val();

            }else{

                var hh = trs.eq(i).children().eq(1).children().html();

            }

            if(hh != ''){

                arr.push(hh);

            }

        }

        var prm = {

            //登录用户id
            userId :sessionStorage.ADRS_UserId,
            //已选择的户号id
            selectactIds:arr

        }

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'DRUserAnswer/GetAcctsByAggr',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

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

                }

                _datasTable($('#HH-table'),arr);

            },

            error:_errorFun1

        })

    }

    //获取户号数据（大用户）
    function DHHData(){

        $('#theLoading').modal('show');

        //首先获取当前选中的tr的
        var trs = _thisRowButton.parent().parent('tr').parent('tbody').children();
        //存放已选中的id
        var arr = [];

        for(var i=0;i<trs.length;i++){

            if(trs.eq(i).children().eq(1).children('input').length ==1){

                var hh = trs.eq(i).children().eq(1).children().val();

            }else{

                var hh = trs.eq(i).children().eq(1).children().html();

            }

            if(hh != ''){

                arr.push(hh);

            }

        }

        var prm = {

            //登录用户id
            userId :sessionStorage.ADRS_UserId,
            //已选择的户号id
            selectactIds:arr

        }

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'DRUserAnswer/GetAcctsByKA',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

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

                }

                _datasTable($('#SB-table'),arr);

            },

            error:_errorFun1

        })

    }

    //获取待投标事件列表
    function tenderData(url,index){

        $('#theLoading').modal('show');

        var role = sessionStorage.ADRS_UserRole;

        var prm = {

            //用户角色
            userRole:role

        }

        //判断是大用户还是聚合商
        if(role == 3){

            //聚合商
            prm.userId = sessionStorage.ADRS_UserId;


        }else if(role == 4){

            //大用户
            prm.acctId = sessionStorage.currentAcct

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + url,

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#tip').hide();

                _allData.length = 0;

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

                var arr = [];

                if(result.code == -2){

                    topTipBar('暂时没有事件');


                }else if(result.code == -1){

                    topTipBar('异常错误');

                }else if(result.code == -3){

                    topTipBar('参数错误');

                }else if(result.code == -4){

                    topTipBar('内容已存在');

                }else if(result.code == -6){

                    topTipBar('抱歉，您没有操作权限');

                }else if(result.code == 0){

                    arr = result[_attrArr[index]];

                    for(var i=0;i<arr.length;i++ ){

                        _allData.push(arr[i])

                    }

                }

                _jumpNow($('#table'),arr);

            },

            error:function (XMLHttpRequest, textStatus, errorThrown){

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    topTipBar('请求超时!')

                }else{

                    topTipBar('请求失败!')

                }

            }

        })



    }

    //获取详情
    function getDetail(url,index,table){

        $('#theLoading').modal('show');

        var prm = {

            //用户角色
            userRole:sessionStorage.ADRS_UserRole,
            //事件Id
            planId:_thisPlanId,

            acctIds:_acctIdsArr

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + url,

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

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }else if(result.code == 0){

                    arr = result[_detailAttrArr[index]];

                }

                _jumpNow(table,arr);

            },

            error:_errorFun

        })


    }

    //顶置提示
    function topTipBar(str){

        $('#tip').find('span').remove();

        $('#tip').find('i').after('<span style="margin-left: 20px;">' + str + '</span>');

        $('#tip').show();

    }

    //不同状态值对应不同颜色的小圆圈
    function stateFlag(state,data){

        if(state == 1){

            //已创建
            return '<span class="state-ball state-created"></span>' + data

        }else if(state == 2){

            //已发布
            return '<span class="state-ball state-publish"></span>' + data

        }else if(state == 3){

            //确定用户
            return '<span class="state-ball state-ensure-user"></span>' + data

        }else if(state == 4){

            //已审核
            return '<span class="state-ball state-examine"></span>' + data

        }else if(state == 5){

            //下发指令
            return '<span class="state-ball state-instruction"></span>' + data

        }else if(state == 6){

            //执行中
            return '<span class="state-ball state-execution"></span>' + data

        }else if(state == 7){

            //执行完毕
            return '<span class="state-ball state-end-execution"></span>' + data

        }

    }

    return {
        init: function(){

        }
    }

}()