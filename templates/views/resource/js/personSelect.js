/**
 * Created by admin on 2018/11/19.
 */

$(function(){

    //点击按钮选择
    $('.selectUser').click(function(){

        _selectPersonButton = $(this).attr('id');

        _moTaiKuang($('#person-new-Modal'),'人员列表','','','','确定');

        //获取人员
        driverPerson();

        //获取部门
        getDepartData();

        //获取部门
        getPositionData();

    })

    $('#person-new-Modal').on('shown.bs.modal',function(){

        _isClickTr = true;

        _isClickTrMulti = false;

    })

    $('#person-new-Modal').on('hidden.bs.modal',function(){

        _isClickTr = false;

        _isClickTrMulti = false;

    })

})

//员工表格(多个结果)
var personCol = [

    {
        title:'选择',
        "targets": -1,
        "data": null,
        render:function(data, type, full, meta){

            return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox"                                 value=""></span></div>'

        }
    },
    {
        title:'姓名',
        data:'userName'
    },
    {
        title:'部门',
        data:'departName',
        render:function(data, type, full, meta){

            return '<span data-num="' + full.departNum + '">' + data + '</span>'

        }

    },
    {
        title:'职位',
        data:'roleName'
    },
    {
        title:'电话',
        data:'mobile'
    }

]

//员工表格(一个结果)
var personCol1 = [

    {
        title:'选择',
        "targets": -1,
        "data": null,
        render:function(data, type, full, meta){

            return  '<div class="checker" data-id="' + full.userNum + '"><span class="checked"><input type="checkbox"                                 value=""></span></div>'

        }
    },
    {
        title:'姓名',
        data:'userName'
    },
    {
        title:'部门',
        data:'departName',
        render:function(data, type, full, meta){

            return '<span data-num="' + full.departNum + '">' + data + '</span>'

        }

    },
    {
        title:'职位',
        data:'roleName'
    },
    {
        title:'电话',
        data:'mobile'
    }

]

//部门树对象
var depZtreeObj;

//职位树对象
var posZtreeObj;

//所有员工信息
var _allPersonArr = [];

//记录当前的选择人员的按钮是哪个
var _selectPersonButton = '';

//获取签订人
function driverPerson(){

    var prm = {

        'userID':_userIdNum,

        'userName':_userIdName

    }

    _mainAjaxFunCompleteNew('post','RBAC/rbacGetUsers',prm,false,function(result){

        persononlyOne(result);

        _datasTable($('#person-table-filter'),result);

        //根据部门筛选员工
        _allPersonArr = result;


    })

}

//获取部门
function getDepartData(){

    var prm ={

        "userID": _userIdNum

    }

    _mainAjaxFunCompleteNew('post','RBAC/rbacGetDeparts',prm,false,function(result){

        //处理部门数组
        var depArr = [];

        if(result && result.length>0){

            for(var i=0;i<result.length;i++){

                var data = result[i];

                var obj = {};

                obj.pId = data.parentNum;

                obj.id = data.departNum;

                obj.name = data.departName;

                depArr.push(obj);

            }

            //绘制ztree部门树
            setSetting($('#departTree'),depArr,depZtreeObj,1);

            //关键字搜索
            searchPointerKey($('#keyDep'),'departTree',$('#depSearch'));

        }else{

            filterPerson('',_allPersonArr,1)

        }

    })

}

//获取职位
function getPositionData(){

    var prm ={

        "userID": _userIdNum

    }

    _mainAjaxFunCompleteNew('post','RBAC/rbacGetRoles',prm,false,function(result){

        //处理部门数组
        var posArr = [];

        if(result && result.length>0){

            for(var i=0;i<result.length;i++){

                var data = result[i];

                var obj = {};

                obj.id = data.roleNum;

                obj.name = data.roleName;

                posArr.push(obj);

            }


            //绘制ztree部门树
            setSetting($('#positionTree'),posArr,posZtreeObj,2);

            //关键字搜索
            searchPointerKey($('#keyPos'),'positionTree',$('#posSearch'));

        }else{

            filterPerson('',_allPersonArr,2)

        }

    })

}

//定制ztree设置(1,对部门筛选，2对角色筛选)
function setSetting(treeId,treeData,treeObj,num){

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

                    $('#person-table-filter').showLoading();

                    filterPerson(nodes[0].id,_allPersonArr,num);

                    $('#person-table-filter').hideLoading();

                }else{

                    persononlyOne(_allPersonArr);

                    _datasTable($('#person-table-filter'),_allPersonArr);

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
                var nodes = treeObj.getCheckedNodes(true);

                if(nodes.length>0){

                    $('#person-table-filter').showLoading();

                    filterPerson(nodes[0].id,_allPersonArr,num);

                    $('#person-table-filter').hideLoading();

                }else{

                    persononlyOne(_allPersonArr);

                    _datasTable($('#person-table-filter'),_allPersonArr);

                }

            }

        }
    };

    treeObj = $.fn.zTree.init(treeId, setting, treeData);

}

//根据选中的部门，对人员进行筛选
function filterPerson(value,arr,num){

    var filterArr = [];

    if(num == 1){

        for(var i=0;i<arr.length;i++){

            if(arr[i].departNum == value){

                filterArr.push(arr[i]);
            }

        }

    }else if(num == 2){

        for(var i=0;i<arr.length;i++){

            if(arr[i].roleNum == value){

                filterArr.push(arr[i]);
            }

        }

    }

    if(value){

        persononlyOne(filterArr);

        _datasTable($('#person-table-filter'),filterArr);

        if(filterArr.length == 1){

            $('#person-table-filter tbody').children().eq(0).addClass('tables-hover');

        }

    }else{

        persononlyOne(arr);

        _datasTable($('#person-table-filter'),arr);

    }

}

//是不是只有一个
function persononlyOne(arr){

    if(arr.length == 1){

        _tableInitSearch($('#person-table-filter'),personCol1,'2','','','','','',10,'','','',true);

    }else{

        _tableInitSearch($('#person-table-filter'),personCol,'2','','','','','',10,'','','',true);

    }

}

