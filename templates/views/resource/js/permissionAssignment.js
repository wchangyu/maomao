$(function(){
    /*--------------------------------全局变量-------------------------------------*/
    //获取角色列表
    getRole();

    //获取所有仓库列表
    getWharehouse();

    //存放所有的资源
    var resArr = [];

    //存放每个角色已有的权限
    var bhArr = [];
    /*--------------------------------按钮事件-------------------------------------*/
    //状态选项卡
    $('.table-title').children('span').click(function(){
        $('.table-title').children('span').removeClass('spanhover');
        $(this).addClass('spanhover');
        var mainContentsTable = $('.main-contents-table');
        mainContentsTable.addClass('hide-block');
        mainContentsTable.eq($(this).index()).removeClass('hide-block');
        for(var i=0;i<$('.excelButton').children().length;i++){
            $('.excelButton').children().eq(i).addClass('hidding');
        }
        $('.excelButton').children().eq($(this).index()).removeClass('hidding');
    })

    //角色查询
    $('#roleSelected').click(function(){
        getRole();
    })

    //复选框点击事件
    $('.power-right').on('click','input',function(){
        var lengths = $(this).parent('.checked').length;
        if(lengths){
            $(this).parent('span').removeClass('checked');
            $(this).parents('li').css({'background':'#ffffff'});
            $('.allSelect').find('input').parent('span').removeClass('checked');
        }else{
            $(this).parent('span').addClass('checked');
            $(this).parents('li').css({'background':'rgb(251, 236, 136)'});
            //如果全勾选了，全选也打钩
            var length1 = $('.power-right').find('input').length;
            var length2 = $('.power-right').find('.checked').length;
            if(length1 == length2){
                $('.allSelect').find('input').parent('span').addClass('checked');
            }
        }
    })

    //全选\全不选
    $('.allSelect').click(function(){
        var lengths = $(this).find('input').parent('.checked').length;
        var chs = $('.power-right').find('input');
        if(lengths){
            for(var i=0;i<chs.length;i++){
                chs.eq(i).parent('span').addClass('checked');
                chs.eq(i).parents('li').css({'background':'rgb(251, 236, 136)'});
            }
        }else{
            for(var i=0;i<chs.length;i++){
                chs.eq(i).parent('span').removeClass('checked');
                chs.eq(i).parents('li').css({'background':'#ffffff'});
            }
        }
    })

    //保存
    $('.save').click(function(){
        //获取已选中的角色
        var role = $('.active11').attr('data-bm');
        //获取已选中的仓库
        var wharehouses = $('.power-right').find('.checked');
        var arr = [];
        for(var i=0;i<wharehouses.length;i++){
            var obj = {};
            obj.roleNum = role;
            obj.resNum = wharehouses.eq(i).parents('li').attr('data-bh');
            arr.push(obj);
        }
        var prm = {
            'relations':arr,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacAddCKRelation',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                if(result == 99){
                    _moTaiKuang($('#myModal1'), '提示', 'flag', 'istap' ,'权限保存成功！', '');

                    //重新刷新获得的数据
                    var prm = {
                        'userID':_userIdNum,
                        'userName':_userIdName,
                        'b_UserRole':_userRole
                    }
                    $.ajax({
                        type:'post',
                        url:_urls + 'RBAC/rbacGetCKRelations',
                        data:prm,
                        timeout:_theTimes,
                        success:function(result){
                            resArr.length = 0;
                            for(var i=0;i<result.length;i++){
                                resArr.push(result[i]);
                            }
                        },
                        error:function(jqXHR, textStatus, errorThrown){
                            console.log(jqXHR.responseText);
                        }
                    })

                }else{
                    _moTaiKuang($('#myModal1'), '提示', 'flag', 'istap' ,'权限保存失败 ！', '');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })

    //选择角色
    $('.power-left').on('click','li',function(){
        //样式改变
        $('.power-left').children('li').removeClass('active11');
        $(this).addClass('active11');
        //右边样式初始化
        $('.power-right').find('.checked').parents('li').css({'background':'#ffffff'});
        $('.power-right').find('.checked').removeClass('checked');
        //获取勾选的资源
        bhArr.length = 0;
        for(var i=0;i<resArr.length;i++){
            if(resArr[i].roleNum == $(this).attr('data-bm')){
                bhArr.push(resArr[i].resNum);
            }
        }
        var lengths = $('.power-right').children('li').length;
        for(var i=0;i<lengths;i++){
            var aa = $('.power-right').children('li').eq(i).attr('data-bh');
            for(var j=0;j<bhArr.length;j++){
                if(aa == bhArr[j]){
                    $('.power-right').children('li').eq(i).css({'background':'rgb(251, 236, 136)'});
                    $('.power-right').children('li').eq(i).find('input').parent('span').addClass('checked');
                }
            }
        }
        //设置全选
        if(lengths == bhArr.length){
            $('.allSelect').find('input').parent('span').addClass('checked');
        }else{
            $('.allSelect').find('input').parent('span').removeClass('checked');
        }
    });

    /*--------------------------------其他方法-------------------------------------*/
    //获得角色列表
    function getRole(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').eq(0).find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetRoles',
            data:{
                'roleName':filterInput[0],
                'userID':_userIdNum,
                'userName':_userIdName,
                'b_UserRole':_userRole
            },
            success:function(result){
                var  str = '';
                for(var i=0;i<result.length;i++){
                    if(i==0){
                        str += '<li class="active11" data-bm = ' + result[i].roleNum +
                            '>' + result[i].roleName +
                            '</li>'
                    }else{
                        str += '<li data-bm = ' + result[i].roleNum +
                            '>' + result[i].roleName +
                            '</li>'
                    }
                }
                $('.power-left').empty().append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //仓库列表
    function getWharehouse(){
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:{
                userID:_userIdNum,
                userName:_userIdName,
                b_UserRole:_userRole,
                storageNum:''
            },
            timeOut:_theTimes,
            success:function(result){
                var str = '';
                var arr = [];
                for(var i=0;i<result.length;i++){
                    arr.push(result[i]);
                }
                //获取所有角色的权限
                getPower(arr);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取权限类型
    function getPower(arr){
        var prm = {
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetCKRelations',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                resArr.length = 0;
                var existArr = [];
                var role = $('.active11').attr('data-bm');
                for(var i=0;i<result.length;i++){
                    resArr.push(result[i]);
                    if( role == result[i].roleNum ){
                        existArr.push(result[i].resNum)
                    }
                }
                var str = '';
                for(var i=0;i<arr.length;i++){
                    for(var j=0;j<existArr.length;j++){
                        if(arr[i].storageNum == existArr[j]){
                            arr[i].aa=true;

                        }
                    }
                    if(arr[i].aa){
                        str += '<li style="background:rgb(251, 236, 136)" data-bh="' + arr[i].storageNum +
                            '"><div class="checker"><span class="checked"><input type="checkbox"></span>' +
                            '</div><div style="display: inline-block;margin-left: 10px;">' + arr[i].storageName + '</div></li>';
                    }else{
                        str += '<li style="background:#ffffff" data-bh="' + arr[i].storageNum +
                            '"><div class="checker"><span><input type="checkbox"></span>' +
                            '</div><div style="display: inline-block;margin-left: 10px;">' + arr[i].storageName + '</div></li>';
                    }
                }
                $('.power-right').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
})