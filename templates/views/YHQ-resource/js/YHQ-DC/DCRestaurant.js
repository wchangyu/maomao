$(function(){

    /*---------------------------------------变量-----------------------------------------*/

    //存放所有数据
    var _allData = [];

    //当前的餐厅id
    var _thisId = '';

    //当前餐厅编号
    var _thisBM = '';

    //暂存部门
    var _depArr = [];

    //已选中的部门
    var _selectDep = [];

    //部门
    departData();

    /*----------------------------------------时间----------------------------------------*/

    //条件查询时间初始化
    _timeYMDComponentsFun11($('.abbrDT'));

    //模态框时间初始化
    //_timeComponentsFun($('.DC-time'));

    $('.DC-time').datetimepicker({
        language:  'zh-CN',//此处修改
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        format : "hh:ii",//日期格式
        startView: 1,  //1时间  2日期  3月份 4年份
        forceParse: 0,
        maxView : 'hour'
    }).on('change',function(picker, values, displayValues){

        var dom = $(picker.target).parents('.time-tool-block').next().next();

        dom.hide();

        console.log()

        $(picker.target).next('.error').hide();
    });

    /*----------------------------------------验证-----------------------------------------*/

    //输入验证
    $('#commentForm').validate({

        rules:{
            //餐厅名称
            'DC-name':{

                required: true

            },
            //地址
            'DC-location':{

                required: true

            },
            //电话
            'DC-tel':{

                required: true,

                phoneNumFormat:true

            },
            //经理
            'DC-manager':{

                required: true

            },
            //送餐费
            'DC-mealFee':{

                required: true,

                number:true,

                min:0

            },

            //早送餐时间
            'breakfast-time':{

                required: true,

                isTimeFormat:true

            },

            //早送餐时间截止
            'breakfast-end-time':{

                required: true,

                isTimeFormat:true

            },

            //中送餐时间
            'lunch-time':{

                required: true,

                isTimeFormat:true

            },

            //中送餐时间截止
            'lunch-end-time':{

                required: true,

                isTimeFormat:true

            },

            //晚送餐时间
            'dinner-time':{

                required: true,

                isTimeFormat:true

            },

            //晚送餐时间截止
            'dinner-end-time':{

                required: true,

                isTimeFormat:true

            },

            //部门
            'DC-depart':{

                required: true

            }
        },
        messages:{

            //餐厅名称
            'DC-name':{

                required: '请输入餐厅名称'

            },
            //地址
            'DC-location':{

                required: '请输入餐厅地址'

            },
            //电话
            'DC-tel':{

                required: '请输入餐厅电话',

                phoneNumFormat:'请输入电话格式'

            },
            //经理
            'DC-manager':{

                required: '请输入经理姓名'

            },
            //送餐费
            'DC-mealFee':{

                required: '请输入送餐费',

                number:'请输入正确的金额'

            },

            //早送餐时间
            'breakfast-time':{

                required: '请输入早送餐时间'

            },

            //早送餐时间截止
            'breakfast-end-time':{

                required: '请输入早送餐截止时间'

            },

            //中送餐时间
            'lunch-time':{

                required: '请输中早送餐时间'

            },

            //中送餐时间截止
            'lunch-end-time':{

                required: '请输入中送餐截止时间'

            },

            //晚送餐时间
            'dinner-time':{

                required: '请输入晚送餐时间'

            },

            //晚送餐时间截止
            'dinner-end-time':{

                required: '请输入晚送餐截止时间'

            },

            //部门
            'DC-depart':{

                required: '部门为必选字段'

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{
                //餐厅名称
                'DC-name':{

                    required: true

                },
                //地址
                'DC-location':{

                    required: true

                },
                //电话
                'DC-tel':{

                    required: true,

                    phoneNumFormat:true

                },
                //经理
                'DC-manager':{

                    required: true

                },
                //送餐费
                'DC-mealFee':{

                    required: true,

                    number:true,

                    min:0

                },

                //早送餐时间
                'breakfast-time':{

                    required: true,

                    isTimeFormat:true

                },

                //早送餐时间截止
                'breakfast-end-time':{

                    required: true,

                    isTimeFormat:true

                },

                //中送餐时间
                'lunch-time':{

                    required: true,

                    isTimeFormat:true

                },

                //中送餐时间截止
                'lunch-end-time':{

                    required: true,

                    isTimeFormat:true

                },

                //晚送餐时间
                'dinner-time':{

                    required: true,

                    isTimeFormat:true

                },

                //晚送餐时间截止
                'dinner-end-time':{

                    required: true,

                    isTimeFormat:true

                },

                //部门
                'DC-depart':{

                    required: true

                }

            },
            messages:{

                //餐厅名称
                'DC-name':{

                    required: '请输入餐厅名称'

                },
                //地址
                'DC-location':{

                    required: '请输入餐厅地址'

                },
                //电话
                'DC-tel':{

                    required: '请输入餐厅电话',

                    phoneNumFormat:'请输入电话格式'

                },
                //经理
                'DC-manager':{

                    required: '请输入经理姓名'

                },
                //送餐费
                'DC-mealFee':{

                    required: '请输入送餐费',

                    number:'请输入正确的金额'

                },

                //早送餐时间
                'breakfast-time':{

                    required: '请输入早送餐时间'

                },

                //早送餐时间截止
                'breakfast-end-time':{

                    required: '请输入早送餐截止时间'

                },

                //中送餐时间
                'lunch-time':{

                    required: '请输中早送餐时间'

                },

                //中送餐时间截止
                'lunch-end-time':{

                    required: '请输入中送餐截止时间'

                },

                //晚送餐时间
                'dinner-time':{

                    required: '请输入晚送餐时间'

                },

                //晚送餐时间截止
                'dinner-end-time':{

                    required: '请输入晚送餐截止时间'

                },

                //部门
                'DC-depart':{

                    required: '部门为必选字段'

                }
            }

        });

    }

    /*------------------------------------------表格初始化---------------------------------*/

    var col = [

        {
            title:'餐厅名称',
            data:'diningroom'
        },
        {
            title:'地址',
            data:'address'
        },
        {
            title:'电话',
            data:'phone'
        },
        {
            title:'经理',
            data:'manager'
        },
        {
            title:'类型',
            data:'lx',
            render:function(data, type, full, meta){

                if(data == 0){

                    return '对外'

                }else if(data == 1){

                    return '对内'

                }else{

                    return ''

                }


            }
        },
        {
            title:'送餐费(元)',
            data:'sendfee'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                return '<span class="option-button option-edit option-in" data-attr="' + full.id + '" data-bm="' + full.dinningroomnum + '">' + '编辑</span>' +

                    '<span class="option-button option-del option-in" data-attr="' + full.id + '">' + '删除</span>'


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    //部门表格初始化
    var depCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return '<img src="../YHQ-resource/img/addMeal.png" class="add-dep" style="width: 15px;cursor: pointer">'

                //return  '<div class="checker" data-id="' + full.departNum + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'科室编码',
            data:'departNum'
        },
        {
            title:'科室名称',
            data:'departName'
        }

    ]

    _tableInitSearch($('#dep-table'),depCol,'2','','','','','',10,true,'','',true);

    conditionSelect();

    //科室多选
    $('#dep-table tbody').on('click','.add-dep',function(){

        //ui部分
        var obj = {};

        obj.departName = $(this).parents('tr').children().eq(2).html();

        obj.departNum = $(this).parents('tr').children().eq(1).html();

        //是否允许push进去

        var isPass = false;

        if(_selectDep.length == 0){

            isPass = true;

        }else{

            for(var i=0;i<_selectDep.length;i++){

                if(_selectDep[i].departNum == obj.departNum){

                    isPass = false;

                    break;

                }else{

                    isPass = true;

                }

            }

        }

        if(isPass){

            _selectDep.push(obj);

        }

        //根据数组，生成li

        $('#selectedDep').empty().append(selectedDepStr(_selectDep));

    })

    //科室静态删除
    $('#selectedDep').on('click','.close',function(){

        var num = $(this).parent('li').children('.depNum').html();

        for(var i=0;i<_selectDep.length;i++){

            if(_selectDep[i].departNum == num){

                _selectDep.remove(_selectDep[i]);

            }

        }

        $('#selectedDep').empty().append(selectedDepStr(_selectDep));

    });

    function selectedDepStr(arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<li>';

            str += '<span class="depName">' + arr[i].departName + '</span>';

            str += '<span class="depNum">' + arr[i].departNum + '</span>';

            str += '<span class="close"></span>'

            str += '</li>'

        }

        return str;

    }

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

    })

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){

            sendData('YHQDC/DiningRoomsAdd',$('#create-Modal').children(),false,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect()

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }else{

            _timeShow($('#create-Modal'));

        }

    })

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        $('#DC-nameCon').val('');

    })

    //时间验证通过
    $('#create-Modal').find('.time-tool-block').on('keyup','input',function(){

        _timeShow($('#create-Modal'));

    })

    $('#create-Modal').on('click',function(){

        _timeShow($('#create-Modal'));

    })

    //编辑
    $('#table tbody').on('click','.option-edit',function(){

        _thisBM = $(this).attr('data-bm');

        //初始化
        createModeInit();
        //模态框
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');
        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');
        //是否可操作
        abledOption();
        //绑定值
        _thisId = $(this).attr('data-attr');

        bindData(_thisId);

    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form()){

            sendData('YHQDC/DiningRoomsUpdate',$('#create-Modal').children(),true,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect()

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }else{

            _timeShow($('#create-Modal'));

        }

    })

    //删除
    $('#table tbody').on('click','.option-del',function(){

        //初始化
        createModeInit();
        //模态框
        _moTaiKuang($('#create-Modal'),'确定要删除吗？','','','','删除');
        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');
        //是否可操作
        disAbledOption();
        //绑定值
        _thisId = $(this).attr('data-attr');

        bindData(_thisId);

    })

    //删除确定按钮
    $('#create-Modal').on('click','.shanchu',function(){

        sendData('YHQDC/DiningRoomsDelete',$('#create-Modal').children(),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect()

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    })

    //选择部门
    $('#depart-select-button').click(function(){

        //数据
        _datasTable($('#dep-table'),_depArr);

        //模态框
        _moTaiKuang($('#dep-Modal'),'部门列表','','','','选择');

        //根据数组，确定已选中的部门
        $('#selectedDep').empty().append(selectedDepStr(_selectDep));

    })

    //确定选择的部门
    $('#dep-Modal').on('click','.btn-primary',function(){

        var str = '';

        for(var i=0;i<_selectDep.length;i++){

            if(i==_selectDep.length-1){

                str += _selectDep[i].departName

            }else{

                str += _selectDep[i].departName + '、'

            }

        }

        $('#DC-depart').val(str);

        $('#dep-Modal').modal('hide');

        $('#DC-depart').next('.error').hide();

    })

    /*-----------------------------------其他方法------------------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            diningroom:$('#DC-nameCon').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/ReturnDiningRoomsList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }

    //操作发送数据
    function sendData(url,el,flag,successFun){

        var arr = [];

        for(var i=0;i<_selectDep.length;i++){

            var obj = {};

            obj.departnum = _selectDep[i].departNum;

            arr.push(obj);

        }

        var prm = {

            //餐厅名称
            diningroom:$('#DC-name').val(),
            //地址
            address:$('#DC-location').val(),
            //电话
            phone:$('#DC-tel').val(),
            //经理
            manager:$('#DC-manager').val(),
            //类型
            lx:$('#DC-type').find('.checked').children().val(),
            //送餐费
            sendfee:$('#DC-mealFee').val(),
            //早送餐时间
            morningsendtime:$('#breakfast-time').val(),
            //早送餐时间截止
            morningordertime:$('#breakfast-end-time').val(),
            //中送餐时间
            noonsendtime:$('#lunch-time').val(),
            //中送餐时间截止
            noonordertime:$('#lunch-end-time').val(),
            //晚送餐时间
            eveningsendtime:$('#dinner-time').val(),
            //晚送餐时间截止
            eveningordertime:$('#dinner-end-time').val(),
            //备注
            comment:$('#DC-remark').val(),
            //部门
            diningRoomsDeparts:arr
        }

        if(flag){

            prm.id = _thisId;

            prm.dinningroomnum = _thisBM;

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun);

    }

    //初始化
    function createModeInit(){

        //时间验证占位dom隐藏
        $('.time-seat').hide();

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val('');

        $('#create-Modal').find('textarea').val('');

        //单选按钮
        $('#create-Modal').find('.radio').children().removeClass('checked');

        $('#create-Modal').find('.radio').children().eq(0).addClass('checked');

        //部门选择
        $('#DC-depart').removeAttr('data-num');

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

        //时间格式
        $('.time-seat').hide();

        _selectDep = [];

    }

    //可以操作
    function abledOption(){

        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        //$('#DC-depart').attr('disabled',true);
    }

    //不可以操作
    function disAbledOption(){

        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

    }

    //绑定数据
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            var data = _allData[i];

            if(data.id == id){

                //餐厅名称
                $('#DC-name').val(data.diningroom);
                //地址
                $('#DC-location').val(data.address);
                //电话
                $('#DC-tel').val(data.phone);
                //经理
                $('#DC-manager').val(data.manager);
                //类型
                $('#create-Modal').find('.radio').children().removeClass('checked');

                if(data.lx == 0){

                    //对外
                    $('#create-Modal').find('.radio').children().eq(0).addClass('checked');

                }else if(data.lx == 1){

                    //对内
                    $('#create-Modal').find('.radio').children().eq(1).addClass('checked');
                }

                //送餐费
                $('#DC-mealFee').val(data.sendfee);
                //早送餐时间
                $('#breakfast-time').val(data.morningsendtime);
                //早送餐时间截止
                $('#breakfast-end-time').val(data.morningordertime);
                //中送餐时间
                $('#lunch-time').val(data.noonsendtime);
                //中送餐时间截止
                $('#lunch-end-time').val(data.noonordertime);
                //晚送餐时间
                $('#dinner-time').val(data.eveningsendtime);
                //晚送餐时间截止
                $('#dinner-end-time').val(data.eveningordertime);
                //部门

                var str = '';

                if(data.diningRoomsDeparts.length>0){

                    for(var j=0;j<data.diningRoomsDeparts.length;j++){

                        var obj = {};

                        obj.departNum = data.diningRoomsDeparts[j].departnum;

                        obj.departName = data.diningRoomsDeparts[j].departName;

                        _selectDep.push(obj);

                        if(j==data.diningRoomsDeparts.length-1){

                            str += data.diningRoomsDeparts[j].departName

                        }else{

                            str += data.diningRoomsDeparts[j].departName + '、'

                        }

                    }

                }

                $('#DC-depart').val(str);

            }

        }

    }

    //选择部门
    function departData(){

        var prm = {

            //部门编码
            departNum:'',
            //部门名称
            departName:'',
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //当前用户的部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetDeparts',prm,false,function(result){

            if(result.length >0){

                _depArr = result;

            }


        })

    }
})