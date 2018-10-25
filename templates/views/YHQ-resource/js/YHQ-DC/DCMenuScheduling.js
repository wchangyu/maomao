$(function(){

    /*-------------------------------时间插件------------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var et = moment(nowTime).add(6,'days').format('YYYY-MM-DD');

    $('#spDT').val(nowTime);

    $('#epDT').val(et);

    _timeYMDComponentsFun11($('.abbrDT'));

    $('.DC-time').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: true,
        format: 'yyyy-mm-dd',
        forceParse: 0,
        autoclose: 1

    }).on('change',function(picker){

        $(picker.target).parents('.time-tool-block').next().next().hide();

        $(picker.target).next('.error').hide();

    })

    $('.abbrDT1').datepicker({

        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: true,
        format: 'yyyy-mm-dd',
        forceParse: 0,
        autoclose: 1

    }).on('change',function(picker){

        var values = $(picker.target).val();

        _firstMealMorningArr = [];

        _firstMealNoonArr = [];

        _firstMealEveningArr = [];

        bindData(values);

    })

    /*---------------------------------默认加载------------------------------------*/

    //暂存所有数组
    var _allData = [];

    //记录当前操作的三餐类型
    var _currentThree = '';

    //记录当前操作的日期
    var _currentTime = '';

    //选菜品第一层模态框所存放的数组
    //早餐
    var _firstMealMorningArr = [];
    //中餐
    var _firstMealNoonArr = [];
    //晚餐
    var _firstMealEveningArr = [];

    //当前菜品的id
    var _mealId = '';

    //获取餐厅
    RestaurantType();

    //获取菜品类型
    MealType();

    /*------------------------------表格初始化--------------------------------------*/

    //页面主表格
    var mainCol = [

        {
            title:'时间',
            data:'time'
        },
        {
            title:'早餐',
            data:''
        },
        {
            title:'中餐',
            data:''
        },
        {
            title:'晚餐',
            data:''
        },
        {
            title:'操作',
            data:'',
            render:function(data, type, full, meta){

                return '<div class="option-button option-see option-in">操作</div>'

            }

        }

    ]

    _tableInit($('#table'),mainCol,'2','','','','','');

    //三餐表格
    var threeMenuCol = [


        {
            title:'菜品名称',
            data:'cookname',
            className:'cookname',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.itemid + '">' + data + '</span>'

            }

        },
        {
            title:'餐饮类型',
            data:'lxname',
            className:'lxname',
            render:function(data, type, full, meta){

                return '<span data-attr="' + full.lx + '">' + data + '</span>'

            }
        },
        {
            title:'价格',
            data:'price',
            className:'price',
            render:function(data, type, full, meta){

                return '<input type="text" class="form-control priceInput" value="' + Number(data).toFixed(2) + '" placeholder="大于0的数字">'

            }
        },
        {
            title:'总份数',
            data:'totalQuantity',
            className:'tNumber',
            render:function(data, type, full, meta){

                return '<input type="text" placeholder="大于0的整数" class="form-control tNum" value="' + data + '">'

            }
        },
        {
            title:'适合人群',
            data:'unfitperson'
        },
        {
            title:'不适合人群',
            data:'unfitperson'
        },
        {
            title:'操作',
            data:'',
            render:function(data, type, full, meta){

                return '<div class="option-button option-del option-in" data-attr="' + full.itemid + '">删除</div>'

            }

        }

    ]

    _tableInit($('.three-table'),threeMenuCol,'2','','','','','','',true);

    //菜品表格
    var mealCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox"                                 value=""></span></div>'

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
            title:'餐饮类型',
            data:'lxname',
            className:'lxname',
            render:function(data, type, full, meta){

                return '<span data-attr="' + full.lx + '">' + data + '</span>'

            }
        },
        {
            title:'价格',
            data:'price',
            className:'price'
        },
        {
            title:'适合人群',
            data:'fitperson',
            className:'fit'
        },
        {
            title:'不适合人群',
            data:'unfitperson',
            className:'unfit'
        }

    ]

    _tableInit($('#meal-table-multi'),mealCol,'2','','','','','','',true);

    //根据搜索日期，绘制空表格
    _datasTable($('#table'),tableBydate());

    /*------------------------------按钮事件----------------------------------------*/

    //查询
    $('#selectBtn').click(function(){

        //根据搜索日期，绘制空表格
        _datasTable($('#table'),tableBydate());

        conditionSelect();

    })

    //重置数据
    $('#resetBtn').click(function(){

        $('#spDT').val(nowTime);

        $('#epDT').val(et);

    })

    //tab切换
    $('.nav-tabs-lg').on('click','li',function(){

        conditionSelect();

    })

    //点击表格操作按钮，操作三餐
    $('#table tbody').on('click','.option-see',function(){

        //初始化
        modalInit();

        var date = $(this).parents('tr').children().eq(0).html();

        _currentTime = date;

        var str = '<span style="font-weight: bold">' + date + '</span>' + '餐次管理';

        //模态框
        _moTaiKuang($('#batch-Modal'),str,'','','','保存');

        //获取详情
        bindData(date);

    })

    //点击添加按钮
    $('.three-type-block').on('click','.add-meal',function(){

        //表格多选按钮启动
        _isClickTrMulti = true;

        //初始化
        $('#DC-type-new').val(-1);

        _datasTable($('#meal-table-multi'),[]);

        //当前操作的三餐类型
        _currentThree = $(this).attr('data-attr');

        if(valiteBatch()){

            //模态框
            _moTaiKuang($('#meal-Modal-multi'),'菜品列表','','','','选择');

            //赋值
            mealDataNew();

            //暂存所有数组
            editValue($('#table-m'),_firstMealMorningArr);

            editValue($('#table-n'),_firstMealNoonArr);

            editValue($('#table-e'),_firstMealEveningArr);

        }

    })

    //选择菜品模态框确定按钮
    $('#meal-Modal-multi').on('click','.btn-primary',function(){

        //获取数据，赋值给第一层模态框表格

        //获取选中的菜品
        var currentTr = $('#meal-table-multi tbody').children('.tables-hover');

        //首先去除菜品列表为空的情况

        if(currentTr.children('.dataTables_empty').length>0){

            return false;

        }

        var arr = [];

        for(var i=0;i<currentTr.length;i++){

            var current = currentTr.eq(i);

            var obj = {};

            //第几周
            obj.numweek = '';

            //菜品id
            obj.itemid = current.find('.cookname').children().attr('data-id');

            //菜品名称
            obj.cookname = current.find('.cookname').children().html();

            //餐饮类型
            obj.lx = current.find('.lxname').children().attr('data-attr');

            //餐饮类型名称
            obj.lxname = current.find('.lxname').children().html();

            //三餐类型
            obj.mmn = _currentThree;

            //餐厅id
            obj.dinningroomid = $('.nav-tabs-lg').children('.active').children('').attr('data-attr');

            //星期几
            obj.weekday = moment(_currentTime).day(); //moment($('#time').val()).day()

            //日期
            obj.dt = _currentTime;

            //总份数
            obj.totalQuantity = 0;

            //价格
            obj.price = current.find('.price').html();

            //适合人群
            obj.fitperson = current.find('.fit').html();

            //不适合人群
            obj.unfitperson = current.find('.unfit').html();

            arr.push(obj);

        }

        if(arr.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择菜品','');

            return false;

        }else{

            //遍历菜品数组，赋值给已选择的
            firstTableData(arr);

            //模态框消失
            $('#meal-Modal-multi').modal('hide');

        }

    })

    //菜品列表模态框消失事件
    $('#meal-Modal-multi').on('hide.bs.modal',function(){

        _isClickTrMulti = false;

    })

    //table输入框验证
    $('.three-table').on('keyup','input',function(){

        var className = $(this).attr('class');

        if(className.indexOf('tNum')>-1){

            //总份数验证
            var reg= /^[1-9]\d*$/; //大于0的整数

        }else if(className.indexOf('priceInput')>-1){

            //单价
            var reg= /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/; // 大于0的数字

        }

        if(reg.test($(this).val())){

            $(this).removeClass('errorFormat');

        }else{

            $(this).addClass('errorFormat');

        }

    })

    //删除
    $('.three-table tbody').on('click','.option-del',function(){

        if(valiteBatch()){

            //提示
            _moTaiKuang($('#edit-del-Modal'),'提示','',true,'确定要删除该菜品吗？','删除');

            var dom = $(this).parents('.three-table').attr('id')

            if(dom == 'table-m'){

                _currentThree = '早';

            }else if(dom == 'table-n'){

                _currentThree = '中'

            }else if(dom == 'table-e'){

                _currentThree = '晚'

            }

            editValue($('#table-m'),_firstMealMorningArr);

            editValue($('#table-n'),_firstMealNoonArr);

            editValue($('#table-e'),_firstMealEveningArr);

            _mealId = $(this).attr('data-attr');

        }

    })

    //删除菜品
    $('#edit-del-Modal').on('click','.btn-primary',function(){

        //删除选中的数组
        if(_currentThree == '早'){

            _firstMealMorningArr.removeByValue(_mealId,'itemid');

            _datasTable($('#table-m'),_firstMealMorningArr);

        }else if(_currentThree == '中'){

            _firstMealNoonArr.removeByValue(_mealId,'itemid');

            _datasTable($('#table-n'),_firstMealNoonArr);

        }else if(_currentThree == '晚'){

            _firstMealEveningArr.removeByValue(_mealId,'itemid');

            _datasTable($('#table-e'),_firstMealEveningArr);

        }

        //模态框
        $('#edit-del-Modal').modal('hide');

    })

    //批量操作确定按钮
    $('#batch-Modal').on('click','.btn-primary',function(){

        //验证
        if(valiteBatch()){

            editValue($('#table-m'),_firstMealMorningArr);

            editValue($('#table-n'),_firstMealNoonArr);

            editValue($('#table-e'),_firstMealEveningArr);

            var arr = _firstMealMorningArr.concat(_firstMealNoonArr);

            arr = arr.concat(_firstMealEveningArr);

            for(var i=0;i<arr.length;i++){

                arr[i].dt = _currentTime;

            }

            //for(var i=0;i<arr.length;i++){
            //
            //
            //
            //}

            var prm = {

                //餐厅id
                dinningroomid:$('.nav-tabs-lg').children('.active').children().attr('data-attr'),

                //日期
                dt:_currentTime,

                dayMenus:arr

            }

            _mainAjaxFunCompleteNew('post','YHQDC/DayMenubatchAdd',prm,$('#batch-Modal').children(),function(result){

                if(result.code == 99){

                    $('#batch-Modal').modal('hide');

                    conditionSelect();

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


            })

        }

    })

    //菜品类型切换
    $('#DC-type-new').on('change',function(){

        mealDataNew();
    })

    //复制餐次

    $('#copy-cc').click(function(){

        var prm = {

            //排班日期
            dt:_currentTime,
            //星期几
            weekday:moment(_currentTime).day(),
            //餐厅id
            dinningroomid:$('.nav-tabs-lg').children('.active').children().attr('data-attr'),
            //复制的排班日期
            dtcopy:$('#ccDT').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/DayMenucopy',prm,$('#batch-Modal').children(),function(result){

            if(result.code == 99){

                $('#batch-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    })

    /*------------------------------其他方法---------------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //部门
            departnum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQDC/ReturnDayMenuList',prm,$('.L-container'),function(result){

            _allData.length = 0;

            if(result.code == 99){

                _allData = result.data;

            }
            //首先筛选餐厅，然后筛选早中晚
            var currentDinning = $('.nav-tabs-lg').children('.active').children().attr('data-attr');

            var arr = [];

            for(var i=0;i<_allData.length;i++){

                if(_allData[i].dinningroomid == currentDinning){

                    arr.push(_allData[i]);

                }

            }

            var timeDom = $('#table tbody').children();

            //根据时间分组
            for(var i=0;i<timeDom.length;i++){

                var dom = timeDom.eq(i).children();

                var time = dom.eq(0).html();

                var mDom = dom.eq(1);

                var nDom = dom.eq(2);

                var eDom = dom.eq(3);

                var strM = '';

                var strN = '';

                var strE = '';

                for(var j=0;j<arr.length;j++){

                    if( arr[j].dt.split('T')[0] == time ){

                        //将数组分为早中晚
                        if(arr[j].mmn == '早'){

                            strM += '<span style="margin-right: 10px;">' + arr[j].cookname + '</span>';

                        }else if(arr[j].mmn == '中'){

                            strN += '<span style="margin-right: 10px;">' + arr[j].cookname + '</span>';

                        }else if(arr[j].mmn == '晚'){

                            strE += '<span style="margin-right: 10px;">' + arr[j].cookname + '</span>';

                        }

                    }

                }

                mDom.empty().append(strM);

                nDom.empty().append(strN);

                eDom.empty().append(strE);

            }



        })


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

            timeout:_theTimes,

            success:function(result){

                var str = '<option value="">全部</option>';

                var str1 = '<option value="">请选择</option>';

                var tabStr = '';

                if(result.code == 99){

                    restaurantArr = result.data;

                    for(var i=0;i<result.data.length;i++){

                        str += '<option value="' + result.data[i].id + '">' + result.data[i].diningroom + '</option>';

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

                $('#DC-restaurant').empty().append(str1);

                $('.nav-tabs-lg').empty().append(tabStr);

                conditionSelect();


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

    //根据当前搜索条件选中的日期，绘制空表格
    function tableBydate(){

        var sTime = $('#spDT').val();

        var eTime = $('#epDT').val();

        var du = dateDiffIncludeToday(sTime, eTime);

        var timeArr = [];

        for(var i=0;i<du;i++){

            var obj = {};

            var date = moment(sTime).add(i,'d').format('YYYY-MM-DD');

            //时间
            obj.time = date;

            timeArr.push(obj);

        }

        return timeArr

    }

    //两个日期相差几天
    function dateDiffIncludeToday(startDateString, endDateString){

        var separator = "-"; //日期分隔符

        var startDates = startDateString.split(separator);

        var endDates = endDateString.split(separator);

        var startDate = new Date(startDates[0], startDates[1]-1, startDates[2]);

        var endDate = new Date(endDates[0], endDates[1]-1, endDates[2]);

        return parseInt(Math.abs(endDate - startDate ) / 1000 / 60 / 60 /24) + 1;//把相差的毫秒数转换为天数
    };

    //获取菜品类型
    function MealType(){

        var prm = {

            lxbm:''

        }

        _mainAjaxFunCompleteOnly('post','YHQDC/RetrunCookStyleList',prm,false,function(result){

            var str = '<option value="">请选择</option>';

            var str1 = '<option value="-1">全部</option>';

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    str += '<option value="' + result.data[i].id + '">' + result.data[i].lxname + '</option>';

                    str1 += '<option value="' + result.data[i].id + '">' + result.data[i].lxname + '</option>';

                }

            }

            $('#DC-type').append(str);

            $('#DC-type-new').append(str1);

        })


    }

    //获取所有菜品数据（新）
    function mealDataNew(){

        var dinningroomid = $('.nav-tabs-lg').children('.active').children('a').attr('data-attr');

        var prm = {

            //餐厅
            dinningroomid:dinningroomid,

            //菜名
            cookname:'',

            //部门
            departnum:_userBM,

            //菜品类型
            lx:$('#DC-type-new').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/RetrunDinningbookList',prm,false,function(result){

            var arr = [];

            if(result.code == 99){

                arr = result.data;
            }

            var exitArr = [];

            if(_currentThree == '早'){

                for(var i=0;i<_firstMealMorningArr.length;i++){

                    exitArr.push(_firstMealMorningArr[i]);

                }


            }else if( _currentThree == '中' ){

                for(var i=0;i<_firstMealNoonArr.length;i++){

                    exitArr.push(_firstMealNoonArr[i]);

                }

            }else if( _currentThree == '晚' ){

                for(var i=0;i<_firstMealEveningArr.length;i++){

                    exitArr.push(_firstMealEveningArr[i]);

                }

            }

            var arr1 = [];

            //通过和已添加的菜品比较，如果添加过了，就不可以添加了
            for(var i=0;i<arr.length;i++){

                for(var j=0;j<exitArr.length;j++){

                    if(arr[i].id == exitArr[j].itemid){

                        arr1.push(arr[i]);

                        //console.log(arr);

                    }

                }

            }

            for(var i=0;i<arr1.length;i++){

                arr.remove(arr1[i])

            }

            _datasTable($('#meal-table-multi'),arr);

        })


    }

    //根据数组，给第一层表格赋值
    function firstTableData(arr){

        if(_currentThree == '早'){

            for(var i=0;i<arr.length;i++){

                _firstMealMorningArr.push(arr[i]);

            }

        }else if(_currentThree == '中'){

            for(var i=0;i<arr.length;i++){

                _firstMealNoonArr.push(arr[i]);

            }

        }else if(_currentThree == '晚'){

            for(var i=0;i<arr.length;i++){

                _firstMealEveningArr.push(arr[i]);

            }

        }

        _datasTable($('#table-m'),_firstMealMorningArr);

        _datasTable($('#table-n'),_firstMealNoonArr);

        _datasTable($('#table-e'),_firstMealEveningArr);

    }

    //模态框初始化
    function modalInit(){

        //菜品id
        _mealId = '';

        _firstMealMorningArr = [];

        _firstMealNoonArr = [];

        _firstMealEveningArr = [];

        _datasTable($('#table-m'),[]);

        _datasTable($('#table-n'),[]);

        _datasTable($('#table-e'),[]);

    }

    //批量操作验证
    function valiteBatch(){

        var input = $('.three-table tbody').find('input');

        for(var i=0;i<input.length;i++){

            var dom = input.eq(i)

            var className = dom.attr('class');

            if(className.indexOf('tNum')>-1){

                //总份数验证
                var reg= /^[1-9]\d*$/; //大于0的整数

            }else if(className.indexOf('priceInput')>-1){

                //单价
                var reg= /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/; // 大于0的数字

            }

            if(reg.test(dom.val())){

                dom.removeClass('errorFormat');

            }else{

                dom.addClass('errorFormat');

            }

        }

        var length = $('.three-table tbody').find('.errorFormat').length;

        if(length>0){

            return false;

        }else{

            return true;

        }

    }

    //获取修改后的单价和总份数
    function editValue(table,arr){

        var tr = table.children('tbody').children();

        for(var i=0;i<tr.length;i++){

            var id = tr.eq(i).find('.cookname').children().attr('data-id');

            var price = tr.eq(i).find('.price').children().val();;

            var num = tr.eq(i).find('.tNum').val();

            for(var j=0;j<arr.length;j++){

                if(id == arr[j].itemid){

                    arr[j].price = price;

                    arr[j].totalQuantity = num;


                }

            }

        }

    }

    //获取详情
    function bindData(date){

        var prm = {

            //日期
            dt:date,
            //餐厅id
            dinningroomid:$('.nav-tabs-lg').children('.active').children().attr('data-attr')
        }

        _mainAjaxFunCompleteNew('post','YHQDC/DayMenuDetails',prm,$('#table'),function(result){

            if(result.code == 99){

                if(result.data.length>0){

                    for(var i=0;i<result.data.length;i++){

                        var data = result.data[i];

                        if(data.mmn == '早'){

                            _firstMealMorningArr.push(data);

                        }else if(data.mmn == '中'){

                            _firstMealNoonArr.push(data);

                        }else if(data.mmn == '晚'){

                            _firstMealEveningArr.push(data);

                        }

                    }

                }else{

                }

            }

            _datasTable($('#table-m'),_firstMealMorningArr);

            _datasTable($('#table-n'),_firstMealNoonArr);

            _datasTable($('#table-e'),_firstMealEveningArr);

        })


    }

})