﻿var dx_chw_mdyj = function () {

    //(诊断)末端压差CHARTVIEW
    var chart_View_MDYJ_Main = null;

    //末端压差CHARTVIEW
    var chart_View_CHW_MDYC_Analysis_Main = null;

    window.onresize = function () {
        if (chart_View_MDYJ_Main) {
            chart_View_MDYJ_Main.resize();
        }
        if (chart_View_CHW_MDYC_Analysis_Main) {
            chart_View_CHW_MDYC_Analysis_Main.resize();
        }
    };

    //末端压差统计CHARTVIEW
    var INIT_DX_CHW_MDYC_ANALYSIS_CHARTVIEW = function () {
        var br = parseFloat(sessionStorage.DxChwMDYCBadRatio).toFixed(2);//告警值
        var wr = parseFloat(sessionStorage.DxChwMDYCWellRatio).toFixed(2);//正常值
        var or = parseFloat(100 - br - wr).toFixed(2);//一般值
        var dataAys = [];
        dataAys.push({ value: br, name: '告警(' + br + '%)' });
        dataAys.push({ value: wr, name: '良好(' + wr + '%)' });
        dataAys.push({ value: or, name: '一般(' + or + '%)' });
        chart_View_CHW_MDYC_Analysis_Main = echarts.init(document.getElementById('chart_View_CHW_MDYC_Analysis_Main'));
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
        chart_View_CHW_MDYC_Analysis_Main.setOption(option);
    }

    return {

        init: function () {
            $('#spanDxDT').html(sessionStorage.DxDT);
            $('#spanDxTitle').html(sessionStorage.DxChwMDYCTitle);
            if (sessionStorage.DxChwMDYCSte === "-1") {
                //$('#reasugBox').show();
                $('.boxhgt').show();
                $('#spanDxSte').html('异常');
                $('.ellipse').css('background-color', '#ffc000');
            }
            else if (sessionStorage.DxChwMDYCSte === "0")//异常
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

            INIT_DX_CHW_MDYC_ANALYSIS_CHARTVIEW();

            //$('#span_dxchw_item_mdyc_std').html(sessionStorage.DxChwMDYCStd);//诊断值

            //$('#span_dxchw_item_mdyc_acv').html(sessionStorage.DxChwMDYCAcv);//实际值

            //偏差值=(实际值-理想值)/理想值*100
            //var ofs = (sessionStorage.DxChwMDYCAcv - sessionStorage.DxChwMDYCStd) / sessionStorage.DxChwMDYCStd * 100;
            //$('#span_dxchw_item_mdyc_ofs').html(Math.round(ofs,2));//偏差值

            //var xs = JSON.parse(sessionStorage.DxChwMDYCXs);

            //var ys = JSON.parse(sessionStorage.DxChwMDYCYs);

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

            var dataXY = JSON.parse(sessionStorage.DxChwMDYCDs);
            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].x);
                XY.push(dataXY[i].y);
                data.push(XY);
            }
            chart_View_MDYJ_Main = echarts.init(document.getElementById('chart_View_MDYJ_Main'));
            option = {
                title: {
                    text: '末端压差'
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
                        lte: parseFloat(sessionStorage.DxChwMDYCWellStd),
                        color: '#096'
                    }, {
                        gt: parseFloat(sessionStorage.DxChwMDYCWellStd),
                        lte: parseFloat(sessionStorage.DxChwMDYCBadStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(sessionStorage.DxChwMDYCBadStd),
                        color: '#ff9933'
                    }],
                    outOfRange: {
                        color: '#999'
                    }
                },
                series: {
                    name: '末端压差',
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: parseFloat(sessionStorage.DxChwMDYCBadStd)
                        }, {
                            yAxis: parseFloat(sessionStorage.DxChwMDYCWellStd)
                        }]
                    }
                }
            }
            chart_View_MDYJ_Main.setOption(option);

        }

    }

}();