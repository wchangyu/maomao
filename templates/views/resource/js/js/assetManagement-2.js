$(function(){
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //页面插入station选择框
    addStationDom($('#bumen').parent());

    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
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
    //存放设备类型的所有数据
    var _allDataLX = [];
    //存放设备区域的所有数据
    var _allDataQY = [];
    //存放设备系统的所有数据
    var _allDataXT = [];
    //存放设备部门的所有数据
    var _allDataBM = [];
    //表格
    var _table = $('#scrap-datatables');
    /*-------------------------表格初始化------------------------------*/
    var _tables =  _table.DataTable({
        "autoWidth": true,  //用来启用或禁用自动列的宽度计算
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
                title:'设备名称',
                data:'dName',
                className:'dName'
            },
            {
                title:'设备编码',
                data:'dNum',
                className:'dNum hidden',
                render:function timeForma(data){
                    return '<span>'+data+'</span>'
                }
            },
            {
                title:'设备编码',
                data:'dNewNum'

            },
            {
                title:'规格型号',
                data:'spec'
            },
            {
                title:'所属车站',
                data:'ddName'
            },
            {
                title:'安装位置',
                data:'installAddress'
            },
            {
                title:'设备系统',
                data:'dsName'
            },
            {
                title:'设备类别',
                data:'dcName'
            },
            {
                title:'安装时间',
                data:'installDate',
                render:function timeForma(data){
                    return data.split(' ')[0].replace(/-/g,'/');
                }
            },
            {
                title:'保修年限',
                data:'maintain'
            }
        ]
    });
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    conditionSelect();
    //获取设备类型
    ajaxFun('YWDev/ywDMGetDCs',$('#leixing'),'dcName','dcNum',_allDataLX);
    //设备区域
    ajaxFun('YWDev/ywDMGetDAs',$('#quyu'),'daName','daNum',_allDataQY);
    //设备系统
    ajaxFun('YWDev/ywDMGetDSs',$('#xitong'),'dsName','dsNum',_allDataXT);
    //设备部门
    ajaxFun('YWDev/ywDMGetDDs',$('#bumen'),'ddName','ddNum',_allDataBM);
    /*-------------------------按钮功能------------------------------*/
    $('#selected').click(function(){
        conditionSelect();
    })
    $('#baofei').on('click',function(){
        if( $('.checked').length ==0 ){
            var $myModal2 = $('#myModal2');
            $myModal2.find('.modal-body').html('请选择要报废的数据！');
            moTaiKuang($myModal2);
            $myModal2.find('.btn-primary').removeClass('huifu').removeClass('baofei');
        }else{
            //出现提示框
            var $myModal2 = $('#myModal2');
            $myModal2.find('.modal-body').html('确定要置为报废状态吗？');
            moTaiKuang($myModal2);
            $myModal2.find('.btn-primary').removeClass('huifu').addClass('baofei');
        }
    });
    $('#huifu').on('click',function(){
        if( $('.checked').length ==0 ){
            var $myModal2 = $('#myModal2');
            $myModal2.find('.modal-body').html('请选择要恢复的数据！');
            moTaiKuang($myModal2);
            $myModal2.find('.btn-primary').removeClass('huifu').removeClass('baofei');
        }else{
            //添加确定按钮
            var myModal2 = $('#myModal2')
            myModal2.find('.btn-primary').removeClass('baofei').addClass('huifu');
            //出现提示框
            myModal2.find('.modal-body').html('确定要恢复为正常状态吗？');
            moTaiKuang(myModal2);
        }
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
    _table.find('tbody').on( 'click', 'input', function () {
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
    _table.find('thead').find('input').click(function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            _table.find('tbody').find('input').parents('.checker').children('span').addClass('checked');
            //所有行的背景颜色置为黄色
            _table.find('tbody').find('tr').css({'background':'#fbec88'})
        }else{
            _table.find('tbody').find('input').parents('.checker').children('span').removeClass('checked');
            _table.find('tbody').find('tr').css({'background':'#ffffff'})
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
    function ajaxFun(url,select,text,num,allArr){
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
                    str += '<option' + ' value="' + result[i][num] +'">' + result[i][text] + '</option>';
                    allArr.push(result[i]);
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

    //设置延迟时间
    var theTimes = 300000;
    //获取设备系统与设备类型对应的父子关系
    var _relativeArr1 = [];
    getSelectContent('YWDev/GetDevSysGroupClass', _relativeArr1);
    //获取车务段与车站对应的父子关系
    var _relativeArr2 = [];
    getSelectContent('YWDev/GetDevAreaGroupDep',_relativeArr2);
    function getSelectContent(url,arr){

        $.ajax({
            type: 'get',
            url: _urls + url,
            timeout: theTimes,
            success: function (data) {

                $(data).each(function(i,o){
                    arr.push(o);
                })
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                }else{

                }

            }
        });
    };

    $('#xitong').change(function(){

        var value = $('#xitong').val();
        if(value == ''){
            var str = '<option value="">全部</option>';
            $(_allDataLX).each(function(i,o){

                str += '<option value="'+ o.dcNum+'">'+ o.dcName+'</option>'
            });
            $('#leixing').html('');
            $('#leixing').html(str);
            return false;
        }

        $(_relativeArr1).each(function(i,o){

            if(value == o.dsNum){
                var pushArr = o.devClasss;
                var str = '<option value="">全部</option>';
                $(pushArr).each(function(i,o){

                    str += '<option value="'+ o.dcNum+'">'+ o.dcName+'</option>'
                });
                console.log(str);
                $('#leixing').html('');
                $('#leixing').html(str);
                return false;
            }
        });
    });

    $('#quyu').change(function(){

        var value = $('#quyu').val();
        $('#bumen').parent().next().find('.add-select-block').hide();
        $('#bumen').parent().next().find('.add-input-select').find('span').html('全部');
        $('#bumen').parent().next().find('.add-input-select').find('span').attr('values','');
        $('.AbcSearch li').removeClass('action');
        $('.AbcSearch li').eq(0).addClass('action');

        if(value == ''){
            var str = '<option value="">全部</option>';
            $(_allDataBM).each(function(i,o){

                str += '<option value="'+ o.ddNum+'">'+ o.ddName+'</option>'
            });
            $('#bumen').html('');
            $('#bumen').html(str);
            //显示根据拼音选择车站选框
            stationArr = _allDataBM;
            classifyArrByInitial(stationArr,0);
            return false;
        }


        $(_relativeArr2).each(function(i,o){

            if(value == o.daNum){
                var pushArr = o.devDeps;
                stationArr = pushArr;
                classifyArrByInitial(stationArr,0);
                var str = '<option value="">全部</option>';
                $(pushArr).each(function(i,o){

                    str += '<option value="'+ o.ddNum+'">'+ o.ddName+'</option>'
                });
                //console.log(str);
                $('#bumen').html('');
                $('#bumen').html(str);
                return false;
            }
        });
    });
})