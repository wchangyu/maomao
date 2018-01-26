var Calendar = function () {

    /*选中的年*/
    var select_year = "";

    /*选中的月*/
    var select_month = "";

    /*选中的日*/
    var select_day = "";

    /*月数据M|日数据D。默认是月数据*/
    var selectDType = "M";

    /*分项图eChart图*/
    var mycv;

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

    var dtnowstr=function () {
        var nowDt = new Date();
        var year = nowDt.getFullYear();
        var month = parseInt(nowDt.getMonth())+1;
        var day = nowDt.getDate();
        var nowstr = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        return nowstr;
    }

    //初始化时间控件
    var initdatetimepicker = function (mt) {
        var nowDt = mt.format('YYYY-MM');
        $("#spDT").val(nowDt);
        $('.idxDT').datepicker({
            autoclose: true,
            startView: 1,
            maxViewMode: 2,
            minViewMode: 1,
            format: "yyyy-mm",
            language: "zh-CN" //汉化
        }).on('changeDate', function (ev) {
            select_year = ev.date.getFullYear();
            select_month = addZeroToSingleNumber(parseInt(ev.date.getMonth()) + 1);
            select_day = addZeroToSingleNumber(parseInt(ev.date.getDate()));
        });
    }

    return {
        init: function () {
            var mt = moment(dtnowstr());
            select_year = mt.year();
            select_month = addZeroToSingleNumber(parseInt(mt.month()) + 1);
            select_day = addZeroToSingleNumber(parseInt(mt.date()));
            //初始化时间控件
            initdatetimepicker(mt);
            //获取日历控件EPC数据
            getECPs();
            //查询数据
            $('#queryBtn').on('click',function () {
               getECPs();
            });
            //能效对比切换月数据
            switchMonthDs();
            //能效对比切换日数据
            switchDayDs();
        }
    }

    //能效对比切换月数据
    function switchMonthDs() {
        $('#monthBtn').click(function () {
            $(this).addClass("green");
            $('#dayBtn').removeClass('green');
            selectDType = "M";
            recomposeMomentDT();
            var todayDT = returnDT().format('YYYY-MM-DD');
            loadEERAnalysisExpDs(todayDT);
        });
    }

    //能效对比切换日数据
    function switchDayDs() {
        $('#dayBtn').click(function () {
            $(this).addClass("green");
            $('#monthBtn').removeClass('green');
            selectDType = "D";
            recomposeMomentDT();
            var todayDT = returnDT().format('YYYY-MM-DD');
            loadEERAnalysisExpDs(todayDT);
        });
    }
    
    function returnDT() {
        var dT = moment(select_year + "-" + select_month + "-" + select_day);
        return dT;
    }

    /*重组时间*/
    function recomposeMomentDT() {
        var dT = returnDT();
        var todayDTstr = dT.format('YYYY年MM月DD日');
        var monthDT = dT.format('YYYY年MM月');
        /*左边月份*/
        $('#spanM').html(monthDT);
        /*右边日期*/
        if (selectDType === "D") {
            $("#todayDT").html(todayDTstr);
        }
        else {
            $("#todayDT").html(monthDT);
        }
    }

    //获取日历控件EPC数据
    function getECPs () {
        /*默认选中月数据*/
        $('#monthBtn').addClass('green');
        $('#dayBtn').removeClass('green');
        selectDType = "M";
        /*重组时间*/
        recomposeMomentDT();
        var todayDT = returnDT().format('YYYY-MM-DD');
        jQuery('#eerBusy').showLoading();
        var url = sessionStorage.apiUrlPrefix + "CalendarEER/GetCalendarECPAnalysisDs";
        $.post(url,{
            pId:'8817180401',
            sp:todayDT
        },function (res) {
            if(res.code === 0){
                var ecpDs=res.ecPs;//数据源
                var eds = [];
                for (var i = 0; i < ecpDs.length; i++) {
                    var object = {};
                    object.title = ecpDs[i].title;
                    var y = ecpDs[i].y;
                    var m = ecpDs[i].m;
                    var d = ecpDs[i].d;
                    var h = ecpDs[i].h;
                    var startDT = new Date(y, (m - 1), d, h);
                    object.start = startDT;
                    if (ecpDs[i].type === "E") {
                        object.backgroundColor = ecpDs[i].color;
                    }
                    else {
                        object.backgroundColor = "transparent";
                    }
                    eds.push(object);
                }
                $('#calendar').fullCalendar('destroy');
                $('#calendar').fullCalendar({
                    handleWindowResize: true,
                    dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                    defaultView: 'month',
                    firstDay: 0,
                    defaultDate: '' + select_year + '-' + select_month + '-' + select_day + '',
                    events: eds,
                    selectable: true,
                    eventClick: function (event) {
                        var year = event.start._d.getFullYear();
                        var month = addZeroToSingleNumber(parseInt(event.start._d.getMonth()) + 1);
                        var date = addZeroToSingleNumber(parseInt(event.start._d.getDate()));
                        var selectDT = (year + "-" + month + "-" + date);
                        $("#todayDT").html(year + "年" + month + "月" + date + "日");
                        /*默认选中日数据*/
                        $('#monthBtn').removeClass('green');
                        $('#dayBtn').addClass('green');
                        selectDType = "D";
                        loadEERAnalysisExpDs(selectDT);
                        return false;
                    }
                });
                $('.fc-time').hide();
                $('.fc-today-button').hide();
                $('.fc-left').hide();
                $('.fc-prev-button').hide();
                $('.fc-next-button').hide()
                jQuery('#eerBusy').hideLoading();
                loadEERAnalysisExpDs(todayDT);
            }else if(res.code === -1){
                alert('异常错误(能效日历):' + res.msg );
                jQuery('#eerBusy').hideLoading();
            }else{
                jQuery('#eerBusy').hideLoading();
            }
        })
    }

    //获取能效对比和分项图
    function loadEERAnalysisExpDs(sp) {
        jQuery('#eerBusy').showLoading();
        mycv = echarts.init(document.getElementById('itemizeMain'));
        var url = sessionStorage.apiUrlPrefix + "CalendarEER/GetCalendarEERAnalysisExpDs";
        $.post(url,{
            pId:'8817180401',
            sp: encodeURIComponent(sp),
            dType: selectDType
        },function (res) {
            if(res.code === 0){
                //标杆值
                var benchMarkV = parseFloat(res.benchMarkVa);
                //能耗电值
                var EV = parseFloat(res.eVa).toFixed(2);
                $('#eer_com_eV').html(EV);
                //能耗冷值
                var CV = parseFloat(res.cVa).toFixed(2);
                $('#eer_com_cV').html(CV);
                //电价(元)
                var epriceV = parseFloat(res.eupVa).toFixed(2);
                $('#eer_com_priceV').html(epriceV);
                //冷量单价
                var ecpv = parseFloat(res.ecupVa).toFixed(4);
                $('#eer_com_cpirceV').html(ecpv);
                //能效值
                var lzeerV = 0;
                if (typeof (res.lzeerVa) == "undefined") {
                    lzeerV = 0;
                }
                else {
                    lzeerV = parseFloat(res.lzeerVa).toFixed(2);
                }
                /*能效对比：标杆建筑和当前楼 Mark 标记*/
                var idxG = parseInt(res.idxG);
                $('#tableMark').children('tbody').children('tr').eq(0).children('td').addClass('color');
                $('#tableMark').children('tbody').children('tr').eq(1).children('td').removeClass('goodIndicator').removeClass('markindicator');
                $('#tableMark').children('tbody').children('tr').eq(0).children('td').eq(idxG).removeClass('color').html('标杆建筑');
                $('#tableMark').children('tbody').children('tr').eq(1).children('td').removeClass('goodIndicator');
                $('#tableMark').children('tbody').children('tr').eq(1).children('td').eq(idxG).addClass('goodIndicator');
                var idxK = parseInt(res.idxK);
                $('#tableMark').children('tbody').children('tr').eq(0).children('td').eq(idxK).removeClass('color').html('当前楼(' + lzeerV + ')');
                $('#tableMark').children('tbody').children('tr').eq(1).children('td').eq(idxK).addClass('markindicator');
                $('#emisc').html("KWH/KWH");
                $('#cmisc').html("KWH");
                $('#eer_com_c_misc').html('KWH');
                $('#eer_com_cpirceV_misc').html('KWH');
                var tds = $('table tr:first td');//第一行
                if (lzeerV === 0) {
                    $('#latentV').html("0");
                }
                else {
                    //-- KW/KW 潜力=(实际值-目标值)*-1/目标值*100% --/
                    //-- KW/RT 潜力=(实际值-目标值)/目标值*100% --/
                    var pocV = 0.0;
                    //KW/KW
                    pocV = Math.abs(((lzeerV - benchMarkV) / benchMarkV * 100));
                    $('#latentV').html(pocV.toFixed(2).toString());
                    //$('#latentV').html(Math.abs(((benchMarkV - lzeerV) / benchMarkV * 100)).toFixed(2).toString());
                }
                var lgs = [];
                for (var i = 0; i < res.lgs.length; i++) {
                    lgs.push(res.lgs[i]);
                }
                var ys = [];
                for (var i = 0; i < res.ys.length; i++) {
                    var object = {};
                    object.value = res.ys[i];
                    object.name = lgs[i] + " " + res.ys[i] + "%";
                    ys.push(object);
                }
                option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br>{b}"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                    },
                    series: [
                        {
                            name: '冷站分项图',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            data: ys
                        }
                    ]
                };
                mycv.setOption(option, true);
                jQuery('#eerBusy').hideLoading();
            }else if(res.code === -1){
                jQuery('#eerBusy').hideLoading();
                alert('异常错误(能效对比和分项图):' + res.msg);
            }else{
                jQuery('#eerBusy').hideLoading();
            }
        })
    }

}();