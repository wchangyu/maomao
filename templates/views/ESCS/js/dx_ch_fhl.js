var dx_ch_fhl = function () {

    var chart_View_Cooler_FHL_Main = null;

    var chart_View_Ch_FHL_Analysis_Main = null;

    window.onresize = function () {
        if (chart_View_Cooler_FHL_Main) {
            chart_View_Cooler_FHL_Main.resize();
        }
        if (chart_View_Ch_FHL_Analysis_Main) {
            chart_View_Ch_FHL_Analysis_Main.resize();
        }
    };

    var INIT_DX_Ch_FHL_ANALYSIS_CHARTVIEW = function () {
        var br = parseFloat(sessionStorage.DxChFHLBadRatio).toFixed(2);//告警值
        var wr = parseFloat(sessionStorage.DxChFHLWellRatio).toFixed(2);//正常值
        var or = parseFloat(100 - br - wr).toFixed(2);//一般值
        var dataAys = [];
        dataAys.push({ value: br, name: '告警(' + br + '%)' });
        dataAys.push({ value: wr, name: '良好(' + wr + '%)' });
        dataAys.push({ value: or, name: '一般(' + or + '%)' });
        chart_View_Ch_FHL_Analysis_Main = echarts.init(document.getElementById('chart_View_Ch_FHL_Analysis_Main'));
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
        chart_View_Ch_FHL_Analysis_Main.setOption(option);
    }


    return {

        init: function () {

            $('#spanDxDT').html(sessionStorage.DxDT);

            $('#spanDxTitle').html(sessionStorage.DxChFHLTitle);

            if (sessionStorage.DxChFHLSte === "0")//异常
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

            INIT_DX_Ch_FHL_ANALYSIS_CHARTVIEW();


            //冷机系统负荷率
            var dataXY = JSON.parse(sessionStorage.DxChFHLDs);
            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].x);
                XY.push(dataXY[i].y);
                data.push(XY);
            }

            chart_View_Cooler_FHL_Main = echarts.init(document.getElementById('chart_View_Cooler_FHL_Main'));

            option = {
                title: {
                    text: '负荷率'
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
                        lte: parseFloat(sessionStorage.DxChFHLBadStd),
                        color: '#ff9933'
                    }, {
                        gt: parseFloat(sessionStorage.DxChFHLBadStd),
                        lte: parseFloat(sessionStorage.DxChFHLWellStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(sessionStorage.DxChFHLWellStd),
                        color: '#096'
                    }],
                    outOfRange: {
                        color: '#999'
                    }
                },
                series: {
                    name: '负荷率',
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: parseFloat(sessionStorage.DxChFHLBadStd)
                        }, {
                            yAxis: parseFloat(sessionStorage.DxChFHLWellStd)
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
            //        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            //    },
            //    yAxis: {
            //        type: 'value',
            //        axisLabel: {
            //            formatter: '{value}'
            //        }
            //    },
            //    series: [
            //        {
            //            name: '实际值',
            //            type: 'line',
            //            data: [05, 11, 09, 13, 03, 13, 10]
            //        },
            //        {
            //            name: '理想值',
            //            type: 'line',
            //            data: [12, 12, 12, 12, 12, 12, 12]
            //        }
            //    ]
            //};

            chart_View_Cooler_FHL_Main.setOption(option);


        }

    }

}();