$(function(){

    _isClickTr = true;

    /*-----------------------------------人员选择列表--------------------------------*/

    //人员表格
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
            title:'所属部门',
            data:'departName',
            render:function(data, type, full, meta){

                return  '<span data-attr="' + full.departNum + '">' + data + '</span>'

            }
        },
        {
            title:'职位',
            data:'roleName'
        },
        {
            title:'联系方式',
            data:'phone'
        }

    ];

    //表格名字一定要是person-table
    _tableInitSearch($('.person-table'),personCol,'2','','','','','',10,'','','',true);

    //获取人员列表
    personData();

    //模态框
    $('.personButtonSelect').on('click',function(){

        _currentPersonDom = $(this).prev().attr('id');

        //表格初始化
        _datasTable($('.person-table'),_allPerson);

        //模态框
        _moTaiKuang($('#person-Modal'),'人员列表','','','','确定');

    })

    //只要姓名的框内容修改了，则清空id框
    $('.userName-block').on('keyup',function(){

        $(this).parents('li').prev('li').children('.userNum-block').val('');

    })

})

//记录当前选择的人的dom
var _currentPersonDom = '';

//记录当前所有人员信息
var _allPerson = [];

//获取人员数据
function personData(){

    var prm = {

            'userID':_userIdNum,

            'userName':_userIdName

        }

    _mainAjaxFunCompleteNew('post','RBAC/rbacGetUsers',prm,false,function(result){

        _allPerson = result;

    })

}

