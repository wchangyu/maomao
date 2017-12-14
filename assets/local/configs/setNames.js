/**
 * Created by admin on 2017/12/10.
 */

var __names = {

    //区域
    area:"车务段",
    //部门
    department:"车站",
    //车间
    workshop: "车间",
    //班组
    group:"维修班组"

};

//定义需给页面中区域，部门等动态赋值的页面名称
var __pageArr = ['assetManagement-1.html','assetManagement-3.html','assetManagement-5.html','assetManagement-4.html','assetManagement-print.html','assetManagement-print-blue.html'];


function __setNames(){

    //获取当前页面url
    var pageName = window.location.href;

    //定义是否需要重新赋值
    var ifSetName = false;

    //判断需要给页面重新赋值
    $(__pageArr).each(function(i,o){

        //需要重新赋值
        if(pageName.indexOf(o) > -1){

            ifSetName = true;
            //终止循环
            return false;
        }
    });

    //当前页面不需重新赋值 终止函数
    if(ifSetName == false){

        return false;
    }

    //给页面赋值
    //区域
    $('.user-defined-area').html(__names.area);

    //部门
    $('.user-defined-department').html(__names.department);

    //车间
    $('.user-defined-workshop').html(__names.workshop);

    //班组
    $('.user-defined-group').html(__names.group);

}

__setNames();