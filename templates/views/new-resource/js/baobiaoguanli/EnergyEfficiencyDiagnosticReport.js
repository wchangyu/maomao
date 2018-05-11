$(function(){

    /*-----------------------------------------时间---------------------------------------------------*/

    var nowTime = moment().format('YYYY/MM/DD');

    //默认值
    $('.datatimeblock').val(nowTime);

    _timeYMDComponentsFun($('.datatimeblock'));

    /*---------------------------------------按钮事件------------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect()

    })

    //打印
    $('#print').click(function(){

        _printFun($(".currentOptionTable"));

    })

    //导出
    $('.excelButton').click(function(){

        //判断当前要导出哪个表格
        var currentTable = $('.currentOptionTable');

        _exportExecl(currentTable);

    })

    /*-------------------------------------其他方法--------------------------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {



        };

        _mainAjaxFun();

        function successFun(){

            //初始化表格
            $('.table').removeClass('currentOptionTable');

            //判断当前查询的报表内容是什么
            if( $('#reporContent').val() == 0 ){

                $('#efficiency-datatables').addClass('currentOptionTable');

            }else if( $('#reporContent').val() == 1 ){

                $('#working-datatables').addClass('currentOptionTable');

            }else if( $('#reporContent').val() == 2 ){

                $('#environment-datatables').addClass('currentOptionTable');

            }

        }

    }



})