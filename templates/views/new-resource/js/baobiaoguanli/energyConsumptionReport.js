$(function(){

    var _url = 'http://192.168.1.110/BEEWebAPI/api/';

    /*------------------------------------------------------时间插件-------------------------------------------------*/

    //默认进来是选择月
    _monthDate($('.datatimeblock'));

    var nowTime = moment().format('YYYY/MM');

    $('.datatimeblock').val(nowTime);

    //时间颗粒度选择不一样初始化不一样
    $('#timeType').change(function(){

        if($(this).val() == 'month' ){

            _monthDate($('.datatimeblock'));

            //获取当月
            $('.datatimeblock').val(moment(nowTime).format('YYYY/MM'));

        }else if($(this).val() == 'year'){

            _yearDate($('.datatimeblock'));

            //获取当年
            $('.datatimeblock').val(moment(nowTime).format('YYYY'));

        }

    })

    //当前导出报表的时间
    var excelTime = moment().format('YYYY/MM/DD hh:mm:ss');

    //默认数据加载
    conditionSelect();

    /*----------------------------------------------------------按钮事件-------------------------------------------------*/

    //查询
    $('#selected').click(function(){

        //查询数据
        conditionSelect();

    })

    //导出
    $('.excelButton11').click(function(){

        _exportExecl($('#entry-datatables'))

    })

    /*-------------------------------------------------------------其他方法-----------------------------------------------*/

    function conditionSelect(){

        //开始时间
        var st = '';

        //结束时间
        var et = '';

        //数据时间
        var getTime = '';

        if($('#timeType').val() == 'month'){
            //开始时间
            st = moment($('.datatimeblock').val()).startOf('months').format('YYYY/MM/DD');
            //结束时间
            et = moment($('.datatimeblock').val()).endOf('months').add(1,'d').format('YYYY/MM/DD');
            //数据时间
            var time = $('.datatimeblock').val().split('/');

            getTime = time[0] + '年' + time[1] + '月';


        }else if( $('#timeType').val() == 'year' ){
            //开始时间
            st = moment($('.datatimeblock').val()).startOf('years').format('YYYY/MM/DD');
            //结束时间
            et = moment($('.datatimeblock').val()).endOf('years').add(1,'d').format('YYYY/MM/DD');
            //数据时间
            var time = $('.datatimeblock').val().split('/');

            getTime = time[0] + '年';

        }

        //日期类型
        var typetime = $('#timeType').children('option:selected').attr('data-attr');

        //获取楼宇和区域名字
        var href = window.location.search;

        //href = '?a1=3101800201&a2=60';

        var hrefPrm = '';

        var pointerID = '';

        var areaID = '';

        if(href){

            hrefPrm = href.split('?')[1].split('&');

            pointerID = hrefPrm[0].split('=')[1];

            areaID = hrefPrm[1].split('=')[1];

        }

        //参数
        var prm = {

            //楼宇id
            "pointerID": pointerID,
            //区域id
            "areaID": areaID,
            //日期类型
            "showDateType": typetime,
            //开始时间
            "startTime": st,
            //结束时间
            "endTime": et

        }

        function successFun(result){

            //处理数据
            if(result){

                //报表名称
                $('#table-title').html(result.pointerName);
                //数据时间
                $('.data-time').html(getTime);
                //导出时间(查询的时间)；
                excelTime = moment().format('YYYY/MM/DD hh:mm:ss');

                $('.derive-time').html(excelTime);
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
                $('tbody').empty();

                for(var i=0;i<result.energyDTDatas.length;i++){

                    str = '<tr></tr>';

                    $('tbody').append(str);

                    var dataI = result.energyDTDatas;

                    var strTD = '';

                    for(var j=0;j<dataI[i].energyDatas.length;j++){

                        strTD += '<td style="text-align:center;border:1px solid black">' + _formatNumber(dataI[i].energyDatas[j]) + '</td>';

                    }

                    $('tbody').children('tr').eq(i).empty().append(strTD);

                    var strTitle = '<td style="text-align:center;border:1px solid black">' + dataI[i].energyDTStr + '</td>';

                    $('tbody').children('tr').eq(i).prepend(strTitle);

                }



            }

        }

        $.ajax({

            type:'post',

            url:_url + 'EnergyReportV2/GetColdSiteDevReport',

            data:prm,

            timeout:_theTimes,

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