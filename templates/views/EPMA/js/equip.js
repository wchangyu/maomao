$(function(){

    //当前选中的id
    var _id = '';

    /*---------------------------------事件插件-----------------------------------*/

    _timeYMDComponentsFun11($('.equipNewDT'));

    /*--------------------------------表格初始化-----------------------------------*/

    var col = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"

        },
        {
            title:'设备标识',
            data:'0'
        },
        {
            title:'设备编号',
            data:'1'
        },
        {

            title:'设备名称',
            data:'2'

        },
        {
            title:'安装位置',
            data:'3'
        },
        {

            title:'所属系统',
            data:'4'

        },
        {
            title:'型号',
            data:'5'
        },
        {
            title:'性能参数',
            data:'6'
        },
        {
            title:'品牌',
            data:'7'
        },
        {
            title:'厂家',
            data:'8'
        },
        {
            title:'出厂编号',
            data:'9'
        },
        {
            title:'使用状态',
            data:'10'
        },
        {
            title:'出厂日期',
            data:'11'
        },
        {
            title:'购入日期',
            data:'12'
        },
        {
            title:'启用日期',
            data:'13'
        },
        {
            title:'使用年限',
            data:'14'
        },
        {
            title:'免质保日期',
            data:'15'
        },
        {
            title:'免质保单位',
            data:'16'
        },
        {
            title:'免质保电话',
            data:'17'
        },
        {
            title:'付费保日期',
            data:'18'
        },
        {
            title:'付费保单位',
            data:'19'
        },
        {
            title:'付费保电话',
            data:'20'
        },
        {
            title:'归属部门',
            data:'21'
        },
        {
            title:'归属负责人',
            data:'22'
        },
        {
            title:'负责人电话',
            data:'23'
        },
        {
            title:'绑定设备类型',
            data:'24'
        },
        {
            title:'绑定设备',
            data:'25'
        },
        {
            title:'备注',
            data:'26'
        }

    ];

    _tableInit($('#table'),col,2,false,'','','','','',true);


    conditionSelect();

    /*--------------------------------按钮事件------------------------------------*/

    //选中某条东西
    $('#table tbody').on('click','tr',function(){

        var lengths = $(this).find('.checked').length;

        $('#table tbody').children().removeClass('tables-hover');

        $('#table tbody').children().find('.checked').removeClass('checked');

        if(lengths){

            //去掉
            $(this).removeClass('tables-hover');

            $(this).find('input').parent().removeClass('checked');

        }else{

            //选中
            $(this).addClass('tables-hover');

            $(this).find('input').parent().addClass('checked');

        }

    })

    //【编辑】
    $('#editBtn').click(function(){

        //首先判断是否选中了
        var lengths = $('#table tbody').find('.tables-hover').length;

        var a = $('#table tbody').find('.tables-hover').children().eq(1).html();

        if(lengths == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择要编辑的设备','');

        }else{

            window.location.href = 'equipNew.html?a='+ a ;

        }

    })

    //【删除】
    $('#deleteBtn').click(function(){

        //首先判断是否选中了
        var lengths = $('#table tbody').find('.tables-hover').length;

        _id = $('#table tbody').find('.tables-hover').children().eq(1).html();

        //return false;

        if(lengths == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择要删除的设备','');

        }else{

            //模态框
            _moTaiKuang($('#tip-Modal'), '提示', false, true ,'确定要删除吗？', '删除');

        }

    })

    //删除【确定】
    $('#tip-Modal').on('click','.btn-primary',function(){


        var prm = {

            id:_id

        }

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'Opers/DeleteDCLedgerInfo',

            beforeSend:function(){

                $('#table').showLoading();

            },

            complete:function(){

                $('#table').hideLoading();

            },

            data:prm,

            timeout:_theTimes,

            success:function(result){

                console.log(result);

                if(result.code == 0){

                    conditionSelect()

                }else{

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'删除失败','');

                }


            },

            error:_errorFun1


        })


    })

    //导出
    $('#excelBtn').on('click',function(){

        var prm = {
            "iDisplayStart": 1,
            "iDisplayLength": 50,
            "sSearch": sessionStorage.PointerID,
            "sSearch_1": "",
            "sSearch_5": "",
            "bEscapeRegex": true
        }

        var url = sessionStorage.apiUrlPrefix + 'Opers/ExportAnalysisAroChartVie?iDisplayStart=1&iDisplayLength=50&sSearch=' + sessionStorage.PointerID + '&sSearch_1=&sSearch_5=&bEscapeRegex=true'

        console.log(url);

        $.ajax({

            type:'get',

            url: sessionStorage.apiUrlPrefix + 'Opers/ExportAnalysisAroChartVie',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                window.open(url, "_self", true);

            },

            error:_errorFun1


        })

    })

    /*--------------------------------其他方法-------------------------------------*/

    //设备列表
    function conditionSelect(){

        var prm = {
            "iDisplayStart": 1,
            "iDisplayLength": 50,
            "sSearch": sessionStorage.PointerID,
            "sSearch_1": "",
            "sSearch_5": "",
            "bEscapeRegex": true
        }

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'Opers/GetLedgerDs',

            beforeSend:function(){

                $('#table').showLoading();

            },

            complete:function(){

                $('#table').hideLoading();

            },

            data:prm,

            timeout:_theTimes,

            success:function(result){

                console.log(result);

                _datasTable($('#table'),result.aaData);


            },

            error:_errorFun1


        })


    }


})