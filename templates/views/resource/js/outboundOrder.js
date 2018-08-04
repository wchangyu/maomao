/**
 * Created by admin on 2017/9/7.
 */
$(document).ready(function(){
    /*------------------------------------------签字版---------------------------------------*/

    //签字版
    (function(b,o,i,l,e,r){
        b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)
            });
        b[l].l=+new Date;
        e=o.createElement(i);r=o.getElementsByTagName(i)[0];
        e.src='https://www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
    ga('create','UA-XXXXX-X');ga('send','pageview');

    /*--------------------------------------变量-----------------------------------------*/

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
            url: _urls + "YWCK/YWCKGetOutStorageBanzu",
            timeout: theTimes,
            data:{
                "orderNum": outboundOrder,
                "userID": _userIdNum,
                "userName": _userName
            },
            success: function (data) {

                _wlIsComplete = true;

                //要插入的html
                var html = '';
                //总价
                var countNum = 0;

                $(data).each(function(i,o){

                    var brand = o.brand==null?'':o.brand;

                    html +=' <tr>' +
                        '     <td>'+ o.itemNum+'</td>' +
                        '     <td>'+ o.itemName+'</td>' +
                        '     <td>'+ brand+'</td>' +
                        '     <td>'+ o.size+'</td>' +
                        '     <td>'+ o.unitName+'</td>' +
                        '     <td>'+ o.num+'</td>' +
                        '     <td>'+ o.outPrice.toFixed(2)+'</td>' +
                        '     <td>'+ o.amount.toFixed(2)+'</td>'+
                        '     <td>'+ o.wbz +'</td>'+
                        '     <td>'+ o.bxKeshi+'</td>'+
                        '     <td><a href="materialOdd.html?gdCode=' + o.gdCode2 +
                        '&orderNum=' + outboundOrder +
                        '&itemNum=' + o.itemNum +
                        '&storageNum=' + o.storageNum +
                        '&sn=' + o.sn +
                        '" target="_blank">' + o.gdCode2 +
                        '</a>'+'</td>'+
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

        var href1 = window.location;

        var prm = {
            //id
            relativeID:href1.search.split('=')[1],
            // 报表页面
            rptPage:href1.pathname.split('/')[5],
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName
        }

        //读取签字
        var successFun = function(result){

            if(result.length>0){

                if(result[0].sign1){

                    drawImgLocal(result[0].sign1,$('.img-block').eq(0).children('img'));

                }
                if(result[0].sign2){

                    drawImgLocal(result[0].sign2,$('.img-block').eq(1).children('img'));

                }
                if(result[0].sign3){

                    drawImgLocal(result[0].sign3,$('.img-block').eq(2).children('img'));

                }
                if(result[0].sign4){

                    drawImgLocal(result[0].sign4,$('.img-block').eq(3).children('img'));

                }
                if(result[0].sign5){

                    drawImgLocal(result[0].sign5,$('.img-block').eq(4).children('img'));

                }
            }


        }

        $.ajax({

            type:'post',

            url:_urls + 'YWCK/ywCKGetSignRpt',

            timeout:_theTimes,

            data:prm,

            success:successFun,

            error:_errorFun

        })

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

    /*-----------------------------------------------按钮事件--------------------------------------*/

    //记录当前点击的是哪个签名
    var signIndex = 0;

    $('.bottom-sign span').click(function(){

        //模态框显示
        _moTaiKuang($('#Signature-Modal'), $(this).html(), '', '' ,'', '确定');

        signIndex = $(this).index() / 2;

    })

    //获取到当前生成的gif字段 存入后台
    $('#Signature-Modal').on('click','.btn-primary',function(){

        setTimeout(function(){

            //判断当前点击的是第几个签名

            //发送数据
            var href1 = window.location;

            //参数
            var prm = {

                //相关id
                relativeID:href1.search.split('=')[1],
                // 报表名
                rptName:$('.top-title').text(),
                //报表页面
                rptPage:href1.pathname.split('/')[5],
                //签名
                sign1:$("#encode").val(),
                //签名时间
                sign1Date:moment().format('YYYY-MM-DD HH:mm:ss'),
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

                prm.sign4 = '';

                prm.sign1Date4 = '';

                prm.sign5 = '';

                prm.sign1Date5 = '';

            }else if(signIndex == 1){

                prm.sign2 = signText;

                prm.sign1Date2 = signDate;

                prm.sign1 = '';

                prm.sign1Date1 = '';

                prm.sign3 = '';

                prm.sign1Date3 = '';

                prm.sign4 = '';

                prm.sign1Date4 = '';

                prm.sign5 = '';

                prm.sign1Date5 = '';

            }else if(signIndex == 2){


                prm.sign3 = signText;

                prm.sign1Date3 = signDate;

                prm.sign1 = '';

                prm.sign1Date1 = '';

                prm.sign2 = '';

                prm.sign1Date2 = '';

                prm.sign4 = '';

                prm.sign1Date4 = '';

                prm.sign5 = '';

                prm.sign1Date5 = '';


            }else if(signIndex == 3){

                prm.sign4 = signText;

                prm.sign1Date4 = signDate;

                prm.sign1 = '';

                prm.sign1Date1 = '';

                prm.sign2 = '';

                prm.sign1Date2 = '';

                prm.sign3 = '';

                prm.sign1Date3 = '';

                prm.sign5 = '';

                prm.sign1Date5 = '';

            }else if(signIndex == 4){

                prm.sign5 = signText;

                prm.sign1Date5 = signDate;

                prm.sign1 = '';

                prm.sign1Date1 = '';

                prm.sign2 = '';

                prm.sign1Date2 = '';

                prm.sign3 = '';

                prm.sign1Date3 = '';

                prm.sign4 = '';

                prm.sign1Date4 = '';

            }

            //成功回调函数
            var successFun = function(result){

                if(result == 99){
                    //提示框
                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'签名保存成功！', '');
                    //签名框消失
                    $('#Signature-Modal').modal('hide');
                    //刷新数据
                    getGodownMessage();

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'签名保存失败！', '');

                }

            }

            _mainAjaxFun('post','YWCK/ywCKSignReport',prm,successFun)

        },100)

    });

    $('#Signature-Modal').on('shown.bs.modal',function(){

        //选择生成gif格式的图片
        $('#encodeType').val(4);

        //初始化
        initDevice();

    })

    function drawImgLocal(base64,el){

        var dataUrl = 'data:image/png;base64,';

        dataUrl = dataUrl + base64;

        // 在image中載入圖檔，再畫到canvas呈現
        var img = new Image();

        img.src = dataUrl;

        el.attr('src',dataUrl);
    }


});
