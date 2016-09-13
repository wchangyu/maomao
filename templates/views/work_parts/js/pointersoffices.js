/**
 * Created by went on 2016/9/5.
 */

/*
 <div class="content-main">
     <div class="main-left-middle">
        <div class="left-middle-header">对象选择</div>
        <div class="left-middle-tab left-middle-tab_aa_0">区域位置</div>
        <div class="left-middle    -tab left-middle-tab_aa_0">科室单位</div>
        <div class="tree-1 tree-3">
            <ul class="allPointer ztree" id="allPointer">
            </ul>
        </div>
        <div class="tree-1 tree-2">
            <input type="text"  id="searchkey" class="empty form-control" placeholder="查找...">
            <div class="tipes"></div>
            <ul class="allOffices ztree" id="allOffices">
            </ul>
        </div>
     </div>
 </div>
 */

/*
    js支持:jQuery,zTree文件之后，页面自身js文件之前
    使用方法
 _objectSel = new ObjectSelection();                //楼宇和分户选择器，可初始化任何一个,该选择器需要设置为全局变量，或者选中的项目时候还需要调用
 _objectSel.initPointers($("#allPointer"),true);    //初始化楼宇选择，参数(楼宇的ul,是否包含全部楼宇的项目)
 _objectSel.initPointers($("#allPointer"),true,true);    //初始化楼宇选择，第三个参数true复选框，false，单选
 _objectSel.initOffices($("#allOffices"));          //初始化分户选择
 _objectSel.getSelectedOffices()        //获取选择的分户，返回的是项目对应的JSON对象数组
 _objectSel.getSelectedPointers()       //获取选择的楼宇
 var objSearch = new ObjectSearch();                //模糊查找框
 //初始化模糊查找框，参数(输入框，提示框，ztree对应ul的id)
 objSearch.initOfficeSearch($("#key"),$("#tipes"),"allOffices");
 */
var ObjectSelection = function(){
    this._allPointers = [];      //数组下JSON格式的全部楼宇
    this._allOffices = [];        //数组下JSON格式this.的全部分户

    this._$ulPointers;
    this._$ulOffices;
    this._hasAllPointer;
    this.allPointerName = "全院";      //全部楼宇的名称，可能移到配置文件

    //从sessionStorage中获取楼宇
    this.getSessionStoragePointers = function(){
        var strPointers = sessionStorage.pointers;
        var tempAllPointers = [];
        if(strPointers){
            tempAllPointers = JSON.parse(strPointers);
        }
        if(this._hasAllPointer){     //是否使用全部楼宇
            var pointerAll = {
                pointerID: "0",
                pointerName: this.allPointerName,
                childPointers:tempAllPointers
            };
            this._allPointers.push(pointerAll);
        }else{
            this._allPointers = tempAllPointers;
        }
    };

    this.getSessionStorageOffices = function(){
        var strOffices = sessionStorage.offices;
        if(strOffices){
            this._allOffices = JSON.parse(strOffices);
        }
    }

    //获取选中的分户,返回分户数组，多个分户{分户id,分户名}
    this.getSelectedOffices = function(){
        var treeObj = $.fn.zTree.getZTreeObj(this._$ulOffices.attr('id'));
        if(!treeObj){
            return;
        }
        var nodes = treeObj.getCheckedNodes(true);
        var selectedOffices = [],curOffice = {};
        for(var i=0;i<nodes.length;i++){
            curOffice = {};
            curOffice.f_OfficeID = nodes[i].f_OfficeID;
            curOffice.f_OfficeName = nodes[i].f_OfficeName;
            selectedOffices.push(curOffice);
        }
        return selectedOffices;
    }
    //获取选中的楼宇，返回楼宇数组，多个楼宇{楼宇id,楼宇名}
    this.getSelectedPointers = function(){
        var treeObj = $.fn.zTree.getZTreeObj(this._$ulPointers.attr('id'));
        if(!treeObj){
            return;
        }
        var nodes = treeObj.getCheckedNodes(true);
        var selectedPointers = [],curPointer = {};
        for(var i = 0; i < nodes.length; i++){
            curPointer = {};
            curPointer.pointerID = nodes[i].pointerID;
            curPointer.pointerName = nodes[i].pointerName;
            selectedPointers.push(curPointer);
        }
        return selectedPointers;
    }

    //设置ztree Source
    //ul:JQ元素
    this.initPointers = function($ulPointers,hasAllPointer,multiSelectionMode){
        this._$ulPointers = $ulPointers;
        this._hasAllPointer = hasAllPointer;
        this.getSessionStoragePointers();
        var zTreePointer;
        var setting1 = {
            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "ps", "N": "ps" },
                radioType: 'all'
            },
            data: {
                key: {
                    name: "pointerName",
                    children:"childPointers",
                    open:true
                },
                simpleData: {
                    enable: false
                }
            },
            view:{
                showIcon: false
            },
            callback: {
                onClick: function(e,treeId,treeNode){zTreePointer.checkNode(treeNode,!treeNode.checked,true)}
            }
        };
        //楼宇
        if(multiSelectionMode){
           setting1.check.chkStyle = 'checkbox';
        }

        if(this._$ulPointers){
            zTreePointer  = $.fn.zTree.init(this._$ulPointers,setting1,this._allPointers);
            var nodes = zTreePointer.getNodes();
            zTreePointer.checkNode(nodes[0],true,true,false);
        }
    }

    //设置
    this.initOffices = function($ulOffices,multiSelectionMode){
        this._$ulOffices = $ulOffices;
        this.getSessionStorageOffices();
        var zTreeOffice;
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
            },
            callback: {
                onClick: function(e,treeId,treeNode){zTreeOffice.checkNode(treeNode,!treeNode.checked,true)}
            }
        };
        if(multiSelectionMode){
            setting.check.chkStyle = 'checkbox';
        }
        if(this._$ulOffices){
            zTreeOffice = $.fn.zTree.init(this._$ulOffices,setting,this._allOffices);
            var nodes = zTreeOffice.getNodes();
            zTreeOffice.checkNode(nodes[0],true,true,false);
        }
    }
}

