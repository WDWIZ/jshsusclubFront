import Home from './home';
import Users from './users';
import Club from './club';
import Apply from './apply';
import Admin from './admin';
import Pick from './pick';
import NotFound from './404';

const pages = [
    { "id" : "home", "path" : "/", "subtitle" : "동아리", "comp" : Home },
    { "id" : "clubs", "path" : "/clubs", "subtitle" : "동아리 목록", "comp" : Club },
    { id: "apply", path: "/apply", subtitle: "동아리 신청", comp: Apply},
    { id: "pick", path: "/pick", subtitle: "동아리 관리", comp: Pick},
    { id: "admin", path: "/admin", subtitle: "관리자 계정", comp: Admin },
    { id: "users", path: "/users", subtitle: "Redirecting...", comp: Users},
    { "id" : "404", "path" : "*", "subtitle" : "404", "comp" : NotFound }
];

export default pages;