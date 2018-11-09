/**
 * Created by admin on 2017/11/15.
 */

$(function(){

    ////页面右上角选择单位
    //drawChangeUnitButton();

    //判断是否在新框架中
    if(sessionStorage.useNewIframe == 1){

        //调用a标签重绘的方法
        newFrameDrawLink();

        setInterval(function(){
            //调用a标签重绘的方法
            newFrameDrawLink();

        },1000)
    }

});

//新框架下a标签的跳转
$('.page-container').on('click','.newFrameJump',function(){

    //获取当前跳转地址
    var jumpUrl = $(this).attr('data-url');

    if($(this).attr('target') == '_blank'){

        sessionStorage.curUrl1 = jumpUrl;

        //获取新框架页面地址
        var useNewIframeUrl = '';

        if(sessionStorage.useNewIframeUrl){

            useNewIframeUrl = myFunc(sessionStorage.useNewIframeUrl,'../');

            useNewIframeUrl = myFunc(useNewIframeUrl,'./');
        }

        useNewIframeUrl = '../' + useNewIframeUrl;

        window.open(useNewIframeUrl);

    }else{

        sessionStorage.curUrl = jumpUrl;

        parent.$(window.parent.document).find('#the-top-logo').click();

        window.location.href = jumpUrl;

    }

});

    //时间选择
$('.time-options').click(function(){

    $('.time-options').removeClass('time-options-1');
    $(this).addClass('time-options-1');

    var sss = $('.time-options-1').index('.time-options');

    //获取到时间类型
    var dataType = $('.time-options-1').html();

    console.log(dataType);

    //调用时间变化函数
    changeShowTimes(dataType);

});

_urls = sessionStorage.getItem("apiUrlPrefix");

//定义报警中的设备类型
 deviceType = [
    {
        name:"冷热源",
        id:1
    },
    {
        name:"空调机组",
        id:2
    },
    {
        name:"送排风",
        id:3
    },
    {
        name:"给排水",
        id:4
    },
    {
        name:"动环",
        id:7
    },
    {
        name:"直梯",
        id:18
    },
    {
        name:"扶梯",
        id:19
    },
    {
        name:"站台照明",
        id:20
    },
    {
        name:"站台照明",
        id:20
    },
    {
        name:"自动检票",
        id:56
    },
    {
        name:"自动售票",
        id:57
    }
];

//定义报警中的报警级别
 alarmLevel = [
    {
        name:"普通",
        id:1
    },
    {
        name:"较急",
        id:2
    },
    {
        name:"紧急",
        id:3
    },
    {
        name:"特别紧急",
        id:4
    }
];

//点击上方能耗种类切换时
$('.energy-types').on('click','div',function(){

    //获取当前的能耗类型
    var index = $(this).index();

    var dom = $(this);

    //如果存在全部类型
    if($('.energy-types .all-energy-type').length > 0){

        index = index - 1;

        $('.energy-types .all-energy-type').removeClass('blueImg00');

        $('.energy-types div').removeClass('selectedEnergy');
    }

    //定义单位数组
    var unitArr = unitArr1;


    for(var i=0; i<$('.energy-types .specific-energy').length; i++){

        var className = 'blueImg' + i;
        //清除之前选中的类
        $('.energy-types .specific-energy').eq(i).removeClass(className);
    }

    //获取当前的能耗类型
    var ettype = $(this).attr('value');

    //获取当前是楼宇还是分户
    var flag = $(this).parent().attr('type');

    //从本地配置中获取当前的能耗信息集合
    var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));

    //需要获取分户的能耗类型
    if(flag == '02'){

        jsonText=JSON.parse(sessionStorage.getItem('officeEnergyType'));
    }

    //获取能耗信息的配置
    var alltypes = jsonText.alltypes;

    $(alltypes).each(function(i,o){

        var imgUrl;

        //如果当前是当前点击的能耗类型
        if(ettype == o.ettype){

            //获取当前的选中图片
             imgUrl = '../new-resource/img/' + o.selectImg;

        }else{

            //获取当前的未选中图片
             imgUrl = '../new-resource/img/' + o.unSelectImg;
        }

        $('.energy-types .specific-energy').eq(i).css({
                "background":"url("+imgUrl+") center 6px no-repeat",
                "backgroundSize": "22px 28px"
            });

    });


    //全部
    if(index == -1) {
        $(this).addClass('blueImg00');

    }

    $(this).addClass('selectedEnergy');

    //判断是否在支路下选择能耗种类
    if($('.onChecked').length > 0){

        //获取对应能耗类型下的支路
        if(branchesType == 2){

            GetAllBranches(2);

        }else{

            GetAllBranches();
        }

    }

    //改变右上角单位
    var html = '';

    if(ettype == 100){

        $(unitArr).each(function(i,o){
            html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'
        });

    }else{

        //获取当前单位
        var unit = getUnit(ettype);

        html += '<option value="'+ 0+'">'+ unit+'</option>'
    }

    $('#unit').html(html);

});


