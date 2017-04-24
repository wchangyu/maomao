$(function(){
    /*-------------------------------全局变量-----------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //增加设备类型的vue对象
    var myApp33 = new Vue({
        el:'#myApp33',
        data:{
            'sblxbm':'',
            'sblxmc':'',
            'pyjm':''
        }
    })
    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });
    //存放设备类型的所有数据
    var _allDataLX = [];
    //存放设备区域的所有数据
    var _allDataQY = [];
    //存放设备系统的所有数据
    var _allDataXT = [];
    //存放设备部门的所有数据
    var _allDataBM = [];
    //保存id的变量
    var _tableColumID = 0;
    //当前的表格
    var _$thisTable;
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
    /*--------------------------------表格初始化--------------------------*/
    //设备类型
    _$tableLX.DataTable({
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
            'info': '第_PAGE_页/共_PAGES_页',
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
                text:'新增',
                className:'saveAs addFun'
            },
        ],
        "columns": [
            {
                title:'编号',
                data:'id',
                visible: false
            },
            {
                title:'资产类型编码',
                data:'dcNum',
                className:'dcNum'
            },
            {
                title:'资产类型名称',
                data:'dcName'
            },
            {
                title:'拼音简码',
                data:'dcPy'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-edit btn default btn-xs purple'><i class=''></i>编辑</span>" +
                                  "<span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>删除</span>"

            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ],
    });
    //设备区域
    _$tableQY.DataTable({
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
            'info': '第_PAGE_页/共_PAGES_页',
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
                text:'新增',
                className:'saveAs addFun'
            }
        ],
        "columns": [
            {
                title:'编号',
                data:'id',
                visible: false
            },
            {
                title:'区域编码',
                data:'daNum',
                className:'dcNum'

            },
            {
                title:'区域名称',
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
                "defaultContent": "<span class='data-option option-edit btn default btn-xs purple'><i class=''></i>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>删除</span>"

            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    //设备系统
    _$tableXT.DataTable({
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
            'info': '第_PAGE_页/共_PAGES_页',
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
                text:'新增',
                className:'saveAs addFun'
            }
        ],
        "columns": [
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
                "defaultContent": "<span class='data-option option-edit btn default btn-xs purple'><i class=''></i>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>删除</span>"

            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    _$tableBM.DataTable({
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
            'info': '第_PAGE_页/共_PAGES_页',
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
                text:'新增',
                className:'saveAs addFun'
            }
        ],
        "columns": [
            {
                title:'编号',
                data:'id',
                visible: false
            },
            {
                title:'部门编码',
                data:'ddNum',
                className:'dcNum'
            },
            {
                title:'部门名称',
                data:'ddName'
            },
            {
                title:'拼音简码',
                data:'ddPy'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-edit btn default btn-xs purple'><i class=''></i>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>删除</span>"

            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    /*--------------------------------表格数据---------------------------*/
    //默认全部表格加载数据；
    var prm = {
        'dcName':'',
        'userID':_userIdName
    }
    ajaxFun(prm,'YWDev/ywDMGetDCs',_allDataLX,_$tableLX);
    var prm1 = {
        'daName':'',
        'userID':_userIdName
    }
    ajaxFun(prm1,'YWDev/ywDMGetDAs',_allDataQY,_$tableQY);
    var prm2 = {
        'dsName':'',
        'userID':_userIdName
    }
    ajaxFun(prm2,'YWDev/ywDMGetDSs',_allDataXT,_$tableXT);
    var prm3 = {
        'ddName':'',
        'userID':_userIdName
    }
    ajaxFun(prm3,'YWDev/ywDMGetDDs',_allDataBM,_$tableBM);
    /*--------------------------------按钮事件--------------------------*/
    //tab切换
    $('.table-title').find('span').click(function(){
        $('.table-title').find('span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.table-block-list').hide();
        $('.table-block-list').eq($(this).index()).show();
    });
    //设备类型增加按钮
    $('.addFun').click(function(){
        //获取当前新增按钮时属于哪个表格的
        _$thisTable = $(this).parent().next().next().next();
        console.log( _$thisTable[0].id );
        //清空输入框
        myApp33.sblxbm = '';
        myApp33.sblxmc = '';
        myApp33.pyjm = '';
        var $myModal = $('#myModal');
        //添加登记类
        $myModal.find('.btn-primary').removeClass('xiugai').addClass('dengji');
        //高度改变
        $myModal.find('.modal-content').css({'height':'345px'});
        $myModal.find('.modal-dialog').css({'height':'345px'});
        //不同的表格对象不同的标签名字
        var arr = [];
        var mingcheng = $('#myApp33').find('li').children('.labels');
        if( _$thisTable[0].id == _stringLX ){
            arr = ['设备类型编码 :','设备类型名称 *:','拼音简码 :']
        }else if( _$thisTable[0].id == _stringQY ){
            arr = ['设备区域编码 :','设备区域名称 *:','拼音简码 :']
        }else if( _$thisTable[0].id == _stringXT ){
            arr = ['设备系统编码 :','设备系统名称 *:','拼音简码 :']
        }else if( _$thisTable[0].id == _stringBM ){
            arr = ['设备部门编码 :','设备部门名称 *:','拼音简码 :']
        }
        //console.log(arr);
        console.log(mingcheng);
        for(var i=0;i<mingcheng.length;i++){
            mingcheng.eq(i).html(arr[i]);
        }
        moTaiKuang($myModal);
    });
    //设备增加确定按钮
    $('#myModal .modal-dialog').find('.modal-footer').on('click','.dengji',function(){
        //判断必填项是不是填写了
        if( myApp33.sblxmc == '' || myApp33.pyjm == '' ){
            moTaiKuang($('#myModal2'));
        }else{
            $('#myModal').modal('hide');
            //获取填写的内容
            if( _$thisTable[0].id == _stringLX ){
                xinzengFun('YWDev/ywDMAddDC')
            }else if( _$thisTable[0].id == _stringQY ){
                xinzengFun('YWDev/ywDMAddDA')
            }else if( _$thisTable[0].id == _stringXT ){
                xinzengFun('YWDev/ywDMAddDS')
            }else if( _$thisTable[0].id == _stringBM ){
                xinzengFun('YWDev/ywDMAddDD')
            }
        }
    });
    $('.table tbody')
    //设备类型编辑按钮
        .on('click','.option-edit',function(){
        //添加登记类
        $('#myModal').find('.btn-primary').removeClass('dengji').addClass('xiugai');
            var $thisBM = $(this).parents('tr').children('.dcNum').html();
            _$thisTable = $(this).parents('.table');
            if( _$thisTable[0].id == _stringLX ){
                for(var i=0;i<_allDataLX.length;i++){
                    if(_allDataLX[i].dcNum == $thisBM){
                        myApp33.sblxbm = _allDataLX[i].dcNum;
                        myApp33.sblxmc = _allDataLX[i].dcName;
                        myApp33.pyjm = _allDataLX[i].dcPy;
                        _tableColumID = _allDataLX[i].id;
                    }
                }
            }else if( _$thisTable[0].id == _stringQY ){
                for(var i=0;i<_allDataQY.length;i++){
                    if(_allDataQY[i].daNum == $thisBM){
                        myApp33.sblxbm = _allDataQY[i].daNum;
                        myApp33.sblxmc = _allDataQY[i].daName;
                        myApp33.pyjm = _allDataQY[i].daPy;
                        _tableColumID = _allDataQY[i].id;
                    }
                }
            }else if( _$thisTable[0].id == _stringXT ){
                for(var i=0;i<_allDataXT.length;i++){
                    if(_allDataXT[i].daNum == $thisBM){
                        myApp33.sblxbm = _allDataXT[i].dsNum;
                        myApp33.sblxmc = _allDataXT[i].dsName;
                        myApp33.pyjm = _allDataXT[i].dsPy;
                        _tableColumID = _allDataXT[i].id;
                    }
                }
            }else if( _$thisTable[0].id == _stringBM ){
                for(var i=0;i<_allDataBM.length;i++){
                    if(_allDataBM[i].ddNum == $thisBM){
                        myApp33.sblxbm = _allDataBM[i].ddNum;
                        myApp33.sblxmc = _allDataBM[i].ddName;
                        myApp33.pyjm = _allDataBM[i].ddPy;
                        _tableColumID = _allDataBM[i].id;
                    }
                }
            }

        var $myModal = $('#myModal');
        //高度改变
        $myModal.find('.modal-content').css({'height':'345px'});
        $myModal.find('.modal-dialog').css({'height':'345px'});
        moTaiKuang($myModal);
    })
    //设备类型删除按钮
        .on('click','.option-delete',function(){
            //首先判断属于哪个表格
            _$thisTable = $(this).parents('.table');
            //获取id
            _tableColumID = $(this).parents('tr').children().eq(0).html();
            //弹出提示框
            moTaiKuang($(myModal1));
        })
    //设备类型编辑确认按钮
    $('#myModal').on('click','.xiugai',function(){
        if( _$thisTable[0].id == _stringLX ){
            bianjiFun('YWDev/ywDMUptDC');
        }else if( _$thisTable[0].id == _stringQY ){
            bianjiFun('YWDev/ywDMUptDA');
        }else if( _$thisTable[0].id == _stringXT ){
            bianjiFun('YWDev/ywDMUptDS');
        }else if( _$thisTable[0].id == _stringBM ){
            bianjiFun('YWDev/ywDMUptDD');
        }
    })
    //设备类型删除确认按钮
    $('#myModal1').on('click','.shanchu',function(){
        if( _$thisTable[0].id == _stringLX ){
            shanchu('YWDev/ywDMDelDC');
        }else if( _$thisTable[0].id == _stringQY ){
            shanchu('YWDev/ywDMDelDA');
        }else if( _$thisTable[0].id == _stringXT ){
            shanchu('YWDev/ywDMDelDS');
        }else if( _$thisTable[0].id == _stringBM ){
            shanchu('YWDev/ywDMDelDD');
        }
    })
    //确定关闭模态框按钮
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });
    /*--------------------------------其他方法---------------------------*/
    //获取列表的公共方法（地址，数组，表格）
    function shebeiHQ(url,allarr,tableId){
        if(_$thisTable){
            var prm = {};
            if( _$thisTable[0].id == _stringLX ){
                prm.dcName = ""
            }else if( _$thisTable[0].id == _stringQY ){
                prm.daName = ""
            }else if( _$thisTable[0].id == _stringXT ){
                prm.dsName = ""
            }else if( _$thisTable[0].id == _stringBM ){
                prm.ddName = ""
            }
            prm.userID = _userIdName;
            $.ajax({
                type:'post',
                url:_urls + url,
                async:false,
                data:prm,
                success:function(result){
                    for(var i=0; i<result.length; i++){
                        allarr.push(result[i])
                    }
                    datasTable(tableId,result);
                }
            })
        }
    }
        //ajaxFun
        function ajaxFun(parameter,url,allarr,tableId){
            $.ajax({
                type:'post',
                url:_urls + url,
                async:false,
                data:parameter,
                success:function(result){
                    for(var i=0; i<result.length; i++){
                        allarr.push(result[i])
                    }
                    datasTable(tableId,result);
                }
            })
        }
        //新增公共方法(确定)
        function xinzengFun(url){
            var prm = {};
            //第一个表格
            if( _$thisTable[0].id == _stringLX ){
                prm.dcName = myApp33.sblxmc;
                prm.dcPy = myApp33.pyjm;
            //第二个表格
            }else if( _$thisTable[0].id == _stringQY ){
                prm.daName = myApp33.sblxmc;
                prm.daPy = myApp33.pyjm;
            }else if( _$thisTable[0].id == _stringXT ){
                prm.dsName = myApp33.sblxmc;
                prm.dsPy = myApp33.pyjm;
            }else if( _$thisTable[0].id == _stringBM ){
                prm.ddName = myApp33.sblxmc;
                prm.ddPy = myApp33.pyjm;
            }
            prm.userID = _userIdName;
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
                    }
                }
            })
        }
        //编辑的公共方法(确定)
        function bianjiFun(url){
            var prm = {};
            if( _$thisTable[0].id == _stringLX ){
                prm.dcNum = myApp33.sblxbm;
                prm.dcName = myApp33.sblxmc;
                prm.dcPy = myApp33.pyjm;
            }else if( _$thisTable[0].id == _stringQY ){
                prm.daNum = myApp33.sblxbm;
                prm.daName = myApp33.sblxmc;
                prm.daPy = myApp33.pyjm;
            }else if( _$thisTable[0].id == _stringXT ){
                prm.dsNum = myApp33.sblxbm;
                prm.dsName = myApp33.sblxmc;
                prm.dsPy = myApp33.pyjm;
            }else if( _$thisTable[0].id == _stringBM ){
                prm.ddNum = myApp33.sblxbm;
                prm.ddName = myApp33.sblxmc;
                prm.ddPy = myApp33.pyjm;
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
                            shebeiHQ('YWDev/ywDMGetDCs',_allDataLX,_$thisTable);
                        }else if( _$thisTable[0].id == _stringQY ){
                            shebeiHQ('YWDev/ywDMGetDAs',_allDataQY,_$thisTable);
                        }else if( _$thisTable[0].id == _stringXT ){
                            shebeiHQ('YWDev/ywDMGetDSs',_allDataXT,_$thisTable);
                        }else  if( _$thisTable[0].id == _stringBM ){
                            shebeiHQ('YWDev/ywDMGetDDs',_allDataBM,_$thisTable);
                        }
                        var $myModal = $('#myModal2');
                        $myModal.find('.modal-body').html('编辑成功');
                        moTaiKuang($myModal);
                    }
                }
            })
        }
        //删除的公共方法
        function shanchu(url){
            var prm = {
                'id':_tableColumID,
                'userID':_userIdName
            };
            $.ajax({
                type:'post',
                url:_urls + url,
                data:prm,
                success:function(result){
                    if(result == 99){
                        if( _$thisTable[0].id == _stringLX ){
                            shebeiHQ('YWDev/ywDMGetDCs',_allDataLX,_$thisTable);
                        }else if( _$thisTable[0].id == _stringQY ){
                            shebeiHQ('YWDev/ywDMGetDAs',_allDataQY,_$thisTable);
                        }else if( _$thisTable[0].id == _stringXT ){
                            shebeiHQ('YWDev/ywDMGetDSs',_allDataXT,_$thisTable);
                        }else if( _$thisTable[0].id == _stringBM ){
                            shebeiHQ('YWDev/ywDMGetDDs',_allDataBM,_$thisTable);
                        }
                        var $myModal = $('#myModal2');
                        $myModal.find('.modal-body').html('删除成功');
                        moTaiKuang($myModal);
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
            //$('#myModal2').find('.modal-body').html('起止时间不能为空');
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

})