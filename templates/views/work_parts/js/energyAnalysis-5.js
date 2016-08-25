$(function(){

	//对象选择
	 $(".left-middle-tab_aa_7").click(function(){
        $(".left-middle-tab").css({
            "border":"2px solid #7f7f7f",
            "background":"#f1f3fa",
            "color":"#333"
        })
        $(this).css({
            "background":"#7f7f7f",
            "border":"2px solid #7f7f7f",
            "color":"#ffffff"
        })
    })
	//用电分布
	myChart41 = echarts.init(document.getElementById('rheader-content-41'));
		option41 = {
		    title: {
		        text: '深圳月最低生活费组成（单位:元）',
		        subtext: 'From ExcelHome',
		        sublink: 'http://e.weibo.com/1341556070/AjQH99che'
		    },
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
		                	barBorderWidth:2,
		                    barBorderColor: '#cbe6c5',
		                    color: 'rgba(0,0,0,0)'
		                },
		                emphasis: {
		                    barBorderColor: 'rgba(0,0,0,0.5)',
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
		            itemStyle: {
		                normal: {
		                    color: '#cbe6c5'
		                },
		                emphasis: {
		                    barBorderColor: 'rgba(0,0,0,0.5)',
		                    color: 'rgba(0,0,0,0.5)'
		                }
		            },
		            data:[2900, 1200, 300, 200, 900, 300]
		        }
		    ]
		};
	myChart41.setOption(option41);
	//电-饼状图
	myChart42 = echarts.init(document.getElementById('rheader-content-42'));
		option42 = {
		    title : {
		        text: '某站点用户访问来源',
		        subtext: '纯属虚构',
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'left',
		        data: ['直接访问','搜索引擎']
		    },
		    series : [
		        {
		            name: '访问来源',
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
		            data:[
		                {value:1500, name:'直接访问'},
		                {value:1548, name:'搜索引擎'}
		            ],
		            itemStyle: {
		            	normal: {
		                
		                    color: function(params) {
		                        
		                        var colorList = [
		                          '#9dc541','#afc8de'
		                        ];
		                        return colorList[params.dataIndex]
		                    }
		                },
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		};
		myChart42.setOption(option42);
})
var myChart41;
var myChart42;
window.onresize = function () {
    myChart41.resize(); 
    myChart42.resize();
}
