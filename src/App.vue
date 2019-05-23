<template>
  <div id="app">
    {{msg}}
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        timer:null,
        msg:''
      }
    },
    mounted () {
      this.timer =setInterval(()=>{
        this.msg=this.$moment().format("YYYY-MM-DD HH:mm:ss");
      },1000)
    },
    beforeDestroy(){
      clearInterval(this.timer)
    }
  }
</script>

<style>

</style>
