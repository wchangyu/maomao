var Abbr = function () {

    var abbrChartView = null;//chartView图

    window.onresize = function () {
        if (abbrChartView) {
            abbrChartView.resize();
        }
    }

    var selectAREA = "EC";//选中东冷站区域

    var selectEQTY = "";//选中离心机系统设备类型

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
        $('.ABBRDT').datetimepicker({
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
        var url = sessionStorage.apiUrlPrefix + "/MultiAreaHistory/GetEQTypes";
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

        var str = '';

        if (chArAy.length > 0) {
            for (var i = 0; i < chArAy.length; i++) {

                var charK = chArAy[i].item;

                var charV = chArAy[i].name;

                var charT = chArAy[i].tag;

                //$('#areaType').append($("<option value=\"" + charK + "\">" + charV + "</option>"));

                str += '<option data-tag="' + charT + '" value="' + charK +'">' + charV + '</option>';

                $('#areaType').empty().append(str);


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

        var str = '';

        if (eqtys.length > 0) {
            for (var i = 0; i < eqtys.length; i++) {
                var eqtyK = eqtys[i].type;
                var eqtyV = eqtys[i].name;
                var eqtyT = eqtys[i].tag;

                str += '<option data-tag="' + eqtyT + '" value="' + eqtyK +'">' + eqtyV + '</option>';

            }

            $('#eqType').empty().append(str);

            //自动选择第一个
            $('#eqType').val(eqtys[0].type);

            selectEQTY = $('#eqType').children('option:selected').attr('data-tag');

            getAbbrDs();

        }
    }

    //echarts配置项
    var abbrOption = {
        legend:{

            show:true,
            data:[]
        },
        grid:{

            width:'70%'

        },
        toolbox: { //可视化的工具箱
            show: true,
            feature: {
                dataView: { //数据视图
                    show: true
                }
            },
            right:50
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: [

        ],
        series: [


        ]
    };

    //y轴名称
    function Yname(yarr,namearr,maxarr){

        var marginL = 0;

        for(var i=0;i<namearr.length;i++){

            if(i > 1){

                marginL = marginL + Number(20) + 60;

            }else{

                marginL = 0;

            }

            var obj = {};

            obj.name = namearr[i];

            obj.type = 'value';

            obj.offset = marginL;

            //最大值
            obj.max = maxarr[i];

            //最小值
            obj.min = 0;

            //间隔
            obj.interval = maxarr[i] / 5;

            yarr.push(obj);

        }
    }

    //获取参数分析数据
    var getAbbrDs = function () {

        jQuery('#abbrBusy').showLoading();

        abbrChartView = echarts.init(document.getElementById('abbrChartView'));

        var sp = $("#spDT").val();
        var ep = $("#epDT").val();
        var eType = $("#eType").val();
        var url = sessionStorage.apiUrlPrefix + "MultiAreaAbbr/GetAbbrAnalysisDs";

        $.post(url, {
            "pId": sessionStorage.PointerID,
            "sp": sp,
            "ep": ep,
            "area": selectAREA,
            "eqty": selectEQTY,
            "eType": eType
        }, function (res) {

            //设置x轴
            var xArr= [];

            if(res.xs){

                for(var i=0;i<res.xs.length;i++){

                    xArr.push(res.xs[i]);

                }

            }

            var yIndex = [0,1,2,2,3,3];

            var color = ['#355a9a','#355a9a','#ed7e33','#ffc40f','#274278','#274278'];

            //初始化
            abbrOption.series = [];

            abbrOption.legend.data = [];

            //设置y轴
            if(res.ys){

                for(var i=0;i<res.ys.length;i++){

                    var obj = {};

                    obj.name = res.lgs[i];

                    obj.type = 'line';

                    obj.data = res.ys[i];

                    obj.yAxisIndex = yIndex[i];

                    obj.itemStyle = {

                        color:color[i],

                        emphasis:{

                            label:{

                                show:true,

                                formatter:function(params){

                                    return '时间：' + params.name + '\n' + '值：' + params.value


                                },

                                fontSize:14,

                                lineHeight:70

                            }

                        }

                    };

                    abbrOption.series.push(obj);

                }

            }

            //图例
            if(res.lgs){

                for(var i=0;i<res.lgs.length;i++){

                    abbrOption.legend.data.push(res.lgs[i]);

                }

            }

            abbrOption.xAxis.data = xArr;

            //y轴名称
            //多y轴
            var yZhou = [];

            //计算每一个值对应的最大最小值[0,1,2,2,3,3]

            var yZhouMax = [];

            //第一个
            yZhouMax.push(res.mxs[0]);

            //第二个
            yZhouMax.push(res.mxs[1]);

            //比较第二个和第三个的值，谁大，放到数组中
            if(Number(res.mxs[2])>=Number(res.mxs[3])){

                yZhouMax.push(res.mxs[2])

            }else{

                yZhouMax.push(res.mxs[3])

            }

            //比较第四个和四五个
            if(Number(res.mxs[4])>=Number(res.mxs[5])){

                yZhouMax.push(res.mxs[4])

            }else{

                yZhouMax.push(res.mxs[5])

            }

            //console.log(yZhouMax);

            //东西冷站离心机
            if( selectAREA == 'EC' || selectAREA == 'WC'){

                var arr = ['机组能效（kWh/kWh）','供冷量','温度（℃）','流量（m³）'];

                Yname(yZhou,arr,yZhouMax);

            }else if( selectAREA == 'EH' || selectAREA == 'WH' ){

                if( selectEQTY == 'HRB' ){

                    var arr = ['换热效率','供热量','压力','温度','流量'];

                    Yname(yZhou,arr,yZhouMax);

                }else if( selectEQTY == 'CNB' ){

                    var arr = ['输送系数','供热量','温度','流量'];

                    Yname(yZhou,arr,yZhouMax);

                }


            }


            //判断
            abbrOption.yAxis = yZhou;

            abbrChartView.setOption(abbrOption,true);

            if (res.code === 0) {

                jQuery('#abbrBusy').hideLoading();

            } else {

                //初始化
                abbrOption.series = [];

                abbrOption.legend.data = [];

                abbrOption.xAxis.data = [];

                abbrOption.yAxis = [];

                abbrChartView.setOption(abbrOption);

                jQuery('#abbrBusy').hideLoading();
            }
        })
    }

    //排序（小到大）
    //ary.sort(function(a,b){return a-b;});

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
                selectAREA = $(this).children('option:selected').attr('data-tag');

                //初始化设备类型选择控件
                initEqTypeSelectCtrl(chArId);

                selectEQTY = $('#eqType').children('option:selected').attr('data-tag');

            });
            //选择设备类型
            $('#eqType').change(function () {
                selectEQTY = $(this).children('option:selected').attr('data-tag');
            })
            //默认调用数据
            //getAbbrDs();

            //获取数据
            $('#abbrBtn').on('click', function () {
                getAbbrDs();
            })

        }

    }


}()