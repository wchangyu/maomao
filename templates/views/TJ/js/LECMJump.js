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

    //右上角维修
    var WXCol = [

        {
            title:'时间',
            data:'SJ'
        },
        {
            title:'故障现象',
            data:'GZXX'
        },
        {
            title:'维修内容',
            data:'WXNR'
        },
        {
            title:'故障部件',
            data:'GZBJ'
        },
        {
            title:'关键词',
            data:'GJC'
        },
        {
            title:'维修人'
        }

    ]

    _tableInit($('#WX-table'),WXCol,'2','','','','','','',true);

    var WXData = [

        {
            "SJ":"2018/8/1",
            "GZXX":"主机不加载",
            "WXNR":"提高水温，提高油压",
            "GZBJ":"滑阀",
            "GJC":"压力低",
            "WXR":"杜斐"
        },
        {
            "SJ":"2018/8/2",
            "GZXX":"主机停机",
            "WXNR":"液电磁阀更换",
            "GZBJ":"电磁阀",
            "GJC":"损坏",
            "WXR":"杜斐"
        },
        {
            "SJ":"2018/8/3",
            "GZXX":"主机冷凝压力高",
            "WXNR":"冷凝风扇启动器更换",
            "GZBJ":"冷凝风扇",
            "GJC":"启动器坏",
            "WXR":"杜敏刚"
        },
        {
            "SJ":"2018/8/4",
            "GZXX":"主机不加载",
            "WXNR":"清洗冷凝器",
            "GZBJ":"冷凝器",
            "GJC":"脏堵",
            "WXR":"杜敏刚"
        }
    ]

    _datasTable($('#WX-table'),WXData);

    //右上角性能衰退
    var STCol = [

        {
            title:'序号',
            data:'XH'
        },
        {
            title:'参数',
            data:'CS'
        },
        {
            title:'额定指标',
            data:'EDZB'
        },
        {
            title:'实际指标',
            data:'SJZB'
        },
        {
            title:'偏离度',
            data:'PLD'
        },
        {
            title:'实测时间',
            data:'SCSJ'
        }

    ]

    _tableInit($('#ST-table'),STCol,'2','','','','','','',true);

    var STData = [

        {
            "XH":"1",
            "CS":"制冷量RT",
            "EDZB":"1100",
            "SJZB":"950",
            "PLD":"14%",
            "SCSJ":"2018/9/30"
        },
        {
            "XH":"2",
            "CS":"COP",
            "EDZB":"6.3",
            "SJZB":"4.8",
            "PLD":"24%",
            "SCSJ":"2018/10/1"
        },
        {
            "XH":"3",
            "CS":"出水温度℃",
            "EDZB":"7",
            "SJZB":"8.5",
            "PLD":"-21%",
            "SCSJ":"2018/10/2"
        },
        {
            "XH":"4",
            "CS":"冷冻水流量m³/h",
            "EDZB":"880",
            "SJZB":"670",
            "PLD":"24%",
            "SCSJ":"2018/10/3"
        }
    ]

    _datasTable($('#ST-table'),STData);

    //LCC
    var LCC = echarts.init(document.getElementById('LCC'));

    var LCCoption = {
        title:{

            text:'单位万元',
            left:'center'
        },
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
            data:['月均采购成本','能效惩罚','维修成本','能耗成本'],
            top:'bottom'
        },
        xAxis: [
            {
                type: 'category',
                data: ['18-01','18-02','18-03','18-04','18-05','18-06','18-07','18-08'],
                axisPointer: {
                    type: 'shadow'
                },
                axisLabel: {
                    formatter: '{value}.00'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '万元',
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        color:['#8b52e7','#4c7ae1','#2a9fd1','#30bfa5'],
        series: [
            {
                name:'月均采购成本',
                type:'bar',
                data:[1, 1,0.5, 0.6, 2, 2, 4,6],
                barWidth:20
            },
            {
                name:'能效惩罚',
                type:'bar',
                data:[1, 1, 2, 2, 3, 3, 4,5.3],
                barWidth:20
            },
            {
                name:'维修成本',
                type:'bar',
                data:[0.5, 0.5,0.1, 0.3, 4, 1, 2.2,1.8],
                barWidth:20
            },
            {
                name:'能耗成本',
                type:'bar',
                data:[18, 18, 19, 19.5, 20.8, 22.3, 25.2,26],
                barWidth:20
            }
        ]

    };

    LCC.setOption(LCCoption,true);

    //左下角基础资料
    var JCZLCol = [

        {
            title:'序号',
            data:'XH'
        },
        {
            title:'文件名称',
            data:'WJMC'
        },
        {
            title:'类型',
            data:'LX'
        },
        {
            title:'上传人',
            data:'SCR'
        },
        {
            title:'审核时间',
            data:'SHSJ'
        }

    ]

    _tableInit($('#JCZL-table'),JCZLCol,'2','','','','','','',true);

    var JCZLData = [

        {
            "XH":"1",
            "WJMC":"YSLX-2000冷水机组说明书",
            "LX":"说明书",
            "SCR":"裴勇",
            "SHSJ":"2018/8/1"
        },
        {
            "XH":"2",
            "WJMC":"离心式冷水机组维保手册",
            "LX":"说明书",
            "SCR":"裴勇",
            "SHSJ":"2018/8/2"
        },
        {
            "XH":"3",
            "WJMC":"离心式冷水机组常见故障",
            "LX":"知识库",
            "SCR":"裴勇",
            "SHSJ":"2018/8/3"
        },
        {
            "XH":"4",
            "WJMC":"机房制冷系统图",
            "LX":"图纸",
            "SCR":"张明",
            "SHSJ":"2018/8/4"
        }

    ]

    _datasTable($('#JCZL-table'),JCZLData);

    //左下角计划
    var planCol = [

        {
            title:'序号',
            data:'XH'
        },
        {
            title:'类型',
            data:'LX'
        },
        {
            title:'检查项',
            data:'JCX'
        },
        {
            title:'附件',
            data:'FJ'
        },
        {
            title:'操作',
            data:'',
            render:function(data, type, full, meta){

                return '<span class="option-button option-edit option-in">' + '修改</span>' +

                    '<span class="option-button option-del option-in">' + '删除</span>'

            }

        }

    ]

    _tableInit($('#plan-table'),planCol,'2','','','','','','',true);

    var planData = [

        {
            "XH":"1",
            "LX":"年度维保",
            "JCX":"蒸发器",
            "FJ":""
        },
        {
            "XH":"2",
            "LX":"年度维保",
            "JCX":"冷凝器",
            "FJ":""
        },
        {
            "XH":"3",
            "LX":"年度维保",
            "JCX":"压缩机",
            "FJ":""
        },
        {
            "XH":"4",
            "LX":"年度维保",
            "JCX":"电控柜",
            "FJ":""
        },
        {
            "XH":"5",
            "LX":"月度维保",
            "JCX":"电控柜",
            "FJ":""
        },
        {
            "XH":"6",
            "LX":"月度维保",
            "JCX":"油压差",
            "FJ":""
        }

    ]

    _datasTable($('#plan-table'),planData);

    //左下角点检计划
    var selectCol = [

        {
            title:'序号',
            data:'XH'
        },
        {
            title:'内容',
            data:'NR'
        },
        {
            title:'限制',
            data:'XZ'
        },
        {
            title:'关系',
            data:'GX'
        },
        {
            title:'操作',
            data:'',
            render:function(data, type, full, meta){

                return '<span class="option-button option-edit option-in">' + '修改</span>' +

                    '<span class="option-button option-del option-in">' + '删除</span>'

            }

        }

    ]

    _tableInit($('#select-table'),selectCol,'2','','','','','','',true);

    var selectData = [

        {
            "XH":"1",
            "NR":"蒸发器水阻力",
            "XZ":"0.1MPa",
            "GX":"小于"
        },
        {
            "XH":"2",
            "NR":"冷凝器水阻力",
            "XZ":"0.1MPa",
            "GX":"小于"
        },
        {
            "XH":"3",
            "NR":"蒸发器小温差",
            "XZ":"3℃",
            "GX":"小于"
        },
        {
            "XH":"4",
            "NR":"冷凝器小温差",
            "XZ":"4℃",
            "GX":"小于"
        },
        {
            "XH":"5",
            "NR":"电控柜",
            "XZ":"无积灰",
            "GX":""
        },
        {
            "XH":"6",
            "NR":"油压差",
            "XZ":"0.25MPa",
            "GX":"大于"
        }
    ]

    _datasTable($('#select-table'),selectData);

    //右下角诊断
    var ZDCol = [

        {
            title:'序号',
            data:'XH'
        },
        {
            title:'原因',
            data:'YY'
        },
        {
            title:'建议',
            data:'JY',
            render:function(data, type, full, meta){

                var str = '';

                if(typeof data == 'object'){

                    for(var i=0;i<data.length;i++){

                        str += '<div style="line-height: 25px;">' + (Number(i) + 1) + '、' + data[i][i+1] + '</div>'

                    }

                }else{

                    str += data;

                }

                return str

            }

        },
        {
            title:'编辑人',
            data:'BJR'
        },
        {
            title:'时间',
            data:'SJ'
        },
        {
            title:'是否执行',
            data:'ZX'
        }

    ]

    _tableInit($('#ZD-table'),ZDCol,'2','','','','','','',true);

    var ZDData = [

        {
            "XH":"1",
            "YY":"冷机夏季制冷量不足",
            "JY":[{1:'化学清洗冷凝器'},{2:'更换冷却塔填料'},{3:'冷却泵频率提高'},{4:'冷冻泵频率提高'}],
            "BJR":"裴勇",
            "SJ":"2018/9/28",
            "ZX":"已执行"
        },
        {
            "XH":"2",
            "YY":"冷机夏季制冷量不足",
            "JY":'液电磁阀有泄露，冬季时应停机更换',
            "BJR":"杜斐",
            "SJ":"2018/9/29",
            "ZX":"未处理"
        }

    ]

    _datasTable($('#ZD-table'),ZDData);

    //右下角故障诊断配置
    var GZCol = [

        {
            title:'序号',
            data:'XH'
        },
        {
            title:'报警名称',
            data:'BBMC'
        },
        {
            title:'操作',
            data:'',
            render:function(data, type, full, meta){

                return '<span class="option-button option-edit option-in">' + '处理</span>'

            }
        }

    ]

    _tableInit($('#GZ-table'),GZCol,'2','','','','','','',true);

    var GZData = [

        {
            "XH":"1",
            "BBMC":"冷凝压力过高"
        },
        {
            "XH":"2",
            "BBMC":"电流过流保护"
        }

    ]

    _datasTable($('#GZ-table'),GZData);

    //右下角报告
    var BGCol = [

        {
            title:'序号',
            data:'XH'
        },
        {
            title:'类型',
            data:'LX'
        },
        {
            title:'生成时间',
            data:'SCSJ'
        },
        {
            title:'审核人',
            data:'SHR'
        },
        {
            title:'下载',
            data:'XZ'
        }

    ]

    _tableInit($('#BG-table'),BGCol,'2','','','','','','',true);

    var BGData = [

        {
            "XH":"1",
            "LX":"年度报告",
            "SCSJ":"2018/1/25",
            "SHR":"裴勇",
            "XZ":""
        },
        {
            "XH":"2",
            "LX":"季度报告",
            "SCSJ":"2018/7/26",
            "SHR":"杜斐",
            "XZ":""
        },

    ]

    _datasTable($('#BG-table'),BGData);

    //tab
    $('.tab-block').on('click','span',function(){

        $(this).parent().children().removeClass('span-hover');

        $(this).addClass('span-hover');

        var block = $(this).parents('.portlet-title').next().children();

        block.hide();

        block.eq($(this).index()).show();

    })

})