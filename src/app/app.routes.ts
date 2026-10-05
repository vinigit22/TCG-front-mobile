import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Jogos } from './jogos/jogos';
import { Home } from './home/home';
import { Quemsomos } from './quemsomos/quemsomos';
import { Preco } from './preco/preco';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home,   title: 'Página Inicial'},
    { path: 'jogos', component: Jogos, title: 'Jogos'},
    { path: 'preco', component: Preco, title:'Preço'},
    { path: 'quem-somos', component: Quemsomos, title: 'Quem Somos'},
    { path: 'login', component: Login, title: 'Login'},
    { path: '**', redirectTo: 'home'}
];
