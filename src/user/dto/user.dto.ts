export class CreateUserDto {
    readonly id?: number;
    readonly firstname?: string;
    readonly lastname?: string;
    readonly email: string;
    readonly password: string;
    readonly confirmPassword: string;
    readonly oldPassword: string;
    readonly newPassword: string;
  }