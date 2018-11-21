$(function(){

    _moTaiKuang($('#myModal'),'报警提示','',false,false,'');

    /*-----------------------------------echart---------------------------------------------*/

    //圆环(左)
    var _ringChartL = echarts.init(document.getElementById('ringChartL'));

    //圆环（右）
    var _ringChartR = echarts.init(document.getElementById('ringChartR'));

    //圆环参数
    var _ringOption = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            x: 'center',
            bottom:'10',
            data:['运行','故障','停用']
        },
        series: [
            {
                name:'访问来源',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                center:['50%','50%'],
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:335, name:'运行'},
                    {value:310, name:'故障'},
                    {value:234, name:'停用'}
                ]
            }
        ]
    };

    //生成
    _ringChartL.setOption(_ringOption,true);

    _ringOption.series[0].data = [

        {value:135, name:'运行'},
        {value:110, name:'故障'},
        {value:200, name:'停用'}

    ];

    _ringChartR.setOption(_ringOption,true);

    //仪表盘
    var _gaugeChart = echarts.init(document.getElementById('gaugeChart'));

    //仪表盘参数
    var _gaugeOption = {
        tooltip : {
            formatter: "{a} <br/>{c} {b}"
        },
        toolbox: {
            show: true,
            feature: {
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        series : [
            {
                name: 'PUE',
                type: 'gauge',
                z: 3,
                min: 1,
                max: 4,
                splitNumber: 5,
                radius: '60%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.17, '#87ceeb'], [0.33, '#7bd195'], [0.47, '#ffeb3b'],[0.67,'#ffa9b1'],[4,'red']],
                        width: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length: 15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                axisLabel: {
                    borderRadius: 1,
                    color: 'auto',
                    padding: 3,
                },
                title : {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 20,
                    fontStyle: 'italic',
                },
                detail : {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    formatter: function (value) {
                        value = (value + '').split('.');
                        value.length < 2 && (value.push('00'));
                        return ('00' + value[0]).slice(-2)
                            + '.' + (value[1] + '00').slice(0, 2);
                    },
                    fontWeight: 'bolder',
                    fontFamily: 'Arial',
                    width: 100,
                    color: '#63869e',
                    rich: {}
                },
                data:[{value: 1.8, name: 'kWh/kWh'}]
            },
            {
                name: 'CLF',
                type: 'gauge',
                center: ['20%', '55%'],    // 默认全局居中
                radius: '45%',
                min:0,
                max:2,
                endAngle:45,
                splitNumber:4,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.27, '#87ceeb'], [0.40, '#7bd195'], [0.59, '#ffeb3b'],[0.67,'#ffa9b1'],[4,'red']],
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length:12,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length:20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer: {
                    width:5
                },
                title: {
                    offsetCenter: [0, '-30%'],       // x, y，单位px
                },
                detail: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder'
                },
                data:[{value: 0.5, name: 'kWh/kWh'}]
            },
            {
                name: 'PLF',
                type: 'gauge',
                center: ['80%', '55%'],    // 默认全局居中
                radius: '45%',
                min:0,
                max:0.5,
                startAngle:145,
                splitNumber:5,
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.20, '#87ceeb'], [0.40, '#7bd195'],[0.60,'#ffa9b1'],[4,'red']],
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length:12,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length:20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer: {
                    width:5
                },
                title: {
                    offsetCenter: [0, '-30%'],       // x, y，单位px
                },
                detail: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder'
                },
                data:[{value: 0.2, name: 'kWh/kWh'}]
            },
        ]
    };

    //生成
    _gaugeChart.setOption(_gaugeOption,true);

    //荷载
    //var _loadChart = echarts.init(document.getElementById('loadChart'));

    //荷载参数
    var labelRight = {
        normal: {
            position: 'right'
        }
    };

    var _loadOption = {

        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top: 80,
            bottom: 30
        },
        xAxis: {
            type : 'value',
            position: 'top',
            splitLine: {lineStyle:{type:'dashed'}},
        },
        yAxis: {
            type : 'category',
            axisLine: {show: false},
            axisLabel: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            data : ['IT荷载', 'HVAC荷载', 'UPS负载']
        },
        series : [
            {
                name:'数值',
                type:'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        formatter: '{b}'
                    }
                },
                data:[
                    {value: 60, label: labelRight},
                    {value: 30, label: labelRight},
                    {value: 10, label: labelRight}
                ]
            }
        ]
    };

    //生成
    //_loadChart.setOption(_loadOption,true);

    /*-------------------------------------初始化表格----------------------------------------*/

    var col = [

        {
            title:'内容',
            data:''
        },
        {
            title:'区域',
            data:''
        },
        {
            title:'进展',
            data:''
        }

    ]

    _tableInit($('.table2'),col,1,true,'','',true,'');

    //报警
    var alarmCol  = [

        {
            title:'报警内容',
            data:'BJNR'
        },
        {
            title:'级别',
            data:'JB'
        },
        {
            title:'所在机房',
            data:'SZJF'
        },
        {
            title:'关联设备',
            data:'GLSB'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                return "<span class='data-option option-confirm btn default btn-xs green-stripe'>确认</span>" +

                    "<span class='data-option option-query btn default btn-xs green-stripe'>查询</span>" +

                    "<span class='data-option option-GD btn default btn-xs green-stripe'>分派</span>" +

                    "<span class='data-option option-modify btn default btn-xs green-stripe'>修改范围</span>" +

                    "<span class='data-option option-delay btn default btn-xs green-stripe'>延迟报警</span>"

            }

        }

    ]

    _tableInit($('#table1'),alarmCol,2,true,'','',true,'');

    var alarmArr = [

        {
            'BJNR':'T2温度高',
            'JB':'H',
            'SZJF':'101',
            'GLSB':'K1'
        }

    ]

    _datasTable($('#table1'),alarmArr);

    /*----------------------------------------按钮事件------------------------------------------*/

    //chart图自适应
    window.onresize = function(){

        if(_ringChartL && _ringChartR && _gaugeChart){

            _ringChartL.resize();

            _ringChartR.resize();

            _gaugeChart.resize();

            //_loadChart.resize();

        }

    }

})