import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { CONSTANTS as CONST } from '../../utils/constants/constants.js'

class CartsManager {
    constructor(path) {
        this.path = path
    }

}

export const cartsManager = new CartsManager("src/db/carts/carts.json")