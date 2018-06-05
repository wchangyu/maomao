/**
 * Created by admin on 2018/5/2.
 */
$(function() {

    //获取全部车站
    getAlarmStation();

    //给页面中报表内容选框赋值
    selectContent();

    //获取车站分项电耗报表
    getPointerAlarmReport();

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

        //车站监控报警统计报表
        if(energyStatementID == 1){

            //获取后台数据
            getPointerAlarmReport();

            //展示当前表格
            $('#alarm-datatables').show();

        }

       // $('#timeType').change();
    });

    //改变报表内容选框
    $('#select-content').on('change',function(){

        //获取当前的value
        var thisVal = $(this).val();

        if(thisVal == -1){

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

//定义报警报表的映射表
var energyStatementArr = [

    {
        "name":"监控报警统计报表",
        "value":1
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
    var colspan1 =  arrLength  -1;

    $( tableID + ' '+ '.change-colspan1').attr('colspan',colspan1);


    //重新绘制分项名称数组
    var subentryNameHtml = "";

    $(arr).each(function(i,o){

        subentryNameHtml +=  '<th style="text-align:center;background: #E2E9F2;border:1px solid black">'+o+'</th>';
    });

    //页面赋值
    $(tableID + ' '+ '.change-head-name').html(subentryNameHtml);


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

//获取车站监控报警统计报表
function getPointerAlarmReport(){

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
        "pointerID": pointerID

    };

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'EnergyReportV2/GetPointerAlarmReport',
        data:ecParams,
        beforeSend:function(){

            $('.bottom-main-table').showLoading();

        },
        success:function(result){

            $('.bottom-main-table').hideLoading();

            //console.log(result);

            //报表名称
            var title = $('#select-content').find("option:selected").text();

            $('#alarm-datatables #table-titleH').html(title);

            //数据时间
            $('#alarm-datatables .data-time').html($('.min').val());

            //导出时间
            $('#alarm-datatables .derive-time').html(moment().format('YYYY/MM/DD HH:mm'));

            //动态绘制表头
            dynamicDrawThead(result.alarmReportTitles,'#alarm-datatables');

            //绘制下方主体数据
            var tbodyHtml = drawTbodyData(result.alarmItemDetailDatas);

            //页面赋值
            $('#alarm-datatables tbody').html(tbodyHtml);

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

        $(o.alarmReportDetails).each(function(k,j){

                tbodyHtml += "<td style='text-align:center;background: #ffffff;border:1px solid black'>"+j+"</td>";

        });

        tbodyHtml += "</tr>";

    });

    return tbodyHtml;
};