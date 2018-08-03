var UserChoose = function () {

    //存放当前所有值
    var _allData = [];

    //操作当前事件的id
    var _thisPlanId = '';

    //总的消减负荷
    var _totalReduce = 0;

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

                return '<span data-id="' + full.planId + '" style="color:#2170f4;text-decoration: underline ">筛选</span>'

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

    //聚合商用户表格初始化
    var colJ = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.accountId +'"><span><input type="checkbox" value=""></span></div>'

            }
        },
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
            title:'户数|户号',
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

    //登录者获取事件
    conditionSelect();

    /*-------------------------------------按钮事件-----------------------------------------*/

    //点击【详情】
    $('#table tbody').on('click', '.detail-button', function () {

        _totalReduce = 0;

        //存放当前企业所绑定户号的数组
        var thisOBJ = {};

        var thisEprId = $(this).children().attr('data-id');

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

            _totalReduce = $(this).parent().children().eq(4).html();

            row.child( formatDetail(thisOBJ) ).show();

            //初始化表格(搞清楚当前是聚合商0还是大用户1);
            var innerTable = $(this).parents('tr').next('tr').find('.userTable');

            _tableInit(innerTable,colJ,2,true,'','',true,'','',true);

            var el = $(this).parent('tr').next('tr');

            //获取数据
            getUserList(el,innerTable);

            tr.addClass('shown');
        }
    } );

    //筛选用户【tr】
    $('#table').on('click','.userTable tr',function(){

        //取消

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            //选中

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

        //每次都把选中的跳出来
        var checkedTr = $(this).parent().find('.tables-hover');

        var total = 0;

        for(var i=0;i<checkedTr.length;i++){

            var num = checkedTr.eq(i).children().eq(4).html();

            total += Number(num);

        }

        //总需消减负荷

        var Dvalue = total - _totalReduce;

        var DDom = $(this).parents('.answer-block').find('.reduceTip');

        $(DDom).html('');

        if(total != 0){

            if(Dvalue<0){

                var str = '选中消减负荷：' + total + '（kW），【短缺】消减负荷' + Math.abs(Dvalue) + '（kW）';


            }else if(Dvalue >0){

                var str = '选中消减负荷：' + total + '（kW），【超过】消减负荷' + Math.abs(Dvalue) + '（kW）';

            }else{

                var str = '';

            }

            $(DDom).html(str);

        }

    })

    //筛选确定按钮
    $('#table').on('click','.answer-button',function(){

        var table = $(this).parent().prev();

        var trs = table.find('tbody').children('.tables-hover');

        if(trs.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择用户','');

        }else{

            var arr = [];

            for(var i=0;i<trs.length;i++){

                var obj = {}

                //用户角色
                obj.eprTy = trs.eq(i).children().eq(1).children().attr('data-num');
                //用户角色名称
                obj.eprTyNt = trs.eq(i).children().eq(1).children().html();
                // 此次消减负荷量
                obj.reduceLoad = trs.eq(i).children().eq(4).html();
                //户号|数量
                //obj.acct = trs.eq(i).children().eq(3).html();
                //企业及居民Id
                obj.eprId = trs.eq(i).children().eq(2).children().attr('data-num');
                //企业及居民名称
                obj.eprName = trs.eq(i).children().eq(2).children().html();

                //判断用户角色，如果是用于聚合商
                if(obj.eprTy == 1){

                    //聚合商
                    obj.acctNbers = trs.eq(i).children().eq(3).html();

                }else if(obj.eprTy == 2){

                    //大用户
                    //户号
                    obj.acctId = trs.eq(i).children().eq(3).children().attr('data-acctid');
                    //户号名称
                    obj.acctName = trs.eq(i).children().eq(3).children().html();

                }


                arr.push(obj);

            }

            var prm = {

                //用户角色
                userRole:sessionStorage.ADRS_UserRole,
                //事件id
                planId:_thisPlanId,
                //选中的户号列表
                selectAccts:arr

            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DRUserChoose/ReplyUserResponse',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if($('.modal-backdrop').length > 0){

                        $('div').remove('.modal-backdrop');

                        $('#theLoading').hide();
                    }

                    if(result.code == -2){

                        _topTipBar('暂无数据');

                    }else if(result.code == -1){

                        _topTipBar('异常错误');

                    }else if(result.code == -3){

                        _topTipBar('参数错误');

                    }else if(result.code == -4){

                        _topTipBar('内容已存在');

                    }else if(result.code == -6){

                        _topTipBar('没有权限');

                    }else if(result.code == 0){

                        //conditionSelect();

                        window.location.href = 'pushInstruct.html'

                    }

                },

                error:_errorFun

            })

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
            state:2

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

                    _topTipBar('请等待聚合商和大用户响应')

                }else if(result.code == -1){

                    _topTipBar('异常错误')

                }else if(result.code == -3){

                    _topTipBar('参数错误')

                }else if(result.code == -4){

                    _topTipBar('内容已存在')

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

    //获取一下用户响应的接口，如果有数据，提示请等待聚合商和大用户响应，如果没有数据，提示暂时没有需要筛选的事件
    function userAnswer(){

        var  prm = {

            //事件
            planId:0,
            //区域
            districtId:0,
            //基线
            baselineId:0,
            //状态
            state:2

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

                    _topTipBar('请等待聚合商和大用户响应')

                }else if(result.code == -1){

                    _topTipBar('异常错误')

                }else if(result.code == -3){

                    _topTipBar('参数错误')

                }else if(result.code == -4){

                    _topTipBar('内容已存在')

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

        var ontherTable = '<table class="table userTable  table-advance table-hover subTable"></table>';

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

        var chooseButton = '<div style="text-align: left !important;"><button class="btn green answer-button" style="margin:0px 0 5px 5px;">选中用户</button></div>';

        var statistics = '<div style="text-align: left;margin: 5px 0;padding-left: 10px;"><label for="">统计：</label><div style="text-align: left;display: inline-block;vertical-align: middle">聚合商数：<span class="JHSNum" style="font-weight: bold;margin-right: 25px;"></span>聚合商下户号数：<span class="JYHS" style="font-weight: bold;margin-right: 25px;"></span>可消减负荷量（kW）：<span class="JFH" style="font-weight: bold;margin-right: 25px;"></span><br>大用户数：<span class="DYHNum" style="font-weight: bold;margin-right: 25px;"></span>大用户下户号数：<span class="DYHH" style="font-weight: bold;margin-right: 25px;"></span>可消减负荷量（kW）：<span class="DFH" style="font-weight: bold;margin-right: 5px;"></span><br>总消减负荷（kW）：<span class="TOTalFH" style="font-weight: bold;margin-right: 25px;"></span><br><span class="reduceTip" style="color: red;"></span></div></div>'

        var answer = '<div class="answer-block" style="display: none">';

        var answers = '</div>';

        //最外边的框
        var block = '<div style="border: 1px solid #68a1fd;">';

        var blocks = '</div>';

        var noDataError = '<div style="display: none;margin: 6px 0;width: 255px;" class="noDataError Metronic-alerts alert alert-danger fade in"><button type="button" class="close"></button><i class="fa-lg fa fa-warning"></i>  请等待聚合商和大用户响应</div>'


        return block + theader + tbodyer + str + tbodyers + theaders + answer +  statistics + ontherTable + chooseButton + answers + blocks + noDataError;

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

    //获取用户列表
    function getUserList(el,innerTable){

        $('#theLoading').modal('show');

        var prm = {

            //用户角色
            userRole:sessionStorage.ADRS_UserRole,
            //事件id
            planId:_thisPlanId

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRUserChoose/GetResponseDRPlanAccts',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = [];

                //聚合商数
                aggrNber = 0;
                //聚合商下用户数
                aggrAccts = 0;
                //可消减负荷量
                aggrReduceLoad = 0;
                //大用户数
                kANber = 0;
                //大用户下户号数
                kAAccts = 0;
                //可消减负荷量
                kAReduceLoad = 0;
                //总消减负荷
                totalReduceLoad = 0;

                if(result.code == -2){

                    _topTipBar('暂时没有用户');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('参数错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == -6){

                    _topTipBar('抱歉，您没有用户筛选权限');

                }else if(result.code == 0){

                    //赋值
                    //聚合商数
                    aggrNber = result.aggrNber;
                    //聚合商下用户数
                    aggrAccts = result.aggrAccts;
                    //可消减负荷量
                    aggrReduceLoad = result.aggrReduceLoad;
                    //大用户数
                    kANber = result.kANber;
                    //大用户下户号数
                    kAAccts = result.kAAccts;
                    //可消减负荷量
                    kAReduceLoad = result.kAReduceLoad
                    //总消减负荷
                    totalReduceLoad = result.totalReduceLoad;
                    //列表
                    arr = result.mergeAccts;

                }

                //赋值
                //聚合商数
                el.find('.JHSNum').html(aggrNber);
                //聚合商下用户数
                el.find('.JYHS').html(aggrAccts);
                //可消减负荷量
                el.find('.JFH').html(aggrReduceLoad);
                //大用户数
                el.find('.DYHNum').html(kANber);
                //大用户下户号数
                el.find('.DYHH').html(kAAccts);
                //可消减负荷量
                el.find('.DFH').html(kAReduceLoad);
                //总消减负荷
                el.find('.TOTalFH').html(totalReduceLoad);
                //列表
                _datasTable(innerTable,arr);

                el.find('.answer-block').hide();

                el.find('.noDataError').hide();

                //回复模块不显示

                if(result.mergeAccts == null || result.mergeAccts.length == 0 || result.mergeAccts == '' ){

                    el.find('.answer-block').hide();

                    el.find('.noDataError').show();


                }else{

                    el.find('.answer-block').show();

                }


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

    return {
        init: function(){

        }
    }

}()