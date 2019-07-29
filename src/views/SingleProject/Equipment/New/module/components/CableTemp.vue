<template>
    <AddEquipForm
        :form="form"
        :next="next" 
        :pre="pre"
    >
        <template>
            <el-form-item label="所属资产类型">
                <el-select v-model="form.assetType">
                    <el-option label="井盖" :value="0"></el-option>
                    <el-option label="台区" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="!form.assetType">
                <el-form-item label="所属井盖" prop="trapId">
                    <el-select v-model="form.trapId">
                        <el-option label="井盖一" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属线缆" prop="lineId">
                    <el-select v-model="form.lineId">
                        <el-option label="线缆一" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template v-else>
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
                <el-form-item label="所属配电柜">
                    <el-select v-model="form.chestId">
                        <el-option label="配电柜一" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            
            <!-- 井盖下传感设备只有魔节 -->
            <el-form-item 
                label="所属魔节" 
                prop="magicId"
                v-if="!form.assetType"
            >
                <el-select v-model="form.magicId">
                    <el-option label="魔节一" value="0"></el-option>
                </el-select>
            </el-form-item>

            <!-- 台区下传感设备有魔节 or 集中器 -->
            <template v-else>
                <el-form-item label="所属传感设备" >
                    <el-select v-model="form.sensorType">
                        <el-option label="魔节" :value="0"></el-option>
                        <el-option label="集中器" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item 
                    label="所属魔节" 
                    prop="magicId"
                    v-if="!form.sensorType"
                >
                    <el-select v-model="form.magicId">
                        <el-option label="魔节一" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item 
                    label="所属集中器" 
                    prop="centerId" 
                    v-else
                >
                    <el-select v-model="form.centerId">
                        <el-option label="集中器一" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>
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
                    isIndependent:false,
                    assetType:0,
                    sensorType:0
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>