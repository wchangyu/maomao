//记录当前工单号
var _gdCode = '';

$(function(){
    /*-------------------------------全局变量-------------------------------------------------*/
    //获得用户ID
    var _userIdNum = sessionStorage.getItem('userName');

    //获得用户名

    var _userIdName = sessionStorage.getItem('realUserName');

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //获取arg
    //var _arg = sessionStorage.getItem("menuArg");

    //时间初始化
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language: 'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });

    //设置初始时间(主表格时间)
     var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');
    var _initEnd = moment().format('YYYY/MM/DD');

    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);

    //时间参数
    var slrealityStart = '';

    var slrealityEnd = '';

    //重发值
    var _gdCircle = 0;

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

    //存放常量
    var _stateArr = [];

    stateConstant(1);

    var _trend = '';

    //标识维修备件申请窗口是否是打开状态
    var _shenheModal = false;


    /*------------------------------表格初始化-----------------------------------------------*/

    //页面表格
    var table = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
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
                exportOptions: {
                    columns: [0, 1, 2, 4, 5, 6, 7]
                }
            }
        ],
        "dom": 't<"F"lip>',
        "columns": [
            {
                title: '工单号',
                data: 'gdCode2',
                className: 'gongdanId',
                render:function(data, type, row, meta){
                    return '<span class="gongdanId" gdCode="' + row.gdCode +
                        '"' + "gdCircle=" + row.gdCircle +
                        '></span><a href="productionOrder_see.html?gdCode=' +  row.gdCode +  '&userID=' + _userIdNum + '&userName=' + _userIdName + '&gdZht=' + row.gdZht + '&gdCircle=' + row.gdCircle +
                        '"' +
                        'target="_blank">' + data + '</a>'
                }
            },
            {
                title: '备件进度',
                data: 'clStatusID',
                render:function(data, type, full, meta){
                    for(var i=0;i<_stateArr.length;i++){
                        if(data == _stateArr[i].clStatusID){
                            return _stateArr[i].clStatus
                        }
                    }
                }
            },
            {
                title: '最新状态',
                data: 'clLastUptInfo'
            },
            {
                title: '督办人',
                data: 'clRenName'
            },
            {
                title: '时间',
                data: 'clDate'
            },
            {
                title: '操作',
                "targets": -1,
                "data": null,
                "className": 'noprint',
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                    "<span class='data-option option-beijian btn default btn-xs green-stripe'>维修备件管理</span>"
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
                title:'单位',
                data:'unitName'
            },
            {
                title:'库存',
                data:'kucun'
            }
        ]
    });
    /*------------------------------按钮点击功能----------------------------------------------*/
    //查询
    $('#selected').click(function(){
        conditionSelect();
    });

    //重置
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    });

    //表格中的操作
    $('#scrap-datatables')
        .on('click','.option-see',function(){

            //初始化
            detailInit();

            _gdCircle = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcircle');
            //图片区域隐藏
            $('.showImage').hide();
            //当前行变色
            var $this = $(this).parents('tr');

            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            moTaiKuang($('#myModal'),'查看详情','flag');
            //获取详情
            var gongDanState = parseInt($this.children('.ztz').html());
            var gongDanCode = $this.children('.gongdanId').children('span').attr('gdCode');
            //根据工单状态，确定按钮的名称
            _gdCode = gongDanCode;
            var prm = {
                'gdCode':gongDanCode,
                'gdZht':gongDanState,
                'userID':_userIdNum,
                'userName':_userIdName,
                'gdCircle':_gdCircle
            };
            //每次获取弹出框中执行人员的数量
            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDGetDetail',
                async:false,
                data:prm,
                beforeSend:function(){
                    $('#loading').show();
                },
                success:function(result){
                    if(result.gdJJ == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('#ones').parent('span').addClass('checked');
                    }else{
                        $('.inpus').parent('span').removeClass('checked');
                        $('#twos').parent('span').addClass('checked');
                    }
                    if (result.gdRange == 1) {
                        $('#myApp33').find('.whether').parent('span').removeClass('checked');
                        $('#myApp33').find('#four').parent('span').addClass('checked');
                    } else {
                        $('#myApp33').find('.whether').parent('span').removeClass('checked');
                        $('#myApp33').find('#three').parent('span').addClass('checked');
                    }
                    //绑定弹窗数据
                    app33.telephone = result.bxDianhua;
                    app33.person = result.bxRen;
                    app33.place = result.wxDidian;
                    app33.section = result.bxKeshi;
                    app33.matter = result.wxShiX;
                    app33.sections = result.wxKeshi;
                    app33.remarks = result.bxBeizhu;
                    app33.wxbeizhu = result.wxBeizhu;
                    app33.rwlx = result.gdLeixing;
                    app33.sbSelect = result.wxShebei;
                    app33.sbLX = result.dcName;
                    app33.sbMC = result.dName;
                    app33.sbBM = result.ddName;
                    app33.azAddress = result.installAddress;
                    _imgNum = result.hasImage;

                    app33.gdly = result.gdCodeSrc;
                    $('.otime').val(result.gdFsShij);
                    //查看执行人员
                    datasTable($("#personTable1"),result.wxRens);
                    //维修材料
                    datasTable($("#personTables1"),result.wxCls);
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            });
            //所有input不可操作
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true).addClass('disabled-block');

            //获取日志

            logInformation();
        })
        .on('click','.option-beijian',function(){

            //初始化
            bjInit();

            _shenheModal = true;

            $('.bjImg').hide();

            moTaiKuang($('#myModal4'),'维修备件申请');
            _gdCircle = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcircle');
            //图片区域隐藏
            $('.showImage').hide();
            //当前行变色
            var $this = $(this).parents('tr');

            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            //获取详情
            var gongDanState = parseInt($this.children('.ztz').html());
            var gongDanCode = $this.children('.gongdanId').children('span').attr('gdCode');
            //根据工单状态，确定按钮的名称
            _gdCode = gongDanCode;
            var prm = {
                'gdCode':gongDanCode,
                'gdZht':gongDanState,
                'userID':_userIdNum,
                'userName':_userIdName,
                'gdCircle':_gdCircle
            }
            //每次获取弹出框中执行人员的数量
            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDGetDetail',
                async:false,
                data:prm,
                success:function(result){
                    var bmArr = [];
                    //存放物料的数组
                    var wlArr = [];
                    for(var i=0;i<result.wxCls.length;i++){
                        wlArr.push(result.wxCls[i]);
                        bmArr.push(result.wxCls[i].wxCl);
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
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            });
            //获取日志

            logInformation();

            stateConstant('2');

            //备件走向
            determineTrend();

            $('#bjremark').val('');
        })

    $('#myModal4').on('click','.btn-primary:nth-child(1)',function(){
        applySparePart($(this),'flag');
    });

    $('#myModal4').on('click','.btn-primary:nth-child(2)',function(){
        applySparePart($(this));
    });

    //关闭审核窗口，标识置为false
    $('#myModal4').on('hidden.bs.modal',function(){

        _shenheModal = false;

    })

    $(document).on('keyup',function(e){

        if(_shenheModal){

            if(e.keyCode == '13'){

                applySparePart($(this),'flag',true);

            }

        }else{

            return false;

        }

    })

    /*------------------------------其他方法-------------------------------------------------*/
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
            gdCode:$('#gdcode').val(),
            st:slrealityStart,
            et:slrealityEnd,
            clStatusId:$('#line-point').val(),
            userID:_userIdNum,
            userName:_userIdName,
            clType:2
        };
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDGetPeijGD',
            data:prm,
            async:false,
            success:function(result){
                datasTable($("#scrap-datatables"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
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
                    $('#line-point').empty();
                    $('#line-point').append(str);
                }else if(flag == 2){
                    //备件管理中操作类型以及现在工单的备件状态码
                    var str ='';
                    for(var i=0;i<result.statuses.length;i++){
                        if(result.statuses[i].clType == 2){

                            str += '<button type="button" class="btn btn-primary classSH"' + 'data-value='+ result.statuses[i].clTo +
                                '>' + result.statuses[i].clOpt + '</button>'
                        }
                    }
                    str += '<button type="button" class="btn btn-default classSH" data-dismiss="modal">关闭</button>';

                    $('#myModal4').find('.modal-footer').empty().append(str);

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

    //获取日志信息（备件logType始终传2）
    function logInformation(){
        var gdLogQPrm = {
            "gdCode": _gdCode,
            "logType": 2,
            "userID": _userIdNum,
            "userName": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywDGGetLog',
            data:gdLogQPrm,
            success:function(result){
                var str = '';
                for(var i =0;i<result.length;i++){
                    str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' +  result[i].logContent + '</li>'
                }
                $('.deal-with-list').empty();
                $('.deal-with-list').append(str).show();
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //申请备件(同意【flag】，拒绝)
    function applySparePart(el,flag,keyup){

        if(keyup){

            el = $('#myModal4').find('.modal-footer').children();

        }

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

        console.log(prm);

        return false;

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptPeijStatus',
            data:prm,
            success:function(result){
                if( result == 99 ){
                    $('#myModal2').find('.modal-body').html('操作成功');
                    moTaiKuang($('#myModal2'),'提示','flag');
                    $('#myModal4').modal('hide');
                    conditionSelect();
                }else{
                    $('#myModal2').find('.modal-body').html('操作失败');
                    moTaiKuang($('#myModal2'),'提示','flag');
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

    //查看初始化
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
        //查看图片
        $('.showImage').hide();
        //表格
        var arr = [];
        //执行人
        _datasTable($('#personTable1'),arr);
        //备件
        _datasTable($('#personTables1'),arr);
        //处理记录
        $('.deal-with-list').empty();

    }

    //备件初始化
    function bjInit(){

        //备件表格
        var arr = [];
        _datasTable($('#personTables11'),arr);

        //当前状态
        $('#myModal4').find('.nowState').removeAttr('bjstate');

        $('#myModal4').find('.nowState').val('');

        //备注
        $('#myModal4').find('#bjremark').val('');

        //备件图片隐藏
        $('.bjImg').hide();

        //处理记录
        $('.deal-with-list').empty();

    }
})