
$(document).ready(function() {
// 	$("#ceshi").click(function() {
// 		var t=new XMLHttpRequest,
// 		 	obj;
// 		t.onreadystatechange=function() {
// 			if(t.readyState==4&&t.status==200)
// 			{
// 				obj=JSON.parse(this.responseText);
// 				document.getElementById("userID").value=obj.name;
// 				document.getElementById("userPassWord").value=obj.password;
// 			}
// 		}
// 		t.open("GET","json/ceshi.json",true);
// 		t.send();

});
// 	$("#regBut").click(function() {
// 		$.ajax({
// 			type:"post",
// 			url:"",
// 			data: 
// 			dataType: "json",
// 			success: function(msg) {
// 				alert(typeof msg.name);
// 			}
// 		});
// 
// });
		
	
	$("#zhanghao").click(function()
	{
		$("#zhanghao").css(
		{
			"border-bottom":"3px solid #fa7d3c",
			"color":"#0f1012"
		});
		$("#anquan").css(
			{
			"border-bottom":"1px solid #f2f2f5",
			"color":"#999"
				
			}
		);
		
	});
	$("#anquan").click(function()
	{
		$("#zhanghao").css(
		{
			"border-bottom":"1px solid #f2f2f5",
			"color":"#999"
			
		});
		$("#anquan").css(
			{
			"border-bottom":"3px solid #fa7d3c",
			"color":"#0f1012"
			}
		);
		
	});

	
	$("#userID").focus(function()
	{
		$(".yonghuming").css("border-color","#eb7350");
		$(".biaodan").css("box-shadow","0 4px 10px 0 rgb(0,0,0,0.6)");
		
	});
	$("#demo").hover(function()
	{
		$("#demo").css("box-shadow","0 4px 10px 0 rgb(0,0,0,0.6)");
	});
	$("#demo").mouseleave(function()
	{
		$("#demo").css("box-shadow","none");
	});


	
	
		
	$("#userID").blur(function()
	{
		$(".yonghuming").css("border-color","#cfcfcf");
	});
		$("#userPassWord").focus(function()
	{
		$(".mima").css("border-color","#eb7350");
	});
	
		
	$("#userPassWord").blur(function()
	{
		$(".mima").css("border-color","#cfcfcf");
		$(".biaodan").css("box-shadow","none");
	});
	$(".biaodan").blur(function()
	{
		$(".biaodan").css("box-shadow","none");
	});
	



   $("#anquan").click(function(){
   	$(".biaodankuang2").css({
   		"display":"none"
   		
   	});
   	
   	$(".erwei").css(
   		{
   			"display":"inline-block"
   		}
   	);
   	$(".kuang").css({
   		"background-color": "#f2f2f5"
   	});
   });
    $("#zhanghao").click(function(){
   	$(".biaodankuang2").css({
   		"display":"block"
   		
   	});
   	$(".erwei").css(
   		{
   			"display":"none"
   		}
   	);
   	$(".kuang").css({
   		"background-color": "white"
   	});
   });


function myLogin() {

		// 保存公钥
		var publicKey = null;
	// 设置一个Promise对象，保证异步操作的顺序执行
	var pro = new Promise(function(resolve) {



	// 请求公钥

 	var t=new XMLHttpRequest;
	t.onreadystatechange=function() {
	if(t.readyState==4&&t.status==200)
	{
		publicKey=JSON.parse(this.responseText).publicKey;
		resolve();
	}
	}
	t.open("GET","/blog/security/publicKey",true);
	t.send(); 

	});

	pro.then(function() {
		var data = {};
		data['userId'] = document.querySelector("#userID").value;
		data['password'] = document.querySelector("#userPassWord").value;
	
		encryptLogin(data,publicKey); 

	});

}


function encryptLogin(data, publicKey) {

	var encrypt = new JSEncrypt();
	console.log(publicKey);
	encrypt.setPublicKey(publicKey);
	// ajax请求发送的数据对象
	var sendData = new Object();
	// 将data数组赋给ajax对象
 	 for (var key in data) { 
		sendData[key] = encrypt.encrypt(data[key]);
	 }  

 
  	$.ajax({
		url: "/blog/signIn",
		type: 'post',
		data: sendData,
		dataType: 'json',
		//contentType: 'application/json; charset=utf-8',
		success: function (data) {

			if(data.code == 2001) {
				var userId = data.user.userId;
				console.log(data);
				sessionStorage.setItem(userId,JSON.stringify(data.user));
				window.location.href = '../main.html'; 

			}
			else if(data.code == 4002) {
				alert("账户名或密码错误！");
			}
			else if(data.code == 5001) {
				alert("用户名错误！");
			}
		},
		error: function (xhr) {
			//console.error('出错了');
		}
	});   
}
	






