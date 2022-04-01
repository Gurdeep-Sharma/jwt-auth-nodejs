import { getModelForClass, prop } from "@typegoose/typegoose";

export class User {
  @prop()
  name: string;

  @prop()
  mobile_number: string;

  @prop({ unique: true })
  email: string;

  @prop()
  password: string;
}
const USER_MODEL = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
});
export default USER_MODEL;
