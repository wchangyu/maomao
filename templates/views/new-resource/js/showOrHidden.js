$(function(){
    //点击箭头移动
    $('.showOrHidden').click(function(){
        var o1 = $(".content-main-left").css("display");
        if(o1 == 'block'){
            $('.content-main-left').hide()
            $('.content-main-right').removeClass('col-lg-9 col-md-8').addClass('col-lg-12 col-md-12');
            $('.showOrHidden').css({
                'background':'url("../resource/img/show.png")no-repeat',
                'background-size':'20px',
                'background-position':'center'
            })
        }else if(o1 == 'none'){
            $('.content-main-left').show();
            $('.content-main-right').removeClass('col-lg-12 col-md-12').addClass('col-lg-9 col-md-8');
            $('.showOrHidden').css({
                'background':'url("../resource/img/hidden.png")no-repeat',
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
    });

    //对象选择(楼宇、科室切换)
    $(".left-middle-tab").click(function(){
        $(".left-middle-tab").css({
            "border":"2px solid #5b9bd5",
            "background":"#fff",
            "color":"#5b9bd5"
        })
        $(this).css({
            "background":"#5b9bd5",
            "border":"2px solid #5b9bd5",
            "color":"#ffffff"
        })
        $(".tree-1").css({
            display:"none"
        }),
            $(".tree-1")[$(this).index()].style.display="block"
    });

    //初始化能耗种类
    var _ajaxEcType = '01';
    var _itemName = '电';


    //点击切换楼宇或单位时，改变上方能耗类型
    $('.left-middle-tab').on('click',function(){

        $('.left-middle-tab').removeClass('onChecked');

        $('.left-middle-tab').removeClass('isChoose');
        //判断页面中是否存在能耗类型选项
        if(typeof _energyTypeSel!="undefined" ){
            if($(this).index() == 0){

                _energyTypeSel.initPointers($(".energy-types"),undefined,function(){
                    getEcType();
                });

                $(this).addClass('isChoose');

            }else if($(this).index() == 1){

                _energyTypeSel.initOffices($(".energy-types"),undefined,function(){
                    getEcType();
                });

                $(this).addClass('isChoose');
            }else if($(this).index() == 2){

                _energyTypeSel.initPointers($(".energy-types"),undefined,function(){
                    getEcType();
                });
                //给支路增加选中标识
                $(this).addClass('onChecked');

                $(this).addClass('isChoose');

            }

            //改变右上角单位
            var html = '';
            $(unitArr1).each(function(i,o){
                html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'
            });
            if($('#unit').length > 0){
                $('#unit').html(html);
            }

            //默认选中第一个能耗
            $('.selectedEnergy').addClass('blueImg0');
        }else{

        };



    });

    //王常宇
    addSearchBox();

})
//选中的能耗种类
function getEcType(){
    var aaa =[];
    var bbb = [];
    var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
    if(jsonText){
        for(var i=0;i<jsonText.alltypes.length;i++){
            aaa.push(jsonText.alltypes[i].etid);
            bbb.push(jsonText.alltypes[i].etname);
        }
        _ajaxEcType = aaa[$('.selectedEnergy').index()];
        _itemName = bbb[$('.selectedEnergy').index()];
    }
}

//日历时间
function _selectTime(dataType){
    //改变提示信息
    $('.start-time-choose label').html('选择时间：');
    $('.end-time-choose').show();
    //开始时间选框居中
    $('.start-time-choose').addClass('position-center');
    if(dataType == '日'){
        _initDate1();

        $('.end-time-choose').hide();
        //获取昨天
        var date = moment().subtract('1','days').format('YYYY-MM-DD');
        $('.min').val(date);
    }else if(dataType == '周'){
        _initDate1();
        //改变提示信息
        $('.start-time-choose label').html('开始时间：');
        //获取上周
        var date1 = moment().subtract('7','days').format('YYYY-MM-DD');
        //获取昨天2
        var date2 = moment().subtract('1','days').format('YYYY-MM-DD');
        $('.min').val(date1);
        $('.max').val(date2);
        //取消开始时间选框居中
        $('.start-time-choose').removeClass('position-center');

    }else if(dataType == '月'){
        _monthDate1();

        $('.end-time-choose').hide();
        //获取上月
        var date = moment().subtract('1','months').format('YYYY-MM');
        $('.min').val(date);
    }else if(dataType == '年'){
        _yearDate1();

        $('.end-time-choose').hide();
        //获取上年
        var date = moment().subtract('1','years').format('YYYY');
        $('.min').val(date);
    }else{
        _initDate1();
        //改变提示信息
        $('.start-time-choose label').html('开始时间：');
        $('.min').val('');
        $('.max').val('');
        //取消开始时间选框居中
        $('.start-time-choose').removeClass('position-center');
    }
}
//月的时间初始化
function _monthDate1(){
    $('#datetimepicker').datepicker('destroy');
    $('#datetimepicker').datepicker({
        startView: 1,
        maxViewMode: 2,
        minViewMode:1,
        forceParse: 0,
        format: "yyyy-mm",//选择日期后，文本框显示的日期格式
        language: "zh-CN",//汉化
        forceParse: 0,
        autoclose:1
    })
}

//年的时间初始化
function _yearDate1(){
    $('#datetimepicker').datepicker('destroy');
    $('#datetimepicker').datepicker({
        startView: 2,
        maxViewMode: 2,
        minViewMode:2,
        autoclose:1,
        forceParse: 0,
        format: "yyyy",//选择日期后，文本框显示的日期格式
        language: "zh-CN" //汉化
    })
}

//一般时间初始化
function _initDate1(){
    $('#datetimepicker').datepicker('destroy');
    $('#datetimepicker').datepicker(
        {
            language:  'zh-CN',
            todayBtn: 1,
            todayHighlight: 1,
            forceParse: 0,
            format: 'yyyy-mm-dd',
            autoclose:1
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

//获取能耗种类参数方法
function _getEcTypeValue(){
    var aaa =[];
    var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));
    if(jsonText){
        for(var i=0;i<jsonText.alltypes.length;i++){
            aaa.push(jsonText.alltypes[i].etid)
        }
        var el = aaa[$('.selectedEnergy').index()];
        return el;
    }
};

//获取能耗种类名称方法
function _getEcTypeWord(){
    var aaa =[];
    var jsonText = JSON.parse(sessionStorage.getItem('allEnergyType'));
    if(jsonText){
        for(var i=0;i<jsonText.alltypes.length;i++){
            aaa.push(jsonText.alltypes[i].etname);
        }
        var el = aaa[$('.selectedEnergy').index()];
        return el;
    }
}

//能耗种类方法（电、水、气）
function _getEcType(attr){
    var _energyTypeSel = new ETSelection();
    _energyTypeSel[attr]($(".energy-types"),undefined,function(){
    });


}

//楼宇ztree树(flag = 1,单选按钮，flag = 2，复选按钮)
function _getPointerZtree(pointerId,flag){
    var _objectSel = new ObjectSelection();
    if(flag == 1){
        _objectSel.initPointers(pointerId,true);
    }else if(flag == 2){
        _objectSel.initPointers(pointerId,false,true);
    }
    return _objectSel;
}

//科室ztree树(flag = 1,单选按钮，flag = 2，复选按钮)
function _getOfficeZtree(officesId,flag){
    var _objectSel = new ObjectSelection();
    if(flag == 1){
        _objectSel.initOffices(officesId,false);
    }else if(flag == 2){
        _objectSel.initOffices(officesId,true);
    }

    return _objectSel;
}

//楼宇、科室搜索功能
function _searchPO(tip,pointerId,tips,officeId){
    var objSearchs = new ObjectSearch();
    objSearchs.initPointerSearch($("#keys"),tip,pointerId);
    var objSearch = new ObjectSearch();
    objSearch.initOfficeSearch($("#key"),tips,officeId);
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


            $('#selectPointer option').eq(i).css({
                display:'none'
            });
        }
    }

});

function addSearchBox(){

    //判断是否存在楼宇select列表
    if($('#selectPointer')){

        var theWidth = $('#selectPointer').width() + 2;

        var html = '<input type="text" placeholder="请输入楼宇名称搜索" class="input-search-value form-control" style="height:30px !important; width:'+theWidth+'px; margin-bottom:5px;">';

        //给楼宇列表上方增加搜索框
        $('#selectPointer').before(html);

        $('#selectPointer').css({
            marginTop:'0px'
        })

    }
}




