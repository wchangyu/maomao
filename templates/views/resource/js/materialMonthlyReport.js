$(function(){
    //时间插件
    _monthDate($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY/MM');

    $('.datatimeblock').val(nowTime);

    //获取仓库
    _getWarehouse($('#storage'));

    //表格初始化(buttons=1按钮显示，其他按钮隐藏)
    var col = [
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        },
        {
            data:''
        }
    ];

    //合计计算(加载一行计算一次合计)
    function totalFn(nRow, aData, iDisplayIndex, iDisplayIndexFull){
        var lengths = _totalAttr.length;
        //首先遍历aData的属性名称
        for(var i=2;i<lengths;i++){
            _totalNum[i] += aData[_totalAttr[i]];
        }
    };

    //重绘合计数据
    function drawFn(){
        var ths = $('#failure-reporting').find('tfoot').children('tr').eq(0).children('th');
        for(var i=1;i<ths.length;i++){
            ths.eq(i).html(_totalNum[i+1]);
        }
        for(var i=0;i<_totalNum.length;i++){
            _totalNum[i] = 0;
        }
    };

    _tableInit($('#scrap-datatables'),col,2,'');

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
        var prm = {

        };
        $.ajax({
            type:'post',
            url:_urls + '',
            timeout: _theTimes,
            data:prm,
            success:function(result){

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
})