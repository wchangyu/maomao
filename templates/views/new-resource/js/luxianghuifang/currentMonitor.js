
/**
 * Created by admin on 2017/12/12.
 */
$(function(){

    //获取设想头信息
    getAlarmCameraData();

    //点击对应的摄像头 实现回放
    $('.monitor-message').on('click','li',function(){


        $('.monitor-message li').removeClass('curClick');

        $(this).addClass('curClick');

        //获取当前摄像头ID
        var curID = $(this).attr('data-num');

        //获取当前登录信息
        $(alarmCameraDataArr).each(function(i,o){

            if(o.pK_Camera == curID){

                //账号
                var account = 'admin';
                //地址
                var address = o.mappVideoRecorder.f_RecIP;
                //密码
                var password = o.mappVideoRecorder.f_Password;

                //判断是否需要解密
                if(getDataByConfig() == 1){

                    //给密码解密
                    password = Went.utility.wCoder.wDecode(password,"");

                }

                //console.log(password);

                //端口
                var port = o.mappVideoRecorder.f_PortNum;
                //通道号
                var aisleNum = o.f_AisleNum;

                //先执行退出操作
                clickLogout();

                //登录当前设备
                clickLogin1(account,address,password,port);

            }
        });

    });

});

//从配置项中获取页面中所需信息
function getDataByConfig(){


    var ifdecode = 0;

    //获取当前页面的配置信息
    $(__systemConfigArr).each(function(i,o){

        //console.log(o);

        //获取当前配置项中的url
        if(o.pageId == 0){

            ifdecode = o.ifdecode;
        }
    });

    return ifdecode;

};

//定义从后台获取的摄像头报警数据
var alarmCameraDataArr = [];

//定义回放时间
var startPlaybackTime;

//获取当前摄像头报警数据
function getAlarmCameraData(){

    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllCameraData',
        success:function(result){

            console.log(result);

            alarmCameraDataArr = result;

            //定义摄像头信息字符串
            var monitorMessageHtml = '';

            //页面右侧摄像头信息
            $(result).each(function(i,o){

                //对摄像头字符串进行拼接
                monitorMessageHtml += ' <li data-num="'+ o.pK_Camera+'">'+
                        //摄像头名称
                    '<span>'+(i+1)+'.</span>'+ o.f_Name+
                        //安装地点
                    '('+  o.f_Address+
                    ')</li>';

            });

            //页面赋值
            $('.monitor-message').html(monitorMessageHtml);

            var ifdecode = getDataByConfig();


            //登陆当前摄像头
            $(result).each(function(i,o){

                //账号
                var account = result[i].mappVideoRecorder.f_User;
                //地址
                var address = result[i].mappVideoRecorder.f_RecIP;
                //密码
                var password = result[i].mappVideoRecorder.f_Password;

                //判断是否需要解密
                if(ifdecode == 1){

                    //给密码解密
                    password = Went.utility.wCoder.wDecode(password,"");

                }

                //端口
                var port = result[i].mappVideoRecorder.f_PortNum;

                //console.log(password);

                //登录当前设备
                clickLogin1(account,address,password,port);

            });


            //几个账号打开几个窗口
            if (result.length > 9) {
                changeWndNum(4);
            } else {
                if (result.length > 4) {
                    changeWndNum(3);
                } else {
                    changeWndNum(2);
                }
            }

            setTimeout(function(){

                $(result).each(function(i,o){

                    //ip
                    //通道号
                    var aisleNum = o.f_AisleNum;
                    //console.log(aisleNum);

                    //窗口号
                    g_iWndIndex = i;

                    //console.log(g_iWndIndex);

                    //进入当前通道号
                    $('#channels').val(aisleNum);

                    //开始预览
                    clickStartRealPlay();

                });

            },5000);

        },
        error:function(){

        }
    })
};