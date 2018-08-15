$(function(){

    /*-------------------------------------时间插件-----------------------------------*/

    _timeYMDComponentsFun11($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).startOf('months').format('YYYY-MM-DD');

    var et = moment(nowTime).endOf('months').format('YYYY-MM-DD');

    $('.min').val(st);

    $('.max').val(et);

    conditionSelect();

    /*-------------------------------------表格初始化----------------------------------*/

    var col = [

        {
            title:'日期',
            data:'日期'
        },
        {
            title:'起数(m3)',
            data:'起数(m3)'
        },
        {
            title:'止数(m3)',
            data:'止数(m3)'
        },
        {
            title:'实际数(m3)',
            data:'实际数(m3)'
        },
        {
            title:'转换重量(吨)',
            data:'转换重量(吨)'
        },
        {
            title:'过磅重量(吨)',
            data:'过磅重量(吨)'
        },
        {
            title:'转换立方数',
            data:'转换立方数'
        }

    ];

    _tableInit($('.table'),col,2,false,'','','','',10,'',drawHreaer);

    var tableI = 0;

    //在表头插入院区
    function drawHreaer(settings){

        if(tableI == 0){

            var str = '<tr><th colspan="5">设备监控组液氧统计量</th><th colspan="2">朝阳统计量</th></tr>';

            $('.table thead').prepend(str);

        }

        tableI++;

    }

    /*-------------------------------------按钮事件------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //导出
    $('.excelButton').click(function(){

        //临时取消分页
        _tableInit($('.table'),col,2,false,'','','','',10,true,drawHreaer);

        //首先判断当前标签所对应的表格
        _FFExcel($('.table')[0]);

        //还原分页
        _tableInit($('.table'),col,2,false,'','','','',10,'',drawHreaer);

    })


    /*------------------------------------获取数据-------------------------------------*/

    function conditionSelect(){

        var prm = {

            'reportID':'104',

            'requesparameters':[

                //开始时间
                {
                    name:'st',

                    value:$('.min').val()
                },
                //结束时间
                {

                    name:'et',

                    value:$('.max').val()

                }
            ]

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWFZ/GetFroms',

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

                if(result != null){

                    if(result.length == 0){

                        return false;

                    }else{

                        var dataArr = _packagingTableData(result[1]);

                        _jumpNow($('.table'),dataArr.reverse());

                    }

                }

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