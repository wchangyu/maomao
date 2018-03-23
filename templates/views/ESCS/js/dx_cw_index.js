
//冷却水输送系数诊断

var dx_cw_index = function () {

    var chart_View_CW_SSXS_Main = null;

    window.onresize = function () {
        if (chart_View_CW_SSXS_Main) {
            chart_View_CW_SSXS_Main.resize();
        }
    };

    //冷却水系统输送系数
    var INIT_ITEM_CW_SSXS = function () {
        $('#span_dxcw_item_ssxs_acv').html();
        $('#span_dxcw_item_ssxs_acv').html(sessionStorage.DxCWAcv);//实际值
        $('#span_dxcw_item_ssxs_std').html();
        $('#span_dxcw_item_ssxs_std').html(sessionStorage.DxCWStd);//理想值
        //偏差值=(实际值-理想值)/理想值*100
        var ofs = (sessionStorage.DxCWAcv - sessionStorage.DxCWStd) / sessionStorage.DxCWStd * 100;
        $('#span_dxcw_item_ssxs_ofs').html(Math.round(ofs, 2));//偏差值
    }

    //冷却水系统供回水温差
    var INIT_ITEM_CW_GHSWC = function () {
        $('#dxcw_item_ghswc_title').html();
        $('#dxcw_item_ghswc_title').html(sessionStorage.DxCWGHSWCTitle);
        //$('#dxcw_item_ghswc_acv').html();
        //$('#dxcw_item_ghswc_acv').html(sessionStorage.DxCWGHSWCAcv);
        if (sessionStorage.DxCWGHSWCSte === "1") {
            $('#dxcw_item_ghswc_ste').html();
            $('#dxcw_item_ghswc_ste').html('<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i>');
        }
        else if (sessionStorage.DxCWGHSWCSte === "0") {
            $('#dxcw_item_ghswc_ste').html();
            $('#dxcw_item_ghswc_ste').html('<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i>');
        }
        else {
            $('#dxcw_item_ghswc_ste').html();
            $('#dxcw_item_ghswc_ste').html('<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i>');
        }

    }


    return {

        init: function () {

            $('#spanDxDT').html(sessionStorage.DxDT);

            //冷却水系统-输送系数
            INIT_ITEM_CW_SSXS();

            //冷却水系统-供回水温差
            INIT_ITEM_CW_GHSWC();

            //var xs = JSON.parse(sessionStorage.DxCWXs);

            //var ys = JSON.parse(sessionStorage.DxCWYs);

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

            var dataXY = JSON.parse(sessionStorage.DxCWDs);
            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].X);
                XY.push(dataXY[i].Y);
                data.push(XY);
            }

            chart_View_CW_SSXS_Main = echarts.init(document.getElementById('chart_View_CW_SSXS_Main'));

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
                        lte: parseFloat(sessionStorage.DxCWBadStd),
                        color: '#ff9933'
                    }, {
                        gt: parseFloat(sessionStorage.DxCWBadStd),
                        lte: parseFloat(sessionStorage.DxCWWellStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(sessionStorage.DxCWWellStd),
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

            chart_View_CW_SSXS_Main.setOption(option);

        }

    }

}();