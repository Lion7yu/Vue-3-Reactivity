//从目标图开始，它存储着每个响应式对象的依赖
const targetMap = new WeakMap()

function track(target,key){
  //然后在我们的跟踪方法中，我们首先要拿到这个目标的deps图，在我们的例子中是产品(product)
  let depsMap = targetMap.get(target)
  //如果它还不存在，我们将为这个对象创建一个新的deps图
  if(!depsMap){
    targetMap.set(target,(depsMap = new Map()))
  }
  //然后我们将获得这个属性的依赖对象(quantity)
  let dep = depsMap.get(key)
  //如果它不存在，我们将创建一个新的 Set
  if(!dep){
    depsMap.set(key,(dep = new Set()))
  }
  //然后我们将把 effect 添加到依赖中
  dep.add(effect)
}
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
//再次回到产品
let product = reactive({price:5,quantity:2})
let total = 0
let effect = () =>{
  total = product.price * product.quantity
}
//这次，当我们调用 track 时，我们要传递产品和数量
track(product,'quantity')
effect()