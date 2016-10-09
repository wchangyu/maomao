$(function(){
	//读取能耗种类
	_energyTypeSel = new ETSelection();
	_energyTypeSel.initPointers($(".energy-types"),undefined,function(){
		getEcType();
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
	_objectSel.initPointers($("#allPointer"),true);
	_objectSel.initOffices($("#allOffices"));
	//搜索框功能
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
	$('.btns1').click(function(){
		getEcType();
		var o=$('.tree-3')[0].style.display;
		if(o == "none"){
			//_ajaxGetOffices();
			//$('small').html(officeNames);
		}else{
			getPointerDatas();
			//$('small').html(pointerNames);
		}
	})
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
			data:['用电量']
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
				name: '用电量 kWh',
				min: 0,
				max: 250,
				interval: 50,
				axisLabel: {
					formatter: '{value}'
				}
			},
			{
				type: 'value',
				name: '变化趋势',
				min: 0,
				max: 25,
				interval: 5,
				axisLabel: {
					formatter: '{value}'
				}
			}
		],
		series: [
			{
				name:'用电量 kWh',
				type:'bar',
				data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
				itemStyle: {
					normal: {

						color:'#ed7f7e'
					},
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			},

			{
				name:'用电趋势',
				type:'line',
				yAxisIndex: 1,
				data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
			}
		]
	};
	myChart45.setOption(option45);
})
var myChart45;
window.onresize = function () {
	myChart45.resize();
}

//选中的能耗种类
var _ajaxEcType="01";
function getEcType(){
	var aaa =[];
	var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
	//console.log(jsonText.alltypes);
	for(var i=0;i<jsonText.alltypes.length;i++){
		aaa.push(jsonText.alltypes[i].etid)
	}
	_ajaxEcType = aaa[$('.selectedEnergy').index()];
	console.log(_ajaxEcType);
}
//楼宇数据
function getPointerDatas(){
	var pts = _objectSel.getSelectedPointers();
	if(pts.length>0) {
		pointerID = pts[0].pointerID;
		pointerNames = pts[0].pointerName
	};
	if(!pointerID) { return; }

}