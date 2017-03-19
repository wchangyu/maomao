$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //设置初始时间
    var _initStart = moment().format('YYYY/MM/DD');
    var _initEnd = moment().add(1,'day').format('YYYY/MM/DD');
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
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
    });
    /*--------------------------表格初始化---------------------------------------*/
    //页面表格
    var table = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'saveAs'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
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
                title:'评价',
                data:'pingJia'
            },
            {
                title:'评价人',
                data:'pjRen'
            },
            {
                title:'登记时间',
                data:'gdShij'
            }
        ]
    });
    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }
    //执行人员表格
    $('#personTable1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
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
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'执行人员',
                data:'wxRName'
            },
            {
                title:'科室',
                data:'wxKeshi'
            },
            {
                title:'联系电话',
                data:'wxRDh'
            }
        ]
    });
    $('#personTables1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
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
        "dom":'B<"clear">lfrtip',
        "columns": [
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
        ]
    });
    /*-----------------------------方法----------------------------------------*/
    //条件查询
    conditionSelect();
    function conditionSelect(){
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            "gdCode":filterInput[0],
            "gdSt":filterInput[2] + ' 00:00:00',
            "gdEt":filterInput[3] + ' 00:00:00',
            "bxKeshi":filterInput[1],
            "wxKeshi":filterInput[4],
            "gdZht":0,
            "gdZhts": [
                0
            ],
            "pjRen":filterInput[7],
            "shouliren": filterInput[8],
            "userID":_userIdName
        }
        $.ajax({
            type:'post',
            url:'http://192.168.1.196/BEEWebAPI/api/YWGD/ywGDGetDJ',
            data:prm,
            async:false,
            /*beforeSend:function(){
                $('#loading').show();
            },*/
            success:function(result){
                console.log(result);
                if(result.length == 0){
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                }else{
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                    table.fnAddData(result);
                    table.fnDraw();
                }
                /*$('#loading').hide();*/
            }
        })
    }
    function moTaiKuang(){
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = $('.modal-content').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        $('.modal-dialog').css({'margin-top':markBlockTop});
    }
    /*----------------------------表格绑定事件-----------------------------------*/
    var lastIdx = null;
    var _currentChexiao = false;
    var _currentClick;
    clickTimeout = {
        _timeout: null,
        /**
         *
         */
        set: function (fn) {
            var that = this;
            that.clear();
            that._timeout = window.setTimeout(fn, 300);
        },
        clear: function () {
            var that = this;
            if (that._timeout) {
                window.clearTimeout(that._timeout);
            }
        }
    }
    clickTimeout = {
        _timeout: null,
        /**
         *
         */
        set: function (fn) {
            var that = this;
            that.clear();
            that._timeout = window.setTimeout(fn, 300);
        },
        clear: function () {
            var that = this;
            if (that._timeout) {
                window.clearTimeout(that._timeout);
            }
        }
    }
    $('#scrap-datatables tbody')
    //鼠标略过行变色
        .on( 'mouseover', 'td', function () {
            var colIdx = table.cell(this).index();
            if ( colIdx !== lastIdx ) {
                $( table.cells().nodes() ).removeClass( 'highlight' );
                $( table.column( colIdx ).nodes() ).addClass( 'highlight' );
            }
        } )
        .on( 'mouseleave', function () {
            $( table.cells().nodes() ).removeClass( 'highlight' );
        } )
         //区分单机事件还是双击事件
        //双击背景色改变，查看详情
        .on('dblclick','tr',function(){
            //判断单双击事件
            clickTimeout.clear();
            $('#loading').show();
            //当前行变色
            var $this = $(this);
            currentTr = $this;
            currentFlat = true;
            $('#scrap-datatables tbody').children('tr').css({'background':'#ffffff'});
            $(this).css({'background':'#FBEC88'});
            $('#myModal').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal').modal('show');
            moTaiKuang();
            //获取详情
            var gongDanState = $this.children('td').eq(2).html();
            var gongDanCode = $this.children('td').eq(0).html();
            gdCode = gongDanCode;
            var prm = {
                'gdCode':gongDanCode,
                'gdZht':gongDanState,
                'userID':_userIdName
            }
            //每次获取弹出框中执行人员的数量
            $.ajax({
                type:'post',
                url:'http://192.168.1.196/BEEWebAPI/api/YWGD/ywGDGetDetail',
                async:false,
                data:prm,
                success:function(result){
                    console.log(result);
                    var indexs = result.gdZht;
                    $('.progressBar').children('li').css({'color':'#333333'});
                    for(var i=0;i<indexs;i++){
                        $('.progressBar').children('li').eq(i).css({'color':'#db3d32'});
                    }
                    //绑定弹窗数据
                    app33.picked = result.gdJJ;
                    app33.telephone = result.bxDianhua;
                    app33.person = result.bxRen;
                    app33.place = result.wxDidian;
                    app33.section = result.bxKeshi;
                    app33.matter = result.wxShiX;
                    app33.sections = result.wxKeshi;
                    app33.remarks = result.bxBeizhu;
                    app33.wxbeizhu = result.wxBeizhu;
                    //查看执行人员
                    if(result.wxRens.length == 0){
                        var table = $("#personTable1").dataTable();
                        table.fnClearTable();
                    }else{
                        var table = $("#personTable1").dataTable();
                        table.fnClearTable();
                        table.fnAddData(result.wxRens);
                        table.fnDraw();
                    }
                    //维修材料
                    if(result.wxCls.length == 0){
                        var table = $("#personTables1").dataTable();
                        table.fnClearTable();
                    }else{
                        var table = $("#personTables1").dataTable();
                        table.fnClearTable();
                        table.fnAddData(result.wxCls);
                        table.fnDraw();
                    }
                }
            });
        })
        // 单机选中
        .on('click','tr',function(){
            var $this = $(this);
            _currentChexiao = true;
            _currentClick = $this;
            clickTimeout.set(function () {
                //我的函数
                $('#scrap-datatables tbody').children('tr').css({'background':'#ffffff'});
                $this.css({'background':'#FBEC88'});
            })
        })
    $('.chexiao').click(function(){
        if(_currentClick){
            var zhuangtai = _currentClick.children('td').eq(2).html();
            if(zhuangtai == '结束'){
                $('#myModal1').modal({
                    show:false,
                    backdrop:'static'
                })
                $('#myModal1').modal('show');
                moTaiKuang1();
            }else{
                $('#myModal3').modal({
                    show:false,
                    backdrop:'static'
                })
                $('#myModal3').modal('show');
                $('#myModal3').find('.modal-body').html('未完成状态工单无法进行撤销操作');
                moTaiKuang3();
            }
        }else{
            $('#myModal3').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal3').modal('show');
            $('#myModal3').find('.modal-body').html('请选择要撤销的工单!');
            moTaiKuang3();
        }
    })
    $('.zuofei').click(function(){
        if(_currentClick){
            var zhuangtai = _currentClick.children('td').eq(2).html();
            if(zhuangtai == '结束'){
                $('#myModal3').modal({
                    show:false,
                    backdrop:'static'
                })
                $('#myModal3').modal('show');
                $('#myModal3').find('.modal-body').html('已完成状态工单无法进行作废操作');
                moTaiKuang3();
            }else{
                $('#myModal1').modal({
                    show:false,
                    backdrop:'static'
                })
                $('#myModal1').modal('show');
                moTaiKuang1();
            }
        }else{
            //alert('请选择要报废的工单')
            $('#myModal3').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal3').modal('show');
            $('#myModal3').find('.modal-body').html('请选择要报废的工单!');
            moTaiKuang3();
        }
    })
    $('#myModal1').find('.btn-primary').click(function (){
        if(_currentChexiao){
             var gdCodes = _currentClick.children('td').eq(0).html();
             var gdInfo = {
             'gdCode':gdCodes,
             'userID':_userIdName
             }
             $.ajax({
                 type:'post',
                 url:'http://192.168.1.196/BEEWebAPI/api/YWGD/ywGDDel',
                 data:gdInfo,
                 success:function(result){
                    conditionSelect();
                 }
             })
        }
        $('#myModal1').modal('hide');
    })
    $('#myModal2').find('.btn-primary').click(function (){
        if(_currentChexiao){
            var gdCodes = _currentClick.children('td').eq(0).html();
            var gdInfo = {
                'gdCode':gdCodes,
                'userID':_userIdName
            }
            $.ajax({
                type:'post',
                url:'http://192.168.1.196/BEEWebAPI/api/YWGD/ywGDDelII',
                data:gdInfo,
                success:function(result){
                    conditionSelect();
                }
            })
        }
        $('#myModal1').modal('hide');
    })
    /*------------------------按钮功能-----------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
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
        $('#myModal').modal('hide');
    })
    $('#myModal3').find('.btn-primary').click(function(){
        $('#myModal3').modal('hide');
    })
    $('#myModal4').find('.btn-primary').click(function(){
        $('#myModal4').modal('hide');
    })
    function moTaiKuang1(){
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = $('#myModal1').find('.modal-dialog').height();
        //console.log(markBlockHeight);
        var markBlockTop = (markHeight - markBlockHeight)/2;
        $('#myModal1').find('.modal-dialog').css({'margin-top':markBlockTop});
    }
    function moTaiKuang3(){
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = $('#myModal3').find('.modal-dialog').height();
        //console.log(markBlockHeight);
        var markBlockTop = (markHeight - markBlockHeight)/2;
        $('#myModal3').find('.modal-dialog').css({'margin-top':markBlockTop});
    }
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
})