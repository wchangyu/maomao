$(function(){

    //条件查询的科室统一名称：MWDep；模态框中的条件直接用模糊搜索

    //科室
    var _depArr = [];

    MWDopFun();

    /*-------------------------------科室表格------------------------------------------*/

    //科室
    var depCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.departNum + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'科室编码',
            data:'departNum'
        },
        {
            title:'科室名称',
            data:'departName'
        }

    ]

    _tableInitSearch($('#dep-table-con'),depCol,'2','','','','','',10,'','','',true);

    //模态框
    if($('#dep-table')){

        _tableInitSearch($('#dep-table'),depCol,'2','','','','','',10,'','','',true);

    }
    /*-------------------------------条件查询的科室查询功能-------------------------------*/

    //条件选择科室
    $('.select-dep').click(function(){

        //初始化
        depConInit();

        //模态框
        _moTaiKuang($('#dep-Modal-con'),'科室列表','','','选择');

        //赋值
        _datasTable($('#dep-table-con'),_depArr)


    })

    //确定【科室】
    $('#dep-Modal-con').on('click','.btn-primary',function(){

        var currentTr = $('#dep-table-con tbody').find('.tables-hover');

        if(currentTr.length >0){

            var num = currentTr.find('.checker').attr('data-id');

            var name = currentTr.children('td').eq(2).html();

            $('#MWDep').attr('data-id',num);

            $('#MWDep').val(name);

            $('#dep-Modal-con').modal('hide');

        }else{

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择科室','');

        }

    })

    $('#dep-Modal-con').on('shown.bs.modal',function(){

        _isClickTr = true;

        _isClickTrMulti = false;

    })

    $('#dep-Modal-con').on('hidden.bs.modal',function(){

        _isClickTr = false;

        _isClickTrMulti = false;

    })

    //删除科室
    $('#removeDep').click(function(){

        var inputBlock = $(this).prev();

        inputBlock.val('');

        inputBlock.removeAttr('data-id');

    })

    /*-------------------------------模态框中的科室--------------------------------------*/

    //选择【科室】
    $('.modal-select-dep').click(function(){

        //初始化
        _datasTable($('#dep-table'),[]);

        //数据
        _datasTable($('#dep-table'),_depArr);

        //模态框
        _moTaiKuang($('#dep-Modal'),'科室列表','','','','选择');


    })

    //选择科室
    $('#dep-Modal').on('click','.btn-primary',function(){

        var currentTr = $('#dep-table tbody').find('.tables-hover');

        if(currentTr.length >0){

            var num = currentTr.find('.checker').attr('data-id');

            var name = currentTr.children('td').eq(2).html();

            $('#MW-dep').attr('data-id',num);

            $('#MW-dep').val(name);

            $('#dep-Modal').modal('hide');

            $('#MW-dep').next('.error').hide();


        }else{

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择科室','');

        }

    })

    $('#dep-Modal').on('shown.bs.modal',function(){

        _isClickTr = true;

        _isClickTrMulti = false;

    })

    $('#dep-Modal').on('hidden.bs.modal',function(){

        _isClickTr = false;

        _isClickTrMulti = false;

    })

    /*------------------------------其他方法---------------------------------------------*/

    //科室选择
    function MWDopFun(){

        var prm = {

            'userID':_userIdNum,

            'userName':_userIdName

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetDeparts',prm,false,function(result){

            _depArr.length = 0;

            if(result){

                for(var i=0;i<result.length;i++){

                    _depArr.push(result[i]);

                }

            }


        })


    }

    //条件选择可是初始化
    function depConInit(){

        _datasTable($('#dep-table'),[]);

    }

})