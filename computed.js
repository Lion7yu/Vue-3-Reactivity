
function computed(getter){
  //创建一个响应式引用
  let result = ref()
  //在effect中运行getter，监听响应值，把 getter 赋值于result.value
  effect(()=>{
    result.value = getter()
  })
  //return the result
  return result
}

