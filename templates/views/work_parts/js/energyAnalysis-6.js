$(function(){
    //读取能耗种类
    _energyTypeSel = new ETSelection();
    _energyTypeSel.initPointers($(".energy-types"),undefined,function(){
    });
    //对象选择
    $('.left-middle-tab').eq(0).click(function(){
        $('.left-middle-tab').css(
            {
                'background':'#fff',
                'color':'#333'
            }
        )
        $(this).css({
            'background':'#7f7f7f',
            'color':'#fff'
        })
        $('.tree-1').hide();
        $('.tree-3').show();

    });
    $('.left-middle-tab').eq(1).click(function(){
        $('.left-middle-tab').css(
            {
                'background':'#fff',
                'color':'#333'
            }
        )
        $(this).css({
            'background':'#7f7f7f',
            'color':'#fff'
        })
        $('.tree-1').hide();
        $('.tree-2').show();
    });
    //读取楼宇和科室的zTree；
    _objectSel = new ObjectSelection();
    _objectSel.initPointers($("#allPointer"),false,true);
    _objectSel.initOffices($("#allOffices"),true);
    //搜索框功能
    var objSearch = new ObjectSearch();
    objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
})