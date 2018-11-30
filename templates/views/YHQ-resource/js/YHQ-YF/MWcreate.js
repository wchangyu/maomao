$(function(){

    /*--------------------------------变量---------------------------------------*/

    //获取医废分类
    MWClassifyFun();

    //获取医废来源
    MWSourceFun();

    //运送人
    var _carryArr = [];

    MWCarrierFun();

    //电子称
    var _weighArr = [];

    MWWeighFun();

    /*-------------------------------时间插件------------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    /*---------------------------------表格验证----------------------------------*/

    $('#commentForm').validate({

        rules:{
            //医废类型
            'MW-classify':{

                required: true

            },
            //医废来源
            'MW-source':{

                required: true

            },
            //科室
            'MW-dep':{

                required: true

            },
            //医废处理人
            'MW-person':{

                required: true

            },
            //运送人
            'MW-carrier':{

                required: true

            },
            //称
            'MW-weigh':{

                required: true

            },
            //重量
            'MW-weighNum':{

                required: true,

                number:true

            }

        },
        messages:{
            //医废类型
            'MW-classify':{

                required: '医废类型为必选字段'

            },
            //医废来源
            'MW-source':{

                required: '医废来源为必选'

            },
            //科室
            'MW-dep':{

                required: '科室为必选字段'

            },
            //医废处理人
            'MW-person':{

                required: '医废处理人为必填字段'

            },
            //运送人
            'MW-carrier':{

                required: '运送人为必填字段'

            },
            //称
            'MW-weigh':{

                required: '称为必选字段'

            },
            //重量
            'MW-weighNum':{

                required: '重量为必填字段',

                number:'格式为数字'

            }

        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{
                //医废类型
                'MW-classify':{

                    required: true

                },
                //医废来源
                'MW-source':{

                    required: true

                },
                //科室
                'MW-dep':{

                    required: true

                },
                //医废处理人
                'MW-person':{

                    required: true

                },
                //运送人
                'MW-carrier':{

                    required: true

                },
                //称
                'MW-weigh':{

                    required: true

                },
                //重量
                'MW-weighNum':{

                    required: true,

                    number:true

                }

            },
            messages:{
                //医废类型
                'MW-classify':{

                    required: '医废类型为必选字段'

                },
                //医废来源
                'MW-source':{

                    required: '医废来源为必选'

                },
                //科室
                'MW-dep':{

                    required: '科室为必选字段'

                },
                //医废处理人
                'MW-person':{

                    required: '医废处理人为必填字段'

                },
                //运送人
                'MW-carrier':{

                    required: '运送人为必填字段'

                },
                //称
                'MW-weigh':{

                    required: '称为必选字段'

                },
                //重量
                'MW-weighNum':{

                    required: '重量为必填字段',

                    number:'格式为数字'

                }

            }

        });

    }

    /*--------------------------------表格初始化---------------------------------*/

    //运送人
    var carrierCol = [

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

    _tableInitSearch($('#carrier-table'),carrierCol,'2','','','','','',10,'','','',true);

    //电子称
    var weighCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'名称',
            data:'scalename'
        },
        {
            title:'所属部门',
            data:'keshiname'
        },
        {
            title:'地点',
            data:'scaleloc'
        }

    ]

    _tableInitSearch($('#weigh-table'),weighCol,'2','','','','','',10,'','','',true);

    //主表格
    var mainTable = [

        {
            title:'编号',
            data:'mwcode',
            render:function(data, type, full, meta){

                return '<a href="MWdetails.html?a=' + data + '" target="_blank">' + data + '</a>';

            }


        },
        {
            title:'类型',
            data:'wtname'
        },
        {
            title:'来源',
            data:'wsname'
        },
        {
            title:'重量',
            data:'weight'
        },
        {
            title:'科室',
            data:'keshiname'
        },
        {
            title:'称重时间',
            data:'sendtime',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return moment(data).format('YYYY-MM-DD HH:mm')

                }

            }

        }

    ]

    _tableInit($('#table'),mainTable,'2','','','','','');

    //条件查询
    conditionSelect();

    /*------------------------------按钮事件-------------------------------------*/

    //【新增】
    $('#createBtn').click(function(){

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        //类
        $('#create-Modal').find('.btn-primary').addClass('dengji');

    })

    //【新增确定】
    $('#create-Modal').on('click','.dengji',function(){

        //格式验证

        if(validform().form()){

            sendData('MW/mwAddMWInfo',$('#create-Modal').find('.modal-dialog'),function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }
    })

    //选择运送人
    //$('.modal-select-carrier').click(function(){
    //
    //    //初始化
    //    _datasTable($('#carrier-table'),[]);
    //
    //    //数据
    //    _datasTable($('#carrier-table'),_carryArr);
    //
    //    //模态框
    //    _moTaiKuang($('#carrier-Modal'),'运送人列表','','','','选择');
    //
    //})

    //确定运送人
    $('#person-new-Modal').on('click','.btn-primary',function(){

        var currentTr = _isSelectTr($('#person-table-filter'));

        if(currentTr){

            var num = currentTr.find('.checker').attr('data-id');

            var name = currentTr.children('td').eq(1).html();

            $('#MW-carrier').attr('data-id',num);

            $('#MW-carrier').val(name);

            $('#MW-carrier').next('.error').hide();

            $('#person-new-Modal').modal('hide');

        }

    })

    //选择称
    $('.modal-select-weigh').click(function(){

        //初始化
        _datasTable($('#weigh-table'),[]);

        //数据
        _datasTable($('#weigh-table'),_weighArr);

        //模态框
        _moTaiKuang($('#weigh-Modal'),'电子秤列表','','','','选择');

    })

    //确定电子称
    $('#weigh-Modal').on('click','.btn-primary',function(){

        var currentTr = _isSelectTr($('#weigh-table'));

        if(currentTr){

            var num = currentTr.find('.checker').attr('data-id');

            var name = currentTr.children('td').eq(1).html();

            $('#MW-weigh').attr('data-id',num);

            $('#MW-weigh').val(name);

            $('#weigh-Modal').modal('hide');

        }

    })

    //【查询】
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //【重置条件】
    $('#resetBtn').click(function(){

        $('#MWNum').val('');

        $('#spDT').val(st);

        $('#epDT').val(nowTime);

        $('#MWDep').val('');

        $('#MWDep').removeAttr('data-id');

    })

    $('#weigh-Modal').on('shown.bs.modal',function(){

        _isClickTr = true;

        _isClickTrMulti = false;

    })

    $('#weigh-Modal').on('hidden.bs.modal',function(){

        _isClickTr = false;

        _isClickTrMulti = false;

    })

    /*-----------------------------其他方法--------------------------------------*/

    //条件选择
    function conditionSelect(){

        var prm = {

            //医废编号
            mwcode:$('#MWNum').val(),
            //开始时间
            sendtimest:$('#spDT').val(),
            //结束时间
            sendtimeet:moment($('#epDT').val()).add(1,'days').format('YYYY-MM-DD'),
            //科室
            keshinum:$('#MWDep').val() == ''?'':$('#MWDep').attr('data-id'),
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM,
            //查询条件
            mwstatus:10

        }

        _mainAjaxFunCompleteNew('post','MW/mwGetInfos',prm,$('.content-top'),function(result){

            var arr = [];

            if(result.code == 99){

                arr = result.data;

            }

            _datasTable($('#table'),arr);

        })


    }

    //医废分类
    function MWClassifyFun(){

        var prm = {

            //分类名称
            wtname:''

        }

        _mainAjaxFunCompleteNew('post','MW/GetWasteTypeList',prm,false,function(result){

            var str = '<option value="">请选择</option>'

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    str += '<option value="' + result.data[i].id + '">' + result.data[i].wtname + '</option>'

                }

            }

            $('#MW-classify').empty().append(str);

        })


    }

    //医废来源
    function MWSourceFun(){

        var prm = {}

        _mainAjaxFunCompleteNew('post','MW/GetWasteSrcList',prm,false,function(result){

            var str = '<option value="">请选择</option>'

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    str += '<option value="' + result.data[i].id + '">' + result.data[i].wsname + '</option>'

                }

            }

            $('#MW-source').empty().append(str);

        })


    }

    //运送人
    function MWCarrierFun(){

        var prm = {

            'userID':_userIdNum,

            'userName':_userIdName

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetUsers',prm,false,function(result){

            _carryArr.length = 0;

            if(result){

                for(var i=0;i<result.length;i++){

                    _carryArr.push(result[i]);

                }

            }


        })

    }

    //称
    function MWWeighFun(){

        var prm = {


        }

        _mainAjaxFunCompleteNew('post','MW/GetmwScaleList',prm,false,function(result){

            _weighArr.length = 0;

            if(result){

                for(var i=0;i<result.data.length;i++){

                    _weighArr.push(result.data[i]);

                }

            }


        })

    }

    //模态框初始化
    function createModeInit(){

        _creatInit();

        //科室属性
        $('#MW-dep').removeAttr('data-id');

        //运送人
        $('#MW-carrier').removeAttr('data-id');

        //称
        $('#MW-weigh').removeAttr('data-id');

        //医废处理人是登录者本人
        $('#MW-person').val(_userIdName);

    }

    //登记
    function sendData(url,el,successFun){

        var prm = {

            //医废分类编号
            wtid:$('#MW-classify').val(),
            //医废分类名称
            wtname:$('#MW-classify').children('option:selected').html(),
            //医废来源编号
            wsid:$('#MW-source').val(),
            //医废来源名称
            wsname:$('#MW-source').children('option:selected').html(),
            //科室编码
            keshinum:$('#MW-dep').attr('data-id'),
            //科室名称
            keshiname:$('#MW-dep').val(),
            //医废处理人id
            senduserid:_userIdNum,
            //医废处理人名称
            sendusername:_userIdName,
            //运送人id
            transuserid:$('#MW-carrier').attr('data-id'),
            //运送人
            transusername:$('#MW-carrier').val(),
            //称id
            scaleid:$('#MW-weigh').attr('data-id'),
            //称名称
            scalename:$('#MW-weigh').val(),
            //重量
            weight:$('#MW-weighNum').val(),
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun);

    }


})