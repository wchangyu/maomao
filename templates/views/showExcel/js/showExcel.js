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
        'buttons': [

        ],
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

