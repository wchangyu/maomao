$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdNum = sessionStorage.getItem('userName');
    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');
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
    var _gdState;
    var gdCode;
    var _gdCircle = 0;
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
                text: '导出',
                className:'saveAs'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
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
                title:'工单状态值',
                data:'gdZht',
                className:'ztz'
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
                "data": null,
                "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>完工</span>"
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
        "dom":'t<"F"lip>',
        "columns": [
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
        "dom":'t<"F"lip>',
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
        realityStart = filterInput[2] + ' 00:00:00';
        realityEnd = moment(filterInput[3]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var prm = {
            "gdCode2":filterInput[0],
            "gdSt":realityStart,
            "gdEt":realityEnd,
            "bxKeshi":filterInput[1],
            "wxKeshi":filterInput[4],
            "gdZht":6,
            "userID":_userIdNum,
            "userName":_userIdName
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDGetDJ',
            data:prm,
            async:false,
            success:function(result){
                datasTable($("#scrap-datatables"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                console.log(info);
            }
        })
    }
    //状态转换
    function getGongDan(){
        var gdInfo = {
            'gdCode':gdCode,
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
                    moTaiKuang($('#myModal2'),'flag');
                    $('#myModal2').find('.modal-body').html('确认完工操作成功！')
                    conditionSelect();
                    $('#myModal').modal('hide');
                }else{
                    moTaiKuang($('#myModal2'),'flag');
                    $('#myModal2').find('.modal-body').html('确认完工操作失败！')
                }
            },
              error:function(jqXHR, textStatus, errorThrown){
                  var info = JSON.parse(jqXHR.responseText).message;
                  console.log(info);
              }
        })
    }
    //模态框自适应
    function moTaiKuang(who,flag){
        who.modal({
            show:false,
            backdrop:'static'
        })
        //$('#myModal2').find('.modal-body').html('起止时间不能为空');
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
    /*----------------------------表格绑定事件-----------------------------------*/
    $('#scrap-datatables tbody')
        //双击背景色改变，查看详情
        .on('click','.option-edit',function(){
            //当前行变色
            var $this = $(this).parents('tr');
            currentTr = $this;
            currentFlat = true;
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            moTaiKuang($('#myModal'));
            //获取详情
            var gongDanState = parseInt($this.children('.ztz').html());
            var gongDanCode = $this.children('.gongdanId').html();
            //根据工单状态，确定按钮的名称
            if( gongDanState == 6 ){
                _gdState = 7;
            }
            gdCode = gongDanCode;
            var prm = {
                'gdCode':gongDanCode,
                'gdZht':gongDanState,
                'userID':_userIdNum,
                'userName':_userIdName,
                'gdCircle':_gdCircle + 1
            }
            //每次获取弹出框中执行人员的数量
            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDGetDetail',
                async:false,
                data:prm,
                success:function(result){
                    if(result.gdJJ == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('#ones').parent('span').addClass('checked');
                    }else{
                        $('.inpus').parent('span').removeClass('checked');
                        $('#twos').parent('span').addClass('checked');
                    }
                    //绑定弹窗数据
                    app33.telephone = result.bxDianhua;
                    app33.person = result.bxRen;
                    app33.place = result.wxDidian;
                    app33.section = result.bxKeshiNum;
                    app33.matter = result.wxShiXNum;
                    app33.sections = result.wxKeshi;
                    app33.remarks = result.bxBeizhu;
                    app33.wxbeizhu = result.wxBeizhu;
                    app33.rwlx = result.gdLeixing;
                    app33.sbSelect = result.wxShebei;
                    app33.sbLX = result.dcName;
                    app33.sbMC = result.dName;
                    app33.sbBM = result.ddName;
                    app33.azAddress = result.installAddress;
                    //查看执行人员
                    datasTable($("#personTable1"),result.wxRens);
                    //维修材料
                    datasTable($("#personTables1"),result.wxCls);
                },
                error:function(jqXHR, textStatus, errorThrown){
                    var info = JSON.parse(jqXHR.responseText).message;
                    console.log(info);
                }
            });
            //所有input框为不可操作
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true);
            $('.wxbeizhu').attr('disabled',false);
        });
    /*------------------------按钮功能-----------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            $('#myModal2').find('.modal-body').html('起止时间不能为空');
            moTaiKuang($('#myModal2'),'flag');
        }else {
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                $('#myModal2').find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang($('#myModal2'),'flag');
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
        getGongDan();
    })
    //提示框的确定
    $('.confirm1').click(function(){
        $('#myModal2').modal('hide');
    })
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')

})