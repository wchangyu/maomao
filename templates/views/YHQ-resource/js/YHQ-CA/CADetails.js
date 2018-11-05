$(function(){

    var _prm = window.location.search;

    var _canum = '';

    if(_prm != ''){

        _canum = _prm.split('=')[1];

    }

    conditionSelect();

    //条件查询
    function conditionSelect(){

        var prm = {

            //申请编码
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
                //申请状态
                $('#CA-status').val(status(data.caStatus));
                //申请人工号
                $('#CA-applyNum').val(data.causerNum);
                //申请人姓名
                $('#CA-applyName').val(data.causerName);
                //申请人电话
                $('#CA-applyTel').val(data.causerphone);
                //申请部门名称
                $('#CA-applyDepart').val(data.departName);
                //出发地
                $('#CA-departure').val(data.startAddress);
                //目的地
                $('#CA-destination').val(data.destAddress);
                //预计出发时间
                if(data.caTime != ''&&data.caTime != null){

                    $('#CA-leave-time').val(data.caTime.replace(/T/g,' '));

                }
                //预计回场时间

                if(data.estEndTime != ''&&data.estEndTime != null){

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
                    if(data.startTime != '' && data.startTime!= null){

                        $('#CA-leave-time-real').val(data.startTime.replace(/T/g,' '));

                    }
                    //实际回场时间
                    if(data.endTime != '' && data.endTime != null){

                        $('#CA-back-time-real').val(data.endTime.replace(/T/g,' '));

                    }

                    //实际出发地点
                    $('#CA-departure-real').val(data.startAddress);

                    //实际目的地
                    $('#CA-destination-real').val(data.destaddress);

                    //开始里程表读数
                    $('#CA-start-km-real').val(data.startmileage);

                    //结束里程表读数
                    $('#CA-start-km-real').val(data.endmileage);

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