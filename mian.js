let price = 5
let quantity = 2
let total = 0

let dep = new Set() //dep，代表依赖关系，用来储存 effects
// 在一个匿名函数中计算我们的总数，把它储存在 effect 里面
// 这是我们想要储存在 storage 里的代码
let effect =()=>{
	total = price * quantity
}
// 跟踪依赖，将effect 添加到 Set 中。使用 Set 是因为它不允许拥有重复值
// 当我们尝试添加同样的effect，它不会变成两个
function track(){dep.add(effect)}
//历遍我们存储的每一个 effect ，然后运行它们
function trigger(){dep.forEach(effect=>effect())}
//
//当我们想保存 effect 中的代码时，我们需要调用 track()
track()
//然后再次调用 effect 来计算首次总数
effect()
//之后某个时刻，我们将调用 trigger 来运行所有储存了的代码
trigger()