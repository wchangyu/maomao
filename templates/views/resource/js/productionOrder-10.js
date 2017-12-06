$(function(){
    /*-------------------------------全局变量-------------------------------------------------*/
    //获得用户ID
    var _userIdNum = sessionStorage.getItem('userName');

    //获得用户名

    var _userIdName = sessionStorage.getItem('realUserName');

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

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

    //选择设备时间
    var _initStartSB = '';
    var _initEndSB = '';

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

    //添加物料信息
    var wuLiaoInfo = new Vue({
        el:'#weiXiuCaiLiao',
        data:{
            wpbm:'',
            wpmc:'',
            wpsl:'',
            wpsize:'',
            flmc:''
        }
    });

    //记录当前工单号
    var _gdCode = '';

    //存放常量
    var _stateArr = [];

    stateConstant(1);

    //所有物料列表
    var _allWLArr = [];

    //记录备件选择的表格选中的对象
    var _BJobj = {};

    //已选择的物品编码
    var _selectWLArr = [];

    //记录读出的已存在的物品编码
    var _existenceArr = [];

    //当前选中的备件编码
    var _BJnum = '';

    //记录修改备件是否完成
    var _bjIsComplete = false;

    //修改备件是否完成
    var _bjIsSuccess = false;

    //备件申请是否完成
    var _applyIsComplete = false;

    //备件申请是否成功
    var _applyIsSuccess = false;

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

                    console.log(row);

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
                title: '备注',
                data: 'clLastUptInfo'
            },
            {
                title:'最新状态',
                data:'lastUpdateInfo'
            },
            {
                title:'车站',
                data:'bxKeshi'
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
    var personTable1Col = [
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

    _tableInit($('#personTable1'),personTable1Col,2,'','','');

    //维修配件表格初始化
    var personTables1Col = [
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
        }
    ];

    _tableInit($('#personTables1'),personTables1Col,2,'','','');

    //维修管理
    var personTables11Col = [
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
        //{
        //    title:'库存',
        //    data:'kucun'
        //},
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='tableDeleted data-option btn default btn-xs green-stripe'>删除</span>"
        }
    ];

    _tableInit($('#personTables11'),personTables11Col,2,'','','');

    //备件选择
    var weiXiuCaiLiaoTableCol = [
        {
            title:'分类名称',
            data:'cateName',
            className:'flmc'
        },
        {
            title:'物料编码',
            data:'itemNum',
            className:'wlbm'
        },
        {
            title:'物料名称',
            data:'itemName',
            className:'wlmc'
        },
        {
            title:'型号',
            data:'size',
            className:'size'
        }
    ];

    _tableInit($('#weiXiuCaiLiaoTable'),weiXiuCaiLiaoTableCol,2,'','','');

    //获取所有备件
    getWP();

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
            _gdCircle = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcircle');
            //图片区域隐藏
            $('.showImage').hide();
            //当前行变色
            var $this = $(this).parents('tr');

            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            _moTaiKuang($('#myModal'),'查看详情','flag','','','');

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

            _moTaiKuang($('#myModal4'),'维修备件申请','','','','确定');

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
                data:prm,
                beforeSend:function(){
                    $('#loading').show();
                },
                success:function(result){
                    var bmArr = [];
                    //存放物料的数组
                    var wlArr = [];
                    //存放物料的数组(全局)

                    _selectWLArr.length = 0;

                    for(var i=0;i<result.wxCls.length;i++){

                        _selectWLArr.push(result.wxCls[i]);

                        _existenceArr.push(result.wxCls[i]);

                    }

                    for(var i=0;i<result.wxCls.length;i++){
                        wlArr.push(result.wxCls[i]);
                        bmArr.push(result.wxCls[i].wxCl);
                    }
                    //备件图片
                    if(result.hasBjImage>0){
                        var str = '<img class="bjImgList" src="' + replaceIP(_urlImg,_urls) + '?gdcode=' + _gdCode + '&no=1&imageFlag=1' +
                            '">';
                        $('.bjImg').empty().append(str).show();
                        $('.bjpicture').show();
                    }else{
                        $('.bjpicture').hide();
                    }

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

            $('#bjremark').val('');
        })

    $('#myModal4').on('click','.btn-primary',function(){
        if( $('#stateConstant').val() == '' ){

            _moTaiKuang($('#myModal2'),'提示','false','istap','请选择操作类型!','');

        }else{

            //首先判断物品修改过没有
            //首先判断已选择的备件长度
            if(_existenceArr.length == _selectWLArr.length){

                //记录是否完全相等
                var isEqual = true;

                //判断备件信息是或否一致(通过比较四个方面)
                for(var i=0;i<_existenceArr.length;i++){

                    var exist = _existenceArr[i];

                    for(var j=0;j<_selectWLArr.length;j++){

                        var select = _selectWLArr[j];

                        if(exist.wxCl != select.wxCl || exist.wxClName != select.wxClName || exist.cateName != select.cateName || exist.size != select.size || exist.clShul != select.clShul){

                            isEqual = false;

                            break;

                        }

                    }

                }

                if(isEqual){

                    //只调用申请备件接口
                    applySparePart();

                }else{

                    //修改材料和申请备件都调用
                    CaiLiao('YWGD/ywGDAddWxCl');

                    applySparePart();
                }


            }else{

                //修改材料和申请备件都调用
                CaiLiao('YWGD/ywGDAddWxCl');

                applySparePart();

            }

        }
    })

    //查看图片
    $('.bjImg').on('click','.viewIMG',function(){

        //模态框显示
        moTaiKuang($('#myModal5'), '图片详情', 'flag');

        var imgSrc = $(this).attr('src');

        $('#myModal5').find('img').attr('src', imgSrc);

    })

    //添加维修备件
    $('#myModal4').find('.tianJiaCaiLiao').click(function(){

        //模态框
        _moTaiKuang($('#addWXCL-modal'),'添加维修备件','','','','确定');

        //初始化
        //物品编码
        wuLiaoInfo.wpbm = '';
        //物品名称
        wuLiaoInfo.wpmc = '';
        //物品型号
        wuLiaoInfo.wpsize = '';
        //物品分类
        wuLiaoInfo.flmc = '';
        //物品数量
        wuLiaoInfo.wpsl = '';

    })

    //选择物品
    $('.select-goods').click(function(){

        //模态框
        _moTaiKuang($('#WXCL-list-modal'), '添加维修备件', '', '' ,'', '确定');

        //初始化
        $('#myModal6').find('input').val(' ');

        datasTable($('#weiXiuCaiLiaoTable'),_allWLArr);

        //初始化
        _BJobj = {};

    })

    //选择物品表格的点击事件
    $('#weiXiuCaiLiaoTable tbody').on('click','tr',function(){

        //样式
        $('#weiXiuCaiLiaoTable tbody').find('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

        //暂存选中的值
        //分类名称
        _BJobj.flmc = $(this).children('.flmc').html();

        //物品编码
        _BJobj.wlbm = $(this).children('.wlbm').html();

        //物品名称
        _BJobj.wlmc = $(this).children('.wlmc').html();

        //物品型号
        _BJobj.size = $(this).children('.size').html();
    })

    //选择物品确定按钮(第三层)
    $('#WXCL-list-modal').find('.addWL').click(function(){

        //填写已选中的备件信息
        //物品编码
        wuLiaoInfo.wpbm = _BJobj.wlbm;
        //物品名称
        wuLiaoInfo.wpmc = _BJobj.wlmc;
        //规格型号
        wuLiaoInfo.wpsize = _BJobj.size;
        //物品分类
        wuLiaoInfo.flmc = _BJobj.flmc;

        //关闭模态框
        $('#WXCL-list-modal').modal('hide');

    })

    //选择备件（第二层）
    $('#addWXCL-modal').find('.secondButtons').click(function(){

        //验证
        if( wuLiaoInfo.wpbm == '' || wuLiaoInfo.wpmc == '' || wuLiaoInfo.wpsl == ''  ){

            _moTaiKuang($('#myModal2'),'提示','flag','istap','请填写红色必填项！','');

        }else{

            var obj = {};
            //物品编码
            obj.wxCl = wuLiaoInfo.wpbm;
            //物品名称
            obj.wxClName = wuLiaoInfo.wpmc;
            //规格型号
            obj.size = wuLiaoInfo.wpsize;
            //数量
            obj.clShul = wuLiaoInfo.wpsl;
            //分类名称
            obj.cateName = wuLiaoInfo.flmc;

            _selectWLArr.push(obj);

            //模态框消失
            $('#addWXCL-modal').modal('hide');

            datasTable($('#personTables11'),_selectWLArr);

        }

    })

    //备件表格删除按钮
    $('#personTables11 tbody').on('click','.tableDeleted',function(){

        var children = $(this).parents('tr').children('td');

        var str =  '物品编码：' + children.eq(0).html() +','+ '物品名称：' + children.eq(1).html();

        _BJnum = children.eq(0).html();

        //模态框
        _moTaiKuang($('#myModal2'),'确定要删除该物品吗？','','istap',str,'删除');

        //添加删除类
        $('#myModal2').find('.btn-primary').addClass('shanchu');

    })

    //删除选中的备件
    $('#myModal2').on('click','.shanchu',function(){

        //删除选中的备件
        _selectWLArr.removeByValue(_BJnum,'wxCl');

        //模态框关闭
        $('#myModal2').modal('hide');

        //表格赋值
        datasTable($('#personTables11'),_selectWLArr);

        $(this).removeClass('shanchu');

    })

    //获取所有物品
    function getWP(){
        var prm = {
            itemNum : $.trim($('#wpbms').val()),
            itemName: $.trim($('#wpmcs').val()),
            cateName: $.trim($('#flmcs').val()),
            userID:_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            data:prm,
            success:function(result){
                _allWLArr = [];
                for(var i=0;i<result.length;i++){
                    _allWLArr.push(result[i]);
                }
                datasTable($('#weiXiuCaiLiaoTable'),result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

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
            clType:3
        };
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDGetPeijGD',
            data:prm,
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
                        if(result.statuses[i].clType == 3){
                            str += '<option value="' + result.statuses[i].clStatusID +
                                '">' + result.statuses[i].clStatus + '</option>';
                        }
                    }
                    $('#line-point').empty();
                    $('#line-point').append(str);
                }else if(flag == 2){
                    //备件管理中操作类型以及现在工单的备件状态码
                    var str ='<option value="">请选择</option>';
                    var values = '';
                    for(var i=0;i<result.statuses.length;i++){
                        if(result.statuses[i].clType == 3){
                            if(result.statuses[i].clTo == ''){
                                values = result.statuses[i].clStatusID;
                            }else{
                                values = result.statuses[i].clTo;
                            }
                            str += '<option value="' + values +
                                '">' + result.statuses[i].clOpt + '</option>';
                        }
                    }
                    $('#stateConstant').empty();
                    $('#stateConstant').append(str);
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

    //申请备件
    function applySparePart(){

        var prm = {
            "gdCode": _gdCode,
            "clStatusId": $('#stateConstant').val(),
            "clStatus": $('#stateConstant').children('option:selected').html(),
            "clLastUptInfo": $('#bjremark').val(),
            "userID": _userIdNum,
            "userName": _userIdName
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptPeijStatus',
            data:prm,
            success:function(result){

                _applyIsComplete = true;

                if( result == 99 ){

                    _applyIsSuccess = 'true';

                }else{

                    _applyIsSuccess = 'false';

                }

                //结果
                BJResult();
            },
            error:function(jqXHR, textStatus, errorThrown){

                _applyIsComplete = true;

                console.log(jqXHR.responseText);
            }
        })

    }

    //备件物品修改接口
    function CaiLiao(url){

        var cailiaoArr = [];

        for(var i=0;i<_selectWLArr.length;i++){
            var obj = {};
            obj.wxCl = _selectWLArr[i].wxCl;
            obj.wxClName = _selectWLArr[i].wxClName;
            obj.clShul = _selectWLArr[i].clShul;
            obj.gdCode = _gdCode;
            cailiaoArr.push(obj);
        }
        var gdWxCl = {
            gdCode:_gdCode,
            gdWxCls:cailiaoArr,
            userID:_userIdNum,
            userName:_userIdName,
            gdCircle:_gdCircle
        }

        $.ajax({
            type:'post',
            url:_urls + url,
            data:gdWxCl,
            success:function(result){

                _bjIsComplete = true;

                if(result == 99){

                    _bjIsSuccess = 'true';

                }else{

                    _bjIsSuccess = 'false';

                }

                //执行结果
                BJResult();

            },
            error:function(jqXHR, textStatus, errorThrown){

                _bjIsComplete = true;

                console.log(jqXHR.responseText);
            }
        })
    }

    //备件申请和修改执行结果
    function BJResult(){

        if(_bjIsComplete && _applyIsComplete){

            var str = '';

            if(_bjIsSuccess == 'true'){

                str += '备件修改成功！'

            }else if(_bjIsSuccess == 'false'){

                str += '备件修改失败！'

            }else if( _bjIsSuccess == '' ){

                str += ''

            }
            if(_applyIsSuccess == 'true'){

                str += '备件申请成功！'

            }else if( _applyIsSuccess == 'false'){

                str += '备件申请失败！'

            }else if( _applyIsSuccess == '' ){

                str += ''

            }

            _moTaiKuang($('#myModal2'),'提示','flag','istap',str,'');

            if( _applyIsSuccess == 'true' && _bjIsSuccess == 'true' ){

                conditionSelect();

                $('#myModal4').modal('hide');

            }else if( _applyIsSuccess == 'true' && _bjIsSuccess == '' ){

                conditionSelect();

                $('#myModal4').modal('hide');

            }

        }


    }

    function _moTaiKuang(who, title, flag, istap ,meg, buttonName) {
        who.modal({
            show: false,
            backdrop: 'static'
        })
        who.find('.modal-title').html(title);
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight) / 2;
        who.find('.modal-dialog').css({'margin-top': markBlockTop});
        if (flag) {
            who.find('.btn-primary').hide();
        } else {
            who.find('.btn-primary').show();
            who.find('.modal-footer').children('.btn-primary').html(buttonName);
        }
        if(istap){
            who.find('.modal-body').html(meg);
        }
    }

    function _tableInit(tableId,col,buttons,flag,fnRowCallback,drawCallback){
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
        ////是否可搜索
        //var search = false;
        //if(searching){
        //    search = true;
        //}
        var _tables = tableId.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": true,   //是否分页
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
                'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                'infoEmpty': '没有数据',
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

    //数组删除指定元素的值
    Array.prototype.removeByValue = function(val,attr) {
        for(var i=0; i<this.length; i++) {
            if(this[i][attr] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
})