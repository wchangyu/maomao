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

    });

    /*-----------------------------------变量--------------------------------------------*/

    //查询时间
    var excelTime = '';

    //楼宇数据
    pointerData();

    //默认数据加载
    conditionSelect(sessionStorage.getItem('PointerID'));

    /*--------------------------------按钮事件-----------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect($('#area').val());

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
    function conditionSelect(pointerId){

        //开始时间
        var st = '';

        //结束时间
        var et = '';

        //时间
        if($('#timeType').val() == 0){

            //月报表
            st = moment($('.datatimeblock').val()).startOf('months').format('YYYY/MM/DD');

            et = moment($('.datatimeblock').val()).endOf('months').add(1,'d').format('YYYY/MM/DD');


        }else if($('#timeType').val() == 1){

            //年报表
            st = moment($('.datatimeblock').val()).startOf('years').format('YYYY/MM/DD');

            et = moment($('.datatimeblock').val()).endOf('years').add(1,'d').format('YYYY/MM/DD');
        }

        //参数
        var prm = {

            //车站
            bxKeshiNum:pointerId,
            //开始时间
            st:st,
            //结束时间
            et:et
        }

        _mainAjaxFun('post','YWGD/ywGDGetDSRpt',prm,successFun);

        function successFun(result){

            console.log(result);

        }


    }

    //获取车站
    function pointerData(){

        var pointer = JSON.parse(sessionStorage.getItem('pointers'));

        var str = '';

        for(var i=0;i<pointer.length;i++){

            str += '<option value="' + pointer[i].pointerID + '">' + pointer[i].pointerName + '</option>';

        }

        $('#area').empty().append(str);


    }

})