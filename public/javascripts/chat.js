var sayCount=0;//统计发言条数
var socket=io.connect('http://testland.orientsoft.cn:8000');

//获取当前时间
function now() {
    var date = new Date();
    var time = ' '+date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
    return time;
}


socket.on('usernum',function(data){
    $("#usernum").html("当前连接人数:" + data.number);
});
var from= $.cookie('user');//从cookie中读取用户名，存于变量from
socket.emit('online',{user:from});
socket.on('online', function (data) {
    if(data.user!=from){
        var massage = '<div style="color: red;">系统提醒：' +now()+' ('+data.user +') 上线了！</div>';
    } else {
        var massage = '<div style="color: red;">系统提醒：'+ data.user +',欢迎你进入聊天室！现在你可以和大家聊天了！！！</div>';
    }
    $("#right2").append(massage+"<br/>");
    //刷新用户在线列表
    flushUsers(data.users);
});
//当接收到消息的时候，使聊天窗口打滚动条一直处于最下面
socket.on('online',function scrollWindow(){
    document.getElementById("right2").scrollTop=10000;
    setTimeout("scrollWindow()",1000);
});
//监听say这个事件，如果有人说话，就将所说内容显示出来
socket.on('say', function (data) {
    //对所有人说
    $("#right2").append('<div>(' + data.from + '['+data.sayCount+']'+')'+now()+'</div>');
    $("#right2").append('<div style="color: greenyellow;font-size: large">' + data.msg + '</div><br/>');


});
//当接收到消息的时候，使聊天窗口打滚动条一直处于最下面
socket.on('say',function scrollWindow(){
    document.getElementById("right2").scrollTop=10000;
    setTimeout("scrollWindow()",1000);
});
//如果服务器关闭
socket.on('disconnect', function() {
    var sys = '<div style="color:red;">系统提醒：服务器连接失败（可能服务器已经关闭）！</div>';
    $("#right2").append(sys + "<br/>");
    $("#left3").empty();
    $("#usernum").html("当前连接人数:" + 0);
});
//当接收到系统关闭的消息的时候，使聊天窗口打滚动条一直处于最下面
socket.on('disconnect',function scrollWindow(){
    document.getElementById("right2").scrollTop=10000;
    setTimeout("scrollWindow()",1000);
});
//重新启动服务器
socket.on('reconnect', function() {
    var sys = '<div style="color: red;">系统提醒：重新连接服务器！</div>';
    $("#right2").append(sys + "<br/>");
    socket.emit('online', {user: from});
    //刷新用户在线列表
    flushUsers(data.users);
});
//当接收到系统重新启动的消息的时候，使聊天窗口打滚动条一直处于最下面
socket.on('reconnect',function scrollWindow(){
    document.getElementById("right2").scrollTop=10000;
    setTimeout("scrollWindow()",1000);
});
//监听offline这个事件，如果有人下线，也提示下线消息
socket.on('offline',function(data){
    var sys = '<div style="color:red;">系统提醒：'+now() +' ('+data.user + ') 下线了！</div>';
    $("#right2").append(sys + "<br/>");
    //刷新用户在线列表
    flushUsers(data.users);
});
//当接收到有用户下线的消息的时候，使聊天窗口打滚动条一直处于最下面
socket.on('offline',function scrollWindow(){
    document.getElementById("right2").scrollTop=10000;
    setTimeout("scrollWindow()",1000);
});
//编写发送按钮的click事件
$("#say").click(function () {
    var $msg=$("#input_content").html();
    if($msg=="")return;
    sayCount++;
    $("#right2").append('<div>你['+sayCount+ ']'+now()+'</div>');
    $("#right2").append('<div style="color: blue;font-size: large">' + $msg + '</div><br/>');
    //将消息发送给事件say
    socket.emit('say',{from:from,msg:$msg,sayCount:sayCount});
    //清空输入框并获得焦点
    $("#input_content").html("").focus();
});
//当自己发消息的时候，滚动条向下移动
$("#say").click(function scrollWindow(){
    document.getElementById("right2").scrollTop=10000;
    setTimeout("scrollWindow()",1000);
});
//编写清空消息的click事件
$("#clear").click(function(){
    $("#right2").empty();
    $("#right2").html("聊天窗口");
});
//刷新用户在线列表
function flushUsers(users) {
    //先要将好友列表清空
    $("#left3").empty();
    //遍历生成用户在线列表

    for (var i in users) {
        $("#left3").append('<li alt="' + users[i] + ' onselectstart="return false">' + users[i] + '</li>');
    }
}
//编写注销按钮打click事件
$("#logout").click(function(){
    location.href='/';
});

