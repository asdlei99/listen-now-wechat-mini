const operation = {
    getMusicData: function () {
        return new Promise((resolve, reject) => {
            wx.getBackgroundAudioPlayerState({
                success: function (res) {
                  console.log(res)
                    resolve(res);
                },
                fail: function (err) {
                    reject(err);
                }
            })
        })
    },
    // 播放音乐 参数:url title 图片url
    playMusic: function (url, title, pic) {
        return new Promise((resolve, reject) => {
            wx.playBackgroundAudio({
                dataUrl: url,
                title: title,
                coverImgUrl: pic,
                success: function () {
                  
                    resolve(true)
                },
                fail: function () {
                    reject(new Error('播放错误'));
                }
            })
        })
    },

    asyncGetStorage: function (key) {
        return new Promise((resolve, reject) => {
          console.log("读取缓存中的数据",key)
            wx.getStorage({
                key: key,
                success: function (res) {
                    resolve(res.data)
                },
                fail: function (err) {
                    reject(err)
                }
            })
        })
    },
    getlyric: function (id) {
        return new Promise((resolve, reject) => {
          console.log("  └─开始下载歌词")
          //let url = 'https://www.zlclclc.cn/search'
            wx.request({
              url: "https://www.zlclclc.cn/id",
                data: {
                    id: id,
                    platform: "Neteasymusic",
                    //source: "zlclclc", //zlclclc or leanapp or ledao
                    //action: "lyric"
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function (res) {
                    // success
                   // console.log(res)
                    //return;
                   
                    var lrc = res.data.song.list.lyric;
                    
                    if (lrc == undefined) {


                      //console.log(lyricArr)
                      resolve({ 0: '无歌词' })
                      return;
                    }
                   //console.log('歌词是'+lrc);
                    var lyrics = lrc.split("\n");
                    var lrcObj = {};
                    for (var i = 0; i < lyrics.length; i++) {
                      var lyric = decodeURIComponent(lyrics[i]);
                      var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
                      var timeRegExpArr = lyric.match(timeReg);
                      if (!timeRegExpArr) continue;
                      var clause = lyric.replace(timeReg, '');
                      for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
                        var t = timeRegExpArr[k];
                        var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                          sec = Number(String(t.match(/\:\d*/i)).slice(1));
                        var time = min * 60 + sec;
                        lrcObj[time] = clause;
                      }
                     
                    }

                    var lyricArr=lrcObj
                    //console.log(lyricArr)
                  
                    resolve(lyricArr)
                   
                  
               


                  //   console.log(res)
                  // console.log("    └─歌词下载完成")
                  //   if (!res.data.data.lyric) return false;
                  //   let lyric = res.data.data.lyric
                  //   let timearr = lyric.split('[')
                  //   let obj = {}
                  //   let lyricArr = []
                  //   // seek 为键  歌词为value
                  //   timearr.forEach((item) => {
                  //       let key = parseInt(item.split(']')[0].split(':')[0]) * 60 + parseInt(item.split(']')[0].split(':')[1])
                  //       let val = item.split(']')[1]
                  //       obj[key] = val
                  //   })
                  //   for (let key in obj) {
                  //       // obj[key] = obj[key].split('\n')[0]
                  //       //lyricArr.push(obj[key])
                  //     if (obj[key] == null){
                  //       lyricArr.push('\n')
                  //       }else{
                  //         lyricArr.push(obj[key])
                  //       }
                  //   }
                  //   // cb && cb(obj, lyricArr)
                  //   resolve(lyricArr)
                },
                fail: function (err) {
                    reject(err)
                },
                complete: function (res) {
                    // complete
                }
            })
        })
    }
}
module.exports = operation
