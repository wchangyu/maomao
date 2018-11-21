/**
 * Created by admin on 2018/11/13.
 */

//日历初始化（日月年）
function _timeYMDComponentsFun11_EN(el){

    el.datepicker('destroy');
    el.datepicker({
        language:  'en',
        todayBtn: 1,
        todayHighlight: true,
        format: 'yyyy-mm-dd',
        forceParse: 0,
        autoclose: 1

    });

}

//（月）
function _monthDate11_EN(el){
    el.datepicker('destroy');
    el.datepicker({
        startView: 1,
        maxViewMode: 2,
        minViewMode:1,
        forceParse: 0,
        autoclose:1,
        format: "yyyy-mm",//选择日期后，文本框显示的日期格式
        language: "en" //汉化
    })
}

//表格初始化
//基本表格初始换(buttons=1按钮显示，其他按钮隐藏,dom是真的时候，不显示分页和翻页,导出列,每页显示列数,最后一个是否分页,无数据提示)；
function _tableInit_EN(tableId,col,buttons,flag,fnRowCallback,drawCallback,domFlag,arr,num,isPaging,headerCallback,noDataTip,footerCallback){

    var buttonVisible = [
        {
            extend: 'excelHtml5',
            text: '导出数据',
            className:'saveAs L-condition-button',
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

    var noDataStr = '没有数据';

    if(noDataTip){

        noDataStr = noDataTip

    }

    var _tables = tableId.DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": isPag,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        "bProcessing":true,
        "iDisplayLength":length,//默认每页显示的条数
        "dom":dom,
        'buttons':buttons,
        "columns": col,
        "fnRowCallback": fnRowCallback,
        "drawCallback":drawCallback,
        "headerCallback":headerCallback,
        "footerCallback":footerCallback
    });

    if(flag){
        _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    }

    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }

}

