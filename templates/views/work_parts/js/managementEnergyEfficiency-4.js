$(function(){
    _myChart = echarts.init(document.getElementById('lzMain'));
    option = {
        title:{
            text:'冷站',
            show:true,
            left:'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [
            {
                splitLine:false,
                type: 'category',
                data: ['标杆','A楼','S-1','S-2','S-3','S-4','S-5','S-6','B楼']
            }
        ],
        yAxis: [
            {
                splitLine:false,
                show:false,
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
                data:[5.16, 3.59, 3.57, 3.49, 3.22, 3.15, 2.94, 1.09, 1.00],
                itemStyle:{
                    normal:{
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = [
                                '#92d050','#31859c','#bfbfbf','#bfbfbf','#bfbfbf',
                                '#bfbfbf','#bfbfbf','#bfbfbf','#bfbfbf'
                            ];
                            return colorList[params.dataIndex]
                        },
                    }
                }
            }
        ]
    };
    _myChart.setOption(option);
    _myChart1 = echarts.init(document.getElementById('cMain'));
    option.title.text = '冷机';
    option.series[0].data = ['6.50','6.14','5.47','5.00','5.01','4.55','4.69','1.34','1.22'];
    _myChart1.setOption(option);
    _myChart2 = echarts.init(document.getElementById('chwMain'));
    option.title.text = '冷冻泵';
    option.series[0].data = ['50.00','16.57','16.21','32.98','19.62','18.74','16.18','12.40','8.51'];
    option.series[0].itemStyle.normal.color=function (params){
        var colorList = [
            '#92d050','#bfbfbf','#bfbfbf','#31859c','#bfbfbf',
            '#bfbfbf','#bfbfbf','#bfbfbf','#bfbfbf'
        ];
        return colorList[params.dataIndex]
    }
    _myChart2.setOption(option);
    _myChart3 = echarts.init(document.getElementById('cwMain'));
    option.title.text = '冷却泵';
    option.series[0].data = ['50.00','18.06','33.46','21.29','20.10','27.38','18.72','10.80','16.78'];
    option.series[0].itemStyle.normal.color=function (params){
        var colorList = [
            '#92d050','#bfbfbf','#31859c','#bfbfbf','#bfbfbf',
            '#bfbfbf','#bfbfbf','#bfbfbf','#bfbfbf'
        ];
        return colorList[params.dataIndex]
    }
    _myChart3.setOption(option);
    _myChart4 = echarts.init(document.getElementById('ctMain'));
    option.title.text = '冷却塔';
    option.series[0].data = ['50.00','18.06','33.46','21.29','20.10','27.38','18.72','10.80','16.78'];
    option.series[0].itemStyle.normal.color=function (params){
        var colorList = [
            '#92d050','#31859c','#bfbfbf','#bfbfbf','#bfbfbf',
            '#bfbfbf','#bfbfbf','#bfbfbf','#bfbfbf'
        ];
        return colorList[params.dataIndex]
    }
    _myChart4.setOption(option);
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
    if(_myChart && _myChart1 && _myChart2 && _myChart3 && _myChart4){
        _myChart.resize();
        _myChart1.resize();
        _myChart2.resize();
        _myChart3.resize();
        _myChart4.resize();
    }
}