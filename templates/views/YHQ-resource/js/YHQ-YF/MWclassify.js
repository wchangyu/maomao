$(function(){

    /*-----------------------------变量--------------------------*/

    var _allData = [];

    //当前选中的医废id
    var _thisId = '';

    /*----------------------------表格初始化---------------------*/

    var mainCol = [

        {
            title:'名称',
            data:'wtname'
        },
        {
            title:'顺序',
            data:'orders'
        },
        {
            title:'价格',
            data:'price'
        },
        {
            title:'操作',
            data:null,
            render:function(data, type, full, meta){

                return '<span class="option-button option-edit" data-attr="' + full.id + '">' + '编辑</span>' +

                    '<span class="option-button option-del" data-attr="' + full.id + '">' + '删除</span>'


            }

        }

    ]

    _tableInit($('#table'),mainCol,'2','','','','','');

    conditionSelect();

    /*------------------------------按钮事件--------------------*/

    //【新增】
    $('#createBtn').click(function(){

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','保存');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //可操作
        abledOption();

    })

    //【登记】确定
    $('#create-Modal').on('click','.dengji',function(){

        sendOption('MW/WasteTypeAdd');

    })

    //【编辑】
    $('#table tbody').on('click','.option-edit',function(){

        var num = $(this).attr('data-attr');

        _thisId = num;

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');

        //赋值
        BindData(num);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //可操作
        abledOption();

    })

    //【编辑】确定
    $('#create-Modal').on('click','.bianji',function(){

        sendOption('MW/WasteTypeUpdate',_thisId);

    })

    //【删除】
    $('#table tbody').on('click','.option-del',function(){

        var num = $(this).attr('data-attr');

        _thisId = num;

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'确定要删除吗？','','','','删除');

        //赋值
        BindData(num);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //不可操作
        disAbledOption();

    })

    //【编辑】确定
    $('#create-Modal').on('click','.shanchu',function(){

        sendOption('MW/WasteTypeDelete',_thisId);

    })

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        $('#MW-classify-name').val('')

    })

    /*------------------------------其他方法--------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            wtname:$('#MW-classify-name').val()

        }

        _mainAjaxFunCompleteNew('post','MW/GetWasteTypeList',prm,$('.content-top'),function(result){

            var arr = [];

            if(result.code == 99){

                arr = result.data;

                _allData = result.data;

            }

            _jumpNow($('#table'),arr);


        })

    }

    //初始化
    function modalInit(){

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val('');

    }

    //绑定数据
    function BindData(id){

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].id == id){

                var current = _allData[i];

                //赋值
                //名称
                $('#MW-classify-name1').val(current.wtname);
                //顺序
                $('#MW-classify-orders').val(current.orders);
                //价格
                $('#MW-classify-price').val(current.price);
            }

        }

    }

    //操作
    function sendOption(url,flag){

        //验证
        if($('#MW-classify-name1').val() == ''){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项','');

            return false;

        }

        var prm = {

            //名称
            wtname:$('#MW-classify-name1').val(),
            //顺序
            orders:$('#MW-classify-orders').val(),
            //价格
            price:$('#MW-classify-price').val()
        }

        if(flag){

            prm.id = flag;

        }

        _mainAjaxFunCompleteNew('post',url,prm,$('#create-Modal').find('.modal-dialog'),function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    }

    //可操作
    function abledOption(){

        $('#create-Modal').find('input').attr('readOnly',false);

        $('#create-Modal').find('select').attr('disabled',false);

    }

    //不可操作
    function disAbledOption(){

        $('#create-Modal').find('input').attr('readOnly',true);

        $('#create-Modal').find('select').attr('disabled',true);

    }

})