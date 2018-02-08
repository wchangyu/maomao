/**
 * Created by admin on 2018/2/7.
 */

$(function() {

    //时间插件
    _monthDate($('.datatimeblock'));

    //获取当前年份并赋值
    $('.min').val(moment().format('YYYY-MM'));

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

    ////获取当前页面高度
    //var screenHeight = document.documentElement.clientHeight;
    //
    //$('.main-content-entry').height(screenHeight - 60);

});

//获取表格中的内容
function getEnergyCollectData(){

    //获取当前月份
    var month = $('.min').val();
    //开始时间
    var st = moment(month).startOf('month').format('YYYY-MM-DD');
    //结束时间
    var et = moment(month).add('1','months').startOf('month').format('YYYY-MM-DD');

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
        url: sessionStorage.apiUrlPrefix + 'EnergyReportV2/GetImpBraElecData',
        success: function (result) {

            console.log(result);


            //拼接table中字符串
            var tableHtml = '';

            $(result).each(function(i,o){

                if(o == null){

                    return true;
                }
                //获取本行字符串
                tableHtml += getTableHtml(o);

            });

            $('#entry-datatables tbody').html(tableHtml);

            //数据时间
            $('#entry-datatables thead').find('.data-times').html(' ' + month.split('-')[0] + '年' +month.split('-')[1] + '月 ');

            //导出时间
            var nowTime = moment().format('YYYY-MM-DD');

            $('#entry-datatables thead').find('.make-time').html(nowTime);


            $('#theLoading').modal('hide');

        },
        error: function (jqXHR, textStatus, errorThrown) {

            $('#theLoading').modal('hide');

        }
    })
}
//获取table中的字符串
function getTableHtml(obj){
    //console.log(obj)
    var html = '<tr>' +
            //区域
        '<td style="text-align:center;border:1px solid black">'+obj.f_ServiceName+'</td>'+
            //起度
        '<td style="text-align:center;border:1px solid black">'+obj.startSeeNum.toFixed(1)+'</td>'+
            //止度
        '<td style="text-align:center;border:1px solid black">'+obj.endSeeNum.toFixed(1)+'</td>'+
            //用电量
        '<td style="text-align:center;border:1px solid black">'+obj.elecData.toFixed(1)+'</td>'+
            //电价
        '<td style="text-align:center;border:1px solid black">'+obj.elecPrice.toFixed(1)+'</td>'+
            //费用
        '<td style="text-align:center;border:1px solid black">'+obj.elecCost.toFixed(1)+'</td>'+
            //备注
        '<td style="text-align:center;border:1px solid black">'+obj.mark+'</td>'+
            '</tr>';

    //console.log(html);
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


