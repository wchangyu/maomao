var dx_ch_sgl_hsw = function () {

    var chart_View_Chiller_SGL_HSW_Main = null;

    var chart_View_Ch_SGL_HSW_Analysis_Main = null;

    window.onresize = function () {
        if (chart_View_Chiller_SGL_HSW_Main) {
            chart_View_Chiller_SGL_HSW_Main.resize();
        }
        if (chart_View_Ch_SGL_HSW_Analysis_Main) {
            chart_View_Ch_SGL_HSW_Analysis_Main.resize();
        }
    };

    var INIT_DX_Ch_HSW_ANALYSIS_CHARTVIEW = function (chsglm) {
        var br = parseFloat(chsglm.DxChSGLHSWBadRatio).toFixed(2);//告警值
        var wr = parseFloat(chsglm.DxChSGLHSWWellRatio).toFixed(2);//正常值
        var or = parseFloat(100 - br - wr).toFixed(2);//一般值
        var dataAys = [];
        dataAys.push({ value: br, name: '告警(' + br + '%)' });
        dataAys.push({ value: wr, name: '良好(' + wr + '%)' });
        dataAys.push({ value: or, name: '一般(' + or + '%)' });
        chart_View_Ch_SGL_HSW_Analysis_Main = echarts.init(document.getElementById('chart_View_Ch_SGL_HSW_Analysis_Main'));
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
        chart_View_Ch_SGL_HSW_Analysis_Main.setOption(option);
    }

    return {

        init: function () {
        }

    }

}();