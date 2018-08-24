$(function(){

    /*-----------------------------------------时间插件---------------------------------*/

    _timeYMDComponentsFun11($('.abbrDT'));

    var nowTime = moment(sessionStorage.sysDt).format('YYYY-MM-DD');

    $('#spDT').val(nowTime);

    conditionSelected();

    $('#selected').click(function(){

        conditionSelected();

    })

    /*-----------------------------------------其他方法---------------------------------*/

    function conditionSelected(){

        //初始化
        tableInit();

        var prm = {

            //楼宇
            pId:sessionStorage.PointerID,
            //时间
            sp:$('#spDT').val()
        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'ZKReportRLgs/GetReportChillSystemRLgs',

            data:prm,

            timeout:_theTimes,

            beforeSend:function(){

                $('.table-area').showLoading();

            },

            complete:function(){

                $('.table-area').hideLoading();

            },

            success:function(result){

                if(result.code == 0){

                    //赋值
                    //报表名称
                    $('.table-titleH').html(result.report_Name);
                    //数据时间
                    $('.data-time').html(result.report_Date);
                    //导出时间
                    $('.derive-time').html(result.report_export_Time);
                    //冷站输入电量
                    $('#report_lzcs_srdl').html(result.report_lzcs_srdl);
                    //冷站输出冷量
                    $('#report_lzcs_scll').html(result.report_lzcs_scll);
                    //系统散热量
                    $('#report_lzcs_xtsrl').html(result.report_lzcs_xtsrl);
                    //系统效率
                    $('#report_lzcs_xtxl').html(result.report_lzcs_xtxl);
                    //主机电量
                    $('#report_fxdh_zjdl').html(result.report_fxdh_zjdl);
                    //冷冻泵电量
                    $('#report_fxdh_ldbdl').html(result.report_fxdh_ldbdl);
                    //冷却泵电量
                    $('#report_fxdh_lqbdl').html(result.report_fxdh_lqbdl);
                    //冷却塔电量
                    $('#report_fxdh_lqtdl').html(result.report_fxdh_lqtdl);
                    //插入时间点的数据

                    var tdStr = '';

                    var data = result.report_hour_ds;

                    if(data){

                        for(var i=0;i<data.length;i++){

                            tdStr += '<tr>';

                            //时间
                            tdStr += '<td>' + data[i].report_date + '</td>';

                            //系统冷量
                            tdStr += '<td>' + data[i].report_xtc + '</td>';

                            //系统电量
                            tdStr += '<td>' + data[i].report_xte + '</td>';

                            //主机电量
                            tdStr += '<td>' + data[i].report_zje + '</td>';

                            //冷冻泵电量
                            tdStr += '<td>' + data[i].report_ldb_e + '</td>';

                            //冷却泵电量
                            tdStr += '<td>' + data[i].report_lqb_e + '</td>';

                            //冷却塔电量
                            tdStr += '<td>' + data[i].report_lqt_e + '</td>';

                            //系统效率
                            tdStr += '<td>' + data[i].report_xt_xl + '</td>';

                            //主机效率
                            tdStr += '<td>' + data[i].report_zj_xl + '</td>';

                            //冷冻泵输送系数
                            tdStr += '<td>' + data[i].report_ldb_xl + '</td>';

                            //冷却泵输送系数
                            tdStr += '<td>' + data[i].report_lqb_xl + '</td>';

                            //冷却塔输送系数
                            tdStr += '<td>' + data[i].report_lqt_xl + '</td>';

                            //冷冻进水温度
                            tdStr += '<td>' + data[i].report_ldjsw + '</td>';

                            //冷冻出水温度
                            tdStr += '<td>' + data[i].report_ldcsw + '</td>';

                            //冷却进水温度
                            tdStr += '<td>' + data[i].report_lqjsw + '</td>';

                            //冷却出水温度
                            tdStr += '<td>' + data[i].report_lqcsw + '</td>';

                            tdStr += '</tr>';

                        }

                    }

                    $('.table tbody').empty().append(tdStr);
                }


            },

            error:_errorFun

        })


    }

    //表格初始化
    function tableInit(){

        $('.table-titleH').html('');
        //数据时间
        $('.data-time').html('');
        //导出时间
        $('.derive-time').html('');
        //冷站输入电量
        $('#report_lzcs_srdl').html('');
        //冷站输出冷量
        $('#report_lzcs_scll').html('');
        //系统散热量
        $('#report_lzcs_xtsrl').html('');
        //系统效率
        $('#report_lzcs_xtxl').html('');
        //主机电量
        $('#report_fxdh_zjdl').html('');
        //冷冻泵电量
        $('#report_fxdh_ldbdl').html('');
        //冷却泵电量
        $('#report_fxdh_lqbdl').html('');
        //冷却塔电量
        $('#report_fxdh_lqtdl').html('');

        $('.table').find('tbody').empty();


    }

})