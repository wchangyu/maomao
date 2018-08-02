var PlanExec = function () {

    //存放当前所有值
    var _allData = [];

    //操作当前事件的id
    var _thisPlanId = '';

    //当前计划的开始事件
    var _st = '';

    //当前计划的结束事件
    var _et = '';

    //标记基线负荷是否返回数据成功
    var _baselineIsComplete = false;

    //标记实时负荷是否返回数据成功
    var _realtimeIsComolete = false;


    //存放基线返回的值
    var baseObj = {};

    //存放实时返回的值
    var realObj = {};

    //当前事件的状态名称
    var _currentStateName = '';

    //获取当前操作的状态名称的dom
    var _currentStateDom = '';

    //判断发送两次条件查询是否全都返回了
    var _state5 = false;

    var _state6 = false;

    var chartAry = [];

    //当前基线数据
    var _currentBaselineObj = [];

    //当前实时数据
    var _currentRealObj = [];

    /*--------------------------------------表格初始化-------------------------------------*/

    var col = [

        {
            title:'状态',
            data:'',
            render:function(data, type, full, meta){

                //判断当前时间和事件开始执行时间，如果当前时间小于事件开始执行时间，则状态列显示等待执行中，如果当前时间>=事件开始执行，显示执行中。
                var now = moment().format('YYYY-MM-DD HH:mm:ss');

                var st = full.startDate;

                if(_timeCompare(now,st)){

                    //当前时间小于开始执行时间

                    return '<span class="state-ball state-execution"></span>' + '等待执行中'

                }else{

                    //当前时间大于开始执行时间

                    return  '<span class="state-ball state-execution"></span>' + '执行中'

                }


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
            title:'登记时间',
            data:'createDate'
        },
        {
            title:'创建人',
            data:'createPlanUserName'
        },
        {
            title:'其他',
            "targets": -1,
            "data": null,
            "className":'detail-button',
            render:function(data, type, full, meta){

                return '<span class="option-particulars" data-id="' + full.planId + '" style="color:#2170f4;text-decoration: underline ">详情</span>'

            }
        },
        {
            title:'操作',
            data:'',
            className:'detail-button',
            render:function(data, type, full, meta){

                //判断当前时间和结束时间，如果当前时间>结束时间，那么就要显示，否则不显示

                //var nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
                //
                //var endTime = moment(full.closeDate).format('YYYY-MM-DD HH:mm:ss');

                return '<span class="option-button option-implement" data-id="' + full.planId + '" style="border-color: #14e399 !important;color: #14e399 !important">监控</span>'

                //if(timeCompare(endTime,nowTime)){
                //
                //    return '<span class="option-button option-implement" data-id="' + full.planId + '" style="border-color: #14e399 !important;color: #14e399 !important">监控</span>'
                //
                //        //'<span class="option-button option-accounting" data-id="' + full.planId + '" style="border-color: #0aa3c3 !important;color: #0aa3c3 !important">核算</span>'
                //
                //}else{
                //
                //    return '<span class="option-button option-implement" data-id="' + full.planId + '" style="border-color: #14e399 !important;color: #14e399 !important">监控</span>'
                //
                //}

            }
        }

    ]

    var _table  = $('#table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": true,
        "sorting":[0,'desc'],
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
        "aoColumnDefs": [ { "orderable": false, "targets": [ 1,2,3,4,5,6,7,8,9,10,11] }]
    });

    conditionSelect();

    //核算表格
    var accountCol = [

        {
            title:'户号',
            data:''
        },
        {
            title:'实际消减负荷（kW）',
            data:''
        },
        {
            title:'参与时长（h）',
            data:''
        },
        {
            title:'是否达标',
            data:''
        },
        {
            title:'总补贴',
            data:''
        }

    ]

    /*---------------------------------------echart---------------------------------------*/

    //折线
    var optionTop = {
        legend: {
            data:['实时负荷','基线负荷','消减负荷']
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} kW'
            }
        },
        series: [
            {
                name:'实时负荷',
                type:'line',
                data:[11, 11, 15, 13, 12, 13, 10]
            },
            {
                name:'基线负荷',
                type:'line',
                data:[]
            },
            {
                name:'消减负荷',
                type:'line',
                data:[]
            }
        ]
    };

    /*-------------------------------------按钮事件-----------------------------------------*/

    //点击【详情】
    $('#table tbody').on('click', '.option-particulars', function () {

        //存放当前企业所绑定户号的数组
        var thisOBJ = {};

        var thisEprId = $(this).attr('data-id');

        _thisPlanId = thisEprId;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].planId == thisEprId){

                thisOBJ = _allData[i];

            }

        }

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;

        var row = _table.row( tr );

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            row.child( formatDetail(thisOBJ) ).show();

            tr.addClass('shown');
        }
    } );

    var _indexNum = 0;

    //点击【监控】
    $('#table tbody').on('click','.option-implement',function(){

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;

        var row = _table.row( tr );

        var planId = $(this).attr('data-id');

        //id
        _thisPlanId = planId;

        //开始时间
        _st = $(this).parent().parent().children().eq(2).html();

        //结束时间
        _et = $(this).parent().parent().children().eq(3).html();

        //当前事件状态
        _currentStateName = $(this).parent().parent().children().eq(0).text();

        //当前事件的currentdom
        _currentStateDom = $(this).parent().parent().children().eq(0);

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            //判断状态
            executeState();

            $('#theLoading').modal('show');

            row.child( formatImplement(_indexNum) ).show();

            setInterval(function(){

                var now = moment().format('YYYY-MM-DD HH:mm:ss');

                $('#realTime').html(now);

            },1000);

            //获取折线图
            var format = $(this).parents('tr').next();

            //折现
            var lineBlock = format.find('.line-block').attr('id');

            var echart1 = echarts.init(document.getElementById(lineBlock));

            //当前核算按钮
            var button = $(this).parent('td').parent().next().find('.answer-button');

            //当前选中的行
            thisDataBlock = $(this).parent().parent().next().find('.formatLeft');

            //获取实时数据（十分钟刷新一次）

            //执行中的话，实时数据和基线、参与户数都要调，等待资源的情况下。只调基线和户数

            if(_currentStateDom.text() == '执行中'){

                realtimeLoad(echart1);

                setInterval(function(){

                    realtimeLoad(echart1);

                },1000*10)

                //获取基线数据
                baselineLoad(echart1);

                //参与户数
                joinInHH();

            }else{

                //调基线接口
                var prm = {

                    //事件Id
                    planId:_thisPlanId,
                    //事件开始时间
                    startDate:_st,
                    //事件结束时间
                    closeDate:_et
                }

                $.ajax({

                    type:'post',

                    url:sessionStorage.apiUrlPrefix + 'DRPlanExec/GetHistoryJXFHsByPlanId',

                    data:prm,

                    timeout:_theTimes,

                    success:function(result){

                        $('#theLoading').modal('hide');

                        if(result.code == 0){

                            //基线负荷赋值
                            thisDataBlock.find('.baselineNum').html(result.jxFhVa);

                            //基线负荷的值
                            optionTop.xAxis.data = result.jxFhXs;

                            optionTop.series[1].data = result.jxFhYs;

                            optionTop.series[0].data = [];

                            optionTop.series[2].data = [];

                            echart1.setOption(optionTop,true);

                        }else{

                            //基线负荷赋值
                            thisDataBlock.find('.baselineNum').html(result.jxFhXs);

                            //基线负荷的值
                            optionTop.xAxis.data = [];

                            optionTop.series[1].data = [];

                            optionTop.series[0].data = [];

                            optionTop.series[2].data = [];

                            echart1.setOption(optionTop,true);

                        }

                    },

                    error:_errorFun

                })

                //调户数接口
                var prm1 = {

                    //事件Id
                    planId:_thisPlanId

                }

                $.ajax({

                    type:'post',

                    url:sessionStorage.apiUrlPrefix + 'DRPlanExec/GetAcctsNberAndXJFhVaByPlanId',

                    data:prm1,

                    timeout:_theTimes,

                    success:function(result){

                        if(result.code == 0){

                            //参与户数
                            thisDataBlock.find('.totalHH').html(result.acctsNber);

                            //计划消减
                            thisDataBlock.find('.planNum').html(result.xjFhVa);

                        }

                    },

                    error:_errorFun

                })

            }

            tr.addClass('shown');

            //核算
            var nowTime = moment().format('YYYY-MM-DD HH:mm:ss');

            //如果当前时间>结束时间,核算按钮显示
            if(timeCompare(_et,nowTime)){

                console.log(222);

                button.show();

            }
            _indexNum ++;
        }

    })

    //点击【核算】
    $('#table tbody').on('click','.option-accounting',function(){

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;

        var row = _table.row( tr );

        var planId = $(this).attr('data-id');

        //id
        _thisPlanId = planId;

        //开始时间
        _st = $(this).parent().parent().children().eq(2).html();

        //结束时间
        _et = $(this).parent().parent().children().eq(3).html();

        //当前事件状态
        _currentStateName = $(this).parent().parent().children().eq(0).text();

        //当前事件的currentdom
        _currentStateDom = $(this).parent().parent().children().eq(0);

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }else{

            row.child( accountFormat() ).show();

            var table = $(this).parent().parent().next().find('.innerTable');

            //初始化表格
            _tableInit(table,accountCol,2,true,'','','','',10);

            //左边列表
            var list = $(this).parent().parent().next().find('.formatLeft');


            tr.addClass('shown');

        }


    })

    //【去核算】
    $('#table tbody').on('click','.answer-button',function(){

        //核算
        accountData();

    })

    window.onresize = function(){

        for (var i = 0;i<chartAry.length;i++){

            if(chartAry[i]){

                chartAry[i].resize();

            }
        }

    }

    /*-------------------------------------其他方法-----------------------------------------*/

    //获取所有产品
    function conditionSelect(){

        _allData.length = 0;

        $('#theLoading').modal('show');

        //调状态为5
        stateSelect(5)

        //调状态为6
        stateSelect(6)
    }

    function stateSelect(state){

        var  prm = {

            //事件
            planId:0,
            //区域
            districtId:0,
            //基线
            baselineId:0,
            //状态
            state:state

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetDRPlanDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(state == 5){

                    _state5 = true;

                }else if(state == 6){

                    _state6 = true;

                }

                if(result.code == 0){

                    for(var i=0;i<result.plans.length;i++){

                        _allData.push(result.plans[i]);

                    }

                }

                if(_state5 && _state6){

                    _jumpNow($('#table'),_allData.sort(function(a,b){

                        return b-a

                    }));

                    if(_allData.length == 0){

                        _topTipBar('暂时没有需要执行的事件');

                    }
                }

            },

            error:_errorBar

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
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>' + '</tr>';

                }else{

                    //产品名称、产品类型、补贴方式、补贴价格、提前通知时间、产品描述
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称' + (i+1) + '</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>'  + '</tr>';

                }


            }

        }

        //备注
        str += '<tr><td class="subTableTitle">描述</td><td colspan="9" style="text-align: left;text-indent: 25px;">' + d.memo + '</td></tr>'

        var chooseButton = '<div style="text-align: left !important;margin-bottom: 5px;"><span id="HSErro"></span><br><button class="btn green answer-button">下发指令</button></div>';

        var block = '<div style="border: 1px solid #68a1fd;">';

        var blocks = '</div>';

        return block + theader + tbodyer + str + tbodyers + theaders + blocks;

    }

    //执行情况
    function formatImplement(num){

        var block = '<div style="background: #f9f9f9 !important;">'

        var left = '<div class="formatLeft shadowEffect">' +
            '    <ul>' +
            '        <li>参与总户数：<span class="totalHH">-</span></li>' +
            '        <li>基线负荷（kW）：<span class="baselineNum">-</span></li>' +
            '        <li>实时负荷（kW）：<span class="realTimeNum">-</span></li>' +
            '        <li>消减负荷（kW）：<span class="SubtractNum">-</span></li>' +
            '        <li>计划消减（kW）：<span class="planNum">-</span></li>' +
            '        <li>完成比例（%）：<span class="completePer">-</span></li>' +
            '    </ul>' +
            '</div>';

        var right = '<div style="margin-left: 320px;"><p style="text-align:right;padding-top: 10px;background: #ffffff;margin: 0;padding-right:20px;padding-bottom: 10px;">实时时间：<span id="realTime"></span></p>'

        var rightTop = '<div id="topEchart' + num + '" class="shadowEffect line-block" style="height: 350px;background: #ffffff;width: 100%;"></div>';

        var rightBottomL = '<div style="margin-left: 320px;margin-top: 20px;"><div id="leftEchart' + num + '" class="shadowEffect pie-block" style="float:left;width: 48%;height: 300px;"></div>';

        var rightBottomR = '<div id="rightEchart' + num + '" class="shadowEffect bar-block" style="float:right;width: 48%;height: 300px;"></div></div>';

        var rights = '</div>'

        var blocks = '</div>'

        //核算按钮

        var chooseButton = '<div style="text-align: left !important;"><span id="HSErro"></span><br><button class="btn green answer-button" style="margin: 5px 0 5px 5px;display: none;">执行完毕，去核算</button></div>';

        var clear = '<div class="clearfix"></div>';

        return block + left + right + rightTop + rights + chooseButton + clear + blocks;

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

    //获取基线负荷（echart）
    function baselineLoad(chart){

        var prm = {

            //事件Id
            planId:_thisPlanId,
            //事件开始时间
            startDate:_st,
            //事件结束时间
            closeDate:_et
        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlanExec/GetHistoryJXFHsByPlanId',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                _baselineIsComplete = true;

                baseObj.x = [];

                baseObj.y = [];

                if(result.code == 0){

                    //基线负荷赋值
                    thisDataBlock.find('.baselineNum').html(result.jxFhVa);

                    //基线负荷的值
                    optionTop.xAxis.data = result.jxFhXs;

                    optionTop.series[1].data = result.jxFhYs;

                    chart.setOption(optionTop,true);

                    chartAry.push(chart);

                    baseObj.x = result.jxFhXs;

                    baseObj.y = result.jxFhYs;


                }else{

                    //基线负荷赋值
                    thisDataBlock.find('.baselineNum').html(result.jxFhXs);

                    //基线负荷的值
                    optionTop.xAxis.data = [];

                    optionTop.series[1].data = [];

                    chart.setOption(optionTop,true);

                }

                _currentBaselineObj = baseObj.x;

                BaseTimeCallback(chart);

            },

            error:_errorFun

        })


    }

    //获取实时负荷(echart)
    function realtimeLoad(chart){

        var prm = {

            //事件Id
            planId:_thisPlanId,
            //事件开始时间
            startDate:_st,
            //事件结束时间
            closeDate:_et,
            //角色
            userRole:sessionStorage.ADRS_UserRole
        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlanExec/GetHistoryNSFHsByPlanId',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                _realtimeIsComolete = true;

                realObj.x = [];

                realObj.y = [];

                if(result.code == 0){

                    //实时负荷赋值
                    thisDataBlock.find('.realTimeNum').html(result.ssFhVa);

                    //基线负荷的值
                    optionTop.xAxis.data = result.ssFhXs;

                    optionTop.series[0].data = result.ssFhYs;

                    chart.setOption(optionTop,true);

                    realObj.x = result.ssFhXs;

                    realObj.y = result.ssFhYs;

                }else{

                    //实时负荷赋值
                    thisDataBlock.find('.realTimeNum').html(result.ssFhVa);

                    //基线负荷的值
                    optionTop.xAxis.data = [];

                    optionTop.series[0].data = [];

                    chart.setOption(optionTop,true);

                }

                _currentRealObj = realObj.x;

                BaseTimeCallback(chart);

            },

            error:_errorFun

        })


    }

    //获取有参与户数和计划消减的统计值
    function joinInHH(){

        var prm = {

            //事件Id
            planId:_thisPlanId

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlanExec/GetAcctsNberAndXJFhVaByPlanId',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                if(result.code == 0){

                    //参与户数
                    thisDataBlock.find('.totalHH').html(result.acctsNber);

                    //计划消减
                    thisDataBlock.find('.planNum').html(result.xjFhVa);

                }

            },

            error:_errorFun

        })

    }

    //消减负荷=基线负荷的每一个值-实时负荷的每一个值
    function BaseTimeCallback(chart){

        $('#theLoading').modal('hide');

        //两个接口都调了
        if(_baselineIsComplete && _realtimeIsComolete){

            //存放消减负荷的值

            var _reduceLoad = [];

            //如果双方有任何一方为0,那么就直接写另一个,首先判断长度
            if(baseObj.x.length==realObj.x.length){

                //console.log('相等')

                //基线负荷-实时负荷
                for(var i=0;i<baseObj.x.length;i++){

                    var value = Number(baseObj.y[i]) - Number(realObj.y[i]);

                    _reduceLoad.push(value);

                }

            }else{

                //分别判断为0的情况
                if(baseObj.x.length == 0){

                    //console.log('基线为0')

                    for(var i=0;i<baseObj.x.length;i++){

                        var value = Number(0) - Number(realObj.y[i]);

                        _reduceLoad.push(value);

                    }

                }

                if(realObj.x.length == 0){

                    //console.log('实时为0')

                    for(var i=0;i<baseObj.x.length;i++){

                        var value = Number(baseObj.y[i]) - Number(0);

                        _reduceLoad.push(value);

                    }

                }

                //基线的点大于实时的点

                if(baseObj.x.length > realObj.x.length){

                    for(var i=0;i<realObj.x.length;i++){

                        var value = Number(baseObj.y[i]) - Number(realObj.y[i]);

                        _reduceLoad.push(value.toFixed(3));

                    }

                }

            }

            optionTop.series[2].data = _reduceLoad;

            //设置坐标
            chart.setOption(optionTop,true);

            //消减负荷=基线负荷-实时负荷
            var reduceLoad = Number(thisDataBlock.find('.baselineNum').html()) - Number(thisDataBlock.find('.realTimeNum').html());


            thisDataBlock.find('.SubtractNum').html(reduceLoad.toFixed(3));

            //完成比例 消减负荷/计划消减
            var per = (Number(thisDataBlock.find('.SubtractNum').html())/Number(thisDataBlock.find('.planNum').html())) * 100;

            $('.completePer').html(per.toFixed(3));

        }

    }

    //时间比大小,第一个时间大于第二个时间
    function timeCompare(st,et){

        var stValue = st;

        stValue = stValue.replace(/-/g,"/");

        var etValue = et;

        etValue = etValue.replace(/-/g,"/");

        var stNum = new Date(Date.parse(stValue));

        var etNum = new Date(Date.parse(etValue));

        //结束时间必须大于结束时间
        if(stNum < etNum){

            return true;

        }else{

            return false;

        }

    }

    //判断当前事件的执行状态
    function executeState(){

        var prm = {

            //事件Id
            planId:_thisPlanId,
            //用户角色
            userRole:sessionStorage.ADRS_UserRole,
            //事件开始时间
            startDate:_st,
            //事件结束时间
            closeDate:_et
        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlanExec/CreateDRPlanExecState',

            data:prm,

            async:false,

            timeout:_theTimes,

            success:function(result){

                if(result.planStateName == _currentStateName){

                    return false;

                }else{

                    _currentStateDom.html(result.planStateName);

                }



            },

            error:_errorFun1

        })

    }

    //核算按钮
    function accountFormat(){

        var block = '<div style="background: #f9f9f9 !important;position: relative">'

        var left = '<div class="formatLeft shadowEffect" style="position: absolute;top: 0;left: 0;">' +
            '    <ul>' +
            '        <li>参与总户数：<span class="totalHH">-</span></li>' +
            '        <li>基线负荷（kW）：<span class="baselineNum">-</span></li>' +
            '        <li>实时负荷（kW）：<span class="realTimeNum">-</span></li>' +
            '        <li>消减负荷（kW）：<span class="SubtractNum">-</span></li>' +
            '        <li>计划消减（kW）：<span class="planNum">-</span></li>' +
            '        <li>完成比例（%）：<span class="completePer">-</span></li>' +
            '        <li>是否达标：<span class="isStandard">-</span></li>' +
            '        <li>实际消减负荷(kW)：<span class="realSubtractNum">-</span></li>' +
            '        <li>总补贴金额(元)：<span class="subsidyAmount">-</span></li>' +
            '    </ul>' +
            '</div>';

        var right = '<div style="margin-left: 320px;height: 400px;">'

        var rightTop = '<table class="table innerTable  table-striped shadowEffect table-advance table-hover" cellspacing="0" width="100%"></table>';

        var rights = '</div>'

        var blocks = '</div>'

        var clear = '<div class="clearfix"></div>';

        var chooseButton = '<div style="text-align: left !important;"><button class="btn green answer-button" style="margin: 5px 0 5px 5px">执行完毕，去核算</button></div>';

        return block + left + right + rightTop + rights  + clear + chooseButton +  blocks;

    }

    //点击核算
    function accountData(){

        //实时负荷为0的情况下不允许核算，基线负荷和实时负荷的点数不相同时，不允许核算
        if(Number($('.realTimeNum').html()) == 0.000 || _currentBaselineObj.length != _currentRealObj.length){

            //_moTaiKuang($('#tip-Modal'),'提示',true,true,'实时数据采集上传延迟，清等数据完整时再进行核算','');

            $('#HSErro').html('实时数据采集上传延迟，清等数据完整时再进行核算');

            return false;

        }else{

            $('#HSErro').html('');

        }

        $('#theLoading').modal('show');

        var prm = {

            //事件Id
            planId:_thisPlanId,
            //用户角色
            userRole:sessionStorage.ADRS_UserRole

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRExecFinish/CreateDRPlanFinishState',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                if(result.code == 0){

                    //再调一个接口
                    createResult();

                }

            },

            error:_errorFun1

        })

    }

    //创建执行结果
    function createResult(){

        var prm = {

            //事件Id
            planId:_thisPlanId,
            //开始时间
            startDate:_st,
            //结束时间
            closeDate:_et
        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlanExec/CreateDRPlanExecResult',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                if(result.code == 0){

                    //跳转到执行完毕页面
                    window.location.href = 'execFinish.html'

                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'暂时没有需要审核的事件','');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'异常错误','');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'参数错误','');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'内容已存在','');

                }else if(result.code == -6){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'抱歉，您没有审核的权限','');

                }

            },

            error:_errorFun1

        })

    }


    return {
        init: function () {

        }
    }

}();