<template>
    <CreateEdit
        :form="form"
        :hasCable="false"
        :hasMap="false"
        :create="create"
        :edit="edit"
        :type="5"
    >
        <template>
            <!-- <el-form-item label="是否为主线缆">
                <el-select v-model="form.parentId">
                    <el-option label="是" :value="0"></el-option>
                    <el-option label="否" :value="1"></el-option>
                </el-select>
            </el-form-item> -->
            <!-- <template v-if="form.parentId==1"> -->
            <el-form-item label="所属主线缆" prop="parentId">
                <el-select v-model="form.lineId" >
                    <el-option label="主线缆一" :value="0"></el-option>
                </el-select>
            </el-form-item>
                <!-- <el-form-item label="所属井盖" prop="trapId">
                    <el-select v-model="form.trapId" >
                        <el-option label="井盖一" value="0"></el-option>
                    </el-select>
                </el-form-item> -->
            <!-- </template> -->
        </template>
    </CreateEdit>
</template>

<script>
    import CreateEdit from '@/components/CreateEdit'
    import {mapActions} from 'vuex'

    export default {
        components: {
            CreateEdit,
        },
        data() {
            return {
                form: {
                    parentId:0
                }
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
                this.createLine(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'LineList'})
                })
            },
            edit(obj){
                this.updateLine(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'LineList'})
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>