//工单号
var _gdCode = '';

$(function(){

    /*----------------------------------------------时间插件---------------------------------------------*/

    _timeYMDComponentsFun($('.condition-query').eq(0).find('.datatimeblock'));

    var now = moment().format('YYYY/MM/DD');

    var st = moment().subtract(6,'months').format('YYYY/MM/DD');

    $('.min').val(st);

    $('.max').val(now);

    /*----------------------------------------------变量------------------------------------------------*/

    //条件查询车站
    addStationDom($('#bumen').parent());

    //查看vue
    var detailVue = new Vue({

        el:'#myApp33',
        data:{

            //工单类型,
            picked:'',
            //工单来源
            gdly:'',
            //任务级别,
            rwlx:'',
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
            sections:''
        }

    });

    //评价
    var evaluateVue = new Vue({
        el:'#pingjia',
        data:{
            //满意度
            pickeds:'5',
            //评价意见
            beizhu:'',
            //报修电话
            baoxiudianhua:'',
            //车站
            baoxiubumen:'',
            //报修人姓名
            baoxiurenxingming:'',
            //故障位置
            weixiudidian:'',
            //维修班组
            weixiubumen:'',
            //备注
            baoxiubeizhu:'',
            //维修内容
            wxbeizhu:''
        },
        methods:{
            radioss:function(){
                $('.inpus').click(function(a){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            }
        }
    })

    //重发值
    var _gdCircle = '';

    //状态值
    var _gdStatus = '';

    //评价执行是否成功
    var _pjIsSuccess = false;

    //关单是否成功
    var _gdIsSuccess = false;

    /*----------------------------------------------表格初始化-------------------------------------------*/

    var col = [

        {
            title:'工单号',
            data:'gdCode2',
            className:'gongdanId',
            render: function (data, type, row, meta) {
                return '<span gdCode="' + row.gdCode +
                    '" gdCircle="' + row.gdCircle +
                    '" gdZtz="' + row.gdZht +
                    '">' + data +
                    '</span>'
            }
        },
        {
            title:'工单类型',
            data:'gdJJ',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '普通'
                }if(data == 1){
                    return '快速'
                }
            }
        },
        {
            title:'工单状态',
            data:'gdZht',
            className:'gongdanZt',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '待下发'
                }if(data == 2){
                    return '待分派'
                }if(data == 3){
                    return '待执行'
                }if(data == 4){
                    return '执行中'
                }if(data == 5){
                    return '等待资源'
                }if(data == 6){
                    return '待关单'
                }if(data == 7){
                    return '任务关闭'
                }if(data == 999){
                    return '任务取消'
                }
            }
        },
        {
            title:__names.department,
            data:'bxKeshi'
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'登记时间',
            data:'gdShij'
        },
        {
            class:'pingjia noprint',
            title:'操作',
            "targets": -1,
            "data": null, //tablePingjia
            "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span><span class='data-option tablePingjia btn default btn-xs purple'> 关闭</span>"

        }

    ];

    //导出数组
    var exportArr = [0,1,2,3,4,5];

    _tableInit($('#scrap-datatables'),col,1,true,'','','',exportArr);

    //页面默认加载
    _WxBanzuStationData(bzList);

    //执行人员
    var personCol = [

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

    ];

    _tableInit($('#personTable1'),personCol,2,false,'','',true,'');

    //维修备件
    var goodsCol = [

        {
            title:'备件编码',
            data:'wxCl'
        },
        {
            title:'备件名称',
            data:'wxClName'
        },
        {
            title:'规格型号',
            data:'size'
        },
        {
            title:'数量',
            data:'clShul'
        },
        {
            title:'单位',
            data:'unitName'
        }

    ];

    _tableInit($('#personTables1'),goodsCol,2,false,'','',true,'');

    /*----------------------------------------------按钮事件---------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //重置
    $('.resites').click(function(){

        //input清空
        $('.condition-query').eq(0).find('input').val('');

        //时间初始化
        $('.condition-query').eq(0).find('.min').val(st);

        $('.condition-query').eq(0).find('.max').val(now);

        //维修班组
        $('.condition-query').eq(0).find('select').val('');

        //工单状态
        $('#gdzt').val(1);

    })

    //表格【查看】
    $('#scrap-datatables tbody').on('click','.option-see',function(){

        //初始化
        detailInit();

        //赋值
        bindData($(this));

        //模态框
        _moTaiKuang($('#myModal'), '查看', false, '' ,'', '');

        //是否可操作
        $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('textarea').attr('disabled',true).addClass('disabled-block');

        $('#ones').parents('.input-blockeds').addClass('disabled-block');

        //处理过程
        _logInformation($('.deal-with-list'));
    })

    //表格【关单】
    $('#scrap-datatables tbody').on('click','.tablePingjia',function(){

        //初始化
        evaluateInit();

        //赋值
        bindData($(this));

        //模态框
        _moTaiKuang($('#myModal1'), '关闭工单', false, '' ,'', '关闭工单');

        //是否可操作(页面已写死)；

    })

    //【关单确定按钮】
    $('#myModal1').on('click','.pingjiaButton',function(){

        //发送评价之后的数据
        var gdInfo = {
            //工单号
            'gdCode':_gdCode,
            //评价备注
            'pjBz': evaluateVue.beizhu,
            //满意度
            'pingjia':evaluateVue.pickeds,
            //当前用户id
            'userID':_userIdNum,
            //当前用户名
            'userName':_userIdName
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDUptPingjia',
            data:gdInfo,
            success:function(result){
                if(result == 99){

                    _pjIsSuccess = true;

                    getGongDan();

                }else{

                    _pjIsSuccess = false;

                 _moTaiKuang($('#myModal2'),'提示',true,'istap','评价失败!','');

                }
            },
            error:function(jqXHR, textStatus, errorThrown){

                _moTaiKuang($('#myModal2'),'提示',true,'istap','请求失败!','');

                console.log(jqXHR.responseText);
            }
        })

    })

    /*-----------------------------------------------其他方法--------------------------------------------*/

    //条件查询
    function conditionSelect(){

        //开始时间
        var st = $('.condition-query').eq(0).find('.min').val() + ' 00:00:00';
        //结束时间
        var et = moment($('.condition-query').eq(0).find('.max').val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        //状态
        var ztz = $('#gdzt').val();
        //确定车站
        var values = '';

        var flag = $('#bumen').parent('div').next().find('span').attr('values');

        if( typeof flag == 'undefined' ){

            values = '';

        }else{

            values = flag;

        }

        //维修班组（通过获取维修班组中的值来确定wxKeshi）；

        var wxArr = $('#wxbz').children('option');

        var bzArr = [];

        for(var i=1;i<wxArr.length;i++){

            bzArr.push(wxArr.eq(i).val())

        }

        var prm = {
            "gdCode2":$('#global_filter').val(),
            "gdSt":st,
            "gdEt":et,
            "bxKeshi":values,
            "gdZht":6,
            "userID":_userIdNum,
            "userName":_userIdName
        };
        if(ztz==2)
        {
            prm = {
                "gdCode2":$('#global_filter').val(),
                "gdSt":st,
                "gdEt":et,
                "bxKeshi":values,
                "gdZht":0,
                "gdZhts": [
                    1,2,3,4,5,6
                ],
                "userID":_userIdNum,
                "userName":_userIdName
            };
        }

        if(bzArr.length == 1){

            prm.wxKeshi = bzArr[0];

        }else if(bzArr.length >1){

            prm.wxKeshis = bzArr;

        }

        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDGetDJ',
            data:prm,
            success:function(result){

                _datasTable($("#scrap-datatables"),result)

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }
        })
    }

    //维修班组
    function bzList(){

        //首先判断是在车间还是在维修班组中

        var str  = '<option value="">请选择</option>';

        //如果在维修班组中
        if(_AisWBZ){

            for(var i=0;i<_AWBZArr.length;i++){

                for(var j=0;j<_AWBZArr[i].wxBanzus.length;j++){

                    str += '<option value="' + _AWBZArr[i].wxBanzus[j].departNum + '">' + _AWBZArr[i].wxBanzus[j].departName + '</option>'

                }

            }

        }else if(_AisBZ){

            for(var i=0;i<_ABZArr.length;i++){

                str += '<option value="' + _ABZArr[i].departNum + '">' + _ABZArr[i].departName + '</option>'

            }

        }

        $('#wxbz').empty().append(str);

        //条件查询
        conditionSelect();

    }

    //查看初始化
    function detailInit(){

        //工单类型,
        detailVue.picked = '';
        //工单来源
        detailVue.gdly = '';
        //任务级别,
        detailVue.rwlx = '';
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
        $('#myApp33').find('.otime').val('');
        //故障描述
        $('#myApp33').find('textarea').val('');
        //表格初始化
        var arr = [];
        //执行人员
        _datasTable($('#personTable1'),arr);
        //维修备件
        _datasTable($('#personTables1'),arr);
        //查看图片消失
        $('.showImage').hide();
        //单选按钮初始化
        $('#myApp33').find('.inpus').parent().removeClass('checked');

    }

    //绑定数据
    function bindData($this){

        //样式
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        //赋值
        _gdCode = $this.parents('tr').find('.gongdanId').children().attr('gdcode');

        _gdCircle = $this.parents('tr').find('.gongdanId').children().attr('gdcircle');

        _gdStatus = $this.parents('tr').find('.gongdanId').children().attr('gdztz');

        var prm = {
            //工单号
            'gdCode':_gdCode,
            //状态值
            'gdZht':_gdStatus,
            //用户id
            'userID':_userIdNum,
            //用户名
            'userName':_userIdName,
            //重发值
            'gdCircle':_gdCircle

        }

        //获取详情
        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result){

                    if($this.attr('class').indexOf('option-see')>=0){

                        //工单类型,
                        detailVue.picked = result.gdJJ;
                        //工单来源
                        detailVue.gdly = result.gdCodeSrc;
                        //任务级别,
                        detailVue.rwlx = result.gdLeixing;
                        //报修电话
                        detailVue.telephone = result.bxDianhua;
                        //报修人信息
                        detailVue.person = result.bxRen;
                        //故障位置
                        detailVue.place = result.wxDidian;
                        //车站
                        detailVue.section = result.bxKeshiNum;
                        //系统类型
                        detailVue.matter = result.wxShiX;
                        //设备编码
                        detailVue.sbSelect = result.wxShebei;
                        //设备名称
                        detailVue.sbMC = result.dName;
                        //维修班组
                        detailVue.sections = result.wxKeshi;
                        //图片
                        _imgNum = result.hasImage;
                        //发生时间
                        $('#myApp33').find('.otime').val(result.gdFsShij);
                        //故障描述
                        $('#myApp33').find('textarea').val(result.bxBeizhu);
                        //表格初始化
                        //执行人员
                        _datasTable($('#personTable1'),result.wxRens);
                        //维修备件
                        _datasTable($('#personTables1'),result.wxCls);
                        //单选按钮
                        if(result.gdJJ == 0){

                            $('#twos').parent().addClass('checked');

                        }else if(result.gdJJ == 1){

                            $('#ones').parent().addClass('checked');

                        }

                    }else{

                        //评价数据绑定
                        //报修电话
                        evaluateVue.baoxiudianhua = result.bxDianhua;
                        //车站
                        evaluateVue.baoxiubumen = result.bxKeshi;
                        //报修人姓名
                        evaluateVue.baoxiurenxingming = result.bxRen;
                        //故障位置
                        evaluateVue.weixiudidian = result.wxDidian;
                        //维修班组
                        evaluateVue.weixiubumen = result.wxKeshi;
                        //备注
                        evaluateVue.baoxiubeizhu = result.bxBeizhu;
                        //维修内容
                        evaluateVue.wxbeizhu = result.wxBeizhu;

                    }



                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //清除loadding
                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

                }

            }

        })

    }

    //评价初始化
    function evaluateInit(){

        //满意度
        evaluateVue.pickeds = '5';
        //评价意见
        evaluateVue.beizhu = '';
        //报修电话
        evaluateVue.baoxiudianhua = '';
        //车站
        evaluateVue.baoxiubumen = '';
        //报修人姓名
        evaluateVue.baoxiurenxingming = '';
        //故障位置
        evaluateVue.weixiudidian = '';
        //维修班组
        evaluateVue.weixiubumen = '';
        //备注
        evaluateVue.baoxiubeizhu = '';
        //维修内容
        evaluateVue.wxbeizhu = '';
        //单选按钮
        $('#pingjia').find('.inpus').parent().removeClass('checked');
        //默认选中
        $('#henmanyi').parent().addClass('checked');

    }

    //状态转换
    function getGongDan(){

        var gdInfo = {
            //工单号
            'gdCode':_gdCode,
            //状态值
            'gdZht':7,
            //用户id
            'userID':_userIdNum,
            //用户名
            'userName':_userIdName,
            //hasFX (integer, optional): 是否有返修 ,
            'hasFX':1
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDUptZht',
            data:gdInfo,
            timeout:_theTimes,
            success:function(result){

                if(result == 99){

                    _gdIsSuccess = true;

                }else {

                    _gdIsSuccess = false;

                }

                var str = '';

                if(_pjIsSuccess){

                    str += '评价成功!'

                }else{

                    str += '评价失败!'

                }
                if(_gdIsSuccess){

                    str += '关单成功！'

                }else{

                    str += '关单失败！'

                }

                _moTaiKuang($('#myModal2'),'提示','flag','istap',str,'');

                if( _pjIsSuccess && _gdIsSuccess ){

                    $('#myModal1').modal('hide');

                    conditionSelect();

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                _moTaiKuang($('#myModal2'),'提示','istap','关单失败!','');

                console.log(jqXHR.responseText);
            }
        })
    }

})