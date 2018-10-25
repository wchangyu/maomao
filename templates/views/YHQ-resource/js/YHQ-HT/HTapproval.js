$(function(){

    /*-----------------------------时间插件---------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    /*----------------------------默认加载----------------------------------*/

    //暂存所有数据
    var _allData = [];

    //当前审批的合同id
    var _thisId = '';

    //当前审批的合同编码
    var _thisNum = '';

    /*----------------------------表格初始化---------------------------------*/

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

                //只有为0的时候，才可以审批

                if(full.isAudit == 0){

                    return '<span class="option-button option-edit option-in" data-attr="' + full.id + '" data-num="' + full.htnum + '" attr-isAudit="' + full.isAudit + '">' + '审批</span>'

                }else{

                    return ''

                }


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

    //审核人表格
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

    //默认条件查询
    conditionSelect();

    /*---------------------------按钮操作-----------------------------------*/

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        $('#HT-nameCon').val('');

    })

    //审核
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).attr('data-attr');

        _thisNum = $(this).attr('data-num');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'审批合同','','','','审批');

        //赋值
        bindData(_thisNum);

        //可操作
        abledOption();

        if($(this).attr('attr-isaudit') == 0){

            //如果审批过，不显示
            $('.audit-block').hide();

        }else{

            //如果审批过，显示
            $('.audit-block').show();

        }

    })

    //审批
    $('#create-Modal').on('click','.btn-primary',function(){

        var prm = {

            //合同编号
            htNum:_thisNum,
            //审批意见
            auditinfo:$('#HT-approval-opinion').val(),
            //审批状态
            isAudit:$('#HT-state').find('.checked').children().val(),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQHT/HTAuditInfoOpinion',prm,$('#create-Modal'),function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    })

    /*---------------------------其他方法-----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //合同编码
            htNum:$('#DC-numCon').val(),
            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQHT/MyAuditInfoList',prm,$('.L-container'),function(result){

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

        //合计清空
        $('#engineering-table tfoot').find('input').val('');

        //删除按钮隐藏
        $('#deleted').hide();

        $('#thelist').html('');

        $('#ones').val(10);

        $('#twos').val(20);

        //初始化按钮
        //var btn = $('#HT-state').find('input');
        //
        //btn.parent().removeClass('checked');

    }

    //绑定赋值
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
                $('#HT-type').val(data.clientid);
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

    //不可以操作
    function disAbledOption(){

        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

    }

    //可操作
    function abledOption(){

        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        $('.radioBlock').find('input').attr('disabled',false);
    }

})