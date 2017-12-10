$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY/MM/DD');

    //所有仓库
    var warehouseArr = [];

    //当前仓库
    var _currentWarehouse = '';

    //获取仓库
    warehouse();

    //获得初始数据
    conditionSelect();

    //表格时间
    $('.max').val(nowTime);

    $('.btn1').on('click',function(){

        if( $('#ckselect').val() == '' ){

            _moTaiKuang($('#deleteModal'), '提示', 'flag', 'istap' ,'请选择仓库！', '');

        }else{

            _moTaiKuang($('#balance-modal'),'提示','','istap','确定要结存吗？','结存');

        }

    });

    $('#balance-modal').on('click','.btn-primary',function(){

        //首先载入数据
        var arr = [];

        for(var i=0;i<warehouseArr.length;i++){

            arr.push(warehouseArr[i].storageNum);

        }

        var prm = {

            "userID":  _userIdNum,
            "userName": _userIdName

        };

        if($('#ckselect').val() == ''){

            prm.storageNums = arr;

        }else{

            prm.storageNum = $('#ckselect').val()

        }

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptGetHisMonthStock',
            timeout: _theTimes,
            data:prm,
            success:function(result){

                $('#selected').attr('disabled',false);

                var html = '';

                for(var i=0;i<result.length;i++){

                    var showTime = result[i].dayDate.split(' ')[0];

                    if(i==0){

                        html += '<tr><td data-storageNum = ' +  result[i].storageNum +
                            '>' + result[i].storageName +
                            '</td><td><a style="margin-left: 40px;" target="_blank" href="materialMonthlyReport.html?'+showTime+'">'+showTime+'</a><span class="data-option option-del btn default btn-xs green-stripe" style="float: right">删除</span></td></tr>'

                    }else{

                        html += '<tr><td data-storageNum = ' + result[i].storageNum +
                            '>' + result[i].storageName +
                            '</td><td><a target="_blank" href="materialMonthlyReport.html?'+showTime+'">'+showTime+'</a></td></tr>'

                    }


                }

                $('#scrap-datatables tbody').html(html);
                var lastTime = '';
                if(result.length == 0){

                    $('.min').val('');

                }else{

                    $('.min').val(result[0].dayDate.split(' ')[0].replace(/-/g,'/'));
                    lastTime = result[0].dayDate;
                }

                //结存方法
                balanceFun(lastTime);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })




    })

    //结存方法
    function balanceFun(lastTime){

        var st = lastTime;
        var et = $('.max').val();

        if(et == nowTime){

            et = moment().format('YYYY/MM/DD HH:mm:ss');

        }

        var prm = {
            "lastDayDate": st,
            "dayDate": et,
            "userID":  _userIdNum,
            "userName": _userIdName,
            "storageNum":$('#ckselect').val()
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
                    $('#balance-modal').modal('hide');
                }else{
                    myAlter('结存失败');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                $('#theLoading').modal('hide');
                console.log(jqXHR.responseText);
            }
        })

    }


    //删除时用到的参数
    var _meg = ''

    $('#scrap-datatables tbody').on('click','.option-del',function(){


        _meg = $(this).parents('tr').children('td').eq(1).children().html();

        _currentWarehouse = $(this).parents('tr').children('td').eq(0).attr('data-storagenum');

        _moTaiKuang($('#deleteModal'), '确定要删除吗？', '', 'istap' ,_meg, '删除');


    })

    $('#deleteModal').on('click','.shanchu',function(){

        $.ajax({

            type:'post',
            url:_urls + 'YWCK/ywCKRptDeleteMonthStock',
            data:{
                "userID":  _userIdNum,
                "userName": _userIdName,
                "dayDate":_meg,
                "storageNum":_currentWarehouse
            },
            timeout:_theTimes,
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'删除成功！', '');

                    conditionSelect();

                    $('#deleteModal').modal('hide');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'删除失败！', '');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    })

    //载入数据
    $('#loadData').click(function(){

        conditionSelect()

    })


    /*-------------------------------------其他方法--------------------------------*/
    function conditionSelect(){

        var arr = [];

        for(var i=0;i<warehouseArr.length;i++){

            arr.push(warehouseArr[i].storageNum);

        }

        var prm = {

            "userID":  _userIdNum,
            "userName": _userIdName

        };

        if($('#ckselect').val() == ''){

            prm.storageNums = arr;

        }else{

            prm.storageNum = $('#ckselect').val()

        }

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptGetHisMonthStock',
            timeout: _theTimes,
            data:prm,
            success:function(result){

                $('#selected').attr('disabled',false);

                var html = '';

                for(var i=0;i<result.length;i++){

                    var showTime = result[i].dayDate.split(' ')[0];

                    if(i==0){

                        html += '<tr><td data-storageNum = ' +  result[i].storageNum +
                            '>' + result[i].storageName +
                            '</td><td><a style="margin-left: 40px;" target="_blank" href="materialMonthlyReport.html?'+showTime+'">'+showTime+'</a><span class="data-option option-del btn default btn-xs green-stripe" style="float: right">删除</span></td></tr>'

                    }else{

                        html += '<tr><td data-storageNum = ' + result[i].storageNum +
                            '>' + result[i].storageName +
                            '</td><td><a target="_blank" href="materialMonthlyReport.html?'+showTime+'">'+showTime+'</a></td></tr>'

                    }



                }

                $('#scrap-datatables tbody').html(html);

                if(result.length == 0){

                    $('.min').val('');

                }else{

                    $('.min').val(result[0].dayDate.split(' ')[0].replace(/-/g,'/'));

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取仓库
    function warehouse(){

        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:prm,
            success:function(result){

                warehouseArr.length = 0;

                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){

                    warehouseArr.push(result[i]);

                    str += '<option value="' + result[i].storageNum + '">' +  result[i].storageName + '</option>';

                    $('#ckselect').empty().append(str);
                }

                //条件查询
                //conditionSelect();

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    }
})