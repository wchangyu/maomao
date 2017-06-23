$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //存放执行人信息的数组
    var _zhixingRens = [];
    var _weiXiuCaiLiao = [];
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //设置初始时间
    var _initStart = moment().format('YYYY/MM/DD');
    var _initEnd = moment().format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    //实际发送时间
    var realityStart;
    var realityEnd;
    //工单号
    var gdCode = '';
    //通过vue对象实现双向绑定
    //查看详细信息的Vue形式
    var workDones = new Vue({
        el:'#workDones',
        data:{
            rwlx:'',
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
            remarks:'',
            weixiukeshis:''
        }
    })
    //自定义验证器
    //手机号码
    Vue.validator('telephones', function (val) {
        return /^[0-9]*$/.test(val)
    })
    //验证必填项（非空）
    Vue.validator('persons', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    })
    //登记信息绑定
    var app33 = new Vue({
        el:'#myApp33',
        data:{
            picked:'1',
            rwlx:'1',
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
            remarks:''

        },
        methods:{
            radios:function(){
                $('#myApp33').find('.inpus').click(function(a){
                    $('#myApp33').find('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            }
        }
    })
    //添加执行人信息绑定
    var zhiXingRen = new Vue({
        el:'#zhiXingRen',
        data:{
            zhixingren:'',
            gonghao:'',
            dianhua:'',
            rules: {
                minlength: 1,
                maxlength: 16
            }
        }
    });
    //状态
    $('.tableHover').eq(1).css({'opacity':0});
    //点击确定，自动填写物料编码和名称
    var _wlBM = '';
    var _wlMC = '';
    //添加物料信息
    var wuLiaoInfo = new Vue({
        el:'#weiXiuCaiLiao',
        data:{
            wpbm:'',
            wpmc:'',
            wpsl:''
        }
    })
    var _zhixingRenTable = $('#zhixingRenTable');
    //存储所有执行人的数组
    var _allZXRArr = [];
    //存储所有物料的数组
    var _allWLArr = [];
    //获取物料列表
    getWP();
    //获取执行人员列表
    getRY();
    /*-----------------------------表格初始化----------------------------------------*/
    //页面表格
    var table = $('#scrap-datatables').DataTable({
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
                className:'saveAs'
            },
        ],
        'columns':[
            {
                title:'工单号',
                data:'gdCode',
                className:'gongdanId'
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
                title:'车间站',
                data:'bxKeshi'
            },
            {
                title:'维修事项',
                data:'wxShiX'
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
                "data": null,
                "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>受理</span>"

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
                title:'工号',
                data:'wxRen',
                className:'wxRen'
            },
            {
                title:'执行人员',
                data:'wxRName',
                className:'wxRName'
            },
            {
                title:'联系电话',
                data:'wxRDh',
                className:'wxRDh'
            },
            {
                class:'deleted',
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='tableDeleted data-option btn default btn-xs green-stripe'>删除</span>"
            }
        ];
    tableInit($('#personTable1'),col2);
    //增加执行人员表格（第二层弹窗）
    var col3 = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'wxRen',
            className:'zxrnum'
        },
        {
            title:'执行人员',
            data:'wxRName',
            className:'zxrname'
        },
        {
            title:'联系电话',
            data:'wxRDh',
            className:'zxrphone'
        }
    ];
    tableInit(_zhixingRenTable,col3);
    //添加表头复选框
    var creatCheckBox = '<input type="checkbox">';
    $('thead').find('.checkeds').prepend(creatCheckBox);
    //材料表格
    var col4 = [
        {
            title:'物料编码',
            data:'wxCl',
            className:'wxCl'
        },
        {
            title:'物料名称',
            data:'wxClName',
            className:'wxClName'
        },
        {
            title:'数量',
            data:'clShul',
            className:'clShul'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='tableDeleted data-option btn default btn-xs green-stripe'>删除</span>"

        }
    ];
    tableInit($('#personTables1'),col4);
    //增加材料表格
    var col5 = [
        {
            title:'分类名称',
            data:'cateName'
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
        }
    ];
    tableInit($('#weiXiuCaiLiaoTable'),col5);
    //快速添加工单
    //执行人员表格
    var col6 = [
        {
            title:'工号',
            data:'wxrID',
            className:'wxrID'
        },
        {
            title:'执行人员',
            data:'wxRName',
            className:'wxRName'
        },
        {
            title:'联系电话',
            data:'wxRDh',
            className:'wxRDh'
        }
    ];
    tableInit($('#personTable2'),col6);
    /*-----------------------------页面加载时调用的方法------------------------------*/
    //条件查询
    conditionSelect();
    /*---------------------------------表格绑定事件-------------------------------------*/
    $('#scrap-datatables tbody')
        //受理操作
        .on('click','.option-edit',function(){
            //当前行变色
            var $this = $(this).parents('tr');
            currentTr = $this;
            currentFlat = true;
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            moTaiKuang($('#myModal'));
            //派工按钮显示
            $('.paigongButton').show();
            //维修部门只读,颜色改变
            $('#wxbm').attr('disabled',false).css({'background':'#ffffff'});
            $('#wxbm').parent('.input-blockeds').css({'background':'#ffffff'});
            $('#wxbm').parent('.input-blockeds').prev().addClass('colorTip').html('维修部门 *');
            //添加执行人员按钮显示
            $('.zhiXingRenYuanButton').show();
            //获取详情
            var gongDanState = $this.children('.gongdanZt').html();
            var gongDanCode = $this.children('.gongdanId').html();
            gdCode = gongDanCode;
            if( gongDanState == '待接单' ){
                $('.workDone .gongdanClose').find('.btn-success').html('接单');
                gongDanState = 2;
            }else if( gongDanState == '待执行'){
                $('.workDone .gongdanClose').find('.btn-success').html('执行');
                gongDanState = 3;
            }else if( gongDanState == '待完成' ){
                $('.workDone .gongdanClose').find('.btn-success').html('完成');
                gongDanState = 4
            }
            var prm = {
                'gdCode':gongDanCode,
                'gdZht':gongDanState,
                'userID':_userIdName
            }
            //每次获取弹出框中执行人员的数量
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDGetDetail',
                async:false,
                data:prm,
                success:function(result){
                    if(result.gdJJ == 1){
                        $('#workDones').find('.inpus').parent('span').removeClass('checked');
                        $('#workDones').find('#ones1').parent('span').addClass('checked');
                    }else{
                        $('#workDones').find('.inpus').parent('span').removeClass('checked');
                        $('#workDones').find('#twos1').parent('span').addClass('checked');
                    }
                    //绑定弹窗数据
                    workDones.rwlx = result.gdLeixing;
                    workDones.telephone = result.bxDianhua;
                    workDones.person = result.bxRen;
                    workDones.place = result.wxDidian;
                    workDones.section = result.bxKeshi;
                    workDones.matter = result.wxShiX;
                    workDones.sbSelect = result.wxShebei;
                    workDones.sbLX = result.dcName;
                    workDones.sbMC = result.dName;
                    workDones.sbBM = result.ddName;
                    workDones.azAddress = result.installAddress;
                    workDones.weixiukeshis = result.wxKeshi;
                    workDones.remarks = result.bxBeizhu;
                    //执行人、物料
                    _zhixingRens = result.wxRens;
                    _weiXiuCaiLiao = result.wxCls;
                    console.log(_zhixingRens);
                    //添加后的执行人员
                    if(_zhixingRens.length == 0){
                        var table = $("#personTable1").dataTable();
                        table.fnClearTable();
                    }else{
                        var table = $("#personTable1").dataTable();
                        table.fnClearTable();
                        table.fnAddData(_zhixingRens);
                        table.fnDraw();
                    }
                    //添加后的维修材料
                    datasTable($("#personTables1"),_weiXiuCaiLiao)
                }
            });
            //修改
            $('#workDones').find('input').attr('disabled',true).addClass('disabled-block');
            $('#workDones').find('select').attr('disabled',true).addClass('disabled-block');
            $('#workDones').find('textarea').attr('disabled',true).addClass('disabled-block');
            $('.weixiukeshis').attr('disabled',false).removeClass('disabled-block');
        })
    /*-------------------------------方法----------------------------------------*/
    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        realityStart = filterInput[2] + ' 00:00:00';
        realityEnd = moment(filterInput[3]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var prm = {
            'gdCode':filterInput[0],
            'gdSt':realityStart,
            'gdEt':realityEnd,
            'bxKeshi':filterInput[1],
            'wxKeshi':'',
            "gdZht": 2,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDJ',
            async:false,
            data:prm,
            success:function(result){
                datasTable($("#scrap-datatables"),result)
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
    /*----------------------------------按钮触发的事件-----------------------------*/
    //弹窗切换表格效果
    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tableContent = $this.parent('.table-title').next().children('.tableHover');
        tableContent.css({'z-index':0});
        tableContent.css({'opacity':0});
        tableContent.eq($(this).index()).css({
            'z-index':1,
            'opacity':1
        })
    });
    //查询按钮功能
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            $('#myModal4').find('.modal-body').html('起止时间不能为空');
            moTaiKuang($('#myModal4'));
        }else{
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                $('#myModal4').find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang($('#myModal4'));
            }else{
                conditionSelect();
            }
        }
    })
    //重置按钮功能
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.datatimeblock').eq(0).val(_initStart);
        $('.datatimeblock').eq(1).val(_initEnd);
    })
    /*//登记按钮
    $('.creatButton').click(function(){
        //所有登记页面的输入框清空
        //所有登记页面的输入框清空(radio的按钮默认为否)；
        app33.picked = 0;
        $('#myApp33').find('.inpus').parent('span').removeClass('checked');
        $('#myApp33').find('#twos').parent('span').addClass('checked');
        app33.rwlx = '1';
        app33.telephone = '';
        app33.person = '';
        app33.place = '';
        app33.matter = '';
        app33.remarks = '';
        app33.section = '';
        app33.sbSelect = '';
        app33.sbLX = '';
        app33.sbMC = '';
        app33.sbBM = '';
        app33.azAddress = '';
        moTaiKuang($('#myModal1'));
    })*/
    /*//快速登记按钮
    $('.quickCreat').click(function(){
        quickWork.picked = 1;
        $('#quickWork').find('.inpus').parent('span').removeClass('checked');
        $('#one1').parent('span').addClass('checked');
        quickWork.rwlx = 1;
        quickWork.telephone = '';
        quickWork.person = '';
        quickWork.place = '';
        quickWork.section = '';
        quickWork.matter = '';
        quickWork.weixiushebei = '';
        quickWork.weixiukeshis = '';
        quickWork.sbSelect = '';
        quickWork.sbLX = '';
        quickWork.sbMC = '';
        quickWork.sbBM = '';
        quickWork.azAddress = '';
        quickWork.beizhus = '';
        quickWork.weixiuBZ = '';
        moTaiKuang($('#myModal9'));
        //将执行人默认为本人
        var personObject = {};
        personObject.wxRName = _userIdName;
        personObject.wxrID = _userIdName;
        personObject.wxRDh = '';
        _zhixingRens = [];
        _zhixingRens.push(personObject);
        datasTable($('#personTable2'),_zhixingRens);
    })*/
    //登记弹框，点击确定，获得数据，向后台传参
    $('#createGongdan').find('.btn-success').click(function(){
        var gdInfo = {
            'gdJJ':app33.picked,
            'bxRen':app33.person,
            'bxDianhua':app33.telephone,
            'bxKeshi':app33.section,
            'wxDidian':app33.place,
            'wxShiX':app33.matter,
            'wxKeshi':app33.sections,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDCreDJ',
            data:gdInfo,
            success:function(result){
                var str = '<div class="alert alert-success" style="text-align: center;"> <button class="close" data-close="alert"></button><span>' + result
                '</span>';
                $('.gongdanContent').append(str);
                //5秒之后自动关闭
                setTimeout(function(){$(".gongdanContent .alert").hide();},2000);
                //刷新表格
                conditionSelect();
            }
        })
    })
    //点击派工，切换状态
    $('.paigongButton').click(function(){
        //如果维修科室没有添加的话，出现弹出框，无法实现派工
        if(workDones.weixiukeshis == ''){
            $('#myModal4').find('.modal-body').html('请填写维修班组！');
            moTaiKuang($('#myModal4'));
        }else if(_zhixingRens.length == 0){
            $('#myModal4').find('.modal-body').html('请选择执行人员！');
            moTaiKuang($('#myModal4'));
        }else{
            //执行人删除
            //Worker('YWGD/ywGDDelWxR','flag');
            //执行人添加
            Worker('YWGD/ywGDAddWxR');
            //材料删除
            CaiLiao('YWGD/ywGDDelWxCl','flag');
            //材料添加
            CaiLiao('YWGD/ywGDAddWxCl');
            var gdInfo = {
                'gdCode':gdCode,
                'gdZht':2,
                'wxKeshi':workDones.weixiukeshis,
                'userID':_userIdName
            }
            $.ajax({
                url:_urls + 'YWGD/ywGDUptPaig',
                type:'post',
                data:gdInfo,
                success:function(result){
                    if(result == 99){
                        $('#myModal1').modal('hide');
                        $('#myModal').modal('hide');
                        $('#myModal4').find('.modal-body').html('派工成功！');
                        moTaiKuang($('#myModal4'));
                        //conditionSelect();
                        upData()
                    }

                }
            })
        }
    })
    //登记确认按钮
    /*$('.dengji').click(function(){
        if(app33.person == '' || app33.place == '' || app33.matter == ''){
            var myModal = $('#myModal2');
            myModal.find('.modal-body').html('请填写红色必填项');
            moTaiKuang(myModal);
        }else{
            var gdInfo = {
                'gdJJ':app33.picked,
                'bxRen':app33.person,
                'bxDianhua':app33.telephone,
                'bxKeshi':app33.section,
                'wxDidian':app33.place,
                'wxShiX':app33.matter,
                'wxKeshi':'',
                'bxBeizhu':app33.remarks,
                'userID':_userIdName,
                'gdLeixing':app33.rwlx,
                'dName':app33.sbMC,
                'gdSrc':2,
                'ddName':app33.sbBM,
                'wxShebei':app33.sbSelect,
                'dcName':app33.sbLX,
                'installAddress':app33.azAddress
            }
            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDCreDJ',
                data:gdInfo,
                success:function(result){
                    if(result == 99){
                        var myModal = $('#myModal4');
                        myModal.find('.modal-body').html('添加成功!');
                        moTaiKuang(myModal)
                    }
                    //刷新表格
                    conditionSelect();
                }
            })
        }
    });*/
    /*$('.quickDengji').click(function(){
        if(quickWork.person == '' || quickWork.place == '' || quickWork.matter == '' || quickWork.weixiukeshis == ''){
            var myModal = $('#myModal2');
            myModal.find('.modal-body').html('请填写红色必填项');
            moTaiKuang(myModal);
        }else{
            var weixiuRen = [
                {
                    wxRen:_userIdName,
                    wxRName:_userIdName,
                    wxRDh:''
                }
            ];
            var gdInfo = {
                'gdJJ':quickWork.picked,
                'bxRen':quickWork.person,
                'bxDianhua':quickWork.telephone,
                'bxKeshi':quickWork.section,
                'wxDidian':quickWork.place,
                'wxShiX':quickWork.matter,
                'wxKeshi':quickWork.weixiukeshis,
                'bxBeizhu':quickWork.beizhus,
                'userID':_userIdName,
                'gdLeixing':quickWork.rwlx,
                'dName':quickWork.sbMC,
                'gdSrc':2,
                'ddName':quickWork.sbBM,
                'wxShebei':quickWork.sbSelect,
                'dcName':quickWork.sbLX,
                'installAddress':quickWork.azAddress,
                'gdWxRs':weixiuRen
            }
            console.log(gdInfo);
            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDCreQuickDJ',
                data:gdInfo,
                success:function(result){
                    if(result == 99){
                        $('#myModal4').modal('hide');
                        var myModal = $('#myModal4');
                        myModal.find('.modal-body').html('添加成功!');
                        moTaiKuang(myModal);
                    }
                    //刷新表格
                    conditionSelect();
                }
            })
        }
    })*/
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
    /*----------------------------------添加执行人员功能-----------------------------------*/
    //点击选择执行人员按钮
    $('.zhiXingRenYuanButton').click(function(){
        moTaiKuang($('#myModal7'));
        getRY();
        var fn1 = function( row, data, index ) {
            for(var i=0;i<_zhixingRens.length;i++){
                if(data.wxRen == _zhixingRens[i].wxRen){
                    $('td:eq(0)', row).parents('tr').addClass('tables-hover');
                    $('td:eq(0)', row).addClass(' checkeds');
                    $('td:eq(0)', row).html( '<div class="checker"><span class="checked"><input type="checkbox"></span></div> ' );
                }
            }

        }
        tableInit(_zhixingRenTable,col3,fn1);
    })
    //点击工号选择执行人员
    $('#zxNumSelect').click(function(){
        moTaiKuang($('#myModal7'));
        getRY();
    })
    //复选框点击事件
    _zhixingRenTable.find('tbody').on( 'click', 'input', function () {
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            $(this).parents('tr').addClass('tables-hover');
            //如果所有复选框打钩，那么表头的复选框自动打钩；
            var rowNum = $(this).parents('.table').find('tbody').find('.checkeds').length;
            var selectNum =  $(this).parents('.table').find('tbody').find('.checked').length;
            if( rowNum == selectNum){
                $(this).parents('.table').find('thead').find('.checkeds').find('span').addClass('checked');
            }
        }else{
            $(this).parent($('span')).removeClass('checked');
            //$(this).parents('tr').css({'background':'#ffffff'});
            $(this).parents('tr').removeClass('tables-hover');
            //只要有一个复选框没选中，全选框不打勾，
            $(this).parents('.table').find('thead').find('.checkeds').find('span').removeClass('checked');
        }
    });
    //点击thead复选框tbody的复选框全选中
    _zhixingRenTable.find('thead').find('input').click(function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            _zhixingRenTable.find('tbody').find('input').parents('.checker').children('span').addClass('checked');
            _zhixingRenTable.find('tbody').find('tr').addClass('tables-hover');
        }else{
            _zhixingRenTable.find('tbody').find('input').parents('.checker').children('span').removeClass('checked');
            _zhixingRenTable.find('tbody').find('tr').removeClass('tables-hover')
        }
    });
    //选择执行人员的确定按钮
    $('.addZXR').click(function (){
        var zxrList = _zhixingRenTable.children('tbody').find('.checked');
        for(var i=0;i<_allZXRArr.length;i++){
            for(var j=0;j<zxrList.length;j++){
                var bianma = zxrList.eq(j).parents('tr').children('.zxrnum').html();
                if( _allZXRArr[i].wxRen == bianma ){
                    if(_zhixingRens.length == 0){
                        _zhixingRens.push(_allZXRArr[i]);
                    }else{
                        var isExist = false;
                        for(var z=0;z<_zhixingRens.length;z++){
                            if(_zhixingRens[z].wxRen == _allZXRArr[i].wxRen){
                                isExist = true;
                                break;
                            }
                        }
                        if(isExist){

                        }else{
                            _zhixingRens.push(_allZXRArr[i]);
                        }
                    }
                }
            }
        }
        datasTable($('#personTable1'),_zhixingRens);
    })
    //选择执行人员删除按钮
    $('#personTable1 tbody').on('click','.tableDeleted',function(){
        var $thisBM = $(this).parents('tr').children('.wxRen').html();
        for(var i=0;i<_zhixingRens.length;i++){
            if(_zhixingRens[i].wxRen == $thisBM){
                $('.zxrGH').val(_zhixingRens[i].wxRen);
                $('.zxrXM').val(_zhixingRens[i].wxRName);
                $('.zxrDH').val(_zhixingRens[i].wxRDh);
            }
        }
        moTaiKuang($('#myModal8'));
    });
    //删除确定按钮
    $('.removeWorkerButton').click(function(){
        var $thisBM = $('.zxrGH').val();
        _zhixingRens.removeByValue($thisBM,'wxRen');
        datasTable($('#personTable1'),_zhixingRens);
    });
    /*$('.tianJiaPerson').click(function(){
        //添加之前先判断一下非空了没
        if(zhiXingRen.zhixingren == '' || zhiXingRen.gonghao == '' || zhiXingRen.dianhua == ''){
            $('#myModal4').find('.modal-body').html('请填写红色必填项');
            moTaiKuang($('#myModal4'));
        }else{
            var objects = {};
            objects.wxRName = zhiXingRen.zhixingren;
            objects.wxRen = zhiXingRen.gonghao;
            objects.wxRDh = zhiXingRen.dianhua;
            //避免录入的信息重复，做个判断
            if(_zhixingRens.length == 0){
                _zhixingRens.push(objects);
                var table = $("#zhiXingPerson").dataTable();
                table.fnClearTable();
                table.fnAddData(_zhixingRens);
                table.fnDraw();
            }else{
                var isExist = false;
                for(var i=0;i<_zhixingRens.length;i++){
                    if(_zhixingRens[i].wxRen == objects.wxRen){
                        isExist = true;
                        break;
                    }
                }
                if(isExist){
                    $('.exists').show();
                }else{
                    $('.exists').hide();
                    _zhixingRens.push(objects);
                    var table = $("#zhiXingPerson").dataTable();
                    table.fnClearTable();
                    table.fnAddData(_zhixingRens);
                    table.fnDraw();
                }
            }
        }
    });*/
    //点击第二层弹窗的确定，给第一个弹窗的表格赋值
    /*$('.secondButton').click(function(){
        console.log(_zhixingRens);
        //传回给第一个弹框的表格
        //输上谁就是谁
        if(_zhixingRens.length == 0){
            var table = $("#personTable1").dataTable();
            table.fnClearTable();
            $('.paigongButton').attr('disabled',true);
            $('.paiGongTip').show();
        }else{
            var table = $("#personTable1").dataTable();
            table.fnClearTable();
            table.fnAddData(_zhixingRens);
            table.fnDraw();
            $('.paigongButton').attr('disabled',false);
            $('.paiGongTip').hide();
        }
        addWorker();
        removeWork();
        $('#myModal2').modal('hide');
    });*/
    //给执行人员的表格添加删除事件
    /*$('#zhiXingPerson tbody').on('click','tr',function(){
        var e = event || window.event;
        if(e.target.className.toLowerCase() == 'tabledeleted'){
            //首先获得点击的执行人的工号，然后删除了数组，然后再返回给前一个弹出框
            //首先获得点击行的tr
            //获得点击行的工号的td
            var deleteValue = $(this).children('td').eq(1).html();
            //遍历数组，删除工号匹配的对象
            for(var i=0;i<_zhixingRens.length;i++){
                if(_zhixingRens[i].wxRen == deleteValue){
                    _zhixingRens.splice(i,1);
                    if(_zhixingRens.length == 0){
                        _zhixingRens = [];
                        var table = $("#zhiXingPerson").dataTable();
                        table.fnClearTable();
                    }else{
                        var table = $("#zhiXingPerson").dataTable();
                        table.fnClearTable();
                        table.fnAddData(_zhixingRens);
                        table.fnDraw();
                    }
                    //重构表格的值

                }
            }
        }
    });
    function addWorker(){
        gdCode = currentTr.children('td').eq(0).html();
        var gdRen = [];
        for(var i=0;i<_zhixingRens.length;i++){
            var object = {};
            object.wxrID = 0;
            object.wxRen = _zhixingRens[i].wxRen;
            object.wxRName = _zhixingRens[i].wxRName;
            object.wxRDh = _zhixingRens[i].wxRDh;
            object.gdCode = gdCode;
            gdRen.push(object);
        }
        var gdWR = {
            "gdCode":gdCode,
            "gdWxRs":gdRen,
            "userID":_userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDAddWxR',
            data:gdWR,
            success:function(result){
                //刷新条件查询
                conditionSelect();
            }
        })
    }
    function removeWork() {
        var gdCode = currentTr.children('td').eq(0).html();
        var gdRen = [];
        for (var i = 0; i < _zhixingRens.length; i++) {
            var object = {};
            object.wxrID = 0;
            object.wxRen = _zhixingRens[i].wxRen;
            object.wxRName = _zhixingRens[i].wxRName;
            object.wxRDh = _zhixingRens[i].wxRDh;
            object.gdCode = gdCode;
            gdRen.push(object);
        }
        var gdWR = {
            "gdCode": gdCode,
            "gdWxRs": gdRen,
            "userID": _userIdName
        };
        $.ajax({
            type: 'post',
            url:_urls + 'YWGD/ywGDDelWxR',
            data: gdWR,
            success: function (result) {
                //刷新条件查询
                conditionSelect();
            }
        })
    }*/
    /*----------------------------------添加材料功能材料----------------------------------------*/
    //点击选择材料按钮
    $('.tianJiaCaiLiao').click(function(){
        moTaiKuang($('#myModal3'));
        //初始化
        wuLiaoInfo.wpbm = '';
        wuLiaoInfo.wpmc = '';
        wuLiaoInfo.wpsl = '';
        $('.exists').hide();
    })

    //物料列表条件查询
    $('.tianJiaSelect').click(function(){
        getWP();
    })

    //选择物料信息
    $('.wpbm').click(function(){
        moTaiKuang($('#myModal5'));
        //标识已选的物品（改变背景色）
        getWP();
        var fn1 = function( row, data, index ) {
            for(var i=0;i<_weiXiuCaiLiao.length;i++){
                if(data.itemNum == _weiXiuCaiLiao[i].wxCl){
                    console.log($('td:eq(0)', row).parents('tr'));
                    $('td:eq(0)', row).parents('tr').addClass('pink');
                }
            }

        }
        tableInit($('#weiXiuCaiLiaoTable'),col5,fn1);
    })

    //点击第二层弹窗的确定，给第一个弹窗的表格赋值
    $('.secondButtons').click(function(){
        //获取填写的信息
        var obj = {};
        obj.wxClID = 0,
        obj.wxCl = wuLiaoInfo.wpbm,
        obj.wxClName = wuLiaoInfo.wpmc,
        obj.clShul = wuLiaoInfo.wpsl
        //判断是否是重复的
        if(_weiXiuCaiLiao.length == 0){
            _weiXiuCaiLiao.push(obj);
            $('#myModal3').modal('hide');
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
                $('#myModal3').modal('hide');
                //传回给第一个弹框的表格
                datasTable($("#personTables1"),_weiXiuCaiLiao);
            }
        }
    });

    $('#weiXiuCaiLiaoTable tbody').on('click','tr',function(){
        var $this = $(this);
        var tableTr = $this.parents('.table').find('tr');
        tableTr.css('background','#ffffff');
        $this.css('background','#FBEC88');
        _wlBM = $this.children('.wlbm').html();
        _wlMC = $this.children('.wlmc').html();
    });

    //点击确定选择的物料编码和名称
    $('.addWL').click(function(){
        wuLiaoInfo.wpbm = _wlBM;
        wuLiaoInfo.wpmc = _wlMC;
    })
    //材料表格删除按钮
    $('#personTables1 tbody').on('click','.tableDeleted',function(){
        var $this = $(this).parents('tr');
        moTaiKuang($('#myModal6'));
        $('.wpbms').val($this.children('.wxCl').html());
        $('.wpmcs').val($this.children('.wxClName').html());
        $('.flmcs').val($this.children('.clShul').html());
    });
    $('#myModal6').on('click','.removeButton',function(){
            _weiXiuCaiLiao.removeByValue($('.wpbms').val(),"wxCl");
            datasTable($('#personTables1'),_weiXiuCaiLiao);
    })
    /*function addCaiLiao(){
        var cailiaoInfo = [];
        for(var i=0;i<_weiXiuCaiLiao.length;i++){
            var object = {};
            object.wxClID = 0;
            object.wxCl = _weiXiuCaiLiao[i].wxCl;
            object.wxClName = _weiXiuCaiLiao[i].clShul;
            object.clShul = _weiXiuCaiLiao[i].clShul;
            object.gdCode = gdCode;
            cailiaoInfo.push(object);
        }
        var gdWxCl = {
            "gdCode":gdCode,
            "gdWxCls":cailiaoInfo,
            "userID":_userIdName
        }
        $.ajax({
            url:_urls + 'YWGD/ywGDAddWxCl',
            type:'post',
            data:gdWxCl,
            success:function(result){
                conditionSelect();
            }
        })
    }
    function removeCaiLiao(){
        var cailiaoInfo = [];
        for(var i=0;i<_weiXiuCaiLiao.length;i++){
            var object = {};
            object.wxClID = 0;
            object.wxCl = _weiXiuCaiLiao[i].wxCl;
            object.wxClName = _weiXiuCaiLiao[i].wxClName;
            object.clShul = 0;
            object.gdCode = gdCode;
            cailiaoInfo.push(object);
        }
        var gdWC = {
            "gdCode":gdCode,
            "gdWxCls":cailiaoInfo,
            "userID":_userIdName
        }
        $.ajax({
            url:_urls + 'YWGD/ywGDDelWxCl',
            type:'post',
            data:gdWC,
            success:function(result){
                conditionSelect();
            }
        })
    }*/
    /*-----------------------------------------模态框位置自适应------------------------------------------*/
    //模态框自适应
    function moTaiKuang(who){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
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
    //表格初始化方法
    function tableInit(tableID,col,fun){
        tableID.DataTable({
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
    //获取所有物料
    function getWP(){
         var prm = {
             itemNum : $.trim($('#wpbms').val()),
             itemName: $.trim($('#wpmcs').val()),
             cateName: $.trim($('#flmcs').val()),
             userID:_userIdName
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
             error:function(){

             }
         })
     }
    //获取所有执行人员
    function getRY(){
        var prm = {
            'zxName':'',
            'zxNum':'',
            'zxPhone':''
        }
        $.ajax({
            type:'post',
            url:'../resource/data/worker.json',
            success:function(result){
                _allZXRArr =[];
                for(var i=0;i<result.data.length;i++){
                    _allZXRArr.push(result.data[i]);
                }
                datasTable($('#zhixingRenTable'),result.data)
            },
            error:function(){

            }
        })
    }
    //执行人添加删除
    function Worker(url,flag){
        var workerArr = [];
        for(var i=0; i<_zhixingRens.length;i++){
            var obj = {};
            if(flag){
                obj.wxClID = _zhixingRens[i].wxrID;
            }
            obj.wxRen = _zhixingRens[i].wxRen;
            obj.wxRName = _zhixingRens[i].wxRName;
            obj.wxRDh = _zhixingRens[i].wxRDh;
            obj.gdCode = gdCode;
            workerArr.push(obj);
        }
        var gdWR = {
            gdCode :gdCode,
            gdWxRs:workerArr,
            userID:_userIdName
        }
        console.log(gdWR);
        $.ajax({
            type:'post',
            url:_urls + url,
            data:gdWR,
            async:false,
            success:function(result){
                console.log(result);
                conditionSelect();
            }
        });
    }
    //材料添加删除
    function CaiLiao(url,flag){
        var cailiaoArr = [];
        for(var i=0;i<_weiXiuCaiLiao.length;i++){
            var obj = {};
            if(flag){
                obj.wxClID = _weiXiuCaiLiao[i].wxClID
            }
            console.log(_weiXiuCaiLiao[i].wxClID)
            obj.wxCl = _weiXiuCaiLiao[i].wxCl;
            obj.wxClName = _weiXiuCaiLiao[i].wxClName;
            obj.clShul = _weiXiuCaiLiao[i].clShul;
            obj.gdCode = gdCode;
            cailiaoArr.push(obj);
        }
        var gdWxCl = {
            gdCode:gdCode,
            gdWxCls:cailiaoArr,
            userID:_userIdName
        }
        console.log(gdWxCl)
        $.ajax({
            type:'post',
            url:_urls + url,
            data:gdWxCl,
            success:function(result){
                console.log(result);
                conditionSelect();
            }
        })
    }
    function upData(){
        var gdInfo = {
            gdCode :gdCode,
            gdZht : 3,
            wxKeshi:'',
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
            data:gdInfo,
            success:function(result){
                console.log(result);
                conditionSelect();
            }
        })
    }
})