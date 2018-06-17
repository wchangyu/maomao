$(function(){

    conditionSelect();

    function conditionSelect(){

        //初始化
        $('.ladding-area').empty();

        var prm = {

            'reportID':'1'

        };

        _mainAjaxFun('post','YWFZ/GetFroms',prm,function(result){

            if(result != null){

                var listStr = '';

                for(var i=0;i<result.length;i++){

                    if(i%2 == 0){

                        listStr += '<div class="ladding-list line-odd">';

                    }else{

                        listStr += '<div class="ladding-list line-even">';

                    }

                    var str = result.logdate;

                    //日期
                    var date = chineseDate(str);

                    //时间
                    var time =timeFormat(str);

                    //部门
                    var dep = result[i].departname;

                    //人
                    var person = result[i].username;

                    //做什么
                    var doing = result[i].memo;

                        //日期
                    listStr += '<div class="ladding-day">' + date + '</div>' +
                        //时间
                        '<div class="ladding-time">' + time + '</div>' +
                            //部门
                        '<div class="ladding-dep">' + dep + '</div>' +
                            //人
                        '<div class="ladding-person">' + person + '</div>' +
                            //做什么
                        '<div class="ladding-doing">' + doing + '</div>'

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

})