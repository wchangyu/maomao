$(function(){

    /*---------------------------------------------变量----------------------------------------------*/

    //声明Vue对象
    var checkWork = new Vue({

        el:'#myApp33',
        data:{

            //时间段名称
            tname:'',
            //上班时间
            startwork:'',
            //下班时间
            endwork:'',
            //开始签到时间
            stsignwork:'',
            //结束签到时间
            etsignwork:'',
            //开始签退时间
            stsignoutwork:'',
            //结束签退时间
            etsignoutwork:'',
            //记迟到时间
            tlate:'',
            //记早退时间
            tearly:''

        },
        methods:{

            timeFun:function(){


                var e = e||window.event;

                var el = $(e.srcElement);

                _timeComponentsFun(el);

            },
            blurFun:function(){

                var e = e||window.event;

                var el = $(e.srcElement);

                var view = el.parent().children('.inputblock');

                el.off('changeDate');

                el.on('changeDate',function(){

                    checkWork[view[0].__v_model.descriptor.raw] = el.val()

                })

                el.parents('li').find('.multiple-condition').hide();

            },
            naturalNumber:function(attr){

                var mny = /^\d+$/;

                var $this = $(this)[0][attr];

                var e = e||window.event;

                var error = $(e.srcElement).parents('li').find('.multiple-condition')

                if( $this == '' ){

                    error.show();

                }else{

                    if(mny.test($this)){

                        error.hide();

                    }else{

                        error.show();

                    }

                }


            },
            dateFomrat:function(attr){

                var e = e||window.event;

                var el = $(e.srcElement);

                var mny = /^(0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/;

                var $this = $(this)[0][attr];

                var error = el.parents('li').find('.multiple-condition');

                if( mny.test($this) ){

                    error.hide();

                }else{

                    error.show();

                }

            }
        }

    })

    //存放所有列表数据的数组
    var _allData = [];

    //标记是否是新增按钮
    var _isNewButton = false;

    //记录当前选中行的id
    var _$thisID = '';

    /*---------------------------------------------表格初始化----------------------------------------*/
    var tableListCol = [

        {
            title:'id',
            data:'id',
            className:'id'
        },
        {
            title:'时间段名称',
            data:'name'
        },
        {
            title:'上班时间',
            data:'shangbantime',
            render:function(data, type, full, meta){

                var splitStr = data.split(':');

                return splitStr[0] + ':' + splitStr[1];

            }
        },
        {
            title:'下班时间',
            data:'xiabantime',
            render:function(data, type, full, meta){

                var splitStr = data.split(':');

                return splitStr[0] + ':' + splitStr[1];

            }
        },
        {
            title:'开始签到时间',
            data:'ksqdtime',
            render:function(data, type, full, meta){

                var splitStr = data.split(':');

                return splitStr[0] + ':' + splitStr[1];

            }
        },
        {
            title:'结束签到时间',
            data:'jsqdtime',
            render:function(data, type, full, meta){

                var splitStr = data.split(':');

                return splitStr[0] + ':' + splitStr[1];

            }
        },
        {
            title:'开始签退时间',
            data:'ksqttime',
            render:function(data, type, full, meta){

                var splitStr = data.split(':');

                return splitStr[0] + ':' + splitStr[1];

            }
        },
        {
            title:'结束签退时间',
            data:'jsqttime',
            render:function(data, type, full, meta){

                var splitStr = data.split(':');

                return splitStr[0] + ':' + splitStr[1];

            }
        },
        {
            title:'记迟到时间（分钟）',
            data:'jcdtime'
        },
        {
            title:'记早退时间（分钟）',
            data:'jzttime'
        },
        {
            title: '操作',
            "targets": -1,
            "data": null,
            "className": 'noprint',
            "defaultContent":
            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }

    ];

    _tableInit($('#table-list'),tableListCol,1,true,'','');

    conditionSelect();

    /*----------------------------------------------按钮事件----------------------------------------*/

    //新增
    $('.creatButton').click(function(){

        $('#ADD-Modal').find('.datatimeblock').click();

        //是新增按钮
        _isNewButton = true;

        //初始化
        detailedInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'), '新增', false, '' ,'', '新增');

        //添加登记类
        $('#ADD-Modal').find('.btn-primary').removeClass('shanchu').removeClass('bianji').addClass('dengji');

        //验证消息隐藏
        $('#ADD-Modal').find('.multiple-condition').hide();

        //模态框可操作
        abledOption();

    })

    //新增确定按钮
    $('#ADD-Modal').on('click','.dengji',function(){

        //发送请求
        editRegister('YWFZ/KQShiJianDuanAdd',false,'新增成功！','新增失败！');

    })

    //编辑
    $('#table-list').on('click','.option-edit',function(){

        //首先让日历插件失去焦点一次
        $('#ADD-Modal').find('.datatimeblock').click();

        //数据绑定
        bindData($(this));

        //模态框
        _moTaiKuang($('#ADD-Modal'),'编辑','','','','保存');

        //模态框可操作
        abledOption();

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('shanchu').removeClass('dengji').addClass('bianji');

        //验证消息隐藏
        $('#ADD-Modal').find('.multiple-condition').hide();

    })

    //编辑确定按钮
    $('#ADD-Modal').on('click','.bianji',function(){

        //发送请求
        editRegister('YWFZ/KQShiJianDuanUpdate',true,'编辑成功！','编辑失败！');

    })

    //删除
    $('#table-list').on('click','.option-delete',function(){

        //数据绑定
        bindData($(this));

        //模态框
        _moTaiKuang($('#ADD-Modal'),'确定要删除吗？','','','','删除');

        //不可操作
        disabledOption();

        //验证消息隐藏
        $('#ADD-Modal').find('.multiple-condition').hide();

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('bianji').removeClass('dengji').addClass('shanchu');

    })

    //删除确定按钮
    $('#ADD-Modal').on('click','.shanchu',function(){

        editRegister('YWFZ/ShiJianDuanDelete',true,'删除成功！','删除失败！');

    })
    /*----------------------------------------------其他方法---------------------------------------*/

    //模态框初始化-----------------------------------
    function detailedInit(){

        //时间段名称
        checkWork.tname = '';
        //上班时间
        checkWork.startwork = '';
        //下班时间
        checkWork.endwork = '';
        //开始签到时间
        checkWork.stsignwork = '';
        //结束签到时间
        checkWork.etsignwork = '';
        //开始签退时间
        checkWork.stsignoutwork = '';
        //结束签退时间
        checkWork.etsignoutwork = '';
        //记迟到时间
        checkWork.tlate = '';
        //记早退时间
        checkWork.tearly = '';

    }

    //其他方法发------------------------------------

    //条件查询
    function conditionSelect(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/KQShiJianDuanGetAll',
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                _allData.length = 0;

                for(var i=0;i<result.length;i++){

                    _allData.push(result[i]);

                }

                if(result.length != 0 ){

                    _datasTable($('#table-list'),result);

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //模态框是不可操作
    function disabledOption(){

        $('#ADD-Modal').find('li').find('input').attr('disabled',true).addClass('disabled-block');

        $('#ADD-Modal').find('li').find('input').parent().attr('disabled',true).addClass('disabled-block');

    }

    //模态框可操作
    function abledOption(){

        $('#ADD-Modal').find('li').find('input').attr('disabled',false).removeClass('disabled-block');

        $('#ADD-Modal').find('li').find('input').parent().attr('disabled',false).removeClass('disabled-block');

    }

    //登记、编辑方法(登记 false,编辑 true)
    function editRegister(url,flag,successMeg,errorMeg){

        //格式验证
        var a = $('#ADD-Modal').find('.dateType').eq(0).css('display');

        var b = $('#ADD-Modal').find('.dateType').eq(1).css('display');

        var c = $('#ADD-Modal').find('.dateType').eq(2).css('display');

        var d = $('#ADD-Modal').find('.dateType').eq(3).css('display');

        var e = $('#ADD-Modal').find('.dateType').eq(4).css('display');

        var f = $('#ADD-Modal').find('.dateType').eq(5).css('display');

        var g = $('#ADD-Modal').find('.numberType').eq(0).css('display');

        var h = $('#ADD-Modal').find('.numberType').eq(1).css('display');


        //格式验证
        if( checkWork.tname === '' || checkWork.startwork === '' || checkWork.endwork === '' || checkWork.stsignwork === '' || checkWork.etsignwork === '' || checkWork.stsignoutwork === '' || checkWork.etsignoutwork === '' || checkWork.tlate === '' || checkWork.tearly === '' ){

            _moTaiKuang($('#myModal2'),'提示','flag','istap','请输入红色必填项！','');

        }else{

            if( a == 'none' && b == 'none' && c == 'none' && d == 'none' && e == 'none' && f == 'none' && g == 'none' && h == 'none' ){

                var prm = {
                    //时间段名称
                    name:checkWork.tname,
                    //上班时间
                    shangbantime:checkWork.startwork,
                    //下班时间
                    xiabantime:checkWork.endwork,
                    //开始签到时间
                    ksqdtime:checkWork.stsignwork,
                    //结束签到时间
                    jsqdtime:checkWork.etsignwork,
                    //开始签退时间
                    ksqttime:checkWork.stsignoutwork,
                    //结束签退时间
                    jsqttime:checkWork.etsignoutwork,
                    //记迟到时间
                    jcdtime:checkWork.tlate,
                    //记早退时间
                    jzttime:checkWork.tearly

                };

                if(flag){

                    prm.id = _$thisID;

                }

                $.ajax({

                    type:'post',
                    url:_urls + url,
                    data:prm,
                    timeout:_theTimes,
                    beforeSend: function () {
                        $('#theLoading').modal('show');
                    },
                    complete: function () {
                        $('#theLoading').modal('hide');
                    },
                    success:function(result){

                        if(result == 99){

                            _moTaiKuang($('#myModal2'),'提示','flag','istap',successMeg,'');

                            $('#ADD-Modal').modal('hide');

                            conditionSelect();

                        }else{

                            _moTaiKuang($('#myModal2'),'提示','flag','istap',errorMeg,'');

                        }

                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }

                })



            }else{

                _moTaiKuang($('#myModal2'),'提示','flag','istap','请输入正确格式的数字！','');

            }

        }



    }

    //绑定数据
    function bindData($this){

        //样式
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        //绑定数据
        _$thisID = $this.parents('tr').children('.id').html();

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].id == _$thisID){

                //时间段名称
                checkWork.tname = _allData[i].name;
                //上班时间
                checkWork.startwork = _allData[i].shangbantime;
                //下班时间
                checkWork.endwork = _allData[i].xiabantime;
                //开始签到时间
                checkWork.stsignwork = _allData[i].ksqdtime;
                //结束签到时间
                checkWork.etsignwork = _allData[i].jsqdtime;
                //开始签退时间
                checkWork.stsignoutwork = _allData[i].ksqttime;
                //结束签退时间
                checkWork.etsignoutwork = _allData[i].jsqttime;
                //记迟到时间
                checkWork.tlate = _allData[i].jcdtime;
                //记早退时间
                checkWork.tearly = _allData[i].jzttime;

            }
        }

    }

})