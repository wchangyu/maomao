var dx_ch_sgl_zfqw = function () {

    var chart_View_Chiller_SGL_ZFQW_Main = null;

    var chart_View_Ch_SGL_ZFQW_Analysis_Main = null;

    window.onresize = function () {
        if (chart_View_Chiller_SGL_ZFQW_Main) {
            chart_View_Chiller_SGL_ZFQW_Main.resize();
        }
        if (chart_View_Ch_SGL_ZFQW_Analysis_Main) {
            chart_View_Ch_SGL_ZFQW_Analysis_Main.resize();
        }
    };

    var INIT_DX_Ch_ZFQW_ANALYSIS_CHARTVIEW = function (chsglm) {
        var br = parseFloat(chsglm.dxChSGLZFQWBadRatio).toFixed(2);//告警值
        var wr = parseFloat(chsglm.dxChSGLZFQWWellRatio).toFixed(2);//正常值
        var or = parseFloat(100 - br - wr).toFixed(2);//一般值
        var dataAys = [];
        dataAys.push({ value: br, name: 'Alarm(' + br + '%)' });
        dataAys.push({ value: wr, name: 'Good(' + wr + '%)' });
        dataAys.push({ value: or, name: 'Normal(' + or + '%)' });
        chart_View_Ch_SGL_ZFQW_Analysis_Main = echarts.init(document.getElementById('chart_View_Ch_SGL_ZFQW_Analysis_Main'));
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
        chart_View_Ch_SGL_ZFQW_Analysis_Main.setOption(option);
    }

    function getQueryStr(name, ispe) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            var rs = r[2];
            if (ispe) {
                var pe = unescape(rs);
                return pe;
            }
            else {
                return rs;
            }
        }
        return null;
    }

    return {

        init: function () {

            $('#spanDxDT').html(sessionStorage.DxDT);

            //单台冷机标记
            var chsgId = getQueryStr("DxChSGLID", true);
            //单台冷机诊断集
            var chsgls = JSON.parse(sessionStorage.DxChSGLs);
            //单台冷机诊断结果
            var chsglms = _.where(chsgls, { dxChSGLID: chsgId });

            var chsglm = chsglms[0];

            var backUrl = "dx_ch_sgl_index.html?DxChSGLID=" + chsglm.dxChSGLID;

            $('#ZFQWBackToSGLBtn').attr('href', backUrl);

            $('#spanDxTitle').html(chsglm.dxChSGLNt + '蒸发器趋近温度');

            //$('#span_dxchsgl_item_zfqw_std').html();//诊断值

            //$('#span_dxchsgl_item_zfqw_acv').html();//实际值

            //$('#span_dxchsgl_item_zfqw_ofs').html();//偏差值

            if (chsglm.dxChSGLZFQWSte === "0")//异常
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

            INIT_DX_Ch_ZFQW_ANALYSIS_CHARTVIEW(chsglm);

            var dxchsglZFQWs = JSON.stringify(chsglm.dxChSGLZFQWDs);
            var dataXY = JSON.parse(dxchsglZFQWs);
            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].x);
                XY.push(dataXY[i].y);
                data.push(XY);
            }

            chart_View_Chiller_SGL_ZFQW_Main = echarts.init(document.getElementById('chart_View_Chiller_SGL_ZFQW_Main'));

            option = {
                title: {
                    text: '蒸发器趋近温度',
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
                visualMap: {
                    top: 10,
                    right: 10,
                    pieces: [{
                        gt: 0,
                        lte: parseFloat(chsglm.dxChSGLZFQWWellStd),
                        color: '#096'
                    }, {
                        gt: parseFloat(chsglm.dxChSGLZFQWWellStd),
                        lte: parseFloat(chsglm.dxChSGLZFQWBadStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(chsglm.dxChSGLZFQWBadStd),
                        color: '#ff9933'
                    }],
                    outOfRange: {
                        color: '#999'
                    },
                    orient:"horizontal"
                },
                series: {
                    name: '蒸发器趋近温度',
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: parseFloat(chsglm.DxChSGLZFQWBadStd)
                        }, {
                            yAxis: parseFloat(chsglm.DxChSGLZFQWWellStd)
                        }]
                    }
                }
            }

            chart_View_Chiller_SGL_ZFQW_Main.setOption(option);


        }

    }

}();