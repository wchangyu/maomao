/**
 * Created by admin on 2017/12/16.
 */
/**
 * Created by admin on 2017/12/5.
 */
$(function() {

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //获取当前年份并赋值
    $('.min').val(moment().format('YYYY-MM-DD'));

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
//定义温度值
var temArr1=[['夏季;7至12℃','冬季;38至45℃'],['夏季;10至15℃','冬季;35至42℃']];

var temArr2 = ['28至35℃','25至32℃','80至150℃','90至170℃','﹣0.08至﹣0.01Mpa'];
//获取表格中的内容
function getEnergyCollectData(){

    //获取当前年份
    var date = $('.min').val();

    $.ajax({
        type: 'get',
        data:{
            'curDT':date,
        },
        beforeSend: function () {
            $('#theLoading').modal('hide');
            $('#theLoading').modal('show');
        },
        complete: function () {
            $('#theLoading').modal('hide');
        },
        url: sessionStorage.apiUrlPrefix + 'MonitReportV2/GetAirConditReports',
        success: function (result) {

            $('#theLoading').modal('hide');

            console.log(result);


            //拼接table中字符串
            var tableHtml = getTableHtml(result);


            $('#entry-datatables tbody').html(tableHtml);

            //数据时间
            var time = $('.min').val();

            var date = moment(time).format('YYYY')+'年'+moment(time).format('MM')+'月'+moment(time).format('DD') + '日';

            $('#entry-datatables thead').find('.data-times').html(date);


        },
        error: function (jqXHR, textStatus, errorThrown) {

            $('#theLoading').modal('hide');
        }
    })
}
//
function getTableHtml(arr){
    var html = '';
    $(arr).each(function(i,o){

        if(i < 2){
            html += '<tr>' +
                 //名称
                '<td rowspan="2" style="text-align:center;border:1px solid black">'+ o.machineName+'</td>'+
                    //单位
                '<td rowspan="2" style="text-align:center;border:1px solid black">'+ o.machineUnit+'</td>';
                //分时间段的数据
                 $(o.airConditItems).each(function(i,o){
                     //数据
                     html +=
                         '<td rowspan="2" style="text-align:center;border:1px solid black">'+ o.data1+'</td>'+
                         '<td rowspan="2" style="text-align:center;border:1px solid black">'+ o.data2+'</td>';


                 });


            html += '  <td  style="text-align:center;border:1px solid black">'+temArr1[i][0]+'</td>';
            //夏季数据

                html += '<td rowspan="" style="text-align:center;border:1px solid black">'+ o.summer1+'</td>'+
                    '<td rowspan="" style="text-align:center;border:1px solid black">'+ o.summer2+'</td>';

            //备注
            if(i == 0){
                html += '<td rowspan="4" style="text-align:center;border:1px solid black">实际温度为设定<br/>温度的±0.5℃</td>';
            }

            //第二行
            html += '</tr><tr>'+

                '<td style="text-align:center;border:1px solid black">'+temArr1[i][1]+'</td>';

            //冬季数据
            html += '<td rowspan="" style="text-align:center;border:1px solid black">'+ o.winter1+'</td>'+
                '<td rowspan="" style="text-align:center;border:1px solid black">'+ o.winter2+'</td>';


        }else {

            html += '<tr>' +
                    //名称
                '<td  style="text-align:center;border:1px solid black">'+ o.machineName+'</td>'+
                    //单位
                '<td  style="text-align:center;border:1px solid black">'+ o.machineUnit+'</td>';
            //分时间段的数据
            $(o.airConditItems).each(function(i,o){
                //数据
                html +=
                    '<td  style="text-align:center;border:1px solid black">'+ o.data1+'</td>'+
                    '<td  style="text-align:center;border:1px solid black">'+ o.data2+'</td>';


            });

            //参考值
            html += '  <td  style="text-align:center;border:1px solid black">'+temArr2[i - 2]+'</td>'+
                //一号
                '<td  style="text-align:center;border:1px solid black">'+ o.tongYong1+'</td>'+
                //二号
                '<td  style="text-align:center;border:1px solid black">'+ o.tongYong2+'</td>';

            if(i == 2){
                html += '<td rowspan="5" style="text-align:center;border:1px solid black"></td>';
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


