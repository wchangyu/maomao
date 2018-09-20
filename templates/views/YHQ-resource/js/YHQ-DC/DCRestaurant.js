$(function(){

    /*----------------------------------------验证-----------------------------------------*/

    function validform(){

        return $('#commentForm').validate({

            rules:{
                //餐厅名称
                'DC-name':{

                    required: true

                },
                //地址
                'DC-location':{

                    required: true

                },
                //电话
                'DC-tel':{

                    required: true,

                    phoneNumFormat:true

                },
                //经理
                'DC-manager':{

                    required: true

                },
                //送餐费
                'DC-mealFee':{

                    required: true,

                    number:true,

                    min:0

                },

                //早送餐时间
                'breakfast-time':{

                    required: true

                },

                //早送餐时间截止
                'breakfast-end-time':{

                    required: true

                },

                //中送餐时间
                'lunch-time':{

                    required: true

                },

                //中送餐时间截止
                'lunch-end-time':{

                    required: true

                },

                //晚送餐时间
                'dinner-time':{

                    required: true

                },

                //晚送餐时间截止
                'dinner-end-time':{

                    required: true

                }

            },
            messages:{

                //餐厅名称
                'DC-name':{

                    required: '请输入餐厅名称'

                },
                //地址
                'DC-location':{

                    required: '请输入餐厅地址'

                },
                //电话
                'DC-tel':{

                    required: '请输入餐厅电话',

                    phoneNumFormat:'请输入电话格式'

                },
                //经理
                'DC-manager':{

                    required: '请输入经理姓名'

                },
                //送餐费
                'DC-mealFee':{

                    required: '请输入送餐费',

                    number:'请输入正确的金额'

                },

                //早送餐时间
                'breakfast-time':{

                    required: '请输入早送餐时间'

                },

                //早送餐时间截止
                'breakfast-end-time':{

                    required: '请输入早送餐截止时间'

                },

                //中送餐时间
                'lunch-time':{

                    required: '请输中早送餐时间'

                },

                //中送餐时间截止
                'lunch-end-time':{

                    required: '请输入中送餐截止时间'

                },

                //晚送餐时间
                'dinner-time':{

                    required: '请输入晚送餐时间'

                },

                //晚送餐时间截止
                'dinner-end-time':{

                    required: '请输入晚送餐截止时间'

                }
            }

        });

    }

    /*----------------------------------------按钮事件-------------------------------------*/

    //新增
    $('#createBtn').click(function(){

        //loadding
        $('.L-container').showLoading();

        //初始化

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        $('.L-container').hideLoading();

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可操作


    })

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){



        }

    })

    //操作发送数据
    function sendData(url,el,successFun){

        var prm = {


            //登陆id
            userID:_userIdNum,
            //登录名
            userName:_userIdName,
            //角色
            b_UserRole:_userRole,
            //部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun);

    }



})