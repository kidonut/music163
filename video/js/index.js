$(function () {
    FastClick.attach(document.body);

    /*公共头部处理*/
    $(".header").load("./../common/header.html", function () {
        let sc = document.createElement("script");
        sc.src = "./../common/js/header.js";
        document.body.appendChild(sc);
    });

    /*公共底部处理*/
    $(".footer").load("./../common/footer.html", function () {
        // 当加载的内容被添加之后
        let sc = document.createElement("script");
        sc.src = "./../common/js/footer.js";
        document.body.appendChild(sc);
    });

    /*处理公共的内容区域*/
    let $video = $(`<video src="http://vodkgeyttp9c.vod.126.net/vodkgeyttp8/gMtVRNsP_2588451638_uhd.mp4?wsSecret=081e21294a706988b7825df37344f654&wsTime=1567584258&ext=NnR5gMvHcZNcbCz592mDGUGuDOFN18isir07K1EOfL2T3hxJDLNdM4Uzj7XnCkvRVKjpOHTVL2Kz%2ByA%2F3nVVwhd192kSPCLEfTukntqiIRz4hsaLRCW4GLkbxC9tiqHjHfj6oz3mTXMEGnO3oGwjyeKlPBB8GOA7MUpfITmAUSoS6jbPlyGzGReaPJBdzAhNh072kdFMLMjHqgZGy6V0T1DMlahM59Jvylq1WqCBFvDcmIK%2BESsg5X6qCiNzJG0N"></video>`);
    $("body").append($video);
});