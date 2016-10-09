$(function (){
    $('.aaa').click(function(){
        var ddd = $('<div class="specificInformationClose">');
        var ccc = $('<div class="specificInformation">');
        $('.total-wrap').append(ccc);
        ccc.append(ddd);
        ddd.click(function(){
            ccc.hide();
        })
    })
})