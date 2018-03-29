/**
 * Created by admin on 2017/12/5.
 */
$(function() {

    //时间插件
    _yearDate($('.datatimeblock'));

    //获取当前年份并赋值
    $('.min').val(moment().format('YYYY'));

    //获取表格中的内容
    getEnergyCollectData();

    //查询按钮
    $('.btn1').on('click',function(){
        //获取表格中的内容
        getEnergyCollectData();
    });

    //导出按钮
    $('.excelButton11').on('click',function(){

        exportExecl($('#entry-datatables'));
    });

});

//高校模式table表头中的数据

//第一个tr中的数据
var theadHtml1 =  ' <th style="text-align:center;background: #ccc;border:1px solid black">占地面积<br />（平米）</th>' +
    '                    <th style="text-align:center;background: #ccc;border:1px solid black" class="land-area" colspan="3"></th>' +

    '                    <th style="text-align:center;background: #ccc;border:1px solid black">年营收<br />（万元）</th>' +
    '                    <th class="year-revenue"  style="text-align:center;background: #ccc;border:1px solid black"></th>' +

    '                    <th style="text-align:center;background: #ccc;border:1px solid black">水单价<br />（元/吨）</th>' +
    '                    <th  class="water-price" style="text-align:center;background: #ccc;border:1px solid black" colspan="2"></th>';

//第二个tr中的数据
var theadHtml2 = '    <th style="text-align:center;background: #ccc;border:1px solid black">建筑面积<br />（平米）</th>' +
    '                    <th class="build-area" style="text-align:center;background: #ccc;border:1px solid black" colspan="3"></th>' +

    '                    <th style="text-align:center;background: #ccc;border:1px solid black">电单价<br />（元/度）</th>' +
    '                    <th class="electricity-price" style="text-align:center;background: #ccc;border:1px solid black"></th>' +

    '                    <th style="text-align:center;background: #ccc;border:1px solid black"></th>' +
    '                    <th style="text-align:center;background: #ccc;border:1px solid black" colspan="2"></th>';

//医院模式数据

//第一个tr中的数据
var theadHtml11 =  '  <th style="text-align:center;background: #ccc;border:1px solid black">占地面积<br />（平米）</th>' +
    '                    <th style="text-align:center;background: #ccc;border:1px solid black" class="land-area"></th>' +

    '                    <th style="text-align:center;background: #ccc;border:1px solid black">总床位<br />（个）</th>' +
    '                    <th  class="bed-num" style="text-align:center;background: #ccc;border:1px solid black"></th>' +

    '                    <th style="text-align:center;background: #ccc;border:1px solid black">年营收<br />（万元）</th>' +
    '                    <th class="year-revenue"  style="text-align:center;background: #ccc;border:1px solid black"></th>' +

    '                    <th style="text-align:center;background: #ccc;border:1px solid black">水单价<br />（元/吨）</th>' +
    '                    <th  class="water-price" style="text-align:center;background: #ccc;border:1px solid black" colspan="2"></th>';

//第二个tr中的数据

var theadHtml22 = ' <th style="text-align:center;background: #ccc;border:1px solid black">建筑面积<br />（平米）</th>' +
    '                    <th class="build-area" style="text-align:center;background: #ccc;border:1px solid black"></th>' +

    '                    <th style="text-align:center;background: #ccc;border:1px solid black">年就诊人次<br />（人次）</th>' +
    '                    <th class="person-num" style="text-align:center;background: #ccc;border:1px solid black"></th>' +

    '                    <th style="text-align:center;background: #ccc;border:1px solid black">电单价<br />（元/度）</th>' +
    '                    <th class="electricity-price" style="text-align:center;background: #ccc;border:1px solid black"></th>' +

    '                    <th style="text-align:center;background: #ccc;border:1px solid black"></th>' +
    '                    <th style="text-align:center;background: #ccc;border:1px solid black" colspan="2"></th>';

//获取当前的楼宇列表
var pointerIdArr = getPointersId();


