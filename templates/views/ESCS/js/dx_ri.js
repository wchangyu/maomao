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
        var nowDt = new Date();
        var year = nowDt.getFullYear();
        var month = parseInt(nowDt.getMonth()) + 1;
        var day = nowDt.getDate();
        var dtstr = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        var mt = moment(dtstr);
        var nowDt = mt.format('YYYY-MM-DD');
        var startDt = mt.subtract(7, 'days').format('YYYY-MM-DD');
        $("#spDT").val(startDt);
        $("#epDT").val(nowDt);
        $('.abbrDT').datetimepicker({
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
                url: sessionStorage.apiUrlPrefix + "Dx/GetDxChs",
                data: {
                    pId: sessionStorage.PointerID,
                    sp: encodeURIComponent($('#spDT').val()),
                    eTypeStr: '3'//日
                },
                async: true,
                dataType: 'json',
                success: function (ResponseModel) {
                    if (ResponseModel.code === "0") {
                        sessionStorage.DxCh = "1"; //1=已诊断；0=未诊断；
                        sessionStorage.DxChFHLTitle = ResponseModel.DxChFHLTitle;//冷机系统负荷率
                        sessionStorage.DxChFHLSte = ResponseModel.DxChFHLSte;
                        sessionStorage.DxChFHLDs = JSON.stringify(ResponseModel.DxChFHLDs);
                        sessionStorage.DxChFHLWellStd = ResponseModel.DxChFHLWellStd;
                        sessionStorage.DxChFHLBadStd = ResponseModel.DxChFHLBadStd;
                        sessionStorage.DxChFHLWellRatio = ResponseModel.DxChFHLWellRatio;
                        sessionStorage.DxChFHLBadRatio = ResponseModel.DxChFHLBadRatio;
                        $('#dxch_item_FHL').html();
                        if (sessionStorage.DxChFHLSte === "1") {
                            $('#dxch_item_FHL').html('1、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i> ' + sessionStorage.DxChFHLTitle + '');
                        }
                        else {
                            $('#dxch_item_FHL').html('1、<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i> ' + sessionStorage.DxChFHLTitle + '');
                        }
                        sessionStorage.DxChCWHSWTitle = ResponseModel.DxChCWHSWTitle;//冷却回水[进水]温度
                        sessionStorage.DxChCWHSWSte = ResponseModel.DxChCWHSWSte;
                        sessionStorage.DxChCWHSWDs = JSON.stringify(ResponseModel.DxChCWHSWDs);
                        sessionStorage.DxChCWHSWWellStd = ResponseModel.DxChCWHSWWellStd;
                        sessionStorage.DxChCWSHWBadStd = ResponseModel.DxChCWSHWBadStd;
                        sessionStorage.DxChCWHSWWellRatio = ResponseModel.DxChCWHSWWellRatio;
                        sessionStorage.DxChCWHSWBadRatio = ResponseModel.DxChCWHSWBadRatio;
                        if (sessionStorage.DxChCWHSWSte === "1") {
                            $('#dxch_item_hsw').html('3、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChCWHSWTitle + '');
                        } else {
                            $('#dxch_item_hsw').html('3、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + sessionStorage.DxChCWHSWTitle + '');
                        }
                        sessionStorage.DxChChwCSWTitle = ResponseModel.DxChChwCSWTitle;//冷冻出水[供水]温度
                        sessionStorage.DxChChwCSWSte = ResponseModel.DxChChwCSWSte;
                        sessionStorage.DxChChwCSWDs = JSON.stringify(ResponseModel.DxChChwCSWDs);
                        sessionStorage.DxChChwCSWWellStd = ResponseModel.DxChChwCSWWellStd;
                        sessionStorage.DxChChwCSWBadStd = ResponseModel.DxChChwCSWBadStd;
                        sessionStorage.DxChChwCSWWellRatio = ResponseModel.DxChChwCSWWellRatio;
                        sessionStorage.DxChChwCSWBadRatio = ResponseModel.DxChChwCSWBadRatio;
                        $('#dxch_item_csw').html();
                        if (sessionStorage.DxChChwCSWSte === "1") {
                            $('#dxch_item_csw').html('2、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChChwCSWTitle + '');
                        }
                        else {
                            $('#dxch_item_csw').html('2、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + sessionStorage.DxChChwCSWTitle + '');
                        }
                        sessionStorage.DxChStd = ResponseModel.DxChStd;//冷机COP效率
                        sessionStorage.DxChAcv = ResponseModel.DxChAcv;
                        sessionStorage.DxChDs = JSON.stringify(ResponseModel.DxChDs);
                        sessionStorage.DxChWellStd = ResponseModel.DxChWellStd;
                        sessionStorage.DxChBadStd = ResponseModel.DxChBadStd;
                        //单台冷机诊断集合
                        var chsgls = ResponseModel.DxChSGLs;
                        if (chsgls != undefined) {
                            sessionStorage.DxChSGLs = JSON.stringify(chsgls);
                            $('#chsglrow').html();
                            var chslgHTML = '';
                            var chslgINDEX = 7;
                            for (var i = 0; i < chsgls.length; i++) {
                                var chsgl = chsgls[i];
                                if (chsgl.DxChSGLSte === "1") {//正常
                                    chslgHTML += '<h5>' + chslgINDEX + '、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + chsgl.DxChSGLNt + '' + "诊断" + '</h5>';
                                }
                                else {//异常
                                    chslgHTML += '<h5>' + chslgINDEX + '、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + chsgl.DxChSGLNt + '' + "诊断" + '</h5>';
                                }
                                chslgINDEX += 1;
                            }
                            $('#chsglrow').html(chslgHTML)
                        }
                        jQuery('#dxbusy').hideLoading();
                    } else if (ResponseModel.code === "-1") {
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
            if (sessionStorage.DxChCWHSWSte === "1") {
                $('#dxch_item_hsw').html('3、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChCWHSWTitle + '');
            }
            else {
                $('#dxch_item_hsw').html('3、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + sessionStorage.DxChCWHSWTitle + '');
            }
            $('#dxch_item_csw').html();//冷冻出水[供水]温度
            if (sessionStorage.DxChChwCSWSte === "1") {
                $('#dxch_item_csw').html('2、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChChwCSWTitle + '');
            }
            else {
                $('#dxch_item_csw').html('2、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + sessionStorage.DxChChwCSWTitle + '');
            }
            $('#dxch_item_FHL').html();//冷机负荷率
            if (sessionStorage.DxChFHLSte === "1") {
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
                    if (chsgl.DxChSGLSte === "1") {
                        chslgHTML += '<h5>' + chslgINDEX + '、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + chsgl.DxChSGLNt + '' + "诊断" + '</h5>';
                    }
                    else {
                        chslgHTML += '<h5>' + chslgINDEX + '、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + chsgl.DxChSGLNt + '' + "诊断" + '</h5>';
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
                url: sessionStorage.apiUrlPrefix + "Dx/GetDxChws",
                data: {
                    pId: sessionStorage.PointerID,
                    sp: encodeURIComponent($('#spDT').val()),
                    eTypeStr: '3'//日
                },
                async: true,
                dataType: 'json',
                success: function (ResponseModel) {
                    if (ResponseModel.code === "0") {
                        sessionStorage.DxChw = "1"; //1=已诊断；0=未诊断；
                        sessionStorage.DxChwGHSWCTitle = ResponseModel.DxChwGHSWCTitle;//冷冻泵供回水温差
                        sessionStorage.DxChwGHSWCSte = ResponseModel.DxChwGHSWCSte;
                        sessionStorage.DxChwGHSWCDs = JSON.stringify(ResponseModel.DxChwGHSWCDs);
                        sessionStorage.DxChwGHSWCWellStd = ResponseModel.DxChwGHSWCWellStd;
                        sessionStorage.DxChwGHSWCBadStd = ResponseModel.DxChwGHSWCBadStd;
                        sessionStorage.DxChwGHSWCWellRatio = ResponseModel.DxChwGHSWCWellRatio;
                        sessionStorage.DxChwGHSWCBadRatio = ResponseModel.DxChwGHSWCBadRatio;
                        $('#dxchw_item_ghswc').html();
                        if (sessionStorage.DxChwGHSWCSte === "1") {
                            $('#dxchw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
                        }
                        else if (sessionStorage.DxChwGHSWCSte === "0") {
                            $('#dxchw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
                        }
                        else {
                            $('#dxchw_item_ghswc').html('1、<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
                        }
                        sessionStorage.DxChwMDYCTitle = ResponseModel.DxChwMDYCTitle;//冷冻泵末端压差
                        sessionStorage.DxChwMDYCSte = ResponseModel.DxChwMDYCSte;
                        sessionStorage.DxChwMDYCDs = JSON.stringify(ResponseModel.DxChwMDYCDs);
                        sessionStorage.DxChwMDYCWellStd = ResponseModel.DxChwMDYCWellStd;
                        sessionStorage.DxChwMDYCBadStd = ResponseModel.DxChwMDYCBadStd;
                        sessionStorage.DxChwMDYCWellRatio = ResponseModel.DxChwMDYCWellRatio;
                        sessionStorage.DxChwMDYCBadRatio = ResponseModel.DxChwMDYCBadStd;
                        $('#dxchw_item_mdyc').html();
                        if (sessionStorage.DxChwMDYCSte === "1") {
                            $('#dxchw_item_mdyc').html('2、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChwMDYCTitle + '');
                        }
                        else if (sessionStorage.DxChwMDYCSte === "0") {
                            $('#dxchw_item_mdyc').html('2、<i class="fa fa-circle-o" style="color:#c00000;margin-left:0px;"></i> ' + sessionStorage.DxChwMDYCTitle + '');
                        }
                        else {
                            $('#dxchw_item_mdyc').html('2、<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:0px;"></i> ' + sessionStorage.DxChwMDYCTitle + '');
                        }
                        sessionStorage.DxChwStd = ResponseModel.DxChwStd;//冷冻泵输送系数
                        sessionStorage.DxChwAcv = ResponseModel.DxChwAcv;
                        sessionStorage.DxChwDs = JSON.stringify(ResponseModel.DxChwDs);
                        sessionStorage.DxChwWellStd = ResponseModel.DxChwWellStd;
                        sessionStorage.DxChwBadStd = ResponseModel.DxChwBadStd;
                        jQuery('#dxbusy').hideLoading();
                    }
                    else if (ResponseModel.code === "-2") {
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
            if (sessionStorage.DxChwGHSWCSte === "1") {
                $('#dxchw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
            }
            else if (sessionStorage.DxChwGHSWCSte === "0") {
                $('#dxchw_item_ghswc').html('1、<i class="fa fa-circle-o" style="color:#c00000;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
            } else {
                $('#dxchw_item_ghswc').html('1、<i class="fa fa-question-circle" style="color:#c4c4c4;margin-left:2px;"></i> ' + sessionStorage.DxChwGHSWCTitle + '');
            }
            $('#dxchw_item_mdyc').html();//冷冻泵末端压差
            if (sessionStorage.DxChwMDYCSte === "1") {
                $('#dxchw_item_mdyc').html('2、<i class="fa fa-circle-o" style="color:#98dbd1;margin-left:0px;"></i> ' + sessionStorage.DxChwMDYCTitle + '');
            }
            else if (sessionStorage.DxChwMDYCSte === "0") {
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
                url: sessionStorage.apiUrlPrefix + "Dx/GetDxCWs",
                data: {
                    pId: sessionStorage.PointerID,
                    sp: encodeURIComponent($('#spDT').val()),
                    eTypeStr: '3'//日
                },
                async: true,
                dataType: 'json',
                success: function (ResponseModel) {
                    if (ResponseModel.code === "0") {
                        sessionStorage.DxCW = "1"; //1=已诊断；0=未诊断；
                        sessionStorage.DxCWGHSWCTitle = ResponseModel.DxCWGHSWCTitle;
                        sessionStorage.DxCWGHSWCSte = ResponseModel.DxCWGHSWCSte;
                        sessionStorage.DxCWGHSWCDs = JSON.stringify(ResponseModel.DxCWGHSWCDs);
                        sessionStorage.DxCWGHSWCWellStd = ResponseModel.DxCWGHSWCWellStd;
                        sessionStorage.DxCWGHSWCBadStd = ResponseModel.DxCWGHSWCBadStd;
                        sessionStorage.DxCWGHSWCWellRatio = ResponseModel.DxCWGHSWCWellRatio;
                        sessionStorage.DxCWGHSWCBadRatio = ResponseModel.DxCWGHSWCBadRatio;
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
                        sessionStorage.DxCWAcv = ResponseModel.DxCWAcv;
                        sessionStorage.DxCWStd = ResponseModel.DxCWStd;
                        sessionStorage.DxCWDs = JSON.stringify(ResponseModel.DxCWDs);
                        sessionStorage.DxCWWellStd = ResponseModel.DxCWWellStd;
                        sessionStorage.DxCWBadStd = ResponseModel.DxCWBadStd;
                        jQuery('#dxbusy').hideLoading();
                    }
                    else if (ResponseModel.code === "-2") {
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
                url: sessionStorage.apiUrlPrefix + "Dx/GetDxCTs",
                data: {
                    pId: sessionStorage.PointerID,
                    sp: encodeURIComponent($('#spDT').val()),
                    eTypeStr: '3'//日
                },
                async: true,
                dataType: 'json',
                success: function (ResponseModel) {
                    if (ResponseModel.code === "0") {
                        sessionStorage.DxCT = "1"; //1=已诊断；0=未诊断；
                        sessionStorage.DxCTXLTitle = ResponseModel.DxCTXLTitle;
                        sessionStorage.DxCTXLSte = ResponseModel.DxCTXLSte;
                        sessionStorage.DxCTXLDs = JSON.stringify(ResponseModel.DxCTXLDs);
                        sessionStorage.DxCTXLWellStd = ResponseModel.DxCTXLWellStd;
                        sessionStorage.DxCTXLBadStd = ResponseModel.DxCTXLBadStd;
                        sessionStorage.DxCTXLWellRatio = ResponseModel.DxCTXLWellRatio;
                        sessionStorage.DxCTXLBadRatio = ResponseModel.DxCTXLBadRatio;
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
                        sessionStorage.DxCTAcv = ResponseModel.DxCTAcv;
                        sessionStorage.DxCTStd = ResponseModel.DxCTStd;
                        sessionStorage.DxCTDs = JSON.stringify(ResponseModel.DxCTDs);
                        sessionStorage.DxCTWellStd = ResponseModel.DxCTWellStd;
                        sessionStorage.DxCTBadStd = ResponseModel.DxCTBadStd;
                        jQuery('#dxbusy').hideLoading();
                    }
                    else if (ResponseModel.code === "-2") {
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
        var url = sessionStorage.apiUrlPrefix + "Dx/GetDxriWholeNXs";
        $.post(url, {
            pId: sessionStorage.PointerID,
            sp: encodeURIComponent($('#spDT').val())
        }, function (res) {
            if (res.code === 0) {
                //1=已查询；0=未查询；
                sessionStorage.DxNX = "1";
                $('#eer_Text').html(ResponseModel.eer);
                $('#chw_Text').html(ResponseModel.chw);
                $('#cop_Text').html(ResponseModel.cop);
                $('#cw_Text').html(ResponseModel.cw);
                $('#ct_Text').html(ResponseModel.ct);
                $('#nx_Text').html(ResponseModel.nx);
                //(优良=b)蓝色77cdd0;(一般=y)黄色ffe699;(欠佳=r)红色f4b183
                if (ResponseModel.eerQuo === 'b') {
                    $('#canvas_eer').css('background-color', '#77cdd0');
                }
                else if (ResponseModel.eerQuo === 'r') {
                    $('#canvas_eer').css('background-color', '#f4b183');
                }
                else if (ResponseModel.eerQuo === 'y') {
                    $('#canvas_eer').css('background-color', '#ffe699');
                }
                //冷源能效
                if (ResponseModel.nxQuo === 'b') {
                    $('#canvas_nx').css('background-color', '#77cdd0');
                }
                else if (ResponseModel.nxQuo === 'r') {
                    $('#canvas_nx').css('background-color', '#f4b183');
                }
                else if (ResponseModel.nxQuo === 'y') {
                    $('#canvas_nx').css('background-color', '#ffe699');
                }
                //冷冻水输送系数
                if (ResponseModel.chwQuo === 'b') {
                    $('#canvas_chw').css('background-color', '#77cdd0');
                }
                else if (ResponseModel.chwQuo === 'r') {
                    $('#canvas_chw').css('background-color', '#f4b183');
                }
                else if (ResponseModel.chwQuo === 'y') {
                    $('#canvas_chw').css('background-color', '#ffe699');
                }
                //综合冷机能效值
                if (ResponseModel.copQuo === 'b') {
                    $('#canvas_cop').css('background-color', '#77cdd0');
                }
                else if (ResponseModel.copQuo === 'r') {
                    $('#canvas_cop').css('background-color', '#f4b183');
                }
                else if (ResponseModel.copQuo === 'y') {
                    $('#canvas_cop').css('background-color', '#ffe699');
                }
                //冷却水输送系数
                if (ResponseModel.cwQuo === 'b') {
                    $('#canvas_cw').css('background-color', '#77cdd0');
                }
                else if (ResponseModel.cwQuo === 'r') {
                    $('#canvas_cw').css('background-color', '#f4b183');
                }
                else if (ResponseModel.cwQuo === 'y') {
                    $('#canvas_cw').css('background-color', '#ffe699');
                }
                //冷却塔风机输送系数
                if (ResponseModel.ctQuo === 'b') {
                    $('#canvas_ctc').css('background-color', '#77cdd0');
                }
                else if (ResponseModel.ctQuo === 'r') {
                    $('#canvas_ctc').css('background-color', '#f4b183');
                }
                else if (ResponseModel.ctQuo === 'y') {
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
            var pos = JSON.parse(sessionStorage.pointers);
            var po = pos[0];
            sessionStorage.PointerID = po.pointerID;
            sessionStorage.PointerName = po.pointerName;
            sessionStorage.EprID = po.enterpriseID;
            sessionStorage.EprName = po.eprName;
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