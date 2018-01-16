$(function(){

    /*------------------------------------时间--------------------------------------------------*/

    var now = moment().subtract(1,'months').format('YYYY/MM/DD');

    var st = moment(now).startOf('month').format('YYYY/MM/DD');

    var et = moment(now).endOf('month').format('YYYY/MM/DD');

    $('.min').val(st);

    $('.max').val(et);

    _timeYMDComponentsFun($('.datatimeblock'));

    /*------------------------------------表格初始化---------------------------------------------*/

    var reportCol = [

        {
            title:'工单编号',
            data:'gdCode2'
        },
        {
            title:'工单类型',
            data:'gdJJ',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '快速'
                }else{
                    return '普通'
                }
            }
        },
        {
            title:'工单状态',
            data:'gdZht',
            render: function (data, type, full, meta) {
                if (data == 1) {
                    return '待下发'
                }
                if (data == 2) {
                    return '待分派'
                }
                if (data == 3) {
                    return '待执行'
                }
                if (data == 4) {
                    return '执行中'
                }
                if (data == 5) {
                    return '等待资源'
                }
                if (data == 6) {
                    return '待关单'
                }
                if (data == 7) {
                    return '任务关闭'
                }
                if (data == 999) {
                    return '任务取消'
                }
            }
        },
        {
            title:__names.department,
            data:'bxkeshi'
        },
        {
            title:'设备名称',
            data:'dName'
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'故障受理时间',
            data:'shouLiShij'
        },
        {
            title:'故障闭环时间',
            data:'guanbiShij'
        },
        {
            title:'配件名称',
            data:'itemName'
        },
        {
            title:'配件型号',
            data:'size'
        },
        {
            title:'计量单位',
            data:'unitName'
        },
        {
            title:'返厂修日期',
            data:'fcShij'
        },
        {
            title:'厂家名称',
            data:'cusName'
        },
        {
            title:'快递公司',
            data:'fcKdComp'
        },
        {
            title:'快递单号',
            data:'fxKdinfo'
        },
        {
            title:'预计返回良品日期',
            data:'estbackDate'
        },
        {
            title:'厂家发货日期',
            data:'backDate'
        },
        {
            title:'快递公司',
            data:'fcKdComp2'
        },
        {
            title:'快递单号',
            data:'fcKdinfo2'
        },
        {
            title:'收货地点',
            data:'receiveAddr'
        }

    ]

    _tableInit($('#report-datatables'),reportCol,1,'flag','','','','');

    /*------------------------------------按钮事件----------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //重置
    $('.resites').click(function(){

        $('.min').val(st);

        $('.max').val(et);

    })

    /*-----------------------------------其他方法-----------------------------------------------*/

    function conditionSelect(){

        var ckArr = [];

        for(var i=0;i<_AWarehouseArr.length;i++){

            ckArr.push(_AWarehouseArr[i].storageNum);

        }

        var prm = {

            //开始时间
            'st':$('.min').val(),
            //结束时间
            'et':moment($('.max').val()).add(1,'d').format('YYYY/MM/DD'),
            //用户ID
            'userID':_userIdNum,
            //用户姓名
            'userName':_userIdName,
            //用户角色
            'b_UserRole':_userRole,
            //当前部门
            'b_DepartNum':_loginUser.departNum,
            //条件参数
            'clType':0,
            //仓库
            'storageNums':ckArr,
            //区分报表类型
            'optType':'fanchang'
        };

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXGetGDItemII',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {

                $('#theLoading').modal('show');

            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){

                _datasTable($('#report-datatables'),result);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败！', '');

                }

            }

        })


    }


})