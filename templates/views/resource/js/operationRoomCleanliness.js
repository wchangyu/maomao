$(function(){

    /*-------------------------------------时间插件-----------------------------------*/

    _timeYMDComponentsFun11($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY-MM-DD');

    $('.min').val(nowTime);

    /*-------------------------------------变量---------------------------------------*/

    //发送数据每个表格所对应的参数
    var prmArr = ['105','106','107','108'];

    //默认数据
    conditionSelect(prmArr[0],$('#option-room'));


    /*-------------------------------------表格初始化----------------------------------*/
    //手术间运行情况
    var optionRoomCol = [
        //{
        //    title:'报表id',
        //    data:'reportID'
        //},
        //{
        //    title:'序号',
        //    data:'order'
        //},
        //{
        //    title:'楼宇',
        //    data:'pid'
        //},
        //{
        //    title:'因子',
        //    data:'cid'
        //},
        //{
        //    title:'检查项目',
        //    data:'sid'
        //},
        {
            title:'检查内容',
            data:'name'
        },
        {
            title:'单位',
            data:'unit'
        },
        {
            title:'00:00',
            data:'time1'
        },
        {
            title:'02:00',
            data:'time2'
        },
        {
            title:'04:00',
            data:'time3'
        },
        {
            title:'06:00',
            data:'time4'
        },
        {
            title:'08:00',
            data:'time5'
        },
        {
            title:'10:00',
            data:'time6'
        },
        {
            title:'12:00',
            data:'time7'
        },
        {
            title:'14:00',
            data:'time8'
        },
        {
            title:'16:00',
            data:'time9'
        },
        {
            title:'18:00',
            data:'time10'
        },
        {
            title:'20:00',
            data:'time11'
        },
        {
            title:'22:00',
            data:'time12'
        },
        {
            title:'正常参数范围',
            data:'ref'
        },
        {
            title:'备注',
            data:'memo'
        }

    ];

    _tableInit($('.table'),optionRoomCol,2,false,'','','','',10,'');

    /*-----------------------------------------------按钮事件----------------------------------*/

    //选项卡事件
    $('.table-title span').click(function(){

        //选项卡样式修改
        $('.table-title').children('span').removeClass('spanhover');

        $(this).addClass('spanhover');

        //表格对应情况
        $('.table-title').next().children().addClass('hide-block');

        $('.table-title').next().children().eq($(this).index()).removeClass('hide-block');

        //发送数据
        //首先判断当前标签所对应的表格
        var index = $('.spanhover').index();

        //当前发送哪个数据
        conditionSelect(prmArr[index],$('.table').eq(index));


    })

    //查询事件
    $('#selected').click(function(){

        //首先判断当前标签所对应的表格
        var index = $('.spanhover').index();

        //当前发送哪个数据
        conditionSelect(prmArr[index],$('.table').eq(index));


    })

    //导出
    $('.excelButton').click(function(){

        //导出的时候临时取消分页
        _tableInit($('.table'),optionRoomCol,2,false,'','','','','',true,'');

        //首先判断当前标签所对应的表格
        var index = $('.spanhover').index();

        _FFExcel($('.table').eq(index)[0]);

        //导出之后还原分页
        _tableInit($('.table'),optionRoomCol,2,false,'','','','',10,'');

    })

    /*------------------------------------------------其他方法---------------------------------*/

    //条件查询
    function conditionSelect(num,table){

        //设置表头

        var title = $('.min').val() + $('.spanhover').html() + '报表';

        $('.table-block-title').html(title);

        //参数
        var prm = {

            'reportID':num,

            'requesparameters':[

                //时间
                {
                    name:'day',

                    value:$('.min').val()
                }
            ]

        };

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

                        _jumpNow(table,dataArr.reverse());

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