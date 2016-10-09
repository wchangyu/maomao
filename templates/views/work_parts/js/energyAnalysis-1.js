$(function(){
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
	});
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
    //电-用电曲线
    myChart7 = echarts.init(document.getElementById('rheader-content-30'));
		option7 = {
		    tooltip : {
		        trigger: 'axis'
		    },
		    /*legend: {
		        data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
		    },*/
		    toolbox: {
		        feature: {
		            saveAsImage: {}
		        }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            boundaryGap : false,
		            data : ['周一','周二','周三','周四','周五','周六','周日']
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name:'邮件营销',
		            type:'line',
		            stack: '总量',
		            areaStyle: {normal: {}},
		            data:[120, 132, 101, 134, 90, 230, 210]
		        },

		        {
		            name:'联盟广告',
		            type:'line',
		            stack: '总量',
		            areaStyle: {normal: {}},
		            data:[220, 182, 191, 234, 290, 330, 310]
		        },
		        {
		            name:'视频广告',
		            type:'line',
		            stack: '总量',
		            areaStyle: {normal: {}},
		            data:[150, 232, 201, 154, 190, 330, 410]
		        },
		        {
		            name:'直接访问',
		            type:'line',
		            stack: '总量',
		            areaStyle: {normal: {}},
		            data:[320, 332, 301, 334, 390, 330, 320]
		        },
		        {
		            name:'搜索引擎',
		            type:'line',
		            stack: '总量',
		            label: {
		                normal: {
		                    show: true,
		                    position: 'top'
		                }
		            },
		            areaStyle: {normal: {}},
		            data:[820, 932, 901, 934, 1290, 1330, 1320]
		        }
		    ]
		};
 		myChart7.setOption(option7);
 	//电-分项构成
 	myChart8 = echarts.init(document.getElementById('rheader-content-31'));
		option8 = {
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    calculable : true,
		    series : [
		        {
		            name:'面积模式',
		            type:'pie',
		            radius : [20, 60],
		            center : ['50%', '60%'],
		            roseType : 'area',
		            data:[
		                {value:10, name:'rose1'},
		                {value:5, name:'rose2'},
		                {value:15, name:'rose3'},
		                {value:25, name:'rose4'},
		                {value:20, name:'rose5'},
		                {value:35, name:'rose6'},
		                {value:30, name:'rose7'},
		                {value:40, name:'rose8'}
		            ]
		        }
		    ]
		};
		myChart8.setOption(option8);
})
var myChart7;
var myChart8;
window.onresize = function () {
    myChart7.resize(); 
    myChart8.resize();
}