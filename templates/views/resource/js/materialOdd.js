$(function(){
    var _prm = window.location.search;

    if(!_prm){
        return false
    }

    var jumpFlag = _prm.split('?')[1].split('=')[0];

    //票料号码
    var plCode = '';

    if(jumpFlag == 'a1'){

        var gdCode2 = _prm.split('=')[1].split('&')[0];

        var orderNum = _prm.split('&')[1].split('=')[1];

        var itemNum = _prm.split('&')[2].split('=')[1];

        var storageNum = _prm.split('&')[3].split('=')[1];

        var sn  = _prm.split('&')[4].split('=')[1];

        var station = _prm.split('&')[5].split('=')[1];

        conditionSelect();

    }else if(jumpFlag == 'b1'){

        //传参条件
        var condition = _prm.split('?')[1].split('&');

        //票料号码
        plCode = condition[0].split('=')[1];

        //工单号
        var gdCode2 = condition[1].split('=')[1];

        //物品编码
        var wpCode = condition[2].split('=')[1];

        plCondition();

    }

    //获得签名
    function getSign(){

        //获得签名
        var prm1 = {
            //料单内部编号
            plCode:plCode,
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName
        }

        //读取签字
        var successFun = function(result){

            console.log(result);

            if(result.length>0){

                if(result[0].sign1){

                    drawImgLocal(result[0].sign1,$('.img-block').eq(0).children('img'));

                    drawImgLocal(result[0].sign1,$('.img-block').eq(3).children('img'));

                }
                if(result[0].sign2){

                    drawImgLocal(result[0].sign2,$('.img-block').eq(1).children('img'));

                    drawImgLocal(result[0].sign2,$('.img-block').eq(4).children('img'));

                }
                if(result[0].sign3){

                    drawImgLocal(result[0].sign3,$('.img-block').eq(2).children('img'));

                    drawImgLocal(result[0].sign3,$('.img-block').eq(5).children('img'));

                }
            }


        }

        $.ajax({

            type:'post',

            url:_urls + 'YWCK/ywCKGetPickList',

            timeout:_theTimes,

            data:prm1,

            success:successFun,

            error:_errorFun

        })

    }

    //获得签名2
    function getSignII(){

        var prm = {

            //物品编码
            itemNum:itemNum,
            //车站
            bxKeshiNum:station,
            //工单号
            gdCode2:gdCode2,
            //出库单号
            orderNum:orderNum,
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName

        }


        function getSignIIsuccessFun(result)    {

            console.log(result);

            if(result.length !=0){

                //首先给plCode赋值
                plCode = result[0].plCode;

                //给签名赋值
                if(result[0].sign1){

                    drawImgLocal(result[0].sign1,$('.img-block').eq(0).children('img'));

                    drawImgLocal(result[0].sign1,$('.img-block').eq(3).children('img'));

                }
                if(result[0].sign2){

                    drawImgLocal(result[0].sign2,$('.img-block').eq(1).children('img'));

                    drawImgLocal(result[0].sign2,$('.img-block').eq(4).children('img'));

                }
                if(result[0].sign3){

                    drawImgLocal(result[0].sign3,$('.img-block').eq(2).children('img'));

                    drawImgLocal(result[0].sign3,$('.img-block').eq(5).children('img'));

                }

            }

        }


        $.ajax({

            type:'post',

            url:_urls + 'YWCK/ywCKGetPickListII',

            data:prm,

            timeout:_theTimes,

            success:getSignIIsuccessFun,

            error:_errorFun

        })


    }

    /*-----------------------------------------公共方法-----------------------------------*/
    //有出库单编号的情况下
    function conditionSelect(){

        //获取表格基本数据
        var prm = {
            'orderNum':orderNum,
            'userID':_userIdNum,
            'userName':_userIdName,
            'sn':sn,
            'gdCode2':gdCode2,
            'storageNum':storageNum,
            'itemNum':itemNum
        }

        console.log(prm);

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
                $('.three').html('维修费用');
                //用途
                $('.four').html(result.gdCode2bxKeshi +'、' + result.bxBeizhu);
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
                $('.table-four').html(result.price);
                //金额
                $('.table-five').html(result.amount);
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

        //获得签名
        getSignII();

    }

    //没有出库单编号的情况下
    function plCondition(){

        var prm = {

            //票料单号
            plCode:plCode,
            //工单号
            gdCode2:gdCode2,
            //物品编码
            ItemNum:wpCode,
            //用户id
            userID:_userIdNum,
            //用户用户
            userName:_userIdName

        }

        console.log(prm);

        function successFun(result){

            //console.log(result);

            //左上
            $('.left-titles').children('.bottom-line').html(result.compName);
            //右上
            $('.one').html(result.itemSerial);
            //领料部门
            $('.two').html(result.wxBz);
            //工单号
            $('.three').html('维修费用');
            //用途
            $('.four').html(result.gdCode2bxKeshi +'、' + result.bxBeizhu);
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
            $('.table-four').html(result.price);
            //金额
            $('.table-five').html(result.amount);
            //时间
            if(result.createTime){
                var showTime = result.createTime.split(' ')[0];
                //按年月日分开显示
                $('.years').html(showTime.split('-')[0]);
                $('.months').html(showTime.split('-')[1]);
                $('.days').html(showTime.split('-')[2]);
            }

        }

        _mainAjaxFun('post','YWCK/ywCKGetOutStorageItemII',prm,successFun)

        //获取签名

        getSign();

    }

    /*------------------------------------------签字版------------------------------------*/

    var signIndex = 0;

    //按钮
    $('.bottom-person-message span').click(function(){

        //模态框
        _moTaiKuang($('#Signature-Modal'), $(this).html(), '', '' ,'', '确定');

        signIndex = $(this).index() / 2;

    })

    //模态框显示完的回调函数
    $('#Signature-Modal').on('shown.bs.modal',function(){

        //选择生成gif格式的图片
        $('#encodeType').val(4);

        //初始化
        initDevice();

    })

    //确定事件
    //获取到当前生成的gif字段 存入后台
    $('#Signature-Modal').on('click','.btn-primary',function(){

        setTimeout(function(){

            //参数
            var prm = {

                //料单内部编号
                plCode:plCode,
                //用户id
                userID:_userIdNum,
                //用户名
                userName:_userIdName

            }

            //签名str
            var signText = $("#encode").val();

            //时间
            var signDate = moment().format('YYYY-MM-DD HH:mm:ss');

            if(signIndex == 0){

                prm.sign1 = signText;

                prm.sign1Date1 = signDate;

                prm.sign2 = '';

                prm.sign1Date2 = '';

                prm.sign3 = '';

                prm.sign1Date3 = '';

            }else if(signIndex == 1){

                prm.sign2 = signText;

                prm.sign1Date2 = signDate;

                prm.sign1 = '';

                prm.sign1Date1 = '';

                prm.sign3 = '';

                prm.sign1Date3 = '';

            }else if(signIndex == 2){


                prm.sign3 = signText;

                prm.sign1Date3 = signDate;

                prm.sign1 = '';

                prm.sign1Date1 = '';

                prm.sign2 = '';

                prm.sign1Date2 = '';


            }

            //成功回调函数
            var successFun = function(result){

                if(result == 99){
                    //提示框
                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'签名保存成功！', '');
                    //签名框消失
                    $('#Signature-Modal').modal('hide');
                    //刷新数据

                    if(jumpFlag == 'a1'){

                        conditionSelect();

                    }else if(jumpFlag == 'b1'){

                        plCondition();

                    }

                    getSign();

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'签名保存失败！', '');

                }

            }

            _mainAjaxFun('post','YWCK/ywCKSignPickList',prm,successFun);

        },100)

    });

    function drawImgLocal(base64,el){

        var dataUrl = 'data:image/png;base64,';

        dataUrl = dataUrl + base64;

        // 在image中載入圖檔，再畫到canvas呈現
        var img = new Image();

        img.src = dataUrl;

        el.attr('src',dataUrl);
    }

})