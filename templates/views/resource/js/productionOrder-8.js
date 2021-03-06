//记录当前工单号码
var _gdCode = '';

//存放线路数组
var _lineArr = [];

var _allDataBM = [];

$(function(){
    /*-------------------------------全局变量-------------------------------------------------*/

    //设置初始时间(主表格时间)
    var _initStart = moment().subtract(6, 'month').startOf('day').format('YYYY/MM/DD');;
    var _initEnd = moment().format('YYYY/MM/DD');

    //时间初始化
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language: 'zh-CN',
        gotoCurrent:true,
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',
        forceParse: 0
    });

    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);

    //时间参数
    var slrealityStart = '';

    var slrealityEnd = '';

    //影响单位
    var  _InfluencingArr = [];

    //影响单位
    InfluencingUnit();

    //车间
    _ajaxFun('YWDev/ywDMGetDDs', _allDataBM, $('#station'), 'ddName', 'ddNum');

    //系统类型数组
    var _allDataXT = [];

    //系统类型
    _ajaxFun('YWDev/ywDMGetDSs',_allDataXT, $('#xtlx'), 'dsName', 'dsNum');

    //线路
    lineRouteData($('#line'));

    //获取分类原因
    classificationReasons();

    //重发值
    var _gdCircle = 0;

    //记录当前的状态
    var _gdState = '';

    //查看值绑定vue对象
    //弹出框信息绑定vue对象
    var app33 = new Vue({
        el:'#myApp33',
        data:{
            picked:'0',
            telephone:'',
            person:'',
            place:'',
            section:'',
            matter:'',
            sections:'',
            remarks:'',
            rwlx:4,
            sbSelect:'',
            sbLX:'',
            sbMC:'',
            sbBM:'',
            azAddress:'',
            whether:'',
            gdly:''
        },
        methods:{
            radios:function(){
                $('.inpus').click(function(a){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            }
        }
    });

    //关单vue对象
    var pingjia = new Vue({
        el:'#pingjia',
        data:{
            pickeds:'5',
            beizhu:'',
            baoxiudianhua:'',
            baoxiubumen:'',
            baoxiurenxingming:'',
            weixiudidian:'',
            weixiubumen:'',
            baoxiubeizhu:'',
            wxbeizhu:''
        },
        methods:{
            radioss:function(){
                $('.inpus').click(function(a){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            }
        }
    });

    //执行人数组
    var _zhixingRens = [];

    //材料数组
    var _weiXiuCaiLiao = [];

    //负责人数组
    var _fuZeRen = [];

    //执行人员的标识
    var _workerFlag = false;
    //物料的标识
    var _WLFlag = false;
    //状态标识
    var _stateFlag = false;
    //负责人标识
    var _leaderFlag = false;

    //条件查询车站
    addStationDom($('#bumen').parent());

    //存放当前工单申请备件的数组
    var _beiJArr = [];

    //工单2
    var _gdCode2 = '';

    //当前的车站编码
    var _chezhanCode = '';

    /*------------------------------表格初始化-----------------------------------------------*/
    //页面表格
    var table = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "order": [13,'asc'],
        "pagingType": "full_numbers",
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            //"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
            'infoEmpty': '没有数据',
            'paginate': {
                "previous": "上一页",
                "next": "下一页",
                "first": "首页",
                "last": "尾页"
            }
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className: 'saveAs',
                header: true,
                exportOptions:{
                    columns:[0,1,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17]
                }
            }
        ],
        "dom": 't<"F"lip>',
        "columns": [
            {
                title:'工单号',
                data:'gdCode2',
                className:'gdInfo',
                render:function(data, type, row, meta){
                    return '<span class="gongdanId" gdCode="' + row.gdCode +
                        '"' + "gdCircle=" + row.gdCircle +
                        '></span><a href="productionOrder_see.html?gdCode=' +  row.gdCode  +  '&gdCircle=' + row.gdCircle +
                        '"' +
                        'target="_blank">' + data + '</a>'
                }
            },
            {
                title:'工单类型',
                data:'gdJJ',
                render:function(data, type, full, meta){
                    if(data == 0){
                        return '普通'
                    }if(data == 1){
                        return '快速'
                    }
                }
            },
            {
                title:'工单状态',
                data:'gdZht',
                className:'gongdanZt',
                render:function(data, type, full, meta){
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
                    }
                }
            },
            {
                title:'任务级别',
                data:'gdLeixing',
                render:function(data, type, full, meta){
                    if(data == 1){
                        return '一级任务'
                    }if(data == 2){
                        return '二级任务'
                    }if(data == 3){
                        return '三级任务'
                    }if(data == 4){
                        return '四级任务'
                    }
                }
            },
            {
                title:'工单来源',
                data:'gdCodeSrc',
                render:function(data, type, full, meta){
                    if(data == 1){
                        return '车站报修'
                    }else{
                        return '现场人员报修'
                    }
                }
            },
            {
                title:'工单状态值',
                data:'gdZht',
                className:'ztz'
            },
            {
                title:'系统类型',
                data:'wxShiX'
            },
            {
                title:'设备名称',
                data:'dName'
            },
            {
                title:__names.department,
                data:'bxKeshi',
                className:'stationNum',
                render:function(data, type, full, meta){

                    return '<span data-num="' + full.bxKeshiNum +'"> ' + data + ' </span>'

                }
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
                title:'最新处理情况',
                data:'lastUpdateInfo',
                render:function(data, type, full, meta){
                    if(full.clStatus == 10){
                        return '备件进展：' + data;
                    }else{
                        return data
                    }
                }
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
                title:'备件信息',
                data:'wxClNames'
            },
            {
                title:__names.group,
                data:'wxKeshi'
            },
            {
                title:'受理时间',
                data:'shouLiShij'
            },
            {
                title:'督察督办责任人',
                data:'wxUserNames'
            },
            {
                title:'超时',
                data:'timeSpan',
                render:function(data, type, full, meta){
                    if(data>0){
                        return '<span style="color: red;">' + data + '</span>';
                    }else{
                        return '<span style="color: green;">' + data + '</span>';
                    }
                }
            },
            {
                title:'操作',
                data:'clStatus',
                render:function(data, type, full, meta){
                    if(data==10){
                        return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option tablePingjia btn default btn-xs purple'>关单</span>" + "<span class='data-option option-beijian btn default btn-xs green-stripe'>备件审核</span>"
                    }else{
                        return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option tablePingjia btn default btn-xs purple'>关单</span>"
                    }
                }
            }
        ]
    });

    //自定义按钮位置
    table.buttons().container().appendTo($('.excelButton'), table.table().container());

    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function (s, h, m) {
        console.log('')
    };

    //条件查询
    conditionSelect();

    //执行人员表格初始化
    $('#personTable1').DataTable({
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
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                class:'checkeds',
                "targets": -1,
                "data": 'wxRQZ',
                render:function(data, type, row, meta){
                    if(data == 1){
                        return "<div class='checker'><span class='checked'><input type='checkbox'></span></div>"
                    }else{
                        return "<div class='checker'><span><input type='checkbox'></span></div>"
                    }
                }
            },
            {
                title:'执行人员',
                data:'wxRName'
            },
            {
                title:'工号',
                data:'wxRen'
            },
            {
                title:'联系电话',
                data:'wxRDh'
            }
        ]
    });

    //维修配件表格初始化
    $('#personTables1').DataTable({
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
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'备件编码',
                data:'wxCl'
            },
            {
                title:'备件名称',
                data:'wxClName'
            },
            {
                title:'规格型号',
                data:'size'
            },
            {
                title:'数量',
                data:'clShul'
            },
            {
                title:'单位',
                data:'unitName'
            }
        ]
    });

    //维修管理
    $('#personTables11').DataTable({
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
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'备件编码',
                data:'wxCl'
            },
            {
                title:'备件名称',
                data:'wxClName'
            },
            {
                title:'分类',
                data:'cateName'
            },
            {
                title:'规格',
                data:'size'
            },
            {
                title:'数量',
                data:'clShul'
            },
            {
                title:'库存',
                data:'kucun'
            }
        ]
    });
    /*------------------------------按钮点击功能----------------------------------------------*/


    //影响单位、用户分类联动
    $('#influence-unite').change(function(){
        var values = $('#influence-unite').val();
        $('#userClass').empty();
        if(values == ''){
            InfluencingUnit('flag');
        }else{
            for(var i=0;i<_InfluencingArr.length;i++){
                if(values == _InfluencingArr[i].departNum){
                    var str = '<option value="">请选择</option>';
                    for(var j=0;j<_InfluencingArr[i].wxBanzus.length;j++){
                        str += '<option value="' + _InfluencingArr[i].wxBanzus[j].departNum +
                            '">' + _InfluencingArr[i].wxBanzus[j].departName + '</option>'
                    }
                    $('#userClass').empty().append(str);
                }
            }
        }
    });

    //查询
    $('#selected').click(function(){
        conditionSelect();
    });

    //重置
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        var selects = parents.find('select');
        inputs.val('');
        selects.val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    });

    var _currentChexiao = false;
    var _currentClick;
    //查看详情
    $('#scrap-datatables tbody')
        .on('click','.option-see',function(e){

            //初始化
            detailInit();

            //模态框
            _moTaiKuang($('#myModal'), '查看', true, '' ,'', '');

            //样式
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

            $(this).parents('tr').addClass('tables-hover');

            //赋值
            _gdCode = $(this).parents('tr').children('td').children('.gongdanId').attr('gdCode');

            _gdCircle = $(this).parents('tr').children('td').children('.gongdanId').attr('gdcircle');

            _gdState = parseInt($(this).parents('tr').children('.ztz').html());

            //发送数据，获取详情
            var prm = {
                //工单号
                'gdCode':_gdCode,
                //工单状态
                'gdZht':_gdState,
                //工单重复率
                'gdCircle':_gdCircle,
                //当前用户id
                'userID':_userIdNum,
                //当前用户名
                'userName':_userIdName

            }

            $.ajax({

                type:'post',
                url: _urls + 'YWGD/ywGDGetDetail',
                data:prm,
                timeout:_theTimes,
                beforeSend:function(){
                    $('#theLoading').modal('show');
                },
                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success:function(result){

                    //数据绑定
                    bindSeeData(result);

                    //处理过程
                    logInformation(0);

                },
                error:function(jqXHR, textStatus, errorThrown){

                    //清除loadding
                    $('#theLoading').modal('hide');

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                        _moTaiKuang($('#myModal3'), '提示', true, 'istap' ,'超时!', '');

                    }else{

                        _moTaiKuang($('#myModal3'), '提示', true, 'istap' ,'请求失败!', '');

                    }


                }

            })

            //不可操作
            disabledOption();

            //防止冒泡
            e.stopPropagation();

        })
        .on('click','.tablePingjia',function(e){

            //初始化
            colseInit();

            //模态框
            _moTaiKuang($('#myModal1'), '关闭工单', '', '','','关单');

            //样式
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

            $(this).parents('tr').addClass('tables-hover');

            //绑定数据
            //工单号
            _gdCode = $(this).parents('tr').find('.gdInfo').children().attr('gdcode');
            //工单状态
            _gdState = $(this).parents('tr').find('.ztz').html();
            //工单重发值
            _gdCircle = $(this).parents('tr').find('.gdInfo').children().attr('gdcircle');

            var prm = {
                //工单号
                'gdCode':_gdCode,
                //工单状态
                'gdZht':_gdState,
                //当前用户id
                'userID':_userIdNum,
                //工单重发值
                'gdCircle':_gdCircle
            }

            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDGetDetail',
                data:prm,
                success:function(result){
                    //绑定数据
                    //报修电话
                    pingjia.baoxiudianhua = result.bxDianhua;
                    //车站
                    pingjia.baoxiubumen = result.bxKeshi;
                    //报修人姓名
                    pingjia.baoxiurenxingming = result.bxRen;
                    //故障位置
                    pingjia.weixiudidian = result.wxDidian;
                    //维修班组
                    pingjia.weixiubumen = result.wxKeshi;
                    //备注
                    pingjia.baoxiubeizhu = result.bxBeizhu;
                    //维修内容
                    pingjia.wxbeizhu = result.wxBeizhu;
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })

            e.stopPropagation();
        })
        .on('click','tr',function(){
            _gdCircle = $(this).children('td').children('.gongdanId').attr('gdcircle');
            var $this = $(this);
            _currentChexiao = true;
            _currentClick = $this;
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            //获得详情
            var gdCode = parseInt($this.children('td').children('.gongdanId').attr('gdCode'));
            var gdZht = parseInt($this.children('.ztz').html());
            _gdState = gdZht
            _gdCode = gdCode;
            var prm = {
                "gdCode": gdCode,
                "gdZht": gdZht,
                "wxKeshi": "",
                "userID": _userIdNum,
                'gdCircle':_gdCircle
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDGetDetail',
                data:prm,
                success:function(result){
                    if(result){
                        _zhixingRens = result.wxRens;
                        _weiXiuCaiLiao = result.wxCls;
                        _fuZeRen = result.gdWxLeaders;
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        })
        .on('click','.option-beijian',function(e){

            //初始化
            bjInit();

            //模态框
            moTaiKuang($('#myModal5'),'维修备件申请');

            //样式
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

            $(this).parents('tr').addClass('tables-hover');

            //绑定数据
            //工单号
            _gdCode = $(this).parents('tr').find('.gdInfo').children().attr('gdcode');
            //工单状态
            _gdState = $(this).parents('tr').find('.ztz').html();
            //工单重发值
            _gdCircle = $(this).parents('tr').find('.gdInfo').children().attr('gdcircle');

            //工单2
            _gdCode2 = $(this).parents('tr').find('.gdInfo').children('a').html();

            //车站编码
            _chezhanCode = $(this).parents('tr').find('.stationNum').children('span').attr('data-num');

            var prm = {
                //工单号
                'gdCode':_gdCode,
                //工单状态
                'gdZht':_gdState,
                //当前用户id
                'userID':_userIdNum,
                //工单重发值
                'gdCircle':_gdCircle
            }

            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDGetDetail',
                data:prm,
                success:function(result){
                    var bmArr = [];
                    //存放物料的数组
                    var wlArr = [];

                    _beiJArr.length = 0;

                    for(var i=0;i<result.wxCls.length;i++){
                        wlArr.push(result.wxCls[i]);
                        bmArr.push(result.wxCls[i].wxCl);
                        _beiJArr.push(result.wxCls[i]);
                    }
                    //备件图片
                    _imgBJNum = result.hasBjImage;

                    //根据itemNums获取多个物品的库存
                    var prm = {
                        userID : _userIdNum,
                        userName : _userIdName,
                        itemNums:bmArr
                    };
                    $.ajax({
                        type:'post',
                        url:_urls + 'YWCK/ywCKRptGetItemStockByItemNums',
                        data:prm,
                        success:function(result){
                            for(var i=0;i<wlArr.length;i++){
                                for(var j=0;j<result.length;j++){
                                    if(wlArr[i].wxCl == result[j].itemNum){
                                        wlArr[i].kucun = result[j].num
                                    }
                                }
                            }

                            //维修材料
                            datasTable($("#personTables11"),wlArr);
                        },
                        error:function(jqXHR, textStatus, errorThrown){
                            console.log(jqXHR.responseText);
                        }
                    })

                    //生成用料单

                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })

            //获取日志

            logInformation(2);

            stateConstant('2');

            //备件走向
            determineTrend();

            $('#bjremark').val('');

            e.stopPropagation();
        })
    //关单确定按钮
    //去评价
    $('.pingjiaButton').click(function(){
        //获取评价内容
        $('#myModal1').modal('hide');
        //发送评价之后的数据
        var gdInfo = {
            'gdCode':_gdCode,
            'pjBz': pingjia.beizhu,
            'pingjia':pingjia.pickeds,
            'userID':_userIdNum,
            'userName':_userIdName
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDUptPingjia',
            data:gdInfo,
            success:function(result){
                if(result == 99){

                    getGongDan();
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    });

    //回退；
    $('.chexiao').click(function(){
        if(_currentClick){
            var zhuangtai = parseInt(_currentClick.children('.ztz').html());
            if(zhuangtai == 2 || zhuangtai == 3 || zhuangtai == 4 || zhuangtai == 5 || zhuangtai == 6 || zhuangtai == 7){
                moTaiKuang($('#myModal3'),'回退');
            }else{
                $('#myModal2').find('.modal-body').html('无法操作');
                moTaiKuang($('#myModal2'),'提示','flag');
            }
        }else{
            $('#myModal2').find('.modal-body').html('请选择要回退的工单!');
            moTaiKuang($('#myModal2'),'提示','flag');
        }
    });

    //取消
    $('.zuofei').click(function(){
        if(_currentClick){
            var zhuangtai = parseInt(_currentClick.children('.ztz').html());
            if(zhuangtai == 7){
                $('#myModal2').find('.modal-body').html('已完成状态工单无法进行取消操作');
                moTaiKuang($('#myModal2'),'提示','flag');
            }else if(zhuangtai == 999){
                $('#myModal2').find('.modal-body').html('该工单已取消！');
                moTaiKuang($('#myModal2'),'提示','flag');
            }else{
                moTaiKuang($('#myModal4'),'取消');
            }
        }else{
            $('#myModal2').find('.modal-body').html('请选择要报废的工单!');
            moTaiKuang($('#myModal2'),'提示','flag');
        }
    });

    //撤销（回退）
    $('#myModal3').find('.btn-primary').click(function (){
        if(_currentChexiao){
            var gdState = parseInt(_currentClick.find('.ztz').html());
            var htState = 0;
            if(gdState == 2){
                htState = 1;
            }else if( gdState == 3 || gdState == 4 || gdState == 5 || gdState == 6 || gdState == 7){
                htState = 2;
            }
            var gdCodes = _currentClick.children('td').eq(0).children('span').attr('gdcode');
            var gdInfo = {
                "gdCode": gdCodes,
                "gdZht": htState,
                "userID": _userIdNum,
                'userName':_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDReturn',
                data:gdInfo,
                success:function(result){
                    if(result == 99){
                        _stateFlag = true;
                        if(htState == 1){
                            //删除该工单负责人
                            if(_fuZeRen.length>0){
                                manager('YWGD/ywGDDelWxLeader','flag');
                            }
                            if( _stateFlag && _leaderFlag ){
                                $('#myModal3').modal('hide');
                                moTaiKuang($('#myModal2'),'提示','flag');
                                $('#myModal2').find('.modal-body').html('回退成功！');
                            }else{
                                var str = '';
                                if( _leaderFlag == false ){
                                    str += '工长删除失败，'
                                }else{
                                    str += '工长删除成功，'
                                }
                                if( _stateFlag == false ){
                                    str += '退回失败！'
                                }else{
                                    str += '退回成功！'
                                }
                                moTaiKuang($('#myModal2'), '提示','flag');
                                $('#myModal2').find('.modal-body').html(str);
                            }
                        }else if(htState == 2){
                            //删除该工单的执行人和材料
                            if(_zhixingRens.length>0){
                                Worker('YWGD/ywGDDelWxR','flag');
                            }
                            //判断有无材料
                            if(_weiXiuCaiLiao.length >0){
                                CaiLiao('YWGD/ywGDDelWxCl','flag');
                            }
                            if( _workerFlag && _WLFlag && _stateFlag ){
                                $('#myModal3').modal('hide');
                                moTaiKuang($('#myModal2'),'提示','flag');
                                $('#myModal2').find('.modal-body').html('回退成功！');
                            }else{
                                var str = '';
                                if( _workerFlag == false ){
                                    str += '执行人删除失败，'
                                }else{
                                    str += '执行人删除成功，'
                                }
                                if( _WLFlag == false ){
                                    str += '物料删除失败，'
                                }else{
                                    str += '物料删除成功，'
                                }
                                if( _stateFlag == false ){
                                    str += '退回失败，'
                                }else{
                                    str += '退回成功，'
                                }
                                moTaiKuang($('#myModal2'),'提示','flag');
                                $('#myModal2').find('.modal-body').html(str);
                            }
                        }
                        conditionSelect();
                        $('#myModal3').modal('hide');
                        moTaiKuang($('#myModal2'),'提示','flag');
                        $('#myModal2').find('.modal-body').html('回退成功！');
                    }else{
                        _stateFlag = false;
                        moTaiKuang($('#myModal2'),'提示','flag');
                        $('#myModal2').find('.modal-body').html('回退失败！');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
    })
    //作废(取消)
    $('#myModal4').find('.btn-primary').click(function (){
        if(_currentChexiao){
            var gdInfo = {
                "gdCode": _gdCode,
                "userID": _userIdNum,
                "userName": _userIdName
            }
            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDDel',
                data:gdInfo,
                success:function(result){
                    if(result == 99){
                        conditionSelect();
                        $('#myModal2').find('.modal-body').html('工单取消成功！');
                        moTaiKuang($('#myModal2'),'提示','flag');
                        $('#myModal4').modal('hide');
                    }else{
                        $('#myModal2').find('.modal-body').html('工单取消失败！');
                        moTaiKuang($('#myModal2'),'提示','flag');
                        $('#myModal4').modal('hide');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
        $('#myModal1').modal('hide');
    })

    $('#myModal5').on('click','.btn-primary:nth-child(1)',function(){

        applySparePart($(this),'flag');
    });

    $('#myModal5').on('click','.btn-primary:nth-child(2)',function(){

        applySparePart($(this));
    });

    /*------------------------------其他方法-------------------------------------------------*/

    //线路数据
    function lineRouteData(el) {
        var prm = {
            'userID':_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetDLines',
            data:prm,
            success:function(result){
                _lineArr = [];
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    _lineArr.push(result[i]);
                    str += '<option value="' + result[i].dlNum +
                        '">' + result[i].dlName +'</option>'
                }
                el.empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //条件查询
    function conditionSelect(){
        if($('.datatimeblock').eq(0).val() == ''){
            slrealityStart = ''
        }else{
            slrealityStart = moment($('.datatimeblock').eq(0).val()).format('YYYY/MM/DD') + ' 00:00:00';
        }
        if($('.datatimeblock').eq(1).val() == ''){
            slrealityEnd = ''
        }else{
            slrealityEnd = moment($('.datatimeblock').eq(1).val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        }
        var prm = {
            gdCode2:$('#gdcode').val(),
            gdSt:slrealityStart,
            gdEt:slrealityEnd,
            userID:_userIdNum,
            userName:_userIdName,
            gdZht:0,
            gdZhts: [
                1,2,3,4,5,6
            ],
            isCalcTimeSpan:1,
            gdZht:$('#gdzt').val(),
            //isReturnZhtArray:1
            wxShiXNum:$('#xtlx').val()
        };
        var bzArr = [];
        var cheArr = [];
        //如果车站为空，就判断线路，线路为空的话，wxKeshis和wxKeshi不传，线路不为空的话，传wxKeshis，车站不为空，wxKeshi
        var station = $('#bumen').parent().next().find('span').attr('values');

        var stationValues = ''

        if(typeof station == 'undefined'){

            stationValues = '';

        }else{

            stationValues = station;

        }

        if(stationValues == ''){

            if($('#line').val() == ''){



            }else{

                for(var i=0;i<_lineArr.length;i++){

                    if($('#line').val() == _lineArr[i].dlNum){

                        for(var j=0;j<_lineArr[i].deps.length;j++){

                            cheArr.push(_lineArr[i].deps[j].ddNum);

                        }

                    }

                }

                prm.bxKeshiNums = cheArr;

            }

        }else{

            prm.bxKeshiNum = stationValues;

        }

        //如果维修班组为空，就判断车间，如果车间为空，bxKeshiNums和bxKeshiNum不传，维修班组不为空bxKeshiNum
        var wxbz = $('#userClass').val();

        if(wxbz == ''){

            if($('#influence-unite').val() == ''){


            }else{

                var wxbzArr = $('#userClass').children();

                for(var i=1;i<wxbzArr.length;i++){

                    bzArr.push(wxbzArr.eq(i).attr('value'));

                }

                prm.wxKeshis = bzArr;

            }

        }else{

            prm.wxKeshi = wxbz;

        }


        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDGetZh2',
            data:prm,
            success:function(result){
                _jumpNow($("#scrap-datatables"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取到影响单位、用户分类
    function InfluencingUnit(flag){
        var prm = {
            "id": 0,
            "ddNum": "",
            "ddName": "",
            "ddPy": "",
            "daNum": "",
            "userID": _userIdNum,
            "userName": _userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetWxBanzuStation',
            data:prm,
            success:function(result){
                var str = '<option value="">请选择</option>';
                var str1 = '<option value="">请选择</option>';
                if(flag){
                    for(var i=0;i<result.wxBanzus.length;i++){
                        str1 += '<option value="' + result.wxBanzus[i].departNum +
                            '">' + result.wxBanzus[i].departName + '</option>';
                    }
                    $('#userClass').empty().append(str1);
                }else{
                    _InfluencingArr = [];
                    for(var i=0;i<result.stations.length;i++){
                        _InfluencingArr.push(result.stations[i]);
                        str += '<option value="' + result.stations[i].departNum +
                            '">' + result.stations[i].departName + '</option>';
                    }
                    for(var i=0;i<result.wxBanzus.length;i++){
                        str1 += '<option value="' + result.wxBanzus[i].departNum +
                            '">' + result.wxBanzus[i].departName + '</option>';
                    }
                    $('#influence-unite').empty().append(str);
                    $('#userClass').empty().append(str1);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //dataTables表格填数据
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

    //获取到分类原因
    function classificationReasons(){
        var prm = {
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDengdyy',
            data:prm,
            success:function(result){
                var str = '<option>请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].reasonNum + '">' + result[i].reasonDesc + '</option>';
                }
                $('#cause-classification').empty().append(str);
            }
        })
    }

    //模态框自适应
    function moTaiKuang(who,title,flag){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.find('.modal-title').html(title);
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
    }

    //状态转换
    function getGongDan(){
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
            success:function(result){
                if(result == 99){
                    //初始化单选框和评价意见
                    $('#myModal2').find('.modal-body').html('已完成关单');
                    moTaiKuang($('#myModal2'),'提示','flag');
                    conditionSelect();
                }else {
                    $('#myModal2').find('.modal-body').html('关单失败');
                    moTaiKuang($('#myModal2'),'提示','flag');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取日志信息（备件logType始终传2,flag:查看备件的处理记录）
    function logInformation(log){
        var gdLogQPrm = {
            "gdCode": _gdCode,
            "logType": log,
            "userID": _userIdNum,
            "userName": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywDGGetLog',
            data:gdLogQPrm,
            success:function(result){
                $('.deal-with-list').empty();
                var str = '';
                for(var i =0;i<result.length;i++){
                    //str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '</li>'

                    str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';

                }
                $('.deal-with-list').empty().append(str).show();
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
            async:false,
            success:function(result){
                if(result == 99){
                    _workerFlag = true;
                }else{
                    _workerFlag = false;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        });
    }

    //删除物料方法
    function CaiLiao(url,flag){
        var cailiaoArr = [];
        for(var i=0;i<_weiXiuCaiLiao.length;i++){
            var obj = {};
            if(flag){
                obj.wxClID = _weiXiuCaiLiao[i].wxClID
            }
            obj.wxCl = _weiXiuCaiLiao[i].wxCl;
            obj.wxClName = _weiXiuCaiLiao[i].wxClName;
            obj.clShul = _weiXiuCaiLiao[i].clShul;
            obj.gdCode = _gdCode;
            cailiaoArr.push(obj);
        }
        var gdWxCl = {
            gdCode:_gdCode,
            gdWxCls:cailiaoArr,
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + url,
            data:gdWxCl,
            async:false,
            success:function(result){
                if(result == 99){
                    _WLFlag = true;
                }else{
                    _WLFlag = false;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
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
            gdCode:_gdCode,
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
                    _leaderFlag = true;
                }else{
                    _leaderFlag = false;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //当前状态
    //获取配件状态常量 flag的时候，1获取操作类型下拉框。否则，2是条件查询获取的下拉框  3判断状态，
    //1的时候，获取条件查询下面的下拉框
    function stateConstant(flag){
        var prm ={
            "userID": _userIdNum,
            "userName": _userIdName,
        }
        if(flag == 2){
            prm.gdCode=_gdCode
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetPjStatus',
            data:prm,
            async:false,
            success:function(result){
                if(flag == 1){
                    _stateArr = [];
                    //获取条件查询时候的备件进度下拉框
                    var str ='<option value="">请选择</option>';
                    for(var i=0;i<result.statuses.length;i++){
                        _stateArr.push(result.statuses[i]);
                        if(result.statuses[i].clType == 2){
                            str += '<option value="' + result.statuses[i].clStatusID +
                                '">' + result.statuses[i].clStatus + '</option>';
                        }
                    }
                    $('#line-point').empty().append(str);
                }else if(flag == 2){
                    //备件管理中操作类型以及现在工单的备件状态码
                    var str ='';
                    for(var i=0;i<result.statuses.length;i++){
                        if(result.statuses[i].clType == 2){
                            str += '<button type="button" class="btn btn-primary"' + 'data-value='+ result.statuses[i].clTo +
                                '>' + result.statuses[i].clOpt + '</button>'
                        }
                    }
                    str += '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>';
                    $('#myModal5').find('.modal-footer').empty().append(str);
                    for(var i=0;i<result.statuses.length;i++){
                        if(result.clStatus == result.statuses[i].clStatusID){
                            $('.nowState').val(result.statuses[i].clStatus);
                            $('.nowState').attr('bjState',result.statuses[i].clStatusID);
                        }
                    }
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取确定备件的走向
    function determineTrend(){
        var prm ={
            gdCode:_gdCode,
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywDGGetCK2',
            data:prm,
            success:function(result){
                _trend = result;
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //申请备件(同意【flag】，拒绝)
    function applySparePart(el,flag){

        var stateTrend = el.attr('data-value');

        var stateHtml = el.html();

        if(flag){

            var arr = stateTrend.split(',');

            if(_trend == ''){

                stateTrend = arr[0];

            }else{

                stateTrend = arr[1];

            }

        }
        var prm = {

            "gdCode": _gdCode,
            "clStatusId": stateTrend,
            "clStatus": stateHtml,
            "clLastUptInfo": $('#bjremark').val(),
            "userID": _userIdNum,
            "userName": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptPeijStatus',
            data:prm,
            success:function(result){
                if( result == 99 ){

                    if(flag){

                        //调用创建物料单接口
                        ldAdd(_beiJArr);

                    }else{

                        $('#myModal2').find('.modal-body').html('操作成功');

                        moTaiKuang($('#myModal2'),'提示','flag');

                        $('#myModal5').modal('hide');

                        conditionSelect();

                    }

                }else{

                    $('#myModal2').find('.modal-body').html('操作失败');

                    moTaiKuang($('#myModal2'),'提示','flag');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'审核失败！', '');

            }
        })
    }

    //创建物料单
    function ldAdd(arr){

        //审核通过之后创建物料单

        console.log(arr);

        var wpArr1 = [];

        for(var i=0;i<arr.length;i++){

            var obj = {};

            //车站编号
            obj.bxKeshiNum = _chezhanCode;
            //工单号
            obj.gdCode2 = _gdCode2;
            //申请的物品编码
            obj.itemNum1 = arr[i].wxCl;
            //序列号
            obj.sn = '';
            //用户id
            obj.userID = _userIdNum;
            //用户名
            obj.userName = _userIdName;

            wpArr1.push(obj);

        }

        var prm1 = {

            prm:wpArr1

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWCK/ywCKAddPickList',

            timeout:_theTimes,

            data:prm1,

            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'审核通过，创建用料单成功！', '');

                    $('#myModal5').modal('hide');

                    conditionSelect();


                }else{

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'审核通过，创建用料单失败！', '');


                    $('#myModal5').modal('hide');

                }

            },

            error:function(jqXHR, textStatus, errorThrown){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'审核通过，创建用料单失败！', '');

                console.log(jqXHR.responseText);

            }

        })


    }

    //模态框初始化
    function detailInit(){

        //工单类型
        app33.picked = '';
        //工单来源
        app33.gdly = '';
        //任务级别
        app33.rwlx = '';
        //报修电话
        app33.telephone = '';
        //报修人信息
        app33.person = '';
        //故障位置
        app33.place = '';
        //车站
        app33.section = '';
        //系统类型
        app33.matter = '';
        //设备编码
        app33.sbSelect = '';
        //设备名称
        app33.sbMC = '';
        //维修班组
        app33.sections = '';
        //发生时间
        $('#myApp33').find('.otime').val('');
        //故障描述
        app33.remarks = '';
        //维修内容
        app33.wxbeizhu = '';
        //查看图片
        //图片区域隐藏
        $('.showImage').hide();
        //备件区域隐藏
        $('.bjImg').hide();
        //表格初始化
        var arr = [];
        //执行人员
        _datasTable($('#personTable1'),arr);
        //维修备件
        _datasTable($('#personTables1'),arr);
        //处理记录
        $('.processing-record').children('ul').empty();
        //单选按钮
        $('#myApp33').find('.inpus').parent('span').removeClass('checked');

    }

    //不可操作
    function disabledOption(){

        $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
        $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
        $('#myApp33').find('textarea').attr('disabled',true).addClass('disabled-block');
        $('#uniform-ones').parent('.input-blockeds').addClass('disabled-block');

    }

    //信息绑定
    function bindSeeData(result){

        //工单类型
        app33.picked = result.gdJJ;
        //工单来源
        app33.gdly = result.gdCodeSrc;
        //任务级别
        app33.rwlx = result.gdLeixing;
        //报修电话
        app33.telephone = result.bxDianhua;
        //报修人信息
        app33.person = result.bxRen;
        //故障位置
        app33.place = result.wxDidian;
        //车站
        app33.section = result.bxKeshi;
        //系统类型
        app33.matter = result.wxShiX;
        //设备编码
        app33.sbSelect = result.wxShebei;
        //设备名称
        app33.sbMC = result.dName;
        //维修班组
        app33.sections = result.wxKeshi;
        //发生时间
        $('#myApp33').find('.otime').val(result.gdFsShij);
        //故障描述
        app33.remarks = result.bxBeizhu;
        //维修内容
        app33.wxbeizhu = result.wxBeizhu;
        //查看图片
        //工单图片
        _imgNum = result.hasImage;
        //备件图片
        _imgBJNum = result.hasBjImage;
        //表格初始化
        //执行人员
        _datasTable($('#personTable1'),result.wxRens);
        //维修备件
        _datasTable($('#personTables1'),result.wxCls);
        //处理记录
        $('.processing-record').children('ul').empty();
        //单选按钮
        $('#myApp33').find('.inpus').parent('span').removeClass('checked');

        //绑定弹窗数据
        if(result.gdJJ == 1){
            $('.inpus').parent('span').removeClass('checked');

            $('#ones').parent('span').addClass('checked');

        }else{
            $('.inpus').parent('span').removeClass('checked');

            $('#twos').parent('span').addClass('checked');

        }

        //执行人数组
        _zhixingRens = result.wxRens;
        //负责人数组
        _fuZeRen = result.gdWxLeaders;

    }

    //关单初始化
    function colseInit(){

        //满意度
        pingjia.pickeds = 5;
        //评价意见
        pingjia.beizhu = '';
        //报修电话
        pingjia.baoxiudianhua = '';
        //车站
        pingjia.baoxiubumen = '';
        //报修人姓名
        pingjia.baoxiurenxingming = '';
        //故障位置
        pingjia.weixiudidian = '';
        //维修班组
        pingjia.weixiubumen = '';
        //备注
        pingjia.baoxiubeizhu = '';
        //维修内容
        pingjia.wxbeizhu = '';

        //单选按钮
        $('#pingjia').find('.radio').children('span').removeClass('checked');

        //默认选择满意
        $('#pingjia').find('#henmanyi').parent('span').addClass('checked');

    }

    //备件初始化
    function bjInit(){

        //维修备件
        var arr = [];

        _datasTable($('#personTables11'),arr);

        //当前状态
        $('#myModal5').find('.nowState').val('');

        //备注
        $('#bjremark').val('');

        //备件图片隐藏
        $('.bjImg').hide();

        //处理记录
        $('.deal-with-list').empty();


    }

})