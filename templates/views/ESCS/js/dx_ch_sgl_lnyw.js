var dx_ch_sgl_lnyw = function () {

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
            var chsgId = getQueryStr("DxChSGLID", true);//单台冷机标记
            var chsgls = JSON.parse(sessionStorage.DxChSGLs);//单台冷机诊断集
            var chsglms = _.where(chsgls, { dxChSGLID: chsgId });//单台冷机诊断结果
            var chsglm = chsglms[0];
            var backUrl = "dx_ch_sgl_index.html?DxChSGLID=" + chsglm.dxChSGLID;
            $('#LNYWBackToSGLBtn').attr('href', backUrl);
            $('#spanDxTitle').html(chsglm.dxChSGLNt + '冷凝压力/温度');
        }

    }

}();