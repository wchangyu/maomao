$(function(){

    /*--------------------------------------时间插件-----------------------------------*/

    //初始化时间控件
    //initdatetimepicker();

    var nowTime = moment(sessionStorage.sysDt).format('YYYY-MM-DD');

    $('#spDT').val(nowTime);

    $('#epDT').val(moment(nowTime).add(1,'d').format('YYYY-MM-DD'));

    //初始化时间控件
    _timeYMDComponentsFun11($('.abbrDT'));

    /*---------------------------------------表格初始化----------------------------------*/

    var col = [

        {
            title:'采集量',
            data:'cj'
        },
        {
            title:'达标量',
            data:'db'
        },
        {
            title:'不达标量',
            data:'ndb'
        },
        {
            title:'达标率',
            data:'dbp'
        },
        {
            title:'数据校核',
            data:'xh'
        }

    ]

    _tableInit($('#avg_table'),col,2,true,'','',true,'','',false);

    //默认查询
    conditionSelect();

    /*---------------------------------------按钮事件-----------------------------------*/

    //按钮事件
    $('#rphBtn').click(function(){

        //条件查询
        conditionSelect();

    })


    //窗口重置
    window.onresize = function(){

        if(mychart){

            mychart.resize();

        }

    }

    /*---------------------------------------echarts-----------------------------------*/

    var mychart = echarts.init(document.getElementById('chartBlock'));

    var option = {

        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                dataView: {

                    readOnly:true,

                    optionToContent: function(opt) {

                        //thead
                        var table = '<table class="table table-striped table-advance table-hover  dataTable no-footer">';

                        var tables = '</table>';

                        var thead = '<thead>';

                        var theads = '</thead>';

                        var tbody = '<tbody>';

                        var tbodys = '</tbody>';

                        //th
                        var thStr = '<tr><th>时间</th>';

                        for(var i=0;i<opt.series.length;i++){

                            thStr += '<th>';

                            thStr += opt.series[i].name;

                            thStr += '</th>'

                        }

                        thStr += '</tr>';

                        //td
                        var tdStr = '';

                        for(var i=0;i<opt.xAxis[0].data.length;i++){

                            tdStr += '<tr>';

                            //时间
                            tdStr += '<td>';

                            tdStr += opt.xAxis[0].data[i];

                            tdStr += '</td>';

                            for(var j=0;j<opt.series.length;j++){

                                tdStr += '<td>';

                                tdStr += opt.series[j].data[i]==undefined?'-':opt.series[j].data[i];

                                tdStr += '</td>';

                            }

                            tdStr += '</tr>';


                        }

                        return table + thead + thStr + theads + tbody + tdStr + tbodys + tables;



                    }

                },

                //保存图片
                saveAsImage:{},
                //还原
                restore:{},

                magicType:{

                    type: ['bar','line']

                }
            }
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },

        yAxis: [
            {
                type: 'value',
                name: '能耗',
                min: 0,
                max: '',
                interval: '',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '热不平衡率',
                min: 0,
                max: 100,
                interval: 10,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [

        ]
    };

    /*---------------------------------------其他方法----------------------------------*/

    //日历插件
    //function initdatetimepicker(){
    //
    //    var nowDt = new Date();
    //    var year = nowDt.getFullYear();
    //    var month = parseInt(nowDt.getMonth())+1;
    //    var day = nowDt.getDate();
    //    var dtstr = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
    //    var mt= moment(dtstr);
    //    var nowDt=mt.format('YYYY-MM-DD');
    //    var startDt = mt.subtract(1, 'days').format('YYYY-MM-DD');
    //    $("#spDT").val(startDt);
    //    $("#epDT").val(nowDt);
    //    $('.abbrDT').datetimepicker({
    //        format: 'yyyy-mm-dd',
    //        language: 'zh-CN',
    //        weekStart: true,
    //        todayBtn: true,
    //        autoclose: true,
    //        todayHighlight: true,
    //        startView: 2,
    //        minView: 2,
    //        minuteStep: 10,
    //        forceParse: 0,
    //        pickerPosition: "bottom-left"
    //    });
    //
    //}

    //日期格式化
    function addZeroToSingleNumber(num){

        var curnum = "";
        if (num < 10) {
            curnum = "0" + num;
        }
        else {
            curnum += num;
        }
        return curnum;

    }

    //条件选择
    function conditionSelect(){

        $('#compareBusy').showLoading();

        var prm = {

            //楼宇
            pId:sessionStorage.PointerID,
            //单位
            misc:sessionStorage.misc,
            //开始事件
            sp:$('#spDT').val(),
            //结束事件
            ep:$('#epDT').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'ThIR/GetThIRAnalysisDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#compareBusy').hideLoading();

                if(result.code == 0){

                    //legend
                    var legendArr = [];

                    for(var i=0;i<result.lgs.length;i++){

                        legendArr.push(result.lgs[i]);

                    }

                    option.legend.data = legendArr;

                    //横坐标
                    var dataX = [];

                    for(var i=0;i<result.xs.length;i++){

                        dataX.push(result.xs[i]);

                    }

                    option.xAxis.data = dataX;

                    //纵坐标
                    var dataY = [];

                    for(var i=0;i<result.ys.length;i++){

                        var obj = {};

                        obj.name = legendArr[i];

                        obj.type = 'line';

                        //判断根据的是哪个轴
                        if(i != result.ys.length-1){

                            obj.yAxisIndex = 0;

                        }else{

                            obj.yAxisIndex = 1;

                        }

                        var ydata = [];

                        for(var j=0;j<result.ys[i].length;j++){

                            ydata.push(result.ys[i][j]);

                        }

                        obj.data = ydata;

                        dataY.push(obj);
                    }

                    //判断间隔
                    //根据最大值来确定纵坐标的间隔
                    var _max = 0;

                    var _interval = 0;

                    var max = result.aroMax;

                    var lengths = parseInt(max).toString().length -1;

                    var first = Number(String(max).substr(0,1)) + Number(1);

                    _max = first * Math.pow(10,lengths);

                    _interval = _max / 10;

                    option.yAxis[0].max = _max;

                    option.yAxis[0].interval = _interval;

                    option.series = dataY;

                    //console.log(option);

                    mychart.setOption(option,true);

                    //表格
                    if(result.thirTbs){

                        var tableArr = [];

                        var obj = {};
                        //采集量
                        obj.cj = result.thirTbs[0];
                        //达标量
                        obj.db = result.thirTbs[1];
                        //不达标量
                        obj.ndb = result.thirTbs[2];
                        //达标率
                        obj.dbp = result.thirTbs[3];
                        //数据校核
                        obj.xh = result.thirTbs[4];

                        tableArr.push(obj);

                        _datasTable($('#avg_table'),tableArr);

                    }


                }else{

                    console.log('异常错误(热不平衡率):' + res.msg);

                }


            },

            error:function(XMLHttpRequest, textStatus, errorThrown){

                $('#compareBusy').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时')

                }else{

                    console.log('请求失败')

                }

            }

        })

    }


})