import { Geometry } from "./Geometry"
import { Triangle } from "./Trigangle"
import { Vector3 } from "./Vector3"

type IndexedPoint = {
  index: number
  x: number,
  y: number,
  z: number,
}

export function createSphere(divisionX: number, divisionZ: number) {
  const points: IndexedPoint[] = []
  const rings: IndexedPoint[][] = []
  const top: IndexedPoint = {
    index: 0,
    x: 0,
    y: 0,
    z: 1,
  }
  points.push(top)
  
  const triangles: Triangle[] =[]
  let index = 1;
  for (let i = 1; i < divisionZ; i++) {
    const ring = createRing(Math.sin(Math.PI / divisionZ * i), divisionX, index)
    ring.forEach(p => {
      p.z = Math.cos(Math.PI / divisionZ * i)
    })
    rings.push(ring)
    index += divisionX
    ring.forEach(p => points.push(p))
  }

  const bottom: IndexedPoint = {
    index,
    x: 0,
    y: 0,
    z: -1,
  }
  points.push(bottom)

  for (let i = 0; i < divisionX - 1; i++) {
    triangles.push([top.index, rings[0][i].index, rings[0][i + 1].index])
  }
  triangles.push([top.index, rings[0][divisionX - 1].index, rings[0][0].index])

  for (let j = 0; j < rings.length - 1; j++) {
    const ring = rings[j]
    const nextRing = rings[j + 1] 
    for (let k = 0; k < divisionX - 1; k++) {
      triangles.push([ring[k].index, nextRing[k].index, ring[k + 1].index])
      triangles.push([nextRing[k].index, nextRing[k + 1].index, ring[k + 1].index])
    }
    triangles.push([ring[divisionX - 1].index, nextRing[divisionX - 1].index, ring[0].index])
    triangles.push([nextRing[divisionX - 1].index, nextRing[0].index, ring[0].index])
  }
  for (let i = 0; i < divisionX - 1; i++) {
    triangles.push([bottom.index, rings[divisionZ - 2][i + 1].index, rings[divisionZ - 2][i].index])
  }
  triangles.push([bottom.index, rings[divisionZ - 2][0].index, rings[divisionZ - 2][divisionX - 1].index])

  return new Geometry(points.map(p => {
    return new Vector3(
      p.x,
      p.y,
      p.z
    )
  }), triangles)
}

function createRing(radius: number, indices: number, startIndex: number) {
  const points: IndexedPoint[] = []
  for (let i = 0; i < indices; i++) {
    points.push({
      index: startIndex + i,
      x: radius * Math.cos(2 * Math.PI / indices * i),
      y: radius * Math.sin(2 * Math.PI / indices * i),
      z: 0,
    })
  }
  return points
}