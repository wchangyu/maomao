$(function(){
    /*----------------------------------一些全局变量-------------------------------------*/
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
    //新增Vue对象
    var workDone = new Vue({
        el:'#workDone',
        data:{
            jhbm:'',
            xjnrmc:'',
            sbmc:'',
            sbbm:'',
            xjbm:'',
            fzr:'',
            zqdw:1,
            options:[
                {text: '日', value: '1'},
                {text: '周', value: '2'},
                {text: '月', value: '3'}
            ],
            sfqy:0,
            options1:[
                {text: '未启用', value: '0'},
                {text: '启用', value: '1'},
                {text: '停用', value: '2'},
            ],
            jhzq:''
        }
    });
    //添加执行人员Vue对象
    var zhiXingRen = new Vue({
        el:'#zhiXingRen',
        data:{
            zhixingren:'',
            gonghao:'',
            dianhua:''
        }
    });
    //非空验证
    //验证必填项（非空）
    Vue.validator('noempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });
    //存放所有巡检内容的数组
    var _allDataArr = [];
    var _weifenpeiArr = [];
    var _qiyongArr = [];
    var _jinyongArr = [];
    //存放所有供选择的巡检条目数组
    var _allXJTMArr = [];
    //存放所有已选择的巡检条目数组
    var _allXJSelect = [];
    //存放设备类型的所有数据
    var _allDataLX = [];
    //存放设备区域的所有数据
    var _allDataQY = [];
    //存放设备系统的所有数据
    var _allDataXT = [];
    //存放设备部门的所有数据
    var _allDataBM = [];
    //设备名称
    var _shebeiMC = '';
    //设备编码
    var _shebeiBM = '';
    //添加执行人存放的数组
    var _zhixingRens = [];
    var _tiaoMuArr = [];
    //存放状态值
    var _stateArr = [];
    //存放所有条件选择之后的巡检内容的列表
    var _allData = [];
    //存放选中的内容的编码
    var _selectNRBM = '';
    //存放内容选择时选择的条目
    var _nrArr = [];
    //存放添加巡检条目和通过内容选择条目的数组
    var _QCArr = [];
    //设备分类
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#sbfl'),'dcName','dcNum');
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#shebeileixings'),'dcName','dcNum');
    //从巡检内容中添加条目的设备分类
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#sblx1'),'dcName','dcNum');
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#shebeileixings1'),'dcName','dcNum');
    //页面加载的时候，首先把设备条目加载出来
    //获取数据
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
    //复选框选中的东西
    var _selectData = [];
    //存储所有执行人的数组
    var _allZXRArr = [];
    //获取所有员工列表
    getRY();
    var _zhixingRenTable = $('#zhixingRenTable');
    /*----------------------------------表格相关-----------------------------------------*/
    var _table = $('.main-contents-tables').find('.table');
    var _tableAdd = $('#zhiXingPerson');
    var _tableXJ = $('#personTable1');
    var _tableZXR = $('#personTable2');
   //巡检内容表格
    var _tables =  _table.DataTable({
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
                class:'checkeds',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'巡检计划编码',
                data:'dipNum',
                className:'bianma'
            },
            {
                title:'巡检计划名称',
                data:'dipName'
            },
            {
                title:'设备名称',
                data:'dName'
            },
            {
                title:'巡检部门',
                data:'dipKeshi'
            },
            {
                title:'负责人',
                data:'manager'
            },
            {
                title:'是否启用',
                className:'isActive',
                data:'isActive',
                render:function(data, type, full, meta){
                    if(data == 0){
                        return '未下发'
                    }if(data == 1){
                        return '已下发'
                    }if(data ==2){
                        return '停用'
                    }
                }
            },
            {
                title:'生效时间',
                data:'activeDate'
            },
            {
                title:'操作',
                "data": 'isActive',
                "render":function(data, type, full, meta){
                    if(data == 0){
                        return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                            "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
                            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>" +
                            "<span class='data-option option-assign btn default btn-xs green-stripe' title='下发任务'>下发任务</span>"
                    }if(data !=0){
                        return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
                    }
                }
            }
        ]
    });
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    //加载页面的时候，隐藏其他两个导出按钮
    for( var i=1;i<$('.excelButton').children().length;i++ ){
        $('.excelButton').children().eq(i).addClass('hidding');
    };
    //添加巡检条目表格
    var col=[
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'设备类型',
            data:'dcName'
        },
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
        }
    ]
    tableInit(_tableAdd,col);

    //巡检条目已选结果表格
    var col1=[
        {
            title:'设备类型',
            data:'dcName'
        },
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
            title:'参考关系',
            data:'relation'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }
    ];
    tableInit(_tableXJ,col1);

    //选择设备
    var col3=[
        {
            title:'设备编号',
            data:'dNum',
            className:'dNum'
        },
        {
            title:'设备名称',
            data:'dName',
        },
        {
            title:'规格型号',
            data:'spec',
        },
        {
            title:'设备类型',
            data:'dcName'
        },
        {
            title:'状态',
            data:'status',
            render:function(data, type, full, meta){
                if( data == 1){
                    return '正常'
                }else if( data ==2 ){
                    return '维修'
                }else if( data == 3 ){
                    return '报废'
                }else if(data == 0){
                    return ' '
                }
            }
        }
    ];
    tableInit($('#sbmcxz'),col3);
    //设备数据
    var prm = {
        'st':'',
        'et':'',
        'dName':$('.sbmc').html(),
        'spec':$('.ggxh').html(),
        'status':$('#zhuangtai').val(),
        'daNum':$('#quyu').val(),
        'ddNum':$('#bumen').val(),
        'dsNum':$('#xitong').val(),
        'dcNum':$('#leixing').val(),
        'userID':_userIdName
    }
    $.ajax({
        type:'post',
        url:_urls + 'YWDev/ywDIGetDevs',
        data:prm,
        success:function(result){

            datasTable($('#sbmcxz'),result);
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(JSON.parse(jqXHR.responseText).message);
            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
            }
        }
    });

    //添加执行人表格
    var col4 = [
        {
            title:'执行人员',
            data:'dipRen'
        },
        {
            title:'工号',
            data:'dipRenNum',
            className:'gonghao'
        },
        {
            title:'联系电话',
            data:'dipDh'
        },
        {
            class:'deleted',
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='tableDeleted'>删除</span>"
        },
    ];
    tableInit($('#zhiXingPersons'),col4);

    var col5 = [
        {
            title:'执行人员',
            data:'dipRen',
            className:'dipRen'
        },
        {
            title:'工号',
            data:'dipRenNum',
            className:'dipRenNum'
        },
        {
            title:'联系电话',
            data:'dipDh',
            className:'dipDh'
        },
        {
            class:'deleted',
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='tableDeleted data-option btn default btn-xs green-stripe'>删除</span>"
        }
    ];
    //添加执行人员表格
    tableInit(_tableZXR,col5);

    var col6 = [
        {
            title:'巡检内容编码',
            data:'dicNum',
            className:'bianma'
        },
        {
            title:'巡检内容名称',
            data:'dicName',
            className:'mingcheng'
        },
        {
            title:'设备分类',
            data:'dicNum'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-seeNR btn default btn-xs green-stripe'>查看</span>"
        }
    ]
    tableInit($('#zhiXingPerson1'),col6);

    //巡检内容查看详情表格
    var col7 = [
        {
            title:'设备类型',
            data:'dcName'
        },
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
            title:'参考关系',
            data:'relation'
        }
    ];
    tableInit($('#personTable3'),col7);

    //添加执行人员表格
    //增加执行人员表格（第二层弹窗）
    var col8 = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'dipRenNum',
            className:'zxrnum',
        },
        {
            title:'执行人员',
            data:'dipRen',
            className:'zxrname'
        },
        {
            title:'联系电话',
            data:'dipDh',
            className:'zxrphone'
        }
    ];
    tableInit($('#zhixingRenTable'),col8);

    /*-----------------------------------------添加执行人员---------------------------------*/
    //选择执行人员的确定按钮
    $('.addZXR').click(function (){
        var zxrList = _zhixingRenTable.children('tbody').find('.checked');
        for(var i=0;i<_allZXRArr.length;i++){
            for(var j=0;j<zxrList.length;j++){
                var bianma = zxrList.eq(j).parents('tr').children('.zxrnum').html();
                if( _allZXRArr[i].dipRenNum == bianma ){
                    _zhixingRens.push(_allZXRArr[i]);
                }
            }
        }
        datasTable($('#personTable2'),_zhixingRens);
    })
    //选择执行人员删除按钮
    $('#personTable2 tbody').on('click','.tableDeleted',function(){
        var $thisBM = $(this).parents('tr').children('.dipRenNum').html();
        for(var i=0;i<_zhixingRens.length;i++){
            if(_zhixingRens[i]. dipRenNum == $thisBM){
                $('.zxrGH').val(_zhixingRens[i].dipRenNum);
                $('.zxrXM').val(_zhixingRens[i].dipRen);
                $('.zxrDH').val(_zhixingRens[i].dipDh);
            }
        }
        moTaiKuang($('#myModal8'));
    });
    //删除确定按钮
    $('.removeWorkerButton').click(function(){
        var $thisBM = $('.zxrGH').val();
        _zhixingRens.removeByValue($thisBM,'dipRenNum');
        datasTable($('#personTable2'),_zhixingRens);
    })

    //设备选择事件
    $('#sbmcxz tbody').on('click','tr',function(){
        var $this = $(this)
        $('#sbmcxz tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        _shebeiMC = $.trim($this.find('.dNum').next().html());
        _shebeiBM = $.trim($this.find('.dNum').html());
    })
    $('#myModal3').on('click','.selectSBMC',function(){
        $('#myModal3').modal('hide');
        $('#sbmc').val(_shebeiMC);
        $('#sbbm').val(_shebeiBM);
    })
    //添加人选择事件
    $('.tianJiaPerson').click(function(){
        //添加之前先判断一下非空了没
        if(zhiXingRen.zhixingren == '' || zhiXingRen.gonghao == '' || zhiXingRen.dianhua == ''){
            $('#myModal5').find('.modal-body').html('请填写红色必填项');
            moTaiKuang($('#myModal5'));
        }else{
            var objects = {};
            objects.dipRen = zhiXingRen.zhixingren;
            objects.dipRenNum = zhiXingRen.gonghao;
            objects.dipDh = zhiXingRen.dianhua;
            //避免录入的信息重复，做个判断
            if(_zhixingRens.length == 0){
                _zhixingRens.push(objects);
                var table = $("#zhiXingPersons").dataTable();
                table.fnClearTable();
                table.fnAddData(_zhixingRens);
                table.fnDraw();
            }else{
                var isExist = false;
                for(var i=0;i<_zhixingRens.length;i++){
                    if(_zhixingRens[i].dipRenNum == objects.dipRenNum){
                        isExist = true;
                        break;
                    }
                }
                if(isExist){
                    $('.exists').show();
                }else{
                    $('.exists').hide();
                    _zhixingRens.push(objects);
                    var table = $("#zhiXingPersons").dataTable();
                    table.fnClearTable();
                    table.fnAddData(_zhixingRens);
                    table.fnDraw();
                }
            }
        }
    });
    //添加人选择事件确定按钮
    $('.secondButton').click(function(){
        $('#myModal4').modal('hide');
        datasTable(_tableZXR,_zhixingRens)
    })

    //设备选择的select
    //获取设备类型
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#leixing'),'dcName','dcNum');
    //设备区域
    ajaxFun('YWDev/ywDMGetDAs',_allDataQY,$('#quyu'),'daName','daNum');
    //设备系统
    ajaxFun('YWDev/ywDMGetDSs',_allDataXT,$('#xitong'),'dsName','dsNum');
    //设备部门
    ajaxFun('YWDev/ywDMGetDDs',_allDataBM,$('#bumen'),'ddName','ddNum');

    //添加表头复选框
    var creatCheckBox = '<input type="checkbox">';
    $('thead').find('.checkeds').prepend(creatCheckBox);

    //复选框点击事件（巡检内容）
    _table.find('tbody').on( 'click', 'input', function () {
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            //$(this).parents('tr').css({'background':'#FBEC88'});
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
    _table.find('thead').find('input').click(function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            _table.find('tbody').find('input').parents('.checker').children('span').addClass('checked');
            //所有行的背景颜色置为黄色
            //_table.find('tbody').find('tr').css({'background':'#fbec88'})
            _table.find('tbody').find('tr').addClass('tables-hover');
        }else{
            _table.find('tbody').find('input').parents('.checker').children('span').removeClass('checked');
            //_table.find('tbody').find('tr').css({'background':'#ffffff'})
            _table.find('tbody').find('tr').removeClass('tables-hover')
        }
    });

    //复选框点击事件（添加巡检条目）
    _tableAdd.find('tbody').on( 'click', 'input', function () {
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            $(this).parents('tr').css({'background':'#FBEC88'});
            //如果所有复选框打钩，那么表头的复选框自动打钩；
            var rowNum = $(this).parents('.table').find('tbody').find('.checkeds').length;
            var selectNum =  $(this).parents('.table').find('tbody').find('.checked').length;
            if( rowNum == selectNum){
                $(this).parents('.table').find('thead').find('.checkeds').find('span').addClass('checked');
            }
        }else{
            $(this).parent($('span')).removeClass('checked');
            $(this).parents('tr').css({'background':'#ffffff'});
            //只要有一个复选框没选中，全选框不打勾，
            $(this).parents('.table').find('thead').find('.checkeds').find('span').removeClass('checked');
        }
    });
    //点击thead复选框tbody的复选框全选中
    _tableAdd.find('thead').find('input').click(function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            _tableAdd.find('tbody').find('input').parents('.checker').children('span').addClass('checked');
            //所有行的背景颜色置为黄色
            _tableAdd.find('tbody').find('tr').css({'background':'#fbec88'})
        }else{
            _tableAdd.find('tbody').find('input').parents('.checker').children('span').removeClass('checked');
            _tableAdd.find('tbody').find('tr').css({'background':'#ffffff'})
        }
    });

    //选择执行人员
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

    //表格加载数据
    conditionSelect();
    /*-------------------------------------按钮事件-------------------------------------*/
    //查询
    $('#selected').click(function(){
        conditionSelect();
    });
    //新增
    $('.creatButton').click(function(){
        var $myModal = $('#myModal');
        moTaiKuang($myModal);
        //确定按钮添加登记类
        $myModal.find('.btn-primary').show().removeClass('fenpei').removeClass('bianji').addClass('dengji').html('添加');
        $('.zhiXingRenYuanButton').show();
        $('.zhiXingRenYuanButton1').show();
        $('.zhiXingRenYuanButtons').show();
        //初始化
        workDone.jhbm = '';
        workDone.xjnrmc = '';
        workDone.sbmc = '';
        workDone.xjbm = '';
        workDone.fzr = '';
        workDone.jhzq = '';
        workDone.zqdw = '1';
        workDone.sfqy = '0';
        workDone.sbbm = '';
        $('#sxsj').val('');
        $('#jssj').val('');
        $('#beizhu').val('');
        $('#sbbm').val('');
        $('#sbmc').val('');
        var empty = [];
        datasTable(_tableXJ,empty);
        datasTable(_tableZXR,empty);
        //初始化执行人员和条目选择的表格
        _allXJSelect = [];
        _zhixingRens = [];
    })
    //添加巡检条目按钮
    getTM();
    $('.zhiXingRenYuanButton').click(function(){
        moTaiKuang($('#myModal1'));
        getTM();
        var fn1 = function( row, data, index ) {
            for(var i=0;i<_allXJSelect.length;i++){
                if(data.ditNum == _allXJSelect[i].ditNum){
                    $('td:eq(0)', row).parents('tr').addClass('tables-hover');
                    $('td:eq(0)', row).addClass(' checkeds');
                    $('td:eq(0)', row).html( '<div class="checker"><span class="checked"><input type="checkbox"></span></div> ' );
                }
            }

        }
        tableInit(_tableAdd,col,fn1);
        //初始化一下
        $('#zhiXingPerson thead').find('.checker').children('span').removeClass('checked');
    });
    //添加巡检条目确定按钮
    $('.selectTableList').click(function(){
        _allXJSelect = [];
        //获取选中的列表
        //通过编码比较
        var list = $('#zhiXingPerson tbody').find('.checked');
        //通过比较巡检内容编码来确定是数组中的哪个数据
        for( var i=0;i<list.length;i++ ){
            var bianma = list.eq(i).parents('tr').children('.bianma').html();
            for(var j=0;j<_allXJTMArr.length;j++){
                var _allXJTMArrList = _allXJTMArr[j].ditNum;
                if( bianma == _allXJTMArrList ){
                    _allXJSelect.push(_allXJTMArr[j]);
                }
            }
        }

        $('#myModal1').modal('hide');
        for(var i=0;i<_allXJSelect.length;i++){
            _QCArr.push(_allXJSelect[i])
        };
        //去重
        var vas = unique(_QCArr);
        //放入表格中
        datasTable($('#personTable1'),vas);
    });
    //删除巡检条目按钮
    _tableXJ.children('tbody').on('click','.option-delete',function(){
        //样式
        var $this = $(this).parents('tr');
        _tableXJ.children('tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        var $myModal = $('#myModal2');
        $myModal.find('.btn-primary').removeClass('dashanchu').addClass('xiaoshanchu');
        //删除框赋值
        var $thisRow = $(this).parents('tr');
        $('#xjtmbm').val($thisRow.find('.bianma').html());
        $('#xjtmmc').val($thisRow.find('.bianma').next().html());
        moTaiKuang($myModal);
    })
    //删除巡检条目确定按钮(静态数据)
    $('.xiaoshanchu').click(function(){
        _QCArr = [];
        //获取要删除的条目的编码和名称，进行删除
        _allXJSelect.removeByValue($('#xjtmbm').val(),'ditNum');
        //删除一次再次重新获取值，
        for(var i=0;i<_allXJSelect.length;i++){
            _QCArr.push(_allXJSelect[i])
        }
        for(var i=0;i<_nrArr.length;i++){
            _QCArr.push(_nrArr[i]);
        }
        var vas = unique(_QCArr);
        datasTable(_tableXJ,vas);
        $('#myModal2').modal('hide');
    });
    //添加执行人员按钮
    $('.zhiXingRenYuanButtons').click(function(){
        //初始化
        moTaiKuang($('#myModal7'));
        //将选中的和所有执行人员列表比较，有的标记
        getRY();
        //对已存在的行标记(添加执行人员的)
        var fn1 = function( row, data, index ) {
            for(var i=0;i<_zhixingRens.length;i++){
                if(data.dipRenNum == _zhixingRens[i].dipRenNum){
                    $('td:eq(0)', row).parents('tr').addClass('tables-hover');
                    $('td:eq(0)', row).addClass(' checkeds');
                    $('td:eq(0)', row).html( '<div class="checker"><span class="checked"><input type="checkbox"></span></div> ' );
                }
            }

        }
        tableInit($('#zhixingRenTable'),col8,fn1);
    });
    //删除执行人员表格按钮
    $('#zhiXingPersons tbody').on('click','.tableDeleted',function(){
        var $this = $(this);
        var $thisBM = $this.parents('tr').find('.gonghao').html();
        for(var i=0;i<_zhixingRens.length;i++){
            if(_zhixingRens[i].dipRenNum == $thisBM){
                _zhixingRens.removeByValue($thisBM,'dipRenNum');
            }
        }
        datasTable($('#zhiXingPersons'),_zhixingRens);
    })
    //表格中的按钮操作
    _table.find('tbody')
        .on('click','.option-see',function(){
            //样式
            var $thisTable = $(this).parents('.main-contents-tables').find('.table');
            var $thiss = $(this).parents('tr');
            $thisTable.find('tr').removeClass('tables-hover');
            $thiss.addClass('tables-hover');
            $thisTable.children('tbody').children('tr').children('.checkeds').find('span').removeClass('checked');
            $thiss.children('.checkeds').find('span').addClass('checked');
            ckOrBj($(this));
            //样式都置为不可操作
            $('#myModal').find('.btn-primary').hide();
            //条目添加的查看按钮设为不可操作
            $('.zhiXingRenYuanButton').hide();
            $('.zhiXingRenYuanButton1').hide();
            $('.zhiXingRenYuanButtons').hide();
        })
        .on('click','.option-edite',function(){
            //样式
            var $thisTable = $(this).parents('.main-contents-tables').find('.table');
            var $thiss = $(this).parents('tr');
            $thisTable.find('tr').removeClass('tables-hover');
            $thiss.addClass('tables-hover');
            $thisTable.children('tbody').children('tr').children('.checkeds').find('span').removeClass('checked');
            $thiss.children('.checkeds').find('span').addClass('checked');
            var $this = $(this);
            _shebeiMC = $.trim($this.find('.bianma').next().html());
            _shebeiBM = $.trim($this.find('.bianma').html());
            ckOrBj($(this));
            //确定按钮显示，并且添加bianji类
            $('#myModal').find('.btn-primary').show().removeClass('dengji').removeClass('fenpei').addClass('bianji').html('编辑');
            //添加按钮显示
            $('.zhiXingRenYuanButton').show();
            $('.zhiXingRenYuanButton1').show();
            $('.zhiXingRenYuanButtons').show();
        })
        .on('click','.option-delete',function(){
            //样式
            var $thisTable = $(this).parents('.main-contents-tables').find('.table');
            var $thiss = $(this).parents('tr');
            $thisTable.find('tr').removeClass('tables-hover');
            $thiss.addClass('tables-hover');
            $thisTable.children('tbody').children('tr').children('.checkeds').find('span').removeClass('checked');
            $thiss.children('.checkeds').find('span').addClass('checked');
            var $myModal = $('#myModal2');
            moTaiKuang($myModal);
            $myModal.find('.btn-primary').removeClass('xiaoshanchu').addClass('dashanchu');
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            var $thisMC = $(this).parents('tr').children('.bianma').next().html();
            $('#xjtmbm').val($thisBM);
            $('#xjtmmc').val($thisMC);
        })
        .on('click','.option-assign',function(){
            var $this = $(this);
            _shebeiMC = $.trim($this.find('.bianma').next().html());
            _shebeiBM = $.trim($this.find('.bianma').html());
            ckOrBj($(this));
            //确定按钮显示，并且添加分配类
            $('#myModal').find('.btn-primary').show().removeClass('dengji').removeClass('bianji').addClass('fenpei').html('启动任务巡检');
        })
    //表格编辑确定按钮
    $('#myModal')
        .on('click','.bianji',function(){
            if( workDone.xjnrmc == '' || $('#sbmc').val()=='' || workDone.sbbm == ''|| workDone.xjbm == '' || workDone.fzr == '' || workDone.jhzq === '' || $('#sxsj').val() == '' || $('#jssj').val()== '' ){
                moTaiKuang($('#myModal5'));
                $('#myModal5').find('.modal-body').html('请填写红色必填项！');
            }else{
                if(workDone.jhzq >=1 && isInteger(workDone.jhzq)){
                     var tableArr = [];
                     for(var i=0;i<_allXJSelect.length;i++){
                         var obj = {};
                         obj.ditNum = _allXJSelect[i].ditNum;
                         tableArr.push(obj);
                     };
                     var personArr = [];
                     for(var i=0;i<_zhixingRens.length;i++){
                         var obj = {};
                         obj.dipDh = _zhixingRens[i].dipDh;
                         obj.dipRen = _zhixingRens[i].dipRen;
                         obj.dipRenNum = _zhixingRens[i].dipRenNum;
                         obj.dipKeshi = workDone.xjbm;
                         personArr.push(obj);
                     }
                     var prm={
                         dipNum:workDone.jhbm,
                         dipName:workDone.xjnrmc,
                         dNum:workDone.sbbm,
                         dName:workDone.sbmc,
                         dipKeshi:workDone.xjbm,
                         manager:workDone.fzr,
                         activeDate:$('#sxsj').val(),
                         stCircle:workDone.jhzq,
                         circleUnit:workDone.zqdw,
                         remark:$('#beizhu').val(),
                         isActive:workDone.sfqy,
                         dipItems:tableArr,
                         dipMembers:personArr,
                         finishDate:$('#jssj').val(),
                         userID:_userIdName,
                     };
                     $.ajax({
                         type:'post',
                         url:_urls + 'YWDevIns/YWDIPUptPlan',
                         data:prm,
                         success:function(result){
                             if(result == 99){
                                 moTaiKuang($('#myModal5'));
                                 $('#myModal5').find('.modal-body').html('编辑成功！');
                                 conditionSelect();
                                 $('#myModal').modal('hide');
                             }
                         },
                         error:function(jqXHR, textStatus, errorThrown){
                             console.log(JSON.parse(jqXHR.responseText).message);
                             if( JSON.parse(jqXHR.responseText).message == '没有数据' ){

                             }
                         }
                     })
                }else{
                    moTaiKuang($('#myModal5'));
                    $('#myModal5').find('.modal-body').html('请填写大于1的整数间隔周期！');
                }
            }
        })
        .on('click','.dengji',function(){
            if( workDone.xjnrmc == '' || $('#sbmc') == '' || workDone.xjbm == '' || workDone.fzr == '' || workDone.jhzq === '' || $('#sxsj').val() == '' || $('#jssj').val()== ''  ){
                moTaiKuang($('#myModal5'));
                $('#myModal5').find('.modal-body').html('请填写红色必填项！');
            }else{
                if( workDone.jhzq >=1 && isInteger(workDone.jhzq) ){
                    var tableArr = [];
                    var vas = unique(_QCArr);
                    for(var i=0;i<vas.length;i++){
                        var obj = {};
                        obj.ditNum = vas[i].ditNum;
                        tableArr.push(obj);
                    };
                    var personArr = [];
                    for(var i=0;i<_zhixingRens.length;i++){
                        var obj = {};
                        obj.dipDh = _zhixingRens[i].dipDh;
                        obj.dipRen = _zhixingRens[i].dipDh;
                        obj.dipRenNum = _zhixingRens[i].dipRenNum;
                        obj.dipKeshi = workDone.xjbm;
                        personArr.push(obj);
                    }
                    var prm={
                        dipName:workDone.xjnrmc,
                        dNum:_shebeiBM,
                        dName:_shebeiMC,
                        dipKeshi:workDone.xjbm,
                        manager:workDone.fzr,
                        activeDate:$('#sxsj').val(),
                        stCircle:workDone.jhzq,
                        circleUnit:workDone.zqdw,
                        remark:$('#beizhu').val(),
                        isActive:workDone.sfqy,
                        dipItems:tableArr,
                        dipMembers:personArr,
                        finishDate:$('#jssj').val(),
                        userID:_userIdName,
                    };
                    $.ajax({
                        type:'post',
                        url:_urls + 'YWDevIns/YWDIPAddPlan',
                        data:prm,
                        success:function(result){
                            conditionSelect();
                            $('#myModal').modal('hide');
                        },
                        error:function(jqXHR, textStatus, errorThrown){
                            console.log(JSON.parse(jqXHR.responseText).message);
                            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                            }
                        }
                    })
                }else{
                    moTaiKuang($('#myModal5'));
                    $('#myModal5').find('.modal-body').html('请填写大于1的整数间隔周期！');
                }
            }
        })
        .on('click','.fenpei',function(){
            var prm = {
                dipNum:workDone.jhbm,
                dipName:workDone.xjnrmc,
                dNum:workDone.sbbm,
                dName:workDone.sbmc,
                activeDate:$('#sxsj').val(),
                finishDate:$('#jssj').val(),
                circleUnit:workDone.zqdw,
                isActive:workDone.sfqy,
                stCircle:workDone.jhzq,
                userID:_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDevIns/YWDIPAssignTask',
                data:prm,
                success:function(result){
                    if(result == 99){
                        moTaiKuang($('#myModal5'));
                        $('#myModal5').find('.modal-body').html('启动任务巡检成功！');
                        $('#myModal').modal('hide');
                        conditionSelect();
                    }

                }
            })
        })
    //删除
    $('#myModal2').on('click','.dashanchu',function(){
        var prm = {
            dipNum:$('#xjtmbm').val(),
            userID:_userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIPDelPlan',
            data:prm,
            success:function(result){
                if(result == 99){
                    conditionSelect();
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    })
    //tab选项卡
    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tabDiv = $(this).parents('.table-title').next().children('div');
        tabDiv.addClass('hide-block');
        tabDiv.eq($(this).index()).removeClass('hide-block');
        //导出按钮显示
        for( var i=0;i<$('.excelButton').children().length;i++ ){
            $('.excelButton').children().eq(i).addClass('hidding');
        };
        $('.excelButton').children().eq($(this).index()).removeClass('hidding');
        //条件查询按钮显示问题
        var $xianshi = $('.xianshi');
        if($(this).html() == '全部'){
            $xianshi.attr('disabled',false);
        }else if($(this).html() == '未分配'){
            $xianshi.attr('disabled',true);
            $xianshi.eq(2).attr('disabled',false);
        }else if( $(this).html() == '启用'){
            $xianshi.attr('disabled',true);
            $xianshi.eq(1).attr('disabled',false);
        }else if( $(this).html() == '停用'){
            $xianshi.attr('disabled',true);
            $xianshi.eq(0).attr('disabled',false);
        }
    });
    //点击选择设备名称
    $('#sbmc').click(function(){
        moTaiKuang($('#myModal3'));
        //表格中tr颜色均是白色（初始化）；
        $('#sbmcxz tbody').children('tr').removeClass('tables-hover');

    });
    //选择设备
    $('#selected1').click(function(){
        var prm = {
            'st':'',
            'et':'',
            'dName':$('.sbmc').html(),
            'spec':$('.ggxh').html(),
            'status':$('#zhuangtai').val(),
            'daNum':$('#quyu').val(),
            'ddNum':$('#bumen').val(),
            'dsNum':$('#xitong').val(),
            'dcNum':$('#leixing').val(),
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevs',
            data:prm,
            async:false,
            success:function(result){
                datasTable($('#sbmcxz'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });
    });
    //设备条目的条件选择
    $('#selecte').click(function(){
        var prm = {
            dcNum:$('#shebeileixings').val(),
            ditName:$('.filter_global').children('input').val(),
            userID:_userIdName
        };
        $.ajax({
            type:'post',
            url: _urls + 'YWDevIns/YWDIGetDIItems',
            data:prm,
            async:false,
            success:function(result){
                _allXJTMArr = [];
                for(var i=0;i<result.length;i++){

                    _allXJTMArr.push(result[i]);
                }
                datasTable(_tableAdd,result);
                //将数组中原有的数组标识出来
                var bianmaArr = [];
                for(var i=0;i<$('#zhiXingPerson tbody').children('tr').length;i++){
                    bianmaArr.push($('#zhiXingPerson tbody').children('tr').eq(i).children('.bianma').html());
                }
                for(var i=0;i<bianmaArr.length;i++){
                    for(var j=0;j<_allXJSelect.length;j++){
                        if(bianmaArr[i]==_allXJSelect[j].ditNum){
                            $('#zhiXingPerson tbody').children('tr').eq(i).css({'background':'#fbec88'});
                            $('#zhiXingPerson tbody').children('tr').eq(i).children('.checkeds').find('input').parent('span').addClass('checked');
                        }
                    }
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    });
    //启用
    $('#qiyong').click(function(){
        _selectData = [];
        yesOrNo('YWDevIns/YWDIPActivePlans',1,'请选择要启用的数据','启用操作成功！','停用状态下才可以进行启用操作！');
        flagQY = true;
    });
    $('#jinyong').click(function(){
        _selectData = [];
        yesOrNo('YWDevIns/YWDIPActivePlans',2,'请选择要停用的数据','停用操作成功！','启用状态下才可以进行停用操作！');
        flagQY = true;
    })
    $('#batchDelete').click(function(){
        _selectData = [];
        yesOrNo('YWDevIns/YWDIPDelPlans',0,'请选择要删除的数据','批量删除操作成功')
    })
    //弹窗关闭按钮
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
    //从巡检内容中选择条目
    $('.zhiXingRenYuanButton1').click(function(){
        moTaiKuang($('#myModal6'))
    })

    //巡检内容加载
    $('.zhiXingRenYuanButton1').click(function(){
        xjnrSelect()
    })
    //巡检内容条件查询
    $('#selecte1').click(function(){
        xjnrSelect()
    })
    //点击巡检条目的查看，弹出详情
    $('#myModal6').on('click','.option-seeNR',function(){
        var $thisBM = $(this).parents('tr').children('.bianma').html();
        /*for(var i=0;i<_allData.length;i++){
            if(_allData[i].dicNum == $thisBM){
                workDone1.xjnrbm = _allData[i].dicNum;
                workDone1.xjnrmc = _allData[i].dicName;
                workDone1.sbfl = _allData[i].dcNum;
            }
        }*/
        //moTaiKuang($('#myModal7'));
        var prm = {
            dicNum:$thisBM,
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIGetDICItems',
            data:prm,
            success:function(result){
                _allXJSelect = [];
                for(var i=0;i<result.length;i++){
                    _allXJSelect.push(result[i]);
                }
                datasTable($('#personTable3'),result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });
    })
    //选择巡检内容
    $('#zhiXingPerson1 tbody').on('click','tr',function(){
        _selectNRBM = $(this).children('.bianma').html();
        $('#zhiXingPerson1 tbody').children('tr').removeClass('tables-hover');
        $(this).addClass('tables-hover');
    });
    //巡检内容确定按钮
    $('.selectTableList1').click(function(){
            var prm = {
                dicNum:_selectNRBM,
                userID:_userIdName
            }
            $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIGetDICItems',
            data:prm,
            success:function(result){
                _nrArr = [];
                for(var i=0;i<result.length;i++){
                    _nrArr.push(result[i])
                }
                for(var i=0;i<_nrArr.length;i++){
                    _QCArr.push(_nrArr[i])
                }
                //去重
                var vas = unique(_QCArr);
                //放入表格中
                datasTable($('#personTable1'),vas);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });
    });
    /*--------------------------------------其他方法------------------------------------*/
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
    //根据值删除数组
    Array.prototype.removeByValue = function(val,attr) {
        for(var i=0; i<this.length; i++) {
            if(this[i][attr] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
    //条件查询
    function conditionSelect(){
        var prm={
            dNum:$('#sbfl').val(),
            dName:$('#sbmcs').val(),
            dipName:$('.filterInputs').val(),
            isActive:$('#yesNo').val(),
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIPGetPlans',
            data:prm,
            success:function(result){
                _allDataArr = [];
                _weifenpeiArr = [];
                _qiyongArr = [];
                _jinyongArr = [];
                for(var i=0;i<result.length;i++){
                    _allDataArr.push(result[i]);
                    if(result[i].isActive == 0){
                        _weifenpeiArr.push(result[i]);
                    }else if(result[i].isActive == 1){
                        _qiyongArr.push(result[i])
                    }else if(result[i].isActive == 2){
                        _jinyongArr.push(result[i])
                    }
                }
                datasTable($('#scrap-datatables'),result);
                datasTable($('#scrap-datatables1'),_weifenpeiArr);
                datasTable($('#scrap-datatables2'),_qiyongArr);
                datasTable($('#scrap-datatables3'),_jinyongArr);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    }
    //表格初始化
    function tableInit(tableId,col,fun){
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
            "columns": col,
            "rowCallback": fun
        })
    }
    //ajaxFun（select的值）
    function ajaxFun(url,allArr,select,text,num){
        var prm = {
            'userID':_userIdName
        }
        prm[text] = '';
        $.ajax({
            type:'post',
            url:_urls + url,
            async:false,
            data:prm,
            success:function(result){
                //给select赋值
                var str = '<option value="">全部</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option' + ' value="' + result[i][num] +'">' + result[i][text] + '</option>'
                    var obj = {};
                    obj.text = result[i][text];
                    obj.value = result[i][num];
                    allArr.push(result[i]);
                }
                select.append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    }
    //启用，禁用
    function yesOrNo(url,data,info,info2,info3){
        _stateArr = [];
        _selectData = _table.find('tbody').children('tr').find('.checked');
        if( _selectData.length ==0 ){
            alert(info);
        }else{
            var selectQiyongArr = [];
            for(var i=0;i<_selectData.length;i++){
                selectQiyongArr.push(_selectData.eq(i).parents('tr').children('.bianma').html());
            }

            for(var i=0;i<_allDataArr.length;i++){
                for(var j=0;j<selectQiyongArr.length;j++){
                    if(_allDataArr[i].dipNum == selectQiyongArr[j]){
                        _stateArr.push(_allDataArr[i].isActive);
                    }
                }
            }
            if(_stateArr.indexOf(data)<0){
                var prm = {
                    dipNums:selectQiyongArr,
                    isActive:data,
                    userID:_userIdName
                }
                $.ajax({
                    type:'post',
                    url:_urls + url,
                    data:prm,
                    success:function(result){
                        if(result == 99){
                            conditionSelect();
                            moTaiKuang($('#myModal5'));
                            $('#myModal5').find('.modal-body').html(info2);
                            //thead复选框不选中
                            $('.table thead').find('input').parent('span').removeClass('checked');
                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.parse(jqXHR.responseText).message);
                        if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                        }
                    }
                })
            }else{
                moTaiKuang($('#myModal5'));
                $('#myModal5').find('.modal-body').html(info3);
            }
        }
    }
    //时间格式化
    //查看/编辑赋值
    function ckOrBj(el){
        //确定按钮隐藏
        var $myModal = $('#myModal');
        moTaiKuang($myModal);
        //设置数据
        var $thisBM = el.parents('tr').children('.bianma').html();
        for(var i=0;i<_allDataArr.length;i++){
            if(_allDataArr[i].dipNum == $thisBM){
                //绑定数据
                workDone.jhbm = _allDataArr[i].dipNum;
                workDone.xjnrmc = _allDataArr[i].dipName;
                workDone.sbmc = _allDataArr[i].dName;
                workDone.sbbm = _allDataArr[i].dNum;
                workDone.xjbm = _allDataArr[i].dipKeshi;
                workDone.fzr = _allDataArr[i].manager;
                workDone.jhzq = _allDataArr[i].stCircle;
                workDone.zqdw = _allDataArr[i].circleUnit;
                workDone.sfqy = _allDataArr[i].isActive;
                $('#sxsj').val(_allDataArr[i].activeDate);
                $('#beizhu').val(_allDataArr[i].remark);
                $('#jssj').val(_allDataArr[i].finishDate);
            }
        }
        //获取巡检条目
        var prm = {
            dipNum:$thisBM,
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIPGetItemAndMembers',
            data:prm,
            success:function(result){
                _allXJSelect = [];
                _zhixingRens = [];
                for(var j=0;j<_tiaoMuArr.length;j++){
                    for(var i=0;i<result.dipItems.length;i++){
                        if( result.dipItems[i].ditNum == _tiaoMuArr[j].ditNum ){
                            _allXJSelect.push(_tiaoMuArr[j]);
                        }
                    }
                }
                for(var i=0;i<result.dipMembers.length;i++){
                    _zhixingRens.push(result.dipMembers[i]);
                }
                //找到存放所有巡检条目的数组，比较
                datasTable(_tableXJ,_allXJSelect);
                datasTable(_tableZXR,_zhixingRens);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });
    }
    //判断是不是整数
    function isInteger(obj) {
        return obj%1 === 0
    }
    //巡检内容条件查询
    function xjnrSelect(){
        var prm={
            dicName:$('#filter_global1').find('input').val(),
            dcNum:$('#shebeileixings1').val(),
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIGetDIContents',
            data:prm,
            success:function(result){
                _allData = [];
                for(var i=0;i<result.length;i++){
                    _allData.push(result[i]);
                }
                datasTable($('#zhiXingPerson1'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    }
    //数组去重
    function unique(a) {
        var res = [];

        for (var i = 0, len = a.length; i < len; i++) {
            var item = a[i];
            for (var j = 0, jLen = res.length; j < jLen; j++) {
                if (res[j].ditNum === item.ditNum)
                    break;
            }

            if (j === jLen)
                res.push(item);
        }

        return res;
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
            url:'../resource/data/worker1.json',
            success:function(result){
                //console.log(result.data);
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
    //获取所有巡检条目项目
    function getTM(){
        //获取数据
        var prm = {
            ditName:$('#shebeileixings').val(),
            dcNum:$('#filter_global').val(),
            userID:_userIdName
        };
        $.ajax({
            type:'post',
            url: _urls + 'YWDevIns/YWDIGetDIItems',
            data:prm,
            async:false,
            success:function(result){
                _allXJTMArr = [];
                for(var i=0;i<result.length;i++){
                    _allXJTMArr.push(result[i]);
                }
                datasTable(_tableAdd,result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });
    }
})