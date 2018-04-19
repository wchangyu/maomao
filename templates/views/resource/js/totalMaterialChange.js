$(function(){
    //时间插件
    //_timeYMDComponentsFun($('.datatimeblock'));

    //月份插件
    _monthDate($('.monthS'));

    $('.monthS').val(moment().format('YYYY/MM'));

    //默认时间
    var nowTime = moment().format('YYYY/MM/DD');

     var tableArr = [];

    $('.min').val(moment(nowTime).subtract(1,'months').format('YYYY/MM/DD'));
    $('.max').val(nowTime);

    /*-----------------------------------------表格初始化-----------------------------*/

    var col1 = [

        {
            title:'名称',
            data:'rptName',
            render:function(data, type, full, meta){
                return '<a target="_blank" href="totalMaterialChange.html?opt=1&sign=' + full.rptJson + '">' + data + '</a>'
            }
        },
        {
            title:'维保部签字',
            data:'sign1',
            render:function(data, type, full, meta){

                var dataUrl = 'data:image/png;base64,';

                dataUrl = dataUrl + data;

                // 在image中載入圖檔，再畫到canvas呈現
                var img = new Image();

                img.src = dataUrl;

                if(data == ''){

                    return '<div class="table-sign-img"></div>'

                }else{

                    return '<img class="table-sign-img" src="' + dataUrl +'">'

                }

            }
        },
        {
            title:'审核签字',
            data:'sign2',
            render:function(data, type, full, meta){

                var dataUrl = 'data:image/png;base64,';

                dataUrl = dataUrl + data;

                // 在image中載入圖檔，再畫到canvas呈現
                var img = new Image();

                img.src = dataUrl;

                if(data == ''){

                    return '<div class="table-sign-img"></div>'

                }else{

                    return '<img class="table-sign-img" src="' + dataUrl +'">'

                }

            }
        },
        {
            title:'编制',
            data:'sign3',
            render:function(data, type, full, meta){

                var dataUrl = 'data:image/png;base64,';

                dataUrl = dataUrl + data;

                // 在image中載入圖檔，再畫到canvas呈現
                var img = new Image();

                img.src = dataUrl;

                if(data == ''){

                    return '<div class="table-sign-img"></div>'

                }else{

                    return '<img class="table-sign-img" src="' + dataUrl +'">'

                }



            }
        }

    ]

    _tableInit($('#history-list'),col1,'2','','','');


    conditionSelect();

    //表格初始化(buttons=1按钮显示，其他按钮隐藏)
    var col = [
        {
            data:'itemUsage'
        },
        {
            data:'ncgt'
        },
        {
            data:'ncps'
        },
        {
            data:'srgt'
        },
        {
            data:'srps'
        },
        {
            data:'gzgt'
        },
        {
            data:'gzps'
        },
        {
            data:'fzgt'
        },
        {
            data:'fzps'
        },
        {
            data:'xmgt'
        },
        {
            data:'xmps'
        },
        {
            data:'zhwx'
        },
        {
            data:'hz'
        },
        {
            data:'allAmount'
        }
    ];

    //合计计算(加载一行计算一次合计)
    function totalFn(nRow, aData, iDisplayIndex, iDisplayIndexFull){

    };

    //重绘合计数据
    function drawFn(){
        //最后一行的总计的td个数
        var ths = $('#scrap-datatables').find('tfoot').children('tr').eq(0).children('td');
        //每一行的个数
        var tds = $('#scrap-datatables').find('tbody').children('tr').eq(0).children('td');

        //console.log($(ths).css({'background':'red'}));
        //
        //console.log($(tds).css({'background':'green'}));

        for(var i=1;i<ths.length-3;i++){

            var amount = 0;
            //所有普速的值的和
            var num1 = parseFloat(tds.eq(i * 2).html());

            //所有高铁值的和
            var num2 = parseFloat(tds.eq(i * 2 -1).html());

            if(isNaN(num1)){

                num1 = 0
            }

            if(isNaN(num2)){
                num2 = 0
            }

            amount = num1 + num2;


            if(amount != 0){

                ths.eq(i).html(amount.toFixed(2));

            }else{

                amount = 0;

                ths.eq(i).html(amount.toFixed(2));

            }

        }

    };

    _tableInit($('#scrap-datatables'),col,2,false,totalFn,drawFn,true);

    //表格时间
    $('.table-time').html(nowTime);

    //表格人
    $('.table-person').html(_userIdName);

    /*--------------------------------------按钮事件-------------------------------*/
    //查询
    $('#selected').click(function(){
        //改变表头的时间
        $('.table-time').html(nowTime);
        //条件查询
        conditionSelect();
    });

    //重置
    $('.resites').click(function(){
        //时间置为今日
        $('.datatimeblock').val(nowTime);
        //select置为所有
        $('#storage').val('');
    });

    //导出
    $('.excelButton11').on('click',function(){
        _FFExcel($('#scrap-datatables')[0]);
    });

    //标签
    $('.table-title span').click(function(){

        $('.table-title').children('span').removeClass('spanhover');

        $(this).addClass('spanhover');

        $('.content-main-contents1').addClass('hide-block');

        $('.content-main-contents1').eq($(this).index()).removeClass('hide-block');

    })

    /*-------------------------------------其他方法--------------------------------*/
    function conditionSelect(){

        //首先获取href
        var jumpHref = window.location;

        var prm = {};

        var prm1 = {};

        if(jumpHref.search == ''){

            var startTime = moment($('.monthS').val()).startOf('month').format('YYYY/MM/DD');
            var endTime = moment($('.monthS').val()).endOf('month').format('YYYY/MM/DD');

            prm = {
                "lastDayDate": startTime,
                "dayDate": endTime,
                "storageNum": '01',
                "userID":  _userIdNum,
                "userName": _userIdName
            };

            //获取签字内容
            var href1 = window.location;

            //获取
            prm1 = {

                // 报表页面
                rptPage:href1.pathname.split('/')[5],
                //用户id
                userID:_userIdNum,
                //用户名
                userName:_userIdName
            }



        }else{

            //解密

            var decryptCondition = Went.utility.wCoder.wDecode(jumpHref.search.split('=')[2]);

            var jumpObj = JSON.parse(decryptCondition);

            //遍历对象，将属性付给prm
            for(var i in jumpObj){

                prm[i] = jumpObj[i]

            }

            prm.userID = _userIdNum;

            prm.userName = _userIdName;

            //给时间赋值
            $('.monthS').val(moment(jumpObj.lastDayDate).format('YYYY/MM'));

            //获取签字内容
            var href1 = window.location;

            //获取
            prm1 = {

                // 报表页面
                rptPage:href1.pathname.split('/')[5],
                //用户id
                userID:_userIdNum,
                //用户名
                userName:_userIdName
            }


        }

        //设置表头
        $('#scrap-datatables').find('h2').html($('.monthS').val() + '    材料支出汇总表');

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptGetDepartOut',
            timeout: _theTimes,
            data:prm,
            success:function(result){
                //console.log(result);
                var obj = {};
                var count = 0;
                obj.allAmount = result.allAmount;
                obj.itemUsage = result.itemUsage;
                obj.zhwx = null;
                obj.ncps = null;
                obj.ncgt = null;
                obj.srps = null;
                obj.srgt = null;
                obj.gzps = null;
                obj.gzgt = null;
                obj.fzps = null;
                obj.fzgt = null;
                obj.xmps = null;
                obj.xmgt = null;
                $(result.wbzItemUses).each(function(i,o){
                    count += o.amount;
                    if(o.departName == '南昌车间'){
                        if(o.railType == '普速'){
                            obj.ncps = o.amount;
                        }else{
                            obj.ncgt = o.amount;
                        }
                    }else  if(o.departName == '上饶车间'){
                        if(o.railType == '普速'){
                            obj.srps = o.amount;
                        }else{
                            obj.srgt = o.amount;
                        }
                    }else  if(o.departName == '赣州车间'){
                        if(o.railType == '普速'){
                            obj.gzps = o.amount;
                        }else{
                            obj.gzgt = o.amount;
                        }
                    }else  if(o.departName == '福州车间'){
                        if(o.railType == '普速'){
                            obj.fzps = o.amount;
                        }else{
                            obj.fzgt = o.amount;
                        }
                    }else  if(o.departName == '厦门车间'){
                        if(o.railType == '普速'){
                            obj.xmps = o.amount;
                        }else{
                            obj.xmgt = o.amount;
                        }
                    }else if(o.departName == '综合维修中心'){

                        obj.zhwx = o.amount;

                    }
                });

                obj.hz = count.toFixed(2);
                tableArr.length = 0;
                tableArr.push(obj);

                _datasTable($("#scrap-datatables"), tableArr);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

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

            //历史标签赋值
            _jumpNow($('#history-list'),result);

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWCK/ywCKGetSignRpt',

            timeout:_theTimes,

            data:prm1,

            success:successFun,

            error:_errorFun

        })
    }

    /*-------------------------------------签字版----------------------------------*/

    var signIndex = 0;

    $('.footTd span').click(function(){

        if(tableArr.length !=0 && tableArr[0].allAmount !=0){

            //模态框
            _moTaiKuang($('#Signature-Modal'), $(this).html(), '', '' ,'', '确定');

            signIndex = $(this).index('.signSpan');

        }

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

            //判断当前点击的是第几个签名
            var startTime = moment($('.monthS').val()).startOf('month').format('YYYY/MM/DD');
            var endTime = moment($('.monthS').val()).endOf('month').format('YYYY/MM/DD');
            //发送数据
            var href1 = window.location;

            var rptPer = {

                "lastDayDate": startTime,
                "dayDate": endTime,
                "storageNum": '01'

            }

            var sJson = JSON.stringify(rptPer);

            var encodedJSON = Went.utility.wCoder.wEncode(sJson)

            //参数
            var prm = {

                // 报表名
                rptName:$('.table').eq(0).find('h2').text(),
                //报表页面
                rptPage:href1.pathname.split('/')[5],
                //用户id
                userID:_userIdNum,
                //用户名
                userName:_userIdName,
                //rptJson
                rptJson:encodedJSON
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
                    conditionSelect();

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