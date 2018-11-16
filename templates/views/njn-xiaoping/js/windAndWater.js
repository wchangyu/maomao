/**
 * Created by admin on 2018/11/14.
 */
$(function(){

    changeStringToArr($('#scrap-datatables'),fengshuiArr1);

    //切换风水联动策略
    $('#onOff-people').on('click',function(){

        if($(this).attr('data-type') == 0){

            $(this).addClass('onOff1');

            $(this).attr('data-type','1');

        }else{

            $(this).removeClass('onOff1');

            $(this).attr('data-type','0');

        }
    });

});


//风水联动策略数据
var fengshuiArr1 = [
    '＜20%,关停,——',
    '20%≤    ＜40%,1台离心机,+2℃',
    '40%≤    ＜60%,1台离心机,+1℃',
    '60%≤    ＜80%,2台离心机,+1℃',
    '80%≤    ＜100%,2台离心机,+0℃'
];


//把字符数据转为数组 并赋值给页面
function changeStringToArr(dom,dataArr){

    var newDataArr = [];

    $(dataArr).each(function(i,o){

        var dataArr = o.split(',');

        newDataArr.push(dataArr);

    });

    //定义赋值给页面的字符串
    var tableHtml = '';

    $(newDataArr).each(function(i,o){

        tableHtml += '<tr>';

        $(o).each(function(i,o){

            tableHtml +='<td>'+o+'</td>'

        });


        tableHtml += '</tr>';

    });

    dom.find('tbody').html(tableHtml);

}