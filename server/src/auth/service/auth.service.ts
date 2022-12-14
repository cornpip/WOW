import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from '@/user/repository';
import * as argon2 from 'argon2';
import { SigninRequestDto, SignupRequestDto } from '@/auth/dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IsNull, Not } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signupLocal(dto: SignupRequestDto) {
    dto.password = await this.hashData(dto.password);
    const userWithEmail = await this.userRepository.findByEmail(dto.email);
    if (userWithEmail) throw new HttpException('존재하는 email입니다', 404);
    const userWithUsername = await this.userRepository.findByName(dto.username);
    if (userWithUsername)
      throw new HttpException('존재하는 username입니다', 404);
    return await this.userRepository.createUser(dto);
  }

  async signinLocal(dto: SigninRequestDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new HttpException('존재하지 않는 user입니다', 404);
    const passwordMatches = await this.compareData(user.password, dto.password);
    if (!passwordMatches)
      throw new HttpException('password가 일치하지 않습니다', 401);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return { tokens, user };
  }

  async logout(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        hashedRt: Not(IsNull()),
      },
    });
    if (!user) throw new HttpException('존재하지 않는 user입니다', 404);
    await this.userRepository.save({ ...user, hashedRt: null });
  }

  async refresh(res: Response, refresh_token: string) {
    const refreshTokenData = await this.jwtService.verify(refresh_token, {
      secret: this.configService.get('auth.refresh_token_secret'),
    });
    const user = await this.userRepository.findById(refreshTokenData.userId);
    // A유저를 탈취했을 때
    // A유저가 로그아웃하면 막힌다.
    if (!user || !user.hashedRt)
      throw new HttpException(
        '존재하지 않는 user이거나 signin상태가 아닙니다',
        404,
      );
    const rtmatches = await this.compareData(user.hashedRt, refresh_token);
    // 누군가 A유저의 refresh토큰을 탈취했을 때
    // A유저의 refresh를 재발급하면 여기에서 걸린다.
    // +) access는 탈취당해도 주기가 짧다.
    if (!rtmatches)
      throw new HttpException('refresh토큰이 일치하지 않습닏다', 404);

    // 15일보다 적게 남았을 경우 refresh token 갱신
    const now = new Date().getTime();
    const diff = refreshTokenData.exp * 1000 - now;
    if (diff < 1000 * 60 * 60 * 24 * 15) {
      refresh_token = await this.jwtService.signAsync(
        {
          userId: user.id,
          email: user.email,
          sub: 'refresh_token',
        },
        {
          secret: this.configService.get<string>('auth.refresh_token_secret'),
          expiresIn: '30d',
        },
      );
      await this.updateRtHash(user.id, refresh_token);
    }
    const access_token = await this.jwtService.signAsync(
      { userId: user.id, email: user.email, sub: 'access_token' },
      {
        secret: this.configService.get<string>('auth.access_token_secret'),
        expiresIn: '1h',
      },
    );
    this.setTokenCookie(res, { access_token, refresh_token });
    return user.id;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  compareData(hashedData: string, data: string) {
    return argon2.verify(hashedData, data);
  }

  async getTokens(userId: number, email: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email, sub: 'access_token' },
        {
          secret: this.configService.get<string>('auth.access_token_secret'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        { userId, email, sub: 'refresh_token' },
        {
          secret: this.configService.get<string>('auth.refresh_token_secret'),
          expiresIn: '30d',
        },
      ),
    ]);
    return { access_token, refresh_token };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    return this.userRepository.update({ id: userId }, { hashedRt: hash });
  }

  setTokenCookie(
    res: Response,
    tokens: { access_token: string; refresh_token: string },
  ) {
    res.cookie('access_token', tokens.access_token, {
      maxAge: 1000 * 60 * 60 * 1, // 1h
      httpOnly: true,
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30d
      httpOnly: true,
    });
  }

  clearTokenCookie(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

}
