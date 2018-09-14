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

    _tableInit($('#scrap-datatables'),col,2,false,'',drawFn,'','','','');

    //重绘合计数据
    function drawFn(){

        var table = $('#scrap-datatables').DataTable();

        //表格中的每一个tr
        var tr = $('#scrap-datatables tbody').children('tr');

        //表格中的每一个td（接工量）
        var jgNum = 0;

        //完工量
        var wgNum = 0;

        //未完工量
        var wwgNum = 0;

        //维修耗时
        var time = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //遍历列
                //接工量
                jgNum += Number(tr.eq(i).children().eq(2).html());

                //完工量
                wgNum += Number(tr.eq(i).children().eq(3).html());

                //未完工量
                wwgNum += Number(tr.eq(i).children().eq(4).html());

                //维修耗时
                time += Number(tr.eq(i).children().eq(5).html());

            }

        }

        //接工量
        $('#pageJdNum').html(jgNum);

        //完工量
        $('#pageWGNum').html(wgNum);

        //未完工量
        $('#pageWWGNum').html(wwgNum);

        //维修耗时
        $('#pageTime').html(time.toFixed(2));

    };

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

        tableDataInit();

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

                //接工量
                var jgNum = 0;

                //完工量
                var wgNum = 0;

                //未完工量
                var wwgNum = 0;

                //维修耗时
                var time = 0;

                for(var i=0;i<result.length;i++){

                    var data = result[i];

                    //接工量
                    jgNum += Number(data.gdNum);

                    //完工量
                    wgNum += Number(data.gdWgNum);

                    //未完工量
                    wwgNum += Number(data.gdWwgNum);

                    //超时
                    time += Number(data.wxShij.toFixed(2));

                }

                //接工量
                $('#dataJdNum').html(jgNum);

                //完工量
                $('#dataWGNum').html(wgNum);

                //未完工量
                $('#dataWWGNum').html(wwgNum);

                //维修耗时
                $('#dataTime').html(time.toFixed(2));

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

    function tableDataInit(){

        $('.table').find('tfoot').find('td').html(0);

        $('.table').find('tfoot').find('tr').eq(1).find('td').eq(0).html('合计');

        _datasTable($('#scrap-datatables'),[]);

    }
})