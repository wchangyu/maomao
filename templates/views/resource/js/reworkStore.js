$(function(){

    /*-----------------------------------------------------全局变量-------------------------------------------*/

    //时间
    //日历插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //备件进度
    BJStatus();

    //默认时间
    var now = moment().format('YYYY/MM/DD');

    var st = moment(now).subtract(6,'Months').format('YYYY/MM/DD');

    $('.condition-query').eq(0).find('.datatimeblock').eq(0).val(st);

    $('.condition-query').eq(0).find('.datatimeblock').eq(1).val(now);

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
    });

    //物品分类
    _getProfession('YWCK/ywCKGetItemCate',$('#flmcs'),false,'cateNum','cateName');

    //厂家列表
    factoryFun();

    //所有物品
    var _allWLArr = [];

    //选中的备件对象
    var _bjObject = {};

    //暂存选中材料的数组
    var _selectedBJ = [];

    //总费用
    var _totalFree = 0;

    //当前返修编码
    var _fxCode = 0;

    //自修是否完成
    var _zxIsComplete = false;

    //添加材料是否完成
    var _clIsComplete = false;

    //自修执行成功
    var _zxIsSuccess = false;

    //添加材料是否成功
    var _clIsSuccess = false;

    //状态数组
    var _statusArr = [];

    /*------------------------------------------------------表格初始化----------------------------------------*/

    var col = [
        {
            title:'返修件code',
            data:'fxCode',
            className:'fxCode',
            render:function(data, type, full, meta){

                return '<a href="fxDetails.html?a1=' + full.fxCode +
                    '&a2=' + _status +
                    '" target="_blank">' +data +
                    '</a>'

            }
        },
        {
            title:__names.department,
            data:'staName'
        },
        {
            title:__names.workshop,
            data:'departName'
        },
        {
            title:'工单号',
            data:'gdCode2',
            className:'gdcode'
        },
        {
            title:'返修件编码',
            data:'itemNum'
        },
        {
            title:'返修件名称',
            data:'itemName'
        },
        {
            title:'规格型号',
            data:'size'
        },
        {
            title:'返修件序列号',
            data:'sn'
        },
        {
            title:'故障原因',
            data:'fxReason'
        },
        {
            title:'快递信息',
            data:'fxKdinfo'
        },
        {
            title:'接收人',
            data:'jieshouRenName'
        },
        {
            title:'送修日期',
            data:'sxShij'
        },
        {
            title:'自修单价',
            data:'zxPrice',
            render:function(data, type, full, meta){

                return data.toFixed(2);

            }
        },
        {
            title: '操作',
            "targets": -1,
            "data": 'fxStatus',
            "className": 'noprint',
            render:function(data, type, full, meta){
                if( data == 999 ){

                    return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"

                }else{

                    return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-beijian btn default btn-xs green-stripe'>维修备件管理</span>" +
                        "<span class='data-option option-finish btn default btn-xs green-stripe'>完成</span>"

                }

            }
        }
    ];

    _tableInit($('#scrap-datatables'),col,1,true,'','','');

    _warehouseLise(conditionSelect);

    //第一层材料列表
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

    _tableInit($('#cl-list'),outClListCol,'2','','','',true);

    //第二层材料列表
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

    _tableInit($('#cl-selecting'),clListCol,'2','','','',true);

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
            className:'wlbm',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.id +
                    '">' + data +
                    '</span>'
            }
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

    //物品列表
    ClListData(true);

    /*--------------------------------------------------------按钮--------------------------------------------*/

    $('#selected').click(function(){

        conditionSelect();

    })

    //查看
    $('#scrap-datatables').on('click','.option-see',function(){

        //loadding
        $('#theLoading').modal('show');

        _fxCode = $(this).parents('tr').children('.fxCode').children('a').html();

        var src = 'fxDetails.html?a1=' + _fxCode +
            '&a2='+ _status ;

        var str = '<iframe style="width: 100%;height:562px;border:none;" src="' + src +
            '"></iframe>'

        //给iframe赋值
        $('#see-detail').empty().append(str);

        //模态框
        _moTaiKuang($('#see-Modal'),'查看详情','flag','','','');

        $('#theLoading').modal('hide');

    })

    //维修备件管理
    $('#scrap-datatables').on('click','.option-beijian',function(){

        //初始化
        fxInit();

        //模态框
        _moTaiKuang($('#myModal'),'返修件管理','','','','确定');

        //数据绑定
        bindData($(this));

        //是否可操作
        //绑定返修件信息部分不可操作
        $('#fxGoods').children('div').eq(0).find('input').attr('disabled',true).addClass('disabled-block');

        //初始化合计
        _totalFree = 0;

        //获取日志
        logFile($(this));

        //隐藏完成备注块
        $('.finishRemark').hide();

        //添加材料按钮消失
        $('.addCL').show();

        //操作可操作
        $('#optioning,#hourFee').attr('disabled',false).removeClass('disabled-block');

        //类
        $('#myModal').find('.modal-footer').children('.btn-primary').removeClass('finishButton').addClass('determine');
    })

    //完成
    $('#scrap-datatables').on('click','.option-finish',function(){

        //初始化
        fxInit();

        //模态框
        _moTaiKuang($('#myModal'),'返修件管理','','','','完成');

        //数据绑定
        bindData($(this));

        //是否可操作
        //绑定返修件信息部分不可操作
        $('#fxGoods').children('div').eq(0).find('input').attr('disabled',true).addClass('disabled-block');

        //初始化合计
        _totalFree = 0;

        //获取日志
        logFile($(this));

        //隐藏完成备注块
        $('.finishRemark').show();

        //添加材料按钮消失
        $('.addCL').hide();

        //操作不可操作
        $('#optioning,#hourFee').attr('disabled',true).addClass('disabled-block');

        //类
        $('#myModal').find('.modal-footer').children('.btn-primary').removeClass('determine').addClass('finishButton');

    })

    //【完成操作按钮】
    $('#myModal').on('click','.finishButton',function(){

        var prm = {

            //返修编码
            "fxCode": _fxCode,
            //新的返修状态
            "fxStatus": 999,
            //新的返修状态名
            "fxStatusName": "完成",
            //上一次的返修状态
            "lastFxStatus": 0,
            //返修备注
            "fxBeizhu": $('.finishRemark').find('textarea').val(),
            //当前用户id
            "userID": _userIdNum,
            //当前用户名
            "userName": _userIdName,
            //当前用户角色
            "b_UserRole": _userRole,
            //当前班组
            "b_DepartNum": _loginUser.departNum

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXUptStatus',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','操作成功！','');

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','操作失败！','');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    })

    //【添加材料】按钮
    $('#myModal').find('.addCL').click(function(){

        //初始化
        clInit();

        //表格数据
        _datasTable($('#cl-selecting'),_selectedBJ);

        //模态框
        _moTaiKuang($('#AddCL-Modal'),'添加材料',false,'','','添加材料');



    })

    //【材料选择】按钮
    $('#AddCL-Modal').on('click','.selectCL',function(){

        //初始化
        //物品编码
        $('#SelectCL-Modal').find('#wpbms').val('');
        //物品名称
        $('#SelectCL-Modal').find('#wpmcs').val('');
        //分类名称
        $('#SelectCL-Modal').find('#flmcs').val('');
        //表格数据
        _datasTable($('#weiXiuCaiLiaoTable'),_allWLArr);

        //模态框
        _moTaiKuang($('#SelectCL-Modal'), '选择材料', '', '' ,'', '确定');

    })

    //所有物品条件选择
    $('.tianJiaSelect').click(function(){

        ClListData(false);

    })

    //物品表格选择点击事件
    //选择材料点击事件
    $('#weiXiuCaiLiaoTable tbody').on('click','tr',function(){
        var $this = $(this);
        var tableTr = $this.parents('.table').find('tr');
        tableTr.css('background','#ffffff');
        $this.css('background','#FBEC88');
        _bjObject.flmc = $this.children('.flmc').html();
        _bjObject.wpbm = $this.children('.wlbm').children().html();
        _bjObject.wpmc = $this.children('.wlmc').html();
        _bjObject.size = $this.children('.size').html();
        _bjObject.unit = $this.children('.unit').html();
        _bjObject.id = $this.children('.wlbm').children().attr('data-id');
    });

    //选择材料点击事件的确定按钮
    $('.addWL').click(function(){

        //赋值
        clObj.mc = _bjObject.wpmc;
        clObj.bm = _bjObject.wpbm;
        clObj.dw = _bjObject.unit;
        clObj.size = _bjObject.size;
        clObj.cateName = _bjObject.flmc;
        clObj.id = _bjObject.id;
        clObj.sl = '';
        clObj.dj = '';
        clObj.je = '';

        //模态框关闭
        $('#SelectCL-Modal').modal('hide');
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
            obj.cateName = clObj.cateName;
            obj.id = clObj.id;
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
    $('#cl-selecting').on('click','.option-bianji',function(){

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

    //添加材料保存按钮
    $('#cl-selecting').on('click','.option-save',function(){

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

    //添加材料删除按钮
    $('#cl-selecting').on('click','.option-shanchu',function(){

            var value = $(this).parents('tr').children('.bjbm').html();

            _selectedBJ.removeByValue(value,'bm');

            _datasTable($('#cl-selecting'),_selectedBJ);

        })

    //选中的材料
    $('#appendTo').click(function(){

        $('#AddCL-Modal').modal('hide');

        _datasTable($('#cl-list'),_selectedBJ);

        _totalFree = 0;

        //计算共计费用
        for(var i=0;i<_selectedBJ.length;i++){

            _totalFree += parseFloat(Number(_selectedBJ[i].je));

        }

        $('#total').val(_totalFree.toFixed(2));

        $('#hourFee').val(_totalFree.toFixed(2));
    })

    //返修件【确定按钮】
    $('#myModal').on('click','.determine',function(){

        //首先判断情况

        var values = $('#optioning').val();

        if( values == 'zixiu' ){

            $('#theLoading').modal('show');

            //调用添加材料接口
            clOption();

            //自修接口
            ownRepairFun();

        }else if( values == 'fanchang' ){

            //调用厂家资料接口
            factoryRepairFun();

        }else if( values == 'baofei' ){

            //调用报废接口
            scrapFun();
        }else if( values == 'zhuku' ){

            returnMajorFun();

        }

    })

    //操作change
    $('#optioning').change(function(){

        $('.repairType').hide();

        if($(this).val() == 'zixiu'){

            $('.ownRepair').show();

        }else if($(this).val() == 'fanchang'){

            $('.factoryRepair').show();

        }else if($(this).val() == 'baofei'){

            $('.scrapBlock').show();

        }else if($(this).val() == 'zhuku'){

            $('.majorBlock').show();

        }

    })

    /*-------------------------------------------------------其他方法-----------------------------------------*/
    //返修件状态
    function BJStatus(){

        var prm = {
            //返修件编码
            "fxCode": "",
            //用户id
            "userID": _userIdNum,
            //用户姓名
            "userName": _userIdName,
            //用户角色
            "b_UserRole": _userRole,
            //当前部门
            "b_DepartNum": _loginUser.departNum
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXGetFxStatus',
            data:prm,
            beforeSend:function(){
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                _statusArr.length = 0;

                var str = '<option value="">请选择</option>';

                var str1 = '<option value="">请选择</option>';

                for(var i=0;i<result.statuses.length;i++){

                    if(result.statuses[i].fxType == _status ){

                        if( result.statuses[i].optType != '' ){

                            str += '<option value="' + result.statuses[i].fxStatus +
                                '">' + result.statuses[i].fxStatusName + '</option>>'

                            str1 += '<option value="' + result.statuses[i].optType +
                                '">' + result.statuses[i].fxOpt + '</option>>'

                            _statusArr.push(result.statuses[i]);


                        }
                    }

                }

                //条件查询的状态
                $('#line-point').empty().append(str);

                //操作选择
                $('#optioning').empty().append(str1);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //条件查询
    function conditionSelect(){

        var ckArr = [];

        for(var i=0;i<_AWarehouseArr.length;i++){

            ckArr.push(_AWarehouseArr[i].storageNum);

        }

        var prm = {

            //工单号
            'gdCode2':'',
            //开始时间
            'st':$('.min').val(),
            //结束时间
            'et':moment($('.max').val()).add(1,'d').format('YYYY/MM/DD'),
            //物品编号
            'itemNum':$('#itemNum').val(),
            //物品名称
            'itemName':$('#itemName').val(),
            //序列号
            'sn':$('#itemSn').val(),
            //返修件进度
            'fxStatus':$('#line-point').val(),
            //车站
            'bxKeshiNum':$('#station').val(),
            //车间
            'wxChejianNum':$('#workshop').val(),
            //维修班组
            'wxKeshiNum':$('#group').val(),
            //用户ID
            'userID':_userIdNum,
            //用户姓名
            'userName':_userIdName,
            //用户角色
            'b_UserRole':_userRole,
            //当前部门
            'b_DepartNum':_loginUser.departNum,
            //条件参数
            'clType':_status,
            //仓库
            'storageNums':ckArr
        };

        //车站的数组
        var cheArr = [];

        //维修班组的数组
        var banArr = [];

        //判断线路和车站
        if($('#station').val() == ''){

            //分析线点是否为空
            if( $('#linePoint').val() == '' ){



            }else{

                cheArr.length = 0;

                var optionNum = $('#station').children();

                for(var i=1;i<optionNum.length;i++){

                    cheArr.push(optionNum.eq(i).attr('value'));

                }

                prm.wxKeshis = cheArr;

            }

        }else{

            prm.wxKeshi = $('#station').val();

        }


        //判断车间和班组
        if( $('#group').val() == '' ){

            if( $('#workshop').val() =='' ){



            }else{

                banArr.length = 0;

                var optionNum = $('#group').children();

                for(var i=1;i<optionNum.length;i++){

                    banArr.push(optionNum.eq(i).attr('value'));

                }

                prm.bxKeshiNums = banArr;


            }

        }else{

            prm.bxKeshiNum = $('#group').val();

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXGetGDItem',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _datasTable($('#scrap-datatables'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //绑定数据
    function bindData($this){

        //样式
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        _fxCode = $this.parents('tr').children('.fxCode').children().html();

        var prm = {

            //工单号
            'fxCode':_fxCode,
            //用户ID
            'userID':_userIdNum,
            //用户姓名
            'userName':_userIdName,
            //用户角色
            'b_UserRole':_userRole,
            //当前部门
            'b_DepartNum':_loginUser.departNum

        }

        //发送请求
        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXGetDetail',
            timeout:_theTimes,
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){
                //赋值
                var el = $('#fxGoods').find('input')
                //返修件id
                $(el).eq(0).val(result.fxCode);
                //所属工单号
                $(el).eq(1).val(result.gdCode2);
                //返修件编码
                $(el).eq(2).val(result.itemNum);
                //返修件名称
                $(el).eq(3).val(result.itemName);
                //返修件序列号
                $(el).eq(4).val(result.sn);
                //规格型号
                $(el).eq(5).val(result.size);
                //故障原因
                $(el).eq(6).val(result.fxReason);
                //快递信息
                $(el).eq(7).val(result.fxKdinfo);
                //车站
                $(el).eq(8).val(result.staName);
                //车间
                $(el).eq(9).val(result.departName);

                //当前的状态
                $('#nowStatus').val(result.fxStatusName);

                $('#nowStatus').attr('data-num',result.fxStatus);

                //已存在的材料
                _selectedBJ.length = 0;

                if(result.fxCls){

                    for(var i=0;i<result.fxCls.length;i++){

                        //_selectedBJ.push(result.fxCls[i]);

                        var obj = {};
                        //名称
                        obj.mc = result.fxCls[i].fxClName;
                        //编码
                        obj.bm = result.fxCls[i].fxCl;
                        //规格型号
                        obj.size = result.fxCls[i].size;
                        //单位
                        obj.dw = result.fxCls[i].unitName;
                        //数量
                        obj.sl = result.fxCls[i].clShul;
                        //分类
                        obj.cateName = result.fxCls[i].cateName;
                        //单价
                        obj.dj = result.fxCls[i].fxClPrice;
                        //id
                        obj.id = result.fxCls[i].fxClID;
                        //金额
                        obj.je = result.fxCls[i].fxClAmount;

                        _selectedBJ.push(obj);

                    }

                    //赋值
                    _datasTable($('#cl-list'),_selectedBJ);

                    //合计金额

                    var totalNum = 0;

                    for(var i=0;i<_selectedBJ.length;i++){

                        totalNum += Number(_selectedBJ[i].je);

                    }

                    $('#total').val(totalNum.toFixed(2));

                }else{

                    var arr = [];

                    _datasTable($('#cl-list'),arr);


                }

                //操作

                $('.repairType').hide();

                for(var i=0;i<_statusArr.length;i++){

                    if( _statusArr[i].fxStatus == result.fxStatus ){

                        $('#optioning').val(_statusArr[i].optType);

                        if(_statusArr[i].optType == 'zixiu'){

                            $('.ownRepair').show();

                        }else if(_statusArr[i].optType == 'fanchang'){

                            $('.factoryRepair').show();

                        }else if(_statusArr[i].optType == 'baofei'){

                            $('.scrapBlock').show();

                        }else if(_statusArr[i].optType == 'zhuku'){

                            $('.majorBlock').show();

                        }

                    }

                }

                //自修单价
                $('#hourFee').val(result.zxPrice.toFixed(2));

                //返厂修数据绑定

                var inputValues = $('.factoryRepair').find('input');

                //返厂修日期
                inputValues.eq(0).val(result.fcShij.split(' ')[0]);

                //厂家名称
                $('#factory').val(result.cusNum);

                //快递公司
                inputValues.eq(1).val(result.fcKdComp);

                //快递单号
                inputValues.eq(2).val(result.fcKdinfo);

                //预计到达时间
                inputValues.eq(3).val(result.estbackDate.split(' ')[0]);

                //厂家发货日期
                inputValues.eq(4).val(result.backDate);

                //快递公司
                inputValues.eq(5).val(result.fckdComp2);

                //快递单号
                inputValues.eq(6).val(result.fckdInfo2);

                //收货地点
                inputValues.eq(7).val(result.receiveAddr);

                //报废备注
                $('.scrapBlock').find('textarea').val(result.remark);

                //完成备注
                $('.finishRemark').find('textarea').val(result.remark);

                //返回主库信息
                $('.majorBlock').find('textarea').val(result.fzInfo);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    }

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
        //所有提示信息隐藏
        $('.errorJE').hide();

        $('.errorDJ').hide();

        $('.errorSL').hide();
    }

    //获取所有物品列表
    function ClListData(flag){
        var str = '';

        if($('#flmcs').val() == ''){
            str = '';
        }else{
            str = $('#flmcs').children('option:selected').html();
        }

        var prm = {
            itemNum : $.trim($('#wpbms').val()),
            itemName: $.trim($('#wpmcs').val()),
            cateName: str,
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            data:prm,
            success:function(result){

                if(flag){

                    _allWLArr.length = 0;

                    for(var i=0;i<result.length;i++){
                        _allWLArr.push(result[i]);
                    }

                }

                _datasTable($('#weiXiuCaiLiaoTable'),result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //自修操作
    function ownRepairFun(){

        //确定状态
        var status = '';

        for(var i=0;i<_statusArr.length;i++){

            if(_statusArr[i].optType == $('#optioning').val()){

                status = _statusArr[i].fxStatus

            }

        }

        var prm = {
            //返修编号
            "fxCode": _fxCode,
            //返修状态
            "fxStatus": status,
            //返修单价
            "zxPrice": $('#hourFee').val(),
            //用户ID
            "userID": _userIdNum,
            //用户名
            "userName": _userIdName,
            //用户角色
            "b_UserRole": _userRole,
            //用户部门
            "b_DepartNum": _loginUser.departNum
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFxZixiu',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _zxIsComplete = true;

                if(result == 99){

                    _zxIsSuccess = true;

                }else{

                    _zxIsSuccess = false;

                }

                ZXFun();

            },
            error:function(jqXHR, textStatus, errorThrown){

                _zxIsComplete = true;

                _zxIsSuccess = false;

                console.log(jqXHR.responseText);
            }

        })

    }

    //维修材料
    function clOption(){

        var arr = [];

        for(var i=0;i<_selectedBJ.length;i++){

            var obj = {};

            //维修材料关联表ID，自增ID ,
            obj.fxClID = _selectedBJ[i].id;
            //维修材料ID
            obj.fxCl = _selectedBJ[i].bm;
            //材料名
            obj.fxClName = _selectedBJ[i].mc;
            //数量
            obj.clShul = _selectedBJ[i].sl;
            //对应返修件Id
            obj.fxCode = _fxCode;
            //分类
            obj.cateName = _selectedBJ[i].cateName;
            //规格型号
            obj.size = _selectedBJ[i].size;
            //单位
            obj.unitName = _selectedBJ[i].dw;
            //维修材料单价
            obj.fxClPrice = _selectedBJ[i].dj;
            //维修材料金额
            obj.fxClAmount = Number(Number(obj.clShul) * Number(obj.fxClPrice)).toFixed(2);

            arr.push(obj);

        }

        var prm = {
            //返修编号
            "fxCode": _fxCode,
            //用户ID
            "userID": _userIdNum,
            //用户名
            "userName": _userIdName,
            //用户角色
            "b_UserRole": _userRole,
            //用户部门
            "b_DepartNum": _loginUser.departNum,
            //材料数组
            "fxWxCls": arr
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXAddFxCl',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _clIsComplete = true;

                if(result == 99){

                    _clIsSuccess = true;

                }else{

                    _clIsSuccess = false;

                }

                ZXFun();

            },
            error:function(jqXHR, textStatus, errorThrown){

                _clIsComplete = true;

                _clIsSuccess = false;

                console.log(jqXHR.responseText);
            }

        })
    }

    //自修和维修材料执行完毕的回调函数
    function ZXFun(){

        //全都完成
        if( _clIsComplete && _zxIsComplete ){

            var str = '';

            //是否成功
            if( _clIsSuccess ){

                str += '材料添加成功!'

            }else{

                str += '材料添加失败!'

            }
            if( _zxIsSuccess){

                str += '操作成功!'

            }else{

                str += '操作失败!'

            }

            _moTaiKuang($('#myModal2'),'提示',true,'istap',str,'');

            $('#theLoading').modal('hide');

            if( _clIsSuccess && _zxIsSuccess ){

                $('#myModal').modal('hide');

                conditionSelect();

            }

        }

    }

    //返修管理模态框初始化
    function fxInit(){

        $('#fxGoods').children('div').eq(1).find('input').val('');

        $('#fxGoods').children('div').eq(1).find('select').val('');

        $('#fxGoods').children('div').eq(1).find('textarea').val('');

        $('#nowStatus').val('').removeAttr('data-num');

        $('#optioning').val('');

        $('.ownRepair').hide();

        $('.factoryRepair').hide();

        $('.scrapBlock').hide();

    }

    //返厂修
    function factoryRepairFun(){

        //确定状态
        var status = '';

        for(var i=0;i<_statusArr.length;i++){

            if(_statusArr[i].optType == $('#optioning').val()){

                status = _statusArr[i].fxStatus

            }

        }

        var inputValues = $('.factoryRepair').find('input');

        var name = '';

        if($('#factory').val() == ''){

            name = '';

        }else{

            name = $('#factory').children('option:selected').html();

        }

        var prm = {

            //返修编码
            fxCode: _fxCode,
            //返修件状态
            fxStatus: status,
            //返厂时间
            fcShij: inputValues.eq(0).val(),
            //厂家名称
            cusName:name,
            //厂家编码
            cusNum:$('#factory').val(),
            //厂家返回的快递公司
            fckdComp:inputValues.eq(1).val(),
            //快递信息（单号）
            fckdinfo: inputValues.eq(2).val(),
            //预计到达时间
            estbackDate:inputValues.eq(3).val(),
            //厂家返回的发货日期
            backDate:inputValues.eq(4).val(),
            //厂家返回的快递公司
            fckdComp2:inputValues.eq(5).val(),
            //厂家返回的快递单号
            fckdInfo2:inputValues.eq(6).val(),
            //厂家返回的收货地址
            receiveAddr:inputValues.eq(7).val(),
            //用户ID
            'userID':_userIdNum,
            //用户姓名
            'userName':_userIdName,
            //用户角色
            'b_UserRole':_userRole,
            //当前部门
            'b_DepartNum':_loginUser.departNum

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXFC',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示',true,'istap','操作成功！','');

                    $('#myModal').modal('hide');

                    conditionSelect();

                }else {

                    _moTaiKuang($('#myModal2'),'提示',true,'istap','操作失败！','');

                }


            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);
            }

        })

    }

    //厂家下拉列表
    function factoryFun(){

        $.ajax({
            type:'get',
            url:_urls + 'YWCK/GetAllYWCKSupplier',
            data:{
                supName:''
            },
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].supNum +'"' + 'data-Content="' + result[i].linkPerson + '"' + 'data-phone="' + result[i].phone + '">'
                        + result[i].supName + '</option>';

                }

                $('#factory').empty().append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    }

    //报废
    function scrapFun(){

        var status = {};

        for(var i=0;i<_statusArr.length;i++){

            if(_statusArr[i].optType == $('#optioning').val()){

                status.statusNum = _statusArr[i].fxStatus;

                status.statusName = _statusArr[i].fxStatusName;

                status.colTo = _statusArr[i].clTo;
            }

        }

        var prm = {
            //返修编码
            "fxCode": _fxCode,
            //返修状态
            "fxStatus": status.statusNum,
            //返修状态名称
            "fxStatusName": status.statusName,
            //跳转
            "clTo": status.colTo,
            //报废备注
            "fxBeizhu": $('.scrapBlock').find('textarea').val(),
            //用户id
            "userID": _userIdNum,
            //用户名
            "userName": _userIdName,
            //用户角色
            "b_UserRole": _userRole,
            //部门
            "b_DepartNum": _loginUser.departNum

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXClTo',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示',true,'istap','操作成功！','');

                    $('#myModal').modal('hide');

                    conditionSelect();

                }else {

                    _moTaiKuang($('#myModal2'),'提示',true,'istap','操作失败！','');

                }


            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);
            }

        })

    }

    //返回主库
    function returnMajorFun(){

        var status = {};

        for(var i=0;i<_statusArr.length;i++){

            if(_statusArr[i].optType == $('#optioning').val()){

                status.statusNum = _statusArr[i].fxStatus;

                status.statusName = _statusArr[i].fxStatusName;

                status.colTo = _statusArr[i].clTo;
            }

        }

        var prm = {
            //返修code
            "fxCode": _fxCode,
            //返修状态 ,
            "fxStatus": status.statusNum,
            //返修状态名 ,
            "fxStatusName": status.statusName,
            //转后后返修状态 ,
            "clTo": status.colTo,
            //备注
            "fzInfo": $('.majorBlock').find('textarea').val(),
            //用户ID
            "userID": _userIdNum,
            //用户姓名 ,
            "userName": _userIdName,
            //用户角色 ,
            "b_UserRole": _userRole,
            //当前用户的部门
            "b_DepartNum": _loginUser.departNum

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXFZ',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示',true,'istap','操作成功！','');

                    $('#myModal').modal('hide');

                    conditionSelect();

                }else {

                    _moTaiKuang($('#myModal2'),'提示',true,'istap','操作失败！','');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);
            }
        })

    }

    //获取日志
    function logFile(){

        var prm = {
            fxCode: _fxCode,
            logType: 2,
            userID: _userIdNum,
            userName: _userIdName,
            b_UserRole: _userRole,
            b_DepartNum: _loginUser.departNum
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXGetLog',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                //console.log(result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }


})