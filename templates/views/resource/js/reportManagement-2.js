$(function(){

    /*---------------------------------------------时间插件--------------------------------*/

    _timeYMDComponentsFun($('.datatimeblock'));

    //设置初始时间
    var now = moment().format('YYYY/MM/DD');

    var st = moment(now).startOf('months').format('YYYY/MM/DD');

    var et = moment(now).endOf('months').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(st);

    $('.datatimeblock').eq(1).val(et);

    /*---------------------------------------------表格初始化------------------------------*/

    var col = [

        {
            title:'姓名',
            data:'wxRName'
        },
        {
            title:'维修部门',
            data:'wxKeshi'
        },
        {
            title:'接工量',
            data:'gdNum'
        },
        {
            title:'完工量',
            data:'gdWgNum'
        },
        {
            title:'未完工量',
            data:'gdWwgNum'
        },
        {
            title:'维修耗时',
            data:'wxShij',
            render:function(data, type, full, meta){
                return Number(data).toFixed(2)
            }
        }

    ]

    _tableInit($('#scrap-datatables'),col,2,false,'','','','','','');

    //加载部门
    getWxDep();

    /*---------------------------------------------按钮事件-------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //重置
    $('.resites').click(function(){

        $('.datatimeblock').eq(0).val(st);

        $('.datatimeblock').eq(1).val(et);

        $('#depart').val('');

    })

    //导出
    $('.excelButton').click(function(){

        //导出所有数据
        _tableInit($('#scrap-datatables'),col,2,false,'','','','','',true);

        _FFExcel($('#scrap-datatables')[0]);

        _tableInit($('#scrap-datatables'),col,2,false,'','','','','','');


    })

    /*---------------------------------------------其他方法-------------------------------*/

    //获取维修部门
    function getWxDep(){

        var prm = {
            //是否维修部门
            isWx:1,
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole
        }

        $.ajax({

            type:'post',

            url:_urls + 'RBAC/rbacGetDeparts',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                var str = '<option value="">全部</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].departNum + '">' + result[i].departName + '</option>'

                }

                $('#depart').empty().append(str);

                //获取数据
                conditionSelect();
            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

                }

            }

        })

    }

    //条件查询
    function conditionSelect(){

        var prm = {

            //开始时间
            gdSt:$('.datatimeblock').eq(0).val(),
            //结束时间
            gdEt:moment($('.datatimeblock').eq(1).val()).add(1,'d').format('YYYY/MM/DD'),
            //维修科室
            wxKeshi:$('#depart').children('option:selected').html()=='全部'?'':$('#depart').children('option:selected').html(),
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDRptRen',

            data:prm,

            timeout:_theTimes,

            beforeSend: function () {

                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },

            success:function(result){

                _jumpNow($('#scrap-datatables'),result);

            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

                }

            }

        })

    }
})