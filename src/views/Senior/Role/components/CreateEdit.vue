<template>
    <cc-dialog
        title="角色"
        :visible="visible"
        :close="handleClose"
        :editFlag="editFlag"
    >
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="roleForm" status-icon>
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入角色名称" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="父角色" prop="parentId">
                <el-select v-model="form.parentId" placeholder="属于哪个父角色">
                    <el-option l
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input v-model="form.detail" type="textarea" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submitForm" >
                    <i class="el-icon-check"></i>
                    {{editFlag?'编辑完成':'创建完成'}}
                </el-button>
            </el-form-item>
        </el-form>
    </cc-dialog>
</template>

<script> 
    import { mapActions } from 'vuex'

    const restForm ={
        name:'',
        parentId:null,
        detail:''
    }
    
    export default {
        props: {
            visible:Boolean,
            editFlag:Boolean,
            close:Function,
            value:{
                type:Object,
                default:()=>{}
            }
        },
        data() {
            //验证资产编号
            const checkRoleName = (rule, value, callback) => {
                if (!value) { return callback(new Error('请输入角色名称')) };
                const id = this.editFlag ? this.value.id : null ;
                const obj ={id, name:value}
                this.verifyRoleName(obj).then(res=>{
                    if(!res){
                        return callback(new Error('角色名称已存在'));
                    }else{
                        callback()
                    }
                });
            };
            return {
                form: {
                    name:'',
                    parentId:null,
                    detail:''
                },
                rules: {
                    name: [
                        { required: true, validator: checkRoleName, trigger: 'blur' },
                    ],
                    parentId: [
                        { required: true, message: '请选择所属父角色', trigger: 'change' },
                    ],
                },
                roleList:[]
            }
        },
        watch: {
            value(value) {
                this.form = {
                    ...this.form,
                    ...value
                }
            },
        },
        created () {
            this.getChildRole(null).then(res=>{
                if(!res) return;
                this.roleList = res;
            })
        },
        methods: {
            ...mapActions('permission',[
                'verifyRoleName',  
                'getChildRole',
                'createRole',
                'updateRole'
            ]),
            handleClose(result=false) {
                this.form = restForm;
                this.close(result);
            },
            submitForm() {
                this.$refs.roleForm.validate((valid) => {
                    if (valid) {
                        if(!this.editFlag){
                            this.createRole(this.form).then(res=>{
                                if(!res)return;
                                this.handleClose(res)
                            })
                            return
                        }
                        this.updateRole(this.form).then(res=>{
                            if(!res)return;
                            this.handleClose(res)
                        })
                    } else {
                        return false;
                    }
                });
            },
        },
    }
</script>

<style lang="scss">
</style>