$(function(){

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    var _isExist = '';

    //当前操作的id
    var _thisId = '';

    //时间初始化
    _timeYMDComponentsFunValite($('.abbrDT'));

    /*-----------------------------验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //车牌号码
            'CA-carNum':{

                required: true,

                isExist:_isExist

            },
            //汽车类型
            'CA-type':{

                required: true,

            },
            //发动机号码
            'CA-engineNum':{

                required: true

            },
            //型号
            'CA-model':{

                required: true

            },
            //购买日期
            'CA-purDate':{

                isDate1:true

            },
            //座位数
            'CA-seats':{

                required: true,

                number:true,

                min:1

            },
            //里程
            'CA-mileage':{

                number:true,

                digits:true

            }


        },
        messages:{

            //车牌号码
            'CA-carNum':{

                required: '车牌号码为必填字段',

                isExist:'车牌号码已存在'

            },
            //汽车类型
            'CA-type':{

                required: '汽车类型为必选字段',

            },
            //发动机号码
            'CA-engineNum':{

                required: '发动机号码是必填字段'

            },
            //型号
            'CA-model':{

                required: '型号是必填字段'

            },
            //座位数
            'CA-seats':{

                required: '座位数是必填字段',

                number:'座位数为大于0的整数',

                min:'座位数为大于0的整数'

            },
            //里程
            'CA-mileage':{

                number:'里程数为正整数',

                digits:'里程数为正整数'

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //车牌号码
                'CA-carNum':{

                    required: true,

                    isExist:_isExist

                },
                //汽车类型
                'CA-type':{

                    required: true,

                },
                //发动机号码
                'CA-engineNum':{

                    required: true

                },
                //型号
                'CA-model':{

                    required: true

                },
                //购买日期
                'CA-purDate':{

                    isDate1:true

                },
                //座位数
                'CA-seats':{

                    required: true,

                    number:true,

                    min:1

                },
                //里程
                'CA-mileage':{

                    number:true,

                    digits:true

                }


            },
            messages:{

                //车牌号码
                'CA-carNum':{

                    required: '车牌号码为必填字段',

                    isExist:'车牌号码已存在'

                },
                //汽车类型
                'CA-type':{

                    required: '汽车类型为必选字段',

                },
                //发动机号码
                'CA-engineNum':{

                    required: '发动机号码是必填字段'

                },
                //型号
                'CA-model':{

                    required: '型号是必填字段'

                },
                //座位数
                'CA-seats':{

                    required: '座位数是必填字段',

                    number:'座位数为大于0的整数',

                    min:'座位数为大于0的整数'

                },
                //里程
                'CA-mileage':{

                    number:'里程数为正整数',

                    digits:'里程数为正整数'

                }
            }

        });

    }

    //验证合同名称是否存在
    $.validator.addMethod("isExist",function(value,element,params){

        var flag = true;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].carNum == value && _allData[i].carNum!= _isExist){

                flag = false;

                break;

            }

        }

        return flag;

    },"车牌号码已存在");

    /*-----------------------------表格初始化--------------------------------*/

    var col=[

        {
            title:'车辆号码',
            data:'carNum'
        },
        {
            title:'发动机号码',
            data:'engineNum'
        },
        {
            title:'汽车类型',
            data:'cartype',
            render:function(data, type, full, meta){

                var str = '';

                if(data == 1){

                    str = '普通车'

                }else if(data == 2){

                    str = '救护车'

                }

                return str

            }
        },
        {
            title:'型号',
            data:'model'
        },
        {
            title:'状态',
            data:'status',
            render:function(data, type, full, meta){

                return statusCar(data);

            }
        },
        {
            title:'座位数',
            data:'seats'
        },
        {
            title:'品牌',
            data:'brand'
        },
        {
            title:'颜色',
            data:'color'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '';

                str += '<span class="option-button option-see option-in" data-attr="' + full.id + '">' + '查看</span>' +

                     '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '编辑</span>' +

                    '<span class="option-button option-del option-in" data-attr="' + full.id + '">' + '删除</span>'

                return str


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    conditionSelect();

    /*-----------------------------按钮事件----------------------------------*/

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //新增
    $('#createBtn').click(function(){

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //可操作
        abledOption();

        //不需要填写，自动生成
        $('.autoBack').hide();

    })

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){

            sendData('YHQCA/CACarAdd',$('#create-Modal').children(),false,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


            })

        }

    })

    //重置
    $('#resetBtn').click(function(){

        $('#CA-carnumCon').val('');

    })

    //查看
    $('#table tbody').on('click','.option-see',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'查看详情',true,'','','保存');

        //赋值
        bindData(_thisId);

        //不可操作
        disAbledOption();

    })

    //编辑
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');

        //赋值
        bindData(_thisId);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //可操作
        abledOption();

    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form()){

            sendData('YHQCA/CACarUpdate',$('#create-Modal').children(),true,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


            })

        }

    })

    //删除
    $('#table tbody').on('click','.option-del',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'确定要删除吗','','','','删除');

        //赋值
        bindData(_thisId);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //可操作
        disAbledOption();

    })

    //删除确定按钮
    $('#create-Modal').on('click','.shanchu',true,function(){

        sendData('YHQCA/CACarDelete',$('#create-Modal').children(),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


        })

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //车辆编号
            carNum:$('#CA-carnumCon').val(),
            //状态
            status:$('#CA-statusCon').val(),
            //汽车类型
            cartype:$('#CA-typeCon').val()
            ////用户ID
            //userID:_userIdNum,
            ////用户名
            //userName:_userIdName,
            ////用户角色
            //b_UserRole:_userRole,
            ////用户部门
            //b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQCA/ReturnCACarList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }

    //初始化
    function createModeInit(){

        _creatInit();

    }

    //发送数据
    function sendData(url,el,flag,successFun){

        var prm = {

            //车牌号码
            carNum:$('#CA-carNum').val(),
            //发动机号码
            engineNum:$('#CA-engineNum').val(),
            //型号
            model:$('#CA-model').val(),
            //品牌
            brand:$('#CA-brand').val(),
            //颜色
            color:$('#CA-color').val(),
            //排量
            output:$('#CA-output').val(),
            //购买原值
            carMoney:$('#CA-carMoney').val(),
            //购买日期
            purDate:$('#CA-purDate').val(),
            //座位数
            seats:$('#CA-seats').val(),
            //生产厂家
            producer:$('#CA-producer').val(),
            //车辆状态
            status:$('#CA-status').val(),
            //车架号
            vinNum:$('#CA-vinNum').val(),
            //燃油号
            fueltype:$('#CA-fueltype').val(),
            //备注
            remark:$('#CA-remark').val(),
            //里程
            mileage:$('#CA-mileage').val(),
            //类型
            cartype:$('#CA-type').val()

        }

        if(flag){

            prm.id = _thisId;

            //状态
            prm.status = $('#CA-status').val()

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun)

    }

    //绑定赋值
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            var data = _allData[i];

            if(data.id == id){

                _isExist = data.carNum;

                //车牌号码
                $('#CA-carNum').val(data.carNum);
                //发动机号码
                $('#CA-engineNum').val(data.engineNum);
                //型号
                $('#CA-model').val(data.model);
                //品牌
                $('#CA-brand').val(data.brand);
                //颜色
                $('#CA-color').val(data.color);
                //排量
                $('#CA-output').val(data.output);
                //购买原值
                $('#CA-carMoney').val(data.carMoney);
                //购买日期

                if(data.purDate != ''){

                    $('#CA-purDate').val(data.purDate.split('T')[0]);

                }

                //座位数
                $('#CA-seats').val(data.seats);
                //生产厂家
                $('#CA-producer').val(data.producer);
                //车辆状态
                $('#CA-status').val(data.status);
                //车架号
                $('#CA-vinNum').val(data.vinNum);
                //燃油号
                $('#CA-fueltype').val(data.fueltype);
                //备注
                $('#CA-remark').val(data.remark);
                //里程
                $('#CA-mileage').val(data.mileage);
                //汽车状态
                $('#CA-status').val(data.status);
                //类型
                $('#CA-type').val(data.cartype);
            }

        }

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

    //汽车状态
    function statusCar(data){

        var str = ''

        if(data == 0){

            str = '空闲'

        }else if(data == 1){

            str = '出车'

        }else if(data ==2){

            str = '维修'

        }else if(data == 3){

            str = '报废'

        }

        return str

    }


})