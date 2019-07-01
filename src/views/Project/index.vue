<template>
    <Management
        type="project"
        title='项目'
        :data="data"
    >
        <template>
            <el-table-column
                prop="projectId"
                label="项目ID"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="projectName"
                label="项目名称"
                align="center"
                sortable
            >
                <template slot-scope="scope">
                    <el-link type="primary" @click="skipToDetail(scope.row)">{{scope.row.projectName}}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="projectDetail"
                label="项目描述"
                align="center"
                sortable
                show-overflow-tooltip
            />
        </template>
    </Management>
</template>

<script>
    import {Management} from '../../components/Management'

    export default {
        components: {
            Management,
        },
        data() {
            return {
                data:[
                    {
                        projectId:'22',
                        projectName:'清华信息港魔戒演示平台',
                        projectDetail:'清华信息港魔戒演示平台',
                    },
                    {
                        projectId:'12',
                        projectName:'低压配电应用',
                        projectDetail:'低压配电应用',
                    }
                ]
            }
        },
        methods: {
            skipToDetail(row={}){
                //跳转单个应用管理页面
                this.$store.dispatch('app/setApp',row)
                this.$router.push({name:'ProjectOverview',})
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>