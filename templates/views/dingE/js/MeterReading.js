/**
 * Created by admin on 2017/2/20.
 */

$(document).ready(function(){

    //select 优化动画
    var rotateNum = 1;
    $(document).on('click', function () {
        if ($('.add-select-block').is(':hidden')) {
            $('.add-select-block').css({
                display: 'none'
            });
            rotateNum = 2;
            var num = rotateNum * 180;
            var string = num + 'deg';
            $('.add-input-select').children('div').css({
                'transform': 'rotate(' + string + ')'
            })
        }

    });
    $('.add-input-select').click(function (e) {
        $('.add-select-block').not($(this).parents('.add-input-father').children('.add-select-block')).css({
            display: 'none'
        });
        rotateNum++;
        var num = rotateNum * 180;
        var string = num + 'deg';
        console.log('bb');
        $(this).parents('.add-input-father').children('.add-select-block').slideToggle('fast');
        $(this).children('div').css({

            'transform': 'rotate(' + string + ')'
        })

        e.stopPropagation();

    });
    $('.add-select-block li').on('click',function(){
        var text = $(this).html();
        var num0 = $(this).attr('ids');
        var num1 = $(this).attr('factor');
        var num2 = $(this).attr('unit');
        $(this).parents('.add-input-father').children('.add-select-block').slideToggle();
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').html(text);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('ids',num0);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('factor',num1);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('unit',num2);
        rotateNum++;
        var num = rotateNum * 180;
        var string = num + 'deg';
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('div').css({

            'transform':'rotate('+string+')'
        })
    });

    //调用获取后台数据方法，进行数据获取
    alarmHistory();

    console.log(dataArr);
    //初始化页面table表单
    console.log(dataArr1);

        var table = $('#dateTables').DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            //是否分页
            "destroy": false,//还原初始化了的datatable
            "paging": true,
            "ordering": false,
            'searching': false,
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第 _PAGE_ 页 / 总 _PAGES_ 页  总记录数为 _TOTAL_ 条',
                "sInfoEmpty": "记录数为0",
                "sInfoFiltered": "(全部记录数 _MAX_ 条)",
                'paginate': {
                    'first': '第一页',
                    'last': '最后一页',
                    'next': '下一页',
                    'previous': '上一页'
                },
                'infoEmpty': ''
            },
            'buttons': [],
            "dom": 'B<"clear">lfrtip',
            //数据源
            'columns': [
                {
                    title: '计量设备类型',
                    data: 'f_MeterTypeName',
                    class: 'theHidden'

                },
                {
                    title: '抄表数据ID',
                    data: 'pK_MTRead',
                    class: 'theHidden'
                },
                {
                    title: '能耗类型',
                    data: 'f_mtEnergyType',
                    render: function (data, type, full, meta) {
                        return getEnergyType(data);
                    },
                    class: 'theHidden'

                },
                {
                    title: '表号（代号）',
                    data: 'f_mtNumber',
                    class: 'theHidden'

                },
                {
                    title: '二级单位',
                    data: 'f_UnitName',
                    class: 'theHidden'

                },
                {
                    title: '抄表周期名称',
                    data: 'f_CycleName',

                },
                {
                    title: '抄表月份',
                    data: 'f_ReadCycleST',

                },
                {
                    title: '绑定楼宇',
                    data: 'pointerName',
                    class: 'theHidden'

                },
                {
                    title: '计量区域',
                    data: 'f_MeasureArea',
                    class: 'theHidden'

                },
                {
                    title: '安装位置',
                    data: 'f_InstalPosition',
                    class: 'theHidden'

                },
                {
                    title: '抄表起始日期',
                    data: 'f_ReadST'

                },
                {
                    title: '抄表结束日期',
                    data: 'f_ReadET'

                },
                {
                    title: '抄表起数',
                    data: 'f_ReadStartNum'

                },
                {
                    title: '抄表止数',
                    data: 'f_ReadEndNum'

                },

                {
                    title: '倍率',
                    data: 'f_Rate'

                },
                {
                    title: '圈数',
                    data: 'f_CycleNum'

                },
                {
                    title: '用能量',
                    data: 'f_EnergyValue'

                },
                {
                    title: '抄表人',
                    data: 'f_ReadPerson'

                },
                {
                    title: '是否结算',
                    data: 'f_IsClearing',
                    render: function (data, type, full, meta) {
                        if (data == 0) {
                            return '未结算'
                        } else {
                            return '已结算'
                        }
                        ;
                    }

                },
                {
                    title: '编辑操作',
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='top-btn change' data-toggle='modal' data-target='#remove-deploy'>修改</button>"
                },
                {
                    title: '删除操作',
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='top-btn remove' data-toggle='modal' data-target='#remove-meter'>删除</button>"
                }
            ]
        });

        _table = $('#dateTables').dataTable();

        //给表格添加后台获取到的数据
        setData();
        hiddrenId();




    var table1 = $('#dateTables1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "ordering": false,
        'searching':false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
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
                title:'计量设备类型',
                data:'f_MeterTypeName'

            },
            {
                title:'抄表数据ID',
                data:'pK_MTRead',
                class:'theHidden'
            },
            {
                title:'能耗类型',
                data:'f_mtEnergyType',
                render:function(data, type, full, meta){
                    return getEnergyType(data);
                }

            },
            {
                title:'表号（代号）',
                data:'f_mtNumber'

            },
            {
                title:'二级单位',
                data:'f_UnitName'

            },
            {
                title:'抄表周期名称',
                data:'f_CycleName',
                class:'theHidden'

            },
            {
                title:'抄表月份',
                data:'f_ReadCycleST',
                class:'theHidden',
                render:function(data, type, full, meta){
                    if(data){
                        var txt1 = data.split(' ')[0].split('/')[0];
                        var txt2 = data.split(' ')[0].split('/')[1];
                        return txt1 + "-" + txt2;
                    }else{
                        return '';
                    }

                }

            },
            {
                title:'绑定楼宇',
                data:'pointerName'

            },
            {
                title:'计量区域',
                data:'f_MeasureArea'

            },
            {
                title:'安装位置',
                data:'f_InstalPosition'

            }
        ]
    });

    _table = $('#dateTables1').dataTable();


    //给表格添加后台获取到的数据
    setDatas(dataArr1);
    hiddrenId();

    //点击左侧手抄表，对其数据进行展示

    $('.ztree li ul li .level1').on('click',function(){

        $('.ztree font').removeClass('onClicks');

        var id = $(this).find('.treeFont').attr('ids');

        $(this).find('.treeFont').addClass('onClicks');

        startID = id;
        console.log(startID);


        _table = $('#dateTables').dataTable();
        //给表格添加后台获取到的数据
        ajaxSuccess();

        _table = $('#dateTables1').dataTable();
        _table.fnClearTable();

        //给表格添加后台获取到的数据
        setDatas(dataArr1);
        hiddrenId();


    });

    //添加功能

    var table4 = $('#dateTables4').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "ordering": false,
        'searching':true,
        "sScrollY": '340px',
        "bPaginate": false,
        //"scrollCollapse": true,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
            'search':'搜索:',
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
                title:'id',
                data:'pointerID',
                class:'theHidden'
            },
            {
                title:'',
                data:'pointerName',
                class:'adjust-comment',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            }
        ]
    });

    pushBuildArr();

    $('.add-btn').on('click',function(){
        openNum = 0;

        var closeLoad = 0;

        $('#add-deploy .add-input').val('');
        $('#add-deploy .add-input').eq(6).val(0);
        $('#add-deploy .add-inputs').val('');
        $('#add-deploy .meters-btn').html('开启多表输入模式');
        $('#add-deploy .push-meters').css({
            display:'none'
        });
        $('#add-deploy .show-plan font').html('0/0');
        $('#add-deploy .next-btn').css({
            display:'none'
        });
        $('.show-plan').css({
            display:'none'
        });

        //判断是否结算
        if(importantNum == 1){
            myAlter('已完成结算，无法添加');
            return false;
        };

        //获取添加弹窗中的数据
        var postData = {};
         getData = [];
        var newNum = 0;

        $.ajax({
            type:'get',
            url:IP + "/UnitMeter/GetSingleMTReadInitData",
            async:false,
            data:{
                PK_Meter:startID
            },
            timeout:theTimes,
            beforeSend:function(){

            },
            complete:function(){
                $('#theLoading').modal('hide');
            },
            success:function(data){
                $('#theLoading').modal('hide');
                console.log(data);
                postData = data;

                var meterName = postData.f_mtNumber;
                var type = postData.f_mtEnergyType;

                $('#add-deploy .ament-data').children('span').eq(0).html(meterName);
                $('#add-deploy .ament-data').children('span').eq(1).html(postData.f_MeasureArea);
                $('#add-deploy .ament-data').children('span').eq(2).html(getEnergyType(type));


                $('#add-deploy .add-input').eq(0).val(postData.f_ReadPerson);
                $('#add-deploy .add-input').eq(1).val(postData.f_ReadRate);
                $('#add-deploy .add-input').eq(2).val(postData.f_ReadStartNum);

                $('#add-deploy .add-input').eq(4).val(postData.f_ReadST);
                $('#add-deploy .add-input').eq(5).val(postData.f_ReadET);
                $('#add-deploy .add-input').eq(6).attr('range',postData.f_Range);
                $('#add-deploy .add-input').eq(6).attr('warnUp',postData.f_WarnUp);
                $('#add-deploy .add-input').eq(6).attr('warnDown',postData.f_WarnDown);
                $('#add-deploy .add-input').eq(6).attr('energy',type);


                $('#add-deploy .ament-data').children('span').eq(3).html(postData.f_WarnDown + ' - ' + postData.f_WarnUp);


            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                console.log(textStatus);

                if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }
                myAlter("请求失败！");
            },

        });

        $('.refer-meters').off('click');
        $('.refer-meters').on('click',function(){

            //判断必填项是否全部填写
            if(!checkedNull1('.push-meters')){
                return false;
            };

            $('.in .next-btn').css({
                display:'inline-block'
            });
            $('.show-plan').css({
                display:'block'
            });

            var buildID = $(this).parents('.push-meters').find('.add-inputs').eq(0).attr('ids');
            var energy = $(this).parents('.push-meters').find('.add-inputs').eq(1).find('span').attr('ids');
            var person = $(this).parents('.push-meters').find('.add-inputs').eq(2).val();
            var date = $(this).parents('.push-meters').find('.add-inputs').eq(3).val();

            console.log(buildID,energy)
            $.ajax({
                type:'get',
                url:IP + "/UnitMeter/GetMoreMTReadInitData",
                async:false,
                data:{
                    pointerID:buildID,
                    energyType:energy,
                    readET : date,
                    readPerson : person
                },
                timeout:theTimes,
                beforeSend:function(){
                },
                complete:function(){
                    $('#theLoading').modal('hide');
                },
                success:function(data){
                    $('#theLoading').modal('hide');

                    console.log(data);
                    getData = data;

                    var lengths = data.length;
                    console.log(lengths);
                    if(lengths == 0){
                        myAlter('未找到符合条件仪表，请重新输入');
                        $('#add-deploy .add-inputs').eq(0).val('');
                        $('#add-deploy .add-inputs').eq(0).focus();
                        return false;
                    }

                    $('.show-plan').find('font').html('1/'+lengths);

                    var meterName = data[0].f_mtNumber;
                    var type = data[0].f_mtEnergyType;
                    $('#add-deploy .ament-data').children('span').eq(0).html(meterName);
                    $('#add-deploy .ament-data').children('span').eq(1).html(data[0].f_MeasureArea);
                    $('#add-deploy .ament-data').children('span').eq(2).html(getEnergyType(type));

                    $('#add-deploy .ament-data').children('span').eq(3).html(data[0].f_WarnDown + ' - ' + data[0].f_WarnUp);

                    $('#add-deploy .add-input').eq(0).val(data[0].f_ReadPerson);
                    $('#add-deploy .add-input').eq(1).val(data[0].f_ReadRate);
                    $('#add-deploy .add-input').eq(2).val(data[0].f_ReadStartNum);

                    $('#add-deploy .add-input').eq(4).val(data[0].f_ReadST);
                    $('#add-deploy .add-input').eq(5).val(data[0].f_ReadET);
                    $('#add-deploy .add-input').eq(6).attr('range',data[0].f_Range);
                    $('#add-deploy .add-input').eq(6).attr('warnUp',data[0].f_WarnUp);
                    $('#add-deploy .add-input').eq(6).attr('warnDown',data[0].f_WarnDown);

                    $('.in .next-btn').off('click')
                    $('.in .next-btn').on('click',function(){
                        newNum ++;

                        if(newNum == lengths){
                            myAlter("当前已是最后一条");
                            console.log('ok');
                            newNum -- ;
                            return false;
                        }
                        var meterName = data[newNum - 1].f_mtNumber;

                        $('#jump-meter p b').html(meterName);
                    });

                    $('#jump-meter .btn-primary').off('click');
                    $('#jump-meter .btn-default').off('click');
                    $('#jump-meter .btn-default').on('click',function(){
                        newNum -- ;
                    })
                    $('#jump-meter .btn-primary').on('click',function(){

                        var num = newNum + 1;
                        $('.show-plan').find('font').html(num + '/'+lengths);

                        var meterName = data[newNum].f_mtNumber;

                        $('#add-deploy .add-input').val('');
                        $('#add-deploy .add-input').eq(6).val(0);

                        $('#add-deploy .ament-data').children('span').eq(0).html(meterName);
                        $('#add-deploy .ament-data').children('span').eq(1).html(data[newNum].f_MeasureArea);

                        $('#add-deploy .add-input').eq(0).val(data[newNum].f_ReadPerson);
                        $('#add-deploy .add-input').eq(1).val(data[newNum].f_ReadRate);
                        $('#add-deploy .add-input').eq(2).val(data[newNum].f_ReadStartNum);

                        $('#add-deploy .add-input').eq(4).val(data[newNum].f_ReadST);
                        $('#add-deploy .add-input').eq(5).val(data[newNum].f_ReadET);
                        $('#add-deploy .add-input').eq(6).attr('range',data[newNum].f_Range);
                        $('#add-deploy .add-input').eq(6).attr('warnUp',data[newNum].f_WarnUp);
                        $('#add-deploy .add-input').eq(6).attr('warnDown',data[newNum].f_WarnDown);

                        $('#add-deploy .ament-data').children('span').eq(3).html(data[newNum].f_WarnDown + ' - ' + data[newNum].f_WarnUp);
                        $('#jump-meter').modal('hide');

                    });

                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');

                    console.log(textStatus);

                    if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    myAlter("请求失败！");
                },

            });

        });

        $('#add-deploy .btn-primary').off('click');

        $('#add-deploy .btn-primary').on('click',function(){

            //判断必填项是否全部填写
            if(!checkedNull('#add-deploy') || !checkedEndNum('#add-deploy')){
                return false;
            };

            var startDate = $(this).parents('.modal-header').find('.add-input').eq(4).val().split(" ")[0];

            var date1 = startDate.split("/").join('-');

            var date2 = $(this).parents('.modal-header').find('.add-input').eq(5).val();

            if(CompareDate(date2,date1) == false){
                    myAlter('结束日期必须大于开始日期');
                getFocus1( $(this).parents('.modal-header').find('.add-input').eq(5));

                return false;
            };

            var warnUp = parseFloat($(this).parents('.modal-header').find('.add-input').eq(6).attr('warnUp'));
            var warnDown = parseFloat($(this).parents('.modal-header').find('.add-input').eq(6).attr('warnDown'));

            var energyValue = parseFloat($(this).parents('.modal-header').find('.add-input').eq(7).val());

            console.log(energyValue);

            if(energyValue < warnDown || energyValue >  warnUp){
                myAlter('超出用能量有效范围，请重新填写');
                getFocus1( $(this).parents('.modal-header').find('.add-input').eq(3));

                return false;
            }

            console.log(getData);
            if(getData.length != 0){
               postData = getData[newNum]
            }

            postData.f_ReadPerson = $(this).parents('.modal-header').find('.add-input').eq(0).val();
            postData.fK_Cycle_MTRead = importantID;
            postData.pK_MTRead = 0;
            postData.f_ReadEndNum = $(this).parents('.modal-header').find('.add-input').eq(3).val();
            postData.f_ReadET = $(this).parents('.modal-header').find('.add-input').eq(5).val();
            postData.f_CycleNum = $(this).parents('.modal-header').find('.add-input').eq(6).val();
            postData.f_EnergyValue = energyValue;

            postData.userID = userName;
            postData.f_ReadInputDT = '';

            delete postData.f_Range;
            delete postData.f_mtEnergyType;
            delete postData.f_WarnDown;
            delete postData.f_WarnUp;

            console.log(postData);

            $.ajax({
                type:'post',
                url:IP + "/UnitMeter/AddMTRead",
                async:false,
                data:postData,
                timeout:theTimes,
                beforeSend:function(){
                },
                complete:function(){
                    $('#theLoading').modal('hide');
                },
                success:function(data){
                    $('#theLoading').modal('hide');

                    console.log(data);
                    if(data == 2){
                        myAlter('名称重复');
                        return false
                    }
                    if(data == 3){
                        myAlter('添加失败');
                        return false
                    }

                    console.log(getData.length);
                    //没有启用多表输入模式
                    if(getData.length == 0){
                        $('#add-deploy').modal('hide');

                        _table = $('#dateTables').dataTable();
                        _table.fnClearTable();
                        alarmHistory();
                        //给表格添加后台获取到的数据
                        setData();
                        hiddrenId();

                        console.log(dataArr1);

                        _table = $('#dateTables1').dataTable();
                        _table.fnClearTable();
                        //给表格添加后台获取到的数据
                        setDatas(dataArr1);
                        hiddrenId();


                        $('.onClicks').attr('color','#307f7a');
                        getTreeMessage();

                    }else{


                            var lengths = getData.length;
                            newNum ++;

                            if(newNum == lengths){
                                location.reload();
                            };

                            myAlter('提交成功,请继续输入');

                            closeLoad = 1;

                            var num = newNum + 1;
                            $('.show-plan').find('font').html(num + '/'+lengths);

                            $('#add-deploy .add-input').val('');
                            $('#add-deploy .add-input').eq(6).val(0);

                            var meterName = getData[newNum].f_mtNumber;
                            $('#add-deploy .ament-data').children('span').eq(0).html(meterName);
                            $('#add-deploy .ament-data').children('span').eq(1).html(getData[newNum].f_MeasureArea);

                            $('#add-deploy .add-input').eq(0).val(getData[newNum].f_ReadPerson);
                            $('#add-deploy .add-input').eq(1).val(getData[newNum].f_ReadRate);
                            $('#add-deploy .add-input').eq(2).val(getData[newNum].f_ReadStartNum);

                            $('#add-deploy .add-input').eq(4).val(getData[newNum].f_ReadST);
                            $('#add-deploy .add-input').eq(5).val(getData[newNum].f_ReadET);
                            $('#add-deploy .add-input').eq(6).attr('range',getData[newNum].f_Range);

                            $('#add-deploy .ament-data').children('span').eq(3).html(getData[newNum].f_WarnDown + ' - ' + getData[newNum].f_WarnUp);



                    }


                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    $('#add-deploy').modal('hide');
                    console.log(textStatus);

                    if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    myAlter(JSON.parse(XMLHttpRequest.responseText).message);
                },

            });



        });

        $('#add-deploy .btn-default').off('click');
        $('#add-deploy .btn-default').on('click',function(){
            if(closeLoad == 1){
                location.reload();
            }
        });

        $('#add-deploy .close').off('click');
        $('#add-deploy .close').on('click',function(){
            if(closeLoad == 1){
                location.reload();
            }
        });

    });

    //修改功能

    $('#dateTables').on('click','.change',function() {
        var id = $(this).parents('tr').find('td').eq(1).html();
        var txt = $(this).parents('tr').find('td').eq(18).html();
        var postData = {};
        console.log(txt);
        if(txt == '已结算'){
            myAlter('已完成结算，无法修改');
            return false;
        };

        $.ajax({
            type: 'get',
            url: IP + "/UnitMeter/GetMTReadByReadID",
            async: false,
            timeout: theTimes,
            data:{
                'PK_MTRead':id
            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                console.log(data);
                postData = data;

                var meterName = postData.f_mtNumber;
                var type = postData.f_mtEnergyType;
                var typeUnit = getEnergyUnit(type);
                $('#remove-deploy .ament-data').children('span').eq(0).html(meterName);
                $('#remove-deploy .ament-data').children('span').eq(1).html(postData.f_MeasureArea);
                $('#remove-deploy .ament-data').children('span').eq(2).html(getEnergyType(type));

                $('#remove-deploy .add-input').eq(0).val(postData.f_ReadPerson);
                $('#remove-deploy .add-input').eq(1).val(postData.f_ReadRate);
                $('#remove-deploy .add-input').eq(2).val(postData.f_ReadStartNum);
                $('#remove-deploy .add-input').eq(3).val(postData.f_ReadEndNum);

                $('#remove-deploy .add-input').eq(4).val(postData.f_ReadST);
                $('#remove-deploy .add-input').eq(5).val(postData.f_ReadET);
                $('#remove-deploy .add-input').eq(6).attr('range',postData.f_Range);
                $('#remove-deploy .add-input').eq(6).attr('warnUp',postData.f_WarnUp);
                $('#remove-deploy .add-input').eq(6).attr('warnDown',postData.f_WarnDown);
                $('#remove-deploy .add-input').eq(6).attr('energy',type);

                $('#remove-deploy .ament-data').children('span').eq(3).html(postData.f_WarnDown + ' - ' + postData.f_WarnUp);

                console.log(postData.f_CycleNum);
                $('#remove-deploy .add-input').eq(6).val(postData.f_CycleNum);
                $('#remove-deploy .add-input').eq(7).val(postData.f_EnergyValue +" " + typeUnit);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }
                myAlter("请求失败！");
            }
        });

        $('#remove-deploy .btn-primary').off('click');
        $('#remove-deploy .btn-primary').on('click',function(){

            //判断必填项是否全部填写
            if(!checkedNull('#remove-deploy') || !checkedEndNum('#remove-deploy')){
                return false;
            };

            var startDate = $(this).parents('.modal-header').find('.add-input').eq(4).val().split(" ")[0];

            var date1 = startDate.split("/").join('-');

            var date2 = $(this).parents('.modal-header').find('.add-input').eq(5).val();

            if(CompareDate(date2,date1) == false){
                myAlter('结束日期必须大于开始日期');
                getFocus1( $(this).parents('.modal-header').find('.add-input').eq(5));

                return false;
            };

            var warnUp = parseFloat($(this).parents('.modal-header').find('.add-input').eq(6).attr('warnUp'));
            var warnDown = parseFloat($(this).parents('.modal-header').find('.add-input').eq(6).attr('warnDown'));

            var energyValue = parseFloat($(this).parents('.modal-header').find('.add-input').eq(7).val());

            console.log(warnDown,warnUp);

            if(energyValue < warnDown || energyValue >  warnUp){
                myAlter('超出用能量有效范围，请重新填写');
                getFocus1( $(this).parents('.modal-header').find('.add-input').eq(3));

                return false;
            }

            postData.f_ReadPerson = $(this).parents('.modal-header').find('.add-input').eq(0).val();


            postData.f_ReadEndNum = $(this).parents('.modal-header').find('.add-input').eq(3).val();
            postData.f_ReadET = $(this).parents('.modal-header').find('.add-input').eq(5).val();
            postData.f_CycleNum = $(this).parents('.modal-header').find('.add-input').eq(6).val();
            postData.f_EnergyValue = energyValue;

            postData.userID = userName;

            delete postData.f_Range;
            delete postData.f_mtEnergyType;
            delete postData.f_mtNumber;
            delete postData.f_MeasureArea;

            console.log(postData);

            $.ajax({
                type:'post',
                url:IP + "/UnitMeter/UpdateMTRead",
                async:false,
                data:postData,
                timeout:theTimes,
                beforeSend:function(){
                },
                complete:function(){
                    $('#theLoading').modal('hide');
                },
                success:function(data){
                    $('#theLoading').modal('hide');
                    $('#remove-deploy').modal('hide');
                    console.log(data);
                    if(data == 8){
                        myAlter('已结算，无法修改');
                        return false
                    }
                    if(data == 3){
                        myAlter('修改失败');
                        return false
                    }
                    if(data == 9){
                        myAlter('已有抄表记录，无法修改');
                        return false
                    }
                    if(data == 16){
                        myAlter('非手工抄表不允许修改');
                        return false
                    }

                    _table = $('#dateTables').dataTable();
                    _table.fnClearTable();
                    alarmHistory();
                    //给表格添加后台获取到的数据
                    setData();
                    hiddrenId();

                    _table = $('#dateTables1').dataTable();
                    _table.fnClearTable();
                    //给表格添加后台获取到的数据
                    setDatas(dataArr1);
                    hiddrenId();

                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    $('#remove-deploy').modal('hide');
                    console.log(textStatus);

                    if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    myAlter(JSON.parse(XMLHttpRequest.responseText).message);
                }

            });


        })
    });

    //删除功能
    $('#dateTables').on('click','.remove',function(){

        var id = $(this).parents('tr').find('td').eq(1).html();
        var txt = $(this).parents('tr').find('td').eq(18).html();
        var name = $(this).parents('tr').find('td').eq(3).html();
        var date1 = $(this).parents('tr').find('td').eq(10).html().split(' ')[0];
        var date2 = $(this).parents('tr').find('td').eq(11).html().split(' ')[0];
        var id1;
        var id2;
        console.log(id);
        if(txt == '已结算'){
            myAlter('已完成结算，无法删除');
            return false;
        };

        $('#remove-meter p b').html(name);
        $('#remove-meter p strong').html(date1 + " - " + date2);

        $.ajax({
            type: 'get',
            url: IP + "/UnitMeter/GetMTReadByReadID",
            async: false,
            timeout: theTimes,
            data:{
                'PK_MTRead':id
            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                console.log(data);
                id1 = data.fK_Meter_MTRead;
                id2 = data.fK_Cycle_MTRead;


            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }
                myAlter("请求失败！");
            }
        });

        $('#remove-meter .btn-primary').off('click');
        $('#remove-meter .btn-primary').on('click',function(){

            $.ajax({
                type:'post',
                url:IP + "/UnitMeter/DelMTRead",
                async:false,
                data:{
                    "pK_MTRead": id,
                    "fK_Meter_MTRead": id1,
                    "fK_Cycle_MTRead": id2,
                    "f_CycleName": "string",
                    "f_ReadCycleST": "string",
                    "fK_MeterType_Meter": 0,
                    "f_MeterTypeName": "string",
                    "f_mtEnergyType": 0,
                    "f_mtOnline": 0,
                    "f_mtNumber": "string",
                    "f_mtNumberFlag": 0,
                    "f_FactoryNumber": "string",
                    "f_Rate": 0,
                    "f_InstalPosition": "string",
                    "f_MeasureArea": "string",
                    "f_PointerID": 0,
                    "pointerName": "string",
                    "f_UnitName": "string",
                    "f_IsClearing": 0,
                    "f_ReadSource": 0,
                    "f_ReadPerson": "string",
                    "f_ReadStartNum": 0,
                    "f_ReadEndNum": 0,
                    "f_ReadST": "string",
                    "f_ReadET": "string",
                    "f_CycleNum": 0,
                    "f_EnergyValue": 0,
                    "userID": userName
                },
                timeout:theTimes,
                beforeSend:function(){
                },
                complete:function(){
                    $('#theLoading').modal('hide');
                },
                success:function(data){
                    $('#theLoading').modal('hide');
                    $('#remove-meter').modal('hide');
                    console.log(data);
                    if(data == 8){
                        myAlter('已结算，无法删除');
                        return false
                    }
                    if(data == 3){
                        myAlter('删除失败');
                        return false
                    }
                    if(data == 9){
                        myAlter('已有抄表记录，无法删除');
                        return false
                    }
                    if(data == 12){
                        myAlter('非手工抄表不允许删除');
                        return false;
                    }

                    _table = $('#dateTables').dataTable();
                    _table.fnClearTable();
                    alarmHistory();
                    //给表格添加后台获取到的数据
                    setData();
                    hiddrenId();

                    _table = $('#dateTables1').dataTable();
                    _table.fnClearTable();
                    //给表格添加后台获取到的数据
                    console.log(dataArr1);
                    setDatas(dataArr1);
                    hiddrenId();

                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    $('#remove-meter').modal('hide');
                    console.log(textStatus);

                    if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    myAlter(JSON.parse(XMLHttpRequest.responseText).message);
                },

            });
        })



    })

});

