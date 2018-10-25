$(function(){

    //表格初始化
    var col = [

        {
            title:'机房',
            data:'jifang'
        },
        {
            title:'通道',
            data:'tongdao'
        },
        {
            title:'PDU',
            data:'PDU'
        },
        {
            title:'PDU容量（KW）',
            data:'PDU2'
        },
        {
            title:'机柜',
            data:'jigui'
        },
        {
            title:'机柜空间（U）',
            data:'JGKJ'
        },
        {
            title:'服务器数量',
            data:'FWQSL'
        },
        {
            title:'服务器功率（KW）',
            data:'FWQGL'
        },
        {
            title:'服务器安装空间（U）',
            data:'FWQKJ'
        }
    ]

    _tableInit($('#table'),col,'2','','','','','');

    var obj = [

        {
            "jifang":"机房1",
            "tongdao":"D1",
            "PDU":"P1",
            "PDU2":"300",
            "jigui":"T1",
            "JGKJ":"42",
            "FWQSL":"8",
            "FWQGL":"16",
            "FWQKJ":"32"
        },
        {
            "jifang":"机房1",
            "tongdao":"D1",
            "PDU":"P1",
            "PDU2":"300",
            "jigui":"T2",
            "JGKJ":"42",
            "FWQSL":"6",
            "FWQGL":"18",
            "FWQKJ":"28"
        },
        {
            "jifang":"机房1",
            "tongdao":"D2",
            "PDU":"P2",
            "PDU2":"300",
            "jigui":"T1",
            "JGKJ":"32",
            "FWQSL":"6",
            "FWQGL":"15",
            "FWQKJ":"24"
        },
        {
            "jifang":"机房2",
            "tongdao":"D3",
            "PDU":"P3",
            "PDU2":"300",
            "jigui":"T4",
            "JGKJ":"32",
            "FWQSL":"7",
            "FWQGL":"13",
            "FWQKJ":"28"
        }
    ]

    _datasTable($('#table'),obj);

    //echarts-----------------------------------------------------------------------------

    var left = echarts.init(document.getElementById('left'));

    var leftOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data:['空间剩余容量（U）','电力剩余容量（KW）'],
            top:'bottom'
        },
        xAxis: [
            {
                type: 'category',
                data: ['机房1','机房2','机房3','机房4','机房5','机房6','机房7'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '容量',
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        color:['#8b52e7','#4c7ae1'],
        series: [
            {
                name:'空间剩余容量（U）',
                type:'bar',
                data:[110, 125,99, 57, 200, 347, 122.2],
                barWidth:20
            },
            {
                name:'电力剩余容量（KW）',
                type:'bar',
                data:[222, 246, 60, 98, 233, 455, 182.2],
                barWidth:20
            }
        ]
    };

    left.setOption(leftOption);

    var right = echarts.init(document.getElementById('right'));

    var rightOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data:['空间容量占用百分比'],
            top:'bottom'
        },
        xAxis: [
            {
                type: 'category',
                data: ['机房1','机房2','机房3','机房4','机房5','机房6','机房7'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '容量',
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        color:['#2a9fd1'],
        series: [
            {
                name:'空间容量占用百分比',
                type:'bar',
                data:[52, 41.7,59.9, 80, 37, 30.2, 43.5],
                barWidth:20
            }
        ]
    };

    right.setOption(rightOption);

})