<template>
    <cc-assetEdit
        :form="form"
        :create="create"
        :edit="edit"
        :type="2"
    >
        <template>
            <el-form-item label="所属台区" prop="courtsId">
                <el-select v-model="form.courtsId" @change="changeCourts">
                    <el-option 
                        v-for="i in courtsMenu" 
                        :key="i.id" 
                        :label="i.name" 
                        :value="i.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电房" prop="roomId" >
                <el-select v-model="form.roomId" @change="changeRoom">
                    <el-option 
                        v-for="i in roomMenu" 
                        :key="i.id" 
                        :label="i.name" 
                        :value="i.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="是否在配电柜中">
                <el-select v-model="form.inChest" @change="changeInChest">
                    <el-option label="否" :value="0"></el-option>
                    <el-option label="是" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属配电柜" v-if="form.inChest===1" prop="parentId">
                <el-select v-model="form.parentId">
                    <el-option 
                        v-for="i in chestMenu" 
                        :key="i.id" 
                        :label="i.name" 
                        :value="i.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="出线数量">
                <el-input v-model.number="form.count" placeholder="请输入出现数量"></el-input>
            </el-form-item>
            <el-form-item 
                v-for="(i,index) in form.count" 
                :key="index" 
                :label="`出线线路-${index+1}`" 
                :prop="`listName[${index}]`"
                :rules="{ required: true, message: '填写出线名称', trigger: 'blur' }"
            >
                <el-input v-model="form.listName[index]" placeholder="请输入线路名称"></el-input>
            </el-form-item>
        </template>
    </cc-assetEdit>
</template>

<script>
    import {mapActions} from 'vuex'
    import {resetSingle} from '@/utils/methods'

    export default {
        data() {
            return {
                form: {
                    roomId:'',
                    parentId:null,
                    inChest:0,
                    count:1,
                    listName:[]
                },
                courtsMenu:[],
                roomMenu:[],
                chestMenu:[],
            }
        },
        created () {
            const {editFlag,data} = JSON.parse(sessionStorage.getItem('assetObj'));
            const projectId=JSON.parse(sessionStorage.getItem('project')).id;
            //获取台区下拉
            this.getCourtsMenu(projectId).then(res=>{
                if(!res)return;
                this.courtsMenu = res;
                //当状态为编辑时,获取下拉配电房&配电柜
                if(editFlag){
                    this.getRoomList(data.courtsId);
                    this.getChestList(data.roomId);
                }
            })
            //排序后获取出现名称
            const arr = data.switchList&&this._.sortBy(data.switchList,(item)=>{
                return item.id
            }).map(item=>item.name) || [];
            //赋值
            this.form={
                ...this.form,
                inChest:data.parentId>0?1:0,
                count:data.switchList&&data.switchList.length || 1,
                listName:arr,
                ...data
            };
        },
        methods: {
            ...mapActions('asset',[
                'getCourtsMenu',
                'getRoomMenu',
                'getChestMenu',
                'createChest', 
                'updateChest'
            ]),
            create(obj) {
                const {listName} = obj;
                let list ;
                if(listName&&listName.length){
                    list = listName.reduce((pre,current,index)=>{
                        return [...pre,{name:current}]
                    },[])
                }
                const data = {
                    ...obj,
                    switchList:list || null
                }
                this.createChest(data).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CabinetList'})
                })
            },
            edit(obj){
                const {switchList,listName} = obj;
                const result = this._.sortBy(switchList,item=>item.id);
                let list ;
                if(listName&&listName.length){
                    list = listName.reduce((pre,current,index)=>{
                        return [...pre,{
                            id:result&&result.length&&result[index]&&result[index].id || null,
                            name:current
                        }]
                    },[])
                }
                const data = {
                    ...obj,
                    switchList:list || null
                }
                this.updateChest(data).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CabinetList'})
                })
            },
            //根据台区ID获取台区下的配电房列表
            changeCourts(id){
                resetSingle(this,['roomId','parentId'],'assetForm');
                this.getRoomList(id);
            },
            //根据配电房ID获取台区下的配电柜
            changeRoom(id){
                resetSingle(this,['parentId'],'assetForm');
                this.getChestList(id)
            },
            changeInChest(val){
                if(!val){ 
                    resetSingle(this,['parentId'],'assetForm');
                }
            },
            //获取配电房列表
            getRoomList(id){
                this.getRoomMenu(id).then(res=>{
                    if(!res)return;
                    this.roomMenu = res;
                })
            },
            //获取配电柜列表
            getChestList(id){
                this.getChestMenu({id,type:0}).then(res=>{
                    if(!res) return;
                    this.chestMenu = res;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>