import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const CartSchema = new Schema({
  products: [
    {
      product: { 
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      title: { 
        type: String,
        required: true
      },
      price: { 
        type: Number,
        required: true
      },
      quantity: { 
        type: Number,
        required: true,
        default: 1
      }
    }
  ]
})

CartSchema.pre('find', function () {
  this.populate({
    path: 'products.product',
    select: 'title price' //Aca filtro solo el titulo y el precio, no me interesa el resto!!...
  })
})

CartSchema.plugin(mongoosePaginate)

export const CartModel = model('carts', CartSchema)