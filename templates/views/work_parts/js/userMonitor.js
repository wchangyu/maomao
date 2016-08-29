/**
 * Created by went on 2016/8/2.
 */
var userMonitor = function(){

    var _urlPrefix = sessionStorage.apiUrlPrefix;
    _urlPrefix = "http://211.100.28.180/BEEWebAPI/api/";        //TODO:临时使用
    _urlPrefix = "http://localhost/BEEWebApi/api/";        //TODO:临时使用
    var _userProcIds;       //当前用户的监控方案权限
    var _configArg1 = 2;        //配置文件中配置的类型，取值为0:启用监控类型;1:启用|隔开的监控方案ID;2:启用混合模式
    var _configArg2 = "5";       //配置文件中配置的参数，取值对应_configType 0:类型ID;1:|隔开的监控方案ID;2:1代表初始方案类型
    var _configArg3 = "0";      //配置文件中配置的参数3,取值对应默认选中方案
    var _hasControlAuth = false;      //用户是否有控制的权限
    var _isViewAllProcs = false;       //用户是否可以查看所有的监控方案
    _isViewAllProcs = true;  //TODO:临时使用

    var _allProcs;      //全部监控方案
    //当前监控方案的子项目载入标志
    var _isProcDefLoaded = false,_isProcCrtlLoaded = false,_isProcRenderLoaded = false;
    var _procDefs;      //当前方案的defs对象
    var _procCtrls;     //当前方案的ctrls 控制按钮
    var _procRenders;   //当前方案的渲染信息
    var _isInstDataLoading = false;      //实时数据载入标识
    var _curProc;       //当前选中监控方案

    var _defInsDataResults; //实时数据进行刷新时使用

    var init = function(){

        //获取到存储区的监控配置信息
        if(sessionStorage.menuArg){
            var args = sessionStorage.menuArg.split(",");
            if(args){
                _configArg1 = args[0];
                _configArg2 = args[1];
                _configArg3 = args[2] || undefined;
            }
        }
        //获取当前用户的操控权限和访问控制方案的权限
        if(sessionStorage.userAuth){
            var userAuth = sessionStorage.userAuth;
            if(userAuth.charAt(26)=="1"){
                _hasControlAuth = true;
            }
            if(userAuth.charAt(52) == "1"){
                _isViewAllProcs = true;
            }
        }
        //返回首页
        $(".functions-3").click(function(){
            getUserProcs();
        });
        //刷新数据
        $(".functions-4").click(function(){
            if(!_isInstDataLoading){
                getInstDatasByIds();
            }
        });
    }

    //根据用户名获取当前的监控方案，对应左侧列表
    var getUserProcs = function(){
        var userName = sessionStorage.userName;     //获取当前用户名
        userName = "mrf";   //TODO: 临时
        if(_isViewAllProcs){    //访问全部的监控方案
            getProcs();
        }else{              //根据用户名获取当前用户能查看的监控方案Id
            if(userName){
                $.ajax({
                    type:"post",
                    dataType:"json",
                    data:{'':userName},
                    url:_urlPrefix + "PR/GetUserProcbind",
                    //url:_urlPrefix + "PR/pr_GetAllProcs",
                    success:function(data){
                        //返回结果:Sysuserid:用户名;ProcId:监控方案Id
                        _userProcIds = [];
                        for(var d in data){
                            _userProcIds.push(d.ProcId);
                        }
                        getProcs();
                    },
                    error:function(xhr,res,err){console.log("GetUserProcbind:" + err)}
                });
            }
        }
    };

    //根据配置文件中的分类配置调用方法获取数据
    var getProcs = function(){
        if(_configArg1 == 0){
            getAllProcsByParameter(_configArg2,-1);
        }else if(_configArg1 == 1){
            getAllProcsByProcList(_configArg2);
        }else if(_configArg1 == 2){
            getAllProcs();
        }
    }

    //设置左侧的监控方案列表
    //如果selectedProc为空默认选中第一个，否则选中传值
    var setProcList = function(procs,selectedProc){
        var $ul = $(".content-main-left>ul");
        $(".content-main-left>ul li").remove();
        if(!procs || procs.length==0) return;
        var curProc = selectedProc || undefined;
        if(_isViewAllProcs){
            for(var i=0;i<procs.length;i++){
                $ul.append($("<li>",{text:procs[i].procName}).on("click",(function(procId){
                    return function() {initializeProcSubs(procId);};
                })(procs[i].procID)));
            }
            curProc = curProc || procs[0];
        }else {
            if(_userProcIds){
                var isProcFind = false;
                for(var i=0;i<procs.length;i++){
                    var obj = procs[i];
                    if(_userProcIds.index(obj.procId)>=0){
                        if(!isProcFind){
                            curProc = curProc || obj;
                            isProcFind = true;
                        }
                        $("<li>",{text:obj.procName }).appendTo($ul);
                        $ul.append($("<li>",{text:obj.procName}).on("click",(function(procId){ return function() {initializeProcSubs(procId);}; })(obj.procId)));
                    }
                }
            }
        }
        initializeProcSubs(curProc.procID);//选中默认的监控
        //TODO: 处理当前的li选中情况,css的变动

    }

    //根据定义的方案类型，获取该类型下的监控方案，返回数据
    var getAllProcsByParameter = function(procType,proLv){
        var prms2 = {
            procType:procType,
            proLv:proLv
        };
        $.ajax({
            type:"post",
            dataType:"json",
            data:prms2,
            url:_urlPrefix + "PR/PR_GetAllProcsByParameter",
            success:function(data){ setProcList(data); },
            error:function(xhr,res,err){ console.log("PR_GetAllProcsByParameter:" + err); }
        });
    }

    //根据定义的方案ID字符串，获取监控方案，字符串是|号分隔开
    var getAllProcsByProcList = function(procLists){
        if(procLists){
            $.ajax({
               type:"post",
                data:{"":procLists},
                url:_urlPrefix + "PR/PR_GetAllProcsByProcList",
                success:function(data){ setProcList(data); },
                error:function(xhr,res,err){console.log("PR_GetAllProcsByProcList:" + err);}
            });
        }
    }

    //获取到全部的方案，根据混合模式加载
    var getAllProcs = function(){
        $.ajax({
            type:"post",
            dataType:"json",
            url:_urlPrefix + "PR/PR_GetAllProcsNew",
            success:function(data){
                _allProcs = data;       //暂存全部方案
                var curProcs = getLocalProcsByParameter(_configArg2);   //获取当前菜单配置的方案
                setProcList(curProcs);      //绘制左侧列表
            },
            error:function(xhr,res,err){ console.log("PR_GetAllProcsNew:" + err);}
        })
    }

    //获取到当前配置文件中的类型和层级对应的监控方案数据 一.procType可以是配置文件中的配置参数;二.procType也可以是当前选择监控方案中的属性，procLv是当前选择方案中的属性
    var getLocalProcsByParameter = function(procType,procLv){
        var curProcs = [];
        if(_allProcs){
            var pCnt = _allProcs.length;
            if(procLv){
                for(var i = 0;i < pCnt;i++){
                    if(_allProcs[i].pubProcType==procType && _allProcs[i].pubProcLv==procLv){
                        curProcs.push(_allProcs[i]);
                    }
                }
            }else{
                for(var i = 0;i < pCnt;i++){
                    if(_allProcs[i].pubProcType==procType){
                        curProcs.push(_allProcs[i]);
                    }
                }
            }
        }
        return curProcs;
    }

    //获取当前方案的子项目 def crtl render
    var initializeProcSubs = function(procId){
        if(!procId) return;
        var proc = _.findWhere(_allProcs,{"procID" : procId});        //underscore中的找到第一个匹配元素的方法
        if(!proc) return;
        _curProc = proc;
        //if(!_curProc){          //判断当前的proc与选择的是否一致，一致则不进行下一步获取sub数据
        //    _curProc = proc;
        //}else{
        //    if(_curProc == proc) return;
        //    _curProc = proc;
        //}

        var $divContent = $("#content-main-right");
        var $img = $("#imgProc");
        $img.attr("src","");
        $divContent.empty();

        _isProcCrtlLoaded = false;
        _isProcDefLoaded = false;
        _isProcRenderLoaded = false;
        _isInstDataLoading = false;
        _procDefs = null;
        _procCtrls = null;
        _procRenders = null;
        initializeProcDef(procId);
        initializeProcCtrl(procId);
        initializeProcRender(procId);
        initImg(procId);
    }

    //获取当前方案的定义
    var initializeProcDef = function(procId){
        $.ajax({
           type:"post",
            data:{"" : procId},
            url:_urlPrefix + "PR/PR_GetDefByProcID",
            success:function(data){
                _isProcDefLoaded = true;
                _procDefs = data;
                getInstDatasByIds();
            },
            error:function(xhr,res,err){console.log("PR_GetDefByProcID:" + err)}
        });
    }
    //获取定义中对应的控制
    var initializeProcCtrl = function(procId){
        $.ajax({
            type:"post",
            data:{"" : procId},
            url:_urlPrefix + "PR/PR_GetProcCtrls",
            success:function(data){
                _isProcCrtlLoaded = true;
                _procCtrls = data;
                getInstDatasByIds();
            },
            error:function(xhr,res,err){console.log("PR_GetProcCtrls:" + err)}
        })
    }
    //获取render
    var initializeProcRender = function (procId) {
        $.ajax({
           type:"post",
            data: {"" : procId},
            url:_urlPrefix + "PR/PR_GetProcRenders",
            success:function(data){
                _isProcRenderLoaded = true;
                _procRenders = data;
                getInstDatasByIds();
            },
            error:function(xhr,res,err){console.log("PR_GetProcRenders:" + err)}
        });
    }

    //获取底图
    var initImg = function(procId){
        var proc = _.findWhere(_allProcs,{"procID" : procId});        //underscore中的找到第一个匹配元素的方法
        if(proc){
            if(proc["imgID"] != 1){     //1代表常用方案，此处用==号需要用到隐式转换,1的时候没有底图
                $.ajax({
                    type:"post",
                    data:{"" : proc["imgID"]},
                    url:_urlPrefix + "PR/GetHbProcImage",
                    success:function(data){
                        var oldImg = $("#imgProc"); //如果原来的背景图存在，移除
                        if(oldImg) oldImg.remove();

                        var img = $("<img>");
                        img.attr("src",data["imgUrl"]);
                        img.css("z-index","-9999");
                        img.attr("id","imgProc");       //设置ID，需要获取到该背景图
                        $("#content-main-right").append(img);
                        console.log(data.imgUrl);
                    },
                    error:function(xhr,res,err){ console.log("GetHbProcImage:" + err) }
                });
            }
            //设置div的高和宽
            if(proc.procStyle){
                var $divMain = $("#content-main-right");

                if(proc.procStyle.imageSizeWidth && proc.procStyle.imageSizeWidth>0) {
                    $divMain.css("width", proc.procStyle.imageSizeWidth);
                    $(".total-wrap").css("width",proc.procStyle.imageSizeWidth + 250);
                }else{
                    $divMain.css("width", 1330);
                    //$divMain.css("min-width",1330);
                }
                if(proc.procStyle.imageSizeHeight && proc.procStyle.imageSizeHeight>0){
                    $divMain.css("height",proc.procStyle.imageSizeHeight);
                }else{
                    $divMain.css("height",1051);
                }
                if(proc.procStyle.backColorRGB && proc.procStyle.backColorRGB.length == 8){
                    $divMain.css("background-color","#" + proc.procStyle.backColorRGB.substr(2,6));
                }
            }
        }
    }
    //获取实时数据
    var getInstDatasByIds = function(){
        if(_isProcDefLoaded && _isProcCrtlLoaded && _isProcRenderLoaded && !_isInstDataLoading){
            var CTypeCKIDs = "",DTypeDKIDs = "";        //控制量的ID，监测值的ID
            var DefIDs = [];
            var procRenders = [];
            for(var i = 0;i < _procDefs.length;i++){
                CTypeCKIDs += _procDefs[i]["cType"] + "+" + _procDefs[i]["ckId"] + ",";
                DTypeDKIDs += _procDefs[i]["dType"] + "+" + _procDefs[i]["dkId"] + ",";
                var defObj = {};
                defObj["CKID"] = _procDefs[i]["ckId"];
                defObj["DKID"] = _procDefs[i]["dkId"];
                defObj["ProcDefID"] = _procDefs[i]["prDefId"];
                defObj["ProcID"] = _procDefs[i]["procId"];
                defObj["DType"] = _procDefs[i]["dType"];
                defObj["CType"] = _procDefs[i]["cType"];
                defObj["EnableScriptResult"] = _procDefs[i]["enableScript"];
                defObj["VisibleScriptResult"] = _procDefs[i]["visibleScript"];
                defObj["recservicecfg"] = _procDefs[i]["recservicecfgValue"];
                DefIDs.push(defObj);
            }
            for(i=0;i<_procRenders.length;i++){
                var prr = {};
                prr["ProcDefID"] = _procRenders[i]["prDefId"];
                prr["ProcRenderID"] = _procRenders[i]["id"];
                prr["OutputExpr"] = _procRenders[i]["outPutExpr"];
                prr["Priority"] = _procRenders[i]["priority"];
                prr["Text"] = _procRenders[i]["text"];
                prr["Expression"] = _procRenders[i]["expression"];
                prr["DotNumber"] = _procRenders[i]["dotNumber"];
                prr["Format"] = _procRenders[i]["format"];
                procRenders.push(prr);
            }
            if(CTypeCKIDs!="") CTypeCKIDs = CTypeCKIDs.substr(0,CTypeCKIDs.length - 1);
            if(DTypeDKIDs!="") DTypeDKIDs = DTypeDKIDs.substr(0,DTypeDKIDs.length - 1);

            _isInstDataLoading = true;
            var datas = {
                "DTypeDKIDs":DTypeDKIDs,
                "PRRenders":procRenders,
                "PRDefIDs":DefIDs
            };
            $.ajax({
                type:"post",
                data: datas,
                url:_urlPrefix + "PR/PR_GetInstDataNew",
                success:function(data){
                    _defInsDataResults = data;
                    _isInstDataLoading = false;
                    initializeContentOnDiv(data);
                },
                error:function(xhr,res,err){console.log("PR_GetInstDataNew:" + err);}
            });
        }
    }

    //在界面上绘制数据
    var initializeContentOnDiv = function(defInstDatas){
        if(!_isProcCrtlLoaded || !_isProcDefLoaded || !_isProcRenderLoaded) return;     //没有载入数据完成则退出
        if(!_procDefs || _procDefs.length==0) return;           //没有绘制对象则退出
        /*
        1.绘制之前清除原有的绘制的控件
        * */
        var $divContent = $("#content-main-right");
        var $img = $("#imgProc");
        $divContent.empty();
        $divContent.append($img);

        //根据def绘制对象
        var defLength = _procDefs.length;
        for(var i = 0;i < defLength;i++){
            //显示文本或者图像
            //1.获取当先对象(def)的宽和高

            var defWidth,defHeight;
            var divContentWidth = $divContent.width(),divContentHeight = $divContent.height();
            if(_procDefs[i].sizeFlag==0){     //绝对宽高
                defWidth = _procDefs[i].sizeW;
                defHeight = _procDefs[i].sizeH;
            }else{          //相对宽高
                defWidth = _procDefs[i].sizeW * divContentWidth;
                defHeight = _procDefs[i].sizeH * divContentHeight;
            }
            var $spanDef = $("<span>");     //当前def的显示层
            //$spanDef.css("display","inline-block");
            setFlex($spanDef);
            $spanDef.css("position","absolute");
            $spanDef.css("background","rgba(0,0,0,1)");
            $spanDef.css("width",defWidth);
            $spanDef.css("height",defHeight);
            $spanDef.attr("name",_procDefs[i].prDefId);
            $spanDef.css("left",_procDefs[i].locRX * divContentWidth );
            $spanDef.css("top",_procDefs[i].locRY * divContentHeight);
            var curPD = _.findWhere(_defInsDataResults,{"procDefID":_procDefs[i].prDefId});

            if(curPD){       //从实时数据中提取当前def的信息

                if(curPD.visibleScriptResult){          //是否可见的属性,不显示则继续
                    if(curPD.visibleScriptResult=="0"){
                        continue;
                    }
                }
                var curPRR;     //当前render
                curPRR = _.findWhere(_procRenders,{"id":curPD.procRenderID});
                var curProcDef = _procDefs[i];
                if(curProcDef.dType != 0){
                    //TODO:设置可以查看历史数据的结构
                }
                var curText = curPD.renderExprResult;

                var $Img = $("<img>");      //当前def的图片
                var $Txt = $("<span>");     //当前def的文本
                if(curProcDef.cType == 166){   //判断是不是链接，是链接使用a元素
                    $Txt.css("text-decoration","underline");
                    //$Txt.css("cursor","pointer");
                }
                $Txt.html(curText);
                var $spanImg = $("<span>");     //当前defimg的容器
                var $spanTxt = $("<span>");     //当前deftxt的容器
                setFlexInner($spanImg,{"height":defHeight,"width":"50%"});
                setFlexInner($spanTxt,{"height":defHeight,"width":"50%"});
                $spanDef.append($spanImg);
                $spanDef.append($spanTxt);
                if(curPRR){
                    if(curPRR.showFlag == 1){       //判断前台展示的类型，1为文本，2为图片，3为图片文本
                        $spanTxt.append($Txt);
                        $spanImg.css("width",0);
                        $spanTxt.css("width","100%");
                    }else if(curPRR.showFlag == 2){
                        $spanImg.append($Img);
                        $spanImg.css("width","100%");
                        $spanTxt.css("width",0);
                    }else if(curPRR.showFlag == 3){
                        $spanImg.append($Img);
                        $spanTxt.append($Txt);
                        $spanImg.css("width","50%");
                        $spanTxt.css("width","50%");
                    }
                    if(curPRR.backColorRGB && curPRR.backColorRGB.length == 8){         //背景色设置
                        if(curPRR.backColorRGB.indexOf("00") == 0){
                            $spanDef.css("background-color","rgba(0,0,0,0)");
                        }else {
                            $spanDef.css("background-color","#" + curPRR.backColorRGB.substr(2,6));
                        }

                    }else{
                        $spanDef.css("background-color","rgba(0,0,0,0)");
                    }
                    if(curPRR.foreColorRGB && curPRR.foreColorRGB.length == 8){        //前景色设置
                        $spanDef.css("color","#" + curPRR.foreColorRGB.substr(2,6));
                    }
                    if(curPRR.borderColorRGB && curPRR.borderColorRGB.length == 8){    //边框设置
                        $spanDef.css("border-color","#" + curPRR.borderColorRGB.substr(2,6));
                        $spanDef.css("border-style","solid");
                        $spanDef.css("border-width",curPRR.borderThickness + "px");
                    }
                    $Txt.css("font-family",curPRR.fontName);        //字体设置
                    if(curPRR.fontSize > 0) { $Txt.css("font-size",curPRR.fontSize);}
                    if(curPRR.isFontBold) { $Txt.css("font-weight","bold");}
                    if(curPRR.isFontItalic) { $Txt.css("font-style","italic"); }
                    if(curPRR.isFontUnderline) { $Txt.css("text-decoration","underline"); }


                    //设置外层span(spanImg,spanTxt)的内部元素的对齐
                    function setTextAlignment($ele,align){
                        var topLeft = 1,topCenter = 2,topRight = 4,middleLeft = 16,middleCenter = 32,middleRight = 64,
                            bottomLeft = 256,bottomCenter = 512,bottomRight = 1024;
                        if(align == topLeft){       //默认就是topleft不用处理
                        }else if(align == topCenter){       //只需要处理水平居中
                            $ele.css("-webkit-justify-content","center");
                            $ele.css("justify-content","center");
                        }else if(align == topRight){    //水平居右
                            $ele.css("-webkit-justify-content","flex-end");
                            $ele.css("justify-content","flex-end");
                        }else if(align == middleLeft){      //垂直居中
                            $ele.css ("-webkit-align-items","center");
                            $ele.css ("align-items","center");
                        }else if(align == middleCenter){        //垂直居中 水平居中
                            $ele.css ("-webkit-align-items","center");
                            $ele.css ("align-items","center");
                            $ele.css("-webkit-justify-content","center");
                            $ele.css("justify-content","center");
                        }else if(align == middleRight){         //垂直居中 水平居右
                            $ele.css ("-webkit-align-items","center");
                            $ele.css ("align-items","center");
                            $ele.css("-webkit-justify-content","flex-end");
                            $ele.css("justify-content","flex-end");
                        }else if(align == bottomLeft){      //垂直居底 水平居左
                            $ele.css ("-webkit-align-items","flex-end");
                            $ele.css ("align-items","flex-end");
                        }else if(align == bottomCenter){    //垂直居底 水平居中
                            $ele.css ("-webkit-align-items","flex-end");
                            $ele.css ("align-items","flex-end");
                            $ele.css("-webkit-justify-content","center");
                            $ele.css("justify-content","center");
                        }else if(align == bottomRight){   //垂直居底 水平居右
                            $ele.css ("-webkit-align-items","flex-end");
                            $ele.css ("align-items","flex-end");
                            $ele.css("-webkit-justify-content","flex-end");
                            $ele.css("justify-content","flex-end");
                        }
                    }

                    setTextAlignment($spanDef,curPRR.alignment);
                    setTextAlignment($spanImg,curPRR.imageAlignment);
                }
                if(curPD.enableScriptResult){       //是否可用(可点击)的属性
                    $spanDef.attr("disabled","disabled");
                }else{
                    $spanDef.removeAttr("disabled");
                }
                var curProcCtrl = _.findWhere(_procCtrls,{"prDefId":_procDefs[i].prDefId});
                //如果当前def存在控件或者标签的类型为166（即导航标签），则绘制
                if((curProcCtrl && _procDefs[i].cType>0) || curProcDef.cType==166 || curProcDef.cType==3 || curProcDef.cType==122
                    || curProcDef.cType==100|| curProcDef.cType==133|| curProcDef.cType==131
                ){
                    $spanDef.css("cursor","pointer");
                    $spanDef.on("click",(function(procDef,ele){return function(){ goToProcsByDef(procDef,ele); }})(_procDefs[i],$spanDef));
                }
            }
            $divContent.append($spanDef);
        }
    }

    //根据当前的def跳转到下一级的procs
    var goToProcsByDef = function(procDef,ele){
        if(!procDef) return;
        if(procDef.cType == 166){       //方案跳转
            if(!_isViewAllProcs && _userProcIds.indexOf(procDef.prDefId)<0){
                alert("没有权限");
                return;
            }
            console.log(ele);
            var proc = _.findWhere(_allProcs,{"procID":procDef.ckId});
            if(proc){
                _curProc = proc;
            }else{
                _curProc = null;
            }
            $("#content-main-right").empty();
            displayAllProc();
        }else if(procDef.cType == 3 || procDef.cType == 133 || procDef.cType == 131){       //AO操作
            if(_hasControlAuth){
                if(procDef.cType == 133 || procDef.cType == 131){
                    if(_.findWhere(_procCtrls,{"prDefId":procDef.prDefId})){

                    }
                }
            }
        }else if(procDef.cType == 122){     //全局参数设置

        }else if(procDef.cType == 100){     //空调温控面板设置

        }else{      //绘制控件，例如 开关操作

        }
    }

    //根据数据返回的结果显示所有的监控流程,显示在右边,默认只显示第一等级，可导航改变
    var displayAllProc = function(){
        var procLVs = [],tmpprocLVs = [];
        if(_configArg1){
            if(_configArg1 == "0"){     //按照方案类型获取列表
                if(!_curProc){   //第一次加载，或者导航的对象不存在，那么默认进入第一级展示
                    tmpprocLVs = _.where(_allProcs,{"pubProcLv":0});
                }else{
                    tmpprocLVs = _.where(_allProcs,{"pubProcLv":_curProc.pubProcLv});
                }
                procLVs = _.sortBy(tmpprocLVs,"procOrder");
                setProcList(procLVs,_curProc);
            }else if(_configArg1 == "1"){       //按照指定方案列表获取
                procLVs = _.sortBy(_allProcs,"procOrder");
                setProcList(procLVs,_curProc); //第一次加载，或者导航的对象不存在，那么默认进入第一级展示 ,否则选中当前的

            }else if(_configArg1 == "2"){          //混合模式
                if(!_curProc){       //第一次加载，或者导航的对象不存在，默认进去第一级
                    tmpprocLVs = _.where(_allProcs,{"pubProcLv":0,"pubProcType":_configArg2});
                }else{
                    tmpprocLVs = _.where(_allProcs,{"pubProcLv":_curProc.pubProcLv,"pubProcType":_curProc.pubProcType});
                }
                procLVs = _.sortBy(tmpprocLVs,"procOrder");
                setProcList(procLVs,_curProc);
            }
        }
    }

    //设置每个def外层的flex布局
    var setFlex = function($ele){
        $ele.css("display","flex");
        $ele.css("display","-webkit-box");
        $ele.css("display","-ms-flexbox");
        $ele.css("display","-webkit-flex");
        $ele.css("display","-moz-box");
        $ele.css ("flex-direction","row");
        $ele.css ("-webkit-align-items","center");
        $ele.css ("align-items","center");
        $ele.css ("-webkit-justify-content","flex-start");
        $ele.css ("justify-content","flex-start");
    }

    var setFlexInner = function($ele,options){
        $ele.css("display","flex");
        $ele.css("display","-webkit-box");
        $ele.css("display","-ms-flexbox");
        $ele.css("display","-webkit-flex");
        $ele.css("display","-moz-box");
        if(options){
            for(var attr in options){
                $ele.css(attr,options[attr]);
            }
        }
    }

    init();
    return {
        getUserProcs:getUserProcs
    };
}();