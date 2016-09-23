$(function(){
	//能耗种类

	$('.datetimepickereType').html(_ajaxStartTime +'-'+_ajaxStartTime);

	_energyTypeSel = new ETSelection();
	_energyTypeSel.initOffices($(".energy-types"),undefined,function(){
		getEcType();
	});
	//读取科室目录
	_objectSel = new ObjectSelection();
	_objectSel.initOffices($("#energyConsumption"),true);
	//搜索框功能
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"energyConsumption");
	$('#datetimepicker').datepicker(
		{
			language:  'zh-CN',
			todayBtn: 1,
			todayHighlight: 1,
			format: 'yyyy-mm-dd'
		}
	).on('changeDate',function(e){
			var inputValue;
			dataType();
			inputValue = $('#datetimepicker').val();
			if(_ajaxDataType=="日"){
				inputValue = $('#datetimepicker').val();
				var now = moment(inputValue).startOf('day');
				var startDay= now.format("YYYY-MM-DD");
				var endDay= now.add(1,'d').format("YYYY-MM-DD");
				var startsDay = moment(inputValue).startOf('day').subtract(1,'d').format("YYYY-MM-DD");
				var endsDay = moment(inputValue).startOf('day').format("YYYY-MM-DD");
				_ajaxStartTime=startDay;
				_ajaxDataType_1='小时';
				var end=startDay + "-" +startDay;
				var aa = $('.datetimepickereType').text();
				if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
					if(aa.indexOf(end)<0){
						$('.datetimepickereType').html(end);
					}
				}
				_ajaxStartTime_1=startDay.split('-')[0]+'/'+startDay.split('-')[1]+'/'+startDay.split('-')[2];
				_ajaxEndTime_1=endDay.split('-')[0]+'/'+endDay.split('-')[1]+'/'+endDay.split('-')[2];
				_ajaxLastStartTime_1 = startsDay.split('-')[0]+'/'+startsDay.split('-')[1]+'/'+startsDay.split('-')[2];
				_ajaxLastEndTime_1 = endsDay.split('-')[0]+'/'+endsDay.split('-')[1]+'/'+endsDay.split('-')[2];
			}else if(_ajaxDataType=="周"){
				inputValue = $('#datetimepicker').val();
				var now = moment(inputValue).startOf('week');
				var startWeek=now.format("YYYY-MM-DD");
				startWeek = now.add(1,'d').format("YYYY-MM-DD");
				var endWeek = now.add(7,'d').format("YYYY-MM-DD");
				end =startWeek + "-" +endWeek;
				_ajaxDataType_1='日';
				var aa = $('.datetimepickereType').text();
				_ajaxStartTime=startWeek;
				if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
					if(aa.indexOf(end)<0){
						$('.datetimepickereType').html(end);
					}
				}

				_ajaxStartTime_1=startWeek.split('-')[0]+'/'+startWeek.split('-')[1]+'/'+startWeek.split('-')[2];
				_ajaxEndTime_1=endWeek.split('-')[0]+'/'+endWeek.split('-')[1]+'/'+endWeek.split('-')[2];
			}else if(_ajaxDataType=="月"){
				var startMonth=moment(inputValue).startOf('month').format("YYYY-MM-DD");
				var endMonth=moment(inputValue).endOf('month').format("YYYY-MM-DD");
				end =startMonth+"-"+endMonth;
				_ajaxDataType_1='日';

				var aa = $('.datetimepickereType').text();
				_ajaxStartTime=startMonth;
				if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
					if(aa.indexOf(end)<0){
						$('.datetimepickereType').html(end);
					}
				}

				_ajaxStartTime_1=startMonth.split('-')[0]+'/'+startMonth.split('-')[1]+'/'+startMonth.split('-')[2];
				_ajaxEndTime_1=endMonth.split('-')[0]+'/'+endMonth.split('-')[1]+'/'+endMonth.split('-')[2];
			}else if(_ajaxDataType=="年"){
				var startYear=moment(inputValue).startOf('year').format("YYYY-MM-DD");
				var endYear=moment(inputValue).endOf('year').format("YYYY-MM-DD");
				end = startYear+"-"+endYear;
				_ajaxDataType_1='月'
				var aa = $('.datetimepickereType').text();
				_ajaxStartTime=startYear;
				if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
					if(aa.indexOf(end)<0){
						$('.datetimepickereType').html(end);
					}
				}
			}
		})
	//换内容时，清空时间
	$('.types').change(function(){
		$('.datetimepickereType').html('');
	});
	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	})
	getBranchData();
	$('.btns').click(function(){
		getBranchData();
		getEcTypeWord();
		setEnergyInfo();
	})
})


