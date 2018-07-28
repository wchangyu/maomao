var PlanMade = function () {

    //首先要区分是登记页面还是编辑页面

    var hrefFlag = window.location.search;

    if(hrefFlag){

        //编辑

        var flagSplit = hrefFlag.split('&');

        var id = flagSplit[0].split('=')[1];

        var state = flagSplit[1].split('=')[1];

        //绑定数据
        bind(id);

        //加类名
        $('#creatUser').removeClass('dengji').addClass('bianji').html('保存');

    }else{

        //登记

        //加类名
        $('#creatUser').removeClass('bianji').addClass('dengji').html('创建');

    }

    //当前选中的区域
    var _thisDistrict = '';

    //当前选中的套餐
    var _thisMealArr = [];

    var now = moment().format('YYYY-MM-DD HH:mm:ss');

    //时间插件
    $('.datatimeblock').datetimepicker({
        language:  'zh-CN',//此处修改
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,  //1时间  2日期  3月份 4年份
        forceParse: 0,
        startDate:now
    });

    //如果先选择结束时间，那么就要重新初始化开始时间
    $('#plan-et').change(function(){

        //获取结束时间，如果结束时间不为空的话，开始时间只能是结束时间的同一天，并且小于结束时间
        var et = moment($('#plan-et').val()).format('YYYY-MM-DD HH:mm:ss');

        //首先要销毁
        $('#plan-st').datetimepicker('remove');

        $('#plan-st').datetimepicker({
            language:  'zh-EN',//此处修改
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 1,  //1时间  2日期  3月份 4年份
            forceParse: 0,
            maxView:1,
            startDate:moment(et).format('YYYY-MM-DD'),
            endDate:moment(et).format('YYYY-MM-DD HH:mm:ss')
        });


    })

    //如果先选择开始时间，那么就要重新初始化结束时间
    $('#plan-st').change(function(){

        //获取开始时间，如果开始时间不为空的话，结束时间只能是和开始时间同一天，并且大于结束时间
        var st = moment($('#plan-st').val()).format('YYYY-MM-DD HH:mm:ss');

        var et = moment($('#plan-st').val()).format('YYYY-MM-DD') + ' 23:55';

        //首先要销毁
        $('#plan-et').datetimepicker('remove');

        $('#plan-et').datetimepicker({
            language:  'zh-EN',//此处修改
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 1,  //1时间  2日期  3月份 4年份
            forceParse: 0,
            maxView:1,
            startDate:moment(st).format('YYYY-MM-DD HH:mm:ss'),
            endDate:moment(et).format('YYYY-MM-DD HH:mm:ss')
        });

    })

    $('.datetimepicker').eq(1).find('.next').css({'visibility':'hidden'});

    //基线数据加载
    baselineData();

    //记录当前区域下的户号和资源数据
    var _HRArr = [];

    /*-----------------------------------表格初始化-------------------------------------*/

    var col=[

        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='data-option option-edit btn default btn-xs green-stripe' data-userId='" + full.accountId + "'>编辑</span>" +

                    "<span class='data-option option-shanchu btn default btn-xs green-stripe' data-userId='" + full.accountId + "'>删除</span>" +

                    "<span class='data-option option-qiye btn default btn-xs green-stripe' data-userId='" + full.accountId + "'>绑定企业</span>"

            }
        },
        {
            title:'事件名称',
            data:''
        },
        {
            title:'开始时间',
            data:''
        },
        {
            title:'结束时间',
            data:''
        },
        {
            title:'消减负荷',
            data:''
        },
        {
            title:'基线',
            data:''
        },
        {
            title:'区域',
            data:''
        },
        {
            title:'产品库',
            data:''
        },
        {
            title:'备注',
            data:''
        }

    ]

    _tableInit($('#table'),col,2,true,'','','','');

    //基线表格
    var baselineCol=[

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<div class="checker"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'基线id',
            data:'id'
        },
        {
            title:'基线名称',
            data:'name'
        },
        {
            title:'基线类型',
            data:'type',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '累计（典型）'

                }else{

                    return '时刻'
                }

            }
        },
        {
            title:'计算方式',
            data:'typical',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '仅限工作日'

                }else if(data == 2){

                    return '不限工作日'

                }

            }
        },
        {
            title:'推前天数',
            data:'days'
        },
        {
            title:'推前分钟数',
            data:'minutes'
        },
        {
            title:'描述',
            data:'memo'
        }



    ]

    _tableInit($('#baseline-table'),baselineCol,2,true,'','','','',10);

    //区域
    var districtCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'区域名称',
            data:'name'
        },
        {
            title:'区域等级',
            data:'level',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '省级'

                }else if(data == 2){

                    return '市级'

                }

            }
        }

    ]

    _tableInit($('#district-table'),districtCol,2,true,'','','','',10);

    //套餐
    var mealCol=[
        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'产品名称',
            data:'name'
        },
        {
            title:'产品类型',
            data:'libraryType',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '价格型'

                }else if(data == 2){

                    return '鼓励型'

                }

            }
        },
        {
            title:'计价方式',
            data:'priceMode',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '按次每kW'

                }else if(data == 2){

                    return '按量每kWh'

                }else if(data == 3){

                    return '分时电价'

                }

            }
        },
        {
            title:'补贴价格',
            data:'price'
        },
        {
            title:'补贴发放方式',
            data:'allowType',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '电费抵扣'

                }else if(data == 2){

                    return '现金支付'

                }else if(data == 3){

                    return '预付补贴'

                }

            }
        },
        {
            title:'提前通知时间(小时)',
            data:'noticeHour'
        },
        {
            title:'产品描述',
            data:'memo'
        }

    ]

    _tableInit($('#set-meal-table'),mealCol,2,true,'','','','');

    //根据区域获取资源和户号
    var HRCol = [

        {
            title:'户号',
            data:'acctNt'
        },
        {
            title:'资源',
            data:'name'
        }

    ]

    _tableInit($('#HHResTable'),HRCol,2,true,'','','','','',true);

    /*-----------------------------------创建表单验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //事件名称
            'plan-name':{

                required: true

            },

            //开始时间
            'plan-st':{

                required: true

            },

            //结束时间
            'plan-et':{

                required: true

            },

            //消减负荷
            'reduce-load':{

                required: true,

                numberFormat1:true

            }

        },
        messages:{

            //事件名称
            'plan-name':{

                required: '请输入事件名称'

            },

            //开始时间
            'plan-st':{

                required: '请选择开始时间'

            },

            //结束时间
            'plan-et':{

                required: '请选择结束时间'

            },

            //消减负荷
            'reduce-load':{

                required: '请输入消减负荷'

            }

        }

    })

    //消减负荷必须是数字
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

    //创建账户【确定按钮】
    $('.cmxform').on('click','.dengji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRPlanMade/DRPlanRegister','创建成功');

        })

    })

    //编辑
    $('.cmxform').on('click','.bianji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRPlanMade/DRPlanModify','编辑成功',true);

        })

    })

    //【选择区域】
    $('.select-district').click(function(){

        //初始化
        $('#keyWord-district-modal').val('');

        //模态框
        _moTaiKuang($('#district-Modal'),'区域',false,'','','选择');

        //数据
        districtData();

        //初始化
        _HRArr = [];

    })

    //区域条件选择【查询】
    $('#selected-district-modal').click(function(){

        districtData();

    })

    //选择区域【tr】
    $('#district-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#district-table tbody').find('tr').removeClass('tables-hover');

            $('#district-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#district-table tbody').find('tr').removeClass('tables-hover');

            $('#district-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

        var id = $(this).find('.checker').attr('data-id')

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;

        var table1 = $(this).parents('table').DataTable();

        var row = table1.row( tr );

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            row.child( HRData()).show();

            var innerTable = $(this).next().find('.table');

            var HHDom = $(this).next().find('.eprHH');

            var ResDom = $(this).next().find('.eprRes');

            //表格初始化
            _tableInit(innerTable,HRCol,2,true,'','','','','',true);

            //点击tr显示户号
            HHResFormat(id,innerTable,HHDom,ResDom);

            tr.addClass('shown');
        }

    })

    //选择区域【选择】
    $('#district-Modal').on('click','.btn-primary',function(){


        if(_HRArr.length != 0){

            var nowSelected = $('#district-table tbody').find('.tables-hover');

            _thisDistrict = nowSelected.children().eq(0).children('.checker').attr('data-id');

            var name = nowSelected.children().eq(1).html();

            $('#district').val(name);

            _datasTable($('#HHResTable'),_HRArr);

            //户数
            $('#HHNum').html(_HRArr.length);

            //资源
            $('#ResNum').html(_HRArr.length);

            $('.HHRs-block').show();

            $('#district-Modal').modal('hide');

        }else{

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'当前选中的区域没有绑定户号和设备，请重新选择','')

        }



    })

    //【选择套餐】
    $('.select-set-meal').click(function(){

        //初始化


        //模态框
        _moTaiKuang($('#set-meal-Modal'),'套餐','','','','选择');

        //数据
        mealData();

    })

    //套餐条件选择【查询】
    $('#selected-meal-modal').click(function(){

        mealData();

    })

    //选择套餐【tr】
    $('#set-meal-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //选择套餐【选择】
    $('#set-meal-Modal').on('click','.btn-primary',function(){

        var nowSelected = $('#set-meal-table tbody').find('.tables-hover');

        _thisMealArr = [];

        var nameStr = '';

        for(var i=0;i<nowSelected.length;i++){

            var id = nowSelected.eq(i).children().eq(0).children('.checker').attr('data-id');

            var name = nowSelected.eq(i).children().eq(1).html();

            _thisMealArr.push(id);

            if(i == nowSelected.length-1){

                nameStr += name

            }else{

                nameStr += name + '、'

            }

        }

        $('#set-meal').val(nameStr);

        $('#set-meal-Modal').modal('hide');

    })

    //红色框关闭按钮
    $('#tip').on('click','.close',function(){

        //红条隐藏
        $('#tip').hide();

    })

    /*-----------------------------------其他方法-----------------------------------------*/

    //基线数据
    function baselineData(){

        $('#theLoading').modal('show');

        var  prm = {

            //基线类别
            type:$('#keyWord-baseline-modal').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRBaseline/GetDRBaselineDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = [];

                var str = '';

                if(result.code == -2){

                    console.log('基线获取：暂无数据' );

                }else if(result.code == -1){

                    console.log('基线获取：异常错误' );

                }else if(result.code == -3){

                    console.log('基线获取：参数错误' );

                }else if(result.code == -4){

                    console.log('基线获取：内容已存在' );

                }else if(result.code == -6){

                    console.log('基线获取：没有权限' );

                }else if(result.code == 0){

                    arr = result.drbls;

                }

                for(var i=0;i<arr.length;i++){

                    str += '<option value="' + arr[i].id + '">' + arr[i].name + '</option>'

                }

                $('#baseline').empty().append(str);


            },

            error:_errorFun

        })

    }

    //获取区域
    function districtData(){

        $('#theLoading').modal('show');

        var prm = {

            keyword:$('#keyWord-district-modal').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRDistrict/GetDRDistrictDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = [];

                if(result.code == -2){

                    console.log('区域获取：暂无数据')

                }else if(result.code == -1){

                    console.log('区域获取：异常错误');

                }else if(result.code == -3){

                    console.log('区域获取：参数错误');

                }else if(result.code == -4){

                    console.log('区域获取：内容已存在');

                }else if(result.code == -6) {

                    console.log('区域获取：没有权限');

                }else if(result.code == 0){

                    arr = result.dists.reverse();
                }

                //表格
                _jumpNow($('#district-table'),arr);

            },

            error:_errorFun

        })

    }

    //获取套餐
    function mealData(){

        $('#theLoading').modal('show');

        var prm = {

            //产品类型
            libraryType:$('#product-type').val(),
            //计价方式
            priceMode:$('#valuation-method').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRLibrary/GetDRLibraryDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = [];

                if(result.code == -2){

                    console.log('套餐获取：暂无数据');

                }else if(result.code == -1){

                    console.log('套餐获取：异常错误');

                }else if(result.code == -3){

                    console.log('套餐获取：参数错误');

                }else if(result.code == -4){

                    console.log('套餐获取：内容已存在');

                }else if(result.code == -6){

                    console.log('套餐获取：没有权限');

                }else if(result.code == 0){

                    arr = result.libs.reverse();

                }

                _jumpNow($('#set-meal-table'),arr);

            },

            error:_errorFun

        })

    }

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#plan-name').val() == '' || $('#plan-st').val() == '' || $('#plan-et').val() == '' || $('#reduce-load').val() == '' ||$('#district').val() == '' || _thisMealArr.length ==0){

            $('#theLoading').modal('hide');

            topTipBar('请填写必填项!')


        }else{

            //验证错误
            var error = $('#commentForm').find('.error');

            if(error.length != 0){

                if(error.css('display') != 'none'){

                    $('#theLoading').modal('hide');

                    topTipBar('请填写正确格式!');

                }else{

                    //验证时间是否是同一天
                    if(timeSameDay($('#plan-st').val(),$('#plan-et').val())){

                        //时间大小验证
                        if(timeCompare($('#plan-st').val(),$('#plan-et').val())){

                            $('#tip').hide();

                            //验证通过
                            fun();

                        }else{

                            $('#theLoading').modal('hide');

                            topTipBar('结束时间必须大于开始时间!')

                        }

                    }else{

                        $('#theLoading').modal('hide');

                        topTipBar('开始时间和结束时间必须是同一天!')

                    }

                }

            }else{

                //验证时间是否是同一天
                if(timeSameDay($('#plan-st').val(),$('#plan-et').val())){

                    //时间大小验证
                    if(timeCompare($('#plan-st').val(),$('#plan-et').val())){

                        $('#tip').hide();

                        //验证当前区域是否绑定了设备和资源
                        if(_HRArr.length == 0){

                            $('#theLoading').modal('hide');

                            topTipBar('当前选中的区域没有绑定户号和设备，请重新选择!')

                        }else{

                            //验证通过
                            fun();

                        }

                    }else{

                        $('#theLoading').modal('hide');

                        topTipBar('结束时间必须大于开始时间!')

                    }

                }else{

                    $('#theLoading').modal('hide');

                    topTipBar('开始时间和结束时间必须是同一天!')

                }

            }


        }

    }

    //根据id获取详情（编辑时候用）
    function bind(id){

        var prm = {

            planId:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetDRPlanById',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //绑定数据
                    //事件名称
                    $('#plan-name').val(result.plan.planName);
                    //开始时间
                    $('#plan-st').val(result.plan.startDate);
                    //结束时间
                    $('#plan-et').val(result.plan.closeDate);
                    //消减负荷
                    $('#reduce-load').val(result.plan.reduceLoad);
                    //描述
                    $('#create-remark').val(result.plan.memo);
                    //基线
                    $('#baseline').val(result.plan.baselineId);
                    //区域选择(文本)
                    $('#district').val(result.plan.districtName);
                    //区域选择（值）
                    _thisDistrict = result.plan.districtId;
                    //选择产品库（文本）
                    var str = '';
                    //选择产品库（值）
                    _thisMealArr = [];

                    for(var i=0;i<result.plan.librarys.length;i++){

                        if(i==result.plan.librarys.length-1){

                            str += result.plan.librarys[i].name;

                        }else{

                            str += result.plan.librarys[i].name + '、'

                        }

                        _thisMealArr.push(result.plan.librarys[i].id)

                    }

                    //赋值
                    $('#set-meal').val(str);

                }else if(result.code == -2){

                    _topTipBar('暂无数据');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('参数错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == -6){

                    _topTipBar('抱歉，您没有操作权限');

                }

            }

        })

    }

    //创建账户(flag代表是否传id)
    function sendOption(url,seccessMeg,flag){

        var prm = {

            //事件名称
            planName:$('#plan-name').val(),
            //事件开始时间
            startDate:$('#plan-st').val(),
            //事件结束时间
            closeDate:$('#plan-et').val(),
            //消减负荷
            reduceLoad:$('#reduce-load').val(),
            //创建人
            userId:sessionStorage.ADRS_UserId,
            //基线Id
            baselineId:$('#baseline').val(),
            //区域Id
            districtId:_thisDistrict,
            //描述
            memo:$('#create-remark').val(),
            //产品库(套餐)列表
            librarys:_thisMealArr,
            //角色
            userRole:sessionStorage.ADRS_UserRole

        };

        if(flag){

            //id
            prm.planId = id;
            //状态
            prm.planState = state;
        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + url,

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    if(flag){

                        window.location.href = 'planPublish.html'

                    }else{

                        //初始化

                        $('.cmxform').find('input').val('');

                        $('.cmxform').find('select').val(1);

                        $('.cmxform').find('textarea').val('');

                        window.location.href = 'planPublish.html'

                    }
                    
                    //模态框消失
                    $('#create-Modal').modal('hide');

                }else if(result.code == -2){

                    _topTipBar('暂无数据');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('参数错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == -5){

                    _topTipBar('输入有误');

                }else if(result.code == -6){

                    _topTipBar('抱歉，您没有操作权限');

                }

            },

            error:_errorFun


        })

    }

    //时间比大小
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

    //验证时间是否是同一天的
    function timeSameDay(st,et){

        var stValue = moment(st).format('YYYY-MM-DD');

        var etValue = moment(et).format('YYYY-MM-DD');

        if(stValue == etValue){

            return true;

        }else{

            return false;

        }

    }

    //顶置提示
    function topTipBar(str){

        $('#tip').find('span').remove();

        $('#tip').find('i').after('<span style="margin-left: 20px;">' + str + '</span>');

        $('#tip').show();

    }

    //显示户号和资源
    function HHResFormat(id,innerTable,HHDom,ResDom){

        _HRArr = [];

        $('#theLoading').modal('show');

        //获取当前选中的区域是否有户号和resource
        var prm = {

            districtId:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlanMade/GetAcctResDsByDistrictId',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = [];

                if(result.code == 0){

                    arr = result.acctRs;

                    for(var i=0;i<result.acctRs.length;i++){

                        _HRArr.push(result.acctRs[i]);

                    }

                }if(result.code == -2){

                    console.log('暂时没有户号资源数据');

                }else if(result.code == -1){

                    conosle.log('异常错误');

                }else if(result.code == -3){

                    console.log('参数错误');

                }else if(result.code == -4){

                    console.log('内容已存在');

                }else if(result.code == -6){

                    console.log('抱歉，您没有操作权限');

                }

                _jumpNow(innerTable,arr);

                HHDom.html(arr.length);

                ResDom.html(arr.length);

            },

            error:_errorFun1

        })

    }

    //显示户号，资源
    function HRData(){

        var tip = '<div style="text-align: left;line-height: 30px;text-indent: 20px;">当前区域下共有<span class="eprHH"></span>户号、<span class="eprRes"></span>资源</div>'

        var table = '<table class="table table-striped  table-advance table-hover"></table>'

        //最外边的框
        var block = '<div style="border: 1px solid #68a1fd;">';

        var blocks = '</div>';

        return block + tip + table + blocks;

    }

    return {
        init: function () {

        }
    }

}()