$('.add-input:disabled').parent('.add-input-block').css({

    backgroundColor: 'rgb(235, 235, 228)'
});

var importantID = window.location.search.split('=')[1];

var getData;

var importantNum = 0;
var startID;

function getAccount(){
    $.ajax({
        type: "get",
        url: IP + "/UnitMeter/GetMTReadCycleByCycleID",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        timeout:theTimes,
        data:{
            cycleID : importantID
        },
        cache: false,
        async : false,
        dataType: "json",
        beforeSend:function(){
        },
        complete:function(){
            $('#theLoading').modal('hide');
        },

        success: function (data)
        {

            var txt = data.f_ClearingDate;
           if(data == ''){
               importantNum = 0
           }else{
               importantNum = 1
           }

        },
        error:function (data, textStatus, errorThrown) {
            var num = data.responseText.split('"')[3];
            console.log(data.responseText);
            if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            $('#theLoading').modal('hide');

            $('#add-deploy').modal('hide');
            myAlter(num);
        }
    });
}

getAccount();

//获取后台数据
function alarmHistory(){
    dataArr=[];
    dataArr1 = [];
    $.ajax({
        type:'get',
        url:IP + "/UnitMeter/GetAllReadByMeterID",
        async:false,
        data:{
            meterID:startID
        },
        timeout:theTimes,
        beforeSend:function(){
            $('#theLoading').modal('show');
        },
        complete:function(){
            $('#theLoading').modal('hide');
        },
        success:function(result){
            $('#theLoading').modal('hide');
            console.log(result);

            for(var i=0;i<result.length;i++){
                dataArr.push(result[i]);
            }

            if(dataArr.length > 0){
                dataArr1.push(dataArr[0]);
            }

        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        },

    });


}

