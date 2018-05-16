/**
 * Created by admin on 2018/4/26.
 */
$(function() {

    //获取全部车站
    getAlarmStation();

    //给页面中报表内容选框赋值
    selectContent();

    //获取车站分项电耗报表
    getEnergyItemReport();

    /*-----------------------------------------------时间插件------------------------------------------------------*/

    var nowTime = moment().format('YYYY/MM/DD');

    if ($('#timeType').val() == 0) {

        _monthDate($('.datatimeblock'));

    } else {

        _yearDate($('.datatimeblock'));

    };

    //导出
    $('.excelButton').click(function(){

        //判断当前要导出哪个表格
        var currentTable = $('.currentOptionTable');

        _exportExecl(currentTable);

    });

    //打印
    $('#print').click(function(){

        $(".currentOptionTable").print({
            //Use Global styles
            globalStyles : false,
            //Add link with attrbute media=print
            mediaPrint : true,
            //Custom stylesheet
            stylesheet : "http://fonts.googleapis.com/css?family=Inconsolata",
            //Print in a hidden iframe
            iframe : false,
            //Don't print this
            noPrintSelector : ".avoid-this",
            //Add this at top
            prepend : "Hello World!!!<br/>",
            //Add this on bottom
            append : "<br/>Buh Bye!",
            //Log to console when printing is done via a deffered callback
            deferred: $.Deferred().done(function() { console.log('Printing done', arguments); })
        });

    });


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

    });

    //点击查询按钮
    $('.demand-button').on('click',function(){

        //获取当前选择内容
        var energyStatementID = $('#select-content').val();

        //隐藏全部表格
        $('.table').hide();

        //车站分项电耗报表
        if(energyStatementID == 1){

            //获取后台数据
            getEnergyItemReport();

            //展示当前表格
            $('#entry-datatables').show();

        }else if(energyStatementID == 2){

            //获取车站总能耗报表
            getEnergyDataReport();

            //展示当前表格
            $('#total-entry-datatables').show();

        }else if(energyStatementID == 3){

            //获取车站能耗指标报表
            getEnergyKPIReport();

            //展示当前表格
            $('#entry-target-datatables').show();

        }

        $('#timeType').change();
    });

    //改变报表内容选框
    $('#select-content').on('change',function(){

        //获取当前的value
        var thisVal = $(this).val();

        if(thisVal == 3){

            var html = '<option value="1" data-attr="Month">年报表</option>';

            $('#timeType').html(html);

            _yearDate($('.datatimeblock'));

            //时间设置
            $('.datatimeblock').val(moment(nowTime).format('YYYY'))

        }else{

            var html = '<option value="0" data-attr="Day">月报表</option>' +
                '<option value="1" data-attr="Month">年报表</option>';

            $('#timeType').html(html);

            _monthDate($('.datatimeblock'));

            //时间设置
            $('.datatimeblock').val(moment(nowTime).format('YYYY/MM'))
        }
    });

});

//定义能耗报表的映射表
var energyStatementArr = [

    {
        "name":"车站分项电耗报表",
        "value":1
    },
    {
        "name":"车站总电耗报表",
        "value":2
    },
    {
        "name":"车站能耗指标报表",
        "value":3
    }
];

//给页面中报表内容选框赋值
function selectContent(){

    var html = "";

    //遍历能耗报表映射表
    $(energyStatementArr).each(function(i,o){

     html += "<option value='"+ o.value+"'>"+ o.name+"</option>"

    });

    //页面赋值
    $('#select-content').html(html);

};

//根据后台返回标题数组动态绘制表头 用于分项能耗报表
function dynamicDrawThead(arr,tableID){

    //获取当前数组长度
    var arrLength = arr.length;

    //计算前四行中空白区域长度
    var colspan1 = 2 * arrLength + 2 -1;

    $( tableID + ' '+ '.change-colspan1').attr('colspan',colspan1);

    //计算第五行中空白区域长度
    var colspan2 = 2 * arrLength + 2 -11;

    $(tableID + ' '+ '.change-colspan2').attr('colspan',colspan2);

    //计算第六行中分项电耗区域长度
    var colspan3 = 2 * arrLength;

    $(tableID + ' '+ '.change-colspan3').attr('colspan',colspan3);

    //重新绘制分项名称数组
    var subentryNameHtml = "";

    $(arr).each(function(i,o){

        subentryNameHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black" colspan="2">'+o+'</th>';
    });

    //页面赋值
    $(tableID + ' '+ '.change-head-subentry').html(subentryNameHtml);

    //重新绘制分项单位数组
    var subentryUnitHtml = '<th style="text-align:center;background: #E2E9F2;border:1px solid black" >度</th>';

    $(arr).each(function(i,o){

        subentryUnitHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black">度</th>';

        subentryUnitHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black">%</th>';

    });

    //页面赋值
    $(tableID + ' '+ '.change-head-unit').html(subentryUnitHtml);
};

