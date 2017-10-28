$(function(){
    /*---------------------------------------------时间---------------------------------------------------*/

    //时间设置
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间（7天）
    var et = moment().format('YYYY/MM/DD');

    var st =moment().subtract(7,'d').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(st);

    $('.datatimeblock').eq(1).val(et);

    /*---------------------------------------------变量--------------------------------------------------*/
    //登记vue变量
    var gdObj = new Vue({
        el:'#myApp33',
        data:{
            'gdtype':'0',
            'bxtel':'',
            'bxkesh':'',
            'bxren':'',
            'pointer':'',
            'gztime':'',
            'wxshx':'1',
            'sbtype':'',
            'sbnum':'',
            'sbname':'',
            'azplace':'',
            'gzplace':'',
            'wxbz':''
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

    //存放报修科室
    var _allBXArr = [];

    //存放系统类型
    var _allXTArr = [];

    //维修事项（车站）
    bxKShiData();
    //ksAndBm('YWDev/ywDMGetDDsII', _allBXArr, $('#bxkesh'), 'ddName', 'ddNum');

    //系统类型
    ajaxFun('YWDev/ywDMGetDSs', _allXTArr, $('#sbtype'), 'dsName', 'dsNum');

    //部门数组
    var _departArr = [];

    //部门加载
    //getDpartment();

    //所有负责人列表
    var _fzrArr = [];

    //重发值
    //var _gdCircle = 0;

    //存放当前工单号
    var _gdCode = '';

    //记录当前状态值
    var _gdZht = '';

    //记录当前
    var _gdCircle = '';

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

    //标记当前打开的是不是登记按钮
    var _isDeng = false;

    //存放员工信息数组
    var _workerArr = [];

    //获得员工信息方法
    workerData();

    /*--------------------------------------------表格初始化---------------------------------------------*/

    //待受理
    var  pendingListCol = [
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
        {
            title:'报修电话',
            data:'bxDianhua'
        },
        {
            title:'报修科室',
            data:'bxKeshi'
        },
        {
            title:'报修人',
            data:'bxRen'
        },
        //{
        //    title:'楼栋',
        //    data:''
        //},
        {
            title:'故障发生时间',
            data:'gdFsShij'
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-issued btn default btn-xs green-stripe'>下发</span><span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>"
        }
    ];

    _tableInit($('#pending-list'),pendingListCol,'2','','','');


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
            'lengthMenu': '每页 _MENU_ 件',
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
            'lengthMenu': '每页 _MENU_ 件',
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
                title:'维修项目编号',
                data:'wxclassnum'
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
            }
        ]
    });

    //待接单
    var  dengListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        {
            title:'报修电话',
            data:'bxDianhua'
        },
        {
            title:'报修科室',
            data:'bxKeshi'
        },
        {
            title:'报修人',
            data:'bxRen'
        },
        //{
        //    title:'楼栋',
        //    data:''
        //},
        {
            title:'故障发生时间',
            data:'gdFsShij'
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        //{
        //    title:'操作',
        //    data:null,
        //    defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
        //}
    ];

    _tableInit($('#deng-list'),dengListCol,'2','','','');

    //执行中表格
    var inExecutionCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        {
            title:'工单类型',
            data:'gdJJ',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '普通'
                }else{
                    return '快速'
                }
            }
        },
        {
            title:'设备类型',
            data:'wxShiX'
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'登记时间',
            data:'gdShij'
        },
        {
            title:'受理时间',
            data:'shouLiShij'
        },
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
        //{
        //    title:'操作',
        //    data:null,
        //    defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
        //}
    ];

    _tableInit($('#in-execution'),inExecutionCol,'2','','','');

    //待关单表格
    var waitingListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        {
            title:'工单类型',
            data:'gdJJ',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '普通'
                }else{
                    return '快速'
                }
            }
        },
        {
            title:'设备类型',
            data:'wxShiX'
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'登记时间',
            data:'gdShij'
        },
        {
            title:'受理时间',
            data:'shouLiShij'
        },
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'完工申请时间',
            data:'wanGongShij'
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
        {
            title:'验收人',
            data:'pjRen'
        },
        //{
        //    title:'操作',
        //    data:null,
        //    defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>关单</span>"
        //}
    ];

    _tableInit($('#waiting-list'),waitingListCol,'2','','','');

    //已关单
    var closingListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        {
            title:'工单类型',
            data:'gdJJ',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '普通'
                }else{
                    return '快速'
                }
            }
        },
        {
            title:'设备类型',
            data:'wxShiX'
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'登记时间',
            data:'gdShij'
        },
        {
            title:'受理时间',
            data:'shouLiShij'
        },
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'完工申请时间',
            data:'wanGongShij'
        },
        {
            title:'关单时间',
            data:'guanbiShij'
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
        {
            title:'验收人',
            data:'pjRen'
        },
    ];

    _tableInit($('#closing-list'),closingListCol,'2','','','');

    //申诉
    var appealListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        {
            title:'工单类型',
            data:'gdJJ',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '普通'
                }else{
                    return '快速'
                }
            }
        },
        {
            title:'设备类型',
            data:'wxShiX'
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'登记时间',
            data:'gdShij'
        },
        {
            title:'受理时间',
            data:'shouLiShij'
        },
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'完工申请时间',
            data:'wanGongShij'
        },
        {
            title:'关单时间',
            data:'guanbiShij'
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
        {
            title:'验收人',
            data:'pjRen'
        },
        /*{
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
        }*/
    ];

    _tableInit($('#appeal-list'),appealListCol,'2','','','');

    //负责人表格
    var fzrListCol = [
        {
            className:'checkeds',
            data:null,
            defaultContent:"<div class='checker'><span class=''><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'userNum',
            className:'workNum'
        },
        {
            title:'工长名称',
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

    _tableInit($('#fzr-list'),fzrListCol,'2','','','');

    //数据加载
    conditionSelect();

    /*-------------------------------------------------按钮事件-----------------------------------------*/

    //tab选项卡
    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tabDiv = $(this).parents('.table-title').next().children('div');
        tabDiv.addClass('hide-block');
        tabDiv.eq($(this).index()).removeClass('hide-block');
    });

    //登记
    $('.creatButton').click(function(){

        _isDeng = true;

        //模态框显示
        _moTaiKuang($('#myModal'), '登记', '', '' ,'', '登记');

        //添加登记类
        $('#myModal').find('.btn-primary').removeClass('bianji').removeClass('xiafa').addClass('dengji');

        //显示放大镜图标 用户可以选择
        $('.fdjImg').show();

        //维修内容不显示
        $('#wxContent').hide();

        //选择部门显示
        $('.selectBM').show();

        //对象初始化
        dataInit();

        //input不可操作
        $('.single-block').children('input').removeAttr('readOnly').removeClass('disabled-block');

        //select不可操作
        $('.single-block').children('select').attr('disabled',false).removeClass('disabled-block');

        //textarea不可操作
        $('.gzDesc').attr('disabled',false).removeClass('disabled-block');

        $('#depart').attr('disabled',false).removeClass('disabled-block');


        //报修人信息不可操作
        $('.note-edit2').attr('disabled',true).addClass('disabled-block');
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

            ////获取维修人员信息
            _fzrArr = [];
            _datasTable($('#fzr-list'),_fzrArr);

            //复选框自动点击一下
            //$('#fzr-list tbody').find('.checker').find('input').click();
        }

        _isDeng = false;
    });

    //报修科室联动部门
    //$('#bxkesh').change(function(){
    //    //确定当前
    //    var currentKS = $('#bxkesh').children('option:selected').attr('data-num');
    //    var arr = [];
    //    var str = '<option value="">请选择</option>';
    //    for(var i=0;i<_departArr.length;i++){
    //
    //        if(_departArr[i].departNum == currentKS){
    //
    //            str += '<option value="' + _departArr[i].departNum +
    //                '">' + _departArr[i].departName + '</option>'
    //        }
    //    }
    //    $('#depart').empty().append(str);
    //
    //});

    //选择部门之后加载人员列表
    $('#depart').change(function(){

        //选择部门
        gdObj.wxbz = $('#depart').children('option:selected').html();
        $('#wxbz').attr('data-bm',$('#depart').val())

        var prm = {
            'departNum':$('#depart').val(),
            'userID':_userIdNum,
            'userName':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetWXLeaders',
            data:prm,
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

    //登记、编辑
    $('#myModal')
        .on('click','.dengji',function(){

            optionData('YWGD/ywGDCreDJ','登记成功！','登记失败！','');

        })
        .on('click','.bianji',function(){

            optionData('YWGD/ywGDUpt','编辑成功！','编辑失败！','flag');

        })
        .on('click','.xiafa',function(){

            //先判断是第一次下发还是重发
            if(_gdZht == 5){
                //维修内容修改
                upDateWXRemark(false);
                //工单重发
                reSend();
                //分配负责人
                //assigFZR(false);

            }else{
                //维修内容修改
                upDateWXRemark(true);
                //工单下发
                upData();
                //分配负责人
                //assigFZR(true);
            }

            //验证是否选择了负责人

            //var lengths = $('#fzr-list tbody').find('.checked').length;
            ////var lengths = 1;
            //
            //if(lengths == 0){
            //
            //    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择负责人！', '');
            //
            //}else{
            //
            //}
        })

    //表格操作按钮
    $('#pending-list')
        .on('click','.option-edit',function(){

            //显示放大镜图标 用户可以选择
            $('.fdjImg').show();

            //信息绑定
            bindData($(this),$('#pending-list'));

            //模态框显示
            _moTaiKuang($('#myModal'), '详情', '', '' ,'', '保存');

            //维修内容隐藏
            $('#wxContent').hide();

            //选择部门隐藏
            $('#depart').val(' ').attr('disabled',true).addClass('disabled-block').show();

            //添加编辑类
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('xiafa').addClass('bianji');

            //input不可操作
            $('.single-block').children('input').removeAttr('readOnly').removeClass('disabled-block');

            //select不可操作
            $('.single-block').children('select').attr('disabled',false).removeClass('disabled-block');

            //textarea不可操作
            $('.gzDesc').attr('disabled',false).removeClass('disabled-block');

            //报修人信息不可操作
            $('.note-edit2').attr('disabled',true).addClass('disabled-block');
        })
        .on('click','.option-issued',function(){

            //隐藏放大镜图标 不让用户选择
            $('.fdjImg').hide();

            //信息绑定
            bindData($(this),$('#pending-list'));

            //模态框显示
            _moTaiKuang($('#myModal'), '下发', '', '' ,'', '下发');

            //维修内容显示
            $('#wxContent').show();

            //选择部门显示
            $('.selectBM').show();

            //报修科室不可选择
            $('#bxkesh').attr('disabled',true);

            //添加编辑类
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('xiafa');

            //input不可操作
            $('.single-block').children('input').attr('readOnly','readOnly').addClass('disabled-block');

            //select不可操作
            $('.single-block').children('select').attr('disabled',true).addClass('disabled-block');

            //textarea不可操作
            $('.gzDesc').attr('disabled',true).addClass('disabled-block');

            //部门可选择
            $('#depart').val('').attr('disabled',false).removeClass('disabled-block');


        })

    //查询
    $('#selected').click(function(){
        conditionSelect();
    });

    //重置
    $('.resites').click(function(){

        //input清空
        $('.filterInput').val('');

        //时间重置
        $('.datatimeblock').eq(0).val(st);

        $('.datatimeblock').eq(1).val(et);
    });

    //待接单查看按钮
    $('#deng-list tbody').on('click','.option-see',function(){

        //绑定数据
        bindData($(this),$('#deng-list'));


        //模态框显示
        _moTaiKuang($('#myModal'), '详情', 'flag', '' ,'', '');

    })

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

    /*-------------------------------------------------其他方法-----------------------------------------*/
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
                console.log(result);
                //return false;
                datasTable($('#choose-metter'),result);
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

    }
    //登记项初始化
    function dataInit(){
        gdObj.gdtype = '0';
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
        gdObj.wxshx='1';
        gdObj.bxbz = '';
        $('.gzDesc').val('');
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

    //设备类型
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
                //console.log(result);
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

    //获取所有部门
    //function getDpartment(){
    //    var prm = {
    //        'departName':'',
    //        'userID':_userIdNum,
    //        'userName':_userIdName
    //    }
    //    $.ajax({
    //        type:'post',
    //        url:_urls + 'RBAC/rbacGetDeparts',
    //        data:prm,
    //        timeout:_theTimes,
    //        success:function(result){
    //            _departArr.length = 0;
    //            for(var i=0;i<result.length;i++){
    //                _departArr.push(result[i]);
    //            }
    //        },
    //        error: function (jqXHR, textStatus, errorThrown) {
    //            console.log(jqXHR.responseText);
    //        }
    //    })
    //}

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
            'b_UserRole':_userRole
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDJ',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                //根据状态值给表格赋值
                var zht1=[],zht2=[],zht4=[],zht6=[],zht7=[],zht11=[];
                for(var i=0;i<result.length;i++){
                    if(result[i].gdZht == 1){
                        zht1.push(result[i]);
                    }else if(result[i].gdZht == 2){
                        zht2.push(result[i])
                    }else if(result[i].gdZht == 4){
                        zht4.push(result[i]);
                    }else if(result[i].gdZht == 6){
                        zht6.push(result[i]);
                    }else if(result[i].gdZht == 7){
                        zht7.push(result[i]);
                    }else if(result[i].gdZht == 11){
                        zht11.push(result[i]);
                    }
                }
                //未接单
                _datasTable($('#pending-list'),zht1);
                //待接单
                _datasTable($('#deng-list'),zht2);
                //执行中
                _datasTable($('#in-execution'),zht4);
                //待关单
                _datasTable($('#waiting-list'),zht6);
                //已关单
                _datasTable($('#closing-list'),zht7);
                //申诉
                _datasTable($('#appeal-list'),zht11);
                //负责人
                //_datasTable($('#fzr-list'),result.gdWxLeaders);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

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
            'gdCode':_gdCode,
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
            success:function(result){
                //console.log(result);
                //赋值
                gdObj.bxtel = result.bxDianhua;
                gdObj.bxkesh = result.bxKeshiNum;
                gdObj.bxren = result.bxRen;
                //gdObj.pointer = '';
                gdObj.gztime = result.gdFsShij;
                gdObj.gzplace = result.wxDidian;
                gdObj.wxshx=result.wxXm;
                //gdObj.sbtype = result.
                gdObj.sbnum = result.wxShebei;
                gdObj.sbname = result.dName;
                gdObj.azplace = result.installAddress;
                $('.gzDesc').val(result.bxBeizhu);

                //负责人信息
                var arr = [];
                for(var i=0;i<result.gdWxLeaders.length;i++){
                    var obj = {};
                    obj.userNum = result.gdWxLeaders[i].wxRen;
                    obj.userName = result.gdWxLeaders[i].wxRName;
                    obj.mobile = result.gdWxLeaders[i].wxRDh;
                    arr.push(obj);
                }
                _datasTable($('#fzr-list'),arr);

                //绑定部门信息
                //var departNum = '';
                //for(var i=0;i<_allBXArr.length;i++){
                //    if(_allBXArr[i].ddNum == result.bxKeshiNum){
                //        departNum = _allBXArr[i].departNum;
                //    }
                //}
                //
                //var str = '<option value="">请选择</option>';
                //for(var i=0;i<_departArr.length;i++){
                //
                //    if(_departArr[i].departNum == departNum){
                //
                //        str += '<option value="' + _departArr[i].departNum +
                //            '">' + _departArr[i].departName + '</option>'
                //    }
                //}
                //
                //$('#depart').empty().append(str);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //登记、编辑(编辑的时候传参数flag)
    function optionData(url,successMeg,errorMeg,flag){
        //验证非空
        if(gdObj.bxtel == ''|| gdObj.bxkesh == '' || gdObj.bxren == '' || gdObj.gzplace == '' || gdObj.wxshx == ''){
            if(gdObj.bxkesh == ''){
                $('.error1').show();
            }else{
                $('.error1').hide();
            }
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');
        }else{
            //获取已选中的工号，然后确定选中人的信息
            var arr = [];

            var allPerson = $('.checker');

            var allWorkNum = $('#fzr-list tbody').find('.workNum');

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
                fzrArr.push(obj);
            }
            //传数据
            var prm = {
                'gdJJ':gdObj.gdtype,
                'bxDianhua':gdObj.bxtel,
                'bxKeshi':$('#bxkesh').children('option:selected').html(),
                'bxKeshiNum':gdObj.bxkesh,
                'bxRen':gdObj.bxren,
                //'':gdObj.pointer,
                'gdFsShij':$('.datatimeblock').eq(2).val(),
                'wxShiX':$('#sbtype').children('option:selected').html(),
                'wxShiXNum':gdObj.sbtype,
                'wxXm':gdObj.wxshx,
                'wxXmNum':'1',
                'wxShebei':gdObj.sbnum,
                'dName':gdObj.sbname,
                'installAddress':gdObj.azplace,
                'wxDidian':gdObj.gzplace,
                'bxBeizhu':$('.gzDesc').val(),
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'gdSrc': 1,
                'gdWxLeaders':fzrArr
            }
            if(flag){
                prm.gdCode = _gdCode;
            }
            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                timeout:_theTimes,
                success:function(result){

                    if(result == 99){

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap',successMeg, '');

                        $('#myModal').modal('hide');

                        //刷新表格
                        conditionSelect();
                    }else{
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap',errorMeg, '');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
    }

    //转换状态
    function upData(){
        var prm = {
            gdCode :_gdCode,
            gdZht : 2,
            wxKeshi:$('#depart').children('option:selected').html(),
            wxKeshiNum:$('#depart').val(),
            userID:_userIdNum,
            userName:_userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
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
            url:_urls + 'YWGD/ywGDAddWxLeader',
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
        if( _wxIsComplete &&  _ztChangeComplete ){
            //提示
            if( _wxIsSuccess && _ztChangeSuccess){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单下发成功！', '');

                $('#myModal').modal('hide');

                conditionSelect();
            }else{
                var str = '';
                if( _wxIsSuccess == false ){
                    str += '维修备注修改失败，'
                }else{
                    str += '维修备注修改成功，'
                }
                if( _ztChangeSuccess == false ){
                    str += '工单下发失败！'
                }else{
                    str += '工单下发成功！'
                }
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,str, '');
            }
        }
    }

    //重发
    function reSend(){
        var prm = {
            "gdCode": _gdCode,
            "gdZht": 2,
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
        if(_wxIsComplete  && _reSendComplete){
            if( _wxIsSuccess && _reSendSuccess){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单下发成功！', '');

                $('#myModal').modal('hide');

                conditionSelect()
            }else{
                var str = '';
                if( _wxIsSuccess == false ){
                    str += '维修备注修改失败，'
                }else{
                    str += '维修备注修改成功，'
                }
                if( _reSendSuccess == false ){
                    str += '工单重发失败！'
                }else{
                    str += '工单重发成功！'
                }
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,str, '');
            }
        }
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