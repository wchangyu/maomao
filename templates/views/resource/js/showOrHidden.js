$(function(){
    //点击箭头移动
    $('.showOrHidden').click(function(){
        var o1 = $(".content-main-left").css("display");
        if(o1 == 'block'){
            $('.content-main-left').hide()
            $('.content-main-right').removeClass('col-lg-9 col-md-8').addClass('col-lg-12 col-md-12');
            $('.showOrHidden').css({
                'background':'url("./work_parts/img/show.png")no-repeat',
                'background-size':'20px',
                'background-position':'center'
            })
        }else if(o1 == 'none'){
            $('.content-main-left').show();
            $('.content-main-right').removeClass('col-lg-12 col-md-12').addClass('col-lg-9 col-md-8');
            $('.showOrHidden').css({
                'background':'url("./work_parts/img/hidden.png")no-repeat',
                'background-size':'20px',
                'background-position':'center'
            })
        }
    });

    //更改时间维度日、周、月、年
    $('.types').change(function(){
        var bbaa = $('.types').find('option:selected').val();
        if(bbaa == '月'){
            _monthDate();
        }else if(bbaa == '年'){
            _yearDate();
        }else{
            _initDate();
        }
        $('.datetimepickereType').empty();
        $('.datetimeStart').html('');
        $('.datetimeEnd').html('');
    })


    addSearchBox();


})
//日历时间
function _selectTime(){
    var inputValue;
    inputValue = $('#datetimepicker').val();
    if(_ajaxDataType=="日"){
        inputValue = $('#datetimepicker').val();
        var now = moment(inputValue).startOf('day');
        //当前开始结束时间
        var startDay = now.format("YYYY-MM-DD");
        var endDay = now.add(1,'d').format("YYYY-MM-DD");
        //上一阶段开始结束时间
        var startsDay = now.subtract(2,'d').format("YYYY-MM-DD");
        var endsDay = now.add(1,'d').format("YYYY-MM-DD");
        _ajaxStartTime=startDay;
        _ajaxDataType_1='小时';
        var end=startDay + "到" +startDay;
        var aa = $('.datetimepickereType').text();
        if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
            if(aa.indexOf(end)<0){
                $('.datetimepickereType').html(end);
                $('.datetimeStart').html(startDay);
                $('.datetimeEnd').html(startDay);
            }
        }
        //当前开始、结束时间
        var startSplit = startDay.split('-');
        var endSplit = endDay.split('-');
        _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
        _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
        //上一阶段的开始、结束时间
        var startsSplit = startsDay.split('-');
        var endsSplit = endsDay.split('-');
        _ajaxLastStartTime_1 = startsSplit[0] + '/' + startsSplit[1] + '/' + startsSplit[2];
        _ajaxLastEndTime_1 = endsSplit[0] + '/' + endsSplit[1] + '/' + endsSplit[2];
    }else if(_ajaxDataType=="周"){
        inputValue = $('#datetimepicker').val();
        var now = moment(inputValue).startOf('week');
        //页面显示时间
        var nowStart = now.add(1,'d').format("YYYY-MM-DD");
        var nowEnd = now.add(6,'d').format("YYYY-MM-DD");
        //当前开始结束时间
        var startWeek = now.subtract(6,'d').format("YYYY-MM-DD");
        var endWeek = now.add(7,'d').format("YYYY-MM-DD");
        end =nowStart + "到" +nowEnd;
        _ajaxDataType_1='日';
        var startsWeek = now.subtract(14,'d').format("YYYY-MM-DD");
        var endsWeek = now.add(7,'d').format("YYYY-MM-DD");
        var aa = $('.datetimepickereType').text();
        _ajaxStartTime=startWeek;
        if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
            if(aa.indexOf(end)<0){
                $('.datetimepickereType').html(end);
                $('.datetimeStart').html(nowStart);
                $('.datetimeEnd').html(nowEnd);
            }
        }
        //当前开始结束时间
        var startSplit = startWeek.split('-');
        var endSplit = endWeek.split('-');
        _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
        _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
        //上一时段开始结束时间
        var startSplits = startsWeek.split('-');
        var endSplits = endsWeek.split('-');
        _ajaxLastStartTime_1 = startSplits[0] + '/' + startSplits[1] + '/' + startSplits[2];
        _ajaxLastEndTime_1 = endSplits[0] + '/' + endSplits[1] + '/' + endSplits[2];
    }else if(_ajaxDataType=="月"){
        var now = moment(inputValue).startOf('month');
        var nows = moment(inputValue).endOf('month');
        //页面显示时间
        var nowStart = now.format("YYYY-MM-DD");
        var nowEnd = nows.format("YYYY-MM-DD");
        //当前开始结束时间
        var startMonth=now.format("YYYY-MM-DD");
        var endMonth=nows.add(1,'d').format("YYYY-MM-DD");
        end = nowStart + "到" + nowEnd;
        //上一时段的开始结束时间
        var startsMonth = now.subtract(1,'month').format("YYYY-MM-DD");
        var endsMonth = nows.subtract(1,'month').format("YYYY-MM-DD");
        _ajaxDataType_1='日';
        var aa = $('.datetimepickereType').text();
        _ajaxStartTime=startMonth;
        if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
            if(aa.indexOf(end)<0){
                $('.datetimepickereType').html(end);
                $('.datetimeStart').html(nowStart);
                $('.datetimeEnd').html(nowEnd);
            }
        }
        var startSplit = startMonth.split('-');
        var endSplit = endMonth.split('-');
        _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
        _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
        var startSplits = startsMonth.split('-');
        var endSplits = endsMonth.split('-');
        _ajaxLastStartTime_1 = startSplits[0] + '/' + startSplits[1] + '/' + startSplits[2];
        _ajaxLastEndTime_1 = endSplits[0] + '/' + endSplits[1] + '/' + endSplits[2];
    }else if(_ajaxDataType=="年"){
        //页面显示时间
        var now = moment(inputValue).startOf('year');
        var nows = moment(inputValue).endOf('year');
        var nowStart = now.format("YYYY-MM-DD");
        var nowEnd = nows.format("YYYY-MM-DD");
        var startYear=now.format("YYYY-MM-DD");
        var endYear=nows.add(1,'d').format("YYYY-MM-DD");
        end = nowStart+"到"+nowEnd;
        var startsYear = now.subtract(1,'year').format("YYYY-MM-DD");
        var endsYear = nows.subtract(1,'year').format("YYYY-MM-DD");
        _ajaxDataType_1='月';
        var aa = $('.datetimepickereType').text();
        _ajaxStartTime=startYear;
        if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
            if(aa.indexOf(end)<0){
                $('.datetimepickereType').html(end);
                $('.datetimeStart').html(nowStart);
                $('.datetimeEnd').html(nowEnd);
            }
        }
        var startSplit = startYear.split('-');
        var endSplit = endYear.split('-');
        _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
        _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
        var startSplits = startsYear.split('-');
        var endSplits = endsYear.split('-');
        _ajaxLastStartTime_1 = startSplits[0] + '/' + startSplits[1] + '/' + startSplits[2];
        _ajaxLastEndTime_1 = endSplits[0] + '/' + endSplits[1] + '/' + endSplits[2];
    }
}
//月的时间初始化
function _monthDate(){
    $('#datetimepicker').datepicker('destroy');
    $('#datetimepicker').datepicker({
        startView: 1,
        maxViewMode: 2,
        minViewMode:1,
        format: "yyyy-mm-dd",//选择日期后，文本框显示的日期格式
        language: "zh-CN" //汉化
    })
}
//年的时间初始化
function _yearDate(){
    $('#datetimepicker').datepicker('destroy');
    $('#datetimepicker').datepicker({
        startView: 2,
        maxViewMode: 2,
        minViewMode:2,
        format: "yyyy-mm-dd",//选择日期后，文本框显示的日期格式
        language: "zh-CN" //汉化
    })
}
//一般时间初始化
function _initDate(){
    $('#datetimepicker').datepicker('destroy');
    $('#datetimepicker').datepicker(
        {
            language:  'zh-CN',
            todayBtn: 1,
            todayHighlight: 1,
            format: 'yyyy-mm-dd'
        }
    )
}
//根据当前选择的能耗类型设置页面信息
function _setEnergyInfo(){
    if(_energyTypeSel){
        var selectedEV = $(".selectedEnergy").attr('value');
        if(_energyTypeSel._allEnergyTypes){
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
}




//搜索楼宇时
$(document).on('keyup','.input-search-value',function(){

    for(var i=0; i<$('#selectPointer option').length; i++){

        $('#selectPointer option').eq(i).css({
            display:'inline-block'
        });

    }
    //获取要搜索的内容
    var that = $('.input-search-value');

    var searchValue = that.val();

    for(var i=0; i<$('#selectPointer option').length; i++){


        var theValue = $('#selectPointer option').eq(i).text();

        //判断是否展示
        if(theValue.indexOf(searchValue) == -1){

            console.log(444);

            $('#selectPointer option').eq(i).css({
                display:'none'
            });
        }
    }

});

function addSearchBox(){

    //判断是否存在楼宇select列表
    if($('#selectPointer')){

        var html = '<input type="text" placeholder="请输入楼宇名称搜索" class="input-search-value form-control" style="height:30px !important; width:180px;margin:0 auto; margin-bottom:5px;">';

        //给楼宇列表上方增加搜索框
        $('#selectPointer').before(html);

        $('#selectPointer').css({
            marginTop:'0px'
        })

    }
}



