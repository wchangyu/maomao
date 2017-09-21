/**
 * Created by went on 2016/8/2.
 * 2017/7/6 添加modbus支持
 */
var userMonitor = (function(){

    var _urlPrefix = sessionStorage.apiUrlPrefix;
    //_urlPrefix = "http://localhost/BEEWebApi/api/";        //测试临时使用，调用本机地址
    var _userProcIds;       //当前用户的监控方案权限
    var _configArg1 = 0;        //配置文件中配置的类型，取值为0:启用监控类型;1:启用|隔开的监控方案ID;2:启用混合模式
    var _configArg2 = "0";       //配置文件中配置的参数，取值对应_configType 0:类型ID;1:|隔开的监控方案ID;2:1代表初始方案类型
    var _configArg3 = "0";      //配置文件中配置的参数3,取值对应默认选中方案
    var _hasControlAuth = false;      //用户是否有控制的权限
    var _isViewAllProcs = false;       //用户是否可以查看所有的监控方案
    _isViewAllProcs = false;  //是否查看所有数据

    var _allProcs;      //全部监控方案，开启楼宇选择后，为当前楼宇的全部监控方案
    var _allPointerProcs;      //全部楼宇监控方案
    //当前监控方案的子项目载入标志
    var _isProcDefLoaded = false,_isProcCrtlLoaded = false,_isProcRenderLoaded = false;
    var _procDefs;      //当前方案的defs对象
    var _procCtrls;     //当前方案的ctrls 控制按钮
    var _procRenders;   //当前方案的渲染信息
    var _isInstDataLoading = false;      //实时数据载入标识
    var _curProc;       //当前选中监控方案

    var _defInsDataResults; //实时数据进行刷新时使用

    var _isOperating = false;   //标识是否正在操作，操作期间暂停刷新数据

    var _originPageWidth = 0,_originPageHeight = 0;
    const _leftWidth = 250;
    const _headHeight = 62;
    const _scaleStep = 0.05;    //每次点击的变形变化量
    var _scaleX = 1;        //变形比例
    var _refreshInterval = 0;       //数据刷新时间，如果时间为0，则不刷新
    var _refreshAction;


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
        if(sessionStorage.refreshInterval){
            _refreshInterval = parseInt(sessionStorage.refreshInterval);
        }
        //返回首页
        $(".functions-1").click(function(){
            getUserProcs();
        });
        //刷新数据
        $(".functions-2").click(function(){
            if(!_isInstDataLoading){
                getInstDatasByIds();
            }
        });

        $(".functions-3").click(function(){     //全屏操作
            var $content_right = $("#content-main-right");
            var transform = $content_right.css("transform");
            $content_right.css("transform-origin","left top");
            $content_right.css("-webkit-transform-origin","left top");
            if(!transform || transform=='none'){        //没有变形
                _scaleX = 1 + _scaleStep;
                $content_right.css("transform","scale(" + _scaleX + "," + _scaleX + ")");
            }else{
                var s = transform.replace("scale(","").replace(")","").replace("matrix(","").replace(", 0, 0","").replace(", 0, 0","");
                var scales = s.split(",");
                if(scales.length == 2){
                    _scaleX = +scales[0] + _scaleStep;
                    if(_scaleX < 5 && _scaleX < 5){
                        $content_right.css("transform","scale(" + _scaleX + "," + _scaleX + ")");
                    }
                }
            }
            setScaleSign(_scaleX,_scaleStep);
        });

        $(".functions-4").click(function(){
            var $content_right = $("#content-main-right");
            var transform = $content_right.css("transform");
            $content_right.css("transform-origin","left top");
            if(!transform || transform=='none'){        //没有变形
                _scaleX = 1 - _scaleStep;
                $content_right.css("transform","scale(" + _scaleX + "," + _scaleX + ")");
            }else{
                var s = transform.replace("scale(","").replace(")","").replace("matrix(","").replace(", 0, 0","").replace(", 0, 0","");
                var scales = s.split(",");
                if(scales.length == 2){
                    _scaleX = +scales[0] - _scaleStep;
                    if(_scaleX>0 && _scaleX>0){
                        $content_right.css("transform","scale(" + _scaleX + "," + _scaleX + ")");
                    }
                }
            }
            setScaleSign(_scaleX,_scaleStep);
        });

        $(".functions-5").click(function(){
            $("#content-main-right").css({"transform":"","transform-orgin":""});
            _scaleX = 1;
            setScaleSign(1);
        });

        var $pageContext = $(".page-content");
        _originPageWidth = $pageContext.width();
        _originPageHeight = $pageContext.height();
        this.getUserProcs();
    };
    //刷新数据
    var refreshData = function(){
        if(!_isInstDataLoading && _refreshInterval>0){
            if(_refreshAction){ clearTimeout(_refreshAction);}
            _refreshAction = setTimeout(getInstDatasByIds,_refreshInterval * 1000);
        }
    };
    //设置缩小和放大的按钮图标
    var setScaleSign = function(scale,scaleStep){
        var $badge3 = $("#badge-3");
        var $bagde4 = $("#badge-4");
        $badge3.html("");
        $bagde4.html("");
        if(scale == 1){
            $badge3.hide();
            $bagde4.hide();
        }else if(scale > 1){
            $badge3.show();
            $bagde4.hide();
            var sTimes = Math.abs(((scale - 1) / scaleStep)).toFixed();
            $badge3.html(sTimes);
        }else{
            $badge3.hide();
            $bagde4.show();
            var sTimes = Math.abs(((scale - 1) / scaleStep)).toFixed();
            $bagde4.html(sTimes);
        }
    };

    //根据用户名获取当前的监控方案，对应左侧列表
    var getUserProcs = function(){
        var userName = sessionStorage.userName;     //获取当前用户名
        if(_isViewAllProcs){    //访问全部的监控方案
            getProcs();
        }else{              //根据用户名获取当前用户能查看的监控方案Id
            if(userName){
                $.ajax({
                    type:"post",
                    dataType:"json",
                    data:{'':userName},
                    url:_urlPrefix + "PR/GetUserProcbind",
                    success:function(data){ //返回结果:Sysuserid:用户名;ProcId:监控方案Id
                        if(!data || data.length==0){
                            alertMessage("没有分配任何权限");
                            return;
                        }
                        _userProcIds = [];
                        for(var i= 0,l=data.length;i<l;i++){
                            _userProcIds.push(data[i].procId);
                        }
                        getProcs();
                    },
                    error:function(xhr,res,err){logAjaxError("GetUserProcbind",err)}
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
        }else if(_configArg1 == 3){
            var bindKeyId;
            if(_configArg2 == '2'){       //bindType=2时候代表按照楼宇获取
                if(sessionStorage.curPointerId){
                    bindKeyId = sessionStorage.curPointerId;
                }
            }
            if(bindKeyId){
                getAllProcsByBind(_configArg2,bindKeyId);
            }
        }
    };
    //根据绑定类型和绑定值获取到监控方案列表
    var getAllProcsByBind = function(bindType,bindKeyId){
        var prm = {"bindType":bindType,"bindKeyId":bindKeyId};
        $.ajax({
            type:"post",
            data:prm,
            url:_urlPrefix + "PR/PR_GetAllProcsByBindType",
            success:function(data){
                _allProcs = data;       //暂存全部方案
                _allPointerProcs = data;
                //setProcList(_allProcs);
                getProcsByPointerId();
            },
            error:function(xhr,res,err){logAjaxError("PR_GetAllProcsByBindType",res)}
        })
    };

    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    //定义数组删除某个元素的方法
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    //定义查询数组中是否包含某个元素的方法
    Array.prototype.contains = function ( needle ) {
        for (i in this) {
            if (this[i] == needle) return true;
        }
        return false;
    }


    var getProcsByPointerId = function(notSetProcList){
        var pointerId = sessionStorage["curPointerId"];
        var menuusepointer = sessionStorage.menuusepointer;
        if(menuusepointer){
            if(!pointerId){
            }
            else{
                var curPointerProcs = _.where(_allPointerProcs,{'bindType':2,'bindKeyId':pointerId.toString()});
                _allProcs = curPointerProcs;
            }

            //存放获得的所有类型集合
            var pubProcTypeArr = [];
            $(_allProcs).each(function(i,o){
                var typeNum = o.pubProcType;
                if(pubProcTypeArr.contains(typeNum)){

                }else{
                    pubProcTypeArr.push(typeNum)
                }
            });
            //当arg参数为2（全部）时，对流程图根据系统类型进行筛选
            if(_configArg1==2){
                $(_allProcs).each(function(i,o){
                    if(o.pubProcType != _configArg2){
                        _allProcs.remove(o);
                    }
                });
            }
        }
        if(!notSetProcList){
            setProcList(_allProcs);
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
                if(!procs[i].showProcName){
                    $ul.append($("<li>",{text:procs[i].procName,class:'list-group-item','data-procid':procs[i].procID}).on("click",(function(procId){
                        return function() {initializeProcSubs(procId);selectLi($(this));};
                    })(procs[i].procID)));
                }else{
                    $ul.append($("<li>",{text:procs[i].procName,class:'list-group-item','data-procid':procs[i].procID}).on("click",(function(procId){
                        return function() {initializeProcSubs(procId);selectLi($(this));};
                    })(procs[i].procID)));
                }

            }
            curProc = curProc || procs[0];
        }else {
            if(_userProcIds){
                var isProcFind = false;
                for(var i=0;i<procs.length;i++){
                    var obj = procs[i];
                    if(_userProcIds.indexOf(obj.procID)>=0){
                        if(!isProcFind){
                            curProc = curProc || obj;
                            isProcFind = true;
                        }
                        if(!procs[i].showProcName){
                            $ul.append($("<li>",{text:obj.procName,class:'list-group-item','data-procid':procs[i].procID}).on("click",(function(procId){
                                return function() {initializeProcSubs(procId);selectLi($(this));}; })(obj.procID)));
                        }else{
                            $ul.append($("<li>",{text:obj.showProcName,class:'list-group-item','data-procid':procs[i].procID}).on("click",(function(procId){
                                return function() {initializeProcSubs(procId);selectLi($(this));}; })(obj.procID)));
                        }

                    }
                }
            }
        }
        if(curProc){            //可能存在看不到任何监控方案的情况，没有权限
            initializeProcSubs(curProc.procID);//选中默认的监控
            selectLi($('.list-group-item[data-procid="' + curProc.procID  + '"]'));//默认选中的样式
        }
    };

    function selectLi($li){
        $(".list-group-item").removeClass("selected");
        $li.addClass("selected");
    }

    //根据定义的方案类型，获取该类型下的监控方案，返回数据
    var getAllProcsByParameter = function(procType,proLv){
        var prms2 = {
            "procType":procType,
            "proLv":proLv
        };
        $.ajax({
            type:"post",
            dataType:"json",
            data:prms2,
            url:_urlPrefix + "PR/PR_GetAllProcsByParameter",
            success:function(data){
                _allProcs = data;       //暂存全部方案
                _allPointerProcs = data;
                //setProcList(_allProcs);
                getProcsByPointerId();
            },
            error:function(xhr,res,err){ logAjaxError("PR_GetAllProcsByParameter",err); }
        });
    };

    //根据定义的方案ID字符串，获取监控方案，字符串是|号分隔开
    var getAllProcsByProcList = function(procLists){
        if(procLists){
            $.ajax({
               type:"post",
                data:{"":procLists},
                url:_urlPrefix + "PR/PR_GetAllProcsByProcList",
                success:function(data){
                    _allProcs = data;       //暂存全部方案
                    _allPointerProcs = data;
                    //setProcList(_allProcs);
                    getProcsByPointerId();
                },
                error:function(xhr,res,err){logAjaxError("PR_GetAllProcsByProcList",err);}
            });
        }
    };



    //获取到全部的方案，根据混合模式加载
    var getAllProcs = function(){
        $.ajax({
            type:"post",
            dataType:"json",
            url:_urlPrefix + "PR/PR_GetAllProcsNew",
            success:function(data){
                _allProcs = data;       //暂存全部方案
                _allPointerProcs = data;
                var curProcs = getLocalProcsByParameter(_configArg2);   //获取当前菜单配置的方案
                setProcList(curProcs);      //绘制左侧列表
                //_allProcs = curProcs;
                getProcsByPointerId(true);
            },
            error:function(xhr,res,err){ logAjaxError("PR_GetAllProcsNew" , err);}
        })
    };

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
    };

    //获取当前方案的子项目 def crtl render
    var initializeProcSubs = function(procId){
        if(!procId) return;
        var proc = _.findWhere(_allProcs,{"procID" : procId});        //underscore中的找到第一个匹配元素的方法
        if(!proc) return;
        _curProc = proc;

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
    };

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
            error:function(xhr,res,err){logAjaxError("PR_GetDefByProcID" , err)}
        });
    };
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
            error:function(xhr,res,err){logAjaxError("PR_GetProcCtrls" , err)}
        })
    };
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
            error:function(xhr,res,err){logAjaxError("PR_GetProcRenders" , err)}
        });
    };

    //获取底图
    var initImg = function(procId){
        var proc = _.findWhere(_allProcs,{"procID" : procId});        //underscore中的找到第一个匹配元素的方法
        if(proc){
            var imgWidth,imgHeight;
            if(proc.procStyle){
                var $divMain = $("#content-main-right");

                if(proc.procStyle.imageSizeWidth && proc.procStyle.imageSizeWidth>0) {

                    $divMain.width(proc.procStyle.imageSizeWidth);
                    imgWidth = proc.procStyle.imageSizeWidth;


                        /*----------------页面自适应 王常宇修改-----------------*/
                        var norWidth = $('.page-title').width();
                        //实际宽度
                        var realWidth = norWidth - _leftWidth;

                        //缩放比例计算
                        var ratioZoom = realWidth / imgWidth;

                        _scaleX = ratioZoom;
                        setScaleSign(_scaleX,_scaleStep);

                        $(window).resize(function () {          //当浏览器大小变化时
                            var norWidth1 = $('.page-title').width();
                            //实际宽度
                            var realWidth1 = norWidth1 - _leftWidth;
                            //缩放比例计算
                            var ratioZoom1 = realWidth1 / imgWidth;
                            //对左上角放大缩小按钮重绘
                            _scaleX = ratioZoom1;
                            setScaleSign(_scaleX,_scaleStep);

                            $('.content-main-right').css({
                                'transform-origin': 'left top 0px',
                                'transform': 'scale('+ratioZoom1+', '+ratioZoom1+')'
                            })
                            $('.page-content').css({
                                'overflow':'hidden !important'
                            })

                        });


                        $('.content-main-right').css({
                            'transform-origin': 'left top 0px',
                            'transform': 'scale('+ratioZoom+', '+ratioZoom+')'
                        })

                        if((imgWidth + _leftWidth) > _originPageWidth){
                            //$(".page-content").width(imgWidth + _leftWidth);
                            $(".total-wrap").width(imgWidth + _leftWidth);
                            $('.page-content').css({
                                'overflow':'hidden'
                            })
                        }else{
                            //$(".page-content").width(_originPageWidth);
                            $(".total-wrap").width(_originPageWidth);
                            $('.page-content').css({
                                'overflow':'hidden'
                            })
                        }


                }else{
                    $divMain.width( 1330);
                    if((1330 + _leftWidth) > _originPageWidth){
                        //$(".page-content").width(1330 + _leftWidth);
                        $(".total-wrap").width(1330 + _leftWidth);
                        $('.page-content').css({
                            'overflow':'hidden'
                        })
                    }else{
                        //$(".page-content").width(_originPageWidth);
                        $(".total-wrap").width(_originPageWidth);
                        $('.page-content').css({
                            'overflow':'hidden'
                        })
                    }
                }
                if(proc.procStyle.imageSizeHeight && proc.procStyle.imageSizeHeight>0){
                    $divMain.height(proc.procStyle.imageSizeHeight);
                    imgHeight = proc.procStyle.imageSizeHeight;
                    $(".content-main-left").height(imgHeight);
                    if(imgHeight<(_originPageHeight - _headHeight)){
                        //$(".total-wrap").height(_originPageHeight - _headHeight);
                        $(".content-main-left").height(_originPageHeight - _headHeight -20);
                    }else{
                        $(".content-main-left").height(imgHeight -20);
                        //$(".total-wrap").height(imgHeight);
                    }
                }else{
                    $divMain.height(1051);
                    $(".content-main-left").height(1051);
                }
                if(proc.procStyle.backColorRGB && proc.procStyle.backColorRGB.length == 8){
                    $divMain.css("background-color","#" + proc.procStyle.backColorRGB.substr(2,6));
                }
            }

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
                        if(imgWidth){ img.width(imgWidth); }
                        if(imgHeight){ img.height(imgHeight); }
                        //TODO:图片的展示方式 curProc.ProcStyle.ImageLayout 无=0，图片重复=1，居中显示=2，拉伸显示=3，比例放大或缩小=4
                        $("#content-main-right").append(img);
                    },
                    error:function(xhr,res,err){ logAjaxError("bg GetHbProcImage" , err); }
                });
            }
            //设置div的高和宽

        }
    };
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
                error:function(xhr,res,err){logAjaxError("PR_GetInstDataNew" , err);}
            });
        }
    };

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
            $spanDef.css("background","transparent");
            $spanDef.width(defWidth);
            $spanDef.height(defHeight);
            $spanDef.attr("id",_procDefs[i].prDefId);
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
                    $spanDef.attr("data-prdefid",curProcDef.prDefId);
                    $spanDef.on("contextmenu",function(){
                        var e = window.event || event;
                        e.preventDefault();
                        var curprDefId1 = $(this).attr("data-prdefid");
                        var curProcDef1 = _.findWhere(_procDefs,{ "prDefId" : curprDefId1});
                        sessionStorage.historyData_ProcDef = JSON.stringify(curProcDef1);
                        var rBtnPos = getMousePos();
                        setContextMenuVisible(true,rBtnPos[0],rBtnPos[1]);
                    });

                }
                var curText = curPD.renderExprResult;

                if(curText && curText.indexOf("\n")>=0){
                    curText = curText.replace("\n","<br>");
                }

                var $Img = $("<img>");      //当前def的图片
                var $Txt = $("<span>");     //当前def的文本
                if(curProcDef.cType == 166){   //判断是不是链接，是链接使用a元素
                    $Txt.css("text-decoration","underline");
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
                        $spanImg.width(0);
                        $spanTxt.width("100%");
                    }else if(curPRR.showFlag == 2){
                        $Img.css({"width":defWidth,"height":defHeight})
                        $spanImg.append($Img);
                        $spanImg.width("100%");
                        $spanTxt.width(0);
                    }else if(curPRR.showFlag == 3){
                        $Img.css({"width":defWidth / 2,"height":defHeight})
                        $spanImg.append($Img);
                        $spanTxt.append($Txt);
                        $spanImg.width("50%");
                        $spanTxt.width("50%");
                    }
                    $Img.attr("id",curPRR.id + "img");

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
                        if(curPRR.borderColorRGB.indexOf('00') == 0){
                            $spanDef.css("border-width",'0');
                        }else{
                            $spanDef.css("border-width",curPRR.borderThickness + "px");
                        }
                    }
                    $Txt.css("font-family",curPRR.fontName);        //字体设置
                    if(curPRR.fontSize > 0) { $Txt.css("font-size",curPRR.fontSize);}
                    if(curPRR.isFontBold) { $Txt.css("font-weight","bold");}
                    if(curPRR.isFontItalic) { $Txt.css("font-style","italic"); }
                    if(curPRR.isFontUnderline) { $Txt.css("text-decoration","underline"); }
                    if((curPRR.showFlag == 2 || curPRR.showFlag == 3) && curPRR.imgID) { loadDefImg(curPRR, $Img); }        //如果有图片，载入图片

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

                    setTextAlignment($spanTxt,curPRR.alignment);
                    setTextAlignment($spanImg,curPRR.imageAlignment);
                }
                if(curPD.enableScriptResult){       //是否可用(可点击)的属性
                    $spanDef.attr("disabled","disabled");
                }else{
                    $spanDef.removeAttr("disabled");
                }
                var curProcCtrl = _.findWhere(_procCtrls,{"prDefId":_procDefs[i].prDefId});
                //如果当前def存在控件或者标签的类型为166（即导航标签），则绘制
                if((curProcCtrl && curProcDef.cType>0) || curProcDef.cType==166 || curProcDef.cType==3 || curProcDef.cType==122
                    || curProcDef.cType==100|| curProcDef.cType==133|| curProcDef.cType==131
                ){
                    $spanDef.css("cursor","pointer");
                    $spanDef.on("click",(function(procDef){return function(){ setActionByDef(procDef); }})(_procDefs[i]));
                }
            }
            $divContent.append($spanDef);
        }
        refreshData();
    };

    function loadDefImg(curPRR,$Img){
        $Img.addClass(curPRR.imgID + "img");
        $.ajax({
            type:"post",
            data:{"" : curPRR.imgID},
            url:_urlPrefix + "PR/GetHbProcImage",
            success:function(data){
                $Img.attr("src",data["imgUrl"]);
            },
            error:function(xhr,res,err){ logAjaxError("GetHbProcImage" , res) }
        });
    }

    //根据当前的def跳转到下一级的procs
    var setActionByDef = function(procDef){
        if(!procDef) return;
        if(_refreshAction){ clearTimeout(_refreshAction); }
        if(procDef.cType == 166){       //方案跳转
            if(!_isViewAllProcs && _userProcIds.indexOf(procDef.ckId)<0){       //在跳转图中ckId的值就是需要跳转的procID
                alertMessage("没有权限");
                return;
            }
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
                var ptNow = getMousePos();
                if(procDef.cType == 133 || procDef.cType == 131){
                    if(_.findWhere(_procCtrls,{"prDefId":procDef.prDefId})){
                        _isOperating = true;
                        drawControls(procDef.prDefId,ptNow[0],ptNow[1]);
                    }else{      //输入控制
                        drawInputPanel(procDef.prDefId,ptNow[0],ptNow[1]);
                    }
                }else{      //输入控制
                    drawInputPanel(procDef.prDefId,ptNow[0],ptNow[1]);
                }
            }else{
                alertMessage("没有权限");
            }
        }else if(procDef.cType == 122){     //全局参数设置
            _ptForGlobalPara = getMousePos();
            if(_hasControlAuth){
                $.ajax({
                    type:"post",
                    data:{"" : procDef.ckId},
                    url: _urlPrefix + "PR/pr_GetPRGlobalParas",
                    success:function(data){
                        drawGlobalParaPanel(data,_ptForGlobalPara[0],_ptForGlobalPara[1]);
                    },
                    error:function(xhr,res,err){ logAjaxError("pr_GetPRGlobalParas",err); }
                });
            }else{
                alertMessage("没有权限");
            }
        }else if(procDef.cType == 100 || procDef.cType==99){     //空调温控面板设置，modbus
            if(_hasControlAuth){
                _airClickPos = getMousePos();       //获取当前的鼠标点，保存
                $.ajax({
                   type:"post",
                    data:{
                        "ckid":procDef.ckId,
                        "prDefId":procDef.prDefId
                    },
                    url:_urlPrefix + "PR/GetAirPtProp",
                    success:function(data){
                        if(!data){ return; }
                        _isOperating = true;
                        if(data.flag==1){       //绘制空调面板
                            drawControls(data.prDefId,_airClickPos[0],_airClickPos[1],true);
                        }else if(data.flag==2){      //绘制控制面板
                            var curCtrlstmp = _.findWhere(_procCtrls,{'prDefId':data.prDefId});
                            var curCtrls = (_.sortBy(curCtrlstmp,'showOrder')).reverse();
                            if(!curCtrls || curCtrls.length==0){
                                //绘制modbus面板
                                drawModbusPanel(data.prDefId,data.inputDataNum,_airClickPos[0],_airClickPos[1]);
                            }else{
                                drawControls(data.prDefId,_airClickPos[0],_airClickPos[1]);
                            }

                        }
                    },
                    error:function(xhr,res,err){ logAjaxError("GetAirPtProp" , err); }
                });
            }else{
                alertMessage("没有权限");
            }
        }else{      //绘制控件，例如 开关操作
            if(_hasControlAuth){
                _isOperating = true;
                var ptNow = getMousePos();
                drawControls(procDef.prDefId,ptNow[0],ptNow[1]);
            }else{
                alertMessage("没有权限");
            }
        }
    };

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
    };

    //获取鼠标坐标，left,top
    var getMousePos = function(){
        var e= event || window.event;
        var pt = [];
        pt.push(e.clientX);
        pt.push(e.clientY);
        var root = document.getElementById("content-main-right");
        var rect = root.getBoundingClientRect();        //获取根元素相对文档的偏移
        pt[0] = pt[0] - rect.left + root.scrollLeft;        //最后再加上滚动条的距离
        pt[1] = pt[1] - rect.top + root.scrollTop;
        return pt;
    };

    //根据当前defID绘制控件
    var drawControls = function(prDefID,left,top,isAir){
        //组建当前def的ctrl,以鼠标点为左上角，组建一个3行的显示，其中第一列为"控制选项"标题
        var $contentmain = $("#content-main-right");
        var $divCtrls = setCtrlPanel($contentmain,left,top);

        var curCtrls = _.filter(_procCtrls,function(ctrl){ return ctrl.prDefId==prDefID});      //字符串无法转成long型数字
        curCtrls = _.sortBy(curCtrls,function(ctrl){return -ctrl.showOrder});       //按照显示顺序从大到小排序
        if(!isAir){         //非空调温控按钮的情况，如果没有控制，则不绘制
            if(!curCtrls || curCtrls.length==0){ return;}
        }

        if($divCtrls.attr("data-prdefid") == prDefID && $divCtrls.attr("data-ctrltype") == "ctrl"){      //如果当前的def控制已经绘制，直接显示
            setDivControlsVisible(true);
            return;
        }
        $divCtrls.attr("data-prdefid",prDefID);     //设置当前divCtrls的defID
        $divCtrls.attr("data-ctrltype","ctrl");
        $divCtrls.empty();

        var ccCount = curCtrls.length;
        var $table = $("<table>");      //生成显示table
        var $caption = $("<caption style='font-size:12px;color:blue;'>控制选项</caption>");
        $table.append($caption);
        if(!isAir){
            if(ccCount<3){
                $divCtrls.css({"width" : "160px","height" : "120px"});
                var baseWidth = 79, baseHeight = 38;       //基础宽高
                var $tr = $("<tr>");
                for(var i=0;i<ccCount;i++){
                    var curCtrl = curCtrls[i];
                    var $td = $("<td>");
                    var $btn = setCtrlButton(curCtrl,baseWidth,baseHeight);
                    $td.append($btn);
                    $tr.append($td);
                }
                $tr.appendTo($table);
            }else{
                var baseWidth = 49, baseHeight = 38;       //基础宽高
                for(var r = 0;r < ccCount;r += 3){      //按照三列设计
                    var $tr = $("<tr name='" + r + "'>");
                    for(var c = 0; c < 3 && r+c<ccCount;c++){     //添加各个ctrl的按钮
                        var curCtrl = curCtrls[r + c];
                        var $td = $("<td>");
                        var $btn = setCtrlButton(curCtrl,baseWidth,baseHeight);
                        $td.append($btn);
                        $tr.append($td);
                    }
                    $table.append($tr);
                }
                $divCtrls.css({"width" : "160px","height" : (ccCount / 3 * 40 + 80) + "px"});   //80为多一行+标题行
            }
        }else{      //空调面板
            var baseWidth = 39,baseHeight = 38;       //基础宽高
            var highTemp = 29,temp = 15;
            for(var r =0;r<4,temp<highTemp;r+=4){
                var $tr = $("<tr name='" + r + "'>");
                for(var c=0; c < 4 && temp<highTemp;c ++){
                    var $td = $("<td>");
                    var $btn = setAirTempButton(prDefID,temp,baseWidth,baseHeight);
                    temp += 1;
                    $td.append($btn);
                    $tr.append($td);
                }
                $table.append($tr);
            }
            $divCtrls.css({"width" : "160px","height" : (15 / 4 * 40 + 40) + "px"});
        }
        $divCtrls.append($table);
        setDivControlsVisible(true);
    };
    //绘制输入的控制面板
    var drawInputPanel = function(prDefId,left,top){
        //组建当前def的ctrl,以鼠标点为左上角，组建一个3行的显示，其中第一列为"控制选项"标题
        var $contentmain = $("#content-main-right");
        var $divCtrls = setCtrlPanel($contentmain,left,top);
        var curProcDef = _.findWhere(_procDefs,{"prDefId" : prDefId});
        if(!curProcDef){ return; }
        if($divCtrls.attr("data-prdefid") == prDefId && $divCtrls.attr("data-ctrltype") == "input" ){      //如果当前的def控制已经绘制，直接显示
            setDivControlsVisible(true);
            return;
        }
        $divCtrls.attr("data-prdefid",prDefId);     //设置当前divCtrls的defID
        $divCtrls.attr("data-ctrltype","input");
        $divCtrls.empty();
        $divCtrls.css({"width":"300px","height":"200px"});
        var $table = $("<table>");      //生成显示table
        var $caption = $("<caption style='font-size:12px;color:blue;'>输入参数</caption>");
        $table.append($caption);
        var $btnOK = $("<button>"),$btnCancel = $("<button>");
        $btnOK.attr("data-prdefid",prDefId);            //将当前def的id绑定到OK按钮上
        if((curProcDef.cType == 133 || curProcDef.cType == 131) && curProcDef.recservicecfgValue){
            $btnOK.attr("data-datatype",curProcDef.recservicecfgValue.dataType);
            if(curProcDef.recservicecfgValue.dataType == 1){        //布尔型
                $table.css({"width":"270px","height":"190px;"});
                var $tr = $("<tr>"),$td = $("<td>");
                $td.css("text-align","center");
                var htmlBool = '<span><label>请选择:</label><input type="radio" id="ctrl-panel-on" name="def" value="开">开';
                htmlBool += '<input type="radio" name="def" value="关">关</span>';
                $td.append(htmlBool);
                $tr.append($td);
                $tr.appendTo($table);
            }else if(curProcDef.recservicecfgValue.dataType == 2 || curProcDef.recservicecfgValue.dataType == 3){       //整数或者浮点
                //$table.css({"width":"270px","height":"190px;"});
                var $tr = $("<tr>"),$td = $("<td>");        //输入提示行
                $td.css("text-align","left");
                var htmlP = "<p id='ctrl-panel-p' style='font-weight: bold;color:red;'>请输入有效的范围值(" + curProcDef.recservicecfgValue.minValue +  "-" + curProcDef.recservicecfgValue.maxValue + ")</p>";
                $td.append(htmlP);
                $tr.append($td);
                $tr.appendTo($table);
                var $tr1 = $("<tr>"),$td1 = $("<td>");          //输入框
                var htmlTextarea = '<textarea id="ctrl-panel-textarea" cols="36" rows="5" autofocus></textarea>';
                $td1.append(htmlTextarea);
                $tr1.append($td1);
                $tr1.appendTo($table);
            }else if(curProcDef.recservicecfgValue.dataType == 5){      //日期
                $table.css({"width":"270px","height":"190px"});
                var $tr = $("<tr>"),$td = $("<td>");
                $td.css("text-align","center");
                var htmlTime = "<span>启动时间</span>&nbsp;&nbsp;&nbsp;&nbsp;";
                htmlTime += "<input id='ctrl-panel-hour' type='text' maxlength='2' style='width:40px;' autofocus><span>时</span>";
                htmlTime += "<input id='ctrl-panel-minute' type='text' maxlength='2' style='width:40px;'><span>分</span>";
                htmlTime += "<br><span style='color:red;'>填写格式:(00-23)时(00-59)分</span>";
                //htmlTime += "<select id='ctrl-panel-hour'>";
                //for(var i=0;i<24;i++){
                //    htmlTime += "<option>" + (i > 9 ? "" + i : "0" + i) + "</option>";
                //}
                //htmlTime += "</select><span>时</span><select id='ctrl-panel-minute'>";
                //for(var i=0;i<60;i++){
                //    htmlTime += "<option>" + (i > 9 ? "" + i : "0" + i ) + "</option>"
                //}
                //htmlTime += "</select><span>分</span>"
                $td.append(htmlTime);
                $tr.append($td);
                $tr.appendTo($table);
            }
        }else{      //输入字符串信息
            var $tr1 = $("<tr>"),$td1 = $("<td>");          //输入框
            var htmlTextarea = '<textarea id="ctrl-panel-textarea" cols="50" rows="10" autofocus></textarea>';
            $td1.append(htmlTextarea);
            $tr1.append($td1);
            $tr1.appendTo($table);
        }
        var $trButtons = $("<tr>"),$tdButtons = $("<td>");         //确定 取消 按钮列
        $tdButtons.css("text-align","right");
        $btnOK.addClass("btn").addClass("btn-default");         //设置按钮的样式
        $btnCancel.addClass("btn").addClass("btn-default");
        var btnStyle = {
            "padding" : "0 0",
            "background-color" : "#09a4d8",
            "color" : "#0000FF",
            "width" : "100px",
            "height" : "24px"
        };
        $btnOK.css(btnStyle);$btnOK.html("确定");
        $btnCancel.css(btnStyle);$btnCancel.html("取消");
        $btnCancel.on("click",function(){ setDivControlsVisible(false);});       //cancel按钮关闭当前
        $btnOK.on("click",function(){           //ok按钮,找到当前界面的字符串，调用sendCommand接口方法
            var $this = $(this),isClosePanel = false,curInputData;
            var curDefId = $this.attr("data-prdefid"),curDataType = $this.attr("data-datatype");
            var curDef = _.findWhere(_procDefs,{"prDefId" : curDefId});
            if(curDataType == 1){       //布尔
                var boolFlag = 0;
                if($("#ctrl-panel-on").attr("checked") == "checked") { boolFlag = 1; }
                curInputData = boolFlag * curDef.recservicecfgValue.cofA + parseFloat(curDef.recservicecfgValue.cofB);
                isClosePanel = true;
            }else if(curDataType == 2 || curDataType == 3){     //整数 浮点数
                var taVal = $("#ctrl-panel-textarea").val();
                if(taVal == +taVal){       //判断是否数字
                    taVal = parseFloat(taVal);
                    if(taVal >= curDef.recservicecfgValue.minValue && taVal <= curDef.recservicecfgValue.maxValue){       //输入了合法范围的数字
                        isClosePanel = true;
                        curInputData = taVal * curDef.recservicecfgValue.cofA + parseFloat(curDef.recservicecfgValue.cofB);
                    }else{
                        alertMessage("请输入有效范围的参数!");
                        return;
                    }
                }else{
                    alertMessage("请输入有效的数字!");
                    return;
                }
            }else if(curDataType == 5){         //时间
                var hour = $("#ctrl-panel-hour").val();
                var minute = $("#ctrl-panel-minute").val();
                if(hour.match(/[0-1]\d|2[0-3]/g) && minute.match(/\d|[0-5]\d/g)){
                    isClosePanel = true;
                    curInputData = hour + minute;
                }else{
                    alertMessage("请输入正确的时间");
                    return;
                }
            }else{      //字符串
                curInputData = $("#ctrl-panel-textarea").val();
                if(!curInputData){
                    alertMessage("请输入参数!");
                    return;
                }else{
                    isClosePanel = true;
                }
            }
            if(curInputData || curInputData==0){       //如果有发送的数据，则调用sendCommand
                _isOperating = true;
                var cmdPrm = {
                    "setValue2" : curInputData,
                    "CKID" : curDef.ckId,
                    "ctype" : curDef.cType
                };
                $.ajax({
                    type : "post",
                    data : cmdPrm,
                    url : _urlPrefix + "PR/SendCtrlCommand",
                    success : function(data){
                        _isOperating = false;
                    },
                    error: function(xhr,res,err){
                        logAjaxError("SendCtrlCommand" , err);
                        _isOperating = false;
                    }
                });
            }
            if(isClosePanel){ setDivControlsVisible(false); }
        });
        $tdButtons.append($btnOK);$tdButtons.append($btnCancel);
        $trButtons.append($tdButtons);$trButtons.appendTo($table);
        $divCtrls.append($table);
        setDivControlsVisible(true);
    };

    //绘制全局参数的控制面板
    var drawGlobalParaPanel = function(glbPara,left,top){
        _GlobalPara = glbPara;      //将globalpara存到当前类的全局变量中
        var $contentmain = $("#content-main-right");
        var $divCtrls = setCtrlPanel($contentmain,left,top);
        var prDefId = glbPara.id;
        if($divCtrls.attr("data-prdefid") == prDefId && $divCtrls.attr("data-ctrltype") == "globalpara" ){      //如果当前的def控制已经绘制，直接显示
            setDivControlsVisible(true);
            return;
        }
        $divCtrls.attr("data-prdefid",prDefId);     //设置当前divCtrls的defID
        $divCtrls.attr("data-ctrltype","globalpara");
        $divCtrls.empty();
        $divCtrls.css({"width":"300px","height":"200px"});
        var $table = $("<table>");      //生成显示table
        var $caption = $("<caption style='font-size:12px;color:blue;'>输入参数</caption>");
        $table.append($caption);
        var $btnOK = $("<button>"),$btnCancel = $("<button>");
        $btnOK.attr("data-globalparaid",glbPara.id);
        var $tr = $("<tr>"),$td = $("<td>");        //输入提示行
        $td.css("text-align","center");
        var htmlName = '<span>' + glbPara.name + '</span>';
        $td.append(htmlName);
        $td.appendTo($tr);
        $tr.appendTo($table);
        var $tr1 = $("<tr>"),$td1 = $("<td>");        //输入提示行
        $td1.css("text-align","center");
        var htmlTextarea = '<textarea id="ctrl-panel-textarea" cols="36" rows="4" autofocus>' + glbPara.value + '</textarea>';
        $td1.append(htmlTextarea);
        $td1.appendTo($tr1);
        $tr1.appendTo($table);
        var $tr2 = $("<tr>"),$td2 = $("<td>");        //输入提示行
        $td2.css("text-align","left");
        var htmlP = "<p id='ctrl-panel-p' style='font-weight: bold;color:red;'>取值范围,(最小值:" + glbPara.minValue +  " 至最大值:" + glbPara.maxValue + " )</p>";
        $td2.append(htmlP);
        $tr2.append($td2);
        $tr2.appendTo($table);
        var $trButtons = $("<tr>"),$tdButtons = $("<td>");         //确定 取消 按钮列
        $tdButtons.css("text-align","right");
        $btnOK.addClass("btn").addClass("btn-default");         //设置按钮的样式
        $btnCancel.addClass("btn").addClass("btn-default");
        var btnStyle = {
            "padding" : "0 0",
            "background-color" : "#09a4d8",
            "color" : "#0000FF",
            "width" : "100px",
            "height" : "24px"
        };
        $btnOK.css(btnStyle);$btnOK.html("确定");
        $btnCancel.css(btnStyle);$btnCancel.html("取消");
        $btnCancel.on("click",function(){ setDivControlsVisible(false);});       //cancel按钮关闭当前
        $btnOK.on("click",function(){
            if(_GlobalPara && _GlobalPara.id == $(this).attr("data-globalparaid")){
                var taVal = $("#ctrl-panel-textarea").val();
                if(!taVal){alertMessage("请输入值!");return;}
                if(taVal == +taVal){
                    if(taVal == _GlobalPara.value){ return; }       //值没有更改
                    if(taVal>_GlobalPara.minValue && taVal<_GlobalPara.maxValue){
                        $.ajax({
                           type:"post",
                            data: {
                                "value": taVal,
                                "id": _GlobalPara.id,
                                "type": _GlobalPara.type
                            },
                            url: _urlPrefix + "PR/SendGlobalParaCmd",
                            success:function(data){
                                setDivControlsVisible(false);
                            },
                            error:function(xhr,res,err){
                                logAjaxError("SendGlobalParaCmd",err);
                                alertMessage("数据更新失败!");
                            }
                        });
                    }else{
                        alertMessage("请输入有效范围的参数!");
                    }
                }else{
                    alertMessage("请输入有效的数字!");
                }
            }
        });
        $tdButtons.append($btnOK);$tdButtons.append($btnCancel);
        $trButtons.append($tdButtons);
        $trButtons.appendTo($table);
        $divCtrls.append($table);
        setDivControlsVisible(true);
    };

    //绘制modbus的控制面板
    var drawModbusPanel = function(prDefId,inputDataNum,left,top){
        var $contentmain = $("#content-main-right");
        var $divCtrls = setCtrlPanel($contentmain,left,top);
        if($divCtrls.attr("data-prdefid") == prDefId && $divCtrls.attr("data-ctrltype") == "modbus" ){      //如果当前的def控制已经绘制，直接显示
            setDivControlsVisible(true);
            return;
        }
        $divCtrls.attr("data-prdefid",prDefId);     //设置当前divCtrls的defID
        $divCtrls.attr("data-ctrltype","modbus");
        $divCtrls.empty();
        $divCtrls.css({"width":"300px","height":"300px"});
        var $table = $("<table>");      //生成显示table
        var prd = _.findWhere(_procDefs,{"prDefId":prDefId});
        var title = "输入值(回车换行):";
        if(prd){
            title = prd.prDefNM + " " + title;
        }
        var $caption = $("<caption style='font-size:12px;color:blue;'>输入值</caption>");
        $table.append($caption);
        var $btnOK = $("<button>"),$btnCancel = $("<button>");
        $btnOK.attr("data-prdefid",prDefId);
        $btnOK.attr("data-inputnum",inputDataNum);
        var $tr = $("<tr>"),$td = $("<td>");        //输入提示行
        $td.css("text-align","center");
        var htmlName = '<span>' + title + '</span>';
        $td.append(htmlName);
        $td.appendTo($tr);
        $tr.appendTo($table);

        var $tr1 = $("<tr>"),$td1 = $("<td>");        //输入提示行
        $td1.css("text-align","center");
        var htmlTextarea = '<textarea id="ctrl-panel-textarea" cols="36" rows="10"  wrap="physical" autofocus></textarea>';
        $td1.append(htmlTextarea);
        $td1.appendTo($tr1);
        $tr1.appendTo($table);
        var $tr2 = $("<tr>"),$td2 = $("<td>");        //输入提示行
        $td2.css("text-align","left");
        var htmlP = "<p id='ctrl-panel-p' style='font-weight: bold;color:red;'>读取数据的最大行数:(" + inputDataNum +  ")</p>";
        $td2.append(htmlP);
        $tr2.append($td2);
        $tr2.appendTo($table);

        var $trButtons = $("<tr>"),$tdButtons = $("<td>");         //确定 取消 按钮列
        $tdButtons.css("text-align","right");
        $btnOK.addClass("btn").addClass("btn-default");         //设置按钮的样式
        $btnCancel.addClass("btn").addClass("btn-default");
        var btnStyle = {
            "padding" : "0 0",
            "background-color" : "#09a4d8",
            "color" : "#0000FF",
            "width" : "100px",
            "height" : "24px"
        };
        $btnOK.css(btnStyle);$btnOK.html("确定");
        $btnCancel.css(btnStyle);$btnCancel.html("取消");
        $btnCancel.on("click",function(){ setDivControlsVisible(false);});       //cancel按钮关闭当前

        $btnOK.on("click",function(){
            var taVal = $("#ctrl-panel-textarea").val();
            if(!taVal){alertMessage("请输入值!");return;}
            var prDefId = $(this).attr("data-prdefid");
            var inputDataNum = $(this).attr("data-inputnum");
            //检验换行符的个数
            var reg=/\n|\r/g;
            var arr = taVal.split('\n');
            var isAllNum = true;
            var paras = "";     //指令字符串
            for(var i= 0,len = arr.length;i<len && i<inputDataNum;i++){      //判断每行是不是数字
                if(arr[i] != +arr[i] && i<(len-1)){
                    isAllNum = false;
                    alertMessage('第'+(i+1) + '行不是数字');
                    break;
                }
                paras += arr[i] + ",";
            }
            if(isAllNum && paras!=""){
                var prd = _.findWhere(_procDefs,{"prDefId":prDefId});
                paras = paras.substring(0,paras.length - 1);
                $.ajax({
                    type:'post',
                    data:{
                        "setValue" : paras,
                        "CKID" : prd.ckId,
                        "ctype" : prd.cType
                    },
                    url:_urlPrefix + "PR/SendCtrlCommand",
                    success:function(data){
                        setDivControlsVisible(false);
                    },
                    error:function(xhr,res,err){
                        logAjaxError("SendModbusCmd",err);
                        alertMessage("发送指令失败!");
                    }
                }
                );
            }
        });
        $tdButtons.append($btnOK);$tdButtons.append($btnCancel);
        $trButtons.append($tdButtons);
        $trButtons.appendTo($table);
        $divCtrls.append($table);
        setDivControlsVisible(true);
    }

    //设置主面板的点击事件，隐藏面板
    function setMainClick($contentmain,panelId){//鼠标移除隐藏事件
        $contentmain.unbind("click");
        if(panelId === 'content-ctrls'){
            $contentmain.on("click",function(){
                var e= event || window.event;
                var mLeft = e.clientX,mTop = e.clientY;     //鼠标位置
                var divCtrl = document.getElementById("content-ctrls");
                if(divCtrl){        //计算鼠标位置是不是在当前的控制框内，如果不在隐藏
                    var rect = divCtrl.getBoundingClientRect();
                    if(mLeft<rect.left || mLeft>rect.right || mTop<rect.top || mTop>rect.bottom){
                        setDivControlsVisible(false);
                        setContextMenuVisible(false);       //隐藏掉当前的控件面板或者右键菜单
                    }
                }
            });
        }else if(panelId === 'content-menu'){
            $contentmain.on("click",function(){
                var e= event || window.event;
                var mLeft = e.clientX,mTop = e.clientY;     //鼠标位置
                var divCtrl = document.getElementById("content-menu");
                if(divCtrl){        //计算鼠标位置是不是在当前的控制框内，如果不在隐藏
                    var rect = divCtrl.getBoundingClientRect();
                    if(mLeft<rect.left || mLeft>rect.right || mTop<rect.top || mTop>rect.bottom){
                        setContextMenuVisible(false);
                        setDivControlsVisible(false);       //隐藏掉当前的控件面板或者右键菜单
                    }
                }
            });
        }
    }


    //初始设置控制面板
    function setCtrlPanel($contentmain,left,top){
        //组建当前def的ctrl,以鼠标点为左上角，组建一个3行的显示，其中第一列为"控制选项"标题
        var $divCtrls = $("#content-ctrls");
        if($divCtrls.length == 0){
            $divCtrls = $("<div id='content-ctrls'>");
            //$divCtrls.attr('id','content-ctrls');
            $divCtrls.appendTo($contentmain);
        }
        $divCtrls.css({     //将顶点减一保证鼠标当前在控制面板的范围内
            "left" : ((left - 1) / _scaleX) + "px",
            "top"  : ((top - 1) / _scaleX) + "px"
        });
        return $divCtrls;
    }

    //设置空调面板温度按钮
    var setAirTempButton = function(prDefId,temp,baseWidth,baseHeight){
        var $btn = $("<button>");
        $btn.html(temp);
        $btn.attr("name",temp);
        $btn.css("height",baseHeight + "px");
        $btn.css("width",baseWidth + "px");
        $btn.addClass("btn");
        $btn.addClass("btn-default");
        $btn.css("padding","0 0");
        $btn.css("background-color","#09a4d8");
        $btn.css("color","#0000FF");
        $btn.attr("data-temp",temp);
        $btn.attr("data-prdefid",prDefId);
        $btn.on("click",function(){
            var tmp = this.getAttribute("data-temp");
            var prDefId = this.getAttribute("data-prdefid");
            if(tmp && prDefId){
                _isOperating = true;
                var prd = _.findWhere(_procDefs,{"prDefId":prDefId});
                if(!prd) { return;}
                var cmdDatas = {
                    "setValue" : tmp,
                    "setValueType" : 1,
                    "CKID" : prd.ckId,
                    "ctype" : prd.cType
                };
                $.ajax({            //发送控制指令
                    type : "post",
                    data : cmdDatas,
                    url : _urlPrefix + "PR/SendCommand",
                    success : function(data){
                        _isOperating = false;
                    },
                    error: function(xhr,res,err){
                        logAjaxError("SendCommand" , err);
                        _isOperating = false;
                    }
                });
                setDivControlsVisible(false);       //发送指令后隐藏控制面板
            }
        });
        return $btn;
    };

    //设置控制按钮
    var setCtrlButton = function(curCtrl,baseWidth,baseHeight){
        var $btn = $("<button>");
        $btn.html(curCtrl.text);
        $btn.attr("id",curCtrl.id);
        $btn.css("height",baseHeight + "px");
        $btn.css("width",baseWidth + "px");
        $btn.addClass("btn");
        $btn.addClass("btn-default");
        $btn.css("padding","0 0");
        if(curCtrl.backColorRGB && curCtrl.backColorRGB.length == 8){       //设置背景色
            $btn.css("background-color","#" + curCtrl.backColorRGB.substr(2,6));
        }else{
            $btn.css("background-color","#09a4d8");
        }
        if(curCtrl.foreColorRGB && curCtrl.foreColorRGB.length == 8){       //设置前景色
            $btn.css("color","#" + curCtrl.foreColorRGB.substr(2,6));
        }else{
            $btn.css("color","#0000FF");
        }
        $btn.attr("data-ctrlid",curCtrl.id);
        $btn.on("click",function(){
            var ctrlid = this.getAttribute("data-ctrlid");      //获取当前按钮绑定的控制按钮id
            var ppc = _.findWhere(_procCtrls,{"id":ctrlid});
            if(ppc){
                _isOperating = true;
                var setValue = ppc.setValue;
                var prd = _.findWhere(_procDefs,{"prDefId":ppc.prDefId});
                if(!prd) { return;}
                var cmdDatas = {
                      "setValue" : setValue,
                      "setValueType" : 1,
                      "CKID" : prd.ckId,
                      "ctype" : prd.cType
                };
                $.ajax({            //发送控制指令
                    type : "post",
                    data : cmdDatas,
                    url : _urlPrefix + "PR/SendCommand",
                    success : function(data){
                        _isOperating = false;
                    },
                    error: function(xhr,res,err){
                        logAjaxError("SendCommand" , err);
                        _isOperating = false;
                    }
                })
            }
            setDivControlsVisible(false);       //发送指令后隐藏控制面板
        });
        return $btn;
    };

    //显示或者隐藏控制按钮的承载div
    var setDivControlsVisible = function(flag){
        var $divCtrls = $("#content-ctrls");
        if($divCtrls.length === 0) {return;}
        if(flag){       //打开控制面板
            setContextMenuVisible(false);       //隐藏掉可能的右键菜单
            $divCtrls.removeClass("content-ctrls-hide");
            $divCtrls.addClass("content-ctrls-show");
            setMainClick($("#content-main-right"),'content-ctrls');     //设置鼠标事件来显示或者隐藏当前控制面板
        }else{      //关闭控制面板
            $divCtrls.removeClass("content-ctrls-show");
            $divCtrls.addClass("content-ctrls-hide");
            $("#content-main-right").unbind("click");
        }
    };

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
    };

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
    };
    //显示右键菜单
    function setContextMenuVisible(flag,left,top){
        var $contextMenu = $("#content-menu");
        if(flag){       //打开菜单
            if($contextMenu.length === 0){
                $contextMenu = $("<div id='content-menu'><button class='btn btn-default' id='monitor-hisdata'>历史数据</button></div>")
                $contextMenu.appendTo($('#content-main-right'));
                //历史数据的打开
                $("#monitor-hisdata").on("click",function(){
                    setContextMenuVisible(false);
                    var curDef = JSON.parse(sessionStorage.historyData_ProcDef);
                    var iTop = (window.screen.availHeight - 600) / 2,iLeft = (window.screen.availWidth - 700) / 2;
                    window.open("MHisData.html?mflag=" + curDef.prDefId,"",
                        "height=600,width=700,top=" + iTop + ",left=" + iLeft + ",toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no",true);
                });
            }
            $contextMenu.css({     //将顶点减一保证鼠标当前在控制面板的范围内
                "left" : ((left - 1) / _scaleX) + "px",
                "top"  : ((top - 1) / _scaleX) + "px"
            });
            setDivControlsVisible(false);       //隐藏掉可能的控制面板
            $contextMenu.removeClass("content-menu-hide");
            $contextMenu.addClass("content-menu-show");
            setMainClick($("#content-main-right"),'content-menu');     //设置鼠标事件来显示或者隐藏当前控制面板
        }else{
            if($contextMenu.length === 0) {return;}     //关闭菜单
            $contextMenu.removeClass("content-menu-show");
            $contextMenu.addClass("content-menu-hide");
            $("#content-main-right").unbind("click");
        }
    }



    function alertMessage(msg){
        alert(msg);
    }

    function logAjaxError(funcName,err){
        console.log(funcName + ":" + err);
    }

    //init();
    return {
        init:init,
        getProcsByPointerId:getProcsByPointerId,
        getUserProcs:getUserProcs
    };
})();

$(function(){
    $('.showOrHidden').click(function(){
        var o1 = $(".content-main-left").css("display");
        if(o1 == 'block'){
            $('.content-main-left').css({
                display:'none'
            });
            $('.content-main-right').animate({
                'margin-left':'0px'
            },100);
            $('.showOrHidden').css({
                'background':'url("../resource/img/show.png")no-repeat',
                'background-size':'20px',
                'background-position':'center'
            })
        }else if(o1 == 'none'){
            $('.content-main-left').animate({
                'width':'250px'
            },100,function(){
                $('.content-main-left').css({
                    display:'block'
                });
                $('.showOrHidden').css({
                    'background':'url("../resource/img/hidden.png")no-repeat',
                    'background-size':'20px',
                    'background-position':'center'
                })
            })
        }
    })
});

