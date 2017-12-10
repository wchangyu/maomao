$(function(){

    /*---------------------------------------------时间插件------------------------------------------*/

    /*---------------------------------------------变量----------------------------------------------*/

    //声明Vue对象
    var checkWork = new Vue({

        el:'#myApp33',
        data:{

            //时间段名称
            tname:'',
            //上班时间
            startwork:'',
            //下班时间
            endwork:'',
            //开始签到时间
            stsignwork:'',
            //结束签到时间
            etsignwork:'',
            //开始签退时间
            stsignoutwork:'',
            //结束签退时间
            etsignoutwork:'',
            //记迟到时间
            tlate:'',
            //记早退时间
            tearly:''

        },
        methods:{

            timeFun:function(){

                _timeComponentsFun($('.datatimeblock'));

            },
            naturalNumber:function(attr){

                var mny = /^\d+$/;

                var $this = $(this)[0][attr];

                var e = e||window.event;

                var error = $(e.srcElement).parents('li').find('.multiple-condition')

                if( $this == '' ){

                    error.show();

                }else{

                    if(mny.test($this)){

                        error.hide();

                    }else{

                        error.show();

                    }

                }


            }
        }

    })

    /*---------------------------------------------表格初始化----------------------------------------*/
    var tableListCol = [

        {
            title:'时间段名称',
            data:'name'
        },
        {
            title:'上班时间',
            data:'shangbantime'
        },
        {
            title:'下班时间',
            data:'xiabantime'
        },
        {
            title:'开始签到时间',
            data:'ksqdtime'
        },
        {
            title:'结束签到时间',
            data:'jsqdtime'
        },
        {
            title:'开始签退时间',
            data:'ksqttime'
        },
        {
            title:'结束签退时间',
            data:'jsqttime'
        },
        {
            title:'记迟到时间（分钟）',
            data:'jcdtime'
        },
        {
            title:'记早退时间（分钟）',
            data:'jzttime'
        },
        {
            title: '操作',
            "targets": -1,
            "data": null,
            "className": 'noprint',
            "defaultContent":
            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }

    ];

    _tableInit($('#table-list'),tableListCol,1,true,'','');

    conditionSelect();

    /*----------------------------------------------按钮事件----------------------------------------*/

    //新增
    $('.creatButton').click(function(){

        //初始化
        detailedInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'), '新增', false, '' ,'', '新增');

        //添加登记类
        $('#ADD-Modal').find('.btn-primary').addClass('dengji');

        //验证消息隐藏
        $('#ADD-Modal').find('.multiple-condition').hide();

    })

    //新增确定按钮
    $('#ADD-Modal').on('click','.dengji',function(){

        var o = $('#ADD-Modal').find('.multiple-condition').eq(0).css('display');

        var e = $('#ADD-Modal').find('.multiple-condition').eq(1).css('display');

        //格式验证
        if( o == 'none' && e == 'none' ){

            var prm = {
                //时间段名称
                name:checkWork.tname,
                //上班时间
                shangbantime:checkWork.startwork,
                //下班时间
                xiabantime:checkWork.endwork,
                //开始签到时间
                ksqdtime:checkWork.stsignwork,
                //结束签到时间
                jsqdtime:checkWork.etsignwork,
                //开始签退时间
                ksqttime:checkWork.stsignoutwork,
                //结束签退时间
                jsqttime:checkWork.etsignoutwork,
                //记迟到时间
                jcdtime:checkWork.tlate,
                //记早退时间
                jzttime:checkWork.tearly

            };

            $.ajax({

                type:'post',
                url:_urls + 'YWFZ/KQShiJianDuanAdd',
                data:prm,
                timeout:_theTimes,
                success:function(result){

                    if(result == 99){


                    }else{


                    }

                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }

            })



        }else{

            _moTaiKuang($('#myModal2'),'提示','flag','istap','请输入正确格式的数字！','');

        }



    })

    //模态框显示完成时执行的方法
    $('#ADD-Modal').on('shown.bs.modal',function(){

        //所有日历控件的input失去焦点
        $('#ADD-Modal').find('.datatimeblock').click();

    })

    //编辑
    $('#table-list').on('click','.option-edit',function(){

        //样式
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //模态框
        _moTaiKuang($('#ADD-Modal'),'编辑','','','','保存');

        //全部

    })
    /*----------------------------------------------其他方法---------------------------------------*/

    //模态框初始化-----------------------------------
    function detailedInit(){

        //时间段名称
        checkWork.tname = '';
        //上班时间
        checkWork.startwork = '';
        //下班时间
        checkWork.endwork = '';
        //开始签到时间
        checkWork.stsignwork = '';
        //结束签到时间
        checkWork.etsignwork = '';
        //开始签退时间
        checkWork.stsignoutwork = '';
        //结束签退时间
        checkWork.etsignoutwork = '';
        //记迟到时间
        checkWork.tlate = '';
        //记早退时间
        checkWork.tearly = '';

    }


    //其他方法发------------------------------------

    //条件查询
    function conditionSelect(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/KQShiJianDuanGetAll',
            timeout:_theTimes,
            success:function(result){
                console.log(result);

                if(result.length != 0 ){

                    _datasTable($('#table-list'),result);

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

})