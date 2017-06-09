$(function(){
    /*----------------------------------一些全局变量-------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //新增Vue对象
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
    //非空验证
    //验证必填项（非空）
    Vue.validator('noempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });
    //存放所有巡检内容的数组
    var _allDataArr = [];
    //存放所有供选择的巡检条目数组
    var _allXJTMArr = [];
    //存放所有已选择的巡检条目数组
    var _allXJSelect = [];
    //存放设备类型的所有数据
    var _allDataLX = [];
    //存放巡检内容的所有数组
    var _allData = [];
    //获取设备类型
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#shebeileixing'),'dcName','dcNum');
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#sbfl'),'dcName','dcNum',workDone.options);
    if(workDone.options.length>0){
        workDone.sbfl = workDone.options[0].value;
    }
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#shebeileixings'),'dcName','dcNum');
    /*----------------------------------表格相关-----------------------------------------*/
    var _table = $('#scrap-datatables');
    var _tableAdd = $('#zhiXingPerson');
    var _tableXJ = $('#personTable1');
   //巡检内容表格
    var _tables =  _table.DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'t<"F"lip>',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs btn btn-success'
            }
        ],
        "columns": [
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
        ]
    });
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());

    //添加巡检条目表格
    _tableAdd.DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'B<"clear">lfrtip',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs hidding'
            }
        ],
        "columns": [
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
                title:'条目编码',
                data:'ditNum',
                className:'bianma'
            },
            {
                title:'条目名称',
                data:'ditName'
            },
            {
                title:'条目参考值',
                data:'stValue'
            },
            {
                title:'参考关系',
                data:'relation'
            }
        ]
    });

    //巡检条目已选结果表格
    _tableXJ.DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'B<"clear">lfrtip',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs hidding'
            }
        ],
        "columns": [
            {
                title:'设备类型',
                data:'dcName'
            },
            {
                title:'条目编码',
                data:'ditNum',
                className:'bianma'
            },
            {
                title:'条目名称',
                data:'ditName'
            },
            {
                title:'条目参考值',
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
        ]
    });

    //添加表头复选框
    var creatCheckBox = '<input type="checkbox">';
    $('thead').find('.checkeds').prepend(creatCheckBox);

    //复选框点击事件（添加巡检条目）
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
    //表格数据
    conditionSelect();
    /*-------------------------------------按钮事件-------------------------------------*/
    //新增
    $('.creatButton').click(function(){
        var $myModal = $('#myModal');
        moTaiKuang($myModal);
        $myModal.find('.modal-title').html('新增');
        //确定按钮添加登记类
        $myModal.find('.btn-primary').show().removeClass('bianji').addClass('dengji');
        //初始化
        workDone.xjnrbm = '';
        workDone.xjnrmc = '';
        workDone.beizhu = '';
        var empty = [];
        datasTable(_tableXJ,empty);
        //所有操作框不可操作
        $('#workDone').children().children().children('.input-blockeds').children().attr('disabled',false);
        //添加按钮隐藏
        $('.zhiXingRenYuanButton').show();
        //初始化的时候清空表格的的值
        _allXJSelect = [];
    })
    //添加巡检条目按钮
    $('.zhiXingRenYuanButton').click(function(){
        //获取数据
       var prm = {
           ditName:$('#shebeileixings').val(),
           dcNum:$('#filter_global').val(),
           userID:_userIdName
       };
        $.ajax({
            type:'post',
            url: _urls + 'YWDevIns/YWDIGetDIItems',
            data:prm,
            async:false,
            success:function(result){
                console.log(_allXJSelect);
                _allXJTMArr = [];
                for(var i=0;i<result.length;i++){
                    _allXJTMArr.push(result[i]);
                }
                datasTable(_tableAdd,result);
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
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
        moTaiKuang($('#myModal1'));
    });
    $('#selecte').click(function(){
        var prm = {
            dcNum:$('#shebeileixings').val(),
            ditName:$('.filter_global').children('input').val(),
            userID:_userIdName
        };
        console.log(prm);
        $.ajax({
            type:'post',
            url: _urls + 'YWDevIns/YWDIGetDIItems',
            data:prm,
            async:false,
            success:function(result){
                console.log(result);
                _allXJTMArr = [];
                for(var i=0;i<result.length;i++){

                    _allXJTMArr.push(result[i]);
                }
                datasTable(_tableAdd,result);
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
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    })
    //添加巡检条目确定按钮
    $('.selectTableList').click(function(){
        _allXJSelect = [];
        //获取选中的列表
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
        $('#myModal1').modal('hide');
        datasTable(_tableXJ,_allXJSelect);
    });
    //删除巡检条目按钮
    _tableXJ.children('tbody').on('click','.option-delete',function(){
        //样式
        var $this = $(this).parents('tr');
        _tableXJ.children('tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        var $myModal = $('#myModal2');
        $myModal.find('.btn-primary').removeClass('dashanchu').addClass('xiaoshanchu');
        //删除框赋值
        var $thisRow = $(this).parents('tr');
        $('#xjtmbm').val($thisRow.find('.bianma').html());
        $('#xjtmmc').val($thisRow.find('.bianma').next().html());
        moTaiKuang($myModal);
    });
    //删除巡检条目确定按钮(静态数据)
    $('#myModal2')
        .on('click','.xiaoshanchu',function(){
            //获取要删除的条目的编码和名称，进行删除
            _allXJSelect.removeByValue($('#xjtmbm').val());
            console.log(_allXJSelect);
            datasTable(_tableXJ,_allXJSelect);
            $('#myModal2').modal('hide');
        })
    //表格中的按钮操作
    _table.find('tbody')
        .on('click','.option-see',function(){
            ckOrBj($(this),true);
            $('#myModal').find('.btn-primary').hide();
            //添加按钮隐藏
            $('.zhiXingRenYuanButton').hide();
            $('#myModal').find('.modal-title').html('详情');
        })
        .on('click','.option-edite',function(){
            ckOrBj($(this),false);
            $('#myModal').find('.btn-primary').show().removeClass('dengji').addClass('bianji');
            //添加按钮隐藏
            $('.zhiXingRenYuanButton').show();
            $('#myModal').find('.modal-title').html('详情');
        })
        .on('click','.option-delete',function(){
            //修改样式
            var $this = $(this).parents('tr');
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            var $thisMC = $(this).parents('tr').children('.mingcheng').html();
            var $myModal = $('#myModal2');
            moTaiKuang($myModal);
            $myModal.find('.btn-primary').removeClass('xiaoshanchu').addClass('dashanchu');
            //赋值
            $('#xjtmbm').val($thisBM);
            $('#xjtmmc').val($thisMC);

        })
    //表格编辑确定按钮
    $('#myModal')
        .on('click','.bianji',function(){
            var tableArr = [];
            for(var i=0;i<_allXJSelect.length;i++){
                var obj = {};
                obj.id = _allXJSelect[i].id;
                obj.dicNum = _allXJSelect[i].dcNum;
                obj.ditNum = _allXJSelect[i].ditNum;
                tableArr.push(obj);
            }
            var prm = {
                dcNum:workDone.sbfl,
                dcName: $.trim($('#sblx').children('option:selected').html()),
                dicName:workDone.xjnrmc,
                dicNum:workDone.xjnrbm,
                remark:workDone.beizhu,
                dicItems:tableArr,
                userID:_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDevIns/YWDIUptDIContent',
                data:prm,
                success:function(result){
                    console.log(result);
                    if(result == 99){
                        $('#myModal').modal('hide');
                        //提示
                        moTaiKuang($('#myModal3'));
                        $('#myModal3').find('.modal-body').html('编辑成功!');
                        conditionSelect()
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(JSON.parse(jqXHR.responseText).message);
                    if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    }
                }
            })
        })
        .on('click','.dengji',function(){
            if( workDone.xjnrmc == 0 ){
                var $myModal = $('#myModal3');
                moTaiKuang($myModal);
                $myModal.find('.modal-body').html('请填写红色必填项！');
            }else {
                var tableArr = [];
                for(var i=0;i<_allXJSelect.length;i++){
                    var obj = {};
                    obj.id = _allXJSelect[i].id;
                    obj.ditNum = _allXJSelect[i].ditNum;
                    tableArr.push(obj);
                }
                var prm = {
                    dcNum:workDone.sbfl,
                    dcName: $.trim($('#sblx').children('option:selected').html()),
                    dicName:workDone.xjnrmc,
                    remark:workDone.beizhu,
                    dicItems:tableArr,
                    userID:_userIdName
                }
                $.ajax({
                    type:'post',
                    url:_urls + 'YWDevIns/YWDIADDDIContent',
                    data:prm,
                    success:function(result){
                        if(result == 99){
                            $('#myModal').modal('hide');
                            //提示
                            moTaiKuang($('#myModal3'));
                            $('#myModal3').find('.modal-body').html('添加成功!');
                            conditionSelect()
                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.parse(jqXHR.responseText).message);
                        if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                        }
                    }
                })
            }
        })
        $('#myModal2').on('click','.dashanchu',function(){
            var prm = {
                dicNum: $.trim($('#xjtmbm').val()),
                userID:_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDevIns/YWDIDelDIContent',
                data:prm,
                success:function(result){
                    if(result == 99){
                        alert(0)
                        $('#myModal').modal('hide');
                        //提示
                        moTaiKuang($('#myModal3'));
                        $('#myModal3').find('.modal-body').html('删除成功!');
                        $('#myModal3').modal('hide');
                        conditionSelect();
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(JSON.parse(jqXHR.responseText).message);
                    if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    }
                }
            })
        })
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });
    /*--------------------------------------其他方法------------------------------------*/
    //确定新增弹出框的位置
    function moTaiKuang(who){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
    }
    //dataTables表格填数据
    function datasTable(tableId,arr){
        if(arr.length == 0){
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnDraw();
        }else{
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }
    //根据值删除数组
    Array.prototype.removeByValue = function(val) {
        for(var i=0; i<this.length; i++) {
            if(this[i].ditNum == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
    //条件查询
    function conditionSelect(){
        var prm={
            dicName:'',
            dcNum:'',
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIGetDIContents',
            data:prm,
            success:function(result){
                _allData = [];
                for(var i=0;i<result.length;i++){
                    _allData.push(result[i]);
                }
                datasTable(_table,result);
                //console.log(_allData);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    }
    //ajaxFun（select的值）
    function ajaxFun(url,allArr,select,text,num,arr){
        var prm = {
            'userID':_userIdName
        }
        prm[text] = '';
        $.ajax({
            type:'post',
            url:_urls + url,
            async:false,
            data:prm,
            success:function(result){
                //给select赋值
                if(arr){
                    var str = '';
                    for(var i=0;i<result.length;i++){
                        str += '<option' + ' value="' + result[i][num] +'">' + result[i][text] + '</option>'
                        allArr.push(result[i]);
                            var obj = {};
                            obj.text = result[i][text];
                            obj.value = result[i][num];
                            arr.push(obj);
                    }
                }else{
                    var str = '<option value="">全部</option>';
                    for(var i=0;i<result.length;i++){
                        str += '<option' + ' value="' + result[i][num] +'">' + result[i][text] + '</option>'
                        allArr.push(result[i]);
                    }
                }
                select.append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    }
    //查看/编辑绑定数据
    function ckOrBj(el,zhi){
        //修改样式
        var $this = el.parents('tr');
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        //确定按钮隐藏
        var $myModal = $('#myModal');
        moTaiKuang($myModal);
        //获取内容下属条目
        //首先确定当前点击之后的条目编码
        var $thisBM = el.parents('tr').children('.bianma').html();
        //绑定显示数据
        for(var i=0;i<_allData.length;i++){
            if(_allData[i].dicNum == $thisBM){
                workDone.xjnrbm = _allData[i].dicNum;
                workDone.xjnrmc = _allData[i].dicName;
                workDone.sbfl = _allData[i].dcNum;
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
            success:function(result){
                _allXJSelect = [];
                for(var i=0;i<result.length;i++){
                    _allXJSelect.push(result[i]);
                }
                datasTable(_tableXJ,result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });
        //所有操作框不可操作
        $('#workDone').children().children().children('.input-blockeds').children().attr('disabled',zhi);
    }
})