/*----------------------------默认加载-------------------------*/
//获得用户名
var _userIdName = sessionStorage.getItem('realUserName');

//获得用户id
var _userIdNum = sessionStorage.getItem('userName');

//获取本地url
var _urls = sessionStorage.getItem("apiUrlPrefixYW");

//获取角色权限
var  _userRole = sessionStorage.getItem("userRole");

//筛选只看到自己部门的工单
var _userBM = sessionStorage.getItem("userDepartNum");

//部门名称
var _userBMName = sessionStorage.getItem("userDepartName");

//ajax延迟时间设置
var _theTimes = 60000;

//获取登陆者信息
var _loginUser = JSON.parse(sessionStorage.getItem("userInfo"));

//部门
var _maintenanceTeam = sessionStorage.getItem("userDepartNum");

//图片的路径
var _urlImg = sessionStorage.getItem("imgPath");

//从本地存储中获取楼宇ID列表
function getPointersId(){

    //存放楼宇ID列表
    var pointerIdArr = [];

    var pointerArr = $.parseJSON(sessionStorage.getItem('pointers'));


    $(pointerArr).each(function(i,o){

        pointerIdArr.push(o.pointerID);
    });

    return pointerIdArr;
};

//从本地存储中获取分户ID列表
function getOfficesId(){

    //存放分户ID列表
    var officeIdArr = [];

    var officeArr = $.parseJSON(sessionStorage.getItem('offices'));


    $(officeArr).each(function(i,o){

        officeIdArr.push(o.f_OfficeID);
    });

    return officeIdArr;
};

/*---------------------------时间初始化------------------------*/

//datapicker时间插件初始化(日月年)/
function _timeYMDComponentsFun(el){
    el.datepicker('destroy');
    el.datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',
        forceParse: 0,
        autoclose: 1
    });
}

function _timeYMDComponentsFun11(el){
    el.datepicker('destroy');
    el.datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy-mm-dd',
        forceParse: 0,
        autoclose: 1
    });
}

//datapicker时间插件初始化（年）
//datapicker时间插件初始化（年）/
function _yearDate(el){
    el.datepicker('destroy');
    el.datepicker({
        startView: 2,
        maxViewMode: 2,
        minViewMode:2,
        forceParse: 0,
        autoclose:1,
        format: "yyyy",//选择日期后，文本框显示的日期格式
        language: "zh-CN" //汉化
    })
}

//datapicker时间插件初始化（月）/
function _monthDate(el){
    el.datepicker('destroy');
    el.datepicker({
        startView: 1,
        maxViewMode: 2,
        minViewMode:1,
        forceParse: 0,
        autoclose:1,
        format: "yyyy/mm",//选择日期后，文本框显示的日期格式
        language: "zh-CN" //汉化
    })
}

function _monthDate11(el){
    el.datepicker('destroy');
    el.datepicker({
        startView: 1,
        maxViewMode: 2,
        minViewMode:1,
        forceParse: 0,
        autoclose:1,
        format: "yyyy-mm",//选择日期后，文本框显示的日期格式
        language: "zh-CN" //汉化
    })
}

//月日
function _monthDay(el){

    el.datepicker('destroy');
    el.datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'mm-dd',
        forceParse: 0,
        autoclose: 1
    });

}

//datatimepicker事件插件初始化（日月年时分秒）
function _timeHMSComponentsFun(el,startView){
    el.datetimepicker({
        language:  'zh-CN',//此处修改
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: startView,  //1时间  2日期  3月份 4年份
        forceParse: 0,
    });
}

//datatimepicker事件插件初始化(单一视图，只选择年/月/日/时间)
function _timeOneComponentsFun(el,startView,maxView,minView,format){
    el.datetimepicker({
        language:  'zh-CN',//此处修改
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: startView,  //1时间  2日期  3月份 4年份
        forceParse: 0,
        minView:minView,
        maxView:maxView,
        format:format
    });
}

