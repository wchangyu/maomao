/**
 * Created by admin on 2017/11/23.
 */
$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //时间初始化
    $('.time-options-1').click();

    //记录页面
    _energyTypeSel = new ETSelection();

    //读取能耗种类
    _getEcType('initPointers');

    //默认选中第一个能耗
    $('.selectedEnergy').addClass('blueImg0');

    _getEcTypeWord();

    //默认能耗种类
    _ajaxEcType =_getEcTypeValue();

    _ajaxEcTypeWord = _getEcTypeWord();

    //初始时间为今年
    $('.min').val(moment().format('YYYY'));

    ////默认加载数据
    //分户数据
    getDingEData('EnergyManageV2/GetOfficeDingEData',1);

    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){


        var o = $('.left-middle-main .curChoose').index();

        if(o == 0){
            //分户数据
            getDingEData('EnergyManageV2/GetOfficeDingEData',1);

        }else if(o == 1){
            //KPI数据
            getDingEData('EnergyManageV2/GetKPIDingEData',2);

        }
    });

    //能耗选择
    $('.typee').click(function(){
        $('.typee').removeClass('selectedEnergy');
        $(this).addClass('selectedEnergy');

    });

    //点击切换楼宇或单位时，改变上方能耗类型
    $('.left-middle-main p').on('click',function(){

        $('.left-middle-main p').removeClass('curChoose');

        $(this).addClass('curChoose');


        //判断页面中是否存在能耗类型选项
        if(typeof _energyTypeSel!="undefined" ){
            if($(this).index() == 0){

                _energyTypeSel.initPointers($(".energy-types"),undefined,function(){
                    getEcType();
                });

                $('.energy-types').removeClass('hasHeight');

            }else if($(this).index() == 1){

                //清空上方能耗种类
               $('.energy-types').html('');

                $('.energy-types').addClass('hasHeight');

                return false;
            }
            //改变右上角单位
            var html = '';
            $(unitArr3).each(function(i,o){
                html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'
            });

            $('#unit').html(html);

            //如果当前页面存在支路
            if($('#allBranch').length > 0){
                //获取当前楼宇下的支路
                GetAllBranches();
            }
            //默认选中第一个能耗
            $('.selectedEnergy').addClass('blueImg0');
        }else{

        };


    });

    //点击编辑按钮时，表格中数据切换为可编辑
    $('.top-operation .top-edit').on('click',function(){


        var now = parseInt(moment().year());

        var compareYear = $('.min').val();

        if(compareYear < now){
            _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'过往年份数据无法编辑', '');
            return false;
        };


        $('.month-data').removeAttr('readOnly');
        $('.month-data').removeAttr('unselectable');

        $('.prompt').html('当前可编辑，编辑完成后请点击确定按钮进行提交。');


        $('.top-operation .top-btn').removeClass('onClick');

        $(this).addClass('onClick');

    });

    //点击取消按钮时，表格数据回到最初。
    $('.top-operation .top-abolish').on('click',function(){


        _moTaiKuang($('#myModal2'),'提示', '', 'istap' ,'确定取消之前操作吗？', '确定');

    });

    //取消操作
    $('#myModal2 .btn-primary').on('click',function(){

        //不可编辑
        $('.month-data').attr('readOnly','readOnly');
        $('.month-data').attr('unselectable','on');

        $('#myModal2').modal('hide');

        postArr.length = 0;

        //对数据进行深拷贝
        deepCopy(getArr,postArr);

        //table重新赋值
        _datasTable($('#dateTables'),getArr);
    });

    //点击确定按钮时，提交表格中的数据，并使其不可编辑。
    $('.top-operation .top-sure').on('click',function(){


        $('.top-operation .top-btn').removeClass('onClick');

        var flag = $('.left-middle-main .curChoose').index() + 1;

        postDingEData(flag);

        $(this).addClass('onClick');

        $('.month-data').attr('readOnly','readOnly');
        $('.month-data').attr('unselectable','on');

        $('.prompt').html('当前不可编辑，可点击右侧编辑按钮进行编辑。');

    })

});

//存放返回的所有数据
var getArr = [];

//存放要提交的数据
var postArr = [];

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

