<template>
    <AddEquipForm
        :form="form"
        :next="next" 
        :pre="pre"
    >
        <template>
            <el-form-item :label="`设备EUI(请填写${form.commWay===0?15:16}位设备EUI)`" prop="deviceEui">
                <el-input 
                    v-model="form.deviceEui" 
                    :placeholder="form.commWay===0?'000000000000000':'0000000000000000'" 
                    :maxlength="form.commWay==0?16:15"
                />
            </el-form-item>
            <el-form-item label="所属资产类型">
                <el-select v-model="form.assetType">
                    <el-option label="井盖" :value="0"></el-option>
                    <el-option label="台区" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <template v-if="form.assetType===0">
                <el-form-item label="所属井盖" prop="trapId">
                    <el-select v-model="form.trapId">
                        <el-option label="井盖一" value="0"></el-option>
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
                    assetType:0
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>