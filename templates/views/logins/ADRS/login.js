var Login = function(){

    //首先获取url根目录
    var _Lurls = window.document.location.href.split('templates')[0];

    //利用validate登陆
    var handleLogin = function() {

        var showAlertInfo = function(msg){
            msg = msg || "出现错误,请联系管理员";
            $('.alert-danger span').html(msg);
            $('.alert-danger').show();
        };

        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                username: {
                    required: "用户名未填写."
                },
                password: {
                    required: "密码未填写."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit
                showAlertInfo("请输入用户名和密码");
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {

                //首先找出用户名和密码的元素
                var $name = $('input[name=username]'),$password = $('input[name=password]');

                //对用户名
                var name = $name.val();

                //对密码
                var password = $password.val();

                //传参
                var accParams = {"SysuserId":name,"SysuserPass":password};

                //是否记住
                var rememberme = $('input[name=remember]').parent().hasClass("checked");

                if(rememberme){

                    window.localStorage.BEE_remember = "1";
                }

                if(sessionStorage.apiUrlPrefix)
                {

                    var url = sessionStorage.apiUrlPrefix + "DRLogin/Login";
                    $.ajax({
                        url:url,
                        type:"post",
                        data:accParams,
                        success:function(res){

                            if(res.code != 0){

                                showAlertInfo("用户名或者密码错误");

                            }else {
                                //是否记住密码
                                if(rememberme){

                                    localStorage.BEE_username = name;

                                    localStorage.BEE_userpassword = password;
                                }

                                if(res.userName){

                                    sessionStorage.realUserName = res.userName;

                                }

                                //将信息写入到session中
                                sessionStorage.ADRS_SysuserId = name;

                                //登陆id
                                sessionStorage.ADRS_UserId = res.userId;

                                //登陆名
                                sessionStorage.ADRS_UserName = res.userName;

                                //登陆角色
                                sessionStorage.ADRS_UserRole = res.userRole;

                                var url = ''

                                if(sessionStorage.redirectFromPage){

                                    url = sessionStorage.redirectFromPage;

                                }else{

                                    url = sessionStorage.indexUrl;

                                }

                                sessionStorage.userName = 'mch';

                                getMenu();

                                //跳转
                                window.location.href = url;

                            }
                        },
                        error:function(xhr,res,err){

                        }
                    });
                }
            }
        });

        $('.login-form input').keypress(function(e) {

            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    };

    //获取配置文件，保存到存储区域
    var initConfig = function (src) {

        var configSrc =  _Lurls + "assets/local/configs/config.json?"+ Math.random();

        //保存当前的登录页面，提供给退出登录时候使用
        var curLoginPage = window.location.href;
        curLoginPage = curLoginPage.substring(curLoginPage.lastIndexOf("/") + 1,curLoginPage.length);
        //console.log(curLoginPage);
        sessionStorage.curLoginPage = curLoginPage;
        configSrc = src || configSrc;
        if(!sessionStorage.apiUrlPrefix) {
            $.ajax({
                url: configSrc,
                type: 'get',
                async:false,
                success: function (data) {
                    //获取当前的接口地址
                    var apiUrlPrefix = data["apiUriPrefix"] || "";
                    sessionStorage.apiUrlPrefix = apiUrlPrefix;     //存储到暂存区，在本次session中使用

                    var indexUrl = data["indexUrl"] || "";
                    sessionStorage.indexUrl = indexUrl;     //存储到暂存区，在本次session中使用

                    //系统的theme
                    if(!localStorage.themeColor){
                        var themeColor = data["themeColor"];

                        if(themeColor){
                            localStorage.themeColor = themeColor;
                        }else{
                            localStorage.themeColor = "default";
                        }
                    }

                    handleLogin();      //获取到配置信息后，处理登录相关
                },
                error: function (xhr, res, err) {
                    showAlertInfo(err);
                }
            });
        }
        else{
            handleLogin();      //获取到配置信息后，处理登录相关
        }

    };

    //获取到菜单配置文件
    var getMenu = function(){

        var menuSrc = _Lurls + 'assets/local/configs/menu.json?'+ Math.random();

        $.ajax({
                url:menuSrc,
                type:"get",
                success:function(str){

                    sessionStorage.menuStr = JSON.stringify(str);

                    _isMenuLoaded = true;

                    directToIndex();
                },
                error:function(xhr,text,err){

                }
            }
        );
    };

    var directToIndex = function(){


        if(_isMenuLoaded){

            if(sessionStorage.indexUrl){

                _indexUrl = sessionStorage.indexUrl

            }

            if(sessionStorage.redirectFromPage){
                window.location.href = sessionStorage.redirectFromPage;
                sessionStorage.removeItem('redirectFromPage');
            }else{

                window.location.href = _indexUrl;
            }
        }

    };

    return {
        //main function to initiate the module
        init: function() {

            //获取配置
            initConfig();

        }

    };

}();