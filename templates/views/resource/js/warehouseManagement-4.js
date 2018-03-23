$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //获得用户id
    var _userIdNum = sessionStorage.getItem('userName');

    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');

    //获取角色权限
    var  _userRole = sessionStorage.getItem("userRole");

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //仓库是否完成
    var _iswarehouse = false;

    //存放所有数据
    var _ckArr = [];

    //存放所有清单数据
    var _allData = [];
    /*-------------------------------------表格初始化------------------------------*/
    var _tables = $('.main-contents-table .table,#mul-table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "iDisplayLength":50,//默认每页显示的条数
        "pagingType":"full_numbers",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            //"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs',
                exportOptions:{
                    columns:[0,1,2,3,5,6,7,8,9,10,11,12,13]
                }
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'类别',
                data:'cateName'
            },
            {
                title:'物品编号',
                data:'itemNum',
                className:'itemNum'
            },
            {
                title:'物品名称',
                data:'itemName',
                className:'itemName'
            },
            {
                title:'品牌',
                data:'brand'
            },
            {
                title:'规格',
                data:'size'
            },
            {
                title:'物品序列号',
                data:'sn',
                className:'sn'
            },
            {
                title:'是否耐用',
                data:'isSpare',
                render:function(data, type, full, meta){
                    if(data == 0){
                        return '否'
                    }if(data == 1){
                        return '是'
                    }
                }
            },
            {
                title:'仓库',
                data:'storageName'
            },
            {
                title:'库区',
                data:'localName'
            },
            {
                title:'库存数',
                data:'num'
            },
            {
                title:'单价',
                render:function(data,type,full,meta){

                    var prince = Number(full.amount) / Number(full.num);

                    return formatNumber(prince);

                }
            },
            {
                title:'金额',
                data:'amount',
                render:function(data, type, full, meta){
                    return formatNumber(data)
                }
            },
            {
                title:'品质',
                data:'batchNum'
            },
            {
                title:'预警下限',
                data:'minNum'
            },
            {
                title:'预警上限',
                data:'maxNum'
            },
            {
                title:'操作',
                render:function(data,type,full,meta){

                    var ul = 'warehouseManagement-5.html?itemNum=' + full.itemNum + '&itemName=' + full.itemName;

                    if( full.spareItems ){

                        return "<span class='data-option option-see2 btn default btn-xs green-stripe'>查看全部</span>"

                            + "<a href=" + ul +

                            " target='_blank'><span class='data-option option-see1 btn default btn-xs green-stripe'>查看明细</span></a>";

                    }else{

                        return "<a href=" + ul +

                            " target='_blank'><span class='data-option option-see1 btn default btn-xs green-stripe'>查看明细</span></a>";

                    }

                }

            }

        ]
    });

    //自定义按钮位置
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());

    //加载页面的时候，隐藏其他两个导出按钮
    for( var i=1;i<$('.excelButton').children().length;i++ ){
        $('.excelButton').children().eq(i).addClass('hidding');
    };

    //数据
    warehouse();

    /*------------------------------------按钮事件-------------------------------*/
    //查询
    $('#selected').click(function(){
        conditionSelect();
    });

    //重置
    $('.resites').click(function(){
        //input清空
        $('.condition-query').find('input').val('');
        //select赋初始值
        $('.condition-query').find('select').val('');
        //是否默认：是
        $('#greaterThan').val(1);
    });

    //状态选项卡（选择确定/待确定状态）
    $('.table-title').children('span').click(function(){
        $('.table-title').children('span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.main-contents-table').addClass('hide-block');
        $('.main-contents-table').eq($(this).index()).removeClass('hide-block');
        //导出按钮显示
        for( var i=0;i<$('.excelButton').children().length;i++ ){
            $('.excelButton').children().eq(i).addClass('hidding');
        };
        $('.excelButton').children().eq($(this).index()).removeClass('hidding');
    });

    //仓库选择
    $('#ckSelect').on('change',function(){
        //根据仓库，联动库区
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetLocations',
            data:{
                storageNum:$('#ckSelect').val(),
                userID:_userIdNum,
                userName:_userIdName,
                b_UserRole:_userRole,
            },
            success:function(result){
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].localNum + '">' + result[i].localName + '</option>';
                }
                $('#kqSelect').empty().append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })

    //查看全部
    $('.main-contents-table .table tbody').on('click','.option-see2',function(){

        _moTaiKuang($('#MUL-Modal'), '查看全部', 'flag', '' ,'', '');

        //赋值

        var $thisBM = $(this).parents('tr').children('.itemNum').html();

        var $thisMC = $(this).parents('tr').children('.itemName').html();

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].itemNum == $thisBM && _allData[i].itemName == $thisMC){

                datasTable($('#mul-table'),_allData[i].spareItems);

                var num = 0;

                var amount = 0;

                for(var j=0;j<_allData[i].spareItems.length;j++){

                    num += _allData[i].spareItems[j].num;

                    amount += _allData[i].spareItems[j].amount;

                }

                $('#mul-table').find('#kcs0').html(num);

                $('#mul-table').find('#je0').html(amount.toFixed(2));

            }

        }

        $('#mul-table').find('')

    })
    /*------------------------------------其他方法-------------------------------*/

    //控制模态框的设置，出现确定按钮的话，第三个参数传''，第四个才有效,用不到的参数一定要传''；istap,如果有值的话，内容改变，否则内容不变。
    function _moTaiKuang(who, title, flag, istap ,meg, buttonName) {
        who.modal({
            show: false,
            backdrop: 'static'
        })
        who.find('.modal-title').html(title);
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight) / 2;
        who.find('.modal-dialog').css({'margin-top': markBlockTop});
        if (flag) {
            who.find('.btn-primary').hide();
        } else {
            who.find('.btn-primary').show();
            who.find('.modal-footer').children('.btn-primary').html(buttonName);
        }
        if(istap){
            who.find('.modal-body').html(meg);
        }
    }

    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var ckArr = [];
        var ckNum = '';
        if($('#ckSelect').val() == ''){
            for(var i=0;i<_ckArr.length;i++){
                ckArr.push(_ckArr[i].storageNum);
            }
            ckNum = '';
        }else{
            ckNum = $('#ckSelect').val();
            ckArr = [];
        }
        var prm = {
            'itemNum':filterInput[0],
            'itemName':filterInput[1],
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            'storageNum':ckNum,
            'storageNums':ckArr,
            'localNum':$('#kqSelect').val(),
            'hasNum':$('#greaterThan').val(),
            'isShowAllSpareItem':$('#isfold').val()

        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptItemStock',
            data:prm,
            success:function(result){

                _allData.length = 0;

                _allData = result;

                var downState = [];
                var upState = [];
                var nomalState = [];
                for(var i=0;i<result.length;i++){
                    if(result[i].alarmState == 0){
                        nomalState.push(result[i])
                    }else if(result[i].alarmState == 1){
                        downState.push(result[i])
                    }else if(result[i].alarmState == 2){
                        upState.push(result[i]);
                    }
                }
                datasTable($('#scrap-datatables'),result);
                datasTable($('#scrap-datatables1'),downState);
                datasTable($('#scrap-datatables2'),upState);
                datasTable($('#scrap-datatables3'),nomalState);

                var allResult = 0;
                var allResult1 = 0;
                for(var i=0;i<result.length;i++){
                    allResult += Number(result[i].num);
                    allResult1 += Number(result[i].amount);
                }
                $('#kcs').html(allResult);
                $('#je').html(formatNumber(allResult1));

                var allDownState = 0;
                var allDownState1 = 0;
                for(var i=0;i<downState.length;i++){
                    allDownState += downState[i].num;
                    allDownState1 += downState[i].amount;
                }
                $('#kcs1').html(allDownState);
                $('#je1').html(formatNumber(allDownState1));

                var allUpState = 0;
                var allUpState1 = 0;
                for(var i=0;i<upState.length;i++){
                    allUpState += upState[i].num;
                    allUpState1 += upState[i].amount;
                }
                $('#kcs2').html(allUpState);
                $('#je2').html(formatNumber(allUpState1));

                var allNomalState = 0;
                var allNomalState1 = 0;
                for(var i=0;i<nomalState.length;i++){
                    allNomalState += nomalState[i].num;
                    allNomalState1 += nomalState[i].amount;
                }
                $('#kcs3').html(allNomalState);
                $('#je3').html(formatNumber(allNomalState1));

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //dataTables表格填数据
    function datasTable(tableId,arr){
        var table = tableId.dataTable();
        if(arr.length == 0){
            table.fnClearTable();
            table.fnDraw();
        }else{
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }

    //仓库选择
    function warehouse(){
        var prm = {
            "userID": _userIdNum,
            "userName": _userIdName,
            "b_UserRole":_userRole,
            "hasLocation":1
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:prm,
            success:function(result){
                _ckArr.length = 0;
                _iswarehouse = true;
                var str = '<option value="">请选择</option>'
                for(var i=0;i<result.length;i++){
                    _ckArr.push(result[i]);
                    str += '<option value="' + result[i].storageNum + '">' +  result[i].storageName + '</option>';
                }
                $('#ckSelect').empty().append(str);
                //调用条件查询
                if(_iswarehouse){
                    conditionSelect();
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')

    //格式化数字，排除infinity NaN 其他格式
    function formatNumber(num){
        if(num===Infinity){
            return 0.00;
        }
        if(+num===num){
            return num.toFixed(2);
        }
        return 0.00;
    }
})