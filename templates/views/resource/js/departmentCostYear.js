$(function(){

    /*------------------------------------------------时间-------------------------------------*/

    //月份
    _yearDate($('.datatimeblock'));

    //默认上月
    var demoTime = moment().subtract(1,'months').format('YYYY');

    $('.datatimeblock').val(demoTime);

    /*----------------------------------------------表格初始化------------------------------------*/

    //某科室费用明细
    var allSectionCol = [

        {
            title:'科室名称',
            data:'bxKeshi'
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
            data:'clShul'
        },
        {
            title:'单价',
            data:'wxClPrice'
        },
        {
            title:'合计金额',
            data:'clFee'
        },
        {
            title:'工时费',
            data:'gongshiFee'
        },
        {
            title:'总计金额',
            data:'gdFee'
        },
        {
            title:'报修日期',
            data:'gdShij'
        },
        {
            title:'报修内容',
            data:'bxBeizhu'
        },
        {
            title:'维修内容',
            data:'wxBeizhu'
        }

    ]

    _tableInit($('#oneSectionTable'),allSectionCol,2,false,'','','','',10,'');

    conditionSelect();

    /*----------------------------------------------按钮事件--------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //导出
    $('.excelButton').click(function(){

        _FFExcel($('#oneSectionTable')[0]);

    })

    //打印的时候，去掉翻译部分
    $('.table').next().addClass('noprint');

    /*----------------------------------------------其他方法--------------------------------------*/

    function conditionSelect(){

        //修改表头

        var title = $('.datatimeblock').val() + '年'

        $('.reportTime').html(title);

        var prm = {

            'reportID':'1007',

            'requesparameters':[

                //开始时间
                {
                    name:'st',

                    value:moment($('.datatimeblock').val()).format('YYYY/MM/DD')
                },
                //结束时间
                {

                    name:'et',

                    value:moment($('.datatimeblock').val()).endOf('years').format('YYYY/MM/DD')

                },
                {
                    name:'bxKeshiNum',

                    value:_userBM
                }
            ]

        }

        function successFun(result){

            if(result != null){

                if(result.length == 0){

                    return false;

                }else{

                    var dataArr = _packagingTableData(result[1]);

                    _jumpNow($('#oneSectionTable'),dataArr.reverse());

                }

            }

        }

        _mainAjaxFun('post','YWFZ/GetFroms',prm,successFun);

    }


});