//根据后台返回标题数组动态绘制表头 用于总能耗报表
function dynamicDrawThead1(arr,tableID,priceArr){

    //获取当前数组长度
    var arrLength = arr.length;

    //重新绘制能耗单价数组
    var subentryPriceHtml = '';

    $(priceArr).each(function(i,o){

        subentryPriceHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black">'+ o.energyItemName.split('（')[0] + '<br/>（' + o.energyItemName.split('（')[1]+'</th>';

        subentryPriceHtml +=  '<th style="text-align:center;background: #ffffff;border:1px solid black">'+ o.energyPrice+'</th>';

    });

    subentryPriceHtml +=  ' <th style="text-align:center;background: #ffffff;border:1px solid black" colspan="1" class="change-colspan-price"></th>';

    //页面赋值
    $(tableID + ' '+ '.change-head-price').html(subentryPriceHtml);

    //重新绘制分项名称数组
    var subentryNameHtml =   '<th style="text-align:center;background: #E2E9F2;border:1px solid black" rowspan="2">日期</th>';

    $(arr).each(function(i,o){

        if(i == arr.length - 1){

            subentryNameHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black">'+ o.showTitle+'</th>';

        }else{

            subentryNameHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black" class="change-colspan-data">'+ o.showTitle+'</th>';

        }

    });

    //页面赋值
    $(tableID + ' '+ '.change-head-name').html(subentryNameHtml);

    //重新绘制分项单位数组
    var subentryUnitHtml = '';

    $(arr).each(function(i,o){

        if(i == arr.length - 1){

            subentryUnitHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black" class="change-colspan-data">'+ o.showUnit+'</th>';

        }else{

            subentryUnitHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black">'+ o.showUnit+'</th>';

        }

    });

    //页面赋值
    $(tableID + ' '+ '.change-head-unit').html(subentryUnitHtml);

    //如果数组长度过小 则增加下面数据的长度
    if(arrLength < 8){

        //计算第六行中单价空白区域长度
        var colspan3 = 9 - arrLength;

        $(tableID + ' '+ '.change-colspan-price').attr('colspan',colspan3);

        //计算第七 第八行 最后一列的长度
        var colspanData = 9 - arrLength;

        $(tableID + ' '+ '.change-colspan-data').attr('colspan', colspanData);

    }else{

        //计算前四行中空白区域长度
        var colspan1 =  arrLength;

        $( tableID + ' '+ '.change-colspan1').attr('colspan',colspan1);

        //计算第五行中空白区域长度
        var colspan2 = arrLength + 1 -8;

        $(tableID + ' '+ '.change-colspan2').attr('colspan',colspan2);


        //计算第六行中单价空白区域长度
        var colspan3 = 3;

        $(tableID + ' '+ '.change-colspan-price').attr('colspan',colspan3);

    }
};

