$(function(){

    /*---------------------------------------------------表格初始化------------------------------*/

    var col = [

        {
            title:'序号',
            data:''
        },
        {
            title:'设备编号',
            data:''
        },
        {
            title:'设备型号',
            data:''
        },
        {
            title:'品牌',
            data:''
        },
        {
            title:'关键参数',
            data:''
        },
        {
            title:'采购时间',
            data:''
        },
        {
            title:'安装地点',
            data:''
        },
        {
            title:'状态',
            data:''
        },
        {
            title:'关键备件',
            data:''
        },
        {
            title:'供应商',
            data:''
        },
        {
            title:'负责人',
            data:''
        },
        {
            title:'资料链接',
            data:''
        }

    ];

    _tableInit($('#table'),col,1,true,'','','','');

})