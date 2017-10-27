$(function(){
    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY/MM/DD');

     var tableArr = [];

    $('.min').val(moment(nowTime).subtract(1,'months').format('YYYY/MM/DD'));
    $('.max').val(nowTime);

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
        var ths = $('#scrap-datatables').find('tfoot').children('tr').eq(0).children('td');
        var tds = $('#scrap-datatables').find('tbody').children('tr').eq(0).children('td');

        for(var i=1;i<ths.length-3;i++){
            var amount = 0;
            var num1 = parseInt(tds.eq(i * 2).html());
            var num2 = parseInt(tds.eq(i * 2 -1).html());

            amount = num1 + num2;
            console.log(amount)
            ths.eq(i).html(amount);
        }
    };

    _tableInit($('#scrap-datatables'),col,2,totalFn,drawFn);


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

    /*-------------------------------------其他方法--------------------------------*/
    function conditionSelect(){
        //获取时间
        var startTime = $('.min').val();
        var endTime = $('.max').val();
        var prm = {
            "lastDayDate": startTime,
            "dayDate": endTime,
            "storageNum": '',
            "userID":  _userIdNum,
            "userName": _userIdName
        };
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
                    if(o.departName == '南昌维保组'){
                        if(o.railType == '普速'){
                            obj.ncps = o.amount;
                        }else{
                            obj.ncgt = o.amount;
                        }
                    }else  if(o.departName == '上饶维保组'){
                        if(o.railType == '普速'){
                            obj.srps = o.amount;
                        }else{
                            obj.srgt = o.amount;
                        }
                    }else  if(o.departName == '赣州维保组'){
                        if(o.railType == '普速'){
                            obj.gzps = o.amount;
                        }else{
                            obj.gzgt = o.amount;
                        }
                    }else  if(o.departName == '福州维保组'){
                        if(o.railType == '普速'){
                            obj.fzps = o.amount;
                        }else{
                            obj.fzgt = o.amount;
                        }
                    }else  if(o.departName == '厦门维保组'){
                        if(o.railType == '普速'){
                            obj.xmps = o.amount;
                        }else{
                            obj.xmgt = o.amount;
                        }
                    }
                });
                obj.hz = count;
                tableArr.length = 0;
                tableArr.push(obj);
                _datasTable($("#scrap-datatables"), tableArr);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
})