const Discord = require('discord.js');
const config = require("./config.json");
const ytdl = require("ytdl-core");
const streamOptions = {seek: 0, volume: 1};
const bot = new Discord.Client();

const prefix = '?';

var list=[];
var list_name=[];
var connect;
var wait=2;

bot.on('ready', () => {
	console.log(`成功登入 ${bot.user.tag}!`);
});
 
bot.on('message', msg => {

	if(checkCommand(msg,"enter")){
		/*let VoiceChannel = msg.guild.channels.find(channel => channel.id == '567005335668260894');
		if(VoiceChannel != null){
			console.log(VoiceChannel.name + "was found and is a " + VoiceChannel.type + "channel.");
			VoiceChannel.join()
				.then(connection =>{
					console.log("bot joined the channel.");
					const stream = ytdl('https://www.youtube.com/watch?v=K4DyBUG242c&list=PLRBp0Fe2GpglvwYma4hf0fJy0sWaNY_CL',{filter : 'audioonly'});
					const dispatcher = connection.playStream(stream,streamOptions);
				})
				.catch();
		}*/
		//msg.member.voiceChannel.join().then( (msg,connection) => play).catch();
		msg.member.voiceChannel.join().then(function a(connection){
					connect = connection;
					wait=1;
					if(list.length!=0){
						play(msg,connect);
					}
				}).catch();
	}
	
	if(checkCommand(msg,"join")){
		let args = msg.content.slice(prefix.length).trim().split(' ');
		list[list.length]=args[1];
		console.log(args[1]);
		ytdl(args[1],{filter : 'audioonly'}).on('info',(info)=>{
			msg.channel.send(`點歌: ${info.title}`);
			list_name[list_name.length]=info.title;
			
		});
		if(wait==1){
			play(msg,connect);
		}
	}
	
	if(checkCommand(msg,"list")){
		msg.channel.send("待播歌曲--"+list_name.length+"首");
		msg.channel.send("▲ ▼ ▲ ▼ ▲ ▼ ▲ ▼ ▲ ▼ ▲ ▼ ▲ ▼ ▲ ▼");
		let i;
		for(i=0;i<list_name.length;i++){
			msg.channel.send((i+1).toString() + '. ' + list_name[i]);
		}
	}
	
	if(checkCommand(msg,"stop")){
		msg.reply('QQ');
	}
	if(checkCommand(msg,"leave")){
		wait=2;
		msg.member.voiceChannel.leave();
	}

	if (msg.content == '嗨') {
		msg.reply('?');
		msg.reply('你是誰? 不要跟我裝熟');
	}
});

bot.login(config.token);

function checkCommand(message,commandName){
	return message.content.toLowerCase().startsWith("?" + commandName);
}

function play(msg,connection){
	//let info = ytdl.getInfo(list[0]);
	wait=0;
	const stream = ytdl(list[0],{filter : 'audioonly'}).on('info',(info)=>{
		msg.channel.send(`正在播放: ${info.title}`);
	});
	console.log("start");
	const dispatcher = connection.playStream(stream,streamOptions).on("end",()=>{
						console.log("finish");
						list.shift();
						list_name.shift();
						if(list.length!=0){
							play(msg,connection);
						}
						else if(list.length==0){
							wait=1;
						}
					});
}