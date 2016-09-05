/**
 * Created by went on 2016/9/5.
 */
var Pointers = function($ul){

    var _allPointers;      //数组下JSON格式的全部楼宇
    var _allPointerIds;     //全部楼宇

    //从sessionStorage中获取楼宇
    var getSessionStoragePointers = function(){
        var strPointers = sessionStorage.pointers;
        if(strPointers){
            _allPointers = JSON.parse(strPointers);
            for(var i=0;i<_allPointers.length;i++){
                _allPointerIds.push(_allPointers[i].pointerID);
            }
        }
    };

    //设置ztree Source
    //ul:JQ元素
    var init = function($ul){
        getSessionStoragePointers();
        var settings = {};
        var zNodes = [];
        var isChecked = true;
        for(var i=0;i<_allPointers.length;i++){
            if(i>0) { isChecked = false };
            zNodes.push({
                id: _allPointers[i].pointerID,
                name: _allPointers[i].pointerName,
                open: true,
                checked: isChecked
            });
        }
        $.fn.zTree.init($ul,setting,zNodes);
    }

    init(ul);

}