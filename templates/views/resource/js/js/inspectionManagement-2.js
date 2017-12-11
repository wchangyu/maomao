$(function(){
    /*--------------------------------------设置全局变量-----------------------------------------*/
    //新增巡检内容vue对象
    var workDone = new Vue({
        el:'#workDone',
        data:{
            xjnrbm:'',
            xjnrmc:'',
            beizhu:'',
            sbfl:'',
            options:[]
        }
    });

    //验证必填项（非空）
    Vue.validator('noempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //设备分类
    sbClass();

    //表格变量
    var _table = $('#scrap-datatables');
    var _tableAdd = $('#zhiXingPerson');
    var _tableXJ = $('#personTable1');

    //所有表格步骤信息
    var _allData = [];

    //所有巡检步骤
    var _allXJTMArr = [];

    //已选择的步骤
    var _allXJSelect = [];

    /*---------------------------------------表格初始化----------------------------------------*/
    //巡检内容表格
    var col = [
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
            data:'dcName'
        },
        {
            title:'备注',
            data:'remark'
        },
        {
            title:'创建时间',
            data:'createTime'
        },
        {
            title:'创建人',
            data:'createUser'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
            "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }
    ];
    _tableInit(_table,col,'1','flag','','');

    //添加巡检步骤表格
    var col1 = [
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
            title:'参考关系',
            data:'relation'
        }
    ];
    _tableInit(_tableAdd,col1,'1','','','');

    //巡检步骤已选结果表格
    var col2 = [
        {
            title:'设备类型',
            data:'dcName'
        },
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
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }
    ];
    _tableInit(_tableXJ,col2,'1','','','');

    //表格数据
    conditionSelect();

    /*--------------------------------------表格按钮事件-----------------------------------*/
    //选择巡检步骤（多选）
    //添加表头复选框
    var creatCheckBox = '<input type="checkbox">';
    $('thead').find('.checkeds').prepend(creatCheckBox);

    //复选框点击事件（添加巡检步骤）
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

    //点击确定已选择的步骤
    $('.selectTableList').click(function(){
        _allXJSelect = [];
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
        //模态框关闭
        $('#myModal1').modal('hide');
        //选择结果表格赋值
        _datasTable(_tableXJ,_allXJSelect);
    });

    //删除已选择的步骤
    _tableXJ.children('tbody').on('click','.option-delete',function(){
        //样式
        var $this = $(this).parents('tr');
        _tableXJ.children('tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        //添加类名
        $('#myModal2').find('.btn-primary').removeClass('dashanchu').addClass('xiaoshanchu');
        //赋值
        var $thisRow = $(this).parents('tr');
        $('#xjtmbm').val($thisRow.find('.bianma').html());
        $('#xjtmmc').val($thisRow.find('.bianma').next().html());
        //模态框显示
        _moTaiKuang($('#myModal2'), '确定要删除吗？', '', '' ,'', '删除');
    });

    //删除已选择步骤确定按钮
    $('#myModal2')
        .on('click','.xiaoshanchu',function(){
            //调用删除方法
            _allXJSelect.removeByValue($('#xjtmbm').val(),'ditNum');
            //模态框消失
            $('#myModal2').modal('hide');
            //表格赋值
            _datasTable(_tableXJ,_allXJSelect);
        })
        .on('click','.dashanchu',function(){
            var prm = {
                dicNum: $.trim($('#xjtmbm').val()),
                userID:_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDevIns/YWDIDelDIContent',
                data:prm,
                beforeSend: function () {
                    $('#theLoading').modal('hide');

                    $('#theLoading').modal('show');
                },

                complete: function () {

                    $('#theLoading').modal('hide');

                },
                success:function(result){
                    if(result == 99){
                        $('#myModal2').modal('hide');
                        //提示
                        _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,'删除成功！', '');
                        //刷新数据
                        conditionSelect();
                    }else{
                        _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,'删除失败！', '');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }
            })
        })

    //表格查看
    _table.children('tbody')
        .on('click','.option-see',function(){
            //信息绑定
            ckOrBj($(this),true,'flag');
        })
        .on('click','.option-edite',function(){
            //信息绑定
            ckOrBj($(this),false);

            //编码不可操作
            $('.xjbm').addClass('disabled-block');
        })
        .on('click','.option-delete',function(){
            //信息绑定
            var $this = $(this).parents('tr');
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            var $thisMC = $(this).parents('tr').children('.mingcheng').html();
            var $myModal = $('#myModal2');
            //moTaiKuang($myModal);
            _moTaiKuang($myModal, '确定要删除吗？', '', '' ,'', '删除');
            $myModal.find('.btn-primary').removeClass('xiaoshanchu').addClass('dashanchu');
            //赋值
            $('#xjtmbm').val($thisBM);
            $('#xjtmmc').val($thisMC);
        })


    /*---------------------------------------按钮事件--------------------------------------*/
    //新增按钮
    $('.creatButton').click(function(){

        //模态框显示
        _moTaiKuang($('#myModal'), '新增巡检内容', '', '' ,'', '新增');

        //确定按钮添加登记类
        $('#myModal').find('.btn-primary').show().removeClass('bianji').addClass('dengji');

        //输入框初始化
        detailedInit();

        //所有操作框可操作
        $('#workDone').children().children().children('.input-blockeds').children().attr('disabled',false).removeClass('disabled-block');

        //新增按钮显示
        $('.zhiXingRenYuanButton').show();

        //巡检编码
        $('.xjbm').addClass('disabled-block');

        //添加巡检内容表格初始化
        $('#zhiXingPerson tbody').children('tr').css('background','#ffffff');

        $('#zhiXingPerson tbody').children('tr').find('.checkeds').find('input').parent('span').removeClass('checked');

    });

    //新增确定按钮
    $('#myModal')
        .on('click','.dengji',function(){

            djOrBj('YWDevIns/YWDIADDDIContent',false,'添加成功！','添加失败！');

        })
        .on('click','.bianji',function(){

            djOrBj('YWDevIns/YWDIUptDIContent',true,'编辑成功！','编辑失败！');

        })
    //添加巡检步骤按钮
    $('.zhiXingRenYuanButton').click(function(){
        _tableAdd.children('thead').find('input').parent().removeClass('checked');
        var prm = {
            ditName:$('#shebeileixings').val(),
            dcNum:$('#filter_global').val(),
            userID:_userIdNum,
            userName:_userIdName
        };
        $.ajax({
            type:'post',
            url: _urls + 'YWDevIns/YWDIGetDIItems',
            data:prm,
            timeOut:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){
                _allXJTMArr.length = 0;
                for(var i=0;i<result.length;i++){
                    _allXJTMArr.push(result[i]);
                }
                _datasTable(_tableAdd,result);

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
                //模态框
                _moTaiKuang($('#myModal1'), '添加巡检步骤', '', '' ,'', '确定');
                //条件初始化
                $('#shebeileixings').val('');
                $('#filter_global').children('input').val('');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    })

    //添加巡检步骤条件搜索
    $('#selecte').click(function(){
        var prm = {
            ditName:$('#myModal1').find('#filter_global').children().val(),
            dcNum:$('#shebeileixings').val(),
            userID:_userIdNum,
            userName:_userIdName
        };
        $.ajax({
            type:'post',
            url: _urls + 'YWDevIns/YWDIGetDIItems',
            data:prm,
            timeOut:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){
                _allXJTMArr.length = 0;
                for(var i=0;i<result.length;i++){
                    _allXJTMArr.push(result[i]);
                }
                _datasTable(_tableAdd,result);
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
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    })

    //巡检内容条件查询按钮
    $('#selected').click(function(){

        conditionSelect();

    })


    /*--------------------------------------其他方法--------------------------------------*/
    //条件查询
    function conditionSelect(){
        var prm={
            dicName:$('.xjContent').val(),
            dcNum:$('#shebeileixing').val(),
            userID:_userIdNum,
            userName:_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIGetDIContents',
            data:prm,
            success:function(result){
                _allData.length = 0;
                for(var i=0;i<result.length;i++){
                    _allData.push(result[i]);
                }
                _datasTable(_table,result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //设备分类
    function sbClass(){
        var prm = {
            dcNum:'',
            dcName:'',
            dcPy:'',
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDCs',
            timeout:_theTimes,
            data:prm,
            success:function(result){
                var str = '<option value="">全部</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].dcNum +
                        '">' + result[i].dcName +
                        '</option>'
                }
                //巡检内容条件查询
                $('#shebeileixing').empty().append(str);
                //新增巡检内容
                $('#sblx').empty().append(str);
                //添加巡检步骤
                $('#shebeileixings').empty().append(str);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //查看/编辑绑定数据(flag:查看的时候传)
    function ckOrBj(el,zhi,flag){
        //初始化
        detailedInit();

        //修改样式
        var $this = el.parents('tr');

        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

        $this.addClass('tables-hover');

        //确定按钮隐藏
        if(flag){
            _moTaiKuang($('#myModal'), '查看详情', 'flag', '' ,'', '');
        }else{
            _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');
        }
        //获取内容下属步骤
        //首先确定当前点击之后的步骤编码
        var $thisBM = el.parents('tr').children('.bianma').html();
        //绑定显示数据
        for(var i=0;i<_allData.length;i++){
            if(_allData[i].dicNum == $thisBM){
                workDone.xjnrbm = _allData[i].dicNum;
                workDone.xjnrmc = _allData[i].dicName;
                workDone.sbfl = _allData[i].dcNum;
                workDone.beizhu = _allData[i].remark;
            }
        }
        var prm = {
            dicNum:$thisBM,
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIGetDICItems',
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

                _datasTable(_tableXJ,result);

                if(flag){
                    $('#personTable1').find('.option-delete').attr('disabled',true);
                    //添加巡检步骤按钮消失
                    $('.zhiXingRenYuanButton').hide();

                }else{
                    $('#personTable1').find('.option-delete').attr('disabled',false);
                    //添加巡检步骤按钮消失
                    $('.zhiXingRenYuanButton').show();
                    $('#myModal').find('.btn-primary').addClass('bianji');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        });
        if(flag){
            //所有操作框不可操作
            $('#workDone').children().children().children('.input-blockeds').children().attr('disabled',zhi).addClass('disabled-block');
        }else{
            //所有操作框可操作
            $('#workDone').children().children().children('.input-blockeds').children().attr('disabled',zhi).removeClass('disabled-block');
        }

    }

    //登记、编辑(flag = true;编辑，传编码)
    function djOrBj(url,flag,successMeg,errorMeg){

        //验证非空
        if(workDone.xjnrmc == '' || workDone.sbfl == ''){

            _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

        }else{

            var tableArr = [];

            for(var i=0;i<_allXJSelect.length;i++){
                var obj = {};
                obj.id = _allXJSelect[i].id;
                obj.ditNum = _allXJSelect[i].ditNum;
                tableArr.push(obj);
            }

            //select一定要判断
            var values = '';

            if(workDone.sbfl == ''){

                values = '';

            }else{

                values = $.trim($('#sblx').children('option:selected').html());

            }

            var prm = {
                dcNum:workDone.sbfl,
                dcName:values,
                dicName:workDone.xjnrmc,
                remark:workDone.beizhu,
                dicItems:tableArr,
                userID:_userIdNum,
                userName:_userIdName
            }

            if(flag){

                prm.dicNum = workDone.xjnrbm;

            }

            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                beforeSend: function () {
                    $('#theLoading').modal('hide');

                    $('#theLoading').modal('show');
                },

                complete: function () {

                    $('#theLoading').modal('hide');

                },
                success:function(result){
                    if(result == 99){
                        $('#myModal').modal('hide');
                        //提示
                        _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,successMeg,errorMeg);
                        conditionSelect()
                    }else{
                        _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,errorMeg,errorMeg);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }
            })
        }


    }

    //新增弹窗初始化
    function detailedInit(arr){

        //巡检内容编码
        workDone.xjnrbm = '';
        //巡检内容名称
        workDone.xjnrmc = '';
        //设备分类
        workDone.sbfl = '';
        //备注
        workDone.beizhu = '';

        //表格
        var arrInit = [];

        if(arr){

            _datasTable($('#personTable1'),arr);

        }else{

            _datasTable($('#personTable1'),arrInit);

        }

    }
})