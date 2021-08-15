import { Vector3 } from "./Vector3";
import { Vector2 } from "./Vector2";
import { Triangle } from "./Trigangle";
import { Geometry } from "./Geometry";


function createRing(f: (r: number) => Vector2, division: number): Vector2[] {
  const ring: Vector2[] = []
  for (let i = 0; i < division; i++) {
    const radian = 2 * Math.PI / division * i
    ring.push(f(radian)) 
  }
  return ring
}

function createCircle(radius: number, division: number): Vector2[] {
  return createRing((r) => {
    return new Vector2(radius * Math.cos(r), radius * Math.sin(r))
  }, division)
}

function createCircleIn3D(radius: number, division: number, center: Vector3, normal: Vector3): Vector3[] {
  const nz = normal.z
  const nxy = (new Vector2(normal.x, normal.y)).normalize()
  const xyRadTmp = Math.acos(nxy.dot(new Vector2(1, 0)))
  const radiusXY = nxy.y >= 0 ? xyRadTmp : 2 * Math.PI - xyRadTmp
  const radiusZ = Math.acos(nz)
  const circlePoints = createCircle(radius, division)
  const pointsRotatedY = circlePoints.map(p => {
    const v = new Vector3(p.x, p.y, 0)
    return v.rotateY(radiusZ)
  })
  const pointsRotatedYZ = pointsRotatedY.map(p => {
    return p.rotateZ(radiusXY)
  })
  return pointsRotatedYZ.map(p => {
    return p.add(center)
  })
}

export function createSpiralTube(
  spiralRadius: number,
  tubeRadius: number,
  length: number,
  lengthPerRadian: number,
  spiralDivision: number,
  tubeDivision: number
) {
  let currentRadian = 0
  let radianStep = 2 * Math.PI / spiralDivision
  let totalSteps = length / lengthPerRadian * spiralDivision / 2 / Math.PI
  const rings: Vector3[][] = []
  let startZ = - length / 2
  for (let j = 0; j < totalSteps; j++) {
    const c = new Vector3(spiralRadius * Math.cos(currentRadian), spiralRadius * Math.sin(currentRadian), startZ + lengthPerRadian * currentRadian)
    const n = (new Vector3(-Math.sin(currentRadian), Math.cos(currentRadian), lengthPerRadian)).normalize()
    rings.push(createCircleIn3D(tubeRadius, tubeDivision, c, n))
    currentRadian += radianStep
  }
  let points: Vector3[] = []
  let triangles: Triangle[] = []
  rings[0].forEach(p => {
    points.push(p)
  })
  for (let i = 1; i < rings.length; i++) {
    rings[i].forEach(p => {
      points.push(p)
    })
    for (let j = 0; j < tubeDivision; j++) {
      let i0 = i * tubeDivision + j
      let i1 = j == tubeDivision - 1 ? i * tubeDivision : i * tubeDivision + j + 1
      let i2 = i1 - tubeDivision
      let i3 = i0 - tubeDivision
      triangles.push([i0, i1, i2])
      triangles.push([i2, i3, i0])
    }
  }
  const startCenter = rings[0].reduce((r, p) => {
    return r.add(p)
  }, new Vector3(0, 0, 0)).divideScalar(tubeDivision)
  const startIndex = points.length
  points.push(startCenter)
  Array(tubeDivision).fill(null).forEach((_, i) => {
    const nextI = i == tubeDivision - 1 ? 0 : i + 1
    triangles.push([i, nextI, startIndex]) 
  })
  const endCenter = rings[rings.length - 1].reduce((r, p) => {
    return r.add(p)
  }, new Vector3(0, 0, 0)).divideScalar(tubeDivision)
  const endIndex = points.length
  points.push(endCenter)
  Array(tubeDivision).fill(null).forEach((_, i) => {
    const currentIndex = i + (rings.length - 1) * tubeDivision
    const nextI = (i == tubeDivision - 1 ? 0 : i + 1) + (rings.length - 1) * tubeDivision
    triangles.push([currentIndex, endIndex, nextI]) 
  })
  return new Geometry(points, triangles)
}