/* this file is about creating utility means that creating wrapper to database connection and this 
function take that function as argument and execute it 
*/


//It is wrapper function by using promises
const asyncHandler = (requestHandler) => {
         (req, res, next) => {
                  Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
         }
}

         
export {asyncHandler}



// it higher order function and higher order function means that function whose take as argument another function

// const asyncHandler = () => {}
// const asyncHandler = (function) => () => {}
// const asyncHandler = (function) => async () => {}



// It is wrapper function by using try-catch
// const asyncHandler = (fn) => async (req, res, next) => {
//          try {
//                   await fn(req, res, next)
//          } catch (error) {
//                   res.status(err.code || 500).json({
//                            success: false,
//                            message: err.message
//                   })
//          }
// }