//初始化时间
changeShowTimes('日');

//页面右上角单位
 unitArr1 = [
    {
        "unitComment":"基础单位",
        "unitName":"kWh",
        "unitNum":"0"
    },
    {
        "unitComment":"转标准煤",
        "unitName":"Kgce",
        "unitNum":"1"
    },
    {
        "unitComment":"转kg碳",
        "unitName":"Kg碳",
        "unitNum":"2"
    }
    //{
    //    "unitComment":"转人民币",
    //    "unitName":"元",
    //    "unitNum":"3"
    //}
];
//水的单位
 unitArr2 = [
    {
        "unitComment":"基础单位",
        "unitName":"t",
        "unitNum":"0"
    }
    //{
    //    "unitComment":"转人民币",
    //    "unitName":"元",
    //    "unitNum":"3"
    //}
];

//能耗指标页面单位
 unitArr3 = [
    {
        "unitComment":"基础单位",
        "unitName":"kWh/㎡",
        "unitName1":"kWh/床",
        "unitNum":"0"
    },
    {
        "unitComment":"转标准煤",
        "unitName":"Kgce/㎡",
        "unitName1":"Kgce/床",
        "unitNum":"1"
    },
    {
        "unitComment":"转kg碳",
        "unitName":"Kg碳/㎡",
        "unitName1":"Kg碳/床",
        "unitNum":"2"
    },
    {
        "unitComment":"转人民币",
        "unitName":"元/㎡",
        "unitName1":"元/床",
        "unitNum":"3"
    }
];

//水的单位
 unitArr4 = [
    {
        "unitComment":"基础单位",
        "unitName":"m³/㎡",
        "unitName1":"m³/床",
        "unitNum":"0"
    },
    {
        "unitComment":"转人民币",
        "unitName":"元/平方米",
        "unitName1":"元/床",
        "unitNum":"3"
    }
];

//加载默认能耗类型单位
var html = '';
$(unitArr1).each(function(i,o){

    html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>';

});

$('#unit').html(html);

//定义选择时间 展示方式选框
var chooseTimeHtml = "<select class='chooseShowType'>" +
                        "<option value='0'>按天展示</option>"+
                        "<option value='1'>按小时展示</option>"+
                        "<option value='2'>按分钟展示</option>"+
                    "</select>";

//插入页面中
$('.start-time-choose').before(chooseTimeHtml);

$('.chooseShowType').on('change',function(){

    _selectTime("自定义");

});

//时间变化
function changeShowTimes(dataType){

    _selectTime(dataType);
}

$('#datetimepicker').on('changeDate',function(e){

    //获取到时间类型
    var dataType = $('.time-options-1').html();

    if(dataType == '周'){
        //获取当前时间
        var curDate = $(this).val();
        //获取结束时间
        var date = moment(curDate).add('6','days').format('YYYY-MM-DD');
        //给结束时间选框赋值
        $('.max').val(date);
    }

});

$('#datetimepicker1').on('changeDate',function(e){
    //获取到时间类型
    var dataType = $('.time-options-1').html();

    if(dataType == '周'){
        //获取当前时间
        var curDate = $(this).val();
        //获取开始时间
        var date = moment(curDate).subtract('6','days').format('YYYY-MM-DD');
        //给结束时间选框赋值
        $('.min').val(date);
    }
});

//支路是否是单选框
 branchesType = 1;

