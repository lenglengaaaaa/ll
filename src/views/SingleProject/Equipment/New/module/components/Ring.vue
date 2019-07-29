<template>
    <AddEquipForm
        :form="form"
        :next="next" 
        :pre="pre"
    >
        <template>
            <el-form-item label="是否为独立传感器(是否自身上传数据)">
                <el-select v-model="form.isIndependent">
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="form.isIndependent">
                <el-form-item :label="`设备EUI(请填写${form.commWay===0?15:16}位设备EUI)`" prop="deviceEui">
                    <el-input 
                        v-model="form.deviceEui" 
                        :placeholder="form.commWay===0?'000000000000000':'0000000000000000'" 
                        :maxlength="form.commWay==0?16:15"
                    />
                </el-form-item>
                <el-form-item 
                    label="所属集中器" 
                    prop="centerId" 
                >
                    <el-select v-model="form.centerId">
                        <el-option label="集中器一" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <el-form-item label="所属台区" prop="courtsId">
                <el-select v-model="form.courtsId">
                    <el-option label="台区一" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电房" prop="roomId">
                <el-select v-model="form.roomId">
                    <el-option label="配电房一" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电柜" prop="chestId">
                <el-select v-model="form.chestId">
                    <el-option label="配电柜一" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属出线线路" prop="switchId">
                <el-select v-model="form.switchId">
                    <el-option label="出线一" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="相序" prop="outLineId">
                <el-select v-model="form.outLineId">
                    <el-option label="A" value="0"></el-option>
                </el-select>
            </el-form-item>
        </template>
    </AddEquipForm>
</template>

<script>
    import AddEquipForm from '@/components/AddEquipForm'

    export default {
        components: {
            AddEquipForm,
        },
        props: {
            next:Function,
            pre:Function
        },
        data() {
            return {
                form: {
                    commWay:0,
                    isIndependent:false
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>