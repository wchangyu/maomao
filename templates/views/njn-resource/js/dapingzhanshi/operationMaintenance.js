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
            data:''
        },
        {
            title:'报修时间',
            data:''
        },
        {
            title:'地点',
            data:''
        },
        {
            title:'报修内容',
            data:''
        },
        {
            title:'链接',
            data:''
        },
        {
            title:'设备ID',
            data:''
        },
        {
            title:'设备名称',
            data:''
        },
        {
            title:'设备类别',
            data:''
        },
        {
            title:'报修录入人',
            data:''
        },
        {
            title:'报修电话',
            data:''
        },
        {
            title:'工单等级',
            data:''
        },
        {
            title:'接单人员',
            data:''
        },
        {
            title:'工单状态',
            data:''
        }

    ]

    _tableInit($('#gd-datatables'),gdCol,1,true,'','',true,'','',false);

    /*------------------------------------------------------其他方法----------------------------------*/

    conditionSelect();

    //页面默认加载数据
    function conditionSelect(){

        //本日数据
        echartData('day');
        //本月数据
        echartData('month');
        //本年数据
        echartData('year');

    }

    //echart数据(利用flag来判断日月年)
    function echartData(flag){

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

        _mainAjaxFun('post','YWGD/ywGDGetGDRespondInfo',prm,GDsuccessFun);

        //执行成功方法
        function GDsuccessFun(result){

            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    show:false,
                    orient: 'vertical',
                    x: 'left',
                    data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
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
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
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
            //日

            if(flag == 'day'){

                if(result.length>0){

                    pieNum(result,option,gdResponseDay,gdBXTypeDay,gdGradeDay,gdSpreadDay);

                }else{}

            }
            if(flag == 'month'){

                if(result){

                    pieNum(result,option,gdResponseMonth,gdBXTypeMonth,gdGradeMonth,gdSpreadMonth);

                }else{}

            }
            if(flag == 'year'){
                if(result){

                    pieNum(result,option,gdResponseYear,gdBXTypeYear,gdGradeYear,gdSpreadYear);

                }else{}

            }


        }


    }

    //饼图赋值(结果，配置参数，值1：工单响应，值2：工单渠道，值3：工单等级，值4：工单分布)
    function pieNum(result,option,el1,el2,el3,el4){

        //工单响应
        if(result.gdStat){

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
                            '#14E398','#EAD01E','#F8276C'
                        ];
                        return colorList[params2.dataIndex]
                    }
                }
            }

            //工单响应-年
            el1.setOption(option);

        }else{

            option.series[0].name='工单响应';

            //数据
            option.series[0].data = [

                {value:0,name:'已完成'},

                {value:0,name:'派单中'},

                {value:0,name:'进行中'},

            ]

            //颜色
            option.series[0].itemStyle = {
                normal: {
                    color: function(params2) {

                        var colorList = [
                            '#14E398','#EAD01E','#F8276C'
                        ];
                        return colorList[params2.dataIndex]
                    }
                }
            }

            //工单响应-年
            el1.setOption(option);

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

                {value:0,name:'江苏运联'}

            ]

            if(result.gdSrcs){

                for(var i=0;i<result.gdSrcs.length;i++){
                    //电话
                    if(result.gdSrcs[i].gdSrc == 1){

                        option.series[0].data[0] = result.gdSrcs[i].gdCnt;
                        //手机
                    }else if(result.gdSrcs[i].gdSrc == 2){

                        option.series[0].data[2] = result.gdSrcs[i].gdCnt;
                        //系统
                    }else if(result.gdSrcs[i].gdSrc == 3){

                        option.series[0].data[3] = result.gdSrcs[i].gdCnt;
                        //平台
                    }else if(result.gdSrcs[i].gdSrc == 4){

                        option.series[0].data[1] = result.gdSrcs[i].gdCnt;
                        //江苏运联
                    }else if(result.gdSrcs[i].gdSrc == 10){

                        option.series[0].data[4] = result.gdSrcs[i].gdCnt;

                    }

                }

            }

            //颜色
            option.series[0].itemStyle = {
                normal: {
                    color: function(params2) {

                        var colorList = [
                            '#14E398','#0BA3C3','#0353F7','#3C27D5','#901AD3'
                        ];
                        return colorList[params2.dataIndex]
                    }
                }
            }

            //工单渠道-年
            el2.setOption(option);


        }else{

            option.series[0].name='工单渠道';

            //数据
            option.series[0].data = [

                {value:0,name:'电话'},

                {value:0,name:'平台'},

                {value:0,name:'手机'},

                {value:0,name:'系统'},

                {value:0,name:'江苏运联'}

            ]

            //颜色
            option.series[0].itemStyle = {
                normal: {
                    color: function(params2) {

                        var colorList = [
                            '#14E398','#0BA3C3','#0353F7','#3C27D5','#901AD3'
                        ];
                        return colorList[params2.dataIndex]
                    }
                }
            }

            //工单渠道-年
            el2.setOption(option);

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

            for(var i=0;i<result.gdLXs.length;i++){

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

            option.series[0].name='工单等级';

            option.series[0].data = [

                {value:0,name:'普通'},

                {value:0,name:'急'},

                {value:0,name:'紧急'},

                {value:0,name:'特急'}

            ]

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


        }
        //工单分布
        if(result.gdDevInfos){

            option.series[0].name='工单分布';

            var color = ['#14E398','#0BA3C3','#0387F7','#0353F7','#283DDA','#3C27D5','#6512D7','#901AD3'];

            var leftColorBlock = '';

            var rightColorBlock = '';
            //生成小色块
            for(var i=0;i<result.gdDevInfos.length;i++){

                //自动生成工单分布的颜色块
                if(i%2){

                    //奇数插入第二个父元素console.log('奇数'+i);
                    rightColorBlock += '<div class="legend-block label-width">' +
                        '<span style="background: ' + color[i] + '"></span>' +
                        '<label>' + result.gdDevInfos[i].dsName + '</label>' +
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

            option.series[0].name='工单分布';

            //数据
            option.series[0].data = [];

            //工单分布-年
            el4.setOption(option);

        }

    }


})