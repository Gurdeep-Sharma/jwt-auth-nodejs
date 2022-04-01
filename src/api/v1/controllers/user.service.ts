import bcrypt from "bcrypt";
import HttpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import { IServiceResult } from "../interfaces/IServiceResult";
import USER_MODEL, { User } from "../models/user.model";
import { SignInViewmodel, SignUpViewmodel } from "../viewmodels/user";
class UserService {
  signUp = async (viewmodel: SignUpViewmodel): Promise<IServiceResult> => {
    try {
      let foundUser = await USER_MODEL.findOne({
        email: viewmodel.email,
      });

      if (foundUser) {
        return {
          data: {
            message: "User with this email already exists.",
            error: "On SignUp Error",
          },
          status_code: HttpStatus.BAD_REQUEST,
        };
      } else {
        let modelToSave = new User();
        let saltrounds = 12;
        modelToSave = {
          ...viewmodel,
        };

        //create encrypted password
        modelToSave.password = await bcrypt.hash(
          viewmodel.password,
          saltrounds
        );

        let addedUser = await USER_MODEL.create(modelToSave);
        if (addedUser) {
          let newUserObject = {};
          Object.entries(addedUser.toObject()).forEach(([key, value]: any) => {
            if (key !== "password") newUserObject[key] = value;
          });

          return {
            data: {
              user_details: newUserObject,
            },
            status_code: HttpStatus.OK,
          };
        } else
          return {
            data: {
              message: "An error occred while creating user.",
              error: "On SignUp Error",
            },
            status_code: HttpStatus.BAD_REQUEST,
          };
      }
    } catch (error) {
        console.log(error);
      return {
        data: {
          message: "Internal Server Error",
          error: "On SignUp Error",
        },
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  };
  signIn = async (viewmodel: SignInViewmodel): Promise<IServiceResult> => {
    try {
      let foundUser = await USER_MODEL.findOne({
        email: viewmodel.email,
      });
      if (!foundUser)
        return {
          data: {
            message: "User with this email does not exists.",
            error: "On Sign In Error",
          },
          status_code: HttpStatus.BAD_REQUEST,
        };
      if (await bcrypt.compare(viewmodel.password, foundUser.password)) {
        let newUserObject = {};
        Object.entries(foundUser.toObject()).forEach(([key, value]: any) => {
          if (key !== "password") newUserObject[key] = value;
        });
        let jwt_token = jwt.sign(newUserObject, process.env.JWT_TOKEN_SECRET, {
          expiresIn: 60,
          issuer: process.env.JWT_TOKEN_ISSUER,
        });

        return {
          data: {
            user_details: newUserObject,
            jwt_token,
          },
          status_code: HttpStatus.OK,
        };
      } else
        return {
          data: {
            message: "Incorrect password, please try again with correct one.",
            error: "On Sign In Error",
          },
          status_code: HttpStatus.BAD_REQUEST,
        };
    } catch (error) {
        console.log(error);
      return {
        data: {
          message: "Internal Server Error",
          error: "On Sign In Error",
        },
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  };
}
export default new UserService();
