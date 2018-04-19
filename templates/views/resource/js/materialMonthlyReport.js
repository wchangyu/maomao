$(function(){

    var local = window.location.search;

    //默认开始时间
    var startTime = '';

    var endTime = '';

    if(local){

        var aa = local.split('?')[1].replace(/-/g,'/').split('/');

        startTime = aa[0] + '/' + aa[1];

        endTime = aa[0] + '/' + aa[1];

    }else{

        startTime =moment().format('YYYY/MM');

        endTime = moment().add(1,'months').format('YYYY/MM');

    }


    //时间插件
    _monthDate($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY/MM');

    //存放页面查询次数
    var searchNum = 0;

    $('.min').val(startTime);
    $('.max').val(endTime);

    //获取仓库是否执行完毕
    var _isWarehouse = false;

    //存放仓库
    var _ckArr = [];

    //获取仓库
    //_getProfession('YWCK/ywCKGetStorages',$('#storage'),'','storageNum','storageName');

    //获得初始数据
    //conditionSelect();

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
            data:'startNum',
            className:'intNum'
        },
        {
            data:'startAmount',
            render:function(data, type, full, meta){
                return data.toFixed(2)
            }
        },
        {
            data:'inNum',
            className:'intNum'
        },
        {
            data:'inAmount',
            render:function(data, type, full, meta){
                return data.toFixed(2)
            }
        },
        {
            data:'outNum',
            className:'intNum'
        },
        {
            data:'outAmount',
            render:function(data, type, full, meta){
                return data.toFixed(2)
            }
        },
        {
            data:'num',
            className:'intNum'
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
        for(var i=4;i<ths.length - 1;i++){
            var count = 0;
            if(tds.length == 1){
                count = 0;
            }else{
                for(var j=0; j<tds.length; j++){
                    count += parseFloat(tds.eq(j).children('td').eq(i).html());
                }
            }

            var counts  = 0;


            if( ths.eq(i).attr('class') == 'intNum' ){

                counts = parseInt(count);

            }else{

                counts = count.toFixed(2);

            }

            ths.eq(i).html(counts);
        }

    };

    _tableInit($('#scrap-datatables'),col,1,'flag',totalFn,drawFn);

    //表格时间
    $('.table-time').html(startTime + '到' + endTime);

    //表格人
    $('.table-person').html(_userIdName);

    //数据加载
    warehouse();

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
        //_FFExcel($('#scrap-datatables')[0]);

        //exportExecl($('#scrap-datatables'));
    });

    //导出为excel
    function exportExecl(dom){

        dom.table2excel({
            exclude: ".noExl",
            name: "Excel Document Name",
            filename: "myFileName" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
            fileext: ".xls",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true,
            copy_table:true
        });
    };

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

    //获取仓库
    function warehouse(){
        var prm = {
            "userID": _userIdNum,
            "userName": _userIdName,
            "b_UserRole":_userRole
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:prm,
            success:function(result){
                _isWarehouse = true;
                _ckArr.length = 0;
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    _ckArr.push(result[i]);
                    str += '<option value="' + result[i].storageNum + '">' +  result[i].storageName + '</option>';
                }
                $('#storage').empty().append(str);
                if(_isWarehouse){
                    conditionSelect();
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    /*-------------------------------------其他方法--------------------------------*/
    function conditionSelect(){

        var stTime = '';

        var etTime = '';

        //获取时间
        var st = $('.min').val() + '/01';
        var et = moment($('.max').val()).add(1,'months').format('YYYY/MM') + '/01';

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

        var ckArr = [];
        var ckNum = '';
        //获取仓库名
        //if(flag){
        //    var storageNum = '';
        //}else{
        //    var storageNum = $('#storage').val();
        //}
        //console.log(_ckArr);
        if($('#storage').val() == ''){
            for(var i=0;i<_ckArr.length;i++){
                ckArr.push(_ckArr[i].storageNum);
            }
            ckNum = '';
        }else{
            ckNum = $('#storage').val();
            ckArr = [];
        }
        var prm = {
            "storageNums":ckArr,
            "storageNum": ckNum,
            'hasNum':$('#greaterThan').val(),
            "userID":  _userIdNum,
            "userName": _userIdName,
            'localNum':$('#kqSelect').val(),
            "lastDayDate":stTime,
            "dayDate":etTime,
            "itemNum":$('#materialNum').val(),
            "itemName":$('#materialName').val()

        };
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptGetMonthStock',
            timeout: _theTimes,
            data:prm,
            success:function(result){
                _datasTable($("#scrap-datatables"), result);

                //共计

                var father = $('#scrap-datatables').find('tfoot').children('tr').eq(1);

                var td1 = 0;

                var td2 = 0;

                var td3 = 0;

                var td4 = 0;

                var td5 = 0;

                var td6 = 0;

                var td7 = 0;

                var td8 = 0;

                for(var i=0;i<result.length;i++){

                    td1 += Number(result[i].startNum);

                    td2 += Number(result[i].startAmount);

                    td3 += Number(result[i].inNum);

                    td4 += Number(result[i].inAmount);

                    td5 += Number(result[i].outNum);

                    td6 += Number(result[i].outAmount);

                    td7 += Number(result[i].num);

                    td8 += Number(result[i].amount);
                }

                father.find('td').eq(4).html(td1);

                father.find('td').eq(5).html(td2.toFixed(2));

                father.find('td').eq(6).html(td3);

                father.find('td').eq(7).html(td4.toFixed(2));

                father.find('td').eq(8).html(td5);

                father.find('td').eq(9).html(td6.toFixed(2));

                father.find('td').eq(10).html(td7);

                father.find('td').eq(11).html(td8.toFixed(2));

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
})