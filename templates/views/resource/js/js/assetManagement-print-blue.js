

$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });

    //页面插入station选择框
    addStationDom($('#bumen').parent());

    //标识当前是否是登记框
    var _deng = false;

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

    //动态获取指定的设备类型或者车务段
    function getAllContent(id,arr,flag){
        var getArr = [];
        if(flag){
            $(arr).each(function(i,o){

                if(id == o.dsNum){
                    var pushArr = o.devClasss;
                    $(pushArr).each(function(i,o){
                        var obj = {};
                        obj.text = o.dcName;
                        obj.value = o.dcNum;
                        getArr.push(obj)
                    });
                    return getArr;
                }
            });
        }else{
            $(arr).each(function(i,o){

                if(id == o.daNum){
                    var pushArr = o.devDeps;
                    $(pushArr).each(function(i,o){
                        var obj = {};
                        obj.text = o.ddName;
                        obj.value = o.ddNum;
                        getArr.push(obj)
                    });
                    return getArr;
                }
            });
        }
        return getArr

    }
    //二维码地址
    var _erweimaPath = 'http://ip/ApService/showQR.aspx';
    //设置初始时间
    var _initStart = moment().format('YYYY-MM-DD');
    var _initEnd = moment().format('YYYY-MM-DD');
    //显示时间
    $('.min').val('');
    $('.max').val('');
    var realityStart = '';
    var realityEnd = '';
    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });
    //新增资产vue对象
    var myApp33 = new Vue({
        'el':'#myApp33',
        'data':{
            'sbbm':'',
            'zcLX':'',
            'options':[],
            'mingcheng':'',
            'ssQY':'',
            'options1':[],
            'ssXT':'',
            'options2':[],
            'ssbumen':'',
            'bianhao':'',
            'chandi':'',
            'yuanzhi':'',
            'xsbbm':'',
            'options3':[],
            'zhuangtai':'1',
            'options4':[
                {text:'正常',value:1},
                {text:'维修',value:2},
                {text:'报废',value:3}
            ],
            'pingpai':'',
            'guige':'',
            'gongyingshang':'',
            'shengchanshang':'',
            'nianxian':'',
            'baoxiu':'',
            'pinyin':''
        },
        'methods':{
            'change':function(){
                //根据设备系统获取设备类型
                myApp33.options = getAllContent(myApp33.ssXT,_relativeArr1,true);
                if(myApp33.options.length > 0){
                    myApp33.zcLX = myApp33.options[0].value;
                }

            },
            'change1':function(){
                //根据车务段获取车站
                myApp33.options3 = getAllContent(myApp33.ssQY,_relativeArr2,false);
                if(myApp33.options3.length > 0){
                    myApp33.ssbumen = myApp33.options3[0].value;
                }
            }
        }
    });
    //存放所有列表中的数据
    var _allDateArr = [];
    //存放设备类型的所有数据
    var _allDataLX = [];
    //存放设备区域的所有数据
    var _allDataQY = [];
    //存放设备系统的所有数据
    var _allDataXT = [];
    //存放设备部门的所有数据
    var _allDataBM = [];
    //存放当前id值
    var _thisRowID = 0;
    //存放当前设备编码值
    var _thisRowBM = '';
    //当前上传路径
    var _currentPath = '';
    //当前上传文件名
    var _fileName = '';
    //表格
    var _table = $('#browse-datatables');
    //获取设备类型
    ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#leixing'),'dcName','dcNum',myApp33.options);
    if( _allDataLX.length !=0 ){
        myApp33.zcLX = _allDataLX[0].dcNum;

    }
    //设备区域
    ajaxFun('YWDev/ywDMGetDAs',_allDataQY,$('#quyu'),'daName','daNum',myApp33.options1);
    if( _allDataQY.length !=0 ){
        myApp33.ssQY = _allDataQY[0].daNum;
    }
    //设备系统
   ajaxFun('YWDev/ywDMGetDSs',_allDataXT,$('#xitong'),'dsName','dsNum',myApp33.options2);
    if( _allDataXT.length !=0 ){
        myApp33.ssXT = _allDataXT[0].dsNum;
    }
    //设备部门
    ajaxFun('YWDev/ywDMGetDDs',_allDataBM,$('#bumen'),'ddName','ddNum',myApp33.options3);
    if( _allDataBM.length !=0 ){
        myApp33.ssbumen = _allDataBM[0].ddNum;
    }
    /*----------------------------表格初始化------------------------------*/
    //资产浏览表格
    var _tables = _table.DataTable({
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
                visible: false,
                className:'ids'
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
            },
            //{
            //    title:'状态',
            //    data:'status',
            //    render:function(data, type, full, meta){
            //        if( data == 1){
            //            return '正常'
            //        }else if( data ==2 ){
            //            return '维修'
            //        }else if( data == 3 ){
            //            return '报废'
            //        }else{
            //            return ''
            //        }
            //    }
            //},
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "class":'caozuo',
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                                  "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
                                  "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
            }
        ]
        /*"aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]*/
    });
    //自定义按钮位置
    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    //表格查询加载数据
    //conditionSelect();
    /*----------------------------按钮方法-------------------------------*/
    $('.creatButton').click(function(){

        _deng = true;

        //上传文件出现
        $('#uploader').show();
        $('#thelist').empty();

        //首先添加增加类
        var $myModal = $('#myModal');
        $myModal.find('.btn-primary').show();
        $myModal.find('.btn-primary').removeClass('bianji').addClass('dengji');
        moTaiKuang($myModal,'添加设备');
        //初始化
        myApp33.sbbm = '';
        myApp33.mingcheng = '';
        myApp33.pinyin = '';
        myApp33.zhuangtai = '1';
        myApp33.pingpai = '';
        myApp33.guige = '';
        myApp33.gongyingshang = '';
        myApp33.shengchanshang = '';
        myApp33.nianxian = '';
        myApp33.baoxiu = '';
        //新增字段
        myApp33.bianhao = '';
        myApp33.chandi = '';
        myApp33.yuanzhi = '';
        myApp33.xsbbm = '';

        $('#gouzhi').val('');
        $('#anzhuang').val('');
        $('#miaoshu').val('');
        $('.lujing').html('');
        $('#thelist').empty();
        var lis = $('#myApp33').children().children();
        for(var i=0;i<lis.length;i++){
            lis.eq(i).children().eq(1).children().attr('disabled',false);
        }
        //位置input框
        $('#weizhi').attr('disabled',false);
        //描述input框
        $('#miaoshu').attr('disabled',false);
        $('#gouzhi').attr('disabled',false);
        $('#anzhuang').attr('disabled',false);
        //根据设备系统获取设备类型
        myApp33.options = getAllContent(myApp33.ssXT,_relativeArr1,true);
        if(myApp33.options.length > 0){
            myApp33.zcLX = myApp33.options[0].value;
        }
        //根据车务段获取车站
        myApp33.options3 = getAllContent(myApp33.ssQY,_relativeArr2,false);
        if(myApp33.options3.length > 0){
            myApp33.ssbumen = myApp33.options3[0].value;
        }

    })

    $('#myModal').on('click','.closeDeng',function(){

        _deng = false;

    })

    //查询
    $('#selected').click(function (){
        conditionSelect();
    });
    //表格操作查看按钮
    _table.find('tbody')
        .on('click','.option-see',function(){
            $('.QRcode').empty();
            $('.QRcode').hide();
            //样式
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            //上传文件隐藏
            $('#uploader').hide();
            //时间控件不弹出
            $('#gouzhi').attr('disabled',true);
            $('#anzhuang').attr('disabled',true);
            //获取绑定的值
            var $myModal = $('#myModal');
            $myModal.find('.btn-primary').hide();
            moTaiKuang($myModal,'查看设备','flag');
            //绑定数据
            var $thisNum = $(this).parents('tr').find('.dNum').children('span').html();
            _thisRowBM = $thisNum;
            for(var i=0;i<_allDateArr.length;i++){
                if(_allDateArr[i].dNum == $thisNum){
                    var pathName = '';
                    var pathArr = _allDateArr[i].docPath.split('\\');
                    for(var j=0;j<pathArr.length;j++){
                        pathName = pathArr[j]
                    }
                    myApp33.sbbm = _allDateArr[i].dNum;
                    myApp33.zcLX = _allDateArr[i].dcNum;
                    myApp33.mingcheng = _allDateArr[i].dName;
                    myApp33.pinyin = _allDateArr[i].dPy;
                    myApp33.ssQY = _allDateArr[i].daNum;
                    myApp33.ssXT = _allDateArr[i].dsNum;
                    myApp33.ssbumen = _allDateArr[i].ddNum;
                    myApp33.zhuangtai = _allDateArr[i].status;
                    myApp33.pingpai = _allDateArr[i].brand;
                    myApp33.guige = _allDateArr[i].spec;
                    myApp33.gongyingshang = _allDateArr[i].supName;
                    myApp33.shengchanshang = _allDateArr[i].prodName;
                    myApp33.nianxian = _allDateArr[i].life;
                    myApp33.baoxiu = _allDateArr[i].maintain;
                    //新添加的
                    myApp33.bianhao = _allDateArr[i].factoryNum;
                    myApp33.chandi = _allDateArr[i].devOrigin;
                    myApp33.yuanzhi = _allDateArr[i].devMoney;

                    myApp33.xsbbm = _allDateArr[i].dNewNum;


                    $('#weizhi').val(_allDateArr[i].installAddress);
                    $('#gouzhi').val(timeForma(_allDateArr[i].purDate));
                    $('#anzhuang').val( timeForma(_allDateArr[i].installDate));
                    $('#miaoshu').val(_allDateArr[i].description);
                    $('.lujing').html(pathName);
                }
            };
            //查看只读；
            var lis = $('#myApp33').children().children();
            for(var i=0;i<lis.length;i++){
                lis.eq(i).children().eq(1).children().attr('disabled',true);
            }
            //位置input框
            $('#weizhi').attr('disabled',true);
            //描述input框
            $('#miaoshu').attr('disabled',true);
        })
        .on('click','.option-edite',function(){
            $('.QRcode').empty();
            $('.QRcode').hide();
            //样式
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            //上传文件出现
            $('#uploader').show();
            $('#thelist').empty();
            //时间控件可编辑
            $('#gouzhi').attr('disabled',false);
            $('#anzhuang').attr('disabled',false);
            //确定按钮出现
            var $myModal = $('#myModal');
            $myModal.find('.btn-primary').show();
            //添加编辑类，删除登记类
            $myModal.find('.btn-primary').removeClass('dengji').addClass('bianji');
            moTaiKuang($myModal,'编辑设备');
            //绑定原数据
            var $thisNum = $(this).parents('tr').find('.dNum').children('span').html();
            _thisRowBM = $thisNum;
            for(var i=0;i<_allDateArr.length;i++){
                if(_allDateArr[i].dNum == $thisNum){
                    var pathName = '';
                    var pathArr = _allDateArr[i].docPath.split('\\');
                    for(var j=0;j<pathArr.length;j++){
                        pathName = pathArr[j]
                    }
                    _thisRowID = _allDateArr[i].id;
                    myApp33.sbbm = _allDateArr[i].dNum;
                    myApp33.zcLX = _allDateArr[i].dcNum;
                    myApp33.mingcheng = _allDateArr[i].dName;
                    myApp33.pinyin = _allDateArr[i].dPy;
                    myApp33.ssQY = _allDateArr[i].daNum;
                    myApp33.ssXT = _allDateArr[i].dsNum;
                    myApp33.ssbumen = _allDateArr[i].ddNum;
                    myApp33.zhuangtai = _allDateArr[i].status;
                    myApp33.pingpai = _allDateArr[i].brand;
                    myApp33.guige = _allDateArr[i].spec;
                    myApp33.gongyingshang = _allDateArr[i].supName;
                    myApp33.shengchanshang = _allDateArr[i].prodName;
                    myApp33.nianxian = _allDateArr[i].life;
                    myApp33.baoxiu = _allDateArr[i].maintain;
                    //新添加的
                    myApp33.bianhao = _allDateArr[i].factoryNum;
                    myApp33.chandi = _allDateArr[i].devOrigin;
                    myApp33.yuanzhi = _allDateArr[i].devMoney;

                    myApp33.xsbbm = _allDateArr[i].dNewNum;

                    $('#weizhi').val(_allDateArr[i].installAddress);
                    $('#gouzhi').val(timeForma(_allDateArr[i].purDate));
                    $('#anzhuang').val( timeForma(_allDateArr[i].installDate));
                    $('#miaoshu').val(_allDateArr[i].description);
                    $('.lujing').html(pathName);

                    //根据设备系统获取设备类型
                    myApp33.options = getAllContent(myApp33.ssXT,_relativeArr1,true);

                    //根据车务段获取车站

                    myApp33.options3 = getAllContent(myApp33.ssQY,_relativeArr2,false);

                }
            };
            //查看只读；
            var lis = $('#myApp33').children().children();
            for(var i=0;i<lis.length;i++){
                lis.eq(i).children().eq(1).children().attr('disabled',false);
            }
            //上传文件按钮可操作
            $('#ctlBtn').attr('disabled',false);
        })
        .on('click','.option-delete',function(){
            $('.QRcode').empty();
            $('.QRcode').hide();
            //样式
            var $this = $(this).parents('tr');
            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');
            _thisRowBM = $(this).parents('tr').find('.dNum').children('span').html();
            console.log(_thisRowID);

            for(var i=0;i<_allDateArr.length;i++ ){
                if(_allDateArr[i].dNum == _thisRowBM){
                    _thisRowID = _allDateArr[i].id
                }
            }
            //提示框，确定要删除吗？
            var $myModal = $('#myModal3');
            moTaiKuang($myModal,'确定要删除吗？');
            //绑定信息
            var $thisNum = $(this).parents('tr').find('.dNum').children('span').html();
            for(var i=0;i<_allDateArr.length;i++){
                if(_allDateArr[i].dNum == $thisNum){
                    $('#sbbms').val(_allDateArr[i].dNum);
                    $('#sblxs').val(_allDateArr[i].dName);
                }
            }
        })
    //模态框确定按钮
    $('.modal')
    //新增确定按钮
        .on('click','.dengji',function(){
            if(myApp33.ssXT == '' || myApp33.mingcheng == '' || myApp33.zcLX == '' || myApp33.colorTip == '' || myApp33.ssbumen == '' || $('#weizhi').val() == '' ){
                var $myModal2 = $('#myModal2');
                $myModal2.find('.modal-body').html('请填写红色必填项');
                moTaiKuang($myModal2,'提示','flag');
                return false;
            }
            //上传文件出现
            $('#uploader').show();
            //获取填入的内容
            var prm = {
                'dName':myApp33.mingcheng,
                'dPy':myApp33.pinyin,
                'dcNum':myApp33.zcLX,
                'dcName':$.trim($('#sblx option:selected').html()),
                'daNum':myApp33.ssQY,
                'daName':$.trim($('#sbqy option:selected').html()),
                'ddNum':myApp33.ssbumen,
                'ddName':$.trim($('#sbbm option:selected').html()),
                'dsNum':myApp33.ssXT,
                'dsName':$.trim($('#sbxt option:selected').html()),
                'status':myApp33.zhuangtai,
                'brand':myApp33.pingpai,
                'spec':myApp33.guige,
                'supName':myApp33.gongyingshang,
                'prodName':myApp33.shengchanshang,
                'life':myApp33.nianxian,
                'maintain':myApp33.baoxiu,
                'purDate':$('#gouzhi').val(),
                'installDate':$('#anzhuang').val(),
                'installAddress':$('#weizhi').val(),
                'description':$('#miaoshu').val(),
                'docPath':$('.lujing').html(),
                'userID':_userIdName,
                //新增字段
                'factoryNum':myApp33.biaohao,
                'devOrigin':myApp33.chandi,
                'devMoney':myApp33.yuanzhi,

                'dNewNum':myApp33.xsbbm
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDev/ywDAddDev',
                data:prm,
                success:function(result){
                    if(result == 99 ){
                        var $myModal2 = $('#myModal2');
                        $myModal2.find('.modal-body').html('新增成功');
                        moTaiKuang($myModal2,'提示','flag');
                        conditionSelect();
                        $('#myModal').modal('hide');
                    }
                }
            })
        })
    //编辑确定按钮
        .on('click','.bianji',function(){
        //获取所有详情
        var prm = {
            'id':_thisRowID,
            'dNum':myApp33.sbbm,
            'dName':myApp33.mingcheng,
            'dPy':myApp33.pinyin,
            'dcNum':myApp33.zcLX,
            'dcName':$.trim($('#sblx option:selected').html()),
            'daNum':myApp33.ssQY,
            'daName':$.trim($('#sbqy option:selected').html()),
            'ddNum':myApp33.ssbumen,
            'ddName':$.trim($('#sbbm option:selected').html()),
            'dsNum':myApp33.ssXT,
            'dsName':$.trim($('#sbxt option:selected').html()),
            'status':myApp33.zhuangtai,
            'brand':myApp33.pingpai,
            'spec':myApp33.guige,
            'supName':myApp33.gongyingshang,
            'prodName':myApp33.shengchanshang,
            'life':myApp33.nianxian,
            'maintain':myApp33.baoxiu,
            'purDate':$('#gouzhi').val(),
            'installDate':$('#anzhuang').val(),
            'installAddress':$('#weizhi').val(),
            'description':$('#miaoshu').val(),
            'docPath':$('.lujing').html(),
            'userID':_userIdName,
            //新增字段
            'factoryNum':myApp33.biaohao,
            'devOrigin':myApp33.chandi,
            'devMoney':myApp33.yuanzhi,

            'dNewNum':myApp33.xsbbm
        };
        $.ajax({
            type:'post',
            url: _urls + 'YWDev/ywDUptDev',
            data:prm,
            success:function(result){
                if(result == 99){
                    $('#myModal2').find('.modal-body').html('编辑成功');
                    moTaiKuang($('#myModal2'),'提示','flag');
                    conditionSelect();
                    $('#myModal').modal('hide');
                }
            }
        })
    })
    //删除确定按钮
        .on('click','.shanchu',function(){
            var prm = {
                'id':_thisRowID,
                'dNum':_thisRowBM,
                'userID':_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDev/ywDDelDev',
                data:prm,
                success:function(result){
                    if( result == 99 ){
                        $('#myModal2').find('.modal-body').html('删除成功');
                        moTaiKuang($('#myModal2'),'提示','flag');
                        conditionSelect();
                    }
                }
            })
    })
    //弹窗关闭按钮
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
    /*----------------------------上传文件-------------------------------*/
    var $list=$("#thelist");//上传区域
    var $btn =$("#ctlBtn");//上传按钮
    //初始化设置
    var uploader = WebUploader.create({
        //选完文件是否上传
        /*auto:true,*/
        //swf的路径
        swf:'webuploader/Uploader.swf',
        //文件接收服务端
        server: _urls + 'YWDev/ywDevFileUploadProgress',
        pick: {
            id:'#picker',
            //multiple:false
        },
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        //添加多个
        //fileNumLimit:1,
        //thumb
        thumb:false,
        //是否可选择同一文件
        duplicate:true
    });
    uploader.on( 'beforeFileQueued',function(file){
        if( uploader.getFiles().length >0){
            //就不要再往队列里添加了
            uploader.reset();
            uploader.addFiles( file );
        }
    } );
    //添加东西之后判断是否能预览，如果是图片能预览，否则反之，
    uploader.on( 'fileQueued', function( file ) {
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<div class="info">' + file.name + '</div>' +
                '<p class="state">等待上传...</p>' +
                '</div>'
            ),
            $img = $li.find('img');

        // $list为容器jQuery实例
        $list.html( $li );
    });
    //文件上传进度
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo( $li ).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css( 'width', percentage * 100 + '%' );
    });
    //文件成功，失败处理
    uploader.on( 'uploadSuccess', function( file,response ) {
        _currentPath = response;
        $('.lujing').html(_currentPath);
        $( '#'+file.id ).find('p.state').text('已上传');
    });

    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错');
    });
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').fadeOut();
    });
    $btn.click(function(){
        uploader.upload();
    })
    //查看二维码
    $('.viewImage').click(function(){

        if(_deng){

            $('.QRcode').empty();
            $('.QRcode').hide();

        }else{

            if( $('.QRcode').children().length == 0 ){
                $('.QRcode').empty();
                $('.QRcode').show();
                var str = '<img src="' + replaceIP(_erweimaPath,_urls) + '?asc=' + _thisRowBM +
                    '"' + 'style="width:100px;height:100px;"' +
                    '>';
                $('.QRcode').append(str);
            }else{
                $('.QRcode').empty();
                $('.QRcode').hide();
            }

        }



    });
    /*-----------------------------------------其他方法-------------------------------*/
    //确定新增弹出框的位置
    function moTaiKuang(who, title, flag) {
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
        }
    }

    //ajaxFun（select的值）
    function ajaxFun(url,allArr,select,text,num,arr){
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
                    str += '<option' + ' value="' + result[i][num] +'">' + result[i][text] + '</option>'
                    var obj = {};
                    obj.text = result[i][text];
                    obj.value = result[i][num];
                    arr.push(obj);
                    allArr.push(result[i]);
                }
                select.append(str);
                //if(text == 'ddName'){
                //    console.log(result);
                //}
            }
        })
    }
    //查询功能
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        if( filterInput[3] == ''){
            realityStart = ''
        }else{
            realityStart = filterInput[3] + ' 00:00:00';
        }
        if( filterInput[3] == '' ){
            realityEnd = ''
        }else{
            realityEnd = moment(filterInput[4]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        }
        var id1 = $('#chejian').val();
        var id2 = $('#banzu').val();

        var departNums = getPostTrain(id1,id2);
        var flag = departNums[0];
        if(!flag){
            departNums = [];
        }
        //console.log($('#bumen').val());
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
            'dNewNum':$('#bianhao').val(),
            'departNums':departNums,
            'userID':_userIdName
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevs',
            data:prm,
            async:false,
            success:function(result){

                var str = '';

                for(var i=0;i<result.length;i++){

                  var  valueStr = '<div class="print-block-cel"> <div class="table-title1">设备（设施）标识牌</div> <div class="table-img1"> <img src="../resource/img/black_logo.png" alt=""> <span>江铁实业</span> </div> <div class="title-word1">' + result[i].ddName +
                        '</div> <div class="content-block"> <div class="row-list"> <div class="row-two-left">设备名称</div> <div class="row-two-right">' + result[i].dName +
                        '</div> </div> <div class="row-list"> <div class="row-two-left">使用位置</div> <div class="row-two-right">' + result[i].installAddress +
                        '</div> </div> <div class="three-block"> <div class="three-left"> <div class="row-list"> <div class="row-three-left">规格型号</div> <div class="row-three-right">' + result[i].spec +
                        '</div> </div> <div class="row-list"> <div class="row-three-left">启用日期</div> <div class="row-three-right">' + installTime(result[i].installDate) +
                        '</div> </div> <div class="row-list"> <div class="row-three-left">管理单位</div> <div class="row-three-right">' + result[i].daName +
                        '</div> </div> <div class="row-list"> <div class="row-three-left">产权单位</div> <div class="row-three-right">南昌铁路局</div> </div> <div class="row-list"> <div class="row-three-left">维护单位</div> <div class="row-three-right">江西铁路实业发展有限公司</div> </div> </div> <div class="img-block"> <img  src="' + replaceIP(_erweimaPath,_urls) + '?asc=' + result[i].dNum +
                        '" alt="" > </div> </div> <div class="row-list" style="border-bottom: none"> <div class="row-two-left">报修电话：018-29999 </div> <div class="row-two-right">设备编码：<span>' + result[i].dNum +
                        '</span> </div> </div> </div> </div>'

                    //开始的标签
                    if(i == 0){

                        str += '<div class="print-block">' +  valueStr

                    }else if(i == result.length - 1){

                        str += valueStr;

                        //str += '<div class="clearfix noprint"></div></div><div class="print-block">' + valueStr

                    }else if(i % 6 == 0 ){

                        str += '<div class="clearfix noprint"></div></div><div class="PageNext"></div><div class="print-block">' + valueStr

                    }else{

                        str += valueStr

                    }

                }


                $('.print-table').empty().append(str);

                //for(var i=0;i<result.length;i++){
                //    _allDateArr.push(result[i]);
                //}
                //jumpNow($('#browse-datatables'),result);
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
    //时间格式处理
    function timeForma(time){
        return time.split(' ')[0].replace(/-/g,'/');
    }
    //IP替换
    function replaceIP(str,str1){
        var ip = /http:\/\/\S+?\//;  /*http:\/\/\S+?\/转义*/
        var res = ip.exec(str1);  /*211.100.28.180*/
        //var res = 'http://211.100.28.180/';
        str = str.replace(ip,res);
        return str;
    }
    //提交更改后跳转到当前页
    function jumpNow(tableId,arr){

        if(arr.length > 0){
            arr.reverse();
        }

        var dom ='#'+ tableId[0].id + '_paginate';
        //console.log(dom);
        var txt = $(dom).children('span').children('.current').html();

        datasTable(tableId,arr);
        var num = txt - 1;
        var dom = $(dom).children('span').children().eq(num);
        //console.log(txt);
        //console.log(dom);
        dom.click();
    };

    //存放车站与维修班组
    var DPartSelect = '';
    var DPartArr = [];

    var DMainSelect = '';
    var DMainArr = [];
    getAllDPart();
    //获取全部车间（维修班组）
    function getAllDPart(){

        $.ajax({
            type: 'post',
            url: _urls + '/YWGD/ywGDGetWxBanzuStation',
            timeout: theTimes,
            data:{
                'userID':_userIdName,
                'ddNum':''
            },
            success: function (data) {
                //console.log(data);
                DPartSelect += '<option value="0">全部</option>';
                DMainSelect += '<option value="0">全部</option>'
                $(data.stations).each(function(i,o){

                    DPartSelect += '<option value="'+ o.departNum+'">'+ o.departName+'</option>';
                    DPartArr.push(o);
                });

                $(data.wxBanzus).each(function(i,o){

                    DMainSelect += '<option value="'+ o.departNum+'">'+ o.departName+'</option>';
                    DMainArr.push(o.departNum);

                });

                $('#chejian').html(DPartSelect);

                $('#banzu').html(DMainSelect)


            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter('超时')
                }else{
                    myAlter('请求失败')
                }

            }
        });
    }


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
                //console.log(str);
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

    $('#chejian').change(function(){

        var value = $('#chejian').val();
        if(value == 0){
            var str = '<option value="">全部</option>';

            $('#banzu').html(DMainSelect);
            return false;
        }

        $(DPartArr).each(function(i,o){

            if(value == o.departNum){
                var pushArr = o.wxBanzus;
                var str = '<option value="0">全部</option>';
                $(pushArr).each(function(i,o){

                    str += '<option value="'+ o.departNum+'">'+ o.departName+'</option>'
                });
                $('#banzu').html('');
                $('#banzu').html(str);
                return false;
            }
        });
    });

    //获取要传递给后台的维修班组集合
    function getPostTrain(id1,id2){
        var postArr = [];
        //维修班组为全部时
        if(id2 == 0){
            //如果车间为全部时
            if(id1 == 0){
               return [];
            }else{
                $(DPartArr).each(function(i,o){
                     if(o.departNum == id1){
                         $(o.wxBanzus).each(function(i,o){
                            postArr.push(o.departNum);
                         })

                     }
                });
            }
        }else{
            postArr.push(id2);
        }

        return postArr
    }

    //安装时间处理

    function installTime(str){

        return str.split(' ')[0]

    }

});

