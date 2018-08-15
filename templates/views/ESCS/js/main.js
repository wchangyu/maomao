$(function(){

    /*-------------------------------------整体能效仪表盘--------------------------------------*/

    //整体能效仪表盘

    var _chartG = echarts.init(document.getElementById('chart-gug'));

    var cc = [[0.23, 'lightgreen'], [0.28, 'skyblue'], [0.33, 'orange'], [1, '#ff4500']];

    var _optionG = {

        tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: cc,
                        width: 10
                    }
                },
                name: '实时能效',
                type: 'gauge',
                z: 3,
                min: 0,
                max: 1,
                splitNumber: 10,
                radius: '90%',
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
                title: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'normal'
                    }
                },
                detail: {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder'
                    }
                },
                data: [{ value: 0.5, name: 'KW/KW' }]
            }
        ]

    }

    _chartG.setOption(_optionG,true);

    //数据曲线折线图

    //能源曲线
    var _chartEnergy = echarts.init(document.getElementById('chart-line-energy'));

    //能效曲线
    var _chartEfficiency = echarts.init(document.getElementById('chart-line-efficiency'));

    var optionL = {

        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一','周二','周三','周四','周五','周六','周日'],
            axisLabel:{
                interval:0,
                rotate:45,//倾斜度 -90 至 90 默认为0
                margin:12
            },
        },
        yAxis: [

            {
                name:'能耗',
                type:'value'
            },
            {
                name:'平衡率',
                type:'value'
            }

        ],
        series: [
            {
                name:'邮件营销',
                type:'line',
                stack: '总量',
                data:[120, 132, 101, 134, 90, 230, 210]
            },
            {
                name:'联盟广告',
                type:'line',
                stack: '总量',
                data:[220, 182, 191, 234, 290, 330, 310]
            },
            {
                name:'视频广告',
                type:'line',
                stack: '总量',
                data:[150, 232, 201, 154, 190, 330, 410]
            },
            {
                name:'直接访问',
                type:'line',
                stack: '总量',
                data:[320, 332, 301, 334, 390, 330, 320]
            },
            {
                name:'搜索引擎',
                type:'line',
                stack: '总量',
                data:[820, 932, 901, 934, 1290, 1330, 1320]
            }
        ]
    };

    _chartEnergy.setOption(optionL,true);

    _chartEfficiency.setOption(optionL,true);

    /*-------------------------------------点击事件---------------------------------------------*/

    //数据曲线tab切换
    $('.main-tab').on('click','span',function(){

        $('.main-tab').children().removeClass('main-tab-active');

        $(this).addClass('main-tab-active');

        $('.chart-line').css('z-index','1');

        $('.chart-line').eq($(this).index()).css('z-index','2');

    })

    //chart图自适应
    window.onresize = function () {

        if (_chartG && _chartEnergy && _chartEfficiency) {

            _chartG.resize();

            _chartEnergy.resize();

            _chartEfficiency.resize();
        }
    }


})