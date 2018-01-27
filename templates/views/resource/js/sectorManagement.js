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
            }
        }
    })
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
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

        }

    ]

    var excelCol = [0,1,2]

    _tableInit($('#personal-table'),mainCol,1,true,'','','',excelCol);

    conditionSelect();

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

    //登记【确定按钮】
    $('#myModal').on('click','.dengji',function(){

        buttonOption('RBAC/rbacAddDepart',true,'新增成功!','新增失败！');

    })

    //编辑【确定按钮】
    $('#myModal').on('click','.bianji',function(){

        buttonOption('RBAC/rbacUptDepart',true,'编辑成功!','编辑失败！');

    })

    //删除【确定按钮】
    $('#myModal').on('click','.shanchu',function(){

        buttonOption('RBAC/rbacDelDepart',false,'删除成功!','删除失败！');

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
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

            },
            success:function(result){

                _allDepartmentArr = [];

                for(var i=0;i<result.length;i++){

                    _allDepartmentArr.push(result[i]);

                }

                _datasTable($('#personal-table'),result);

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
        //上级部门
        department.higherdepartment = '';
        //排序
        department.order = '';
        //备注
        department.remarks = '';

    }

    //可操作
    function abledOption(){

        //input不可操作
        $('#department').find('input').attr('disabled',false).removeClass('disabled-block');

        //select不可操作
        $('#department').find('select').attr('disabled',false).removeClass('disabled-block');

        //textarea不可操作
        $('#department').find('textarea').attr('disabled',false).removeClass('disabled-block');

    }

    //不可操作
    function disabledOption(){

        //input不可操作
        $('#department').find('input').attr('disabled',true).addClass('disabled-block');

        //select不可操作
        $('#department').find('select').attr('disabled',true).addClass('disabled-block');

        //textarea不可操作
        $('#department').find('textarea').attr('disabled',true).addClass('disabled-block');

    }

    //绑定数据
    function bindingData(el){

        var thisBM = el.parents('tr').children('.departNum').html();

        for(var i=0;i<_allDepartmentArr.length;i++){

            if( _allDepartmentArr[i].departNum == thisBM ){
                //部门编码
                department.num = _allDepartmentArr[i].departNum;
                //部门名称
                department.name = _allDepartmentArr[i].departName;
                //上级部门
                department.higherdepartment = _allDepartmentArr[i].parentNum;
                //排序
                department.order = _allDepartmentArr[i].sort
            }
        }

    }

    //登记编辑功能(flag为真的时候是编辑和登记，假是删除)
    function buttonOption(url,flag,successMeg,errorMeg){

        //验证
        if(department.name == ''){

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
                    "userID":_userIdNum

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

})