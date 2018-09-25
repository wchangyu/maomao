var Monitor = function () {
  
    var oTable=null;

    var col = [

        {
            title:'数据时间',
            data:'time'
        },
        {
            title:'监测设备',
            data:'dev'
        },
        {
            title:'数据',
            data:'data'
        },
        {
            title:'单位',
            data:'unit'
        }

    ]

    _tableInit($("#table"),col,2,false,'','','','',50,'','','暂时没有获取到实时数据');

    var getMonitorDs = function () {
        jQuery('#IsBusy').showLoading();
        var url = sessionStorage.apiUrlPrefix + "Monitor/GetMonitorInstDs";
        $.post(url,{
            sSearch:sessionStorage.PointerID,
            misc:sessionStorage.misc
        },function (res) {

            var dataArr=[];

            if(res.aaData.length>0) {

                //dataArr = res.aaData;

                for(var i=0;i<res.aaData.length;i++){

                    var obj = {};

                    obj.time = res.aaData[i][0];

                    obj.dev = res.aaData[i][1];

                    obj.data = res.aaData[i][2];

                    obj.unit = res.aaData[i][3];

                    dataArr.push(obj);

                }

            }

            //if(oTable===null){
            //
            //    oTable = $("#table").dataTable({
            //        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            //        "paging": true,   //是否分页
            //        "destroy": true,//还原初始化了的datatable
            //        "searching": false,
            //        "ordering": false,
            //        "bFilter": false,
            //        "pagingType":"full_numbers",
            //        "bPaginate": true, //翻页功能
            //        //"bStateSave":true,
            //        "bSort": false,
            //        "bProcessing": false,
            //        "iDisplayLength":20,//默认每页显示的条数,
            //        'language': {
            //            'emptyTable': '没有数据',
            //            'loadingRecords': '加载中...',
            //            'processing': '查询中...',
            //            'lengthMenu': '每页 _MENU_ 条',
            //            'zeroRecords': '没有数据',
            //            'info': '当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录',
            //            'infoEmpty': '没有数据',
            //            'paginate':{
            //                "previous": "上一页",
            //                "next": "下一页",
            //                "first":"首页",
            //                "last":"尾页"
            //            }
            //        },
            //        //"aoColumns": [, , , , ]
            //         "columns":[
            //
            //             {
            //                 title:'数据时间',
            //                 data:'time'
            //             },
            //             {
            //                 title:'监测设备',
            //                 data:'dev'
            //             },
            //             {
            //                 title:'数据',
            //                 data:'data'
            //             },
            //             {
            //                 title:'单位',
            //                 data:'unit'
            //             }
            //
            //             //{
            //             //    title:'对象',
            //             //    data:'',
            //             //    visible:false,
            //             //},{
            //             //    title:'整体值'
            //             //},{
            //             //    title:'平均值'
            //             //},{
            //             //    title:'10%最优平均值'
            //             //},{
            //             //    title:'10%最差平均值'
            //             //}
            //         ]
            //    });
            //    //$('.dataTables_info').hide();
            //    $('#table_length').hide();
            //}
            //清空一下table
            //oTable.fnClearTable();
            //想表格中添加东西数据o
            //oTable.fnAddData(dataArr);
            //重绘表格
            //oTable.fnDraw();

            _datasTable($('#table'),dataArr);

            jQuery('#IsBusy').hideLoading();
        });
    }

    //结算调整弹窗中 生成超额用能通知单
    $('#monitorBtn').on('click',function(){

        _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'无数据，生成失败!', '');

        return false;

        jQuery('#IsBusy').showLoading();

        var url = sessionStorage.apiUrlPrefix + "Monitor/ExportMonitorInstDs";

        $.ajax({
            type: 'get',
            url: url,
            data:{

                sSearch : sessionStorage.PointerID

            },
            success: function (xml,textStatus, xhr) {

                jQuery('#IsBusy').hideLoading();

                var status =  xhr.status;

                if(status == 204){

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'无数据，生成失败!', '');

                    return false;
                };

                window.open(sessionStorage.apiUrlPrefix + "Monitor/ExportMonitorInstDs?sSearch="+ sessionStorage.PointerID);

            },
            error: function(XMLHttpRequest, textStatus, errorThrown){

                jQuery('#IsBusy').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

                }


            }
        });

    });


    return {
        init: function () {
            //查询实时数据
            getMonitorDs()

        }
    }

}();