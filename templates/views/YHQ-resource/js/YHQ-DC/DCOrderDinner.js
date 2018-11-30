$(function(){

    //存放所有数据
    var _allData = [];

    //获取所有菜品
    var _mealArr = [];

    //获取菜品分类
    MealType();

    //暂存当前餐厅
    var _restaurantArr = [];

    //获取餐厅
    RestaurantType();

    //获取菜品列表
    //mealData();

    //当前选中的菜品信息
    var _thisOrder = [];

    //暂存所有员工信息
    var _userArr = [];

    //获取所有员工
    userData();

    //当前选中的订单号
    var _thisId = '';

    //判断当前管理菜品是否可以点击操作
    var _manageMealFlag = false;

    //判断当前订餐人按钮是否可选择
    var _selectUserFlag = false;

    /*-------------------------------时间插件------------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    //模态框日期选择
    $('.DC-time').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: true,
        format: 'yyyy-mm-dd',
        forceParse: 0,
        autoclose: 1

    }).on('change',function(picker){

        var dom = $(picker.target).parents('.time-tool-block').next().next();

        dom.hide();

        $(picker.target).next('.error').hide();

    })

    //送餐时间
    //_timeComponentsFun($('.DC-time1'));
    $('.DC-time1').datetimepicker({
        language:  'zh-CN',//此处修改
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        format : "hh:ii",//日期格式
        startView: 1,  //1时间  2日期  3月份 4年份
        forceParse: 0,
        maxView : 'hour'
    }).on('change',function(picker, values, displayValues){

        var dom = $(picker.target).parents('.time-tool-block').next().next();

        dom.hide();

        $(picker.target).next('.error').hide();
    });

    /*------------------------------------------表单验证-----------------------------------*/

    $('#commentForm').validate({

        rules:{
            //餐厅
            'DC-restaurant':{

                required: true

            },
            //订餐时间
            'time':{

                isEmpty: true,

                isDate:true

            },
            //订餐人
            'DC-person':{

                required: true

            },
            //订餐人类型
            'DC-person-type':{

                required: true

            },
            //订餐电话
            'DC-phone':{

                required: true,

                phoneNumFormat:true

            },
            //三餐类型
            'three-meal':{

                required: true

            },
            //送餐时间
            'sendTime':{

                isEmpty: true,

                isTimeFormat:true

            },
            //送餐地点
            'DC-location':{

                required: true

            }

        },
        messages:{

            //餐厅
            'DC-restaurant':{

                required: '餐厅是必选字段'

            },
            //订餐时间
            'time':{

                isEmpty: '请选择订餐时间',

                isDate:'订餐时间格式为 YYYY-MM-DD'

            },
            //订餐人
            'DC-person':{

                required: '请选择订餐人'

            },
            //订餐人类型
            'DC-person-type':{

                required: '请选择订餐人类型'

            },
            //订餐电话
            'DC-phone':{

                required: '请输入订餐电话',

                phoneNumFormat:'请输入电话格式'

            },
            //三餐类型
            'three-meal':{

                required: '请选择三餐类型'

            },
            //送餐时间
            'sendTime':{

                isEmpty: '请选择送餐时间',

                isTimeFormat:'送餐时间格式为 HH:mm'

            },
            //送餐地点
            'DC-location':{

                required: '请输入送餐地点'

            }

        }

    });

    function validform(){

        return $('#commentForm').validate({

            rules:{
                //餐厅
                'DC-restaurant':{

                    required: true

                },
                //订餐时间
                'time':{

                    isEmpty: true,

                    isDate:true

                },
                //订餐人
                'DC-person':{

                    required: true

                },
                //订餐人类型
                'DC-person-type':{

                    required: true

                },
                //订餐电话
                'DC-phone':{

                    required: true,

                    phoneNumFormat:true

                },
                //三餐类型
                'three-meal':{

                    required: true

                },
                //送餐时间
                'sendTime':{

                    isEmpty: true,

                    isTimeFormat:true

                },
                //送餐地点
                'DC-location':{

                    required: true

                }

            },
            messages:{

                //餐厅
                'DC-restaurant':{

                    required: '餐厅是必选字段'

                },
                //订餐时间
                'time':{

                    isEmpty: '请选择订餐时间',

                    isDate:'订餐时间格式为 YYYY-MM-DD'

                },
                //订餐人
                'DC-person':{

                    required: '请选择订餐人'

                },
                //订餐人类型
                'DC-person-type':{

                    required: '请选择订餐人类型'

                },
                //订餐电话
                'DC-phone':{

                    required: '请输入订餐电话',

                    phoneNumFormat:'请输入电话格式'

                },
                //三餐类型
                'three-meal':{

                    required: '请选择三餐类型'

                },
                //送餐时间
                'sendTime':{

                    isEmpty: '请选择送餐时间',

                    isTimeFormat:'送餐时间格式为 HH:mm'

                },
                //送餐地点
                'DC-location':{

                    required: '请输入送餐地点'

                }

            }

        });

    }


    /*------------------------------------------表格初始化---------------------------------*/

    var col = [

        {
            title:'订单号',
            data:'ordered'
        },
        {
            title:'订餐日期',
            data:'orderdt',
            render:function(data, type, full, meta){

                return data.split('T')[0]

            }

        },
        {
            title:'订餐人',
            data:'userName'
        },
        {
            title:'订单状态',
            data:'orderZht',
            render:function(data, type, full, meta){

                return DCStatus(data)

            }
        },
        {
            title:'三餐类型',
            data:'mmn'
        },
        {
            title:'电话',
            data:'phone'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '<span class="option-button option-see option-in" data-attr="' + full.ordered + '">' + '详情</span>';



                if(full.orderZht == 10){

                    //确认+完成+取消+编辑+详情

                            //编辑
                    str += '<span class="option-button option-edit option-in" data-attr="' + full.ordered + '">' + '编辑</span>' +
                            //确认
                            '<span class="option-button option-confirm option-in" data-attr="' + full.ordered + '">' + '确认接单</span>' +
                            //完成
                            '<span class="option-button option-complete option-in" data-attr="' + full.ordered + '">' + '完成</span>' +
                            //取消
                            '<span class="option-button option-cancel option-in" data-attr="' + full.ordered + '">' + '取消</span>'


                }else if(full.orderZht == 30){

                    //完成 + 取消
                            //完成
                    str += '<span class="option-button option-complete option-in" data-attr="' + full.ordered + '">' + '完成</span>' +
                            //取消
                            '<span class="option-button option-cancel option-in" data-attr="' + full.ordered + '">' + '取消</span>'


                }else if(full.orderZht == 40){

                    //完成
                    str += '<span class="option-button option-complete option-in" data-attr="' + full.ordered + '">' + '完成</span>'

                }


                return str;


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    //菜品列表
    var mealCol = [
        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                //return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox"                                 value=""></span></div>'

                var num = Number(full.totalQuantity) - Number(full.saleQuantity);

                return '<img src="../YHQ-resource/img/addMeal.png" class="order-dinner-table-add" data-num="' + num + '" data-attr="' + full.id + '" style="width: 15px;cursor: pointer">'

            }
        },
        {
            title:'菜品图片',
            data:'img',
            render:function(data, type, full, meta){

                if(data == ''){

                    return '暂无图片'

                }else{

                    var url = _urls.split('api')[0] + data;

                    return '<img src="' + url + '" style="height: 50px;">'

                }

            }


        },
        {
            title:'菜品名称',
            data:'cookname',
            className:'cookname',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.itemid + '">' + data + '</span>'

            }

        },
        {
            title:'菜品类型',
            data:'lxname'
        },
        {
            title:'价格',
            data:'price',
            className:'price'
        },
        {
            title:'适合人群',
            data:'fitperson'
        },
        {
            title:'不适合人群',
            data:'unfitperson'
        }

    ]

    _tableInit($('#meal-table'),mealCol,'2','','','','','','',true);

    //订餐人列表
    var userCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'姓名',
            data:'userName'
        },
        {
            title:'工号',
            data:'userNum'
        },
        {
            title:'所属部门',
            data:'departName'
        },
        {
            title:'职位',
            data:'roleName'
        },
        {
            title:'联系方式',
            data:'phone'
        }

    ]

    _tableInitSearch($('#user-table'),userCol,'2','','','','','',10,'','','',true);

    conditionSelect();

    /*------------------------------------------按钮事件----------------------------------*/

    //新增订单
    $('#createBtn').click(function(){

        _manageMealFlag = true;

        //可操作
        abledOption();

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'确认订单','','','','确认订单');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('queren').removeClass('bianji').removeClass('quxiao').removeClass('wancheng').addClass('dengji');

        //菜品按钮显示
        $('#modal-select-meal').html('选择菜品');

    });

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){

            //验证是否选择菜品
            if(_thisOrder.length == 0){

                $('#meal-tip').show();

            }else{

                $('#meal-tip').hide();

                sendData('YHQDC/orderlistAdd',$('#create-Modal').children(),false,function(result){

                    if(result.code == 99){

                        $('#create-Modal').modal('hide');

                        conditionSelect();

                    }

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

                })


            }

        }

    })

    //查询数据
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        $('#spDT').val(st);

        $('#epDT').val(nowTime);

    })

    //点击放大镜选择菜品
    $('#modal-select-meal').click(function(){

        //首先判断是否可操作
        if(!_manageMealFlag){

            return;

        }

        //首先确认订餐
        if( $('#DC-restaurant').val() == '' ){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择餐厅','');

            return false;

        }

        //首先确认订餐时间
        if( $('#time').val() == '' ){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择订餐日期','');

            return false;

        }

        //确认三餐类型
        if( $('#three-meal').val() == '' ){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择三餐类型','');

            return false;

        }

        //初始化
        $('#DC-type-modal').val(-1);

        $('#DC-name-modal').val('');

        //模态框
        _moTaiKuang($('#meal-Modal'),'菜品列表','','','','选择');

        //获取菜品列表
        mealData();

        //自动生成已选择菜品列表
        //总价
        var mealMoney = 0;

        //根据数组，写ui
        for(var i=0;i<_thisOrder.length;i++){

            mealMoney += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

        }

        $('.order-already').empty().append(arrMealAlready2(_thisOrder));

        $('#mealMoney').html(mealMoney);

    })

    //点击表格中的选择加号，添加到右边的框中
    $('#meal-table tbody').on('click','.order-dinner-table-add',function(){

        var currentTr = $(this).parents('tr');

        var obj = {};

        //排班id
        obj.pbid = currentTr.find('img').attr('data-attr');

        //菜品名称
        obj.name = currentTr.find('.cookname').children().html();

        //菜品id
        obj.id = currentTr.find('.cookname').children().attr('data-id');

        //单价
        obj.prince = currentTr.find('.price').html();

        //份数
        obj.num = 1;

        //菜品剩余份数
        obj.surplus = currentTr.find('img').attr('data-num');

        if(_thisOrder.length == 0){

            _thisOrder.push(obj);

        }else {

            //标记当前数组中是否有这个id
            var isExistId = true;

            for (var i = 0; i < _thisOrder.length; i++) {

                if (_thisOrder[i].id == obj.id) {

                    isExistId = false;

                    break;

                }

            }

            if (isExistId) {

                _thisOrder.push(obj);

            }
        }

        //总价
        var mealMoney = 0;

        //根据数组，写ui
        for(var i=0;i<_thisOrder.length;i++){

            mealMoney += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

        }

        $('.order-already').empty().append(arrMealAlready2(_thisOrder));

        $('#mealMoney').html(mealMoney);

    })

    //菜品清单中加减按钮
    $('.order-already').on('click','.order-dinner-num',function(){

        //首先确定当前按钮是增加还是减少的按钮
        var className = $(this).attr('class');

        //当前操作的inputDom
        var inputDom = $(this).parent('.order-meal-num').find('input');

        //获取当前的值
        var value = inputDom.val();

        //当前按钮操作的菜品id
        var id = inputDom.attr('attr-id');

        if(className.indexOf('order-dinner-add')>-1){

            var num = $(this).attr('attr-num');

            //是增加按钮

            value ++ ;

            //console.log('value'+value);

            if(value == num || value>num){

                value = num;

            }


        }else if(className.indexOf('order-dinner-sub')>-1){

            //是减少按钮

            value --;

        }

        inputDom.val(value);

        //如果当前value=0;移除当前li

        if(value == 0){

            $(this).parents('li').empty();

        }

        //更改数组中的数量
        for(var i=0;i<_thisOrder.length;i++){

            if(id == _thisOrder[i].id){

                _thisOrder[i].num = value;

            }

        }

        //如果数量为0，删除该数组
        for(var i=0;i<_thisOrder.length;i++){

            if(_thisOrder[i].num == 0){

                _thisOrder.remove(_thisOrder[i]);

            }

        }


        //总价
        var mealMoney = 0;

        //根据数组，写ui
        for(var i=0;i<_thisOrder.length;i++){

            mealMoney += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

        }

        $('#mealMoney').html(mealMoney);



    })

    //清除已选菜品
    $('#emptyAllMeal').click(function(){

        //给个提示
        _moTaiKuang($('#empty-Modal'),'提示','',true,'确定要清除已选菜品吗？','确定');

    })

    $('#empty-Modal').on('click','.btn-primary',function(){

        $('.order-already').empty();

        $('#mealMoney').html(0.00);

        _thisOrder = [];

        $('#empty-Modal').modal('hide');

    })

    //点击确定已选中的菜品列表
    $('#meal-Modal').on('click','.btn-primary',function(){

        $('#meal-Modal').modal('hide');

        //根据数组，绘制清单
        //总价
        var mealMoney = 0;

        //根据数组，写ui
        for(var i=0;i<_thisOrder.length;i++){

            mealMoney += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

        }

        $('.order-already-modal').empty().append(arrMealAlready(_thisOrder));

        $('#mealMoneyModal').val(mealMoney.toFixed(2));


    })

    //选择订餐人

    $('.modal-select-user').click(function(){

        if(_DCquery){

            _isClickTr = true;

            //模态框
            _moTaiKuang($('#user-Modal'),'员工列表','','','','确定');

            _datasTable($('#user-table'),_userArr);

        }

        if(_selectUserFlag){

            _isClickTr = true;

            //模态框
            _moTaiKuang($('#user-Modal'),'员工列表','','','','确定');

            _datasTable($('#user-table'),_userArr);

        }else{

            return ;

        }

    })


    //模态框关闭
    $('#user-Modal').on('hidden.bs.modal',function(){

        _isClickTr = false;

    })

    //确定订餐人
    $('#user-Modal').on('click','.btn-primary',function(){

        var currentTr = $('#user-table tbody').find('.tables-hover');

        if(currentTr.find('input').length >0){

            var name = currentTr.children().eq(1).html();

            var num = currentTr.children().eq(2).html();

            var phone = currentTr.children().eq(5).html();

            $('#DC-person').val(name);

            $('#DC-person').attr('data-num',num);

            $('#DC-phone').val(phone);

            $('#user-Modal').modal('hide');

            $('#DC-person').next().hide();

            if($('#DC-personCon')){

                $('#DC-personCon').val(name);

                $('#DC-personCon').attr('data-num',num);

            }

        }else{

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择订餐人','');

        }


    })

    //编辑
    $('.table tbody').on('click','.option-edit',function(){

        _manageMealFlag = true;

        //初始化
        createModeInit();

        //赋值id
        _thisId = $(this).attr('data-attr');

        //模态框
        _moTaiKuang($('#create-Modal'),'订单编辑','','','','保存');

        //绑定数据
        getDatil($(this).attr('data-attr'));

        //类
        $('#create-Modal').find('.btn-primary').removeClass('queren').removeClass('dengji').removeClass('quxiao').removeClass('wancheng').addClass('bianji');

        //可操作
        abledOption();

        //菜品按钮显示
        $('#modal-select-meal').html('管理菜品');

    })

    //编辑【确定】按钮
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form()){

            //验证是否选择菜品
            if(_thisOrder.length == 0){

                $('#meal-tip').show();

            }else{

                $('#meal-tip').hide();

                sendData('YHQDC/orderlistUpdate',$('#create-Modal').children(),true,function(result){

                    if(result.code == 99){

                        $('#create-Modal').modal('hide');

                        conditionSelect();

                    }

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

                })


            }

        }

    })

    //更改送餐费的内容，总计联动
    $('.sendFee').on('input','input',function(){

        if(isNaN(Number($(this).val()))){

            //不是数字

        }else{

            //是数字

            if(Number($(this).val())>=0){

                var money = 0;

                //重新计算总费用
                for(var i=0;i<_thisOrder.length;i++){

                    money += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

                }

                money += Number($(this).val());

            }

            $('#mealMoneyModal').val(money.toFixed(2));

        }






    })

    //删除
    $('.table tbody').on('click','.option-del',function(){

        //初始化
        createModeInit();

        //赋值id
        _thisId = $(this).attr('data-attr');

        //模态框
        _moTaiKuang($('#create-Modal'),'确定要删除吗？','','','','删除');

        //绑定数据
        getDatil($(this).attr('data-attr'));

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('dengji').addClass('shanchu');

        //不可操作
        disabledOption();

        //菜品按钮显示
        $('#modal-select-meal').html('已选菜品');

    })

    //删除【确定】按钮
    $('#create-Modal').on('click','.shanchu',function(){

        sendData('YHQDC/orderlistDelete',$('#create-Modal').children(),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    })

    //查看
    $('.table tbody').on('click','.option-see',function(){

        //初始化
        createModeInit();

        //赋值id
        _thisId = $(this).attr('data-attr');

        //模态框
        _moTaiKuang($('#create-Modal'),'订单详情',true,'','','');

        //绑定数据
        getDatil($(this).attr('data-attr'));

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //不可操作
        disabledOption();

        //菜品按钮显示
        $('#modal-select-meal').html('已选菜品');

    })

    //条件查询菜品
    $('#selectBtn-modal').click(function(){

        var prm = {

            //餐厅
            dinningroomid:1,

            //菜名
            cookname:$('#DC-name-modal').val(),

            //菜品类型
            lx:$('#DC-type-modal').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/RetrunDinningbookList',prm,false,function(result){

            if(result.code == 99){

                _datasTable($('#meal-table'),result.data);

            }

        })

    })

    //tab选择
    $('.dinnerTab').on('click','li',function(){

        var arr = [];

        var dinningNum = $(this).children().attr('data-attr');

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].dinningroomid == dinningNum){

                arr.push(_allData[i]);

            }

        }

        _datasTable($('#table'),arr);

    })

    //确认
    $('.table tbody').on('click','.option-confirm',function(){

        //初始化
        createModeInit();

        //赋值id
        _thisId = $(this).attr('data-attr');

        //模态框
        _moTaiKuang($('#create-Modal'),'确认订单','','','','确认');

        //绑定数据
        getDatil($(this).attr('data-attr'));

        //类(编辑，登记、取消、确认、完成)
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').removeClass('quxiao').removeClass('wancheng').addClass('queren');

        //不可操作
        disabledOption();

        //菜品按钮显示
        $('#modal-select-meal').html('已选菜品');

    })

    //确认【确定】按钮
    $('#create-Modal').on('click','.queren',function(){

        var prm = {

            //订单号
            ordered:_thisId

        }

        _mainAjaxFunCompleteNew('post','YHQDC/AffirmOrder',prm,$('#create-Modal').children(),function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })


    })

    //完成
    $('.table tbody').on('click','.option-complete',function(){

        //初始化
        createModeInit();

        //赋值id
        _thisId = $(this).attr('data-attr');

        //模态框
        _moTaiKuang($('#create-Modal'),'完成订单','','','','完成');

        //绑定数据
        getDatil($(this).attr('data-attr'));

        //类(编辑，登记、取消、确认、完成)
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').removeClass('quxiao').removeClass('queren').addClass('wancheng');

        //不可操作
        disabledOption();

        //菜品按钮显示
        $('#modal-select-meal').html('已选菜品');

        //支付按钮显示
        $('.payType').show();

    })

    //完成【确定】按钮
    $('#create-Modal').on('click','.wancheng',function(){

        var prm = {

            //订单号
            ordered:_thisId,
            //支付方式
            payType: $('.radioBlock').find('input:checked').attr('data-value')
        }

        _mainAjaxFunCompleteNew('post','YHQDC/AccomplishOrder',prm,$('#create-Modal').children(),function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })


    })

    //取消
    $('.table tbody').on('click','.option-cancel',function(){

        //初始化
        createModeInit();

        //赋值id
        _thisId = $(this).attr('data-attr');

        //模态框
        _moTaiKuang($('#create-Modal'),'取消订单','','','','取消订单');

        //绑定数据
        getDatil($(this).attr('data-attr'));

        //类(编辑，登记、取消、确认、完成)
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').removeClass('wancheng').removeClass('queren').addClass('quxiao');

        //不可操作
        disabledOption();

        //菜品按钮显示
        $('#modal-select-meal').html('已选菜品');

    })

    //取消提示
    $('#create-Modal').on('click','.quxiao',function(){

        var str = '确定要取消订单号为 <span style="margin: 0 10px;font-weight: bold">' + _thisId + '</span>的订单吗？'

        _moTaiKuang($('#cancel-Modal'),'提示',false,true,str,'确定取消');

    })

    //取消【确定】按钮
    $('#cancel-Modal').on('click','.btn-primary',function(){

        var prm = {

            //订单号
            ordered:_thisId

        }

        _mainAjaxFunCompleteNew('post','YHQDC/cancelOrder',prm,$('#create-Modal').children(),function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    })

    $('#create-Modal').on('hidden.bs.modal',function(){

        _manageMealFlag = false;

    })

    //根据当前选中的订餐人类型确定订餐人是选择还是填写
    $('#DC-person-type').change(function(){

        _selectUserFlag = false;

        var thisValue = $(this).val();

        //初始化
        $('#DC-person').val('');

        $('#DC-person').removeAttr('data-num');

        if( thisValue == 1 ){

            _selectUserFlag = true;

            //医护订餐，订餐人只可选择  modal-select-show
            $('#DC-person').attr('readOnly',true);

            $('#modal-select-user').addClass('modal-select-show');


        }else if( thisValue == 2 ){

            //病户订餐，订餐人只能填写，并且userNum填写为电话
            $('#DC-person').attr('readOnly',false);

            $('#modal-select-user').removeClass('modal-select-show');

        }else{

            $('#DC-person').attr('readOnly',true);

            $('#modal-select-user').removeClass('modal-select-show');

        }

    })

    /*------------------------------------------其他方法-----------------------------------*/

    //模态框初始化
    function createModeInit(){

        //时间格式
        $('.time-seat').hide();

        $('#create-Modal').find('input').val('');

        //$('#create-Modal').find('select').val('');

        $('#create-Modal').find('textarea').val('');

        //模态框中的时间默认
        $('#time').val(nowTime);

        //将所有label .error验证隐藏
        var label = $('#create-Modal').find('label');

        for(var i=0;i<label.length;i++){

            var attr = $(label).eq(i).attr('class')

            if(attr){

                if(attr.indexOf('error')>-1){

                    label.eq(i).hide();

                }

            }

        }

        $('.sendFee').hide();

        //当前选中的菜品清单
        $('.order-already-modal').empty();

        //当前总计
        $('#mealMoneyModal').val(0.00);

        $('#meal-tip').hide();

        $('#DC-person').removeAttr('data-num');

        //菜品数组清空
        _thisOrder = [];

        $('.order-already').empty();

        //switch初始化

        $('.switch input').bootstrapSwitch('destroy');

        $('.switch input').bootstrapSwitch({

            size : "small",
            state:false,
            onText:'是',
            offText:'否',
            onSwitchChange:function(event,state){

                var fee = 0;

                for(var i=0;i<_restaurantArr.length;i++){

                    if(_restaurantArr[i].id == $('#DC-restaurant').val()){

                        fee = _restaurantArr[i].sendfee;

                    }

                }

                //送餐费默认
                $('.sendFee').find('input').val(fee);

                var money = 0;

                for(var i=0;i<_thisOrder.length;i++){

                    money += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

                }

                if(state==true){

                    $(this).val("1");

                    $('.sendFee').show();

                    //计算总价
                    var moneyT = Number(money) + Number($('.sendFee').find('input').val());

                    $('#mealMoneyModal').val(moneyT.toFixed(2));


                }else{

                    $(this).val("0");

                    $('.sendFee').hide();

                    $('#mealMoneyModal').val(money.toFixed(2));


                }
            }

        });

        //订餐人类型
        $('#DC-person-type').val('');

        //三餐类型
        $('#three-meal').val('');

        //支付方式隐藏
        $('.payType').hide();

        //当前操作是否可选择订餐人
        _selectUserFlag = false;

    }

    //条件查询
    function conditionSelect(){

        var prm = {
            //餐厅
            //dinningroomid:$(''),
            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //departnum
            departnum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQDC/Returnorderlist',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                var arr = [];

                var dinningNum = $('.dinnerTab').children('.active').children().attr('data-attr');

                for(var i=0;i<_allData.length;i++){

                    if(_allData[i].dinningroomid == dinningNum){

                        arr.push(_allData[i]);

                    }

                }

                _datasTable($('#table'),arr);

            }

        })


    }

    //操作发送数据
    function sendData(url,el,flag,successFun){

        //菜品

        var arr = [];

        for(var i=0;i<_thisOrder.length;i++){

            var obj = {};

            //餐次id
            obj.dayMenuid = _thisOrder[i].pbid;

            //菜品id
            obj.itemid = _thisOrder[i].id;

            //价格
            obj.price = _thisOrder[i].prince;

            //数量
            obj.num = _thisOrder[i].num;

            if(flag){

                obj.ordered = _thisId;

            }

            arr.push(obj);

        }

        //判断当前订餐人id,如果当前医护订餐，userid为医护人员内部id，如果时病户订餐，userid为电话
        var userId = '';

        if( $('#DC-person-type').val() == 1 ){

            //医护订餐
            userId = $('#DC-person').attr('data-num')

        }else if( $('#DC-person-type').val() == 2 ){

            //病户订餐
            userId = $('#DC-phone').val();

        }


        var prm = {

            //餐厅id
            dinningroomid:$('#DC-restaurant').val(),
            //日期
            orderdt:$('#time').val(),
            //订餐人id
            userNum:userId,
            //订餐人name
            userName:$('#DC-person').val(),
            //总计
            Paysum:$('#mealMoneyModal').val(),
            //三餐类型  -
            mmn:$('#three-meal').val(),
            //是否可以取消
            cancancel:'',
            //送餐时间 -
            sendtime:$('#sendTime').val(),
            //送餐地址 -
            sendaddr:$('#DC-location').val(),
            //备注
            comment:$('#DC-remark').val(),
            //电话 -
            phone:$('#DC-phone').val(),
            //备注2
            note:'',
            //送餐费
            sendfee:$('.sendFee').find('input').val(),
            //是否需要送餐
            needsend:$('.switch').find('input').attr('value'),
            //订餐人类型-
            userType:$('#DC-person-type').val(),
            //菜品
            itemslist:arr

        }

        if(flag){

            prm.ordered = _thisId;

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun);


    }

    //获取所有菜品数据
    function mealData(){

        var prm = {

            //餐厅
            dinningroomid:$('#DC-restaurant').val(),

            //开始时间
            dt:$('#time').val(),

            //三餐类型
            mmn:$('#three-meal').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/GetDayMenuList',prm,false,function(result){

            if(result.code == 99){

                _datasTable($('#meal-table'),result.data);

            }

        })


    }

    //获取菜品类型
    function MealType(){

        var prm = {

            lxbm:''

        }

        _mainAjaxFunCompleteOnly('post','YHQDC/RetrunCookStyleList',prm,false,function(result){

            var str = '<option value="-1">全部</option>';

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    str += '<option value="' + result.data[i].id + '">' + result.data[i].lxname + '</option>';


                }

            }

            $('#DC-type-modal').append(str);

        })


    }

    //获取所有员工
    function userData(){

        var prm = {

            'userID':_userIdNum,

            'userName':_userIdName

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetUsers',prm,false,function(result){

            _userArr.length = 0;

            if(result){

                for(var i=0;i<result.length;i++){

                    _userArr.push(result[i]);

                }

            }


        })

    }

    //获取详情
    function getDatil(ordered){

        //订餐时间初始化
        $('#time').val('');

        var prm = {

            ordered:ordered

        }

        _mainAjaxFunCompleteNew('post','YHQDC/OrderDetails',prm,$('.content-top'),function(result){

            if(result.code == 99){

                var data = result.data;

                //赋值

                //餐厅
                $('#DC-restaurant').val(data.dinningroomid );

                //订餐时间
                $('#time').val(data.orderdt.split('T')[0] );

                //订餐人id
                $('#DC-person').attr('data-num',data.userid);

                //订餐人姓名
                $('#DC-person').val(data.userName);

                //订餐人类型
                $('#DC-person-type').val(data.userType);

                //订餐人电话
                $('#DC-phone').val(data.phone);

                //三餐类型
                $('#three-meal').val(data.mmn);

                //送餐时间
                $('#sendTime').val(data.sendtime);

                //送餐地点
                $('#DC-location').val(data.sendaddr);

                //备注
                $('#DC-remark').val(data.comment);

                //已选菜品
                //根据数组，绘制清单

                //总价
                var mealMoney = 0;

                //根据数组，写ui
                for(var i=0;i<data.itemslist.length;i++){

                    //arr
                    var obj = {};

                    //排餐id
                    obj.pbid = data.itemslist[i].id;

                    //菜品名称
                    obj.name = data.itemslist[i].cookname;

                    //菜品id
                    obj.id = data.itemslist[i].itemid;

                    //单价
                    obj.prince = data.itemslist[i].price;

                    //份数
                    obj.num = data.itemslist[i].num;

                    //订单号
                    obj.ordered = data.itemslist[i].ordered;

                    _thisOrder.push(obj);

                }

                $('.order-already-modal').empty().append(arrMealAlready(_thisOrder));

                //是否送餐
                $('.sendFee').find('input').val(data.sendfee);


                $('.switch input').bootstrapSwitch('destroy');

                if(data.needsend == 1){

                    $('.switch input').bootstrapSwitch({

                        size : "small",
                        state:true,
                        onSwitchChange:function(event,state){

                            var money = 0;

                            for(var i=0;i<_thisOrder.length;i++){

                                money += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

                            }

                            if(state==true){

                                $(this).val("1");

                                $('.sendFee').show();

                                var fee = 0;

                                for(var i=0;i<_restaurantArr.length;i++){

                                    if(_restaurantArr[i].id == $('#DC-restaurant').val()){

                                        fee = _restaurantArr[i].sendfee;

                                    }

                                }

                                //送餐费默认
                                $('.sendFee').find('input').val(fee);

                                //送餐费显示
                                $('.sendFee').show();

                                $('.sendFee').find('input').val(data.sendfee);

                                //计算总价
                                var moneyT = Number(money) + Number($('.sendFee').find('input').val());

                                $('#mealMoneyModal').val(moneyT.toFixed(2));


                            }else{

                                $(this).val("0");

                                $('.sendFee').hide();

                                $('#mealMoneyModal').val(money.toFixed(2));


                            }
                        }

                    });

                    mealMoney += Number(data.sendfee);

                    //送餐费显示
                    $('.sendFee').show();

                }else{

                    $('.switch input').bootstrapSwitch({

                        size : "small",
                        state:false,
                        onSwitchChange:function(event,state){

                            var fee = 0;

                            for(var i=0;i<_restaurantArr.length;i++){

                                if(_restaurantArr[i].id == $('#DC-restaurant').val()){

                                    fee = _restaurantArr[i].sendfee;

                                }

                            }

                            //送餐费默认
                            $('.sendFee').find('input').val(fee);

                            //送餐费显示
                            $('.sendFee').show();

                            $('.sendFee').find('input').val(data.sendfee);

                            var money = 0;

                            for(var i=0;i<_thisOrder.length;i++){

                                money += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

                            }

                            if(state==true){

                                $(this).val("1");

                                $('.sendFee').show();

                                //计算总价
                                var moneyT = Number(money) + Number($('.sendFee').find('input').val());

                                $('#mealMoneyModal').val(moneyT.toFixed(2));


                            }else{

                                $(this).val("0");

                                $('.sendFee').hide();

                                $('#mealMoneyModal').val(money.toFixed(2));


                            }
                        }

                    });

                    //送餐费隐藏
                    $('.sendFee').hide();

                }

                for(var i=0;i<_thisOrder.length;i++){

                    mealMoney += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

                }

                $('#mealMoneyModal').val(mealMoney.toFixed(2));

            }

        })

    }

    //根据数据，绘制已选菜单（第一层）
    function arrMealAlready(arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<li style="line-height: 30px;">';

            //菜名
            str += '<span class="order-meal-name">' + arr[i].name + '</span>';

            //单价
            str += '<div class="order-meal-num" style="float: right">￥ <span class="order-meal-prince" style="width: 80px;text-align:left;text-indent:10px;display: inline-block;vertical-align: middle">' + arr[i].prince + '</span>';

            //数量
            str += 'x' +

                '<span style="width: 135px;text-indent:10px;display: inline-block;vertical-align: middle">' + arr[i].num + '</span>' +

                '</div></li><div class="clearfix"></div>';

        }

        return str;

    }

    //根据数组，绘制已选菜单（第二层）
    function arrMealAlready2(arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<li>';

            //菜名
            str += '<span class="order-meal-name">' + arr[i].name + '</span>';

            //单价
            str += '<div class="order-meal-num">￥ <span class="order-meal-prince" style="">' + arr[i].prince + '</span>';

            //数量
            str += 'x <img src="../YHQ-resource/img/subMeal.png" class="order-dinner-num order-dinner-sub" style="width: 15px;margin-left: 5px;">' +

                '<input class="order-meal-number" disabled="disabled" type="text" value="' + arr[i].num + '" attr-id="' + arr[i].id + '">' +

                '<img src="../YHQ-resource/img/addMeal.png" class="order-dinner-num order-dinner-add" attr-num="' + arr[i].surplus + '" style="width: 15px;"></div><div class="clearfix"></div>';


        }

        return str;


    }

    //可操作
    function abledOption(){

        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        //选择订餐人的按钮
        $('#modal-select-user').removeClass('modal-select-show');

        $('#DC-person').attr('readOnly',true);

    }

    //不可操作
    function disabledOption(){

        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

        //选择订餐人的按钮
        $('#modal-select-user').removeClass('modal-select-show');

        $('.radioBlock').find('input').attr('disabled',false);

    }

    //餐厅
    function RestaurantType(){

        var prm = {

            departnum:_userBM

        }

        $.ajax({

            type:'post',

            url:_urls + 'YHQDC/ReturndepartDiningRooms',

            data:prm,

            async:false,

            timeout:_theTimes,

            success:function(result){

                _restaurantArr.length = 0;

                var str1 = '<option value="">请选择</option>';

                var tabStr = '';

                if(result.code == 99){

                    _restaurantArr = result.data;

                    for(var i=0;i<result.data.length;i++){

                        str1 += '<option value="' + result.data[i].id + '">' + result.data[i].diningroom + '</option>';

                        if(i==0){

                            tabStr += '<li class="active">';

                        }else{

                            tabStr += '<li>';

                        }

                        tabStr += '<a href="" data-toggle="tab" aria-expanded="true" data-attr="' + result.data[i].id + '">'

                        tabStr += result.data[i].diningroom;

                        tabStr += '</a>';

                        tabStr += '</li>'

                    }

                }

                $('#DC-restaurant').append(str1);

                $('.dinnerTab').empty().append(tabStr);


            },

            error: function(XMLHttpRequest, textStatus, errorThrown){

                if(el){

                    el.hideLoading();

                }

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时');

                }else{

                    console.log('请求失败');

                }

            }

        })


    }

})

//订单状态
function DCStatus(data){

    if(data == 10){

        return '订餐'

    }else if(data == 20){

        return '付款'

    }else if(data == 30){

        return '确认'

    }else if(data == 40){

        return '已送餐'

    }else if(data == 50){

        return '待评价'

    }else if(data == 60){

        return '完成'

    }else if(data == 999){

        return '取消'

    }

}

//_isClickTr = true;

var _DCquery = false;