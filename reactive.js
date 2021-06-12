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


