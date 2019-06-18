<template>
    <div>
        应用总览
    </div>
</template>

<script>
    export default {
        data() {
            return {
                bread: [{name:'ApplyOverview',title:'应用总览'}]
            }
        },
        created () {
            this.$store.commit('SET_BREAD',this.bread)
        },
    }
</script>

<style lang="scss" scoped>

</style>