function getImportantNum(){
    $.ajax({
        type:'get',
        url:IP + "/UnitMeter/GetMTReadCycleByCycleID",
        async:false,
        data:{
            cycleID:importantID
        },
        timeout:theTimes,
        beforeSend:function(){
            $('#theLoading').modal('show');
        },
        complete:function(){
            $('#theLoading').modal('hide');
        },
        success:function(data){
            $('#theLoading').modal('hide');
            console.log(data);
            if(data.f_ClearingDate == ''){
                importantNum = 0;
            }else{
                importantNum = 1;
            }


        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        },

    });
}
getImportantNum();

//获取左侧手工仪表列表

var setting = {
    //check: {
    //    enable: true,
    //    chkStyle: "radio",
    //    chkboxType: { "Y": "s", "N": "ps" }
    //},
    view: {
        nameIsHTML: true,
        showTitle :false
    },
    data: {
        simpleData: {
            enable: true
        }
    }

};
var zNodes =[

];
//存放楼宇信息
var buildArr = [];


//用能量的计算
$('.end-number').on('blur',function(){
    var startNum = parseFloat($(this).parents('.row').find('.add-input').eq(0).val());
    console.log(startNum);
    var endNum = $(this).val();

    var type = parseInt($(this).parents('.modal-header').find('.add-input').eq(6).attr('energy'));

    var typeUnit = " " + getEnergyUnit(type);

    var cycleNum = parseInt($(this).parents('.modal-header').find('.add-input').eq(6).val());

    var range = parseFloat($(this).parents('.modal-header').find('.add-input').eq(6).attr('range'));

    var rate = parseFloat($(this).parents('.modal-header').find('.add-input').eq(1).val());

    console.log(cycleNum);

    if(isNaN(endNum) || endNum < 0){
        myAlter('抄表止数必须为非负数字');
        getFocus1($(this));
        return false;
    }else if(endNum == ''){

        return false;
    }else if(isNaN(cycleNum)){

        console.log('11');
        return false;
    }else if(parseFloat(endNum) < startNum && parseInt(cycleNum) < 1){
        myAlter('止数小于起数，请输入圈数');
        $(this).parents('.modal-header').find('.add-input').eq(6).val('');
        getFocus1($(this).parents('.modal-header').find('.add-input').eq(6));
        return false;
    }else if(cycleNum == 0){
        var num0 = parseFloat(endNum) - startNum;
        var  pushNum = num0 * rate;
        $(this).parents('.modal-header').find('.add-input').eq(7).val( pushNum+ typeUnit);

    }else if(parseFloat(endNum) > startNum){
        var num = parseFloat(endNum) - startNum;
        var num1 = range * cycleNum;
        var num0 = num + num1;
        var pushNum = num0 * rate;

        $(this).parents('.modal-header').find('.add-input').eq(7).val( pushNum+ typeUnit);
    }else if(parseFloat(endNum) == startNum){
        var num1 = range * cycleNum;
        var num0 = num1;
        var  pushNum = num0 * rate;

        $(this).parents('.modal-header').find('.add-input').eq(7).val( pushNum+ typeUnit);
    }else{
        var num1 = range - startNum + parseFloat(endNum);
        var num2 = range * cycleNum;
        var num0 = num1 + num2;

        var pushNum = num0 * rate;
        $(this).parents('.modal-header').find('.add-input').eq(7).val( pushNum + typeUnit);
    }

});

