var dx_ch_sgl_index = function () {

    var chart_View_Chiller_SGL_COP_Main = null;

    window.onresize = function () {
        if (chart_View_Chiller_SGL_COP_Main) {
            chart_View_Chiller_SGL_COP_Main.resize();
        }
    };

    //冷机负载率
    var INIT_FZL_ITEM = function (chsglm) {
        var fzlUrl = "DxCoolerSGL/FZL?DxChSGLID=" + chsglm.DxChSGLID;
        $('#dxchsgl_item_fzl_title').attr('href', fzlUrl);//地址
        $('#dxchsgl_item_fzl_ste').html();//状态
        if (chsglm.DxChSGLFZLSte === "1") {
            $('#dxchsgl_item_fzl_ste').html('<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i>');
        }
        else {
            $('#dxchsgl_item_fzl_ste').html('<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i>');
        }
        $('#dxchsgl_item_fzl_title').html();//标题
        $('#dxchsgl_item_fzl_title').html(chsglm.DxChSGLFZLTitle);
    }

    //冷冻出水温度
    var INIT_CSW_ITEM = function (chsglm) {
        var cswUrl = "DxCoolerSGL/CSW?DxChSGLID=" + chsglm.DxChSGLID;
        $('#dxchsgl_item_csw_title').attr('href', cswUrl);//地址
        $('#dxchsgl_item_csw_ste').html();//状态
        if (chsglm.DxChSGLCSWSte === "1") {
            $('#dxchsgl_item_csw_ste').html('<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i>');
        }
        else {
            $('#dxchsgl_item_csw_ste').html('<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i>');
        }
        $('#dxchsgl_item_csw_title').html();//标题
        $('#dxchsgl_item_csw_title').html(chsglm.DxChSGLCSWTitle);
    }

    //冷却回水温度
    var INIT_HSW_ITEM = function (chsglm) {
        var hswUrl = "DxCoolerSGL/HSW?DxChSGLID=" + chsglm.DxChSGLID;
        $('#dxchsgl_item_hsw_title').attr('href', hswUrl); //地址
        $('#dxchsgl_item_hsw_ste').html();//状态
        if (chsglm.DxChSGLHSWSte === "1") {
            $('#dxchsgl_item_hsw_ste').html('<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i>');
        }
        else {
            $('#dxchsgl_item_hsw_ste').html('<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i>');
        }
        $('#dxchsgl_item_hsw_title').html();//标题
        $('#dxchsgl_item_hsw_title').html(chsglm.DxChSGLHSWTitle);
    }

    //蒸发器趋近温度
    var INIT_ZFQW_ITEM = function (chsglm) {
        var zfqwUrl = "DxCoolerSGL/ZFQW?DxChSGLID=" + chsglm.DxChSGLID;
        $('#dxchsgl_item_zfqw_title').attr('href', zfqwUrl); //地址
        $('#dxchsgl_item_zfqw_ste').html();//状态
        if (chsglm.DxChSGLZFQWSte === "1") {
            $('#dxchsgl_item_zfqw_ste').html('<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i>');
        }
        else {
            $('#dxchsgl_item_zfqw_ste').html('<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i>');
        }
        $('#dxchsgl_item_zfqw_title').html();//标题
        $('#dxchsgl_item_zfqw_title').html(chsglm.DxChSGLZFQWTitle);
    }

    //冷凝器趋近温度
    var INIT_LNQW_ITEM = function (chsglm) {
        var lnqwUrl = "DxCoolerSGL/LNQW?DxChSGLID=" + chsglm.DxChSGLID;
        $('#dxchsgl_item_lnqw_title').attr('href', lnqwUrl); //地址
        $('#dxchsgl_item_lnqw_ste').html();//状态
        if (chsglm.DxChSGLLNQWSte === "1") {
            $('#dxchsgl_item_lnqw_ste').html('<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i>');
        }
        else {
            $('#dxchsgl_item_lnqw_ste').html('<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i>');
        }
        $('#dxchsgl_item_lnqw_title').html();//标题
        $('#dxchsgl_item_lnqw_title').html(chsglm.DxChSGLLNQWTitle);
    }

    //蒸发压力/温度
    var INIT_ZFYW_ITEM = function (chsglm) {
        var zfywUrl = "DxCoolerSGL/ZFYW?DxChSGLID=" + chsglm.DxChSGLID;
        $('#dxchsgl_item_zfyw_title').attr('href', zfywUrl); //地址
    }

    //冷凝压力/温度
    var INIT_LNYW_ITEM = function (chsglm) {
        var lnywUrl = "DxCoolerSGL/LNYW?DxChSGLID=" + chsglm.DxChSGLID;
        $('#dxchsgl_item_lnyw_title').attr('href', lnywUrl);//地址
    }

    //油压差
    var INIT_YOYC_ITEM = function (chsglm) {
        var yoycUrl = "DxCoolerSGL/YOYC?DxChSGLID=" + chsglm.DxChSGLID;
        $('#dxchsgl_item_yoyc_title').attr('href', yoycUrl);
    }

    return {

        init: function () {

            $('#spanDxDT').html(sessionStorage.DxDT);//诊断日期

            var chsgId = getQueryStr("DxChSGLID", true);//单台冷机标记

            var chsgls = JSON.parse(sessionStorage.DxChSGLs);//单台冷机诊断集

            var chsglms = _.where(chsgls, { DxChSGLID: chsgId });//单台冷机诊断结果

            var chsglm = chsglms[0];

            //冷机负载率
            INIT_FZL_ITEM(chsglm);

            //冷冻出水温度
            INIT_CSW_ITEM(chsglm);

            //冷却回水温度
            INIT_HSW_ITEM(chsglm);

            //蒸发器趋近温度
            INIT_ZFQW_ITEM(chsglm);

            //冷凝器趋近温度
            INIT_LNQW_ITEM(chsglm);

            //蒸发压力/温度
            INIT_ZFYW_ITEM(chsglm);

            //冷凝压力/温度
            INIT_LNYW_ITEM(chsglm);

            //油压差
            INIT_YOYC_ITEM(chsglm);

            $('#spanDxTitle').html(chsglm.DxChSGLNt + '能效诊断');

            $('#spansysDxTitle').html(chsglm.DxChSGLNt + '系统诊断');

            $('#span_dxchsgl_item_cop_acv').html(chsglm.DxChSGLAcv);//实际值

            $('#span_dxchsgl_item_cop_std').html(chsglm.DxChSGLStd);//理想值

            //偏差值=(实际值-理想值)/理想值*100
            var ofs = (chsglm.DxChSGLAcv - chsglm.DxChSGLStd) / chsglm.DxChSGLStd * 100;
            $('#span_dxchsgl_item_cop_ofs').html(Math.round(ofs, 2));//偏差值

            var dxchsgls = JSON.stringify(chsglm.DxChSGLDs);
            var dataXY = JSON.parse(dxchsgls);
            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].X);
                XY.push(dataXY[i].Y);
                data.push(XY);
            }
            chart_View_Chiller_SGL_COP_Main = echarts.init(document.getElementById('chart_View_Chiller_SGL_COP_Main'));
            option = {
                title: {
                    text: '冷机能效'
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
                        lte: parseFloat(chsglm.DxChSGLBadStd),
                        color: '#ff9933'
                    }, {
                        gt: parseFloat(chsglm.DxChSGLBadStd),
                        lte: parseFloat(chsglm.DxChSGLWellStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(chsglm.DxChSGLWellStd),
                        color: '#096'
                    }],
                    outOfRange: {
                        color: '#999'
                    }
                },
                series: {
                    name: '冷机能效',
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: parseFloat(chsglm.DxChSGLBadStd)
                        }, {
                            yAxis: parseFloat(chsglm.DxChSGLWellStd)
                        }]
                    }
                }
            }
            chart_View_Chiller_SGL_COP_Main.setOption(option);

        }

    }

}();