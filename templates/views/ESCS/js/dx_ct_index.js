var dx_ct_index = function () {

    var chart_View_CT_SSXS_Main = null;

    window.onresize = function () {
        if (chart_View_CT_SSXS_Main) {
            chart_View_CT_SSXS_Main.resize();
        }
    };

    //冷却塔自身效率
    var INIT_ITEM_ZSXL = function () {
        $('#dxct_item_zsxl_title').html();
        $('#dxct_item_zsxl_title').html(sessionStorage.DxCTXLTitle);
        //$('#dxct_item_zsxl_acv').html();
        //$('#dxct_item_zsxl_acv').html(sessionStorage.DxCTXLAcv);
        if (sessionStorage.DxCTXLSte === "1") {
            $('#dxct_item_zsxl_ste').html();
            $('#dxct_item_zsxl_ste').html('<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i>');
        }
        else if (sessionStorage.DxCTXLSte === "0") {
            $('#dxct_item_zsxl_ste').html();
            $('#dxct_item_zsxl_ste').html('<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i>');
        }
        else {
            $('#dxct_item_zsxl_ste').html();
            $('#dxct_item_zsxl_ste').html('<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i>');
        }

    }

    //冷却塔输送系数
    function INIT_ITEM_SSXS() {
        $('#span_dxct_item_ssxs_acv').html();
        $('#span_dxct_item_ssxs_acv').html(sessionStorage.DxCTAcv);//实际值
        $('#span_dxct_item_ssxs_std').html();
        $('#span_dxct_item_ssxs_std').html(sessionStorage.DxCTStd);//理想值
        //偏差值=(实际值-理想值)/理想值*100
        var ofs = (sessionStorage.DxCTAcv - sessionStorage.DxCTStd) / sessionStorage.DxCTStd * 100;
        $('#span_dxct_item_ssxs_ofs').html(Math.round(ofs, 2));//偏差值
    }

    return {

        init: function () {

            $('#spanDxDT').html(sessionStorage.DxDT);

            //冷却塔输送系数
            INIT_ITEM_SSXS();

            //冷却塔自身效率
            INIT_ITEM_ZSXL();

            //var xs = JSON.parse(sessionStorage.DxCTXs);

            //var ys = JSON.parse(sessionStorage.DxCTYs);

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

            var dataXY = JSON.parse(sessionStorage.DxCTDs);
            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].X);
                XY.push(dataXY[i].Y);
                data.push(XY);
            }

            chart_View_CT_SSXS_Main = echarts.init(document.getElementById('chart_View_CT_SSXS_Main'));

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
                        lte: parseFloat(sessionStorage.DxCTBadStd),
                        color: '#ff9933'
                    }, {
                        gt: parseFloat(sessionStorage.DxCTBadStd),
                        lte: parseFloat(sessionStorage.DxCTWellStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(sessionStorage.DxCTWellStd),
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
                            yAxis: parseFloat(sessionStorage.DxCTBadStd)
                        }, {
                            yAxis: parseFloat(sessionStorage.DxCTWellStd)
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

            chart_View_CT_SSXS_Main.setOption(option);

        }

    }

}();