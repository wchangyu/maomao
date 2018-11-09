$(function(){

    _isClickTr = true;

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    //当前操作的id
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

            //申请人姓名
            'CA-applyName':{

                required:true

            },
            //申请人电话
            'CA-applyTel':{

                required:true,

                phoneNumFormat:true

            },
            //出发地
            'CA-departure':{

                required:true

            },
            //目的地
            'CA-destination':{

                required:true

            },
            //出发时间
            'CA-leave-time':{

                isEmpty:true

            },
            //预计回场时间
            'CA-back-time':{

                isEmpty:true

            },
            //乘车人数
            'CA-personNum':{

                digits:true

            },
            //乘车负责人
            'CA-personChange':{

                required:true

            },
            //乘车负责人
            'CA-remark':{

                required:true

            },
            //预计公里数
            'CA-km':{

                number:true

            },

            //车辆类型
            'CA-type':{

                required:true

            }
        },
        messages:{

            //申请人姓名
            'CA-applyName':{

                required:'申请人姓名是必填字段'

            },
            //申请人电话
            'CA-applyTel':{

                required:'申请人电话是必填字段'

            },
            //出发地
            'CA-departure':{

                required:'出发地是必填字段'

            },
            //目的地
            'CA-destination':{

                required:'目的地是必填字段'

            },
            //出发时间
            'CA-leave-time':{

                isEmpty:'出发事件是必填字段'

            },
            //预计回场时间
            'CA-back-time':{

                isEmpty:'预计回场时间是必填字段'

            },
            //乘车人数
            'CA-personNum':{

                digits:'乘车人数是大于0的整数'

            },
            //乘车负责人
            'CA-personChange':{

                required:'乘车负责人是必填字段'

            },
            //申请理由
            'CA-remark':{

                required:'申请理由是必填字段'

            },
            //预计公里数
            'CA-km':{

                number:'公里数为数字格式'

            },
            //车辆类型
            'CA-type':{

                required:'车辆类型是必选字段'

            }

        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //申请人姓名
                'CA-applyName':{

                    required:true

                },
                //申请人电话
                'CA-applyTel':{

                    required:true,

                    phoneNumFormat:true

                },
                //出发地
                'CA-departure':{

                    required:true

                },
                //目的地
                'CA-destination':{

                    required:true

                },
                //出发时间
                'CA-leave-time':{

                    isEmpty:true

                },
                //预计回场时间
                'CA-back-time':{

                    isEmpty:true

                },
                //乘车人数
                'CA-personNum':{

                    digits:true

                },
                //乘车负责人
                'CA-personChange':{

                    required:true

                },
                //乘车负责人
                'CA-remark':{

                    required:true

                },
                //预计公里数
                'CA-km':{

                    number:true

                },

                //车辆类型
                'CA-type':{

                    required:true

                }
            },
            messages:{

                //申请人姓名
                'CA-applyName':{

                    required:'申请人姓名是必填字段'

                },
                //申请人电话
                'CA-applyTel':{

                    required:'申请人电话是必填字段'

                },
                //出发地
                'CA-departure':{

                    required:'出发地是必填字段'

                },
                //目的地
                'CA-destination':{

                    required:'目的地是必填字段'

                },
                //出发时间
                'CA-leave-time':{

                    isEmpty:'出发事件是必填字段'

                },
                //预计回场时间
                'CA-back-time':{

                    isEmpty:'预计回场时间是必填字段'

                },
                //乘车人数
                'CA-personNum':{

                    digits:'乘车人数是大于0的整数'

                },
                //乘车负责人
                'CA-personChange':{

                    required:'乘车负责人是必填字段'

                },
                //申请理由
                'CA-remark':{

                    required:'申请理由是必填字段'

                },
                //预计公里数
                'CA-km':{

                    number:'公里数为数字格式'

                },
                //车辆类型
                'CA-type':{

                    required:'车辆类型是必选字段'

                }

            }

        });

    }

    /*-----------------------------表格初始化--------------------------------*/

    var col=[
        {
            title:'申请单号',
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
            title:'用车部门',
            data:'departName'
        },
        {
            title:'申请车辆',
            data:'cartype',
            render:function(data, type, full, meta){

                var str = '';

                if(data == 1){

                    str = '普通车'

                }else if(data == 2){

                    str = '救护车'

                }

                return str;

            }
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

                return _formatTimeH(data);


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

                str += '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '编辑</span>'

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

    })

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){

            sendData('YHQCA/ApplyCar',$('#create-Modal').children(),false,function(result){

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

            sendData('YHQCA/CAInfoUpdate',$('#create-Modal').children(),true,function(result){

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

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {
            //申请单号
            canum:$('#CA-canumCon').val(),
            //状态为10的
            caStatus:10,
            //用车部门
            departnum:$('#CA-departCon').val(),
            //申请开始时间
            catimest:$('#CA-startTimeCon').val(),
            //申请时间结束
            catimeet:moment($('#CA-endTimeCon').val()).add(1,'d').format('YYYY-MM-DD'),
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

        $('#CA-applyDepart').removeAttr('data-attr');

    }

    //发送数据
    function sendData(url,el,flag,successFun){

        var prm = {

            //申请人工号
            causernum:$('#CA-applyNum').val(),
            //申请人姓名
            causername:$('#CA-applyName').val(),
            //申请人电话
            causerphone:$('#CA-applyTel').val(),
            //申请部门编码
            departnum:$('#CA-applyDepart').attr('data-attr'),
            //申请部门名称
            departname:$('#CA-applyDepart').val(),
            //申请车辆类型
            cartype:$('#CA-type').val(),
            //出发地
            startaddress:$('#CA-departure').val(),
            //目的地
            destaddress:$('#CA-destination').val(),
            //出发时间
            eststarttime:$('#CA-leave-time').val(),
            //预计回场时间
            estendtime:$('#CA-back-time').val(),
            //预计公里数
            estdistance:$('#CA-km').val(),
            //乘车人数
            usercnt:$('#CA-personNum').val(),
            //负责人工号
            leadernum:$('#CA-personChangeNum').val(),
            //乘车负责人
            leadername:$('#CA-personChange').val(),
            //负责人电话
            leaderphone:$('#CA-personChangeTel').val(),
            //申请理由
            camemo:$('#CA-remark').val(),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //当前用户的部门
            b_DepartNum:_userBM

        }

        if(flag){

            prm.id = _thisId;

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun)

    }

    //绑定赋值
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            var data = _allData[i];

            if(data.id == id){

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
                //申请车辆类型
                $('#CA-type').val(data.cartype);
                //出发地
                $('#CA-departure').val(data.startAddress);
                //目的地
                $('#CA-destination').val(data.destAddress);
                //出发时间
                $('#CA-leave-time').val(_formatTimeH(data.caTime));
                //预计回场时间
                $('#CA-back-time').val(_formatTimeH(data.estEndTime));
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

    }


})