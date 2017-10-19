$(function(){
    //全局变量
    /*
     * 用户名 _userIdName 本地地址 _url*/
    //日历插件初始化
    //日期
    _dataComponentsFun($('.datatimeblock'));

    //时间
    _timeComponentsFun1($('.timeblock'));

    //开始时间
    var _date = moment().format('YYYY/MM/DD');

    var _dataWeekStart = moment().format('YYYY-MM-DD');

    //设置初始日期
    $('.datatimeblock').eq(0).val(_dataWeekStart);


    //设置初始时间
    $('.timeblock').eq(0).val('00:00');

    //页面载入初始数据
    conditionSelect();

    //修改时间

    $('.startTime').html(moment().format('YYYY-MM-DD') +' ' + $('.timeblock').eq(0).val());

    /*--------------------------------------按钮事件---------------------------------*/
    $('#selected').click(function(){
        //修改时间
        $('.startTime').html(moment().format('YYYY-MM-DD') +' ' + $('.timeblock').eq(0).val());

        //重新获取数据
        conditionSelect()

    })
    /*------------------------------------表格初始化------------------------------------------*/
    var failureReportingCol = [
        {
            title:'序号',
            data:'index'
        },
        {
            title:'原因分类',
            data:'dengyyInfo'
        },
        {
            title:'故障编码',
            data:'gdCode2'
        },
        {
            title:'系统名称',
            data:'dsName'
        },
        {
            title:'车间',
            data:'departName'
        },
        {
            title:'车站',
            data:'ddName'
        },
        {
            title:'报修时间',
            data:'gdShiJ'
        },
        {
            title:'故障描述',
            data:'wxbeizhu'
        },
        {
            title:'最新处理情况',
            data:'lastUpdateInfo'
        }
    ];


    initTable($('#failure-reporting'),failureReportingCol);


    initTable($('#failure-to-repair'),failureReportingCol);

    initTable($('#failure-info'),failureReportingCol);
    initTable($('#failure-info1'),failureReportingCol);
    initTable($('#failure-info2'),failureReportingCol);
    initTable($('#failure-info3'),failureReportingCol);
    initTable($('#failure-info4'),failureReportingCol);

    //按钮显示/隐藏
    //默认第一个按钮显示
    $('.dt-buttons').hide();

    $('.dt-buttons').eq(0).show();

    /*---------------------------------------------------------------------------------------*/
    //导出
    $('.excelButton11').on('click',function(){

        //获取当前要导出表格的ID
        var showIndex = $('.table-title .spanhover').index();

        //console.log($('.table').eq(showIndex));

        $('.table').eq(showIndex).hide();

        FFExcel($('.table').eq(showIndex)[0])
    });
    /*---------------------------------------------------------------------------------------*/

    //
    //条件查询
    function conditionSelect(){
        var endTime = $('.datatimeblock').eq(0).val() +' ' + $('.timeblock').eq(0).val();

        //获取条件
        var prm = {
            "et":endTime
        }
        var url = 'YWGDReport/GetGDNoFinishList';
        $.ajax({
            type:'get',
            url:_urls +  url,
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){
                console.log(result);
                $('#theLoading').modal('hide');
                //汇总数据
                _datasTable($('#failure-reporting'),result.allGDNoFinishs);
                //缺配件数据
                _datasTable($('#failure-to-repair'),result.fewPartsFinishs);
                //各车间数据
               var workshopArr = result.departNoFinishs;
                $('.workshop').hide();
                $(workshopArr).each(function(i,o){
                    $('.workshop').eq(i).show();
                    //获取地址名称
                    var address = o.departName.substr(0,2);
                    address += '车间';
                    $('.workshop').eq(i).html(address);
                    //对应车间数据
                    _datasTable($('.work-table').eq(i), o.gdNoFinishs);
                });

            },
            error:function(jqXHR, textStatus, errorThrown){
                $('#theLoading').modal('hide');
                console.log(jqXHR.responseText);
            }
        })
    }

    //表格初始化
    function initTable(table,arr,headerCallBack,footerCallBack,fnRowCallback,drawCallback){
        var table =  table.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": false,   //是否分页
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
                'info': '共 _TOTAL_ 条数据',
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
            "columns": arr
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

    });

    ///*-----------------------------------------下拉框事件--------------------------------------*/

//设置延迟使时间
    var theTimes = 300000;

//datatimepicker只显示小时
    function _timeComponentsFun1(el){
        el.datetimepicker({
            language:  'zh-CN',//此处修改
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            format : "hh:00",//日期格式
            startView: 1,  //1时间  2日期  3月份 4年份
            forceParse: true,
            minView : 1,
            minuteStep:0
        });
    };

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
        var name=$(".table-block-title").text();
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