$('.cycleNum').on('blur',function(){
    var startNum = parseFloat($(this).parents('.modal-header').find('.add-input').eq(2).val());
    console.log(startNum);
    var endNum = $(this).parents('.modal-header').find('.add-input').eq(3).val();

    var cycleNum = $(this).val();

    var range = parseFloat($(this).attr('range'));

    var type = parseInt($(this).attr('energy'));

    var typeUnit = " " +  getEnergyUnit(type);

    var rate = parseFloat($(this).parents('.modal-header').find('.add-input').eq(1).val());

    if(isNaN(cycleNum) || cycleNum < 0 || cycleNum % 1 != 0){
        myAlter('圈数必须为非负整数');
        getFocus1($(this));
        return false;
    }else if(endNum == ''){
        return false;
    }else if(parseFloat(endNum) < startNum && cycleNum == 0){
        myAlter('止数小于起数，圈数必须大于0');
        $(this).val('');
        getFocus1($(this));
        return false;
    }else if(cycleNum == 0){
        var num0 = parseFloat(endNum) - startNum;
        var  pushNum = num0 * rate;
        $(this).parents('.modal-header').find('.add-input').eq(7).val( pushNum + typeUnit);

    }else if(parseFloat(endNum) > startNum){
        var num = parseFloat(endNum) - startNum;
        var num1 = range * parseInt(cycleNum);
        var num0 = num + num1;
        var pushNum = num0 * rate;

        $(this).parents('.modal-header').find('.add-input').eq(7).val( pushNum + typeUnit);
    }else if(parseFloat(endNum) == startNum){
        var num1 = range * parseInt(cycleNum);
        var num0 = num1;
        var  pushNum = num0 * rate;

        $(this).parents('.modal-header').find('.add-input').eq(7).val( pushNum + typeUnit);
    }else{
        var num1 = range - startNum + parseFloat(endNum);
        var num2 = range * parseInt(cycleNum);
        var num0 = num1 + num2;

        var pushNum = num0 * rate;
        $(this).parents('.modal-header').find('.add-input').eq(7).val( pushNum + typeUnit);
    }

});

