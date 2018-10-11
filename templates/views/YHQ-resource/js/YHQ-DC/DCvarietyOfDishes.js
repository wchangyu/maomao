$(function(){

    /*---------------------------------------变量-----------------------------------------*/


    //存放所有数据
    var _allData = [];

    //当前的餐厅id
    var _thisId = '';

    //保存当前已上传图片路径
    var _imgpath = '';

    //记录当前菜品名称是否已存在
    var _isExist = '';

    //记录当前是否有上传的图片
    var _isExistImg = '';

    //删除文件有两个含义，本地删除（创建的时候删除，编辑的时候删除服务器上的图片）
    var _thisImg = false;

    /*----------------------------------------验证-----------------------------------------*/

    //输入验证
    $('#commentForm').validate({

        rules:{
            //菜品名称
            'DC-name':{

                required: true,

                isExist:_isExist

            },
            //类型选择
            'DC-type':{

                required: true

            },
            //口味
            'DC-taste':{

                required: true

            },
            //配料
            'DC-mixture':{

                required: true

            },
            //计价单位
            'DC-valuation':{

                required: true

            },
            //价格
            'DC-prince':{

                required: true,

                number:true,

                min:0

            },
            //适合人群
            'DC-fit':{

                required: true

            },
            //不适合人群
            'DC-unfit':{

                required: true

            },
            //餐厅
            'DC-restaurant':{

                required: true

            },

            //有效期
            'DC-period':{

                required: true,

                number:true,

                min:0

            }

        },
        messages:{

            //菜品名称
            'DC-name':{

                required: '菜品名称是必填字段'

                //isExist:_isExist

            },
            //类型选择
            'DC-type':{

                required: '菜品类型是必选字段'

            },
            //口味
            'DC-taste':{

                required: '口味是必填字段'

            },
            //配料
            'DC-mixture':{

                required: '配料是必填字段'

            },
            //计价单位
            'DC-valuation':{

                required: '计价单位是必填字段'

            },
            //价格
            'DC-prince':{

                required: '价格是必填字段',

                number:'价格为大于0的数字',

                min:'价格为大于0的数字'

            },
            //适合人群
            'DC-fit':{

                required: '适合人群是必填字段'

            },
            //不适合人群
            'DC-unfit':{

                required: '不适合人群是必填字段'

            },
            //餐厅
            'DC-restaurant':{

                required: '餐厅是必选字段'

            },

            //有效期
            'DC-period':{

                required: '有效期是必填字段',

                num:'有效期为大于0的数字',

                min:'有效期为大于0的数字'

            }
        }

    });

    //验证菜品名称是否存在
    $.validator.addMethod("isExist",function(value,element,params){

        var flag = true;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].cookname == value && _allData[i].cookname!= _isExist){

                flag = false;

                break;

            }

        }

        return flag;

    },"菜品名称已存在");

    function validform(){

        return $('#commentForm').validate({

            rules:{
                //菜品名称
                'DC-name':{

                    required: true

                    //isExist:_isExist

                },
                //类型选择
                'DC-type':{

                    required: true

                },
                //口味
                'DC-taste':{

                    required: true

                },
                //配料
                'DC-mixture':{

                    required: true

                },
                //计价单位
                'DC-valuation':{

                    required: true

                },
                //价格
                'DC-prince':{

                    required: true,

                    number:true,

                    min:0

                },
                //适合人群
                'DC-fit':{

                    required: true

                },
                //不适合人群
                'DC-unfit':{

                    required: true

                },
                //餐厅
                'DC-restaurant':{

                    required: true

                },

                //有效期
                'DC-period':{

                    required: true,

                    number:true,

                    min:0

                }

            },
            messages:{

                //菜品名称
                'DC-name':{

                    required: '菜品名称是必填字段'

                    //isExist:_isExist

                },
                //类型选择
                'DC-type':{

                    required: '菜品类型是必选字段'

                },
                //口味
                'DC-taste':{

                    required: '口味是必填字段'

                },
                //配料
                'DC-mixture':{

                    required: '配料是必填字段'

                },
                //计价单位
                'DC-valuation':{

                    required: '计价单位是必填字段'

                },
                //价格
                'DC-prince':{

                    required: '价格是必填字段',

                    number:'价格为大于0的数字',

                    min:'价格为大于0的数字'

                },
                //适合人群
                'DC-fit':{

                    required: '适合人群是必填字段'

                },
                //不适合人群
                'DC-unfit':{

                    required: '不适合人群是必填字段'

                },
                //餐厅
                'DC-restaurant':{

                    required: '餐厅是必选字段'

                },

                //有效期
                'DC-period':{

                    required: '有效期是必填字段',

                    num:'有效期为大于0的数字',

                    min:'有效期为大于0的数字'

                }
            }

        });

    }

    /*------------------------------------------表格初始化---------------------------------*/

    var col = [

        {
            title:'菜品图片',
            data:'img',
            render:function(data, type, full, meta){

                if(data == ''){

                    return '暂无图片'

                }else{

                    var url = _urls.split('api')[0] + data;

                    return '<img src="' + url + '" style="height: 50px;">'

                }

            }


        },
        {
            title:'菜品名称',
            data:'cookname'
        },
        {
            title:'菜品类型',
            data:'lxname'
        },
        {
            title:'价格',
            data:'price'
        },
        {
            title:'适合人群',
            data:'fitperson'
        },
        {
            title:'不适合人群',
            data:'unfitperson'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                return  '<span class="option-button option-see option-in" data-attr="' + full.id + '">' + '详情</span>' +

                        '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '编辑</span>' +

                        '<span class="option-button option-del option-in" data-attr="' + full.id + '">' + '删除</span>'


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    //获取菜品类型
    MealType();

    //获取餐厅
    RestaurantType();

    /*----------------------------------------按钮事件-------------------------------------*/

    //新增
    $('#createBtn').click(function(){

        //loadding
        $('.L-container').showLoading();

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        $('.L-container').hideLoading();

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可操作
        abledOption();

        isShowDelButton();

    })

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){

            sendData('YHQDC/DinningbookAdd',$('#create-Modal').children('.modal-dialog'),false,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

            })

        }

    })

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置条件
    $('#resetBtn').click(function(){

        $('#DC-name-con').val('');

        $('#DC-restaurant-con').val('');

        $('#DC-type-con').val('');

    })

    //查看
    $('#table tbody').on('click','.option-see',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'详情',true,'','','');

        //绑定数据
        bindData(_thisId);

        //是否可操作
        disabledOption();

    })

    //编辑
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');

        //绑定数据
        bindData(_thisId);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //是否可操作
        abledOption();

        isShowDelButton();

        _isExist = $('#DC-name').val();

    })

    //编辑【确定】按钮
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form()){

            sendData('YHQDC/DinningbookUpdate',$('#create-Modal').children('.modal-dialog'),true,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

            })

        }

    })

    //删除
    $('#table tbody').on('click','.option-del',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'确认要删除吗？','','','','删除');

        //绑定数据
        bindData(_thisId);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //是否可操作
        disabledOption();

    })

    //删除【确定】按钮
    $('#create-Modal').on('click','.shanchu',function(){

        if(validform().form()){

            sendData('YHQDC/DinningbookDelete',$('#create-Modal').children('.modal-dialog'),true,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

            })

        }

    })


    /*-----------------------------------------------上传图片----------------------------------------*/
    var $list=$("#thelist");//上传区域
    var $btn =$("#ctlBtn");//上传按钮
    var thumbnailWidth = 100;
    var thumbnailHeight = 100;

    //初始化设置
    var uploader = WebUploader.create({
        //选完文件是否上传
        //swf的路径
        swf:'webuploader/Uploader.swf',
        //文件接收服务端
        server:_urls + 'YHQDC/ImageFileUploadProgress',
        pick: '#picker',
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false
    });

    //添加东西之后判断是否能预览，如果是图片能预览，否则反之，
    uploader.on( 'fileQueued', function( file ) {

        //我现在就是想要实现单文件上传
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
                '<p class="state">等待上传...</p>' +
                '</div>'
            ),
            $img = $li.find('img');

        // $list为容器jQuery实例
        $list.html( $li );

        //缩略图
        uploader.makeThumb( file, function( error, src ) {   //webuploader方法
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

        //获取当前图片的宽，高
        var  imgWidth = file._info.width;

        var imgHeight = file._info.height;

        //if( imgWidth / imgHeight > 1.6 ||  imgWidth / imgHeight < 1.2){
        //
        //    $li.find('p.state').text('请选择长宽比合适的图片上传(推荐比例1.4:1)');
        //
        //    uploader.stop(true);
        //
        //}else{
        //
        //    $li.find('p.state').text('上传中');
        //
        //    $percent.css( 'width', percentage * 100 + '%' );
        //
        //}

    });

    //文件成功，失败处理
    uploader.on( 'uploadSuccess', function( file,response ) {

        _imgpath = response;

        $( '#'+file.id ).find('p.state').text('已上传').css({'color':'green'});
    });

    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错').css({'color':'red'});
    });

    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').fadeOut();
    });

    //上传图片
    $('#ctlBtn').click(function(){

        if($('#thelist').children().length > 1){

            console.log('只能上传一张图片');

        }else{

            uploader.upload();
        }
    });

    //删除已上传的图片
    $('#deleted').click(function(){

        //首先提示是否要删除当前图片
        _moTaiKuang($('#del-img-Modal'),'提示','',true,'确定要删除当前图片吗？','删除');

    })

    //确定要删除当前图片
    $('#del-img-Modal').on('click','.btn-primary',function(){

        _thisImg = true;

        $('#del-img-Modal').modal('hide');

        $('#thelist').empty();

        $('#deleted').hide();

    })


    /*----------------------------------------其他方法-------------------------------------*/

    //初始化
    function createModeInit(){

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val('');

        $('#create-Modal').find('textarea').val('');

        //将所有label .error验证隐藏
        var label = $('#create-Modal').find('label');

        for(var i=0;i<label.length;i++){

            var attr = $(label).eq(i).attr('class')

            if(attr){

                if(attr.indexOf('error')>-1){

                    label.eq(i).hide();

                }

            }

        }

        //上传图片初始化
        $('#thelist').empty();

        _isExist = '';

        _isExistImg = '';

        _thisImg = false;

    }

    //获取菜品类型
    function MealType(){

        var prm = {

            lxbm:''

        }

        _mainAjaxFunCompleteOnly('post','YHQDC/RetrunCookStyleList',prm,false,function(result){

            var str = '<option value="">请选择</option>';

            var str1 = '<option value="-1">全部</option>';

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    str += '<option value="' + result.data[i].id + '">' + result.data[i].lxname + '</option>';

                    str1 += '<option value="' + result.data[i].id + '">' + result.data[i].lxname + '</option>';

                }

            }

            $('#DC-type').append(str);

            $('#DC-type-con').append(str1);

            conditionSelect();

        })


    }

    //餐厅
    function RestaurantType(){

        var prm = {

            diningroom:''

        }

        _mainAjaxFunCompleteOnly('post','YHQDC/ReturnDiningRoomsList',prm,false,function(result){

            var str = '<option value="">请选择</option>';

            var str1 = '<option value="">全部</option>';

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    str += '<option value="' + result.data[i].id + '">' + result.data[i].diningroom + '</option>';

                    str1 += '<option value="' + result.data[i].id + '">' + result.data[i].diningroom + '</option>';

                }

            }

            $('#DC-restaurant').append(str);

            $('#DC-restaurant-con').append(str1);

        })


    }

    //操作发送数据
    function sendData(url,el,flag,successFun){

        var imgpath = '';

         //判断当前有没有图片
        if($('#thelist').find('img').length>0){

            imgpath = _imgpath;

        }

        var prm = {

            //菜名
            cookname:$('#DC-name').val(),
            //备注
            comment:$('#DC-remark').val(),
            //价格
            price:$('#DC-prince').val(),
            //图片
            img:imgpath,
            //餐厅
            dinningroomid:$('#DC-restaurant').val(),
            //适合人群
            fitperson:$('#DC-fit').val(),
            //不适合人群
            unfitperson:$('#DC-unfit').val(),
            //计价单位
            unit:$('#DC-valuation').val(),
            //餐饮类型i
            lx:$('#DC-type').val(),
            //配料
            element:$('#DC-mixture').val(),
            //口味
            flavor:$('#DC-taste').val(),
            //有效期
            valid:$('#DC-period').val()

        }

        if(flag){

            prm.id = _thisId

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun);

        if(_thisImg){

            var fileNamePath = {

                '':_isExistImg
            }

            _mainAjaxFunCompleteNew('post','YHQDC/DelUploadImageFile',fileNamePath,$('#create-Modal').children(),function(result){

                if(result == 99){

                    //删除成功
                    _isExistImg = '';

                    $('#thelist').empty();

                }else{

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'删除失败','');

                }

            })

        }


    }

    //条件查询
    function conditionSelect(){

        var prm = {
            //菜名
            cookname:$('#DC-name-con').val(),
            //餐厅
            //dinningroomid:$('#DC-restaurant-con').val(),
            //dinningroomid:1,
            //菜品类型
            lx:$('#DC-type-con').val(),
            //部门
            departnum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQDC/RetrunDinningbookList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _jumpNow($('#table'),result.data);

            }

        })


    }

    //绑定数据
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].id == id){

                var data = _allData[i];

                if(data.img != ''){

                    var url = _urls.split('api')[0];

                    _isExistImg = data.img;

                    //菜品图片

                    var str = '<img src="' + url + data.img + '">';

                    $('#thelist').append(str);

                }
                //菜品名称
                $('#DC-name').val(data.cookname);
                //菜品类型
                $('#DC-type').val(data.lx);
                //口味
                $('#DC-taste').val(data.flavor);
                //配料
                $('#DC-mixture').val(data.element);
                //计价单位
                $('#DC-valuation').val(data.unit);
                //价格
                $('#DC-prince').val(data.price);
                //适合人群
                $('#DC-fit').val(data.fitperson);
                //不适合人群
                $('#DC-unfit').val(data.unfitperson);
                //餐厅
                $('#DC-restaurant').val(data.dinningroomid);
                //有效期
                $('#DC-period').val(data.valid);
                //备注
                $('#DC-remark').val(data.comment);

            }

        }

    }

    //可操作
    function abledOption(){

        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        //图片上传显示
        $('.btns').show();

    }

    //不可操作
    function disabledOption(){

        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

        //图片上传显示
        $('.btns').hide();

    }

    //判断是否显示删除图片按钮
    function isShowDelButton(){

        if(_isExistImg != ''){

            $('#deleted').show();

        }else{

            $('#deleted').hide();

        }

    }

})