//datatimepicker只显示日期
function _dataComponentsFun(el){
    el.datetimepicker({
        language:  'zh-CN',//此处修改
        weekStart: 1,
        todayHighlight: 1,
        forceParse: 0,
        minView: "month",//设置只显示到月份
        format : "yyyy-mm-dd",//日期格式
        autoclose:true,//选中关闭
        todayBtn: true//今日按钮
    });
}

//datatimepicker只显示时间
function _timeComponentsFun(el){
    el.datetimepicker({
        language:  'zh-CN',//此处修改
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        format : "hh:ii",//日期格式
        startView: 1,  //1时间  2日期  3月份 4年份
        forceParse: 0,
        maxView : 'hour'
    });
}

/*-----------------------dataTable---------------------------*/

//基本表格初始换(buttons=1按钮显示，其他按钮隐藏,dom是真的时候，不显示分页和翻页,导出列,每页显示列数,最后一个是否分页)；
function _tableInit(tableId,col,buttons,flag,fnRowCallback,drawCallback,domFlag,arr,num,isPaging,headerCallback){

    var buttonVisible = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs',
            exportOptions:{
                columns:arr
            }
        }
    ];
    var buttonHidden = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs hiddenButton'
        }
    ];
    if(buttons == 1){
        buttons = buttonVisible;
    }else{
       buttons =  buttonHidden;
    }

    var dom;

    if(domFlag){

        dom = 't<"F">'

    }else{

        dom = 't<"F"lip>';

    }

    var length = 50;

    if(num){

        length = num;

    }else{

        length = 50;

    }

    var isPag = true;

    if(isPaging){

        isPag = false;

    }else{

        isPag = true;

    }

    var _tables = tableId.DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": isPag,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        "bProcessing":true,
        "iDisplayLength":length,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":dom,
        'buttons':buttons,
        "columns": col,
        "fnRowCallback": fnRowCallback,
        "drawCallback":drawCallback,
        "headerCallback":headerCallback
    });

    if(flag){
        _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    }

    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }

}

//
function _tableInitS(tableId,col,buttons,searching,flag,fnRowCallback,drawCallback){
    var buttonVisible = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs'
        }
    ];
    var buttonHidden = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs hiddenButton'
        }
    ];
    if(buttons == 1){
        buttons = buttonVisible;
    }else{
        buttons =  buttonHidden;
    }
    //是否可搜索
    var search = false;

    if(searching){
        search = true;
    }
    var _tables = tableId.DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": search,
        "ordering": false,
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'sSearch':'查询',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            "infoFiltered": "(从 _MAX_ 条记录过滤)",
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'ft<"F"lip>',
        'buttons':buttons,
        "columns": col,
        "fnRowCallback": fnRowCallback,
        "drawCallback":drawCallback
    });
    if(flag){
        _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    }

}

//不显示翻页，出现滚动条的表格初始化
function _tableInitScroll(tableId,col,buttons,flag,fnRowCallback,drawCallback,domFlag,arr,num,isPaging,height){

    var buttonVisible = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs',
            exportOptions:{
                columns:arr
            }
        }
    ];
    var buttonHidden = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs hiddenButton'
        }
    ];
    if(buttons == 1){
        buttons = buttonVisible;
    }else{
        buttons =  buttonHidden;
    }

    var dom;

    if(domFlag){

        dom = 't<"F">'

    }else{

        dom = 't<"F"lip>';

    }

    var length = 50;

    if(num){

        length = num;

    }else{

        length = 50;

    }

    var isPag = true;

    if(isPaging){

        isPag = false;

    }else{

        isPag = true;

    }

    var _tables = tableId.DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": isPag,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        "bProcessing":true,
        "iDisplayLength":length,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":dom,
        "bStateSave":true,
        "sScrollY": height,
        'buttons':buttons,
        "columns": col,
        "fnRowCallback": fnRowCallback,
        "drawCallback":drawCallback
    });

    if(flag){
        _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    }

    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }

}

