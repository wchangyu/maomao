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

//正则表达式（大于0的数字）(废弃)
$.validator.addMethod("numberFormat1",function(value,element,params){

    var doubles= /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;

    ///^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/

    return this.optional(element)||(doubles.test(value));

},"请输入大于0的数字");

//联系方式验证（手机和座机）
$.validator.addMethod("phoneNumFormat",function(value,element,params){

    //手机号
    var mobile = /^1[3|5|8|7]\d{9}$/ ;
    //带区号的座机
    //var phone = /^0\d{2,3}-?\d{7,8}$/;

    //var phone = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;

    var phone = /\d{7,8}/;

    var flag = false;

    if( mobile.test(value) || phone.test(value)){

        flag = true;

    }

    return this.optional(element)||flag;

},"请输入合法的联系方式");

//日期格式验证(必填)；
$.validator.addMethod("isDate", function(value, element){

    var ereg = /^(\d{1,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/;

    var r = value.match(ereg);

    if (r == null) {

        $(element).parents('.time-tool-block').next().next().show();

        return false;
    }
    var d = new Date(r[1], r[3] - 1, r[5]);

    var result = (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[5]);

    return this.optional(element) || (result);

}, "请输入正确的日期");

//日期格式验证(必填)；
$.validator.addMethod("isDate1", function(value, element){

    var ereg = /^(\d{1,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/;

    var r = value.match(ereg);

    if(value != ''){

        if (r == null) {

            $(element).parents('.time-tool-block').next().next().show();

            return false;
        }

        var d = new Date(r[1], r[3] - 1, r[5]);

        var result = (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[5]);

    }

    return this.optional(element) || (result);


}, "请输入正确的日期");

//日期必填验证
$.validator.addMethod("isEmpty", function(value, element){



    if( value == ''){

        $(element).parents('.time-tool-block').next().next().show();

        return false;

    }else{

        $(element).parents('.time-tool-block').next().next().hide();

        return true;

    }

}, "日期不能为空");

//时间点验证
$.validator.addMethod("isTimeFormat",function(value,element,params){

    var doubles= /^(0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/;

    return this.optional(element)||(doubles.test(value));

},"请输入时间格式：HH:mm");

//大于0的整数 /^[1-9]\d*$/

//大于0的数字 /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/