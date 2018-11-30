$(function(){

    /*------------------------变量-------------------------------------------*/

    var search = window.location.search;

    var _prm = search.split('&');

    var _num = '';

    var _id = '';

    for(var i=0;i<_prm.length;i++){

        var data = _prm[i];

        if(data.indexOf('num')>-1){

            _num = data.split('=')[1];

        }else if(data.indexOf('data')>-1){

            _id = data.split('=')[1];

        }

    }

    //详情
    detailData();

    //日志
    logData();

    //全部不可操作
    $('input').attr('disabled',true);

    $('select').attr('disabled',true);

    $('textarea').attr('disabled',true);

    /*------------------------表格初始化--------------------------------------*/

    //项目
    var projectCol = [

        {
            title:'项目名称',
            data:'tmXm',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.tmXmid + '">' + data + '</span>'

            }
        },
        {
            title:'项目分类名称',
            data:'tmclassname'
        },
        {
            title:'完成人',
            data:'tmRenName'
        },
        {
            title:'完成时间',
            data:'xmwgTime',
            render:function(data, type, full, meta){

                var str = '';

                if(data != '' && data != null){

                    str = data.replace(/T/g,' ');

                }

                return str;

            }
        },
        {
            title:'完成备注',
            data:'tmxmmemo'
        }

    ]

    _tableInit($('#project-table'),projectCol,'2','','','','','','',true);

    //负责人列表
    var leaderCol = [

        {
            title:'工号',
            data:'tmRen'
        },
        {
            title:'姓名',
            data:'tmrName'
        },
        {
            title:'职位',
            data:'rolename'
        },
        {
            title:'联系电话',
            data:'tmrDh'
        }

    ]

    _tableInit($('#leader-table'),leaderCol,'2','','','','','','',true);

    _tableInit($('#leaderXZ-table'),leaderCol,'2','','','','','','',true);

    //执行人列表
    var executoCol = [

        {
            title:'工号',
            data:'tmRen'
        },
        {
            title:'姓名',
            data:'tmrName'
        },
        {
            title:'职位',
            data:'rolename'
        },
        {
            title:'联系电话',
            data:'tmrDh'
        }

    ]

    _tableInit($('#executor-table'),executoCol,'2','','','','','','',true);

    _tableInit($('#executorXZ-table'),executoCol,'2','','','','','','',true);

    //获取项目
    projectData();

    //负责人
    getLeaderList();

    //执行人
    getExecutorList();

    //协助信息
    xzData();

    /*------------------------其他方法---------------------------------------*/

    //任务详情
    function detailData(){

        var prm = {

            //编号
            tmCode:_num,
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQTM/GetTMInfoList',prm,$('.gd-wrap'),function(result){

            //赋值
            if(result.code == 99){

                var current = result.data[0];

                //任务编号
                $('#TM-num').val(current.tmCode);

                //任务状态
                $('#TM-status').val(_getTMStatus(current.tmStatus));

                //发起人id
                $('#TM-creator').val(current.bxRenID);

                //发起人
                $('#TM-creatorName').val(current.bxRenName);

                //发起电话
                $('#TM-tel').val(current.bXdianhua);

                //发起科室
                $('#TM-bxDep').val(current.bxkeshi);

                //开始地点
                $('#TM-startAddress').val(current.tMsrcdidian);

                //结束地点
                $('#TM-endAddress').val(current.tMdestDidian);

                //运送分类
                $('#TM-cate').val(current.tmCate);

                //任务类型
                $('#TM-type').val(current.tMleixing);

                //备注
                $('#TM-remark').val(current.bxBeizhu);

                //满意度
                $('input[name="evaluate"][value=' + current.pingjia + ']').parent('span').addClass('checked');

                //评价意见
                $('#evaluate-remark').val(current.pjBz);

                //评价人
                $('#evaluate-person').val(current.pjRenName);

            }

        })

    }

    //获取项目
    function projectData(){

        var prm = {

            tmCode:_num

        }

        _mainAjaxFunCompleteNew('post','YHQTM/GetTMInfoxmsList',prm,false,function(result){

            if(result.code == 99){

                if(result.data.length != 0 && result.data != null){

                    _datasTable($('#project-table'),result.data);

                }

            }

        })

    }

    //获取运送负责人
    function getLeaderList(){

        var prm = {

            //部门编码
            tmCode: _num,
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQTM/TMWXLeaderList',prm,false,function(result){

            if(result.length != 0 && result != null){

                _datasTable($('#leader-table'),result.data);

            }else{

                _datasTable($('#leader-table'),[]);

            }

        })

    }

    //获取执行人接口
    function getExecutorList(){

        var prm = {

            //部门编码
            tmCode: _num,
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQTM/TMRenList',prm,false,function(result){

            if(result.length != 0 && result != null){

                _datasTable($('#executor-table'),result.data);

            }else{

                _datasTable($('#executor-table'),[]);

            }

        })

    }

    //处理日志
    function logData(){

        var prm = {

            //编号
            tmCode:_num,
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        $.ajax({

            type:'post',

            url:_urls + 'YHQTM/ywDGGetLog',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                var str = '';

                if(result.length>0){

                    for(var i=0;i<result.length;i++){

                        str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';

                    }

                }

                $('.MW-log').empty().append(str);

            },

            error:_errorFunNew

        })

    }

    //获取协助信息
    function xzData(){

        var prm = {

            id:_id,

            tmCode:_num

        }

        _mainAjaxFunCompleteNew('post','YHQTM/TMInfoFZDetail',prm,false,function(result){

            if(result.code == 99){

                var data = result.data;
                //协助科室
                $('#TM-depXZ').val(data.tMkeshi);
                //协助原因
                $('#TM-remarkXZ').val(data.remark);
                //负责人
                if(data.wxLeaderFZList != [] && data.wxLeaderFZList != null){

                    _datasTable($('#leaderXZ-table'),data.wxLeaderFZList);

                }
                //执行人
                if(data.tmRenFZList != [] && data.tmRenFZList != null){

                    _datasTable($('#executorXZ-table'),data.tmRenFZList);

                }

            }

        })

    }

})