/* 用到的一些变量 */
var Zhong = {
	myDian: 1,
	status: 1,
	ff: 1,
	name: ""
};
/* 获取当前登录的用户名 */

$(document).ready(function() {
	/* 查看关注好友列表 */
	$(".sec").click(function() {
		if(Zhong.ff === 1) {
			
		var t=new XMLHttpRequest,
   				obj;
   			t.onreadystatechange=function() {
   				if(t.readyState==4&&t.status==200)
   				{
   					obj=JSON.parse(this.responseText);
   					var len = obj.length;
   					var b = document.querySelectorAll(".haoyou");
   					
   					for(var j=0; j < len; ++j) {
   						$(".guan-zhu").append("<li class=\"haoyou\">"+obj[j].name+"</li>");
   						
   					}
   					
   				}
   			}
   			t.open("GET","/blog/Fwl.do",true);
   			t.send();
   			
   			Zhong.ff = 0;
		}
		
		
		if(Zhong.myDian === 1)
		{
			$("#xiaLa").css({"transform":"rotate(90deg)"});
			Zhong.myDian = 0;
			document.querySelector(".guan-zhu").style.visibility = "visible";
			
			
		}
		else 
		{
			$("#xiaLa").css({"transform":"rotate(0deg)"});
			Zhong.myDian = 1;
			document.querySelector(".guan-zhu").style.visibility = "hidden";
			
			
		}
		
		
		
	});
	

});

/* 查看主页，也就是热门内容 */


/* 页面加载事件 */
   window.onload = function() {
   	
   		var t=new XMLHttpRequest,
   				obj,
   				a=[];
   			t.onreadystatechange=function() {
   				if(t.readyState==4&&t.status==200)
   				{
   					obj=JSON.parse(this.responseText);
 					var zhu = document.querySelectorAll(".remen");
   					var touxiang = document.querySelectorAll(".remen-inner");
   					var id = document.querySelectorAll(".my-id")
   					var name = document.querySelectorAll(".name");
   					var time = document.querySelectorAll(".time");
   					var content = document.querySelectorAll(".remen-inner p");
   					var zhuan = document.querySelectorAll(".zhuan");
   					var ping = document.querySelectorAll(".ping");
   					var dian = document.querySelectorAll(".dian");
   					
   					for(var j = 0; j < obj.length; ++j) {
   						a.push(obj[j].nickName);
   					}
   					
					
   					
   					for(var i=0; i<10; ++i) {
   					if(a.indexOf(a[i]) == i)
   						touxiang[i].style.backgroundImage = "url(/blog/sina/img/main_images/"+i+".png)";
   						else 
   						touxiang[i].style.backgroundImage = "url(/blog/sina/img/main_images/"+a.indexOf(a[i])+".png)";
   						
   						id[i].innerHTML = obj[i].userid;
   						name[i].innerHTML = obj[i].nickName;
   						time[i].innerHTML = obj[i].createTime;
   						content[i].innerHTML = obj[i].content;
   						zhuan[i].innerHTML = obj[i].repostCount;
   						ping[i].innerHTML = obj[i].commentCount;
   						dian[i].innerHTML = obj[i].upvoteCount;
						   
						   
						if(obj[i].isFrd == false && obj[i].userid !== JSON.parse(sessionStorage.getItem(sessionStorage.key(0))).userId) {
							$(zhu[i]).append("<img src=\"img/main_images/加好友.png\" alt=\"加关注\" onclick=\"guan(event)\"/>");

						}
   						
   					}
   					
   				}
   			}
   			t.open("POST","/blog/View.do",true);
   			t.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			 t.send("page=1"+"&ishot=true");
			   
   }

       /* 发微博模块 */
		$("#myInput").bind('input propertychange',function() {
	var text = $("#myInput").val();
	if(!text) {
		document.querySelector("#myFa").style.disabled = "disabled"
	}
	else {
		document.querySelector("#myFa").removeAttribute("disabled");
	}
});
		/* 点击发布按钮事件 */
		document.querySelector("#myFa").onclick = function() {
			var c = document.querySelector("#myInput");
	   		var t=new XMLHttpRequest,
   				obj;
   			t.onreadystatechange=function() {
   				if(t.readyState==4&&t.status==200)
   				{
   					obj=JSON.parse(this.responseText);

   				}m
   			}
   			t.open("POST","/blog/Pub.do",true);
   			t.setRequestHeader("Content-type","application/x-www-form-urlencoded");
   			t.send("content="+c.value);
   			
   			document.querySelector("#myInput").value = '';
   			document.querySelector("#faSuccess").style["animation-name"] = "zoom";
   			
	
};

