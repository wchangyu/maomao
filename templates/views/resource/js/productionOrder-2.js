$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //存放执行人信息的数组
    var _zhixingRens = [];
    var _weiXiuCaiLiao = [];
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //设置初始时间
    var _initStart = moment().format('YYYY/MM/DD');
    var _initEnd = moment().format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    //实际发送时间
    var realityStart;
    var realityEnd;
    //工单号
    var gdCode;
    //通过vue对象实现双向绑定
    //查看详细信息的Vue形式
    var workDones = new Vue({
        el:'#workDone',
        data:{
            weixiukeshis:'',
            baoxiukeshis:'',
            baoxiudidians:'',
            weixiushixiangs:'',
            baoxiudianhua:'',
            baoxiuren:'',
            weixiushebei:'',
            beizhus:''
        }
    })
    //自定义验证器
    //手机号码
    Vue.validator('telephones', function (val) {
        return /^[0-9]*$/.test(val)
    })
    //验证必填项（非空）
    Vue.validator('persons', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    })
    //登记信息绑定
    var app33 = new Vue({
        el:'#myApp33',
        data:{
            picked:'0',
            telephone:'',
            person:'',
            place:'',
            section:'',
            matter:'',
            sections:'',
            remarks:''
        },
        methods:{
            radios:function(){
                $('.inpus').click(function(a){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            }
        }
    })
    //添加执行人信息绑定
    var zhiXingRen = new Vue({
        el:'#zhiXingRen',
        data:{
            zhixingren:'',
            gonghao:'',
            dianhua:'',
            rules: {
                minlength: 1,
                maxlength: 16
            }
        }
    });
    var weiXiuCaiLiaos = new Vue({
        el:'#weiXiuCaiLiao',
        data:{
            caiLiaoFenXi:'',
            weiXiuCaiLiao:'',
            shuLiang:''
        }
    })
    //状态
    $('.tableHover').eq(1).css({'opacity':0});
    /*-----------------------------表格初始化----------------------------------------*/
    //页面表格
    var table = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
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
                text: '保存为excel格式',
                className:'saveAs',
                header:true
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'工单号',
                data:'gdCode',
                className:'gongdanId'
            },
            {
                title:'紧急',
                data:'gdJJ',
                render:function(data, type, full, meta){
                    if(data == 0){
                        return '否'
                    }if(data == 1){
                        return '是'
                    }
                }
            },
            {
                title:'工单状态',
                data:'gdZht',
                render:function(data, type, full, meta){
                    if(data == 1){
                        return '待受理'
                    }if(data == 2){
                        return '待接单'
                    }if(data == 3){
                        return '待执行'
                    }if(data == 4){
                        return '待完成'
                    }if(data == 5){
                        return '完工确认'
                    }if(data == 6){
                        return '待评价'
                    }if(data == 7){
                        return '结束'
                    }
                }
            },
            {
                title:'报修部门',
                data:'bxKeshi'
            },
            {
                title:'维修事项',
                data:'wxShiX'
            },
            {
                title:'维修地点',
                data:'wxDidian'
            },
            {
                title:'登记时间',
                data:'gdShij'
            },
        ],
        "columnDefs": [{
            "visible": true,
            "targets": -1
        }]
    });
    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }
    //执行人员表格
    $('#personTable1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
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
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'执行人员',
                data:'wxRName'
            },
            {
                title:'工号',
                data:'wxRen'
            },
            {
                title:'联系电话',
                data:'wxRDh'
            }
        ]
    });
    //增加执行人员表格（第二层弹窗）
    $('#zhiXingPerson').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'执行人员',
                data:'wxRName'
            },
            {
                title:'工号',
                data:'wxRen'
            },
            {
                title:'联系电话',
                data:'wxRDh'
            },
            {
                class:'deleted',
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='tableDeleted'>删除</span>"
            },
        ]
    });
    //材料表格
    $('#personTables1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
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
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'材料分析',
                data:'wxCl'
            },
            {
                title:'维修材料',
                data:'wxClName'
            },
            {
                title:'数量',
                data:'clShul'
            },
            {
                title:'使用人',
                data:' '
            }
        ]
    });
    //增加材料表格
    $('#weiXiuCaiLiaoTable').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'材料分类',
                data:'wxClName'
            },
            {
                title:'维修材料',
                data:'wxCl'
            },
            {
                class:'deleted',
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='tableDeleted'>删除</span>"
            },
        ]
    });
    /*-------------------给所有datatables的thead添加复选框-----------------------*/
    /*//tbody选择事件
    $('#personTable1 tbody').on('click','input',function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            //确定是哪一行，然后变颜色
            $(this).parents('tr').css({'background':'#fbec88'});
        }else{
            $(this).parent($('span')).removeClass('checked');
            $(this).parents('tr').css({'background':'#ffffff'});
        }
        //判断如果所有的tbody中的复选框都是选中状态，thead自动置为选中状态
        var $thisCheckedLength = $(this).parents('tbody').find('.checker').children('.checked').length;
        var $thisTrLength = $(this).parents('tbody').children('tr').length;
        if($thisCheckedLength == $thisTrLength){
            $(this).parents('table').children('thead').find('.checkeds').find('span').addClass('checked');
        }else{
            $(this).parents('table').children('thead').find('.checkeds').find('span').removeClass('checked');
        }
    })
    //thead选择事件
    $('table thead').on('click','input',function(){
        var $thisChecked = $(this).parents('table').children('tbody').children('tr').find('.checkeds').children().children('span');
        var $thisTr = $(this).parents('table').children('tbody').children('tr')
        if($(this).parents('.checker').children('.checked').length != 0){
            $thisChecked.addClass('checked');
            $thisTr.css({'background':'#fbec88'})
        }else{
            $thisChecked.removeClass('checked');
            $thisTr.css({'background':'#ffffff'})
        }
    })*/
    /*-----------------------------页面加载时调用的方法------------------------------*/
    //条件查询
    conditionSelect();
    /*---------------------------------表格绑定事件-------------------------------------*/
    var lastIdx = null;
    $('#scrap-datatables tbody')
        //鼠标略过行变色
        .on( 'mouseover', 'td', function () {
            var colIdx = table.cell(this).index();
            if ( colIdx !== lastIdx ) {
                $( table.cells().nodes() ).removeClass( 'highlight' );
                $( table.column( colIdx ).nodes() ).addClass( 'highlight' );
            }
        } )
        .on( 'mouseleave', function () {
            $( table.cells().nodes() ).removeClass( 'highlight' );
        } )
        //双击背景色改变，查看详情
        .on('dblclick','tr',function(){
            //当前行变色
            var $this = $(this);
            currentTr = $this;
            currentFlat = true;
            $('#scrap-datatables tbody').children('tr').css({'background':'#ffffff'});
            $(this).css({'background':'#FBEC88'});
            $('#myModal1').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal1').modal('show');
            moTaiKuang();
            //获取详情
            var gongDanState = $this.children('td').eq(2).html();
            var gongDanCode = $this.children('td').eq(0).html();
            gdCode = gongDanCode;
            if( gongDanState == '待接单' ){
                $('.workDone .gongdanClose').find('.btn-success').html('接单');
                gongDanState = 2;
            }else if( gongDanState == '待执行'){
                $('.workDone .gongdanClose').find('.btn-success').html('执行');
                gongDanState = 3;
            }else if( gongDanState == '待完成' ){
                $('.workDone .gongdanClose').find('.btn-success').html('完成');
                gongDanState = 4
            }
            var prm = {
                'gdCode':gongDanCode,
                'gdZht':gongDanState,
                'userID':_userIdName
            }
            //每次获取弹出框中执行人员的数量
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDGetDetail',
                async:false,
                data:prm,
                success:function(result){
                    //绑定弹窗数据
                    workDones.weixiukeshis = result.wxKeshi;
                    workDones.baoxiukeshis = result.bxKeshi;
                    workDones.baoxiudidians = result.wxDidian;
                    workDones.weixiushixiangs = result.wxShiX;
                    workDones.beizhus = result.bxBeizhu;
                    workDones.baoxiudianhua = result.bxDianhua;
                    workDones.baoxiuren = result.bxRen;
                    workDones.weixiushebei = result.wxShebei;
                    _zhixingRens = result.wxRens;
                    _weiXiuCaiLiao = result.wxCls;
                    //添加后的执行人员
                    if(_zhixingRens.length == 0){
                        var table = $("#personTable1").dataTable();
                        table.fnClearTable();
                        $('.paigongButton').attr('disabled',true);
                        $('.paiGongTip').show();
                    }else{
                        var table = $("#personTable1").dataTable();
                        table.fnClearTable();
                        table.fnAddData(_zhixingRens);
                        table.fnDraw();
                        $('.paigongButton').attr('disabled',false);
                        $('.paiGongTip').hide();
                    }
                    //添加后的维修材料
                    if(_weiXiuCaiLiao.length == 0){
                        var tables = $("#personTables1").dataTable();
                        tables.fnClearTable();
                    }else {
                        var tables = $("#personTables1").dataTable();
                        tables.fnClearTable();
                        tables.fnAddData(_weiXiuCaiLiao);
                        tables.fnDraw();
                    }
                }
            });
        });
    /*-------------------------------方法----------------------------------------*/
    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        realityStart = filterInput[2] + ' 00:00:00';
        realityEnd = moment(filterInput[3]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var prm = {
            'gdCode':filterInput[0],
            'gdSt':realityStart,
            'gdEt':realityEnd,
            'bxKeshi':filterInput[1],
            'wxKeshi':'',
            "gdZht": 1,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDJ',
            async:false,
            data:prm,
            success:function(result){
                if(result.length == 0){
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                }else{
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                    table.fnAddData(result);
                    table.fnDraw();
                }
            }
        })
    }
    //数组删除指定元素的值
    Array.prototype.removeByValue = function(val) {
        for(var i=0; i<this.length; i++) {
            if(this[i] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
    //数组删除指定索引
    Array.prototype.remove=function(obj){
        for(var i =0;i <this.length;i++){
            var temp = this[i];
            if(!isNaN(obj)){
                temp=i;
            }
            if(temp == obj){
                for(var j = i;j <this.length;j++){
                    this[j]=this[j+1];
                }
                this.length = this.length-1;
            }
        }
    }
    /*----------------------------------按钮触发的事件-----------------------------*/
    //弹窗切换表格效果
    $('.table-title span').click(function(){
        $('.table-title span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.tableHover').css({'z-index':0});
        $('.tableHover').css({'opacity':0});
        $('.tableHover').eq($(this).index()).css({
            'z-index':1,
            'opacity':1
        })
    });
    //查询按钮功能
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            $('#myModal4').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal4').find('.modal-body').html('起止时间不能为空');
            $('#myModal4').modal('show');
            moTaiKuang2();
        }else{
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                $('#myModal4').modal({
                    show:false,
                    backdrop:'static'
                })
                $('#myModal4').find('.modal-body').html('起止时间不能大于结束时间');
                $('#myModal4').modal('show');
                moTaiKuang2();
            }else{
                conditionSelect();
            }
        }
    })
    //重置按钮功能
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.datatimeblock').eq(0).val(_initStart);
        $('.datatimeblock').eq(1).val(_initEnd);
    })
    //登记按钮
    $('.creatButton').click(function(){
        //所有登记页面的输入框清空
        app33.telephone = '';
        app33.person = '';
        app33.place = '';
        app33.matter = '';
        app33.sections = '';
        app33.remarks = '';
        app33.section = '';
        $('#myModal').modal({
            show:false,
            backdrop:'static'
        })
        $('#myModal').modal('show');
        moTaiKuang();
    })
    //登记弹框，点击确定，获得数据，向后台传参
    $('#createGongdan').find('.btn-success').click(function(){
        var gdInfo = {
            'gdJJ':app33.picked,
            'bxRen':app33.person,
            'bxDianhua':app33.telephone,
            'bxKeshi':app33.section,
            'wxDidian':app33.place,
            'wxShiX':app33.matter,
            'wxKeshi':app33.sections,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDCreDJ',
            data:gdInfo,
            success:function(result){
                var str = '<div class="alert alert-success" style="text-align: center;"> <button class="close" data-close="alert"></button><span>' + result
                '</span>';
                $('.gongdanContent').append(str);
                //5秒之后自动关闭
                setTimeout(function(){$(".gongdanContent .alert").hide();},2000);
                //刷新表格
                conditionSelect();
            }
        })
    })
    //点击派工，切换状态
    $('.paigongButton').click(function(){
        //如果维修科室没有添加的话，出现弹出框，无法实现派工
        if(workDones.weixiukeshis == ''){
            $('#myModal4').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal4').find('.modal-body').html('请填写维修部门');
            $('#myModal4').modal('show');
            moTaiKuang2();
        }else{
            var gdInfo = {
                'gdCode':gdCode,
                'gdZht':2,
                'wxKeshi':workDones.weixiukeshis,
                'userID':_userIdName
            }
            $.ajax({
                url:_urls + 'YWGD/ywGDUptPaig',
                type:'post',
                data:gdInfo,
                success:function(result){
                    $('#myModal1').modal('hide');
                    conditionSelect();
                }
            })
        }
    })
    $('.dengji').click(function(){
        if(app33.person == '' || app33.place == '' || app33.matter == ''){
            //alert('请填写必填项')
            $('#myModal4').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal4').find('.modal-body').html('请填写红色必填项');
            $('#myModal4').modal('show');
            moTaiKuang2();
        }else{
            $('#myModal').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal').modal('hide');
            var gdInfo = {
                'gdJJ':app33.picked,
                'bxRen':app33.person,
                'bxDianhua':app33.telephone,
                'bxKeshi':app33.section,
                'wxDidian':app33.place,
                'wxShiX':app33.matter,
                'wxKeshi':'',
                'bxBeizhu':app33.remarks,
                'userID':_userIdName,
                'gdSrc':2
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDCreDJ',
                data:gdInfo,
                success:function(result){
                    if(result == 99){
                        $('#myModal4').modal({
                            show:false,
                            backdrop:'static'
                        })
                        $('#myModal4').find('.modal-body').html('添加成功');
                        $('#myModal4').modal('show');
                        moTaiKuang2()
                    }
                    //刷新表格
                    conditionSelect();
                }
            })
        }
    });
    $('.confirm1').click(function(){
        $('#myModal4').modal('hide');
    })
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
    /*----------------------------------添加执行人员功能-----------------------------------*/
    //点击选择执行人员按钮
    $('.zhiXingRenYuanButton').click(function(){
        $('#myModal2').modal({
            show:false,
            backdrop:'static'
        })
        $('#myModal2').modal('show');
        moTaiKuang();
        //初始化上次添加人的表格输入框
        zhiXingRen.zhixingren = '';
        zhiXingRen.gonghao = '';
        zhiXingRen.dianhua = '';
        //获取数据库中的执行人员的信息
        //获取详情
        //点击添加执行人员之后弹出的表格
        if(_zhixingRens.length == 0){
            var table = $("#zhiXingPerson").dataTable();
            table.fnClearTable();
        }else{
            var table = $("#zhiXingPerson").dataTable();
            table.fnClearTable();
            table.fnAddData(_zhixingRens);
            table.fnDraw();
        }
    })
    $('.tianJiaPerson').click(function(){
        //添加之前先判断一下非空了没
        if(zhiXingRen.zhixingren == '' || zhiXingRen.gonghao == '' || zhiXingRen.dianhua == ''){
            $('#myModal4').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal4').find('.modal-body').html('请填写红色必填项');
            $('#myModal4').modal('show');
            moTaiKuang2();
        }else{
            var objects = {};
            objects.wxRName = zhiXingRen.zhixingren;
            objects.wxRen = zhiXingRen.gonghao;
            objects.wxRDh = zhiXingRen.dianhua;
            //避免录入的信息重复，做个判断
            if(_zhixingRens.length == 0){
                _zhixingRens.push(objects);
                var table = $("#zhiXingPerson").dataTable();
                table.fnClearTable();
                table.fnAddData(_zhixingRens);
                table.fnDraw();
            }else{
                var isExist = false;
                for(var i=0;i<_zhixingRens.length;i++){
                    if(_zhixingRens[i].wxRen == objects.wxRen){
                        isExist = true;
                        break;
                    }
                }
                if(isExist){
                    $('.exists').show();
                }else{
                    $('.exists').hide();
                    _zhixingRens.push(objects);
                    var table = $("#zhiXingPerson").dataTable();
                    table.fnClearTable();
                    table.fnAddData(_zhixingRens);
                    table.fnDraw();
                }
            }
        }
    });
    //点击第二层弹窗的确定，给第一个弹窗的表格赋值
    $('.secondButton').click(function(){
        //传回给第一个弹框的表格
        //输上谁就是谁
        if(_zhixingRens.length == 0){
            var table = $("#personTable1").dataTable();
            table.fnClearTable();
            $('.paigongButton').attr('disabled',true);
            $('.paiGongTip').show();
        }else{
            var table = $("#personTable1").dataTable();
            table.fnClearTable();
            table.fnAddData(_zhixingRens);
            table.fnDraw();
            $('.paigongButton').attr('disabled',false);
            $('.paiGongTip').hide();
        }
        addWorker();
        removeWork();
        $('#myModal2').modal('hide');
    });
    //给执行人员的表格添加删除事件
    $('#zhiXingPerson tbody').on('click','tr',function(){
        var e = event || window.event;
        if(e.target.className.toLowerCase() == 'tabledeleted'){
            //首先获得点击的执行人的工号，然后删除了数组，然后再返回给前一个弹出框
            //首先获得点击行的tr
            //获得点击行的工号的td
            var deleteValue = $(this).children('td').eq(1).html();
            //遍历数组，删除工号匹配的对象
            for(var i=0;i<_zhixingRens.length;i++){
                if(_zhixingRens[i].wxRen == deleteValue){
                    _zhixingRens.splice(i,1);
                    if(_zhixingRens.length == 0){
                        _zhixingRens = [];
                        var table = $("#zhiXingPerson").dataTable();
                        table.fnClearTable();
                    }else{
                        var table = $("#zhiXingPerson").dataTable();
                        table.fnClearTable();
                        table.fnAddData(_zhixingRens);
                        table.fnDraw();
                    }
                    //重构表格的值

                }
            }
        }
    });
    function addWorker(){
        gdCode = currentTr.children('td').eq(0).html();
        var gdRen = [];
        for(var i=0;i<_zhixingRens.length;i++){
            var object = {};
            object.wxrID = 0;
            object.wxRen = _zhixingRens[i].wxRen;
            object.wxRName = _zhixingRens[i].wxRName;
            object.wxRDh = _zhixingRens[i].wxRDh;
            object.gdCode = gdCode;
            gdRen.push(object);
        }
        var gdWR = {
            "gdCode":gdCode,
            "gdWxRs":gdRen,
            "userID":_userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDAddWxR',
            data:gdWR,
            success:function(result){
                //刷新条件查询
                conditionSelect();
            }
        })
    }
    function removeWork() {
        var gdCode = currentTr.children('td').eq(0).html();
        var gdRen = [];
        for (var i = 0; i < _zhixingRens.length; i++) {
            var object = {};
            object.wxrID = 0;
            object.wxRen = _zhixingRens[i].wxRen;
            object.wxRName = _zhixingRens[i].wxRName;
            object.wxRDh = _zhixingRens[i].wxRDh;
            object.gdCode = gdCode;
            gdRen.push(object);
        }
        var gdWR = {
            "gdCode": gdCode,
            "gdWxRs": gdRen,
            "userID": _userIdName
        };
        $.ajax({
            type: 'post',
            url:_urls + 'YWGD/ywGDDelWxR',
            data: gdWR,
            success: function (result) {
                //刷新条件查询
                conditionSelect();
            }
        })
    }
    //第一层摩太狂的确定按钮
    /*$('.firstButton').click(function(){
        $('#myModal1').modal('hide');
    })*/
    /*----------------------------------添加材料功能材料----------------------------------------*/
    //点击选择材料按钮
    $('.tianJiaCaiLiao').click(function(){
        $('#myModal3').modal('show');
        /*caiLiaoMarkSize();*/
        if(_weiXiuCaiLiao.length == 0){
            var table = $("#weiXiuCaiLiaoTable").dataTable();
            table.fnClearTable();
        }else{
            var table = $("#weiXiuCaiLiaoTable").dataTable();
            table.fnClearTable();
            table.fnAddData(_weiXiuCaiLiao);
            table.fnDraw();
        }
    })
    //将input框的信息填如表格中
    $('.tianJiaCai').click(function(){
        var object = {};
        object.wxClName = weiXiuCaiLiaos.caiLiaoFenXi;
        object.wxCl = weiXiuCaiLiaos.weiXiuCaiLiao;
        object.clShul = weiXiuCaiLiaos.shuLiang;
        _weiXiuCaiLiao.push(object);
        var table = $("#weiXiuCaiLiaoTable").dataTable();
         table.fnClearTable();
         table.fnAddData(_weiXiuCaiLiao);
         table.fnDraw();
    });
    //点击第二层弹窗的确定，给第一个弹窗的表格赋值
    $('.secondButtons').click(function(){
        $('#myModal3').modal('hide');
        //传回给第一个弹框的表格
        if(_weiXiuCaiLiao.length == 0){
            var table = $("#personTables1").dataTable();
            table.fnClearTable();
        }else{
            var table = $("#personTables1").dataTable();
            table.fnClearTable();
            table.fnAddData(_weiXiuCaiLiao);
            table.fnDraw();
        }
        //输上谁就是谁
        addCaiLiao();
        removeCaiLiao();
    });
    //给执行人员的表格添加删除事件
    $('#weiXiuCaiLiaoTable tbody').on('click','tr',function(){
        var e = event || window.event;
        if(e.target.className.toLowerCase() == 'tabledeleted'){
            //通过坐标删除吧
            _weiXiuCaiLiao.remove($(this).index());
            if(_weiXiuCaiLiao.length == 0){
                var table = $("#weiXiuCaiLiaoTable").dataTable();
                table.fnClearTable();
            }else{
                var table = $("#weiXiuCaiLiaoTable").dataTable();
                table.fnClearTable();
                table.fnAddData(_weiXiuCaiLiao);
                table.fnDraw();
            }
        }
    });
    function addCaiLiao(){
        var cailiaoInfo = [];
        for(var i=0;i<_weiXiuCaiLiao.length;i++){
            var object = {};
            object.wxClID = 0;
            object.wxCl = _weiXiuCaiLiao[i].wxCl;
            object.wxClName = _weiXiuCaiLiao[i].clShul;
            object.clShul = _weiXiuCaiLiao[i].clShul;
            object.gdCode = gdCode;
            cailiaoInfo.push(object);
        }
        var gdWxCl = {
            "gdCode":gdCode,
            "gdWxCls":cailiaoInfo,
            "userID":_userIdName
        }
        $.ajax({
            url:_urls + 'YWGD/ywGDAddWxCl',
            type:'post',
            data:gdWxCl,
            success:function(result){
                conditionSelect();
            }
        })
    }
    function removeCaiLiao(){
        var cailiaoInfo = [];
        for(var i=0;i<_weiXiuCaiLiao.length;i++){
            var object = {};
            object.wxClID = 0;
            object.wxCl = _weiXiuCaiLiao[i].wxCl;
            object.wxClName = _weiXiuCaiLiao[i].wxClName;
            object.clShul = 0;
            object.gdCode = gdCode;
            cailiaoInfo.push(object);
        }
        var gdWC = {
            "gdCode":gdCode,
            "gdWxCls":cailiaoInfo,
            "userID":_userIdName
        }
        $.ajax({
            url:_urls + 'YWGD/ywGDDelWxCl',
            type:'post',
            data:gdWC,
            success:function(result){
                conditionSelect();
            }
        })
    }
    /*-----------------------------------------模态框位置自适应------------------------------------------*/
    //第一层
    function moTaiKuang(){
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = $('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        $('.modal-dialog').css({'margin-top':markBlockTop});
    }
    //提示框
    function moTaiKuang2(){
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = $('#myModal4').find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        $('#myModal4').find('.modal-dialog').css({'margin-top':markBlockTop});
    }
})