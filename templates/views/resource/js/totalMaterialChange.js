$(function(){
    //时间插件
    _monthDate($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY/MM');

    $('.datatimeblock').val(nowTime);

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
})