//获取支路 flag 2表示复选框 energy表示获取支路的能耗类型
function GetAllBranches(flag,energy){

    //获取能耗类型
    var energyType = $('.selectedEnergy').attr('value');

    if(!energyType){

        energyType = 100;
    }

    if($('.left-choose-energy-container').length>0){

        energyType = $('.left-choose-energy-container .time-radio:checked').attr('data-type');
    }

    if(energy){
        energyType = energy
    }


    //获取楼宇
    //确定楼宇id
    var pts = _pointerZtree.getSelectedPointers(),pointerID;

    if(pts.length > 0){
        pointerID = pts[0].pointerID;
        _pointerNames = pts[0].pointerName;
    }

    //存放要传的楼宇集合
    var postPointerID = [];

    $(pts).each(function(i,o){
        //if(i < 10){
            postPointerID.push(o.pointerID);
        //}

    });

    //从后台获取支路数据
    var prm = {
        'pointerIds':postPointerID,
        'serviceType':energyType,
        'isShowTree':1

    };
    //console.log(postPointerID);
    $.ajax({
        type:'post',
        url:_urls + 'BranchV2/GetAllBranches',
        data:prm,
        success:function(result){
           //console.log(result);
            getBranchZtree(result,flag);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        }
    })

};

//搜索框
var key;
key = $("#keyss");
key.bind("focus",focusKey)
    .bind("blur", blurKey)
    .bind("propertychange", searchNode)
    .bind("input", searchNode);

//构建支路树状图
//zTree树
var branchTreeObj;
function getBranchZtree(EnItdata,branchesType,fun,dom){

    var setting = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "all"
        },
        data: {
            key: {
                title: "title"
            },
            simpleData: {
                enable: true
            }
        },
        view: {
            showIcon: false
        },
        callback: {
            onClick:function (event,treeId,treeNode){

                branchTreeObj.checkNode(treeNode,!treeNode.checked,false)
            },
            beforeClick:function(treeId,treeNode){

                $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');

            },
            beforeCheck:function(treeId,treeNode){

                branchTreeObj.checkNode(treeNode,!treeNode.checked,false);

                $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');

                $('#' + treeId).find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                return false;
            },
            onCheck:function(event,treeId,treeNode){



            }
        }
    };
    //判断是单选框还是复选框
    if(branchesType == 2){

        setting.check.chkStyle = 'checkbox';

    }
    var zNodes;

    if(!fun){
         zNodes = getZNodes(EnItdata);
    }else{
        zNodes = fun(EnItdata);
    }

    //console.log(zNodes);

    //console.log(zNodes);
    if(dom){
        branchTreeObj = $.fn.zTree.init(dom, setting, zNodes);
    }else{
        branchTreeObj = $.fn.zTree.init($("#allBranch"), setting, zNodes);
    }

};

//获取不带楼宇的区域位置zTree树的数据
function getPointerTree(){

    var strPointers = sessionStorage.pointers;
    var tempAllPointers = [];

    if(strPointers){
        tempAllPointers = JSON.parse(strPointers);
    };

    var treeArr = getCompactArr(tempAllPointers,true);

    $(treeArr).each(function(i,o){

        if(o.nodeType == 2){
            treeArr.remove(o);
        };

        if(i === 0){
            o.checked=true;
        };

        o.title = o.name;
    });

    return treeArr;
};

//获取只能选择楼宇的区域位置zTree树的数据
function getPointerTree1(){

    var strPointers = sessionStorage.pointers;
    var tempAllPointers = [];

    if(strPointers){
        tempAllPointers = JSON.parse(strPointers);
    };

    var treeArr = getCompactArr(tempAllPointers,true);

    var firstNum = -1;

    //console.log(treeArr);

    $(treeArr).each(function(i,o){

        if(o.nodeType != 2){

            o.nocheck=true;

        };

        if(o.nodeType == 2){

            firstNum ++;
        }

        if(firstNum == 0 && o.nodeType == 2){

            o.checked = true;
        }

        o.title = o.name;
    });

    return treeArr;
};

