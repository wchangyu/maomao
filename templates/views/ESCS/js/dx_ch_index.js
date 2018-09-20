var dx_ch_index = function () {

    var chart_View_Cooler_NX_Main = null;

    var oTable = null;

    window.onresize = function () {
        if (chart_View_Cooler_NX_Main) {
            chart_View_Cooler_NX_Main.resize();
        }
    };

    //综合冷机效率
    var INIT_CHILLER_COP = function () {
        $('#spanDxDT').html(sessionStorage.DxDT);

        $('#span_dxch_item_cop_acv').html(sessionStorage.DxChAcv);//实际值
        $('#span_dxch_item_cop_std').html(sessionStorage.DxChStd);//理想值
        //偏差值=(实际值-理想值)/理想值*100
        var ofs = (sessionStorage.DxChAcv - sessionStorage.DxChStd) / sessionStorage.DxChStd * 100;
        $('#span_dxch_item_cop_ofs').html(Math.round(ofs, 2));//偏差值
    }

    //冷冻出水温度
    var INIT_ITEM_LDCSW = function () {
        $('#dxch_item_csw_title').html();
        $('#dxch_item_csw_title').html(sessionStorage.DxChChwCSWTitle);

        console.log(sessionStorage.DxChChwCSWSte);

        //$('#dxch_item_csw_acv').html();
        //$('#dxch_item_csw_acv').html(sessionStorage.DxChChwCSWAcv);
        if (sessionStorage.DxChChwCSWSte === "1") {
            $('#dxch_item_csw_ste').html();
            $('#dxch_item_csw_ste').html('<i class="fa fa-roll-green" style="margin-left:2px;"></i>');
        }
        else {
            $('#dxch_item_csw_ste').html();
            $('#dxch_item_csw_ste').html('<i class="fa fa-roll-red" style="margin-left:2px;"></i>');
        }
    }

    //冷却回水温度
    var INIT_ITEM_LQHSW = function () {
        $('#dxch_item_hsw_title').html();
        $('#dxch_item_hsw_title').html(sessionStorage.DxChCWHSWTitle);
        //$('#dxch_item_hsw_acv').html();
        //$('#dxch_item_hsw_acv').html(sessionStorage.DxChCWHSWAcv);
        if (sessionStorage.DxChCWHSWSte === "1") {
            $('#dxch_item_hsw_ste').html();
            $('#dxch_item_hsw_ste').html('<i class="fa fa-roll-green" style="margin-left:2px;"></i>');
        }
        else {
            $('#dxch_item_hsw_ste').html();
            $('#dxch_item_hsw_ste').html('<i class="fa fa-roll-red" style="margin-left:2px;"></i>');
        }
    }

    //冷机系统负荷率
    var INIT_ITEM_FHL = function () {
        $('#dxch_item_FHL_title').html();
        $('#dxch_item_FHL_title').html(sessionStorage.DxChFHLTitle);
        if (sessionStorage.DxChFHLSte === "1") {
            $('#dxch_item_FHL_ste').html();
            $('#dxch_item_FHL_ste').html('<i class="fa fa-roll-green" style="margin-left:2px;"></i>');
        }
        else {
            $('#dxch_item_FHL_ste').html();
            $('#dxch_item_FHL_ste').html('<i class="fa fa-roll-red" style="margin-left:2px;"></i>');
        }
    }

    //单台冷机效率诊断
    var INIT_ITEM_CHSGL = function () {
        if (oTable == null) {

            oTable = $("#chsglTable").DataTable({
                "iDisplayLength": 20,
                "bFilter": false,
                "bLengthChange": false,
                "autoWidth": false,  //用来启用或禁用自动列的宽度计算
                "paging": true,
                "searching": false,
                "ordering": false,
                "bPaginate": true, //翻页功能
                "bProcessing": true,
                "bSort": false,
                //"sPaginationType": "bootstrap",
                "destroy": true,//还原初始化了的datatable
                "oLanguage": {
                    "sLengthMenu": "每页显示 _MENU_ 条记录",
                    "sZeroRecords": "没有任何冷机诊断数据",
                    "sEmptyTable": "没有任何冷机诊断数据",
                    "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                    "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
                    "sInfoEmpty": "",
                    "sSearch": "搜索",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上一页",
                        "sNext": "下一页",
                        "sLast": "末页"
                    },
                },
                aoColumnDefs: [
                    {
                        "aTargets": [0], "mRender": function (data, type, full) {//状态
                            return data === "1"
                                ? '<i class="fa fa-roll-green" style="margin-left:2px;"></i>'
                                : '<i class="fa fa-roll-red" style="margin-left:2px;"></i>';
                        }
                    },
                    {
                        "aTargets": [1], "mRender": function (data, type, full) {//名称

                            var chillerSGLID = full[5];

                            //var url = sessionStorage.apiUrlPrefix + "DxCoolerSGL/Index?DxChSGLID=" + chillerSGLID;
                            //var url = "DxCoolerSGL/Index?DxChSGLID=" + chillerSGLID;

                            var url = 'dx_ch_sgl_index.html?DxChSGLID=' + chillerSGLID;

                            return '<a href="' + url + '">' + data + '诊断' + '</a>';
                        }
                    },
                    {
                        "aTargets": [2], "mRender": function (data, type, full) {//优良值
                            return data;
                        }
                    },
                    {
                        "aTargets": [3], "mRender": function (data, type, full) {//告警值
                            return data;
                        }
                    },
                    {
                        "aTargets": [4], "mRender": function (data, type, full) {//单位
                            return data;
                        }
                    }
                ]
            });
        }
        var chsgls = JSON.parse(sessionStorage.DxChSGLs);
        var chsglAry = [];
        for (var i = 0; i < chsgls.length; i++) {
            var ary = [];
            ary.push(chsgls[i].dxChSGLSte);
            ary.push(chsgls[i].dxChSGLNt);
            ary.push(chsgls[i].dxChSGLWellStd);
            ary.push(chsgls[i].dxChSGLBadStd);
            ary.push('');
            ary.push(chsgls[i].dxChSGLID);
            chsglAry.push(ary);
        }
        //清空一下table
        oTable = $("#chsglTable").dataTable();

        oTable.fnClearTable();
        //想表格中添加东西数据o
        if (chsglAry.length > 0) {
            oTable.fnAddData(chsglAry);
        }
        //重绘表格
        oTable.fnDraw();
        $('#chsglTable_info').hide();
        $('.dataTables_paginate').hide();
    }

    return {

        init: function () {


            if (sessionStorage.DxChSGLs != undefined && sessionStorage.DxChSGLs.length > 0) {
                //单台冷机效率诊断
                INIT_ITEM_CHSGL();
            }
            else {
                $('#panrlchsgl').hide();
            }

            //综合冷机效率
            INIT_CHILLER_COP();

            //冷机系统负荷率
            INIT_ITEM_FHL();

            //冷冻出水温度
            INIT_ITEM_LDCSW();

            //冷却回水温度
            INIT_ITEM_LQHSW();


            //var copXs = JSON.parse(sessionStorage.DxChXs);

            //var copYs = JSON.parse(sessionStorage.DxChYs);

            //var srs = [];
            //for (var i = 0; i < copYs.length; i++) {
            //    var srob = {};
            //    if (i === 0) {
            //        srob.name = '实际值';
            //    }
            //    else {
            //        srob.name = '理想值';
            //    }
            //    srob.type = 'line';
            //    srob.data = [];
            //    for (var j = 0; j < copYs[i].length; j++) {
            //        srob.data.push(copYs[i][j]);
            //    }
            //    if (i === 0) {
            //        srob.markPoint = {};
            //        srob.markPoint.data = [];
            //        srob.markPoint.data.push({ type: 'max', name: '最大值' });
            //        srob.markPoint.data.push({ type: 'min', name: '最小值' });
            //    }
            //    srs.push(srob);
            //}

            var dataXY = JSON.parse(sessionStorage.DxChDs);

            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].x);
                XY.push(dataXY[i].y);
                data.push(XY);
            }

            chart_View_Cooler_NX_Main = echarts.init(document.getElementById('chart_View_Cooler_NX_Main'));

            option = {
                tooltip: {
                    trigger: 'axis'
                },
                //legend:{
                //
                //    //orient:'horizontal'
                //
                //    show:false
                //
                //},
                xAxis: {
                    axisLabel: {
                        rotate: 15,
                        margin: 20
                    },
                    data: data.map(function (item) {
                        return item[0];
                    })
                },
                yAxis: {
                    splitLine: {
                        show: true
                    }
                },
                //toolbox: {
                //    left: 'center',
                //    feature: {
                //        dataZoom: {
                //            yAxisIndex: 'none'
                //        },
                //        restore: {},
                //        saveAsImage: {}
                //    }
                //},
                //dataZoom: [{
                //    startValue: '00:00'
                //}, {
                //    type: 'inside'
                //}],
                //0~80 80~150 150~
                visualMap: {
                    top: 10,
                    right: 10,
                    pieces: [{
                        gt: 0,
                        lte: parseFloat(sessionStorage.DxChBadStd),
                        color: '#ff9933'
                    }, {
                        gt: parseFloat(sessionStorage.DxChBadStd),
                        lte: parseFloat(sessionStorage.DxChWellStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(sessionStorage.DxChWellStd),
                        color: '#096'
                    }],
                    outOfRange: {
                        color: '#999'
                    },
                    orient:"horizontal"
                },
                series: {
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: parseFloat(sessionStorage.DxChBadStd)
                        }, {
                            yAxis: parseFloat(sessionStorage.DxChWellStd)
                        }]
                    }
                }
            }

            //option = {
            //    title: {
            //        subtext: '单位:kWh冷/kWh电'
            //    },
            //    tooltip: {
            //        trigger: 'axis'
            //    },
            //    legend: {
            //        data: ['实际值', '理想值']
            //    },
            //    xAxis: {
            //        type: 'category',
            //        boundaryGap: false,
            //        data: copXs
            //    },
            //    yAxis: {
            //        type: 'value',
            //        axisLabel: {
            //            formatter: '{value}'
            //        }
            //    },
            //    series: srs
            //};

            chart_View_Cooler_NX_Main.setOption(option);


        }

    }

}();