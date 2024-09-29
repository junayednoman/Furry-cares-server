import { model, Schema } from "mongoose";
import { defaultProfileImage } from "../../constant";
import { TUserModel, TUser } from "./auth.interface";
import bcrypt from 'bcrypt'

const userSchema = new Schema<TUser, TUserModel>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        bio: { type: String, },
        profilePicture: { type: String, default: defaultProfileImage },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        createdAt: { type: Date, },
        updatedAt: { type: Date, },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
)


userSchema.pre('save', async function (next) {
    const password = await bcrypt.hash(this.password, 10)
    this.password = password
    next()
});

userSchema.statics.isUserExist = async function (email: string) {
    const user = await UserModel.findOne({ email })
    return user
}



// make and export the user model
export const UserModel = model<TUser, TUserModel>('User', userSchema)