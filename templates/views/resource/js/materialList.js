$(function(){

    /*----------------------------------------------时间插件---------------------------------------------*/

    _timeYMDComponentsFun($('.datatimeblock'));

    var now = moment().subtract(1,'months').format('YYYY/MM');

    var dateST = moment(now).startOf('month').format('YYYY/MM/DD');

    var dateET = moment(now).endOf('month').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(dateST);

    $('.datatimeblock').eq(1).val(dateET);

    /*---------------------------------------------根据用户，获取维修班组--------------------------------*/

    _WxBanzuStationData(WXBZList);

    function  WXBZList(){

        _BZList($('.tiaojian'),function(){

            conditionSelect();

        },true)

    }

    /*-------------------------------------------------表格初始化--------------------------------------*/

    var col = [

        {
            title:'科室名称',
            data:'bxKeshiName'
        },
        {
            title:'材料名称',
            data:'wxClName'
        },
        {
            title:'规格',
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
            title:'单价',
            data:'price'
        },
        {
            title:'合计金额',
            data:'clAmount'
        },
        {
            title:'工时费',
            data:'gsFee'
        },
        {
            title:'备注',
            data:'wxBeizhu'
        }

    ]

    _tableInit($('#scrap-datatables'),col,2,'','','','','','','');

    /*-------------------------------------------------其他方法----------------------------------------*/

    //条件选择
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
            //维修班组
            wxKeshiNum:$('.tiaojian').val(),
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDRptKSFees',

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


                if (textStatus == 'timeout') {//超时,status还有success,error等值的情

                    _moTaiKuang($('#tipModal'), '提示', true, 'istap' ,'超时', '');

                }else{

                    _moTaiKuang($('#tipModal'), '提示', true, 'istap' ,'请求失败！', '');

                }

            }

        })

    }

    /*-------------------------------------------------按钮事件---------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //重置
    $('.resites').click(function(){

        $('.datatimeblock').eq(0).val(dateST);

        $('.datatimeblock').eq(1).val(dateET);

        var num = $('.tiaojian').children('option').eq(0).attr('value');

        $('.tiaojian').val(num);

    })


})