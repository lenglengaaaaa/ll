<template>
    <cc-assetEdit
        :form="form"
        :hasCable="false"
        :hasMap="false"
        :create="create"
        :edit="edit"
        :type="5"
    >
        <template>
            <el-form-item label="所属主线缆" prop="parentId">
                <el-select v-model="form.parentId" >
                    <el-option 
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
        </template>
    </cc-assetEdit>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        data() {
            return {
                form: {
                    parentId:''
                },
                options:[]
            }
        },
        mounted () {
            this.getLineMenu().then(res=>{
                if(!res)return;
                this.options = res;
            });
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
                'getLineMenu',
                'createLine', 
                'updateLine'
            ]),
            create(obj) {
                this.createLine(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CableList'})
                })
            },
            edit(obj){
                this.updateLine(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CableList'})
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>