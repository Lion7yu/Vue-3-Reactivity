let activeEffect = null
function effect(eff){//声明一个名为 effect 的函数，它接受一个匿名函数
  activeEffect = eff
  activeEffect() 
  activeEffect = null //复位 activeEffect
} 