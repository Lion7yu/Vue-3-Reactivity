const depsMap = new Map()
function track(key){
  //首先我们的跟踪函数要拿到这个特定属性的dep,这里的键不是价格就是数量
  let dep = depsMap.get(key)
  if(!dep){//如果它还没有dep，那我们就建立一个(dep),并把它（dep）放到图里的对应键值上
    depsMap.set(key,(dep = new Set()))
  }
  dep.add(effect)//往dep里添加effect，记住因为这是一个Set，如果它（effect）已经存在，它不会再添加新的effect
}
function trigger(key){
  let dep = depsMap.get(key) //我们的触发函数将获取这个键的dep
  if(dep){ //如果 dep 存在，我们会遍历它，运行其每个 effect
    dep.forEach(effect=>{
      effect()
    })
  }
}
//回到原来的代码，我们的产品总数,以及我们的effect
let product = {price :5, quantity:2}
let total = 0

let effect = ()=>{
  total = product.price * product.quantity
} 
//在这里我们要调用track('quantity'),它将存储effect
track('quantity')
//运行 effect()
effect()
