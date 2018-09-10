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
    //vue变量
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
            'wxbz':'',
            'wxxm':''
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
            phoneInput:function(){

                upDown($('.fuzzy-search').eq(0),bxtelEnterFun,bxtelInputFun);

            },
            bxKeShiFocus:function(){

                $('.fuzzy-search').hide();

                var e = e||window.event;

                var el = $(e.srcElement);

                el.next().show();

                //首先判断报修电话是否为空
                if( $('#bxtel').val() == '' ){

                    if(gdObj.bxkesh == ''){

                        bxKeshiList($('.fuzzy-search').eq(1),_bxKShiByTelArr);

                    }else{

                        FuzzySearchFun(gdObj.bxkesh,_bxKShiByTelArr,'departName',$('.fuzzy-search').eq(1),bxKeshiList);

                    }

                }else{

                    if(gdObj.bxkesh == ''){

                        bxKeshiList($('.fuzzy-search').eq(1),_bxKShiFilterArr);

                    }else{

                        FuzzySearchFun(gdObj.bxkesh,_bxKShiFilterArr,'departName',$('.fuzzy-search').eq(1),bxKeshiList);

                    }


                }

                $('.fuzzy-search').eq(1).show();

            },
            bxKeShiInput:function(){

                upDown($('.fuzzy-search').eq(1),bxKeshiEnterFun,bxKeshiInputFun);

            },
            workerFocus:function(){

                $('.fuzzy-search').hide();

                var e = e||window.event;

                var el = $(e.srcElement);

                el.next().show();

                //首先判断报修科室是否为空
                if( $('#bxkesh').val() == '' ){

                    if(gdObj.bxren == ''){

                        workerList($('.fuzzy-search').eq(2),_workerArr);

                    }else{

                        FuzzySearchFun(gdObj.bxren,_workerArr,'userName',$('.fuzzy-search').eq(2),workerList);

                    }

                }else{

                    if( gdObj.bxren == '' ){

                        workerList($('.fuzzy-search').eq(2),_workerFilterArr);

                    }else{

                        FuzzySearchFun(gdObj.bxren,_workerFilterArr,'userName',$('.fuzzy-search').eq(2),workerList);

                    }

                }

                $('.fuzzy-search').eq(2).show();

            },
            workerInput:function(){

                upDown($('.fuzzy-search').eq(2),bxrenEnterFun,bxrenInputFun);

            },
            wxShiXFocus:function(){

                $('.fuzzy-search').hide();

                var e = e||window.event;

                var el = $(e.srcElement);

                el.next().show();

                if(gdObj.wxxm == ''){

                    wxShiXList($('.fuzzy-search').eq(4),_wxShiXArr);

                }else{

                    FuzzySearchFun(gdObj.wxxm,_wxShiXArr,'wxname',$('.fuzzy-search').eq(4),wxShiXList);

                }

                $('.fuzzy-search').eq(4).show();

            },
            wxShiXInput:function(){

                upDown($('.fuzzy-search').eq(4),wxShiXEnterFun,wxShiXInputFun);

            },
            sbFocus:function(){

                $('.fuzzy-search').hide();

                var e = e||window.event;

                var el = $(e.srcElement);

                el.next().show();

                if($('#sbtype').val() == ''){

                    if( gdObj.sbname == '' ){

                        sbList($('.fuzzy-search').eq(3),equipmentArr);

                    }else{

                        FuzzySearchFun(gdObj.sbname,equipmentArr,'dName',$('.fuzzy-search').eq(3),sbList);

                    }

                }else{

                    if( gdObj.sbname == '' ){

                        sbList($('.fuzzy-search').eq(3),equipmentFilterArr);

                    }else{

                        FuzzySearchFun(gdObj.sbname,equipmentFilterArr,'dName',$('.fuzzy-search').eq(3),sbList);

                    }

                }

                $('.fuzzy-search').eq(3).show();

            },
            sbInput:function(){

                upDown($('.fuzzy-search').eq(3),sbEnterFun,sbInputFun);

            },
            gzwzFocus:function(){

                $('.fuzzy-search').hide();

                var e = e||window.event;

                var el = $(e.srcElement);

                el.next().show();

                if(gdObj.bxkesh == ''){

                    if(gdObj.gzplace == ''){

                        gzwzList($('.fuzzy-search').eq(5),_faultLocationArr);

                    }else{

                        FuzzySearchFun(gdObj.gzplace,_faultLocationArr,'locname',$('.fuzzy-search').eq(5),gzwzList);

                    }



                }else{

                    if( gdObj.gzplace == '' ){

                        gzwzList($('.fuzzy-search').eq(5),_faultLocationFilterArr);

                    }else{

                        FuzzySearchFun(gdObj.gzplace,_faultLocationFilterArr,'locname',$('.fuzzy-search').eq(5),gzwzList);

                    }

                }

            },
            gawzInput:function(){

                upDown($('.fuzzy-search').eq(5),gzwzEnterFun,gzwzInputFun);

            }
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

    //系统类型
    ajaxFun('YWDev/ywDMGetDSs', _allXTArr, $('#sbtype'), 'dsName', 'dsNum');

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

    //编辑是否完成
    var _editIsComplete = false;

    //编辑是否成功
    var _editIsSuccess = false;

    //重发是否完成
    var _reSendComplete = false;

    //重发执行结果
    var _reSendSuccess = false;

    //标记当前打开的是不是按钮
    var _isDeng = false;

    //存放员工信息数组
    var _workerArr = [];

    //过滤之后员工信息数组
    var _workerFilterArr = [];

    //获得员工信息方法
    //workerData();

    workerData1(true);

    //部门
    getDepartment();

    //存放所有报修电话的数组
    var _phoneArr = [];

    //首先获取报修电话
    getPhone(true);

    //根据报修电话获取科室列表
    var _bxKShiByTelArr = [];

    //过滤后的科室列表
    var _bxKShiFilterArr = [];

    //根据电话获取科室
    bxKShiByTel(true);

    //存放所有维修事项的数组
    var _wxShiXArr = [];

    //获取维修事项
    getMatter(true);

    //所有故障位置
    var _faultLocationArr = [];

    //过滤后的故障位置
    var _faultLocationFilterArr = [];

    //故障地点
    getArea(true);

    /*--------------------------------------------表格初始化---------------------------------------------*/

    //超时表格
    var moreTimeCol = [
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
            title:'报修科室',
            data:'bxKeshi'
        },
        {
            title:'报修人',
            data:'bxRen'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'维修科室',
            data:'wxKeshi',
            render:function(data, type, row, meta){
               return '<span class="wx-ks" data-num="'+row.wxKeshiNum+'">'+data+'</span>'
            }
        },
        {
            title:'超时',
            data:'exceedTimePaig',
            render:function(data, type, full, meta){
                if(data == 0){

                    return '<span style="color: black">' + data + '</span>';

                }else if(data != 0){

                    return '<span style="color: red">' + data + '</span>';

                }
            }
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-issued btn default btn-xs green-stripe'>查看班长</span>"
        }
    ];

    _tableInit($('#more-time'),moreTimeCol,'2','','','');

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
            defaultContent: "<span class='data-option option-issued btn default btn-xs green-stripe'>下发</span><span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span><span class='data-option option-cancel btn default btn-xs green-stripe'>取消</span>"
        }
    ];

    _tableInit($('#pending-list'),pendingListCol,'2','','','');

    //回退工单
    _tableInit($('#back-list'),pendingListCol,'2','','','');

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

    //查看班长表格
    var monitorTable = $('#examine-depart-table').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': false,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': false,
        'ordering': false,
        'language': {
            'emptyTable': '无班长信息',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '',
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
                title:'工号',
                data:'userNum',
                className:'workNum'
            },
            {
                title:'姓名',
                data:'userName'
            },
            {
                title:'职位',
                data:'pos'
            },
            {
                title:'联系电话',
                data:'mobile'
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
                    '"data-gdCircle="' + full.gdCircle +
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
            title:'维修科室',
            data:'wxKeshi',
            class:'WXBZ'
        },
        {
            title:'维修事项',
            data:'wxXm',
            className:'WXSX'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-callback btn default btn-xs green-stripe'>回退</span>" +

            "<span class='data-option option-cancel btn default btn-xs green-stripe'>取消</span>"
        }
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
                    '"data-gdCircle="' + full.gdCircle +
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
            data:'wxXm',
            className:'WXSX'
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
            data:'wxKeshi',
            className:'WXBZ'
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
            defaultContent: "<span class='data-option option-callback btn default btn-xs green-stripe'>回退</span>" +
            "<span class='data-option option-cancel btn default btn-xs green-stripe'>取消</span>"
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
                    '"data-gdCircle="' + full.gdCircle +
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
            data:'wxXm',
            className:'WXSX'
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
            data:'wxKeshi',
            className:'WXBZ'
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
            defaultContent: "<span class='data-option option-callback btn default btn-xs green-stripe'>回退</span>" +
            "<span class='data-option option-cancel btn default btn-xs green-stripe'>取消</span>"
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
            data:'wxXm',
            className:'WXSX'
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
            data:'wxKeshi',
            className:'WXBZ'
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
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-cancel btn default btn-xs green-stripe'>取消</span>"
        }
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
        //{
        //    title:'关单时间',
        //    data:'guanbiShij'
        //},
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
        //{
        //    title:'验收人',
        //    data:'yanShouRenName'
        //},
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-issued btn default btn-xs green-stripe'>下发</span><span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>"

            +"<span class='data-option option-cancel btn default btn-xs green-stripe'>取消</span>"
        }
    ];

    _tableInit($('#appeal-list'),appealListCol,'2','','','');

    //负责人表格
    var fzrListCol = [
        //{
        //    className:'checkeds',
        //    data:null,
        //    defaultContent:"<div class='checker'><span class=''><input type='checkbox'></span></div>"
        //},
        {
            title:'工号',
            data:'userNum',
            className:'workNum'
        },
        {
            title:'姓名',
            data:'userName'
        },
        {
            title:'职位',
            data:'pos'
        },
        {
            title:'联系电话',
            data:'mobile'
        }
    ];

    _tableInit($('#fzr-list'),fzrListCol,'2','','','');

    //可协助
    var  assistListCol = [
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
            defaultContent: "<span class='data-option option-assist btn default btn-xs green-stripe'>协助</span>"
        }
    ];

    _tableInit($('#assist-list'),assistListCol,'2','','','');

    //数据加载
    conditionSelect(true);

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

    //
    $('.creatButton').click(function(){

        _isDeng = true;


        //模态框显示
        _moTaiKuang($('#myModal'), '报修', '', '' ,'', '报修');

        //添加类
        $('#myModal').find('.btn-primary').removeClass('bianji').removeClass('xiafa').removeClass('xiezhu').addClass('dengji');

        //显示放大镜图标 用户可以选择
        $('.fdjImg').show();

        //维修内容不显示
        $('#wxContent').hide();

        //选择部门不显示
        $('.selectBM').hide();

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
         // 电话信息可编辑
        $('.bx-change').attr('disabled',false).removeClass('disabled-block');

    });

    //点击模态框显示的回调函数
    $('#myModal').on('shown.bs.modal', function () {

        if(_isDeng){

            var departnum = gdObj.bxkesh;

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
            _fzrArr = [];

            _datasTable($('#fzr-list'),_fzrArr);

        }

        _isDeng = false;

    });

    //选择部门之后加载人员列表
    $('#depart').change(function(){

        //初始化表格

        var arr = [];

        _datasTable($('#fzr-list'),arr);

        //选择部门
        gdObj.wxbz = $('#depart').children('option:selected').html();

        $('#wxbz').attr('data-bm',$('#depart').val());

        var prm = {
            'departNum':$('#depart').val(),
            'userID':_userIdNum,
            'userName':_userIdName
        }

        if(!$('#depart').val()){
            _datasTable($('#fzr-list'),[]);
            return false;
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetWXLeaders',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');
            },
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

    //、编辑
    $('#myModal')
        .on('click','.dengji',function(){

            optionData('YWGD/ywGDCreDJ','成功！','失败！','');

        })
        .on('click','.bianji',function(){

            optionData('YWGD/ywGDUpt','编辑成功！','编辑失败！','flag');

        })
        .on('click','.xiafa',function(){

            //首先判断部门是否选择了
            if($('#depart').val() == ''){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择维修部门！', '');

            }else{

                $('#theLoading').modal('show');

                //先判断是第一次下发还是重发
                if(_gdZht == 5){
                    //维修内容修改
                    upDateWXRemark(false);
                    //编辑内容
                    editXF('YWGD/ywGDUpt','flag',false);
                    //工单重发
                    reSend();
                    //分配负责人
                    assigFZR(false);

                }else{
                    //维修内容修改
                    upDateWXRemark(true);
                    //编辑内容
                    editXF('YWGD/ywGDUpt','flag',true);
                    //工单下发
                    upData();
                    //分配负责人
                    assigFZR(true)
                }

            }

        })

    //超时工单中 查看工长
    $('#more-time') .on('click','.data-option',function(){

        $('#examine-depart').modal('show');

        //选择部门
        var departNum = $(this).parents('tr').find('.wx-ks').attr('data-num');
        var prm = {
            'departNum':departNum,
            'userID':_userIdNum,
            'userName':_userIdName
        }

        if(!departNum){
            _datasTable($('#examine-depart-table'),[]);
            return false;
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetWXLeaders',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');
            },
            success:function(result){

                _datasTable($('#examine-depart-table'),result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })

    });

    //表格操作按钮
    $('#pending-list')
        .on('click','.option-edit',function(){

            //初始化
            dataInit();

            //显示放大镜图标 用户可以选择
            $('.fdjImg').show();

            //选择部门模块隐藏
            $('.selectBM').hide();

            if( $(this).parents('.table').attr('id') == 'more-time' ){

                //信息绑定
                bindData($(this),$('#more-time'));

            }else{

                //信息绑定
                bindData($(this),$('#pending-list'));

            }

            //模态框显示
            _moTaiKuang($('#myModal'), '详情', '', '' ,'', '保存');

            //维修内容隐藏
            $('#wxContent').hide();

            //选择部门隐藏
            $('#depart').val(' ').attr('disabled',true).addClass('disabled-block').show();

            //添加编辑类
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('xiafa').removeClass('xiezhu').addClass('bianji');

            //input不可操作
            $('.single-block').children('input').removeAttr('readOnly').removeClass('disabled-block');

            //select不可操作
            $('.single-block').children('select').attr('disabled',false).removeClass('disabled-block');

            //textarea不可操作
            $('.gzDesc').attr('disabled',false).removeClass('disabled-block');

            //报修人信息不可操作
            $('.note-edit2').attr('disabled',true).addClass('disabled-block');

            // 电话信息可编辑
            $('.bx-change').attr('disabled',false).removeClass('disabled-block');

            //报修人、电话不可操作，放大镜不显示
            $('.bx-change').attr('readonly','readonly').addClass('disabled-block');

            $('.gongdanList').children().children('div').eq(0).find('.fdjImg').hide();


        })
        .on('click','.option-issued',function(){

            //初始化
            dataInit();

            //隐藏放大镜图标 不让用户选择
            $('.fdjImg').hide();

            $('#myModal').find('.fdjImg').eq(4).show();

            //选择部门模块显示
            $('.selectBM').show();

            if( $(this).parents('.table').attr('id') == 'more-Time' ){

                //信息绑定
                bindData($(this),$('#more-Time'),true);

            }else{

                //信息绑定
                bindData($(this),$('#pending-list'),true);

            }

            //模态框显示
            _moTaiKuang($('#myModal'), '下发', '', '' ,'', '下发');

            //维修内容显示
            $('#wxContent').show();

            //选择部门显示
            $('.selectBM').show();

            //报修科室不可选择
            $('#bxkesh').attr('disabled',true);

            //添加编辑类
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('xiezhu').removeClass('bianji').addClass('xiafa');

            //input不可操作
            $('.single-block').children('input').attr('readOnly','readOnly').addClass('disabled-block');

            //select不可操作
            $('.single-block').children('select').attr('disabled',true).addClass('disabled-block');

            //textarea不可操作
            $('.gzDesc').attr('disabled',true).addClass('disabled-block');

            //部门可选择
            $('#depart').val('').attr('disabled',false).removeClass('disabled-block');

            //维修事项可编辑
            $('#metter').removeClass('disabled-block');


        })

    //查询
    $('#selected').click(function(){

        conditionSelect(true);

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

        console.log(equipmentFilterArr);

        //首先判断设备类型是否为空
        if($('#sbtype').val() == ''){

            datasTable($('#choose-equip'),equipmentArr);

        }else{

            datasTable($('#choose-equip'),equipmentFilterArr);

        }

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

                //设备编码
                gdObj.sbnum = dom.eq(i).children().eq(3).html();

                //设备名称
                gdObj.sbname = dom.eq(i).children().eq(2).html();

                //安装地点
                gdObj.azplace = dom.eq(i).children().eq(5).find('span').html();

                //设备类型
                gdObj.sbtype = dom.eq(i).children().eq(4).find('span').attr('data-num');


                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应设备', '')

    });

    //选择维修事项弹窗打开后
    $('#choose-building').on('shown.bs.modal', function () {

        //初始化
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
                $('#metter').val(dom.eq(i).children().eq(3).find('span').html());

                gdObj.wxxm = dom.eq(i).children().eq(3).find('span').html();

                //console.log(dom.eq(i).children().eq(2).html());

                $('#metter').attr('data-num',dom.eq(i).children().eq(2).html());

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

        if($('#bxkesh').val() == ''){

            _datasTable($('#choose-area-table'),_faultLocationArr);

        }else{

            _datasTable($('#choose-area-table'),_faultLocationFilterArr);

        }


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

    //选择电话弹窗打开后
    $('#choose-phone').on('shown.bs.modal', function () {

        //初始化
        _datasTable($('#choose-phone-table'),_phoneArr);

    });

    $('#choose-phone').on('click','.tableCheck',function(){
        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);
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

                //获取部门的列表
                $('#binding-phone').val(gdObj.bxtel);

                bxKShiByTel(false);

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应电话', '');

    });

    //报修科室表格
    var departTable = $('#choose-department-table').DataTable({
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
                title:'部门编号',
                data:'departNum',
                class:'adjust-comment'
            },
            {
                title:'部门名称',
                data:'departName'
            }
        ]
    });

    //报修人表格
    var peopleTable = $('#choose-people-table').DataTable({
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
                title:'用户名称',
                data:'userName',
                class:'adjust-comment'
            },
            {
                title:'职位',
                data:'pos'
            },
            {
                title:'部门',
                data:'departName'
            }
        ]
    });

    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }

    //选择报修科室弹窗打开后
    $('.choose-message').on('shown.bs.modal', function () {
        //获取当前打开的模态框ID
        var curID = $(this).attr('id');
        //如果是报修科室
        if(curID == 'choose-department'){

            $('#binding-phone').val(gdObj.bxtel);

            //首先判断报修电话是否填写了
            if(gdObj.bxtel == ''){

                //直接赋值
                _datasTable($('#choose-department-table'),_bxKShiByTelArr);

            }else{

                //直接赋值
                _datasTable($('#choose-department-table'),_bxKShiFilterArr);

            }



        //如果是报修人
        }else  if(curID == 'choose-people'){

            //首先判断报修科室是否选择了
            if( $('#bxkesh').val() == '' ){

                $('#binding-department').val('');

                _datasTable($('#choose-people-table'),_workerArr);

            }else{

                $('#binding-department').val($('#bxkesh').attr('data-num'));

                _datasTable($('#choose-people-table'),_workerFilterArr);

            }

        }

    });

    $('.choose-message').on('click','.tableCheck',function(){
        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);
    });

    //选择报修科室确定按钮
    $('.choose-message .btn-primary').on('click',function() {
        //获取当前打开的模态框ID
        var curID = $(this).parents('.choose-message').attr('id');

        var dom = $(this).parents('.choose-message').find('.table tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //如果是报修科室
                if(curID == 'choose-department'){

                    gdObj.bxkesh = dom.eq(i).find('.adjust-comment').next().html();

                    $('#bxkesh').attr('data-num',dom.eq(i).find('.adjust-comment').html());

                    var selected =  $(this).parent('ul').find('.li-color');

                    //获取报修人列表数据
                    workerData1(false,$('#bxkesh').attr('data-num'));

                    //获取故障位置数据列表
                    getArea(false);

                    //如果报修电话为空，则需要调用接口，查看报修电话
                    getPhone();


                }else if(curID == 'choose-people'){

                    gdObj.bxren = dom.eq(i).find('.adjust-comment').html();

                }

                $(this).parents('.choose-message').modal('hide');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应信息', '')

    });

    //申诉下发按钮
    $('#appeal-list tbody')
        .on('click','.option-issued',function(){

            //隐藏放大镜图标 不让用户选择
            $('.fdjImg').hide();

            //选择部门模块显示
            $('.selectBM').show();

            if( $(this).parents('.table').attr('id') == 'more-Time' ){

                //信息绑定
                bindData($(this),$('#more-Time'),true);

            }else{

                //信息绑定
                bindData($(this),$('#appeal-list'),true);

            }

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
        .on('click','.option-edit',function(){

            //显示放大镜图标 用户可以选择
            $('.fdjImg').show();

            //选择部门模块隐藏
            $('.selectBM').hide();

            //信息绑定
            bindData($(this),$('#appeal-list'));

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

            ////报修人信息不可操作
            //$('.note-edit2').attr('disabled',true).addClass('disabled-block');

            //报修人、报修电话、报修科室不可操作
            $('.bx-change').attr('readonly','readonly').addClass('disabled-block');

            //保修科室
            $('#bxkesh').attr('disabled',true).addClass('disabled-block');

            //放大镜不显示
            $('.gongdanList').children().children('div').eq(0).find('.fdjImg').hide();

        })

    //选择报修科室查询按钮
    $('#select-phone').click(function(){

        bxKShiByTel(false);

    })

    //报修人查询按钮
    $('#select-department').click(function(){

        workerData1(false,$('#binding-department').val());

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

    //模糊搜索选中-报修科室
    $('.fuzzy-search').eq(1).on('click','li',function(){

        var selected =  $(this).parent('ul').find('.li-color');

        //赋值
        bxKeshiAssignment(selected);

    })

    //模糊搜索选中-报修人
    $('.fuzzy-search').eq(2).on('click','li',function(){

        var selected =  $(this).parent('ul').find('.li-color');

        //赋值
        workerAssignment(selected);

    })

    //模糊搜索选中-设备
    $('.fuzzy-search').eq(3).on('click','li',function(){

        var selected =  $(this).parent('ul').find('.li-color');

        sbAssignment(selected);
    })

    //维修事项
    $('.fuzzy-search').eq(4).on('click','li',function(){

        var selected =  $(this).parent('ul').find('.li-color');

        wxShiXAssignment(selected);

    })

    //故障位置
    $('.fuzzy-search').eq(5).on('click','li',function(){

        var selected =  $(this).parent('ul').find('.li-color');

        gzwzAssignment(selected);

    })

    $(document).on('click',function(e){

        if( e.srcElement.className.indexOf('fuzzy-input')<0){

            $('.fuzzy-search').hide();

        }

    })

    //设备类型change事件
    $('#sbtype').change(function(){

        //设备编码初始化
        gdObj.sbnum = '';

        //设备名称初始化
        gdObj.sbname = '';

        //设备安装地点初始化
        gdObj.azplace = '';

        //设备列表初始化
        getEuipment(false,$('#sbtype').val());

    })

    //协助
    $('#assist-list tbody').on('click','.option-assist',function(){

        _gdCode = $(this).parents('.table').find('tbody').find('.gdCode').find('a').html();

        //初始化
        dataInit();

        //可协助显示
        $('#xzDes').show();

        //隐藏放大镜图标 不让用户选择
        $('.fdjImg').hide();

        $('#myModal').find('.fdjImg').eq(4).show();

        //选择部门模块显示
        $('.selectBM').show();

        if( $(this).parents('.table').attr('id') == 'more-Time' ){

            //信息绑定
            bindData($(this),$('#more-Time'),true);

        }else{

            //信息绑定
            bindData($(this),$('#assist-list'),true);

        }

        //模态框显示
        _moTaiKuang($('#myModal'), '协助', '', '' ,'', '协助');

        //维修内容显示
        $('#wxContent').show();

        //选择部门显示
        $('.selectBM').show();

        //报修科室不可选择
        $('#bxkesh').attr('disabled',true);

        //添加协助类
        $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('bianji').removeClass('xiafa').addClass('xiezhu');

        //input不可操作
        $('.single-block').children('input').attr('readOnly','readOnly').addClass('disabled-block');

        //select不可操作
        $('.single-block').children('select').attr('disabled',true).addClass('disabled-block');

        //textarea不可操作
        $('.gzDesc').attr('disabled',true).addClass('disabled-block');

        //部门可选择
        $('#depart').val('').attr('disabled',false).removeClass('disabled-block');

        //维修事项可编辑
        $('#metter').removeClass('disabled-block');


    })

    //协助确定按钮
    $('#myModal').on('click','.xiezhu',function(){

        //验证
        if($('#depart').val() == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择维修部门！', '');

        }else{


            //loadding
            $('#theLoading').modal('show');

            var fzrArr = [];

            for(var i=0;i<_fzrArr.length;i++){

                var obj = {};
                //维修人编码
                obj.wxRen = _fzrArr[i].userNum;
                //维修人姓名
                obj.wxRName = _fzrArr[i].userName;
                //维修人电话
                obj.wxRDh = _fzrArr[i].mobile;

                fzrArr.push(obj);

            }

            var prm = {
                //工单号
                "gdCode": _gdCode,
                //维修科室编码
                "wxKeshiNum": $('#depart').val()==''?'':$('#depart').val(),
                //维修科室
                "wxKeshi": $('#depart').val() == ''?'':$('#depart').children('option:selected').html(),
                //工单维修人
                "gdWxRs": fzrArr,
                //用户id
                "userID": _userIdNum,
                //用户名
                "userName": _userIdName,
                //用户角色
                "b_UserRole": _userRole,
                //用户部门
                "b_DepartNum": _userBM,
                //协助说明
                "remark":$('#xzDes').find('textarea').val()
            }

            $.ajax({

                type:'post',

                url:_urls + 'YWGD/GongdanFZAdd',

                data:prm,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result == 99){

                        $('#myModal').modal('hide');

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'协助下发成功！', '');

                        $('#myModal2').off('shown.bs.modal').on('shown.bs.modal',function(){

                            assistFun();

                            conditionSelect(false,true);

                        })

                    }else{

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'协助下发失败！', '');

                    }



                },
                error:_errorFun

            })
        }


    })

    //点击可协助标签，获取列表
    $('#assist').click(function(){

        assistFun();

    })

    /*-------------------------------------------------其他方法-----------------------------------------*/
    //所有设备数组
    var equipmentArr = [];

    //过滤后的设备数组
    var equipmentFilterArr = [];

    getEuipment(true,'');

    //获取设备类型
    function getEuipment(flag,dsNum){

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

                $('#theLoading').modal('hide');



                if(flag){

                    equipmentArr.length = 0;

                    $(result).each(function(i,o){

                        equipmentArr.push(o);

                    })

                }else{

                    equipmentFilterArr.length = 0;

                    $(result).each(function(i,o){

                        equipmentFilterArr.push(o);

                    })

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                console.log(jqXHR.responseText);
            }
        })
    };

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
    function getArea(flag){

        //获取报修科室
        var departnum = $('#bxkesh').attr('data-num');

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

                if(flag){

                    _faultLocationArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _faultLocationArr.push(result[i]);

                    }

                }else{

                    _faultLocationFilterArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _faultLocationFilterArr.push(result[i]);

                    }

                    //形成列表
                    gzwzList($('.fuzzy-search').eq(5),_faultLocationFilterArr);

                    //赋值
                    gdObj.gzplace = $('.fuzzy-search').eq(5).children('li').eq(0).children().eq(0).html();

                }
            }
        })
    };

    //获取电话
    function getPhone(flag){

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/SysPhoneGetALl',
            data:{
                "phone": "",
                "locnum": "",
                "locname": "",
                "info": "",
                "memo": "",
                "departnum":$('#bxkesh').attr('data-num')
            },
            success:function(result){

                if(flag){

                    _phoneArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _phoneArr.push(result[i]);

                    }
                }else{

                    //为报修电话赋值
                    if(result.length !=0){

                        gdObj.bxtel = result[0].phone;

                    }

                }
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
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }

    }
    //项初始化
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
        gdObj.wxxm = '';
        $('.gzDesc').val('');

        $('.fuzzy-search').empty().hide();

        //清空负责人
        _fzrArr.length = 0;

        //协助原因隐藏
        $('#xzDes').hide();

    }

    //报修科室
    function bxKShiData(departNum,flag,flag1){

        var prm = {
            'departName':'',
            'userID':_userIdNum,
            'userName':_userIdName,

        };
        if(flag){
            prm.departnum = departNum;
            prm.isWx= '1'
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                if(flag){
                    var str = '<option value="">请选择</option>';
                    for(var i=0;i<result.length;i++){

                        _allBXArr.push(result[i]);

                        str += '<option value="' + result[i].departNum +
                            '">' + result[i].departName + '</option>>';
                    }
                    $('#depart').empty().append(str);
                    //是否是下发

                    if(flag1){
                        //获取维修项目编号
                        var wxnum = $('#metter').attr('wxnum');

                        getDepartByWx(wxnum);
                    }


                    return false;
                }

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
    };

    //报修科室（根据电话查询）flag表示所有的报修科室;
    function bxKShiByTel(flag){

        var prm = {
            'departName':'',
            'userID':_userIdNum,
            'userName':_userIdName,
            'phone':$('#binding-phone').val()
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDepartsII',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                if(flag){

                    _bxKShiByTelArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _bxKShiByTelArr.push(result[i]);

                    }

                }else{

                    _bxKShiFilterArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _bxKShiFilterArr.push(result[i]);

                    }


                    //直接过滤数组
                    bxKeshiList($('.fuzzy-search').eq(1),_bxKShiFilterArr);

                    if(_bxKShiFilterArr.length >0){

                        //直接默认第一个(报修科室)
                        gdObj.bxkesh = $('.fuzzy-search').eq(1).children('li').eq(0).children('span').eq(0).html();

                        $('#bxkesh').attr('data-num',$('.fuzzy-search').eq(1).children('li').eq(0).children('span').eq(1).html());

                        //联动报修人
                        workerData1(false,$('#bxkesh').attr('data-num'));

                        //联动故障位置
                        getArea(false);

                    }

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log(jqXHR.responseText);

            }
        })
    }

    //根据维修项目编号获取部门
    function getDepartByWx(wxnum){
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDWxxmGetDepart',
            data:{
                "wxnum": wxnum,
                'userID':_userIdNum
            },
            success:function(result){

                $('#depart').val(result[0].departNum);

                //选择部门
                gdObj.wxbz = $('#depart').children('option:selected').html();

                $('#wxbz').attr('data-bm',$('#depart').val());

                if(!$('#depart').val()){
                    _datasTable($('#fzr-list'),[]);
                    return false;
                }

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
            }
        })

    }

    //根据电话获取当前表格中的

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

    //条件查询flag为真的时候，启动定时刷新，part为假的时候，有模态框的时候也要定时刷新
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
            'isQueryExceedTime':"1"
        };

        //if(_loginUser.isWx == 1){
        //
        //    prm.wxKeshiNum = _userBM;
        //
        //}

        //如果part为假的话，模态框的情况下刷新数据，真的话，模态框情况下不刷新数据
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
            beforeSend:_beforeSendFun,
            complete:_completeFun,
            success:function(result){

                //根据状态值给表格赋值
                var zht1=[],zht2=[],zht4=[],zht5=[],zht6=[],zht7=[],zht11=[],moreTime=[],backGD=[];

                for(var i=0;i<result.length;i++){

                    if(result[i].gdZht == 1){

                        if(result[i].wxBeizhu != ''){

                            backGD.push(result[i]);

                        }

                        zht1.push(result[i]);

                    }else if(result[i].gdZht == 2){

                        if( result[i].exceedTimePaig != null && result[i].exceedTimePaig != '' ){

                            moreTime.push(result[i]);

                        }

                        zht2.push(result[i]);

                    }else if(result[i].gdZht == 4){
                        zht4.push(result[i]);
                    }else if(result[i].gdZht == 6){
                        zht6.push(result[i]);
                    }else if(result[i].gdZht == 7){
                        zht7.push(result[i]);
                    }else if(result[i].gdZht == 11){
                        zht11.push(result[i]);
                    }else if(result[i].gdZht == 5){

                        zht5.push(result[i]);
                    }

                }


                //未接单
                _datasTable($('#pending-list'),zht1);

                //退回
                _datasTable($('#back-list'),backGD);
                //待接单
                _datasTable($('#deng-list'),zht2);
                //执行中
                _datasTable($('#in-execution'),zht4);
                //等待材料
                _datasTable($('#waiting-material'),zht5);
                //待关单
                _datasTable($('#waiting-list'),zht6);
                //已关单
                _datasTable($('#closing-list'),zht7);
                //申诉
                _datasTable($('#appeal-list'),zht11);
                //超时
                _datasTable($('#more-time'),moreTime);
                //负责人
                //_datasTable($('#fzr-list'),result.gdWxLeaders);

                $('.content-main-contents1').addClass('hide-block');

                $('.content-main-contents1').eq(0).removeClass('hide-block');

                if( moreTime.length > 0 ){

                    //超时显示
                    $('#overtime').show();


                }else{

                    $('#overtime').hide();


                }

                if( backGD.length > 0 ){

                    $('#callback').show();

                }else{

                    $('#callback').hide();

                }

                //记录当前显示的是你哪个表格
                var index = $('.table-title .spanhover').index();

                $('.content-main-contents1').addClass('hide-block');

                $('.content-main-contents1').eq(index).removeClass('hide-block');

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
    function bindData(num,tableId,flag){
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
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){
                //赋值
                gdObj.bxtel = result.bxDianhua;
                gdObj.bxkesh = result.bxKeshi;
                //'bxKeshiNum':$('#bxkesh').attr('data-num'),
                $('#bxkesh').attr('data-num',result.bxKeshiNum);
                gdObj.bxren = result.bxRen;
                //gdObj.pointer = '';
                gdObj.gztime = result.gdFsShij;
                gdObj.gzplace = result.wxDidian;
                gdObj.wxxm=result.wxXm;
                //绑定维修项目编号
                $('#metter').attr('wxnum',result.wxXmNum);

                for(var i=0;i<_allXTArr.length;i++ ){
                    if( $.trim(result.dcName) == $.trim(_allXTArr[i].dsName)){

                        $('#sbtype').val(_allXTArr[i].dsNum);
                    }
                }
                gdObj.sbnum = result.wxShebei;
                gdObj.sbname = result.dName;
                gdObj.azplace = result.installAddress;
                $('.gzDesc').val(result.bxBeizhu);

                //根据报修科室重绘故障位置表格
                var departnum = $('#bxkesh').attr('data-num');

                //如果是下发
                //生成维修班组选择下拉列表
                if(flag){

                    bxKShiData(departnum,true,true);

                }else{

                    bxKShiData(departnum,true);

                }

                //负责人
                //var prm = {
                //    //'departNum':$('#depart').val(),
                //    'departNum':'JT031',
                //    'userID':_userIdNum,
                //    'userName':_userIdName
                //}

                //if($('#depart').val() == ''){
                //    _datasTable($('#fzr-list'),[]);
                //    return false;
                //}

                //$.ajax({
                //    type:'post',
                //    url:_urls + 'YWGD/ywGetWXLeaders',
                //    data:prm,
                //    beforeSend: function () {
                //        $('#theLoading').modal('show');
                //    },
                //    complete: function () {
                //
                //        $('#theLoading').modal('hide');
                //    },
                //    success:function(result){
                //
                //        _datasTable($('#fzr-list'),result);
                //
                //        _fzrArr = result;
                //
                //    },
                //    error: function (jqXHR, textStatus, errorThrown) {
                //
                //        console.log(jqXHR.responseText);
                //
                //    }
                //})

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //、编辑(编辑的时候传参数flag)
    function optionData(url,successMeg,errorMeg,flag){
        //验证非空
        if(gdObj.bxtel == ''|| gdObj.bxkesh == '' || gdObj.gzplace == '' || gdObj.wxshx == ''){
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

            var str = ' ';
            if(gdObj.sbtype == ''){
                str = ' ';
            }else{
                str = $('#sbtype').children('option:selected').html();
            }

            //传数据
            var prm = {
                'gdJJ':gdObj.gdtype,
                'bxDianhua':gdObj.bxtel,
                'bxKeshi':gdObj.bxkesh,
                'bxKeshiNum':$('#bxkesh').attr('data-num'),
                'bxRen':gdObj.bxren,
                //'':gdObj.pointer,
                'gdFsShij':$('.datatimeblock').eq(2).val(),
                'wxShiX':1,
                'wxShiXNum':1,
                'wxXm':gdObj.wxxm,
                'wxXmNum':$('#metter').attr('data-num'),
                'wxShebei':gdObj.sbnum,
                'dName':gdObj.sbname,
                'installAddress':gdObj.azplace,
                'wxDidian':gdObj.gzplace,
                'bxBeizhu':$('.gzDesc').val(),
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'gdSrc': 1,
                'gdWxLeaders':fzrArr,
                //设备类型
                'DCName':str,
                'DCNum':gdObj.sbtype,
            }
            if(flag){
                prm.gdCode = _gdCode;
            }


            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                timeout:_theTimes,
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },
                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success:function(result){

                    if(result == 99){

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap',successMeg, '');

                        $('#myModal').modal('hide');

                        $('#myModal2').off('shown.bs.modal').on('shown.bs.modal',function(){

                            conditionSelect(false,true);

                        })

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

        //负责人数组
        var fzrArr = [];
        for(var i=0;i<_fzrArr.length;i++){
            var obj = {};
            obj.wxRen = _fzrArr[i].userNum;
            obj.wxRName = _fzrArr[i].userName;
            obj.wxRDh = _fzrArr[i].mobile;
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

                    firstXF();

                }else{

                    secondXF();

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
        if( _wxIsComplete &&  _ztChangeComplete && _fzrComplete && _editIsComplete ){

            $('#theLoading').modal('hide');

            //提示
            if( _wxIsSuccess && _ztChangeSuccess && _fzrSuccess && _editIsSuccess ){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单下发成功！', '');

                $('#myModal').modal('hide');

                $('#myModal2').off('shown.bs.modal').on('shown.bs.modal',function(){

                    conditionSelect(false,true);

                })

                BEE.modificationImportInfo();

            }else{
                var str = '';
                if( _wxIsSuccess == false ){
                    str += '维修备注修改失败，'
                }else{
                    str += '维修备注修改成功，'
                }
                if( _fzrSuccess == false ){

                    str += '选择负责人失败,'

                }else{

                    str += '选择负责人成功,'

                }
                if( _editIsSuccess == false ){

                    str += '工单编辑失败，'

                }else{

                    str += '工单编辑成功，'

                }
                if( _ztChangeSuccess == false ){

                    str += '工单下发失败！'

                }else{

                    str += '工单下发成功！'

                    $('#myModal2').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                    BEE.modificationImportInfo();
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
        if(_wxIsComplete  && _reSendComplete && _fzrComplete && _editIsComplete){

            $('#theLoading').modal('hide');

            if( _wxIsSuccess && _reSendSuccess && _fzrSuccess && _editIsSuccess){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单下发成功！', '');

                $('#myModal').modal('hide');

                $('#myModal2').off('shown.bs.modal').on('shown.bs.modal',function(){

                    conditionSelect(false,true);

                })

                BEE.modificationImportInfo();

            }else{
                var str = '';
                if( _wxIsSuccess == false ){
                    str += '维修备注修改失败，'
                }else{
                    str += '维修备注修改成功，'
                }
                if( _fzrSuccess == false ){

                    str += '选择负责人失败，'

                }else{

                    str += '选择负责人成功，'

                }
                if( _editIsSuccess == false ){

                    str += '工单编辑失败，'

                }else{

                    str += '工单编辑成功，'

                }
                if( _reSendSuccess == false ){
                    str += '工单重发失败！'
                }else{
                    str += '工单重发成功！'

                    $('#myModal2').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                    BEE.modificationImportInfo();

                }
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,str, '');
            }
        }
    }

    //获取所有员工列表
    function workerData1(flag,data){
        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            departNum:data
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetUsers',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                if(flag){

                    _workerArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _workerArr.push(result[i]);

                    }

                }else{

                    _workerFilterArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _workerFilterArr.push(result[i]);

                    }

                    datasTable($('#choose-people-table'),result);

                    //自动形成列表
                    workerList($('.fuzzy-search').eq(2),_workerFilterArr);

                    //用第一个赋值
                    gdObj.bxren = $('.fuzzy-search').eq(2).children('li').eq(0).children('span').eq(0).html();

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有部门
    function getDepartment(){

        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:{
                'userID':_userIdNum,
                'userName':_userIdName,
            },
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].departNum +
                        '">' + result[i].departName + '</option>'
                }
                $('#binding-department').empty().append(str);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })

    }

    //下发按钮的编辑功能
    function editXF(url,flag,order){

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

            var str = ' ';
            if(gdObj.sbtype == ''){
                str = ' ';
            }else{
                str = $('#sbtype').children('option:selected').html();
            }

            //传数据
            var prm = {
                'gdJJ':gdObj.gdtype,
                'bxDianhua':gdObj.bxtel,
                'bxKeshi':gdObj.bxkesh,
                'bxKeshiNum':$('#bxkesh').attr('data-num'),
                'bxRen':gdObj.bxren,
                //'':gdObj.pointer,
                'gdFsShij':$('.datatimeblock').eq(2).val(),
                'wxShiX':1,
                'wxShiXNum':1,
                'wxXm':gdObj.wxxm,
                'wxXmNum':$('#metter').attr('data-num'),
                'wxShebei':gdObj.sbnum,
                'dName':gdObj.sbname,
                'installAddress':gdObj.azplace,
                'wxDidian':gdObj.gzplace,
                'bxBeizhu':$('.gzDesc').val(),
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'gdSrc': 1,
                'gdWxLeaders':fzrArr,
                //设备类型
                'DCName':str,
                'DCNum':gdObj.sbtype,
            }
            if(flag){
                prm.gdCode = _gdCode;
            }


            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                timeout:_theTimes,
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },
                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success:function(result){

                    _editIsComplete = true;

                    if(result == 99){

                        _editIsSuccess = true;

                    }else{

                        _editIsSuccess = false;

                    }

                    if(order){
                        firstXF();
                    }else{
                        secondXF();
                    }

                },
                error:function(jqXHR, textStatus, errorThrown){

                    _editIsComplete = true;

                    console.log(jqXHR.responseText);
                }
            })
        }

    }

    //隐藏分页
    $('#choose-metter_length').hide();
    $('#choose-area-table_length').hide();
    $('#choose-people-table_length').hide();
    $('#choose-phone-table_length').hide();
    $('#choose-department-table_length').hide();
    $('#choose-equip_length').hide();

    //报修电话li
    function phoneList(el,arr){

        var str = '';

        if(arr.length == 1){

            for(var i=0;i<arr.length;i++){

                str += '<li class="li-color">' + '<span>' + arr[i].phone  + '</span>' + '<span>' + arr[i].departname + '</span>' +  '<span>' + arr[i].info + '</span>'  + '</li>'

            }
        }else{

            for(var i=0;i<arr.length;i++){

                str += '<li>' + '<span>' + arr[i].phone  + '</span>' + '<span>' + arr[i].departname + '</span>' +  '<span>' + arr[i].info + '</span>'  + '</li>'

            }

        }

        el.empty().append(str);

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

    //电话报修赋值（点击、回车事件）
    function phoneAssignment(thisLi){

        gdObj.bxtel = thisLi.children('span').eq(0).html();

        $('#binding-phone').val(gdObj.bxtel);

        //确定报修科室的数组
        bxKShiByTel();

    }

    //报修科室li
    function bxKeshiList(el,arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<li>' + '<span>' + arr[i].departName + '</span>' + '<span>' + arr[i].departNum + '</span>' + '</li>'

        }

        el.empty().append(str);


    }

    //报修科室赋值（点击、回车事件）
    function bxKeshiAssignment(thisLi){

        gdObj.bxkesh = thisLi.children('span').eq(0).html();

        var attrValue = thisLi.children('span').eq(1).html()

        $('#bxkesh').attr('data-num',attrValue);

        $('#binding-department').val(attrValue);

        //获取报修人列表数据
        workerData1(false,attrValue);

        //获取故障位置数据列表
        getArea(false);

        //如果报修电话为空，则需要调用接口，查看报修电话
        getPhone();

    }

    //报修人li
    function workerList(el,arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<li>' + '<span>' + arr[i].userName  + '</span>' + '<span>' + arr[i].userNum + '</span>' +  '<span>' + arr[i].departName + '</span>' + '<span style="display: none">' + arr[i].departNum + '</span>' + '</li>'

        }

        el.empty().append(str);

    }

    //报修人赋值（点击、回车事件）
    function workerAssignment(thisLi){

        gdObj.bxren = thisLi.children('span').eq(0).html();

        //报修科室自动赋值
        gdObj.bxkesh = thisLi.children('span').eq(2).html();

        $('#bxkesh').attr('data-num',thisLi.children('span').eq(3).html())

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

        gdObj.wxxm = thisLi.children('span').eq(0).html();

        var attrValues = thisLi.children('span').eq(3).html();

        //属性值
        $('#metter').attr('data-num',attrValues);

        //thisLi.parent('ul').hide();

    }

    //设备li
    function sbList(el,arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<li>' + '<span>' + arr[i].dName  + '</span>' + '<span>' + arr[i].dNewNum + '</span>' +  '<span>' + arr[i].dsName + '</span>' + '<span style="display: none;">'+ arr[i].dsNum +'</span>' + '<span>' + arr[i].installAddress + '</span>' +'</li>'

        }

        el.empty().append(str);

    }

    //设备赋值（点击、回车事件）
    function sbAssignment(thisLi){

        //设备类型
        gdObj.sbtype = thisLi.children('span').eq(3).html();

        //设备编码
        gdObj.sbnum = thisLi.children('span').eq(1).html();

        //设备名称
        gdObj.sbname = thisLi.children('span').eq(0).html();

        //安装地点
        gdObj.azplace = thisLi.children('span').eq(4).html();

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
    var bxtelInputFun = function(){

        bxListInfo(true);

        FuzzySearchFun(gdObj.bxtel,_phoneArr,'phone',$('.fuzzy-search').eq(0),phoneList);

    }

    //报修电话回车事件
    var bxtelEnterFun = function(){

        var selected =  $('.fuzzy-search').eq(0).find('.li-color');

        //赋值
        phoneAssignment(selected);

        $('.fuzzy-search').eq(0).hide();

    }

    //报修科室输入事件
    var bxKeshiInputFun = function(){

        bxListInfo(false);

        if(gdObj.bxtel == ''){

            FuzzySearchFun(gdObj.bxkesh,_bxKShiByTelArr,'departName',$('.fuzzy-search').eq(1),bxKeshiList);

        }else{

            FuzzySearchFun(gdObj.bxkesh,_bxKShiFilterArr,'departName',$('.fuzzy-search').eq(1),bxKeshiList);

        }



    }

    //报修科室回车事件
    var bxKeshiEnterFun = function(){

        var selected =  $('.fuzzy-search').eq(1).find('.li-color');

        //赋值
        bxKeshiAssignment(selected);

        $('.fuzzy-search').eq(1).hide();

    }

    //报修人输入事件
    var bxrenInputFun = function(){

        FuzzySearchFun(gdObj.bxren,_workerArr,'userName',$('.fuzzy-search').eq(2),workerList);

    }

    //报修人回车事件
    var bxrenEnterFun = function(){

        var selected =  $('.fuzzy-search').eq(2).find('.li-color');

        //赋值
        workerAssignment(selected);

        $('.fuzzy-search').eq(2).hide();


    }

    //设备名称输入事件
    var sbInputFun = function(){

        if($('#sbtype').val() == ''){

            FuzzySearchFun(gdObj.sbname,equipmentArr,'dName',$('.fuzzy-search').eq(3),sbList);

        }else{

            FuzzySearchFun(gdObj.sbname,equipmentFilterArr,'dName',$('.fuzzy-search').eq(3),sbList);

        }

    }

    //设备名称回车事件
    var sbEnterFun = function(){

        var selected =  $('.fuzzy-search').eq(3).find('.li-color');

        sbAssignment(selected);

        $('.fuzzy-search').eq(3).hide();

    }

    //维修事项输入事件
    var wxShiXInputFun = function(){

        FuzzySearchFun(gdObj.wxxm,_wxShiXArr,'wxname',$('.fuzzy-search').eq(4),wxShiXList);

    }

    //维修事项回车事件
    var wxShiXEnterFun = function(){

        var selected =  $('.fuzzy-search').eq(4).find('.li-color');

        wxShiXAssignment(selected);

        $('.fuzzy-search').eq(4).hide();

    }

    //故障位置输入事件
    var gzwzInputFun = function(){

        if( gdObj.bxkesh == '' ){

            FuzzySearchFun(gdObj.gzplace,_faultLocationArr,'locname',$('.fuzzy-search').eq(5),gzwzList);

        }else{

            FuzzySearchFun(gdObj.gzplace,_faultLocationFilterArr,'locname',$('.fuzzy-search').eq(5),gzwzList);

        }

    }

    //故障位置回车事件
    var gzwzEnterFun = function(){

        var selected =  $('.fuzzy-search').eq(5).find('.li-color');

        gzwzAssignment(selected);

        $('.fuzzy-search').eq(5).hide();

    }

    //记录当前回退工单的状态
    var _thisStateNum = '';

    var _thisState = '';

    //记录当前回退工单的工单号
    var _thisCodeNum = '';

    //记录当前工单维修事项
    var _thisWXSX = '';

    //记录当前工单维修班组
    var _thisWXBZ = '';

    //当前工单重发值
    var _thisCFZ = '';

    //当前负责人数组
    var _fuZeRen = [];

    //当前执行人数组
    var _zhixingRens = [];

    //删除负责人是否成功
    var delFzrIsSuccess = false;

    //删除执行人是否成功
    var delZxrIsSuccess = false;

    //工单回退功能
    $('.table').on('click','.option-callback',function(){

        //样式
        $(this).parents('tbody').find('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //初始化
        $('#Fallback-Modal').find('.modal-body').find('input').val('');

        $('#Fallback-Modal').find('.modal-body').find('textarea').val('');

        //首先判断是是能回退

        _thisStateNum = $(this).parents('tr').find('.gdCode').children().attr('data-zht');

        _thisState = GDDes(_thisStateNum);

        _thisCodeNum = $(this).parents('tr').find('.gdCode').find('a').html();

        _thisWXSX = $(this).parents('tr').children('.WXSX').html();

        _thisWXBZ = $(this).parents('tr').children('.WXBZ').html();

        _thisCFZ = $(this).parents('tr').find('.gdCode').children().attr('data-gdcircle');

        $('#gdCode1').val(_thisCodeNum);

        $('#gdStatus1').val(_thisState);

        $('#gdWxItem1').val(_thisWXSX);

        $('#gdWxClass1').val(_thisWXBZ);

        _moTaiKuang($('#Fallback-Modal'), '您确定要进行回退操作吗？', '', '' ,'', '确定');

        //调详情
        var prm = {
            //工单号
            gdCode:_thisCodeNum,
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //所属部门
            b_UserRole:_userBM,
            //重发值
            gdCircle:_thisCFZ,
            //状态
            gdZht:_thisStateNum

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:prm,
            success:function(result){

                _fuZeRen = result.gdWxLeaders;

                _zhixingRens = result.wxRens;

            },
            error:function(){

            }

        })

    })

    //回退确定功能
    $('#Fallback-Modal').on('click','.btn-primary',function(){

        if($('#returnDes').val() == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写回退原因', '');

            return false;

        }

        var htState = 0;

        if(_thisStateNum == 2){

            htState = 1;//回退工长和状态

        }else if( _thisStateNum == 4 || _thisStateNum == 5 ){

            htState = 2;//回退执行人、状态、材料

        }

        var gdInfo = {

            "gdCode": _thisCodeNum,

            "gdZht": htState,

            "userID": _userIdNum,

            'userName':_userIdName,

            'backReason':$('#returnDes').val()
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
            data:gdInfo,
            success:function(result){

                if(result == 99){

                    if(htState == 1){
                        //删除该工单负责人
                        if(_fuZeRen.length>0){

                            manager('YWGD/ywGDDelWxLeader','flag');

                        }else{

                            var str = '回退成功！';

                            _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,str, '');

                            $('#Fallback-Modal').modal('hide');

                            $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                                conditionSelect(false,true);

                            })

                        }

                    }else if(htState == 2){
                        //删除该工单的执行人
                        if(_zhixingRens.length>0){

                            Worker('YWGD/ywGDDelWxR','flag');

                        }else{

                            var str = '回退成功！';

                            $('#Fallback-Modal').modal('hide');

                            _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,str, '');

                            $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                                conditionSelect(false,true);

                            })

                        }

                    }

                }else{
                    var str = '退回失败！';

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,str, '');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }
        })

    })

    //工单状态
    function GDDes(data){

        if(data == 1){
            return '待下发'
        }if(data == 2){
            return '待分派'
        }if(data == 3){
            return '待执行'
        }if(data == 4){
            return '执行中'
        }if(data == 5){
            return '等待资源'
        }if(data == 6){
            return '待关单'
        }if(data == 7){
            return '任务关闭'
        }if(data == 999){
            return '任务取消'
        }if(data == 11){
            return '申诉'
        }

    }

    //删除责任人
    function manager(url,flag){
        var fzrArrr = [];
        for(var i=0;i<_fuZeRen.length;i++){
            var obj = {};
            if(flag){
                obj.wxrID = _fuZeRen[i].wxrID;
            }
            obj.wxRen = _fuZeRen[i].wxRen;
            obj.wxRName = _fuZeRen[i].wxRName;
            obj.wxRDh = _fuZeRen[i].wxRDh;
            obj.gdCode = _gdCode;
            fzrArrr.push(obj);
        }
        var gdWR = {
            gdCode:_thisCodeNum,
            gdWxRs:fzrArrr,
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + url,
            data:gdWR,
            async:false,
            success:function(result){

                if(result == 99){

                    delFzrIsSuccess = true;

                }else{

                    delFzrIsSuccess = false;

                }

                if( delFzrIsSuccess ){

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,'回退成功！', '');

                    $('#Fallback-Modal').modal('hide');

                    $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                }else{

                    var str = '工长删除失败,退回成功！';

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,str, '');

                    $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);
            }
        })
    }

    //删除执行人方法
    function Worker(url,flag){
        var workerArr = [];
        for(var i=0; i<_zhixingRens.length;i++){
            var obj = {};
            if(flag){
                obj.wxrID = _zhixingRens[i].wxrID;
            }
            obj.wxRen = _zhixingRens[i].wxRen;
            obj.wxRName = _zhixingRens[i].wxRName;
            obj.wxRDh = _zhixingRens[i].wxRDh;
            obj.gdCode = _gdCode;
            workerArr.push(obj);
        }
        var gdWR = {
            gdCode :_gdCode,
            gdWxRs:workerArr,
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + url,
            data:gdWR,
            success:function(result){

                if(result == 99){

                    delZxrIsSuccess = true;

                }else{

                    delZxrIsSuccess = false;

                }

                if( delZxrIsSuccess ){

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,'回退成功！', '');

                    $('#Fallback-Modal').modal('hide');

                    $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                }else{

                    var str = '执行人删除失败,退回成功！';

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,str, '');

                    $('#Fallback-Modal').modal('hide');

                    $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);
            }
        });
    }

    //取消
    $('.table').on('click','.option-cancel',function(){

        //样式
        $(this).parents('tbody').find('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //初始化
        $('#Cancel-Modal').find('.modal-body').find('input').val('');

        $('#Cancel-Modal').find('.modal-body').find('textarea').val('');

        //首先判断是是能回退

        _thisStateNum = $(this).parents('tr').find('.gdCode').children().attr('data-zht');

        _thisState = GDDes(_thisStateNum);

        _thisCodeNum = $(this).parents('tr').find('.gdCode').find('a').html();

        _thisWXSX = $(this).parents('tr').children('.WXSX').html();

        _thisWXBZ = $(this).parents('tr').children('.WXBZ').html();

        _thisCFZ = $(this).parents('tr').find('.gdCode').children().attr('data-gdcircle');

        $('#gdCode2').val(_thisCodeNum);

        $('#gdStatus2').val(_thisState);

        $('#gdWxItem2').val(_thisWXSX);

        $('#gdWxClass2').val(_thisWXBZ);

        _moTaiKuang($('#Cancel-Modal'), '您确定要进行取消操作吗？', '', '' ,'', '确定');

    })

    //取消确定按钮
    $('#Cancel-Modal').on('click','.btn-primary',function(){

        //取消原因必填

        if($('#cancelDes').val() == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写取消原因！', '');

            return false;

        }

        var gdInfo = {
            //工单号
            "gdCode": _thisCodeNum,

            "userID": _userIdNum,

            'userName':_userIdName,

            "delReason":$('#cancelDes').val()
        }

        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDDel',
            data:gdInfo,
            success:function(result){
                if(result == 99){

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,'工单取消成功！', '');

                    $('#Cancel-Modal').modal('hide');

                    $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                }else{

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,'工单取消失败！', '');

                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    })

    //改变报修电话，其他项初始化，true的时候，报修电话初始化，false的时候，报修科室初始化
    function bxListInfo(flag){

        if(flag){
            //报修科室
            gdObj.bxkesh = '';

            $('#bxkesh').removeAttr('data-num');
        }

        //报修人
        gdObj.bxren = '';

        //故障位置
        gdObj.gzplace = '';

    }

    //协助方法
    function assistFun(){

        var prm = {

            //工单号
            'gdCode':$('#filter_global').children().val(),
            //开始时间
            'gdSt':$('.min').val(),
            //结束时间
            'gdEt':moment($('.max').val()).add(1,'d').format('YYYY/MM/DD')
        };

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDGetMayDJ',

            data:prm,

            timeout:_theTimes,

            //发送数据之前
            beforeSend:_beforeSendFun,

            //发送数据完成之后
            complete:_completeFun,

            //成功
            success:function(result){

                _datasTable($('#assist-list'),result);

            },

            //失败
            error: _errorFun

        })

    }

})