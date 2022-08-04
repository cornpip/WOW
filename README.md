<h1 align='center'>WOW: Wap of World</h1>
<h3 align='center'>동아리 홈페이지를 만들어보자</h3>  

<h3 align='center'><a href="https://github.com/pknu-wap/2022_1_WAP_WEP_TEAM7">wap repo</a></h3>  

### `Back`

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-235A97.svg?style=for-the-badge&logo=mysql&logoColor=white)
![TypeORM](https://img.shields.io/badge/typeORM-%2320232a.svg?style=for-the-badge&logo=typeorm&logoColor=%2361DAFB)
![AWS S3](https://img.shields.io/badge/AWS_S3-%569A31.svg?style=for-the-badge&logo=amazons3&logoColor=white)

### `Front`

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React 18](https://img.shields.io/badge/react_18-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=zustand&logoColor=%2361DAFB)

<br/>

## `Install & Execute`

### client/.env.local

```
VITE_APP_BASE_URL=http://localhost:8080
VITE_APP_AWS_S3_URL = https://<your bucket>.s3.ap-northeast-2.amazonaws.com/
```

### server/.env

```
SERVER_PORT=8080
CLIENT=http://localhost:3000

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=

ACCESS_TOKEN_SECRET=access-token_secret
REFRESH_TOKEN_SECRET=refresh-token_secret

GITHUB_ID=
GITHUB_SECRET=
GITHUB_REDIRECT_URI=http://localhost:8080/auth/github/callback

GOOGLE_ID=
GOOGLE_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8080/auth/google/callback

S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=ap-northeast-2
S3_BUCKET=
S3_PROFILE_BUCKET=

```

```
yarn add -g cocurrently && yarn start
```
or
```
npm install -g concurrently
npm run start_n
```

<br/>

## Main page
<img src=img/main.PNG>

<br/>

## Sign up
<img src=img/signup.PNG>

<br/>

## Write page
<img src=img/write.PNG>

<br/>

## Detail page
<img src=img/detail.PNG>

<br/>

## Mypage
<img src=img/mypage.PNG>

<br/><br/>

## Nest Js module 구조
__`entity`__ : TypeORM 은 저장소 디자인 패턴을 지원하므로 사용합니다. entity에서 테이블을 생성하고 관계를 정의합니다.  
__`controller`__ : 들어오는 요청의 경로와 응답을 설정합니다. 라우팅 기능을 담당합니다.  
__`service`__ : 비지니스 로직을 담당합니다.  
__`repository`__ : sql 관련 로직을 담당합니다.  

> 응답의 흐름 : __`controller -> service -> repository`__

<br/>

## ERD
<img src=img/erd.PNG>

<br/>

## TypeORM
__[article.repository.ts](https://github.com/cornpip/WOW/blob/master/server/src/article/repository/article.repository.ts)__
```
#1
const articles = this.createQueryBuilder('article')
    .orderBy('article.createdAt', 'DESC') //article 내림차순으로
    .addOrderBy('article.id', 'DESC') //같을 때 최근 순으로
    .leftJoin('article.user', 'user') 
    .leftJoinAndSelect('article.tagList', 'tag')
    .leftJoinAndSelect('article.images', 'article_image')
    .addSelect(['user.id', 'user.username', 'user.email'])
    .where('article.fk_user_id = :userId', { userId: userId })
    .loadRelationCountAndMap('article.comments_count', 'article.comments');
```

`leftJoin('article.조인할엔티티', '별칭')` : join 후 addSelect 또는 select 를 따로 해야한다.  
```
ex) user: User { id: 3, username: 'kim', email: 'chdnjf13752@naver.com' }
```
`leftJoinAndSelect('article.조인할엔티티', '별칭')` : join 후 select 까지 해준다. join한 테이블의 모든 컬럼을 select 한다.   

```
ex) tagList: [ [Tag], [Tag], [Tag], [Tag], [Tag], [Tag] ]

ex) user: User {
       id: 3,
       username: 'kim',
       email: 'chdnjf13752@naver.com',
       password: ...,
       hashedRt: ....,
       createdAt: 2022-07-29T16:24:50.593Z,
       updatedAt: 2022-07-30T13:28:07.000Z
    }
```
Many는 array로 One은 instance로 가져온다.  

`loadRelationCountAndMap('article.컬럼명', 'count할 엔티티')` : group by의 COUNT 함수 역할을 해준다.
```
ex) comments_count: 3
```
기본적으로 __#1__ 의 형태로 article의 목록을 받아오며 조건을 조정하여 tag별로, user별로, articleid별로, 순서별로 받아올 수 있다.  

```
#2
const article = this.createQueryBuilder('article')
    .where('article.id = :id', { id })
    .leftJoin('article.user', 'user')
    .addSelect(['user.id', 'user.username', 'user.email'])
    .leftJoinAndSelect('article.tagList', 'tag')
    .leftJoinAndSelect('article.comments', 'comments')
    .addOrderBy('comments.createdAt', 'DESC')
    .leftJoin('comments.user', 'comment_user')
    .addSelect([
    'comment_user.id',
    'comment_user.username',
    'comment_user.email',
    ])
    .leftJoinAndSelect('article.images', 'article_image');
```
__#2__ 와 같이 article.comments를 join하고 그 안에서 comments.user를 join할 수 있다.
```
ex)
   "comments": [
        {
            "id": 5,
            "text": "cc",
            "fk_user_id": 3,
            "fk_article_id": 3,
            "createdAt": "2022-07-31T08:51:27.982Z",
            "updatedAt": "2022-07-31T08:51:27.982Z",
            "user": { //comments안에서 user가 join됨
                "id": 3,
                "username": "kim",
                "email": "chdnjf13752@naver.com"
            }
        },
        ..
        ....
    ]
```

Query Builder가 아닌 다음과 같이 find option을 사용할 수도 있고
```
#3
  async findCommentsByArticleId(articleId: number): Promise<Comment[]> {
    return await this.find({
      where: { fk_article_id: articleId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }
```
EntityManager를 통해 sql문으로 실행할 수도 있다.  
__[tag.repository.ts](https://github.com/cornpip/WOW/blob/master/server/src/article/repository/tag.repository.ts)__
```
#4
const tagList = this.manager.query(
    `
    select tag.id, tag.name, articles_count from (
    select count(fk_article_id) as articles_count, fk_tag_id from article_tags
    inner join article on article.id = fk_article_id
        and article.fk_user_id = ?
    group by fk_tag_id
    ) as q inner join tag on q.fk_tag_id = tag.id
    order by articles_count desc
    `,
    [userId],
);
```
<br/>

## mypage에서 내가 쓴 글 태그별 Count
__[tag.repository.ts](https://github.com/cornpip/WOW/blob/master/server/src/article/repository/tag.repository.ts)__
```
select count(fk_article_id) as articles_count, fk_tag_id from article_tags
    inner join article 
    on article.id = fk_article_id and article.fk_user_id = ?
    group by fk_tag_id
```
결과 예시:  
|articles_count|fk_tag_id|
|---|---|
|1|3|
|2|4|
|1|6|
|2|10|
.....

```
select tag.id, tag.name, articles_count from (
    select count(fk_article_id) as articles_count, fk_tag_id from article_tags
        inner join article on article.id = fk_article_id
          and article.fk_user_id = ?
        group by fk_tag_id
    ) as q inner join tag on q.fk_tag_id = tag.id
    order by articles_count desc;
```
결과 예시:  
|id|name|articles_count|
|--|---|----|
|4|python|2|
|10|java|2|
|11|test|2|
|5|js|1|
...

결과적으로 user_id 넣으면 해당 user가 쓴 글들의 tag와 tag수 를 반환한다.  

<br>

## NestJs reqest lifecycle
<img src=img/reqlifecycle.PNG>

<br>

## 인증 전략
<img src=img/auth.PNG>

<br/>

__3__ : Access/refresh token 생성  
__[auth.service.ts](https://github.com/cornpip/WOW/blob/master/server/src/auth/service/auth.service.ts)__
```
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

```

<br/>

__4__ : hashedRt 저장  
__[auth.service.ts](https://github.com/cornpip/WOW/blob/master/server/src/auth/service/auth.service.ts)__
```
  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    return this.userRepository.update({ id: userId }, { hashedRt: hash });
  }
```
hashedRt는 현재 로그인되어있는 여부와 refresh token의 확인용으로 사용한다.

<br/>

__5__ : cookie 생성  
__[auth.service.ts](https://github.com/cornpip/WOW/blob/master/server/src/auth/service/auth.service.ts)__
```
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
```
<br/>

__7, 8__ : access token검증 및 만료시 재발급  
__[jwt-auth.middleware.ts](https://github.com/cornpip/WOW/blob/master/server/src/middleware/jwt-auth.middleware.ts)__
```
@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}
  async use(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const accessToken: string | undefined = req.cookies['access_token'];
    const refreshToken: string | undefined = req.cookies['refresh_token'];
    try {
      if (!accessToken) {
        throw new HttpException('액세스 토큰 없음', 401);
      }
      const accessTokenData = await this.jwtService.verify(accessToken, {
        secret: this.configService.get('auth.access_token_secret'),
      });
      req.userId = accessTokenData.userId;
      const diff = accessTokenData.exp * 1000 - new Date().getTime();

      if (diff < 1000 * 60 * 30 && refreshToken) {
        await this.authService.refresh(res, refreshToken);
      }
    } catch (e) {
      if (!refreshToken) return next();
      try {
        const userId = await this.authService.refresh(res, refreshToken);
        req.userId = userId;
      } catch (e) {}
    }
    return next();
  }
}
```
__[auth.service.ts](https://github.com/cornpip/WOW/blob/master/server/src/auth/service/auth.service.ts)__
```
  async refresh(res: Response, refresh_token: string) {
    const refreshTokenData = await this.jwtService.verify(refresh_token, {
      secret: this.configService.get('auth.refresh_token_secret'),
    });
    const user = await this.userRepository.findById(refreshTokenData.userId);

    if (!user || !user.hashedRt)
      throw new HttpException(
        '존재하지 않는 user이거나 signin상태가 아닙니다',
        404,
      );

    const rtmatches = await this.compareData(user.hashedRt, refresh_token);
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
```
미들웨어에서 access token여부를 검증하고 재발급할 기간이라면 refresh가 진행된다. 재발급은 refresh token의 user의 존재 여부를 확인하고 hashedRt와 refresh token의 일치 여부를 확인한 후 access token을 발급한다.
> hashedRt와 refresh token의 일치 확인은 refresh token이 탈취당했을 때, 탈취당한 유저의 refresh를 재발급하여 탈취자의 사용을 막기위함이다.

_refresh token도 정해진 기간에 해당하면 재발급한다._

<br/>

## SetMetadata, Guard
__[public.decorator.ts](https://github.com/cornpip/WOW/blob/master/server/src/common/decorator/public.decorator.ts)__
```
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);
```

```
ex)

  @Public()
  @Get('/')
  getAllArticles(@Query('cursor') cursor?: number) {
    return this.articleService.getAllArticles(cursor);
  }
```
위처럼 사용한다. getAllArticles 핸들러에 isPublic : true 인 meta data가 들어가 있다. _class에도 사용할 수 있다._

__[auth-guard.guard.ts](https://github.com/cornpip/WOW/blob/master/server/src/common/guard/auth-guard.guard.ts)__
```
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  public canActivate(context: ExecutionContext): boolean {
    // Public()이 클래스전체나 핸들러에 있을 경우 auth 건너 뜀
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    if (!req.userId) throw new HttpException('권한이 없습니다', 401);

    return true
  }
}
```
meta data에 접근은 @nestjs/core 에서 제공하는 Reflector를 사용한다. reflector는 2개의 인자로 meta data의 key와 context의 정보를 받는다.  
> context는 guard의 canActivate(), interceptor의 intercept() 와 같은 method에서 사용할 수 있다. + ( filters, createParamDecorator )   
_주의) ExecutionContext는 context가 아니다. context활용 유틸리티다. 즉 핸들러와 같은 곳에서 context 를 얻을 수 없다._

__[app.module.ts](https://github.com/cornpip/WOW/blob/master/server/src/app.module.ts)__
```
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
```
Guard를 전역으로 사용하고 있다. 모든 컨트롤러와 라우터 핸들러에 대해 실행된다. 즉 guard는 isPublic에 대한 metadata를 확인하고 true면 로그인 검증을 하지않고 metadata가 없다면 로그인 상태를 필요로 한다. _( 미들웨어 후에 가드가 동작한다 request life cycle참조 )_

<br/>

## Custom decorators
__[get-current-user-id.decorator.ts](https://github.com/cornpip/WOW/blob/master/server/src/common/decorator/get-current-user-id.decorator.ts)__
```
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number => {
    const req = context.switchToHttp().getRequest();
    return req.userId;
  },
);
```
__[auth.controller.ts](https://github.com/cornpip/WOW/blob/master/server/src/auth/controller/auth.controller.ts)__
```
ex)

  @Delete('/logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUserId() userId: number,
  ): Promise<void> {
    await this.authService.logout(userId);
    this.authService.clearTokenCookie(res);
  }
```