//得到左侧树状图的数据
function getBuildTree(){
    $.ajax({
        type: 'get',
        url: IP + "/UnitMeter/GetAllPointerAndMeter",
        contentType:'application/json',
        async: false,
        timeout: theTimes,
        data:{
            PK_MTReadCycle : importantID
        },
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {
           console.log(data);

            buildArr = data;

            startID = data[0].pointerAndMeters[0].meterID;

            zNodes =[

            ];

           for(var i=1; i<data.length+1; i++){
               var id0 = data[i-1].pointerID;
               var name0 = data[i-1].pointerName;
               var name00 = "<font ids='"+id0+"'>"+ name0+"</font>";
               var meterArr = data[i-1].pointerAndMeters;
               var obj = {id:i, pId:0, name:name00, open:true, iconOpen:"img/1_open.png",iconClose:"img/1_close.png"};
               zNodes.push(obj);

               for(var j=1; j<meterArr.length+1; j++){
                   var name1 = meterArr[j-1].f_mtNumber;
                   var isRead = meterArr[j-1].isMeterRead;
                   var id11 = meterArr[j-1].meterID;
                   var type = getEnergyType(meterArr[j-1].f_mtEnergyType);
                   var names;
                   if(isRead == '1'){
                       names = "<font color='#307f7a' class='treeFont' ids='"+id11+"'>"+ name1+" ("+type+")</font>"
                   }else{
                       names = "<font color='#b2041a' class='treeFont' ids='"+id11+"'>"+ name1+" ("+type+")</font>"
                   }
                   var id1 = i+'' + j + '';
                   var id2 = parseInt(id1);
                   var obj1 =  { id:id2, pId:i, name:names,icon:"css/lib/img/diy/2.png"};

                   zNodes.push(obj1)
               }

           }
            console.log(zNodes);
            $.fn.zTree.init($("#treeMultiple"), setting, zNodes);

            $('.treeFont').eq(0).click();
            $('.treeFont').eq(0).addClass('onClicks');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            console.log('1111')
            myAlter("请求失败！");
        }
    })

}

