$(function(){
    /*------------------------------------------------变量---------------------------------------------*/

    //日历插件
    _dataComponentsFun($('.datatimeblock'));

    //默认时间为半年
    var now = moment().format('YYYY-MM-DD');

    var st = moment(now).subtract(6,'months').format('YYYY-MM-DD');

    $('.min').val(st);

    $('.max').val(now);

    //获取所有部门
    _getProfession('RBAC/rbacGetDeparts',$('#dep'),false,'departNum','departName');

    /*---------------------------------------------表格初始化------------------------------------------*/

    var col = [

        {
            title:'值班人编号',
            data:'watchUser'
        },
        {
            title:'值班人姓名',
            data:'watchUserName'
        },
        {
            title:'部门名称',
            data:'departName'
        },
        {
            title:'正常',
            data:'zhengchang'
        },
        {
            title:'忘打卡次数',
            data:'wdk'
        },
        {
            title:'请假',
            data:'qingjia'
        },
        {
            title:'迟到早退',
            data:'cdzt'
        },
        {
            title:'旷工',
            data:'kuanggong'
        }

    ]

    _tableInit($('#reporting'),col,1,'flag','','','','');

    getRYList();

    /*-----------------------------------------------按钮---------------------------------------------*/

    //查询
    $('#selected').click(function(){

        getData();

    })

    //重置
    $('.resites').click(function(){

        //input
        $('.condition-query').eq(0).find('input').val('');

        $('.condition-query').eq(0).find('select').val('');

        //时间
        $('.min').val(st);

        $('.max').val(now);

        $('#state').val(-1);

    })

    /*---------------------------------------------其他方法-------------------------------------------*/

    //获得数据
    function getData(){

        var prm = {

            //所属部门
            departNum:$('#dep').val(),
            //值班人姓名
            "watchUserName": ($('#overTime').val() == '')?'':$('#overTime').children('option:checked').html(),
            //开始时间
            "begintime": $('.min').val(),
            //结束时间
            "endtime": moment($('.max').val()).add(1,'d').format('YYYY-MM-DD'),
            //状态
            "status": $('#state').val(),

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/KQStatisticsperson',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

            },
            success:function(result){

                if(result){

                    _datasTable($('#reporting'),result);

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log(jqXHR.responseText);
            }


        })

    }

    //值班人员列表
    function getRYList(){

        var prm = {
            //用户id
            "usernum": _userIdNum,
            //用户名
            "username": _userIdName,
            //部门编码
            "departnum": _maintenanceTeam
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/ReturnUserList',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                if(result){

                    var str = '<option value="">全部</option>';

                    for(var i=0;i<result.length;i++){

                        str += '<option value="' + result[i].userNum + '">' + result[i].userName + '</option>';

                    }

                }

                $('#overTime').empty().append(str);

                getData();

            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log(jqXHR.responseText);
            }

        })
    }


})