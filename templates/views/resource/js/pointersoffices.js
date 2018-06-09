/**
 * Created by went on 2016/9/5.
 */

/*
 <div class="content-main">
     <div class="main-left-middle">
        <div class="left-middle-header">对象选择</div>
        <div class="left-middle-tab left-middle-tab_aa_0">区域位置</div>
        <div class="left-middle    -tab left-middle-tab_aa_0">用能单位</div>
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
 _objectSel.initPointers($("#allPointer"),true);    //初始化楼宇选择，参数(楼宇的ul,是否包含全部楼宇的项目,(true复选框，false单选框))
 _objectSel.initOffices($("#allOffices")，true);          //初始化分户选择，参数(分户的ul,(true复选框，false单选))
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

    this.getSelectType;           //获取当前是单选框还是复选框
    this.getShowRadio;           //获取当前是否显示一级，二级选框
    this.getOptFirst;            //获取当前复选框是否需要选中第一个子项
    //存放已配置的全部楼宇名称
    var getPointerName = '';

    //从session中获取楼宇名称
    getPointerName = sessionStorage.getItem('allPointerName');


    if(getPointerName != ''){
        this.allPointerName = getPointerName;
    }else{
        this.allPointerName = "全院";      //全部楼宇的名称，可能移到配置文件
    }


    //从sessionStorage中获取楼宇
    this.getSessionStoragePointers = function(){
        var strPointers = sessionStorage.pointers;
        var tempAllPointers = [];

        if(strPointers){
            tempAllPointers = JSON.parse(strPointers);
        }

        //tempAllPointers = tempAllPointers.splice(0,10);
        if(this._hasAllPointer){     //是否使用全部楼宇
            var pointerAll = {
                pointerID: "0",
                pointerName: this.allPointerName,
                childPointers:tempAllPointers
            };
            //this._allPointers.push(pointerAll);
            if(this.getShowRadio){
                this._allPointers = getCompactArr1(tempAllPointers,false,true);
            }else{
                this._allPointers = getCompactArr(tempAllPointers,true);
            }


        }else{
            //this._allPointers = tempAllPointers;
            if(this.getShowRadio){
                this._allPointers = getCompactArr1(tempAllPointers,false,true);
            }else{
                this._allPointers = getCompactArr(tempAllPointers,false);
            }
        }

    };


    this.getSessionStorageOffices = function(){
        var strOffices = sessionStorage.offices;
        var tempAllOffice = [];

        if(strOffices){
            //this._allOffices = JSON.parse(strOffices);
            tempAllOffice = JSON.parse(strOffices);
            for(var i=0;i<tempAllOffice.length;i++){
                var obj = {};
                obj.f_OfficeID = tempAllOffice[i].f_OfficeID;
                obj.f_ParentID = tempAllOffice[i].f_ParentID;
                obj.id = tempAllOffice[i].f_OfficeID;
                obj.pId = tempAllOffice[i].f_ParentID;
                obj.f_OfficeName = tempAllOffice[i].f_OfficeName;
                if(i == 0){
                   obj.open = true;
                }
                this._allOffices.push(obj);
            }

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
        var selectType = this.getSelectType;
        var selectedPointers = getPostPointerID(treeObj,selectType);
        //for(var i = 0; i < nodes.length; i++){
        //    curPointer = {};
        //    curPointer.pointerID = nodes[i].pointerID;
        //    curPointer.pointerName = nodes[i].pointerName;
        //    selectedPointers.push(curPointer);
        //}
        return selectedPointers;
    }

    //设置ztree Source
    //ul:JQ元素
    this.initPointers = function($ulPointers,hasAllPointer,multiSelectionMode,getShowRadio,getOptFirst){
        this._$ulPointers = $ulPointers;
        this._hasAllPointer = hasAllPointer;
        this.getSelectType = multiSelectionMode;
        this.getShowRadio = getShowRadio;
        this.getOptFirst = getOptFirst;
        this.getSessionStoragePointers();
        var zTreePointer;
        var setting1 = {
            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "s", "N": "ps" },
                radioType : "all"
            },
            data: {
                key:{
                    name:'name'
                },
                simpleData: {
                    enable: true
                }
            },
            view:{
                showIcon:false
            },
            callback: {
                onClick: function(e,treeId,treeNode){

                    //点击zTree文字时可勾选 不加只能点击前面圆圈才能勾选
                    zTreePointer.checkNode(treeNode,!treeNode.checked,true);

                    if(treeId == 'allSelectPointer'){

                        var nodes = zTreePointer.getCheckedNodes(true)[0];

                        //勾选楼宇
                        if(nodes.nodeType == 2){

                            $('#eprBox .add-input-select1 span').html(nodes.name);

                            $('#eprBox .add-input-select1 span').attr('data-id',nodes.id);

                        }else{

                            $('#eprBox .add-input-select1 span').html('全部');

                            $('#eprBox .add-input-select1 span').attr('data-id',nodes.id);
                        }

                        $('#eprBox .add-select-pointer').css({
                            display:'none'
                        }) ;

                    }

                    //如果当前页面存在支路
                    if($('#allBranch').length>0 && treeId != 'allSelectPointer' && treeId != 'allBranch'){
                        //获取当前楼宇下的支路
                        GetAllBranches();
                    }

                    if(getShowRadio){

                        //获取楼宇ID
                        var id =  zTreePointer.getCheckedNodes(true)[0].id;

                        sessionStorage.curPointerId = id;

                        var pointerName =  zTreePointer.getCheckedNodes(true)[0].name;
                        $('#onOff1').html(pointerName);

                        $('#add-point-byBEE').hide('fast');


                        if(typeof userMonitor != 'undefined'){
                            userMonitor.getProcsByPointerId();
                        }

                        if(typeof alarmHistory != 'undefined'){

                            alarmHistory()
                        }
                        //刷新页面
                        window.location.reload();

                    }
                },
                beforeClick:function(treeId,treeNode){

                    $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');


                },
                onCheck:function(e,treeId,treeNode){
                        $(treeNode).css("background", "blue");

                    if(treeId == 'allSelectPointer'){

                        var nodes = zTreePointer.getCheckedNodes(true)[0];

                        //勾选楼宇
                        if(nodes.nodeType == 2){


                            $('#eprBox .add-input-select1 span').html(nodes.name);

                            $('#eprBox .add-input-select1 span').attr('data-id',nodes.id)
                        }

                        $('#eprBox .add-select-pointer').css({
                            display:'none'
                        }) ;

                        $('#eprBox .add-select-pointer').css({
                            display:'none'
                        }) ;

                    }else{

                        $('#eprBox .add-input-select1 span').html('全部');

                        $('#eprBox .add-input-select1 span').attr('data-id',nodes.id);
                    }

                        //如果当前页面存在支路
                        if($('#allBranch').length>0 && treeId != 'allSelectPointer'){

                            //获取当前楼宇下的支路
                            GetAllBranches();
                        }

                        $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');

                         $('#' + treeId).find('.radio_true_full_focus').next('a').addClass('curSelectedNode');


                    if(getShowRadio){
                            //获取楼宇ID

                            var id =  zTreePointer.getCheckedNodes(true)[0].id;

                            sessionStorage.curPointerId = id;

                            var pointerName =  zTreePointer.getCheckedNodes(true)[0].name;
                            $('#onOff1').html(pointerName);

                            $('#add-point-byBEE').hide('fast');

                            if(typeof userMonitor != 'undefined'){
                                userMonitor.getProcsByPointerId();
                            }

                            if(typeof alarmHistory != 'undefined'){

                                alarmHistory()
                            }

                            window.location.reload();

                        };

                },
                asyncSuccess:function(event, treeId, treeNode, msg){

                }

            }
        };
        //楼宇
        if(multiSelectionMode){
           setting1.check.chkStyle = 'checkbox';
        }

        if(this._$ulPointers){

            zTreePointer  = $.fn.zTree.init(this._$ulPointers,setting1,this._allPointers);
            var nodes = zTreePointer.getNodes();
            console.log(nodes);
            //console.log(nodes);
            var dataArr = nodes[0].children;
            //console.log(nodes);
           // console.log(dataArr);

            if(sessionStorage.PointerID && sessionStorage.showChooseUnit != 0){
                //console.log($ulPointers);

                var pId = sessionStorage.PointerID;

                var thisNum = 0;

                var thatNum = 0;

                //获取当前勾选的是第几个楼宇
                $(dataArr).each(function(i,o){

                    var childArr = o.children;

                    $(childArr).each(function(k,j){

                        var id = j.id;

                        if(id == pId){

                            thisNum = i;

                            thatNum = k;

                            return false
                        }

                    });

                });

                zTreePointer.checkNode(nodes[0], false, false);  //父节点不被选中
                zTreePointer.checkNode(nodes[0].children[thisNum].children[thatNum], true, true);

            }else{

                if(getShowRadio){

                }else{
                    if(getOptFirst){

                        zTreePointer.checkNode(nodes[0].children[0].children[0],true,false,false);
                        zTreePointer.expandNode(nodes[0],true,false,true);
                    }else{
                        zTreePointer.checkNode(nodes[0],true,false,false);
                        zTreePointer.expandNode(nodes[0],true,false,true);
                    }

                }


            }


            if(typeof userMonitor != 'undefined'){

                userMonitor.getProcsByPointerId();
            }
        }
    };

    //设置
    this.initOffices = function($ulOffices,multiSelectionMode){
        this._$ulOffices = $ulOffices;
        this.getSessionStorageOffices();
        if(!this._allOffices || this._allOffices.length ==0 ){
            return;
        }
        var zTreeOffice;
        //用能单位
        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "ps", "N": "ps" },
                radioType : "all"
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
                showIcon: false,
                fontCss : {'line-height':'30px'}
            },
            callback: {

                onClick: function(e,treeId,treeNode){zTreeOffice.checkNode(treeNode,!treeNode.checked,true)},
                beforeClick:function(treeId,treeNode){

                    $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');

                },
                onCheck:function(e,treeId,treeNode){

                    $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');

                    $('#' + treeId).find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                }
            }
        };
        if(multiSelectionMode){
            setting.check.chkStyle = 'checkbox';
        }
        if(this._$ulOffices){
            zTreeOffice = $.fn.zTree.init(this._$ulOffices,setting,this._allOffices);
            var nodes = zTreeOffice.getNodes();

            zTreeOffice.checkNode(nodes[0],true,false,false);
            zTreeOffice.expandNode(nodes[0],true,false,true);
        }
    }
}

var ObjectSearch = function(){
    this._$pointerSearchKey;   //输入的关键字
    this._$pointerTips;
    this._$officeSearchKey;
    this._$officeTips;
    this._officeZTreeId;
    this.searchOfficeNode = function(e){    //搜索科室节点
        var objSearch = e.data.that;      //e是下的键的对象包含的信息
        //console.log(e);
        var ztree = $.fn.zTree.getZTreeObj(objSearch._officeZTreeId);    //"allOffices"得到树的id
        var keyName = 'f_OfficeName';  //树节点的名字
        objSearch.search(ztree,keyName,objSearch._$officeSearchKey,objSearch._$officeTips);  //objSearch._$officeSearchKey搜索框   objSearch._$officeTips提示框
    }

    this.searchPointerNode = function(e){
        var objSearch = e.data.that;
        var ztree = $.fn.zTree.getZTreeObj(objSearch._pointerZTreeId);
        var keyName = 'name';
        objSearch.search(ztree,keyName,objSearch._$pointerSearchKey,objSearch._$pointerTips);
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
        if(!$searchInput) return;       //如果没有搜索框跳出
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
        if(typeof node == 'function'){
            return false;
        }
        var pNode = node.getParentNode();
        if(pNode != null){
            this._nodeList.push(pNode);
            this.findParent(zTree,pNode);
        }
    }
    this.filter = function(node) {
        //.isParent记录 treeNode 节点是否为父节点。
        //.isFirstNode 记录 treeNode 节点是否为同级节点中的第一个节点。
        return !node.isParent && node.isFirstNode;
    }
}

//获取正确的Ztree树结构数据
function getCompactArr(tempAllPointers,isCheckAll,flag){

    var _districArr = unique(tempAllPointers,'districtID');
    var _enterpriseArr = unique(tempAllPointers,'enterpriseID');
    var _pointerArr = unique(tempAllPointers,'pointerID');

    var arr = [];
    for(var i=0;i<_districArr.length;i++){

        var obj = {};
        obj.districtID = _districArr[i].districtID;
        obj.districtName = _districArr[i].districtName;
        obj.parent = '';
        obj.children = [];

        for(var j=0;j<_enterpriseArr.length;j++){
            var obj1 = {};
            obj1.enterpriseID = _enterpriseArr[j].enterpriseID;
            obj1.eprName = _enterpriseArr[j].eprName;
            obj1.parent = obj.districtID;
            obj1.children = [];

            if( _enterpriseArr[j].districtID == _districArr[i].districtID){

                obj.children.push(obj1);
            }
            for(var z=0;z<_pointerArr.length;z++){

                if(_pointerArr[z].enterpriseID == _enterpriseArr[j].enterpriseID){
                    var obj11 = {};
                    obj11.pointerID = _pointerArr[z].pointerID;
                    obj11.pointerName = _pointerArr[z].pointerName;
                    obj11.parent = obj1.enterpriseID;

                    obj1.children.push(obj11);
                }

            }
        }
        arr.push(obj);
    }
    var ztreeArr = [];
    for(var i=0;i<arr.length;i++){
        var obj = {};
        obj.name = arr[i].districtName;
        obj.id = arr[i].districtID;
        obj.pId = arr[i].parent;
        //当前类型：0 区域 1 企业 2 楼宇
        obj.nodeType = 0;

        //
        //if(isCheckAll == false){
        //
        //    obj.checked=false;
        //}
        if(flag){
            obj.nocheck=true;
        }
        ztreeArr.push(obj);
        for(var j=0;j<arr[i].children.length;j++){
            var obj1 = {};
            obj1.name = arr[i].children[j].eprName;
            obj1.id = arr[i].children[j].enterpriseID;
            obj1.pId = arr[i].children[j].parent;
            //当前类型：0 区域 1 企业 2 楼宇
            obj1.nodeType = 1;
            //if(isCheckAll == false){
            //
            //    obj1.nocheck=true;
            //}
            //判断是否打开当前页的Pointer列表
            if(flag){
                obj1.nocheck=true;
                if(sessionStorage.curPointerId){

                }else{
                    if(i == 0 && j == 0){
                        obj1.open = true;
                        obj.open = true;
                    }
                }
            }else{
                if(i == 0 && j == 0){
                    obj1.open = true;
                    obj.open = true;
                }
            }
            ztreeArr.push(obj1);
            for(var z=0;z<arr[i].children[j].children.length;z++){
                var obj11 = {};
                obj11.name = arr[i].children[j].children[z].pointerName;
                obj11.id = arr[i].children[j].children[z].pointerID;
                obj11.pId = arr[i].children[j].children[z].parent;
                //当前类型：0 区域 1 企业 2 楼宇
                obj11.nodeType = 2;
                if(sessionStorage.curPointerId){
                   var id = sessionStorage.curPointerId;
                    if( obj11.id == id){
                        if(flag){
                            obj11.checked = true;
                            obj1.open = true;
                            obj.open = true;
                            $('#onOff1').html(arr[i].children[j].children[z].pointerName);
                        }
                    }

                }else{
                    if(isCheckAll == false && i == 0 && j == 0 && z == 0){

                        if(flag){
                            if(sessionStorage.curPointerId){

                            }else{
                                sessionStorage.curPointerId = obj11.id;
                                obj11.checked = true;

                            }
                        }
                    }
                }


                ztreeArr.push(obj11);
            }
        }
    }

    //console.log(ztreeArr);
    return ztreeArr;
}

//获取正确的Ztree树结构数据
function getCompactArr1(tempAllPointers,isCheckAll,flag){
    //
    //var allGetDataArr = unique1(tempAllPointers,["districtID","enterpriseID","pointerID"]);

        var _enterpriseArr = unique(tempAllPointers,'enterpriseID');
        var _pointerArr = unique(tempAllPointers,'pointerID');

        var arr = [];
        for(var j=0;j<_enterpriseArr.length;j++){
            var obj1 = {};
            obj1.enterpriseID = _enterpriseArr[j].enterpriseID;
            obj1.eprName = _enterpriseArr[j].eprName;
            obj1.parent = '';
            obj1.children = [];

            for(var z=0;z<_pointerArr.length;z++){

                if(_pointerArr[z].enterpriseID == _enterpriseArr[j].enterpriseID){
                    var obj11 = {};
                    obj11.pointerID = _pointerArr[z].pointerID;
                    obj11.pointerName = _pointerArr[z].pointerName;
                    obj11.parent = obj1.enterpriseID;

                    obj1.children.push(obj11);
                }

            }
            arr.push(obj1);
        }

    var ztreeArr = [];

        for(var j=0;j<arr.length;j++){
            var obj1 = {};
            obj1.name = arr[j].eprName;
            obj1.id = arr[j].enterpriseID;
            obj1.pId = arr[j].parent;
            //当前类型：0 区域 1 企业 2 楼宇
            obj1.nodeType = 1;
            //if(isCheckAll == false){
            //
            //    obj1.nocheck=true;
            //}
            //判断是否打开当前页的Pointer列表
            if(flag){
                obj1.nocheck=true;
                if(sessionStorage.curPointerId){

                }else{
                    if( j == 0){
                        obj1.open = true;

                    }
                }
            }else{
                if(j == 0){
                    obj1.open = true;

                }
            }
            ztreeArr.push(obj1);
            for(var z=0;z<arr[j].children.length;z++){
                var obj11 = {};
                obj11.name = arr[j].children[z].pointerName;
                obj11.id = arr[j].children[z].pointerID;
                obj11.pId = arr[j].children[z].parent;
                //当前类型：0 区域 1 企业 2 楼宇
                obj11.nodeType = 2;
                if(sessionStorage.curPointerId){
                    var id = sessionStorage.curPointerId;
                    if( obj11.id == id){
                        if(flag){
                            obj11.checked = true;
                            obj1.open = true;
                            $('#onOff1').html(arr[j].children[z].pointerName);
                        }
                    }

                }else{
                    if(isCheckAll == false &&  j == 0 && z == 0){

                        if(flag){
                            if(sessionStorage.curPointerId){

                            }else{
                                sessionStorage.curPointerId = obj11.id;
                                $('#onOff1').html(arr[j].children[z].pointerName);
                                obj11.checked = true;

                            }
                        }
                    }
                }


                ztreeArr.push(obj11);
            }
        }

    //console.log(ztreeArr);
    return ztreeArr;
}

//数组去重
function unique(a,attr) {

    var res = [];

    for (var i = 0, len = a.length; i < len; i++) {
        var item = a[i];
        for (var j = 0, jLen = res.length; j < jLen; j++) {
            //console.log(i + '' + res);
            if (res[j][attr] === item[attr]){
                //console.log(333);
                break;
            }

        }
        if (j === jLen){

            res.push(item);

        }

    }

    return res;
}

//获取要传递给后台的楼宇列表
function getPostPointerID(treeObj,selectType){


    //获取到选中的节点
    var nodes = treeObj.getCheckedNodes(true);

    //console.log(nodes);
    var postPointerID = [];

    //如果为复选框
    if(selectType){
        $(nodes).each(function(i,o){

            //如果勾选楼宇节点
            if(o.nodeType == 2){

                var obj = {};
                obj.pointerID = o.id;
                obj.pointerName = o.name;
                postPointerID.push(obj);
            }

        })
    //    如果是单选框
    }else{

        $(nodes).each(function(i,o){

            //如果勾选区域节点
            if(o.nodeType == 0){

                //获取2级节点
                var arr1 = o.children;
                $(arr1).each(function(i,o){

                    //获取3级节点
                    var arr2 = o.children;

                    $(arr2).each(function(i,o){
                        var obj = {};
                        obj.pointerID = o.id;
                        obj.pointerName = o.name;
                        postPointerID.push(obj);
                    })
                })

            }
            //如果勾选企业节点
            if(o.nodeType == 1){
                //获取3级节点
                var arr2 = o.children;

                $(arr2).each(function(i,o){
                    var obj = {};
                    obj.pointerID = o.id;
                    obj.pointerName = o.name;
                    postPointerID.push(obj);
                })

            }
            //如果勾选楼宇节点
            if(o.nodeType == 2){

                var obj = {};
                obj.pointerID = o.id;
                obj.pointerName = o.name;
                postPointerID.push(obj);
            }

        })
    }
    return postPointerID;
}