//表格赋值
function _datasTable(tableId,arr){
    var table = tableId.dataTable();
    if(arr.length == 0){
        table.fnClearTable();
        table.fnDraw();

    }else{

        table.fnClearTable();
        table.fnAddData(arr);
        table.fnDraw();
    }
};

/*--------------------------获取专业名称----------------------------*/
//获取专业名词
function _getProfession(url,el,attr,attrNum,attrName,callbackFun){
    var prm ={
        userID:_userIdNum,
        userName:_userIdName
    };
    $.ajax({
        type:'post',
        url:_urls + url,
        data:prm,
        timeout:_theTimes,
        success:function(result){
            var str = '<option value="">全部</option>';

            if(attr){
                for(var i=0;i<result[attr].length;i++){
                    str += '<option value="' + result[attr][i][attrNum] +
                        '">' + result[attr][i][attrName] + '</option>';
                }
            }else{
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i][attrNum] +
                        '">' + result[i][attrName] + '</option>'
                }
            }

            el.empty().append(str);

            if(callbackFun){

                callbackFun();

            }

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    })
}

//需要保存数组的
function _ajaxFun(url, allArr, select, text, num) {
    var prm = {

        'userID': _userIdNum

    }
    prm[text] = '';

    $.ajax({
        type: 'post',
        url: _urls + url,
        timeout:30000,
        data: prm,
        success: function (result) {
            //给select赋值
            var str = '<option value="">全部</option>';
            for (var i = 0; i < result.length; i++) {
                str += '<option' + ' value="' + result[i][num] + '">' + result[i][text] + '</option>'
                allArr.push(result[i]);
            }
            select.empty().append(str);
        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log(jqXHR.responseText);
        }
    })
}

/*--------------------------导出excel--------------------------*/
//IE浏览器中导出复杂表头为excel文件
function _AutoExcel(tableId){

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
function _FFExcel(tableId){
    var explorer = navigator.userAgent ;
    //判断是否是IE浏览器
    if(explorer.indexOf("Trident") >= 0){
        _AutoExcel(tableId);
    }else{
        //获得id为mytable的table的html元素
        var table=tableId;
        // 克隆（复制）此table元素，这样对复制品进行修改（如添加或改变table的标题等），导出复制品，而不影响原table在浏览器中的展示。
        table = table.cloneNode(true);
        //下面五行代码就是用来改变table中的某些信息的，不需要的话可以注释，或修改。
        var name='';
        var caption_orig = table.getElementsByTagName("caption");

        // 下面的代码才是真正用来将html table导出Excel表格（我从stackoverflow上看到的，修改了一点点，不会再有中文乱码问题了。）
        var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table style="vnd.ms-excel.numberformat:@">{table}</table></body></html>'
            , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); }
            , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };
        if (!table.nodeType) table = document.getElementById('dateTables');
        var ctx = { worksheet: name || '', table: table.innerHTML };
        window.location.href = uri + base64(format(template, ctx));
    }
}

