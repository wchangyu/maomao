$(function(){

    /*-------------------------------时间插件------------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

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

    //获取菜品类型
    MealType();

    //餐厅
    RestaurantType();

    //暂存所有菜品
    var _mealArr = [];

    mealData();

    //暂存所有数据
    var _allData = [];

    conditionSelect();

    //当前id
    var _thisId = '';

    //当前日期
    var _dt = '';

    /*------------------------------------------表格初始化---------------------------------*/

    var col = [
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

    _tableInit($('#meal-table'),col,'2','','','','','');

    /*-------------------------------------------表单验证----------------------------------*/

    //输入验证
    $('#commentForm').validate({

        rules:{
            //菜品名称
            'time':{

                required: true,

                isDate:true

            },
            //三餐类型选择
            'three-meal':{

                required: true

            },
            //菜品类型
            'DC-type':{

                required: true

            },
            //菜名
            'DC-name':{

                required: true

            },
            //价格
            'DC-prince':{

                required: true,

                number:true,

                min:0

            },
            //总份数
            'DC-num':{

                required: true,

                number:true,

                min:0

            }

        },
        messages:{

            //时间
            'time':{

                required: '时间是必选字段',

                isDate:'时间格式为YYYY-MM-DD'

            },
            //三餐类型选择
            'three-meal':{

                required: '三餐类型为必选字段'

            },
            //菜品类型
            'DC-type':{

                required: '菜品类型为必选字段'

            },
            //菜名
            'DC-name':{

                required: '菜品名称为必选字段'

            },
            //价格
            'DC-prince':{

                required: '价格为必填字段',

                number:'价格为大于0的数字类型',

                min:'价格为大于0的数字类型'

            },
            //总份数
            'DC-num':{

                required: '总份数为必填字段',

                number:'总份数为大于0的数字类型',

                min:'总份数为大于0的数字类型'

            }
        }

    });

    function validform(){

        return $('#commentForm').validate({

            rules:{
                //菜品名称
                'time':{

                    required: true,

                    isDate:true

                },
                //三餐类型选择
                '"three-meal':{

                    required: true

                },
                //菜品类型
                'DC-type':{

                    required: true

                },
                //菜名
                'DC-name':{

                    required: true

                },
                //价格
                'DC-prince':{

                    required: true,

                    number:true,

                    min:0

                },
                //总份数
                'DC-num':{

                    required: true,

                    number:true,

                    min:0

                }

            },
            messages:{

                //时间
                'time':{

                    required: '时间是必选字段',

                    isDate:'时间格式为YYYY-MM-DD'

                },
                //三餐类型选择
                '"three-meal':{

                    required: '三餐类型为必选字段'

                },
                //菜品类型
                'DC-type':{

                    required: '菜品类型为必选字段'

                },
                //菜名
                'DC-name':{

                    required: '菜品名称为必选字段'

                },
                //价格
                'DC-prince':{

                    required: '价格为必填字段',

                    number:'价格为大于0的数字类型',

                    min:'价格为大于0的数字类型'

                },
                //总份数
                'DC-num':{

                    required: '总份数为必填字段',

                    number:'总份数为大于0的数字类型',

                    min:'总份数为大于0的数字类型'

                }
            }

        });

    }

    /*--------------------------------按钮---------------------------------*/

    //新增
    $('#createBtn').click(function(){

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        //类
        //$('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //编辑和删除按钮消失
        $('#create-Modal').find('.btn-success').hide();

        $('#create-Modal').find('.btn-danger').hide();

        //是否可操作
        abledOption();
    })

    //新增【确定】按钮
    $('#create-Modal').on('click','.btn-primary',function(){

        if(validform().form()){

            sendData('YHQDC/DayMenuAdd',$('#create-Modal').children(),false,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }

    })

    //选择菜品
    $('#modal-select-meal').click(function(){

        //首先判断选择菜品类型了没有
        if($('#DC-type').val() == ''){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请先选择菜品类型','');

            return false;

        }

        //初始化
        $('#DC-type-modal').val($('#DC-type').children('option:selected').html()).attr('disabled',true);

        //模态框
        _moTaiKuang($('#meal-Modal'),'菜品列表','','','','选择');

        //数据(根据选中的类型筛选菜品)


        //var arr = [];
        //
        //for(var i=0;i<_mealArr.length;i++){
        //
        //    if(_mealArr[i].lx == $('#DC-type').val()){
        //
        //        arr.push(_mealArr[i]);
        //
        //    }
        //
        //}
        //
        ////console.log(arr);
        //
        //_datasTable($('#meal-table'),arr);


    })

    //选择菜品确定按钮
    $('#meal-Modal').on('click','.btn-primary',function(){

        var currentTr = $('#meal-table tbody').find('.tables-hover');

        if(currentTr.find('input').length == 0){

            _moTaiKuang($('#tip-Modal','提示',true,true,'请选择菜品',''));

            return false;

        }

        //赋值
        //菜品名称
        $('#DC-name').val(currentTr.find('.cookname').children().html());
        //菜品id
        $('#DC-name').attr('data-num',currentTr.find('.cookname').children().attr('data-id'));
        //菜品单价
        $('#DC-prince').val(currentTr.find('.price').html());

        $('#meal-Modal').modal('hide');

        if($('#DC-name').next('.error')){

            $('#DC-name').next('.error').hide();

        }


    })

    //点击列表中的每一个菜品名称，弹出基本详情
    $('#table tbody').on('click','span',function(){

        //初始化
        createModeInit();

        _thisId = $(this).attr('data-attr');

        //时间清空
        $('#time').val('');

        //模态框
        _moTaiKuang($('#create-Modal'),'操作',true,'','','保存');

        //编辑和删除按钮消失
        $('#create-Modal').find('.btn-success').show();

        $('#create-Modal').find('.btn-danger').show();

        //绑定数据
        bindData($(this).attr('data-attr'));

        //是否可编辑
        disabledOption();

    })

    //点击编辑
    $('#create-Modal').on('click','.btn-success',function(){

        //除了菜品名称都可编辑
        abledOption();

        //菜名
        $('#modal-select-meal').removeClass('modal-select-show');

        //菜品类型
        $('#DC-type').attr('disabled',true);

        //日期
        $('#time').attr('disabled',true);

        $(this).addClass('bianji').html('保存');

    })

    //编辑保存按钮
    $('#create-Modal').on('click','.bianji',function(){

        sendData('YHQDC/DayMenuUpdate',$('#create-Modal'),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    })

    //删除
    $('#create-Modal').on('click','.btn-danger',function(){

        //确定要删除吗？
        _moTaiKuang($('#del-Modal'),'提示','',true,'确定要删除吗？','删除');

    })

    //删除确定按钮
    $('#del-Modal').on('click','.btn-primary',function(){

        sendData('YHQDC/DayMenuDelete',$('#create-Modal'),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                $('#del-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    })

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        $('#DC-restaurant-con').val('');

        $('#spDT').val(st);

        $('#epDT').val(nowTime);

    })

    //批量删除
    $('#table tbody').on('click','.option-del',function(){

        var str = $(this).parents('tr').children().eq(0).html();

        _thisId = $(this).attr('data-attr');

        _dt = str;

        var strTip = '确定要删除<span style="font-weight: bold;margin: 0 10px;">' + str + '</span>的餐次吗？';

        _moTaiKuang($('#del-batch-Modal'),'提示','',true,strTip,'删除');

    })

    //批量删除确定按钮
    $('#del-batch-Modal').on('click','.btn-primary',function(){

        batchDel();

    })

    /*---------------------------------其他方法----------------------------*/

    //模态框初始化
    function createModeInit(){

        //时间格式
        $('.time-seat').hide();

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val('');

        $('#create-Modal').find('textarea').val('');

        //模态框中的时间默认
        $('#time').val(nowTime);

        $('#DC-name').removeAttr('data-num');

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

        $('#create-Modal').find('.btn-success').removeClass('bianji');

    }

    //获取菜品类型
    function MealType(){

        var prm = {

            lxbm:''

        }

        _mainAjaxFunCompleteOnly('post','YHQDC/RetrunCookStyleList',prm,false,function(result){

            var str = '<option value="">请选择</option>';

            var str1 = '<option value="">全部</option>';

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    str += '<option value="' + result.data[i].id + '">' + result.data[i].lxname + '</option>';

                    str1 += '<option value="' + result.data[i].id + '">' + result.data[i].lxname + '</option>';

                }

            }

            $('#DC-type').append(str);

        })


    }

    //餐厅
    function RestaurantType(){

        var prm = {

            diningroom:''

        }

        _mainAjaxFunCompleteOnly('post','YHQDC/ReturnDiningRoomsList',prm,false,function(result){

            var str = '<option value="">请选择</option>';

            var str1 = '<option value="">全部</option>';

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    str += '<option value="' + result.data[i].id + '">' + result.data[i].diningroom + '</option>';

                    str1 += '<option value="' + result.data[i].id + '">' + result.data[i].diningroom + '</option>';

                }

            }

            $('#DC-restaurant').append(str);

            $('#DC-restaurant-con').append(str1);

        })


    }

    //可操作
    function abledOption(){

        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        $('#modal-select-meal').addClass('modal-select-show');

    }

    //不可操作
    function disabledOption(){

        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

        $('#modal-select-meal').removeClass('modal-select-show');

    }

    //获取所有菜品数据
    function mealData(){

        var prm = {

            //餐厅
            dinningroomid:1,

            //菜名
            cookname:'',

            //时间


            //菜品类型
            lx:'-1'

        }

        _mainAjaxFunCompleteNew('post','YHQDC/RetrunDinningbookList',prm,false,function(result){

            if(result.code == 99){

                _mealArr = result.data;

            }

        })


    }

    //操作发送数据
    function sendData(url,el,flag,successFun){

        var prm = {

            //第几周
            numweek:'',
            //餐饮类型
            lx:$('#DC-type').val(),
            //菜品id
            itemid:$('#DC-name').attr('data-num'),
            //三餐类型
            mmn:$('#three-meal').val(),
            //餐厅id
            dinningroomid:1,
            //星期几
            weekday:moment($('#time').val()).day(),
            //日期
            dt:$('#time').val(),
            //总份数
            totalQuantity:$('#DC-num').val(),
            //价格
            price:$('#DC-prince').val()

        }

        if(flag){

            prm.id = _thisId

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun);


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

        _mainAjaxFunCompleteNew('post','YHQDC/ReturnDayMenuList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                //重组后的数组
                var resultArr = [];

                //根据时间分组，确定早中晚餐列表
                if(result.data.length >0){

                    var timeArr = _unique(_allData,'dt');

                    for(var i=0;i<timeArr.length;i++){

                        var arr = [];

                        for(var j=0;j<_allData.length;j++){

                            if(timeArr[i].dt == _allData[j].dt){

                                arr.push(_allData[j]);

                            }

                        }

                        resultArr.push(arr);

                    }

                }

                var str = '';

                for(var i=0;i<resultArr.length;i++){

                    //早
                    var strM = '';

                    //中
                    var strN = '';

                    //晚
                    var strE = '';

                    //保存所有

                    for(var j=0;j<resultArr[i].length;j++){

                        if(resultArr[i][j].mmn == '早'){

                            strM += '<span data-attr="' + resultArr[i][j].id + '" style="margin-right: 10px;">' + resultArr[i][j].cookname  + '</span>';

                        }else if(resultArr[i][j].mmn == '中'){

                            strN += '<span data-attr="' + resultArr[i][j].id + '" style="margin-right: 10px;">' + resultArr[i][j].cookname  + '</span>';

                        }else if(resultArr[i][j].mmn == '晚'){

                            strE += '<span data-attr="' + resultArr[i][j].id + '" style="margin-right: 10px;">' + resultArr[i][j].cookname + '</span>';


                        }


                    }

                    //开始
                    str += '<tr>';

                    //时间
                    str += '<td>' + resultArr[i][0].dt.split("T")[0] + '</td>';

                    //早餐
                    str += '<td>' + strM + "</td>";

                    //中餐
                    str += '<td>' + strN + '</td>';

                    //晚餐
                    str += '<td>' + strE + '</td>';

                    //操作（编辑）
                    str += '<td><div class="option-button option-del option-in" data-attr="' + resultArr[i][0].dinningroomid + '">删除</div></td>'

                    //闭合
                    str += '</tr>'


                }

                $('#table tbody').empty().append(str);

            }

            if(_allData.length == 0){

                var str = '<tr><td colspan="5">暂时没有餐次排班</td></tr>'

                $('#table tbody').empty().append(str);

            }


        })


    }

    //绑定数据
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].id == id){

                var data = _allData[i];

                //时间
                $('#time').val(data.dt.split('T')[0]);
                //类型
                $('#three-meal').val(data.mmn);
                //菜品类型
                $('#DC-type').val(data.lx);
                //菜品名称
                $('#DC-name').val(data.cookname);
                //菜品id
                $('#DC-name').attr('data-num',data.itemid);
                //价格
                $('#DC-prince').val(data.price);
                //总份数
                $('#DC-num').val(data.totalQuantity);

            }

        }

    }

    //批量删除
    function batchDel(){

        var prm = {

            //餐厅id
            dinningroomid:_thisId,
            //日期
            dt:_dt

        }

        _mainAjaxFunCompleteNew('post','YHQDC/DayMenuBatchDelete',prm,$('#del-batch-Modal').children(),function(result){

            if(result.code == 99){

                $('#del-batch-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })


    }

})

//表格单选标识

var _isClickTr = true;