var Rate=function () {

    //chartView
    var mycv;

    window.onresize = function (ev) {
        if(mycv){
            mycv.resize();
        }
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

    //初始化时间控件
    var initdatetimepicker=function () {
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
        $('.rateDT').datetimepicker({
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

    //获取负荷数据
    var getRateDs = function () {
        jQuery('#rateBusy').showLoading();
        mycv = echarts.init(document.getElementById('rateMain'));
        var sp = $('#spDT').val();
        var ep = $('#epDT').val();
        var url = sessionStorage.apiUrlPrefix + "RateEER/GetRateEERs";
        $.post(url,{
            pId:'8817180401',
            sp:sp,
            ep:ep
        },function (res) {
            if(res.code===0){
                var miscstr = 'KW/KW';
                var maxeerVa = 9;
                var maxRateVa = res.rateMaxVa;
                var ys = [];
                for (var i = 0; i < res.ys.length; i++) {
                    var object = {};
                    if (i == 0) {
                        object.name = '负荷比例(%)';
                        object.type = 'bar';
                    }
                    else {
                        object.name = '冷站能效(' + miscstr + ')';
                        object.type = 'line';
                        object.yAxisIndex = 1;
                    }
                    object.data = [];
                    for (var j = 0; j < res.ys[i].length; j++) {
                        var obj = {};
                        obj.itemStyle = {};
                        obj.itemStyle.normal = {};
                        if (i == 0) {
                            obj.itemStyle.normal.color = "#007acc";
                        }
                        else {
                            obj.itemStyle.normal.color = "#c23531";
                        }
                        if (res.ys[i][j] === 0) {
                            obj.value = '';
                        }
                        else {
                            obj.value = res.ys[i][j];
                        }
                        object.data.push(obj);
                    }
                    ys.push(object);
                }
                var xs = [];
                var xsCNT = res.xs.length;
                for (var j = 0; j < xsCNT; j++) {
                    xs.push(res.xs[j]);
                }
                option = {
                    color: ['#007acc', '#c23531'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['负荷比例(%)', '冷站能效(' + miscstr + ')']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: xs
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '负荷比例(%)',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '冷站能效(' + miscstr + ')',
                            min: 0,
                            max: maxeerVa,
                            interval: maxeerVa / 10,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series: ys
                };
                mycv.setOption(option);
                jQuery('#rateBusy').hideLoading();
            }else if(res.code===-1){
                alert('异常错误(负荷分析):' + res.msg);
                jQuery('#rateBusy').hideLoading();
            }else{
                jQuery('#rateBusy').hideLoading();
            }
        })
    }
    
    return {
        init: function () {
            //初始化时间控件
            initdatetimepicker();
            //获取负荷数据
            getRateDs();
            $('#rateBtn').on('click',function () {
                getRateDs();
            })
        }
    }

}();