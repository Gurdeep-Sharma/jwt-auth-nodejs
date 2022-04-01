import { DocumentType } from "@typegoose/typegoose";
import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";
import utils from "../../../utils";
import { IAPIResponse } from "../interfaces/IAPIResponse";
import { User } from "../models/user.model";
import { SignInViewmodel, SignUpViewmodel } from "../viewmodels/user";
import userService from "./user.service";
class UserController {
  signUp = async (
    req: Request,
    res: Response<IAPIResponse>,
    next: NextFunction
  ) => {
    try {
      let conversionResult = await utils.ValidateAndConvert(
        SignUpViewmodel,
        req.body
      );

      if (conversionResult && conversionResult?.error?.length > 0) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          status_code: HttpStatus.BAD_REQUEST,
          success: false,
          errors: conversionResult.error,
        });
      } else {
        let viewmodel: SignUpViewmodel =
          conversionResult.data as SignUpViewmodel;
        let serviceResult = await userService.signUp(viewmodel);

        if (serviceResult && serviceResult.status_code === HttpStatus.OK)
          return res.status(HttpStatus.OK).send({
            status_code: HttpStatus.OK,
            success: true,
            data: serviceResult.data,
          });
        else
          return res.status(serviceResult.status_code).send({
            status_code: serviceResult.status_code,
            success: false,
            errors: serviceResult.data,
          });
      }
    } catch (error) {
      next(error);
    }
  };
  signIn = async (
    req: Request,
    res: Response<IAPIResponse>,
    next: NextFunction
  ) => {
    try {
      let conversionResult = await utils.ValidateAndConvert(
        SignInViewmodel,
        req.body
      );

      if (conversionResult && conversionResult?.error?.length > 0) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          status_code: HttpStatus.BAD_REQUEST,
          success: false,
          errors: conversionResult.error,
        });
      } else {
        let viewmodel: SignInViewmodel =
          conversionResult.data as SignInViewmodel;
        let serviceResult = await userService.signIn(viewmodel);

        if (serviceResult && serviceResult.status_code === HttpStatus.OK)
          return res.status(HttpStatus.OK).send({
            status_code: HttpStatus.OK,
            success: true,
            data: serviceResult.data,
          });
        else
          return res.status(serviceResult.status_code).send({
            status_code: serviceResult.status_code,
            success: false,
            errors: serviceResult.data,
          });
      }
    } catch (error) {
      next(error);
    }
  };
  getUserDetails = async (
    req: Request,
    res: Response<IAPIResponse>,
    next: NextFunction
  ) => {
    try {
      let tokenUserDetails = <DocumentType<User>>req.user;
      let user_obj = tokenUserDetails.toObject();
      let user_details = {};
      Object.entries(user_obj).forEach(([key, value]: any) => {
        if (key !== "password") user_details[key] = value;
      });

      return res.status(HttpStatus.OK).send({
        status_code: HttpStatus.OK,
        success: true,
        data: {
          user_details,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
export default new UserController();
