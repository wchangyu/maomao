$(function(){
    $('.right-top:eq(0)').show();
    $('.right-top:eq(1)').hide();
    $('.btn1').click(function(){
        if($('.radio:eq(0) .checked').length != 0 ){
            //alert(1)
            $('.right-top:eq(0)').show();
            $('.right-top:eq(1)').hide();
        }else if($('.radio:eq(0) .checked').length ==0){
            //alert(2)
            $('.right-top:eq(1)').show();
            $('.right-top:eq(0)').hide();
        }
    })

})