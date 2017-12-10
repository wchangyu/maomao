/**
 * Created by admin on 2017/11/26.
 */
$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    _timeYMDComponentsFun($('.chooseDate'));

    //时间初始化
    $('.time-options-1').click();


    //初始时间为今年
    $('.min').val(moment().format('YYYY'));

    //楼宇ztree树
    _pointerZtree = _getPointerZtree($("#allPointer"),1);

    //楼宇搜索功能
    _searchPO($(".tipess"),"allPointer");

    //默认勾选第一个楼宇
    var zTree = $.fn.zTree.getZTreeObj("allPointer");
    var nodes = zTree.getNodes();

    zTree.checkNode(nodes[0], false, false);  //父节点不被选中
    zTree.setChkDisabled(nodes[0], true); //父节点禁止勾选

    zTree.checkNode(nodes[0].children[0].children[0], true, true);

    GetAllBranches();

    ////默认加载数据
    getDingEData();

    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){
        //获得数据
        getDingEData();

    });

    //点击上方切换金额
    $('.left-middle-main p').on('click',function(){

        $('.left-middle-main p').removeClass('curChoose');

        $(this).addClass('curChoose');
    });

    //点击新增按钮时，弹出新增弹窗
    $('.top-operation .top-add').on('click',function(){

        $('#add-item').modal('show');

        //清除之前数据

        $('#add-item').find('input').val('');

    });

    //选择楼宇确定按钮
    $('#choose-building .btn-primary').on('click',function(){

        //确定楼宇id
        var pts = _pointerZtree.getSelectedPointers();

        //只能选择单个楼宇
        if(pts.length > 1){

            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'只能选择单个楼宇', '');

            return false;
        }

        if(pts.length < 1){

            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请选择楼宇', '');

            return false;
        }

        //楼宇名称
        var pointerName = pts[0].pointerName;
        //楼宇ID
        var pointerID = pts[0].pointerID;

        //赋值
        $('.in').find('.belong-building').val(pointerName);

        $('.in').find('.belong-building').attr('data-num',pointerID);

        //关闭选择楼宇弹窗
        $('#choose-building').modal('hide');
    });

    //点击选择支路图标
    $('.get-branch').on('click',function(){

        //获取楼宇信息
        var pointerName = $('.belong-building').val();

        //选择了楼宇才能选择支路
        if(pointerName != ''){

            $('#choose-branch').modal('show');
        }else{

            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请先选择楼宇', '');
        }

    });

    //改变支路弹窗中能耗类型下方支路改变
    $('#energy-type').on('change',function(){

        //获取能耗类型
        var energy = $(this).val();

        GetAllBranches(1,energy);
    });

    //选择支路确定按钮
    $('#choose-branch .btn-primary').on('click',function(){

        //确定支路id
        var nodes = branchTreeObj.getCheckedNodes(true);

        if(nodes.length < 1){

            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请选择支路', '');

            return false;
        }

        //楼宇名称
        var branchName = nodes[0].name;
        //楼宇ID
        var branchID = nodes[0].id;
        //能耗类型
        var energyType = $('#energy-type').val();

        //赋值
        $('.in').find('.belong-brach').val(branchName);

        $('.in').find('.belong-brach').attr('data-num',branchID);

        $('.in').find('.belong-brach').attr('energy-type',energyType);

        //关闭选择楼宇弹窗
        $('#choose-branch').modal('hide');
    });

    //点击新增确定按钮时
    $('#add-item .btn-primary').on('click',function(){

        //对输入内容进行验证
        if(!checkedNull1('#add-item') ||　!checkedDate('#add-item') ||　!checkedNum('#add-item') ||　!checkedPhone('#add-item')){
            return false;
        }

        //获取要传递的数据
        var postPrm = getPostData($('#add-item'));

        //给后台提交数据
        postDingEData('EnergySavTrackV2/AddEnergyProjManageData',postPrm,1);

    });

    //点击编辑按钮
    $('.top-operation .top-edit').on('click',function(){


        var length = $('#dateTables .tableCheck').length;
        //传递给后台的ID，用于查询本行数据
        var alterID = '';

        var chooseNum = 0;
        for(var i=0; i<length; i++){
            if( $('#dateTables .tableCheck').eq(i).is(':checked')){
                chooseNum ++;
            }
        }

        //判断是否勾选正确
        if(chooseNum > 1){
            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'编辑时只能勾选一项进行操作', '');

            return false;
        }else if(chooseNum == 0){
            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请勾选一项进行编辑', '');

            return false;
        }

        //获取ID
        for(var i=0; i<length; i++){

            if( $('#dateTables .tableCheck').eq(i).is(':checked')){
                //获取勾选的ID
                alterID = $('#dateTables .tableCheck').eq(i).parents('tr').find('td').eq(2).html();

            }
        }

        //给编辑选框进行赋值
        $('#alter-item').modal('show');

        getOneMessage(alterID,$('#alter-item'));

    });

    //点击编辑确定按钮时
    $('#alter-item .btn-primary').on('click',function(){

        //对输入内容进行验证
        if(!checkedNull1('#alter-item') ||　!checkedDate('#alter-item') ||　!checkedNum('#alter-item') ||　!checkedPhone('#alter-item')){
            return false;
        }

        //传递给后台的ID，用于查询本行数据
        var alterID = '';

        var length = $('#dateTables .tableCheck').length;

        //获取要传递的数据
        var postPrm = getPostData($('#alter-item'));

        //获取ID
        for(var i=0; i<length; i++){

            if( $('#dateTables .tableCheck').eq(i).is(':checked')){
                //获取勾选的ID
                alterID = $('#dateTables .tableCheck').eq(i).parents('tr').find('td').eq(2).html();

            }
        }

        postPrm.pK_EnergyProj = alterID;

        //给后台提交数据
        postDingEData('EnergySavTrackV2/UpdateEnergyProjManageData',postPrm,2);

    });

    //点击删除按钮时
    $('.top-operation .top-remove').on('click',function(){

        //清空需删除的ID列表
        removeID.length = 0;

        var length = $('#dateTables .tableCheck').length;

       //重新添加
        for(var i=0; i<length; i++){
            if( $('#dateTables .tableCheck').eq(i).is(':checked')){
                var id = $('#dateTables .tableCheck').eq(i).parents('tr').find('td').eq(2).html();

                removeID.push(id);
            }
        }

        if(removeID.length == 0){

            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请选择删除项目！', '');
            return false;
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'确定删除选中项目吗？', '确定');
    });

    //点击确定删除按钮
    $('#myModal2 .btn-primary').on('click',function(){

            //删除数据
            var ecParams = {

                "pK_EnergyProjs": removeID,
                "userID": _userIdNum
            };

            postDingEData('EnergySavTrackV2/DelEnergyProjManageData',ecParams,3);
    })

});

