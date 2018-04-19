//多区域实时数据
var Monitor = function () {

    //默认区域是东冷站
    var area = 60;

    var oTable = null;

    //获取区域数据
    //获取区域数据
    var getAreaAys = function () {
        var url = sessionStorage.apiUrlPrefix + "MultiAreaHistory/GetChillAREAs";

        $.get(url, function (res) {

            chArAy = res;
            //初始化区域选择控件
            initAreaSelectCtrl();
        })
    }

    //初始化区域选择控件
    var initAreaSelectCtrl = function () {
        $('#areaType').html();
        $('#areaType').find('option').remove();
        $('#areaType').empty();

        var str = '';

        if (chArAy.length > 0) {
            for (var i = 0; i < chArAy.length; i++) {

                var charK = chArAy[i].item;

                var charV = chArAy[i].name;

                var charT = chArAy[i].tag;

                //$('#areaType').append($("<option value=\"" + charK + "\">" + charV + "</option>"));

                str += '<option data-area="' + charT + '" value="' + charK +'">' + charV + '</option>';

                $('#select-station').empty().append(str);


            }
        }
    }

    var getMoDs = function () {
        jQuery('#IsBusy').showLoading();
        var url = sessionStorage.apiUrlPrefix + "MultiAreaMonitor/GetMultiAreaMonitorDs";
        $.post(url, {
            sSearch: sessionStorage.PointerID,
            sSearch_1:area
        }, function (res) {
            var dataArr = [];
            dataArr = res.aaData;
            if (oTable === null) {
                oTable = $("#table").dataTable({
                    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
                    "paging": true,   //是否分页
                    "destroy": true,//还原初始化了的datatable
                    "searching": false,
                    "ordering": false,
                    "bFilter": false,
                    "pagingType": "full_numbers",
                    "bPaginate": true, //翻页功能
                    //"bStateSave":true,
                    //"dom":'rt<"bottom"flpi><"clear">',
                    "bSort": false,
                    "bProcessing": false,
                    "iDisplayLength": 18,//默认每页显示的条数,
                    'language': {
                        'emptyTable': '没有数据',
                        'loadingRecords': '加载中...',
                        'processing': '查询中...',
                        'lengthMenu': '每页 _MENU_ 条',
                        'zeroRecords': '没有数据',
                        'info': '共 _TOTAL_ 条记录，共_PAGES_页',
                        'infoEmpty': '没有数据',
                        'paginate': {
                            "previous": "<",
                            "next": ">",
                            "first": "",
                            "last": ""
                        }
                    },
                    "aoColumns": [, , , , ]
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

            //获取区域
            getAreaAys();

            var pos = JSON.parse(sessionStorage.pointers);
            var po = pos[0];
            sessionStorage.PointerID = po.pointerID;
            sessionStorage.PointerName = po.pointerName;
            sessionStorage.EprID = po.enterpriseID;
            sessionStorage.EprName = po.eprName;
            //$('.areabtn').on('click', function () {
            //
            //    //area = $(this).attr('data-area');
            //
            //    getMoDs();
            //})

            $('#areabtn').click(function(){

                //获取区域
                area = $('#select-station').val();

                getMoDs();


            })
            //查询实时数据
            getMoDs()
        }
    }


}();