var PlanPublish = function () {

    //记录当前选中的userId
    var _thisID = '';

    //记录当前参与户号数
    _thisHnum = '';

    //记录当前事件的开始时间
    var _thisPlanSt = '';

    //存放当前所有值
    var _allData = [];

    /*-----------------------------------表格初始化-------------------------------------*/

    var col=[

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
            title:'潜在户号数',
            data:'takeInAcctNbers'
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
            className:'table-detail',
            render:function(data, type, full, meta){

                return "<span data-userId='" + full.planId + "' data-public='" + full.takeInAcctNbers +"' style='color:#2170f4;text-decoration: underline'>详情</span>"

            }
        },
        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                if(full.planState == 1){

                    //如果户号数为0，不显示

                    return  "<span class='option-button option-edit'><a href='planMade.html?num=" + full.planId + "&state=" + full.planState +
                        "'>编辑</a></span>" +

                        "<span class='option-button option-publish' data-userId='" + full.planId + "' data-public='" + full.takeInAcctNbers +"'>发布</span>"

                }else{

                    return ""

                }

            }
        }

    ]

    _tableInit($('#table'),col,2,true,'','','','');

    /*-----------------------------------按钮事件-----------------------------------------*/

    //删除
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
        //bind(_thisID);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //是否可操作
        //账户登录名不能操作
        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

        //密码不显示
        $('.password-block').hide();

    })

    //发布
    $('#table tbody').on('click','.option-publish',function(){

        $('#theLoading').modal('show');

        _thisID = $(this).attr('data-userid');

        _thisHnum = $(this).attr('data-public');

        //初始化
        $('#publish-Modal').find('input').val('');

        //模态框
        _moTaiKuang($('#publish-Modal'),'发布','','','','发布');

        //数据
        var prm = {

            planId:_thisID

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetDRPlanById',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //赋值
                    //事件名称
                    $('#plan-name-publish').val(result.plan.planName);
                    //消减负荷
                    $('#reduce-load-publish').val(result.plan.reduceLoad);
                    //参与区域
                    $('#district-publish').val(result.plan.districtName);
                    //参与户号数
                    $('#num-publish').val(_thisHnum);
                    //默认截至日期(开始时间-12个小时)
                    var byTime = moment(result.plan.startDate).subtract(0.5,'day').format('YYYY-MM-DD HH:mm:ss');

                    var start = moment(result.plan.startDate).format('YYYY-MM-DD HH:mm:ss');

                    _thisPlanSt = moment(result.plan.startDate).format('YYYY-MM-DD HH:mm:ss');

                    //摧毁之前的反馈时间对象

                    $('#plan-by-time').datetimepicker('remove');

                    $('#plan-by-time').datetimepicker({
                        language:  'zh-CN',//此处修改
                        weekStart: 1,
                        todayBtn:  1,
                        autoclose: 1,
                        todayHighlight: 1,
                        startView: 2,  //1时间  2日期  3月份 4年份
                        forceParse: 0,
                        endDate:start
                    });

                    //赋值
                    $('#plan-by-time').val(byTime);

                    //比较反馈时间和开始时间，反馈时间必须小于开始时间，并且大于现在的时间
                    if( timeCompare($('#plan-by-time').val(),_thisPlanSt) ){

                        $('#timeError').html('');

                        if( timeCompare(moment().format('YYYY-MM-DD HH:mm:ss'),$('#plan-by-time').val()) ){

                            $('#timeError').html('');

                        }else{

                            $('#timeError').html('反馈时间必须大于发布时间');

                        }


                    }else{

                        $('#timeError').html('反馈时间必须小于开始时间');

                    }


                }

            },

            error:_errorFun

        })

    })

    //反馈时间选择
    $('#plan-by-time').change(function(){

        //比较反馈时间小于开始时间大于创建时间
        if( timeCompare($('#plan-by-time').val(),_thisPlanSt) ){

            $('#timeError').html('');

            if( timeCompare(moment().format('YYYY-MM-DD HH:mm:ss'),$('#plan-by-time').val()) ){

                $('#timeError').html('');

            }else{

                $('#timeError').html('反馈时间必须大于创建时间');

            }

        }else{

            $('#timeError').html('反馈时间必须小于开始时间');

        }

    })

    //发布【确定按钮】
    $('#publish-Modal').on('click','.btn-primary',function(){

        $('#theLoading').modal('show');

        if(_thisHnum == 0){

            $('#theLoading').modal('hide');

            $('#timeError').html('没有绑定户号不能发布');

        }else{

            //判断反馈时间是否正确
            if($('#timeError').html() == ''){

                var prm = {

                    //事件id
                    planId:_thisID,
                    //反馈截止时间
                    abortDate:$('#plan-by-time').val(),
                    //用户角色
                    userRole:sessionStorage.ADRS_UserRole,
                    //参与户数
                    takeInAcctNbers:_thisHnum,
                    //开始日期
                    startDate:_thisPlanSt
                }

                $.ajax({

                    type:'post',

                    url:sessionStorage.apiUrlPrefix + 'DRPlanPublish/DRPlanPublish',

                    timeout:_theTimes,

                    data:prm,

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

                        }else if(result.code == -5){

                            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'反馈时间输入有误', '');

                        }else if(result.code == 6){

                            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'抱歉，您没有操作权限', '');

                        }else if(result.code == 0){

                            $('#publish-Modal').modal('hide');

                            $('#publish-Modal').one('hidden.bs.modal',function(){

                                conditionSelect(true);

                            })

                        }

                    },

                    error:_errorFun

                })

            }else{

                $('#theLoading').modal('hide');

                _moTaiKuang($('#tip-Modal'),'提示',true,true,'反馈时间不能大于开始时间','');

            }

        }

    })

    //发布窗口关闭之后
    $('#publish-Modal').on('hidden.bs.modal',function(){

        _thisPlanSt = '';

        _thisHnum = '';

        _thisID = '';

    })

    //详情
    $('#table tbody').on('click','.table-detail',function(){

        //存放当前企业所绑定户号的数组
        var thisOBJ = {};

        var thisEprId = $(this).children('span').attr('data-userid');

        _thisPlanId = thisEprId;

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

            row.child( formatDetail(thisOBJ) ).show();

            tr.addClass('shown');
        }

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
                state:1

            }

        }else{

            var  prm = {

                //事件
                planId:$('#plan-name').val(),
                //区域
                districtId:$('#plan-district').val(),
                //基线
                baselineId:$('#plan-baseline').val(),
                //状态
                state:$('#plan-state').val()

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

                var arr = [];

                $('#tip').hide();

                if(result.code == -2){

                    _topTipBar('暂时没有需要发布的事件');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('参数错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == 0){

                    arr = result.plans;

                    _allData.length = 0;

                    for(var i=0;i<arr.length;i++){

                        _allData.push(arr[i]);

                    }

                }

                _jumpNow($('#table'),arr);

            },

            error:_errorFun

        })


    }

    //样式
    function changeCss(el){

        $('.table tbody').find('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

    }

    //创建账户初始化
    function createInit(){

        //清空
        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val(1);

        $('#create-Modal').find('textarea').val('');

        //记录当前选中的userId
        _thisID = '';

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

        return theader + tbodyer + str + tbodyers + theaders + ontherTable;

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
        init: function () {

            //条件查询
            conditionSelect(true);

        }
    }

}();