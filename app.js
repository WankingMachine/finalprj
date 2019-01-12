const Koa = require('koa2')
const fs = require('fs');
const zqj=require('./js/zqj')
var num=BigInt('10000000012');
var wnum=BigInt('50000000000000110');
const GStoreClient = require("./index.js");
const client = new GStoreClient(
    "root",
    "123456",
    "http://162.105.17.43:9000"
  );
const app = new Koa();
const serve = require('koa-static');
const views = require('koa-views');
const router = require('koa-router')();
const users=[];
var bodyParser = require('koa-bodyparser');
app.use(bodyParser());
app.use(views('views',{map:{html:'ejs'}}));
app.use(serve('.'))
app.use(async (ctx,next)=>{
    ctx.state = {
        userName:'张三'
    }
    // 继续向下匹配路由
    await next(); 
});
function message(name,gender,time,fans,fav)
{
    one={};
    one['name']=name;
    one['gender']=gender;
    one['birth']=time;
    one['fans']=fans;
    one['fav']=fav;
    return one;
}
function weibo(name,time,text)
{
    one={};
    one['name']=name;
    one['time']=time;
    one['text']=text;
    return one;
}
function isuser(user)
{
     if(users.includes(user))
     {
        return true;
     }
     else
        return false;
}
router.post('/login',async (ctx,next)=>{
    var user=ctx.request.body.username;
    let pass=ctx.request.body.password;
    var result=await client.query('webo','select ?o where{?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name> 	"'+user+'".}');
    console.log('someone tries to register')
    console.log(user)
    if(result['results']["bindings"].length<1)
    {
        ctx.response.body='fail';
    }
    else{
    var result = await client.query("webo",'select  ?p where{	?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>	"'+user+'".		?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_password>	?p.}');
    if(result["results"]["bindings"][0]["p"]["value"]==pass)
    {
        let cook={
            domain: 'localhost',  // 写cookie所在的域名
            path: '/',       // 写cookie所在的路径
            maxAge: 300000, // cookie有效时长
            expires: new Date('2019-01-30'),  // cookie失效时间
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: true  // 是否允许重写
          };
        ctx.cookies.set('cid',encodeURIComponent(user),cook);
        console.log(encodeURIComponent(user));
          if(!isuser(user))
            users.push(user);
        ctx.response.body='pass';
    }
    else
        ctx.response.body='deny';}
    await next(); 
}
);
router.post('/register',async (ctx,next)=>{
    let user=ctx.request.body.username;
    let pass=ctx.request.body.password;
    var result=await client.query('webo','select ?o where{?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name> 	"'+user+'".}');
    
    console.log('someone tries to register')
    console.log(user)
    if(result['results']["bindings"].length>0)
    {
        ctx.response.body='fail';
    }
    else
    {
        var result = await client.query("webo",'insert data{<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#user/'+num.toString()+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid>	"'+num.toString()+'".<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#user/'+num.toString()+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>	"'+user+'".<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#user/'+num.toString()+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_password>	"'+pass+'".}');
        result = await client.query("webo",'insert data{<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#user/'+num.toString()+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_gender>	"m". 	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#user/'+num.toString()+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_location>	"无". 	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#user/'+num.toString()+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_followersnum>	"0". 	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#user/'+num.toString()+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_favouritesnum>	"0". }');
        ctx.response.body='success';
        num++;
        console.log(num);
    }
    await next(); 
}
)
router.get('/',async (ctx,next)=>{
    let user=ctx.cookies.get('cid');
    user=decodeURIComponent(user);
    await next();
    if(!isuser(user))
    ctx.response.redirect('/login.html')
    else{
    console.log(zqj.gettime());
    let friends=[];
    // friends.push(message('Jing_Mini_Shop','2018年1月1号','我的第一条微博消息!'));
    // friends.push(message('Jing_Mini_Shop','2018年11月3号','IG夺冠了！'));
    // friends.push(message('Jing_Mini_Shop','2018年6月1号','大三大四工程学造型出现在!萨达斯基的哈设计的还看啥'));
    user="Jing_Mini_Shop";
    var result =await client.query("webo",'select ?attentionuser ?weiboid ?text ?data ?dianzan where\
    {\
        ?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>	"'+user+'".	\
        ?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid>	?id.\
        ?relation	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation_suid>	?id.\
        ?relation	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation_tuid>	?attentionId.\
        ?y	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid>	?attentionId.\
        ?y	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>	?attentionuser.\
        ?x	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_uid>	?attentionId.\
        ?x  <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_mid>    ?weiboid.\
	    ?x	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_text>	?text;\
		<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_date>	?data;\
    }'
    );
    result=result["results"]["bindings"];
    index=[]
    for (let i=0;i<result.length;i++)
    {
        index.push([i,parseInt(result[i]["weiboid"]["value"])]);
    }
    user='zqj';
    var result2=await client.query("webo",'select ?text ?weiboid ?data ?dianzan where\
    {\
        ?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>	"'+user+'".\
        ?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid>	?id.\
        ?x	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_uid>	?id.\
        ?x  <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_mid>    ?weiboid.\
        ?x	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_text>	?text;\
            <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_date>	?data;\
    }');
    result2=result2["results"]["bindings"];
    l=result.length;
    for (let i=0;i<result2.length;i++)
    {
        result2[i]['attentionuser']={'value':user};
        result.push(result2[i]);
        index.push([l+i,parseInt(result2[i]["weiboid"]["value"])]);
    }
    index.sort(function(a,b){
        return b[1]-a[1];
    })
    for (let i=0;i<result.length;i++)
    {
            friends.push(weibo(result[index[i][0]]['attentionuser']['value'],result[index[i][0]]["data"]['value'],result[index[i][0]]["text"]['value']));
    }
    let myid=user;
    let owner=true;
    await ctx.render('main',{
        friends,myid,owner
    });
}
});
router.post('/fabu',async (ctx,next)=>{
    let user=ctx.cookies.get('cid');
    let text=ctx.request.body.text;
    let time=zqj.gettime();
    user=decodeURIComponent(user);
    await next();
    if(!isuser(user))
    ctx.response.redirect('/login.html')
    else{
    var id=await client.query('webo','select ?id where\
    {\
        ?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name> 	"'+user+'".\
        ?o  <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid> ?id\
    }')
    var uid=id['results']['bindings'][0]['id']['value'];
    var result=await client.query('webo','insert data{\
        <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#weibo/'+wnum+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_text>	"'+text+'".\
        <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#weibo/'+wnum+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_date>   "'+time+'".\
        <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#weibo/'+wnum+'>   <http://www.w3.org/2000/01/rdf-schema#label>  "weibo #'+wnum+'".\
        <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#weibo/'+wnum+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_mid>	"'+wnum+'".\
        <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#weibo/'+wnum+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_uid>	"'+uid+'".\
        <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#weibo/'+wnum+'>	<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo>.}');
    console.log(zqj.gettime());
    wnum++;
    console.log('有人发布微博');
    console.log(wnum);
    ctx.response.body='pass';
}
});
router.get('/addlist',async (ctx)=>{
    let user=ctx.query['user'];
    console.log(user)
    console.log(zqj.gettime());
    let friends=[];
    friends.push(message('Jing_Mini_Shop','2018年1月1号','我的第一条微博消息!'));
    friends.push(message('Jing_Mini_Shop','2018年11月3号','IG夺冠了！'));
    friends.push(message('Jing_Mini_Shop','2018年6月1号','大三大四工程学造型出现在!萨达斯基的哈设计的还看啥'));
    let myid='zqj';
    let owner=true;
    await ctx.render('addlist',{
        friends,myid,owner
    });
});
// router.post('/info',async (ctx)=>{
//     let user=ctx.request.body.username;
//     console.log('info!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
//     console.log(user)
//     console.log(zqj.gettime());
//     q = 'select ?gender ?loc ?fans ?fav where{?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>    \"'+user+'\".?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_gender>  ?gender.?o  <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_location>    ?loc.?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_followersnum>    ?fans.?o    <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_favouritesnum>   ?fav.}'
//     var result = await client.query("webo",q);
//     console.log(q)
//     console.log(result)
//     // let info=[];
//     // search.push(message('张三','2018年1月1号','我的第一条微博消息!'));
//     //friends.push(message('张三丰','2018年11月3号','IG夺冠了！'));
//     //friends.push(message('张三的爸爸','2018年6月1号','大三大四工程学造型出现在!萨达斯基的哈设计的还看啥'));
//     let friends=[];
//     friends.push(message(user,result["results"]["bindings"][0]["gender"]["value"],result["results"]["bindings"][0]["loc"]["value"],
//         result["results"]["bindings"][0]["fans"]["value"],result["results"]["bindings"][0]["fav"]["value"]));
//     let myid='zqj';
//     let owner=false;
//     let myself = true;
//     let focus = true
//     if (user != myid){
//         myself = false
//     }
//     await ctx.render('info',{
//         friends,myid,owner,myself,focus
//     });
// });
router.get('/info',async (ctx)=>{
    let user=ctx.query['user'];
    console.log('info!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(user)
    console.log(zqj.gettime());
    q = 'select ?gender ?loc ?fans ?fav where{?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>    \"'+user+'\".?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_gender>  ?gender.?o  <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_location>    ?loc.?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_followersnum>    ?fans.?o    <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_favouritesnum>   ?fav.}'
    var result = await client.query("webo",q);
    console.log(q)
    console.log(result)
    // let info=[];
    // search.push(message('张三','2018年1月1号','我的第一条微博消息!'));
    //friends.push(message('张三丰','2018年11月3号','IG夺冠了！'));
    //friends.push(message('张三的爸爸','2018年6月1号','大三大四工程学造型出现在!萨达斯基的哈设计的还看啥'));
    let friends=[];
    friends.push(message(user,result["results"]["bindings"][0]["gender"]["value"],result["results"]["bindings"][0]["loc"]["value"],
        result["results"]["bindings"][0]["fans"]["value"],result["results"]["bindings"][0]["fav"]["value"]));
    let myid='zqj';
    let owner=false;
    let myself = true;
    let focus = true
    if (user != myid){
        myself = false
    }
    await ctx.render('info',{
        friends,myid,owner,myself,focus
    });
});
router.get('/search',async (ctx)=>{
    let user=ctx.query['user'];
    console.log('search!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(user)
    console.log(zqj.gettime());
    var result = await client.query("webo",'select ?gender ?loc ?fans ?fav ?uid where{?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>    \"'+user+'\".?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid>	?uid.?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_gender>  ?gender.?o  <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_location>    ?loc.?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_followersnum>    ?fans.?o    <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_favouritesnum>   ?fav.}');
    let userId = result["results"]["bindings"][0]["uid"]["value"]
    console.log(result)
    let friends=[];
    if (result["results"]["bindings"].length == 0){
    	friends = null
    }else{
	    friends.push(message(user,result["results"]["bindings"][0]["gender"]["value"],result["results"]["bindings"][0]["loc"]["value"],
	        result["results"]["bindings"][0]["fans"]["value"],result["results"]["bindings"][0]["fav"]["value"]));
    }
    // friends.push(message('张三丰','2018年11月3号','IG夺冠了！'));
    // friends.push(message('张三的爸爸','2018年6月1号','大三大四工程学造型出现在!萨达斯基的哈设计的还看啥'));
    var attention = await client.query("webo",'select  ?attentionId where\
{\
	?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>	\"'+user+'\".	\
	?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid>	?id.\
	?relation	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation_suid>	?id.\
	?relation	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation_tuid>	?attentionId.\
}\
'
    );
    console.log(attention)
    let attentionlist = [];
    for (var i=0;i<attention["results"]["bindings"].length;i++)
	{ 
    	attentionlist.push(attention["results"]["bindings"][i]["attentionId"]["value"])
	}
    let focus = false
	if (attentionlist.includes(userId))
		focus = true

    let myid=ctx.cookies.get('cid');
    let owner=false;
    if (myid==user){
    	owner = true
    }
    // let title = '你好ejs';
    // let list = ['哈哈','嘻嘻','看看','问问'];
    // let content = "<h2>这是一个h2</h2>";
    // let num = 10;
    console.log(friends)
    console.log(myid)
    await ctx.render('search',{
        friends,myid,owner,focus
    });
});
router.get('/attention',async (ctx)=>{
    let user=ctx.query['user'];
    let focus_str=ctx.query['focus']
    console.log('attention!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log('user = '+user)
    let myid=ctx.cookies.get('cid');
    console.log(zqj.gettime());
    console.log('old_focus = '+focus_str)
    var result = await client.query("webo",'select ?gender ?loc ?fans ?fav ?uid where{?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>    \"'+user+'\".?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid>	?uid.?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_gender>  ?gender.?o  <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_location>    ?loc.?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_followersnum>    ?fans.?o    <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_favouritesnum>   ?fav.}');
    console.log(result)
    let userId = result["results"]["bindings"][0]["uid"]["value"]
    var result1 = await client.query("webo",'select ?uid where{?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>    \"'+myid+'\".?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid>	?uid.}');
    let myId =  result1["results"]["bindings"][0]["uid"]["value"]
    var focus = focus_str === "false" ? false : true;

    if(focus==true){
    	focus=false
    	var result2 = await client.query("webo",'delete data\
	{\
	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#userrelation/'+myId+'/'+userId+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation_tuid>	\"'+userId+'\".\
	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#userrelation/'+myId+'/'+userId+'>	<http://www.w3.org/2000/01/rdf-schema#label>	"userrelation #'+myId+'/'+userId+'\" .\
	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#userrelation/'+myId+'/'+userId+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation_suid>	\"'+myId+'\" .\
	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#userrelation/'+myId+'/'+userId+'>	<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation> \
	}')}else{
    		focus = true
    		var result3 = await client.query("webo",'insert data\
	{\
	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#userrelation/'+myId+'/'+userId+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation_tuid>	\"'+userId+'\".\
	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#userrelation/'+myId+'/'+userId+'>	<http://www.w3.org/2000/01/rdf-schema#label>	"userrelation #'+myId+'/'+userId+'\" .\
	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#userrelation/'+myId+'/'+userId+'>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation_suid>	\"'+myId+'\" .\
	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#userrelation/'+myId+'/'+userId+'>	<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation> \
	}')
    	}
    console.log('focus = '+focus)
    let friends=[];
    if (result["results"]["bindings"].length == 0){
    	friends = null
    }else{
	    friends.push(message(user,result["results"]["bindings"][0]["gender"]["value"],result["results"]["bindings"][0]["loc"]["value"],
	        result["results"]["bindings"][0]["fans"]["value"],result["results"]["bindings"][0]["fav"]["value"]));
    }
    let owner=false;
    if (myid==user){
    	owner = true
    }
    // let title = '你好ejs';
    // let list = ['哈哈','嘻嘻','看看','问问'];
    // let content = "<h2>这是一个h2</h2>";
    // let num = 10;
    console.log(friends)
    await ctx.render('search',{
        friends,myid,owner,focus
    });
})	;
router.get('/data',async (ctx,next)=>{
    let user=ctx.cookies.get('cid');
    //var result = await client.query("webo",'insert data{<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#user/10000000006>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_gender>	"m". 	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#user/10000000006>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_location>	"浙江 温州". 	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#user/10000000006>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_followersnum>	"0". 	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/t_webo.nt#user/10000000006>	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_favouritesnum>	"0". }');
    //var result = await client.query("webo",'select ?gender ?loc ?fans ?fav where{?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name> "zxc".?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_gender> ?gender.?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_location> ?loc.?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_followersnum> ?fans.?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_favouritesnum> ?fav.}');
    //var result = await client.query("webo", 'select  ?o where{	?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>	"zqj".		?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_password>	?p.}');
    user="Jing_Mini_Shop";
    // var result =await client.query("webo",'select ?attentionuser ?x ?text ?data ?dianzan where\
    // {\
    //     ?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>	"'+user+'".	\
    //     ?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid>	?id.\
    //     ?relation	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation_suid>	?id.\
    //     ?relation	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/userrelation_tuid>	?attentionId.\
    //     ?y	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid>	?attentionId.\
    //     ?y	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>	?attentionuser.\
    //     ?x	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_uid>	?attentionId.\
	//     ?x	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_text>	?text;\
	// 	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_date>	?data;\
	// 	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/weibo_attitudesnum>	?dianzan.\
    // }'
    // );
    var result=await client.query("webo",'select ?gender ?loc ?fans ?fav ?uid where{?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_name>    "吸血鬼日记".?o	<file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_uid>	?uid.?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_gender>  ?gender.?o  <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_location>    ?loc.?o <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_followersnum>    ?fans.?o    <file:///C:/Users/qq150/Desktop/d2rq/d2rq-0.8.1/vocab/user_favouritesnum>   ?fav.}');
    ctx.response.body=result;
    console.log('test');
    await next(); 
}
)
app.use(router.routes());
app.listen(3000,function(){console.log('server is starting at port 3000')});
