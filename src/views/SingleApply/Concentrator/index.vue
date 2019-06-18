<template>
    <div>
        集中器管理
    </div>
</template>

<script>
    export default {
        data() {
            return {
                bread: [{name:'Concentrator',title:'集中器管理'}]
            }
        },
        created () {
            this.$store.commit('SET_BREAD',this.bread)
        },
    }
</script>

<style lang="scss" scoped>

</style>