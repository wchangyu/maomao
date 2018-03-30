$(function(){

    /*------------------------------------------时间插件--------------------------------------------*/

    //月份
    _monthDate($('.datatimeblock'));

    //默认上月
    var demoTime = moment().subtract(1,'months').format('YYYY/MM');

    $('.datatimeblock').val(demoTime);

    /*------------------------------------------表格初始化------------------------------------------*/

    var col = [

        {
            title:'时间',
            data:'time'
        },
        {
            title:'需求单位',
            data:'demandUnit'
        },
        {
            title:'科室或楼层',
            data:'pointer'
        },
        {
            title:'通知发出时间',
            data:'sendTime'
        },
        {
            title:'故障原因',
            data:'causeOfFailure'
        },
        {
            title:'执行班组',
            data:'executiveTeam'
        },
        {
            title:'任务完成时间',
            data:'completeTime'
        },
        {
            title:'值班人',
            data:'onDutyPerson'
        },
        {
            title:'备注',
            data:'remark'
        }

    ]

    _tableInit($('#scrap-datatables'),col,2,false,'','','','','','');

    //默认加载
    conditionSelect();

    /*------------------------------------------按钮方法-------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //导出
    $('.excelButton').click(function(){

        _FFExcel($('#scrap-datatables')[0]);

    })


    /*------------------------------------------其他方法-------------------------------------------*/

    function conditionSelect(){

        //标题
        var str = demoTime.split('/')[0] + '年' + demoTime.split('/')[1] + '月' + '后勤服务热线值班记录';

        $('.table').find('caption').html(str);

        var prm = {

            'reportID':'1001',

            'requesparameters':[

                {
                    name:'time',

                    value:$('.datatimeblock').val() + '/01'
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

                _jumpNow($('#scrap-datatables'),dataArr);

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