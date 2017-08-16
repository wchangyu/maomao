/**
 * Created by admin on 2017/7/6.
 */


/*获取当前屏幕宽度*/
function getWidths() {
    if (window.innerWidth) {
        winWidth = window.innerWidth;
    } else if ((document.body) && (document.body.clientWidth)) {
        winWidth = document.body.clientWidth;
    }
}

window.onload = function () {
    var div_row_width = $('.build-info-main').width() + "px";
    $('#groupChartMain').css({ width: div_row_width, height: '768px' });
    $('#codeChartMain').css({ width: div_row_width, height: '768px' });
    $('.row_main_allcode_chart').css({ width: div_row_width, height: '350px' });
    if (myAllCCodeVs != null) {
        if (myAllCCodeVs.length > 0) {
            for (var i = 0; i < myAllCCodeVs.length; i++) {
                var MyAllCCodeV = myAllCCodeVs[i];
                if (MyAllCCodeV)
                    MyAllCCodeV.resize();
            }
        }
    }
    if (MyGroupCCodeV) {
        MyGroupCCodeV.resize();
    }
    if (MySlgCCodeV) {
        MySlgCCodeV.resize();
    }
    getWidths();
    if (winWidth <= 1024) {
        $('.hsy-left').css({ 'margin-right': 0 });
        $('.hsy-left').addClass('col-sm-12 col-xs-12');
        $('.where-right').css({ 'width': '100%', 'position': 'static', 'right': '', 'top': '' })
        $('.where-right').addClass('col-sm-12 col-xs-12');
        $('.row_main_left').css({ 'float': 'left' });
        $('.row_main_right').css({ 'float': 'right' });
        $('.count-info').css({ "height": "500px" });
    } else {
        $('.hsy-left').css({ 'margin-right': 275 });
        $('.hsy-left').removeClass('col-sm-12 col-xs-12');
        $('.where-right').css({ 'width': '250px', 'position': 'absolute', 'right': '20px', 'top': '0' })
        $('.where-right').removeClass('col-sm-12 col-xs-12');
        $('.row_main_left').css({ 'float': 'left' });
        $('.row_main_right').css({ 'float': 'right' });
    }
};

window.onresize = function () {
        var wh = $(window).height() - 46 - 54;
        $('#hsyTV').css({ "height": wh });
        var div_row_width = $('.build-info-main').width() + "px";
        $('#groupChartMain').css({ width: div_row_width, height: '768px' });
        $('#codeChartMain').css({ width: div_row_width, height: '768px' });
        $('.row_main_allcode_chart').css({ width: div_row_width, height: '350px' });
        if (myAllCCodeVs.length > 0) {
            for (var i = 0; i < myAllCCodeVs.length; i++) {
                var MyAllCCodeV = myAllCCodeVs[i];
                if (MyAllCCodeV)
                    MyAllCCodeV.resize();
            }
        }
        if (MyGroupCCodeV) {
            MyGroupCCodeV.resize();
        }
        if (MySlgCCodeV) {
            MySlgCCodeV.resize();
        }
        var rowmainwidth = $('#row_main').width();
        var realitywidth = $('.row_main_left').width() + $('.row_main_right').width();
        if (rowmainwidth < realitywidth) {
            $('.row_main_left').css({ "float": "none" });
            $('.row_main_right').css({ "float": "none" });
        }
        else {
            $('.row_main_left').css({ "float": "left" });
            $('.row_main_right').css({ "float": "right" });
        }
        getWidths();
        if (winWidth <= 1024) {
            $('.hsy-left').css({ 'margin-right': 0 });
            $('.hsy-left').addClass('col-sm-12 col-xs-12');
            $('.where-right').css({ 'width': '100%', 'position': 'static', 'right': '', 'top': '' })
            $('.where-right').addClass('col-sm-12 col-xs-12');
            $('.row_main_left').css({ 'float': 'left' });
            $('.row_main_right').css({ 'float': 'right' });
        } else {
            $('.hsy-left').css({ 'margin-right': 275 });
            $('.hsy-left').removeClass('col-sm-12 col-xs-12');
            $('.where-right').css({ 'width': '250px', 'position': 'absolute', 'right': '20px', 'top': '0' })
            $('.where-right').removeClass('col-sm-12 col-xs-12');
            $('.row_main_left').css({ 'float': 'left' });
            $('.row_main_right').css({ 'float': 'right' });
        }
    }

