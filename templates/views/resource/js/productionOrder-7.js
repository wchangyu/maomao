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
    replaceIP(_urlImg,_urls);
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
    })
    //定位当前页索引值
    var currentPages = 0;
    var currentRow = '';
    //当前那工单号
    var gdCode = '';
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
    var _gdCircle = 0
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
            "wxKeshi":filterInput[4],
            "gdZht":3,
            "gdZhts":[0],
            "userID":_userIdNum,
            "userName":_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetZX',
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
    /*------------------------按钮功能-----------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            $('#myModal2').find('.modal-body').html('起止时间不能为空');
            moTaiKuang($('#myModal2'),'提示','flag');
        }else {
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                $('#myModal2').find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang($('#myModal2'),'提示','flag');
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
    $('#myModal')
        //操作
        .on('click','.execute',function(){
        //先判断现在的状态是否可执行操作方法
        var currentZTZ = $('.current-state').attr('ztz');
        var currentOption = $('#option-select').val();
        //判断当前状态和执行任务状态
        if(  currentZTZ == currentOption ){
            //只发送维修备注请求
            wxRmark();
        }else{
            if( currentZTZ == 3 && currentOption != 4 ){
                //提示请执行任务
                $('.errorTips').html('当前状态下请先选择执行任务操作！');
            }else{
                $('.errorTips').html('');
                //状态转换+维修内容
                wxRmark();
                getGongDan();
                //根据标识提示
                if( _wxRemarkFlag && _stateFlag ){
                    moTaiKuang($('#myModal2'),'提示','flag');
                    $('#myModal2').find('.modal-body').html('操作成功！');
                    $('#myModal').modal('hide');
                }else{
                    var str = '';
                    if( _wxRemarkFlag == flag ){
                        str += '维修内容修改失败，'
                    }else{
                        str += '维修内容修改成功，'
                    }
                    if( _stateFlag == flag ){
                        str += '操作失败，'
                    }else{
                        str += '操作成功，'
                    }
                    moTaiKuang($('#myModal2'),'提示','flag');
                    $('#myModal2').find('.modal-body').html(str);
                }
                conditionSelect();
            }
        }
    })
        //查看图片
        .on('click','#viewImage',function(){
            if(_imgNum){
                var str = '';
                for(var i=0;i<_imgNum;i++){
                    str += '<img class="viewIMG" src="' +
                        _urlImg + '?gdcode=' + gdCode + '&no=' + i +
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
            moTaiKuang($('#myModal3'),'图片详情','flag');
            var imgSrc = $(this).attr('src')
            $('#myModal3').find('img').attr('src',imgSrc);
        })

   $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })

    //选择执行状态事件
    $('#option-select').change(function(){
        if( $('.current-state').attr('ztz') == 3 && $('#option-select').val() != 4){
            $('.errorTips').html('当前状态下请先选择执行任务操作！');
        }else{
            $('.errorTips').html('');
        }
    })

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
            moTaiKuang($('#myModal'),'工单详情');
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
                    //给当前状态赋值
                    var currentState = '';
                    if(result.gdZht == 3){
                        currentState = '待执行'
                    }else if(result.gdZht == 4){
                        currentState = '执行中'
                    }else if(result.gdZht == 5){
                        currentState = '等待资源'
                    }else if(result.gdZht == 6){
                        currentState = '待关单'
                    }
                    $('.current-state').val(currentState);
                    $('.current-state').attr('ztz',result.gdZht);
                    //维修科室
                    _wxOffice = result.wxKeshi;
                    //维修内容
                    $('#wxbeizhu').val(result.wxBeizhu);
                    _wxContent = result.wxBeizhu;
                    //最新进展
                    $('#newBeiZhu').val('');
                    app33.gdly = result.gdCodeSrc;
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            });
        });
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint');
    /*-----------------------------------------模态框位置自适应------------------------------------------*/
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
    //修改维修备注方法
    function wxRmark(){
        var gdInfo = {
            "gdCode": gdCode,
            "gdZht": $('#option-select').val(),
            "wxKeshi": _wxOffice,
            "wxBeizhu": $('#wxbeizhu').val(),
            "userID": _userIdNum,
            "userName":_userIdName,
            "lastUpdateInfo":$('#newBeiZhu').val()
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDUptWxBeizhu',
            data:gdInfo,
            async:false,
            success:function(result){
                if(result == 99){
                    /*conditionSelect();

                    $('#myModal').modal('hide');*/
                    _wxRemarkFlag = true;
                }else{
                    _wxRemarkFlag = false;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    };
    //转化状态
    function getGongDan(){
        var gdInfo = {
            'gdCode':gdCode,
            'gdZht':$('#option-select').val(),
            'userID':_userIdNum,
            'userName':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
            data:gdInfo,
            async:false,
            success:function(result){
                if(result == 99){
                    _stateFlag = true;
                }else{
                    _stateFlag = false;
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
    }
})