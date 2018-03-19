/**
 * Created by admin on 2017/9/7.
 */
$(document).ready(function(){

    //获得用户名
    var _userName = sessionStorage.getItem('userAuth');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    getGodownMessage();
    //getOutStorageBanzu();

    var _wlIsComplete = false;

    var _ckIsComolete = false;

    //获取出库单信息
    function getGodownMessage(){

        //loadding
        $('#theLoading').modal('show');

        //从路径中获取出库单号
        var outboundOrder = window.location.search.split('=')[1];
        if(!outboundOrder){

            $('#theLoading').modal('hide');

            return false;
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

                _wlIsComplete = true;

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
                        '     <td>'+ o.outPrice.toFixed(2)+'</td>' +
                        '     <td>'+ o.amount.toFixed(2)+'</td>'+
                        '     <td class="small-size">'+ o.outMemo+'</td>' +
                        ' </tr>';
                    countNum += o.amount;
                });

                $('.goods-message').after(html);
                $('#entry-datatables .small-count').html(countNum.toFixed(2));

                callBack();

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                _wlIsComplete = true;

                $('#theLoading').modal('hide');

                console.log(jqXHR.responseText);

            }
        });

        $.ajax({
            type: 'post',
            url: _urls + "YWCK/ywCKGetOutStorage",
            timeout: theTimes,
            data:{
                "orderNum": outboundOrder,
                "igStorage":1,
                "userID": _userIdName,
                "userName": _userName
            },
            success: function (data) {

                _ckIsComolete = true;

                var inType = data[0].outType;
                var inTypeName = '';
                //获取入库类型
                var prm = {
                    "catType": 2,
                    "userID": _userIdName,
                    "userName": _userName
                }
                $.ajax({
                    type:'post',
                    url:_urls + 'YWCK/ywCKGetInOutCate',
                    data:prm,
                    timeout:theTimes,
                    success:function(result){

                        _ckIsComolete = true;

                        for(var i=0;i<result.length;i++){
                            if(inType == result[i].catNum){
                                inTypeName = result[i].catName;
                            }
                        }
                        //title
                        $('.top-title').children('span').html(inTypeName);
                    },
                    error:function(jqXHR, textStatus, errorThrown){

                        $('#theLoading').modal('hide');

                        _ckIsComolete = true;

                        console.log(jqXHR.responseText);
                    }
                })
                //获取自编号
                $('.self-num b').html(data[0].orderNum);
                //获取制单人
                $('.creat-name b').html(data[0].createUserName);
                //获取审核人
                $('.top-message span b').eq(3).html(data[0].auditUserName);
                //获取制单日期
                $('.top-message span b').eq(4).html(data[0].auditTime.split(' ')[0]);
                ////获取备注
                //$('.top-message span b').eq(5).html(data[0].remark);

                //获取供货单位
                $('#entry-datatables .unit-name').html(data[0].supName);

                callBack();

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                console.log(jqXHR.responseText);

            }
        });
    }

    //获取所属维保组
    function getOutStorageBanzu(){

        //从路径中获取出库单号
        var outboundOrder = window.location.search.split('=')[1];
        if(!outboundOrder){
            return false;
        }

        $.ajax({
            type: 'post',
            url: _urls + "YWCK/YWCKGetOutStorageBanzu",
            timeout: theTimes,
            data: {
                "orderNum": outboundOrder,
                "igStorage": 1,
                "userID": _userIdName,
                "userName": _userName
            },
            success: function (data) {
                $('.top-message span b').eq(5).html(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {


            }
        })
    }

    //回调函数
    function callBack(){

        if( _wlIsComplete && _ckIsComolete ){

            $('#theLoading').modal('hide');

        }

    }
});