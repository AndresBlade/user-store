import { bcryptAdapter, JWTGenerator } from "../../../../config";
import { UserModel } from "../../../../data";
import { CustomError } from "../../../../domain";
import { RegisterUserDTO } from "../../../../domain/dto";
import { LoginUserDTO } from "../../../../domain/dto/auth/login-user.dto";
import { UserEntity } from "../../../../domain/entity/user.entity";

export class AuthService {
    constructor() {

    }

    public async registerUser(registerUserDTO: RegisterUserDTO) {
        const userExists = await UserModel.findOne({ email: registerUserDTO.email })

        if (userExists) throw CustomError.badRequest('Email already exists');

        const user = new UserModel(registerUserDTO);

        user.password = await bcryptAdapter.hash(registerUserDTO.password);

        await user.save();

        const { password, ...rest } = new UserEntity(
            user.id,
            user.name,
            user.email,
            user.emailValidated,
            user.password,
            user.role
        );

        return {
            user: rest,
            token: 'abc'
        };
    }

    public async loginUser(loginUserDTO: LoginUserDTO) {
        const user = await UserModel.findOne({ email: loginUserDTO.email });

        if (!user) throw CustomError.badRequest("email or password is incorrect");

        const passwordMatched = await bcryptAdapter.compare(loginUserDTO.password, user.password);

        if (!passwordMatched) throw CustomError.badRequest("email or password is incorrect");

        const { password, ...rest } = new UserEntity(
            user.id,
            user.name,
            user.email,
            user.emailValidated,
            user.password,
            user.role
        );

        const token = await JWTGenerator.generateToken({ id: user.id, email: user.email })

        if (!token) throw CustomError.internalServer('Error while generating jwt');

        return {
            user: rest,
            token
        };
    }
}