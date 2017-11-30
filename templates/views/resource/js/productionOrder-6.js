$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdNum = sessionStorage.getItem('userName');
    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //图片ip
    var _urlImg = 'http://1.1.1.1/ApService/dimg.aspx';

    var _isLineLoaded = false;      //线路数据是否载入
    var _isStationLoaded = false;   //车站数据是否载入
    var _isDepartLoaded = false;    //车间和班组数据是否载入
    var _isSystemLoaded = false;    //系统设备是否载入
    //工单时间
    var gdETime = moment().format('YYYY/MM/DD');
    var gdSTime =moment().subtract(30,'d').format('YYYY/MM/DD');
    $('.gdTime').eq(0).val(gdSTime);
    $('.gdTime').eq(1).val(gdETime);
        //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });
    //实际传输时间初始化
    var gdrealityEnd = moment($('.gdTime').eq(1).val()).add(1,'d').format('YYYY/MM/DD') + '00:00:00';
    var gdrealityStart = moment($('.gdTime').eq(0).val()).format('YYYY/MM/DD') + '00:00:00';
    var slrealityStart = moment($('.datatimeblock').eq(2).val()).format('YYYY/MM/DD') + ' 00:00:00';
    var slrealityEnd = moment($('.datatimeblock').eq(3).val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
    var bhrealityStart = moment($('.datatimeblock').eq(4).val()).format('YYYY/MM/DD') + ' 00:00:00';
    var bhrealityEnd = moment($('.datatimeblock').eq(5).val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
    //弹出框信息绑定vue对象
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
            remarks:'',
            wxbeizhu:'',
            rwlx:4,
            sbSelect:'',
            sbLX:'',
            sbMC:'',
            sbBM:'',
            azAddress:'',
            whether:'',
            gdly:''
        },
        methods:{
            radios:function(){
                $('.inpus').click(function(a){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            }
        }
    });
    //定位当前页
    //var currentPages = 0;
    //执行人数组
    var _zhixingRens = [];
    //物料数组
    var _weiXiuCaiLiao = [];
    //负责人数组
    var _fuZeRen = [];
    //记录工单号
    var _gdCode = 0;
    //记录当前工单详情有几个图
    var _imgNum = 0;
    //执行人员的标识
    var _workerFlag = false;
    //物料的标识
    var _WLFlag = false;
    //状态标识
    var _stateFlag = false;
    //负责人标识
    var _leaderFlag = false;
    //状态值
    var _gdState = 0;
    //重发值
    var _gdCircle = 0;
    //设备类型数组
    var _allDataXT = [];
    //车站数组
    var _allDataBM = [];
    //线路数组
    var _lineArr = [];
    //所属维保组
    var _InfluencingArr = [];
    //所属班组
    var _bzArr = [];
    //设备系统
    ajaxFun('YWDev/ywDMGetDSs',_allDataXT, $('#xtlx'), 'dsName', 'dsNum');
    //所有车站数据
    ajaxFun('YWDev/ywDMGetDDs', _allDataBM,$('#station'), 'ddName', 'ddNum');
    //线路数据
    lineRouteData($('#line'));
    //影响单位
    InfluencingUnit();
    //执行人方法执行
    var _zxrComplete = false;
    //物料方法执行
    var _wlComplete = false;
    /*--------------------------表格初始化---------------------------------------*/
    //页面表格
    var table = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "order": true,
        //"pagingType":"full_numbers",
        "iDisplayLength":50,//默认每页显示的条数
        "bStateSave":true,
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
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs',
                exportOptions:{
                    columns:[0,1,2,3,5,6,7,8,9,10,11,12,13,14,15]
                }
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'工单号',
                data:'gdCode2',
                render:function(data, type, row, meta){
                    return '<span class="gongdanId" gdCode="' + row.gdCode +
                        '"' + "gdCircle=" + row.gdCircle +
                        '></span><a href="productionOrder_see.html?gdCode=' +  row.gdCode  +  '&gdCircle=' + row.gdCircle +
                        '"' +
                        'target="_blank">' + data + '</a>'
                }
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
                    }if(data == 999){
                        return '任务取消'
                    }
                }
            },
            {
                title:'任务级别',
                data:'gdLeixing',
                render:function(data, type, full, meta){
                    if(data == 1){
                        return '一级任务'
                    }if(data == 2){
                        return '二级任务'
                    }if(data == 3){
                        return '三级任务'
                    }if(data == 4){
                        return '四级任务'
                    }
                }
            },
            {
                title:'工单来源',
                data:'gdCodeSrc',
                render:function(data, type, full, meta){
                    if(data == 1){
                        return '车站报修'
                    }else{
                        return '现场人员报修'
                    }
                }
            },
            {
                title:'工单状态值',
                data:'gdZht',
                className:'ztz'
            },
            {
                title:'系统类型',
                data:'wxShiX'
            },
            {
                title:'设备名称',
                data:'dName'
            },
            {
                title:'车站',
                data:'bxKeshi'
            },
            {
                title:'故障位置',
                data:'wxDidian'
            },
            {
                title:'故障描述',
                data:'bxBeizhu'
            },
            {
                title:'最新处理情况',
                data:'lastUpdateInfo'
            },
            {
                title:'所属班组',
                data:'wxKeshi'
            },
            {
                title:'受理时间',
                data:'shouLiShij'
            },
            {
                title:'督察督办责任人',
                data:'wxUserNames'
            },
            {
                title:'超时',
                data:'timeSpan',
                render:function(data, type, full, meta){
                    if(data>0){
                        return '<span style="color: red;">' + data + '</span>';
                    }else{
                        return '<span style="color: green;">' + data + '</span>';
                    }
                }
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "className":'noprint',
                "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>查看</span>"
            }
        ]
    });
    table.buttons().container().appendTo($('.excelButton'),table.table().container());
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
        "iDisplayLength":50,//默认每页显示的条数
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
                text: '导出',
                className:'hiddenButton'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                class:'checkeds',
                "targets": -1,
                "data": 'wxRQZ',
                render:function(data, type, row, meta){
                    if(data == 1){
                        return "<div class='checker'><span class='checked'><input type='checkbox'></span></div>"
                    }else{
                        return "<div class='checker'><span><input type='checkbox'></span></div>"
                    }
                }
            },
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
    $('#personTables1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        "iDisplayLength":50,//默认每页显示的条数
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
                text: '导出',
                className:'hiddenButton'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'备件编码',
                data:'wxCl'
            },
            {
                title:'备件名称',
                data:'wxClName'
            },
            {
                title:'数量',
                data:'clShul'
            }
        ]
    });
    //条件查询
    //conditionSelect();
    /*----------------------------表格绑定事件-----------------------------------*/
    var _currentChexiao = false;
    var _currentClick;
    $('#scrap-datatables tbody')
        //查看详情
        .on('click','.option-edit',function(e){
            _gdCircle = $(this).parents('tr').children('td').children('.gongdanId').attr('gdcircle');
            //图片区域隐藏
            $('.showImage').hide();
            //获得当前的页数，
            //for( var i=0;i<$('.paginate_button').length;i++){
            //    if($('.paginate_button').eq(i).hasClass('current')){
            //        currentPages = $('.paginate_button').eq(i).html();
            //    }
            //}
            //当前行变色
            var $this = $(this).parents('tr');
            currentTr = $this;
            currentFlat = true;
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            moTaiKuang($('#myModal'));
            //获取详情
            var gongDanState = parseInt($this.children('.ztz').html());
            var gongDanCode = $this.children('td').children('.gongdanId').attr('gdCode');
            _gdCode = gongDanCode;
            var prm = {
                'gdCode':gongDanCode,
                'gdZht':gongDanState,
                'userID':_userIdNum,
                'userName':_userIdName,
                'gdCircle':_gdCircle
            }
            //每次获取弹出框中执行人员的数量
            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDGetDetail',
                async:false,
                data:prm,
                success:function(result){
                    var progressBarList = $('.progressBarList');
                    //绑定弹窗数据
                    if(result.gdJJ == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('#ones').parent('span').addClass('checked');
                    }else{
                        $('.inpus').parent('span').removeClass('checked');
                        $('#twos').parent('span').addClass('checked');
                    }
                    if (result.gdRange == 1) {
                        $('#myApp33').find('.whether').parent('span').removeClass('checked');
                        $('#myApp33').find('#four').parent('span').addClass('checked');
                    } else {
                        $('#myApp33').find('.whether').parent('span').removeClass('checked');
                        $('#myApp33').find('#three').parent('span').addClass('checked');
                    }
                    //_zhixingRens = [];
                    //for(var i=0;i<result.wxRens.length;i++){
                    //    var obj = {};
                    //    obj.userName = result.wxRens[i].wxRName;
                    //    obj.userNum = result.wxRens[i].wxRen;
                    //    obj.mobile = result.wxRens[i].wxRDh;
                    //    _zhixingRens.push(obj);
                    //}
                    datasTable($("#personTable1"),result.wxRens);
                    //维修材料
                    datasTable($("#personTables1"),result.wxCls);
                    $('.otime').val(result.gdFsShij);
                    //app33.picked = result.gdJJ;
                    app33.telephone = result.bxDianhua;
                    app33.person = result.bxRen;
                    app33.place = result.wxDidian;
                    app33.section = result.bxKeshi;
                    app33.matter = result.wxShiX;
                    app33.sections = result.wxKeshi;
                    app33.remarks = result.bxBeizhu;
                    app33.wxbeizhu = result.wxBeizhu;
                    app33.sbSelect = result.wxShebei;
                    app33.sbLX = result.dcName;
                    app33.sbMC = result.dName;
                    app33.sbBM = result.ddName;
                    app33.azAddress = result.installAddress;
                    app33.rwlx = result.gdLeixing;
                    _zhixingRens = result.wxRens;
                    _fuZeRen = result.gdWxLeaders;
                    _imgNum = result.hasImage;
                    app33.gdly = result.gdCodeSrc;
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            });
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true).addClass('disabled-block');
            //备件处理过程
            //logInformation(2);
            //工单处理过程
            //logInformation(1);
            //综合
            logInformation(0);
            e.stopPropagation();
        })
        // 单机选中(为了单击的时候就获得执行人员和物料，所以要直接调用获得详情接口)
        .on('click','tr',function(e){
            var scrollTopNum = $(window).scrollTop();
            $('body').scrollTop(scrollTopNum);
            _gdCircle = $(this).children('td').children('.gongdanId').attr('gdcircle');
            var $this = $(this);
            _currentChexiao = true;
            _currentClick = $this;
            //获得当前的页数，
            //for( var i=0;i<$('.paginate_button').length;i++){
            //    if($('.paginate_button').eq(i).hasClass('current')){
            //        currentPages = $('.paginate_button').eq(i).html();
            //    }
            //}
            $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            //获得详情
            var gdCode = parseInt($this.children('td').children('.gongdanId').attr('gdCode'));
            var gdZht = parseInt($this.children('.ztz').html());
            _gdState = gdZht
            _gdCode = gdCode;
            var prm = {
                "gdCode": gdCode,
                "gdZht": gdZht,
                "wxKeshi": "",
                "userID": _userIdNum,
                'gdCircle':_gdCircle
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDGetDetail',
                data:prm,
                success:function(result){
                    if(result){
                        _zhixingRens = result.wxRens;
                        _weiXiuCaiLiao = result.wxCls;
                        _fuZeRen = result.gdWxLeaders;
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        })
    $('.chexiao').click(function(){
        if(_currentClick){
            var zhuangtai = parseInt(_currentClick.children('.ztz').html());
            if(zhuangtai == 2 || zhuangtai == 3 || zhuangtai == 4 || zhuangtai == 5 || zhuangtai == 6 || zhuangtai == 7){
                moTaiKuang($('#myModal1'));
            }else{
                $('#myModal3').find('.modal-body').html('无法操作');
                moTaiKuang($('#myModal3'),'flag');
            }
        }else{
            $('#myModal3').find('.modal-body').html('请选择要回退的工单!');
            moTaiKuang($('#myModal3'),'flag');
        }
    });
    $('.zuofei').click(function(){
        if(_currentClick){
            var zhuangtai = parseInt(_currentClick.children('.ztz').html());
            if(zhuangtai == 7){
                $('#myModal2').find('.modal-body').html('已完成状态工单无法进行取消操作');
                moTaiKuang($('#myModal2'),'提示','flag');
            }else if(zhuangtai == 999){
                $('#myModal2').find('.modal-body').html('该工单已取消！');
                moTaiKuang($('#myModal2'),'提示','flag');
            }else{
                moTaiKuang($('#myModal2'));
            }
        }else{
            $('#myModal2').find('.modal-body').html('请选择要报废的工单!');
            moTaiKuang($('#myModal2'),'flag');
        }
    });
    //撤销（回退）
    $('#myModal1').find('.btn-primary').click(function (){
        if(_currentChexiao){
            var gdState = parseInt(_currentClick.find('.ztz').html());
            var htState = 0;
            if(gdState == 2){
                htState = 1;
            }else if( gdState == 3 || gdState == 4 || gdState == 5 || gdState == 6 || gdState == 7){
                htState = 2;
            }
            var gdCodes = _currentClick.children('td').eq(0).children('span').attr('gdcode');
            var gdInfo = {
                "gdCode": gdCodes,
                "gdZht": htState,
                "userID": _userIdNum,
                'userName':_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDReturn',
                data:gdInfo,
                success:function(result){
                    if(result == 99){
                        _stateFlag = true;
                        if(htState == 1){
                            //删除该工单负责人
                            if(_fuZeRen.length>0){
                                manager('YWGD/ywGDDelWxLeader','flag');
                            }
                        }else if(htState == 2){
                            //删除该工单的执行人和材料
                            Worker('YWGD/ywGDDelWxR','flag');
                            //判断有无材料
                            CaiLiao('YWGD/ywGDDelWxCl','flag');
                        }
                    }else{
                        _stateFlag = false;
                        moTaiKuang($('#myModal3'),'flag');
                        $('#myModal3').find('.modal-body').html('回退失败！');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
    })
    //作废(取消)
    $('#myModal2').find('.btn-primary').click(function (){
        if(_currentChexiao){
            var gdInfo = {
                "gdCode": _gdCode,
                "userID": _userIdNum,
                "userName": _userIdName
            }
            $.ajax({
                type:'post',
                url: _urls + 'YWGD/ywGDDel',
                data:gdInfo,
                success:function(result){
                    if(result == 99){
                        conditionSelect();
                        $('#myModal3').find('.modal-body').html('工单取消成功！');
                        moTaiKuang($('#myModal3'),'flag');
                    }else{
                        $('#myModal3').find('.modal-body').html('工单取消失败！');
                        moTaiKuang($('#myModal3'),'flag');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
        $('#myModal1').modal('hide');
    })
    //修改
    $('#myModal')
    //查看图片
        .on('click','#viewImage',function(){
            if(_imgNum){
                var str = '';
                for(var i=0;i<_imgNum;i++){
                    str += '<img class="viewIMG" src="' +
                        replaceIP(_urlImg,_urls) + '?gdcode=' + _gdCode + '&no=' + i +
                        '">'
                }
                $('.showImage').html('');
                $('.showImage').append(str);
                $('.showImage').show();
            }else{
                $('.showImage').html('没有图片');
                $('.showImage').show();
            }
        })
        //图片详情
        .on('click','.viewIMG',function(){
            moTaiKuang($('#myModal4'),'图片详情','flag');
            var imgSrc = $(this).attr('src')
            $('#myModal4').find('img').attr('src',imgSrc);
        })

    /*------------------------按钮功能-----------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //判断起止时间是否为空
        //结束时间不能小于开始时间
        if( $('.min').val() > $('.max').val() ){
            $('#myModal3').find('.modal-body').html('起止时间不能大于结束时间');
            moTaiKuang($('#myModal3'),'flag');
        }else{
            conditionSelect()
        }
    })
    //重置按钮功能
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        //$('.datatimeblock').val(_initStart);
        $('.returnZero').val(0);
        $('.returnEmpty').val('');
    })
    //弹窗切换表格效果
    $('.table-title span').click(function(){
        $('.table-title span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.tableHover').hide();
        $('.tableHover').eq($(this).index()).show();
    });
    $('.confirm').click(function(){
        $('#myModal').modal('hide');
    })
    $('.modal').find('.btn-primary').click(function(){
        $(this).parents('.modal').modal('hide')
    })
    //线路车站联动
    $('#line').change(function(){
        //获得选中的线路的value
        var values = $('#line').val();
        if(values == ''){
            var str = '<option value="">请选择</option>';
            //所有车站数据
            for(var i=0;i<_allDataBM.length;i++){
                str += '<option value="' + _allDataBM[i].ddNum + '">' + _allDataBM[i].ddName + '</option>';
            }
            $('#station').empty().append(str);
        }else{
            var str = '<option value="">请选择</option>';
            for(var i=0;i<_lineArr.length;i++){
                if(values == _lineArr[i].dlNum){
                    //创建对应的车站
                    for(var j=0;j<_lineArr[i].deps.length;j++){
                        str += '<option value="' + _lineArr[i].deps[j].ddNum +
                            '">'+ _lineArr[i].deps[j].ddName + '</option>';
                    }
                }
            }
            $('#station').empty().append(str);
        }
    });
    //印象单位联动
    $('#yxdw').change(function(){
        var values = $('#yxdw').val();
        $('#userClass').empty();
        if(values == ''){
            var str = '<option value="">请选择</option>';
            for(var i=0;i<_bzArr.length;i++){
                str += '<option value="' + _bzArr[i].departNum +
                    '">' + _bzArr[i].departName + '</option>';
            }
            $('#userClass').empty().append(str);
        }else{
            var str = '<option value="">请选择</option>';
            for(var i=0;i<_InfluencingArr.length;i++){
                if(values == _InfluencingArr[i].departNum){
                    for(var j=0;j<_InfluencingArr[i].wxBanzus.length;j++){
                        str += '<option value="' + _InfluencingArr[i].wxBanzus[j].departNum +
                            '">' + _InfluencingArr[i].wxBanzus[j].departName + '</option>'
                    }
                }
            }
            $('#userClass').empty().append(str);
        }
    });
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
    /*----------------------------方法-----------------------------------------*/
    function conditionSelect(){
        if($('.gdTime').eq(0).val() == ''){
            gdrealityStart = ''
        }else{
            gdrealityStart = moment($('.gdTime').eq(0).val()).format('YYYY/MM/DD') + ' 00:00:00'
        }
        if($('.gdTime').eq(1).val() == ''){
            gdrealityEnd = ''
        }else{
            gdrealityEnd = moment($('.gdTime').eq(1).val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        }
        if($('.datatimeblock').eq(2).val() == ''){
            slrealityStart = ''
        }else{
            slrealityStart = moment($('.datatimeblock').eq(2).val()).format('YYYY/MM/DD') + ' 00:00:00';
        }
        if($('.datatimeblock').eq(3).val() == ''){
            slrealityEnd = ''
        }else{
            slrealityEnd = moment($('.datatimeblock').eq(3).val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        }
        if($('.datatimeblock').eq(4).val() == ''){
            bhrealityStart = ''
        }else{
            bhrealityStart = moment($('.datatimeblock').eq(4).val()).format('YYYY/MM/DD') + ' 00:00:00';
        }
        if($('.datatimeblock').eq(5).val() == ''){
            bhrealityEnd = ''
        }else{
            bhrealityEnd = moment($('.datatimeblock').eq(5).val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        }

        var prm2 ={
            gdCode2:$('#gdcode').val(),
            gdSt:gdrealityStart,
            gdEt:gdrealityEnd,
            gdStShoul:slrealityStart,
            gdEtShoul:slrealityEnd,
            gdGuanbiSt:bhrealityStart,
            gdGuanbiEt:bhrealityEnd,
            gdZht:$('#gdzt').val(),
            gdJJ:$('#gdlx').val(),
            dlNum:$('#line').val(),
            gdLeixing:$('#rwlx').val(),
            userID:_userIdNum,
            userName:_userIdName,
            isCalcTimeSpan:1,
            wxShiXNum:$('#xtlx').val(),
            gdCodeSrc:$('#gdly').val()
        };
        var userArr = [];
        var cheArr = [];
        if($('#yxdw').val() != '' && $('#userClass').val() == ''){
            for(var i=0;i<_InfluencingArr.length;i++){
                if( $('#yxdw').val() == _InfluencingArr[i].departNum ){
                    for(var j = 0;j<_InfluencingArr[i].wxBanzus.length;j++){
                        userArr.push(_InfluencingArr[i].wxBanzus[j].departNum);
                    }
                }
            }
            prm2.wxKeshis = userArr;
        }else if($('#yxdw').val() == '' && $('#userClass').val() == ''){
            for(var i=0;i<_InfluencingArr.length;i++){
                for(var j=0;j<_InfluencingArr[i].wxBanzus.length;j++){
                    userArr.push(_InfluencingArr[i].wxBanzus[j].departNum);
                }
            }
            //prm2.wxKeshis = userArr;
        }else{
            prm2.wxKeshi = $('#userClass').val();

        }
        if( $('#line').val() != '' && $('#station').val() == ''){
            var values = $('#line').val();
            for(var i=0;i<_lineArr.length;i++){
                if( values == _lineArr[i].dlNum ){
                    for(var j=0;j<_lineArr[i].deps.length;j++){
                        cheArr.push(_lineArr[i].deps[j].ddNum);
                    }
                }
            }
            prm2.bxKeshiNums = cheArr;
        }else if($('#line').val() == '' && $('#station').val() == ''){
            for(var i=0;i<_lineArr.length;i++){
                for(var j=0;j<_lineArr[i].deps.length;j++){
                    cheArr.push(_lineArr[i].deps[j].ddNum);
                }

            }
            prm2.bxKeshiNums = cheArr;
        }else{
            prm2.bxKeshiNum = $('#station').val();
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDGetZh2',
            data:prm2,
            async:false,
            success:function(result){
                datasTable($("#scrap-datatables"),result);
                //var aaa = currentPages;
                //for(var i=0 ;i<$('.paginate_button').length; i++){
                //    if($('.paginate_button').eq(i).html() == aaa){
                //        $('.paginate_button').eq(i).click();
                //    }
                //}
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //模态框自适应
    function moTaiKuang(who,flag){
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
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
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
    //删除执行人方法
    function Worker(url,flag){
        if(_zhixingRens.length){
            var workerArr = [];
            for(var i=0; i<_zhixingRens.length;i++){
                var obj = {};
                if(flag){
                    obj.wxrID = _zhixingRens[i].wxrID;
                }
                obj.wxRen = _zhixingRens[i].wxRen;
                obj.wxRName = _zhixingRens[i].wxRName;
                obj.wxRDh = _zhixingRens[i].wxRDh;
                obj.gdCode = _gdCode;
                workerArr.push(obj);
            }
            var gdWR = {
                gdCode :_gdCode,
                gdWxRs:workerArr,
                userID:_userIdNum,
                userName:_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + url,
                data:gdWR,
                async:false,
                success:function(result){
                    _zxrComplete = true;
                    if(result == 99){
                        _workerFlag = true;
                    }else{
                        _workerFlag = false;
                    }
                    completeFun();
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            });
        }else{
            _workerFlag = true;
            _zxrComplete = true;
            completeFun();
        }

    }
    //删除物料方法
    function CaiLiao(url,flag){
        if(_weiXiuCaiLiao.length){
            console.log(11);
            var cailiaoArr = [];
            for(var i=0;i<_weiXiuCaiLiao.length;i++){
                var obj = {};
                if(flag){
                    obj.wxClID = _weiXiuCaiLiao[i].wxClID
                }
                obj.wxCl = _weiXiuCaiLiao[i].wxCl;
                obj.wxClName = _weiXiuCaiLiao[i].wxClName;
                obj.clShul = _weiXiuCaiLiao[i].clShul;
                obj.gdCode = _gdCode;
                cailiaoArr.push(obj);
            }
            var gdWxCl = {
                gdCode:_gdCode,
                gdWxCls:cailiaoArr,
                userID:_userIdNum,
                userName:_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + url,
                data:gdWxCl,
                async:false,
                success:function(result){
                    _wlComplete = true;
                    if(result == 99){
                        _WLFlag = true;
                    }else{
                        _WLFlag = false;
                    }
                    completeFun();
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }else{
            _wlComplete = true;
            _WLFlag = true;
            completeFun();
        }

    }
    //删除责任人
    function manager(url,flag){
        var fzrArrr = [];
        for(var i=0;i<_fuZeRen.length;i++){
            var obj = {};
            if(flag){
                obj.wxrID = _fuZeRen[i].wxrID;
            }
            obj.wxRen = _fuZeRen[i].wxRen;
            obj.wxRName = _fuZeRen[i].wxRName;
            obj.wxRDh = _fuZeRen[i].wxRDh;
            obj.gdCode = _gdCode;
            fzrArrr.push(obj);
        }
        var gdWR = {
            gdCode:_gdCode,
            gdWxRs:fzrArrr,
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + url,
            data:gdWR,
            async:false,
            success:function(result){
                if(result == 99){
                    _leaderFlag = true;
                }else{
                    _leaderFlag = false;
                }
                if( _stateFlag && _leaderFlag ){
                    $('#myModal1').modal('hide');
                    moTaiKuang($('#myModal3'),'flag');
                    $('#myModal3').find('.modal-body').html('回退成功！');
                    conditionSelect();
                }else{
                    var str = '';
                    if( _leaderFlag == false ){
                        str += '工长删除失败，'
                    }else{
                        str += '工长删除成功，'
                    }
                    if( _stateFlag == false ){
                        str += '退回失败！'
                    }else{
                        str += '退回成功！'
                    }
                    moTaiKuang($('#myModal3'),'flag');
                    $('#myModal3').find('.modal-body').html(str);
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //IP替换
    function replaceIP(str,str1){
        var ip = /http:\/\/\S+?\//;  /*http:\/\/\S+?\/转义*/
        var res = ip.exec(str1);  /**/
        str = str.replace(ip,res);
        return str;
    }
    //ajaxFun（设备类型select的值,flag传自己的flag变量）
    function ajaxFun(url, allArr, select, text, num,flag) {
        var prm = {
            'userID': _userIdNum,
            'userName':_userIdName
        }
        prm[text] = '';
        $.ajax({
            type: 'post',
            url: _urls + url,
            data: prm,
            success: function (result) {
                //给select赋值
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < result.length; i++) {
                    str += '<option' + ' value="' + result[i][num] + '">' + result[i][text] + '</option>'
                    allArr.push(result[i]);
                }
                select.empty().append(str);
                if(url == 'YWDev/ywDMGetDSs'){
                    _isSystemLoaded = true;
                }else{
                    _isStationLoaded = true;
                }
                firstLoadData();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }
    //线路数据
    function lineRouteData(el) {
        var prm = {
            'userID':_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetDLines',
            data:prm,
            success:function(result){
                _lineArr = [];
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    _lineArr.push(result[i]);
                    str += '<option value="' + result[i].dlNum +
                        '">' + result[i].dlName +'</option>'
                }
                el.append(str);
                _isLineLoaded = true;
                firstLoadData();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }
    //获取到影响单位、用户分类
    function InfluencingUnit(){
        var prm = {
            "id": 0,
            "ddNum": "",
            "ddName": "",
            "ddPy": "",
            "daNum": "",
            "userID": _userIdNum,
            "userName": _userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetWxBanzuStation',
            data:prm,
            success:function(result){
                _InfluencingArr.length = 0;
                _bzArr.length = 0;
                for(var i=0;i<result.stations.length;i++){
                    _InfluencingArr.push(result.stations[i]);
                }
                for(var i=0;i<result.wxBanzus.length;i++){
                    _bzArr.push(result.wxBanzus[i]);
                }
                var str = '<option value="">请选择</option>';
                var str1 = '<option value="">请选择</option>';
                    //首先判断是在车间还是维保组里(如果是在维保组里，加载该维保组的维修班组，如果是在维修班组里，直接发送维修班组即可)
                    var stationsFlag = false;
                    var wxBanzusFlag = false;
                    for(var i=0;i<result.stations.length;i++){
                        if(sessionStorage.userDepartNum == result.stations[i].departNum){
                            stationsFlag = true;
                            break;
                        }else{
                            stationsFlag = false;
                        }
                    }
                    for(var i=0;i<result.wxBanzus.length;i++){
                        if(sessionStorage.userDepartNum == result.wxBanzus[i].departNum){
                            wxBanzusFlag = true;
                            break;
                        }else{
                            wxBanzusFlag = false;
                        }
                    }
                    if(stationsFlag) {
                        for (var i = 0; i < result.stations.length; i++) {
                            if(sessionStorage.userDepartNum == result.stations[i].departNum){
                                str = '<option value="' + result.stations[i].departNum +
                                    '">' + result.stations[i].departName + '</option>';
                                for (var j = 0; j < result.stations[i].wxBanzus.length; j++) {
                                    str1 += '<option value="' + result.stations[i].wxBanzus[j].departNum +
                                        '">' + result.stations[i].wxBanzus[j].departName + '</option>';
                                }
                            }
                        }

                    }else if(wxBanzusFlag){

                        str1 = '<option value="' + result.wxBanzus[i].departNum +
                            '">' + result.wxBanzus[i].departName + '</option>';
                        for(var i=0;i<result.stations.length;i++){
                            for(var j=0;j<result.stations[i].wxBanzus.length;j++){
                                if(sessionStorage.userDepartNum == result.stations[i].wxBanzus[j].departNum){
                                    str = '<option value="' + result.stations[i].departNum +
                                        '">' + result.stations[i].departName + '</option>';
                                }
                            }
                        }
                    } else{
                        //所属车间
                        for(var i=0;i<result.stations.length;i++){
                            str += '<option value="' + result.stations[i].departNum +
                                '">' + result.stations[i].departName + '</option>';
                        }
                        //所属班组
                        for(var i=0;i<result.wxBanzus.length;i++){
                            str1 += '<option value="' + result.wxBanzus[i].departNum +
                                '">' + result.wxBanzus[i].departName + '</option>';
                        }
                    }
                    $('#yxdw').empty().append(str);
                    $('#userClass').empty().append(str1);
                    _isDepartLoaded = true;
                    firstLoadData();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取日志信息（备件logType始终传2）
    function logInformation(logType){
        var gdLogQPrm = {
            "gdCode": _gdCode,
            "logType": logType,
            "userID": _userIdNum,
            "userName": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywDGGetLog',
            data:gdLogQPrm,
            success:function(result){
                if(logType == 2){
                    var str = '';
                    for(var i =0;i<result.length;i++){
                        str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                    }
                    $('.deal-with-list').empty();
                    $('.deal-with-list').append(str);
                }else if(logType == 1){
                    var str = '';
                    for(var i=0;i<result.length;i++){
                        str += '<li><span class="list-dot"> </span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;' + result[i].logTitle + '</li>';
                    }
                    $('.processing-record ul').empty();
                    $('.processing-record ul').append(str);
                }else{
                    var str = '';
                    for(var i =0;i<result.length;i++){
                        str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                    }
                    $('.processing-record ul').empty();
                    $('.processing-record ul').append(str);
                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //页面收入默认载入数据
    function firstLoadData(){
        if(_isDepartLoaded && _isLineLoaded && _isStationLoaded && _isSystemLoaded){
            conditionSelect();
        }
    }

    //执行人物料方法完毕执行
    function completeFun(){
        if(_zxrComplete && _wlComplete){
            if( _workerFlag && _WLFlag && _stateFlag ){
                $('#myModal1').modal('hide');
                moTaiKuang($('#myModal3'),'flag');
                $('#myModal3').find('.modal-body').html('回退成功！');
                conditionSelect();
            }else{
                var str = '';
                if( _workerFlag == false ){
                    str += '执行人删除失败，'
                }else{
                    str += '执行人删除成功，'
                }
                if( _WLFlag == false ){
                    str += '物料删除失败，'
                }else{
                    str += '物料删除成功，'
                }
                if( _stateFlag == false ){
                    str += '退回失败，'
                }else{
                    str += '退回成功，'
                }
                moTaiKuang($('#myModal3'),'flag');
                $('#myModal3').find('.modal-body').html(str);
            }
        }
    }
})