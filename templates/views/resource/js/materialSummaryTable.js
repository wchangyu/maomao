$(function(){

    /*----------------------------------------------时间插件---------------------------------------------*/

    _timeYMDComponentsFun($('.datatimeblock'));

    var now = moment().subtract(1,'months').format('YYYY/MM');

    var dateST = moment(now).startOf('month').format('YYYY/MM/DD');

    var dateET = moment(now).endOf('month').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(dateST);

    $('.datatimeblock').eq(1).val(dateET);

    /*--------------------------------------------初始化表格--------------------------------------------*/

    var col = [

        {
            title:'科室名称',
            data:'bxKeshiName'
        },
        {
            title:'材料合计',
            data:'clFee'
        },
        {
            title:'工时合计',
            data:'gsFee'
        },
        {
            title:'科室总计',
            data:'fee'
        }

    ]

    _tableInit($('#scrap-datatables'),col,2,'','',drawFn,'','','','');

    function drawFn(){

        //材料总计
        var clTotal = 0;

        //工时总计
        var gsTotal = 0;

        //科室总计
        var ksTotal = 0;

        //数据的条数
        var lengths = 0;

        //确定有多少条数据

        lengths = $('#scrap-datatables').find('tbody').children('tr').length - 2;

        for(var i=0;i<lengths;i++){

            //材料合计
            clTotal += Number($('#scrap-datatables tbody').children('tr').eq(i).find('td').eq(1).html());

            //工时合计
            gsTotal += Number($('#scrap-datatables tbody').children('tr').eq(i).find('td').eq(2).html());

            //科室总计
            ksTotal += Number($('#scrap-datatables tbody').children('tr').eq(i).find('td').eq(3).html());
        }

        //材料合计
        $('#scrap-datatables').children('tfoot').children('tr').eq(0).children().eq(1).html(clTotal);

        //工时合计
        $('#scrap-datatables').children('tfoot').children('tr').eq(0).children().eq(2).html(gsTotal);

        //科室总计
        $('#scrap-datatables').children('tfoot').children('tr').eq(0).children().eq(3).html(ksTotal);

    };

    conditionSelect();

    /*-------------------------------------------按钮事件----------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect()

    })

    //重置
    $('.resites').click(function(){

        //时间重置
        $('.datatimeblock').eq(0).val(dateST);

        $('.datatimeblock').eq(1).val(dateET);

        //select重置
        $('.tiaojian').val('');

    })

    //导出
    $('.excelButton').click(function(){

        _FFExcel($('#scrap-datatables')[0]);

    })


    /*-------------------------------------------其他方法----------------------------------------------*/

    function conditionSelect(){

        //时间
        var st = $('.datatimeblock').eq(0).val();

        var et = moment($('.datatimeblock').eq(1).val()).add(1,'d').format('YYYY/MM/DD');

        //时间
        $('#scrap-datatables').find('caption').children('span').html(st + '到' + $('.datatimeblock').eq(1).val() );

        var prm = {

            //开始时间
            gdSt:st,
            //结束时间
            gdEt:et,
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName
        }

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDRptKeshiFee',

            data:prm,

            timeout:_theTimes,

            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

            },

            success:function(result){

                _jumpNow($('#scrap-datatables'),result);

                //材料总计
                var clTotal = 0;

                //工时总计
                var gsTotal = 0;

                //科室总计
                var ksTotal = 0;

                //总计
                for(var i=0;i<result.length;i++){

                    clTotal += result[i].clFee;

                    gsTotal += result[i].gsFee;

                    ksTotal += result[i].fee;

                }

                //材料合计
                $('#scrap-datatables').children('tfoot').children('tr').eq(1).children().eq(1).html(clTotal);

                //工时合计
                $('#scrap-datatables').children('tfoot').children('tr').eq(1).children().eq(2).html(gsTotal);

                //科室总计
                $('#scrap-datatables').children('tfoot').children('tr').eq(1).children().eq(3).html(ksTotal);


            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情

                    _moTaiKuang($('#tipModal'), '提示', true, 'istap' ,'超时', '');

                }else{

                    _moTaiKuang($('#tipModal'), '提示', true, 'istap' ,'请求失败！', '');

                }

            }

        })

    }


})