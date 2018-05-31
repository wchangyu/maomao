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
            'sbxt':'',
            'gzsj':'',
            'gzfy':''
        }
    })
    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });
    //存放设备类别的所有数据
    var _allDataLB = [];
    //存放车务段的所有数据
    var _allDataXM = [];

    //保存id的变量
    var _tableColumID = 0;
    //当前的表格
    var _$thisTable = '';
    //定义两个个表格变量
    var _$tableLB = $('#asset-type-datatables');
    var _$tableXM = $('#system-datatables');
    //定义存放表格字符串的变量
    var _stringLB = 'asset-type-datatables';
    var _stringXM = 'system-datatables';

    //定义存放下拉框中字符串的变量
    var _selectXT = '';
    /*--------------------------------表格初始化--------------------------*/
    //维修项目类别
    var col = [
        {
            title:'编号',
            data:'id',
            visible: false
        },
        {
            title:'项目类别编号',
            data:'wxclassnum',
            className:'dcNum'
        },
        {
            title:'项目类别名称',
            data:'wxclassname'
        },
        {
            title:'备注',
            data:'memo'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

        }
    ]
    tableInit(_$tableLB,col,$('.excelButton').eq(0));
    //维修项目
    var col1 = [
        {
            title:'编号',
            data:'id',
            visible: false
        },
        {
            title:'项目编码',
            data:'wxnum',
            className:'dcNum'

        },
        {
            title:'项目名称',
            data:'wxname'
        },
        {
            title:'项目类别名称',
            data:'wxclassname'
        },
        {
            title:'工作时间(h)',
            data:'workhour'
        },
        {
            title:'工作费用(元)',
            data:'workfee'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"



        }
    ];
    tableInit(_$tableXM,col1,$('.excelButton').eq(1));

    /*--------------------------------表格数据---------------------------*/
    //默认全部表格加载数据；
    ajaxFun('YWGD/ywGDwxxmClassGetAll',_allDataLB,_$tableLB,'wxclassname');
    ajaxFun('YWGD/ywGDWxxmcostGetAll',_allDataXM,_$tableXM,'wxname');
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
        myApp33.sbxt = '';
        myApp33.gzsj = '';
        myApp33.gzfy = '';
        var $myModal = $('#myModal');
        //添加登记类
        $myModal.find('.btn-primary').removeClass('xiugai').addClass('dengji');
        //不同的表格对象不同的标签名字
        var arr = [];
        var mingcheng = $('#myApp33').find('li').children('.labels');
        $('.equipment-system').hide();
        if( _$thisTable[0].id == _stringLB ){
            arr = ['项目类别编码 :','','项目类别名称 *:','备注 *:'];
        }else if( _$thisTable[0].id == _stringXM ){
            arr = ['项目编号 :','项目类别名称','项目名称 *:','备注 *:'];
            $('.equipment-system').show();

            $('#equipment-system').html(_selectXT);
        }
        for(var i=0;i<mingcheng.length;i++){
            mingcheng.eq(i).html(arr[i]);
        }
        moTaiKuang($myModal);
    });
    //设备增加确定按钮
    $('#myModal .modal-dialog').find('.modal-footer').on('click','.dengji',function(){
        //console.log(33);
        //判断必填项是不是填写了
        if( myApp33.sblxmc == '' || myApp33.pyjm == ''){
            moTaiKuang($('#myModal2'));

        }else if(_$thisTable[0].id == _stringXM){
            if(myApp33.sbxt == ''){
                moTaiKuang($('#myModal2'));
            }else{
                $('#myModal').modal('hide');
                //获取填写的内容
                    xinzengFun('YWGD/ywGDWxxmcostCreate','wxname','memo','wxclassnum','wxclassname','workhour','workfee');

            }
        }else{
            $('#myModal').modal('hide');
            //获取填写的内容

            xinzengFun('YWGD/ywGDwxxmClassCreate','wxclassname','memo');

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
            if( _$thisTable[0].id == _stringLB ){
                arr = ['项目类别编码 :','','项目类别名称 *:','备注 *:'];

            }else if( _$thisTable[0].id == _stringXM ){
                arr = ['项目编号 :','项目类别名称','项目名称 *:','备注 *:'];
                $('.equipment-system').show();

                $('#equipment-system').html(_selectXT);
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
            if( _$thisTable[0].id == _stringLB ){
                editContent( _allDataLB,'wxclassnum','wxclassname','memo','id',$thisBM);
            }else if( _$thisTable[0].id == _stringXM ){
                editContent( _allDataXM,'wxnum','wxname','memo','id',$thisBM,'wxclassnum','workhour','workfee');
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
            if( _$thisTable[0].id == _stringLB ){
                removeContent( _allDataLB,'wxclassnum','wxclassname','memo','id',$thisBM);
                arr = ['项目类别编码 :','项目类别名称 *:','备注 *:'];

            }else if( _$thisTable[0].id == _stringXM ){
                removeContent( _allDataXM,'wxnum','wxname','wxclassname','id',$thisBM);
                arr = ['项目编号 :','项目名称','项目类别名称 *:'];
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

            }else if( _$thisTable[0].id == _stringXM){
                if(myApp33.sbxt == ''){

                    moTaiKuang($('#myModal2'));
                    $('#myModal2').find('.modal-body').html('请填写红色必填项');
                }else{
                    $('#myModal').modal('hide');

                    bianjiFun('YWGD/ywGDWxxmcostUpdate','wxnum','wxname','memo','wxclassnum','wxclassname',"workhour","workfee");

                }
            }else{
                $('#myModal').modal('hide');
                bianjiFun('YWGD/ywGDwxxmClassUpdate','wxclassnum','wxclassname','memo');
            }

        })
    //设备类别删除确认按钮
    $('#myModal1').on('click','.shanchu',function(){
        if( _$thisTable[0].id == _stringLB ){
            shanchu('YWGD/ywGDWxxmClassDelete','id');
        }else if( _$thisTable[0].id == _stringXM ){
            shanchu('YWGD/ywGDWxxmcostDelete','id');
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
        prm[text] = '';

        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            success:function(result){

                var selectHtml = '<option value="">请选择</option>';
                if(url == 'YWGD/ywGDwxxmClassGetAll'){
                    $(result).each(function(i,o){
                        selectHtml += '<option value="'+ o.wxclassnum+'" >'+ o.wxclassname+'</option>'
                    });
                    _selectXT = selectHtml;
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
    function xinzengFun(url,text1,text2,text3,text4,text5,text6){
        var prm = {};
        prm[text1] = myApp33.sblxmc;
        prm[text2] = myApp33.pyjm;
        //prm.userID = _userIdName;
        //prm.userName = _userRelName;
        if(text3){
            prm[text3] = myApp33.sbxt;
            prm[text4] = $('#equipment-system').find("option:selected").text();;
            prm[text5] = myApp33.gzsj;
            prm[text6] = myApp33.gzfy;
        }


        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            success:function(result){
                if(result == 99){
                    if(_$thisTable[0].id == _stringLB){
                        shebeiHQ('YWGD/ywGDwxxmClassGetAll',_allDataLB,_$thisTable);
                    }else if( _$thisTable[0].id == _stringXM ){
                        shebeiHQ('YWGD/ywGDWxxmcostGetAll',_allDataXM,_$thisTable);
                    }
                    var $myModal = $('#myModal2');
                    $myModal.find('.modal-body').html('新增成功');
                    moTaiKuang($myModal);

                    ajaxFun('YWGD/ywGDwxxmClassGetAll',_allDataLB,_$tableLB,'wxclassname');
                    ajaxFun('YWGD/ywGDWxxmcostGetAll',_allDataXM,_$tableXM,'wxname');

                }
            }
        })
    }
    //编辑的公共方法(确定)
    function bianjiFun(url,text1,text2,text3,text4,text5,text6,text7){

        var prm = {};
        prm[text1] = myApp33.sblxbm;
        prm[text2] = myApp33.sblxmc;
        prm[text3] = myApp33.pyjm;
        if(text4){
            prm[text4] = myApp33.sbxt;
            prm[text5] = $('#equipment-system').find("option:selected").text();
            prm[text6] = myApp33.gzsj;
            prm[text7] = myApp33.gzfy;
        }
        prm.id = _tableColumID;
        //prm.userID = _userIdName;


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
                    if( _$thisTable[0].id == _stringLB ){
                        shebeiHQ('YWGD/ywGDwxxmClassGetAll',_allDataLB,_$thisTable,true);
                    }else if( _$thisTable[0].id == _stringXM ){
                        shebeiHQ('YWGD/ywGDWxxmcostGetAll',_allDataXM,_$thisTable,true);
                    }
                    var $myModal = $('#myModal2');
                    $myModal.find('.modal-body').html('编辑成功');
                    moTaiKuang($myModal);
                    ajaxFun('YWGD/ywGDwxxmClassGetAll',_allDataLB,_$tableLB,'wxclassname');
                    ajaxFun('YWGD/ywGDWxxmcostGetAll',_allDataXM,_$tableXM,'wxname');

                }
            }
        })
    }
    //删除的公共方法
    function shanchu(url,text){
        var prm = {
            //'userID':_userIdName
        };
        prm[text]= parseInt(_tableColumID);



        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            success:function(result){
                if(result == 99){
                    if(_$thisTable[0].id == _stringLB){
                        shebeiHQ('YWGD/ywGDwxxmClassGetAll',_allDataLB,_$thisTable);
                    }else if( _$thisTable[0].id == _stringXM ){
                        shebeiHQ('YWGD/ywGDWxxmcostGetAll',_allDataXM,_$thisTable);
                    }
                    var $myModal = $('#myModal2');
                    $myModal.find('.modal-body').html('删除成功');
                    moTaiKuang($myModal);

                    ajaxFun('YWGD/ywGDwxxmClassGetAll',_allDataLB,_$tableLB,'wxclassname');
                    ajaxFun('YWGD/ywGDWxxmcostGetAll',_allDataXM,_$tableXM,'wxname');

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
            'ordering': true,
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
            ],
        });
        _tables.buttons().container().appendTo(button,_tables.table().container());
    }
    //编辑内容赋值方法
    function editContent( arr,num,name,py,pid,bm,belong,text1,text2){

        for( var i=0;i<arr.length;i++ ){
            if( arr[i][num] == bm ){

                myApp33.sblxbm = arr[i][num];
                myApp33.sblxmc = arr[i][name];
                myApp33.pyjm = arr[i][py];
                if(belong){

                    myApp33.sbxt = arr[i][belong];
                    myApp33.gzsj = arr[i][text1];
                    myApp33.gzfy = arr[i][text2];
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

    dom.click();
}