$(function(){

    var str = ''

    if(sessionStorage.misc == '1'){

        str = '<script src="js/language_cn.js"></script>'

    }else if(sessionStorage.misc == '2'){

        str = '<script src="js/language_en.js"></script>'

    }

    $('body').append(str);

})