

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

    //所有物品
    var _allWLArr = [];

    //选中的备件对象
    var _bjObject = {};

    //暂存选中材料的数组
    var _selectedBJ = [];

    //总费用
    var _totalFree = 0;

    /*------------------------------------------------------表格初始化----------------------------------------*/

    var col = [
        {
            title:'返修件code',
            data:'fxCode',
            className:'fxCode'
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
            "data": null,
            "className": 'noprint',
            "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
            "<span class='data-option option-beijian btn default btn-xs green-stripe'>维修备件管理</span>"
        }
    ];

    _tableInit($('#scrap-datatables'),col,1,true,'','','');

    conditionSelect();

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

    //物品列表
    ClListData(true);

    /*--------------------------------------------------------按钮--------------------------------------------*/

    $('#selected').click(function(){

        conditionSelect();

    })

    //维修备件管理
    $('#scrap-datatables').on('click','.option-beijian',function(){

        //初始化


        //模态框
        _moTaiKuang($('#myModal'),'返修件管理','','','','确定');

        //数据绑定
        bindData($(this));

        //是否可操作
        //绑定返修件信息部分不可操作
        $('#fxGoods').children('div').eq(0).find('input').attr('disabled',true).addClass('disabled-block');

        _totalFree = 0;

    })

    //【添加材料】按钮
    $('#myModal').find('.addCL').click(function(){

        //初始化
        clInit();

        console.log(_selectedBJ);

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

        $('#AddCL-Modal').modal('hide');

        _datasTable($('#cl-list'),_selectedBJ);

        _totalFree = 0;

        //计算共计费用
        for(var i=0;i<_selectedBJ.length;i++){

            _totalFree += parseFloat(_selectedBJ[i].je);

        }

        var total = Number($('#hourFee').val()) + Number(_totalFree);

        $('#total').val(total.toFixed(2));

        $('#hourFee').val(total.toFixed(2));
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

                var str = '<option value="">请选择</option>';

                var str1 = '<option value="">请选择</option>';

                for(var i=0;i<result.statuses.length;i++){

                    if(result.statuses[i].fxType == _status){

                        str += '<option value="' + result.statuses[i].fxStatus +
                            '">' + result.statuses[i].fxStatusName + '</option>>'

                        str1 += '<option value="' + result.statuses[i].optType +
                            '">' + result.statuses[i].fxOpt + '</option>>'
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

        var prm = {

            //工单号
            'gdCode2':'',
            //开始时间
            'st':st,
            //结束时间
            'et':moment(now).add(1,'d').format('YYYY/MM/DD'),
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
            'b_DepartNum':_loginUser.departNum
        };

        ////车站的数组
        //var cheArr = [];
        //
        ////维修班组的数组
        //var banArr = [];
        //
        ////判断线路和车站
        //if($('#station').val() == ''){
        //
        //    //分析线点是否为空
        //    if( $('#linePoint').val() == '' ){
        //
        //
        //
        //    }else{
        //
        //        cheArr.length = 0;
        //
        //        var optionNum = $('#station').children();
        //
        //        for(var i=1;i<optionNum.length;i++){
        //
        //            cheArr.push(optionNum.eq(i).attr('value'));
        //
        //        }
        //
        //        prm.wxKeshis = cheArr;
        //
        //    }
        //
        //}else{
        //
        //    prm.wxKeshi = $('#station').val();
        //
        //}
        //
        //
        ////判断车间和班组
        //if( $('#group').val() == '' ){
        //
        //    if( $('#workshop').val() =='' ){
        //
        //
        //
        //    }else{
        //
        //        banArr.length = 0;
        //
        //        var optionNum = $('#group').children();
        //
        //        for(var i=1;i<optionNum.length;i++){
        //
        //            banArr.push(optionNum.eq(i).attr('value'));
        //
        //        }
        //
        //        prm.bxKeshiNums = banArr;
        //
        //
        //    }
        //
        //}else{
        //
        //    prm.bxKeshiNum = $('#group').val();
        //
        //}

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

        var prm = {

            //工单号
            'fxCode':$this.parents('tr').children('.fxCode').html(),
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

})