//获取分项zTree树的数据
function getZNodes(EnItdata){

    var zNodes = new Array();
    var aaa = [];

    $(EnItdata).each(function(i,o){

        //获取楼宇ID
        var pointerID = o.pointerID;

        var ifOpen = false;
        if(i == 0){
            ifOpen = true;
        }
        zNodes.push({ id: o.pointerID, pId:-1, name:o.pointerName,title: o.pointerName,open:ifOpen,checked:false,nocheck :true});
        //二级结构
        $(o.branchModelV2s).each(function(i,o){
            var parentid = o.f_ParentId;
            //判断是否是一级支路
            if(o.f_ParentId == 0){
                parentid = pointerID
            }
            zNodes.push({ id: o.f_ServiceId,pointerID: pointerID, pId: parentid, title: o.f_ServiceName,name:o.f_ServiceName,open:false,checked:false, unit: o.dataUnit, f_AddSamAvg: o.f_AddSamAvg})

        })
    });
    return zNodes;

}

//搜索
var lastValue='',nodeList=[],fontCss={};

function searchNode(e,node) {
    var zTree = $.fn.zTree.getZTreeObj("allBranch");
    //去掉input中的空格（首尾）
    var value = $.trim($("#keyss").val().trim());
    keyType = "name";
    if (lastValue === value)
        return;
    lastValue = value;
    if (value === "") {
        $('.tipes').hide();
        //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。
        //获取 zTree 的全部节点数据
        //如果input是空的则显示全部；
        zTree.showNodes(zTree.transformToArray(zTree.getNodes())) ;
        return;
    }
    //getNodesByParamFuzzy:根据节点数据的属性搜索，获取条件模糊匹配
    // 的节点数据 JSON 对象集合
    nodeList = zTree.getNodesByParamFuzzy(keyType,value);
    nodeList = zTree.transformToArray(nodeList);
    if(nodeList==''){
        $('.tipes').show();
        $('.tipes').html('抱歉，没有您想要的结果')
    }else{
        $('.tipes').hide();
    }
    updateNodes(true);

}

//选中之后更新节点
function updateNodes(highlight) {
    var zTree = $.fn.zTree.getZTreeObj("allBranch");
    var allNode = zTree.transformToArray(zTree.getNodes());
    //指定被隐藏的节点 JSON 数据集合
    zTree.hideNodes(allNode);
    //遍历nodeList第n个nodeList
    for(var n in nodeList){
        findParent(zTree,nodeList[n]);
    }
    zTree.showNodes(nodeList);
}

//确定父子关系
function findParent(zTree,node){
    //展开 / 折叠 指定的节点
    zTree.expandNode(node,true,false,false);
    //pNode父节点
    if(typeof node == 'function'){
        return false;
    }
    //pNode父节点
    var pNode = node.getParentNode();
    if(pNode != null){
        nodeList.push(pNode);
        findParent(zTree,pNode);
    }
}
function filter(node) {

    return !node.isParent && node.isFirstNode;

}

//搜索框功能
function focusKey(e) {
    if ($('#key').hasClass("empty")) {
        $('#key').removeClass("empty");
    }
}
function blurKey(e) {
    //内容置为空，并且加empty类
    if ($('#key').get(0).value === "") {
        $('#key').addClass("empty");
    }
}

//展示日期类型 用户选择日期类型
function getShowDateType(){

    //获取页面日期类型
    var dateType = $('.time-options-1').html();

    //定义展示日期类型
    var showDateType = '';
    //定义用于选择日期类型
    var selectDateType = '';

    if(dateType == '日'){

        showDateType = "Hour";
        selectDateType = "Day"

    }else if(dateType == '周'){

        showDateType = "Day";
        selectDateType = "Week"

    }else if(dateType == '月'){

        showDateType = "Day";
        selectDateType = "Month"

    }else if(dateType == '年'){

        showDateType = "Month";
        selectDateType = "Year"
    }else if(dateType == '自定义'){

        showDateType = "Custom";
        selectDateType = "Custom"
    }

    return [showDateType,selectDateType]
};


