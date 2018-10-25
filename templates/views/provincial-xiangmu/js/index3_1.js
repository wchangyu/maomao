/**
 * Created by admin on 2018/10/25.
 */

//改变时间
$('.user-search .choose-time').on('click',function(){

    $('.user-search .choose-time').removeClass('chooses');

    $(this).addClass('chooses');

    //获取当前日期类型
    var dataType = $(this).html();

    _selectTime(dataType);
});
_timeYMDComponentsFun($('.datatimeblock'));

/*---------------------------------------变量-----------------------------------------*/

//存放所有数据
var _allData = [];

//当前的餐厅id
var _thisId = '';

var _isExist = '';
var pageContentBody = $('.page-content .page-content-body');
var quyuid = window.sessionStorage.enterpriseID;
var resetObj = resetData(quyuid);
if(resetObj == null){
    myAlter("请求数据错误-----------")
}

//获取单位类型
var danweileixinglist = null;
    getdanweileixinglist()
    function getdanweileixinglist(){
        $.ajax({
            type: "GET",
            cache: false,
            url:_urls + 'ProvincialProject/GetAllProjRemouldMode',
            success: function (res) {
                if(res.code == 99){
                    danweileixinglist = res.data;
                }
                if(res.code == 3){
                    myAlter(res.message)
                }
                if(res.code == 1){
                    myAlter(res.message||"参数填写错误，请检查！")
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                Metronic.stopPageLoading();
                pageContentBody.html('<h4>Could not load the requested content.</h4>');
            }
        });
    }

//获取合作方式
var hezuofangshilist = null;
    gethezuofangshilist();
    function gethezuofangshilist(){
        var url = _urls + "ProvincialProject/GetALLProvincProjCollaborate";
        $.ajax({
            type: "GET",
            cache: false,
            url: url,
            success: function (res) {
                if(res.code == 99){
                    hezuofangshilist = res.data;
                }
                if(res.code == 3){
                    myAlter(res.message)
                }
                if(res.code == 1){
                    myAlter(res.message||"参数填写错误，请检查！")
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                Metronic.stopPageLoading();
                pageContentBody.html('<h4>Could not load the requested content.</h4>');
            }
        });
    }


var xiangmushishijindulist = null;
    getxiangmushishijindu();
    function getxiangmushishijindu(){
        $.ajax({
            type: "GET",
            cache: false,
            url:_urls + 'ProvincialProject/GetAllProjSchedule',
            success: function (res) {

                if(res.code == 99){
                    xiangmushishijindulist = res.data;
                }
                if(res.code == 3){
                    myAlter(res.message)
                }
                if(res.code == 1){
                    myAlter(res.message||"参数填写错误，请检查！")
                }


                var data = res.data;
                var optionstring = "";
                $.each(data,function(key,value){  //循环遍历后台传过来的json数据
                    optionstring += "<option value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
                });
                $("#xiangmushishijindu").html("<option value=''>请选择项目实施进度</option> "+optionstring); //获得要赋值的select的id，进行赋值

                $("#xiangmushishijindu").change(function(data){
                    var text = $("#xiangmushishijindu").find("option:selected").text();
                    var val = $("#xiangmushishijindu").val();
                    if(val == "" || val == undefined){
                        return
                    }
                });

            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                Metronic.stopPageLoading();
                pageContentBody.html('<h4>Could not load the requested content.</h4>');
            }
        });
    }

function myAlter(string){
    $('#my-alert').modal('show');
    $('#my-alert p b').html(string);
}

    //初始化
    function createModeInit(){
        //将所有label .error验证隐藏
        var label = $('#create-Modal').find('label');

        for(var i=0;i<label.length;i++){

            var attr = $(label).eq(i).attr('class')

            if(attr){

                if(attr.indexOf('error')>-1){

                    label.eq(i).hide();

                }
            }

        }

        _isExist = '';
    }


//新增
    $('#createBtn').click(function(){

        //loadding
        $('.L-container').showLoading();

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        $('.L-container').hideLoading();

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //单位名称
        $('#danweimingcheng').val(resetObj.eprName)
        //所属区域
        $('#suoshuquyu').val(resetObj.districtName)
        
        //单位类型
        var danweileixing = danweileixinglist;
        if(danweileixing == null){
            myAlter("获取单位类型失败")
            return 
        }
        var optionstring = "";
        $.each(danweileixing,function(key,value){  //循环遍历后台传过来的json数据
            optionstring += "<option value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
        });
        $("#danweileixing").html(optionstring); //获得要赋值的select的id，进行赋值

        //合作方式
        var hezuofangshi = hezuofangshilist;
        if(hezuofangshi == null){
            myAlter("获取合作方式失败")
            return 
        }
        var optionstring = "";
        $.each(hezuofangshi,function(key,value){  //循环遍历后台传过来的json数据
            optionstring += "<option cstFlag=\"" + value.cstFlag + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
        });
        $("#hezuofangshi").html( optionstring);
        hezuofangshievt()

        //项目实施进度
        var xiangmushishijindu = xiangmushishijindulist;
        if(xiangmushishijindu == null){
            myAlter("获取项目实施进度列表失败")
            return 
        }
        var optionstring = "";
        $.each(xiangmushishijindu,function(key,value){  //循环遍历后台传过来的json数据
            optionstring += "<option value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
        });
        $("#xiangmushishijindu").html(optionstring); 

    })


//合作方式触发的事件
function hezuofangshievt(){
    var attr = $("#hezuofangshi").find("option:selected").attr('cstFlag');
    var val = $("#hezuofangshi").val();

    getxiangmuleixingbyhezuofangshiid( val )
    if(attr == 1){
        getEpcBycstflag( attr )
        //清除项目类型的所有值包括星星
        // $("#xiangmuleixing").html("")
        // $('#xiangmuleixing').attr("disabled",true);
        $('#epcleixing').attr("disabled",false);
    }else{
        $("#epcleixing").html("");
        $('#epcleixing').attr("disabled",true);
        // $('#xiangmuleixing').attr("disabled",false);

    }
    
}
$("#hezuofangshi").change(hezuofangshievt);
function getEpcBycstflag(cstflag) {
    var url = _urls + "ProvincialProject/GetALLProvincProjEPCType";
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 99){
                var data = res.data;
                var optionstring = "";
                $.each(data,function(key,value){  //循环遍历后台传过来的json数据
                    optionstring += "<option itemKey=\"" + value.itemKey + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
                });
                $("#epcleixing").html(optionstring); //获得要赋值的select的id，进行赋值
            }
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}
function  getxiangmuleixingbyhezuofangshiid ( id ){
    var url = _urls + "ProvincialProject/GetOneProjRemouldMode?collaborateWay="+id;
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }
            if(res.code == 99){
                var data = res.data;
                var optionstring = "";
                if(data == ""){
                     myAlter("此合作方式项目类型为空,请更换合作方式")
                }
                $.each(data,function(key,value){
                    optionstring += "<option suoshuid=\"" + value.fK_CollaborateWay  + "\" value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
                });
                $("#xiangmuleixing").html(optionstring);
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}





















$(function(){
    $('#xiangmu').validate({
            onfocusout: function(element) { 
                $(element).valid()
            },
            rules:{
                //单位名称
                'danweimingcheng':{
                    required: true,
                },
                //所属区域
                'suoshuquyu':{
                    required: true
                },
                'danweileixing':{
                    required: true
                },
                'xiangmumingcheng':{
                    required: true
                },
                'gaizaomianji': {
                    required: true,
                    numberFormat1:true
                },
                'touzie':{
                    numberFormat1:true,
                    required: true
                },
                'shishidanwei':{
                    required: true,
                },
                'qianyuejienenglv':{
                    required: true,
                    numberFormat1:true,
                },
                'caigoujihuaxiadashijian': {
                    required: true,
                    isDate: true
                },
                'zhaobiaoshijian': {
                    required: true,
                    isDate: true
                },
                'hetongshijian': {
                    required: true,
                    isDate: true
                },
                'yanshoushijian': {
                    required: true,
                    isDate: true
                },
                'guanlianjianzhu': {
                    required: false
                },
                'xiangmushishijindu': {
                    required: true,
                },
                'xiangmuleixing': {
                    required: true,
                }

            },
            messages:{
                'danweimingcheng':{
                    required: '请输入单位名称'
                },
                'suoshuquyu':{
                    required: '请输入所属区域'
                },
                'danweileixing':{
                    required: '请选择单位类型'
                },
                'xiangmumingcheng':{
                    required: "请输入项目名称"
                },
                'gaizaomianji': {
                    required: "请输入改造面积"
                },
                'touzie':{
                    required: "请输入投资额"
                },
                'shishidanwei':{
                    required: "请输入实施单位",
                },
                'qianyuejienenglv':{
                    required: "请输入签约节能率",
                },
                'caigoujihuaxiadashijian': {
                    required: "请输入采购计划下达时间",
                },
                'zhaobiaoshijian': {
                    required: "请输入招标时间",
                },
                'hetongshijian': {
                    required: "请输入合同时间",
                },
                'yanshoushijian': {
                    required: "请输入验收时间",
                },
                'xiangmushishijindu': {
                    required: "请选择项目实施进度",
                },
                'xiangmuleixing': {
                    required: "项目类型不能为空",
                }
            }
        });

    

    /*----------------------------------------验证-----------------------------------------*/
    //点击按钮验证
    function validform(){
        return $('#xiangmu').validate({
            onfocusout: function(element) { $(element).valid()},
            rules:{
                //单位名称
                'danweimingcheng':{
                    required: true,
                },
                //所属区域
                'suoshuquyu':{
                    required: true
                },
                'danweileixing':{
                    required: true
                },
                'xiangmumingcheng':{
                    required: true
                },
                'gaizaomianji': {
                    required: true,
                    numberFormat1:true
                },
                'touzie':{
                    numberFormat1:true,
                    required: true
                },
                'shishidanwei':{
                    required: true,
                },
                'qianyuejienenglv':{
                    required: true,
                    numberFormat1:true,
                },
                'caigoujihuaxiadashijian': {
                    required: true,
                    isDate: true
                },
                'zhaobiaoshijian': {
                    required: true,
                    isDate: true
                },
                'hetongshijian': {
                    required: true,
                    isDate: true
                },
                'yanshoushijian': {
                    required: true,
                    isDate: true
                },
                'guanlianjianzhu': {
                    required: false
                },
                'xiangmushishijindu': {
                    required: true,
                },
                'xiangmuleixing': {
                    required: true,
                }

            },
            messages:{
                'danweimingcheng':{
                    required: '请输入单位名称'
                },
                'suoshuquyu':{
                    required: '请输入所属区域'
                },
                'danweileixing':{
                    required: '请选择单位类型'
                },
                'xiangmumingcheng':{
                    required: "请输入项目名称"
                },
                'gaizaomianji': {
                    required: "请输入改造面积"
                },
                'touzie':{
                    required: "请输入投资额"
                },
                'shishidanwei':{
                    required: "请输入实施单位",
                },
                'qianyuejienenglv':{
                    required: "请输入签约节能率",
                },
                'caigoujihuaxiadashijian': {
                    required: "请输入采购计划下达时间",
                },
                'zhaobiaoshijian': {
                    required: "请输入招标时间",
                },
                'hetongshijian': {
                    required: "请输入合同时间",
                },
                'yanshoushijian': {
                    required: "请输入验收时间",
                },
                'xiangmushishijindu': {
                    required: "请选择项目实施进度",
                },
                'xiangmuleixing': {
                    required: "项目类型不能为空",
                }
            }
        });
    }


    /*------------------------------------------表格初始化---------------------------------*/

    function reset (){}

    /*----------------------------------------按钮事件-------------------------------------*/

    

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        var flag= $("#xiangmu").valid();
       if(!flag){
           return false;
       }

    })
    /*-----------------------------------其他方法------------------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            lxbm:$('#DC-dishCon').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/RetrunCookStyleList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _jumpNow($('#table'),result.data);

            }

        })


    }
})

function resetData ( id ){
    var alldata = JSON.parse(window.sessionStorage.pointers);
    var len = alldata.length;
    for (var i = 0; i < len; i++) {
        var item = alldata[i];
        if(item.enterpriseID == id){
            return item;
        }
    }
    return null;
}