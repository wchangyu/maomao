$(function(){

    /*----------------------------------------------创建vue对象---------------------------------------*/

    //vue对象
    var gdObj = {
        'el':'#gdDetail',
        data:{
            gdtype:'',
            xttype:'',
            bxtel:'',
            bxkesh:'',
            gztime:'',
            wxshx:'',
            sbtype:'',
            sbnum:'',
            sbname:'',
            azplace:'',
            wxbz:'',
            gzplace:'',
            wxcontent:'',
        }
    }

    var _prm = window.location.search;

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //获得用户名
    var _userIdNum = sessionStorage.getItem('userName');

    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');

    //console.log(_prm)

})