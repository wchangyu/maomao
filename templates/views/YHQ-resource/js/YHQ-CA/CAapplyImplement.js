$(function(){

    _isClickTr = true;

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    //当前操作的申请编码
    var _thisId = '';

    //结束时间
    var nowTime = moment().format('YYYY-MM-DD');

    //开始时间
    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#CA-startTimeCon').val(st);

    $('#CA-endTimeCon').val(nowTime);

    _timeYMDComponentsFun11($('.L-condition').eq(0).find('.abbrDT'));

    //时间初始化
    _timeHMSComponentsFunValite($('#create-Modal').find('.abbrDT'));

    /*-----------------------------验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //实际出发时间
            'CA-leave-time-real':{

                required:true

            },
            //实际回场时间
            'CA-back-time-real':{

                required:true

            },
            //实际出发地
            'CA-departure-real':{

                required:true

            },
            //开始里程表读数
            'CA-start-km-real':{

                required:true,

                number:true,

                min:0

            },
            //结束里程表读数
            'CA-end-km-real':{

                required:true,

                number:true,

                min:0

            },
            //实际公里数
            'CA-km-real':{

                required:true,

                number:true,

                min:0

            }
        },
        messages:{

            //实际出发时间
            'CA-leave-time-real':{

                required:'实际出发时间为必填字段'

            },
            //实际回场时间
            'CA-back-time-real':{

                required:'实际回场时间为必填字段'

            },
            //实际出发地
            'CA-departure-real':{

                required:'实际出发地为必填字段'

            },
            //开始里程表读数
            'CA-start-km-real':{

                required:'开始里程表读数为必填字段',

                number:'请输入数字格式'

            },
            //结束里程表读数
            'CA-end-km-real':{

                required:'结束里程表读数为必填字段',

                number:'请输入数字格式'

            },
            //实际公里数
            'CA-km-real':{

                required:'结束里程表读数为必填字段',

                number:'请输入数字格式'

            }

        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //实际出发时间
                'CA-leave-time-real':{

                    required:true

                },
                //实际回场时间
                'CA-back-time-real':{

                    required:true

                },
                //实际出发地
                'CA-departure-real':{

                    required:true

                },
                //开始里程表读数
                'CA-start-km-real':{

                    required:true,

                    number:true,

                    min:0

                },
                //结束里程表读数
                'CA-end-km-real':{

                    required:true,

                    number:true,

                    min:0

                },
                //实际公里数
                'CA-km-real':{

                    required:true,

                    number:true,

                    min:0

                }
            },
            messages:{

                //实际出发时间
                'CA-leave-time-real':{

                    required:'实际出发时间为必填字段'

                },
                //实际回场时间
                'CA-back-time-real':{

                    required:'实际回场时间为必填字段'

                },
                //实际出发地
                'CA-departure-real':{

                    required:'实际出发地为必填字段'

                },
                //开始里程表读数
                'CA-start-km-real':{

                    required:'开始里程表读数为必填字段',

                    number:'请输入数字格式'

                },
                //结束里程表读数
                'CA-end-km-real':{

                    required:'结束里程表读数为必填字段',

                    number:'请输入数字格式'

                },
                //实际公里数
                'CA-km-real':{

                    required:'结束里程表读数为必填字段',

                    number:'请输入数字格式'

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
            data:'caTime',
            render:function(data, type, full, meta){

                return data.replace(/T/g,' ')

            }
        },
        {
            title:'申请理由',
            data:'caMemo'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '';

                str += '<span class="option-button option-see option-in" data-attr="' + full.id + '">' + '<a href="CAExitList.html?num=' + full.caNum + '" target="_blank">出车单</a></span>' +

                    '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '完成</span>' +

                    '<span class="option-button option-del option-in" data-attr="' + full.id + '">' + '回退</span>'

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

        $('.L-condition').eq(0).find('input').val('');

        $('#CA-startTimeCon').val(st);

        $('#CA-endTimeCon').val(nowTime);

    })

    //派车
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).parents('tr').children().eq(0).children().html();

        //初始化
        createModeInit();

        //派车显示
        $('#back-block').show();

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

        //回场
        $('#back-block').hide();

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

        backApply();

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //申请编码
            canum:$('#CA-canumCon').val(),
            //状态为10的
            caStatus:20,
            //用车部门
            departnum:$('#CA-departCon').val(),
            //申请开始时间
            catimest:$('#CA-startTimeCon').val(),
            //申请时间结束
            catimeet:$('#CA-endTimeCon').val(),
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

        $('#back-block').hide();

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
                //选择的车牌
                $('#CA-car').val(data.carNum);
                //司机
                $('#CA-driver').val(data.driverName);
                //司机
                $('#CA-driverNum').val(data.driverNum);
                //备注
                $('#CA-acceptanceRemark').val(data.remark)
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

    //完成
    function sendCar(){

        prm = {

            //派车单编号
            canum:_thisId,
            //实际出发时间
            starttime:$('#CA-leave-time-real').val(),
            //实际回场时间
            endtime:$('#CA-back-time-real').val(),
            //出发地点
            startaddress:$('#CA-departure-real').val(),
            //目的地点
            destaddress:$('#CA-destination-real').val(),
            //开始的里程表读数
            startmileage:$('#CA-start-km-real').val(),
            //结束的里程表读数
            endmileage:$('#CA-end-km-real').val(),
            //公里数
            distance:$('#CA-km-real').val(),
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

        _mainAjaxFunCompleteNew('post','YHQCA/CABack',prm,$('#create-Modal').children(),function(result){

            if(result.code == 99){

                conditionSelect();

                $('#create-Modal').modal('hide');

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    }

    //回退
    function backApply(){

        prm = {

            //派车单编号
            canum:_thisId,
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQCA/BackCA',prm,$('#create-Modal').children(),function(result){

            if(result.code == 99){

                conditionSelect();

                $('#create-Modal').modal('hide');

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    }


})