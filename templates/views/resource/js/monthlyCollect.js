$(function(){
    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY/MM/DD');

    //获得初始数据
    conditionSelect();

    //表格时间
    $('.max').val(nowTime);

    $('.btn1').on('click',function(){
        var st = $('.min').val();
        var et = $('.max').val();
        if(st == '' || et == ''){
            _moTaiKuang($('#myModal2'),'提示','flag','istap','起止时间不能为空！','');
        }else{
            var prm = {
                "lastDayDate": st,
                "dayDate": et,
                "userID":  _userIdNum,
                "userName": _userIdName
            };
            $.ajax({
                type:'post',
                url:_urls + 'YWCK/ywCKRptCheckMonthStock',
                timeout: _theTimes,
                data:prm,
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },

                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success:function(result){
                    $('#theLoading').modal('hide');
                    if(result == 99){
                        myAlter('结存成功');
                        conditionSelect();
                    }else{
                        myAlter('结存失败')
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    $('#theLoading').modal('hide');
                    console.log(jqXHR.responseText);
                }
            })
        }
    });

    ////表格人
    //$('.table-person').html(_userIdName);

    /*--------------------------------------按钮事件-------------------------------*/
    ////查询
    //$('#selected').click(function(){
    //    //改变表头的时间
    //    $('.table-time').html(nowTime);
    //    //条件查询
    //    conditionSelect();
    //});
    //
    ////重置
    //$('.resites').click(function(){
    //    //时间置为今日
    //    $('.datatimeblock').val(nowTime);
    //    //select置为所有
    //    $('#storage').val('');
    //});
    //
    ////导出
    //$('.excelButton11').on('click',function(){
    //    _FFExcel($('#scrap-datatables')[0]);
    //});

    /*-------------------------------------其他方法--------------------------------*/
    function conditionSelect(){

        var prm = {

            "userID":  _userIdNum,
            "userName": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptGetHisMonthStock',
            timeout: _theTimes,
            data:prm,
            success:function(result){
                $('#selected').attr('disabled',false);
                var html = '';
                for(var i=0; i<result.length; i++){
                    var showTime = result[i].split(' ')[0];
                    if(i == 0){
                        if(result.length < 2){
                            $('.min').val(showTime.replace(/-/g,'/'));

                        }
                        html += '<tr><td><a target="_blank" href="materialMonthlyReport.html?'+showTime+'">'+showTime+'</a> </td>'
                    }else if(i == result.length - 1){
                        html += '<td><a target="_blank" href="materialMonthlyReport.html?'+showTime+'">'+showTime+'</a> </td></tr>';

                        $('.min').val(showTime.replace(/-/g,'/'));
                    }else if(i % 6 != 0){
                        html += '<td><a target="_blank" href="materialMonthlyReport.html?'+showTime+'">'+showTime+'</a></td>'
                    }else{

                            html += '</tr><tr><td><a target="_blank" href="materialMonthlyReport.html?'+showTime+'">'+showTime+'</a> </td>'

                    }
                }
                $('#scrap-datatables tbody').html(html);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }


})