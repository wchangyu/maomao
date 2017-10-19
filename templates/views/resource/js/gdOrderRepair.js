$(function(){
    /*---------------------------------------------时间---------------------------------------------------*/

    //时间设置
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间（7天）
    var et = moment().format('YYYY/MM/DD');

    var st =moment().subtract(7,'d').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(st);

    $('.datatimeblock').eq(1).val(et);

    /*--------------------------------------------变量----------------------------------------------------*/

    //登记vue变量
    var gdObj = new Vue({
        el:'#myApp33',
        data:{
            'bxtel':'',
            'bxkesh':'',
            'bxren':'',
            'pointer':'',
            'gztime':'',
            'sbtype':'',
            'sbnum':'',
            'sbname':'',
            'azplace':'',
            'gzplace':'',
            'wxshx':'1'
        },
        methods:{
            time:function(){
                _timeHMSComponentsFun($('.datatimeblock').eq(2),1);
            },
            timeblur:function(){
                setTimeout(function(){
                    $('.datepicker').hide();
                },200)
            },
        }
    });

    //验证vue非空（空格不算）
    Vue.validator('isEmpty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val = val.replace(/^\s+|\s+$/g, '');
        return /[^.\s]{1,500}$/.test(val)
    });

    //存放报修科室
    var _allBXArr = [];

    //存放系统类型
    var _allXTArr = [];

    //维修事项（车站）
    ajaxFun('YWDev/ywDMGetDDs', _allBXArr, $('#bxkesh'), 'ddName', 'ddNum');

    //系统类型
    ajaxFun('YWDev/ywDMGetDSs', _allXTArr, $('#sbtype'), 'dsName', 'dsNum');


    /*---------------------------------------------表格初始化----------------------------------------------*/

    //未接单表格
    var missedListCol = [
        {
            title:'工单号',
            data:''
        },
        {
            title:'报修电话',
            data:''
        },
        {
            title:'报修科室',
            data:''
        },
        {
            title:'报修人',
            data:''
        },
        {
            title:'楼栋',
            data:''
        },
        {
            title:'故障发生时间',
            data:''
        },
        {
            title:'故障位置',
            data:''
        },
        {
            title:'故障描述',
            data:''
        }
    ];

    _tableInit($('#missed-list'),missedListCol,'2','','','');

    //执行中表格
    var inExecutionCol = [
        {
            title:'工单号',
            data:''
        },
        {
            title:'工单类型',
            data:''
        },
        {
            title:'楼栋',
            data:''
        },
        {
            title:'设备类型',
            data:''
        },
        {
            title:'故障位置',
            data:''
        },
        {
            title:'故障描述',
            data:''
        },
        {
            title:'登记时间',
            data:''
        },
        {
            title:'受理时间',
            data:''
        },
        {
            title:'接单时间',
            data:''
        },
        {
            title:'维修科室',
            data:''
        },
        {
            title:'处理人',
            data:''
        },
        {
            title:'联系电话',
            data:''
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
        }
    ];

    _tableInit($('#in-execution'),inExecutionCol,'2','','','');

    //待关单表格
    var waitingListCol = [
        {
            title:'工单号',
            data:''
        },
        {
            title:'工单类型',
            data:''
        },
        {
            title:'楼栋',
            data:''
        },
        {
            title:'设备类型',
            data:''
        },
        {
            title:'故障位置',
            data:''
        },
        {
            title:'故障描述',
            data:''
        },
        {
            title:'登记时间',
            data:''
        },
        {
            title:'受理时间',
            data:''
        },
        {
            title:'接单时间',
            data:''
        },
        {
            title:'完工申请时间',
            data:''
        },
        {
            title:'维修科室',
            data:''
        },
        {
            title:'处理人',
            data:''
        },
        {
            title:'联系电话',
            data:''
        },
        {
            title:'验收人',
            data:''
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>关单</span>"
        }
    ];

    _tableInit($('#waiting-list'),waitingListCol,'2','','','');

    //已关单
    var closingListCol = [
        {
            title:'工单号',
            data:''
        },
        {
            title:'工单类型',
            data:''
        },
        {
            title:'楼栋',
            data:''
        },
        {
            title:'设备类型',
            data:''
        },
        {
            title:'故障位置',
            data:''
        },
        {
            title:'故障描述',
            data:''
        },
        {
            title:'登记时间',
            data:''
        },
        {
            title:'受理时间',
            data:''
        },
        {
            title:'接单时间',
            data:''
        },
        {
            title:'完工申请时间',
            data:''
        },
        {
            title:'关单时间',
            data:''
        },
        {
            title:'维修科室',
            data:''
        },
        {
            title:'处理人',
            data:''
        },
        {
            title:'联系电话',
            data:''
        },
        {
            title:'验收人',
            data:''
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
        }
    ];

    _tableInit($('#closing-list'),closingListCol,'2','','','');

    //数据加载
    conditionSelect();

    /*-------------------------------------------------按钮事件-----------------------------------------*/

    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tabDiv = $(this).parents('.table-title').next().children('div');
        tabDiv.addClass('hide-block');
        tabDiv.eq($(this).index()).removeClass('hide-block');
    });

    //登记按钮
    $('.creatButton').click(function(){

        //显示模态框
        _moTaiKuang($('#myModal'), '登记', '', '' ,'', '登记');


        //增加登记类
        $('#myModal').find('.btn-primary').removeClass('bianji').addClass('dengji');

        //初始化
        dataInit();
    });

    //重置按钮
    $('.resites').click(function(){

        //input清空
        $('.filterInput').val('');

        //时间重置
        $('.datatimeblock').eq(0).val(st);

        $('.datatimeblock').eq(1).val(et);
    })

    //模态框加载完成后设置发生时间
    $('#myModal').on('shown.bs.modal', function () {
        //让日历插件首先失去焦点
        $('.datatimeblock').eq(2).focus();

        //发生时间默认
        var aa = moment().format('YYYY-MM-DD HH:mm:ss');

        $('.datatimeblock').eq(2).val(aa);

        if($('.datetimepicker:visible')){
            $('.datetimepicker').hide();
        }

        $('.datatimeblock').eq(2).blur();
    });

    //故障原因选择
    $('#gzDesc').change(function(){
        var aa = $('#gzDesc').val();
        $('.gzDesc').val(aa);
        //$('.gzDesc').val($('#gzDesc').val());
    })


    //登记确定按钮
    $('#myModal')
        .on('click','.dengji',function(){
            //验证非空
            if(gdObj.bxtel == ''|| gdObj.bxkesh == '' || gdObj.bxren == '' || gdObj.gzplace == ''){
                if(gdObj.bxkesh == ''){
                    $('.error1').show();
                }else{
                    $('.error1').hide();
                }
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');
            }else{
                var prm = {

                    'bxDianhua':gdObj.bxtel,
                    'bxKeshi':$('#bxkesh').children('option:selected').html(),
                    'bxKeshiNum':gdObj.bxkesh,
                    'bxRen':gdObj.bxren,
                    //'':gdObj.pointer,
                    'gdFsShij':$('.datatimeblock').eq(2).val(),
                    'wxShiX':$('#sbtype').children('option:selected').html(),
                    'wxShiXNum':gdObj.sbtype,
                    'wxShebei':gdObj.sbnum,
                    'dName':gdObj.sbname,
                    'installAddress':gdObj.azplace,
                    'wxDidian':gdObj.gzplace,
                    'bxBeizhu':$('.gzDesc').val(),
                    'userID': _userIdNum,
                    'userName': _userIdName,
                    'b_UserRole':_userRole

                }
                $.ajax({
                    type:'post',
                    url:_urls + 'YWGD/ywGDCreDJ',
                    timeout:_theTimes,
                    data:prm,
                    success:function(result){
                        if (result == 99) {

                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap','添加成功', '');

                            $('#myModal').modal('hide');

                            //刷新表格
                            conditionSelect();

                        } else {

                            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap','添加失败', '');

                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.responseText);
                    }
                })
            }
        })

    /*------------------------------------------------其他方法--------------------------------------------*/
    //登记项初始化
    function dataInit(){
        gdObj.bxtel = '';
        gdObj.bxkesh = '';
        gdObj.bxren = '';
        gdObj.pointer = '';
        gdObj.gztime = '';
        gdObj.sbtype = '';
        gdObj.sbnum = '';
        gdObj.sbname = '';
        gdObj.azplace = '';
        gdObj.gzplace = '';
        gdObj.wxshX='1';
        $('.gzDesc').val('');
    }

    //车站数据(报修科室)
    function ajaxFun(url, allArr, select, text, num) {
        var prm = {
            'userID': _userIdNum
        }
        prm[text] = '';
        $.ajax({
            type: 'post',
            url: _urls + url,
            timeout:30000,
            data: prm,
            success: function (result) {
                //给select赋值
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < result.length; i++) {
                    str += '<option' + ' value="' + result[i][num] + '">' + result[i][text] + '</option>'
                    allArr.push(result[i]);
                }
                select.empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //条件查询
    function conditionSelect(){
        var st = $('.min').val();
        var et = moment($('.max').val()).add(1,'d').format('YYYY/MM/DD');
        //console.log(et);
        var prm = {
            'gdCode':$('.filterInput').val(),
            'gdSt':st,
            'gdEt':et,
            'userID': _userIdNum,
            'userName': _userIdName,
            'b_UserRole':_userRole
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDJ',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                console.log(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }
})