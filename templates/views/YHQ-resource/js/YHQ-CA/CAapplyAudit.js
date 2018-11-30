$(function(){

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

                if(full.isAudit == null || full.isAudit == 0 ){

                    str += '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '审核</span>'

                }

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

    //重置
    $('#resetBtn').click(function(){

        $('.L-condition').eq(0).find('input').val('');

        $('#CA-startTimeCon').val(st);

        $('#CA-endTimeCon').val(nowTime);
    })

    //审核
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'审核','','','','审核');

        //赋值
        bindData(_thisId);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //可操作
        disAbledOption();

    })

    //审核确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        var prm = {

            //申请id
            id:_thisId,
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

        _mainAjaxFunCompleteNew('post','YHQCA/CAAuditInfo',prm,$('#create-Modal'),function(result){

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
            //申请单号
            canum:$('#CA-canumCon').val(),
            //状态为5的
            caStatus:5,
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

        _mainAjaxFunCompleteNew('post','YHQCA/MyAuditinfoList',prm,$('.L-container'),function(result){

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

        $('#ones').val(10);

        $('#twos').val(20);

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
                //审核人工号
                $('#CA-personAuditNum').val(data.spUserNum);
                //审核人姓名
                $('#CA-personAudit').val(data.spUsername);
            }

        }

    }

    //不可以操作
    function disAbledOption(){

        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

        $('#audit-block').find('input').attr('disabled',false);

        $('#audit-block').find('textarea').attr('disabled',false);

    }

})