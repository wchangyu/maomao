var Monitor = function () {
  
    var oTable=null;
    
    var getMonitorDs = function () {
        jQuery('#IsBusy').showLoading();
        var url = sessionStorage.apiUrlPrefix + "Monitor/GetMonitorInstDs";
        $.post(url,{
            sSearch:sessionStorage.PointerID
        },function (res) {
            var dataArr=[];
            dataArr = res.aaData;
            if(oTable===null){
                oTable = $("#table").dataTable({
                    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
                    "paging": true,   //是否分页
                    "destroy": true,//还原初始化了的datatable
                    "searching": false,
                    "ordering": false,
                    "bFilter": false,
                    "pagingType":"full_numbers",
                    "bPaginate": true, //翻页功能
                    //"bStateSave":true,
                    "bSort": false,
                    "bProcessing": false,
                    "iDisplayLength":20,//默认每页显示的条数,
                    //'language': {
                    //    'emptyTable': '没有数据',
                    //    'loadingRecords': '加载中...',
                    //    'processing': '查询中...',
                    //    'lengthMenu': '每页 _MENU_ 条',
                    //    'zeroRecords': '没有数据',
                    //    'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                    //    'infoEmpty': '没有数据',
                    //    'paginate':{
                    //        "previous": "上一页",
                    //        "next": "下一页",
                    //        "first":"首页",
                    //        "last":"尾页"
                    //    }
                    //},
                    "aoColumns": [, , , , ]
                    // "columns":[
                    //     {
                    //         title:'对象',
                    //         data:'',
                    //         visible:false,
                    //     },{
                    //         title:'整体值'
                    //     },{
                    //         title:'平均值'
                    //     },{
                    //         title:'10%最优平均值'
                    //     },{
                    //         title:'10%最差平均值'
                    //     }
                    // ]
                });
                //$('.dataTables_info').hide();
                $('#table_length').hide();
            }
            //清空一下table
            oTable.fnClearTable();
            //想表格中添加东西数据o
            oTable.fnAddData(dataArr);
            //重绘表格
            oTable.fnDraw();
            jQuery('#IsBusy').hideLoading();
        });
    }
    
    return {
        init: function () {
            //查询实时数据
            getMonitorDs()
        }
    }

}();