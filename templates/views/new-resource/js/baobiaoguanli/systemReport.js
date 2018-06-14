$(function(){

    //获取楼宇
    pointerData();

    //时间插件
    _timeYMDComponentsFun11($('.datatimeblock'));

    $('.datatimeblock').val(moment().format('YYYY-MM-DD'));

    //当前时间
    var nowTime = '';

    /*--------------------------------------------按钮事件--------------------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //打印
    $('#print').click(function(){

        _printFun($('.table-area'))

    })

    //导出
    $('.excelButton').click(function(){

        _exportExecl($('.table-area'));

    })


    /*--------------------------------------------其他方法--------------------------------------------------------*/
    //获取楼宇
    function pointerData(){

        var pointer = JSON.parse(sessionStorage.getItem('pointers'));

        var str = '';

        for(var i=0;i<pointer.length;i++){

            str += '<option value="' + pointer[i].pointerID + '">' + pointer[i].pointerName + '</option>';

        }

        $('#pointer').empty().append(str);

        $('#pointer').val(sessionStorage.PointerID);


    }

    //条件查询
    function conditionSelect(){

        //初始化
        initTable();

        $('#theLoading').modal('show');

        nowTime = moment().format('YYYY-MM-DD');

        var prm = {

            //楼宇id
            pId:$('#pointer').val(),
            //区域
            area:$('#area').val(),
            //时间
            sp:$('.datatimeblock').val()

        }

        $.ajax({

            type:'post',

            url:_urls + 'MultiReportRLgs/GetReportLZRLgs',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //赋值
                    //报表名称
                    $('.table-titleH').html(result.report_Name);
                    //数据时间
                    $('.data-time').html(result.report_Data_Date);
                    //导出时间
                    $('.derive-time').html(nowTime);
                    //冷站—_输入电量
                    $('#report_lz_e').html(result.report_lz_e);
                    //冷站_输入蒸汽
                    $('#report_lz_q').html(result.report_lz_q);
                    //冷站_输出冷量
                    $('#report_lz_c').html(result.report_lz_c);
                    // 离心机组_系统电量
                    $('#report_lxjz_xte').html(result.report_lxjz_xte);
                    //离心机组_系统冷量
                    $('#report_lxjz_xtc').html(result.report_lxjz_xtc);
                    //离心机组_系统效率
                    $('#report_lxjz_xl').html(result.report_lxjz_xl);
                    //离心机组_系统散热量
                    $('#report_lxjz_srl').html(result.report_lxjz_srl);
                    //离心机组_热不平衡率
                    $('#report_lxjz_rbphl').html(result.report_lxjz_rbphl);
                    //离心机组_主机电量
                    $('#report_lxjz_zje').html(result.report_lxjz_zje);
                    //离心机组_一次冷冻泵电量
                    $('#report_lxjz_ycldb_e').html(result.report_lxjz_ycldb_e);
                    //离心机组_冷却泵电量
                    $('#report_lxjz_lqb_e').html(result.report_lxjz_lqb_e);
                    //离心机组_二次泵电量
                    $('#report_lxjz_ercb_e').html(result.report_lxjz_ercb_e);
                    //离心机组_冷却塔电量
                    $('#report_lxjz_lqt_e').html(result.report_lxjz_lqt_e);
                    //溴锂机组_系统电量
                    $('#report_xljz_xte').html(result.report_xljz_xte);
                    //溴锂机组_系统蒸汽
                    $('#report_xljz_xtq').html(result.report_xljz_xtq);
                    //溴锂机组_系统冷量
                    $('#report_xljz_xtc').html(result.report_xljz_xtc);
                    //溴锂机组_系统效率
                    $('#report_xljz_xl').html(result.report_xljz_xl);
                    //溴锂机组_系统散热量
                    $('#report_xljz_srl').html(result.report_xljz_srl);
                    //溴锂机组_主机电量
                    $('#report_xljz_zje').html(result.report_xljz_zje);
                    //溴锂机组_一次冷冻泵电量
                    $('#report_xljz_ycldb_e').html(result.report_xljz_ycldb_e);
                    //溴锂机组_冷却泵电量
                    $('#report_xljz_lqb_e').html(result.report_xljz_lqb_e);
                    //溴锂机组_二次泵电量
                    $('#report_xljz_ercb_e').html(result.report_xljz_ercb_e);
                    //溴锂机组_冷却塔电量
                    $('#report_xljz_lqt_e').html(result.report_xljz_lqt_e);
                    //地源热泵机组_系统电量
                    $('#report_dyrb_xte').html(result.report_dyrb_xte);
                    //地源热泵机组_系统冷量
                    $('#report_dyrb_xtc').html(result.report_dyrb_xtc);
                    //地源热泵机组_系统效率
                    $('#report_dyrb_xl').html(result.report_dyrb_xl);
                    //地源热泵机组_主机电量
                    $('#report_dyrb_zje').html(result.report_dyrb_zje);
                    //地源热泵机组_冷冻泵电量
                    $('#report_dyrb_ldb_e').html(result.report_dyrb_ldb_e);
                    //地源热泵机组_冷却泵电量
                    $('#report_dyrb_lqb_e').html(result.report_dyrb_lqb_e);
                    //地源热泵机组_冷却塔电量
                    $('#report_dyrb_lqt_e').html(result.report_dyrb_lqt_e);

                    //冷站运行日志_离心机系统_数据
                    if(result.report_lx_hour_ds != null){

                        var LXStr = '';

                        //插入表格
                        for(var i=0;i<result.report_lx_hour_ds.length;i++){

                            var tdValues = result.report_lx_hour_ds[i];

                            LXStr += '<tr>';

                            //时间
                            LXStr += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_date + '</td>' +

                                    //系统冷量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_xtc + '</td>' +
                                    //系统电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_xte + '</td>' +
                                    //主机电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_zje + '</td>' +
                                    //一次冷冻泵电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ycldb_e + '</td>' +
                                    //冷却泵电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqb_e + '</td>' +
                                    //二次泵电量（总）
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ercb_e + '</td>' +
                                    //冷却塔电量（总）
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqt_e + '</td>' +
                                    //系统效率
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_xtxl + '</td>' +
                                    //主机效率
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_zjxl + '</td>' +
                                    //一次冷冻泵输送系数
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ycldb_xl + '</td>' +
                                    //冷却泵输送系数
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqb_xl + '</td>' +
                                    //二次泵输送系数（总）
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ercb_xl + '</td>' +
                                    //冷却塔输送系数（总）
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqt_xl + '</td>' +
                                    //冷冻进水温度
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ldjsw + '</td>' +
                                    //冷冻出水温度
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ldcsw + '</td>' +
                                    //冷却进水温度
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqjsw + '</td>' +
                                    //冷却出水温度
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqcsw + '</td>';

                            LXStr += '</tr>'

                        }

                        //插入表格中
                        $('.table').eq(1).find('tbody').empty().append(LXStr);

                    }

                    //冷站运行日志_溴锂机系统_数据
                    if(result.report_xl_hour_ds != null){

                        var XLStr = '';

                        //插入表格
                        for(var i=0;i<result.report_xl_hour_ds.length;i++){

                            var tdValues = result.report_xl_hour_ds[i];

                            XLStr += '<tr>';

                            //时间
                            XLStr += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_date + '</td>' +

                                    //系统冷量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_xtc + '</td>' +
                                    //输入蒸汽量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_q + '</td>' +
                                    //系统电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_xte + '</td>' +
                                    //一次冷冻泵电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ycldb_e + '</td>' +
                                    //冷却泵电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqb_e + '</td>' +
                                    //二次泵电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ercb_e + '</td>' +
                                    //冷却塔电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqt_e + '</td>' +
                                    //系统效率
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_xt_xl + '</td>' +
                                    //主机效率
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_zj_xl + '</td>' +
                                    //一次冷冻泵输送系数
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ycldb_xl + '</td>' +
                                    //冷却泵输送系数
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqb_xl + '</td>' +
                                    //二次泵输送系数
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ercb_xl + '</td>' +
                                    //冷却塔输送系数
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqt_xl + '</td>' +
                                    //冷冻进水温度
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ldjsw + '</td>' +
                                    //冷冻出水温度
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ldcsw + '</td>' +
                                    //冷却进水温度
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqjsw + '</td>' +
                                    //冷却出水温度
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqcsw + '</td>'

                            XLStr += '</tr>'

                        }

                        //插入表格中
                        $('.table').eq(2).find('tbody').empty().append(XLStr);
                    }

                    //冷站运行日志_地源热泵系统_数据
                    if(result.report_dyrb_hour_ds != null){

                        var DYRBStr = '';

                        //插入表格
                        for(var i=0;i<result.report_dyrb_hour_ds.length;i++){

                            var tdValues = result.report_dyrb_hour_ds[i];

                            DYRBStr +='<tr>';

                            //时间
                            DYRBStr += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_date + '</td>' +
                                    //系统冷量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_xtc + '</td>' +
                                    //主机电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_zje + '</td>' +
                                    //冷冻泵电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ldb_e + '</td>' +
                                    //冷却泵电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqb_e + '</td>' +
                                    //冷却塔电量
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqt_e + '</td>' +
                                    //-
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + '-' + '</td>' +
                                    //-
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + '-' + '</td>' +
                                    //系统效率
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_xt_xl + '</td>' +
                                    //主机效率
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_zj_xl + '</td>' +
                                    //冷冻泵输送系数
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ldb_xl + '</td>' +
                                    //冷却泵输送系数
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqb_xl + '</td>' +
                                    //冷却塔输送系数
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_lqt_xl + '</td>' +
                                    //-
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + '-' + '</td>' +
                                    //冷冻进水温度
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ldjsw + '</td>' +
                                    //冷冻出水温度
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + tdValues.report_ldcsw + '</td>' +
                                    //-
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + '-' + '</td>' +
                                    //-
                                '<td style="text-align:center;background: #ffffff;border:1px solid black">' + '-' + '</td>'

                            DYRBStr +='</tr>';

                        }

                        //插入表格中
                        $('.table').eq(3).find('tbody').empty().append(DYRBStr);

                    }

                }else{

                    var meg = '';

                    if(result.msg == '' || result.meg == null){

                        meg = '请求错误！'

                    }else{

                        meg = result.msg;

                    }

                    //提示错误
                    _moTaiKuang($('#tip-Modal'),'提示', true, 'istap' ,meg, '');

                }

            },

            error:_errorFun

        })

    }

    //初始化表格
    function initTable(){

        //表格数据清除
        $('.table-content').html('');

        //离心机初始化
        $('.table').eq(1).find('tbody').empty();

        //溴理机
        $('.table').eq(2).find('tbody').empty();

        //地源热泵
        $('.table').eq(3).find('tbody').empty();
    }

})