$(function(){
    //点击箭头移动
    $('.showOrHidden').click(function(){
        var o1 = $(".content-main-left").css("display");
        if(o1 == 'block'){
            $('.content-main-left').hide()
            $('.content-main-right').removeClass('col-lg-9 col-md-8').addClass('col-lg-12 col-md-12');
            $('.showOrHidden').css({
                'background':'url("./work_parts/img/show.png")no-repeat',
                'background-size':'20px',
                'background-position':'center'
            })
        }else if(o1 == 'none'){
            $('.content-main-left').show();
            $('.content-main-right').removeClass('col-lg-12 col-md-12').addClass('col-lg-9 col-md-8');
            $('.showOrHidden').css({
                'background':'url("./work_parts/img/hidden.png")no-repeat',
                'background-size':'20px',
                'background-position':'center'
            })
        }
    });

    addSearchBox();


});

//搜索楼宇时
$(document).on('keyup','.input-search-value',function(){

    for(var i=0; i<$('#selectPointer option').length; i++){

        $('#selectPointer option').eq(i).css({
            display:'inline-block'
        });

    }
    //获取要搜索的内容
    var that = $('.input-search-value');

    var searchValue = that.val();

    for(var i=0; i<$('#selectPointer option').length; i++){


        var theValue = $('#selectPointer option').eq(i).text();

        //判断是否展示
        if(theValue.indexOf(searchValue) == -1){

            console.log(444);

            $('#selectPointer option').eq(i).css({
                display:'none'
            });
        }
    }

});

function addSearchBox(){

    //判断是否存在楼宇select列表
    if($('#selectPointer')){

        var html = '<input type="text" placeholder="请输入楼宇名称搜索" class="input-search-value form-control" style="height:30px !important; margin-bottom:5px;">';

        //给楼宇列表上方增加搜索框
        $('#selectPointer').before(html);

        $('#selectPointer').css({
            marginTop:'0px'
        })

    }
}



