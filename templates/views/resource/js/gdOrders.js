$(function(){
    /*---------------------------------------------时间---------------------------------------------------*/

    //时间设置
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间（7天）
    var et = moment().format('YYYY/MM/DD');

    var st =moment().subtract(7,'d').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(st);

    $('.datatimeblock').eq(1).val(et);

    /*--------------------------------------------变量----------------------------------------------------*/
    //快速登记
    //登记vue变量
    var gdObj = new Vue({
        el:'#myApp33',
        data:{
            'gdtype':'1',
            'xttype':'1',
            'bxtel':'',
            'bxkesh':'',
            'bxren':'',
            'pointer':'',
            'gztime':'',
            'sbtype':'',
            'sbnum':'',
            'sbname':'',
            'azplace':'',
            'gzplace':'',
            'wxshx':'',
            'wxbz':'',
            'wxcontent':''
        },
        methods:{
            time:function(){
                _timeHMSComponentsFun($('.datatimeblock').eq(2),1);
            },
            timeblur:function(){
                setTimeout(function(){
                    $('.datepicker').hide();
                },200)
            },
        }
    });

    //验证vue非空（空格不算）
    Vue.validator('isEmpty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val = val.replace(/^\s+|\s+$/g, '');
        return /[^.\s]{1,500}$/.test(val)
    });

    //标记当前打开的是不是登记按钮
    var _isDeng = false;

    //存放报修科室数组
    var _allBXArr = [];

    //存放系统类型数组
    var _allXTArr = [];

    //维修事项（车站）
    bxKShiData();
    //ksAndBm('YWDev/ywDMGetDDsII', _allBXArr, $('#bxkesh'), 'ddName', 'ddNum');

    //系统类型
    ajaxFun('YWDev/ywDMGetDSs', _allXTArr, $('#sbtype'), 'dsName', 'dsNum');

    //负责人数组
    var _fzrArr = [];

    //存放当前工单号
    var _gdCode = '';

    //记录当前状态值
    var _gdZht = '';

    //记录当前
    var _gdCircle = '';

    //所有部门
    var _departArr = [];

    //获取所有部门
    //getDpartment();

    //标识维修内容执行完毕
    var _wxIsComplete = false;

    //维修内容执行结果
    var _wxIsSuccess = false;

    //状态转换是否完成
    var _ztChangeComplete = false;

    //转换状态执行结果
    var _ztChangeSuccess = false;

    //分配负责人是否完成
    var _fzrComplete = false;

    //负责人执行结果
    var _fzrSuccess = false;

    //重发是否完成
    var _reSendComplete = false;

    //重发执行结果
    var _reSendSuccess = false;

    //存放员工信息数组
    var _workerArr = [];

    //获得员工信息方法
    workerData();


    /*-------------------------------------------------按钮事件-----------------------------------------*/
    //快速登记
    $('.creatButton').click(function(){

        _isDeng = true;

        $('.fdjImg').show();


        //显示模态框
        _moTaiKuang($('#myModal'), '登记', '', '' ,'', '登记');

        //增加登记类
        $('#myModal').find('.btn-primary').removeClass('jiedan').addClass('dengji');

        //选择部门不显示
        $('.bumen').hide();

        //初始化
        dataInit();

        //维修内容显示
        $('.wxnr').show();

        //所有input框不能操作，select也不能操作
        $('.single-block').children('input').removeAttr('readOnly').removeClass('disabled-block');

        //所有select不能操作
        $('.single-block').children('select').attr('disabled',false).removeClass('disabled-block');

        //故障描述不可操作
        $('.gzDesc').removeAttr('readOnly').removeClass('disabled-block');

        //报修人信息不可操作
        $('.note-edit2').attr('disabled',true).addClass('disabled-block');

        //电话信息可编辑
        $('.bx-choose').removeAttr('disabled').removeClass('disabled-block');;
    });

    //点击登记模态框显示的回调函数
    $('#myModal').on('shown.bs.modal', function () {

        if(_isDeng){
            //绑定报修人信息
            if(_workerArr.length > 0){

                gdObj.bxtel = _workerArr[0].mobile;

                gdObj.bxkesh = _workerArr[0].departNum;

                gdObj.bxren = _workerArr[0].userName;
            }

            //让日历插件首先失去焦点
            $('.datatimeblock').eq(2).focus();

            //发生时间默认
            var aa = moment().format('YYYY-MM-DD HH:mm:ss');

            $('.datatimeblock').eq(2).val(aa);

            if($('.datetimepicker:visible')){

                $('.datetimepicker').hide();

            }

            $('.datatimeblock').eq(2).blur();

            //获取维修人员信息

            var obj = {};

            obj.userNum = _userIdNum;

            obj.userName = _userIdName;

            obj.mobile = '';

            _fzrArr.length = 0;

            _fzrArr.push(obj);

            _datasTable($('#fzr-list'),_fzrArr);

            //复选框自动点击一下
            $('#fzr-list tbody').find('.checker').find('input').click();
        }

        _isDeng = false;
    });

    //登记确定按钮
    $('#myModal')
        .on('click','.dengji',function(){
            //验证必填项
            if(gdObj.bxtel == ''|| gdObj.bxkesh == '' || gdObj.bxren == '' || gdObj.gzplace == '' || gdObj.wxshx == ''  || gdObj.wxcontent == ''){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

            }else{
                //工单维修人
                var arr = [];
                var obj = {};
                obj.wxRen = _fzrArr[0].userNum;
                obj.wxRName = _fzrArr[0].userName;
                obj.wxRDh = _fzrArr[0].mobile;
                arr.push(obj);

                //登记
                var prm = {
                    'gdJJ':gdObj.gdtype,
                    'gdRange':gdObj.xttype,
                    'bxDianhua':gdObj.bxtel,
                    'bxKeshi':$('#bxkesh').children('option:selected').html(),
                    'bxKeshiNum':gdObj.bxkesh,
                    'bxRen':gdObj.bxren,
                    //'':gdObj.pointer,
                    'gdFsShij':$('.datatimeblock').eq(2).val(),
                    'wxShiX':gdObj.wxshx,
                    'wxShiXNum':'1',
                    'wxShebei':gdObj.sbnum,
                    'dName':gdObj.sbname,
                    'installAddress':gdObj.azplace,
                    'wxDidian':gdObj.gzplace,
                    'bxBeizhu':$('.gzDesc').val(),
                    'userID': _userIdNum,
                    'userName': _userIdName,
                    'b_UserRole':_userRole,
                    'gdSrc': 1,
                    'gdZht':6,
                    'wxKeshi':gdObj.wxbz,
                    'wxBeizhu':gdObj.wxcontent,
                    'gdWxRs':arr
                }
                $.ajax({
                    type:'post',
                    url:_urls + 'YWGD/ywGDCreQuickDJ',
                    data:prm,
                    timeout:_theTimes,
                    beforeSend: function () {
                        $('#theLoading').modal('show');
                    },

                    complete: function () {
                        $('#theLoading').modal('hide');
                    },
                    success:function(result){
                        //console.log(result);
                        if(result == 99){

                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'快速登记成功！', '');

                            $('#myModal').modal('hide');

                            conditionSelect();

                        }else{
                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'快速登记失败！', '');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.responseText);
                    }
                })

            }
        })
        .on('click','.jiedan',function(){

            $('#theLoading').modal('show');

            //验证是否选择了负责人
            //assigFZR(true);
            var lengths = $('#fzr-list tbody').find('.checked').length;

            if(lengths == 0){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择负责人！', '');

            }else{

                //先判断是第一次下发还是重发
                if(_gdZht == 5){
                    //维修内容修改
                    upDateWXRemark(false);
                    //工单重发
                    reSend();
                    //分配负责人
                    assigFZR(false);

                }else{
                    //维修内容修改
                    upDateWXRemark(true);
                    //工单下发
                    upData();
                    //分配负责人
                    assigFZR(true);
                }

            }
        })

    //选项卡切换
    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tabDiv = $(this).parents('.table-title').next().children('div');
        tabDiv.addClass('hide-block');
        tabDiv.eq($(this).index()).removeClass('hide-block');
    });

    //接单
    $('#waiting-list').on('click','.option-orders',function(){

        //选择部门不显示
        $('.bumen').hide();

        $('.fdjImg').hide();

        //数据绑定
        bindData($(this),$('#waiting-list'));

        //添加类
        $('#myModal').find('.btn-primary').removeClass('dengji').addClass('jiedan');

        //模态框显示
        _moTaiKuang($('#myModal'), '待接单', '', '' ,'', '接单');

        //所有input框不能操作，select也不能操作
        $('.single-block').children('input').attr('readOnly','readOnly').addClass('disabled-block');

        //所有select不能操作
        $('.single-block').children('select').attr('disabled',true).addClass('disabled-block');

        //故障描述不可操作
        $('.gzDesc').attr('readOnly','readOnly').addClass('disabled-block');


        //维修内容显示
        $('.wxnr').hide();

        $('#depart').attr('disabled',true)

    })

    //选择部门之后加载人员列表
    $('#depart').change(function(){
        //选择部门
        gdObj.wxbz = $('#depart').children('option:selected').html();
        $('#wxbz').attr('data-bm',$('#depart').val())
        //获取人员列表
        var prm = {
            'departNum':$('#depart').val(),
            'userID':_userIdNum,
            'userName':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetWXRens',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){
                for(var i=0;i<result.length;i++){
                    _fzrArr.push(result[i]);
                }
                _datasTable($('#fzr-list'),result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    });

    //表格复选框点击事件
    $('#fzr-list').on('click','input',function(){

        if($(this).parent('.checked').length == 0){
            //console.log('没有选中');
            $(this).parent('span').addClass('checked');
            $(this).parents('tr').addClass('tables-hover');
        }else{
            //console.log('选中');
            $(this).parent('span').removeClass('checked');
            $(this).parents('tr').removeClass('tables-hover');
        }
    })

    //查询
    $('#selected').click(function(){
        conditionSelect();
    })

    //重置
    $('.resites').click(function(){

        //input清空
        $('.filterInput').val('');

        //时间重置
        $('.datatimeblock').eq(0).val(st);

        $('.datatimeblock').eq(1).val(et);
    })

    /*------------------------------------------------表格初始化------------------------------------------*/

    //待受理表格
    var waitingListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '" data-circle="' + full.gdCircle +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        //{
        //    title:'工单类型',
        //    data:'gdJJ',
        //    render:function(data, type, full, meta){
        //        if(data == 0){
        //            return '普通'
        //        }else{
        //            return '快速'
        //        }
        //    }
        //},
        //{
        //    title:'设备类型',
        //    data:'wxShiX'
        //},
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'维修事项',
            data:'wxXm'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'报修时间',
            data:'gdShij'
        },
        //{
        //    title:'受理时间',
        //    data:'shouLiShij'
        //},
        //{
        //    title:'接单时间',
        //    data:'paiGongShij'
        //},
        {
            title:'维修科室',
            data:'wxKeshi'
        },
        //{
        //    title:'处理人',
        //    data:'wxUserNames'
        //},
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-orders btn default btn-xs green-stripe'>接单</span>"
        }
    ];

    _tableInit($('#waiting-list'),waitingListCol,'2','','','');

    //选择设备表格
    var equipTable = $('#choose-equip').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
            'search':'搜索:',
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
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'id',
                data:'id',
                class:'theHidden'
            },
            {
                title:'设备名称',
                data:'dName'
            },
            {
                title:'设备编码',
                data:'dNewNum'
            },
            {
                title:'设备类型',
                data:'dsName',
                render:function(data, type, row, meta){
                    return '<span data-num="'+row.dsNum+'">'+data+'</span>'
                }
            },
            {
                title:'安装位置',
                data:'installAddress',
                class:'adjust',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            }
        ]
    });
    //选择维修事项表格
    var matterTable = $('#choose-metter').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
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
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'id',
                data:'id',
                class:'theHidden'
            },
            {
                title:'维修项目编号',
                data:'wxclassnum',
                class:'theHidden'
            },
            {
                title:'维修项目名称',
                data:'wxname',
                class:'adjust-comment',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            },
            {
                title:'项目类别名称',
                data:'wxclassname'
            },
            {
                title:'备注',
                data:'memo'
            }
        ]
    });

    //执行中表格
    var inExecutionCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '" data-circle="' + full.gdCircle +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        //{
        //    title:'工单类型',
        //    data:'gdJJ',
        //    render:function(data, type, full, meta){
        //        if(data == 0){
        //            return '普通'
        //        }else{
        //            return '快速'
        //        }
        //    }
        //},
        //{
        //    title:'设备类型',
        //    data:'wxShiX'
        //},
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'维修事项',
            data:'wxXm'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'报修时间',
            data:'gdShij'
        },
        //{
        //    title:'受理时间',
        //    data:'shouLiShij'
        //},
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'维修科室',
            data:'wxKeshi'
        },
        {
            title:'处理人',
            data:'wxUserNames'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        /*{
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-orders btn default btn-xs green-stripe'>接单</span>"
        }*/
    ];

    _tableInit($('#in-execution'),inExecutionCol,'2','','','');

    //执行人表格
    var fzrListCol = [
        {
            className:'checkeds',
            data:null,
            defaultContent:"<div class='checker'><span class=''><input type='radio'></span></div>"
        },
        {
            title:'工号',
            data:'userNum',
            className:'workNum'
        },
        {
            title:'姓名',
            data:'userName'
        },
        //{
        //    title:'职位',
        //    data:'pos'
        //},
        {
            title:'联系电话',
            data:'mobile'
        }
    ];

    //_tableInit($('#fzr-list'),fzrListCol,'2','','','',true);

    var _tables = $('#fzr-list').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'search':'搜索:',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [

        ],
        "dom":'B<"clear">lfrtip',
        "columns": fzrListCol
    });

    //数据
    conditionSelect();

    //选择设备弹窗打开后
    $('#choose-equipment').on('shown.bs.modal', function () {

        datasTable($('#choose-equip'),equipmentArr);

    });

    $('#choose-equip').on('click','.tableCheck',function(){
        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);
    });

    //选择设备确定按钮
    $('#choose-equipment .btn-primary').on('click',function() {
        var dom = $('#choose-equip tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //seekArr.push(dom.eq(i).children().eq(1).html())
                //获取地址
                $('#equip-address').val(dom.eq(i).children().eq(5).find('span').html());
                //获取设备名称
                $('#equip-name').val(dom.eq(i).children().eq(2).html());
                //获取设备编码
                $('#equip-num').val(dom.eq(i).children().eq(3).html());
                //获取设备类型
                $('#sbtype').val(dom.eq(i).children().eq(4).find('span').attr('data-num'));

                $('#choose-equipment').modal('hide');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应设备', '')

    });

    //选择维修事项弹窗打开后
    $('#choose-building').on('shown.bs.modal', function () {
        getMatter();

    });

    $('#choose-metter').on('click','.tableCheck',function(){
        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);

    });

    //选择维修事项确定按钮
    $('#choose-building .btn-primary').on('click',function() {
        var dom = $('#choose-metter tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //seekArr.push(dom.eq(i).children().eq(1).html())
                $('#metter').val(dom.eq(i).children().eq(3).find('span').html());

                $('#choose-building').modal('hide');

                return false
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应维修事项', '')

    });

    //点击维修事项查询按钮
    $('#selected1').on('click',function(){
        //获取维修类别
        var type = $('#add-select').find("option:selected").text();
        if(type == '全部'){
            type = '';
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDWxxmGetAll',
            data:{
                "wxnum": "",
                "wxname": "",
                "wxclassname":type
            },
            success:function(result){

                //return false;
                datasTable($('#choose-metter'),result);
            }
        })
    });

    //故障地点表格
    var areaTable = $('#choose-area-table').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
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
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'id',
                data:'id',
                class:'theHidden'
            },
            {
                title:'地点编号',
                data:'locnum',
                class:'theHidden'
            },
            {
                title:'地点名称',
                data:'locname',
                class:'adjust-comment',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            },
            {
                title:'部门名称',
                data:'departname'
            },
            {
                title:'楼栋名称',
                data:'ddname'
            }
        ]
    });

    //选择故障地点弹窗打开后
    $('#choose-area').on('shown.bs.modal', function () {
        getArea();
    });

    $('#choose-area').on('click','.tableCheck',function(){
        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);
    });

    //选择故障地点确定按钮
    $('#choose-area .btn-primary').on('click',function() {
        var dom = $('#choose-area-table tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //seekArr.push(dom.eq(i).children().eq(1).html())

                gdObj.gzplace = dom.eq(i).children().eq(3).find('span').html();

                $('#choose-area').modal('hide');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应故障地点', '')

    });

    //接单人只能单选
    $('#fzr-list').on('click','.checker',function(){
        $(".checker span").removeClass("checked");

        $(this).find('span').addClass("checked");

        $('#fzr-list tr').removeClass("tables-hover");

        $(this).parents('tr').addClass("tables-hover");
    });

    /*------------------------------------------------其他方法--------------------------------------------*/
    equipmentArr = [];
    getEuipment('');
    //获取设备类型
    function getEuipment(dsNum){

        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevs',
            data:{
                userID:_userIdNum,
                dsNum:dsNum
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){
                //console.log(result);
                $('#theLoading').modal('hide');
                $(result).each(function(i,o){
                    equipmentArr.push(o);
                })
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                console.log(jqXHR.responseText);
            }
        })
    };

    //获取维修事项
    function getMatter(){

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDWxxmGetAll',
            data:{
                "wxnum": ""
            },
            success:function(result){
                //console.log(result);
                //return false;
                datasTable($('#choose-metter'),result);
            }
        })
    };

    //获取故障位置
    function getArea(){
        //获取报修科室
        var departnum = $('#bxkesh').val();
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/SysLocaleGetAll',
            data:{
                "locname": "",
                "departnum": departnum,
                "departname": "",
                "ddname": ""
            },
            success:function(result){
                //return false;
                datasTable($('#choose-area-table'),result);
            }
        })
    };

    getMatterType();
    //获取项目类别
    function getMatterType(){
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDwxxmClassGetAll',
            data:{
                "wxnum": ""
            },
            success:function(result){

                //return false;
                var html = '<option value=" ">全部</option>'
                $(result).each(function(i,o){
                    html += '<option value="'+o.wxclassnum+'">'+ o.wxclassname+'</option>'
                })
                $('#add-select').html(html);
            }
        })

    };


    function datasTable(tableId,arr){


        if(arr.length == 0){
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnDraw();
        }else{
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }

    };

    //初始化
    function dataInit(){
        gdObj.gdtype = '0';
        gdObj.xttype = '1';
        gdObj.bxtel = '';
        gdObj.bxkesh = '';
        gdObj.bxren = '';
        gdObj.pointer = '';
        gdObj.gztime = '';
        gdObj.sbtype = '';
        gdObj.sbnum = '';
        gdObj.sbname = '';
        gdObj.azplace = '';
        gdObj.gzplace = '';
        gdObj.wxshx = '';
        gdObj.wxbz = '';
        gdObj.wxcontent = ''
        $('.gzDesc').val('');
    };

    //车站数据(报修科室)
    function ajaxFun(url, allArr, select, text, num) {
        var prm = {
            'userID': _userIdNum
        }
        prm[text] = '';
        $.ajax({
            type: 'post',
            url: _urls + url,
            timeout:30000,
            data: prm,
            success: function (result) {
                //给select赋值
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < result.length; i++) {
                    str += '<option' + ' value="' + result[i][num] + '">' + result[i][text] + '</option>'
                    allArr.push(result[i]);
                }
                select.empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //报修科室与部门联动
    function ksAndBm(url, allArr, select, text, num){
        var prm = {
            'userID': _userIdNum
        }
        prm[text] = '';
        $.ajax({
            type: 'post',
            url: _urls + url,
            timeout:30000,
            data: prm,
            success: function (result) {
                //给select赋值
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < result.length; i++) {
                    str += '<option' + ' value="' + result[i][num] + '"data-num=' + result[i]['departNum'] +'>' + result[i][text] + '</option>'
                    allArr.push(result[i]);
                }
                select.empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //条件查询
    function conditionSelect(){
        var st = $('.min').val();

        var et = moment($('.max').val()).add(1,'d').format('YYYY/MM/DD');

        var prm = {
            'gdCode':$('.filterInput').val(),
            'gdSt':st,
            'gdEt':et,
            'userID': _userIdNum,
            'userName': _userIdName,
            'b_UserRole':_userRole,
            'wxKeshiNum':_userBM
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDJ',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                //根据状态值给表格赋值
                var zht2=[],zht=[];
                for(var i=0;i<result.length;i++){
                    if(result[i].gdZht == 2){
                        zht2.push(result[i]);
                    }else{
                        zht.push(result[i]);
                    }
                }
                //未接单
                _datasTable($('#waiting-list'),zht2);
                //历史工单
                _datasTable($('#in-execution'),zht);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }//条件查询

    //信息绑定
    function bindData(num,tableId){
        //样式
        tableId.children('tbody').children('tr').removeClass('tables-hover');

        num.parents('tr').addClass('tables-hover');

        _gdCode = num.parents('tr').children('.gdCode').children('span').children('a').html();

        _gdZht = num.parents('tr').children('.gdCode').children('span').attr('data-zht');

        _gdCircle = num.parents('tr').children('.gdCode').children('span').attr('data-circle');

        //请求数据
        var prm = {
            'gdCode':num.parents('tr').children('.gdCode').children('span').children('a').html(),
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            'gdCircle':num.parents('tr').children('.gdCode').children('span').attr('data-circle'),
            'gdZht':num.parents('tr').children('.gdCode').children('span').attr('data-zht')
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                //赋值
                gdObj.bxtel = result.bxDianhua;
                gdObj.bxkesh = result.bxKeshiNum;
                gdObj.bxren = result.bxRen;
                //gdObj.pointer = '';
                gdObj.gztime = result.gdFsShij;
                gdObj.gzplace = result.wxDidian;
                gdObj.wxshx=result.wxXm;
                gdObj.sbtype = result.wxShiXNum;
                gdObj.sbnum = result.wxShebei;
                gdObj.sbname = result.dName;
                gdObj.azplace = result.installAddress;
                $('.gzDesc').val(result.bxBeizhu);

                //负责人信息
                var arr = [];
                _datasTable($('#fzr-list'),arr);

                //绑定部门信息
                $('#depart').val(result.wxKeshiNum);

                //获取人员列表
                var prm = {
                    'departNum':$('#depart').val(),
                    'userID':_userIdNum,
                    'userName':_userIdName
                }
                $.ajax({
                    type:'post',
                    url:_urls + 'YWGD/ywGetWXRens',
                    data:prm,
                    success:function(result){
                        _fzrArr.length = 0;
                        for(var i=0;i<result.length;i++){
                            _fzrArr.push(result[i]);
                        }
                        _datasTable($('#fzr-list'),result);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.responseText);
                    }
                })

                //维修班组
                $('#wxbz').val($('#depart').children('option:selected').html());

                $('#wxbz').attr('data-bm',result.wxKeshiNum);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有部门
    function getDpartment(){
        var prm = {
            'departName':'',
            'userID':_userIdNum,
            'userName':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _departArr.length = 0;

                for(var i=0;i<result.length;i++){
                    _departArr.push(result[i]);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //转换状态
    function upData(){
        var prm = {
            gdCode :_gdCode,
            gdZht : 3,
            wxKeshi:$('#wxbz').val(),
            wxKeshiNum:$('#wxbz').attr('data-bm'),
            userID:_userIdNum,
            userName:_userIdName,
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptPaigII',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _ztChangeComplete = true;

                if(result == 99){
                    _ztChangeSuccess = true;
                }else{
                    _ztChangeSuccess = false;
                }

                firstXF();
            },
            error:function(jqXHR, textStatus, errorThrown){

                _ztChangeComplete = true;

                console.log(jqXHR.responseText);
            }
        })
    }

    //分配负责任人（true第一次 false第二次）
    function assigFZR(flag){
        //获取负责人
        //获取已选中的工号，然后确定选中人的信息
        var arr = [];

        var allPerson = $('.checker');

        var allWorkNum = $('#fzr-list tbody').find('.workNum');

        console.log(_fzrArr);

        for(var i=0;i<allPerson.length;i++){
            if(allPerson.eq(i).children('.checked').length != 0){
                for(var j=0;j<_fzrArr.length;j++){
                    if(allWorkNum.eq(i).html() == _fzrArr[j].userNum){
                        arr.push(_fzrArr[j]);
                    }
                }
            }
        }

        //负责人数组
        var fzrArr = [];
        for(var i=0;i<arr.length;i++){
            var obj = {};
            obj.wxRen = arr[i].userNum;
            obj.wxRName = arr[i].userName;
            obj.wxRDh = arr[i].mobile;
            obj.gdCode = _gdCode;
            fzrArr.push(obj);
        }

        var prm = {
            gdCode : _gdCode,
            gdWxRs : fzrArr,
            userID : _userIdNum,
            userName : _userIdName,
            gdZht:_gdZht,
            gdCircle:_gdCircle
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDAddWxR',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _fzrComplete = true;

                if(result == 99){
                    _fzrSuccess = true;
                }else{
                    _fzrSuccess = false;
                }
                if(flag){
                    firstXF();
                }else{
                    secondXF();
                }
            },
            error:function(jqXHR, textStatus, errorThrown){

                _fzrComplete = true;

                console.log(jqXHR.responseText);
            }
        })
    }

    //更新维修内容（true第一次 false第二次）
    function upDateWXRemark(flag){
        var prm = {
            "gdCode": _gdCode,
            "gdZht": _gdZht,
            "wxKeshi": '',
            "wxBeizhu": $('#wxremark').val(),
            "userID": _userIdNum,
            "userName":_userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptWxBeizhu',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _wxIsComplete = true;

                $('')

                if(result == 99){
                    _wxIsSuccess = true;
                }else{
                    _wxIsSuccess = false;
                }
                if(flag){
                    firstXF()
                }else{
                    secondXF()
                }
            },
            error:function(jqXHR, textStatus, errorThrown){

                _wxIsComplete = true;

                console.log(jqXHR.responseText);
            }

        })
    }

    //第一次下发操作是否完成
    function firstXF(){

        //是否执行完毕
        if( _wxIsComplete && _fzrComplete &&  _ztChangeComplete ){

            //$('#theLoading').modal('hide');

            //提示
            if(_fzrSuccess && _wxIsSuccess && _ztChangeSuccess){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单接单成功！', '');

                $('#myModal').modal('hide');

                conditionSelect();
            }else{
                var str = '';
                if( _fzrSuccess == false ){
                    str += '执行人增加失败，'
                }else{
                    str += '执行人增加成功，'
                }
                if( _wxIsSuccess == false ){
                    str += '维修备注修改失败，'
                }else{
                    str += '维修备注修改成功，'
                }
                if( _ztChangeSuccess == false ){
                    str += '工单接单失败！'
                }else{
                    str += '工单接单成功！'
                }
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,str, '');
            }
        }
    }

    //重发
    function reSend(){
        var prm = {
            "gdCode": _gdCode,
            "gdZht": 3,
            "gdCircle": _gdCircle,
            "userID": _userIdNum,
            "userName": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZhtChP',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _reSendComplete = true;

                if(result == 99){
                    _reSendSuccess = true;
                }else{
                    _reSendSuccess = false;
                }

                secondXF();

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //重发操作是否完成
    function secondXF(){
        if(_wxIsComplete && _fzrComplete && _reSendComplete){

            //$('#theLoading').modal('hide');

            if(_fzrSuccess && _wxIsSuccess && _reSendSuccess){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单下发成功！', '');

                $('#myModal').modal('hide');

                conditionSelect()
            }else{
                var str = '';
                if( _fzrSuccess == false ){
                    str += '执行人增加失败，'
                }else{
                    str += '执行人增加成功，'
                }
                if( _wxIsSuccess == false ){
                    str += '维修备注修改失败，'
                }else{
                    str += '维修备注修改成功，'
                }
                if( _reSendSuccess == false ){
                    str += '工单重新派工失败！'
                }else{
                    str += '工单重新派工成功！'
                }
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,str, '');
            }
        }
    }

    //报修科室
    function bxKShiData(){
        var prm = {
            'departName':'',
            'userID':_userIdNum,
            'userName':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                _allBXArr.length = 0;
                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    _allBXArr.push(result[i]);

                    str += '<option value="' + result[i].departNum +
                        '">' + result[i].departName + '</option>>';
                }

                $('#bxkesh').empty().append(str);

                $('#depart').empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有员工列表
    function workerData(){
        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            userNum:_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetUsers',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _workerArr = result;

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }
})