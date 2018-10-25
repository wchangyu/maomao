$(function(){

    //右上角故障分析
    var GZFX = echarts.init(document.getElementById('GZFX'));

    var GZFXoption = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:['蒸发器','冷凝器','滑阀','电磁阀','控制器','冷凝风扇','电子膨胀阀','压缩机','其它']
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
                    {value:335, name:'蒸发器'},
                    {value:310, name:'冷凝器'},
                    {value:234, name:'滑阀'},
                    {value:135, name:'电磁阀'},
                    {value:258, name:'控制器'},
                    {value:346, name:'冷凝风扇'},
                    {value:279, name:'电子膨胀阀'},
                    {value:65, name:'压缩机'},
                    {value:539, name:'其它'}
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

    GZFX.setOption(GZFXoption,true);

})