//获取表格中的内容
function getEnergyCollectData(){

    //获取当前年份
    var year = $('.min').val();
    //开始时间
    var st = year + '-01-01';
    //结束时间
    var et = (parseInt(year) + 1) + '-01-01';

    $.ajax({
        type: 'post',
        data:{
            'startTime':st,
            'endTime':et,
            "pointerIDs": pointerIdArr
        },
        beforeSend: function () {
            $('#theLoading').modal('hide');
            $('#theLoading').modal('show');
        },
        complete: function () {
            $('#theLoading').modal('hide');
        },
        url: sessionStorage.apiUrlPrefix + 'EnergyReportV2/GetEnergyCollectData',
        success: function (result) {

            $('#theLoading').modal('hide');

            //console.log(result);
            //判断是高校模式还是医院模式
            //医院模式
            if(result.beeWebMode == 1){

                $('.hosptial1').html(theadHtml11);
                $('.hosptial2').html(theadHtml22);

                //高校模式
            }else if(result.beeWebMode == 0){

                $('.hosptial1').html(theadHtml1);
                $('.hosptial2').html(theadHtml2);

            }
            //拼接table中字符串
            var tableHtml = '';

            for(var k=1 ; k<13; k++){

                tableHtml += '<tr><td style="text-align:center;border:1px solid black">'+ k + '月</td>';

                //电耗数据
                tableHtml += getTableHtml(result.energyCollectItems,k,'01');
                //水耗数据
                tableHtml += getTableHtml(result.energyCollectItems,k,'211');
                //标煤数据
                tableHtml += getTableHtml(result.energyCollectItems,k,'-2');
                //合计数据
                tableHtml += getTableHtml(result.energyCollectItems,k,'-3');

            }

            $('#entry-datatables tbody').html(tableHtml);

            //全年总计
            var length = $('#entry-datatables tbody tr').eq(0).find('td').length;

            for(var i = 1; i<length; i++){
                var count = 0;
                var isShow = false;
                for(var j=0; j<12; j++){

                    var num = $('#entry-datatables tbody tr').eq(j).find('td').eq(i).html();
                    if(num != ''){
                        count += parseFloat(num);
                        isShow = true;
                    }
                }
                //如果不是空则显示合计
                if(isShow == true){

                    $('#entry-datatables tfoot tr').eq(0).find('td').eq(i).html(count.toFixed(2));
                }

            }

            //数据时间
            $('#entry-datatables thead').find('.data-time').html(year + '年');

            //导出时间
            var nowTime = moment().format('YYYY-MM-DD HH:mm');

            $('#entry-datatables thead').find('.derive-time').html(nowTime);

            //占地面积
            $('#entry-datatables thead').find('.land-area').html(result.landArea);

            //建筑面积
            $('#entry-datatables thead').find('.build-area').html(parseFloat(result.buildArea).toFixed(2));

            //总床位
            $('#entry-datatables thead').find('.bed-num').html(result.bedNum);

            //年收入
            $('#entry-datatables thead').find('.year-revenue').html(result.yearRevenue.toFixed(2));

            //年就诊人次
            $('#entry-datatables thead').find('.person-num').html(result.peopleNum);

            //定义水单价
            var waterPrice = 0;

            //定义电单价
            var electricityPrice = 0;

            //遍历存放能耗单价的数组
            $(result.energyPriceDatas).each(function(i,o){
                //如果是电分项
                if(o.energyItemId == '01'){

                    electricityPrice = o.energyPrice.toFixed(2);
                //如果是水分项
                }else if(o.energyItemId == '211'){

                    waterPrice = o.energyPrice.toFixed(2);
                }
            });

            //水单价
            $('#entry-datatables thead').find('.water-price').html(waterPrice);

            //电单价
            $('#entry-datatables thead').find('.electricity-price').html(electricityPrice);

        },
        error: function (jqXHR, textStatus, errorThrown) {

            $('#theLoading').modal('hide');
        }
    })
}

//
function getTableHtml(arr,month,energyID){
    var html = '';
    $(arr).each(function(i,o){

        //是否满足条件
        if(o.energyMonth == month && o.energyItemId == energyID){
            //电的数据
            if( energyID == '01'){

                html = //电水耗
                    '<td style="text-align:center;border:1px solid black">'+ o.energyData.toFixed(2)+'</td>'+
                        //电水费
                    '<td style="text-align:center;border:1px solid black">'+ o.energyPriceData.toFixed(2)+'</td>';
            //折合标煤
            }else if(energyID == '-2'){

                html = '<td style="text-align:center;border:1px solid black">'+ o.energyData.toFixed(2)+'</td>';
            //合计
            }else if(energyID == '-3'){

                html = '<td style="text-align:center;border:1px solid black">'+ o.energyPriceData.toFixed(2)+'</td></tr>';

             //水耗
            }else if(energyID == '211'){

                html = //电水耗
                    '<td style="text-align:center;border:1px solid black">'+ o.energyData.toFixed(2)+'</td>'+
                        //电水费
                    '<td style="text-align:center;border:1px solid black">'+ o.energyPriceData.toFixed(2)+'</td><td></td><td></td>';
            }

            return false;
        }

        if(i == arr.length -1){

            //电或水的数据
            if(energyID == '01'){

                html = //电水耗
                    '<td style="text-align:center;border:1px solid black"></td>'+
                        //电水费
                    '<td style="text-align:center;border:1px solid black"></td>';
                //折合标煤
            }else if(energyID == '-2'){

                html = '<td style="text-align:center;border:1px solid black"></td>';
                //合计
            }else if(energyID == '-3'){

                html = '<td style="text-align:center;border:1px solid black"></td></tr>';

            }else if(energyID == '211'){

                html = //电水耗
                    '<td style="text-align:center;border:1px solid black"></td>'+
                        //电水费
                    '<td style="text-align:center;border:1px solid black"></td><td style="text-align:center;border:1px solid black"></td><td style="text-align:center;border:1px solid black"></td>';
            }
        }

    });

    return html;
};

//导出为excel
function exportExecl(dom){

    dom.table2excel({
        exclude: ".noExl",
        name: "Excel Document Name",
        filename: "myFileName" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
        fileext: ".xls",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true,
        copy_table:true
    });
};


