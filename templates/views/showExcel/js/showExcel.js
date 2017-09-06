/**
 * Created by admin on 2017/7/14.
 */
$(document).ready(function(){

    var table = $('#dateTables').DataTable({
        "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "bPaginate": false,
        "ordering": false,
        'searching':false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
            'paginate': {
                'first':      '第一页',
                'last':       '最后一页',
                'next':       '下一页',
                'previous':   '上一页'
            },
            'infoEmpty': ''
        },
        "dom":'B<"clear">lfrtip',
        //数据源
        'columns':[
            {
                title:'序号',
                data:"index"
            },
            {
                data:"enterpriseID"
            },
            {
                title:'倍率',
                data:"enterpriseName"
            },
            {
                title:'起数',
                data:"enterpriseName"
            },
            {
                title:'止数',
                data:"enterpriseName"
            },
            {
                title:'用量',
                data:"enterpriseName"
            },
            {
                title:'起数',
                data:"enterpriseName"
            },
            {
                title:'止数',
                data:"enterpriseName"
            },
            {
                title:'用量',
                data:"enterpriseName"
            },
            {
                title:'起数',
                data:"enterpriseName"
            },
            {
                title:'止数',
                data:"enterpriseName"
            },
            {
                title:'用量',
                data:"enterpriseName"
            },
            {
                title:'备注',
                data:"enterpriseName"
            }

        ]
    });
    _table = $('#dateTables').dataTable();

    setData();
});
var obj = {

    index:1,
    enterpriseID:'A区保卫处',
    enterpriseName:3

};
dataArrs = [];
for(var i=0; i<18;i++){
    dataArrs.push(obj);
}

//点击保存按钮时触发
$('.save-button').on('click',function(){

    var explorer = navigator.userAgent ;

    //console.log(explorer);

    //判断是否是IE浏览器
    if(explorer.indexOf("Trident") >= 0){

        AutoExcel();
    }else{
        //获得id为mytable的table的html元素
        var table=document.getElementById('dateTables');
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




});

//IE浏览器中导出复杂表头为excel文件
function AutoExcel(){

    var oXL = new ActiveXObject("Excel.Application"); //创建应该对象

    var oWB = oXL.Workbooks.Add();//新建一个Excel工作簿

    var oSheet = oWB.ActiveSheet;//指定要写入内容的工作表为活动工作表

    var table = document.getElementById("dateTables");//指定要写入的数据源的id

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
