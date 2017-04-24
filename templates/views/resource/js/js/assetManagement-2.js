$(function(){
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //设置初始时间
    var _initStart = moment().format('YYYY-MM-DD');
    var _initEnd = moment().format('YYYY-MM-DD');
    //显示时间
    $('.min').val('');
    $('.max').val('');
    var realityStart = '';
    var realityEnd = '';
    //存放所有列表中的数据
    var _allDateArr = [];
    //存放所有选中的数据
    var _selectedArr = [];
    /*-------------------------表格初始化------------------------------*/
    $('#scrap-datatables').DataTable({
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
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'saveAs'
            }
        ],
        "columns": [
            {
                title:'编号',
                data:'id',
                className:'ids',
                visible: false
            },
            {
                class:'checkeds',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'设备编号',
                data:'dNum',
                className:'dNum'
            },
            {
                title:'设备名称',
                data:'dName',
            },
            {
                title:'规格型号',
                data:'spec',
            },
            {
                title:'设备类型',
                data:'dcName',
            },
            {
                title:'购置日期',
                data:'purDate',
                render:function timeForma(data){
                    return data.split(' ')[0].replace(/-/g,'/');
                }
            },
            {
                title:'保修年限',
                data:'maintain',
            },
            {
                title:'安装时间',
                data:'installDate',
                render:function timeForma(data){
                    return data.split(' ')[0].replace(/-/g,'/');
                }
            },
            {
                title:'使用年限',
                data:'life',
            },
            {
                title:'状态',
                data:'status',
                render:function(data, type, full, meta){
                    if( data == 1){
                        return '正常'
                    }else if( data ==2 ){
                        return '维修'
                    }else if( data == 3 ){
                        return '报废'
                    }
                }
            },
            {
                title:'设备部门',
                data:'ddName',
            },
            {
                title:'设备系统',
                data:'dsName',
            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    conditionSelect();
    //获取设备类型
    var prm = {
        'dcName':'',
        'userID':_userIdName
    }
    ajaxFun(prm,'YWDev/ywDMGetDCs',$('#leixing'),'dcName','dcNum');
    //设备区域
    var prm1 = {
        'daName':'',
        'userID':_userIdName
    }
    ajaxFun(prm1,'YWDev/ywDMGetDAs',$('#quyu'),'daName','daNum');
    //设备系统
    var prm2 = {
        'dsName':'',
        'userID':_userIdName
    }
    ajaxFun(prm2,'YWDev/ywDMGetDSs',$('#xitong'),'dsName','dsNum');
    //设备部门
    var prm3 = {
        'ddName':'',
        'userID':_userIdName
    }
    ajaxFun(prm3,'YWDev/ywDMGetDDs',$('#bumen'),'ddName','ddNum');
    /*-------------------------按钮功能------------------------------*/
    $('#selected').click(function(){
        conditionSelect();
    })
    $('#baofei').on('click',function(){
        //添加确定按钮
        //出现提示框
        $('#myModal2').find('.modal-body').html('确定要置为报废状态吗？');
        moTaiKuang($('#myModal2'));
        $('#myModal2').find('.btn-primary').removeClass('huifu').addClass('baofei');
    });
    $('#huifu').on('click',function(){
        //添加确定按钮
        $('#myModal2').find('.btn-primary').removeClass('baofei').addClass('huifu');
        //出现提示框
        $('#myModal2').find('.modal-body').html('确定要恢复为正常状态吗？');
        moTaiKuang($('#myModal2'));
    });
    $('#myModal2')
        .on('click','.baofei',function(){
        _selectedArr = [];
        //首先判断选中的是哪个
        var selectRow = $('tbody').find('.checked').parents('tr');
        for( var i =0;i<_allDateArr.length;i++){
            for(var j=0;j<selectRow.length;j++){
                if(_allDateArr[i].dNum == selectRow.eq(j).children('.dNum').html()){
                    _selectedArr.push(_allDateArr[i]);
                }
            }
        }
        var ids = [];
        for( var i=0;i<_selectedArr.length;i++ ){
            ids.push(_selectedArr[i].dNum);
        }
        var prm = {
            'status':3,
            'devNums':ids,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDOptDev',
            data:prm,
            success:function( result ){
                if(result == 99){
                    moTaiKuang($('#myModal3'));
                    conditionSelect();
                    $('#myModal2').modal('hide');
                }
            }
        })
    })
        .on('click','.huifu',function(){
            _selectedArr = [];
            //首先判断选中的是哪个
            var selectRow = $('tbody').find('.checked').parents('tr');
            for( var i =0;i<_allDateArr.length;i++){
                for(var j=0;j<selectRow.length;j++){
                    if(_allDateArr[i].dNum == selectRow.eq(j).children('.dNum').html()){
                        _selectedArr.push(_allDateArr[i]);
                    }
                }
            }
            var ids = [];
            for( var i=0;i<_selectedArr.length;i++ ){
                ids.push(_selectedArr[i].dNum)
            }
            var prm = {
                'status':1,
                'devNums':ids,
                'userID':_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDev/ywDOptDev',
                data:prm,
                success:function( result ){
                    //参数错误
                    if(result == 99){
                        moTaiKuang($('#myModal3'));
                        conditionSelect();
                        $('#myModal2').modal('hide');
                    }
                }
            })
        })
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });
    //表格数据
    /*---------------------------表格中添加复选框----------------------*/
    var creatCheckBox = '<input type="checkbox">';
    $('thead').find('.checkeds').prepend(creatCheckBox);
    $('#scrap-datatables tbody').on( 'click', 'input', function () {
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
    $('#scrap-datatables thead').find('input').click(function(){
        //$('#information-datatables tbody').find('input')
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            $('#scrap-datatables tbody').find('input').parents('.checker').children('span').addClass('checked');
            //所有行的背景颜色置为黄色
            $('#scrap-datatables tbody').find('tr').css({'background':'#fbec88'})
        }else{
            $('#scrap-datatables tbody').find('input').parents('.checker').children('span').removeClass('checked');
            $('#scrap-datatables tbody').find('tr').css({'background':'#ffffff'})
        }
    });
    /*---------------------------其他方法----------------------------*/
    //查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        if( filterInput[2] == ''){
            realityStart = ''
        }else{
            realityStart = filterInput[2] + ' 00:00:00';
        }
        if( filterInput[2] == '' ){
            realityEnd = ''
        }else{
            realityEnd = moment(filterInput[3]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        }
        var prm =   {
            'st':realityStart,
            'et':realityEnd,
            'dName':filterInput[0],
            'spec':filterInput[1],
            'status':$('#zhuangtai').val(),
            'daNum':$('#quyu').val(),
            'ddNum':$('#bumen').val(),
            'dsNum':$('#xitong').val(),
            'dcNum':$('#leixing').val(),
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevs',
            data:prm,
            async:false,
            success:function(result){
                console.log(result);
                for(var i=0;i<result.length;i++){
                    _allDateArr.push(result[i]);
                }
                datasTable($('#scrap-datatables'),result);
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
    function ajaxFun(parameter,url,select,text,num){
        $.ajax({
            type:'post',
            url:_urls + url,
            async:false,
            data:parameter,
            success:function(result){
                //console.log(result);
                //给select赋值
                var str = '<option value="">全部</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option' + ' value="' + result[i][num] +'">' + result[i][text] + '</option>'
                }
                select.append(str);
            }
        })
    }
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
})