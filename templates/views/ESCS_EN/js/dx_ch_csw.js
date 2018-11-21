var dx_ch_csw = function () {

    var chart_View_Cooler_CSW_Main = null;

    var chart_View_Ch_CSW_Analysis_Main = null;

    window.onresize = function () {
        if (chart_View_Cooler_CSW_Main) {
            chart_View_Cooler_CSW_Main.resize();
        }
        if (chart_View_Ch_CSW_Analysis_Main) {
            chart_View_Ch_CSW_Analysis_Main.resize();
        }
    };

    var INIT_DX_Ch_CSW_ANALYSIS_CHARTVIEW = function () {
        var br = parseFloat(sessionStorage.DxChChwCSWBadRatio).toFixed(2);//告警值
        var wr = parseFloat(sessionStorage.DxChChwCSWWellRatio).toFixed(2);//正常值
        var or = parseFloat(100 - br - wr).toFixed(2);//一般值
        var dataAys = [];
        dataAys.push({ value: br, name: 'Alarm(' + br + '%)' });
        dataAys.push({ value: wr, name: 'Good(' + wr + '%)' });
        dataAys.push({ value: or, name: 'Normal(' + or + '%)' });
        chart_View_Ch_CSW_Analysis_Main = echarts.init(document.getElementById('chart_View_Ch_CSW_Analysis_Main'));
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name: 'Statistics',
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
        chart_View_Ch_CSW_Analysis_Main.setOption(option);
    }

    return {

        init: function () {

            $('#spanDxDT').html(sessionStorage.DxDT);
            $('#spanDxTitle').html(sessionStorage.DxChChwCSWTitle);

            if (sessionStorage.DxChChwCSWSte === "0")//异常
            {
                //$('#reasugBox').show();
                $('.boxhgt').show();
                $('#spanDxSte').html('Abnormal');
                $('.ellipse').css('background-color', '#ffc000');
            }
            else {
                //$('#reasugBox').hide();
                $('.boxhgt').hide();
                $('#spanDxSte').html('Normal');
                $('.ellipse').css('background-color', '#1caf9a');
            }

            INIT_DX_Ch_CSW_ANALYSIS_CHARTVIEW();

            //$('#span_dxch_item_csw_std').html(sessionStorage.DxChChwCSWStd);//诊断值

            //$('#span_dxch_item_csw_acv').html(sessionStorage.DxChChwCSWAcv);//实际值

            //偏差值=(实际值-理想值)/理想值*100
            //var ofs = (sessionStorage.DxChChwCSWAcv - sessionStorage.DxChChwCSWStd) / sessionStorage.DxChChwCSWStd * 100;

            //$('#span_dxch_item_csw_ofs').html(Math.round(ofs, 2));//偏差值

            //var cswXs = JSON.parse(sessionStorage.DxChChwCSWXs);

            //var cswYs = JSON.parse(sessionStorage.DxChChwCSWYs);

            //var srs = [];
            //for (var i = 0; i < cswYs.length; i++) {
            //    var srob = {};
            //    if (i === 0) {
            //        srob.name = '实际值';
            //    }
            //    else {
            //        srob.name = '理想值';
            //    }
            //    srob.type = 'line';
            //    srob.data = [];
            //    for (var j = 0; j < cswYs[i].length; j++) {
            //        srob.data.push(cswYs[i][j]);
            //    }
            //    srs.push(srob);
            //}

            //(冷机诊断)冷冻出水[供水]温度
            var dataXY = JSON.parse(sessionStorage.DxChChwCSWDs);
            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].x);
                XY.push(dataXY[i].y);
                data.push(XY);
            }

            chart_View_Cooler_CSW_Main = echarts.init(document.getElementById('chart_View_Cooler_CSW_Main'));

            option = {
                title: {
                    text: 'Water Leaving Temperature',
                    textStyle:{

                        fontWeight:'normal',

                        fontSize:16

                    }
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
                        lte: parseFloat(sessionStorage.DxChChwCSWBadStd),
                        color: '#ff9933'
                    }, {
                        gt: parseFloat(sessionStorage.DxChChwCSWBadStd),
                        lte: parseFloat(sessionStorage.DxChChwCSWWellStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(sessionStorage.DxChChwCSWWellStd),
                        color: '#096'
                    }],
                    outOfRange: {
                        color: '#999'
                    },
                    orient:"horizontal"
                },
                series: {
                    name: 'Water Leaving Temperature',
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: parseFloat(sessionStorage.DxChChwCSWBadStd)
                        }, {
                            yAxis: parseFloat(sessionStorage.DxChChwCSWWellStd)
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
            //        data: cswXs
            //    },
            //    yAxis: {
            //        type: 'value',
            //        axisLabel: {
            //            formatter: '{value}'
            //        }
            //    },
            //    series: srs
            //};

            chart_View_Cooler_CSW_Main.setOption(option);

        }

    }

}();