/**
 * Created by went on 2016/9/18.
 * 能耗分项类型的选择器
 */

var ETSelection = function(){
    //设置楼宇相关的能耗种类
    //$divETs：外层的div容器
    //divETCssClassName:div的css类名，必须是flex排布，如果没有此参数，则直接添加flex样式
    //etCallBack：点击每个分类时候的回调函数
    this.initPointers = function($divETs,divETCssClassName,etCallBack){
        var strEnergyType = sessionStorage.allEnergyType;
        if(!strEnergyType) { return ;}
        var allEnergyType = JSON.parse(strEnergyType);
        this.initETSel(allEnergyType,$divETs,divETCssClassName,etCallBack);
    }
    //设置分户相关的能耗种类
    //$divETs：外层的div容器
    //divETCssClassName:div的css类名，必须是flex排布，如果没有此参数，则直接添加flex样式
    //etCallBack：点击每个分类时候的回调函数
    this.initOffices = function($divETs,divETCssClassName,etCallBack){
        var strEnergyType = sessionStorage.officeEnergyType;
        if(!strEnergyType){
            return;
        }
        var officeEnergyType = JSON.parse(strEnergyType);
        this.initETSel(officeEnergyType,$divETs,divETCssClassName,etCallBack);
    }

    this.initETSel = function(allEnergyType,$divETs,divETCssClassName,etCallBack){
        $divETs.empty();
        if(divETCssClassName){
            $divETs.addClass(divETCssClassName);
        }else{
            $divETs.css("display" ,"flex");
            $divETs.css("display" ,"-webkit-flex");
            $divETs.css("flex-direction" ,"row");
            $divETs.css("align-items" ,"center");
            $divETs.css("-webkit-align-items" ,"center");
            $divETs.css("justify-content" ,"space-around");
            $divETs.css("-webkit-justify-content" ,"space-around");
        }
        var allTypes = allEnergyType.alltypes;      //获取全部的能耗分类数组
        this._allEnergyTypes = allTypes;
        for(var i=0; i<allTypes.length;i++){
            var $div = $("<div>");
            $div.css({
                "width" : "120px",
                "height" : "70px",
                "cursor" : "pointer"
            });
            if(allTypes[i].img2){
                $div.css("background","url(../resource/img/" + allTypes[i].img2 + ")no-repeat");
            }
            $div.css("background-size","50px");
            $div.css("background-position","top center");

            $div.attr("value",allTypes[i].ettype);

            var $p = $("<p>");
            $p.css("margin-top","50px");
            $p.css("text-align","center");
            $p.html('<span>'+allTypes[i].etname+'</span>')
            $div.append($p);

            $div.on("click",function(){     //设置能耗分类的点击事件
                var $this = $(this);
                $this.css("border","solid 2px #d64635");
                $this.addClass("selectedEnergy");
                $this.siblings().css("border",'');
                $this.siblings().removeClass("selectedEnergy");
                if(etCallBack){
                    etCallBack();
                }
            });
            if(i==0){       //默认选中第一个分类
                $div.addClass("selectedEnergy");
                $div.css("border","solid 2px #d64635");
            }
            $divETs.append($div);
        }
    }
}

