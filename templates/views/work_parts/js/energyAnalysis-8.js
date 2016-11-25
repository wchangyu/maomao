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
    //时间
    $('.datetimepickereType').html(_ajaxStartTime +'到'+_ajaxStartTime);
    //日历格式初始化
    initDate();
    $('#datetimepicker').on('changeDate',function(e){
        dataType();
        inputValue = $('#datetimepicker').val();
        if(_ajaxDataType=="日"){
            inputValue = $('#datetimepicker').val();
            var now = moment(inputValue).startOf('day');
            var startDay = now.format("YYYY-MM-DD");
            var endDay = now.add(1,'d').format("YYYY-MM-DD");
            _ajaxStartTime=startDay;
            _ajaxDataType_1='小时';
            var end=startDay + "-" +startDay;
            var aa = $('.datetimepickereType').text();
            if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
                if(aa.indexOf(end)<0){
                    $('.datetimepickereType').html(end);
                }
            }
            var startSplit = startDay.split('-');
            var endSplit = endDay.split('-');
            _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
            _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
        }else if(_ajaxDataType=="周"){
            inputValue = $('#datetimepicker').val();
            var now = moment(inputValue).startOf('week');
            //页面显示时间
            var nowStart = now.add(1,'d').format("YYYY-MM-DD");
            var endStart = now.add(6,'d').format("YYYY-MM-DD");
            //实际计算开始结束时间
            var startWeek = now.subtract(6,'d').format("YYYY-MM-DD");
            var endWeek = now.add(7,'d').format("YYYY-MM-DD");
            end =nowStart + "-" + endStart;
            _ajaxDataType_1='日';
            var aa = $('.datetimepickereType').text();
            _ajaxStartTime=startWeek;
            if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
                if(aa.indexOf(end)<0){
                    $('.datetimepickereType').html(end);
                }
            }
            var startSplit = startWeek.split('-');
            var endSplit = endWeek.split('-');
            _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
            _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
        }else if(_ajaxDataType=="月"){
            var now = moment(inputValue).startOf('month');
            var nows = moment(inputValue).endOf('month');
            var nowStart = now.format("YYYY-MM-DD");
            var nowEnd = nows.format("YYYY-MM-DD");
            var startMonth = now.format("YYYY-MM-DD");
            var endMonth = nows.add(1,'d').format("YYYY-MM-DD");
            end = nowStart + "-" + nowEnd;
            _ajaxDataType_1 = '日';
            var aa = $('.datetimepickereType').text();
            _ajaxStartTime = startMonth;
            if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
                if(aa.indexOf(end)<0){
                    $('.datetimepickereType').html(end);
                }
            }
            var startSplit = startMonth.split('-');
            var endSplit = endMonth.split('-');
            _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
            _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
        }else if(_ajaxDataType=="年"){
            var now = moment(inputValue).startOf('year');
            var nows = moment(inputValue).endOf('year');
            var nowStart = now.format("YYYY-MM-DD");
            var nowEnd = nows.format("YYYY-MM-DD");
            var startYear = now.format("YYYY-MM-DD");
            var endYear = nows.add(1,'d').format("YYYY-MM-DD");
            end = nowStart + "-" + nowEnd;
            _ajaxDataType_1='月'
            var aa = $('.datetimepickereType').text();
            _ajaxStartTime=startYear;
            if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
                if(aa.indexOf(end)<0){
                    $('.datetimepickereType').html(end);
                }
            }
            var startSplit = startYear.split('-');
            var endSplit = endYear.split('-');
            _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
            _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
        }
    })
    $('.types').change(function(){
        var bbaa = $('.types').find('option:selected').val();
        if(bbaa == '月'){
            monthDate();
        }else if(bbaa == '年'){
            yearDate();
        }else{
            initDate();
        }
        $('.datetimepickereType').empty();
    });
    //搜索框功能
    var objSearch = new ObjectSearch();
    objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
});
//设置开始和结束初始值
var _ajaxStartTime = moment().subtract(1,'d').format("YYYY-MM-DD");
var	_ajaxStartTime_1=moment().subtract(1,'d').format("YYYY/MM/DD");
var _ajaxEndTime_1=moment().format("YYYY/MM/DD");
function getData(){
    //系统损耗率
    var lossRate = 0;
    //评价
    var warning = '值偏高，建议排查！';
    $.ajax({
        type:'post',
        url:'../../assets/local/configs/系统损耗配置.json',
        async:false,
        success:function(result){
            console.log(result.transformers);
            for(var i=0;i<result.transformers.length;i++){
                var str = '<li class="content-left-lists"><p class="voltageValue">' + result.transformers[i].capacity
                    + '</p><ul class="transformer"><li class="import"><span>输入</span><br><span>' + result.transformers[i].IDin
                    + '</span></li><li class="transformerImg">' + result.transformers[i].name
                    + '</li><li class="output"><span>输出</span><br><span>' + result.transformers[i].IDout
                    + '</span></li><div class="clearfix"></div><li class="indexing">' + (i+1)
                    + '</li></ul><p class="attritionRate"><span>损耗率</span><br><span>' + lossRate
                    + '</span></p><p class="prompt">值偏高，建议排查！</p></li>'
                $('.L-wrap').append(str);
            }
        }
    })
}
//月的时间初始化
function monthDate(){
    $('#datetimepicker').datepicker('destroy');
    $('#datetimepicker').datepicker({
        startView: 1,
        maxViewMode: 1,
        minViewMode:1,
        format: "yyyy-mm-dd",//选择日期后，文本框显示的日期格式
        language: "zh-CN" //汉化
    })
}
//年的时间初始化
function yearDate(){
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
function initDate(){
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
//获取dataType
var _ajaxDataType_1='小时';
var _ajaxDataType;
function dataType(){
    var dataType;
    dataType = $('.types').val();
    _ajaxDataType=dataType;
}