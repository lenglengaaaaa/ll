<template>
    <div class="create_container">
        <template v-if="!this.editFlag">
            <div class="step">
                <el-steps :active="active" finish-status="success" simple>
                    <el-step title="选择设备"></el-step>
                    <el-step title="添加设备"></el-step>
                    <el-step title="激活设备"></el-step>
                </el-steps>
            </div>
            <div class="content">
                <template v-if="active==0">
                    <SelectApply :next="next"></SelectApply>
                </template>
                <template v-if="active==1">
                    <AddApply 
                        :pre="pre"
                        :next="next"
                    />
                </template>
                <template v-else-if="active===2">
                    <ActApply :next="next"></ActApply>
                </template>
            </div>
        </template>
        <template v-else>
            <div class="edit">
                <AddApply />
            </div>
        </template>
    </div>
</template>

<script>
    import {SelectApply,AddApply,ActApply} from './module'

    export default {
        components: {
            SelectApply,
            AddApply,
            ActApply
        },
        data() {
            return {
                active: 0,
                editFlag:false,
            };
        },
        created () {
            const {editFlag} = JSON.parse(sessionStorage.getItem('equipObj'));
            this.editFlag = editFlag;
        },
        methods: {
            pre(){
                this.active-- 
            },
            next() {
                if (this.active++ > 1){
                    this.$message({
                        message: '添加设备成功',
                        type: 'success'
                    });
                    this.$router.push({name:'EquList'})
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 870px) {
        .create_container{
            .step{
                width: 100% !important;
            }
        }
    }
    .create_container{
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        .step{
            width: 60%;
        }
        .content{
            overflow: scroll;
            width: 100%;
            margin-top: 30px;
        }
        .edit{
            width: 100%;
            // height: 100%;
            display: flex;
            justify-content: center;
        }
    }
</style>