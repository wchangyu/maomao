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
        format: 'yyyy/mm/dd'
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
            picked:'1',
            telephone:'',
            person:'',
            place:'',
            section:'',
            matter:'',
            sections:'',
            remarks:'',
            sbbm:'',
            wxbz:''
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
    //选中的条目数组
    var _allXJSelect = [];
    //设备条目
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
                className:'bianma'
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
                title:'条目名称',
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
    //条目表格初始化
    var col2 = [
        {
            title:'条目编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'条目名称',
            data:'ditName'
        },
        {
            title:'条目参考值',
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
            var $this = $(this).parents('tr');
            $('.table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisBM = $(this).parents('tr').children('.bianma').html();
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
                async:false,
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
            moTaiKuang($('#myModal1'));
        })
        .on('click','.option-gongdan',function(){
            var $this = $(this).parents('tr');
            $('.table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            _sbbm = $(this).parents('tr').children('.dNum').html();
            _gzms = $(this).parents('tr').children('.exception').html();
            //初始化
            app33.picked = '1';
            app33.telephone = '';
            app33.person = '';
            app33.place ='';
            app33.section = '';
            app33.matter = '';
            app33.remarks = '';
            app33.sbbm = _sbbm;
            app33.wxbz = _gzms;
            moTaiKuang($('#myModal2'));
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            var $thisSBBM = '';
            //根据巡检任务单号，获得条目编码
            for(var i=0;i<_allDataArr.length;i++){
                if(_allDataArr[i].itkNum == $thisBM){
                $thisSBBM = _allDataArr[i].ditNum
                }
            }
            _redh = $thisBM;
            _tmbm = $thisSBBM;
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
                success:function(result){
                    console.log(result);
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
                    app33.remarks = result[0].wxShebei;
                    app33.sbbm = _sbbm;
                    app33.wxbz = _gzms;
                }
            })
        })
    //工单登记
    $('.dengji').click(function(){
        if( app33.telephone == '' || app33.person == '' || app33.place == '' || app33.matter == ''){
            var myModal = $('#myModal5');
            myModal.find('.modal-body').html('请填写红色必填项');
            moTaiKuang(myModal);
        }else{
            var prm = {
                'gdJJ':app33.picked,
                'bxRen':app33.person,
                'bxDianhua':app33.telephone,
                'bxKeshi':app33.section,
                'wxDidian':app33.place,
                'wxShiX':app33.matter,
                'wxKeshi':'',
                'bxBeizhu':app33.remarks,
                'userID':_userIdName,
                'gdSrc':3,
                'itkNum':_redh,
                'ditNum':_tmbm,
                'wxShebei':_sbbm
            }
            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDCreDJDI',
                data:prm,
                success:function(result){
                    if(result != 3){
                        $('#myModal2').modal('hide');
                        var myModal = $('#myModal5');
                        myModal.find('.modal-body').html('工单创建成功!');
                        moTaiKuang(myModal)
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
})