//导出为excel(需要导出样式的)
function _exportExecl(dom){

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

/*--------------------------模态框设置--------------------------*/
//控制模态框的设置，出现确定按钮的话，第三个参数传''，第四个才有效,用不到的参数一定要传''；istap,如果有值的话，内容改变，否则内容不变。
function _moTaiKuang(who, title, flag, istap ,meg, buttonName) {
    who.modal({
        show: false,
        backdrop: 'static'
    })
    who.find('.modal-title').html(title);
    who.modal('show');
    var markHeight = document.documentElement.clientHeight;
    var markBlockHeight = who.find('.modal-dialog').height();
    var markBlockTop = (markHeight - markBlockHeight) / 2;
    who.find('.modal-dialog').css({'margin-top': markBlockTop});
    if (flag) {
        who.find('.btn-primary').hide();
    } else {
        who.find('.btn-primary').show();
        who.find('.modal-footer').children('.btn-primary').html(buttonName);
    }
    if(istap){
        who.find('.modal-body').html(meg);
    }
}

/*--------------------------其他方法---------------------------*/
//判断两个对象是否相同
function _isEqual(obj1, obj2) {
    for (var name in obj1) {
        if (obj1[name] !== obj2[name]) return false;
    }
    for (var name in obj2) {
        if (obj1[name] !== obj2[name]) return false;
    }
    return true;
}

//不打印部分
function _noPrint(el) {
    el.addClass('noprint')
}

//vue单选框(仅限此框架中)
function _selectRadio(el,classname,$this){
    el.find(classname).click(function (a) {
        el.find(classname).parent('span').removeClass('checked');
        $this.parent('span').addClass('checked');
    })
}

//IP替换
function _replaceIP(str,str1){
    var ip = /http:\/\/\S+?\//;  /*http:\/\/\S+?\/转义*/
    var res = ip.exec(str1);  /*211.100.28.180*/
    str = str.replace(ip,res);
    return str;
}

//根据value值删除数组中的某项
Array.prototype.removeByValue = function(val,attr) {
    for(var i=0; i<this.length; i++) {
        if(this[i][attr] == val) {
            this.splice(i, 1);
            break;
        }
    }
}
//根据索引值删除
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
//定义数组删除某个元素的方法
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

//数组去重
function _unique(a,attr) {
    var res = [];

    for (var i = 0, len = a.length; i < len; i++) {
        var item = a[i];
        for (var j = 0, jLen = res.length; j < jLen; j++) {
            if (res[j][attr] === item[attr])
                break;
        }

        if (j === jLen)
            res.push(item);
    }

    return res;
}

//数组从小到大排序
function _sortNumber(a,b)
{
    return a - b
}

//2017-12-01-->2017/12/01
function _formatTime(str11){

    return str11.replace(/\//g,'-');

}

//数据量大的话，操作跳转到当前页
//提交更改后跳转到当前页
function _jumpNow(tableId,arr){

    if(arr.length > 0){
        arr.reverse();
    }

    var dom ='#'+ tableId[0].id + '_paginate';

    var txt = $(dom).children('span').children('.current').html();

    _datasTable(tableId,arr);

    var num = txt - 1;

    var dom = $(dom).children('span').children().eq(num);

    dom.click();

};

//所有表格tr点击复选事件
function MultiselectTr(el){

    if(el.hasClass('tables-hover')){

        el.removeClass('tables-hover');

        el.find('input').parent().removeClass('checked');

        el.parents('table').find('thead').find('input').parent('span').removeClass('checked');

    }else{

        el.addClass('tables-hover');

        el.find('input').parent().addClass('checked');

        var trLength = el.parents('table').find('tbody').children().length;

        var hoverLength = el.parents('table').find('tbody').children('.tables-hover').length;

        if(trLength == hoverLength){

            el.parents('table').find('thead').find('input').parent('span').addClass('checked');

        }else{

            el.parents('table').find('thead').find('input').parent('span').removeClass('checked');

        }

    }

}

//表格全选事件
function AllSelectThead(el,table){

    if(el.parent().hasClass('checked')){

        el.parent().removeClass('checked');

        table.find('tbody').children().removeClass('tables-hover');

        table.children().find('input').parent().removeClass('checked');

    }else{

        el.parent().addClass('checked');

        table.find('tbody').children().addClass('tables-hover');

        table.children().find('input').parent().addClass('checked');

    }

}

//传入两个数组，去重
function _uniqueArr(maxArr,minArr,attr){

    if(maxArr.length == 0){

        for(var i=0;i<minArr.length;i++){

            maxArr.push(minArr[i]);

        }

    }else{

        var arr = [];

        for(var i=0;i<maxArr.length;i++){

            for(var j=0;j<minArr.length;j++){

                if(maxArr[i][attr] == minArr[j][attr]){

                    arr.push(minArr[j]);

                }

            }

        }

        for(var i=0;i<arr.length;i++){

            minArr.remove(arr[i])

        }

        for(var i=0;i<minArr.length;i++){

            maxArr.push(minArr[i]);

        }

    }

};


//对后台返回的表格数据进行包装，方便datatables插件进行调用
function packagingTableData(tableData){

    //定义新生产的table数组
    var newTableArr = [];

    //获取到名称数组
    var titleArr = tableData.columns;

    //获取数据数组
    var dataArr = tableData.data;

    //遍历数据数组
    $(dataArr).each(function(i,o){

        //定义新的对象
        var obj = {};

        //取出每行的数据
        var lineArr = o;

        $(lineArr).each(function(i,o){

            obj[titleArr[i]] = o;
        });

        //把对象放入到新的数组中
        newTableArr.push(obj);
    });

    return newTableArr;
};

//格式化数字，排除infinity NaN 其他格式
function _formatNumber(num){
    if(num===Infinity){
        return 0.00;
    }
    if(+num===num){
        return num.toFixed(2);
    }
    return 0.00;
}

//对后台返回的表格数据进行包装，方便datatables插件进行调用
function _packagingTableData(tableData){

    //定义新生产的table数组
    var newTableArr = [];

    //获取到名称数组
    var titleArr = tableData.columns;

    //获取数据数组
    var dataArr = tableData.data;

    //遍历数据数组
    $(dataArr).each(function(i,o){

        //定义新的对象
        var obj = {};

        //取出每行的数据
        var lineArr = o;

        $(lineArr).each(function(i,o){

            obj[titleArr[i]] = o;
        });

        //把对象放入到新的数组中
        newTableArr.push(obj);
    });

    return newTableArr;
};


//ajax发送数据之前的方法
function _beforeSendFun(){

    $('#theLoading').modal('hide');

    $('#theLoading').modal('show');

}

//ajax发送数据完成的方法
function _completeFun(){

    $('#theLoading').modal('hide');

    if($('.modal-backdrop').length > 0){

        $('div').remove('.modal-backdrop');

        $('#theLoading').hide();
    }

}

//失败方法
function _errorFun(XMLHttpRequest, textStatus, errorThrown){

    $('#theLoading').modal('hide');

    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

        _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

    }else{

        _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

    }

}

//失败方法2
function _errorFun1(XMLHttpRequest, textStatus, errorThrown){

    $('#theLoading').modal('hide');

    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

        console.log('请求超时')

    }else{

        console.log('请求失败')

    }

}

