/**
 * Created by admin on 2018/10/23.
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


// 初始化本次的数据

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
var hh = {
    cache: {

    },
    data: {
        xiangmujindulist: [],
        xiangmujindulistflag: false,
        hezuofangshilist: [],
        hezuofangshilistflag: false,
        resetNum: 0,
    },
    reset: function () {
            // 初始化
            //单位类型
            $("#danweileixing option:first").prop("selected", 'selected')
            //合作方式
            $("#hezuofangshi option:first").prop("selected", 'selected');
            //项目实施进度
            $("#xiangmushishijindu option:first").prop("selected", 'selected');
            //附件清空
            $('#thelist').html('');
            $('#myModal #thelist0').html('');
            //epc类型
            var epctext = $("#epcleixing").html("")
            //获取单位名称
            var danweimingcheng = $('.danweimingcheng').val("")
            //获取所属区域
            var suoshuquyu = $('.suoshuquyu').val("")
            //获取项目名称
            var xiangmumingcheng = $('#xiangmumingcheng').val("");
            //获取合作方式
            var hezuofangshival = $("#hezuofangshi").val("");
            var epctext = "";
            var epcval = "";
            var epcattr = "";
            var xiangmuleixingtext = "";
            var xiangmuleixingval = "";
            var epctext = $("#epcleixing").find("option:selected").text("");
            var epcval = $("#epcleixing").val("");
            //获取项目类型
            var xiangmuleixingtext = $("#xiangmuleixing").html("")
            //获取改造面积
            var gaizaomianji = $("#gaizaomianji").val("");
            //获取投资额度
            var touzie = $("#touzie").val("");
            //获取实施单位
            var shishidanwei = $("#shishidanwei").val("");
            //获取签约节能率
            var qianyuejienenglv = $("#qianyuejienenglv").val("");
            //获取采购计划下达时间
            var caigoujihuaxiadashijian = $("#caigoujihuaxiadashijian").val("");
            //获取招标时间
            var zhaobiaoshijian = $("#zhaobiaoshijian").val("");
            //获取合同时间
            var hetongshijian = $("#hetongshijian").val("");
            //获取验收时间
            var yanshoushijian = $("#yanshoushijian").val("");
            //获取关联建筑
            var guanlianjianzhu = $("#guanlianjianzhu").val("");
            //获取备注
            var beizhu = $("#beizhu").val("");
            //获取附件
            _my_postKnowLedgeFileArr = [];

            //单位名称
            var danweimingcheng = resetObj.eprName;
            $('.danweimingcheng').val(danweimingcheng)
            //区域名称
            var quyumingcheng = resetObj.districtName;
            $('.suoshuquyu').val(quyumingcheng)
            this.getresetData();
    },
    getresetData: function() {
        // 先获取单位类型的所有值
        $.ajax({
            type: "GET",
            cache: false,
            url:_urls + 'ProvincialProject/GetAllProjRemouldMode',
            success: function (res) {
                var data = res.data;
                var optionstring = "";
                $.each(data,function(key,value){  //循环遍历后台传过来的json数据
                    optionstring += "<option value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
                });
                $("#danweileixing").html("<option value=''>请选单位类型</option> "+optionstring); //获得要赋值的select的id，进行赋值
                this.resetdataLoad()
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                Metronic.stopPageLoading();
                pageContentBody.html('<h4>Could not load the requested content.</h4>');
            }
        });
        //获取项目进度列表
        $.ajax({
            type: "GET",
            cache: false,
            url:_urls + 'ProvincialProject/GetAllProjSchedule',
            success: function (res) {
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
                this.resetdataLoad()
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                Metronic.stopPageLoading();
                pageContentBody.html('<h4>Could not load the requested content.</h4>');
            }
        });
    },
    resetdataLoad: function(){
        this.data.resetNum++;
        if(this.data.resetNum>=2){
            this.data.resetNum = 0;
            //此时代表了全部初始化完成了,可以填充数据进行编辑了
            startEdite()
        }
    }
}

var pageContentBody = $('.page-content .page-content-body');


var quyuid = window.sessionStorage.enterpriseID
var resetObj = resetData(quyuid);
if(resetObj == null){
    myAlter("请求数据错误-----------")
}
$('#myModal').on('shown.bs.modal', function () {
    hh.reset();
    return 
    // // 初始化
    // //单位类型
    // $("#danweileixing option:first").prop("selected", 'selected')
    // //合作方式
    // $("#hezuofangshi option:first").prop("selected", 'selected');
    // //项目实施进度
    // $("#xiangmushishijindu option:first").prop("selected", 'selected');
    // //epc类型
    // var epctext = $("#epcleixing").html("")
    // //获取单位名称
    // var danweimingcheng = $('.danweimingcheng').val("")
    // //获取所属区域
    // var suoshuquyu = $('.suoshuquyu').val("")
    // //获取项目名称
    // var xiangmumingcheng = $('#xiangmumingcheng').val("");
    // //获取合作方式
    // var hezuofangshival = $("#hezuofangshi").val("");
    // var epctext = "";
    // var epcval = "";
    // var epcattr = "";
    // var xiangmuleixingtext = "";
    // var xiangmuleixingval = "";
    // var epctext = $("#epcleixing").find("option:selected").text("");
    // var epcval = $("#epcleixing").val("");
    // //获取项目类型
    // var xiangmuleixingtext = $("#xiangmuleixing").html("")
    // //获取改造面积
    // var gaizaomianji = $("#gaizaomianji").val("");
    // //获取投资额度
    // var touzie = $("#touzie").val("");
    // //获取实施单位
    // var shishidanwei = $("#shishidanwei").val("");
    // //获取签约节能率
    // var qianyuejienenglv = $("#qianyuejienenglv").val("");
    // //获取采购计划下达时间
    // var caigoujihuaxiadashijian = $("#caigoujihuaxiadashijian").val("");
    // //获取招标时间
    // var zhaobiaoshijian = $("#zhaobiaoshijian").val("");
    // //获取合同时间
    // var hetongshijian = $("#hetongshijian").val("");
    // //获取验收时间
    // var yanshoushijian = $("#yanshoushijian").val("");
    // //获取关联建筑
    // var guanlianjianzhu = $("#guanlianjianzhu").val("");
    // //获取备注
    // var beizhu = $("#beizhu").val("");
    // //获取附件
    // _my_postKnowLedgeFileArr = [];

    // //单位名称
    // var danweimingcheng = resetObj.eprName;
    // $('.danweimingcheng').val(danweimingcheng)
    // //区域名称
    // var quyumingcheng = resetObj.districtName;
    // $('.suoshuquyu').val(quyumingcheng)

})

//获取进度表缓存一下
$.ajax({
    type: "GET",
    cache: false,
    url:_urls + 'ProvincialProject/GetAllProjSchedule',
    success: function (res) {
        if(res.code == 99){
            hh.data.xiangmujindulist = res.data;
            hh.data.xiangmujindulistflag = true;
            addXinhao()
        }
        if(res.code == 3){
            hh.data.xiangmujindulistflag = false;
            myAlter(res.message)
        }
        if(res.code == 1){
            hh.data.xiangmujindulistflag = false;
            myAlter(res.message||"参数填写错误，请检查！")
        }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        hh.data.xiangmujindulistflag = false;
        Metronic.stopPageLoading();
        pageContentBody.html('<h4>Could not load the requested content.</h4>');
    }
});
// 合作方式缓存下
var url = _urls + "ProvincialProject/GetALLProvincProjCollaborate";
$.ajax({
    type: "GET",
    cache: false,
    url: url,
    success: function (res) {
        if(res.code == 99){
            hh.data.hezuofangshilist = res.data;
            hh.data.hezuofangshilistflag = true;
            addXinhao()
        }
        if(res.code == 3){
            hh.data.hezuofangshilistflag = false;
            myAlter(res.message)
        }
        if(res.code == 1){
            hh.data.hezuofangshilistflag = false;
            myAlter(res.message||"参数填写错误，请检查！")
        }

    },
    error: function (xhr, ajaxOptions, thrownError) {
        hh.data.hezuofangshilistflag = false;
        Metronic.stopPageLoading();
        pageContentBody.html('<h4>Could not load the requested content.</h4>');
    }
});

var xinhaoflag = 0;
function addXinhao(){
    xinhaoflag++;
    if(xinhaoflag == 2){
        // 代表此次数据预加载完了,开始请求真实数据
        GetAllProData()
    }
}

function GetAllProData() {
    var xiangmumingchengselect = $("#xiangmumingchengselect").val();
    // POST /api/ProvincialProject/GetProjRemouldInfoByName
    var url = _urls + "ProvincialProject/GetProjRemouldInfoByName";
    $.ajax({
        type: "post",
        cache: false,
        url: url,
        data: {
            f_ProjName: xiangmumingchengselect
        },
        success: function (res) {
            if(res.code == 99){
                setTableData(res.data)
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

//根据itemkey获取合作方式对应名称
function getHezuofangshiByItemKey(itemkey){
    if(hh.data.hezuofangshilistflag&&hh.data.hezuofangshilist){
        for (var i = 0; i < hh.data.hezuofangshilist.length; i++) {
            var item = hh.data.hezuofangshilist[i];
            if(item.itemKey == itemkey){
                return item.cstName
            }
        }
    }
    return itemkey
}
//根据 itemkey 获取项目进度的对应名称
function getXiangmujinduByItemKey( itemkey ){
    if(hh.data.xiangmujindulistflag&&hh.data.xiangmujindulist){
        for (var i = 0; i < hh.data.xiangmujindulist.length; i++) {
            var item = hh.data.xiangmujindulist[i];
            if(item.itemKey == itemkey){
                return item.cstName
            }
        }
    }
    return itemkey
}


$("#danweileixing").change(function(data){
    var text = $("#danweileixing").find("option:selected").text();
    var val = $("#danweileixing").val();
    // console.log(text, val)
    if(val == "" || val == undefined){
        return
    }
    getxiangmuleixingbyid( val )
});


// 根据id 获取所有项目类型
function getxiangmuleixingbyid (id){
    //GET /api/ProvincialProject/GetProjRemouldModeByID/{id}
    var url = _urls + "ProvincialProject/GetProjRemouldModeByID/" + id;
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            console.log(res)

        },
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}


// 获取项目的合作方式
//GET /api/ProvincialProject/GetALLProvincProjCollaborate

function gethezuofangshi () {
    var url = _urls + "ProvincialProject/GetALLProvincProjCollaborate";
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 99){
                // console.log(res,'合作方式')
                var data = res.data;
                var optionstring = "";
                $.each(data,function(key,value){  //循环遍历后台传过来的json数据
                    optionstring += "<option cstFlag=\"" + value.cstFlag + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
                });
                $("#hezuofangshi").html("<option value=''>请选择合作方式</option> "+optionstring); //获得要赋值的select的id，进行赋值
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
gethezuofangshi()

$("#hezuofangshi").change(function(data){

    var text = $("#hezuofangshi").find("option:selected").text();
    var val = $("#hezuofangshi").val();
    var attr = $("#hezuofangshi").find("option:selected").attr('cstFlag');
    if(val == ""){
        myAlter("请选择合作方式")
        $('#epcleixing').html("");
        $("#xiangmuleixing").html("")
        $('.epcxinghao').css('visibility','visible');
        $('#epcleixing').css('visibility','visible');
         $('.xiangmuleixingxingxing').css('visibility','visible');
        return
    }
    // console.log(attr)
    // console.log('合作方式',text, val)
    getxiangmuleixingbyhezuofangshiid( val )
    if(attr == 1){
        // console.log('选择csflag = 1')
        getEpcBycstflag( attr )
        $('.epcxinghao').css('visibility','visible');
        $('#epcleixing').removeAttr("disabled");
        // $('#epcleixing').attr("disabled",false);
    }else{
        //清除epc类型的状态和星号
        $("#epcleixing").html(""); //获得要赋值的select的id，进行赋值
        $('.epcxinghao').css('visibility','hidden');
        $('#epcleixing').attr("disabled","disabled");
    }
});

// 根据epc =1 去请求epc的类型
// GET /api/ProvincialProject/GetALLProvincProjEPCType
function getEpcBycstflag(cstflag) {
    var url = _urls + "ProvincialProject/GetALLProvincProjEPCType";
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 99){
                console.log(res,'获取epc所有类型')
                var data = res.data;
                var optionstring = "";
                $.each(data,function(key,value){  //循环遍历后台传过来的json数据
                    optionstring += "<option itemKey=\"" + value.itemKey + "\" value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
                });
                $("#epcleixing").html("<option value=''>请选择epc类型</option> "+optionstring); //获得要赋值的select的id，进行赋值
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

// epc类型的选择

$("#epcleixing").change(function(data){
    var text = $("#epcleixing").find("option:selected").text();
    var val = $("#epcleixing").val();
    var attr = $("#epcleixing").find("option:selected").attr('itemKey');
});


// 根据合作方式ID获取所有的项目类型
//GET /api/ProvincialProject/GetOneProjRemouldMode
function  getxiangmuleixingbyhezuofangshiid ( id ){
    var url = _urls + "ProvincialProject/GetOneProjRemouldMode?collaborateWay="+id;
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            console.log(res,'根据合作id获取所有项目类型')
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }
            if(res.code == 99){
                // console.log(res,'所有项目类型')
                var data = res.data;
                var optionstring = "";
                $.each(data,function(key,value){  //循环遍历后台传过来的json数据
                    optionstring += "<option suoshuid=\"" + value.fK_CollaborateWay  + "\" value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
                });
                if(data == ""){
                    //项目类型的星号清除掉
                    $('.xiangmuleixingxingxing').css('visibility','hidden');
                    $("#xiangmuleixing").html("");
                    $('#xiangmuleixing').attr("disabled",true);
                    // $('#areaSelect').attr("disabled",false);
                    // $('#areaSelect').removeAttr("disabled");
                }else{
                    $('.xiangmuleixingxingxing').css('visibility','visible');
                    $("#xiangmuleixing").html("<option value=''>请选择项目类型</option> "+optionstring); //获得要赋值的select的id，进行赋值
                    $('#xiangmuleixing').attr("disabled",false);
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}
//getxiangmuleixingbyhezuofangshiid( id )


// 获取项目的实施进度
//GET /api/ProvincialProject/GetAllProjSchedule
// function getxiangmushishijindu (){
//     $.ajax({
//         type: "GET",
//         cache: false,
//         url:_urls + 'ProvincialProject/GetAllProjSchedule',
//         success: function (res) {
//             //console.log(res)
//             var data = res.data;
//             var optionstring = "";
//             $.each(data,function(key,value){  //循环遍历后台传过来的json数据
//                 optionstring += "<option value=\"" + value.itemKey + "\" >" + value.cstName + "</option>";
//             });
//             $("#xiangmushishijindu").html("<option value=''>请选择项目实施进度</option> "+optionstring); //获得要赋值的select的id，进行赋值
//         },
//         error: function (xhr, ajaxOptions, thrownError) {
//             Metronic.stopPageLoading();
//             pageContentBody.html('<h4>Could not load the requested content.</h4>');
//         }
//     });
// }
// getxiangmushishijindu()
// $("#xiangmushishijindu").change(function(data){
//     var text = $("#xiangmushishijindu").find("option:selected").text();
//     var val = $("#xiangmushishijindu").val();
//     // console.log(text, val)
//     if(val == "" || val == undefined){
//         return
//     }
// });




$('#chuangjian').on('click',function(){
    // 开始提交按钮
    //获取单位名称
    var danweimingcheng = $('.danweimingcheng').val()
    if(danweimingcheng == ""){
        myAlter("单位名称不能为空")
        return
    }

    //获取所属区域
    var suoshuquyu = $('.suoshuquyu').val()
    if(suoshuquyu == ""){
        myAlter("所属区域不能为空")
        return
    }

    //获取单位类型
    var danweileixingtext = $("#danweileixing").find("option:selected").text();
    var danweileixingval = $("#danweileixing").val();
    if(danweileixingval ==""){
        myAlter("单位类型不能为空")
        return
    }

    //获取项目名称
    var xiangmumingcheng = $('#xiangmumingcheng').val();
    if(xiangmumingcheng == ""){
        myAlter("项目名称不能为空")
        return
    }

    //获取合作方式
    var hezuofangshitext = $("#hezuofangshi").find("option:selected").text();
    var hezuofangshival = $("#hezuofangshi").val();
    var hezuofangshiattr = $("#hezuofangshi").find("option:selected").attr('cstFlag');
    var epctext = "";
    var epcval = "";
    var epcattr = "";
    var xiangmuleixingtext = "";
    var xiangmuleixingval = "";
    if(hezuofangshiattr == undefined){
        myAlter("请选择合作方式")
            return
    }
    if(hezuofangshiattr == 1){

        //获取epc类型
        var epctext = $("#epcleixing").find("option:selected").text();
        var epcval = $("#epcleixing").val();
        var epcattr = $("#epcleixing").find("option:selected").attr('itemKey');
        if(epcval == "" || epcval == undefined){
            myAlter("请选择epc类型")
            return
        }
    }else{

        //获取项目类型
        var xiangmuleixingtext = $("#xiangmuleixing").find("option:selected").text();
        var xiangmuleixingval = $("#xiangmuleixing").val();
        if(xiangmuleixingval == ""){
            myAlter("请选择项目类型")
            return
        }
    }

    //获取改造面积
    var gaizaomianji = $("#gaizaomianji").val();
    if(gaizaomianji == ""){
        myAlter("改造面积不能为空")
        return
    }

    //获取投资额度
    var touzie = $("#touzie").val();
    if (touzie == "") {
        myAlter('投资额不能为空')
        return
    }
    //获取实施单位
    var shishidanwei = $("#shishidanwei").val();
    if(shishidanwei == ""){
        myAlter('实施单位不能为空')
        return
    }

    //获取签约节能率
    var qianyuejienenglv = $("#qianyuejienenglv").val();
    if(qianyuejienenglv == ""){
        myAlter('签约节能率不能为空')
        return
    }

    //获取采购计划下达时间
    var caigoujihuaxiadashijian = $("#caigoujihuaxiadashijian").val();
    if(caigoujihuaxiadashijian == ""){
        myAlter('采购计划时间不能为空')
        return
    }

    //获取招标时间
    var zhaobiaoshijian = $("#zhaobiaoshijian").val();
    if(zhaobiaoshijian == ""){
        myAlter('招标时间不能为空')
        return
    }

    //获取合同时间
    var hetongshijian = $("#hetongshijian").val();
    if(hetongshijian == ""){
        myAlter('合同时间不能为空')
        return
    }

    //获取验收时间
    var yanshoushijian = $("#yanshoushijian").val();
    if(yanshoushijian == ""){
        myAlter('验收时间不能为空')
        return
    }

    //获取关联建筑
    var guanlianjianzhu = $("#guanlianjianzhu").val();
    // if(guanlianjianzhu == ""){
    //     myAlter('关联建筑不能为空')
    //     return
    // }

    //获取项目实施进度
    var xiangmushishijindutext = $("#xiangmushishijindu").find("option:selected").text();
    var xiangmushishijinduval = $("#xiangmushishijindu").val();
    if(xiangmushishijinduval == ""){
        myAlter("项目实施进度不能为空");
        return
    }

    //获取备注
    var beizhu = $("#beizhu").val();

    //获取附件
    var fujian = _my_postKnowLedgeFileArr;

    // POST /api/ProvincialProject/AddProjRemouldInfo
    $.ajax({
        type:'post',
        url:_urls + 'ProvincialProject/AddProjRemouldInfo',
        data:{
            //当前用户
            userID:_userIdNum,
            //当前用户名
            userName:_userIdName,
            //当前角色
            b_UserRole:_userRole,
            //当前用户所属部门
            b_DepartNum:_maintenanceTeam,
            //当前单位名称
            f_UnitName: danweimingcheng,
            //当前所属区域
            f_DistrictID: suoshuquyu,
            //当前单位类型
            f_PointerClass: danweileixingval,
            //当前项目名称
            f_ProjName: xiangmumingcheng,
            //当前合作方式
            f_ProjCollaborate: hezuofangshival,
            //当前项目类型
            fK_ProjRemouldMode: xiangmuleixingval,
            //当前epc类型
            f_ProjEPCType: epcval,
            //当前改造面积
            f_RemouldArea: gaizaomianji,
            //当前投资额
            f_Investment: touzie,
            //当前实施单位
            f_ImplementUnit: shishidanwei,
            //当前签约节能率
            f_EnergySaving: qianyuejienenglv,
            //当前采购计划下达时间
            f_ProcurementDT: caigoujihuaxiadashijian,
            //当前招标时间
            f_TenderDT: zhaobiaoshijian,
            //当前合同时间
            f_ContractDT: hetongshijian,
            //当前验收时间
            f_CheckAcceptDT: yanshoushijian,
            //关联建筑
            f_RelatePointer: guanlianjianzhu,
            //当前项目实施进度
            f_ProjSchedule: xiangmushishijinduval,
            //当前备注
            f_Mark: beizhu,
            //当前上传附件集合
            projRemouldFiles: fujian
        },
        timeout:_theTimes,
        success:function(res){
            // 99表示成功，3表示失败,1表示参数不正确，2名称重复
            if(res.code == 99){
                myAlter(res.data)
                $("#myModal").modal('hide');
            }else if(res.code == 3){
                myAlter("创建失败")
            }else if(res.code == 1){
                myAlter("参数填写错误，请检查！")
            }else if(res.code == 2){
                myAlter("项目名称重复,请修改后重试")
            }else{
                myAlter("网络错误...")
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log('error')
            var info = JSON.parse(jqXHR.responseText).message;
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter(info);
            }

        }

    })

});




// var dataobj = {
//         pK_ProjRemouldInfo(integer, optional): ID,
// }

// {
//         userName(string, optional): 用户姓名,
//         userID(string, optional): 用户ID， 只为传值， 添加， 修改， 删除时要传此值,
//         b_DepartNum(string, optional): 当前用户的部门
//         b_UserRole(string, optional): 用户角色,
//         f_UnitName(string, optional): 单位名称,
//         f_DistrictID(string, optional): 所属区域,
//         f_PointerClass(integer, optional): 单位类型,
//         f_ProjName(string, optional): 项目名称,
//         f_ProjCollaborate(string, optional): 合作方式,
//         fK_ProjRemouldMode(integer, optional): 项目类型,
//         f_ProjEPCType(string, optional): EPC类型,
//         f_RemouldArea(number, optional): 改造面积,
//         f_Investment(number, optional): 投资额,
//         f_ImplementUnit(string, optional): 实施单位,
//         f_EnergySaving(number, optional): 签约节能,
//         f_ProcurementDT(string, optional): 采购计划下达时间, 日期转字符串,
//         f_TenderDT(string, optional): 招标时间, 日期转字符串,
//         f_ContractDT(string, optional): 合同时间, 日期转字符串,
//         f_CheckAcceptDT(string, optional): 验收时间, 日期转字符串,
//         f_ProjSchedule(string, optional): 项目实施进度,
//         f_Mark(string, optional): 备注,
//         projRemouldFiles(Array[ProjRemouldFile], optional): 上传文件集合,
//         f_RelatePointer (string, optional): 关联建筑 ,
// }




// districtID (string, optional): 区域ID ,
// districtName (string, optional): 区域名 ,
// subDisID (string, optional): 扩展的子区域ID ,
// pubClassID (string, optional): 行业类型分类ID ,
// pointerID (integer, optional): 楼宇ID ,
// pointerName (string, optional): 楼宇名 ,
// enterpriseID (integer, optional): 单位ID ,
// eprName (string, optional): 单位名 ,
// coefficient (number, optional): 面积 ,
// pointerClass (integer, optional): 楼宇分类ID ,
// className (string, optional): 楼宇分类名 ,
// latitude (number, optional): 纬度 ,
// longitude (number, optional): 经度 ,
// pointerStatus (integer, optional): 实在地图上显示 ,
// peopleNum (integer, optional): 楼宇人数 ,
// recyclableEnergy (integer, optional): 青岛ptflag1 ,
// pointerType (integer, optional): 建筑类型 ptflag2(1或0:普通建筑;2:供电所 变电站之类;) ,
// scoutID (integer, optional): 排序 ,
// isStandard (boolean, optional): 是否标杆建筑 ,
// buildYear (string, optional): 建筑年代 ,
// upFloor (integer, optional): 建筑楼层 ,
// linkmanName (string, optional): 联系人 ,
// linkmanPhone (string, optional): 联系人电话 ,
// recCount (integer, optional): 采集器数量 ,
// f_BedsNum (integer, optional): 床位 ,
// airArea (number, optional): 空调面积 ,
// pointerAddr (string, optional): 楼宇地址

function myAlter(string){
    $('#my-alert').modal('show');
    $('#my-alert p b').html(string);
}


// 获取所有项目列表
function getallxiangmuliebiao(argument) {
    var url = _urls + "ProvincialProject/GetOneProjRemouldMode?collaborateWay="+id;
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            // console.log(res,'根据合作id获取所有项目类型')
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }
            if(res.code == 99){
                // console.log(res,'所有项目类型')
                var data = res.data;
                var optionstring = "";
                $.each(data,function(key,value){  //循环遍历后台传过来的json数据
                    optionstring += "<option suoshuid=\"" + value.fK_CollaborateWay  + "\" value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
                });
                if(data == ""){
                    //项目类型的星号清除掉
                    $('.xiangmuleixingxingxing').css('visibility','hidden');
                    $("#xiangmuleixing").html("");
                    $('#xiangmuleixing').attr("disabled",true);
                    // $('#areaSelect').attr("disabled",false);
                    // $('#areaSelect').removeAttr("disabled");
                }else{
                    $('.xiangmuleixingxingxing').css('visibility','visible');
                    $("#xiangmuleixing").html("<option value=''>请选择项目类型</option> "+optionstring); //获得要赋值的select的id，进行赋值
                    $('#xiangmuleixing').attr("disabled",false);
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}


// 生成表格
function _my_creatTableData( arr ){
    $('#xiangmubiaoge').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页  共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'B<"clear">lfrtip',
        'buttons': [

        ],
        //'ajax':'./work_parts/data/assetsbrow.json',
        "columns": [
            // {
            //     title:'项目名称',
            //     data:'f_ProjName',
            //     // class:'hidden',
            //     render:function(data, index, row, meta){
            //         return '00' + meta.row;
            //     }
            // },
            {
                title:'项目ID',
                data:'pK_ProjRemouldInfo',
                class:'hidden',
                render:function(data, index, row, meta){
                    return data;
                }
            },
            {
                title:'项目名称',
                data:'f_ProjName'
            },
            {
                title:'单位名称',
                data:'f_UnitName',
                // class:'hidden'
            },
            {
                title:'合作方式',
                data:'f_ProjCollaborate',
                render:function(data, index, row, meta){
                    return getHezuofangshiByItemKey( data )
                }
            },
            {
                title:'改造面积(平方米)',
                data:'f_RemouldArea'
            },
            {
                title:'合同时间',
                data:'f_ContractDT'
            },
            {
                title:'投资额(万元)',
                data:'f_Investment'
            },
            {
                title:'实施单位',
                data:'f_ImplementUnit'
            },
            {
                title:'项目进度',
                data:'f_ProjSchedule',
                render: function(data, index, row, meta){
                    return getXiangmujinduByItemKey( data )
                }
            },
            // {
            //     title:'附件个数',
            //     data:'knowLedgeFiles',
            //     render:function(data, type, row, meta){

            //         var length = data.length;

            //         return length;
            //     }

            // },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
            }
        ],
        data: arr
    });

}

$("ul.xiangmu-a li button.chaxun").click(function() {
    var xiangmumingchengselect = $("#xiangmumingchengselect").val();
    // POST /api/ProvincialProject/GetProjRemouldInfoByName
    var url = _urls + "ProvincialProject/GetProjRemouldInfoByName";
    $.ajax({
        type: "post",
        cache: false,
        url: url,
        data: {
            f_ProjName: xiangmumingchengselect
        },
        success: function (res) {
            if(res.code == 99){
                setTableData(res.data)
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
});

function setTableData( arr ) {
    hh.data.tableData = arr;
    _my_creatTableData( arr )
}


//查看项目
$('#xiangmubiaoge tbody').on('click','.option-see',function(data, index){
    //获取当前项目在后台id
    var _postID = $(this).parents('tr').find('td').eq(0).html();
    console.log(_postID)
});



function startEdite(){
    var data = hh.cache.itemdata;
    if(!data){
        myAlter("没有找到该条数据,请刷新后重试")
        return 
    }
    console.log(data)
}

//删除项目
$('#xiangmubiaoge tbody').on('click','.option-delete',function(data, index){
    //获取当前项目在后台id
    var _postID = $(this).parents('tr').find('td').eq(0).html();
    console.log(_postID)
});



function getXiangmuInfoByID( id ) {
    if(hh.data.tableData){
        for (var i = 0; i < hh.data.tableData.length; i++) {
            var item = hh.data.tableData[i];
            if(item.pK_ProjRemouldInfo == id){
                return item;
            }
        }
    }
    return null;
}









