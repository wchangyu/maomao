$(function(){

    $('.selectLocation').click(function(){

        _selectLocationButton = $(this).attr('id');

        _moTaiKuang($('#address-Modal'),'地点列表','','','','确定');

        addressData();

    })

    $('#address-Modal').on('shown.bs.modal',function(){

        _isClickTr = true;

        _isClickTrMulti = false;

    })

    $('#address-Modal').on('hidden.bs.modal',function(){

        _isClickTr = false;

        _isClickTrMulti = false;

    })

})

//地点表格
var locationCol = [

    {
        title:'选择',
        "targets": -1,
        "data": null,
        render:function(data, type, full, meta){

            return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox"                                 value=""></span></div>'

        }
    },
    {
        title:'地点编号',
        data:'locnum'
    },
    {
        title:'地点名称',
        data:'locname'

    },
    {
        title:'部门',
        data:'departname'
    },
    {
        title:'楼栋',
        data:'ddname'
    },
    {
        title:'层数',
        data:'floor'
    }

]

var locationCol1 = [

    {
        title:'选择',
        "targets": -1,
        "data": null,
        render:function(data, type, full, meta){

            return  '<div class="checker" data-id="' + full.userNum + '"><span class="checked"><input type="checkbox"                                 value=""></span></div>'

        }
    },
    {
        title:'地点编号',
        data:'locnum'
    },
    {
        title:'地点名称',
        data:'locname'

    },
    {
        title:'部门',
        data:'departname'
    },
    {
        title:'楼栋',
        data:'ddname'
    },
    {
        title:'层数',
        data:'floor'
    }

]

//记录当前的选择地点的按钮是哪个
var _selectLocationButton = '';

//地点树
var _addressTreeObj;

//所有地点
var _allAddressArr = [];

//定制setting
function setSettingAddress(treeId,treeData,treeObj){

    var setting = {

        check: {
            enable: true,
            chkStyle: "radio",
            chkboxType: { "Y": "s", "N": "ps" },
            radioType:'all',
            nocheckInherit: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        view:{
            showIcon:false
        },
        callback: {

            onClick: function(e,treeId,treeNode){

                var treeObj = $.fn.zTree.getZTreeObj(treeId);

                //取消全部打钩的节点
                treeObj.checkNode(treeNode,!treeNode.checked,true);

                //获取当前选择的id
                var nodes = treeObj.getCheckedNodes(true);

                if(nodes.length>0){

                    $('#address-table').showLoading();

                    addressFilter(nodes[0],_allAddressArr);

                    $('#address-table tbody').children().eq(0).addClass('tables-hover');

                    $('#address-table').hideLoading();

                }else{

                    addressonlyOne(_allAddressArr);

                    _datasTable($('#address-table'),_allAddressArr);

                }

            },
            beforeClick:function(){

                treeId.find('.curSelectedNode').removeClass('curSelectedNode');

            },
            onCheck:function(e,treeId,treeNode){

                var treeObj = $.fn.zTree.getZTreeObj(treeId);

                $(treeId).find('.curSelectedNode').removeClass('curSelectedNode');

                $(treeId).find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                //取消全部打钩的节点
                treeObj.checkNode(treeNode,true,true);

                //获取当前选择的id
                var nodes = treeObj.getCheckedNodes(true)[0].id;

                if(nodes.length>0){

                    $('#address-table').showLoading();

                    addressFilter(nodes[0],_allAddressArr);

                    $('#address-table tbody').children().eq(0).addClass('tables-hover');

                    $('#address-table').hideLoading();

                }else{

                    addressonlyOne(_allAddressArr);

                    _datasTable($('#address-table'),_allAddressArr);

                }

            }

        }
    };

    treeObj = $.fn.zTree.init(treeId, setting, treeData);

}

//获取地点
function addressData(){

    var prm = {

        userID:_userIdNum

    }

    _mainAjaxFunCompleteNew('post','YWGD/SysLocaleGetAll',prm,false,function(result){

        _allAddressArr = result;

        addressonlyOne(_allAddressArr);

        _datasTable($('#address-table'),_allAddressArr);

        //楼宇名称
        var pointerArr = [];

        //部门
        var departArr = [];

        for(var i=0;i<result.length;i++){

            var isExistPointer = false;

            if(pointerArr.length == 0){

                isExistPointer = true;

            }else{

                for(var k=0;k<pointerArr.length;k++){

                    if(pointerArr[k].ddnum == result[i].ddnum){

                        isExistPointer = false;

                        break;

                    }else{

                        isExistPointer = true;

                    }

                }

            }

            if(isExistPointer){

                pointerArr.push(result[i]);

            }

        }

        for(var i=0;i<result.length;i++){

            var isExistPointer = false;

            if(departArr.length == 0){

                isExistPointer = true;

            }else{

                for(var k=0;k<departArr.length;k++){

                    if(departArr[k].departnum == result[i].departnum){

                        isExistPointer = false;

                        break;

                    }else{

                        isExistPointer = true;

                    }

                }

            }

            if(isExistPointer){

                departArr.push(result[i]);

            }

        }

        var arr = [];

        //将楼宇和部门组成ztree树
        for(var i=0;i<pointerArr.length;i++){

            var data = pointerArr[i];

            var obj = {};

            obj.id = data.ddnum;

            obj.name = data.ddname;

            obj.nocheck = true;

            obj.open = true;

            arr.push(obj);

        }

        for(var i=0;i<departArr.length;i++){

            var obj = {};

            obj.id = departArr[i].departnum;

            obj.name = departArr[i].departname;

            obj.pId = departArr[i].ddnum;

            obj.pointerId = departArr[i].ddnum;

            obj.pointerName = departArr[i].ddname;

            arr.push(obj);

        }

        setSettingAddress($('#departTreeLocation'),arr,_addressTreeObj);

        searchPointerKey($('#keyDepLocation'),'departTreeLocation',$('#depSearchLocation'));

    })

}

//过滤地点
function addressFilter(node){

    var arr = [];

    for(var i=0;i<_allAddressArr.length;i++){

        if(_allAddressArr[i].departnum == node.id && _allAddressArr[i].ddnum == node.pointerId){

            arr.push(_allAddressArr[i]);

        }

    }

    addressonlyOne(arr);

    _datasTable($('#address-table'),arr);

}

//是不是只有一个
function addressonlyOne(arr){

    if(arr.length == 1){

        _tableInitSearch($('#address-table'),locationCol1,'2','','','','','',10,'','','',true);

    }else{

        _tableInitSearch($('#address-table'),locationCol,'2','','','','','',10,'','','',true);

    }

}