$(function(){
    /*--------------------------------全局变量---------------------------------*/

    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });

    //获得用户id
    var _userIdNum = sessionStorage.getItem('userName');

    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');

    //获取角色权限
    var  _userRole = sessionStorage.getItem("userRole");

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //设置初始时间
     var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');

    var _initEnd = moment().format('YYYY/MM/DD');

    //显示时间
    $('.min').val(_initStart);

    $('.max').val(_initEnd);

    //出库产品index上下键
    var _numIndex = -1;

    var _num = -1;

    //记录品质选项的上下键index
    var _pzNum = -1;

    //工单查询时间
    //查询工单号的时间
    var gdTimeST = moment().subtract(30,'d').format('YYYY/MM/DD');

    var gdTimeET = moment().format('YYYY/MM/DD');

    $('.gdTime').eq(0).val(gdTimeST);

    $('.gdTime').eq(1).val(gdTimeET);

    var gdrealityEnd = moment($('.gdTime').eq(1).val()).add(1,'d').format('YYYY/MM/DD') + '00:00:00';

    var gdrealityStart = moment($('.gdTime').eq(0).val()).format('YYYY/MM/DD') + '00:00:00';

    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    })

    //新增入库单的vue对象
    var myApp33 = new Vue({
        el:'#myApp33',
        data:{
            'bianhao':'',
            'rkleixing':'',
            'zhidanren':'',
            'remarks':'',
            'shijian':'',
            //'ckselect':'',
            //'gdCode':'',
            'clymc':'',
            'clydh':'',
            shRemarks:'',
            //chezhan:''
        },
       methods:{

       }
    });

    //新增入库产品的vue对象
    var workDone = new Vue({
        'el':'#workDone',
        'data':{
            'goodsId':'',
            'bianhao':'',
            'mingcheng':'',
            'size':'',
            'picked':'',
            'quality':'',
            'warranty':'',
            'num':0,
            'outPrice':'',
            'amount':'',
            'gdCode':'',
            'chezhan':'',
            'unit':'',
            'remark':'',
            'redundant':0,
            'ck':'',
            'kuwei':''
        },
        methods:{
            addFun1:function(){
                var mny = /^[0-9]*[1-9][0-9]*$/;
                //首先确定数量填写了
                if(workDone.num != ''){
                    //判断是否符合正则（正整数）;
                    if(mny.test(workDone.num)){
                        $('.format-error').hide();
                        if(parseInt(workDone.num)>parseInt(workDone.redundant)){
                            $('.format-error2').show();
                        }else{
                            $('.format-error2').hide();
                        }
                        if(workDone.picked == 1 && workDone.num != 1){
                            $('.format-error4').show();
                        }else{
                            $('.format-error4').hide();
                        }
                    }else{
                        $('.format-error').show();
                    }
                }else{
                    $('.format-error').hide();
                    $('.format-error2').hide();
                }
                var amount = Number(workDone.outPrice) * Number(workDone.num);
                workDone.amount = amount.toFixed(2);
            },
            addFun2:function(){
                var mny = /^((?:-?0)|(?:-?[1-9]\d*))(?:\.\d{1,2})?$/;
                if(workDone.outPrice != ''){

                    if(mny.test(workDone.outPrice)){
                        $('.format-error1').hide();
                    }else{
                        $('.format-error1').show();
                    }
                }else{
                    $('.format-error1').hide();
                }
                var amount = Number(workDone.outPrice) * Number(workDone.num);

                workDone.amount = amount.toFixed(2);
            },
            addFun3:function(){
                var mny = /^([1-9][0-9]*(\.[0-9]{1,2})?|0\.(?!0+$)[0-9]{1,4})$/;
                if(mny.test(workDone.amount)){
                    $('.format-error3').hide();
                    //根据总金额得出单价
                    var danjia =  Number(workDone.amount)/Number(workDone.num);
                    workDone.outPrice = danjia.toFixed(2);
                }else{
                    $('.format-error3').show();
                }
            },
            addFun4:function(){
                var outPrince = Number(workDone.outPrice);
                workDone.outPrice = parseFloat(outPrince).toFixed(2);
            },
            addFun5:function(){
                var outPrince = workDone.amount;
                workDone.amount = parseFloat(outPrince).toFixed(2);
            },
            focusSn:function(e){
                ////序列号选择（首先获得名称和编码，将名称和编码相同的都放在index2里）
                var bm = $.trim(workDone.bianhao);
                var mc = $.trim(workDone.mingcheng);
                var str = '';
                for(var i=0;i<_wpListArr.length;i++){
                    if(bm == _wpListArr[i].itemNum && mc == _wpListArr[i].itemName){
                        var isSpareStr = '';
                        if(_wpListArr[i].isSpare == 0){
                            isSpareStr = '消耗品';
                        }else if(_wpListArr[i].isSpare == 1){
                            isSpareStr = '耐用品';
                        }
                        var snStr = '';
                        if(_wpListArr[i].sn == ''){
                            snStr = ' ';
                        }else{
                            snStr = _wpListArr[i].sn;
                        }
                        str += '<li data-size="' + _wpListArr[i].size +
                            '"data-unit="' + _wpListArr[i].unitName + '"data-quality="' + _wpListArr[i].batchNum +
                            '"data-warranty="' + _wpListArr[i].maintainDate +'"'+
                            '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + _wpListArr[i].isSpare +
                            '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + _wpListArr[i].num + '</span>' +
                            '<span class="dataStorageName" style="margin-left: 10px;">' + _wpListArr[i].storageName +
                            '</span>' +'</li>';
                    }
                }
                $('.accord-with-list').eq(2).empty().append(str);
            },
            keySn:function(e){
                var value = $.trim(workDone.goodsId);
                keySelect(value,2,'flag');
            },
            searchbm:function(e){
                var value = $.trim(workDone.bianhao);
                keySelect(value,0)
            },
            searchmc:function(e){
                var value = $.trim(workDone.mingcheng);
                keySelect(value,1)
            },
            radios:function(){
                $('.inpus').click(function(){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            },
            selectKQ:function(){

                upDown($('#workDone').find('.kuqu-list').eq(0),enterKQ,inputKQ);
            },
            focusFun:function(){
                _pzNum =-1;
                $('.pinzhixx').show();
            },
            selectFun:function(e){
                var e = e || window.event;
                var lis = $('.pinzhixx').children('div');
                if(e.keyCode == 40){
                    //向下
                    if(_pzNum<lis.length-1){
                        _pzNum++;
                    }else{
                        _pzNum = lis.length-1;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_pzNum).addClass('li-color');
                    //滚动条
                    //首先获取ul的高度
                    var ulHeight = $('.pinzhixx').eq(0).height();
                    var num = parseInt(ulHeight/30)-2;
                    //判断放了几个ul
                    if(_pzNum > num){
                        var height = (_pzNum - num) * 30;
                        $('.pinzhixx').eq(0).scrollTop(height);
                    }
                }else if(e.keyCode == 38){
                    //向上
                    if(_pzNum>0){
                        _pzNum--;
                    }else{
                        _pzNum = 0;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_pzNum).addClass('li-color');
                    //滚动条
                    //首先获取ul的高度
                    var ulHeight = $('.pinzhixx').eq(0).height();
                    var num = parseInt(ulHeight/30)-2;
                    if(_pzNum < lis.length -num){
                        var height = (_pzNum-num) * 30;
                        $('.pinzhixx').eq(0).scrollTop(height);
                    }
                }else if(e.keyCode == 13){
                    //回车
                    workDone.chezhan = $('.pinzhixx').children('.li-color').html();
                    var pzNum = $('.pinzhixx').children('.li-color').attr('data-value');
                    $('#chezhan').attr('data-pzNum',pzNum);
                }
            },
            selectGD:function(){
                keyGDCK($.trim(workDone.gdCode),1);
            },
            selectCK:function(){
                //keyGDCK($.trim(workDone.ck),0,'flag');
                upDown($('#workDone').find('.pinzhixx').eq(0),enterCK,inputCK);
            },
            kuweiFun:function(e){
                var e = e || window.event;
                //区分上下回车键
                if(e.keyCode == 40){
                    //按下键的时候，
                    //获得所有li
                    var lis = $('.kuqu-list').eq(0).children('li');
                    if(_num<lis.length-1){
                        _num ++;
                    }else{
                        _num = lis.length-1;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_num).addClass('li-color');
                    //首先获取ul的高度
                    var ulHeight = $('.kuqu-list').eq(0).height();
                    var num = parseInt(ulHeight/30);
                    //判断放了几个ul
                    if(_num > num){
                        var height = (_num - num) * 30;
                        $('.kuqu-list').eq(0).scrollTop(height);
                    }
                }else if(e.keyCode == 38){
                    var lis = $('.kuqu-list').eq(0).children('li');
                    if(_num<1){
                        _num =0;
                    }else{
                        _num--;
                    }
                    lis.removeClass('li-color');
                    lis.eq(_num).addClass('li-color');
                    //首先获取ul的高度
                    var ulHeight = $('.accord-with-list').eq(index).height();
                    var num = parseInt(ulHeight/30);
                    if(_num < lis.length -num){
                        var height = (_num-num) * 30;
                        $('.accord-with-list').eq(index).scrollTop(height);
                    }
                }else if(e.keyCode == 13){
                    //选中
                    var lis = $('.kuqu-list').children('li');
                    for(var i=0;i<lis.length;i++){
                        if(lis.eq(i).attr('class') == 'li-color'){
                            workDone.kuwei = lis.eq(i).html();
                            $('.kuwei').attr('data-num',lis.eq(i).attr('data-num'));
                        }
                    }
                    $('.kuqu-list').hide();
                    //根据库区，筛选物料
                    var arr = [];
                    var str = '';
                    for(var i=0;i<_wpListArr.length;i++){
                        if($('.cangku').attr('data-num') == _wpListArr[i].storageNum && $('.kuwei').attr('data-num') == _wpListArr[i].localNum){
                            arr.push(_wpListArr[i]);
                            str += '<li data-durable="' + _wpListArr[i].isSpare +
                                '"' + 'data-unit="' + _wpListArr[i].unitName +
                                '"data-quality="' + _wpListArr[i].batchNum +
                                '"data-maintainDate="' +  _wpListArr[i].maintainDate +
                                '"' + 'data-sn="' + _wpListArr[i].sn +
                                '"' + 'data-shengyu="' + _wpListArr[i].num +
                                '"' +
                                '>' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                                '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span>' +
                                '<span class="dataSize" style="margin-left: 20px;">' +
                                _wpListArr[i].size+'</span>' + '<span style="margin-left: 20px;">' + _wpListArr[i].localName +
                                '</span>' +
                                '</li>';
                        }
                    }
                    $('.accord-with-list').eq(0).empty().append(str);
                    $('.accord-with-list').eq(1).empty().append(str);
                }else{
                    if(e.keyCode != 9){
                        //比较
                        _num = -1;
                        var searchValue = $.trim($('.kuwei').val());
                        var includeArr = [];
                        var str = '';
                        for(var i=0;i<_kuquArr.length;i++){

                            if( _kuquArr[i].localName == searchValue ){
                                $('.kuwei').attr('data-num',_kuquArr[i].localNum);
                                //加载物品编号和物品名称列表

                            }else{
                                if(_kuquArr[i].localName.indexOf(searchValue)>=0 || _kuquArr[i].localNum.indexOf(searchValue)>=0){
                                    includeArr.push(_kuquArr[i]);
                                    str += '<li data-num="' + _kuquArr[i].localNum + '">' + _kuquArr[i].localName + '</li>'
                                }
                            }
                        }
                        $('.kuqu-list').empty().append(str);
                        if(includeArr.length>0){
                            $('.kuqu-list').show();
                        }
                    }
                }
            },
        }
    });

    //出库
    var chukuObject = new Vue({
        el:'#chukuObject',
        data:{
            ck:'',
            bianhao:'',
            mingcheng:'',
            size:'',
            picked:'',
            goodsId:'',
            unit:'',
            quality:'',
            warranty:'',
            shengyu:'',
            num:'',
            outPrice:'',
            amount:'',
            gdCode:'',
            chezhan:'',
            remark:'',
            cangkuNum:''
        }
    })

    //存放入库产品的数组
    var _rukuArr = [];

    //存放当前条件下的所有数据
    var _allData = [];

    //存放删除入库单
    var _$thisRemoveRowDa = '';

    //存放入库单当前删除行的坐标
    var _$thisRemoveRowXiao = '';

    //存放物品列表
    var _wpListArr = [];

    //过滤后的物品列表
    var _filterWPList = [];

    //当前选中的一条物品列表
    var _wpObject = {};

    //var _$thisWP = '';

    //出库类型
    rkLX();
    rkLX('flag');

    //存放所有车站
    var _chezhanArr = [];

    //车站
    chezhan();

    //所有工单列表的数组
    var _gdArr = [];

    //所有工单列表
    GDselect(5);

    //所有仓库的数据
    var _ckArr = [];

    //出库单号
    var _$thisRKnum = '';

    //登记成功
    var _AddFlag = false;

    //备件状态
    var _BjFlag = false;

    //审核标志
    var _examineRen = false;

    //根据仓库，获得对应的库区
    var _kuquArr = [];

    //所有库区
    var _kqArr = [];

    //所有库区
    //reservoir();

    //登记完成
    var _addComplete = false;

    //备件申请完成
    var _bjComplete = false;

    //是否可以自己审核
    var _isShenHe = sessionStorage.getItem('ckAuditType');

    //所有车站
    var _allDataBM = [];

    //所有车站数据
    ajaxFun('YWDev/ywDMGetDDs', _allDataBM,$('#station'), 'ddName', 'ddNum');

    //暂存选中的数组
    var _tempRKArr = [];

    //暂存选中的数组（用于编辑，删除）
    var _tempObj = [];
    /*-------------------------------------表格初始化------------------------------*/
    var buttonVisible = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs'
        }
    ];

    var buttonHidden = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs hiddenButton'
        }
    ];

    var col = [
        {
            title:'出库单号',
            data:'orderNum',
            className:'orderNum',
            render:function(data, type, row, meta){
                return '<a href="outboundOrder.html?orderNum=' + row.orderNum +
                    '" target="_blank">' + row.orderNum + '</a>'
            }
        },
        {
            title:'出库类型',
            data:'outType',
            render:function(data, type, full, meta){
                if(data == 9){
                    return '其他'
                }if(data == 1){
                    return '领用出库'
                }if(data == 2){
                    return '借货出库'
                }if(data == 3){
                    return '借用还出'
                }
            },
            className:'outType'

        },
        {
            title:'材料员名称',
            data:'cusName'
        },
        {
            title:'材料员电话',
            data:'phone'
        },
        {
            title:'创建时间',
            data:'createTime'
        },
        {
            title:'审核时间',
            data:'auditTime'
        },
        {
            title:'制单人',
            data:'createUserName'
        },
        {
            title:'备注',
            data:'remark'
        },
        {
            title:'操作',
            data:'status',
            render:function(data, type, full, meta){
                if(data == 1){
                    return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                        "<span class='data-option option-confirmed btn default btn-xs green-stripe'>已审核</span>" +
                        "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
                }if(data == 0){
                    return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                        "<span class='data-option option-confirm btn default btn-xs green-stripe'>待审核</span>" +
                        "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
                }
            }

        }
    ];

    tableInit($('.main-contents-table .table'),col,buttonVisible,'flag');

    $.fn.dataTable.ext.errMode = function (s, h, m) {
        console.log('')
    };

    //加载页面的时候，隐藏其他两个导出按钮
    for( var i=1;i<$('.excelButton').children().length;i++ ){
        $('.excelButton').children().eq(i).addClass('hidding');
    };

    //新增弹框内的表格
    var col2 = [
        {
            title:'物品编号',
            data:'itemNum',
            className:'bianma'
        },
        {
            title:'物品名称',
            data:'itemName'
        },
        {
            title:'物品序列号',
            data:'sn',
            className:'sn'
        },
        {
            title:'规格型号',
            data:'size'
        },
        {
            title:'仓库',
            data:'storageName',
            className:'storageName',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.storageNum +
                    '">' + data + '</span>'

            }
        },
        {
            title:'库区',
            data:'localName',
            className:'localName',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.localNum +
                    '">' + data + '</span>'

            }
        },
        {
            title:'单位',
            data:'unitName'
        },
        {
            title:'数量',
            data:'num',
            className:'right-justify'
        },
        {
            title:'出库单价',
            data:'outPrice',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = parseFloat(data).toFixed(2)
                return data
            }
        },
        {
            title:'总金额',
            data:'amount',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = parseFloat(data).toFixed(2)
                return data
            }
        },
        {
            title:'品质',
            data:'batchNum'
        },
        {
            title:'备注',
            data:'outMemo'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-bianji btn default btn-xs green-stripe' data-flag=1>编辑</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"

        }
    ];

    tableInit($('#wuPinListTable1'),col2,buttonHidden);

    //查看详情的表格
    var col3 = [
        {
            title:'仓库',
            data:'storageName',
            className:'storageName',
            render:function(data, type, row, meta){

                return '<span data-num="' + row.storageNum +
                    '">' + data + '</span>'

            }
        },
        {
            title:'库区',
            data:'localName',
            className:'localName',
            render:function(data, type, row, meta){
                return '<span data-num="' + row.localNum +
                    '">'+ data + '</span>'
            }
        },
        {
            title:'物品编号',
            data:'itemNum',
            className:'bianma'
        },
        {
            title:'物品名称',
            data:'itemName'
        },
        {
            title:'物品序列号',
            data:'sn',
            className:'sn'
        },
        {
            title:'规格型号',
            data:'size'
        },
        {
            title:'单位',
            data:'unitName'
        },
        {
            title:'数量',
            data:'num',
            className:'right-justify'
        },
        {
            title:'出库单价',
            data:'outPrice',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = parseFloat(data).toFixed(2)
                return data
            }
        },
        {
            title:'总金额',
            data:'amount',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = parseFloat(data).toFixed(2)
                return data
            }
        },
        {
            title:'品质',
            data:'batchNum'
        },
        {
            title:'备注',
            data:'outMemo'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){
                var html = "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>";
               if(full.gdCode2 != ''){
                   html +=   "<span class='data-option option-materials btn default btn-xs green-stripe'><a href='materialOdd.html?gdCode=" + full.gdCode2 +
                       "&orderNum=" + full.orderNum +
                       "&itemNum=" + full.itemNum +
                       "&storageNum=" + full.storageNum +
                       "&sn=" + full.sn +
                       "' target=_blank>用料单</a></span>"
               }
                return html;
            }
            //"defaultContent": "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span><span class='data-option option-materials btn default btn-xs green-stripe'>用料单</span>"

        }
    ];

    tableInit($('#personTable1'),col3,buttonHidden,'','',drawFn);

    function drawFn(){
        var amount = 0;
        var tds = $('#personTable1').find('tbody').children('tr').length;
        //console.log(tds);
        for(var i=0;i<tds;i++){
            //获取金额
            var count = parseFloat($('#personTable1').find('tbody').children('tr').eq(i).find('td').eq(9).html());

            amount += count;
        }
        //console.log(amount);
        if(isNaN(amount.toFixed(2))){
            $('#personTable1 .count').html(0.00);
        }else{
            $('#personTable1 .count').html(amount.toFixed(2));
        }

    };

    //选择出库材料表格
    var col4 = [
        {
            title:'序列号',
            data:'sn',
            className:'xuliehao'
        },
        {
            title:'物品编码',
            className:'bianma',
            data:'itemNum'
        },
        {
            title:'物品名称',
            className:'mingcheng',
            data:'itemName'
        },
        {
            title:'仓库编码',
            data:'storageNum',
            className:'cangkuNum hiddenButton'
        },
        {
            title:'仓库',
            data:'storageName',
            className:'cangku'
        },
        {
            title:'库区编码',
            data:'localNum',
            className:'localNum hiddenButton'
        },
        {
            title:'库区名称',
            data:'localName',
            className:'localName'
        },
        {
            title:'是否耐用',
            data:'isSpare',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '否'
                }if(data == 1){
                    return '是'
                }
            },
            className:'isSpare'
        },
        {
            title:'规格型号',
            data:'size',
            className:'size'
        },
        {
            title:'分类名称',
            data:'cateName'
        },
        {
            title:'剩余数量',
            data:'num',
            className:'num'
        },
        {
            title:'单价',
            data:'',
            render:function(data, type, full, meta){

                var aa = Number(full.amount) / Number(full.num)

                return aa.toFixed(2)
            }
        }
    ];

    tableInit($('#wuPinListTable'),col4,buttonHidden);

    //wlList();

    //备件表格
    $('#table-spare').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        bLengthChange:false,
        "iDisplayLength":50,//默认每页显示的条数
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
        'dom':'B<"clear">lfrtip',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs btn btn-success hidding'
            }
        ],
        "columns": [
            {
                title:'备件编码',
                //data:''
            },
            {
                title:'备件名称',
                //data:''
            },
            {
                title:'数量',
                //data:''
            },
            {
                title:'库存',
                //data:''
            }

        ],
    });

    //工单表格
    var gdCol = [
        {
            className:'checkeds',
            data:null,
            defaultContent:"<div class='checker'><span class=''><input type='checkbox'></span></div>"
        },
        {
            title:'工单号',
            data:'gdCode2',
            className:'gdCodes',
            render:function(data, type, full, meta){
                return '<span data-gdCode="' + full.gdCode +
                    '" data-czCode="' + full.bxKeshiNum +
                    '">'+ data + '</span>'
            }
        },
        {
            title:'工单状态',
            data:'gdZht',
            render:function(data, type, full, meta){
                if (data == 1) {
                    return '待下发'
                }
                if (data == 2) {
                    return '待分派'
                }
                if (data == 3) {
                    return '待执行'
                }
                if (data == 4) {
                    return '执行中'
                }
                if (data == 5) {
                    return '等待资源'
                }
                if (data == 6) {
                    return '待关单'
                }
                if (data == 7) {
                    return '任务关闭'
                }
                if (data == 999) {
                    return '任务取消'
                }
            }
        },
        {
            title:'督察督办责任人',
            data:'wxUserNames'
        },
        {
            title:'维修系统',
            data:'wxShiX'
        },
        {
            title:'所需备件',
            data:'wxClNames'
        },
        {
            title:'车站',
            data:'bxKeshi',
            className:'bxKS'
        }
    ];

    tableInit($('#gdTable'),gdCol,buttonHidden);

    //查看备件按钮
    $('.see-spare').click(function(){
        $('.spare-part').show();
    })

    //关闭
    $('.spare-close').click(function(){
        $('.spare-part').hide();
    });

    /*-------------------------------------按钮事件-------------------------------*/
    //状态选项卡
    $('.table-title').children('span').click(function(){
        $('.table-title').children('span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.main-contents-table').addClass('hide-block');
        $('.main-contents-table').eq($(this).index()).removeClass('hide-block');
        //导出按钮显示
        for( var i=0;i<$('.excelButton').children().length;i++ ){
            $('.excelButton').children().eq(i).addClass('hidding');
        };
        $('.excelButton').children().eq($(this).index()).removeClass('hidding');
    });

    //查询按钮
    $('#selected').click(function(){
        //时间验证
        if( $('.min').val() == '' || $('.max').val() == '' ){
            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'起止时间不能为空!', '');
        }else{
            if( $('.min').val() > $('.max').val() ){
                _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'起止时间不能大于结束时间!', '');
            }else{
                conditionSelect();
            }
        }
    })

    //重置按钮
    //点击重置按钮的时候，所有input框清空，时间还原成今天的
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    })

    //新增按钮(出现模态框)
    $('.creatButton').on('click',function(){

        //审核备注不显示
        $('.shRemarks').hide();

        //所有输入框不可操作；
        $('#myApp33').find('input').removeAttr('readonly').removeClass('disabled-block');
        $('#myApp33').find('input').parent('.input-blockeds').removeClass('disabled-block');
        $('#myApp33').find('select').removeAttr('readonly').removeClass('disabled-block');
        $('#myApp33').find('textarea').removeAttr('readonly');

        //出库单编码、制单人、制单时间不可编辑
        $('.automatic').attr('readonly','readonly').addClass('disabled-block');
        //新增物品按钮隐藏
        $('.zhiXingRenYuanButton').html('新增物品').show();
        //入库产品删除按钮不可操作
        $('#personTable1 tbody').find('.option-shanchu').attr('disabled',false);

        //新增按钮置为不可操作
        $('.tableHovers').children('.condition-query').show();
        _moTaiKuang($('#myModal'), '新增', '', '' ,'', '保存');

        //动态添加类名dengji删除bianji类
        $('#myModal').find('.confirm').removeClass('bianji').removeClass('shenhe').addClass('dengji');

        //初始化登记框
        var arr = [];

        RKDInit(arr);

        RKCPInit(arr);

        _rukuArr.length = 0;
    })

    //新增确认按钮
    $('#myModal').on('click','.dengji',function(){
        //先判断 必填项
        if(myApp33.rkleixing == ''){
            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项!', '');
        }else{
            var outStoreDetails1 = [];
            //工单的信息
            var gdArr = [];
            //材料工单
            var clArr = [];
            for(var i=0;i<_rukuArr.length;i++){
                var obj = {};
                obj.sn = _rukuArr[i].sn;
                obj.itemNum = _rukuArr[i].itemNum;
                obj.itemName = _rukuArr[i].itemName;
                obj.size = _rukuArr[i].size;
                obj.unitName = _rukuArr[i].unitName;
                obj.num = _rukuArr[i].num;
                obj.outPrice = _rukuArr[i].outPrice;
                obj.amount = _rukuArr[i].amount;
                obj.gdCode2 = _rukuArr[i].gdCode2;
                obj.bxKeshi = _rukuArr[i].bxKeshi;
                obj.bxKeshiNum = _rukuArr[i].bxKeshiNum;
                obj.outMemo = _rukuArr[i].outMemo;
                obj.userID=_userIdNum;
                obj.userName = _userIdName;
                obj.storageName = _rukuArr[i].storageName;
                obj.storageNum = _rukuArr[i].storageNum;
                obj.batchNum = _rukuArr[i].batchNum;
                obj.localNum = _rukuArr[i].localNum;
                obj.localName = _rukuArr[i].localName;
                outStoreDetails1.push(obj);
                //备件转换
                if(_rukuArr[i].gdCode){
                    gdArr.push(_rukuArr[i].gdCode);
                    clArr.push(_rukuArr[i].itemName);
                }
            }

            //获取填写的入库信息
            var ckName = '';
            if($('#ckselect').val() == ''){
                ckName = ''
            }else{
                ckName = $('#ckselect').children('option:selected').html();
            }
            var prm = {
                'outType':myApp33.rkleixing,
                'remark':myApp33.remarks,
                'outStoreDetails':outStoreDetails1,
                'userID':_userIdNum,
                'userName':_userIdName,
                'b_UserRole':_userRole,
                'storageName':ckName,
                'storageNum':$('#ckselect').val(),
                'contractOrder':myApp33.gdCode,
                'cusName':myApp33.clymc,
                'phone':myApp33.clydh
            }
            $.ajax({
                type:'post',
                url: _urls + 'YWCK/ywCKAddOutStorage',
                data:prm,
                success:function(result){
                    _addComplete = true;
                    if(result == 99){
                        _AddFlag = true;
                        //更改工单中备件状态；
                        applySparePart(gdArr,clArr);
                    }else{
                        _AddFlag = false;
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }
    });

    //新增产品按钮(出现模态框)
    $('.zhiXingRenYuanButton').on('click',function(){

        //产品登记框清空；
        RKCPInit(_rukuArr);

        //模态框显示
        _moTaiKuang($('#myModal1'), '出库物品管理', '', '' ,'', '确定');

        //新增物品
        wlList(false);

        //将_rukuArr付给_tempRuKuArr

        _tempRKArr.length = 0;

        for(var i=0;i<_rukuArr.length;i++){

            _tempRKArr.push(_rukuArr[i]);

        }


        ////所有列表应该重新初始化（所有值）
        ////初始化长裤列表(仓库、库区、物品、工单号)；
        //ckList(_ckArr,$('.pinzhixx').eq(0));
        ////库区列表
        //kqList(_kqArr,$('.kuqu-list').eq(0));
        ////物品编码列表
        //wpList(_wpListArr,$('.accord-with-list').eq(0));
        ////物品名称列表
        //wpList(_wpListArr,$('.accord-with-list').eq(1));
        ////序列号
        //xlhList(_wpListArr,$('.accord-with-list').eq(2));
        ////工单号
        ////gdsList(_gdArr,$('#workDone').find('.pinzhixx').eq(1));
        ////编辑的时候，编码和名称，条形码不能修改。
        //$('.accord-with-list').hide();
        //$('.not-editable').removeAttr('readonly').removeClass('disabled-block');
        //$('.not-editable').parents('.input-blockeds').removeClass('disabled-block');
        //
        ////首先要获得原本的物品
        //$('#myModal1').on('shown.bs.modal', function () {
        //    //让日历插件首先失去焦点
        //    $('.warranty').focus();
        //    if($('.datepicker:visible')){
        //        $('.datepicker').hide();
        //    }
        //    //自动聚焦
        //    $('.not-editable').eq(0).focus();
        //})
    })

    //增加入库单操作(仅仅是全端静态操作，没有涉及数据库)
    $('#myModal1').on('click','.ruku',function(){

        $('#myModal1').modal('hide');

        _rukuArr.length = 0;

        for(var i=0;i<_tempRKArr.length;i++){

            _rukuArr.push(_tempRKArr[i]);

        }

        datasTable($('#personTable1'),_rukuArr);
    })

    $('.main-contents-table .table tbody')
        .on('click','.option-see',function(){
            $('.shRemarks').show();
            //新增按钮置为不可操作
            $('.tableHovers').children('.condition-query').hide();
            //动态删除类名dengji
            $('#myModal').find('.confirm').removeClass('dengji').removeClass('bianji');
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();
            _$thisRKnum = $thisDanhao;
            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){
                    //绑定数据
                    myApp33.rkleixing = _allData[i].outType;
                    myApp33.bianhao = _allData[i].orderNum;
                    myApp33.remarks = _allData[i].remark;
                    myApp33.gysphone = _allData[i].phone;
                    myApp33.zhidanren = _allData[i].createUser;
                    myApp33.shijian = _allData[i].createTime;
                    myApp33.gdCode = _allData[i].contractOrder;
                    myApp33.clymc = _allData[i].cusName;
                    myApp33.clydh = _allData[i].phone;
                    myApp33.shRemarks = _allData[i].auditMemo;
                }
            }
            //获取当前入库单号的
            _moTaiKuang($('#myModal'), '查看', 'flag', '' ,'', '');
            //获取入库信息的详细物品信息
            function sucFun1(result){
                datasTable($('#personTable1'),result)
            }
            detailInfo($thisDanhao,sucFun1);
            //所有输入框不可操作；
            $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');
            $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('readonly','readonly').addClass('disabled-block');
            //新增物品按钮隐藏
            $('.zhiXingRenYuanButton').hide();
            //入库产品删除按钮不可操作
            $('#personTable1 tbody').find('.option-shanchu').attr('disabled',true);
        })
        .on('click','.option-edit',function(){
            $('.shRemarks').show();
            $('.shRemarks').find('textarea').attr('readonly','readonly').addClass('disabled-block');
            $('.tableHovers').children('.condition-query').show();
            //动态删除类名dengji
            $('#myModal').find('.confirm').removeClass('shenhe').removeClass('dengji').addClass('bianji');
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();
            _$thisRKnum = $thisDanhao;
            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){
                    //绑定数据
                    myApp33.rkleixing = _allData[i].outType;
                    myApp33.bianhao = _allData[i].orderNum;
                    myApp33.remarks = _allData[i].remark;
                    myApp33.gysphone = _allData[i].phone;
                    myApp33.zhidanren = _allData[i].createUser;
                    myApp33.shijian = _allData[i].createTime;
                    myApp33.gdCode = _allData[i].contractOrder;
                    myApp33.clymc = _allData[i].cusName;
                    myApp33.clydh = _allData[i].phone;
                    myApp33.shRemarks = _allData[i].auditMemo;
                }
            }
            //获取当前入库单号的
            _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');
            //获取入库信息的详细物品信息
            function sucFun2(result){
                _rukuArr = result;
                datasTable($('#personTable1'),result)
            }
            detailInfo($thisDanhao,sucFun2);
            //判断状态是已确认还是待确定
            if( $(this).next().html() == '已审核' ){
                //所有输入框不可操作；
                $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');
                $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');
                $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
                $('#myApp33').find('textarea').attr('readonly','readonly').addClass('disabled-block');

                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').hide();
                //入库产品删除按钮不可操作
                $('#personTable1 tbody').find('.option-shanchu').attr('disabled',true);
            }else if( $(this).next().html() == '待审核' ){
                //所有输入框不可操作；
                $('#myApp33').find('input').removeAttr('readonly').removeClass('disabled-block');
                $('#myApp33').find('input').parent('.input-blockeds').removeClass('disabled-block');
                $('#myApp33').find('select').attr('disabled',false).removeClass('disabled-block');
                //$('#myApp33').find('textarea').removeAttr('readonly').removeClass('disabled-block');
                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').html('修改物品').show();
                //入库产品删除按钮不可操作
                $('#personTable1 tbody').find('.option-shanchu').removeAttr('disabled');
                //出库单编码、制单人、制单时间不可编辑
                $('.automatic').attr('readonly','readonly').addClass('disabled-block');
            }
        })
        //删除入库单
        .on('click','.option-delete',function(){
            $('.shRemarks').show();
            //审核备注不显示
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();
            _$thisRemoveRowDa = $thisDanhao;
            _$thisRKnum = $thisDanhao;
            //提示框，确定要删除吗？
            var $myModal = $('#myModal3');
            //绑定信息
            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){
                    //绑定数据
                    $('#ckabh').val(_allData[i].orderNum);
                    var aa = $.trim($('#myApp33').find('select').find('option').eq(_allData[i].outType-1).val());
                    if(aa == 1){
                        $('#cklx').val('领用出库');
                    }else if(aa == 2){
                        $('#cklx').val('借货出库');
                    }else if(aa == 3){
                        $('#cklx').val('借用还出');
                    }else{
                        $('#cklx').val('其他');
                    }
                }
            }
            _moTaiKuang($('#myModal3'), '确定要删除吗？', '', '' ,'', '删除');
        })
        //入库单确认操作
        .on('click','.option-confirm',function(){

            //绑定信息
            //新增按钮置为不可操作
            $('.tableHovers').children('.condition-query').hide();
            //动态删除类名dengji
            $('#myModal').find('.confirm').removeClass('dengji').removeClass('bianji');
            //样式
            var $this = $(this).parents('tr');

            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

            $this.addClass('tables-hover');

            var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();

            _$thisRKnum = $thisDanhao;

            for(var i=0;i<_allData.length;i++){
                if(_allData[i].orderNum == $thisDanhao){

                    //绑定数据
                    myApp33.rkleixing = _allData[i].outType;
                    myApp33.gdCode = _allData[i].contractOrder;
                    myApp33.clymc = _allData[i].cusName;
                    myApp33.clydh = _allData[i].phone;
                    myApp33.ckselect = _allData[i].storageNum;
                    myApp33.zhidanren = _allData[i].createUser;
                    myApp33.shijian = _allData[i].createTime;
                    myApp33.remarks = _allData[i].remark;
                    myApp33.shRemarks = _allData[i].auditMemo;
                    //判断制单人和审核人是不是一样
                    if(_allData[i].createUser == _userIdNum){
                        _examineRen = false;
                    }else{
                        _examineRen = true;
                    }
                }
            }

            //判断如果是查看功能的话，确认按钮消失
            $('#myModal').find('.confirm').addClass('shenhe');

            //获取当前入库单号的
            _moTaiKuang($('#myModal'), '审核', '', '' ,'', '审核');

            //获取入库信息的详细物品信息
            function sucFun3(result){
                datasTable($('#personTable1'),result)
            }
            detailInfo($thisDanhao,sucFun3);
            //所有操作框均为只读
            $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');
            $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',false).removeClass('disabled-block');
            $('#myApp33').find('textarea').attr('readonly','readonly');
            $('.shRemarks').children('textarea').removeAttr('readonly').removeClass('disabled-block').show();
            //新增物品按钮隐藏
            $('.zhiXingRenYuanButton').hide();
            //入库产品删除按钮不可操作
            $('#personTable1 tbody').find('.option-shanchu').attr('disabled',true);
            //审核备注显示
            $('.shRemarks').show();
            $('.shRemarks').find('textarea').removeAttr('readonly').removeClass('disabled-block');
        })
        //入库已确认操作
        //.on('click','.option-confirmed',function(){
        //    $('#myModal2').find('.modal-body').html('已确认，不能进行该操作');
        //    moTaiKuang($('#myModal2'),'提示','flag');
        //    _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'已确认，不能进行该操作', '')
        //})

    //表格编辑确认按钮
    $('#myModal')
        .on('click','.bianji',function(){
            var outStoreDetails1 = [];
            //入库单的信息
            for(var i=0;i<_rukuArr.length;i++){
                var obj = {};
                obj.itemNum = _rukuArr[i].itemNum;
                obj.itemName = _rukuArr[i].itemName;
                obj.size = _rukuArr[i].size;
                obj.unitName = _rukuArr[i].unitName;
                obj.num = _rukuArr[i].num;
                obj.outPrice = _rukuArr[i].outPrice;
                obj.amount = _rukuArr[i].amount;
                obj.gdCode2 = _rukuArr[i].gdCode2;
                obj.bxKeshi = _rukuArr[i].chezhan;
                obj.bxKeshiNum = $('#chezhan').children('option:selected').html();
                obj.outMemo = _rukuArr[i].outMemo;
                obj.userID=_userIdNum;
                obj.userName = _userIdName;
                obj.storageName = _rukuArr[i].storageName;
                obj.storageNum = _rukuArr[i].storageNum;
                obj.sn = _rukuArr[i].sn;
                obj.localNum = _rukuArr[i].localNum;
                obj.localName = _rukuArr[i].localName;
                outStoreDetails1.push(obj);
            }
            var ckName = '';
            if($('#ckselect').val() == ''){
                ckName = ''
            }else{
                ckName = $('#ckselect').children('option:selected').html();
            }
            var prm = {
                'orderNum':myApp33.bianhao,
                'outType':myApp33.rkleixing,
                'remark':myApp33.remarks,
                'outStoreDetails':outStoreDetails1,
                'userID':_userIdNum,
                'userName':_userIdName,
                'b_UserRole':_userRole,
                'storageName':ckName,
                'storageNum':$('#ckselect').val(),
                'contractOrder':myApp33.gdCode,
                'cusName':myApp33.clymc,
                'phone':myApp33.clydh
            }
            $.ajax({
                type:'post',
                url: _urls + 'YWCK/ywCKEditOutStorage',
                data:prm,
                success:function(result){
                    if(result == 99){
                        _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'修改成功!', '');
                        $('#myModal').modal('hide');
                        conditionSelect();
                    }else{
                        _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'修改失败!', '');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        })
        .on('click','.shenhe',function(){
            if(_isShenHe == 1){
                _examineRen = false;
            }else if(_isShenHe == 0){
                _examineRen = true;
            }
            if(!_examineRen){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'不能审核自己创建的入库单！', '');
            }else{
                var prm = {
                    'OrderNum':_$thisRKnum,
                    'userID':_userIdNum,
                    'userName':_userIdName,
                    'b_UserRole':_userRole,
                    'auditMemo':myApp33.shRemarks
                }
                //获得当前的页数，
                $thisTbale = $(this).parents('.table');
                currentTable = $thisTbale.next().next();
                currentPages = parseInt(currentTable.children('span').children('.paginate_button.current').index());
                $.ajax({
                    type:'post',
                    url:_urls + 'YWCK/ywCKConfirmOutStorage',
                    data:prm,
                    success:function(result){
                        if(result == 99){
                            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'确认成功!', '');
                            $('#myModal').modal('hide');
                            conditionSelect();
                            //点击一下当前的数字，自动指向当前页
                            currentTable.children('span').children('.paginate_button').eq(currentPages).click();
                            $(this).removeClass('shenhe');
                        }else{
                            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'确认失败，可能是库存不足的原因!', '');
                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })
            }

        })

    //入库单确认删除操作
    $('.modal').on('click','.daShanchu',function(){
        var prm = {
            'orderNum':_$thisRemoveRowDa,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKDelOutStorage',
            data:prm,
            success:function(result){
                if(result == 99){
                    _moTaiKuang($('#myModal5'), '提示','flag', 'istap' ,'删除成功!', '');
                    conditionSelect();
                    $('#myModal3').modal('hide');
                }else{
                    _moTaiKuang($('#myModal5'), '提示','flag', 'istap' ,'删除失败!', '');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })

    //删除入库产品操作
    $('#personTable1 tbody')
        .on('click','.option-shanchu',function(){
            //_$thisRemoveRowXiao = $(this);

            var $this = $(this).parents('tr');
            var bm = $this.find('.bianma').html();
            var ck = $this.find('.storageName').children('span').attr('data-num');
            var kq = $this.find('.localName').children('span').attr('data-num');
            var sn = $this.find('.sn').html();

            _tempObj.length = 0;

            for(var i=0;i<_rukuArr.length;i++){

                if(_rukuArr[i].itemNum == bm && _rukuArr[i].storageNum == ck && _rukuArr[i].localNum == kq && _rukuArr[i].sn == sn){

                    _tempObj.push(_rukuArr[i]);

                }

            }

            _moTaiKuang($('#myModal2'), '提示', '', 'istap' ,'确定要删除吗？', '删除');

        //新添加类名，实现入库单操作；
        $('#myModal2').find('.btn-primary').removeClass('removeButton').addClass('xiaoShanchu');
    })
        .on('click','.option-see1',function(){

            _moTaiKuang($('#myModal6'), '出库产品详情', 'flag', '' ,'', '');

            var $thisCK = $(this).parents('tr').children('.storageName').children('span').attr('data-num');

            var $thisKQ = $(this).parents('tr').children('.localName').children('span').attr('data-num');

            var $thisBM = $(this).parents('tr').children('.bianma').html();

            var $thisSN = $(this).parents('tr').children('.sn').html();

            //获取详情赋值
            function sucFun3(result){

                for(var i=0;i<result.length;i++){

                    if( $thisCK == result[i].storageNum && $thisKQ == result[i].localNum && $thisBM == result[i].itemNum && $thisSN == result[i].sn  ){

                        chukuObject.ck = result[i].storageName;
                        chukuObject.bianhao = result[i].itemNum;
                        chukuObject.mingcheng = result[i].itemName;
                        chukuObject.size = result[i].size;
                        chukuObject.picked = result[i].isSpare;
                        chukuObject.goodsId = result[i].sn;
                        chukuObject.unit = result[i].unitName;
                        chukuObject.quality = result[i].batchNum;
                        chukuObject.warranty = result[i].maintainDate;
                        chukuObject.num = result[i].num;
                        chukuObject.outPrice = result[i].outPrice;
                        chukuObject.amount = result[i].amount;
                        chukuObject.gdCode = result[i].gdCode2;
                        chukuObject.chezhan = result[i].bxKeshi;
                        chukuObject.remark = result[i].outMemo;

                    }

                }

                if(chukuObject.picked == 0){
                    $('.durable').parent('span').removeClass('checked');
                    $('.durable').parent('span').eq(1).addClass('checked');
                }else{
                    $('.durable').parent('span').removeClass('checked');
                    $('.durable').parent('span').eq(0).addClass('checked');
                }
            }
            //所有信息不可编辑
            $('#chukuObject').find('.gdList').children('.input-blockeds').addClass('disabled-block');
            $('#chukuObject').find('.gdList').children('.input-blockeds').children('input').addClass('disabled-block').attr('readonly','readonly');
            detailInfo(_$thisRKnum,sucFun3);
        })

    //入库产品删除操作按钮
    $('#myModal2').on('click','.xiaoShanchu',function(){

        _rukuArr.remove(_tempObj[0]);

        datasTable($('#personTable1'),_rukuArr);

        $('#myModal2').modal('hide');

        $(this).removeClass('xiaoShanchu');
    })

    //选择物品列表
    $('#wuPinListTable tbody').on('click','tr',function(){
        $('#wuPinListTable tbody').children('tr').removeClass('tables-hover');
        $(this).addClass('tables-hover');
        //通过物品编码，名称，序列号，规格，剩余数量来比较
        _wpObject.bm = $(this).children('.bianma').html();
        _wpObject.mc = $(this).children('.mingcheng').html();
        _wpObject.sn = $(this).children('.xuliehao').html();
        _wpObject.size = $(this).children('.size').html();
        _wpObject.cangku = $(this).children('.cangku').html();
        _wpObject.isSpare = $(this).children('.isSpare').html();
        _wpObject.num = $(this).children('.num').html();
        _wpObject.cangkuNum = $(this).children('.cangkuNum').html();

    });

    $('#myModal4').find('.btn-primary').on('click',function(){
        for(var i=0;i<_wpListArr.length;i++){
            if(_wpListArr[i].itemNum == _wpObject.bm && _wpListArr[i].itemName == _wpObject.mc && _wpListArr[i].sn == _wpObject.sn && _wpListArr[i].size == _wpObject.size && _wpListArr[i].storageName == _wpObject.cangku && _wpListArr[i].num == _wpObject.num){
                //赋值
                workDone.goodsId = _wpListArr[i].sn;
                workDone.bianhao = _wpListArr[i].itemNum;
                workDone.mingcheng = _wpListArr[i].itemName;
                workDone.size = _wpListArr[i].size;
                workDone.picked = _wpListArr[i].isSpare;
                if(workDone.picked == 0){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(1).addClass('checked');
                }else if(workDone.picked == 1){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(0).addClass('checked');
                }
                workDone.unit = _wpListArr[i].unitName;
                workDone.quality = _wpListArr[i].batchNum;
                workDone.warranty = _wpListArr[i].maintainDate;
                workDone.redundant = _wpListArr[i].num;
                workDone.ck = _wpListArr[i].storageName;
                $('.cangku').attr('data-num',_wpListArr[i].storageNum);
                $('.cangku').attr('data-name',_wpListArr[i].storageName);
                var outPrice = '';
                if(_wpListArr[i].num == 0){
                    outPrice = 0;
                }else{
                    outPrice = parseFloat(_wpListArr[i].amount)/parseFloat(_wpListArr[i].num)
                }
                workDone.outPrice = outPrice.toFixed(2);
                //库区赋值
                $('.kuwei').attr('data-num',_wpListArr[i].localNum);
                workDone.kuwei = _wpListArr[i].localName
            }
        }
        $('#myModal4').modal('hide');
    });

    //选择物品列表
    $('.tianJiaruku').click(function(){
        _moTaiKuang($('#myModal4'), '选择出库物品列表', '', '' ,'', '确定');
        wlList('flag');
    });

    //出库物品条件查询
    $('#selected1').click(function(){
        wlList('flag');
    });

    //其他点击事件
    $('.accord-with-list').children('li').not();

    //第二层的添加入库产品按钮
    $('#addRK').click(function(){
        //验证必填项(仓库，物品编号，物品名称，数量，出库单价，总金额，工单号，车站)
        if( workDone.ck == '' || workDone.bianhao == '' || workDone.mingcheng == '' || workDone.num == '' || workDone.outPrice == '' || workDone.amount == '' || workDone.goodsId == ''){
            //提示框
            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'请填写红色必填项!', '')
        }else{
            var o = $('.format-error')[0].style.display;
            var s = $('.format-error1')[0].style.display;
            var a = $('.format-error2')[0].style.display;
            var t = $('.format-error3')[0].style.display;
            var b = $('.format-error4')[0].style.display;

            if(o == 'none' && s == 'none' && a == 'none' && t =='none' && b == 'none'){

                //首先判断输入过了没(根据仓库、库区、编号、序列号判断是否添加了)
                var existFlag = false;

                for(var i=0;i<_tempRKArr.length;i++){
                    if(workDone.bianhao == _tempRKArr[i].itemNum && $('.cangku').attr('data-num') == _tempRKArr[i].storageNum && $('.kuwei').attr('data-num') == _tempRKArr[i].localNum && workDone.goodsId == _tempRKArr[i].sn){

                        existFlag = true;

                    }
                }
                if(existFlag){
                    //有
                    _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'已添加过!', '');
                }else{
                    //无
                    //获取入库单信息创建对象，存入_rukuArr数组
                    //首先获取仓库的值
                    var rukuDan = {};
                    rukuDan.sn = workDone.goodsId;
                    rukuDan.itemNum = workDone.bianhao;
                    rukuDan.itemName = workDone.mingcheng;
                    rukuDan.size = workDone.size;
                    rukuDan.num = workDone.num;
                    rukuDan.isSpare = workDone.picked;
                    rukuDan.batchNum = workDone.quality;
                    rukuDan.maintainDate = workDone.warranty;
                    rukuDan.storageName = workDone.ck;
                    rukuDan.storageNum = $('.cangku').attr('data-num');
                    rukuDan.unitName = workDone.unit;
                    rukuDan.outPrice = workDone.outPrice;
                    rukuDan.amount = workDone.amount;
                    rukuDan.gdCode2 = workDone.gdCode;
                    rukuDan.localNum = $('.kuwei').attr('data-num');
                    rukuDan.localName = workDone.kuwei;
                    //车间
                    rukuDan.bxKeshi = $('.chezhan').attr('data-name');
                    rukuDan.bxKeshiNum = $('.chezhan').attr('data-num');
                    rukuDan.outMemo = workDone.remark;
                    rukuDan.userID = _userIdNum;
                    rukuDan.userName = _userIdName;
                    rukuDan.shengyu = workDone.redundant;
                    rukuDan.gdCode = $('.gdCode').attr('gdcode');

                    _tempRKArr.unshift(rukuDan);

                    datasTable($('#wuPinListTable1'),_tempRKArr);

                    //console.log(_tempRKArr);

                }

            }else{

                _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'请输入正确的数字', '');
            }
        }
    });

    //添加入库产品之后，重置按钮
    //重置
    $('#addReset').click(function(){
        workDone.goodsId = '';
        workDone.bianhao = '';
        workDone.mingcheng = '';
        workDone.size = '';
        workDone.picked = 0;
        workDone.unit = '';
        workDone.quality = '';
        workDone.warranty = '';
        workDone.num = 0;
        workDone.outPrice = '';
        workDone.amount = 0;
        workDone.remark = '';
        workDone.gdCode = '';
        workDone.chezhan = '';
        workDone.redundant = 0;

        $('.inpus').parent('span').removeClass('checked');
        if(workDone.picked == 0){

            $('#twos').parent('span').addClass('checked');

        }else if(workDone.picked == 1){


            $('#ones').parent('span').addClass('checked');

        }
        //workDone.ck ='';
        //workDone.kuwei = '';
        $('.not-editable').eq(0).focus();
        //所有框可操作
        $('.not-editable').removeAttr('readonly').removeClass('disabled-block');
        $('#wuPinListTable1 tbody').children('tr').css('background','#ffffff');
        $('.auto-input').removeAttr('readonly').removeClass('disabled-block');
        $('.auto-input').parent('.input-blockeds').removeClass('disabled-block');
        $('.accord-with-list').hide();
        $('.not-editable').parent('.input-blockeds').removeClass('disabled-block');
        //$('.kuwei').removeAttr('data-num');
        //$('.cangku').removeAttr('data-num').removeAttr('data-name');
        $('.gdCode').removeAttr('gdcode');
        $('.chezhan').removeAttr('data-num').removeAttr('data-name');
        //所有列表应该重新初始化（所有值）
        //初始化长裤列表(仓库、库区、物品、工单号)；
        ckList(_ckArr,$('.pinzhixx').eq(0));

        //自动聚焦
        $('.inputType').eq(2).focus();
    });

    $('#wuPinListTable1 tbody')
        .on('click','.option-shanchu',function(){
            //_$thisRemoveRowXiao = $(this).parents('tr').children('.bianma').html();
            var $this = $(this).parents('tr');
            var bm = $this.find('.bianma').html();
            var ck = $this.find('.storageName').children('span').attr('data-num');
            var kq = $this.find('.localName').children('span').attr('data-num');
            var sn = $this.find('.sn').html();

            _tempObj.length = 0;

            for(var i=0;i<_tempRKArr.length;i++){

                if(_tempRKArr[i].itemNum == bm && _tempRKArr[i].storageNum == ck && _tempRKArr[i].localNum == kq && _tempRKArr[i].sn == sn){

                    _tempObj.push(_tempRKArr[i]);

                }

            }

            console.log(_tempObj);

            _moTaiKuang($('#myModal2'),'提示', '', 'istap' ,'确定要删除吗？', '删除');
            //新添加类名，实现入库单操作；
            $('#myModal2').find('.btn-primary').removeClass('xiaoShanchu').addClass('removeButton');

            event.stopPropagation();
        })
        //点击表格中的数据，将内容赋值给onput，以便编辑
        .on('click','.option-bianji',function(){
            var flag = $(this).attr('data-flag');
            $(this).html('保存').removeClass('option-bianji').addClass('option-save');
            //编辑的时候，编码和名称，条形码不能修改。
            $('.not-editable').attr('readonly','readonly').addClass('disabled-block');
            $('.not-editable').parents('.input-blockeds').addClass('disabled-block');
            //样式修改
            $('#wuPinListTable1 tbody').children('tr').css({'background':'#ffffff'});
            var $this = $(this).parents('tr');
            $this.css({'background':'#FBEC88'});

            var bm = $this.find('.bianma').html();
            var ck = $this.find('.storageName').children('span').attr('data-num');
            var kq = $this.find('.localName').children('span').attr('data-num');
            var sn = $this.find('.sn').html();

            for(var i=0;i<_rukuArr.length;i++){
                if(_rukuArr[i].itemNum == bm && _rukuArr[i].storageNum == ck && _rukuArr[i].localNum == kq && _rukuArr[i].sn == sn){


                    //赋值
                    workDone.bianhao = _rukuArr[i].itemNum;
                    workDone.mingcheng = _rukuArr[i].itemName;
                    workDone.size = _rukuArr[i].size;
                    workDone.picked = _rukuArr[i].isSpare;
                    console.log(_rukuArr[i].isSpare);
                    if(workDone.picked == 0){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(1).addClass('checked');
                    }else if(workDone.picked == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(0).addClass('checked');
                    }
                    workDone.kuwei = _rukuArr[i].localName;
                    workDone.goodsId = _rukuArr[i].sn;
                    workDone.unit = _rukuArr[i].unitName;
                    workDone.quality = _rukuArr[i].batchNum;
                    workDone.warranty = _rukuArr[i].maintainDate;
                    workDone.num = _rukuArr[i].num;
                    workDone.outPrice = _rukuArr[i].outPrice;
                    workDone.amount = _rukuArr[i].amount;
                    workDone.remark = _rukuArr[i].outMemo;
                    workDone.gdCode = _rukuArr[i].gdCode2;
                    workDone.chezhan = _rukuArr[i].bxKeshi;
                    workDone.redundant = _rukuArr[i].shengyu;
                    workDone.ck = _rukuArr[i].storageName;
                    $('.cangku').attr('data-num',_rukuArr[i].storageNum);
                    $('.cangku').attr('data-name',_rukuArr[i].storageName);
                    $('.kuwei').attr('data-num',_rukuArr[i].localNum);
                    $('.gdCode').attr('gdcode',_rukuArr[i].gdCode);
                    $('.chezhan').attr('data-num',_rukuArr[i].bxKeshiNum);
                    $('.chezhan').attr('data-name',_rukuArr[i].bxKeshi);
                }
            }
        })
        //编辑之后，保存
        .on('click','.option-save',function(){
            $('.not-editable').removeAttr('readonly').removeClass('disabled-block');
            if(workDone.ck == '' || workDone.bianhao == '' || workDone.mingcheng == '' || workDone.num == '' || workDone.outPrice == '' || workDone.amount == ''){
                //提示框
                _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'请填写红色必填项!', '');
            }else{
                var $this = $(this).parents('tr');
                var bm = $this.find('.bianma').html();
                var ck = $this.find('.storageName').children('span').attr('data-num');
                var kq = $this.find('.localName').children('span').attr('data-num');
                var sn = $this.find('.sn').html();
                for(var i=0;i<_rukuArr.length;i++){
                    if(_rukuArr[i].itemNum == bm && _rukuArr[i].storageNum == ck && _rukuArr[i].localNum == kq && _rukuArr[i].sn == sn){
                        _rukuArr[i].num = workDone.num;
                        _rukuArr[i].outPrice = workDone.outPrice;
                        _rukuArr[i].amount = workDone.amount;
                        _rukuArr[i].gdCode2 = workDone.gdCode;
                        _rukuArr[i].bxKeshi = $('.chezhan').attr('data-name');
                        _rukuArr[i].bxKeshiNum = $('.chezhan').attr('data-num');
                        _rukuArr[i].storageName = $('.cangku').attr('data-name');
                        _rukuArr[i].storageNum = $('.cangku').attr('data-num');
                        _rukuArr[i].outMemo = workDone.remark;
                    }
                }
                datasTable($('#wuPinListTable1'),_rukuArr);
                //编辑之后清空
                workDone.goodsId = '';
                workDone.bianhao = '';
                workDone.mingcheng = '';
                workDone.size = '';
                workDone.picked = 0;
                workDone.unit = '';
                workDone.quality = '';
                workDone.warranty = '';
                workDone.num = '';
                workDone.outPrice = '';
                workDone.amount = 0;
                workDone.remark = '';
                if(workDone.picked == 0){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(1).addClass('checked');
                }else if(workDone.picked == 1){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(0).addClass('checked');
                }
                workDone.gdCode = '';
                workDone.chezhan = '';
                workDone.ck = '';
                workDone.redundant = 0;
                workDone.kuwei = '';
                //自动聚焦
                $('.number1').eq(0).focus();
                $('.not-editable').removeAttr('readonly').removeClass('disabled-block');
                $('.not-editable').parent('.input-blockeds').removeClass('disabled-block');
                $('.kuwei').removeAttr('data-num');
                $('.cangku').removeAttr('data-num').removeAttr('data-name');
                $('.gdCode').removeAttr('gdcode');
                $('.chezhan').removeAttr('data-num').removeAttr('data-name');
                $('.radio').parent('.input-blockeds').removeClass('disabled-block');
            }
        })

    $('#myModal2').on('click','.removeButton',function(){
        //静态删除

        _tempRKArr.remove(_tempObj[0]);

        datasTable($('#wuPinListTable1'),_tempRKArr);

        $('this').removeClass('removeButton');

        $('#myModal2').modal('hide');
    });

    //入库产品的回车自动聚焦功能
    $('.inputType').keyup(function(e){
        var e = e||window.event;
        if(e.keyCode == 13){

            if( $(this).parents('.gdList').next('li').find('.inputType').attr('id') == 'addRK' ){

                //验证必填项(仓库，物品编号，物品名称，数量，出库单价，总金额，工单号，车站)
                if( workDone.ck == '' || workDone.bianhao == '' || workDone.mingcheng == '' || workDone.num == '' || workDone.outPrice == '' || workDone.amount == '' ){
                    //提示框
                    _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'请填写红色必填项!', '')
                }else{
                    var o = $('.format-error')[0].style.display;
                    var s = $('.format-error1')[0].style.display;
                    var a = $('.format-error2')[0].style.display;
                    var t = $('.format-error3')[0].style.display;
                    var b = $('.format-error4')[0].style.display;

                    if(o == 'none' && s == 'none' && a == 'none' && t =='none' && b == 'none'){

                        //首先判断输入过了没(根据仓库、库区、编号、序列号判断是否添加了)
                        var existFlag = false;

                        for(var i=0;i<_tempRKArr.length;i++){
                            if(workDone.bianhao == _tempRKArr[i].itemNum && $('.cangku').attr('data-num') == _tempRKArr[i].storageNum && $('.kuwei').attr('data-num') == _tempRKArr[i].localNum && workDone.goodsId == _tempRKArr[i].sn){

                                existFlag = true;

                            }
                        }
                        if(existFlag){
                            //有
                            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'已添加过!', '');
                        }else{
                            //无
                            //获取入库单信息创建对象，存入_rukuArr数组
                            //首先获取仓库的值
                            var rukuDan = {};
                            rukuDan.sn = workDone.goodsId;
                            rukuDan.itemNum = workDone.bianhao;
                            rukuDan.itemName = workDone.mingcheng;
                            rukuDan.size = workDone.size;
                            rukuDan.num = workDone.num;
                            rukuDan.isSpare = workDone.picked;
                            rukuDan.batchNum = workDone.quality;
                            rukuDan.maintainDate = workDone.warranty;
                            rukuDan.storageName = workDone.ck;
                            rukuDan.storageNum = $('.cangku').attr('data-num');
                            rukuDan.unitName = workDone.unit;
                            rukuDan.outPrice = workDone.outPrice;
                            rukuDan.amount = workDone.amount;
                            rukuDan.gdCode2 = workDone.gdCode;
                            rukuDan.localNum = $('.kuwei').attr('data-num');
                            rukuDan.localName = workDone.kuwei;
                            //车间
                            rukuDan.bxKeshi = $('.chezhan').attr('data-name');
                            rukuDan.bxKeshiNum = $('.chezhan').attr('data-num');
                            rukuDan.outMemo = workDone.remark;
                            rukuDan.userID = _userIdNum;
                            rukuDan.userName = _userIdName;
                            rukuDan.shengyu = workDone.redundant;
                            rukuDan.gdCode = $('.gdCode').attr('gdcode');
                            _tempRKArr.unshift(rukuDan);

                            datasTable($('#wuPinListTable1'),_tempRKArr);

                        }

                    }else{

                        _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'请输入正确的数字', '');
                    }
                }
            }else{
                $(this).parents('.gdList').next('li').find('.inputType').focus();
            }
        }
    });

    //选择工单
    $('.pinzhixx').eq(1)
        .on('click','div',function(e){
            workDone.gdCode = $('.pinzhixx').eq(1).children('.li-color').children('.dataGD').html();
            var pzNum = $('.pinzhixx').eq(1).children('.li-color').attr('data-ddsName');
            $('.gdCode').attr('gdCode',$('.pinzhixx').eq(1).children('.li-color').attr('data-gd'));
            workDone.chezhan = pzNum;
            $('.pinzhixx').eq(1).hide();
            $('.chezhan').attr('data-num',$('.pinzhixx').eq(1).children('.li-color').attr('data-dds'));
            $('.chezhan').attr('data-name',$('.pinzhixx').eq(1).children('.li-color').attr('data-ddsname'));
            $(this).parents('.hidden1').hide();

            e.stopPropagation();
            _pzNum = -1;
        })
        .on('mouseover','div',function(e){
            $(this).parent('.pinzhixx').children('div').removeClass('li-color');
            $(this).addClass('li-color');
            _pzNum = $('.li-color').index();
        });

    //仓库选择
    $('.pinzhixx').eq(0)
        .on('click','li',function(e){

            enterCK();

        })
        .on('mouseover','li',function(e){

            $(this).parent('.pinzhixx').children('li').removeClass('li-color');

            $(this).addClass('li-color');

            _pzNum = $('.li-color').index();

        });

    //库区选择
    $('.kuqu-list')
        .on('click','li',function(e){
            //清空之前已选择内容
            var length = $('#myModal1 input').length;
            for(var i=2; i<length; i++){
                $('#myModal1 input').eq(i).val('');
            }
            //赋值
            workDone.kuwei = $(this).html();
            $('.kuwei').attr('data-num',$(this).attr('data-num'));
            $(this).parents('.hidden1').hide();
            e.stopPropagation();
            //根据库区，筛选物料
            var arr = [];
            var str = '';
            //编码选择项
            if(workDone.kuwei == ''){
                for(var i=0;i<_wpListArr.length;i++){
                    if($('.cangku').attr('data-num') == _wpListArr[i].storageNum){
                        arr.push(_wpListArr[i]);
                        str += '<span data-durable="' + _wpListArr[i].isSpare +
                            '"' + 'data-unit="' + _wpListArr[i].unitName +
                            '"data-quality="' + _wpListArr[i].batchNum +
                            '"data-maintainDate="' +  _wpListArr[i].maintainDate +
                            '"' + 'data-sn="' + _wpListArr[i].sn +
                            '"' + 'data-shengyu="' + _wpListArr[i].num +
                            '"' +
                            '>' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                            '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span>' +
                            '<span class="dataSize" style="margin-left: 20px;">' +
                            _wpListArr[i].size+'</span>' + '<span style="margin-left: 20px;"' + _wpListArr[i].localName + '</span>'
                           +'</li>';
                    }
                }
            }else if(workDone.kuwei != ''){
                for(var i=0;i<_wpListArr.length;i++){
                    if($('.cangku').attr('data-num') == _wpListArr[i].storageNum && $('.kuwei').attr('data-num') == _wpListArr[i].localNum){
                        arr.push(_wpListArr[i]);
                        str += '<li data-durable="' + _wpListArr[i].isSpare +
                            '"' + 'data-unit="' + _wpListArr[i].unitName +
                            '"data-quality="' + _wpListArr[i].batchNum +
                            '"data-maintainDate="' +  _wpListArr[i].maintainDate +
                            '"' + 'data-sn="' + _wpListArr[i].sn +
                            '"' + 'data-shengyu="' + _wpListArr[i].num +
                            '"' +
                            '>' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                            '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span>' +
                            '<span class="dataSize" style="margin-left: 20px;">' +
                            _wpListArr[i].size+'</span>' + '<span style="margin-left: 20px;" >' + _wpListArr[i].localName + '</span>' +
                            '</li>';
                    }
                }
            }

            $('.accord-with-list').eq(0).empty().append(str);
            $('.accord-with-list').eq(1).empty().append(str);
        })
        .on('mouseover','li',function(e){
            $(this).parents('.kuqu-list').children('li').removeClass('li-color');
            $(this).addClass('li-color');
        })

    $('.warranty').on('changeDate',function(e){
        $('.warranty').datepicker('hide');
    });

    //点击状态下出现选项
    $('.selectBlock').click(function(e){
        //console.log($(this).parent('.input-blockeds').hasClass('disabled-block'));
        if($(this).parent('.input-blockeds').hasClass('disabled-block')){
            return false;
        }else{
            var e = event || window.event;
            var this1 = $(this);
            if(this1.next()[0].style.display == 'none'){
                this1.next().show();
            }else if(this1.next()[0].style.display != 'none'){
                this1.next().hide();
            }
            e.stopPropagation();
        }
    });

    //物品编码点击
    $('.accord-with-list').eq(0)
        .on('click','li',function(e){
            workDone.bianhao = $(this).children('.dataNum').html();
            workDone.mingcheng = $(this).children('.dataName').html();
            $(this).parents('.accord-with-list').hide();
            //选了编码之后，自动确认序列号列表内容
            var str = '';
            if(workDone.kuwei == ''){
                for(var i=0;i<_wpListArr.length;i++){
                    if(workDone.bianhao == _wpListArr[i].itemNum && $('.cangku').attr('data-num') == _wpListArr[i].storageNum){
                        //确定序列号
                        var isSpareStr = '';
                        if(_wpListArr[i].isSpare == 0){
                            isSpareStr = '消耗品';
                        }else if(_wpListArr[i].isSpare == 1){
                            isSpareStr = '耐用品';
                        }
                        var snStr = '';
                        if(_wpListArr[i].sn == ''){
                            snStr = ' ';
                        }else{
                            snStr = _wpListArr[i].sn;
                        }
                        str += '<li data-amount="' + _wpListArr[i].amount+
                            '"data-size="' + _wpListArr[i].size +
                            '"data-unit="' + _wpListArr[i].unitName + '"data-quality="' + _wpListArr[i].batchNum +
                            '"data-warranty="' + _wpListArr[i].maintainDate +'"'+
                            '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + _wpListArr[i].isSpare +
                            '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + _wpListArr[i].num + '</span>' +
                            '<span class="dataStorageName" style="margin-left: 10px;">' + _wpListArr[i].storageName +
                            '</span>'+'<span style="margin: 0 10px;">' + _wpListArr[i].batchNum +
                            '</span>'+'<span>' + _wpListArr[i].localName +
                            '</span>' +'</li>';
                    }
                }
            }else if(workDone.kuwei != ''){
                for(var i=0;i<_wpListArr.length;i++){
                    if(workDone.bianhao == _wpListArr[i].itemNum && $('.cangku').attr('data-num') == _wpListArr[i].storageNum && _wpListArr[i].localNum == $('.kuwei').attr('data-num')){
                        //确定序列号
                        var isSpareStr = '';
                        if(_wpListArr[i].isSpare == 0){
                            isSpareStr = '消耗品';
                        }else if(_wpListArr[i].isSpare == 1){
                            isSpareStr = '耐用品';
                        }
                        var snStr = '';
                        if(_wpListArr[i].sn == ''){
                            snStr = ' ';
                        }else{
                            snStr = _wpListArr[i].sn;
                        }
                        str += '<li data-amount="' + _wpListArr[i].amount+
                            '"data-size="' + _wpListArr[i].size +
                            '"data-unit="' + _wpListArr[i].unitName + '"data-quality="' + _wpListArr[i].batchNum +
                            '"data-warranty="' + _wpListArr[i].maintainDate +'"'+
                            '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + _wpListArr[i].isSpare +
                            '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + _wpListArr[i].num + '</span>' +
                            '<span class="dataStorageName" style="margin-left: 10px;">' + _wpListArr[i].storageName +
                            '</span>'+'<span style="margin: 0 10px;">' + _wpListArr[i].batchNum +
                            '</span>'+'<span>' + _wpListArr[i].localName +
                            '</span>' +'</li>';
                    }
                }
            }
            //for(var i=0;i<_wpListArr.length;i++){
            //    if(workDone.bianhao == _wpListArr[i].itemNum && $('.cangku').attr('data-num') == _wpListArr[i].storageNum){
            //        //确定序列号
            //        var isSpareStr = '';
            //        if(_wpListArr[i].isSpare == 0){
            //            isSpareStr = '消耗品';
            //        }else if(_wpListArr[i].isSpare == 1){
            //            isSpareStr = '耐用品';
            //        }
            //        var snStr = '';
            //        if(_wpListArr[i].sn == ''){
            //            snStr = ' ';
            //        }else{
            //            snStr = _wpListArr[i].sn;
            //        }
            //        str += '<li data-amount="' + _wpListArr[i].amount+
            //            '"data-size="' + _wpListArr[i].size +
            //            '"data-unit="' + _wpListArr[i].unitName + '"data-quality="' + _wpListArr[i].batchNum +
            //            '"data-warranty="' + _wpListArr[i].maintainDate +'"'+
            //            '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + _wpListArr[i].isSpare +
            //            '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + _wpListArr[i].num + '</span>' +
            //            '<span class="dataStorageName" style="margin-left: 10px;">' + _wpListArr[i].storageName +
            //            '</span>'+'<span style="margin: 0 10px;">' + _wpListArr[i].batchNum +
            //            '</span>'+'<span>' + _wpListArr[i].localName +
            //            '</span>' +'</li>';
            //    }
            //}
            $('.accord-with-list').eq(2).empty().append(str);
            //判断序列号列表的个数
            var lengths = $('.accord-with-list').eq(2).children().length;
            if(lengths == 1){
                //自动填
                var info = $('.accord-with-list').eq(2).children();
                //序列号、规格型号、是否耐用、单位、品质、质保期、剩余数量
                workDone.goodsId = info.children('.dataSn').html();
                workDone.size = info.attr('data-size');
                workDone.picked = info.children('.dataIsSpare').attr('data-isspare');
                workDone.unit = info.attr('data-unit');
                workDone.quality = info.attr('data-quality');
                workDone.warranty = info.attr('data-warranty');
                workDone.redundant = info.children('.dataNum').html();
                if(workDone.picked == 0){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(1).addClass('checked');
                }else if(workDone.picked == 1){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(0).addClass('checked');
                }
                var outPrice = '';
                if(info.children('.dataNum').html() == 0){
                    outPrice = ''
                }else{
                    outPrice = parseFloat(info.attr('data-amount'))/parseFloat(info.children('.dataNum').html());
                }
                workDone.outPrice = outPrice.toFixed(2);
                workDone.num = 0;
                //workDone.outPrice = '';
                workDone.amount = 0;
                workDone.gdCode = '';
                workDone.chezhan = '';
                workDone.remark = '';
            }else{
                //其他项初始化
                workDone.goodsId = '';
                workDone.size = '';
                workDone.picked = 0;
                workDone.unit = '';
                workDone.quality = '';
                workDone.warranty = '';
                workDone.num = 0;
                workDone.redundant = 0;
                workDone.outPrice = '';
                workDone.amount = 0;
                workDone.gdCode = '';
                workDone.chezhan = '';
                workDone.remark = '';
                if(workDone.picked == 0){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(1).addClass('checked');
                }else if(workDone.picked == 1){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(0).addClass('checked');
                }
            }
            //更改车站列表
            var str1 = '';
            //符合编码的工单数组
            var eligibleArr = [];
            //不符合编码的工单数组
            var inconformityArr =[];
            //首先判断的是每个工单的材料id
            for(var i=0;i<_gdArr.length;i++){
                var arrSplit = _gdArr[i].wxClIds.split(',');
                for(var j=0;j<arrSplit.length;j++){
                    if(workDone.bianhao == arrSplit[j]){
                        eligibleArr.push(_gdArr[i]);
                    }
                }
                inconformityArr.push(_gdArr[i]);
            }
            for(var i=0;i<eligibleArr.length;i++){
                str1 += '<div data-dds="' + eligibleArr[i].bxKeshiNum +
                    '"data-ddsName="' + eligibleArr[i].bxKeshi +
                    '" data-gd="' + eligibleArr[i].gdCode +
                    '"style="background: #f5d38c;">' +'<span class="dataGD">' +
                    eligibleArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + eligibleArr[i].wxClNames +
                    '</span>' + '<span>' + eligibleArr[i].bxKeshi +
                    '</span>' + '</div>';
            }
            for(var i=0;i<eligibleArr.length;i++){
                inconformityArr.removeByValue(eligibleArr[i].gdCode2,'gdCode2');
            }
            for(var i=0;i<inconformityArr.length;i++){
                str1 += '<div data-dds="' + inconformityArr[i].bxKeshiNum +
                    '"data-ddsName="' + inconformityArr[i].bxKeshi +
                    '" data-gd="' + inconformityArr[i].gdCode +
                    '">' +'<span class="dataGD">' +
                    inconformityArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + inconformityArr[i].wxClNames +
                    '</span>' + '<span>' + inconformityArr[i].bxKeshi +
                    '</span>' + '</div>';
            }
            $('.pinzhixx').eq(1).empty().append(str1);
            _num = -1;
        })
        .on('mouseover','li',function(){
            $(this).parent('.accord-with-list').children('li').removeClass('li-color');
            $(this).addClass('li-color');
            _num = $('.li-color').index();
        });

    //物品名称点击
    $('.accord-with-list').eq(1)
        .on('click','li',function(e){

            workDone.bianhao = $(this).children('.dataNum').html();
            workDone.mingcheng = $(this).children('.dataName').html();
            $(this).parents('.accord-with-list').hide();
            //选了编码之后，自动确认序列号列表内容
            var str = '';
            if(workDone.kuwei == ''){
                for(var i=0;i<_wpListArr.length;i++){
                    if(workDone.bianhao == _wpListArr[i].itemNum && $('.cangku').attr('data-num') == _wpListArr[i].storageNum){
                        //确定序列号
                        var isSpareStr = '';
                        if(_wpListArr[i].isSpare == 0){
                            isSpareStr = '消耗品';
                        }else if(_wpListArr[i].isSpare == 1){
                            isSpareStr = '耐用品';
                        }
                        var snStr = '';
                        if(_wpListArr[i].sn == ''){
                            snStr = ' ';
                        }else{
                            snStr = _wpListArr[i].sn;
                        }
                        str += '<li data-amount="' + _wpListArr[i].amount+
                            '"data-size="' + _wpListArr[i].size +
                            '"data-unit="' + _wpListArr[i].unitName + '"data-quality="' + _wpListArr[i].batchNum +
                            '"data-warranty="' + _wpListArr[i].maintainDate +'"'+
                            '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + _wpListArr[i].isSpare +
                            '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + _wpListArr[i].num + '</span>' +
                            '<span class="dataStorageName" style="margin-left: 10px;">' + _wpListArr[i].storageName +
                            '</span>'+'<span style="margin: 0 10px;">' + _wpListArr[i].batchNum +
                            '</span>'+'<span>' + _wpListArr[i].localName +
                            '</span>' +'</li>';
                    }
                }
            }else if(workDone.kuwei != ''){
                for(var i=0;i<_wpListArr.length;i++){
                    if(workDone.bianhao == _wpListArr[i].itemNum && $('.cangku').attr('data-num') == _wpListArr[i].storageNum && _wpListArr[i].localNum == $('.kuwei').attr('data-num')){
                        //确定序列号
                        var isSpareStr = '';
                        if(_wpListArr[i].isSpare == 0){
                            isSpareStr = '消耗品';
                        }else if(_wpListArr[i].isSpare == 1){
                            isSpareStr = '耐用品';
                        }
                        var snStr = '';
                        if(_wpListArr[i].sn == ''){
                            snStr = ' ';
                        }else{
                            snStr = _wpListArr[i].sn;
                        }
                        str += '<li data-amount="' + _wpListArr[i].amount+
                            '"data-size="' + _wpListArr[i].size +
                            '"data-unit="' + _wpListArr[i].unitName + '"data-quality="' + _wpListArr[i].batchNum +
                            '"data-warranty="' + _wpListArr[i].maintainDate +'"'+
                            '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + _wpListArr[i].isSpare +
                            '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + _wpListArr[i].num + '</span>' +
                            '<span class="dataStorageName" style="margin-left: 10px;">' + _wpListArr[i].storageName +
                            '</span>'+'<span style="margin: 0 10px;">' + _wpListArr[i].batchNum +
                            '</span>'+'<span>' + _wpListArr[i].localName +
                            '</span>' +'</li>';
                    }
                }
            }
            //for(var i=0;i<_wpListArr.length;i++){
            //    if(workDone.bianhao == _wpListArr[i].itemNum && $('.cangku').attr('data-num') == _wpListArr[i].storageNum){
            //        //确定序列号
            //        var isSpareStr = '';
            //        if(_wpListArr[i].isSpare == 0){
            //            isSpareStr = '消耗品';
            //        }else if(_wpListArr[i].isSpare == 1){
            //            isSpareStr = '耐用品';
            //        }
            //        var snStr = '';
            //        if(_wpListArr[i].sn == ''){
            //            snStr = ' ';
            //        }else{
            //            snStr = _wpListArr[i].sn;
            //        }
            //        str += '<li data-amount="' + _wpListArr[i].amount+
            //            '"data-size="' + _wpListArr[i].size +
            //            '"data-unit="' + _wpListArr[i].unitName + '"data-quality="' + _wpListArr[i].batchNum +
            //            '"data-warranty="' + _wpListArr[i].maintainDate +'"'+
            //            '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + _wpListArr[i].isSpare +
            //            '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + _wpListArr[i].num + '</span>' +
            //            '<span class="dataStorageName" style="margin-left: 10px;">' + _wpListArr[i].storageName +
            //            '</span>'+'<span style="margin: 0 10px;">' + _wpListArr[i].batchNum +
            //            '</span>'+'<span>' + _wpListArr[i].localName +
            //            '</span>' +'</li>';
            //    }
            //}
            $('.accord-with-list').eq(2).empty().append(str);
            //判断序列号列表的个数
            var lengths = $('.accord-with-list').eq(2).children().length;
            if(lengths == 1){
                //自动填
                var info = $('.accord-with-list').eq(2).children();
                //序列号、规格型号、是否耐用、单位、品质、质保期、剩余数量
                workDone.goodsId = info.children('.dataSn').html();
                workDone.size = info.attr('data-size');
                workDone.picked = info.children('.dataIsSpare').attr('data-isspare');
                workDone.unit = info.attr('data-unit');
                workDone.quality = info.attr('data-quality');
                workDone.warranty = info.attr('data-warranty');
                workDone.redundant = info.children('.dataNum').html();
                if(workDone.picked == 0){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(1).addClass('checked');
                }else if(workDone.picked == 1){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(0).addClass('checked');
                }
                var outPrice = '';
                if(info.children('.dataNum').html() == 0){
                    outPrice = ''
                }else{
                    outPrice = parseFloat(info.attr('data-amount'))/parseFloat(info.children('.dataNum').html());
                }
                workDone.outPrice = outPrice.toFixed(2);
                workDone.num = 0;
                //workDone.outPrice = '';
                workDone.amount = 0;
                workDone.gdCode = '';
                workDone.chezhan = '';
                workDone.remark = '';
            }else{
                //其他项初始化
                workDone.goodsId = '';
                workDone.size = '';
                workDone.picked = 0;
                workDone.unit = '';
                workDone.quality = '';
                workDone.warranty = '';
                workDone.num = 0;
                workDone.redundant = 0;
                workDone.outPrice = '';
                workDone.amount = 0;
                workDone.gdCode = '';
                workDone.chezhan = '';
                workDone.remark = '';
                if(workDone.picked == 0){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(1).addClass('checked');
                }else if(workDone.picked == 1){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(0).addClass('checked');
                }
            }
            //更改车站列表
            var str1 = '';
            //符合编码的工单数组
            var eligibleArr = [];
            //不符合编码的工单数组
            var inconformityArr =[];
            //首先判断的是每个工单的材料id
            for(var i=0;i<_gdArr.length;i++){
                var arrSplit = _gdArr[i].wxClIds.split(',');
                for(var j=0;j<arrSplit.length;j++){
                    if(workDone.bianhao == arrSplit[j]){
                        eligibleArr.push(_gdArr[i]);
                    }
                }
                inconformityArr.push(_gdArr[i]);
            }
            for(var i=0;i<eligibleArr.length;i++){
                str1 += '<div data-dds="' + eligibleArr[i].bxKeshiNum +
                    '"data-ddsName="' + eligibleArr[i].bxKeshi +
                    '" data-gd="' + eligibleArr[i].gdCode +
                    '"style="background: #f5d38c;">' +'<span class="dataGD">' +
                    eligibleArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + eligibleArr[i].wxClNames +
                    '</span>' + '<span>' + eligibleArr[i].bxKeshi +
                    '</span>' + '</div>';
            }
            for(var i=0;i<eligibleArr.length;i++){
                inconformityArr.removeByValue(eligibleArr[i].gdCode2,'gdCode2');
            }
            for(var i=0;i<inconformityArr.length;i++){
                str1 += '<div data-dds="' + inconformityArr[i].bxKeshiNum +
                    '"data-ddsName="' + inconformityArr[i].bxKeshi +
                    '" data-gd="' + inconformityArr[i].gdCode +
                    '">' +'<span class="dataGD">' +
                    inconformityArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + inconformityArr[i].wxClNames +
                    '</span>' + '<span>' + inconformityArr[i].bxKeshi +
                    '</span>' + '</div>';
            }
            $('.pinzhixx').eq(1).empty().append(str1);
            _num = -1;

            //workDone.bianhao = $(this).children('.dataNum').html();
            //workDone.mingcheng = $(this).children('.dataName').html();
            //$(this).parents('.accord-with-list').hide();
            //_num =-1;
        })
        .on('mouseover','li',function(){
            $(this).parent('.accord-with-list').children('li').removeClass('li-color');
            $(this).addClass('li-color');
            _num = $('.li-color').index();
        });

    //序列号选择
    $('.accord-with-list').eq(2)
        .on('click','li',function(e){
            workDone.goodsId = $(this).children('.dataSn').html();
            workDone.picked = $(this).children('.dataIsSpare').attr('data-isspare');
            workDone.unit = $(this).attr('data-unit');
            workDone.quality = $(this).attr('data-quality');
            workDone.warranty = $(this).attr('data-warranty');
            workDone.size = $(this).attr('data-size');
            workDone.redundant = $(this).children('.dataNum').html();
            if(workDone.picked == 0){
                $('.inpus').parent('span').removeClass('checked');
                $('.inpus').parent('span').eq(1).addClass('checked');
            }else if(workDone.picked == 1){
                $('.inpus').parent('span').removeClass('checked');
                $('.inpus').parent('span').eq(0).addClass('checked');
            }
            $(this).parents('.accord-with-list').hide();
            //其他项初始化
            workDone.num = 0;
            //workDone.outPrice = '';
            workDone.amount = 0;
            workDone.gdCode = '';
            workDone.chezhan = '';
            workDone.remark = '';
            _num = -1;
            var outPrice = '';
            var info = $('.accord-with-list').eq(2).children();
            if(info.children('.dataNum').html() == 0){
                outPrice = ''
            }else{
                outPrice = parseFloat(info.attr('data-amount'))/parseFloat(info.children('.dataNum').html());
            }
            workDone.outPrice = Number(outPrice).toFixed(2);
        })
        .on('mouseover','li',function(){
            $(this).parent('.accord-with-list').children('li').removeClass('li-color');
            $(this).addClass('li-color');
            _num = $('.li-color').index();
        });

    $(document).click(function(){
        $('.hidden1').hide();
    });

    //点击放大镜，获取工单弹出框
    $('.fdjImg').click(function(){

        $('#gdzt').val(5);

        //材料申请是否已审批（默认已审批）
        $('#isExamine').parent('span').addClass('checked');

        _moTaiKuang($('#myModal7'), '工单', '', '' ,'', '确定');

        datasTable($('#gdTable'),_gdArr)

    })

    //工单条件查询
    $('#selectedGD').click(function(){

        GDselect($('#gdzt').val());

    })

    //工单选择
    $('#gdTable tbody').on('click','input',function(){

        $('#gdTable tbody').find('input').parents('span').removeClass('checked');

        $('#gdTable tbody').find('tr').removeClass('tables-hover')

        $(this).parent('span').addClass('checked');

        $(this).parents('tr').addClass('tables-hover');

    })

    $('.rukuGD').click(function(){

        var table = $('#gdTable tbody').find('.checked').parents('tr').children('.gdCodes');

        $('.gdCode').attr('gdCode',table.children().attr('data-gdcode'));

        workDone.gdCode = table.children().html();

        workDone.chezhan = $('#gdTable tbody').find('.checked').parents('tr').children('.bxKS').html();

        $('.chezhan').attr('data-num',$('#gdTable tbody').find('.checked').parents('tr').children('.bxKS').html());

        $('.chezhan').attr('data-name',table.children().attr('data-czcode'));

        $('#myModal7').modal('hide');
    })

    //工单条件选择
    $('#isExamine').click(function(){

        if( $(this).parent('.checked').length == 0 ){

            $(this).parent('span').addClass('checked');

        }else{

            $(this).parent('span').removeClass('checked');

        }

    })


    //仓库改变的情况下，其他项均清空
    //$('.cangku').on('change',function(){
    //
    //    console.log('change');
    //
    //})

    /*------------------------------------表格数据--------------------------------*/

    warehouse();
    /*------------------------------------其他方法-------------------------------*/
    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var realityStart = filterInput[1] + ' 00:00:00';
        var realityEnd = moment(filterInput[2]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var ckArr = [];
        for(var i=0;i<_ckArr.length;i++){
            ckArr.push(_ckArr[i].storageNum);
        }
        var prm = {
            'st':realityStart,
            'et':realityEnd,
            'orderNum':filterInput[0],
            'outType':$('.tiaojian').val(),
            'storageNums':ckArr,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorage',
            data:prm,
            success:function(result){
                _allData.length = 0;
                var confirm = [];
                var confirmed = [];
                    for(var i=0;i<result.length;i++){
                        _allData.push(result[i]);
                        if(result[i].status == 0){
                            confirm.push(result[i])
                        }else if(result[i].status == 1){
                            confirmed.push(result[i])
                        }
                    }
                    datasTable($('#scrap-datatables1'),confirm);
                    datasTable($('#scrap-datatables2'),confirmed);
                    datasTable($('#scrap-datatables'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //控制模态框的设置，出现确定按钮的话，第三个参数传''，第四个才有效,用不到的参数一定要传''；istap,如果有值的话，内容改变，否则内容不变。
    function _moTaiKuang(who, title, flag, istap ,meg, buttonName) {
        who.modal({
            show: false,
            backdrop: 'static'
        })
        who.find('.modal-title').html(title);
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight) / 2;
        who.find('.modal-dialog').css({'margin-top': markBlockTop});
        if (flag) {
            who.find('.btn-primary').hide();
        } else {
            who.find('.btn-primary').show();
            who.find('.modal-footer').children('.btn-primary').html(buttonName);
        }
        if(istap){
            who.find('.modal-body').html(meg);
        }
    }

    //表格初始化
    function tableInit(tableId,col,buttons,flag,fnRowCallback,drawCallback){
        var _tables = tableId.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": true,   //是否分页
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
                'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                'infoEmpty': '没有数据',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            "dom":'B<"clear">lfrtip',
            'buttons':buttons,
            "columns": col,
            "fnRowCallback": fnRowCallback,
            "drawCallback":drawCallback
        })
        if(flag){
            _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
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

    //根据value删除数组
    Array.prototype.removeByValue = function(val) {
        for(var i=0; i<this.length; i++) {
            if(this[i].itemNum == val) {
                this.splice(i, 1);
                break;
            }
        }
    }

    //仓库选择(出库物品option flag)
    function warehouse(){
        var prm = {
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            "hasLocation":1
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:prm,
            async:false,
            success:function(result){
                _ckArr.length = 0;
                var str = '<option value="">请选择</option>';
                var str1 = '';
                    for(var i=0;i<result.length;i++){
                        str += '<option value="' + result[i].storageNum + '">' + result[i].storageName + '</option>';

                        _ckArr.push(result[i]);
                        str1 += '<li data-num="' + result[i].storageNum + '"data-name="' + result[i].storageName +
                            '">' + result[i].storageName + '</li>'
                    }
                //选择出库物品列表
                $('#ckSelect1').empty().append(str);
                $('.pinzhixx').eq(0).empty().append(str1);

                //加载数据
                conditionSelect();

                wlList();
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有库区
    function reservoir(num){
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetLocations',
            data:{
                'userID':_userIdNum,
                'userName':_userIdName,
                'b_UserRole':_userRole,
                'storageNum':num
            },
            success:function(result){
                _kqArr.length = 0;
                for(var i=0;i<result.length;i++){
                    _kqArr.push(result[i]);
                }
                kqList(result,$('#workDone').find('.kuqu-list'));

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取物品列表
    function wlList(flag){
        var ckarr = [];
        for(var i=0;i<_ckArr.length;i++){
            ckarr.push(_ckArr[i].storageNum);
        }
        var prm = {
            'ItemNum':$('.filterInput1').eq(0).val(),
            'itemName':$('.filterInput1').eq(1).val(),
            'storageNum':$('#ckSelect').val(),
            'storageNums':ckarr,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            'hasNum':1
        }
        if( $('#ckSelect1').val() == ''){
            prm.storageNum = '';
            prm.storageNums = ckarr;
        }else{
            prm.storageNum = $('#ckSelect').val();
            prm.storageNums = [];
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptItemStock',
            async:false,
            data:prm,
            success:function(result){
                _wpListArr.length = 0;
                for(var i=0;i<result.length;i++){
                    _wpListArr.push(result[i]);
                }
                //给物品编码和物品名称赋值
                var str = '';
                for(var i=0;i<result.length;i++){
                    str += '<li data-durable="' + result[i].isSpare +
                        '"' + 'data-unit="' + result[i].unitName +
                        '"data-quality="' + result[i].batchNum +
                        '"data-maintainDate="' +  result[i].maintainDate +
                        '"' + 'data-sn="' + result[i].sn +
                        '"' + 'data-shengyu="' + result[i].num +
                        '"' +
                        '>' + '<span class="dataNum">' + result[i].itemNum +'</span>' +
                        '<span class="dataName" style="margin-left: 20px;">' +  result[i].itemName +'</span>' +
                        '<span class="dataSize" style="margin-left: 20px;">' +
                        result[i].size+'</span>' +
                        '</li>'
                }

                $('.accord-with-list').eq(0).empty().append(str);
                $('.accord-with-list').eq(1).empty().append(str);
                if(flag){
                    datasTable($('#wuPinListTable'),result);
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //入库类型
    function rkLX(flag){
        var prm = {
            "catType": 2,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetInOutCate',
            data:prm,
            success:function(result){
                if(flag){
                    var str = '<option value="">全部</option>';
                    for(var i=0;i<result.length;i++){
                        str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';
                    }
                    $('.tiaojian').empty().append(str);
                }else{
                    var str = '<option value="">请选择</option>';
                    for(var i=0;i<result.length;i++){
                        str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';
                    }
                    $('#rkleixing').empty().append(str);
                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取车站
    function chezhan(){
        var prm = {
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            'ddName':''
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDDs',
            data:prm,
            success:function(result){
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].ddNum + '">' + result[i].ddName + '</option>';
                }
                $('#chezhan').empty().append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //键盘选择出库产品(专门针对物品id的)
    function keySelect(value,index,flag){
        var e = e || window.event;
        //下键40 上键38
        if(e.keyCode == 40){
            //按下键的时候，
            //获得所有li
            var lis = $('.accord-with-list').eq(index).children('li');
            if(_num<lis.length-1){
                _num ++;
            }else{
                _num = lis.length-1;
            }
            lis.removeClass('li-color');
            lis.eq(_num).addClass('li-color');
            //首先获取ul的高度
            var ulHeight = $('.accord-with-list').eq(index).height();
            var num = parseInt(ulHeight/30);
            //判断放了几个ul
            if(_num > num){
                var height = (_num - num) * 30;
                $('.accord-with-list').eq(index).scrollTop(height);
            }
        }else if(e.keyCode == 38){
            var lis = $('.accord-with-list').eq(index).children('li');
            if(_num<1){
                _num =0;
            }else{
                _num--;
            }
            lis.removeClass('li-color');
            lis.eq(_num).addClass('li-color');
            //首先获取ul的高度
            var ulHeight = $('.accord-with-list').eq(index).height();
            var num = parseInt(ulHeight/30);
            if(_num < lis.length -num){
                var height = (_num-num) * 30;
                $('.accord-with-list').eq(index).scrollTop(height);
            }

        }else if(e.keyCode == 13){
            _num = -1;
            if(flag){
                var lis = $('.accord-with-list').eq(index).children('li');
                for(var i=0;i<lis.length;i++){
                    if(lis.eq(i).attr('class') == 'li-color'){

                        workDone.goodsId = lis.eq(i).children('.dataSn').html();

                        workDone.size = lis.eq(i).attr('data-size');

                        $('.inpus').parent('span').removeClass('checked');

                        workDone.picked = lis.eq(i).children('.dataIsSpare').attr('data-isspare');

                        if(lis.eq(i).children('.dataIsSpare').attr('data-isspare') == 0){

                            $('#twos').parent('span').addClass('checked');

                        }else if(lis.eq(i).children('.dataIsSpare').attr('data-isspare') == 1){


                            $('#ones').parent('span').addClass('checked');

                        }
                        var outPrice = '';

                        if(lis.eq(i).children('.dataNum').html() == 0){

                            outPrice = ''

                        }else{

                            outPrice = parseFloat(lis.eq(i).attr('data-amount'))/parseFloat(lis.eq(i).children('.dataNum').html());

                        }
                        workDone.outPrice = outPrice.toFixed(2);
                        workDone.unit = lis.eq(i).attr('data-unit');
                        workDone.quality = lis.eq(i).attr('data-quality');
                        workDone.warranty = lis.eq(i).attr('data-warranty');
                        workDone.redundant = lis.eq(i).children('.dataNum').html();
                        workDone.num = '';
                        //workDone.outPrice = '';
                        workDone.amount = '';
                        workDone.remark = '';
                    }
                }
                //选择完之后，关闭
                $('.accord-with-list').hide();
                setTimeout(function(){
                    if(workDone.size != ''){
                        $('.inputType').eq(11).focus();
                    }
                },200);
            }else{
                var lis = $('.accord-with-list').eq(index).children('li');
                //赋值
                for(var i=0;i<lis.length;i++){
                    if(lis.eq(i).attr('class') == 'li-color'){
                        workDone.bianhao = lis.eq(i).children('.dataNum').html();
                        workDone.mingcheng = lis.eq(i).children('.dataName').html();
                        //选择完之后，关闭
                        $('.accord-with-list').hide();
                    }
                }
                //获得物品序列号列表
                var str2 = ''
                if(workDone.kuwei == ''){
                    for(var i=0;i<_wpListArr.length;i++){
                        if($('.cangku').attr('data-num') == _wpListArr[i].storageNum && workDone.bianhao == _wpListArr[i].itemNum){
                            //确定序列号
                            var isSpareStr = '';
                            if(_wpListArr[i].isSpare == 0){
                                isSpareStr = '消耗品';
                            }else if(_wpListArr[i].isSpare == 1){
                                isSpareStr = '耐用品';
                            }
                            var snStr = '';
                            if(_wpListArr[i].sn == ''){
                                snStr = ' ';
                            }else{
                                snStr = _wpListArr[i].sn;
                            }
                            str2 += '<li data-amount="' + _wpListArr[i].amount+
                                '"data-size="' + _wpListArr[i].size +
                                '"data-unit="' + _wpListArr[i].unitName + '"data-quality="' + _wpListArr[i].batchNum +
                                '"data-warranty="' + _wpListArr[i].maintainDate +'"'+
                                '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + _wpListArr[i].isSpare +
                                '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + _wpListArr[i].num + '</span>' +
                                '<span class="dataStorageName" style="margin-left: 10px;">' + _wpListArr[i].storageName +
                                '</span>'+ '<span style="margin: 0 10px;">' + _wpListArr[i].batchNum +
                                '</span>'+ '<span>' + _wpListArr[i].localName +
                                '</span>'
                                +'</li>';
                        }
                    }
                }else if(workDone.kuwei != ''){
                    for(var i=0;i<_wpListArr.length;i++){
                        if($('.cangku').attr('data-num') == _wpListArr[i].storageNum && workDone.bianhao == _wpListArr[i].itemNum && $('.kuwei').attr('data-num')==_wpListArr[i].localNum){
                            //确定序列号
                            var isSpareStr = '';
                            if(_wpListArr[i].isSpare == 0){
                                isSpareStr = '消耗品';
                            }else if(_wpListArr[i].isSpare == 1){
                                isSpareStr = '耐用品';
                            }
                            var snStr = '';
                            if(_wpListArr[i].sn == ''){
                                snStr = ' ';
                            }else{
                                snStr = _wpListArr[i].sn;
                            }
                            str2 += '<li data-amount="' + _wpListArr[i].amount+
                                '"data-size="' + _wpListArr[i].size +
                                '"data-unit="' + _wpListArr[i].unitName + '"data-quality="' + _wpListArr[i].batchNum +
                                '"data-warranty="' + _wpListArr[i].maintainDate +'"'+
                                '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + _wpListArr[i].isSpare +
                                '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + _wpListArr[i].num + '</span>' +
                                '<span class="dataStorageName" style="margin-left: 10px;">' + _wpListArr[i].storageName +
                                '</span>'+ '<span style="margin: 0 10px;">' + _wpListArr[i].batchNum +
                                '</span>'+ '<span>' + _wpListArr[i].localName +
                                '</span>'
                                +'</li>';
                        }
                    }
                }

                $('.accord-with-list').eq(2).empty().append(str2);
                //判断长度，如果等于1，制动赋值
                var lengths = $('.accord-with-list').eq(2).children('li').length;
                if(lengths == 1){
                    //自动填
                    var info = $('.accord-with-list').eq(2).children();
                    //序列号、规格型号、是否耐用、单位、品质、质保期、剩余数量
                    workDone.goodsId = info.children('.dataSn').html();
                    workDone.size = info.attr('data-size');
                    workDone.picked = info.children('.dataIsSpare').attr('data-isspare');
                    workDone.unit = info.attr('data-unit');
                    workDone.quality = info.attr('data-quality');
                    workDone.warranty = info.attr('data-warranty');
                    workDone.redundant = info.children('.dataNum').html();
                    if(workDone.picked == 0){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(1).addClass('checked');
                    }else if(workDone.picked == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(0).addClass('checked');
                    }
                    var outPrice = '';
                    if(info.children('.dataNum').html() == 0){
                        outPrice = '0.00'
                    }else{
                        outPrice = parseFloat(info.attr('data-amount'))/parseFloat(info.children('.dataNum').html());
                    }
                    workDone.outPrice = Number(outPrice).toFixed(2);
                    workDone.num = 0;
                    //workDone.outPrice = '';
                    workDone.amount = 0;
                    workDone.gdCode = '';
                    workDone.chezhan = '';
                    workDone.remark = '';
                    setTimeout(function(){
                        if(workDone.bianhao != ''){
                            $('.inputType').eq(11).focus();
                        }
                    },200);
                }else{
                    workDone.goodsId = '';
                    workDone.size = '';
                    workDone.picked = 0;
                    workDone.unit = '';
                    workDone.quality = '';
                    workDone.warranty = '';
                    workDone.num = 0;
                    workDone.redundant = 0;
                    workDone.outPrice = '';
                    workDone.amount = 0;
                    workDone.gdCode = '';
                    workDone.chezhan = '';
                    workDone.remark = '';
                    if(workDone.picked == 0){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(1).addClass('checked');
                    }else if(workDone.picked == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(0).addClass('checked');
                    }
                    setTimeout(function(){
                        if(workDone.bianhao != ''){
                            $('.inputType').eq(4).focus();
                        }
                    },200);
                }
                //更改车站列表
                var str1 = '';
                var eligibleArr = [];
                var inconformityArr =[];
                //首先判断的是每个工单的材料id
                for(var i=0;i<_gdArr.length;i++){
                    var arrSplit = _gdArr[i].wxClIds.split(',');
                    for(var j=0;j<arrSplit.length;j++){
                        if(workDone.bianhao == arrSplit[j]){
                            eligibleArr.push(_gdArr[i]);
                        }
                    }
                    inconformityArr.push(_gdArr[i]);
                }
                for(var i=0;i<eligibleArr.length;i++){
                    str1 += '<div data-dds="' + eligibleArr[i].bxKeshiNum +
                        '"data-ddsName="' + eligibleArr[i].bxKeshi +
                        '" data-gd="' + eligibleArr[i].gdCode +
                        '" style="background: #f5d38c;">' +'<span class="dataGD">' +
                        eligibleArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + eligibleArr[i].wxClNames +
                        '</span>' + '<span>' + eligibleArr[i].bxKeshi +
                        '</span>' + '</div>';
                }
                for(var i=0;i<eligibleArr.length;i++){
                    inconformityArr.removeByValue(eligibleArr[i].gdCode2,'gdCode2');
                }
                for(var i=0;i<inconformityArr.length;i++){
                    str1 += '<div data-dds="' + inconformityArr[i].bxKeshiNum +
                        '"data-ddsName="' + inconformityArr[i].bxKeshi +
                        '" data-gd="' + inconformityArr[i].gdCode +
                        '">' +'<span class="dataGD">' +
                        inconformityArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + inconformityArr[i].wxClNames +
                        '</span>' + '<span>' + inconformityArr[i].bxKeshi +
                        '</span>' + '</div>';
                }
                $('.pinzhixx').eq(1).empty().append(str1);
            }
        }else{
            if(e.keyCode != 9){
                _num =-1;
                $('.accord-with-list').eq(index).empty();
                //将符合输入的项列出来
                var searchValue = value;
                var includeArr = [];
                var str = '';
                for(var i=0;i<_wpListArr.length;i++){
                    if(flag){
                        if(workDone.kuwei == ''){
                            if($('.cangku').attr('data-num') == _wpListArr[i].storageNum && _wpListArr[i].itemNum == workDone.bianhao){
                                if(_wpListArr[i].sn.indexOf(searchValue)>=0){
                                    var isSpareStr = '';
                                    if(_wpListArr[i].isSpare == 0){
                                        isSpareStr = '消耗品';
                                    }else if(_wpListArr[i].isSpare == 1){
                                        isSpareStr = '耐用品';
                                    }
                                    var snStr = '';
                                    if(_wpListArr[i].sn == ''){
                                        snStr = ' ';
                                    }else{
                                        snStr = _wpListArr[i].sn;
                                    }
                                    str += '<li data-amount="' + _wpListArr[i].amount+
                                        '"data-size="' + _wpListArr[i].size +
                                        '"data-unit="' + _wpListArr[i].unitName + '"data-quality="' + _wpListArr[i].batchNum +
                                        '"data-warranty="' + _wpListArr[i].maintainDate +'"'+
                                        '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + _wpListArr[i].isSpare +
                                        '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + _wpListArr[i].num + '</span>' +
                                        '<span class="dataStorageName" style="margin-left: 10px;">' + _wpListArr[i].storageName + '</span><span style="margin-left: 20px;">' + _wpListArr[i].localName +
                                        '</span>' +'</li>'
                                }
                            }
                        }else if(workDone.kuwei != ''){
                            if($('.cangku').attr('data-num') == _wpListArr[i].storageNum && _wpListArr[i].itemNum == workDone.bianhao && _wpListArr[i].localNum == $('.kuwei').attr('data-num')){
                                if(_wpListArr[i].sn.indexOf(searchValue)>=0){
                                    var isSpareStr = '';
                                    if(_wpListArr[i].isSpare == 0){
                                        isSpareStr = '消耗品';
                                    }else if(_wpListArr[i].isSpare == 1){
                                        isSpareStr = '耐用品';
                                    }
                                    var snStr = '';
                                    if(_wpListArr[i].sn == ''){
                                        snStr = ' ';
                                    }else{
                                        snStr = _wpListArr[i].sn;
                                    }
                                    str += '<li data-amount="' + _wpListArr[i].amount+
                                        '"data-size="' + _wpListArr[i].size +
                                        '"data-unit="' + _wpListArr[i].unitName + '"data-quality="' + _wpListArr[i].batchNum +
                                        '"data-warranty="' + _wpListArr[i].maintainDate +'"'+
                                        '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + _wpListArr[i].isSpare +
                                        '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + _wpListArr[i].num + '</span>' +
                                        '<span class="dataStorageName" style="margin-left: 10px;">' + _wpListArr[i].storageName + '</span><span style="margin-left: 20px;">' + _wpListArr[i].localName +
                                        '</span>' +'</li>'
                                }
                            }
                        }
                        $('.accord-with-list').eq(0).empty().append(str);
                        $('.accord-with-list').eq(1).empty().append(str);
                    }else{
                        if(workDone.kuwei == ''){
                            if($('.cangku').attr('data-num') == _wpListArr[i].storageNum){
                                if( _wpListArr[i].itemNum == searchValue || _wpListArr[i].itemName == searchValue ){

                                    str += '<li class="li-color" data-durable="' + _wpListArr[i].isSpare +
                                        '"' + 'data-unit="' + _wpListArr[i].unitName +
                                        '"data-quality="' + _wpListArr[i].batchNum +
                                        '"data-maintainDate="' +  _wpListArr[i].maintainDate +
                                        '"' + 'data-sn="' + _wpListArr[i].sn +
                                        '"' + 'data-shengyu="' + _wpListArr[i].num +
                                        '"' +
                                        '>' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                                        '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span>' +
                                        '<span class="dataSize" style="margin-left: 20px;">' +
                                        _wpListArr[i].size+'</span>' + '<span style="margin-left: 20px;">' + _wpListArr[i].localName +
                                        '</span>' +
                                        '</li>'
                                }else{
                                    if(_wpListArr[i].itemNum.indexOf(searchValue)>=0 || _wpListArr[i].itemName.indexOf(searchValue)>=0 ){
                                        includeArr = [];
                                        includeArr.push(_wpListArr[i]);
                                        str += '<li data-durable="' + _wpListArr[i].isSpare +
                                            '"' + 'data-unit="' + _wpListArr[i].unitName +
                                            '"data-quality="' + _wpListArr[i].batchNum +
                                            '"data-maintainDate="' +  _wpListArr[i].maintainDate +
                                            '"' + 'data-sn="' + _wpListArr[i].sn +
                                            '"' + 'data-shengyu="' + _wpListArr[i].num +
                                            '"' +
                                            '>' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                                            '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span>' +
                                            '<span class="dataSize" style="margin-left: 20px;">' +
                                            _wpListArr[i].size+'</span>' + '<span style="margin-left: 20px;">' + _wpListArr[i].localName +
                                            '</span>' +
                                            '</li>'
                                    }
                                }

                                //$('.accord-with-list').eq(index).show();
                                //$('.accord-with-list').eq(index).empty().append(str);
                            }
                        }else if(workDone.kuwei != ''){
                            if($('.cangku').attr('data-num') == _wpListArr[i].storageNum && $('.kuwei').attr('data-num') == _wpListArr[i].localNum){
                                if( _wpListArr[i].itemNum == searchValue ){

                                    str += '<li class="li-color" data-durable="' + _wpListArr[i].isSpare +
                                        '"' + 'data-unit="' + _wpListArr[i].unitName +
                                        '"data-quality="' + _wpListArr[i].batchNum +
                                        '"data-maintainDate="' +  _wpListArr[i].maintainDate +
                                        '"' + 'data-sn="' + _wpListArr[i].sn +
                                        '"' + 'data-shengyu="' + _wpListArr[i].num +
                                        '"' +
                                        '>' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                                        '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span>' +
                                        '<span class="dataSize" style="margin-left: 20px;">' +
                                        _wpListArr[i].size+'</span>' + '<span style="margin-left: 20px;">' + _wpListArr[i].localName +
                                        '</span>' +
                                        '</li>'

                                }else{
                                    if(_wpListArr[i].itemNum.indexOf(searchValue)>=0 || _wpListArr[i].itemName.indexOf(searchValue)>=0 ){
                                        includeArr = [];
                                        includeArr.push(_wpListArr[i]);
                                        str += '<li data-durable="' + _wpListArr[i].isSpare +
                                            '"' + 'data-unit="' + _wpListArr[i].unitName +
                                            '"data-quality="' + _wpListArr[i].batchNum +
                                            '"data-maintainDate="' +  _wpListArr[i].maintainDate +
                                            '"' + 'data-sn="' + _wpListArr[i].sn +
                                            '"' + 'data-shengyu="' + _wpListArr[i].num +
                                            '"' +
                                            '>' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                                            '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span>' +
                                            '<span class="dataSize" style="margin-left: 20px;">' +
                                            _wpListArr[i].size+'</span>' + '<span style="margin-left: 20px;">' + _wpListArr[i].localName +
                                            '</span>' +
                                            '</li>'
                                    }
                                }

                            }
                        }
                    }
                }
                $('.accord-with-list').eq(index).show();
                $('.accord-with-list').eq(index).empty().append(str);
            }
        }
    }

    //获取所有工单
    //function gdList(){
    //    var prm = {
    //        gdCode2:'',
    //        gdSt:'',
    //        gdEt:'',
    //        gdGuanbiSt:'',
    //        gdGuanbiEt:'',
    //        gdZht:'4',
    //        gdJJ:'',
    //        dlNum:'',
    //        gdLeixing:'',
    //        'userID':_userIdNum,
    //        'userName':_userIdName,
    //        'b_UserRole':_userRole,
    //        wxShiXNum:'',
    //        isApplyWxCl:1
    //    }
    //    $.ajax({
    //        type:'post',
    //        url: _urls + 'YWGD/ywGDGetZh2',
    //        data:prm,
    //        async:false,
    //        success:function(result){
    //            _gdArr = [];
    //            var str = '';
    //            for(var i=0;i<result.length;i++){
    //                _gdArr.push(result[i]);
    //                str += '<div data-dds="' + _gdArr[i].bxKeshiNum +
    //                    '"data-ddsName="' + _gdArr[i].bxKeshi +
    //                    '" data-gd="' + _gdArr[i].gdCode +
    //                    '">' +'<span class="dataGD">' +
    //                    _gdArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + _gdArr[i].wxClNames +
    //                    '</span>' + '<span>' + _gdArr[i].bxKeshi +
    //                    '</span>' + '</div>';
    //            }
    //            $('.pinzhixx').eq(1).empty().append(str);
    //        },
    //        error:function(jqXHR, textStatus, errorThrown){
    //            console.log(jqXHR.responseText);
    //        }
    //    })
    //}

    //键盘选择工单和仓库(仓库不关联车站，用flag)
    function keyGDCK(value,index,flag){
        var e = e || window.event;
        //下键40 上键38
        if(e.keyCode == 40){
            //按下键的时候，
            //获得所有li
            var lis = $('.pinzhixx').eq(index).children('div');
            if(_pzNum<lis.length-1){
                _pzNum ++;
            }else{
                _pzNum = lis.length-1;
            }
            lis.removeClass('li-color');
            lis.eq(_pzNum).addClass('li-color');
            //首先获取ul的高度
            var ulHeight = $('.pinzhixx').eq(index).height();
            var num = parseInt(ulHeight/30)-3;
            //判断放了几个ul
            if(_pzNum > num){
                var height = (_pzNum - num) * 30;
                $('.pinzhixx').eq(index).scrollTop(height);
            }
        }else if(e.keyCode == 38){
            var lis = $('.pinzhixx').eq(index).children('div');
            if(_pzNum<1){
                _pzNum =0;
            }else{
                _pzNum--;
            }
            lis.removeClass('li-color');
            lis.eq(_pzNum).addClass('li-color');
            //首先获取ul的高度
            var ulHeight = $('.pinzhixx').eq(index).height();
            var num = parseInt(ulHeight/30)-3;
            if(_pzNum < lis.length -num){
                var height = (_pzNum-num) * 30;
                $('.pinzhixx').eq(index).scrollTop(height);
            }

        }else if(e.keyCode == 13){
            _pzNum = -1;
            var lis = $('.pinzhixx').eq(index).children('div');
            for(var i=0;i<lis.length;i++){
                if(flag){
                    if(lis.eq(i).attr('class') == 'li-color'){
                        workDone.ck = lis.eq(i).html();
                        $('.cangku').attr('data-num',lis.eq(i).attr('data-num'));
                        $('.cangku').attr('data-name',lis.eq(i).attr('data-name'));
                        //选择完之后，关闭
                        $('.pinzhixx').eq(index).hide();
                        var arr = [];
                        var str = '';
                        for(var i=0;i<_wpListArr.length;i++){
                            if($('.cangku').attr('data-num') == _wpListArr[i].storageNum){
                                //确定编码的列表
                                str += '<li data-durable="' + _wpListArr[i].isSpare +
                                    '"' + 'data-unit="' + _wpListArr[i].unitName +
                                    '"data-quality="' + _wpListArr[i].batchNum +
                                    '"data-maintainDate="' +  _wpListArr[i].maintainDate +
                                    '"' + 'data-sn="' + _wpListArr[i].sn +
                                    '"' + 'data-shengyu="' + _wpListArr[i].num +
                                    '"' +
                                    '>' + '<span class="dataNum">' + _wpListArr[i].itemNum +'</span>' +
                                    '<span class="dataName" style="margin-left: 20px;">' +  _wpListArr[i].itemName +'</span>' +
                                    '<span class="dataSize" style="margin-left: 20px;">' + _wpListArr[i].size+ '</span>' +
                                    '<span style="margin-left: 20px;">' + _wpListArr[i].localName +
                                    '</span>' +
                                    '</li>'
                            }
                        }
                        $('.accord-with-list').eq(0).empty().append(str);
                        $('.accord-with-list').eq(1).empty().append(str);
                        $.ajax({
                            type:'post',
                            url:_urls + 'YWCK/ywCKGetStorages',
                            data:{
                                'storageNum':$('.cangku').attr('data-num'),
                                'hasLocation':1,
                                'userID':_userIdNum,
                                'userName':_userIdName,
                                'b_UserRole':_userRole,
                            },
                            timeout:30000,
                            success:function(result){
                                var str = '';
                                _kuquArr = [];
                                for(var i=0;i<result.length;i++){
                                    for(var j=0;j<result[i].locations.length;j++){
                                        _kuquArr.push(result[i].locations[j]);
                                        str += '<li data-num="' + result[i].locations[j].localNum + '">' + result[i].locations[j].localName + '</li>'
                                    }
                                }
                                $('.kuqu-list').empty().append(str);
                            },
                            error:function(jqXHR, textStatus, errorThrown){
                                console.log(jqXHR.responseText);
                            }
                        })
                        //if(arr.length == 0){
                        //    _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'该仓库无库存，请选择其他仓库', '');
                        //}
                    }
                    //其他项初始化
                    workDone.bianhao = '';
                    workDone.mingcheng = '';
                    workDone.goodsId = '';
                    workDone.size = '';
                    workDone.picked = 0;
                    workDone.unit = '';
                    workDone.quality = '';
                    workDone.warranty = '';
                    workDone.num = 0;
                    workDone.redundant = 0;
                    workDone.outPrice = '';
                    workDone.amount = 0;
                    workDone.gdCode = '';
                    workDone.chezhan = '';
                    workDone.remark = '';
                    if(workDone.picked == 0){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(1).addClass('checked');
                    }else if(workDone.picked == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(0).addClass('checked');
                    }
                }else{
                    if(lis.eq(i).attr('class') == 'li-color'){
                        workDone.gdCode = lis.eq(i).children('.dataGD').html();
                        $('.gdCode').attr('gdCode',lis.eq(i).attr('data-gd'));
                        workDone.chezhan = lis.eq(i).attr('data-ddsName');
                        $('.chezhan').attr('data-num',lis.eq(i).attr('data-dds'));
                        $('.chezhan').attr('data-name',lis.eq(i).attr('data-ddsname'));
                        //选择完之后，关闭
                        $('.pinzhixx').eq(index).hide();
                    }
                }
            }
        }else{
            if(e.keyCode != 9){
                $('.pinzhixx').eq(index).empty();
                //将符合输入的项列出来
                var searchValue = value;
                var includeArr = [];
                if(flag){
                        var str = '';
                        for(var i=0;i<_ckArr.length;i++){
                            if( _ckArr[i].storageName == searchValue ){

                                str +='<div data-num="' + _ckArr[i].storageNum + '"data-name="' + _ckArr[i].storageName +
                                    '">' + _ckArr[i].storageName + '</div>'
                                //并且自动绑定值
                                $('.cangku').attr('data-num',_ckArr[i].storageNum);
                                $('.cangku').attr('data-name',_ckArr[i].storageName);
                                setTimeout(function(){
                                    $('.pinzhixx').eq(index).hide();
                                },600);
                                //加载库区
                                $.ajax({
                                    type:'post',
                                    url:_urls + 'YWCK/ywCKGetStorages',
                                    data:{
                                        'storageNum':$('.cangku').attr('data-num'),
                                        'hasLocation':1,
                                        'userID':_userIdNum,
                                        'userName':_userIdName,
                                        'b_UserRole':_userRole,
                                    },
                                    timeout:30000,
                                    success:function(result){
                                        var str = '';
                                        _kuquArr = [];
                                        for(var i=0;i<result.length;i++){
                                            for(var j=0;j<result[i].locations.length;j++){
                                                _kuquArr.push(result[i].locations[j]);
                                                str += '<li data-num="' + result[i].locations[j].localNum + '">' + result[i].locations[j].localName + '</li>'
                                            }
                                        }
                                        $('.kuqu-list').empty().append(str);
                                    },
                                    error:function(jqXHR, textStatus, errorThrown){
                                        console.log(jqXHR.responseText);
                                    }
                                })
                            }else{
                                if(_ckArr[i].storageName.indexOf(searchValue)>=0 || _ckArr[i].storageNum.indexOf(searchValue)>=0){
                                    includeArr = [];
                                    includeArr.push(_ckArr[i]);
                                    str +='<div data-num="' + _ckArr[i].storageNum + '"data-name="' + _ckArr[i].storageName +
                                        '">' + _ckArr[i].storageName + '</div>'
                                }
                            }
                        }

                    $('.pinzhixx').eq(index).empty().append(str);
                    if(includeArr.length>0){
                        $('.pinzhixx').eq(index).show();
                    }
                }else{
                    var str = '';
                    //根据编码来判断工单是否符合
                    if(workDone.bianhao == ''){
                        for(var i=0;i<_gdArr.length;i++){
                            includeArr = [];
                            includeArr.push(_gdArr[i]);
                            str += '<div data-dds="' + _gdArr[i].bxKeshiNum +
                                '"data-ddsName="' + _gdArr[i].bxKeshi +
                                '" data-gd="' + _gdArr[i].gdCode +
                                '">' +'<span class="dataGD">' +
                                _gdArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + _gdArr[i].wxClNames +
                                '</span>' + '<span>' + _gdArr[i].bxKeshi +
                                '</span>' + '</div>';
                        }
                        $('.pinzhixx').eq(index).empty().append(str);
                        if(includeArr.length>0){
                            $('.pinzhixx').eq(index).show();
                        }
                    }else{
                        //符合条件的数组
                        var eligibleArr = [];
                        //不符合条件的数组
                        var inconformityArr = [];
                        for(var i=0;i<_gdArr.length;i++){
                            var arrSplit = _gdArr[i].wxClIds.split(',');
                            for(var j=0;j<arrSplit.length;j++){
                                if(workDone.bianhao == arrSplit[j]){
                                    eligibleArr.push(_gdArr[i]);
                                }
                            }
                            inconformityArr.push(_gdArr[i]);
                        }
                        for(var i=0;i<eligibleArr.length;i++){
                            if(eligibleArr[i].gdCode2.indexOf(searchValue)>=0){
                                str += '<div data-dds="' + eligibleArr[i].bxKeshiNum +
                                    '"data-ddsName="' + eligibleArr[i].bxKeshi +
                                    '" data-gd="' + eligibleArr[i].gdCode +
                                    '"style="background: #f5d38c;">' +'<span class="dataGD">' +
                                    eligibleArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + eligibleArr[i].wxClNames +
                                    '</span>' + '<span>' + eligibleArr[i].bxKeshi +
                                    '</span>' + '</div>';
                            }
                        }
                        for(var i=0;i<eligibleArr.length;i++){
                            inconformityArr.removeByValue(eligibleArr[i].gdCode2,'gdCode2');
                        }
                        for(var i=0;i<inconformityArr.length;i++){
                            includeArr = [];
                            includeArr.push(_gdArr[i]);
                            str += '<div data-dds="' + inconformityArr[i].bxKeshiNum +
                                '"data-ddsName="' + inconformityArr[i].bxKeshi +
                                '" data-gd="' + inconformityArr[i].gdCode +
                                '">' +'<span class="dataGD">' +
                                inconformityArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + inconformityArr[i].wxClNames +
                                '</span>' + '<span>' + inconformityArr[i].bxKeshi +
                                '</span>' + '</div>';
                        }
                        $('.pinzhixx').eq(index).empty().append(str).show();

                    }
                }

            }
        }
    }

    //根据工单号，获得备件详细信息
    function detailInfo(num,seccessFun){
        var prm = {
            'orderNum':num,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorageDetail',
            data:prm,
            async:false,
            success:function(result){
                seccessFun(result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //更改工单备件状(点击了登记之后循环访问，确定工单号)
    function applySparePart(arr,cl){
        if(arr.length){
            var prm = {
                "gdCodes": arr,
                "clStatusId": 100,
                "clStatus": '备件发货',
                "clLastUptInfo": '',
                'userID':_userIdNum,
                'userName':_userIdName,
                'b_UserRole':_userRole,
                'wxClNames':cl
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDUptMultiPeijStatus',
                data:prm,
                success:function(result){
                    _bjComplete = true;
                    if( result == 99 ){
                        _BjFlag = true;
                    }else{
                        _BjFlag = false;
                    }
                    addBJ();
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })
        }else{
            _BjFlag = '';
            if(_AddFlag){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'新增成功！', '');

                $('#myModal').modal('hide');

                conditionSelect();
            }else{
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'新增失败！', '');
            }
        }
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

    //仓库列表初始化
    function ckList(arr,el){

        var str = '';

        if(arr.length == 1){

            for(var i=0;i<arr.length;i++){

                str +='<li class="li-color" data-num="' + _ckArr[i].storageNum + '"data-name="' + _ckArr[i].storageName +
                    '">' + _ckArr[i].storageName + '</li>'
            }

        }else{

            for(var i=0;i<arr.length;i++){

                str +='<li data-num="' + _ckArr[i].storageNum + '"data-name="' + _ckArr[i].storageName +
                    '">' + _ckArr[i].storageName + '</li>'
            }

        }


        el.empty().append(str);


    }

    //库区列表初始化
    function kqList(arr,el){
        var str = '';

        if( arr.length == 1 ){

            for(var i=0;i<arr.length;i++){

                str += '<li class="li-color" data-num="' + arr[i].localNum + '">' + arr[i].localName + '</li>'

            }

        }else{

            for(var i=0;i<arr.length;i++){

                str += '<li data-num="' + arr[i].localNum + '">' + arr[i].localName + '</li>'

            }

        }

        el.empty().append(str);
    }

    //物品列表
    function wpList(arr,el){
        var str = '';
        if(arr.length == 1){

            for(var i=0;i<arr.length;i++){
                str += '<class="li-color" li data-durable="' + arr[i].isSpare +
                    '"' + 'data-unit="' + arr[i].unitName +
                    '"data-quality="' + arr[i].batchNum +
                    '"data-maintainDate="' +  arr[i].maintainDate +
                    '"' + 'data-sn="' + arr[i].sn +
                    '"' + 'data-shengyu="' + arr[i].num +
                    '"' +
                    '>' + '<span class="dataNum">' + arr[i].itemNum +'</span>' +
                    '<span class="dataName" style="margin-left: 20px;">' +  arr[i].itemName +'</span>' +
                    '<span class="dataSize" style="margin-left: 20px;">' +
                    arr[i].size+'</span>' + '<span style="margin-left: 20px;">' + arr[i].localName +
                    '</span>' +
                    '</li>';
            }

        }else{

            for(var i=0;i<arr.length;i++){
                str += '<li data-durable="' + arr[i].isSpare +
                    '"' + 'data-unit="' + arr[i].unitName +
                    '"data-quality="' + arr[i].batchNum +
                    '"data-maintainDate="' +  arr[i].maintainDate +
                    '"' + 'data-sn="' + arr[i].sn +
                    '"' + 'data-shengyu="' + arr[i].num +
                    '"' +
                    '>' + '<span class="dataNum">' + arr[i].itemNum +'</span>' +
                    '<span class="dataName" style="margin-left: 20px;">' +  arr[i].itemName +'</span>' +
                    '<span class="dataSize" style="margin-left: 20px;">' +
                    arr[i].size+'</span>' + '<span style="margin-left: 20px;">' + arr[i].localName +
                    '</span>' +
                    '</li>';
            }

        }

        el.empty().append(str);
    }

    //序列号
    function xlhList(arr,el){
        var str = '';
        var snStr = '';
        var isSpareStr = '';
        for(var i=0;i<arr.length;i++){
            if(arr[i].sn == ''){
                snStr = ' ';
            }else{
                snStr = arr[i].sn;
            }
            if(arr[i].isSpare == 0){
                isSpareStr = '消耗品';
            }else if(arr[i].isSpare == 1){
                isSpareStr = '耐用品';
            }
            str += '<li data-amount="' + arr[i].amount+
                '"data-size="' + arr[i].size +
                '"data-unit="' + arr[i].unitName + '"data-quality="' + arr[i].batchNum +
                '"data-warranty="' + arr[i].maintainDate +'"'+
                '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + arr[i].isSpare +
                '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + arr[i].num + '</span>' +
                '<span class="dataStorageName" style="margin-left: 10px;">' + arr[i].storageName +
                '</span>'+ '<span style="margin: 0 10px;">' + arr[i].batchNum +
                '</span>'+ '<span>' + arr[i].localName +
                '</span>'
                +'</li>';
        }
        el.empty().append(str);
    }

    //工单号
    function gdsList(arr,el){
        var str = '';
        for(var i=0;i<arr.length;i++){
            str += '<div data-dds="' + arr[i].bxKeshiNum +
                '"data-ddsName="' + arr[i].bxKeshi +
                '" data-gd="' + arr[i].gdCode +
                '">' +'<span class="dataGD">' +
                arr[i].gdCode2 +'</span><span style="margin:0 10px;">' + arr[i].wxClNames +
                '</span>' + '<span>' + arr[i].bxKeshi +
                '</span>' + '</div>';
        }
        console.log(el);

        el.empty().append(str);
    }

    //登记、备件发货成功执行
    function addBJ(){
        if( _addComplete && _bjComplete ){
            if(_AddFlag && _BjFlag){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'登记成功，备件发货成功！', '');
            }else if( !_AddFlag && _BjFlag ){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'登记失败，备件发货成功！', '');
            }else if( _AddFlag && !_BjFlag ){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'登记成功，备件发货失败！', '');
            }else if( !_AddFlag && !_BjFlag  ){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'登记失败，备件发货失败！', '');
            }
            conditionSelect();
            $('#myModal').modal('hide');
        }
    }

    //车站
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
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //工单条件查询
    function GDselect(num){

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

        var prm = {
            gdCode2:$('#gdcode').val(),
            gdSt:gdrealityStart,
            gdEt:gdrealityEnd,
            gdZht:num,
            userID:_userIdNum,
            userName:_userIdName,
            wxShiXNum:$('#xtlx').val(),
            gdCodeSrc:$('#gdly').val(),
            bxKeshiNum:$('#station').val()
        }
        if($('#isExamine').parent('.checked').length != 0){

            prm.isApplyWxCl = 1

        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetZh2',
            data:prm,
            timeout:30000,
            success:function(result){

                _gdArr.length = 0;

                for(var i=0;i<_gdArr.length;i++){

                    _gdArr.push(result[i]);

                }
                datasTable($('#gdTable'),result);

                gdsList(result,$('#workDone').find('.pinzhixx').eq(1));
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //键盘事件封装-----------------------------------------------------------------------------------------------------------
    function upDown(ul,enterFun,inputFun){

        var e = e||window.event;

        var chils = ul.children();

        var lengths = 0;

        lengths = chils.length;

        //ul.show();

        if(e.keyCode == 40){

            //console.log('向下');

            if(_numIndex < lengths -1){

                _numIndex ++ ;

            }else{

                _numIndex = lengths -1;

            }

            ul.children().removeClass('li-color');

            ul.children().eq(_numIndex).addClass('li-color');

            //滚动条问题
            if(_numIndex> 4){

                var moveDis = (_numIndex - 4)*40;

                $('ul').scrollTop(moveDis);
            }

        }else if(e.keyCode == 38){

            //console.log('向上');

            if(_numIndex < 1){

                _numIndex =0;

            }else{

                _numIndex--;

            }

            ul.children().removeClass('li-color');

            ul.children().eq(_numIndex).addClass('li-color');

            //滚动条问题
            if(lengths-4>_numIndex){

                var moveDis = (_numIndex - 4)*40;

                $('ul').scrollTop(moveDis);

            }

        }else if(e.keyCode == 13){

            //console.log('回车');

            enterFun();

        }else if(e != 9){

            //console.log('其他');

            inputFun();

        }
    }

    //仓库输入事件
    var inputCK = function(){

        var searchValue = $.trim(workDone.ck);

        var arr = [];

        for(var i=0;i<_ckArr.length;i++){

            //完全相同
            if(searchValue == _ckArr[i].storageName){

                arr.push(_ckArr[i]);

            }else{

                if( _ckArr[i].storageName.indexOf(searchValue)>=0 ){

                    arr.push(_ckArr[i]);

                }

            }

        }

        ckList(arr,$('#workDone').find('.pinzhixx').eq(0));

        if(arr.length >0 ){

            $('#workDone').find('.pinzhixx').eq(0).show();

        }else{

            $('#workDone').find('.pinzhixx').eq(0).hide();

        }

    }

    //仓库回车事件
    var enterCK = function(){

        var checkedLi = $('#workDone').find('.pinzhixx').eq(0).children('.li-color');

        //赋值
        workDone.ck = checkedLi.attr('data-name');

        $('.cangku').attr('data-num',checkedLi.attr('data-num'));

        //确定库区的下拉列表
        reservoir(checkedLi.attr('data-num'));

        //确定物品编码
        _filterWPList.length = 0;

        for(var i=0;i<_wpListArr.length;i++){
            //仓库和库区都一致才可以
            if(_wpListArr[i].storageNum == $('.camgku').attr('data-num') && _wpListArr[i].localNum == '' ){

                _filterWPList.push(_wpListArr[i]);

            }

        }

        //console.log(_filterWPList);

        wpList(_filterWPList,$('#workDone').find('.accord-with-list').eq(0));

        //仓库下拉列表消失
        $('#workDone').find('.pinzhixx').hide();

    }

    //库区输入事件
    var inputKQ = function(){

        var searchValue = $.trim(workDone.kuwei);

        var arr = [];

        for(var i=0;i<_kqArr.length;i++){

            //完全相同
            if(searchValue == _kqArr[i].localName){

                arr.push(_kqArr[i]);

            }else{

                if( _kqArr[i].localName.indexOf(searchValue)>=0 ){

                    arr.push(_kqArr[i]);

                }

            }

        }

        kqList(arr,$('#workDone').find('.kuqu-list'));

        if(arr.length >0 ){

            $('#workDone').find('.kuqu-list').show();

        }else{

            $('#workDone').find('.kuqu-list').hide();

        }

    }

    //库区回车事件
    var enterKQ = function(){

        var checkedLi = $('#workDone').find('.kuqu-list').eq(0).children('.li-color');

        //赋值
        workDone.kuwei = checkedLi.html();

        $('.kuwei').attr('data-num',checkedLi.attr('data-num'));

        //下拉列表消失
        $('#workDone').find('.kuqu-list').eq(0).hide();

        _filterWPList.length = 0;

        //确定物品下拉列表
        for(var i=0;i<_wpListArr.length;i++){

            if( _wpListArr[i].storageNum == $('#workDone').find('.cangku').attr('data-num') && _wpListArr[i].localNum == $('#workDone').find('.kuwei').attr('data-num') ){

                _filterWPList.push(_wpListArr[i]);

            }

        }

        wpList(_filterWPList,$('#workDone').find('.accord-with-list').eq(0));

        wpList(_filterWPList,$('#workDone').find('.accord-with-list').eq(1));

    }


    //页面初始化------------------------------------------------------------------------------------------------------
    //第一层弹窗（入库单信息初始化）
    function RKDInit(arr){
        //出库单编号
        myApp33.bianhao = '';
        //出库类型
        myApp33.rkleixing = '';
        //发货员名称
        myApp33.clymc = '';
        //发货员电话
        myApp33.clydh = '';
        //制单人
        myApp33.zhidanren = '';
        //制单时间
        myApp33.shijian = '';
        //备注
        myApp33.remarks = '';
        //审核备注
        myApp33.shRemarks = '';
        //表格初始化
        datasTable($('#personTable1'),arr);

    }

    //第二层弹窗（入库产品信息初始化）
    function RKCPInit(arr){
        //仓库
        workDone.ck = '';
        $('.cangku').removeAttr('data-num');

        //库区
        workDone.kuwei = '';
        $('.kuwei').removeAttr('data-num').removeAttr('data-name');

        //物品编号
        workDone.bianhao = '';

        //物品名称
        workDone.mingcheng = '';

        //物品序列号
        workDone.goodsId = '';

        //规格型号
        workDone.size = '';

        //是否耐用
        workDone.picked = 0;

        //单位
        workDone.unit = '';

        //品质
        workDone.quality = '';

        //质保期
        workDone.warranty = '';

        //剩余数量
        workDone.redundant = '';

        //数量
        workDone.num = '';

        //出库单价
        workDone.outPrice = '';

        //总金额
        workDone.amount = '';

        //工单号
        workDone.gdCode = '';

        $('.gdCode').removeAttr('gdcode');

        //车站
        workDone.chezhan = '';

        $('.chezhan').removeAttr('data-num').removeAttr('data-name');

        //备注
        workDone.remark = '';

        //单选框初始化
        if(workDone.picked == 0){

            $('.inpus').parent('span').removeClass('checked');

            $('.inpus').parent('span').eq(1).addClass('checked');

        }else if(workDone.picked == 1){

            $('.inpus').parent('span').removeClass('checked');

            $('.inpus').parent('span').eq(0).addClass('checked');

        }

        //除了自动带入的信息（）其他均可编辑
        $('.initBJ').removeAttr('readonly').removeClass('disabled-block');

        $('.initBJ').parent('.input-blockeds').removeClass('disabled-block');

        //表格初始化
        datasTable($('#wuPinListTable1'),arr);

    }

    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

})