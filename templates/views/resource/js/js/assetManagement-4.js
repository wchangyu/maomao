$(function(){
    /*-------------------------------全局变量-----------------------------*/
    //获得用户ID
    var _userIdName = sessionStorage.getItem('userName');
    //获取用户名
    var _userRelName = sessionStorage.getItem('realUserName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //增加设备类别的vue对象
    var myApp33 = new Vue({
        el:'#myApp33',
        data:{
            'sblxbm':'',
            'sblxmc':'',
            'pyjm':'',
            'sbxt':''
        }
    })
    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });
    //存放设备类别的所有数据
    var _allDataLX = [];
    //存放车务段的所有数据
    var _allDataQY = [];
    //存放设备系统的所有数据
    var _allDataXT = [];
    //存放车站的所有数据
    var _allDataBM = [];
    //保存id的变量
    var _tableColumID = 0;
    //当前的表格
    var _$thisTable = '';
    //定义四个表格变量
    var _$tableLX = $('#asset-type-datatables');
    var _$tableQY = $('#area-datatables');
    var _$tableXT = $('#system-datatables');
    var _$tableBM = $('#department-datatables');
    //定义存放表格字符串的变量
    var _stringLX = 'asset-type-datatables';
    var _stringQY = 'area-datatables';
    var _stringXT = 'system-datatables';
    var _stringBM = 'department-datatables';
    //定义存放下拉框中字符串的变量
    var _selectXT = '';
    var _selectCWD = '';
    /*--------------------------------表格初始化--------------------------*/
    //设备类别
    var col = [
        {
            title:'编号',
            data:'id',
            visible: false
        },
        {
            title:'设备类别编码',
            data:'dcNum',
            className:'dcNum'
        },
        {
            title:'设备类别名称',
            data:'dcName'
        },
        {
            title:'设备系统名称',
            data:'dsName'
        },
        {
            title:'拼音简码',
            data:'dcPy'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

        }
    ]
    tableInit(_$tableLX,col,$('.excelButton').eq(0));


    //车务段
    var col1 = [
        {
            title:'编号',
            data:'id',
            visible: false
        },
        {
            title:'车务段编码',
            data:'daNum',
            className:'dcNum'

        },
        {
            title:'车务段名称',
            data:'daName'
        },
        {
            title:'拼音简码',
            data:'daPy'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"



        }
    ];
    tableInit(_$tableQY,col1,$('.excelButton').eq(1));
    //设备系统
    var col2 = [
        {
            title:'编号',
            data:'id',
            visible: false
        },
        {
            title:'系统编码',
            data:'dsNum',
            className:'dcNum'
        },
        {
            title:'系统名称',
            data:'dsName'
        },
        {
            title:'拼音简码',
            data:'dsPy'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

        }
    ];
    tableInit(_$tableXT,col2,$('.excelButton').eq(2));
    //车站
    var col3 = [
        {
            title:'编号',
            data:'id',
            visible: false
        },
        {
            title:'车站编码',
            data:'ddNum',
            className:'dcNum'
        },
        {
            title:'车站名称',
            data:'ddName'
        },
        {
            title:'车务段名称',
            data:'daName'
        },
        {
            title:'拼音简码',
            data:'ddPy'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

        }
    ];
    tableInit(_$tableBM,col3,$('.excelButton').eq(3));
    /*--------------------------------表格数据---------------------------*/
    //默认全部表格加载数据；
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,_$tableLX,'dcName');
    ajaxFun('YWDev/ywDMGetDAs',_allDataQY,_$tableQY,'daName');
    ajaxFun('YWDev/ywDMGetDSs',_allDataXT,_$tableXT,'dsName');
    ajaxFun('YWDev/ywDMGetDDs',_allDataBM,_$tableBM,'ddName');
    /*--------------------------------按钮事件--------------------------*/
    //tab切换
    $('.table-title').find('span').click(function(){
        $('.table-title').find('span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.table-block-list').hide();
        $('.table-block-list').eq($(this).index()).show();
    });
    //设备类别增加按钮
    $('.addFun').click(function(){
        $('#myModal').find('.modal-title').html('添加');
        //获取当前新增按钮时属于哪个表格的
        _$thisTable = $(this).parents('.table-block-list').find('table');
        //清空输入框
        myApp33.sblxbm = '';
        myApp33.sblxmc = '';
        myApp33.pyjm = '';
        var $myModal = $('#myModal');
        //添加登记类
        $myModal.find('.btn-primary').removeClass('xiugai').addClass('dengji');
        //不同的表格对象不同的标签名字
        var arr = [];
        var mingcheng = $('#myApp33').find('li').children('.labels');
        $('.equipment-system').hide();
        if( _$thisTable[0].id == _stringLX ){
            arr = ['设备类别编码 :','设备系统 *:','设备类别名称 *:','拼音简码 *:'];
            $('.equipment-system').show();

            $('#equipment-system').html(_selectXT);
        }else if( _$thisTable[0].id == _stringQY ){
            arr = ['车务段编码 :','','车务段名称 *:','拼音简码 *:']
        }else if( _$thisTable[0].id == _stringXT ){
            arr = ['设备系统编码 :','','设备系统名称 *:','拼音简码 *:']
        }else if( _$thisTable[0].id == _stringBM ){
            arr = ['车站编码 :','车务段 *:','车站名称 *:','拼音简码 *:']
            $('.equipment-system').show();

            $('#equipment-system').html(_selectCWD);
        }
        for(var i=0;i<mingcheng.length;i++){
            mingcheng.eq(i).html(arr[i]);
        }
        moTaiKuang($myModal);
    });
    //设备增加确定按钮
    $('#myModal .modal-dialog').find('.modal-footer').on('click','.dengji',function(){
        console.log(33);
        //判断必填项是不是填写了
        if( myApp33.sblxmc == '' || myApp33.pyjm == ''){
            moTaiKuang($('#myModal2'));

        }else if(_$thisTable[0].id == _stringLX || _$thisTable[0].id == _stringBM){
            if(myApp33.sbxt == ''){
                moTaiKuang($('#myModal2'));
            }else{
                $('#myModal').modal('hide');
                //获取填写的内容
                if( _$thisTable[0].id == _stringLX ){
                    xinzengFun('YWDev/ywDMAddDC','dcName','dcPy','fK_DSys_DClass');
                }else if( _$thisTable[0].id == _stringQY ){
                    xinzengFun('YWDev/ywDMAddDA','daName','daPy');
                }else if( _$thisTable[0].id == _stringXT ){
                    xinzengFun('YWDev/ywDMAddDS','dsName','dsPy');
                }else if( _$thisTable[0].id == _stringBM ){
                    xinzengFun('YWDev/ywDMAddDD','ddName','ddPy','fK_Area_DDep');
                }
            }


        }else{
            $('#myModal').modal('hide');
            //获取填写的内容
            if( _$thisTable[0].id == _stringLX ){
                xinzengFun('YWDev/ywDMAddDC','dcName','dcPy','fK_DSys_DClass');
            }else if( _$thisTable[0].id == _stringQY ){
                xinzengFun('YWDev/ywDMAddDA','daName','daPy');
            }else if( _$thisTable[0].id == _stringXT ){
                xinzengFun('YWDev/ywDMAddDS','dsName','dsPy');
            }else if( _$thisTable[0].id == _stringBM ){
                xinzengFun('YWDev/ywDMAddDD','ddName','ddPy','fK_Area_DDep');
            }
        }
    });
    $('.table tbody')
    //设备类别编辑按钮
        .on('click','.option-edit',function(){

            $('#myModal').find('.modal-title').html('编辑');
            //隐藏select框
            $('.equipment-system').hide();
            myApp33.sbxt = '';
            //样式
            //获取当前新增按钮时属于哪个表格的
            _$thisTable = $(this).parents('.table-block-list').find('table');
            var mingcheng = $('#myApp33').find('li').children('.labels');
            if( _$thisTable[0].id == _stringLX ){
                arr = ['设备类别编码 :','设备系统 *:','设备类别名称 *:','拼音简码 *:'];
                $('.equipment-system').show();

                $('#equipment-system').html(_selectXT);
            }else if( _$thisTable[0].id == _stringQY ){
                arr = ['车务段编码 :','车务段名称 *:','拼音简码 *:']
            }else if( _$thisTable[0].id == _stringXT ){
                arr = ['设备系统编码 :','设备系统名称 *:','拼音简码 *:']
            }else if( _$thisTable[0].id == _stringBM ){
                arr = ['车站编码 :','车务段 *:','车站名称 *:','拼音简码 *:']
                $('.equipment-system').show();

                $('#equipment-system').html(_selectCWD);
            }
            for(var i=0;i<mingcheng.length;i++){
                mingcheng.eq(i).html(arr[i]);
            }

            var $this = $(this).parents('tr');
            $(this).parents('.table').find('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
        //添加登记类
        $('#myModal').find('.btn-primary').removeClass('dengji').addClass('xiugai');
            var $thisBM = $(this).parents('tr').children('.dcNum').html();
            _$thisTable = $(this).parents('.table');
            if( _$thisTable[0].id == _stringLX ){
                editContent( _allDataLX,'dcNum','dcName','dcPy','id',$thisBM,'fK_DSys_DClass');
            }else if( _$thisTable[0].id == _stringQY ){
                editContent( _allDataQY,'daNum','daName','daPy','id',$thisBM);
            }else if( _$thisTable[0].id == _stringXT ){
                editContent( _allDataXT,'dsNum','dsName','dsPy','id',$thisBM);
            }else if( _$thisTable[0].id == _stringBM ){
                editContent( _allDataBM,'ddNum','ddName','ddPy','id',$thisBM,'fK_Area_DDep');
            }

        var $myModal = $('#myModal');

        moTaiKuang($myModal);

    })
    //设备类别删除按钮
        .on('click','.option-delete',function(){
            //样式
            var $this = $(this).parents('tr');
            $(this).parents('.table').find('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            //首先判断属于哪个表格
            _$thisTable = $(this).parents('.table');

            //获取id
            _tableColumID = $(this).parents('tr').children().eq(0).html();

            //弹出提示框
            moTaiKuang($(myModal1));
            //绑定信息
            var $thisBM = $(this).parents('tr').children('.dcNum').html();
            _$thisTable = $(this).parents('.table');
            var mingcheng = $('#myModal1').find('li').children('.labels');
            if( _$thisTable[0].id == _stringLX ){
                removeContent( _allDataLX,'dcNum','dcName','dcPy','dcNum',$thisBM);
                arr = ['设备类别编码 :','设备系统 *:','设备类别名称 *:','拼音简码 *:'];

            }else if( _$thisTable[0].id == _stringQY ){
                removeContent( _allDataQY,'daNum','daName','daPy','daNum',$thisBM);
                arr = ['车务段编码 :','车务段名称 *:','拼音简码 *:']
            }else if( _$thisTable[0].id == _stringXT ){
                removeContent( _allDataXT,'dsNum','dsName','dsPy','dsNum',$thisBM);
                arr = ['设备系统编码 :','设备系统名称 *:','拼音简码 *:']
            }else if( _$thisTable[0].id == _stringBM ){
                removeContent( _allDataBM,'ddNum','ddName','ddPy','ddNum',$thisBM);
                arr = ['车站编码 :','车务段 *:','车站名称 *:','拼音简码 *:']
            }
            for(var i=0;i<mingcheng.length;i++){
                mingcheng.eq(i).html(arr[i]);
            }
        })
    $('#myModal')
    //设备类别编辑确认按钮
        .on('click','.xiugai',function(){
            //判断必填项是不是填写了
            if( myApp33.sblxmc == '' || myApp33.pyjm == ''){
                moTaiKuang($('#myModal2'));

                $('#myModal2').find('.modal-body').html('请填写红色必填项');

            }else if(_$thisTable[0].id == _stringLX || _$thisTable[0].id == _stringBM){
                if(myApp33.sbxt == ''){
                    console.log(44);
                    moTaiKuang($('#myModal2'));
                    $('#myModal2').find('.modal-body').html('请填写红色必填项');
                }else{
                    $('#myModal').modal('hide');
                    if( _$thisTable[0].id == _stringLX ){
                        bianjiFun('YWDev/ywDMUptDC','dcNum','dcName','dcPy','fK_DSys_DClass');
                    }else if( _$thisTable[0].id == _stringQY ){
                        bianjiFun('YWDev/ywDMUptDA','daNum','daName','daPy');
                    }else if( _$thisTable[0].id == _stringXT ){
                        bianjiFun('YWDev/ywDMUptDS','dsNum','dsName','dsPy');
                    }else if( _$thisTable[0].id == _stringBM ){
                        bianjiFun('YWDev/ywDMUptDD','ddNum','ddName','ddPy','fK_Area_DDep');
                    }
                }
            }else{
                $('#myModal').modal('hide');
                if( _$thisTable[0].id == _stringLX ){
                    bianjiFun('YWDev/ywDMUptDC','dcNum','dcName','dcPy','fK_DSys_DClass');
                }else if( _$thisTable[0].id == _stringQY ){
                    bianjiFun('YWDev/ywDMUptDA','daNum','daName','daPy');
                }else if( _$thisTable[0].id == _stringXT ){
                    bianjiFun('YWDev/ywDMUptDS','dsNum','dsName','dsPy');
                }else if( _$thisTable[0].id == _stringBM ){
                    bianjiFun('YWDev/ywDMUptDD','ddNum','ddName','ddPy','fK_Area_DDep');
                }
            }

        })
    //设备类别删除确认按钮
    $('#myModal1').on('click','.shanchu',function(){
        if( _$thisTable[0].id == _stringLX ){
            shanchu('YWDev/ywDMDelDC','dcNum');
        }else if( _$thisTable[0].id == _stringQY ){
            shanchu('YWDev/ywDMDelDA','daNum');
        }else if( _$thisTable[0].id == _stringXT ){
            shanchu('YWDev/ywDMDelDS','dsNum');
        }else if( _$thisTable[0].id == _stringBM ){
            shanchu('YWDev/ywDMDelDD','ddNum');
        }
    })
    //确定关闭模态框按钮
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });
    /*--------------------------------其他方法---------------------------*/
    //获取列表的公共方法（地址，数组，表格）
    function shebeiHQ(url,allarr,tableId,flag){
        if(_$thisTable){
            var prm = {};
            prm.userID = _userIdName;
            $.ajax({
                type:'post',
                url:_urls + url,
                async:false,
                data:prm,
                success:function(result){
                    if(flag){
                        var dom = '#' + tableId[0].id + '_paginate';
                        var txt = $(dom).children('span').children('.current').html();
                    }
                    allarr = [];
                    for(var i=0; i<result.length; i++){
                        allarr.push(result[i])
                    }
                    datasTable(tableId,result);
                    if(dom){
                        var num = txt - 1;
                        var dom1 = $(dom).children('span').children().eq(num);
                        dom1.click();
                    }

                }
            })
        }
    }
    //ajaxFun
    function ajaxFun(url,allarr,tableId,text,flag){

            var prm = {
                'userID':_userIdName
            }
            prm[text] = ''
            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                success:function(result){
                    var selectHtml = '<option value="">请选择</option>';
                    if(url == 'YWDev/ywDMGetDSs'){
                        $(result).each(function(i,o){
                            selectHtml += '<option value="'+ o.dsNum+'" >'+ o.dsName+'</option>'
                        });
                        _selectXT = selectHtml;
                    }else if(url == 'YWDev/ywDMGetDAs'){
                        $(result).each(function(i,o){
                            selectHtml += '<option value="'+ o.daNum+'" >'+ o.daName+'</option>'
                        });
                        _selectCWD = selectHtml;
                    }
                    if(flag == false){
                        return false;
                    }
                    allarr.length = 0;

                    for(var i=0; i<result.length; i++){
                        allarr.push(result[i])
                    }
                    datasTable(tableId,result);
                }
            })
        }
    //新增公共方法(确定)
    function xinzengFun(url,text1,text2,text3){
            var prm = {};
            prm[text1] = myApp33.sblxmc;
            prm[text2] = myApp33.pyjm;
            prm.userID = _userIdName;
            prm.userName = _userRelName;
            if(text3){
                prm[text3] = myApp33.sbxt;

            }
            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                success:function(result){
                    if(result == 99){
                        if(_$thisTable[0].id == _stringLX){
                            shebeiHQ('YWDev/ywDMGetDCs',_allDataLX,_$thisTable);
                        }else if( _$thisTable[0].id == _stringQY ){
                            shebeiHQ('YWDev/ywDMGetDAs',_allDataQY,_$thisTable);
                        }else if( _$thisTable[0].id == _stringXT ){
                            shebeiHQ('YWDev/ywDMGetDSs',_allDataXT,_$thisTable);
                        }else if( _$thisTable[0].id == _stringBM ){
                            shebeiHQ('YWDev/ywDMGetDDs',_allDataBM,_$thisTable);
                        }
                        var $myModal = $('#myModal2');
                        $myModal.find('.modal-body').html('新增成功');
                        moTaiKuang($myModal);

                        ajaxFun('YWDev/ywDMGetDCs',_allDataLX,_$tableLX,'dcName');
                        ajaxFun('YWDev/ywDMGetDAs',_allDataQY,_$tableQY,'daName');
                        ajaxFun('YWDev/ywDMGetDSs',_allDataXT,_$tableXT,'dsName');
                        ajaxFun('YWDev/ywDMGetDDs',_allDataBM,_$tableBM,'ddName');

                    }
                }
            })
        }
    //编辑的公共方法(确定)
    function bianjiFun(url,text1,text2,text3,text4){

            var prm = {};
            prm[text1] = myApp33.sblxbm;
            prm[text2] = myApp33.sblxmc;
            prm[text3] = myApp33.pyjm;
            if(text4){
                prm[text4] = myApp33.sbxt;
                console.log(myApp33.sbxt);
            }
            prm.id = _tableColumID;
            prm.userID = _userIdName;
            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                success:function(result){
                    if(result == 99){
                        var $myModal = $('#myModal2');
                        $myModal.find('.modal-body').html('修改成功');
                        moTaiKuang($myModal);
                        $('#myModal').modal('hide');
                        if( _$thisTable[0].id == _stringLX ){
                            shebeiHQ('YWDev/ywDMGetDCs',_allDataLX,_$thisTable,true);
                        }else if( _$thisTable[0].id == _stringQY ){
                            shebeiHQ('YWDev/ywDMGetDAs',_allDataQY,_$thisTable,true);
                        }else if( _$thisTable[0].id == _stringXT ){
                            shebeiHQ('YWDev/ywDMGetDSs',_allDataXT,_$thisTable,true);
                        }else  if( _$thisTable[0].id == _stringBM ){
                            shebeiHQ('YWDev/ywDMGetDDs',_allDataBM,_$thisTable,true);
                        }
                        var $myModal = $('#myModal2');
                        $myModal.find('.modal-body').html('编辑成功');
                        moTaiKuang($myModal);
                        ajaxFun('YWDev/ywDMGetDCs',_allDataLX,_$tableLX,'dcName',false);
                        ajaxFun('YWDev/ywDMGetDAs',_allDataQY,_$tableQY,'daName',false);
                        ajaxFun('YWDev/ywDMGetDSs',_allDataXT,_$tableXT,'dsName',false);
                        ajaxFun('YWDev/ywDMGetDDs',_allDataBM,_$tableBM,'ddName',false);

                    }
                }
            })
        }
    //删除的公共方法
    function shanchu(url,text){
        var prm = {
            'userID':_userIdName
        };
        prm[text]= _tableColumID;

        console.log(_tableColumID);

        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            success:function(result){
                if(result == 99){
                    if( _$thisTable[0].id == _stringLX ){
                        shebeiHQ('YWDev/ywDMGetDCs',_allDataLX,_$thisTable,true);
                    }else if( _$thisTable[0].id == _stringQY ){
                        shebeiHQ('YWDev/ywDMGetDAs',_allDataQY,_$thisTable,true);
                    }else if( _$thisTable[0].id == _stringXT ){
                        shebeiHQ('YWDev/ywDMGetDSs',_allDataXT,_$thisTable,true);
                    }else if( _$thisTable[0].id == _stringBM ){
                        shebeiHQ('YWDev/ywDMGetDDs',_allDataBM,_$thisTable,true);
                    }
                    var $myModal = $('#myModal2');
                    $myModal.find('.modal-body').html('删除成功');
                    moTaiKuang($myModal);

                    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,_$tableLX,'dcName',false);
                    ajaxFun('YWDev/ywDMGetDAs',_allDataQY,_$tableQY,'daName',false);
                    ajaxFun('YWDev/ywDMGetDSs',_allDataXT,_$tableXT,'dsName',false);
                    ajaxFun('YWDev/ywDMGetDDs',_allDataBM,_$tableBM,'ddName',false);

                }
            }
        })

    }
    //模态框显示
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
                arr.reverse();
                var table = tableId.dataTable();
                table.fnClearTable();
                table.fnAddData(arr);
                table.fnDraw();
        }

    }
    //表格初始化方法
    function tableInit(tableID,col,button){
        var _tables = tableID.DataTable({
            'autoWidth': false,  //用来启用或禁用自动列的宽度计算
            'paging': true,   //是否分页
            'destroy': true,//还原初始化了的datatable
            'searching': true,
            'ordering': false,
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                'infoEmpty': '没有数据',
                'sSearch':'查询',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            //"dom":'B<"clear">lfrtip',
            "dom":'ft<"F"lip>',
            'buttons': [
                {
                    text:'新增',
                    className:'saveAs addFun btn btn-success'
                }
            ],
            'columns':col,
            'aoColumnDefs':[
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
            ]
        });
        _tables.buttons().container().appendTo(button,_tables.table().container());
    }
    //编辑内容赋值方法
    function editContent( arr,num,name,py,pid,bm,belong){

        for( var i=0;i<arr.length;i++ ){
            if( arr[i][num] == bm ){
                console.log(arr[i]);
                myApp33.sblxbm = arr[i][num];
                myApp33.sblxmc = arr[i][name];
                myApp33.pyjm = arr[i][py];
                if(belong){
                    myApp33.sbxt = arr[i][belong];
                    //$('#equipment-system').val(arr[i][belong]);
                    var k=i;
                    setTimeout(function(){
                      $('#equipment-system').val(arr[k][belong]);
                    },100)

                }
                _tableColumID = arr[i][pid];

            }
        }
    }
    //删除数据绑定
    function removeContent(arr,num,name,py,pid,bm){

        for( var i=0;i<arr.length;i++ ){
            if( arr[i][num] == bm ){
                $('#sbbm').val(arr[i][num])
                $('#sbmc').val(arr[i][name]);
                $('#pyjm').val(arr[i][py]);

                _tableColumID = arr[i][pid];
            }
        }

    }
});

//提交更改后跳转到当前页
function jumpNow(tableID){
    var dom = tableID + '_paginate';
    var txt = $(dom).children('span').children('.current').html();

    ajaxSuccess();
    var num = txt - 1;
    var dom = $(dom).children('span').children().eq(num);
    console.log(txt);
    console.log(dom);
    dom.click();
}