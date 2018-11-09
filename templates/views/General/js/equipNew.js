$(function(){

    //首先判断是编辑页面还是登记页面

    var _flag = window.location.search;

    if(_flag){

        //编辑
        $('#saveBtn').removeClass('dengji').addClass('bianji');

        var _id = _flag.split('=')[1];

        //根据id获取数据，自动赋值
        bindData(_id);

    }else{

        //登记
        $('#saveBtn').removeClass('bianji').addClass('dengji');

    }


    /*---------------------------------事件插件-----------------------------------*/

    _timeYMDComponentsFun11($('.equipNewDT'));


    /*---------------------------------点击事件----------------------------------*/

    $('#equipnew-form').on('click','.dengji',function(){

        sendData('Opers/CreateLedgerNew');

    })

    $('#equipnew-form').on('click','.bianji',function(){

        sendData('Opers/CreateLedgerNew');

    })

    /*--------------------------------其他方法------------------------------------*/

    function bindData(id){

        var prm = {

            id:id
        }

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'Opers/GetLedgerById',

            beforeSend:function(){

                $('#equipnew-form').showLoading();

            },

            complete:function(){

                $('#equipnew-form').hideLoading();

            },

            data:prm,

            timeout:_theTimes,

            success:function(result){

                if(result.code == 0){

                    var res = result.dCLedgerById[0];

                    //赋值

                    //设备标识
                    $('#id').val(res.id);

                    //设备编号
                    $('#equipNumber').val(res.equipNumber);

                    //设备名称
                    $('#equipName').val(res.equipName);

                    //安装位置
                    $('#installPosition').val(res.installPosition);

                    //所属系统
                    $('#bySystem').val(res.bySystem);

                    //型号
                    $('#byVersion').val(res.byVersion);

                    //性能参数
                    $('#parameter').val(res.parameter);

                    //品牌
                    $('#brand').val(res.brand);

                    //厂家
                    $('#factory').val(res.factory);

                    //出厂编号
                    $('#serialNumber').val(res.serialNumber);

                    //使用状态
                    $('#useState').val(res.useState);

                    //出厂日期
                    $('#exFactoryDate').val(res.exFactoryDate);

                    //购入日期
                    $('#purchaseDate').val(res.purchaseDate);

                    //启用日期
                    $('#enableDate').val(res.enableDate);

                    //使用年限
                    $('#usefulyears').val(res.usefulyears);

                    //免质保截止日期
                    $('#freeQAEndDate').val(res.freeQAEndDate);

                    //免质保单位
                    $('#freeQAEnterprise').val(res.freeQAEnterprise);

                    //免质保电话
                    $('#freeQAPhoneNumber').val(res.freeQAPhoneNumber);

                    //付费截止日期
                    $('#payQAEndDate').val(res.payQAEndDate);

                    //付费单位
                    $('#payQAEnterprise').val(res.payQAEnterprise);

                    //付费电话
                    $('#payQAPhoneNumber').val(res.payQAPhoneNumber);

                    //归属部门
                    $('#byDepart').val(res.byDepart);

                    //归属负责人
                    $('#byLeader').val(res.byLeader);

                    //负责人电话
                    $('#leaderPhoneNumber').val(res.leaderPhoneNumber);

                    //绑定设备类型
                    $('#equiptype').val(res.equipType);

                    //绑定设备
                    $('#bindequipid').val(res.bindEquipID);

                    //备注
                    $('#memo').val(res.memo);

                }


            },

            error:_errorFun1


        })

    }

    //登记/编辑flag(true)是编辑
    function sendData(url,flag){

        $('#tip').hide();

        var prm = {

            //设备标识
            equipId:$('#id').val(),
            //设备编号
            equipNumber:$('#equipNumber').val(),
            //设备名称
            equipName:$('#equipName').val(),
            //安装位置
            installPosition:$('#installPosition').val(),
            //所属系统
            bySystem:$('#bySystem').val(),
            //型号
            byVersion:$('#byVersion').val(),
            //性能参数
            parameter:$('#parameter').val(),
            //品牌
            brand:$('#brand').val(),
            //厂家
            factory:$('#factory').val(),
            //出厂编号
            serialNumber:$('#serialNumber').val(),
            //使用状态
            useState:$('#useState').val(),
            //出厂日期
            exFactoryDate:$('#exFactoryDate').val(),
            //购入日期
            purchaseDate:$('#purchaseDate').val(),
            //启用日期
            enableDate:$('#enableDate').val(),
            //使用年限
            usefulyears:$('#usefulyears').val(),
            //免质保截止日期
            freeQAEndDate:$('#freeQAEndDate').val(),
            //免质保单位
            freeQAEnterprise:$('#freeQAEnterprise').val(),
            //免质保电话
            freeQAPhoneNumber:$('#freeQAPhoneNumber').val(),
            //付费截止日期
            payQAEndDate:$('#payQAEndDate').val(),
            //付费单位
            payQAEnterprise:$('#payQAEnterprise').val(),
            //付费电话
            payQAPhoneNumber:$('#payQAPhoneNumber').val(),
            //归属部门
            byDepart:$('#byDepart').val(),
            //归属负责人
            byLeader:$('#byLeader').val(),
            //负责人电话
            leaderPhoneNumber:$('#leaderPhoneNumber').val(),
            //绑定设备类型
            equipType:$('#equiptype').val(),
            //绑定设备
            bindEquipID:$('#bindequipid').val(),
            //备注
            memo:$('#memo').val()

        }

        if(flag){



        }

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + url,

            beforeSend:function(){

                var str = '<i class="fa fa-save"></i> 正在保存...';

                $('#saveBtn').empty().append(str).attr('disabled',true);

            },

            complete:function(){

                var str = '<i class="fa fa-save"></i> 保存设备数据';

                $('#saveBtn').empty().append(str).attr('disabled',false);

            },

            data:prm,

            timeout:_theTimes,

            success:function(result){

                console.log(result);

                if(result.code == 0){

                    window.location.href = 'equip.html'

                }else{

                    _topTipBar(result.msg);

                }


            },

            error:_errorFun1


        })

    }




})