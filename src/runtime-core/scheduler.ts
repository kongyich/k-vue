
const queue: any = []
const p = Promise.resolve()
let isFlushPedding = false

const nextTick = function(fn) {
  return fn ? p.then(fn) : p
}

export const queueJobs = function(job) {

  if(isFlushPedding) return
  isFlushPedding = true

  if(!queue.includes(job)) {
    queue.push(job)
  }

  queueFlush()
}


const queueFlush = function() {
  nextTick(flushJobs)
}

const flushJobs = function() {
  isFlushPedding = false
  let job
  while(job = queue.shift()) {
    job && job()
  }
}

