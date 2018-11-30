$(function(){

    //材料表格
    var materialCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'物料编码',
            data:'itemNum'

        },
        {
            title:'物料名称',
            data:'itemName'
        },
        {
            title:'型号',
            data:'size'
        },
        {
            title:'单价',
            render:function(data, type, full, meta){

                var amount = Number(full.amount);

                var num = Number(full.num);

                var price = 0;

                price = amount / num;

                return price.toFixed(2);

            }
        },
        {
            title:'单位',
            data:'unitName'
        },
        {
            title:'仓库',
            data:'storageName'
        }

    ]

    _tableInitSearch($('#material-table'),materialCol,'2','','','','','',10,'','','',true);

    //物料选择
    $('#material-table-add').on('click','.selectMaterial',function(result){

        _moTaiKuang($('#material-Modal'),'物料列表','','','','选择');

        warehouse();

    })

    $('#material-Modal').on('shown.bs.modal',function(){

        //多选
        _isClickTrMulti = false;

        //单选
        _isClickTr = true;

    })

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

                materialFilter(treeNode,materialArr);
            },
            beforeClick:function(e,treeId,treeNode){

                $('#cateTree').find('.curSelectedNode').removeClass('curSelectedNode');

            },
            onCheck:function(e,treeId,treeNode){

                var treeObj = $.fn.zTree.getZTreeObj(treeId);

                $(treeId).find('.curSelectedNode').removeClass('curSelectedNode');

                $(treeId).find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                //取消全部打钩的节点
                treeObj.checkNode(treeNode,true,true);

                materialFilter(treeNode,materialArr)

            }

        }
    };

    //获取材料
    function materialData(arr){

        var prm = {

            //分类名称
            itemName:'',
            //分类编码
            itemNum:'',
            //仓库:
            storageNums:arr,
            //库存是否大于0
            hasNum:1,
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YWCK/ywCKRptItemStock',prm,false, function (result) {

            if(result.length != 0 && result != null ){

                _datasTable($('#material-table'),result);

                materialArr = result;

            }

        })

    }


    //根据物品分类获取物品
    function materialFilter(node,arr){

        var arrFilter = [];

        for(var i=0;i<arr.length;i++){

            if(node.id == arr[i].storageNum){

                arrFilter.push(arr[i]);

            }

        }

        _datasTable($('#material-table'),arrFilter);


    }

    //获取所有仓库
    function warehouse(){

        var prm = {

            'userID':_userIdNum,

            'userName':_userIdName,

            'b_UserRole':'admin',

            "hasLocation":1
        }

        $.ajax({
            type:'post',

            url:_urls + 'YWCK/ywCKGetStorages',

            data:prm,

            success:function(result){

                var arr = [];

                var storage = [];

                if(result.length != 0 && result != null){

                    for(var i=0;i<result.length;i++){


                        var data = result[i];

                        storage.push(data.storageNum);

                        var obj = {};

                        obj.name = data.storageName;

                        obj.id = data.storageNum;

                        arr.push(obj);

                    }

                }

                warehouseTreeObj = $.fn.zTree.init($('#cateTree'), setting, arr);

                //默认仓库下的所有物品
                materialData(storage);

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);
            }

        })
    }

})

//仓库树对象
var warehouseTreeObj;

//所有物品列表
var materialArr = [];