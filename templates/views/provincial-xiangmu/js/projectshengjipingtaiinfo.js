var xiangmuleixinglist = null;
var xiangmuleixinglisttext = null;
var xiangmualldata = [];
var xiangmuEnd = [];
var xiangmuStart = [];
var numtongji = [];
var areastongji = [];
var bottomCharts = null;
var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var xiangmu_urls = sessionStorage.getItem("apiprovincialproject");

//获取单位类型
var danweileixinglist = null;
getdanweileixinglist()

function getdanweileixinglist() {
    $.ajax({
        type: "GET",
        cache: false,
        url: xiangmu_urls + 'ProvincialProject/GetAllProjRemouldMode',
        success: function(res) {
            if (res.code == 99) {
                danweileixinglist = res.data;
            }
            if (res.code == 3) {
                myAlter(res.message)
            }
            if (res.code == 1) {
                myAlter(res.message || "参数填写错误，请检查！")
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}

//获取epc类型
var epcleixinglist = null;
getALLProvincProjEPCType();
function getALLProvincProjEPCType() {
    var url = xiangmu_urls + "ProvincialProject/GetALLProvincProjEPCType";
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 99){
                var data = res.data;
                if(data == ""){

                }else{
                    epcleixinglist = data;
                }
                
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


function getSearchObj(){
    var  qs = location.search.length>0 ? location.search.substr(1):'',
    args = {},  
    items = qs.length>0 ? qs.split('&'):[],
    item = null,name = null,value = null,i = 0,len = items.length;

    for(i = 0;i < len; i++){
        item = items[i].split('=');
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);

        if(name.length){
            args[name] = value;
        }
    }

    return args;
}

$(function() {
    //先获取所有改造方式*项目类型
    // GET /api/ProvincialProject/GetAllProjRemouldMode
    getAllxiangmuleixinglist( function(){
        var data = getSearchObj();
        var typeid = data.typeid||0
        if(typeid != 0){
            //代表传值过来了
            $('#gaizaofangshilist').val( typeid )
            // $('#selectBtn').click()
            searchId(data.csid)
        }else{
            getProjectByType(undefined, 0, "", "", null, function() {
                //echart初始化
                creatCharts()
                $('.startss').click()
            })
        }
    })

    validformzuixiaozhi()

    function searchId(id){
        xiangmualldata = [];
        xiangmuEnd = [];
        xiangmuStart = [];
        numtongji = [];
        areastongji = [];
        $('#shaixuan').children().removeClass('active');
        var gzfstype = $('#gaizaofangshilist').val();
        var min = $('#touzimin').val() || "";
        var max = $('#touzimax').val() || "";
        var url = 'GetAllChildProjRemouldInfoQuery';
        getProjectByType(id, gzfstype, min, max, url, function() {
            creatChartsByOption()
            $('.startss').click()
        })
    }
    //先查询所有数据
    $('#selectBtn').click(function() {
        // 查询事件

        var min = $('#touzimin').val() || "";
        var re = /^[0-9]+.?[0-9]*$/;
        if (min!="" && !re.test(min)) {
            myAlter("投资额请输入数字");
    　　　　return false;
    　　}
        var max = $('#touzimax').val() || "";
        if (max!="" && !re.test(max)) {
            myAlter("投资额请输入数字");
    　　　　return false;
    　　}
        xiangmualldata = [];
        xiangmuEnd = [];
        xiangmuStart = [];
        numtongji = [];
        areastongji = [];
        $('#shaixuan').children().removeClass('active');
        $('#shaixuan').children().eq(0).addClass('active')
        var gzfstype = $('#gaizaofangshilist').val();
        
        var data = getSearchObj();
        var typeid = data.typeid||0
        if(typeid != 0){
            searchId(data.csid)
        }
    });

    //筛选
    $('#shaixuan').on('click', '.startss', function(data, index) {
        _my_creatTableData(xiangmuStart)
    })
    //筛选
    $('#shaixuan').on('click', '.endss', function(data, index) {
        _my_creatTableData(xiangmuEnd)
    })

    $('#xiangmubiaoge tbody').on('click', '.xiangmuname', function(data, index) {

        var id = $(this).parents('tr').find('td').eq(0).html();
        getProItemData(id, function(data) {
            $('#see-Modal input').attr('disabled', 'disabled')
            $('#see-Modal textarea').attr('disabled', 'disabled')
            var datainfo = data[0];
            $('.L-container').showLoading();
            //模态框
            _moTaiKuang($('#see-Modal'), '查看', '', '', '', '确认');
            $('.L-container').hideLoading();
            //类
            $('#see-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');
            //单位名称
            $('#see-danweimingcheng').val(datainfo.f_UnitName)
            //所属区域
            $('#see-suoshuquyu').val(datainfo.districtName)
            // 单位类型
            // var danweitext = getdanweileixingtextByid(datainfo.f_PointerClass)
            $("#see-danweileixing").val(datainfo.pointerClass);
            //项目名称
            $("#see-xiangmumingcheng").val(datainfo.f_ProjName)
            //合作方式
            $("#see-hezuofangshi").val(datainfo.projCollaborateName);
            //项目类型
            // fK_ProjRemouldMode
            $('#see-xiangmuleixing').val('')

            //当前改造面积
            $('.gaizaomianji').val(datainfo.f_RemouldArea || "")
            //当前投资额
            $('.touzie').val(datainfo.f_Investment || "")
            //当前实施单位
            $('.shishidanwei').val(datainfo.f_ImplementUnit || "")
            //当前签约节能率
            $('.qianyuejienenglv').val(datainfo.f_EnergySaving || "")
            //当前采购计划下达时间
            $('.caigoujihuaxiadashijian').val(datainfo.f_ProcurementDT.split(" ")[0] || "")
            //当前招标时间
            $('.zhaobiaoshijian').val(datainfo.f_TenderDT.split(" ")[0] || "")
            //当前合同时间
            $('.hetongshijian').val(datainfo.f_ContractDT.split(" ")[0] || "")
            //当前验收时间
            $('.yanshoushijian').val(datainfo.f_CheckAcceptDT.split(" ")[0] || "")
            //关联建筑
            $('.guanlianjianzhu').val(datainfo.f_RelatePointer || "")
            //当前项目实施进度
            var xiangmushishijindutext = getXiangmujinduByItemKey(datainfo.f_ProjSchedule);
            $('.xiangmushishijindu').val(xiangmushishijindutext)
            //当前备注
            $('.beizhu').val(datainfo.f_Mark || "")

            // //epc类型
            // var epctext = getEpcTextByItemkey(datainfo.f_ProjEPCType);
            // $('.see-epcleixing').val(epctext || "");
            callbackHell(datainfo)
            // if(epctext == ""){
            //     //如果epc类型是空的就把星星去掉
            //     $('.see-epcleixing').prev().children(".redxing").html('')
            // }else{
            //     $('.see-epcleixing').prev().children(".redxing").html('*')
            // }
            // 项目类型
            var xmlx = getxiangmuleixingtextByid(datainfo.f_ProjCollaborate)
            var xuangmuleixingtext = datainfo.projRemouldModeName
            $('.see-xiangmuleixing').val(xuangmuleixingtext)
            //单位名称
            $('.danweimingcheng').val(datainfo.f_UnitName)
            $('.suoshuquyu').val(datainfo.districtName)

            var _postKnowLedgeFileArr = datainfo.projRemouldFiles;
            var imgaarr = _postKnowLedgeFileArr;
            var $list = $("#fujianlist");
            $list.html("")
            for (var i = 0; i < imgaarr.length; i++) {
                var item = imgaarr[i];
                //类型
                var type = item.f_FileExtension;
                //路径
                var lujing = item.f_FileAllPath;
                //上传时间
                var time = item.f_UploadDT;
                //文件大小
                var size = item.f_FileSize;
                //文件名字
                var name = item.f_FileName;
                var $li = $(
                    '<div id="' + '' + '" class="file-item thumbnail col-md-4">' +
                    '<img class="yulan">' +
                    '<div class="info">' + name + '</div>' +
                    '<div><img class="tupiandiv  downloadwenjian img-responsive center-block" src="./img/xiazai.png" title="点击可以下载" data-myurl="'+ item.f_FileAllPath +'"/></div>' +
                    '</div>'
                );

                var $img = $li.find('img.yulan');
                if (type == "JPG" || type == "JPEG" || type == "PNG" || type == "jpg" || type == "jpeg" || type == "png") {
                    $img.attr('src', lujing);
                } else {
                    $img.attr('src', './img/weizhi.jpg');
                }
                // $list为容器jQuery实例
                $list.append($li);
            }
        })
    })

    $('#fujianlist').on('click', '.downloadwenjian', function() {
        var url = $(this).attr('data-myurl')
        var $eleForm = $("<form method='get' target='_blank'></form>");
        $eleForm.attr("action", url);
        $(document.body).append($eleForm);
        $eleForm.submit();
    });

    $("#xiangmuzhanbi").change(function() {
        creatChartsByOption()
    })
    // $("#touzimin").keyup(function(){
    //     var val = $('.touzimin').val();
    //     var reg = /^d*(?:.d{0,2})?$/;
    //     if(!reg.test(val)){
    //         $('.touzimin').val('')
    //     }

    // });
})

function getProjectByType(f_DistrictID, fK_ProjRemouldMode, f_InvestmentMin, f_InvestmentMax, url, callback) {
    var dataurl = xiangmu_urls + "ProvincialProject/GetProjRemouldInfoQuery";
    if(url){
        dataurl = xiangmu_urls + "ProvincialProject/GetAllChildProjRemouldInfoQuery";
    }

    xiangmualldata = [];
    xiangmuEnd = [];
    xiangmuStart = [];

    if (!f_InvestmentMin) {
        f_InvestmentMin = "";
    }

    if (!f_InvestmentMax) {
        f_InvestmentMax = "";
    }

    if (f_DistrictID === undefined) {
        var quyuid = window.sessionStorage.enterpriseID;
        var resetObj = resetData(quyuid);
        if (resetObj == null) {
            myAlter("没有找到此单位,无法获取所属区域id")
        }
        f_DistrictID = resetObj.districtID
    }


    var data = {
        f_DistrictID: f_DistrictID,
        fK_ProjRemouldMode: fK_ProjRemouldMode,
        f_InvestmentMin: f_InvestmentMin,
        f_InvestmentMax: f_InvestmentMax
    }
    $.ajax({
        type: 'post',
        cache: false,
        url: dataurl,
        data: data,
        success: function(res) {
            if (res.code == 99) {
                var data = res.data;
                if (data == "") {
                    _my_creatTableData([])
                    creatChartsByOption()
                    myAlter(res.message)
                } else {
                    // 非已经实施项目列表 ,
                    var shishistart = data.noExecutedProjs;
                    var shishiend = data.executedProjs
                    var alldata = shishistart.concat(shishiend);

                    //图标数据
                    //按合作方式进行项目个数统计 ,
                    numtongji = data.projRemouldInfoNums;
                    areastongji = data.projRemouldInfoAreas;

                    xiangmualldata = alldata;
                    xiangmuEnd = data.executedProjs;
                    xiangmuStart = data.noExecutedProjs;

                    _my_creatTableData(alldata)
                    if (callback) {
                        callback()
                    }
                }
            }
            if (res.code == 3) {
                myAlter(res.message)
            }
            if (res.code == 1) {
                myAlter(res.message || "参数填写错误，请检查！")
            }
        }.bind(this),
        error: function(jqXHR, textStatus, errorThrown) {
            var info = JSON.parse(jqXHR.responseText).message;
            if (textStatus == 'timeout') { //超时,status还有success,error等值的情况
                myAlter("超时");
            } else {
                myAlter(info);
            }

        }
    })
}

// 获取所有项目类型
function getAllxiangmuleixinglist( callback) {
    var callback = callback;
    var url = xiangmu_urls + "ProvincialProject/GetAllProjRemouldMode";
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function(res) {
            if (res.code == 99) {
                xiangmuleixinglist = res.data;
                var arr = [];
                for (var i = 0; i < xiangmuleixinglist.length; i++) {
                    var item = xiangmuleixinglist[i]['projRemouldModes'];
                    if(item&&item.length>0){
                        for (var k = 0; k < item.length; k++) {
                            arr.push(item[k])
                        }
                    }
                }
                xiangmuleixinglisttext = arr;
                var list = res.data;
                var optionstring = "<option value='0' >全部</option>";
                for (var i = 0; i < list.length; i++) {
                    var item = list[i]['projRemouldModes']||[];
                    for (var j = 0; j < item.length; j++) {
                        var obj = item[j];
                        optionstring += "<option value=\"" + obj.pK_ProjRemouldMode + "\" >" + obj.f_RemouldName + "</option>";
                    }
                }
                $('#gaizaofangshilist').html(optionstring)
                if(callback){
                    callback()
                }
            }
            if (res.code == 3) {
                myAlter(res.message)
            }
            if (res.code == 1) {
                myAlter(res.message || "参数填写错误，请检查！")
            }

        }.bind(this),
        error: function(xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}

function resetData(id) {
    var alldata = JSON.parse(window.sessionStorage.pointers);
    var len = alldata.length;
    for (var i = 0; i < len; i++) {
        var item = alldata[i];
        if (item.enterpriseID == id) {
            return item;
        }
    }
    return null;
}

function myAlter(string) {
    $('#my-alert').modal('show');
    $('#my-alert p b').html(string);
}


// 生成表格
function _my_creatTableData(arr) {
    $('#xiangmubiaoge').DataTable({
        "autoWidth": false, //用来启用或禁用自动列的宽度计算
        "paging": true, //是否分页
        "destroy": true, //还原初始化了的datatable
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
            'paginate': {
                "previous": "上一页",
                "next": "下一页",
                "first": "首页",
                "last": "尾页"
            }
        },
        // "dom":'B<"clear">lfrtip',
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        'buttons': [

        ],
        "columns": [{
            title: '项目ID',
            data: 'pK_ProjRemouldInfo',
            class: 'hidden',
            render: function(data, index, row, meta) {
                return data;
            }
        }, {
            title: '项目名称',
            data: 'f_ProjName',
            render: function(data, index, row, meta) {
                return "<a class='xiangmuname'>" + data + "</a>"
            }
        }, {
            title: '单位名称',
            data: 'f_UnitName',
        }, 
        {
            title: '所属区域',
            data: 'districtName'
        },
        {
            title: '项目类型',
            data: 'fK_ProjRemouldMode',
            render: function(data, index, row, meta) {
                return getxiangmuleixingtextByid(data)
            }
        }, {
            title: '改造面积(平方米)',
            data: 'f_RemouldArea'
        }, {
            title: '合同时间',
            data: 'f_ContractDT',
            render: function(data, index, row, meta) {
                return data.split(" ")[0]
            }
        }, {
            title: '投资额(万元)',
            data: 'f_Investment'
        }, {
            title: '实施单位',
            data: 'f_ImplementUnit'
        }],
        data: arr
    });
}

//根据 itemkey 获取项目进度的对应名称
function getXiangmujinduByItemKey(itemkey) {
    if (xiangmushishijindulist) {
        for (var i = 0; i < xiangmushishijindulist.length; i++) {
            var item = xiangmushishijindulist[i];
            if (item.itemKey == itemkey) {
                return item.cstName
            }
        }
    }
    return itemkey
}

//获取项目实施进度
var xiangmushishijindulist = null;
getxiangmushishijindu();

function getxiangmushishijindu() {
    $.ajax({
        type: "GET",
        cache: false,
        url: xiangmu_urls + 'ProvincialProject/GetAllProjSchedule',
        success: function(res) {
            if (res.code == 99) {
                xiangmushishijindulist = res.data;
            }
            if (res.code == 3) {
                myAlter(res.message)
            }
            if (res.code == 1) {
                myAlter(res.message || "参数填写错误，请检查！")
            }
        }.bind(this),
        error: function(xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}

// 获取项目类型描述byid
function getXiangmutextById(id) {
    if (xiangmuleixinglist) {
        for (var i = 0; i < xiangmuleixinglist.length; i++) {
            var item = xiangmuleixinglist[i];
            if (item.pK_ProjRemouldMode == id) {
                return item.f_RemouldName
            }
        }
    }
    return id;
}

function creatCharts() {
    // var dom = document.getElementById("container");
    // var myChart = echarts.init(dom);
    var app = {};
    var option = {
        title: {
            text: '项目图表',
            subtext: '',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",

        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: '60%',
            center: ['50%', '60%'],
            data: [],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    var alldata = numtongji;
    option['legend']['data'] = []
    option['series'][0]['data'] = []
    for (var i = 0; i < alldata.length; i++) {
        var item = alldata[i];
        option['legend']['data'][i] = item.projCollaborateName;

        option['series'][0]['data'][i] = {};
        var opstSerData = option['series'][0]['data'][i];
        opstSerData['value'] = item.projNum;
        opstSerData['name'] = item.projCollaborateName;

    }

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function creatChartsByOption() {
    var value = $('#xiangmuzhanbi').val();
    var app = {};
    var option = {
        title: {
            text: '项目图表',
            subtext: '',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",

        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: '60%',
            center: ['50%', '60%'],
            data: [],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };


    if (value == 0) {
        //按个数画图
        var alldata = numtongji;
        option['legend']['data'] = []
        option['series'][0]['data'] = []
        for (var i = 0; i < alldata.length; i++) {
            var item = alldata[i];
            option['legend']['data'][i] = item.projCollaborateName;

            option['series'][0]['data'][i] = {};
            var opstSerData = option['series'][0]['data'][i];
            opstSerData['value'] = item.projNum;
            opstSerData['name'] = item.projCollaborateName;
        }
        option['series'][0]['name'] = '项目个数'
    } else {
        //按面积画图
        var alldata = areastongji;
        option['legend']['data'] = []
        option['series'][0]['data'] = []
        for (var i = 0; i < alldata.length; i++) {
            var item = alldata[i];
            option['legend']['data'][i] = item.projCollaborateName;

            option['series'][0]['data'][i] = {};
            var opstSerData = option['series'][0]['data'][i];
            opstSerData['value'] = item.projRemouldArea;
            opstSerData['name'] = item.projCollaborateName;
        }
        option['series'][0]['name'] = '项目面积'
    }
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

//查看详细信息  getiteminfo

function getProItemData(id, callback) {
    var url = xiangmu_urls + "ProvincialProject/GetProjRemouldInfoByID/" + id;
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function(res) {
            if (res.code == 99) {
                if (res.data == "") {
                    myAlter(res.message)
                } else {
                    callback(res.data)
                }
            }
            if (res.code == 3) {
                myAlter(res.message)
            }
            if (res.code == 1) {
                myAlter(res.message || "参数填写错误，请检查！")
            }

        },
        error: function(xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
}

function getdanweileixingtextByid(id) {
    if (danweileixinglist) {
        for (var i = 0; i < danweileixinglist.length; i++) {
            var item = danweileixinglist[i];
            if (item.pK_ProjRemouldMode == id) {
                return item.f_RemouldName;
            }
        }
    }
    return id
}

function getEpcTextByItemkey(key) {
    if (key == "") {
        return key
    }
    if (epcleixinglist) {
        for (var i = 0; i < epcleixinglist.length; i++) {
            var item = epcleixinglist[i];
            if (item.itemKey == key) {
                return item.cstName;
            }
        }
    }
    return key
}


function getXmlxFromlistByID(id) {
    if (id == "") {
        return id
    }
    if (xiangmuleixinglist) {
        for (var i = 0; i < xiangmuleixinglist.length; i++) {
            var item = xiangmuleixinglist[i]
            if (item.pK_ProjRemouldMode == id) {
                return item.f_RemouldName;
            }
        }
    }
    return id
}


function callbackHell(info){
    // GET /api/ProvincialProject/GetProjRemouldModeByID/
    var attr = $(".see-hezuofangshi").find("option:selected").attr('cstFlag');
    var val = $(".see-hezuofangshi").val();
    var infodata = info;
    //attr == 1 代表选中了epc类型是
    var url = xiangmu_urls + "ProvincialProject/GetOneProjRemouldMode?collaborateWay="+val;
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
                // if(data == ""){
                //      myAlter("此合作方式项目类型为空,请更换合作方式")
                // }
                $.each(data,function(key,value){
                    optionstring += "<option suoshuid=\"" + value.fK_CollaborateWay  + "\" value=\"" + value.pK_ProjRemouldMode + "\" >" + value.f_RemouldName + "</option>";
                });
                $("#xiangmuleixing").html(optionstring);
                $('#xiangmuleixing').val(infodata.fK_ProjRemouldMode)
                $('.see-epcleixing').val(getEpcTextByItemkey(infodata.f_ProjEPCType))
            }

        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
            Metronic.stopPageLoading();
            pageContentBody.html('<h4>Could not load the requested content.</h4>');
        }
    });
    if(attr == 1){
        //清除项目类型的所有值包括星星
        $('#epcleixing').attr("disabled",false);
        $('#epcleixing').prev().children(".redxing").html('*')
    }else{
        $("#epcleixing").html("");
        $('#epcleixing').attr("disabled",true);
        $('#epcleixing').prev().children(".redxing").html('')
    }
}


function getxiangmuleixingtextByid( id ){
    if (id == "") {
        return id
    }
    if(xiangmuleixinglisttext){
        for (var i = 0; i < xiangmuleixinglisttext.length; i++) {
            var item = xiangmuleixinglisttext[i]
            if (item.pK_ProjRemouldMode == id) {
                return item.f_RemouldName;
            }
        }
    }
    return id
}

function validformzuixiaozhi(){
    return $('#touzimin').validate({
        onfocusout: function(element) { $(element).valid()},
        rules:{
            //单位名称
            'pingtai':{
                required: true,
            },
        },
        messages:{
            'pingtai':{
                required: '请输入数字'
            },
        }
    });
}
