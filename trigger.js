function trigger(target,key){
  //触发函数会检查此对象是否“拥有依赖”的属性
  const depsMap = targetMap.get(target)
  // 如果没有，我们可以直接返回
  if(!depsMap){return} 
   //否则，我们将检查此属性是否具有依赖
  let dep = depsMap.get(key)
  //如果有的话，我们将遍历dep，运行每一个effect
  if(dep){
    dep.forEach(effect => {effect()})
  }
}