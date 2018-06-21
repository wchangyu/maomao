$(function(){

    //时间插件
    _timeYMDComponentsFun11($('.datatimeblock'));

    //默认今天
    $('.datatimeblock').val(moment().format('YYYY-MM-DD'));

    //条件查询
    conditionSelect();

    //查询方法
    function conditionSelect(){

        //初始化
        contentInit();

        //起止时间
        var st = moment($('.datatimeblock').eq(0).val()).format('YYYY-MM-DD');

        var et = moment($('.datatimeblock').eq(0).val()).format('YYYY-MM-DD');

        var prm = {

            'reportID':'1',

            'requesparameters':[

                //开始时间
                {
                    name:'st',

                    value:st
                },
                //结束时间
                {

                    name:'et',

                    value:et

                }

            ]

        };

        _mainAjaxFun('post','YWFZ/GetFroms',prm,function(result){

            if(result != null){

                var dataArr = _packagingTableData(result[1]);

                var listStr = '';

                for(var i=0;i<dataArr.length;i++){

                    if(i%2 == 0){

                        listStr += '<div class="ladding-list line-odd">';

                    }else{

                        listStr += '<div class="ladding-list line-even">';

                    }

                    var str = dataArr[i].logdate;

                    //日期
                    var date = chineseDate(str);

                    //时间
                    var time =timeFormat(str);

                    //部门
                    var dep = dataArr[i].departname;

                    //人
                    var person = dataArr[i].username;

                    //做什么
                    var doing = dataArr[i].memo;

                        //日期
                    listStr += '<div class="ladding-day">' + date + '</div>' +
                        //时间
                        '<div class="ladding-time">' + time + '</div>' +
                            //部门
                        '<div class="ladding-dep">' + dep + '</div>' +
                            //人
                        '<div class="ladding-person">' + person + '</div>' +
                            //做什么
                        '<div class="ladding-doing"><i>' + doing + '</i></div>'

                    listStr += '</div>'

                }

                $('.ladding-area').empty().append(listStr);


            }

        })

    }

    //2018/6/14 -->2018年6月14日
    function chineseDate(date){

        //var newDate = '';

        var newDate = moment(date).format('YYYY/MM/DD HH:mm:ss');

        var splitDate = newDate.split(' ')[0].split('/');

        return splitDate[1] + '月' + splitDate[2] + '日'

    }

    //月份
    function timeFormat(data){

        var newDate = moment(data).format('YYYY/MM/DD HH:mm:ss');

        var splitDate = newDate.split(' ')[1];

        return splitDate

    }

    //初始化
    function contentInit(){

        $('.ladding-area').empty();

    }

})