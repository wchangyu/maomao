$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
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
            wxbeizhu:''
        },
        methods:{
            radios:function(){
                $('.inpus').click(function(a){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            }
        }
    })
    //记录工单状态的值
    var _gdState;
    //记录维修状态的值
    var _wxZhuangtai;
    //定位当前页索引值
    var currentPages = 0;
    var currentRow = '';
    var gdCode = '';
    /*--------------------------表格初始化-----------------------------------------*/
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
                title:'紧急',
                data:'gdJJ',
                render:function(data, type, full, meta){
                    if(data == 0){
                        return '否'
                    }if(data == 1){
                        return '是'
                    }
                }
            },
            {
                title:'工单状态',
                data:'gdZht',
                className:'gongdanZt',
                render:function(data, type, full, meta){
                    if(data == 1){
                        return '待受理'
                    }if(data == 2){
                        return '待接单'
                    }if(data == 3){
                        return '待执行'
                    }if(data == 4){
                        return '待完成'
                    }if(data == 5){
                        return '完工确认'
                    }if(data == 6){
                        return '待评价'
                    }if(data == 7){
                        return '结束'
                    }
                }
            },
            {
                title:'报修部门',
                data:'bxKeshi'
            },
            {
                title:'维修地点',
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
                "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>接单</span>"
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
    ];
    tableInit($('#personTable1'),col2);
    var col3 = [
        {
            title:'材料分析',
            data:'wxCl'
        },
        {
            title:'维修材料',
            data:'wxClName'
        },
        {
            title:'数量',
            data:'clShul'
        },
        {
            title:'使用人',
            data:' '
        }
    ];
    tableInit($('#personTables1'),col3);
    /*-----------------------------方法----------------------------------------*/
    //条件查询
    conditionSelect();
    //查询方法
    function conditionSelect(){
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        realityStart = filterInput[2] + ' 00:00:00';
        realityEnd = moment(filterInput[3]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var prm = {
            "gdCode":filterInput[0],
            "gdSt":realityStart,
            "gdEt":realityEnd,
            "bxKeshi":filterInput[1],
            "wxKeshi":filterInput[4],
            "gdZht":0,
            "gdZhts":[0],
            "userID":_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetZX',
            data:prm,
            async:false,
            success:function(result){
                datasTable($("#scrap-datatables"),result);
            }
        })
    }
    //接单功能
    function getGongDan(){
        var gdInfo = {
            'gdCode':gdCode,
            'gdZht':_gdState,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
            data:gdInfo,
            success:function(result){
                conditionSelect();
            }
        })
    }
    //完工功能
    function wanGong(){
        _wxZhuangtai = app33.wxbeizhu;
        var gdInfo = {
            'gdCode':gdCode,
            'gdZht':_gdState,
            'userID':_userIdName,
            'wxBeizhu':_wxZhuangtai
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGUptWang',
            data:gdInfo,
            success:function(result){
                conditionSelect();
            }
        })
    }
    /*------------------------按钮功能-----------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            $('#myModal2').find('.modal-body').html('起止时间不能为空');
            moTaiKuang($('#myModal2'));
        }else {
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                $('#myModal2').find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang($('#myModal2'));
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
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    })
    //弹窗切换表格效果
    $('.table-title span').click(function(){
        $('.table-title span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.tableHover').css({'z-index':0});
        $('.tableHover').css({'opacity':0});
        $('.tableHover').eq($(this).index()).css({
            'z-index':1,
            'opacity':1
        })
    });
    $('.confirm').click(function(){
        if($(this).html() == '完成'){
            wanGong();
            //提示已完成；
            $('#myModal2').find('.modal-body').html('工单已完成接单！');
            moTaiKuang($('#myModal2'));
        }else{
            getGongDan();
        }
        $(this).parents('.modal').modal('hide');
    })
    //关闭按钮
    /*----------------------------表格绑定事件-----------------------------------*/
    $('#scrap-datatables tbody')
        //查看详情
        .on('click','.option-edit',function(){
            //当前行变色
            var $this = $(this).parents('tr');
            currentTr = $this;
            currentFlat = true;
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            moTaiKuang($('#myModal'));
            //获得当前分页的页
            currentPages = parseInt($(this).parents('.table').next().next().children('span').children('.current').html())-1;
            currentRow = $(this).parents('tr').index();
            console.log();
            //获取详情
            var gongDanState = $this.children('.gongdanZt').html();
            var gongDanCode = $this.children('.gongdanId').html();
            //根据工单状态，确定按钮的名称
            if( gongDanState == '待接单' ){
                $('#myModal').find('.confirm').html('接单');
                gongDanState = 2;
                _gdState = gongDanState + 1;
            }else if( gongDanState == '待执行'){
                $('#myModal').find('.confirm').html('执行');
                gongDanState = 3;
                _gdState = gongDanState + 1;
            }else if( gongDanState == '待完成' ){
                $('#myModal').find('.confirm').html('完成');
                $('.wxbeizhu').attr('disabled',false);
                gongDanState = 4;
                _gdState = gongDanState + 1;
            }
            gdCode = gongDanCode;
            var prm = {
                'gdCode':gongDanCode,
                'gdZht':gongDanState,
                'userID':_userIdName
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
                    app33.telephone = result.bxDianhua;
                    app33.person = result.bxRen;
                    app33.place = result.wxDidian;
                    app33.section = result.bxKeshi;
                    app33.matter = result.wxShiX;
                    app33.sections = result.wxKeshi;
                    app33.remarks = result.bxBeizhu;
                    app33.bxbeizhu = result.bxBeizhu;
                    //查看执行人员
                    datasTable($("#personTable1"),result.wxRens);
                    //维修材料
                    datasTable($("#personTables1"),result.wxCls);
                }
            });
        });
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint');
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
    function tableInit(tableID,col){
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
            'columns':col
        })
    }
})