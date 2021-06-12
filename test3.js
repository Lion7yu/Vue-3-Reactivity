const targetMap = new WeakMap()
function ref(raw){
  const r = {
    get value(){
      //调用跟踪函数,追踪我们正在创建的对象r,键是“value”，然后返回原始值（传入值）
      track(r,'value')
      return raw
    },
    //我们的 setter 接收一个新值，把新值赋值给原始值（raw）
    set value(newVal){
      raw = newVal
      //调用触发函数
      trigger(r,'value')
    },
  }
  //返回这个（r）对象
  return r
}
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
let activeEffect = null
function effect(eff){//声明一个名为 effect 的函数，它接受一个匿名函数
  activeEffect = eff //将其（参数）赋值到 activeEffect
  activeEffect() // 运行it
  activeEffect = null //最后复位（设 null）activeEffect
} 

let product = reactive({price: 5, quantity: 2})
let salePrice = ref(0)
let total = 0
effect(() => {
	total = salePrice.value * product.quantity
})
effect(() => {
  salePrice.value = product.price * 0.9
})

console.log( // 输出总数应该时多少，销售价格应该是多少
  `Before updated total (should be 10) = ${total} salePrice (should be 4.5) = ${salePrice}`
)

product.quantity = 3

console.log( // 当数量改变后，输出总数和销售价格
  `After updated total (should be 15) = ${total} salePrice (should be 4.5) = ${salePrice}`
)

product.price = 10

console.log( // 当价格改变后，输出总数和销售价格
  `After updated total (should be 30) = ${total} salePrice (should be 9) = ${salePrice}`
)



