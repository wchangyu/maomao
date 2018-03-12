
//冷却水输送系数诊断

var dx_cw_index = function () {

    var chart_View_CW_SSXS_Main = null;

    window.onresize = function () {
        if (chart_View_CW_SSXS_Main) {
            chart_View_CW_SSXS_Main.resize();
        }
    }

    return {

        init: function () {

        }

    }

}();