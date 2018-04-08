
//用于接收编码
var _signCode = '';

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

    conditionSelect();

    /*-----------------------------------------公共方法-----------------------------------*/

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

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorageItem',
            data:JSON.stringify(prm),
            contentType:'application/json',
            timeout:_theTimes,
            success:function(result){

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

        //获取签字内容
        var href1 = window.location;

        return false;

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

            //发送数据
            var href1 = window.location;

            //参数
            var prm = {

                //相关id _prm.split('&')[1].split('=')[1];
                relativeID:href1.search.split('&')[1].split('=')[1],
                // 报表名
                rptName:'yongliaoda',
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

            console.log(prm);

            return false;

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

    function drawImgLocal(base64,el){

        var dataUrl = 'data:image/png;base64,';

        dataUrl = dataUrl + base64;

        // 在image中載入圖檔，再畫到canvas呈現
        var img = new Image();

        img.src = dataUrl;

        el.attr('src',dataUrl);
    }

})