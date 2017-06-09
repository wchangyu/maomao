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
            miaoshu:'',
            cankaozhi:'',
            bjgx:'是/否',
            options1:[
                {text:'是/否',value:'是/否'},
                {text:'<',value:'<'},
                {text:'<=',value:'<='},
                {text:'=',value:'='},
                {text:'>=',value:'>='},
                {text:'>',value:'>'}
            ],
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
                title:'条目描述',
                data:'desc',
            },
            {
                title:'参考关系',
                data:'relation'
            },
            {
                title:'条目参考值',
                data:'stValue',
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
        myApp33.miaoshu = '';
        myApp33.cankaozhi = '';
        myApp33.bjgx = '1';
        myApp33.beizhu = '';
        //确定按钮显示，
        $('#myModal').find('.btn-primary').show();
        $('#myModal').find('.btn-primary').removeClass('bianji').addClass('dengji');
        moTaiKuang($('#myModal'));
        $('#myModal').find('.modal-title').html('新增');
    });
    _table.find('tbody')
    //查看按钮
    .on('click','.option-see',function(){
        //样式
        var $this = $(this).parents('tr');
        $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        $('#myModal').find('.btn-primary').hide();
        bjOrCk($(this),true);
        $('#myModal').find('.modal-title').html('详情');
    })
    //编辑按钮
    .on('click','.option-edite',function(){
        //样式
        var $this = $(this).parents('tr');
        $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        $('#myModal').find('.btn-primary').show();
        bjOrCk($(this),false);
        $('#myModal').find('.modal-title').html('编辑');
    })
    //删除按钮
    .on('click','.option-delete',function(){
        //样式
        var $this = $(this).parents('tr');
        $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        _thisRowBM = $(this).parents('tr').find('.bianma').html();
        //赋值
        $('#tmbm').val($(this).parents('tr').find('.bianma').html());
        $('#tmmc').val($(this).parents('tr').find('.mingcheng').html());
        moTaiKuang($('#myModal3'));
    })
    $('#myModal')
        //登记确定按钮；
        .on('click','.dengji',function(){
            if( myApp33.mingcheng == 0 ){
                var $myModal = $('#myModal2');
                moTaiKuang($myModal);
                $myModal.find('.modal-body').html('请填写红色必填项！')
            }else {
                //获取填写的值
                var prm = {
                    dcNum:myApp33.sbfl,
                    dcName: $.trim($('#sblx').find('option:selected').html()),
                    ditName:myApp33.mingcheng,
                    desc:myApp33.miaoshu,
                    relation:myApp33.bjgx,
                    stValue:myApp33.cankaozhi,
                    remark:myApp33.beizhu,
                    userID:_userIdName
                }
                $.ajax({
                    type:'post',
                    url:_urls + 'YWDevIns/ywDIAddDIItem',
                    data:prm,
                    success:function( result ){
                        if(result == 99){
                            var $myModal = $('#myModal2');
                            $myModal.find('.modal-body').html('添加成功!');
                            moTaiKuang($myModal);
                            $('#myModal').modal('hide');
                            conditionSelect();
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
            var prm = {
                dcNum:myApp33.sbfl,
                dcName:$('#sblx').find('option:selected').html(),
                ditNum:_thisRowBM,
                ditName:myApp33.mingcheng,
                description:myApp33.miaoshu,
                relation:myApp33.bjgx,
                stvalue:myApp33.cankaozhi,
                remark:myApp33.beizhu,
                userID:_userIdName
            };
            $.ajax({
                type:'post',
                url:_urls + 'YWDevIns/ywDIUptDIItem',
                data:prm,
                success:function(result){
                    console.log(result);
                    if(result == 99){
                        $('#myModal2').find('.modal-body').html('编辑成功!');
                        moTaiKuang($('#myModal2'));
                        $('#myModal').modal('hide');
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

        //删除确定按钮
    $('#myModal3').on('click','.shanchu',function(){
            var prm = {
                ditNum :_thisRowBM,
                userID:_userIdName
            };
            $.ajax({
                type:'post',
                url:_urls + 'YWDevIns/ywDIDelDIItem',
                data:prm,
                success:function(result){
                    console.log(result);
                    if(result == 99){
                        $('#myModal2').find('.modal-body').html('删除成功!');
                        moTaiKuang($('#myModal2'));
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
    })
    /*-------------------------其他方法----------------------*/
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
            url:_urls + 'YWDevIns/YWDIGetDIItems',
            data:prm,
            success:function(result){
                console.log(result);
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
        //添加编辑类
        $myModal.find('.btn-primary').removeClass('dengji').addClass('bianji');
        moTaiKuang($myModal);
        //赋值
        _thisRowBM = el.parents('tr').find('.bianma').html();
        for( var i=0;i<_allData.length;i++ ){
            if( _allData[i].ditNum == _thisRowBM ){
                myApp33.mingcheng = _allData[i].ditName;
                myApp33.sbfl = _allData[i].dcNum;
                myApp33.cankaozhi = _allData[i].stValue;
                myApp33.miaoshu = _allData[i].desc;
                myApp33.bjgx = _allData[i].relation;
                myApp33.beizhu = _allData[i].remark;
            }
        }
        //给所有的操作框添加不可操作属性
        var notOption = $('#myApp33').children().children().children('.input-blockeds').children();
        notOption.attr('disabled',zhi);
    }
})