// $.validator.setDefaults({
//     submitHandler: function() {
//       alert("提交事件!");
//     }
// });
// $().ready(function() {
// // 在键盘按下并释放及提交后验证提交表单
  
// });
$("#signupForm").validate({
	    rules: {
	      firstname: "required",
	    },
	    messages: {
	      firstname: "请输入--------------",
	    }
	});
$('#chuangjian').on('click',function(){
	
	$("#signupForm").valid()
})