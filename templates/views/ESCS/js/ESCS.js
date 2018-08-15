//生成表头的信息
$(function(){

    //日期
    var data = '<li style="color:#ccc;line-height:46px;margin-right:20px;font-size:14px;">' +
               '<span id="loginDT"></span>' +
               '<span id="loginWk"></span>' +
               '</li>';

    //当前的楼宇
    var pointer = '<li style="color:#ccc;line-height:46px;margin-right:20px;font-size:14px;">' +
                  '<span id="poNT"></span>' +
                  '</li>';

    //当前温度
    var temperature = '<li style="color:#ccc;line-height:46px;margin-right:20px;font-size:14px;display:block;">' +
                      '温度：<span id="gltn">0.0</span>' +
                      '<span style="margin-left:2px;">℃</span>' +
                      '</li>';

    //当前湿度
    var humidity = '<li style="color:#ccc;line-height:46px;margin-right:20px;font-size:14px;display:block;">' +
                   '湿度：<span id="glhn">0.0</span>' +
                   '<span style="margin-left:2px;">%</span>' +
                   '</li>';

    //报警
    var alarm = '<li class="dropdown dropdown-extended dropdown-notification" title="数据报警">' +
                '<a href="" class="dropdown-toggle">' +
                '<i class="icon-bell"></i>' +
                '<span class="badge badge-default" id="alertNumber">' +
                ' 0' +
                '</span>' +
                '</a>' +
                '<ul class="dropdown-menu" role="menu"></ul>' +
                '</li>';

    //楼宇切换
    var switchingPointer = '<li class="dropdown dropdown-extended dropdown-inbox" title="切换楼宇">' +
                            '<a id="eprswitchBtn" href="javascript:;" class="dropdown-toggle">' +
                            '<i class="glyphicon glyphicon-list-alt"></i>' +
                            '</a>' +
                            '<ul class="dropdown-menu">' +
                            '<li></li>' +
                            '</ul>' +
                            '</li>';

    var str = data + pointer + temperature + humidity + alarm + switchingPointer

    //插入dom中
    $('.dropdown-user').before(str);


})