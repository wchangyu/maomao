var History = function () {

    var mycv = null;

    var treeObj = null;

    window.onresize = function (ev) {
        if(mycv){
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

    var addZeroToSingleNumber=function (num) {
        var curnum = "";
        if (num < 10) {
            curnum = "0" + num;
        }
        else {
            curnum += num;
        }
        return curnum;
    }

    var setting = {
        view: {
            showIcon: showIconForTree,
            dblClickExpand: false
        },
        check: {
            enable: true,
            chkboxType: { "Y": "ps", "N": "ps" }
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
            onClick: function(e,treeId,treeNode){



                var zTreeObj = $.fn.zTree.getZTreeObj("DCTreeView");;

                //勾选当前选中的节点
                zTreeObj.checkNode(treeNode, !treeNode.checked, true);

            }
        }
    };

    var onCheck=function (e, treeId, treeNode) {
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

    function showIconForTree(treeId, treeNode) {
        return !treeNode.isParent;
    };

    //默认选中节点
    var defaultNodes = function (setting) {
        jQuery('#historyBusy').showLoading();
        var url = sessionStorage.apiUrlPrefix + "/History/GetDataCCodeTrvNodes";
        $.post(url,{
            pId:sessionStorage.PointerID
        },function (res) {
            if(res.code === 0){
                var zNodes = res.dctrVs;

                $.fn.zTree.init($("#DCTreeView"), setting, zNodes).expandAll(true);

                var zTree = $.fn.zTree.init($("#DCTreeView"), setting, zNodes);

                //var nodes = zTree.getNodes();

                var nodes = [];

                firstzNode(nodes,zTree);

            }else if(res.code === -1){
                console.log('异常错误(因子树形结构数据):' + res.msg);
                jQuery('#historyBusy').hideLoading();
            }else{
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
                zTree.checkNode(nodes[0].children[0], true, true, false);
                var cIds = "";
                cIds += (nodes[0].children[0].id + ",");
                onAsyncSuccess(cIds);
            }
        }
    }

    //查询数据
    var onAsyncSuccess = function (cIds) {
        jQuery('#historyBusy').showLoading();
        var sp = $("#spDT").val();
        var ep = $("#epDT").val();
        var mtsp = moment(sp);
        var mtep = moment(ep);
        var dp = mtep - mtsp;
        var days = Math.floor(dp / (24 * 3600 * 1000));
        if (days > 31) {
            console.log("提示(历史数据):查看监测因子的历史数据时间段不能超过31天");
            return;
        }else{
            mycv = echarts.init(document.getElementById('historyMain'));
            var url = sessionStorage.apiUrlPrefix + "History/GetHistoryDatas";
            $.post(url,{
                pId : sessionStorage.PointerID ,
                cIds : cIds,
                sp : sp,
                ep : ep
            },function (res) {
                if(res.code === 0){
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
                }else if(res.code === -1){
                    console.log('异常错误(历史数据):' + res.msg);
                    jQuery('#historyBusy').hideLoading();
                }else{
                    jQuery('#historyBusy').hideLoading();
                }
            })
        }
    }

    //初始化时间控件
    var initdatetimepicker = function () {
        var nowDt = new Date();
        var year = nowDt.getFullYear();
        var month = parseInt(nowDt.getMonth())+1;
        var day = nowDt.getDate();
        var dtstr = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        var mt= moment(dtstr);
        var nowDt=mt.format('YYYY-MM-DD');
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

    //打开TreeView选择框
    var openTrvBox = function () {
        $("#btnSel").on("click", function () {
            var obj = $(this);
            var ofst = $(this).offset();
            var ofstLeft = ofst.left - 240;
            var ofstTop = ofst.top - 90;
            $("#treeCNT")
                //.css({ left: ofstLeft + "px", top: ofstTop + "px" })
                .slideDown("fast");
            $("body").bind("mousedown", onBodyDown);
        });
    }

    function onBodyDown(event) {
        if (!(event.target.id == "btnSel"
                || event.target.id == "treeCNT"
                || $(event.target).parents("#treeCNT").length > 0)) {
            hideTrvBox();
        }
    }

    function hideTrvBox() {
        $("#treeCNT").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown);
    }

    var queryHistoryDs = function () {
        $("#hsyBtn").on("click", function () {
            var cIds = "";
            var zTree = $.fn.zTree.getZTreeObj("DCTreeView");
            var nodes = zTree.getCheckedNodes(true);
            if (nodes.length == 0) {
                console.log("提示(历史数据):请选择一项监测因子查询历史数据");
                return;
            }
            else {
                for (var i = 0; i < nodes.length; i++) {
                    cIds += (nodes[i].id + ",");
                }
            }
            onAsyncSuccess(cIds);
        });
    }

    return {
        init: function () {
            //初始化时间控件
            initdatetimepicker();
            //打开TreeView选择框
            openTrvBox();
            //默认选中节点
            defaultNodes(setting);
            //查询历史数据
            queryHistoryDs();
        }
    }

}();