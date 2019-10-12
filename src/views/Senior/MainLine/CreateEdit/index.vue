<template>
    <cc-assetEdit
        :form="form"
        :hasCable="false"
        :hasMap="false"
        :create="create"
        :edit="edit"
        :type="5"
    >
    </cc-assetEdit>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        data() {
            return {
                form: {
                    parentId:0
                },
                options:[]
            }
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
                'createLine', 
                'updateLine'
            ]),
            create(obj) {
                const data ={
                    ...obj,
                    projectId:null
                }
                this.createLine(data).then(res=>{
                    if(!res)return
                    this.$router.push({name:'MainLineList'})
                })
            },
            edit(obj){
                const data ={
                    ...obj,
                    projectId:null
                }
                this.updateLine(data).then(res=>{
                    if(!res)return
                    this.$router.push({name:'MainLineList'})
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>