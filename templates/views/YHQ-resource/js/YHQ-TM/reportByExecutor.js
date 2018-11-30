$(function(){

    /*------------------------------------时间------------------------------------*/

    //默认半个月

    var now = moment().format('YYYY-MM-DD');

    var st = moment(now).subtract(14,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(now);

    _timeYMDComponentsFun11($('.abbrDT'));

    /*-----------------------------------表格初始化---------------------------------*/

    var col=[
        {
            title:'执行人',
            data:'tmrName'
        },
        {

            title:'运送科室',
            data:'tMkeshi'

        },
        {
            title:'已完成数',
            data:'finishCount'
        },
        {
            title:'总任务数',
            data:'amount'
        },

    ]

    _tableInit($('#table'),col,2,'','',drawFnCol,'','');

    //重绘合计数据
    function drawFnCol(){

        //表格中的每一个tr
        var tr = $('#table tbody').children('tr');

        //总数
        var num = 0;

        //完成
        var finish = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //数量
                num += Number(tr.eq(i).children().eq(3).html());

                //总价
                finish += Number(tr.eq(i).children().eq(2).html());

            }

        }

        //数量
        $('#amount').html(num);

        //总价
        $('#finishCount').html(finish);

    };

    conditionSelect();

    /*-------------------------------按钮事件-------------------------------------*/

    //科室确定按钮
    $('#dep-Modal').on('click','.btn-primary',function(){

        var currentTr = _isSelectTr($('#depart-table-global'));

        if(currentTr){

            var name = $(currentTr).children().eq(2).html();

            var num = $(currentTr).children().eq(1).html();

            //发起科室
            $('#MWDep').val(name);

            $('#MWDep').attr('data-num',num);

            $('#dep-Modal').modal('hide');

        }

    })

    //清空科室
    $('#removeDep').click(function(){

        $(this).prev().val('');

        $(this).prev().removeAttr('data-num');

    })

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        _resetFun();

        $('#spDT').val(st);

        $('#epDT').val(now);

        $('#MWDep').val('');

        $('#MWDep').removeAttr('data-num');

    })

    //导出数据
    $('#excelBtn').click(function(){

        _FFExcel($('#table')[0]);

    })


    //条件查询
    function conditionSelect(){

        var prm = {

            //开始时间
            st:$('#spDT').val(),
            //结束时间
            et:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //运送科室
            tmKeshiNum:$('#MWDep').attr('data-num'),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQTM/ysGDRptRen',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _datasTable($('#table'),result.data);

            }

        })


    }

})