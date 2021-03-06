import { Component, ViewChild, TemplateRef, Input, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ReuseStrategyService } from '../route/reuse-strategy';
import { Login } from '../login/login';
import { Cookie, UserRegions, GM } from '../../../common/api';
import { NzMessageService } from 'ng-zorro-antd';
import { LOGIN_PATH } from 'url-config';
import { Observable, observable } from 'rxjs';

interface FrameConfig {
  navi: Array<object>;
}

interface UserInfo {
  realName: string;
  id: string;
}

@Component({
  selector: 'frame1-component',
  templateUrl: './frame.component.html'
})
export class Fram1Component {
  @Input() GLOBAL_FRAME_CONFIG: FrameConfig;
  // 自定义收缩按钮
  @ViewChild('trigger') customTrigger: TemplateRef<void>;
  triggerTemplate = null;
  // 默认展开
  isCollapsed: Boolean = false;
  navi: Array<object> = [];
  tabs: Array<{ title: string, url: string }> = [];
  tabActiveIndex: Number = 0;
  // 用户信息
  userInfoRealName = new Observable();

  // 登录
  login = new Login(this.message);
  cookie = new Cookie();
  getUserInfo = new UserRegions(this.message);

  to(item) {
    // this.router.navigate([item.url]);
    this.router.navigateByUrl(item.url);
  }

  closeTab(url: string, event: Event) {
    event.preventDefault();
    // 当前关闭的是第几个路由
    const index = this.tabs.findIndex(p => p.url === url);
    // 如果只有一个不可以关闭
    if (this.tabs.length === 1) { return; }
    this.tabs = this.tabs.filter(p => p.url !== url);
    // 删除复用
    ReuseStrategyService.deleteRouteSnapshot(url);
    // 显示上一个选中
    let menu = this.tabs[index - 1];
    if (!menu) {// 如果上一个没有下一个选中
      menu = this.tabs[index];
    }
    // 显示当前路由信息
    // this.router.navigate([menu.url]);
    this.router.navigateByUrl(menu.url);
  }

  setUserInfo(that) {
    that.userInfoRealName = GM.get('userInfo').realName;
  }

  logout() {
    this.login.logout(LOGIN_PATH);
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private message: NzMessageService
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) { route = route.firstChild; }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe((event) => {
        // 路由data的标题
        let title = event['title'];
        let menu = { title: title, url: this.router.url };
        // this.titleService.setTitle(title);
        let exitMenuIndex = this.tabs.findIndex(info => info.title === title);
        if (exitMenuIndex !== -1) {// 如果存在不添加，当前表示选中
          this.tabActiveIndex = exitMenuIndex;
          return;
        }
        this.tabs.push(menu);
        this.tabActiveIndex = this.tabs.length - 1;
      });
  }

  ngOnInit() {
    this.navi = this.GLOBAL_FRAME_CONFIG.navi;
    this.triggerTemplate = this.customTrigger;
    // 验证登录
    let strToken = this.cookie.getCookie('clientCliToken');
    if (strToken) {
      this.login.isTokenValid(strToken, LOGIN_PATH);
    } else {
      this.login.logout(LOGIN_PATH);
    }
    this.getUserInfo.getUser(this.setUserInfo, this);
  }

}

