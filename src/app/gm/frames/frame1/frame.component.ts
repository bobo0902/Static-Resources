import { Component, ViewChild, TemplateRef, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ReuseStrategyService } from '../reuse-strategy';
import { Login } from '../shared/login';
import { Cookie, UserRegions } from '../../../common/api';

interface FrameConfig {
  navi: Array<object>;
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

  // 登录
  login = new Login();
  cookie = new Cookie();
  userInfo = new UserRegions();

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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
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
    // 临时登录
    let strToken = this.cookie.getCookie('clientCliToken');
    if (strToken) {
      this.login.isTokenValid(strToken);
    } else {
      this.login.login();
    }
    this.userInfo.getUser();
  }
}

