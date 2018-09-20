//正则表达式（账户名不能是中文）
$.validator.addMethod("NonChinese",function(value,element,params){

    var doubles= /([a-zA-Z0-9]*[a-zA-Z][a-zA-Z0-9]*)/;

    return this.optional(element)||(doubles.test(value));

},"请使用英文加数字格式");

//正则表达式（邮箱）
$.validator.addMethod("emailFormat",function(value,element,params){

    var doubles= /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    return this.optional(element)||(doubles.test(value));

},"请输入邮箱格式");

//正则表达式（大于0的数字）
$.validator.addMethod("numberFormat1",function(value,element,params){

    var doubles= /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;

    return this.optional(element)||(doubles.test(value));

},"请输入大于0的数字");

//联系方式验证（手机和座机）
$.validator.addMethod("phoneNumFormat",function(value,element,params){

    //手机号
    var mobile = /^1[3|5|8]\d{9}$/ ;
    //带区号的座机
    //var phone = /^0\d{2,3}-?\d{7,8}$/;

    var phone = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;

    var flag = false;

    if( mobile.test(value) || phone.test(value)){

        flag = true;

    }

    return this.optional(element)||flag;

},"请输入合法的联系方式");