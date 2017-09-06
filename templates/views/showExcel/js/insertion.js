/**
 * Created by admin on 2017/9/6.
 */
$(document).ready(function(){


    insertionPointer();
    //给页面动态插入显示楼宇的树状图
    function insertionPointer(){
        //判断是否需要显示楼宇
        var _isShowPointer = sessionStorage.getItem('menuArg');

        //如果不需要显示，终止函数
        if(_isShowPointer == 1){
            return false;
        }

        //上方控制开关
        var buttonHtml = '   <div class="toolContainer"  style="width:185px; height:34px;background:white;box-shadow: 1px 2px 1px rgba(0,0,0,.15);color:#4c4c4c;background-color: #f1f1f1;position: fixed;right:80px;top:180px;">' +
            '       <div id="onOff" style="0px 1.5px no-repeat;">' +
            '           楼宇列表开关' +

            '   </div>';
        $('body').append(buttonHtml);

        //下方楼宇列表
        var html = ' <div class="left-middle-main" style="width:250px;position: fixed;height:500px;right:80px;top:220px;border:1px solid #999;overflow-y: auto;background:#f1f1e3;box-shadow: 1px 2px 1px rgba(0,0,0,.15);display: none" id="add-point-byBEE">' +
            '     <div class="left-middle-content" style="width:100%;margin-top:0">' +
            '         <div class="left-middle-tab" style="width:100%;text-align: center;height:30px;">区域位置</div>' +
            '     </div>' +
            '     <div class="tree-1 tree-3" style="background:none">' +
            '         <div class="left-middle-input">' +
            '             <input type="tplaceholder="搜索...">' +
            '         </div>' +
            '         <div class="tipess"></div>' +
            '         <ul class="allPointer ztree" id="allPointer">' +
            '         </ul>' +
            '     </div>' +
            ' </div>';

        $('body').append(html);

        //获取楼宇列表
        _objectSel = new ObjectSelection();
        _objectSel.initPointers($("#allPointer"),true,false,true);

        //搜索功能（楼宇）
        var objSearchs = new ObjectSearch();
        objSearchs.initPointerSearch($("#keys"),$(".tipess"),"allPointer");

        //上方开关绑定事件
        $('#onOff').off('click');
        $('#onOff').on('click',function(){

            if($('#add-point-byBEE').is(':hidden')){

                $('#onOff').css({
                    background:'url("img/offs.png") no-repeat 0 1.5px'
                })
                $('#add-point-byBEE').show();

            }else{

                $('#onOff').css({
                    background:'url("img/off.png") no-repeat 0 1.5px'

                })
                $('#add-point-byBEE').hide();
            }
        })
    }


});
