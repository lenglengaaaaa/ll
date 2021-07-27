<template>
    <cc-assetEdit
        :form="form"
        :hasCable="false"
        :hasMap="false"
        :hasNumber="false"
        :create="create"
        :edit="edit"
        :type="5"
    >
        <template>

        </template>
    </cc-assetEdit>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        data() {
            return {
                form: {
                    parentId:''
                },
            }
        },
        mounted () {

        },
        created () {
            const data = JSON.parse(sessionStorage.getItem('assetObj')).data;
            this.form={
                ...this.form,
                ...data
            };
        },
        methods: {
            ...mapActions('asset',[
                'CreateCreateCableTrench',
                'editAndDeleteCableTrench' 
                // 'updateLine'
            ]),
            create(obj) {
                this.CreateCreateCableTrench(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CableTrenchList'})
                })
            },
            edit(obj){
                this.editAndDeleteCableTrench({
                    ...obj,
                    isDelete:0
                }).then(res=>{
                    if(!res)return
                    this.$router.push({ name:'CableTrenchList' })
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>