//根据当前选择的能耗类型设置页面信息
function setEnergyInfo(){
	if(_energyTypeSel){
		var selectedEV = $(".selectedEnergy").attr('value');
		for(var i=0;i<_energyTypeSel._allEnergyTypes.length;i++){
			if(_energyTypeSel._allEnergyTypes[i].ettype==selectedEV){
				var curET = _energyTypeSel._allEnergyTypes[i];
				$('.header-one').html(curET.etname);
				$('.right-header span').html('用' + curET.etname + '曲线');
				$('.total-power-consumption').html('累计用' + curET.etname);
				$('.the-cumulative-power-unit').html(curET.etunit);
				$('.header-right-lists').html('单位：' + curET.etunit);
				return;
			}
		}
	}
}
//按日周月年
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
//选择日期对应的时间
var _ajaxDataType_1='小时';
//获得开始时间
var _ajaxStartTime = moment().subtract(1,'d').format("YYYY-MM-DD");
var _ajaxStartTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");
var _ajaxEndTime_1 = moment().format("YYYY/MM/DD");
var _ajaxLastStartTime_1 = moment().subtract(2,'d').format("YYYY/MM/DD");
var _ajaxLastEndTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");
//设置getECType的初始值(文字，office时用);
var _ajaxEcTypeWord="电";
function getEcTypeWord(){
	_ajaxEcTypeWord=$('.selectedEnergy').children().html();
}
//获得科室数据
 function getBranchData(){
	 var ofs = _objectSel.getSelectedOffices(),officeID = [],officeNames = [];
	 for(var i=0;i<ofs.length;i++){
		 officeID.push(ofs[i].f_OfficeID);
		 officeNames.push(ofs[i].f_OfficeName);
	 }
	 if(!officeID){ return; }
	 var allBranch=[];
	 var allBranchs=[];
	 var dataX=[];
	 var dataY=[];
	 var dataXx=[];
	 var lastAdds=0;
	 var lastAdd =0;
	 var growthRate=0;
	 for(var i=0;i<officeID.length;i++){
		 if(officeID.length != 1){
			 $('.rheader-content-right').hide();
		 }else if(officeID.length == 1){
			 $('.rheader-content-right').show();
		 }
		 var selects_ID=officeID[i];
		 var ecParams={
			 'startTime':_ajaxStartTime_1,
			 'endTime':_ajaxEndTime_1,
			 'dateType':_ajaxDataType_1,
			 'officeId':selects_ID,
			 'ecTypeId':_ajaxEcTypeWord
		 }
		 $.ajax({
			 type:'post',
			 url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
			 data:ecParams,
			 async:false,
			 success:function(result){
				 allBranch.push(result)
			 }
		 })
	 }
	 //上一阶段的数据
	 for(var i=0;i<officeID.length;i++){
		 var selects_ID=officeID[i]
		 var ecParams={
			 'startTime':_ajaxLastStartTime_1,
			 'endTime':_ajaxLastEndTime_1,
			 'dateType':_ajaxDataType_1,
			 'officeId':selects_ID,
			 'ecTypeId':_ajaxEcTypeWord
		 }
		 $.ajax({
			 type:'post',
			 url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
			 data:ecParams,
			 async:false,
			 success:function(result){
				 allBranchs.push(result)
			 }
		 })
	 }
	 for(var i=0;i<allBranch.length;i++){
		 var datas = allBranch[i];
		 for(var j=0;j<datas.length;j++){
			 lastAdd += datas[j].data;
		 }
	 }
	 for(var i=0;i<allBranchs.length;i++){
		 var datas = allBranchs[i];
		 for(var j=0;j<datas.length;j++){
			 lastAdds += datas[j].data;
		 }
	 }
	 if(lastAdds !=0){
		 growthRate = (lastAdd - lastAdds) / lastAdds;
	 }else if(lastAdds == 0){
		 $('.rights-up-value').html('-')
	 }
	 $('.total-power-consumption-value label').html(lastAdd.toFixed(2));
	 $('.compared-with-last-time label').html(lastAdds.toFixed(2));
	 $('.rights-up-value').html(growthRate.toFixed(1) + '%');
	 if(growthRate > 0){
		 $('.rights-up').css({
			 'background':'url(./work_parts/img/up2.png)no-repeat',
			 'background-size':'23px'
		 })
	 }else if(growthRate < 0){
		 $('.rights-up').css({
			 'background':'url(./work_parts/img/up.png)no-repeat',
			 'background-size':'23px'
		 })
	 }
	 if(_ajaxDataType=='日'){
		 //x轴数据
		 for(var i=0;i<allBranch.length;i++){
			 var datas=allBranch[i];
			 for(var j=0;j<datas.length;j++){
				 if(dataX.indexOf(datas[j].dataDate.split('T')[1].slice(0,5))<0){
					 dataX.push(datas[j].dataDate.split('T')[1].slice(0,5));
				 }
			 }
		 }
		 dataX.sort();
		 //遍历y轴数据
		 for(var i=0;i<allBranch.length;i++){
			 var object={};
			 object.name=officeNames[i];
			 object.type='line';
			 object.data=[];
			 var datas=allBranch[i];
			 for(var z=0;z<dataX.length;z++){
				 for(var j=0;j<datas.length;j++){
					 if(datas[j].dataDate.split('T')[1].slice(0,5)==dataX[z]){
						 object.data.push(datas[j].data.toFixed(2));
					 }
				 }
			 }
			 dataY.push(object);
		 }
	 }else if(_ajaxDataType=='周'){
		 var dataX=['周一','周二','周三','周四','周五','周六','周日'];
		 //x轴数据
		 for(var i=0;i<allBranch.length;i++){
			 var datas=allBranch[i];
			 for(var j=0;j<datas.length;j++){
				 if(dataXx.indexOf(datas[j].dataDate.split('T')[0])<0){
					 dataXx.push(datas[j].dataDate.split('T')[0]);
				 }
			 }
		 }
		 dataX.sort();

		 //遍历y轴数据
		 for(var i=0;i<allBranch.length;i++){
			 var object={};
			 object.name=officeNames[i];
			 object.type='line';
			 object.data=[];
			 var datas=allBranch[i];
			 for(var z=0;z<dataXx.length;z++){
				 for(var j=0;j<datas.length;j++){
					 if(datas[j].dataDate.split('T')[0]==dataXx[z]){
						 object.data.push(datas[j].data.toFixed(2));
					 }
				 }
			 }
			 dataY.push(object);
		 }
	 }else if(_ajaxDataType=='月'){
		 //x轴数据
		 for(var i=0;i<allBranch.length;i++){
			 var datas=allBranch[i];
			 for(var j=0;j<datas.length;j++){
				 if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					 dataX.push(datas[j].dataDate.split('T')[0]);
				 }
			 }
		 }
		 dataX.sort();

		 //遍历y轴数据
		 for(var i=0;i<allBranch.length;i++){
			 var object={};
			 object.name=officeNames[i];
			 object.type='line';
			 object.data=[];
			 var datas=allBranch[i];
			 for(var z=0;z<dataX.length;z++){
				 for(var j=0;j<datas.length;j++){
					 if(datas[j].dataDate.split('T')[0]==dataX[z]){
						 object.data.push(datas[j].data.toFixed(2));
					 }
				 }
			 }
			 dataY.push(object);
		 }
	 }else if(_ajaxDataType=='年'){
		 //x轴数据
		 for(var i=0;i<allBranch.length;i++){
			 var datas=allBranch[i];
			 for(var j=0;j<datas.length;j++){
				 if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					 dataX.push(datas[j].dataDate.split('T')[0]);
				 }
			 }
		 }
		 dataX.sort();

		 //遍历y轴数据
		 for(var i=0;i<allBranch.length;i++){
			 var object={};
			 object.name=officeNames[i];
			 object.type='line';
			 object.data=[];
			 var datas=allBranch[i];
			 for(var z=0;z<dataX.length;z++){
				 for(var j=0;j<datas.length;j++){
					 if(datas[j].dataDate.split('T')[0]==dataX[z]){
						 object.data.push(datas[j].data.toFixed(2));
					 }
				 }
			 }
			 dataY.push(object);
		 }
	 }
	 //用电量折线图
	 myChart3 = echarts.init(document.getElementById('rheader-content'));
	 // 指定图表的配置项和数据
	 option3 = {
		 tooltip: {
			 trigger: 'axis'
		 },
		 legend: {
			 data:officeNames
		 },
		 toolbox: {
			 show: true,
			 feature: {
				 dataZoom: {
					 yAxisIndex: 'none'
				 },
				 dataView: {readOnly: false},
				 magicType: {type: ['line', 'bar']},
				 restore: {},
				 saveAsImage: {}
			 }
		 },
		 xAxis:  {
			 type: 'category',
			 boundaryGap: false,
			 data: dataX
		 },
		 yAxis: {
			 type: 'value',
			 axisLabel: {
				 formatter: '{value}'
			 }
		 },
		 series: dataY
	 };
	 // 使用刚指定的配置项和数据显示图表。
	 myChart3.setOption(option3);
 }