$(function(){

    /*--------------------------------日历插件-------------------------------*/

    _yearDate($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY');

    $('.datatimeblock').val(nowTime);

    $('.intro-content').children('p').html($('.datatimeblock').val());

    //日期改变，右边跟着变
    $('.datatimeblock').change(function(){

        //右边标题跟着变
         $('.intro-content').children('p').html($('.datatimeblock').val());

        //日历初始化跟着变
        canlendarInit();

    })

    /*--------------------------------fullcalendar--------------------------*/

    canlendarInit();

    //表格初始化
    function canlendarInit(){

        $('#theLoading').modal('show');

        //初始化
        var calendarList = $('.calendar-list');

        for(var i=0;i<calendarList.length;i++){

            var date = $('.datatimeblock').val().split('/')[0];

            var dateFormat = date + '/' + Number(i + 1);

            //销毁日历
            $('.calendar-list').eq(i).fullCalendar('destroy');

            calendarList.eq(i).fullCalendar({
                //头部信息
                header:{

                    left:'',

                    center:'title',

                    right:''

                },
                //头部显示设置
                titleFormat:{

                    month:date + '年' + (i + 1) + '月'

                },
                //是否随浏览器窗口大小变化而自动变化。
                handleWindowResize: true,
                //汉化
                dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                defaultView: 'month',
                firstDay: 0,
                defaultDate: moment(dateFormat).format('YYYY/MM'),
                events: [

                    {
                        //日程名称
                        title:'会议',

                        //开始时间
                        start:'2018/01/01 00:00',

                        //结束时间
                        end:'2018/01/01 23:59',

                        //颜色
                        backgroundColor:'#ffc000'
                    }
                ],
                selectable: true,
                eventClick: function (event) {

                }
            });

        }

        $('#theLoading').modal('hide');

    }


})