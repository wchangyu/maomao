$(function(){
	//对象选择
	$('.left-middle-tab').eq(0).click(function(){
		$('.left-middle-tab').css(
			{
				'background':'#fff',
				'color':'#333'
			}
		)
		$(this).css({
			'background':'#7f7f7f',
			'color':'#fff'
		})
		$('.tree-1').hide();
		$('.tree-3').show();

	});
	$('.left-middle-tab').eq(1).click(function(){
		$('.left-middle-tab').css(
			{
				'background':'#fff',
				'color':'#333'
			}
		)
		$(this).css({
			'background':'#7f7f7f',
			'color':'#fff'
		})
		$('.tree-1').hide();
		$('.tree-2').show();
	});
	//读取楼宇和科室的zTree；
	_objectSel = new ObjectSelection();
	_objectSel.initPointers($("#allPointer"),false,true);
	_objectSel.initOffices($("#allOffices"),true);
	//搜索框功能
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
	//冷战能效
	myChart49 = echarts.init(document.getElementById('rheader-content-49'));
		option49 = {
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
		        data:['蒸发量','降水量','冷战能效']
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
		            max: 6,
		            interval: 1,
		            axisLabel: {
		                formatter: '{value}'
		            }
		        },
		        {
					show:false,
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
		            name:'冷机效率',
		            type:'line',
		            yAxisIndex: 1,
		            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
		            }
		    ]
		};
		myChart49.setOption(option49);
	$('body').mouseover(function(){
		if(myChart49){
			myChart49.resize();
		}
	})
})
var myChart49;
window.onresize = function () {
	if(myChart49){
		myChart49.resize();
	}
}
