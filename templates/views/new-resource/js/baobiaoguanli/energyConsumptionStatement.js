/**
 * Created by admin on 2018/4/26.
 */
$(function() {

    //获取全部车站
    getAlarmStation();

    //获取车站分项电耗报表
    getEnergyItemReport();

    //给页面中报表内容选框赋值
    selectContent();

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

    })

    //点击查询按钮
    $('.demand-button').on('click',function(){

        //获取当前选择内容
        var energyStatementID = $('#select-content').val();

        //车站分项电耗报表
        if(energyStatementID == 1){

            //获取后台数据
            getEnergyItemReport();

        }
    });

});

var arr1 = [

    {
        name:"电耗",
        unit:"度"
    },
    {
        name:"电费",
        unit:"元"
    },
    {
        name:"水耗",
        unit:"吨"
    },
    {
        name:"水费",
        unit:"元"
    },
    {
        name:"折合标煤",
        unit:"吨"
    },
    {
        name:"支出合计",
        unit:"元"
    }

];

//定义能耗报表的映射表
var energyStatementArr = [

    {
        "name":"车站分项电耗报表",
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
function dynamicDrawThead1(arr,tableID){

    //获取当前数组长度
    var arrLength = arr.length;

    //如果数组长度过小 则增加下面数据的长度
    if(arrLength < 8){



    }else{


        //计算前四行中空白区域长度
        var colspan1 = 2 * arrLength;

        $( tableID + ' '+ '.change-colspan1').attr('colspan',colspan1);

        //计算第五行中空白区域长度
        var colspan2 = 2 * arrLength + 1 -8;

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

            $('#entry-datatables').showLoading();

        },
        success:function(result){

            $('#entry-datatables').hideLoading();

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

            //绘制下方主体数据
            var tbodyHtml = drawTbodyData(result.energyItemDTDatas);

            //页面赋值
            $('#entry-datatables tbody').html(tbodyHtml);

        },
        error:function(jqXHR, textStatus, errorThrown){

            $('#entry-datatables').hideLoading();
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
function drawTbodyData(arr){

    var tbodyHtml = "";

    $(arr).each(function(i,o){

        tbodyHtml += "<tr>";

        $(o.energyDTDatas).each(function(k,j){

            tbodyHtml += "<td style='text-align:center;background: #ffffff;border:1px solid black'>"+j+"</td>";
        });

        tbodyHtml += "</tr>";

    });

    return tbodyHtml;
}