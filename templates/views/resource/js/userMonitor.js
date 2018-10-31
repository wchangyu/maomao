/**
 * Created by went on 2016/8/2.
 * 2017/7/6 添加modbus支持
 */
//全局设置缩放比例
_scaleX = 1;

//全局设置容器高度
var containHeight = 800;

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
    var _leftWidth = 250;
    const _headHeight = 62;
    const _scaleStep = 0.05;    //每次点击的变形变化量
    //var _scaleX = 1;        //变形比例
    var _refreshInterval = 0;       //数据刷新时间，如果时间为0，则不刷新
    var _refreshAction;
    var _imgProcSrc;            //存放背景图地址
    var _imgProcWidth;            //存放背景图宽度
    var _oldSpanDefArr = [];         //存放页面中构成流程图的元素

    var jumpPageWidth = 1120;  //存放跳转页面流程图的宽度
    var jumpPageHeight = 586;  //存放跳转页面流程图的高度

    var jumpUrl = window.location.href.split('views/')[0] + 'views/';//存放弹窗的页面地址

    var imgSrcArr = [];       //存放页面中所有图片的路径

    var curProcID;            //存放当前的流程图ID

    var thisProcName = 'ckId=';

    $('.content-main-left').width(0);

    var thisParentDom = ''; //定义流程图外部容器

    //monitorSize流程图宽高 jumpPageSize弹出二级页面的宽高 ifRemove是否可以移动 1为不可移动 不传则可移动
    //parentDom为存放流程图的容器 如果有它 高度自适应时优先考虑
    var init = function(monitorSize,jumpPageSize,ifRemove,parentDom){

        if(!_urlPrefix){

            _urlPrefix  = sessionStorage.apiUrlPrefix;
        }

        //获取到存储区的监控配置信息

        if(window.location.search.split('procID=')[1]){

            thisProcName = 'procID=';
        }

        //console.log(thisProcName);

        if(window.location.search.split(thisProcName)[1]){

            _configArg1 = 1;
            _configArg2 = window.location.search.split(thisProcName)[1];
            _configArg3 = undefined;


        }else if(window.location.search.split('configArg1=')[1]){

            var postData = window.location.search.split('configArg1=')[1];

            _configArg1 = postData.split('configArg2=')[0];
            _configArg2 = postData.split('configArg2=')[1].split('configArg3=')[0];
            _configArg3 = postData.split('configArg3=')[1];

            if(_configArg3 == -1){
                _configArg3 = undefined;
            }

            console.log( _configArg1, _configArg2, _configArg3);

            containHeight =600;

        }else if(sessionStorage.menuArg){

            var args = sessionStorage.menuArg.split(",");


            if(args){
                _configArg1 = args[0];
                _configArg2 = args[1];
                _configArg3 = args[2] || undefined;
            }

        }

        //是否可以移动
        if(ifRemove){

            ifProcMove = false;
        }

        if(monitorSize){

            var procId = window.location.search.split(thisProcName)[1];

            //如果是跳转页面
            if(procId){

                if(window.location.search.split('userId=')){

                    //定义当前页面流程图宽高
                    sessionStorage.monitorSize = monitorSize;

                    containHeight = parseInt(sessionStorage.monitorSize.split(',')[1]);

                }else{

                    jumpPageWidth = parseInt(monitorSize.split(',')[0]);

                    jumpPageHeight = parseInt(monitorSize.split(',')[1]);

                }

            }else{

                //定义当前页面流程图宽高
                sessionStorage.monitorSize = monitorSize;

                containHeight = parseInt(sessionStorage.monitorSize.split(',')[1]);
            }

        }else{

            var procId = window.location.search.split(thisProcName)[1];

            //如果是非跳转页面 则清除页面中缓存的宽高
            if(procId){

            }else{
                sessionStorage.monitorSize = "";
            }
        }

        if(jumpPageSize){

            //定义当前页面弹出的二级页面的宽高

            jumpPageWidth = parseInt(jumpPageSize.split(',')[0]);

            jumpPageHeight = parseInt(jumpPageSize.split(',')[1]);

        }

        if(parentDom){

            thisParentDom = parentDom;

            //获取父元素宽度
            var parentDomLength = parentDom.width();

            //定义当前页面流程图宽高
            sessionStorage.monitorSize = parentDomLength + ',1800';

            containHeight = parseInt(sessionStorage.monitorSize.split(',')[1]);

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
            ////动态改变鹰眼显示比例
            //changeProimg();

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
            ////动态改变鹰眼显示比例
            //changeProimg();

        });

        $(".functions-5").click(function(){

            $("#content-main-right").css({"transform":"","transform-orgin":""});
            _scaleX = 1;
            setScaleSign(1);


            $('#container').hide();

            $('#eyeOnOff').html('切换鹰眼模式');
            $('.content-main-right').css({
                marginLeft:0,
                marginTop:0
            });

            $('#right-container').height(containHeight);

            //还原初始状态
            if($('.content-main-left').css('display') == 'none'){

                changeTransform('none');
            }else{

                changeTransform('block');
            }
            //普通模式可以拖动流程图
            ifProcMove = true;

            ////动态改变鹰眼显示比例
            //changeProimg();
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
            _refreshAction = setTimeout(function(){
                getInstDatasByIds(curProcID);
            },_refreshInterval * 1000);
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
        if($('#eyeOnOff').html() == '切换正常模式'){
            //console.log(44);
            changeProimg();
        }

    };

    //根据用户名获取当前的监控方案，对应左侧列表
    var getUserProcs = function(){

        var userName = sessionStorage.userName;     //获取当前用户名
        //console.log(_isViewAllProcs);

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
                if(sessionStorage.PointerID){
                    bindKeyId = sessionStorage.PointerID;
                }
            }
            if(bindKeyId){
                getAllProcsByBind(_configArg2,bindKeyId);
            }

            //按区域绘制对应流程图
        }else if(_configArg1 == 4){

            //bindType=6时候代表按照区域获取
            var bindType = 6;

            //当前表示区域ID
            var bindKeyId = _configArg2;

            //表示当前方案类型（对象所属的系统）
            var procTypeID = _configArg3;

            if(bindKeyId){

                if(procTypeID){

                    getAllProcsByBind(bindType,bindKeyId,procTypeID);

                }else{

                    getAllProcsByBind(bindType,bindKeyId);
                }

            }

        //如果是按楼宇和监测因子xuan选择
        }else if(_configArg1 == 5){

            getAllProcsByPCID(_configArg2,_configArg3);
        }
    };

    //根据绑定类型和绑定值获取到监控方案列表
    var getAllProcsByBind = function(bindType,bindKeyId,procTypeID){

        var prm = {};

        if(procTypeID){
            prm = {"bindType":bindType,"bindKeyId":bindKeyId,"procTypeID": procTypeID};
        }else{
            prm = {"bindType":bindType,"bindKeyId":bindKeyId};
        }

        $.ajax({
            type:"post",
            data:prm,
            url:_urlPrefix + "PR/PR_GetAllProcsByBindType",
            success:function(data){
                _allProcs = data;       //暂存全部方案
                _allPointerProcs = data;
                //console.log(data);
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
    };

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

    };

    //设置左侧的监控方案列表
    //如果selectedProc为空默认选中第一个，否则选中传值
    var setProcList = function(procs,selectedProc){
       // console.log(procs);
        var $ul = $(".content-main-left>ul");
        $(".content-main-left>ul li").remove();
        if(!procs || procs.length==0) {

            var $divContent = $("#content-main-right");

            $divContent.empty();

            _oldSpanDefArr.length = 0;

            return false
        };
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

        //给右侧的流程图列表添加数据
        var listHtml = '';

        $(procs).each(function(i,o){

                listHtml +=  '<li class="monitor-list-data" title="'+ o.showProcName+'" data-procid="'+ o.procID+'">'+o.showProcName+'</li>';


        });

        //页面赋值
        $('.monitor-list').html(listHtml);

        if(curProc){            //可能存在看不到任何监控方案的情况，没有权限

            initializeProcSubs(curProc.procID);//选中默认的监控

            selectLi($('.list-group-item[data-procid="' + curProc.procID  + '"]'));//默认选中的样式

            selectLi1($('.monitor-list-data[data-procid="' + curProc.procID  + '"]'));
        }
    };

    function selectLi($li){
        $(".list-group-item").removeClass("selected");
        $li.addClass("selected");
    }

    function selectLi1($li){
        $(".innner-toolbar-container .monitor-list-data").removeClass("onChoose");
        $li.addClass("onChoose");
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

    //根据定义的方案类型，获取该类型下的监控方案，返回数据
    var getAllProcsByPCID = function(pointerID,cdataID){
        var prms2 = {
            "pointerID": pointerID,
            "cdataID": cdataID
        };
        $.ajax({
            type:"post",
            dataType:"json",
            data:prms2,
            url:_urlPrefix + "PR/PR_GetAllProcsByPCID",
            success:function(data){
                _allProcs = data;       //暂存全部方案
                _allPointerProcs = data;
                //setProcList(_allProcs);
                getProcsByPointerId();
            },
            error:function(xhr,res,err){ logAjaxError("PR_GetAllProcsByParameter",err); }
        });
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

        _oldSpanDefArr.length = 0;

        _isProcCrtlLoaded = false;
        _isProcDefLoaded = false;
        _isProcRenderLoaded = false;
        _isInstDataLoading = false;
        _procDefs = null;
        _procCtrls = null;
        _procRenders = null;
        //initializeProcDef(procId);
        //initializeProcCtrl(procId);
        //initializeProcRender(procId);
        initializeCollectModels(procId);
        initImg(procId);

        curProcID = procId;
    };

    //获取当前方案的定义 控制 以及render
    var initializeCollectModels = function(procId){
        //console.log(procId)
        $.ajax({
            type:"post",
            data:{"" : procId},
            url:_urlPrefix + "PR/GetPRCollectModels",
            success:function(data){

                _isProcRenderLoaded = true;
                _isProcDefLoaded = true;
                _isProcCrtlLoaded = true;
                _procDefs = data.prProcDefs;
                _procCtrls = data.prProcCtrls;
                _procRenders = data.prProcRenders;

                getInstDatasByIds(procId);
            },
            error:function(xhr,res,err){logAjaxError("PR_GetDefByProcID" , err)}
        });
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

                    //如果没有左侧工具栏
                    if($('.content-main-left').length < 1){

                        _leftWidth = 0;
                    }

                    $divMain.width(proc.procStyle.imageSizeWidth);
                    imgWidth = proc.procStyle.imageSizeWidth;
                    _imgProcWidth = imgWidth;
                    _theImgProcWidth = imgWidth;

                    //流程图高度
                    _theImgProcHeight = proc.procStyle.imageSizeHeight;

                    /*----------------页面自适应 王常宇修改-----------------*/

                    var norWidth = $('.page-title').width();

                    var procId = window.location.search.split(thisProcName)[1];

                    //实际宽度
                    var realWidth = norWidth - _leftWidth - 20;

                    //如果页面中定义了流程图的宽高
                    if(sessionStorage.monitorSize && sessionStorage.monitorSize != ''){

                        realWidth = parseInt(sessionStorage.monitorSize.split(',')[0])
                    }

                    //当前为跳转页面，获取跳转页面的流程图宽高
                    if(procId){

                        if(window.location.search.indexOf('width=')>-1){

                            jumpPageWidth = parseInt(window.location.search.split('width=')[1].split('height=')[0]);

                            jumpPageHeight = parseInt(window.location.search.split('height=')[1].split(thisProcName)[0]);
                            norWidth = jumpPageWidth;

                            containHeight = jumpPageHeight;

                            realWidth = norWidth;

                        }

                    }

                    //缩放比例计算
                    var ratioZoom = realWidth / imgWidth;

                    //获取底图高度
                    var imgHeight = proc.procStyle.imageSizeHeight;

                    //高度缩放比例

                    var ratioZoom1 = containHeight / imgHeight;

                    //如果页面中定义了流程图的宽高
                    if(sessionStorage.monitorSize && sessionStorage.monitorSize != ''){

                        ratioZoom1 = parseInt(sessionStorage.monitorSize.split(',')[1]) /  imgHeight;
                    }

                    //真实缩放比例
                    ratioZoom = ratioZoom < ratioZoom1 ? ratioZoom : ratioZoom1;

                    _scaleX = ratioZoom;
                    setScaleSign(_scaleX,_scaleStep);

                    //右侧容器宽度

                    $('#right-container').width(realWidth);

                    //判断左侧操作栏是否存在
                    var o1 = $(".content-main-left").css("display");

                    //如果存在隐藏左侧操作栏
                    if(o1 == 'block'){

                        setTimeout(function(){

                            $('.showOrHidden').click();

                            $(window).resize();

                        },100);

                    }else{
                        //不存在 让右侧流程图自适应
                        setTimeout(function(){

                            $(window).resize();

                        },100);
                    }

                    $(window).resize(function () {

                        if(thisParentDom != ''){

                            //获取父元素宽度
                            var parentDomLength = thisParentDom.width();

                            //定义当前页面流程图宽高
                            sessionStorage.monitorSize = parentDomLength + ',1800';

                            containHeight = parseInt(sessionStorage.monitorSize.split(',')[1]);

                        }

                        //当浏览器大小变化时
                        var _leftRealwidth = _leftWidth;

                        if($('.content-main-left').css('display') == 'none'){

                            _leftRealwidth = 0;

                        }

                        var norWidth1 = $('.page-title').width();

                        var procId = window.location.search.split(thisProcName)[1];

                        //实际宽度
                        var realWidth1 = norWidth1 - _leftRealwidth - 20;


                        //如果页面中定义了流程图的宽高
                        if(sessionStorage.monitorSize && sessionStorage.monitorSize != ''){

                            realWidth1 = parseInt(sessionStorage.monitorSize.split(',')[0])
                        }

                        //当前为跳转页面，获取跳转页面的流程图宽高
                        if(procId){

                            if(window.location.search.indexOf('width=')>-1){

                                jumpPageWidth = parseInt(window.location.search.split('width=')[1].split('height=')[0]);

                                jumpPageHeight = parseInt(window.location.search.split('height=')[1].split(thisProcName)[0]);

                                norWidth1 = jumpPageWidth;

                                containHeight = jumpPageHeight;

                                realWidth1 = norWidth1;

                            }

                        }

                        //缩放比例计算
                        var ratioZoom = realWidth1 / imgWidth;

                        //获取底图高度
                        var imgHeight = proc.procStyle.imageSizeHeight;

                        //高度缩放比例
                        var ratioZoom1 = containHeight / imgHeight;

                        //如果页面中定义了流程图的宽高
                        if(sessionStorage.monitorSize && sessionStorage.monitorSize != ''){

                            ratioZoom1 = parseInt(sessionStorage.monitorSize.split(',')[1]) /  imgHeight;
                        }

                        //真实缩放比例
                        ratioZoom = ratioZoom < ratioZoom1 ? ratioZoom : ratioZoom1;

                        //对左上角放大缩小按钮重绘
                        _scaleX = ratioZoom;

                        setScaleSign(_scaleX,_scaleStep);

                        $('.content-main-right').css({
                            'transform-origin': 'left top 0px',
                            'transform': 'scale('+ratioZoom+', '+ratioZoom+')'
                        });

                        $('.page-content').css({
                            'overflow':'hidden !important'
                        });

                        //右侧容器宽度
                        $('#right-container').width(realWidth1);


                        $('#container').hide();
                        $('#eyeOnOff').html('切换鹰眼模式');

                        $('.content-main-right').css({
                            marginLeft:0,
                            marginTop:0
                        });

                        if(ratioZoom > ratioZoom1){

                            $('#right-container').height(containHeight);

                        }else{

                            var height = $('.content-main-right').height() * ratioZoom;

                            $('#right-container').height(height);

                        }



                    });

                    $('.content-main-right').css({
                        'transform-origin': 'left top 0px',
                        'transform': 'scale('+ratioZoom+', '+ratioZoom+')'
                    });

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
                //修改左侧高度
                $(".content-main-left").height(800);

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
                        //对背景图地址进行更新

                        _imgProcSrc = data["imgUrl"];
                        img.css("z-index","-9999");
                        img.attr("id","imgProc");       //设置ID，需要获取到该背景图
                        if(imgWidth){ img.width(imgWidth); }
                        if(imgHeight){ img.height(imgHeight); }
                        //TODO:图片的展示方式 curProc.ProcStyle.ImageLayout 无=0，图片重复=1，居中显示=2，拉伸显示=3，比例放大或缩小=4
                        $("#content-main-right").append(img);
                        eageleEyeOnOff();
                    },
                    error:function(xhr,res,err){ logAjaxError("bg GetHbProcImage" , err); }
                });
            }
            //设置div的高和宽

        }
    };

    //获取实时数据
    var getInstDatasByIds = function(procId){


        if(_isProcDefLoaded && _isProcCrtlLoaded && _isProcRenderLoaded && !_isInstDataLoading){

            //var CTypeCKIDs = "",DTypeDKIDs = "";        //控制量的ID，监测值的ID
            //var DefIDs = [];
            //var procRenders = [];
            //for(var i = 0;i < _procDefs.length;i++){
            //    CTypeCKIDs += _procDefs[i]["cType"] + "+" + _procDefs[i]["ckId"] + ",";
            //    DTypeDKIDs += _procDefs[i]["dType"] + "+" + _procDefs[i]["dkId"] + ",";
            //    var defObj = {};
            //    defObj["CKID"] = _procDefs[i]["ckId"];
            //    defObj["DKID"] = _procDefs[i]["dkId"];
            //    defObj["ProcDefID"] = _procDefs[i]["prDefId"];
            //    defObj["ProcID"] = _procDefs[i]["procId"];
            //    defObj["DType"] = _procDefs[i]["dType"];
            //    defObj["CType"] = _procDefs[i]["cType"];
            //    defObj["EnableScriptResult"] = _procDefs[i]["enableScript"];
            //    defObj["VisibleScriptResult"] = _procDefs[i]["visibleScript"];
            //    defObj["recservicecfg"] = _procDefs[i]["recservicecfgValue"];
            //    DefIDs.push(defObj);
            //}
            //for(i=0;i<_procRenders.length;i++){
            //
            //    var prr = {};
            //    prr["ProcDefID"] = _procRenders[i]["prDefId"];
            //    prr["ProcRenderID"] = _procRenders[i]["id"];
            //    prr["OutputExpr"] = _procRenders[i]["outPutExpr"];
            //    prr["Priority"] = _procRenders[i]["priority"];
            //    prr["Text"] = _procRenders[i]["text"];
            //    prr["Expression"] = _procRenders[i]["expression"];
            //    prr["DotNumber"] = _procRenders[i]["dotNumber"];
            //    prr["Format"] = _procRenders[i]["format"];
            //    procRenders.push(prr);
            //}
            //if(CTypeCKIDs!="") CTypeCKIDs = CTypeCKIDs.substr(0,CTypeCKIDs.length - 1);
            //if(DTypeDKIDs!="") DTypeDKIDs = DTypeDKIDs.substr(0,DTypeDKIDs.length - 1);
            //
            //_isInstDataLoading = true;
            ////console.log(procRenders)
            //var datas = {
            //
            //};
            //console.log(procId);
            $.ajax({
                type:"post",
                data: {"" : procId},
                url:_urlPrefix + "PR/GetPRCollectInstData",
                success:function(data){
                    _defInsDataResults = data;
                    _isInstDataLoading = false;

                    if(_defInsDataResults.length > 0){
                        initializeContentOnDiv(data);
                    }

                },
                error:function(xhr,res,err){logAjaxError("PR_GetInstDataNew" , err);}
            });
        }
    };

    //在界面上绘制数据
    var initializeContentOnDiv = function(defInstDatas){

        //清空之前的图片数据
        imgSrcArr.length = 0;

        if(!_isProcCrtlLoaded || !_isProcDefLoaded || !_isProcRenderLoaded) return;     //没有载入数据完成则退出
        if(!_procDefs || _procDefs.length==0) return;           //没有绘制对象则退出
        /*
         1.绘制之前清除原有的绘制的控件
         * */
        var $divContent = $("#content-main-right");
        var $img = $("#imgProc");

        //定义是否对页面中元素进行比较的标识
        var _ifCompareSpan = true;

        //根据procID判断流程图缓存_oldSpanDefArr是否需要更新
        if(_oldSpanDefArr.length != 0 && _oldSpanDefArr[0].procID != _defInsDataResults[0].procID){

            _oldSpanDefArr.length = 0;
        }

        //如果没有缓存 则是第一次加载 需给页面添加缓存
        if(_oldSpanDefArr.length == 0){

            //不需要对元素进行比较
            _ifCompareSpan = false;

            //清空容器 直接进行赋值
            $divContent.empty();
            $divContent.append($img);
        }

        //定义是否对页面中元素进行重绘的标识
        var ifRedrawSpan = true;

        //根据def绘制对象
        var defLength = _procDefs.length;

        //console.log( defLength);
        for(var i = 0;i < defLength;i++){

            //如果是第一次加载
            if(!_ifCompareSpan){

                _oldSpanDefArr.push(_defInsDataResults[i]);

            }else{

                $(_oldSpanDefArr).each(function(k,o){

                    //如果defID相同 则是页面上同一个元素 开始进行比较
                    if(o.procDefID == _defInsDataResults[i].procDefID){


                            //判断是否需要进行重绘
                          if(o.procRenderID == _defInsDataResults[i].procRenderID && o.enableScriptResult == _defInsDataResults[i].enableScriptResult  && o.renderExprResult == _defInsDataResults[i].renderExprResult && o.visibleScriptResult == _defInsDataResults[i].visibleScriptResult){

                              //当前元素不需要进行重绘
                              ifRedrawSpan = false;

                          }else{

                              //给当前缓存重新赋值
                              o.procRenderID = _defInsDataResults[i].procRenderID;

                              o.enableScriptResult = _defInsDataResults[i].enableScriptResult;

                              o.renderExprResult = _defInsDataResults[i].renderExprResult;

                              o.visibleScriptResult = _defInsDataResults[i].visibleScriptResult;
                          }
                    }

                });

            }

            //如果不需要重绘，跳出本次循环 进入下一个循环
            if(ifRedrawSpan == false){

                ifRedrawSpan = true;

                continue;
            }

            if(i == 0){

                //清空之前的图片数据
                imgSrcArr.length = 0;
            }

            //需要进行重绘,获取当前页面元素ID
            var spanID = _defInsDataResults[i].procDefID;

            //console.log(spanID);

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
                    if(curPD.visibleScriptResult==0){
                        continue;
                    }
                }


                var curPRR;     //当前render
                curPRR = _.findWhere(_procRenders,{"id":curPD.procRenderID});

                var curProcDef = _procDefs[i];
                if(curProcDef.dType != 0){
                    $spanDef.attr("data-prdefid",curProcDef.prDefId);
                    $spanDef.on("contextmenu",function(event){
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
                var $Video = $("<video>");      //当前def的视频
                $Video.attr('controls','controls');
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

                //如果是嵌入式视频
                if(curProcDef.dType >= 500 &&  curProcDef.dType <=600 && curProcDef.prdProcLnk && curProcDef.prdProcLnk.procLnkBase && curProcDef.prdProcLnk.procLnkBase.type == 503){
                    //console.log(curProcDef);
                        $Video.css({"width":defWidth,"height":defHeight});
                        //是否自动播放
                        if(curProcDef.prdProcLnk.paras[0] == 1){
                            $Video.attr('autoplay','autoplay');
                        }
                        $spanImg.append($Video);
                        $spanImg.width("100%");
                        $spanTxt.width(0);

                    $Video.attr("src",curProcDef.prdProcLnk.procLnkBase.url);

                    ////如果有视频加载视频
                    //if( curProcDef.dkId) {
                    //
                    //    loadDefVideo(curProcDef.dkId, $Video);
                    //}

                    //如果是嵌入式摄像头
                }else if(curProcDef.dType >= 500 &&  curProcDef.dType <=600 && curProcDef.prdProcLnk && curProcDef.prdProcLnk.procLnkBase && curProcDef.prdProcLnk.procLnkBase.type == 504){
                    //console.log(curProcDef);

                    //获取当前摄像头id
                    var cameraID = curProcDef.prdProcLnk.paras[2];
                    //console.log(cameraID);

                    //获取当前摄像头品牌
                    var brand = curProcDef.prdProcLnk.paras[0];

                    //定义摄像头页面路径
                    var monitorUrl = getMonitorUrlByBrand(brand);

                    //获取弹窗的页面地址
                    var url = jumpUrl + monitorUrl + "?width="+defWidth+"height="+defHeight+"cameraID="+cameraID+"";

                    var $Camera = '<iframe width="'+defWidth+'" scrolling="no" height="'+defHeight+'" frameborder="0" allowtransparency="true" src='+url+'></iframe>';

                    $spanImg.append($Camera);
                    $spanImg.width("100%");
                    $spanTxt.width(0);

                    //如果是嵌入流程图
                }else if(curProcDef.dType >= 500 &&  curProcDef.dType <=600 && curProcDef.prdProcLnk && curProcDef.prdProcLnk.procLnkBase && curProcDef.prdProcLnk.procLnkBase.type == 502 && curProcDef.prdProcLnk.procLnkBase.startpos != 3){
                    //console.log(curProcDef);

                        id = curProcDef.prdProcLnk.paras[0];

                        jumpPageWidth = defWidth;

                        jumpPageHeight = defHeight;

                        //

                    //获取弹窗的页面地址
                    var url = jumpUrl + "yongnengjiance/jumpEnergyMonitor.html?width="+defWidth+"height="+defHeight+"ckId="+id+"";

                    var $monitor = '<iframe width="'+defWidth+'" scrolling="no" height="'+defHeight+'" frameborder="0" allowtransparency="true" src='+url+'></iframe>';

                    $spanImg.append($monitor);
                    $spanImg.width("100%");
                    $spanTxt.width(0);


                }else if(curPRR){

                    //判断前台展示的类型，1为文本，2为图片，3为图片文本 ，4为视频
                    if(curPRR.showFlag == 1){
                        $Txt.attr('title',curText);
                        $spanTxt.append($Txt);
                        $spanImg.width(0);
                        $spanTxt.width("100%");
                    }else if(curPRR.showFlag == 2){
                        $Img.css({"width":defWidth,"height":defHeight});
                        $spanImg.append($Img);
                        $spanImg.width("100%");
                        $spanTxt.width(0);
                    }else if(curPRR.showFlag == 3){
                        $Img.css({"width":defWidth / 2,"height":defHeight});
                        $spanImg.append($Img);
                        $spanTxt.append($Txt);
                        $spanImg.width("50%");
                        $spanTxt.width("50%");
                    }
                    $Img.attr("id",curPRR.id + "img");
                    $Video.attr("id",curPRR.id + "video");

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

                    //如果是超链接 点击跳转新页面
                    if(curProcDef.cType >= 500 &&  curProcDef.cType <=600 && curProcDef.prcProcLnk && curProcDef.prcProcLnk.procLnkBase && curProcDef.prcProcLnk.procLnkBase.type == 501){
                        //console.log(curProcDef);

                        //获取当前跳转url地址
                        var jumpUrl1 = curProcDef.prcProcLnk.procLnkBase.url;

                        //跳转模式
                        var jumpType = curProcDef.prcProcLnk.procLnkBase.startpos;

                        var jumpArr = [jumpUrl1,jumpType];

                        $spanDef.css("cursor","pointer");
                        $spanDef.on("click",(function(arr){return function(){ jumpNewPage(arr); }})(jumpArr));

                    }

                    $Txt.css("font-family",curPRR.fontName);        //字体设置
                    if(curPRR.fontSize > 0) { $Txt.css("font-size",curPRR.fontSize);}
                    if(curPRR.isFontBold) { $Txt.css("font-weight","bold");}
                    if(curPRR.isFontItalic) { $Txt.css("font-style","italic"); }
                    if(curPRR.isFontUnderline) { $Txt.css("text-decoration","underline"); }
                    if((curPRR.showFlag == 2 || curPRR.showFlag == 3) && curPRR.imgID) {
                            //console.log(33);
                            //如果有图片，载入图片
                            loadDefImg(curPRR, $Img);
                    }

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
                if(!curPD.enableScriptResult && typeof curPD.enableScriptResult != "undefined" && typeof curPD.enableScriptResult != 0 || curPD.enableScriptResult == 1){       //是否可用(可点击)的属性
                    $spanDef.removeAttr("disabled");
                }else{
                    $spanDef.attr("disabled","disabled");

                }
                var curProcCtrl = _.findWhere(_procCtrls,{"prDefId":_procDefs[i].prDefId});

                //如果当前def存在控件或者标签的类型为166（即导航标签），则绘制
                if((curProcCtrl && curProcDef.cType>0) || curProcDef.cType==166 || curProcDef.cType==3 || curProcDef.cType==122 || curProcDef.cType==100|| curProcDef.cType==133|| curProcDef.cType==131 || curProcDef.prcProcLnk && curProcDef.prcProcLnk.procLnkBase.type == 502  || curProcDef.prdProcLnk && curProcDef.prdProcLnk.procLnkBase.startpos == 3
                ){
                    if(!curPD.enableScriptResult && typeof curPD.enableScriptResult != "undefined" && typeof curPD.enableScriptResult != 0 || curPD.enableScriptResult == 1){

                        $spanDef.css("cursor","pointer");
                        $spanDef.on("click",(function(procDef){return function(){ setActionByDef(procDef); }})(_procDefs[i]));

                    }else{


                    }

                }

                //如果是弹出式摄像头
                if(curProcDef.cType >= 500 &&  curProcDef.cType <=600  && curProcDef.prcProcLnk && curProcDef.prcProcLnk.procLnkBase && curProcDef.prcProcLnk.procLnkBase.type == 504){

                    if(!curPD.enableScriptResult && typeof curPD.enableScriptResult != "undefined" && typeof curPD.enableScriptResult != 0 || curPD.enableScriptResult == 1){

                        $spanDef.css("cursor","pointer");
                        $spanDef.on("click",(function(procDef){return function(){ showMonitorByID(procDef); }})(_procDefs[i]));
                    }else{



                    }
                }

                //如果是弹出式视频
                if(curProcDef.cType >= 500 &&  curProcDef.cType <=600  && curProcDef.prcProcLnk && curProcDef.prcProcLnk.procLnkBase && curProcDef.prcProcLnk.procLnkBase.type == 503){

                    if(!curPD.enableScriptResult && typeof curPD.enableScriptResult != "undefined" && typeof curPD.enableScriptResult != 0 || curPD.enableScriptResult == 1){

                        //给图片绑定视频路径
                        $Img.attr('videoUrl', curProcDef.prcProcLnk.procLnkBase.url);

                        var videoMessage = curProcDef.prcProcLnk.procLnkBase;

                        var paras = curProcDef.prcProcLnk.paras;

                        if (!curPD.enableScriptResult && typeof curPD.enableScriptResult != "undefined" && typeof curPD.enableScriptResult != 0 || curPD.enableScriptResult == 1) {

                            $spanDef.css("cursor","pointer");

                            //给图片添加点击事件
                            $spanDef.on('click', function () {

                                showVideoByID(videoMessage,paras);
                            });

                        } else {

                        }

                    }else{



                    }
                }
            }

            //如果不是第一次加载
            if(_ifCompareSpan){

                //获取要替换的元素
                $('#' + spanID).replaceWith($spanDef);

            }else{

                $divContent.append($spanDef);
            };

        }

        //定时刷新
        refreshData();
    };

    //流程图小程序 501 页面跳转方法
    var jumpNewPage = function(arr){


        //跳转地址
        var url = arr[0];

        //跳转方式
        var type = arr[1];


        //当前页面打开
        if(type == 3){

            window.location.href = url;

        }else{

            window.open(url);
        }

    };

    //在界面插入鹰眼模式开关
    var eageleEyeOnOff = function(){
        //判断是否已存在开关
        var $ifeyeOnOff = $('#eyeOnOff').html();

        if(!$ifeyeOnOff){
            //插入开关
            var $eyeOnOff = $("<button id='eyeOnOff'>切换鹰眼模式</button>").css({
                position:"absolute",
                left:($('.content-main-left').width() + 2),
                top:'10%',
                border:'1px solid deepskyblue',
                padding:'6px',
                background:'skyblue',
                display:'none'
            });
            //$eyeOnOff.css("cssText","border-radius:0 10px 10px 0 !important");

            $('.total-wrap').append($eyeOnOff);

        }else{

            if($('#eyeOnOff').html() == '切换正常模式'){
                $('#eyeOnOff').click();
            }

        };

        $('#eyeOnOff').off('click');
        $('#eyeOnOff').on('click',function(){

            $('#container').toggle();

            if($(this).html() =='切换鹰眼模式'){

                var norWidth1 = $('.page-title').width();

                //实际宽度
                var realWidth1 = norWidth1 - _leftWidth - 20;

                //右侧容器宽度
                $('#right-container').width(realWidth1);

                //鹰眼模式不允许拖动流程图
                ifProcMove = false;

                eagleEye();
                $(this).html('切换正常模式');

            }else{
                $(this).html('切换鹰眼模式');

                var norWidth1 = $('.page-title').width();

                //实际宽度
                var realWidth1 = norWidth1 - _leftWidth - 20;
                //缩放比例计算
                var ratioZoom1 = realWidth1 / _imgProcWidth;
                //对左上角放大缩小按钮重绘
                _scaleX = ratioZoom1;
                setScaleSign(_scaleX,_scaleStep);

                $('.content-main-right').css({
                    'transform-origin': 'left top 0px',
                    'transform': 'scale('+ratioZoom1+', '+ratioZoom1+')'
                });

                $('.page-content').css({
                    'overflow':'hidden !important'
                });

                //右侧容器宽度
                $('#right-container').width(realWidth1);

                $(".content-main-right").css({

                    marginLeft:0,
                    marginTop:0

                },600);

                $('#right-container').height(containHeight);

                //普通模式可以拖动流程图
                ifProcMove = true;

            }

        });

        $('.functions-6').off('click');
        $('.functions-6').on('click',function(){

            if($("#container").length < 1 || $("#container").is(":hidden")){

                //如果鹰眼模式 隐藏左侧菜单栏
                $(".page-sidebar-menu").addClass('page-sidebar-menu-closed');

                $(".page-header-fixed").addClass('page-sidebar-closed');

                $('.open .sub-menu').hide();

            }else{

                //如果非鹰眼模式 显示左侧菜单栏
                $(".page-sidebar-menu").removeClass('page-sidebar-menu-closed');

                $(".page-header-fixed").removeClass('page-sidebar-closed');

                $('.open .sub-menu').show();
            }

            setTimeout(function(){

                $('#eyeOnOff').click();

            },100)


        });
    };

    //鹰眼效果
    var eagleEye = function(){

        //判断是否已存在缩略图容器
        var $ifcontainer = $('#container').html();

        if(!$ifcontainer){
            //插入缩略图容器
            var $container = $("<div id='container'></div>").css({
                position:"fixed",
                //left:$('.content-main-left').width(),
                left:0,
                bottom:'20%',
                border:'1px solid #ccc',
                zIndex:9999
            });

            $('.total-wrap').append($container);
        }

        //清空缩略图容器
        $('#container').empty();

        //获取当前缩放比例

        //插入缩略图
        //获取显示区宽度
        var showWidth = $('#right-container').width();

        var $img1 = $("<img src='"+_imgProcSrc+"'>");
        var imgWH = 312;
        var imgHH = imgWH / _imgProcWidth * _theImgProcHeight ;
        var scale = 3;

        //给显示区添加高度
        $('#right-container').height(showWidth / imgWH * imgHH);

        var showScale = showWidth / imgWH;

        $img1.appendTo($("#container")).width(imgWH).height(imgHH);

        //插入用户查看选框
        var $lay = $("<div id='show-pic-big'></div>").css({
            width:imgWH / scale,
            height:imgHH/ scale,
            //border:"solid 1px #ccc",
            //background:"#fff",
            //opacity:.7,
            position:"absolute",
            left:0,
            top:0,
            overflow:"hidden",
            zIndex:10,
            boxShadow:"0 0 10px #333",
            border:'2px solid red'

        }).appendTo("#container").hide();

        $("#container").hover(function(){

            $lay.show();

            $(document).mousedown(function(){
                $("#container").mousemove(function(e){
                    var i = e.pageX - $("#container").offset().left - $lay.width() / 2;
                    var y = e.pageY - $("#container").offset().top -$lay.height() / 2;
                    var maxWidth = $("#container").width() -$lay.width();
                    var maxHeight = $("#container").height() - $lay.height();
                    var nowX = Math.max(Math.min(i,maxWidth),0);
                    var nowY = Math.max(Math.min(y,maxHeight),0);

                    $lay.css({
                        left:nowX - 2,
                        top:nowY - 2
                    });

                    $(".content-main-right").css({
                        marginLeft:(nowX) * scale * showScale * -1,
                        marginTop:(nowY) * scale * showScale *　-1
                    },600);

                    $(document).mouseup(function(){

                        $("#container").unbind('mousemove');
                    })

                })


            })

        });


        //计算真实缩放比例
        var realScale = (showWidth / _imgProcWidth) * scale;

        setScaleSign(realScale,_scaleStep);

        $('.content-main-right').css({
            'transform-origin': 'left top 0px',
            'transform': 'scale('+realScale+', '+realScale+')'
        });

        //给全局变量 缩放比例赋值
        _scaleX = realScale;

        $('.content-main-left').css({
            zIndex:1000
        });

        $('.total-wrap').css({
            overFlow:'hidden !important'
        });
    };

    //手动改变流程图缩放比例时
    var changeProimg = function(){

        //获取显示区宽度
        var showWidth = $('#right-container').width();
        var imgWH = 312;
        var imgHH = imgWH / _imgProcWidth * _theImgProcHeight ;

        var showScale = showWidth / imgWH;
        var scale = ((Math.abs(((_scaleX - 1) / _scaleStep)).toFixed()) / 20) + 1;

        var $lay = $('#show-pic-big');

        //计算用户查看选框真实宽度
        var realWidth = (showWidth * imgWH) / (_imgProcWidth * scale);

        var realScale = showWidth / realWidth;

        //给显示区添加高度
        $('#right-container').height(showWidth / imgWH * imgHH);

        //插入用户查看选框
        $('#show-pic-big').css({
            width: realWidth,
            height:imgHH/ (imgWH / realWidth)
            //border:"solid 1px #ccc",
            //background:"#fff",
            //opacity:.7,
        });

        $(".content-main-right").css({

            marginLeft:parseInt($lay.css("left")) * realScale * -1,
            marginTop:parseInt($lay.css("top")) * realScale *　-1

        },600);

        $("#container").unbind('hover');

        $("#container").hover(function(){

            //$lay.show();

            $(document).mousedown(function(){
                $("#container").mousemove(function(e){
                    var i = e.pageX - $("#container").offset().left - $lay.width() / 2;
                    var y = e.pageY - $("#container").offset().top -$lay.height() / 2;
                    var maxWidth = $("#container").width() -$lay.width();
                    var maxHeight = $("#container").height() - $lay.height();
                    var nowX = Math.max(Math.min(i,maxWidth),0);
                    var nowY = Math.max(Math.min(y,maxHeight),0);

                    $(".content-main-right").css({
                        marginLeft:nowX * realScale * -1,
                        marginTop:nowY * realScale *　-1
                    },600);

                    $(document).mouseup(function(){

                        $("#container").unbind('mousemove');
                    })

                })


            })

        });
    };

    function loadDefImg(curPRR,$Img){
        //console.log(curPRR);

        $Img.addClass(curPRR.imgID + "img");

        var ifLoadDefImg = true;

        //判断是否已有当前imgID
        $(imgSrcArr).each(function(i,o){

            //如果存在当前imgID
            if(o.id == curPRR.imgID){

                o.elem.push($Img);

                ifLoadDefImg = false;
            }
        });

        //如果imgScrArr中不存在当前id 则调用函数
        if(ifLoadDefImg){

            //将当前id添加到imgSrcArr中
            var obj = {
                id :  curPRR.imgID,
                elem : [$Img]
            };

            imgSrcArr.push(obj);

        }else{

            return false;
        }
        $.ajax({
            type:"post",
            data:{"" : curPRR.imgID},
            url:_urlPrefix + "PR/GetHbProcImage",
            success:function(data){
                //定义页面中需要赋值的元素集合
                var eleArr = [];

                //遍历存放img路径信息的数据
                $(imgSrcArr).each(function(i,o){
                    //如果id相等 则取出其中保存的页面元素
                     if(o.id == curPRR.imgID){
                         eleArr = o.elem;
                     }
                });
                //console.log(imgSrcArr);

                //将获取到的图片地址 循环赋值给页面中的元素
                $(eleArr).each(function(i,o){

                    o.attr("src",data["imgUrl"]);
                });
                //$Img.attr("src",data["imgUrl"]);
            },
            error:function(xhr,res,err){ logAjaxError("GetHbProcImage" , res) }
        });
    };

    function loadDefImg1(id,$Img){
        //console.log(id);

        $Img.addClass(id + "img");
        $.ajax({
            type:"post",
            data:{"" : id},
            url:_urlPrefix + "PR/GetHbProcImage",
            success:function(data){
                //console.log(data);

                $Img.attr("src",data["imgUrl"]);
            },
            error:function(xhr,res,err){ logAjaxError("GetHbProcImage" , res) }
        });
    };

    //获取视频地址
    function loadDefVideo(id,$Video){
        $Video.addClass(id + "img");
        $.ajax({
            type:"get",
            data:{"lnkID" : id},
            url:_urlPrefix + "PR/GetPRProcLnk",
            success:function(data){
                //console.log(data);
                $Video.attr("src",data["url"]);
            },
            error:function(xhr,res,err){ logAjaxError("GetHbProcVideo" , res) }
        });
    };

    //模态框显示摄像头
    function showMonitorByID(procDef){

        //获取当前摄像头id
        var cameraID = procDef.prcProcLnk.paras[2];

        var cameraWidth = procDef.prcProcLnk.procLnkBase.width;

        var cameraHeight = procDef.prcProcLnk.procLnkBase.height;

        //定义当前弹窗的id
        var modalID = procDef.prDefId + "camera";

        //获取当前摄像头品牌
        var brand = procDef.prcProcLnk.paras[0];

        console.log(brand);

        //定义摄像头页面路径
        var monitorUrl = getMonitorUrlByBrand(brand);

        console.log(monitorUrl);

        //获取弹窗的页面地址
        var url = jumpUrl + monitorUrl + "?width="+cameraWidth+"height="+cameraHeight+"cameraID="+cameraID+"";

        var html = '<div class=\'modal fade content-child-shows\' id="'+modalID+'" tabindex=\'-1\' role=\'dialog\' aria-labelledby=\'myModalLabel\' aria-hidden=\'true\' data-backdrop="static">' +
        '    <div class=\'modal-dialog\' style=\'margin:15% auto;\'>' +
        '        <div class=\'modal-content\' style="position:relative">' +
            "<iframe width='100%' height='100%'   style='position:absolute;  top:0px;left:0px; z-Index:-1;'></iframe>"+
        '            <div class=\'modal-header\'>' +

        '                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +

        '                <h4></h4>' +

        '            </div>' +

        '            <div class="modal-body">' +
            '<iframe width="'+cameraWidth+'" scrolling="no" height="'+cameraHeight+'" frameborder="0" allowtransparency="true" src='+url+'></iframe>' +

        '            </div>' +

        '        </div>' +
        '    </div>' +
        '</div>';

        $('#right-container').append(html);

        $('#'+modalID).on('click','.close',function(){

            setTimeout(function(){

                $('#'+modalID).remove();

            },1000)
        });

        $("#"+modalID).modal('show');

        $("#"+modalID).find('.modal-content').css('zIndex','9999');

        //视频名称
        $("#"+modalID).find('h4').html(procDef.prcProcLnk.procLnkBase.name);

        //模态框宽度
        $("#"+modalID).find('.modal-dialog').width(cameraWidth + 50);

    };

    //模态框显示视频
    function showVideoByID(videoMessage,paras){

        //是否自动播放
        if(paras[0] == 0){
            $('#play-video').removeAttr('autoplay');
        }

        $('#my-video').modal('show');

        $('#my-video video').attr('src',videoMessage.url);

        //视频名称
        $('#my-video .modal-header h4').html(videoMessage.name);

        //模态框宽度
        $('#my-video .modal-dialog').width(videoMessage.width + 50);

        //video的宽高
        $('#my-video video').width(videoMessage.width);

        $('#my-video video').height(videoMessage.height);
    }

    //根据当前的def跳转到下一级的procs
    var setActionByDef = function(procDef){
        //console.log(33);
        if(!procDef) return;
        if(_refreshAction){ clearTimeout(_refreshAction);}
        if(procDef.cType == 166 || procDef.cType >= 500 && procDef.cType <= 600 || procDef.dType >= 500 && procDef.dType <= 600){       //方案跳转

           if(!_isViewAllProcs && procDef.cType == 166 && _userProcIds.indexOf(procDef.ckId)<0){       //在跳转图中ckId的值就是需要跳转的procID
                //console.log(procDef.ckId);
                alertMessage("没有权限");
                return;
            }

            var proc = _.findWhere(_allProcs,{"procID":procDef.ckId});

            //流程图内部跳转
            if( procDef.prdProcLnk && procDef.prdProcLnk.procLnkBase.startpos == 3){

                //权限判断
                if(!_isViewAllProcs && procDef.prdProcLnk.paras[0] && _userProcIds.indexOf(procDef.prdProcLnk.paras[0])<0){

                    alertMessage("没有权限");
                    return;
                }


                $("#content-main-right").empty();

                initializeProcSubs(procDef.prdProcLnk.paras[0]);

                return false;
            }

            //流程图内部跳转
            if( procDef.prcProcLnk && procDef.prcProcLnk.procLnkBase.startpos == 3){

                //权限判断
                if(!_isViewAllProcs && procDef.prcProcLnk.paras[0] && _userProcIds.indexOf(procDef.prcProcLnk.paras[0])<0){

                    alertMessage("没有权限");
                    return;
                }

                $("#content-main-right").empty();

                initializeProcSubs(procDef.prcProcLnk.paras[0]);

                return false;

            }

            //如果新建模态框打开流程图
            if( procDef.prcProcLnk && procDef.prcProcLnk.procLnkBase.type == 502) {

                //权限判断
                if(!_isViewAllProcs && procDef.prcProcLnk.paras[0] && _userProcIds.indexOf(procDef.prcProcLnk.paras[0])<0){

                    alertMessage("没有权限");
                    return;
                }


                //获取当前ID
                var id = procDef.ckId;

                if(procDef.prcProcLnk && procDef.prcProcLnk.procLnkBase.type == 502){

                    id = procDef.prcProcLnk.paras[0];

                    jumpPageWidth = procDef.prcProcLnk.procLnkBase.width;

                    jumpPageHeight = procDef.prcProcLnk.procLnkBase.height;
                }

                //获取弹窗的页面地址
                var url = jumpUrl + "yongnengjiance/jumpEnergyMonitor.html?width="+jumpPageWidth+"height="+jumpPageHeight+"ckId="+id+"";

                var html = '<div class="content-child-show" id="'+id+'">' +
                    '<div class="content-child-show-container">' +
                    '<div class="close1">X</div>' +
                    '<iframe width="'+jumpPageWidth+'" scrolling="no" height="'+jumpPageHeight+'" frameborder="0" allowtransparency="true" src='+url+'></iframe>' +
                    '</div>' +
                    '</div>';

                $('#right-container').append(html);

                //获取当前父流程图宽度
                var parentWidth = $('#right-container .content-main-right').width();

                //获取缩放比例
                var parentScaleString = $('#right-container .content-main-right').css('transform');

                var parentScale = parseFloat(parentScaleString.split('matrix(')[1].split(',')[0]);

                //获取缩放比例

                var thisScale = parentWidth * 0.8 * parentScale / jumpPageWidth;

                $('#' + id + "").css({

                    'transformOrigin': 'left top 0px',
                    'transform': 'scale('+thisScale+')'

                 });

            }else{

                if(proc){

                    _curProc = proc;
                }else{
                    _curProc = null;
                }
                $("#content-main-right").empty();

                //initializeProcSubs(_curProc.procID);

                //重新绘制左侧选择列表
                displayAllProc();
            }

        }else{

            if(isHaveControl(procDef.prDefId)){
                if(_hasControlAuth) {
                    _isOperating = true;
                    var ptNow = getMousePos();
                    drawControls(procDef.prDefId,ptNow[0],ptNow[1]);
                }else{
                    alertMessage("没有权限");
                }
                return;
            }

            if(procDef.cType == 3 || procDef.cType == 133 || procDef.cType == 131){       //AO操作
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
        }
    };

    //判断是否有控制项
    var isHaveControl = function(prDefId){
        var len = _procCtrls.length;
        if(len){
            for(var i=0;i<len;i++){
                if(_procCtrls[i].prDefId ==prDefId ){
                    return true;
                }
            }
        }
        return false;
    };

    //根据数据返回的结果显示所有的监控流程,显示在左边,默认只显示第一等级，可导航改变
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
         var e= window.event || arguments.callee.caller.arguments[0] ;
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
                $divCtrls.css({"width" : "250px","height" : "120px"});
                var baseWidth = 72, baseHeight = 31;       //基础宽高
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
                var baseWidth = 55, baseHeight = 31;       //基础宽高
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
                $divCtrls.css({"width" : "240px","height" : (ccCount / 3 * 40 + 80) + "px"});   //80为多一行+标题行
            }
        }else{      //空调面板
            var baseWidth = 55,baseHeight = 38;       //基础宽高
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
            $divCtrls.css({"width" : "240px","height" : (15 / 4 * 40 + 40) + "px"});
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
        $divCtrls.css({"width":"350px","height":"200px"});
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
                $td.css("text-align","left");
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
                var htmlTextarea = '<textarea id="ctrl-panel-textarea" cols="28" rows="3" autofocus></textarea>';
                $td1.append(htmlTextarea);
                $tr1.append($td1);
                $tr1.appendTo($table);
            }else if(curProcDef.recservicecfgValue.dataType == 5){      //日期
                $table.css({"width":"270px","height":"190px"});
                var $tr = $("<tr>"),$td = $("<td>");
                $td.css("text-align","left");
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
            var htmlTextarea = '<textarea id="ctrl-panel-textarea" cols="28" rows="3" autofocus></textarea>';
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
    };

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
    };

    //初始设置控制面板
    function setCtrlPanel($contentmain,left,top){
        //组建当前def的ctrl,以鼠标点为左上角，组建一个3行的显示，其中第一列为"控制选项"标题
        var $divCtrls = $("#content-ctrls");
        if($divCtrls.length == 0){
            $divCtrls = $("<div id='content-ctrls'>");
            //$divCtrls.attr('id','content-ctrls');
            $divCtrls.appendTo($contentmain);
        }

        //定义左移的距离
        var leftDistance = 0;

        if((left - 1) / _scaleX > 400){

            leftDistance = 150;

        }

        $divCtrls.css({     //将顶点减一保证鼠标当前在控制面板的范围内
            "left" : ((left - 1) / _scaleX - leftDistance) + "px",
            "top"  : ((top - 1) / _scaleX) + "px"
        });
        return $divCtrls;
    };

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
        $btn.css("min-width",baseWidth + "px");
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

            //定时刷新
            refreshData();
        }
    };

    //设置每个def外层的flex布局
    var setFlex = function($ele){
        $ele.css("display","flex");
        $ele.css("display","-webkit-box");
        $ele.css("display","-ms-flexbox");
        $ele.css("display","-webkit-flex");
        $ele.css("display","-moz-flex");
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
        $ele.css("display","-moz-flex");
        if(options){
            for(var attr in options){
                $ele.css(attr,options[attr]);
            }
        }
    };

    //关闭二级弹出后 刷新流程图
	$('#right-container').on('click','.close1',function(){

		setTimeout(function(){
			refreshData();
		},0)
	});


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

                    var url = "../yongnengjiance/MHisData.html?mflag=" + curDef.prDefId+",height=600,width=700,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no"

                    var html = '<div class="content-child-show" id="'+curDef.prDefId+'">' +
                        '<div class="content-child-show-container">' +
                        '<div class="close1">X</div>' +
                        '<iframe width="700" scrolling="no" height="600" frameborder="0" allowtransparency="true" src='+url+'></iframe>' +
                        '</div>' +
                        '</div>';

                    $('#right-container').append(html);

                    //window.open("../yongnengjiance/MHisData.html?mflag=" + curDef.prDefId,"",
                    //    "height=600,width=700,top=" + iTop + ",left=" + iLeft + ",toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no",true);


                });
            }
            //console.log(left);
            //console.log(top);
            //console.log(_scaleX);

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
    };

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
        getUserProcs:getUserProcs,
        setScaleSign:setScaleSign,
        initializeProcSubs:initializeProcSubs,
        getAllProcsByBind:getAllProcsByBind
    };

})();

