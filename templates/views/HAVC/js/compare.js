var Compare = function () {

    /*选中的时间段*/
    var dTList = [];

    //时间类型
    var eType;

    //设备类型
    var mType;

    //CHARTVIEW
    var mycv = null;

    //TABLE表格
    var oTable=null;

    window.onresize = function (ev) {
        if(mycv){
            mycv.resize();
        }
    }

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

    //初始化默认起始时间
    var dtnowstr = function () {
        var nowDt = new Date();
        var year = nowDt.getFullYear();
        var month = parseInt(nowDt.getMonth())+1;
        var day = nowDt.getDate();
        var nowstr = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        return nowstr;
    }

    //获取已选择的时间段
    var getDTs = function () {
        var dTs = "";
        for (var i = 0; i < dTList.length; i++) {
            if (i === dTList.length - 1) {
                dTs += dTList[i];
            } else {
                dTs += dTList[i] + ",";
            }
        }
        return dTs;
    }

    //初始化日期控件
    var initdatetimepicker = function () {
        $('.compareDT').datetimepicker(
            {
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
            }).on('changeDate', function (ev) {
            var inputV = $("#spDT").val();
            //判断当前日期是否已经存在
            if ($.inArray(inputV, dTList) === -1) {
                dTList.push(inputV);
                $("#spanDT").html("已选择时间段(" + dTList.length + ")");
            }
        });
    }

    //初始化默认选择时间段
    var initdtlist=function () {
        var mt=moment(dtnowstr());
        var nowDt=mt.format('YYYY-MM-DD');
        $('#spDT').val(nowDt);
        dTList.push(nowDt);
        $("#spanDT").html("已选择时间段(" + dTList.length + ")");
    }

    //打开已选择时间段框
    var openAlreadyDtBox = function () {
        $("#openBtn").on('click', function () {
            var objzTv = $(this);
            var ofstzTv = $(this).offset();
            var tvLeft = ofstzTv.left - 240;
            var tvTop = ofstzTv.top - 90;
            $("#alreadyDT")
                .css({ left: tvLeft + "px", top: tvTop - 12 + "px" })
                .slideDown("fast");
            $("body").bind("mousedown", onBodyDown);
            $("#ULDT").html("");
            for (var i = 0; i < dTList.length; i++) {
                var curDT = dTList[i];
                $("#ULDT").append("<li><a data-id=" + curDT + " onclick='removeDT(this);'>" + curDT + "</a></li>");
            }
        });
    }

    //移除已选择日期
    var removeDT = function (e) {
        var inputV = e.getAttribute("data-id");
        dTList = $.grep(dTList, function (value) {
            return value != inputV;
        });
        $("#spanDT").html("已选择时间段(" + dTList.length + ")");
        hideDtBox();
    }

    function onBodyDown(event) {
        if (!(event.target.id == "openBtn"
                || event.target.id == "alreadyDT"
                || $(event.target).parents("#alreadyDT").length > 0)) {
            hideDtBox();
        }
    }

    //关闭已选日期框
    function hideDtBox() {
        $("#alreadyDT").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown);
    }
    
    var getCompareEERChartViewDs = function (eType,mType,dTs) {
        jQuery('#compareBusy').showLoading();
        mycv = echarts.init(document.getElementById('compareMain'));
        var url = sessionStorage.apiUrlPrefix + "CompareEER/GetCompareEERAnalysisDs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            dTs:dTs,
            mType:mType,
            eType:eType
        },function (res) {
            if(res.code===0){
                var titleText = "多时间段能效对比分析";
                var lgs = [];//图例
                for (var i = 0; i < dTList.length; i++) {
                    lgs.push(dTList[i]);
                }
                //lgs.push('优秀值');
                //lgs.push('警告值');
                var cgs = [];//X轴
                for (var i = 0; i < res.xs.length; i++) {
                    cgs.push(res.xs[i]);
                }
                var dvs = [];
                for (var i = 0; i < res.ys.length; i++) {
                    var object = {};
                    object.name = lgs[i];
                    object.type = "line";
                    object.data = [];
                    for (var j = 0; j < res.ys[i].length; j++) {
                        var v = res.ys[i][j];
                        object.data.push(v);
                    }
                    dvs.push(object);
                }
                option = {
                    title: {
                        //text: titleText,
                        //subtext: "kW/RT"
                        subtext: 'kW/kW'
                    },
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
                            //dataView: { readOnly: true },
                            //magicType: { type: ['line', 'bar'] },
                            //restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        axisLabel: {
                            rotate: eType === "2" ? 0 : 45,
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
                jQuery('#compareBusy').hideLoading();
            }else if(res.code===-1){
                alert('异常错误(能效多时间段对比):' + res.msg);
                jQuery('#compareBusy').hideLoading();
            }else{
                jQuery('#compareBusy').hideLoading();
            }
        })
    }
    
    var getCompareEERTableDs =function (eType,mType,dTs) {
        var url = sessionStorage.apiUrlPrefix + "CompareEER/GetCompareEERTableDs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            dTs:dTs,
            mType:mType,
            eType:eType
        },function (res) {
            //表格显示数据源
            var dataArr = [];
            dataArr = res.aaData;
            if(oTable===null){
                oTable = $("#avg_table").dataTable({
                    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
                    "paging": false,   //是否分页
                    "destroy": true,//还原初始化了的datatable
                    "searching": false,
                    "paging": false,
                    "searching": false,
                    "ordering": false,
                    "bFilter": false,
                    "bPaginate": false, //翻页功能
                    "bSort": false,
                    "bProcessing": false,
                    "oLanguage": {
                        "sLengthMenu": "每页显示 _MENU_ 条记录",
                        "sZeroRecords": "没有任何能效对比数据",
                        "sEmptyTable": "没有任何能效对比数据",
                        "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                        "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
                        "sInfoEmpty": "",
                        "sSearch": "搜索",
                        "oPaginate": {
                            "sFirst": "首页",
                            "sPrevious": "上一页",
                            "sNext": "下一页",
                            "sLast": "末页"
                        },
                    },
                    "aoColumns": [, , , , , ]
                    // "columns":[
                    //     {
                    //         title:'对象',
                    //         data:'',
                    //         visible:false,
                    //     },{
                    //         title:'整体值'
                    //     },{
                    //         title:'平均值'
                    //     },{
                    //         title:'10%最优平均值'
                    //     },{
                    //         title:'10%最差平均值'
                    //     }
                    // ]
                });
                $('.dataTables_info').hide();
            }
            //清空一下table
            oTable.fnClearTable();
            //想表格中添加东西数据o
            oTable.fnAddData(dataArr);
            //重绘表格
            oTable.fnDraw();
        })
    }

    var queryCompareDs = function () {
        $('#compareBtn').on('click',function () {
            var dTs = getDTs();
            if (dTs.length === 0) {
                alert("提示(多时间段能效对比):请选择时间段分析能效对比");
                return;
            }
            var eType = $("#eType").val();
            var mType = $("#meterType").val();
            getCompareEERChartViewDs(eType, mType, dTs);
            getCompareEERTableDs(eType, mType, dTs);
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
            //初始化默认选择时间段
            initdtlist();
            //初始化日期控件
            initdatetimepicker();
            //打开已选择时间段框
            openAlreadyDtBox();
            //时间类型
            var eType = $("#eType").val();
            //设备类型
            var mType = $("#meterType").val();
            //已选择时间段
            var dTs = getDTs();
            //默认开始获取能效对比数据
            getCompareEERChartViewDs(eType,mType,dTs);//CharView数据
            getCompareEERTableDs(eType,mType,dTs)//Table数据
            //查询数据
            queryCompareDs();
        }
    }

}();