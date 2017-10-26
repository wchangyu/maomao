$(function(){
    var _prm = window.location.search;

    if(!_prm){
        return false
    }

    var gdCode2 = _prm.split('=')[1].split('&')[0];

    var orderNum = _prm.split('&')[1].split('=')[1];

    var itemNum = _prm.split('&')[2].split('=')[1];

    var storageNum = _prm.split('&')[3].split('=')[1];

    var sn  = _prm.split('&')[4].split('=')[1];

    var prm = {
        'orderNum':orderNum,
        'userID':_userIdNum,
        'userName':_userIdName,
        'sn':sn,
        'gdCode2':gdCode2,
        'storageNum':storageNum,
        'itemNum':itemNum
    }

    $.ajax({
        type:'post',
        url:_urls + 'YWCK/ywCKGetOutStorageItem',
        data:JSON.stringify(prm),
        contentType:'application/json',
        timeout:_theTimes,
        success:function(result){

            console.log(result);
            //左上
            $('.left-titles').children('.bottom-line').html(result.compName);
            //右上
            $('.one').html(result.itemSerial);
            //领料部门
            $('.two').html(result.wxBz);
            //工单号
            $('.three').html(result.gdCode2bxKeshi);
            //用途
            $('.four').html(result.bxBeizhu);
            //材料编号
            $('.five').html(result.itemNum);
            //材料名称及规格
            $('.six').html(result.itemNameSize);
            //计量单位
            $('.table-one').html(result.unitName);
            //请领
            $('.table-two').html(result.reqNum);
            //实领
            $('.table-three').html(result.sendNum);
            //单价
            $('.table-four').html(result.price.toFixed(2));
            //金额
            $('.table-five').html(result.amount.toFixed(2));
            //时间
            if(result.createTime){
                var showTime = result.createTime.split(' ')[0];
                //按年月日分开显示
                $('.years').html(showTime.split('-')[0]);
                $('.months').html(showTime.split('-')[1]);
                $('.days').html(showTime.split('-')[2]);
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    })
})