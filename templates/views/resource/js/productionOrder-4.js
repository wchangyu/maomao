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
    //显示时间
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
            wxbeizhu:'',
            rwlx:4,
            sbSelect:'',
            sbLX:'',
            sbMC:'',
            sbBM:'',
            azAddress:''
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
    //定位当前页
    var currentPages = 0;
    //执行人数组
    var _zhixingRens = [];
    //物料数组
    var _weiXiuCaiLiao = [];
    //负责人数组
    var _fuZeRen = [];
    //记录工单号
    var _gdCode = 0;
    //记录当前工单详情有几个图
    var _imgNum = 0;
    //执行人员的标识
    var _workerFlag = false;
    //物料的标识
    var _WLFlag = false;
    //状态标识
    var _stateFlag = false;
    //负责人标识
    var _leaderFlag = false;
    //状态值
    var _gdState = 0;
    //重发值
    var _gdCircle = 0;
    /*--------------------------表格初始化---------------------------------------*/
    //页面表格
    var table = $('#scrap-datatables').DataTable(   {
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        "bStateSave":true,
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
                className:'saveAs',
                exportOptions:{
                    columns:[0,1,2,3,4,5,6,7,8,9,10,11]
                }
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'工单号',
                data:'gdCode2',
                render:function(data, type, row, meta){
                    return '<span class="gongdanId" gdCode="' + row.gdCode +
                        '"' + "gdCircle=" + row.gdCircle +
                        '></span><a href="productionOrder_see.html?gdCode=' +  row.gdCode +  '&userID=' + _userIdNum + '&userName=' + _userIdName + '&gdZht=' + row.gdZht + '&gdCircle=' + row.gdCircle +
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
                title:'工单状态值',
                data:'gdZht',
                className:'ztz'
            },
            {
                title:'系统名称',
                data:'wxShiX'
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
                title:'故障描述',
                data:'bxBeizhu'
            },
            {
                title:'最新处理情况',
                data:'lastUpdateInfo'
            },
            {
                title:'受理时间',
                data:'shouLiShij'
            },
            {
                title:'故障发生时长',
                data:'timeSpan'
            },
            {
                title:'督察督办责任人',
                data:'paigongUser'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "className":'noprint',
                "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>查看</span>"
            }
        ]
    });
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
                text: '导出',
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
                text: '导出',
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
                title:'数量',
                data:'clShul'
            }
        ]
    });
    //条件查询
    conditionSelect();
    /*----------------------------表格绑定事件-----------------------------------*/
    var _currentChexiao = false;
    var _currentClick;
    $('#scrap-datatables tbody')
        //查看详情
        .on('click','.option-edit',function(){
            _gdCircle = $(this).parents('tr').children('td').children('.gongdanId').attr('gdcircle');
            //图片区域隐藏
            $('.showImage').hide();
            //获得当前的页数，
            for( var i=0;i<$('.paginate_button').length;i++){
                if($('.paginate_button').eq(i).hasClass('current')){
                    currentPages = $('.paginate_button').eq(i).html();
                }
            }
            //当前行变色
            var $this = $(this).parents('tr');
            currentTr = $this;
            currentFlat = true;
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            moTaiKuang($('#myModal'));
            //获取详情
            var gongDanState = parseInt($this.children('.ztz').html());
            var gongDanCode = $this.children('td').children('.gongdanId').attr('gdCode');
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
                    var indexs = result.gdZht;
                    var progressBarList = $('.progressBarList');
                    var timeContent = $('.record-list');
                    //绑定弹窗数据
                    if(result.gdJJ == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('#ones').parent('span').addClass('checked');
                    }else{
                        $('.inpus').parent('span').removeClass('checked');
                        $('#twos').parent('span').addClass('checked');
                    }
                    //app33.picked = result.gdJJ;
                    app33.telephone = result.bxDianhua;
                    app33.person = result.bxRen;
                    app33.place = result.wxDidian;
                    app33.section = result.bxKeshi;
                    app33.matter = result.wxShiX;
                    app33.sections = result.wxKeshi;
                    app33.remarks = result.bxBeizhu;
                    app33.wxbeizhu = result.wxBeizhu;
                    app33.sbSelect = result.wxShebei;
                    app33.sbLX = result.dcName;
                    app33.sbMC = result.dName;
                    app33.sbBM = result.ddName;
                    app33.azAddress = result.installAddress;
                    app33.rwlx = result.gdLeixing;
                    _zhixingRens = result.wxRens;
                    _fuZeRen = result.gdWxLeaders;
                    _imgNum = result.hasImage;
                    //进度条赋值
                    //待下发记录时间
                    progressContent(0,0,result.gdShij);
                    //待下发相关人员
                    progressContent(0,2,result.createUserName);
                    //调度下发时间
                    progressContent(1,0,result.shouLiShij);
                    //调度下发人员
                    progressContent(1,2,result.shouLiRenName);
                    //分派时间
                    progressContent(2,0,result.paiGongShij);
                    //分派人
                    progressContent(2,2,result.paigongUserName);
                    //开始执行时间
                    progressContent(3,0,result.jiedanShij);
                    var ddRen = '';
                     for(var i=0;i<result.wxRens.length;i++){
                     ddRen += result.wxRens[i].wxRName;
                         if(i!=result.wxRens.length-1){
                             ddRen += ','
                         }
                     }
                    //执行人
                    progressContent(3,2,ddRen);
                    //等待时间
                    progressContent(4,0,result.dengShij);
                    //等待人
                    progressContent(4,2,ddRen);
                    //完工时间
                    progressContent(5,0,result.wanGongShij);
                    //完工人
                    progressContent(5,2,ddRen);
                    //关闭时间
                    progressContent(6,0,result.guanbiShij);
                    //关单人
                    progressContent(6,2,result.pjRenName);
                    //查看执行人员
                    datasTable($("#personTable1"),result.wxRens);
                    //维修材料
                    datasTable($("#personTables1"),result.wxCls);
                    //根绝时间，判断取消之前处于什么状态
                    if(indexs == 999){
                        $('.progressBarList:last').children('.progressName').html('取消');
                        //控制显示红色
                        progressContent(6,0,result.quxiaoShij);
                        //重新遍历一下时间和对应的进度，如果时间为空，对应的进度置为黑色。
                    }else{
                        $('.progressBarList:last').children('.progressName').html('关闭');
                    }
                    //变色
                    for(var i=0;i<timeContent.length;i++){
                        var timeLength = timeContent.eq(i).children('div').eq(0).children('.record-content').html();
                        if(timeLength != ''){
                            progressBarList.eq(i).css({'color':'#db3d32'});
                        }else{
                            progressBarList.eq(i).css({'color':'#333'});
                            //当时间为''的话，执行人员也是空
                            timeContent.eq(i).children('div').eq(2).children('.record-content').html('');
                        }
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            });
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true).addClass('disabled-block');
        })
        // 单机选中(为了单击的时候就获得执行人员和物料，所以要直接调用获得详情接口)
        .on('click','tr',function(){
            _gdCircle = $(this).children('td').children('.gongdanId').attr('gdcircle');
            console.log(_gdCircle);
            var $this = $(this);
            _currentChexiao = true;
            _currentClick = $this;
            //获得当前的页数，
            for( var i=0;i<$('.paginate_button').length;i++){
                if($('.paginate_button').eq(i).hasClass('current')){
                    currentPages = $('.paginate_button').eq(i).html();
                }
            }
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
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        })
    $('.chexiao').click(function(){
        if(_currentClick){
            var zhuangtai = parseInt(_currentClick.children('.ztz').html());
            if(zhuangtai == 2 || zhuangtai == 3 || zhuangtai == 4 || zhuangtai == 5){
                moTaiKuang($('#myModal1'));
            }else{
                $('#myModal3').find('.modal-body').html('无法操作');
                moTaiKuang($('#myModal3'),'flag');
            }
        }else{
            $('#myModal3').find('.modal-body').html('请选择要回退的工单!');
            moTaiKuang($('#myModal3'),'flag');
        }
    })
    $('.zuofei').click(function(){
        if(_currentClick){
            var zhuangtai = parseInt(_currentClick.children('.ztz').html());
            if(zhuangtai == 7){
                $('#myModal3').find('.modal-body').html('已完成状态工单无法进行取消操作');
                moTaiKuang($('#myModal3'),'flag');
            }else{
                moTaiKuang($('#myModal2'));
            }
        }else{
            $('#myModal3').find('.modal-body').html('请选择要报废的工单!');
            moTaiKuang($('#myModal3'),'flag');
        }
    })
    //撤销（回退）
    $('#myModal1').find('.btn-primary').click(function (){
        if(_currentChexiao){
            var gdState = parseInt(_currentClick.find('.ztz').html());
            var htState = 0;
            if(gdState == 2){
                htState = 1;
            }else if( gdState == 3 || gdState == 4 || gdState == 5 ){
                htState = 2;
            }
            var gdCodes = _currentClick.children('td').eq(0).children('span').attr('gdcode');
            var gdInfo = {
                "gdCode": gdCodes,
                "gdZht": htState,
                "wxKeshi": "",
                "userID": _userIdNum,
                'userName':_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDUptZht',
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
                                $('#myModal1').modal('hide');
                                moTaiKuang($('#myModal3'),'flag');
                                $('#myModal3').find('.modal-body').html('回退成功！');
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
                                moTaiKuang($('#myModal3'),'flag');
                                $('#myModal3').find('.modal-body').html(str);
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
                                $('#myModal1').modal('hide');
                                moTaiKuang($('#myModal3'),'flag');
                                $('#myModal3').find('.modal-body').html('回退成功！');
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
                                moTaiKuang($('#myModal3'),'flag');
                                $('#myModal3').find('.modal-body').html(str);
                            }
                        }
                        conditionSelect();
                        $('#myModal1').modal('hide');
                        moTaiKuang($('#myModal3'),'flag');
                        $('#myModal3').find('.modal-body').html('回退成功！');
                    }else{
                        _stateFlag = false;
                        moTaiKuang($('#myModal3'),'flag');
                        $('#myModal3').find('.modal-body').html('回退失败！');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
    })
    //作废(取消)
    $('#myModal2').find('.btn-primary').click(function (){
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
                        $('#myModal3').find('.modal-body').html('工单取消成功！');
                        moTaiKuang($('#myModal3'),'flag');
                    }else{
                        $('#myModal3').find('.modal-body').html('工单取消失败！');
                        moTaiKuang($('#myModal3'),'flag');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
        $('#myModal1').modal('hide');
    })
    //修改
    $('#myModal')
    //查看图片
        .on('click','#viewImage',function(){
            if(_imgNum){
                var str = '';
                for(var i=0;i<_imgNum;i++){
                    str += '<img class="viewIMG" src="http://211.100.28.180/ApService/dimg.aspx?gdcode=' + _gdCode + '&no=' + i +
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
            moTaiKuang($('#myModal4'),'图片详情','flag');
            var imgSrc = $(this).attr('src')
            $('#myModal4').find('img').attr('src',imgSrc);
        })
    /*------------------------按钮功能-----------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            $('#myModal3').find('.modal-body').html('起止时间不能为空');
            moTaiKuang($('#myModal3'),'flag');
        }else {
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                $('#myModal3').find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang($('#myModal3'),'flag');
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
        $('.tableHover').hide();
        $('.tableHover').eq($(this).index()).show();
    });
    $('.confirm').click(function(){
        $('#myModal').modal('hide');
    })
    $('.modal').find('.btn-primary').click(function(){
        $(this).parents('.modal').modal('hide')
    })
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
    /*----------------------------方法-----------------------------------------*/
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
            "gdZht":$('#gdzt').val(),
            "pjRen":filterInput[6],
            "shouliren": filterInput[8],
            "userID":_userIdNum,
            //故障位置
            "gdLeixing":$('#rwlx').val(),
            "wxRen":filterInput[7],
            "wxdidian":filterInput[8],
            "isCalcTimeSpan":1,
            "userName":_userIdName
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDGetDJ',
            data:prm,
            async:false,
            success:function(result){
                datasTable($("#scrap-datatables"),result);
                var aaa = currentPages;
                for(var i=0 ;i<$('.paginate_button').length; i++){
                    if($('.paginate_button').eq(i).html() == aaa){
                        $('.paginate_button').eq(i).click();
                    }
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
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
    //删除无聊方法
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
    //进度条赋值
    function progressContent(elIndex,childrenIndex,time){
        $('.processing-record ul').children('li').eq(elIndex).children('div').eq(childrenIndex).children('.record-content').html(time);
    }

})