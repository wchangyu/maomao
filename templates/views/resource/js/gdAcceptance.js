$(function(){
    /*---------------------------------------------时间---------------------------------------------------*/

    //时间设置
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间（7天）
    var et = moment().format('YYYY/MM/DD');

    var st =moment().subtract(7,'d').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(st);

    $('.datatimeblock').eq(1).val(et);

    /*---------------------------------------------变量--------------------------------------------------*/
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

    /*--------------------------------------------表格初始化---------------------------------------------*/

    //待受理
    var  pendingListCol = [
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

    _tableInit($('#pending-list'),pendingListCol,'2','','','');

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

    //申诉
    var appealListCol = [
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

    _tableInit($('#appeal-list'),appealListCol,'2','','','');

    //负责人表格
    var fzrListCol = [
        {
            title:'工号',
            data:''
        },
        {
            title:'工长名称',
            data:''
        },
        {
            title:'职位',
            data:''
        },
        {
            title:'联系电话',
            data:''
        }
    ];

    _tableInit($('#fzr-list'),fzrListCol,'2','','','');

    /*-------------------------------------------------按钮事件-----------------------------------------*/

    //tab选项卡
    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tabDiv = $(this).parents('.table-title').next().children('div');
        tabDiv.addClass('hide-block');
        tabDiv.eq($(this).index()).removeClass('hide-block');
    });

    //登记
    $('.creatButton').click(function(){

        //模态框显示
        _moTaiKuang($('#myModal'), '登记', '', '' ,'', '登记');

        //添加登记类
        $('#myModal').find('.btn-primary').removeClass('bianji').addClass('dengji');

        //对象初始化
        dataInit()
    })

    /*-------------------------------------------------其他方法-----------------------------------------*/
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

})