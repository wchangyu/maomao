$(function(){

    //只有服务商才可以进到这个页面
    if(sessionStorage.ADRS_UserRole != 2){

        window.history.go(-1);

    }

    //获取id
    var href = window.location.search;

    var _id = href.split('=')[1];

    //保存当前按钮
    var _thisButton = '';

    /*--------------------------------------------验证--------------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //原始密码
            'create-old-pwd':{

                //必填
                required: true,

                //长度
                minlength: 6

            },

            //新密码
            'create-new-pwd':{

                //必填
                required: true,

                //长度
                minlength: 6

            },

            //确认新密码
            'sure-new-pwd':{

                //必填
                required: true,

                equalTo: "#create-new-pwd"

            }


        },
        messages:{

            ///原始密码
            'create-old-pwd':{

                //必填
                required: '请输入原始密码',

                //长度
                minlength: '密码长度不能小于6位'

            },

            //新密码
            'create-new-pwd':{

                //必填
                required: '请输入新密码',

                //长度
                minlength: '密码长度不能小于6位'

            },

            //确认新密码
            'sure-new-pwd':{

                //必填
                required: '请确认新密码',

                equalTo: "确保两次密码输入一致"

            }

        }

    })

    //保存
    $('#changeButton').click(function(){

        _thisButton = $(this);

        formatValidateUser(function(){

            changePassword();

        })

    })

    //格式验证
    function formatValidateUser(fun){

        $('#tip').hide();

        //非空验证
        if($('#create-old-pwd').val() == '' || $('#create-new-pwd').val() == '' || $('#sure-new-pwd').val() == ''  ){

            $('#theLoading').modal('hide');

            _topTipBar('请填写必填项')

        }else{

            //验证错误
            var error = $('#commentForm').find('.error');

            if(error.length != 0){

                var flag = true;

                for(var i=0;i<error.length;i++){

                    if(error.eq(i).css('display') != 'none'){

                        flag = false;

                        break;

                    }

                }

                if(flag){

                    fun();

                }else{

                    _topTipBar('请填写正确格式')

                }

            }else{

                //验证通过
                fun();

            }


        }

    }

    //修改密码发送数据
    function changePassword(){

        $('#theLoading').modal('show');

        var buttonStr = '<i class="fa fa-check" style="margin-right: 5px;"></i>正在保存...'

        _thisButton.empty().append(buttonStr).attr('disabled',true);

        var prm = {

            //用户Id
            userId:_id,

            //原始密码 ,
            orgSysuserPass:$('#create-old-pwd').val(),

            //最新密码
            newSysuserPass:$('#create-new-pwd').val(),

            //确认最新密码
            confirmNewSysuserPass:$('#sure-new-pwd').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRUser/ModifyDRSysuserPass',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                var buttonStr = '<i class="fa fa-check" style="margin-right: 5px;"></i>修改密码'

                _thisButton.empty().append(buttonStr).attr('disabled',false);

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    window.location.href = 'user.html';

                }else if(result.code == -2){

                    _topTipBar('暂无数据');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('输入错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == -6){

                    _topTipBar('抱歉，您没有修改密码的权限');

                }

            },

            error:_errorFun


        })


    }


})