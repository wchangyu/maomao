$(function(){

    _isClickTr = true;

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    //当前操作的申请编号
    var _thisId = '';

    //时间初始化
    _timeHMSComponentsFunValite($('.abbrDT'));

    /*-----------------------------验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //选择司机
            'CA-driver':{

                required:true

            },
            //司机名称
            'CA-driverNum':{

                required:true

            },
            //汽车
            'CA-car':{

                required:true

            }
        },
        messages:{

            //选择司机
            'CA-driver':{

                required:'司机是必选字段'

            },
            //司机名称
            'CA-driverNum':{

                required:'司机是必选字段'

            },
            //汽车
            'CA-car':{

                required:'车牌号是必选字段'

            }

        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //选择司机
                'CA-driver':{

                    required:true

                },
                //司机名称
                'CA-driverNum':{

                    required:true

                },
                //汽车
                'CA-car':{

                    required:true

                }
            },
            messages:{

                //选择司机
                'CA-driver':{

                    required:'司机是必选字段'

                },
                //司机名称
                'CA-driverNum':{

                    required:'司机是必选字段'

                },
                //汽车
                'CA-car':{

                    required:'车牌号是必选字段'

                }

            }

        });

    }

    /*-----------------------------表格初始化--------------------------------*/

    //主表格
    var col=[
        {
            title:'申请编号',
            data:'caNum',
            render:function(data, type, full, meta){

                return '<a href="CADetails.html?num=' + data + '" target="_blank">' + data + '</a>'

            }
        },
        {
            title:'申请人',
            data:'causerName'
        },
        {
            title:'申请人部门',
            data:'departName'
        },
        {
            title:'负责人',
            data:'leaderName'
        },
        {
            title:'出发地',
            data:'startAddress'
        },
        {
            title:'目的地',
            data:'destAddress'
        },
        {
            title:'出发时间',
            data:'caTime'
        },
        {
            title:'申请理由',
            data:'caMemo'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '';

                str += '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '受理</span>' +

                    '<span class="option-button option-del option-in" data-attr="' + full.id + '">' + '取消</span>'

                return str


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    //司机表格
    var driverCol=[
        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'司机姓名',
            data:'userName'
        },
        {
            title:'司机工号',
            data:'userNum'
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
        }

    ]

    _tableInitSearch($('#driver-table'),driverCol,'2','','','','','',10,'','','',true);

    //车辆表格
    var carCol=[
        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'车辆号码',
            data:'carNum'
        },
        {
            title:'发动机号码',
            data:'engineNum'
        },
        {
            title:'型号',
            data:'model'
        },
        {
            title:'座位数',
            data:'seats'
        },
        {
            title:'品牌',
            data:'brand'
        }

    ]

    _tableInitSearch($('#car-table'),carCol,'2','','','','','',10,'','','',true);

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

    //派车
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).parents('tr').children().eq(0).children().html();

        //初始化
        createModeInit();

        //派车显示
        $('.send-block').show();

        //模态框
        _moTaiKuang($('#create-Modal'),'派车','','','','确定');

        //赋值
        bindData(_thisId);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //可操作
        abledOption();

    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        sendCar();

    })

    //驳回（取消）
    $('#table tbody').on('click','.option-del',function(){

        _thisId = $(this).parents('tr').children().eq(0).children().html();

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'确定要取消吗','','','','取消');

        //赋值
        bindData(_thisId);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //可操作
        disAbledOption();

        //取消理由可操作
        $('#CA-cancel').attr('disabled',false);


    })

    //删除确定按钮
    $('#create-Modal').on('click','.shanchu',true,function(){

        cancelCar();

    })

    //确定签订人
    $('#person-Modal').on('click','.btn-primary',function(){

        //验证是否选择

        var currentTr = _isSelectTr($('.person-table'));

        if(currentTr){

            var num = currentTr.find('.checker').attr('data-id');

            var name = currentTr.children().eq(1).html();

            var tel = currentTr.children().eq(4).html();

            var depNum = currentTr.children().eq(2).children().attr('data-attr');

            var depName = currentTr.children().eq(2).children().html();

            $('#person-Modal').modal('hide');

            if(_currentPersonDom == 'CA-applyNum' ){

                //申请人
                $('#CA-applyNum').val(num);

                //申请人姓名
                $('#CA-applyName').val(name);

                //申请人电话
                $('#CA-applyTel').val(tel);

                //申请人部门
                $('#CA-applyDepart').val(depName);

                $('#CA-applyDepart').attr('data-attr',depNum);

                $('#CA-applyName').next().hide();

                $('#CA-applyTel').next().hide();


            }else if(_currentPersonDom == 'CA-personChangeNum'){

                //负责人信息
                $('#CA-personChange').val(name);

                //负责人姓名
                $('#CA-personChangeNum').val(num);

                //申请人电话
                $('#CA-personChangeTel').val(tel);

                $('#CA-personChange').next().hide();

            }

            $('#CA-userNum').val(num);

            $('#CA-userName').val(name);

            $('#CA-userName').next('.error').hide();

        }

    })

    //选择汽车按钮
    $('.carButtonSelect').click(function(){

        _moTaiKuang($('#car-Modal'),'车辆列表','','','','选择');

        //数据
        carData();

    })

    //确定汽车按钮
    $('#car-Modal').on('click','.btn-primary',function(){

        var currentTr = _isSelectTr($('#car-table'));

        if(currentTr){

            //获取选中的车辆信息

            var num = currentTr.find('.checker').attr('data-id');

            var name = currentTr.children().eq(1).html();

            $('#CA-car').attr('data-attr',num);

            $('#CA-car').val(name);

            $('#car-Modal').modal('hide');

            $('#CA-car').next('.error').hide();

        }

    })

    //选择司机按钮
    $('.driverButtonSelect').click(function(){

        _moTaiKuang($('#driver-Modal'),'司机列表','','','','选择');

        //数据
        driverData();

    })

    //确定司机按钮
    $('#driver-Modal').on('click','.btn-primary',function(){

        var currentTr = _isSelectTr($('#driver-table'));

        if(currentTr){

            //获取选中的车辆信息

            var id = currentTr.find('.checker').attr('data-id');

            var name = currentTr.children().eq(1).html();

            var num = currentTr.children().eq(2).html();

            $('#CA-driver').attr('data-id',id);

            $('#CA-driver').attr('data-num',num);

            $('#CA-driver').val(name);

            $('#CA-driverNum').val(num);

            $('#driver-Modal').modal('hide');

            $('#CA-driver').next('.error').hide();

            $('#CA-driverNum').next('.error').hide();

        }

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //状态为10的
            caStatus:10,
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQCA/GetCAInfos',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }

    //初始化
    function createModeInit(){

        _creatInit();

        $('#CA-car').removeAttr('data-attr');

        $('#CA-driver').removeAttr('data-attr');

        $('.acceptance-block').hide();

    }

    //发送数据
    function sendData(url,el,flag,successFun){

        var prm = {

            //申请人工号
            causerNum:$('#CA-applyNum').val(),
            //申请人姓名
            causerName:$('#CA-applyName').val(),
            //申请人电话
            Causerphone:$('#CA-applyTel').val(),
            //申请部门编码
            departNum:$('#CA-applyDepart').attr('data-attr'),
            //申请部门名称
            departName:$('#CA-applyDepart').val(),
            //出发地
            StartAddress:$('#CA-departure').val(),
            //目的地
            destAddress:$('#CA-destination').val(),
            //出发时间
            startTime:$('#CA-leave-time').val(),
            //预计回场时间
            EstEndTime:$('#CA-back-time').val(),
            //预计公里数
            Distance:$('#CA-km').val(),
            //乘车人数
            UserCnt:$('#CA-personNum').val(),
            //负责人工号
            leaderNum:$('#CA-personChangeNum').val(),
            //乘车负责人
            leaderName:$('#CA-personChange').val(),
            //负责人电话
            Leaderphone:$('#CA-personChangeTel').val(),
            //申请理由
            caMemo:$('#CA-remark').val()

        }

        if(flag){

            prm.id = _thisId;

        }

        console.log(prm);

        return false;

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun)

    }

    //绑定赋值
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            var data = _allData[i];

            if(data.caNum == id){

                //申请人工号
                $('#CA-applyNum').val(data.causerNum);
                //申请人姓名
                $('#CA-applyName').val(data.causerName);
                //申请人电话
                $('#CA-applyTel').val(data.causerphone);
                //申请部门编码
                $('#CA-applyDepart').attr('data-attr',data.departNum);
                //申请部门名称
                $('#CA-applyDepart').val(data.departName);
                //出发地
                $('#CA-departure').val(data.startAddress);
                //目的地
                $('#CA-destination').val(data.destAddress);
                //出发时间
                if(data.caTime != ''){

                    $('#CA-leave-time').val(data.caTime.replace(/T/g,' '));

                }
                //预计回场时间

                if(data.estEndTime != ''){

                    $('#CA-back-time').val(data.estEndTime.replace(/T/g,' '));

                }
                //预计公里数
                $('#CA-km').val(data.estdistance);
                //乘车人数
                $('#CA-personNum').val(data.userCnt);
                //负责人工号
                $('#CA-personChangeNum').val(data.leaderNum);
                //乘车负责人
                $('#CA-personChange').val(data.leaderName);
                //负责人电话
                $('#CA-personChangeTel').val(data.leaderphone);
                //申请理由
                $('#CA-remark').val(data.caMemo);
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

        $('#CA-acceptanceRemark').attr('disabled',false);

    }

    //派车
    function sendCar(){

        if(validform().form()){

            prm = {

                //派车单编号
                canum:_thisId,
                //派车人
                sendusernum:_userIdNum,
                //派车人姓名
                sendusername:_userIdName,
                //车牌号码
                carnum:$('#CA-car').val(),
                //司机编号
                drivernum:$('#CA-driver').attr('data-num'),
                //司机id
                driverid:$('#CA-driver').attr('data-id'),
                //司机姓名
                drivername:$('#CA-driver').val(),
                //备注
                remark:$('#CA-acceptanceRemark').val(),
                //用户ID
                userID:_userIdNum,
                //用户名
                userName:_userIdName,
                //用户角色
                b_UserRole:_userRole,
                //用户部门
                b_DepartNum:_userBM

            }

            _mainAjaxFunCompleteNew('post','YHQCA/AcceptCA',prm,$('#create-Modal').children(),function(result){

                if(result.code == 99){

                    conditionSelect();

                    $('#create-Modal').modal('hide');

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }

    }

    //取消
    function cancelCar(){

        prm = {

            //派车单编号
            canum:_thisId,
            //备注
            remark:$('#CA-acceptanceRemark').val(),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQCA/CancelCA',prm,$('#create-Modal').children(),function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    }

    //司机列表
    function driverData(){

        var prm = {

            userName:''

        };

        _mainAjaxFunCompleteNew('post','YHQCA/ReturnCADriverList',prm,$('#create-Modal').children(),function(result){

            if(result.code == 99){

                _datasTable($('#driver-table'),result.data);

            }

        })

    }

    //车辆列表
    function carData(){

        var prm = {

            carNum:''

        };

        _mainAjaxFunCompleteNew('post','YHQCA/ReturnCACarList',prm,$('#create-Modal').children(),function(result){

            if(result.code == 99){

                _datasTable($('#car-table'),result.data);

            }

        })

    }


})