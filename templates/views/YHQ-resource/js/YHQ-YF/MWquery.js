$(function(){

    /*--------------------------------变量------------------------------*/

    //分类
    MWClassifyFun();

    //来源
    MWSourceFun();

    //科室
    var _depArr = [];

    MWDopFun();

    //当前的医废
    var _thisId = '';

    /*---------------------------------时间-----------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));


    /*--------------------------------表格------------------------------*/
    var mainCol = [
        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox"                                 value=""></span></div>'

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
            title:'状态',
            data:'mwstatus',
            className:'status',
            render:function(data, type, full, meta){

                return _YFstatus(data)

            }
        },
        {
            title:'重量',
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
            title:'入库重量',
            data:'inweight'
        },
        {
            title:'入库时间',
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
            title:'是否超时',
            data:''
        }

    ]

    _tableInit($('#table'),mainCol,'2','','','','','');

    conditionSelect();
    /*--------------------------------按钮------------------------------*/

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        $('.L-condition').eq(0).find('input').val('');

        $('.L-condition').eq(0).find('select').val('');

        $('#spDT').val(st);

        $('#epDT').val(nowTime);

        //科室重置
        $('#MW-dep').removeAttr('data-id');

    })

    //科室选择
    $('.select-dep').click(function(){

        //初始化
        _datasTable($('#dep-table'),[]);

        //数据
        _datasTable($('#dep-table'),_depArr);

        //模态框
        _moTaiKuang($('#dep-Modal'),'科室列表','','','','选择');


    })

    //选择科室
    $('#dep-Modal').on('click','.btn-primary',function(){

        var currentTr = $('#dep-table tbody').find('.tables-hover');

        if(currentTr.length >0){

            var num = currentTr.find('.checker').attr('data-id');

            var name = currentTr.children('td').eq(2).html();

            $('#MW-dep').attr('data-id',num);

            $('#MW-dep').val(name);

            $('#dep-Modal').modal('hide');

        }else{

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择科室','');

        }

    })

    //取消
    $('#cancelBtn').on('click',function(){

        //看是否选中了
        var currentTr = $('#table tbody').find('.tables-hover');

        if(currentTr.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择要回退的医废单号','');

            return false;

        }

        //如果是已取消的不能再次取消
        if(currentTr.find('.status').html() == '取消'){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'当前医废已取消','');

            return false;


        }

        _thisId = currentTr.find('a').html();

        var str = '确定要取消医废编号：' + _thisId + '吗？'

        //通过(模态框)
        _moTaiKuang($('#cancel-Modal'),'取消','',true,str,'确定');

    })

    //回退确定
    $('#cancel-Modal').on('click','.btn-primary',function(){

        cancelFun();

    })

    /*-------------------------------其他方法----------------------------*/

    //分类
    function MWClassifyFun(){

        var prm = {

            //分类名称
            wtname:''

        }

        _mainAjaxFunCompleteNew('post','MW/GetWasteTypeList',prm,false,function(result){

            var str = '<option value="">全部</option>'

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    str += '<option value="' + result.data[i].id + '">' + result.data[i].wtname + '</option>'

                }

            }

            $('#MW-classify').empty().append(str);

        })


    }

    //来源
    function MWSourceFun(){

        var prm = {}

        _mainAjaxFunCompleteNew('post','MW/GetWasteSrcList',prm,false,function(result){

            var str = '<option value="">全部</option>'

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    str += '<option value="' + result.data[i].id + '">' + result.data[i].wsname + '</option>'

                }

            }

            $('#MW-source').empty().append(str);

        })


    }

    //科室选择
    function MWDopFun(){

        var prm = {

            'userID':_userIdNum,

            'userName':_userIdName

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetDeparts',prm,false,function(result){

            _depArr.length = 0;

            if(result){

                var str = '<option value="">全部</option>'

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].departNum + '">' + result[i].departName + '</option>'

                    _depArr.push(result[i]);

                }

                $('#modal-carrier-dep').empty().append(str);

            }


        })


    }

    //条件选择
    function conditionSelect(){

        var prm = {

            //分类
            wtid:$('#MW-classify').val(),
            //来源
            wsid:$('#MW-source').val(),
            //科室
            keshinum:$('#MW-dep').val()==''?'':$('#MW-dep').attr('data-id'),
            //状态
            mwstatus:$('#MW-status').val(),
            //医废编号
            mwcode:$('#MWNum').val(),
            //开始时间
            sendtimest:$('#spDT').val(),
            //结束时间
            sendtimeet:moment($('#epDT').val()).add(1,'days').format('YYYY-MM-DD'),
            //桶编号
            batchnum:$('#MW-bucket').val(),
            //是否超时
            isqueryexceedtime:$('#MW-moreTime').val(),
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','MW/mwGetInfos',prm,$('.content-top'),function(result){

            var arr = [];

            if(result.code == 99){

                arr = result.data;

            }

            _datasTable($('#table'),arr);

        })


    }

    //取消
    function cancelFun(){

        var prm = {
            //单号
            mwcode:_thisId,
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','MW/mwCancel',prm,$('#cancel-Modal').find('.modal-dialog'),function(result){

            if(result.code == '99'){

                $('#cancel-Modal').modal('hide');

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


        })

    }

})