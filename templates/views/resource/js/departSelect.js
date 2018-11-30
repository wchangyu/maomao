$(function(){

    //部门
    var depCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'科室编码',
            data:'departNum'

        },
        {
            title:'科室名称',
            data:'departName'
        }

    ]

    _tableInitSearch($('#depart-table-global'),depCol,'2','','','','','',10,'','','',true);

    //点击选择科室按钮
    $('.selectDepart').click(function(){

        _selectDepartButton = $(this).attr('id');

        _moTaiKuang($('#dep-Modal'),'科室列表','','','','确定');

        getDepartDatadepart();

    })

    $('#dep-Modal').on('shown.bs.modal',function(){

        _isClickTr = true;

        _isClickTrMulti = false;

    })

    $('#dep-Modal').on('hidden.bs.modal',function(){

        _isClickTr = false;

        _isClickTrMulti = false;

    })

})

var _selectDepartButton = '';

function getDepartDatadepart(){

    _datasTable($('#depart-table-global'),[]);

    var prm ={

        "userID": _userIdNum

    }

    _mainAjaxFunCompleteNew('post','RBAC/rbacGetDeparts',prm,false,function(result){

        _datasTable($('#depart-table-global'),result);

    })

}