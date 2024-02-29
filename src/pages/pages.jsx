import Home from './home';
import Users from './users';
import Club from './club';
import Admission from './admission';
import NotFound from './404';

const pages = [
    { "id" : "home", "path" : "/", "subtitle" : "동아리", "comp" : Home },
    { "id" : "club", "path" : "/clubs", "subtitle" : "동아리 목록", "comp" : Club },
    { id: "admission", path: "/admission", subtitle: "동아리 신입생 모집", comp: Admission},
    { id: "users", path: "/users", subtitle: "Redirecting...", comp: Users},
    { "id" : "404", "path" : "*", "subtitle" : "404", "comp" : NotFound }
];

export default pages;