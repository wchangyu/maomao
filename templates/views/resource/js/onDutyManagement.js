$(function(){

    /*--------------------------------------------------变量---------------------------------------------------*/

    //时间插件
    _timeOneComponentsFun($('.datatimeblock'),'3','3','3','MM');

    //执行人数组
    var _workerArr = [];

    //已选中的执行人
    var _zhixingRens = [];

    //获取所有班次
    var _BCData = [];

    //班次
    getShift();
    /*--------------------------------------------------表格初始化----------------------------------------------*/

    //值班表格
    var tableListCol = [

        {
            title:'值班编号',
            data:''
        },
        {
            title:'值班月份',
            data:''
        },
        {
            title:'部门名称',
            data:''
        },
        {
            title:'创建人',
            data:''
        },
        {
            title:'审批人',
            data:''
        },
        {
            title: '操作',
            "targets": -1,
            "data": null,
            "className": 'noprint',
            "defaultContent":"<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }

    ];

    _tableInit($('#table-list'),tableListCol,1,true,'','');

    //人员排班
    //var workerListCol = [
    //
    //    {
    //        title:'姓名',
    //        data:''
    //    },
    //    {
    //        title:'工号',
    //        data:''
    //    }
    //];

    //_tableInit($('#worker-list'),workerListCol,2,true,'','');

    var col3 = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'userNum',
            className:'zxrnum'
        },
        {
            title:'执行人员',
            data:'userName',
            className:'zxrname'
        },
        {
            title:'职位',
            data:'pos'
        },
        {
            title:'联系电话',
            data:'mobile',
            className:'zxrphone'
        }
    ];
    _tableInit($('#zhixingRenTable'),col3,2,true,'','');

    getRY(true);

    /*--------------------------------------------------按钮事件------------------------------------------------*/

    $('.creatButton').click(function(){

        //初始化

        //模态框
        _moTaiKuang($('#ADD-Modal'),'提示','','','','新增');

    })

    //选择人员
    $('#select-work').click(function(){

        //初始化
        $('#zxName').val('');

        $('#zxNum').val('');

        _datasTable($('#zhixingRenTable'),_workerArr);

        //模态框
        _moTaiKuang($('#Worker-Modal'),'执行人列表','','','','选择');

    })

    //执行人条件查询
    $('.zhixingButton').click(function(){

        getRY(false);

    })

    //执行人表格选择
    $('#zhixingRenTable').find('tbody').on( 'click', 'input', function () {
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            $(this).parents('tr').addClass('tables-hover');
            //如果所有复选框打钩，那么表头的复选框自动打钩；
            var rowNum = $(this).parents('.table').find('tbody').find('.checkeds').length;
            var selectNum =  $(this).parents('.table').find('tbody').find('.checked').length;
            if( rowNum == selectNum){
                $(this).parents('.table').find('thead').find('.checkeds').find('span').addClass('checked');
            }
        }else{
            $(this).parent($('span')).removeClass('checked');
            //$(this).parents('tr').css({'background':'#ffffff'});
            $(this).parents('tr').removeClass('tables-hover');
            //只要有一个复选框没选中，全选框不打勾，
            $(this).parents('.table').find('thead').find('.checkeds').find('span').removeClass('checked');
        }
    });

    //选中执行人
    $('#Worker-Modal').on('click','.addZXR',function(){

        _zhixingRens.length = 0;

        var checkedArr = $('#zhixingRenTable').find('.checked');

        for(var i=0;i<checkedArr.length;i++){

            var obj = {};

            obj.name = checkedArr.eq(i).parents('tr').children('.zxrname').html();

            obj.num = checkedArr.eq(i).parents('tr').children('.zxrnum').html();

            _zhixingRens.push(obj);

        }

        var str = '';

        for(var i=0;i<_zhixingRens.length;i++){

            str += '<li><div class="checker"><span><input type="checkbox"></span></div>' + '<span class="name">' + _zhixingRens[i].name +
                '</span>' +'<span class="num">' + _zhixingRens[i].num +
                '</span>'
                '</li>'

        }

        $('.on-duty-worker').empty().append(str);

        $('#Worker-Modal').modal('hide');
    })

    //已选中执行人员点击事件
    $('.on-duty-worker').on('click','li',function(){

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //选择时间，人员，班次之后的确定按钮
    $('#ADD-Modal').on('click','.addWorker',function(){

        //获取今年
        var year = moment().format('YYYY');

        var Monthnum = chineseNum($('#ADD-Modal').find('.datatimeblock').val());

        //首先确定当月有几天，
        var day = new Date(year,Monthnum,0);

        var daycount = day.getDate();

        //------------------------------------------------------------------------------------

        var arr = [];

        var lengths = daycount +1;

        for(var i=1;i<lengths;i++ ){

            arr.push( String(Monthnum) + '月' + String(i) + '日');

        }

        var col = [];

        for(var i=0;i<arr.length;i++){

            var obj = {};

            obj.title = arr[i];

            var ii = Number(i) + 1;

            obj.data = ii;

            col.push(obj);

        }

        var option = {
            title: '操作',
            "targets": -1,
            "data": null,
            "className": 'noprint',
            "defaultContent":
                "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }

        var name1 = {

            title:'姓名',
            data:'name'

        }

        var gh1 = {

            title:'工号',
            data:'num'
        }

        col.unshift(gh1);

        col.unshift(name1);

        col[col.length] = option;

        _tableInit($('#worker-list'),col,2,false,'','');

        //--------------------------------------------------------------------------------

        //遍历选中的班次

        var BC = [];

        for(var i=0;i<_BCData.length;i++){

            if(_BCData[i].bccode == $('#shift').val()){

                BC = _BCData[i].banCiDetailList;

                //for(var j=0;j<_BCData[i].banCiDetailList.length;j++){
                //
                //    BC.push(_BCData[i].banCiDetailList[j].selectedday);
                //
                //}

            }

        }

        var tableArr= [];

        for(var i=0;i<_zhixingRens.length;i++){

            var obj = {};

            obj.name = _zhixingRens[i].name;

            obj.num = _zhixingRens[i].num;

            for(var j=0;j<BC.length;j++){

                var bc = BC[j].selectedday;

                obj[bc] = $('#shift').children('option:selected').html();

            }

            tableArr.push(obj);
        }

        _datasTable($('#worker-list'),tableArr);


    })


    /*--------------------------------------------------其他方法-------------------------------------------------*/
    //获取班次
    function getShift(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/BanCiGetAll',
            timeout:_theTimes,
            success:function(result){

                if(result.length != 0 ){

                    _BCData.length = 0;

                    for(var i=0;i<result.length;i++){

                        _BCData.push(result[i]);

                    }

                    var str = '<option value="">请选择</option>';

                    var reg = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

                    for(var i=0;i<result.length;i++){


                        //首先判断是否是时间格式

                        var st = '';

                        if( reg.test(result[i].shangbantime) ){

                            st = result[i].shangbantime.slice(0,5);

                        }else{

                            st = ''

                        }

                        var et = '';

                        if( reg.test(result[i].xiabantime) ){

                            et = result[i].xiabantime.slice(0,5);

                        }else{

                            et = '';

                        }

                        var timeStr = '  （' + st + '-' + et + '）';

                        str +='<option value="' + result[i].bccode +
                            '"><span>' + result[i].name +
                            '</span>' + timeStr +
                            '</option>'

                    }

                    $('#shift').empty().append(str);

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //选择执行人 true
    function getRY(flag){
        var prm = {
            "userName2": $('#zxName').val(),
            "userNum": $('#zxNum').val(),
            "departNum": _loginUser.userDepartNum,
            "roleNum": "",
            "userID": _userIdNum,
            "userName":_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetWXRens',
            data:prm,
            success:function(result){

                if(flag){

                    for(var i=0;i<result.length;i++){

                        _workerArr.push(result[i]);

                    }

                }

                _datasTable($('#zhixingRenTable'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //中文月份转化为数字
    function chineseNum(str){

        if(str == '一月'){

            return 1
        }else if( str == '二月'){

            return 2
        }else if( str == '三月'){

            return 3
        }else if( str == '四月'){

            return 4
        }else if( str == '五月'){

            return 5
        }else if( str == '六月'){

            return 6
        }else if( str == '七月'){

            return 7
        }else if( str == '八月'){

            return 8
        }else if( str == '九月'){

            return 9
        }else if( str == '十月'){

            return 10
        }else if( str == '十一月'){

            return 11
        }else if( str == '十二月'){

            return 12
        }

    }
})