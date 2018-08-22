var dx_ri = function () {

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
        //var nowDt = new Date();
        //var year = nowDt.getFullYear();
        //var month = parseInt(nowDt.getMonth()) + 1;
        //var day = nowDt.getDate();
        //var dtstr = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        var mt = moment(sessionStorage.sysDt);
        var nowDt = mt.format('YYYY-MM-DD');
        var startDt = mt.subtract(7, 'days').format('YYYY-MM-DD');
        $("#spDT").val(startDt);
        $("#epDT").val(nowDt);
        $('.dxDT').datetimepicker({
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

    //转换诊断时间格式
    var convertDxDT = function (DT) {
        var DTSplits = DT.split('-');
        return DTSplits[0] + '年' + DTSplits[1] + '月' + DTSplits[2] + '日';
    }

    var getDx = function () {
        sessionStorage.DxDT = convertDxDT($('#spDT').val());
        //获取整体能效数据
        getWholeNX();
        //获取冷却塔系统诊断数据
        getDxCT();
        //获取冷却水系统诊断数据
        getDxCW();
        //获取冷冻水系统诊断数据
        getDxChw();
        //获取综合冷机能效诊断数据
        getDxCh();
    }

    //获取综合冷机能效诊断数据
    var getDxCh = function () {

        if (sessionStorage.DxCh === "0" || sessionStorage.DxCh === undefined) {
            jQuery('#dxbusy').showLoading();
            $.ajax({
                type: 'post',
                url: sessionStorage.apiUrlPrefix + "ZKDx/GetDxChs",
                data: {
                    pId: sessionStorage.PointerID,
                    sp: encodeURIComponent($('#spDT').val()),
                    eTypeStr: '3'//日
                },
                async: true,
                dataType: 'json',
                success: function (ResponseModel) {

                    if (ResponseModel.code === 0) {

                        sessionStorage.DxCh = "1"; //1=已诊断；0=未诊断；
                        sessionStorage.DxChFHLTitle = ResponseModel.dxChFHLTitle;//冷机系统负荷率

                        sessionStorage.DxChFHLSte = ResponseModel.dxChFHLSte;
                        sessionStorage.DxChFHLDs = JSON.stringify(ResponseModel.dxChFHLDs);
                        sessionStorage.DxChFHLWellStd = ResponseModel.dxChFHLWellStd;
                        sessionStorage.DxChFHLBadStd = ResponseModel.dxChFHLBadStd;
                        sessionStorage.DxChFHLWellRatio = ResponseModel.dxChFHLWellRatio;
                        sessionStorage.DxChFHLBadRatio = ResponseModel.dxChFHLBadRatio;
                        $('#dxch_item_FHL').html();

                        if (sessionStorage.DxChFHLSte === '1') {
                            $('#dxch_item_FHL').html('1、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i> ' + sessionStorage.DxChFHLTitle + '');
                        }
                        else {
                            $('#dxch_item_FHL').html('1、<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i> ' + sessionStorage.DxChFHLTitle + '');
                        }
                        sessionStorage.DxChCWHSWTitle = ResponseModel.dxChCWHSWTitle;//冷却回水[进水]温度
                        sessionStorage.DxChCWHSWSte = ResponseModel.dxChCWHSWSte;
                        sessionStorage.DxChCWHSWDs = JSON.stringify(ResponseModel.dxChCWHSWDs);
                        sessionStorage.DxChCWHSWWellStd = ResponseModel.dxChCWHSWWellStd;
                        sessionStorage.DxChCWSHWBadStd = ResponseModel.dxChCWSHWBadStd;
                        sessionStorage.DxChCWHSWWellRatio = ResponseModel.dxChCWHSWWellRatio;
                        sessionStorage.DxChCWHSWBadRatio = ResponseModel.dxChCWHSWBadRatio;
                        if (sessionStorage.DxChCWHSWSte === '1') {
                            $('#dxch_item_hsw').html('3、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChCWHSWTitle + '');
                        } else {
                            $('#dxch_item_hsw').html('3、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + sessionStorage.DxChCWHSWTitle + '');
                        }
                        sessionStorage.DxChChwCSWTitle = ResponseModel.dxChChwCSWTitle;//冷冻出水[供水]温度
                        sessionStorage.DxChChwCSWSte = ResponseModel.dxChChwCSWSte;
                        sessionStorage.DxChChwCSWDs = JSON.stringify(ResponseModel.dxChChwCSWDs);
                        sessionStorage.DxChChwCSWWellStd = ResponseModel.dxChChwCSWWellStd;
                        sessionStorage.DxChChwCSWBadStd = ResponseModel.dxChChwCSWBadStd;
                        sessionStorage.DxChChwCSWWellRatio = ResponseModel.dxChChwCSWWellRatio;
                        sessionStorage.DxChChwCSWBadRatio = ResponseModel.dxChChwCSWBadRatio;
                        $('#dxch_item_csw').html();

                        if (sessionStorage.DxChChwCSWSte === '1') {
                            $('#dxch_item_csw').html('2、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChChwCSWTitle + '');
                        }
                        else {
                            $('#dxch_item_csw').html('2、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + sessionStorage.DxChChwCSWTitle + '');
                        }
                        sessionStorage.DxChStd = ResponseModel.dxChStd;//冷机COP效率
                        sessionStorage.DxChAcv = ResponseModel.dxChAcv;
                        sessionStorage.DxChDs = JSON.stringify(ResponseModel.dxChDs);
                        sessionStorage.DxChWellStd = ResponseModel.dxChWellStd;
                        sessionStorage.DxChBadStd = ResponseModel.dxChBadStd;
                        //单台冷机诊断集合
                        var chsgls = ResponseModel.dxChSGLs;
                        if (chsgls != undefined) {
                            sessionStorage.DxChSGLs = JSON.stringify(chsgls);
                            $('#chsglrow').html();
                            var chslgHTML = '';
                            var chslgINDEX = 7;
                            for (var i = 0; i < chsgls.length; i++) {
                                var chsgl = chsgls[i];
                                if (chsgl.DxChSGLSte === '1') {//正常
                                    chslgHTML += '<h5>' + chslgINDEX + '、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + chsgl.dxChSGLNt + '' + "诊断" + '</h5>';
                                }
                                else {//异常
                                    chslgHTML += '<h5>' + chslgINDEX + '、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + chsgl.dxChSGLNt + '' + "诊断" + '</h5>';
                                }
                                chslgINDEX += 1;
                            }
                            $('#chsglrow').html(chslgHTML)
                        }
                        jQuery('#dxbusy').hideLoading();
                    } else if (ResponseModel.code === -1) {
                        var xe = ResponseModel.msg;
                        if (xe.length > 0) {
                            //alert(xe);
                        }
                        jQuery('#dxbusy').hideLoading();
                    } else {
                        jQuery('#dxbusy').hideLoading();
                    }
                },
                error: function (xhr, res, err) {
                    var xe = err;
                    jQuery('#dxbusy').hideLoading();
                }
            });
        } else {
            $('#dxch_item_hsw').html();//冷却回水[进水]温度
            if (sessionStorage.DxChCWHSWSte === '1') {
                $('#dxch_item_hsw').html('3、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChCWHSWTitle + '');
            }
            else {
                $('#dxch_item_hsw').html('3、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + sessionStorage.DxChCWHSWTitle + '');
            }
            $('#dxch_item_csw').html();//冷冻出水[供水]温度
            if (sessionStorage.DxChChwCSWSte === '1') {

                $('#dxch_item_csw').html('2、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChChwCSWTitle + '');
            }
            else {
                $('#dxch_item_csw').html('2、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + sessionStorage.DxChChwCSWTitle + '');
            }
            $('#dxch_item_FHL').html();//冷机负荷率
            if (sessionStorage.DxChFHLSte === '1') {
                $('#dxch_item_FHL').html('1、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i> ' + sessionStorage.DxChFHLTitle + '');
            }
            else {
                $('#dxch_item_FHL').html('1、<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i> ' + sessionStorage.DxChFHLTitle + '');
            }
            if (sessionStorage.DxChSGLs != undefined) { //单台冷机诊断集合
                var chsgls = JSON.parse(sessionStorage.DxChSGLs);
                $('#chsglrow').html();
                var chslgHTML = '';
                var chslgINDEX = 7;

                for (var i = 0; i < chsgls.length; i++) {
                    var chsgl = chsgls[i];

                    if (chsgl.dxChSGLSte === 1) {
                        chslgHTML += '<h5>' + chslgINDEX + '、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + chsgl.dxChSGLNt + '' + "诊断" + '</h5>';
                    }
                    else {
                        chslgHTML += '<h5>' + chslgINDEX + '、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + chsgl.dxChSGLNt + '' + "诊断" + '</h5>';
                    }
                    chslgINDEX += 1;
                }
            }
            $('#chsglrow').html(chslgHTML)
        }
    }

    //获取冷冻水系统诊断数据
    var getDxChw = function () {
        if (sessionStorage.DxChw === "0" || sessionStorage.DxChw === undefined) {
            jQuery('#dxbusy').showLoading();
            $.ajax({
                type: 'post',
                url: sessionStorage.apiUrlPrefix + "ZKDx/GetDxChws",
                data: {
                    pId: sessionStorage.PointerID,
                    sp: encodeURIComponent($('#spDT').val()),
                    eTypeStr: '3'//日
                },
                async: true,
                dataType: 'json',
                success: function (ResponseModel) {

                    if (ResponseModel.code === 0) {
                        sessionStorage.DxChw = '1'; //1=已诊断；0=未诊断；
                        sessionStorage.DxChwGHSWCTitle = ResponseModel.dxChwGHSWCTitle;//冷冻泵供回水温差
                        sessionStorage.DxChwGHSWCSte = ResponseModel.dxChwGHSWCSte;
                        sessionStorage.DxChwGHSWCDs = JSON.stringify(ResponseModel.dxChwGHSWCDs);
                        sessionStorage.DxChwGHSWCWellStd = ResponseModel.dxChwGHSWCWellStd;
                        sessionStorage.DxChwGHSWCBadStd = ResponseModel.dxChwGHSWCBadStd;
                        sessionStorage.DxChwGHSWCWellRatio = ResponseModel.dxChwGHSWCWellRatio;
                        sessionStorage.DxChwGHSWCBadRatio = ResponseModel.dxChwGHSWCBadRatio;
                        $('#dxchw_item_ghswc').html();

                        if (sessionStorage.DxChwGHSWCSte === '1') {

                            $('#dxchw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
                        }
                        else if (sessionStorage.DxChwGHSWCSte === '0') {

                            $('#dxchw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
                        }
                        else {

                            $('#dxchw_item_ghswc').html('1、<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
                        }
                        sessionStorage.DxChwMDYCTitle = ResponseModel.dxChwMDYCTitle;//冷冻泵末端压差
                        sessionStorage.DxChwMDYCSte = ResponseModel.dxChwMDYCSte;
                        sessionStorage.DxChwMDYCDs = JSON.stringify(ResponseModel.dxChwMDYCDs);
                        sessionStorage.DxChwMDYCWellStd = ResponseModel.dxChwMDYCWellStd;
                        sessionStorage.DxChwMDYCBadStd = ResponseModel.dxChwMDYCBadStd;
                        sessionStorage.DxChwMDYCWellRatio = ResponseModel.dxChwMDYCWellRatio;
                        sessionStorage.DxChwMDYCBadRatio = ResponseModel.dxChwMDYCBadStd;
                        $('#dxchw_item_mdyc').html();
                        if (sessionStorage.DxChwMDYCSte === '1') {
                            $('#dxchw_item_mdyc').html('2、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChwMDYCTitle + '');
                        }
                        else if (sessionStorage.DxChwMDYCSte === '0') {
                            $('#dxchw_item_mdyc').html('2、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + sessionStorage.DxChwMDYCTitle + '');
                        }
                        else {
                            $('#dxchw_item_mdyc').html('2、<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:0px;"></i> ' + sessionStorage.DxChwMDYCTitle + '');
                        }
                        sessionStorage.DxChwStd = ResponseModel.dxChwStd;//冷冻泵输送系数
                        sessionStorage.DxChwAcv = ResponseModel.dxChwAcv;
                        sessionStorage.DxChwDs = JSON.stringify(ResponseModel.dxChwDs);
                        sessionStorage.DxChwWellStd = ResponseModel.dxChwWellStd;
                        sessionStorage.DxChwBadStd = ResponseModel.dxChwBadStd;
                        jQuery('#dxbusy').hideLoading();
                    }
                    else if (ResponseModel.code === -2) {
                        jQuery('#dxbusy').hideLoading();
                    }
                    else {
                        var xe = ResponseModel.msg;
                        if (xe.length > 0) {
                            //alert(xe);
                        }
                        jQuery('#dxbusy').hideLoading();
                    }
                },
                error: function (xhr, res, err) {
                    var xe = err;
                    jQuery('#dxbusy').hideLoading();
                }
            });
        }
        else {
            $('#dxchw_item_ghswc').html();//冷冻泵供回水温差
            if (sessionStorage.DxChwGHSWCSte === 1) {
                $('#dxchw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
            }
            else if (sessionStorage.DxChwGHSWCSte === 0) {
                $('#dxchw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
            } else {
                $('#dxchw_item_ghswc').html('1、<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
            }
            $('#dxchw_item_mdyc').html();//冷冻泵末端压差
            if (sessionStorage.DxChwMDYCSte === 1) {
                $('#dxchw_item_mdyc').html('2、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChwMDYCTitle + '');
            }
            else if (sessionStorage.DxChwMDYCSte === 0) {
                $('#dxchw_item_mdyc').html('2、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + sessionStorage.DxChwMDYCTitle + '');
            }
            else {
                $('#dxchw_item_mdyc').html('2、<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:0px;"></i> ' + sessionStorage.DxChwMDYCTitle + '');
            }
        }
    }

    //获取冷却水系统诊断数据
    var getDxCW = function () {
        if (sessionStorage.DxCW === "0" || sessionStorage.DxCW === undefined) {
            jQuery('#dxbusy').showLoading();
            $.ajax({
                type: 'post',
                url: sessionStorage.apiUrlPrefix + "ZKDx/GetDxCWs",
                data: {
                    pId: sessionStorage.PointerID,
                    sp: encodeURIComponent($('#spDT').val()),
                    eTypeStr: '3'//日
                },
                async: true,
                dataType: 'json',
                success: function (ResponseModel) {

                    console.log(ResponseModel);

                    if (ResponseModel.code === 0) {
                        sessionStorage.DxCW = "1"; //1=已诊断；0=未诊断；
                        sessionStorage.DxCWGHSWCTitle = ResponseModel.dxcwghswcTitle;
                        sessionStorage.DxCWGHSWCSte = ResponseModel.dxcwghswcSte;
                        sessionStorage.DxCWGHSWCDs = JSON.stringify(ResponseModel.dxcwghswcDs);
                        sessionStorage.DxCWGHSWCWellStd = ResponseModel.dxcwghswcWellStd;
                        sessionStorage.DxCWGHSWCBadStd = ResponseModel.dxcwghswcBadStd;
                        sessionStorage.DxCWGHSWCWellRatio = ResponseModel.dxcwghswcBadStd;
                        sessionStorage.DxCWGHSWCBadRatio = ResponseModel.dxcwghswcBadRatio;
                        $('#dxcw_item_ghswc').html();
                        if (sessionStorage.DxCWGHSWCSte === "1") {
                            $('#dxcw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i> '+ sessionStorage.DxCWGHSWCTitle + '');
                        }
                        else if (sessionStorage.DxCWGHSWCSte === "0") {
                            $('#dxcw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i> '+ sessionStorage.DxCWGHSWCTitle + '');
                        }
                        else {
                            $('#dxcw_item_ghswc').html('1、<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i> '+ sessionStorage.DxCWGHSWCTitle + '');
                        }
                        sessionStorage.DxCWAcv = ResponseModel.dxcwAcv;
                        sessionStorage.DxCWStd = ResponseModel.dxcwStd;
                        sessionStorage.DxCWDs = JSON.stringify(ResponseModel.dxcwDs);
                        sessionStorage.DxCWWellStd = ResponseModel.dxcwWellStd;
                        sessionStorage.DxCWBadStd = ResponseModel.dxcwBadStd;
                        jQuery('#dxbusy').hideLoading();
                    }
                    else if (ResponseModel.code === -2) {
                        jQuery('#dxbusy').hideLoading();
                    }
                    else {
                        var xe = ResponseModel.msg;
                        if (xe.length > 0) {
                            //alert(xe);
                        }
                        jQuery('#dxbusy').hideLoading();
                    }
                },
                error: function (xhr, res, err) {
                    var xe = err;
                    jQuery('#dxbusy').hideLoading();
                }
            });
        }
        else {
            $('#dxcw_item_ghswc').html();

            if (sessionStorage.DxCWGHSWCSte === "1") {
                $('#dxcw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i> ' + sessionStorage.DxCWGHSWCTitle + '');
            }
            else if (sessionStorage.DxCWGHSWCSte === "0") {
                $('#dxcw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i> ' + sessionStorage.DxCWGHSWCTitle + '');
            }
            else {
                $('#dxcw_item_ghswc').html('1、<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i> ' + sessionStorage.DxCWGHSWCTitle + '');
            }
        }
    }

    //获取冷却塔系统诊断数据
    var getDxCT = function () {
        if (sessionStorage.DxCT === "0" || sessionStorage.DxCT === undefined) {
            jQuery('#dxbusy').showLoading();
            $.ajax({
                type: 'post',
                url: sessionStorage.apiUrlPrefix + "ZKDx/GetDxCTs",
                data: {
                    pId: sessionStorage.PointerID,
                    sp: encodeURIComponent($('#spDT').val()),
                    eTypeStr: '3'//日
                },
                async: true,
                dataType: 'json',
                success: function (ResponseModel) {

                    console.log(ResponseModel)

                    if (ResponseModel.code === 0) {
                        sessionStorage.DxCT = "1"; //1=已诊断；0=未诊断；
                        sessionStorage.DxCTXLTitle = ResponseModel.dxctxlTitle;
                        sessionStorage.DxCTXLSte = ResponseModel.dxctxlSte;
                        sessionStorage.DxCTXLDs = JSON.stringify(ResponseModel.dxctxlDs);
                        sessionStorage.DxCTXLWellStd = ResponseModel.dxctxlWellStd;
                        sessionStorage.DxCTXLBadStd = ResponseModel.dxctxlBadStd;
                        sessionStorage.DxCTXLWellRatio = ResponseModel.dxctxlWellRatio;
                        sessionStorage.DxCTXLBadRatio = ResponseModel.dxctxlBadRatio;
                        $('#dxct_item_zsxl').html();
                        if (sessionStorage.DxCTXLSte === "1") {
                            $('#dxct_item_zsxl').html('1、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i> '+ sessionStorage.DxCTXLTitle + '');
                        }
                        else if (sessionStorage.DxCTXLSte === "0") {
                            $('#dxct_item_zsxl').html('1、<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i> ' + sessionStorage.DxCTXLTitle + '');
                        }
                        else {
                            $('#dxct_item_zsxl').html('1、<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i> '+ sessionStorage.DxCTXLTitle + '');
                        }
                        sessionStorage.DxCTAcv = ResponseModel.dxctAcv;
                        sessionStorage.DxCTStd = ResponseModel.dxctStd;
                        sessionStorage.DxCTDs = JSON.stringify(ResponseModel.dxctDs);
                        sessionStorage.DxCTWellStd = ResponseModel.dxctWellStd;
                        sessionStorage.DxCTBadStd = ResponseModel.dxctBadStd;
                        jQuery('#dxbusy').hideLoading();
                    }
                    else if (ResponseModel.code === -2) {
                        jQuery('#dxbusy').hideLoading();
                    }
                    else {
                        var xe = ResponseModel.msg;
                        if (xe.length > 0) {
                            //alert(xe);
                        }
                        jQuery('#dxbusy').hideLoading();
                    }
                },
                error: function (xhr, res, err) {
                    var xe = err;
                    jQuery('#dxbusy').hideLoading();
                }
            });
        }
        else {
            $('#dxct_item_zsxl').html();
            if (sessionStorage.DxCTXLSte === "1") {
                $('#dxct_item_zsxl').html('1、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i> '+ sessionStorage.DxCTXLTitle + '');
            }
            else if (sessionStorage.DxCTXLSte === "0") {
                $('#dxct_item_zsxl').html('1、<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i> '+ sessionStorage.DxCTXLTitle + '');
            }
            else {
                $('#dxct_item_zsxl').html('1、<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i> '+ sessionStorage.DxCTXLTitle + '');
            }
        }
    }

    //获取整体能效数据
    var getWholeNX = function () {
        jQuery('#dxbusy').showLoading();
        var url = sessionStorage.apiUrlPrefix + "ZKDx/GetDxriWholeNXs";
        $.post(url, {
            pId: sessionStorage.PointerID,
            sp: encodeURIComponent($('#spDT').val())
        }, function (res) {
            if (res.code === 0) {
                //1=已查询；0=未查询；
                sessionStorage.DxNX = "1";

                $('#eer_Text').html(res.eer);
                $('#chw_Text').html(res.chw);
                $('#cop_Text').html(res.cop);
                $('#cw_Text').html(res.cw);
                $('#ct_Text').html(res.ct);
                $('#nx_Text').html(res.nx);
                //(优良=b)蓝色77cdd0;(一般=y)黄色ffe699;(欠佳=r)红色f4b183
                if (res.eerQuo === 'b') {
                    $('#canvas_eer').css('background-color', '#77cdd0');
                }
                else if (res.eerQuo === 'r') {
                    $('#canvas_eer').css('background-color', '#f4b183');
                }
                else if (res.eerQuo === 'y') {
                    $('#canvas_eer').css('background-color', '#ffe699');
                }
                //冷源能效
                if (res.nxQuo === 'b') {
                    $('#canvas_nx').css('background-color', '#77cdd0');
                }
                else if (res.nxQuo === 'r') {
                    $('#canvas_nx').css('background-color', '#f4b183');
                }
                else if (res.nxQuo === 'y') {
                    $('#canvas_nx').css('background-color', '#ffe699');
                }
                //冷冻水输送系数
                if (res.chwQuo === 'b') {
                    $('#canvas_chw').css('background-color', '#77cdd0');
                }
                else if (res.chwQuo === 'r') {
                    $('#canvas_chw').css('background-color', '#f4b183');
                }
                else if (res.chwQuo === 'y') {
                    $('#canvas_chw').css('background-color', '#ffe699');
                }
                //综合冷机能效值
                if (res.copQuo === 'b') {
                    $('#canvas_cop').css('background-color', '#77cdd0');
                }
                else if (res.copQuo === 'r') {
                    $('#canvas_cop').css('background-color', '#f4b183');
                }
                else if (res.copQuo === 'y') {
                    $('#canvas_cop').css('background-color', '#ffe699');
                }
                //冷却水输送系数
                if (res.cwQuo === 'b') {
                    $('#canvas_cw').css('background-color', '#77cdd0');
                }
                else if (res.cwQuo === 'r') {
                    $('#canvas_cw').css('background-color', '#f4b183');
                }
                else if (res.cwQuo === 'y') {
                    $('#canvas_cw').css('background-color', '#ffe699');
                }
                //冷却塔风机输送系数
                if (res.ctQuo === 'b') {
                    $('#canvas_ctc').css('background-color', '#77cdd0');
                }
                else if (res.ctQuo === 'r') {
                    $('#canvas_ctc').css('background-color', '#f4b183');
                }
                else if (res.ctQuo === 'y') {
                    $('#canvas_ctc').css('background-color', '#ffe699');
                }
                jQuery('#dxbusy').hideLoading();
            } else if (res.code === -1) {
                jQuery('#dxbusy').hideLoading();
                alert('异常错误(系统诊断):' + res.msg);
            } else {
                jQuery('#dxbusy').hideLoading();
            }
        })
    }

    return {
        init: function () {
            //var pos = JSON.parse(sessionStorage.pointers);
            //var po = pos[0];
            //sessionStorage.PointerID = po.pointerID;
            //sessionStorage.PointerName = po.pointerName;
            //sessionStorage.EprID = po.enterpriseID;
            //sessionStorage.EprName = po.eprName;
            //初始化时间控件
            initdatetimepicker();
            $('#DxriBtn').on('click', function () {
                sessionStorage.DxCh = "0";
                sessionStorage.DxChw = "0";
                sessionStorage.DxCW = "0";
                sessionStorage.DxCT = "0";
                //sessionStorage.DxNX = "0";
                getDx();
            });
            //获取诊断
            getDx();
        }
    }


}();