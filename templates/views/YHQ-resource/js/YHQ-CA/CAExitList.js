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
                //汽车类型

                var type = '';

                if(data.cartype == 1){

                    type = '普通车'

                }else if(data.cartype == 2){

                    type = '救护车'

                }

                $('#carType').val(type);
                //汽车型号
                $('#carModal').val(data.model);

                $('#caNum').html(data.caNum);

                $('#caTime').html(_formatTimeH(data.eststartTime));

                //选择的车牌
                $('#CA-car').val(data.carNum);
                //司机
                $('#CA-driver').val(data.driverName);
                //申请部门名称
                $('#CA-applyDepart').val(data.departName);
                //申请人姓名
                $('#CA-applyName').val(data.causerName);
                //申请理由
                $('#CA-remark').val(data.caMemo);
                //出发地
                $('#CA-departure').val(data.startAddress);
                //目的地
                $('#CA-destination').val(data.destAddress);
                //预计公里数
                $('#CA-km').val(data.estdistance);
                //预计回场时间
                $('#CA-back-time').val(_formatTimeH(data.estEndTime));
                //派车人
                $('#send-userName').val(data.sendUserName);
            }

        })


    }

})