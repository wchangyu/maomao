$(function(){

    /*------------------------------------------------时间-------------------------------------*/

    //日历
    _timeYMDComponentsFun($('.selectTime'));

    //默认结束时间
    var demoTime = moment().format('YYYY/MM/DD');

    //默认开始时间
    var demoStime = moment().subtract(6,'d').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(demoStime);

    $('.datatimeblock').eq(1).val(demoTime);

    /*-----------------------------------------------表格初始化---------------------------------*/
    //总体情况
    var allReportingCol = [

        {
            title:'类别',
            data:'category'
        },
        {
            title:'工单数量',
            data:'gdNum'
        },
        {
            title:'日平均',
            data:'dayAverage'
        },
        {
            title:'所占百分比',
            data:'percentage'
        }

    ]

    _tableInit($('#all-reporting'),allReportingCol,2,false,'','','','','','');


    //按房屋
    var houseReportingCol = [

        {
            title:'房屋名称',
            data:'houseName'
        },
        {
            title:'本周维修次数',
            data:'WeekMaintenanceTimes'
        },
        {
            title:'占维修总百分比%',
            data:'allPercentage'
        },
        {
            title:'上周同类所占百分比',
            data:'classPercentage'
        },
        {
            title:'与上周比%',
            data:'LastWeekPercentage'
        }

    ]

    _tableInit($('#house-reporting'),houseReportingCol,2,false,'','','','','','');

    //默认数据
    conditionSelect();

    /*-----------------------------------------------按钮事件----------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //时间改变触发事件
    $('.selectTime').on('changeDate',function(){

        //获取选择的时间
        var nowSelect = $(this).val();

        //结束时间
        var selectEt = moment(nowSelect).add(6,'d').format('YYYY/MM/DD');

        //赋值
        $('.datatimeblock').eq(0).val(nowSelect);

        $('.datatimeblock').eq(1).val(selectEt);

    })

    //选项卡事件
    $('.table-title span').click(function(){

        //选项卡样式修改
        $('.table-title').children('span').removeClass('spanhover');

        $(this).addClass('spanhover');

        //表格对应情况
        $('.table-title').next().children().addClass('hide-block');

        $('.table-title').next().children().eq($(this).index()).removeClass('hide-block');

    })

    //导出
    $('.excelButton').click(function(){

        //_FFExcel($('#scrap-datatables')[0]);
        //首先判断要导出哪些表格
        var index = $('.table-title .spanhover').index();

        if(index == 0){

            _FFExcel($('#all-reporting')[0]);

        }else{

            _FFExcel($('#house-reporting')[0]);

        }

    })

    /*------------------------------------------------其他方法---------------------------------*/

    function conditionSelect(){

        //确定标题
        var str = '服务热线（' + dateFormat($('.datatimeblock').eq(0).val()) + '-' + dateFormat($('.datatimeblock').eq(1).val()) + '）工作统计及分析';

        $('.table-block-title').html(str);

        //发送数据(总体情况)
        var prm = {

            'reportID':'1002',
            //参数
            'requesparameters':[

                //开始时间
                {
                    name:'st',

                    value:$('.datatimeblock').eq(0).val()
                },

                //结束时间
                {

                    name:'et',

                    value:$('.datatimeblock').eq(1).val()
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

                var dataArr = _packagingTableData(result[1]);

                _jumpNow($('#all-reporting'),dataArr.reverse());

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

    //日期转化为日周月年
    function dateFormat(date){

        var year = date.split('/')[0];

        var month = date.split('/')[1];

        var day = date.split('/')[2];

        return year + '年' + month + '月' + day + '日'

    }

})