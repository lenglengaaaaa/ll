<template>
    <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="magicForm">
        <el-form-item label="技术选型" prop="pattern">
            <el-select v-model="form.pattern">
                <el-option label="LoRa" value="0"></el-option>
                <el-option label="NB-IOT" value="1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备ID" prop="id">
            <el-input v-model="form.id" placeholder="请输入设备ID"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="number">
            <el-input v-model="form.number" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item :label="`设备EUI(请填写${form.pattern==0?16:15}位设备EUI)`" prop="eui">
            <el-input 
                v-model="form.eui" 
                :placeholder="form.pattern==0?'0000000000000000':'000000000000000'" 
                :maxlength="form.pattern==0?16:15"
            />
        </el-form-item>
        <el-form-item label="所属井盖" prop="coverId">
            <el-select v-model="form.coverId">
                <el-option label="井盖一" value="0"></el-option>
            </el-select>
        </el-form-item>

        <template v-if="type===1">
            <el-form-item label="所属线缆" prop="lineId">
                <el-select v-model="form.lineId">
                    <el-option label="线缆一" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属魔节" prop="magicId">
                <el-select v-model="form.magicId">
                    <el-option label="魔节一" value="0"></el-option>
                </el-select>
            </el-form-item>
        </template>
        
        <el-form-item label="位置信息" prop="address" class="address">
            <el-cascader :options="options" v-model="city"></el-cascader>
            <el-input v-model="form.address" placeholder="请输入设备位置信息"></el-input>
        </el-form-item>
        <el-form-item label="网关经纬度" class="map">
            <MapSingle 
                vid="newApply"
                :position="form.position"
                :get="getPostion"
            />
        </el-form-item>
        <el-form-item class="submit" v-if="!editFlag">
            <el-button type="danger" @click="pre">
                上一步
            </el-button>
            <el-button type="primary" @click="submit" >
                {{type===0?'下一步':'完成'}}
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
    import {MapSingle} from '@/components/Maps'
    import {options} from '@/utils/options'

    export default {
        components: {
            MapSingle
        },
        props: {
            next:Function,
            pre:Function,
        },
        data() {
            var checkEui = (rule, value, callback) => {
                if(!value){
                    return callback(new Error('请输入设备EUI'))
                }
                const r =  /[\u4E00-\u9FA5]/;
                if(r.test(value)){
                    return callback(new Error('请输入数字或字母'))
                }
                if (value.length<16) {
                    return callback(new Error('设备EUI长度为16'));
                }
                callback();
            };
            return {
                options:options,
                form: {
                    pattern:'0',
                    id:'',
                    name:'',
                    number:'',
                    eui:'',
                    coverId:'',
                    lineId:'',
                    magicId:'',
                    city:[],
                    address:'',
                    position:[113.991244,22.5959]
                },
                rules: {
                    pattern: [{ required: true, trigger: 'blur' }],
                    id: [{ required: true, message: '请输入设备ID', trigger: 'blur' }],
                    name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
                    number: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
                    eui: [{ required: true, validator: checkEui, trigger: 'blur' }],
                    coverId: [{ required: true, message: '请选择设备所属井盖', trigger: 'change' }],
                    lineId: [{ required: true, message: '请选择设备所属线缆', trigger: 'change' }],
                    magicId: [{ required: true, message: '请选择设备所属魔节', trigger: 'change' }],
                }
            }
        },
        computed: {
            type() {
                return this.$store.state.app.appType 
            },
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
                this.$refs.magicForm.validate((valid) => {
                    if (valid) {
                        if(this.type===0){
                            this.next()
                        }else{
                            this.$message({
                                message: '添加设备成功',
                                type: 'success'
                            });
                            this.$router.push({name:'EquList'})
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getPostion(lng,lat){
                this.form ={
                    ...this.form,
                    position:[lng,lat]
                }
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

<style lang="scss">
    @import '@/styles/form.scss';

    .el-form{
        width: 1100px;
    }

</style>