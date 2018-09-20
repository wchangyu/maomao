$(function(){

    /*------------------------变量-------------------------------------------*/

    var search = window.location.search;

    var _num = search.split('=')[1];

    //详情
    detailData();

    //日志
    logData();

    //全部不可操作
    $('input').attr('readonly',true);

    $('select').attr('readonly',true);

    /*------------------------其他方法---------------------------------------*/

    //医废详情
    function detailData(){

        var prm = {

            //编号
            mwcode:_num,
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','MW/mwGetDetail',prm,$('.gd-wrap'),function(result){

            //赋值
            if(result.code == 99){

                var current = result.data;
                //医废单号
                $('#YFnum').val(current.mwcode);
                //当前状态
                var status = _YFstatus(current.mwstatus);
                $('#YFstatus').val(status);
                //医废分类
                $('#MW-classify').val(current.wtname);
                //医废来源
                $('#MW-source').val(current.wsname);
                //科室
                $('#MW-dep').val(current.keshiname);
                //医废处理人
                $('#MW-person').val(current.sendusername);
                //运送人
                $('#MW-carrier').val(current.transusername);
                //称
                $('#MW-weigh').val(current.scalename);
                //重量
                $('#MW-weighNum').val(current.weight);
                //打包时间
                $('#MW-creat-time').val(current.sendtime == ''?'':moment(current.sendtime).format('YYYY-MM-DD HH:mm'));

                //入库称
                $('#MW-in-weigh').val(current.inscalename);
                //入库重量
                $('#MW-in-weight').val(current.inweight);
                //桶编号
                $('#MW-in-bucket').val(current.batchnum);
                //入库人
                $('#MW-in-person').val(current.inusername);
                //入库时间
                $('#MW-in-time').val(current.insttime == ''?'':moment(current.insttime).format('YYYY-MM-DD HH:mm'));

                //处理公司
                $('#MW-out-company').val(current.compname);
                //运输车牌号
                $('#MW-out-car').val(current.carid);
                //入库人
                $('#MW-out-person').val(current.outusername);
                //入库时间
                $('#MW-out-time').val(current.outsttime == ''?'':moment(current.outsttime).format('YYYY-MM-DD HH:mm'));


            }

        })

    }

    //处理日志
    function logData(){

        var prm = {

            //编号
            mwcode:_num,
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

            url:_urls + 'MW/mwGetLog',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                console.log(result);

                var str = '';

                if(result.length>0){

                    for(var i=0;i<result.length;i++){

                        str += '<li><span class="list-dot" ></span>' + result[i].logdate + '&nbsp;&nbsp;' + result[i].username + '&nbsp;&nbsp;'+ result[i].logtitle + '&nbsp;&nbsp;' + result[i].logcontent+ '</li>';

                    }

                }

                $('.MW-log').empty().append(str);

            },

            error:_errorFunNew

        })

    }

})