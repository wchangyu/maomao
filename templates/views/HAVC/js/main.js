var Main = function () {

    //在小于2位数的值前面添加0
    var addZeroToSingleNumber = function (num) {
        var curnum = "";
        if (num < 10) {
            curnum = "0" + num;
        }
        else {
            curnum += num;
        }
        return curnum;
    }

    //系统实时日期时间
    var sysrealdt = function () {
        var nowDt = new Date();
        var year = nowDt.getFullYear();
        var month = parseInt(nowDt.getMonth()) + 1;
        var day = nowDt.getDate();
        var dt = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        return dt;
    }

    //东冷chartView
    var e_c_p_chartView = null;

    //西冷chartView
    var w_c_p_chartView = null;

    //东热chartView
    var e_r_p_chartView = null;

    //西热chartView
    var w_r_p_chartView = null;

    window.onresize = function () {
        if (e_c_p_chartView && w_c_p_chartView && e_r_p_chartView && w_r_p_chartView) {
            e_c_p_chartView.resize();
            w_c_p_chartView.resize();
            e_r_p_chartView.resize();
            w_r_p_chartView.resize();
        }
    }

    //东冷chartView
    var init_e_c_p_chartView = function (MIN, MAX, cpV) {
        e_c_p_chartView = echarts.init(document.getElementById('e_c_p_chartView'));
        var miscstr = "元/KW";
        var cc = [[0.38, '#14E398'], [0.46, '#1E79D7'], [0.55, '#ead01e'], [1, '#F8276C']];
        option = {
            tooltip: {
                formatter: "{a} <br/>{c} {b}"
            },
            series: [
                {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: cc,
                            width: 8
                        }
                    },
                    name: '实时能效',
                    type: 'gauge',
                    z: 3,
                    min: MIN,
                    max: MAX,
                    splitNumber: 10, //15,
                    radius: '80%',
                    axisTick: {            // 坐标轴小标记
                        length: 15,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 20,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    title: {
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize: 20,
                            fontStyle: 'normal'
                        }
                    },
                    detail: {
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder'
                        }
                    },
                    data: [{ value: cpV, name: miscstr }]
                },
            ]
        };
        e_c_p_chartView.setOption(option, true);
    };

    //西冷chartView
    var init_w_c_p_chartView = function (MIN, MAX, cpV) {
        w_c_p_chartView = echarts.init(document.getElementById('w_c_p_chartView'));
        var miscstr = "元/KW";
        var cc = [[0.38, '#14E398'], [0.46, '#1E79D7'], [0.55, '#ead01e'], [1, '#F8276C']];
        option = {
            tooltip: {
                formatter: "{a} <br/>{c} {b}"
            },
            series: [
                {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: cc,
                            width: 8
                        }
                    },
                    name: '实时能效',
                    type: 'gauge',
                    z: 3,
                    min: MIN,
                    max: MAX,
                    splitNumber: 10, //15,
                    radius: '80%',
                    axisTick: {            // 坐标轴小标记
                        length: 15,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 20,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    title: {
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize: 20,
                            fontStyle: 'normal'
                        }
                    },
                    detail: {
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder'
                        }
                    },
                    data: [{ value: cpV, name: miscstr }]
                },
            ]
        };
        w_c_p_chartView.setOption(option, true);
    }

    //东热chartView
    var init_e_r_p_chartView = function (MIN, MAX, cpV) {
        e_r_p_chartView = echarts.init(document.getElementById('e_r_p_chartView'));
        var miscstr = "元/KW";
        var cc = [[0.38, '#14E398'], [0.46, '#1E79D7'], [0.55, '#ead01e'], [1, '#F8276C']];
        option = {
            tooltip: {
                formatter: "{a} <br/>{c} {b}"
            },
            series: [
                {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: cc,
                            width: 5
                        }
                    },
                    name: '实时能效',
                    type: 'gauge',
                    z: 3,
                    min: MIN,
                    max: MAX,
                    splitNumber: 10, //15,
                    radius: '80%',
                    axisTick: {            // 坐标轴小标记
                        length: 15,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 20,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    title: {
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize: 20,
                            fontStyle: 'normal'
                        }
                    },
                    detail: {
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder'
                        }
                    },
                    data: [{ value: cpV, name: miscstr }]
                },
            ]
        };
        e_r_p_chartView.setOption(option, true);
    }

    //西热chartView
    var init_w_r_p_chartView = function (MIN, MAX, cpV) {
        w_r_p_chartView = echarts.init(document.getElementById('w_r_p_chartView'));
        var miscstr = "元/KW";
        var cc = [[0.38, '#14E398'], [0.46, '#1E79D7'], [0.55, '#ead01e'], [1, '#F8276C']];
        option = {
            tooltip: {
                formatter: "{a} <br/>{c} {b}"
            },
            series: [
                {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: cc,
                            width: 5
                        }
                    },
                    name: '实时能效',
                    type: 'gauge',
                    z: 3,
                    min: MIN,
                    max: MAX,
                    splitNumber: 10, //15,
                    radius: '80%',
                    axisTick: {            // 坐标轴小标记
                        length: 15,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 20,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    title: {
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize: 20,
                            fontStyle: 'normal'
                        }
                    },
                    detail: {
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder'
                        }
                    },
                    data: [{ value: cpV, name: miscstr }]
                },
            ]
        };
        w_r_p_chartView.setOption(option, true);
    }

    //东冷站_冷站总体
    var init_e_c_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWCZTNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'EC'
        }, function (res) {
            if (res.code === 0) {
                $('#apan_ec_zt_c_text').html(res.cV);//东冷站_冷站总体_输出冷量
                $('#span_ec_zt_e_text').html(res.eV);//东冷站_冷站总体_输入电量
                $('#span_ec_zt_g_text').html(res.gV);//东冷站_冷站总体_输入蒸汽
                init_e_c_p_chartView(0, 1, res.ePRc);
            } else {
                $('#apan_ec_zt_c_text').html('0');//东冷站_冷站总体_输出冷量
                $('#span_ec_zt_e_text').html('0');//东冷站_冷站总体_输入电量
                $('#span_ec_zt_g_text').html('0');//东冷站_冷站总体_输入蒸汽
            }
        })
    }

    //西冷站_冷站总体
    var init_w_c_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWCZTNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'WC'
        }, function (res) {
            if (res.code === 0) {
                $('#apan_wc_zt_c_text').html(res.cV);//西冷站_冷站总体_输出冷量
                $('#span_wc_zt_e_text').html(res.eV);//西冷站_冷站总体_输入电量
                $('#span_wc_zt_g_text').html(res.gV);//西冷站_冷站总体_输入蒸汽
                init_w_c_p_chartView(0, 1, res.ePRc);
            } else {
                $('#apan_wc_zt_c_text').html('0');//西冷站_冷站总体_输出冷量
                $('#span_wc_zt_e_text').html('0');//西冷站_冷站总体_输入电量
                $('#span_wc_zt_g_text').html('0');//西冷站_冷站总体_输入蒸汽
            }
        })
    }

    //东热站_热站总体
    var init_e_h_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWHZTNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'EH'
        }, function (res) {
            if (res.code === 0) {
                $('#span_eh_zt_h_text').html(res.rV);
                $('#span_eh_zt_g_text').html(res.gV);
                $('#span_eh_zt_e_text').html(res.eV);
                init_e_r_p_chartView(0, 1, res.rPRc);
            } else {
                $('#span_eh_zt_h_text').html('0');
                $('#span_eh_zt_g_text').html('0');
                $('#span_eh_zt_e_text').html('0');
            }
        })
    }

    //西热站_热站总体
    var init_w_h_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWHZTNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'WH'
        }, function (res) {
            if (res.code === 0) {
                $('#span_wh_zt_h_text').html(res.rV);
                $('#span_wh_zt_g_text').html(res.gV);
                $('#span_wh_zt_e_text').html(res.eV);
                init_w_r_p_chartView(0, 1, res.rPRc);
            } else {
                $('#span_wh_zt_h_text').html('0');
                $('#span_wh_zt_g_text').html('0');
                $('#span_wh_zt_e_text').html('0');
            }
        })
    }

    //东冷站_离心机系统
    var init_e_c_lx_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWCLXNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'EC'
        }, function (res) {
            if (res.code === 0) {
                $('#span_ec_lx_c_text').html(res.cV);
                $('#span_ec_lx_e_text').html(res.eV);
                $('#span_ec_lx_cop_text').html(res.copV);
                $('#span_ec_lx_yb_text').html(res.ybV);
                $('#span_ec_lx_lqb_text').html(res.lqbV);
                $('#span_ec_lx_lqt_text').html(res.lqtV);
            } else {
                $('#span_ec_lx_c_text').html('0');
                $('#span_ec_lx_e_text').html('0');
                $('#span_ec_lx_cop_text').html('0');
                $('#span_ec_lx_yb_text').html('0');
                $('#span_ec_lx_lqb_text').html('0');
                $('#span_ec_lx_lqt_text').html('0');
            }
        })
    }

    //西冷站_离心机系统
    var init_w_c_lx_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWCLXNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'WC'
        }, function (res) {
            if (res.code === 0) {
                $('#span_ec_lx_c_text').html(res.cV);
                $('#span_ec_lx_e_text').html(res.eV);
                $('#span_ec_lx_cop_text').html(res.copV);
                $('#span_ec_lx_yb_text').html(res.ybV);
                $('#span_ec_lx_lqb_text').html(res.lqbV);
                $('#span_wc_lx_lqt_text').html(res.lqtV);
            } else {
                $('#span_ec_lx_c_text').html('0');
                $('#span_ec_lx_e_text').html('0');
                $('#span_ec_lx_cop_text').html('0');
                $('#span_ec_lx_yb_text').html('0');
                $('#span_ec_lx_lqb_text').html('0');
                $('#span_ec_lx_lqt_text').html('0');
            }
        })
    }

    //东冷站_溴理机系统
    var init_e_c_xl_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWCXLNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'EC'
        }, function (res) {
            if (res.code === 0) {
                $('#span_ec_xl_c_text').html(res.cV);
                $('#span_ec_xl_g_text').html(res.gV);
                $('#span_ec_xl_cop_text').html(res.copV);
                $('#span_ec_xl_yb_text').html(res.ybV);
                $('#span_ec_xl_lqb_text').html(res.lqbV);
                $('#span_ec_xl_lqt_text').html(res.lqtV);
            } else {
                $('#span_ec_xl_c_text').html('0');
                $('#span_ec_xl_g_text').html('0');
                $('#span_ec_xl_cop_text').html('0');
                $('#span_ec_xl_yb_text').html('0');
                $('#span_ec_xl_lqb_text').html('0');
                $('#span_ec_xl_lqt_text').html('0');
            }
        })
    }

    //西冷站_溴理机系统
    var init_w_c_xl_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWCXLNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'WC'
        }, function (res) {
            if (res.code === 0) {
                $('#span_wc_xl_c_text').html(res.cV);
                $('#span_wc_xl_g_text').html(res.gV);
                $('#span_wc_xl_cop_text').html(res.copV);
                $('#span_wc_xl_yb_text').html(res.ybV);
                $('#span_wc_xl_lqb_text').html(res.lqbV);
                $('#span_wc_xl_lqt_text').html(res.lqtV);
            } else {
                $('#span_wc_xl_c_text').html('0');
                $('#span_wc_xl_g_text').html('0');
                $('#span_wc_xl_cop_text').html('0');
                $('#span_wc_xl_yb_text').html('0');
                $('#span_wc_xl_lqb_text').html('0');
                $('#span_wc_xl_lqt_text').html('0');
            }
        })
    }

    //东冷站_地源热泵系统
    var init_e_c_rb_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWCRBNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'EC'
        }, function (res) {
            if (res.code === 0) {
                $('#span_ec_rb_c_text').html(res.cV);
                $('#span_ec_rb_e_text').html(res.eV);
                $('#span_ec_rb_cop_text').html(res.copV);
                $('#span_ec_rb_yb_text').html(res.ybV);
                $('#span_ec_rb_lqb_text').html(res.lqbV);
                $('#span_ec_rb_lqt_text').html(res.lqtV);
            } else {
                $('#span_ec_rb_c_text').html('0');
                $('#span_ec_rb_e_text').html('0');
                $('#span_ec_rb_cop_text').html('0');
                $('#span_ec_rb_yb_text').html('0');
                $('#span_ec_rb_lqb_text').html('0');
                $('#span_ec_rb_lqt_text').html('0');
            }
        })
    }

    //西冷站_地源热泵系统
    var init_w_c_rb_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWCRBNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'WC'
        }, function (res) {
            if (res.code === 0) {
                $('#span_wc_rb_c_text').html(res.cV);
                $('#span_wc_rb_e_text').html(res.eV);
                $('#span_wc_rb_cop_text').html(res.copV);
                $('#span_wc_rb_yb_text').html(res.ybV);
                $('#span_wc_rb_lqb_text').html(res.lqbV);
                $('#span_wc_rb_lqt_text').html(res.lqtV);
            } else {
                $('#span_wc_rb_c_text').html('0');
                $('#span_wc_rb_e_text').html('0');
                $('#span_wc_rb_cop_text').html('0');
                $('#span_wc_rb_yb_text').html('0');
                $('#span_wc_rb_lqb_text').html('0');
                $('#span_wc_rb_lqt_text').html('0');
            }
        })
    }

    //东热站_设备系统
    var init_e_h_eq_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWHEQNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'EH'
        }, function (res) {
            if (res.code === 0) {
                $('#span_eh_eq_h_text').html(res.rV);
                $('#span_eh_eq_g_text').html(res.gV);
                $('#span_eh_eq_rg_nx_text').html(res.rgV);
                $('#span_eh_eq_e_text').html(res.eV);
                $('#span_eh_eq_sb_xx_text').html(res.sbV);
            } else {
                $('#span_eh_eq_h_text').html('');
                $('#span_eh_eq_g_text').html('');
                $('#span_eh_eq_rg_nx_text').html('');
                $('#span_eh_eq_e_text').html('');
                $('#span_eh_eq_sb_xx_text').html('');
            }
        })
    }

    //西热站_设备系统
    var init_w_h_eq_v_text = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaMain/GetEWHEQNOW";
        $.post(url, {
            pId: sessionStorage.PointerID,
            dt: sysrealdt,
            AREA: 'WH'
        }, function (res) {
            if (res.code === 0) {
                $('#span_wh_eq_h_text').html(res.rV);
                $('#span_wh_eq_g_text').html(res.gV);
                $('#span_wh_eq_rg_nx_text').html(res.rgV);
                $('#span_wh_eq_e_text').html(res.eV);
                $('#span_wh_eq_sb_xx_text').html(res.sbV);
            } else {
                $('#span_wh_eq_h_text').html('');
                $('#span_wh_eq_g_text').html('');
                $('#span_wh_eq_rg_nx_text').html('');
                $('#span_wh_eq_e_text').html('');
                $('#span_wh_eq_sb_xx_text').html('');
            }
        });
    }

    return {
        init: function () {
            var pos = JSON.parse(sessionStorage.pointers);

            console.log(pos);

            var po = pos[0];
            sessionStorage.PointerID = po.pointerID;
            sessionStorage.PointerName = po.pointerName;
            sessionStorage.EprID = po.enterpriseID;
            sessionStorage.EprName = po.eprName;
            //东冷站_冷站总体
            init_e_c_v_text();
            //西冷站_冷站总体
            init_w_c_v_text();
            //东热站_热站总体
            init_e_h_v_text();
            //西热站_热站总体
            init_w_h_v_text();
            //东冷站_离心机系统
            init_e_c_lx_v_text();
            //西冷站_离心机系统
            init_w_c_lx_v_text();
            //东冷站_溴理机系统
            init_e_c_xl_v_text();
            //西冷站_溴理机系统
            init_w_c_xl_v_text();
            //东冷站_地源热泵系统
            init_e_c_rb_v_text();
            //西冷站_地源热泵系统
            init_w_c_rb_v_text();
            //东热站_设备系统
            init_e_h_eq_v_text();
            //西热站_设备系统
            init_w_h_eq_v_text();
        }
    }

}()