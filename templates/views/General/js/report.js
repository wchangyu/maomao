var Report = function () {

    //选中日期
    var selectDt;

    //选中导出报表
    var selectRpt = "ztnx";//默认

    //各报表文本
    var divTs = ['ztnxText', 'ztebText', 'ztbrText', 'zticText', 'nxbaText'];

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

    //初始化时间控件
    var initdatetimepicker = function () {
        var nowDt=new Date();
        var year=nowDt.getFullYear();
        var month=parseInt(nowDt.getMonth())+1;
        var day=nowDt.getDate();
        selectDt=year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        $("#spDT").val(selectDt);
        change_day();
    };

    //切换日
    function change_day() {

        $('.reportDT').datepicker('destroy');

        $('.reportDT').datepicker({
            format: 'yyyy-mm-dd',
            language: 'en',
            weekStart: true,
            todayBtn: true,
            autoclose: true,
            todayHighlight: true,
            //startView: 2,
            //minView: 2,
            //minuteStep: 10,
            forceParse: 0,
            pickerPosition: "bottom-left"
        }).on('changeDate', function (ev) {
            var year = ev.date.getFullYear();
            var month = addZeroToSingleNumber(parseInt(ev.date.getMonth()) + 1);
            var date = addZeroToSingleNumber(parseInt(ev.date.getDate()));
            selectDt = year + "-" + month + "-" + date;
        });
    }

    //切换月
    function change_month() {

        $('.reportDT').datepicker('destroy');

        $('.reportDT').datepicker({
            autoclose: true,
            startView: 1,
            maxViewMode: 2,
            minViewMode: 1,
            format: "yyyy-mm",
            language: "en",
            pickerPosition: "bottom-left"
        }).on('changeDate', function (ev) {
            var year = ev.date.getFullYear();
            var month = addZeroToSingleNumber(parseInt(ev.date.getMonth()) + 1);
            var date = addZeroToSingleNumber(parseInt(ev.date.getDate()));
            selectDt = year + "-" + month + "-" + date;
        });
    }

    //切换年
    function change_year() {

        $('.reportDT').datepicker('destroy');

        $('.reportDT').datepicker({
            autoclose: true,
            startView: 2,
            maxViewMode: 2,
            minViewMode: 2,
            format: "yyyy",
            language: "en",
            pickerPosition: "bottom-left"
        }).on('changeDate', function (ev) {
            var year = ev.date.getFullYear();
            var month = addZeroToSingleNumber(parseInt(ev.date.getMonth()) + 1);
            var date = addZeroToSingleNumber(parseInt(ev.date.getDate()));
            selectDt = year + "-" + month + "-" + date;
        });
    }
    
    //切换并且选中报表类型
    var changeTile = function () {
        $('.tile').on('click', function () {
            if (!$(this).hasClass('bg-grey')) {
                var Id = $(this).attr('Id');
                var IdText = eval(Id + "Text");
                for (var i = 0; i < divTs.length; i++) {
                    var divNT = divTs[i];
                    if (IdText.id === divNT) {
                        $(IdText).show();
                    }
                    else {
                        var IdivNT = eval(divNT);
                        $(IdivNT).hide();
                    }
                }
                selectRpt = Id;
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    selectRpt = "";
                }
                else {
                    $('.tile').each(function (index, item) {
                        $(this).removeClass('selected');
                    });
                    $(this).addClass('selected');
                }
            }
        });
    }

    //切换时间间隔
    var changeEType = function () {
        $("#eType").change(function () {
            var eType = $(this).children('option:selected').val();
            if (eType === "3") {
                $('.reportDT').datepicker('destroy');
                change_day();
            }
            if (eType === "5") {
                $('.reportDT').datepicker('destroy');
                change_month();
            }
            if (eType === "6") {
                $('.reportDT').datepicker('destroy');
                change_year();
            }
        });
    }

    //导出报表
    var exportForm = function () {
        $('#exportBtn').on('click', function () {
            jQuery('#reportBusy').showLoading();
            var eType = $('#eType').val();
            if (selectRpt.length > 0) {
                var pId = sessionStorage.PointerID;
                var pNt = encodeURIComponent(sessionStorage.PointerName);
                if (selectRpt === "ztnx") {//整体报表
                    var url = sessionStorage.apiUrlPrefix + "ZTNXReport/ReportFormZTNXs?pId=" + pId
                        + "&pNt=" + encodeURIComponent(pNt)
                        + "&sp=" + selectDt
                        + "&eType=" + eType;
                    window.open(url, "_self", true);
                }
                else if (selectRpt === "zteb") {//电耗报表
                    var url = sessionStorage.apiUrlPrefix + "ZTEBReport/ReportFormZTEBs?pId=" + pId
                        + "&pNt=" + encodeURIComponent(pNt)
                        + "&sp=" + selectDt
                        + "&eType=" + eType;
                    window.open(url, "_self", true);
                }
                else if (selectRpt === "ztbr") {//负荷报表
                    var url = sessionStorage.apiUrlPrefix + "ZTBRReport/ReportFormZTBRs?pId=" + pId
                        + "&pNt=" + encodeURIComponent(pNt)
                        + "&sp=" + selectDt
                        + "&eType=" + eType;
                    window.open(url, "_self", true);
                }
                else if (selectRpt === "ztic") {//能效报表
                    var url = sessionStorage.apiUrlPrefix + "ZTICReport/ReportFormZTICs?pId=" + pId
                        + "&pNt=" + encodeURIComponent(pNt)
                        + "&sp=" + selectDt
                        + "&eType=" + eType;
                    window.open(url, "_self", true);
                }
                else if (selectRpt === "nxba") {//能效对标分析报表
                    var url = sessionStorage.apiUrlPrefix + "NXBAReport/ReportFormNXBAs?pId=" + pId
                        + "&pNt=" + encodeURIComponent(pNt)
                        + "&sp=" + selectDt
                        + "&eType=" + eType;
                    window.open(url, "_self", true);
                }
            }
            else {
                console.log("Prompt(export ):Please select report type ");
            }
            jQuery('#reportBusy').hideLoading();
        });
    }

    return {
        init: function () {
            //初始化时间控件
            initdatetimepicker();
            //切换并且选中报表类型
            changeTile();
            //切换时间间隔
            changeEType();
            //导出报表
            exportForm();
        }
    }

}();