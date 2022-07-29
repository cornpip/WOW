<h1 align='center'>WOW: Wap of World</h1>
<p align="center">
    <img src="https://user-images.githubusercontent.com/75781414/166131265-be8c60b7-aa4f-4b06-bee6-ecb4a4cefccb.png" width=450>
</p>
<h3 align='center'>WAP 동아리 홈페이지를 만들어보자</h3>

## `Tech Stack`

### Back

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-235A97.svg?style=for-the-badge&logo=mysql&logoColor=white)
![TypeORM](https://img.shields.io/badge/typeORM-%2320232a.svg?style=for-the-badge&logo=typeorm&logoColor=%2361DAFB)
![AWS S3](https://img.shields.io/badge/AWS_S3-%569A31.svg?style=for-the-badge&logo=amazons3&logoColor=white)

### Front

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React 18](https://img.shields.io/badge/react_18-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=zustand&logoColor=%2361DAFB)

<br/><br/>

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

<br/><br/>