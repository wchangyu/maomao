//多区域历史数据
var History = function () {

    //设备类型
    var eqTyAy = null;

    //冷站区域
    var chArAy = null;

    var mycv = null;

    window.onresize = function (ev) {
        if (mycv) {
            mycv.resize();
        }
    }

    function convertDate(strDate) {//字符串转时间格式
        var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
            function (a) {
                return parseInt(a, 10) - 1;
            }).match(/\d+/g) + ')');
        return date;
    }

    function Format(now, mask) {
        var d = now;
        var zeroize = function (value, length) {
            if (!length) length = 2;
            value = String(value);
            for (var i = 0, zeros = ''; i < (length - value.length) ; i++) {
                zeros += '0';
            }
            return zeros + value;
        };
        return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
            switch ($0) {
                case 'd': return d.getDate();
                case 'dd': return zeroize(d.getDate());
                case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
                case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
                case 'M': return d.getMonth() + 1;
                case 'MM': return zeroize(d.getMonth() + 1);
                case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
                case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
                case 'yy': return String(d.getFullYear()).substr(2);
                case 'yyyy': return d.getFullYear();
                case 'h': return d.getHours() % 12 || 12;
                case 'hh': return zeroize(d.getHours() % 12 || 12);
                case 'H': return d.getHours();
                case 'HH': return zeroize(d.getHours());
                case 'm': return d.getMinutes();
                case 'mm': return zeroize(d.getMinutes());
                case 's': return d.getSeconds();
                case 'ss': return zeroize(d.getSeconds());
                case 'l': return zeroize(d.getMilliseconds(), 3);
                case 'L': var m = d.getMilliseconds();
                    if (m > 99) m = Math.round(m / 10);
                    return zeroize(m);
                case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
                case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
                case 'Z': return d.toUTCString().match(/[A-Z]+$/);
                    // Return quoted strings with the surrounding quotes removed
                default: return $0.substr(1, $0.length - 2);
            }
        });
    };

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
        var startDt = mt.subtract(1, 'days').format('YYYY-MM-DD');
        $("#spDT").val(startDt);
        $("#epDT").val(nowDt);
        $('.HSYDT').datetimepicker({
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
    };

    //获取设备类型
    var getEqTyAys = function () {
        var url = sessionStorage.apiUrlPrefix + "MultiAreaHistory/GetEQTypes";
        $.get(url, function (res) {
            eqTyAy = res;
            //获取区域数据
            getAreaAys();
        })
    }

    //获取区域数据
    var getAreaAys = function () {
        var url = sessionStorage.apiUrlPrefix + "MultiAreaHistory/GetChillAREAs";
        $.get(url, function (res) {
            chArAy = res;
            //初始化区域选择控件
            initAreaSelectCtrl();
        })
    }

    //初始化区域选择控件
    var initAreaSelectCtrl = function () {
        $('#areaType').html();
        $('#areaType').find('option').remove();
        $('#areaType').empty();
        if (chArAy.length > 0) {
            for (var i = 0; i < chArAy.length; i++) {
                var charK = chArAy[i].item;
                var charV = chArAy[i].name;
                $('#areaType').append($("<option value=\"" + charK + "\">" + charV + "</option>"));
            }
            initEqTypeSelectCtrl(chArAy[0].item);
        }
    }

    //初始化设备类型选择控件
    var initEqTypeSelectCtrl = function (chArId) {
        var chArMo = _.where(chArAy, { item: chArId })[0];
        var eqtys = _.where(eqTyAy, { grp: chArMo.grp });
        $('#eqType').html();
        $('#eqType').find('option').remove();
        $('#eqType').empty();
        if (eqtys.length > 0) {
            for (var i = 0; i < eqtys.length; i++) {
                var eqtyK = eqtys[i].type;
                var eqtyV = eqtys[i].name;
                $('#eqType').append($("<option value=\"" + eqtyK + "\">" + eqtyV + "</option>"));
            }
            //根据区域和设备类型获取监测因子数据
            getDataCCodeDs();
        }
    }

    var setting = {
        view: {
            showIcon: showIconForTree,
            dblClickExpand: false
        },
        check: {
            enable: true,
            chkboxType: { "Y": "", "N": "" }
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        callback: {
            onCheck: onCheck
            //onAsyncSuccess: onAsyncSuccess
        }
    };

    //根据区域和设备类型获取监测因子数据
    var getDataCCodeDs = function () {

        jQuery('#historyBusy').showLoading();
        var area = $('#areaType').val();
        var eqty = $('#eqType').val();
        var url = sessionStorage.apiUrlPrefix + "MultiAreaHistory/GetDataCCodeTrvNodes";
        $.post(url, {
            pId: sessionStorage.PointerID,
            area: area,
            type: eqty
        }, function (res) {
            if (res.code === 0) {
                //页面加载后初始化zTree数据且默认展开所有节点
                var zNodes = res.dctrVs;
                console.log(zNodes);
                $.fn.zTree.init($("#trul"), setting, zNodes).expandAll(true);
                var zTree = $.fn.zTree.init($("#trul"), setting, zNodes);
                var nodes = zTree.getNodes();
                jQuery('#historyBusy').hideLoading();
                firstzNode(nodes, zTree);
            } else {
                console.log('code:' + res.code + ',msg:' + res.msg);
                jQuery('#historyBusy').hideLoading();
            }
        })
    }

    //默认选中检测因子第一项
    var firstzNode = function (nodes, zTree) {
        var cIds = "";
        if (nodes.length === 0) {
            jQuery('#historyBusy').hideLoading();
            return;
        }
        if (nodes.length > 0) {
            jQuery('#historyBusy').hideLoading();
            if (nodes[0].children.length > 0) {
                //if (nodes.length > 0) {
                zTree.checkNode(nodes[0].children[0], true, true, false);
                //zTree.checkNode(nodes[0], true, true, false);
                var cIds = "";
                cIds += (nodes[0].children[0].id + ",");
                //cIds += (nodes[0].id + ",");
                onAsyncSuccess(cIds);
            }
        }
    }

    //查询数据
    var onAsyncSuccess = function (cIds) {

        jQuery('#historyBusy').showLoading();
        var sp = $("#spDT").val();
        var ep = $("#epDT").val();
        var mtsp = moment(sp).format('YYYY-MM-DD');
        var mtep = moment(ep).format('YYYY-MM-DD');;
        var dp = mtep - mtsp;
        var days = Math.floor(dp / (24 * 3600 * 1000));

        if (days > 31) {
            alert("提示(历史数据):查看监测因子的历史数据时间段不能超过31天");
            return;
        } else {

            mycv = echarts.init(document.getElementById('historyChartView'));

            var url = sessionStorage.apiUrlPrefix + "History/GetHistoryDatas";

            $.post(url, {
                pId: sessionStorage.PointerID,
                cIds: cIds,
                sp: sp,
                ep: ep
            }, function (res) {
                if (res.code === 0) {
                    var covST = Format(convertDate(sp), "MM月dd日");
                    var covET = Format(convertDate(ep), "MM月dd日");
                    var titleText = covST + " - " + covET + "历史数据";
                    var lgs = [];
                    for (var i = 0; i < res.lgs.length; i++) {
                        lgs.push(res.lgs[i]);
                    }
                    var cgs = [];
                    for (var i = 0; i < res.xs.length; i++) {
                        cgs.push(res.xs[i]);
                    }
                    var dvs = [];
                    for (var i = 0; i < res.ys.length; i++) {
                        var object = {};
                        object.name = res.lgs[i];
                        object.type = "line";
                        object.data = [];
                        for (var j = 0; j < res.ys[i].length; j++) {
                            var v = res.ys[i][j];
                            object.data.push(v);
                        }
                        dvs.push(object);
                    }
                    $('#spanTitle').html(titleText);
                    option = {
                        /*title: {
                            text: titleText
                        },*/
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: lgs
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                                dataView: { readOnly: true },
                                //magicType: { type: ['line', 'bar'] },
                                //restore: {},
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            axisLabel: {
                                rotate: 30,
                                margin: 20,
                                textStyle: {
                                    color: "#222"
                                }
                            },
                            data: cgs
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        series: dvs
                    };
                    mycv.setOption(option);
                    jQuery('#historyBusy').hideLoading();
                } else if (res.code === -1) {
                    alert('异常错误(历史数据):' + res.msg);
                    jQuery('#historyBusy').hideLoading();
                } else {
                    jQuery('#historyBusy').hideLoading();
                }
            })
        }
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
            //获取设备类型
            getEqTyAys();
            //选择区域
            $('#areaType').change(function () {
                var chArId = $(this).val();
                //初始化设备类型选择控件
                initEqTypeSelectCtrl(chArId);
            });
            //选择设备类型
            $('#eqType').change(function () {
                getDataCCodeDs();
            })
            //打开监测因子选择器
            $("#openTrvBoxBtn").on('click', function () {
                var obj = $(this);
                var ofst = $(this).offset();
                var ofstLeft = ofst.left - 240;
                var ofstTop = ofst.top - 115;
                $("#treeBox").css({ left: ofstLeft + "px", top: ofstTop + "px" }).slideDown("fast");
                $("body").bind("mousedown", onBodyDown);
            });
            //查询历史数据
            $("#hsyBtn").on("click", function () {
                var cIds = "";
                var zTree = $.fn.zTree.getZTreeObj("trul");
                //var zTree = $.fn.zTree.init($("#trul"), setting, zNodes);
                var nodes = zTree.getCheckedNodes(true);
                if (nodes.length == 0) {
                    alert("提示(历史数据):请选择一项监测因子查询历史数据");
                    return;
                }
                else {
                    for (var i = 0; i < nodes.length; i++) {
                        cIds += (nodes[i].id + ",");
                    }
                }
                onAsyncSuccess(cIds);
            });
            //默认查询历史数据
            //onAsyncSuccess();
        }
    }

    function showIconForTree(treeId, treeNode) {
        return !treeNode.isParent;
    };

    function onCheck(e, treeId, treeNode) {
        //alert("e:"+e+",treeId:"+treeId+",treeNode:"+treeNode);
        //var zTree = $.fn.zTree.getZTreeObj("DCTreeView"),
        //nodes = zTree.getCheckedNodes(true),
        //v = "";
        //for (var i = 0, l = nodes.length; i < l; i++) {
        //    v += nodes[i].name + ",";
        //}
        //if (v.length > 0) v = v.substring(0, v.length - 1);
        //var selObj = $("#btnSel");
        //selObj.attr("value", v);
        //selObj.html(v);
    }

    function onBodyDown(event) {
        if (!(event.target.id == "openTrvBoxBtn" || event.target.id == "treeBox" || $(event.target).parents("#treeBox").length > 0)) {
            hideMenu();
        }
    }

    function hideMenu() {
        $("#treeBox").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown);
    }

}();