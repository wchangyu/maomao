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


    //获得用户名
    var _userName = sessionStorage.getItem('realUserName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    getGodownMessage();
    //获取入库单信息
    function getGodownMessage(){
        //从路径中获取入库单号
        var godownNum = window.location.search.split('=')[1];

        if(!godownNum){
            return false;
        }

        $.ajax({
            type: 'post',
            url: _urls + "YWCK/ywCKGetInStorageDetailFold",
            timeout: theTimes,
            data:{
                "orderNum": godownNum,
                "userID": _userIdNum,
                "userName": _userName
            },
            success: function (data) {
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
                        '     <td>'+ o.inPrice.toFixed(2)+'</td>' +
                        '     <td>'+ o.amount.toFixed(2)+'</td>'+
                        '     <td class="small-size">'+ o.inMemo+'</td>' +
                        ' </tr>';
                    countNum += o.amount;
                })

                $('.goods-message').after(html);
                $('#entry-datatables .small-count').html(countNum.toFixed(2));
                $('#entry-datatables .big-count').html(smalltoBIG(countNum));
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        });

        $.ajax({
            type: 'post',
            url: _urls + "YWCK/ywCKGetInStorage",
            timeout: theTimes,
            data:{
                "orderNum": godownNum,
                "igStorage":1,
                "userID": _userIdName,
                "userName": _userName
            },
            success: function (data) {
                //console.log(data);
                var inType = data[0].inType;
                var inTypeName = '';
                //获取入库类型
                var prm = {
                    "catType": 1,
                    "userID": _userIdName,
                    "userName": _userName
                };

                $.ajax({
                    type:'post',
                    url:_urls + 'YWCK/ywCKGetInOutCate',
                    data:prm,
                    timeout:theTimes,
                    success:function(result){
                        for(var i=0;i<result.length;i++){
                            if(inType == result[i].catNum){
                                inTypeName = result[i].catName;
                            }
                        }
                        //title
                        $('.top-title').children('span').html(inTypeName);
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })
                //单据号
                $('.document-num b').html(data[0].orderNum2);
                //获取自编号
                $('.self-num b').html(data[0].orderNum);
                //获取制单人
                $('.creat-name b').html(data[0].createUserName);
                //获取审核人
                $('.top-message span b').eq(3).html(data[0].auditUserName);
                //获取制单日期
                $('.top-message span b').eq(4).html(data[0].auditTime.split(' ')[0]);
                //获取备注
                $('.top-message span b').eq(5).html(data[0].remark);
                //获取供货单位
                $('#entry-datatables .unit-name').html(data[0].supName);
                //获取联系人
                $('#entry-datatables .linkman-name').html(data[0].contactName);
            },
            error:function(jqXHR, textStatus, errorThrown){
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

    /*-----------------------------------------------按钮事件--------------------------------------*/

    //记录当前点击的是哪个签名
    var signIndex = 0;

    $('.bottom-sign td').on('click','span',function(){

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