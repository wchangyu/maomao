
/**
 * Created by admin on 2017/12/6.
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
        url: sessionStorage.apiUrlPrefix + 'EnergyReportV2/GetOfficePQCCData',
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
            $('#entry-datatables thead').find('.data-time').html(' (' + month.split('-')[0] + '年' +month.split('-')[1] + '月) ');

            //导出时间
            var nowTime = moment().format('YYYY-MM-DD');

            $('#entry-datatables thead').find('.make-time').html(nowTime);

            //总计
            var length = $('#entry-datatables tbody tr').eq(0).find('td').length;

            for(var i = 4; i<length; i++){
                var count = 0;
                var isShow = false;
                for(var j=0; j<result.length; j++){

                    var num = $('#entry-datatables tbody tr').eq(j).find('td').eq(i).html();
                    if(num != ''){
                        count += parseFloat(num);
                        isShow = true;
                    }
                }
                //如果不是空则显示合计
                if(isShow == true){

                    $('#entry-datatables tfoot tr').eq(0).find('th').eq(i).html(count.toFixed(2));
                }

            }


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
            //序号
        '<td style="text-align:center;border:1px solid black">'+obj.index+'</td>'+
            //房屋楼层
        '<td style="text-align:center;border:1px solid black">'+obj.officeAddress+'</td>'+
            //部门编号
        '<td style="text-align:center;border:1px solid black">'+obj.officeNum+'</td>'+
            //科室名称
        '<td style="text-align:center;border:1px solid black">'+obj.officeName+'</td>';

    $(obj.pqccEnMoneyDatas).each(function(i,o){
        //电的数据 或者水
        if(o.energyItemId == '01' ||o.energyItemId == '211' ){

            html +=
                //实际用电
                '<td style="text-align:center;border:1px solid black">'+ o.energyData.toFixed(1)+'</td>'+
                    //实际费用
                '<td style="text-align:center;border:1px solid black">'+ o.moneyData.toFixed(1)+'</td>';
        }

    });

    html +=
        //实际用气
        '<td style="text-align:center;border:1px solid black">0</td>'+
            //实际费用
        '<td style="text-align:center;border:1px solid black">0</td>'+
            //支出合计
        '<td style="text-align:center;border:1px solid black">'+obj.sumMoneyData.toFixed(1)+'</td></tr>';

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


