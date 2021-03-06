/**
 * Created by admin on 2018/3/8.
 */

/**
 * Created by admin on 2017/12/12.
 */
$(function(){

    //获取设想头信息
    getAlarmCameraData();

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


//获取当前摄像头报警数据
function getAlarmCameraData(){

    //获取当前摄像头ID
    var cameraID = window.location.href.split("cameraID=")[1];

    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetCameraDataByID',
        data:{
            "cameraID":cameraID
        },
        success:function(result){

            //console.log(result);

                //登陆当前摄像头

                //账号
                var account = result.mappVideoRecorder.f_User;
                //地址
                var address = result.mappVideoRecorder.f_RecIP;
                //密码
                var password = result.mappVideoRecorder.f_Password;

                var ifdecode = getDataByConfig();

                //判断是否需要解密
                if( ifdecode== 1){

                    //给密码解密
                    password = Went.utility.wCoder.wDecode(password,"");

                }


                //端口
                var port = result.mappVideoRecorder.f_PortNum;

                //通道号
                var aisleNum = result.f_AisleNum;

                //console.log(password);

                //登录当前设备
                clickLogin1(account,address,password,port);

                changeWndNum(1);

                setTimeout(function(){

                    //进入当前通道号
                    $('#channels').val(aisleNum);

                    //开始预览
                    clickStartRealPlay();

                },3000);

        },
        error:function(){

        }
    })
};