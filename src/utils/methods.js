/**
 * 资产管理页面,对单个表单项进行重置
 * @param arr 要清除的表单prop值,['roomId']
 */
export const resetSingle =(_this,arr=[],form="equipForm")=>{
    const _fields = _this.$children[0].$refs[form].fields;
    _fields.map(item=>{
        if(arr.includes(item.prop)){
            _this.form[item.prop]&&item.resetField();
        }
    })
}

/**
 * 判断是否最后一条,是请求上一页
 */
export const judgeLastData=(list,current)=>{
    const nextSize = list.length - 1;
    if(!nextSize){
        if(current===1){
            return 1;
        }else{
            return current -1;
        }
    }
}