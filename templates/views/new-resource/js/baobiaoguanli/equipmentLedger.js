$(function(){

    //车站
    _pointerData();

    //设备系统
    devSys();

    //设备位置
    devLocaltion();

    //条件查询
    conditionSelect();

    /*------------------------------------------按钮功能-----------------------------------*/

    //查询
    $('#selected').click(function(){

        //清空表格
        $('#entry-datatables').find('tbody').empty();

        conditionSelect();

    })

    //导出
    $('.excelButton').click(function(){

        _exportExecl($('.table'));

    })

    //打印
    $('#print').click(function(){

        _printFun($(".table"));

    })

    /*------------------------------------------其他方法-----------------------------------*/

    //设备系统
    function devSys(){

        $.ajax({

            type:'post',

            url:_urls + 'NJNDeviceShow/ywDevGetDevType',

            timeout:_theTimes,

            success:function(result){

                if(result){

                    var str = '<option value="">全部</option>'

                    for(var i=0;i<result.length;i++){

                        str += '<option value="' + result[i].typeID + '">' + result[i].typeName + '</option>'

                    }

                    $('#select-devsystem').empty().append(str);

                }

            },

            error:_errorFun1

        })

    }

    //设备位置
    function devLocaltion(){

        $.ajax({

            type:'post',

            url:_urls + 'NJNDeviceShow/ywDevGetDevArea',

            timeout:_theTimes,

            success:function(result){

                if(result){

                    var str = '<option value="0">全部</option>'

                    for(var i=0;i<result.length;i++){

                        str += '<option value="' + result[i].areaID + '">' + result[i].areaName + '</option>'

                    }

                    $('#select-location').empty().append(str);

                }


            },

            error:_errorFun1

        })

    }

    //车站
    function _pointerData(){

        var pointer = JSON.parse(sessionStorage.getItem('pointers'));

        var str = '<option value="0">全部</option>';

        for(var i=0;i<pointer.length;i++){

            str += '<option value="' + pointer[i].pointerID + '">' + pointer[i].pointerName + '</option>';

        }

        $('#pointer').empty().append(str);


    }

    //条件查询
    function conditionSelect(){

        //车站
        var pointer = 0;

        if($('#pointer').val() == null || $('#pointer').val() == '' ){

            pointer = 0;

        }else{

            pointer = $('#pointer').val();

        }

        //设备系统
        var devSys = 0;

        if($('#select-devsystem').val() == null || $('#select-devsystem').val() == '' ){

            devSys = 0;

        }else{

            devSys = $('#select-devsystem').val();

        }

        //设备位置
        var devLoc = 0;

        if($('#select-location').val() == null || $('#select-location').val() == '' ){

            devLoc = 0;

        }else{

            devLoc = $('#select-location').val();

        }


        var prm = {

            //车站
            poinerID:pointer,
            //设备系统
            typeID:devSys,
            //设备位置
            areaID:devLoc,
            //设备关键字
            devName:$('#dev-key').val(),
            //用户id
            UserID:_userIdNum
        }

        $.ajax({

            type:'post',

            url:_urls + 'NJNDeviceShow/ywDevGetInfos',

            data:JSON.stringify(prm),

            contentType:'application/json',

            //发送数据之前
            beforeSend:_beforeSendFun,

            //发送数据完成之后
            complete:_completeFun,

            //成功
            success:function(result){

                if(result){

                    for(var i=0;i<result.length;i++){

                        var str = '<tr>';

                        //设备id
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].devID + '</td>';

                        //设备名称
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].devName + '</td>';

                        //设备型号
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].spec + '</td>';

                        //生产购买日期
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].purDate + '</td>';

                        //运行日期
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].installDate + '</td>';

                        //使用年限（年）
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].life + '</td>';

                        //累计运行时间（h）
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].allOnTime + '</td>';

                        //累计保养次数
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].maintainCnt + '</td>';

                        //累计维修次数
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].gdCnt + '</td>';

                        //所属专业
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].typeName + '</td>';

                        //设备类别
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].dcName + '</td>';

                        //所属车站
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].pointerName + '</td>';

                        //设备位置
                        str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + result[i].areaName + '</td>';

                        str += '</tr>';

                        $('#entry-datatables').find('tbody').append(str);

                    }

                }

            },

            //失败
            error: _errorFun

        })

    }


})