//颜色配置
//var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#7fb1b7', '#d6876b', '#95c9b1', '#8eb09a', '#d39c4c', '#ca8622', '#293c55', '#3fa7dc', '#0094ff'];
var chooseEprIds = [];/*选中的企业列表*/
var chooseEprNTs = [];
var chooseEprId = "";/*(选择企业)左边*/
var chooseEprNT = "";
var chooseEprId_right = "";/*(选择企业)右边*/
var chooseEprNT_right = "";
var pointerId = "";/*选中的楼宇*/
var screenWidth; /*当前屏幕宽度*/
var MyGroupCCodeV;/*组合监测因子图表*/
var MySlgCCodeV;/*单个监测因子图表*/
var sourceDs = null;//数据源(原始数据，不包括折算数据)
var sgl_Table = null;//单个监测因子图表
var history_Table = null;//所有监测因子图表
var myAllCCodeVs = [];//全部监测因子图表列表
$(document).ready(function () {
    /*查询历史数据*/
    $('#hsyBtn').click(function () {
        OnAsyncHistoryDs();
    });
    /*初始化时间段*/
    InitDT(new Date());
    /*初始化TREEVIEW*/
    InitTreeViewDs();
    /*选择CCode事件(查看单因子的数据和Chart图)*/
    $('#CCodeClass').change(function (e) {
        var opts = $('#CCodeClass>option');
        if (opts != null) {
            if (opts.length > 1) {
                var CUnit = $(this).children('option:selected').val();
                var CodeNT = $(this).children('option:selected').html();
                $('#spanTitle_C').html(CodeNT);
                /*索引*/
                var idx = $("#CCodeClass").get(0).selectedIndex;
                if (idx === 0) {
                    InitPageSet();
                }
                else {
                    InitSglCodePageSet();
                    //获取数据(单监测因子)
                    var sgldsArr = [];
                    if (sourceDs != null) {
                        if (sourceDs.length > 0) {
                            for (var i = 0; i < sourceDs.length; i++) {
                                var obj = []; //时间 数据 单位 标准
                                obj.push(sourceDs[i].DataDateStr);//时间
                                obj.push(sourceDs[i].Datas[idx - 1]);//各个监测点数据
                                obj.push(CUnit);
                                obj.push(sourceDs[i].StdDatas[idx - 1]);//各个监测点对应的标准区间数据
                                sgldsArr.push(obj);
                            }
                        }
                    }
                    if (sgl_Table == null) {
                        sgl_Table = $('#historycodeTable').dataTable({
                            "iDisplayLength": 20,
                            "bFilter": false,
                            "bLengthChange": false,
                            "autoWidth": true,  //用来启用或禁用自动列的宽度计算
                            "paging": false,   //是否分页
                            "searching": false,
                            "paging": true,
                            "searching": false,
                            "ordering": false,
                            "bPaginate": true, //翻页功能
                            "bSort": false,
                            "bProcessing": false,
                            "destroy": false,
                            "oLanguage": {
                                "sLengthMenu": "每页显示 _MENU_ 条记录",
                                "sZeroRecords": "没有任何历史数据",
                                "sEmptyTable": "没有任何历史数据",
                                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                                "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
                                "sInfoEmpty": "",
                                "sSearch": "搜索",
                                "oPaginate": {
                                    "sFirst": "首页",
                                    "sPrevious": "上一页",
                                    "sNext": "下一页",
                                    "sLast": "末页"
                                }
                            },
                            "aoColumns": [, {
                                "mRender": function (data, type, oObj) {
                                    var stdstr = oObj[3];
                                    var strAry = stdstr.split(',');
                                    var minV = strAry[0];
                                    var maxV = strAry[1];
                                    if (minV.length > 0 && maxV.length > 0) {
                                        if (parseFloat(data) < parseFloat(minV) || parseFloat(data) > parseFloat(maxV)) {
                                            return "<span style='color:#f00;'>" + data + "</span>"
                                        }
                                        else {
                                            return data;
                                        }
                                    }
                                    else {
                                        return data;
                                    }
                                }
                            }, , {
                                "mRender": function (data, type, oObj) {
                                    var stdstr = oObj[3];
                                    var strAry = stdstr.split(',');
                                    var minV = strAry[0];
                                    var maxV = strAry[1];
                                    if (minV.length > 0 && maxV.length > 0) {
                                        var rtnstd = stdstr.replace(',', ' ~ ');
                                        return rtnstd;
                                    }
                                    else {
                                        return "";
                                    }
                                }
                            }]
                        });
                    }
                    sgl_Table.fnClearTable();
                    if (sgldsArr.length > 0) {
                        sgl_Table.fnAddData(sgldsArr);
                    }
                    sgl_Table.fnDraw();
                    var div_row_width = $('.build-info-main').width() + "px";
                    $('#codeChartMain').css({ width: div_row_width, height: '768px' });
                    MySlgCCodeV = echarts.init(document.getElementById('codeChartMain'));
                    var lgs = [];/*图例*/
                    lgs.push(CodeNT);
                    var xs = [];/*x轴、时间轴*/
                    var ys = [];/*y轴*/
                    var objsgl = {};
                    objsgl.name = CodeNT;
                    objsgl.type = "line";
                    objsgl.data = [];
                    if (sourceDs != null) {
                        if (sourceDs.length > 0) {
                            for (var i = 0; i < sourceDs.length; i++) {
                                xs.push(sourceDs[i].DataDateStr);//时间
                                objsgl.data.push(sourceDs[i].Datas[idx - 1]);//Y轴
                            }
                        }
                    }
                    objsgl.label = {};
                    objsgl.label.normal = {};
                    objsgl.label.normal.show = true;
                    objsgl.markPoint = {};
                    objsgl.markPoint.data = [];
                    var maxobj = {};
                    maxobj.type = "max";
                    maxobj.name = "最大值";
                    objsgl.markPoint.data.push(maxobj);
                    var minobj = {};
                    minobj.type = "min";
                    minobj.name = "最小值";
                    objsgl.markPoint.data.push(minobj);
                    ys.push(objsgl);
                    if (sgldsArr.length > 0) {
                        option = {
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: lgs
                            },
                            xAxis: {
                                type: 'category',
                                axisLabel: {
                                    rotate: 10,
                                    margin: 20,
                                    textStyle: {
                                        color: "#222"
                                    }
                                },
                                data: xs
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: ys
                        };
                        MySlgCCodeV.setOption(option);
                    }
                    else {
                        MySlgCCodeV.clear();
                        MySlgCCodeV.dispose();
                    }
                }
            }
        }
    });
});


