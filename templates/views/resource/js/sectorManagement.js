$(function(){

    /*-----------------------------------------------变量-------------------------------------------------------*/
    //存放所有数据的数组
    var _allDepartmentArr = [];

    //vue对象
    var department = new Vue({
        el:'#department',
        data:{
            //部门编码
            num:'',
            //部门名称
            name:'',
            //班组
            station:'',
            //是否维修
            picked:0,
            //上级部门
            higherdepartment:'',
            //上级部门下拉框
            option:[],
            //排序
            order:'',
            //备注
            remarks:''
        },
        methods:{
            keyUp:function(){
                var existFlag = false;
                for(var i=0;i<_allDepartmentArr.length;i++){
                    if(_allDepartmentArr[i].departNum == department.num){
                        existFlag = true;
                    }
                }
                if(existFlag){

                    $('.isExist').show();

                }else{

                    $('.isExist').hide();

                }
            },
            radio:function(e){

                $('.inpus').parent('span').removeClass('checked');

                $(e.target).parent('span').addClass('checked');

            }
        }
    })

    //选择班组的时候，存放选中班组的数组（左边）
    var _selectBZArr = [];

    //选择班组的时候，存放已选中班组的数组（右边）
    var _uniqueBZArr = [];

    //删除当前选中的班组的编码
    var _thisBZBM = '';

    //存放所有班组的数组
    var _allBZArr = [];

    //保存当前对象
    var _that = '';

    //获取部门属性
    getDepartCate();

    /*-----------------------------------------------表格初始化--------------------------------------------------*/

    var mainCol = [

        {
            title:'部门名',
            data:'departName'
        },
        {
            title:'部门编码',
            data:'departNum',
            className:'departNum'
        },
        {
            title:'上级部门',
            data:'parentNum'
        },
        {
            title:'维保范围',
            data:'dDnamejoint'
        },
        {
            title:'操作',
            "data": 'isWx',
            render:function(data, type, full, meta){
                if(data == 0){

                    return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                        "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

                }else{

                    return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                        "<span class='data-option option-area btn default btn-xs green-stripe'>维保范围管理</span>"+
                        "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

                }
            }

        }

    ]

    var excelCol = [0,1,2]

    _tableInit($('#personal-table'),mainCol,1,true,'','','',excelCol);

    //条件查询
    conditionSelect();

    //所有车站列表
    var ststionCal = [

        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'名称',
            data:'ddName'
        },
        {
            title:'编码',
            data:'ddNum'
        }

    ];

    _tableInit($('#station-table'),ststionCal,1,'','','','','');

    //已被选中的表格
    var selectedCal = [

        {
            title:'名称',
            data:'ddName'
        },
        {
            title:'编码',
            data:'ddNum'
        },
        {
            "title":'操作',
            "targets": -1,
            "data": null,
            "defaultContent": '<span class="data-option option-edit btn default btn-xs green-stripe">删除</span>'
        }

    ];

    _tableInit($('#already-table'),selectedCal,1,'','','','','','',true);

    //添加表头复选框
    var creatCheckBox = '<div class="checker"><span><input type="checkbox"></span></div>';

    $('thead').find('.checkeds').prepend(creatCheckBox);

    //清空表头按钮
    var empty = '<span class="data-option option-edit btn default btn-xs green-stripe">清空</span>';

    $('thead').find('.emptyArr').prepend(empty);

    //车站列表
    stationData(true);

    /*-------------------------------------------------按钮事件--------------------------------------------------*/

    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //【重置】
    $('.resites').click(function(){

        $('#bmmc').val('')

    })

    //【新增】
    $('.creatButton').click(function(){

        //loadding显示
        $('#theLoading').modal('show');

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'), '新增', '', '' ,'', '新增');

        //是否可操作
        abledOption();

        //类
        $('#myModal').find('.modal-footer').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //loadding消失
        $('#theLoading').modal('hide');

    })

    //表格【查看】
    $('#personal-table').on('click','.option-see',function(){

        //loadding显示
        $('#theLoading').modal('show');

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'), '查看', true, '' ,'', '');

        //绑定值
        bindingData($(this));

        //是否可操作
        disabledOption();

        //loadding消失
        $('#theLoading').modal('hide');

    })

    //表格【编辑】
    $('#personal-table').on('click','.option-edit',function(){

        //loadding显示
        $('#theLoading').modal('show');

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');

        //绑定值
        bindingData($(this));

        //是否可操作
        abledOption();

        //部门编码不可操作
        $('#department').find('.bmbm').attr('disabled',true).addClass('disabled-block');

        //loadding消失
        $('#theLoading').modal('hide');

        //类
        $('#myModal').find('.modal-footer').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

    })

    //表格【删除】
    $('#personal-table').on('click','.option-delete',function(){

        //loadding显示
        $('#theLoading').modal('show');

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'), '确定要删除吗？', '', '' ,'', '删除');

        //绑定值
        bindingData($(this));

        //是否可操作
        disabledOption();

        //loadding消失
        $('#theLoading').modal('hide');

        //类
        $('#myModal').find('.modal-footer').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

    })

    //表格【维保范围】
    $('#personal-table').on('click','.option-area',function(){

        _that = $(this);

        //样式
        $('#personal-table tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //初始化
        BZData();

        //模态框
        _moTaiKuang($('#station-Modal'),'维保范围管理','','','','确定');

        //数据绑定
        $.ajax({

            type:'post',
            url:_urls + 'RBAC/SysDepDepGetList',
            data:{
                //部门编码
                departNum:$(this).parents('tr').children().eq(1).html()
            },
            timeout:_theTimes,
            beforeSend: function () {

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){

                for(var i=0;i<result.length;i++){

                    _uniqueBZArr.push(result[i]);

                }

                _datasTable($('#already-table'),_uniqueBZArr);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //清除loadding
                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

                }

            }
        })

    })

    //登记【确定按钮】
    $('#myModal').on('click','.dengji',function(){

        buttonOption('RBAC/rbacAddDepartII',true,'新增成功!','新增失败！');

    })

    //编辑【确定按钮】
    $('#myModal').on('click','.bianji',function()   {

        buttonOption('RBAC/rbacUptDepartII',true,'编辑成功!','编辑失败！');

    })

    //删除【确定按钮】
    $('#myModal').on('click','.shanchu',function(){

        buttonOption('RBAC/rbacDelDepart',false,'删除成功!','删除失败！');

    })

    //车站表格选择
    $('#station-table').on('click','tr',function(){

        MultiselectTr($(this));

    })

    //表格全选
    $('#station-table thead').on('click','input',function(){

        AllSelectThead($(this),$('#station-table'));

    })

    //选择班组【确定】按钮
    $('#station-Modal').on('click','.btn-info',function(){

        var checkedTr = $('#station-table tbody').children('.tables-hover');

        _selectBZArr.length = 0;

        for(var i=0;i<checkedTr.length;i++){

            var obj = {};

            obj.ddName = checkedTr.eq(i).children().eq(1).html();

            obj.ddNum = checkedTr.eq(i).children().eq(2).html();

            _selectBZArr.push(obj);

        }

        //左边表格初始化
        _datasTable($('#station-table'),_allBZArr);

        //将数组去重后，放入_uniqueBZArr中
        _uniqueArr(_uniqueBZArr,_selectBZArr,'ddNum');

        _datasTable($('#already-table'),_uniqueBZArr);

    })

    //已选中的班组【删除】按钮
    $('#already-table tbody').on('click','.option-edit',function(){

        //样式
        $('#already-table tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //删除
        _thisBZBM = $(this).parents('tr').children().eq(1).html();

        //模态框提示
        _moTaiKuang($('#DEL-Modal'),'提示','','istap','确定要删除吗？','删除');

        //类
        $('#DEL-Modal').find('.btn-primary').removeClass('all-delete').addClass('static-delete');

    })

    //【静态删除】确定按钮
    $('#DEL-Modal').on('click','.static-delete',function(){

        _uniqueBZArr.removeByValue(_thisBZBM,'ddNum');

        _datasTable($('#already-table'),_uniqueBZArr);

        $('#DEL-Modal').modal('hide');

    })

    //【清空】按钮
    $('#station-Modal').on('click','.btn-danger',function(){

        //模态框
        _moTaiKuang($('#DEL-Modal'),'提示','','istap','确定要清除选中的班组吗？','删除');

        //类
        $('#DEL-Modal').find('.btn-primary').removeClass('static-delete').addClass('all-delete');

    })

    //清空【确定按钮】
    $('#DEL-Modal').on('click','.all-delete',function(){

        _uniqueBZArr.length = 0;

        _datasTable($('#already-table'),_uniqueBZArr);

        $('#DEL-Modal').modal('hide');

    })

    //车站确定已选中的按钮
    $('#station-Modal').on('click','.btn-primary',function(){

        var str = '';

        for(var i=0;i<_uniqueBZArr.length;i++){

            if(i == _uniqueBZArr.length-1){

                str += _uniqueBZArr[i].departName;

            }else{

                str += _uniqueBZArr[i].departName + ',';

            }

        }

        department.station = str;

    })

    //车站条件查询
    $('#station-Modal').on('click','.btn1',function(){

        stationData(false);

    })

    //修改、添加维保范围管理
    $('#station-Modal').on('click','.btn-primary',function(){

        stationArea(_that);

    })
    /*-------------------------------------------------其他方法--------------------------------------------------*/

    //条件查询
    function conditionSelect(){
        //获取条件
        var prm = {
            //部门名称
            "departName":$('#bmmc').val(),
            //用户id
            "userID":_userIdNum
        }
        $.ajax({
            type:'post',
            url: _urls + 'RBAC/rbacGetDeparts',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {

                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){

                _allDepartmentArr = [];

                for(var i=0;i<result.length;i++){

                    _allDepartmentArr.push(result[i]);

                }

                _jumpNow($('#personal-table'),result);

                department.option = [];

                var obj = {
                    text:'请选择',
                    value:''
                }
                department.option.push(obj);

                for(var i=0;i<result.length;i++){
                    if(result[i].parentNum == ''){
                        var obj = {};
                        obj.text = result[i].departName;
                        obj.value = result[i].departNum;
                        department.option.push(obj);
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //清除loadding
                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

                }

            }
        })
    }

    //初始化
    function detailInit(){

        //部门编码
        department.num = '';
        //部门名称
        department.name = '';
        //是否维修
        department.picked = 0;
        //车站
        department.station = '';
        //上级部门
        department.higherdepartment = '';
        //排序
        department.order = '';
        //备注
        department.remarks = '';
        //单选样式
        $('.inpus').parent().removeClass('checked');

        $('#twos').parent().addClass('checked');

    }

    //可操作
    function abledOption(){

        //input不可操作
        $('#department').find('input').attr('disabled',false).removeClass('disabled-block');

        //select不可操作
        $('#department').find('select').attr('disabled',false).removeClass('disabled-block');

        //textarea不可操作
        $('#department').find('textarea').attr('disabled',false).removeClass('disabled-block');

        //单选按钮
        $('#ones').parents('.input-blockeds').removeClass('disabled-block');

    }

    //不可操作
    function disabledOption(){

        //input不可操作
        $('#department').find('input').attr('disabled',true).addClass('disabled-block');

        //select不可操作
        $('#department').find('select').attr('disabled',true).addClass('disabled-block');

        //textarea不可操作
        $('#department').find('textarea').attr('disabled',true).addClass('disabled-block');

        //单选按钮
        $('#ones').parents('.input-blockeds').addClass('disabled-block');

    }

    //绑定数据
    function bindingData(el){

        var thisBM = el.parents('tr').children('.departNum').html();

        for(var i=0;i<_allDepartmentArr.length;i++){

            if( _allDepartmentArr[i].departNum == thisBM ){

                console.log(_allDepartmentArr[i]);

                //部门编码
                department.num = _allDepartmentArr[i].departNum;
                //部门名称
                department.name = _allDepartmentArr[i].departName;
                //上级部门
                department.higherdepartment = _allDepartmentArr[i].parentNum;
                //排序
                department.order = _allDepartmentArr[i].sort;
                //部门属性
                $('#depart-attr').val(_allDepartmentArr[i].departcate);
            }
        }

    }

    //登记编辑功能(flag为真的时候是编辑和登记，假是删除)
    function buttonOption(url,flag,successMeg,errorMeg){

        //验证
        if(department.name == '' || department.num == ''){

            _moTaiKuang($('#myModal2'),'提示',true,'istap','请填写红色必填项！','');

        }else{

            if(flag){

                var prm = {
                    //部门编码
                    "departNum":department.num,
                    //部门名称
                    "departName":department.name,
                    //上级部门
                    "parentNum":department.higherdepartment,
                    //排序
                    "sort":department.order,
                    //用户id
                    "userID":_userIdNum,
                    //isWX
                    "isWx":department.picked,
                    //属性
                    "departcate":$('#depart-attr').val()

                }

            }else{

                var prm = {
                    //部门编码
                    "departNum":department.num,
                    //用户id
                    "userID":_userIdNum
                }

            }

            $.ajax({

                type:'post',
                url:_urls + url,
                data:prm,
                timeout:_theTimes,
                beforeSend: function () {
                    $('#theLoading').modal('hide');

                    $('#theLoading').modal('show');
                },

                complete: function () {

                    $('#theLoading').modal('hide');

                    //if($('.modal-backdrop').length > 0){
                    //
                    //    $('div').remove('.modal-backdrop');
                    //
                    //    $('#theLoading').hide();
                    //}

                },
                success:function(result){

                    if(result == 99){

                        conditionSelect();

                        $('#myModal').modal('hide');

                        _moTaiKuang($('#myModal2'),'提示',true,'istap',successMeg,'');

                    }else{

                        _moTaiKuang($('#myModal2'),'提示',true,'istap',errorMeg,'');

                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    //清除loadding
                    $('#theLoading').modal('hide');

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                        _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

                    }else{

                        _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

                    }

                }

            })


        }

    }

    //获取所有车站
    function stationData(flag){

        var prm = {
            //部门编码
            "ddNum": $('#station-Modal').find('ul').find('input').eq(0).val(),
            //部门名称
            "ddName": $('#station-Modal').find('ul').find('input').eq(1).val(),
            //用户id
            "userID": _userIdNum,
            //用户名
            "userName": _userIdName,
            //角色
            "b_UserRole": _userRole,
            //部门
            "b_DepartNum": _maintenanceTeam
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDDs',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                if(flag){

                    _allBZArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _allBZArr.push(result[i]);

                    }

                }

                _datasTable($('#station-table'),result);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //清除loadding
                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

                }

            }

        })

    }

    //班组选择初始化
    function BZData(){

        _selectBZArr.length = 0;

        _uniqueBZArr.length = 0;

        //左边表格初始化
        _datasTable($('#station-table'),_allBZArr);

        //右边表格初始化
        _datasTable($('#already-table'),_uniqueBZArr);

        //全选按钮
        $('#station-table thead').find('input').parent().removeClass('checked');

        //条件查询初始化
        $('#station-Modal').find('ul').find('input').val('');

    }

    //添加、编辑维保范围
    function stationArea(el){
        var prm = {
            //上级部门
            "parentNum": el.parents('tr').children().eq(2).html(),
            //部门编码
            "departNum": el.parents('tr').children().eq(1).html(),
            //车站
            "ddepMoeles": _uniqueBZArr,
        }

        $.ajax({

            type:'post',
            url:_urls + 'RBAC/SysDepDepAddOrUpdate',
            timeout:_theTimes,
            data:prm,
            beforeSend: function () {

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'操作成功！', '');

                    $('#station-Modal').modal('hide');

                    conditionSelect();

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'操作失败！', '');

                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //清除loadding
                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

                }

            }

        })
    }

    //获取部门属性常量
    function getDepartCate(){

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetDepartCate','',false,function(result){

            var str = '<option value=""></option>';

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    var data = result.data[i]

                    str += '<option value="' + data.departcate + '">' + data.departcatename + '</option>'

                }

            }

            $('#depart-attr').empty().append(str);


        })

    }
})