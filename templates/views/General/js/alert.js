$(function(){

    /*------------------------------------时间插件-----------------------------------*/

    $('.dataTimeBlock').datepicker({
        language:  'en',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy-mm-dd',
        forceParse: 0,
        autoclose: 1
    });

    //开始时间
    var nowTime = moment().format('YYYY-MM-DD');

    //开始时间
    var st = moment(nowTime).format('YYYY-MM-DD');

    //结束时间
    var et = moment(nowTime).add(7,'day').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(et);

    /*-----------------------------------获取数据---------------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {



        };

        $.ajax(function(){

            type

        })

    }



})