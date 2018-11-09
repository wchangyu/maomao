$(function(){

    $('.gd-wrap').find('input').attr('disabled',true);

    var _prm = window.location.search;

    var _canum = '';

    if(_prm != ''){

        _canum = _prm.split('=')[1];

    }

    conditionSelect();

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

                if(data.caStatus == 99){

                    $('.acceptance-block').hide();

                    $('.back-block').hide();

                }else{

                    $('.acceptance-block').show();

                    $('.back-block').show();

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

                }



            }

        })


    }

    //派车状态
    function status(data){

        var str = '';

        if(data == 10){

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

})