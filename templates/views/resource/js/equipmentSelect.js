$(function(){

    /*---------------------------------------------------变量--------------------------------------------------*/

    var _allDevice = [];

    //获取设备系统
    _getProfession('YWDev/ywDMGetDCs',$('#dev-type'),'','dcNum','dcName');

    //获取设备区域
    _getProfession('YWDev/ywDMGetDAs',$('#dev-area'),'','daNum','daName');

    //获取设备系统
    _getProfession('YWDev/ywDMGetDSs',$('#dev-system'),'','dsNum','dsName');

    //获取设备部门
    _getProfession('YWDev/ywDMGetDDs',$('#dev-depart'),'','ddNum','ddName');

    //获取设备系统与设备类型对应的父子关系
    var _relativeArr1 = [];

    getSelectContent('YWDev/GetDevSysGroupClass', _relativeArr1);
    /*----------------------------------------------------设备表格初始化----------------------------------------*/

    var devCol = [

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
            title:'安装地点',
            data:'installAddress',
        },
        {
            title:'设备类型',
            data:'dcName'
        }

    ];

    _tableInit($('#dev-table'),devCol,2,'','','','','');

    _WxBanzuStationData();

    /*------------------------------------------------------按钮事件----------------------------------------------*/

    //【选择设备】
    $('#select-Dev').click(function(){

        //首先验证车站和系统类型是否选择
        //车站
        var department = $(this).parents('.modal-body').find('.cjz').val();

        //系统类型
        var system = $(this).parents('.modal-body').find('.xitong').val();

        if( department == '' || system == '' ){

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请先选择车站和系统类型', '');

        }else{

            $('#theLoading').modal('show');

            //初始化
            devInit();

            //模态框
            _moTaiKuang($('#DEV-Modal'),'设备列表','','','','选择');


            //根据车站给设备部门赋值
            $('#dev-depart').val(department);

            //根据系统类型给设备系统赋值
            $('#dev-system').val(system);

            //根据选中的车站和系统类型，选择设备
            var classArr = getAllContent($('#dev-system').val(),_relativeArr1,true);

            var str = '<option value="">全部</option>';

            for(var i=0;i<classArr.length;i++){

                str += '<option value="' + classArr[i].value + '">' + classArr[i].text + '</option>';

            }

            $('#dev-type').empty().append(str);

            choiceDevice(false);

        }

    })

    //【设备查询】按钮
    $('#selected1').click(function(){

        $('#theLoading').modal('show');

        choiceDevice(false);

    })

    //表格点击事件
    $('#dev-table tbody').on('click','tr',function(){

        $('#dev-table tbody').children('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

    })

    //定制工单模块快速登记
    $('#quick-Dev').click(function(){

        //首先验证车站和系统类型是否选择
        //车站
        var department = $(this).parents('.modal-body').find('.cjz').val();

        //系统类型
        var system = $(this).parents('.modal-body').find('.xitong').val();

        if( department == '' || system == '' ){

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请先选择车站和系统类型', '');

        }else{

            $('#theLoading').modal('show');

            //初始化
            devInit();

            //模态框
            _moTaiKuang($('#DEV-Modal'),'设备列表','','','','选择');


            //根据车站给设备部门赋值
            $('#dev-depart').val(department);

            //根据系统类型给设备系统赋值
            $('#dev-system').val(system);

            //根据选中的车站和系统类型，选择设备
            var classArr = getAllContent($('#dev-system').val(),_relativeArr1,true);

            var str = '<option value="">全部</option>';

            for(var i=0;i<classArr.length;i++){

                str += '<option value="' + classArr[i].value + '">' + classArr[i].text + '</option>';

            }

            $('#dev-type').empty().append(str);

            choiceDevice(false);

        }



    })

    /*---------------------------------------------------其他方法------------------------------------------------*/

    //初始化
    function devInit(){

        //input
        $('#DEV-Modal').find('.condition-query').eq(0).find('input').val('');

        //select
        $('#DEV-Modal').find('.condition-query').eq(0).find('select').val('');

        //table
        //_datasTable($('#dev-table'),_allDevice);
    }

    //条件选择
    function choiceDevice(flag){

        var prm = {
            'dName':$('#DEV-Modal').find('.sbmc').val(),
            'dNum':$('#DEV-Modal').find('.sbbm').val(),
            'spec':$('#DEV-Modal').find('.ggxh').val(),
            'status':1,
            'daNum':$('#DEV-Modal').find('#dev-area').val(),
            'ddNum':$('#DEV-Modal').find('#dev-depart').val(),
            'dsNum':$('#DEV-Modal').find('#dev-system').val(),
            'dcNum':$('#DEV-Modal').find('#dev-type').val(),
            'userID':_userIdNum,
            'userName':_userIdName
        };

        var arr = [];

        //如果在维修班组中，则传wxKeshi，如果是在所属维保组中，则传wxKeshis=[]

        if(_AisWBZ){

            if(_AWBZArr.wxBanzus){

                for(var i=0;i<_AWBZArr.wxBanzus.length;i++){

                    arr.push(_AWBZArr.wxBanzus[i].departNum);

                }

            }

        }

        if(_AisBZ){

            arr.push(_maintenanceTeam);

        }

        prm.departNums = arr;

        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevsII',
            data:prm,
            success:function(result){

                $('#theLoading').modal('hide');

                if(flag){

                    _allDevice.length = 0;

                    for(var i=0;i<result.length;i++){

                        _allDevice.push(result[i]);

                    }

                }

                _datasTable($('#dev-table'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });

    }

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

    function getSelectContent(url,arr){

        $.ajax({
            type: 'get',
            url: _urls + url,
            timeout: _theTimes,
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
})