$(function(){
    getHeight();
	//水电选择
	$(".electricity_aa_4").click(function(){
        $(this).css({
            "background":"url(./work_parts/img/electricity_hover.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
        $(".water_aa_4").css({
            "background":"url(./work_parts/img/water.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
    })
    $(".water_aa_4").click(function(){
        $(this).css({
            "background":"url(./work_parts/img/water_hover.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
        $(".electricity_aa_4").css({
             "background":"url(./work_parts/img/electricity.png)no-repeat",
            "background-size":"50px",
            "background-position":"top center"
        })
    })
    //用电变化
   	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
		option11 = {
		    title: {
		        text: '未来一周气温变化',
		        subtext: '纯属虚构'
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['最高气温','最低气温']
		    },
		    xAxis:  {
		        type: 'category',
		        boundaryGap: false,
		        data: ['周一','周二','周三','周四','周五','周六','周日']
		    },
		    yAxis: {
		        type: 'value',
		        axisLabel: {
		            formatter: '{value} °C'
		        }
		    },
		    series: [
		        {
		            name:'最高气温',
		            type:'line',
		            data:[11, 11, 15, 13, 12, 13, 10],
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'最低气温',
		            type:'line',
		            data:[1, -2, 2, 5, 3, 2, 0],
		            markPoint: {
		                data: [
		                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均值'},
		                    [{
		                        symbol: 'arrow',
		                        label: {
		                            normal: {
		                                formatter: '最大值'
		                            }
		                        },
		                        type: 'max',
		                        name: '最大值'
		                    }, {
		                        symbol: 'circle',
		                        x: '60%',
		                        y: '50%'
		                    }]
		                ]
		            }
		        }
		    ]
		};
		 myChart11.setOption(option11);
})
var myChart11;
window.onresize = function () {
    myChart11.resize();
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