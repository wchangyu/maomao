$(function(){

    //是否需要申请
    var _isAudit = false;

    //是否需要审核方法
    auditFun();

    $('.gd-wrap').find('input').attr('disabled',true);

    var _prm = window.location.search;

    var _canum = '';

    if(_prm != ''){

        _canum = _prm.split('=')[1];

    }

    //条件查询
    function conditionSelect(){

        var prm = {

            //申请单号
            canum:_canum,
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQCA/GetCAInfos',prm,$('.gd-wrap'),function(result){

            if(result.code == 99){

                var data = result.data[0];
                //派车状态
                $('#CA-status').val(status(data.caStatus));
                //申请人工号
                $('#CA-applyNum').val(data.causerNum);
                //申请人姓名
                $('#CA-applyName').val(data.causerName);
                //申请人电话
                $('#CA-applyTel').val(data.causerphone);
                //申请部门名称
                $('#CA-applyDepart').val(data.departName);
                //申请车辆类型

                var type = '';

                if(data.cartype == 1){

                    type = '普通车'

                }else if(data.cartype == 2){

                    type = '救护车'

                }

                $('#CA-type').val(type);
                //出发地
                $('#CA-departure').val(data.startAddress);
                //目的地
                $('#CA-destination').val(data.destAddress);
                //预计出发时间
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
                //选择的车牌
                $('#CA-car').val(data.carNum);

                //受理
                //司机
                $('#CA-driver').val(data.driverName);
                //司机
                $('#CA-driverNum').val(data.driverNum);
                //备注
                $('#CA-acceptanceRemark').val(data.remark);

                //实际出发时间
                $('#CA-leave-time-real').val(_formatTimeH(data.startTime));
                //实际回场时间
                $('#CA-back-time-real').val(_formatTimeH(data.endTime));

                //实际出发地点
                $('#CA-departure-real').val(data.startAddress);

                //实际目的地
                $('#CA-destination-real').val(data.destaddress);

                //开始里程表读数
                $('#CA-start-km-real').val(data.startmileage);

                //结束里程表读数
                $('#CA-end-km-real').val(data.endmileage);

                //实际公里数
                $('#CA-km-real').val(data.distance);

                //审核人姓名
                $('#CA-auditName').val(data.spUsername);
                //审核人工号
                $('#CA-auditNum').val(data.spUserNum);
                //审批状态
                if(data.isAudit == 10){

                    //通过
                    $('#ones').parent().addClass('checked');

                }else if(data.isAudit == 20){

                    //不通过
                    $('#twos').parent().addClass('checked');

                }
                //审批意见
                $('#CA-auditRemark').val(data.auditinfo);

                //审核、派车、回场的显示与隐藏

                //首先通过接口判断是否显示审核
                if(_isAudit){

                    $('.audit-block').show();

                    //然后判断审核状态，如果审核过了，显示审核状态
                    if(data.isAudit != null){

                        $('.audit-result').show();

                    }

                }
                //通过判断派车状态为大于等于20的
                if(data.caStatus >= 20){

                    $('.acceptance-block').show();

                }

                if(data.caStatus == 30 ){

                    $('.back-block').show();

                }else if(data.caStatus == 99){

                    //只显示申请的
                    $('.acceptance-block').hide();

                    $('.back-block').hide();

                }


            }

        })


    }

    //派车状态
    function status(data){

        var str = '';

        if(data == 10 || data == 5){

            str = '申请'

        }else if(data == 20){

            str = '派车'

        }else if(data == 30){

            str = '回场'

        }else if(data == 99){

            str = '取消'

        }

        return str;

    }

    //是否需要审核
    function auditFun(){

        _mainAjaxFunCompleteNew('post','YHQCA/isAuditInfo','','',function(result){

            if(result.code == 99){

                if(result.data == 1){

                    _isAudit = true;

                    $('.audit-block').show();

                    conditionSelect();

                }

            }

        })

    }

})