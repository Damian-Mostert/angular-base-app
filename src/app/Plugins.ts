export function InView(){
  function isScrolledIntoView(el:any) {
    var rect = el.getBoundingClientRect();
    return (rect.top >= 0) && (rect.bottom <= el.parentElement.getBoundingClientRect().height)||(rect.left >= 0) && (rect.right <= el.parentElement.getBoundingClientRect().width)
  }
  document.querySelectorAll("*[in-view]").forEach((element:any) => {
    element.parentElement.addEventListener('wheel',()=> {
      if(isScrolledIntoView(element))element.hidden=false;
      else element.hidden=true
    })
  });
}
export function ClickMenus(){
  const styleElement:any = document.createElement('style');;
  styleElement.textContent = `
  /*click-menu styles*/
  *[click-menu] *[title]{cursor:pointer}
  *[click-menu] *[options].hidden{display: none}
  *[click-drop] *[title]{cursor:pointer}
  *[click-drop] *[options].hidden{display: none}
  `;
  document.head.appendChild(styleElement)
  var menus_listeners_array:{ title:Element|null;options:Element|null }[]=[];
  (document.querySelectorAll('*[click-menu]')||[]).forEach((menu:Element)=>menus_listeners_array.push({
    title:menu.querySelector('*[title]')as HTMLDivElement,
    options:menu.querySelector('*[options]')as HTMLDivElement
  }))
  for (const menu of menus_listeners_array)menu.options?.classList.add('hidden')
  window.addEventListener('click',event=>{
    for (const menu of menus_listeners_array)
      if (menu?.title?.contains(event.target as Node) || menu?.options?.contains(event.target as Node))
        menu.options?.classList.remove('hidden')
      else if(!menu.options?.classList?.contains('hidden'))
        menu.options?.classList.add('hidden')
  })
  var menus_listeners_array2:any=[];
  (document.querySelectorAll('*[click-drop]')||[]).forEach((menu:Element)=>menus_listeners_array2.push({
    title:menu.querySelector('*[title]') as HTMLDivElement,
    options:menu.querySelector('*[options]') as HTMLDivElement
  }))
  for (const menu of menus_listeners_array2)
    menu.options?.classList.add('hidden')
  window.addEventListener('click',(event:any)=>{
    for (const menu of menus_listeners_array2)
      if (menu?.title?.contains(event.target as Node) || menu?.options?.contains(event.target as Node))
        menu.options?.classList.remove('hidden')
  })
}
export function HoverMenus(){
  const styleElement = document.createElement('style');
  styleElement.textContent = `
  /*hover-menu styles*/
  *[hover-menu] *[title]{cursor:pointer}
  *[hover-menu] *[options].hidden{display: none}
  *[absolute-hover-menu]{}
  *[absolute-hover-menu] *[title]{cursor:pointer}
  *[absolute-hover-menu] *[options]{display: none}
  *[absolute-hover-menu]:hover *[options]{display:block}
  *[hover-drop] *[title]{cursor:pointer}
  *[hover-drop] *[options].hidden{display: none}
  `;
  document.head.appendChild(styleElement)
  var menus_listeners_array:any=[];
  (document.querySelectorAll('*[hover-menu]')||[]).forEach((menu)=>menus_listeners_array.push({
    title:menu.querySelector('*[title]'),
    options:menu.querySelector('*[options]')
  }))
  for (const menu of menus_listeners_array){
    menu.title?.addEventListener("mouseover",() =>menu.options?.classList.remove('hidden'))
    menu.options?.classList.add('hidden')
  }
  window.addEventListener('click',event=>{
    for (const menu of menus_listeners_array)
      if (menu?.title?.contains(event.target) || menu?.options?.contains(event.target))
        menu.options?.classList.remove('hidden')
      else if(!menu.options?.classList?.contains('hidden'))
        menu.options?.classList.add('hidden')
  })
  var menus_listeners_array3:any=[];
  (document.querySelectorAll('*[hover-drop]')||[]).forEach((menu:Element)=>menus_listeners_array3.push({
    title:menu.querySelector('*[title]'),
    options:menu.querySelector('*[options]')
  }))
  for (const menu of menus_listeners_array3){
    menu.title?.addEventListener("mouseover",() =>menu.options?.classList.remove('hidden'))
    menu.options?.classList.add('hidden')
  }
}
enum direction{
  Up,
  Down,
  Left,
  Right
}
function scrollToTopSmoothly(containerElement:any, targetTop:any, duration:any) {
  const startTop = containerElement.scrollTop;
  const distance = targetTop - startTop;
  const startTime = performance.now();
  function scrollStep(timestamp:any) {
    const currentTime = timestamp || performance.now();
    const elapsed = currentTime - startTime;
    const scrollProgress = Math.min(elapsed / duration, 1);
    const easing = easeInOutCubic(scrollProgress);
    const newScrollTop = startTop + distance * easing;
    containerElement.scrollTop = newScrollTop;
    if (elapsed < duration)
      window.requestAnimationFrame(scrollStep);
  }
  function easeInOutCubic(t:any) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
  window.requestAnimationFrame(scrollStep);
}
function scrollToClosestElementTop(containerElement:any) {
  const containerRect = containerElement.getBoundingClientRect();
  const containerTop = containerRect.top;
  const containerHeight = containerRect.height;
  let closestElement:any = null;
  let closestDistance = Number.MAX_SAFE_INTEGER;
  containerElement.querySelectorAll('*[scroll-stop] , .full-slider-view').forEach((element:any) => {
    const boundingRect = element.getBoundingClientRect()
    const distanceToContainerTop = boundingRect.top - containerTop + (boundingRect.height/2)
    if (distanceToContainerTop >= 0 && distanceToContainerTop < closestDistance && distanceToContainerTop <= containerHeight) {
      closestElement = element;
      closestDistance = distanceToContainerTop;
    }
  })
  if(closestElement)
    scrollToTopSmoothly(
      containerElement,
      containerElement.scrollTop + closestElement.getBoundingClientRect().top - containerRect.top,
      100
    )
}
function scrollToLeftSmoothly(containerElement:any, targetLeft:any, duration:any) {
  const startLeft = containerElement.scrollLeft;
  const distance = targetLeft - startLeft;
  const startTime = performance.now();
  function scrollStep(timestamp:any) {
    const currentTime = timestamp || performance.now();
    const elapsed = currentTime - startTime;
    const scrollProgress = Math.min(elapsed / duration, 1);
    const easing = easeInOutCubic(scrollProgress);
    const newScrollLeft = startLeft + distance * easing;
    containerElement.scrollLeft = newScrollLeft;
    if (elapsed < duration)
      window.requestAnimationFrame(scrollStep);
  }
  function easeInOutCubic(t:any) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
  window.requestAnimationFrame(scrollStep);
}
function scrollToClosestElementLeft(containerElement:any) {
  const containerRect = containerElement.getBoundingClientRect();
  const containerLeft = containerRect.left;
  const containerWidth = containerRect.width;
  let closestElement:any = null;
  let closestDistance = Number.MAX_SAFE_INTEGER;
  containerElement.querySelectorAll('*[scroll-stop] , .full-slider-view').forEach((element:any) => {
    const boundingRect = element.getBoundingClientRect()
    const distanceToContainerLeft = boundingRect.left - containerLeft + (boundingRect.width / 2)
    if (distanceToContainerLeft >= 0 && distanceToContainerLeft < closestDistance && distanceToContainerLeft <= containerWidth) {
      closestElement = element;
      closestDistance = distanceToContainerLeft;
    }
  })
  if(closestElement)
    scrollToLeftSmoothly(
      containerElement,
      containerElement.scrollLeft + closestElement.getBoundingClientRect().left - containerRect.left,
      100
    )
}
var dir:direction
export function Scroll() {
  const styleElement:any = document.createElement('style');;
  styleElement.textContent = `
    *[no-scrollbar]{
      scrollbar-width: thin;
      scrollbar-color: transparent transparent;
    }
    *[no-scrollbar]::-webkit-scrollbar {
      width:0;
    }
    *[no-scrollbar]::-webkit-scrollbar-track {
      background-color: transparent;
    }
    *[no-scrollbar]::-webkit-scrollbar-thumb {
      background-color: transparent;
    }
    *[vertical-scroll] {overflow-y: auto;}
    *[horozontal-scroll] {overflow-x: auto;white-space: nowrap;}
    *[horozontal] {display: inline-block;}
  `;
  document.head.appendChild(styleElement)
  document.querySelectorAll('*[vertical-scroll],*[horozontal-scroll]').forEach(scrollContainer => {
    scrollContainer.addEventListener('touchstart', handleTouchStart)
    scrollContainer.addEventListener('touchmove', handleTouchMoveVertical)
    scrollContainer.addEventListener('touchend', handleTouchEnd)
  })
  document.querySelectorAll('*[horozontal-scroll]').forEach(scrollContainer => {
    scrollContainer.addEventListener('wheel', handleScrollHorozontal)
    scrollContainer.addEventListener('touchmove', handleTouchMoveHorozontal)
  })
  document.querySelectorAll('*[vertical-scroll]').forEach(scrollContainer => {
    scrollContainer.addEventListener('wheel', handleScrollVertical)
    scrollContainer.addEventListener('touchmove', handleTouchMoveVertical)
  })
  var t:any
  function handleStop(container:any) {
    switch (dir) {
      case direction.Up:case direction.Down:
        scrollToClosestElementTop(container)
      break;
      case direction.Left:case direction.Right:
        scrollToClosestElementLeft(container)
      break;
    }
  }
  function handleRight(container:any){
    container.scrollLeft+=10;
    dir = direction.Left
    if(t)clearTimeout(t)
    t = setTimeout(() => {
      handleStop(container)
    },100);
  }
  function handleLeft(container:any){
    container.scrollLeft-=10
    dir = direction.Right
    if(t)clearTimeout(t)
    t = setTimeout(() => {
      handleStop(container)
    },100);
  }
  function handleDown(container:any){
    container.scrollTop-=10
    dir = direction.Up
    if(t)clearTimeout(t)
    t = setTimeout(() => {
      handleStop(container)
    },100);
  }
  function handleUp(container:any){
    container.scrollTop+=10
    dir = direction.Down
    if(t)clearTimeout(t)
    t = setTimeout(() => {
      handleStop(container)
    },100);
  }
  let touchStartX:number = 0
  let touchStartY:number = 0
  function handleTouchStart(event:any) {
    event.preventDefault()
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
  }
  var handleTouchEnd=(event:any)=>
    touchStartX=touchStartY=0
  function handleTouchMoveHorozontal(event:any) {
    event.preventDefault()
    const scrollContainer = event.currentTarget
    const touchX = event.touches[0].clientX
    const touchY = event.touches[0].clientY
    const deltaX = touchX - touchStartX
    const deltaY = touchY - touchStartY
    if (Math.abs(deltaX) > Math.abs(deltaY))
    if (deltaX > 0)
      handleRight(scrollContainer)
    else
      handleLeft(scrollContainer)
  }
  function handleScrollHorozontal(event:any) {
    event.preventDefault()
    const deltaY = event.deltaY;
    const scrollContainer = event.currentTarget
    if (deltaY < 0)
      handleRight(scrollContainer)
    else if (deltaY > 0)
      handleLeft(scrollContainer)
  }
  function handleScrollVertical(event:any) {
    event.preventDefault()
    const deltaY = event.deltaY;
    const scrollContainer = event.currentTarget
    if (deltaY < 0)
      handleDown(scrollContainer)
    else if (deltaY > 0)
      handleUp(scrollContainer)
  }
  function handleTouchMoveVertical(event:any) {
    event.preventDefault()
    const scrollContainer = event.currentTarget
    const touchX = event.touches[0].clientX
    const touchY = event.touches[0].clientY
    const deltaX = touchX - touchStartX
    const deltaY = touchY - touchStartY
    if (Math.abs(deltaX) > Math.abs(deltaY)){}else
      if (deltaY > 0)
        handleUp(scrollContainer)
      else
        handleDown(scrollContainer)
  }
}
export function Sliders(){
  const styleElement:any = document.createElement('style');;
  styleElement.textContent = `
    *[slider] *[vertical-view]{
      overflow-y:hidden;
    }
    *[slider] *[horozontal-view]{
      overflow-x: hidden;
      white-space: nowrap;
    }
    *[slider] .full-slider-view{
      width:100%;
      height:100%;
      position:relative;
    }
    *[slider] *[horozontal-view] .full-slider-view{
      display:inline-block;
    }
  `;
  document.head.appendChild(styleElement)
  document.querySelectorAll('*[slider]').forEach((element:any) => {
    const next_button:any = element?.querySelector('*[next]')
    const prev_button:any = element?.querySelector('*[prev]')
    const indexes:any = element?.querySelector('*[indexes]')
    var Index:number = 0
    var type = 'vertical'
    var view:any = element?.querySelector('*[vertical-view]')
    if(!view){
      view = element?.querySelector('*[horozontal-view]')
      type = 'horozontal'
    }
    function SetIndexus(index:number){
      Array.from(indexes?.children||[]).forEach((element:any,i:number) => {
        console.log(element)
        if(index == i)element.classList.add('activeIndex')
        else element.classList.remove('activeIndex')
      });
    }
    SetIndexus(0)
    view.scrollLeft = view.scrollTop = 0
    if(!view)
      throw new Error('slider requires horozontal-view or vertical-view')
    Array.from(view.children).forEach((element:any) => element.classList.add('full-slider-view'))
    var LEFT = 0
    var TOP = 0
    function next_slide() {
      if (type === 'vertical') {
        TOP += view.getBoundingClientRect().height;
        if (TOP < 0) TOP = 0;
        if (TOP > (view.getBoundingClientRect().height * view.children.length) - (view.getBoundingClientRect().height)) TOP = 0;
        scrollToTopSmoothly(view, TOP, 500);
        scrollToClosestElementTop(view);
        Index = TOP/view.getBoundingClientRect().height
      } else {
        LEFT += view.getBoundingClientRect().width;
        if (LEFT < 0) LEFT = 0;
        if (LEFT > (view.getBoundingClientRect().width * view.children.length) - (view.getBoundingClientRect().width)) LEFT = 0;
        scrollToLeftSmoothly(view, LEFT, 500);
        scrollToClosestElementLeft(view);
        Index = LEFT/view.getBoundingClientRect().width
      }
      SetIndexus(Index)
    }
    function prev_slide() {
      if (type === 'vertical') {
        TOP -= view.getBoundingClientRect().height;
        if (TOP < 0) TOP = (view.getBoundingClientRect().height * view.children.length) - (view.getBoundingClientRect().height);
        scrollToTopSmoothly(view, TOP, 500);
        scrollToClosestElementTop(view);
        Index = TOP/view.getBoundingClientRect().height
      } else {
        LEFT -= view.getBoundingClientRect().width;
        if (LEFT < 0) LEFT = (view.getBoundingClientRect().width * view.children.length) - (view.getBoundingClientRect().width);
        scrollToLeftSmoothly(view, LEFT, 500);
        scrollToClosestElementLeft(view);
        Index = LEFT/view.getBoundingClientRect().width
      }
      SetIndexus(Index)
    }

    function handleStop(container:any) {
      switch (dir) {
        case direction.Up: case direction.Left:
          prev_slide()
        break;
        case direction.Down:case direction.Right:
          next_slide()
        break;
      }
    }
    if(next_button)
      next_button.addEventListener('click',next_slide)
    if(prev_button)
      prev_button.addEventListener('click',prev_slide)
    var t:any
    function handleRight(container:any){
      container.scrollLeft-=10;
      dir = direction.Left
      if(t)clearTimeout(t)
      t = setTimeout(() => {
        handleStop(container)
      },100);
    }
    function handleLeft(container:any){
      container.scrollLeft+=10
      dir = direction.Right
      if(t)clearTimeout(t)
      t = setTimeout(() => {
        handleStop(container)
      },100);
    }
    function handleDown(container:any){
      container.scrollTop-=10
      dir = direction.Up
      if(t)clearTimeout(t)
      t = setTimeout(() => {
        handleStop(container)
      },100);
    }
    function handleUp(container:any){
      container.scrollTop+=10
      dir = direction.Down
      if(t)clearTimeout(t)
      t = setTimeout(() => {
        handleStop(container)
      },100);
    }
    let touchStartX:number = 0
    let touchStartY:number = 0
    function handleTouchStart(event:any) {
      event.preventDefault()
      touchStartX = event.touches[0].clientX
      touchStartY = event.touches[0].clientY
    }
    var handleTouchEnd=(event:any)=>
    touchStartX=touchStartY=0
    function handleTouchMoveHorozontal(event:any) {
      event.preventDefault()
      const scrollContainer = event.currentTarget
      const touchX = event.touches[0].clientX
      const touchY = event.touches[0].clientY
      const deltaX = touchX - touchStartX
      const deltaY = touchY - touchStartY
      if (Math.abs(deltaX) > Math.abs(deltaY))
      if (deltaX > 0)
      handleRight(scrollContainer)
      else
      handleLeft(scrollContainer)
    }
    function handleScrollHorozontal(event:any) {
      event.preventDefault()
      const deltaY = event.deltaY;
      const scrollContainer = event.currentTarget
      if (deltaY < 0)
      handleRight(scrollContainer)
      else if (deltaY > 0)
      handleLeft(scrollContainer)
    }
    function handleScrollVertical(event:any) {
      event.preventDefault()
      const deltaY = event.deltaY;
      const scrollContainer = event.currentTarget
      if (deltaY < 0)
      handleDown(scrollContainer)
      else if (deltaY > 0)
      handleUp(scrollContainer)
    }
    function handleTouchMoveVertical(event:any) {
      event.preventDefault()
      const scrollContainer = event.currentTarget
      const touchX = event.touches[0].clientX
      const touchY = event.touches[0].clientY
      const deltaX = touchX - touchStartX
      const deltaY = touchY - touchStartY
      if (Math.abs(deltaX) > Math.abs(deltaY)){}else
      if (deltaY > 0)
      handleUp(scrollContainer)
      else
      handleDown(scrollContainer)
    }
    if(element.getAttribute("wheel-nav")){
      view.addEventListener('wheel', handleScrollVertical)
      view.addEventListener('wheel', handleScrollHorozontal)
    }
    if(element.getAttribute("touch-nav")){
      view.addEventListener('touchstart', handleTouchStart)
      view.addEventListener('touchmove', handleTouchMoveVertical)
      view.addEventListener('touchend', handleTouchEnd)
      view.addEventListener('touchmove', handleTouchMoveHorozontal)
      view.addEventListener('touchmove', handleTouchMoveVertical)
    }
  })
}
export function BannerContainer(){
  (document.querySelectorAll('*[app-container]')||[]).forEach((element:any) => {
    const banner = element.querySelector("*[banner]")
    const app = element.querySelector("*[app]")
    const bannerConfStr = banner.getAttribute('banner')
    const conf:any = {
      align:"top",
      height:"80px",
      small:{
        on:"1000",
        align:"top",
        height:"60px",
      }
    }
    function get_op(t:any){
      if(t == 'top'||t == 'bottom')return'height'
      if(t == 'left'||t=='right')return'width'
      return''
    }
    function get_opi_op(t:any){
      if(t == 'top'||t == 'bottom')return'width'
      if(t == 'left'||t=='right')return'height'
      return''
    }
    var sml_splited:any = bannerConfStr.split("small:")
    var c:any
    var small_c:any
    if(sml_splited?.[1]){
      c = sml_splited[0].split(',')
      small_c = sml_splited[1].split(',')
    }else
      c = sml_splited[0].split(',')
    if(c?.[0])conf.align = c?.[0]
    if(c?.[1])conf.height = c?.[1]
    if(small_c?.[0])conf.small.on = small_c?.[0]
    if(small_c?.[1])conf.small.align = small_c?.[1]
    if(small_c?.[2])conf.small.height = small_c?.[2]
    function SetNormal(){
      banner.style.left = banner.style.top = app.style.top = app.style.top = null
      banner.style.position = "absolute"
      banner.style[conf.align] = "0"
      banner.style[get_op(conf.align)] = conf.height
      banner.style[get_opi_op(conf.align)] = "100%"
      app.style.position = "absolute"
      app.style[conf.align] = conf.height
      app.style[get_op(conf.align)] = `calc(100% - ${conf.height})`
      app.style[get_opi_op(conf.align)] = "100%"
      app.style.overflowX = "auto"
      app.style.overflowY = "auto"
    }
    function SetSmall(){
      banner.style.left = banner.style.top = app.style.top = app.style.top = null
      banner.style.position = "absolute"
      banner.style[conf.small.align] = "0"
      banner.style[get_op(conf.small.align)] = conf.small.height
      banner.style[get_opi_op(conf.small.align)] = "100%"
      app.style.position = "absolute"
      app.style[conf.small.align] = conf.small.height
      app.style[get_op(conf.small.align)] = `calc(100% - ${conf.small.height}`
      app.style[get_opi_op(conf.small.align)] = "100%"
      app.style.overflowX = "auto"
      app.style.overflowY = "auto"
    }
    function Set(){
      if ((window.innerWidth <= Number(conf.small.on)))
        SetSmall()
      else
        SetNormal()
    }
    window.addEventListener('resize',Set)
    Set()
  })
}
export function NavigationPanes(){
  document.querySelectorAll('*[navigation-pane]').forEach((element:any) => {
    const navControl = element.querySelector('*[navigation]')
    const children:any = Array.from(element.querySelector('*[panes]')?.children) || []
    children.master = element.querySelector('*[master]')
    Array.from(navControl.children).forEach((element:any) => {
      if(element.getAttribute('openIndex')){
        element.addEventListener('click',()=>{
          for(let child of children)child.hidden=true
          children[element.getAttribute('openIndex')].hidden = false
        })
      }
      for(let child of children)child.hidden=true
      if(children.master)children.master.hidden = false
    })
  })
}
export function BoxPad(){
  document.querySelectorAll('*[box-pad]').forEach((element:any) => {
    var inner_padding:any = element.getAttribute('box-pad')
    element.style = `
      position:relative;
      width:calc(100% - calc(${inner_padding}) * 2);
      height:calc(100% - calc(${inner_padding}) * 2);
      padding:${inner_padding};
    `
  })
  document.querySelectorAll('*[absolute-box-pad]').forEach((element:any) => {
    var inner_padding:any = element.getAttribute('absolute-box-pad')
    element.style = `
      position:absolute;
      width:calc(100% - calc(${inner_padding}) * 2);
      height:calc(100% - calc(${inner_padding}) * 2);
      padding:${inner_padding};
    `
  })
}
export default function Plugins(){
  InView()
  ClickMenus()
  HoverMenus()
  Scroll()
  Sliders()
  BannerContainer()
  NavigationPanes()
  BoxPad()
}