//流程图宽度
_theImgProcWidth = 0;

//流程图高度
_theImgProcHeight = 0;


$('.showOrHidden').click(function(){

        $('#container').hide();
        $('#eyeOnOff').html('切换鹰眼模式');
        $('.content-main-right').css({
            marginLeft:0,
            marginTop:0
        });

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
            });
            $('#right-container').css({
                left:'0'
            })
            $('#container').css({
                left:'0'
            });
            changeTransform('none');
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
            $('#right-container').css({
                left:'250px'
            })
            $('#container').css({
                left:'0px'
            })

            changeTransform('block');

        }
    });


function changeTransform(o1){

    var _leftRealwidth = 250;

    if(o1 == 'none'){

        _leftRealwidth = 0;

    }

    var norWidth1 = $('.page-title').width();
    //实际宽度
    var realWidth = norWidth1 - _leftRealwidth-20;

    //缩放比例计算
    var ratioZoom = realWidth / _theImgProcWidth;

    //获取底图高度
    var imgHeight =  _theImgProcHeight;


    //高度缩放比例
    var ratioZoom1 = containHeight / imgHeight;

    //真实缩放比例
    ratioZoom = ratioZoom < ratioZoom1 ? ratioZoom : ratioZoom1;

    //对左上角放大缩小按钮重绘
    _scaleX = ratioZoom;
    //console.log(ratioZoom1);
    userMonitor.setScaleSign(_scaleX,0.05);

    $('.content-main-right').css({
        'transform-origin': 'left top 0px',
        'transform': 'scale('+ratioZoom+', '+ratioZoom+')'
    })
    $('.page-content').css({
        'overflow':'hidden !important'
    })

    //右侧容器宽度
    $('#right-container').width(realWidth+20);

    //右侧容器高度
    $('#right-container').height(containHeight);

};

