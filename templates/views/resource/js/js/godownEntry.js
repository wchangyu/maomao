/**
 * Created by admin on 2017/9/7.
 */
$(document).ready(function(){
    //获得用户名
    var _userName = sessionStorage.getItem('userAuth');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    getGodownMessage();
    //获取入库单信息
    function getGodownMessage(){
        //从路径中获取入库单号
        var godownNum = window.location.search.split('=')[1];

        if(!godownNum){
            godownNum = 'IIS17083017553638';
        }

        $.ajax({
            type: 'post',
            url: _urls + "YWCK/ywCKGetInStorageDetail",
            timeout: theTimes,
            data:{
                "orderNum": godownNum,
                "userID": _userIdName,
                "userName": _userName
            },
            success: function (data) {
                console.log(data);
                //要插入的html
                var html = '';
                //总价
                var countNum = 0;
                $(data).each(function(i,o){
                    html +=' <tr>' +
                        '     <td>'+ o.itemNum+'</td>' +
                        '     <td>'+ o.itemName+'</td>' +
                        '     <td>'+ o.size+'</td>' +
                        '     <td>'+ o.unitName+'</td>' +
                        '     <td>'+ o.num+'</td>' +
                        '     <td>'+ o.inPrice+'</td>' +
                        '     <td>'+ o.amount+'</td>'+
                        '     <td class="small-size">'+ o.inMemo+'</td>' +
                        ' </tr>';
                    countNum += o.amount;
                })

                $('.goods-message').after(html);
                $('#entry-datatables .small-count').html(countNum);
                $('#entry-datatables .big-count').html(smalltoBIG(countNum));
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {


            }
        });

        $.ajax({
            type: 'post',
            url: _urls + "YWCK/ywCKGetInStorage",
            timeout: theTimes,
            data:{
                "orderNum": godownNum,
                "userID": _userIdName,
                "userName": _userName
            },
            success: function (data) {
                console.log(data);
                //获取自编号
                $('.self-num b').html(data[0].orderNum);
                //获取制单人
                $('.creat-name b').html(data[0].createUser);
                //获取审核人
                $('.top-message span b').eq(3).html(data[0].auditUserName);
                //获取制单日期
                $('.top-message span b').eq(4).html(data[0].auditTime);
                //获取备注
                $('.top-message span b').eq(5).html(data[0].remark);
                //获取供货单位
                $('#entry-datatables .unit-name').html(data[0].supName);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {


            }
        });
    }
});

/** 数字金额大写转换(可以处理整数,小数,负数) */
function smalltoBIG(n)
{
    var fraction = ['角', '分'];
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];
    var head = n < 0? '欠': '';
    n = Math.abs(n);

    var s = '';

    for (var i = 0; i < fraction.length; i++)
    {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);

    for (var i = 0; i < unit[0].length && n > 0; i++)
    {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++)
        {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}