//展示日期类型 用户选择日期类型
function getShowDateType1(){
    //获取页面日期类型
    var dateType = $('.top-cut1 .onClicks').html();

    //定义展示日期类型
    var showDateType = '';
    //定义用于选择日期类型
    var selectDateType = '';

    if(dateType == '日'){

        showDateType = "Hour";
        selectDateType = "Day"

    }else if(dateType == '周'){

        showDateType = "Day";
        selectDateType = "Week"

    }else if(dateType == '月'){

        showDateType = "Day";
        selectDateType = "Month"

    }else if(dateType == '年'){

        showDateType = "Month";
        selectDateType = "Year"
    }else if(dateType == '自定义'){

        showDateType = "Custom";
        selectDateType = "Custom"
    }

    return [showDateType,selectDateType]
};

//获取开始结束时间
function getPostTime(){

    //获取页面日期类型
    var dateType = $('.time-options-1').html();

    //定义开始时间
    var startTime = '';

    if($('.min').length > 0){

        startTime = $('.min').val();
    }

    //定义结束时间
    var endTime = '';

    if(dateType == '日'){

        startTime = startTime;
        endTime = moment(startTime).add('1','days').format('YYYY/MM/DD');

    }else if(dateType == '周'){

        startTime = startTime;

        endTime = moment(startTime).add('7','days').format('YYYY/MM/DD');

    }else if(dateType == '月'){

        startTime = startTime + '/01';
        endTime = moment(startTime).add('1','months').startOf('month').format('YYYY/MM/DD');
    }else if(dateType == '年'){

        endTime = (parseInt(startTime) + 1) + '/01/01';
        startTime = startTime + '/01/01';

    }else if(dateType == '自定义'){

        startTime = startTime;
        endTime = moment($('.max').val()).add('1','days').format('YYYY/MM/DD');
    }

    return [startTime,endTime]
};

//获取开始结束时间(本日，本月，本年)
function getPostTime1(){

    //获取页面日期类型
    var dateType = $('.time-options-1').html();

    //定义开始时间
    var startTime = '';

    //定义结束时间
    var endTime = '';

    if(dateType == '日'){

        startTime = moment().format('YYYY-MM-DD');
        endTime = moment(startTime).add('1','days').format('YYYY-MM-DD');

    }else if(dateType == '月'){

        startTime = moment().startOf('month').format('YYYY-MM-DD');
        endTime = moment().add('1','days').endOf('month').format('YYYY-MM-DD');
    }else if(dateType == '年'){

        startTime = moment().startOf('year').format('YYYY-MM-DD');
        endTime = moment().add('1','days').endOf('year').format('YYYY-MM-DD');

    }

    return [startTime,endTime]
};

function getPostTime11(){
    //获取页面日期类型
    var dateType = $('.top-cut1 .onClicks').html();

    //定义开始时间
    var startTime = '';

    //定义结束时间
    var endTime = '';

    if(dateType == '日'){

        startTime = moment().format('YYYY-MM-DD');
        endTime = moment(startTime).add('1','days').format('YYYY-MM-DD');

    }else if(dateType == '月'){

        startTime = moment().startOf('month').format('YYYY-MM-DD');
        endTime = moment().endOf('month').add('1','days').format('YYYY-MM-DD');
    }else if(dateType == '年'){

        startTime = moment().startOf('year').format('YYYY-MM-DD');
        endTime = moment().endOf('year').add('1','days').format('YYYY-MM-DD');

    }

    return [startTime,endTime]
};

//深拷贝的方法
function deepCopy(src,obj){

    obj = obj || (Array.isArray(src) ? [] : {});
    for(var i in src){
        if(src.hasOwnProperty(i)){
            if(typeof src[i] == 'object' && src[i]!=null){
                obj[i] = Array.isArray(src[i]) ? [] : {};
                deepCopy(src[i],obj[i]);
            }else{
                obj[i] = src[i];
            }
        }
    }
};

//关闭提示弹窗后给input获得焦点
function getFocus1(dom){

    $('#myModal2').one('click','.btn-default',function(){
        dom.focus();
    });
}

//检验是否必填项全部填写
function checkedNull1(dom){

    var checkNum = $(dom).find('.colorTip').length;

    for(var i=0; i<checkNum; i++){

        var val = $(dom).find('.colorTip').eq(i).next().find('input').val();

        var name = $(dom).find('.colorTip').eq(i).html().split('*')[0];

        if(val == ''){
            //myAlter('请输入'+ name + '!');
            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请输入'+ name + '!', '');
            getFocus1($(dom).find('.colorTip').eq(i).next().find('input'));
            return false;
        }

    }
    return true;
}

