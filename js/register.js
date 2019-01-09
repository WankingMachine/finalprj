function register() {
	document.querySelector(".register").style.display="block";
}

function closeInner()
{
	document.querySelector(".register").style.display="none";
	
}
// 存储公钥
var gg = null;

window.onload = function() {
	var t=new XMLHttpRequest;
		t.onreadystatechange=function() {
		if(t.readyState==4&&t.status==200)
		{
			gg=JSON.parse(this.responseText).publicKey;
		}
		}
		t.open("GET","/blog/security/publicKey",true);
		t.send();
}



function encryptRequest(data, publicKey) {

	var encrypt = new JSEncrypt();
	encrypt.setPublicKey(publicKey);
	// ajax请求发送的数据对象
	var sendData = new Object();
	// 将data数组赋给ajax对象
 	 for (var key in data) { 
		sendData[key] = encrypt.encrypt(data[key]);
	 }  

 
 	$.ajax({
		url: "/blog/signUp",
		type: 'post',
		data: sendData,
		dataType: 'json',
		//contentType: 'application/json; charset=utf-8',
		success: function (data) {

			if(data.code == 2001) {
				alert("注册成功！");
				closeInner();
			}
			else if(data.code == 4002) {
				alert("账户名或密码错误！");
			}
			else if(data.code == 5001) {
				alert("服务器错误！");
			}
			else if(data.code == 6003) {
				alert("账号已被注册！");
			}
		},
		error: function (xhr) {
			//console.error('出错了');
		}
	});  
}

function myRegister() {
	var data = {};
data['userId'] = document.querySelector("#register-name").value;
data['nickName'] = document.querySelector("#register-mingzi").value;
data['password'] = document.querySelector("#register-pas").value;
	encryptRequest(data,gg);
	
}