getBuildTree();

//树状图下方统计信息
function getTreeMessage(){
    var length = $('.treeFont').length;
    var num = 0;
    for(var i=0; i<length; i++){
        var txt = $('.treeFont').eq(i).attr('color');

        if(txt == '#b2041a'){

            num ++;
        }

    }


    $('.tree-bottom p span').html(length);
    $('.tree-bottom p b').html(num + " ");
}
getTreeMessage();

//给楼宇列表赋值
function pushBuildArr(){
    _table = $('#dateTables4').dataTable();
    //给表格添加后台获取到的数据
    setDatas(buildArr);
    hiddrenId();
   $('.dataTables_filter input').attr('placeHolder',' 请输入楼宇名称进行搜索');
}

//点击table中某一行时
$('#dateTables4 tbody').on('click','tr',function(){
    $('tr').removeClass('onFocus');
    $(this).addClass('onFocus');

});

$('#choose-building .btn-primary').on('click',function(){
    var dom = $('#dateTables4').find('.onFocus');
    console.log(dom);

    //存放能耗类型
    var typeArr=[];
    if(dom.length == 0){
        myAlter('请选择某个楼宇进行操作');
        return false;
    }
        var txt =  dom.children().eq(1).find('span').html();
        var id = dom.children().eq(0).html();

        for(var i=0; i<buildArr.length; i++){
            if(id == buildArr[i].pointerID){
                 typeArr = buildArr[i].meterEnergyTypes;

            }
        };

        console.log(typeArr);
        var html = '';
        for(var i=0; i<typeArr.length; i++){
            html += '<li ids="'+typeArr[i]+'">'+getEnergyType(typeArr[i])+'</li>'
        }


        $('#choose-building').modal('hide');
        dom.removeClass('onFocus');

        $('.in').find('.add-inputs').eq(0).val(txt);
        $('.in').find('.add-inputs').eq(0).attr('ids',id);

        if(typeArr.length != 0){
            $('.in').find('.add-inputs').eq(1).find('span').html(getEnergyType(typeArr[0]));
            $('.in').find('.add-inputs').eq(1).find('span').attr('ids',typeArr[0]);

            $('.in').find('.add-inputs').eq(1).parents('.add-input-father').find('ul').html(html);

            $(document).on('click', function () {
                if ($('.add-select-block').is(':hidden')) {
                    $('.add-select-block').css({
                        display: 'none'
                    });
                    rotateNum = 1;
                    var num = rotateNum * 180;
                    var string = num + 'deg';
                    $('.add-input-select').children('div').css({
                        'transform': 'rotate(' + string + ')'
                    })
                }

            });

            $('.add-select-block li').on('click',function(){
                var text = $(this).html();
                var num0 = $(this).attr('ids');
                var num1 = $(this).attr('factor');
                var num2 = $(this).attr('unit');
                $(this).parents('.add-input-father').children('.add-select-block').slideToggle();
                $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').html(text);
                $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('ids',num0);
                $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('factor',num1);
                $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('unit',num2);
                rotateNum++;
                var num = rotateNum * 180;
                var string = num + 'deg';
                $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('div').css({

                    'transform':'rotate('+string+')'
                })
            });
        }



});

