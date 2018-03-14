var dx_ch_sgl_zfyw = function () {

    return {

        init: function () {

            $('#spanDxDT').html(sessionStorage.DxDT);
            var chsgId = getQueryStr("DxChSGLID", true);//单台冷机标记
            var chsgls = JSON.parse(sessionStorage.DxChSGLs);//单台冷机诊断集
            var chsglms = _.where(chsgls, { DxChSGLID: chsgId });//单台冷机诊断结果
            var chsglm = chsglms[0];
            var backUrl = "DxCoolerSGL/Index?DxChSGLID=" + chsglm.DxChSGLID;
            $('#ZFYWBackToSGLBtn').attr('href', backUrl);
            $('#spanDxTitle').html(chsglm.DxChSGLNt + '蒸发压力/温度');

        }

    }

}();