var table = $('#dateTables').DataTable({
    "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": false,//还原初始化了的datatable
    "paging":false,
    "bPaginate": false,
    "ordering": false,
    'searching':true,
    "info":false,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        'search':'搜索:',
        'processing': '查询中...',
        'lengthMenu': '每页 _MENU_ 件',
        'zeroRecords': '没有数据',
        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
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
            title:'编号',
            data:"index"
        },
        {
            title:'本行ID',
            data:"returnOBJID",
            class:'theHidden'
        },
        {
            title:'名称',
            data:"returnOBJName",
            render:function(data, type, full, meta){

                return '<span title="'+data+'">'+data.substring(0,4)+'</span>'
            }
        },
        {
            title:'年',
            "targets": -1,
            class:'years',
            render:function(data, type, full, meta){

                return '<input unselectable="on" readonly="readonly" class="year-data month-data" value ="""/>'
            }
        },
        {
            title:'是否平均分配',
            "data":null,
            class:'average',
            render:function(data, type, full, meta){

                return "<span class='data-option option-issued btn default btn-xs green-stripe'>是</span>"
            }
        },
        {
            title:'1月',
            data:"dingEValue",
            render:function(data, type, row, meta){
                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[0].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[0].toFixed(1)+'"/>'
                }

            }
        },
        {
            title:'2月',
            data:"dingEValue",
            render:function(data, type, row, meta){

                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[1].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[1].toFixed(1)+'"/>'
                }
            }
        },
        {
            title:'3月',
            data:"dingEValue",
            render:function(data, type, row, meta){

                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[2].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[2].toFixed(1)+'"/>'
                }
            }
        },
        {
            title:'4月',
            data:"dingEValue",
            render:function(data, type, row, meta){

                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[3].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[3].toFixed(1)+'"/>'
                }
            }
        },
        {
            title:'5月',
            data:"dingEValue",
            render:function(data, type, row, meta){

                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[4].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[4].toFixed(1)+'"/>'
                }
            }
        },
        {
            title:'6月',
            data:"dingEValue",
            render:function(data, type, row, meta){

                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[5].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[5].toFixed(1)+'"/>'
                }
            }
        },
        {
            title:'7月',
            data:"dingEValue",
            render:function(data, type, row, meta){

                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[6].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[6].toFixed(1)+'"/>'
                }
            }
        },
        {
            title:'8月',
            data:"dingEValue",
            render:function(data, type, row, meta){

                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[7].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[7].toFixed(1)+'"/>'
                }
            }
        },
        {
            title:'9月',
            data:"dingEValue",
            render:function(data, type, row, meta){

                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[8].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[8].toFixed(1)+'"/>'
                }
            }
        },
        {
            title:'10月',
            data:"dingEValue",
            render:function(data, type, row, meta){

                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[9].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[9].toFixed(1)+'"/>'
                }
            }
        },
        {
            title:'11月',
            data:"dingEValue",
            render:function(data, type, row, meta){

                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[10].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[10].toFixed(1)+'"/>'
                }
            }
        },
        {
            title:'12月',
            data:"dingEValue",
            render:function(data, type, row, meta){

                if(row.returnOBJID != '0000'){

                    return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[11].toFixed(1)+'"/>';
                }else{
                    return '<input disabled="disabled" class="month-data month-datas" value = "'+data[11].toFixed(1)+'"/>'
                }
            }
        }

    ]
});

//_table = $('#dateTables').dataTable();

/*---------------------------------otherFunction------------------------------*/

//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getDingEData(url,flag){

    //存放要传递的分户集合
    var officeID = [];

    //定义ajax传值类型
    var postType = 'post';
    //传递给后台的参数
    var ecParams = {};

    //获取名称
    var areaName = $('.left-middle-main .curChoose').eq(0).html();

    //传递给后台的时间
    var yearInt = parseInt($('.min').val());

    //分户数据
    if(flag == 1){
        //获取session中存放的楼宇ID
        var officeArr = JSON.parse(sessionStorage.getItem('offices'));

        $(officeArr).each(function(i,o){

            officeID.push(o.f_OfficeID);
        });

        ecParams = {
            "energyItemID":_ajaxEcType,
            "yearInt": yearInt,
            "officeIDs": officeID
        };


        //KPI数据
    }else if(flag == 2){

        postType = 'get';

        ecParams = {
            "yearInt": yearInt
        };
    }

    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){
        _ajaxEcType = -2;
    }


    //发送请求
    $.ajax({
        type:postType,
        url:sessionStorage.apiUrlPrefix+url,
        data:ecParams,
        timeout:_theTimes,
        beforeSend: function () {
            $('#theLoading').modal('hide');
            $('#theLoading').modal('show');
        },
        complete: function () {
            $('#theLoading').modal('hide');
        },
        success:function(result){


            //console.log(result);

            //判断是否返回数据
            if(result == null || result.length == 0){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'无数据', '');

                return false;

            }
            //改变头部显示信息
            var energyName = $('.selectedEnergy p').html();

            //改变头部日期
            var date = $('.min').val();

            $('.right-header-title').eq(0).html(energyName + ' &nbsp;' + areaName + ' &nbsp;' + date);

            //获取到数据后赋值
            getArr = result;

            postArr.length = 0;

            //表格赋值
            _datasTable($('#dateTables'),result);
            //对数据进行深拷贝
            deepCopy(getArr,postArr);

            changeData();
        },
        error:function(jqXHR, textStatus, errorThrown){
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');

            }else{

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');

            }


        }
    })
};

