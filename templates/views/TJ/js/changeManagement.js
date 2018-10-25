$(function(){

    //默认时间
    //设置初始时间
    var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');

    var _initEnd = moment().format('YYYY/MM/DD');

    //显示时间
    $('.min').val(_initStart);

    $('.max').val(_initEnd);

    /*---------------------------表格初始化----------------------------*/

    var col = [
        {
            title:'单号',
            data:'orderNum',
            className:'orderNum'
        },
        {
            title:'发起人',
            data:'inType'

        },
        {
            title:'供货方名称',
            data:'supName'
        },
        {
            title:'仓库',
            data:'storageName'
        },
        {
            title:'创建日期',
            data:'createTime',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data.split(' ')[0]

                }

            }
        },
        {
            title:'审核日期',
            data:'auditTime',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data.split(' ')[0]

                }

            }
        },
        {
            title:'制单人',
            data:'createUserName'
        },
        {
            title:'操作',
            data:'status',
            className:'noprint',
            render:function(data, type, full, meta){
                if(data == 1){
                    return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +

                        "<span class='data-option option-confirmed btn default btn-xs green-stripe'>已审核</span>" +
                        "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
                }if(data == 0){
                    return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                        "<span class='data-option option-confirm btn default btn-xs green-stripe'>待审核</span>" +
                        "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
                }
            }

        }
    ];

    _tableInit($('.rukuTable'),col,'1','flag','','');


})