/**
 * Created by admin on 2017/11/5.
 */
//获取刷新数据时间
refreshTime = 60000;
if(sessionStorage.gongdanInterval && sessionStorage.gongdanInterval!='0'){
    refreshTime = (sessionStorage.gongdanInterval) * 60 * 1000;
}