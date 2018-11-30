$(function(){

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    //当前操作的数据id
    var _thisId = '';

    /*----------------------------日历插件----------------------------------*/

    //默认半个月

    var now = moment().format('YYYY-MM-DD');

    var st = moment(now).subtract(14,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(now);

    _timeYMDComponentsFun11($('.abbrDT'));

    /*-----------------------------表格初始化--------------------------------*/

    var col=[

        {
            title:'运送任务编码',
            data:'tmCode',
            render:function(data, type, full, meta){

                return '<a href="TMDetails.html?num=' + full.tmCode + '&data=' + full.id + '" target="_blank">' + data + '</a>'

            }
        },
        {
            title:'发起人',
            data:'bxRenName'
        },
        {
            title:'发起班组',
            data:'bxkeshi'
        },
        {
            title:'开始地点',
            data:'tMsrcdidian'
        },
        {
            title:'结束地点',
            data:'tMdestDidian'
        },
        {
            title:'项目',
            data:'tmXms'
        },
        {
            title:'任务时间',
            data:'tmShij',
            render:function(data, type, full, meta){

                var str = '';

                if(data != '' && data != null){

                    str = data.replace(/T/g,' ')

                }

                return str

            }
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '';

                if(full.pjRenNum != '' && full.pjRenNum != null){

                    str = '已评价';

                }else{

                    str += '<span class="option-button option-edit option-in" data-num="' + full.tmCode + '">' + '评价</span>'

                }

                return str


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    conditionSelect();

    /*-----------------------------按钮事件----------------------------------*/

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        _resetFun();

        $('#spDT').val(st);

        $('#epDT').val(now);

    })

    //评价
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).attr('data-num');

        //初始化
        $('input[name="evaluate"][value="5"]').parent('span').addClass('checked');

        $('#evaluate-remark').val('');

        //模态框
        _moTaiKuang($('#Evaluate-Modal'),'评价','','','','完成评价');

    })

    //编辑确定按钮
    $('#Evaluate-Modal').on('click','.btn-primary',function(){


        //完工申请
        evaluateTask();

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //状态
            tmStatus:60,
            //运送任务编号
            tmCode:$('#TM-taskNumCon').val(),
            //开始时间
            gdSt:$('#spDT').val(),
            //结束时间
            gdEt:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQTM/GetTMInfoList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }

    //完工申请
    function evaluateTask(){

        var prm = {

            //任务单号
            tmcode:_thisId,
            //评价
            pingjia:$('[name="evaluate"]:checked').val(),
            //评价备注
            pjbz:$('#evaluate-remark').val(),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQTM/TMUptPingjia',prm,false,function(result){

            if(result.code == 99){

                $('#Evaluate-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


        })


    }

})