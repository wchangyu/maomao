$(function(){
    _myChart1 = echarts.init(document.getElementById('echartsBlock'));
    option = {
        title:{
            text:'冷量实时预测图',
            show:true,
            left:'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        xAxis: [
            {
                type: 'category',
                data: ['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name:'数据',
                type:'bar',
                data:[120, 119, 120, 200, 200, 198, 210, 350, 465, 483, 515, 520,510,510,530,520,495,532,500,0,0,0,0,0],
                itemStyle:{
                    normal:{
                        color:'#0070c0'
                    }
                }
            }
        ]
    };
    _myChart1.setOption(option);
    $('.left-tips-left li').click(function(){
        $('.left-tips-left li').removeClass('active');
        $(this).addClass('active');
        if($(this).index() == 0){
            _myChart1 = echarts.init(document.getElementById('echartsBlock'));
            option = {
                title:{
                    text:'冷量实时预测图',
                    show:true,
                    left:'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name:'数据',
                        type:'bar',
                        data:[120, 119, 120, 200, 200, 198, 210, 350, 465, 483, 515, 520,510,510,530,520,495,532,500,0,0,0,0,0],
                        itemStyle:{
                            normal:{
                                color:'#0070c0'
                            }
                        }
                    }
                ]
            };
            _myChart1.setOption(option);
        }else if($(this).index() == 1){
            _myChart1 = echarts.init(document.getElementById('echartsBlock'));
            option = {
                title:{
                    text:'相邻日冷量图',
                    show:true,
                    left:'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name:'数据',
                        type:'bar',
                        data:[120, 119, 120, 200, 200, 198, 210, 350, 465, 483, 515, 520,510,510,530,520,495,532,500,485,456,444,366,361],
                        itemStyle:{
                            normal:{
                                color:'#0070c0'
                            }
                        }
                    }
                ]
            };
            _myChart1.setOption(option);
        }else if($(this).index() == 5){
            _myChart1 = echarts.init(document.getElementById('echartsBlock'));
            option = {
                title: {
                    text: '开机策略图',
                    left:'center'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type : 'category',
                    splitLine: {show:false},
                    data : ['1S','1P','1S 1P','1D','1S 1D','1P 1D','1S 1P 1D','2D','1S 2D','1P 2D','1S 1P 2D','3D','1S 3D','1P 3D','1S 1P 3D','4D']
                },
                yAxis: {
                    type : 'value'
                },
                series: [
                    {
                        name: '辅助',
                        type: 'bar',
                        stack:  '总量',
                        itemStyle: {
                            normal: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            },
                            emphasis: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            }
                        },
                        data: [0, 700, 1000, 1700, 2000, 2700,3000,3700,4000,4700,5000,5700,6000,6700,7000,7700],

                    },
                    {
                        name: '生活费',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: '#0070c0'
                            },
                            emphasis: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0.5)'
                            }
                        },
                        data:[700, 1000, 1700, 2000, 2700, 3000,3700,4000,4700,5000,5700,6000,6700,7000,7700,8000]
                    }
                ]
            };
            _myChart1.setOption(option);
        }
    })
})
window.onresize = function () {
    if(_myChart1){
        _myChart1.resize();
    }
}