var dx_chw_index = function () {

    var chart_View_Chw_SSXS_Main = null;

    window.onresize = function () {
        if (chart_View_Chw_SSXS_Main) {
            chart_View_Chw_SSXS_Main.resize();
        }
    };

    //冷冻水系统-输送系数
    var INIT_ITEM_CHW_SSXS = function () {
        $('#span_dxchw_item_ssxs_acv').html(sessionStorage.DxChwAcv);//实际值
        $('#span_dxchw_item_ssxs_std').html(sessionStorage.DxChwStd);//理想值
        //偏差值=(实际值-理想值)/理想值*100
        var ofs = (sessionStorage.DxChwAcv - sessionStorage.DxChwStd) / sessionStorage.DxChwStd * 100;
        $('#span_dxchw_item_ssxs_ofs').html(Math.round(ofs, 2));//偏差值
    }

    //冷冻水系统-供回水温差
    var INIT_ITEM_CHW_GHSWC = function () {
        $('#dxchw_item_ghswc_title').html(sessionStorage.DxChwGHSWCTitle);
        //$('#dxchw_item_ghswc_acv').html(sessionStorage.DxChwGHSWCAcv);
        if (sessionStorage.DxChwGHSWCSte === "1") {
            $('#dxchw_item_ghswc_ste').html();
            $('#dxchw_item_ghswc_ste').html('<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i>');
        }
        else if (sessionStorage.DxChwGHSWCSte === "0") {
            $('#dxchw_item_ghswc_ste').html();
            $('#dxchw_item_ghswc_ste').html('<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i>');
        }
        else {
            $('#dxchw_item_ghswc_ste').html();
            $('#dxchw_item_ghswc_ste').html('<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i>');
        }

    }

    //冷冻水系统-末端压降
    var INIT_ITEM_CHW_MDYC = function () {
        $('#dxchw_item_mdyc_title').html(sessionStorage.DxChwMDYCTitle);
        //$('#dxchw_item_mdyc_acv').html(sessionStorage.DxChwMDYCAcv);
        if (sessionStorage.DxChwMDYCSte === "1") {
            $('#dxchw_item_mdyc_ste').html();
            $('#dxchw_item_mdyc_ste').html('<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i>');
        }
        else if (sessionStorage.DxChwMDYCSte === "0") {
            $('#dxchw_item_mdyc_ste').html();
            $('#dxchw_item_mdyc_ste').html('<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i>');
        }
        else {
            $('#dxchw_item_mdyc_ste').html();
            $('#dxchw_item_mdyc_ste').html('<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i>');
        }

    }

    return {

        init: function () {

            $('#spanDxDT').html(sessionStorage.DxDT);

            //冷冻水系统-输送系数
            INIT_ITEM_CHW_SSXS();

            //冷冻水系统-供回水温差
            INIT_ITEM_CHW_GHSWC();

            //冷冻水系统-末端压降
            INIT_ITEM_CHW_MDYC();

            //var xs = JSON.parse(sessionStorage.DxChwXs);

            //var ys = JSON.parse(sessionStorage.DxChwYs);

            //var srs = [];
            //for (var i = 0; i < ys.length; i++) {
            //    var srob = {};
            //    if (i === 0) {
            //        srob.name = '实际值';
            //    }
            //    else {
            //        srob.name = '理想值';
            //    }
            //    srob.type = 'line';
            //    srob.data = [];
            //    for (var j = 0; j < ys[i].length; j++) {
            //        srob.data.push(ys[i][j]);
            //    }
            //    if (i === 0) {
            //        srob.markPoint = {};
            //        srob.markPoint.data = [];
            //        srob.markPoint.data.push({ type: 'max', name: '最大值' });
            //        srob.markPoint.data.push({ type: 'min', name: '最小值' });
            //    }
            //    srs.push(srob);
            //}

            var dataXY = JSON.parse(sessionStorage.DxChwDs);
            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].x);
                XY.push(dataXY[i].y);
                data.push(XY);
            }

            chart_View_Chw_SSXS_Main = echarts.init(document.getElementById('chart_View_Chw_SSXS_Main'));

            option = {
                tooltip: {
                    trigger: 'axis'
                },
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
                visualMap: {
                    top: 10,
                    right: 10,
                    pieces: [{
                        gt: 0,
                        lte: parseFloat(sessionStorage.DxChwBadStd),
                        color: '#ff9933'
                    }, {
                        gt: parseFloat(sessionStorage.DxChwBadStd),
                        lte: parseFloat(sessionStorage.DxChwWellStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(sessionStorage.DxChwWellStd),
                        color: '#096'
                    }],
                    outOfRange: {
                        color: '#999'
                    }
                },
                series: {
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: parseFloat(sessionStorage.DxCWBadStd)
                        }, {
                            yAxis: parseFloat(sessionStorage.DxCWWellStd)
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
            //        data: xs
            //    },
            //    yAxis: {
            //        type: 'value',
            //        axisLabel: {
            //            formatter: '{value}'
            //        }
            //    },
            //    series: srs
            //};

            chart_View_Chw_SSXS_Main.setOption(option);

        }

    }

}();