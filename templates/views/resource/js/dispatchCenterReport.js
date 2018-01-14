$(function(){
    /*------------------------------------时间--------------------------------------------------*/

    var now = moment().format('YYYY/MM/DD');

    var st = moment(now).startOf('month').format('YYYY/MM/DD');

    var et = now;

    $('.min').val(st);

    $('.max').val(et);

    _timeYMDComponentsFun($('.datatimeblock'));

    /*------------------------------------表格初始化---------------------------------------------*/

    var reportCol = [

        {
            title:'物资编码',
            data:'itemNum'
        },
        {
            title:'物资名称',
            data:'itemName'
        },
        {
            title:'型号',
            data:'size'
        },
        {
            title:'单位',
            data:'unitName'
        },
        {
            title:'数量',
            data:'num'
        },
        {
            title:'关联工单号',
            data:'gdCode2'
        }
    ]

    _tableInit($('#report-datatables'),reportCol,1,'flag','','','','');

    conditionSelect();

    /*------------------------------------按钮事件----------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //重置
    $('.resites').click(function(){

        $('.condition-query').eq(0).find('input').val('');

        $('.min').val(st);

        $('.max').val(et);

        $('.condition-query').eq(0).find('select').val('');

    })

    /*-----------------------------------其他方法-----------------------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //配件编码
            itemNum:$('.condition-query').find('input').eq(1).val() ,
            //配件名称
            itemName:$('.condition-query').find('input').eq(0).val(),
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
            'b_DepartNum':_loginUser.departNum
        };

        var name = '';

        if($('#workshop').val() == ''){

            name = '';

        }else{

            name = $('#workshop').children('option:selected').html();
        }

        //首先判断班组是否为空
        if($('#group').val() == ''){

            //判断车间是否为空
            if($('#workshop').val() == ''){



            }else{

                //传数组
                var bzArr = $('#group').children();

                var arr = [];

                for(var i=1;i<bzArr.length;i++){

                    arr.push(bzArr.eq(i).attr('value'));

                }

                prm.wxKeshiNums = arr;

                prm.wxKeshiName = name;

            }

        }else{

            prm.wxKeshiNum = $('#group').val();

            prm.wxKeshiName = $('#group').children('option:selected').html();

        }

        $.ajax({

            type:'post',
            url:_urls + 'ywGD/ywGDRptShortItem',
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