document.querySelector(".he2 a").onclick = function() {
	
	    Zhong.name = '';
		Zhong.status = 0;
		var t=new XMLHttpRequest,
   				obj,
   				a=[];
   			t.onreadystatechange=function() {
   				if(t.readyState==4&&t.status==200)
   				{
   					obj=JSON.parse(this.responseText);
   					
   					var touxiang = document.querySelectorAll(".remen-inner");
   					var id = document.querySelectorAll(".my-id")
   					var name = document.querySelectorAll(".name");
   					var time = document.querySelectorAll(".time");
   					var content = document.querySelectorAll(".remen-inner p");
   					var zhuan = document.querySelectorAll(".zhuan");
   					var ping = document.querySelectorAll(".ping");
   					var dian = document.querySelectorAll(".dian");
   					
   					for(var j = 0; j < obj.length; ++j) {
   						a.push(obj[j].nickName);
   					}
   					
   					for(var i=0; i<10; ++i) {
   						if(a.indexOf(a[i]) == i)
   						touxiang[i].style.backgroundImage = "url(/blog/sina/img/main_images/"+i+".png)";
   						else 
   						touxiang[i].style.backgroundImage = "url(/blog/sina/img/main_images/"+a.indexOf(a[i])+".png)";
   						
   						id[i].innerHTML = obj[i].userid;
   						name[i].innerHTML = obj[i].nickName;
   						time[i].innerHTML = obj[i].createTime;
   						content[i].innerHTML = obj[i].content;
   						zhuan[i].innerHTML = obj[i].repostCount;
   						ping[i].innerHTML = obj[i].commentCount;
   						dian[i].innerHTML = obj[i].upvoteCount;
   						
   					}
   					
   				}
   			}
   			t.open("POST","/blog/View.do",true);
   			t.setRequestHeader("Content-type","application/x-www-form-urlencoded");
   			t.send("page=1&ishot=false");
	
};

function my(r) {
			Zhong.status = 0;
			
			var id = r.parentNode.childNodes[5].innerHTML;
			Zhong.name = id;

		var t=new XMLHttpRequest,
   				obj,
   				a=[];
   			t.onreadystatechange=function() {
   				if(t.readyState==4&&t.status==200)
   				{
   					obj=JSON.parse(this.responseText);
   					var touxiang = document.querySelectorAll(".remen-inner");
   					
   					var id = document.querySelectorAll(".my-id")
   					var name = document.querySelectorAll(".name");
   					var time = document.querySelectorAll(".time");
   					var content = document.querySelectorAll(".remen-inner p");
   					var zhuan = document.querySelectorAll(".zhuan");
   					var ping = document.querySelectorAll(".ping");
   					var dian = document.querySelectorAll(".dian");
   					
   					for(var j = 0; j < obj.length; ++j) {
   						a.push(obj[j].nickName);
   					}
   					
   					for(var i=0; i<10; ++i) {
   						if(a.indexOf(a[i]) == i)
   						touxiang[i].style.backgroundImage = "url(/blog/sina/img/main_images/"+i+".png)";
   						else 
   						touxiang[i].style.backgroundImage = "url(/blog/sina/img/main_images/"+a.indexOf(a[i])+".png)";
   						
   						id[i].innerHTML = obj[i].userid;
   						name[i].innerHTML = obj[i].nickName;
   						time[i].innerHTML = obj[i].createTime;
   						content[i].innerHTML = obj[i].content;
   						zhuan[i].innerHTML = obj[i].repostCount;
   						ping[i].innerHTML = obj[i].commentCount;
   						dian[i].innerHTML = obj[i].upvoteCount;
   						
   					}
   					
   				}
   			}
   			t.open("GET","/blog/View.do?page=1&ishot=false&name="+id,true);
   			t.send();									
};
/* 加关注功能模块 */
	function guan(e) {
		e.target.style.transform = 'scale(0)';
		var m = e.target.parentNode.childNodes[1].childNodes[5].innerHTML;
		var t=new XMLHttpRequest,
					obj;
				t.onreadystatechange=function() {
					if(t.readyState==4&&t.status==200)
					{
						obj = JSON.parse(this.responseText);
						if(obj.code == 2001) {
							
						} else {
							alert("关注失败！");
						}
					}
				}
				t.open("POST","/blog/AddFwl.do",true);
				t.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				t.send("followId="+m);
		};





