$(function(){
    //搜索功能
    var key;
    key = $("#key");
    key.bind("focus",focusKey)
        .bind("blur", blurKey)
        .bind("propertychange", searchNode)
        .bind("input", searchNode);
    //全院
    $('.selectedRadio').click(function(){
        if($('.allPointerOne .selectedRadioHover').length == 0){
            $(this).addClass('selectedRadioHover');
            $('.allPointer .chk').removeClass('radio_true_full');
            $('.allPointer .chk').addClass('radio_false_full');
        }else if($('.allPointerOne .selectedRadioHover').length != 0){
            $(this).removeClass('selectedRadioHover');
        }
    })
    $('.allPointer .chk').click(function(){
        $('.selectedRadio').removeClass('selectedRadioHover');
    })
})
//科室单位
var setting = {
    check: {
        enable: true,
        chkStyle: "radio",
        chkboxType: { "Y": "ps", "N": "ps" }
    },
    data: {
        key: {
            name: "f_OfficeName"
        },
        simpleData: {
            enable: true
        }
    },
    view:{
        showIcon: true
    }
};
var jsonText=JSON.parse(sessionStorage.getItem('offices'));
//zTree搜索框
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
var lastValue='',nodeList=[],fontCss={};
function searchNode(e) {
    var zTree = $.fn.zTree.getZTreeObj("allOffices");
    //去掉input中的空格（首尾）
    var value = $.trim($('#key').get(0).value);
    keyType = "f_OfficeName";
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
    //getNodesByParamFuzzy:根据节点数据的属性搜索，获取条件模糊匹配的节点数据 JSON 对象集合
    nodeList = zTree.getNodesByParamFuzzy(keyType, value);
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
    var zTree = $.fn.zTree.getZTreeObj("allOffices");
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
    var pNode = node.getParentNode();
    if(pNode != null){
        nodeList.push(pNode);
        findParent(zTree,pNode);
    }
}
function filter(node) {
    //.isParent记录 treeNode 节点是否为父节点。
    //.isFirstNode 记录 treeNode 节点是否为同级节点中的第一个节点。
    return !node.isParent && node.isFirstNode;
}
function Getfid(e,treeId,treeNode){
    var treeObj=$.fn.zTree.getZTreeObj("allOffices"),
        nodes=treeObj.getCheckedNodes(true),
        v="";
    var c_id = new Array();
    for(var i=0;i<nodes.length;i++){
        v+=nodes[i].name + ",";
        c_id.push(nodes[i].value);
        //alert(nodes[i].value); //获取选中节点的值
    }
    return c_id;
}
//获得勾选节点
//存放选中的id
var _ajaxGetOffice;
var _ajaxGetOfficeName;
function selectOfficeId(){
    var treeObject=$.fn.zTree.getZTreeObj('allOffices');
    var nodes= treeObject.getCheckedNodes();
    //console.log(nodes)
    for(var i=0;i<nodes.length;i++){
        _ajaxGetOffice=nodes[i].f_OfficeID;
        _ajaxGetOfficeName=nodes[i].f_OfficeName;
    }
    console.log(_ajaxGetOfficeName);
    return;
}
var _ajaxGetPointer;
var _ajaxGetPointerName;
function  selectPointerId(){
    var treeObject=$.fn.zTree.getZTreeObj('allPointer');
    var nodes= treeObject.getCheckedNodes();
    //console.log(nodes);
    for(var i=0;i<nodes.length;i++){
        _ajaxGetPointer=nodes[i].pointerID;
        _ajaxGetPointerName=nodes[i].pointerName
        //console.log(_ajaxGetPointer)
    }
    if($('.allPointerOne .selectedRadioHover').length != 0){
        _ajaxGetPointer='0';
        _ajaxGetPointerName='全院'
    }
    //console.log(_ajaxGetOfficeName)
    return;
}
//楼宇
var setting1 = {
    check: {
        enable: true,
        chkStyle: "radio",
        chkboxType: { "Y": "ps", "N": "ps" }
    },
    data: {
        key: {
            name: "pointerName"
        },
        simpleData: {
            enable: true
        }
    },
    view:{
        showIcon: true
    }
};
var jsonText1=JSON.parse(sessionStorage.getItem('pointers'));
