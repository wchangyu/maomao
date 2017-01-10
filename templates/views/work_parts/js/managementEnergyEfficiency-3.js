$(function(){
    $('#calendar').fullCalendar({
        theme: true,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        dayNames:['周日','周一','周二','周三','周四','周五','周六'],
        dayNamesShort:['周日','周一','周二','周三','周四','周五','周六'],
        today:['今天'],
        firstDay:1,//第一天是周一还是周日；
        buttonText:{
            today:'本月',
            month:'月',
            week:'周',
            day:'日',
            prev:'上一月',
            next:'下一月',
        },
        defaultDate: '2017-01-01',
        editable: true,   //是否可编辑，即进行可拖动和缩放操作。
        eventLimit: true, // allow "more" link when too many events,
        eventClick:function(event){
            alert(0);
            console.log(this);
        },
        dayClick:function(date, allDay, jsEvent, view){   //date是点击的day的时间
            console.log(date.format())
        },
        select:function(){
            alert(0);
        },
        events: [
            {
                title: 'E:1.55',
                start: '2017-01-01',
                end:'2017-01-01'
            },
            {
                title: 'C:15658.0',
                start: '2017-01-01',
                end:'2017-01-01'
            },
            {
                title: 'P:6894.6',
                start: '2017-01-01',
                end:'2017-01-01'
            },
            {
                title: 'E:1.18',
                start: '2017-01-02',
                end:'2017-01-02'
            },
            {
                title: 'C:22914.7',
                start: '2017-01-02',
                end:'2017-01-02'
            },
            {
                title: 'P:7705.3',
                start: '2017-01-02',
                end:'2017-01-02'
            },
            {
                title: 'E:1.09',
                start: '2017-01-03',
                end:'2017-01-03'
            },
            {
                title: 'C:26252.6',
                start: '2017-01-03',
                end:'2017-01-03'
            },
            {
                title: 'P:8108.3',
                start: '2017-01-03',
                end:'2017-01-03'
            },
            {
                title: 'E:1.11',
                start: '2017-01-04',
                end:'2017-01-04'
            },
            {
                title: 'C:25317.6',
                start: '2017-01-04',
                end:'2017-01-04'
            },
            {
                title: 'P:8019.8',
                start: '2017-01-04',
                end:'2017-01-04'
            },
            {
                title: 'E:1.17',
                start: '2017-01-05',
                end:'2017-01-05'
            },
            {
                title: 'C:23711.5',
                start: '2017-01-05',
                end:'2017-01-05'
            },
            {
                title: 'P:7866.1',
                start: '2017-01-05',
                end:'2017-01-05'
            },
            {
                title: 'E:1.13',
                start: '2017-01-06',
                end:'2017-01-06'
            },
            {
                title: 'C:24552.6',
                start: '2017-01-06',
                end:'2017-01-06'
            },
            {
                title: 'P:7921.8',
                start: '2017-01-06',
                end:'2017-01-06'
            },
            {
                title: 'E:1.14',
                start: '2017-01-07',
                end:'2017-01-07'
            },
            {
                title: 'C:24154.5',
                start: '2017-01-07',
                end:'2017-01-07'
            },
            {
                title: 'P:7856.6',
                start: '2017-01-07',
                end:'2017-01-07'
            },
            {
                title: 'E:1.20',
                start: '2017-01-08',
                end:'2017-01-08'
            },
            {
                title: 'C:22373.5',
                start: '2017-01-08',
                end:'2017-01-08'
            },
            {
                title: 'P:7660.3',
                start: '2017-01-08',
                end:'2017-01-08'
            },
            {
                title: 'E:1.38',
                start: '2017-01-09',
                end:'2017-01-09'
            },
            {
                title: 'C:18730.1',
                start: '2017-01-09',
                end:'2017-01-09'
            },
            {
                title: 'P:7366.4',
                start: '2017-01-09',
                end:'2017-01-09'
            },
            {
                title: 'E:1.39',
                start: '2017-01-10',
                end:'2017-01-10'
            },
            {
                title: 'C:12673.7',
                start: '2017-01-10',
                end:'2017-01-10'
            },
            {
                title: 'P:5009.6',
                start: '2017-01-10',
                end:'2017-01-10'
            },
            {
                title: 'E:1.18',
                start: '2017-01-11',
                end:'2017-01-11'
            },
            {
                title: 'C:22914.7',
                start: '2017-01-11',
                end:'2017-01-11'
            },
            {
                title: 'P:7705.3',
                start: '2017-01-11',
                end:'2017-01-11'
            },
        ]
    });
    _myChart1 = echarts.init(document.getElementById('itemizeMain'));
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:['冷冻泵','冷却泵','冷塔泵','冷机']
        },
        series: [
            {
                name:'访问来源',
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
                    {value:335, name:'冷冻泵'},
                    {value:310, name:'冷却泵'},
                    {value:135, name:'冷塔泵'},
                    {value:1548, name:'冷机'}
                ]
            }
        ]
    };
    _myChart1.setOption(option);
    $('.datetimepickers').datepicker(
        {
            language:  'zh-CN',
            todayBtn: 1,
            todayHighlight: 1,
            format: 'yyyy-mm-dd'
        }
    )
})
window.onresize = function () {
    if( _myChart1){
        _myChart1.resize();
    }
}