var Abbr = function () {

    //冷站参数分析ChartView图
    var mycv = null;

    //窗体发生改变时ChartView跟着改变大小
    window.onresize = function (ev) {
        if(mycv){
            mycv.resize();
        }
    }

    //字符串转时间格式
    function convertDate(strDate) {
        var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
            function (a) {
                return parseInt(a, 10) - 1;
            }).match(/\d+/g) + ')');
        return date;
    }

    //时间格式转换
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

    //初始化时间控件
    var initdatetimepicker = function () {
        var nowDt = new Date();
        var year = nowDt.getFullYear();
        var month = parseInt(nowDt.getMonth())+1;
        var day = nowDt.getDate();
        var dtstr = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        var mt= moment(dtstr);
        var nowDt=mt.format('YYYY-MM-DD');
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
    };

    //改变复选框的Checked选项
    var changeCheckBoxAttr =function () {
        $("[name=chkDC]:checkbox").bind("click", function () {
            if ($(this).attr('tag') === "L") {
                //$('#cbxWT').removeAttr("checked");
                $('#cbxWT').attr("checked",false);
            }
            if ($(this).attr('tag') === "W") {
                //$('#cbxE').removeAttr("checked");
                $('#cbxE').attr('checked',false);
                //$('#cbxC').removeAttr("checked");
                $('#cbxC').attr('checked',false);
            }
        });
    }

    //获取参数分析数据
    var getAbbrDs = function () {
        var arostr = "";
        $("input[name=chkDC]:checked").each(function () {
            arostr += $(this).val() + ",";
        });
        if( arostr === undefined || arostr.length === 0){
            console.log('提示(参数分析):请选择分项参数');
            return false;
        }
        jQuery('#abbrBusy').showLoading();
        mycv = echarts.init(document.getElementById('eerMain'));
        var sp = $("#spDT").val();
        var ep = $("#epDT").val();
        var eType = $("#eType").val();
        var url = sessionStorage.apiUrlPrefix + "AbbrEER/GetAbbrEERAnalysisDs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            arostr:arostr,
            sp:sp,
            ep:ep,
            eType:eType
        },function (res) {
            if(res.code === 0){
                var maxVa = parseInt(res.aroMaxVa);//能耗最大值
                //是否获取水温数据(bool类型)
                var IsCalsW = res.isCalsW;
                var covST = Format(convertDate(sp), "MM月dd日");
                var covET = Format(convertDate(ep), "MM月dd日");
                var titleText = covST + " - " + covET + " 冷站参数分析";
                var lgs = [];
                for (var i = 0; i < res.lgs.length; i++) {
                    lgs.push(res.lgs[i]);
                }
                var cgs = [];
                for (var i = 0; i < 1; i++) {
                    var object = {};
                    object.type = "category";
                    object.boundaryGap = true;
                    var axisLabelobject = {};
                    axisLabelobject.rotate = 30;
                    axisLabelobject.margin = 20;
                    object.axisLabel = axisLabelobject;
                    object.data = [];
                    for (var j = 0; j < res.xs.length; j++) {
                        object.data.push(res.xs[j]);
                    }
                    cgs.push(object);
                }
                var yAs = [];
                if (lgs.length == 1) {
                    var object = {};
                    object.type = "value";
                    object.name = "能效";
                    object.min = 0;
                    object.max = 7;
                    object.interval = 0.7;
                    yAs.push(object);
                }
                else {
                    for (var i = 0; i < 2; i++) {
                        var object = {};
                        object.type = "value";
                        if (i == 0) {
                            object.name = "能效";
                            object.min = 0;
                            object.max = 7;
                            object.interval = 0.7;
                        }
                        else {
                            if (IsCalsW === true) {
                                object.name = "水温";
                            }
                            else {
                                object.name = "能耗";
                            }
                            object.min = 0;
                            object.max = maxVa;
                            object.interval = maxVa / 10;//间隔是10
                        }
                        yAs.push(object);
                    }
                }
                var dvs = [];
                for (var i = 0; i < res.ys.length; i++) {
                    var object = {};
                    object.name = lgs[i];
                    object.type = "line";
                    if (i == 0) {
                        object.yAxisIndex = 0;//能效
                    }
                    else {
                        object.yAxisIndex = 1;//能耗
                    }
                    object.data = [];
                    for (var j = 0; j < res.ys[i].length; j++) {
                        var v = res.ys[i][j];
                        object.data.push(v);
                    }
                    dvs.push(object);
                }
                $('#spanTitle').html(titleText);
                option = {
                    title: {
                        subtext: 'KW/KW'
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
                            saveAsImage: { show: true }
                        }
                    },
                    xAxis: cgs,
                    yAxis: yAs,
                    series: dvs
                };
                mycv.setOption(option);
                jQuery('#abbrBusy').hideLoading();
            }else if(res.code === -1){
                jQuery('#abbrBusy').hideLoading();
                console.log('异常错误(参数分析):' + res.msg);
            }else{
                jQuery('#abbrBusy').hideLoading();
            }
        })
    }
    
    return {
        init: function () {
            //初始化时间控件
            initdatetimepicker();
            //改变复选框的Checked选项
            changeCheckBoxAttr();
            //(默认)获取参数分析数据
            getAbbrDs();
            //查询数据
            $('#abbrBtn').on('click',function () {
                getAbbrDs();
            })
        }
    }

}();