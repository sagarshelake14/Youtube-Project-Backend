import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";  // it inject like plugin

const commentSchema = new Schema(
         {
                  content: {
                           type: String,
                           required: true
                  },
                  video: {
                           type: Schema.Types.ObjectId,
                           ref: "Video"
                  },
                  owner: {
                           type: Schema.Types.ObjectId,
                           ref: "User"
                  }
         },
         {
                  timestamps: true
         }
)


commentSchema.plugin(mongooseAggregatePaginate)  // it allows aggregations queries

export const Comment = mongoose.model("Comment", commentSchema);