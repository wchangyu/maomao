//当前工单的工单号（由于工单的图片是公共的方法，所以要设置成全局变量）
var _gdCode = '';

$(function(){

    /*----------------------------------------------变量-------------------------------------------------*/

    //日历插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //获取车站
    _getProfession('YWGD/ywGDGetWxBanzuStation',$('#wxbz'),'wxBanzus','departNum','departName');

    //默认时间
    var now = moment().format('YYYY/MM/DD');

    var st = moment(now).subtract(6,'Months').format('YYYY/MM/DD');

    $('.condition-query').eq(0).find('.datatimeblock').eq(0).val(st);

    $('.condition-query').eq(0).find('.datatimeblock').eq(1).val(now);

    //查看详情Vue对象
    var detailVue = new Vue({

        el:'#myApp33',
        data:{

            //工单类型
            picked:0,
            //工单来源
            gdly:1,
            //任务级别
            rwlx:4,
            //报修电话
            telephone:'',
            //报修人信息
            person:'',
            //故障位置
            place:'',
            //车站
            section:'',
            //系统类型
            matter:'',
            //设备编码
            sbSelect:'',
            //设备名称
            sbMC:'',
            //维修班组
            sections:'',
            //发生时间
            otime:'',
            //故障描述
            remarks:''
        }

    })

    //当前工单的gdCircle
    var _gdCircle = '';

    //当前gdCode2
    var _gdCode2 = '';

    //存放当前工单的备件信息数组
    var _BJArr = [];

    //备件状态数组
    var _statusArr = [];

    BJStatus();

    //确定按钮走向
    var _trend;

    //当前备件状态
    var _status = '';

    //走向状态
    var _clTo = '';

    //记录获取详情操作是否完成
    var _getDetailIsComplete = false;

    //记录获取详情操作是否成功
    var _getDetailIsSuccess = false;

    //记录获取走向是否完成
    var _trendIsComplete = false;

    //记录获取走向是否成功
    var _trendIsSuccess = false;

    /*-----------------------------------------------表格初始化------------------------------------------*/

    //主表格
    var tableListCol = [

        {
            title:'工单号',
            data:'gdCode2',
            className:'gongdanId',
            render:function(data, type, row, meta){
                return '<span class="gongdanId" gdCode="' + row.gdCode +
                    '"' + "gdCircle=" + row.gdCircle +
                    '></span><a href="productionOrder_see.html?gdCode=' +  row.gdCode +  '&userID=' + _userIdNum + '&userName=' + _userIdName + '&gdZht=' + row.gdZht + '&gdCircle=' + row.gdCircle +
                    '"' +
                    'target="_blank">' + data + '</a>'
            }
        },
        {
            title:__names.group,
            data:'wxKeshi'
        },
        {
            title:__names.department,
            data:'bxKeshi'
        },
        {
            title:'维修人',
            data:'wxUserNames'
        },
        {
            title:'关闭时间',
            data:'guanbiShij'
        },
        {
            title:'超时',
            data:'exceedTimeZhix'
        },
        {
            title: '操作',
            "targets": -1,
            "data": null,
            "className": 'noprint',
            "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
            "<span class='data-option option-beijian btn default btn-xs green-stripe'>返修件管理</span>"
        }

    ];

    _tableInit($('#table-list'),tableListCol,1,true,'','');

    _WxBanzuStationData(conditionSelect);

    //执行人员表格
    var personTable1Col = [
        {
            class:'checkeds',
            "targets": -1,
            "data": 'wxRQZ',
            render:function(data, type, row, meta){
                if(data == 1){
                    return "<div class='checker'><span class='checked'><input type='checkbox'></span></div>"
                }else{
                    return "<div class='checker'><span><input type='checkbox'></span></div>"
                }
            }
        },
        {
            title:'执行人员',
            data:'wxRName'
        },
        {
            title:'工号',
            data:'wxRen'
        },
        {
            title:'联系电话',
            data:'wxRDh'
        }
    ]

    _tableInit($('#personTable1'),personTable1Col,2,'','','',true,'');

    //备件表格
    var personTables1Col = [
        {
            title:'备件编码',
            data:'wxCl'
        },
        {
            title:'备件名称',
            data:'wxClName'
        },
        {
            title:'分类',
            data:'cateName'
        },
        {
            title:'规格',
            data:'size'
        },
        {
            title:'数量',
            data:'clShul'
        }
    ];

    _tableInit($('#personTables1'),personTables1Col,2,'','','',true,'');

    //备件表格
    var personTables11Col = [
        {
            title:'备件编码',
            data:'itemNum',
            className:'fxNum',
            render:function(data, type, full, meta){
                return '<span data-code="' + full.fxCode +
                    '">' + data +
                    '</span>'
            }
        },
        {
            title:'备件名称',
            data:'itemName'
        },
        {
            title:'序列号',
            data:'sn',
            className:'inputSn',
            render:function(data, type, full, meta){

                return '<input value="' + data +
                    '">'

            }

        },
        {
            title:'快递信息',
            data:'fxKdinfo',
            className:'expressInfo',
            render:function(data, type, full, meta){

                return '<input value="' + data +
                    '">'

            }
        },
        {
            title:'故障原因',
            data:'fxReason',
            className:'CauseOfFailure',
            render:function(data, type, full, meta){

                return '<input value="' + data +
                    '">'

            }
        },
        {
            title:'备件状态',
            data:'fxStatusName',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.fxStatus +
                    '">' + data +
                    '</span>'

            }
        }
    ];

    _tableInit($('#personTables11'),personTables11Col,2,'','','',true);

    /*-----------------------------------------------按钮事件-------------------------------------------*/

    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //【重置】
    $('.resites').click(function(){

        //input清空
        $('.condition-query').eq(0).find('input').val('');

        //时间重置
        $('.condition-query').eq(0).find('.datatimeblock').eq(0).val(st);

        $('.condition-query').eq(0).find('.datatimeblock').eq(1).val(now);

        //select
        $('.condition-query').eq(0).find('select').val('');

    })

    //表格【查看】
    $('#table-list').on('click','.option-see',function(){

        //样式
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //初始化
        detailInit();

        //绑定数据
        //确定工单号
        _gdCode = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcode');

        _gdCircle = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcircle');

        bindData();

        //模态框
        _moTaiKuang($('#see-myModal'),'详细信息',true,'','','','');


        //是否可操作
        disabledOption();

        //处理记录
        logInformation();

    })

    //表格【返修件管理】
    $('#table-list').on('click','.option-beijian',function(){

        //样式
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //初始化
        CLInit();

        //确定工单号
        _gdCode = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcode');

        _gdCode2 = $(this).parents('tr').children('.gongdanId').find('a').html();

        _gdCircle = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcircle');

        //赋值
        detailFun();
        //模态框
        _moTaiKuang($('#CL-Modal'),'备件信息','','','','确定');

        //调接口(决定clTo)
        colToFun();


    });

    //备件确定按钮不可操作
    $('#CL-Modal').find('.btn-primary').attr('disabled',true);

    //返修件管理【确定】按钮
    $('#CL-Modal').on('click','.btn-primary', function () {

        var trs = $('#personTables11 tbody').children('tr');

        for(var i=0;i<_BJArr.length;i++){

            for(var j=0;j<trs.length;j++){

                if(_BJArr[i].fxCode == trs.eq(j).children('td').eq(0).children('span').attr('data-code')){

                    //序列号
                    _BJArr[i].sn = trs.eq(j).children('td').eq(2).children().val();

                    //返修原因
                    _BJArr[i].fxReason = trs.eq(j).children('td').eq(4).children().val();

                    //返修快递信息
                    _BJArr[i].fxKdinfo = trs.eq(j).children('td').eq(3).children().val();

                    //返修状态
                    var status = trs.eq(j).children('td').eq(5).html();

                    for(var k=0;k<_statusArr.length;k++){

                        if(_statusArr[k].fxStatus == status){

                            _BJArr[i].fxStatus = _statusArr[k].clTo;

                        }

                    }

                }

            }

        }

        var arr = [];

        for(var i=0;i<_BJArr.length;i++){

            var obj = {};
            //返修件编码
            obj.fxCode = _BJArr[i].fxCode;
            //备件编码
            obj.itemNum = _BJArr[i].itemNum;
            //备件名称
            obj.itemName = _BJArr[i].itemName;
            //序列号
            obj.sn = _BJArr[i].sn;
            //返修原因
            obj.fxReason = _BJArr[i].fxReason;
            //返修快递信息
            obj.fxKdinfo = _BJArr[i].fxKdinfo;
            //返修状态
            obj.fxStatus = _clTo;

            arr.push(obj);

        }

        var prm = {
            //返修备件的物品
            fxItems:arr,
            //用户id
            userID:_userIdNum,
            //用户姓名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //当前用户的部门
            b_DepartNum:_loginUser.departNum
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXFah',
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

                    _moTaiKuang($('#myModal2'),'提示',true,'istap','操作成功！','');

                    $('#CL-Modal').modal('hide');

                    conditionSelect();

                }else{

                    _moTaiKuang($('#myModal2'),'提示',true,'istap','操作失败！','');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    })


    /*-----------------------------------------------其他方法-------------------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {
            "gdCode2":$('#global_filter').val(),
            "gdSt":st,
            "gdEt":moment(now).add(1,'d').format('YYYY/MM/DD'),
            "bxKeshi":$('#wxbz').val(),
            "userID":_userIdNum,
            "userName":_userIdName

        };

        var wbzArr = [];

        if(_AisWBZ){

            for(var i=0;i<_ABZArr.length;i++){

                wbzArr.push(_ABZArr[i].departNum);

            }

            prm.wxKeshis = _ABZArr;

        }else if(_AisBZ){

            prm.wxKeshi = _maintenanceTeam;

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGDGetFX',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                _datasTable($('#table-list'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    }

    //查看详情初始化
    function detailInit(){

        //工单类型
        detailVue.picked = 0;
        //工单来源
        detailVue.gdly = 1;
        //任务级别
        detailVue.rwlx = 4;
        //报修电话
        detailVue.telephone = '';
        //报修人信息
        detailVue.person = '';
        //故障位置
        detailVue.place = '';
        //车站
        detailVue.section = '';
        //系统类型
        detailVue.matter = '';
        //设备编码
        detailVue.sbSelect = '';
        //设备名称
        detailVue.sbMC = '';
        //维修班组
        detailVue.sections = '';
        //发生时间
        detailVue.otime = '';
        //故障描述
        detailVue.remarks = '';

        //单选按钮初始化
        $('#myApp33').find('.inpus').parent('span').removeClass('checked');

        //默认普通选中
        $('#twos').parent('span').addClass('checked');

        //表格初始化
        var arr = [];

        //执行人员表格
        _datasTable($('#personTable1'),arr);

        //维修备件
        _datasTable($('#personTables1'),arr);

        //处理记录
        $('.deal-with-list').empty();

    }

    //详情不可操作
    function disabledOption(){

        $('#myApp33').find('input,select,textarea').attr('disabled',true).addClass('disabled-block');

    }

    //详情绑定数组
    function bindData(){

        var prm = {
            'gdCode':_gdCode,
            'userID':_userIdNum,
            'userName':_userIdName,
            'gdCircle':_gdCircle
        };

        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:prm,
            beforeSend:function(){
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                //赋值
                //工单类型
                detailVue.picked = result.gdJJ;
                //工单来源
                detailVue.gdly = result.gdCodeSrc;
                //任务级别
                detailVue.rwlx = result.gdLeixing;
                //报修电话
                detailVue.telephone = result.bxDianhua;
                //报修人信息
                detailVue.person = result.bxRen;
                //故障位置
                detailVue.place = result.wxDidian;
                //车站
                detailVue.section = result.bxKeshi;
                //系统类型
                detailVue.matter = result.wxShiX;
                //设备编码
                detailVue.sbSelect = result.wxShebei;
                //设备名称
                detailVue.sbMC = result.dName;
                //维修班组
                detailVue.sections = result.wxKeshi;
                //发生时间
                detailVue.otime = result.gdFsShij;
                //故障描述
                detailVue.remarks = result.bxBeizhu;

                //当前工单有几个图
                _imgNum = result.hasImage;

                $('#myApp33').find('.inpus').parent('span').removeClass('checked');

                //单选按钮
                if(detailVue.picked == 0){

                    $('#twos').parent('span').addClass('checked');

                }else if(  detailVue.picked == 1 ){

                    $('#ones').parent('span').addClass('checked');

                }

                //执行人员表格
                _datasTable($('#personTable1'),result.wxRens);

                //维修备件
                _datasTable($('#personTables1'),result.wxCls);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //备件初始化
    function CLInit(){

        var arr = [];

        //备件表格初始化
        _datasTable($('#personTables11'),arr);

        //input,text初始化
        $('#CL-Modal').find('input').val('');

        $('#CL-Modal').find('textarea').val('');

        //备件图片初始化
        $('.bjImg').html('没有备件图片');

        //处理记录
        $('#CL-Modal').find('.deal-with-list').empty();
    }

    //获取日志信息（备件logType始终传2）
    function logInformation(){

        var gdLogQPrm = {

            "gdCode": _gdCode,
            "logType": 0,
            "userID": _userIdNum,
            "userName": _userIdName

        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywDGGetLog',
            data:gdLogQPrm,
            success:function(result){

                var str = '';

                for(var i =0;i<result.length;i++){

                    str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' +  result[i].logContent + '</li>'

                }

                $('.deal-with-list').empty().append(str).show();
            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);
            }
        })
    }

    //获取当前备件状态
    function BJStatus(){

        var prm = {
            "fxCode": "",
            "userID": _userIdNum,
            "userName": _userIdName,
            "b_UserRole": _userRole,
            "b_DepartNum": _loginUser.departNum
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXGetFxStatus',
            data:prm,
            beforeSend:function(){
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                console.log(result);

                _statusArr.length = 0;

                for(var i=0;i<result.statuses.length;i++){

                    _statusArr.push(result.statuses[i]);

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //决定colTo走向的接口
    function colToFun(){

        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywDGGetCK2',
            data:{

                //工单号
                gdCode:_gdCode,
                //用户id
                userID:_userIdNum,
                //用户名
                userName:_userIdNum
            },
            timeout:_theTimes,
            success:function(result){

                _trendIsComplete = true;

                _trendIsSuccess = true;

                _trend = result;

                DTcallBackFun();
            },
            error:function(jqXHR, textStatus, errorThrown){

                _trendIsComplete = true;

                _trendIsSuccess = false;

                console.log(jqXHR.responseText);
            }

        })

    }

    //获取详情
    function detailFun(){

        var prm = {
            'gdCode2':_gdCode2,
            'userID':_userIdNum,
            'userName':_userIdName,
            'gdCircle':_gdCircle
        };

        $.ajax({

            type:'post',
            url:_urls + 'YWFX/ywFXGetGDItem',
            data:prm,
            beforeSend:function(){
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                _getDetailIsComplete = true;

                _getDetailIsSuccess = true;

                //赋值
                _BJArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _BJArr.push(result[i]);

                }

                //执行人员表格
                _datasTable($('#personTables11'),result);

                //备件图片有几个
                _imgBJNum = result.hasBjImage;

                //直接将备件图片展示出来

                if(_imgBJNum>0){

                    var imgStr = '';

                    for(var i=0;i<_imgBJNum;i++){

                        imgStr += '<img class="bjImgList" src="' + _replaceIP(_urlImg,_urls) + '?gdcode=' + _gdCode + '&no=1&imageFlag=1' +
                            '">';

                    }

                    $('.bjImg').empty().append(imgStr).show();

                }else{

                    $('.bjImg').html('没有备件图片');

                }

                //获取备件状态
                _status = result[0].fxStatus;



                DTcallBackFun();

            },
            error:function(jqXHR, textStatus, errorThrown){

                _getDetailIsComplete = true;

                _getDetailIsSuccess = false;

                console.log(jqXHR.responseText);
            }
        })

    }

    //详情，走向都完成的回调函数
    function DTcallBackFun(){

        if( _trendIsComplete && _getDetailIsComplete ){

            if( _trendIsSuccess && _getDetailIsSuccess ){

                $('#CL-Modal').find('.btn-primary').attr('disabled',false);

                //确定clTo数组

                for(var i=0;i<_statusArr.length;i++){

                    if(_status == _statusArr[i].fxStatus){

                        if(_trend == ''){

                            _clTo = _statusArr[i].clTo.split(',')[0];

                        }else{

                            _clTo = _statusArr[i].clTo.split(',')[1];

                        }


                    }

                }


            }

        }

    }
})