//ajaxerror方法
function _mainAjaxFun(type,url,prm,successFun){

    $.ajax(
        {

        //发送方式
        type:type,

        //url
        url:_urls + url,

        //timeout
        timeout:_theTimes,

        //参数
        data:prm,

        //发送数据之前
        beforeSend:_beforeSendFun,

        //发送数据完成之后
        complete:_completeFun,

        //成功
        success:successFun,

        //失败
        error: _errorFun

    })

}

//打印插件初始化
function _printFun(table){

    table.print({
        //Use Global styles
        globalStyles : false,
        //Add link with attrbute media=print
        mediaPrint : true,
        //Custom stylesheet
        stylesheet : "http://fonts.googleapis.com/css?family=Inconsolata",
        //Print in a hidden iframe
        iframe : false,
        //Don't print this
        noPrintSelector : ".avoid-this",
        //Add this at top
        prepend : "Hello World!!!<br/>",
        //Add this on bottom
        append : "<br/>Buh Bye!",
        //Log to console when printing is done via a deffered callback
        deferred: $.Deferred().done(function() { console.log('Printing done', arguments); })
    });

}

//----------------------------------获取配置的能耗数据中信息---------------------------------//
//根据能耗分项ID获取能耗名称
function _getEcName(etid){

    var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));

    if(jsonText){
        for(var i=0;i<jsonText.alltypes.length;i++){
            if(etid == jsonText.alltypes[i].etid){

                return jsonText.alltypes[i].etname;
            }
        }

    }
};

