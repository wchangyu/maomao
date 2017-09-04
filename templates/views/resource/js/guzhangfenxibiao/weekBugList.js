$(function(){
    //全局变量
    /*
    * 用户名 _userIdName 本地地址 _url*/
    //日历插件初始化
    //日期
    _dataComponentsFun($('.datatimeblock'));

    //时间
    _timeComponentsFun($('.timeblock'));

    //开始时间
    var _date = moment().format('YYYY/MM/DD');

    var _dataWeekStart = moment(_date).startOf('week').add(1,'d').format('YYYY-MM-DD');

    var _dataWeekEnd = moment(_date).endOf('week').add(1,'d').format('YYYY-MM-DD');

    //设置初始日期
    $('.datatimeblock').eq(0).val(_dataWeekStart);

    $('.datatimeblock').eq(1).val(_dataWeekEnd);

    //设置初始时间
    $('.timeblock').eq(0).val('00:00:00');

    $('.timeblock').eq(1).val('00:00:00');

    var _dataEndFact = moment($('.datatimeblock').eq(1).val(_dataWeekEnd)).endOf('week').add(2,'d').format('YYYY/MM/DD');

    //存放合计的数组
    var _totalNum = [];

    //存放数据属性名的数组
    var _totalAttr = [];

    //报障总数
    var _totalNums = 0;

    //修改时间
    $('.startTime').html($('.datatimeblock').eq(0).val());

    $('.endTime').html($('.datatimeblock').eq(1).val());

    /*--------------------------------------按钮事件---------------------------------*/
    $('#selected').click(function(){
        //修改时间
        $('.startTime').html($('.datatimeblock').eq(0).val());

        $('.endTime').html($('.datatimeblock').eq(1).val());

        //本周客服设备故障上报及处理情况
        conditionSelect('YWGD/ywGDRptGDs',$('#failure-reporting'),'flag');

        //本周发现或反馈的客服设备惯性、典型（重点）故障情况
        conditionSelect('YWGD/ywGDRptTypic',$('#failure-info'));

        //未修复
        conditionSelect('YWGD/ywGDRptWaiting',$('#failure-to-repair'));
    })
    /*------------------------------------表格初始化------------------------------------------*/
    var failureReportingCol = [
        {
            title:'站（段）名',
            data:'departName',
            render: function (data, type, row, meta){
                return '<span num="' + row.departNum +
                    '">' + data + '</span>'
            }
        },
        {
            title:'月报修故障累计（件）',
            data:'gdCountM'
        },
        {
            title:'本周报修故障累计（件）',
            data:'gdCountW'
        },
        {
            title:'任务完成',
            data:'tkComplete'
        },
        {
            title:'非维保范围',
            data:'tkCancel'
        },
        {
            title:'待完成',
            data:'tkWait'
        },
        {
            title:'自动售（取）票机',
            data:'shoupiaoji'
        },
        {
            title:'闸机',
            data:'zhaji'
        },
        {
            title:'引导系统',
            data:'yindao'
        },
        {
            title:'系统监控系统',
            data:'shipin'
        },
        {
            title:'广播系统',
            data:'guangbo'
        },
        {
            title:'旅服机房设备',
            data:'lvfujifang'
        },
        {
            title:'空调系统',
            data:'kongtiao'
        },
        {
            title:'其他',
            data:'qita'
        }
    ];

    //重绘表头
    function headerFn(thead, data, start, end, display){
        //在第一个的后边添加一个标签
        if( $(thead).parent('thead').children('tr').length <2 ){
            $(thead).parent('thead').children('tr').before('<tr>');
        };
        //向第一个tr中添加第一列的表头
        var firstTr = $(thead).parent('thead').children('tr').eq(0);
        var secondTr = $(thead).parent('thead').children('tr').eq(1);
        var firstTh = secondTr.children('th').eq(0);
        firstTh.addClass('first').attr('rowspan',2);
        firstTr.attr('role','row');
        ////添加
        if( firstTr.children('.first').length == 0 ){
            firstTr.append(firstTh);
        }
        //添加第二个
        var secondTh = '<th class="second"></th>';
        $('.second').attr('colspan',5).html('其中本周：故障处置情况（件）');
        if( firstTr.children('.second').length == 0 ){
            firstTr.append(secondTh);
        }
        //添加第三个
        var thirdTh = '<th class="third"></th>';
        $('.third').attr('colspan',8).html('其中：累计故障类别');
        if( firstTr.children('.third').length == 0 ){
            firstTr.append(thirdTh);
        }

        $('.first').eq(1).attr('rowspan',1);
    };

    //重绘脚部
    function footerFn(tfoot, data, start, end, display,dom){
        var lengths = $(tfoot).parents('#failure-reporting').find('thead').find('.sorting_disabled').length;
        var tr = $(tfoot).parents('#failure-reporting').children('tfoot').children('tr');
        var th = $(tfoot).parents('#failure-reporting').children('tfoot').children('tr').children('th');
        var str = '';
        if($(tfoot).parents('#failure-reporting').find('tfoot').find('th').length == 0){
            for(var i=0;i<lengths;i++){
                str += '<th></th>';
            }
            $('#failure-reporting tfoot').find('tr').append(str);
        }
        $(tfoot).parents('#failure-reporting').find('tfoot').find(tr).eq(0).children('th').eq(0).html('合计');
    };

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

    initTable($('#failure-reporting'),failureReportingCol,headerFn,footerFn,totalFn,drawFn);

    var failureToRepairCol = [
        {
            title:'站（段）名',
            data:'wxKeshi'
        },
        {
            title:'故障报修时间',
            data:'gdShij'
        },
        {
            title:'故障设备及类别',
            data:'bxBeizhu'
        },
        {
            title:'报修至截止本日12:00已累计故障（时、分）',
            data:'timeSpan'
        },
        {
            title:'处置过程',
            data:'wxBeizhu'
        },
        {
            title:'预计完成时限',
            data:'yjShij'
        },
        {
            title:'督察督办责任人',
            data:'wxUserNames'
        },
        {
            title:'故障未处理原因分析',
            data:'dengMemo'
        }
    ];

    initTable($('#failure-to-repair'),failureToRepairCol);

    var failureInfoCol = [
        {
            title:'站（段）名',
            data:'bxkeshi'
        },
        {
            title:'故障报修或发现时间',
            data:'gdShij'
        },{
            title:'故障类别',
            data:'bxBeizhu'
        },{
            title:'处置情况',
            data:'lastUpdateInfo'
        },{
            title:'原因分析',
            data:'reason'
        },{
            title:'整改措施',
            data:'method'
        },
    ];

    initTable($('#failure-info'),failureInfoCol);

    var workProgressCol = [
        {
            title:'站（段）名',
            data:''
        },
        {
            title:'故障报修或发现时间',
            data:''
        },
        {
            title:'故障类别',
            data:''
        },
        {
            title:'处置情况',
            data:''
        },
        {
            title:'加班人员',
            data:''
        },
        {
            title:'整改措施',
            data:''
        },
    ];

    initTable($('#work-progress'),workProgressCol);

    //按钮显示/隐藏
    //默认第一个按钮显示
    $('.dt-buttons').hide();

    $('.dt-buttons').eq(0).show();

    /*---------------------------------------------------------------------------------------*/
    //导出
    $('.excelButton11').eq(0).on('click',function(){
        FFExcel($('#failure-reporting')[0])
    });
    $('.excelButton11').eq(1).on('click',function(){
        FFExcel($('#failure-to-repair')[0])
    });
    $('.excelButton11').eq(2).on('click',function(){
        FFExcel($('#failure-info')[0])
    });
    //IE浏览器中导出复杂表头为excel文件
    function AutoExcel(tableId){

        var oXL = new ActiveXObject("Excel.Application"); //创建应该对象

        var oWB = oXL.Workbooks.Add();//新建一个Excel工作簿

        var oSheet = oWB.ActiveSheet;//指定要写入内容的工作表为活动工作表

        //var table = document.getElementById("failure-reporting");//指定要写入的数据源的id
        var table = tableId;//指定要写入的数据源的id

        var hang = table.rows.length;//取数据源行数

        var lie = table.rows(0).cells.length;//取数据源列数

        var totleLie= 0 ;

//初始化表头

        for(i = 0 ;i <lie ;i++ ){

            totleLie=totleLie+ table.rows(0).cells(i).colSpan;

        }

// Add table headers going cell by cell.

        for (i=0;i<hang;i++){//在Excel中写行

            var offset = 0 ;

            for (j=0;j<totleLie;j++){//在Excel中写列

//定义格式

                var obj = table.rows(i).cells(j) ;

                if(obj == null) continue ;

                if( obj.nodeName=="TH"){

                    if(obj.colSpan==1 && obj.rowSpan==1){

                        do{

                            oSheet.Cells(i+1,offset+1).value = table.rows(i).cells(j).innerText;//向单元格写入值

                            offset++ ;

                        }while(oSheet.Cells(i+1,offset).value==null)

                        oSheet.Cells(i+1,offset).HorizontalAlignment = 3;

                        oSheet.Cells(i+1,offset).NumberFormatLocal = "@";//将单元格的格式定义为文本

                        oSheet.Cells(i+1,offset).Font.Bold = true;//加粗

                        oSheet.Cells(i+1,offset).Font.Size = 10;//字体大小

                    }else{

                        do{

                            oSheet.cells(i+1,offset+1).value = table.rows(i).cells(j).innerText;

//offset = offset + obj.colSpan;

                            offset++;

                        }while(oSheet.Cells(i+1,offset).value==null)

                        oSheet.Range(oSheet.cells(i+1,offset),oSheet.cells(i+ obj.rowSpan,offset+obj.colSpan -1)).Select();

                        oXL.Selection.HorizontalAlignment = 3;

                        oXL.Selection.MergeCells = true;

                        oXL.Selection.Font.Bold = true;//加粗

                        oXL.Selection.Font.Size = 10;//字体大小

                    }

                }else{

                    oSheet.Cells(i+1,j+1).NumberFormatLocal = "@";//将单元格的格式定义为文本

//oSheet.Cells(i+1,j+1).Font.Bold = true;//加粗

                    oSheet.Cells(i+1,j+1).Font.Size = 10;//字体大小

                    oSheet.Cells(i+1,j+1).value = table.rows(i).cells(j).innerText;//向单元格写入值

                }

            }

        }

        var xlDiagonalDown = 5 ;

        var xlDiagonalUp = 6 ;

        var xlEdgeBottom = 9 ;

        var xlEdgeLeft = 7 ;

        var xlEdgeRight = 10 ;

        var xlEdgeTop = 8 ;

        var xlInsideHorizontal = 12 ;

        var xlInsideVertical = 11 ;

        var xlNone = -4142 ;

        var xlContinuous = 1	;

        var xlThin = 2 ;

        oSheet.Range(oSheet.cells(1,1),oSheet.cells(hang,totleLie)).Select();

        oXL.Selection.Borders(xlDiagonalDown).LineStyle = xlNone;

        oXL.Selection.Borders(xlDiagonalUp).LineStyle = xlNone;

        oXL.Selection.Borders(xlEdgeLeft).LineStyle = xlContinuous;

        oXL.Selection.Borders(xlEdgeLeft).ColorIndex = 0;

        oXL.Selection.Borders(xlEdgeLeft).TintAndShade = 0;

        oXL.Selection.Borders(xlEdgeLeft).Weight = xlThin;

        oXL.Selection.Borders(xlEdgeTop).LineStyle = xlContinuous;

        oXL.Selection.Borders(xlEdgeTop).ColorIndex = 0;

        oXL.Selection.Borders(xlEdgeTop).TintAndShade = 0;

        oXL.Selection.Borders(xlEdgeTop).Weight = xlThin;

        oXL.Selection.Borders(xlEdgeBottom).LineStyle = xlContinuous;

        oXL.Selection.Borders(xlEdgeBottom).ColorIndex = 0;

        oXL.Selection.Borders(xlEdgeBottom).TintAndShade = 0;

        oXL.Selection.Borders(xlEdgeBottom).Weight = xlThin;

        oXL.Selection.Borders(xlEdgeRight).LineStyle = xlContinuous;

        oXL.Selection.Borders(xlEdgeRight).ColorIndex = 0;

        oXL.Selection.Borders(xlEdgeRight).TintAndShade = 0;

        oXL.Selection.Borders(xlEdgeRight).Weight = xlThin;

        oXL.Selection.Borders(xlInsideVertical).LineStyle = xlContinuous;

        oXL.Selection.Borders(xlInsideVertical).ColorIndex = 0;

        oXL.Selection.Borders(xlInsideVertical).TintAndShade = 0;

        oXL.Selection.Borders(xlInsideVertical).Weight = xlThin;

        oXL.Selection.Borders(xlInsideHorizontal).LineStyle = xlContinuous;

        oXL.Selection.Borders(xlInsideHorizontal).ColorIndex = 0;

        oXL.Selection.Borders(xlInsideHorizontal).TintAndShade = 0;

        oXL.Selection.Borders(xlInsideHorizontal).Weight = xlThin;

        oXL.Visible = true;

        oXL.UserControl = true;

        oXL=null;

    }

    //FF浏览器下导出
    function FFExcel(tableId){
        var explorer = navigator.userAgent ;
        //判断是否是IE浏览器
        if(explorer.indexOf("Trident") >= 0){
            AutoExcel(tableId);
        }else{
            //获得id为mytable的table的html元素
            var table=tableId;
            // 克隆（复制）此table元素，这样对复制品进行修改（如添加或改变table的标题等），导出复制品，而不影响原table在浏览器中的展示。
            table = table.cloneNode(true);
            //下面五行代码就是用来改变table中的某些信息的，不需要的话可以注释，或修改。
            var name=$(".big-title").text();
            var caption_orig = table.getElementsByTagName("caption");

            // 下面的代码才是真正用来将html table导出Excel表格（我从stackoverflow上看到的，修改了一点点，不会再有中文乱码问题了。）
            var uri = 'data:application/vnd.ms-excel;base64,'
                , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table style="vnd.ms-excel.numberformat:@">{table}</table></body></html>'
                , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); }
                , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };
            if (!table.nodeType) table = document.getElementById('dateTables');
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };
            window.location.href = uri + base64(format(template, ctx));
        }
    }
    /*---------------------------------------------------------------------------------------*/

    //本周客服设备故障上报及处理情况
    conditionSelect('YWGD/ywGDRptGDs',$('#failure-reporting'),'flag');

    //本周发现或反馈的客服设备惯性、典型（重点）故障情况
    conditionSelect('YWGD/ywGDRptTypic',$('#failure-info'));

    //未修复
    conditionSelect('YWGD/ywGDRptWaiting',$('#failure-to-repair'));

    //条件查询
    function conditionSelect(url,tableId,flag){
        var startTime = $('.datatimeblock').eq(0).val() +' ' + $('.timeblock').eq(0).val();
        var endTime = $('.datatimeblock').eq(1).val() + ' ' + $('.timeblock').eq(1).val();
        //console.log(startTime);
        //console.log(endTime);
        //获取条件
        var prm = {
            "gdSt":startTime,
            "gdEt":endTime,
            "userID":_userIdNum,
            "userName ":_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            success:function(result){
                if(flag){
                    _totalNums = 0;
                    for(var key in result[0]){
                        _totalAttr.push(key);
                    }
                    for(var i=0;i<result.length;i++){
                        _totalNums += result[i].gdCountW
                    }
                    $('.goods-num').html(_totalNums);
                }

                _datasTable(tableId,result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //表格初始化
    function initTable(table,arr,headerCallBack,footerCallBack,fnRowCallback,drawCallback){
        var table =  table.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": true,   //是否分页
            "destroy": true,//还原初始化了的datatable
            "searching": true,
            "ordering": false,
            "pagingType":"full_numbers",
            "bStateSave":true,
            "aLengthMenu": [ 10, 25, 50, 100],
            "iDisplayLength":25,//默认每页显示的条数
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                'infoEmpty': '没有数据',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            'buttons': [
                {
                    extend: 'excelHtml5',
                    text: '导出',
                    className:'saveAs'
                }
            ],
            "dom":'t<"F"lip>',
            "columns": arr,
            "headerCallback":headerCallBack,
            "footerCallback": footerCallBack,
            "fnRowCallback": fnRowCallback,
            "drawCallback":drawCallback
        });
        table.buttons().container().appendTo($('.excelButton'),table.table().container());
    }

    /*-----------------------------------------按钮--------------------------------------*/
    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tabDiv = $(this).parents('.table-title').next().children('div');
        tabDiv.addClass('hide-block');
        tabDiv.eq($(this).index()).removeClass('hide-block');
        $('.excelButton11').parent('li') .hide();
        $('.excelButton11').eq($(this).index()).parent('li').show();
        $('.excelButton11').eq($(this).index()).show();
    });
})