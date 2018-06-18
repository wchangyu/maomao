$(function(){

    /*----------------------------------------echarts-------------------------------------------*/

    //声明echart
    //工单响应-天
    var gdResponseDay = echarts.init($('#gdResponseDay')[0]);
    //工单渠道-天
    var gdBXTypeDay = echarts.init($('#gdBXTypeDay')[0]);
    //工单等级-天
    var gdGradeDay = echarts.init($('#gdGradeDay')[0]);
    //工单分布-天
    var gdSpreadDay = echarts.init($('#gdSpreadDay')[0]);
    //工单响应-月
    var gdResponseMonth = echarts.init($('#gdResponseMonth')[0]);
    //工单渠道-月
    var gdBXTypeMonth = echarts.init($('#gdBXTypeMonth')[0]);
    //工单等级-月
    var gdGradeMonth = echarts.init($('#gdGradeMonth')[0]);
    //工单分布-月
    var gdSpreadMonth = echarts.init($('#gdSpreadMonth')[0]);
    //工单响应-年
    var gdResponseYear = echarts.init($('#gdResponseYear')[0]);
    //工单渠道-年
    var gdBXTypeYear = echarts.init($('#gdBXTypeYear')[0]);
    //工单等级-年
    var gdGradeYear = echarts.init($('#gdGradeYear')[0]);
    //工单分布-年
    var gdSpreadYear = echarts.init($('#gdSpreadYear')[0]);

    /*------------------------------------------------------表格初始化---------------------------------*/

    var gdCol = [

        {
            title:'工单号',
            data:'gdCode2',
            class:'hiddenClock'
        },
        {
            title:'报修时间',
            data:'gdShij',
            render:function(data, type, full, meta){

                return data.split(' ')[1]

            }

        },
        {
            title:'地点',
            data:'wxDidian',
            className:'wxDidian',
            render:function(data, type, full, meta){

                return '<span title="' + data + '">'+ data + '</span>';

            }

        },
        {
            title:'报修内容',
            data:'bxBeizhu',
            className:'bxBeizhu',
            render:function(data, type, full, meta){

                return '<span title="' + data + '">'+ data + '</span>';

            }
        },
        {
            title:'设备ID',
            data:'wxShebei',
            class:'hiddenClock devNum'
        },
        {
            title:'设备名称',
            data:'dName',
            className:'devName'
        },
        {
            title:'报修人',
            data:'createUserName'
        },
        //{
        //    title:'报修电话',
        //    data:'bxDianhua'
        //},
        {
            title:'等级',
            data:'gdLeixing',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '一级'

                }else if(data == 2){

                    return '二级'

                }else if(data == 3){

                    return '三级'

                }else if(data == 4){

                    return '四级'

                }else{

                    return ''

                }

            }

        },
        {
            title:'接单人',
            data:'shouLiRenName'
        },
        {
            title:'状态',
            data:'gdZht',
            render: function (data, type, full, meta) {
                if (data == 1) {
                    return '待下发'
                }
                if (data == 2) {
                    return '待分派'
                }
                if (data == 3) {
                    return '待执行'
                }
                if (data == 4) {
                    return '执行中'
                }
                if (data == 5) {
                    return '等待资源'
                }
                if (data == 6) {
                    return '待关单'
                }
                if (data == 7) {
                    return '任务关闭'
                }
                if (data == 999) {
                    return '任务取消'
                }
            }
        }

    ]

    $('#gd-datatables').DataTable(   {
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        "bStateSave":true,
        //"sScrollY": '518px',
        "sScrollY": '218px',
        "bPaginate": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [

        ],
        "dom":'t<"F"lp>',
        "columns": gdCol
    });

    /*-----------------------------------------------------按钮事件-------------------------------------*/

    $('#gd-datatables tbody').on('click','tr',function(){

        var dNum = $(this).children('.devNum').html();

        var dName = $(this).children('devName').html();

        $('#gd-datatables tbody').find('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

        divTable(dNum,dName);

    })


    /*------------------------------------------------------其他方法----------------------------------*/
    //默认加载数据
    conditionSelect();

    //页面默认加载数据
    function conditionSelect(){

        //本日数据
        echartData('day');
        //本月数据
        echartData('month');
        //本年数据
        echartData('year');
        //运维联动
        gdTable();

    }

    //echart数据(利用flag来判断日月年)
    function echartData(flag){

        //初始化移除暂无数据的选择项
        $('.noData').remove();

        //开始时间
        var st = '';

        //结束时间
        var et = '';

        var nowTime = moment().format('YYYY/MM/DD');

        if(flag == 'day'){

            st = moment().format('YYYY/MM/DD');

            et = moment(nowTime).add(1,'d').format('YYYY/MM/DD');

        }else if( flag == 'month' ){

            st = moment(nowTime).startOf('months').format('YYYY/MM/DD');

            et = moment(nowTime).endOf('months').add(1,'d').format('YYYY/MM/DD');

        }else if( flag == 'year' ){

            st = moment(nowTime).startOf('years').format('YYYY/MM/DD');

            et = moment(nowTime).endOf('years').add(1,'d').format('YYYY/MM/DD');

        }

        var prm = {

            //开始时间
            gdSt:st,
            //结束时间
            gdEt:et,
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDGetGDRespondInfo',

            beforeSend:function(){

                if(flag == 'day'){

                    //工单响应-天
                    gdResponseDay.showLoading();
                    //工单渠道-天
                    gdBXTypeDay.showLoading();
                    //工单等级-天
                    gdGradeDay.showLoading();
                    //工单分布-天
                    gdSpreadDay.showLoading();

                }else if( flag == 'month' ){

                    //工单响应-月
                    gdResponseMonth.showLoading();
                    //工单渠道-月
                    gdBXTypeMonth.showLoading();
                    //工单等级-月
                    gdGradeMonth.showLoading();
                    //工单分布-月
                    gdSpreadMonth.showLoading();

                }else if( flag == 'year' ){

                    //工单响应-年
                    gdResponseYear.showLoading();
                    //工单渠道-年
                    gdBXTypeYear.showLoading();
                    //工单等级-年
                    gdGradeYear.showLoading();
                    //工单分布-年
                    gdSpreadYear.showLoading();

                }

            },

            complete:function(){

                if(flag == 'day'){

                    //工单响应-天
                    gdResponseDay.hideLoading();
                    //工单渠道-天
                    gdBXTypeDay.hideLoading();
                    //工单等级-天
                    gdGradeDay.hideLoading();
                    //工单分布-天
                    gdSpreadDay.hideLoading();

                }else if( flag == 'month' ){

                    //工单响应-月
                    gdResponseMonth.hideLoading();
                    //工单渠道-月
                    gdBXTypeMonth.hideLoading();
                    //工单等级-月
                    gdGradeMonth.hideLoading();
                    //工单分布-月
                    gdSpreadMonth.hideLoading();

                }else if( flag == 'year' ){

                    //工单响应-年
                    gdResponseYear.hideLoading();
                    //工单渠道-年
                    gdBXTypeYear.hideLoading();
                    //工单等级-年
                    gdGradeYear.hideLoading();
                    //工单分布-年
                    gdSpreadYear.hideLoading();

                }

            },

            timeout:_theTimes,

            data:prm,

            success:function(result){

                var option = {
                    title:{
                        text:'',
                        subtext:'工单量',
                        top:'70',
                        left:'center',
                        textStyle:{

                            fontSize:'37',

                            fontWeight:'normal',

                            color:'#3C3C3C'

                        },
                        subtextStyle:{

                            verticalAlign:'top'

                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        show:false,
                        orient: 'vertical',
                        x: 'left',
                        data:[]
                    },
                    series: [
                        {
                            name:'',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'normal'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ]
                        }
                    ]
                };

                var str = '<span class="noData" style="line-height: 200px">暂无数据</span>';

                //日

                if(flag == 'day'){

                    if(result){

                        pieNum(result,option,gdResponseDay,gdBXTypeDay,gdGradeDay,gdSpreadDay);

                    }else{
                        //工单响应
                        $('#gdResponseDay').empty().append(str);
                        //工单渠道
                        $('#gdBXTypeDay').empty().append(str);
                        //工单等级
                        $('#gdGradeDay').empty().append(str);
                        //工单分布
                        $('#gdSpreadDay').empty().append(str);
                    }

                }
                if(flag == 'month'){

                    if(result){

                        pieNum(result,option,gdResponseMonth,gdBXTypeMonth,gdGradeMonth,gdSpreadMonth);

                    }else{

                        //工单响应
                        $('#gdResponseMonth').empty().append(str);
                        //工单渠道
                        $('#gdBXTypeMonth').empty().append(str);
                        //工单等级
                        $('#gdGradeMonth').empty().append(str);
                        //工单分布
                        $('#gdSpreadMonth').empty().append(str);

                    }

                }
                if(flag == 'year'){
                    if(result){

                        pieNum(result,option,gdResponseYear,gdBXTypeYear,gdGradeYear,gdSpreadYear);

                    }else{

                        //工单响应
                        $('#gdResponseYear').empty().append(str);
                        //工单渠道
                        $('#gdBXTypeYear').empty().append(str);
                        //工单等级
                        $('#gdGradeYear').empty().append(str);
                        //工单分布
                        $('#gdSpreadYear').empty().append(str);

                    }

                }

            },

            error:_errorFun

        })


    }

    //饼图赋值(结果，配置参数，值1：工单响应，值2：工单渠道，值3：工单等级，值4：工单分布)
    function pieNum(result,option,el1,el2,el3,el4){

        var str = '<span class="noData" style="line-height: 200px">暂无数据</span>';

        //工单响应
        if(result.gdStat){

            var totalNum = Number(result.gdStat.gdFinished) + Number(result.gdStat.gdAssign) + Number(result.gdStat.gdInProgress);

            option.title.text = totalNum;

            option.series[0].name='工单响应';

            //数据
            option.series[0].data = [

                {value:result.gdStat.gdFinished,name:'已完成'},

                {value:result.gdStat.gdAssign,name:'派单中'},

                {value:result.gdStat.gdInProgress,name:'进行中'}

            ]

            //颜色
            option.series[0].itemStyle = {
                normal: {
                    color: function(params2) {

                        var colorList = [
                            '#1DD6C2','#0BA3C3','#0353F7'
                        ];
                        return colorList[params2.dataIndex]
                    }
                }
            }

            //console.log(option);

            //工单响应
            el1.setOption(option);

        }else{

            var dom = $(el1._dom).attr('id')

            var elStr = $('#' + dom);

            elStr.empty().append(str);

        }
        //工单渠道
        if(result.gdSrcs){

            option.series[0].name='工单渠道';

            //数据
            option.series[0].data = [

                {value:0,name:'电话'},

                {value:0,name:'平台'},

                {value:0,name:'手机'},

                {value:0,name:'系统'},

                {value:0,name:'平台推送'}

            ]

            if(result.gdSrcs){

                var totalNum = 0;

                for(var i=0;i<result.gdSrcs.length;i++){

                    totalNum += Number(result.gdSrcs[i].gdCnt);

                    //电话
                    if(result.gdSrcs[i].gdSrc == 1){

                        option.series[0].data[0].value = result.gdSrcs[i].gdCnt;

                        //手机
                    }else if(result.gdSrcs[i].gdSrc == 2){

                        option.series[0].data[2].value = result.gdSrcs[i].gdCnt;
                        //系统
                    }else if(result.gdSrcs[i].gdSrc == 3){

                        option.series[0].data[3].value = result.gdSrcs[i].gdCnt;
                        //平台
                    }else if(result.gdSrcs[i].gdSrc == 4){

                        option.series[0].data[1].value = result.gdSrcs[i].gdCnt;
                        //平台推送
                    }else if(result.gdSrcs[i].gdSrc == 10){

                        option.series[0].data[4].value = result.gdSrcs[i].gdCnt;

                    }

                }

            }

            //标题
            option.title.text = totalNum;

            //颜色
            option.series[0].itemStyle = {
                normal: {
                    color: function(params2) {

                        var colorList = [
                            '#1DD6C2','#0BA3C3','#0353F7','#3C27D5','#901AD3'
                        ];
                        return colorList[params2.dataIndex]
                    }
                }
            }

            //工单渠道-年
            el2.setOption(option);


        }else{

            var dom = $(el2._dom).attr('id')

            var elStr = $('#' + dom);

            elStr.empty().append(str);

        }
        //工单等级
        if(result.gdLXs){

            option.series[0].name='工单等级';

            option.series[0].data = [

                {value:0,name:'普通'},

                {value:0,name:'急'},

                {value:0,name:'紧急'},

                {value:0,name:'特急'}

            ]

            var totalNum = 0;

            for(var i=0;i<result.gdLXs.length;i++){

                totalNum += Number(result.gdLXs[i].gdCnt);

                //普通
                if(result.gdLXs[i].gdLX == 4){

                    option.series[0].data[0].value = result.gdLXs[i].gdCnt;
                    //急
                }else if(result.gdLXs[i].gdLX == 3){

                    option.series[0].data[1].value = result.gdLXs[i].gdCnt;
                    //紧急
                }else if(result.gdLXs[i].gdLX == 2){

                    option.series[0].data[2].value = result.gdLXs[i].gdCnt;
                    //特急
                }else if(result.gdLXs[i].gdLX == 1){

                    option.series[0].data[3].value = result.gdLXs[i].gdCnt;

                }

            }

            //标题
            option.title.text = totalNum;

            //颜色
            option.series[0].itemStyle = {
                normal: {
                    color: function(params2) {

                        var colorList = [
                            '#14E398','#0353F7','#3C27D5','#901AD3'
                        ];
                        return colorList[params2.dataIndex]
                    }
                }
            }

            //工单等级-年
            el3.setOption(option);

        }else{

            var dom = $(el3._dom).attr('id')

            var elStr = $('#' + dom);

            elStr.empty().append(str);

        }
        //工单分布
        if(result.gdDevInfos){

            option.series[0].name='工单分布';

            var totalNum = 0;

            var color = ['#14E398','#0BA3C3','#0387F7','#0353F7','#283DDA','#3C27D5','#6512D7','#901AD3'];

            var leftColorBlock = '';

            var rightColorBlock = '';

            //生成小色块
            for(var i=0;i<result.gdDevInfos.length;i++){

                totalNum += Number(result.gdDevInfos[i].gdCnt);

                //自动生成工单分布的颜色块
                if(i%2){

                    //奇数插入第二个父元素console.log('奇数'+i);
                    rightColorBlock += '<div class="legend-block label-width">' +
                        '<span style="background: ' + color[i] + '"></span>' +
                        '<label>' + result.gdDevInfos[i].dsName + '</label>'  +
                        '</div>'

                }else{

                    //偶数插入第一个父元素console.log('偶数'+i)
                    leftColorBlock += '<div class="legend-block label-width">' +
                        '<span style="background: ' + color[i] + '"></span>' +
                        '<label>' + result.gdDevInfos[i].dsName + '</label>' +
                        '</div>'

                }

            }
            //生成data
            var dataFB = [];

            for(var i=0;i<result.gdDevInfos.length;i++){

                var obj = {};

                obj.value = result.gdDevInfos[i].gdCnt;

                obj.name = result.gdDevInfos[i].dsName;

                dataFB.push(obj);

            }

            option.series[0].data = dataFB;

            $('.legend-areaD').children().eq(1).empty().append(rightColorBlock);

            $('.legend-areaD').children().eq(0).empty().append(leftColorBlock);

            //标题
            option.title.text = totalNum;

            //颜色
            option.series[0].itemStyle = {
                normal: {
                    color: function(params2) {

                        var colorList = color;
                        return colorList[params2.dataIndex]
                    }
                }
            }

            //工单分布-年
            el4.setOption(option);

        }else{

            var dom = $(el4._dom).attr('id')

            var elStr = $('#' + dom);

            elStr.empty().append(str);

        }

    }

    //运维统计表格
    function gdTable(){

        var nowTime = moment().format('YYYY/MM/DD');

        var st = moment(nowTime).format('YYYY/MM/DD');

        var et = moment(nowTime).add(1,'d').format('YYYY/MM/DD');

        var prm = {
            //开始时间
            gdSt:st,
            //结束时间
            gdEt:et,
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName

        };

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDGetZh2',

            timeout:_theTimes,

            data:prm,

            beforeSend:function(){

                $('.table-block').showLoading();

            },

            complete:function(){

                $('.table-block').hideLoading();

            },

            success:function(result){

                if(result.length>0){

                    _jumpNow($('#gd-datatables'),result.reverse());

                    //获取到第一个数据的设备

                    var dNum = result[0].wxShebei;

                    var dName = result[0].dName;

                    divTable(dNum,dName);

                }

            },

            error:_errorFun

        })

    }

    //获取设备信息
    function divTable(dNum,dName){

        //初始化
        if(dNum == ''){

            return false;

        }else{

            //设备编码
            $('#devID').html('');

            //设备名称
            $('#devName').html('');

            //赋值

            //设备编码
            $('#devID').html(dNum);

            //设备名称
            $('#devName').html(dName);


            $.ajax({

                type:'get',

                url:_urls + 'YWGD/GetDevGD',

                data:{

                    dNum:dNum

                },

                timeout:_theTimes,

                beforeSend:function(){

                    $('#equipment-resume').showLoading();

                },

                complete:function(){

                    $('#equipment-resume').hideLoading();

                },

                success:function(result){

                    //绑定数据
                    if(result.length>0){

                        var str = ''

                        for(var i=0;i<result.length;i++){

                            str += '<tr>' +
                                    //报修时间
                                '<td>' + result[i].gdShij + '</td>' +
                                    //故障发生时间
                                '<td>' + result[i].gdFsShij + '</td>' +
                                    //故障处理时间
                                '<td>' + result[i].jiedanShij + '</td>' +
                                    //故障修复时间
                                '<td>' + result[i].wangongshij + '</td>' +
                                    //状态
                                '<td>' + result[i].gdZhtStr + '</td>' +
                                    //故障处理进度
                                '<td>' + result[i].lastUpdateInfo + '</td>' +
                                    //故障描述
                                '<td>' + result[i].bxBeizhu + '</td>' +
                                    //故障报修人
                                '<td>' + result[i].bxRen + '</td>' +
                                    //故障处理内容
                                '<td>' + result[i].wxBeizhu + '</td>' +
                                '</tr>'

                        }

                        //插入表格
                        $('#equipment-resume tbody').empty().append(str);

                    }


                },

                error:_errorFun


            })


        }

    }

})