var dx_ch_hsw = function () {

    var chart_View_Cooler_HSW_Main = null;

    var chart_View_Ch_HSW_Analysis_Main = null;

    window.onresize = function () {
        if (chart_View_Cooler_HSW_Main) {
            chart_View_Cooler_HSW_Main.resize();
        }
        if (chart_View_Ch_HSW_Analysis_Main) {
            chart_View_Ch_HSW_Analysis_Main.resize();
        }
    };

    var INIT_DX_Ch_HSW_ANALYSIS_CHARTVIEW = function () {
        var br = parseFloat(sessionStorage.DxChCWHSWBadRatio).toFixed(2);//告警值
        var wr = parseFloat(sessionStorage.DxChCWHSWWellRatio).toFixed(2);//正常值
        var or = parseFloat(100 - br - wr).toFixed(2);//一般值
        var dataAys = [];
        dataAys.push({ value: br, name: '告警(' + br + '%)' });
        dataAys.push({ value: wr, name: '良好(' + wr + '%)' });
        dataAys.push({ value: or, name: '一般(' + or + '%)' });
        chart_View_Ch_HSW_Analysis_Main = echarts.init(document.getElementById('chart_View_Ch_HSW_Analysis_Main'));
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name: '统计',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    //data: [
                    //    { value: 20, name: '正常(20%)' },
                    //    { value: 30, name: '一般(30%)' },
                    //    { value: 50, name: '告警(50%)' }
                    //]
                    data: dataAys
                }
            ]
        };
        chart_View_Ch_HSW_Analysis_Main.setOption(option);
    }

    return {

        init: function () {

            $('#spanDxDT').html(sessionStorage.DxDT);

            $('#spanDxTitle').html(sessionStorage.DxChCWHSWTitle);

            if (sessionStorage.DxChCWHSWSte === "0")//异常
            {
                //$('#reasugBox').show();
                $('.boxhgt').show();
                $('#spanDxSte').html('异常');
                $('.ellipse').css('background-color', '#ffc000');
            }
            else {
                //$('#reasugBox').hide();
                $('.boxhgt').hide();
                $('#spanDxSte').html('良好');
                $('.ellipse').css('background-color', '#1caf9a');
            }

            INIT_DX_Ch_HSW_ANALYSIS_CHARTVIEW();

            //$('#span_dxch_item_hsw_std').html(sessionStorage.DxChCWHSWStd);//诊断值

            //$('#span_dxch_item_hsw_acv').html(sessionStorage.DxChCWHSWAcv);//实际值

            //偏差值=(实际值-理想值)/理想值*100
            //var ofs = (sessionStorage.DxChCWHSWAcv - sessionStorage.DxChCWHSWStd) / sessionStorage.DxChCWHSWStd * 100;

            //$('#span_dxch_item_hsw_ofs').html(Math.round(ofs, 2));//偏差值

            //var hswXs = JSON.parse(sessionStorage.DxChCWHSWXs);

            //var hswYs = JSON.parse(sessionStorage.DxChCWHSWYs);

            //var srs = [];
            //for (var i = 0; i < hswYs.length; i++) {
            //    var srob = {};
            //    if (i === 0) {
            //        srob.name = '实际值';
            //    }
            //    else {
            //        srob.name = '理想值';
            //    }
            //    srob.type = 'line';
            //    srob.data = [];
            //    for (var j = 0; j < hswYs[i].length; j++) {
            //        srob.data.push(hswYs[i][j]);
            //    }
            //    srs.push(srob);
            //}


            //(冷机诊断)冷却回水[进水]温度
            var dataXY = JSON.parse(sessionStorage.DxChCWHSWDs);
            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].x);
                XY.push(dataXY[i].y);
                data.push(XY);
            }

            chart_View_Cooler_HSW_Main = echarts.init(document.getElementById('chart_View_Cooler_HSW_Main'));

            option = {
                title: {
                    text: '回水温度'
                },
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
                visualMap: {
                    top: 10,
                    right: 10,
                    pieces: [{
                        gt: 0,
                        lte: parseFloat(sessionStorage.DxChCWHSWWellStd),
                        color: '#096'
                    }, {
                        gt: parseFloat(sessionStorage.DxChCWHSWWellStd),
                        lte: parseFloat(sessionStorage.DxChCWSHWBadStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(sessionStorage.DxChCWSHWBadStd),
                        color: '#ff9933'
                    }],
                    outOfRange: {
                        color: '#999'
                    }
                },
                series: {
                    name: '回水温度',
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: parseFloat(sessionStorage.DxChCWSHWBadStd)
                        }, {
                            yAxis: parseFloat(sessionStorage.DxChCWHSWWellStd)
                        }]
                    }
                }
            }

            //option = {
            //    tooltip: {
            //        trigger: 'axis'
            //    },
            //    legend: {
            //        data: ['实际值', '理想值']
            //    },
            //    xAxis: {
            //        type: 'category',
            //        boundaryGap: false,
            //        data: hswXs
            //    },
            //    yAxis: {
            //        type: 'value',
            //        axisLabel: {
            //            formatter: '{value}'
            //        }
            //    },
            //    series: srs
            //};

            chart_View_Cooler_HSW_Main.setOption(option);

        }

    }

}();