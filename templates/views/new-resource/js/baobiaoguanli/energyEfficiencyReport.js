$(function(){

    /*-------------------------------------------------变量--------------------------------------------------------------*/

    var _url = 'http://huaqin.vicp.io:25708/BEEWebAPIys/api/';

    //默认进来是选择月
    _monthDate($('.datatimeblock'));

    var nowTime = moment().format('YYYY/MM');

    $('.datatimeblock').val(nowTime);

    //时间颗粒度选择不一样初始化不一样
    $('#timeType').change(function(){

        if($(this).val() == '0' ){

            _monthDate($('.datatimeblock'));

            //获取当月
            $('.datatimeblock').val(moment(nowTime).format('YYYY/MM'));

        }else if($(this).val() == '1'){

            _yearDate($('.datatimeblock'));

            //获取当年
            $('.datatimeblock').val(moment(nowTime).format('YYYY'));

        }

    })

    //当前导出报表的时间
    var excelTime = moment().format('YYYY/MM/DD hh:mm:ss');

    //默认数据记载
    conditionSelect();

    /*---------------------------------------------------按钮方法----------------------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //导出
    $('.excelButton11').click(function(){

        if($('.table').eq(0).css('display') != 'none'){

            _exportExecl($('#c-datatables'))

        }else if( $('.table').eq(1).css('display') != 'none' ){

            _exportExecl($('#h-datatables'))

        }

    })

    /*---------------------------------------------------其他方法----------------------------------------------------------*/

    function conditionSelect(){

        //首先修改表头名称

        if($('#timeType').val() == 0){

            $('.range-time').html('月');

        }else if( $('#timeType').val() == 1 ){

            $('.range-time').html('年');

        }


        //获取楼宇和区域名字
        var href = window.location.search;

        //href = '?a1=3101800201&a2=EC';

        var hrefPrm = '';

        var pointerID = '';

        var areaID = '';

        if(href){

            hrefPrm = href.split('?')[1].split('&');

            pointerID = hrefPrm[0].split('=')[1];

            areaID = hrefPrm[1].split('=')[1];

        }

        var prm = {

            //楼宇ID
            pId:pointerID,
            //数据类型(能耗=0、能效=1)
            dataType:1,
            //区域(EC(东冷站)|WC(西冷站)|EH(东热站)|WH(西热站))
            area:areaID,
            //时间类型（月=0;年=1）
            dateType:$('#timeType').val(),
            //时间点
            sp:moment($('.datatimeblock').val()).format('YYYY/MM/DD')

        }

        //具体url
        var url = '';

        if( areaID == 'EC' || areaID == 'WC' ){

            url = 'MultiReport/GetReportCHXs';

            $('#h-datatables').hide();


        }else if( areaID == 'EH' || areaID == 'WH' ){

            url = 'MultiReport/GetReportRNXs';

            $('#c-datatables').hide();

        }

        function successFun(result){

            if(result){

                //判断是冷战还是热战
                if( areaID == 'EC' || areaID == 'WC' ){

                    //报表名称
                    $('#table-title').html(result.report_Name);
                    //数据时间
                    $('.data-time').eq(0).html(result.report_Dt);
                    //导出时间（查询时间）
                    excelTime = moment().format('YYYY/MM/DD hh:mm:ss');

                    $('.derive-time').eq(0).html(excelTime);
                    //冷站年总制冷量
                    $('#total-energy-efficiency-c').html(result.report_cz_nh_Va);
                    //离心机
                    $('#energy-LXJ-c').html(result.report_lx_nh_Va);
                    //溴理机
                    $('#energy-XLJ-c').html(result.report_xl_nh_Va);
                    //地源热泵
                    $('#energy-DYRB-c').html(result.report_rb_nh_Va);
                    //冷冻泵
                    $('#energy-LDB-c').html(result.report_chw_nh_Va);
                    //冷却泵
                    $('#energy-LQB-c').html(result.report_cw_nh_Va);
                    //冷却塔
                    $('#energy-LQT-c').html(result.report_ct_nh_Va);
                    //单位冷量冷价
                    $('#unit-energy-price-c').html(result.report_cz_prc_Va);
                    //离心机
                    $('#efficiency-LXJ-c').html(result.report_lx_nx_Va);
                    //溴理机
                    $('#efficiency-XLJ-c').html(result.report_xl_nx_Va);
                    //地源热泵
                    $('#efficiency-DYRB-c').html(result.report_rb_nx_Va);
                    //冷冻泵
                    $('#efficiency-LDB-c').html(result.report_rb_nx_Va);
                    //冷却泵
                    $('#efficiency-LQB-c').html(result.report_cw_nx_Va);
                    //冷却塔
                    $('#efficiency-LQT-c').html(result.report_cw_nx_Va);
                    //能效日历
                    if(result.report_list){

                        var str = '';

                        for(var i=0;i<result.report_list.length;i++){

                            str += '<tr>'

                            //将表格的数据按照表格排序
                            //['日期','换热罐','采暖泵']；
                            var arr = [];
                            //date日期 lxVa离心机能效 xlVa溴理机能效 rbVa地源热泵能效 chwVa冷冻泵输送系数 cwVa冷却泵输送系数 ctVa冷却塔输送系数

                            //遍历对象的属性，
                            for(var j in result.report_list[i]){

                                if( j == 'date' ){

                                    arr[0] = result.report_list[i][j];

                                }else if( j == 'lxVa' ){

                                    arr[1] = result.report_list[i][j];

                                }else if( j == 'xlVa'  ){

                                    arr[2] = result.report_list[i][j];

                                }else if( j == 'rbVa' ){

                                    arr[3] = result.report_list[i][j];

                                }else if( j == 'chwVa' ){

                                    arr[4] = result.report_list[i][j];

                                }else if( j == 'cwVa' ){

                                    arr[5] = result.report_list[i][j];

                                }else if( j == 'ctVa' ){

                                    arr[6] = result.report_list[i][j];

                                }

                            }

                            for(var j=0;j<arr.length;j++){

                                str += '<td style="text-align:center;background: #ccc;border:1px solid black">' + arr[j] + '</td>';

                            }

                            str += '</tr>'

                        }

                        $('#c-datatables tbody').empty().append(str);

                    }
                    //隐藏热战表格
                    $('#h-datatables').hide();

                }else if( areaID == 'EH' || areaID == 'WH' ){

                    //报表名称
                    $('#table-title1').html(result.report_Name);
                    //数据时间
                    $('.data-time').eq(1).html(result.report_Dt);
                    //导出时间（查询时间）
                    excelTime = moment().format('YYYY/MM/DD hh:mm:ss');

                    $('.derive-time').eq(1).html(excelTime);
                    //换热站总供热量
                    $('#total-energy-efficiency-h').html(result.report_rz_Va);
                    //采暖耗汽量
                    $('#energy-HQL-h').html(result.report_cn_gV);
                    //采暖水泵电耗
                    $('#energy-HDL-h').html(result.report_wp_eV);
                    //单位热量热价
                    $('#unit-energy-price-h').html(result.report_prc_Va);
                    //换热罐能效
                    $('#efficiency-NX-h').html(result.report_rg_Va);
                    //采暖泵输送系数
                    $('#efficiency-SSXS-h').html(result.report_cnb_Va);
                    //生成表格
                    if(result.report_list.length>0){

                        var str = '';

                        for(var i=0;i<result.report_list.length;i++){

                            str += '<tr>';

                            //将表格的数据按照表格排序
                            //['日期','换热罐','采暖泵']；
                            var arr = [];
                            //date日期 rgV 换热罐效率 nbV 采暖泵输送系数
                            for(var j in result.report_list[i]){

                                if(j == 'date'){

                                    arr[0] = result.report_list[i][j];

                                }else if( j == 'rgV' ){

                                    arr[1] = result.report_list[i][j];

                                }else if( j == 'nbV' ){

                                    arr[2] = result.report_list[i][j];

                                }

                            }

                            for(var j=0;j<arr.length;j++){

                                str += '<td style="text-align:center;background: #ccc;border:1px solid black">' + arr[j] + '</td>';

                            }

                            str += '</tr>';

                        }

                        $('#h-datatables tbody').empty().append(str);

                    }
                    //隐藏冷战表格
                    $('#c-datatables').hide();
                }
            }

        }

        $.ajax({

            type:'post',

            url:_url + url,

            timeout:_theTimes,

            data:prm,

            //发送数据之前
            beforeSend:_beforeSendFun,

            //发送数据完成之后
            complete:_completeFun,

            //成功
            success:successFun,

            //失败
            error: _errorFun

        })


    }


})