var openNum = 0;

$('.meters-btn').on('click',function(){
    if(openNum % 2 == 0){
        $('.in .meters-btn').html('关闭多表输入模式');
        openNum ++;
    }else{
        $('.in .next-btn').css({
            display:'none'
        });
        $('.show-plan').css({
            display:'none'
        });
        $('.in .meters-btn').html('开启多表输入模式');
        getData = [];
        openNum ++;
    }
    $('.push-meters').slideToggle();


});



//搜索功能
//搜索功能
//首先判断搜索框的状态(目的：通过判断是否有empty类来判断input中是否有内容)；
$('#key').bind('blur',blurKey);
$('#key').bind('focus',focusKey);
//input标签内容改变的触发事件(input和propertychange)事件
//　input事件是IE之外的大多数浏览器支持的事件，在value改变时实时触发，但是通过js改变value时不会触发；propertychange事件是任何属性改变都会触发，而input却只在value改变时触发，input要通过addEventListener()来注册，propertychange注册方法与一般事件相同。
$('#key').bind('input',seachNode);
//目的就是判断搜索框内是不是输入了内容
function blurKey(e){
    //如果失去焦点的时候，搜索框没有内容的时候添加empty类
    if($('#key').val()==''){
        $('#key').addClass('empty');
    }  //起了初始化的作用
}
//获得焦点的时候，搜索框移除empty类
function focusKey(e){
    if($('#key')){
        $('#key').removeClass('empty');
    }
}
//模糊搜索
//nodeList存放的是搜索出来的zTree节点；
var nodeList = [];
//目的是为了区分是不是重新输入了搜索关键字，如果一样的话就不变，不一样的话重新构建
var lastValue = '';
function seachNode(e){
    //首先获得要搜索的zTree树
    var zTree = $.fn.zTree.getZTreeObj("treeMultiple");
    //获得input里的输入内容
    //var value = $('#key').val();
    //这里为了更精确，用trim来去掉value的首尾空格
    var value = $.trim($('#key').val());
    var keyType = 'name';
    //判断如果输入框的内容和上次输入的一样，就不执行了，如果不一样再执行
    if (lastValue === value)
        return;
    lastValue = value;
    if (value === "") {
        $('.tip').hide();
        //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。
        //获取 zTree 的全部节点数据
        //如果input是空的则显示全部；
        zTree.showNodes(zTree.transformToArray(zTree.getNodes())) ;
        return;
    }
    //依据：nodeList = zTree.getNodesByParamFuzzy(keyType,value) ;这是zTree自带的模糊搜索的功能keyType是需要模糊匹配的属性名称，value是需要模糊匹配的属性值
    //根据节点数据的属性搜索，获取条件模糊匹配的节点数据 JSON 对象集合
    nodeList = zTree.getNodesByParamFuzzy(keyType,value);
    //console.log(nodeList); //[onject](父节点，子孙节点都是以属性的形式存在)
    //console.log(nodeList);  输出的是对象
    //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。(免去用户自行编写递归遍历全部节点的麻烦)
    nodeList = zTree.transformToArray(nodeList);
    //console.log(nodeList);//[object,object,object,object,object];
    //只要是nodeList是父元素，子孙元素也是会查找出来的；
    //得到的数组
    if(nodeList.length == 0){
        //显示提示div（抱歉......）
        $('.tip').show();
    }else{
        $('.tip').hide();
    }
    updateNodes();
}
//选中之后更新节点
function updateNodes(){
    //首先选中树
    //获取 id 为 tree 的 zTree 对象
    var zTree = $.fn.zTree.getZTreeObj("treeMultiple");
    //获取 zTree 的全部节点数据
    //console.log(zTree.getNodes());
    var allNode = zTree.transformToArray(zTree.getNodes());
    //console.log(allNode);所有节点不管是父子孙都输出
    //指定被隐藏的节点 JSON 数据集合hideNodes();
    zTree.hideNodes(allNode);
    //zTree都是可以在控制台输出的，只是界面显示不出来
    //zTree.showNodes(nodeList);
    //遍历nodeList第n个nodeList
    for(var n in nodeList){
        findParent(zTree,nodeList[n]);
    }
    zTree.showNodes(nodeList);
}
//整理选出来的节点的关系
function findParent(zTree,node){
    //展开 / 折叠 指定的节点（需要 展开 / 折叠 的节点数据，expandFlag = true表示展开节点，操作是否影响子节点，focus = true 表示 展开 / 折叠 操作后，通过设置焦点保证此焦点进入可视区域内）
    zTree.expandNode(node,true,false,false);
    //pNode父节点getParentNode（）获取 treeNode 节点的父节点。
    var pNode = node.getParentNode();
    //console.log(pNode);//得到搜索节点后的父节点和祖先节点
    if(pNode != null){
        nodeList.push(pNode);
        findParent(zTree,pNode);
    }
}


