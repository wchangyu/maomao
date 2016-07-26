$(function(){
    getHeight();
	//电-12/52选项卡
	$(".top-header-lists").click(function(){
		$(".top-header-lists").css({
			"border":"1px solid #808080",
			"color":"#333",
			"background":"#fff"
		}),
		$(this).css({
			"background":"#808080",
			"color":"#fff"
		})
	})
	//逐12个月用电趋势
	myChart45 = echarts.init(document.getElementById('rheader-content-45'));
		option45 = {
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
		            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
		            itemStyle: {
		            	normal: {
		                
		                    color: function(params) {
		                        
		                        var colorList = [
		                          '#ed7f7e','#ed7f7e','#ed7f7e','#ed7f7e','#ed7f7e','#ed7f7e','#ed7f7e','#ed7f7e','#ed7f7e','#ed7f7e','#ed7f7e','#ed7f7e','#ed7f7e'
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
		        },

		        {
		            name:'平均温度',
		            type:'line',
		            yAxisIndex: 1,
		            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
		        }
		    ]
		};
		myChart45.setOption(option45);
})
getHeight();
var myChart45;
window.onresize = function () {
    myChart45.resize();
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