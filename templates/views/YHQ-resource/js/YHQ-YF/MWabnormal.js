$(function(){

    /*----------------------------------------变量----------------------------------------*/

    var _allData = [];

    //记录当前医废单号
    var _thisId = '';

    /*----------------------------------------时间插件-------------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    /*---------------------------------------表格-----------------------------------------*/

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
            data:'isread',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '已处理'

                }else{

                    return '<span class="option-button option-edit option-error" data-attr="' + full.mwcode + '">' + '处理异常</span>'

                }
            }

        }

    ]

    _tableInit($('#table1'),mainTable1,'2','','','','','');

    //默认条件查询
    conditionSelect();

    /*---------------------------------------按钮事件-------------------------------------*/

    //重置
    $('#resetBtn').click(function(){

        $('#spDT').val(st);

        $('#epDT').val(nowTime);

        $('#MWDep').val('');

        $('#MWDep').removeAttr('data-id');

    })

    //处理异常
    $('#table1 tbody').on('click','.option-error',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        modalInit();

        //绑定值
        BindData(_thisId);

        //模态框
        _moTaiKuang($('#create-Modal'),'处理异常','','','','确定');

    })

    //【确定】处理异常
    $('#create-Modal').on('click','.btn-primary',function(){

        var prm = {

            //医废编号
            mwcode:_thisId,
            //备注
            remark:$('#MW-remark').val(),
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','MW/mwSetAlarmRead',prm,$('#create-Modal').find('.modal-dialog'),function(result){

            var arr = [];

            _allData.length = 0;

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                arr = result.data;

                _allData = result.data;

            }
            _datasTable($('#table1'),arr);

        })


    })

    /*---------------------------------------其他方法--------------------------------------*/

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
            keshinum:$('#MWDep').val(),
            //处理状态
            isread:$('#MW-deal').val(),
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','MW/mwGetAlarmInfos',prm,$('.content-top'),function(result){

            var arr = [];

            _allData.length = 0;

            if(result.code == 99){

                arr = result.data;

                _allData = result.data;

            }
            _datasTable($('#table1'),arr);

        })


    }

    //初始化
    function modalInit(){

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('textarea').val('');

    }

    //数据绑定
    function BindData(id){


        for(var i=0;i<_allData.length;i++){

            if( _allData[i].mwcode == id ){

                var data = _allData[i];

                //医废分类
                $('#MW-classify').val(data.wtname);
                //医废来源
                $('#MW-source').val(data.wsname);
                //科室
                $('#MW-dep').val(data.keshiname);
                //医废处理人
                $('#MW-person').val(data.sendusername);
                //运送人
                $('#MW-carrier').val(data.transusername);
                //打包重量
                $('#MW-weighNum').val(data.weight);
                //打包时间
                $('#MW-pack').val(data.sendtime);
                //入库人
                $('#MW-in-person').val(data.inusername);
                //称
                $('#MW-weigh').val(data.inscalename);
                //入库重量
                $('#MW-in-weigh').val(data.inweight);
                //桶编号
                $('#MW-bucket').val(data.batchnum);

            }

        }

    }

})