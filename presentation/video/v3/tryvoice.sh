#!/bin/sh
# Audio-only test of a voice: speaks lines.js, cleans noise, fits within MAX seconds, writes voiceover-<id4>.mp3
# usage: sh tryvoice.sh <voice_id> [speed 0.7-1.2, default 1.0] [max seconds, default 40]
# optional: SPEEDS=1,1,1.15,... gives each of the ten lines its own speed
cd "$(dirname "$0")" || exit 1
ID=$1; SPEED=${2:-1.0}; MAX=${3:-40}; TAG=$(printf '%s' "$ID" | cut -c1-4); DIR=vo-$TAG; mkdir -p "$DIR"
VOICE_ID=$ID SPEED=$SPEED DIR=$DIR node -e "
const fs=require('fs'),L=require('./lines.js');const KEY=(fs.readFileSync('../../../.env','utf8').match(/^ELEVENLABS_API_KEY=(.+)\$/m)||[])[1];const H={'xi-api-key':KEY,'content-type':'application/json'};
(async()=>{for(let i=0;i<L.length;i++){const t=await fetch('https://api.elevenlabs.io/v1/text-to-speech/'+process.env.VOICE_ID+'?output_format=mp3_44100_128',{method:'POST',headers:H,body:JSON.stringify({text:L[i],model_id:'eleven_multilingual_v2',voice_settings:{stability:.55,similarity_boost:.8,style:.25,use_speaker_boost:true,speed:(process.env.SPEEDS?+process.env.SPEEDS.split(',')[i]:+process.env.SPEED)}})});if(!t.ok){console.log('line',i+1,'failed',t.status,(await t.text()).slice(0,260));process.exit(1)}fs.writeFileSync(process.env.DIR+'/raw-'+(i+1)+'.mp3',Buffer.from(await t.arrayBuffer()))}console.log('all lines ok')})()" || exit 1
T=0
for i in 1 2 3 4 5 6 7 8 9 10; do ffmpeg -y -loglevel error -i $DIR/raw-$i.mp3 -filter:a "highpass=f=85,afftdn=nr=14:nf=-38:tn=1,agate=threshold=0.012:ratio=3:attack=8:release=180,silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" $DIR/c-$i.wav; T=$(echo "$T + $(ffprobe -v error -show_entries format=duration -of csv=p=0 $DIR/c-$i.wav)" | bc -l); done
TEMPO=$(echo "x=$T/($MAX-2.5); if (x<1) x=1; x" | bc -l | cut -c1-5); echo "speech $T s, tempo $TEMPO"
: > $DIR/list.txt
for i in 1 2 3 4 5 6 7 8 9 10; do ffmpeg -y -loglevel error -i $DIR/c-$i.wav -filter:a "atempo=$TEMPO" -b:a 160k $DIR/line-$i.mp3; echo "file 'line-$i.mp3'" >> $DIR/list.txt; echo "file 'gap.mp3'" >> $DIR/list.txt; done
ffmpeg -y -loglevel error -f lavfi -i anullsrc=r=44100:cl=mono -t 0.22 -q:a 4 $DIR/gap.mp3
ffmpeg -y -loglevel error -f concat -safe 0 -i $DIR/list.txt -ar 44100 -ac 1 -b:a 160k voiceover-$TAG.mp3
echo "voiceover-$TAG.mp3 $(ffprobe -v error -show_entries format=duration -of csv=p=0 voiceover-$TAG.mp3) s"