var ObjectSearch = function(){
    this._$pointerSearchKey;
    this._$pointerTips;
    this._$officeSearchKey;
    this._$officeTips;
    this._pointerZTreeId;
    this._officeZTreeId;
    this.searchOfficeNode = function(e){
        var objSearch = e.data.that;
        var ztree = $.fn.zTree.getZTreeObj(objSearch._officeZTreeId);
        var keyName = 'f_OfficeName';
        objSearch.search(ztree,keyName,objSearch._$officeSearchKey,objSearch._$officeTips);
    }

    this.searchPointerNode = function(e){
        var objSearch = e.data.that;
        var ztree = $.fn.zTree.getZTreeObj(objSearch._pointerZTreeId);
        var keyName = 'pointerName';
        this.search(ztree,keyName,objSearch._$pointerSearchKey,objSearch._$pointerTips);
    }

    this.initPointerSearch = function($key,$tips,ztreeid){
        if($key){
            this._$pointerSearchKey = $key;
            this._$pointerTips = $tips;
            $key.on('input propertychanged',{that:this},this.searchPointerNode);
            this._pointerZTreeId = ztreeid;
        }
    }

    this.initOfficeSearch = function($key,$tips,ztreeid){
        if($key){
            this._$officeSearchKey = $key;
            this._$officeTips = $tips;
            $key.on("input propertychange",{that:this},this.searchOfficeNode);
            this._officeZTreeId = ztreeid;
        }
    }

    this._nodeList = [];     //存储搜索结果

    //搜索,ztree:zTree,keyName:显示的字段名称,$searchInput:查询的输入框,$tips:提示框
    this.search = function(ztree,keyName,$searchInput,$tips){
        if(!$searchInput) return;
        var value = $searchInput.val();     //获取搜索的文本
        if(value === ""){
            $tips.hide();
            //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。
            //获取 zTree 的全部节点数据
            //如果input是空的则显示全部；
            ztree.showNodes(ztree.transformToArray(ztree.getNodes()));
            return;
        }
        //getNodesByParamFuzzy:根据节点数据的属性搜索，获取条件模糊匹配的节点数据 JSON 对象集合
        this._nodeList = [];
        this._nodeList = ztree.getNodesByParamFuzzy(keyName,value);
        this._nodeList = ztree.transformToArray(this._nodeList);
        if(this._nodeList == ''){
            $tips.show();
            $tips.html("抱歉，没有想要的结果");
        }else{
            $tips.hide();
        }
        this.updateNode(ztree);
    }

    this.updateNode = function(ztree){
        var allNodes = ztree.transformToArray(ztree.getNodes());
        ztree.hideNodes(allNodes);   ////指定被隐藏的节点 JSON 数据集合
        for(var n in this._nodeList){
            this.findParent(ztree,this._nodeList[n]);
        }
        ztree.showNodes(this._nodeList);
    }

    //确定父子关系
    this.findParent = function(zTree,node){
        //展开 / 折叠 指定的节点
        zTree.expandNode(node,true,false,false);
        //pNode父节点
        var pNode = node.getParentNode();
        if(pNode != null){
            nodeList.push(pNode);
            this.findParent(zTree,pNode);
        }
    }
    this.filter = function(node) {
        //.isParent记录 treeNode 节点是否为父节点。
        //.isFirstNode 记录 treeNode 节点是否为同级节点中的第一个节点。
        return !node.isParent && node.isFirstNode;
    }
}