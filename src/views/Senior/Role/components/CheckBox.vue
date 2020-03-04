<template>
    <div class="check_box">
        <el-row >
            <el-col :span="6">
                <el-checkbox 
                    v-model="checkAll" 
                    :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange"
                >
                    {{title}}
                </el-checkbox>
            </el-col>
            <el-col :span="18">
                <el-checkbox-group v-model="checked" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="item in authority" :label="item" :key="item">{{item}}</el-checkbox>
                </el-checkbox-group>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        props: {
            value:{
                type:Object,
                default:()=>{}
            },
            parentCheckAll:Boolean,
            getChecked:Function
        },
        data() {
            return {
                checkAll: false,
                checked: [],
                isIndeterminate: false
            };
        },
        // watch: {
        //     parentCheckAll(flag) {
        //         this.checkAll = flag;
        //         this.handleCheckAllChange(flag)
        //     }
        // },
        computed: {
            title(){
                return this.value&&this.value.title  
            },
            authority() {
                return this.value.authority&&this.value.authority.map(item=>item)
            }
        },
        methods: {
            handleCheckAllChange(val) {
                this.checked = val ? this.authority : [];
                this.getChecked({title:this.title,value:this.checked});
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.authority.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.authority.length;
                this.getChecked({title:this.title,value});
            }
        }
    }
</script>

<style lang="scss" scoped>
    .check_box{
        .el-row{
            .el-col{
                padding: 10px ;
                border-right: 1px solid #ebeef5;
                text-align: left;
                justify-content: flex-start;
            }
        }
    }
</style>