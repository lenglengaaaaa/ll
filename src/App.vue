<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<style>
  body{
    margin: 0;
    padding: 0;
  }

  ul {
    padding: 0;
  }
  ul li{
    list-style:none;
  }

  a{
    text-decoration: none;
  }
  
  ::-webkit-scrollbar{
    display: none;
  }

  .app-main{
      -ms-scroll-chaining: chained;
      -ms-overflow-style: none;
      -ms-content-zooming: zoom;
      -ms-scroll-rails: none;
      -ms-content-zoom-limit-min: 100%;
      -ms-content-zoom-limit-max: 500%;
      -ms-scroll-snap-type: proximity;
      -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
      -ms-overflow-style: none;
      overflow: auto;
  }

  .amap-logo,.amap-copyright{
    display: none !important;
  }

  /* html {
    font-size: 16px;
  } */

  /* @media screen and (min-width: 375px) {
      html {
          iPhone6的375px尺寸作为16px基准，414px正好18px大小, 600 20px
          font-size: calc(100% + 2 * (100vw - 375px) / 39);
          font-size: calc(16px + 2 * (100vw - 375px) / 39);
      }
  } */
  /* @media screen and (min-width: 414px) {
      html {
          414px-1000px每100像素宽字体增加1px(18px-22px)
          font-size: calc(112.5% + 4 * (100vw - 414px) / 586);
          font-size: calc(18px + 4 * (100vw - 414px) / 586);
      }
  } */
  /* @media screen and (min-width: 600px) {
      html {
          600px-1000px每100像素宽字体增加1px(20px-24px)
          font-size: calc(125% + 4 * (100vw - 600px) / 400);
          font-size: calc(20px + 4 * (100vw - 600px) / 400);
      }
  } */
  /* @media screen and (min-width: 1000px) {
      html {
          font-size: calc(137.5% + 6 * (100vw - 1000px) / 1000);
          font-size: calc(22px + 6 * (100vw - 1000px) / 1000);
      }
  } */

  html {font-size: 62.5%!important; /* 10÷16=62.5% */}
  @media only screen and (min-width: 481px){
      html {
          font-size: 94%!important; /* 15.04÷16=94% */
      }
  }
  @media only screen and (min-width: 561px){
      html {
          font-size: 109%!important; /* 17.44÷16=109% */
      }
  }
  @media only screen and (min-width: 641px){
      html {
          font-size: 125%!important; /* 20÷16=125% */
      }
  }
</style>
