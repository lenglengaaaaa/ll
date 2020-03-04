<template>
    <div class="Permission-container">
        <div class="wrap">
            <el-row >
                <el-col :span="6">模块</el-col>
                <el-col :span="18">方法</el-col>
            </el-row>
            <CheckBox 
                v-for="item in data"
                :key="item.id"
                :value="item"
                :getChecked="getChecked"
                :parentCheckAll="parentCheckAll"
            />
            <el-row >
                <!-- <el-col :span="6">
                    <el-checkbox 
                        v-model="parentCheckAll" 
                    >
                        全选
                    </el-checkbox>
                </el-col> -->
                <el-col :span="24">
                    <el-button type="primary" size="small" @click="opera('save')">保存</el-button>
                    <el-button size="small" @click="opera('back')">返回</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import CheckBox from '../components/CheckBox'

    export default {
        components: {
            CheckBox,
        },
        data() {
            return {
                data:[
                    {
                        id:1,
                        title:'首页',
                        authority:['首页']
                    },
                    {
                        id:2,
                        title:'台区管理',
                        authority:['增加','删除','查看','修改']
                    },
                    {
                        id:3,
                        title:'配电房管理',
                        authority:['增加','删除','查看','修改']
                    }
                ],
                result:[],
                parentCheckAll:false
            };
        },
        created () {
            const {name} =JSON.parse(sessionStorage.getItem("obj")).data;
            this.$route.meta.title=name;
            
        },
        computed: {
            defaultLength() {
                return this.data.reduce((pre,current)=>{
                    return [...pre,...current.authority];
                },[]).length 
            },
            currentLength(){
                return this.result.reduce((pre,current)=>{
                    return [...pre,...current.value];
                },[]).length
            }
        },
        methods: {
            //获取子组件选中状态
            getChecked(obj) {
                const {title,value} = obj;
                const flag = this._.some(this.result, ['title', title]);
                if(!flag) {  
                    this.result = [...this.result,obj] 
                }else{
                    this.result = this.result.reduce((pre,current)=>{
                        if(current.title === obj.title) return [...pre,{...current,...obj}];
                        return [...pre,current];
                    },[])
                }
                if(!value.length){
                    const index = this._.findIndex(this.result, ['title', title]);
                    this.result.splice(index,1);
                }
                // this.parentCheckAll = this.currentLength == this.defaultLength ;
            },
            //操作
            opera(type){
                if(type ==='save'){

                }else{

                }
                this.$router.push({name:'RoleList'});
            }
        },
    }
</script>

<style lang="scss">
    .Permission-container{
        background: #fff;
        height: calc(100% - 42px);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        border: 1px solid #EBEEF5;
        padding: 20px ;
        .wrap{
            border: 1px solid #ebeef5;
            height: 100%;
            overflow-y: auto;
            .el-row{
                .el-col{
                    padding:10px 20px;
                    border-right: 1px solid #ebeef5;
                    border-bottom: 1px solid #ebeef5;
                    font-weight: 700;
                    color: #3c4353;
                    text-align: center;
                    font-size: 15px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
</style>