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
        format: 'yyyy/mm/dd'
    });
    //设置初始时间
    var _initStart = moment().format('YYYY-MM-DD');
    var _initEnd = moment().format('YYYY-MM-DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
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
        }
    });
    //存放所有列表中的数据
    var _allDateArr = [];
    //存放当前id值
    var _thisRowID = 0;
    //存放当前设备编码值
    var _thisRowBM = '';
    //获取设备类型
    var prm = {
        'dcName':'',
        'userID':_userIdName
    }
    ajaxFun(prm,'YWDev/ywDMGetDCs',$('#leixing'),'dcName','dcNum',myApp33.options);
    myApp33.zcLX = myApp33.options[0].value;
    //设备区域
    var prm1 = {
        'daName':'',
        'userID':_userIdName
    }
    ajaxFun(prm1,'YWDev/ywDMGetDAs',$('#quyu'),'daName','daNum',myApp33.options1);
    myApp33.ssQY = myApp33.options1[0].value;
    //设备系统
    var prm2 = {
        'dsName':'',
        'userID':_userIdName
    }
    ajaxFun(prm2,'YWDev/ywDMGetDSs',$('#xitong'),'dsName','dsNum',myApp33.options2);
    myApp33.ssXT = myApp33.options2[0].value;
    //设备部门
    var prm3 = {
        'ddName':'',
        'userID':_userIdName
    }
    ajaxFun(prm3,'YWDev/ywDMGetDDs',$('#bumen'),'ddName','ddNum',myApp33.options3);
    myApp33.ssbumen = myApp33.options3[0].value;
    /*----------------------------表格初始化------------------------------*/
    //资产浏览表格
    $('#browse-datatables').DataTable({
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
                title:'安装区域',
                data:'installAddress',
            },
            {
                title:'安装时间',
                data:'installDate',
            },
            {
                title:'设备系统',
                data:'dsName',
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                                  "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
                                  "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    //表格查询加载数据
    conditionSelect();
    /*----------------------------按钮方法-------------------------------*/
    $('.creatButton').click(function(){
        //首先添加增加类
        $('#myModal').find('.btn-primary').show();
        $('#myModal').find('.btn-primary').removeClass('bianji').addClass('dengji');
        moTaiKuang($('#myModal'));
        //初始化
        myApp33.sbbm = '';
        myApp33.mingcheng = '';
        myApp33.pinyin = '';
        myApp33.zhuangtai = '';
        myApp33.pingpai = '';
        myApp33.guige = '';
        myApp33.gongyingshang = '';
        myApp33.shengchanshang = '';
        myApp33.nianxian = '';
        myApp33.baoxiu = '';
        $('#gouzhi').val('');
        $('#anzhuang').val('');
        $('#miaoshu').val('');
    })
    //查询
    $('#selected').click(function (){
        conditionSelect();
    })
    //新增确定按钮
    $('.modal').on('click','.dengji',function(){
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
            'docPath':'',
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDAddDev',
            data:prm,
            success:function(result){
                if(result == 99 ){
                    $('#myModal2').find('.modal-body').html('新增成功');
                    moTaiKuang($('#myModal2'));
                    conditionSelect();
                    $('#myModal').modal('hide');
                }
            }
        })
    })
    //表格操作查看按钮
    $('#browse-datatables tbody')
        .on('click','.option-see',function(){
            //时间控件不弹出
            $('#gouzhi').attr('disabled',true);
            $('#anzhuang').attr('disabled',true);
            //获取绑定的值
            $('#myModal').find('.btn-primary').hide();
            moTaiKuang($('#myModal'));
            //绑定数据
            var $thisNum = $(this).parents('tr').find('.dNum').html();
            for(var i=0;i<_allDateArr.length;i++){
                if(_allDateArr[i].dNum == $thisNum){
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
                    $('#gouzhi').val(timeForma(_allDateArr[i].purDate));
                    $('#anzhuang').val( timeForma(_allDateArr[i].installDate));
                    $('#miaoshu').val(_allDateArr[i].description);
                    //路径先跳过
                }
            }
        })
        .on('click','.option-edite',function(){
            //时间控件可编辑
            $('#gouzhi').attr('disabled',false);
            $('#anzhuang').attr('disabled',false);
            //确定按钮出现
            $('#myModal').find('.btn-primary').show();
            //添加编辑类，删除登记类
            $('#myModal').find('.btn-primary').removeClass('dengji').addClass('bianji');
            moTaiKuang($('#myModal'));
            //绑定原数据
            var $thisNum = $(this).parents('tr').find('.dNum').html();
            for(var i=0;i<_allDateArr.length;i++){
                if(_allDateArr[i].dNum == $thisNum){
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
                    $('#gouzhi').val(timeForma(_allDateArr[i].purDate));
                    $('#anzhuang').val( timeForma(_allDateArr[i].installDate));
                    $('#miaoshu').val(_allDateArr[i].description);
                    //路径先跳过
                }
            };
        })
        .on('click','.option-delete',function(){
            _thisRowID = $(this).parents('tr').children().eq(0).html();
            _thisRowBM = $(this).parents('tr').find('.dNum').html();
            //提示框，确定要删除吗？
            var $myModal = $('#myModal3');
            $myModal.find('.modal-body').html('确定要删除吗？');
            moTaiKuang($myModal);
        })
    //编辑确定按钮
    $('.modal')
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
            'docPath':'',
            'userID':_userIdName
        };
        $.ajax({
            type:'post',
            url: _urls + 'YWDev/ywDUptDev',
            data:prm,
            success:function(result){
                if(result == 99){
                    $('#myModal2').find('.modal-body').html('编辑成功');
                    moTaiKuang($('#myModal2'));
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
                        moTaiKuang($('#myModal2'));
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
    var thumbnailWidth = 100;
    var thumbnailHeight = 100;
    //初始化设置
    var uploader = WebUploader.create({
        //选完文件是否上传
        /*auto:true,*/
        //swf的路径
        swf:'webuploader/Uploader.swf',
        //文件接收服务端
        server:'http://192.168.1.196/BEEWebAPI/api/YWDev/ywDevFileUploadProgress',
        pick: '#picker',
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false
    });
    //添加东西之后判断是否能预览，如果是图片能预览，否则反之，
    uploader.on( 'fileQueued', function( file ) {
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
                '<p class="state">等待上传...</p>' +
                '</div>'
            ),
            $img = $li.find('img');

        // $list为容器jQuery实例
        $list.append( $li );

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );
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
    uploader.on( 'uploadSuccess', function( file ) {
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
    /*-----------------------------------------其他方法-------------------------------*/
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
    //ajaxFun（select的值）
    function ajaxFun(parameter,url,select,text,num,arr){
        $.ajax({
            type:'post',
            url:_urls + url,
            async:false,
            data:parameter,
            success:function(result){
                //给select赋值
                var str = '<option value="">全部</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option' + ' value="' + result[i][num] +'">' + result[i][text] + '</option>'
                    var obj = {};
                    obj.text = result[i][text];
                    obj.value = result[i][num];
                    arr.push(obj);
                }
                select.append(str);
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
        realityStart = filterInput[3] + ' 00:00:00';
        realityEnd = moment(filterInput[4]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
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
        console.log(prm);
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
                datasTable($('#browse-datatables'),result);
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
})
