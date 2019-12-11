<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  body{
    margin: 0;
    padding: 0;
    overflow: auto;
    overflow-y: auto;
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
  
  /* Chrome自定义滚动条 */
  ::-webkit-scrollbar {
      width : 6px;  /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
  }

  ::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius   : 10px;
      background: linear-gradient(135deg, #22a7f0, #22a7f0, #36d7b7);
  }

  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #ededed;
    border-radius: 10px;
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
          font-size: 75%!important; /* 12÷16=75% */
      }
  }
  @media only screen and (min-width: 561px){
      html {
          font-size: 87%!important; /* 14÷16=87% */
      }
  }
  @media only screen and (min-width: 641px){
      html {
          font-size: 100%!important; /* 16÷16=100% */
      }
  }
  @media only screen and (min-width: 881px){
      html {
          font-size: 115%!important; /* 16÷16=100% */
      }
  }
</style>
