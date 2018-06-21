$(function() {

    /*---------------------------------------时间插件-----------------------------------*/

    //时间插件
    _timeYMDComponentsFun11($('.datatimeblock'));

    var nowTime = moment().format('YYYY-MM-DD');

    //开始时间
    var st = moment(nowTime).subtract(6, 'month').format('YYYY-MM-DD');

    //结束时间
    var et = nowTime;

    //赋值
    //开始时间
    $('.min').val(st);

    //结束时间
    $('.max').val(et);

    /*------------------------------------表格初始化---------------------------------*/

    var col = [

        {
            title:'工单号',
            data:'gdCode2'
        },
        {
            title:'受理时间',
            data:'shouLiShij',
        },
        {
            title:'耗时(小时)',
            data:'timeSpan',
            render:function(data, type, full, meta){
                if(data>0){
                    return '<span style="color: red;">' + data + '</span>';
                }else{
                    return '<span style="color: green;">' + data + '</span>';
                }
            }
        },
        {
            title:'平台',
            render:function(data, type, full, meta){

                return '新平台'

            }
        },
        {
            title:'工单状态',
            data:'gdZht',
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
            title:'等待原因',
            data:'dengyy',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '等待技术支持'

                }else if(data == 2){

                    return '等待配件'

                }else if( data == 3 ){

                    return '等待外委施工'

                }
            }

        },
        {
            title:'任务级别',
            data:'gdLeixing',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '一级任务'
                }if(data == 2){
                    return '二级任务'
                }if(data == 3){
                    return '三级任务'
                }if(data == 4){
                    return '四级任务'
                }
            }
        },
        {
            title:'工单来源',
            data:'gdCodeSrc',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '车站报修'
                }else{
                    return '现场人员报修'
                }
            }
        },
        {
            title:'系统类型',
            data:'wxShiX'
        },
        //车间
        {
            title:__names.workshop,
            data:'ddName'
        },
        //维修班组
        {
            title:__names.group,
            data:'wxKeshi',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.bxKeshiNum +'"> ' + data + ' </span>'

            }
        },
        //车站
        {
            title:__names.department,
            data:'bxKeshi'
        },
        {
            title:'设备名称',
            data:'dName'
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'最新处理情况',
            data:'lastUpdateInfo',
            render:function(data, type, full, meta){
                if(full.clStatus == 10){
                    return '备件进展：' + data;
                }else{
                    return data
                }
            }
        },
        {
            title:'备件信息',
            data:'wxClNames'
        },
        {
            title:'督察督办责任人',
            data:'wxUserNames'
        },
    ]

    _tableInit($('.table'),col,1,true,'','','','','','');

    /*-------------------------------------变量-------------------------------------*/

    //维修班组数组

    var BZArr = [];

    //获取车间和维修部门；
    wxBZData();

    /*------------------------------------按钮方法-----------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //重置
    $('.resites').click(function(){

        $('select').val('');

        $('input').val('');

        //开始时间
        $('.min').val(st);

        //结束时间
        $('.max').val(et);

        $('#userClass').empty();

    })

    //车间改变
    $('#influence-unite').click(function(){

        //维修班组跟着改变

        var str = '';

        for(var i=0;i<BZArr.length;i++){

            if($('#influence-unite').val() == BZArr[i].parentNum){

                str += '<option value="' + BZArr[i].departNum + '">' + BZArr[i].departName + '</option>'

            }

        }

        $('#userClass').empty().append(str);

    })


    /*--------------------------------------其他方法--------------------------------*/

    //获取车间和维保组
    function wxBZData(){

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDGetWxBanzuStation',

            data:{

                //用户id
                userID:_userIdNum,
                //用户姓名
                userName:_userIdName
            },

            timeout:_theTimes,

            success:function(result){

                if(result != null){

                    //车间
                    if(result.stations){

                        var stationStr = '<option value="">全部</option>'

                        for(var i=0;i<result.stations.length;i++){

                            stationStr += '<option value="' + result.stations[i].departNum + '">' + result.stations[i].departName + '</option>'

                        }

                        $('#influence-unite').empty().append(stationStr);

                    }

                    //维修班组
                    if(result.wxBanzus){

                        BZArr.length = 0;

                        //var wxBanzuStr = ''

                        for(var i=0;i<result.wxBanzus.length;i++){

                            BZArr.push(result.wxBanzus[i]);

                            //wxBanzuStr += '<option value="' + result.wxBanzus[i].departNum + '">' + result.wxBanzus[i].departName + '</option>'

                        }

                        //$('#userClass').empty().append(wxBanzuStr);

                    }

                }

                //条件查询
                conditionSelect();

            },

            error:_errorFun1

        })

    }

    //条件查询
    function conditionSelect(){

        //开始时间
        var st = $('.min').val();

        //结束时间
        var et = moment($('.max').val()).add(1,'d').format('YYYY-MM-DD');

        //结束时间

        var prm = {

            //开始时间
            gdSt:st,
            //结束时间
            gdEt:et,
            //工单状态
            gdZhts: [
                1,2,3,4,5,6
            ],
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //是否查询超时时间
            isCalcTimeSpan:1

        }

        //如果车间为空，不传，选择车间，将该车间下的所有维修班组都传进去wxKeshis;

        if($('#influence-unite').val() != ''){

            var arr = [];

            var option = $('#userClass').children('option');

            for(var i=0;i<option.length;i++){

                arr.push(option.eq(i).attr('value'));

            }

            prm.wxKeshis = arr;

        }

        _mainAjaxFun('post','YWGD/ywGDRptWaiting',prm,function(result){

            //赋值
            _datasTable($('.table'),result);
        })

    }

})