$(function(){

    /*-------------------------------------时间插件----------------------------------------*/

    var nowTime = moment().format('YYYY/MM/DD');

    if($('#timeType').val() == 0){

        _monthDate($('.datatimeblock'));

    }else{

        _yearDate($('.datatimeblock'));

    }

    //默认时间
    $('.datatimeblock').val(moment(nowTime).format('YYYY/MM'));

    $('#timeType').change(function(){

        if($(this).val() == 0){

            _monthDate($('.datatimeblock'));

            //时间设置
            $('.datatimeblock').val(moment(nowTime).format('YYYY/MM'))

        }else if( $(this).val() == 1 ){

            _yearDate($('.datatimeblock'));

            //时间设置
            $('.datatimeblock').val(moment(nowTime).format('YYYY'))

        }

    })

    //查询时间
    var excelTime = '';

    /*--------------------------------按钮事件-----------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //打印
    $('#print').click(function(){

        _printFun($('#entry-datatables'));

    })

    //导出
    $('.excelButton').click(function(){

        _exportExecl($('#entry-datatables'));

    })


    /*--------------------------------其他方法-----------------------------------------------*/

    //条件查询
    function conditionSelect(){

        //参数
        var prm = {

            //车站

            //报表内容

            //时间选择


        }

        _mainAjaxFun('post','',prm,successFun);

        function successFun(result){

            console.log(result);

        }


    }

})