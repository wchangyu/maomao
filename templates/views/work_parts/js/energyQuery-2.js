$(function(){
	//能耗种类
	$('.electricity').click(function(){
		$(this).css({
			"background":"url(./work_parts/img/electricity_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.water').css({
			"background":"url(./work_parts/img/water.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.gas').css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
	$('.water').click(function(){
		$(this).css({
			"background":"url(./work_parts/img/water_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.electricity').css({
			"background":"url(./work_parts/img/electricity.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.gas').css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
	$('.gas').click(function(){
		$(this).css({
			"background":"url(./work_parts/img/gas_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.electricity').css({
			"background":"url(./work_parts/img/electricity.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.water').css({
			"background":"url(./work_parts/img/water.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
	$('.datetimepickereType').html(_ajaxStartTime +'-'+_ajaxStartTime);
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
	})
})
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
var _ajaxStartTime_1 = moment().subtract(1,'d').format("YYYY-MM-DD");
var _ajaxEndTime_1 = moment().format("YYYY/MM/DD");
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
	 var dataX=[];
	 var dataY=[];
	 var dataXx=[];

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
						 object.data.push(datas[j].data);
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
						 object.data.push(datas[j].data);
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
						 object.data.push(datas[j].data);
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
						 object.data.push(datas[j].data);
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