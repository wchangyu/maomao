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
            'gdtype':'0',
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
            'wxshx':''
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

    //存放报修科室
    var _allBXArr = [];

    //存放系统类型
    var _allXTArr = [];

    //维修事项（车站）
    bxKShiData();
    //ajaxFun('YWDev/ywDMGetDDs', _allBXArr, $('#bxkesh'), 'ddName', 'ddNum');

    //系统类型
    ajaxFun('YWDev/ywDMGetDSs', _allXTArr, $('#sbtype'), 'dsName', 'dsNum');

    //当前选中的工单号
    var _gdCode = '';

    //当前工单状态值
    var _gdZht = '';


    //标记当前打开的是不是登记按钮
    var _isDeng = false;

    //记录当前评价的值
    var _pjValue = 5    ;


    /*---------------------------------------------表格初始化----------------------------------------------*/

    //未接单表格
    var missedListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        {
            title:'报修电话',
            data:'bxDianhua'
        },
        {
            title:'报修科室',
            data:'bxKeshi'
        },
        {
            title:'报修人',
            data:'bxRen'
        },
        //{
        //    title:'楼栋',
        //    data:''
        //},
        {
            title:'故障发生时间',
            data:'gdFsShij'
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
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span><span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>"
        }
    ];

    _tableInit($('#missed-list'),missedListCol,'2','','','');

    //执行中表格
    var inExecutionCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '">' + data
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

    //待关单表格
    var waitingListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '">' + data
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
            title:'完工申请时间',
            data:'wanGongShij'
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
            title:'验收人',
            data:'pjRen'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-close btn default btn-xs green-stripe'>关单</span>"
        }
    ];

    _tableInit($('#waiting-list'),waitingListCol,'2','','','');

    //已关单
    var closingListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '">' + data
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
            title:'完工申请时间',
            data:'wanGongShij'
        },
        {
            title:'关单时间',
            data:'guanbiShij'
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
            title:'验收人',
            data:'pjRen'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
        }
    ];

    _tableInit($('#closing-list'),closingListCol,'2','','','');

    //执行人列表
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

    //材料表格
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

    //数据加载
    conditionSelect();

    /*-------------------------------------------------按钮事件-----------------------------------------*/

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
        $('#myModal').find('.btn-primary').removeClass('bianji').addClass('dengji');

        //初始化
        dataInit();
    });

    //重置按钮
    $('.resites').click(function(){

        //input清空
        $('.filterInput').val('');

        //时间重置
        $('.datatimeblock').eq(0).val(st);

        $('.datatimeblock').eq(1).val(et);
    })

    //模态框加载完成后设置发生时间
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
        }

        _isDeng = false;
    });

    //故障原因选择
    $('#gzDesc').change(function(){
        var aa = $('#gzDesc').val();
        $('.gzDesc').val(aa);
        //$('.gzDesc').val($('#gzDesc').val());
    })


    //登记确定按钮
    $('#myModal')
        .on('click','.dengji',function(){

            optionData('YWGD/ywGDCreDJ','添加成功!','添加失败!','');
        })
        .on('click','.bianji',function(){

            optionData('YWGD/ywGDUpt','编辑成功!','编辑失败!','flag');
        })

    //表格查看按钮
    $('#missed-list')
        .on('click','.option-see',function(){
            //当前选中的工单号
            _gdCode = $(this).parents('tr').children('.gdCode').children('span').children('a').html();
            //信息绑定
            bindData($(this),$('#missed-list'));
            //模态框显示
            _moTaiKuang($('#myModal'), '详情', 'flag', '' ,'', '');
        })
        .on('click','.option-edit',function(){
            //当前选中的工单号

            _gdCode = $(this).parents('tr').children('.gdCode').children('span').children('a').html();

            //信息绑定
            bindData($(this),$('#missed-list'));
            //模态框显示
            _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');
            //添加编辑类
            $('#myModal').find('.btn-primary').removeClass('dengji').addClass('bianji');
        })

    //查询按钮
    $('#selected').click(function(){
        //条件查询
        conditionSelect();
    })

    //执行中【查看】
    $('#in-execution').on('click','.option-see',function(){

        //绑定数据
        bindData($(this),$('#in-execution'));

        //模态框
        _moTaiKuang($('#myModal'), '查看详情', 'flag', '' ,'', '');

    })

    //待关单【关单】
    $('#waiting-list').on('click','.option-close',function(){

        _gdCode = $(this).parents('tr').children('.gdCode').children('span').html();


        _gdZht = $(this).parents('tr').children('.gdCode').children('span').attr('data-zht');

        //绑定数据



        //模态框
        _moTaiKuang($('#myModal1'), '关单', 'flag', '' ,'', '');

        //添加两个按钮
        var str = '<button class="btn btn-primary shensu">申诉</button><button class="btn btn-primary guanbi">关单</button>';

        $('#myModal1').find('.modal-footer').prepend(str);

    })

    //评价单选按钮
    $('.pjRadio').click(function(){

        $('.pjRadio').parent('span').removeClass('checked');

        $(this).parent('span').addClass('checked');

        _pjValue = $('#pingjia1').find('.checked').children('input').attr('data-attr');

    });

    //申诉
    $('#myModal1').on('click','.shensu',function(){
        var prm = {
            gdCode:_gdCode,
            gdZht:11,
            userID:_userIdNum,
            userName:_userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
            timeout:_theTimes,
            data:prm,
            success:function(result){
                if(result == 99){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'申诉成功！', '');

                    conditionSelect();

                    $('#myModal1').modal('hide');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'申诉失败！', '');

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    })

    //关单
    $('#myModal1').on('click','.guanbi',function(){

        var prm = {
            'gdCode':_gdCode,
            'pjBz': $('#pingjia').val(),
            'pingjia':_pjValue,
            'userID':_userIdNum,
            'userName':_userIdName
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptPingjia',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                if(result == 99){

                    var gdInfo = {
                        'gdCode':_gdCode,
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
                                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'关单成功！', '');

                                conditionSelect();

                                $('#myModal1').modal('hide');
                            }else {

                                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'关单失败！', '');

                            }
                        },
                        error:function(jqXHR, textStatus, errorThrown){
                            console.log(jqXHR.responseText);
                        }
                    })

                }else{

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'关单失败！', '');

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })

    })

    /*------------------------------------------------其他方法--------------------------------------------*/
    //登记项初始化
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
        gdObj.wxshx='';
        $('.gzDesc').val('');
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
            'createUser':_userIdNum
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDJ',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                //根据状态值给表格赋值
                var zht1=[],zht4=[],zht6=[],zht7=[];
                for(var i=0;i<result.length;i++){
                    if(result[i].gdZht == 1 || result[i].gdZht == 11){
                        zht1.push(result[i]);
                    }else if(result[i].gdZht == 4){
                        zht4.push(result[i]);
                    }else if(result[i].gdZht == 6){
                        zht6.push(result[i]);
                    }else if(result[i].gdZht == 7){
                        zht7.push(result[i]);
                    }
                }
                //未接单
                _datasTable($('#missed-list'),zht1);
                //执行中
                _datasTable($('#in-execution'),zht4);
                //待关单
                _datasTable($('#waiting-list'),zht6);
                //已关单
                _datasTable($('#closing-list'),zht7);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //信息绑定
    function bindData(num,tableId){
        //样式
        tableId.children('tbody').children('tr').removeClass('tables-hover');
        num.parents('tr').addClass('tables-hover');

        //请求数据
        var prm = {
            'gdCode':_gdCode,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole
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
                $('.gzDesc').val(result.bxBeizhu);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //登记、编辑方法(编辑的时候传参数flag)
    function optionData(url,successMeg,errorMeg,flag){
        //验证非空
        if(gdObj.bxtel == ''|| gdObj.bxkesh == '' || gdObj.bxren == '' || gdObj.gzplace == '' || gdObj.wxshx == ''){
            if(gdObj.bxkesh == ''){
                $('.error1').show();
            }else{
                $('.error1').hide();
            }
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');
        }else{
            var prm = {
                'gdJJ':gdObj.gdtype,
                'gdRange':gdObj.xttype,
                'bxDianhua':gdObj.bxtel,
                'bxKeshi':$('#bxkesh').children('option:selected').html(),
                'bxKeshiNum':gdObj.bxkesh,
                'bxRen':gdObj.bxren,
                //'':gdObj.pointer,
                'gdFsShij':$('.datatimeblock').eq(2).val(),
                //'wxShiX':$('#sbtype').children('option:selected').html(),
                'wxShiX':'null',
                //'wxShiXNum':gdObj.sbtype,
                'wxXm':gdObj.wxshx,
                'wxXmNum':'1',
                'wxShebei':gdObj.sbnum,
                'dName':gdObj.sbname,
                'installAddress':gdObj.azplace,
                'wxDidian':gdObj.gzplace,
                'bxBeizhu':$('.gzDesc').val(),
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'gdSrc': 1
            }
            if(flag){
                prm.gdCode = _gdCode
            }
            $.ajax({
                type:'post',
                url:_urls + url ,
                timeout:_theTimes,
                data:prm,
                success:function(result){
                    if (result == 99) {

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap',successMeg, '');

                        $('#myModal').modal('hide');

                        //刷新表格
                        conditionSelect();

                    } else {

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap',errorMeg, '');

                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }
            })
        }
    }

    //报修科室
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
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

})