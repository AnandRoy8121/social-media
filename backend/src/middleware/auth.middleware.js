export const protectRoute = async(req,res,next)=>{
    if(!req.auth().isAuthenticated){
        return res.status(401).json({message:'Unauthenticated - User must be logged in'})
    }
    next()
}