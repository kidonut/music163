;(function () {
    axios.defaults.baseURL = 'http://music.it666.com:3666';
    // axios.defaults.baseURL = 'http://127.0.0.1:3000';
    axios.defaults.timeout = 3000;

    class NJHttp {
        static get(url="", data={}){
            return new Promise(function (resolve, reject) {
                axios.get(url, {
                    params: data
                })
                    .then(function (response) {
                        resolve(response.data);
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            });
        }
        static post(url="", data={}){
            return new Promise(function (resolve, reject) {
                axios.post(url, {
                    params: data
                })
                    .then(function (response) {
                        resolve(response.data);
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            });
        }
    }
    class HomeApis {
        static getHomeBanner(){
            return NJHttp.get("/banner", {type: 2});
        }
        static getHomeRecommend(){
            return NJHttp.get("/personalized", {offset: 0, limit:6});
        }
        static getHomeExclusive(){
            return NJHttp.get("/personalized/privatecontent");
        }
        static getHomeAlbum(){
            return NJHttp.get("/top/album", {offset: 0, limit:6});
        }
        static getHomeMV(){
            return NJHttp.get("/personalized/mv");
        }
        static getHomeDJ(){
            return NJHttp.get("/personalized/djprogram");
        }
        static getHomeHotDetail(){
            return NJHttp.get("/search/hot/detail");
        }
        static getHomeSearchSuggest(keywords){
            return NJHttp.get("/search/suggest?keywords="+keywords+"&type=mobile");
        }
    }
    class SearchApis{
        /*
        keywords: 需要搜索的内容
        offset: 从什么地方开始获取数据
        [1, 2, 3, 4, 5, 6, 7, 8 ,9, 10]
        limit: 从指定的位置开始取多少条数据
        type:
        // 1: 单曲,
        // 10: 专辑,
        // 100: 歌手,
        // 1000: 歌单,
        // 1002: 用户,
        // 1004: MV,
        // 1006: 歌词,
        // 1009: 电台,
        // 1014: 视频,
        // 1018:综合
        * */
        static getSearch(keywords="", offset=0, limit=30, type=1){
            return NJHttp.get("/search", {
                keywords: keywords,
                offset: offset,
                limit: limit,
                type: type
            });
        }
    }
    class MusicApis{
        static getSongDetail(ids){
            return NJHttp.get("/song/detail", {
                ids: ids
            });
        }
        static getSongURL(id){
            return NJHttp.get("/song/url", {
                id: id
            });
        }
        static getSongLyric(id){
            return NJHttp.get("/lyric", {
                id: id
            });
        }
    }
    class DetailApis{
        static getDjRadio(id){
            return NJHttp.get("/dj/detail", {
                rid: id
            });
        }
        /*
        asc: false返回的数据从新到旧
        asc: true返回的数据从旧到新
        * */
        static getProgram(id, asc=false){
            return NJHttp.get("/dj/program", {
                rid: id,
                asc: asc
            });
        }
    }

    window.NJHttp = NJHttp;
    window.HomeApis = HomeApis;
    window.SearchApis = SearchApis;
    window.MusicApis = MusicApis;
    window.DetailApis = DetailApis;
})();
