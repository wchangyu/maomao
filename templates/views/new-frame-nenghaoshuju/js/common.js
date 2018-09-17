/**
 * Created by admin on 2018/9/10.
 */
$(function(){

    //获取当前时间
    var curDate = moment().format('YYYY/MM/DD');

    $('.min').val(curDate);

    //点击自定义的select选框
    $('.choose-custom-select-container ').on('click','.the-select-message',function(e){

        $(this).parent().find('.the-select-message').removeClass('onChoose');

        $(this).addClass('onChoose');

        //获取当前选中的内容
        var thisContent = $(this).html();

        //页面赋值
        $(this).parents('.choose-custom-select').find('font').html(thisContent);

        $(this).parents('.choose-custom-select-container').hide();

        e.stopPropagation();    //阻止冒泡事件

    });

    //点击对象选中的上方选项卡
    $('.choose-object-windows .left-middle-tab').on('click',function(){


        $('.choose-object-windows .left-middle-tab').removeClass('onChoose');

        $(this).addClass('onChoose');

    });

    //点击对象选择按钮 弹出选择窗口
    $('.right-choose-condition-container .choose-object').on('click',function(){

       $('#my-object').modal('show');

    });

    //点击对象弹窗中的确定按钮
    $('.choose-object-windows .sure').on('click',function(){

        //console.log(511);

        //变更当前用户选择的对象类型
        onChooseObjectType = $('.choose-object-windows .left-tab-contain .onChoose').index();

        //获取当前选择的信息
        var nodes = getMessageByType(onChooseObjectType);

        var html = '';

        $(nodes).each(function(i,o){

            html += '<p class="has-choosed-message">'+
                        '<b></b><font title="'+ o.name+'">'+o.name+'</font>'+
                    '</p>'
        });

        //页面赋值
        $('.has-choosed-object').html(html);

        ////隐藏模态框
        $('#my-object').modal('hide');

    });

    //打开选择时间类型的窗口
    $('.right-choose-condition-container .choose-custom-select').on('click',function(e){

        $(this).find('.choose-custom-select-container').toggle();


        e.stopPropagation();    //阻止冒泡事件
    });

    //选择时间类型
    $('.right-choose-condition-container .choose-time-select .the-time-type').on('click',function(e){


        //获取当前的时间类型
        var dateType = $(this).html();

        //时间初始化方法
        _newSelectTime(dateType);

        //e.stopPropagation();    //阻止冒泡事件

    });

    //当选择周时
    $('.min').on('changeDate',function(e){
        //获取到时间类型
        var dataType = $('.choose-time-select .onChoose').html();

        if(dataType == '周'){
            //获取当前时间
            var curDate = $(this).val();

            //获取结束时间
            var date = moment(curDate).add('6','days').format('YYYY/MM/DD');

            //给结束时间选框赋值
            $('.max').val(date);
        }
    });

    $('.max').on('changeDate',function(e){
        //获取到时间类型
        var dataType = $('.choose-time-select .onChoose').html();

        if(dataType == '周'){
            //获取当前时间
            var curDate = $(this).val();

            //获取结束时间
            var date = moment(curDate).subtract('6','days').format('YYYY/MM/DD');

            //给结束时间选框赋值
            $('.min').val(date);
        }
    });

    $('body').on('click',function(){

        $('.choose-time-select').hide();
    });

    //点击改变能耗种类
    $('.left-choose-energy-container .time-radio').on('change',function(){

        //获取当前能耗种类
        var _ajaxEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id');

        //获取当前单位
        var unit = getEtUnit(_ajaxEcType);

        //改变右上角单位
        var html = '';

        if(_ajaxEcType == '01'){

            $(unitArr1).each(function(i,o){
                html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'
            });

        }else{


            html += '<option value="'+ 0+'">'+ unit+'</option>'
        }

        $('#unit').html(html);

        if($('.the-unit').length > 0){


            $('.the-unit').val(unit);
        }


        //获取对应能耗类型下的支路

        var _ajaxEcType1 = $('.left-choose-energy-container .time-radio:checked').attr('data-type');

        //如果页面中存在支路  则需获取
        if($('#allBranch').length > 0){

            //获取当前页面地址
            var thisUrl = window.location.href;

            //能耗分项页面不需要获取支路
            if(thisUrl.indexOf('energySubentry.html') == -1){

                GetAllBranches(branchesType,_ajaxEcType1);
            }

        }

    });

});

//支路是否是单选框
branchesType = 1;

//存放当前用户选择的对象类型 0楼宇 1单位 2支路
onChooseObjectType = 0;

//存放当前选中信息
onChooseMessageArr = [];

