$(function(){
    /*---------------------------------------------时间---------------------------------------------------*/

    //时间设置
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间（7天）
    var et = moment().format('YYYY/MM/DD');

    var st =moment().subtract(7,'d').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(st);

    $('.datatimeblock').eq(1).val(et);

    /*--------------------------------------------变量----------------------------------------------------*/
    //登记vue变量
    var gdObj = new Vue({
        el:'#myApp33',
        data:{
            'gdtype':'1',
            'xttype':'1',
            'bxtel':'',
            'bxkesh':'',
            'bxren':'',
            'pointer':'',
            'gztime':'',
            'sbtype':'',
            'sbnum':'',
            'sbname':'',
            'azplace':'',
            'gzplace':'',
            'wxshx':'',
            'wxbz':'',
            'wxcontent':''
        },
        methods:{
            time:function(){
                _timeHMSComponentsFun($('.datatimeblock').eq(2),1);
            },
            timeblur:function(){
                setTimeout(function(){
                    $('.datepicker').hide();
                },200)
            },
        }
    });

    //验证vue非空（空格不算）
    Vue.validator('isEmpty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val = val.replace(/^\s+|\s+$/g, '');
        return /[^.\s]{1,500}$/.test(val)
    });

    //添加材料vue
    var clObj = new Vue({
        el:'#goods',
        data:{
            'mc':'',
            'bm':'',
            'dw':'',
            'sl':'',
            'dj':'',
            'je':''
        },
        methods:{
            addFun1:function(){
                var mny = /^[0-9]*[1-9][0-9]*$/;
                if(clObj.sl != 0){
                    if(mny.test(clObj.sl)){
                        $('.errorSL').hide();
                        //如果单价有数，自动计算总价
                        if(clObj.dj > 0){
                            var amount = Number(clObj.dj) * Number(clObj.sl);
                            clObj.je = amount.toFixed(2);
                            $('.errorJE').hide();
                        }
                    }else{
                        $('.errorSL').show();
                    }
                }else{
                    $('.errorSL').show();
                }
            },
            addFun2:function(){
                var mny = /^((?:-?0)|(?:-?[1-9]\d*))(?:\.\d{1,2})?$/;
                if(clObj.dj != '' && clObj.dj != 0){
                    if( mny.test(clObj.dj) ){
                        $('.errorDJ').hide();
                        //如果单价有数，自动计算总价
                        if(clObj.sl > 0){
                            var amount = Number(clObj.dj) * Number(clObj.sl);
                            clObj.je = amount.toFixed(2);
                            $('.errorJE').hide();
                        }
                    }else{
                        $('.errorDJ').show();
                    }
                }else{
                    $('.errorDJ').show();
                }
            },
            addFun3:function(){
                var mny = /^((?:-?0)|(?:-?[1-9]\d*))(?:\.\d{1,2})?$/;
                if(clObj.je != '' && clObj.je != 0){
                    if( mny.test(clObj.je) ){
                        $('.errorJE').hide();
                        //根据总金额得出单价
                        var danjia =  Number(clObj.je)/Number(clObj.sl);
                        clObj.dj = danjia.toFixed(2);
                    }else{
                        $('.errorJE').show();
                    }
                }else{
                    $('.errorJE').show();
                }
            }
        }
    })

    //标记当前打开的是不是登记按钮
    var _isDeng = false;

    //执行人数组
    var _fzrArr = [];

    //存放报修科室数组
    var _allBXArr = [];

    //存放系统类型数组
    var _allXTArr = [];

    //选中的备件对象
    var _bjObject = {};

    //存放当前工单号
    var _gdCode = '';

    //记录当前状态值
    var _gdZht = '';

    //记录当前
    var _gdCircle = '';

    //所有部门
    var _departArr = [];

    //存放所有材料数组
    var _allWLArr = [];

    //维修事项（车站）
    bxKShiData();
    //ksAndBm('YWDev/ywDMGetDDsII', _allBXArr, $('#bxkesh'), 'ddName', 'ddNum');

    //系统类型
    ajaxFun('YWDev/ywDMGetDSs', _allXTArr, $('#sbtype'), 'dsName', 'dsNum');

    //获取所有部门
    //getDpartment();

    //暂存选中备件的数组
    var _selectedBJ = [];

    //总费用
    var _totalFree = 0;

    //添加材料是否完成
    var _clIsComplete = false;

    //添加材料是否成功
    var _clIsSuccess = false;

    //申请关闭是否完成
    var _gbIsComplete = false;

    //申请关闭是否成功
    var _gbIsSuccess = false;

    /*-------------------------------------------------按钮事件-----------------------------------------*/

    //tab切换
    $('.table-title span').click(function(){

        var $this = $(this);

        $this.parent('.table-title').children('span').removeClass('spanhover');

        $this.addClass('spanhover');

        var tabDiv = $(this).parents('.table-title').next().children('div');

        tabDiv.addClass('hide-block');

        tabDiv.eq($(this).index()).removeClass('hide-block');

    });

    //登记按钮
    $('.creatButton').click(function(){

        _isDeng = true;

        //显示模态框
        _moTaiKuang($('#myModal'), '登记', '', '' ,'', '登记');

        //增加登记类
        $('#myModal').find('.btn-primary').removeClass('jiedan').addClass('dengji');

        //选择部门不显示
        $('.bumen').hide();

        //维修班组不显示
        $('.autoFile').hide();

        //初始化
        dataInit();
    });

    //点击登记模态框显示的回调函数
    $('#myModal').on('shown.bs.modal', function () {

        if(_isDeng){
            //让日历插件首先失去焦点
            $('.datatimeblock').eq(2).focus();

            //发生时间默认
            var aa = moment().format('YYYY-MM-DD HH:mm:ss');

            $('.datatimeblock').eq(2).val(aa);

            if($('.datetimepicker:visible')){

                $('.datetimepicker').hide();

            }

            $('.datatimeblock').eq(2).blur();

            //获取维修人员信息

            var obj = {};

            obj.userNum = _userIdNum;

            obj.userName = _userIdName;

            obj.mobile = '';

            _fzrArr.length = 0;

            _fzrArr.push(obj);

            _datasTable($('#fzr-list'),_fzrArr);

            //复选框自动点击一下
            $('#fzr-list tbody').find('.checker').find('input').click();
        }

        _isDeng = false;
    });

    //登记确定按钮
    $('#myModal').on('click','.dengji',function(){
        //验证必填项
        if(gdObj.bxtel == ''|| gdObj.bxkesh == '' || gdObj.bxren == '' || gdObj.gzplace == '' || gdObj.wxshx == '' || gdObj.wxcontent == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

        }else{
            //工单维修人
            var arr = [];
            var obj = {};
            obj.wxRen = _fzrArr[0].userNum;
            obj.wxRName = _fzrArr[0].userName;
            obj.wxRDh = _fzrArr[0].mobile;
            arr.push(obj);

            //登记
            var prm = {
                'gdJJ':gdObj.gdtype,
                'gdRange':gdObj.xttype,
                'bxDianhua':gdObj.bxtel,
                'bxKeshi':$('#bxkesh').children('option:selected').html(),
                'bxKeshiNum':gdObj.bxkesh,
                'bxRen':gdObj.bxren,
                //'':gdObj.pointer,
                'gdFsShij':$('.datatimeblock').eq(2).val(),
                'wxShiX':gdObj.wxshx,
                'wxShiXNum':'1',
                'wxShebei':gdObj.sbnum,
                'dName':gdObj.sbname,
                'installAddress':gdObj.azplace,
                'wxDidian':gdObj.gzplace,
                'bxBeizhu':$('.gzDesc').val(),
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'gdSrc': 1,
                'gdZht':6,
                'wxKeshi':_userBM,
                'wxBeizhu':gdObj.wxcontent,
                'gdWxRs':arr,
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDCreQuickDJ',
                data:prm,
                timeout:_theTimes,
                success:function(result){
                    //console.log(result);
                    if(result == 99){

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'快速登记成功！', '');

                        $('#myModal').modal('hide');

                        conditionSelect();

                    }else{
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'快速登记失败！', '');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }
            })

        }
    });

    //表格复选框点击事件
    $('#fzr-list').on('click','input',function(){

        if($(this).parent('.checked').length == 0){
            //console.log('没有选中');
            $(this).parent('span').addClass('checked');
            $(this).parents('tr').addClass('tables-hover');
        }else{
            //console.log('选中');
            $(this).parent('span').removeClass('checked');
            $(this).parents('tr').removeClass('tables-hover');
        }
    });

    //查询
    $('#selected').click(function(){
        conditionSelect();
    })

    //重置
    $('.resites').click(function(){

        //input清空
        $('.filterInput').val('');

        //时间重置
        $('.datatimeblock').eq(0).val(st);

        $('.datatimeblock').eq(1).val(et);
    })

    //关单
    $('#waiting-list').on('click','.option-close',function(){

        //确定工单号
        _gdCode = $(this).parents('tr').children('.gdCode').children('span').html();

        //模态框显示
        _moTaiKuang($('#myModal'), '关闭申请', '', '' ,'', '关闭申请');

        //添加类名
        $('#myModal').find('.btn-primary').removeClass('dengji').addClass('closeGD');

        //绑定信息
        bindData($(this),$('#waiting-list'));

    })

    //添加材料按钮
    $('.addCL').click(function(){

        //模态框显示
        _moTaiKuang($('#myModal1'), '添加材料', '', '' ,'', '添加材料');

        //表格数据
        _datasTable($('#cl-selecting'),_selectedBJ);

        //初始化
        clInit();

        //所有提示信息隐藏
        $('.errorJE').hide();

        $('.errorDJ').hide();

        $('.errorSL').hide();

    })

    //选择材料
    $('.selectCL').click(function(){

        //模态框显示
        _moTaiKuang($('#myModal5'), '选择材料', '', '' ,'', '确定');

    })

    //选择材料条件搜索
    $('.tianJiaSelect').click(function(){

        ClListData();

    });

    //选择材料点击事件
    $('#weiXiuCaiLiaoTable tbody').on('click','tr',function(){
        var $this = $(this);
        var tableTr = $this.parents('.table').find('tr');
        tableTr.css('background','#ffffff');
        $this.css('background','#FBEC88');
        _bjObject.flmc = $this.children('.flmc').html();
        _bjObject.wpbm = $this.children('.wlbm').html();
        _bjObject.wpmc = $this.children('.wlmc').html();
        _bjObject.size = $this.children('.size').html();
        _bjObject.unit = $this.children('.unit').html();
    });

    //选择材料点击事件的确定按钮
    $('.addWL').click(function(){

        //赋值
        clObj.mc = _bjObject.wpmc;
        clObj.bm = _bjObject.wpbm;
        clObj.dw = _bjObject.unit;
        clObj.sl = '';
        clObj.dj = '';
        clObj.je = '';

        //模态框关闭
        $('#myModal5').modal('hide');
    })

    //添加材料【添加】按钮
    $('#addRK').click(function(){
        if(clObj.mc == '' || clObj.bm == '' || clObj.sl == '' ){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

        }else{
            var obj = {};
            obj.mc = clObj.mc;
            obj.bm = clObj.bm;
            obj.dw = clObj.dw;
            obj.sl = clObj.sl;
            var dj = parseFloat(clObj.dj);
            obj.dj = dj.toFixed(2);
            var je = parseFloat(clObj.je);
            obj.je = je.toFixed(2);
            _selectedBJ.unshift(obj);
            _datasTable($('#cl-selecting'),_selectedBJ);
            //添加之后初始化
            clInit();
        }

    })

    //添加材料【重置】按钮
    $('#addReset').click(function(){
        clInit();
    })

    //添加材料编辑按钮
    $('#cl-selecting')

        .on('click','.option-bianji',function(){

            //样式
            $('#cl-selecting tbody').children('tr').removeClass('tables-hover');

            $(this).parents('tr').addClass('tables-hover');

            //类名
            $(this).html('保存');

            $(this).removeClass('option-bianji').addClass('option-save');

            //将表格中的值赋给input框
            var $thisBM = $(this).parents('tr').find('.bjbm').html();

            for(var i=0;i<_selectedBJ.length;i++){
                if(_selectedBJ[i].bm == $thisBM){
                    clObj.mc = _selectedBJ[i].mc;
                    clObj.bm = _selectedBJ[i].bm;
                    clObj.dw = _selectedBJ[i].dw;
                    clObj.sl = _selectedBJ[i].sl;
                    clObj.dj = _selectedBJ[i].dj;
                    clObj.je = _selectedBJ[i].je;
                }
            }

            //名称和编码不能修改
            $('.no-edit').attr('disabled',true);
        })

        .on('click','.option-save',function(){

            //样式
            $('#cl-selecting tbody').children('tr').removeClass('tables-hover');

            $(this).parents('tr').addClass('tables-hover');

            //类名
            $(this).html('保存');

            $(this).removeClass('option-save').addClass('option-bianji');

            //将修改的值给了_selectedBJ中
            for(var i=0;i<_selectedBJ.length;i++){
                if(clObj.bm == _selectedBJ[i].bm){
                    _selectedBJ[i].sl = clObj.sl;
                    _selectedBJ[i].dj = clObj.dj;
                    _selectedBJ[i].je = clObj.je;
                }
            }

            _datasTable($('#cl-selecting'),_selectedBJ);

            //初始化
            clInit();

        })

        .on('click','.option-shanchu',function(){

            var value = $(this).parents('tr').children('.bjbm').html();

            _selectedBJ.removeByValue(value,'bm');

            _datasTable($('#cl-selecting'),_selectedBJ);

        })

    //选中的材料
    $('#appendTo').click(function(){

        $('#myModal1').modal('hide');

        _datasTable($('#cl-list'),_selectedBJ);

        //计算共计费用
        for(var i=0;i<_selectedBJ.length;i++){
            _totalFree += parseFloat(_selectedBJ[i].je);
        }

        $('#total').val(_totalFree.toFixed(2));
    })

    //外层材料选择删除
    $('#cl-list').on('click','.option-outshanchu',function(){

        var value = $(this).parents('tr').children('.bjbm').html();

        _selectedBJ.removeByValue(value,'bm');

        _datasTable($('#cl-list'),_selectedBJ);

        _totalFree = 0;

        //再次计算合计金额
        for(var i=0;i<_selectedBJ.length;i++){

            _totalFree += parseFloat(_selectedBJ[i].je);
        }

        $('#total').val(_totalFree.toFixed(2));

    });

    //填写工时费，自动计算合计金额
    $('#hourFee').keyup(function(){


       var free = Number($('#hourFee').val()) + Number(_totalFree);


        $('#total').val(free.toFixed(2));
    })

    //申请关单
    $('#myModal').on('click','.closeGD',function(){

        //申请
        closingApplication();

        if(_selectedBJ.length != 0){
            //材料
            addCL();
        }

    })

    //历史工单
    $('#in-execution').on('click','.option-see',function(){

        //绑定数据
        bindData($(this),$('#in-execution'));

        //模态框
        _moTaiKuang($('#myModal'), '查看详情', 'flag', '' ,'', '');

    })




    /*------------------------------------------------表格初始化------------------------------------------*/

    //待受理表格
    var waitingListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '"' + 'data-circle="' + full.gdCircle +
                    '"' +
                    '>' + data
                '</span>'
            }
        },
        {
            title:'工单类型',
            data:'gdJJ',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '普通'
                }else{
                    return '快速'
                }
            }
        },
        {
            title:'设备类型',
            data:'wxShiX'
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
            title:'登记时间',
            data:'gdShij'
        },
        {
            title:'受理时间',
            data:'shouLiShij'
        },
        {
            title:'接单时间',
            data:'jiedanShij'
        },
        {
            title:'维修科室',
            data:'wxKeshi'
        },
        {
            title:'处理人',
            data:'wxUserNames'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-close btn default btn-xs green-stripe'>关单申请</span>"
        }
    ];

    _tableInit($('#waiting-list'),waitingListCol,'2','','','');

    //历史表格
    var inExecutionCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '"' + 'data-circle="' + full.gdCircle +
                    '"' +
                    '>' + data
                '</span>'
            }
        },
        {
            title:'工单类型',
            data:'gdJJ',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '普通'
                }else{
                    return '快速'
                }
            }
        },
        {
            title:'设备类型',
            data:'wxShiX'
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
            title:'登记时间',
            data:'gdShij'
        },
        {
            title:'受理时间',
            data:'shouLiShij'
        },
        {
            title:'接单时间',
            data:'jiedanShij'
        },
        {
            title:'维修科室',
            data:'wxKeshi'
        },
        {
            title:'处理人',
            data:'wxUserNames'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
        }
    ];

    _tableInit($('#in-execution'),inExecutionCol,'2','','','');

    //执行人表格
    var fzrListCol = [
        {
            className:'checkeds',
            data:null,
            defaultContent:"<div class='checker'><span class=''><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'userNum',
            className:'workNum'
        },
        {
            title:'执行人名称',
            data:'userName'
        },
        //{
        //    title:'职位',
        //    data:'pos'
        //},
        {
            title:'联系电话',
            data:'mobile'
        }
    ];

    _tableInit($('#fzr-list'),fzrListCol,'2','','','');

    //材料列表
    var clListCol = [
        {
            title:'名称',
            data:'mc'
        },
        {
            title:'备件编码',
            data:'bm',
            className:'bjbm'
        },
        {
            title:'单位',
            data:'dw'
        },
        {
            title:'数量',
            data:'sl'
        },
        {
            title:'单价（元）',
            data:'dj'
        },
        {
            title:'金额（元）',
            data:'je'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-bianji btn default btn-xs green-stripe'>编辑</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"
        }
    ];

    _tableInit($('#cl-selecting'),clListCol,'2','','','');

    //外层材料列表
    var outClListCol = [
        {
            title:'名称',
            data:'mc'
        },
        {
            title:'备件编码',
            data:'bm',
            className:'bjbm'
        },
        {
            title:'单位',
            data:'dw'
        },
        {
            title:'数量',
            data:'sl'
        },
        {
            title:'单价（元）',
            data:'dj'
        },
        {
            title:'金额（元）',
            data:'je'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-outshanchu btn default btn-xs green-stripe'>删除</span>"
        }
    ];

    _tableInit($('#cl-list'),outClListCol,'2','','','');

    //材料选择列表
    var clSelectList =  [
        {
            title:'分类名称',
            data:'cateName',
            className:'flmc'
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
        },
        {
            title:'型号',
            data:'size',
            className:'size'
        },
        {
            title:'单位',
            data:'unitName',
            className:'unit'
        }
    ];

    _tableInit($('#weiXiuCaiLiaoTable'),clSelectList,'2','','','');

    //数据
    conditionSelect();

    //物品列表
    ClListData();

    //验收人
    //receiverData();

    /*------------------------------------------------其他方法--------------------------------------------*/
    //初始化
    function dataInit(){
        gdObj.gdtype = '0';
        gdObj.xttype = '1';
        gdObj.bxtel = '';
        gdObj.bxkesh = '';
        gdObj.bxren = '';
        gdObj.pointer = '';
        gdObj.gztime = '';
        gdObj.sbtype = '';
        gdObj.sbnum = '';
        gdObj.sbname = '';
        gdObj.azplace = '';
        gdObj.gzplace = '';
        gdObj.wxshx = '';
        gdObj.wxbz = '';
        gdObj.wxcontent = ''
        $('.gzDesc').val('');
    };

    //选材料初始化
    function clInit(){
        clObj.mc='';
        clObj.bm='';
        clObj.dw='';
        clObj.sl='';
        clObj.dj='';
        clObj.je='';
        $('.no-edit').attr('disabled',false);
    }

    //条件查询
    function conditionSelect(){
        var st = $('.min').val();

        var et = moment($('.max').val()).add(1,'d').format('YYYY/MM/DD');

        var prm = {
            'gdCode':$('.filterInput').val(),
            'gdSt':st,
            'gdEt':et,
            'userID': _userIdNum,
            'userName': _userIdName,
            'b_UserRole':_userRole,
            'wxRenId':_userIdNum
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDJ',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                //根据状态值给表格赋值
                var zht4=[],zht=[];
                for(var i=0;i<result.length;i++){
                    if(result[i].gdZht == 4){
                        zht4.push(result[i]);
                    }else{
                        zht.push(result[i]);
                    }
                }
                //执行中
                _datasTable($('#waiting-list'),zht4);
                //历史
                _datasTable($('#in-execution'),zht);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //车站数据(报修科室)
    function ajaxFun(url, allArr, select, text, num) {
        var prm = {
            'userID': _userIdNum
        }
        prm[text] = '';
        $.ajax({
            type: 'post',
            url: _urls + url,
            timeout:30000,
            data: prm,
            success: function (result) {
                //给select赋值
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < result.length; i++) {
                    str += '<option' + ' value="' + result[i][num] + '">' + result[i][text] + '</option>'
                    allArr.push(result[i]);
                }
                select.empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //报修科室与部门联动
    function ksAndBm(url, allArr, select, text, num){
        var prm = {
            'userID': _userIdNum
        }
        prm[text] = '';
        $.ajax({
            type: 'post',
            url: _urls + url,
            timeout:30000,
            data: prm,
            success: function (result) {
                //给select赋值
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < result.length; i++) {
                    str += '<option' + ' value="' + result[i][num] + '"data-num=' + result[i]['departNum'] +'>' + result[i][text] + '</option>'
                    allArr.push(result[i]);
                }
                select.empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //绑定信息
    function bindData(num,tableId){
        //样式
        tableId.children('tbody').children('tr').removeClass('tables-hover');

        num.parents('tr').addClass('tables-hover');

        _gdCode = num.parents('tr').children('.gdCode').children('span').html();

        _gdZht = num.parents('tr').children('.gdCode').children('span').attr('data-zht');

        _gdCircle = num.parents('tr').children('.gdCode').children('span').attr('data-circle');

        //请求数据
        var prm = {
            'gdCode':num.parents('tr').children('.gdCode').children('span').html(),
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            'gdCircle':num.parents('tr').children('.gdCode').children('span').attr('data-circle'),
            'gdZht':num.parents('tr').children('.gdCode').children('span').attr('data-zht')
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                //赋值
                gdObj.bxtel = result.bxDianhua;
                gdObj.bxkesh = result.bxKeshiNum;
                gdObj.bxren = result.bxRen;
                //gdObj.pointer = '';
                gdObj.gztime = result.gdFsShij;
                gdObj.gzplace = result.wxDidian;
                gdObj.wxshx=result.wxXm;
                //gdObj.sbtype = result.
                gdObj.sbnum = result.wxShebei;
                gdObj.sbname = result.dName;
                gdObj.azplace = result.installAddress;
                $('.gzDesc').val(result.bxBeizhu);

                //执行人信息
                var arr = [];
                for(var i=0;i<result.wxRens.length;i++){
                    var obj = {};
                    obj.userNum = result.wxRens[i].wxRen;
                    obj.userName = result.wxRens[i].wxRName;
                    obj.mobile = result.wxRens[i].wxRDh;
                    arr.push(obj);
                }
                _datasTable($('#fzr-list'),arr);

                //验收人
                receiverData(gdObj.bxkesh);

                //绑定部门信息
                $('#depart').val(result.wxKeshiNum);

                //维修班组
                $('#wxbz').val($('#depart').children('option:selected').html());

                $('#wxbz').attr('data-bm',result.wxKeshiNum);

                //物料详情
                //if(){
                //
                //}

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有部门
    //function getDpartment(){
    //    var prm = {
    //        'departName':'',
    //        'userID':_userIdNum,
    //        'userName':_userIdName
    //    }
    //    $.ajax({
    //        type:'post',
    //        url:_urls + 'RBAC/rbacGetDeparts',
    //        data:prm,
    //        timeout:_theTimes,
    //        success:function(result){
    //
    //            _departArr.length = 0;
    //
    //            for(var i=0;i<result.length;i++){
    //                _departArr.push(result[i]);
    //            }
    //        },
    //        error: function (jqXHR, textStatus, errorThrown) {
    //            console.log(jqXHR.responseText);
    //        }
    //    })
    //}

    //获取所有物品列表
    function ClListData(){
        var prm = {
            itemNum : $.trim($('#wpbms').val()),
            itemName: $.trim($('#wpmcs').val()),
            cateName: $.trim($('#flmcs').val()),
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            data:prm,
            success:function(result){
                _allWLArr.length = 0;
                for(var i=0;i<result.length;i++){
                    _allWLArr.push(result[i]);
                }
                _datasTable($('#weiXiuCaiLiaoTable'),result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //添加物料方法
    function addCL(){
        var arr = [];
        for(var i=0;i<_selectedBJ.length;i++){
            var obj = {};
            obj.wxCl = _selectedBJ[i].bm;
            obj.wxClName = _selectedBJ[i].mc;
            obj.clShul = _selectedBJ[i].sl;
            obj.wxClPrice = _selectedBJ[i].dj;
            obj.wxClAmount = _selectedBJ[i].je;
            obj.gdCode = _gdCode;
            arr.push(obj);
        }

        var prm = {
            gdCode:_gdCode,
            gdWxCls:arr,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDAddWxCl',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _clIsComplete = true;

                if(result == 99){

                    _clIsSuccess = true;

                }else{
                    _clIsSuccess = false;
                }

                isComplete();
            },
            error:function(jqXHR, textStatus, errorThrown){

                _clIsComplete = true;

                console.log(jqXHR.responseText);
            }
        })
    }

    //关单申请
    function closingApplication(){
        var prm = {
            gdCode:_gdCode,
            gdZht:6,
            wxBeizhu:gdObj.weixiuBZ,
            yanShouRen:$('#receiver').val(),
            yanShouRenName:$('#receiver').children('option:selected').html(),
            gdFee:$('#total').val(),
            gongShiFee:$('#hourFee').val(),
            userID:_userIdName,
            userName:_userIdNum,
            b_UserRole:_userRole
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDReqWang',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _gbIsComplete = true;

                if(result==99){

                    _gbIsSuccess = true;

                }else{

                    _gbIsSuccess = false;

                }

                isComplete();
            },
            error:function(jqXHR, textStatus, errorThrown){

                _gbIsComplete = true;

                console.log(jqXHR.responseText);

            }
        })
    }

    //判断添加物品和关单申请是否完成
    function isComplete(){
        if( _clIsComplete && _gbIsComplete ){

            if( _clIsSuccess && _gbIsSuccess ){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'添加物品成功！关单申请成功！', '');

                conditionSelect();

                $('#myModal').modal('hide');

            }else{

                var str = '';

                if( _clIsSuccess ){

                    str += '添加物品成功！'

                }else{

                    str += '添加物品失败！'

                }
                if( _gbIsSuccess ){

                    str += '关单申请成功！'
                }else{

                    str += '全单申请失败！'
                }

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,str, '');
            }
        }
    }

    //验收人
    function receiverData(data){
        var prm = {
            userId:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
            departNum:data
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetYanShouRen',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                //console.log(result);
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){

                }
                $('#receiver').empty().append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);

            }
        })
    }

    //保修科室
    function bxKShiData(){
        var prm = {
            'departName':'',
            'userID':_userIdNum,
            'userName':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                _allBXArr.length = 0;
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){

                    _allBXArr.push(result[i]);

                    str += '<option value="' + result[i].departNum +
                        '">' + result[i].departName + '</option>>';
                }

                $('#bxkesh').empty().append(str);

                $('#depart').empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }


})