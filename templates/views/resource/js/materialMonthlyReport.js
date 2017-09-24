$(function(){
    //时间插件
    _monthDate($('.datatimeblock'));


    //默认时间
    var nowTime = moment().format('YYYY/MM');

    //默认开始时间
    var startTime =moment().format('YYYY/MM');

    var endTime = moment().add(1,'months').format('YYYY/MM');

    //存放页面查询次数
    var searchNum = 0;

    $('.min').val(startTime);
    $('.max').val(endTime);

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
            data:'startAmount',
            render:function(data, type, full, meta){
                return data.toFixed(2)
            }
        },
        {
            data:'inNum'
        },
        {
            data:'inAmount',
            render:function(data, type, full, meta){
                return data.toFixed(2)
            }
        },
        {
            data:'outNum'
        },
        {
            data:'outAmount',
            render:function(data, type, full, meta){
                return data.toFixed(2)
            }
        },
        {
            data:'num'
        },
        {
            data:'amount',
            render:function(data, type, full, meta){
                return data.toFixed(2)
            }
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
        //合计中的每一个td
        var ths = $('#scrap-datatables').find('tfoot').children('tr').eq(0).children('td');
        //tbody中的每一行
        var tds = $('#scrap-datatables').find('tbody').children('tr');
        for(var i=3;i<ths.length - 1;i++){
            var count = 0;
            if(tds.length == 1){
                count = 0;
            }else{
                for(var j=0; j<tds.length; j++){
                    count += parseFloat(tds.eq(j).children('td').eq(i).html());
                }
            }
            var counts = count.toFixed(2);
            ths.eq(i).html(counts);
        }

    };



    _tableInit($('#scrap-datatables'),col,2,'',totalFn,drawFn);

    //表格时间
    $('.table-time').html(startTime + '到' + endTime);

    //表格人
    $('.table-person').html(_userIdName);

    /*--------------------------------------按钮事件-------------------------------*/
    //查询
    $('#selected').click(function(){
        //改变表头的时间
        //$('.table-time').html(nowTime);
        $('.table-time').html(startTime + '到' + endTime);
        //条件查询
        conditionSelect();
    });

    //重置
    $('.resites').click(function(){
        //时间置为今日
        //$('.datatimeblock').val(nowTime);
        $('.min').html(startTime);
        $('.max').html(endTime);
        //select置为所有
        $('#storage').val('');
    });

    //导出
    $('.excelButton11').on('click',function(){
        _FFExcel($('#scrap-datatables')[0]);
    });

    //仓库选择
    //仓库选择
    $('#storage').on('change',function(){
        //根据仓库，联动库区
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetLocations',
            data:{
                storageNum:$('#storage').val(),
                userID:_userIdNum,
                userName:_userIdName
            },
            success:function(result){
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].localNum + '">' + result[i].localName + '</option>';
                }
                $('#kqSelect').empty().append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })

    /*-------------------------------------其他方法--------------------------------*/
    function conditionSelect(flag){

        var stTime = '';

        var etTime = '';

        //获取时间
        var st = $('.min').val() + '/01';
        var et = $('.max').val() + '/01';
        //获取条件
        if(searchNum == 0){
            var postTime =window.location.search.split('?')[1];

            if(postTime){
                stTime = moment(postTime).startOf('month').format('YYYY-MM-DD');
                etTime = moment(postTime).startOf('month').add(1,'months').format('YYYY-MM-DD');
            }else{
                stTime = st;
                etTime = et;
            }
        }else{
            stTime = st;
            etTime = et;
        }

        //获取仓库名
        if(flag){
            var storageNum = '';
        }else{
            var storageNum = $('#storage').val();
        }

        var prm = {
            "storageNum": storageNum,
            'hasNum':$('#greaterThan').val(),
            "userID":  _userIdNum,
            "userName": _userIdName,
            'localNum':$('#kqSelect').val(),
            "lastDayDate":stTime,
            "dayDate":etTime

        };
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptGetMonthStock',
            timeout: _theTimes,
            data:prm,
            success:function(result){
                _datasTable($("#scrap-datatables"), result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
})