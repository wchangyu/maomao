$(function(){

    /*---------------------------------------------------------时间插件--------------------------------------------------*/

    //默认按日初始化
    _timeYMDComponentsFun($('.datatimeblock'));

    //日期选择
    $('#timeType').change(function(){

        $('.timeShow').hide();

        if($(this).val() == 'day'){

            _timeYMDComponentsFun($('.datatimeblock'));

            var data = moment().format('YYYY/MM/DD');

            $('.datatimeblock').eq(0).val(data);

        }else if($(this).val() == 'month'){

            _monthDate($('.datatimeblock'));

            var data = moment().format('YYYY/MM');

            $('.datatimeblock').eq(0).val(data)

        }else if($(this).val() == 'year'){

            _yearDate($('.datatimeblock'));

            var data = moment().format('YYYY');

            $('.datatimeblock').eq(0).val(data);

        }else if($(this).val() == 'week'){

            _timeYMDComponentsFun($('.datatimeblock'));

            var data = moment().format('YYYY/MM/DD');

            var startData = moment(data).startOf('week').add(1,'d').format('YYYY/MM/DD');

            var endData = moment(data).endOf('week').add(1,'d').format('YYYY/MM/DD');

            $('.datatimeblock').eq(0).val(startData);

            $('.datatimeblock').eq(1).val(endData);

            $('.timeShow').show();

        }else if($(this).val() == 'custom'){

            _timeYMDComponentsFun($('.datatimeblock'));

            var data = moment().format('YYYY/MM/DD');

            $('.datatimeblock').eq(0).val(data);

            $('.datatimeblock').eq(1).val(data);

            $('.timeShow').show();

        }

    });

    //默认时间
    var nowTime = moment().format('YYYY/MM/DD');

    $('.datatimeblock').val(nowTime);

    /*-------------------------------------------------------表格初始化---------------------------------------------------*/
    var col = [

        {
            title:'日期',
            data:'日期'
        },
        {
            title:'用电量（度）',
            data:'用电量（度）'
        },
        {
            title:'污水排放量（吨）',
            data:'污水排放量（吨）'
        },
        {
            title:'余氯（mg/L）',
            data:'余氯（mg/L)'
        },
        {
            title:'COD浓度（mg/L）',
            data:'COD浓度（mg/L）'
        },
        {
            title:'盐用量（公斤）',
            data:'盐用量（公斤）'
        },
        {
            title:'执行人',
            data:'执行人'
        }

    ]

    _tableInit($('#all-reporting'),col,2,false,'','','','',10,'');

    conditionSelect();

    /*------------------------------------------------------按钮事件-----------------------------------------------------*/

    $('#selected').click(function(){

        conditionSelect();

    })

    //导出
    $('.excelButton').click(function(){

        _FFExcel($('#all-reporting')[0]);

    })

    //打印
    $('.dataTables_length').parent().addClass('noprint');

    /*-----------------------------------------------------其他方法------------------------------------------------------*/

    function conditionSelect(){

        //开始时间
        var st = '';
        //结束时间
        var et = '';

        if($('#timeType').val() == 'day'){

            st = moment($('.datatimeblock').eq(0).val()).format('YYYY/MM/DD');

            et = moment($('.datatimeblock').eq(0).val()).format('YYYY/MM/DD');

        }else if($('#timeType').val() == 'month'){

            st = moment($('.datatimeblock').eq(0).val()).startOf('months').format('YYYY/MM/DD');

            et = moment($('.datatimeblock').eq(0).val()).endOf('months').format('YYYY/MM/DD');

        }else if($('#timeType').val() == 'year'){

            st = moment($('.datatimeblock').eq(0).val()).startOf('years').format('YYYY/MM/DD');

            et = moment($('.datatimeblock').eq(0).val()).endOf('years').format('YYYY/MM/DD');

        }else if($('#timeType').val() == 'week'){

            st = moment($('.datatimeblock').eq(0).val()).format('YYYY/MM/DD');

            et = moment($('.datatimeblock').eq(1).val()).format('YYYY/MM/DD');

        }else if($('#timeType').val() == 'custom'){

            st = moment($('.datatimeblock').eq(0).val()).format('YYYY/MM/DD');

            et = moment($('.datatimeblock').eq(1).val()).format('YYYY/MM/DD');

        }

        var prm = {

            'reportID':'101',
            'requesparameters':[

                //开始时间
                {
                    name:'st',

                    value:st
                },
                //结束时间
                {

                    name:'et',

                    value:et

                }
            ]

        }

        _mainAjaxFun('post','YWFZ/GetFroms',prm,successFun);

        function successFun(result){

            var dataArr = _packagingTableData(result[1]);

            _jumpNow($('#all-reporting'),dataArr);

        }


    }

})