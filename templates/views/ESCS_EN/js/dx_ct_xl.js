var dx_ct_xl = function () {


    var chart_View_CT_XL_Main = null;

    var chart_View_CT_XL_Analysis_Main = null;

    window.onresize = function () {
        if (chart_View_CT_XL_Main) {
            chart_View_CT_XL_Main.resize();
        }
        if (chart_View_CT_XL_Analysis_Main) {
            chart_View_CT_XL_Analysis_Main.resize();
        }
    };

    //统计ChartView
    var INIT_DX_CT_XL_ANALYSIS_CHARTVIEW = function () {
        var br = parseFloat(sessionStorage.DxCTXLBadRatio).toFixed(2);//告警值
        var wr = parseFloat(sessionStorage.DxCTXLWellRatio).toFixed(2);//正常值
        var or = parseFloat(100 - br - wr).toFixed(2);//一般值
        var dataAys = [];
        dataAys.push({ value: br, name: 'Alarm(' + br + '%)' });
        dataAys.push({ value: wr, name: 'Good(' + wr + '%)' });
        dataAys.push({ value: or, name: 'Normal(' + or + '%)' });
        chart_View_CT_XL_Analysis_Main = echarts.init(document.getElementById('chart_View_CT_XL_Analysis_Main'));
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
        chart_View_CT_XL_Analysis_Main.setOption(option);
    }

    return {

        init: function () {

            $('#spanDxDT').html(sessionStorage.DxDT);

            $('#spanDxTitle').html(sessionStorage.DxCTXLTitle);

            if (sessionStorage.DxCTXLSte === "-1") {
                //$('#reasugBox').show();
                $('.boxhgt').show();
                $('#spanDxSte').html('Abnormal');
                $('.ellipse').css('background-color', '#ffc000');
            }
            else if (sessionStorage.DxCTXLSte === "0")//异常
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

            INIT_DX_CT_XL_ANALYSIS_CHARTVIEW();

            //$('#span_dxct_item_zsxl_std').html(sessionStorage.DxCTXLStd);//诊断值

            //$('#span_dxct_item_zsxl_acv').html(sessionStorage.DxCTXLAcv);//实际值

            //偏差值=(实际值-理想值)/理想值*100
            //var ofs = (sessionStorage.DxCTXLAcv - sessionStorage.DxCTXLStd) / sessionStorage.DxCTXLStd * 100;
            //$('#span_dxct_item_zsxl_ofs').html(Math.round(ofs, 2));//偏差值

            //var xs = JSON.parse(sessionStorage.DxCTXLXs);

            //var ys = JSON.parse(sessionStorage.DxCTXLYs);

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
            //    srs.push(srob);
            //}

            var dataXY = JSON.parse(sessionStorage.DxCTXLDs);
            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].x);
                XY.push(dataXY[i].y);
                data.push(XY);
            }

            chart_View_CT_XL_Main = echarts.init(document.getElementById('chart_View_CT_XL_Main'));

            option = {
                title: {
                    text: '自身效率',
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
                        lte: parseFloat(sessionStorage.DxCTXLBadStd),
                        color: '#ff9933'
                    }, {
                        gt: parseFloat(sessionStorage.DxCTXLBadStd),
                        lte: parseFloat(sessionStorage.DxCTXLWellStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(sessionStorage.DxCTXLWellStd),
                        color: '#096'
                    }],
                    outOfRange: {
                        color: '#999'
                    },
                    orient:"horizontal"
                },
                series: {
                    name: '自身效率',
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: parseFloat(sessionStorage.DxCTXLBadStd)
                        }, {
                            yAxis: parseFloat(sessionStorage.DxCTXLWellStd)
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

            chart_View_CT_XL_Main.setOption(option);


        }

    }

}();