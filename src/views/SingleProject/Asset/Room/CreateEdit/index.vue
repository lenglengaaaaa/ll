<template>
    <CreateEdit
        :form="form"
        :create="create"
        :edit="edit"
        :type="1"
    >
        <template>
            <el-form-item label="所属台区" prop="courtsId">
                <el-select v-model="form.courtsId">
                    <el-option 
                        v-for="i in options" 
                        :key="i.id" 
                        :label="i.name" 
                        :value="i.id"
                    />
                </el-select>
            </el-form-item>
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
                form: {},
                options:[]
            }
        },
        created () {
            const data = JSON.parse(sessionStorage.getItem('assetObj')).data;
            const projectId=JSON.parse(sessionStorage.getItem('project')).projectId;
            this.form={
                ...this.form,
                ...data,
            };
            this.getCourtsMenu(projectId).then(res=>{
                if(!res)return;
                this.options = res;
            })
        },
        methods: {
            ...mapActions('asset',[
                'createRoom', 
                'updateRoom',
                'getCourtsMenu'
            ]),
            create(obj) {
                this.createRoom(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'RoomList'})
                })
            },
            edit(obj){
                this.updateRoom(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'RoomList'})
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>