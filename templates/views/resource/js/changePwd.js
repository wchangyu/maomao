$(function(){
    /*-------------------------------全局变量--------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //存放所有员工列表的数组
    var _allPersonalArr = [];

    //验证必填项（非空）
    Vue.validator('notempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //新增用户登记对象
    var user = new Vue({
        el:'#user',
        data:{
            username:'',
            jobnumber:'',
            oldPwd:'',
            password:'',
            confirmpassword:'',
        },
        methods:{
            keyUp:function(){
                if( user.password != user.confirmpassword ){
                    $('.confirmpassword').show().html('两次输入密码不一致！');
                    if( user.confirmpassword == '' ){
                        $('.confirmpassword').hide();
                    }
                }else{
                    $('.confirmpassword').hide();
                }
            },
            keyUpJob:function(){
                var existFlag = false;
                for(var i=0;i<_allPersonalArr.length;i++){
                    if(_allPersonalArr[i].userNum == user.jobnumber){
                        existFlag = true;
                    }
                }
                if(existFlag){
                    $('.jobNumberExists').show();
                }else{
                    $('.jobNumberExists').hide();
                }
            }
        }
    });

    //绑定数据
    user.username = sessionStorage.getItem('realUserName');

    user.jobnumber = _userIdNum = sessionStorage.getItem('userName');

    /*-------------------------------按钮事件-------------------------------*/
    //修改密码确定按钮
    $('.btn-info').click(function(){
        changePwd();
    })

    /*--------------------------------其他方法------------------------------*/

    //模态框自适应
    function moTaiKuang(who,title,flag){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        who.find('.modal-title').html(title);
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
    };

    //修改提示信息
    function tipInfo(who,title,meg,flag){
        moTaiKuang(who,title,flag);
        who.find('.modal-body').html(meg);
    };

    //修改密码
    function changePwd(){
        //判断密码和确认密码是否为空
        if( user.password == '' ){

            tipInfo($('#myModal1'),'提示','请填写红色必填项','flag');

        }else{

            if($('.confirmpassword')[0].style.display == 'none'){

                var prm = {
                    //用户工号
                    userNum:user.jobnumber,
                    //原密码
                    password:user.oldPwd,
                    //新密码
                    newpassword:user.password,
                    //修改新密码
                    newpassword2:user.confirmpassword
                }

                $.ajax({
                    type:'post',
                    url:_urls + 'RBAC/rbacChangePwd',
                    data:prm,
                    success:function(result){

                        if(result == 99){

                            tipInfo($('#myModal1'),'提示','修改密码成功','flag');

                        }else{

                            tipInfo($('#myModal1'),'提示','修改密码失败','flag');

                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){

                        var str = JSON.parse(jqXHR.responseText).message;

                        tipInfo($('#myModal1'),'提示',str,'flag');

                        console.log(jqXHR.responseText);

                    }
                })
            }else{
                tipInfo($('#myModal1'),'提示','两次密码填写不一致！','flag');
            }
        }

    }
})