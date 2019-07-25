<template>
    <EquipDetail 
        :close="close"
    />
</template>

<script>
    import EquipDetail from '@/components/EquipDetail'

    export default {
        components: {
            EquipDetail
        },
        created () {
            const obj =JSON.parse(sessionStorage.getItem("obj"));
            this.$route.meta.title=obj.name
        },
        data() {
            return {
                
            }
        },
        methods: {
            close() {
                this.$router.push({name:'EquList'})
            }
        },
    }
</script>

<style lang="scss">

</style>