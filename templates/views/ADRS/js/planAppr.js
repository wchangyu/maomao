var Appr = function () {

    //存放所有列表的数据
    var _allData = [];

    //操作当前事件的id
    var _thisPlanId = '';

    var chartAry = [];

    //当前计划的开始事件
    var _st = '';

    //当前计划的结束事件
    var _et = '';

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

                return '<span data-id="' + full.planId + '" style="color:#2170f4;text-decoration: underline ">审核</span>'

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

    //登录者获取事件
    conditionSelect();

    //echarts参数
    var option = {
        title:{

            text:'',
            textStyle:{

                color:'#757575',
                fontWeight:'normal',
                fontSize:'16px'
            },
            left:'40px',
            top:'25px'

        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value',
            name:''
        },
        series: [{
            data: [],
            type: 'line'
        }]

    }

    /*-------------------------------------按钮事件-----------------------------------------*/

    var chartNum = 0;

    //点击【详情】
    $('#table tbody').on('click', '.detail-button', function () {

        //存放当前企业所绑定户号的数组
        var thisOBJ = {};

        var thisEprId = $(this).children().attr('data-id');

        //计划id
        _thisPlanId = thisEprId;

        //开始时间
        _st = $(this).parent().children().eq(2).html();

        //结束时间
        _et = $(this).parent().children().eq(3).html();

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

            row.child( formatDetail(thisOBJ,chartNum) ).show();

            //获取echart的id
            var echartId = $(this).parent('tr').next().find('.baseline-echart').attr('id');

            var echartObj = echarts.init(document.getElementById(echartId));

            //获取当前的基线数据
            chartData(echartObj);

            tr.addClass('shown');

            chartNum ++;

        }
    } );

    //审核
    $('#table').on('click','.examine-button',function(){

        //发送请求
        var prm = {

            //审核人员(登录用户名) ,
            userId:sessionStorage.ADRS_UserId,
            //审核人员用户角色
            userRole:sessionStorage.ADRS_UserRole,
            //审核计划
            planId:_thisPlanId,
            //备注
            memo:$(this).parent().prev().find('textarea').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlanAppr/CreateAuditDRPlanInfo',

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

                }else if(result.code == -6){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'抱歉，您没有审核事件的权限', '');

                }else if(result.code == 0){

                    conditionSelect();

                }

            },

            error:_errorFun

        })

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

        $('#theLoading').modal('show');

        var  prm = {

            //事件
            planId:0,
            //区域
            districtId:0,
            //基线
            baselineId:0,
            //状态
            state:3

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

                    _topTipBar('暂时没有需要审核的事件');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('参数错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == -6){

                    _topTipBar('没有权限');

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
    function formatDetail(d,num){

        var theader = '<table class="table  table-advance table-hover subTable">';

        var theaders = '</table>';

        var tbodyer = '<tbody>'

        var tbodyers = '</tbody>';

        var str = '';

        //计划名称、区域、开始时间
        str += '<tr>' + '<td class="subTableTitle" ">计划名称</td>' + '<td>'+ d.planName +'</td>' + '<td class="subTableTitle">区域</td>' + '<td>' + d.districtName + '</td>' + '<td class="subTableTitle">开始时间</td>' + '<td>' + d.startDate + '</td>'  + '</tr>';

        //结束时间、计划消减负荷量、基线
        str += '<tr>'+ '<td class="subTableTitle">结束时间</td>' + '<td>' + d.closeDate + '</td>' + '<td class="subTableTitle" ">消减负荷（kW）</td>'+ '<td>' + d.reduceLoad + '</td>' + '<td class="subTableTitle">基线</td>' + '<td>'+ d.baselineName +'</td>' +'</tr>';

        //发布时间、反馈截止时间
        str += '<tr>' + '<td class="subTableTitle">发布时间</td>' + '<td>'+ d.publishDate +'</td>' + '<td class="subTableTitle">反馈截止时间</td>' + '<td class="endTime">'+ d.abortDate +'</td>' + '<td class="subTableTitle"></td>' + '<td>' + '</td>' + '</tr>';

        if(d.librarys){

            for(var i=0;i< d.librarys.length;i++){

                var lengths = d.librarys.length;

                var tc = d.librarys[i];

                if(lengths == 1){

                    //产品名称、产品类型、补贴方式、补贴价格、
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>'+ '</tr>';
                    //提前通知时间、产品描述
                    str += '<tr>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>' + '<td class="subTableTitle"></td>' + '<td>' + '</td>' + '</tr>'

                }else{

                    //产品名称、产品类型、补贴方式、补贴价格、
                    str += '<tr>' + '<td class="subTableTitle" ">套餐名称' + (i+1) + '</td>' + '<td>' + tc.name + '</td>' + '<td class="subTableTitle">套餐类型</td>' + '<td>' + libType(tc.libraryType) + '</td>' + '<td class="subTableTitle" ">补贴方式</td>' + '<td>' + priceMode(tc.priceMode) + '</td>'+ '</tr>';
                    //提前通知时间、产品描述
                    str += '<tr>' + '<td class="subTableTitle">补贴价格</td>' + '<td>' + tc.price + '</td>' +  '<td class="subTableTitle">提前通知时间</td>' + '<td>' + tc.noticeHour + '</td>' + '<td class="subTableTitle"></td>' + '<td>' + '</td>' + '</tr>'

                }


            }

        }

        //备注
        str += '<tr><td class="subTableTitle">描述</td><td colspan="9">' + d.memo + '</td></tr>'

        //账户响应的table
        //echarts图
        var echart = '<div><div class="baseline-echart" id="echart' + num +'" style="height: 256px;background: #ffffff;border: 1px solid #e5e5e5;"></div></div>'

        var moeo = '<div style="position: relative;margin: 10px 0;">' +

            '<div style="margin-right: 70px;">' +

            '<textarea id="remark" placeholder="请输入备注" style="height: 35px;"class="table-group-action-input form-control"></textarea>' +

            '</div>' +

            '<button class="btn green examine-button" style="position: absolute;bottom: 0;right: 0;">审核</button>' +

            '</div>'

        var left = '<div class="col-lg-6 col-md-12 col-sm-12" style="padding-left: 0">';

        var lefts = '</div>';

        //最外边的框
        var block = '<div class="row" style="margin: 0">';

        var blocks = '</div>';

        var right = '<div class="col-lg-6 col-md-12 col-sm-12" style="padding-right: 0">';

        var rights = '</div>';

        return block + left + theader + tbodyer + str + tbodyers + theaders + moeo + lefts + right + echart + rights + blocks;

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

    //获取基线chart图
    function chartData(echartObj){

        var prm = {

            //事件Id
            planId:_thisPlanId,
            // 用户角色
            userRole:sessionStorage.ADRS_UserRole,
            //开始事件
            startDate:_st,
            //结束事件
            closeDate:_et

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlanAppr/GetBSLByPlanId',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

                //横坐标
                var dataX = [];

                //纵坐标
                var dataY = [];

                //纵坐标
                var title = '';

                if(result.code == 0){

                    //处理数据
                    for(var i=0;i<result.xs.length;i++){

                        dataX.push(result.xs[i]);

                    }

                    for(var i=0;i<result.ys.length;i++){

                        dataY.push(result.ys[i]);

                    }

                    title = result.lgs[0];

                }

                //横坐标
                option.xAxis.data = dataX;

                //纵坐标
                option.series[0].data = dataY;

                //title
                option.title.text = title;

                echartObj.setOption(option);

                chartAry.push(echartObj);

            },

            error:_errorFun

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

    return {
        init: function(){


        }
    }

}()

