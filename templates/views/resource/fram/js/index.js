$(function(){
    //左边ztree树
    ztreeFun();
    //中间表格
    var table = $('#scrap-datatables').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'sSearch':'查询',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'t<"F"lip>',
        "ajax":'../resource/data/ajax.json',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs',
                exportOptions:{
                    columns:[0,1,2,3,4,5,6]
                }
            },
        ],
        'columns':[
            {
                title:'姓名',
                data:'name'
            },
            {
                title:'职位',
                data:'position'
            },
            {
                title:'薪水',
                data:'salary'
            },
            {
                title:'入职时间',
                data:'start_date'
            },
            {
                title:'办公地点',
                data:'office'
            },
            {
                title:'工号',
                data:'extn'
            }
        ]
    });
    //ztree树数据
    function ztreeFun(){
        //所有数据
        var _allData = [];
        //区域id
        var _districArr = [];
        //企业id
        var _enterpriseArr = [];
        //楼宇id
        var _pointerArr = [];
        $.ajax({
            type:'get',
            url:'../resource/fram/data.json',
            success:function(result){
                //确定id不重复
                for(var i=0;i<result.length;i++){
                    _allData.push(result[i]);
                }
                _districArr = unique(_allData,'districtID');
                _enterpriseArr = unique(_allData,'enterpriseID');
                _pointerArr = unique(_allData,'pointerID');
                var arr = [];
                for(var i=0;i<_districArr.length;i++){
                    //console.log(_districArr[i]);
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
                        if( _enterpriseArr[j].districtID = _districArr[i].districtID){
                            obj.children.push(obj1);
                        }

                        for(var z=0;z<_pointerArr.length;z++){
                            var obj11 = {};
                            obj11.pointerID = _pointerArr[z].pointerID;
                            obj11.pointerName = _pointerArr[z].pointerName;
                            obj11.parent = obj1.enterpriseID;
                            if(_pointerArr[z].enterpriseID == _enterpriseArr[j].enterpriseID)
                                obj1.children.push(obj11);
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
                    obj.open = true;
                    ztreeArr.push(obj);
                    for(var j=0;j<arr[i].children.length;j++){
                        var obj1 = {};
                        obj1.name = arr[i].children[j].eprName;
                        obj1.id = arr[i].children[j].enterpriseID;
                        obj1.pId = arr[i].children[j].parent;
                        ztreeArr.push(obj1);
                        for(var z=0;z<arr[i].children[j].children.length;z++){
                            var obj11 = {};
                            obj11.name = arr[i].children[j].children[z].pointerName;
                            obj11.id = arr[i].children[j].children[z].pointerID;
                            obj11.pId = arr[i].children[j].children[z].parent;
                            ztreeArr.push(obj11);
                        }
                    }
                }
                var setting = {
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        chkboxType: { "Y": "s", "N": "ps" },
                        radioType:'all'
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
                            //取消全部打钩的节点
                            zTreeObj.checkNode(treeNode,!treeNode.checked,true);
                        },
                    }
                };
                var zTreeObj = $.fn.zTree.init($("#ztree-block"), setting, ztreeArr);
            }
        })
    }
    //数组去重
    function unique(a,attr) {
        var res = [];

        for (var i = 0, len = a.length; i < len; i++) {
            var item = a[i];
            for (var j = 0, jLen = res.length; j < jLen; j++) {
                if (res[j][attr] === item[attr])
                    break;
            }

            if (j === jLen)
                res.push(item);
        }

        return res;
    }
})