(()=>{"use strict";class e extends HTMLElement{constructor(){super(),this.state={isPaused:!1,isPlaying:!1,isReproducing:!1,isBuffering:!1,isWaiting:!1,isEnded:!1,volume:100}}appendTo(e){return e.append(this),new Promise((async(e,t)=>e()))}prependTo(e){return e.prepend(this),new Promise((async(e,t)=>e()))}appendAfter(e){return e.after(this),new Promise((async(e,t)=>e()))}get isPaused(){return this.state.isPaused}get isPlaying(){return this.state.isPlaying}get isReproducing(){return this.state.isReproducing}get isWaiting(){return this.state.isWaiting}get isBuffering(){return this.state.isBuffering}get isEnded(){return this.state.isEnded}get volume(){return this.state.volume}get currentTime(){}get currentTimeFormatted(){return e.secondsToStringRepresentation(this.currentTime)}get currentTimePercentage(){var e,t;return e=Math.round(this.currentTime),t=Math.round(this.duration),isNaN(e)||isNaN(t)||0==e||0==t?0:e/t*100}get remainingTime(){return this.duration-this.currentTime}get remainingTimeFormatted(){return e.secondsToStringRepresentation(this.remainingTime)}get remainingTimePercentage(){return 100-this.currentTimePercentage}get duration(){}get durationFormatted(){return e.secondsToStringRepresentation(this.duration)}getTime(e){return Math.round(this.duration/100*e)}getTimeFormatted(t){return e.secondsToStringRepresentation(this.getTime(t))}getPercentage(t){return("string"==typeof t&&t.indexOf(":")>=0?e.stringRepresentationToSeconds(t):parseFloat(t))/this.duration*100}seek(e){}play(e=null){}pause(){}toggle(){this.isPlaying?this.pause():this.play()}sanitizeGetSeconds(t){var i;return i="string"==typeof t&&t.indexOf(":")>=0?e.stringRepresentationToSeconds(t):"string"==typeof t&&t.indexOf("%")>=0?this.getTime(parseInt(t)):"string"==typeof t?parseInt(t):t,isNaN(i)&&(i=0),i}fireEvent(e,t,i=!0){var s={bubbles:i};null!=t&&(s.detail=t);var n=new CustomEvent(e,s);return this.dispatchEvent(n)}log(e){console.log(e)}static secondsToStringRepresentation(e){return isNaN(e)?"00:00":(e=Math.round(e),a=(n=(n=(i=Math.floor(e/60))-60*(t=Math.floor(i/60)))<10?"0"+n:n)+":"+(r=(r=e-60*i)<10?"0"+r:r),a=(s=t)>0?s+":"+a:a);var t,i,s,n,r,a}static stringRepresentationToSeconds(e){var t,i,s;return!((t=e.match(/[0-9]+/g)).length>3)&&(s=parseInt(t[t.length-1]),i=parseInt(t[t.length-2]||0),3600*parseInt(t[t.length-3]||0)+60*i+s)}}const t=e,i=class{static async loadExternalJs(e,t=null){return new Promise((async function(i,s){var n;(n=document.createElement("script")).async=!0,n.type="text/javascript",n.onload=function(e){i("SCRIPT: loaded")},n.onerror=function(e){s("SCRIPT: failed to load")},n.src=e,(t=t||document.body).appendChild(n)}))}};class s extends t{static sdkLoaded=!1;static sdkLoading=!1;static sdkPromise=null;static defaults={width:640,height:"auto",autoplay:!1};constructor(){super(),this.state.currentTime=0,this.state.playerInitialized=!1;var e={embbedId:"youtube-embbed-"+Math.floor(1e4*Math.random()),id:null};this.settings={...s.defaults,...e},this.html={},this.follower=null}connectedCallback(){var e,t,i,n,r;if(!this.html.embed)return this.html.embed=this.createDiv(this.settings.embbedId,this),(e=this.getAttribute("src"))&&(this.src=e),(t=this.getAttribute("video-id"))&&(this.videoId=t),(i=this.getAttribute("width"))&&(this.width=i),(n=this.getAttribute("height"))&&(this.height=n),(r=this.getAttribute("autoplay"))&&(this.autoplay=["true","1"].includes(r)),this.readyToPlayPromise=s.loadSdk().then((()=>this.initializePlayer()))}remove(){this.html.ytWidget&&this.html.ytWidget.destroy(),super.remove()}appendTo(e){return e.append(this),this.readyToPlayPromise}prependTo(e){return e.prepend(this),this.readyToPlayPromise}appendAfter(e){return e.after(this),this.readyToPlayPromise}set src(e){this.settings.id=s.getIdFromUrl(e)}set videoId(e){this.settings.id=e}set width(e){this.settings.width=e,this.updateDimensions()}set height(e){this.settings.height=e,this.updateDimensions()}set autoplay(e){this.settings.autoplay=e}calculateDimensions(){var e,t,i=this.settings.width,s=this.settings.height;return"auto"==i?e=this.parentNode.offsetWidth>400?400:this.parentNode.offsetWidth:"string"==typeof i&&i.indexOf("%")>-1?(e=parseInt(i),e=parseInt(this.parentNode.offsetWidth/100*e)):e=i,"auto"==s?t=parseInt(e/1.77):"string"==typeof s&&s.indexOf("%")>-1?(t=parseInt(s),t=parseInt(this.parentNode.offsetHeight/100*t)):t=s,{actualWidth:e,actualHeight:t}}updateDimensions(){if(this.html.ytWidget){var e=this.html.ytWidget.getIframe(),{actualWidth:t,actualHeight:i}=this.calculateDimensions();e.style.width=t+"px",e.style.height=i+"px"}}get currentTime(){return this.state.currentTime}get duration(){return this.html.ytWidget&&this.html.ytWidget.getDuration?this.html.ytWidget.getDuration():0}seek(e){if(!this.state.playerInitialized)return!1;var t=this.sanitizeGetSeconds(e);this.html.ytWidget.seekTo(t,!0)}play(e=null){return e&&this.seek(e),new Promise(((e,t)=>this.state.playerInitialized?(this.html.ytWidget.playVideo(),e()):t("Player has not been initialized")))}pause(){if(!this.state.playerInitialized)return!1;this.html.ytWidget.pauseVideo()}setVolume(e){this.state.volume=e,this.state.playerInitialized&&this.html.ytWidget.setVolume(e)}async initializePlayer(){return new Promise((async(e,t)=>{var{actualWidth:i,actualHeight:n}=this.calculateDimensions();this.html.ytWidget=new YT.Player(this.settings.embbedId,{width:i,height:n,videoId:this.settings.id,startSeconds:0,playerVars:{autoplay:this.settings.autoplay,controls:0},events:{onReady:t=>{e(this),this.setVolume(this.volume),this.state.playerInitialized=!0},onError:e=>{var i=s.getErrorDescription(e.data);t(i),this.fireEvent("player:error",{errorCode:e.data,errorMessage:i})},onStateChange:this.callBackOnStateChange.bind(this)}})}))}callBackOnStateChange(e){switch(e.data){case-1:this.state.isReproducing=!1,this.state.isPlaying=!1,this.state.isPaused=!1;break;case 0:this.state.isReproducing=!1,this.state.isPlaying=!1,this.state.isPaused=!0,this.state.isWaiting=!1,this.state.isEnded=!0,this.stopFollowing(),this.fireEvent("player:ended");break;case 1:var t=this.state.isWaiting;this.state.isReproducing=!0,this.state.isPlaying=!0,this.state.isPaused=!1,this.state.isBuffering=!1,this.state.isWaiting=!1,this.state.isEnded=!1,this.startFollowing(),t?this.fireEvent("player:playing"):this.fireEvent("player:play");break;case 2:this.state.isReproducing=!1,this.state.isPlaying=!1,this.state.isPaused=!0,this.state.isWaiting=!1,this.fireEvent("player:pause");break;case 3:this.state.isReproducing=!1,this.state.isPlaying=!0,this.state.isPaused=!1,this.state.isBuffering=!0,this.state.isWaiting=!0,this.fireEvent("player:waiting");break;case 5:this.play(0),this.fireEvent("player:play")}}startFollowing(){this.follower=setInterval(this.following.bind(this),1e3)}stopFollowing(){clearInterval(this.follower)}following(){var e=this.html.ytWidget&&this.html.ytWidget.getCurrentTime?this.html.ytWidget.getCurrentTime():0;e!=this.currentTime&&(this.state.currentTime=e,this.fireEvent("player:timeupdate"))}static getErrorDescription(e){switch(e){case"2":return"Error 2: invalid parameters.";case"5":return"Error 5: An error related to the HTML5 player occurred.";case"100":return"Error 100: Video not found.";case"101":case"150":return"Error 101: The video's owner won't allow it on embbed players."}return"Error "+e+": Unknown error"}static getIdFromUrl(e){var t;return(t=e.match(/v=([A-Za-z0-9-_]+)/))||(t=e.match(/\.be\/([A-Za-z0-9-_]+)/))||(t=e.match(/embed\/([A-Za-z0-9-_]+)/))?t[1]:null}static async loadSdk(){return s.sdkLoaded?new Promise((async(e,t)=>{e()})):s.sdkDefined()?(s.sdkLoaded=!0,new Promise((async(e,t)=>{e()}))):s.sdkLoading?s.sdkPromise:(s.sdkLoading=!0,s.sdkPromise=new Promise((async(e,t)=>{i.loadExternalJs("https://www.youtube.com/iframe_api").then(s.loadSdkSuccess(e),s.loadSdkFail(t))})))}static sdkDefined(){return"undefined"!=typeof YT&&void 0!==YT.Player}static loadSdkSuccess(e){return()=>{s.waiter=setInterval((()=>{if(s.sdkDefined())return s.sdkLoaded=!0,clearInterval(s.waiter),s.sdkLoading=!1,e("YouTube SDK ready")}),500)}}static loadSdkFail(e){return()=>(s.sdkLoading=!1,e("Error loading SDK"))}createDiv(e,t){var i=document.createElement("div");return i.id=e,t.append(i),i}}const n=s;function r(e){var t=document.createElement("p");t.innerHTML=e,window.logWindow.append(t)}customElements.define("youtube-player",n),document.addEventListener("DOMContentLoaded",(function(){window.mediaPlayer=document.getElementById("media-player"),window.currentTime=document.getElementById("current-time"),window.remainingTime=document.getElementById("remaining-time"),window.progressBar=document.getElementById("progress-bar"),window.logWindow=document.querySelector("#log div"),window.wrapper=document.getElementById("youtube-wrapper"),window.volume=15,document.getElementById("toggle-play-pause").addEventListener("click",(function(){window.player.toggle()})),document.querySelectorAll("#media-list a").forEach((function(e){e.addEventListener("click",(function(t){var i,s;t.preventDefault(),window.player&&(window.player.pause(),window.player.remove()),window.player=(i=this.attributes.href.value,(s=document.createElement("youtube-player")).src=i,s.width="100%",s.addEventListener("player:play",(function(){r("Play")})),s.addEventListener("player:pause",(function(){r("Pause")})),s.addEventListener("player:ended",(function(){r("Ended")})),s.addEventListener("player:timeupdate",(function(){window.currentTime.innerHTML=this.currentTimeFormatted,window.remainingTime.innerHTML=this.remainingTimeFormatted,window.progressBar.value=this.currentTimePercentage})),s.addEventListener("player:waiting",(function(){window.mediaPlayer.classList.add("waiting"),r("Waiting")})),s.addEventListener("player:playing",(function(){window.mediaPlayer.classList.remove("waiting"),r("Playing")})),s.addEventListener("player:error",(function(e){r(e.detail.errorMessage)})),s),window.player.appendTo(window.wrapper).then((()=>{window.player.setVolume(window.volume),window.player.play()})),document.getElementById("title").innerHTML=e.querySelector(":scope .title").innerHTML,document.getElementById("artist").innerHTML=e.querySelector(":scope .artist").innerHTML}))})),document.getElementById("progress-bar").addEventListener("click",(function(e){var t,i,s;t=e.clientX-this.offsetLeft,i=this.offsetWidth,s=Math.ceil(t/i*100)+"%",window.player.seek(s)})),document.getElementById("volume-slider").value=window.volume,document.getElementById("volume-slider").addEventListener("change",(function(){window.volume=parseInt(this.value),window.player.setVolume(window.volume)}))}))})();