//编辑完成 给后台提交数据
function postDingEData(flag){

    //获取名称
    var areaName = $('.left-middle-main .curChoose').eq(0).html();

    //传递给后台的时间
    var yearInt = parseInt($('.min').val());

    //传递给后台的分类标识
    var f_Type = 2;

    //传递给后台的分项ID
    var f_EnergyItemId = 0;

    //分户数据
    if(flag == 1){

        //获得选择的能耗类型
        _ajaxEcType =_getEcTypeValue(_ajaxEcType);

        f_EnergyItemId = _ajaxEcType;

        //KPI数据
    }else if(flag == 2){

        //改变分类标识
        f_Type = 5;

        //改变分项标识
        f_EnergyItemId = -1;

    }

    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){
        _ajaxEcType = -2;
    }

    //传递给后台的参数
    var ecParams = {
        "f_EnergyItemId": f_EnergyItemId,
        "f_Type": f_Type,
        "f_Year": yearInt,
        "energyDingEReturns": postArr,
        "userID": _userIdNum
    };


    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyManageV2/PostEnergyDingEData',
        data:ecParams,
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


            console.log(result);

            if(result == 3){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'执行失败', '');
                return false;
            }
            if(result == 17){
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'过往年数据只能查询', '');
                return false;
            }
            //重新获取数据
            $('.buttons').children('.btn-success').click();

        },
        error:function(jqXHR, textStatus, errorThrown){
            myChartTopLeft.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');

            }else{

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');

            }


        }
    })
};

//用户进行编辑操作时，对数据进行保存。
function changeData(){
    $('.month-data').on('blur',function(){

        if($(this).parent('td').hasClass(' years')){

            return false;
        }

        var data = $(this).val();

        //console.log(33);

        if(data == '' || isNaN(data) ||　data < 0){

            setTimeout(function(){

                for(var i=0; i<$('.month-data').length; i++){

                    var isFocus=$('.month-data').eq(i).is(":focus");

                    if(isFocus){
                        $('.month-data').eq(i).blur();
                    }
                }

            },5);
            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请输入正确数据', '');

            getFocus1($(this));

            return false;
        }

        var id = $(this).parents('tr').find('.theHidden').html();

        var index = parseInt($(this).parent('td').index()) - 5;

        //console.log(index);

        $(postArr).each(function(i,o){
            //
            if(id == o.returnOBJID){
                o.dingEValue[index] = data;

                return false;
            }
        });
    });
};


$('#dateTables').on('click','.data-option',function(){

    if(!$('.top-operation .top-edit').hasClass('onClick')){

        _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请点击编辑按钮进行编辑', '');
    }

    var data = $(this).parents('tr').find('.year-data').val();

    var dom = $(this).parents('tr').find('.year-data');


    //如果输入数据错误
    if(data == '' || isNaN(data) ||　data < 0){

        setTimeout(function(){

            for(var i=0; i<$('.month-data').length; i++){

                var isFocus=$('.month-data').eq(i).is(":focus");

                if(isFocus){
                    $('.month-data').eq(i).blur();
                }
            }

        },5);

        _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请输入正确数据', '');

        getFocus1(dom);

        return false;
    }

    var monthData = (data / 12).toFixed(1);

    console.log(monthData);

    //获取本行ID
    var id = $(this).parents('tr').find('.theHidden').html();

    $(postArr).each(function(i,o){
        //
        if(id == o.returnOBJID){

            var arr = [];
            for(var i=0; i<12; i++){
                arr.push(parseFloat(monthData))
            }

            o.dingEValue = arr;
            return false;
        }
    });


    //table重新赋值
    _datasTable($('#dateTables'),postArr);

    $('.month-data').removeAttr('readOnly');
    $('.month-data').removeAttr('unselectable');

});



