<template>
  <div class="HelloWorld">
      <p>Hello World!</p>
      <el-button type="primary">主要按钮</el-button> 
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped >
  .HelloWorld{
    p{
      color: blue;
    }
  }
</style>
