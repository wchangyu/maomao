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
    //报修vue变量
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
            'wxcontent':'',
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

    //快速创建对象
    var gdObj1 = new Vue({
        el:'#myApp331',
        data:{
            'gdtype':'1',
            'xttype':'',
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
            'wxcontent':'',
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
            'je':'',
            'size':''
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

    //标记当前打开的是不是报修按钮
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

    //物品分类
    classification();

    //存放员工信息数组
    var _workerArr = [];

    //获得员工信息方法

    workerData1();

    //部门
    getDepartment();

    //负责人数组
    var _fzrArr = [];

    //是不是工长
    var _isFZR = false;

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

    //报修按钮
    $('.creatButton').click(function(){

        _isDeng = true;

        //显示模态框
        _moTaiKuang($('#myModal6'), '快速报修', '', '' ,'', '报修');

        //增加报修类
        $('#myModal6').find('.btn-primary').removeClass('jiedan').addClass('dengji');

        //选择部门不显示
        $('.bumen').hide();

        //维修班组不显示
        $('.autoFile').hide();

        //初始化
        dataInit();

        //维修内容显示
        $('.wxnr').show();

        //所有input框不能操作，select也不能操作
        $('.single-block').children('input').removeAttr('readOnly').removeClass('disabled-block');

        //所有select不能操作
        $('.single-block').children('select').attr('disabled',false).removeClass('disabled-block');

        //故障描述不可操作
        $('.gzDesc').removeAttr('readOnly').removeClass('disabled-block');

        //报修人信息不可操作
        $('.note-edit2').attr('disabled',true).addClass('disabled-block');

        //电话信息可编辑
        $('.bx-choose').removeAttr('disabled').removeClass('disabled-block');

    });

    //点击报修模态框显示的回调函数
    $('#myModal6').on('shown.bs.modal', function () {

        if(_isDeng){

            //绑定报修人信息
            //if(_workerArr.length > 0){
            //    for(var i=0;i<_workerArr.length;i++){
            //        if(_workerArr[i].userNum == _userIdNum){
            //
            //            console.log(_workerArr[i]);
            //
            //            gdObj1.bxtel = _workerArr[i].mobile;
            //
            //            gdObj1.bxkesh = _workerArr[i].departNum;
            //
            //            gdObj1.bxren = _workerArr[i].userName;
            //        }
            //    }
            //}

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

            _datasTable($('#fzr-list1'),_fzrArr);

        }

        _isDeng = false;
    });

    //报修确定按钮
    $('#myModal6').on('click','.dengji',function(){

        //验证必填项
        if(gdObj1.bxtel == ''|| gdObj1.bxkesh == '' || gdObj1.bxren == '' || gdObj1.gzplace == '' || gdObj1.wxshx == '' || gdObj1.wxcontent == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

        }else{
            //工单维修人
            var arr = [];
            var obj = {};
            obj.wxRen = _fzrArr[0].userNum;
            obj.wxRName = _fzrArr[0].userName;
            obj.wxRDh = _fzrArr[0].mobile;
            arr.push(obj);
            var str = ' ';
            if(gdObj1.sbtype == ''){
                str = ' ';
            }else{
                str = $('#sbtype').children('option:selected').html();
            }

            //报修
            var prm = {
                'gdJJ':gdObj1.gdtype,
                'gdRange':gdObj1.xttype,
                'bxDianhua':gdObj1.bxtel,
                'bxKeshi':$('#bxkesh').children('option:selected').html(),
                'bxKeshiNum':gdObj1.bxkesh,
                'bxRen':gdObj1.bxren,
                //'':gdObj.pointer,
                'gdFsShij':$('.datatimeblock').eq(2).val(),
                'wxShiX':1,
                'wxShiXNum':1,
                'wxXm':gdObj1.wxshx,
                'wxXmNum':$('#metter').attr('data-num'),
                //设备类型
                'DCName':str,
                'DCNum':gdObj1.sbtype,
                'wxShebei':gdObj1.sbnum,
                'dName':gdObj1.sbname,
                'installAddress':gdObj1.azplace,
                'wxDidian':gdObj1.gzplace,
                'bxBeizhu':$('.gzDesc').val(),
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'gdSrc': 1,
                'gdZht':4,
                'wxKeshiNum':_userBM,
                'wxKeshi':_userBMName,
                'wxBeizhu':gdObj1.wxcontent,
                'gdWxRs':arr,
            }

            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDCreQuickDJ',
                data:prm,
                timeout:_theTimes,
                success:function(result){

                    if(result == 99){

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'快速报修成功！', '');

                        $('#myModal6').modal('hide');

                        conditionSelect();

                    }else{
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'快速报修失败！', '');
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
    $('#waiting-list,#dai-waiting-list').on('click','.option-close',function(){

        //各项初始化
        gdInit();

        //确定工单号
        _gdCode = $(this).parents('tr').children('.gdCode').children('span').children('a').html();

        //模态框显示
        _moTaiKuang($('#myModal'), '申请关单', '', '' ,'', '申请关单');

        //添加类名
        $('#myModal').find('.btn-primary').removeClass('dengji').addClass('closeGD');

        //绑定信息
        bindData($(this),$('#waiting-list'));

        //input不可操作；
        $('.no-edit1').find('.single-block').children('input').attr('readOnly','readOnly').addClass('disabled-block');

        //select不可操作
        $('.no-edit1').find('.single-block').children('select').attr('disabled',true).addClass('disabled-block');

        //故障描述
        $('.gzDesc').attr('readOnly','readOnly').addClass('disabled-block');

        //部门不可操作
        $('#depart').attr('disabled',true).addClass('disabled-block');

        //清空材料
        _selectedBJ = [];

        //总计
        _totalFree = 0;

    })

    //添加材料按钮
    $('.addCL').click(function(){

        //模态框显示
        _moTaiKuang($('#myModal1'), '添加材料', '', '' ,'', '添加材料');

        //console.log(_selectedBJ);

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
        clObj.size = _bjObject.size;
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
            obj.bm = clObj.bm;
            obj.mc = clObj.mc;
            obj.size = clObj.bm;
            obj.dw = clObj.dw;
            obj.sl = clObj.sl;
            obj.size = clObj.size;
            var dj = 0;
            if(clObj.dj == ''){
                dj = 0.00;
            }else{
                dj = parseFloat(clObj.dj);
            }
            obj.dj = dj.toFixed(2);
            var je = 0;
            if(clObj.je == ''){
                je = 0.00
            }else{
                je = parseFloat(clObj.je);
            }
            if(isNaN(dj) || isNaN(je)){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请输入正确金额或单价！', '');
                return false
            }
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
                    clObj.size = _selectedBJ[i].size;
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

        _totalFree = 0;

        //计算共计费用
        for(var i=0;i<_selectedBJ.length;i++){

            _totalFree += parseFloat(_selectedBJ[i].je);

        }

        var total = Number($('#hourFee').val()) + Number(_totalFree);

        $('#total').val(total.toFixed(2));
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

    var aa = false;

    //申请关单
    $('#myModal').on('click','.closeGD',function(){

        aa = true;

        if(aa){
            if( $('#receiver').val() == '' ){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择验收人！', '');

            }else{

                if(_selectedBJ.length != 0){

                    $('#theLoading').modal('show');
                    //材料
                    addCL();
                    //申请
                    closingApplication();

                }else{

                    var prm = {
                        gdCode:_gdCode,
                        gdZht:6,
                        wxBeizhu:$('.wxcontent').eq(1).val(),
                        yanShouRen:$('#receiver').val(),
                        yanShouRenName:$('#receiver').children('option:selected').html(),
                        gdFee:$('#total').val(),
                        gongShiFee:$('#hourFee').val(),
                        userID: _userIdNum,
                        userName:_userIdName,
                        b_UserRole:_userRole
                    }
                    $.ajax({
                        type:'post',
                        url:_urls + 'YWGD/ywGDReqWang',
                        data:prm,
                        timeout:_theTimes,
                        //beforeSend: function () {
                        //    $('#theLoading').modal('hide');
                        //    $('#theLoading').modal('show');
                        //},
                        //complete: function () {
                        //    $('#theLoading').modal('hide');
                        //},
                        success:function(result){

                            if(result==99){

                                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'申请关单成功！', '');

                                $('#myModal').modal('hide');

                                conditionSelect();

                            }else{

                                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'申请关单失败！', '');

                            }

                        },
                        error:function(jqXHR, textStatus, errorThrown){

                            console.log(jqXHR.responseText);

                        }
                    })

                }

            }
        }

    })

    //历史工单
    $('#in-execution').on('click','.option-see',function(){

        //绑定数据
        bindData($(this),$('#in-execution'));

        //模态框
        _moTaiKuang($('#myModal'), '查看详情', 'flag', '' ,'', '');

    })

    //选择设备数据
    //选择设备弹窗打开后
    $('#choose-equipment').on('shown.bs.modal', function () {

        _datasTable($('#choose-equip'),equipmentArr);

    });

    //选择设备确定按钮
    $('#choose-equipment .btn-primary').on('click',function() {

        var dom = $('#choose-equip tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //seekArr.push(dom.eq(i).children().eq(1).html())
                //获取地址
                $('#equip-address').val(dom.eq(i).children().eq(5).find('span').html());
                //获取设备名称
                $('#equip-name').val(dom.eq(i).children().eq(2).html());
                //获取设备编码
                $('#equip-num').val(dom.eq(i).children().eq(3).html());
                //获取设备类型
                $('#sbtype').val(dom.eq(i).children().eq(4).find('span').attr('data-num'));

                $('#choose-equipment').modal('hide');

                //设备编码
                gdObj1.sbnum = dom.eq(i).children().eq(3).html();

                //设备名称
                gdObj1.sbname = dom.eq(i).children().eq(2).html();

                //安装地点
                gdObj1.azplace = dom.eq(i).children().eq(5).find('span').html();

                //设备类型
                gdObj1.sbtype = dom.eq(i).children().eq(4).find('span').attr('data-num');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应设备', '')

    });

    $('#choose-metter').on('click','.tableCheck',function(){

        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);

    });

    //选择维修事项确定按钮
    $('#choose-building .btn-primary').on('click',function() {
        var dom = $('#choose-metter tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //seekArr.push(dom.eq(i).children().eq(1).html())
                $('#metter').val(dom.eq(i).children().eq(3).find('span').html());

                $('#metter').attr('data-num',dom.eq(i).children().eq(2).html());

                gdObj1.wxshx = dom.eq(i).children().eq(3).find('span').html();

                $('#choose-building').modal('hide');

                return false
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应维修事项', '')

    });

    //选择维修事项弹窗打开后
    $('#choose-building').on('shown.bs.modal', function () {
        $('#add-select').val(' ');

        getMatter();

    });

    //选择故障地点弹窗打开后
    $('#choose-area').on('shown.bs.modal', function () {
        getArea();
    });

    $('#choose-area').on('click','.tableCheck',function(){

        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);
    });

    //选择故障地点确定按钮
    $('#choose-area .btn-primary').on('click',function() {
        var dom = $('#choose-area-table tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //seekArr.push(dom.eq(i).children().eq(1).html())

                gdObj1.gzplace = dom.eq(i).children().eq(3).find('span').html();

                $('#choose-area').modal('hide');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应故障地点', '')

    });

    //点击维修事项查询按钮
    $('#selected1').on('click',function(){
        //获取维修类别
        var type = $('#add-select').find("option:selected").text();
        if(type == '全部'){
            type = '';
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDWxxmGetAll',
            data:{
                "wxnum": "",
                "wxname": "",
                "wxclassname":type
            },
            success:function(result){
                //return false;
                _datasTable($('#choose-metter'),result);
            }
        })
    });

    //选择维修人
    $('#choose-people').on('click','.btn-primary',function(){

        var dom = $('#choose-people tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {

                gdObj1.bxren = dom.eq(i).find('.adjust-comment').html();

                gdObj1.bxtel = dom.eq(i).find('.r_mobile').html();

                gdObj1.bxkesh = dom.eq(i).find('.r_depNum').html();

                $('#choose-people').modal('hide');

                return false;
            }
        }

    })

    //选择维修科室
    $('#choose-department .btn-primary').on('click',function() {

        var dom = $('#choose-department-table tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {

                gdObj1.bxkesh = dom.eq(i).find('.adjust-comment').html();

                $('#choose-department').modal('hide');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择报修科室！', '')

    });

    //电话选择
    $('#choose-people-table,#choose-department-table').on('click','.tableCheck',function(){

        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);
    });


    /*------------------------------------------------表格初始化------------------------------------------*/

    //执行中表格
    var waitingListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '" data-circle="' + full.gdCircle +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        //{
        //    title:'工单类型',
        //    data:'gdJJ',
        //    render:function(data, type, full, meta){
        //        if(data == 0){
        //            return '普通'
        //        }else{
        //            return '快速'
        //        }
        //    }
        //},
        //{
        //    title:'设备类型',
        //    data:'wxShiX'
        //},
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'维修事项',
            data:'wxXm'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'报修时间',
            data:'gdShij'
        },
        //{
        //    title:'受理时间',
        //    data:'shouLiShij'
        //},
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'报修科室',
            data:'bxKeshi'
        },
        {
            title:'报修人',
            data:'bxRen'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-close btn default btn-xs green-stripe'>申请关单</span>"
        }
    ];

    _tableInit($('#waiting-list'),waitingListCol,'2','','','');

    var daiWaitingListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '" data-circle="' + full.gdCircle +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        //{
        //    title:'工单类型',
        //    data:'gdJJ',
        //    render:function(data, type, full, meta){
        //        if(data == 0){
        //            return '普通'
        //        }else{
        //            return '快速'
        //        }
        //    }
        //},
        //{
        //    title:'设备类型',
        //    data:'wxShiX'
        //},
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'维修事项',
            data:'wxXm'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'报修时间',
            data:'gdShij'
        },
        //{
        //    title:'受理时间',
        //    data:'shouLiShij'
        //},
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'报修科室',
            data:'bxKeshi'
        },
        {
            title:'报修人',
            data:'bxRen'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'执行人',
            data:'wxUserNames'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-close btn default btn-xs green-stripe'>申请关单</span>"
        }
    ];

    _tableInit($('#dai-waiting-list'),daiWaitingListCol,'2','','','');

    //历史表格
    var inExecutionCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){

                return '<span data-zht="' + full.gdZht +
                    '" data-circle="' + full.gdCircle +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        //{
        //    title:'工单类型',
        //    data:'gdJJ',
        //    render:function(data, type, full, meta){
        //        if(data == 0){
        //            return '普通'
        //        }else{
        //            return '快速'
        //        }
        //    }
        //},
        //{
        //    title:'设备类型',
        //    data:'wxShiX'
        //},
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'维修事项',
            data:'wxXm'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'报修时间',
            data:'gdShij'
        },
        //{
        //    title:'受理时间',
        //    data:'shouLiShij'
        //},
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'报修科室',
            data:'bxKeshi'
        },
        {
            title:'报修人',
            data:'bxRen'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'执行人',
            data:'wxUserNames'
        }
        //{
        //    title:'操作',
        //    data:null,
        //    defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
        //}
    ];

    _tableInit($('#in-execution'),inExecutionCol,'2','','','');

    //执行人表格
    var fzrListCol = [
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

    tableInit($('#fzr-list'),fzrListCol,'2','','','');

    tableInit($('#fzr-list1'),fzrListCol,'2','','','');

    //材料列表
    var clListCol = [
        {
            title:'编码',
            data:'bm',
            className:'bjbm'
        },
        {
            title:'名称',
            data:'mc',
        },
        {
            title:'规格型号',
            data:'size'
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

    tableInit($('#cl-selecting'),clListCol,'2','','','');

    //外层材料列表
    var outClListCol = [
        {
            title:'序号',
            data:'mc',
            render:function(data, type, full, meta){

                return meta.row + 1
            }
        },
        {
            title:'名称',
            data:'mc'
        },
        {
            title:'规格型号',
            data:'size',
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
        }
    ];

    tableInit($('#cl-list'),outClListCol,'2','','','');

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
    fzrFun();

    //物品列表
    ClListData();

    //验收人
    //receiverData();

    //选择设备表格
    var equipTable = $('#choose-equip').DataTable({
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
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
            'search':'搜索:',
            'paginate': {
                'first':      '第一页',
                'last':       '最后一页',
                'next':       '下一页',
                'previous':   '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [

        ],
        "dom":'B<"clear">lfrtip',
        //数据源
        'columns':[
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'id',
                data:'id',
                class:'theHidden'
            },
            {
                title:'设备名称',
                data:'dName'
            },
            {
                title:'设备编码',
                data:'dNewNum'
            },
            {
                title:'设备类型',
                data:'dsName',
                render:function(data, type, row, meta){
                    return '<span data-num="'+row.dsNum+'">'+data+'</span>'
                }
            },
            {
                title:'安装位置',
                data:'installAddress',
                class:'adjust',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            }
        ]
    });

    //选择维修事项表格
    var matterTable = $('#choose-metter').DataTable({
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
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
            'paginate': {
                'first':      '第一页',
                'last':       '最后一页',
                'next':       '下一页',
                'previous':   '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [

        ],
        "dom":'B<"clear">lfrtip',
        //数据源
        'columns':[
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'id',
                data:'id',
                class:'theHidden'
            },
            {
                title:'维修项目编号',
                data:'wxnum',
                class:'theHidden'
            },
            {
                title:'维修项目名称',
                data:'wxname',
                class:'adjust-comment',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            },
            {
                title:'项目类别名称',
                data:'wxclassname'
            },
            {
                title:'备注',
                data:'memo'
            }
        ]
    });

    //故障地点表格
    var areaTable = $('#choose-area-table').DataTable({
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
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
            'paginate': {
                'first':      '第一页',
                'last':       '最后一页',
                'next':       '下一页',
                'previous':   '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [

        ],
        "dom":'B<"clear">lfrtip',
        //数据源
        'columns':[
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'id',
                data:'id',
                class:'theHidden'
            },
            {
                title:'地点编号',
                data:'locnum',
                class:'theHidden'
            },
            {
                title:'地点名称',
                data:'locname',
                class:'adjust-comment',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            },
            {
                title:'部门名称',
                data:'departname'
            },
            {
                title:'楼栋名称',
                data:'ddname'
            }
        ]
    });

    //报修人表格
    var peopleTable = $('#choose-people-table').DataTable({
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
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
            'paginate': {
                'first':      '第一页',
                'last':       '最后一页',
                'next':       '下一页',
                'previous':   '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [

        ],
        "dom":'B<"clear">lfrtip',
        //数据源
        'columns':[
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'用户名称',
                data:'userName',
                class:'adjust-comment'
            },
            {
                title:'职位',
                data:'pos'
            },
            {
                title:'电话',
                data:'mobile',
                className:'r_mobile'
            },
            {
                title:'部门',
                data:'departName',
                className:'r_dep'
            },
            {
                title:'部门编码',
                data:'departNum',
                className:'r_depNum'
            }
        ]
    });

    //报修科室表格
    var departTable = $('#choose-department-table').DataTable({
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
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
            'paginate': {
                'first':      '第一页',
                'last':       '最后一页',
                'next':       '下一页',
                'previous':   '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [

        ],
        "dom":'B<"clear">lfrtip',
        //数据源
        'columns':[
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'部门编号',
                data:'departNum',
                class:'adjust-comment'
            },
            {
                title:'部门名称',
                data:'departName'
            }
        ]
    });

    /*------------------------------------------------其他方法--------------------------------------------*/

    var equipmentArr = [];
    getEuipment('');
    //获取设备类型
    function getEuipment(dsNum){

        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevs',
            data:{
                userID:_userIdNum,
                dsNum:dsNum
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){
                //console.log(result);
                $('#theLoading').modal('hide');
                $(result).each(function(i,o){
                    equipmentArr.push(o);
                })
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                console.log(jqXHR.responseText);
            }
        })
    };

    //初始化
    function dataInit(){
        gdObj1.gdtype = '1';
        gdObj1.xttype = '';
        gdObj1.bxtel = '';
        gdObj1.bxkesh = '';
        gdObj1.bxren = '';
        gdObj1.pointer = '';
        gdObj1.gztime = '';
        gdObj1.sbtype = '';
        gdObj1.sbnum = '';
        gdObj1.sbname = '';
        gdObj1.azplace = '';
        gdObj1.gzplace = '';
        gdObj1.wxshx = '';
        gdObj1.wxbz = '';
        gdObj1.wxcontent = '';
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
        clObj.size = '';
        $('.no-edit').attr('disabled',false);
    }

    //关单申请初始化
    function gdInit(){

        //维修材料表格初始化
        var arr = [];

        _datasTable($('#cl-list'),arr);

        //工时费初始化
        $('#hourFee').val('');

        //合计金额初始化
        $('#total').val();

        //维修内容初始化
        $('.wxcontent').val('');

        //执行人初始化
        $('#depart').val('');

        _datasTable($('#fzr-list'),arr);

        //验收人
        $('#receiver').val('');

    }

    //条件查询
    function conditionSelect(){

        var prm = {};

        var st = $('.min').val();

        var et = moment($('.max').val()).add(1,'d').format('YYYY/MM/DD');

        if(_isFZR){

            prm = {
                'gdCode':$('.filterInput').val(),
                'gdSt':st,
                'gdEt':et,
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'wxKeshiNum':_userBM,
                'wxKeshi':_userBMName
            }

        }else{

            prm = {
                'gdCode':$('.filterInput').val(),
                'gdSt':st,
                'gdEt':et,
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'wxRenId':_userIdNum
            }

        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDJ',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                //根据状态值给表格赋值
                var zht=[],my=[],other=[];

                for(var i=0;i<result.length;i++){
                    if(result[i].gdZht == 4){

                        var reg = ',' + _userIdNum + ',';
                        if(result[i].wxUserIDs.indexOf(reg)>=0){

                            my.push(result[i]);

                        }else{

                            other.push(result[i]);

                        }

                    }else{

                        zht.push(result[i]);

                    }
                }
                //执行中
                _datasTable($('#waiting-list'),my);
                //待执行中
                _datasTable($('#dai-waiting-list'),other);
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

        _gdCode = num.parents('tr').children('.gdCode').children('span').children('a').html();

        _gdZht = num.parents('tr').children('.gdCode').children('span').attr('data-zht');

        _gdCircle = num.parents('tr').children('.gdCode').children('span').attr('data-circle');

        //请求数据
        var prm = {
            'gdCode':_gdCode,
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
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
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

                $('.wxcontent').val(result.wxBeizhu);

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
                var arr1 = [];
                _datasTable($('#cl-list'),arr1);

                $('#hourFee').val('');

                $('#total').val('');

                manHourFee(result.wxXmNum);

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
            cateName: $('#flmcs').children('option:selected').html(),
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
            wxBeizhu:$('.wxcontent').val(),
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

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'添加物品成功！申请关单成功！', '');

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

                    str += '申请关单成功！'
                }else{

                    str += '申请关单失败！'
                }

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,str, '');

                $('#theLoading').modal('hide');
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

                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].userNum +
                        '">' + result[i].userName + '</option>'

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

    //表格初始化
    function tableInit(tableId,col,buttons,flag,fnRowCallback,drawCallback){
        var buttonVisible = [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs'
            }
        ];
        var buttonHidden = [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs hiddenButton'
            }
        ];
        if(buttons == 1){
            buttons = buttonVisible;
        }else{
            buttons =  buttonHidden;
        }
        var _tables = tableId.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": false,   //是否分页
            "destroy": true,//还原初始化了的datatable
            "searching": false,
            "ordering": false,
            "iDisplayLength":50,//默认每页显示的条数
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '',
                'info': '',
                'infoEmpty': '',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            "dom":'t<"F"lip>',
            'buttons':buttons,
            "columns": col,
            "fnRowCallback": fnRowCallback,
            "drawCallback":drawCallback
        });
        if(flag){
            _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
        }

    }

    //分类
    function classification(){
        var prm = {
            cateNum:'',
            cateName:'',
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItemCate',
            data:prm,
            success:function(result){
                var str = '<option value="">请选择</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].cateNum +
                        '">' + result[i].cateName + '</option>>'
                }
                $('#flmcs').empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取故障位置
    function getArea(){
        //获取报修科室
        var departnum = $('#bxkesh').val();
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/SysLocaleGetAll',
            data:{
                "locname": "",
                "departnum": departnum,
                "departname": "",
                "ddname": ""
            },
            success:function(result){

                //return false;
                _datasTable($('#choose-area-table'),result);
            }
        })
    };

    //获取维修事项
    function getMatter(){

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDWxxmGetAll',
            data:{
                "wxnum": ""
            },
            success:function(result){
                //console.log(result);
                //return false;
                _datasTable($('#choose-metter'),result);
            }
        })
    };

    getMatterType();

    //获取项目类别
    function getMatterType(){
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDwxxmClassGetAll',
            data:{
                "wxnum": ""
            },
            success:function(result){
                //return false;
                var html = '<option value=" ">全部</option>'
                $(result).each(function(i,o){
                    html += '<option value="'+o.wxclassnum+'">'+ o.wxclassname+'</option>'
                })
                $('#add-select').html(html);
            }
        })

    }

    //获取工时费
    function manHourFee(data){

        if(data){

            $.ajax({

                type:'post',
                url:_urls + 'YWGD/ywGDWxxmGetAll',
                data:{
                    userID:_userIdNum,
                    userName:_userIdName,
                    b_UserRole:_userRole,
                    wxnum:data
                },
                timeout:_theTimes,
                success:function(result){

                    if(result && result.length>0){

                        $('#hourFee').val(result[0].workfee)

                        $('#total').val(result[0].workfee)

                    }



                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }

            })
        }
    }

    //人员
    function workerData1(){
        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetUsers',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _workerArr.length = 0;

                for(var i=0;i<result.length;i++){
                    _workerArr.push(result[i])
                }

                _datasTable($('#choose-people-table'),result);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //部门
    function getDepartment(){

        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:{
                'userID':_userIdNum,
                'userName':_userIdName,
            },
            timeout:_theTimes,
            success:function(result){

                _datasTable($('#choose-department-table'),result);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })

    }

    //获取负责人
    function fzrFun(){
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetWXLeaders',
            data:{
                userID:_userIdNum,
                userName:_userIdName
            },
            success:function(result){
                _fzrArr.length=0;

                for(var i=0;i<result.length;i++){
                    _fzrArr.push(result[i]);
                }

                for(var i=0;i<_fzrArr.length;i++){

                    if(_fzrArr[i].userNum == _userIdNum){

                        _isFZR = true;

                        break
                    }

                }
                if(_isFZR){

                    $('.content-main-contents').eq(2).addClass('hide-block');

                    $('.table-title').children('span').eq(2).show();

                }else{

                    $('.content-main-contents').eq(2).addClass('hide-block');

                    $('.table-title').children('span').eq(2).hide();

                }
                conditionSelect();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }



    //隐藏分页
    $('#choose-metter_length').hide();
    $('#choose-area-table_length').hide();
    $('#choose-equip_length').hide();
    $('#choose-people-table_length').hide();
    $('#choose-department-table_length').hide();

})