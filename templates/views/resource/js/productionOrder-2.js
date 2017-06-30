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
    //记录当前工单的状态
    var _gdState = 0;
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
            weixiukeshis:'',
            wxremark:''
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
    //记录当前工单详情有几个图
    var _imgNum = 0;
    //保存所有部门的数组
    var _departmentArr = [];
    //当前选中的部门的对象
    var _determineDeObj = {};
    //更新维修备注成功标识
    var _wxBZFlag = false;
    //更新状态成功标识
    var _upDateStateFlag = false;
    //工人状态更新成功标识
    var _workerFlag = false;
    //物料状态更新成功标识
    var _WLFlag = false;
    //标记部门是默认的还是手动选择的，如果是默认的话1，手动选择为2
    var _autoOrHand = 1;
    //保存所有设备部门的数组
    var _allDataBM = [];
    //设备部门
    ajaxFun('YWDev/ywDMGetDDsII',_allDataBM,$('#cjz'),'ddName','flag');
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
                class:'checkeds',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'工号',
                data:'userNum',
                className:'wxRen'
            },
            {
                title:'执行人员',
                data:'userName',
                className:'wxRName'
            },
            {
                title:'联系电话',
                data:'mobile',
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
            data:'userNum',
            className:'zxrnum'
        },
        {
            title:'执行人员',
            data:'userName',
            className:'zxrname'
        },
        {
            title:'职位',
            data:'pos'
        },
        {
            title:'联系电话',
            data:'mobile',
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
            _gdState = gongDanState;
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
                    _imgNum = result.hasImage;
                    workDones.wxremark = result.wxBeizhu;
                    //执行人、物料
                    //_zhixingRens = result.wxRens;
                    _zhixingRens = [];
                    for(var i=0;i<result.wxRens.length;i++){
                        var obj = {};
                        obj.userName = result.wxRens[i].wxRName;
                        obj.userNum = result.wxRens[i].wxRen;
                        obj.mobile = result.wxRens[i].wxRDh;
                        _zhixingRens.push(obj);
                    }
                    _weiXiuCaiLiao = result.wxCls;
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
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            });
            //修改
            $('#workDones').find('input').attr('disabled',true).addClass('disabled-block');
            $('#workDones').find('select').attr('disabled',true).addClass('disabled-block');
            $('#workDones').find('textarea').attr('disabled',true).addClass('disabled-block');
            $('.weixiukeshis').attr('disabled',false).removeClass('disabled-block');
            $('#wxremark').attr('disabled',false).removeClass('disabled-block');
        })

    var _personTable1 = $('#personTable1');
    //复选框点击事件
    _personTable1.find('tbody').on( 'click', 'input', function () {
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
    _personTable1.find('thead').find('input').click(function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            _personTable1.find('tbody').find('input').parents('.checker').children('span').addClass('checked');
            _personTable1.find('tbody').find('tr').addClass('tables-hover');
        }else{
            _personTable1.find('tbody').find('input').parents('.checker').children('span').removeClass('checked');
            _personTable1.find('tbody').find('tr').removeClass('tables-hover')
        }
    });
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
    /*----------------------------------按钮触发的事件-----------------------------*/
    //弹窗切换表格效果
    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tableContent = $this.parent('.table-title').next().children('.tableHover');
        tableContent.hide();
        tableContent.eq($(this).index()).show();
    });
    //查询按钮功能
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            $('#myModal4').find('.modal-body').html('起止时间不能为空');
            moTaiKuang($('#myModal4'),'flag');
        }else{
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                $('#myModal4').find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang($('#myModal4'),'flag');
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
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })
    //点击派工，切换状态
    $('.paigongButton').click(function(){
        //如果维修科室没有添加的话，出现弹出框，无法实现派工
        if(workDones.weixiukeshis == ''){
            $('#myModal4').find('.modal-body').html('请填写维修班组！');
            moTaiKuang($('#myModal4'),'flag');
        }else if(_zhixingRens.length == 0){
            $('#myModal4').find('.modal-body').html('请选择执行人员！');
            moTaiKuang($('#myModal4'),'flag');
        }else{
            //更新维修备注
            upDateWXRemark();
            //执行人添加
            Worker('YWGD/ywGDAddWxR');
            //材料添加
            if( _weiXiuCaiLiao.length >0){
                CaiLiao('YWGD/ywGDAddWxCl');
            }else{
                _WLFlag = true;
            }
            //更新状态
            upDate();
            //根据状态提示
            if( _workerFlag && _WLFlag && _wxBZFlag && _upDateStateFlag ){
                $('#myModal4').find('.modal-body').html('工单分派成功！');
                moTaiKuang($('#myModal4'),'flag');
                $('#myModal').modal('hide');
            }else{
                var str = '';
                if( _workerFlag == false ){
                    str += '执行人添加失败，'
                }else{
                    str += '执行人添加成功，'
                }
                if( _WLFlag == false ){
                    str += '维修材料添加失败，'
                }else{
                    str += '维修材料添加成功，'
                }
                if( _wxBZFlag == false ){
                    str += '维修内容修改失败，'
                }else{
                    str += '维修内容添加成功，'
                }
                if( _upDateStateFlag == false ){
                    str += '工单分派失败！'
                }else{
                    str += '工单分派成功！'
                }
                $('#myModal4').find('.modal-body').html(str);
                moTaiKuang($('#myModal4'),'flag');
                $('#myModal').modal('hide');
            }
            conditionSelect();
        }
    })
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
    //查看图片
    $('#myModal')
        .on('click','#viewImage',function(){
            if(_imgNum){
                var str = '';
                for(var i=0;i<_imgNum;i++){
                    str += '<img class="viewIMG" src="http://211.100.28.180/ApService/dimg.aspx?gdcode=' + gdCode + '&no=' + i +
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
        .on('click','.viewIMG',function(){
            moTaiKuang($('#myModal9'),'图片详情','flag');
            var imgSrc = $(this).attr('src')
            $('#myModal9').find('img').attr('src',imgSrc);
        })
    //部门选择
    $('#myModal7').on('click','.xzDepartment',function(){
        _autoOrHand = 2;
        _departmentArr = [];
        $('#tree-block').show();
        //加载部门
        getDpartment()
    })
    //选择部门确定按钮
    $('.determineDepartment').click(function(){
        $('#tree-block').hide();
    })
    //选择部门取消按钮
    $('.close-tree').click(function(){
        $('#tree-block').hide();
        _determineDeObj.pId = '';
        _determineDeObj.name = '';
        _determineDeObj.id = '';
        $('#xzmc').val('');
        $('#zxbm').val('');
    })
    //条件查询人员
    $('.zhixingButton').click(function(){
        _determineDeObj.userName = $('#zxName').val();
        _determineDeObj.userNum = $('#zxNum').val();
        getRY();
    })
    /*----------------------------------添加执行人员功能-----------------------------------*/
    //点击选择执行人员按钮
    $('.zhiXingRenYuanButton').click(function(){
        moTaiKuang($('#myModal7'));
        getDpartment();
        if(_autoOrHand == 1){
            //点击的时候获得选择的车间的bm的值
            var bm = $('#cjz').children('option:selected').attr('bm');
            var mc = '';
            //通过部门编码找部门名称
            for(var i=0;i<_departmentArr.length;i++){
                if(_departmentArr[i].id == bm){
                    mc = _departmentArr[i].name;
                }
            }
            //加载负责人数据
            $('#xzmc').val(mc);
            $('#zxbm').val(bm);
            $('#zxName').val('');
            $('#zxNum').val('');
        }else {
            if($.isEmptyObject(_determineDeObj)){
                $('#xzmc').val('');
                $('#zxbm').val('');
                $('#zxName').val('');
                $('#zxNum').val('');
            }else{
                $('#xzmc').val(_determineDeObj.name);
                $('#zxbm').val(_determineDeObj.id);
                $('#zxName').val(_determineDeObj.userName);
                $('#zxNum').val(_determineDeObj.userNum);
            }
        }
        getRY();
        var fn1 = function( row, data, index ) {
            for(var i=0;i<_zhixingRens.length;i++){
                if(data.userNum == _zhixingRens[i].userNum){
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
                if( _allZXRArr[i].userNum == bianma ){
                    if(_zhixingRens.length == 0){
                        _zhixingRens.push(_allZXRArr[i]);
                    }else{
                        var isExist = false;
                        for(var z=0;z<_zhixingRens.length;z++){
                            if(_zhixingRens[z].userNum == _allZXRArr[i].userNum){
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
            if(_zhixingRens[i].userNum == $thisBM){
                $('.zxrGH').val(_zhixingRens[i].userNum);
                $('.zxrXM').val(_zhixingRens[i].userName);
                $('.zxrDH').val(_zhixingRens[i].mobile);
            }
        }
        moTaiKuang($('#myModal8'));
    });
    //删除确定按钮
    $('.removeWorkerButton').click(function(){
        var $thisBM = $('.zxrGH').val();
        _zhixingRens.removeByValue($thisBM,'userNum');
        datasTable($('#personTable1'),_zhixingRens);
    });
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
    /*-----------------------------------------模态框位置自适应------------------------------------------*/
    //模态框自适应
    function moTaiKuang(who,flag){
        who.modal({
            show:false,
            backdrop:'static'
        })
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
             error:function(jqXHR, textStatus, errorThrown){
                 console.log(jqXHR.responseText);
             }
         })
     }
    //获取所有执行人员
    function getRY(){
        var prm = {
            "userName": $('#zxName').val(),
            "userNum": $('#zxNum').val(),
            "departNum": $('#zxbm').val(),
            "roleNum": "",
            "userID": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetUsers',
            data:prm,
            success:function(result){
                _allZXRArr =[];
                for(var i=0;i<result.length;i++){
                    _allZXRArr.push(result[i]);
                }
                datasTable($('#zhixingRenTable'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //执行人添加删除
    function Worker(url,flag){
        var best = $('#personTable1 tbody').find('.checked').parents('tr').children('.wxRen').html();
        var workerArr = [];
        for(var i=0; i<_zhixingRens.length;i++){
            var obj = {};
            if(flag){
                obj.wxClID = _zhixingRens[i].wxrID;
            }
            obj.wxRen = _zhixingRens[i].userNum;
            obj.wxRName = _zhixingRens[i].userName;
            obj.wxRDh = _zhixingRens[i].mobile;
            obj.gdCode = gdCode;
            if(_zhixingRens[i].userNum == best){
                obj.wxRQZ = 1;
            }else{
                obj.wxRQZ = 0;
            }
            workerArr.push(obj);
        }
        var gdWR = {
            gdCode :gdCode,
            gdWxRs:workerArr,
            userID:_userIdName
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
            cailiaoArr.push(obj);
        }
        var gdWxCl = {
            gdCode:gdCode,
            gdWxCls:cailiaoArr,
            userID:_userIdName
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
    //获取部门数据
    function getDpartment(){
        var prm = {
            "departName":"",
            "userID": "mch"
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            async:false,
            success:function(result){
                for(var i=0;i<result.length;i++){
                    var obj = {};
                    obj.id = result[i].departNum;
                    obj.pId = result[i].parentNum;
                    obj.name = result[i].departName;
                    if(obj.pId == ''){
                        obj.open = true;
                    }
                    _departmentArr.push(obj);
                }
                departmentTree();
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
             }
        })
    }
    //ztree树
    function departmentTree(){
        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "s", "N": "ps" },
                radioType:'all'
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{
                showIcon:false
            },
            callback: {
                onClick: function(e,treeId,treeNode){
                    //取消全部打钩的节点
                    zTreeObj.checkNode(treeNode,!treeNode.checked,true);
                    //输出选中节点
                    var selectedNode = zTreeObj.getSelectedNodes();
                    for(var i=0;i<selectedNode.length;i++){
                        _determineDeObj.pId = selectedNode[i].pId;
                        _determineDeObj.name = selectedNode[i].name;
                        _determineDeObj.id = selectedNode[i].id;
                    }
                    $('#xzmc').val(_determineDeObj.name);
                    $('#zxbm').val(_determineDeObj.id);
                },
            }
        };
        var zTreeObj = $.fn.zTree.init($("#deparmentTree"), setting, _departmentArr);

    }
    //更新维修备注
    function upDateWXRemark(){
        var prm = {
            "gdCode": gdCode,
            "gdZht": _gdState,
            "wxKeshi": '',
            "wxBeizhu": workDones.wxremark,
            "userID": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptWxBeizhu',
            data:prm,
            async:false,
            success:function(result){
                if(result == 99){
                    _wxBZFlag = true;
                }else{
                    _wxBZFlag = false;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //跟新状态
    function upDate(){
        var gdInfo = {
            'gdCode':gdCode,
            'gdZht':3,
            'wxKeshi':workDones.weixiukeshis,
            'userID':_userIdName
        }
        $.ajax({
            url:_urls + 'YWGD/ywGDUptPaig',
            type:'post',
            data:gdInfo,
            async:false,
            success:function(result){
                if(result == 99){
                    _upDateStateFlag = true;
                }else{
                    _upDateStateFlag = false;
                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
             }
        })
    }
    //获取所有设备部门
    //ajaxFun（select的值）
    function ajaxFun(url,allArr,select,text,flag){
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
                var str = '';
                if(flag){
                    for(var i=0;i<result.length;i++){
                        str += '<option' + ' value="' + result[i][text] +'"' + 'bm="' + result[i].departNum +
                            '">' + result[i][text] + '</option>'
                        allArr.push(result[i]);
                    }
                }else{
                    for(var i=0;i<result.length;i++){
                        str += '<option' + ' value="' + result[i][text] +'">' + result[i][text] + '</option>'
                        allArr.push(result[i]);
                    }
                }
                select.append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
})