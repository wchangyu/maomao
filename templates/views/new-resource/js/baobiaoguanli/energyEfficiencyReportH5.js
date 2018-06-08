$(function(){

    /*-----------------------------------------------时间插件------------------------------------------------------*/

        var nowTime = moment().format('YYYY-MM-DD');

        if($('#timeType').val() == 0){

            _monthDate11($('.datatimeblock'));

        }else{

            _yearDate($('.datatimeblock'));

        }

        //默认时间
        $('.datatimeblock').val(moment(nowTime).format('YYYY-MM'));

        $('#timeType').change(function(){

            if($(this).val() == 0){

                _monthDate11($('.datatimeblock'));

                //时间设置
                $('.datatimeblock').val(moment(nowTime).format('YYYY-MM'))

            }else if( $(this).val() == 1 ){

                _yearDate($('.datatimeblock'));

                //时间设置
                $('.datatimeblock').val(moment(nowTime).format('YYYY'))

            }

        })

        //查询时间
        var excelTime = '';

    /*------------------------------------------------变量----------------------------------------------------------*/

    areaData();

    pointerData();

    /*------------------------------------------------按钮事件------------------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect($('#pointer').val());

    })

    //导出
    $('.excelButton').click(function(){

        //判断当前要导出哪个表格
        var currentTable = $('.currentOptionTable');

        _exportExecl(currentTable);

    })

    //打印
    $('#print').click(function(){

        _printFun($(".currentOptionTable"));

    })

    /*------------------------------------------------其他方法------------------------------------------------------*/

    //获取能源站
    function areaData(){

        $.ajax({

            type:'get',

            url:_urls + 'MultiAreaHistory/GetChillAREAs',

            success:function(result){

                if(result.length>0){

                    var str  = '';

                    for(var i=0;i<result.length;i++){

                        str += '<option value="' + result[i].tag + '" data-attr="' + result[i].item + '">' + result[i].name + '</option>';

                    }

                    $('#area').empty().append(str);

                    //条件查询
                    conditionSelect(sessionStorage.getItem('PointerID'));

                }

            },

            error:_errorFun

        })

    }

    //获取条件查询数据
    function conditionSelect(pointerId){

        //首先修改表头名称

        if($('#timeType').val() == 0){

            $('.range-time').html('月');

        }else if( $('#timeType').val() == 1 ){

            $('.range-time').html('年');

        }

        //具体url

        var url = '';

        //首先判断是能耗还是能效 能耗0 能效1
        $('.bottom-main-table').hide();

        $('.table').removeClass('currentOptionTable');

        if($('#reporContent').val()==0){

            //显示能耗数据
            $('.bottom-main-table').eq(0).show();

            //开始时间
            var st = '';
            //结束时间
            var et = '';

            //数据时间
            var getTime = '';

            if($('#timeType').val() == 0){
                //开始时间
                st = moment($('.datatimeblock').val()).startOf('months').format('YYYY-MM-DD');
                //结束时间
                et = moment($('.datatimeblock').val()).endOf('months').add(1,'d').format('YYYY-MM-DD');
                //数据时间
                var time = $('.datatimeblock').val().split('/');

                getTime = time[0] + '年' + time[1] + '月';


            }else if( $('#timeType').val() == 1 ){
                //开始时间
                st = moment($('.datatimeblock').val()).startOf('years').format('YYYY-MM-DD');
                //结束时间
                et = moment($('.datatimeblock').val()).endOf('years').add(1,'d').format('YYYY-MM-DD');
                //数据时间
                var time = $('.datatimeblock').val().split('/');

                getTime = time[0] + '年';

            }

            //能耗接口
            var prm = {

                //楼宇id
                "pointerID": pointerId,
                //区域id
                "areaID": $('#area').children('option:selected').attr('data-attr'),
                //日期类型
                "showDateType": $('#timeType').children('option:selected').attr('data-attr'),
                //开始时间
                "startTime": st,
                //结束时间
                "endTime": et

            }

            _mainAjaxFun('post','EnergyReportV2/GetColdSiteDevReport',prm,successFunH);

            $('#entry-datatables').addClass('currentOptionTable');

        }else{

            //显示能效数据
            $('.bottom-main-table').eq(1).show();

            var prm = {
                //楼宇id
                "pId": pointerId,
                //报表类型
                "dataType": $('#reporContent').val(),
                //区域id
                "area": $('#area').val(),
                //时间类型
                "dateType": $('#timeType').val(),
                //时间
                "sp": moment($('.datatimeblock').val()).format('YYYY-MM-DD')
            }

            if( $('#area').val() == 'EC' || $('#area').val() == 'WC' ){

                url = 'MultiReport/GetReportCHXs';

                $('#h-datatablesX').hide();

                $('#c-datatablesX').addClass('currentOptionTable');


            }else if( $('#area').val() == 'EH' || $('#area').val() == 'WH' ){

                url = 'MultiReport/GetReportRNXs';

                $('#c-datatablesX').hide();

                $('#h-datatablesX').addClass('currentOptionTable');

            }

            _mainAjaxFun('post',url,prm,successFunX);

        }

        //能效成功方法
        function successFunX(result){

            if(result){
                //判断是冷战还是热战
                if( $('#area').val() == 'EC' || $('#area').val() == 'WC' ){

                    //报表名称
                    $('#table-title').html(result.report_Name);
                    //数据时间
                    $('.data-time').eq(1).html(result.report_Dt);
                    //导出时间（查询时间）
                    excelTime = moment().format('YYYY-MM-DD hh:mm:ss');

                    $('.derive-time').eq(1).html(excelTime);
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

                                str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + arr[j] + '</td>';

                            }

                            str += '</tr>'

                        }

                        $('#c-datatablesX tbody').empty().append(str);

                    }
                    //隐藏热战表格
                    $('.table').show();

                    $('#h-datatablesX').hide();

                }else if( $('#area').val() == 'EH' || $('#area').val() == 'WH' ){

                    //报表名称
                    $('#table-title1').html(result.report_Name);
                    //数据时间
                    $('.data-time').eq(2).html(result.report_Dt);
                    //导出时间（查询时间）
                    excelTime = moment().format('YYYY-MM-DD hh:mm:ss');

                    $('.derive-time').eq(2).html(excelTime);
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

                                str += '<td style="text-align:center;background: #ffffff;border:1px solid black">' + arr[j] + '</td>';

                            }

                            str += '</tr>';

                        }

                        $('#h-datatablesX tbody').empty().append(str);

                    }
                    //隐藏冷战表格
                    $('.table').show();

                    $('#c-datatablesX').hide();
                }
            }

        }

        //能耗成功方法
        function successFunH(result){

            //处理数据
            if(result){

                //报表名称
                $('#table-titleH').html(result.pointerName);
                //数据时间
                $('.data-time').eq(0).html(getTime);
                //导出时间(查询的时间)；
                excelTime = moment().format('YYYY-MM-DD hh:mm:ss');

                $('.derive-time').eq(0).html(excelTime);
                //占地面积
                $('.land-area').html(_formatNumber(result.landArea));
                //电单价
                $('.electric-price').html(_formatNumber(result.elecEnergyPrice));
                //蒸汽单价
                $('.build-area').html(_formatNumber(result.steamEnergyPrice));
                //水单价
                $('.water-price').html(_formatNumber(result.waterEnergyPrice));
                //表格
                var str = '';
                //表格初始化
                $('#entry-datatables tbody').empty();

                for(var i=0;i<result.energyDTDatas.length;i++){

                    str = '<tr></tr>';

                    $('#entry-datatables tbody').append(str);

                    var dataI = result.energyDTDatas;

                    var strTD = '';

                    for(var j=0;j<dataI[i].energyDatas.length;j++){

                        strTD += '<td style="text-align:center;border:1px solid black">' + _formatNumber(dataI[i].energyDatas[j]) + '</td>';

                    }

                    $('#entry-datatables tbody').children('tr').eq(i).empty().append(strTD);

                    var strTitle = '<td style="text-align:center;border:1px solid black">' + dataI[i].energyDTStr + '</td>';

                    $('#entry-datatables tbody').children('tr').eq(i).prepend(strTitle);

                }



            }

        }
    }

    //获取车站
    function pointerData(){

        var pointer = JSON.parse(sessionStorage.getItem('pointers'));

        var str = '';

        for(var i=0;i<pointer.length;i++){

            str += '<option value="' + pointer[i].pointerID + '">' + pointer[i].pointerName + '</option>';

        }

        $('#pointer').empty().append(str);


    }


})