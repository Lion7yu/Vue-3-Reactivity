let product = {price: 5, quantity: 2} //product
let proxiedProduct = new Proxy(product,{//proxiedProduct
	get(target,key,receiver){
		console.log('Get was call with key = ' + key)
    return Reflect.get(target,key,receiver)
  },
  set(target,key,value,receiver){
    console.log('Set was called with key = '+ key + ' and value ' + value)
    return Reflect.set(target,key,value,receiver)
  }
}) 

console.log(proxiedProduct.quantity)

//创建一个称为 reactive 的函数,如果你使用过Composition API，你会看起来很熟悉

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

let product = reactive({price: 5, quantity: 2 })