//根据能耗分项ID获取能耗单位
function _getEcUnit(etid){

    var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));

    if(jsonText){
        for(var i=0;i<jsonText.alltypes.length;i++){
            if(etid == jsonText.alltypes[i].etid){

                return jsonText.alltypes[i].etunit;
            }
        }
    }
};

//隐藏table中带建筑面积 空调面积的项
function hiddenAreaTh(nameArr){

    //获取当前页面中th长度
    var thLength = $('table').find('th').length;
//console.log(thLength);

    for(var i=0; i<thLength; i++){

        var dom = $('th').eq(i);

        //获取当前内容
        var name = dom.html();

        $(nameArr).each(function(k,o){

            if(name.indexOf(o) > -1){

                dom.addClass('hidden-it');

                dom.next().addClass('hidden-it1');

                return false;
            }

        })

    }

    $('.hidden-it').css({

        'color':'#E2E9F2 !important'
    });

    $('.hidden-it1').css({

        'color':'#ffffff !important'
    });

}

//顶置提示(红色提示条)
function _topTipBar(str){

    $('#tip').find('span').remove();

    $('#tip').find('i').after('<span style="margin-left: 20px;">' + str + '</span>');

    $('#tip').show();

}

//红色提示框的成功方法（顶置）
function _successTopBar(data,attr,fun){

    var arr = [];

    if(data == 0){

        $('#tip').hide();

        arr = attr;

    }else if(data == -2){

        _topTipBar('暂无数据!');

    }else if(data == -1){

        _topTipBar('异常错误!');

    }else if(data == -3){

        _topTipBar('参数错误!');

    }else if(data == -4){

        _topTipBar('内容已存在!');

    }else if(data == -6){

        _topTipBar('没有权限!');

    }

    fun(arr);

}

//模态框中红色提示框
function _modalTipBar(el,str){

    el.children().find('span').remove();

    el.children().find('i').after('<span style="margin:0 20px;">' + str + '</span>');

    el.children().show();

}

//红色提示框的成功方法(模态框)
function _successBar(el,data,fun){

    if(data == 0){

        fun();

    }else if(data == -2){

        _modalTipBar(el,'暂无数据!');

    }else if(data == -1){

        _modalTipBar(el,'异常错误!');

    }else if(data == -3){

        _modalTipBar(el,'参数错误!');

    }else if(data == -4){

        _modalTipBar(el,'内容已存在!');

    }else if(data == -6){

        _modalTipBar(el,'没有权限!');

    }

}

function _errorBarModal(XMLHttpRequest, textStatus, errorThrown){

    $('#theLoading').modal('hide');

    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

        _modalTipBar('请求超时!');

    }else{

        _modalTipBar('请求失败!');

    }

}

function _errorBar(XMLHttpRequest, textStatus, errorThrown){

    $('#theLoading').modal('hide');

    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

        _topTipBar('请求超时!');

    }else{

        _topTipBar('请求失败!');

    }

}

//时间比大小,st<et返回真
function _timeCompare(st,et){

    var stValue = st;

    stValue = stValue.replace(/-/g,"/");

    var etValue = et;

    etValue = etValue.replace(/-/g,"/");

    var stNum = new Date(Date.parse(stValue));

    var etNum = new Date(Date.parse(etValue));

    //结束时间必须大于结束时间
    if(stNum < etNum){

        return true;

    }else{

        return false;

    }

}

$(function(){

    //模态框中的提示关闭按钮
    $('#tip-error-modal').on('click','.close',function(){

        $('#tip-error-modal').hide();

    })

    //普通提示关闭
    $('#tip').on('click','.close',function(){

        $('#tip').hide();

    })

    //如果模态框中的input聚焦的话，提示框消失
    $('.modal-dialog').on('click','.modal-body',function(){

        $('.modal-dialog').find('.btn-primary').prev().children().hide();

    })


})

