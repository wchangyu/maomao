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

    //报修vue变量
    var gdObj = new Vue({
        el:'#myApp33',
        data:{
            'gdtype':'0',
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
            'wxshx':'',
            'gzplace':''
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
            //报修聚焦事件
            phoneFocus:function(){

                $('.fuzzy-search').hide();

                var e = e||window.event;

                var el = $(e.srcElement);

                el.next().show();

                if(gdObj.bxtel == ''){

                    phoneList($('.fuzzy-search').eq(0),_phoneArr);

                }else{

                    FuzzySearchFun(gdObj.bxtel,_phoneArr,'phone',$('.fuzzy-search').eq(0),phoneList);

                }

                $('.fuzzy-search').eq(0).show();

            },
            //报修电话事件
            phoneInput:function(){

                upDown($('.fuzzy-search').eq(0),bxTelEnterFun,bxTelInputFun);

            },
            //维修事项聚焦事件
            wxShiXFocus:function(){

                $('.fuzzy-search').hide();

                var e = e||window.event;

                var el = $(e.srcElement);

                el.next().show();

                if(gdObj.wxshx == ''){

                    wxShiXList($('.fuzzy-search').eq(1),_wxShiXArr);

                }else{

                    FuzzySearchFun(gdObj.wxshx,_wxShiXArr,'wxname',$('.fuzzy-search').eq(1),wxShiXList);

                }

                $('.fuzzy-search').eq(1).show();

            },
            //维修事项键盘事件
            wxShiXInput:function(){

                upDown($('.fuzzy-search').eq(1),wxShiXEnterFun,wxShiXInputFun);

            },
            //故障位置聚焦事件
            gzwzFocus:function(){

                $('.fuzzy-search').hide();

                var e = e||window.event;

                var el = $(e.srcElement);

                el.next().show();

                if(gdObj.bxkesh == ''){

                    if(gdObj.gzplace == ''){

                        gzwzList($('.fuzzy-search').eq(2),_faultLocationArr);

                    }else{

                        FuzzySearchFun(gdObj.gzplace,_faultLocationArr,'locname',$('.fuzzy-search').eq(2),gzwzList);

                    }



                }else{

                    if( gdObj.gzplace == '' ){

                        gzwzList($('.fuzzy-search').eq(5),_faultLocationArr);

                    }else{

                        FuzzySearchFun(gdObj.gzplace,_faultLocationArr,'locname',$('.fuzzy-search').eq(5),gzwzList);

                    }

                }

            },
            //故障位置键盘事件
            gawzInput:function(){

                upDown($('.fuzzy-search').eq(2),gzwzEnterFun,gzwzInputFun);

            }
        }
    });

    //待关单vue
    var gbObj = new Vue({
        el:'#guanbi',
        data:{
            'gdtype':'0',
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
        }
    })

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
    //ajaxFun('YWDev/ywDMGetDDs', _allBXArr, $('#bxkesh'), 'ddName', 'ddNum');

    //系统类型
    ajaxFun('YWDev/ywDMGetDSs', _allXTArr, $('#sbtype'), 'dsName', 'dsNum');

    //当前选中的工单号
    var _gdCode = '';

    //当前工单状态值
    var _gdZht = '';

    //标记当前打开的是不是报修按钮
    var _isDeng = false;

    //记录当前评价的值
    var _pjValue = 5;

    //重发值
    var _gdCircle = 0;

    //存放员工信息
    var _workerArr = [];

    //获取员工方法
    workerData();

    //所有电话数组
    var _phoneArr = [];

    //过滤后的数组
    var _phoneFilterArr = [];

    //获取所有的电话
    getPhone();

    //维修事项
    getMatter(true);

    var _faultLocationArr = [];

    //故障位置
    getArea();

    //获取报修科室
    bxKShiData();

    //获取维修科室
    wxKShiData();

    /*---------------------------------------------表格初始化----------------------------------------------*/

    //全部状态表格
    var allStateListCol = [
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
        {
            title:'工单状态',
            data:'gdZht',
            render:function(data, type, full, meta){
                if (data == 1) {
                    return '待下发'
                }
                if (data == 2) {
                    return '待分派'
                }
                if (data == 3) {
                    return '待执行'
                }
                if (data == 4) {
                    return '执行中'
                }
                if (data == 5) {
                    return '等待资源'
                }
                if (data == 6) {
                    return '待关单'
                }
                if (data == 7) {
                    return '任务关闭'
                }
                if (data == 11) {
                    return '申诉'
                }
                if (data == 999) {
                    return '任务取消'
                }
            }
        },
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
            title:'执行人',
            data:'wxUserNames'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'验收人',
            data:'yanShouRenName'
        }
        //{
        //    title:'操作',
        //    data:null,
        //    defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
        //}
    ];

    _tableInit($('#allState-list'),allStateListCol,'2','','','');

    //未受理表格
    var missedListCol = [
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
            title:'报修时间',
            data:'gdFsShij'
        },
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
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>"
        }
    ];


    _tableInit($('#missed-list'),missedListCol,'2','','','');

    //未接单
    var notEntertainedCol = [
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
            title:'报修时间',
            data:'gdFsShij'
        },
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
        }
    ];

    _tableInit($('#not-entertained'),notEntertainedCol,'2','','','');

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
            title:'执行人',
            data:'wxUserNames'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看记录</span>"
        }
    ];

    _tableInit($('#in-execution'),inExecutionCol,'2','','','');

    //等待资源
    var waitingMaterial = [
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
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'维修科室',
            data:'wxKeshi'
        },
        {
            title:'等待原因',
            data:'dengyy',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '等待技术支持'

                }else if(data == 2){

                    return '等待配件'

                }else if( data == 3 ){

                    return '等待外委施工'

                }
            }
        },
        {
            title:'预计完成时间',
            data:'yjShij'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看记录</span>"
        }
    ]

    _tableInit($('#waiting-material'),waitingMaterial,'2','','','');

    //待关单表格
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
            title:'执行人',
            data:'wxUserNames'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'验收人',
            data:'yanShouRenName'
        },
        {
            title:'自动关单',
            data:'autoCloseTime'
        }
        //{
        //    title:'操作',
        //    data:null,
        //    defaultContent: "<span class='data-option option-close btn default btn-xs green-stripe'>关单</span><span class='data-option option-appeal btn default btn-xs green-stripe'>申诉</span>"
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
            title:'执行人',
            data:'wxUserNames'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'验收人',
            data:'yanShouRenName'
        }
        //{
        //    title:'操作',
        //    data:null,
        //    defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
        //}
    ];

    _tableInit($('#closing-list'),closingListCol,'2','','','');

    //执行人列表
    var fzrListCol = [
        {
            title:'工号',
            data:'wxRen',
            className:'workNum'
        },
        {
            title:'执行人名称',
            data:'wxRName'
        },
        //{
        //    title:'职位',
        //    data:'pos'
        //},
        {
            title:'联系电话',
            data:'wxRDh'
        }
    ];

    tableInit($('#fzr-list'),fzrListCol,'2','','','');

    //材料表格
    var outClListCol = [
        {
            title:'序号',
            data:'mc',
            render:function(data, type, full, meta){

                return meta.row + 1
            }
        },
        {
            title:'名称',
            data:'wxClName'
        },
        {
            title:'规格型号',
            data:'size',
            className:'bjbm'
        },
        {
            title:'数量',
            data:'clShul'
        },
        {
            title:'单价（元）',
            data:'wxClPrice'
        },
        {
            title:'金额（元）',
            data:'wxClAmount'
        }
    ];

    tableInit($('#cl-list'),outClListCol,'2','','','');

    //电话表格
    var phoneTable = $('#choose-phone-table').DataTable({
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
                title:'电话',
                data:'phone',
                class:'adjust-comment'
            },
            {
                title:'地点名称',
                data:'locname',
                class:'',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            },
            {
                title:'描述',
                data:'info'
            }
        ]
    });

    //数据加载
    conditionSelect(true);

    /*-------------------------------------------------按钮事件-----------------------------------------*/

    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tabDiv = $(this).parents('.table-title').next().children('div');
        tabDiv.addClass('hide-block');
        tabDiv.eq($(this).index()).removeClass('hide-block');
    });

    //报修按钮
    $('.creatButton').click(function(){

        _isDeng = true;

        //显示模态框
        _moTaiKuang($('#myModal'), '报修', '', '' ,'', '报修');

        //增加报修类
        $('#myModal').find('.btn-primary').removeClass('bianji').addClass('dengji');

        //故障描述可操作
        $('.gzDesc').removeAttr('readonly').removeClass('disabled-block');

        //报修人电话可操作
        $('.bx-choose').removeAttr('readonly').removeClass('disabled-block');

        //初始化
        dataInit();
    });

    //重置按钮
    $('.resites').click(function(){

        //input清空
        $('.filterInput').val('');

        //时间重置
        $('.datatimeblock').eq(0).val(st);

        $('.datatimeblock').eq(1).val(et);
    })

    //模态框加载完成后设置发生时间
    $('#myModal').on('shown.bs.modal', function () {

        if(_isDeng){

            console.log(_workerArr);

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
        }

        _isDeng = false;
    });

    //故障原因选择
    $('#gzDesc').change(function(){
        var aa = $('#gzDesc').val();
        $('.gzDesc').val(aa);
        //$('.gzDesc').val($('#gzDesc').val());
    })

    //报修确定按钮
    $('#myModal')
        .on('click','.dengji',function(){

            optionData('YWGD/ywGDCreDJ','添加成功!','添加失败!','');
        })
        .on('click','.bianji',function(){

            optionData('YWGD/ywGDUpt','编辑成功!','编辑失败!','flag');

        })

    //表格查看按钮
    $('#missed-list')
        .on('click','.option-see',function(){
            //当前选中的工单号
            _gdCode = $(this).parents('tr').children('.gdCode').children('span').children('a').html();
            //信息绑定
            bindData($(this),$('#missed-list'));
            //模态框显示
            _moTaiKuang($('#myModal'), '详情', 'flag', '' ,'', '');
        })
        .on('click','.option-edit',function(){

            //当前选中的工单号

            _gdCode = $(this).parents('tr').children('.gdCode').children('span').children('a').html();

            //信息绑定
            bindData($(this),$('#missed-list'));

            //模态框显示
            _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');

            //添加编辑类
            $('#myModal').find('.btn-primary').removeClass('dengji').addClass('bianji');

            //报修人电话可操作
            $('.bx-choose').removeAttr('readonly').removeClass('disabled-block');

        })

    //查询按钮
    $('#selected').click(function(){
        //条件查询
        conditionSelect(true);
    })

    ////执行中【查看】
    //$('#in-execution').on('click','.option-see',function(){
    //
    //    //绑定数据
    //    bindData($(this),$('#in-execution'));
    //
    //    //模态框
    //    _moTaiKuang($('#myModal'), '查看详情', 'flag', '' ,'', '');
    //
    //})

    //待关单【关单】
    $('#waiting-list').on('click','.option-close',function(){

        _gdCode = $(this).parents('tr').children('.gdCode').children('span').children('a').html();


        _gdZht = $(this).parents('tr').children('.gdCode').children('span').attr('data-zht');

        _gdCircle = $(this).parents('tr').children('.gdCode').children('span').attr('data-circle');

        //绑定数据
        var prm = {
            'gdCode':_gdCode,
            'gdCircle':_gdCircle,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            timeout:_theTimes,
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){
                //绑定数据
                gbObj.bxtel = result.bxDianhua;
                gbObj.bxkesh = result.bxKeshi;
                gbObj.bxren = result.bxRen;
                gbObj.gztime = result.gdFsShij;
                gbObj.sbtype = result.wxShiX;
                gbObj.sbnum = result.wxShebei;
                gbObj.sbname = result.dName;
                gbObj.azplace = result.installAddress;
                gbObj.gzplace = result.wxDidian;
                gbObj.wxshx = result.wxXm;
                gbObj.wxbz = result.wxKeshi;
                gbObj.wxcontent = result.wxBeizhu;
                $('.gzDesc').val(result.bxBeizhu);
                //    'pointer':'',
                //维修材料清单
                var clListArr = result.wxCls;
                if(clListArr.length > 0){
                    _datasTable($('#cl-list'),clListArr);
                }
                //执行人表格
                var fzrArr = result.wxRens;
                _datasTable($('#fzr-list'),fzrArr);

                //绑定部门信息
                $('#depart').val(result.wxKeshiNum);
                //验收人
                $('#receiver').val(result.yanShouRenName);
                //工时费
                $('#hourFee').val(result.gongShiFee);
                //合计费用
                $('#total').val(result.gdFee);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })

        //模态框
        _moTaiKuang($('#myModal1'), '待关单', '', '' ,'', '关单');

        //添加两个按钮
        //var str = '<button class="btn btn-primary shensu">申诉</button><button class="btn btn-primary guanbi">关单</button>';
        //
        //$('#myModal1').find('.modal-footer').prepend(str);

        $('#myModal1').find('.modal-footer').find('.btn-primary').removeClass('shensu').addClass('guanbi');

        //input不可操作；
        $('.no-edit1').find('.single-block').children('input').attr('readOnly','readOnly').addClass('disabled-block');

        //select不可操作
        $('.no-edit1').find('.single-block').children('select').attr('disabled',true).addClass('disabled-block');

        //故障描述
        $('.gzDesc').attr('readOnly','readOnly').addClass('disabled-block');

        //部门不可操作
        $('#depart').attr('disabled',true).addClass('disabled-block');

        //维修内容
        $('.wxcontent').attr('disabled',true).addClass('disabled-block');

        //关单操作的时候，申诉理由框隐藏，申诉按钮隐藏
        $('.reasons-appeal').hide();

        //评价框显示，关单按钮显示
        $('.satisfaction-degree').show();

    })

    //待关单【申诉】
    $('#waiting-list').on('click','.option-appeal',function(){

        _gdCode = $(this).parents('tr').children('.gdCode').children('span').children('a').html();


        _gdZht = $(this).parents('tr').children('.gdCode').children('span').attr('data-zht');

        _gdCircle = $(this).parents('tr').children('.gdCode').children('span').attr('data-circle');

        //绑定数据
        var prm = {
            'gdCode':_gdCode,
            'gdCircle':_gdCircle,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            timeout:_theTimes,
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){
                //绑定数据
                gbObj.bxtel = result.bxDianhua;
                gbObj.bxkesh = result.bxKeshi;
                gbObj.bxren = result.bxRen;
                gbObj.gztime = result.gdFsShij;
                gbObj.sbtype = result.wxShiX;
                gbObj.sbnum = result.wxShebei;
                gbObj.sbname = result.dName;
                gbObj.azplace = result.installAddress;
                gbObj.gzplace = result.wxDidian;
                gbObj.wxshx = result.wxXm;
                gbObj.wxbz = result.wxKeshi;
                gbObj.wxcontent = result.wxBeizhu;
                $('.gzDesc').val(result.bxBeizhu);
                //    'pointer':'',
                //维修材料清单
                var clListArr = result.wxCls;
                if(clListArr.length > 0){
                    _datasTable($('#cl-list'),clListArr);
                }
                //执行人表格
                var fzrArr = result.wxRens;
                _datasTable($('#fzr-list'),fzrArr);

                //绑定部门信息
                $('#depart').val(result.wxKeshiNum);
                //验收人
                $('#receiver').val(result.yanShouRenName);
                //工时费
                $('#hourFee').val(result.gongShiFee);
                //合计费用
                $('#total').val(result.gdFee);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })

        //模态框
        _moTaiKuang($('#myModal1'), '待申诉', '', '' ,'', '申诉');

        //添加两个按钮
        //var str = '<button class="btn btn-primary shensu">申诉</button><button class="btn btn-primary guanbi">关单</button>';

        //$('#myModal1').find('.modal-footer').prepend(str);

        $('#myModal1').find('.modal-footer').find('.btn-primary').removeClass('guanbi').addClass('shensu');

        //input不可操作；
        $('.no-edit1').find('.single-block').children('input').attr('readOnly','readOnly').addClass('disabled-block');

        //select不可操作
        $('.no-edit1').find('.single-block').children('select').attr('disabled',true).addClass('disabled-block');

        //故障描述
        $('.gzDesc').attr('readOnly','readOnly').addClass('disabled-block');

        //部门不可操作
        $('#depart').attr('disabled',true).addClass('disabled-block');

        //维修内容
        $('.wxcontent').attr('disabled',true).addClass('disabled-block');

        //申诉操作的时候，申诉理由框显示，申诉按钮显示
        $('.reasons-appeal').show();

        //评价框隐藏，关单按钮隐藏
        $('.satisfaction-degree').hide();


    })

    //评价单选按钮
    $('.pjRadio').click(function(){

        $('.pjRadio').parent('span').removeClass('checked');

        $(this).parent('span').addClass('checked');

        _pjValue = $('#pingjia1').find('.checked').children('input').attr('data-attr');

    });

    //申诉
    $('#myModal1').on('click','.shensu',function(){
        var prm = {
            gdCode:_gdCode,
            gdZht:11,
            userID:_userIdNum,
            userName:_userIdName,
            shenSuMemo:$('#reasons-appeal').val()
        };

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
            timeout:_theTimes,
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){
                if(result == 99){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'申诉成功！', '');

                    conditionSelect();

                    $('#myModal1').modal('hide');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'申诉失败！', '');

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    })

    //关单
    $('#myModal1').on('click','.guanbi',function(){

        var prm = {
            'gdCode':_gdCode,
            'pjBz': $('#pingjia').val(),
            'pingjia':_pjValue,
            'userID':_userIdNum,
            'userName':_userIdName
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptPingjia',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                if(result == 99){

                    var gdInfo = {
                        'gdCode':_gdCode,
                        'gdZht':7,
                        'userID':_userIdNum,
                        'userName':_userIdName
                    }

                    $.ajax({
                        type:'post',
                        url: _urls + 'YWGD/ywGDUptZht',
                        data:gdInfo,
                        beforeSend: function () {
                            $('#theLoading').modal('show');
                        },
                        complete: function () {
                            $('#theLoading').modal('hide');
                        },
                        success:function(result){
                            if(result == 99){

                                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'关单成功！', '');

                                conditionSelect();

                                $('#myModal1').modal('hide');
                            }else {

                                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'关单失败！', '');

                            }
                        },
                        error:function(jqXHR, textStatus, errorThrown){
                            console.log(jqXHR.responseText);
                        }
                    })

                }else{

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'关单失败！', '');

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })

    });

    //维修项目表格
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
                data:'wxnum',
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

    //选择维修事项弹窗打开后
    $('#choose-building').on('shown.bs.modal', function () {

        $('#add-select').val(' ');

        _datasTable($('#choose-metter'),_wxShiXArr);


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
                $('#matter').val(dom.eq(i).children().eq(3).find('span').html())

                gdObj.wxshx = dom.eq(i).children().eq(3).find('span').html();


                $('#matter').attr('data-mnum',dom.eq(i).children().eq(2).html());

                $('#choose-building').modal('hide');

                return false
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应维修事项', '')

    });

    //维修项目表格
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

        _datasTable($('#choose-area-table'),_faultLocationArr);

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

                console.log(dom.eq(i).children().eq(3).find('span').html());

                gdObj.gzplace = dom.eq(i).children().eq(3).find('span').html();

                $('#choose-area').modal('hide');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应故障地点', '')

    });

    //获取日志信息

    $('#in-execution').on('click','.option-see',function(){
        //获取工单号
        var gdCode = $(this).parents('tr').find('.gdCode a').html();
        logInformation(0,gdCode);

        $('#myModal5').modal('show');
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

                datasTable($('#choose-metter'),result);
            }
        })
    });

    //选择电话弹窗打开后
    $('#choose-phone').on('shown.bs.modal', function () {

        //初始化
        _datasTable($('#choose-phone-table'),_phoneArr);

    });

    //选择电话确定按钮
    $('#choose-phone .btn-primary').on('click',function() {
        var dom = $('#choose-phone-table tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //seekArr.push(dom.eq(i).children().eq(1).html())

                gdObj.bxtel = dom.eq(i).find('.adjust-comment').html();

                $('#choose-phone').modal('hide');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应电话', '')

    });

    //失去焦点
    $(document).on('click',function(e){

        if( e.srcElement.className.indexOf('fuzzy-input')<0){

            $('.fuzzy-search').hide();

        }

    })

    //模糊搜索下拉框
    $('.fuzzy-search').on('mouseover','li',function(){

        $(this).parent('ul').children().removeClass('li-color');

        $(this).addClass('li-color');

    })

    //模糊搜索选中-报修电话
    $('.fuzzy-search').eq(0).on('click','li',function(){

        var selected =  $(this).parent('ul').find('.li-color');

        //赋值
        phoneAssignment(selected);

    })

    //维修事项
    $('.fuzzy-search').eq(1).on('click','li',function(){

        var selected =  $(this).parent('ul').find('.li-color');

        wxShiXAssignment(selected);

    })

    //故障位置
    $('.fuzzy-search').eq(2).on('click','li',function(){

        var selected =  $(this).parent('ul').find('.li-color');

        gzwzAssignment(selected);

    })

    /*------------------------------------------------其他方法--------------------------------------------*/
    //获取日志信息（备件logType始终传2）
    function logInformation(logType,gdCode){

        var gdLogQPrm = {
            "gdCode": gdCode,
            "logType": logType,
            "userID": _userIdNum,
            "userName": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywDGGetLog',
            data:gdLogQPrm,
            success:function(result){
                if(logType == 2){
                    var str = '';
                    for(var i =0;i<result.length;i++){
                        str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                    }
                    $('.deal-with-list').empty();
                    $('.deal-with-list').append(str);
                }else if(logType == 1){
                    var str = '';
                    for(var i=0;i<result.length;i++){
                        str += '<li><span class="list-dot"> </span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;' + result[i].logTitle + '</li>';
                    }
                    $('.processing-record ul').empty();
                    $('.processing-record ul').append(str);
                }else{
                    var str = '';
                    for(var i =0;i<result.length;i++){
                        str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                    }
                    $('.processing-record ul').empty();
                    $('.processing-record ul').append(str);
                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //维修事项数组
    var _wxShiXArr = [];

    //获取维修事项
    function getMatter(flag){

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDWxxmGetAll',
            data:{
                "wxnum": ""
            },
            success:function(result){

                if(flag){

                    _wxShiXArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _wxShiXArr.push(result[i]);

                    }

                }else{

                    datasTable($('#choose-metter'),result);

                }

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

                _faultLocationArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _faultLocationArr.push(result[i]);

                }

                //直接将故障位置赋值
                gdObj.gzplace = $('.fuzzy-search').eq(2).children().eq(0).children().eq(0).html();

                //datasTable($('#choose-area-table'),result);
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

    }

    function datasTable(tableId,arr){


        if(arr.length == 0){
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnDraw();
        }else{
            //arr.reverse();
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }

    }

    //报修项初始化
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
        gdObj.wxshx='';
        $('.gzDesc').val('');
        //报修科室
        $('#depWX').val('');
    }

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
                var str = '<option value=" ">请选择</option>';
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

    //条件查询
    function conditionSelect(flag,part){

        var st = $('.min').val();

        var et = moment($('.max').val()).add(1,'d').format('YYYY/MM/DD');

        var prm = {
            'gdCode':$('.filterInput').val(),
            'gdSt':st,
            'gdEt':et,
            'isQueryAutoCloseTime':1,
            'userID': _userIdNum,
            'userName': _userIdName,
            'b_UserRole':_userRole,
            'createUser':_userIdNum
        }

        if(!part){

            if($('.modal-backdrop').length > 0){

                theTimeout = setTimeout(function(){

                    conditionSelect(true);

                },refreshTime);

                return false;
            }

        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDJ',
            data:prm,
            timeout:_theTimes,
            beforeSend: _beforeSendFun,
            complete: _completeFun,
            success:function(result){

                //根据状态值给表格赋值
                var zht0=[], zht1=[],zht2=[],zht4=[],zht5=[],zht6=[],zht7=[];
                for(var i=0;i<result.length;i++){
                    if(result[i].gdZht != 7){
                        zht0.push(result[i]);
                    }
                    if(result[i].gdZht == 1 || result[i].gdZht == 11) {
                        zht1.push(result[i]);
                    }else if(result[i].gdZht == 2){
                        zht2.push(result[i]);
                    }else if(result[i].gdZht == 4){
                        zht4.push(result[i]);
                    }else if(result[i].gdZht == 6){
                        zht6.push(result[i]);
                    }else if(result[i].gdZht == 7){
                        zht7.push(result[i]);
                    }else if(result[i].gdZht == 5){

                        zht5.push(result[i]);
                    }
                }
                //全部
                _datasTable($('#allState-list'),zht0);
                //未受理
                _datasTable($('#missed-list'),zht1);
                //未接单not-entertained
                _datasTable($('#not-entertained'),zht2);
                //执行中
                _datasTable($('#in-execution'),zht4);
                //等待材料
                _datasTable($('#waiting-material'),zht5);
                //待关单
                _datasTable($('#waiting-list'),zht6);
                //已关单
                _datasTable($('#closing-list'),zht7);

                //定时刷新
                if(flag){

                    theTimeout = setTimeout(function(){

                        conditionSelect(true);

                    },refreshTime);
                }

                $('#theLoading').modal('hide');
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

        //请求数据
        var prm = {
            'gdCode':_gdCode,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole
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
                $('.gzDesc').val(result.bxBeizhu);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //报修、编辑方法(编辑的时候传参数flag)
    function optionData(url,successMeg,errorMeg,flag){

        //验证非空
        if(gdObj.bxtel == ''|| gdObj.bxkesh == '' || gdObj.bxren == '' || gdObj.gzplace == '' || gdObj.wxshx == '' || $('#depWX').val() == ''){
            if(gdObj.bxkesh == ''){
                $('.error1').show();
            }else{
                $('.error1').hide();
            }
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

        }else{


            var prm = {
                'gdJJ':gdObj.gdtype,
                'gdRange':gdObj.xttype,
                'bxDianhua':gdObj.bxtel,
                'bxKeshi':$('#bxkesh').children('option:selected').html(),
                'bxKeshiNum':gdObj.bxkesh,
                'bxRen':gdObj.bxren,
                //'':gdObj.pointer,
                'gdFsShij':$('.datatimeblock').eq(2).val(),
                //'wxShiX':$('#sbtype').children('option:selected').html(),
                'wxShiX':'null',
                //'wxShiXNum':gdObj.sbtype,
                'wxXm':gdObj.wxshx,
                'wxXmNum':$('#matter').attr('data-mnum'),
                'wxShebei':gdObj.sbnum,
                'dName':gdObj.sbname,
                'installAddress':gdObj.azplace,
                'wxDidian':gdObj.gzplace,
                'bxBeizhu':$('.gzDesc').val(),
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'gdSrc': 4,
                'gdLeixing':4,
                //维修科室
                'wxKeshi':$('#depWX').children('option:checked').html(),
                //num
                'wxKeshiNum':$('#depWX').val()
            }

            if(flag){
                prm.gdCode = _gdCode
            }

            $.ajax({
                type:'post',
                url:_urls + url ,
                timeout:_theTimes,
                data:prm,
                success:function(result){

                    if (result == 99) {

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap',successMeg, '');

                        $('#myModal').modal('hide');

                        $('#myModal2').off('shown.bs.modal').on('shown.bs.modal',function(){

                            conditionSelect(false,true);

                        })

                    } else {

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap',errorMeg, '');

                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }
            })
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
                var str = '<option value=" ">请选择</option>';
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

    //初始化
    function tableInit(tableId,col,buttons,flag,fnRowCallback,drawCallback){
        var buttonVisible = [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs'
            }
        ];
        var buttonHidden = [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs hiddenButton'
            }
        ];
        if(buttons == 1){
            buttons = buttonVisible;
        }else{
            buttons =  buttonHidden;
        }
        var _tables = tableId.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": false,   //是否分页
            "destroy": true,//还原初始化了的datatable
            "searching": false,
            "ordering": false,
            "iDisplayLength":50,//默认每页显示的条数
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '',
                'info': '',
                'infoEmpty': '',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            "dom":'t<"F"lip>',
            'buttons':buttons,
            "columns": col,
            "fnRowCallback": fnRowCallback,
            "drawCallback":drawCallback
        });
        if(flag){
            _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
        }

    }

    //获取电话
    function getPhone(){

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/SysPhoneGetALl',
            data:{
                "phone": "",
                "locnum": "",
                "locname": "",
                "info": "",
                "memo": "",
                "departnum":$('#bxkesh').val()
            },
            success:function(result){

                _phoneArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _phoneArr.push(result[i]);

                }

                datasTable($('#choose-phone-table'),result);
            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log(jqXHR.responseText);

            }
        })
    };

    //隐藏分页
    $('#choose-metter_length').hide();
    $('#choose-area-table_length').hide();

    //报修电话li
    function phoneList(el,arr){

        console.log(arr);

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<li>' + '<span>' + arr[i].phone  + '</span>' + '<span>' + arr[i].departname + '</span>' +  '<span>' + arr[i].info + '</span>'  + '</li>'

        }

        el.empty().append(str);

    }

    //电话报修赋值（点击、回车事件）
    function phoneAssignment(thisLi){

        gdObj.bxtel = thisLi.children('span').eq(0).html();

        $('#binding-phone').val(gdObj.bxtel);

    }

    //模糊搜索
    function FuzzySearchFun(values,arr,attr,el,fun){

        var values = $.trim(values);

        //过滤后的数组
        var filterArr = [];

        for(var i=0;i<arr.length;i++){

            if(arr[i][attr].indexOf(values) >= 0){

                filterArr.push(arr[i]);

            }

        }

        fun(el,filterArr);

    }

    //维修事项li
    function wxShiXList(el,arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<li>' + '<span>' + arr[i].wxname  + '</span>' + '<span>' + arr[i].wxclassname + '</span>' +  '<span>' + arr[i].memo + '</span>' + '<span style="display: none">' + arr[i].wxnum + '</span>'  + '</li>'

        }

        el.empty().append(str);

    }

    //维修事项赋值（点击、回车事件）
    function wxShiXAssignment(thisLi){

        gdObj.wxshx = thisLi.children('span').eq(0).html();

        var attrValues = thisLi.children('span').eq(3).html();

        //属性值
        $('#matter').attr('data-mnum',attrValues);

    }

    //故障位置li
    function gzwzList(el,arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<li>' + '<span>' + arr[i].locname  + '</span>' + '<span>' + arr[i].departname + '</span>' +  '<span>' + arr[i].ddname + '</span>' + '<span style="display: none;">'+ arr[i].dsNum +'</span>' + '<span>' + arr[i].departnum + '</span>' +'</li>'

        }

        el.empty().append(str);

    }

    //故障位置（点击、回车事件）
    function gzwzAssignment(thisLi){

        gdObj.gzplace = thisLi.children('span').eq(0).html();

    }

    //下拉列表(上下键记录)
    var _numIndex = -1;

    function upDown(ul,enterFun,inputFun){

        var e = e||window.event;

        var chils = ul.children();

        var lengths = chils.length;

        if(e.keyCode == 40){

            if(_numIndex < lengths -1){

                _numIndex ++ ;

            }else{

                _numIndex = lengths -1;

            }

            ul.children().removeClass('li-color');

            ul.children().eq(_numIndex).addClass('li-color');

            //滚动条问题
            if(_numIndex> 4){

                var moveDis = (_numIndex - 4)*26;

                ul.scrollTop(moveDis);
            }

        }else if(e.keyCode == 38){

            if(_numIndex < 1){

                _numIndex =0;

            }else{

                _numIndex--;

            }

            ul.children().removeClass('li-color');

            ul.children().eq(_numIndex).addClass('li-color');

            //滚动条问题
            if(lengths-4>_numIndex){

                var moveDis = (_numIndex - 4)*26;

                ul.scrollTop(moveDis);

            }

        }else if(e.keyCode == 13){

            enterFun();

        }else if(e != 9){

            _numIndex = -1;

            inputFun();

        }
    }

    //报修电话输入事件
    var bxTelInputFun = function(){

        FuzzySearchFun(gdObj.bxtel,_phoneArr,'phone',$('.fuzzy-search').eq(0),phoneList);

    }

    //报修电话回车事件
    var bxTelEnterFun = function(){

        var selected =  $('.fuzzy-search').eq(0).find('.li-color');

        //赋值
        phoneAssignment(selected);

        _numIndex = -1;

        $('.fuzzy-search').eq(0).hide();

    }

    //维修事项输入事件
    var wxShiXInputFun = function(){

        FuzzySearchFun(gdObj.wxshx,_wxShiXArr,'wxname',$('.fuzzy-search').eq(1),wxShiXList);

    }

    //维修事项回车事件
    var wxShiXEnterFun = function(){

        var selected =  $('.fuzzy-search').eq(1).find('.li-color');

        //赋值
        wxShiXAssignment(selected);

        _numIndex = -1;

        $('.fuzzy-search').eq(1).hide();

    }

    //故障位置输入事件
    var gzwzInputFun = function(){

        if( gdObj.bxkesh == '' ){

            FuzzySearchFun(gdObj.gzplace,_faultLocationArr,'locname',$('.fuzzy-search').eq(2),gzwzList);

        }else{

            FuzzySearchFun(gdObj.gzplace,_faultLocationArr,'locname',$('.fuzzy-search').eq(2),gzwzList);

        }

    }

    //故障位置回车事件
    var gzwzEnterFun = function(){

        var selected =  $('.fuzzy-search').eq(2).find('.li-color');

        gzwzAssignment(selected);

        $('.fuzzy-search').eq(2).hide();

    }

    function wxKShiData(){

        var prm = {
            'departName':'',
            'userID':_userIdNum,
            'userName':_userIdName,
            'isWx':'1'
        };
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){

                    _allBXArr.push(result[i]);

                    str += '<option value="' + result[i].departNum +
                        '">' + result[i].departName + '</option>>';
                }
                $('#depWX').empty().append(str);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    };

})