var Rank = function () {

    /*0=月 1=年*/
    var eType;

    //选择日期
    var selectDt;

    //所有楼的ChartView图
    var mylzp;
    //冷站的ChartView图
    var mylzv;
    //冷机的ChartView图
    var mycv;
    //冷冻泵的ChartView图
    var mychwv;
    //冷却泵的ChartView图
    var mycwv;
    //冷却塔的ChartView图
    var myctv;

    window.onresize = function () {
        if (mylzv && mycv && mychwv && mycwv && myctv) {
            mylzv.resize();
            mycv.resize();
            mychwv.resize();
            mycwv.resize();
            myctv.resize();
        }
    };

    var selectEType = "0";

    //初始化默认起始时间
    var dtnowstr = function () {
        var nowDt = new Date();
        var year = nowDt.getFullYear();
        var month = parseInt(nowDt.getMonth())+1;
        var day = nowDt.getDate();
        var nowstr = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        return nowstr;
    }

    //切换日月年时间类型
    var changeEType=function () {
        $("#eType").change(function () {
            eType = $(this).children('option:selected').val();
            if (eType === "0") {
                $('.rankDT').datepicker('destroy');
                initMonth();
            }
            if (eType === "1") {
                $('.rankDT').datepicker('destroy');
                initYear();
            }
        });
    }
    
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

    //初始化时间控件(日)
    var initdatetimepicker=function () {
        var nowDt = new Date();
        var year = nowDt.getFullYear();
        var month = parseInt(nowDt.getMonth())+1;
        var day = nowDt.getDate();
        selectDt = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        var mt= moment(selectDt);
        var nowDt=mt.format('YYYY-MM');
        $("#spDT").val(nowDt);
        initMonth();
    }

    //(月)
    var initMonth=function () {
        $('.rankDT').datepicker({
            autoclose: true,
            startView: 1,
            maxViewMode: 2,
            minViewMode: 1,
            format: "yyyy-mm",
            language: "zh-CN" //汉化
        }).on('changeDate', function (ev) {
            if (eType === "0") {
                var year = ev.date.getFullYear();
                var month = addZeroToSingleNumber(parseInt(ev.date.getMonth()));
                var date = addZeroToSingleNumber(parseInt(ev.date.getDate()));
                selectDt = year + "-" + month + "-" + date;
            }
        });
    }

    //(年)
    var initYear=function () {
        $('.rankDT').datepicker({
            autoclose: true,
            startView: 2,
            maxViewMode: 2,
            minViewMode: 2,
            format: "yyyy",
            language: "zh-CN"
        }).on('changeDate', function (ev) {
            if (eType === "1") {
                var year = ev.date.getFullYear();
                var month = addZeroToSingleNumber(parseInt(ev.date.getMonth()));
                var date = addZeroToSingleNumber(parseInt(ev.date.getDate()));
                selectDt = year + "-" + month + "-" + date;
            }
        });
    }

    //查询能效排名
    var getEERRankDs = function () {
        if(selectDt.length === 0){
            alert('提示(能效排名):请选择时间');
            return;
        }
        else{
            jQuery('#rankBusy').showLoading();
            var pIds = [];
            pIds.push(sessionStorage.PointerID);
            var pNts = [];
            pNts.push(sessionStorage.PointerName);
            var url = sessionStorage.apiUrlPrefix + "RankEER/GetRankEERAnalysisDs";
            $.post(url,{
                pIds:pIds,
                pNts:pNts,
                DT:dtnowstr(),
                eType:selectEType
            },function (res) {
                if(res.code === 0){
                    var lzxs = res.lzxs;//冷站X轴
                    var lzys = res.lzys;//冷站Y轴
                    var lzcs = res.lzcs;
                    var cxs = res.cxs;//冷机X轴数据
                    var cys = res.cys;
                    var ccs = res.ccs;
                    var chwxs = res.chwxs;//冷冻泵X轴
                    var chwys = res.chwys;
                    var chwcs = res.chwcs;
                    var cwxs = res.cwxs;//冷却泵X轴
                    var cwys = res.cwys;
                    var cwcs = res.cwcs;
                    var ctxs = res.ctxs;//冷却塔X轴
                    var ctys = res.ctys;
                    var ctcs = res.ctcs;
                    drawlzv(lzxs, lzys, lzcs, 'KW/KW');//冷站
                    drawcv(cxs, cys, ccs,  'KW/KW');//冷机
                    drawchwv(chwxs, chwys, chwcs,  'KW/KW');//冷冻泵
                    drawcwv(cwxs, cwys, cwcs,  'KW/KW');//冷却泵
                    drawctv(ctxs, ctys, ctcs,  'KW/KW');//冷却塔
                    jQuery('#rankBusy').hideLoading();
                }else if(res.code === -1){
                    console.log('异常错误(能效排名:)' + res.msg);
                    jQuery('#rankBusy').hideLoading();
                }else{
                    jQuery('#rankBusy').hideLoading();
                }
            })
        }
    }

    function drawctv(xs, ctys, ctcs, misc) {
        myctv = echarts.init(document.getElementById('ctMain'));
        var cgs = [];
        for (var i = 0; i < 1; i++) {
            var object = {};
            object.type = "category";
            object.axisTick = {};
            object.axisTick.alignWithLabel = true;
            object.splitLine = {};
            object.splitLine.show = false;
            object.data = [];
            for (var i = 0; i < xs.length; i++) {
                object.data.push(xs[i]);
            }
            cgs.push(object);
        }
        var dvs = [];
        for (var i = 0; i < ctys.length; i++) {
            var object = {};
            object.name = "冷却塔";
            object.type = "bar";
            object.barWidth = "20";
            object.label = {};
            object.label.normal = {};
            object.label.normal.show = true;
            object.label.normal.position = 'outside';
            object.data = [];
            for (var j = 0; j < ctys[i].length; j++) {
                //object.data.push(ctys[i][j]);
                var obj = {};
                obj.value = ctys[i][j];
                obj.itemStyle = {};
                obj.itemStyle.normal = {};
                obj.itemStyle.normal.color = '#63747f';
                object.data.push(obj);
            }
            dvs.push(object);
        }
        option = {
            title: {
                //text: '冷却塔',
                //subtext: 'KW/RT'
                subtext: misc
            },
            color: ['#63747f'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['冷却塔']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            /*xAxis: [
                {
                    type: 'category',
                    data: ['标杆', 'A楼', 'S-1', 'S-2', 'S-3', 'S-4', 'S-5', 'S-6', 'B楼'],
                    axisTick: {
                        alignWithLabel: true
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],*/
            xAxis: cgs,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    show: false
                }
            ],
            /*series: [
                {
                    name: '冷却塔',
                    type: 'bar',
                    barWidth: "20",
                    itemStyle: {
                        normal: {
                            color: function (params2) {
                                var colorList = [
                                    '#92d050', '#31859c', '#bfbfbf',
                                    '#bfbfbf', '#bfbfbf', '#bfbfbf',
                                    '#bfbfbf', '#bfbfbf', '#bfbfbf'
                                ];
                                return colorList[params2.dataIndex]
                            }
                        }
                    },
                    data: [6.50, 6.14, 5.47, 5.00, 5.01, 4.55, 4.69, 1.34, 1.22]
                }
            ]*/
            series: dvs
        };
        for (var i = 0; i < ctcs.length; i++) {
            if (ctcs[i] === "1") {
                option.series[0].data[i].itemStyle.normal.color = "#92d050";
            }
            else if (ctcs[i] === "2") {
                option.series[0].data[i].itemStyle.normal.color = "#31859c";
            }
        }
        myctv.setOption(option);
    }

    function drawcwv(xs, cwys, cwcs, misc) {
        mycwv = echarts.init(document.getElementById('cwMain'));
        var cgs = [];
        for (var i = 0; i < 1; i++) {
            var object = {};
            object.type = "category";
            object.axisTick = {};
            object.axisTick.alignWithLabel = true;
            object.splitLine = {};
            object.splitLine.show = false;
            object.data = [];
            for (var i = 0; i < xs.length; i++) {
                object.data.push(xs[i]);
            }
            cgs.push(object);
        }
        var dvs = [];
        for (var i = 0; i < cwys.length; i++) {
            var object = {};
            object.name = "冷却泵";
            object.type = "bar";
            object.barWidth = "20";
            object.label = {};
            object.label.normal = {};
            object.label.normal.show = true;
            object.label.normal.position = 'outside';
            object.data = [];
            for (var j = 0; j < cwys[i].length; j++) {
                var obj = {};
                obj.value = cwys[i][j];
                obj.itemStyle = {};
                obj.itemStyle.normal = {};
                obj.itemStyle.normal.color = '#63747f';
                object.data.push(obj);
            }
            dvs.push(object);
        }
        option = {
            title: {
                //text: '冷却泵',
                //subtext: 'KW/RT'
                subtext: misc
            },
            color: ['#63747f'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['冷却泵']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            /*xAxis: [
                {
                    type: 'category',
                    data: ['标杆', 'A楼', 'S-1', 'S-2', 'S-3', 'S-4', 'S-5', 'S-6', 'B楼'],
                    axisTick: {
                        alignWithLabel: true
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],*/
            xAxis: cgs,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    show: false
                }
            ],
            /*series: [
                {
                    name: '冷却泵',
                    type: 'bar',
                    barWidth: "20",
                    itemStyle: {
                        normal: {
                            color: function (params2) {
                                var colorList = [
                                    '#92d050', '#31859c', '#bfbfbf',
                                    '#bfbfbf', '#bfbfbf', '#bfbfbf',
                                    '#bfbfbf', '#bfbfbf', '#bfbfbf'
                                ];
                                return colorList[params2.dataIndex]
                            }
                        }
                    },
                    data: [6.50, 6.14, 5.47, 5.00, 5.01, 4.55, 4.69, 1.34, 1.22]
                }
            ]*/
            series: dvs
        };
        for (var i = 0; i < cwcs.length; i++) {
            if (cwcs[i] === "1") {
                option.series[0].data[i].itemStyle.normal.color = "#92d050";
            }
            else if (cwcs[i] === "2") {
                option.series[0].data[i].itemStyle.normal.color = "#31859c";
            }
        }
        mycwv.setOption(option);
    };

    function drawchwv(xs, chwys, chwcs, misc) {
        mychwv = echarts.init(document.getElementById('chwMain'));
        var cgs = [];
        for (var i = 0; i < 1; i++) {
            var object = {};
            object.type = "category";
            object.axisTick = {};
            object.axisTick.alignWithLabel = true;
            object.splitLine = {};
            object.splitLine.show = false;
            object.data = [];
            for (var i = 0; i < xs.length; i++) {
                object.data.push(xs[i]);
            }
            cgs.push(object);
        }
        var dvs = [];
        for (var i = 0; i < chwys.length; i++) {
            var object = {};
            object.name = "冷冻泵";
            object.type = "bar";
            object.barWidth = "20";
            object.label = {};
            object.label.normal = {};
            object.label.normal.show = true;
            object.label.normal.position = 'outside';
            object.data = [];
            for (var j = 0; j < chwys[i].length; j++) {
                var obj = {};
                obj.value = chwys[i][j];
                obj.itemStyle = {};
                obj.itemStyle.normal = {};
                obj.itemStyle.normal.color = '#63747f';
                //object.data.push(chwys[i][j]);
                object.data.push(obj);
            }
            dvs.push(object);
        }
        option = {
            title: {
                //text: '冷冻泵',
                //subtext: 'KW/RT'
                subtext: misc
            },
            color: ['#63747f'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['冷冻泵']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            /*xAxis: [
                {
                    type: 'category',
                    data: ['标杆', 'A楼', 'S-1', 'S-2', 'S-3', 'S-4', 'S-5', 'S-6', 'B楼'],
                    axisTick: {
                        alignWithLabel: true
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],*/
            xAxis: cgs,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    show: false
                }
            ],
            /*series: [
                {
                    name: '冷冻泵',
                    type: 'bar',
                    barWidth: "20",
                    itemStyle: {
                        normal: {
                            color: function (params2) {
                                var colorList = [
                                    '#92d050', '#31859c', '#bfbfbf',
                                    '#bfbfbf', '#bfbfbf', '#bfbfbf',
                                    '#bfbfbf', '#bfbfbf', '#bfbfbf'
                                ];
                                return colorList[params2.dataIndex]
                            }
                        }
                    },
                    data: [6.50, 6.14, 5.47, 5.00, 5.01, 4.55, 4.69, 1.34, 1.22]
                }
            ]*/
            series: dvs
        };
        for (var i = 0; i < chwcs.length; i++) {
            if (chwcs[i] === "1") {
                option.series[0].data[i].itemStyle.normal.color = "#92d050";
            }
            else if (chwcs[i] === "2") {
                option.series[0].data[i].itemStyle.normal.color = "#31859c";
            }
        }
        mychwv.setOption(option);
    };

    function drawcv(xs, cys, ccs, misc) {
        mycv = echarts.init(document.getElementById('cMain'));
        var cgs = [];
        for (var i = 0; i < 1; i++) {
            var object = {};
            object.type = "category";
            object.axisTick = {};
            object.axisTick.alignWithLabel = true;
            object.splitLine = {};
            object.splitLine.show = false;
            object.data = [];
            for (var i = 0; i < xs.length; i++) {
                object.data.push(xs[i]);
            }
            cgs.push(object);
        }
        var dvs = [];
        for (var i = 0; i < cys.length; i++) {
            var object = {};
            object.name = "冷机";
            object.type = "bar";
            object.barWidth = "20";
            object.label = {};
            object.label.normal = {};
            object.label.normal.show = true;
            object.label.normal.position = 'outside';
            object.data = [];
            for (var j = 0; j < cys[i].length; j++) {
                var obj = {};
                obj.value = cys[i][j];
                obj.itemStyle = {};
                obj.itemStyle.normal = {};
                obj.itemStyle.normal.color = '#63747f';
                object.data.push(obj);
            }
            dvs.push(object);
        }
        option = {
            title: {
                //text: '冷机',
                //subtext: 'KW/RT'
                subtext: misc
            },
            color: ['#63747f'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['冷机']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            /*xAxis: [
                {
                    type: 'category',
                    data: ['标杆', 'A楼', 'S-1', 'S-2', 'S-3', 'S-4', 'S-5', 'S-6', 'B楼'],
                    axisTick: {
                        alignWithLabel: true
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],*/
            xAxis: cgs,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    show: false
                }
            ],
            /*series: [
                {
                    name: '冷机',
                    type: 'bar',
                    barWidth: "20",
                    itemStyle: {
                        normal: {
                            color: function (params2) {
                                var colorList = [
                                    '#92d050', '#31859c', '#bfbfbf',
                                    '#bfbfbf', '#bfbfbf', '#bfbfbf',
                                    '#bfbfbf', '#bfbfbf', '#bfbfbf'
                                ];
                                return colorList[params2.dataIndex]
                            }
                        }
                    },
                    data: [6.50, 6.14, 5.47, 5.00, 5.01, 4.55, 4.69, 1.34, 1.22]
                }
            ]*/
            series: dvs
        };
        for (var i = 0; i < ccs.length; i++) {
            if (ccs[i] === "1") {
                option.series[0].data[i].itemStyle.normal.color = "#92d050";
            }
            else if (ccs[i] === "2") {
                option.series[0].data[i].itemStyle.normal.color = "#31859c";
            }
        }
        mycv.setOption(option);
    }

    function drawlzv(xs, lzys, lzcs, misc) {
        mylzv = echarts.init(document.getElementById('lzMain'));
        var cgs = [];
        for (var i = 0; i < 1; i++) {
            var object = {};
            object.type = "category";
            object.axisTick = {};
            object.axisTick.alignWithLabel = true;
            object.splitLine = {};
            object.splitLine.show = false;
            object.data = [];
            for (var i = 0; i < xs.length; i++) {
                object.data.push(xs[i]);
            }
            cgs.push(object);
        }
        var dvs = [];
        for (var i = 0; i < lzys.length; i++) {
            var object = {};
            object.name = "冷站";
            object.type = "bar";
            object.barWidth = "20";
            object.label = {};
            object.label.normal = {};
            object.label.normal.show = true;
            object.label.normal.position = 'outside';
            object.data = [];
            for (var j = 0; j < lzys[i].length; j++) {
                var obj = {};
                obj.value = lzys[i][j];
                obj.itemStyle = {};
                obj.itemStyle.normal = {};
                obj.itemStyle.normal.color = '#63747f';
                object.data.push(obj);
            }
            dvs.push(object);
        }
        option = {
            title: {
                //subtext: 'KW/RT'//text: '冷站',
                subtext: misc
            },
            color: ['#63747f'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['冷站']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: cgs,
            /*xAxis: [
                {
                    type: 'category',
                    data: ['标杆', 'A楼', 'S-1', 'S-2', 'S-3', 'S-4', 'S-5', 'S-6', 'B楼'],
                    axisTick: {
                        alignWithLabel: true
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],*/
            yAxis: [
                {
                    type: 'value',
                    show: false
                }
            ],
            /*series: [
                {
                    name: '冷站',
                    type: 'bar',
                    barWidth: "20",
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        }
                    },
                    data: [5.16, 3.59, 3.57, 3.49, 3.22, 3.15, 2.94, 1.09, 1.00]
                }
            ]*/
            series: dvs
        };
        for (var i = 0; i < lzcs.length; i++) {
            if (lzcs[i] === "1") {
                option.series[0].data[i].itemStyle.normal.color = "#92d050";
            }
            else if (lzcs[i] === "2") {
                option.series[0].data[i].itemStyle.normal.color = "#31859c";
            }
        }
        mylzv.setOption(option);
    }

    return {
        init: function () {
            //初始化时间控件(默认是日)
            initdatetimepicker();
            //切换日月年时间类型
            changeEType();
            //(默认)查询能效排名
            getEERRankDs();
            $('#rankBtn').on('click',function () {
                getEERRankDs();
            })
        }
    }

}();