//存放返回的所有数据
var removeID = [];


var table = $('#dateTables').DataTable({
    "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": true,//还原初始化了的datatable
    "paging":false,
    "bPaginate": false,
    "ordering": false,
    'searching':false,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        'processing': '查询中...',
        'lengthMenu': '每页 _MENU_ 件',
        'zeroRecords': '没有数据',
        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
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
    "dom":'B<"clear">lfrtip',
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
            data:"index"
        },
        {
            title:'本行ID',
            data:"pK_EnergyProj",
            class:'theHidden'
        },
        {
            title:'名称',
            data:"f_ProjectName",
            class:'theHidden',
            render:function(data, type, full, meta){
                if(data.length > 5){
                    return '<span title="'+data+'">'+data.substring(0,5)+'...</span>'
                }else{
                    return '<span title="'+data+'">'+data.substring(0,5)+'</span>'
                }


            }
        },
        //{
        //    title:'项目名称',
        //    data:"f_ProjectName",
        //    render:function(data, type, full, meta){
        //        if(data.length > 5){
        //            return '<span title="'+data+'">'+data.substring(0,5)+'...</span>'
        //        }else{
        //            return '<span title="'+data+'">'+data+'</span>'
        //        }
        //
        //
        //    }
        //},
        {
            title:'合同编号',
            data:"f_ProjectNum",
            render:function(data, type, full, meta){
                if(data.length > 10){
                    return '<span title="'+data+'">'+data.substring(0,10)+'...</span>'
                }else{
                    return '<span title="'+data+'">'+data+'</span>'
                }


            }
        },
        {
            title:'改造方式',
            data:"f_RemouldWay",
            render:function(data, type, full, meta){
                if(!data){
                    return '';
                }

                    if(data.length > 10){
                        return '<span title="'+data+'">'+data.substring(0,10)+'...</span>'
                    }else{
                        return '<span title="'+data+'">'+data+'</span>'
                    }




            }
        },
        {
            title:'实施内容',
            data:"f_ProjectContent ",
            render:function(data, type, full, meta){
                if(!data){
                    return '';
                }
                if(data.length > 10){
                    return '<span title="'+data+'">'+data.substring(0,10)+'...</span>'
                }else{
                    return '<span title="'+data+'">'+data+'</span>'
                }


            }
        },
        {
            title:'合同金额（元）',
            data:"f_ProjectPrice"
        },
        {
            title:'开始时间',
            data:"f_StartDate",
            render:function(data, type, full, meta){

                return data.split(' ')[0]
            }
        },
        {
            title:'结束时间',
            data:"f_EndDate",
            render:function(data, type, full, meta){

                return data.split(' ')[0]
            }
        },
        {
            title:'验收时间',
            data:"f_CheckAcceptDate",
            render:function(data, type, full, meta){
                if(!data){
                    return '';
                }
                return data.split(' ')[0]
            }
        },
        {
            title:'所属楼宇',
            data:"energyProjPointers",
            render:function(data, type, full, meta){
                if(data.length == 0){
                    return '';
                }

                var pointerName = data[0].f_PointerName;

                return pointerName;

            }
        },
        {
            title:'涉及支路',
            data:"energyProjPointers",
            render:function(data, type, full, meta){
                if(data.length == 0){
                    return '';
                }

                var branchName = data[0].energyProjBranchs[0].f_BranchName;

                return branchName;

            }
        },
        {
            title:'责任部门',
            data:"f_Department",
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
            title:'责任人',
            data:"f_DirectorName",
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
            title:'联系电话',
            data:"f_DepartmentPhone",
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
            title:'实施主体',
            data:"f_Executor",
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
            title:'联系人',
            data:"f_ExecutorName",
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
            title:'联系电话',
            data:"f_ExecutorPhone",
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
            title:'操作',
            data:"pK_EnergyProj",
            render:function(data, type, full, meta){

                return '<a href="./energyConservation.html?id='+data+'" />节能量查询'
            }
        }

    ]
});

