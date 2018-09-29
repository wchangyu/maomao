$(function(){

    /*---------------------------------------变量-----------------------------------------*/

    //存放所有数据
    var _allData = [];

    //当前的餐厅id
    var _thisId = '';

    /*----------------------------------------时间----------------------------------------*/

    //条件查询时间初始化
    _timeYMDComponentsFun11($('.abbrDT'));

    //模态框时间初始化
    _timeComponentsFun($('.DC-time'));

    /*----------------------------------------验证-----------------------------------------*/

    //输入验证
    $('#commentForm').validate({

        rules:{
            //餐厅名称
            'DC-name':{

                required: true

            },
            //地址
            'DC-location':{

                required: true

            },
            //电话
            'DC-tel':{

                required: true,

                phoneNumFormat:true

            },
            //经理
            'DC-manager':{

                required: true

            },
            //送餐费
            'DC-mealFee':{

                required: true,

                number:true,

                min:0

            },

            //早送餐时间
            'breakfast-time':{

                required: true,

                isTimeFormat:true

            },

            //早送餐时间截止
            'breakfast-end-time':{

                required: true,

                isTimeFormat:true

            },

            //中送餐时间
            'lunch-time':{

                required: true,

                isTimeFormat:true

            },

            //中送餐时间截止
            'lunch-end-time':{

                required: true,

                isTimeFormat:true

            },

            //晚送餐时间
            'dinner-time':{

                required: true,

                isTimeFormat:true

            },

            //晚送餐时间截止
            'dinner-end-time':{

                required: true,

                isTimeFormat:true

            }

        },
        messages:{

            //餐厅名称
            'DC-name':{

                required: '请输入餐厅名称'

            },
            //地址
            'DC-location':{

                required: '请输入餐厅地址'

            },
            //电话
            'DC-tel':{

                required: '请输入餐厅电话',

                phoneNumFormat:'请输入电话格式'

            },
            //经理
            'DC-manager':{

                required: '请输入经理姓名'

            },
            //送餐费
            'DC-mealFee':{

                required: '请输入送餐费',

                number:'请输入正确的金额'

            },

            //早送餐时间
            'breakfast-time':{

                required: '请输入早送餐时间'

            },

            //早送餐时间截止
            'breakfast-end-time':{

                required: '请输入早送餐截止时间'

            },

            //中送餐时间
            'lunch-time':{

                required: '请输中早送餐时间'

            },

            //中送餐时间截止
            'lunch-end-time':{

                required: '请输入中送餐截止时间'

            },

            //晚送餐时间
            'dinner-time':{

                required: '请输入晚送餐时间'

            },

            //晚送餐时间截止
            'dinner-end-time':{

                required: '请输入晚送餐截止时间'

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{
                //餐厅名称
                'DC-name':{

                    required: true

                },
                //地址
                'DC-location':{

                    required: true

                },
                //电话
                'DC-tel':{

                    required: true,

                    phoneNumFormat:true

                },
                //经理
                'DC-manager':{

                    required: true

                },
                //送餐费
                'DC-mealFee':{

                    required: true,

                    number:true,

                    min:0

                },

                //早送餐时间
                'breakfast-time':{

                    required: true,

                    isTimeFormat:true

                },

                //早送餐时间截止
                'breakfast-end-time':{

                    required: true

                },

                //中送餐时间
                'lunch-time':{

                    required: true

                },

                //中送餐时间截止
                'lunch-end-time':{

                    required: true

                },

                //晚送餐时间
                'dinner-time':{

                    required: true

                },

                //晚送餐时间截止
                'dinner-end-time':{

                    required: true

                }

            },
            messages:{

                //餐厅名称
                'DC-name':{

                    required: '请输入餐厅名称'

                },
                //地址
                'DC-location':{

                    required: '请输入餐厅地址'

                },
                //电话
                'DC-tel':{

                    required: '请输入餐厅电话',

                    phoneNumFormat:'请输入电话格式'

                },
                //经理
                'DC-manager':{

                    required: '请输入经理姓名'

                },
                //送餐费
                'DC-mealFee':{

                    required: '请输入送餐费',

                    number:'请输入正确的金额'

                },

                //早送餐时间
                'breakfast-time':{

                    required: '请输入早送餐时间'

                },

                //早送餐时间截止
                'breakfast-end-time':{

                    required: '请输入早送餐截止时间'

                },

                //中送餐时间
                'lunch-time':{

                    required: '请输中早送餐时间'

                },

                //中送餐时间截止
                'lunch-end-time':{

                    required: '请输入中送餐截止时间'

                },

                //晚送餐时间
                'dinner-time':{

                    required: '请输入晚送餐时间'

                },

                //晚送餐时间截止
                'dinner-end-time':{

                    required: '请输入晚送餐截止时间'

                }
            }

        });

    }

    /*------------------------------------------表格初始化---------------------------------*/

    var col = [

        {
            title:'餐厅名称',
            data:'diningroom'
        },
        {
            title:'地址',
            data:'address'
        },
        {
            title:'电话',
            data:'phone'
        },
        {
            title:'经理',
            data:'manager'
        },
        {
            title:'类型',
            data:'lx',
            render:function(data, type, full, meta){

                if(data == 0){

                    return '对外'

                }else if(data == 1){

                    return '对内'

                }else{

                    return ''

                }


            }
        },
        {
            title:'送餐费(元)',
            data:'sendfee'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                return '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '编辑</span>' +

                    '<span class="option-button option-del option-in" data-attr="' + full.id + '">' + '删除</span>'


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    conditionSelect();

    /*----------------------------------------按钮事件-------------------------------------*/

    //新增
    $('#createBtn').click(function(){

        //loadding
        $('.L-container').showLoading();

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        $('.L-container').hideLoading();

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可操作
        abledOption();

    })

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){

            sendData('YHQDC/DiningRoomsAdd',$('#create-Modal').children(),false,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect()

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }else{

            _timeShow($('#create-Modal'));

        }

    })

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        $('#DC-nameCon').val('');

    })

    //时间验证通过
    $('#create-Modal').find('.time-tool-block').on('keyup','input',function(){

        _timeShow($('#create-Modal'));

    })

    $('#create-Modal').on('click',function(){

        _timeShow($('#create-Modal'));

    })

    //编辑
    $('#table tbody').on('click','.option-edit',function(){

        //初始化
        createModeInit();
        //模态框
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');
        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');
        //是否可操作
        abledOption();
        //绑定值
        _thisId = $(this).attr('data-attr');

        bindData(_thisId);

    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form()){

            sendData('YHQDC/DiningRoomsUpdate',$('#create-Modal').children(),true,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect()

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }else{

            _timeShow($('#create-Modal'));

        }

    })

    //删除
    $('#table tbody').on('click','.option-del',function(){

        //初始化
        createModeInit();
        //模态框
        _moTaiKuang($('#create-Modal'),'确定要删除吗？','','','','删除');
        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');
        //是否可操作
        disAbledOption();
        //绑定值
        _thisId = $(this).attr('data-attr');

        bindData(_thisId);

    })

    //删除确定按钮
    $('#create-Modal').on('click','.shanchu',function(){

        sendData('YHQDC/DiningRoomsDelete',$('#create-Modal').children(),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect()

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    })

    /*-----------------------------------其他方法------------------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            diningroom:$('#DC-nameCon').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/ReturnDiningRoomsList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _jumpNow($('#table'),result.data);

            }

        })


    }

    //操作发送数据
    function sendData(url,el,flag,successFun){

        var prm = {

            //餐厅名称
            diningroom:$('#DC-name').val(),
            //地址
            address:$('#DC-location').val(),
            //电话
            phone:$('#DC-tel').val(),
            //经理
            manager:$('#DC-manager').val(),
            //类型
            lx:$('#DC-type').find('.checked').children().val(),
            //送餐费
            sendfee:$('#DC-mealFee').val(),
            //早送餐时间
            morningsendtime:$('#breakfast-time').val(),
            //早送餐时间截止
            morningordertime:$('#breakfast-end-time').val(),
            //中送餐时间
            noonsendtime:$('#lunch-time').val(),
            //中送餐时间截止
            noonordertime:$('#lunch-end-time').val(),
            //晚送餐时间
            eveningsendtime:$('#dinner-time').val(),
            //晚送餐时间截止
            eveningordertime:$('#dinner-end-time').val(),
            //备注
            comment:$('#DC-remark').val()
        }

        if(flag){

            prm.id = _thisId

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun);

    }

    //初始化
    function createModeInit(){

        //时间验证占位dom隐藏
        $('.time-seat').hide();

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val('');

        $('#create-Modal').find('textarea').val('');

        //单选按钮
        $('#create-Modal').find('.radio').children().removeClass('checked');

        $('#create-Modal').find('.radio').children().eq(0).addClass('checked');

    }

    //可以操作
    function abledOption(){

        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

    }

    //不可以操作
    function disAbledOption(){

        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

    }

    //绑定数据
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            var data = _allData[i];

            if(data.id == id){

                //餐厅名称
                $('#DC-name').val(data.diningroom);
                //地址
                $('#DC-location').val(data.address);
                //电话
                $('#DC-tel').val(data.phone);
                //经理
                $('#DC-manager').val(data.manager);
                //类型
                $('#create-Modal').find('.radio').children().removeClass('checked');

                if(data.lx == 0){

                    //对外
                    $('#create-Modal').find('.radio').children().eq(0).addClass('checked');

                }else if(data.lx == 1){

                    //对内
                    $('#create-Modal').find('.radio').children().eq(1).addClass('checked');
                }

                //送餐费
                $('#DC-mealFee').val(data.sendfee);
                //早送餐时间
                $('#breakfast-time').val(data.morningsendtime);
                //早送餐时间截止
                $('#breakfast-end-time').val(data.morningordertime);
                //中送餐时间
                $('#lunch-time').val(data.noonsendtime);
                //中送餐时间截止
                $('#lunch-end-time').val(data.noonordertime);
                //晚送餐时间
                $('#dinner-time').val(data.eveningsendtime);
                //晚送餐时间截止
                $('#dinner-end-time').val(data.eveningordertime);

            }

        }

    }

})