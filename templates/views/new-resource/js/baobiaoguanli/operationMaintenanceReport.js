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

        //通过判断状态
        if($('#entry-datatables').css('display') != 'none'){

            _printFun($('#entry-datatables'));

        }else if( $('#Satisfaction-datatables').css('display') != 'none' ){

            _printFun($('#Satisfaction-datatables'));

        }

    })

    //导出
    $('.excelButton').click(function(){

        //通过判断状态
        if($('#entry-datatables').css('display') != 'none'){

            _exportExecl($('#entry-datatables'));

        }else if( $('#Satisfaction-datatables').css('display') != 'none' ){

            _exportExecl($('#Satisfaction-datatables'));

        }

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

        //首先判断是工单统计还是满意度统计
        if($('#reporContent').val() == 0){

            //工单统计
            //配置
            //报表名称
            $('#table-titleH').html($('#reporContent').children('option:selected').html());

            //数据时间

            if($('#timeType').val() == 0){

                var dataTime = $('.datatimeblock').val().split('/');

                $('#entry-datatables').find('.data-time').html(dataTime[0] + '年' + dataTime[1] + '月');

            }else if($('#timeType').val() == 1){

                $('#entry-datatables').find('.data-time').html($('.datatimeblock').val() + '年');

            }

            //导出时间（查询时间）
            excelTime = moment().format('YYYY/MM/DD hh:mm:ss');

            $('#entry-datatables').find('.derive-time').html(excelTime);

            //当前位置
            $('#entry-datatables').find('.locationStation').html($('#area').children('option:selected').html());

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

                var str = '';

                for(var i=0;i<result.length;i++){

                    str += '<tr>' +
                        '<td style="text-align:center;border:1px solid black">' + result[i].rank + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].dsName + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdCnt + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdByMannualCnt + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdBySysCnt + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdFCnt + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdUFCnt + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdFPer + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdTimeConsume + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdFee + '</td>' +


                        '</tr>'

                }

                $('#entry-datatables').children('tbody').empty().append(str);


            }

            //都隐藏，然后显示
            $('.table').hide();

            //显示一部分
            $('#entry-datatables').show();

        }else{

            //满意度统计
            //配置
            //报表名称
            $('#table-titleS').html($('#reporContent').children('option:selected').html());

            //数据时间

            if($('#timeType').val() == 0){

                var dataTime = $('.datatimeblock').val().split('/');

                $('#Satisfaction-datatables').find('.data-time').html(dataTime[0] + '年' + dataTime[1] + '月');

            }else if($('#timeType').val() == 1){

                $('#Satisfaction-datatables').find('.data-time').html($('.datatimeblock').val() + '年');

            }

            //导出时间（查询时间）
            excelTime = moment().format('YYYY/MM/DD hh:mm:ss');

            $('#Satisfaction-datatables').find('.derive-time').html(excelTime);

            //当前位置
            $('#Satisfaction-datatables').find('.locationStation').html($('#area').children('option:selected').html());

            //发送数据
            var prm = {

                //车站
                bxKeshiNum:pointerId,
                //开始时间
                st:st,
                //结束时间
                et:et,
                //用户id
                userID:_userIdNum,
                //用户名
                userName:_userIdName

            }

            _mainAjaxFun('post','YWGD/ywGDRptMyd',prm,successFun1);

            function successFun1(result){

                var str = '';

                for(var i=0;i<result.length;i++){

                    str += '<tr>' +
                        '<td style="text-align:center;border:1px solid black">' + result[i].wxKeshi + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdNum + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdHmy + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdMy + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdYb + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdC + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdHc + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].gdWpj + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].pjl + '</td>' +

                        '<td style="text-align:center;border:1px solid black">' + result[i].myl + '</td>' +


                        '</tr>'

                }

                $('#Satisfaction-datatables').children('tbody').empty().append(str);

            }

            //都隐藏，然后显示
            $('.table').hide();

            //显示一部分
            $('#Satisfaction-datatables').show();

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