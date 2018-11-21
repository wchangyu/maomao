var ESCS = function () {

    var addZeroToSingleNumber = function (num) {
        var curnum = "";
        if (num < 10) {
            curnum = "0" + num;
        }
        else {
            curnum += num;
        }
        return curnum;
    }

    //切换楼宇的
    var onbodydownEpr = function (event) {
        if (!(event.target.id == "openeprBtn"
            || event.target.id == "eprBox"
            || $(event.target).parents("#eprBox").length > 0)) {
            onhidemenuEpr();
        }
    };

    var onhidemenuEpr = function () {
        $("#eprBox").fadeOut("fast");
        $("body").unbind("mousedown", onbodydownEpr);
    }

    //切换单位的
    var onbodydownEpr1 = function (event) {
        if (!(event.target.id == "miscBtn"
            || event.target.id == "eprBox1"
            || $(event.target).parents("#eprBox1").length > 0)) {
            onhidemenuEpr1();
        }
    };

    var onhidemenuEpr1 = function () {
        $("#eprBox1").remove();
        $("body").unbind("mousedown", onbodydownEpr1);
    }

    //重组epr格式
    var initeprs = function () {
        var orgs = JSON.parse(sessionStorage.pointers);

        var eprs = [];
        _.each(orgs, function (e, i) {
            var epr = {};
            if (eprs.length === 0) {
                epr.enterpriseID = orgs[i].enterpriseID;
                epr.eprName = orgs[i].eprName;
                eprs.pos = [];
                eprs.push(epr);
            } else {
                //判断是否存在
                var ex = _.where(eprs, { enterpriseID: e.enterpriseID })
                if (ex.length === 0) {
                    epr.enterpriseID = orgs[i].enterpriseID;
                    epr.eprName = orgs[i].eprName;
                    eprs.pos = [];
                    eprs.push(epr);
                }
            }
        })
        _.each(eprs, function (e, i) {
            var wrps = _.where(orgs, { enterpriseID: e.enterpriseID });
            e.pos = [];
            for (var i = 0; i < wrps.length; i++) {
                var po = {};
                po.pId = wrps[i].pointerID;
                po.pNt = wrps[i].pointerName;
                e.pos.push(po);
            }
        })

        return eprs;
    }

    //初始化eprbox控件
    var initeprBox = function () {
        var eprs = initeprs();
        var eprselcnt = $('#epr_type').children('option').length;
        $('#epr_type').html();
        $('#epr_type').find('option').remove();
        $('#epr_type').empty();
        for (var i = 0; i < eprs.length; i++) {
            $('#epr_type').append($("<option value=\""
                + eprs[i].enterpriseID + "\">"
                + eprs[i].eprName + "</option>"));
        }
        var eprIds = [];
        for (var i = 0; i < eprs.length; i++) {
            eprIds.push(eprs[i].enterpriseID.toString());
        }
        var idxEpr = _.indexOf(eprIds, sessionStorage.enterpriseID);/*默认选中企业*/
        if (idxEpr === -1) {
            idxEpr = 0;
        }
        $('#epr_type option:eq(' + idxEpr + ')').attr('selected', 'selected');
        var eprId = $('#epr_type').val();
        getpointerDs(eprId, eprs);
    }

    function getpointerDs(eprId, eprs) {
        var wrps = _.where(eprs, { enterpriseID: parseFloat(eprId) });
        var ps = wrps[0].pos;
        var pslgt = ps.length;
        $('#p_type').html();
        $('#p_type').find('option').remove();
        $('#p_type').empty();
        for (var i = 0; i < pslgt; i++) {
            $('#p_type').append($("<option value=\"" + ps[i].pId + "\">" + ps[i].pNt + "</option>"));
        }
        var pIds = [];
        for (var i = 0; i < ps.length; i++) {
            pIds.push(ps[i].pId.toString());
        }
        var idxp = _.indexOf(pIds, sessionStorage.PointerID);
        if (idxp === -1) {
            idxp = 0;
        }
        $('#p_type option:eq(' + idxp + ')').attr('selected', 'selected');
    }

    //获取周
    var getWeek = function (enW) {
        if (enW === 'Monday') {
            return '星期一';
        } if (enW === 'Tuesday') {
            return '星期二';
        } if (enW === 'Wednesday') {
            return '星期三';
        } if (enW === 'Thursday') {
            return '星期四';
        } if (enW === 'Friday') {
            return '星期五';
        } if (enW === 'Saturday') {
            return '星期六';
        } if (enW === 'Sunday') {
            return '星期日';
        }
    }

    //初始化日期
    var initDt = function () {
        var nowDt = new Date();
        var year = nowDt.getFullYear();
        var month = parseInt(nowDt.getMonth()) + 1;
        var day = nowDt.getDate();
        var dtstr = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        var mt = moment(dtstr);
        var nowDt = mt.format('YYYY年MM月DD日');
        $('#loginDT').html(nowDt);//日期
        var enW = mt.format('dddd');
        var ews = getWeek(enW);
        $('#loginWk').html(ews);//星期
    }

    return {
        init: function () {

            //当前的楼宇
            var pointer = '<li style="color:#ccc;line-height:46px;margin-right:20px;font-size:14px;">' +
                '<span id="pNT"></span>' +
                '</li>';

            //楼宇切换
            var switchingPointer = '<li class="dropdown dropdown-extended dropdown-inbox" title="Switch">' +
                '<a id="eprswitchBtn" href="javascript:;" class="dropdown-toggle">' +
                '<i class="glyphicon glyphicon-list-alt"></i>' +
                '</a>' +
                '<ul class="dropdown-menu">' +
                '<li></li>' +
                '</ul>' +
                '</li>';

            var str =  pointer +  switchingPointer

            //插入dom中
            $('.navbar-nav').prepend(str);

            if (sessionStorage.enterpriseID === undefined) {

                //初始化默认界面
                var pos = JSON.parse(sessionStorage.pointers);
                var po = pos[0];

                sessionStorage.PointerID = po.pointerID;
                sessionStorage.PointerName = po.pointerName;
                sessionStorage.enterpriseID = po.enterpriseID;
                sessionStorage.eprName = po.eprName;

                $('#pNT').html(po.eprName + '-' + po.pointerName);//楼宇名称
            }
            else {

                $('#pNT').html(sessionStorage.eprName + '-' + sessionStorage.PointerName);//楼宇名称
            }

            ////初始化eprbox控件
            //initeprBox();

            //初始化日期
            initDt();

            //室外温湿度
            $.get(sessionStorage.apiUrlPrefix + "Global/GetTHW", { pId: sessionStorage.PointerID }, function (res) {
                if (res.code === "0") {
                    if (res.tsw === true) {
                        $('#span_temperature').show();
                        $('#temperature').html(res.ist + '℃');
                    }
                    else {
                        $('#span_temperature').hide();
                    }
                    if (res.hsw === true) {
                        $('#span_humidity').show();
                        $('#humidity').html(res.ish + '%');
                    }
                    else {
                        $('#span_humidity').hide();
                    }
                    //湿球温度$('#span_wetbuldtemperature').html('0.0');
                    if (res.wbw === true) {
                        $('#span_wetbuldtemperature').show();
                        $('#wetbuldtemperature').html(res.iswbw + '℃');
                    } else {
                        $('#span_wetbuldtemperature').hide();
                    }
                } else {
                    $('#span_temperature').hide();
                    $('#span_humidity').hide();
                    $('#span_wetbuldtemperature').hide();
                }
            });

            //楼宇实时数据
            var realDtUrl = sessionStorage.apiUrlPrefix + "Global/GetRealDt";
            $.ajax({
                url: realDtUrl,
                data: {
                    pId: sessionStorage.PointerID
                },
                async: false,
                success: function (res) {
                    if (res.code === "0") {
                        sessionStorage.sysDt = res.dt;
                    }
                }
            });

            //切换楼宇
            $('#goEprBtn').on('click', function () { //全局楼宇切换
                //var pId = $('#p_type').val();
                //var pNt = $('#p_type').children('option:selected').text();
                //var eprId = $('#epr_type').val();
                //var eprNT = $('#epr_type').children('option:selected').text();
                //sessionStorage.enterpriseID = eprId;
                //sessionStorage.eprName = eprNT;
                //sessionStorage.PointerID = pId;
                //sessionStorage.PointerName = pNt;

                onhidemenuEpr();

                $.get(realDtUrl, {
                    pId: sessionStorage.PointerID
                }, function (res) {

                    //$('#pNT').html(eprNT + pNt);//楼宇名称

                    sessionStorage.sysDt = res.dt;

                    //location.href = "../EPMA" + window.location.href.split('EPMA')[1];

                    location.href = window.location.href

                })
            })

            //打开选择楼宇框
            $('#eprswitchBtn').on('click', function () {
                var objCNT = $(this);
                var menuTop = $('.top-menu').height() - 6;//$('.page-header-inner').height();
                $('#eprBox').css({ left: objCNT.left + "px", top: menuTop + "px" }).slideDown("fast");
                //英文

                $('#eprBox').find('.control-label').eq(0).html('Unit');

                $('#eprBox').find('.control-label').eq(1).html('Building');

                $('#goEprBtn').html('Switch');

                $('.train-depot').html('Check');

                $('.btn-danger').html('Cancel');


                $("body").bind("mousedown", onbodydownEpr);
            })

            //切换企业
            $('#epr_type').change(function () {
                var eprId = $(this).val();
                var eprs = initeprs();
                getpointerDs(eprId, eprs);
            });

            //切换单位图标
            $('#miscBtn').click(function(){

                //创建
                var str = "<div id=\"eprBox1\" style=\"padding-bottom: 10px;" +
                    "            background: url('../../../assets/admin/layout/img/bgUnite.png')no-repeat;" +
                    "            background-size:300px; z-index: 10000; top: 42px; width: 300px;" +
                    "            height: auto; position: fixed; right: 107px; display: block;\">" +
                    "        <div style=\"padding:15px 15px;color:#FFFFFF;margin-top:0px;\">" +
                    "            <div class=\"row\">" +
                    "                <label class=\"col-md-4 col-sm-4 col-xs-4 control-label\" style=\"padding:0;text-indent:35px;margin-bottom:10px;line-height:34px;color:#333333\">单位切换</label>" +
                    "                <div class=\"col-md-8 col-sm-8 col-xs-8\" style=\"margin-bottom:10px;\">" +
                    "                    <select name=\"epr_unit\" id=\"epr_unit\" class=\"form-control input-small input-inline\" style=\"border:1px solid #4A93BE;border-radius: 5px !important;\">" +
                    "                        <option value=\"1\" selected=\"selected\">KW/KW</option>" +
                    "                        <option value=\"2\" selected=\"selected\">KW/RT</option>" +
                    "                    </select>" +
                    "                </div>" +
                    "            </div>" +
                    "            <div class=\"row\">" +
                    "                <label class=\"col-md-4 col-sm-4 col-xs-4 control-label\" style=\"margin-bottom:10px;line-height:34px;\"></label>" +
                    "                <div class=\"col-md-8 col-xs-8 col-xs-8\">" +
                    "                    <button id=\"goEprBtn1\" type=\"submit\" class=\"btn blue pull-left\">" +
                    "                        切换" +
                    "                    </button>" +
                    "                </div>" +
                    "            </div>" +
                    "        </div>" +
                    "    </div>";

                $('body').append(str);

                $('#eprBox1').hide().slideDown();

                //选中问题
                $('#epr_unit').val(sessionStorage.misc);

                $("body").bind("mousedown", onbodydownEpr1);

            })

            //单位切换按钮

            $('body').on('click','#goEprBtn1',function(){

                //首先将选中的值写进session中
                sessionStorage.misc = $('#epr_unit').val();

                //跳转回本页面
                location.href = window.location.href;

            })

            //退出
            $('.logout-page').html('<i class="icon-key"></i>'+'Exit')
        }
    }

}();