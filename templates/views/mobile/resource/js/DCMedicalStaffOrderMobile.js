$(function(){

    var _urls = '';

    $.ajax({

        type:'get',

        url:'../../../assets/local/configs/config.json',

        async:false,

        success:function(result){

            _urls = result.apiUriPrefix;

        },

        error:function(){

            console.log('获取api失败');

        }

    })

    //首先确定是内部订餐还是匿名订餐
    var _prm = window.location.search;

    //订餐人姓名
    var userName = '';

    //订餐人id
    var userNum = '';

    //订餐人电话
    var userPhone = '';

    _prm = decodeURI(_prm);

    if(_prm != ''){

        var prmArr = _prm.split('&');

        for(var i=0;i<prmArr.length;i++){

            if(prmArr[i].indexOf('usernum')>-1){

                userNum = decodeURI(prmArr[i].split('=')[1]);

            }else if(prmArr[i].indexOf('username')>-1){

                userName = decodeURI(prmArr[i].split('=')[1]);

            }else if(prmArr[i].indexOf('phone')>-1){

                userPhone = decodeURI(prmArr[i].split('=')[1]);

            }

        }



    }

    //订餐时间默认今天
    $('#time-con').val(moment().format('YYYY-MM-DD'));

    //当前选中的菜品
    var _currentMeal = [];

    //获取当前所有餐厅
    restaurantData();

    //暂存所有餐厅的数据
    var _restaurantArr = [];

    //当前选中的餐厅对象
    var restaurantObj = {};

    //当前选中的三餐类型
    var threeMealObj = {};

    //记录当前选中的订单号
    var _thisOrderNum = '';

    /*--------------------------------------按钮事件----------------------------------------*/

    //点击增加按钮
    $('.content-block').on('click','.add-button',function(){

        //首先判断当前的input框的状态是否是隐藏的
        //当前按钮的input
        var input = $(this).prev();

        //当前按钮的减
        var subButton = input.prev();

        if(subButton.css('display') == 'none' ){

            //input 和 sub按钮显示
            input.show().val(1);

            subButton.css('display','inline-block');

        }else{

            var maxValue = $(this).attr('data-num');

            var inputValue = input.val();

            inputValue ++;

            if(inputValue == maxValue || inputValue>maxValue){

                inputValue = maxValue;

            }

            input.val(inputValue);

        }

        alreadyMeal($(this),'first');

        mealNumber();

    })

    //点击减号
    $('.content-block').on('click','.sub-button',function(){

        //当前按钮的input
        var input = $(this).next();

        var inputValue = input.val();

        input.removeAttr('readOnly');

        if(inputValue == 1){

            $(this).hide();

            input.val('');

            input.attr('readOnly',true);

            //删除数组中的数

            //确定id
            var id = $(this).parents('.item-content').find('.meal-name').attr('data-attr');

            for(var i=0;i<_currentMeal.length;i++){

                if(_currentMeal[i].itemid == id){

                    _currentMeal.removeByValue(id,'itemid');

                }

            }



        }else{

            inputValue--;

            input.val(inputValue);

            alreadyMeal($(this),'first');

        }

        mealNumber()

    })

    //点击下边已购买的bar
    $('.order-tip').on('click',function(e){

        if(_currentMeal.length == 0){

            $.toast("购物车还是空的哦");

            return false;

        }

        var targetDom = e.target;

        var className = $(targetDom).attr('class')

        if(className){

            //出现模态框
            $.popup('.popup-order-meal');

            //查看菜品
            _carMealList();

        }
    })

    $('.popup-order-meal').click(function(){

        //$.closeModal('.popup-order-meal');

    })

    //菜品清单界面操作(add)
    $('#popup-order-meal-list').on('click','.add-button',function(){

        //首先判断当前的input框的状态是否是隐藏的
        //当前按钮的input
        var input = $(this).prev();

        var inputValue = input.val();

        var maxValue = $(this).attr('attr-num')

        inputValue ++;

        if(inputValue == maxValue || inputValue>maxValue){

            inputValue = maxValue

        }

        input.val(inputValue);

        //操作的就是三个属性，
        alreadyMeal($(this),'second');

        //操作第一层菜单
        var firstMenu = $('#first-menu').children('li');

        var id = $(this).parents('.item-inner').children('.item-title').attr('data-attr');

        for(var i=0;i<firstMenu.length;i++){

            var firstDom = firstMenu.eq(i);

            if(firstDom.find('.meal-name').attr('data-attr') == id){

                firstDom.find('.num-view').val(inputValue);

            }

        }

        mealNumber()

    })

    //菜品清单界面操作（sub）
    $('#popup-order-meal-list').on('click','.sub-button',function() {

        //当前按钮的input
        var input = $(this).next();

        var inputValue = input.val();

        input.removeAttr('readOnly');

        if(inputValue == 1){

            //删除数组中的数

            //确定id
            var id = $(this).parents('.item-content').find('.item-title').attr('data-attr');

            for(var i=0;i<_currentMeal.length;i++){

                if(_currentMeal[i].itemid == id){

                    _currentMeal.removeByValue(id,'itemid');

                }

            }

            $(this).parents('li').remove();

            //操作第一层菜单
            var firstMenu = $('#first-menu').children('li');

            var id = $(this).parents('.item-inner').children('.item-title').attr('data-attr');

            for(var i=0;i<firstMenu.length;i++){

                var firstDom = firstMenu.eq(i);

                if(firstDom.find('.meal-name').attr('data-attr') == id){

                    //如果减少到0的话，input清空，不可操作，减少按钮消失
                    firstDom.find('.num-view').val('');

                    firstDom.find('.num-view').attr('readOnly',true);

                    firstDom.find('.sub-button').hide();


                }

            }

        }else{

            inputValue--;

            input.val(inputValue);

            alreadyMeal($(this),'second');

            //操作第一层菜单
            var firstMenu = $('#first-menu').children('li');

            var id = $(this).parents('.item-inner').children('.item-title').attr('data-attr');

            for(var i=0;i<firstMenu.length;i++){

                var firstDom = firstMenu.eq(i);

                if(firstDom.find('.meal-name').attr('data-attr') == id){

                    firstDom.find('.num-view').val(inputValue);

                }

            }

        }

        //确认不是模态框的最后一条菜品,如果是的话，关闭模态框
        if(_currentMeal.length == 0){

            $.closeModal('.popup-order-meal');

        }

        mealNumber()

    })

    //关闭模态框
    $('.popup-order-meal').on('click',function(e){

        var targetDom = e.target;

        var className = $(targetDom).attr('class')

        if(className){

            if(className.indexOf('popup-order-meal')>=0){

                $.closeModal('.popup-order-meal');

            }

        }

    })

    //清空购物车
    $('#emptyCar').click(function(){

        //关闭模态框
        $.closeModal('.popup-order-meal');

        //第一层菜单的input值为空，并且不可操作
        $('#first-menu').find('.num-view').val('');

        $('#first-menu').find('.num-view').attr('readOnly',true);

        //第一层菜单的减少按钮都隐藏
        $('#first-menu').find('.sub-button').hide();

        //总数归零
        $('#num-tip').html(0);

        //总价归零
        $('#num-tip-momey').html(0.00);

        //清空数组
        _currentMeal.length = 0;

    })

    //点击去结算
    $('#settlement-meal').click(function(){

        //验证
        if(_currentMeal.length == 0){

            $.toast("购物车还是空的哦");

            return false;

        }

        //结算页面
        $('.page').removeClass('page-current');

        $('#router1').addClass('page-current');


        //首先将菜品清单列出

        var str = ''

        var money = 0;

        for(var i=0;i<_currentMeal.length;i++){

            money += Number(_currentMeal[i].price) * Number(_currentMeal[i].num);

            str += '<li>' +
                '<div class="item-content">' +
                '<div class="item-media">' +
                '<i class="icon icon-form-name"></i>' +
                '</div>' +
                '<div class="item-inner">' +
                '<div class="item-title label" data-attr="' + _currentMeal[i].itemid + '">' + _currentMeal[i].itemName + '</div>' +
                '<div class="item-input">' +
                '<div class="meal-prince">￥<span>' + _currentMeal[i].price + '</span>' +
                '<div class="num-control-block" style="font-size: 10px !important;">' +
                'X' +
                '<span class="num-view-1">' + _currentMeal[i].num + '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>';

        }

        $('#meal-list').empty().append(str);

        //订单详情
        //餐厅
        $('#DC-restaurant').val(restaurantObj.name);

        $('#DC-restaurant').attr('data-num',restaurantObj.value);

        //获取当前选中餐厅的订餐费

        $('.food-delivery').find('input').val(Number(restaurantObj.fee).toFixed(2));

        //默认开关是开启的；
        $('.label-switch input').attr('checked',true);

        var state = $('.label-switch input:checked').length;

        if(state == 0){

            $('.food-delivery').hide();

        }else{

            money += Number($('.food-delivery').find('input').val());

            $('.food-delivery').show();

        }

        //计算总价
        $('#total-fee').val(money.toFixed(2));

        //订餐时间
        $('#DC-time').val($('#time-con').val());

        //送餐时间默认当前时间+1个半小时

        var nowT = moment().add('hours',1.5).format('HH:mm');

        $('#DC-send-time').val(nowT);

        $("#DC-send-time").picker({
            toolbarTemplate: '<header class="bar bar-nav">\
                              <h1 class="title">请选择送餐时间</h1>\
                              </header>',
            cols: [
                {
                    textAlign: 'center',
                    values: hourArr
                    //如果你希望显示文案和实际值不同，可以在这里加一个displayValues: [.....]
                },
                {
                    textAlign: 'center',
                    values:minuteArr
                }
            ],

            formatValue:function(picker, value, displayValue){

                return displayValue[0] + ':' + displayValue[1]

            }

        });

        //三餐类型
        $('#DC-menu-type').val(threeMealObj.name);

        $('#DC-menu-type').attr('data-num',threeMealObj.value);

        //报修人
        if(_prm){

            //订餐人姓名
            $('#DC-user').val(userName);

            //订餐人电话
            $('#DC-tel').val(userPhone);

        }else{

            $('#DC-user').val('');

            $('#DC-tel').val('');

        }

    })

    //只选时间定制
    var hourArr = [];

    for(var i=0;i<24;i++){

        var hour = '';

        if(i<10){

            hour = '0' + String(i);

        }else{

            hour = i;

        }

        hourArr.push(hour);

    }

    //只选择分钟

    var minuteArr = [];

    for(var i=0;i<60;i++){

        var minute = '';

        if(i<10){

            minute = '0' + String(i);

        }else{

            minute = i;

        }

        minuteArr.push(minute);

    }

    //获取插件中select的文本
    function selectText(el){

        var value = $(el).val();

        var children = $(el).children('option');

        for(var i=0;i<children.length;i++){

            if(value == children.eq(i).attr('value')){

                return children.eq(i).html()

            }

        }

    }

    //订餐时间插件
    $('#time-con').calendar({});

    //订餐（提交）
    $('#orderCreate').click(function(){

        //验证
        //订餐人
        if($.trim($('#DC-user').val()) == ''){

            $.toast("请填写订餐人");

            return false;

        }

        //电话
        if($.trim($('#DC-tel').val()) == ''){

            $.toast("请填写订餐电话");

            return false;

        }else{

            var value = $.trim($('#DC-tel').val());

            //验证电话格式
            //手机号
            var mobile = /^1[3|5|8|7]\d{9}$/ ;
            //带区号的座机
            //var phone = /^0\d{2,3}-?\d{7,8}$/;

            var phone = /\d{7,8}/;

            var flag = false;

            if( mobile.test(value) || phone.test(value)){

                flag = true;

            }

            if(!flag){

                $.toast("订餐电话为电话格式");

                return false;

            }

        }

        //送餐地点
        if($.trim($('#DC-send-location').val()) == ''){

            $.toast("请填写送餐地址");

            return false;

        }

        orderMealFun();

    })

    //返回
    $('#returnDC').click(function(){

        //选择菜品页面
        $('.page').removeClass('page-current');

        $('#router').addClass('page-current');

    })

    //点击具体订单，进入订单详情
    $('#order-history-list').on('click','.card-history',function(){

        $.popup('.popup-order-detail');

        //获取订单详情
        _thisOrderNum = $(this).find('.card-arrow').attr('attr-bm');

        var prm = {

            ordered:_thisOrderNum

        }

        _mainAjaxFunCompleteNew('post','YHQDC/OrderDetails',prm,false,function(result){

            if(result.code == 99){

                //赋值
                //菜品列表
                var str = '';

                var data = result.data;


                for(var i=0;i<result.data.itemslist.length;i++){

                    var data1 = result.data.itemslist[i];

                    str += '<li>' +
                        '<div class="item-content">' +
                        '<div class="item-media">' +
                        '<i class="icon icon-form-name"></i>' +
                        '</div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title label" data-attr="' + data1.itemid + '">' + data1.cookname + '</div>' +
                        '<div class="item-input">' +
                        '<div class="meal-prince">￥<span>' + data1.price + '</span>' +
                        '<div class="num-control-block" style="font-size: 10px !important;">X' +
                        '<span class="num-view-1">' + data1.num + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</li>';


                }

                $('#detail-meal').empty().append(str);

                if(data.needsend == 0 ){

                    $('.food-deliveryH').hide();

                }else if(data.needsend == 1){

                    $('.food-deliveryH').show();

                }

                //送餐费
                $('.food-deliveryH').find('input').val(Number(data.sendfee).toFixed(2));

                //总计
                $('#total-feeH').val(Number(data.paysum).toFixed(2));

                //餐厅
                $('#DC-restaurantH').val(data.diningroom);

                //订餐时间
                $('#DC-timeH').val(data.orderdt.split('T')[0]);

                //三餐类型
                $('#DC-menu-typeH').val(data.mmn + '餐');

                //订餐人类型
                //$('#DC-user-typeH').val(data.userType);

                //订餐电话
                $('#DC-telH').val(data.phone);

                //送餐时间
                $('#DC-send-timeH').val(data.sendtime);

                //送餐地点
                $('#DC-send-locationH').val(data.sendaddr);

                //备注
                $('#DC-remarkH').val(data.comment);

                //订餐人
                $('#DC-userH').val(data.userName);

            }

        })

    })

    //点击历史订单
    $('#orderHistoryBtn').click(function(){

        if(_prm){

            //历史订单页面
            $('.page').removeClass('page-current');

            $('#router2').addClass('page-current');

            //获取订单列表数据
            getOrderList(userNum);

        }else{

            if(sessionStorage.isOrderFlag){

                //历史订单页面
                $('.page').removeClass('page-current');

                $('#router2').addClass('page-current');

                //获取订单列表数据
                getOrderList(sessionStorage.isOrderFlag);

            }else{

                $('.popup-order-history').find('input').val('');

                //匿名用户请输入手机号码
                $.popup('.popup-order-history');

            }

        }

    })

    //历史订单页面返回首页
    $('.returnRes').click(function(){

        //历史订单页面
        $('.page').removeClass('page-current');

        $('#router-res').addClass('page-current');

    })

    //返回订单列表
    $('#returnDCH').click(function(){

        //历史订单页面
        $.closeModal('.popup-order-detail');

    })

    //选择餐厅后
    $('#res-list').on('click','.card',function(){

        //初始化
        resInit();

        //确定选择的餐厅，自动填写餐厅选项
        var resNum = $(this).find('.card-header').attr('attr-id');

        var resName = $(this).find('.card-header').html();

        //跳转选择菜品页面
        $('.page').removeClass('page-current');

        $('#router').addClass('page-current');

        $('#condition-restaurant').val(resNum);

        $('.conditional-part').find('#res-name').html(resName);

        //获取所有菜品数据，默认选择全部
        //mealData();

        //获取当前餐厅的三餐时间。
        for(var i=0;i<_restaurantArr.length;i++){

            if(_restaurantArr[i].id == resNum){

                //早餐截止时间
                restaurantObj.morningordertime = _restaurantArr[i].morningordertime;

                //午餐截止时间
                restaurantObj.noonordertime = _restaurantArr[i].noonordertime;

                //晚餐截止时间
                restaurantObj.eveningordertime = _restaurantArr[i].eveningordertime;


            }

        }

        threeMeal();

    })

    //切换三餐类型获取菜品数据
    $('#three-meal-type').on('click','span',function(){

        //样式
        $('#three-meal-type').children().removeClass('three-meal-type-hover');

        $(this).addClass('three-meal-type-hover');

        var type = $('#three-meal-type').children('.three-meal-type-hover').attr('data-attr');

        threeMeal();

    })

    //匿名用户查询历史订单
    $('#anonymousHistory').click(function(){

        $.closeModal('.popup-order-history');

        $('.page').removeClass('page-current');

        $('#router2').addClass('page-current');

        //获取订单列表数据
        getOrderList($('.popup-order-history').find('input').val());

    })

    //输入电话模态框消失事件
    $('.popup-order-history').click(function(e){

        var targetDom = e.target;

        var className = $(targetDom).attr('class')

        if(className){

            if(className.indexOf('popup-order-history')>=0){

                $.closeModal('.popup-order-history');

            }

        }

    })

    $('.label-switch').on('click',function(e){

        if($(e.target).attr('tagName') == 'DIV'){

            var state = $('.label-switch input:checked').length;

            var money = 0;

            for(var i=0;i<_currentMeal.length;i++){

                money += Number(_currentMeal[i].num) * Number(_currentMeal[i].price);

            }

            if(state == 1){

                //否
                $('.food-delivery').hide();

            }else if(state == 0){

                //是
                $('.food-delivery').show();

                money = Number(money) + Number($('.food-delivery').find('input').val());

            }


            $('#total-fee').val(Number(money).toFixed(2));

        }

    })

    /*-------------------------------------公共方法----------------------------------------*/

    //获得当前已选中的菜品数组flag = firtst时，是操作的第一个层菜单，flag=second时是操作的购物车里的菜单
    function alreadyMeal(_this,flag){

        if(flag == 'first'){

            var parent = _this.parents('.meal-info-block');

            var obj = {};

            //菜品餐次id
            obj.pbid = parent.find('.meal-name').attr('data-id');

            //菜品名称
            obj.itemName = parent.find('.meal-name').html();

            //菜品id
            obj.itemid = parent.find('.meal-name').attr('data-attr');

            //价格
            obj.price = parent.find('.meal-prince').children('span').html();

            //数量
            obj.num = parent.find('.num-view').val();

            //剩余数量
            obj.surplus = parent.find('.add-button').attr('data-num');

        }else if(flag == 'second'){

            var parent = _this.parents('.item-content');

            var obj = {};

            //菜品名称
            obj.itemName = parent.find('.item-title').html();

            //菜品id
            obj.itemid = parent.find('.item-title').attr('data-attr');

            //价格
            obj.price = parent.find('.meal-prince').children('span').html();

            //数量
            obj.num = parent.find('.num-view').val();

        }


        //标记是否可push近数组中
        var isPass = false;

        //遍历currentMeal，如果有当前存在的菜品id，则只改变数字，否则push
        if(_currentMeal.length == 0){

            isPass = true;

        }else{

            for(var i=0;i<_currentMeal.length;i++){

                if(_currentMeal[i].itemid == obj.itemid){

                    _currentMeal[i].num = obj.num;

                    isPass = false;

                    break;

                }else{

                    isPass = true;

                }

            }

        }

        if(isPass){

            _currentMeal.push(obj);

        }
    }

    //计算当前菜品的值（选择菜品时）
    function mealNumber(){

        //最下边tip数
        var num = 0;

        //最下边总金额

        var money = 0;

        for(var i=0;i<_currentMeal.length;i++){

            money += Number(_currentMeal[i].price) * Number(_currentMeal[i].num);

            num += Number(_currentMeal[i].num);

        }

        $('#num-tip').html(num);

        $('#num-tip-momey').html(money.toFixed(2));

    }

    //获取餐厅列表
    function  restaurantData(){

        var prm = {

            diningroom:$('#DC-nameCon').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/ReturnDiningRoomsList',prm,false,function(result){

            var str1 = '<option value="">请选择</option>';

            var str = '';

            if(result.code == 99){

                if(result.data.length>0){

                    _restaurantArr = result.data;

                    for(var i=0;i<result.data.length;i++){

                        str1 += '<option attr-fee="' + result.data[i].sendfee +'" value="' + result.data[i].id + '">' + result.data[i].diningroom + '</option>';

                        str += '<li class="card">' +
                            '<div class="card-header" attr-id="' + result.data[i].id + '" attr-fee="' + result.data[i].sendfee + '">' + result.data[i].diningroom +'</div>' +
                            '<div class="card-content">' +
                            '<div class="card-content-inner">' + result.data[i].address + '</div>' +
                            '</div>' +
                            '<div class="card-footer">' +
                            '<span>' + result.data[i].phone +'</span>' +
                            '</div>' +
                            '</li>';

                    }

                }

            }

            $('#condition-restaurant').empty().append(str1);

            $('#res-list').empty().append(str);
        })

    }

    //条件查询菜品(全部)
    function mealData(flag){

        var type = $('#three-meal-type').children('.three-meal-type-hover').attr('data-attr');

        var prm = {

            //餐厅id
            dinningroomid:$('#condition-restaurant').val(),
            //三餐类型
            mmn:type,
            //时间
            dt:$('#time-con').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/GetDayMenuList',prm,true,function(result){

            //当前时间是否属于当前的三餐类型时间段。

            var str = '';

            if(result.code == 99){

                //给选择的餐厅和三餐类型赋值

                var res = $('#condition-restaurant');

                //餐厅id
                restaurantObj.value = $(res).val();

                //餐厅名称
                restaurantObj.name = selectText($(res));

                //餐厅送餐费
                for(var i=0;i<res.children().length;i++){

                    var children = res.children().eq(i);

                    var fee = children.attr('attr-fee');

                    if(res.val() == children.val()){

                        restaurantObj.fee = children.attr('attr-fee');

                    }

                }

                result.data.reverse();

                for(var i=0;i<result.data.length;i++){

                    var data = result.data[i];

                    var imgPath = '';

                    if(data.img != ''){

                        imgPath = '<img src="' + _urls.split('api')[0] + data.img + '" alt="">'

                    }else{

                        imgPath = '<div style="text-align: center;line-height: 106px;">暂无图片</div>'

                    }

                    str += '<li>' +
                        '<div class="item-content">' +
                        '<div class="row item-content-area">' +

                        '<div class="img-block">' +

                        imgPath +

                        '</div>' +

                        '<div class="meal-info-block">' +

                        '<div class="meal-name" data-id="' + data.id + '" data-attr="' + data.itemid + '">' + data.cookname + '</div>' +

                        '<div class="meal-info">' +

                        '<span class="meal-info-type" data-attr="' + data.mmn + '">' + data.mmn + '餐' +'</span>' +

                        '<span>' + data.flavor + '</span>' +

                        '<span>' + data.element + '</span>' +

                        '</div>' +

                        '<div class="meal-prince">' +

                        '￥<span>' + data.price + '</span>'

                    //可操作数量
                    var num = Number(data.totalQuantity) - Number(data.saleQuantity);

                    //判断当前的三餐类型是否可操作

                    //记录当前是否可操作

                    if(data.mmn == flag){

                        str += '<div class="num-control-block">' +

                            '<span class="sub-button" style="display: none"></span>' +

                            '<input type="text" class="num-view" disabled style="display: none">' +


                            '<span class="add-button" data-num="' + num + '"></span>' +

                            '</div>' +

                            '</div>' +

                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</li>';

                    }else{

                        str += '<div class="num-control-block">' +

                            '非可售时间' +

                            '</div>' +

                            '</div>' +

                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</li>';

                    }

                }

            }

            if(str == ''){

                str = '<p style="text-align: center;font-size: 12px;">暂时没有获取到菜品列表</p>'

            }

            $('#first-menu').empty().append(str);

        })

    }

    //公共ajax方法
    function _mainAjaxFunCompleteNew(type,url,prm,el,successFun){


        $.ajax(
            {

                //发送方式
                type:type,

                //url
                url:_urls + url,

                //timeout
                timeout:3000,

                //参数
                data:prm,

                //发送数据之前
                beforeSend:function(){

                    $.showIndicator();

                },

                //发送数据完成之后
                complete:function(){

                    $.hideIndicator();

                },

                //成功
                success:successFun,

                //失败
                error: function(XMLHttpRequest, textStatus, errorThrown){

                    if(el){

                        el.hideLoading();

                    }

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                        console.log('请求超时')

                    }else{

                        console.log('请求失败')

                    }

                }

            })
    }

    //根据数组，绘制已选菜品
    function _carMealList(){

        var str = '';

        for(var i=0;i<_currentMeal.length;i++){

            str += '<li>' +
                '<div class="item-content">' +
                '<div class="item-media"><i class="icon icon-form-name"></i></div>' +
                '<div class="item-inner">' +
                '<div class="item-title label" data-id="' + _currentMeal[i].pbid + '" data-attr="' + _currentMeal[i].itemid + '">' + _currentMeal[i].itemName + '</div>' +
                '<div class="item-input">' +
                '<div class="meal-prince">' +

                '￥<span>' + _currentMeal[i].price + '</span>' +

                '<div class="num-control-block">' +

                '<span class="sub-button"></span>' +

                '<input type="text" class="num-view" disabled value="' + _currentMeal[i].num + '">' +

                '<span class="add-button" attr-num="' + _currentMeal[i].surplus + '"></span>' +

                '</div>' +

                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>';

        }

        $('#popup-order-meal-list').empty().append(str);

    }

    //订餐
    function orderMealFun(){

        var arr = [];

        for(var i=0;i<_currentMeal.length;i++){

            var obj = {};

            obj.dayMenuid = _currentMeal[i].pbid;

            obj.itemid = _currentMeal[i].itemid;

            obj.price = _currentMeal[i].price;

            obj.num = _currentMeal[i].num;

            obj.cookname = _currentMeal[i].itemName;

            arr.push(obj);

        }

        if(!_prm){

            userName = $('#DC-user').val();

            userNum = $('#DC-tel').val();

            userPhone = $('#DC-tel').val();

        }

        //是否需要送餐
        var state = $('.label-switch input:checked').length;

        var prm = {

            //餐厅id
            dinningroomid:$('#DC-restaurant').attr('data-num'),
            //订餐日期
            orderdt:$('#DC-time').val(),
            //总计
            paysum:$('#total-fee').val(),
            // 早中晚类型
            mmn:$('#DC-menu-type').attr('data-num'),
            //送餐时间
            sendtime:$('#DC-send-time').val(),
            //送餐地址
            sendaddr:$('#DC-send-location').val(),
            //备注
            comment:$('#DC-remark').val(),
            //电话
            phone:userPhone,
            //送餐费
            sendfee:$('.food-delivery').find('input').val(),
            //是否需要送餐
            needsend:state,
            //菜品列表
            itemslist:arr,
            //订餐人id
            userNum:userNum,
            //订餐人姓名
            userName:userName,
            //订餐人类型
            userType:_prm == ''?2:1


        }

        _mainAjaxFunCompleteNew('post','YHQDC/orderlistAdd',prm,false,function(result){

            $.toast(result.message);

            if(result.code == 99){

                sessionStorage.isOrderFlag = userPhone;

                //执行成功跳转页面。
                $('.page').removeClass('page-current');

                $('#router-res').addClass('page-current');

                //初始化数据
                createInit();

            }


        })

    }

    //获取所有订单
    function getOrderList(num){

        //获取我的订单

        var prm = {

            usernum:num

        };

        _mainAjaxFunCompleteNew('post','YHQDC/MyOrderList',prm,false,function(result){

                var arr = [];

                if(result.code == 99){

                    arr = result.data;

                }

                var str = '';

                for(var i=0;i<arr.length;i++){

                    var num = 0;

                    //获取当前订单的数量
                    for(var j=0;j<arr[i].itemslist.length;j++){

                        num += Number(arr[i].itemslist[j].num)

                    }

                    str +='<li class="card card-history">' +
                    '<div class="card-header card-arrow" attr-bm="' + arr[i].ordered +'">' +

                    arr[i].orderdt.split('T')[0] +

                    '</div>' +
                    '<div class="card-content">' +
                    '<div class="card-content-inner">' +

                    arr[i].diningroom +

                    '<div style="float: right">' + DCStatus(arr[i].orderZht) + '</div>' +

                    '</div>' +
                    '</div>' +
                    '<div class="card-footer">' +

                    '<span>' + arr[i].itemslist[0].cookname + '</span>等<span>' + num + '</span>件商品' +

                    '<div class="price" style="float: right;">￥<span>' + Number(arr[i].paysum).toFixed(2) + '</span></div>' +

                    '</div>' +
                    '</li>';

                }

                if(arr.length == 0){

                    str ='<div class="card">' +
                        '<div class="card-content">' +
                        '<div class="card-content-inner">暂时没有获取到您的订单记录</div>' +
                        '</div>' +
                        '</div>';

                }

                $('#order-history-list').empty().append(str);


        })

    }

    //删除数组
    //根据value值删除数组中的某项
    Array.prototype.removeByValue = function(val,attr) {
        for(var i=0; i<this.length; i++) {
            if(this[i][attr] == val) {
                this.splice(i, 1);
                break;
            }
        }
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

    //点击餐厅后 初始化
    function resInit(){

        //三餐类型
        $('#three-menu-type').val('');

        //菜品列表
        $('#first-menu').empty();

        //已选中菜品
        _currentMeal.length = 0;

        //已选中数量
        $('#num-tip').html(0);

        //金额
        $('#num-tip-momey').html(0.00);

        //三餐类型为全部
        $('#three-meal-type').children().removeClass('three-meal-type-hover');

        $('#three-meal-type').children().eq(0).addClass('three-meal-type-hover');

    }

    //判断当前时间是否属于三餐中的某一餐类型
    function threeMeal(){

        var flag = '';

        var nowTime = moment().format('HH:mm');

        //早餐截止之前可预定早餐
        if(nowTime<restaurantObj.morningordertime){

            flag = '早';

            threeMealObj.name = '早餐';

        }
        //早餐截至时间之后，到午餐截止时间之前，只能选择午餐

        if(nowTime>=restaurantObj.morningordertime && nowTime<restaurantObj.noonordertime ){

            flag = '中';

            threeMealObj.name = '中餐';

        }

        //午餐截止时间之后，晚餐截止时间之前，只能选择晚餐

        if(nowTime>=restaurantObj.noonordertime && nowTime<restaurantObj.eveningordertime){

            flag = '晚';

            threeMealObj.name = '晚餐';

        }

        threeMealObj.value = flag;

        //获取所有菜品
        mealData(flag);


    }

    //创建订单之后，初始化
    function createInit(){

        //选中的餐厅对象
        restaurantObj = {};

        //选中三餐类型
        threeMealObj = {};

        //选中的菜品
        _currentMeal = [];

        //订餐人
        $('#DC-user').val('');

        //订餐电话
        $('#DC-tel').val('');

        //送餐地点
        $('#DC-send-location').val('');

        //备注
        $('#DC-remark').val('');


    }

})