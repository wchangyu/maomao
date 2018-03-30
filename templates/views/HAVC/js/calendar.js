//多区域能效日历
var Calendar = function () {

    var selectAREA = "EC";//选中东冷站区域

    var selectEQTY = "ZTC";//选中冷站总体设备类型

    var select_year = "";//选中的年

    var select_month = "";//选中的月

    var select_day = "";//选中的日

    //月数据M|日数据D。默认是月数据
    var selectDType = "M";

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
        select_year = mt.year();
        select_month = addZeroToSingleNumber(parseInt(mt.month()) + 1);
        select_day = addZeroToSingleNumber(parseInt(mt.date()));
        $("#spDt").val(nowDt);
        $('.idxDt').datetimepicker({
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
            select_year = ev.date.getFullYear();
            select_month = addZeroToSingleNumber(parseInt(ev.date.getMonth()) + 1);
            select_day = addZeroToSingleNumber(parseInt(ev.date.getDate()));
        });
    };

    //获取设备类型
    var getEqTyAys = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaCalendar/GetEQTypes";
        $.get(url, function (res) {
            eqTyAy = res;
            //获取区域数据
            getAreaAys();
        })
    }

    //获取区域数据
    var getAreaAys = function () {
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaHistory/GetChillAREAs";
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
                var charT = chArAy[i].tag;
                $('#areaType').append($("<option tag=\"" + charT + "\" value=\"" + charK + "\">" + charV + "</option>"));
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
                var eqtyT = eqtys[i].tag;
                $('#eqType').append($("<option tag=\"" + eqtyT + "\" value=\"" + eqtyK + "\">" + eqtyV + "</option>"));
            }
            selectEQTY = eqtys[0].tag;
        }
    }


    //初始化查询日期
    var initQueryDt = function () {
        return moment(
            select_year
            + "-" +
            select_month
            + "-" +
            select_day
        ).format('YYYY-MM-DD');
    }

    //获取日历数据
    var getKPIs = function () {

        $('#monthBtn').addClass('green');

        $('#dayBtn').removeClass('green');

        selectDType = "M";//默认选中月数据
        var queryDt = initQueryDt();
        var url = sessionStorage.apiUrlPrefix + "MultiAreaCalendar/GetEWCHKPI";

        $.post(url, {
            pId: sessionStorage.PointerID,
            area: selectAREA,
            eqty: selectEQTY,
            sp: queryDt
        }, function (res) {
            if (res.code === 0) {
                var eds = [];
                for (var i = 0; i < res.ecps.length; i++) {
                    var object = {};
                    object.title = res.ecps[i].title;
                    var y = res.ecps[i].y;
                    var m = res.ecps[i].m;
                    var d = res.ecps[i].d;
                    var h = res.ecps[i].h;
                    var startDt = new Date(y, (m - 1), d, h);
                    object.start = startDt;
                    if (res.ecps[i].type === "E") {
                        //object.backgroundColor = req.ecps[i].color;
                    }
                    else {
                        //object.backgroundColor = "transparent";
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

                    }
                });
                $('.fc-time').hide();
                $('.fc-today-button').hide();
                $('.fc-left').hide();
                $('.fc-prev-button').hide();
                $('.fc-next-button').hide()
            } else {
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
            //获取设备类型
            getEqTyAys();
            //选择区域
            $('#areaType').change(function () {
                var chArId = $(this).val();
                selectAREA = $(this).children('option:selected').attr('tag');
                //初始化设备类型选择控件
                initEqTypeSelectCtrl(chArId);
            });
            //选择设备类型
            $('#eqType').change(function () {
                selectEQTY = $(this).children('option:selected').attr('tag');
            })
            //查询数据
            $('#queryBtn').on('click', function () {

                getKPIs();
            })
        }
    }


}();