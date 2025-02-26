import mongoose,{Schema} from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    blogs:[
        {
            type:Schema.Types.ObjectId,
            ref:'Blog'
        }
    ]
},)

export const Category= mongoose.model("Category", categorySchema);