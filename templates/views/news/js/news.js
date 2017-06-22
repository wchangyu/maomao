$(function(){
    $('.loading').showLoading();
    /*-------------------------------全局变量-------------------------------*/
    var _userIdName = sessionStorage.getItem('userName');
    var _url = sessionStorage.getItem('apiUrlPrefix');
    //存放所有新闻的数组
    var _allNewsArr = [];
    //轮播图
    $('#myCarousel').carousel({
        interval: 2000
    })
    //今日/聚焦
    $('.tab-block').on('click','li',function(){
        tabToggle($(this),'tab-active','news-content-active');
    })
    //法规/政策
    $('.fgcontent').on('click','li',function(){
        tabToggle($(this),'tab-active-bottom','news-content-active');
    })
    //tab选项卡方法
    function tabToggle($this,liActive,conActive){
        $this.parent('ul').children().removeClass(liActive);
        $this.addClass(liActive);
        var tab_content = $this.parents('ul').parent().next().children();
        tab_content.removeClass(conActive);
        tab_content.eq($this.index()).addClass(conActive);
    }
    //获取首页
    $.ajax({
        type:'get',
        url: _url + 'News/GetAllNewsTypeContent',
        timeout:30000,
        success:function(result){
            getPZ();
            _allNewsArr = [];
            for(var i= 0;i<result.length;i++){
                _allNewsArr.push(result[i]);
            }
            //获取推荐轮播图块
            $.ajax({
                type:'get',
                url:_url + 'News/GetRecommendNews',
                success:function(result){
                    //创建轮播图
                    var heightArr = [];
                    for(var i=0;i<4;i++){
                        var imgurl = result[i].f_RecommImgName.split('\\');
                        $('.carousel-inner').find('.item').eq(i).children('.img').css({'background':'url(' + imgurl[0] + '/' + imgurl[1] + '/' + imgurl[2] + ') no-repeat','background-position':'center','background-size':'contain'});
                        $('.carousel-inner').find('.item').children('.carousel-caption').eq(i).html(result[i].f_NewsTitle);
                        $('.carousel-inner').find('.item').eq(i).attr('href','./news-4.html?id=' + result[i].pK_NewsID + '&come=1');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    var info = JSON.parse(jqXHR.responseText).message;
                    moTaiKuang($('#myModal'),info);
                }
            })
        },
        error:function(jqXHR, textStatus, errorThrown){
            var info = JSON.parse(jqXHR.responseText).message;
            moTaiKuang($('#myModal'),info);
        }
    })
    /*-------------------------------------------其他的方法---------------------------------*/
    //获取首页配置
    function getPZ(){
        $.ajax({
            type:'get',
            url:_url + 'News/GetNewsPageConfig',
            success:function(result){
                //右上
                creatEle(result,'row1Col2s',$('.tab-block'),$('.news-content-list'),'flag');
                //左下
                var aa = $('.bottom-block').children('.left-block').find('.fgcontent');
                var bb = $('.bottom-block').children('.left-block').find('.news-word');
                creatEle(result,'row2Col1s',aa,bb);
                //右下
                var cc = $('.bottom-block').children('.right-block').find('.fgcontent');
                var dd = $('.bottom-block').children('.right-block').find('.news-word');
                creatEle(result,'row2Col2ds',cc,dd);
                //给第一个li加样式（右上）
                $('.tab-block').find('li').eq(0).addClass('tab-active');
                //给第一个content加样式（右上）
                $('.news-content').eq(0).addClass('news-content-active');
                //给第一个li加样式（左下）
                aa.find('li').eq(0).addClass('tab-active-bottom');
                //给第一个content加样式（左下）
                bb.children('.news-content').eq(0).addClass('news-content-active');
                //给第一个li加样式（右下）
                cc.find('li').eq(0).addClass('tab-active-bottom');
                //给第一个content加样式（右下）
                dd.children('.news-content').eq(0).addClass('news-content-active');
                $('.loading').hideLoading();
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                moTaiKuang($('#myModal'),info);
            }
        })
        //动态创建list方法
        function creatEle(result,attr,liBlock,ulList,flag){
            for(var i=0;i<result[attr].length;i++){
                //创建tab li 的字符串
                var topRightLi = '';
                //创建相应的tab content的字符串
                var topRightContent = '';
                //存放通过的数组
                var arr = [];
                for(var j=0;j<_allNewsArr.length;j++){
                    if(_allNewsArr[j].pK_NewsType == result[attr][i]){
                        //创建选项卡
                        topRightLi += '<li>' + _allNewsArr[j].f_NewsTypeName + '</li>';
                        liBlock.append(topRightLi);
                        //创建内容页
                        topRightContent += '<ul class="news-content"></ul>';
                        ulList.append(topRightContent);
                        //创建content中的li新闻列表
                        var newsList = '';
                        if(flag){
                            var lengths = 0
                            if(_allNewsArr[j].newsContents.length>10){
                                lengths = 10;
                            }else{
                                lengths = _allNewsArr[j].newsContents.length;
                            }
                            for(var z=0;z<lengths;z++){
                                newsList = ''
                                newsList += '<li><a href="./news-4.html?id=' + _allNewsArr[j].newsContents[z].pK_NewsID + '&come=1' +
                                    '"><h3>' + _allNewsArr[j].newsContents[z].f_NewsTitle + '</h3></a><h4>'+_allNewsArr[j].newsContents[z].f_NewsDesc +'</h4></li>';
                                ulList.find('.news-content').eq(i).append(newsList);
                            }
                        }else{
                            for(var z=0;z<_allNewsArr[j].newsContents.length;z++){
                                newsList = ''
                                newsList += '<li><a href="./news-4.html?id=' + _allNewsArr[j].newsContents[z].pK_NewsID + '&come=1' +
                                    '"><h3>' + _allNewsArr[j].newsContents[z].f_NewsTitle + '</h3></a></li>';
                                ulList.find('.news-content').eq(i).append(newsList);
                            }
                        }

                    }
                }

            }
        }
    }
    //模态框
    function moTaiKuang(who,meg){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        who.find('.modal-body').html(meg);
    }
})