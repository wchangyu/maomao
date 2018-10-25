$(function(){

    //实时能耗-------------------------------------------------------------------------------------

    var _SSNH = echarts.init(document.getElementById('SSNH'));

    var _SSNHoption = {

        color:['#3674D9'],

        xAxis: {
            type: 'category',
            data: ['0', '1', '2', '3', '4', '5', '6','7','8','9'],
            "axisTick":{       //x轴刻度线
                "show":false
            },
            "axisLine":{       //x轴

                "lineStyle":{

                    color:'#E4EAF0'

                }
            },
            axisLabel:{

                color:'#687EA2'

            }
        },
        yAxis: {
            type: 'value',
            "axisTick":{       //y轴刻度线
                "show":false
            },
            "axisLine":{       //y轴
                "show":false,

                "lineStyle":{

                    color:'#687EA2'

                }
            },

            splitLine:{

                "lineStyle":{

                    color:'#E4EAF0'

                }

            }
        },
        series: [{
            data: [620, 832, 601, 384, 510, 630, 617,843,1187,986],
            type: 'line'
        }]
    };

    _SSNH.setOption(_SSNHoption,true);

    //机房PUE-------------------------------------------------------------------------------------

    //var _PUE = echarts.init(document.getElementById('PUE'));

    var _PUEoption = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top: 80,
            bottom: 90
        },
        xAxis: {
            type : 'value',
            position: 'bottom',
            data:['0.19','0.25','0.3','0.34','0.40'],
            axisLabel:{

                formatter:'{value} ',

                margin:20

            },
            interval:0.03,
            axisTick:{

                lineStyle:{

                    color:'#dddddd'

                },

                length:10

            }
        },
        yAxis: {
            type : 'category',
            axisLine: {show: false},
            axisLabel: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            data : []
        },
        series : [
            {
                name: '直接访问',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: false,
                        position: 'insideRight'
                    }
                },
                data: [

                    {
                        value:0.19,

                        itemStyle:{

                            color:'#3DD7C1'

                        }
                    }


                ],
                barWidth:34
            },
            {
                name: '直接访问',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: false,
                        position: 'insideRight'
                    }
                },
                data: [

                    {
                        value:0.06,

                        itemStyle:{

                            color:'#E5BB3C'

                        }
                    }

                ]
            },
            {
                name: '直接访问',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: false,
                        position: 'insideRight'
                    }
                },
                data: [

                    {
                        value:0.05,

                        itemStyle:{

                            color:'#EF5286'

                        }
                    }

                ]
            },
            {
                name: '直接访问',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: false,
                        position: 'insideRight'
                    }
                },
                data: [

                    {
                        value:0.1,

                        itemStyle:{

                            color:'#3DD7C1'

                        }
                    }

                ]
            },
            {
                name: '直接访问',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: false,
                        position: 'insideRight'
                    }
                },
                data: [

                    {
                        value:0.40,

                        itemStyle:{

                            color:'#E5BB3C'

                        }
                    }

                ]
            }
        ]
    };

    //_PUE.setOption(_PUEoption,true);

    //本日能耗组成
    var _BRNH = echarts.init(document.getElementById('BRNH'));

    var _BNNH = echarts.init(document.getElementById('BNNH'));

    var _NHoption = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:['冷机','水泵','精密空调','IT','其他']
        },
        series: [
            {
                name:'访问来源',
                type:'pie',
                radius: ['40%', '55%'],
                avoidLabelOverlap: false,
                labelLine: {
                    //normal: {
                    //    show: true
                    //},
                    lineStyle:{

                        color:'#959595'

                    },

                    length2:50
                },
                label:{

                    formatter:'{a|{d}%}\n{b|{b}}',

                    rich: {
                        a: {
                            color: '#999999',
                            fontSize: 20,
                            lineHeight: 20,
                            align: 'center'
                        },
                        b:{

                            color: '#959595',
                            fontSize: 12,
                            lineHeight: 20,
                            align: 'center'

                        }
                    },

                    padding:[-5,0,0,-50]

                },
                data:[
                    {value:335, name:'冷机'},
                    {value:310, name:'水泵'},
                    {value:234, name:'精密空调'},
                    {value:135, name:'IT'},
                    {value:1548, name:'其他',label:{

                        //padding:[0,0,0,200]

                    },labelLine:{

                        length:10,

                        length2:20

                    }}
                ],
                itemStyle : {
                    normal : {
                        color:function(params){
                            var colorList = [
                                '#31BEA4','#2A9FD0', '#4D7AE1','#8A52E7','#D944DB', '#d36e12', '#dc2612','#b70723', '#7c05cb', '#1c39d9','#f8276c'
                            ];
                            return colorList[params.dataIndex]

                        }
                    }
                },
            }
        ]
    };

    _BRNH.setOption(_NHoption,true);

    _NHoption.series[0].data = [

        {value:596, name:'冷机'},
        {value:361, name:'水泵'},
        {value:168, name:'精密空调'},
        {value:735, name:'IT'},
        {value:1548, name:'其他',label:{

            //padding:[0,0,0,200]

        },labelLine:{

            length:10,

            length2:20

        }}

    ]

    _BNNH.setOption(_NHoption,true);

    window.onresize = function(){

        if(_SSNH && _BRNH && _BNNH){

            _SSNH.resize();

            _BRNH.resize();

            _BNNH.resize();

        }

    }


})