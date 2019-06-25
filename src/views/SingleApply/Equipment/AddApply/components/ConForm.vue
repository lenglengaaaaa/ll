<template>
    <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="comForm">
        <el-form-item label="设备名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="number">
            <el-input v-model="form.number" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item label="设备EUI" prop="eui">
            <el-input 
                v-model="form.eui" 
                placeholder="0000000000000000" 
                maxlength="16"
            />
        </el-form-item>
        <el-form-item label="入网模式" prop="pattern">
            <el-select v-model="form.pattern" placeholder="请选择入网模式">
                <el-option label="ABP-Device-Profile" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item class="submit" v-if="!editFlag">
            <el-button type="danger" @click="pre">
                上一步
            </el-button>
            <el-button type="primary" @click="submit" >
                下一步
            </el-button>
        </el-form-item>
        <el-form-item class="submit" v-else>
            <el-button type="primary" @click="edit" >
                编辑完成
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        props: {
            next:Function,
            pre:Function
        },
        data() {
            var checkEui = (rule, value, callback) => {
                if(!value){
                    return callback(new Error('请输入设备EUI'))
                }
                // const r =  /^\+?[1-9][0-9]*$/;
                // if(!r.test(value)){
                //     return callback(new Error('请输入正整数'))
                // }
                if (value.length<16) {
                    return callback(new Error('设备EUI长度为16'));
                }
                callback();
            };
            return {
                form: {
                    name:'',
                    number:'',
                    eui:'',
                    pattern:''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入设备名称', trigger: 'blur' },
                    ],
                    number: [
                        { required: true, message: '请输入设备EUI', trigger: 'blur' },
                    ],
                    eui: [
                        { required: true, validator: checkEui, trigger: 'blur' },
                    ],
                    pattern: [
                        { required: true, message: '请选择设备入网模式', trigger: 'blur' }
                    ],
                }
            }
        },
        computed: {
            editFlag(){
                return this.$store.state.app.editObj.editFlag || false
            }
        },
        mounted () {
            const data = this.$store.state.app.editObj.data || {}; 
            this.form={
                ...this.form,
                ...data
            };
        },
        methods: {
            submit() {
                this.$refs.comForm.validate((valid) => {
                    if (valid) {
                        this.next();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            edit(){
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                });
                
                this.$router.push({name:'EquList'})
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '@/styles/form.scss';
</style>