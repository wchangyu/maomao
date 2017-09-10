$(function(){
    //根据传过来的值，分解信息字符串
    var _prm = '?orderNum=0101-003&startTime=2017-01-01&endTime=2017-09-09';

    var itemNum = _prm.split('&')[0].split('=')[1];

    var startTime =  _prm.split('&')[1].split('=')[1];

    var endTime = _prm.split('&')[2].split('=')[1];
    /*----------------------------------------表格---------------------------------------*/

    $('.main-contents-table .table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            //"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
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
        "columns": [
            {
                title:'物品序列号',
                data:'sn'
            },
            {
                name: 'second',
                title:'物品编号',
                data:'itemNum'
            },
            {
                title:'物品名称',
                data:'itemName'
            },
            {
                title:'数量',
                data:'num'
            },
            {
                title:'单价',
                data:'price',
                render:function(data, type, full, meta){
                    if(data){
                        return data.toFixed(2)
                    }else{
                        return ''
                    }

                }
            },
            {
                title:'金额',
                data:'amount',
                render:function(data, type, full, meta){
                    if(data){
                        return data.toFixed(2)
                    }else{
                        return ''
                    }
                }
            },
            {
                title:'仓库',
                data:'storageName'
            },
            {
                title:'台账类型',
                data:'ivtType'
            },
            {
                title:'关联单号',
                data:'orderNum',
                render:function(data, type, full, meta){
                    if(full.ivtType == '入库'){
                        return '<a href="godownEntry.html?orderNum=' + full.orderNum +
                            '" target="_blank">' + full.orderNum + '</a>'
                    }else if(full.ivtType == '出库'){
                        return '<a href="outboundOrder.html?orderNum=' + full.orderNum +
                            '" target="_blank">' + full.orderNum + '</a>'
                    }
                }
            },
            {
                title:'创建时间',
                data:'createTime'
            },
            {
                title:'操作人',
                data:'createUser'
            }
        ],
        "rowsGroup": [
            'second:name',
            0,
            1,
        ],
    });

    var prm = {
        itemNum:itemNum,
        st:startTime,
        et:endTime,
        userID:_userIdNum,
        userName:_userIdName
    };
    $.ajax({
        type:'post',
        url: _urls + 'YWCK/ywCKRptInventory',
        data:prm,
        timeout:_theTimes,
        success:function(result){
            _datasTable($('#scrap-datatables'),result);
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });
})