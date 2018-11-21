$(function(){

    _isClickTr = true;

    //部门树对象
    var depZtreeObjTable;

    //职位树对象
    var posZtreeObjTable;

    //所有员工信息
    var _allPersonArrTable = [];

    /*-----------------------------时间插件---------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    //验证时间初始化
    _timeYMDComponentsFunValite($('#commentForm').find('.abbrDT'));

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    var _isExist = '';

    //当前操作的合同id
    var _thisId = '';

    //当前操作的合同编码
    var _thisNum = '';

    //合同类型
    HTtype();

    //合同单位
    HTCustomer();

    //暂存所有员工列表
    var _allPerson = [];

    //获取签订人
    signedPerson();

    //获取项目名称
    projectData();

    //审批人
    var _alreadyPersonArr = [];

    //当前选择审批人的选择按钮
    var _thisSelect = '';

    //当前是否可以操作
    var _isOption = false;

    /*-----------------------------验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //合同名称
            'HT-name':{

                required: true,

                isExist:_isExist

            },
            //合同类型
            'HT-type':{

                required: true

            },
            //签订人
            'HT-person':{

                required: true

            },
            //合同单位
            'HT-unit':{

                required: true

            },
            //合同签订时间
            'signDT':{

                isEmpty:true,

                isDate:true

            },
            //合同开始时间
            'HTStartDT':{

                isEmpty: true,

                isDate:true

            },
            //合同结束时间
            'HTendDT':{

                isEmpty:true,

                isDate:true

            },
            //合同金额
            'HT-money':{

                required: true,

                number:true,

                min:0

            },
            //金额大写
            'HT-Uppercase':{

                required: true

            },
            //已付金额
            'HT-paid':{

                required: true,

                number:true,

                min:0

            },
            //待付金额
            'HT-unpaid':{

                required: true,

                number:true,

                min:0

            },
            //保证金
            'HT-bond':{

                required: true,

                number:true,

                min:0

            },
            //付款方式
            'HT-PayWay':{

                required: true

            },
            //结算方式
            'HT-AccountWay':{

                required: true

            },
            //所属项目
            'HT-project':{

                required: true

            }
        },
        messages:{

            //合同名称
            'HT-name':{

                required: '合同名称为必填字段',

                isExist:'合同名已存在'

            },
            //合同类型
            'HT-type':{

                required: '合同名称为必选字段'

            },
            //签订人
            'HT-person':{

                required: '合同签订人为必选字段'

            },
            //合同单位
            'HT-unit':{

                required: '合同单位为必选字段'

            },
            //合同签订时间
            'signDT':{

                isEmpty: '签订时间为必选字段',

                isDate:'格式为YYYY-MM-DD'

            },
            //合同开始时间
            'HTStartDT':{

                required: '开始时间为必选字段',

                isDate:'格式为YYYY-MM-DD'

            },
            //合同结束时间
            'HTendDT':{

                required: '结束时间为必选字段',

                isDate:'格式为YYYY-MM-DD'

            },
            //合同金额
            'HT-money':{

                required: '合同金额为必填字段',

                number:'合同金额为大于0的数字',

                min:'合同金额为大于0的数字'

            },
            //金额大写
            'HT-Uppercase':{

                required: '合同金额为必填字段'

            },
            //已付金额
            'HT-paid':{

                required: '已付金额为必填字段',

                number:'已付金额为大于0的数字',

                min:'已付金额为大于0的数字'

            },
            //待付金额
            'HT-unpaid':{

                required: '待付金额为必填字段',

                number:'待付金额为大于0的数字',

                min:'待付金额为大于0的数字'

            },
            //保证金
            'HT-bond':{

                required: '保证金为必填字段',

                number:'保证金为大于0的数字',

                min:'保证金为大于0的数字'

            },
            //付款方式
            'HT-PayWay':{

                required: '付款方式为必填字段'

            },
            //结算方式
            'HT-AccountWay':{

                required: '结算方式为必填字段'

            },
            //所属项目
            'HT-project':{

                required: '所属项目为必填字段'

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //合同名称
                'HT-name':{

                    required: true,

                    isExist:_isExist

                },
                //合同类型
                'HT-type':{

                    required: true

                },
                //签订人
                'HT-person':{

                    required: true

                },
                //合同单位
                'HT-unit':{

                    required: true

                },
                //合同签订时间
                'signDT':{

                    isEmpty:true,

                    isDate:true

                },
                //合同开始时间
                'HTStartDT':{

                    isEmpty: true,

                    isDate:true

                },
                //合同结束时间
                'HTendDT':{

                    isEmpty:true,

                    isDate:true

                },
                //合同金额
                'HT-money':{

                    required: true,

                    number:true,

                    min:0

                },
                //金额大写
                'HT-Uppercase':{

                    required: true

                },
                //已付金额
                'HT-paid':{

                    required: true,

                    number:true,

                    min:0

                },
                //待付金额
                'HT-unpaid':{

                    required: true,

                    number:true,

                    min:0

                },
                //保证金
                'HT-bond':{

                    required: true,

                    number:true,

                    min:0

                },
                //付款方式
                'HT-PayWay':{

                    required: true

                },
                //结算方式
                'HT-AccountWay':{

                    required: true

                },
                //所属项目
                'HT-project':{

                    required: true

                }
            },
            messages:{

                //合同名称
                'HT-name':{

                    required: '合同名称为必填字段',

                    isExist:'合同名已存在'

                },
                //合同类型
                'HT-type':{

                    required: '合同名称为必选字段'

                },
                //签订人
                'HT-person':{

                    required: '合同签订人为必选字段'

                },
                //合同单位
                'HT-unit':{

                    required: '合同单位为必选字段'

                },
                //合同签订时间
                'signDT':{

                    isEmpty: '签订时间为必选字段',

                    isDate:'格式为YYYY-MM-DD'

                },
                //合同开始时间
                'HTStartDT':{

                    required: '开始时间为必选字段',

                    isDate:'格式为YYYY-MM-DD'

                },
                //合同结束时间
                'HTendDT':{

                    required: '结束时间为必选字段',

                    isDate:'格式为YYYY-MM-DD'

                },
                //合同金额
                'HT-money':{

                    required: '合同金额为必填字段',

                    number:'合同金额为大于0的数字',

                    min:'合同金额为大于0的数字'

                },
                //金额大写
                'HT-Uppercase':{

                    required: '合同金额为必填字段'

                },
                //已付金额
                'HT-paid':{

                    required: '已付金额为必填字段',

                    number:'已付金额为大于0的数字',

                    min:'已付金额为大于0的数字'

                },
                //待付金额
                'HT-unpaid':{

                    required: '待付金额为必填字段',

                    number:'待付金额为大于0的数字',

                    min:'待付金额为大于0的数字'

                },
                //保证金
                'HT-bond':{

                    required: '保证金为必填字段',

                    number:'保证金为大于0的数字',

                    min:'保证金为大于0的数字'

                },
                //付款方式
                'HT-PayWay':{

                    required: '付款方式为必填字段'

                },
                //结算方式
                'HT-AccountWay':{

                    required: '结算方式为必填字段'

                },
                //所属项目
                'HT-project':{

                    required: '所属项目为必填字段'

                }
            }

        });

    }

    //验证合同名称是否存在
    $.validator.addMethod("isExist",function(value,element,params){

        var flag = true;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].htname == value && _allData[i].htname!= _isExist){

                flag = false;

                break;

            }

        }

        return flag;

    },"合同名称已存在");

    /*-----------------------------表格初始化--------------------------------*/

    //主表格
    var col = [

        {
            title:'合同编号',
            data:'htnum',
            render:function(data, type, full, meta){

                return '<a href="HTDetails.html?num=' + data + '" target="_blank">' + data + '</a>'

            }
        },
        {
            title:'合同名称',
            data:'htname'
        },
        {
            title:'合同类型',
            data:'catename'
        },
        {
            title:'合同单位',
            data:'clientname'
        },
        {
            title:'所属项目',
            data:'projectName'
        },
        {
            title:'签订人',
            data:'signusername'
        },
        {
            title:'合同状态',
            data:'htstatus',
            render:function(data, type, full, meta){

                return HTStatusFun(data)


            }
        },
        {
            title:'合同签定时间',
            data:'httime',
            render:function(data, type, full, meta){

                return data.split('T')[0]

            }

        },
        {
            title:'审核状态',
            data:'audit',
            render:function(data, type, full, meta){

                return approvalStatusFun(data)


            }
        },
        {
            title:'合同单位',
            data:'clientname'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '';

                //审核状态只要不是0的都不能修改
                if(full.audit == 0 && full.htstatus != 999){

                    str += '<span class="option-button option-edit option-in" data-attr="' + full.id + '" data-num="' + full.htnum + '">' + '编辑</span>'

                }else{

                    str += ''

                }

                //可取消

                if(full.audit !=2 && full.htstatus != 0){

                    str += '<span class="option-button option-del option-in" data-attr="' + full.id + '" attr-audit="' + full.audit + '" data-num="' + full.htnum + '">' + '取消</span>'

                }

                //可回退
                if(full.htstatus == '20'){

                    str += '<span class="option-button option-back option-in" data-attr="' + full.id + '" attr-audit="' + full.audit + '" data-num="' + full.htnum + '">' + '回退</span>'

                }

                return str


            }

        }

    ]

    //导出列
    var _exportCol = [0,1,2,3,4,5,6,7,8,9];

    _tableInit($('#table'),col,1,true,'','','',_exportCol);

    //工程量表格
    var engineeringCol = [

        {
            title:'序号',
            data:'',
            className:'serialBlock'
        },
        {
            title:'清单子目',
            data:'itemName',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control must" placeholder="必填" value="' + value + '">'

            }

        },
        {
            title:'工程量',
            data:'itemAmount',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control num-format must" placeholder="必填，数字" value="' + value + '">'

            }
        },
        {
            title:'单位',
            data:'unit',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control must" placeholder="必填" value="' + value + '">'

            }
        },
        {
            title:'综合单价',
            data:'itemPrice',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control num-format must" placeholder="必填，数字" value="' + value + '">'

            }
        },
        {
            title:'合价',
            data:'amount',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control num-format must" placeholder="必填，数字" value="' + value + '">'

            }
        },
        {
            title:'备注',
            data:'memo',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control" placeholder="选填" value="' + value + '">'

            }
        },
        {
            title:'操作',
            data:'',
            render:function(data, type, full, meta){

                return '<div class="option-button option-del option-in" style="width: 50px;">删除</div>'

            }
        }

    ]

    var engineeringColNo = [

        {
            title:'序号',
            data:'',
            className:'serialBlock'
        },
        {
            title:'清单子目',
            data:'itemName',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control must" placeholder="必填" value="' + value + '">'

            }

        },
        {
            title:'工程量',
            data:'itemAmount',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control num-format must" placeholder="必填，数字" value="' + value + '">'

            }
        },
        {
            title:'单位',
            data:'unit',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control must" placeholder="必填，数字" value="' + value + '">'

            }
        },
        {
            title:'综合单价',
            data:'itemPrice',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control num-format must" placeholder="必填，数字" value="' + value + '">'

            }
        },
        {
            title:'合价',
            data:'amount',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control num-format must" placeholder="必填，数字" value="' + value + '">'

            }
        },
        {
            title:'备注',
            data:'memo',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control" placeholder="选填" value="' + value + '">'

            }
        }

    ]

    //_tableInit($('#engineering-table'),engineeringCol,'2','','',serialNumber,'','','',true);

    //审核人表格(未审批状态)
    var auditorCol = [
        {
            title:'审批等级',
            data:'',
            className:'serialBlock'
        },
        {
            title:'选择',
            data:'',
            render:function(data, type, full, meta){

                return '<div class="option-button option-see selectUser option-in" style="width: 50px;">选择</div>'

            }
        },
        {
            title:'工号',
            data:'userNum',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control must" placeholder="必选" value="' + value + '" readonly>'

            }
        },
        {
            title:'姓名',
            data:'username',
            render:function(data, type, full, meta){

                var value = data == undefined?'':data;

                return '<input type="text" class="form-control must" placeholder="必选" value="' + value + '" readonly>'

            }
        },
        {
            title:'操作',
            data:'',
            render:function(data, type, full, meta){

                return '<div class="option-button option-del option-in" style="width: 50px;">删除</div>'

            }
        }

    ]

    //审核人表格(审批中状态)
    var auditorColIng = [

        {
            title:'审批等级',
            data:'rank'

        },
        {
            title:'工号',
            data:'userNum'
        },
        {
            title:'姓名',
            data:'username'
        },
        {
            title:'审批状态',
            data:'isAudit',
            render:function(data, type, full, meta){

                if(data == 10){

                    return '通过'

                }else if(data == 20){

                    return '不通过'

                }

            }
        },
        {
            title:'审批意见',
            data:'auditinfo'
        },
        {
            title:'审批时间',
            data:'auditTime',
            render:function(data, type, full, meta){

                if(data == null){

                    return ''

                }else{

                    return data.split('T')[0] + ' ' + data.split('T')[1]

                }

            }
        }

    ]

    //_tableInit($('#auditor-table'),auditorCol,'2','','','','','','',true);

    //序列号自增
    function serialNumber(){

        this.api().column(0).nodes().each(function(cell, i) {

            cell.innerHTML =  i + 1;

        });
    }

    //合同签订人表格
    var unitCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'客户名称',
            data:'clientname'
        },
        {
            title:'地址',
            data:'address'
        }

    ]

    _tableInitSearch($('#unit-table'),unitCol,'2','','','','','',10,'','','',true);

    //签订人表格
    var signCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'姓名',
            data:'userName'
        },
        {
            title:'所属部门',
            data:'departName'
        },
        {
            title:'职位',
            data:'roleName'
        },
        {
            title:'联系方式',
            data:'phone'
        }

    ]

    _tableInitSearch($('#sign-table'),signCol,'2','','','','','',10,'','','',true);

    //审核人列表
    _tableInitSearch($('#auditor-table-select'),signCol,'2','','','','','',10,'','','',true);

    //项目表格
    var projectCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'项目名称',
            data:'projectName'
        },
        {
            title:'负责人',
            data:'linkPerson'
        },
        {
            title:'联系电话',
            data:'phone'
        },
        {
            title:'项目信息',
            data:'projectInfo'
        }

    ]

    _tableInitSearch($('#project-table'),projectCol,'2','','','','','',10,'','','',true);

    //审核员工表格
    var personCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'姓名',
            data:'userName'
        },
        {
            title:'部门',
            data:'departName',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.departNum + '">' + data + '</span>'

            }

        },
        {
            title:'职位',
            data:'roleName'
        },
        {
            title:'电话',
            data:'mobile'
        }

    ]

    _tableInitSearch($('#person-table-filter-table'),personCol,'2','','','','','',10,'','','',true);

    //默认加载
    conditionSelect();

    /*-----------------------------按钮事件----------------------------------*/

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //新增
    $('#createBtn').click(function(){

        _isOption = true;

        //可操作
        abledOption();

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('huitui').removeClass('shanchu').addClass('dengji');

    })

    $('#create-Modal').on('shown.bs.modal',function(){

        var width = $('#picker').width();

        var height = $('#picker').height()

        $('#picker').find('input').parent().width(width);

        $('#picker').find('input').parent().height(height);

    })

    $('#create-Modal').on('hide.bs.modal',function(e){

        if($(e.target).attr('class').indexOf('modal')>-1){

            _isOption = false;

            var table = $('#auditor-table').DataTable();

            //将表格销毁
            table.destroy(false);

            //dom初始化
            $('#auditor-table thead').empty();

            $('#auditor-table tbody').empty();

            var table1 = $('#engineering-table').DataTable();

            //将表格销毁
            table1.destroy(false);

            //dom初始化
            $('#engineering-table thead').empty();

            $('#engineering-table tbody').empty();

        }

    })

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form() && tableFormat()){

            //表格中的格式验证
            sendData('YHQHT/HTAdd',$('#create-Modal').children(),false,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


            })

        }

    })

    //重置
    $('#resetBtn').click(function(){

        $('.L-condition').eq(0).find('input').val('');

        $('.L-condition').eq(0).find('select').val(-1);

        $('#spDT').val(st);

        $('#epDT').val(nowTime);

    })

    //编辑
    $('#table tbody').on('click','.option-edit',function(){

        _isOption = true;

        _thisId = $(this).attr('data-attr');

        _thisNum = $(this).attr('data-num');

        //可操作
        abledOption();

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');

        //赋值
        bindData(_thisNum);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').removeClass('huitui').addClass('bianji');

    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form() && tableFormat()){

            sendData('YHQHT/HTInfoUpdate',$('#create-Modal').children(),true,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


            })

        }

    })

    //取消
    $('#table tbody').on('click','.option-del',function(){

        //判断状态，显示表格

        _thisId = $(this).attr('data-attr');

        _thisNum = $(this).attr('data-num');

        //可操作
        disAbledOption();

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'确定要取消吗','','','','取消');

        //赋值
        bindData(_thisNum);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').removeClass('huitui').addClass('shanchu');

    })

    //删除确定按钮
    $('#create-Modal').on('click','.shanchu',true,function(){

        sendData('YHQHT/HTCancel',$('#create-Modal').children(),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


        })

    })

    //工程量增加一行
    $('#add-engineering').click(function(){

        if(_isOption == false){

            return false;

        }

        //增加一行空的tr
        var t = $('#engineering-table').DataTable();

        t.row.add([]).draw();

    })

    //工程量删除一行
    $('#engineering-table tbody').on('click','.option-del',function(){

        if(_isOption == false){

            return false;

        }

        var t = $('#engineering-table').DataTable();

        t.row($(this).parents('tr')).remove().draw();

    })

    //选择合同单位
    $('#select-unit-modal').on('click',function(){

        _moTaiKuang($('#unit-Modal'),'签订人列表','','','','选择');

    })

    //选择合同单位确定按钮
    $('#unit-Modal').on('click','.btn-primary',function(){

        //验证是否选择
        var currentTr = $('#unit-table tbody').children('.tables-hover');

        if(currentTr.length== 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择合同单位','');

            return false;

        }

        if(currentTr.children('.dataTables_empty').length>0){

            return false;

        }

        var num = currentTr.find('.checker').attr('data-id');

        var name = currentTr.children().eq(1).html();

        $('#HT-unit').val(name);

        $('#HT-unit').attr('data-attr',num);

        $('#unit-Modal').modal('hide');

        $('#HT-unit').next('.error').hide();

    })

    //确定签订人
    $('#person-new-Modal').on('click','.btn-primary',function(){

        //验证是否选择
        var currentTr = _isSelectTr($('#person-table-filter'));

        if(currentTr){

            var num = currentTr.find('.checker').attr('data-id');

            var name = currentTr.children().eq(1).html();

            $('#HT-person').val(name);

            $('#HT-person').attr('data-attr',num);

            $('#person-new-Modal').modal('hide');

            $('#HT-person').next('.error').hide();

        }

    })

    //验证表格中的必填项
    $('#engineering-table tbody').on('keyup','.must',function(){

        var values = $.trim($(this).val());

        if(values == ''){

            $(this).addClass('errorFormat');

        }else{

            $(this).removeClass('errorFormat');

        }


    })

    //验证表格中的数字验证
    $('#engineering-table tbody').on('keyup','.num-format',function(){

        var values = $.trim($(this).val());

        //大于0的数字

        if(_regularTest(_isNum,values)){

            $(this).removeClass('errorFormat');

        }else{

            $(this).addClass('errorFormat');

        }

    })

    //审批人增加一行
    $('#add-auditor').click(function(){

        if(_isOption == false){

            return false;

        }

        //增加一行空的tr
        var t = $('#auditor-table').DataTable();

        t.row.add([]).draw();

    })

    //审批人删除一行
    $('#auditor-table tbody').on('click','.option-del',function(){

        if(_isOption == false){

            return false;

        }

        var t = $('#auditor-table').DataTable();

        t.row($(this).parents('tr')).remove().draw();

    })

    //审核人选择
    $('#auditor-table tbody').on('click','.option-see',function(){

        if(_isOption == false){

            return false;

        }

        _alreadyPersonArr.length = 0;

        var tr = $('#auditor-table tbody').children();

        for(var i=0;i<tr.length;i++){

            var num = tr.eq(i).children().eq(2).children().val();

            if(num != ''){

                _alreadyPersonArr.push(num);

            }

        }

        //模态框
        _moTaiKuang($('#person-new-table-Modal'),'审核人列表','','','','确定');

        //获取人员
        driverPersonTable();

        //获取部门
        getDepartDataTable(_alreadyPersonArr)

        //获取职位
        getPositionDataTable(_alreadyPersonArr);

        _thisSelect = $(this);

    })

    //审核人确定按钮
    $('#person-new-table-Modal').on('click','.btn-primary',function(){

        var currentTr = _isSelectTr($('#person-table-filter-table'));

        if(currentTr){

            var name = currentTr.find('.checker').attr('data-id');

            var num = currentTr.children().eq(1).html();

            _thisSelect.parent().next().children().val(name);

            _thisSelect.parent().next().children().removeClass('errorFormat');

            _thisSelect.parent().next().next().children().val(num);

            _thisSelect.parent().next().next().children().removeClass('errorFormat');

            $('#person-new-table-Modal').modal('hide');

        }



    })

    //审核登记验证
    $('#auditor-table tbody').on('keyup','.num-format',function(){

        var values = $.trim($(this).val());

        //大于0的数字

        if(_regularTest(_isPositiveInt,values)){

            $(this).removeClass('errorFormat');

        }else{

            $(this).addClass('errorFormat');

        }

    })

    //回退
    $('#table tbody').on('click','.option-back',function(){

        //判断状态，显示表格

        _thisId = $(this).attr('data-attr');

        _thisNum = $(this).attr('data-num');

        //可操作
        disAbledOption();

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'确定要回退吗','','','','回退');

        //赋值
        bindData(_thisNum);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').removeClass('shanchu').addClass('huitui');

    })

    //回退确定按钮
    $('#create-Modal').on('click','.huitui',true,function(){

        sendData('YHQHT/HTExec',$('#create-Modal').children(),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


        })

    })

    //选择所属项目
    $('#select-project').click(function(){

        _moTaiKuang($('#project-Modal'),'项目列表','','','','选择');

    })

    //所属项目确定
    $('#project-Modal').on('click','.btn-primary',function(){

        var currentTr = $('#project-table tbody').children('.tables-hover');

        if(currentTr.length== 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择所属项目','');

            return false;

        }

        if(currentTr.children('.dataTables_empty').length>0){

            return false;

        }

        var num = currentTr.find('.checker').attr('data-id');

        var name = currentTr.children().eq(1).html();

        $('#HT-project').val(name);

        $('#HT-project').attr('data-attr',num);

        $('#project-Modal').modal('hide');

        $('#HT-project').next('.error').hide();

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {
            //项目名称
            projectName:$('#HT-projectCon').val(),
            //合同名称
            htname:$('#HT-nameCon').val(),
            //合同类型
            catename:$('#HT-typeCon').val(),
            //合同单位
            clientName:$('#HT-customerCon').val(),
            //签订人
            signUserName:$('#HT-signCon').val(),
            //审核状态
            audit:$('#HT-approveCon').val(),
            //合同编码
            //htNum:$('#DC-numCon').val(),
            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //状态
            htStatus:-1
        }

        _mainAjaxFunCompleteNew('post','YHQHT/GetHTInfoList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }

    //初始化
    function createModeInit(){

        //时间验证占位dom隐藏
        $('.time-seat').hide();

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

        //工程量表格初始化
        _datasTable($('#engineering-table'),[]);

        //审核人
        _datasTable($('#auditor-table'),[]);

        //合计清空
        $('#engineering-table tfoot').find('input').val('');

        //签订人
        $('#HT-person').removeAttr('data-attr');

        //合同单位
        $('#HT-unit').removeAttr('data-attr');

        //项目
        $('#HT-project').removeAttr('data-attr');

        //删除按钮隐藏
        $('#deleted').hide();

        $('#thelist').html('');

        _alreadyPersonArr.length = 0;

    }

    //发送数据
    function sendData(url,el,flag,successFun){

        //工程清单
        var arr = [];

        var trs = $('#engineering-table tbody').children();

        for(var i=0;i<trs.length;i++){

            var value = trs.eq(i).children();

            var obj = {};

            //子项名称
            obj.itemName = value.eq(1).children().val();
            //单位
            obj.unit = value.eq(3).children().val();
            //工程量
            obj.itemAmount = value.eq(2).children().val();
            //单价
            obj.itemPrice = value.eq(4).children().val();
            //总金额
            obj.amount = value.eq(5).children().val();
            //备注
            obj.memo = value.eq(6).children().val();

            arr.push(obj);

        }

        //审批人清单
        var personArr = [];

        var personTr = $('#auditor-table tbody').children();

        for(var i=0;i<personTr.length;i++){

            var value = personTr.eq(i).children();

            //首先判断工号和姓名都有没有
            if( value.eq(2).html() != '' && value.eq(3).html() != ''){

                var obj = {};

                //工号
                obj.userNum = value.eq(2).children().val();

                //名称
                obj.username = value.eq(3).children().val();

                //审批等级
                obj.rank = value.eq(0).html();

                personArr.push(obj);


            }

        }

        var prm = {

            //合同名称
            htname:$('#HT-name').val(),
            //合同签定时间
            httime:$("#signDT").val(),
            //签定人id
            signuserid:$('#HT-person').attr('data-attr'),
            //签定人姓名
            signusername:$('#HT-person').val(),
            //合同类型id
            cateid:$('#HT-type').val(),
            //合同类型
            catename:$('#HT-type').children('option:selected').html(),
            //合同单位id
            clientid:$('#HT-unit').attr('data-attr'),
            //合同单位
            clientname:$('#HT-unit').val(),
            //开始时间
            starttime:$('#HTStartDT').val(),
            //结束时间
            endtime:$('#HTendDT').val(),
            //合同金额
            amountmoney:$('#HT-money').val(),
            //已付金额
            payedmoney:$('#HT-paid').val(),
            //待付款
            unpayedmoney:$('#HT-unpaid').val(),
            //保证金
            earnestmoney:$('#HT-bond').val(),
            //合同附件
            htfiles:_imgpath,
            //备注
            memo:$('#HT-remark').val(),
            //主要条款
            mainterm:$('#HT-main-clause').val(),
            //付款方式
            paymethod:$('#HT-PayWay').val(),
            //结算方式
            settlemethod:$('#HT-AccountWay').val(),
            //合同工程量清单集合
            subItems:arr,
            //审核人清单
            htAuditInfos:personArr,
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM,
            //所属项目
            projectID:$('#HT-project').attr('data-attr'),
            //所属项目
            projectName:$('#HT-project').val()

        }

        if(flag){

            prm.id = _thisId;

            prm.htnum = _thisNum;

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun)

    }

    //绑定赋值
    function bindData(num){

        var prm = {

            //编号
            htNum:num,
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQHT/GetHTInfoDetails',prm,$('.L-container'),function(result){

            //赋值
            if(result.code == 99){

                var data = result.data;

                _isExist = data.htname;

                //合同名称
                $('#HT-name').val(data.htname);
                //合同编码
                $('#HT-num').val(data.htnum);
                //合同类型
                $('#HT-type').val(data.cateid);
                //签订人
                $('#HT-person').val(data.signusername);
                //签订人id
                $('#HT-person').attr('data-attr',data.signuserid);
                //合同单位
                $('#HT-unit').val(data.clientname);
                //合同单位
                $('#HT-unit').attr('data-attr',data.clientid);
                //合同签订时间
                $('#signDT').val(data.httime.split('T')[0]);
                //开始时间
                $('#HTStartDT').val(data.starttime.split('T')[0]);
                //结束时间
                $('#HTendDT').val(data.endtime.split('T')[0]);
                //合同金额
                $('#HT-money').val(data.amountmoney);
                //已付金额
                $('#HT-paid').val(data.payedmoney);
                //待付金额
                $('#HT-unpaid').val(data.unpayedmoney);
                //保证金
                $('#HT-bond').val(data.earnestmoney);
                //付款方式
                $('#HT-PayWay').val(data.paymethod);
                //结算方式
                $('#HT-AccountWay').val(data.settlemethod);
                //主要条款
                $('#HT-main-clause').val(data.mainterm);
                //备注
                $('#HT-remark').val(data.memo);
                //工程量清单
                _datasTable($('#engineering-table'),data.subItems);
                //审核人清单
                _datasTable($('#auditor-table'),data.htAuditInfos);
                //文件上传的删除按钮是否显示
                if(data.htfiles != ''){

                    _imgpath = data.htfiles;

                    //合同附件
                    $('#thelist').html(_urls + data.htfiles);

                    //删除按钮显示
                    $('#deleted').show();

                }
                //项目id
                $('#HT-project').attr('data-attr',data.projectID);
                //项目名称
                $('#HT-project').val(data.projectName);


            }

        })

    }

    //可以操作
    function abledOption(){

        _tableInit($('#auditor-table'),auditorCol,'2','','',serialNumber,'','','',true);

        _tableInit($('#engineering-table'),engineeringCol,'2','','',serialNumber,'','','',true);

        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        //图片上传按钮
        $('.btns').show();

        $('#select-unit-modal').addClass('modal-select-show');

        $('#select-sign-modal').addClass('modal-select-show');

        $('#create-Modal').find('p').children('span').show();

    }

    //不可以操作
    function disAbledOption(){

        //判断状态，显示表格
        _tableInit($('#auditor-table'),auditorColIng,'2','','',serialNumber,'','','',true);

        _tableInit($('#engineering-table'),engineeringColNo,'2','','',serialNumber,'','','',true);

        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

        //图片上传按钮
        $('.btns').hide();

        $('#select-unit-modal').removeClass('modal-select-show');

        $('#select-sign-modal').removeClass('modal-select-show');

        $('#create-Modal').find('p').children('span').hide();

    }

    //获取合同类型
    function HTtype(){

        var prm = {

            //合同类型名称
            catename:'',
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQHT/GetHTCates',prm,false,function(result){

            var str = '<option value="">请选择</option>';

            if(result.code == 99){

                for(var i=0;i<result.data.length;i++){

                    str += '<option value="' + result.data[i].id + '">' + result.data[i].catename + '</option>'

                }
            }

            $('#HT-type').empty().append(str);

        })


    }

    //获取合同客户
    function HTCustomer(){

        var prm = {

            //合同名称
            clientname:''

        };

        _mainAjaxFunCompleteNew('post','YHQHT/GetAllHTClient',prm,false,function(result){

            var arr = [];

            if(result.code == 99){

                arr = result.data;

            }

            //数据
            _datasTable($('#unit-table'),arr);

        })

    }

    //获取签订人
    function signedPerson(){

        var prm = {

            'userID':_userIdNum,

            'userName':_userIdName

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetUsers',prm,false,function(result){

            var arr = result;

            _allPerson = result;

            _datasTable($('#sign-table'),arr);



        })

    }

    //表格内容验证
    function tableFormat(){

        //非空
        var isEmpty = $('#engineering-table tbody').find('.must');

        //数字
        var isNum = $('#engineering-table tbody').find('.num-format');

        //非空
        var isPositiveInt = $('#auditor-table tbody').find('.must');

        //非空
        for(var i=0;i<isEmpty.length;i++){

            var dom = isEmpty.eq(i);

            var values = dom.val();

            if( values == ''){

                dom.addClass('errorFormat');

            }else{

                dom.removeClass('errorFormat');

            }

        }

        //数字
        for(var i=0;i<isNum.length;i++){

            var dom = isNum.eq(i);

            var values = isNum.eq(i).val();

            if( _regularTest(_isNum,values)){

                dom.removeClass('errorFormat');

            }else{

                dom.addClass('errorFormat');

            }

        }

        //非空且整数
        for(var i=0;i<isPositiveInt.length;i++){

            var dom = isPositiveInt.eq(i);

            var values = isPositiveInt.eq(i).val();

            if( values != '' ){

                dom.removeClass('errorFormat');

            }else{

                dom.addClass('errorFormat');

            }

        }

        var errorLength = $('#create-Modal').find('.errorFormat').length;

        if(errorLength != 0){

            return false;

        }else{

            return true;

        }

    }

    //合同状态
    function HTStatusFun(data){

        var str = ''

        if(data == '0'){

            str = '登记'

        }else if(data == '10'){

            str = '执行'

        }else if(data == '20'){

            str = '完成'

        }else if(data == '999'){

            str = '取消'

        }

        return str;

    }

    //审核状态
    function approvalStatusFun(data){

        var str = ''

        if(data == '0'){

            str = '未审批'

        }else if(data == '1'){

            str = '审批中'

        }else if(data == '2'){

            str = '审批通过'

        }else if(data == '3'){

            str = '审批未通过'

        }else if(data == '9'){

            str = '没有审批'

        }

        return str;

    }

    //获取项目名称
    function projectData(){

        var prm = {

            projectName:''

        }

            _mainAjaxFunCompleteNew('post','YHQHT/ReturnHTProjectList',prm,false,function(result){

            _datasTable($('#project-table'),result.data);



        })

    }

    //获取部门
    function getDepartDataTable(arr){

        var prm ={

            "userID": _userIdNum

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetDeparts',prm,$('#departTreeTable'),function(result){

            //处理部门数组
            var depArr = [];

            if(result && result.length>0){

                for(var i=0;i<result.length;i++){

                    var data = result[i];

                    var obj = {};

                    obj.pId = data.parentNum;

                    obj.id = data.departNum;

                    obj.name = data.departName;

                    depArr.push(obj);

                }

                //绘制ztree部门树
                setSetting1($('#departTreeTable'),depArr,depZtreeObjTable,1,arr);

                //关键字搜索
                searchPointerKey($('#keyDepTable'),'departTreeTable',$('#depSearchTable'));

            }else{

                filterPerson('',_allPersonArr,1,arr);

            }

        })

    }

    //获取职位
    function getPositionDataTable(arr){

        var prm ={

            "userID": _userIdNum

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetRoles',prm,$('#positionTreeTable'),function(result){

            //处理部门数组
            var posArr = [];

            if(result && result.length>0){

                for(var i=0;i<result.length;i++){

                    var data = result[i];

                    var obj = {};

                    obj.id = data.roleNum;

                    obj.name = data.roleName;

                    posArr.push(obj);

                }


                //绘制ztree部门树
                setSetting1($('#positionTreeTable'),posArr,posZtreeObjTable,2,arr);

                //关键字搜索
                searchPointerKey($('#keyPosTable'),'positionTreeTable',$('#posSearchTable'));

            }else{

                filterPerson('',_allPersonArrTable,2,arr);

            }

        })

    }

    function driverPersonTable(){

        var prm = {

            'userID':_userIdNum,

            'userName':_userIdName

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetUsers',prm,$('#person-table-filter-table'),function(result){

            _datasTable($('#person-table-filter-table'),result);

            //根据部门筛选员工
            _allPersonArrTable = result;


        })

    }

    //定制ztree设置(num:1,对部门筛选，2对角色筛选,filterArr:true的时候，过滤当前数组，false的时候，不过滤)
    function setSetting1(treeId,treeData,treeObj,num,filterArr){

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
                showIcon:false
            },
            callback: {

                onClick: function(e,treeId,treeNode){

                    var treeObj = $.fn.zTree.getZTreeObj(treeId);

                    //取消全部打钩的节点
                    treeObj.checkNode(treeNode,!treeNode.checked,true);

                    //获取当前选择的id
                    var nodes = treeObj.getCheckedNodes(true);

                    if(nodes.length>0){

                        $('#person-table-filter-table').showLoading();

                        filterPerson1(nodes[0].id,_allPersonArrTable,num,filterArr);


                        $('#person-table-filter-table').hideLoading();

                    }else{

                        _datasTable($('#person-table-filter-table'),[],filterArr);

                    }

                },
                beforeClick:function(){

                    treeId.find('.curSelectedNode').removeClass('curSelectedNode');

                },
                onCheck:function(e,treeId,treeNode){

                    var treeObj = $.fn.zTree.getZTreeObj(treeId);

                    $(treeId).find('.curSelectedNode').removeClass('curSelectedNode');

                    $(treeId).find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                    //取消全部打钩的节点
                    treeObj.checkNode(treeNode,true,true);

                    //获取当前选择的id
                    var nodes = treeObj.getCheckedNodes(true)[0].id;

                    if(nodes.length>0){

                        $('#person-table-filter-table').showLoading();

                        filterPerson1(nodes[0].id,_allPersonArr,num);

                        $('#person-table-filter-table').hideLoading();

                    }else{

                        _datasTable($('#person-table-filter-table'),[]);

                    }

                }

            }
        };

        treeObj = $.fn.zTree.init(treeId, setting, treeData);

    }


    //根据选中的部门，对人员进行筛选
    function filterPerson1(value,arr,num,existArr){

        var filterArr = [];

        if(num == 1){

            for(var i=0;i<arr.length;i++){

                if(arr[i].departNum == value){

                    filterArr.push(arr[i]);
                }

            }

        }else if(num == 2){

            for(var i=0;i<arr.length;i++){

                if(arr[i].roleNum == value){

                    filterArr.push(arr[i]);
                }

            }

        }

        for(var i=0;i<existArr.length;i++){

            filterArr.removeByValue(existArr[i],'userNum');

        }

        if(value){

            _datasTable($('#person-table-filter-table'),filterArr);

        }else{

            _datasTable($('#person-table-filter-table'),arr);

        }

    }

})

//当前上传的文件路径
var _imgpath = '';

//上传文件路径
var _webPatch = 'YHQHT/ImageFileUploadProgress';

//删除文件路径名
var _webDelPatch = 'YHQHT/DelUploadImageFile'