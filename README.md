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