var Login = function() {

    //根据用户权限获取页面展示分户及楼宇信息
    var GetNCOfficeByDepart = function(){

        var userID = '';
        var OfficeIDs = '';
        //从url中获取用户权限
        var depart = window.location.search.split('?')[1];
        if(depart){
            userID = depart.split('&')[0].split('=')[1];
            sessionStorage.userName = userID;
            OfficeIDs = depart.split('&')[1].split('=')[1];

        }else{
            window.location.href = "http://192.168.1.102/ncucas/Authorized.aspx";
            return false;
        }
        $.ajax({
            type:'get',
            url: sessionStorage.apiUrlPrefix + "Office/GetNCOfficeByDepart",
            data:{
                userID:userID,
                OfficeIDs:OfficeIDs
            },
            async:false,
            beforeSend:function(){
                $('#theLoading').modal('show');
            },
            success:function(result){
                $('#theLoading').modal('hide');
                console.log(result);
                if(result){
                    sessionStorage.offices = JSON.stringify(result.officeInfos);
                    sessionStorage.pointers = JSON.stringify(result.pointers);
                    getEnterpriseList();
                    getAllEnergyItems();
                    getMenu();
                }

            },
            error: function (xhr, res, err) {

                console.log(33);
            }
        })
    }

    //根据楼宇列表获取唯一支行列表
    var getEnterpriseList = function(){

        var theArr = JSON.parse(sessionStorage.pointers);
        var enterPriseListArr = [];

        for(var i=0; i<theArr.length; i++){

            var id = theArr[i].enterpriseID;



            var isEnterpriseID  = false;

            for(var j=0; j<enterPriseListArr.length; j++){

                if(enterPriseListArr[j].enterpriseID == id){

                    isEnterpriseID = true;

                    break;
                }

            }
            if(!isEnterpriseID){
                var obj = {
                    enterpriseID : theArr[i].enterpriseID,
                    eprName: theArr[i].eprName
                };

                enterPriseListArr.push(obj)

            }

        }
        var pushArr =  JSON.stringify(enterPriseListArr);
        sessionStorage.setItem("enterPriseList", pushArr);
    };


    //获取到所有分项，list结构，需要时候转成对应的树状结构
    var getAllEnergyItems = function(){
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix + 'EnergyItem/GetAllEnergyItems',
            dataType:'json',
            async:false,
            success:function(eis){
                sessionStorage.energyItems = JSON.stringify(eis);
                //_isEnergyItemsLoaded = true;
                //directToIndex();
            }
        });
    };

    //获取到菜单配置文件
    var getMenu = function(){

        var menuSrc = '../../../assets/local/configs/menu.json';
        $.ajax({
                url:menuSrc,
                type:"get",
                async:false,
                success:function(str){

                    sessionStorage.menuStr = JSON.stringify(str);
                    //_isMenuLoaded = true;

                },
                error:function(xhr,text,err){

                }
            }
        );
    };


    //获取配置文件，保存到存储区域
    var initConfig = function (src) {
        if(sessionStorage.userName){
            return false;
        }
        var configSrc = "../../../assets/local/configs/config.json";
        //保存当前的登录页面，提供给退出登录时候使用
        var curLoginPage = window.location.href;
        curLoginPage = "http://192.168.1.102/ncucas/Authorized.aspx";
        sessionStorage.curLoginPage = curLoginPage;
        configSrc = src || configSrc;
        if(!sessionStorage.apiUrlPrefix){
            $.ajax({
                url: configSrc,
                type: 'get',
                async:false,
                success: function (data) {
                    //获取当前的接口地址
                    var apiUrlPrefix = data["apiUriPrefix"] || "";
                    sessionStorage.apiUrlPrefix = apiUrlPrefix;     //存储到暂存区，在本次session中使用

                    var apiUriPrefixUEditor = data["apiUriPrefixUEditor"] || "";
                    sessionStorage.apiUriPrefixUEditor = apiUriPrefixUEditor;     //存储到暂存区，在本次session中使用

                    ///当前运维的接口地址，没有配置则同上
                    var apiUrlPrefixYW = data["apiUriPrefixYW"] || apiUrlPrefix;
                    sessionStorage.apiUrlPrefixYW = apiUrlPrefixYW;     //存储到暂存区，在本次session中使用

                    //获取当前系统名
                    var systemTitle = data["systemTitle"] || "";
                    sessionStorage.systemName = systemTitle;     //存储到暂存区，在本次session中使用

                    //获取是否在systemTitle的基础上追加企业名称
                    var isShowTitleEprName = data["isShowTitleEprName"] || "";
                    sessionStorage.isShowTitleEprName = isShowTitleEprName;     //存储到暂存区，在本次session中使用

                    //报警弹框
                    var alarmAlert = data["alarmAlert"] || "0";
                    sessionStorage.alarmAlert = alarmAlert;
                    //报警声音
                    var alarmSong = data["alarmSong"] || "0";
                    sessionStorage.alarmSong = alarmSong;

                    //zTree绘制楼宇列表时是否显示全部楼宇
                    var allPointerName = data["allPointerName"] || '';
                    sessionStorage.allPointerName = allPointerName;

                    //是否根据流程图动态绘制菜单
                    var changeMenuByProcs = data["changeMenuByProcs"] || '';
                    sessionStorage.changeMenuByProcs = changeMenuByProcs;

                    //登录后跳转首页配置
                    if(data["indexUrl"]){
                        _indexUrl = data["indexUrl"];
                    }

                    //工单自动刷新开关
                    var gongdanInterval = data["gongdanInterval"] || '';
                    sessionStorage.gongdanInterval = gongdanInterval;

                    //监控信息的刷新时间
                    if(data["refreshInterval"]){ sessionStorage.refreshInterval = data["refreshInterval"];}

                    //系统能耗类型配置，需要与api配置同步
                    var allEnergyType = data["allEnergyType"];

                    var showEnergyType = {};
                    showEnergyType.alltypes = [];

                    showEnergyType.comment = allEnergyType.comment;

                    //提取能耗类型配置isShowItem属性为1的保存到本地会话存储中
                    for(var i=0; i<allEnergyType.alltypes.length; i++){

                        if(allEnergyType.alltypes[i].isShowItem == 1){

                            showEnergyType.alltypes.push(allEnergyType.alltypes[i])
                        }

                    };

                    //if(allEnergyType){
                    //    sessionStorage.allEnergyType = JSON.stringify(allEnergyType);
                    //}

                    if(showEnergyType){
                        sessionStorage.allEnergyType = JSON.stringify(showEnergyType);
                    }

                    var officeEnergyType = data["officeEnergyType"];
                    if(officeEnergyType){
                        sessionStorage.officeEnergyType = JSON.stringify(officeEnergyType);
                    }

                    //首页报警信息的刷新时间
                    if(data["alarmInterval"]){ sessionStorage.alarmInterval = data["alarmInterval"];}
                    //每个页面的标题
                    if(data["pageTitle"]) {sessionStorage.pageTitle = data["pageTitle"];}

                    //系统的theme
                    if(!localStorage.themeColor){
                        var themeColor = data["themeColor"];
                        if(themeColor){
                            localStorage.themeColor = themeColor;
                        }else{
                            localStorage.themeColor = "default";
                        }
                    }
                    //根据用户权限获取对应分户及楼宇信息
                    GetNCOfficeByDepart();
                },
                error: function (xhr, res, err) {

                    //showAlertInfo(err);
                }
            });
        }
        else{
            //根据用户权限获取对应分户及楼宇信息
            GetNCOfficeByDepart();
        }

    }

    return {
        //main function to initiate the module
        init: function() {

            initConfig();
            //handleLogin();
        }

    };

}();