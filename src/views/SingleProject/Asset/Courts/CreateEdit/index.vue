<template>
    <cc-assetEdit
        :form="form"
        :create="create"
        :edit="edit"
        :type="0"
    >
        <template>
            <el-form-item label="台区类型">
                <el-select v-model="form.courtsType">
                    <el-option label="开闭所变压器" value="开闭所变压器"></el-option>
                    <el-option label="柱上变压器" value="柱上变压器"></el-option>
                    <el-option label="室内变压器" value="室内变压器"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item 
                label="台区名称(别名)" 
                :rules="[
                    { required: true, message: '请输入台区名称(别名)', trigger: 'blur' },
                ]"
            >
                <el-input v-model="form.remark11" placeholder="请输入台区名称(别名)"></el-input>
            </el-form-item>
            <el-form-item label="主进线">
                <el-input v-model="form.mainComeline" placeholder="请输入主进线"></el-input>
            </el-form-item>
            <el-form-item label="备用进线">
                <el-input v-model="form.comeLine" placeholder="请输入备用进线"></el-input>
            </el-form-item>
            <!-- 1.新增主线ID -->
            <el-form-item 
                label="出线数量" 
                :rules="[{  required:false, trigger: ['change','blue'],message:'出线数量最少为1' }]"
                prop="remark2"
            >
                <el-input-number 
                    v-model="form.remark2"  
                    :min="1" 
                    :max="2"
                    :precision="0"
                    size="medium"
                    controls-position="right"
                />
            </el-form-item>
            <div class="outgoing_line" v-for="(i,index) in form.remark2" :key="index">
                <el-form-item 
                    :label="`出线线路-${index+1}-名称`" 
                    :prop="`listName[${index}]`"
                    :rules="{ required: true, message: '填写出线名称', trigger: 'blur' }"
                >
                    <el-input 
                        v-model="form.listName[index]" 
                        placeholder="请输入出线名称"
                    />
                </el-form-item>
            </div>
            <el-form-item label="变压前电压">
                <el-input v-model="form.beforeVoltage" placeholder="请输入变压前电压"></el-input>
            </el-form-item>
            <el-form-item label="变压后电压">
                <el-input v-model="form.afterVoltage" placeholder="请输入变压后电压"></el-input>
            </el-form-item>
            <el-form-item label="电流等级">
                <el-input v-model="form.electricityLevel" placeholder="请输入电流等级"></el-input>
            </el-form-item>
            <el-form-item label="电压等级">
                <el-input v-model="form.covoltageLevel" placeholder="请输入电压等级"></el-input>
            </el-form-item>
            <el-form-item label="所属断路柜">
                <el-input v-model="form.cutoff" placeholder="请输入所属断路柜"></el-input>
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
                    courtsType:"开闭所变压器",
                    remark2:1,
                    listName:[]
                }
            }
        },
        created () {
            const data = JSON.parse(sessionStorage.getItem('assetObj')).data;
            this.form={
                ...this.form,
                ...data,
            };
        },
        methods: {
            ...mapActions('asset',[
                'createCourts', 
                'updateCourts'
            ]),
            create(obj) {
                const { listName } = obj;
                let loopList;
                if( listName && listName.length ){
                    loopList = listName.reduce((pre, current, index )=>{
                        //3.新增主线ID
                        return [
                            ...pre,
                            {
                                name: current
                            }
                        ]
                    },[])
                }
                
                this.createCourts({
                    ...obj,
                    loopList: loopList || null
                }).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CourtsList'})
                })
            },
            edit(obj){
                this.updateCourts(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CourtsList'})
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>