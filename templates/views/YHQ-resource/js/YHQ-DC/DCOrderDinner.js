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

            if(state==true){

                $(this).val("1");

            }else{

                $(this).val("0");
            }
        }

    });

    //当前选中的

    /*-------------------------------时间插件------------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    /*------------------------------------------表格初始化---------------------------------*/

    var col = [

        {
            title:'餐厅',
            data:'dinningroom'
        },
        {
            title:'订餐日期',
            data:'orderdt'
        },
        {
            title:'订餐人',
            data:'userid'
        },
        {
            title:'订单状态',
            data:''
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

                return  '<span class="option-button option-see option-in" data-attr="' + full.id + '">' + '详情</span>' +

                    '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '编辑</span>' +

                    '<span class="option-button option-del option-in" data-attr="' + full.id + '">' + '删除</span>'


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    var mealCol = [
        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                //return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox"                                 value=""></span></div>'

                return '<div class="order-num-block">' +

                        '<img src="../YHQ-resource/img/subMeal.png" class="order-dinner-num order-dinner-sub" style="width: 15px;display: none">' +

                        '<span class="order-dinner-value" style="display: inline-block;width: 25px;height: 15px;vertical-align: middle;margin:0 3px;text-align: center;display: none">0</span>' +

                        '<img src="../YHQ-resource/img/addMeal.png" class="order-dinner-num order-dinner-add" style="width: 15px;">' +

                        '</div>'

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

    _tableInit($('#meal-table'),mealCol,'2','','','','','');


    /*------------------------------------------按钮事件----------------------------------*/

    //新增订单
    $('#createBtn').click(function(){

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        //

    });

    //点击放大镜选择菜品
    $('#modal-select-meal').click(function(){

        //初始化

        //模态框
        _moTaiKuang($('#meal-Modal'),'菜品列表','','','','选择');

        //数据
        _datasTable($('#meal-table'),_mealArr);

    })

    //点击订餐(增加)
    $('#meal-table tbody').on('click','.order-dinner-add',function(){

        var initNum = $(this).prev().html();

        initNum ++

        $(this).prev().html(initNum).show();

        $(this).prev().prev().show();

    })

    //点击订餐（减少）
    $('#meal-table tbody').on('click','.order-dinner-sub',function(){

        var initNum = $(this).next().html();

        if(initNum >1){

            initNum --

            $(this).next().html(initNum).show();

            $(this).next().next().show();

        }else{

            initNum = 0;

            $(this).next().html(initNum).hide();

            $(this).hide();

        }

    })

    //新增模态框消失事件
    $('#create-Modal').on('')

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


            }

        })


    }

    //操作发送数据
    function sendData(url,el,flag,successFun){

        var prm = {

            //餐厅id  -
            dinningroomid:1,
            //日期  -
            dt:'',
            //订餐人id  -
            userid:'',
            //总计
            Paysum:'',
            //三餐类型  -
            mmn:'',
            //是否可以取消
            cancancel:'',
            //送餐时间 -
            sendtime:'',
            //送餐地址 -
            sendaddr:'',
            //备注
            comment:'',
            //电话 -
            phone:'',
            //备注2
            note:'',
            //送餐费
            sendfee:'',
            //是否需要送餐
            needsend:'',
            //订餐人类型-
            userType:''

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



})

_isClickTr = true;