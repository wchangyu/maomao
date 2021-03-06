$(function(){

    //当前选中的id
    var _id = '';

    //所有数据列表
    var _allData = [];

    //绑定的设备数组
    var _bindDevArr = [];

    //绑定设备
    devList();

    /*---------------------------------事件插件-----------------------------------*/

    _timeYMDComponentsFun11($('.equipNewDT'));

    /*--------------------------------表格初始化-----------------------------------*/

    var col = [

        {
            title:'Select',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"

        },
        {
            title:'Equipment Tag',
            data:'设备标识'
        },
        {
            title:'Equipment Label',
            data:'设备编号'
        },
        {

            title:'Equipment Name',
            data:'设备名称'

        },
        {
            title:'Installation Location',
            data:'安装位置'
        },
        {

            title:'System Belong To',
            data:'所属系统'

        },
        {
            title:'Check',
            className:'detail-button',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.设备标识 + '" style="color:#2170f4;text-decoration: underline ">More</span>'

            }
        }

    ];

    _tableInit_EN($('#table'),col,2,false,'','','','','',true,'');


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

                if(result.code == 0){

                    $('#tip-Modal').modal('hide');

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
            "sSearch": sessionStorage.PointerID,
        }

        var url = sessionStorage.apiUrlPrefix + 'Opers/ExportAnalysisAroChartVie?sSearch=' + sessionStorage.PointerID;

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

    //查看详情
    $('.table tbody').on('click','.detail-button',function(){

        _id = $(this).find('span').attr('data-id');

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].设备标识 == _id){

                thisOBJ = _allData[i];

            }

        }

        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;

        var table = $('#table').DataTable();

        var row = table.row( tr );

        if ( row.child.isShown() ) {

            row.child.hide();

            tr.removeClass('shown');

        }
        else {

            row.child( formatDetail(thisOBJ) ).show();

        }


    })

    /*--------------------------------其他方法-------------------------------------*/

    //设备列表
    function conditionSelect(){

        var prm = {
            "sSearch": sessionStorage.PointerID
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

                var arr = result;

                _allData = result;

                _datasTable($('#table'),arr);


            },

            error:_errorFun1


        })


    }

    //显示详情
    function formatDetail(d){

        var theader = '<div style="border: 1px solid #2170F4 !important;"><table class="table  table-advance table-hover subTable">';

        var theaders = '</table></div>';

        var tbodyer = '<tbody>'

        var tbodyers = '</tbody>';

        var str = '';

        //设备编号、设备名称、安装位置、所属系统
        str += '<tr>' + '<td class="subTableTitle">Equipment Label</td>' + '<td>'+ d.设备编号 +'</td>' + '<td class="subTableTitle">Equipment Name </td>' + '<td>' + d.设备名称 + '</td>' + '<td class="subTableTitle">Installation Location</td>' + '<td>' + d.安装位置 + '</td>' + '<td class="subTableTitle">System Belong To</td>' + '<td>' + d.所属系统 + '</td>' + '</tr>';

        //型号、性能参数、品牌、厂家、
        str += '<tr>' + '<td class="subTableTitle">Model</td>' + '<td>'+ d.型号 +'</td>' + '<td class="subTableTitle">Capacity</td>' + '<td>' + d.性能参数 + '</td>' + '<td class="subTableTitle">Brand</td>' + '<td>' + d.品牌 + '</td>' + '<td class="subTableTitle">Manufacturer</td>' + '<td>' + d.厂家 + '</td>' + '</tr>';

        //出厂编号、使用状态、出厂日期、购入日期
        str += '<tr>' + '<td class="subTableTitle">Manufactory Series Number</td>' + '<td>'+ d.出厂编号 +'</td>' + '<td class="subTableTitle">Operate Condition</td>' + '<td>' + d.使用状态 + '</td>' + '<td class="subTableTitle">Manufacturing Date</td>' + '<td>' + d.出厂日期 + '</td>' + '<td class="subTableTitle">Purchase Date</td>' + '<td>' + d.购入日期 + '</td>' + '</tr>';

        //启用日期、使用年限、免质保日期、免质保单位、
        str += '<tr>' + '<td class="subTableTitle">Operation Starting Date</td>' + '<td>'+ d.启用日期 +'</td>' + '<td class="subTableTitle">Service Life</td>' + '<td>' + d.使用年限 + '</td>' + '<td class="subTableTitle">Warranty Expire Date</td>' + '<td>' + d.免质保截止日期
            + '</td>' + '<td class="subTableTitle">Maintenance By</td>' + '<td>' + d.免质保单位 + '</td>' + '</tr>';

        //免质保电话、付费质保日期、付费保单位、归属部门
        str += '<tr>' + '<td class="subTableTitle">Maintenance Call Number</td>' + '<td>'+ d.免质保电话 +'</td>' + '<td class="subTableTitle">Payment Due date</td>' + '<td>' + d.付费截止日期 + '</td>' + '<td class="subTableTitle">Payment By</td>' + '<td>' + d.付费单位
            + '</td>' + '<td class="subTableTitle">Department Belong To</td>' + '<td>' + d.归属部门 + '</td>' + '</tr>';

        //归属负责人、负责人电话、绑定设备类型、绑定设备
        str += '<tr>' + '<td class="subTableTitle">Person In Charge</td>' + '<td>'+ d.归属负责人 +'</td>' + '<td class="subTableTitle">Person In Charge Tel</td>' + '<td>' + d.归属负责人电话 + '</td>' + '<td class="subTableTitle">Equipment Type</td>' + '<td>' + devType(d.绑定类型) + '</td>' + '<td class="subTableTitle">Equipment</td>' + '<td>' + devName(d.绑定类型, d.绑定设备) + '</td>' + '</tr>';

        //备注
        str += '<tr>' + '<td class="subTableTitle">Remarks</td>' + '<td colspan="7" style="text-align: left;text-indent: 20px;">' + d.备注 + '</td>' + '</tr>';

        return   theader + tbodyer + str + tbodyers + theaders;

    }

    //绑定设备类型
    function devType(val){

        if(val == 'CH'){

            return '冷机'

        }else if(val == 'CHW'){

            return '冷冻泵'

        }else if(val == 'CW'){

            return '冷却泵'

        }else if(val == 'CT'){

            return '冷却塔'

        }else{

            return '';

        }

    }

    //获取设备列表
    function devList(){

        var prm = {

            //楼宇Id ,
            pId:sessionStorage.PointerID,
            //实时时间
            sysrealDt:sessionStorage.sysDt,
            //单位
            misc:sessionStorage.misc
        }

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'Opers/GetEQsByEQTy',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                if(result.code == 0){

                    _bindDevArr = result;

                }

            },

            error:_errorFun1


        })

    }

    //显示设备
    function devName(type,val){

        if(!type){

            return ''

        }

        if(!val){

            return ''

        }

        var arr = [];

        var attrName = '';

        var attrId = '';

        //冷机
        if(type == 'CH'){

            arr = _bindDevArr['chillerRs'];

            attrName = 'chillerName';

            attrId = 'chillerID';

            //冷冻泵

        }else if(type == 'CHW'){

            arr = _bindDevArr['chwRs'];

            attrName = 'pumpName';

            attrId = 'pumpID';

            //冷却泵
        }else if(type == 'CW'){

            arr = _bindDevArr['cwRs'];

            attrName = 'pumpName';

            attrId = 'pumpID';

            //冷却塔
        }else if(type == 'CT'){

            arr = _bindDevArr['ctRs'];

            attrName = 'ctName';

            attrId = 'ctid';

        }else{

            return '';

        }

        if(!arr){

            return '';

        }

        for(var i=0;i<arr.length;i++){

            if(arr[i][attrId] == val){

                return arr[i][attrName]

            }else{

                return ''

            }

        }


    }


})