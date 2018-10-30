var xiangmuleixinglist = null;
var xiangmualldata = [];
var xiangmuEnd = [];
var xiangmuStart = [];
var numtongji = [];
var areastongji = [];
var bottomCharts = null;
$(function() {
	//先获取所有改造方式*项目类型
	// GET /api/ProvincialProject/GetAllProjRemouldMode
	getAllxiangmuleixinglist()

    getProjectByType(undefined, 0, 0, 999999,function(){
            console.log(1111)
        })
	//先查询所有数据
    $('#selectBtn').click(function(){
        // 查询事件
        var gzfstype = $('#gaizaofangshilist').val();
        var min = $('#touzimin').val() || 0;
        var max = $('#touzimax').val() || 0;;
        getProjectByType(undefined, gzfstype, min, max, function(){
            console.log(1111)
        })
    });

    //筛选
    $('#shaixuan').on('click','.startss',function(data, index){
        _my_creatTableData(xiangmuStart)
    })
    //筛选
    $('#shaixuan').on('click','.endss',function(data, index){
        _my_creatTableData(xiangmuEnd)
    })
    //echart初始化
    creatCharts()

})


function startDraw( data ){
    var echartoption = {
        title : {
            text: '筛选结果统计图',
            subtext: '针对本次筛选结果',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: data.legendData,
            selected: data.selected
        },
        series : [
            {
                name: '姓名',
                type: 'pie',
                radius : '55%',
                center: ['40%', '50%'],
                data: data.seriesData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    if (echartoption && typeof echartoption === "object") {
        myChart.setOption(echartoption, true);
    }
}


function getProjectByType( f_DistrictID, fK_ProjRemouldMode, f_InvestmentMin, f_InvestmentMax, callback){
	var url = _urls + "ProvincialProject/GetProjRemouldInfoQuery";
	// f_DistrictID (string, optional): 所属区域ID ,
	// fK_ProjRemouldMode (integer, optional): 项目类型,0表示全部 ,
	// f_InvestmentMin (string, optional): 投资额起始值 ,
	// f_InvestmentMax (string, optional): 投资额结束值

    // f_DistrictID: resetObj.districtID,

    xiangmualldata = [];
    xiangmuEnd = [];
    xiangmuStart = [];

    if(!f_InvestmentMin){
        f_InvestmentMin = 0;
    }
    f_InvestmentMin = parseFloat(f_InvestmentMin)

    if(!f_InvestmentMax){
        f_InvestmentMax = 0;
    }
    f_InvestmentMax = parseFloat(f_InvestmentMax)

    if(f_DistrictID === undefined){
        var quyuid = window.sessionStorage.enterpriseID;
        var resetObj = resetData(quyuid);
        if(resetObj == null){
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
        type:'post',
        cache: false,
        url: url,
        data:data,
        success:function(res){
            if(res.code == 99){
                var data = res.data;
                if(data == ""){
                    _my_creatTableData([])
                    myAlter(res.message)
                }else{
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
                    if(callback){
                        callback()
                    }
                }
            }
            if(res.code == 3){
                myAlter(res.message)
            }
            if(res.code == 1){
                myAlter(res.message||"参数填写错误，请检查！")
            }
        }.bind(this),
        error:function(jqXHR, textStatus, errorThrown){
            var info = JSON.parse(jqXHR.responseText).message;
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter(info);
            }

        }
    })
}

// 获取所有项目类型
function getAllxiangmuleixinglist(){
    var url = _urls + "ProvincialProject/GetAllProjRemouldMode";
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        success: function (res) {
            if(res.code == 99){
                xiangmuleixinglist = res.data;
                var list = res.data;
                var optionstring = "<option value='0' >全部</option>";
                for (var i = 0; i < list.length; i++) {
                	var item = list[i];
                	optionstring += "<option value=\"" + item.pK_ProjRemouldMode  + "\" >" + item.f_RemouldName + "</option>";
                }
                $('#gaizaofangshilist').html(optionstring)
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

function myAlter(string){
    $('#my-alert').modal('show');
    $('#my-alert p b').html(string);
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
        // "dom":'B<"clear">lfrtip',
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        'buttons': [

        ],
        "columns": [
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
            },
            {
                title:'项目类型',
                data:'fK_ProjRemouldMode',
                render:function(data, index, row, meta){
                    return getXiangmutextById( data )
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
            }
        ],
        data: arr
    });
}

//根据 itemkey 获取项目进度的对应名称
function getXiangmujinduByItemKey( itemkey ){
    if(xiangmushishijindulist){
        for (var i = 0; i < xiangmushishijindulist.length; i++) {
            var item = xiangmushishijindulist[i];
            if(item.itemKey == itemkey){
                return item.cstName
            }
        }
    }
    return itemkey
}

//获取项目实施进度
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
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                Metronic.stopPageLoading();
                pageContentBody.html('<h4>Could not load the requested content.</h4>');
            }
        });
    }

// 获取项目类型描述byid
function getXiangmutextById( id ){
   if(xiangmuleixinglist){
        for (var i = 0; i < xiangmuleixinglist.length; i++) {
            var item = xiangmuleixinglist[i];
            if(item.pK_ProjRemouldMode  == id ){
                return item.f_RemouldName
            }
        }
   }
   return id;
}


function startWriteData(){
    
}


function creatCharts(){

    var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    var app = {};
    var option = {
        title : {
            text: '项目图表',
            subtext: '',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",

        },
        legend: {
            orient: 'vertical',
            x:'left',
            data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '75%',
                center: ['60%', '60%'],
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}