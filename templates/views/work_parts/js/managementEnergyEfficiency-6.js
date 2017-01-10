$(function(){
    myChart = echarts.init(document.getElementById('echartsBlock1'));
    option1 = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series : [
            {
                name: '',
                type: 'pie',
                radius : '55%',
                label:{
                    normal:{
                        show:true,
                        position:'inside',
                        formatter:'{d}' + '%',
                        textStyle:{
                            fontSize:'15',
                        }
                    }
                },
                center: ['58%', '42%'],
                data:[
                    {value:335, name:'',itemStyle:{
                        normal:{
                            color:'#70ad46'
                        }
                    }
                    },
                    {value:310, name:'',itemStyle:{
                        normal:{
                            color:'#ffc101'
                        }
                    }}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    normal:{
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    };
    myChart.setOption(option1);
    myChart1 = echarts.init(document.getElementById('contentBlock'));
    option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['制冷量','额定冷量','负荷率']
        },
        xAxis: [
            {
                type: 'category',
                data: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                min: 0,
                max: 1500,
                interval: 500,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '',
                min: 0,
                max: 1.5,
                interval: 0.5,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name:'制冷量',
                type:'bar',
                data:[400, 460, 390, 385, 384, 384, 385, 358, 358, 500, 520, 540,560,560,560,1200,1100,900,800,600,760,500,320],
                itemStyle:{
                    normal:{
                        color:'#4472c5'
                    }
                }
            },
            {
                name:'额定冷量',
                type:'bar',
                data:[1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,1000],
                itemStyle:{
                    normal:{
                        color:'#a7b5db'
                    }
                }
            },
            {
                name:'负荷率',
                type:'line',
                yAxisIndex: 1,
                data:[0.4, 0.46, 0.39, 0.385, 0.384, 0.384, 0.385, 0.38, 0.35,0.5, 0.52, 0.54, 0.56,0.56,0.56,1.2,1.1,0.9,0.8,0.6,0.76,0.5,0.32],
                itemStyle:{
                    normal:{
                        color:'#4472c5'
                    }
                }
            }
        ]
    };
    myChart1.setOption(option);
})
window.onresize = function () {
    if(myChart && myChart1){
        myChart.resize();
        myChart1.resize();
    }
}