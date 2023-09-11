/// <reference types="react-scripts" />
declare namespace NodeJS {
    interface ProcessEnv {
        //types of envs
        NODE_ENV: 'development' | 'production' | 'test';
        PUBLIC_URL: string;
        API_URL: 'http://195.15.212.186:8000/api';
    }
}
