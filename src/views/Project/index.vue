<template>
    <Management
        type="project"
        title='项目'
        :data="data"
    >
        <template>
            <el-table-column
                prop="id"
                label="应用ID"
                align="center"
                sortable
                show-overflow-tooltip
            />
            <el-table-column
                prop="name"
                label="应用名称"
                align="center"
                sortable
            >
                <template slot-scope="scope">
                    <el-link type="primary" @click="linkTo('check',scope.row)">{{scope.row.name}}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                label="应用描述"
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
                        id:'22',
                        name:'清华信息港魔戒演示平台',
                        description:'清华信息港魔戒演示平台',
                        type:'1'
                    },
                    {
                        id:'12',
                        name:'低压配电应用',
                        description:'低压配电应用',
                        type:'0'
                    }
                ]
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>