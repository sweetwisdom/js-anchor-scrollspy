class ScrollSpy {
  constructor(menu, options = {}) {
    // 检测是否存在menu 选择
    if (!menu) {
      throw new Error("First argument is query selector to your navigation.");
    }
    //   检测配置选项
    if (typeof options !== "object") {
      throw new Error("Second argument must be instance of Object.");
    }
    //   默认配置
    let defaultOptions = {
      sectionClass: ".scrollspy",
      menuActiveTarget: "li > a",
      offset: 0,
      hrefAttribute: "href",
      activeClass: "active",
      scrollContainer: "",
    };

    this.menuList = menu instanceof HTMLElement ? menu : document.querySelector(menu);
    //   方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。
    this.options = Object.assign({}, defaultOptions, options);

    if (this.options.scrollContainer) {
      this.scroller = this.options.scrollContainer instanceof HTMLElement ? this.options.scrollContainer : document.querySelector(this.options.scrollContainer);
    } else {
      this.scroller = window;
    }
    //   选择所有要滚动的元素
    this.sections = document.querySelectorAll(this.options.sectionClass);

    this.listen();
  }

  listen() {
    if (this.scroller) {
      this.scroller.addEventListener("scroll", () => this.onScroll());
    }
  }

  onScroll() {
    const section = this.getSectionInView();
    const menuItem = this.getMenuItemBySection(section);

    if (menuItem) {
      this.removeCurrentActive({ ignore: menuItem });
      this.setActive(menuItem);
    }
  }

  getMenuItemBySection(section) {
    if (!section) return;
    const sectionId = section.getAttribute("id");
    return this.menuList.querySelector(`[${this.options.hrefAttribute}="#${sectionId}"]`);
  }
  //   获取选择的section 的标签
  getSectionInView() {
    for (let i = 0; i < this.sections.length; i++) {
      const startAt = this.sections[i].offsetTop;
      const endAt = startAt + this.sections[i].offsetHeight;
      let currentPosition = (document.documentElement.scrollTop || document.body.scrollTop) + this.options.offset;

      if (this.options.scrollContainer && this.scroller) {
        currentPosition = this.scroller.scrollTop + this.options.offset;
      }

      const isInView = currentPosition > startAt && currentPosition <= endAt;
      if (isInView) return this.sections[i];
    }
  }

  setActive(activeItem) {
    const isActive = activeItem.classList.contains(this.options.activeClass);
    if (!isActive) activeItem.classList.add(this.options.activeClass);
  }

  removeCurrentActive({ ignore }) {
    const { hrefAttribute, menuActiveTarget, activeClass } = this.options;
    const items = `${menuActiveTarget}.${activeClass}:not([${hrefAttribute}="${ignore.getAttribute(hrefAttribute)}"])`;
    const menuItems = this.menuList.querySelectorAll(items);

    menuItems.forEach((item) => item.classList.remove(this.options.activeClass));
  }
  init() {
    window.onload = this.onScroll();
    window.addEventListener("scroll", () => this.onScroll());
  }
}