function CompareDate(d1,d2)
{
    return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
}
//选择日期插件
$('.chooseDate').datepicker(
    {
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy-mm-dd'
    }
);
$('#mult-import').on('click','.btn-primary',function(){
    console.log('ok');
    $('.show-plan').css({
        display:'block'
    });
    $('#mult-import').modal('hide')

});

//检验是否必填项全部填写
function checkedNull(dom){
    var checkNum = $(dom).find('.input-label').length;

    for(var i=0; i< checkNum; i++){
        if( $(dom).find('.input-label').eq(i).next().find('input').val() == ''){
            var txt = $(dom).find('.input-label').eq(i).next().find('input').parent().prev().html().split('：')[0];

            console.log(txt);
            myAlter(txt + " 不能为空")
            getFocus1($(dom).find('.input-label').eq(i).next().find('input'));
            return false;
        };
        if($(dom).find('.input-label').eq(i).next().find('.add-input-select').find('span').html() == ''){
            var txt = $(dom).children('.input-label').eq(i).html().split('：')[0];
            $('#check-text').modal('show');
            myAlter(txt + " 不能为空")
            return false;
        }
    }
    return true;
}

function checkedNull1(dom){
    var checkNum = $(dom).find('.input-labels').length;

    for(var i=0; i< checkNum; i++){
        if( $(dom).find('.input-labels').eq(i).next().find('input').val() == ''){
            var txt = $(dom).find('.input-labels').eq(i).next().find('input').parent().prev().html().split('：')[0];

            console.log(txt);
            myAlter(txt + " 不能为空")
            getFocus1($(dom).find('.input-labels').eq(i).next().find('input'));
            return false;
        };
        if($(dom).find('.input-labels').eq(i).next().find('.add-input-select').find('span').html() == ''){
            var txt = $(dom).children('.input-labels').eq(i).html().split('：')[0];
            $('#check-text').modal('show');
            myAlter(txt + " 不能为空")
            return false;
        }
    }
    return true;
}

//检验抄表止数
function checkedEndNum(dom){
    var range = $(dom).find('.cycleNum').attr('range');

    console.log(range);
    if(parseFloat($(dom).find('.end-number').val()) > parseFloat(range)){


        myAlter("抄表止数 必须小于量程");
        getFocus1($(dom).find('.end-number'));
        return false;

    }

    return true;
}

//左侧搜索是否显示
var showNum = 0;
$('.showOrHidden').on('click',function(){

    if(showNum % 2 == 0){
        $('.main-content-left').css({
            display:'none'
        });

        $('.main-content-right').css({
            marginLeft:'0px'
        });
    }else{
        $('.main-content-left').css({
            display:'block'
        });

        $('.main-content-right').css({
            marginLeft:'365px'
        });
    }


    showNum ++;
});