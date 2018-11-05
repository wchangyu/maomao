$(function(){

    /*-----------------------------时间插件---------------------------------*/

    //结束时间
    var nowTime = moment().format('YYYY-MM-DD');

    //开始时间
    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#CA-startTimeCon').val(st);

    $('#CA-endTimeCon').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    /*-----------------------------表格初始化--------------------------------*/

    //主表格
    var col=[
        {
            title:'申请编号',
            data:'caNum',
            render:function(data, type, full, meta){

                return '<a href="CADetails.html?num=' + data + '" target="_blank">' + data + '</a>'

            }
        },
        {
            title:'申请状态',
            data:'caStatus',
            render:function(data, type, full, meta){

                if(data == 10){

                    return '申请'

                }else if(data == 20){

                    return '出车'

                }else if(data == 30){

                    return '回场'

                }else if(data == 99){

                    return '取消'

                }

            }
        },
        {
            title:'申请人',
            data:'causerName'
        },
        {
            title:'申请人部门',
            data:'departName'
        },
        {
            title:'负责人',
            data:'leaderName'
        },
        {
            title:'出发地',
            data:'startAddress'
        },
        {
            title:'目的地',
            data:'destAddress'
        },
        {
            title:'出发时间',
            data:'caTime',
            render:function(data, type, full, meta){

                return data.replace(/T/g,' ')

            }
        },
        {
            title:'申请理由',
            data:'caMemo'
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

        $('#CA-driverCon').val('');

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //申请编码
            canum:$('#CA-canumCon').val(),
            //状态为10的
            caStatus:$('#CA-statusCon').val(),
            //用车部门
            departnum:$('#CA-departCon').val(),
            //申请开始时间
            catimest:'',
            //申请时间结束
            catimeet:'',
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQCA/GetCAInfos',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }


})