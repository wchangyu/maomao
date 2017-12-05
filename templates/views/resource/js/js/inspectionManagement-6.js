$(function(){
    /*--------------------------------------------全局变量----------------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });
    //获取设备类型
    var prm = {
        "dcNum": "",
        "dcName": "",
        "dcPy": "",
        "userID": "mch"
    };
    $.ajax({
        type:'post',
        url:_urls + 'YWDev/ywDMGetDCs',
        data:prm,
        success:function(result){
            var str = '<option value="">全部</option>';
            for(var i=0;i<result.length;i++){
                str += '<option value="' + result[i].dcNum + '">' + result[i].dcName + '</option>'
            }
            $('#sblx').append(str);
        }
    });
    //存放所有数据的列表
    var _allDataArr = [];
    //验证必填项（非空）
    Vue.validator('noempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });
    //接单页面vue对象
    var workDone = new Vue({
        el:'#workDone',
        data:{
            sfqy:0,
            rwdh:'',
            rwmc:'',
            sbmc:'',
            sbbm:'',
            zrdwbm:'',
            fzr:'',
            zxr:'',
            zysm:'',
            jhbm:''
        }
    });
    var workDone1 = new Vue({
        el:'#workDone1',
        data:{
            sfqy:0,
            rwdh:'',
            rwmc:'',
            sbmc:'',
            sbbm:'',
            zrdwbm:'',
            fzr:'',
            zxr:'',
            zysm:'',
            jhbm:''
        }
    });
    //工单登记
    //登记信息绑定
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
            sbbm:'',
            sbmc:'',
            wxbz:'',
            system:''
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
    //选中的步骤数组
    var _allXJSelect = [];
    //设备步骤
    var _tiaoMuArr = [];
    var prm = {
        ditName:'',
        dcNum:'',
        userID:_userIdName
    };
    $.ajax({
        type:'post',
        url: _urls + 'YWDevIns/YWDIGetDIItems',
        data:prm,
        async:false,
        success:function(result){
            _tiaoMuArr = [];
            for(var i=0;i<result.length;i++){
                _tiaoMuArr.push(result[i]);
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(JSON.parse(jqXHR.responseText).message);
            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
            }
        }
    });
    //存放当前行的任务单号的变量
    var _redh = '';
    //存放当前条编码的变量
    var _tmbm = '';
    //存放当前编码的设备编码
    var _sbbm = '';
    //存放当前编码的故障描述
    var _gzms = '';
    /*-------------------------------------------表格初始化-------------------------------------------*/
    var _tables =  $('.main-contents-table').find('.table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
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
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs btn btn-success'
            }
        ],
        "columns": [
            {
                title:'任务单号',
                data:'itkNum',
                className:'bianma',
                render:function(data, type, full, meta){

                    return '<span data-num="' + full.dipNum +
                        '">' + data +
                        '</span>'

                }
            },
            {
                title:'任务名称',
                data:'itkName'
            },
            {
                title:'设备名称',
                data:'dName'
            },
            {
                title:'设备编码',
                data:'dNum',
                className:'dNum'
            },
            {
                title:'步骤名称',
                data:'ditName'
            },
            {
                title:'参考值',
                data:''
            },
            {
                title:'异常故障描述',
                data:'exception',
                className:'exception'
            },
            {
                title:'责任单位部门',
                data:'dipKeshi'
            },
            {
                title:'责任人',
                data:'manager'
            },
            {
                title:'完工操作人',
                data:''
            },
            {
                title:'计划开始时间',
                data:'tkTime',
                render:function(data){
                    return data.split(' ')[0]
                }
            },
            {
                title:'完成时间',
                data:'tkCompTime'
            },
            {
                title:'操作',
                "data": 'gdCode',
                render:function(data){
                    if(data == ''){
                        return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                            "<span class='data-option option-gongdan btn default btn-xs green-stripe'>创建工单</span>"
                    }else{
                        return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                            "<span class='data-option option-gongdans btn default btn-xs green-stripe'>查看工单</span>"
                    }
                }
            }
        ]
    });
    //数据为空时，禁止弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('');
    };
    //步骤表格初始化
    var col2 = [
        {
            title:'步骤编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'步骤名称',
            data:'ditName'
        },
        {
            title:'步骤参考值',
            data:'stValue'
        },
        {
            title:'报警关系',
            data:'relation'
        },
        {
            title:'巡检结果',
            className:'tableInputBlock',
            data:'res',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '正常'
                }if(data ==2){
                    return '异常'
                }
            }
        },
        {
            title:'结果记录',
            className:'tableInputBlock',
            data:'record'
        },
        {
            title:'异常故障描述',
            className:'tableInputBlock',
            data:'exception'
        }
    ];
    tableInit($('#personTable1s'),col2);
    conditionSelect();
    /*-------------------------------------------按钮事件---------------------------------------------*/
    $('#selected').click(function(){
        conditionSelect();
    })
    //弹窗关闭按钮
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });
    //表格的按钮
    $('#scrap-datatables tbody')
        .on('click','.option-see',function(){

            moTaiKuang($('#myModal1'));
            $('#myModal1').find('.btn-primary').hide();
            var $this = $(this).parents('tr');
            $('.table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisBM = $(this).parents('tr').children('.bianma').children().html();

            //赋值
            for(var i=0;i<_allDataArr.length;i++){
                if(_allDataArr[i].itkNum == $thisBM){
                    workDone1.sfqy = _allDataArr[i].isActive;
                    workDone1.rwdh = _allDataArr[i].itkNum;
                    workDone1.rwmc = _allDataArr[i].itkName;
                    workDone1.sbmc = _allDataArr[i].dName;
                    workDone1.sbbm = _allDataArr[i].dNum;
                    workDone1.zrdwbm = _allDataArr[i].dipKeshi;
                    workDone1.fzr = _allDataArr[i].manager;
                    workDone1.zxr = _allDataArr[i].itkRen;
                    workDone1.jhbm = _allDataArr[i].dipNum;
                    $('#jdsjs').val(_allDataArr[i].tkRecTime);
                    $('#kssjs').val(_allDataArr[i].tkTime);
                    $('#wcsjs').val(_allDataArr[i].tkCompTime);
                    $('#beizhus').val(_allDataArr[i].remark);
                }
            };

            var prm = {
                itkNum:workDone1.rwdh,
                dipNum:workDone1.jhbm,
                userID:_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDevIns/ywITKGetTKInfo',
                data:prm,
                beforeSend: function () {
                    $('#theLoading').modal('hide');

                    $('#theLoading').modal('show');
                },

                complete: function () {

                    $('#theLoading').modal('hide');

                },
                success:function(result){
                    _allXJSelect = [];
                    for(var i=0;i<result.length;i++){
                        _allXJSelect.push(result[i]);
                    }
                    datasTable($('#personTable1s'),_allXJSelect);
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(JSON.parse(jqXHR.responseText).message);
                    if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    }
                }
            });

        })
        .on('click','.option-gongdan',function(){
            var $this = $(this).parents('tr');
            $('.table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            _sbbm = $(this).parents('tr').children('.dNum').html();
            _gzms = $(this).parents('tr').children('.exception').html();
            //初始化
            gdInit();

            app33.sbbm = _sbbm;
            app33.remarks = _gzms;
            moTaiKuang($('#myModal2'));
            var $thisBM = $(this).parents('tr').children('.bianma').children('span').html();
            var $thisSBBM = '';
            //根据巡检任务单号，获得步骤编码
            for(var i=0;i<_allDataArr.length;i++){
                if(_allDataArr[i].itkNum == $thisBM){
                    $thisSBBM = _allDataArr[i].ditNum
                }
            }
            _redh = $thisBM;
            _tmbm = $thisSBBM;

            var dNum = $(this).parents('tr').find('.dNum').html();

            //调设备接口，然后确定设备维修地点和设备分类
            $.ajax({

                type:'post',
                url:_urls + 'YWDev/ywDIGetDevs',
                data:{
                    dNum:dNum,
                    userID:_userIdName
                },
                success:function(result){

                    app33.sbmc = result[0].dName;

                    app33.place = result[0].installAddress;

                    app33.matter = result[0].dcName;

                    app33.system = result[0].dsName;

                    $('#system').attr('data-num',result[0].dsNum);

                    $('#matter').attr('data-num',result[0].dcNum);

                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(JSON.parse(jqXHR.responseText).message);
                    if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    }
                }

            })

            //调用巡检计划接口，获取报修部门
            var dipNum = $(this).parents('tr').find('.bianma').children('span').attr('data-num');

            $.ajax({

                type:'post',
                url:_urls + 'YWDevIns/YWDIPGetPlans',
                data:{

                    dipNum:dipNum,
                    userID:_userIdName,
                    isActive:99

                },
                success:function(result){

                    app33.section = result[0].dipKeshi;

                    $('#section').attr('data-num',result[0].dipKeshiNum);

                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(JSON.parse(jqXHR.responseText).message);
                    if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    }
                }

            })

            //可操作
            abledGD();

        })
        .on('click','.option-gongdans',function(){
            var $this = $(this).parents('tr');
            $('.table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            _sbbm = $(this).parents('tr').children('.dNum').html();
            _gzms = $(this).parents('tr').children('.exception').html();
            moTaiKuang($('#myModal2'));
            //通过工单号获取工单
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            for(var i=0;i<_allDataArr.length;i++){
                if(_allDataArr[i].itkNum == $thisBM){
                    var gongdanHao = _allDataArr[i].gdCode;
                }
            }
            //按工单号获取工单
            var prm = {
                'gdCode':gongdanHao,
                'gdSt':'',
                'gdEt':'',
                'bxKeshi':'',
                'wxKeshi':'',
                "gdZht": 1,
                'userID':_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDGetDJ',
                data:prm,
                beforeSend: function () {
                    $('#theLoading').modal('hide');

                    $('#theLoading').modal('show');
                },

                complete: function () {

                    $('#theLoading').modal('hide');

                },
                success:function(result){
                    if(result){
                        if(result[0].gdJJ == 1){
                            $('.inpus').parent('span').removeClass('checked');
                            $('#ones').parent('span').addClass('checked');
                        }else{
                            $('.inpus').parent('span').removeClass('checked');
                            $('#twos').parent('span').addClass('checked');
                        }
                        app33.telephone = result[0].bxDianhua;
                        app33.person = result[0].bxRen;
                        app33.place =result[0].wxDidian;
                        app33.section = result[0].bxKeshi;
                        app33.matter = result[0].wxShiX;
                        app33.remarks = result[0].bxBeizhu;
                        app33.sbbm = _sbbm;
                        app33.wxbz = _gzms;
                    }else{

                        return false;

                    }

                }
            })

            disabledGD();
        })
    //工单登记
    $('.dengji').click(function(){
        if( app33.telephone == '' || app33.person == '' || app33.place == '' || app33.matter == ''){
            var myModal = $('#myModal5');
            myModal.find('.modal-body').html('请填写红色必填项');
            moTaiKuang(myModal);
        }else{
            var prm = {
                //是否紧急
                'gdJJ':app33.picked,
                //设备名称
                'dName':app33.sbmc,
                //设备编码
                'dNum':app33.sbbm,
                //报修电话
                'bxDianhua':app33.telephone,
                //报修人信息
                'bxRen':app33.person,
                //维修地点
                'wxDidian':app33.place,
                //报修部门
                'bxKeshi':app33.section,
                //报修部门编码
                'wxKeshiNum':$('#section').attr('data-num'),
                //设备分类
                'dcName':app33.matter,
                //设备分类编码
                'dcNum':$('#matter').attr('data-num'),
                //报修备注
                'bxBeizhu':app33.remarks,
                //维修备注
                'wxBeizhu':app33.wxbz,
                //设备系统
                'wxShiX':app33.system,
                'wxShiXNum':$('#system').attr('data-num'),
                'userID':_userIdName,
                'gdSrc':3,
                'itkNum':_redh,
                'ditNum':_tmbm,
                'wxShebei':app33.sbbm,

            }
            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDCreDJDI',
                data:prm,
                beforeSend: function () {
                    $('#theLoading').modal('hide');

                    $('#theLoading').modal('show');
                },

                complete: function () {

                    $('#theLoading').modal('hide');

                },
                success:function(result){
                    if(result != 3){
                        $('#myModal2').modal('hide');
                        var myModal = $('#myModal5');
                        myModal.find('.modal-body').html('工单创建成功!');
                        myModal.find('.btn-primary').hide();
                        moTaiKuang(myModal)
                        conditionSelect();

                    }else{

                        var myModal = $('#myModal5');
                        myModal.find('.modal-body').html('工单创建失败!');
                        myModal.find('.btn-primary').hide();

                    }
                    //刷新表格
                    conditionSelect();
                }
            })
        }

    })
    /*--------------------------------------------其他方法--------------------------------------------*/
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            "itkNum": filterInput[2],
            "itkName": filterInput[3],
            "dcNum": $('#sblx').val(),
            "dNum": filterInput[0],
            "dName": filterInput[1],
            "dipKeshi": filterInput[4],
            "manager": filterInput[5],
            "ditST": filterInput[6],
            "ditET": filterInput[7],
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/ywITKGetExceptions',
            data:prm,
            success:function(result){
                _allDataArr = [];
                for(var i=0;i<result.length;i++){
                    _allDataArr.push(result[i]);
                }
                datasTable($('#scrap-datatables'),result);
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
    //确定新增弹出框的位置
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
    //表格初始化
    function tableInit(tableId,col){
        tableId.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": true,   //是否分页
            "destroy": true,//还原初始化了的datatable
            "searching": false,
            "ordering": false,
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
            "dom":'B<"clear">lfrtip',
            'buttons':[
                {
                    extend: 'excelHtml5',
                    text: '导出',
                    className:'saveAs hidding'
                }
            ],

            "columns": col
        })
    }

    //创建工单初始化
    function gdInit(){

        //工单类型（快速、普通）
        app33.picked = 0;
        //单选设置
        $('.inpus').parent('span').removeClass('checked');

        $('#twos').parent('span').addClass('checked');

        //设备编码
        app33.sbbm = '';

        //设备名称
        app33.sbmc = '';

        //报修电话
        app33.telephone = '';

        //报修人
        app33.person = '';

        //维修地点
        app33.place = '';

        //报修部门
        app33.section = '';

        //维修事项
        app33.matter = '';

        //报修备注
        app33.remarks = '';

        //维修备注
        app33.wxbz = '';

        //设备系统
        app33.system = '';

    }

    //工单可操作
    function abledGD(){

        $('#myModal2').find('input').attr('disabled',false).removeClass('disabled-block');

        $('#myModal2').find('select').attr('disabled',false).removeClass('disabled-block');

        $('#myModal2').find('textarea').attr('disabled',false).removeClass('disabled-block');

        $('#ones').parents('.input-blockeds').removeClass('disabled-block');

        $('.auto-fill').attr('disabled',true).addClass('disabled-block');
    }

    //工单不可操作
    function disabledGD(){

        $('#myModal2').find('input').attr('disabled',true).addClass('disabled-block');

        $('#myModal2').find('select').attr('disabled',true).addClass('disabled-block');

        $('#myModal2').find('textarea').attr('disabled',true).addClass('disabled-block');

        $('#ones').parents('.input-blockeds').addClass('disabled-block');
    }
})