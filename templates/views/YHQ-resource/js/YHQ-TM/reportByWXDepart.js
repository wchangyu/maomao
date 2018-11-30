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

    _tableInit($('#table'),col,'2','','',drawFnCol,'','');

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
                num += Number(tr.eq(i).children().eq(2).html());

                //总价
                finish += Number(tr.eq(i).children().eq(1).html());

            }

        }

        //数量
        $('#amount').html(num);

        //总价
        $('#finishCount').html(finish);

    };

    conditionSelect();

    //条件查询
    function conditionSelect(){

        var prm = {

            //开始时间
            st:$('#spDT').val(),
            //结束时间
            et:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQTM/ysGDRptTMkeshi',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _datasTable($('#table'),result.data);

            }

        })


    }

})