var PlanPublish = function () {

    //条件刷新标识
    var _isReloadData = false;

    //记录当前选中的userId
    var _thisID = '';

    //已创建列表
    planData();

    //区域下拉列表
    districtData();

    //基线下拉列表
    baseData();

    /*-----------------------------------表格初始化-------------------------------------*/

    var col=[

        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='data-option option-edit btn default btn-xs green-stripe' data-userId='" + full.accountId + "'>编辑</span>" +

                    "<span class='data-option option-shanchu btn default btn-xs green-stripe' data-userId='" + full.accountId + "'>删除</span>" +

                    "<span class='data-option option-publish btn default btn-xs green-stripe' data-userId='" + full.accountId + "'>发布</span>"

            }
        },
        {
            title:'事件名称',
            data:'planName'
        },
        {
            title:'开始时间',
            data:'startDate'
        },
        {
            title:'结束时间',
            data:'closeDate'
        },
        {
            title:'消减负荷（kWh）',
            data:'reduceLoad'
        },
        {
            title:'基线',
            data:'baselineName'
        },
        {
            title:'区域',
            data:'districtName'
        },
        {
            title:'套餐（多个）',
            data:'librarys',
            render:function(data, type, full, meta){

                var str = '';

                for(var i=0;i<data.length;i++){

                    if(i == data.length-1){

                        str += data[i].name

                    }else{

                        str += data[i].name + '、'

                    }

                }

                return str

            }
        },
        {
            title:'状态',
            data:''
        },
        {
            title:'登记时间',
            data:'createDate'
        },
        {
            title:'创建人',
            data:'createPlanUserName'
        },
        {
            title:'是否有效',
            data:'isDelName'
        },
        {
            title:'备注',
            data:'memo'
        }

    ]

    _tableInit($('#table'),col,2,true,'','','','');

    /*-----------------------------------其他方法-----------------------------------------*/

    //获取列表
    function conditionSelect(first){

        $('#theLoading').modal('show');

        if(first){

            var  prm = {

                //事件
                planId:0,
                //区域
                districtId:0,
                //基线
                baselineId:0,
                //状态
                state:0

            }

        }else{

            var  prm = {

                //事件
                planId:$('#plan-name').val(),
                //区域
                districtId:$('#plan-district').val(),
                //基线
                baselineId:$('#plan-baseline').val(),
                //状态
                state:$('#plan-state').val()

            }

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetDRPlanDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = []

                if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }else if(result.code == 0){

                    arr = result.plans;

                }

                _jumpNow($('#table'),arr);

            },

            error:_errorFun

        })


    }

    //已创建事件名称
    function planData(){

        var prm = {

            isAll:true

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetDRPlanIdns',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                var str = '';

                if(result.code == 0 || result.code == -2){

                    console.log(111);

                    for(var i=0;i<result.planIdns.length;i++){

                        str += '<option value="' + result.planIdns[i].planId + '">' + result.planIdns[i].planNt +'</option>'

                    }

                }else{

                    console.log('事件名称获取失败');

                }

                $('#plan-name').empty().append(str);

            },

            error:_errorFun1

        })


    }

    //获取区域
    function districtData(){

        var prm = {

            isAll:true

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetTakeInDRPlanDistrictDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                var str = '';

                if(result.code == 0 || result.code == -2 ){

                    for(var i=0;i<result.districtIdns.length;i++){

                        str += '<option value="' + result.districtIdns[i].id + '">' + result.districtIdns[i].name +'</option>'

                    }

                }else{

                    console.log('区域获取失败');

                }

                $('#plan-district').empty().append(str);

            },

            error:_errorFun

        })

    }

    //获取基线
    function baseData(){

        var prm = {

            isAll:true

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRPlan/GetTakeInDRPlanBaselineDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                var str = '';

                if(result.code == 0 || result.code == -2 ){

                    for(var i=0;i<result.baselineIdns.length;i++){

                        str += '<option value="' + result.baselineIdns[i].id + '">' + result.baselineIdns[i].name +'</option>'

                    }

                }else{

                    console.log('区域获取失败');

                }

                $('#plan-baseline').empty().append(str);

            },

            error:_errorFun

        })

    }

    return {
        init: function () {

            //条件查询
            conditionSelect(true);

        }
    }

}();