$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
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
    var _initStart = moment().format('YYYY/MM/DD');
    var _initEnd = moment().format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    //实际发送时间
    var realityStart;
    var realityEnd;
    //工单号
    var gdCode = '';
    //查看详细信息的Vue形式
    var workDones = new Vue({
        el:'#workDones',
        data:{
            rwlx:'',
            telephone:'',
            person:'',
            place:'',
            section:'',
            matter:'',
            sbSelect:'',
            sbLX:'',
            sbMC:'',
            sbBM:'',
            azAddress:'',
            remarks:'',
            weixiukeshis:''
        }
    });
    //所有负责人列表
    var _allZXRArr = [];
    //已选择的执行人数组
    var _zhixingRens = [];
    /*---------------------------------表格初始化---------------------------------*/
    //页面表格
    var table = $('#scrap-datatables').DataTable({
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
        "dom":'t<"F"lip>',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs'
            },
        ],
        'columns':[
            {
                title:'工单号',
                data:'gdCode',
                className:'gongdanId'
            },
            {
                title:'工单类型',
                data:'gdJJ',
                render:function(data, type, full, meta){
                    if(data == 0){
                        return '普通'
                    }if(data == 1){
                        return '快速'
                    }
                }
            },
            {
                title:'工单状态',
                data:'gdZht',
                className:'gongdanZt',
                render:function(data, type, full, meta){
                    if(data == 1){
                        return '待下发'
                    }if(data == 2){
                        return '待分派'
                    }if(data == 3){
                        return '待执行'
                    }if(data == 4){
                        return '执行中'
                    }if(data == 5){
                        return '等待资源'
                    }if(data == 6){
                        return '待关单'
                    }if(data == 7){
                        return '任务关闭'
                    }if(data == 8){
                        return '任务取消'
                    }
                }
            },
            {
                title:'车间站',
                data:'bxKeshi'
            },
            {
                title:'维修事项',
                data:'wxShiX'
            },
            {
                title:'故障位置',
                data:'wxDidian'
            },
            {
                title:'登记时间',
                data:'gdShij'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>下发</span>"

            }
        ]
    });
    //自定义按钮位置
    table.buttons().container().appendTo($('.excelButton'),table.table().container());
    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    };
    conditionSelect();
    //已选择的执行人表格
    var col = [
        {
            //class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'wxRen',
            className:'wxRen'
        },
        {
            title:'执行人员',
            data:'wxRName',
            className:'wxRName'
        },
        {
            title:'联系电话',
            data:'wxRDh',
            className:'wxRDh'
        },
        {
            class:'deleted',
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='tableDeleted data-option btn default btn-xs green-stripe'>删除</span>"
        }
    ];
    tableInit($('#personTable1'),col);
    //待选择执行人表格
    var col3 = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'wxRen',
            className:'zxrnum'
        },
        {
            title:'执行人员',
            data:'wxRName',
            className:'zxrname'
        },
        {
            title:'联系电话',
            data:'wxRDh',
            className:'zxrphone'
        }
    ];
    tableInit($('#zhixingRenTable'),col3);
    //添加表头复选框
    var creatCheckBox = '<input type="checkbox">';
    $('thead').find('.checkeds').prepend(creatCheckBox);
    var _personTable1 = $('#personTable1');
    _personTable1.find('tbody').on( 'click', 'input', function () {
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
        }else{
            $(this).parent($('span')).removeClass('checked');
        }
    });
    /*------------------------------------表格绑定事件---------------------------*/
    $('#scrap-datatables tbody')
        .on('click','.option-edit',function(){
            //当前行变色
            var $this = $(this).parents('tr');
            currentTr = $this;
            currentFlat = true;
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            $('#myModal').find('.btn-primary').addClass('paigongButton').removeClass('dengji');
            moTaiKuang($('#myModal'));
            //获取数据
            var gongDanState = $this.children('.gongdanZt').html();
            var gongDanCode = $this.children('.gongdanId').html();
            gdCode = gongDanCode;
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
                    if(result.gdJJ == 1){
                        $('#workDones').find('.inpus').parent('span').removeClass('checked');
                        $('#workDones').find('#ones1').parent('span').addClass('checked');
                    }else{
                        $('#workDones').find('.inpus').parent('span').removeClass('checked');
                        $('#workDones').find('#twos1').parent('span').addClass('checked');
                    }
                    //绑定弹窗数据
                    workDones.rwlx = result.gdLeixing;
                    workDones.telephone = result.bxDianhua;
                    workDones.person = result.bxRen;
                    workDones.place = result.wxDidian;
                    workDones.section = result.bxKeshi;
                    workDones.matter = result.wxShiX;
                    workDones.sbSelect = result.wxShebei;
                    workDones.sbLX = result.dcName;
                    workDones.sbMC = result.dName;
                    workDones.sbBM = result.ddName;
                    workDones.azAddress = result.installAddress;
                    workDones.weixiukeshis = result.wxKeshi;
                    workDones.remarks = result.wxBeizhu;
                    //负责人(初始化)
                    var fzr = [];
                    datasTable($('#personTable1'),fzr);
                }
            });
            //查看的时候，均不可操作。
            $('#workDones').find('input').attr('disabled',true).addClass('disabled-block');
            $('#workDones').find('select').attr('disabled',true).addClass('disabled-block');
            $('#workDones').find('textarea').attr('disabled',true).addClass('disabled-block');
        });
    /*----------------------------------按钮事件---------------------------------*/
    //选择执行人按钮；
    $('.zhiXingRenYuanButton').click(function (){
        //模态框显示
        moTaiKuang($('#myModal7'));
        //加载负责人数据
        fzr();
        var fn1 = function( row, data, index ) {
            for(var i=0;i<_zhixingRens.length;i++){
                if(data.wxRen == _zhixingRens[i].wxRen){
                    $('td:eq(0)', row).parents('tr').addClass('tables-hover');
                    $('td:eq(0)', row).addClass(' checkeds');
                    $('td:eq(0)', row).html( '<div class="checker"><span class="checked"><input type="checkbox"></span></div> ' );
                }
            }

        }
        tableInit(_zhixingRenTable,col3,fn1);
    });
    var _zhixingRenTable = $('#zhixingRenTable');
    //复选框点击事件
    _zhixingRenTable.find('tbody').on( 'click', 'input', function () {
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            $(this).parents('tr').addClass('tables-hover');
            //如果所有复选框打钩，那么表头的复选框自动打钩；
            var rowNum = $(this).parents('.table').find('tbody').find('.checkeds').length;
            var selectNum =  $(this).parents('.table').find('tbody').find('.checked').length;
            if( rowNum == selectNum){
                $(this).parents('.table').find('thead').find('.checkeds').find('span').addClass('checked');
            }
        }else{
            $(this).parent($('span')).removeClass('checked');
            //$(this).parents('tr').css({'background':'#ffffff'});
            $(this).parents('tr').removeClass('tables-hover');
            //只要有一个复选框没选中，全选框不打勾，
            $(this).parents('.table').find('thead').find('.checkeds').find('span').removeClass('checked');
        }
    });
    //点击thead复选框tbody的复选框全选中
    _zhixingRenTable.find('thead').find('input').click(function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            _zhixingRenTable.find('tbody').find('input').parents('.checker').children('span').addClass('checked');
            _zhixingRenTable.find('tbody').find('tr').addClass('tables-hover');
        }else{
            _zhixingRenTable.find('tbody').find('input').parents('.checker').children('span').removeClass('checked');
            _zhixingRenTable.find('tbody').find('tr').removeClass('tables-hover')
        }
    });
    //增加负责人确定按钮（静态）
    $('.addZXR').click(function (){
        var zxrList = _zhixingRenTable.children('tbody').find('.checked');
        for(var i=0;i<_allZXRArr.length;i++){
            for(var j=0;j<zxrList.length;j++){
                var bianma = zxrList.eq(j).parents('tr').children('.zxrnum').html();
                if( _allZXRArr[i].wxRen == bianma ){
                    if(_zhixingRens.length == 0){
                        _zhixingRens.push(_allZXRArr[i]);
                    }else{
                        var isExist = false;
                        for(var z=0;z<_zhixingRens.length;z++){
                            if(_zhixingRens[z].wxRen == _allZXRArr[i].wxRen){
                                isExist = true;
                                break;
                            }
                        }
                        if(isExist){

                        }else{
                            _zhixingRens.push(_allZXRArr[i]);
                        }
                    }
                }
            }
        }
        datasTable($('#personTable1'),_zhixingRens);
    })
    //删除负责任人按钮
    $('#personTable1 tbody').on('click','.tableDeleted',function(){
        var $thisBM = $(this).parents('tr').children('.wxRen').html();
        for(var i=0;i<_zhixingRens.length;i++){
            if(_zhixingRens[i].wxRen == $thisBM){
                $('.zxrGH').val(_zhixingRens[i].wxRen);
                $('.zxrXM').val(_zhixingRens[i].wxRName);
                $('.zxrDH').val(_zhixingRens[i].wxRDh);
            }
        }
        moTaiKuang($('#myModal8'));
    });
    //删除负责人确定按钮
    $('.removeWorkerButton').click(function(){
        var $thisBM = $('.zxrGH').val();
        _zhixingRens.removeByValue($thisBM,'wxRen');
        datasTable($('#personTable1'),_zhixingRens);
    });
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });
    //分配确定按钮
    $('.paigongButton').click(function(){
        var best = $('#personTable1 tbody').find('.checked').parents('tr').children('.wxRen').html();
        var fzrArr = [];
        for(var i=0;i<_zhixingRens.length;i++){
            var obj = {};
            obj.wxRen = _zhixingRens[i].wxRen;
            obj.wxRName = _zhixingRens[i].wxRName;
            obj.wxRDh = _zhixingRens[i].wxRDh;
            obj.gdCode = gdCode;
            if(_zhixingRens[i].wxRen == best){
                obj.wxRQZ = 1;
            }else{
                obj.wxRQZ = 0;
            }
            fzrArr.push(obj);
        }
        //分配负责人
        var gdWR = {
            gdCode : gdCode,
            gdWxRs : fzrArr,
            userID : _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDAddWxLeader',
            data:gdWR,
            success:function(result){
                if(result == 99){
                    moTaiKuang($('#myModal4'));
                    $('#myModal4').find('.modal-body').html('下发成功！');
                    $('#myModal').modal('hide');
                    upData();
                }
            }
        })
    })
    // 登记按钮
    $('.creatButton').click(function(){
        //修改确定按钮
        moTaiKuang($('#myModal'));
        $('#myModal').find('.btn-primary').addClass('dengji').removeClass('paigongButton');
        //初始化弹窗
        //样式初始化
        $('#workDones').find('input').attr('disabled',false).removeClass('disabled-block');
        $('#workDones').find('select').attr('disabled',false).removeClass('disabled-block');
        $('#workDones').find('textarea').attr('disabled',false).removeClass('disabled-block');
        //数据初始化
        workDones.picked = 0;
        $('#workDones').find('.inpus').parent('span').removeClass('checked');
        $('#workDones').find('#twos1').parent('span').addClass('checked');
        workDones.rwlx = 4;
        workDones.telephone = '';
        workDones.person = '';
        workDones.place = '';
        workDones.section = '';
        workDones.matter = '';
        workDones.sbSelect = '';
        workDones.sbLX = '';
        workDones.sbMC = '';
        workDones.sbBM = '';
        workDones.azAddress = '';
        workDones.weixiukeshis = '';
        workDones.remarks = '';
        _zhixingRens = [];
        datasTable($('#personTable1'),_zhixingRens);
    });
    $('#myModal').on('click','.dengji',function(){
        //判断必填项是否都填了
        if( workDones.telephone == '' || workDones.person == '' || workDones.place == '' || workDones.matter == '' || workDones.wxKeshi  == '' ){
            moTaiKuang($('#myModal4'));
            $('#myModal4').find('.modal-body').html('请填写红色必填项！')
        }else{
            //调用登记接口
            //console.log(_zhixingRens);
            //确定已选中的对象的id和_zhixingRens比较
            var best = $('#personTable1 tbody').find('.checked').parents('tr').children('.wxRen').html();
            var fzrArr = [];
            for(var i=0;i<_zhixingRens.length;i++){
                var obj = {};
                obj.wxRen = _zhixingRens[i].wxRen;
                obj.wxRName = _zhixingRens[i].wxRName;
                obj.wxRDh = _zhixingRens[i].wxRDh;
                if(_zhixingRens[i].wxRen == best){
                    obj.wxRQZ = 1;
                }else{
                    obj.wxRQZ = 0;
                }
                fzrArr.push(obj);
            }
            var gdInfo = {
                gdJJ:workDones.picked,
                gdLeixing:workDones.rwlx,
                bxDianhua:workDones.telephone,
                bxRen:workDones.person,
                wxDidian:workDones.place,
                bxKeshi:workDones.section,
                wxShiX:workDones.matter,
                wxShebei:workDones.sbSelect,
                dcName:workDones.sbLX,
                dName:workDones.sbMC,
                ddName:workDones.sbBM,
                installAddress:workDones.azAddress,
                wxKeshi:workDones.weixiukeshis,
                bxBeizhu:workDones.remarks,
                gdWxLeaders:fzrArr,
                gdSrc:1,
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDCreDJ',
                data:gdInfo,
                success:function(result){
                    if(result == 99){
                        moTaiKuang($('#myModal4'));
                        $('#myModal4').find('.modal-body').html('添加成功！');
                        $('#myModal').modal('hide');
                        //更新状态
                    }
                }
            })
        }
    })
    /*------------------------------------其他方法-------------------------------*/
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
                datasTable($("#scrap-datatables"),result);
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
    //模态框自适应
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
    //表格初始化方法
    function tableInit(tableID,col,fun){
        tableID.DataTable({
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
            "dom":'t<"F"lip>',
            'buttons': [
                {
                    extend: 'excelHtml5',
                    text: '保存为excel格式',
                },
            ],
            'columns':col,
            'rowCallback': fun
        })
    }
    //获得负责人列表数据
    function fzr(){
        var prm = {
            'zxName':'',
            'zxNum':'',
            'zxPhone':''
        }
        $.ajax({
            type:'post',
            url:'../resource/data/worker.json',
            success:function(result){
                _allZXRArr =[];
                for(var i=0;i<result.data.length;i++){
                    _allZXRArr.push(result.data[i]);
                }
                datasTable($('#zhixingRenTable'),result.data)
            },
            error:function(){

            }
        })
    }
    //数组删除指定元素的值
    Array.prototype.removeByValue = function(val,attr) {
        for(var i=0; i<this.length; i++) {
            if(this[i][attr] == val) {
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
    //更新状态
    function upData(){
        var gdInfo = {
            gdCode :gdCode,
            gdZht : 2,
            wxKeshi:'',
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
            data:gdInfo,
            success:function(result){
                console.log(result);
                conditionSelect();
            }
        })
    }
})