function nullDsShow() {
    InitPageSet(); /*初始化页面*/
    if (history_Table != null) {
        var table = $('#historyTable').dataTable();
        table.fnClearTable();
    }
    if (myAllCCodeVs.length > 0) {
        for (var i = 0; i < myAllCCodeVs.length; i++) {
            var MyAllCCodeV = myAllCCodeVs[i];
            if (MyAllCCodeV) {
                if (MyAllCCodeV.width != undefined) {
                    MyAllCCodeV.clear();
                    MyAllCCodeV.dispose();
                }
                else {
                    MyAllCCodeV.dispose();
                }
            }
        }
    }
    $('#row_allcodeChart').empty();
    if (MyGroupCCodeV) {
        if (MyGroupCCodeV.width != undefined) {
            MyGroupCCodeV.clear();
            MyGroupCCodeV.dispose();
        }
        else {
            MyGroupCCodeV.dispose();
        }
    }
    $('#CCodeClass').empty();
    $('#CCodeClass').append($("<option value=\"" + 0 + "\">" + "" + "全部因子" + "</option>"))
}

function addSourceArrToHistoryTable(colNTs, sourceArr) {
    /*清空原表控件*/
    if (history_Table) {
        history_Table.destroy();
    }
    /*重新绘制列头*/
    drawHistoryTableTitle(colNTs);
    var idxV = 1;/*监测因子索引*/
    var idxStV = 0;/*监测因子对应的标准索引*/
    var W = $('.build-info-main').width();
    /*重新绘制Table*/
    history_Table = $('#historyTable').DataTable({
        "bFilter": false,
        "bLengthChange": false,
        "autoWidth": true,  //用来启用或禁用自动列的宽度计算
        "searching": false,
        "ordering": true,
        "bPaginate": false, //翻页功能
        "bSort": true,
        "bProcessing": false,
        "scrollY": "700px",
        "sScrollX": W,
        "scrollCollapse": true,
        "sScrollXInner": "100%",
        "paging": false,
        "destroy": false,
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "没有任何历史数据",
            "sEmptyTable": "没有任何历史数据",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
            "sInfoEmpty": "",
            "sSearch": "搜索",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "末页"
            }
        },
        aoColumnDefs: [
            {
                "aTargets": [0], "mRender": function (data, type, full) {
                return "<span style='width:130px;'>" + data + "</span>";
            }
            },
            {
                "aTargets": ["_all"], "mRender": function (data, type, full) {
                if (data == null) {
                    return "<span style='color:#f00;'>" + "-" + "</span>"
                }
                else if (data != null) {
                    if (data.length == 0) {
                        return "<span style='color:#f00;'>" + "N/A" + "</span>"
                    }
                    else {
                        return data;
                        //var lgt = full.length - 1;/*除去第一列:时间*/
                        ////下一轮判断开始
                        //if (idxStV >= lgt) {
                        //    idxV = 1;
                        //}
                        ///*将监测因子值和标准区间值对半分割(lgt永远为偶数)*/
                        //var lgtsplit = lgt / 2;
                        //idxStV = idxV + (lgtsplit);
                        //var stdVs = full[idxStV];
                        //if (stdVs != null) {
                        //    var commaAry = stdVs.split(',');
                        //    var minV = commaAry[0];
                        //    var maxV = commaAry[1];
                        //    idxV = idxV + 1;
                        //    if (minV.length > 0 && maxV.length > 0) {
                        //        //监测因子值小于最小阈值 || 监测因子值大于最大阈值
                        //        if (parseFloat(data) < parseFloat(minV) || parseFloat(data) > parseFloat(maxV)) {
                        //            return "<span style='color:#f00;'>" + data + "</span>"
                        //        }
                        //        else {
                        //            return data;
                        //        }
                        //    }
                        //    else {
                        //        return data;
                        //    }
                        //}
                        //else {
                        //    return data;
                        //}
                    }
                }
            }
            }]
    });
    var table = $('#historyTable').dataTable();
    table.fnClearTable();
    if (sourceArr.length > 0) {
        table.fnAddData(sourceArr);
    }
    table.fnDraw();
}

