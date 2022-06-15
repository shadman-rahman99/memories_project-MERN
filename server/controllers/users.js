import bcrypt from 'bcryptjs' 
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const signIn = async(req,res)=>{
    const { email, password } = req.body
    try{
        const existingUser = await User.findOne({email})
        if(!existingUser) return res.status(404).json({ message: 'User doesnt exist.'})
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password) 
        if(!isPasswordCorrect) return res.status(400).json({message:'Invalid credentials.'})
        const token = jwt.sign({email:existingUser?.email, id: existingUser?._id}, 'test', {expiresIn:'1h'})
        res.status(200).json({result:existingUser,token})
    }catch(error){
        res.status(500).json({message:'Something went wrong.'})
    }
}
export const signUp = async(req,res)=>{
    const { email, password, firstName, lastName } = req.body;

    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 12);
        
    // create() func sets all the objects accordingly by matching the name of the objects here with
    // name of the key in the model schema. for e.g. here email has not been set to any value 
    //  because in User schema in models/user.js, there is already a key namedemail so it 
    // automatically set the value of email from req.body to that key. But we're setting
    // values with different name for password key in schema which is hashedPassword so we have to
    // specify it like password: hashedPassword .
      const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
  
      const token = jwt.sign( { email: result.email, id: result._id }, 'test', { expiresIn: "1h" } );
  
      res.status(201).json({ result, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      
      console.log(error);
    }
}