//根据后台返回标题数组动态绘制表头 用于总能指标报表
function dynamicDrawThead2(arr,tableID,priceArr){

    //获取当前数组长度
    var arrLength = arr.length;

    //获取每个能耗分类下的子分类数
    var childLength = arr[0].energyTitles.length;

    //重新绘制能耗单价数组
    var subentryPriceHtml = '';

    $(priceArr).each(function(i,o){

        subentryPriceHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black">'+ o.energyItemName.split('（')[0] + '<br/>（' + o.energyItemName.split('（')[1]+'</th>';

        subentryPriceHtml +=  '<th style="text-align:center;background: #ffffff;border:1px solid black">'+ o.energyPrice+'</th>';

    });

    subentryPriceHtml +=  ' <th style="text-align:center;background: #ffffff;border:1px solid black" colspan="1" class="change-colspan-price"></th>';

    //页面赋值
    $(tableID + ' '+ '.change-head-price').html(subentryPriceHtml);

    //重新绘制分项名称数组
    var subentryTitleHtml =   '<th style="text-align:center;background: #E2E9F2;border:1px solid black" rowspan="3">日期</th>';

    $(arr).each(function(i,o){

        if(i == arr.length - 1){

            subentryTitleHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black" colspan="'+childLength+'">'+ o.showEnergyName+'</th>';

        }else{

            subentryTitleHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black" class="change-colspan-data" colspan="'+childLength+'">'+ o.showEnergyName+'</th>';

        }

    });

    //页面赋值
    $(tableID + ' '+ '.change-head-title').html(subentryTitleHtml);

    //重新绘制指标名称与单位数组
    var subentryUnitHtml = '';

    var subentryNameHtml = '';

    $(arr).each(function(i,o){

        $(o.energyTitles).each(function(k,j){

            if(i == arr.length - 1 && k == o.energyTitles.length - 1){

                subentryUnitHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black" class="change-colspan-data">'+ j.showUnit+'</th>';

                subentryNameHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black" class="change-colspan-data">'+ j.showTitle+'</th>';

            }else{

                subentryUnitHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black" >'+ j.showUnit+'</th>';

                subentryNameHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black" >'+ j.showTitle+'</th>';

            }

        });

    });

    //页面赋值
    $(tableID + ' '+ '.change-head-unit').html(subentryUnitHtml);

    $(tableID + ' '+ '.change-head-name').html(subentryNameHtml);


    //如果数组长度过小 则增加下面数据的长度
    if(arrLength < 3){

        //计算第六行中单价空白区域长度
        var colspan3 = 9 - arrLength;

        $(tableID + ' '+ '.change-colspan-price').attr('colspan',colspan3);

        //计算第七 第八行 最后一列的长度
        var colspanData = 9 - arrLength;

        $(tableID + ' '+ '.change-colspan-data').attr('colspan', colspanData);

    }else{

        //计算前四行中空白区域长度
        var colspan1 =  arrLength * childLength;

        $( tableID + ' '+ '.change-colspan1').attr('colspan',colspan1);

        //计算第五行中空白区域长度
        var colspan2 = arrLength*childLength + 1 -6;

        $(tableID + ' '+ '.change-colspan2').attr('colspan',colspan2);


        //计算第六行中单价空白区域长度
        var colspan3 =arrLength*childLength + 1 - priceArr.length;

        $(tableID + ' '+ '.change-colspan-price').attr('colspan',colspan3);

    }
};

//获取全部车站
function getAlarmStation(){

    //存放楼宇ID列表
    var levelHtml = "";

    var pointerArr = $.parseJSON(sessionStorage.getItem('pointers'));

    $(pointerArr).each(function(i,o){

        levelHtml += "<option value='"+ o.pointerID+"'>"+ o.pointerName+"</option>"
    });

    $('#alarm-station').html(levelHtml);

};

