$(function(){
    getHeight();
	//水电选择
	$(".electricity_aa_5").click(function(){
        $(this).css({
            "background":"url(./work_parts/img/electricity_hover.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
        $(".water_aa_5").css({
            "background":"url(./work_parts/img/water.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
    })
    $(".water_aa_5").click(function(){
        $(this).css({
            "background":"url(./work_parts/img/water_hover.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
        $(".electricity_aa_5").css({
             "background":"url(./work_parts/img/electricity.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
    })
    //对象选择
     $(".left-middle-tab_aa_5").click(function(){
        //alert($(this).index())
        //alert($(".left-middle-list").width())
        $(".left-middle-tab_aa_5").css({
            "border":"2px solid #7f7f7f",
            "background":"#f1f3fa",
            "color":"#333"
        })
        $(this).css({
            "background":"#7f7f7f",
            "border":"2px solid #7f7f7f",
            "color":"#ffffff"
        })
        $(".tree-5").css({
            display:"none"
        }),
        $(".tree-5")[$(this).index()-1].style.display="block"
    })
     //电-同比分析-柱折图
    myChart13 = echarts.init(document.getElementById('rheader-content-16'));
		option13 = {
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
		    legend: {
		        data:['蒸发量','降水量','平均温度']
		    },
		    xAxis: [
		        {
		            type: 'category',
		            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '水量',
		            min: 0,
		            max: 250,
		            interval: 50,
		            axisLabel: {
		                formatter: '{value} ml'
		            }
		        },
		        {
		            type: 'value',
		            name: '温度',
		            min: 0,
		            max: 25,
		            interval: 5,
		            axisLabel: {
		                formatter: '{value} °C'
		            }
		        }
		    ],
		    series: [
		        {
		            name:'蒸发量',
		            type:'bar',
		            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
		        },
		        {
		            name:'降水量',
		            type:'bar',
		            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
		        },
		        {
		            name:'平均温度',
		            type:'line',
		            yAxisIndex: 1,
		            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
		        }
		    ]
		};
		 myChart13.setOption(option13);
	//电-同比分析-柱状图
	myChart14 = echarts.init(document.getElementById('rheader-content-17'));
		option14 = {
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        },
		        formatter: function (params) {
		            var tar = params[1];
		            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
		        }
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
		        data : ['总费用','房租','水电费','交通费','伙食费','日用品数']
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
		            data: [0, 1700, 1400, 1200, 300, 0]
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
		            data:[2900, 1200, 300, 200, 900, 300]
		        }
		    ]
		};
		myChart14.setOption(option14);
	//电-环比分析-柱折图
	myChart15 = echarts.init(document.getElementById('rheader-content-18'));
		option15 = {
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
		    legend: {
		        data:['蒸发量','降水量','平均温度']
		    },
		    xAxis: [
		        {
		            type: 'category',
		            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '水量',
		            min: 0,
		            max: 250,
		            interval: 50,
		            axisLabel: {
		                formatter: '{value} ml'
		            }
		        },
		        {
		            type: 'value',
		            name: '温度',
		            min: 0,
		            max: 25,
		            interval: 5,
		            axisLabel: {
		                formatter: '{value} °C'
		            }
		        }
		    ],
		    series: [
		        {
		            name:'蒸发量',
		            type:'bar',
		            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
		        },
		        {
		            name:'降水量',
		            type:'bar',
		            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
		        },
		        {
		            name:'平均温度',
		            type:'line',
		            yAxisIndex: 1,
		            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
		        }
		    ]
		};
		 myChart15.setOption(option15);
	//电-环比分析-柱状图
	myChart16 = echarts.init(document.getElementById('rheader-content-19'));
		option16 = {
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        },
		        formatter: function (params) {
		            var tar = params[1];
		            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
		        }
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
		        data : ['总费用','房租','水电费','交通费','伙食费','日用品数']
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
		            data: [0, 1700, 1400, 1200, 300, 0]
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
		            data:[2900, 1200, 300, 200, 900, 300]
		        }
		    ]
		};
		myChart16.setOption(option16);
})
getHeight();
var myChart13;
var myChart14;
var myChart15;
var myChart16;
window.onresize = function () {
    myChart13.resize(); 
    myChart14.resize();
    myChart15.resize();
    myChart16.resize();
    getHeight();
}
function getHeight(){
    //获取浏览器的高度；
    var h = window.innerHeight ||document.documentElement.clientHeight || document.body.clientHeight;
    // console.log(h);
    var heights = h * 0.70;
    $('.total-warp').css({
        height:heights
    })
}