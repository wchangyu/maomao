$(function(){

    /*----------------------------------------时间插件-------------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    /*------------------------------------------表格初始化----------------------------------*/

    var mainCol = [

        {
            title:'编号',
            data:'mwcode',
            render:function(data, type, full, meta){

                return '<a href="MWdetails.html?a=' + data + '" target="_blank">' + data + '</a>';

            }


        },
        {
            title:'分类',
            data:'wtname'
        },
        {
            title:'来源',
            data:'wsname'
        },
        {
            title:'打包时间',
            data:'sendtime',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return moment(data).format('YYYY-MM-DD HH:mm')

                }

            }

        },
        {
            title:'打包重量(kg)',
            data:'weight'
        },
        {
            title:'运送人',
            data:'transusername'
        },
        {
            title:'入库时间',
            data:'insttime',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return moment(data).format('YYYY-MM-DD HH:mm')

                }

            }
        },
        {
            title:'入库重量(kg)',
            data:'inweight'
        }

    ]

    _tableInit($('#table'),mainCol,'2','','','','','');

    conditionSelect();

    /*------------------------------------------按钮事件------------------------------------*/

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        $('#spDT').val(st);

        $('#epDT').val(nowTime);

        $('#MWCarrier').val('');

    })

    /*------------------------------------------其他方法------------------------------------*/

    //条件查询
    function conditionSelect(){

        //表格初始化
        _tableDataInit();

        var prm = {

            //开始时间
            sendtimest:$('#spDT').val(),
            //结束时间
            sendtimeet:moment($('#epDT').val()).add(1,'days').format('YYYY-MM-DD'),
            //运送人id
            transuserid:$('#MWCarrierNum').val(),
            //运送人姓名
            transusername:$('#MWCarrierName').val(),
            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','MW/mwGetInfos',prm,$('.content-top'),function(result){

            var arr = [];

            //合计
            var num = 0;

            if(result.code == 99){

                arr = result.data;

                for(var i=0;i<arr.length;i++){

                    var data = arr[i];

                    num += Number(data.weight);

                }

            }

            _datasTable($('#table'),arr);

            $('#dataWeightNum').html(num)

        })


    }

    //表格初始化
    function _tableDataInit(){

        _datasTable($('#table'),[]);

        $('#dataWeightNum').val(0);

    }

})