//获取车站分项电耗报表
function getEnergyItemReport(){

    //获取当前车站
    var pointerID = $('#alarm-station').val();

    //展示日期类型
    var showDateType = $('#timeType').find("option:selected").attr('data-attr');

    //获取开始结束时间
    var startTime;

    var endTime;

    if(showDateType == "Day"){

        startTime = moment($('.min').val()).startOf('month').format('YYYY-MM-DD');

        endTime = moment($('.min').val()).add('1','month').startOf('month').format('YYYY-MM-DD');
    }else{

        startTime = moment($('.min').val()).startOf('year').format('YYYY-MM-DD');

        endTime = moment($('.min').val()).add('1','year').startOf('year').format('YYYY-MM-DD');
    }

    //定义传递给后台的数据
    var ecParams = {
        "startTime": startTime,
        "endTime": endTime,
        "showDateType": showDateType,
        "pointerID": pointerID

    };

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'EnergyReportV2/GetEnergyItemReport',
        data:ecParams,
        beforeSend:function(){

            $('.bottom-main-table').showLoading();

        },
        success:function(result){

            $('.bottom-main-table').hideLoading();

            //报表名称
            var title = $('#select-content').find("option:selected").text();

            $('#entry-datatables #table-titleH').html(title);

            //数据时间
            $('#entry-datatables .data-time').html($('.min').val());

            //导出时间
            $('#entry-datatables .derive-time').html(moment().format('YYYY/MM/DD HH:mm'));

            //位置
            var station = $('#alarm-station').find("option:selected").text();

            $('#entry-datatables .position-name').html(station);

            //建筑面积
            var buildArea = result.buildArea;

            $('#entry-datatables .building-area').html(buildArea);

            //空调面积
            var airArea = result.airArea;

            $('#entry-datatables .air-conditioner-area').html(airArea);

            //到发人次
            var travellerNum = result.travellerNum;

            $('#entry-datatables .people-amount').html(travellerNum);

            if(showDateType == "Day"){

                $('#entry-datatables .time-type').html('月');

            }else{

                $('#entry-datatables .time-type').html('年');
            }

            //电单价
            var elecEnergyPrice = result.elecEnergyPrice;

            $('#entry-datatables .electricity-price').html(elecEnergyPrice);

            //动态绘制表头
            dynamicDrawThead(result.energyTitles,'#entry-datatables');

            //判断是否是铁路模式
            if(result.beeWebMode != 2){

                $('#entry-datatables .station-show').html('');

            }

            //绘制下方主体数据
            var tbodyHtml = drawTbodyData(result.energyItemDTDatas);

            //页面赋值
            $('#entry-datatables tbody').html(tbodyHtml);

        },
        error:function(jqXHR, textStatus, errorThrown){

            $('.bottom-main-table').hideLoading();
            console.log(jqXHR.responseText);
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求失败', '');

            }
        }
    });

};

//获取车站总能耗报表
function getEnergyDataReport(){

    //获取当前车站
    var pointerID = $('#alarm-station').val();

    //展示日期类型
    var showDateType = $('#timeType').find("option:selected").attr('data-attr');

    //获取开始结束时间
    var startTime;

    var endTime;

    if(showDateType == "Day"){

        startTime = moment($('.min').val()).startOf('month').format('YYYY-MM-DD');

        endTime = moment($('.min').val()).add('1','month').startOf('month').format('YYYY-MM-DD');
    }else{

        startTime = moment($('.min').val()).startOf('year').format('YYYY-MM-DD');

        endTime = moment($('.min').val()).add('1','year').startOf('year').format('YYYY-MM-DD');
    }

    //定义传递给后台的数据
    var ecParams = {
        "startTime": startTime,
        "endTime": endTime,
        "showDateType": showDateType,
        "pointerID": pointerID

    };

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'EnergyReportV2/GetEnergyDataReport',
        data:ecParams,
        beforeSend:function(){

            $('.bottom-main-table').showLoading();

        },
        success:function(result){

            $('.bottom-main-table').hideLoading();

            //console.log(result);

            //报表名称
            var title = $('#select-content').find("option:selected").text();

            $('#total-entry-datatables .table-name').html(title);

            //数据时间
            $('#total-entry-datatables .data-time').html($('.min').val());

            //导出时间
            $('#total-entry-datatables .derive-time').html(moment().format('YYYY/MM/DD HH:mm'));

            //位置
            var station = $('#alarm-station').find("option:selected").text();

            $('#total-entry-datatables .position-name').html(station);


            //占地面积
            var landArea = result.landArea;

            $('#total-entry-datatables .land-area').html(landArea);

            //建筑面积
            var buildArea = result.buildArea;

            $('#total-entry-datatables .building-area').html(buildArea);

            //空调面积
            var airArea = result.airArea;

            $('#total-entry-datatables .air-conditioner-area').html(airArea);

            //到发人次
            var travellerNum = result.travellerNum;

            $('#total-entry-datatables .people-amount').html(travellerNum);

            if(showDateType == "Day"){

                $('#total-entry-datatables .time-type').html('月');

            }else{

                $('#total-entry-datatables .time-type').html('年');
            }

            ////电单价
            //var elecEnergyPrice = result.elecEnergyPrice;
            //
            //$('#total-entry-datatables .electricity-price').html(elecEnergyPrice);

            //动态绘制表头
            dynamicDrawThead1(result.energyTitles,'#total-entry-datatables',result.energyPriceDatas);

            if(result.beeWebMode != 2){

                $('#total-entry-datatables .station-show').html('');

            }

            //绘制下方主体数据
            var tbodyHtml;

            //判断数据长度是否小于最小长度
            if(result.energyTitles < 8){

                //计算需要最后一列长度

                var addLength = 9 -result.energyTitles;

                tbodyHtml = drawTbodyData(result.energyItemDTDatas,addLength);

            }else{

                tbodyHtml = drawTbodyData(result.energyItemDTDatas);
            }


            //页面赋值
            $('#total-entry-datatables tbody').html(tbodyHtml);

        },
        error:function(jqXHR, textStatus, errorThrown){

            $('.bottom-main-table').hideLoading();
            console.log(jqXHR.responseText);
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求失败', '');

            }
        }
    });

};