//比较开始结束日期是否合理
function checkedDate(dom){

    var txt1 = $(dom).find('.startDate').val();
    var txt2 = $(dom).find('.endDate').val();

    var nowDate = getNewDate();

    //if(CompareDate(txt2,nowDate) == true){
    //        myAlter('结束日期不能大于当前日期');
    //        getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));
    //
    //        return false;
    //};


    if(CompareDate(txt2,txt1) == false){
        //myAlter('结束日期必须大于开始日期');
        _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'结束日期必须大于开始日期', '');
        getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));

        return false;
    };

    return true;
};

//判断输入内容是否为数字
function checkedNum(dom){
    var num = $(dom).find('.type-number').length;
    for(var i=0; i<num; i++){
        if($(dom).find('.type-number').eq(i).val() != ''){
            var txt = $(dom).find('.type-number').eq(i).val() / 1;

            if(isNaN(txt)){
                var txt1 = $(dom).find('.type-number').eq(i).parent().prev().html().split('*')[0];
                //console.log(txt1);

                //myAlter(txt1 + '必须为数字');
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,txt1 + '必须为数字', '');
                getFocus1($(dom).find('.type-number').eq(i));
                return false;
            }
        }

    }
    return true;
};

//获取当前年月日
function getNewDate(){

    var mydate = new Date();
    var str = "" + mydate.getFullYear() + "-";
    str += (mydate.getMonth()+1) + "-";
    str += mydate.getDate() + "";
    return str;
};

//判断输入是否为电话号码
function checkedPhone(dom){

    var num = $(dom).find('.type-phone').length;

    for(var i=0; i<num; i++){
        var txt = $(dom).find('.type-phone').eq(i).val();
        if(txt != ''){
            if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(txt))){

                //myAlter('手机号输入错误');
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'手机号输入错误', '');
                getFocus1($(dom).find('.type-phone').eq(i));
                return false;

            }
        }
    }


    return true;
};

//比较日期大小
function CompareDate(d1,d2) {
    return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
};

//根据能耗分项ID获取能耗名称
function _getEcName(etid){

    var jsonText=JSON.parse(sessionStorage.getItem('allEnergyType'));

    if(jsonText){
        for(var i=0;i<jsonText.alltypes.length;i++){
           if(etid == jsonText.alltypes[i].etid){

               return jsonText.alltypes[i].etname;
           }
        }

    }
};

//获取当前的系统类型
function getSystemType(num){

    if(num == 1){

        return "冷热源"
    }else  if(num == 2){

        return "空调机组"
    }else  if(num == 3){

        return "送排风"
    }else  if(num == 4){

        return "给排水"
    }else  if(num == 5){

        return "电梯"
    }else  if(num == 6){

        return "照明"
    }else  if(num == 7){

        return "动环"
    }else  if(num == 8){

        return "计量设备"
    }else  if(num == 18){

        return "直梯"
    }else  if(num == 19){

        return "扶梯"
    }else  if(num == 20){

        return "站台照明"
    }else  if(num == 19){

        return "站房照明"
    }
};

//从本地存储中获取楼宇ID列表
function getPointersId(){

    //存放楼宇ID列表
    var pointerIdArr = [];

    var pointerArr = $.parseJSON(sessionStorage.getItem('pointers'));


    $(pointerArr).each(function(i,o){

        pointerIdArr.push(o.pointerID);
    });

    return pointerIdArr;
};

//新框架中重绘a标签的方法
function newFrameDrawLink(){

    var length = $('.page-container a').length;

    for(var i=0; i<length; i++){

        //获取当前dom元素
        var curDom = $('.page-container a').eq(i);

        //获取当前跳转地址
        var jumpUrl = curDom.attr('href');


        if(jumpUrl && jumpUrl != 'javascript:;' && jumpUrl != '#'){

            //给a标签添加class名
            curDom.addClass('newFrameJump');

            curDom.attr('data-url',jumpUrl);

            curDom.attr('href','javascript:;');

        };
    };
}







