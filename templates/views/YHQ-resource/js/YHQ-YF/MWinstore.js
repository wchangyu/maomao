$(function(){

    /*------------------------------变量------------------------------*/
    //当前被选中的医废单号
    var inStroageNum = '';

    //电子称
    var _weighArr = [];

    MWWeighFun();

    //标识当前选择的桶
    var _currentBucket = '';

    /*-------------------------------时间插件------------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    /*-----------------------------表格------------------------------*/

    //电子称
    var weighCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'名称',
            data:'scalename'
        },
        {
            title:'所属部门',
            data:'keshiname'
        },
        {
            title:'地点',
            data:'scaleloc'
        }

    ]

    _tableInit($('#weigh-table'),weighCol,'2','','','','','',10);

    //主表格（运送中）
    var mainTable = [

        {
            title:'编号',
            data:'mwcode',
            render:function(data, type, full, meta){

                return '<a href="MWdetails.html?a=' + data + '" target="_blank">' + data + '</a>';

            }


        },
        {
            title:'类型',
            data:'wtname'
        },
        {
            title:'来源',
            data:'wsname'
        },
        {
            title:'重量(kg)',
            data:'weight'
        },
        {
            title:'科室',
            data:'keshiname'
        },
        {
            title:'称重时间',
            data:'sendtime'
        },
        {
            title:'是否超时',
            data:''
        },
        {
            title:'操作',
            data:null,
            render:function(data, type, full, meta){

                return '<span class="option-button option-edit option-in" data-attr="' + full.mwcode + '">' + '入库</span>'
            }

        }

    ]

    _tableInit($('#table'),mainTable,'2','','','','','');

    //库存中
    var mainTable1 = [

        {
            title:'编号',
            data:'mwcode',
            render:function(data, type, full, meta){

                return '<a href="MWdetails.html?a=' + data + '" target="_blank">' + data + '</a>';

            }


        },
        {
            title:'类型',
            data:'wtname'
        },
        {
            title:'来源',
            data:'wsname'
        },
        {
            title:'科室',
            data:'keshiname'
        },
        {
            title:'打包重量(kg)',
            data:'weight'
        },
        {
            title:'运送人',
            data:'transusername'
        },
        {
            title:'入库重量(kg)',
            data:'inweight'
        },
        {
            title:'称重时间',
            data:'insttime'
        },
        {
            title:'入库人',
            data:'inusername'
        },
        {
            title:'垃圾桶编号',
            data:'batchnum'
        },
        {
            title:'操作',
            data:null,
            render:function(data, type, full, meta){

                return '<span class="option-button option-edit option-out" data-attr="' + full.mwcode + '">' + '出库</span>' +

                    '<span class="option-button option-huhao option-back" data-attr="' + full.mwcode + '">' + '回退</span>'

            }

        }

    ]

    _tableInit($('#table1'),mainTable1,'2','','','','','');

    conditionSelect();

    //桶
    var oldCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.batchnum + '"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'类型',
            data:'wtname'
        },
        {
            title:'桶',
            data:'batchnum',
            className:'batchnum'
        }

    ]

    _tableInit($('#bucket-old-table'),oldCol,'2','','','','','','',true);

    //新桶
    var newCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.batchnum + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'桶',
            data:'batchnum',
            className:'batchnum'
        }

    ]

    $('#bucket-new-table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        "bProcessing":true,
        "iDisplayLength":10,//默认每页显示的条数
        'language': {
            'emptyTable': '暂无新桶数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '暂无新桶数据',
            'info': '',
            'infoEmpty': '',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'t',
        'buttons':[
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs hiddenButton'
            }
        ],
        "columns": newCol,
    });

    //批量出库
    var batchCol = [

        {
            title:'桶编号',
            data:'batchnum',
            name:'batchnum',
            render:function(data, type, full, meta){

                return   '<span>'+ data +'</span>' + '<br>' + '<span style="margin-top: 10px;" class="option-button option-edit option-out" data-attr="' + full.batchnum + '">' + '出库</span>';


            }
        },
        {
            title:'编号',
            data:'mwcode',
            render:function(data, type, full, meta){

                return '<a href="MWdetails.html?a=' + data + '" target="_blank">' + data + '</a>';

            }


        },
        {
            title:'类型',
            data:'wtname'
        },
        {
            title:'来源',
            data:'wsname'
        },
        {
            title:'科室',
            data:'keshiname'
        },
        {
            title:'打包重量(kg)',
            data:'weight'
        },
        {
            title:'运送人',
            data:'transusername'
        },
        {
            title:'入库重量(kg)',
            data:'inweight'
        },
        {
            title:'称重时间',
            data:'insttime'
        }

    ]

    //_tableInit($('#table-batch'),batchCol,'2','','','','','','',true);

    $('#table-batch').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": true,
        "bProcessing":true,
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'search':'搜索',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'ft<"F"lip>',
        'buttons':{
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs hiddenButton'
        },
        "columns": batchCol,

        "rowsGroup": [
            'batchnum:name',
            0,
            1
        ],
        "aoColumnDefs": [ { "orderable": false, "targets": [ 2,3,4,5,6,7] }]
    });

    //桶合计
    var bucketCol = [

        {
            title:'桶编号',
            data:'batchnum'
        },
        {
            title:'重量(kg)',
            data:'inweight'
        }
    ]

    _tableInit($('#table-bucket'),bucketCol,'2','','',drawFn,'','','','','','','');

    //重绘合计数据
    function drawFn(){

        var table = $('#table-bucket').DataTable();

        //表格中的每一个tr
        var tr = $('#table-bucket tbody').children('tr');

        //表格中的每一个td（重量）
        var weight = 0;

        //桶小计
        var bucketNum = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //遍历列
                var num = Number(tr.eq(i).children().eq(1).html());

                weight = (Number(weight) + num)=='NaN'?'-':Number(weight) + num;

                bucketNum ++;

            }

        }
        //重量小计
        $('#pageTotalWeight').html('重量小计：' + weight + '(kg)');

        //桶小计
        $('#pageTotalBucket').html('桶小计：' + bucketNum + '(个)');

    };


    /*---------------------------------表格验证----------------------------------*/

    $('#commentForm').validate({

        rules:{
            //重量
            'MW-in-weigh':{

                required: true,

                number:true

            }

        },
        messages:{

            //重量
            'MW-in-weigh':{

                required: '请输入重量',

                number:'重量需是数字'

            }

        }

    });

    /*-----------------------------按钮------------------------------*/

    //表格【入库】
    $('#table tbody').on('click','.option-in',function(){

        inStroageNum = $(this).attr('data-attr');

        //初始化
        inStroageInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'入库','','','','确定');

        //绑定数据
        bindData($(this));

        //入库人默认登录者
        $('#MW-in-person').val(_userIdName);

    })

    //选择称
    $('.modal-select-weigh').click(function(){

        //初始化
        _datasTable($('#weigh-table'),[]);

        //数据
        _datasTable($('#weigh-table'),_weighArr);

        //模态框
        _moTaiKuang($('#weigh-Modal'),'电子秤列表','','','','选择');

    })

    //确定电子称
    $('#weigh-Modal').on('click','.btn-primary',function(){

        var currentTr = $('#weigh-table tbody').find('.tables-hover');

        if(currentTr.length >0){

            var num = currentTr.find('.checker').attr('data-id');

            var name = currentTr.children('td').eq(1).html();

            $('#MW-weigh').attr('data-id',num);

            $('#MW-weigh').val(name);

            $('#weigh-Modal').modal('hide');

        }else{

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择科室','');

        }

    })

    //旧桶点击事件
    $('#bucket-old-table tbody').on('click','tr',function(){

        var classN = $(this).children().attr('class')

        if(classN == 'dataTables_empty'){

            return false;

        }

        $('#bucket-new-table tbody').find('tr').removeClass('tables-hover');

        $('#bucket-new-table tbody').find('input').parent('span').removeClass('checked');

        if($(this).hasClass('tables-hover')){

            $(this).parents('.table').find('tr').removeClass('tables-hover');

            $(this).parents('.table').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

            _currentBucket = '';

            $('#selectedBucket').html('');

        }else{

            $(this).parents('.table').find('tr').removeClass('tables-hover');

            $(this).parents('.table').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

            sureBucket($(this));

        }

    })

    //新桶点击事件
    $('#bucket-new-table tbody').on('click','tr',function(){

        var classN = $(this).children().attr('class')

        if(classN == 'dataTables_empty'){

            return false;

        }

        $('#bucket-old-table tbody').find('tr').removeClass('tables-hover');

        $('#bucket-old-table tbody').find('input').parent('span').removeClass('checked');

        if($(this).hasClass('tables-hover')){

            $(this).parents('.table').find('tr').removeClass('tables-hover');

            $(this).parents('.table').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

            _currentBucket = '';

            $('#selectedBucket').html('');

        }else{

            $(this).parents('.table').find('tr').removeClass('tables-hover');

            $(this).parents('.table').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

            sureBucket($(this));

        }

    })

    //选择桶编号
    $('.modal-select-bucket').click(function(){

        //模态框初始化
        bucketInit();

        //模态框
        _moTaiKuang($('#bucket-Modal'),'桶列表','','','','确定');

        //数据
        oldBucket();

    })

    //点击新增桶，增加一个新桶
    $('#newBucket').on('click',function(){

        $(this).attr('disabled',true);

        newBucket();

    })

    //确定桶
    $('#bucket-Modal').on('click','.btn-primary',function(){

        var num = _currentBucket;

        if(num == ''){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择桶','');

            return false;

        }

        $('#MW-bucket').val(num);

        $('#bucket-Modal').modal('hide');

    })

    //确定入库
    $('#create-Modal').on('click','.btn-primary',function(){

        formatValidateUser(function(){

            inStroage()

        })

    })

    //表格出库
    $('#table1 tbody').on('click','.option-out',function(){

        inStroageNum = $(this).attr('data-attr');

        //初始化
        outStroageInit();

        //模态框
        _moTaiKuang($('#out-Modal'),'出库','','','','确定');

        //绑定数据
        bindDataOUT($(this));

    })

    //确定出库
    $('#out-Modal').on('click','.btn-primary',function(){

        outStroage();

    })

    //tab选项卡
    $('.tab-label').on('click','.tab-cell',function(){

        var nextBlock = $(this).parent().next();

        nextBlock.children().hide();

        $('.tab-cell').children().removeClass('tab-active');

        nextBlock.children().eq($(this).index()).show();

        $('.tab-cell').children().eq($(this).index()).addClass('tab-active');


    })

    //称
    $('#weigh-table tbody').on('click','tr',function(){

        var classN = $(this).children().attr('class')

        if(classN == 'dataTables_empty'){

            return false;

        }

        if($(this).hasClass('tables-hover')){

            $(this).parents('.table').find('tr').removeClass('tables-hover');

            $(this).parents('.table').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $(this).parents('.table').find('tr').removeClass('tables-hover');

            $(this).parents('.table').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //批量出库模态框
    $('#table-batch tbody').on('click','.option-out',function(){

        var bucketNum = $(this).attr('data-attr');

        //初始化
        batchOutStroageInit();

        //桶编号
        $('#MW-bucket-out-batch').val(bucketNum);

        //模态框
        _moTaiKuang($('#bucket-out-Modal'),'批量出库','','','','确定');


    })

    //批量出库确定
    $('#bucket-out-Modal').on('click','.btn-primary',function(){

        var prm = {

            //桶
            batchnum:$('#MW-bucket-out-batch').val(),
            //出库人
            outuserid:_userIdNum,
            //出库人姓名
            outusername:_userIdName,
            //处理公司
            compname:$('#MW-company-out-batch').val(),
            //车牌
            carid:$('#MW-car-out-batch').val(),
            //登录id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM,

        }

        _mainAjaxFunCompleteNew('post','MW/mwBinOutStorage',prm,$('#bucket-out-Modal').find('.modal-dialog'),function(result){

            if(result.code == 99){

                $('#bucket-out-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');
        })

    })

    //重置
    $('#resetBtn').click(function(){

        $('#MWNum').val('');

        $('#MWDep').val('');

        $('#MWDep').removeAttr('data-id');

        $('#spDT').val(st);

        $('#epDT').val(nowTime);

    })

    //桶显示bucket-Modal
    $('#bucket-Modal').on('show.bs.modal',function(){

        _isClick = false;

    })

    //桶消失
    $('#bucket-Modal').on('hide.bs.modal',function(){

        _isClick = true;

    })

    //秤显示
    $('#weigh-Modal').on('show.bs.modal',function(){

        _isClick = false;

    })

    //秤消失
    $('#weigh-Modal').on('hide.bs.modal',function(){

        _isClick = true;

    })

    //回退
    $('#table1 tbody').on('click','.option-back',function(){

        inStroageNum = $(this).attr('data-attr');

        //初始化
        backStroageInit();

        //模态框
        _moTaiKuang($('#back-Modal'),'回退','','','','确定');

        //绑定数据
        bindDataBack($(this));

    })

    $('#back-Modal').on('click','.btn-primary',function(){

        backStroage();

    })

    //桶合计获取数据
    $("#bucketNum").on('click',function(){

        bucketNumFun();

    })

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    /*----------------------------其他方法-----------------------------*/

    //条件选择（运送中10，库存中20）
    function conditionSelect(){

        var prm = {

            //医废编号
            mwcode:$('#MWNum').val(),
            //开始时间
            sendtimest:$('#spDT').val(),
            //结束时间
            sendtimeet:moment($('#epDT').val()).add(1,'days').format('YYYY-MM-DD'),
            //科室
            keshinum:$('#MWDep').val() == ''?'':$('#MWDep').attr('data-id'),
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM,
            //查询条件
            //mwstatus:10

        }

        _mainAjaxFunCompleteNew('post','MW/mwGetInfos',prm,$('.content-top'),function(result){

            var arr = [];

            var arr1 = [];

            if(result.code == 99){

                //arr = result.data;

                for(var i=0;i<result.data.length;i++){

                    data = result.data[i];

                    if(data.mwstatus == 10){

                        arr.push(data);

                    }else if(data.mwstatus == 20){

                        arr1.push(data);

                    }

                }

            }

            _datasTable($('#table'),arr);

            _datasTable($('#table1'),arr1);

            _datasTable($('#table-batch'),arr1);

        })


    }

    //绑定数据(入库)
    function bindData(el){

        var num = el.attr('data-attr');

        var prm = {

            //编号
            mwcode:num,
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','MW/mwGetDetail',prm,$('.content-top'),function(result){

            //赋值
            if(result.code == 99){

                var current = result.data;
                //医废分类
                $('#MW-classify').val(current.wtname);
                //医废来源
                $('#MW-source').val(current.wsname);
                //科室
                $('#MW-dep').val(current.keshiname);
                //医废处理人
                $('#MW-person').val(current.sendusername);
                //运送人
                $('#MW-carrier').val(current.transusername);
                //重量
                $('#MW-weighNum').val(current.weight);
                //打包时间
                $('#MW-pack').val(current.sendtime);


            }

        })

    }

    //绑定数据（出库）
    function bindDataOUT(el){

        var num = el.attr('data-attr');

        var prm = {

            //编号
            mwcode:num,
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','MW/mwGetDetail',prm,$('.content-top'),function(result){

            //赋值
            if(result.code == 99){

                var current = result.data;
                //医废分类
                $('#MW-classify-out').val(current.wtname);
                //医废来源
                $('#MW-source-out').val(current.wsname);
                //科室
                $('#MW-dep-out').val(current.keshiname);
                //医废处理人
                $('#MW-person-out').val(current.sendusername);
                //运送人
                $('#MW-carrier-out').val(current.transusername);
                //重量
                $('#MW-weighNum-out').val(current.weight);
                //打包时间
                $('#MW-pack-out').val(current.sendtime);
                //入库人
                $('#MW-in-person-out').val(current.inusername);
                //入库时间
                $('#MW-in-stroage-out').val(current.insttime);
                //桶编号
                $('#MW-bucket-out').val(current.batchnum);

            }

        })

    }

    //数据绑定(回退)
    function bindDataBack(el){

        var num = el.attr('data-attr');

        var prm = {

            //编号
            mwcode:num,
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','MW/mwGetDetail',prm,$('.content-top'),function(result){

            //赋值
            if(result.code == 99){

                var current = result.data;
                //医废分类
                $('#MW-classify-back').val(current.wtname);
                //医废来源
                $('#MW-source-back').val(current.wsname);
                //科室
                $('#MW-dep-back').val(current.keshiname);
                //医废处理人
                $('#MW-person-back').val(current.sendusername);
                //运送人
                $('#MW-carrier-back').val(current.transusername);
                //重量
                $('#MW-weighNum-back').val(current.weight);
                //打包时间
                $('#MW-pack-back').val(current.sendtime);
                //入库人
                $('#MW-in-person-back').val(current.inusername);
                //入库时间
                $('#MW-in-stroage-back').val(current.insttime);
                //桶编号
                $('#MW-bucket-back').val(current.batchnum);

            }

        })

    }

    //入库模态框初始化
    function inStroageInit(){

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val('');

        //称初始化
        $('#MW-weigh').removeAttr('data-id');

        //同编号
        $('#MW-bucket').val('');
    }

    //出库模态框初始化
    function outStroageInit(){

        $('#out-Modal').find('input').val('');

        $('#out-Modal').find('select').val('');

        //出库人默认
        $('#MW-person1-out').val(_userIdName)
    }

    //回退模态框初始化
    function backStroageInit(){

        $('#back-Modal').find('input').val('');

        $('#back-Modal').find('select').val('');

    }

    //批量出库初始化
    function batchOutStroageInit(){

        $('#bucket-out-Modal').find('input').val('');

        $('#bucket-out-Modal').find('select').val('');

        //出库人默认
        $('#MW-person1-out-batch').val(_userIdName)

    }

    //称
    function MWWeighFun(){

        var prm = {


        }

        _mainAjaxFunCompleteNew('post','MW/GetmwScaleList',prm,false,function(result){

            _weighArr.length = 0;

            if(result){

                for(var i=0;i<result.data.length;i++){

                    _weighArr.push(result.data[i]);

                }

            }


        })

    }

    //获取旧桶
    function oldBucket(){

        var prm = {}

        _mainAjaxFunCompleteNew('post','MW/mwGetExistBins',prm,$('#bucket-Modal').find('.modal-dialog'),function(result){

            if(result.code == 99){

                _datasTable($('#bucket-old-table'),result.data);

            }

        })


    }

    //获取新桶
    function newBucket(){

        $.ajax({

            type:'post',

            url:_urls + 'MW/mwGetNewBinNum',

            timeout:_theTimes,

            success:function(result){

                if(result.code == 99){

                    $('#bucket-new').val(result.data);

                    var arr = [];

                    var obj = {};

                    obj.batchnum = result.data;

                    arr.push(obj);

                    _datasTable($('#bucket-new-table'),arr);

                    //当前选中的是新桶
                    //$('#selectedBucket').html(result.data + '(新桶)');

                }

            },

            error:_errorFunNew

        })

    }

    //桶模态框
    function bucketInit(){

        //新增按钮初始化
        $('#newBucket').attr('disabled',false);

        $('#bucket-new').val('');

        _datasTable($('#bucket-old-table'),[]);

        _datasTable($('#bucket-new-table'),[]);

    }

    //入库操作
    function inStroage(){

        var prm = {

            //入库id
            mwcode:inStroageNum,
            //入库人员ID
            inuserid:_userIdNum,
            //入库人员 ,
            inusername:_userIdName,
            //入库称重秤id
            inscaleid:$('#MW-weigh').attr('data-id'),
            // 入库称重秤
            inscalename:$('#MW-weigh').val(),
            //入库重量
            inweight:$('#MW-in-weigh').val(),
            //桶编号
            batchnum:$('#MW-bucket').val(),
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM,
            //查询条件
            //mwstatus:30
        }

        _mainAjaxFunCompleteNew('post','MW/mwInStorage',prm,$('#create-Modal').find('.modal-dialog'),function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                //提示入库成功
                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

                conditionSelect();

            }else{

                //提示入库失败
                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            }

        })

    }

    //出库操作
    function outStroage(){

        var prm = {
            //医废编号
            mwcodes:[inStroageNum],
            //处理公司
            compname:$('#MW-company-out').val(),
            //运输车牌号
            carid:$('#MW-car-out').val(),
            //出库人
            outuserid:_userIdNum,
            //出库id
            outusername:_userIdName,
            //登录id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM,

        }

        _mainAjaxFunCompleteNew('post','MW/mwOutStorage',prm,$('#out-Modal').find('.modal-dialog'),function(result){

            if(result.code == 99){

                $('#out-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


        })


    }

    //回退操作
    function backStroage(){

        var prm = {
            //医废编号
            mwcode:inStroageNum,
            //登录id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM,

        }

        _mainAjaxFunCompleteNew('post','MW/mwBackToInstorage',prm,$('#back-Modal').find('.modal-dialog'),function(result){

            if(result.code == 99){

                $('#back-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


        })

    }

    //格式验证
    function formatValidateUser(fun){

        //非空验证
        if($('#MW-weigh').val() == '' || $('#MW-in-weigh').val() == '' || $('#MW-bucket').val() == '' ){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项','');

        }else{

            //验证错误
            var error = $('#commentForm').find('.error');

            if(error.length != 0){

                var flag = true;

                for(var i=0;i<error.length;i++){

                    if(error.eq(i).css('display') != 'none'){

                        flag = false;

                        break;

                    }

                }

                if(flag){

                    fun();

                }else{

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写正确格式','');

                }

            }else{

                //验证通过
                fun();

            }


        }

    }

    //获取当前已选中桶的信息
    function sureBucket(el){

        var str = el.find('.checker').attr('data-id');

        _currentBucket = str;

        var table = el.parents('table').attr('id');

        if(table == 'bucket-old-table'){

            str += '(旧桶)'

        }else if(table == 'bucket-new-table'){

            str += '(新桶)'

        }

        $('#selectedBucket').html(str);
    }

    //桶合计数据
    function bucketNumFun(){

        var prm = {

            //医废编号
            mwcode:$('#MWNum').val(),
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM,

        }

        _mainAjaxFunCompleteNew('post','MW/ywGetStorageBinInfos',prm,$('#table-bucket'),function(result){

            //桶
            var bucketNum = 0;

            //重量
            var weight = 0;

            var arr = [];

            if(result.code == 99){

                arr = result.data;

                //桶共计，重量共计
                for(var i=0;i<arr.length;i++){

                    bucketNum ++;

                    weight += Number(arr[i].inweight);

                }

            }

            _datasTable($('#table-bucket'),arr);

            //重量小计
            $('#dataTotalWeight').html('重量合计：' + weight + '(kg)');

            //桶小计
            $('#dataTotalBucket').html('桶合计：' + bucketNum + '(个)');

        })

    }
})