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
            title:'物资编码',
            data:''
        },
        {
            title:'物资名称',
            data:''
        },
        {
            title:'型号',
            data:''
        },
        {
            title:'单位',
            data:''
        },
        {
            title:'数量',
            data:''
        },
        {
            title:'关联工单号',
            data:''
        },
        {
            title:'所属车站',
            data:''
        },
        {
            title:'车间',
            data:''
        },
        {
            title:'配件申请耗时',
            data:''
        },
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
            //车间
            //配件名称
            //配件编码
        };

        $.ajax({

            type:'post',
            url:_urls + '',
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