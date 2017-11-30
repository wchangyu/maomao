$(function(){
    /*-------------------------全局变量------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //登记弹出框的vue对象
    var myApp33 = new Vue({
        el:'#myApp33',
        data:{
            mingcheng:'',
            sbfl:'',
            options:[],
            gznr:'',
            byfs:'',
            beizhu:''
        }
    })
    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });
    //表格
    var _table = $('#scrap-datatables');
    var  _allData = [];
    var _thisRowBM = '';
    //存放设备类型的所有数据
    var _allDataLX = [];
    //获取设备类型
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#shebeileixing'),'dcName','dcNum',myApp33.options);
    /*-------------------------表格初始化----------------------*/
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
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
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
                className:'saveAs'
            }
        ],
        "columns": [
            {
                title:'条目编码',
                data:'ditNum',
                className:'bianma'
            },
            {
                title:'条目名称',
                data:'ditName',
                className:'mingcheng'
            },
            {
                title:'设备分类',
                data:'dcName',
            },
            {
                title:'工作内容',
                data:'desc'
            },
            {
                title:'保养方式',
                data:'mtContent'
            },
            {
                title:'备注',
                data:'remark',
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
    conditionSelect();
    /*-------------------------按钮方法-----------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    });
    //登记按钮
    $('.creatButton').on('click',function(){
        //初始化
        if( _allDataLX.length !=0 ){
            myApp33.sbfl = _allDataLX[0].dcNum;
        }
        myApp33.mingcheng = '';
        myApp33.gznr = '';
        myApp33.byfs = '';
        myApp33.bjgx = '1';
        myApp33.beizhu = '';
        //可编辑
        abledBlock()

        $('#myModal').find('.btn-primary').removeClass('.bianji').addClass('dengji');
        //确定按钮显示，
        _moTaiKuang($('#myModal'), '新增', '', '' ,'', '新增');
    });
    _table.find('tbody')
    //查看按钮
    .on('click','.option-see',function(){
        //样式
        trCss($(this));
        $('#myModal').find('.btn-primary').hide();
        bjOrCk($(this),true);

        disabledBlock();
    })
    //编辑按钮
    .on('click','.option-edite',function(){
        $('#myModal').find('.btn-primary').removeClass('.dengji').addClass('bianji');
        //样式
        trCss($(this));
        //$('#myModal').find('.btn-primary').show();
        bjOrCk($(this),false);

        abledBlock();
    })
    //删除按钮
    .on('click','.option-delete',function(){
        //样式
        trCss($(this));
        _thisRowBM = $(this).parents('tr').find('.bianma').html();
        //赋值
        $('#tmbm').val($(this).parents('tr').find('.bianma').html());
        $('#tmmc').val($(this).parents('tr').find('.mingcheng').html());

        _moTaiKuang($('#myModal3'), '确定要删除吗？', '', '' ,'', '删除');
    })
    $('#myModal')
        //登记确定按钮；
        .on('click','.dengji',function(){

            if( myApp33.mingcheng == '' ){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');
            }else {
                //获取填写的值
                var prm = {
                    dcNum:myApp33.sbfl,
                    dcName: $.trim($('#sblx').find('option:selected').html()),
                    ditName:myApp33.mingcheng,
                    description:myApp33.gznr,
                    mtContent:myApp33.byfs,
                    remark:myApp33.beizhu,
                    userID:_userIdName
                }
                $.ajax({
                    type:'post',
                    url:_urls + 'YWDevMT/ywDMAddDIItem',
                    data:prm,
                    success:function( result ){
                        if(result == 99){

                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'新增成功！', '');

                            conditionSelect();

                            $('#myModal').modal('hide');

                        }else{

                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'新增失败！', '');
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
        //编辑确定按钮
        .on('click','.bianji',function(){
            if( myApp33.mingcheng == '' ){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');
            }else{

                var prm = {
                    dcNum:myApp33.sbfl,
                    dcName:$('#sblx').find('option:selected').html(),
                    ditNum:_thisRowBM,
                    ditName:myApp33.mingcheng,
                    description:myApp33.gznr,
                    mtContent:myApp33.byfs,
                    remark:myApp33.beizhu,
                    userID:_userIdName
                };
                $.ajax({
                    type:'post',
                    url:_urls + 'YWDevMT/ywDMUptDIItem',
                    data:prm,
                    success:function(result){
                        if(result == 99){

                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'编辑成功！', '');

                            conditionSelect();

                            $('#myModal').modal('hide');
                        }else{

                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'编辑失败！', '');

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
        //删除确定按钮
    $('#myModal3').on('click','.shanchu',function(){
            var prm = {
                ditNum :_thisRowBM,
                userID:_userIdName
            };
            $.ajax({
                type:'post',
                url:_urls + 'YWDevMT/ywDMDelDIItem',
                data:prm,
                success:function(result){

                    if(result == 99){

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'删除成功！', '');

                        conditionSelect();
                    }else{

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'删除失败！', '');

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
    })
    /*-------------------------其他方法----------------------*/
    //确定新增弹出框的位置
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
        var prm = {
            dcNum:$('#shebeileixing').val(),
            ditName:$('.filterInput').val(),
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevMT/YWDMGetDMItems',
            data:prm,
            success:function(result){
                for(var i=0;i<result.length;i++){
                    _allData.push(result[i]);
                }
                datasTable(_table,result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
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
                var str = '<option value="">全部</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option' + ' value="' + result[i][num] +'">' + result[i][text] + '</option>'
                    var obj = {};
                    obj.text = result[i][text];
                    obj.value = result[i][num];
                    arr.push(obj);
                    allArr.push(result[i]);
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
    function bjOrCk(el,zhi){
        //确定按钮显示，
        var $myModal = $('#myModal');

        _moTaiKuang($myModal, '编辑', '', '' ,'', '保存')
        //赋值
        _thisRowBM = el.parents('tr').find('.bianma').html();
        for( var i=0;i<_allData.length;i++ ){
            if( _allData[i].ditNum == _thisRowBM ){
                myApp33.mingcheng = _allData[i].ditName;
                myApp33.sbfl = _allData[i].dcNum;
                myApp33.gznr = _allData[i].desc;
                myApp33.byfs = _allData[i].mtContent;
                myApp33.beizhu = _allData[i].remark;
            }
        }
        //给所有的操作框添加不可操作属性
        var notOption = $('#myApp33').children().children().children('.input-blockeds').children();
        notOption.attr('disabled',zhi);
    }
    //click tr css change
    function trCss(el){
        var $this = el.parents('tr');
        $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
    }
    //操作成功提示框消息
    function tipInfo(el,meg,el1){
        var myModal = el;
        myModal.find('.modal-body').html(meg);
        if(el1){
            el1.modal('hide');
        }
    }

    //可操作
    function abledBlock(){

        $('#myModal').find('input').attr('disabled',false).removeClass('disabled-block');

        $('#myModal').find('select').attr('disabled',false).removeClass('disabled-block');

        $('#myModal').find('textarea').attr('disabled',false).removeClass('disabled-block');
    }

    //不可操作
    function disabledBlock(){

        $('#myModal').find('input').attr('disabled',true).addClass('disabled-block');

        $('#myModal').find('select').attr('disabled',true).addClass('disabled-block');

        $('#myModal').find('textarea').attr('disabled',true).addClass('disabled-block');

    }
})