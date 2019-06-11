
class SOM {
  
  constructor({
    mapSize,
    vectorSize,
    learningRate = 0.07,
    radiusShrinkRate = 14000
  }){

    this.units = []
    this.learningRate = learningRate
    this.step = 0
    this.radiusShrinkRate = radiusShrinkRate

    this.build(mapSize,vectorSize)

  }

  build(mapSize,vectorSize){

    for(var x = 0; x < mapSize; x++){
      for(var y = 0; y < mapSize; y++){
        const vector = Array.from({length: vectorSize}, Math.random)
        this.units.push({ x, y, vector })
      }
    }

  }

  compute(input){

    const output = []
    let bmi = {similarity: 0}

    for(var i = 0; i < this.units.length; i++){
      const unit = this.units[i]
      const dist = this.getEuclideanDistance(input,unit.vector)
      const similarity = 1 / (dist + 1)
      output[i] = similarity
      if(similarity > bmi.similarity){
        bmi = {similarity, index: i}
      }
    }

    return {
      vector: output,
      bmi: this.units[bmi.index]
    }

  }

  train(input,bmi){

    this.step++

    for(var i = 0; i < this.units.length; i++){
      const unit = this.units[i]
      const dist = this.getUnitDistance(bmi,unit)
      for(var j = 0; j < input.length; j++){
        const diff = input[j] - unit.vector[j]
        unit.vector[j] += diff * dist * this.learningRate
      }
    }

  }

  getEuclideanDistance(a,b){
    let sum = 0
    for(var j = 0; j < a.length; j++){
      sum += (a[j] - b[j]) ** 2
    }
    return Math.sqrt(sum)
  }

  getUnitDistance(a,b){

    return Math.exp(
      - (
        (Math.pow(b.x - a.x, 2) / 2) +
        (Math.pow(b.y - a.y, 2) / 2)
      ) * (
        this.step / this.radiusShrinkRate
      )
    )

  }

}

try { module.exports = SOM }
catch (e) {}