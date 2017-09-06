/**
 * Created by admin on 2017/9/1.
 */
//导出到Excel，注意，表格标记内不得有注释，因为childNodes会把注释也算进去
//如果出错，需要关闭Excel，否则Excel进程会一直运行着
//td中只能有一个input值
//非td间不可以有组建 否则报缺少“；”错误
//引用页面加上<script type="text/javascript" src="execl.js"></script>
//添加按钮<input style="height:26px" type="button" name="btnExcel" value="导出excel" onClick="ExportExcel(this,'tableNr','','表头');"/>
//将table表的id和class设置为tableNr
function ExportExcel(btn,TabId,strCols,sTitle,sHeader,sFooter){
//alert('ssss');
    btn.style.cursor = "wait";
    event.returnValue = false;
//try{
    var tab = document.getElementById(TabId);
// if(tab == null) tab = document.getElementById("dg")
//if(tab == null) tab = document.getElementById("db")
//if(tab == null) tab = document.getElementById(TabId)
    if(tab == null){
        alert("缺少表格对象");
        btn.style.cursor = "hand";
        return;
    }
    var t = tab.firstChild;
    var rows = t.childNodes.length;
    console.log(tab.firstChild);
//alert(t.nodeName); //test
    var tds = t.childNodes[0].childNodes.length;
    var cols = 0;
    for(var i=0;i<tds;i++){
        var td = t.childNodes[0].childNodes[i];
        if(parseInt(td.colSpan)>1){
            cols += parseInt(td.colSpan);
        }
        else{
            cols++;
        }
    }
    try{
        var oXL = new ActiveXObject("Excel.Application");
    }catch(e){
        alert("请确认已经安装了Excel并允许运行Excel!");
        alert("无法启动Excel，请确保电脑中已经安装了Excel!\n\n如果已经安装了Excel，"+"请将ip地址加入信任站点，并调整IE信任站点的安全级别。\n\n具体操作：\n\n"+"工具 → Internet选项 → 安全 → 自定义级别 → ActiveX 控件和插件 → 对未标记为可安全执行脚本的ActiveX 控件初始化并执行脚本 → 启用 → 确定");
        btn.style.cursor = "hand";
        return;
    }
    oXL.Workbooks.Add();
    var obook = oXL.ActiveWorkBook;
    var osheets = obook.Worksheets;
    var osheet = obook.Sheets(1);
    var xlrow = 1;
//添加标题
    if((sTitle == "") || (typeof(sTitle)=="undefined") || (sTitle==null)){
        var t_tdHeadc = document.getElementById("tdHeadc");
        if(t_tdHeadc != null){
            sTitle = t_tdHeadc.innerText;
            var sk = sTitle.lastIndexOf("-->")+3;
            sTitle = sTitle.substring(sk);
        }
    }
    osheet.Cells(1, 1) = sTitle;
    osheet.Range(osheet.Cells(xlrow, 1),osheet.Cells(xlrow,cols)).Select(); //选择该列
    oXL.Selection.HorizontalAlignment = 3; //居中
    oXL.Selection.MergeCells = true;
    xlrow++;
//小标题
    if((sHeader == "") || (typeof(sHeader)=="undefined") || (sHeader==null)){
        sHeader = "";
    }
    if(sHeader != ""){
        osheet.Cells(2, 1) = sHeader;
        osheet.Range(osheet.Cells(xlrow, 1),osheet.Cells(xlrow,cols)).Select(); //选择该列
//oXL.Selection.HorizontalAlignment = 3; //居中
        oXL.Selection.MergeCells = true;
        xlrow++;
    }
    var winX = (screen.width - 300) / 2;
    var winY = (screen.height - 120) / 2;

    var win = window.open("","","directories=0,location=0,memubar=0,scrollbars=0,status=0,toolbar=0,width=230,height=75,left=" + winX + ",top=" + winY);
    win.document.write('<html><title>' + sTitle + '导出Excel</title><body><div id="m_pub_wzs_progress_x" style="background:white;overflow:hidden;padding-top:0;display:none;position:absolute;left:10px;top:25px;"><table id="m_pub_wzs_progress_tab" border=0 cellspacing=1 bgcolor="#CCCCCC" style="display:inline;border-width:1px;border-style:solid;border-left-color:#333333;border-top-color:#333333;border-right-color:#EEEEEE;border-bottom-color:#EEEEEE;">');
    win.document.write('<tr height=17><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#000088"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td><td width=4 bgcolor="#CCCCCC"></td>');
    win.document.write('</tr></table><br><span id="m_pub_wzs_progress_percent" style="font-size:10pt;vertical-align:middle;color:black;font-family:宋体">总计' + rows + '行，已导出<font id="sx" color="#cc0000"></font>行！</span></div><br /><br /><br /><script language="javascript">var osx=document.getElementById("sx");var div = document.getElementById("m_pub_wzs_progress_x");function m_pub_wzs_progress_show(pTotalCount,pCurrCount){osx.innerText = pCurrCount;var m = Math.floor(pCurrCount / pTotalCount * 30);div.style.display = "";var tr = div.firstChild.rows[0];for(var i=0;i<tr.cells.length;i++){var td=tr.cells[i]; if(i<m) td.bgColor="#000088"; else td.bgColor="#CCCCCC";}}function m_pub_wzs_progress_hide(){ var div = document.getElementById("m_pub_wzs_progress_x"); div.style.display = "none";}</script></body></html> ');

//win.document.write("<div style='font-size:10pt;font-family:宋体'>总共" + rows + "行，已导出<font id='sx' color='#cc0000'></font>行！</div>");
//win.m_pub_wzs_progress_show(0,rows);
    strCols = ","+strCols+",";
    var aRowSpans = new Array();
    for(var i=0;i<cols;i++){
        aRowSpans[i] = 1;
    }
    var isProgressErr = false;
    for(var i = 0; i < rows; i++){
//btn.value = i;
        if(!isProgressErr){
            try{
                win.m_pub_wzs_progress_show(rows,i+1);
            }
            catch(e){
                isProgressErr = true;
            }
        }
        var row = t.childNodes[i];
        var xlcol =0;
        var viwCol = -1; //所在表格的位置，指显示位置，如果有行合并时，会与列索引不一致
        var colInx = -1;
        var colSpans = 1;
        for(var h = 0; h < cols; h++){
            if(aRowSpans[h]>1){
                xlcol++;
                aRowSpans[h]--;
                viwCol++;
                continue;
            }
            else{
                colInx++;
            }
            var td = t.childNodes[i].childNodes[colInx];
            if(td == null) continue;
            colSpans = td.colSpan;
            var rowSpan = td.rowSpan;
            if(isNaN(rowSpan)) rowSpan = 1;
            for(var k=0;k<td.colSpan;k++){
                viwCol++;
                xlcol++;
                aRowSpans[viwCol] = rowSpan;
            }
            h+=td.colSpan-1; //跳过合并列
            if(td.className=="hideNode"){
                xlcol--;
                continue;
            }
            var s = "";
            if(td.hasChildNodes() && td.firstChild.nodeName.toLowerCase()=="input"){
                if(td.firstChild.type.toLowerCase()=="text"){
                    s = td.firstChild.value;
                }
                else if(td.firstChild.type.toLowerCase()=="radio"){ //如果是单选框， 遍历该框所有单选框，找到选择的值
                    for(var k=0;k<td.childNodes.length;k++){
                        var cn = td.childNodes[k];
                        if(cn.nodeName.toLowerCase()=="input" && cn.type.toLowerCase() == "radio" && cn.checked){
                            s = cn.value;
                            break;
                        }
                    }
                }
            }
            else{
                s = td.innerText;
            }
            if(strCols.indexOf("," + (xlcol-1) + ",")!=-1){
                osheet.Cells(xlrow,xlcol).NumberFormatLocal = '@';
            }
            if(td.rowSpan>1 || td.colSpan>1){
                osheet.range(osheet.cells(xlrow,xlcol),osheet.cells(xlrow-1+td.rowSpan, xlcol-td.colSpan+1)).Select();
                oXL.Selection.MergeCells = true;
                osheet.Cells(xlrow,xlcol).HorizontalAlignment = 3;
//osheet.cells(i+td.rowSpan, xlcol-td.colSpan+1).value = s;
                osheet.Cells(xlrow,xlcol-td.colSpan+1).value = s;//m_splitLen(s,30,'\r\n');
            }else{
                osheet.Cells(xlrow,xlcol).value = s;//m_splitLen(s,30,'\r\n');
            }
        }
        xlrow++;
    }
//添加表尾
    if((sFooter == "") || (typeof(sFooter)=="undefined") || (sFooter==null)){
        sFooter = "";
    }
    var d = new Date();
    var sUser = "";
    if((window.parent != null) && (window.parent.parent != null)){
        try{
            sUser = window.parent.parent.bottomFrame.document.getElementById("labUser").innerText.replace("用户：","").replace(/ /g,"");
        }
        catch(ex){
        }
    }
    var sFooterDefault = " 制表人：" + sUser + " 制表时间：" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " ";
    osheet.Cells(xlrow, 1) = sFooterDefault + sFooter;
    osheet.Range(osheet.Cells(xlrow, 1),osheet.Cells(xlrow,cols)).Select(); //选择该列//oXL.Selection.HorizontalAlignment = 4; //居中
    oXL.Selection.MergeCells = true;
    osheet.Range(osheet.Cells(1, 1),osheet.Cells(1,1)).Select(); //选择第一个单元格列
    osheet.Columns.AutoFit(); //自动列宽
    for(var i=1;i<xlrow;i++){
        osheet.Rows(i).RowHeight = osheet.Rows(i).RowHeight + 6; //自动大小后上下无边距，需要增加高度，要不太挤。
    }
    if(!isProgressErr){ //关闭进度条
        win.close();
    }
    oXL.Visible = true;
    oXL.UserControl = true;

    oXL = null;
    obook = null;
    osheets = null;
    osheet = null;

    btn.style.cursor = "hand";
}