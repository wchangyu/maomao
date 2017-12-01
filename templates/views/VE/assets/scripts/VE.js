var VE = (function () {

    //字符串转时间格式
    var convertDate = function (strDate) {
        var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
         function (a) {
             return parseInt(a, 10) - 1;
         }).match(/\d+/g) + ')');
        return date;
    }

    //格式转换
    var Format = function (now, mask) {
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

    //方法 增添dayNumber天（整形），date：如果没传就使用今天（日期型）
    var addDay = function (dayNumber, date) {
        date = date ? date : new Date();
        var ms = dayNumber * (1000 * 60 * 60 * 24)
        var newDate = new Date(date.getTime() + ms);
        return newDate;
    }

    return {
        init: function () {
            //convertDate();
            //Format();
            //addZeroToSingleNumber();
            //addDay();
        },
        addZeroToSingleNumber: function (num) {
            //判断日期或者月份是否小于10，如果小于10，补零
            var curnum = "";
            if (num < 10) {
                curnum = "0" + num;
            }
            else {
                curnum += num;
            }
            return curnum;
        },
        getQueryStr: function (name, ispe) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                var rs = r[2];
                if (ispe) {
                    var pe = unescape(rs);
                    return pe;
                }
                else {
                    return rs;
                }
            }
            return null;
        }
    }

})();