<template>
    <div class="create_container">
        <template v-if="!this.editFlag">
            <div class="step">
                <el-steps :active="active" finish-status="success" simple>
                    <el-step title="选择资产"></el-step>
                    <el-step title="添加资产"></el-step>
                </el-steps>
            </div>
            <div class="content">
                <template v-if="active==0">
                    <SelectAsset :next="next"></SelectAsset>
                </template>
                <template v-if="active==1">
                    <AddAsset :next="next" :pre="pre"></AddAsset>
                </template>
            </div>
        </template>
        <template v-else>
            <div>
                <AddAsset />
            </div>
        </template>
    </div>
</template>

<script>
    import {SelectAsset,AddAsset} from './components'

    export default {
        components: {
            SelectAsset,
            AddAsset,
        },
        data() {
            return {
                active: 0
            };
        },
        computed:{
            editFlag(){
                return this.$store.state.app.editObj.editFlag || false
            }
        },
        methods: {
            pre(){
                this.active-- 
            },
            next() {
                this.active++
            }
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 992px) {
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
        .step{
            width: 60%;
        }
        .content{
            width: 100%;
            margin-top: 30px;
            display: flex;
            justify-content: center;
        }
    }
</style>