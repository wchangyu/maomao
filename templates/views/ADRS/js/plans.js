var PlanPublish = function () {

    //存放当前所有值
    var _allData = [];

    //操作当前事件的id
    var _thisPlanId = '';

    //基线
    baselineData();

    //区域
    districtData();

    //事件名称列表
    planData();

    /*-----------------------------------表格初始化-------------------------------------*/

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
            title:'是否达标',
            data:'isStandard',
            render:function(data, type, full, meta){

                if( data == ''){

                    return ''

                }if(data == 0){

                    return '<span class="state-ball" style="background: red;"></span>' + '未达标'

                }else if(data == 1){

                    return '<span class="state-ball" style="background: green;"></span>' + '达标'

                }else{

                    return ''

                }

            }
        },
        {
            title:'总补贴',
            data:'totalSubsidy'
        },
        {
            title:'实际消减负荷（kW）',
            data:'actualReduceLoad'
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

                return '<span data-id="' + full.planId + '" style="color:#2170f4;text-decoration: underline ">详情</span>'

            }
        }

    ]

    _tableInit($('#table'),col,2,true,'','','','');

    conditionSelect(true);

    //核算表格
    var accountCol = [

        {
            title:'户号',
            data:'accountName'
        },
        {
            title:'实际消减负荷（kW）',
            data:'actualReduceLoad'
        },
        {
            title:'参与时长（h）',
            data:'partakeHourlength'
        },
        {
            title:'是否达标',
            data:'isStandard',
            render:function(data, type, full, meta){

                if( data == ''){

                    return ''

                }if(data == 0){

                    return '<span class="state-ball" style="background: red;"></span>' + '未达标'

                }else if(data == 1){

                    return '<span class="state-ball" style="background: green;"></span>' + '达标'

                }else{

                    return ''

                }

            }
        },
        {
            title:'总补贴',
            data:'totalSubsidy'
        }

    ]

    /*-----------------------------------按钮事件-----------------------------------------*/

    //点击【详情】
    $('#table tbody').on('click', '.detail-button', function () {

        //存放当前企业所绑定户号的数组
        var thisOBJ = {};

        var thisEprId = $(this).children().attr('data-id');

        _thisPlanId = thisEprId;

        _thisLoad = $(this).parent('tr').children('td').eq(4).html()

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].planId == thisEprId){

                thisOBJ = _allData[i];

            }

        }

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;

        var table = $('#table').DataTable();

        var row = table.row( tr );

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            //判断当前状态
            var state = $(this).parent().children().eq(0).text();

            if(state == '执行完毕'){

                row.child( formatDetail(thisOBJ) ).show();

                //初始化表格
                var innerTable = $(this).parent().next().find('.innerTable');

                //表格初始化
                _tableInit(innerTable,accountCol,2,true,'','',true,'',10);

                var id = $(this).children().attr('data-id');

                planResult(id,innerTable);

            }else{

                row.child( formatDetailOther(thisOBJ) ).show();

            }

            tr.addClass('shown');
        }
    } );

    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    /*-----------------------------------其他方法-----------------------------------------*/

    //获取列表
    function conditionSelect(first){

        $('#theLoading').modal('show');

        if(first){

            var  prm = {

                //事件
                planId:0,
                //区域
                districtId:0,
                //基线
                baselineId:0,
                //状态
                state:0,
                //角色
                loginSysuserRole:sessionStorage.ADRS_UserRole

            }

        }else{

            var  prm = {

                //事件
                planId:$('#plan-name-con').val(),
                //区域
                districtId:$('#plan-district').val(),
                //基线
                baselineId:$('#plan-baseline').val(),
                //状态
                state:$('#plan-state').val(),
                //角色
                loginSysuserRole:sessionStorage.ADRS_UserRole

            }

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetDRPlanDs',

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

                    _topTipBar('暂时没有事件数据');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('参数错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == 0){

                    arr = result.plans;

                    for(var i=0;i<result.plans.length;i++){

                        _allData.push(result.plans[i]);

                    }


                }

                _jumpNow($('#table'),arr);

            },

            error:_errorFun

        })


    }

    //显示详情
    function formatDetail(d){

        var theader = '<table class="table  table-advance table-hover subTable">';

        var theaders = '</table>';

        var tbodyer = '<tbody>'

        var tbodyers = '</tbody>';

        var str = '';

        //计划名称、区域、开始时间、结束时间、计划消减负荷量
        str += '<tr>' + '<td class="subTableTitle" ">计划名称</td>' + '<td>'+ d.planName +'</td>' + '<td class="subTableTitle">区域</td>' + '<td>' + d.districtName + '</td>' + '<td class="subTableTitle">开始时间</td>' + '<td>' + d.startDate + '</td>'  + '<td class="subTableTitle">结束时间</td>' + '<td>' + d.closeDate + '</td>' + '<td class="subTableTitle" ">消减负荷（kW）</td>'+ '<td>' + d.reduceLoad + '</td>' + '</tr>';

        //基线、发布时间、反馈截止时间、

        str += '<tr>' + '<td class="subTableTitle">基线</td>' + '<td>'+ d.baselineName +'</td>' + '<td class="subTableTitle">发布时间</td>' + '<td>'+ d.publishDate +'</td>' + '<td class="subTableTitle">反馈截止时间</td>' + '<td class="endTime">'+ d.abortDate +'</td>' + '<td class="subTableTitle"></td>' + '<td>' + '</td>' +'<td class="subTableTitle"></td>' + '<td>' + '</td>'  + '</tr>'

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

        //button【保存】
        var answerButton = '<div style="text-align: left !important;">' + '<button class="btn green answer-button" style="margin: 5px 0 5px 5px;">' + '执行完毕' + '</button>' + '</div>';

        //最外边的框
        var block = '<div class="HH-block" style="border: 1px solid #68a1fd;">';

        var blocks = '</div>';

        var table = '<table class="table table-striped  table-advance table-hover innerTable" style="margin: 0!important;"></table>'

        return block + theader + tbodyer + str + tbodyers + theaders + blocks + '<div style="margin-top: 8px;"></div>' + block + '<span style="display: block;line-height: 30px;text-align: left !important;text-indent: 10px;">事件参与户号执行详情:</span>' +  table + blocks ;

    }

    function formatDetailOther(d){

        var theader = '<table class="table  table-advance table-hover subTable">';

        var theaders = '</table>';

        var tbodyer = '<tbody>'

        var tbodyers = '</tbody>';

        var str = '';

        //计划名称、区域、开始时间、结束时间、计划消减负荷量
        str += '<tr>' + '<td class="subTableTitle" ">计划名称</td>' + '<td>'+ d.planName +'</td>' + '<td class="subTableTitle">区域</td>' + '<td>' + d.districtName + '</td>' + '<td class="subTableTitle">开始时间</td>' + '<td>' + d.startDate + '</td>'  + '<td class="subTableTitle">结束时间</td>' + '<td>' + d.closeDate + '</td>' + '<td class="subTableTitle" ">消减负荷（kW）</td>'+ '<td>' + d.reduceLoad + '</td>' + '</tr>';

        //基线、发布时间、反馈截止时间、

        str += '<tr>' + '<td class="subTableTitle">基线</td>' + '<td>'+ d.baselineName +'</td>' + '<td class="subTableTitle">发布时间</td>' + '<td>'+ d.publishDate +'</td>' + '<td class="subTableTitle">反馈截止时间</td>' + '<td class="endTime">'+ d.abortDate +'</td>' + '<td class="subTableTitle"></td>' + '<td>' + '</td>' +'<td class="subTableTitle"></td>' + '<td>' + '</td>'  + '</tr>'

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

        //最外边的框
        var block = '<div class="HH-block" style="border: 1px solid #68a1fd;">';

        var blocks = '</div>';

        return block + theader + tbodyer + str + tbodyers + theaders + blocks ;

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

    //获取基线
    function baselineData(){

        var prm = {

            isAll:true

        };

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetTakeInDRPlanBaselineDs',

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

                    console.log('获取基线：暂无数据');

                }else if(result.code == -1){

                    console.log('获取基线：异常错误');

                }else if(result.code == -3){

                    console.log('获取基线：参数错误');

                }else if(result.code == -4){

                    console.log('获取基线：内容已存在');

                }else if(result.code == 0){

                    arr = result.baselineIdns;


                }

                var str = '';

                for(var i=0;i<arr.length;i++){

                    str += '<option value="' + arr[i].id + '">' + arr[i].name + '</option>'

                }

                $('#plan-baseline').empty().append(str);

            },

            error:_errorFun1

        })

    }

    //获取区域
    function districtData(){

        var prm = {

            isAll:true

        };

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetTakeInDRPlanDistrictDs',

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

                    console.log('获取区域：暂无数据');

                }else if(result.code == -1){

                    console.log('获取区域：异常错误');

                }else if(result.code == -3){

                    console.log('获取区域：参数错误');

                }else if(result.code == -4){

                    console.log('获取区域：内容已存在');

                }else if(result.code == 0){

                    arr = result.districtIdns;


                }

                var str = '';

                for(var i=0;i<arr.length;i++){

                    str += '<option value="' + arr[i].id + '">' + arr[i].name + '</option>'

                }

                $('#plan-district').empty().append(str);

            },

            error:_errorFun1

        })

    }

    //获取事件
    function planData(){

        var prm = {

            isAll:true

        };

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetDRPlanIdns',

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

                    console.log('获取事件名称：暂无数据');

                }else if(result.code == -1){

                    console.log('获取事件名称：异常错误');

                }else if(result.code == -3){

                    console.log('获取事件名称：参数错误');

                }else if(result.code == -4){

                    console.log('获取事件名称：内容已存在');

                }else if(result.code == 0){

                    arr = result.planIdns;


                }

                var str = '';

                for(var i=0;i<arr.length;i++){

                    str += '<option value="' + arr[i].planId + '">' + arr[i].planNt + '</option>'

                }

                $('#plan-name-con').empty().append(str);

            },

            error:_errorFun1

        })

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

    //获取事件执行结果
    function planResult(id,table){

        $('#theLoading').modal('show');

        var  prm = {

            //事件
            planId:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRExecFinish/GetDRPlanResultDsByPlanId',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

                var arr = [];

                $('#tip').hide();

                if(result.code == -2){

                    //_moTaiKuang($('#tip-Modal'),'提示',true,true,'暂时没有获取到执行结果','');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'异常错误','');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'参数错误','');


                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'内容已存在','');


                }else if(result.code == -6){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'抱歉，您没有获取执行结果的权限','');

                }else if(result.code == 0){

                    arr = result.planResultDs;

                }

                _jumpNow(table,arr);

            },

            error:_errorFun

        })

    }

    return {
        init: function () {

        }
    }

}();