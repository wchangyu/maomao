$(function(){

    /*--------------------------------------------------变量---------------------------------------------------*/

    //时间插件
    _timeOneComponentsFun($('.datatimeblock'),'3','3','3','MM');

    //执行人数组
    var _workerArr = [];

    //已选中的执行人
    var _zhixingRens = [];

    //当前选中的排班人
    var _currentRens = [];

    //获取所有班次
    var _BCData = [];

    //当前添加的所有已排班的静态数组
    var _allData = [];

    //数据绑定的时候，读出的人
    var _readRens = [];

    //当前选中的id；
    var _thisID = '';

    //当前选中的值班表编号
    var _thisCode = '';

    //当前选择的执行人的id
    var _thisWorkerNum = '';

    //记录当前选中的行；
    var _thisRow = '';

    //判断当前是否是新增类型；
    var _isDeng = false;

    //班次
    getShift();
    /*--------------------------------------------------表格初始化----------------------------------------------*/

    //值班表格
    var tableListCol = [

        {
            title:'id',
            data:'id',
            className:'codeId'
        },
        {
            title:'值班编号',
            data:'zbCode',
            className:'zbCode'
        },
        {
            title:'值班月份',
            data:'watchtime',
            render:function(data, type, full, meta){

                return data.slice(0,7)

            }
        },
        {
            title:'部门名称',
            data:'departName'
        },
        {
            title:'创建人',
            data:'createUserName'
        },
        {
            title:'审批人',
            data:'shenpUserName'
        },
        {
            title: '操作',
            "data": '',
            "className": 'noprint',
            render:function(data, type, full, meta){

                if(full.isexamine == 1){

                   return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                    "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                    "<span class='data-option option-shenhe btn default btn-xs green-stripe'>审核</span>"+
                    "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

                }else if(full.isexamine == 0){

                   return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                    "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                    "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

                }

            }
        }

    ];

    _tableInit($('#table-list'),tableListCol,1,true,'','');

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

    $.fn.dataTable.ext.errMode = function (s, h, m) {
        //console.log('')
    };

    //获取所有人员列表
    getRY(true);

    //获取当前条件查询
    conditionSelect();
    /*--------------------------------------------------按钮事件------------------------------------------------*/


    $('.creatButton').click(function(){

        _isDeng = true;

        //初始化
        detailedInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'提示','','','','新增');

        //表格清空
        $('#worker-table thead').empty();

        $('#worker-table tbody').empty();

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('shenhe').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //添加人员类
        $('#ADD-Modal').find('.QRButton').addClass('addWorker').removeClass('addPerson');

        //可操作
        abledOption();

    })

    //选择人员
    $('#select-work').click(function(){

        //将时间置为不可操作
        $('.datatimeblock').attr('disabled',true).addClass('disabled-block');

        $('.datatimeblock').parent().addClass('disabled-block');

        if($('.datatimeblock').val() == ''){

            _moTaiKuang($('#myModal2'),'提示','flag','istap','请先选择日期！','');

        }else{

            //模态框
            _moTaiKuang($('#Worker-Modal'),'执行人列表','','','','选择');

        }

        //初始化
        $('#zxName').val('');

        $('#zxNum').val('');

        _datasTable($('#zhixingRenTable'),_workerArr);

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

    //字符串拼接形成表格
    $('#ADD-Modal').on('click','.addWorker',function(){

        //构成表格只需要有月份、已选中的人员、班次、足够；

        //首先验证是否选中排班的人
        var currentArr = $('.on-duty-worker').children('.tables-hover');

        _currentRens.length = 0;

        for(var i=0;i<currentArr.length;i++){

            var obj = {};

            obj.name = currentArr.eq(i).find('.name').html();

            obj.num = currentArr.eq(i).find('.num').html();

            _currentRens.push(obj);

        }

        if(_currentRens.length == 0){

            _moTaiKuang($('#myModal2'),'提示','flag','istap','请先选择人员！','');

        }else{

            //验证班次是否选择
            if( $('#shift').val() == '' ){

                _moTaiKuang($('#myModal2'),'提示','flag','istap','请先选择班次！','');

            }else{

                //比较一下 是否添加过

                for(var i=0;i<_allData.length;i++){

                    for(var j=0;j<_currentRens.length;j++){


                        if(_allData[i].num == _currentRens[j].num){

                            _currentRens.removeByValue(_currentRens[j].num,'num');


                        }else{



                        }

                    }

                }

                //新增需要传的数据
                //确定姓名，id
                for(var i=0;i<_currentRens.length;i++){

                    var personObj = {};

                    personObj.name = _currentRens[i].name;

                    personObj.num = _currentRens[i].num;

                    personObj.bcCode = $('#shift').val();

                    personObj.bcName = $('#shift').children('option:selected').html();

                    _allData.push(personObj);
                }

                //通过_currentRens判断，如果是【】说明重复了，提示，

                if(_currentRens.length == 0){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','每个人员只能本月只能安排一次班！','');
                }else{

                    drawTable();

                }

            }

        }

    })

    //添加
    $('#ADD-Modal').on('click','.dengji',function(){

        var arr = [];

        var time = moment().format('YYYY') + '-' + chineseNum($('.datatimeblock').val()) + '-' + '01';


        for(var i=0;i<_allData.length;i++){

            var obj = {};

            //值班人id
            obj.watchUser = _allData[i].num;
            //值班人姓名
            obj.watchUserName = _allData[i].name;
            //班次编号
            obj.bccode = _allData[i].bcCode;
            //班次名称
            obj.bcname = _allData[i].bcName.split(' ')[0];

            arr.push(obj);
        }

        var prm = {

            //值班具体月份(eg:2017-12-01);
            watchtime:time,

            //创建人
            createUser:_userIdNum,

            //创建人姓名
            createUserName:_userIdName,

            //所属部门编号
            departNum:_loginUser.departNum,

            //所属部门名称
            departName:_loginUser.departName,

            //值班人员集合
            wprAddList:arr

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/WatChAdd',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','新增成功！','');

                    $('#ADD-Modal').modal('hide');

                    conditionSelect();

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','新增失败！','');

                }


            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    })

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //查看
    $('#table-list').on('click','.option-see',function(){

        //初始化
        detailedInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'查看详情','flag','','','');

        //数据绑定
        bindData($(this),false);

        //人员你添加类
        $('.addWorker').removeClass('addPerson');

        //不可操作
        disabledOption();
    })

    //编辑(只能修改月份时间);
    $('#table-list').on('click','.option-edit',function(){

        //初始化
        detailedInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'编辑','','','','保存');

        //数据绑定
        bindData($(this),true);

        _thisID = $(this).parents('tr').children('.codeId').html();

        _thisCode = $(this).parents('tr').children('.zbCode').html();

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('shenhe').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //人员你添加类
        $('.addWorker').addClass('addPerson').removeClass('addWorker');

        //可操作
        abledOption();

        //编辑的时候，先让日历操作为不可操作
        $('.datatimeblock').attr('disabled',true).addClass('disabled-block');

        $('.datatimeblock').parent('.input-blocked').addClass('disabled-block');

    })

    //时间插件修改
    $('.datatimeblock').change(function(){

        if( _isDeng ){

            return false;

        }else{

            //表格清除
            $('#worker-table thead').empty();

            $('#worker-table tbody').empty();

            //重绘表格
            //获取今年

            var year = moment().format('YYYY');

            var Monthnum = chineseNum($('#ADD-Modal').find('.datatimeblock').val());


            //首先确定当月有几天，
            var day = new Date(year,Monthnum,0);

            var daycount = day.getDate();

            //表格头部------------------------------------------------------------------

            var arr = ['操作','姓名','工号'];

            var lengths = daycount +1;

            for(var i=1;i<lengths;i++ ){

                var str = '';

                str = moment(String(Monthnum) + '/' + String(i)).format('MM/DD');

                var aa = moment().format('YYYY') + '-' + Monthnum + '-' + i;

                str += '<br><span data-num="' + moment(aa).format('d') +
                    '">' + numWeek(moment(aa).format('d')) + '</span>';

                arr.push( str );

            }

            //遍历arr生成表格头部
            var headStr = '<tr>';

            drawThead(arr,headStr);

            //表格身体-------------------------------------------------------------------
            var bodyStr = '';

            //首先确定周期
            var period = '';

            for(var i=0;i<_readRens.length;i++){

                var BC = [];

                var BC0 = [];

                //首先根据班次code确定显示的具体值
                for(var j=0;j<_BCData.length;j++){

                    if(_BCData[j].bccode == _readRens[i].bcNum){

                        period = _BCData[j].period;

                        BC = _BCData[j].banCiDetailList;

                    }

                }

                //确定arr所对应body的值
                var dataArr = [];

                if( period == 1 ){

                    //首先根据arr的值来确定
                    for(var z = 0;z<arr.length;z++){

                        var dataAttr = '';

                        if(arr[z].indexOf('data-num')>0){

                            dataAttr = arr[z].split('=')[1].split('"')[1];

                            if(dataAttr == 0){

                                dataAttr = "7";

                            }

                        }else{

                            dataAttr = '';

                        }

                        dataArr.push(dataAttr);


                    }

                }else if(period == 2){

                    for(var z = 0;z<arr.length;z++){

                        var dataAttr = '';

                        dataAttr = arr[z].split('<br>')[0].split('/')[1];

                        if( typeof dataAttr == 'string'){

                            if(dataAttr.slice(0,1) == 0){

                                dataAttr = dataAttr.slice(1,2);

                            }else{

                                dataAttr = arr[z].split('<br>')[0].split('/')[1];

                            }

                        }else{

                            dataAttr = '';

                        }

                        dataArr.push(dataAttr);

                    }

                }

                //初始值首先确认为全'';
                for(var z=0;z<dataArr.length;z++){

                    BC0.push('');

                }

                //确定BC0的值，有值不为''，无值为'';
                for(var z=0;z<dataArr.length;z++){

                    for(var k=0;k<BC.length;k++){

                        if(dataArr[z] == BC[k].selectedday){

                            BC0[z] = BC[k].selectedday;

                            break;

                        }else{

                            BC0[z] = ''

                        }

                    }

                }

                bodyStr += '<tr>';

                for(var z=0;z<BC0.length;z++){

                    var values = ''

                    if(BC0[z] == ''){

                        if(z == 0){

                            values = '<span class="data-option option-delete-worker btn default btn-xs green-stripe">删除</span>'

                        }else if(z == 1){

                            values = _readRens[i].name;

                        }else if(z == 2){

                            values = _readRens[i].num;

                        }else{

                            values = ''

                        }



                    }else{
                        {

                            values = _readRens[i].bcName;
                        }

                    }

                    bodyStr += '<td>' + values +
                        '</td>'

                }

                bodyStr += '</tr>';

            }

            $('#worker-table tbody').append(bodyStr);

        }

        _isDeng = false;

    })

    //删除
    $('#table-list').on('click','.option-delete',function(){

        //初始化
        detailedInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'确定要删除吗？','','','','删除');

        //数据绑定
        bindData($(this),false);

        _thisID = $(this).parents('tr').children('.codeId').html();

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('shenhe').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //人员你添加类
        $('.addWorker').removeClass('addPerson').removeClass('addWorker');

        //不可操作
        disabledOption()

    })

    //删除确定按钮
    $('#ADD-Modal').on('click','.shanchu',function(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/WatChDelete',
            data:{

                id:_thisID

            },
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','删除成功!','');

                    $('#ADD-Modal').modal('hide');

                    conditionSelect()

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','删除失败!','');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }
        })

    })

    //编辑确定按钮
    $('#ADD-Modal').on('click','.bianji',function(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/WatChUpdate',
            data:{
                id:_thisID,

                watchtime:moment().format('YYYY') + '-' + chineseNum($('.datatimeblock').val()) + '-' + '01',

                departNum:_loginUser.departNum
            },
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','编辑成功!','');

                    $('#ADD-Modal').modal('hide');

                    conditionSelect();

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','编辑失败!','');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })


    })

    //添加执行人员
    $('#ADD-Modal').on('click','.addPerson',function(){

        var arr = [];

        //首先验证是否选中排班的人
        var currentArr = $('.on-duty-worker').children('.tables-hover');

        _currentRens.length = 0;

        for(var i=0;i<currentArr.length;i++){

            var obj = {};

            obj.name = currentArr.eq(i).find('.name').html();

            obj.num = currentArr.eq(i).find('.num').html();

            _currentRens.push(obj);

        }

        for(var i=0;i<_allData.length;i++){

            for(var j=0;j<_currentRens.length;j++){


                if(_allData[i].num == _currentRens[j].num){

                    _currentRens.removeByValue(_currentRens[j].num,'num');


                }else{


                }

            }

        }

        //确定姓名，id
        //for(var i=0;i<_currentRens.length;i++){
        //
        //    var personObj = {};
        //
        //    personObj.name = _currentRens[i].name;
        //
        //    personObj.num = _currentRens[i].num;
        //
        //    personObj.bcCode = $('#shift').val();
        //
        //    personObj.bcName = $('#shift').children('option:selected').html();
        //
        //    _allData.push(personObj);
        //}

        for(var i=0;i<_currentRens.length;i++){

            var obj = {};

            //值班人id
            obj.watchUser = _currentRens[i].num;

            //值班人名字
            obj.watchUserName = _currentRens[i].name;

            //班次编号
            obj.bccode = $('#shift').val();

            //班次名称
            obj.bcname = $('#shift').children('option:selected').html().split(' ')[0];

            arr.push(obj);
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/WPRAdd',
            timeout:_theTimes,
            data:{

                zbCode:_thisCode,
                wprList:arr

            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','添加人员成功!');

                    conditionSelect();

                    //更新一下_allData
                    allDate();

                    //向表格中添加
                    //确定了arr就好说了
                    var td = $('#worker-table thead').children('tr').children('th');

                    var arr1 = [];

                    for(var i=0;i<td.length;i++){

                        arr1.push(td.eq(i).html());

                    }

                    var bodyStr = '';

                    drawTbody(arr1,bodyStr,1,2);

                    $('#worker-table tbody').append(bodyStr);

                    //修改
                    $('#worker-table tbody').children('tr').eq(1).children('td').eq(0).html('<span class="data-option option-delete-worker btn default btn-xs green-stripe">删除</span>')

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','添加人员失败!');

                }
            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })

    })


    //删除执行人员
    $('#ADD-Modal').on('click','.option-delete-worker',function(){

        //提示
        _moTaiKuang($('#DEL-Modal'),'提示','','istap','确定要删除该人员吗？','删除');

        //添加类
        $('#DEL-Modal').find('.btn-primary').addClass('table-shi-del');

        //确定删除人id
        _thisWorkerNum = $(this).parents('tr').children('td').eq(2).html();

        //记录删除某一行
        _thisRow = $(this).parents('tr');

    })

    //动态删除人员确定按钮
    $('#DEL-Modal').on('click','.table-shi-del',function(){

        var id = '';

        for(var i=0;i<_readRens.length;i++){

            if(_thisWorkerNum == _readRens[i].num){

                id = _readRens[i].id;

            }

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/UPRDelete',
            data:{

                id:id

            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','删除人员成功！','');

                    $('#DEL-Modal').modal('hide');

                    conditionSelect();

                    //更新_allData;
                    allDate();

                    //刷新表格
                    $(_thisRow).remove();

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','删除人员失败！','');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }
        })

    })

    //静态删除人员确定按钮
    $('#worker-table').on('click','.option-quiet-worker',function(){

        //模态框
        _moTaiKuang($('#DEL-Modal'),'提示','','istap','确定要删除吗？','删除');

        //添加类
        $('#DEL-Modal').find('.btn-primary').removeClass('option-delete-worker').addClass('option-quite-worker');

        _thisRow = $(this).parents('tr');

        _thisWorkerNum = $(this).parents('tr').children('td').eq(2).html();

    })

    //静态删除确定按钮
    $('#DEL-Modal').on('click','.option-quite-worker',function(){

        //表格首先删除
        $(_thisRow).remove();

        var arr = [];

        for(var i=0;i<_allData.length;i++){

            if(_thisWorkerNum == _allData[i].num){

                arr.push(_allData[i])

            }

        }

        //数组其次删除
        _allData.remove(arr[0]);

        //模态框消失
        $('#DEL-Modal').modal('hide');


    })

    //审核
    $('#table-list').on('click','.option-shenhe',function(){

        //初始化
        $('#examine-Modal').find('#myApp33').find('input').val('');

        $('#examine-Modal').find('#myApp33').find('textarea').val('');

        $('#radioblock').find('input').parent('span').removeClass('checked');

        $('#radioblock').find('input').eq(0).parent('span').addClass('checked');

        //模态框
        _moTaiKuang($('#examine-Modal'),'审核','','','','审核');

        //值班id
        _thisID = $(this).parents('tr').children('.codeId').html();

        //值班code
        _thisCode = $(this).parents('tr').children('.zbCode').html();

        $('#examine-Modal').find('#myApp33').find('input').eq(0).val(_thisID);

        $('#examine-Modal').find('#myApp33').find('input').eq(1).val(_thisCode);


    })

    //审核单选按钮事件
    $('#radioblock').on('click','input',function(){

        $('#radioblock').find('input').parent('span').removeClass('checked');

        $(this).parent('span').addClass('checked');

    })

    //审核确定按钮
    $('#examine-Modal').on('click','.shenhe',function(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/WatchShenpi',
            data:{
                //值班表id
                id:_thisID,
                //值班表code
                zbCode:_thisCode,
                //审批人编号
                shenpUserNum:_userIdNum,
                //审批人姓名
                shenpUserName:_userIdName,
                //审批意见
                shenpopinion:$('#examine-Modal').find('textarea').val(),
                //是否通过
                isshenp:$('#radioblock').find('.checked').children().attr('attr-value')
            },
            timeout:_theTimes,
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','审核成功！','');

                    conditionSelect();

                    $('#examine-Modal').modal('hide');

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','审核失败！','');


                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })

    })

    /*--------------------------------------------------其他方法-------------------------------------------------*/
    //条件查询
    function conditionSelect(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/WatchGetAll',
            data:{
                //当前用户id
                userNum:_userIdNum,
                //当前用户角色
                userRole:_userRole,
                //当前用户部门编号
                userdepartNum:_loginUser.departNum,
                //值班编号
                zbCode:$('.ZBBH').val()

            },
            success:function(result){

                _datasTable($('#table-list'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }
        })

    }

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
                            '" data-attr="' + result[i].period +
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

    //数字转化为中文月份
    function numChinese(num){

        if(num == '01'){

            return '一月'
        }else if( num == '02'){

            return '二月'
        }else if( num == '03'){

            return '三月'
        }else if( num == '04'){

            return '四月'
        }else if( num == '05'){

            return '五月'
        }else if( num == '06'){

            return '六月'
        }else if( num == '07'){

            return '七月'
        }else if( num == '08'){

            return '八月'
        }else if( num == '09'){

            return '九月'
        }else if( num == '10'){

            return '十月'
        }else if( num == '11'){

            return '十一月'
        }else if( num == '12'){

            return '十二月'
        }

    }

    //数字转化为中文周几
    function numWeek(num){

        if(num == 0){

            return '周日'

        }else if( num == 1){

            return '周一'

        }else if( num == 2 ){

            return '周二'

        }else if( num == 3 ){

            return '周三'

        }else if( num == 4 ){

            return '周四'

        }else if( num == 5 ){

            return '周五'

        }else if( num == 6 ){

            return '周六'

        }

    }

    //初始化
    function detailedInit(){

        //日历控件
        $('.datatimeblock').val('');

        //已选中的执行人员清空
        $('.on-duty-worker').empty();

        //班次选择
        $('#shift').val('');

        //已排班
        //$('#table-block').empty();

    }

    //数据绑定flag = true的时候。删除按钮显示，flag = false的时候，删除按钮不显示
    function bindData($this,flag){

        //样式
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        //获取编码
        var $thisCode = $this.parents('tr').children('.codeId').html();

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/ReturnOneWatch',
            data:{

                id:$thisCode

            },
            timeout:_theTimes,
            success:function(result){

                if(result){

                    //数据处理
                    //时间
                    var time = result.watchtime.split('-')[1];

                    $('#ADD-Modal').find('.datatimeblock').val(numChinese(time));

                    //表格清空
                    $('#worker-table tbody').empty();

                    //表格(根据姓名、id班组、时间、确定表格)

                    //表头----------------------------------------------------------------------------
                    //根据时间，确定arr
                    var arr = ['操作','姓名','工号'];

                    var day = new Date(result.watchtime.split('-')[0],time,0);

                    var daycount = day.getDate();

                    var lengths = daycount +1;

                    for(var i=1;i<lengths;i++ ){

                        var str = '';

                        str = moment(String(time) + '/' + String(i)).format('MM/DD');

                        var aa = moment().format('YYYY') + '-' + time + '-' + i;

                        str += '<br><span data-num="' + moment(aa).format('d') +
                            '">' + numWeek(moment(aa).format('d')) + '</span>';

                        arr.push( str );

                    }

                    //遍历arr生成表格头部
                    var headStr = '<tr>';

                    for(var i=0;i<arr.length;i++){

                        if(i == arr.length-1){

                            headStr += '<th>' + arr[i] +
                                '</th></tr>'

                        }else{

                            headStr += '<th>' + arr[i] +
                                '</th>'

                        }

                    }

                    $('#worker-table').children('thead').empty().append(headStr);

                    var bodyStr = '';

                    _readRens.length = 0;

                    _allData.length = 0;

                    if(result.wprList){

                        //表格数据绑定
                        for(var i=0;i<result.wprList.length;i++){

                            var workerObj = {};

                            workerObj.name = result.wprList[i].watchUserName;

                            workerObj.num = result.wprList[i].watchUser;

                            workerObj.bcNum = result.wprList[i].bccode;

                            workerObj.bcName = result.wprList[i].bcname;

                            workerObj.id = result.wprList[i].id;

                            _readRens.push(workerObj);

                            _allData.push(workerObj);

                            //首先确定周期
                            var period = '';

                            var BC = [];

                            var BC0 = [];

                            //首先根据班次code确定显示的具体值
                            for(var j=0;j<_BCData.length;j++){

                                if(result.wprList[i].bccode == _BCData[j].bccode){

                                    period = _BCData[j].period;

                                    BC = _BCData[j].banCiDetailList;

                                }
                            }

                            //确定arr所对应body的值
                            var dataArr = [];

                            if( period == 1 ){

                                //首先根据arr的值来确定
                                for(var z = 0;z<arr.length;z++){

                                    var dataAttr = '';

                                    if(arr[z].indexOf('data-num')>0){

                                        dataAttr = arr[z].split('=')[1].split('"')[1];

                                        if(dataAttr == 0){

                                            dataAttr = "7";

                                        }

                                    }else{

                                        dataAttr = '';

                                    }

                                    dataArr.push(dataAttr);


                                }

                            }else if(period == 2){

                                for(var z = 0;z<arr.length;z++){

                                    var dataAttr = '';

                                    dataAttr = arr[z].split('<br>')[0].split('/')[1];

                                    if( typeof dataAttr == 'string'){

                                        if(dataAttr.slice(0,1) == 0){

                                            dataAttr = dataAttr.slice(1,2);

                                        }else{

                                            dataAttr = arr[z].split('<br>')[0].split('/')[1];

                                        }

                                    }else{

                                        dataAttr = '';

                                    }

                                    dataArr.push(dataAttr);

                                }

                            }

                            //初始值首先确认为全'';
                            for(var z=0;z<dataArr.length;z++){

                                BC0.push('');

                            }

                            //确定BC0的值，有值不为''，无值为'';
                            for(var z=0;z<dataArr.length;z++){

                                for(var k=0;k<BC.length;k++){

                                    if(dataArr[z] == BC[k].selectedday){

                                        BC0[z] = BC[k].selectedday;

                                        break;

                                    }else{

                                        BC0[z] = ''

                                    }

                                }

                            }

                            //console.log(BC0);

                            bodyStr += '<tr>';

                            for(var z=0;z<BC0.length;z++){

                                var values = ''

                                if(BC0[z] == ''){

                                    if(z == 0){

                                        values = '<span class="data-option option-delete-worker btn default btn-xs green-stripe">删除</span>'

                                    }else if(z == 1){

                                        values = result.wprList[i].watchUserName;

                                    }else if(z == 2){

                                        values = result.wprList[i].watchUser;

                                    }else{

                                        values = ''

                                    }



                                }else{
                                    {

                                        values = result.wprList[i].bcname;
                                    }

                                }

                                bodyStr += '<td>' + values +
                                    '</td>'

                            }

                            bodyStr += '</tr>';

                        }

                    }

                    $('#worker-table').children('tbody').append(bodyStr);

                    if(flag){

                        //删除操作不显示
                        $('#worker-table thead').children('tr').children().eq(0).show();

                        var hidden = $('#worker-table tbody').children('tr')

                        for(var i=0;i<hidden.length;i++ ){

                            hidden.eq(i).children().eq(0).show();

                        }

                        //编辑的时候，先让日历操作为可操作
                        $('.datatimeblock').attr('disabled',false).removeClass('disabled-block');

                        $('.datatimeblock').parent('.input-blocked').removeClass('disabled-block');

                    }else{

                        //删除操作不显示
                        $('#worker-table thead').children('tr').children().eq(0).hide();

                        var hidden = $('#worker-table tbody').children('tr')

                        for(var i=0;i<hidden.length;i++ ){

                            hidden.eq(i).children().eq(0).hide();

                        }

                    }

                }


            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })

    }

    //表格绘制time:2017-12;
    function drawTable(time){

        //获取今年
        var year = '';

        var Monthnum = '';

        if(time){

            year = time.split('-')[0];

            Monthnum = time.split('-')[1];

        }else{

            year = moment().format('YYYY');

            Monthnum = chineseNum($('#ADD-Modal').find('.datatimeblock').val());

        }

        //首先确定当月有几天，
        var day = new Date(year,Monthnum,0);

        var daycount = day.getDate();

        //表格头部------------------------------------------------------------------

        var arr = ['操作','姓名','工号'];

        var lengths = daycount +1;

        for(var i=1;i<lengths;i++ ){

            var str = '';

            str = moment(String(Monthnum) + '/' + String(i)).format('MM/DD');

            var aa = moment().format('YYYY') + '-' + Monthnum + '-' + i;

            str += '<br><span data-num="' + moment(aa).format('d') +
                '">' + numWeek(moment(aa).format('d')) + '</span>';

            arr.push( str );

        }

        //遍历arr生成表格头部
        var headStr = '<tr>';

        drawThead(arr,headStr);

        //表格身体-------------------------------------------------------------------
        var bodyStr = '';

        drawTbody(arr,bodyStr,1,2);

        //添加删除按钮
        var option = $('#table-block tbody').children('tr');

        for(var i=0;i<option.length;i++){

            option.eq(i).children('td').eq(0).empty().append('<span class="data-option option-quiet-worker btn default btn-xs green-stripe">删除</span>')

        }

    }

    //绘制表头
    function drawThead(arr,headStr){

        for(var i=0;i<arr.length;i++){

            if(i == arr.length-1){

                headStr += '<th>' + arr[i] +
                    '</th></tr>'

            }else{

                headStr += '<th>' + arr[i] +
                    '</th>'

            }

        }

        $('#worker-table').children('thead').empty().append(headStr);

    }

    //绘制表的身体
    function drawTbody(arr,bodyStr,nameIndex,numIndex){

        //确定周期，根据周期不同，表格显示内容不同
        var  period = $('#shift').children('option:selected').attr('data-attr');

        //确定arr所对应body的值
        var dataArr = [];

        if( period == 1 ){

            //首先根据arr的值来确定
            for(var i = 0;i<arr.length;i++){

                var dataAttr = '';

                if(arr[i].indexOf('data-num')>0){

                    dataAttr = arr[i].split('=')[1].split('"')[1];

                    if(dataAttr == 0){

                        dataAttr = "7";

                    }

                }else{

                    dataAttr = '';

                }

                dataArr.push(dataAttr);


            }

        }else if(period == 2){

            for(var i = 0;i<arr.length;i++){

                var dataAttr = '';

                dataAttr = arr[i].split('<br>')[0].split('/')[1];

                if( typeof dataAttr == 'string'){

                    if(dataAttr.slice(0,1) == 0){

                        dataAttr = dataAttr.slice(1,2);

                    }else{

                        dataAttr = arr[i].split('<br>')[0].split('/')[1];

                    }

                }else{

                    dataAttr = '';

                }

                dataArr.push(dataAttr);

            }

        }

        //本班次的值
        var BC = [];

        //根据本班次的值，确定td显示值['',1,'']
        var BC0 = [];

        //初始值首先确认为全'';
        for(var i=0;i<dataArr.length;i++){

            BC0.push('');

        }

        //根据所有班次筛选当前选中的班次，确定BC的值
        for(var i=0;i<_BCData.length;i++){

            if(_BCData[i].bccode == $('#shift').val()){

                BC = _BCData[i].banCiDetailList;

            }

        }


        //确定BC0的值，有值不为''，无值为'';
        for(var i=0;i<dataArr.length;i++){

            for(var j=0;j<BC.length;j++){

                if(dataArr[i] == BC[j].selectedday){

                    BC0[i] = BC[j].selectedday;

                    break;

                }else{

                    BC0[i] = ''

                }

            }

        }

        //最终确定bodyStr

        for(var i=0;i<_currentRens.length;i++){

            bodyStr += '<tr>';

            for(var j=0;j<BC0.length;j++){

                var values = ''

                if(BC0[j] == ''){

                    if(j == nameIndex){

                        values = _currentRens[i].name;

                    }else if(j == numIndex){

                        values = _currentRens[i].num;

                    }else{

                        values = ''

                    }



                }else{
                    {

                        values = $('#shift').children('option:selected').html();
                    }

                }

                bodyStr += '<td>' + values +
                    '</td>'

            }

            bodyStr += '</tr>';

        }

        $('#worker-table').children('tbody').append(bodyStr);

    }

    //可操作
    function abledOption(){

        //日历插件可操作input-blocked
        $('.datatimeblock').attr('disabled',false).removeClass('disabled-block');

        $('.datatimeblock').parent('.input-blocked').removeClass('disabled-block');

        //选择人员
        $('#select-work').attr('disabled',false);

        //选择班次
        $('#shift').attr('disabled',false).removeClass('disabled-block');

        //确定按钮不能操作
        $('.QRButton').attr('disabled',false);

    }

    //不可操作
    function disabledOption(){

        //日历插件不可操作input-blocked
        $('.datatimeblock').attr('disabled',true).addClass('disabled-block');

        $('.datatimeblock').parent('.input-blocked').addClass('disabled-block');

        //选择人员
        $('#select-work').attr('disabled',true);

        //选择班次
        $('#shift').attr('disabled',true).addClass('disabled-block');

        //确定按钮不能操作
        $('.QRButton').attr('disabled',true);
    }

    //添加人员成功之后，更新当前_allData数据
    function allDate(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/ReturnOneWatch',
            data:{

                id:_thisID

            },
            timeout:_theTimes,
            success:function(result){

                if(result.wprList){

                    _allData.length = 0;

                    for(var i=0;i<result.wprList.length;i++){

                        var obj = {};

                        obj.name = result.wprList[i].watchUserName;

                        obj.num = result.wprList[i].watchUser;

                        obj.bcNum = result.wprList[i].bccode;

                        obj.bcName = result.wprList[i].bcname;

                        _allData.push(obj);

                    }

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })

    }
})