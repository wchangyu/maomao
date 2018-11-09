$(function(){

    _isClickTr = true;

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

            //司机姓名
            'CA-userName':{

                required: true

            },
            //身份证号码
            'CA-idCard':{

                required: true

            },
            //出生年月
            'CA-birth':{

                isDate1:true

            },
            //登记时间
            'CA-regDate':{

                isDate1:true

            },
            //手机
            'CA-mobile':{

                phoneNumFormat:true

            },
            //电话
            'CA-phone':{

                phoneNumFormat:true

            }

        },
        messages:{

            //司机姓名
            'CA-userName':{

                required: '司机姓名是必填字段'

            },
            //身份证号码
            'CA-idCard':{

                required: '身份证号码是必填字段'

            },

        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //司机姓名
                'CA-userName':{

                    required: true

                },
                //身份证号码
                'CA-idCard':{

                    required: true

                },
                //出生年月
                'CA-birth':{

                    isDate1:true

                },
                //登记时间
                'CA-regDate':{

                    isDate1:true

                },
                //手机
                'CA-mobile':{

                    phoneNumFormat:true

                },
                //电话
                'CA-phone':{

                    phoneNumFormat:true

                }

            },
            messages:{

                //司机姓名
                'CA-userName':{

                    required: '司机姓名是必填字段'

                },
                //身份证号码
                'CA-idCard':{

                    required: '身份证号码是必填字段'

                },

            }

        });

    }

    //验证合同名称是否存在
    $.validator.addMethod("isExist",function(value,element,params){

        var flag = true;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].idNum == value && _allData[i].idNum!= _isExist){

                flag = false;

                break;

            }

        }

        return flag;

    },"该号码已存在");

    /*-----------------------------表格初始化--------------------------------*/

    var col=[

        {
            title:'司机姓名',
            data:'userName'
        },
        {
            title:'司机工号',
            data:'userNum'
        },
        {
            title:'状态',
            data:'status',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '出车'

                }else{

                    return '空闲'

                }

            }
        },
        {
            title:'性别',
            data:'gender',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '男'

                }else if(data ==2){

                    return '女'

                }else{

                    return ''

                }

            }
        },
        {
            title:'驾驶证档案号',
            data:'dlNum'
        },
        {
            title:'准驾车型',
            data:'dlclass'
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

    //司机表格
    var driverCol = [

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

    _tableInitSearch($('#sign-table'),driverCol,'2','','','','','',10,'','','',true);

    //司机列表
    driverPerson();

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

        //自动返回
        $('.autoBack').hide();

    })

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){

            sendData('YHQCA/CADriverAdd',$('#create-Modal').children(),false,function(result){

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

        $('#CA-driverCon').val('');

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

            sendData('YHQCA/CADriverUpdate',$('#create-Modal').children(),true,function(result){

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

        sendData('YHQCA/CADriverDelete',$('#create-Modal').children(),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


        })

    })

    //选择司机
    $('#select-user').on('click',function(){

        _moTaiKuang($('#driver-Modal'),'司机列表','','','','确定');

    })

    //确定签订人
    $('#driver-Modal').on('click','.btn-primary',function(){

        //验证是否选择
        var currentTr = $('#sign-table tbody').children('.tables-hover');

        if(currentTr.length== 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择合同签订人','');

            return false;

        }

        if(currentTr.children('.dataTables_empty').length>0){

            return false;

        }

        var num = currentTr.find('.checker').attr('data-id');

        var name = currentTr.children().eq(1).html();

        $('#driver-Modal').modal('hide');

        $('#CA-userNum').val(num);

        $('#CA-userName').val(name);

        $('#CA-userName').next('.error').hide();

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //司机姓名
            userName:$('#CA-driverCon').val(),
            //司机状态
            status:-1
            ////用户ID
            //userID:_userIdNum,
            ////用户名
            //userName:_userIdName,
            ////用户角色
            //b_UserRole:_userRole,
            ////用户部门
            //b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQCA/ReturnCADriverList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }

    //初始化
    function createModeInit(){

        _creatInit();

        $('#ones').val(1);

        $('#twos').val(2);

    }

    //发送数据
    function sendData(url,el,flag,successFun){

        var prm = {

            //用户编号
            userNum:$('#CA-userNum').val(),
            //用户姓名
            userName:$('#CA-userName').val(),
            //性别
            gender:$('#CA-gender').find('.checked').children().val(),
            //出生年月
            birth:$('#CA-birth').val(),
            //家庭住址
            address:$('#CA-location').val(),
            //电话
            phone:$('#CA-phone').val(),
            //手机
            mobile:$('#CA-mobile').val(),
            //驾驶证档案号
            dlNum:$('#CA-driving').val(),
            //准驾车型
            dlclass:$('#CA-car-model').val(),
            //登记时间
            regDate:$('#CA-regDate').val(),
            //备注
            remark:$('#CA-remark').val(),
            //身份证
            idNum:$('#CA-idCard').val()

        }

        if(flag){

            prm.id = _thisId;

            prm.status = $('#CA-status').val()

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun)

    }

    //绑定赋值
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            var data = _allData[i];

            if(data.id == id){

                _isExist = data.idNum;

                //用户编号
                $('#CA-userNum').val(data.userNum);
                //用户姓名
                $('#CA-userName').val(data.userName);
                //性别
                $('#create-Modal').find('.radio').children().removeClass('checked');

                if(data.gender == 1){

                    //对外
                    $('#create-Modal').find('.radio').children().eq(0).addClass('checked');

                }else if(data.gender == 2){

                    //对内
                    $('#create-Modal').find('.radio').children().eq(1).addClass('checked');
                }

                if(data.birth != '' && data.birth != null){

                    //出生年月
                    $('#CA-birth').val(data.birth.split('T')[0]);

                }
                //家庭住址
                $('#CA-location').val(data.address);
                //电话
                $('#CA-phone').val(data.phone);
                //手机
                $('#CA-mobile').val(data.mobile);
                //驾驶证档案号
                $('#CA-driving').val(data.dlNum);
                //准驾车型
                $('#CA-car-model').val(data.dlclass);
                //登记时间
                if(data.regDate != '' && data.regDate != null){

                    $('#CA-regDate').val(data.regDate.split('T')[0]);

                }
                //备注
                $('#CA-remark').val(data.remark);
                //身份证
                $('#CA-idCard').val(data.idNum);
                //状态
                $('#CA-status').val(data.status);
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

    //获取签订人
    function driverPerson(){

        var prm = {

            'userID':_userIdNum,

            'userName':_userIdName

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetUsers',prm,false,function(result){

            _datasTable($('#sign-table'),result);



        })

    }


})