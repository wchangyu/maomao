﻿var PlanExec = function () {

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
            title:'消减负荷（kW）',
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
            title:'操作',
            data:'',
            className:'detail-button',
            render:function(data, type, full, meta){

                return '<span class="option-particulars" data-id="' + full.planId + '" style="color:#2170f4;text-decoration: underline ">详情</span>' +

                    '<span class="option-implement" data-id="' + full.planId + '" style="color:#2170f4;text-decoration: underline;margin-left: 10px;">执行</span>'

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

    conditionSelect();

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

    //饼
    var optionPie = {
        color:['#7cb5ed','#424248'],
        title : {
            text: '参与用户统计',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            top: '80%',
            data: ['直接访问','邮件营销']
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '45%'],
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    //柱状
    var optionBar = {
        color:['#7cb5ed','#424248','#90ed7b'],
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['蒸发量','降水量','散热量']
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['1月']
            }
        ],
        yAxis : [
            {
                show:true,
                type : 'value',
                axisTick:{
                    show:false
                },
                axisLine:{
                    show:false
                }
            }
        ],
        series : [
            {
                name:'蒸发量',
                type:'bar',
                data:[2.0],
                barWidth:'80'
            },
            {
                name:'降水量',
                type:'bar',
                data:[2.6],
                barWidth:'80'
            },
            {
                name:'散热量',
                type:'bar',
                data:[1.6],
                barWidth:'80'
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

    //点击【执行中】
    $('#table tbody').on('click','.option-implement',function(){

        $('#theLoading').modal('show');

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;

        var row = _table.row( tr );

        var planId = $(this).attr('data-id');

        //id
        _thisPlanId = planId;

        //开始时间
        _st = $(this).parent().parent().children().eq(2).html();

        //结束时间
        _et = $(this).parent().parent().children().eq(3).html();

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

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

            ////饼图
            var pieBlock = format.find('.pie-block').attr('id');

            var echartPie = echarts.init(document.getElementById(pieBlock));

            echartPie.setOption(optionPie);

            //柱状图
            var barBlock = format.find('.bar-block').attr('id');

            var echartBar = echarts.init(document.getElementById(barBlock));

            echartBar.setOption(optionBar);

            //获取基线数据
            baselineLoad(echart1);

            //获取实时数据（十分钟刷新一次）

            realtimeLoad(echart1);

            setInterval(function(){

                realtimeLoad(echart1);

            },1000*60*10)

            //参与户数
            joinInHH();

            tr.addClass('shown');

            _indexNum ++;
        }

    })

    /*-------------------------------------其他方法-----------------------------------------*/

    //获取所有产品
    function conditionSelect(){

        $('#theLoading').modal('show');

        var  prm = {

            //事件
            planId:0,
            //区域
            districtId:0,
            //基线
            baselineId:0,
            //状态
            state:5

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetDRPlanDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                _allData.length = 0;

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

                var arr = [];

                if(result.code == -2){

                    _topTipBar('暂时没有执行中的事件')

                }else if(result.code == -1){

                    _topTipBar('异常错误')

                }else if(result.code == -3){

                    _topTipBar('参数错误')

                }else if(result.code == -4){

                    _topTipBar('内容已存在')

                }else if(result.code == -6){

                    _topTipBar('抱歉，您没有操作权限')

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
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>' + '</tr>';

                }else{

                    //产品名称、产品类型、补贴方式、补贴价格、提前通知时间、产品描述
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称' + (i+1) + '</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>'  + '</tr>';

                }


            }

        }

        //备注
        str += '<tr><td class="subTableTitle">描述</td><td colspan="9" style="text-align: left;text-indent: 25px;">' + d.memo + '</td></tr>'

        var chooseButton = '<div style="text-align: left !important;margin-bottom: 5px;"><button class="btn green answer-button">下发指令</button></div>';

        var block = '<div style="border: 1px solid #68a1fd;">';

        var blocks = '</div>';

        return block + theader + tbodyer + str + tbodyers + theaders + blocks;

    }

    //执行情况
    function formatImplement(num){

        var block = '<div style="background: #f9f9f9 !important;">'

        var left = '<div class="formatLeft shadowEffect">' +

            '<div style="font-size: 20px;line-height: 40px;text-align: left;padding-left: 5px;">' +
            '事件执行' +
            '<div style="float: right;font-size: 14px;line-height: 38px;">' +
            '参与总户数：' +
            '<span id="totalHH" style="margin-right: 20px;font-size: 16px;font-weight: bold">0</span>' +
            '</div>' +
            '</div>' +
            '<ul class="execute">' +
            '<li>' +
            '<p id="baselineNum">0</p>' +
            '<span>基线负荷（kw）</span>' +
            '</li>' +
            '<li>' +
            '<p id="realTimeNum">0</p>' +
            '<span>实时负荷（kw）</span>' +
            '</li>' +
            '<li>' +
            '<p id="SubtractNum">0</p>' +
            '<span>消减负荷（kw）</span>' +
            '</li>' +
            '<li>' +
            '<p id="planNum">0</p>' +
            '<span>计划负荷（kw）</span>' +
            '</li>' +
            '</ul>' +
            '</div>';

        var right = '<div style="margin-left: 320px;"><p style="text-align:right;padding-top: 10px;background: #ffffff;margin: 0;padding-right:20px;padding-bottom: 10px;">实时时间：<span id="realTime"></span></p>'

        var rightTop = '<div id="topEchart' + num + '" class="shadowEffect line-block" style="height: 350px;background: #ffffff;width: 100%;"></div>';

        var rightBottomL = '<div style="margin-left: 320px;margin-top: 20px;"><div id="leftEchart' + num + '" class="shadowEffect pie-block" style="float:left;width: 48%;height: 300px;"></div>';

        var rightBottomR = '<div id="rightEchart' + num + '" class="shadowEffect bar-block" style="float:right;width: 48%;height: 300px;"></div></div>';

        var rights = '</div>'

        var blocks = '</div>'

        var clear = '<div class="clearfix"></div>';

        return block + left + right + rightTop + rights + rightBottomL + rightBottomR + clear + blocks;

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

    //获取基线负荷
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

                if(result.code == 0){

                    //基线负荷赋值
                    $('#baselineNum').html(result.jxFhVa);

                    //基线负荷的值
                    optionTop.xAxis.data = result.jxFhXs;

                    optionTop.series[1].data = result.jxFhYs;

                    chart.setOption(optionTop,true);

                }else{

                    //基线负荷赋值
                    $('#baselineNum').html(result.jxFhXs);

                    //基线负荷的值
                    optionTop.xAxis.data = [];

                    optionTop.series[1].data = [];

                    chart.setOption(optionTop,true);

                }

                baseObj.x = result.jxFhXs;

                baseObj.y = result.jxFhYs;

                BaseTimeCallback(chart);

            },

            error:_errorFun

        })


    }

    //获取实时负荷
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

                if(result.code == 0){

                    //实时负荷赋值
                    $('#realTimeNum').html(result.ssFhVa);

                    //基线负荷的值
                    optionTop.xAxis.data = result.ssFhXs;

                    optionTop.series[0].data = result.ssFhYs;

                    chart.setOption(optionTop,true);

                }else{

                    //实时负荷赋值
                    $('#realTimeNum').html(result.ssFhVa);

                    //基线负荷的值
                    optionTop.xAxis.data = [];

                    optionTop.series[0].data = [];

                    chart.setOption(optionTop,true);

                }

                realObj.x = result.ssFhXs;

                realObj.y = result.ssFhYs;

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
                    $('#totalHH').html(result.acctsNber);

                    //计划消减
                    $('#planNum').html(result.xjFhVa);

                }

            },

            error:_errorFun

        })

    }

    //消减负荷=基线负荷的每一个值-实时负荷的每一个值
    function BaseTimeCallback(chart){

        if(_baselineIsComplete && _realtimeIsComolete){

            $('#theLoading').modal('hide');

            //存放消减负荷的值

            var _reduceLoad = [];

            //如果双方有任何一方为0,那么就直接写另一个,首先判断长度
            if(baseObj.x.length==realObj.x.length){

                //基线负荷-实时负荷
                for(var i=0;i<baseObj.x.length;i++){

                    var value = Number(baseObj.y[i]) - Number(realObj.y[i]);

                    _reduceLoad.push(value);

                }

            }else{

                //分别判断为0的情况
                if(baseObj.x.length == 0){

                    for(var i=0;i<baseObj.x.length;i++){

                        var value = Number(0) - Number(realObj.y[i]);

                        _reduceLoad.push(value);

                    }

                }

                if(realObj.x.length == 0){

                    for(var i=0;i<baseObj.x.length;i++){

                        var value = Number(baseObj.y[i]) - Number(0);

                        _reduceLoad.push(value);

                    }

                }

            }

            optionTop.series[2].data = _reduceLoad;

            //设置坐标
            chart.setOption(optionTop,true);

            //消减负荷=基线负荷-实时负荷
            var reduceLoad = Number($('#baselineNum').html()) - Number($('#realTimeNum').val());

            $('#SubtractNum').html(reduceLoad);


        }

    }

    return {
        init: function () {

        }
    }

}();