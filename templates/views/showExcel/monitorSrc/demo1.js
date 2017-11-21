/**
 * Created by admin on 2017/11/14.
 */
//1.打开页面初始化插件
// 初始化插件

// 全局保存当前选中窗口
var g_iWndIndex = 0; //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
$(function () {
    // 检查插件是否已经安装过
    if (-1 == WebVideoCtrl.I_CheckPluginInstall()) {
        alert("您还未安装过插件，下载WebComponents.exe安装！");
        return;
    }

    // 初始化插件参数及插入插件
    WebVideoCtrl.I_InitPlugin(500, 300, {
        iWndowType: 2,
        cbSelWnd: function (xmlDoc) {
            g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
            var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
            showCBInfo(szInfo);
        }
    });
    WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

    // 检查插件是否最新
    if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
        alert("检测到新的插件版本，请将WebComponents.exe升级！");
        return;
    }

    // 窗口事件绑定
    //$(window).bind({
    //    resize: function () {
    //        var $Restart = $("#restartDiv");
    //        if ($Restart.length > 0) {
    //            var oSize = getWindowSize();
    //            $Restart.css({
    //                width: oSize.width + "px",
    //                height: oSize.height + "px"
    //            });
    //        }
    //    }
    //});
    //初始化日期时间
    //var szCurTime = dateFormat(new Date(), "yyyy-MM-dd");
    //$("#starttime").val(szCurTime + " 00:00:00");
    //$("#endtime").val(szCurTime + " 23:59:59");
//这里要用setTimeout调用登录和预览方法 ，如果直接调用  会打不开窗口 ，因为加载时需要时间的
    window.setTimeout(clickLogin2(),1000);
    window.setTimeout(clickStartRealPlay2(),2000);

});



//2写一个登录方法

var ce02m=[];
var ce03m=[];
var ce04m=[];
var ce05m=[];
//<c:forEach items="${monitor}" var="monitor11">
ce02m.push("192.168.1.64");
ce03m.push("admin");
ce04m.push("mch790927");
ce05m.push("80");
//</c:forEach>

var szIP = ce02m;
var szPort = ce05m;
var szUsername = ce03m;
var szPassword = ce04m;

// 登录
function clickLogin2() {
    for(var i=0;i<szIP.length;i++){
        var iRet = WebVideoCtrl.I_Login(szIP[i], 1, szPort[i], szUsername[i], szPassword[i], {
        });
    }
}

//WebVideoCtrl.I_Login()需要传4个值   账号  地址 密码  端口  端口默认是80  可以不传

//我是从后台接收了一个list<model>在JS里面用forEach遍历进Array()

//3.打开页面

function clickStartRealPlay2() {
    for (var i = 0; i < szIP.length; i++) {
        iWndIndex = i;
        var iRet = WebVideoCtrl.I_StartRealPlay(szIP[i], {
            iWndIndex: iWndIndex
        });
    }
//几个账号打开几个窗口
    if (ce02m.length > 9) {
        changeWndNum(4);
    } else {
        if (ce02m.length > 4) {
            changeWndNum(3);
        } else if (ce02m.length > 1){
            changeWndNum(2);
        }else{
            changeWndNum(2);
        }
    }
}

// 窗口分割数
function changeWndNum(iType) {
    iType = parseInt(iType, 10);
    WebVideoCtrl.I_ChangeWndNum(iType);
}
    //WebVideoCtrl.I_StartRealPlay需要传地址  ，这是必须的
    //iWndIndex是选定的窗口号   ，在不传的情况下是默认为0，我用I表示，可以按循环打开固定的窗口号  changeWndNum这个方法是打开几个窗口  默认4种格式  1*1 2*2
    //3*3 4*4根据分别对应参数 1 2 3 4

    //剩下jsp只需要调用一下窗口样式 和映入的js CSS文件

    //<div id="divPlugin" class="plugin"></div>
    //
    //    如果需要调整窗口大小  去CSS里面找到plugin
    //
    //    /*插件*/
    //    .plugin
    //{
    //    width:951.5px;
    //    height:360px;
    //}

    //注意 哦  在加载的时候也要做一次调整   不然窗口是无变化的

// 初始化插件参数及插入插件
//    WebVideoCtrl.I_InitPlugin(951.5, 360, {})


    //OK   功能完美实现