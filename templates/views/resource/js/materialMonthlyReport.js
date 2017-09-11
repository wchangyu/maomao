$(function(){
    //时间插件
    _monthDate($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY/MM');

    //存放页面查询次数
    var searchNum = 0;

    $('.datatimeblock').val(nowTime);

    //获取仓库
    _getWarehouse($('#storage'));

    //获得初始数据
    conditionSelect(true);

    //表格初始化(buttons=1按钮显示，其他按钮隐藏)
    var col = [
        {
            data:'itemNum'
        },
        {
            data:'itemName'
        },
        {
            data:'size'
        },
        {
            data:'unitName'
        },
        {
            data:'startNum'
        },
        {
            data:'startAmount'
        },
        {
            data:'inNum'
        },
        {
            data:'inAmount'
        },
        {
            data:'outNum'
        },
        {
            data:'outAmount'
        },
        {
            data:'num'
        },
        {
            data:'amount'
        },
        {
            data:'memo'
        }
    ];

    //合计计算(加载一行计算一次合计)
    function totalFn(nRow, aData, iDisplayIndex, iDisplayIndexFull){

    };

    //重绘合计数据
    function drawFn(){
        var table = $('#scrap-datatables').DataTable();
        var ths = $('#scrap-datatables').find('tfoot').children('tr').eq(0).children('td');
        var tds = $('#scrap-datatables').find('tbody').children('tr');

        for(var i=3;i<ths.length - 1;i++){
            var count = 0;
            for(var j=0; j<tds.length; j++){
                count += parseFloat(tds.eq(j).children('td').eq(i).html());
            }
            ths.eq(i).html(count);
        }

    };



    _tableInit($('#scrap-datatables'),col,2,'',totalFn,drawFn);

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
    function conditionSelect(flag){

        var postTime = '';

        //获取时间
        var st = $('.min').val() + '/01';
        //获取条件
        if(searchNum == 0){
            var getTime =window.location.search.split('?')[1];
            if(getTime != ''){
                postTime = getTime;
            }else{
                postTime = st;
            }
        }else{
            postTime = st;
        }
        //获取仓库名
        if(flag){
            var storageNum = '';
        }else{
            var storageNum = $('#storage').val();
        }

        var prm = {
            "dayDate": postTime,
            "storageNum": storageNum,
            "userID":  _userIdNum,
            "userName": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptGetMonthStock',
            timeout: _theTimes,
            data:prm,
            success:function(result){
                console.log(result);
                _datasTable($("#scrap-datatables"), result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
})