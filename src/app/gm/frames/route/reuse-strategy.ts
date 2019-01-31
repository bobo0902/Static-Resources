import { Injectable } from '@angular/core';
import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

interface IRouteConfigData {
  reuse: boolean;
}

interface ICachedRoute {
  handle: DetachedRouteHandle;
  data: IRouteConfigData;
}

@Injectable()
export class ReuseStrategyService implements RouteReuseStrategy {
  private static routeCache = new Map<string, ICachedRoute>();
  private static waitDelete: string; // 当前页未进行存储时需要删除
  private static currentDelete: string;  // 当前页存储过时需要删除

  /** 是否允许复用路由  这里根据判断data.shouldDetach是否复用 */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const data = this.getRouteData(route);
    if (data && data['shouldDetach']) {
      return true;
    }
    return false;
  }

  /**  当路由离开时会触发，存储路由 */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const url = this.getFullRouteUrl(route);
    const data = this.getRouteData(route);
    if (ReuseStrategyService.waitDelete && ReuseStrategyService.waitDelete === url) {
      // 如果待删除是当前路由，且未存储过则不存储快照
      ReuseStrategyService.waitDelete = null;
      return null;
    } else {
      // 如果待删除是当前路由，且存储过则不存储快照
      if (ReuseStrategyService.currentDelete && ReuseStrategyService.currentDelete === url) {
        ReuseStrategyService.currentDelete = null;
        return null;
      } else {
        ReuseStrategyService.routeCache.set(url, { handle, data });
        this.addRedirectsRecursively(route);
      }
    }
  }

  /** 是否允许还原路由 */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getFullRouteUrl(route);
    return ReuseStrategyService.routeCache.has(url);
  }

  /** 从缓存中获取快照，若无则返回null */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const url = this.getFullRouteUrl(route);
    const data = this.getRouteData(route);
    return data && ReuseStrategyService.routeCache.has(url)
      ? ReuseStrategyService.routeCache.get(url).handle
      : null;
  }

  /** 进入路由触发，是否同一路由时复用路由 */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
    const config = route.routeConfig;
    if (config) {
      if (!config.loadChildren) {
        const routeFirstChild = route.firstChild;
        const routeFirstChildUrl = routeFirstChild ? this.getRouteUrlPaths(routeFirstChild).join('/') : '';
        const childConfigs = config.children;
        if (childConfigs) {
          const childConfigWithRedirect = childConfigs.find(c => c.path === '' && !!c.redirectTo);
          if (childConfigWithRedirect) {
            childConfigWithRedirect.redirectTo = routeFirstChildUrl;
          }
        }
      }
      route.children.forEach(childRoute => this.addRedirectsRecursively(childRoute));
    }
  }

  private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
    return this.getFullRouteUrlPaths(route).filter(Boolean).join('/').replace('/', '_');
  }

  private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    const paths = this.getRouteUrlPaths(route);
    return route.parent ? [...this.getFullRouteUrlPaths(route.parent), ...paths] : paths;
  }

  private getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    return route.url.map(urlSegment => urlSegment.path);
  }

  private getRouteData(route: ActivatedRouteSnapshot): IRouteConfigData {
    return route.routeConfig && route.routeConfig.data as IRouteConfigData;
  }

  /** 用于删除路由快照*/
  // tslint:disable-next-line:member-ordering
  public static deleteRouteSnapshot(url: string): void {
    if (url[0] === '/') {
      url = url.substring(1);
    }
    url = url.replace('/', '_');
    if (ReuseStrategyService.routeCache.has(url)) {
      ReuseStrategyService.routeCache.delete(url);
      ReuseStrategyService.currentDelete = url;
    } else {
      ReuseStrategyService.waitDelete = url;
    }
  }
  constructor() { }
}
