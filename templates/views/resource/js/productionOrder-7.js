$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdNum = sessionStorage.getItem('userName');
    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //图片ip
    var _urlImg = 'http://211.100.28.180/ApService/dimg.aspx';
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',
        forceParse: 0
    });
    //设置初始时间
     var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');
    var _initEnd = moment().format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    //实际发送时间
    var realityStart;
    var realityEnd;
    //弹出框信息绑定vue对象
    var app33 = new Vue({
        el:'#myApp33',
        data:{
            picked:0,
            rwlx:4,
            telephone:'',
            person:'',
            place:'',
            section:'',
            matter:'',
            sbSelect:'',
            sbLX:'',
            sbMC:'',
            sbBM:'',
            azAddress:'',
            sections:'',
            remarks:'',
            whether:'0',
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
    //定位当前页索引值
    var currentPages = 0;
    var currentRow = '';
    //当前那工单号
    var gdCode = '';
    //当前工单状态
    var _gdState = '';
    //当前维修班组
    var _wxOffice = '';
    //记录当前工单详情有几个图
    var _imgNum = 0;
    //执行人员的数组
    var _zhixingRens = [];
    //记录维修内容的标识
    var _wxRemarkFlag = false;
    //记录状态
    var _stateFlag = false;
    //维修内容变量
    var _wxContent = '';
    //重发值
    var _gdCircle = 0;
    //所有维修材料的数组
    var _allWLArr = [];
    //存放已选择的维修材料的数据
    var _weiXiuCaiLiao = [];
    //点击确定，自动填写物料编码和名称
    var _wlBM = '';
    var _wlMC = '';
    //删除物品的时候的编码
    var _deleteBM = '';
    //记录当前备件状态
    var _sparePart = 0;
    //记录申请备件是否成功
    var _sparePartFlag = false;
    //添加材料是否成功
    var _pjFlag = false;
    //点击详情的时候，记录原有的备件数组
    var _primaryBJ = [];
    //原因分类
    classificationReasons();
    //备件操作状态
    var _bjStateWillNum = '';
    //备件操作名称
    var _bjStateWillName = '';
    //选择备件对象
    var _bjObject = {};
    //状态转换是否完成
    var _ztComplete = false;
    //维修科室
    var _wxIsComplete  = false;
    //材料请求是否完成
    var _clIsComplete = false;
    //备件申请是否完成
    var _bjIsComplete = false;
    //存放所有维保组的数组
    var _InfluencingArr = [];
    //维修班组数组
    var _bzArr = [];
    //标识在维保组中
    var _isWBZ = false;
    //标识在维修班组中
    var _isBZ = false;
    /*--------------------------表格初始化-----------------------------------------*/
    //页面表格
    var table = $('#scrap-datatables').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'sSearch':'查询',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'t<"F"lip>',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs',
                exportOptions:{
                    columns:[0,1,2,4,5,6]
                }
            },
        ],
        'columns':[
            {
                title:'工单号',
                data:'gdCode2',
                className:'gongdanId',
                render:function(data, type, row, meta){
                    return '<span gdCode="' +  row.gdCode +
                        '"' + "gdCircle=" + row.gdCircle +
                        '>' +  data +
                        '</span>'
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
                title:'工单状态值',
                data:'gdZht',
                className:"ztz"
            },
            {
                title:'车站',
                data:'bxKeshi'
            },
            {
                title:'故障位置',
                data:'wxDidian'
            },
            {
                title:'登记时间',
                data:'gdShij'
            },
            {
                title:'操作',
                "targets": -1,
                "data": 'gdZht',
                "className":'noprint',
                render:function(data, type, full, meta){
                    if(data == 1){
                        return "<span class='data-option option-edit btn default btn-xs green-stripe'>待下发</span>"
                    }if(data == 2){
                        return "<span class='data-option option-edit btn default btn-xs green-stripe'>待分派</span>"
                    }if(data == 3){
                        return "<span class='data-option option-edit btn default btn-xs green-stripe'>接单</span>"
                    }if(data == 4){
                        return "<span class='data-option option-edit btn default btn-xs green-stripe'>执行中</span>"
                    }if(data == 5){
                        return "<span class='data-option option-edit btn default btn-xs green-stripe'>等待资源</span>"
                    }if(data == 6){
                        return "<span class='data-option option-edit btn default btn-xs green-stripe'>待关单</span>"
                    }if(data == 7){
                        return "<span class='data-option option-edit btn default btn-xs green-stripe'>任务关闭</span>"
                    }
                }
            }
        ]
    });
    //自定义按钮位置
    table.buttons().container().appendTo($('.excelButton'),table.table().container());
    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }
    //执行人员表格
    var col2 = [
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
            data:'userNum'
        },
        {
            title:'工号',
            data:'userName'
        },
        {
            title:'联系电话',
            data:'mobile'
        }
    ];
    tableInit($('#personTable1'),col2);
    var col3 = [
        {
            title:'备件编码',
            data:'wxCl',
            className:'wpbm'
        },
        {
            title:'备件名称',
            data:'wxClName'
        },
        {
            title:'分类',
            data:'cateName',
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
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='tableDeleted data-option btn default btn-xs green-stripe'>删除</span>"
        }
    ];
    tableInit($('#personTables1'),col3);
    /*-----------------------------方法----------------------------------------*/
    //条件查询
    InfluencingUnit();
    //查询方法
    function conditionSelect(){  //3.4.5状态
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        realityStart = filterInput[2] + ' 00:00:00';
        realityEnd = moment(filterInput[3]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var prm = {
            "gdCode2":filterInput[0],
            "gdSt":realityStart,
            "gdEt":realityEnd,
            "bxKeshi":filterInput[1],
            "gdZht":3,
            "gdZhts":[0],
            "userID":_userIdNum,
            "userName":_userIdName
        };
        var wbzArr = [];
        if($('#wxbz').val()){
            prm.wxKeshi = $('#wxbz').val();
        }else{
            if(_isWBZ){
                for(var i=0;i<_bzArr.length;i++){
                    wbzArr.push(_bzArr[i].departNum);
                }
                prm.wxKeshis = wbzArr;
            }else if(_isBZ){
                prm.wxKeshi = _bzArr[0].departNum;
            }
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetZX',
            data:prm,
            success:function(result){
                datasTable($("#scrap-datatables"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    /*------------------------按钮功能-----------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'起止时间不能为空', '');
        }else {
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'起止时间不能大于结束时间', '');
            }else{
                conditionSelect();
            }
        }
    });

    //重置按钮功能
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    });

    $('#myModal')
        //操作
        .on('click','.execute',function(){
            //判断状态值是否为空
            if($('#option-select').val() == ''){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择操作类型！', '');

            }else{

                //先判断现在的状态是否可执行操作方法
                var currentZTZ = $('.current-state').attr('ztz');
                var currentOption = $('#option-select').val();
                //判断当前状态和执行任务状态
                if(  currentZTZ == currentOption ){
                    //只发送维修备注请求
                    wxRmark(1);
                }else{
                    //状态转换+维修内容
                    wxRmark(2);
                    getGongDan(2);
                }

            }

        })
        //查看图片
        .on('click','#viewImage',function(){
            if(_imgNum){
                var str = '';
                for(var i=0;i<_imgNum;i++){
                    str += '<img class="viewIMG" src="' +
                        replaceIP(_urlImg,_urls) + '?gdcode=' + gdCode + '&no=' + i +
                        '">'
                }
                $('.showImage').html('');
                $('.showImage').append(str);
                $('.showImage').show();
            }else{
                $('.showImage').html('没有图片');
                $('.showImage').show();
            }
        })
        //图片详情
        .on('click','.viewIMG',function(){
            _moTaiKuang($('#myModal3'),'图片详情','flag', '' ,'', '');
            var imgSrc = $(this).attr('src')
            $('#myModal3').find('img').attr('src',imgSrc);
        })

   $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });

    //选择执行状态事件
    $('#option-select').change(function(){
        //等待资源的时间
        //$('.waitingForResources').find('input').val(_initStart);
        $('.waitingForResources').hide();
        $('#newBeiZhu').attr('disabled',false);
        if( $('.current-state').attr('ztz') == 3 && $('#option-select').val() != 4){
            $('.errorTips').html('当前状态下请先选择执行任务操作！');
            $('.waitingForResources').hide();
            $('#newBeiZhu').attr('disabled',false);
        }else{
            $('.errorTips').html('');
            //当选中等待资源时，预计完成时间和信息显示，最新进展为不可操作
            if($('#option-select').val() == 5){
                $('.waitingForResources').show();
                $('#newBeiZhu').attr('disabled',true);
            }
        }
    });

    //进展确定按钮
    $('.progressAdd').click(function(){
        var wxArr = _wxContent.split(' ');//["一站台东侧显示屏黑屏↵一站台东侧显示屏黑屏↵一站台东侧显示屏黑屏"]
        var str = wxArr[0];
        if( $('#wxbeizhu').val() == '' ){
            str += $('#newBeiZhu').val();
        }else{
            if( str.substring(str.length - 1, str.length) == '\n' ){
                str += $('#newBeiZhu').val();
            }else{
                str = str + '\n';
                str += $('#newBeiZhu').val();
            }
        }
        //将字符串显示到维修内容区域
        $('#wxbeizhu').val(str);
    });

    //撤销
    $('.progressDel').click(function(){
        //还原成原来的字符串
        $('#wxbeizhu').val(_wxContent);
    });

    //维修材料按钮
    $('.option-wxcl').click(function(){
        //获取配件状态常量
        stateConstant();
        //获取处理过程
        logInformation();
        $('.deal-with-list').empty();
        //获取detail
        var prm = {
            'gdCode':gdCode,
            'gdZht':_gdState,
            'userID':_userIdNum,
            'userName':_userIdName,
            'gdCircle':_gdCircle
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:prm,
            success:function(result){
                datasTable($('#personTables1'),result.wxCls);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    });

    //增加维修材料
    $('.tianJiaCaiLiao').click(function(){
        //弹出框显示
        _moTaiKuang($('#myModal5'), '添加维修备件', '', '' ,'', '确定');
        //初始化
        wuLiaoInfo.wpbm = '';
        wuLiaoInfo.wpmc = '';
        wuLiaoInfo.wpsl = '';
        $('.exists').hide();
    });

    //选择物品
    $('.select-goods').click(function(){
        //弹出框显示
        _moTaiKuang($('#myModal6'), '添加维修备件', '', '' ,'', '确定');
        //获取数据
        getWP();
        var fn1 = function( row, data, index ) {
            for(var i=0;i<_weiXiuCaiLiao.length;i++){
                if(data.itemNum == _weiXiuCaiLiao[i].wxCl){
                    $('td:eq(0)', row).parents('tr').addClass('pink');
                }
            }

        }
        var col5 = [
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
        tableInit($('#weiXiuCaiLiaoTable'),col5,fn1);
    });

    //选择物品表格点击事件
    $('#weiXiuCaiLiaoTable tbody').on('click','tr',function(){
        var $this = $(this);
        var tableTr = $this.parents('.table').find('tr');
        tableTr.css('background','#ffffff');
        $this.css('background','#FBEC88');
        _bjObject.flmc = $this.children('.flmc').html();
        _bjObject.wpbm = $this.children('.wlbm').html();
        _bjObject.wpmc = $this.children('.wlmc').html();
        _bjObject.size = $this.children('.size').html();
    });

    //点击确定选择的物料编码和名称
    $('.addWL').click(function(){
        wuLiaoInfo.flmc = _bjObject.flmc;
        wuLiaoInfo.wpmc = _bjObject.wpmc;
        wuLiaoInfo.wpsize = _bjObject.size;
        wuLiaoInfo.wpbm = _bjObject.wpbm;
    })

    //选择维修材料
    $('.secondButtons').click(function(){
        //验证
        if(wuLiaoInfo.wpbm == '' || wuLiaoInfo.wpmc == '' || wuLiaoInfo.wpsl == ''){
            _moTaiKuang($('#myModal2'), '提示', 'flag', '' ,'请填写红色必填项', '');
        }else{
            //获取填写的信息
            var obj = {};
            obj.wxClID = 0;
            obj.wxCl = wuLiaoInfo.wpbm;
            obj.wxClName = wuLiaoInfo.wpmc;
            obj.clShul = wuLiaoInfo.wpsl;
            obj.cateName = wuLiaoInfo.flmc;
            obj.size = wuLiaoInfo.wpsize;
            //判断是否是重复的
            if(_weiXiuCaiLiao.length == 0){
                _weiXiuCaiLiao.push(obj);
                $('#myModal5').modal('hide');
                datasTable($("#personTables1"),_weiXiuCaiLiao);
            }else{
                var flag = false;
                for(var i=0;i<_weiXiuCaiLiao.length;i++){
                    if(_weiXiuCaiLiao[i].wxCl == obj.wxCl){
                        flag = true;
                        break;
                    }
                }
                if(flag){
                    $('.exists').show();
                }else{
                    $('.exists').hide();
                    _weiXiuCaiLiao.push(obj);
                    $('#myModal5').modal('hide');
                    //传回给第一个弹框的表格
                    datasTable($("#personTables1"),_weiXiuCaiLiao);
                }
            }
        }
    });

    //按条件查询维修材料
    $('.tianJiaSelect').click(function(){
        getWP();
    })

    //材料表格删除按钮
    $('#personTables1 tbody').on('click','.tableDeleted',function(){
        var $this = $(this).parents('tr');
        _moTaiKuang($('#myModal2'), '提示', '', 'istap' ,'确定要删除吗？', '删除');
        $('#myModal2').find('.btn-primary').addClass('removeButton');
        $('.wpbms').val($this.children('.wxCl').html());
        $('.wpmcs').val($this.children('.wxClName').html());
        $('.flmcs').val($this.children('.clShul').html());
        _deleteBM = $(this).parents('tr').children('.wpbm').html();
    });

    $('#myModal2').on('click','.removeButton',function(){
        _weiXiuCaiLiao.removeByValue(_deleteBM,"wxCl");
        datasTable($('#personTables1'),_weiXiuCaiLiao);
        $('#myModal2').find('.btn-primary').removeClass('removeButton');
    })
    /*----------------------------表格绑定事件-----------------------------------*/
    $('#scrap-datatables tbody')
        //查看详情
        .on('click','.option-edit',function(){
            _gdCircle = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcircle');
            $('.showImage').hide();
            //当前行变色
            var $this = $(this).parents('tr');
            currentTr = $this;
            currentFlat = true;
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            _moTaiKuang($('#myModal'),'工单详情', '', '' ,'', '保存');
            //获得当前分页的页
            currentPages = parseInt($(this).parents('.table').next().next().children('span').children('.current').html())-1;
            currentRow = $(this).parents('tr').index();

            //所有input框为不可操作
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true);
            //获取详情
            var gongDanState = parseInt($this.children('.ztz').html());
            var gongDanCode = $this.children('.gongdanId').children('span').attr('gdCode');
            _gdState = gongDanState;
            gdCode = gongDanCode;
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
                    //绑定弹窗数据
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
                    app33.telephone = result.bxDianhua;
                    app33.person = result.bxRen;
                    app33.place = result.wxDidian;
                    app33.section = result.bxKeshi;
                    app33.matter = result.wxShiX;
                    app33.sections = result.wxKeshi;
                    app33.remarks = result.bxBeizhu;
                    app33.rwlx = result.gdLeixing;
                    app33.sbSelect = result.wxShebei;
                    app33.sbLX = result.dcName;
                    app33.sbMC = result.dName;
                    app33.sbBM = result.ddName;
                    app33.azAddress = result.installAddress;
                    _imgNum = result.hasImage;
                    $('.otime').val(result.gdFsShij);
                    //查看执行人员
                    _zhixingRens = [];
                    for(var i=0;i<result.wxRens.length;i++){
                        var obj = {};
                        obj.userName = result.wxRens[i].wxRName;
                        obj.userNum = result.wxRens[i].wxRen;
                        obj.mobile = result.wxRens[i].wxRDh;
                        _zhixingRens.push(obj);
                    }
                    datasTable($("#personTable1"),_zhixingRens);
                    //维修材料
                    datasTable($("#personTables1"),result.wxCls);
                    _weiXiuCaiLiao = [];
                    _primaryBJ = [];
                    for(var i=0;i<result.wxCls.length;i++){
                        _weiXiuCaiLiao.push(result.wxCls[i]);
                        _primaryBJ.push(result.wxCls[i]);
                    }
                    //通过判断状态，哪些隐藏，哪些显示
                    //操作类型改为请选择
                    $('#option-select').val('');
                    //给当前状态赋值
                    var currentState = '';
                    if(result.gdZht == 3){
                        currentState = '待执行';
                    }else if(result.gdZht == 4){
                        currentState = '执行中';
                    }else if(result.gdZht == 5){
                        currentState = '等待资源';
                    }else if(result.gdZht == 6){
                        currentState = '待关单';
                    }
                    $('.waitingForResources').hide();
                    $('.current-state').val(currentState);
                    $('.current-state').attr('ztz',result.gdZht);
                    if(result.gdZht == 3){
                        stateOption('flag');
                    }else{
                        stateOption();
                    }
                    //维修科室
                    _wxOffice = result.wxKeshi;
                    //维修内容
                    $('#wxbeizhu').val(result.wxBeizhu);
                    _wxContent = result.wxBeizhu;
                    //最新进展
                    $('#newBeiZhu').val('');
                    app33.gdly = result.gdCodeSrc;
                    //获取当前备件状态
                    //_sparePart = result.clStatus;
                    //预计完成时间(如果有时间的话，读出来，没有时间的话。默认今天)
                    if(result.yjShij){
                        $('.yjshijian').val(result.yjShij.split(' ')[0]);
                    }else{
                        $('.yjshijian').val(_initEnd);
                    }
                    //等待资源信息
                    $('.waitingForResources').find('textarea').val(result.dengMemo);
                    //等待原因
                    $('#watting').val(result.dengyy);
                    //如果是等待资源状态的话，需要显示
                    if(result.gdZht == 5){
                        $('.waitingForResources').show();
                    }else{
                        $('.waitingForResources').hide();
                    }

                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            });
        });

    //申请备件
    $('#myModal4')
        .on('click','.apply',function(){
        //首先判断原有网页中的_weiXiuCaiLiao和备注有没有改变。

        if(_primaryBJ.length != _weiXiuCaiLiao.length){
            //不一样
            //添加
            CaiLiao('YWGD/ywGDAddWxCl');
            //申请备件
            applySparePart();
        }else{
            if( objectInArr(_primaryBJ,_weiXiuCaiLiao) == false){
                //不一样
                //添加
                CaiLiao('YWGD/ywGDAddWxCl');
                //申请备件
                applySparePart();
            }else{
                //一样
                $('#myModal4').modal('hide');
            }
        }

    })
        .on('click','.receipt',function(){
            //确认收货
            var prm = {
                "gdCode": gdCode,
                "clStatusId": 999,
                "clStatus": '备件到达',
                "clLastUptInfo": $('#bjremark').val(),
                "userID": _userIdNum,
                "userName": _userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDUptPeijStatus',
                data:prm,
                timeout:30000,
                success:function(result){
                    if(result == 99){
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'确认收货成功！', '');
                        $('#myModal4').hide();
                    }else{
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'确认收货失败！', '');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        })
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint');
    /*-----------------------------------------模态框位置自适应------------------------------------------*/
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
    //表格初始化方法
    function tableInit(tableID,col,fun){
        tableID.DataTable({
            'autoWidth': false,  //用来启用或禁用自动列的宽度计算
            'paging': true,   //是否分页
            'destroy': true,//还原初始化了的datatable
            'searching': true,
            'ordering': false,
            "iDisplayLength":50,//默认每页显示的条数
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                'infoEmpty': '没有数据',
                'sSearch':'查询',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            "dom":'t<"F"lip>',
            'buttons': [
                {
                    extend: 'excelHtml5',
                    text: '保存为excel格式',
                },
            ],
            'columns':col,
            'rowCallback': fun
        })
    }
    //修改维修备注方法
    function wxRmark(flag){
        var dengyy = '';
        if($('#watting').val() == ''){
            dengyy = ''
        }else{
            $('#watting').val();
        }
        var dengyyStr = '';
        if($('#watting').children('option:selected').html() == '请选择'){
            dengyyStr = ''
        }else{
            dengyyStr = $('#watting').children('option:selected').html();
        }
        var gdInfo = {
            "gdCode": gdCode,
            "gdZht": $('#option-select').val(),
            "wxKeshi": _wxOffice,
            "wxBeizhu": $('#wxbeizhu').val(),
            "userID": _userIdNum,
            "userName":_userIdName,
            "lastUpdateInfo":$('#newBeiZhu').val(),
            'dengyy':dengyy,
            'dengyyStr':dengyyStr
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDUptWxBeizhu',
            data:gdInfo,
            async:false,
            success:function(result){
                _wxIsComplete = true;
                if(result == 99){
                    _wxRemarkFlag = true;
                }else{
                    _wxRemarkFlag = false;
                }
                if(flag == 1){
                    if(result == 99){
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'维修内容修改成功！', '');

                        $('#myModal').modal('hide');

                    }else{
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'维修内容修改失败！', '');

                    }
                }else if(flag == 2){
                    workComplete();
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    };
    //转化状态
    function getGongDan(flag){
        var gdInfo;
        if($('#option-select').val() == 5){

            gdInfo = {
                'gdCode':gdCode,
                'gdZht':$('#option-select').val(),
                'userID':_userIdNum,
                'userName':_userIdName,
                'dengMemo':$('.waitingForResources').find('textarea').val(),
                'yjShij':$('.waitingForResources').find('input').val(),
                'dengyy':$('#watting').val(),
                'dengyyStr':$('#watting').children('option:selected').html()
            }
        }else{
            gdInfo = {
                'gdCode':gdCode,
                'gdZht':$('#option-select').val(),
                'userID':_userIdNum,
                'userName':_userIdName
            }
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
            data:gdInfo,
            async:false,
            success:function(result){
                _ztComplete = true;
                if(result == 99){
                    _stateFlag = true;
                }else{
                    _stateFlag = false;
                }
                if(flag == 2){
                    workComplete();
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    };
    //IP替换
    function replaceIP(str,str1){
        var ip = /http:\/\/\S+?\//;  /*http:\/\/\S+?\/转义*/
        var res = ip.exec(str1);  /*211.100.28.180*/
        str = str.replace(ip,res);
        return str;
    }
    //获取所有物料
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
    //数组删除指定元素的值
    Array.prototype.removeByValue = function(val,attr) {
        for(var i=0; i<this.length; i++) {
            if(this[i][attr] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
    //数组删除指定索引
    Array.prototype.remove=function(obj){
        for(var i =0;i <this.length;i++){
            var temp = this[i];
            if(!isNaN(obj)){
                temp=i;
            }
            if(temp == obj){
                for(var j = i;j <this.length;j++){
                    this[j]=this[j+1];
                }
                this.length = this.length-1;
            }
        }
    }
    //材料添加删除
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
            obj.gdCode = gdCode;
            obj.size = _weiXiuCaiLiao[i].size;
            cailiaoArr.push(obj);
        }
        var gdWxCl = {
            gdCode:gdCode,
            gdWxCls:cailiaoArr,
            userID:_userIdNum,
            userName:_userIdName,
            gdCircle:_gdCircle
        }
        $.ajax({
            type:'post',
            url:_urls + url,
            data:gdWxCl,
            async:false,
            success:function(result){
                _clIsComplete = true;
                if(result == 99){
                    _pjFlag = true;
                    $('#myModal4').modal('hide');
                }else{
                    _pjFlag = false;
                }
                clbjComplete();
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //获取日志信息（备件logType始终传2）
    function logInformation(){
        var gdLogQPrm = {
            "gdCode": gdCode,
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
                    str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '</li>'
                }
                $('.deal-with-list').append(str).show();
                //备注
                $('#bjremark').val()
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //申请备件
    function applySparePart(){
        var arr = [];
        var sarr = [];
        for(var i=0;i<_weiXiuCaiLiao.length;i++){
            arr.push(_weiXiuCaiLiao[i].wxClName);
            sarr.push(_weiXiuCaiLiao[i].clShul);
        }
        var prm = {
            "gdCode": gdCode,
            "clStatusId": _bjStateWillNum,
            "clStatus": _bjStateWillName,
            "clLastUptInfo": $('#bjremark').val(),
            "userID": _userIdNum,
            "userName": _userIdName,
            "wxClNames":arr,
            "wxClShuls":sarr
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptPeijStatus',
            data:prm,
            success:function(result){
                _bjIsComplete = true;
                if( result == 99 ){
                    _sparePartFlag = true;
                }else{
                    _sparePartFlag = false;
                }
                clbjComplete();
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
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
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].reasonNum + '">' + result[i].reasonDesc + '</option>';
                }
                $('#watting').append(str);
            }
        })
    }
    //判断两个对象是否相同
    function isEqual(obj1,obj2){
        for(var name in obj1){
            if(obj1[name]!==obj2[name]) return false;
        }
        for(var name in obj2){
            if(obj1[name]!==obj2[name]) return false;
        }
        return true;
    }
    //数组中的对象比较
    function objectInArr(arr1,arr2){
        for(var i=0;i<arr1.length;i++){
            for(var j=0;j<arr2.length;j++){
                if( isEqual(arr1[i],arr2[j]) ){
                    return true;
                }else{
                    return false;
                }
            }
        }
    }
    //获取备件状态
    function stateConstant(){
        var prm = {
            "gdCode":gdCode,
            "userID": _userIdNum,
            "userName": _userIdName,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetPjStatus',
            data:prm,
            success:function(result){
                _sparePart = result.clStatus;
                _bjStateWillNum = 10;
                _bjStateWillName = '待确认';
                //先根据当前的状态判断是否显示确定按钮和增加维修备件按钮，还有备注是否可以编辑
                //弹出框显示
                //先把clTo999的显示的备件状态显示出来，
                var bjState = [];
                for(var i=0;i<result.statuses.length;i++){
                    if(result.statuses[i].clTo == 999){
                        bjState.push(result.statuses[i].clStatusID);
                    }
                }
                if(_sparePart == bjState[0] || _sparePart == bjState[1]){
                    //确认收货
                    _moTaiKuang($('#myModal4'),'维修备件申请','', '' ,'', '确认收货');
                    $('.tianJiaCaiLiao').hide();
                    $('.tableDeleted').attr('disabled',true);
                    $('#bjremark').attr('disabled',true);
                    //修改类名
                    $('#myModal4').find('.btn-primary').removeClass('apply').addClass('receipt');
                }else{
                    if(_sparePart>result.statuses[1].clStatusID){
                        _moTaiKuang($('#myModal4'),'维修备件申请','flag', '' ,'', '');
                        $('.tianJiaCaiLiao').hide();
                        $('.tableDeleted').attr('disabled',true);
                        $('#bjremark').attr('disabled',true);
                    }else{
                        _moTaiKuang($('#myModal4'),'维修备件申请','', '' ,'', '申请备件');
                        $('.tianJiaCaiLiao').show();
                        $('.tableDeleted').attr('disabled',false);
                        $('#bjremark').attr('disabled',false);
                        //修改类名
                        $('#myModal4').find('.btn-primary').removeClass('receipt').addClass('apply');
                    }
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //操作状态选择(flag：当前状态为3的时候)
    function stateOption(flag){
        var arr = [{name:'请选择',num:''},{name:'执行任务',num:'4'},{name:'等待资源',num:'5'},{name:'完成任务',num:'6'}];
        var str = '';
        if(flag){
            str = '';
            str += '<option value="4">执行任务</option>'
        }else{
            str = '';
            for(var i=0;i<arr.length;i++){
                str +='<option value="' + arr[i].num + '">' + arr[i].name +'</option>';
            }
        }
        $('#option-select').empty();
        $('#option-select').append(str);
    }
    //执行
    function workComplete(){
        if(_wxIsComplete && _ztComplete){
            //根据标识提示
            if( _wxRemarkFlag && _stateFlag ){
                _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'操作成功！', '');
                $('#myModal').modal('hide');
            }else{
                var str = '';
                if( _wxRemarkFlag == false ){
                    str += '维修内容修改失败，'
                }else{
                    str += '维修内容修改成功，'
                }
                if( _stateFlag == false ){
                    str += '操作失败，'
                }else{
                    str += '操作成功，'
                }
                _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,str, '');
            }
            conditionSelect();
        }
    }
    //材料和备件申请是否执行完成
    function clbjComplete(){
        if(_clIsComplete && _bjIsComplete){
            if(_pjFlag && _sparePartFlag ){
                _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'操作成功！', '');
                conditionSelect();
                $('#myModal4').modal('hide');
            }else{
                if( _pjFlag && !_sparePartFlag ){
                    _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'备件修改成功，备件操作失败！', '');
                }else if( !_pjFlag && _sparePartFlag ){
                    _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'备件修改失败，备件操作成功！', '');
                }else{
                    _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'操作失败！', '');
                }
            }
        }
    }
    //获取到影响单位、用户分类
    function InfluencingUnit(){
        var prm = {
            "userID": _userIdNum,
            "userName": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetWxBanzuStation',
            data:prm,
            success:function(result){
                _InfluencingArr.length = 0;
                _bzArr.length = 0;
                var str  = '<option value="">请选择</option>';
                //判断session中的变量是在维保组还是在维修班组中，
                for(var i=0;i<result.stations.length;i++){
                    if(_maintenanceTeam == result.stations[i].departNum){
                        _isWBZ = true;
                        _InfluencingArr.push(result.stations[i]);
                        for(var j=0;j<result.stations[i].wxBanzus.length;j++){
                            _bzArr.push(result.stations[i].wxBanzus[j]);
                            str += '<option value="' + result.stations[i].wxBanzus[j].departNum +
                                '">' + result.stations[i].wxBanzus[j].departName + '</option>'
                        }
                        $('#wxbz').empty().append(str);
                    }
                }
                for(var i=0;i<result.wxBanzus.length;i++){
                    if(_maintenanceTeam == result.wxBanzus[i].departNum){
                        _isBZ = true;
                        _bzArr.push(result.wxBanzus[i]);
                        for(var j=0;j<result.wxBanzus[i].length;j++){
                            str += '<option value="' + result.stations[i].wxBanzus[j].departNum +
                                '">' + result.stations[i].wxBanzus[j].departName + '</option>'
                        }
                        $('#wxbz').empty().append(str);
                    }else{
                        str += '<option value="' + result.wxBanzus[i].departNum +
                            '">' + result.wxBanzus[i].departName + '</option>'
                        $('#wxbz').empty().append(str);
                    }
                }
                //按条件加载
                conditionSelect();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }
})