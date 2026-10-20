import { bcryptAdapter, envs, JWTGenerator } from "../../../../config";
import { UserModel } from "../../../../data";
import { CustomError } from "../../../../domain";
import { RegisterUserDTO } from "../../../../domain/dto";
import { LoginUserDTO } from "../../../../domain/dto/auth/login-user.dto";
import { UserEntity } from "../../../../domain/entity/user.entity";
import { EmailService } from "./email.service";

export class AuthService {
    constructor(
        private readonly emailService: EmailService
    ) {

    }

    public async registerUser(registerUserDTO: RegisterUserDTO) {
        const userExists = await UserModel.findOne({ email: registerUserDTO.email })

        if (userExists) throw CustomError.badRequest('Email already exists');

        const user = new UserModel(registerUserDTO);

        user.password = await bcryptAdapter.hash(registerUserDTO.password);

        await user.save();

        await this.sendValidationLinkEmail(registerUserDTO.email);

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

        const token = await JWTGenerator.generateToken({ id: user.id })

        if (!token) throw CustomError.internalServer('Error while generating jwt');

        return {
            user: rest,
            token
        };
    }

    public async validateEmail(token: string) {
        const payload = await JWTGenerator.validateToken<{ email: string }>(token);

        if (!payload?.email) throw CustomError.unauthorized('Invalid or expired token');

        const user = await UserModel.findOne({ email: payload.email });

        if (!user) throw CustomError.notFound('User not found');

        user.emailValidated = true;
        await user.save();
    }

    private async sendValidationLinkEmail(email: string) {
        const token = await JWTGenerator.generateToken({ email });

        if (!token) throw CustomError.internalServer('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email:</p>
            <a href="${link}">Validate your email: ${email}</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html
        }

        const isSent = this.emailService.sendEmail(options);

        if (!isSent) throw CustomError.internalServer('Error sending email');
    }
}