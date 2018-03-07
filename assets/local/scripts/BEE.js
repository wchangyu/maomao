 /**
 * Created by went on 2016/5/5.
 */

var BEE = (function(){

    var _assetsPath = '../../../assets/';
    var _localImgPath = 'local/img/';
    var _localCssPath = 'local/css/';
    var _localConfigsPath = 'local/configs/';
    var _isAlarmShow = false;
    var _alarmCount = 0;
     //登陆页面地址
     var _loginHtml = "../login_3.html";
    //摄像头报警
    var _cameraAlarmCount = 0;

    String.prototype.endWith = function(s){
        var d = this.length - s.length;
        return (d>=0 && this.lastIndexOf(s) == d);
    };

    String.prototype.startWith = function(s){
        return this.indexOf(s) == 0;
    };

    //从json配置中获取menu,并且配置menu
    var getMenu = function(srcUri){
        if(sessionStorage.menuStr){
            var str = sessionStorage.menuStr;
            var $sidebar = $(".page-sidebar-menu");
            if (sessionStorage.changeMenuByProcs == 1) {
                getHTMLFromMenu(changeMenuByProcs(JSON.parse(str)), $sidebar);
                sessionStorage.curMenuStr = JSON.stringify(changeMenuByProcs(JSON.parse(str)));
            }else{
                getHTMLFromMenu(JSON.parse(str), $sidebar);
                sessionStorage.curMenuStr = str;
            }
            setPageTitle();
            setHeaderInfo();
        }
        //else{
        //    var src = _assetsPath + _localConfigsPath + "menu.json";
        //    src = srcUri || src;
        //    $.ajax({
        //            url:src,
        //            type:"get",
        //            success:function(str){
        //                var $sidebar = $(".page-sidebar-menu");
        //                if($sidebar) {
        //                    $(".page-sidebar-menu li").remove('li[class!="sidebar-toggler-wrapper"]');
        //                    sessionStorage.menuStr = JSON.stringify(str);
        //                    getHTMLFromMenu(str, $sidebar);
        //                    setPageTitle();
        //                    setHeaderInfo();
        //                }
        //            },
        //            error:function(xhr,text,err){
        //            }
        //        }
        //    );
        //}
    };

    //将文本解析为菜单，和插入菜单的父级元素
    var getHTMLFromMenu = function(menu,$src){
        var li,$li,ul,$ul;
        for(var p in menu){
            var curType = menu[p]["type"];
            if(curType){
                if(curType=="0"){
                    //具体菜单操作
                    if( menu[p]["uri"]){
                        //li = '<li><a href="' + menu[p]["uri"] +'" type="'+menu[p]["arg"]+'">';
                        li = '<li><a href="' + menu[p]["uri"] + '"';
                        if(menu[p]["target"]){
                            li += ' target="' + menu[p]["target"] + '"';
                        }
                        li += '>';
                        if(window.location.href.endWith(menu[p]["uri"].replace('../','')))
                        {
                            li = '<li class="active"><a   href="' + menu[p]["uri"] +'">';
                            sessionStorage.menuArg = menu[p]["arg"];        //存储各个菜单的menuArg参数
                            sessionStorage.menuSecond = menu[p]["content"];
                            sessionStorage.menuUri = menu[p]["uri"];
                            if(menu[p]["usepointer"]){
                                sessionStorage.menuusepointer=menu[p]["usepointer"];
                            }else{
                                sessionStorage.menuusepointer="";
                            }
                        }
                        if(menu[p]["iconclass"]){
                            li += '<i class="' + menu[p]["iconclass"] +  '"></i>';
                        }
                    }else{
                        li = '<li><a href="javascript:void(0);">';
                    }

                    li += menu[p]["content"] + '</a></li>';
                    $li = $(li);
                    $src.append($li);
                }
                else if(curType=="1"){
                    //子菜单操作
                    //一级菜单不跳转

                    li = '<li><a href="javascript:void(0);">';
                    var isSelected = false;
                    if(menu[p]["submenu"]) {
                        for (var sm in menu[p]["submenu"]) {
                            if(menu[p]["submenu"][sm]["uri"]){
                                if (window.location.href.endWith(menu[p]["submenu"][sm]["uri"].replace('../',''))) {
                                    li = '<li class="active open"><a href="javascript:void(0);">';
                                    isSelected = true;
                                    sessionStorage.menuFirst = menu[p]["content"];
                                    break;
                                }
                            }
                        }
                    }
                    if(menu[p]["iconclass"]){
                        li += '<i class="' + menu[p]["iconclass"] +'"></i>';
                    }else {
                        li += '<i></i>';
                    }
                    li += '<span class="title">' + menu[p]["content"] + '</span>';
                    if(isSelected){
                        li += '<span class="selected"></span>';
                    }
                    if(!menu[p]["uri"]){
                        if(isSelected){
                            li += '<span class="arrow open"></span>';
                        }else{
                            li += '<span class="arrow "></span>';
                        }
                    }
                    li += '</a></li>';
                    $li = $(li);
                    ul = '<ul class="sub-menu"></ul>';
                    $ul = $(ul);
                    $li.append($ul);
                    $src.append($li);
                    //下级菜单
                    if(menu[p]["submenu"]){
                        getHTMLFromMenu(menu[p]["submenu"],$ul);
                    }
                }
                else if(curType == "2"){
                    //二级菜单内的非菜单显示，一般用做区段的标题
                    li = '<li><span style="color:#707070;margin-left:30px;font-size:15px;">';
                    if(menu[p]["iconclass"]){
                        li += '<i class="' + menu[p]["iconclass"] +  '"></i>';
                    }
                    li += "——" + menu[p]["content"] + '——</span></li>';
                    $li = $(li);
                    $src.append($li);
                }
            }
        }
    };

    //设置header中信息
    var setHeaderInfo = function(){
        if(sessionStorage.pageTitle) { document.title = sessionStorage.pageTitle; }
        var username = sessionStorage.realUserName || "未登录";
        $('.username').html(username);
        var systemName = sessionStorage.systemName;

        //获取是否追加企业名称
        var isShowTitleEprName = sessionStorage.isShowTitleEprName;
        if(isShowTitleEprName == 1){

            //在标题追加企业名称
            var loginArr = JSON.parse(sessionStorage.getItem('enterPriseList'));

            //企业名称
            var EnterpriseName;

            if(loginArr.length > 0){

                EnterpriseName = loginArr[0].eprName;
            }
            if(EnterpriseName != ''){
                $('.totalTitle').html(systemName + "--" + EnterpriseName);
            }else{
                $('.totalTitle').html(systemName);
            }

        }else{
            $('.totalTitle').html(systemName);
        }

        var curLoginPage = sessionStorage.curLoginPage || "login_3.html";

        if(sessionStorage.menuUri && sessionStorage.menuUri.indexOf("../") == 0){
            curLoginPage = "../" + curLoginPage;
        }

        var $logout = $('.logout-page');
        $logout.attr('href',curLoginPage);
    };

    //设置页面的标题部分
    var setPageTitle = function(){
        var menuSecond = sessionStorage.menuSecond,menuFirst = sessionStorage.menuFirst;
        if(menuSecond && menuFirst){
            var $pageTitle = $(".page-title");
            if($pageTitle.length>0){
                $pageTitle.html(menuSecond);
            }
            var $pageBreadcrumb = $(".page-breadcrumb");
            if($pageBreadcrumb.length>0){       //设置菜单的一二级显示
                $pageBreadcrumb.append('<li><a href="javascript:void(0);">' + menuFirst + '</a><i class="fa fa-angle-right"></i></li>')
                $pageBreadcrumb.append('<li><a href="javascript:void(0);">' + menuSecond + '</a></li>')
            }
        }
    };

    //设置theme
    var setTheme = function(){
        /*
         配置页面配置当前的theme，BEE.js初始化页面时候载入当前theme，如果localStorage中存有当前的theme，则获取
         设置theme按钮的选中，存储当前的theme到localStorage中，
         */
        var themeColor = localStorage.themeColor || "default";
        //$('#style_color').attr("href", Layout.getLayoutCssPath() + 'themes/' + color_ + ".css");
        var $colorCssLink = $("#style_color");
        if($colorCssLink.length == 0){       //如果当前没有style_color的css引用
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.id = "style_color";
            document.head.appendChild(link);
            $colorCssLink  = $(link);
        }
        $colorCssLink.attr("href", _assetsPath + 'admin/layout/css/themes/' + themeColor + ".css");

        var $panel = $('.theme-panel');
        var $themes = $('.theme-colors > ul > li', $panel);      //获取所有的theme选择器
        var $thisTheme = $(".theme-colors > ul > li[data-style=" + themeColor + "]",$panel);
        $themes.removeClass("current");
        $thisTheme.addClass("current");
    };

    //设置页面右上角报警信息
    //保存当前数据的时间和数据到sessionStorage中，每次打开时候比对时间，如果时间超过数据时间+刷新时间，则重新载入
    var getAlarmInfo = function(){
        //if(sessionStorage.alaDataLength){       //如果有数据，进入页面就载入
        //    setPageTopRightAlarmData(sessionStorage.alaDataLength);
        //}
        if(_isAlarmShow){
            return;
        }
        if(!sessionStorage.pointers){ return;}      //当前没有楼宇
        if(!sessionStorage.alarmInterval || sessionStorage.alarmInterval=='0'){ //当前未设置报警
            return ;
        }
        if(sessionStorage.alaInsDataTime && sessionStorage.alarmInterval && sessionStorage.alarmInterval!='0'){      //如果上次有数据时间
            var lastTime = (new Date(sessionStorage.alaInsDataTime)).getTime();
            var nowTime = (new Date()).getTime();
            var refreshItv = (sessionStorage.alarmInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
            if(nowTime - lastTime < refreshItv && refreshItv>0){
                setTimeout(getAlarmInfo,refreshItv);        //下次刷新数据使用
                return;
            }
        }

        if(document.getElementById('header_notification_bar') == null){ return;}        //当前页面没有显示报警数据的位置
        var pointers = JSON.parse(sessionStorage.pointers);
        var ptIds = [];
        for(var i= 0,len=pointers.length;i<len;i++){
            ptIds.push(pointers[i].pointerID);
        }
        var now = new Date();
        var year = now.getFullYear(),month = now.getMonth() + 1,day = now.getDate();
        var st = year + "/" + month + "/" + day + " 00:00:00";
        var et = year + "/" + month + "/" + day + " " + now.getHours() + ":" + now.getMinutes() + ":00";
        var prmData = {
            "st" : st,
            "et" : et,
            "excTypeInnerId":"",
            "energyType":"",
            "pointerIds":ptIds
        };

        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcData',
            data:prmData,
            dataType:'json',
            success:function(data){
                //console.log(data);
                if(data){       //设置右上角的报警数据显示情况
                    setPageTopRightAlarmData(data.length,data);
                    _alarmCount = data.length;
                }else{
                    setPageTopRightAlarmData(0);
                }

                //获取摄像头报警数量
                cameraAlarmHistory();

                modificationImportInfo();
                var now = new Date();
                sessionStorage.alaInsDataTime = now.toString();      //存储当前的数据载入时间
                if(sessionStorage.alarmInterval && sessionStorage.alarmInterval!='0'){
                    var refreshItv = (sessionStorage.alarmInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
                    setTimeout(getAlarmInfo,refreshItv);            //下一次获取数据

                }
            },
            error:function(xhr,res,err){
                setPageTopRightAlarmData(0);        //出错时候，清除显示
                if(sessionStorage.alarmInterval && sessionStorage.alarmInterval!='0'){
                    var refreshItv = (sessionStorage.alarmInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
                    setTimeout(getAlarmInfo,refreshItv);
                }
            }
        });
    };

    function setPageTopRightAlarmData(dataLength,data){
        var $badge = $("#header_notification_bar .badge");
        var $alarmDetail = $("#header_notification_bar .external>h3>span").eq(0);
        var $alarmBlock = $("#header_notification_bar");
        var $alertSong = $('#audioMain');
        $badge.removeClass("badge-danger");
        var iframStr = '<iframe style="width: 100%;height:680px;" src="../../../templates/views/baojingyujing/warningAlarm-blank.html?a=1"></iframe>';
        if($('#myModal00').length == 0 && dataLength>0 && data){
            var str = '<div class="modal fade" id="myModal00" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static">' +
                '<div class="modal-dialog" style="height: 836px;width: 1100px !important;">' +
                '<div class="modal-content" style="height: 836px;width: 1100px !important;">' +
                '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">报警详情</h4></div>' +
                '<div class="modal-body">' + iframStr +
                '</div>' +
                '<div class="modal-footer"><button type="button" class="btn btn-default classNote" data-dismiss="modal">关闭</button></div>' +
                '</div></div></div>';
            $('body').append(str);

            $('#myModal00').off('hidden.bs.modal',"**");
            $('#myModal00').on('hidden.bs.modal',function(){
                _isAlarmShow = false;
                var refreshItv = (sessionStorage.alarmInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
                setTimeout(getAlarmInfo,refreshItv);
            });

        }

        if($badge.length>0){        //设置当前报警显示的内容
            if(dataLength==0){
               $badge.html("");            //当前警告的小圆点
                //$alarmDetail.html("");      //当前警告的下拉li第一项内容
                //$alarmBlock.hide();         //页面右上角警告的内容
                if(sessionStorage.alaDataLength){
                    sessionStorage.removeItem('alaDataLength');
                }
                $alertSong.removeAttr('autoplay');
                $alertSong.removeAttr('loop');
                $('#myModal00').modal('hide');
            }else{
                $badge.addClass("badge-danger");
                $badge.html(dataLength);
                //$alarmDetail.html(dataLength);
                $alarmBlock.show();
                sessionStorage.alaDataLength = dataLength;
                var alarmAlert = sessionStorage.alarmAlert || 0;
                var alarmSong = sessionStorage.alarmSong || 0;
                //声音
                var audioStr = '<audio src="../resource/song/alert.mp3" id="audioMain" controls="controls" autoplay="autoplay" style="display: none"></audio>';

                //$('#myModal00').off('shown.bs.modal');

                if(alarmAlert == 1 && alarmSong == 1){  //声音开启，弹窗开启

                    if($('#audioMain')){
                        $('#header_notification_bar').children('audio').remove();
                    }

                    $('#myModal00').modal('show');

                    $('#myModal00').one('shown.bs.modal', function () {
                        var childNode= document.getElementsByTagName('audio')[0];

                        if(!childNode){
                            $('#header_notification_bar').append(audioStr);
                        }

                    });
                    _isAlarmShow = true;
                }else if(alarmAlert == 1 &&  alarmSong == 0){  //声音关闭，弹窗开启
                    $('#myModal00').modal('show');
                    _isAlarmShow = true;
                }else if(alarmAlert == 0 &&  alarmSong == 1){ //声音开启，弹窗关闭

                    var childNode= document.getElementsByTagName('audio')[0];

                    if(!childNode){
                        $('#header_notification_bar').append(audioStr);
                    }

                    $('#myModal00').modal('hide');
                    _isAlarmShow = false;
                }else if(alarmAlert == 0 && alarmSong == 0){ //声音关闭，弹窗关闭
                    $('#myModal00').modal('hide');
                    _isAlarmShow = false;
                }
            }
        }
    };

     var timename2;

     //对页面右上角当前重要信息进行重绘
     var modificationImportInfo = function(){

         //定义给悬浮窗中插入的信息
         var infoHtml = '<li class="top-close" style="height:10px;background: #eaedf2;padding-top: 3px;overflow: hidden;box-sizing: content-box"><strong class="close" style="display: inline-block;background: url(\'../resource/img/close.png\') no-repeat center;background-size:100%" ></strong></li>';

         var $badge = $("#header_notification_bar .badge");
         var $dropdownMenu = $("#header_notification_bar .dropdown-menu");

         //对右上角显示报警数据的红圈进行隐藏
         $badge.hide();

        //根据配置信息动态改变悬浮窗中的值

         //是否需要显示报警信息
         if(sessionStorage.alarmInterval && sessionStorage.alarmInterval!='0' && _alarmCount > 0) {
            infoHtml += '<li class="external">' +
                '   <h3><span class="bold">'+_alarmCount+' </span> 当日报警</h3>' +
                '   <a href="../baojingyujing/warningAlarm-3.html" target="_blank">查看详细</a>' +
                '</li>';

         }
         //console.log(_cameraAlarmCount);

         if(_cameraAlarmCount > 0){

             infoHtml += '<li class="external">' +
                 '   <h3><span class="bold">'+_cameraAlarmCount+' </span> 摄像头报警</h3>' +
                 '   <a href="../new-baojingyujing/warningCamera.html" target="_blank">查看详细</a>' +
                 '</li>';
         }

         //是否显示工单信息
         if(sessionStorage.gongdanInterval && sessionStorage.gongdanInterval!='0') {
             //根据配置判断走哪条支路 0为铁路  1为医院
             if(!sessionStorage.gongdanIndustryType || sessionStorage.gongdanIndustryType == 0){
                 var prmData = {
                     gdZht:0,
                     gdZhts: [
                         1,2,3,4,5,6
                     ],
                     isReturnZhtArray:1,
                     userID:sessionStorage.getItem('userName'),
                     userName:sessionStorage.getItem('realUserName')
                 };
                 //获取工单信息数据
                 $.ajax({
                     type:'post',
                     url:sessionStorage.apiUrlPrefix + 'YWGD/ywGDGetZh2',
                     data:prmData,
                     dataType:'json',
                     success: function (data) {

                         //获取新工单条数
                         var num1 = 0;
                         $(data.zhts).each(function(i,o){
                             if(o == 1){
                                 num1 ++;
                             }
                         });
                         //加入新工单信息
                         infoHtml += addInfoMessage(num1,'新工单','productionOrder-3.html','../gongdangunali/');
                         //获取待审核备件
                         var num2 = 0;
                         $(data.clstatus).each(function(i,o){
                             if(o == 1){
                                 num2 ++;
                             }
                         });
                         //加入待审核备件信息
                         infoHtml += addInfoMessage(num2,'待审核备件','productionOrder-8.html','../gongdangunali/');

                         //获取待审核备件
                         var num3 = 0;
                         $(data.clstatus).each(function(i,o){
                             if(o == 6){
                                 num3 ++;
                             }
                         });
                         //加入待闭环备件信息
                         infoHtml += addInfoMessage(num3,'待闭环备件','productionOrder-8.html','../gongdangunali/');

                         //给悬浮窗插入指定信息
                         $dropdownMenu.html(infoHtml);

                         $('.top-close .close').off('click');
                         $('.top-close .close').on('click',function(){

                             $(this).parents('.dropdown-menu').hide();
                         });

                         if(timename2){
                             clearTimeout(timename2);
                         }

                         //判断是否需要动态弹出信息框
                         if(num1 != 0 || num2 != 0 || num3 != 0 || _cameraAlarmCount > 0 || _alarmCount > 0){
                             $('.dropdown-menu').hide();
                             //给上方铃铛增加闪烁效果
                             $('.dropdown-toggle .icon-bell').hide();

                             $('.dropdown-extended .dropdown-toggle').css({
                                 display:'inline-block',
                                 height:'100%',
                                 background:'url(../resource/img/bellSmall.gif) no-repeat center center',
                                 backgroundSize:'26px 24px'
                             });

                             timename2=setTimeout(function(){
                                 $('.dropdown-extended .dropdown-menu').toggle('fast');
                             },600);

                         }else{

                             $(".dropdown-extended .dropdown-toggle").removeAttr("style");
                             if(timename2){
                                 clearTimeout(timename2);
                             }

                             $('.dropdown-extended .dropdown-menu').hide();

                         }
                         //判断是否需要定时刷新
                         if(sessionStorage.gongdanInterval && sessionStorage.gongdanInterval!='0'){
                             var refreshItv = (sessionStorage.gongdanInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
                             setTimeout(modificationImportInfo,refreshItv);
                         }

                     },
                     error: function (XMLHttpRequest, textStatus, errorThrown) {
                         //判断是否需要定时刷新
                         if(sessionStorage.gongdanInterval && sessionStorage.gongdanInterval!='0'){
                             var refreshItv = (sessionStorage.gongdanInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
                             setTimeout(modificationImportInfo,refreshItv);
                         }
                     }
                 });

                 //<--------------------------------医院模式----------------------------------->
             }else{

                 //获取当前菜单
                 var curMenu = sessionStorage.curMenuStr;
                 //待下发页面
                 var gdAcceptance = 'gdAcceptance.html';
                 //待接单页面
                 var gdOrders = 'gdOrders.html';
                 //待关单页面
                 var gdClosing = 'gdClosing.html';
                 //判断是否有查看下发或者接单的权限
                 if(curMenu.indexOf(gdAcceptance) != -1 || curMenu.indexOf(gdOrders) != -1 || curMenu.indexOf(gdClosing) != -1){
                     //获取当前时间
                     var _momentNow = moment();
                     var st = _momentNow.subtract('7','days').format('YYYY-MM-DD');
                     var et = _momentNow.add('8','days').format('YYYY-MM-DD');
                     //获取部门科室编号
                     var bxKeshiNum = sessionStorage.userDepartNum;
                     var prmData = {
                         gdZht:0,
                         gdZhts: [
                             1,2,6,11
                         ],
                         isReturnZhtArray:1,
                         gdSt:st,
                         gdEt:et,
                         isQueryExceedTime:1,
                         wxKeshi:bxKeshiNum,
                         bxKeshiNum:bxKeshiNum,
                         userID:sessionStorage.getItem('userName'),
                         userName:sessionStorage.getItem('realUserName')
                     };
                     //获取工单信息数据
                     $.ajax({
                         type:'post',
                         url:sessionStorage.apiUrlPrefix + 'YWGD/ywGDGetZhtCnt',
                         data:prmData,
                         dataType:'json',
                         success: function (data) {

                             if(data == null){
                                 //判断是否需要定时刷新
                                 if(sessionStorage.gongdanInterval && sessionStorage.gongdanInterval!='0'){
                                     var refreshItv = (sessionStorage.gongdanInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
                                     setTimeout(modificationImportInfo,refreshItv);
                                 }

                                 return false;
                             }
                             //获取待下发条数
                             var num1 = 0;
                             $(data.zhts).each(function(i,o){
                                 if(o == 1 || o == 11){
                                     num1 ++;
                                 }
                             });
                             if(num1 > 0){
                                 //加入待下发信息
                                 infoHtml += addInfoMessage(num1,'待下发','gdAcceptance.html','../gongdanxitong/');
                             }

                             //获取二次受理备件
                             var num11 = data.zhtecshl;
                             if(num11 > 0){
                                 //加入二次派单备件信息
                                 infoHtml += addInfoMessage(num11,'二次受理','gdAcceptance.html','../gongdanxitong/');
                             }

                             //获取待接单备件
                             var num2 = 0;
                             $(data.zhts).each(function(i,o){
                                 if(o == 2){
                                     num2 ++;
                                 }
                             });
                             if(num2 > 0){
                                 //加入待接单备件信息
                                 infoHtml += addInfoMessage(num2,'待接单','gdOrders.html','../gongdanxitong/');
                             }

                             //获取二次派单备件
                             var num21 = data.zhtecpg;
                             if(num21 > 0){
                                 //加入二次派单备件信息
                                 infoHtml += addInfoMessage(num21,'二次派单','gdOrders.html','../gongdanxitong/');
                             }

                             //获取待关单备件
                             var num3 = 0;
                             $(data.zhts).each(function(i,o){
                                 if(o == 6){
                                     num3 ++;
                                 }
                             });
                             if(num3 > 0){
                                 //加入待关单备件信息
                                 infoHtml += addInfoMessage(num3,'待关单','gdClosing.html','../gongdanxitong/');
                             }
                             //给悬浮窗插入指定信息
                             $dropdownMenu.html(infoHtml);

                             if(timename2){
                                 clearTimeout(timename2);
                             }
                             //判断是否需要动态弹出信息框
                             //if(num1 != 0 && curMenu.indexOf(gdAcceptance) != -1 || num2 != 0 && curMenu.indexOf(gdOrders) != -1 || num3 != 0 && curMenu.indexOf(gdClosing) != -1){
                             if($('.dropdown-menu .external').length > 0){
                                 //console.log(33);
                                 $('.dropdown-menu').hide();
                                 //给上方铃铛增加闪烁效果
                                 $('.dropdown-toggle .icon-bell').hide();

                                 $('.dropdown-extended .dropdown-toggle').css({
                                     display:'inline-block',
                                     height:'100%',
                                     background:'url(../resource/img/bellSmall.gif) no-repeat center center',
                                     backgroundSize:'26px 24px'
                                 });
                                 //声音
                                 var audioStr = '<audio src="../resource/song/alert.mp3" id="audioMain1" controls="controls" autoplay="autoplay"  style="display: none"></audio>';

                                 if($('#audioMain1').length > 0){

                                     $('#header_notification_bar').children('audio').remove();

                                     $('#header_notification_bar').append(audioStr);
                                 }else{

                                     $('#header_notification_bar').append(audioStr);
                                 }

                                 timename2=setTimeout(function(){
                                     $('.dropdown-extended .dropdown-menu').toggle('fast');
                                 },600);

                             }else{

                                 $('.dropdown-toggle .icon-bell').show();

                                 $(".dropdown-extended .dropdown-toggle").removeAttr("style");
                                 if(timename2){
                                     clearTimeout(timename2);
                                 }
                                 $('.dropdown-extended .dropdown-menu').hide();
                                 if($('#audioMain1').length > 0){

                                     $('#header_notification_bar').children('audio').remove();

                                 }

                             }
                             $('.top-close .close').off('click');
                             $('.top-close .close').on('click',function(){

                                 $(this).parents('.dropdown-menu').hide();
                                 //关闭声音
                                 if($('#audioMain1').length > 0){

                                     $('#header_notification_bar').children('audio').remove();

                                 }
                             });

                             //判断是否需要定时刷新
                             if(sessionStorage.gongdanInterval && sessionStorage.gongdanInterval!='0'){
                                 var refreshItv = (sessionStorage.gongdanInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
                                 setTimeout(modificationImportInfo,refreshItv);
                             }

                         },
                         error: function(XMLHttpRequest, textStatus, errorThrown) {
                             //判断是否需要定时刷新
                             if(sessionStorage.gongdanInterval && sessionStorage.gongdanInterval!='0'){
                                 var refreshItv = (sessionStorage.gongdanInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
                                 setTimeout(modificationImportInfo,refreshItv);
                             }
                         }
                     });
                 }else{
                     //给悬浮窗插入指定信息
                     $dropdownMenu.html(infoHtml);
                     //关闭按钮
                     $('.top-close .close').off('click');
                     $('.top-close .close').on('click',function(){

                         $(this).parents('.dropdown-menu').hide();
                         //关闭声音
                         if($('#audioMain1').length > 0){

                             $('#header_notification_bar').children('audio').remove();

                         }
                     });
                 }
             }
         }else{
             //给悬浮窗插入指定信息
             $dropdownMenu.html(infoHtml);
             //关闭按钮
             $('.top-close .close').off('click');
             $('.top-close .close').on('click',function(){

                 $(this).parents('.dropdown-menu').hide();

                 //关闭声音
                 if($('#audioMain1').length > 0){

                     $('#header_notification_bar').children('audio').remove();

                 }

             });
         }
     };

     //加入新工单信息 data 数据量 title 提示信息  address 跳转地址 catalog 根路径
     var addInfoMessage = function(data,title,address,catalog){
         var html = '';
         //获取当前菜单
         var curMenu = sessionStorage.curMenuStr;
         //获取当前页面文件路径
         var url = window.location.href;
         //判断是否有打开查看详细的权限
         if(curMenu.indexOf(address) != -1){
             html +='<li class="external">' +
                 '   <h3><span class="bold">'+data+' </span>'+title+'</h3>';
             if(url.indexOf(address) != -1){
                 html += '</li>';
             }else{
                 html +=  '<a href="'+catalog+''+address+'" target="_blank">查看详细</a>' +
                     '</li>';
             }

         }else{

         }
         return html;
     };

     //给页面动态插入显示楼宇的树状图
     function insertionPointer(){
         //判断是否需要显示楼宇
         var _isShowPointer = sessionStorage.getItem('menuusepointer');
         //如果不需要显示，终止函数
         if(_isShowPointer != 1 ){
             return false;
         }

         //上方控制开关
         var buttonHtml = '   <div class="toolContainer"  style="">' +
             '       <div id="onOff" style="">' +
             '           楼宇列表' +

             '   </div>';
         //$('body').append(buttonHtml);fa-building

         //给页面上方添加显示当前楼宇的字段
         var pointerHtml = '<a href="javascript:void(0);" id="onOff1" style="color: rgb(102, 102, 102);" title="点击切换地点">清华美院</a><i class="fa fa-building" style="font-size: 16px;margin-left:10px;"></i>';

         $('.page-title').html(pointerHtml);

         var html = ' <div class="left-middle-main" style="width:250px;position: absolute;height:500px;left:255px;top:100px;border:1px solid #999;overflow-y: auto;background:#dceffd;box-shadow: 1px 2px 1px rgba(0,0,0,.15);display: none" id="add-point-byBEE">' +
             '     <div class="left-middle-content" style="width:100%;margin-top:0;background:#4d91be !important;">' +
             '         <div class="left-middle-tab" style="width:100%;text-align: center;height:30px;background:#4d91be !important;">区域位置</div>' +
             '     </div>' +
             '     <div class="tree-1 tree-3" style="background: none;">' +
             '         <div class="left-middle-input">' +
             '             <input id="keys1" type="tplaceholder="搜索..." >' +
             '         </div>' +
             '         <div class="tipess"></div>' +
             '         <ul class="allPointer ztree" id="allPointers">' +
             '         </ul>' +
             '     </div>' +
             ' </div>';

         $('body').append(html);

         //获取楼宇列表
         _objectSel = new ObjectSelection();
         _objectSel.initPointers($("#allPointers"),true,false,true);

         //搜索功能（楼宇）
         var objSearchs = new ObjectSearch();
         objSearchs.initPointerSearch($("#keys1"),$(".tipess"),"allPointers");

         //上方开关绑定事件
         $('#onOff1').off('click');
         $('#onOff1').on('click',function(){

             if($('#add-point-byBEE').is(':hidden')){

                 $('#add-point-byBEE').toggle('fast');
             }else{

                 $('#add-point-byBEE').toggle('fast');
             }
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

    //根据流程图动态绘制菜单
     var changeMenuByProcs = function(menu){
         //将对象转化为数组，方便处理
         var _menuArr = transform(menu);
         //删除对象中第一个元素
         _menuArr.shift();
         //定义新的菜单对象
         var _newMenu = {};
         _newMenu.content = menu.content;
         $(_menuArr).each(function(i,o){
             //调用菜单处理函数
             var _showMenu = changeMenuByArg(o);
             if(_showMenu){
                _newMenu[_showMenu['content']] = _showMenu;
             }
         });
         return _newMenu;
     };

     //对父级菜单下的子菜单根据流程图以及Arg参数进行处理
     var changeMenuByArg = function(menu){
         //获取父级菜单下的子菜单,并将其转化为数组
         var _childMenuArr = transform(menu.submenu);
         $(_childMenuArr).each(function(i,o){

            //判断子菜单是否需要保留
            var isRetain =  retainChildMenu(o);
             //不需要保留则直接移除
             if(!isRetain){
                 _childMenuArr.remove(o);
             }
         });
         //判断主菜单下是否存在子菜单
         if(_childMenuArr.length == 0){
             return false;
         }else{
             var obj = {};
             $(_childMenuArr).each(function(i,o){

                 //当二级分项下没有子项时，将其隐藏
                 if(o.type == 2){
                     if(!_childMenuArr[i+1] || _childMenuArr[i+1].type == 2){

                         return true;
                     }
                 }

                 obj[o.content+''+i] = o;
             });
         }
         menu.submenu = obj;
         //返回筛选后的菜单
         return menu;
     };

     //根据流程图判断以及Arg参数判断子菜单是否需要保留
     var retainChildMenu = function(childMenu){
        //首先判断是否是流程图界面
         var uri = childMenu.uri;
         if(!uri){
             return true;
         }
         //非流程图界面
         if(uri.indexOf('energyMonitor.html') == -1){
             //非流程图界面判断角色权限；
             return retainChildMenu1(childMenu);
         }else{

            // 获取全部流程图
             var allProcsArr = JSON.parse(sessionStorage.allProcs);
            //获取到当前的arg参数
             var arg = childMenu.arg;
            //判断是否需要根据楼宇获取对应流程图
             var pointer = childMenu.usepointer;
             //需要根据楼宇判断
             if(pointer){
                 // 获取页面中存储的楼宇列表
                 var curPointer = sessionStorage.curPointerId;
                 if(!curPointer){
                     //获取楼宇列表
                     var pointerID;
                     if(JSON.parse(sessionStorage.pointers).length != 0){
                         pointerID = JSON.parse(sessionStorage.pointers)[0].pointerID;
                     }
                     sessionStorage.curPointerId = pointerID;
                     curPointer = pointerID;
                 }
                 //对流程图根据楼宇进行筛选
                 $(allProcsArr).each(function(i,o){
                     if(o.bindType != 2 || o.bindKeyId != curPointer){
                         allProcsArr.remove(o);
                     }
                 })
             }
            //根据arg参数及流程图对子菜单进行判断
             return ifExistProcs(allProcsArr,arg);
         }
     };

     //根据角色权限判断子菜单是否需要保留
     var retainChildMenu1 = function(childMenu){
         //首先判断是否存在角色权限参数
         var arg2 = childMenu.arg2;
         if(arg2){
            //获取权限参数
             var role = sessionStorage.userRole;
             if(role && arg2.indexOf(role) >= 0 ){
                 return true;
             }else{
                 return false;
             }
         }
         return true;
     };

     //根据arg参数判断当前菜单下是否存在流程图
     var ifExistProcs = function(procsArr,arg){
        // 获取流程图显示方式
        var showStyle = arg.split(',')[0];
         //获取具体筛选条件
         var type =arg.split(',')[1];
         //根据流程图类型进行判断
         if(showStyle == 0 || showStyle == 2){
             $(procsArr).each(function(i,o){
                 if(o.pubProcType != type){
                     procsArr.remove(o);
                 }
             });
         //    根据流程图方案ID进行判断
         }else if(showStyle == 1){
             $(procsArr).each(function(i,o){
                 if(type.indexOf(o.procID) == -1){
                     procsArr.remove(o);
                 }
             });
             //    根据流程图楼宇ID进行判断
         }else if(showStyle == 3){
             $(procsArr).each(function(i,o){
                 if(o.bindKeyId != type){
                     procsArr.remove(o);
                 }
             });
         }
         //判断是否存在符合条件的流程图
         if(procsArr.length == 0){
             return false;
         }else{
             return true;
         }

     };

     //数组转化为对象
     function transform(obj){
         var arr = [];
         for(var item in obj){
             arr.push(obj[item]);
         }
         return arr;
     };

     //判断已登陆用户是否有访问页面的权限
     var permitJumpPage = function(){
        //获取当前菜单
        var curMenu = sessionStorage.curMenuStr;

        //获取当前页面路径
        var curUrl = window.location.href;

        //获取页面名称
        var curPageName = curUrl.split('/').pop();

         //如果是非流程图页面且传递参数，则把后面的参数去掉
         if(curPageName.indexOf('energyMonitor.html') == -1 && curPageName.indexOf('?') > -1){

             curPageName = curPageName.split('?')[0];

         }

        //判断是否有访问页面权限
        if(curMenu.indexOf(curPageName) == -1){

            //本地浏览时不需要跳转
            if(curUrl.indexOf('localhost:') >= 0 || curPageName.indexOf('jumpEnergyMonitor.html') >= 0){

                return false;
            }

            //如果没有则跳转到登陆页
            window.history.go(-1);

        }
    };

     //获取摄像头报警数据
     function cameraAlarmHistory(){

         var pointerID = [];

         var startRealTime = moment().subtract('24','hours').format('YYYY-MM-DD HH:mm:ss');
         var endRealTime = moment().format('YYYY-MM-DD HH:mm:ss');

         var getPointers = JSON.parse(sessionStorage.getItem('pointers'));
         if(getPointers){
             for(var i=0;i<getPointers.length;i++){
                 pointerID.push(getPointers[i].pointerID)
             }
         }

         var prm = {
             'startTime' : startRealTime,
             'endTime' : endRealTime,
             'pointerIds' : pointerID,
             'excTypeInnderId' : ''
         };

         $.ajax({
             type:'post',
             url:sessionStorage.apiUrlPrefix + 'Alarm/GetAlarmCameraDatas',
             data:prm,
             async:false,
             success:function(result){

                 //console.log(result);

                 if(result == null){

                    return false;
                 }

                 var camearArr = [];

                 $(result).each(function(i,o){

                     if(o.flag == 0){
                         camearArr.push(o)
                     }
                 });

                 if(camearArr != null){
                     //摄像头报警数量
                     _cameraAlarmCount = camearArr.length;
                 }
             }
         });
     };

     //iframe只显示部分div

    //获取当前的url
     var curUrl = window.parent.location.href;

     if( curUrl.indexOf('passengerStation.html') > -1 ){

        $('.page-header').hide();

         $('.page-sidebar-menu').hide();

         $('.page-container').css({'margin-top':0});

         $('.page-footer').hide();

         $('.page-content').addClass('page-content-nest');

         $('body').css({background:'#ffffff'});

         $('.toggler').hide();
     }

    return {

        //getMenu: getMenu
        //flag =true 则不需要判断用户的访问页面权限
        init:function(flag){
            if(!sessionStorage.userName)
            {
                sessionStorage.redirectFromPage = window.location.href;      //记录重定向的url
                window.location.href = _loginHtml;

            }else{
                //获取菜单
                getMenu();
                //setHeaderInfo();
                //判断已登陆用户是否有访问页面的权限
                if(!flag){

                    permitJumpPage();

                }
                setTheme();
                insertionPointer();

                //重绘页面右上角信息
                modificationImportInfo();

                if(sessionStorage.alarmInterval && sessionStorage.alarmInterval!='0') {

                    getAlarmInfo();

                }
            }
        }
    }



})();