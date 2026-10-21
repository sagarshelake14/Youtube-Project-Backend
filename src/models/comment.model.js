import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";  // it inject like plugin

const commentSchema = new Schema(
         {},
         {}
)

commentSchema.plugin(mongooseAggregatePaginate);

