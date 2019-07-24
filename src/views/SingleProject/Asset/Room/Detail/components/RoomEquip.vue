<template>
    <EquipDetail 
        :hasLine="false"
    />
</template>

<script>
    import EquipDetail from '@/components/EquipDetail'

    export default {
        components: {
            EquipDetail
        },
        created () {
            // const result =JSON.parse(sessionStorage.getItem("obj"));
        },
        data() {
            return {
                
            }
        },
    }
</script>

<style lang="scss">

</style>