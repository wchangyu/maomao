/**
 * Created by admin on 2017/12/19.
 */
$(function(){

    //获取员工信息
    getPersonMessage();


});

//存放返回的所有数据
var removeID = [];


var table = $('#personal-table').DataTable({
    "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": false,//还原初始化了的datatable
    "paging":false,
    "bPaginate": false,
    "ordering": false,
    'searching':true,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        'processing': '查询中...',
        'lengthMenu': '每页 _MENU_ 件',
        'zeroRecords': '没有数据',
        //'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
        'info': ' 总记录数为 _TOTAL_ 条',
        'paginate': {
            'first':      '第一页',
            'last':       '最后一页',
            'next':       '下一页',
            'previous':   '上一页'
        },
        'infoEmpty': ''
    },
    'buttons': [

    ],
    "dom":'ft<"F"lip>',
    //数据源
    'columns':[
        {
            title:'选择',
            "data": null,
            render:function(data, type, row, meta){

                return "<input type='checkbox' class='tableCheck'/>"

            }
        },
        {
            title:'编号',
            data:"index",
            render:function(data, type, row, meta){


                return meta.row + 1;

            }
        },
        {
            title:'本行ID',
            data:"lmid",
            class:'theHidden'
        },
        {
            title:'员工姓名',
            data:"lmName"
        },
        {
            title:'联系电话',
            data:"lmmp",
            render:function(data, type, full, meta){
                if(!data){
                    return '';
                }
                if(data.length > 12){
                    return '<span title="'+data+'">'+data.substring(0,12)+'...</span>'
                }else{
                    return '<span title="'+data+'">'+data+'</span>'
                }


            }
        },
        {
            title:'所属单位',
            data:"lmEprName"
        }

    ]
});

//_table = $('#dateTables').dataTable();

/*---------------------------------otherFunction------------------------------*/


//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPersonMessage(){

    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'Alarm/GetNoteLinkMans',
        beforeSend: function () {

            $('#theLoading').modal('show');
        },
        complete: function () {
            $('#theLoading').modal('hide');
        },
        success:function(result){
            $('#theLoading').modal('hide');

            //console.log(result);

            //判断是否返回数据
            if(result == null){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'无数据', '');

                return false;

            }

            console.log(result.length);

            //表格赋值
            _datasTable($('#personal-table'),result);

        },
        error:function(jqXHR, textStatus, errorThrown){

            $('#theLoading').modal('hide');

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');

            }else{

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');

            }


        }
    })
};

//获取传递给后台的数据 用于新增 修改
function getPostData(dom){

    //获取楼宇ID
    var pointerID = dom.find('.belong-building').attr('data-num');

    //获取支路ID
    var branchID = dom.find('.belong-brach').attr('data-num');

    //获取能耗类型
    var energyType  = dom.find('.belong-brach').attr('energy-type');

    var postPrm = {

        "index": 0,

        "pK_EnergyProj": 0,
        //合同名称
        "f_ProjectName": dom.find('.pact-name').val(),
        //合同编号
        "f_ProjectNum": dom.find('.pact-num').val(),
        //改造方式
        "f_RemouldWay": dom.find('.change-way').val(),
        //合同金额
        "f_ProjectPrice": dom.find('.pact-money').val(),
        //实施内容
        "f_ProjectContent": dom.find('.improve-content').val(),
        //开始时间
        "f_StartDate": dom.find('.startDate').val(),
        //结束时间
        "f_EndDate": dom.find('.endDate').val(),
        //验收时间
        "f_CheckAcceptDate": dom.find('.check-date').val(),
        //责任部门
        "f_Department": dom.find('.duty-department').val(),
        //责任人
        "f_DirectorName": dom.find('.duty-people').val(),
        //责任人电话
        "f_DepartmentPhone": dom.find('.department-phone').val(),
        //实施主体
        "f_Executor": dom.find('.implement-subject').val(),
        //联系人
        "f_ExecutorName": dom.find('.link-man').val(),
        //联系电话
        "f_ExecutorPhone": dom.find('.link-phone').val(),
        //能耗类型
        "f_EnergyType": energyType,
        //楼宇和支路
        "energyProjPointers": [
            {
                "f_PointerID": pointerID,
                "energyProjBranchs": [
                    {
                        "f_BranchID": branchID
                    }
                ]
            }
        ],
        "userID": _userIdNum
    };

    return postPrm;
};

//根据ID获取一条数据 用于编辑
function getOneMessage(id,dom){

    var ecParams = {

        'PK_EnergyProj' : id
    };

    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'EnergySavTrackV2/GetProjManageByID',
        data:ecParams,
        timeout:_theTimes,
        success:function(result){
            $('#theLoading').modal('hide');

            console.log(result);

            //判断是否返回数据
            if(result == null || result.length == 0){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'数据库中无本行数据，无法编辑', '');

                return false;
            }

            //赋值
            //合同名称
            dom.find('.pact-name').val( result.f_ProjectName);
            //合同编号
            dom.find('.pact-num').val(result.f_ProjectNum);
            //改造方式
            dom.find('.change-way').val(result.f_RemouldWay);
            //合同金额
            dom.find('.pact-money').val(result.f_ProjectPrice);
            //实施内容
            dom.find('.improve-content').val(result.f_ProjectContent);
            //开始时间
            dom.find('.startDate').val( result.f_StartDate) ;
            //结束时间
            dom.find('.endDate').val(result.f_EndDate);
            //验收时间
            dom.find('.check-date').val(result.f_CheckAcceptDate);
            //责任部门
            dom.find('.duty-department').val( result.f_Department);
            //责任人
            dom.find('.duty-people').val(result.f_DirectorName);
            //责任人电话
            dom.find('.department-phone').val(result.f_DepartmentPhone);
            //实施主体
            dom.find('.implement-subject').val( result.f_Executor);
            //联系人
            dom.find('.link-man').val( result.f_ExecutorName);
            //联系电话
            dom.find('.link-phone').val(result.f_ExecutorPhone);
            //所属楼宇
            dom.find('.belong-building').val(result.energyProjPointers[0].f_PointerName);
            dom.find('.belong-building').attr('data-num',result.energyProjPointers[0].f_PointerID);
            //涉及支路
            dom.find('.belong-brach').val(result.energyProjPointers[0].energyProjBranchs[0].f_BranchName);
            dom.find('.belong-brach').attr('data-num',result.energyProjPointers[0].energyProjBranchs[0].f_BranchID);
            //能耗类型
            dom.find('.belong-brach').attr('energy-type',result.f_EnergyType);

        },
        error:function(jqXHR, textStatus, errorThrown){

            $('#theLoading').modal('hide');

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');

            }else{

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');

            }


        }
    })
};




