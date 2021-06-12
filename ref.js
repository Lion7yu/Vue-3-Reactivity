function ref(raw){
  const r = {
    get value(){
      //调用跟踪函数,追踪我们正在创建的对象r,键是"value"，然后返回原始值（传入值）
      track(r,'value')
      return raw
    },
    //setter 接收一个新值，把新值赋值给原始值（raw）
    set value(newVal){
      raw = newVal
      //调用触发函数
      trigger(r,'value')
    },
  }
  //返回对象
  return r
}