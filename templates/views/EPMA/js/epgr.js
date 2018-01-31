var EPGR=function () {

    /*尖值时段*/
    var tipAryts = [];

    /*峰值时段*/
    var peakAryts = [];

    /*平值时段*/
    var flatAryts = [];

    /*谷值时段*/
    var valleyAryts = [];

    //新增 or 编辑 ，默认新增
    var isM = false;

    //初始化时间控件(电价时间段设置)
    var initdatetimepicker = function () {
        $('.prcgrpDT').datetimepicker({
            format: 'yyyy-mm-dd',
            language: 'zh-CN',
            weekStart: true,
            todayBtn: true,
            autoclose: true,
            todayHighlight: true,
            startView: 2,
            minView: 2,
            minuteStep: 10,
            forceParse: 0,
            pickerPosition: "bottom-left"
        });
    }

    //初始化没有计费方案控件
    var initNullPrices = function () {
        var maxDt_str = "2099-01-01";
        var maxDt_mom = moment(maxDt_str);
        var maxDt = maxDt_mom.format('YYYY-MM-DD');
        $('#priceEndDate').val(maxDt);
        $('#spantipE_price').val('0');
        $('#spanpeakE_price').val('0');
        $('#spanequalE_price').val('0');
        $('#spanvalleyE_price').val('0');
    }

    //获取电费单价内容
    var getpGrps = function() {
        jQuery('#epgrBusy').showLoading();
        var url = sessionStorage.apiUrlPrefix + "EPGr/GetPriceGrpDs";
        $.post(url,{
            pId:sessionStorage.PointerID
        },function (res) {
            if(res.code === 0){
                //是否编辑,TRUE=是,则是编辑
                isM = true;
                //重新赋值HTML
                $('#spanepricecontent').html('编辑电价内容');
                //计费方案列表
                var pGrps = res.pGrps;
                var pgM = pGrps[0];
                var prId = pgM.priceGroupID;
                $('#priceGroupID').val(prId);
                var prNT = pgM.priceGroupName;
                $('#priceGroupNT').val(prNT);
                var prs = pGrps[0].prices;
                //开始时间段
                var sDT_Str = prs[0].startDate;
                var sDT_mom = moment(sDT_Str);
                var startDT = sDT_mom.format('YYYY-MM-DD');
                var eDT_Str = prs[0].endDate;
                var eDT_mom = moment(eDT_Str);
                var endDT = eDT_mom.format('YYYY-MM-DD');
                $('#priceStartDate').val(startDT);
                $('#priceEndDate').val(endDT);
                //1~4：尖峰平谷
                var timestr_grp_tip = "";
                var timestr_grp_peak = "";
                var timestr_grp_flat = "";
                var timestr_grp_valley = "";
                for (var i = 0; i < prs.length; i++) {
                    var priceId = prs[i].priceID;
                    var pricegroupId = prs[i].priceGroupID;
                    var timetype = prs[i].timeType;
                    var price = prs[i].price;
                    var timestr = prs[i].timeStr;
                    if (timetype === "1") { //尖值
                        if (timestr_grp_tip.length === 0) {
                            timestr_grp_tip += timestr;
                        }
                        else {
                            timestr_grp_tip += "," + timestr;
                        }
                        $('#pricestip_id').val(priceId);
                        $('#pricestip').val(timestr_grp_tip);
                        $('#tippriceEV').val(price);
                        $('#spantipE_price').html(price);
                    }
                    if (timetype === "2") {//峰值
                        if (timestr_grp_peak.length === 0) {
                            timestr_grp_peak += timestr;
                        }
                        else {
                            timestr_grp_peak += "," + timestr;
                        }
                        $('#pricespeak_id').val(priceId);
                        $('#pricespeak').val(timestr_grp_peak);
                        $('#peakpriceEV').val(price);
                        $('#spanpeakE_price').html(price);
                    }
                    if (timetype === "3") {//平值
                        if (timestr_grp_flat.length === 0) {
                            timestr_grp_flat += timestr;
                        }
                        else {
                            timestr_grp_flat += "," + timestr;
                        }
                        $('#pricesflat_id').val(priceId);
                        $('#pricesflat').val(timestr_grp_flat);
                        $('#equalpriceEV').val(price);
                        $('#spanequalE_price').html(price);
                    }
                    if (timetype === "4") {//谷值
                        if (timestr_grp_valley.length === 0) {
                            timestr_grp_valley += timestr;
                        }
                        else {
                            timestr_grp_valley += "," + timestr;
                        }
                        $('#pricesvalley_id').val(priceId);
                        $('#pricesvalley').val(timestr_grp_valley);
                        $('#valleypriceEV').val(price);
                        $('#spanvalleyE_price').html(price);
                    }
                }
                if (timestr_grp_tip.length > 0) {
                    tipAryts = [];
                    var timestr_grp_tip_Ary = timestr_grp_tip.split(',');
                    for (var i = 0; i < timestr_grp_tip_Ary.length; i++) {
                        tipAryts.push(timestr_grp_tip_Ary[i]);
                    }
                }
                if (timestr_grp_peak.length > 0) {
                    peakAryts = [];
                    var timestr_grp_peak_Ary = timestr_grp_peak.split(',');
                    for (var i = 0; i < timestr_grp_peak_Ary.length; i++) {
                        peakAryts.push(timestr_grp_peak_Ary[i]);
                    }
                }
                if (timestr_grp_flat.length > 0) {
                    flatAryts = [];
                    var timestr_grp_flat_Ary = timestr_grp_flat.split(',');
                    for (var i = 0; i < timestr_grp_flat_Ary.length; i++) {
                        flatAryts.push(timestr_grp_flat_Ary[i]);
                    }
                }
                if (timestr_grp_valley.length > 0) {
                    valleyAryts = [];
                    var timestr_grp_valley_Ary = timestr_grp_valley.split(',');
                    for (var i = 0; i < timestr_grp_valley_Ary.length; i++) {
                        valleyAryts.push(timestr_grp_valley_Ary[i]);
                    }
                }
                jQuery('#epgrBusy').hideLoading();
            }else if(res.code === -1) {
                jQuery('#epgrBusy').hideLoading();
                alert('异常错误(获取电费单价内容):' + res.msg);
            }else{
                //没有设置电费单价内容
                initNullPrices();
                //是否编辑,FALSE=否,则是新增
                isM = false;
                //重新赋值HTML
                $('#spanepricecontent').html('新增电价内容');
                jQuery('#epgrBusy').hideLoading();
            }
        })
    }

    //初始化多时间段分钟
    var initMultiDateTimeMinute = function () {
        var HEADERHTML = '<div class="form_date_minute">'
            + '<div style="background:#EEE;height:30px;">'
            + '<div style="float:left;margin-left:12px;line-height:30px;">'
            + '<label><input type="checkbox" class="all_minute_select">'
            + '<span style="position:relative;top:-2px;margin-left:2px;">全选/取消全选</span>'
            + '</label></div>'
            + '<div style="float:right;margin-right:10px;height:30px;line-height:30px;position:relative;top:10px;">'
            + '<button type="button" class="close closeM">×</button></div>'
            + '</div>'
            + '<table id="minuteTable" style="width:100%">'
            + '<tbody class="minuteTBody">'
            + '<tr><td>'
            + '</td><td></td><td></td>'
            + '<td></td>'
            + '</tr>'
            + '</tbody>'
            + '</table>'
            + '</div>';
        $('.form_date_block').append(HEADERHTML);
        //插入td(check-time)
        var time = 0;
        for (var i = 0; i < 6; i++) {
            var trs = '<tr>';
            var tds = '';
            for (var j = 0; j < 4; j++) {
                if (time < 10) {
                    time = '0' + time;
                }
                trs += '<td><div class="checkbox_minute">'
                    + '<label><input type="checkbox">'
                    + '<span style="position:relative;top:-2px;">' + time + ':00' + '</span>'
                    + '</label></div></td>'
                time++;
            }
            trs += '</tr>';
            $('.minuteTBody').append(trs);
        }
        //插入确定
        $('.minuteTBody').append('<tr><td colspan="4"><button type="button" class="btn btn-default makeOk" style="width:100%;border-left-width:0px;border-right-width:0px;border-bottom-width:0px;">确定</button></td></tr>');
        //全选
        $('.all_minute_select').on('change', function () {
            var flag = $(this)[0].checked;
            if (!flag) {
                flag = false;
                for (var i = 0; i < $('tr').length; i++) {
                    //$(this).parents('tbody').find('tr').eq(i).find('input').prop("checked", false);
                    $('tbody').find('tr').eq(i).find('input').prop("checked", false);
                }
            }
            else {
                flag = true;
                for (var i = 0; i < $('tr').length; i++) {
                    //$(this).parents('tbody').find('tr').eq(i).find('input').prop("checked", true);
                    $('tbody').find('tr').eq(i).find('input').prop("checked", true);
                }
            }
        });
        $('.makeOk').on('click', function () {//确定
            var Aryts = [];
            var checkboxs = $(this).parents('.form_date_block').children('.form_date_minute').find('.checkbox_minute');
            for (var i = 0; i < checkboxs.length; i++) {
                if (checkboxs.eq(i).children('label').children('input').is(':checked')) {
                    Aryts.push(checkboxs.eq(i).children('label').text())
                }
            }
            if (prcDType === "tip") {
                tipAryts = Aryts;
            }
            if (prcDType === "peak") {
                peakAryts = Aryts;
            }
            if (prcDType === "flat") {
                flatAryts = Aryts;
            }
            if (prcDType === "valley") {
                valleyAryts = Aryts;
            }
            $(this).parents('.form_date_block').find('.timeArray').val(Aryts);
            $(this).parents('.form_date_block').children('.form_date_minute').hide();
            prcDType = "";
        });
        var prcDType = "";
        //打开（尖值|峰值|平值|谷值时段）窗口
        $('.prcDT').on('click', function () {
            if ($(this).hasClass('prcDT_tip')) {
                prcDType = "tip";
            }
            if ($(this).hasClass('prcDT_peak')) {
                prcDType = "peak";
            }
            if ($(this).hasClass('prcDT_flat')) {
                prcDType = "flat";
            }
            if ($(this).hasClass('prcDT_valley')) {
                prcDType = "valley";
            }
            $('.form_date_minute').hide();
            $(this).parents('.form_date_block').children('.form_date_minute').toggle();
        });
        //关闭窗口
        $('.closeM').on('click', function () {
            prcDType = "";
            $(this).parents('.form_date_block').children('.form_date_minute').hide();
        });
    }

    return {
        init:function () {
            var pos = JSON.parse(sessionStorage.pointers);
            var po = pos[0];
            sessionStorage.PointerID = po.pointerID;
            sessionStorage.PointerName = po.pointerName;
            sessionStorage.EprID = po.enterpriseID;
            sessionStorage.EprName = po.eprName;
            //初始化时间控件
            initdatetimepicker();
            //初始化多时间段分钟
            initMultiDateTimeMinute();
            //获取电费单价内容
            getpGrps();
            //编辑或新增计费方案
            saveOrModifypGrp();
        }
    }

    //编辑或新增计费方案
    var saveOrModifypGrp = function () {
        //保存电费单价
        $('#savepriceBtn').on('click', function () {
            //将四个时间段数据添加到一个数组中
            var aryts = _.union(tipAryts, peakAryts, flatAryts, valleyAryts);
            if (aryts.length == 24) {
                var pricegroupNT = $('#priceGroupNT').val();/*计费方案名称*/
                var priceSTDT = $('#priceStartDate').val();/*开始时间段*/
                var priceETDT = $('#priceEndDate').val(); /*结束时间段*/
                var tippriceEV = $('#tippriceEV').val();/*尖值电价*/
                var peakpriceEV = $('#peakpriceEV').val();/*峰值电价*/
                var equalpriceEV = $('#equalpriceEV').val();/*平值电价*/
                var valleypriceEV = $('#valleypriceEV').val();/*谷值电价*/
                if (pricegroupNT.length === 0) {
                    alert("系统提示(电价设置):计费方案名称不能为空");
                    return;
                }
                if (priceSTDT.length === 0) {
                    alert("系统提示(电价设置):开始时间段不能为空");
                    return;
                }
                if (priceETDT.length === 0) {
                    alert("系统提示(电价设置):结束时间段不能为空");
                    return;
                }
                if ($('#pricestip').val().length > 0) {
                    if (tippriceEV.length === 0) {
                        alert("系统提示(电价设置):尖值电价不能为空");
                        return;
                    }
                    if (parseFloat(tippriceEV) <= 0) {
                        alert("系统提示(电价设置):尖值电价不能小于等于0");
                        return;
                    }
                }
                if ($('#pricespeak').val().length > 0) {
                    if (peakpriceEV.length === 0) {
                        alert("系统提示(电价设置):峰值电价不能为空");
                        return;
                    }
                    if (parseFloat(peakpriceEV) <= 0) {
                        alert("系统提示(电价设置):峰值电价不能小于等于0");
                        return;
                    }
                }
                if ($('#pricesflat').val().length > 0) {
                    if (equalpriceEV.length === 0) {
                        alert("系统提示(电价设置):平值电价不能为空");
                        return;
                    }
                    if (parseFloat(equalpriceEV) <= 0) {
                        alert("系统提示(电价设置):平值电价不能小于等于0");
                        return;
                    }
                }
                if ($('#pricesvalley').val().length > 0) {
                    if (valleypriceEV.length === 0) {
                        alert("系统提示(电价设置):谷值电价不能为空");
                        return;
                    }
                    if (parseFloat(valleypriceEV) <= 0) {
                        alert("系统提示(电价设置):谷值电价不能小于等于0");
                        return;
                    }
                }
                if (tipAryts.length === 0 && peakAryts.length === 0 && flatAryts.length === 0 && valleyAryts.length === 0) {
                    alert("系统提示(电价设置):尖峰谷值时间段不能为空");
                }
                else {
                    jQuery('#epgrBusy').showLoading();
                    var prgID = $('#priceGroupID').val();
                    var pricesAy = "";
                    var tipAy = $('#pricestip').val() + "-" + "1" + "*" + tippriceEV;//尖
                    var peakAy = $('#pricespeak').val() + "-" + "2" + "*" + peakpriceEV;//峰
                    var equalAy = $('#pricesflat').val() + "-" + "3" + "*" + equalpriceEV;//平
                    var valleyAy = $('#pricesvalley').val() + "-" + "4" + "*" + valleypriceEV;//谷
                    if ($('#pricestip').val().length > 0) {
                        pricesAy += tipAy + "|";
                    }
                    if ($('#pricespeak').val().length > 0) {
                        pricesAy += peakAy + "|";
                    }
                    if ($('#pricesflat').val().length > 0) {
                        pricesAy += equalAy + "|";
                    }
                    if ($('#pricesvalley').val().length > 0) {
                        pricesAy += valleyAy + "|";
                    }
                    var prm = {
                        pId: sessionStorage.PointerID,
                        prgNt: pricegroupNT,
                        prgId: prgID,
                        psd_tq: priceSTDT,
                        ped_tq: priceETDT,
                        pAy: pricesAy,
                        isM: isM
                    };
                    var url = sessionStorage.apiUrlPrefix + "EPGr/InsertOrModifySavePriceGrp";
                    $.post(url,prm,function (res) {
                        if(res.code === 0){
                            jQuery('#epgrBusy').hideLoading();
                            alert("系统提示(电价设置):设置尖峰平谷电费单价成功");
                            $('#mypriceSetModal').modal('hide');
                        }else if(res.code === -1){
                            jQuery('#epgrBusy').hideLoading();
                            var msg = res.msg;
                            alert("系统提示(电价设置):" + msg);
                            $('#mypriceSetModal').modal('hide');
                        }else{
                            jQuery('#epgrBusy').hideLoading();
                            var msg = res.msg;
                            alert("系统提示(电价设置):" + msg);
                            $('#mypriceSetModal').modal('hide');
                        }
                    })
                }
            }
            else {
                alert("系统提示(电价设置):尖峰谷值时间段从00:00~23:00，共24个时间点");
            }
        });
    }
    

}();