//获取车站能耗指标报表
function getEnergyKPIReport(){

    //获取当前车站
    var pointerID = $('#alarm-station').val();

    //获取开始结束时间
    var startTime;

    var endTime;

    startTime = moment($('.min').val()).startOf('year').format('YYYY-MM-DD');

    endTime = moment($('.min').val()).add('1','year').startOf('year').format('YYYY-MM-DD');


    //定义传递给后台的数据
    var ecParams = {
        "startTime": startTime,
        "endTime": endTime,
        "pointerID": pointerID

    };

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'EnergyReportV2/GetEnergyKPIReport',
        data:ecParams,
        beforeSend:function(){

            $('.bottom-main-table').showLoading();

        },
        success:function(result){

            $('.bottom-main-table').hideLoading();

            //console.log(result);

            //报表名称
            var title = $('#select-content').find("option:selected").text();

            $('#entry-target-datatables .table-name').html(title);

            //数据时间
            $('#entry-target-datatables .data-time').html($('.min').val());

            //导出时间
            $('#entry-target-datatables .derive-time').html(moment().format('YYYY/MM/DD HH:mm'));

            //位置
            var station = $('#alarm-station').find("option:selected").text();

            $('#entry-target-datatables .position-name').html(station);


            //建筑面积
            var buildArea = result.buildArea;

            $('#entry-target-datatables .building-area').html(buildArea);

            //空调面积
            var airArea = result.airArea;

            $('#entry-target-datatables .air-conditioner-area').html(airArea);

            //到发人次
            var travellerNum = result.travellerNum;

            $('#entry-target-datatables .people-amount').html(travellerNum);


            $('#entry-target-datatables .time-type').html('年');


            //动态绘制表头
            dynamicDrawThead2(result.showEnergyTitles,'#entry-target-datatables',result.energyPriceDatas);

            //判断当前是否是铁路模式
            if(result.beeWebMode != 2){

                $('#entry-target-datatables .station-show').html('');

            }

            //绘制下方主体数据
            var tbodyHtml;

            //获取每个能耗分类下的子分类数
            var childLength = result.showEnergyTitles[0].energyTitles.length;

            //判断数据长度是否小于最小长度
            if(result.energyTitles < 3){

                //计算需要最后一列长度

                var addLength = 7 -result.energyTitles*childLength;

                tbodyHtml = drawTbodyData(result.energyItemDTDatas,addLength);

            }else{

                tbodyHtml = drawTbodyData(result.energyItemDTDatas);
            }


            //页面赋值
            $('#entry-target-datatables tbody').html(tbodyHtml);

        },
        error:function(jqXHR, textStatus, errorThrown){

            $('.bottom-main-table').hideLoading();
            console.log(jqXHR.responseText);
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求失败', '');

            }
        }
    });

};

//绘制tbody中主体数据
function drawTbodyData(arr,addLength){

    var tbodyHtml = "";


        $(arr).each(function(i,o){

            tbodyHtml += "<tr>";

            $(o.energyDTDatas).each(function(k,j){

                if( addLength && k == o.energyDTDatas.length-1 ){

                    tbodyHtml += "<td style='text-align:center;background: #ffffff;border:1px solid black' colspan='"+addLength+"'>"+j+"</td>";

                }else{

                    tbodyHtml += "<td style='text-align:center;background: #ffffff;border:1px solid black'>"+j+"</td>";

                }


            });

            tbodyHtml += "</tr>";

        });

    return tbodyHtml;
};