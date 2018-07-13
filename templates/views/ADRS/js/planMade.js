var PlanMade = function () {

    //条件刷新标识
    var _isReloadData = false;

    //记录当前选中的userId
    var _thisID = '';

    //当前选择的基线
    var _thisBaseline = '';

    //当前选中的区域
    var _thisDistrict = '';

    //当前选中的套餐
    var _thisMealArr = [];

    //时间插件
    _timeYMDComponentsFun11($('.datatimeblock'));

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

                return '<div class="checker"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'区域id',
            data:'id'
        },
        {
            title:'区域名称',
            data:'name'
        },
        {
            title:'父级id',
            data:'pId'
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
        },
        {
            title:'是否有效',
            data:'isDelName'
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

                return '<div class="checker"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'产品ID',
            data:'id'
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
            title:'提前通知时间',
            data:'noticeHour'
        },
        {
            title:'产品描述',
            data:'memo'
        },
        {
            title:'创建时间',
            data:'createDate'
        },
        {
            title:'更新时间',
            data:'createDate'
        }

    ]

    _tableInit($('#set-meal-table'),mealCol,2,true,'','','','');

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

                required: true

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

    /*-----------------------------------按钮事件----------------------------------------*/

    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //【创建用户】
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
        $('.select-button').show();


    })

    //创建用户【确定按钮】
    $('#create-Modal').on('click','.dengji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRPlanMade/DRPlanRegister','创建成功！');

        })
    })

    //【选择基线】
    $('.select-baseline').click(function(){

        //初始化
        $('#product-type').val(0);

        $('#valuation-method').val(0);

        //模态框
        _moTaiKuang($('#baseline-Modal'),'基线','','','','选择');

        //数据
        baselineData()

    })

    //基线条件选择【查询】
    $('#selected-baseline-modal').click(function(){

        baselineData();

    })

    //选择基线【tr】
    $('#baseline-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#baseline-table tbody').find('tr').removeClass('tables-hover');

            $('#baseline-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#baseline-table tbody').find('tr').removeClass('tables-hover');

            $('#baseline-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //选择基线【选择】
    $('#baseline-Modal').on('click','.btn-primary',function(){

        var nowSelected = $('#baseline-table tbody').find('.tables-hover');

        _thisBaseline = nowSelected.children().eq(1).html();

        var name = nowSelected.children().eq(2).html();

        $('#baseline').val(name);

        $('#baseline-Modal').modal('hide');

    })

    //【选择区域】
    $('.select-district').click(function(){

        //初始化
        $('#keyWord-district-modal').val('');

        //模态框
        _moTaiKuang($('#district-Modal'),'区域',false,'','','选择');

        //数据
        districtData();

    })

    //区域条件选择【查询】
    $('#selected-district-modal').click(function(){

        districtData();

    })

    //选择基线【tr】
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

    })

    //选择区域【选择】
    $('#district-Modal').on('click','.btn-primary',function(){

        var nowSelected = $('#district-table tbody').find('.tables-hover');

        _thisDistrict = nowSelected.children().eq(1).html();

        var name = nowSelected.children().eq(2).html();

        $('#district').val(name);

        $('#district-Modal').modal('hide');

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

            var id = nowSelected.eq(i).children().eq(1).html();

            var name = nowSelected.eq(i).children().eq(2).html();

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

    /*-----------------------------------其他方法-----------------------------------------*/

    //模态框初始化
    function createInit(){

        //清空
        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val(1);

        $('#create-Modal').find('textarea').val('');

        //当前选中数据的id
        _thisID = '';

        //当前选中的基线
        _thisBaseline = '';

        //当前选中的套餐
        _thisMealArr = [];

    }

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

                if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }else if(result.code == 0){

                    arr = result.drbls.reverse();

                }

                _jumpNow($('#baseline-table'),arr);

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

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

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

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

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
        if($('#plan-name').val() == '' || $('#plan-st').val() == '' || $('#plan-et').val() == '' || $('#reduce-load').val() == '' ){

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

    //创建用户(flag代表是否传id)
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
            baselineId:_thisBaseline,
            //区域Id
            districtId:_thisDistrict,
            //描述
            memo:$('#create-remark').val(),
            //产品库(套餐)列表
            librarys:_thisMealArr

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

                //重载数据标识
                _isReloadData = true;

                if(result.code == 0){

                    //创建成功
                    _moTaiKuang($('#tip-Modal'),'提示',true,true,seccessMeg,'');

                    //模态框消失
                    $('#create-Modal').modal('hide');

                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }

            },

            error:_errorFun


        })

    }

    return {
        init: function () {

        }
    }

}()