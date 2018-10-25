$(function(){

    _isClickTr = true;

    /*-----------------------------时间插件---------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    //验证时间初始化
    _timeYMDComponentsFunValite($('#commentForm').find('.abbrDT'));

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    var _isExist = '';

    //当前操作的合同id
    var _thisId = '';

    //当前操作的款项id
    var _thisMoneyId = '';

    //当前操作的合同编码
    var _thisNum = '';

    //暂存所有员工列表
    var _allPerson = [];

    //获取签订人
    signedPerson();

    //审批人
    var _alreadyPersonArr = [];

    //当前选择审批人的选择按钮
    var _thisSelect = '';

    //当前合同下的款项数组
    var _moneyArr = [];

    /*-----------------------------验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //经办人名称
            'HT-person-M':{

                required: true

            },

            //款项金额
            'HT-money-M':{

                required: true,

                number:true,

                min:0

            },

            //款项时间
            'HT-time-M':{

                isEmpty: true,

                isDate:true

            },

            //款项名称
            'HT-money-name-M':{

                required: true,

                isExist:_isExist

            }

        },
        messages:{

            //经办人名称
            'HT-person-M':{

                required: '经办人是必选字段'

            },

            //款项金额
            'HT-money-M':{

                required: '款项金额是必选字段',

                number:'请输入大于0的数字',

                min:'请输入大于0的数字'

            },

            //款项时间
            'HT-time-M':{

                isEmpty: '款项时间是必填字段',

                isDate:'格式为YYYY-MM-DD'

            },

            //款项名称
            'HT-money-name-M':{

                required: '款项名称是必填字段'

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //经办人名称
                'HT-person-M':{

                    required: true

                },

                //款项金额
                'HT-money-M':{

                    required: true,

                    number:true,

                    min:0

                },

                //款项时间
                'HT-time-M':{

                    isEmpty: true,

                    isDate:true

                },

                //款项名称
                'HT-money-name-M':{

                    required: true,

                    isExist:_isExist

                }

            },
            messages:{

                //合同客户名称
                'HT-num-M':{

                    required: '合同是必选字段'

                },

                //经办人名称
                'HT-person-M':{

                    required: '经办人是必选字段'

                },

                //款项金额
                'HT-money-M':{

                    required: '款项金额是必选字段',

                    number:'请输入大于0的数字',

                    min:'请输入大于0的数字'

                },

                //款项时间
                'HT-time-M':{

                    isEmpty: '款项时间是必填字段',

                    isDate:'格式为YYYY-MM-DD'

                },

                //款项名称
                'HT-money-name-M':{

                    required: '款项名称是必填字段'

                }
            }

        });

    }

    //验证合同名称是否存在
    $.validator.addMethod("isExist",function(value,element,params){

        var flag = true;

        //for(var i=0;i<_allData.length;i++){
        //
        //    if(_allData[i].lxbm == value && _allData[i].lxbm!= _isExist){
        //
        //        flag = false;
        //
        //        break;
        //
        //    }
        //
        //}

        return flag;

    },"合同名称已存在");

    /*-----------------------------表格初始化--------------------------------*/

    //主表格
    var col = [

        {
            title:'合同名称',
            data:'htname',
            render:function(data, type, full, meta){

                return '<a href="HTDetails.html?num=' + full.htnum + '" target="_blank">' + data + '</a>'

            }
        },
        {
            title:'合同类型',
            data:'catename'
        },
        {
            title:'合同签定时间',
            data:'httime',
            render:function(data, type, full, meta){

                return data.split('T')[0]

            }

        },
        {
            title:'合同单位',
            data:'clientname'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '<span class="option-button option-edit option-in" data-attr="' + full.id + '" data-num="' + full.htnum + '">' + '编辑款项</span>' +

                    '<span class="option-button option-complete option-in" data-attr="' + full.id + '" data-num="' + full.htnum + '">' + '完成</span>'

                return str


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    //工程量表格
    var engineeringCol = [

        {
            title:'序号',
            data:'',
            className:'serialBlock'
        },
        {
            title:'清单子目',
            data:'itemName'

        },
        {
            title:'工程量',
            data:'itemAmount'
        },
        {
            title:'单位',
            data:'unit'
        },
        {
            title:'综合单价',
            data:'itemPrice'
        },
        {
            title:'合价',
            data:'amount'
        },
        {
            title:'备注',
            data:'memo'
        }

    ]

    _tableInit($('#engineering-table'),engineeringCol,'2','','',serialNumber,'','','',true);

    //审核人表格(审批中状态)
    var auditorColIng = [

        {
            title:'工号',
            data:'userNum'
        },
        {
            title:'姓名',
            data:'username'
        },
        {
            title:'审批等级',
            data:'rank'

        },
        {
            title:'审批状态',
            data:'isAudit',
            render:function(data, type, full, meta){

                if(data == 10){

                    return '通过'

                }else if(data == 20){

                    return '不通过'

                }

            }
        },
        {
            title:'审批意见',
            data:'auditinfo'
        },
        {
            title:'审批时间',
            data:'auditTime',
            render:function(data, type, full, meta){

                if(data == null){

                    return ''

                }else{

                    return data.split('T')[0] + ' ' + data.split('T')[1]

                }

            }
        }

    ]

    _tableInit($('#auditor-table'),auditorColIng,'2','','','','','','',true);

    //序列号自增
    function serialNumber(){

        this.api().column(0).nodes().each(function(cell, i) {

            cell.innerHTML =  i + 1;

        });
    }

    //合同签订人表格
    var unitCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'客户名称',
            data:'clientname'
        },
        {
            title:'地址',
            data:'address'
        }

    ]

    _tableInitSearch($('#unit-table'),unitCol,'2','','','','','',10,'','','',true);

    //签订人表格
    var signCol = [

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

    _tableInitSearch($('#sign-table'),signCol,'2','','','','','',10,'','','',true);

    //审核人列表
    _tableInitSearch($('#auditor-table-select'),signCol,'2','','','','','',10,'','','',true);

    //款项表格
    var moneyCol = [

        {
            title:'工号',
            data:'payUserID'
        },
        {
            title:'经办人姓名',
            data:'payUserName'
        },
        {
            title:'金额',
            data:'money'
        },
        {
            title:'款项名称',
            data:'payName'
        },
        {
            title:'款项时间',
            data:'payTime',
            render:function(data, type, full, meta){

                var str = '';

                if(data != null || data != '' ){

                    str = data.split('T')[0];

                }

                return str;

            }

        },
        {
            title:'款项备注',
            data:'memo'
        },
        {
            title:'操作',
            data:'',
            render:function(data, type, full, meta){

                return '<div class="option-button option-edit option-in" style="width: 50px;" data-attr="' + full.id + '">编辑</div>' +

                '<div class="option-button option-del option-in" style="width: 50px;" data-attr="' + full.id + '">删除</div>'

            }
        }

    ]

    //款项不可编辑表格
    var moneyColNo = [

        {
            title:'工号',
            data:'payUserID'
        },
        {
            title:'经办人姓名',
            data:'payUserName'
        },
        {
            title:'金额',
            data:'money'
        },
        {
            title:'款项名称',
            data:'payName'
        },
        {
            title:'款项时间',
            data:'payTime',
            render:function(data, type, full, meta){

                var str = '';

                if(data != null || data != '' ){

                    str = data.split('T')[0];

                }

                return str;

            }

        },
        {
            title:'款项备注',
            data:'memo'
        }

    ]

    //_tableInit($('#money-table'),moneyCol,'2','','','','','','',true);

    //默认加载
    conditionSelect();

    /*-----------------------------按钮事件----------------------------------*/

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        $('#HT-nameCon').val('');

    })

    //添加款项
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).attr('data-attr');

        _thisNum = $(this).attr('data-num');

        $('#add-money').show();

        _tableInit($('#money-table'),moneyCol,'2','','','','','','',true);

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'编辑',true,'','','保存');

        //赋值
        bindData(_thisNum);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('wancheng').addClass('bianji');

        //详情不能修改
        disAbledOption();

    })

    //确定签订人
    $('#sign-Modal').on('click','.btn-primary',function(){

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

        $('#HT-person-M').val(name);

        $('#HT-person-M').attr('data-num',num);

        $('#sign-Modal').modal('hide');

    })

    //款项增加一行
    $('#add-money').click(function(){

        //初始化
        moneyInit();

        //模态框
        _moTaiKuang($('#create-one-Modal'),'添加款项','','','','确定');

        //类
        $('#create-one-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

    })

    $('#money-table tbody').on('click','.option-see',function(){

        _thisSelect = $(this);

        //模态框
        _moTaiKuang($('#sign-Modal'),'经办人列表','','','','选择');

    })

    //选择经办人
    $('#create-one-Modal').on('click','#select-person',function(){

        _moTaiKuang($('#sign-Modal'),'签订人列表','','','','选择');

    })

    //添加款项
    $('#create-one-Modal').on('click','.dengji',function(){

        if(validform().form()){

            sendData('YHQHT/HTPaymentAdd',$('#create-one-Modal').children(),false,function(result){

                if(result.code == 99){

                    $('#create-one-Modal').modal('hide');

                    //获取列表，付给第一层弹框
                    bindData(_thisNum);

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }

    })

    //编辑款项
    $('#money-table tbody').on('click','.option-edit',function(){

        _thisMoneyId = $(this).attr('data-attr');

        //初始化
        moneyInit();

        //模态框
        _moTaiKuang($('#create-one-Modal'),'添加款项','','','','确定');

        //类
        $('#create-one-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //赋值
        moneyBind(_thisMoneyId);

        //可操作
        moneyAbled();

    })

    //编辑确定按钮
    $('#create-one-Modal').on('click','.bianji',function(){

        if(validform().form()){

            sendData('YHQHT/HTPaymentUpdate',$('#create-one-Modal').children(),true,function(result){

                if(result.code == 99){

                    $('#create-one-Modal').modal('hide');

                    //获取列表，付给第一层弹框
                    bindData(_thisNum);

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }

    })

    //删除款项
    $('#money-table tbody').on('click','.option-del',function(){

        _thisMoneyId = $(this).attr('data-attr');

        //初始化
        moneyInit();

        //模态框
        _moTaiKuang($('#create-one-Modal'),'确定要删除该款项吗？','','','','删除');

        //类
        $('#create-one-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //赋值
        moneyBind(_thisMoneyId);

        //可操作
        moneyDisabled();

    })

    //删除确定按钮
    $('#create-one-Modal').on('click','.shanchu',function(){

        if(validform().form()){

            sendData('YHQHT/HTPaymentDelete',$('#create-one-Modal').children(),true,function(result){

                if(result.code == 99){

                    $('#create-one-Modal').modal('hide');

                    //获取列表，付给第一层弹框
                    bindData(_thisNum);

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }

    })

    //完成合同
    $('#table tbody').on('click','.option-complete',function(){

        _thisId = $(this).attr('data-attr');

        _thisNum = $(this).attr('data-num');

        $('#add-money').hide();

        _tableInit($('#money-table'),moneyColNo,'2','','','','','','',true);

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'合同完成','','','','完成');

        //赋值
        bindData(_thisNum);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').addClass('wancheng');

        //详情不能修改
        disAbledOption();

    })

    //完成确定按钮
    $('#create-Modal').on('click','.wancheng',function(){


        var prm = {

            //合同编码
            htNum:_thisNum,
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQHT/HTFinish',prm,$('.L-container'),function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    })

    //模态框关闭
    $('#create-Modal').on('hide.bs.modal',function(e){

        if($(e.target).attr('id').indexOf('create-Modal')>-1){

            var table = $('#money-table').DataTable();

            //将表格销毁
            table.destroy(false);

            //dom初始化
            $('#money-table thead').empty();

            $('#money-table tbody').empty();

        }

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //合同编码
            htNum:$('#DC-numCon').val(),
            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //状态
            htStatus:10
            ////用户ID
            //userID:_userIdNum,
            ////用户名
            //userName:_userIdName,
            ////用户角色
            //b_UserRole:_userRole,
            ////用户部门
            //b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQHT/GetHTInfoList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }

    //初始化
    function createModeInit(){

        //时间验证占位dom隐藏
        $('.time-seat').hide();

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val('');

        $('#create-Modal').find('textarea').val('');

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

        //工程量表格初始化
        _datasTable($('#engineering-table'),[]);

        //审核人
        _datasTable($('#auditor-table'),[]);

        //款项
        _datasTable($('#money-table'),[]);

        //合计清空
        $('#engineering-table tfoot').find('input').val('');

        //签订人
        $('#HT-person').removeAttr('data-attr');

        //合同单位
        $('#HT-unit').removeAttr('data-attr');

        //删除按钮隐藏
        $('#deleted').hide();

        $('#thelist').html('');

        _alreadyPersonArr.length = 0;

    }

    //发送数据
    function sendData(url,el,flag,successFun){

        var prm = {

            //合同编号
            htNum:_thisNum,
            //经办人
            payUserID:$('#HT-person-M').attr('data-num'),
            //经办人姓名
            payUserName:$('#HT-person-M').val(),
            //款项时间
            payTime:$('#HT-time-M').val(),
            //款项名称
            payName:$('#HT-money-name-M').val(),
            //款项备注
            memo:$('#HT-remark-M').val(),
            //金额
            money:$('#HT-money-M').val(),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        if(flag){

            prm.id = _thisMoneyId;

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun)

    }

    //绑定赋值
    function bindData(num){

        var prm = {

            //编号
            htNum:num,
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQHT/GetHTInfoDetails',prm,$('.L-container'),function(result){

            //赋值
            if(result.code == 99){

                var data = result.data;

                _isExist = data.htname;

                //合同名称
                $('#HT-name').val(data.htname);
                //合同编码
                $('#HT-num').val(data.htnum);
                //合同类型
                $('#HT-type').val(data.catename);
                //签订人
                $('#HT-person').val(data.signusername);
                //签订人id
                $('#HT-person').attr('data-attr',data.signuserid);
                //合同单位
                $('#HT-unit').val(data.clientname);
                //合同单位
                $('#HT-unit').attr('data-attr',data.clientid);
                //合同签订时间
                $('#signDT').val(data.httime.split('T')[0]);
                //开始时间
                $('#HTStartDT').val(data.starttime.split('T')[0]);
                //结束时间
                $('#HTendDT').val(data.endtime.split('T')[0]);
                //合同金额
                $('#HT-money').val(data.amountmoney);
                //已付金额
                $('#HT-paid').val(data.payedmoney);
                //待付金额
                $('#HT-unpaid').val(data.unpayedmoney);
                //保证金
                $('#HT-bond').val(data.earnestmoney);
                //付款方式
                $('#HT-PayWay').val(data.paymethod);
                //结算方式
                $('#HT-AccountWay').val(data.settlemethod);
                //主要条款
                $('#HT-main-clause').val(data.mainterm);
                //备注
                $('#HT-remark').val(data.memo);
                //工程量清单
                _datasTable($('#engineering-table'),data.subItems);
                //审核人清单
                _datasTable($('#auditor-table'),data.htAuditInfos);
                //款项清单
                _datasTable($('#money-table'),data.htPayments);

                _moneyArr = data.htPayments;

                //文件上传的删除按钮是否显示
                if(data.htfiles != ''){

                    _imgpath = data.htfiles;

                    //合同附件
                    $('#thelist').html(_urls + data.htfiles);

                    //删除按钮显示
                    $('#deleted').show();

                }


            }

        })

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
    function signedPerson(){

        var prm = {

            'userID':_userIdNum,

            'userName':_userIdName

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetUsers',prm,false,function(result){

            var arr = result;

            _allPerson = result;

            _datasTable($('#sign-table'),arr);



        })

    }

    //表格内容验证
    function tableFormat(){

        //非空
        var isEmpty = $('#money-table tbody').find('.must');

        //数字
        var isNum = $('#money-table tbody').find('.num-format');

        //时间格式
        var isDate = $('#money-table tbody').find('.date-format');

        //非空
        for(var i=0;i<isEmpty.length;i++){

            var dom = isEmpty.eq(i);

            var values = dom.val();

            if( values == ''){

                dom.addClass('errorFormat');

            }else{

                dom.removeClass('errorFormat');

            }

        }

        //数字
        for(var i=0;i<isNum.length;i++){

            var dom = isNum.eq(i);

            var values = isNum.eq(i).val();

            if( _regularTest(_isNum,values)){

                dom.removeClass('errorFormat');

            }else{

                dom.addClass('errorFormat');

            }

        }

        //非空且整数
        for(var i=0;i<isDate.length;i++){

            var dom = isDate.eq(i);

            var values = isDate.eq(i).val();

            if( values != '' && _regularTest(_isDate,values) ){

                dom.removeClass('errorFormat');

            }else{

                dom.addClass('errorFormat');

            }

        }

        var errorLength = $('#create-Modal').find('.errorFormat').length;

        if(errorLength != 0){

            return false;

        }

    }

    //添加项款初始化
    function moneyInit(){

        //时间验证占位dom隐藏
        $('#create-one-Modal').find('.time-seat').hide();

        $('#create-one-Modal').find('input').val('');

        $('#create-one-Modal').find('select').val('');

        $('#create-one-Modal').find('textarea').val('');

        //将所有label .error验证隐藏
        var label = $('#create-one-Modal').find('label');

        for(var i=0;i<label.length;i++){

            var attr = $(label).eq(i).attr('class')

            if(attr){

                if(attr.indexOf('error')>-1){

                    label.eq(i).hide();

                }

            }

        }

        //还款时间默认今天
        $('#HT-time-M').val(nowTime);

        //经办人
        $('#HT-person-M').removeAttr('data-num');

    }

    //获取当前的款项详情
    function moneyBind(id){

        for(var i=0;i<_moneyArr.length;i++){

            if(_moneyArr[i].id == id){

                var data = _moneyArr[i]

                //经办人
                $('#HT-person-M').val(data.payUserName);

                //经办人id
                $('#HT-person-M').attr('data-num',data.payUserID);

                //还款金额
                $('#HT-money-M').val(data.money);

                //款项时间
                $('#HT-time-M').val( data.payTime.split('T')[0] );

                //款项名称
                $('#HT-money-name-M').val(data.payName);

                //备注
                $('#HT-remark-M').val(data.memo);

            }

        }

    }

    //款项可编辑
    function moneyAbled(){

        $('#create-one-Modal').find('input').attr('disabled',false);

        $('#create-one-Modal').find('select').attr('disabled',false);

        $('#create-one-Modal').find('textarea').attr('disabled',false);

        //经办人
        $('#select-person').addClass('modal-select-show');

    }

    //款项不可编辑
    function moneyDisabled(){

        $('#create-one-Modal').find('input').attr('disabled',true);

        $('#create-one-Modal').find('select').attr('disabled',true);

        $('#create-one-Modal').find('textarea').attr('disabled',true);

        //经办人
        $('#select-person').removeClass('modal-select-show');

    }

})

//当前上传的文件路径
var _imgpath = '';