/*绘制表头(全部监测因子)*/
function drawHistoryTableTitle(colNTs) {
    $('#historyTable').empty();
    var theads = $('<thead>');
    var trs = $('<tr>');
    for (var i = 0; i < colNTs.length; i++) {
        if (i === 0) {
            var ths = $('<th style="width:130px;min-width:130px;background-Color:#DDD;font-size:14px;font-weight:400;color:#666;">')
            ths.html(colNTs[i]);
            trs.append(ths);
        }
        else {
            var ths = $('<th style="background-Color:#DDD;font-size:14px;font-weight:400;color:#666;">')
            ths.html(colNTs[i]);
            trs.append(ths);
        }
    }
    theads.append(trs);
    $('#historyTable').append(theads);
}

/*DataTables对应的列头,只允许添加原始监测因子*/
function addCCodeToSelect(ccodes, zccodes, showType) {
    var colNTs = [];
    colNTs.push("时间");
    if (showType === "0")//原始
    {
        if (ccodes != null) {
            if (ccodes.length > 0) {
                $('#CCodeClass').empty();
                $('#CCodeClass').append($("<option value=\"" + 0 + "\">" + "" + "全部因子" + "</option>"))
                for (var i = 0; i < ccodes.length; i++) {
                    //var cK = ccodes[i].CDataID;
                    var cK = ccodes[i].CUnit;
                    var cV = ccodes[i].CName;
                    $('#CCodeClass').append($("<option value=\"" + cK + "\">" + cV + "</option>"));
                    if (ccodes[i].CUnit.trim().length === 0) {
                        colNTs.push(cV);
                    }
                    else {
                        colNTs.push(cV + "(" + ccodes[i].CUnit + ")");
                    }
                    /*将监测因子列表加到groupccodediv中
                     if (i == 0) {
                     var chkbccode = $('<input name="grpc" type="checkbox" value=' + i + ' checked="true" /><span style="margin-left:5px;margin-right:10px;position:relative;top:-2px;">' + ccodes[i].CName + '</span>');
                     $('#groupccodediv').append(chkbccode);
                     }
                     else {
                     var chkbccode = $('<input name="grpc" type="checkbox" value=' + i + '/><span style="margin-left:5px;margin-right:10px;position:relative;top:-2px;">' + ccodes[i].CName + '</span>');
                     $('#groupccodediv').append(chkbccode);
                     }*/
                }
            }
            else {
                $('#CCodeClass').empty();
                $('#CCodeClass').append($("<option value=\"" + 0 + "\">" + "" + "全部因子" + "</option>"));
            }
        }
        else {
            $('#CCodeClass').empty();
            $('#CCodeClass').append($("<option value=\"" + 0 + "\">" + "" + "全部因子" + "</option>"));
        }
    }
    else//包括折算
    {
        if (zccodes != null) {
            if (zccodes.length > 0) {
                $('#CCodeClass').empty();
                $('#CCodeClass').append($("<option value=\"" + 0 + "\">" + "" + "全部因子" + "</option>"));
                for (var i = 0; i < ccodes.length; i++) {
                    var cK = ccodes[i].CUnit;
                    var cV = ccodes[i].CName;
                    $('#CCodeClass').append($("<option value=\"" + cK + "\">" + cV + "</option>"));
                }
                for (var i = 0; i < zccodes.length; i++) {
                    var cK = zccodes[i].CUnit;
                    var cV = zccodes[i].CName;
                    if (cK.trim().length === 0) {
                        colNTs.push(cV);
                    }
                    else {
                        colNTs.push(cV + "(" + cK + ")");
                    }
                }
            }
            else {
                $('#CCodeClass').empty();
                $('#CCodeClass').append($("<option value=\"" + 0 + "\">" + "" + "全部因子" + "</option>"));
            }
        }
        else {
            $('#CCodeClass').empty();
            $('#CCodeClass').append($("<option value=\"" + 0 + "\">" + "" + "全部因子" + "</option>"));
        }
    }
    return colNTs;
}


