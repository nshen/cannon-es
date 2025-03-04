import type { Vec3 } from '../math/Vec3'
import type { Quaternion } from '../math/Quaternion'
import type { Body } from '../objects/Body'
import type { Material } from '../material/Material'

export const SHAPE_TYPES = {
  SPHERE: 1 as const,
  PLANE: 2 as const,
  BOX: 4 as const,
  COMPOUND: 8 as const,
  CONVEXPOLYHEDRON: 16 as const,
  HEIGHTFIELD: 32 as const,
  PARTICLE: 64 as const,
  CYLINDER: 128 as const,
  TRIMESH: 256 as const,
}

export type ShapeType = typeof SHAPE_TYPES[keyof typeof SHAPE_TYPES]

export type ShapeOptions = {
  type?: ShapeType
  collisionResponse?: boolean
  collisionFilterGroup?: number
  collisionFilterMask?: number
  material?: Material
}

/**
 * Base class for shapes
 * @class Shape
 * @constructor
 * @param {object} [options]
 * @param {number} [options.collisionFilterGroup=1]
 * @param {number} [options.collisionFilterMask=-1]
 * @param {number} [options.collisionResponse=true]
 * @param {number} [options.material=null]
 * @author schteppe
 */
export class Shape {
  id: number // Identifyer of the Shape.
  type: ShapeType | 0 // The type of this shape. Must be set to an int > 0 by subclasses.
  boundingSphereRadius: number // The local bounding sphere radius of this shape.
  collisionResponse: boolean // Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled.
  collisionFilterGroup: number
  collisionFilterMask: number
  material: Material | null
  body: Body | null

  static idCounter: number
  static types: typeof SHAPE_TYPES

  constructor(options: ShapeOptions = {}) {
    this.id = Shape.idCounter++
    this.type = options.type || 0
    this.boundingSphereRadius = 0
    this.collisionResponse = options.collisionResponse ? options.collisionResponse : true
    this.collisionFilterGroup = options.collisionFilterGroup !== undefined ? options.collisionFilterGroup : 1
    this.collisionFilterMask = options.collisionFilterMask !== undefined ? options.collisionFilterMask : -1
    this.material = options.material ? options.material : null
    this.body = null
  }

  /**
   * Computes the bounding sphere radius. The result is stored in the property .boundingSphereRadius
   * @method updateBoundingSphereRadius
   */
  updateBoundingSphereRadius(): void {
    throw `computeBoundingSphereRadius() not implemented for shape type ${this.type}`
  }

  /**
   * Get the volume of this shape
   * @method volume
   * @return {Number}
   */
  volume(): number {
    throw `volume() not implemented for shape type ${this.type}`
  }

  /**
   * Calculates the inertia in the local frame for this shape.
   * @method calculateLocalInertia
   * @param {Number} mass
   * @param {Vec3} target
   * @see http://en.wikipedia.org/wiki/List_of_moments_of_inertia
   */
  calculateLocalInertia(mass: number, target: Vec3): void {
    throw `calculateLocalInertia() not implemented for shape type ${this.type}`
  }

  calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void {
    throw `calculateWorldAABB() not implemented for shape type ${this.type}`
  }
}

Shape.idCounter = 0

/**
 * The available shape types.
 * @static
 * @property types
 * @type {Object}
 */
Shape.types = SHAPE_TYPES