//日历时间初始化
function _newSelectTime(dataType){


    $('.end-time').show();


    if(dataType == '日'){


         _timeYMDComponentsFun($('.min'));

        $('.end-time').hide();
        //获取昨天
        var date = moment().format('YYYY/MM/DD');

        $('.min').val(date);

    }else if(dataType == '周'){

        var curUrl = window.location.href;

        //如果是能耗查询页面
        if(curUrl.indexOf("new-nenghaoshuju/energyDemand-1.html") > -1){
            $('.datatimeblock').datetimepicker('remove');
        }

         _timeYMDComponentsFun($('.min'));

        _timeYMDComponentsFun($('.max'));


        //获取上周
        var date1 = moment().subtract('6','days').format('YYYY/MM/DD');
        //获取昨天2
        var date2 = moment().format('YYYY/MM/DD');

        $('.min').val(date1);
        $('.max').val(date2);



    }else if(dataType == '月'){

        var curUrl = window.location.href;

        //如果是能耗查询页面
        if(curUrl.indexOf("new-nenghaoshuju/energyDemand-1.html") > -1){
            $('.datatimeblock').datetimepicker('remove');
        }

        _monthDate($('.min'));


        $('.end-time').hide();

        //获取上月
        var date = moment().format('YYYY/MM');
        $('.min').val(date);

    }else if(dataType == '年'){

        _yearDate($('.min'));

        var curUrl = window.location.href;

        //如果是能耗查询页面
        if(curUrl.indexOf("new-nenghaoshuju/energyDemand-1.html") > -1){
            $('.datatimeblock').datetimepicker('remove');
        }

        $('.end-time').hide();
        //获取上年
        var date = moment().format('YYYY');
        $('.min').val(date);

    }else{

        var curUrl = window.location.href;

        //如果是能耗查询页面
        if(curUrl.indexOf("new-nenghaoshuju/energyDemand-1.html") > -1){

            //展示选择展示类型的选框
            $('.chooseShowType').show();

            $('.datatimeblock').datepicker('destroy');

            $('.datatimeblock').datetimepicker('remove');

            //获取当前的展示类型
            //获取当前展示类型
            var showType = $('.chooseShowType').val();

            //按日展示
            if(showType == 0){

                //时间插件
                _timeYMDComponentsFun($('.datatimeblock'));

                //按小时展示
            }else if(showType == 1){

                //时间插件
                _timeComponentsFun2($('.datatimeblock'));


                //按分钟展示
            }else if(showType == 2){
                //console.log(44);

                _timeComponentsFun1($('.datatimeblock'))
            }


        }else{

             _timeYMDComponentsFun($('.min'));

        }

        //改变提示信息
        $('.start-time-choose label').html('开始时间：');
        $('.min').val('');
        $('.max').val('');
        //取消开始时间选框居中
        $('.start-time-choose').removeClass('position-center');
    }
};

//获取树状图选择信息
function getMessageByType(objectType){

    //定义树状图id
    var treeId = $('.choose-object-windows .ztree').eq(objectType).attr('id');

    var treeObj = $.fn.zTree.getZTreeObj(treeId);

    var nodes = treeObj.getCheckedNodes(true);

    //console.log(nodes);

    onChooseMessageArr = nodes;

    return nodes;
}

//展示日期类型 用户选择日期类型
function getCurShowDateType(dateType){


    //定义展示日期类型
    var showDateType = '';
    //定义用于选择日期类型
    var selectDateType = '';

    if(dateType == '日'){

        showDateType = "Hour";
        selectDateType = "Day"

    }else if(dateType == '周'){

        showDateType = "Day";
        selectDateType = "Week"

    }else if(dateType == '月'){

        showDateType = "Day";
        selectDateType = "Month"

    }else if(dateType == '年'){

        showDateType = "Month";
        selectDateType = "Year"
    }else if(dateType == '自定义'){

        showDateType = "Custom";
        selectDateType = "Custom"
    }

    return [showDateType,selectDateType]
};

//获取开始结束时间
function getCurPostTime(dateType){

    //定义开始时间
    var startTime = '';

    if($('.min').length > 0){

        startTime = $('.min').val();
    }

    //定义结束时间
    var endTime = '';

    if(dateType == '日'){

        startTime = startTime;
        endTime = moment(startTime).add('1','days').format('YYYY/MM/DD');

    }else if(dateType == '周'){

        startTime = startTime;

        endTime = moment(startTime).add('7','days').format('YYYY/MM/DD');

    }else if(dateType == '月'){

        startTime = startTime + '/01';
        endTime = moment(startTime).add('1','months').startOf('month').format('YYYY/MM/DD');
    }else if(dateType == '年'){

        endTime = (parseInt(startTime) + 1) + '/01/01';
        startTime = startTime + '/01/01';

    }else if(dateType == '自定义'){

        startTime = startTime;
        endTime = moment($('.max').val()).add('1','days').format('YYYY/MM/DD');
    }

    return [startTime,endTime]
};

//获取能耗名称
function getEtName(num){

    var  num1 = num;

    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

    var txt = unitObj.alltypes;
    for(var i=0; i < txt.length; i++){
        if(num1 == txt[i].etid){
            return txt[i].etname;
        }
    }

};

//获取能耗单位
function getEtUnit(num){

    var  num1 = num;

    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

    var txt = unitObj.alltypes;
    for(var i=0; i < txt.length; i++){
        if(num1 == txt[i].etid){
            return txt[i].etunit;
        }
    }

};


//简单递归
function recursion(dataArr,resultArr){

    $(dataArr).each(function(i,o){

        var obj = {

            id : o.id,
            name : o.name
        };

        resultArr.push(obj);

        var childrenArr = o.children;

        if(childrenArr && childrenArr.length > 0){

            recursion(childrenArr,resultArr);
        }

    });
}