//_table = $('#dateTables').dataTable();

/*---------------------------------otherFunction------------------------------*/

//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getDingEData(){

    //获取查询金额范围
    var priceFlag = $('.left-middle-main .curChoose').attr('data-num');

    //获取开始结束时间

    var stTime = getPostTime()[0];

    var etTime = getPostTime()[1];

    var ecParams = {

        'ST' : stTime,
        'ET' : etTime,
        'priceFlag' : priceFlag
    };

    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'EnergySavTrackV2/GetEnergyProjManageData',
        data:ecParams,
        timeout:_theTimes,
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
            if(result == null || result.length == 0){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'无数据', '');

                return false;

            }
            //项目金额
            var areaName = $('.left-middle-main .curChoose').html();

            //改变头部日期
            var date = $('.min').val();

            $('.right-header-title').eq(0).html('项目金额 ' + areaName + ' &nbsp;' + date);

            //表格赋值
            _datasTable($('#dateTables'),result);

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

//新增 编辑完成 给后台提交数据
function postDingEData(url,ecParams,flag){

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + url,
        data:ecParams,
        timeout:_theTimes,
        beforeSend: function () {

        },
        complete: function () {

        },
        success:function(result){


            //console.log(result);


            if(result == 3){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'执行失败', '');
                return false;
            }
            if(result == 17){
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'过往年数据只能查询', '');
                return false;
            }
            //新增
            if(flag == 1){
                $('#add-item').modal('hide');
            }
            //编辑
            if(flag == 2){
                $('#alter-item').modal('hide');
            }
            //删除
            if(flag == 3){

                $('#myModal2').modal('hide');
            }

            //重新获取数据
            $('.buttons').children('.btn-success').click();

        },
        error:function(jqXHR, textStatus, errorThrown){

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


$('#dateTables').on('click','.data-option',function(){

    if(!$('.top-operation .top-edit').hasClass('onClick')){

        _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请点击编辑按钮进行编辑', '');
    }

    var data = $(this).parents('tr').find('.year-data').val();

    var dom = $(this).parents('tr').find('.year-data');


    //如果输入数据错误
    if(data == '' || isNaN(data) ||　data < 0){

        setTimeout(function(){

            for(var i=0; i<$('.month-data').length; i++){

                var isFocus=$('.month-data').eq(i).is(":focus");

                if(isFocus){
                    $('.month-data').eq(i).blur();
                }
            }

        },5);

        _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请输入正确数据', '');

        getFocus1(dom);

        return false;
    }

    var monthData = (data / 12).toFixed(1);

    console.log(monthData);

    //获取本行ID
    var id = $(this).parents('tr').find('.theHidden').html();

    $(postArr).each(function(i,o){
        //
        if(id == o.returnOBJID){

            var arr = [];
            for(var i=0; i<12; i++){
                arr.push(parseFloat(monthData))
            }

            o.dingEValue = arr;
            return false;
        }
    });


    //table重新赋值
    _datasTable($('#dateTables'),postArr);

    $('.month-data').removeAttr('readOnly');
    $('.month-data').removeAttr('unselectable');

});



