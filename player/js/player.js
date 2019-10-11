;(function (window) {
    class Player{
        constructor($audio, musicList){
            this.$audio = $audio;
            this.audio = $audio[0];
            this.musicList = musicList;
            this.defaultVolume = 0.5;
            this.audio.volume = this.defaultVolume;
            this.currentIndex = -1;
            this.playMode = "loop";
        }
        musicTimeUpdate(callBack){
            let that = this;
            this.$audio.on("timeupdate", function () {
                let currentTime = that.audio.currentTime;
                let duration = that.audio.duration;
                let timeObj = formartTime(currentTime * 1000);
                let currentTimeStr = timeObj.minute + ":" + timeObj.second;
                callBack(currentTime, duration, currentTimeStr);
            });
        }
        musicCanPlay(callBack){
            let that = this;
            this.$audio.on("canplay", function () {
                let currentTime = that.audio.currentTime;
                let duration = that.audio.duration;
                let timeObj = formartTime(duration * 1000);
                let totalTimeStr = timeObj.minute + ":" + timeObj.second;
                callBack(currentTime, duration, totalTimeStr);
            });
        }
        musicEnded(callBack){
            let that = this;
            let index = -1;
            this.$audio.on("ended", function () {
                if(that.playMode === "loop"){
                    index = that.currentIndex;
                    index++;
                    if(index > that.musicList.length - 1){
                        index = 0;
                    }
                }else if(that.playMode === "one"){
                    index = that.currentIndex;
                }else if(that.playMode === "random"){
                    for(;;){
                        index = getRandomIntInclusive(0, that.musicList.length - 1);
                        if(index !== that.currentIndex){
                            break;
                        }
                    }
                }
                callBack(index);
            });
        };
        musicSeekTo(value){
            value = this.audio.duration * value;
            if(!value) return;
            this.audio.currentTime = value;
        }
        musicGetVolume(){
            return this.audio.volume;
        }
        musicSetVolume(value){
            if(value < 0){
                value = 0;
            }else if(value > 1){
                value = 1;
            }
            this.audio.volume = value;
            if(value !== 0){
                this.defaultVolume = value;
            }
        }
        playMusic(index){
            if(index === this.currentIndex){
                // 同一首歌曲
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
                // 不是同一首歌曲
                let song = this.musicList[index];
                let that = this;
                MusicApis.getSongURL(song.id)
                    .then(function (data) {
                        that.$audio.html("");
                        for(let i = 0; i < data.data.length; i++){
                            let $sc = $(`<source src="${data.data[i].url}" type="audio/${data.data[i].type}"/>`);
                            $("audio").append($sc);
                        }
                        // 注意点: 如果更换了需要播放歌曲的地址, 那么必须让audio重新加载才会播放更新之后的歌曲
                        that.audio.load();
                        // 播放歌曲
                        that.audio.play();
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
            this.currentIndex = index;
        }
    }
    window.Player = Player;
})(window);