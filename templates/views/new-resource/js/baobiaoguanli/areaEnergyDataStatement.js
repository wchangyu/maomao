/**
 * Created by admin on 2017/12/6.
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

    //获取当前页面高度
    var screenHeight = document.documentElement.clientHeight;

    $('.main-content-entry').height(screenHeight - 60);

});

//获取表格中的内容
function getEnergyCollectData(){

    //获取当前年份
    var year = $('.min').val();
    //开始时间
    var st = year + '-01-01';
    //结束时间
    var et = (parseInt(year) + 1) + '-01-01';

    $.ajax({
        type: 'get',
        data:{
            'startTime':st,
            'endTime':et
        },
        beforeSend: function () {
            $('#theLoading').modal('hide');
            $('#theLoading').modal('show');
        },
        complete: function () {
            $('#theLoading').modal('hide');
        },
        url: sessionStorage.apiUrlPrefix + 'EnergyReportV2/GetAreaEnergyData',
        success: function (result) {

            //console.log(result);

            $('#theLoading').modal('hide');

            //拼接table中字符串
            var tableHtml = '';

            $(result.areaEnergyItems).each(function(i,o){

                if(o == null){

                    return true;
                }
                //获取本行字符串
                tableHtml += getTableHtml(o);

            });


            $('#entry-datatables tbody').html(tableHtml);


            //数据时间
            $('#entry-datatables thead').find('.data-time').html(year + '年');

            //导出时间
            var nowTime = moment().format('YYYY-MM-DD HH:mm');

            $('#entry-datatables thead').find('.derive-time').html(nowTime);



        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })
}
//
function getTableHtml(obj){
    //console.log(obj)
    var html = '<tr>' +
                //序号
                '<td style="text-align:center;border:1px solid black">'+obj.areaNum+'</td>'+
                //区域位置
                '<td style="text-align:center;border:1px solid black">'+obj.areaName+'</td>'+
                    //面积
                '<td style="text-align:center;border:1px solid black">'+obj.buildArea.toFixed(2)+'</td>'+
                    //床位
                '<td style="text-align:center;border:1px solid black">'+obj.bedNum+'</td>';

    $(obj.showEnergyItemDatas).each(function(i,o){
        //电的数据 或者水
        if(o.energyItemId == '01' ||o.energyItemId == '211' ){

            html += //实际用电
                '<td style="text-align:center;border:1px solid black">'+ o.energyData.toFixed(2)+'</td>'+
                    //单位面积电耗
                '<td style="text-align:center;border:1px solid black">'+o.areaEnergyData.toFixed(2)+'</td>'+
                    //单位床位电耗
                '<td style="text-align:center;border:1px solid black">'+o.bedEnergyData.toFixed(2)+'</td>'+
                    //电费
                '<td style="text-align:center;border:1px solid black">'+o.energyMoney.toFixed(2)+'</td>';
            //逐12月用电
            $(o.energyMoneyDatas).each(function(i,o){

                html += //本月用电
                    '<td style="text-align:center;border:1px solid black">'+ o.moneyData.toFixed(2)+'</td>';
            });
        }

    });

    html +=
            //折合标煤
        '<td style="text-align:center;border:1px solid black">'+obj.biaoMeiData.toFixed(2)+'</td>'+
            //支出合计
        '<td style="text-align:center;border:1px solid black">'+obj.expendMoney.toFixed(2)+'</td></tr>';

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


