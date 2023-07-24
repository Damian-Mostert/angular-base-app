//in-view plugin, to handle in view scroll animations
export function InView(){
  //funtion to check if element is in view
  function isScrolledIntoView(el:any) {var rect = el.getBoundingClientRect();return (rect.top >= 0) && (rect.bottom <= el.parentElement.getBoundingClientRect().height)||(rect.left >= 0) && (rect.right <= el.parentElement.getBoundingClientRect().width)}
  //for each in view
  document.querySelectorAll("*[in-view]").forEach((element:any) => {
    //function to handle in view
    function handleInViews(){
      if(isScrolledIntoView(element))element.classList.add('inView')//add inView class
      else element.classList.remove('inView')//remove Inview class
    }
    //call
    handleInViews()
    //element parent on scroll
    element.parentElement.addEventListener('scroll',handleInViews);
  })
}
//click-menu,click-drop plugin
export function ClickMenus(){
  //create style element
  const styleElement:any = document.createElement('style');;
  styleElement.textContent = `
  /*click-menu styles*/
  *[click-menu] *[title]{cursor:pointer}
  *[click-menu] *[options].hidden{display: none}
  *[click-drop] *[title]{cursor:pointer}
  *[click-drop] *[options].hidden{display: none}
  `;
  //append style element
  document.head.appendChild(styleElement)
  //create arrays
  var click_menus:any=[];
  var click_drops:any=[];
  //add all in click menu array
  (document.querySelectorAll('*[click-menu]')||[]).forEach((menu:Element)=>click_menus.push({
    title:menu.querySelector('*[title]')as any,
    options:menu.querySelector('*[options]')as any,
  }));
  //add all in click drop array
  (document.querySelectorAll('*[click-drop]')||[]).forEach((menu:Element)=>click_drops.push({
    title:menu.querySelector('*[title]') as any,
    options:menu.querySelector('*[options]') as any,
  }))
  //add hidden class to all menus
  for (const menu of [...click_drops,...click_menus])menu.options?.classList.add('hidden')
  //window on click
  window.addEventListener('click',event=>{
    //handle click menus
    for (const menu of click_menus)
      if (menu?.title?.contains(event.target as Node) || menu?.options?.contains(event.target as Node))
        menu.options?.classList.remove('hidden')
      else if(!menu.options?.classList?.contains('hidden'))
        menu.options?.classList.add('hidden')
    //handle drop menus
    for (const menu of click_drops)
      if (menu?.title?.contains(event.target as Node) || menu?.options?.contains(event.target as Node))
        menu.options?.classList.remove('hidden')
  })
}
//hover-menu,absolute-hover-menu,hover-drop plugin
export function HoverMenus(){
  //create style element
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
  //append style Element
  var hover_menus:any=[];
  var hover_drops:any=[];
  //colect menus
  (document.querySelectorAll('*[hover-menu]')||[]).forEach((menu)=>hover_menus.push({
    title:menu.querySelector('*[title]'),
    options:menu.querySelector('*[options]')
  }));
  (document.querySelectorAll('*[hover-drop]')||[]).forEach((menu:Element)=>hover_drops.push({
    title:menu.querySelector('*[title]'),
    options:menu.querySelector('*[options]')
  }))
  //add hover listeners to all menus
  for (const menu of [...hover_menus,...hover_drops]){
    menu.title?.addEventListener("mouseover",() =>menu.options?.classList.remove('hidden'))
    menu.options?.classList.add('hidden')
  }
  //handle hover-menu clicks
  window.addEventListener('click',event=>{
    for (const menu of hover_menus)
      if (menu?.title?.contains(event.target) || menu?.options?.contains(event.target))
        menu.options?.classList.remove('hidden')
      else if(!menu.options?.classList?.contains('hidden'))
        menu.options?.classList.add('hidden')
  })
}
//enumaration to for global scroll direction
enum direction{
  Up,
  Down,
  Left,
  Right
}
//dir
var dir:direction
//scroll smoothly functions generated with Chat GPT
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
function scrollToClosestElementLeft(containerElement:any) {
  const containerRect = containerElement.getBoundingClientRect();
  const containerLeft = containerRect.left;
  const containerWidth = containerRect.width;
  let closestElement:any = null;
  let closestDistance = Number.MAX_SAFE_INTEGER;
  containerElement.querySelectorAll('*[scroll-stop], .full-slider-view').forEach((element:any) => {
    const boundingRect = element.getBoundingClientRect();
    const distanceToContainerLeft = boundingRect.left - containerLeft + boundingRect.width / 2;
    if (
      distanceToContainerLeft >= 0 &&
      distanceToContainerLeft < closestDistance &&
      distanceToContainerLeft <= containerWidth
    ) {
      closestElement = element;
      closestDistance = distanceToContainerLeft;
    }
  })
  if (closestElement)
    scrollToLeftSmoothly(
      containerElement,
      containerElement.scrollLeft + closestElement.getBoundingClientRect().left - containerRect.left,
      100
    )
}
//no-scrollbar.vertical-scroll,horozontal-scroll plugin
export function Scroll() {
  //create style Element
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
  `
  document.head.appendChild(styleElement)
  //appen style Element
  let prevScrollLeft = 0;
  let prevScrollTop = 0
  var T:any
  document.querySelectorAll('*[vertical-scroll],*[horozontal-scroll]').forEach(scrollContainer => {
    scrollContainer.scrollLeft = scrollContainer.scrollTop = 0
    scrollContainer.addEventListener('touchstart', handleTouchStart)
    scrollContainer.addEventListener('touchmove', handleTouchMoveVertical)
    scrollContainer.addEventListener('touchend', handleTouchEnd)
    scrollContainer.addEventListener('scroll',handleScroll);
  })
  document.querySelectorAll('*[horozontal-scroll]').forEach(scrollContainer => {
    scrollContainer.scrollLeft = scrollContainer.scrollTop = 0
    scrollContainer.addEventListener('wheel', handleScrollHorozontal)
    scrollContainer.addEventListener('touchmove', handleTouchMoveHorozontal)
  })
  document.querySelectorAll('*[vertical-scroll]').forEach(scrollContainer => {
    scrollContainer.scrollLeft = scrollContainer.scrollTop = 0
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
    container.scrollLeft+=100;
    dir = direction.Left
    if(t)clearTimeout(t)
    t = setTimeout(() => {
      handleStop(container)
    },500);
  }
  function handleLeft(container:any){
    container.scrollLeft-=100
    dir = direction.Right
    if(t)clearTimeout(t)
    t = setTimeout(() => {
      handleStop(container)
    },500);
  }
  function handleDown(container:any){
    dir = direction.Up
    if(t)clearTimeout(t)
    t = setTimeout(() => {
      handleStop(container)
    },500);
  }
  function handleUp(container:any){
    dir = direction.Down
    if(t)clearTimeout(t)
    t = setTimeout(() => {
      handleStop(container)
    },500);
  }
  let touchStartX:number = 0
  let touchStartY:number = 0
  function handleTouchStart(event:any) {
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
  function handleScroll(event:any) {
   const currentScrollLeft = event.target.scrollLeft;
   const currentScrollTop = event.target.scrollTop;
   if (currentScrollLeft > prevScrollLeft)
     dir = direction.Right
   else if (currentScrollLeft < prevScrollLeft)
     dir = direction.Left
   if (currentScrollTop > prevScrollTop)
     dir = direction.Up
   else if (currentScrollTop < prevScrollTop)
     dir = direction.Down
  if(T)clearTimeout(T)
   T = setTimeout(()=>{
     handleStop(event.target)
   },500)
   prevScrollLeft = currentScrollLeft;
   prevScrollTop = currentScrollTop
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
    const deltaY = event.deltaY;
    const scrollContainer = event.currentTarget
    if (deltaY < 0)
      handleDown(scrollContainer)
    else if (deltaY > 0)
      handleUp(scrollContainer)
  }
  function handleTouchMoveVertical(event:any) {
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
//slider plugin
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
    var timeout:any
    function tloop(){
      next_slide()
      timeout = setTimeout(tloop,Number(element.getAttribute('timeout')))
    }
    if(element.getAttribute('timeout')){
      timeout = setTimeout(tloop,Number(element.getAttribute('timeout')))
    }
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
      if(typeof timeout!="undefined"){
        clearTimeout(timeout)
        timeout = setTimeout(tloop,Number(element.getAttribute('timeout')))
      }
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
      if(typeof timeout!="undefined"){
        clearTimeout(timeout)
        timeout = setTimeout(tloop,Number(element.getAttribute('timeout')))
      }
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
//app-container plugin
//op functions
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
//function
export function BannerContainer(){
  //for each app conrainer
  (document.querySelectorAll('*[app-container]')||[]).forEach((element:any) => {
    const banner = element.querySelector("*[banner]")
    const app = element.querySelector("*[app]")
    const bannerConfStr = banner.getAttribute('banner')
    //defualt config
    const conf:any = {
      align:"top",
      height:"80px",
      small:{
        on:"1000",
        align:"top",
        height:"60px",
      }
    }
    //build config
    var sml_splited:any = bannerConfStr.split("small:")
    var c:any,small_c:any
    if(sml_splited?.[1]){
      c = sml_splited[0].split(',')
      small_c = sml_splited[1].split(',')
    }else c = sml_splited[0].split(',')
    if(c?.[0])conf.align = c?.[0]
    if(c?.[1])conf.height = c?.[1]
    if(small_c?.[0])conf.small.on = small_c?.[0]
    if(small_c?.[1])conf.small.align = small_c?.[1]
    if(small_c?.[2])conf.small.height = small_c?.[2]
    //function to set nurmal styles
    function SetNormal(){
      //clear styles
      banner.style.width = banner.style.height =banner.style.bottom = banner.style.right = banner.style.left = banner.style.top = app.style.width = app.style.height =app.style.top = app.style.bottom= app.style.left = app.style.right = null
      //set new styles
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
    //function to set small styles
    function SetSmall(){
      //clear styles
      banner.style.width = banner.style.height =banner.style.bottom = banner.style.right = banner.style.left = banner.style.top = app.style.width = app.style.height =app.style.top = app.style.bottom= app.style.left = app.style.right = null
      //set new styles
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
    //function to check window size and call correct style
    function Set(){
      if ((window.innerWidth <= Number(conf.small.on)))
        SetSmall()
      else
        SetNormal()
    }
    window.addEventListener('resize',Set);
    Set()
  })
}
//navigation-pane plugin
export function NavigationPanes(){
  //for each navigation-pane
  document.querySelectorAll('*[navigation-pane]').forEach((element:any) => {
    //get element navigation
    const navigation = element.querySelector('*[navigation]')
    const panes:any = Array.from(element.querySelector('*[panes]')?.children) || []
    var masterIndex:number = 0
    //get master index
    for(let i:number = 0;i<panes.length;i++)if(panes[i] === element.querySelector('*[master]'))masterIndex = i
    //set panes master
    panes.master = element.querySelector('*[master]')
    var IndexElements:any = []
    var x = 0
    //for each of navigation children
    Array.from(navigation.children).forEach((element:any) => {
      //if element has openIndex
      if(element.getAttribute('openIndex')){
        //add to IndexElements
        IndexElements.push(element)

        if(x == masterIndex)element.classList.add('activeIndex')

        //handle open nav
        element.addEventListener('click',()=>{
          IndexElements.forEach((element:any) => element.classList.remove('activeIndex')) // remove all active index classes
          element.classList.add('activeIndex')//add active index class to element
          for(let child of panes)child.hidden=true//hide all
          panes[element.getAttribute('openIndex')].hidden = false//show this index
        })

        x++
      }
    })
    for(let child of panes)child.hidden=true//hide all
    if(panes.master)panes.master.hidden = false//show master
  })
}
//box-pad,absolute-box-pad,fixed-box-pad plugin
export function BoxPad(){
  //for every box pad
  document.querySelectorAll('*[box-pad]').forEach((element:any) => {
    var inner_padding:any = element.getAttribute('box-pad')
    element.style.position = "relative"
    element.style.width = element.style.height = `calc(100% - calc(${inner_padding} * 2))`
    element.style.padding=inner_padding
  })
  //for every absolute-box-pad
  document.querySelectorAll('*[absolute-box-pad]').forEach((element:any) => {
    var inner_padding:any = element.getAttribute('absolute-box-pad')
    element.style.position = "absolute"
    element.style.width = element.style.height = `calc(100% - calc(${inner_padding} * 2))`
    element.style.padding=inner_padding
  })
  //for every fixed-box-pad
  document.querySelectorAll('*[fixed-box-pad]').forEach((element:any) => {
    var inner_padding:any = element.getAttribute('fixed-box-pad')
    element.style.position = "fixed"
    element.style.width = element.style.height = `calc(100% - calc(${inner_padding} * 2))`
    element.style.padding=inner_padding
  })
}
//box-mar,absolute-box-mar,fixed-box-mar plugin
export function BoxMar(){
  //for every box pad
  document.querySelectorAll('*[box-mar]').forEach((element:any) => {
    var inner_padding:any = element.getAttribute('box-mar')
    element.style.position = "relative"
    element.style.width = element.style.height = `calc(100% - calc(${inner_padding} * 2))`
    element.style.margin=inner_padding
  })
  //for every absolute-box-pad
  document.querySelectorAll('*[absolute-box-mar]').forEach((element:any) => {
    var inner_padding:any = element.getAttribute('absolute-box-mar')
    element.style.position = "absolute"
    element.style.width = element.style.height = `calc(100% - calc(${inner_padding} * 2))`
    element.style.margin=inner_padding
  })
  //for every fixed-box-pad
  document.querySelectorAll('*[fixed-box-mar]').forEach((element:any) => {
    var inner_padding:any = element.getAttribute('fixed-box-mar')
    element.style.position = "fixed"
    element.style.width = element.style.height = `calc(100% - calc(${inner_padding} * 2))`
    element.style.margin=inner_padding
  })
}
export default function Plugins(){ // to load all
  InView()
  ClickMenus()
  HoverMenus()
  Scroll()
  Sliders()
  BannerContainer()
  NavigationPanes()
  BoxPad()
  BoxMar()
}
