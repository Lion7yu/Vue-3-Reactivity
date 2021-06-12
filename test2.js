const targetMap = new WeakMap()
let activeEffect = null

function track(target,key){
  //首先，我们只想在我们有activeEffect时运行这段代码
  if(activeEffect){
    let depsMap = targetMap.get(target)
    if(!depsMap){
      targetMap.set(target,(depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if(!dep){
      depsMap.set(key,(dep = new Set()))
    }
    //当我们添加依赖（dep）时我们要添加activeEffect
    dep.add(activeEffect)
  }
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
function reactive(target){
  const handler = {
    get(target,key,receiver){
      let result = Reflect.get(target,key,receiver)
      track(target,key)
      return result
    },
    set(target,key,value,receiver){
      let oldValue = target[key]
      let result = Reflect.set(target,key,value,receiver)
      if(oldValue != result){
        trigger(target,key)
      }
      return result
    },
  }
  return new Proxy(target,handler)
}
function effect(eff){//声明一个名为 effect 的函数，它接受一个匿名函数
  activeEffect = eff //将其（参数）赋值到 activeEffect
  activeEffect() // 运行it
  activeEffect = null //最后复位（设 null）activeEffect
} 
let product = reactive({price: 5, quantity: 2})
let salePrice = 0 //
let total = 0
effect(() => {//用这个函数来计算总数,这样我们就不再需要调用effect，因为它会在我们传递函数时被调用
	total = product.price * product.quantity
})
effect(()=>{//第二个 effect 就是根据产品价格计算新的销售价格
  salePrice = product.price * 0.9
})

console.log( // 输出总数应该时多少，销售价格应该是多少
  `Before updated total (should be 10) = ${total} salePrice (should be 4.5) = ${salePrice}`
)

product.quantity = 3

console.log( // 当数量改变后，输出总数和销售价格
  `Affter updated total (should be 15) = ${total} salePrice (should be 4.5) = ${salePrice}`
)

product.price = 10

console.log( // 当价格改变后，输出总数和销售价格
  `Affter updated total (should be 30) = ${total} salePrice (should be 9) = ${salePrice}`
)



