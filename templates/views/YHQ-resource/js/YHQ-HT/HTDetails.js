$(function(){

    /*------------------------变量-------------------------------------------*/

    var search = window.location.search;

    var _num = search.split('num')[1].split('=')[1];

    //详情
    detailData();

    //日志
    logData();

    //全部不可操作
    $('input').attr('readonly',true);

    $('select').attr('readonly',true);

    $('textarea').attr('readonly',true);

    /*------------------------表格初始化--------------------------------------*/

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
        }

    ]

    _tableInit($('#money-table'),moneyCol,'2','','','','','','',true);

    /*------------------------其他方法---------------------------------------*/

    //合同详情
    function detailData(){

        var prm = {

            //编号
            htNum:_num,
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQHT/GetHTInfoDetails',prm,$('.gd-wrap'),function(result){

            //赋值
            if(result.code == 99){

                var current = result.data;

                //合同编号
                $('#HT-num').val(current.htnum);
                //合同名称
                $('#HT-name').val(current.htname);
                //合同状态
                $('#HT-status').val(HTStatusFun(current.htstatus));
                //合同类型
                $('#HT-type').val(current.catename);
                //合同单位
                $('#HT-unit').val(current.clientname);
                //签订时间
                $('#HT-time').val(current.httime == ''?'':moment(current.httime).format('YYYY-MM-DD HH:mm'));
                //开始时间
                $('#HT-start').val(current.starttime == ''?'':moment(current.starttime).format('YYYY-MM-DD HH:mm'));
                //结束时间
                $('#HT-end').val(current.endtime == ''?'':moment(current.endtime).format('YYYY-MM-DD HH:mm'));
                //合同金额
                $('#HT-money').val(current.amountmoney);
                //已付金额
                $('#HT-pay').val(current.payedmoney);
                //待付金额
                $('#HT-unpay').val(current.unpayedmoney);
                //保证金
                $('#HT-bond').val(current.earnestmoney);
                //付款方式
                $('#HT-pay-way').val(current.paymethod);
                //结算方式
                $('#HT-settle').val(current.settlemethod);
                //合同附件
                var HTFile = '';

                if(current.htfiles == ''){

                }else{

                    HTFile = _urls + current.htfiles;

                }

                $('#HT-enclosure').val(HTFile);
                //主要条款
                $('#HT-main-clause').val(current.mainterm);
                //工程量清单
                _datasTable($('#engineering-table'),current.subItems);
                //审核人清单
                _datasTable($('#auditor-table'),current.htAuditInfos);
                //款项
                _datasTable($('#money-table'),current.htPayments);

            }

        })

    }

    //处理日志
    function logData(){

        var prm = {

            //编号
            htnum:_num,
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        $.ajax({

            type:'post',

            url:_urls + 'YHQHT/YHQHTGetLog',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                console.log(result);

                var str = '';

                if(result.length>0){

                    for(var i=0;i<result.length;i++){

                        str += '<li><span class="list-dot" ></span>' + result[i].logdate + '&nbsp;&nbsp;' + result[i].username + '&nbsp;&nbsp;'+ result[i].logtitle + '&nbsp;&nbsp;' + result[i].logcontent+ '</li>';

                    }

                }

                $('.MW-log').empty().append(str);

            },

            error:_errorFunNew

        })

    }

    //合同状态
    function HTStatusFun(data){

        var str = ''

        if(data == '0'){

            str = '登记'

        }else if(data == '10'){

            str = '执行'

        }else if(data == '20'){

            str = '完成'

        }else if(data == '999'){

            str = '取消'

        }

        return str;

    }

})