//给流程图增加拖动开关
var ifProcMove = true;

//流程图随鼠标拖动
$("#content-main-right").hover(function(){

    //拖动效果
    $(document).mousedown(function(e){

        var btnNum = event.button;

        //点击鼠标左键
        if(btnNum == 0 && ifProcMove){

            //禁用浏览器自带的图片拖动事件
            var dom = document.getElementById('imgProc');
            if(dom){
                dom.ondragstart=function (){return false;};
            }


            //获取鼠标初始位置
            var pagex = e.pageX;
            var pagey = e.pageY;

            //获取最初的偏移值
            var marginX = parseInt($('#content-main-right').css('marginLeft'));

            var marginY = parseInt($('#content-main-right').css('marginTop'));

            $("#right-container").mousemove(function(e){

                var i = e.pageX - pagex;
                var y = e.pageY - pagey;

                var maxWidth = $("#right-container").width();
                var maxHeight = $("#right-container").height();
                var nowX = Math.max(Math.min(i,maxWidth),0);
                var nowY = Math.max(Math.min(y,maxHeight),0);

                //随鼠标改变元素的位置
                $("#content-main-right").css({
                    marginLeft:marginX + i,
                    marginTop:marginY + y
                });

            });

            $(document).mouseup(function(){

                $("#right-container").unbind('mousemove');

            });
        }

    });

});

//数组转化为对象
function transform(obj){
    var arr = [];
    for(var item in obj){
        arr.push(obj[item]);
    }
    return arr;
};

//根据摄像头品牌获取不同的摄像头页面地址
function getMonitorUrlByBrand(brand){

    //大华摄像头
    if(brand == 1){

        return 'new-luxianghuifang/insetCurrentMonitorDahua.html';

        //海康威视摄像头
    }else  if(brand == 0){

        return 'new-luxianghuifang/insetCurrentMonitor.html';
    }
}

//关闭弹窗中的流程图
$('#right-container').on('click','.close1',function(){

    //获取到要删除的元素
    var dom = $(this).parents('.content-child-show');

    dom.remove();
});

//关闭video模态框时 停止播放
$('#my-video .close').on('click',function(){

    var myVideo = document.getElementById('play-video');   //获取视频video

    myVideo.pause();
});
