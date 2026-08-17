const express=require("express");
const http=require("http");
const WebSocket=require("ws");
const {TikTokLiveConnection,WebcastEvent}=require("tiktok-live-connector");

const PORT=process.env.PORT||3000;
const TIKTOK_USERNAME=(process.env.TIKTOK_USERNAME||"").replace(/^@/,"").trim();

const app=express();
app.use(express.static("public"));
app.get("/health",(req,res)=>res.json({ok:true,tiktok:TIKTOK_USERNAME||null}));
const server=http.createServer(app);
const wss=new WebSocket.Server({server});

function broadcast(obj){
 const msg=JSON.stringify(obj);
 wss.clients.forEach(c=>{if(c.readyState===WebSocket.OPEN)c.send(msg)});
}

let connection=null;
async function startTikTok(){
 if(!TIKTOK_USERNAME){console.log("TIKTOK_USERNAME ayarlanmadi. Oyun yine acilir; hediyeler gelmez.");return;}
 console.log("TikTok LIVE baglaniyor: @"+TIKTOK_USERNAME);
 connection=new TikTokLiveConnection(TIKTOK_USERNAME);
 connection.on(WebcastEvent.GIFT,data=>{
   const gift=data.gift||{};
   const user=data.user||{};
   const event={
     type:"gift",
     user:user.uniqueId||user.nickname||"İzleyici",
     giftName:gift.name||data.giftName||"Hediye",
     diamondCount:Number(gift.diamondCount||data.diamondCount||1),
     repeatCount:Number(data.repeatCount||1)
   };
   console.log("🎁",event.user,event.giftName,"x"+event.repeatCount,event.diamondCount+"💎");
   broadcast(event);
 });
 connection.on(WebcastEvent.CHAT,data=>{});
 connection.on(WebcastEvent.MEMBER,()=>{});
 connection.on(WebcastEvent.ROOM_USER_SEQ,data=>{
   broadcast({type:"viewers",count:data.viewerCount});
 });
 try{
   await connection.connect();
   console.log("✅ TikTok LIVE baglandi.");
 }catch(err){
   console.error("TikTok baglanti hatasi:",err.message||err);
   setTimeout(startTikTok,10000);
 }
}
server.listen(PORT,()=>{console.log("🎮 Oyun: http://localhost:"+PORT);startTikTok();});
