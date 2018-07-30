$(function(){

    //当前选中的区域的id
    var _thisDistrict = '';

    //当前企业id
    var _thisErp = '';

    //记录当前设备选择的按钮
    var _thisDevButton = '';

    //当前户号Id
    var _thisHHId = '';

    //当前资源返回的id数组
    var _thisResIdArr = [];

    //存放静态数组的设备
    var _demoDevArr = [];

    //当前的资源id
    var _resourceId = '';

    /*-------------------------------------表单验证---------------------------------*/

    $('#commentFormAccount').validate({

        rules:{

            //编码
            'account-num':{

                required: true

            },

            //名称
            'account-name':{

                required: true

            },

            //区域
            'account-district':{

                required: true

            },

            //签署容量
            'account-capacity':{

                required: true,

                numberFormat1:true

            }

        },
        messages:{

            //编码
            'account-num':{

                required: '请输入编码'

            },

            //名称
            'account-name':{

                required: '请输入名称'

            },

            //区域
            'account-district':{

                required: '请选择区域'

            }

        }

    })

    //正则表达式（大于0的数字）
    $.validator.addMethod("numberFormat1",function(value,element,params){

        var doubles= /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入大于0的数字");

    /*---------------------------------------表格初始化------------------------------*/

    var districtCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<div class="checker"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'区域编码',
            data:'id'
        },
        {
            title:'区域名称',
            data:'name'
        },
        {
            title:'父级',
            data:'pId'
        },
        {
            title:'区域等级',
            data:'level',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '省级'

                }else if(data == 2){

                    return '市级'

                }

            }
        }

    ]

    _tableInit($('#district-table'),districtCol,2,true,'','','','',10);

    //企业
    var eprCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<div class="checker" data-id="' + full.eprId + '"><span><input type="checkbox" value=""></span></div>'

            }
        },
        {
            title:'企业编码',
            data:'eprCode'
        },
        {
            title:'企业名称',
            data:'eprName'
        },
        {
            title:'企业类型',
            data:'eprTypeName'
        }

    ]

    _tableInit($('#epr-table'),eprCol,2,true,'','','','',10);

    //资源
    var resCol = [

        {
            title:'资源名称',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-chinese input-value input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip" style="display:none; "></span>'

            }
        },
        {
            title:'额定功率',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value input-num input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip" style="display:none; "></span>'

            }
        },
        {
            title:'消减功率',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value input-num input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip" style="display:none; "></span>'

            }
        },
        {
            title:'最大响应次数',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value input-num input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip" style="display:none; "></span>'

            }
        },
        {
            title:'响应次序',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value input-num input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip" style="display:none; "></span>'

            }
        },
        {
            title:'提前通知小时（h）',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-value input-num input-required table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip" style="display:none; "></span>'

            }
        },
        //{
        //    title:'设备绑定',
        //    className:'inputValue minW',
        //    render:function(data, type, full, meta){
        //
        //        return '<span class="select-district-table" style="display: inline-block;padding: 3px 5px;border: 1px solid #cccccc;border-radius: 4px !important;margin-right: 5px;cursor: pointer">设备</span><input type="text" class="table-group-action-input form-control" placeholder="选填，且多选" readonly style="background: #ffffff;width: 120px;display: inline-block;"><span class="error-tip" style="display:none; "></span>'
        //
        //    }
        //},
        {
            title:'设备是否具有信息交互接口',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<div class="switch">' + '<input class="switchButton" type="checkbox" value="0" />' + '</div>';

            }
        },
        {
            title:'资源类型',
            className:'inputValue minW1',
            render:function(data, type, full, meta){

                return '<select class="table-group-action-input form-control"><option value="1" selected>照明</option><option value="2">电梯</option><option value="3">空调</option><option value="4">动力</option><option value="5">其他</option></select></span>'

            }
        },
        {
            title:'描述',
            className:'inputValue',
            render:function(data, type, full, meta){

                return '<input type="text" class="input-chinese input-value table-group-action-input form-control" placeholder="必填字段" style="background: #ffffff"><span class="error-tip" style="display:none; "></span>'

            }
        },
        {
            title:'操作',
            className:'minW1',
            render:function(data, type, full, meta){

                return '<span class="option-button option-save">保存</span>' +

                    '<span class="option-button option-del">删除</span>'

            }
        }

    ]

    _tableInit($('#resourceTable'),resCol,2,true,'','','','',10);

    //添加设备（表格编辑）
    var editCol = [

        {
            title:'功率设备',
            render:function(data, type, full, meta){

                return '<div type="text" class="select-dev-GL table-group-action-input form-control" placeholder="点击选择" style="cursor: pointer">点击选择</div>'

            }


        },
        {
            title:'电量设备',
            render:function(data, type, full, meta){

                return '<div type="text" class="select-dev-DL table-group-action-input form-control" placeholder="点击选择" style="cursor: pointer">点击选择</div>'

            }


        },
        {
            title:'控制设备',
            render:function(data, type, full, meta){

                return '<div type="text" class="select-dev-KZ table-group-action-input form-control" placeholder="点击选择" style="cursor: pointer">点击选择</div>'

            }


        },
        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='option-button option-del'>删除</span>"

            }
        }

    ];

    _tableInit($('#dev-manage'),editCol,2,true,'','','','','',true);

    //设备
    var devCol = [

        //{
        //    title:'选择',
        //    "targets": -1,
        //    "data": null,
        //    render:function(data, type, full, meta){
        //
        //        return '<div class="checker" data-id="' + full.f_ServiceId + '" data-pointer="' + full.f_BuildingId + '"><span><input type="checkbox" value=""></span></div>'
        //
        //    }
        //},
        {
            title:'设备编码',
            data:'f_ServiceId'
        },
        {
            title:'设备',
            data:'f_ServiceName'
        }

    ];

    _tableInit($('#dev-table'),devCol,2,true,'','','','',10,'');

    //添加设备表格
    var addDevCol = [

        {
            title:'资源',
            data:'resourceName',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.num + '">' + data + '</span>'

            }
        },
        {
            title:'添加设备',
            data:'',
            render:function(data, type, full, meta){

                return '<div type="text" class="select-district-table table-group-action-input form-control" placeholder="添加设备" style="cursor: pointer">点击选择</div>'

            }
        }

    ];

    _tableInit($('#devTable'),addDevCol,2,true,'','','','',10,'');
    /*--------------------------------------按钮事件---------------------------------*/

    //选择区域
    $('.select-district').click(function(){

        $('#theLoading').modal('show');

        //初始化
        _datasTable($('#district-table'),[]);

        _thisDistrict = '';

        //模态框
        _moTaiKuang($('#district-Modal'),'区域',false,'','','选择');

        //数据
        getDistrict();

    })

    //区域表格【选择】
    $('#district-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#district-table tbody').find('tr').removeClass('tables-hover');

            $('#district-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#district-table tbody').find('tr').removeClass('tables-hover');

            $('#district-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //选择区域的id
    $('#district-Modal').on('click','.btn-primary',function(){

        _thisDistrict = $('#district-table').find('.tables-hover').children().eq(1).html();

        if(!_thisDistrict){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择区域','')

        }else{

            var name = $('#district-table').find('.tables-hover').children().eq(2).html();

            $('#district-Modal').modal('hide');

            $('#account-district').val(name);

        }

    })

    //【选择企业】
    $('.select-epr').click(function(){

        //初始化
        $('#keyWord-epr-modal').val('');

        _datasTable($('#epr-table'),[]);

        _thisErp = '';

        //模态框
        _moTaiKuang($('#epr-Modal'),'选择企业','','','','确定');

        //获取数据
        getEpr();

    })

    //选怎企业【tr】
    $('#epr-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $('#epr-table tbody').find('tr').removeClass('tables-hover');

            $('#epr-table tbody').find('input').parent('span').removeClass('checked');

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $('#epr-table tbody').find('tr').removeClass('tables-hover');

            $('#epr-table tbody').find('input').parent('span').removeClass('checked');

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //企业选择【确定按钮】
    $('#epr-Modal').on('click','.btn-primary',function(){

        //获取区域id
        _thisErp = $('#epr-table').find('.tables-hover').find('.checker').attr('data-id');

        if(!_thisErp){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择要绑定的企业','')

        }else{

            //区域name
            var name = $('#epr-table').find('.tables-hover').children().eq(2).html();

            $('#epr-Modal').modal('hide');

            $('#account-epr').val(name);

        }

    })

    //【创建户号】
    $('#createAccount').click(function(){

        formatValidateAccount(function(){

            sendOption()

        })

    })

    //创建资源

    //【增加一条资源】
    $('.button-add').on('click',function(){

        //获取表格对象
        var T = $('#resourceTable').DataTable();

        T.row.add(['','','','']).draw();

        $('.switch input').bootstrapSwitch({

            size : "small",
            state:false,
            onSwitchChange:function(event,state){

                if(state==true){

                    $(this).val("1");

                }else{

                    $(this).val("0");
                }
            }

        });

    })

    //保存
    $('#resourceTable tbody').on('click','.option-save',function(){

        //首先将dom都抓取出来

        var currentTr = $(this).parent().parent();

        //必填dom
        var requiredBlock = currentTr.find('.input-required');

        //所有input需手填的值
        var inputValue = currentTr.find('.input-value');

        //标记当前格式验证是否通过
        var isAllow = true;

        //规则，必填之后验证格式
        //首先验证非空
        for(var i=0;i<requiredBlock.length;i++){

            if(requiredBlock.eq(i).val() == ''){

                //指出哪个是不符合的
                requiredBlock.eq(i).addClass('table-error');

                requiredBlock.eq(i).next('.error-tip').html('该项为必填字段').show();

            }else{

                //验证数字
                if(requiredBlock.eq(i).attr('class').indexOf('input-num')>-1){

                    //非空验证通过之后，验证正则
                    var reg = /^\d+(\.\d+)?$/;

                    if(reg.test(requiredBlock.eq(i).val())){

                        requiredBlock.eq(i).next('.error-tip').hide();

                        requiredBlock.eq(i).removeClass('table-error');

                    }else{

                        requiredBlock.eq(i).next('.error-tip').show();

                        requiredBlock.eq(i).addClass('table-error');

                    }


                }else{

                    requiredBlock.eq(i).next('.error-tip').hide();

                    requiredBlock.eq(i).removeClass('table-error');

                }

            }

        }

        //现在判断表格中是否还存在error，如果存在的话，就不能保存
        var error = currentTr.find('.table-error').length;

        if(error != 0){

            isAllow = false;

        }

        if(isAllow){

            //暂存当前input中的值
            var valueArr = [];

            for(var i=0;i<inputValue.length;i++){

                valueArr.push(inputValue.eq(i).val())

            }

            //将手填的input换成span
            for(var i=0;i<valueArr.length;i++){

                //如果是非空，如果是数字
                //手填 input-value 数字 input-num 必填 input-required  样式 table-group-action-input form-control
                var name = inputValue.eq(i).attr('class')

                var str = '<span class="' + name + ' noStyle">' + valueArr[i] + '</span>';

                var td = inputValue.eq(i).parent('td');

                td.html(str);

            }

            //switch不可操作
            var switchButton = currentTr.find('.switchButton');

            switchButton.bootstrapSwitch('disabled',true);

            //select也不可操作
            var select = currentTr.find('select');

            select.attr('disabled',true);

            $(this).html('编辑').removeClass('option-save').addClass('option-edit');


        }




    })

    //编辑
    $('#resourceTable tbody').on('click','.option-edit',function(){

        //将span换成input
        var currentTr = $(this).parent().parent();

        var inputValue = currentTr.find('.input-value');

        //暂存当前input中的值
        var valueArr = [];

        for(var i=0;i<inputValue.length;i++){

            valueArr.push(inputValue.eq(i).html())

        }

        //将手填的input换成span
        for(var i=0;i<valueArr.length;i++){

            var str = '';

            var td = inputValue.eq(i).parent('td');

            var name = inputValue.eq(i).attr('class');

            str = '<input class="' + name + '" placeholder="必填字段" style="background: #ffffff" value="' + valueArr[i] + '"><span class="error-tip" style="display:none; "></span>'

            td.html(str);

            td.children().removeClass('noStyle')

        }

        //switch不可操作
        var switchButton = currentTr.find('.switchButton');

        switchButton.bootstrapSwitch('disabled',false);

        //select也不可操作
        var select = currentTr.find('select');

        select.attr('disabled',false);

        $(this).html('保存').removeClass('option-edit').addClass('option-save');

    })

    //删除
    $('#resourceTable tbody').on('click','.option-del',function(){

        //获取表格对象
        var T = $('#resourceTable').DataTable();

        T.row($(this).parents('tr')).remove().draw( false );

    })

    //设备选择
    $('#devTable tbody').on('click','.select-district-table',function(){

        //初始化
        _datasTable($('#dev-manage'),[]);

        _thisDevButton = $(this);

        //获取资源id
        _resourceId = $(this).parent().parent().children().eq(0).children().attr('data-num');

        var dev = [];

        //查看选择过设备没有（静态）;
        for(var i=0;i<_demoDevArr.length;i++){

            if(_demoDevArr[i].id == _resourceId){

                //将已选中的添加到表格中
                _datasTable($('#dev-manage'),_demoDevArr[i].dev);

                dev = _demoDevArr[i].dev

            }
        }

        //给表格绑定值
        var tr = $('#dev-manage tbody').children();

        if(dev.length != 0){

            //遍历tr
            for(var i=0;i<tr.length;i++){

                //功率设备(id)
                tr.eq(i).children().eq(0).children().attr('data-num',dev[i].powerId);
                //功率设备（名称）
                tr.eq(i).children().eq(0).children().html(dev[i].powerName);
                //楼宇
                tr.eq(i).children().eq(0).children().attr('data-pid',dev[i].pointerId);

                //电量设备(id)
                tr.eq(i).children().eq(1).children().attr('data-num',dev[i].electricityId);
                //电量设备(pid,楼宇)
                tr.eq(i).children().eq(1).children().html(dev[i].electricityName);
                //楼宇
                tr.eq(i).children().eq(1).children().attr('data-pid',dev[i].pointerId);

                //控制设备(id)
                tr.eq(i).children().eq(2).children().attr('data-num',dev[i].contrlId);
                //控制设备(pid,楼宇)
                tr.eq(i).children().eq(2).children().attr('data-pid',dev[i].pointerId);
                //控制设备(name)
                tr.eq(i).children().eq(2).children().html(dev[i].contrlName);
            }

        }

        //模态框
        _moTaiKuang($('#bind-table-Modal'),'管理设备','','','','确定');

    })

    //表格中非空字段
    $('#resourceTable tbody').on('keyup','.input-required',function(){

        //验证非空
        if($(this).val() == ''){

            $(this).next('.error-tip').html('该项为必填字段').show();

            $(this).addClass('table-error');

        }else{

            //区分数字和文本的必填项

            $(this).next('.error-tip').html('').hide();

            $(this).removeClass('table-error');

            //验证格式(说明是数字)
            if($(this).attr('class').indexOf('input-num')>=0){

                var reg = /^\d+(\.\d+)?$/;

                if(reg.test($(this).val())){

                    $(this).next('.error-tip').html('').hide();

                    $(this).removeClass('table-error');

                }else{

                    $(this).next('.error-tip').html('请输入大于0的数字').show();

                    $(this).addClass('table-error');

                }

            }

        }

    })

    //设备

    //添加一行设备
    $('#bind-table-Modal').on('click','.add-row-dev',function(){

        var T = $('#dev-manage').DataTable();

        T.row.add(['','','','']).draw();

    })

    //选择功率设备
    $('#dev-manage tbody').on('click','.select-dev-GL',function(){

        //初始化
        _datasTable($('#dev-table'),[]);

        //表格
        _moTaiKuang($('#dev-Modal'),'设备','','','','选择');

        //数据
        devData();

        //类
        $('#dev-Modal').find('.btn-primary').removeClass('dev-DL-B').removeClass('dev-KZ-B').addClass('dev-GL-B');

        _currentCell = $(this);

    })

    //选择电量设备
    $('#dev-manage tbody').on('click','.select-dev-DL',function(){

        //初始化
        _datasTable($('#dev-table'),[]);

        //表格
        _moTaiKuang($('#dev-Modal'),'设备','','','','选择');

        //数据
        devData();

        //类
        $('#dev-Modal').find('.btn-primary').removeClass('dev-GL-B').removeClass('dev-KZ-B').addClass('dev-DL-B');

        _currentCell = $(this);

    })

    //选择控制设备
    $('#dev-manage tbody').on('click','.select-dev-KZ',function(){

        //初始化
        _datasTable($('#dev-table'),[]);

        //表格
        _moTaiKuang($('#dev-Modal'),'设备','','','','选择');

        //数据
        devData();

        //类
        $('#dev-Modal').find('.btn-primary').removeClass('dev-GL-B').removeClass('dev-DL-B').addClass('dev-KZ-B');

        _currentCell = $(this);

    })

    //选择设备按钮
    $('#dev-Modal').on('click','.btn-primary',function(){

        //ztree选择
        //获取树
        var treeObj =  $.fn.zTree.getZTreeObj("ztreeObj");

        //获取已选中的节点
        var nodes = treeObj.getCheckedNodes(true);

        var num = nodes[0].id;

        var name = nodes[0].name;

        var pid = nodes[0].pointer;

        _currentCell.attr('data-num',num);

        _currentCell.attr('data-pid',pid);

        _currentCell.html(name);

        $('#dev-Modal').modal('hide');

    })

    //删除
    $('#dev-manage').on('click','.option-del',function(){

        var T = $('#dev-manage').DataTable();

        T.row($(this).parents('tr')).remove().draw( false );

    })

    //获取绑定的n组数据
    $('#bind-table-Modal').on('click','.btn-primary',function(){

        var tr = $('#dev-manage tbody').children('tr');

        var thisArr = [];

        //要考虑到只选择了一个的情况，比如说只选择了一个功率

        for(var i=0;i<tr.length;i++ ){

            if(tr.eq(i).children('td').length>1){

                //console.log(33)

                var currentTr = $(tr).eq(i);

                var pointer = '';

                if(currentTr.find('.select-dev-GL').attr('data-pid')){

                    pointer = currentTr.find('.select-dev-GL').attr('data-pid');

                }else if(currentTr.find('.select-dev-DL').attr('data-pid')){

                    pointer = currentTr.find('.select-dev-DL').attr('data-pid');

                }else if(currentTr.find('.select-dev-KZ').attr('data-pid')){

                    pointer = currentTr.find('.select-dev-KZ').attr('data-pid');

                }

                var obj = {};
                //用户资源Id
                obj.resourceId = _resourceId;
                //楼宇Id ,
                obj.pointerId = pointer;
                //功率Id
                obj.powerId = currentTr.find('.select-dev-GL').attr('data-num')==undefined?'':currentTr.find('.select-dev-GL').attr('data-num');
                //功率名称
                obj.powerName = currentTr.find('.select-dev-GL').attr('data-num')==undefined?'':currentTr.find('.select-dev-GL').html();
                //电量Id
                obj.electricityId = currentTr.find('.select-dev-DL').attr('data-num')==undefined?'':currentTr.find('.select-dev-DL').attr('data-num');
                //电量名称
                obj.electricityName = currentTr.find('.select-dev-DL').attr('data-num')==undefined?'':currentTr.find('.select-dev-DL').html();
                //输出控制设备Id
                obj.contrlId = currentTr.find('.select-dev-KZ').attr('data-num')==undefined?'':currentTr.find('.select-dev-KZ').attr('data-num');
                //控制名称
                obj.contrlName = currentTr.find('.select-dev-KZ').attr('data-num')==undefined?'':currentTr.find('.select-dev-KZ').html();

                thisArr.push(obj);

                //console.log(thisArr);

            }

        }

        $('#bind-table-Modal').modal('hide');

        var str = '绑定[ ' + thisArr.length + ' ]组设备';

        _thisDevButton.html(str)


        //console.log(thisArr);

        if(_demoDevArr.length == 0){

                var obj = {};

                obj.id = _resourceId;

                obj.dev = thisArr;

                _demoDevArr.push(obj);

        }else{

            $(_demoDevArr).each(function(i,o) {

                if(o.id == _resourceId){

                    o.dev.length = 0;

                    $(thisArr).each(function(k,j){

                        o.dev.push(j);

                    });

                    return false;

                }

                if(i == _demoDevArr.length-1 && o.id != _resourceId){

                    var obj = {};

                    obj.id = _resourceId;

                    obj.dev = thisArr;

                    _demoDevArr.push(obj);

                }

            });




        }



    })

    //给户号绑定资源
    $('#createResource').click(function(){

        var arr = [];

        var trs = $('#resourceTable tbody').children();

        for(var i=0;i<trs.length;i++){

            var obj = {};
            //资源名称 ,
            obj.name = trs.eq(i).children().eq(0).children().html();
            //户号
            obj.acctId = _thisHHId,
            //额定功率
            obj.ratedpower = trs.eq(i).children().eq(1).children().html();
            //消减功率
            obj.reducepower = trs.eq(i).children().eq(2).children().html();
            //年度最大响应次数
            obj.maxtimes = trs.eq(i).children().eq(3).children().html();
            //是否交互
            obj.iscomm = trs.eq(i).find('.switchButton').val();
            //通知时间
            obj.noticehour = trs.eq(i).children().eq(5).children().html();
            //资源类型 ,
            obj.resourceType = trs.eq(i).find('select').val();
            //响应次序
            obj.respondSort = trs.eq(i).children().eq(4).children().html();
            //描述
            obj.memo = trs.eq(i).children().eq(8).children().html();
            //区域id
            obj.districtId = _thisDistrict;
            //绑定设备个数
            obj.meterNbrs = 0;
            //用户资源绑定设备
            obj.rbms = [];

            arr.push(obj);

        }

        var prm = {

            //户号
            acctId:_thisHHId,
            //资源
            resBMs:arr

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResourceNew/CreateDRResourceListByAcctId',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == -2){

                    //_moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _topTipBar('异常错误')

                }else if(result.code == -3){

                    _topTipBar('参数错误')

                }else if(result.code == -4){

                    _topTipBar('内容已存在')

                }else if(result.code == -6){

                    _topTipBar('抱歉，您没有绑定资源的权限')

                }else if(result.code == 0){

                    for(var i=0;i<result.resNewIds.length;i++){

                        _thisResIdArr.push(result.resNewIds[i]);

                    }

                    //跳转到设备
                    //跳转、样式修改
                    $('.steps').children().removeClass('active');

                    $('.steps').children().eq(2).addClass('active');

                    $('.tab-pane').hide();

                    $('.tab-pane').eq(2).show();

                    $('#theLoading').modal('hide');

                    //进度条
                    $('.progress-bar-success').css({width:'100%'});

                    _thisResIdArr = result.resNewIds;

                    addDev(_thisResIdArr)


                }

            },

            error:_errorBar

        })

    })

    //给资源绑定设备
    $('#createDev').click(function(){

        var arr = [];

        for(var i=0;i<_demoDevArr.length;i++){

            for(var j=0;j<_demoDevArr[i].dev.length;j++){

                var obj = {};
                //户号Id
                obj.accountId = _thisHHId;
                //resourceId
                obj.resourceId = _demoDevArr[i].dev[j].resourceId;
                // 楼宇Id
                obj.pointerId = _demoDevArr[i].dev[j].pointerId;
                //功率Id
                obj.powerId = _demoDevArr[i].dev[j].powerId;
                //功率名称
                obj.powerName = _demoDevArr[i].dev[j].powerName;
                // 电量Id
                obj.electricityId = _demoDevArr[i].dev[j].electricityId;
                //电量名称
                obj.electricityName = _demoDevArr[i].dev[j].electricityName;
                //输出控制设备Id ,
                obj.controId = _demoDevArr[i].dev[j].controId;
                //输出控制设备名称
                obj.controName = _demoDevArr[i].dev[j].contrlName;

                arr.push(obj);

            }

        }

        var prm = {

            resBMs:arr

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResourceNew/CreateMetersByResIds',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                console.log(result);

                if(result.code == -2){



                }else if(result.code == -1){

                    _topTipBar('异常错误')

                }else if(result.code == -3){

                    _topTipBar('参数错误')

                }else if(result.code == -4){

                    _topTipBar('内容已存在')

                }else if(result.code == 0){

                   window.location.href='resource.html'
                }

            },

            error:_errorFun

        })


    })

    /*-------------------------------其他方法--------------------------------------*/

    //获取区域
    function getDistrict(){

        var prm = {

            keyword:$('#keyWord-modal').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRDistrict/GetDRDistrictDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }else if(result.code == 0){

                    var arr = result.dists.reverse();

                    //表格
                    _jumpNow($('#district-table'),arr);
                }

            },

            error:_errorFun

        })

    }

    //获取企业数据
    function getEpr(){

        $('#theLoading').modal('show');

        var prm = {

            keyword:$('#keyWord-epr-modal').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRAccount/GetEprsByNotAggr',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

                }else if(result.code == 0){

                    var arr = result.eprs;

                    //表格
                    _jumpNow($('#epr-table'),arr);
                }

            },

            error:_errorFun

        })

    }

    //户号非空验证
    function formatValidateAccount(fun){

        //非空验证
        if($('#account-num').val() == '' || $('#caccount-name').val() == '' || $('#account-district').val() == '' ){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项','');

        }else{

            //验证错误
            var error = $('#commentFormAccount').find('.error');

            if(error.length != 0){

                var flag = true;

                for(var i=0;i<error.length;i++){

                    if(error.eq(i).css('display') != 'none'){

                        flag = false;

                        break;

                    }

                }

                if(flag){

                    fun();

                }else{

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写正确格式','');

                }

            }else{

                //验证通过
                fun();

            }


        }

    }

    //户号发送数据
    function sendOption(){

        var prm = {

            //户号编码
            accountCode : $('#account-num').val(),
            //账户名称
            accountName : $('#account-name').val(),
            //所属区域
            districtId:_thisDistrict,
            //选择企业
            eprId:_thisErp,
            //备注
            memo:$('#create-remark').val(),
            //签署容量
            signatureVolume:$('#account-capacity').val()

        };

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRAccountNew/CreateDRAccountInfoReturnNewId',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //跳转、样式修改
                    $('.steps').children().removeClass('active');

                    $('.steps').children().eq(1).addClass('active');

                    $('.tab-pane').hide();

                    $('.tab-pane').eq(1).show();

                    $('#theLoading').modal('hide');

                    //进度条
                    $('.progress-bar-success').css({width:'66.66%'});

                    _thisHHId = result.acctNewId


                }else if(result.code == -2){

                    //_moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _topTipBar('异常错误')

                }else if(result.code == -3){

                    _topTipBar('参数错误')

                }else if(result.code == -4){

                    _topTipBar('内容已存在')

                }else if(result.code == -6){

                    _topTipBar('抱歉，您没有创建户号的权限');

                }

            },

            error:_errorFun


        })

    }

    //ztree树
    function setZtree(treeId,treeData){

        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "s", "N": "ps" },
                radioType:'all',
                nocheckInherit: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{
                showIcon:false,
            },
            callback: {

                onClick: function(e,treeId,treeNode){

                    var treeObj = $.fn.zTree.getZTreeObj(treeId);

                    //取消全部打钩的节点
                    treeObj.checkNode(treeNode,!treeNode.checked,true);

                },
                beforeClick:function(){

                    $('#ztreeObj').find('.curSelectedNode').removeClass('curSelectedNode');

                },
                onCheck:function(e,treeId,treeNode){

                    var treeObj = $.fn.zTree.getZTreeObj(treeId);

                    $('#ztreeObj').find('.curSelectedNode').removeClass('curSelectedNode');

                    $('#ztreeObj').find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                    //取消全部打钩的节点
                    treeObj.checkNode(treeNode,true,true);

                }

            }
        };

        pointerObj = $.fn.zTree.init(treeId, setting, treeData);


    }

    //ztree树搜索功能
    function searchKey(key){

        //首先解绑所有事件
        key.off();

        //聚焦事件
        key.bind("focus",focusKey($('#keyWord-dev-modal')));
        //失去焦点事件
        key.bind("blur", blurKey);
        //输入事件
        //key.bind("propertychange", searchNode);
        //输入事件
        key.bind("input", searchNode);

        function focusKey(e) {

            if ($('#keyWord-dev-modal').hasClass("empty")) {

                $('#keyWord-dev-modal').removeClass("empty");

            }
        }

        function blurKey(e) {

            //内容置为空，并且加empty类
            if ($('#keyWord-dev-modal').get(0).value === "") {

                $('#keyWord-dev-modal').addClass("empty");
            }
        }

        var lastValue='',nodeList=[];

        function searchNode(e) {

            //获取树
            var zTree = $.fn.zTree.getZTreeObj("ztreeObj");

            //去掉input中的空格（首尾）
            var value = $.trim($('#keyWord-dev-modal').get(0).value);

            //设置搜索的属性
            var keyType = "name";

            if (lastValue === value)

                return;

            lastValue = value;

            if (value === "") {

                $('.tipe').html('');
                //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。
                //获取 zTree 的全部节点数据
                //如果input是空的则显示全部；
                zTree.showNodes(zTree.transformToArray(zTree.getNodes())) ;

                return;
            }
            //getNodesByParamFuzzy:根据节点数据的属性搜索，获取条件模糊匹配
            // 的节点数据 JSON 对象集合
            nodeList = zTree.getNodesByParamFuzzy(keyType,value);

            nodeList = zTree.transformToArray(nodeList);

            if(nodeList==''){

                $('.tipe').html('抱歉，没有您想要的结果');

            }else{

                $('.tipe').html('');

            }

            updateNodes(true);

        }

        //选中之后更新节点
        function updateNodes(highlight) {

            var zTree = $.fn.zTree.getZTreeObj("ztreeObj");

            var allNode = zTree.transformToArray(zTree.getNodes());

            //指定被隐藏的节点 JSON 数据集合
            zTree.hideNodes(allNode);

            //遍历nodeList第n个nodeList

            for(var n in nodeList){

                findParent(zTree,nodeList[n]);

            }

            zTree.showNodes(nodeList);
        }

        //确定父子关系
        function findParent(zTree,node){

            //展开符合搜索条件的节点
            //展开 / 折叠 指定的节点
            zTree.expandNode(node,true,false,false);

            if(typeof node == 'object'){

                //pNode父节点
                var pNode = node.getParentNode();

            }

            if(pNode != null){

                nodeList.push(pNode);

                findParent(zTree,pNode);
            }
        }

    }

    //获取设备列表
    function devData(){

        $('#theLoading').modal('show');

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRResource/GetResourceBindMeterSelectDs',

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                _datasTable($('#dev-table'),result.serviceObjs);

                //格式化数据
                var ztreeArr = [];

                for(var i=0;i<result.serviceObjs.length;i++){

                    var obj = {};

                    obj.name = result.serviceObjs[i].f_ServiceName;

                    obj.id = result.serviceObjs[i].f_ServiceId;

                    obj.pId = result.serviceObjs[i].f_ParentId;

                    obj.pointer = result.serviceObjs[i].f_BuildingId;

                    ztreeArr.push(obj);

                }

                setZtree($('#ztreeObj'),ztreeArr);

                var treeObj = $.fn.zTree.getZTreeObj("ztreeObj");

                var nodes = treeObj.getCheckedNodes(false);

                if (nodes.length>0) {

                    treeObj.expandNode(nodes[4], true, false, true);

                }

                //ztree搜索功能
                var key = $("#keyWord-dev-modal");

                searchKey(key);
            },

            error:_errorFun

        })
    }

    //根据数组，生成添加设备表格
    function addDev(arr){

        var resArr = [];

        for(var i=0;i<arr.length;i++){

            var obj = {};

            obj.resourceName = '资源' + (i + 1);

            obj.num = arr[i];

            resArr.push(obj);

        }

        //console.log(resArr);

        _datasTable($('#devTable'),resArr);

    }

})