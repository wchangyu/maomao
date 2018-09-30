$(function(){

    //存放所有数据
    var _allData = [];

    //获取所有菜品
    var _mealArr = [];

    //获取菜品分类
    MealType();

    //获取菜品列表
    mealData();

    //switch初始化
    $('.switch input').bootstrapSwitch({

        size : "small",
        state:false,
        onSwitchChange:function(event,state){

            var money = 0;

            for(var i=0;i<_thisOrder.length;i++){

                money += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

            }

            if(state==true){

                $(this).val("1");

                $('.sendFee').show();

                //计算总价
                var moneyT = Number(money) + Number($('.sendFee').find('input').val());

                $('#mealMoneyModal').val(moneyT);


            }else{

                $(this).val("0");

                $('.sendFee').hide();

                $('#mealMoneyModal').val(money);


            }
        }

    });

    //当前选中的菜品信息
    var _thisOrder = [];

    //暂存所有员工信息
    var _userArr = [];

    //获取所有员工
    userData();

    //当前选中的订单号
    var _thisDD = '';

    /*-------------------------------时间插件------------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    //模态框日期选择
    _timeYMDComponentsFun11($('.DC-time'));

    //送餐时间
    _timeComponentsFun($('.DC-time1'));

    /*------------------------------------------表单验证-----------------------------------*/

    $('#commentForm').validate({

        rules:{
            //订餐时间
            'time':{

                required: true,

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

                required: true,

                isTimeFormat:true

            },
            //送餐地点
            'DC-location':{

                required: true

            }

        },
        messages:{

            //订餐时间
            'time':{

                required: '请选择订餐时间',

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

                required: '请选择送餐时间',

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
                //订餐时间
                'time':{

                    required: true,

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

                    required: true,

                    isTimeFormat:true

                },
                //送餐地点
                'DC-location':{

                    required: true

                }

            },
            messages:{

                //订餐时间
                'time':{

                    required: '请选择订餐时间',

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

                    required: '请选择送餐时间',

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

                return data.split('T')[0] + data.split('T')[1]

            }

        },
        {
            title:'订餐人',
            data:'userid'
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

                return  '<span class="option-button option-see option-in" data-attr="' + full.ordered + '">' + '详情</span>' +

                    '<span class="option-button option-edit option-in" data-attr="' + full.ordered + '">' + '编辑</span>' +

                    '<span class="option-button option-del option-in" data-attr="' + full.ordered + '">' + '删除</span>'


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

                return '<img src="../YHQ-resource/img/addMeal.png" class="order-dinner-table-add" style="width: 15px;cursor: pointer">'

                //return '<div class="order-num-block">' +
                //
                //        '<img src="../YHQ-resource/img/subMeal.png" class="order-dinner-num order-dinner-sub" style="width: 15px;display: none">' +
                //
                //        '<span class="order-dinner-value" style="display: inline-block;width: 25px;height: 15px;vertical-align: middle;margin:0 3px;text-align: center;display: none">0</span>' +
                //
                //        '<img src="../YHQ-resource/img/addMeal.png" class="order-dinner-num order-dinner-add" style="width: 15px;">' +
                //
                //        '</div>'

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

                return '<span data-id="' + full.id + '">' + data + '</span>'

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

                return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox"                                 value=""></span></div>'

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

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        //

    });

    //新增确定按钮
    $('#create-Modal').on('click','.btn-primary',function(){

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

    //点击放大镜选择菜品
    $('#modal-select-meal').click(function(){

        //初始化

        //模态框
        _moTaiKuang($('#meal-Modal'),'菜品列表','','','','选择');

        //数据
        _datasTable($('#meal-table'),_mealArr);

    })

    //新增模态框消失事件
    $('#create-Modal').on('hide.bs.modal',function(){

        _thisOrder = [];

        $('.order-already').empty();

    })

    //点击表格中的选择加号，添加到右边的框中
    $('#meal-table tbody').on('click','.order-dinner-table-add',function(){

        var currentTr = $(this).parents('tr');

        var obj = {};

        //菜品名称
        obj.name = currentTr.find('.cookname').children().html();

        //菜品id
        obj.id = currentTr.find('.cookname').children().attr('data-id');

        //单价
        obj.prince = currentTr.find('.price').html();

        //份数
        obj.num = 1;

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

        var str = '';

        //总价
        var mealMoney = 0;

        //根据数组，写ui
        for(var i=0;i<_thisOrder.length;i++){

            str += '<li>';

            //菜名
            str += '<span class="order-meal-name">' + _thisOrder[i].name + '</span>';

            //单价
            str += '<div class="order-meal-num">￥ <span class="order-meal-prince" style="">' + _thisOrder[i].prince + '</span>';

            //数量
            str += 'x <img src="../YHQ-resource/img/subMeal.png" class="order-dinner-num order-dinner-sub" style="width: 15px;margin-left: 5px;">' +

                '<input class="order-meal-number" type="text" value="' + _thisOrder[i].num + '" attr-id="' + _thisOrder[i].id + '">' +

                '<img src="../YHQ-resource/img/addMeal.png" class="order-dinner-num order-dinner-add" style="width: 15px;"></div><div class="clearfix"></div>';


            mealMoney += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

        }

        $('.order-already').empty().append(str);

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

            //是增加按钮

            value ++ ;

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
        var str = '';

        //总价
        var mealMoney = 0;

        //根据数组，写ui
        for(var i=0;i<_thisOrder.length;i++){

            str += '<li style="line-height: 30px;">';

            //菜名
            str += '<span class="order-meal-name">' + _thisOrder[i].name + '</span>';

            //单价
            str += '<div class="order-meal-num" style="float: right">￥ <span class="order-meal-prince" style="width: 80px;text-align:left;text-indent:10px;display: inline-block;vertical-align: middle">' + _thisOrder[i].prince + '</span>';

            //数量
            str += 'x' +

                '<span style="width: 150px;text-indent:10px;display: inline-block;vertical-align: middle">' + _thisOrder[i].num + '</span>' +

                '</div></li><div class="clearfix"></div>';


            mealMoney += Number(_thisOrder[i].prince) * Number(_thisOrder[i].num);

        }

        $('.order-already-modal').empty().append(str);

        $('#mealMoneyModal').val(mealMoney);


    })

    //选择订餐人
    $('#create-Modal').on('click','#modal-select-user',function(){

        //模态框
        _moTaiKuang($('#user-Modal'),'员工列表','','','','确定');

        _datasTable($('#user-table'),_userArr);

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


        }else{

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择订餐人','');

        }


    })

    //编辑
    $('#table tbody').on('click','.option-edit',function(){

        //初始化

        //模态框

        //绑定数据
        getDatil($(this).attr('data-attr'));

    })

    /*------------------------------------------其他方法-----------------------------------*/

    //模态框初始化
    function createModeInit(){

        //时间格式
        $('.time-seat').hide();

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val('');

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

        //送餐费默认
        $('.sendFee').find('input').val(6);

        //当前选中的菜品清单
        $('.order-already-modal').empty();

        //当前总计
        $('#mealMoneyModal').val(0.00);

        $('#meal-tip').hide();

        $('#DC-person').removeAttr('data-num');
    }

    //条件查询
    function conditionSelect(){

        var prm = {
            //餐厅
            dinningroomid:1,
            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD')

        }

        _mainAjaxFunCompleteNew('post','YHQDC/Returnorderlist',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }

    //操作发送数据
    function sendData(url,el,flag,successFun){

        //菜品

        var arr = [];

        for(var i=0;i<_thisOrder.length;i++){

            var obj = {};

            //菜品id
            obj.itemid = _thisOrder[i].id;

            //价格
            obj.price = _thisOrder[i].prince;

            //数量
            obj.num = _thisOrder[i].num;

            arr.push(obj);

        }

        var prm = {

            //餐厅id
            dinningroomid:1,
            //日期
            dt:$('#time').val(),
            //订餐人id
            userid:$('#DC-person').val(),
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
            sendfee:$('.seeFee').find('input').val(),
            //是否需要送餐
            needsend:$('.switch').find('input').attr('value'),
            //订餐人类型-
            userType:$('#DC-person-type').val(),
            //菜品
            itemslist:arr

        }

        if(flag){

            prm.id = _thisId

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun);


    }

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

    //获取所有菜品数据
    function mealData(){

        var prm = {

            //餐厅
            dinningroomid:1,

            //菜名
            cookname:'',

            //菜品类型
            lx:''

        }

        _mainAjaxFunCompleteNew('post','YHQDC/RetrunDinningbookList',prm,false,function(result){

            if(result.code == 99){

                _mealArr = result.data;

            }

        })


    }

    //获取菜品类型
    function MealType(){

        var prm = {

            lxbm:''

        }

        _mainAjaxFunCompleteOnly('post','YHQDC/RetrunCookStyleList',prm,false,function(result){

            var str = '<option value="">全部</option>';

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

        var prm = {

            ordered:ordered

        }

        _mainAjaxFunCompleteNew('post','YHQDC/OrderDetails',prm,$('.content-top'),function(result){

            console.log(result);

            if(result.code == 99){

                var data = result.data;

                //赋值
                //订餐时间
                $('#time').val(data.orderdt.split('T')[0] + ' ' + data.orderdt.split('T')[1] );

                //订餐人
                $('#DC-person').val(data.userid);

                //订餐人id
                $('#DC-person').attr('data-num',data.userid);

                //订餐人类型
                //$('#DC-person-type').val(data)

            }

        })

    }



})

_isClickTr = true;