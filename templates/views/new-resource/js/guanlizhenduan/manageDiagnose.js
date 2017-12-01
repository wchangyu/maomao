/**
 * Created by admin on 2017/11/30.
 */
$(function(){

     //获取一键诊断包含的分类及其具体的操作项
    getOneKeyDiagItemType();

});
//获取一键诊断包含的分类及其具体的操作项
function getOneKeyDiagItemType(){

    $.ajax({
        type: 'get',
        url: sessionStorage.apiUrlPrefix + 'OneKeyDiag/GetOneKeyDiagItemType',
        success: function (result) {

            console.log(result);

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })
}
