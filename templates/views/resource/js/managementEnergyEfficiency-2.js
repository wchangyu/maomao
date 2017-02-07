$(function(){
    _myChart = echarts.init(document.getElementById('echartsBlocks'));
    option = {
        title: {
            text: '空调能耗指标',
            left:'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: ['13/07','13/08','13/09','13/10','13/11','13/12','14/01','14/02','14/03','14/04','14/05','14/06']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [

            {
                name:'最低气温',
                type:'line',
                data:[100, 130, 118, 116, 117, 120, 150,190,185,183,174,170],
                itemStyle:{
                    normal:{
                        color:'#92d050'
                    }
                }
            }
        ]
    };
    _myChart.setOption(option);
    _myChart1 = echarts.init(document.getElementById('echartsBlockss'));
    option.title.text = '冷站能效比';
    option.series[0].itemStyle.normal.color = '#5b9bd5';
    option.series[0].data = [2.7,2.9,3.2,2.75,2.5,2.56,2.6,2.58,2.55,2.43,2.5,2.6]
    _myChart1.setOption(option);
    //一般时间初始化
        $('.datetimepickers').datepicker(
            {
                language:  'zh-CN',
                todayBtn: 1,
                todayHighlight: 1,
                format: 'yyyy-mm-dd'
            }
        )
})
window.onresize = function () {
    if(_myChart && _myChart1){
        _myChart.resize();
        _myChart1.resize();
    }
}