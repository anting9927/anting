var mySwiper = new Swiper ('.swiper', {
    direction: 'vertical', // 垂直切换选项
    init:false,   //禁止初始化
    loop: false, // 循环模式选项

    on: {
      slideChangeTransitionEnd: function () {
        // 1. 先让所有的play按钮都处于暂停状态
        $(".play").removeClass("playing");
        // 2. 触发当前slide的play按钮的点击事件
        $(".play").eq(this.activeIndex).trigger("click");
      },
    },
  });        

  // 1.发送请求，ajax
  getVideoList(0,10,function(data){
    var videoList = data.result.list;
    // 遍历videolist，创建swiper-slide，添加到swiper-wrapper
    videoList.forEach(function (item, index, arr) {
      var swiperSlide = $(`
      <div class="swiper-slide">
        <div class="video_box">
          <div class="video_title">${item.title}</div>
          <div class="video_wrap">
            <video
              poster="${item.picurl}"
              src="${item.playurl}"
            ></video>
          </div>
          <div class="video_name">${item.alias}</div>
          <div class="play"></div>
        </div>
      </div>
      `);
  
      $(".swiper-wrapper").append(swiperSlide);
  });
  //当swipslide添加完之后再初始化
  mySwiper.init();


  });

   // 2.通过事件委托的方式给播放按钮绑定事件
   $(".swiper-wrapper").on("click",".play",function(){
    // 0.让其他所有视频暂停
    $("video").each(function(index,video){
      video.pause();
    })

    // 1.让play按钮隐藏
    $(this).toggleClass("playing")
    // 2.找到play按钮对应的video视频播放
    var video = $(this).prevAll(".video_wrap").children
    ("video").get(0);
    if($(this).hasClass('playing')){
      video.play();
    }else{
      video.pause();
    }

    var _this = this;
    // 监听当前视频播放结束事件
    $(video).on("ended",function(){
      video.currentTime = 0; // 重置视频的播放时间为0，使视频从头开始播放
      video.play(); // 重新播放视频
    })
  })

  // 定义一个函数，用来发送ajax请求
  function getVideoList(page,size,cb) {
    var xhr =new XMLHttpRequest()
    // 2. 配置请求参数
    xhr.open("GET",`https://api.apiopen.top/api/getMiniVideo?page=${page}&size=${size}`)
    // 发送请求
    xhr.send();
    // 监听
    xhr.onload = function () {
      if(xhr.status >=200 && xhr.status <300){
        var data = JSON.parse(xhr.responseText)
        cb && cb(data);
      }
    }
  }
  // 根据设备计算html的font-size

  // 3. 这里通过js监听屏幕尺寸 设置html的font-size
//   function setView(){
//     document.documentElement.style.fontSize = screen.width/10 + 'px';
//   } 
//   console.log(fontSize);
//   setView();
//   window.onresize = setView;
// ​
