$(function(){

    var _prm = window.location.search;

    var _fxCode = _prm.split('=')[1].split('&')[0];

    var _selectedBJ = [];

    var _statusArr = [];

    var _status = _prm.split('=')[2];

    //返修件常量
    BJStatus();

    //日志
    logFile();

    //表格初始化
    var outClListCol = [
        {
            title:'序号',
            data:'mc',
            render:function(data, type, full, meta){

                return meta.row + 1
            }
        },
        {
            title:'名称',
            data:'mc'
        },
        {
            title:'规格型号',
            data:'size',
            className:'bjbm'
        },
        {
            title:'单位',
            data:'dw'
        },
        {
            title:'数量',
            data:'sl'
        },
        {
            title:'单价（元）',
            data:'dj'
        },
        {
            title:'金额（元）',
            data:'je'
        }
    ];

    _tableInit($('#cl-list'),outClListCol,'2','','','',true);

    //获取详情
    var prm = {

        //工单号
        'fxCode':_fxCode,
        //用户ID
        'userID':_userIdNum,
        //用户姓名
        'userName':_userIdName,
        //用户角色
        'b_UserRole':_userRole,
        //当前部门
        'b_DepartNum':_loginUser.departNum

    }

    //发送请求
    $.ajax({

        type:'post',
        url:_urls + 'YWFX/ywFXGetDetail',
        timeout:_theTimes,
        data:prm,
        beforeSend: function () {
            $('#theLoading').modal('show');
        },
        complete: function () {
            $('#theLoading').modal('hide');
        },
        success:function(result){
            //赋值
            var el = $('#fxGoods').find('input')
            //返修件id
            $(el).eq(0).val(result.fxCode);
            //所属工单号
            $(el).eq(1).val(result.gdCode2);
            //返修件编码
            $(el).eq(2).val(result.itemNum);
            //返修件名称
            $(el).eq(3).val(result.itemName);
            //返修件序列号
            $(el).eq(4).val(result.sn);
            //规格型号
            $(el).eq(5).val(result.size);
            //故障原因
            $(el).eq(6).val(result.fxReason);
            //快递信息
            $(el).eq(7).val(result.fxKdinfo);
            //车站
            $(el).eq(8).val(result.staName);
            //车间
            $(el).eq(9).val(result.departName);

            //当前的状态
            $('#nowStatus').val(result.fxStatusName);

            $('#nowStatus').attr('data-num',result.fxStatus);

            //已存在的材料
            _selectedBJ.length = 0;

            if(result.fxCls){

                for(var i=0;i<result.fxCls.length;i++){

                    //_selectedBJ.push(result.fxCls[i]);

                    var obj = {};
                    //名称
                    obj.mc = result.fxCls[i].fxClName;
                    //编码
                    obj.bm = result.fxCls[i].fxCl;
                    //规格型号
                    obj.size = result.fxCls[i].size;
                    //单位
                    obj.dw = result.fxCls[i].unitName;
                    //数量
                    obj.sl = result.fxCls[i].clShul;
                    //分类
                    obj.cateName = result.fxCls[i].cateName;
                    //单价
                    obj.dj = result.fxCls[i].fxClPrice;
                    //id
                    obj.id = result.fxCls[i].fxClID;
                    //金额
                    obj.je = result.fxCls[i].fxClAmount;

                    _selectedBJ.push(obj);

                }

                //赋值
                _datasTable($('#cl-list'),_selectedBJ);

                //合计金额

                var totalNum = 0;

                for(var i=0;i<_selectedBJ.length;i++){

                    totalNum += Number(_selectedBJ[i].je);

                }

                $('#total').val(totalNum.toFixed(2));

            }else{

                var arr = [];

                _datasTable($('#cl-list'),arr);


            }

            //操作

            for(var i=0;i<_statusArr.length;i++){

                if(_statusArr[i].fxStatus == result.fxStatus ){

                    $('#optioning').val(_statusArr[i].optType);

                    if(_statusArr[i].optType == 'zixiu'){

                        $('.ownRepair').show();

                    }else if(_statusArr[i].optType == 'fanchang'){

                        $('.factoryRepair').show();

                    }

                }

            }

            //自修单价
            $('#hourFee').val(result.zxPrice.toFixed(2));


            //返厂修数据绑定

            var inputValues = $('.factoryRepair').find('input');

            //返厂修日期
            inputValues.eq(0).val(result.fcShij.split(' ')[0]);

            //厂家名称
            $('#factory').val(result.cusName);

            //快递公司
            inputValues.eq(2).val(result.fcKdComp);

            //快递单号
            inputValues.eq(3).val(result.fcKdinfo);

            //预计到达时间
            inputValues.eq(4).val(result.estbackDate.split(' ')[0]);

            //厂家发货日期
            inputValues.eq(5).val(result.backDate);

            //快递公司
            inputValues.eq(6).val(result.fckdComp2);

            //快递单号
            inputValues.eq(7).val(result.fckdInfo2);

            //收货地点
            inputValues.eq(8).val(result.receiveAddr);

            //备注
            $('.remarkRepair').find('textarea').val(result.remark);

            //返回主库信息
            $('.majorBlock').find('textarea').val(result.fzInfo);

            //所有input不可操作
            $('#fxGoods').find('input').attr('disabled',true).addClass('disabled-block');

            $('#fxGoods').find('textarea').attr('disabled',true).addClass('disabled-block');




        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });

    //返修件状态常量
    function BJStatus(){

        var prm = {
            //返修件编码
            "fxCode": "",
            //用户id
            "userID": _userIdNum,
            //用户姓名
            "userName": _userIdName,
            //用户角色
            "b_UserRole": _userRole,
            //当前部门
            "b_DepartNum": _loginUser.departNum
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXGetFxStatus',
            data:prm,
            beforeSend:function(){
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                _statusArr.length = 0;

                var str1 = '<option value="">请选择</option>';

                for(var i=0;i<result.statuses.length;i++){

                    if(result.statuses[i].fxType == _status){

                        str1 += '<option value="' + result.statuses[i].optType +
                            '">' + result.statuses[i].fxOpt + '</option>>'

                        _statusArr.push(result.statuses[i]);
                    }

                }

                //操作选择
                $('#optioning').empty().append(str1);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //获取日志
    function logFile(){

        var prm = {
            fxCode: _fxCode,
            logType: 2,
            userID: _userIdNum,
            userName: _userIdName,
            b_UserRole: _userRole,
            b_DepartNum: _loginUser.departNum
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXGetLog',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '';
                for(var i =0;i<result.length;i++){
                    str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                }
                $('.deal-with-list').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

})