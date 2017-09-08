/**
 * Created by admin on 2017/9/7.
 */
$(document).ready(function(){
    //获得用户名
    var _userName = sessionStorage.getItem('userAuth');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    getGodownMessage();
    //获取出库单信息
    function getGodownMessage(){
        //从路径中获取出库单号
        var outboundOrder = window.location.search.split('=')[1];

        if(!outboundOrder){
            outboundOrder = 'IOS17090215583889';
        }

        $.ajax({
            type: 'post',
            url: _urls + "YWCK/ywCKGetOutStorageDetail",
            timeout: theTimes,
            data:{
                "orderNum": outboundOrder,
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
                        '     <td>'+ o.outPrice+'</td>' +
                        '     <td>'+ o.amount+'</td>'+
                        '     <td class="small-size">'+ o.outMemo+'</td>' +
                        ' </tr>';
                    countNum += o.amount;
                });

                $('.goods-message').after(html);
                $('#entry-datatables .small-count').html(countNum);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {


            }
        });

        $.ajax({
            type: 'post',
            url: _urls + "YWCK/ywCKGetOutStorage",
            timeout: theTimes,
            data:{
                "orderNum": outboundOrder,
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