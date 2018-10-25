/**
 * Created by admin on 2018/10/23.
 */
$(function(){


    $('.diagram-btn').on('click',function(){

        window.location.href = 'diagnostic-new-result.html';

    });

    window.onresize = function () {

        if(diagramEchart ){
            diagramEchart.resize();


        }
    };
});



//报警信息柱状
var diagramEchart = echarts.init(document.getElementById('diagram-echart'));

// 指定图表的配置项和数据 用于报警信息
var diagramOption = {

    tooltip:{
        trigger:'axis',
        axisPointer:{
            type:'shadow'
        },
        show:false,
        formatter:function (params) {
            var tar = params[1];
            var tars = params[0];
            return tar.name + '<br/>' + tar.seriesName + '  ' + tar.value + '<br/>' + tars.seriesName + '  ' + tars.value;
        }
    },
    toolbox:{
        show:false,
        feature:{
            mark:{show:true},
            dataView:{show:true, readOnly:false},
            restore:{show:true},
            saveAsImage:{show:true}
        }
    },
    grid:{
        left:'1%',
        right:'1%',
        bottom:'1%',
        top:"12%",
        borderColor:'#ccc',
        containLabel:true
    },
    xAxis:{
        show:'true',
        type : 'category',
        axisLabel: {
            color:'#B0BED0' //刻度线标签颜色
        },
        axisLine:{
            show:false
        },
        axisTick:{
            show:false
        },
        data:[1,2,3,4,5,6,7,8,9,10]
    },
    yAxis:{
        type:'value',
        axisLabel: {
            color:'#B0BED0' //刻度线标签颜色
        },
        axisLine:{
            show:false
        },
        axisTick:{
            show:false
        },
        max:30
    },
    series:[
        {
            name:'环境',
            type:'bar',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#31BEA4'
                }
            },
            data:[6,3,4,9,4,5,3,7,9,2],
            barMaxWidth:'100'
        },
        {
            name:'能效',
            type:'bar',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#2A9FD0'
                }
            },
            data:[6,6,6,6,6,3,4,9,4,5,],
            barMaxWidth:'100',
        },
        {
            name:'供配电',
            type:'bar',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#4D7AE1'
                }
            },
            data:[3,2,2,3,5,9,4,5,3,7],
            barMaxWidth:'100'
        },
        {
            name:'空调',
            type:'bar',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal:{
                    color:'#8A52E7'
                }
            },
            data:[4,1,1,3,5,9,4,5,3,7],
            barMaxWidth:'100'
        }
    ]
};

diagramEchart.setOption(diagramOption,true);



