 /**
 * Created by went on 2016/5/5.
 */

var BEE = (function(){

    var _assetsPath = '../../../assets/';
    var _localImgPath = 'local/img/';
    var _localCssPath = 'local/css/';
    var _localConfigsPath = 'local/configs/';
    var _isAlarmShow = false;

    String.prototype.endWith = function(s){
        var d = this.length - s.length;
        return (d>=0 && this.lastIndexOf(s) == d);
    }

    String.prototype.startWith = function(s){
        return this.indexOf(s) == 0;
    }

    //从json配置中获取menu,并且配置menu
    var getMenu = function(srcUri){
        if(sessionStorage.menuStr){
            var str = sessionStorage.menuStr;
            var $sidebar = $(".page-sidebar-menu");
            getHTMLFromMenu(JSON.parse(str), $sidebar);
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
    }

    //将文本解析为菜单，和插入菜单的父级元素
    var getHTMLFromMenu = function(menu,$src){
        var li,$li,ul,$ul;
        for(var p in menu){
            var curType = menu[p]["type"];
            if(curType){
                if(curType=="0"){
                    //具体菜单操作
                    if( menu[p]["uri"]){
                        li = '<li><a href="' + menu[p]["uri"] +'">';
                        if(window.location.href.endWith(menu[p]["uri"].replace('../','')))
                        {
                            li = '<li class="active"><a href="' + menu[p]["uri"] +'">';
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
        var username = sessionStorage.userName || "未登录";
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
    }

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
    }


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
    }


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
            "pointerIds":ptIds,
        };
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcData',
            data:prmData,
            dataType:'json',
            success:function(data){
                if(data){       //设置右上角的报警数据显示情况
                    setPageTopRightAlarmData(data.length,data);
                }else{
                    setPageTopRightAlarmData(0);
                }
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
    }

    function setPageTopRightAlarmData(dataLength,data){
        var $badge = $("#header_notification_bar .badge");
        var $alarmDetail = $("#header_notification_bar .external>h3>span");
        var $alarmBlock = $("#header_notification_bar");
        var $alertSong = $('#audioMain');
        $badge.removeClass("badge-danger");
        if($('#myModal00').length == 0 && dataLength>0 && data){
            var str = '<div class="modal fade" id="myModal00" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static">' +
                '<div class="modal-dialog" style="height: 836px;width: 1100px !important;">' +
                '<div class="modal-content" style="height: 836px;width: 1100px !important;">' +
                '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">报警详情</h4></div>' +
                '<div class="modal-body"><table id="alarmTable" class="table table-striped table-bordered table-advance table-hover" cellspacing="0" width="100%"></table></div>' +
                '<div class="modal-footer"><button type="button" class="btn btn-default classNote" data-dismiss="modal">关闭</button></div>' +
                '</div></div></div>'
            $('body').append(str);
            $('#myModal00').off('hidden.bs.modal',"**");
            $('#myModal00').on('hidden.bs.modal',function(){
                _isAlarmShow = false;
                var refreshItv = (sessionStorage.alarmInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
                setTimeout(getAlarmInfo,refreshItv);
            });
            var $alarmTable = $('#alarmTable');
            if($alarmTable){
                $alarmTable.DataTable({
                    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
                    "paging": true,   //是否分页
                    "destroy": true,//还原初始化了的datatable
                    "searching": false,
                    "ordering": false,
                    // "scrollY": "300px",
                    'language': {
                        'emptyTable': '没有数据',
                        'loadingRecords': '加载中...',
                        'processing': '查询中...',
                        'lengthMenu': '每页 _MENU_ 条',
                        'zeroRecords': '没有数据',
                        'info': '第_PAGE_页/共_PAGES_页',
                        'infoEmpty': '没有数据',
                        'paginate':{
                            "previous": "上一页",
                            "next": "下一页",
                            "first":"首页",
                            "last":"尾页"
                        }
                    },
                    "dom":'B<"clear">lfrtip',
                    'buttons': [

                    ],
                    "columns": [
                        {
                            "title":"时间",
                            "data":"dataDate",
                            "render":function(data,type,row,meta){
                                if(data && data.length >0){
                                    return data.split('T')[0] + ' ' + data.split('T')[1];
                                }
                            }
                        },
                        {
                            "title": "支路",
                            "class":"L-checkbox",
                            "data":"cName"
                        },
                        {
                            "title": "名称",
                            "data":"pointerName"
                        },
                        {
                            "title": "报警类型",
                            "data":"cDtnName"
                        },
                        {
                            "title": "报警条件",
                            "data":"expression"
                        },
                        {
                            "title": "此时数据",
                            "data":"data"
                        },
                        {
                            "title": "单位房间",
                            "data":"rowDetailsExcDatas"
                        },
                        {
                            "title": "报警等级",
                            "data":"priority"
                        },
                        {
                            "class":"alaLogID alaLogIDs hide",
                            "data":"alaLogID"
                        },
                        {
                            "class":"alaLogID pointerID hide",
                            "data":"pointerID"
                        },
                        {
                            "title": "处理备注",
                            "targets": -1,
                            "data": null,
                            "defaultContent": "<button class='btn btn-success clickButtons' data-toggle='modal' data-target='#myModal02' onclick='addInfo($(this))'>点击处理</button>" +
                            "<div class='modal fade' id='myModal02' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true' data-backdrop='static'>" +
                            "<div class='modal-dialog' style='position: absolute;left: 50%;top:50%;margin-top: -87px;margin-left: -300px'>" +
                            "<div class='modal-content'>" +
                            "<div class='modal-header'><button type='button' class='close' aria-hidden='true' onclick='closes()'>&times;</button><h4 class='modal-title' id='myModalLabel'>报警处理备注</h4><div class='modal-body'><textarea type='text'  style='width: 538px;line-height: 30px;border: 1px solid #CCCCCC;outline: none'></textarea></div><div class='modal-footer'><button type='button' class='btn btn-primary submitNote' onclick='addClick()'>提交更改</button><button type='button' class='btn btn-default' onclick='closes()'>关闭</button></div></div>" +
                            "</div>" +
                            "</div>" +
                            "</div>"
                        }
                    ]
                });
                var table = $('#alarmTable').dataTable();
                if(data.length == 0){
                    table.fnClearTable();
                    table.fnDraw();
                }else{
                    table.fnClearTable();
                    table.fnAddData(data);
                    table.fnDraw();
                }
            }

        }

        if($badge.length>0){        //设置当前报警显示的内容
            if(dataLength==0){
               $badge.html("");            //当前警告的小圆点
                $alarmDetail.html("");      //当前警告的下拉li第一项内容
                $alarmBlock.hide();         //页面右上角警告的内容
                if(sessionStorage.alaDataLength){
                    sessionStorage.removeItem('alaDataLength');
                }
                $alertSong.removeAttr('autoplay');
                $alertSong.removeAttr('loop');
                $('#myModal00').modal('hide');
            }else{
                $badge.addClass("badge-danger");
                $badge.html(dataLength);
                $alarmDetail.html(dataLength);
                $alarmBlock.show();
                sessionStorage.alaDataLength = dataLength;
                var alarmAlert = sessionStorage.alarmAlert || 0;
                var alarmSong = sessionStorage.alarmSong || 0;
                //声音
                var audioStr = '<audio src="../resource/song/alert.mp3" id="audioMain" controls="controls" autoplay="autoplay" loop="loop" style="display: none"></audio>';

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
    }


     //给页面动态插入显示楼宇的树状图
     function insertionPointer(){
         //判断是否需要显示楼宇
         var _isShowPointer = sessionStorage.getItem('menuusepointer');


         //如果不需要显示，终止函数
         if(_isShowPointer != 1){
             return false;
         }
         //$.getScript("../../../templates/resource/js/pointersoffices.js");
         $.getScript("../../../templates/views/resource/js/pointersoffices.js",function(){  //加载test.js,成功后，并执行回调函数
             console.log("加载js文件");
             //上方控制开关
             var buttonHtml = '   <div class="toolContainer"  style="width:150px; height:34px;background:white;box-shadow: 1px 2px 1px rgba(0,0,0,.15);color:#4c4c4c;background-color: #f1f1f1;position: fixed;right:80px;top:180px;">' +
                 '       <div id="onOff" style="0px 1.5px no-repeat;">' +
                 '           楼宇列表' +

                 '   </div>';
             $('body').append(buttonHtml);

             //下方楼宇列表
             var html = ' <div class="left-middle-main" style="width:250px;position: fixed;height:500px;right:80px;top:220px;border:1px solid #999;overflow-y: auto;background:#f1f1e3;box-shadow: 1px 2px 1px rgba(0,0,0,.15);display: none" id="add-point-byBEE">' +
                 '     <div class="left-middle-content" style="width:100%;margin-top:0">' +
                 '         <div class="left-middle-tab" style="width:100%;text-align: center;height:30px;">区域位置</div>' +
                 '     </div>' +
                 '     <div class="tree-1 tree-3" style="background:none">' +
                 '         <div class="left-middle-input">' +
                 '             <input id="keys" type="tplaceholder="搜索..." >' +
                 '         </div>' +
                 '         <div class="tipess"></div>' +
                 '         <ul class="allPointer ztree" id="allPointer">' +
                 '         </ul>' +
                 '     </div>' +
                 ' </div>';

             $('body').append(html);

             //获取楼宇列表
             _objectSel = new ObjectSelection();
             _objectSel.initPointers($("#allPointer"),true,false,true);

             //搜索功能（楼宇）
             var objSearchs = new ObjectSearch();
             objSearchs.initPointerSearch($("#keys"),$(".tipess"),"allPointer");

             //上方开关绑定事件
             $('#onOff').off('click');
             $('#onOff').on('click',function(){

                 if($('#add-point-byBEE').is(':hidden')){

                     $('#onOff').css({
                         background:'url("../resource/img/offs.png") no-repeat 0 1.5px'
                     })
                     $('#add-point-byBEE').show();

                 }else{

                     $('#onOff').css({
                         background:'url("../resource/img/off.png") no-repeat 0 1.5px'

                     })
                     $('#add-point-byBEE').hide();
                 }
             })
         });



     }


    return {
        //getMenu: getMenu
        init:function(){
            if(!sessionStorage.userName)
            {
                sessionStorage.redirectFromPage = window.location.href;      //记录重定向的url
                window.location.href = "../login_3.html";
            }else{
                getMenu();
                //setHeaderInfo();
                setTheme();
                insertionPointer();
                if(sessionStorage.alarmInterval && sessionStorage.alarmInterval!='0') {
                    getAlarmInfo();
                }
            }
        }
    }
})();