/**
 * Created by admin on 2018/10/12.
 */
$.getScript('http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&day=0&city=&dfc=1&charset=utf-8',function(a){

    var s="",r="",q="";
    console.log(window.SWther.w);

    for(s in window.SWther.w){

        var message = SWther.w[s][0];

        //console.log(message);

        if(message){

            //温度
            $('.the-temperature').html(message.t1 + '℃');

            //天气
            $('.weather').html(message.s1);

            //风向
            $('.wind-direction').html(message.d1);

            //风力
            $('.wind-power').html(message.p1);

        }

    }

});

//百度天气接口
$.ajax({
    url:"http://api.map.baidu.com/telematics/v3/weather?location=北京&output=json&ak=H7W5CxI0BPzKtwGcBHmpGPAz50xP1Qjw",
    dataType:"jsonp",
    jsonpCallback:"admin_cross",
    success:function(data){

        console.log(data)

        var message = data.results[0].weather_data[0];
        //console.log(message);

        if(message){

            //温度
            $('.the-temperature').html(message.temperature);

            //天气
            $('.weather').html(message.weather);

            //风向
            $('.wind-direction').html(message.wind);

            //风力
            $('.wind-power').html('≤3');

        }


    }
});

//通过万年历获取天气
$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function (_result) {
    console.log(remote_ip_info);//定位城市
    if (remote_ip_info.ret == '1') {
        $.ajax({ //获取天气
            type: "GET",
            url: "http://wthrcdn.etouch.cn/weather_mini?city=" + remote_ip_info.city,
            data: "",
            success: function (msg) {
                var res = eval('(' + msg + ')');
                //alert(msg);
                if (res.status == 1000) {
                    //请求成功
                    console.log(res)
                    console.log(res.data.forecast[0].fengli.substring(9, res.data.forecast[0].fengli.length - 3))
                }
            }
        });
    }
});

//2345天气预报插件 iframe 链接 http://tianqi.2345.com/plugin/



